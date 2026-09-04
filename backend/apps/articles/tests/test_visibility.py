from django.test import TestCase

from apps.articles.models import Article, ArticlePrerequisite, Category, GlossaryTerm


class NestedArticleVisibilityTests(TestCase):
    def test_openapi_describes_unpaginated_collections_and_nullable_nested_subjects(self):
        response = self.client.get("/api/schema/?format=json")
        self.assertEqual(response.status_code, 200)
        document = response.data
        for path in (
            "/api/v1/articles/all/",
            "/api/v1/glossary/all/",
            "/api/v1/me/bookmarks/all/",
            "/api/v1/me/progress/all/",
            "/api/v1/me/notes/all/",
        ):
            schema = document["paths"][path]["get"]["responses"]["200"]["content"][
                "application/json"
            ]["schema"]
            self.assertEqual(schema["type"], "array", path)
        result = document["components"]["schemas"]["ResultEntry"]["properties"]
        self.assertTrue(result["participant"]["nullable"])
        self.assertTrue(result["team"]["nullable"])

    def test_private_articles_are_filtered_from_glossary_and_prerequisites(self):
        category = Category.objects.create(name="Visibility", slug="visibility")
        public = Article.objects.create(
            title="Public",
            slug="public",
            canonical_path="visibility/public",
            summary="Summary",
            content="Content",
            category=category,
            visibility="public",
        )
        private = Article.objects.create(
            title="Private",
            slug="private",
            summary="Private summary",
            content="Private content",
            category=category,
            visibility="private",
        )
        term = GlossaryTerm.objects.create(
            term="Term", slug="term", short_definition="Short", definition="Full"
        )
        term.related_articles.add(public, private)
        ArticlePrerequisite.objects.create(article=public, prerequisite=private)
        for path in ("/api/v1/articles/public/", "/api/v1/articles/by-path/visibility/public/"):
            response = self.client.get(path)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data["prerequisites"], [])
        response = self.client.get("/api/v1/glossary/term/")
        self.assertEqual([item["slug"] for item in response.data["related_articles"]], ["public"])
