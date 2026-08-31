from django.db import transaction
from rest_framework import serializers

from apps.articles.models import Article
from apps.articles.serializers import ArticleListSerializer

from .models import Bookmark, PersonalNote, ReadingProgress


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
        article = validated_data.pop("article")
        with transaction.atomic():
            instance = (
                ReadingProgress.objects.select_for_update()
                .filter(user=user, article=article)
                .first()
            )
            if instance is None:
                return ReadingProgress.objects.create(
                    user=user,
                    article=article,
                    **validated_data,
                )

            incoming_percent = validated_data.get("percent", instance.percent)
            if incoming_percent < instance.percent:
                validated_data["percent"] = instance.percent
                validated_data["status"] = instance.status

            for field, value in validated_data.items():
                setattr(instance, field, value)
            instance.save(update_fields=[*validated_data, "updated_at"])
            return instance


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


class GlossaryQuizSubmissionSerializer(serializers.Serializer):
    is_correct = serializers.BooleanField()


class GlossaryLeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField(min_value=1)
    name = serializers.CharField()
    correct = serializers.IntegerField(min_value=0)
    total = serializers.IntegerField(min_value=0)
    percent = serializers.IntegerField(min_value=0, max_value=100)
    current_streak = serializers.IntegerField(min_value=0)
    best_streak = serializers.IntegerField(min_value=0)
    is_current_user = serializers.BooleanField()
    updated_at = serializers.DateTimeField()


class GlossaryQuizStateSerializer(serializers.Serializer):
    leaderboard = GlossaryLeaderboardEntrySerializer(many=True)
    personal = GlossaryLeaderboardEntrySerializer(allow_null=True)
