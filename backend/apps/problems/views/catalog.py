from django.db.models import Count, Prefetch, Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.seasons.models import Event, PublicationStatus, Season
from apps.seasons.serializers import EventGraphSerializer, SeasonLinkSerializer

from ..models import ProblemSet
from ..selectors.catalog import public_problem_queryset, public_sets_for_event
from ..serializers import (
    ProblemCatalogResponseSerializer,
    ProblemEventResponseSerializer,
    ProblemSetSerializer,
)


class ProblemCatalogView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        tags=["Problems"],
        operation_id="problem_catalog",
        responses=ProblemCatalogResponseSerializer,
    )
    def get(self, request):
        problem_queryset = public_problem_queryset().only(
            "id",
            "problem_set_id",
            "slug",
            "code",
            "title",
            "original_title",
            "translation_status",
            "problem_type",
            "rating",
            "difficulty_label",
            "order",
        )
        set_queryset = (
            ProblemSet.objects.filter(publication_status=PublicationStatus.PUBLISHED)
            .prefetch_related(
                Prefetch("problems", queryset=problem_queryset, to_attr="public_problems")
            )
            .order_by("order", "title")
        )
        events = (
            Event.objects.published()
            .filter(
                season__publication_status=PublicationStatus.PUBLISHED,
                problem_sets__publication_status=PublicationStatus.PUBLISHED,
                problem_sets__problems__publication_status=PublicationStatus.PUBLISHED,
            )
            .select_related("season")
            .prefetch_related(
                Prefetch("problem_sets", queryset=set_queryset, to_attr="public_sets")
            )
            .annotate(
                problem_count=Count(
                    "problem_sets__problems",
                    filter=Q(
                        problem_sets__publication_status=PublicationStatus.PUBLISHED,
                        problem_sets__problems__publication_status=PublicationStatus.PUBLISHED,
                    ),
                    distinct=True,
                )
            )
            .distinct()
            .order_by("-season__start_date", "order", "title")
        )
        season_slug = request.query_params.get("season")
        if season_slug:
            events = events.filter(season__slug=season_slug)

        payload = []
        for event in events:
            payload.append(
                {
                    "season": SeasonLinkSerializer(event.season).data,
                    "event": {
                        "code": event.code,
                        "slug": event.slug,
                        "title": event.title,
                        "short_title": event.short_title,
                        "summary": event.summary,
                        "start_date": event.start_date,
                        "end_date": event.end_date,
                        "event_status": event.event_status,
                        "date_label": event.date_label,
                    },
                    "sets": ProblemSetSerializer(event.public_sets, many=True).data,
                    "problem_count": event.problem_count,
                }
            )
        seasons = Season.objects.published().filter(events__in=events).distinct()
        return Response(
            {"seasons": SeasonLinkSerializer(seasons, many=True).data, "events": payload}
        )


class ProblemEventView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get_event(self, season_slug: str, event_slug: str) -> Event:
        return get_object_or_404(
            Event.objects.published().select_related("season"),
            season__slug=season_slug,
            season__publication_status=PublicationStatus.PUBLISHED,
            slug=event_slug,
        )

    @extend_schema(
        tags=["Problems"],
        operation_id="problem_event",
        responses=ProblemEventResponseSerializer,
    )
    def get(self, request, season_slug: str, event_slug: str):
        event = self.get_event(season_slug, event_slug)
        sets = list(public_sets_for_event(event))
        if not any(problem_set.public_problems for problem_set in sets):
            return Response({"detail": "Bu event uchun nashr qilingan masala yo‘q."}, status=404)
        return Response(
            {
                "season": SeasonLinkSerializer(event.season).data,
                "event": EventGraphSerializer(event).data,
                "sets": ProblemSetSerializer(sets, many=True).data,
            }
        )
