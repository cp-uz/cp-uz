#!/usr/bin/env python3
from __future__ import annotations

import sqlite3
import sys
from pathlib import Path


def backup_sqlite(source_path: Path, target_path: Path) -> None:
    if target_path.exists():
        raise ValueError("Refusing to overwrite an existing SQLite backup")
    if not source_path.is_file() or source_path.stat().st_size == 0:
        raise ValueError("Persistent SQLite database is missing or empty")

    source = sqlite3.connect(f"file:{source_path.as_posix()}?mode=ro", uri=True)
    target = sqlite3.connect(target_path)
    try:
        if source.execute("PRAGMA quick_check").fetchone() != ("ok",):
            raise ValueError("Existing SQLite database failed quick_check")
        source.backup(target)
        if target.execute("PRAGMA quick_check").fetchone() != ("ok",):
            raise ValueError("SQLite backup failed quick_check")
    finally:
        target.close()
        source.close()


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(f"Usage: {argv[0]} SOURCE_DB TARGET_DB", file=sys.stderr)
        return 2
    try:
        backup_sqlite(Path(argv[1]), Path(argv[2]))
    except (OSError, sqlite3.Error, ValueError) as error:
        print(str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
