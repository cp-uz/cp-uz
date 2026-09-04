from __future__ import annotations

import uuid
from typing import Any

from django.db import models
from django.utils.text import slugify

from common.models import TimeStampedModel

from .events import Event


class Participant(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    country_code = models.CharField(max_length=3, default="UZB", blank=True)
    region = models.CharField(max_length=160, blank=True)
    school = models.CharField(max_length=240, blank=True)
    handle = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    photo_url = models.CharField(max_length=700, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("full_name",)
        indexes = [
            models.Index(fields=("country_code", "full_name"), name="person_country_name_idx")
        ]

    def save(self, *args: Any, **kwargs: Any):
        if not self.slug:
            self.slug = slugify(self.full_name)
        self.country_code = self.country_code.upper()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.full_name


class ParticipantPlatformAccount(TimeStampedModel):
    class Platform(models.TextChoices):
        CODEFORCES = "codeforces", "Codeforces"
        ATCODER = "atcoder", "AtCoder"
        KEPUZ = "kepuz", "KEP.uz"
        ROBOCONTEST = "robocontest", "Robocontest"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participant = models.ForeignKey(
        Participant, on_delete=models.CASCADE, related_name="platform_accounts"
    )
    platform = models.CharField(max_length=24, choices=Platform.choices)
    handle = models.CharField(max_length=160)
    url = models.URLField(max_length=700)
    title = models.CharField(max_length=120, blank=True)
    is_verified = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "platform", "handle")
        constraints = [
            models.UniqueConstraint(
                fields=("participant", "platform", "handle"),
                name="unique_participant_platform_handle",
            )
        ]

    def __str__(self) -> str:
        return f"{self.participant.full_name}: {self.get_platform_display()} — {self.handle}"


class ParticipantAlias(TimeStampedModel):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name="aliases")
    name = models.CharField(max_length=200)
    normalized_name = models.CharField(max_length=200, unique=True, editable=False)

    class Meta:
        ordering = ("name",)

    @staticmethod
    def normalize(value: str) -> str:
        return " ".join(value.casefold().split())

    def save(self, *args: Any, **kwargs: Any):
        self.normalized_name = self.normalize(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Team(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="teams")
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=80, blank=True)
    country_code = models.CharField(max_length=3, default="UZB", blank=True)
    school = models.CharField(max_length=240, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)
        constraints = [
            models.UniqueConstraint(fields=("event", "name"), name="unique_event_team_name")
        ]

    def save(self, *args: Any, **kwargs: Any):
        self.country_code = self.country_code.upper()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.event.code}: {self.name}"


class TeamMember(TimeStampedModel):
    class Role(models.TextChoices):
        CONTESTANT = "contestant", "Ishtirokchi"
        LEADER = "leader", "Jamoa rahbari"
        DEPUTY = "deputy", "Rahbar o‘rinbosari"
        COACH = "coach", "Murabbiy"
        OTHER = "other", "Boshqa"

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")
    participant = models.ForeignKey(
        Participant, on_delete=models.PROTECT, related_name="team_memberships"
    )
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CONTESTANT)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "participant__full_name")
        constraints = [
            models.UniqueConstraint(
                fields=("team", "participant", "role"), name="unique_team_member_role"
            )
        ]

    def __str__(self) -> str:
        return f"{self.team.name}: {self.participant.full_name}"
