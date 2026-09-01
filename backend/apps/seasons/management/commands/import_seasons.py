from __future__ import annotations

import json
from collections import Counter
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any

from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify
from jsonschema import Draft202012Validator, FormatChecker
from jsonschema.exceptions import SchemaError, best_match

from apps.seasons.models import (
    Event,
    EventEdge,
    EventResource,
    EventRoute,
    EventSource,
    Participant,
    ParticipantAlias,
    ParticipantPlatformAccount,
    PublicationStatus,
    ResultEntry,
    Route,
    Season,
    Team,
    TeamMember,
    VerificationStatus,
)

BACKEND_ROOT = Path(__file__).resolve().parents[4]
CONTENT_ROOT_CANDIDATES = (BACKEND_ROOT / "content", BACKEND_ROOT.parent / "content")
CONTENT_ROOT = next(
    (path for path in CONTENT_ROOT_CANDIDATES if path.is_dir()), BACKEND_ROOT / "content"
)
DEFAULT_DATA_PATH = CONTENT_ROOT / "seasons"
DEFAULT_SCHEMA_PATH = DEFAULT_DATA_PATH / "schema" / "season-content.schema.json"


class Command(BaseCommand):
    help = (
        "Olimpiada mavsumlari, eventlar, ishtirokchilar va natijalarni canonical JSON "
        "katalogidan import qiladi."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=Path,
            default=DEFAULT_DATA_PATH,
            help=f"Season content katalogi yoki legacy seed JSON (default: {DEFAULT_DATA_PATH})",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Validatsiya va importni bajarib, tranzaksiyani saqlamasdan ortga qaytaradi.",
        )
        parser.add_argument(
            "--prune",
            action="store_true",
            help="Canonical content ichida yo‘q eski season bolalarini o‘chiradi.",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Import qilinayotgan sluglardagi mavsumlarni oldin tozalab qayta yaratadi.",
        )

    def handle(self, *args, **options):
        path: Path = options["path"].expanduser().resolve()
        if not path.exists():
            raise CommandError(f"Season content topilmadi: {path}")
        payload = self.load_payload(path)

        self.validate_payload_schema(payload)
        self.validate_payload(payload)
        seasons_data = payload.get("seasons")

        self.stats: Counter[str] = Counter()
        try:
            with transaction.atomic():
                if options["clear"]:
                    slugs = [self.required(item, "slug", "season") for item in seasons_data]
                    deleted, _ = Season.objects.filter(slug__in=slugs).delete()
                    self.stats["cleared"] += deleted
                for season_data in seasons_data:
                    self.import_season(season_data, prune=options["prune"])
                if options["dry_run"]:
                    transaction.set_rollback(True)
        except (ValidationError, ValueError, TypeError, KeyError) as exc:
            raise CommandError(f"Seed validatsiyadan o‘tmadi: {exc}") from exc

        summary = ", ".join(f"{key}={value}" for key, value in sorted(self.stats.items()))
        prefix = "DRY RUN — " if options["dry_run"] else ""
        self.stdout.write(self.style.SUCCESS(f"{prefix}mavsum importi tugadi: {summary}"))

    @staticmethod
    def read_json(path: Path) -> Any:
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise CommandError(f"JSON o‘qilmadi: {path}: {exc}") from exc

    @classmethod
    def load_schema(cls) -> dict[str, Any]:
        try:
            schema = cls.read_json(DEFAULT_SCHEMA_PATH)
            Draft202012Validator.check_schema(schema)
            return schema
        except SchemaError as exc:
            raise CommandError(f"Season schema noto‘g‘ri: {DEFAULT_SCHEMA_PATH}: {exc}") from exc

    @classmethod
    def validate_content_document(
        cls, document: Any, *, definition: str, source_path: Path
    ) -> None:
        schema = cls.load_schema()
        document_schema = {
            "$ref": f"#/$defs/{definition}",
            "$defs": schema["$defs"],
        }
        error = best_match(
            Draft202012Validator(document_schema, format_checker=FormatChecker()).iter_errors(
                document
            )
        )
        if error is not None:
            path = cls.schema_error_path(error)
            raise CommandError(f"{source_path}: {path}: schema validatsiyasi: {error.message}")

    @classmethod
    def load_payload(cls, path: Path) -> dict[str, Any]:
        if path.is_file():
            payload = cls.read_json(path)
            if not isinstance(payload, dict):
                raise CommandError(f"{path}: JSON ildizi object bo‘lishi kerak.")
            return payload
        if not path.is_dir():
            raise CommandError(f"Season content fayl yoki katalog bo‘lishi kerak: {path}")
        return cls.load_content_directory(path)

    @classmethod
    def load_content_directory(cls, root: Path) -> dict[str, Any]:
        season_directories = sorted(
            child
            for child in root.iterdir()
            if child.is_dir() and (child / "season.json").is_file()
        )
        if not season_directories:
            raise CommandError(f"Season kataloglari topilmadi: {root}")

        seasons: list[dict[str, Any]] = []
        for season_directory in season_directories:
            season_path = season_directory / "season.json"
            season = cls.read_json(season_path)
            if not isinstance(season, dict):
                raise CommandError(f"{season_path}: JSON ildizi object bo‘lishi kerak.")
            for embedded_collection in ("events", "participants"):
                if embedded_collection in season:
                    raise CommandError(
                        f"{season_path}: {embedded_collection} alohida katalogda saqlanishi kerak."
                    )
            if season.get("slug") != season_directory.name:
                raise CommandError(
                    f"{season_path}: slug katalog nomiga teng bo‘lishi kerak: "
                    f"{season_directory.name}"
                )

            participants: list[dict[str, Any]] = []
            participant_slugs: set[str] = set()
            participants_directory = season_directory / "participants"
            if not participants_directory.is_dir():
                raise CommandError(f"Participant katalogi topilmadi: {participants_directory}")
            for participant_path in sorted(participants_directory.glob("*.json")):
                participant = cls.read_json(participant_path)
                cls.validate_content_document(
                    participant, definition="participantDocument", source_path=participant_path
                )
                slug = participant["slug"]
                if slug != participant_path.stem:
                    raise CommandError(
                        f"{participant_path}: slug fayl nomiga teng bo‘lishi kerak: "
                        f"{participant_path.stem}"
                    )
                if slug in participant_slugs:
                    raise CommandError(f"{participant_path}: takrorlangan participant slug: {slug}")
                participant_slugs.add(slug)
                participants.append(participant)

            events: list[dict[str, Any]] = []
            events_directory = season_directory / "events"
            if not events_directory.is_dir():
                raise CommandError(f"Event katalogi topilmadi: {events_directory}")
            for event_path in sorted(events_directory.glob("*.json")):
                event = cls.read_json(event_path)
                cls.validate_content_document(event, definition="event", source_path=event_path)
                event_slug = event.get("slug")
                if not event_slug:
                    raise CommandError(f"{event_path}: $.slug majburiy.")
                if event_slug != event_path.stem:
                    raise CommandError(
                        f"{event_path}: slug fayl nomiga teng bo‘lishi kerak: {event_path.stem}"
                    )
                cls.validate_participant_references(
                    event, participant_slugs=participant_slugs, source_path=event_path
                )
                events.append(event)

            season["participants"] = participants
            season["events"] = events
            seasons.append(season)

        return {"schema_version": 1, "seasons": seasons}

    @classmethod
    def validate_participant_references(
        cls,
        event: dict[str, Any],
        *,
        participant_slugs: set[str],
        source_path: Path,
    ) -> None:
        for result_index, result in enumerate(event.get("results", [])):
            references: list[tuple[str, Any]] = []
            if "participant" in result:
                references.append((f"$.results[{result_index}].participant", result["participant"]))
            for member_index, member in enumerate(result.get("team", {}).get("members", [])):
                references.append(
                    (
                        f"$.results[{result_index}].team.members[{member_index}].participant",
                        member.get("participant"),
                    )
                )
            for reference_path, reference in references:
                if not isinstance(reference, str):
                    raise CommandError(
                        f"{source_path}: {reference_path}: participant profili inline emas, "
                        "participants/<slug>.json fayliga slug reference bo‘lishi kerak."
                    )
                if reference not in participant_slugs:
                    raise CommandError(
                        f"{source_path}: {reference_path}: noma’lum participant slug: {reference}"
                    )

    @staticmethod
    def required(data: dict[str, Any], key: str, context: str):
        value = data.get(key)
        if value in (None, ""):
            raise ValueError(f"{context}.{key} majburiy.")
        return value

    @staticmethod
    def parsed_date(value: str | None, path: str) -> date | None:
        if not value:
            return None
        try:
            return date.fromisoformat(value)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"{path}: sana YYYY-MM-DD formatida bo‘lishi kerak.") from exc

    @staticmethod
    def parsed_decimal(value: Any, path: str) -> Decimal | None:
        if value in (None, ""):
            return None
        try:
            return Decimal(str(value))
        except (InvalidOperation, TypeError, ValueError) as exc:
            raise ValueError(f"{path}: son yoki son ko‘rinishidagi string bo‘lishi kerak.") from exc

    @staticmethod
    def json_path(parts) -> str:
        path = "$"
        for part in parts:
            if isinstance(part, int):
                path += f"[{part}]"
            elif isinstance(part, str) and part.isidentifier():
                path += f".{part}"
            else:
                path += f"[{json.dumps(part, ensure_ascii=False)}]"
        return path

    @classmethod
    def schema_error_path(cls, error) -> str:
        parts = list(error.absolute_path)
        if error.validator == "additionalProperties" and isinstance(error.instance, dict):
            allowed = set(error.schema.get("properties", {}))
            unexpected = sorted(set(error.instance) - allowed)
            if unexpected:
                parts.append(unexpected[0])
        elif error.validator == "required" and isinstance(error.instance, dict):
            missing = [key for key in error.validator_value if key not in error.instance]
            if missing:
                parts.append(missing[0])
        return cls.json_path(parts)

    @classmethod
    def validate_payload_schema(cls, payload: Any):
        schema = cls.load_schema()

        error = best_match(
            Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(payload)
        )
        if error is not None:
            path = cls.schema_error_path(error)
            raise CommandError(f"{path}: schema validatsiyasi: {error.message}")

    @staticmethod
    def validate_payload(payload: Any):
        if not isinstance(payload, dict):
            raise CommandError("$: JSON ildizi object bo‘lishi kerak.")
        if payload.get("schema_version") != 1:
            raise CommandError("$.schema_version: qo‘llab-quvvatlanadigan qiymat 1.")
        seasons = payload.get("seasons")
        if not isinstance(seasons, list) or not seasons:
            raise CommandError("$.seasons: bo‘sh bo‘lmagan array bo‘lishi kerak.")

        season_slugs: set[str] = set()
        for season_index, season in enumerate(seasons):
            season_path = f"$.seasons[{season_index}]"
            if not isinstance(season, dict):
                raise CommandError(f"{season_path}: object bo‘lishi kerak.")
            slug = season.get("slug")
            if not isinstance(slug, str) or not slug:
                raise CommandError(f"{season_path}.slug: bo‘sh bo‘lmagan string bo‘lishi kerak.")
            if slug in season_slugs:
                raise CommandError(f"{season_path}.slug: takrorlangan mavsum slug’i: {slug}")
            season_slugs.add(slug)

            for collection in ("routes", "events", "participants"):
                value = season.get(collection, [])
                if not isinstance(value, list):
                    raise CommandError(f"{season_path}.{collection}: array bo‘lishi kerak.")
            edges = season.get("edges", season.get("relations", []))
            if not isinstance(edges, list):
                raise CommandError(f"{season_path}.edges: array bo‘lishi kerak.")

            route_codes: set[str] = set()
            for route_index, route in enumerate(season.get("routes", [])):
                route_path = f"{season_path}.routes[{route_index}]"
                if not isinstance(route, dict):
                    raise CommandError(f"{route_path}: object bo‘lishi kerak.")
                code = route.get("code")
                if not isinstance(code, str) or not code:
                    raise CommandError(f"{route_path}.code: bo‘sh bo‘lmagan string kerak.")
                if code in route_codes:
                    raise CommandError(f"{route_path}.code: takrorlangan route code: {code}")
                route_codes.add(code)

            participant_slugs: set[str] = set()
            for participant_index, participant in enumerate(season.get("participants", [])):
                participant_path = f"{season_path}.participants[{participant_index}]"
                if not isinstance(participant, dict):
                    raise CommandError(f"{participant_path}: object bo‘lishi kerak.")
                participant_slug = participant.get("slug")
                if not isinstance(participant_slug, str) or not participant_slug:
                    raise CommandError(f"{participant_path}.slug: bo‘sh bo‘lmagan string kerak.")
                if participant_slug in participant_slugs:
                    raise CommandError(
                        f"{participant_path}.slug: takrorlangan participant slug: "
                        f"{participant_slug}"
                    )
                participant_slugs.add(participant_slug)

            event_codes: set[str] = set()
            event_slugs: set[str] = set()
            for event_index, event in enumerate(season.get("events", [])):
                event_path = f"{season_path}.events[{event_index}]"
                if not isinstance(event, dict):
                    raise CommandError(f"{event_path}: object bo‘lishi kerak.")
                code = event.get("code")
                if not isinstance(code, str) or not code:
                    raise CommandError(f"{event_path}.code: bo‘sh bo‘lmagan string kerak.")
                if code in event_codes:
                    raise CommandError(f"{event_path}.code: takrorlangan event code: {code}")
                event_codes.add(code)
                event_slug = event.get("slug")
                if event_slug:
                    if event_slug in event_slugs:
                        raise CommandError(
                            f"{event_path}.slug: takrorlangan event slug: {event_slug}"
                        )
                    event_slugs.add(event_slug)
                for collection in (
                    "route_memberships",
                    "route_codes",
                    "resources",
                    "sources",
                    "results",
                ):
                    if collection in event and not isinstance(event[collection], list):
                        raise CommandError(f"{event_path}.{collection}: array bo‘lishi kerak.")

    def upsert(self, model, lookup: dict[str, Any], defaults: dict[str, Any], stat: str):
        instance = model.objects.filter(**lookup).first()
        created = instance is None
        if created:
            instance = model(**lookup)
        for key, value in defaults.items():
            setattr(instance, key, value)
        try:
            instance.full_clean()
        except ValidationError as exc:
            lookup_label = ", ".join(
                f"{key}={getattr(value, 'slug', getattr(value, 'code', value))}"
                for key, value in lookup.items()
            )
            details = exc.message_dict if hasattr(exc, "message_dict") else exc.messages
            raise ValueError(f"{stat}[{lookup_label}]: {details}") from exc
        instance.save()
        self.stats[f"{stat}_{'created' if created else 'updated'}"] += 1
        return instance

    def import_season(self, data: dict[str, Any], *, prune: bool):
        slug = self.required(data, "slug", "season")
        season = self.upsert(
            Season,
            {"slug": slug},
            {
                "title": self.required(data, "title", f"season[{slug}]"),
                "summary": data.get("summary", ""),
                "start_date": self.parsed_date(
                    self.required(data, "start_date", f"season[{slug}]"),
                    f"season[{slug}].start_date",
                ),
                "end_date": self.parsed_date(
                    self.required(data, "end_date", f"season[{slug}]"),
                    f"season[{slug}].end_date",
                ),
                "publication_status": data.get("publication_status", PublicationStatus.DRAFT),
                "verification_status": data.get(
                    "verification_status", VerificationStatus.UNVERIFIED
                ),
                "is_featured": data.get("is_featured", False),
                "order": data.get("order", 0),
            },
            "seasons",
        )

        route_codes: set[str] = set()
        routes: dict[str, Route] = {}
        for route_data in data.get("routes", []):
            route = self.import_route(season, route_data)
            routes[route.code] = route
            route_codes.add(route.code)

        participants: dict[str, Participant] = {}
        for participant_data in data.get("participants", []):
            participant = self.import_participant(
                participant_data,
                prune=prune,
                authoritative=True,
            )
            participants[participant_data["slug"]] = participant

        event_codes: set[str] = set()
        events: dict[str, Event] = {}
        for event_data in data.get("events", []):
            event = self.import_event(season, event_data)
            events[event.code] = event
            event_codes.add(event.code)

        for event_data in data.get("events", []):
            event = events[event_data["code"]]
            self.import_event_children(
                event,
                event_data,
                routes,
                participants,
                prune=prune,
            )

        edge_keys: set[tuple[str, str, str, str | None]] = set()
        for edge_data in data.get("edges", data.get("relations", [])):
            edge = self.import_edge(season, edge_data, events, routes)
            edge_keys.add(
                (
                    edge.from_event.code,
                    edge.to_event.code,
                    edge.relation_type,
                    edge.route.code if edge.route_id else None,
                )
            )

        if prune:
            for edge in season.edges.select_related("from_event", "to_event", "route"):
                key = (
                    edge.from_event.code,
                    edge.to_event.code,
                    edge.relation_type,
                    edge.route.code if edge.route_id else None,
                )
                if key not in edge_keys:
                    edge.delete()
                    self.stats["edges_deleted"] += 1
            deleted, _ = season.events.exclude(code__in=event_codes).delete()
            self.stats["events_deleted"] += deleted
            deleted, _ = season.routes.exclude(code__in=route_codes).delete()
            self.stats["routes_deleted"] += deleted

    def import_route(self, season: Season, data: dict[str, Any]) -> Route:
        code = self.required(data, "code", f"season[{season.slug}].route")
        return self.upsert(
            Route,
            {"season": season, "code": code},
            {
                "title": self.required(data, "title", f"route[{code}]"),
                "description": data.get("description", ""),
                "kind": self.required(data, "kind", f"route[{code}]"),
                "color": data.get("color", Route.Color.NEUTRAL),
                "line_style": data.get("line_style", "solid"),
                "icon": data.get("icon", ""),
                "order": data.get("order", 0),
                "is_visible": data.get("is_visible", True),
            },
            "routes",
        )

    def import_event(self, season: Season, data: dict[str, Any]) -> Event:
        code = self.required(data, "code", f"season[{season.slug}].event")
        title = self.required(data, "title", f"event[{code}]")
        mode = data.get("mode", Event.Mode.TBA)
        mode = {"in_person": Event.Mode.ONSITE, "offline": Event.Mode.ONSITE}.get(mode, mode)
        date_precision = data.get("date_precision", Event.DatePrecision.TBA)
        date_precision = {"exact": Event.DatePrecision.DAY}.get(date_precision, date_precision)
        return self.upsert(
            Event,
            {"season": season, "code": code},
            {
                "slug": data.get("slug") or slugify(title),
                "title": title,
                "short_title": data.get("short_title", ""),
                "summary": data.get("summary", ""),
                "description": data.get("description", ""),
                "type": self.required(data, "type", f"event[{code}]"),
                "publication_status": data.get("publication_status", PublicationStatus.DRAFT),
                "event_status": data.get("event_status", data.get("status", Event.Status.TBA)),
                "verification_status": data.get(
                    "verification_status", VerificationStatus.UNVERIFIED
                ),
                "date_precision": date_precision,
                "start_date": self.parsed_date(data.get("start_date"), f"event[{code}].start_date"),
                "end_date": self.parsed_date(data.get("end_date"), f"event[{code}].end_date"),
                "date_label": data.get("date_label", ""),
                "timezone": data.get("timezone", "Asia/Tashkent"),
                "location": data.get("location", ""),
                "venue": data.get("venue", ""),
                "mode": mode,
                "platform": data.get("platform", ""),
                "organizer": data.get("organizer", ""),
                "eligibility": data.get("eligibility", ""),
                "grade_min": data.get("grade_min"),
                "grade_max": data.get("grade_max"),
                "is_featured": data.get("is_featured", False),
                "order": data.get("order", 0),
            },
            "events",
        )

    def import_event_children(
        self,
        event: Event,
        data: dict[str, Any],
        routes: dict[str, Route],
        participants: dict[str, Participant],
        *,
        prune: bool,
    ):
        membership_keys: set[str] = set()
        memberships = data.get("route_memberships")
        if memberships is None:
            memberships = [{"route_code": code} for code in data.get("route_codes", [])]
        for membership_data in memberships:
            route_code = self.required(
                membership_data, "route_code", f"event[{event.code}].route_membership"
            )
            route = routes.get(route_code)
            if route is None:
                raise ValueError(f"event[{event.code}] noma’lum route_code: {route_code}")
            self.upsert(
                EventRoute,
                {"event": event, "route": route},
                {
                    "order": membership_data.get("order", event.order),
                    "node_style": membership_data.get("node_style", EventRoute.NodeStyle.DEFAULT),
                    "label": membership_data.get("label", ""),
                },
                "memberships",
            )
            membership_keys.add(route_code)
        if prune and ("route_memberships" in data or "route_codes" in data):
            deleted, _ = event.route_memberships.exclude(route__code__in=membership_keys).delete()
            self.stats["memberships_deleted"] += deleted

        resource_urls: set[str] = set()
        for resource_data in data.get("resources", []):
            url = self.required(resource_data, "url", f"event[{event.code}].resource")
            self.upsert(
                EventResource,
                {"event": event, "url": url},
                {
                    "type": self.required(resource_data, "type", f"event[{event.code}].resource"),
                    "title": self.required(resource_data, "title", f"event[{event.code}].resource"),
                    "is_official": resource_data.get("is_official", False),
                    "order": resource_data.get("order", 0),
                },
                "resources",
            )
            resource_urls.add(url)
        if prune and "resources" in data:
            deleted, _ = event.resources.exclude(url__in=resource_urls).delete()
            self.stats["resources_deleted"] += deleted

        source_urls: set[str] = set()
        for source_data in data.get("sources", []):
            url = self.required(source_data, "url", f"event[{event.code}].source")
            self.upsert(
                EventSource,
                {"event": event, "url": url},
                {
                    "type": self.required(source_data, "type", f"event[{event.code}].source"),
                    "title": self.required(source_data, "title", f"event[{event.code}].source"),
                    "publisher": source_data.get("publisher", ""),
                    "accessed_on": self.parsed_date(
                        source_data.get("accessed_on"),
                        f"event[{event.code}].source[{url}].accessed_on",
                    ),
                    "is_primary": source_data.get("is_primary", False),
                    "notes": source_data.get("notes", ""),
                },
                "sources",
            )
            source_urls.add(url)
        if prune and "sources" in data:
            deleted, _ = event.sources.exclude(url__in=source_urls).delete()
            self.stats["sources_deleted"] += deleted

        result_keys: set[str] = set()
        team_names: set[str] = set()
        for index, result_data in enumerate(data.get("results", [])):
            source_key, team_name = self.import_result(
                event,
                result_data,
                participants=participants,
                index=index,
                prune=prune,
            )
            result_keys.add(source_key)
            if team_name:
                team_names.add(team_name)
        if prune and "results" in data:
            deleted, _ = event.results.exclude(source_key__in=result_keys).delete()
            self.stats["results_deleted"] += deleted
            deleted, _ = event.teams.exclude(name__in=team_names).delete()
            self.stats["teams_deleted"] += deleted

    def import_edge(
        self,
        season: Season,
        data: dict[str, Any],
        events: dict[str, Event],
        routes: dict[str, Route],
    ) -> EventEdge:
        from_code = self.required(data, "from_event_code", f"season[{season.slug}].edge")
        to_code = self.required(data, "to_event_code", f"season[{season.slug}].edge")
        if from_code not in events or to_code not in events:
            raise ValueError(f"Noma’lum edge: {from_code} → {to_code}")
        route_code = data.get("route_code")
        if route_code and route_code not in routes:
            raise ValueError(f"edge[{from_code}→{to_code}] noma’lum route_code: {route_code}")
        relation_type = data.get("relation_type", data.get("type"))
        if not relation_type:
            raise ValueError(f"edge[{from_code}→{to_code}].type majburiy.")
        return self.upsert(
            EventEdge,
            {
                "season": season,
                "from_event": events[from_code],
                "to_event": events[to_code],
                "relation_type": relation_type,
                "route": routes.get(route_code),
            },
            {
                "line_style": data.get("line_style", "solid"),
                "label": data.get("label", ""),
                "order": data.get("order", 0),
            },
            "edges",
        )

    def unique_participant_slug(self, base: str) -> str:
        candidate = base or "ishtirokchi"
        suffix = 2
        while Participant.objects.filter(slug=candidate).exists():
            candidate = f"{base}-{suffix}"
            suffix += 1
        return candidate

    def import_participant(
        self,
        raw: dict[str, Any] | str,
        *,
        prune: bool = False,
        authoritative: bool = False,
    ) -> Participant:
        data = {"full_name": raw} if isinstance(raw, str) else raw
        full_name = self.required(data, "full_name", "participant")
        normalized = ParticipantAlias.normalize(full_name)
        alias = (
            ParticipantAlias.objects.select_related("participant")
            .filter(normalized_name=normalized)
            .first()
        )
        participant = alias.participant if alias else None
        supplied_slug = data.get("slug") or slugify(full_name)
        if participant is None and supplied_slug:
            participant = Participant.objects.filter(slug=supplied_slug).first()
        if participant is None:
            participant = Participant.objects.filter(full_name__iexact=full_name).first()
        if participant is None:
            participant = Participant(slug=self.unique_participant_slug(supplied_slug))
            created = True
        else:
            created = False
        participant.full_name = full_name
        if authoritative:
            participant.country_code = data.get("country_code", "UZB")
            participant.region = data.get("region", "")
            participant.school = data.get("school", "")
            participant.handle = data.get("handle", "")
            participant.bio = data.get("bio", "")
            participant.photo_url = data.get("photo_url", "")
        else:
            participant.country_code = data.get(
                "country_code", participant.country_code or "UZB"
            )
            participant.region = data.get("region", participant.region)
            participant.school = data.get("school", participant.school)
            participant.handle = data.get("handle", participant.handle)
            participant.bio = data.get("bio", participant.bio)
            participant.photo_url = data.get("photo_url", participant.photo_url)
        participant.full_clean()
        participant.save()
        self.stats[f"participants_{'created' if created else 'updated'}"] += 1

        alias_names = {full_name, *data.get("aliases", [])}
        for alias_name in alias_names:
            normalized_alias = ParticipantAlias.normalize(alias_name)
            existing = ParticipantAlias.objects.filter(normalized_name=normalized_alias).first()
            if existing and existing.participant_id != participant.id:
                raise ValueError(f"Alias boshqa ishtirokchiga tegishli: {alias_name}")
            if existing is None:
                alias_object = ParticipantAlias(
                    participant=participant,
                    name=alias_name,
                    normalized_name=normalized_alias,
                )
                alias_object.full_clean()
                alias_object.save()
                self.stats["aliases_created"] += 1

        if authoritative and prune:
            deleted, _ = participant.aliases.exclude(
                normalized_name__in={
                    ParticipantAlias.normalize(alias_name) for alias_name in alias_names
                }
            ).delete()
            self.stats["aliases_deleted"] += deleted

        account_keys: set[tuple[str, str]] = set()
        for index, account_data in enumerate(data.get("platform_accounts", [])):
            platform = self.required(account_data, "platform", "participant.platform_account")
            handle = self.required(account_data, "handle", "participant.platform_account")
            self.upsert(
                ParticipantPlatformAccount,
                {"participant": participant, "platform": platform, "handle": handle},
                {
                    "url": self.required(account_data, "url", "participant.platform_account"),
                    "title": account_data.get("title", ""),
                    "is_verified": account_data.get("is_verified", False),
                    "is_public": account_data.get("is_public", True),
                    "order": account_data.get("order", index),
                },
                "participant_accounts",
            )
            account_keys.add((platform, handle))
        if authoritative and prune:
            for account in participant.platform_accounts.all():
                if (account.platform, account.handle) not in account_keys:
                    account.delete()
                    self.stats["participant_accounts_deleted"] += 1
        return participant

    def resolve_participant(
        self,
        raw: dict[str, Any] | str,
        participants: dict[str, Participant],
        *,
        prune: bool,
    ) -> Participant:
        if isinstance(raw, str) and raw in participants:
            return participants[raw]
        return self.import_participant(raw, prune=prune)

    def import_team(
        self,
        event: Event,
        data: dict[str, Any],
        participants: dict[str, Participant],
        *,
        prune: bool,
    ) -> Team:
        name = self.required(data, "name", f"event[{event.code}].team")
        team = self.upsert(
            Team,
            {"event": event, "name": name},
            {
                "code": data.get("code", ""),
                "country_code": data.get("country_code", "UZB"),
                "school": data.get("school", ""),
                "notes": data.get("notes", ""),
            },
            "teams",
        )
        member_keys: set[tuple[str, str]] = set()
        for index, member_data in enumerate(data.get("members", [])):
            participant = self.resolve_participant(
                member_data["participant"], participants, prune=prune
            )
            role = member_data.get("role", TeamMember.Role.CONTESTANT)
            self.upsert(
                TeamMember,
                {"team": team, "participant": participant, "role": role},
                {"order": member_data.get("order", index)},
                "team_members",
            )
            member_keys.add((str(participant.id), role))
        if prune and "members" in data:
            for member in team.members.all():
                if (str(member.participant_id), member.role) not in member_keys:
                    member.delete()
                    self.stats["team_members_deleted"] += 1
        return team

    def import_result(
        self,
        event: Event,
        data: dict[str, Any],
        *,
        participants: dict[str, Participant],
        index: int,
        prune: bool,
    ) -> tuple[str, str | None]:
        participant = None
        team = None
        team_name = None
        if data.get("participant"):
            participant = self.resolve_participant(data["participant"], participants, prune=prune)
            subject_key = f"participant:{participant.slug}"
        elif data.get("team"):
            team = self.import_team(event, data["team"], participants, prune=prune)
            team_name = team.name
            subject_key = f"team:{team.name.casefold()}"
        else:
            raise ValueError(
                f"event[{event.code}].results[{index}] participant yoki team talab qiladi."
            )
        source_key = data.get("key") or ":".join(
            (
                subject_key,
                str(data.get("category", "")),
                str(data.get("order", index)),
            )
        )
        medal = data.get("medal", ResultEntry.Medal.NONE)
        if medal == "honorable_mention":
            medal = ResultEntry.Medal.HONOURABLE_MENTION
        self.upsert(
            ResultEntry,
            {"event": event, "source_key": source_key},
            {
                "participant": participant,
                "team": team,
                "rank": data.get("rank"),
                "score": self.parsed_decimal(
                    data.get("score"), f"event[{event.code}].results[{index}].score"
                ),
                "score_label": data.get("score_label", ""),
                "medal": medal,
                "award_title": data.get("award_title", ""),
                "category": data.get("category", ""),
                "is_local": data.get("is_local", True),
                "result_url": data.get("result_url", ""),
                "notes": data.get("notes", ""),
                "order": data.get("order", index),
            },
            "results",
        )
        return source_key, team_name
