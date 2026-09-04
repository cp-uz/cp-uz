"""Copy a release volume while retaining the previous release for rollback.

Invoked in a one-shot container, with source read-only and target writable.
Only the database online-backup operation may run while the source is serving.
"""

from __future__ import annotations

import os
import pwd
import shutil
import sys
from pathlib import Path

from backup_sqlite import backup_sqlite


def main(mode):
    source, target = Path("/source"), Path("/target")
    if mode == "database":
        candidate = target / "candidate.sqlite3"
        candidate.unlink(missing_ok=True)
        backup_sqlite(source / "db.sqlite3", candidate)
        for suffix in ("-wal", "-shm"):
            (target / f"db.sqlite3{suffix}").unlink(missing_ok=True)
        candidate.replace(target / "db.sqlite3")
    elif mode == "media":
        if any(path.is_symlink() for path in source.rglob("*")):
            raise ValueError("Media snapshots must not contain symbolic links")
        # Re-cloning after old writers stop must also reflect deleted files.
        # This exact target is the isolated candidate mount, never the source.
        if target.resolve() != target:
            raise ValueError("Candidate media target resolved unexpectedly")
        for child in target.iterdir():
            if child.is_dir() and not child.is_symlink():
                shutil.rmtree(child)
            else:
                child.unlink()
        shutil.copytree(source, target, dirs_exist_ok=True)
    else:
        raise ValueError("Expected database or media snapshot")
    owner = pwd.getpwnam("cpuz")
    for path in (target, *target.rglob("*")):
        os.chown(path, owner.pw_uid, owner.pw_gid)


if __name__ == "__main__":
    main(sys.argv[1])
