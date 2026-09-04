from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.articles.models import Article, Category
from apps.engagement.models import (
    Bookmark,
    GlossaryQuizScore,
    PersonalNote,
    ReadingProgress,
)


class EngagementApiTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="reader", password="strong-pass-123")
        self.other = User.objects.create_user(username="other", password="strong-pass-123")
        category = Category.objects.create(name="Graf", slug="graph")
        self.article = Article.objects.create(
            title="BFS",
            slug="graph--bfs",
            canonical_path="graph/breadth-first-search",
            summary="Eniga qidiruv",
            content="# BFS",
            category=category,
            visibility=Article.Visibility.PUBLIC,
        )
        self.client = APIClient()

    def test_authentication_and_user_scoping(self):
        self.assertEqual(self.client.get("/api/v1/me/bookmarks/").status_code, 401)
        Bookmark.objects.create(user=self.other, article=self.article)
        self.client.force_authenticate(self.user)
        response = self.client.get("/api/v1/me/bookmarks/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 0)

    def test_bookmark_note_and_progress_upsert(self):
        self.client.force_authenticate(self.user)
        bookmark = self.client.post(
            "/api/v1/me/bookmarks/", {"article_slug": self.article.slug}, format="json"
        )
        self.assertEqual(bookmark.status_code, 201)
        self.assertEqual(Bookmark.objects.filter(user=self.user).count(), 1)

        note = self.client.post(
            "/api/v1/me/notes/",
            {"article_slug": self.article.slug, "body": "Muhim invariant", "anchor": "proof"},
            format="json",
        )
        self.assertEqual(note.status_code, 201)
        self.assertTrue(PersonalNote.objects.filter(user=self.user).exists())

        first = self.client.post(
            "/api/v1/me/progress/",
            {"article_slug": self.article.slug, "percent": 25},
            format="json",
        )
        second = self.client.post(
            "/api/v1/me/progress/",
            {"article_slug": self.article.slug, "percent": 100},
            format="json",
        )
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 201)
        self.assertEqual(ReadingProgress.objects.filter(user=self.user).count(), 1)
        progress = ReadingProgress.objects.get(user=self.user)
        self.assertEqual(progress.percent, 100)
        self.assertEqual(progress.status, ReadingProgress.Status.COMPLETED)

    def test_reading_progress_never_regresses(self):
        self.client.force_authenticate(self.user)
        first = self.client.post(
            "/api/v1/me/progress/",
            {"article_slug": self.article.slug, "percent": 45},
            format="json",
        )
        regression = self.client.post(
            "/api/v1/me/progress/",
            {"article_slug": self.article.slug, "percent": 20},
            format="json",
        )

        self.assertEqual(first.status_code, 201)
        self.assertEqual(regression.status_code, 201)
        self.assertEqual(regression.data["percent"], 45)
        progress = ReadingProgress.objects.get(user=self.user, article=self.article)
        self.assertEqual(progress.percent, 45)
        self.assertEqual(progress.status, ReadingProgress.Status.IN_PROGRESS)

        patched = self.client.patch(
            f"/api/v1/me/progress/{progress.pk}/",
            {"percent": 10},
            format="json",
        )
        self.assertEqual(patched.status_code, 200)
        self.assertEqual(patched.data["percent"], 45)

    def test_all_collection_endpoint_is_unpaginated_and_user_scoped(self):
        Bookmark.objects.create(user=self.user, article=self.article)
        self.client.force_authenticate(self.user)

        response = self.client.get("/api/v1/me/bookmarks/all/")

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["article"]["slug"], self.article.slug)

    def test_glossary_leaderboard_excludes_zero_answer_rows(self):
        GlossaryQuizScore.objects.create(user=self.user)
        GlossaryQuizScore.objects.create(
            user=self.other,
            correct_answers=1,
            total_answers=1,
            current_streak=1,
            best_streak=1,
        )

        anonymous = self.client.get("/api/v1/glossary/leaderboard/")
        self.client.force_authenticate(self.user)
        zero_answer_user = self.client.get("/api/v1/glossary/leaderboard/")

        self.assertEqual(anonymous.status_code, 200)
        self.assertEqual(anonymous.data["participant_count"], 1)
        self.assertEqual(len(anonymous.data["leaderboard"]), 1)
        self.assertEqual(anonymous.data["leaderboard"][0]["name"], "other")
        self.assertIsNone(zero_answer_user.data["personal"])

    def test_private_profile_sees_own_name_but_remains_anonymous_to_others(self):
        self.user.first_name = "Ali"
        self.user.last_name = "Valiyev"
        self.user.public_profile = False
        self.user.save(update_fields=("first_name", "last_name", "public_profile"))
        GlossaryQuizScore.objects.create(
            user=self.user,
            correct_answers=2,
            total_answers=2,
            current_streak=2,
            best_streak=2,
        )

        anonymous = self.client.get("/api/v1/glossary/leaderboard/")
        self.client.force_authenticate(self.user)
        personal = self.client.get("/api/v1/glossary/leaderboard/")

        self.assertEqual(anonymous.data["leaderboard"][0]["name"], "Ishtirokchi")
        self.assertEqual(personal.data["leaderboard"][0]["name"], "Ali Valiyev")
        self.assertEqual(personal.data["personal"]["name"], "Ali Valiyev")
