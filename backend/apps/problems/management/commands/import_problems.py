from __future__ import annotations

import json
from collections import Counter
from datetime import date
from decimal import Decimal
from pathlib import Path
from typing import Any

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from jsonschema import Draft202012Validator

from apps.problems.models import Problem, ProblemAttachment, ProblemLink, ProblemSet
from apps.seasons.models import Event

CONTENT_ROOT = Path(__file__).resolve().parents[5] / "content"
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
        validator = Draft202012Validator(self.read_json(schema_path))
        self.stats: Counter[str] = Counter()
        try:
            with transaction.atomic():
                imported_event_ids: set[str] = set()
                for event_file in sorted(root.glob("*/*/event.json")):
                    event_data = self.read_document(event_file, validator)
                    event = self.get_event(event_data, event_file)
                    imported_event_ids.add(str(event.id))
                    self.import_event(
                        event, event_file.parent, event_data, validator, options["prune"]
                    )
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

    def read_json(self, path: Path) -> dict[str, Any]:
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise CommandError(f"{path}: JSON o‘qilmadi: {exc}") from exc
        if not isinstance(payload, dict):
            raise CommandError(f"{path}: JSON object bo‘lishi kerak.")
        return payload

    def read_document(self, path: Path, validator: Draft202012Validator) -> dict[str, Any]:
        payload = self.read_json(path)
        errors = sorted(validator.iter_errors(payload), key=lambda item: list(item.absolute_path))
        if errors:
            error = errors[0]
            location = ".".join(str(part) for part in error.absolute_path) or "$"
            raise CommandError(f"{path}:{location}: schema validatsiyasi: {error.message}")
        return payload

    def get_event(self, data: dict[str, Any], path: Path) -> Event:
        try:
            return Event.objects.get(season__slug=data["season_slug"], slug=data["event_slug"])
        except Event.DoesNotExist as exc:
            raise CommandError(
                f"{path}: season/event topilmadi: {data['season_slug']}/{data['event_slug']}"
            ) from exc

    def import_event(
        self,
        event: Event,
        directory: Path,
        event_data: dict[str, Any],
        validator: Draft202012Validator,
        prune: bool,
    ):
        expected_set_slugs: set[str] = set()
        for relative_path in event_data["sets"]:
            set_directory = (directory / relative_path).resolve()
            if directory.resolve() not in set_directory.parents or not set_directory.is_dir():
                raise CommandError(f"{directory}: noto‘g‘ri set path: {relative_path}")
            set_file = set_directory / "set.json"
            set_data = self.read_document(set_file, validator)
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
            self.import_set(problem_set, set_directory, set_data, validator, prune)
        if prune:
            deleted, _ = event.problem_sets.exclude(slug__in=expected_set_slugs).delete()
            self.stats["set_rows_deleted"] += deleted

    def import_set(
        self,
        problem_set: ProblemSet,
        directory: Path,
        set_data: dict[str, Any],
        validator: Draft202012Validator,
        prune: bool,
    ):
        expected_slugs: set[str] = set()
        for relative_path in set_data["problems"]:
            problem_directory = (directory / relative_path).resolve()
            if (
                directory.resolve() not in problem_directory.parents
                or not problem_directory.is_dir()
            ):
                raise CommandError(f"{directory}: noto‘g‘ri problem path: {relative_path}")
            problem_file = problem_directory / "problem.json"
            data = self.read_document(problem_file, validator)
            statement_path = (problem_directory / data["statement_file"]).resolve()
            if problem_directory not in statement_path.parents or not statement_path.is_file():
                raise CommandError(f"{problem_file}: statement topilmadi yoki path noto‘g‘ri.")
            statement = statement_path.read_text(encoding="utf-8").strip()
            if not statement:
                raise CommandError(f"{statement_path}: masala sharti bo‘sh.")
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
                    "statement_pdf_provenance": data.get("statement_pdf", {}).get(
                        "provenance", ""
                    ),
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
