from django.db.models import Prefetch

from ..models import (
    Event,
    EventEdge,
    EventRoute,
    PublicationStatus,
    ResultEntry,
    Route,
    Season,
    TeamMember,
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
