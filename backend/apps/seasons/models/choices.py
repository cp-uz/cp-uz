from __future__ import annotations

from django.db import models


class PublicationStatus(models.TextChoices):
    DRAFT = "draft", "Qoralama"
    PUBLISHED = "published", "Nashr qilingan"
    ARCHIVED = "archived", "Arxivlangan"


class VerificationStatus(models.TextChoices):
    UNVERIFIED = "unverified", "Tekshirilmagan"
    PENDING = "pending", "Tekshiruv kutilmoqda"
    VERIFIED = "verified", "Tekshirilgan"
    DISPUTED = "disputed", "Aniqlashtirilmoqda"


class LineStyle(models.TextChoices):
    SOLID = "solid", "Uzluksiz"
    DASHED = "dashed", "Uzlukli"
    DOTTED = "dotted", "Nuqtali"
