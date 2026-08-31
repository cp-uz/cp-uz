import uuid
from hashlib import sha256

from django.conf import settings
from django.db import models

from apps.articles.models import Article, TimeStampedModel


class EditProposal(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Qoralama"
        SUBMITTED = "submitted", "Yuborilgan"
        IN_REVIEW = "in_review", "Ko‘rib chiqilmoqda"
        CHANGES_REQUESTED = "changes_requested", "O‘zgartirish so‘ralgan"
        APPROVED = "approved", "Tasdiqlangan"
        REJECTED = "rejected", "Rad etilgan"
        MERGED = "merged", "Qo‘shilgan"
        WITHDRAWN = "withdrawn", "Qaytarib olingan"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="edit_proposals")
    submitter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="edit_proposals"
    )
    base_content_hash = models.CharField(max_length=64)
    proposed_title = models.CharField(max_length=240)
    proposed_summary = models.TextField()
    proposed_content = models.TextField()
    proposal_hash = models.CharField(max_length=64, editable=False, db_index=True)
    change_summary = models.TextField()
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.DRAFT)
    github_pr_url = models.URLField(blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-updated_at",)
        indexes = [
            models.Index(fields=("status", "created_at"), name="proposal_status_idx"),
            models.Index(fields=("article", "status"), name="proposal_article_idx"),
        ]

    def save(self, *args, **kwargs):
        payload = "\n".join(
            (self.proposed_title, self.proposed_summary, self.proposed_content)
        ).encode("utf-8")
        self.proposal_hash = sha256(payload).hexdigest()
        if not self.base_content_hash and self.article_id:
            self.base_content_hash = self.article.content_hash
        super().save(*args, **kwargs)

    @property
    def is_stale(self) -> bool:
        return self.base_content_hash != self.article.content_hash

    def __str__(self) -> str:
        return f"{self.article} — {self.submitter}"


class ReviewRecord(models.Model):
    class Stage(models.TextChoices):
        TECHNICAL = "technical", "Texnik review"
        LANGUAGE = "language", "Til reviewi"
        EDITORIAL = "editorial", "Tahririy review"

    class Decision(models.TextChoices):
        APPROVED = "approved", "Tasdiqlandi"
        CHANGES_REQUESTED = "changes_requested", "O‘zgartirish so‘raldi"
        REJECTED = "rejected", "Rad etildi"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="review_records")
    proposal = models.ForeignKey(
        EditProposal,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reviews",
    )
    stage = models.CharField(max_length=20, choices=Stage.choices)
    decision = models.CharField(max_length=30, choices=Decision.choices)
    content_hash = models.CharField(max_length=64, db_index=True)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="review_records"
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(
                fields=("article", "content_hash", "stage", "decision"),
                name="review_current_state_idx",
            )
        ]

    @property
    def is_current(self) -> bool:
        target_hash = self.proposal.proposal_hash if self.proposal_id else self.article.content_hash
        return self.content_hash == target_hash

    def save(self, *args, **kwargs):
        if self.pk and ReviewRecord.objects.filter(pk=self.pk).exists():
            raise ValueError("Review tarixi o‘zgartirilmaydi; yangi review yozuvi yarating.")
        if not self.content_hash:
            self.content_hash = (
                self.proposal.proposal_hash if self.proposal_id else self.article.content_hash
            )
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("Review tarixi o‘chirilmaydi.")

    def __str__(self) -> str:
        return f"{self.article}: {self.get_stage_display()} — {self.get_decision_display()}"


class ProposalStatusEvent(models.Model):
    proposal = models.ForeignKey(
        EditProposal, on_delete=models.CASCADE, related_name="status_events"
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="proposal_status_events",
    )
    from_status = models.CharField(max_length=30, choices=EditProposal.Status.choices)
    to_status = models.CharField(max_length=30, choices=EditProposal.Status.choices)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("created_at",)

    def save(self, *args, **kwargs):
        if self.pk and ProposalStatusEvent.objects.filter(pk=self.pk).exists():
            raise ValueError("Status tarixi o‘zgartirilmaydi.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("Status tarixi o‘chirilmaydi.")

    def __str__(self) -> str:
        return f"{self.proposal}: {self.from_status} → {self.to_status}"
