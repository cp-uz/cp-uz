from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import EventDetailView, ParticipantDetailView, SeasonViewSet

app_name = "seasons"

router = DefaultRouter()
router.register("seasons", SeasonViewSet, basename="season")

urlpatterns = [
    path(
        "seasons/<slug:season_slug>/events/<slug:event_slug>/",
        EventDetailView.as_view(),
        name="event-detail",
    ),
    path(
        "seasons/<slug:season_slug>/participants/<slug:participant_slug>/",
        ParticipantDetailView.as_view(),
        name="participant-detail",
    ),
] + router.urls
