from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions

from ..models import (
    Participant,
    ParticipantPlatformAccount,
    PublicationStatus,
    ResultEntry,
)
from ..serializers import (
    ParticipantDetailSerializer,
)


@extend_schema(tags=["Seasons"], responses=ParticipantDetailSerializer)
class ParticipantDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ParticipantDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "participant_slug"

    def get_queryset(self):
        season_slug = self.kwargs["season_slug"]
        season_results = (
            ResultEntry.objects.filter(
                event__season__slug=season_slug,
                event__season__publication_status=PublicationStatus.PUBLISHED,
                event__publication_status=PublicationStatus.PUBLISHED,
            )
            .select_related("event")
            .order_by("event__start_date", "event__order", "order", "rank")
        )
        return (
            Participant.objects.filter(
                is_active=True,
                results__event__season__slug=season_slug,
                results__event__season__publication_status=PublicationStatus.PUBLISHED,
                results__event__publication_status=PublicationStatus.PUBLISHED,
            )
            .prefetch_related(
                "aliases",
                Prefetch(
                    "platform_accounts",
                    queryset=ParticipantPlatformAccount.objects.filter(is_public=True),
                ),
                Prefetch("results", queryset=season_results, to_attr="season_results"),
            )
            .distinct()
        )
