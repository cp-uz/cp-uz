from django.db.models import Prefetch
from django.shortcuts import get_object_or_404

from apps.seasons.models import Event, PublicationStatus

from ..models import Problem, ProblemSet


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
