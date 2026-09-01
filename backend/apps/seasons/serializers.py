from rest_framework import serializers

from .models import (
    Event,
    EventEdge,
    EventResource,
    EventRoute,
    EventSource,
    Participant,
    ParticipantPlatformAccount,
    ResultEntry,
    Route,
    Season,
    Team,
    TeamMember,
)


class ParticipantPlatformAccountSerializer(serializers.ModelSerializer):
    platform_label = serializers.CharField(source="get_platform_display", read_only=True)

    class Meta:
        model = ParticipantPlatformAccount
        fields = (
            "id",
            "platform",
            "platform_label",
            "handle",
            "url",
            "title",
            "is_verified",
            "order",
        )


class ParticipantSerializer(serializers.ModelSerializer):
    aliases = serializers.SerializerMethodField()

    class Meta:
        model = Participant
        fields = (
            "id",
            "full_name",
            "slug",
            "country_code",
            "region",
            "school",
            "handle",
            "bio",
            "photo_url",
            "aliases",
        )

    def get_aliases(self, obj) -> list[str]:
        return [alias.name for alias in obj.aliases.all()]


class ParticipantSeasonResultSerializer(serializers.ModelSerializer):
    event_slug = serializers.CharField(source="event.slug", read_only=True)
    event_title = serializers.CharField(source="event.title", read_only=True)
    event_short_title = serializers.CharField(source="event.short_title", read_only=True)
    event_start_date = serializers.DateField(source="event.start_date", read_only=True)
    event_end_date = serializers.DateField(source="event.end_date", read_only=True)

    class Meta:
        model = ResultEntry
        fields = (
            "id",
            "event_slug",
            "event_title",
            "event_short_title",
            "event_start_date",
            "event_end_date",
            "rank",
            "score",
            "score_label",
            "medal",
            "award_title",
            "category",
            "result_url",
            "order",
        )


class ParticipantDetailSerializer(ParticipantSerializer):
    platform_accounts = ParticipantPlatformAccountSerializer(many=True, read_only=True)
    season_results = ParticipantSeasonResultSerializer(many=True, read_only=True)

    class Meta(ParticipantSerializer.Meta):
        fields = ParticipantSerializer.Meta.fields + ("platform_accounts", "season_results")


class TeamMemberSerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True)

    class Meta:
        model = TeamMember
        fields = ("role", "order", "participant")


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ("id", "name", "code", "country_code", "school", "members")


class ResultEntrySerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True)
    team = TeamSerializer(read_only=True)

    class Meta:
        model = ResultEntry
        fields = (
            "id",
            "rank",
            "score",
            "score_label",
            "medal",
            "award_title",
            "category",
            "is_local",
            "result_url",
            "notes",
            "order",
            "participant",
            "team",
        )


class EventResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventResource
        fields = ("id", "type", "title", "url", "is_official", "order")


class EventSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSource
        fields = (
            "id",
            "type",
            "title",
            "url",
            "publisher",
            "accessed_on",
            "is_primary",
        )


class EventSourceDetailSerializer(EventSourceSerializer):
    class Meta(EventSourceSerializer.Meta):
        fields = EventSourceSerializer.Meta.fields + ("notes",)


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = (
            "id",
            "code",
            "title",
            "description",
            "kind",
            "color",
            "line_style",
            "icon",
            "order",
        )


class EventRouteSerializer(serializers.ModelSerializer):
    route_code = serializers.CharField(source="route.code", read_only=True)

    class Meta:
        model = EventRoute
        fields = ("route_code", "order", "node_style", "label")


class EventGraphSerializer(serializers.ModelSerializer):
    route_memberships = serializers.SerializerMethodField()
    resources = EventResourceSerializer(many=True, read_only=True)
    sources = EventSourceSerializer(many=True, read_only=True)
    results = ResultEntrySerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = (
            "id",
            "code",
            "slug",
            "title",
            "short_title",
            "summary",
            "description",
            "type",
            "event_status",
            "verification_status",
            "verified_at",
            "date_precision",
            "start_date",
            "end_date",
            "date_label",
            "timezone",
            "location",
            "venue",
            "mode",
            "platform",
            "organizer",
            "eligibility",
            "grade_min",
            "grade_max",
            "is_featured",
            "order",
            "route_memberships",
            "resources",
            "sources",
            "results",
        )

    def get_route_memberships(self, obj) -> list[dict]:
        memberships = getattr(obj, "public_route_memberships", None)
        if memberships is None:
            memberships = obj.route_memberships.filter(route__is_visible=True).select_related(
                "route"
            )
        return EventRouteSerializer(memberships, many=True).data


class EventEdgeSerializer(serializers.ModelSerializer):
    from_event_code = serializers.CharField(source="from_event.code", read_only=True)
    to_event_code = serializers.CharField(source="to_event.code", read_only=True)
    route_code = serializers.CharField(source="route.code", read_only=True, allow_null=True)

    class Meta:
        model = EventEdge
        fields = (
            "id",
            "from_event_code",
            "to_event_code",
            "route_code",
            "relation_type",
            "line_style",
            "label",
            "order",
        )


class SeasonListSerializer(serializers.ModelSerializer):
    event_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Season
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "start_date",
            "end_date",
            "verification_status",
            "verified_at",
            "is_featured",
            "order",
            "event_count",
        )


class SeasonGraphSerializer(serializers.ModelSerializer):
    routes = serializers.SerializerMethodField()
    events = serializers.SerializerMethodField()
    edges = serializers.SerializerMethodField()

    class Meta:
        model = Season
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "start_date",
            "end_date",
            "verification_status",
            "verified_at",
            "is_featured",
            "order",
            "routes",
            "events",
            "edges",
        )

    def get_routes(self, obj) -> list[dict]:
        routes = getattr(obj, "public_routes", None)
        if routes is None:
            routes = obj.routes.filter(is_visible=True)
        return RouteSerializer(routes, many=True).data

    def get_events(self, obj) -> list[dict]:
        events = getattr(obj, "public_events", None)
        if events is None:
            events = obj.events.published()
        return EventGraphSerializer(events, many=True).data

    def get_edges(self, obj) -> list[dict]:
        edges = getattr(obj, "public_edges", None)
        if edges is None:
            edges = obj.edges.filter(
                from_event__publication_status="published",
                to_event__publication_status="published",
            )
        return EventEdgeSerializer(edges, many=True).data


class SeasonLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ("title", "slug", "start_date", "end_date")


class EventDetailSerializer(EventGraphSerializer):
    season = SeasonLinkSerializer(read_only=True)
    sources = EventSourceDetailSerializer(many=True, read_only=True)
    incoming_edges = serializers.SerializerMethodField()
    outgoing_edges = serializers.SerializerMethodField()

    class Meta(EventGraphSerializer.Meta):
        fields = EventGraphSerializer.Meta.fields + (
            "season",
            "incoming_edges",
            "outgoing_edges",
        )

    def _public_edges(self, obj, direction: str):
        relation = getattr(obj, direction)
        return relation.filter(
            from_event__publication_status="published",
            to_event__publication_status="published",
        ).select_related("from_event", "to_event", "route")

    def get_incoming_edges(self, obj) -> list[dict]:
        return EventEdgeSerializer(self._public_edges(obj, "incoming_edges"), many=True).data

    def get_outgoing_edges(self, obj) -> list[dict]:
        return EventEdgeSerializer(self._public_edges(obj, "outgoing_edges"), many=True).data
