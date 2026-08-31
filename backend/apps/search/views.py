from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.articles.models import Article, Category, GlossaryTerm
from apps.articles.serializers import (
    ArticleListSerializer,
    CategorySerializer,
    GlossaryTermListSerializer,
)

from .serializers import SearchQuerySerializer


class SearchView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        tags=["Search"],
        parameters=[SearchQuerySerializer],
        responses={200: dict},
    )
    def get(self, request):
        query_serializer = SearchQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)
        term = query_serializer.validated_data["q"]
        scope = query_serializer.validated_data["scope"]
        limit = query_serializer.validated_data["limit"]

        payload = {"query": term, "articles": [], "glossary": [], "categories": []}

        if scope in {"all", "articles"}:
            articles = (
                Article.objects.public()
                .with_listing_data()
                .filter(
                    Q(title__icontains=term)
                    | Q(subtitle__icontains=term)
                    | Q(summary__icontains=term)
                    | Q(content__icontains=term)
                    | Q(tags__name__icontains=term)
                )
                .distinct()[:limit]
            )
            payload["articles"] = ArticleListSerializer(articles, many=True).data

        if scope in {"all", "glossary"}:
            glossary = GlossaryTerm.objects.filter(is_published=True).filter(
                Q(term__icontains=term)
                | Q(aliases__icontains=term)
                | Q(short_definition__icontains=term)
                | Q(definition__icontains=term)
            )[:limit]
            payload["glossary"] = GlossaryTermListSerializer(glossary, many=True).data

        if scope in {"all", "categories"}:
            categories = Category.objects.filter(is_active=True).filter(
                Q(name__icontains=term) | Q(description__icontains=term)
            )[:limit]
            payload["categories"] = CategorySerializer(categories, many=True).data

        payload["total"] = sum(len(payload[key]) for key in ("articles", "glossary", "categories"))
        return Response(payload)
