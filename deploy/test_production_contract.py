from __future__ import annotations

import sqlite3
import tempfile
import unittest
from pathlib import Path

from backup_sqlite import backup_sqlite
from validate_production_env import SQLITE_DATABASE_URL, load_env, validate_env

ROOT = Path(__file__).resolve().parents[1]


def valid_environment() -> dict[str, str]:
    return {
        "DJANGO_SETTINGS_MODULE": "config.settings.production",
        "DJANGO_SECRET_KEY": "s" * 64,
        "DJANGO_ALLOWED_HOSTS": "cp.uz,www.cp.uz,localhost",
        "DJANGO_CSRF_TRUSTED_ORIGINS": "https://cp.uz,https://www.cp.uz",
        "CPUZ_BIND_ADDRESS": "127.0.0.1",
        "CPUZ_HTTP_PORT": "18181",
        "DATABASE_URL": SQLITE_DATABASE_URL,
        "REDIS_URL": "redis://redis:6379/1",
        "NPM_PROXY_URL": "",
        "TELEGRAM_BOT_TOKEN": "123456789:" + "a" * 35,
        "TELEGRAM_FEEDBACK_CHAT_ID": "1234567890",
        "TELEGRAM_WEBHOOK_SECRET": "s" * 40,
        "TELEGRAM_PROXY_URL": "",
    }


class ProductionEnvironmentTests(unittest.TestCase):
    def test_sqlite_environment_and_authenticated_proxy_are_accepted(self) -> None:
        values = valid_environment()
        values["NPM_PROXY_URL"] = "http://user:encoded-password@127.0.0.1:8000"
        validate_env(values)

    def test_postgres_values_are_rejected(self) -> None:
        values = valid_environment()
        values["POSTGRES_PASSWORD"] = "unused-secret"
        with self.assertRaisesRegex(ValueError, "POSTGRES"):
            validate_env(values)

    def test_database_path_is_pinned_to_persistent_volume(self) -> None:
        values = valid_environment()
        values["DATABASE_URL"] = "sqlite:////app/db.sqlite3"
        with self.assertRaisesRegex(ValueError, "/app/data/db.sqlite3"):
            validate_env(values)

    def test_proxy_requires_http_url_and_explicit_port(self) -> None:
        for proxy_name in ("NPM_PROXY_URL", "TELEGRAM_PROXY_URL"):
            for invalid in (
                "socks5://127.0.0.1:1080",
                "http://127.0.0.1",
                "http://127.0.0.1:8000/path",
                "http://127.0.0.1:8000#secret",
            ):
                with self.subTest(proxy_name=proxy_name, invalid=invalid):
                    values = valid_environment()
                    values[proxy_name] = invalid
                    with self.assertRaisesRegex(ValueError, proxy_name):
                        validate_env(values)

    def test_env_loader_rejects_duplicate_keys(self) -> None:
        with tempfile.TemporaryDirectory(prefix="cpuz-env-test-") as value:
            path = Path(value) / ".env"
            path.write_text("DATABASE_URL=one\nDATABASE_URL=two\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Duplicate"):
                load_env(path)

    def test_telegram_configuration_is_complete_and_well_formed(self) -> None:
        for key in (
            "TELEGRAM_BOT_TOKEN",
            "TELEGRAM_FEEDBACK_CHAT_ID",
            "TELEGRAM_WEBHOOK_SECRET",
        ):
            with self.subTest(key=key):
                values = valid_environment()
                values[key] = ""
                with self.assertRaisesRegex(ValueError, key):
                    validate_env(values)


class SQLiteBackupTests(unittest.TestCase):
    def test_online_backup_is_complete_and_does_not_mutate_source(self) -> None:
        with tempfile.TemporaryDirectory(prefix="cpuz-sqlite-backup-") as value:
            root = Path(value)
            source = root / "source.sqlite3"
            target = root / "target.sqlite3"
            connection = sqlite3.connect(source)
            connection.execute("CREATE TABLE article (id INTEGER PRIMARY KEY, title TEXT)")
            connection.executemany(
                "INSERT INTO article (title) VALUES (?)",
                [("BFS",), ("Segment Tree",), ("Dijkstra",)],
            )
            connection.commit()
            backup_sqlite(source, target)
            connection.close()

            restored = sqlite3.connect(target)
            self.assertEqual(
                restored.execute("SELECT title FROM article ORDER BY id").fetchall(),
                [("BFS",), ("Segment Tree",), ("Dijkstra",)],
            )
            self.assertEqual(restored.execute("PRAGMA quick_check").fetchone(), ("ok",))
            restored.close()

    def test_backup_refuses_to_overwrite_rollback_artifact(self) -> None:
        with tempfile.TemporaryDirectory(prefix="cpuz-sqlite-backup-") as value:
            root = Path(value)
            source = root / "source.sqlite3"
            target = root / "target.sqlite3"
            sqlite3.connect(source).close()
            target.write_bytes(b"preserve")
            with self.assertRaisesRegex(ValueError, "overwrite"):
                backup_sqlite(source, target)
            self.assertEqual(target.read_bytes(), b"preserve")


class ComposeContractTests(unittest.TestCase):
    def test_compose_uses_only_persistent_sqlite(self) -> None:
        compose = (ROOT / "compose.yaml").read_text(encoding="utf-8")
        self.assertNotIn("postgres", compose.casefold())
        self.assertNotIn("\n  db:\n", compose)
        self.assertIn("sqlite_data:/app/data", compose)
        self.assertIn("DATABASE_URL:-sqlite:////app/data/db.sqlite3", compose)

    def test_frontend_proxy_is_ephemeral_build_configuration(self) -> None:
        compose = (ROOT / "compose.yaml").read_text(encoding="utf-8")
        dockerfile = (ROOT / "deploy" / "frontend.Dockerfile").read_text(encoding="utf-8")
        self.assertIn("HTTP_PROXY: ${NPM_PROXY_URL:-}", compose)
        self.assertIn("HTTPS_PROXY: ${NPM_PROXY_URL:-}", compose)
        self.assertNotIn("ARG HTTP_PROXY", dockerfile)
        self.assertNotIn("ARG HTTPS_PROXY", dockerfile)
        self.assertNotIn("ENV HTTP_PROXY", dockerfile)
        self.assertNotIn("ENV HTTPS_PROXY", dockerfile)

    def test_frontend_public_assets_are_readable_under_restricted_checkout_umask(self) -> None:
        dockerfile = (ROOT / "deploy" / "frontend.Dockerfile").read_text(encoding="utf-8")
        copy_index = dockerfile.index("COPY --from=build /app/dist /usr/share/nginx/html")
        directory_mode_index = dockerfile.index(
            "find /usr/share/nginx/html -type d -exec chmod 0755"
        )
        file_mode_index = dockerfile.index(
            "find /usr/share/nginx/html -type f -exec chmod 0644"
        )
        self.assertIn(
            "find /usr/share/nginx/html -type d -exec chmod 0755",
            dockerfile,
        )
        self.assertIn(
            "find /usr/share/nginx/html -type f -exec chmod 0644",
            dockerfile,
        )
        self.assertLess(copy_index, directory_mode_index)
        self.assertLess(copy_index, file_mode_index)

    def test_frontend_serves_module_workers_as_javascript(self) -> None:
        nginx = (ROOT / "deploy" / "nginx-app.conf").read_text(encoding="utf-8")
        self.assertIn(r"location ~* \.mjs$", nginx)
        self.assertIn("default_type application/javascript", nginx)

    def test_both_nginx_layers_allow_the_five_megabyte_feedback_upload(self) -> None:
        host_nginx = (ROOT / "deploy" / "nginx-host-cpuz.conf").read_text(encoding="utf-8")
        app_nginx = (ROOT / "deploy" / "nginx-app.conf").read_text(encoding="utf-8")
        self.assertIn("client_max_body_size 8m;", host_nginx)
        self.assertIn("client_max_body_size 8m;", app_nginx)

    def test_release_smokes_boot_and_team_assets_before_and_after_cutover(self) -> None:
        release = (ROOT / "deploy" / "release-on-server.sh").read_text(encoding="utf-8")
        for path in (
            "/boot.css",
            "/loader-facts.js",
            "/assets/brand/cpuz-logo.png",
            "/assets/team/asadullo-ganiev.png",
            "/assets/team/dilshodbek-khujaev.png",
            "/assets/team/dilyorbek-valijanov.png",
            "/assets/team/ulugbek-abdimanabov.png",
        ):
            with self.subTest(path=path):
                self.assertIn(path, release)
        self.assertIn('for endpoint in "${SMOKE_ENDPOINTS[@]}"', release)

    def test_release_imports_and_smokes_canonical_season_data(self) -> None:
        release = (ROOT / "deploy" / "release-on-server.sh").read_text(encoding="utf-8")
        self.assertIn("python manage.py import_seasons", release)
        self.assertIn("/app/content/seasons", release)
        self.assertIn('"seasons": 2', release)
        self.assertIn('"events": 50', release)
        self.assertIn('"local_results": 73', release)
        self.assertIn("/api/v1/seasons/current/", release)
        self.assertIn("/seasons/2026-2027", release)

    def test_release_imports_and_smokes_canonical_problem_catalog(self) -> None:
        release = (ROOT / "deploy" / "release-on-server.sh").read_text(encoding="utf-8")
        self.assertIn("python manage.py import_problems", release)
        self.assertIn("/app/content/problems", release)
        self.assertIn('"problems": 35', release)
        self.assertIn('"links": 64', release)
        self.assertIn('"attachments": 12', release)
        self.assertIn('"statement_pdfs": 35', release)
        self.assertIn("/api/v1/problems/", release)
        self.assertIn(
            "/api/v1/problems/2025-2026/izho-2026/"
            "little-efnesh-and-monitor/statement.pdf",
            release,
        )
        self.assertIn("/tasks/2025-2026/ioi-2026-saralash-4/temir-rom", release)
        for route in (
            "/algo",
            "/article/algebra--binary-exp",
            "/tasks",
            "/seasons",
            "/saved",
            "/roadmap",
            "/dict",
            "/login",
            "/profile",
        ):
            self.assertIn(route, release)
        self.assertIn("/tasks/2025-2026/ioi-2026/ball-machine", release)
        self.assertIn("/tasks/2025-2026/egoi-2026/ferriswheel", release)
        self.assertIn(
            "/tasks/2025-2026/izho-2026/little-efnesh-and-monitor", release
        )
        self.assertIn("/tasks/2025-2026/apio-2026/apio-bike", release)

    def test_release_configures_telegram_webhook_and_smokes_feedback_endpoint(self) -> None:
        release = (ROOT / "deploy" / "release-on-server.sh").read_text(encoding="utf-8")
        self.assertIn("python manage.py configure_telegram_webhook", release)
        self.assertIn("/api/v1/feedback/", release)

    def test_release_backs_up_sqlite_and_never_invokes_postgres(self) -> None:
        release = (ROOT / "deploy" / "release-on-server.sh").read_text(encoding="utf-8")
        self.assertIn("cpuz_sqlite_data", release)
        self.assertIn("backup_sqlite.py", release)
        self.assertIn("sqlite.sqlite3", release)
        self.assertNotIn("pg_dump", release)
        self.assertNotIn("postgres.dump", release)

    def test_release_makes_only_the_canonical_content_tree_container_readable(self) -> None:
        release = (ROOT / "deploy" / "release-on-server.sh").read_text(encoding="utf-8")
        self.assertIn('realpath -e content', release)
        self.assertIn('find content -type l', release)
        self.assertIn('find content -type d -exec chmod 0755', release)
        self.assertIn('find content -type f -exec chmod 0644', release)


if __name__ == "__main__":
    unittest.main()
