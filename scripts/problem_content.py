"""Validation helpers for the canonical olympiad problem catalog."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker


def _read_json(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"{path}: invalid JSON: {exc}") from exc
    if not isinstance(payload, dict):
        raise TypeError(f"{path}: expected a JSON object")
    return payload


def _inside(parent: Path, relative: str, *, directory: bool) -> Path:
    target = (parent / relative).resolve()
    if parent.resolve() not in target.parents:
        raise ValueError(f"{parent}: unsafe relative path: {relative}")
    if directory and not target.is_dir():
        raise ValueError(f"{parent}: directory not found: {relative}")
    if not directory and not target.is_file():
        raise ValueError(f"{parent}: file not found: {relative}")
    return target


def validate_problem_inventory(content_root: Path) -> dict[str, int]:
    root = content_root / "problems"
    schema = _read_json(root / "schema" / "problem-content.schema.json")
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    known_events = {
        (path.parents[1].name, _read_json(path)["slug"])
        for path in (content_root / "seasons").glob("*/events/*.json")
    }
    counters = {"problem_events": 0, "problem_sets": 0, "problems": 0, "problem_links": 0, "problem_attachments": 0}
    seen_events: set[tuple[str, str]] = set()

    def validate(path: Path) -> dict[str, Any]:
        payload = _read_json(path)
        errors = sorted(validator.iter_errors(payload), key=lambda item: list(item.absolute_path))
        if errors:
            error = errors[0]
            location = ".".join(str(part) for part in error.absolute_path) or "$"
            raise ValueError(f"{path}:{location}: {error.message}")
        return payload

    event_files = sorted(root.glob("*/*/event.json"))
    if not event_files:
        raise ValueError(f"{root}: no event.json files found")

    for event_file in event_files:
        event = validate(event_file)
        key = (event["season_slug"], event["event_slug"])
        if key in seen_events:
            raise ValueError(f"{event_file}: duplicate season/event: {'/'.join(key)}")
        if key not in known_events:
            raise ValueError(f"{event_file}: unknown season/event: {'/'.join(key)}")
        seen_events.add(key)
        counters["problem_events"] += 1
        seen_sets: set[str] = set()

        for set_relative in event["sets"]:
            set_dir = _inside(event_file.parent, set_relative, directory=True)
            problem_set = validate(set_dir / "set.json")
            if problem_set["slug"] in seen_sets:
                raise ValueError(f"{set_dir}: duplicate set slug: {problem_set['slug']}")
            if problem_set["slug"] != set_dir.name:
                raise ValueError(f"{set_dir}: set slug must match its directory")
            seen_sets.add(problem_set["slug"])
            counters["problem_sets"] += 1
            seen_slugs: set[str] = set()
            seen_codes: set[str] = set()

            for problem_relative in problem_set["problems"]:
                problem_dir = _inside(set_dir, problem_relative, directory=True)
                problem = validate(problem_dir / "problem.json")
                if problem["slug"] != problem_dir.name:
                    raise ValueError(f"{problem_dir}: problem slug must match its directory")
                if problem["slug"] in seen_slugs or problem["code"] in seen_codes:
                    raise ValueError(f"{problem_dir}: duplicate problem slug or code in set")
                seen_slugs.add(problem["slug"])
                seen_codes.add(problem["code"])
                statement_path = _inside(problem_dir, problem["statement_file"], directory=False)
                statement = statement_path.read_text(encoding="utf-8")
                if not statement.strip():
                    raise ValueError(f"{statement_path}: statement is empty")
                if "\ufffd" in statement:
                    raise ValueError(f"{statement_path}: contains a Unicode replacement character")
                link_keys = [(item["kind"], item["url"]) for item in problem["links"]]
                if len(link_keys) != len(set(link_keys)):
                    raise ValueError(f"{problem_dir}: duplicate problem links")
                if problem["publication_status"] == "published":
                    kinds = {item["kind"] for item in problem["links"]}
                    if not {"original", "practice"}.issubset(kinds):
                        raise ValueError(f"{problem_dir}: published problem needs original and practice links")
                counters["problems"] += 1
                counters["problem_links"] += len(problem["links"])
                counters["problem_attachments"] += len(problem.get("attachments", []))

    return counters
