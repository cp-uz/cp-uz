"""Portable file, serialization, hash and Git operations for content tools."""

from __future__ import annotations

import hashlib
import json
import subprocess
from datetime import date, datetime
from pathlib import Path
from typing import Any

import yaml


def normalize_scalars(value: Any) -> Any:
    """Convert PyYAML date types into stable JSON-compatible strings."""

    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, dict):
        return {str(key): normalize_scalars(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize_scalars(item) for item in value]
    return value


def stable_json(value: Any) -> str:
    return (
        json.dumps(
            normalize_scalars(value),
            ensure_ascii=False,
            indent=2,
            sort_keys=True,
        )
        + "\n"
    )


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_text(value: str) -> str:
    return sha256_bytes(value.encode("utf-8"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8", newline="\n")


def run_git(checkout: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(checkout), *args],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return result.stdout.strip()


def git_value(checkout: Path, *args: str, fallback: str | None = None) -> str | None:
    try:
        return run_git(checkout, *args)
    except (OSError, subprocess.CalledProcessError):
        return fallback


def load_yaml(path: Path) -> Any:
    return normalize_scalars(yaml.safe_load(path.read_text(encoding="utf-8")))
