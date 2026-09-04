"""Promote isolated releases without migrating or overwriting the live database."""

from __future__ import annotations

import argparse
import json
import os
import re
import signal
import subprocess
import tempfile
from datetime import UTC, datetime
from pathlib import Path

from replace_cpuz_nginx_block import replace_cpuz_block
from validate_production_env import load_env, validate_env

SMOKE_ENDPOINTS = (
    "/healthz",
    "/",
    "/api/v1/health/",
    "/api/v1/seasons/current/",
    "/api/v1/problems/",
    "/api/v1/feedback/",
    "/algo",
    "/tasks",
    "/seasons",
    "/saved",
    "/roadmap",
    "/dict",
    "/login",
    "/profile",
    "/boot.css",
    "/loader-facts.js",
    "/llms.txt",
    "/assets/brand/cpuz-logo-96.webp",
)


def atomic_write(path, value):
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as output:
        temporary = Path(output.name)
        output.write(value.encode("utf-8"))
        output.flush()
        os.fsync(output.fileno())
    temporary.replace(path)


class Release:
    def __init__(self, root, directory, revision, host_config, run_command=None):
        self.root, self.directory = root, directory
        self.revision, self.host_config = revision, host_config
        self.run_command = run_command or subprocess.run
        self.active_path = root / ".release/active.json"
        self.previous = (
            json.loads(self.active_path.read_text()) if self.active_path.exists() else None
        )
        stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%S%fZ")
        self.run_dir = root / ".release/runs" / f"{stamp}-{revision[:12]}"
        self.run_dir.mkdir(parents=True, mode=0o700)
        self.project = f"cpuz_{revision[:12]}_{stamp.lower()}"
        self.port = 18182 if self.previous is None or self.previous["port"] == 18181 else 18181
        self.environment = {
            **os.environ,
            "CPUZ_ENV_FILE": str(root / ".env"),
            "CPUZ_RELEASE_TAG": revision,
            "CPUZ_HTTP_PORT": str(self.port),
            "CPUZ_BIND_ADDRESS": "127.0.0.1",
        }
        self.overlay = self.run_dir / "images.compose.json"
        self.nginx_original = host_config.read_text()
        (self.run_dir / "nginx.before.conf").write_text(self.nginx_original)
        self.stopped_previous = False
        self.maintenance = False
        self.committed = False
        self.active_changed = False
        self.activation_in_progress = False

    def run(self, *args, capture=False, input=None):
        result = self.run_command(
            list(args),
            check=True,
            text=True,
            capture_output=capture,
            env=self.environment,
            input=input,
        )
        return result.stdout.strip() if capture else ""

    def compose(self, *args, input=None):
        command = [
            "docker",
            "compose",
            "--project-directory",
            str(self.directory),
            "--env-file",
            str(self.root / ".env"),
            "-p",
            self.project,
            "-f",
            str(self.directory / "compose.yaml"),
        ]
        if self.overlay.exists():
            command.extend(("-f", str(self.overlay)))
        return self.run(*command, *args, input=input)

    def legacy_state(self):
        containers = self.run(
            "docker",
            "ps",
            "-aq",
            "--filter",
            "label=com.docker.compose.project=cpuz",
            capture=True,
        ).split()
        if not containers:
            # A database without a known owning deployment needs operator recovery.
            volumes = self.run("docker", "volume", "ls", "-q", capture=True).split()
            if "cpuz_sqlite_data" in volumes:
                raise RuntimeError(
                    "Legacy database exists without an owning container; refusing release"
                )
            return None
        details = json.loads(self.run("docker", "inspect", *containers, capture=True))
        services = {}
        for item in details:
            name = item["Config"]["Labels"].get("com.docker.compose.service")
            if name in {"web", "frontend"}:
                services[name] = item
        if set(services) != {"web", "frontend"}:
            raise RuntimeError("Incomplete legacy deployment; refusing automatic migration")
        mounts = {item["Destination"]: item.get("Name") for item in services["web"]["Mounts"]}
        if not mounts.get("/app/data") or not mounts.get("/app/media"):
            raise RuntimeError("Legacy data/media must use named volumes")
        return {
            "port": 18181,
            "containers": [item["Id"] for item in services.values()],
            "data_volume": mounts["/app/data"],
            "media_volume": mounts["/app/media"],
        }

    def build(self):
        images = {}
        for service in ("web", "frontend"):
            tag = f"cpuz-{service}:{self.revision}"
            found = self.run(
                "docker", "image", "ls", "--no-trunc", "--format", "{{.ID}}", tag, capture=True
            )
            if not found:
                self.compose("build", service)
            images[service] = self.run(
                "docker", "image", "inspect", "--format", "{{.Id}}", tag, capture=True
            )
        # Starting services always uses content-addressed images; moving a tag
        # cannot silently change this release or its rollback target.
        self.overlay.write_text(
            json.dumps(
                {"services": {service: {"image": image} for service, image in images.items()}}
            )
        )
        self.images = images

    def snapshot(self):
        for name in ("sqlite_data", "media_data", "static_data"):
            self.run("docker", "volume", "create", f"{self.project}_{name}")
        if not self.previous:
            return
        for mode, key, target in (
            ("database", "data_volume", "sqlite_data"),
            ("media", "media_volume", "media_data"),
        ):
            self.run(
                "docker",
                "run",
                "--rm",
                "--user",
                "root",
                "--entrypoint",
                "python",
                "--volume",
                f"{self.previous[key]}:/source:ro",
                "--volume",
                f"{self.project}_{target}:/target",
                self.images["web"],
                "/app/volume_snapshot.py",
                mode,
            )

    def prepare(self):
        self.compose("up", "-d", "--no-build", "--wait", "redis")
        fixture = self.root / ".release/local-db.json"
        if not self.previous and fixture.exists():
            if fixture.resolve() != fixture or not fixture.is_file():
                raise RuntimeError("Bootstrap fixture must be a regular root-owned file")
            payload = fixture.read_text(encoding="utf-8")
            if not isinstance(json.loads(payload), list):
                raise RuntimeError("Bootstrap fixture must contain a JSON list")
            self.compose(
                "run",
                "--rm",
                "--no-deps",
                "--entrypoint",
                "python",
                "web",
                "manage.py",
                "migrate",
                "--noinput",
            )
            self.compose(
                "run",
                "--rm",
                "--no-deps",
                "--entrypoint",
                "python",
                "web",
                "manage.py",
                "loaddata",
                "--format=json",
                "-",
                input=payload,
            )
        self.compose(
            "run", "--rm", "--no-deps", "--entrypoint", "sh", "web", "/app/prepare-content.sh"
        )
        self.compose("up", "-d", "--no-build", "--wait", "--wait-timeout", "180")

    def smoke(self, public=False):
        for endpoint in SMOKE_ENDPOINTS:
            command = [
                "curl",
                "--fail",
                "--silent",
                "--show-error",
                "--max-time",
                "15",
                "--output",
                "/dev/null",
                "--noproxy",
                "*",
            ]
            if public:
                command.extend(("--resolve", "cp.uz:443:127.0.0.1", f"https://cp.uz{endpoint}"))
            else:
                command.extend(("-H", "Host: cp.uz", f"http://127.0.0.1:{self.port}{endpoint}"))
            self.run(*command)

    def nginx(self, value, *, activating=False):
        atomic_write(self.host_config, value)
        self.run("nginx", "-t")
        if activating:
            self.activation_in_progress = True
        self.run("systemctl", "reload", "nginx")

    def candidate_config(self, maintenance=False):
        block = (self.directory / "deploy/nginx-host-cpuz.conf").read_text()
        block = block.replace("127.0.0.1:18181", f"127.0.0.1:{self.port}")
        if maintenance:
            block = block.replace(
                "    location / {",
                "    if ($remote_addr != 127.0.0.1) {\n"
                "        return 503;\n    }\n\n    location / {",
            )
        return replace_cpuz_block(self.nginx_original, block)

    def rollback(self):
        # Never restore a database after accepting public writes on the candidate.
        if self.committed:
            return
        failures = []
        try:
            self.compose("stop", "web", "frontend", "redis")
        except Exception as exc:
            failures.append(str(exc))
        old_ready = not self.stopped_previous
        if self.stopped_previous:
            try:
                self.run("docker", "start", *self.previous["containers"])
                self.run(
                    "curl",
                    "--fail",
                    "--silent",
                    "--show-error",
                    "--max-time",
                    "3",
                    "--retry",
                    "30",
                    "--retry-delay",
                    "1",
                    "--retry-all-errors",
                    "--output",
                    "/dev/null",
                    "--noproxy",
                    "*",
                    "-H",
                    "Host: cp.uz",
                    f"http://127.0.0.1:{self.previous['port']}/api/v1/health/",
                )
                old_ready = True
            except Exception as exc:
                failures.append(str(exc))
        if self.maintenance and old_ready:
            try:
                self.nginx(self.nginx_original)
            except Exception as exc:
                failures.append(str(exc))
        if self.active_changed:
            if self.previous:
                atomic_write(self.active_path, json.dumps(self.previous))
            else:
                self.active_path.unlink(missing_ok=True)
        if failures:
            raise RuntimeError(
                f"Rollback needs operator attention: {failures}; state: {self.run_dir}"
            )

    def execute(self):
        if self.previous is None:
            self.previous = self.legacy_state()
        try:
            self.build()
            self.snapshot()
            self.prepare()
            self.smoke()
            # Loopback-only traffic permits the exact TLS smoke before reopening
            # public writes. The previous DB remains untouched throughout.
            self.maintenance = True
            self.nginx(self.candidate_config(maintenance=True))
            if self.previous:
                self.stopped_previous = True
                self.run("docker", "stop", "--time", "30", *self.previous["containers"])
                self.compose("stop", "web", "frontend")
                self.snapshot()
                self.prepare()
                self.smoke()
            self.compose("exec", "-T", "web", "python", "manage.py", "configure_telegram_webhook")
            self.smoke(public=True)
            containers = self.run(
                "docker",
                "ps",
                "-q",
                "--filter",
                f"label=com.docker.compose.project={self.project}",
                "--filter",
                "label=com.docker.compose.service=web",
                capture=True,
            ).split()
            containers += self.run(
                "docker",
                "ps",
                "-q",
                "--filter",
                f"label=com.docker.compose.project={self.project}",
                "--filter",
                "label=com.docker.compose.service=frontend",
                capture=True,
            ).split()
            if len(containers) != 2:
                raise RuntimeError("Candidate web/frontend container inventory is incomplete")
            state = {
                "revision": self.revision,
                "directory": str(self.directory),
                "run_directory": str(self.run_dir),
                "images": self.images,
                "project": self.project,
                "port": self.port,
                "containers": containers,
                "data_volume": f"{self.project}_sqlite_data",
                "media_volume": f"{self.project}_media_data",
                "previous": self.previous,
            }
            self.active_changed = True
            atomic_write(self.active_path, json.dumps(state, indent=2))
            self.nginx(self.candidate_config(), activating=True)
            self.committed = True
        except BaseException as exc:
            if self.activation_in_progress:
                # Any failed reload has an ambiguous outcome: traffic may
                # already have written to the new schema. Preserve both versions
                # and the prepared active state for operator recovery.
                raise RuntimeError(
                    "Activation outcome uncertain; preserve candidate data and inspect "
                    f"{self.run_dir}"
                ) from exc
            self.rollback()
            raise
        print(f"Release {self.revision} active. Recovery state: {self.run_dir}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("revision")
    args = parser.parse_args()
    if os.geteuid() != 0 or not re.fullmatch("[a-f0-9]{40}", args.revision):
        raise SystemExit("Root and an exact lowercase 40-character revision are required")
    root = Path("/home/cp_uz")
    directory = root / ".release/releases" / args.revision
    if directory.resolve() != directory or not directory.is_dir():
        raise SystemExit("Immutable release directory missing or unsafe")
    validate_env(load_env(root / ".env"))
    os.umask(0o077)

    def interrupted(signum, _frame):
        raise SystemExit(f"Release interrupted by signal {signum}")

    for signum in (signal.SIGTERM, signal.SIGHUP):
        signal.signal(signum, interrupted)
    Release(root, directory, args.revision, Path("/home/nginx-non-kep.conf")).execute()


if __name__ == "__main__":
    main()
