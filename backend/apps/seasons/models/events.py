from __future__ import annotations

import uuid
from typing import Any

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.utils.text import slugify

from common.models import TimeStampedModel

from .choices import LineStyle, PublicationStatus, VerificationStatus
from .seasons import Route, Season


class EventQuerySet(models.QuerySet):
    def published(self):
        return self.filter(publication_status=PublicationStatus.PUBLISHED)


class Event(TimeStampedModel):
    class Type(models.TextChoices):
        STAGE = "stage", "Bosqich"
        SELECTION = "selection", "Saralash"
        TRAINING = "training", "Tayyorgarlik"
        INTERNATIONAL = "international", "Xalqaro olimpiada"
        UNOFFICIAL = "unofficial", "Norasmiy musobaqa"

    class Status(models.TextChoices):
        TBA = "tba", "E’lon qilinadi"
        SCHEDULED = "scheduled", "Rejalashtirilgan"
        LIVE = "live", "Davom etmoqda"
        COMPLETED = "completed", "Yakunlangan"
        POSTPONED = "postponed", "Qoldirilgan"
        CANCELLED = "cancelled", "Bekor qilingan"

    class DatePrecision(models.TextChoices):
        TBA = "tba", "Sana noma’lum"
        MONTH = "month", "Oy aniqligida"
        DAY = "day", "Kun aniqligida"
        RANGE = "range", "Sana oralig‘i"

    class Mode(models.TextChoices):
        TBA = "tba", "E’lon qilinadi"
        ONSITE = "onsite", "Joyida"
        ONLINE = "online", "Onlayn"
        HYBRID = "hybrid", "Gibrid"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name="events")
    code = models.CharField(max_length=30)
    slug = models.SlugField(max_length=180)
    title = models.CharField(max_length=240)
    short_title = models.CharField(max_length=120, blank=True)
    summary = models.TextField(blank=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=24, choices=Type.choices)
    publication_status = models.CharField(
        max_length=20, choices=PublicationStatus.choices, default=PublicationStatus.DRAFT
    )
    event_status = models.CharField(max_length=20, choices=Status.choices, default=Status.TBA)
    verification_status = models.CharField(
        max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.UNVERIFIED
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    date_precision = models.CharField(
        max_length=10, choices=DatePrecision.choices, default=DatePrecision.TBA
    )
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    date_label = models.CharField(max_length=120, blank=True)
    timezone = models.CharField(max_length=80, default="Asia/Tashkent", blank=True)
    location = models.CharField(max_length=180, blank=True)
    venue = models.CharField(max_length=200, blank=True)
    mode = models.CharField(max_length=10, choices=Mode.choices, default=Mode.TBA)
    platform = models.CharField(max_length=180, blank=True)
    organizer = models.CharField(max_length=240, blank=True)
    eligibility = models.TextField(blank=True)
    grade_min = models.PositiveSmallIntegerField(
        null=True, blank=True, validators=(MinValueValidator(1), MaxValueValidator(12))
    )
    grade_max = models.PositiveSmallIntegerField(
        null=True, blank=True, validators=(MinValueValidator(1), MaxValueValidator(12))
    )
    is_featured = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    objects = EventQuerySet.as_manager()

    class Meta:
        ordering = ("order", "start_date", "title")
        constraints = [
            models.UniqueConstraint(fields=("season", "code"), name="unique_season_event_code"),
            models.UniqueConstraint(fields=("season", "slug"), name="unique_season_event_slug"),
        ]
        indexes = [
            models.Index(
                fields=("season", "publication_status", "order"),
                name="event_season_public_idx",
            ),
            models.Index(fields=("event_status", "start_date"), name="event_status_date_idx"),
        ]

    def clean(self):
        errors: dict[str, str] = {}
        if self.end_date and not self.start_date:
            errors["start_date"] = "Tugash sanasi kiritilsa, boshlanish sanasi ham kerak."
        if self.start_date and self.end_date and self.end_date < self.start_date:
            errors["end_date"] = "Tugash sanasi boshlanish sanasidan oldin bo‘la olmaydi."
        if self.date_precision == self.DatePrecision.TBA and (self.start_date or self.end_date):
            errors["date_precision"] = "TBA tadbirida aniq sana saqlanmaydi."
        if self.date_precision != self.DatePrecision.TBA and not self.start_date:
            errors["start_date"] = "Sana aniqligi TBA bo‘lmasa, boshlanish sanasi kerak."
        if self.date_precision == self.DatePrecision.RANGE and not self.end_date:
            errors["end_date"] = "Sana oralig‘i uchun tugash sanasi kerak."
        if self.grade_min and self.grade_max and self.grade_max < self.grade_min:
            errors["grade_max"] = "Yuqori sinf chegarasi quyi chegaradan kichik bo‘la olmaydi."
        if errors:
            raise ValidationError(errors)

    def save(self, *args: Any, **kwargs: Any):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.publication_status == PublicationStatus.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        if self.verification_status == VerificationStatus.VERIFIED and self.verified_at is None:
            self.verified_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.season.slug}: {self.code} — {self.title}"


class EventRoute(TimeStampedModel):
    class NodeStyle(models.TextChoices):
        DEFAULT = "default", "Oddiy tugun"
        FINAL = "final", "Final tuguni"
        TRAINING = "training", "Tayyorgarlik tuguni"

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="route_memberships")
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="event_memberships")
    order = models.PositiveSmallIntegerField(default=0)
    node_style = models.CharField(
        max_length=10, choices=NodeStyle.choices, default=NodeStyle.DEFAULT
    )
    label = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ("route__order", "order", "event__order")
        constraints = [
            models.UniqueConstraint(fields=("event", "route"), name="unique_event_route")
        ]

    def clean(self):
        if self.event_id and self.route_id and self.event.season_id != self.route.season_id:
            raise ValidationError("Tadbir va yo‘nalish bitta mavsumga tegishli bo‘lishi kerak.")

    def __str__(self) -> str:
        return f"{self.route.code}: {self.event.code}"


class EventEdge(TimeStampedModel):
    class RelationType(models.TextChoices):
        QUALIFIES_TO = "qualifies_to", "Keyingi bosqichga saralaydi"
        FEEDS_INTO = "feeds_into", "Nomzodlar bazasiga olib boradi"
        TRAINING_FOR = "training_for", "Tayyorgarlik hisoblanadi"
        RELATED_TO = "related_to", "Aloqador"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name="edges")
    from_event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="outgoing_edges")
    to_event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="incoming_edges")
    route = models.ForeignKey(
        Route, on_delete=models.SET_NULL, null=True, blank=True, related_name="edges"
    )
    relation_type = models.CharField(max_length=20, choices=RelationType.choices)
    line_style = models.CharField(max_length=10, choices=LineStyle.choices, default=LineStyle.SOLID)
    label = models.CharField(max_length=160, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "from_event__order", "to_event__order")
        constraints = [
            models.CheckConstraint(
                condition=~Q(from_event=models.F("to_event")), name="event_edge_not_self"
            ),
            models.UniqueConstraint(
                fields=("from_event", "to_event", "relation_type", "route"),
                condition=Q(route__isnull=False),
                name="unique_routed_event_edge",
            ),
            models.UniqueConstraint(
                fields=("from_event", "to_event", "relation_type"),
                condition=Q(route__isnull=True),
                name="unique_unrouted_event_edge",
            ),
        ]

    def clean(self):
        errors: dict[str, str] = {}
        if self.from_event_id and self.to_event_id and self.from_event_id == self.to_event_id:
            errors["to_event"] = "Tadbir o‘ziga bog‘lana olmaydi."
        if self.from_event_id and self.from_event.season_id != self.season_id:
            errors["from_event"] = "Boshlang‘ich tadbir boshqa mavsumga tegishli."
        if self.to_event_id and self.to_event.season_id != self.season_id:
            errors["to_event"] = "Keyingi tadbir boshqa mavsumga tegishli."
        if self.route_id and self.route.season_id != self.season_id:
            errors["route"] = "Yo‘nalish boshqa mavsumga tegishli."
        if errors:
            raise ValidationError(errors)

    def __str__(self) -> str:
        return f"{self.from_event.code} → {self.to_event.code}"
