from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..filters import ArticleFilter
from ..models import Article
from ..selectors import article_details
from ..serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=["Articles"]), retrieve=extend_schema(tags=["Articles"])
)
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    filterset_class = ArticleFilter
    search_fields = ("title", "subtitle", "summary", "content", "tags__name")
    ordering_fields = ("published_at", "updated_at", "order", "title", "estimated_reading_minutes")
    ordering = ("category__order", "order", "title")

    def get_queryset(self):
        queryset = Article.objects.with_listing_data()
        if self.action == "retrieve":
            queryset = article_details(queryset)
        else:
            queryset = queryset.defer("content", "provenance")
        if (
            self.request.user.is_staff
            and self.request.query_params.get("include_unpublished") == "true"
        ):
            return queryset.distinct()
        return queryset.public().distinct()

    def get_serializer_class(self):
        return ArticleDetailSerializer if self.action == "retrieve" else ArticleListSerializer

    @extend_schema(responses=ArticleListSerializer(many=True))
    @action(detail=False, methods=("get",), url_path="all", pagination_class=None)
    def all_items(self, request):
        """Return the fixed, lightweight article index without a large page_size query."""

        queryset = self.filter_queryset(self.get_queryset())
        return Response(self.get_serializer(queryset, many=True).data)


@extend_schema(tags=["Articles"], responses=ArticleDetailSerializer)
class ArticleByPathView(generics.RetrieveAPIView):
    serializer_class = ArticleDetailSerializer
    lookup_field = "canonical_path"
    lookup_url_kwarg = "canonical_path"

    def get_queryset(self):
        return article_details(Article.objects.public().with_listing_data())
