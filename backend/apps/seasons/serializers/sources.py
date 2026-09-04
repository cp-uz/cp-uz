from rest_framework import serializers

from ..models import (
    EventResource,
    EventSource,
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
