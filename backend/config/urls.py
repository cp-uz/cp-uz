from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import CpuzTokenObtainPairView, GuestSessionView, GuestUpgradeView
from config.health import health
from config.seo import robots_txt
from config.sitemaps import ArticleSitemap, CategorySitemap, StaticSitemap

sitemaps = {
    "articles": ArticleSitemap,
    "categories": CategorySitemap,
    "static": StaticSitemap,
}


urlpatterns = [
    path("api/v1/health/", health, name="health"),
    path(
        "sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap"
    ),
    path("robots.txt", robots_txt, name="robots-txt"),
    path("admin/", admin.site.urls),
    path("api/v1/auth/token/", CpuzTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/auth/login/", CpuzTokenObtainPairView.as_view(), name="login"),
    path("api/v1/auth/guest/", GuestSessionView.as_view(), name="guest-session"),
    path("api/v1/auth/guest/upgrade/", GuestUpgradeView.as_view(), name="guest-upgrade"),
    path("api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/accounts/", include("apps.accounts.urls")),
    path("api/v1/glossary/", include("apps.engagement.quiz_urls")),
    path("api/v1/", include("apps.articles.urls")),
    path("api/v1/me/", include("apps.engagement.urls")),
    path("api/v1/contributions/", include("apps.contributions.urls")),
    path("api/v1/search/", include("apps.search.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
