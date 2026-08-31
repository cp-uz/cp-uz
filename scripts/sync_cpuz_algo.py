#!/usr/bin/env python3
"""Create a reproducible local content snapshot from cp-uz/algo."""

from __future__ import annotations

import argparse
import os
import shutil
import stat
import subprocess
import tempfile
from pathlib import Path

from content_pipeline import copy_snapshot, export_content, validate_inventory, write_checksum_manifest


DEFAULT_REPOSITORY = "https://github.com/cp-uz/algo.git"


def remove_tree(path: Path) -> None:
    """Remove a temporary Git checkout, including read-only pack files on Windows."""

    def make_writable_and_retry(function, value, _exc_info) -> None:
        os.chmod(value, stat.S_IWRITE)
        function(value)

    shutil.rmtree(path, onerror=make_writable_and_retry)


def parser() -> argparse.ArgumentParser:
    value = argparse.ArgumentParser(description=__doc__)
    value.add_argument("--source", type=Path, help="Existing cp-uz/algo checkout; skips cloning")
    value.add_argument("--repository", default=DEFAULT_REPOSITORY)
    value.add_argument("--ref", default="main", help="Branch, tag, or exact commit to snapshot")
    value.add_argument(
        "--destination",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "content",
    )
    return value


def clone_repository(repository: str, ref: str, destination: Path) -> None:
    subprocess.run(
        ["git", "clone", "--quiet", "--no-tags", repository, str(destination)],
        check=True,
    )
    subprocess.run(
        ["git", "-C", str(destination), "checkout", "--quiet", "--detach", ref],
        check=True,
    )


def main() -> int:
    args = parser().parse_args()
    destination = args.destination.resolve()
    if destination.exists():
        raise SystemExit(
            f"Refusing to overwrite existing snapshot: {destination}. "
            "Move it aside or use a new --destination."
        )

    temporary_parent: Path | None = None
    try:
        if args.source:
            source = args.source.resolve()
        else:
            temporary_parent = Path(tempfile.mkdtemp(prefix="cpuz-algo-source-"))
            source = temporary_parent / "repo"
            clone_repository(args.repository, args.ref, source)

        copy_snapshot(source, destination)
        summary = validate_inventory(destination)
        export_content(destination)
        write_checksum_manifest(destination)
        print(f"Snapshot: {destination}")
        for key, value in summary.items():
            print(f"{key}: {value}")
    except BaseException:
        if destination.exists():
            remove_tree(destination)
        raise
    finally:
        if temporary_parent and temporary_parent.exists():
            remove_tree(temporary_parent)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
