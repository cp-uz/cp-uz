import argparse
import base64
import hashlib
import hmac
import io
import json
import math
import os
import re
import secrets
import subprocess
import threading
import time
import zipfile
from datetime import datetime, timedelta
from pathlib import Path, PurePosixPath
from zoneinfo import ZoneInfo

from accounts import provision, read_roster
from flask import Flask, abort, g, redirect, render_template, request, session, url_for
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.security import check_password_hash

REQUIRED_FILES = {"punt.sml", "boundedBreadthFirst.sml"}
RESULT_MARKER = b"CPUZ_GRADER_RESULTS:"
MAX_LOG_BYTES = 1024 * 1024
SID_PATTERN = re.compile(r"\d{8}-\d{6}-[a-f0-9]{16}")


def submissions(app, username=None):
    result = []
    for path in Path(app.config["DATA_DIR"]).glob("*/meta.json"):
        meta = json.loads(path.read_text(encoding="utf-8"))
        if username is None or meta["student"] == username:
            result.append(meta)
    return sorted(result, key=lambda item: item["id"], reverse=True)


def save_meta(app, meta):
    path = Path(app.config["DATA_DIR"]) / meta["id"] / "meta.json"
    temporary = path.with_suffix(f".{threading.get_ident()}.tmp")
    temporary.write_text(json.dumps(meta), encoding="utf-8")
    temporary.replace(path)


def remove_container(name):
    subprocess.run(
        ["docker", "rm", "-f", name], capture_output=True, timeout=20, check=False
    )


def run_container(command, name, timeout):
    output = bytearray()
    overflow = threading.Event()
    process = subprocess.Popen(
        command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT
    )

    def collect():
        while chunk := process.stdout.read(8192):
            room = MAX_LOG_BYTES - len(output)
            output.extend(chunk[:room])
            if len(chunk) > room:
                overflow.set()
                process.kill()
                break

    reader = threading.Thread(target=collect, daemon=True)
    reader.start()
    try:
        process.wait(timeout=timeout)
        if overflow.is_set():
            raise ValueError("The submission exceeded the grader output limit.")
    except subprocess.TimeoutExpired as error:
        process.kill()
        raise ValueError(
            f"The autograder timed out after {timeout} seconds."
        ) from error
    finally:
        # Killing the Docker client alone does not stop its container.
        try:
            remove_container(name)
        finally:
            process.wait(timeout=10)
            reader.join(timeout=10)
            process.stdout.close()
    return bytes(output)


def parse_results(output):
    encoded = next(
        (
            line[len(RESULT_MARKER) :]
            for line in reversed(output.splitlines())
            if line.startswith(RESULT_MARKER)
        ),
        None,
    )
    if encoded is None:
        raise ValueError(
            "The autograder produced no results. Check that your files compile."
        )
    results = json.loads(base64.b64decode(encoded, validate=True))
    score = float(results["score"])
    if not math.isfinite(score) or not 0 <= score <= 60:
        raise ValueError("The autograder produced an invalid score.")
    tests = results.get("tests", [])
    if not isinstance(tests, list) or len(tests) > 100:
        raise ValueError("The autograder produced invalid test results.")
    results["score"] = score
    results["max_score"] = 60
    results["tests"] = tests
    return results


def grade(app, meta):
    state = app.extensions["grader"]
    name = f"grader15150-{meta['id']}"
    directory = Path(app.config["DATA_DIR"]) / meta["id"]
    try:
        with state["slots"]:
            meta["status"] = "running"
            save_meta(app, meta)
            command = [
                "docker",
                "run",
                "--rm",
                "--name",
                name,
                "--label",
                "app=cpuz-grader15150",
                "--network",
                "none",
                "--memory",
                "1g",
                "--memory-swap",
                "1g",
                "--cpus",
                "1",
                "--pids-limit",
                "128",
                "--cap-drop",
                "ALL",
                "--security-opt",
                "no-new-privileges",
                "--read-only",
                "--user",
                "65534:65534",
                "--log-driver",
                "none",
                "--tmpfs",
                "/work:rw,nosuid,size=192m,mode=1777",
                "--tmpfs",
                "/tmp:rw,nosuid,size=32m,mode=1777",
                "-v",
                f"{directory / 'files'}:/autograder/submission:ro",
                "-v",
                f"{directory / 'metadata.json'}:/autograder/submission_metadata.json:ro",
                "-e",
                f"MAX_SUBMISSIONS={app.config['MAX_SUBMISSIONS']}",
                app.config["IMAGE"],
            ]
            output = run_container(command, name, app.config["GRADE_TIMEOUT"])
            log = b"\n".join(
                line
                for line in output.splitlines()
                if not line.startswith(RESULT_MARKER)
            )
            (directory / "log.txt").write_bytes(log)
            meta.update(status="done", results=parse_results(output))
    except Exception as error:
        app.logger.exception("Grading failed for %s", meta["id"])
        message = (
            str(error)
            if isinstance(error, ValueError)
            else "The grader failed. Contact staff."
        )
        meta.update(status="error", error=message)
    finally:
        save_meta(app, meta)
        state["pending"].release()


def read_uploads(files):
    sources = {}

    def add(name, data):
        if name not in REQUIRED_FILES:
            raise ValueError("Only punt.sml and boundedBreadthFirst.sml are accepted.")
        if name in sources:
            raise ValueError(f"Duplicate file: {name}.")
        if not data or len(data) > 1024 * 1024:
            raise ValueError("Each source file must contain between 1 byte and 1 MiB.")
        sources[name] = data

    for upload in files:
        name = upload.filename or ""
        if name.lower().endswith(".zip"):
            try:
                with zipfile.ZipFile(io.BytesIO(upload.read())) as archive:
                    entries = archive.infolist()
                    if (
                        len(entries) > 100
                        or sum(info.file_size for info in entries) > 2 * 1024**2
                    ):
                        raise ValueError(
                            "The ZIP exceeds the extraction limit of 2 MiB / 100 files."
                        )
                    for info in entries:
                        base = PurePosixPath(info.filename.replace("\\", "/")).name
                        if (
                            info.is_dir()
                            or base.startswith("._")
                            or "__MACOSX/" in info.filename
                        ):
                            continue
                        if base.endswith(".sml"):
                            add(base, archive.read(info))
            except (zipfile.BadZipFile, RuntimeError, NotImplementedError) as error:
                raise ValueError("Upload a valid, unencrypted ZIP file.") from error
        elif name:
            add(name, upload.read())
    if set(sources) != REQUIRED_FILES:
        raise ValueError("Upload both punt.sml and boundedBreadthFirst.sml.")
    return sources


def create_app(config=None):
    app = Flask(__name__)
    root = Path(__file__).resolve().parents[1]
    app.config.update(
        SECRET_KEY=os.environ.get("SECRET_KEY"),
        DATA_DIR=os.environ.get("DATA_DIR", str(root / "data/submissions")),
        ROSTER=os.environ.get("ROSTER", str(root / "data/roster.csv")),
        IMAGE=os.environ.get("IMAGE", "cpuz-hw09-autograder"),
        MAX_SUBMISSIONS=int(os.environ.get("MAX_SUBMISSIONS", "5")),
        MAX_PARALLEL=int(os.environ.get("MAX_PARALLEL", "2")),
        MAX_PENDING=int(os.environ.get("MAX_PENDING", "20")),
        GRADE_TIMEOUT=int(os.environ.get("GRADE_TIMEOUT", "300")),
        MAX_CONTENT_LENGTH=2 * 1024 * 1024,
        SESSION_COOKIE_NAME="grader15150_session",
        SESSION_COOKIE_PATH=os.environ.get("COOKIE_PATH", "/grader15150"),
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        PERMANENT_SESSION_LIFETIME=timedelta(hours=12),
    )
    if config:
        app.config.update(config)
    if not app.secret_key or len(app.secret_key) < 32:
        raise ValueError("Set a persistent SECRET_KEY of at least 32 characters")
    for key in ("MAX_SUBMISSIONS", "MAX_PARALLEL", "MAX_PENDING", "GRADE_TIMEOUT"):
        if app.config[key] < 1:
            raise ValueError(f"{key} must be positive")
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_prefix=1)
    Path(app.config["DATA_DIR"]).mkdir(parents=True, exist_ok=True)
    state = app.extensions["grader"] = {
        "lock": threading.Lock(),
        "slots": threading.BoundedSemaphore(app.config["MAX_PARALLEL"]),
        "pending": threading.BoundedSemaphore(app.config["MAX_PENDING"]),
        "attempts": {},
    }

    @app.before_request
    def authenticate_and_check_csrf():
        g.account = None
        username = session.get("username")
        if username:
            account = read_roster(app.config["ROSTER"]).get(username)
            version = (
                hashlib.sha256(account["code_hash"].encode()).hexdigest()
                if account
                else ""
            )
            if account and hmac.compare_digest(
                version, session.get("auth_version", "")
            ):
                g.account = account
            else:
                session.clear()
        session.setdefault("csrf", secrets.token_urlsafe(32))
        if request.method == "POST" and not hmac.compare_digest(
            request.form.get("csrf", ""), session["csrf"]
        ):
            abort(400, "Your form expired. Reload the page and try again.")

    @app.after_request
    def private_responses(response):
        response.headers["Cache-Control"] = "no-store, private"
        response.headers["X-Robots-Tag"] = "noindex, nofollow"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "same-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; style-src 'self' 'unsafe-inline'; "
            "form-action 'self'; frame-ancestors 'none'; base-uri 'none'"
        )
        return response

    @app.context_processor
    def template_context():
        return {
            "max_subs": app.config["MAX_SUBMISSIONS"],
            "required_files": sorted(REQUIRED_FILES),
        }

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "GET":
            return render_template("login.html")
        username = request.form.get("username", "").strip().lower()
        code = request.form.get("code", "").strip()
        address = request.remote_addr or "unknown"
        now = time.monotonic()
        with state["lock"]:
            state["attempts"] = {
                key: [at for at in attempts if now - at < 300]
                for key, attempts in state["attempts"].items()
                if attempts and now - attempts[-1] < 300
            }
            attempts = state["attempts"].setdefault(address, [])
            if len(attempts) >= 10:
                return render_template(
                    "login.html", error="Too many attempts. Try in 5 minutes."
                ), 429
            attempts.append(now)
        account = read_roster(app.config["ROSTER"]).get(username)
        if (
            account
            and len(code) <= 200
            and check_password_hash(account["code_hash"], code)
        ):
            session.clear()
            session.update(
                username=username,
                auth_version=hashlib.sha256(account["code_hash"].encode()).hexdigest(),
                csrf=secrets.token_urlsafe(32),
            )
            session.permanent = True
            with state["lock"]:
                state["attempts"].pop(address, None)
            return redirect(url_for("admin" if account["role"] == "admin" else "index"))
        return render_template(
            "login.html", error="Wrong username or access code."
        ), 403

    @app.post("/logout")
    def logout():
        session.clear()
        return redirect(url_for("login"))

    @app.get("/")
    def index():
        if not g.account:
            return redirect(url_for("login"))
        return render_template(
            "index.html", subs=submissions(app, g.account["username"])
        )

    @app.get("/admin")
    def admin():
        if not g.account:
            return redirect(url_for("login"))
        if g.account["role"] != "admin":
            abort(403)
        selected = request.args.get("student", "")
        accounts = read_roster(app.config["ROSTER"])
        return render_template(
            "admin.html",
            subs=submissions(app, selected or None),
            accounts=accounts,
            selected=selected,
        )

    @app.post("/submit")
    def submit():
        if not g.account:
            return redirect(url_for("login"))
        username = g.account["username"]

        def error(message, status=400):
            return render_template(
                "index.html", subs=submissions(app, username), error=message
            ), status

        try:
            sources = read_uploads(request.files.getlist("files"))
        except ValueError as exception:
            return error(str(exception))
        with state["lock"]:
            previous = submissions(app, username)
            if len(previous) >= app.config["MAX_SUBMISSIONS"]:
                return error(
                    "Maximum number of submissions reached. Contact staff.", 429
                )
            if not state["pending"].acquire(blocking=False):
                return error("The grader queue is full. Try again shortly.", 503)
            sid = datetime.now(ZoneInfo("Asia/Tashkent")).strftime("%Y%m%d-%H%M%S-")
            sid += secrets.token_hex(8)
            directory = Path(app.config["DATA_DIR"]) / sid
            try:
                (directory / "files").mkdir(parents=True, mode=0o755)
                for name, source in sources.items():
                    path = directory / "files" / name
                    path.write_bytes(source)
                    path.chmod(0o644)
                (directory / "files").chmod(0o755)
                metadata = directory / "metadata.json"
                metadata.write_text(
                    json.dumps(
                        {
                            "previous_submissions": [
                                {"submission_time": item["time"]} for item in previous
                            ]
                        }
                    ),
                    encoding="utf-8",
                )
                metadata.chmod(0o644)
                meta = {
                    "id": sid,
                    "student": username,
                    "time": datetime.now(ZoneInfo("Asia/Tashkent")).strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),
                    "files": sorted(sources),
                    "status": "queued",
                }
                save_meta(app, meta)
                threading.Thread(target=grade, args=(app, meta), daemon=True).start()
            except Exception:
                state["pending"].release()
                raise
        return redirect(url_for("show", sid=sid))

    @app.get("/s/<sid>")
    def show(sid):
        if not g.account or not SID_PATTERN.fullmatch(sid):
            abort(404)
        directory = Path(app.config["DATA_DIR"]) / sid
        path = directory / "meta.json"
        if not path.exists():
            abort(404)
        meta = json.loads(path.read_text(encoding="utf-8"))
        if g.account["role"] != "admin" and meta["student"] != g.account["username"]:
            abort(404)
        sources = [
            (
                name,
                (directory / "files" / name).read_text(
                    encoding="utf-8", errors="replace"
                ),
            )
            for name in sorted(REQUIRED_FILES)
            if (directory / "files" / name).exists()
        ]
        log_path = directory / "log.txt"
        log = (
            log_path.read_text(encoding="utf-8", errors="replace")
            if (g.account["role"] == "admin" and log_path.exists())
            else ""
        )
        return render_template("result.html", m=meta, sources=sources, log=log)

    @app.errorhandler(413)
    def too_large(_error):
        return render_template("error.html", message="The upload limit is 2 MiB."), 413

    @app.get("/health")
    def health():
        if not read_roster(app.config["ROSTER"]):
            return {"status": "not_ready"}, 503
        return {"status": "ok"}

    return app


def recover(app):
    result = subprocess.run(
        ["docker", "ps", "-aq", "--filter", "label=app=cpuz-grader15150"],
        capture_output=True,
        text=True,
        timeout=20,
        check=True,
    )
    for container_id in result.stdout.split():
        remove_container(container_id)
    for meta in submissions(app):
        if meta["status"] in {"queued", "running"}:
            meta.update(
                status="error",
                error="Grading was interrupted by a service restart. Contact staff.",
            )
            save_meta(app, meta)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)
    roster_command = commands.add_parser("make-roster")
    roster_command.add_argument("ids")
    roster_command.add_argument("--roster", required=True)
    roster_command.add_argument("--credentials", required=True)
    commands.add_parser("recover")
    commands.add_parser("serve")
    args = parser.parse_args()
    if args.command == "make-roster":
        accounts, created = provision(args.ids, args.roster, args.credentials)
        admins = sum(row["role"] == "admin" for row in accounts.values())
        print(
            f"{len(accounts)} accounts ({admins} admins); {created} new access codes exported."
        )
    elif args.command == "recover":
        recover(create_app())
    else:
        create_app({"SESSION_COOKIE_SECURE": False, "SESSION_COOKIE_PATH": "/"}).run(
            host="127.0.0.1", port=8150, threaded=True
        )
