"""CLI facade for the same problem validation used by Django imports."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from content_tools.problem_catalog import _read_json, load_catalog  # noqa: E402


def validate_problem_inventory(content_root: Path) -> dict[str, int]:
    known_events = {
        (path.parents[1].name, _read_json(path)["slug"])
        for path in (content_root / "seasons").glob("*/events/*.json")
    }
    _, counts = load_catalog(content_root / "problems", known_events=known_events)
    return counts
