import uuid
from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.articles.models import GlossaryTerm
from apps.engagement.models import GlossaryQuizAnswer, GlossaryQuizQuestion, GlossaryQuizScore


class ServerQuizTests(TestCase):
    def setUp(self):
        cache.clear()
        self.user = get_user_model().objects.create_user(username="quiz-reader")
        self.other = get_user_model().objects.create_user(username="quiz-other")
        for index in range(6):
            GlossaryTerm.objects.create(
                term=f"Atama {index}",
                slug=f"term-{index}",
                aliases=[f"Term {index}"],
                short_definition=f"Definition {index}",
                definition=f"Long definition {index}",
            )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def question(self, client=None):
        client = client or self.client
        response = client.post("/api/v1/glossary/questions/", {}, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertNotIn("correct_answer", response.data)
        self.assertEqual(len(set(response.data["options"])), 4)
        return GlossaryQuizQuestion.objects.get(pk=response.data["id"])

    def payload(self, question, correct=True):
        return {
            "question_id": str(question.pk),
            "client_answer_id": str(uuid.uuid4()),
            "selected_answer": question.correct_answer
            if correct
            else next(item for item in question.options if item != question.correct_answer),
        }

    def submit(self, payload, client=None):
        return (client or self.client).post("/api/v1/glossary/score/", payload, format="json")

    def test_issued_question_is_reused_and_correctness_is_computed_by_server(self):
        question = self.question()
        self.assertEqual(self.question().pk, question.pk)
        payload = self.payload(question, correct=False)
        payload["is_correct"] = True
        response = self.submit(payload)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["answer"]["is_correct"])
        self.assertEqual(response.data["answer"]["correct_answer"], question.correct_answer)
        self.assertNotEqual(self.question().pk, question.pk)

    def test_score_streaks_and_every_answer_are_durable(self):
        for correct in (True, True, False, True):
            response = self.submit(self.payload(self.question(), correct=correct))
            self.assertEqual(response.status_code, 200)
        score = GlossaryQuizScore.objects.get(user=self.user)
        self.assertEqual((score.correct_answers, score.total_answers), (3, 4))
        self.assertEqual((score.current_streak, score.best_streak), (1, 2))
        self.assertEqual(GlossaryQuizAnswer.objects.filter(user=self.user).count(), 4)
        self.assertEqual(response.data["personal"]["percent"], 75)

    def test_retries_cannot_change_result_or_count_question_twice(self):
        question = self.question()
        payload = self.payload(question)
        first = self.submit(payload)
        retry = self.submit(payload)
        conflicting = self.payload(question, correct=False)
        conflicting["client_answer_id"] = payload["client_answer_id"]
        self.assertEqual(first.data, retry.data)
        self.assertEqual(first.data, self.submit(conflicting).data)
        self.assertEqual(first.data, self.submit(self.payload(question, correct=False)).data)
        self.assertEqual(GlossaryQuizAnswer.objects.count(), 1)
        self.assertEqual(GlossaryQuizScore.objects.get(user=self.user).total_answers, 1)

    def test_question_ownership_expiry_options_and_legacy_payload_are_enforced(self):
        question = self.question()
        self.client.force_authenticate(self.other)
        self.assertEqual(self.submit(self.payload(question)).status_code, 400)
        self.client.force_authenticate(self.user)
        payload = self.payload(question)
        payload["selected_answer"] = "Not one of the options"
        self.assertEqual(self.submit(payload).status_code, 400)
        GlossaryQuizQuestion.objects.filter(pk=question.pk).update(
            expires_at=timezone.now() - timedelta(seconds=1)
        )
        self.assertEqual(self.submit(self.payload(question)).status_code, 400)
        self.assertEqual(
            self.submit({"client_answer_id": "forged", "is_correct": True}).status_code, 400
        )
        self.assertFalse(GlossaryQuizScore.objects.exists())

    def test_client_answer_id_cannot_be_reused_for_another_question(self):
        first = self.payload(self.question())
        self.assertEqual(self.submit(first).status_code, 200)
        second = self.payload(self.question())
        second["client_answer_id"] = first["client_answer_id"]
        self.assertEqual(self.submit(second).status_code, 400)

    def test_question_requires_authenticated_user_and_sufficient_public_terms(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.post("/api/v1/glossary/questions/", {}).status_code, 401)
        self.assertEqual(self.submit({}).status_code, 401)
        self.client.force_authenticate(self.user)
        GlossaryTerm.objects.update(is_published=False)
        self.assertEqual(self.client.post("/api/v1/glossary/questions/", {}).status_code, 400)

    def test_idempotency_survives_guest_resume_and_upgrade(self):
        anonymous = APIClient()
        created = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        self.assertEqual(created.status_code, 201)
        guest = APIClient()
        guest.credentials(HTTP_AUTHORIZATION=f"Bearer {created.data['access']}")
        payload = self.payload(self.question(guest))
        self.assertEqual(self.submit(payload, guest).status_code, 200)
        resumed = anonymous.post(
            "/api/v1/auth/guest/", {"session_token": created.data["session_token"]}, format="json"
        )
        self.assertEqual(resumed.status_code, 200)
        guest.credentials(HTTP_AUTHORIZATION=f"Bearer {resumed.data['access']}")
        self.assertEqual(self.submit(payload, guest).status_code, 200)
        upgraded = guest.post(
            "/api/v1/auth/guest/upgrade/", {"username": "quiz_upgraded"}, format="json"
        )
        self.assertEqual(upgraded.status_code, 200)
        guest.credentials(HTTP_AUTHORIZATION=f"Bearer {upgraded.data['access']}")
        self.assertEqual(self.submit(payload, guest).status_code, 200)
        self.assertEqual(GlossaryQuizAnswer.objects.count(), 1)

    def test_ranking_is_bounded_and_personal_rank_matches_complete_order(self):
        for index in range(8):
            user = get_user_model().objects.create_user(username=f"rank-{index}")
            GlossaryQuizScore.objects.create(
                user=user, correct_answers=10 - index, total_answers=10
            )
        GlossaryQuizScore.objects.create(user=self.user, correct_answers=1, total_answers=10)
        with self.assertNumQueries(4):
            response = self.client.get("/api/v1/glossary/leaderboard/")
        self.assertEqual(len(response.data["leaderboard"]), 3)
        self.assertEqual(response.data["personal"]["rank"], 9)
        self.assertEqual(response.data["participant_count"], 9)

    def test_ranking_runs_after_write_service_returns(self):
        from apps.engagement.views import quiz as views

        events = []
        original_submit = views.submit_quiz_answer
        original_state = views.quiz_state_payload

        def submit(*args, **kwargs):
            result = original_submit(*args, **kwargs)
            events.append("write-complete")
            return result

        def state(user):
            self.assertEqual(events, ["write-complete"])
            return original_state(user)

        payload = self.payload(self.question())
        with (
            patch.object(views, "submit_quiz_answer", side_effect=submit),
            patch.object(views, "quiz_state_payload", side_effect=state),
        ):
            self.assertEqual(self.submit(payload).status_code, 200)

    def test_schema_documents_issued_question_and_validated_answer(self):
        schema = self.client.get("/api/schema/?format=json")
        self.assertEqual(schema.status_code, 200)
        operation = schema.data["paths"]["/api/v1/glossary/score/"]["post"]
        ref = operation["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        request = schema.data["components"]["schemas"][ref.rsplit("/", 1)[-1]]
        self.assertEqual(
            set(request["required"]), {"client_answer_id", "question_id", "selected_answer"}
        )
        self.assertIn("/api/v1/glossary/questions/", schema.data["paths"])
