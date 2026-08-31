import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Language(models.TextChoices):
        UZBEK = "uz-latn", "O‘zbekcha"
        RUSSIAN = "ru", "Русский"
        ENGLISH = "en", "English"

    display_name = models.CharField("ko‘rinadigan ism", max_length=120, blank=True)
    bio = models.TextField("qisqacha ma’lumot", blank=True)
    avatar_url = models.URLField("avatar manzili", blank=True)
    github_url = models.URLField("GitHub manzili", blank=True)
    preferred_language = models.CharField(
        "tanlangan til", max_length=10, choices=Language.choices, default=Language.UZBEK
    )
    public_profile = models.BooleanField("profil ochiq", default=True)

    @property
    def name(self) -> str:
        return self.display_name or self.get_full_name() or self.username

    @property
    def is_guest(self) -> bool:
        return hasattr(self, "guest_session")

    def __str__(self) -> str:
        return self.name


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
