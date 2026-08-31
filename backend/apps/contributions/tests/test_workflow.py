from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.articles.models import Article, Category
from apps.contributions.models import EditProposal, ReviewRecord


class ProposalWorkflowTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.author = User.objects.create_user(username="author", password="pass-12345")
        self.reviewer = User.objects.create_user(
            username="reviewer", password="pass-12345", is_staff=True
        )
        category = Category.objects.create(name="Algebra", slug="algebra")
        self.article = Article.objects.create(
            title="EKUB",
            slug="algebra--euclid",
            canonical_path="algebra/euclid-algorithm",
            summary="Evklid algoritmi",
            content="# EKUB\n\nEski matn",
            category=category,
            visibility=Article.Visibility.PUBLIC,
        )

    def test_two_stage_hash_bound_review(self):
        client = APIClient()
        client.force_authenticate(self.author)
        created = client.post(
            "/api/v1/contributions/proposals/",
            {
                "article_slug": self.article.slug,
                "proposed_title": "Evklid algoritmi",
                "proposed_summary": "Aniqroq izoh",
                "proposed_content": "# EKUB\n\nYangi va to‘liq matn",
                "change_summary": "Terminlar va isbot yaxshilandi",
            },
            format="json",
        )
        self.assertEqual(created.status_code, 201)
        proposal_id = created.data["id"]
        submitted = client.post(
            f"/api/v1/contributions/proposals/{proposal_id}/submit/", {}, format="json"
        )
        self.assertEqual(submitted.status_code, 200)
        self.assertEqual(submitted.data["status"], EditProposal.Status.SUBMITTED)

        client.force_authenticate(self.reviewer)
        technical = client.post(
            f"/api/v1/contributions/proposals/{proposal_id}/review/",
            {"stage": "technical", "decision": "approved", "notes": "Texnik jihatdan to‘g‘ri."},
            format="json",
        )
        self.assertEqual(technical.status_code, 201)
        proposal = EditProposal.objects.get(pk=proposal_id)
        self.assertEqual(proposal.status, EditProposal.Status.IN_REVIEW)

        language = client.post(
            f"/api/v1/contributions/proposals/{proposal_id}/review/",
            {"stage": "language", "decision": "approved", "notes": "Til reviewidan o‘tdi."},
            format="json",
        )
        self.assertEqual(language.status_code, 201)
        proposal.refresh_from_db()
        self.assertEqual(proposal.status, EditProposal.Status.APPROVED)
        self.assertEqual(proposal.reviews.count(), 2)
        self.assertTrue(
            all(review.content_hash == proposal.proposal_hash for review in proposal.reviews.all())
        )
        self.assertEqual(proposal.status_events.count(), 3)

    def test_non_staff_cannot_review(self):
        proposal = EditProposal.objects.create(
            article=self.article,
            submitter=self.author,
            proposed_title=self.article.title,
            proposed_summary=self.article.summary,
            proposed_content=self.article.content,
            change_summary="Yetarlicha uzun izoh",
            status=EditProposal.Status.SUBMITTED,
        )
        client = APIClient()
        client.force_authenticate(self.author)
        response = client.post(
            f"/api/v1/contributions/proposals/{proposal.pk}/review/",
            {"stage": ReviewRecord.Stage.TECHNICAL, "decision": ReviewRecord.Decision.APPROVED},
            format="json",
        )
        self.assertEqual(response.status_code, 403)
