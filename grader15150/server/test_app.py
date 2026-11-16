import base64
import csv
import io
import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from accounts import provision, read_ids
from app import create_app, grade, parse_results, read_uploads, run_container, save_meta
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


if __name__ == "__main__":
    unittest.main()
