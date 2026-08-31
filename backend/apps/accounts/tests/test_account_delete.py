import uuid

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

from apps.accounts.models import GuestSession
from apps.articles.models import Article, Category
from apps.contributions.models import EditProposal, ProposalStatusEvent, ReviewRecord
from apps.engagement.models import (
    Bookmark,
    GlossaryQuizAnswer,
    GlossaryQuizScore,
    PersonalNote,
    ReadingProgress,
)


class AccountDeleteTests(TestCase):
    def setUp(self):
        category = Category.objects.create(name="Akkaunt testi", slug="account-delete-test")
        self.article = Article.objects.create(
            title="Akkauntni o‘chirish testi",
            slug="account-delete--article",
            canonical_path="account-delete/article",
            summary="Cascade o‘chirishni tekshirish uchun maqola.",
            content="# Test",
            category=category,
            visibility=Article.Visibility.PUBLIC,
        )

    def _add_engagement(self, user):
        Bookmark.objects.create(user=user, article=self.article)
        ReadingProgress.objects.create(user=user, article=self.article, percent=40)
        PersonalNote.objects.create(user=user, article=self.article, body="Shaxsiy qayd")
        GlossaryQuizScore.objects.create(
            user=user,
            correct_answers=1,
            total_answers=1,
            current_streak=1,
            best_streak=1,
        )
        GlossaryQuizAnswer.objects.create(
            user=user,
            client_answer_id=str(uuid.uuid4()),
            is_correct=True,
        )

    def test_real_account_hard_delete_cascades_private_data_and_preserves_other_users(self):
        User = get_user_model()
        victim = User.objects.create_user(username="delete_me", password="Strong-Pass-2026!")
        survivor = User.objects.create_user(username="keep_me", password="Strong-Pass-2026!")
        self._add_engagement(victim)
        self._add_engagement(survivor)
        proposal = EditProposal.objects.create(
            article=self.article,
            submitter=survivor,
            base_content_hash=self.article.content_hash,
            proposed_title=self.article.title,
            proposed_summary=self.article.summary,
            proposed_content=self.article.content,
            change_summary="Audit tarixini saqlash testi",
            status=EditProposal.Status.IN_REVIEW,
        )
        review = ReviewRecord.objects.create(
            article=self.article,
            proposal=proposal,
            stage=ReviewRecord.Stage.TECHNICAL,
            decision=ReviewRecord.Decision.APPROVED,
            content_hash=proposal.proposal_hash,
            reviewer=victim,
        )
        status_event = ProposalStatusEvent.objects.create(
            proposal=proposal,
            actor=victim,
            from_status=EditProposal.Status.SUBMITTED,
            to_status=EditProposal.Status.IN_REVIEW,
        )

        login = APIClient().post(
            "/api/v1/auth/login/",
            {"username": victim.username, "password": "Strong-Pass-2026!"},
            format="json",
        )
        survivor_login = APIClient().post(
            "/api/v1/auth/login/",
            {"username": survivor.username, "password": "Strong-Pass-2026!"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        self.assertEqual(survivor_login.status_code, 200)
        self.assertTrue(OutstandingToken.objects.filter(user=victim).exists())
        self.assertTrue(OutstandingToken.objects.filter(user=survivor).exists())
        access = login.data["access"]

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        deleted = client.delete(
            "/api/v1/auth/account/",
            {"confirmation": "O‘CHIRISH", "password": "Strong-Pass-2026!"},
            format="json",
        )

        self.assertEqual(deleted.status_code, 204)
        self.assertEqual(deleted.content, b"")
        self.assertFalse(User.objects.filter(pk=victim.pk).exists())
        self.assertFalse(Bookmark.objects.filter(user_id=victim.pk).exists())
        self.assertFalse(ReadingProgress.objects.filter(user_id=victim.pk).exists())
        self.assertFalse(PersonalNote.objects.filter(user_id=victim.pk).exists())
        self.assertFalse(GlossaryQuizScore.objects.filter(user_id=victim.pk).exists())
        self.assertFalse(GlossaryQuizAnswer.objects.filter(user_id=victim.pk).exists())
        self.assertFalse(OutstandingToken.objects.filter(user_id=victim.pk).exists())

        self.assertTrue(User.objects.filter(pk=survivor.pk).exists())
        self.assertTrue(Bookmark.objects.filter(user=survivor).exists())
        self.assertTrue(ReadingProgress.objects.filter(user=survivor).exists())
        self.assertTrue(PersonalNote.objects.filter(user=survivor).exists())
        self.assertTrue(GlossaryQuizScore.objects.filter(user=survivor).exists())
        self.assertTrue(GlossaryQuizAnswer.objects.filter(user=survivor).exists())
        self.assertTrue(OutstandingToken.objects.filter(user=survivor).exists())
        self.assertTrue(EditProposal.objects.filter(pk=proposal.pk, submitter=survivor).exists())
        review.refresh_from_db()
        status_event.refresh_from_db()
        self.assertIsNone(review.reviewer_id)
        self.assertIsNone(status_event.actor_id)

        old_access = client.get("/api/v1/accounts/me/")
        self.assertEqual(old_access.status_code, 401)

    def test_guest_account_hard_delete_invalidates_guest_resume_and_cascades_data(self):
        anonymous = APIClient()
        created = anonymous.post("/api/v1/auth/guest/", {}, format="json")
        self.assertEqual(created.status_code, 201)
        user_id = created.data["user"]["id"]
        session_token = created.data["session_token"]
        access = created.data["access"]
        guest = get_user_model().objects.get(pk=user_id)
        self._add_engagement(guest)
        self.assertTrue(GuestSession.objects.filter(user=guest).exists())
        self.assertTrue(OutstandingToken.objects.filter(user=guest).exists())

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        deleted = client.delete(
            "/api/v1/auth/account/",
            {"confirmation": "O‘CHIRISH"},
            format="json",
        )

        self.assertEqual(deleted.status_code, 204)
        self.assertFalse(get_user_model().objects.filter(pk=user_id).exists())
        self.assertFalse(GuestSession.objects.filter(user_id=user_id).exists())
        self.assertFalse(Bookmark.objects.filter(user_id=user_id).exists())
        self.assertFalse(ReadingProgress.objects.filter(user_id=user_id).exists())
        self.assertFalse(PersonalNote.objects.filter(user_id=user_id).exists())
        self.assertFalse(GlossaryQuizScore.objects.filter(user_id=user_id).exists())
        self.assertFalse(GlossaryQuizAnswer.objects.filter(user_id=user_id).exists())
        self.assertFalse(OutstandingToken.objects.filter(user_id=user_id).exists())
        self.assertEqual(client.get("/api/v1/accounts/me/").status_code, 401)

        resume = anonymous.post(
            "/api/v1/auth/guest/",
            {"session_token": session_token},
            format="json",
        )
        self.assertEqual(resume.status_code, 401)

    def test_account_delete_requires_authentication_and_is_in_openapi_schema(self):
        unauthorized = APIClient().delete("/api/v1/auth/account/")
        self.assertEqual(unauthorized.status_code, 401)

        schema = APIClient().get("/api/schema/?format=json")
        self.assertEqual(schema.status_code, 200)
        operation = schema.data["paths"]["/api/v1/auth/account/"]["delete"]
        self.assertIn("Account", operation["tags"])
        self.assertIn("204", operation["responses"])
        request_ref = operation["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        request_schema = schema.data["components"]["schemas"][request_ref.rsplit("/", 1)[-1]]
        self.assertIn("confirmation", request_schema["required"])
        self.assertNotIn("password", request_schema["required"])
        self.assertTrue(request_schema["properties"]["password"]["writeOnly"])

    def test_real_account_delete_rejects_missing_or_wrong_confirmation_and_password(self):
        User = get_user_model()
        user = User.objects.create_user(username="protected", password="Strong-Pass-2026!")
        self._add_engagement(user)
        login = APIClient().post(
            "/api/v1/auth/login/",
            {"username": user.username, "password": "Strong-Pass-2026!"},
            format="json",
        )
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

        attempts = (
            {},
            {"confirmation": "o‘chirish", "password": "Strong-Pass-2026!"},
            {"confirmation": "O‘CHIRISH"},
            {"confirmation": "O‘CHIRISH", "password": "wrong-password"},
        )
        for payload in attempts:
            with self.subTest(payload=payload):
                response = client.delete("/api/v1/auth/account/", payload, format="json")
                self.assertEqual(response.status_code, 400)
                self.assertTrue(User.objects.filter(pk=user.pk).exists())

        self.assertTrue(Bookmark.objects.filter(user=user).exists())
        self.assertTrue(OutstandingToken.objects.filter(user=user).exists())

    def test_guest_account_delete_requires_exact_confirmation_but_not_password(self):
        created = APIClient().post("/api/v1/auth/guest/", {}, format="json")
        user_id = created.data["user"]["id"]
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {created.data['access']}")

        rejected = client.delete(
            "/api/v1/auth/account/",
            {"confirmation": "OCHIRISH"},
            format="json",
        )
        self.assertEqual(rejected.status_code, 400)
        self.assertTrue(get_user_model().objects.filter(pk=user_id).exists())

        deleted = client.delete(
            "/api/v1/auth/account/",
            {"confirmation": "O‘CHIRISH"},
            format="json",
        )
        self.assertEqual(deleted.status_code, 204)
        self.assertFalse(get_user_model().objects.filter(pk=user_id).exists())
