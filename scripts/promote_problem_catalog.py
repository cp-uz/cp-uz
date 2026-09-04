"""Validate and atomically promote a reviewed problem candidate."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import tempfile
from pathlib import Path

from content_pipeline import validate_checksum_manifest, write_checksum_manifest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from content_tools.problem_catalog import load_catalog  # noqa: E402
from content_tools.release_inventory import build_inventory  # noqa: E402


def promote(candidate, content_root, inventory_path):
    candidate, content_root = candidate.resolve(), content_root.resolve()
    target = content_root / "problems"
    if candidate == target or target in candidate.parents or candidate in target.parents:
        raise ValueError("Candidate must be separate from the canonical problem tree")
    if candidate.is_symlink() or any(path.is_symlink() for path in candidate.rglob("*")):
        raise ValueError("Candidate must not contain symbolic links")
    known_events = {
        (path.parents[1].name, json.loads(path.read_text(encoding="utf-8"))["slug"])
        for path in (content_root / "seasons").glob("*/events/*.json")
    }
    load_catalog(candidate, known_events=known_events)
    tracked = [content_root / "MANIFEST.sha256", inventory_path]
    originals = {path: path.read_bytes() if path.exists() else None for path in tracked}
    workspace = Path(tempfile.mkdtemp(prefix=".cpuz-promote-", dir=content_root.parent))
    staged, backup = workspace / "new", workspace / "previous"
    shutil.copytree(candidate, staged)
    target.rename(backup)
    try:
        staged.rename(target)
        write_checksum_manifest(content_root)
        validate_checksum_manifest(content_root)
        inventory_path.write_text(
            json.dumps(build_inventory(content_root), indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
            newline="\n",
        )
    except BaseException:
        try:
            # Both directories are fixed children of validated operation paths.
            if target.exists():
                target.rename(workspace / "failed")
            backup.rename(target)
            for path, content in originals.items():
                if content is None:
                    path.unlink(missing_ok=True)
                else:
                    path.write_bytes(content)
        except BaseException as recovery_error:
            # Never let temporary-directory cleanup delete the only intact
            # canonical snapshot when filesystem recovery itself fails.
            raise RuntimeError(
                f"Promotion recovery needs operator attention; preserved files: {workspace}"
            ) from recovery_error
        shutil.rmtree(workspace)
        raise
    shutil.rmtree(workspace)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("candidate", type=Path)
    args = parser.parse_args()
    promote(args.candidate, ROOT / "content", ROOT / "deploy/content-inventory.json")
    print("Reviewed problem candidate promoted; inspect the Git diff before commit.")


if __name__ == "__main__":
    main()
