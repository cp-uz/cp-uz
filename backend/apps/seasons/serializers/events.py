from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .graph import EventEdgeSerializer, EventGraphSerializer
from .seasons import SeasonLinkSerializer
from .sources import EventSourceDetailSerializer


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

    @extend_schema_field(EventEdgeSerializer(many=True))
    def get_incoming_edges(self, obj) -> list[dict]:
        return EventEdgeSerializer(self._public_edges(obj, "incoming_edges"), many=True).data

    @extend_schema_field(EventEdgeSerializer(many=True))
    def get_outgoing_edges(self, obj) -> list[dict]:
        return EventEdgeSerializer(self._public_edges(obj, "outgoing_edges"), many=True).data
