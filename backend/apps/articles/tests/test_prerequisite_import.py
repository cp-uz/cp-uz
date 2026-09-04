from collections import Counter

from django.core.management.base import CommandError
from django.db import transaction
from django.test import TestCase

from apps.articles.importing.prerequisites import reconcile_prerequisites
from apps.articles.models import Article, ArticlePrerequisite, Category


class PrerequisiteImportTests(TestCase):
    def setUp(self):
        category = Category.objects.create(name="Audit", slug="audit")
        self.articles = {
            slug: Article.objects.create(
                title=slug, slug=slug, category=category, summary="Example", content="Example"
            )
            for slug in ("a", "b", "c")
        }

    def import_edges(self, edges):
        stats = Counter()
        with transaction.atomic():
            reconcile_prerequisites([{"id": "a", "prerequisites": edges}], self.articles, stats)
        return stats

    def test_edits_reorder_and_remove_canonical_edges(self):
        self.import_edges([{"id": "b", "note": "old"}])
        self.import_edges(["c", {"id": "b", "note": "new"}])
        edge = ArticlePrerequisite.objects.get(
            article=self.articles["a"], prerequisite=self.articles["b"]
        )
        self.assertEqual((edge.order, edge.note), (1, "new"))
        stats = self.import_edges([])
        self.assertEqual(stats["prerequisites_deleted"], 2)
        self.assertFalse(ArticlePrerequisite.objects.exists())

    def test_bad_reference_rolls_back_the_whole_import(self):
        self.import_edges(["b"])
        with self.assertRaises(CommandError):
            self.import_edges(["c", "unknown"])
        self.assertEqual(
            list(ArticlePrerequisite.objects.values_list("prerequisite__slug", flat=True)), ["b"]
        )
