import base64
import csv
import io
import json
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from accounts import provision, read_ids
from app import (
    IMAGE_GUARD,
    IMAGE_GUARD_LABEL,
    GraderInfrastructureError,
    create_app,
    grade,
    parse_results,
    protect_image,
    read_uploads,
    run_container,
    save_meta,
)
from werkzeug.security import generate_password_hash


class RosterTests(unittest.TestCase):
    def test_section_headers_grant_staff_admin_and_preserve_existing_codes(self):
        with tempfile.TemporaryDirectory() as value:
            root = Path(value)
            ids, roster = root / "ids.txt", root / "roster.csv"
            ids.write_text(
                "Staff:\ngreis\ndzk\n\nStudents:\nalleenao\n", encoding="utf-8"
            )
            accounts, created = provision(ids, roster, root / "codes.csv")
            self.assertEqual(created, 3)
            self.assertEqual(accounts["greis"]["role"], "admin")
            self.assertEqual(accounts["dzk"]["role"], "admin")
            self.assertEqual(accounts["alleenao"]["role"], "student")
            self.assertNotIn("staff:", accounts)
            original = accounts["greis"]["code_hash"]
            ids.write_text("Students:\ngreis\nnewstudent\n", encoding="utf-8")
            updated, created = provision(ids, roster, root / "new-codes.csv")
            self.assertEqual(created, 1)
            self.assertEqual(updated["greis"]["role"], "student")
            self.assertEqual(updated["greis"]["code_hash"], original)
            with (root / "new-codes.csv").open(newline="") as stream:
                self.assertEqual(
                    [row["username"] for row in csv.DictReader(stream)], ["newstudent"]
                )

    def test_rejects_duplicate_invalid_and_empty_username_lists(self):
        with tempfile.TemporaryDirectory() as value:
            path = Path(value) / "ids"
            for text in ("Staff:\na\nStudents:\na", "../root", "Staff:\n"):
                with self.subTest(text=text):
                    path.write_text(text, encoding="utf-8")
                    with self.assertRaises(ValueError):
                        read_ids(path)


class AppTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.code_hash = generate_password_hash("test-code", method="pbkdf2:sha256:1000")

    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.roster = self.root / "roster.csv"
        self.write_roster()
        self.app = create_app(
            {
                "TESTING": True,
                "SECRET_KEY": "test-only-" * 8,
                "ROSTER": str(self.roster),
                "DATA_DIR": str(self.root / "submissions"),
                "SESSION_COOKIE_PATH": "/",
                "MAX_SUBMISSIONS": 2,
            }
        )
        self.client = self.app.test_client()
        availability = patch("app.image_available", return_value=True)
        availability.start()
        self.addCleanup(availability.stop)

    def write_roster(self, staff_role="admin", code_hash=None):
        with self.roster.open("w", newline="", encoding="utf-8") as stream:
            writer = csv.DictWriter(
                stream, fieldnames=["username", "code_hash", "role"]
            )
            writer.writeheader()
            for username, role in (
                ("greis", staff_role),
                ("dzk", "admin"),
                ("alice", "student"),
                ("bob", "student"),
            ):
                writer.writerow(
                    {
                        "username": username,
                        "role": role,
                        "code_hash": code_hash or self.code_hash,
                    }
                )

    def token(self, client=None):
        client = client or self.client
        with client.session_transaction() as values:
            return values["csrf"]

    def login(self, username, client=None):
        client = client or self.client
        client.get("/login")
        return client.post(
            "/login",
            data={
                "username": username,
                "code": "test-code",
                "csrf": self.token(client),
            },
        )

    def meta(self, username="alice", number=1):
        sid = f"20261116-140000-{number:016x}"
        directory = self.root / "submissions" / sid
        (directory / "files").mkdir(parents=True)
        (directory / "files" / "punt.sml").write_text(
            "<script>alert(1)</script>", encoding="utf-8"
        )
        meta = {
            "id": sid,
            "student": username,
            "time": "2026-11-16 14:00:00",
            "files": ["punt.sml"],
            "status": "done",
            "results": {"score": 60, "tests": []},
        }
        save_meta(self.app, meta)
        return meta

    def upload(self):
        return self.client.post(
            "/submit",
            data={
                "csrf": self.token(),
                "files": [
                    (io.BytesIO(b"val x = 1"), "punt.sml"),
                    (io.BytesIO(b"val y = 2"), "boundedBreadthFirst.sml"),
                ],
            },
        )

    def test_both_staff_users_have_personal_admin_access(self):
        for username in ("greis", "dzk"):
            client = self.app.test_client()
            self.assertTrue(self.login(username, client).location.endswith("/admin"))
            response = client.get("/admin")
            self.assertEqual(response.status_code, 200)
            self.assertIn(username.encode(), response.data)
            self.assertIn(b"Admin", response.data)

    def test_student_cannot_access_admin_or_another_students_submission(self):
        alice, bob = self.meta(), self.meta("bob", 2)
        self.login("alice")
        self.assertEqual(self.client.get("/admin").status_code, 403)
        self.assertEqual(self.client.get(f"/s/{bob['id']}").status_code, 404)
        own = self.client.get(f"/s/{alice['id']}")
        self.assertEqual(own.status_code, 200)
        self.assertIn(b"&lt;script&gt;", own.data)
        self.assertNotIn(b"<script>alert", own.data)
        self.assertNotIn(b"bob", self.client.get("/").data)

    def test_admin_can_review_student_results_and_filter_by_username(self):
        alice, bob = self.meta(), self.meta("bob", 2)
        self.login("greis")
        self.assertEqual(self.client.get(f"/s/{bob['id']}").status_code, 200)
        filtered = self.client.get("/admin?student=alice").data
        self.assertIn(alice["id"].encode(), filtered)
        self.assertNotIn(bob["id"].encode(), filtered)

    def test_role_changes_and_code_resets_apply_to_existing_sessions(self):
        self.login("greis")
        self.write_roster(staff_role="student")
        self.assertEqual(self.client.get("/admin").status_code, 403)
        self.write_roster(code_hash="revoked")
        self.assertTrue(self.client.get("/").location.endswith("/login"))

    def test_csrf_required_for_login_submit_and_logout(self):
        self.client.get("/login")
        self.assertEqual(
            self.client.post(
                "/login", data={"username": "alice", "code": "test-code"}
            ).status_code,
            400,
        )
        self.login("alice")
        self.assertEqual(self.client.post("/submit").status_code, 400)
        self.assertEqual(self.client.post("/logout").status_code, 400)
        self.assertEqual(self.client.get("/logout").status_code, 405)

    def test_failed_logins_are_rate_limited(self):
        self.client.get("/login")
        for _ in range(10):
            self.assertEqual(
                self.client.post(
                    "/login",
                    data={"username": "alice", "code": "wrong", "csrf": self.token()},
                ).status_code,
                403,
            )
        self.assertEqual(
            self.client.post(
                "/login",
                data={"username": "alice", "code": "wrong", "csrf": self.token()},
            ).status_code,
            429,
        )

    def test_prefix_and_secure_private_cookie_headers(self):
        response = self.client.get(
            "/login",
            headers={
                "X-Forwarded-Prefix": "/grader15150",
                "X-Forwarded-Proto": "https",
            },
        )
        self.assertIn(b'action="/grader15150/login"', response.data)
        cookie = response.headers["Set-Cookie"]
        for expected in ("grader15150_session=", "Secure", "HttpOnly", "SameSite=Lax"):
            self.assertIn(expected, cookie)
        self.assertIn("no-store", response.headers["Cache-Control"])
        self.assertIn("noindex", response.headers["X-Robots-Tag"])

    def test_submission_limit_is_enforced_before_starting_a_container(self):
        self.meta()
        self.meta(number=2)
        self.login("alice")
        with patch("app.threading.Thread") as worker:
            self.assertEqual(self.upload().status_code, 429)
            worker.assert_not_called()

    def test_full_queue_does_not_consume_a_submission(self):
        self.login("alice")
        semaphore = self.app.extensions["grader"]["pending"]
        for _ in range(self.app.config["MAX_PENDING"]):
            semaphore.acquire()
        self.assertEqual(self.upload().status_code, 503)
        self.assertFalse(list((self.root / "submissions").glob("*/meta.json")))

    def test_upload_stores_sources_and_queues_background_grading(self):
        self.login("alice")
        with patch("app.threading.Thread") as worker:
            response = self.upload()
            self.assertEqual(response.status_code, 302)
            worker.return_value.start.assert_called_once()
        path = next((self.root / "submissions").glob("*/meta.json"))
        self.assertEqual(json.loads(path.read_text())["status"], "queued")
        self.assertEqual(
            (path.parent / "files" / "punt.sml").read_bytes(), b"val x = 1"
        )

    def test_worker_records_results_without_any_writable_host_mount(self):
        meta = self.meta()
        self.app.extensions["grader"]["pending"].acquire()
        fixture = b"CPUZ_GRADER_RESULTS:" + base64.b64encode(b'{"score":60,"tests":[]}')
        with patch("app.run_container", return_value=fixture) as runner:
            grade(self.app, meta)
        command = runner.call_args.args[0]
        for index, item in enumerate(command):
            if item == "-v":
                self.assertTrue(command[index + 1].endswith(":ro"))
        for option in (
            "--read-only",
            "--cap-drop",
            "--network",
            "--memory",
            "--pids-limit",
        ):
            self.assertIn(option, command)
        self.assertEqual(meta["status"], "done")
        self.assertEqual(meta["results"]["score"], 60)

    def test_missing_image_rejects_submission_without_spending_an_attempt(self):
        self.login("alice")
        with (
            patch("app.image_available", return_value=False),
            patch("app.threading.Thread") as worker,
        ):
            response = self.upload()
            self.assertEqual(response.status_code, 503)
            self.assertIn(b"No submission attempt was used", response.data)
            worker.assert_not_called()
        self.assertFalse(list((self.root / "submissions").glob("*/meta.json")))

    def test_health_fails_when_grading_image_is_missing(self):
        with patch("app.image_available", return_value=False):
            response = self.client.get("/health")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json["reason"], "grading_image_unavailable")

    def test_worker_infrastructure_failure_preserves_log_and_refunds_attempt(self):
        meta = self.meta()
        self.app.extensions["grader"]["pending"].acquire()
        error = GraderInfrastructureError(
            "Docker unavailable", b"docker: No such image"
        )
        with (
            patch("app.run_container", side_effect=error),
            self.assertLogs(self.app.logger),
        ):
            grade(self.app, meta)
        self.assertEqual(meta["status"], "error")
        self.assertEqual(meta["error_kind"], "infrastructure")
        self.assertFalse(meta["counts_toward_limit"])
        self.assertNotIn("compile", meta["error"])
        directory = self.root / "submissions" / meta["id"]
        self.assertEqual((directory / "log.txt").read_bytes(), error.output)
        self.login("alice")
        self.assertIn(b"0 / 2 submissions used", self.client.get("/").data)
        with patch("app.threading.Thread"):
            self.assertEqual(self.upload().status_code, 302)

    def test_regrading_excludes_refunded_errors_from_grader_metadata(self):
        failed = self.meta(number=1)
        failed.update(status="error", counts_toward_limit=False)
        save_meta(self.app, failed)
        meta = self.meta(number=2)
        self.app.extensions["grader"]["pending"].acquire()
        fixture = b"CPUZ_GRADER_RESULTS:" + base64.b64encode(b'{"score":60,"tests":[]}')
        with patch("app.run_container", return_value=fixture):
            grade(self.app, meta)
        path = self.root / "submissions" / meta["id"] / "metadata.json"
        self.assertEqual(json.loads(path.read_text())["previous_submissions"], [])

    def test_owner_can_retry_a_refunded_service_failure_only_once(self):
        meta = self.meta()
        meta.update(
            status="error", error_kind="infrastructure", counts_toward_limit=False
        )
        save_meta(self.app, meta)
        self.login("alice")
        route = f"/s/{meta['id']}/retry"
        self.assertIn(b"Retry grading", self.client.get(f"/s/{meta['id']}").data)
        with patch("app.threading.Thread") as worker:
            self.assertEqual(
                self.client.post(route, data={"csrf": self.token()}).status_code, 302
            )
            self.assertEqual(
                self.client.post(route, data={"csrf": self.token()}).status_code, 409
            )
            worker.return_value.start.assert_called_once()
        self.assertIn(b"0 / 2 submissions used", self.client.get("/").data)

    def test_retry_denies_foreign_submissions_and_code_errors(self):
        other = self.meta("bob", number=1)
        own = self.meta("alice", number=2)
        own.update(status="error", error_kind="execution")
        save_meta(self.app, own)
        self.login("alice")
        with patch("app.threading.Thread") as worker:
            self.assertEqual(
                self.client.post(
                    f"/s/{other['id']}/retry", data={"csrf": self.token()}
                ).status_code,
                404,
            )
            self.assertEqual(
                self.client.post(
                    f"/s/{own['id']}/retry", data={"csrf": self.token()}
                ).status_code,
                409,
            )
            worker.assert_not_called()


class UploadAndProcessTests(unittest.TestCase):
    def zipped(self, entries):
        from werkzeug.datastructures import FileStorage

        stream = io.BytesIO()
        with zipfile.ZipFile(stream, "w", zipfile.ZIP_DEFLATED) as archive:
            for name, contents in entries:
                archive.writestr(name, contents)
        stream.seek(0)
        return FileStorage(stream, filename="solution.zip")

    def test_nested_zip_is_read_without_extracting_paths(self):
        sources = read_uploads(
            [
                self.zipped(
                    [
                        ("../../punt.sml", "val x = 1"),
                        ("handin/boundedBreadthFirst.sml", "val x = 2"),
                    ]
                )
            ]
        )
        self.assertEqual(set(sources), {"punt.sml", "boundedBreadthFirst.sml"})

    def test_zip_bombs_duplicates_and_incomplete_submissions_are_rejected(self):
        for entries in (
            [("punt.sml", "x" * (3 * 1024**2))],
            [("one/punt.sml", "x"), ("two/punt.sml", "x")],
            [("punt.sml", "x")],
            [("extra.sml", "x")],
        ):
            with (
                self.subTest(names=[name for name, _ in entries]),
                self.assertRaises(ValueError),
            ):
                read_uploads([self.zipped(entries)])

    def test_container_is_removed_when_client_times_out(self):
        with (
            patch("app.remove_container") as remove,
            self.assertRaisesRegex(ValueError, "timed out"),
        ):
            run_container(
                [sys.executable, "-c", "import time; time.sleep(5)"],
                "grader-test",
                0.05,
            )
        remove.assert_called_once_with("grader-test")

    def test_container_output_is_bounded(self):
        with (
            patch("app.remove_container"),
            self.assertRaisesRegex(ValueError, "output limit"),
        ):
            run_container(
                [sys.executable, "-c", "import sys; sys.stdout.write('x' * 3000000)"],
                "grader-test",
                5,
            )

    def test_invalid_and_nonfinite_scores_are_rejected(self):
        for score in ("NaN", "Infinity", "61", "-1"):
            with self.subTest(score=score), self.assertRaises(ValueError):
                parse_results(
                    b"CPUZ_GRADER_RESULTS:"
                    + base64.b64encode(f'{{"score":{score}}}'.encode())
                )

    def test_docker_start_failure_is_infrastructure_error_and_keeps_output(self):
        with (
            patch("app.remove_container"),
            self.assertRaises(GraderInfrastructureError) as raised,
        ):
            run_container(
                [
                    sys.executable,
                    "-c",
                    "import sys; print('No such image'); sys.exit(125)",
                ],
                "grader-test",
                5,
            )
        self.assertIn(b"No such image", raised.exception.output)


class ImageGuardTests(unittest.TestCase):
    def app_config(self):
        from types import SimpleNamespace

        return SimpleNamespace(config={"IMAGE": "sha256:expected"})

    def test_creates_a_running_restricted_reference_for_image_pruning(self):
        responses = [
            subprocess.CompletedProcess([], 0, "sha256:expected\n"),
            subprocess.CompletedProcess([], 1, ""),
            subprocess.CompletedProcess([], 0, "guard-id"),
        ]
        with (
            patch("app.image_available", return_value=True),
            patch("app.subprocess.run", side_effect=responses) as run,
        ):
            protect_image(self.app_config())
        command = run.call_args.args[0]
        for expected in (
            "-d",
            "--read-only",
            "none",
            "16m",
            "unless-stopped",
            IMAGE_GUARD,
        ):
            self.assertIn(expected, command)
        self.assertIn(f"{IMAGE_GUARD_LABEL}=true", command)
        self.assertEqual(command[-2:], ["sha256:expected", "infinity"])

    def test_reuses_matching_running_guard(self):
        guard = {
            "Image": "sha256:expected",
            "Config": {"Labels": {IMAGE_GUARD_LABEL: "true"}},
            "State": {"Running": True},
        }
        with (
            patch("app.image_available", return_value=True),
            patch(
                "app.subprocess.run",
                side_effect=[
                    subprocess.CompletedProcess([], 0, "sha256:expected\n"),
                    subprocess.CompletedProcess([], 0, json.dumps([guard])),
                ],
            ) as run,
        ):
            protect_image(self.app_config())
        self.assertEqual(run.call_count, 2)

    def test_does_not_remove_an_unrelated_container_with_the_same_name(self):
        guard = {
            "Image": "sha256:other",
            "Config": {"Labels": None},
            "State": {"Running": True},
        }
        with (
            patch("app.image_available", return_value=True),
            patch(
                "app.subprocess.run",
                side_effect=[
                    subprocess.CompletedProcess([], 0, "sha256:expected\n"),
                    subprocess.CompletedProcess([], 0, json.dumps([guard])),
                ],
            ),
            patch("app.remove_container") as remove,
            self.assertRaises(GraderInfrastructureError),
        ):
            protect_image(self.app_config())
        remove.assert_not_called()


if __name__ == "__main__":
    unittest.main()
