from django.core.cache import cache
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Article, Category, ExternalPracticeReference
from ..serializers import (
    PublicStatsSerializer,
)


@extend_schema(tags=["Catalog"], responses={200: PublicStatsSerializer})
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
