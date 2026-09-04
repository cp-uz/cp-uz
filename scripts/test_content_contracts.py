from __future__ import annotations

import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from content_tools.problem_catalog import load_catalog  # noqa: E402
from content_tools.release_inventory import check_inventory  # noqa: E402
from scripts.problem_staging import stage_catalog  # noqa: E402


class ContentContractTests(unittest.TestCase):
    def test_reviewed_inventory_matches_canonical_snapshot(self):
        counts = check_inventory(ROOT / "content", ROOT / "deploy/content-inventory.json")
        self.assertGreater(counts["articles"], 0)
        self.assertGreater(counts["problems"], 0)

    def test_duplicate_problem_slug_across_sets_is_rejected_before_import(self):
        source = ROOT / "content/problems"
        with tempfile.TemporaryDirectory() as value:
            root = Path(value)
            shutil.copytree(source / "schema", root / "schema")
            event = root / "2025-2026/ioi-2026"
            shutil.copytree(source / "2025-2026/ioi-2026", event)
            first_set = json.loads((event / "day-1/set.json").read_text(encoding="utf-8"))
            second_path = event / "day-2/set.json"
            second_set = json.loads(second_path.read_text(encoding="utf-8"))
            original = second_set["problems"][0]
            duplicate = first_set["problems"][0]
            (event / "day-2" / original).rename(event / "day-2" / duplicate)
            second_set["problems"][0] = duplicate
            second_path.write_text(json.dumps(second_set), encoding="utf-8")
            problem_path = event / "day-2" / duplicate / "problem.json"
            problem = json.loads(problem_path.read_text(encoding="utf-8"))
            problem["slug"] = duplicate
            problem_path.write_text(json.dumps(problem), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "duplicate problem slug within event"):
                load_catalog(root)

    def test_sync_refuses_to_write_into_canonical_or_existing_candidate(self):
        called = []
        with self.assertRaisesRegex(ValueError, "Sync writes only candidates"):
            stage_catalog(ROOT / "content/problems", lambda path: called.append(path))
        with tempfile.TemporaryDirectory() as value:
            with self.assertRaises(FileExistsError):
                stage_catalog(Path(value), lambda path: called.append(path))
        self.assertEqual(called, [])
