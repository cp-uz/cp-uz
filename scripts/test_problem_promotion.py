"""Publication failures use disposable catalogs and retain recoverable originals."""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import promote_problem_catalog as publication


class ProblemPromotionTests(unittest.TestCase):
    def fixture(self):
        directory = tempfile.TemporaryDirectory(prefix="cpuz-promotion-test-")
        self.addCleanup(directory.cleanup)
        root = Path(directory.name)
        content = root / "content"
        target = content / "problems"
        target.mkdir(parents=True)
        (target / "source.txt").write_text("original")
        manifest = content / "MANIFEST.sha256"
        manifest.write_text("original checksums")
        inventory = root / "inventory.json"
        inventory.write_text("original inventory")
        candidate = root / "candidate"
        candidate.mkdir()
        (candidate / "source.txt").write_text("candidate")
        return root, content, target, manifest, inventory, candidate

    def test_invalid_candidate_never_changes_canonical_files(self):
        root, content, target, manifest, inventory, candidate = self.fixture()
        with patch.object(publication, "load_catalog", side_effect=ValueError("invalid")):
            with self.assertRaisesRegex(ValueError, "invalid"):
                publication.promote(candidate, content, inventory)
        self.assertEqual((target / "source.txt").read_text(), "original")
        self.assertEqual(manifest.read_text(), "original checksums")
        self.assertEqual(inventory.read_text(), "original inventory")
        self.assertEqual(list(root.glob(".cpuz-promote-*")), [])

    def test_inventory_failure_restores_catalog_and_metadata(self):
        root, content, target, manifest, inventory, candidate = self.fixture()

        def write_manifest(_content):
            manifest.write_text("candidate checksums")

        with (
            patch.object(publication, "load_catalog"),
            patch.object(publication, "write_checksum_manifest", side_effect=write_manifest),
            patch.object(publication, "validate_checksum_manifest"),
            patch.object(publication, "build_inventory", side_effect=ValueError("inventory")),
        ):
            with self.assertRaisesRegex(ValueError, "inventory"):
                publication.promote(candidate, content, inventory)
        self.assertEqual((target / "source.txt").read_text(), "original")
        self.assertEqual(manifest.read_text(), "original checksums")
        self.assertEqual(inventory.read_text(), "original inventory")
        self.assertEqual((candidate / "source.txt").read_text(), "candidate")
        self.assertEqual(list(root.glob(".cpuz-promote-*")), [])

    def test_failed_filesystem_recovery_retains_original_snapshot(self):
        root, content, target, _, inventory, candidate = self.fixture()
        original_rename = Path.rename
        target_renames = 0

        def failed_recovery(path, destination):
            nonlocal target_renames
            if path == target:
                target_renames += 1
                if target_renames == 2:
                    raise PermissionError("target is locked")
            return original_rename(path, destination)

        with (
            patch.object(publication, "load_catalog"),
            patch.object(publication, "write_checksum_manifest", side_effect=ValueError("disk")),
            patch.object(Path, "rename", failed_recovery),
        ):
            with self.assertRaisesRegex(RuntimeError, "preserved files"):
                publication.promote(candidate, content, inventory)
        recovery = list(root.glob(".cpuz-promote-*"))
        self.assertEqual(len(recovery), 1)
        self.assertEqual((recovery[0] / "previous/source.txt").read_text(), "original")
