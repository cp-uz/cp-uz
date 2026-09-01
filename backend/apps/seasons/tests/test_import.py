import json
from copy import deepcopy
from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

from apps.seasons.models import (
    Event,
    Participant,
    ParticipantPlatformAccount,
    ResultEntry,
    Route,
    Season,
    Team,
    TeamMember,
)


class SeasonImportTests(TestCase):
    def seed_payload(self):
        return {
            "schema_version": 1,
            "seasons": [
                {
                    "slug": "2025-2026",
                    "title": "2025–2026 mavsumi",
                    "summary": "Mavsum",
                    "start_date": "2025-09-01",
                    "end_date": "2026-08-31",
                    "publication_status": "published",
                    "verification_status": "verified",
                    "is_featured": True,
                    "routes": [
                        {
                            "code": "IOI",
                            "title": "IOI yo‘nalishi",
                            "kind": "selection",
                            "color": "blue",
                        }
                    ],
                    "events": [
                        {
                            "code": "G1",
                            "slug": "ioi-2026",
                            "title": "IOI 2026",
                            "summary": "Xalqaro final",
                            "type": "international",
                            "publication_status": "published",
                            "event_status": "completed",
                            "verification_status": "verified",
                            "date_precision": "range",
                            "start_date": "2026-08-09",
                            "end_date": "2026-08-16",
                            "route_memberships": [
                                {"route_code": "IOI", "order": 1, "node_style": "final"}
                            ],
                            "resources": [
                                {
                                    "type": "results",
                                    "title": "Natijalar",
                                    "url": "https://example.com/results",
                                    "is_official": True,
                                }
                            ],
                            "sources": [
                                {
                                    "type": "official",
                                    "title": "Rasmiy sayt",
                                    "url": "https://example.com/official",
                                }
                            ],
                            "results": [
                                {
                                    "key": "jahonali-2026",
                                    "participant": {
                                        "full_name": "Jahonali Xaydaraliyev",
                                        "aliases": ["Jakhonali Khaydaraliev"],
                                        "bio": "O‘zbekiston terma jamoasi a’zosi.",
                                        "platform_accounts": [
                                            {
                                                "platform": "codeforces",
                                                "handle": "jahonali",
                                                "url": "https://codeforces.com/profile/jahonali",
                                                "is_verified": True,
                                            }
                                        ],
                                    },
                                    "rank": 12,
                                    "score": 139.34,
                                    "medal": "silver",
                                }
                            ],
                        }
                    ],
                    "edges": [],
                }
            ],
        }

    def write_seed(self, directory: str, payload: dict) -> Path:
        path = Path(directory) / "seasons.json"
        path.write_text(json.dumps(payload), encoding="utf-8")
        return path

    def write_content_tree(self, directory: str, payload: dict) -> Path:
        root = Path(directory) / "seasons"
        for season in payload["seasons"]:
            season_directory = root / season["slug"]
            events_directory = season_directory / "events"
            participants_directory = season_directory / "participants"
            events_directory.mkdir(parents=True)
            participants_directory.mkdir()

            season_document = deepcopy(season)
            events = season_document.pop("events")
            (season_directory / "season.json").write_text(
                json.dumps(season_document), encoding="utf-8"
            )

            participants = {}
            for event in events:
                for result in event.get("results", []):
                    participant = result.get("participant")
                    if isinstance(participant, dict):
                        participants[participant["slug"]] = participant
                        result["participant"] = participant["slug"]
                (events_directory / f"{event['slug']}.json").write_text(
                    json.dumps(event), encoding="utf-8"
                )
            for slug, participant in participants.items():
                (participants_directory / f"{slug}.json").write_text(
                    json.dumps(participant), encoding="utf-8"
                )
        return root

    def test_import_is_idempotent_and_updates_existing_rows(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            path = self.write_seed(directory, payload)
            call_command("import_seasons", path=path, stdout=StringIO())
            call_command("import_seasons", path=path, stdout=StringIO())

            self.assertEqual(Season.objects.count(), 1)
            self.assertEqual(Route.objects.count(), 1)
            self.assertEqual(Event.objects.count(), 1)
            self.assertEqual(Participant.objects.count(), 1)
            self.assertEqual(ParticipantPlatformAccount.objects.count(), 1)
            self.assertEqual(
                ParticipantPlatformAccount.objects.get().handle,
                "jahonali",
            )
            self.assertEqual(ResultEntry.objects.count(), 1)
            self.assertEqual(str(ResultEntry.objects.get().score), "139.340")

            payload["seasons"][0]["events"][0]["title"] = "IOI 2026 — Toshkent"
            self.write_seed(directory, payload)
            call_command("import_seasons", path=path, stdout=StringIO())
            self.assertEqual(Event.objects.get().title, "IOI 2026 — Toshkent")
            self.assertEqual(ResultEntry.objects.count(), 1)

    def test_dry_run_rolls_back_and_prune_removes_stale_children(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            path = self.write_seed(directory, payload)
            call_command("import_seasons", path=path, stdout=StringIO())

            dry_payload = deepcopy(payload)
            dry_payload["seasons"][0]["title"] = "O‘zgargan"
            self.write_seed(directory, dry_payload)
            call_command("import_seasons", path=path, dry_run=True, stdout=StringIO())
            self.assertEqual(Season.objects.get().title, "2025–2026 mavsumi")

            Event.objects.create(
                season=Season.objects.get(),
                code="STALE",
                slug="stale",
                title="Eski tadbir",
                type=Event.Type.STAGE,
            )
            self.write_seed(directory, payload)
            call_command("import_seasons", path=path, prune=True, stdout=StringIO())
            self.assertFalse(Event.objects.filter(code="STALE").exists())

    def test_split_content_directory_imports_references_and_prunes_accounts(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            participant = payload["seasons"][0]["events"][0]["results"][0]["participant"]
            participant["slug"] = "jahonali-xaydaraliyev"
            root = self.write_content_tree(directory, payload)

            call_command("import_seasons", path=root, prune=True, stdout=StringIO())

            self.assertEqual(Season.objects.count(), 1)
            self.assertEqual(Event.objects.get().slug, "ioi-2026")
            self.assertEqual(
                ResultEntry.objects.get().participant.slug,
                "jahonali-xaydaraliyev",
            )
            self.assertEqual(ParticipantPlatformAccount.objects.count(), 1)

            participant_path = root / "2025-2026" / "participants" / "jahonali-xaydaraliyev.json"
            participant_document = json.loads(participant_path.read_text(encoding="utf-8"))
            participant_document["platform_accounts"] = []
            participant_path.write_text(json.dumps(participant_document), encoding="utf-8")
            call_command("import_seasons", path=root, prune=True, stdout=StringIO())
            self.assertFalse(ParticipantPlatformAccount.objects.exists())

    def test_split_content_directory_rejects_unknown_participant_reference(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            participant = payload["seasons"][0]["events"][0]["results"][0]["participant"]
            participant["slug"] = "jahonali-xaydaraliyev"
            root = self.write_content_tree(directory, payload)
            event_path = root / "2025-2026" / "events" / "ioi-2026.json"
            event = json.loads(event_path.read_text(encoding="utf-8"))
            event["results"][0]["participant"] = "missing-participant"
            event_path.write_text(json.dumps(event), encoding="utf-8")

            with self.assertRaisesMessage(
                CommandError, "noma’lum participant slug: missing-participant"
            ):
                call_command("import_seasons", path=root, stdout=StringIO())

            self.assertFalse(Season.objects.exists())

    def test_schema_rejects_unknown_property_with_json_path(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            payload["seasons"][0]["admin_only_note"] = "Schema bu maydonni bilmaydi."
            path = self.write_seed(directory, payload)

            with self.assertRaisesMessage(
                CommandError, "$.seasons[0].admin_only_note: schema validatsiyasi"
            ):
                call_command("import_seasons", path=path, stdout=StringIO())

            self.assertFalse(Season.objects.exists())

    def test_schema_format_checker_rejects_invalid_date_with_json_path(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            payload["seasons"][0]["events"][0]["start_date"] = "2026-99-40"
            path = self.write_seed(directory, payload)

            with self.assertRaisesMessage(
                CommandError,
                "$.seasons[0].events[0].start_date: schema validatsiyasi",
            ):
                call_command("import_seasons", path=path, stdout=StringIO())

            self.assertFalse(Season.objects.exists())

    def test_semantic_cross_reference_validation_still_runs_after_schema(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            payload["seasons"][0]["events"][0]["route_memberships"][0]["route_code"] = "MISSING"
            path = self.write_seed(directory, payload)

            with self.assertRaisesMessage(CommandError, "noma’lum route_code: MISSING"):
                call_command("import_seasons", path=path, stdout=StringIO())

            self.assertFalse(Season.objects.exists())

    def test_prune_removes_stale_team_members(self):
        with TemporaryDirectory() as directory:
            payload = self.seed_payload()
            results = payload["seasons"][0]["events"][0]["results"]
            results.clear()
            results.append(
                {
                    "key": "uzbekistan-team",
                    "team": {
                        "name": "O‘zbekiston",
                        "members": [
                            {
                                "participant": {"full_name": "Birinchi Ishtirokchi"},
                                "role": "contestant",
                            },
                            {
                                "participant": {"full_name": "Ikkinchi Ishtirokchi"},
                                "role": "contestant",
                            },
                        ],
                    },
                    "rank": 1,
                    "medal": "gold",
                }
            )
            path = self.write_seed(directory, payload)
            call_command("import_seasons", path=path, stdout=StringIO())
            self.assertEqual(Team.objects.count(), 1)
            self.assertEqual(TeamMember.objects.count(), 2)

            results[0]["team"]["members"].pop()
            self.write_seed(directory, payload)
            call_command("import_seasons", path=path, prune=True, stdout=StringIO())
            self.assertEqual(TeamMember.objects.count(), 1)
