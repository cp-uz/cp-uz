import uuid

from django.db import models


class FeedbackSubmission(models.Model):
    class DeliveryStatus(models.TextChoices):
        PENDING = "pending", "Kutilmoqda"
        SENT = "sent", "Telegram’ga yuborildi"
        FAILED = "failed", "Yuborilmadi"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=160)
    contact = models.CharField(max_length=255, blank=True)
    note = models.TextField(max_length=3000)
    delivery_status = models.CharField(
        max_length=16,
        choices=DeliveryStatus.choices,
        default=DeliveryStatus.PENDING,
    )
    telegram_message_id = models.BigIntegerField(blank=True, null=True)
    delivery_error = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("delivery_status", "created_at"), name="feedback_delivery_idx")
        ]

    def __str__(self):
        return f"{self.full_name} — {self.created_at:%Y-%m-%d %H:%M}"
