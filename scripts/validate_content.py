#!/usr/bin/env python3
"""Validate the CP.UZ learning-content inventory and immutable checksums."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from content_pipeline import validate_checksum_manifest, validate_inventory


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--content-root",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "content",
    )
    parser.add_argument("--skip-checksums", action="store_true")
    args = parser.parse_args()
    content_root = args.content_root.resolve()
    summary = validate_inventory(content_root)
    if not args.skip_checksums:
        validate_checksum_manifest(content_root)
    print(json.dumps(summary, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

