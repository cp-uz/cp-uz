from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import EditProposal, ProposalStatusEvent, ReviewRecord

ALLOWED_TRANSITIONS = {
    EditProposal.Status.DRAFT: {EditProposal.Status.SUBMITTED, EditProposal.Status.WITHDRAWN},
    EditProposal.Status.CHANGES_REQUESTED: {
        EditProposal.Status.SUBMITTED,
        EditProposal.Status.WITHDRAWN,
    },
    EditProposal.Status.SUBMITTED: {
        EditProposal.Status.IN_REVIEW,
        EditProposal.Status.WITHDRAWN,
    },
    EditProposal.Status.IN_REVIEW: {
        EditProposal.Status.CHANGES_REQUESTED,
        EditProposal.Status.APPROVED,
        EditProposal.Status.REJECTED,
    },
    EditProposal.Status.APPROVED: {EditProposal.Status.MERGED},
}


@transaction.atomic
def transition_proposal(proposal, target_status, actor, note=""):
    proposal = EditProposal.objects.select_for_update().get(pk=proposal.pk)
    if target_status not in ALLOWED_TRANSITIONS.get(proposal.status, set()):
        raise ValidationError(
            {"status": f"{proposal.status} holatidan {target_status} holatiga o‘tib bo‘lmaydi."}
        )

    previous = proposal.status
    proposal.status = target_status
    update_fields = ["status", "updated_at"]
    if target_status == EditProposal.Status.SUBMITTED:
        proposal.submitted_at = timezone.now()
        update_fields.append("submitted_at")
    if target_status in {
        EditProposal.Status.REJECTED,
        EditProposal.Status.MERGED,
        EditProposal.Status.WITHDRAWN,
    }:
        proposal.resolved_at = timezone.now()
        update_fields.append("resolved_at")
    proposal.save(update_fields=update_fields)
    ProposalStatusEvent.objects.create(
        proposal=proposal,
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        from_status=previous,
        to_status=target_status,
        note=note,
    )
    return proposal


@transaction.atomic
def review_proposal(proposal, reviewer, stage, decision, notes=""):
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
        approved_stages = set(
            ReviewRecord.objects.filter(
                proposal=proposal,
                content_hash=proposal.proposal_hash,
                decision=ReviewRecord.Decision.APPROVED,
            ).values_list("stage", flat=True)
        )
        required = {ReviewRecord.Stage.TECHNICAL, ReviewRecord.Stage.LANGUAGE}
        if required.issubset(approved_stages):
            transition_proposal(proposal, EditProposal.Status.APPROVED, reviewer, notes)
    return review
