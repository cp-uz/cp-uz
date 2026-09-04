from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from ..models import (
    Season,
)
from .graph import EventEdgeSerializer, EventGraphSerializer, RouteSerializer


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

    @extend_schema_field(RouteSerializer(many=True))
    def get_routes(self, obj) -> list[dict]:
        routes = getattr(obj, "public_routes", None)
        if routes is None:
            routes = obj.routes.filter(is_visible=True)
        return RouteSerializer(routes, many=True).data

    @extend_schema_field(EventGraphSerializer(many=True))
    def get_events(self, obj) -> list[dict]:
        events = getattr(obj, "public_events", None)
        if events is None:
            events = obj.events.published()
        return EventGraphSerializer(events, many=True).data

    @extend_schema_field(EventEdgeSerializer(many=True))
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
