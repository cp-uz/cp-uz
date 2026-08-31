from django.core.cache import cache
from django.db.models import Count, F, IntegerField, Q
from django.db.models.expressions import ExpressionWrapper
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import ArticleFilter
from .models import Article, Category, ExternalPracticeReference, GlossaryTerm, Tag
from .serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
    CategorySerializer,
    GlossaryTermDetailSerializer,
    GlossaryTermListSerializer,
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
        if (
            self.request.user.is_staff
            and self.request.query_params.get("include_unpublished") == "true"
        ):
            return queryset.distinct()
        return queryset.public().distinct()

    def get_serializer_class(self):
        return ArticleDetailSerializer if self.action == "retrieve" else ArticleListSerializer

    @action(detail=False, methods=("get",), url_path="all")
    def all_items(self, request):
        """Return the fixed, lightweight article index without a large page_size query."""

        queryset = self.filter_queryset(self.get_queryset())
        return Response(self.get_serializer(queryset, many=True).data)


@extend_schema_view(
    list=extend_schema(tags=["Glossary"]), retrieve=extend_schema(tags=["Glossary"])
)
class GlossaryTermViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    search_fields = ("term", "aliases", "short_definition", "definition")
    ordering_fields = ("term", "updated_at")

    def get_queryset(self):
        return GlossaryTerm.objects.filter(is_published=True).prefetch_related("related_articles")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return GlossaryTermDetailSerializer
        return GlossaryTermListSerializer

    @action(detail=False, methods=("get",), url_path="all")
    def all_items(self, request):
        """Return the curated glossary in one small response for local filtering and quizzes."""

        queryset = self.filter_queryset(self.get_queryset())
        return Response(self.get_serializer(queryset, many=True).data)


@extend_schema(tags=["Articles"], responses=ArticleDetailSerializer)
class ArticleByPathView(generics.RetrieveAPIView):
    serializer_class = ArticleDetailSerializer
    lookup_field = "canonical_path"
    lookup_url_kwarg = "canonical_path"

    def get_queryset(self):
        return (
            Article.objects.public()
            .with_listing_data()
            .prefetch_related(
                "practice_references", "prerequisite_links__prerequisite", "review_records"
            )
        )


@extend_schema(tags=["Catalog"], responses={200: dict})
class PublicStatsView(APIView):
    permission_classes = [permissions.AllowAny]
    cache_key = "public-knowledge-stats-v1"

    def get(self, request):
        payload = cache.get(self.cache_key)
        if payload is None:
            articles = Article.objects.public()
            article_count = articles.count()
            full_translations = articles.filter(
                provenance__translation__full_prose_translated=True
            ).count()
            payload = {
                "articles": article_count,
                "categories": Category.objects.filter(is_active=True, parent__isnull=True).count(),
                "practice_references": ExternalPracticeReference.objects.filter(
                    is_active=True, article__visibility=Article.Visibility.PUBLIC
                ).count(),
                "full_translations": full_translations,
                "synopsis_drafts": article_count - full_translations,
                "editorial": {
                    "draft": articles.filter(status=Article.Status.DRAFT).count(),
                    "in_review": articles.filter(status=Article.Status.IN_REVIEW).count(),
                    "published": articles.filter(status=Article.Status.PUBLISHED).count(),
                },
            }
            cache.set(self.cache_key, payload, timeout=300)
        return Response(payload)
