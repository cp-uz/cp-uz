from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from ..models import EditProposal, ProposalStatusEvent, ReviewRecord
from .review_state import approved_review_stages

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


EDITABLE_STATUSES = {EditProposal.Status.DRAFT, EditProposal.Status.CHANGES_REQUESTED}


@transaction.atomic
def update_proposal(proposal, changes):
    proposal = EditProposal.objects.select_for_update().get(pk=proposal.pk)
    if proposal.status not in EDITABLE_STATUSES:
        raise ValidationError({"status": "Faqat qoralama yoki qaytarilgan taklif tahrirlanadi."})
    if "article" in changes and changes["article"].pk != proposal.article_id:
        raise ValidationError({"article_slug": "Taklifning maqolasini almashtirib bo‘lmaydi."})
    allowed = {"proposed_title", "proposed_summary", "proposed_content", "change_summary"}
    for field in allowed & changes.keys():
        setattr(proposal, field, changes[field])
    proposal.save()
    return proposal


@transaction.atomic
def transition_proposal(proposal, target_status, actor, note=""):
    proposal = EditProposal.objects.select_for_update().get(pk=proposal.pk)
    if not getattr(actor, "is_authenticated", False):
        raise PermissionDenied("Autentifikatsiya talab qilinadi.")
    if target_status in {EditProposal.Status.SUBMITTED, EditProposal.Status.WITHDRAWN}:
        if not actor.is_staff and actor.pk != proposal.submitter_id:
            raise PermissionDenied("Bu taklif sizga tegishli emas.")
    elif not actor.is_staff:
        raise PermissionDenied("Bu amal moderatorga tegishli.")
    if target_status not in ALLOWED_TRANSITIONS.get(proposal.status, set()):
        raise ValidationError(
            {"status": f"{proposal.status} holatidan {target_status} holatiga o‘tib bo‘lmaydi."}
        )

    if target_status in {EditProposal.Status.APPROVED, EditProposal.Status.MERGED}:
        required = {ReviewRecord.Stage.TECHNICAL, ReviewRecord.Stage.LANGUAGE}
        if not required.issubset(approved_review_stages(proposal)):
            raise ValidationError({"status": "Joriy texnik va til tasdiqlari talab qilinadi."})

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
