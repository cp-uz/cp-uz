import hashlib
import logging
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from django.core.cache import cache
from django.db.models import Count, Prefetch, Q
from django.http import HttpResponse, HttpResponseNotModified
from django.shortcuts import get_object_or_404
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.seasons.models import Event, PublicationStatus, Season
from apps.seasons.serializers import EventGraphSerializer, SeasonLinkSerializer

from .models import Problem, ProblemSet
from .serializers import (
    ProblemCatalogResponseSerializer,
    ProblemDetailSerializer,
    ProblemEventResponseSerializer,
    ProblemSetSerializer,
)

logger = logging.getLogger(__name__)

STATEMENT_PDF_CACHE_SECONDS = 60 * 60 * 24
STATEMENT_PDF_MAX_BYTES = 10 * 1024 * 1024
STATEMENT_PDF_SOURCE_HOST = "raw.githubusercontent.com"
STATEMENT_PDF_SOURCE_PATH_PREFIX = "/cp-uz/problem-statements/"


def public_problem_queryset():
    return Problem.objects.filter(
        publication_status=PublicationStatus.PUBLISHED,
        problem_set__publication_status=PublicationStatus.PUBLISHED,
        problem_set__event__publication_status=PublicationStatus.PUBLISHED,
        problem_set__event__season__publication_status=PublicationStatus.PUBLISHED,
    )


def public_problem_for_path(season_slug: str, event_slug: str, problem_slug: str) -> Problem:
    return get_object_or_404(
        public_problem_queryset(),
        problem_set__event__season__slug=season_slug,
        problem_set__event__slug=event_slug,
        slug=problem_slug,
    )


def fetch_statement_pdf(problem: Problem) -> bytes:
    source_url = problem.statement_pdf_url
    parsed = urlparse(source_url)
    if not (
        parsed.scheme == "https"
        and parsed.hostname == STATEMENT_PDF_SOURCE_HOST
        and parsed.path.startswith(STATEMENT_PDF_SOURCE_PATH_PREFIX)
    ):
        raise ValueError("Unsupported statement PDF source")

    cache_key = f"problem-statement-pdf:{problem.statement_pdf_sha256 or problem.pk}"
    cached = cache.get(cache_key)
    if isinstance(cached, bytes):
        return cached

    upstream_request = Request(
        source_url,
        headers={"Accept": "application/pdf", "User-Agent": "cp.uz statement proxy"},
    )
    with urlopen(upstream_request, timeout=15) as upstream:  # noqa: S310
        payload = upstream.read(STATEMENT_PDF_MAX_BYTES + 1)

    if len(payload) > STATEMENT_PDF_MAX_BYTES:
        raise ValueError("Statement PDF is too large")
    if not payload.startswith(b"%PDF-"):
        raise ValueError("Statement source is not a PDF")
    if problem.statement_pdf_size_bytes and len(payload) != problem.statement_pdf_size_bytes:
        raise ValueError("Statement PDF size does not match its metadata")
    if problem.statement_pdf_sha256:
        checksum = hashlib.sha256(payload).hexdigest()
        if checksum != problem.statement_pdf_sha256:
            raise ValueError("Statement PDF checksum does not match its metadata")

    cache.set(cache_key, payload, timeout=STATEMENT_PDF_CACHE_SECONDS)
    return payload


def public_sets_for_event(event: Event):
    problems = (
        public_problem_queryset()
        .filter(problem_set__event=event)
        .prefetch_related("links", "attachments")
    )
    return (
        ProblemSet.objects.filter(event=event, publication_status=PublicationStatus.PUBLISHED)
        .prefetch_related(Prefetch("problems", queryset=problems, to_attr="public_problems"))
        .order_by("order", "title")
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


class ProblemDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProblemDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "problem_slug"

    def get_object(self):
        if not hasattr(self, "_problem_object"):
            self._problem_object = super().get_object()
        return self._problem_object

    @extend_schema(
        tags=["Problems"], operation_id="problem_detail", responses=ProblemDetailSerializer
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return (
            public_problem_queryset()
            .filter(
                problem_set__event__season__slug=self.kwargs["season_slug"],
                problem_set__event__slug=self.kwargs["event_slug"],
            )
            .select_related("problem_set", "problem_set__event", "problem_set__event__season")
            .prefetch_related("links", "attachments")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        obj = self.get_object()
        context["event_sets"] = list(public_sets_for_event(obj.event))
        return context


class ProblemStatementPdfView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        tags=["Problems"],
        operation_id="problem_statement_pdf",
        responses={(200, "application/pdf"): OpenApiTypes.BINARY},
    )
    def get(self, request, season_slug: str, event_slug: str, problem_slug: str):
        problem = public_problem_for_path(season_slug, event_slug, problem_slug)
        if not problem.statement_pdf_url:
            return Response({"detail": "Bu masala uchun PDF mavjud emas."}, status=404)

        etag = f'"{problem.statement_pdf_sha256}"' if problem.statement_pdf_sha256 else ""
        if etag and request.headers.get("If-None-Match") == etag:
            response = HttpResponseNotModified()
        else:
            try:
                payload = fetch_statement_pdf(problem)
            except (HTTPError, URLError, TimeoutError, ValueError, OSError):
                logger.exception("Could not load statement PDF for problem %s", problem.pk)
                return Response({"detail": "Masala PDF’ini yuklab bo‘lmadi."}, status=502)

            response = HttpResponse(payload, content_type="application/pdf")
            response["Content-Length"] = str(len(payload))
            response["Content-Disposition"] = f'inline; filename="{problem.slug}.pdf"'

        response["Cache-Control"] = f"public, max-age={STATEMENT_PDF_CACHE_SECONDS}"
        response["X-Content-Type-Options"] = "nosniff"
        if etag:
            response["ETag"] = etag
        return response
