#!/usr/bin/env python3
"""Regenerate the backend-neutral JSON export from content/."""

from __future__ import annotations

import argparse
from pathlib import Path

from content_pipeline import (
    export_content,
    sync_glossary_metadata,
    validate_inventory,
    write_checksum_manifest,
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--content-root",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "content",
    )
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    content_root = args.content_root.resolve()
    glossary_rows = sync_glossary_metadata(content_root)
    summary = validate_inventory(content_root)
    output = export_content(content_root, args.output.resolve() if args.output else None)
    # The manifest is always refreshed after an in-tree export.
    if output.is_relative_to(content_root):
        write_checksum_manifest(content_root)
    print(
        f"Exported {summary['articles']} articles and {len(glossary_rows)} glossary concepts "
        f"to {output}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
