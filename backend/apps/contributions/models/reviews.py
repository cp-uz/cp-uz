import uuid

from django.conf import settings
from django.db import models

from apps.articles.models import Article

from .proposals import EditProposal


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
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="review_records",
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
