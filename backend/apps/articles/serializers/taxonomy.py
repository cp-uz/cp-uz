from django.db import models
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from ..models import (
    Article,
    Category,
    Tag,
)


class CategorySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "slug", "icon", "color")


class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.IntegerField(read_only=True, default=0)
    parent_slug = serializers.SlugRelatedField(
        source="parent", slug_field="slug", read_only=True, allow_null=True
    )
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

    @extend_schema_field({"type": "array", "items": {"$ref": "#/components/schemas/Category"}})
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
