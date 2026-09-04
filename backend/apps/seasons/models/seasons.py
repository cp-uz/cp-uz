from __future__ import annotations

import uuid
from typing import Any

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from common.models import TimeStampedModel

from .choices import LineStyle, PublicationStatus, VerificationStatus


class SeasonQuerySet(models.QuerySet):
    def published(self):
        return self.filter(publication_status=PublicationStatus.PUBLISHED)


class Season(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=40, unique=True)
    summary = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    publication_status = models.CharField(
        max_length=20, choices=PublicationStatus.choices, default=PublicationStatus.DRAFT
    )
    verification_status = models.CharField(
        max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.UNVERIFIED
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    objects = SeasonQuerySet.as_manager()

    class Meta:
        ordering = ("-is_featured", "-order", "-start_date")
        indexes = [
            models.Index(
                fields=("publication_status", "is_featured", "order"),
                name="season_public_feature_idx",
            )
        ]

    def clean(self):
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError(
                {"end_date": "Mavsum tugash sanasi boshlanishidan oldin bo‘la olmaydi."}
            )

    def save(self, *args: Any, **kwargs: Any):
        if self.publication_status == PublicationStatus.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        if self.verification_status == VerificationStatus.VERIFIED and self.verified_at is None:
            self.verified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class Route(TimeStampedModel):
    class Kind(models.TextChoices):
        OFFICIAL = "official", "Rasmiy olimpiada"
        SELECTION = "selection", "Saralash"
        INTERNATIONAL = "international", "Xalqaro olimpiada"
        UNOFFICIAL = "unofficial", "Norasmiy musobaqa"
        TRAINING = "training", "Rasmiy tayyorgarlik"

    class Color(models.TextChoices):
        BLUE = "blue", "Ko‘k"
        RED = "red", "Qizil"
        BROWN = "brown", "Jigarrang"
        TEAL = "teal", "Teal"
        GOLD = "gold", "Oltin"
        PURPLE = "purple", "Binafsha"
        GREEN = "green", "Yashil"
        NEUTRAL = "neutral", "Neytral"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name="routes")
    code = models.CharField(max_length=30)
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    kind = models.CharField(max_length=20, choices=Kind.choices)
    color = models.CharField(max_length=20, choices=Color.choices, default=Color.NEUTRAL)
    line_style = models.CharField(max_length=10, choices=LineStyle.choices, default=LineStyle.SOLID)
    icon = models.CharField(max_length=80, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ("order", "title")
        constraints = [
            models.UniqueConstraint(fields=("season", "code"), name="unique_season_route_code")
        ]
        indexes = [models.Index(fields=("season", "order"), name="route_season_order_idx")]

    def __str__(self) -> str:
        return f"{self.season.slug}: {self.title}"
