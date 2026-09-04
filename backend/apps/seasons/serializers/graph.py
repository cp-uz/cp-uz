from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from ..models import (
    Event,
    EventEdge,
    EventRoute,
    Route,
)
from .participants import ResultEntrySerializer
from .sources import EventResourceSerializer, EventSourceSerializer


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

    @extend_schema_field(EventRouteSerializer(many=True))
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
