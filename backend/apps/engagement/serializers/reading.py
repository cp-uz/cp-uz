from rest_framework import serializers

from apps.articles.models import Article
from apps.articles.serializers import ArticleListSerializer

from ..models import Bookmark, PersonalNote, ReadingProgress
from ..services import save_reading_progress


class ArticleSlugWriteMixin(serializers.Serializer):
    article_slug = serializers.SlugRelatedField(
        source="article",
        slug_field="slug",
        queryset=Article.objects.public(),
        write_only=True,
    )


class BookmarkSerializer(ArticleSlugWriteMixin, serializers.ModelSerializer):
    article = ArticleListSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ("id", "article", "article_slug", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_article_slug(self, article):
        user = self.context["request"].user
        queryset = Bookmark.objects.filter(user=user, article=article)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Bu maqola allaqachon saqlangan.")
        return article


class ReadingProgressSerializer(ArticleSlugWriteMixin, serializers.ModelSerializer):
    article = ArticleListSerializer(read_only=True)

    class Meta:
        model = ReadingProgress
        fields = (
            "id",
            "article",
            "article_slug",
            "status",
            "percent",
            "last_heading",
            "last_read_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "last_read_at", "created_at", "updated_at")

    def validate(self, attrs):
        status = attrs.get("status", getattr(self.instance, "status", None))
        percent = attrs.get("percent", getattr(self.instance, "percent", 0))
        current_percent = getattr(self.instance, "percent", 0)
        if percent < current_percent:
            attrs["percent"] = current_percent
            attrs["status"] = self.instance.status
            return attrs
        if percent >= 100:
            attrs["percent"] = 100
            attrs["status"] = ReadingProgress.Status.COMPLETED
        elif percent > 0 and status in {None, ReadingProgress.Status.NOT_STARTED}:
            attrs["status"] = ReadingProgress.Status.IN_PROGRESS
        elif status == ReadingProgress.Status.COMPLETED and percent < 100:
            attrs["percent"] = 100
        return attrs

    def create(self, validated_data):
        user = validated_data.pop("user")
        return save_reading_progress(user=user, changes=validated_data)

    def update(self, instance, validated_data):
        return save_reading_progress(
            user=self.context["request"].user, changes=validated_data, instance_id=instance.pk
        )


class PersonalNoteSerializer(ArticleSlugWriteMixin, serializers.ModelSerializer):
    article = ArticleListSerializer(read_only=True)

    class Meta:
        model = PersonalNote
        fields = (
            "id",
            "article",
            "article_slug",
            "body",
            "anchor",
            "quote",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_body(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Eslatma bo‘sh bo‘lishi mumkin emas.")
        return value
