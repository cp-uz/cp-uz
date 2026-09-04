from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from apps.articles.models import Article, Category
from apps.contributions.admin import EditProposalAdmin
from apps.contributions.models import EditProposal
from apps.contributions.services import review_proposal, transition_proposal, update_proposal


class ProposalInvariantTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="proposal-author")
        self.staff = get_user_model().objects.create_user(username="proposal-staff", is_staff=True)
        article = Article.objects.create(
            title="Article",
            slug="article",
            summary="Summary",
            content="Content",
            category=Category.objects.create(name="Category", slug="proposal-category"),
            visibility="public",
        )
        self.proposal = EditProposal.objects.create(
            article=article,
            submitter=self.user,
            proposed_title="Title",
            proposed_summary="Summary",
            proposed_content="Content",
            change_summary="Sufficient change summary",
            status="submitted",
        )

    def test_revoked_stage_approval_cannot_approve_resubmitted_same_content(self):
        review_proposal(self.proposal, self.staff, "technical", "approved")
        review_proposal(self.proposal, self.staff, "technical", "changes_requested")
        transition_proposal(self.proposal, "submitted", self.user)
        review_proposal(self.proposal, self.staff, "language", "approved")
        self.proposal.refresh_from_db()
        self.assertEqual(self.proposal.status, "in_review")
        with self.assertRaises(ValidationError):
            transition_proposal(self.proposal, "approved", self.staff)
        review_proposal(self.proposal, self.staff, "technical", "approved")
        self.proposal.refresh_from_db()
        self.assertEqual(self.proposal.status, "approved")

    def test_staff_cannot_edit_approved_content_and_admin_status_is_readonly(self):
        review_proposal(self.proposal, self.staff, "technical", "approved")
        review_proposal(self.proposal, self.staff, "language", "approved")
        self.proposal.refresh_from_db()
        client = APIClient()
        client.force_authenticate(self.staff)
        response = client.patch(
            f"/api/v1/contributions/proposals/{self.proposal.pk}/",
            {"proposed_content": "Unreviewed content"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)
        request = RequestFactory().get("/")
        request.user = self.staff
        fields = EditProposalAdmin(EditProposal, admin.site).get_readonly_fields(
            request, self.proposal
        )
        self.assertIn("status", fields)
        self.assertIn("proposed_content", fields)

    def test_edit_service_reloads_status_and_admin_edits_hash_bound_drafts(self):
        review_proposal(self.proposal, self.staff, "technical", "changes_requested")
        self.proposal.refresh_from_db()
        stale = EditProposal.objects.get(pk=self.proposal.pk)
        old_hash = stale.proposal_hash
        request = RequestFactory().post("/")
        request.user = self.staff
        stale.proposed_content = "Updated draft content"
        EditProposalAdmin(EditProposal, admin.site).save_model(request, stale, None, True)
        self.proposal.refresh_from_db()
        self.assertNotEqual(self.proposal.proposal_hash, old_hash)
        self.assertEqual(self.proposal.status, "changes_requested")
        transition_proposal(self.proposal, "submitted", self.user)
        with self.assertRaises(ValidationError):
            update_proposal(stale, {"proposed_content": "A concurrent stale edit"})

    def test_draft_cannot_retarget_to_a_different_article(self):
        review_proposal(self.proposal, self.staff, "technical", "changes_requested")
        other = Article.objects.create(
            title="Other",
            slug="other",
            content="Content",
            summary="Summary",
            category=self.proposal.article.category,
            visibility="public",
        )
        client = APIClient()
        client.force_authenticate(self.user)
        response = client.patch(
            f"/api/v1/contributions/proposals/{self.proposal.pk}/",
            {"article_slug": other.slug},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_owner_can_edit_returned_proposal_then_resubmit_new_hash(self):
        review_proposal(self.proposal, self.staff, "technical", "changes_requested")
        client = APIClient()
        client.force_authenticate(self.user)
        response = client.patch(
            f"/api/v1/contributions/proposals/{self.proposal.pk}/",
            {"proposed_content": "Corrected content"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["proposed_content"], "Corrected content")
        response = client.post(
            f"/api/v1/contributions/proposals/{self.proposal.pk}/submit/", {}, format="json"
        )
        self.assertEqual(response.status_code, 200)
