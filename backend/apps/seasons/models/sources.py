from __future__ import annotations

from django.db import models

from common.models import TimeStampedModel

from .events import Event


class EventResource(TimeStampedModel):
    class Type(models.TextChoices):
        OFFICIAL_PAGE = "official_page", "Rasmiy sahifa"
        ANNOUNCEMENT = "announcement", "E’lon"
        SCHEDULE = "schedule", "Jadval"
        RULES = "rules", "Nizom va qoidalar"
        REGISTRATION = "registration", "Ro‘yxatdan o‘tish"
        PLATFORM = "platform", "Platforma"
        PARTICIPANTS = "participants", "Ishtirokchilar"
        TASKS = "tasks", "Masalalar"
        EDITORIAL = "editorial", "Tahlillar"
        SCOREBOARD = "scoreboard", "Natijalar jadvali"
        RESULTS = "results", "Natijalar"
        PHOTOS = "photos", "Rasmlar"
        VIDEOS = "videos", "Videolar"
        MIRROR = "mirror", "Mirror"
        OTHER = "other", "Boshqa"

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="resources")
    type = models.CharField(max_length=20, choices=Type.choices)
    title = models.CharField(max_length=200)
    url = models.URLField(max_length=700)
    is_official = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "title")
        constraints = [
            models.UniqueConstraint(fields=("event", "url"), name="unique_event_resource_url")
        ]

    def __str__(self) -> str:
        return f"{self.event.code}: {self.title}"


class EventSource(TimeStampedModel):
    class Type(models.TextChoices):
        OFFICIAL = "official", "Rasmiy manba"
        GOVERNMENT = "government", "Davlat manbasi"
        ORGANIZER = "organizer", "Tashkilotchi"
        PRESS = "press", "Matbuot"
        ARCHIVE = "archive", "Arxiv"
        OFFICIAL_PAGE = "official_page", "Rasmiy sahifa"
        OFFICIAL_ANNOUNCEMENT = "official_announcement", "Rasmiy e’lon"
        OFFICIAL_RESULTS = "official_results", "Rasmiy natijalar"
        OFFICIAL_REGULATION = "official_regulation", "Rasmiy nizom"
        ORGANIZER_ARCHIVE = "organizer_archive", "Tashkilotchi arxivi"
        GOVERNMENT_NEWS = "government_news", "Davlat yangiliklari"
        COMMUNITY_REPORT = "community_report", "Hamjamiyat xabari"
        OTHER = "other", "Boshqa"

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="sources")
    type = models.CharField(max_length=24, choices=Type.choices)
    title = models.CharField(max_length=240)
    url = models.URLField(max_length=700)
    publisher = models.CharField(max_length=180, blank=True)
    accessed_on = models.DateField(null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ("-is_primary", "title")
        constraints = [
            models.UniqueConstraint(fields=("event", "url"), name="unique_event_source_url")
        ]

    def __str__(self) -> str:
        return f"{self.event.code}: {self.title}"
