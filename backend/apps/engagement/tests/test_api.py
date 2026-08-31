import uuid

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.articles.models import Article, Category
from apps.engagement.models import (
    Bookmark,
    GlossaryQuizAnswer,
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

    def test_glossary_quiz_leaderboard_tracks_every_answer_and_streak(self):
        empty = self.client.get("/api/v1/glossary/leaderboard/")
        self.assertEqual(empty.status_code, 200)
        self.assertEqual(
            empty.data,
            {"leaderboard": [], "personal": None, "participant_count": 0},
        )

        self.client.force_authenticate(self.user)
        responses = [
            self.client.post(
                "/api/v1/glossary/score/",
                {"client_answer_id": str(uuid.uuid4()), "is_correct": is_correct},
                format="json",
            )
            for is_correct in (True, True, False, True)
        ]

        self.assertTrue(all(response.status_code == 200 for response in responses))
        score = GlossaryQuizScore.objects.get(user=self.user)
        self.assertEqual(score.correct_answers, 3)
        self.assertEqual(score.total_answers, 4)
        self.assertEqual(score.current_streak, 1)
        self.assertEqual(score.best_streak, 2)
        self.assertEqual(GlossaryQuizAnswer.objects.filter(user=self.user).count(), 4)
        personal = responses[-1].data["personal"]
        self.assertEqual(personal["correct"], 3)
        self.assertEqual(personal["total"], 4)
        self.assertEqual(personal["percent"], 75)
        self.assertTrue(personal["is_current_user"])
        self.assertEqual(responses[-1].data["participant_count"], 1)

        self.client.force_authenticate(self.other)
        winner = None
        for _ in range(4):
            winner = self.client.post(
                "/api/v1/glossary/score/",
                {"client_answer_id": str(uuid.uuid4()), "is_correct": True},
                format="json",
            )
        self.assertIsNotNone(winner)
        self.assertEqual(winner.status_code, 200)
        self.assertEqual(winner.data["leaderboard"][0]["name"], "other")
        self.assertEqual(winner.data["leaderboard"][0]["percent"], 100)
        self.assertEqual(winner.data["leaderboard"][0]["best_streak"], 4)
        self.assertEqual(winner.data["participant_count"], 2)

    def test_glossary_quiz_answer_submission_is_idempotent(self):
        self.client.force_authenticate(self.user)
        client_answer_id = uuid.uuid4()

        first = self.client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": str(client_answer_id), "is_correct": True},
            format="json",
        )
        retry = self.client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": str(client_answer_id), "is_correct": True},
            format="json",
        )
        conflicting_retry = self.client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": str(client_answer_id), "is_correct": False},
            format="json",
        )

        self.assertEqual(first.status_code, 200)
        self.assertEqual(retry.status_code, 200)
        self.assertEqual(conflicting_retry.status_code, 200)
        score = GlossaryQuizScore.objects.get(user=self.user)
        self.assertEqual(score.correct_answers, 1)
        self.assertEqual(score.total_answers, 1)
        self.assertEqual(score.current_streak, 1)
        self.assertEqual(score.best_streak, 1)
        answer = GlossaryQuizAnswer.objects.get(user=self.user)
        self.assertEqual(answer.client_answer_id, str(client_answer_id))
        self.assertTrue(answer.is_correct)
        self.assertEqual(first.data, retry.data)
        self.assertEqual(retry.data, conflicting_retry.data)

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

    def test_glossary_quiz_idempotency_survives_guest_resume_and_upgrade(self):
        anonymous = APIClient()
        created = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        self.assertEqual(created.status_code, 201)
        guest_user_id = created.data["user"]["id"]
        client_answer_id = uuid.uuid4()

        guest_client = APIClient()
        guest_client.credentials(HTTP_AUTHORIZATION=f"Bearer {created.data['access']}")
        submitted = guest_client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": str(client_answer_id), "is_correct": True},
            format="json",
        )
        self.assertEqual(submitted.status_code, 200)

        resumed = anonymous.post(
            "/api/v1/auth/guest/",
            {"session_token": created.data["session_token"]},
            format="json",
        )
        self.assertEqual(resumed.status_code, 200)
        self.assertEqual(resumed.data["user"]["id"], guest_user_id)
        resumed_client = APIClient()
        resumed_client.credentials(HTTP_AUTHORIZATION=f"Bearer {resumed.data['access']}")
        retry_after_resume = resumed_client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": str(client_answer_id), "is_correct": True},
            format="json",
        )
        self.assertEqual(retry_after_resume.status_code, 200)

        upgraded = resumed_client.post(
            "/api/v1/auth/guest/upgrade/",
            {"username": "quiz_identity"},
            format="json",
        )
        self.assertEqual(upgraded.status_code, 200)
        self.assertEqual(upgraded.data["user"]["id"], guest_user_id)
        upgraded_client = APIClient()
        upgraded_client.credentials(HTTP_AUTHORIZATION=f"Bearer {upgraded.data['access']}")
        retry_after_upgrade = upgraded_client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": str(client_answer_id), "is_correct": False},
            format="json",
        )

        self.assertEqual(retry_after_upgrade.status_code, 200)
        score = GlossaryQuizScore.objects.get(user_id=guest_user_id)
        self.assertEqual(score.correct_answers, 1)
        self.assertEqual(score.total_answers, 1)
        self.assertEqual(GlossaryQuizAnswer.objects.filter(user_id=guest_user_id).count(), 1)
        self.assertTrue(retry_after_upgrade.data["personal"]["is_current_user"])

    def test_glossary_quiz_requires_authentication_and_boolean_answer(self):
        anonymous = self.client.post(
            "/api/v1/glossary/score/", {"is_correct": True}, format="json"
        )
        self.assertEqual(anonymous.status_code, 401)

        self.client.force_authenticate(self.user)
        response = self.client.post("/api/v1/glossary/score/", {}, format="json")
        self.assertEqual(response.status_code, 400)

        blank_id = self.client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": "", "is_correct": True},
            format="json",
        )
        too_long_id = self.client.post(
            "/api/v1/glossary/score/",
            {"client_answer_id": "x" * 121, "is_correct": True},
            format="json",
        )
        self.assertEqual(blank_id.status_code, 400)
        self.assertEqual(too_long_id.status_code, 400)

    def test_glossary_quiz_openapi_exposes_idempotency_and_participant_count(self):
        schema = self.client.get("/api/schema/?format=json")
        self.assertEqual(schema.status_code, 200)
        operation = schema.data["paths"]["/api/v1/glossary/score/"]["post"]
        request_ref = operation["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        request_schema = schema.data["components"]["schemas"][request_ref.rsplit("/", 1)[-1]]
        self.assertEqual(
            set(request_schema["required"]),
            {"client_answer_id", "is_correct"},
        )
        self.assertEqual(request_schema["properties"]["client_answer_id"]["maxLength"], 120)

        response_ref = operation["responses"]["200"]["content"]["application/json"]["schema"][
            "$ref"
        ]
        response_schema = schema.data["components"]["schemas"][response_ref.rsplit("/", 1)[-1]]
        self.assertIn("participant_count", response_schema["properties"])
        self.assertIn("participant_count", response_schema["required"])
