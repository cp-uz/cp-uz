from django.contrib import admin, messages
from django.db.models import Count
from django.utils import timezone

from .models import (
    Event,
    EventEdge,
    EventResource,
    EventRoute,
    EventSource,
    Participant,
    ParticipantAlias,
    ParticipantPlatformAccount,
    PublicationStatus,
    ResultEntry,
    Route,
    Season,
    Team,
    TeamMember,
    VerificationStatus,
)


class RouteInline(admin.TabularInline):
    model = Route
    extra = 0
    fields = ("code", "title", "kind", "color", "line_style", "order", "is_visible")
    show_change_link = True


class EventInline(admin.TabularInline):
    model = Event
    extra = 0
    fields = (
        "code",
        "title",
        "type",
        "event_status",
        "date_precision",
        "start_date",
        "publication_status",
        "order",
    )
    show_change_link = True


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "start_date",
        "end_date",
        "publication_status",
        "verification_status",
        "is_featured",
        "event_count",
        "updated_at",
    )
    list_filter = ("publication_status", "verification_status", "is_featured")
    list_editable = ("publication_status", "verification_status", "is_featured")
    search_fields = ("title", "slug", "summary")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("published_at", "verified_at", "created_at", "updated_at")
    inlines = (RouteInline, EventInline)
    actions = ("publish_selected", "verify_selected", "archive_selected")

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(_event_count=Count("events"))

    @admin.display(description="Tadbirlar", ordering="_event_count")
    def event_count(self, obj):
        return obj._event_count

    @admin.action(description="Tanlangan mavsumlarni nashr qilish")
    def publish_selected(self, request, queryset):
        count = queryset.update(
            publication_status=PublicationStatus.PUBLISHED, published_at=timezone.now()
        )
        self.message_user(request, f"{count} ta mavsum nashr qilindi.", messages.SUCCESS)

    @admin.action(description="Tanlangan mavsum ma’lumotlarini tekshirilgan deb belgilash")
    def verify_selected(self, request, queryset):
        count = queryset.update(
            verification_status=VerificationStatus.VERIFIED, verified_at=timezone.now()
        )
        self.message_user(request, f"{count} ta mavsum tekshirildi.", messages.SUCCESS)

    @admin.action(description="Tanlangan mavsumlarni arxivlash")
    def archive_selected(self, request, queryset):
        count = queryset.update(publication_status=PublicationStatus.ARCHIVED)
        self.message_user(request, f"{count} ta mavsum arxivlandi.", messages.SUCCESS)


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ("title", "season", "code", "kind", "color", "order", "is_visible")
    list_filter = ("season", "kind", "color", "line_style", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("title", "code", "description", "season__title")
    autocomplete_fields = ("season",)


class EventRouteInline(admin.TabularInline):
    model = EventRoute
    extra = 0
    autocomplete_fields = ("route",)


class EventResourceInline(admin.TabularInline):
    model = EventResource
    extra = 0
    fields = ("type", "title", "url", "is_official", "order")


class EventSourceInline(admin.TabularInline):
    model = EventSource
    extra = 0
    fields = ("type", "title", "url", "publisher", "accessed_on", "is_primary")


class ResultEntryInline(admin.TabularInline):
    model = ResultEntry
    extra = 0
    autocomplete_fields = ("participant", "team")
    fields = (
        "source_key",
        "participant",
        "team",
        "rank",
        "score",
        "score_label",
        "medal",
        "category",
        "is_local",
        "order",
    )


class OutgoingEdgeInline(admin.TabularInline):
    model = EventEdge
    fk_name = "from_event"
    extra = 0
    autocomplete_fields = ("to_event", "route")
    fields = ("to_event", "route", "relation_type", "line_style", "label", "order")
    verbose_name = "Keyingi bog‘lanish"
    verbose_name_plural = "Keyingi bog‘lanishlar"


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "season",
        "code",
        "type",
        "event_status",
        "date_display",
        "publication_status",
        "verification_status",
        "order",
    )
    list_filter = (
        "season",
        "type",
        "event_status",
        "date_precision",
        "publication_status",
        "verification_status",
        "mode",
        "is_featured",
    )
    list_editable = ("publication_status", "verification_status", "order")
    search_fields = (
        "title",
        "short_title",
        "code",
        "summary",
        "description",
        "location",
        "organizer",
    )
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("season",)
    readonly_fields = ("published_at", "verified_at", "created_at", "updated_at")
    inlines = (
        EventRouteInline,
        EventResourceInline,
        EventSourceInline,
        ResultEntryInline,
        OutgoingEdgeInline,
    )
    actions = ("publish_selected", "verify_selected", "mark_completed")
    fieldsets = (
        (
            "Asosiy ma’lumot",
            {
                "fields": (
                    "season",
                    ("code", "slug"),
                    "title",
                    "short_title",
                    "summary",
                    "description",
                    ("type", "event_status"),
                    ("publication_status", "verification_status"),
                    ("is_featured", "order"),
                )
            },
        ),
        (
            "Sana va joy",
            {
                "fields": (
                    ("date_precision", "start_date", "end_date"),
                    "date_label",
                    "timezone",
                    ("location", "venue"),
                    ("mode", "platform"),
                )
            },
        ),
        (
            "Ishtirok va tashkilot",
            {"fields": ("organizer", "eligibility", ("grade_min", "grade_max"))},
        ),
        (
            "Tizim ma’lumoti",
            {
                "classes": ("collapse",),
                "fields": ("published_at", "verified_at", "created_at", "updated_at"),
            },
        ),
    )

    @admin.display(description="Sana", ordering="start_date")
    def date_display(self, obj):
        if obj.date_precision == Event.DatePrecision.TBA:
            return obj.date_label or "TBA"
        if obj.end_date and obj.end_date != obj.start_date:
            return f"{obj.start_date:%Y-%m-%d} — {obj.end_date:%Y-%m-%d}"
        return obj.start_date or obj.date_label

    @admin.action(description="Tanlangan tadbirlarni nashr qilish")
    def publish_selected(self, request, queryset):
        count = queryset.update(
            publication_status=PublicationStatus.PUBLISHED, published_at=timezone.now()
        )
        self.message_user(request, f"{count} ta tadbir nashr qilindi.", messages.SUCCESS)

    @admin.action(description="Tanlangan tadbir ma’lumotlarini tekshirilgan deb belgilash")
    def verify_selected(self, request, queryset):
        count = queryset.update(
            verification_status=VerificationStatus.VERIFIED, verified_at=timezone.now()
        )
        self.message_user(request, f"{count} ta tadbir tekshirildi.", messages.SUCCESS)

    @admin.action(description="Tanlangan tadbirlarni yakunlangan deb belgilash")
    def mark_completed(self, request, queryset):
        count = queryset.update(event_status=Event.Status.COMPLETED)
        self.message_user(request, f"{count} ta tadbir yakunlandi.", messages.SUCCESS)


@admin.register(EventEdge)
class EventEdgeAdmin(admin.ModelAdmin):
    list_display = (
        "from_event",
        "to_event",
        "season",
        "route",
        "relation_type",
        "line_style",
        "order",
    )
    list_filter = ("season", "route", "relation_type", "line_style")
    search_fields = ("from_event__title", "to_event__title", "label")
    autocomplete_fields = ("season", "from_event", "to_event", "route")


class ParticipantAliasInline(admin.TabularInline):
    model = ParticipantAlias
    extra = 0
    readonly_fields = ("normalized_name",)


class ParticipantPlatformAccountInline(admin.TabularInline):
    model = ParticipantPlatformAccount
    extra = 0
    fields = (
        "platform",
        "handle",
        "url",
        "title",
        "is_verified",
        "is_public",
        "order",
    )


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ("full_name", "country_code", "region", "school", "handle", "is_active")
    list_filter = ("country_code", "is_active")
    list_editable = ("is_active",)
    search_fields = ("full_name", "aliases__name", "school", "handle")
    prepopulated_fields = {"slug": ("full_name",)}
    fieldsets = (
        (None, {"fields": ("full_name", "slug", "country_code", "is_active")}),
        ("Profil", {"fields": ("photo_url", "bio", "region", "school", "handle")}),
    )
    inlines = (ParticipantAliasInline, ParticipantPlatformAccountInline)


class TeamMemberInline(admin.TabularInline):
    model = TeamMember
    extra = 0
    autocomplete_fields = ("participant",)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("name", "event", "code", "country_code", "school")
    list_filter = ("event__season", "country_code")
    search_fields = ("name", "code", "school", "event__title")
    autocomplete_fields = ("event",)
    inlines = (TeamMemberInline,)


@admin.register(ResultEntry)
class ResultEntryAdmin(admin.ModelAdmin):
    list_display = (
        "subject_name",
        "event",
        "rank",
        "score",
        "medal",
        "category",
        "is_local",
    )
    list_filter = ("event__season", "medal", "is_local", "category")
    search_fields = (
        "participant__full_name",
        "team__name",
        "event__title",
        "award_title",
    )
    autocomplete_fields = ("event", "participant", "team")
    readonly_fields = ("source_key",)


@admin.register(EventResource)
class EventResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "event", "type", "is_official", "order")
    list_filter = ("type", "is_official", "event__season")
    search_fields = ("title", "url", "event__title")
    autocomplete_fields = ("event",)


@admin.register(EventSource)
class EventSourceAdmin(admin.ModelAdmin):
    list_display = ("title", "event", "type", "publisher", "is_primary", "accessed_on")
    list_filter = ("type", "is_primary", "event__season")
    search_fields = ("title", "url", "publisher", "event__title")
    autocomplete_fields = ("event",)
