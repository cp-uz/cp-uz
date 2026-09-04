import uuid

from django.db import models

from .user import User


class GuestSession(models.Model):
    """Opaque, per-browser identity for anonymous learning progress."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="guest_session")
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    secret_hash = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-last_seen_at",)
        indexes = [models.Index(fields=("last_seen_at",), name="guest_last_seen_idx")]

    def __str__(self) -> str:
        return f"Guest {self.public_id}"
