from rest_framework import serializers

from ..models import ProblemAttachment, ProblemLink


class ProblemLinkSerializer(serializers.ModelSerializer):
    kind_label = serializers.CharField(source="get_kind_display", read_only=True)

    class Meta:
        model = ProblemLink
        fields = (
            "id",
            "kind",
            "kind_label",
            "title",
            "url",
            "platform",
            "is_official",
            "is_primary",
            "order",
        )


class ProblemAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemAttachment
        fields = ("id", "title", "url", "content_type", "size_bytes", "order")


class StatementPdfSerializer(serializers.Serializer):
    url = serializers.CharField()
    source_url = serializers.URLField()
    sha256 = serializers.CharField(allow_blank=True)
    size_bytes = serializers.IntegerField(allow_null=True)
    page_count = serializers.IntegerField(allow_null=True)
    language = serializers.CharField(allow_blank=True)
    provenance = serializers.ChoiceField(choices=("official", "generated", ""))
    provenance_label = serializers.CharField(allow_blank=True)
