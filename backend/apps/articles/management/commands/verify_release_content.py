"""Verify the database against the reviewed canonical release inventory."""

from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from apps.articles.models import Article, Category, ExternalPracticeReference, GlossaryTerm
from apps.problems.models import Problem, ProblemAttachment, ProblemLink, ProblemSet
from apps.seasons.models import Event, EventEdge, ResultEntry, Route, Season
from content_tools.release_inventory import check_inventory


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("--content-root", type=Path, default=Path("/app/content"))
        parser.add_argument("--manifest", type=Path, default=Path("/app/release-inventory.json"))

    def handle(self, *args, **options):
        try:
            expected = check_inventory(options["content_root"], options["manifest"])
        except (OSError, ValueError) as exc:
            raise CommandError(str(exc)) from exc
        actual = {
            "articles": Article.objects.count(),
            "published_articles": Article.objects.filter(status="published").count(),
            "root_categories": Category.objects.filter(parent__isnull=True, is_active=True).count(),
            "practice_references": ExternalPracticeReference.objects.filter(is_active=True).count(),
            "glossary_terms": GlossaryTerm.objects.filter(is_published=True).count(),
            "seasons": Season.objects.count(),
            "public_seasons": Season.objects.published().count(),
            "routes": Route.objects.count(),
            "events": Event.objects.count(),
            "public_events": Event.objects.published().count(),
            "edges": EventEdge.objects.count(),
            "local_results": ResultEntry.objects.filter(is_local=True).count(),
            "sets": ProblemSet.objects.count(),
            "public_sets": ProblemSet.objects.filter(publication_status="published").count(),
            "problems": Problem.objects.count(),
            "public_problems": Problem.objects.filter(publication_status="published").count(),
            "links": ProblemLink.objects.count(),
            "attachments": ProblemAttachment.objects.count(),
            "statement_pdfs": Problem.objects.exclude(statement_pdf_url="").count(),
        }
        if actual != expected:
            differences = {
                key: {"expected": value, "actual": actual.get(key)}
                for key, value in expected.items()
                if actual.get(key) != value
            }
            raise CommandError(f"Imported release inventory mismatch: {differences}")
        self.stdout.write(self.style.SUCCESS("Canonical release inventory matches database."))
