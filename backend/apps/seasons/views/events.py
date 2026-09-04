from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions

from ..models import (
    Event,
    EventRoute,
    PublicationStatus,
    ResultEntry,
    TeamMember,
)
from ..serializers import (
    EventDetailSerializer,
)


@extend_schema(tags=["Seasons"], responses=EventDetailSerializer)
class EventDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = EventDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "event_slug"

    def get_queryset(self):
        result_queryset = ResultEntry.objects.select_related(
            "participant", "team"
        ).prefetch_related(
            "participant__aliases",
            Prefetch(
                "team__members",
                queryset=TeamMember.objects.select_related("participant").prefetch_related(
                    "participant__aliases"
                ),
            ),
        )
        return (
            Event.objects.published()
            .filter(
                season__slug=self.kwargs["season_slug"],
                season__publication_status=PublicationStatus.PUBLISHED,
            )
            .select_related("season")
            .prefetch_related(
                Prefetch(
                    "route_memberships",
                    queryset=EventRoute.objects.filter(route__is_visible=True).select_related(
                        "route"
                    ),
                    to_attr="public_route_memberships",
                ),
                "resources",
                "sources",
                Prefetch("results", queryset=result_queryset),
            )
        )
