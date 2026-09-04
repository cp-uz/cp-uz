from __future__ import annotations

import json
import tempfile
from collections import Counter
from pathlib import Path

from django.core.management.base import CommandError
from django.test import TestCase
from rest_framework.test import APIClient

from apps.articles.management.commands.import_content import (
    Command,
    article_difficulty_from_export,
    article_status_from_export,
)
from apps.articles.models import Article, GlossaryTerm


class GlossaryImportTests(TestCase):
    def _write_rows(self, rows):
        temporary = tempfile.TemporaryDirectory(prefix="cpuz-glossary-import-")
        path = Path(temporary.name) / "glossary.json"
        path.write_text(json.dumps(rows, ensure_ascii=False), encoding="utf-8")
        self.addCleanup(temporary.cleanup)
        return path

    def test_explicit_aliases_and_duplicate_uzbek_terms_are_grouped(self):
        path = self._write_rows(
            [
                {
                    "source": "Vertex",
                    "uzbek": "Tugun",
                    "note": "Grafdagi asosiy obyekt tugun deyiladi.",
                    "aliases": ["Node", "Uch"],
                },
                {
                    "source": "Graph Node",
                    "uzbek": "Tugun",
                    "note": "Qirralar aynan tugunlarni o‘zaro bog‘laydi.",
                    "aliases": ["node", "Cho‘qqi"],
                },
            ]
        )

        Command()._import_glossary(path, Counter())

        term = GlossaryTerm.objects.get(term="Tugun")
        self.assertEqual(term.aliases, ["Vertex", "Node", "Uch", "Graph Node", "Cho‘qqi"])
        self.assertIn("Grafdagi asosiy obyekt", term.definition)
        self.assertIn("Qirralar aynan tugunlarni", term.definition)

    def test_aliases_must_be_a_string_list(self):
        path = self._write_rows(
            [
                {
                    "source": "Graph",
                    "uzbek": "Graf",
                    "note": "Tugunlar va qirralardan tuzilgan model.",
                    "aliases": "node graph",
                }
            ]
        )

        with self.assertRaisesRegex(CommandError, "aliases"):
            Command()._import_glossary(path, Counter())

    def test_display_case_migration_reuses_slug_and_is_idempotent(self):
        existing = GlossaryTerm.objects.create(
            term="segment daraxti",
            slug="segment-daraxti",
            short_definition="Eski izoh.",
            definition="Eski izoh.",
            aliases=["segment tree"],
        )
        path = self._write_rows(
            [
                {
                    "source": "Segment Tree",
                    "uzbek": "Segment daraxti",
                    "note": "Massiv segmentlari bo‘yicha so‘rovlarni tez bajaradigan daraxt.",
                    "aliases": ["Kesma daraxti", "SegmentTree"],
                }
            ]
        )

        first_stats = Counter()
        Command()._import_glossary(path, first_stats)
        migrated = GlossaryTerm.objects.get()
        self.assertEqual(migrated.pk, existing.pk)
        self.assertEqual(migrated.term, "Segment daraxti")
        self.assertEqual(migrated.aliases, ["Segment Tree", "Kesma daraxti", "SegmentTree"])
        self.assertEqual(first_stats["glossary_updated"], 1)

        second_stats = Counter()
        Command()._import_glossary(path, second_stats)
        self.assertEqual(GlossaryTerm.objects.count(), 1)
        self.assertEqual(GlossaryTerm.objects.get().pk, existing.pk)
        self.assertEqual(second_stats["glossary_unchanged"], 1)

    def test_canonical_glossary_round_trips_through_public_api(self):
        glossary_path = (
            Path(__file__).resolve().parents[4] / "content" / "metadata" / "glossary.json"
        )
        expected_count = len(json.loads(glossary_path.read_text(encoding="utf-8")))
        stats = Counter()
        Command()._import_glossary(glossary_path, stats)

        self.assertEqual(GlossaryTerm.objects.filter(is_published=True).count(), expected_count)
        response = APIClient().get("/api/v1/glossary/all/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), expected_count)
        self.assertTrue(
            all(
                item["english_term"]
                and item["uzbek_term"]
                and item["description"]
                and item["aliases"][0] == item["english_term"]
                for item in response.data
            )
        )


class PublicationStatusImportTests(TestCase):
    def test_automated_ready_maps_to_public_site_release(self):
        row = {
            "id": "algebra--sample",
            "publication": {"status": "ready"},
            "effective_reviews": {"technical": "pending", "language": "pending"},
            "workflow_stage": "technical_review_pending",
        }

        self.assertEqual(article_status_from_export(row), Article.Status.PUBLISHED)

    def test_published_requires_both_current_human_approvals(self):
        row = {
            "id": "algebra--sample",
            "publication": {"status": "published"},
            "effective_reviews": {"technical": "approved", "language": "pending"},
            "workflow_stage": "language_review_pending",
        }

        with self.assertRaisesRegex(CommandError, "texnik va til"):
            article_status_from_export(row)

        row["effective_reviews"]["language"] = "approved"
        row["workflow_stage"] = "published"
        self.assertEqual(article_status_from_export(row), Article.Status.PUBLISHED)


class DifficultyImportTests(TestCase):
    def test_all_canonical_difficulties_are_accepted(self):
        for value in Article.Difficulty.values:
            self.assertEqual(
                article_difficulty_from_export({"id": "sample", "difficulty": value}),
                value,
            )

    def test_missing_or_unknown_difficulty_never_falls_back_to_beginner(self):
        for row in (
            {"id": "missing"},
            {"id": "unknown", "difficulty": "expert"},
        ):
            with self.subTest(row=row):
                with self.assertRaisesRegex(CommandError, "difficulty"):
                    article_difficulty_from_export(row)

    def test_checked_in_export_has_the_curated_three_level_distribution(self):
        export_path = (
            Path(__file__).resolve().parents[4] / "content" / "exports" / "articles.v1.json"
        )
        rows = json.loads(export_path.read_text(encoding="utf-8"))["articles"]

        self.assertEqual(
            Counter(article_difficulty_from_export(row) for row in rows),
            Counter({"beginner": 58, "intermediate": 67, "advanced": 38}),
        )
