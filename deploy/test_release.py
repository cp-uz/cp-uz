"""Failure injection for the deployment transaction; no real Docker or host changes."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

from release import Release

ROOT = Path(__file__).resolve().parents[1]


class FakeTools:
    def __init__(self, failure):
        self.failure = failure
        self.failed = False
        self.commands = []
        self.prepare_count = 0
        self.old_running = True
        self.old_database = "schema-v1:last-user-write"
        self.candidate_database = None

    def __call__(self, args, **kwargs):
        self.commands.append(args)
        output = ""
        fail = False
        if args[:3] == ["docker", "image", "ls"]:
            output = "" if self.failure == "image-build" else "sha256:existing"
        elif args[-2:] == ["build", "web"]:
            fail = self.failure == "image-build"
        elif args[:3] == ["docker", "image", "inspect"]:
            output = "sha256:" + args[-1].split(":")[0]
        elif args[:2] == ["docker", "ps"]:
            output = "new-web" if args[-1].endswith("=web") else "new-frontend"
        elif args[:2] == ["docker", "run"] and args[-1] == "database":
            self.candidate_database = self.old_database
        elif args[:2] == ["docker", "stop"]:
            self.old_running = False
        elif args[:2] == ["docker", "start"]:
            self.old_running = True
        elif args[-1:] == ["/app/prepare-content.sh"]:
            self.prepare_count += 1
            self.candidate_database += ":schema-v2"
            fail = self.failure == "final-import" and self.prepare_count == 2
        elif args[0] == "curl":
            is_public = args[-1].startswith("https://")
            fail = (self.failure == "candidate-smoke" and not is_public) or (
                self.failure == "tls-smoke" and is_public
            )
        elif args[:3] == ["systemctl", "reload", "nginx"]:
            reloads = sum(cmd[:3] == args[:3] for cmd in self.commands)
            fail = self.failure == "promotion-reload" and reloads == 2
        elif args == ["nginx", "-t"]:
            checks = sum(cmd == args for cmd in self.commands)
            fail = self.failure == "promotion-config" and checks == 2
        if fail and not self.failed:
            self.failed = True
            raise subprocess.CalledProcessError(1, args)
        return SimpleNamespace(stdout=output)


class ReleaseTransactionTests(unittest.TestCase):
    def run_release(self, failure):
        temporary = tempfile.TemporaryDirectory(prefix="cpuz-release-test-")
        self.addCleanup(temporary.cleanup)
        root = Path(temporary.name)
        release = root / ".release/releases" / ("a" * 40)
        (release / "deploy").mkdir(parents=True)
        template = (ROOT / "deploy/nginx-host-cpuz.conf").read_text()
        (release / "deploy/nginx-host-cpuz.conf").write_text(template)
        (release / "compose.yaml").write_text("services: {}\n")
        config = root / "nginx.conf"
        config.write_text(template)
        previous = {
            "port": 18181,
            "containers": ["old-web", "old-frontend"],
            "data_volume": "old-data",
            "media_volume": "old-media",
        }
        active = root / ".release/active.json"
        active.write_text(json.dumps(previous))
        fake = FakeTools(failure)
        operation = Release(root, release, "a" * 40, config, run_command=fake)
        return operation, fake, active, config, previous, template

    def test_failures_preserve_live_database_and_restore_previous_deployment(self):
        for failure in (
            "image-build",
            "candidate-smoke",
            "final-import",
            "tls-smoke",
            "promotion-config",
        ):
            with self.subTest(failure=failure):
                operation, fake, active, config, previous, template = self.run_release(failure)
                with self.assertRaises(subprocess.CalledProcessError):
                    operation.execute()
                self.assertEqual(fake.old_database, "schema-v1:last-user-write")
                self.assertTrue(fake.old_running)
                self.assertEqual(json.loads(active.read_text()), previous)
                self.assertEqual(config.read_text(), template)
                if failure == "candidate-smoke":
                    self.assertFalse(any(cmd[0] == "nginx" for cmd in fake.commands))

    def test_success_copies_latest_database_after_stopping_old_writers(self):
        operation, fake, active, config, _, _ = self.run_release(None)
        operation.execute()
        commands = fake.commands
        stop_index = next(i for i, cmd in enumerate(commands) if cmd[:2] == ["docker", "stop"])
        copies = [
            i
            for i, cmd in enumerate(commands)
            if cmd[:2] == ["docker", "run"] and cmd[-1] == "database"
        ]
        self.assertLess(copies[0], stop_index)
        self.assertGreater(copies[1], stop_index)
        self.assertEqual(fake.candidate_database, "schema-v1:last-user-write:schema-v2")
        self.assertEqual(fake.old_database, "schema-v1:last-user-write")
        self.assertEqual(json.loads(active.read_text())["port"], 18182)
        self.assertNotIn("return 503", config.read_text())
        self.assertFalse(fake.old_running)
        self.assertTrue(operation.committed)

    def test_shell_fake_tools_restore_old_service_after_final_import_failure(self):
        bash = shutil.which("bash")
        if not bash:
            git_bash = Path("C:/Program Files/Git/bin/bash.exe")
            bash = str(git_bash) if git_bash.is_file() else None
        if not bash:
            self.skipTest("Bash is required for the fake-tool shell boundary test")
        operation, _, active, config, previous, template = self.run_release("final-import")
        state = operation.root / "fake-tools.json"
        state.write_text(json.dumps(vars(FakeTools("final-import"))))
        driver = operation.root / "fake_tool.py"
        driver.write_text(
            "import json, os, sys\n"
            f"sys.path.insert(0, {str(ROOT / 'deploy')!r})\n"
            "from test_release import FakeTools\n"
            "from pathlib import Path\n"
            "path = Path(os.environ['CPUZ_FAKE_STATE'])\n"
            "tools = FakeTools(None)\n"
            "tools.__dict__.update(json.loads(path.read_text()))\n"
            "try:\n"
            "    print(tools(sys.argv[1:]).stdout)\n"
            "finally:\n"
            "    path.write_text(json.dumps(vars(tools)))\n",
            encoding="utf-8",
        )
        shell = operation.root / "fake_tool.sh"
        shell.write_text(
            '#!/bin/sh\nexec "$CPUZ_FAKE_PYTHON" "$CPUZ_FAKE_DRIVER" "$@"\n',
            encoding="utf-8",
            newline="\n",
        )

        def fake_shell(args, **kwargs):
            kwargs["capture_output"] = True
            kwargs["env"] = {
                **kwargs.get("env", os.environ),
                "CPUZ_FAKE_PYTHON": Path(sys.executable).as_posix(),
                "CPUZ_FAKE_DRIVER": driver.as_posix(),
                "CPUZ_FAKE_STATE": str(state),
                "MSYS2_ARG_CONV_EXCL": "*",
            }
            return subprocess.run([bash, shell.as_posix(), *args], **kwargs)

        operation.run_command = fake_shell
        with self.assertRaises(subprocess.CalledProcessError):
            operation.execute()
        result = json.loads(state.read_text())
        self.assertTrue(result["failed"])
        self.assertTrue(result["old_running"])
        self.assertEqual(result["old_database"], "schema-v1:last-user-write")
        self.assertEqual(json.loads(active.read_text()), previous)
        self.assertEqual(config.read_text(), template)

    def test_interrupted_activation_preserves_candidate_database_for_recovery(self):
        operation, fake, active, _, _, _ = self.run_release(None)

        def interrupted_reload(args, **kwargs):
            if args[:3] == ["systemctl", "reload", "nginx"]:
                count = sum(cmd[:3] == args[:3] for cmd in fake.commands)
                if count == 1:
                    raise KeyboardInterrupt()
            return fake(args, **kwargs)

        operation.run_command = interrupted_reload
        with self.assertRaisesRegex(RuntimeError, "Activation outcome uncertain"):
            operation.execute()
        self.assertEqual(json.loads(active.read_text())["port"], 18182)
        self.assertEqual(fake.candidate_database, "schema-v1:last-user-write:schema-v2")
        self.assertFalse(fake.old_running)

    def test_failed_activation_reload_preserves_candidate_after_possible_public_writes(self):
        operation, fake, active, _, _, _ = self.run_release("promotion-reload")
        with self.assertRaisesRegex(RuntimeError, "Activation outcome uncertain"):
            operation.execute()
        self.assertEqual(json.loads(active.read_text())["port"], 18182)
        self.assertEqual(fake.candidate_database, "schema-v1:last-user-write:schema-v2")
        self.assertFalse(fake.old_running)
        self.assertFalse(any(cmd[:2] == ["docker", "start"] for cmd in fake.commands))

    def test_failed_old_service_recovery_keeps_public_maintenance(self):
        operation, fake, _, config, _, _ = self.run_release("final-import")

        def failed_start(args, **kwargs):
            if args[:2] == ["docker", "start"]:
                raise subprocess.CalledProcessError(1, args)
            return fake(args, **kwargs)

        operation.run_command = failed_start
        with self.assertRaisesRegex(RuntimeError, "operator attention"):
            operation.execute()
        self.assertIn("return 503", config.read_text())
