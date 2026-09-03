from __future__ import annotations

import json
import tempfile
from io import StringIO
from pathlib import Path

from django.core.management import call_command
from django.test import TestCase

from apps.problems.models import Problem, ProblemLink, ProblemSet
from apps.seasons.models import Event, PublicationStatus, Season


class ProblemCatalogTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.season = Season.objects.create(
            title="2025–2026",
            slug="2025-2026",
            start_date="2025-09-01",
            end_date="2026-08-31",
            publication_status=PublicationStatus.PUBLISHED,
        )
        cls.event = Event.objects.create(
            season=cls.season,
            code="TST4",
            slug="ioi-2026-saralash-4",
            title="IOI saralash IV",
            short_title="Uzbekistan TST 2026",
            type=Event.Type.SELECTION,
            publication_status=PublicationStatus.PUBLISHED,
        )
        cls.problem_set = ProblemSet.objects.create(
            event=cls.event,
            slug="day-1",
            title="1-kun",
            order=1,
            publication_status=PublicationStatus.PUBLISHED,
        )
        cls.problem = Problem.objects.create(
            problem_set=cls.problem_set,
            slug="namuna",
            code="A",
            title="Namuna",
            statement_markdown="Shartda $n$ berilgan.",
            source_path="problems/test/statement.uz.md",
            translation_status="original_uzbek",
            rating=1800,
            order=1,
            publication_status=PublicationStatus.PUBLISHED,
        )
        ProblemLink.objects.create(
            problem=cls.problem,
            kind=ProblemLink.Kind.PRACTICE,
            title="Ishlash",
            url="https://example.com/problems/1",
            is_primary=True,
        )

    def test_catalog_returns_only_events_with_published_problems(self):
        response = self.client.get("/api/v1/problems/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["events"][0]["problem_count"], 1)
        self.assertEqual(response.data["events"][0]["sets"][0]["title"], "1-kun")
        self.assertEqual(response.data["events"][0]["sets"][0]["problems"][0]["slug"], "namuna")

    def test_event_and_problem_detail_are_nested_and_include_navigation(self):
        event = self.client.get("/api/v1/problems/2025-2026/ioi-2026-saralash-4/")
        detail = self.client.get("/api/v1/problems/2025-2026/ioi-2026-saralash-4/namuna/")

        self.assertEqual(event.status_code, 200)
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(detail.data["statement_markdown"], "Shartda $n$ berilgan.")
        self.assertEqual(detail.data["links"][0]["kind"], "practice")
        self.assertEqual(detail.data["sets"][0]["problems"][0]["code"], "A")
        self.assertEqual(
            self.client.get("/api/v1/problems/other/ioi-2026-saralash-4/namuna/").status_code,
            404,
        )

    def test_draft_problem_is_not_exposed(self):
        self.problem.publication_status = PublicationStatus.DRAFT
        self.problem.save(update_fields=("publication_status",))

        self.assertEqual(self.client.get("/api/v1/problems/").data["events"], [])
        self.assertEqual(
            self.client.get("/api/v1/problems/2025-2026/ioi-2026-saralash-4/namuna/").status_code,
            404,
        )

    def test_problem_is_in_sitemap(self):
        response = self.client.get("/sitemap.xml")

        self.assertContains(
            response,
            "/masalalar/2025-2026/ioi-2026-saralash-4/namuna/",
        )


class ProblemImportTests(TestCase):
    def setUp(self):
        season = Season.objects.create(
            title="2025–2026",
            slug="2025-2026",
            start_date="2025-09-01",
            end_date="2026-08-31",
            publication_status=PublicationStatus.PUBLISHED,
        )
        Event.objects.create(
            season=season,
            code="TST4",
            slug="ioi-2026-saralash-4",
            title="IOI saralash IV",
            type=Event.Type.SELECTION,
            publication_status=PublicationStatus.PUBLISHED,
        )

    def write_fixture(self, root: Path):
        event = root / "2025-2026" / "ioi-2026-saralash-4"
        problem = event / "day-1" / "namuna"
        problem.mkdir(parents=True)
        (event / "event.json").write_text(
            json.dumps(
                {
                    "document_type": "event",
                    "schema_version": 1,
                    "season_slug": "2025-2026",
                    "event_slug": "ioi-2026-saralash-4",
                    "sets": ["day-1"],
                }
            ),
            encoding="utf-8",
        )
        (event / "day-1" / "set.json").write_text(
            json.dumps(
                {
                    "document_type": "problem_set",
                    "schema_version": 1,
                    "slug": "day-1",
                    "title": "1-kun",
                    "order": 1,
                    "publication_status": "published",
                    "problems": ["namuna"],
                }
            ),
            encoding="utf-8",
        )
        (problem / "problem.json").write_text(
            json.dumps(
                {
                    "document_type": "problem",
                    "schema_version": 1,
                    "slug": "namuna",
                    "code": "A",
                    "title": "Namuna",
                    "statement_file": "statement.uz.md",
                    "translation_status": "original_uzbek",
                    "problem_type": "standard",
                    "order": 1,
                    "publication_status": "published",
                    "last_verified_on": "2026-09-03",
                    "links": [
                        {
                            "kind": "practice",
                            "title": "Ishlash",
                            "url": "https://example.com/problem/1",
                            "is_primary": True,
                        }
                    ],
                }
            ),
            encoding="utf-8",
        )
        (problem / "statement.uz.md").write_text("## Shart\n\n$1 \\le n$\n", encoding="utf-8")

    def test_import_is_idempotent_and_dry_run_rolls_back(self):
        schema = (
            Path(__file__).resolve().parents[4]
            / "content/problems/schema/problem-content.schema.json"
        )
        with tempfile.TemporaryDirectory(prefix="cpuz-problems-") as value:
            root = Path(value) / "problems"
            self.write_fixture(root)
            schema_target = root / "schema" / "problem-content.schema.json"
            schema_target.parent.mkdir()
            schema_target.write_text(
                schema.read_text(encoding="utf-8"),
                encoding="utf-8",
                newline="\n",
            )
            call_command(
                "import_problems",
                path=root,
                dry_run=True,
                stdout=StringIO(),
            )
            self.assertEqual(Problem.objects.count(), 0)
            call_command("import_problems", path=root, prune=True, stdout=StringIO())
            call_command("import_problems", path=root, prune=True, stdout=StringIO())

        self.assertEqual(ProblemSet.objects.count(), 1)
        self.assertEqual(Problem.objects.count(), 1)
        self.assertEqual(ProblemLink.objects.count(), 1)
        self.assertEqual(
            Problem.objects.get().source_path,
            "problems/2025-2026/ioi-2026-saralash-4/day-1/namuna/statement.uz.md",
        )
