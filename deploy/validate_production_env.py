#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

SQLITE_DATABASE_URL = "sqlite:////app/data/db.sqlite3"


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for line_number, raw_line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            raise ValueError(f"Invalid .env line {line_number}: expected KEY=VALUE")
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not re.fullmatch(r"[A-Z][A-Z0-9_]*", key):
            raise ValueError(f"Invalid .env key on line {line_number}")
        if key in values:
            raise ValueError(f"Duplicate .env key: {key}")
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        values[key] = value
    return values


def validate_env(values: dict[str, str]) -> None:
    def required(name: str) -> str:
        value = values.get(name, "")
        if not value:
            raise ValueError(f"Missing required .env value: {name}")
        if "CHANGE_ME" in value:
            raise ValueError(f"Placeholder remains in .env: {name}")
        return value

    if required("DJANGO_SETTINGS_MODULE") != "core.settings.production":
        raise ValueError("DJANGO_SETTINGS_MODULE must be core.settings.production")
    if not re.fullmatch(r"[A-Za-z0-9_-]{50,}", required("DJANGO_SECRET_KEY")):
        raise ValueError("DJANGO_SECRET_KEY must be a 50+ character URL-safe value")
    if not re.fullmatch(
        r"gAAAAA[A-Za-z0-9_-]{80,}={0,2}", required("DISCORD_INVITE_URL_ENCRYPTED")
    ):
        raise ValueError("DISCORD_INVITE_URL_ENCRYPTED must be a Fernet token")
    if required("CPUZ_BIND_ADDRESS") != "127.0.0.1":
        raise ValueError("CPUZ_BIND_ADDRESS must remain 127.0.0.1 on the shared host")
    if required("CPUZ_HTTP_PORT") != "18181":
        raise ValueError("CPUZ_HTTP_PORT must remain 18181")

    allowed_hosts = {item.strip() for item in required("DJANGO_ALLOWED_HOSTS").split(",")}
    if not {"cp.uz", "www.cp.uz"}.issubset(allowed_hosts):
        raise ValueError("DJANGO_ALLOWED_HOSTS must contain cp.uz and www.cp.uz")
    trusted_origins = {item.strip() for item in required("DJANGO_CSRF_TRUSTED_ORIGINS").split(",")}
    if not {"https://cp.uz", "https://www.cp.uz"}.issubset(trusted_origins):
        raise ValueError("DJANGO_CSRF_TRUSTED_ORIGINS is missing a production origin")

    if required("DATABASE_URL") != SQLITE_DATABASE_URL:
        raise ValueError(f"DATABASE_URL must be exactly {SQLITE_DATABASE_URL}")
    if required("REDIS_URL") != "redis://redis:6379/1":
        raise ValueError("REDIS_URL must target the internal redis service")
    if any(key.startswith("POSTGRES_") and value for key, value in values.items()):
        raise ValueError("POSTGRES_* values are not used by the SQLite production topology")

    telegram_token = required("TELEGRAM_BOT_TOKEN")
    if not re.fullmatch(r"[0-9]+:[A-Za-z0-9_-]{30,}", telegram_token):
        raise ValueError("TELEGRAM_BOT_TOKEN format is invalid")
    if not re.fullmatch(r"-?[0-9]+", required("TELEGRAM_FEEDBACK_CHAT_ID")):
        raise ValueError("TELEGRAM_FEEDBACK_CHAT_ID must be an integer")
    if not re.fullmatch(r"[A-Za-z0-9_-]{32,256}", required("TELEGRAM_WEBHOOK_SECRET")):
        raise ValueError("TELEGRAM_WEBHOOK_SECRET must be a 32-256 character URL-safe value")

    for proxy_name in ("NPM_PROXY_URL", "TELEGRAM_PROXY_URL"):
        proxy_url = values.get(proxy_name, "").strip()
        if not proxy_url:
            continue
        parsed = urlsplit(proxy_url)
        try:
            port = parsed.port
        except ValueError as error:
            raise ValueError(f"{proxy_name} contains an invalid port") from error
        if (
            parsed.scheme not in {"http", "https"}
            or not parsed.hostname
            or port is None
            or parsed.query
            or parsed.fragment
            or parsed.path not in {"", "/"}
        ):
            raise ValueError(f"{proxy_name} must be an http(s) proxy URL with an explicit port")


def main(argv: list[str]) -> int:
    path = Path(argv[1]) if len(argv) > 1 else Path(".env")
    try:
        validate_env(load_env(path))
    except (OSError, UnicodeError, ValueError) as error:
        print(str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
