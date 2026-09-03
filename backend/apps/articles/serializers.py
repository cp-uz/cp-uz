from pathlib import PurePosixPath

from django.conf import settings
from django.db import models
from rest_framework import serializers

from apps.accounts.serializers import UserSummarySerializer
from config.frontend_routes import algorithm_path

from .models import (
    Article,
    ArticleContributor,
    ArticlePrerequisite,
    Category,
    ExternalPracticeReference,
    GlossaryTerm,
    Tag,
)


class CategorySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "slug", "icon", "color")


class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.IntegerField(read_only=True, default=0)
    parent_slug = serializers.SlugRelatedField(source="parent", slug_field="slug", read_only=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "color",
            "parent_slug",
            "order",
            "article_count",
            "children",
        )

    def get_children(self, obj) -> list[dict]:
        queryset = (
            obj.children.filter(is_active=True)
            .annotate(
                article_count=models.Count(
                    "articles",
                    filter=models.Q(articles__visibility=Article.Visibility.PUBLIC),
                    distinct=True,
                )
            )
            .order_by("order", "name")
        )
        return CategorySerializer(queryset, many=True, context=self.context).data


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "slug", "description")


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
    prerequisites = PrerequisiteSerializer(source="prerequisite_links", many=True, read_only=True)
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

    def get_related_articles(self, obj) -> list[dict]:
        queryset = (
            Article.objects.public()
            .filter(tags__in=obj.tags.all(), language=obj.language)
            .exclude(pk=obj.pk)
            .distinct()[:4]
        )
        return ArticleLinkSerializer(queryset, many=True).data

    def get_practice_references(self, obj) -> list[dict]:
        queryset = obj.practice_references.filter(is_active=True)
        return PracticeReferenceSerializer(queryset, many=True).data

    def get_previous_article(self, obj) -> dict | None:
        article = (
            self._published_siblings(obj).filter(order__lt=obj.order).order_by("-order").first()
        )
        return ArticleLinkSerializer(article).data if article else None

    def get_next_article(self, obj) -> dict | None:
        article = (
            self._published_siblings(obj).filter(order__gt=obj.order).order_by("order").first()
        )
        return ArticleLinkSerializer(article).data if article else None

    def get_review_state(self, obj) -> dict:
        current = obj.review_records.filter(proposal__isnull=True, content_hash=obj.content_hash)
        latest = {
            stage: current.filter(stage=stage)
            .order_by("-created_at")
            .values("decision", "created_at")
            .first()
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
            value
            if isinstance(value, str) and value.startswith("http://e-maxx.ru/algo/")
            else None
        )


class GlossaryTermListSerializer(serializers.ModelSerializer):
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
    related_articles = ArticleLinkSerializer(many=True, read_only=True)

    class Meta(GlossaryTermListSerializer.Meta):
        fields = GlossaryTermListSerializer.Meta.fields + ("definition", "related_articles")
