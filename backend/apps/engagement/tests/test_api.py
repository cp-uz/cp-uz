from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.articles.models import Article, Category
from apps.engagement.models import Bookmark, GlossaryQuizScore, PersonalNote, ReadingProgress


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

    def test_glossary_quiz_leaderboard_tracks_every_answer_and_streak(self):
        empty = self.client.get("/api/v1/glossary/leaderboard/")
        self.assertEqual(empty.status_code, 200)
        self.assertEqual(empty.data, {"leaderboard": [], "personal": None})

        self.client.force_authenticate(self.user)
        responses = [
            self.client.post(
                "/api/v1/glossary/score/", {"is_correct": is_correct}, format="json"
            )
            for is_correct in (True, True, False, True)
        ]

        self.assertTrue(all(response.status_code == 200 for response in responses))
        score = GlossaryQuizScore.objects.get(user=self.user)
        self.assertEqual(score.correct_answers, 3)
        self.assertEqual(score.total_answers, 4)
        self.assertEqual(score.current_streak, 1)
        self.assertEqual(score.best_streak, 2)
        personal = responses[-1].data["personal"]
        self.assertEqual(personal["correct"], 3)
        self.assertEqual(personal["total"], 4)
        self.assertEqual(personal["percent"], 75)
        self.assertTrue(personal["is_current_user"])

        self.client.force_authenticate(self.other)
        winner = None
        for _ in range(4):
            winner = self.client.post(
                "/api/v1/glossary/score/", {"is_correct": True}, format="json"
            )
        self.assertIsNotNone(winner)
        self.assertEqual(winner.status_code, 200)
        self.assertEqual(winner.data["leaderboard"][0]["name"], "other")
        self.assertEqual(winner.data["leaderboard"][0]["percent"], 100)
        self.assertEqual(winner.data["leaderboard"][0]["best_streak"], 4)

    def test_glossary_quiz_requires_authentication_and_boolean_answer(self):
        anonymous = self.client.post(
            "/api/v1/glossary/score/", {"is_correct": True}, format="json"
        )
        self.assertEqual(anonymous.status_code, 401)

        self.client.force_authenticate(self.user)
        response = self.client.post("/api/v1/glossary/score/", {}, format="json")
        self.assertEqual(response.status_code, 400)
