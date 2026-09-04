from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from ..models import (
    GlossaryTerm,
)
from .links import ArticleLinkSerializer


class GlossaryTermListSerializer(serializers.ModelSerializer):
    aliases = serializers.ListField(child=serializers.CharField(), read_only=True)
    english_term = serializers.SerializerMethodField()
    uzbek_term = serializers.CharField(source="term", read_only=True)
    description = serializers.CharField(source="short_definition", read_only=True)

    class Meta:
        model = GlossaryTerm
        fields = (
            "id",
            "term",
            "english_term",
            "uzbek_term",
            "slug",
            "short_definition",
            "description",
            "aliases",
            "updated_at",
        )

    def get_english_term(self, obj) -> str:
        return obj.aliases[0] if obj.aliases else ""


class GlossaryTermDetailSerializer(GlossaryTermListSerializer):
    related_articles = serializers.SerializerMethodField()

    class Meta(GlossaryTermListSerializer.Meta):
        fields = GlossaryTermListSerializer.Meta.fields + ("definition", "related_articles")

    @extend_schema_field(ArticleLinkSerializer(many=True))
    def get_related_articles(self, obj) -> list[dict]:
        articles = getattr(obj, "public_related_articles", None)
        if articles is None:
            articles = obj.related_articles.public().select_related("category")
        return ArticleLinkSerializer(articles, many=True).data
