from rest_framework import serializers

from apps.accounts.serializers import UserSummarySerializer
from common.frontend_routes import algorithm_path

from ..models import (
    Article,
    ArticleContributor,
    ArticlePrerequisite,
    ExternalPracticeReference,
)
from .taxonomy import CategorySummarySerializer


class ContributorSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    role_label = serializers.CharField(source="get_role_display", read_only=True)

    class Meta:
        model = ArticleContributor
        fields = ("user", "role", "role_label", "note", "order")


class PracticeReferenceSerializer(serializers.ModelSerializer):
    platform_name = serializers.CharField(read_only=True)
    level_label = serializers.CharField(source="get_level_display", read_only=True)

    class Meta:
        model = ExternalPracticeReference
        fields = (
            "id",
            "platform",
            "platform_name",
            "title",
            "url",
            "difficulty_label",
            "level",
            "level_label",
            "note",
            "order",
        )


class ArticleLinkSerializer(serializers.ModelSerializer):
    category = CategorySummarySerializer(read_only=True)
    canonical_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = (
            "id",
            "title",
            "slug",
            "canonical_path",
            "canonical_url",
            "category",
            "difficulty",
            "estimated_reading_minutes",
        )

    def get_canonical_url(self, obj) -> str:
        path = obj.canonical_path or obj.slug
        return algorithm_path(path)


class PrerequisiteSerializer(serializers.ModelSerializer):
    article = ArticleLinkSerializer(source="prerequisite", read_only=True)

    class Meta:
        model = ArticlePrerequisite
        fields = ("article", "note", "order")
