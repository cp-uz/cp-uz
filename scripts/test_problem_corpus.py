from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from pypdf import PdfWriter

from scripts import build_problem_statement_corpus as corpus


class CorpusRebuildTests(unittest.TestCase):
    def test_official_mirror_can_be_rebuilt_twice_without_original_attachment(self):
        with tempfile.TemporaryDirectory() as value:
            root = Path(value)
            fixture = root / "official.pdf"
            writer = PdfWriter()
            writer.add_blank_page(width=595, height=842)
            writer.write(fixture)
            problem = root / "content/season/event/day-1/task/problem.json"
            problem.parent.mkdir(parents=True)
            metadata = {
                "url": "https://example.invalid/official.pdf",
                **corpus.file_metadata(fixture),
                "language": "uz",
                "provenance": "official",
            }
            problem.write_text(
                json.dumps(
                    {
                        "slug": "task",
                        "title": "Task",
                        "statement_pdf": metadata,
                    }
                ),
                encoding="utf-8",
            )
            with patch.object(corpus, "cached_download", return_value=fixture):
                for _ in range(2):
                    result = corpus.build_corpus(
                        root / "content",
                        root / "generated",
                        root / "output",
                        "https://example.invalid/raw",
                        True,
                    )
                    self.assertEqual(result[0]["provenance"], "official")
                    self.assertEqual(result[0]["sha256"], metadata["sha256"])

    def test_failed_corpus_does_not_partially_rewrite_canonical_metadata(self):
        with tempfile.TemporaryDirectory() as value:
            root = Path(value)
            paths = []
            for slug in ("a", "b"):
                path = root / f"content/season/event/day-1/{slug}/problem.json"
                path.parent.mkdir(parents=True)
                path.write_text(json.dumps({"slug": slug, "title": slug}), encoding="utf-8")
                paths.append(path)
            originals = [path.read_bytes() for path in paths]
            generated = root / "generated/season/event/day-1/a/statement.pdf"
            generated.parent.mkdir(parents=True)
            writer = PdfWriter()
            writer.add_blank_page(width=595, height=842)
            writer.write(generated)
            with self.assertRaisesRegex(RuntimeError, "topilmadi"):
                corpus.build_corpus(
                    root / "content",
                    root / "generated",
                    root / "output",
                    "https://example.invalid/raw",
                    True,
                )
            self.assertEqual([path.read_bytes() for path in paths], originals)
