"""Build upstream candidates separately from the reviewed canonical tree."""

from __future__ import annotations

import shutil
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def stage_catalog(destination: Path, writer):
    destination = destination.resolve()
    canonical = (ROOT / "content").resolve()
    if destination == canonical or canonical in destination.parents:
        raise ValueError("Sync writes only candidates; use promote_problem_catalog.py after review")
    if destination.exists():
        raise FileExistsError(
            f"Candidate already exists; preserve it and choose a new path: {destination}"
        )
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".cpuz-candidate-", dir=destination.parent) as value:
        staged = Path(value) / "problems"
        shutil.copytree(canonical / "problems", staged)
        writer(staged)
        staged.rename(destination)
    print(
        f"Candidate staged at {destination};",
        "rebuild PDF metadata, validate and review before promotion.",
    )
