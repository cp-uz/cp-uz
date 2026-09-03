from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models

from apps.seasons.models import Event, PublicationStatus, TimeStampedModel


class TranslationStatus(models.TextChoices):
    AI_TRANSLATION = "ai_translation", "AI-tarjima"
    REVIEWED_TRANSLATION = "reviewed_translation", "Tekshiruvdan o‘tgan tarjima"
    ORIGINAL_UZBEK = "original_uzbek", "O‘zbekcha original"


class ProblemType(models.TextChoices):
    STANDARD = "standard", "Standart"
    INTERACTIVE = "interactive", "Interaktiv"
    OUTPUT_ONLY = "output_only", "Faqat output"
    COMMUNICATION = "communication", "Kommunikatsion"
    TWO_STEP = "two_step", "Ikki bosqichli"


class StatementPdfProvenance(models.TextChoices):
    OFFICIAL = "official", "Rasmiy"
    GENERATED = "generated", "cp.uz tayyorlagan"


class ProblemSet(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="problem_sets")
    slug = models.SlugField(max_length=120)
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    date_label = models.CharField(max_length=80, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    publication_status = models.CharField(
        max_length=20, choices=PublicationStatus.choices, default=PublicationStatus.DRAFT
    )

    class Meta:
        ordering = ("order", "title")
        constraints = [
            models.UniqueConstraint(fields=("event", "slug"), name="unique_event_problem_set_slug")
        ]
        indexes = [models.Index(fields=("event", "publication_status", "order"))]

    def __str__(self) -> str:
        return f"{self.event}: {self.title}"


class Problem(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem_set = models.ForeignKey(ProblemSet, on_delete=models.CASCADE, related_name="problems")
    slug = models.SlugField(max_length=180)
    code = models.CharField(max_length=30)
    title = models.CharField(max_length=240)
    original_title = models.CharField(max_length=240, blank=True)
    statement_markdown = models.TextField()
    source_path = models.CharField(max_length=400, blank=True)
    statement_pdf_url = models.URLField(max_length=1000, blank=True)
    statement_pdf_sha256 = models.CharField(max_length=64, blank=True)
    statement_pdf_size_bytes = models.PositiveIntegerField(null=True, blank=True)
    statement_pdf_page_count = models.PositiveSmallIntegerField(null=True, blank=True)
    statement_pdf_language = models.CharField(max_length=8, blank=True)
    statement_pdf_provenance = models.CharField(
        max_length=20,
        choices=StatementPdfProvenance.choices,
        blank=True,
    )
    translation_status = models.CharField(
        max_length=30,
        choices=TranslationStatus.choices,
        default=TranslationStatus.AI_TRANSLATION,
    )
    problem_type = models.CharField(
        max_length=30, choices=ProblemType.choices, default=ProblemType.STANDARD
    )
    time_limit_ms = models.PositiveIntegerField(null=True, blank=True)
    memory_limit_mb = models.PositiveIntegerField(null=True, blank=True)
    max_score = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    difficulty_label = models.CharField(max_length=80, blank=True)
    tags = models.JSONField(default=list, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    publication_status = models.CharField(
        max_length=20, choices=PublicationStatus.choices, default=PublicationStatus.DRAFT
    )
    last_verified_on = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ("problem_set__order", "order", "code", "title")
        constraints = [
            models.UniqueConstraint(
                fields=("problem_set", "slug"), name="unique_problem_set_problem_slug"
            ),
            models.UniqueConstraint(
                fields=("problem_set", "code"), name="unique_problem_set_problem_code"
            ),
        ]
        indexes = [models.Index(fields=("publication_status", "problem_set", "order"))]

    @property
    def event(self) -> Event:
        return self.problem_set.event

    def __str__(self) -> str:
        return f"{self.problem_set}: {self.code} — {self.title}"


class ProblemLink(TimeStampedModel):
    class Kind(models.TextChoices):
        ORIGINAL = "original", "Original shart"
        PRACTICE = "practice", "Yechish"
        EDITORIAL = "editorial", "Tahlil"
        PACKAGE = "package", "Masala paketi"
        SOLUTION = "solution", "Yechim"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="links")
    kind = models.CharField(max_length=20, choices=Kind.choices)
    title = models.CharField(max_length=160)
    url = models.URLField(max_length=1000)
    platform = models.CharField(max_length=80, blank=True)
    is_official = models.BooleanField(default=False)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "title")
        constraints = [
            models.UniqueConstraint(
                fields=("problem", "kind", "url"), name="unique_problem_link_kind_url"
            )
        ]

    def clean(self):
        if self.is_primary and self.kind not in {self.Kind.ORIGINAL, self.Kind.PRACTICE}:
            raise ValidationError(
                {"is_primary": "Faqat original yoki yechish havolasi asosiy bo‘ladi."}
            )

    def __str__(self) -> str:
        return f"{self.problem}: {self.title}"


class ProblemAttachment(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="attachments")
    title = models.CharField(max_length=160)
    url = models.URLField(max_length=1000)
    content_type = models.CharField(max_length=120, blank=True)
    size_bytes = models.PositiveIntegerField(null=True, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "title")
        constraints = [
            models.UniqueConstraint(fields=("problem", "url"), name="unique_problem_attachment_url")
        ]

    def __str__(self) -> str:
        return f"{self.problem}: {self.title}"
