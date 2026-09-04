from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models

from apps.seasons.models import Event, PublicationStatus
from common.models import TimeStampedModel

from .choices import ProblemType, StatementPdfProvenance, TranslationStatus


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

    def clean(self):
        super().clean()
        previous = type(self).objects.filter(pk=self.pk).values_list("event_id", flat=True).first()
        if previous and previous != self.event_id and self.problems.exists():
            raise ValidationError(
                {"event": "Masalali to‘plamni boshqa tadbirga ko‘chirish mumkin emas."}
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Problem(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem_set = models.ForeignKey(ProblemSet, on_delete=models.CASCADE, related_name="problems")
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="problems", editable=False
    )
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
            models.UniqueConstraint(fields=("event", "slug"), name="unique_event_problem_slug"),
            models.UniqueConstraint(
                fields=("problem_set", "slug"), name="unique_problem_set_problem_slug"
            ),
            models.UniqueConstraint(
                fields=("problem_set", "code"), name="unique_problem_set_problem_code"
            ),
        ]
        indexes = [models.Index(fields=("publication_status", "problem_set", "order"))]

    def clean(self):
        super().clean()
        if self.problem_set_id:
            self.event_id = self.problem_set.event_id

    def full_clean(self, *args, **kwargs):
        if self.problem_set_id:
            self.event_id = self.problem_set.event_id
        return super().full_clean(*args, **kwargs)

    def save(self, *args, **kwargs):
        self.event_id = self.problem_set.event_id
        if kwargs.get("update_fields") is not None:
            kwargs["update_fields"] = set(kwargs["update_fields"]) | {"event"}
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.problem_set}: {self.code} — {self.title}"
