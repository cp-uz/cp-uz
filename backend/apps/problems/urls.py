from django.urls import path

from .views import (
    ProblemCatalogView,
    ProblemDetailView,
    ProblemEventView,
    ProblemStatementPdfView,
)

app_name = "problems"

urlpatterns = [
    path("problems/", ProblemCatalogView.as_view(), name="catalog"),
    path(
        "problems/<slug:season_slug>/<slug:event_slug>/",
        ProblemEventView.as_view(),
        name="event",
    ),
    path(
        "problems/<slug:season_slug>/<slug:event_slug>/<slug:problem_slug>/statement.pdf",
        ProblemStatementPdfView.as_view(),
        name="statement-pdf",
    ),
    path(
        "problems/<slug:season_slug>/<slug:event_slug>/<slug:problem_slug>/",
        ProblemDetailView.as_view(),
        name="detail",
    ),
]
