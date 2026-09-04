from django.db.models import Count, F, IntegerField, Q
from django.db.models.expressions import ExpressionWrapper
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets

from ..models import Article, Category, Tag
from ..serializers import (
    CategorySerializer,
    TagSerializer,
)


@extend_schema_view(list=extend_schema(tags=["Catalog"]), retrieve=extend_schema(tags=["Catalog"]))
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None

    def get_queryset(self):
        queryset = (
            Category.objects.filter(is_active=True)
            .select_related("parent")
            .annotate(
                direct_count=Count(
                    "articles",
                    filter=Q(articles__visibility=Article.Visibility.PUBLIC),
                    distinct=True,
                ),
                child_count=Count(
                    "children__articles",
                    filter=Q(children__articles__visibility=Article.Visibility.PUBLIC),
                    distinct=True,
                ),
            )
            .annotate(
                article_count=ExpressionWrapper(
                    F("direct_count") + F("child_count"), output_field=IntegerField()
                )
            )
        )
        if self.action == "list":
            queryset = queryset.filter(parent__isnull=True)
        return queryset


@extend_schema_view(list=extend_schema(tags=["Catalog"]), retrieve=extend_schema(tags=["Catalog"]))
class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = "slug"
    pagination_class = None
    search_fields = ("name", "description")
