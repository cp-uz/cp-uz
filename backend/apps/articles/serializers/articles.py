from pathlib import PurePosixPath

from django.conf import settings
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from common.frontend_routes import algorithm_path

from ..models import (
    Article,
)
from .links import (
    ArticleLinkSerializer,
    ContributorSerializer,
    PracticeReferenceSerializer,
    PrerequisiteSerializer,
)
from .review import ArticleReviewStateSerializer
from .taxonomy import CategorySummarySerializer, TagSerializer


class ArticleListSerializer(serializers.ModelSerializer):
    category = CategorySummarySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    canonical_url = serializers.SerializerMethodField()
    asset_base_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = (
            "id",
            "title",
            "slug",
            "canonical_path",
            "canonical_url",
            "asset_base_url",
            "subtitle",
            "summary",
            "category",
            "tags",
            "difficulty",
            "status",
            "visibility",
            "language",
            "estimated_reading_minutes",
            "is_featured",
            "cover_image_url",
            "published_at",
            "updated_at",
        )

    def get_canonical_url(self, obj) -> str:
        path = obj.canonical_path or obj.slug
        return algorithm_path(path)

    def get_asset_base_url(self, obj) -> str:
        directory = str(PurePosixPath(obj.content_path).parent)
        relative = "content" if directory == "." else f"content/{directory}"
        return f"{settings.MEDIA_URL.rstrip('/')}/{relative.strip('/')}/"


class ArticleDetailSerializer(ArticleListSerializer):
    contributors = ContributorSerializer(many=True, read_only=True)
    prerequisites = serializers.SerializerMethodField()
    practice_references = serializers.SerializerMethodField()
    related_articles = serializers.SerializerMethodField()
    previous_article = serializers.SerializerMethodField()
    next_article = serializers.SerializerMethodField()
    review_state = serializers.SerializerMethodField()
    russian_source_url = serializers.SerializerMethodField()

    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + (
            "content",
            "source_url",
            "russian_source_url",
            "source_repository",
            "source_path",
            "source_commit",
            "content_license",
            "provenance",
            "content_hash",
            "seo_title",
            "seo_description",
            "contributors",
            "prerequisites",
            "practice_references",
            "related_articles",
            "previous_article",
            "next_article",
            "review_state",
        )

    def _published_siblings(self, obj):
        return Article.objects.public().filter(category=obj.category, language=obj.language)

    @extend_schema_field(ArticleLinkSerializer(many=True))
    def get_related_articles(self, obj) -> list[dict]:
        queryset = (
            Article.objects.public()
            .filter(tags__in=obj.tags.all(), language=obj.language)
            .exclude(pk=obj.pk)
            .select_related("category")
            .distinct()[:4]
        )
        return ArticleLinkSerializer(queryset, many=True).data

    @extend_schema_field(PracticeReferenceSerializer(many=True))
    def get_practice_references(self, obj) -> list[dict]:
        queryset = getattr(obj, "active_practice_references", None)
        if queryset is None:
            queryset = obj.practice_references.filter(is_active=True)
        return PracticeReferenceSerializer(queryset, many=True).data

    @extend_schema_field(PrerequisiteSerializer(many=True))
    def get_prerequisites(self, obj) -> list[dict]:
        links = getattr(obj, "public_prerequisite_links", None)
        if links is None:
            links = obj.prerequisite_links.filter(
                prerequisite__visibility=Article.Visibility.PUBLIC
            ).select_related("prerequisite__category")
        return PrerequisiteSerializer(links, many=True).data

    @extend_schema_field(ArticleLinkSerializer(allow_null=True))
    def get_previous_article(self, obj) -> dict | None:
        article = (
            self._published_siblings(obj).filter(order__lt=obj.order).order_by("-order").first()
        )
        return ArticleLinkSerializer(article).data if article else None

    @extend_schema_field(ArticleLinkSerializer(allow_null=True))
    def get_next_article(self, obj) -> dict | None:
        article = (
            self._published_siblings(obj).filter(order__gt=obj.order).order_by("order").first()
        )
        return ArticleLinkSerializer(article).data if article else None

    @extend_schema_field(ArticleReviewStateSerializer)
    def get_review_state(self, obj) -> dict:
        from apps.contributions.services import latest_stage_reviews

        records = [
            record
            for record in obj.review_records.all()
            if record.proposal_id is None and record.content_hash == obj.content_hash
        ]
        latest_records = latest_stage_reviews(records)
        latest = {
            stage: {"decision": record.decision, "created_at": record.created_at}
            if (record := latest_records.get(stage))
            else None
            for stage in ("technical", "language", "editorial")
        }
        approved_stages = {
            stage
            for stage in ("technical", "language")
            if latest[stage] and latest[stage]["decision"] == "approved"
        }
        return {
            "technical_approved": "technical" in approved_stages,
            "language_approved": "language" in approved_stages,
            "fully_reviewed": {"technical", "language"}.issubset(approved_stages),
            "content_hash": obj.content_hash,
            "latest": latest,
        }

    def get_russian_source_url(self, obj) -> str | None:
        source = obj.provenance.get("source") if isinstance(obj.provenance, dict) else None
        if not isinstance(source, dict):
            return None
        value = source.get("russian_url")
        return (
            value if isinstance(value, str) and value.startswith("http://e-maxx.ru/algo/") else None
        )
