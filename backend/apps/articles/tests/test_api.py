from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from apps.articles.models import Article, Category, ExternalPracticeReference, GlossaryTerm, Tag


class KnowledgeApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.root = Category.objects.create(name="Algebra", slug="algebra")
        cls.child = Category.objects.create(
            name="Asoslar", slug="algebra--asoslar", parent=cls.root
        )
        cls.tag = Tag.objects.create(name="Math", slug="math")
        cls.public_draft = Article.objects.create(
            title="Ikkilik daraja",
            slug="algebra--binary-exp",
            canonical_path="algebra/binary-exp",
            content_path="algebra/binary-exp.md",
            summary="Darajani logarifmik vaqtda hisoblash.",
            content="# Ikkilik daraja\n\nMazmun",
            category=cls.child,
            status=Article.Status.DRAFT,
            visibility=Article.Visibility.PUBLIC,
            provenance={"translation": {"full_prose_translated": True}},
        )
        cls.public_draft.tags.add(cls.tag)
        cls.private_article = Article.objects.create(
            title="Yopiq maqola",
            slug="private-article",
            canonical_path="algebra/private",
            summary="Yopiq",
            content="# Yopiq",
            category=cls.child,
            status=Article.Status.PUBLISHED,
            visibility=Article.Visibility.PRIVATE,
        )
        ExternalPracticeReference.objects.create(
            article=cls.public_draft,
            platform=ExternalPracticeReference.Platform.CODEFORCES,
            title="Mashq",
            url="https://codeforces.com/problemset/problem/1/A",
        )
        GlossaryTerm.objects.create(
            term="Graf",
            slug="graf",
            short_definition="Uchlar va qirralar.",
            definition="Graf — uchlar va qirralardan tashkil topgan tuzilma.",
            aliases=["Graph"],
        )
        cls.client = APIClient()

    def test_public_translation_draft_is_visible_without_false_publication(self):
        response = self.client.get("/api/v1/articles/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        item = response.data["results"][0]
        self.assertEqual(item["status"], Article.Status.DRAFT)
        self.assertEqual(item["visibility"], Article.Visibility.PUBLIC)
        self.assertEqual(item["canonical_url"], "/algoritmlar/algebra/binary-exp/")

        detail = self.client.get("/api/v1/articles/algebra--binary-exp/")
        self.assertEqual(detail.status_code, 200)
        self.assertFalse(detail.data["review_state"]["fully_reviewed"])
        self.assertEqual(len(detail.data["practice_references"]), 1)

    def test_private_article_is_not_publicly_retrievable(self):
        response = self.client.get("/api/v1/articles/private-article/")
        self.assertEqual(response.status_code, 404)

    def test_canonical_path_resolver(self):
        response = self.client.get("/api/v1/articles/by-path/algebra/binary-exp/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["slug"], "algebra--binary-exp")
        self.assertEqual(response.data["asset_base_url"], "/media/content/algebra/")

    def test_root_category_contains_children_and_descendant_count(self):
        response = self.client.get("/api/v1/categories/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["article_count"], 1)
        self.assertEqual(response.data[0]["children"][0]["article_count"], 1)

        filtered = self.client.get("/api/v1/articles/?category=algebra")
        self.assertEqual(filtered.data["count"], 1)

    def test_search_returns_public_knowledge_only(self):
        response = self.client.get("/api/v1/search/?q=daraja")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total"], 1)
        self.assertEqual(response.data["articles"][0]["slug"], "algebra--binary-exp")

    def test_glossary_contract_and_english_alias_search(self):
        glossary = self.client.get("/api/v1/glossary/")
        self.assertEqual(glossary.status_code, 200)
        item = glossary.data["results"][0]
        self.assertEqual(item["english_term"], "Graph")
        self.assertEqual(item["uzbek_term"], "Graf")
        self.assertEqual(item["description"], "Uchlar va qirralar.")

        search = self.client.get("/api/v1/search/?q=graph&scope=glossary")
        self.assertEqual(search.status_code, 200)
        self.assertEqual(search.data["total"], 1)
        self.assertEqual(search.data["glossary"][0]["uzbek_term"], "Graf")


class SeoStatsAndHealthTests(TestCase):
    def setUp(self):
        cache.clear()
        category = Category.objects.create(name="Graf", slug="graphs")
        self.article = Article.objects.create(
            title="DFS",
            slug="graph--dfs",
            canonical_path="graph/depth-first-search",
            summary="Chuqurlik bo‘yicha qidiruv",
            content="# DFS",
            category=category,
            visibility=Article.Visibility.PUBLIC,
            status=Article.Status.DRAFT,
            provenance={"translation": {"full_prose_translated": True}},
        )
        ExternalPracticeReference.objects.create(
            article=self.article,
            platform=ExternalPracticeReference.Platform.CSES,
            title="Counting Rooms",
            url="https://cses.fi/problemset/task/1192",
        )
        self.client = APIClient()

    def test_stats(self):
        response = self.client.get("/api/v1/stats/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["articles"], 1)
        self.assertEqual(response.data["categories"], 1)
        self.assertEqual(response.data["practice_references"], 1)
        self.assertEqual(response.data["full_translations"], 1)
        self.assertEqual(response.data["synopsis_drafts"], 0)
        self.assertEqual(response.data["editorial"]["draft"], 1)

    def test_sitemap_robots_and_health(self):
        sitemap = self.client.get("/sitemap.xml")
        self.assertEqual(sitemap.status_code, 200)
        self.assertContains(sitemap, "/algoritmlar/graph/depth-first-search/")

        robots = self.client.get("/robots.txt")
        self.assertEqual(robots.status_code, 200)
        self.assertContains(robots, "Sitemap: https://cp.uz/sitemap.xml")

        health = self.client.get("/api/v1/health/")
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.json()["status"], "ok")
