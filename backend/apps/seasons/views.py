from django.db.models import Count, Prefetch, Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Event,
    EventEdge,
    EventRoute,
    Participant,
    ParticipantPlatformAccount,
    PublicationStatus,
    ResultEntry,
    Route,
    Season,
    TeamMember,
)
from .serializers import (
    EventDetailSerializer,
    ParticipantDetailSerializer,
    SeasonGraphSerializer,
    SeasonListSerializer,
)


def graph_queryset():
    result_queryset = ResultEntry.objects.select_related("participant", "team").prefetch_related(
        "participant__aliases",
        Prefetch(
            "team__members",
            queryset=TeamMember.objects.select_related("participant").prefetch_related(
                "participant__aliases"
            ),
        ),
    )
    event_queryset = (
        Event.objects.published()
        .prefetch_related(
            Prefetch(
                "route_memberships",
                queryset=EventRoute.objects.filter(route__is_visible=True).select_related("route"),
                to_attr="public_route_memberships",
            ),
            "resources",
            "sources",
            Prefetch("results", queryset=result_queryset),
        )
        .order_by("order", "start_date", "title")
    )
    edge_queryset = (
        EventEdge.objects.filter(
            from_event__publication_status=PublicationStatus.PUBLISHED,
            to_event__publication_status=PublicationStatus.PUBLISHED,
        )
        .select_related("from_event", "to_event", "route")
        .order_by("order", "from_event__order", "to_event__order")
    )
    return (
        Season.objects.published()
        .prefetch_related(
            Prefetch(
                "routes",
                queryset=Route.objects.filter(is_visible=True).order_by("order", "title"),
                to_attr="public_routes",
            ),
            Prefetch("events", queryset=event_queryset, to_attr="public_events"),
            Prefetch("edges", queryset=edge_queryset, to_attr="public_edges"),
        )
        .order_by("-is_featured", "-order", "-start_date")
    )


@extend_schema_view(
    list=extend_schema(tags=["Seasons"], responses=SeasonListSerializer(many=True)),
    retrieve=extend_schema(tags=["Seasons"], responses=SeasonGraphSerializer),
)
class SeasonViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
    lookup_field = "slug"
    pagination_class = None

    def get_queryset(self):
        if self.action in {"retrieve", "current"}:
            return graph_queryset()
        queryset = Season.objects.published().annotate(
            event_count=Count(
                "events",
                filter=Q(events__publication_status=PublicationStatus.PUBLISHED),
                distinct=True,
            )
        )
        if self.request.query_params.get("featured", "").lower() in {"1", "true", "yes"}:
            queryset = queryset.filter(is_featured=True)
        return queryset

    def get_serializer_class(self):
        return SeasonListSerializer if self.action == "list" else SeasonGraphSerializer

    @extend_schema(tags=["Seasons"], responses=SeasonGraphSerializer)
    @action(detail=False, methods=("get",), url_path="current")
    def current(self, request):
        queryset = self.get_queryset()
        today = timezone.localdate()
        season = queryset.filter(is_featured=True).first()
        if season is None:
            season = queryset.filter(start_date__lte=today, end_date__gte=today).first()
        if season is None:
            season = queryset.first()
        if season is None:
            return Response(
                {"detail": "Hozircha nashr qilingan mavsum yo‘q."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(self.get_serializer(season).data)


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
