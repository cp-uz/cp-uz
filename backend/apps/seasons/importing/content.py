"""Load and validate complete season documents independently of persistence."""

from __future__ import annotations

import json
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any

from django.core.management.base import CommandError
from jsonschema import Draft202012Validator, FormatChecker
from jsonschema.exceptions import SchemaError, best_match

BACKEND_ROOT = Path(__file__).resolve().parents[3]
CONTENT_ROOT_CANDIDATES = (BACKEND_ROOT / "content", BACKEND_ROOT.parent / "content")
CONTENT_ROOT = next(
    (path for path in CONTENT_ROOT_CANDIDATES if path.is_dir()), BACKEND_ROOT / "content"
)
DEFAULT_DATA_PATH = CONTENT_ROOT / "seasons"
DEFAULT_SCHEMA_PATH = DEFAULT_DATA_PATH / "schema" / "season-content.schema.json"


class SeasonContentReader:
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
