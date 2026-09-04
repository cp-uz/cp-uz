from __future__ import annotations

from collections import Counter
from datetime import date
from decimal import Decimal
from pathlib import Path
from typing import Any

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.problems.models import Problem, ProblemAttachment, ProblemLink, ProblemSet
from apps.seasons.models import Event
from content_tools.problem_catalog import load_catalog

BACKEND_ROOT = Path(__file__).resolve().parents[4]
CONTENT_ROOT = next(
    (path for path in (BACKEND_ROOT / "content", BACKEND_ROOT.parent / "content") if path.is_dir()),
    BACKEND_ROOT / "content",
)
DEFAULT_DATA_PATH = CONTENT_ROOT / "problems"


class Command(BaseCommand):
    help = "Canonical content/problems fayllarini masalalar katalogiga import qiladi."

    def add_arguments(self, parser):
        parser.add_argument("--path", type=Path, default=DEFAULT_DATA_PATH)
        parser.add_argument("--schema", type=Path)
        parser.add_argument("--prune", action="store_true")
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **options):
        root = options["path"].resolve()
        self.data_root = root
        schema_path = (
            options["schema"] or root / "schema" / "problem-content.schema.json"
        ).resolve()
        if not root.is_dir():
            raise CommandError(f"Masalalar katalogi topilmadi: {root}")
        if not schema_path.is_file():
            raise CommandError(f"Masalalar sxemasi topilmadi: {schema_path}")
        try:
            catalog, _ = load_catalog(root, schema_path)
        except (OSError, ValueError) as exc:
            raise CommandError(str(exc)) from exc
        self.stats: Counter[str] = Counter()
        try:
            with transaction.atomic():
                imported_event_ids: set[str] = set()
                for event_record in catalog:
                    event = self.get_event(event_record["data"], event_record["path"])
                    imported_event_ids.add(str(event.id))
                    self.import_event(event, event_record, options["prune"])
                if not imported_event_ids:
                    raise CommandError("Canonical katalogda event.json topilmadi.")
                if options["prune"]:
                    deleted, _ = ProblemSet.objects.exclude(
                        event_id__in=imported_event_ids
                    ).delete()
                    self.stats["orphan_rows_deleted"] += deleted
                if options["dry_run"]:
                    transaction.set_rollback(True)
        except CommandError:
            raise
        except Exception as exc:
            raise CommandError(str(exc)) from exc

        action = "tekshirildi" if options["dry_run"] else "import qilindi"
        summary = ", ".join(f"{key}={value}" for key, value in sorted(self.stats.items()))
        self.stdout.write(self.style.SUCCESS(f"Masalalar {action}: {summary}"))

    def get_event(self, data: dict[str, Any], path: Path) -> Event:
        try:
            return Event.objects.get(season__slug=data["season_slug"], slug=data["event_slug"])
        except Event.DoesNotExist as exc:
            raise CommandError(
                f"{path}: season/event topilmadi: {data['season_slug']}/{data['event_slug']}"
            ) from exc

    def import_event(self, event: Event, record, prune: bool):
        expected_set_slugs: set[str] = set()
        for set_record in record["sets"]:
            set_data = set_record["data"]
            problem_set, created = ProblemSet.objects.update_or_create(
                event=event,
                slug=set_data["slug"],
                defaults={
                    "title": set_data["title"],
                    "description": set_data.get("description", ""),
                    "date_label": set_data.get("date_label", ""),
                    "order": set_data.get("order", 0),
                    "publication_status": set_data.get("publication_status", "draft"),
                },
            )
            self.stats[f"sets_{'created' if created else 'updated'}"] += 1
            expected_set_slugs.add(problem_set.slug)
            self.import_set(problem_set, set_record, prune)
        if prune:
            deleted, _ = event.problem_sets.exclude(slug__in=expected_set_slugs).delete()
            self.stats["set_rows_deleted"] += deleted

    def import_set(self, problem_set: ProblemSet, record, prune: bool):
        expected_slugs: set[str] = set()
        for problem_record in record["problems"]:
            data = problem_record["data"]
            statement_path = problem_record["statement_path"]
            statement = problem_record["statement"]
            problem, created = Problem.objects.update_or_create(
                problem_set=problem_set,
                slug=data["slug"],
                defaults={
                    "code": data["code"],
                    "title": data["title"],
                    "original_title": data.get("original_title", ""),
                    "statement_markdown": statement,
                    "source_path": (
                        Path("problems") / statement_path.relative_to(self.data_root)
                    ).as_posix(),
                    "statement_pdf_url": data.get("statement_pdf", {}).get("url", ""),
                    "statement_pdf_sha256": data.get("statement_pdf", {}).get("sha256", ""),
                    "statement_pdf_size_bytes": data.get("statement_pdf", {}).get("size_bytes"),
                    "statement_pdf_page_count": data.get("statement_pdf", {}).get("page_count"),
                    "statement_pdf_language": data.get("statement_pdf", {}).get("language", ""),
                    "statement_pdf_provenance": data.get("statement_pdf", {}).get("provenance", ""),
                    "translation_status": data.get("translation_status", "ai_translation"),
                    "problem_type": data.get("problem_type", "standard"),
                    "time_limit_ms": data.get("time_limit_ms"),
                    "memory_limit_mb": data.get("memory_limit_mb"),
                    "max_score": Decimal(str(data["max_score"]))
                    if data.get("max_score") is not None
                    else None,
                    "rating": data.get("rating"),
                    "difficulty_label": data.get("difficulty_label", ""),
                    "tags": data.get("tags", []),
                    "order": data.get("order", 0),
                    "publication_status": data.get("publication_status", "draft"),
                    "last_verified_on": date.fromisoformat(data["last_verified_on"])
                    if data.get("last_verified_on")
                    else None,
                },
            )
            problem.full_clean()
            problem.save()
            self.stats[f"problems_{'created' if created else 'updated'}"] += 1
            expected_slugs.add(problem.slug)
            self.import_links(problem, data.get("links", []), prune)
            self.import_attachments(problem, data.get("attachments", []), prune)
        if prune:
            deleted, _ = problem_set.problems.exclude(slug__in=expected_slugs).delete()
            self.stats["problem_rows_deleted"] += deleted

    def import_links(self, problem: Problem, links: list[dict[str, Any]], prune: bool):
        expected: set[tuple[str, str]] = set()
        for index, data in enumerate(links):
            link, created = ProblemLink.objects.update_or_create(
                problem=problem,
                kind=data["kind"],
                url=data["url"],
                defaults={
                    "title": data["title"],
                    "platform": data.get("platform", ""),
                    "is_official": data.get("is_official", False),
                    "is_primary": data.get("is_primary", False),
                    "order": data.get("order", index),
                },
            )
            link.full_clean()
            link.save()
            self.stats[f"links_{'created' if created else 'updated'}"] += 1
            expected.add((link.kind, link.url))
        if prune:
            for link in problem.links.all():
                if (link.kind, link.url) not in expected:
                    link.delete()
                    self.stats["link_rows_deleted"] += 1

    def import_attachments(self, problem: Problem, attachments: list[dict[str, Any]], prune: bool):
        expected: set[str] = set()
        for index, data in enumerate(attachments):
            attachment, created = ProblemAttachment.objects.update_or_create(
                problem=problem,
                url=data["url"],
                defaults={
                    "title": data["title"],
                    "content_type": data.get("content_type", ""),
                    "size_bytes": data.get("size_bytes"),
                    "order": data.get("order", index),
                },
            )
            self.stats[f"attachments_{'created' if created else 'updated'}"] += 1
            expected.add(attachment.url)
        if prune:
            deleted, _ = problem.attachments.exclude(url__in=expected).delete()
            self.stats["attachment_rows_deleted"] += deleted
