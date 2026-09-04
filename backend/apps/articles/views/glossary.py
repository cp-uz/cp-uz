from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import Article, GlossaryTerm
from ..serializers import (
    GlossaryTermDetailSerializer,
    GlossaryTermListSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=["Glossary"]), retrieve=extend_schema(tags=["Glossary"])
)
class GlossaryTermViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    search_fields = ("term", "aliases", "short_definition", "definition")
    ordering_fields = ("term", "updated_at")

    def get_queryset(self):
        return GlossaryTerm.objects.filter(is_published=True).prefetch_related(
            Prefetch(
                "related_articles",
                queryset=Article.objects.public().select_related("category"),
                to_attr="public_related_articles",
            )
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return GlossaryTermDetailSerializer
        return GlossaryTermListSerializer

    @extend_schema(responses=GlossaryTermListSerializer(many=True))
    @action(detail=False, methods=("get",), url_path="all", pagination_class=None)
    def all_items(self, request):
        """Return the curated glossary in one small response for local filtering and quizzes."""

        queryset = self.filter_queryset(self.get_queryset())
        return Response(self.get_serializer(queryset, many=True).data)
