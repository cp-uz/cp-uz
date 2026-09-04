"""Canonical glossary validation and deterministic metadata generation."""

from __future__ import annotations

import csv
import io
import json
import re
import unicodedata
from pathlib import Path
from typing import Any

import yaml
from content_io import stable_json, write_text

GLOSSARY_HEADERS = ("English", "O‘zbekcha", "Izoh", "Qidiruv aliaslari")
GLOSSARY_REQUIRED_INITIALS = tuple(chr(codepoint) for codepoint in range(ord("A"), ord("Z") + 1))
GLOSSARY_INTERNAL_PROPER_WORDS = frozenset(
    {"Omega", "Theta", "Ford", "Warshall", "Morris", "Pratt", "Corasick"}
)


def _glossary_option_key(value: str) -> str:
    """Match the quiz's punctuation-insensitive option comparison closely."""

    normalized = unicodedata.normalize("NFKD", value)
    normalized = "".join(
        character for character in normalized if not unicodedata.combining(character)
    )
    normalized = re.sub(r"[’‘`ʻʼ']", "", normalized.casefold())
    normalized = re.sub(r"[-_/]+", " ", normalized)
    normalized = "".join(
        character if character.isalnum() or character.isspace() else " " for character in normalized
    )
    return " ".join(normalized.split())


def parse_glossary_markdown(value: str) -> list[dict[str, Any]]:
    """Parse and validate the canonical human-edited glossary table."""

    lines = value.replace("\r\n", "\n").splitlines()
    header_index = next(
        (
            index
            for index, line in enumerate(lines)
            if tuple(cell.strip() for cell in line.strip().strip("|").split("|"))
            == GLOSSARY_HEADERS
        ),
        None,
    )
    if header_index is None or header_index + 1 >= len(lines):
        raise ValueError("glossary Markdown is missing the canonical four-column table")
    separator = tuple(
        cell.strip() for cell in lines[header_index + 1].strip().strip("|").split("|")
    )
    if len(separator) != len(GLOSSARY_HEADERS) or not all(
        re.fullmatch(r":?-{3,}:?", cell) for cell in separator
    ):
        raise ValueError("glossary Markdown has an invalid table separator")

    rows: list[dict[str, Any]] = []
    seen_sources: set[str] = set()
    for line_number, line in enumerate(lines[header_index + 2 :], header_index + 3):
        if not line.strip().startswith("|"):
            if rows:
                break
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) != len(GLOSSARY_HEADERS):
            raise ValueError(
                f"glossary line {line_number}: expected {len(GLOSSARY_HEADERS)} columns, "
                f"found {len(cells)}"
            )
        source, uzbek, note, aliases_text = cells
        if not source or not uzbek or not note:
            raise ValueError(
                f"glossary line {line_number}: English, O‘zbekcha and Izoh are required"
            )
        source_key = source.casefold()
        if source_key in seen_sources:
            raise ValueError(f"glossary line {line_number}: duplicate English concept {source!r}")
        seen_sources.add(source_key)
        if not note.endswith((".", "!", "?")):
            raise ValueError(f"glossary line {line_number}: Izoh must be a complete sentence")
        if len(note) > 400:
            raise ValueError(
                f"glossary line {line_number}: Izoh exceeds the backend 400-char limit"
            )

        aliases: list[str] = []
        local_aliases = {source_key, uzbek.casefold()}
        for alias in (part.strip() for part in aliases_text.split(";")):
            if not alias:
                continue
            alias_key = alias.casefold()
            if alias_key in local_aliases:
                continue
            local_aliases.add(alias_key)
            aliases.append(alias)
        rows.append({"source": source, "uzbek": uzbek, "note": note, "aliases": aliases})

    represented_initials = {row["source"][0].upper() for row in rows}
    missing_initials = [
        initial for initial in GLOSSARY_REQUIRED_INITIALS if initial not in represented_initials
    ]
    if missing_initials:
        raise ValueError(
            "glossary English concepts must cover every A-Z initial; "
            f"missing: {', '.join(missing_initials)}"
        )

    surface_owners: dict[str, str] = {}
    option_owners: dict[str, dict[str, str]] = {
        "English": {},
        "O‘zbekcha": {},
        "Izoh": {},
    }
    for row in rows:
        source = row["source"]
        uzbek_words = re.findall(r"[^\W\d_]+", row["uzbek"], flags=re.UNICODE)
        unexpected_title_words = [
            word
            for word in uzbek_words[1:]
            if word[:1].isupper()
            and not word.isupper()
            and word not in GLOSSARY_INTERNAL_PROPER_WORDS
        ]
        if unexpected_title_words:
            raise ValueError(
                f"glossary concept {source!r} must use Uzbek sentence case; "
                f"unexpected capitals: {', '.join(unexpected_title_words)}"
            )
        user_facing_text = " ".join((row["uzbek"], row["note"], *row["aliases"]))
        if "yevklid" in user_facing_text.casefold():
            raise ValueError(f"glossary concept {source!r} must use the Uzbek spelling 'Evklid'")

        for surface in (source, row["uzbek"], *row["aliases"]):
            surface_key = _glossary_option_key(surface)
            if not surface_key:
                raise ValueError(f"glossary concept {source!r} has an empty normalized search term")
            owner = surface_owners.get(surface_key)
            if owner and owner != source:
                raise ValueError(f"glossary search term {surface!r} is already owned by {owner!r}")
            surface_owners[surface_key] = source

        for label, field in (
            ("English", "source"),
            ("O‘zbekcha", "uzbek"),
            ("Izoh", "note"),
        ):
            option_key = _glossary_option_key(row[field])
            owner = option_owners[label].get(option_key)
            if owner and owner != source:
                raise ValueError(
                    f"glossary {label} quiz option for {source!r} duplicates {owner!r}"
                )
            option_owners[label][option_key] = source

    segment_tree = next((row for row in rows if row["source"] == "Segment Tree"), None)
    if not segment_tree or segment_tree["uzbek"] != "Segment daraxti":
        raise ValueError("glossary must define Segment Tree as Segment daraxti")
    sport_programming = next(
        (row for row in rows if row["source"] == "Competitive Programming"), None
    )
    if not sport_programming or sport_programming["uzbek"] != "Sport dasturlash":
        raise ValueError("glossary must define Competitive Programming as Sport dasturlash")
    return rows


def load_glossary(content_root: Path) -> list[dict[str, Any]]:
    return parse_glossary_markdown(
        (content_root / "articles" / "glossary.md").read_text(encoding="utf-8")
    )


def glossary_metadata_texts(rows: list[dict[str, Any]]) -> dict[str, str]:
    csv_buffer = io.StringIO(newline="")
    writer = csv.DictWriter(
        csv_buffer,
        fieldnames=("source", "uzbek", "note", "aliases"),
        lineterminator="\n",
    )
    writer.writeheader()
    for row in rows:
        writer.writerow(
            {
                "source": row["source"],
                "uzbek": row["uzbek"],
                "note": row["note"],
                "aliases": json.dumps(row["aliases"], ensure_ascii=False, separators=(",", ":")),
            }
        )
    return {
        "glossary.json": stable_json(rows),
        "glossary.yml": yaml.safe_dump(
            rows,
            allow_unicode=True,
            sort_keys=False,
            width=1000,
        ),
        "glossary.csv": csv_buffer.getvalue(),
    }


def sync_glossary_metadata(content_root: Path) -> list[dict[str, Any]]:
    rows = load_glossary(content_root)
    metadata_root = content_root / "metadata"
    for filename, value in glossary_metadata_texts(rows).items():
        write_text(metadata_root / filename, value)
    return rows


def validate_glossary_metadata(content_root: Path) -> list[dict[str, Any]]:
    rows = load_glossary(content_root)
    expected = glossary_metadata_texts(rows)
    for filename, value in expected.items():
        path = content_root / "metadata" / filename
        if not path.is_file() or path.read_text(encoding="utf-8") != value:
            raise ValueError(f"stale generated glossary metadata: metadata/{filename}")
    return rows
