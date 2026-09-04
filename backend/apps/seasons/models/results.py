from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q

from common.models import TimeStampedModel

from .events import Event
from .participants import Participant, Team


class ResultEntry(TimeStampedModel):
    class Medal(models.TextChoices):
        NONE = "none", "Medalsiz"
        GOLD = "gold", "Oltin"
        SILVER = "silver", "Kumush"
        BRONZE = "bronze", "Bronza"
        HONOURABLE_MENTION = "honourable_mention", "Faxriy yorliq"
        OTHER = "other", "Boshqa sovrin"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="results")
    source_key = models.CharField(max_length=180, blank=True)
    participant = models.ForeignKey(
        Participant,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="results",
    )
    team = models.ForeignKey(
        Team, on_delete=models.PROTECT, null=True, blank=True, related_name="results"
    )
    rank = models.PositiveIntegerField(null=True, blank=True)
    score = models.DecimalField(max_digits=12, decimal_places=3, null=True, blank=True)
    score_label = models.CharField(max_length=100, blank=True)
    medal = models.CharField(max_length=30, choices=Medal.choices, default=Medal.NONE)
    award_title = models.CharField(max_length=160, blank=True)
    category = models.CharField(max_length=160, blank=True)
    is_local = models.BooleanField(default=True)
    result_url = models.URLField(max_length=700, blank=True)
    notes = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "rank", "participant__full_name", "team__name")
        constraints = [
            models.CheckConstraint(
                condition=(
                    (Q(participant__isnull=False) & Q(team__isnull=True))
                    | (Q(participant__isnull=True) & Q(team__isnull=False))
                ),
                name="result_exactly_one_subject",
            ),
            models.UniqueConstraint(
                fields=("event", "source_key"),
                condition=~Q(source_key=""),
                name="unique_event_result_source_key",
            ),
        ]
        indexes = [
            models.Index(fields=("event", "is_local", "rank"), name="result_event_local_idx")
        ]

    def clean(self):
        errors: dict[str, str] = {}
        if bool(self.participant_id) == bool(self.team_id):
            errors["participant"] = "Natija uchun ishtirokchi yoki jamoaning aynan bittasi kerak."
        if (
            self.team_id
            and not Team.objects.filter(pk=self.team_id, event_id=self.event_id).exists()
        ):
            errors["team"] = "Jamoa natija tadbiriga tegishli emas."
        if errors:
            raise ValidationError(errors)

    @property
    def subject_name(self) -> str:
        if self.participant_id:
            return self.participant.full_name
        if self.team_id:
            return self.team.name
        return ""

    def __str__(self) -> str:
        return f"{self.event.code}: {self.subject_name}"
