from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models

from common.models import TimeStampedModel

from .catalog import Problem


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
