from django.db import transaction
from rest_framework.exceptions import PermissionDenied, ValidationError

from ..models import EditProposal, ReviewRecord
from .proposals import transition_proposal
from .review_state import approved_review_stages


@transaction.atomic
def review_proposal(proposal, reviewer, stage, decision, notes=""):
    if not getattr(reviewer, "is_staff", False):
        raise PermissionDenied("Faqat moderator taklifni baholaydi.")
    if stage not in ReviewRecord.Stage.values or decision not in ReviewRecord.Decision.values:
        raise ValidationError("Review bosqichi yoki qarori yaroqsiz.")
    proposal = EditProposal.objects.select_for_update().get(pk=proposal.pk)
    if proposal.status == EditProposal.Status.SUBMITTED:
        proposal = transition_proposal(
            proposal, EditProposal.Status.IN_REVIEW, reviewer, "Review boshlandi."
        )
    if proposal.status != EditProposal.Status.IN_REVIEW:
        raise ValidationError({"status": "Faqat review jarayonidagi taklif baholanadi."})

    review = ReviewRecord.objects.create(
        article=proposal.article,
        proposal=proposal,
        stage=stage,
        decision=decision,
        content_hash=proposal.proposal_hash,
        reviewer=reviewer,
        notes=notes,
    )

    if decision == ReviewRecord.Decision.CHANGES_REQUESTED:
        transition_proposal(proposal, EditProposal.Status.CHANGES_REQUESTED, reviewer, notes)
    elif decision == ReviewRecord.Decision.REJECTED:
        transition_proposal(proposal, EditProposal.Status.REJECTED, reviewer, notes)
    elif decision == ReviewRecord.Decision.APPROVED:
        approved_stages = approved_review_stages(proposal)
        required = {ReviewRecord.Stage.TECHNICAL, ReviewRecord.Stage.LANGUAGE}
        if required.issubset(approved_stages):
            transition_proposal(proposal, EditProposal.Status.APPROVED, reviewer, notes)
    return review
