from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ArticleByPathView,
    ArticleViewSet,
    CategoryViewSet,
    GlossaryTermViewSet,
    PublicStatsView,
    TagViewSet,
)

app_name = "articles"

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("tags", TagViewSet, basename="tag")
router.register("articles", ArticleViewSet, basename="article")
router.register("glossary", GlossaryTermViewSet, basename="glossary")

urlpatterns = [
    path("stats/", PublicStatsView.as_view(), name="public-stats"),
    path(
        "articles/by-path/<path:canonical_path>/",
        ArticleByPathView.as_view(),
        name="article-by-path",
    ),
] + router.urls
