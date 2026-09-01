from __future__ import annotations

import uuid
from typing import Any

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.utils.text import slugify


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


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


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
