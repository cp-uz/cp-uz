"""Generate or verify the reviewed release inventory after canonical edits."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from content_tools.release_inventory import build_inventory, check_inventory  # noqa: E402


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--content-root", type=Path, default=ROOT / "content")
    parser.add_argument("--manifest", type=Path, default=ROOT / "deploy/content-inventory.json")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true", help="Verify the reviewed manifest (default)")
    args = parser.parse_args()
    if args.write:
        args.manifest.write_text(
            json.dumps(build_inventory(args.content_root), indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
            newline="\n",
        )
    else:
        check_inventory(args.content_root, args.manifest)
    print("Release inventory verified.")


if __name__ == "__main__":
    main()
