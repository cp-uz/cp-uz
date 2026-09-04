"""Exercise the real release snapshot against SQLite WAL volumes in Docker."""

from __future__ import annotations

import os
import subprocess
import time
import unittest
import uuid
from types import SimpleNamespace

from release import Release

IMAGE = os.environ.get("CPUZ_TEST_CONTAINER_IMAGE")


@unittest.skipUnless(IMAGE, "Production container image required")
class ContainerSnapshotTests(unittest.TestCase):
    def test_snapshot_with_live_and_closed_wal_database(self):
        project = f"cpuz-snapshot-test-{uuid.uuid4().hex}"
        source_data, source_media = f"{project}-source-data", f"{project}-source-media"
        volumes = [
            source_data,
            source_media,
            *(f"{project}_{name}" for name in ("sqlite_data", "media_data", "static_data")),
        ]
        writer = f"{project}-writer"

        def run(*args):
            return subprocess.run(
                args, check=True, capture_output=True, text=True, timeout=60
            ).stdout.strip()

        try:
            for volume in volumes:
                run("docker", "volume", "create", volume)
            run(
                "docker", "run", "-d", "--name", writer, "--user", "root", "--entrypoint", "python",
                "--volume", f"{source_data}:/db", IMAGE, "-u", "-c",
                "import sqlite3,time; c=sqlite3.connect('/db/db.sqlite3'); "
                "c.execute('PRAGMA journal_mode=WAL'); "
                "c.execute('PRAGMA wal_autocheckpoint=0'); "
                "c.execute('CREATE TABLE fixture(value INTEGER)'); "
                "c.execute('INSERT INTO fixture VALUES (42)'); c.commit(); "
                "print('ready',flush=True); time.sleep(300)",
            )
            for _ in range(30):
                if "ready" in run("docker", "logs", writer):
                    break
                time.sleep(0.2)
            else:
                self.fail("WAL writer did not become ready")
            operation = SimpleNamespace(
                project=project,
                previous={"data_volume": source_data, "media_volume": source_media},
                images={"web": IMAGE},
                run=run,
            )
            for state in ("live", "closed"):
                with self.subTest(state=state):
                    if state == "closed":
                        run("docker", "stop", "--time", "1", writer)
                        run(
                            "docker", "run", "--rm", "--user", "root", "--entrypoint", "python",
                            "--volume", f"{source_data}:/db", IMAGE, "-c",
                            "import sqlite3; from pathlib import Path; "
                            "c=sqlite3.connect('/db/db.sqlite3'); "
                            "c.execute('PRAGMA wal_checkpoint(TRUNCATE)'); c.close(); "
                            "assert not Path('/db/db.sqlite3-shm').exists()",
                        )
                    Release.snapshot(operation)
                    run(
                        "docker", "run", "--rm", "--user", "root", "--entrypoint", "python",
                        "--volume", f"{source_data}:/source",
                        "--volume", f"{project}_sqlite_data:/target", IMAGE, "-c",
                        "import sqlite3; "
                        "connections=[sqlite3.connect('file:/'+p+'/db.sqlite3?mode=ro', "
                        "uri=True) for p in ('source','target')]; "
                        "assert all(c.execute('SELECT value FROM fixture').fetchall() "
                        "== [(42,)] for c in connections); "
                        "assert all(c.execute('PRAGMA quick_check').fetchone() "
                        "== ('ok',) for c in connections)",
                    )
        finally:
            subprocess.run(["docker", "rm", "-f", writer], capture_output=True, check=False)
            for volume in volumes:
                subprocess.run(
                    ["docker", "volume", "rm", volume], capture_output=True, check=False
                )
