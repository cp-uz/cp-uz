#!/usr/bin/env python3
"""Shared, backend-agnostic CP.UZ content snapshot/export helpers.

This module intentionally knows nothing about Django models.  It preserves the
canonical cp-uz/algo documents and metadata, then emits a deterministic JSON
contract that any backend importer can consume transactionally.
"""

from __future__ import annotations

import csv
import hashlib
import io
import json
import posixpath
import re
import shutil
import subprocess
import unicodedata
from collections import Counter
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path, PurePosixPath
from typing import Any
from urllib.parse import unquote, urlparse

try:
    import yaml
except ImportError as exc:  # pragma: no cover - dependency failure is explicit
    raise SystemExit("PyYAML>=6 is required: python -m pip install 'PyYAML>=6,<7'") from exc


EXPORT_SCHEMA = "cpuz.learning-content.v1"
SNAPSHOT_SCHEMA = "cpuz.content-snapshot.v1"
EXPECTED_ARTICLE_COUNT = 163
EXPECTED_FULL_COUNT = 163
EXPECTED_SYNOPSIS_COUNT = 0
SOURCE_REPOSITORY = "https://github.com/cp-algorithms/cp-algorithms"
CONTENT_LICENSE = "CC-BY-SA-4.0"
READINESS_GATE_VERSION = "cpuz.readiness.v1"
ARTICLE_DIFFICULTY_SCHEMA = "cpuz.article-difficulty.v1"
ARTICLE_DIFFICULTY_LEVELS = ("beginner", "intermediate", "advanced")

ARTICLE_METADATA_FILES = (
    "data/articles.yml",
    "data/schema/articles.schema.json",
    "data/article_metadata.tsv",
    "data/site.yml",
    "data/upstream.yml",
    "data/glossary.yml",
    "data/glossary.json",
    "data/glossary.csv",
)

PROVENANCE_FILES = (
    "ATTRIBUTION.md",
    "THIRD_PARTY_NOTICES.md",
    "UPSTREAM_PIN",
)

FRONT_MATTER_BOUNDARY = "---\n"
MARKDOWN_LINK_RE = re.compile(r"(?<!!)\[([^\]]+)\]\((https?://[^\s)]+)(?:\s+['\"][^'\"]*['\"])?\)")
MARKDOWN_DESTINATION_RE = re.compile(
    r"(?P<image>!)?\[[^\]]*\]\((?P<target><[^>]+>|[^\s)]+)(?:\s+['\"][^'\"]*['\"])?\)"
)
HTML_IMAGE_RE = re.compile(r"<img\b[^>]*\bsrc\s*=\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
GLOSSARY_HEADERS = ("English", "O‘zbekcha", "Izoh", "Qidiruv aliaslari")
EXPECTED_GLOSSARY_CONCEPTS = 174
GLOSSARY_REQUIRED_INITIALS = tuple(chr(codepoint) for codepoint in range(ord("A"), ord("Z") + 1))
GLOSSARY_INTERNAL_PROPER_WORDS = frozenset(
    {"Omega", "Theta", "Ford", "Warshall", "Morris", "Pratt", "Corasick"}
)


@dataclass(frozen=True)
class ArticleDocument:
    article_id: str
    body: str

    @property
    def content_sha256(self) -> str:
        return sha256_text(self.body)


@dataclass(frozen=True)
class ReadinessAssessment:
    article_id: str
    path: str
    ready: bool
    reasons: tuple[str, ...]
    content_sha256: str
    source_commit: str
    word_count: int
    heading_count: int
    practice_link_count: int

    def as_dict(self) -> dict[str, Any]:
        return {
            "article_id": self.article_id,
            "path": self.path,
            "ready": self.ready,
            "reasons": list(self.reasons),
            "content_sha256": self.content_sha256,
            "source_commit": self.source_commit,
            "word_count": self.word_count,
            "heading_count": self.heading_count,
            "practice_link_count": self.practice_link_count,
        }


def normalize_scalars(value: Any) -> Any:
    """Convert PyYAML date types into stable JSON-compatible strings."""

    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, dict):
        return {str(key): normalize_scalars(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize_scalars(item) for item in value]
    return value


def stable_json(value: Any) -> str:
    return json.dumps(
        normalize_scalars(value),
        ensure_ascii=False,
        indent=2,
        sort_keys=True,
    ) + "\n"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_text(value: str) -> str:
    return sha256_bytes(value.encode("utf-8"))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8", newline="\n")


def run_git(checkout: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(checkout), *args],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return result.stdout.strip()


def git_value(checkout: Path, *args: str, fallback: str | None = None) -> str | None:
    try:
        return run_git(checkout, *args)
    except (OSError, subprocess.CalledProcessError):
        return fallback


def load_yaml(path: Path) -> Any:
    return normalize_scalars(yaml.safe_load(path.read_text(encoding="utf-8")))


def _glossary_option_key(value: str) -> str:
    """Match the quiz's punctuation-insensitive option comparison closely."""

    normalized = unicodedata.normalize("NFKD", value)
    normalized = "".join(character for character in normalized if not unicodedata.combining(character))
    normalized = re.sub(r"[’‘`ʻʼ']", "", normalized.casefold())
    normalized = re.sub(r"[-_/]+", " ", normalized)
    normalized = "".join(
        character if character.isalnum() or character.isspace() else " "
        for character in normalized
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

    if len(rows) != EXPECTED_GLOSSARY_CONCEPTS:
        raise ValueError(
            f"glossary must contain exactly {EXPECTED_GLOSSARY_CONCEPTS} unique concepts; "
            f"found {len(rows)}"
        )

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
            raise ValueError(
                f"glossary concept {source!r} must use the Uzbek spelling 'Evklid'"
            )

        for surface in (source, row["uzbek"], *row["aliases"]):
            surface_key = _glossary_option_key(surface)
            if not surface_key:
                raise ValueError(f"glossary concept {source!r} has an empty normalized search term")
            owner = surface_owners.get(surface_key)
            if owner and owner != source:
                raise ValueError(
                    f"glossary search term {surface!r} is already owned by {owner!r}"
                )
            surface_owners[surface_key] = source

        for label, field in (("English", "source"), ("O‘zbekcha", "uzbek"), ("Izoh", "note")):
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


def split_document(text: str) -> ArticleDocument:
    normalized = text.replace("\r\n", "\n")
    if not normalized.startswith(FRONT_MATTER_BOUNDARY):
        raise ValueError("article is missing YAML front matter")
    parts = normalized.split(FRONT_MATTER_BOUNDARY, 2)
    if len(parts) != 3:
        raise ValueError("article has unterminated YAML front matter")
    front_matter = yaml.safe_load(parts[1])
    if not isinstance(front_matter, dict):
        raise ValueError("article front matter must be a mapping")
    article_id = front_matter.get("article_id")
    if not isinstance(article_id, str) or not article_id:
        raise ValueError("article front matter is missing article_id")
    unexpected = sorted(set(front_matter) - {"article_id"})
    if unexpected:
        raise ValueError(f"unsupported article front matter keys: {unexpected}")
    return ArticleDocument(article_id=article_id, body=parts[2])


def load_document(path: Path) -> ArticleDocument:
    return split_document(path.read_text(encoding="utf-8"))


def _plain_heading(value: str) -> str:
    value = re.sub(r"\s+\{[^{}]*\}\s*$", "", value)
    value = re.sub(r"[`*_]", "", value)
    return " ".join(value.casefold().rstrip(":").split())


def disallowed_control_characters(value: str) -> list[str]:
    """Return C0 controls that are unsafe in canonical Markdown."""

    return sorted(
        {
            character
            for character in value
            if ord(character) < 0x20 and character not in "\t\n\r"
        }
    )


def is_practice_heading(value: str) -> bool:
    """Identify lesson sections containing links to external exercises.

    The inventory uses Uzbek heading variants.  Deliberately broad handling of
    headings ending in "masala/masalalar" is safe because only external Markdown
    links inside that section are emitted; no problem statements are copied.
    """

    heading = _plain_heading(value)
    if heading in {"masalalar", "masalalari", "practice problems", "practice problem"}:
        return True
    if heading.startswith("masala misol"):
        return True
    return bool(
        re.search(
            r"(?:mashq|amaliy|namunaviy|misol|onlayn hakamlardagi|bog‘liq|bog'liq|"
            r"boshqa).*(?:masala|masalalar|masalalari)$",
            heading,
        )
    )


PLATFORM_HOSTS: tuple[tuple[str, str], ...] = (
    ("codeforces.com", "Codeforces"),
    ("atcoder.jp", "AtCoder"),
    ("cses.fi", "CSES"),
    ("spoj.com", "SPOJ"),
    ("kattis.com", "Kattis"),
    ("leetcode.com", "LeetCode"),
    ("codechef.com", "CodeChef"),
    ("hackerrank.com", "HackerRank"),
    ("hackerearth.com", "HackerEarth"),
    ("topcoder.com", "Topcoder"),
    ("onlinejudge.org", "UVa Online Judge"),
    ("uva.onlinejudge.org", "UVa Online Judge"),
    ("acmicpc.net", "Baekjoon Online Judge"),
    ("timus.ru", "Timus"),
    ("oj.uz", "OJ.uz"),
    ("dmoj.ca", "DMOJ"),
    ("dmoj.uclv.edu.cu", "DMOJ UCLV"),
    ("acmp.ru", "ACMP"),
    ("e-olymp.com", "E-olymp"),
    ("eolymp.com", "E-olymp"),
    ("judge.yosupo.jp", "Library Checker"),
    ("lightoj.com", "LightOJ"),
    ("vjudge.net", "Virtual Judge"),
    ("csacademy.com", "CS Academy"),
    ("projecteuler.net", "Project Euler"),
    ("poj.org", "POJ"),
    ("acm.hdu.edu.cn", "HDU Online Judge"),
    ("usaco.org", "USACO"),
    ("szkopul.edu.pl", "Szkopuł"),
    ("matcomgrader.com", "MATCOM Grader"),
    ("toph.co", "Toph"),
    ("acm.sgu.ru", "SGU"),
    ("timus.online", "Timus"),
    ("web.archive.org", "Web Archive"),
    ("github.com", "GitHub archive"),
    ("icpcarchive.ecs.baylor.edu", "ICPC Live Archive"),
)

# These are useful explanatory references, but they are not exercises.  Some
# articles place them inside a broad "sample problems" section, so section
# detection alone would otherwise produce false practice-reference rows.
NON_EXERCISE_HOSTS = ("wikipedia.org", "e-maxx.ru")


def platform_for_url(url: str) -> str:
    hostname = (urlparse(url).hostname or "").casefold()
    for suffix, platform in PLATFORM_HOSTS:
        if hostname == suffix or hostname.endswith("." + suffix):
            return platform
    return hostname.removeprefix("www.") or "External"


def is_exercise_url(url: str) -> bool:
    hostname = (urlparse(url).hostname or "").casefold()
    return bool(hostname) and not any(
        hostname == suffix or hostname.endswith("." + suffix)
        for suffix in NON_EXERCISE_HOSTS
    )


def extract_practice_links(body: str) -> list[dict[str, Any]]:
    """Extract external exercise references from practice-oriented sections."""

    lines = body.splitlines()
    active: tuple[int, str] | None = None
    links: list[dict[str, Any]] = []
    seen: set[str] = set()

    for line_number, line in enumerate(lines, 1):
        heading_match = HEADING_RE.match(line)
        if heading_match:
            level = len(heading_match.group(1))
            title = heading_match.group(2)
            if active and level <= active[0]:
                active = None
            if is_practice_heading(title):
                active = (level, title)
            continue
        if not active:
            continue
        for link_match in MARKDOWN_LINK_RE.finditer(line):
            title = re.sub(r"\s+", " ", link_match.group(1)).strip()
            url = link_match.group(2).strip()
            if not is_exercise_url(url):
                continue
            if url in seen:
                continue
            seen.add(url)
            trailing = line[link_match.end() :].strip().lstrip("-–—:;,. ").strip()
            # MkDocs admonition titles wrap the whole Markdown link in quotes.
            # A lone closing quote is presentation syntax, not a useful note.
            trailing = trailing.strip("\"'").strip()
            links.append(
                {
                    "platform": platform_for_url(url),
                    "title": title,
                    "url": url,
                    "note": trailing or None,
                    "section_heading": active[1],
                    "line": line_number,
                }
            )
    return links


def effective_review_status(article: dict[str, Any], review_type: str, body_sha256: str) -> str:
    review = article["reviews"][review_type]
    status = review["status"]
    if status != "approved":
        return status
    if article["upstream"]["status"] != "current":
        return "stale"
    if review.get("content_sha256") != body_sha256:
        return "stale"
    if review.get("source_commit") != article["source"]["commit"]:
        return "stale"
    return "approved"


def workflow_stage(article: dict[str, Any], body_sha256: str) -> str:
    if (
        article["publication"]["status"] == "deprecated"
        or article["translation"]["status"] == "deprecated"
    ):
        return "deprecated"
    if article["upstream"]["status"] == "changed":
        return "upstream_changed"
    if article["upstream"]["status"] == "missing":
        return "upstream_missing"
    technical = effective_review_status(article, "technical", body_sha256)
    language = effective_review_status(article, "language", body_sha256)
    if "stale" in {technical, language}:
        return "needs_re_review"
    if technical == "changes_requested":
        return "technical_changes_requested"
    if technical == "pending":
        return "technical_review_pending"
    if language == "changes_requested":
        return "language_changes_requested"
    if language == "pending":
        return "language_review_pending"
    if article["publication"]["status"] == "published":
        return "published"
    return "ready_to_publish"


def _safe_relative_path(value: str, *, suffix: str | None = None) -> Path:
    if not value or "\\" in value:
        raise ValueError(f"unsafe relative path: {value!r}")
    posix_path = PurePosixPath(value)
    parts = posix_path.parts
    if (
        posix_path.is_absolute()
        or ".." in parts
        or "." in parts
        or "" in parts
        or (parts and parts[0].endswith(":"))
    ):
        raise ValueError(f"unsafe relative path: {value!r}")
    if suffix and not value.endswith(suffix):
        raise ValueError(f"path must end in {suffix}: {value!r}")
    return Path(*posix_path.parts)


def load_manifest(content_root: Path) -> dict[str, Any]:
    path = content_root / "metadata" / "articles.yml"
    data = load_yaml(path)
    if not isinstance(data, dict) or not isinstance(data.get("articles"), list):
        raise ValueError("metadata/articles.yml must contain an articles list")
    return data


def load_article_difficulties(content_root: Path) -> dict[str, str]:
    """Load the explicit editorial learning level for every canonical article."""

    path = content_root / "metadata" / "article_difficulties.json"
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise ValueError(f"invalid metadata/article_difficulties.json: {exc}") from exc

    if payload.get("schema") != ARTICLE_DIFFICULTY_SCHEMA:
        raise ValueError(
            "article difficulty schema must be " f"{ARTICLE_DIFFICULTY_SCHEMA!r}"
        )
    levels = payload.get("levels")
    if not isinstance(levels, dict) or set(levels) != set(ARTICLE_DIFFICULTY_LEVELS):
        raise ValueError(
            "article difficulty levels must be exactly: "
            + ", ".join(ARTICLE_DIFFICULTY_LEVELS)
        )

    result: dict[str, str] = {}
    for level in ARTICLE_DIFFICULTY_LEVELS:
        article_ids = levels[level]
        if not isinstance(article_ids, list) or not all(
            isinstance(article_id, str) and article_id for article_id in article_ids
        ):
            raise ValueError(f"article difficulty level {level!r} must be an ID list")
        for article_id in article_ids:
            previous = result.get(article_id)
            if previous is not None:
                raise ValueError(
                    f"article {article_id!r} has duplicate difficulty levels: "
                    f"{previous!r}, {level!r}"
                )
            result[article_id] = level
    return result


def _without_yaml_front_matter(value: str) -> str:
    normalized = value.replace("\r\n", "\n")
    if not normalized.startswith(FRONT_MATTER_BOUNDARY):
        return normalized
    parts = normalized.split(FRONT_MATTER_BOUNDARY, 2)
    return parts[2] if len(parts) == 3 else normalized


def _without_fenced_code(value: str) -> str:
    lines: list[str] = []
    fence: str | None = None
    for line in value.splitlines():
        stripped = line.lstrip()
        marker = "```" if stripped.startswith("```") else "~~~" if stripped.startswith("~~~") else None
        if marker:
            fence = None if fence == marker else marker if fence is None else fence
            continue
        if fence is None:
            lines.append(line)
    return "\n".join(lines)


def markdown_heading_count(value: str) -> int:
    return sum(1 for line in _without_fenced_code(value).splitlines() if HEADING_RE.match(line))


def markdown_prose_word_count(value: str) -> int:
    prose = _without_fenced_code(value)
    prose = re.sub(r"\$\$.*?\$\$", " ", prose, flags=re.DOTALL)
    prose = re.sub(r"<[^>]+>", " ", prose)
    return len(re.findall(r"[A-Za-zÀ-žʻ’‘'-]+", prose))


def fenced_code_block_count(value: str) -> int:
    count = 0
    fence: str | None = None
    for line in value.splitlines():
        stripped = line.lstrip()
        marker = "```" if stripped.startswith("```") else "~~~" if stripped.startswith("~~~") else None
        if not marker:
            continue
        if fence is None:
            fence = marker
            count += 1
        elif fence == marker:
            fence = None
    return count


def _link_targets(value: str, *, images: bool | None = None) -> set[str]:
    targets: set[str] = set()
    for match in MARKDOWN_DESTINATION_RE.finditer(value):
        is_image = bool(match.group("image"))
        if images is not None and images != is_image:
            continue
        targets.add(match.group("target").strip("<>"))
    if images is not False:
        targets.update(HTML_IMAGE_RE.findall(value))
    return targets


def _external_urls(value: str) -> set[str]:
    return set(re.findall(r"https?://[^\s)\"'>]+", value))


def _resolved_content_target(article_path: str, raw_target: str) -> str | None:
    parsed = urlparse(raw_target.strip("<>"))
    if parsed.scheme or parsed.netloc or not parsed.path or parsed.path.startswith("/"):
        return None
    relative = unquote(parsed.path)
    resolved = posixpath.normpath(posixpath.join(posixpath.dirname(article_path), relative))
    for prefix in ("content/articles/", "articles/", "docs/", "src/"):
        if resolved.startswith(prefix):
            resolved = resolved[len(prefix) :]
    return resolved


def _readiness_reasons(
    content_root: Path,
    article: dict[str, Any],
    document: ArticleDocument,
    article_paths: set[str],
) -> tuple[str, ...]:
    reasons: list[str] = []
    translation = article.get("translation") or {}
    source = article.get("source") or {}
    upstream = article.get("upstream") or {}
    body = document.body

    if translation.get("scope") != "full_upstream_article":
        reasons.append("translation_scope_is_not_full")
    if translation.get("full_prose_translated") is not True:
        reasons.append("full_prose_translation_not_confirmed")
    if translation.get("status") not in {
        "ai_full_translation_draft",
        "human_translation_draft",
    }:
        reasons.append("translation_status_is_not_full_draft")
    for field in (
        "title",
        "idea",
        "complexity",
        "uses",
        "fidelity",
        "translators",
        "translated_at",
        "changes",
    ):
        if not translation.get(field):
            reasons.append(f"missing_translation_{field}")

    word_count = markdown_prose_word_count(body)
    heading_count = markdown_heading_count(body)
    if word_count < 120:
        reasons.append("translated_prose_too_short")
    if heading_count < 3:
        reasons.append("insufficient_heading_structure")
    if "�" in body or disallowed_control_characters(body):
        reasons.append("unsafe_unicode_or_control_character")
    if upstream.get("status") != "current":
        reasons.append("upstream_is_not_current")
    for field in ("title", "url", "file", "repo", "commit", "license"):
        if not source.get(field):
            reasons.append(f"missing_source_{field}")

    article_path = str(article.get("path") or "")
    for target in sorted(_link_targets(body, images=False)):
        resolved = _resolved_content_target(article_path, target)
        if resolved and resolved.lower().endswith(".md") and resolved not in article_paths:
            reasons.append(f"broken_internal_markdown_link:{target}")
    for target in sorted(_link_targets(body, images=True)):
        resolved = _resolved_content_target(article_path, target)
        if resolved and not (content_root / "articles" / resolved).is_file():
            reasons.append(f"missing_local_asset:{target}")

    source_file_value = source.get("file")
    bundled_source = content_root / "upstream" / str(source_file_value or "")
    if source.get("sha256"):
        if not bundled_source.is_file():
            reasons.append("pinned_source_snapshot_missing")
        else:
            source_text = bundled_source.read_text(encoding="utf-8").replace("\r\n", "\n")
            if sha256_text(source_text) != source["sha256"]:
                reasons.append("pinned_source_sha256_mismatch")
            source_body = _without_yaml_front_matter(source_text)
            if markdown_heading_count(body) < markdown_heading_count(source_body):
                reasons.append("source_heading_structure_incomplete")
            if fenced_code_block_count(body) < fenced_code_block_count(source_body):
                reasons.append("source_code_blocks_incomplete")
            if body.count("$$") < source_body.count("$$"):
                reasons.append("source_display_math_incomplete")
            if not _external_urls(source_body).issubset(_external_urls(body)):
                reasons.append("source_links_incomplete")

    return tuple(dict.fromkeys(reasons))


def assess_article_readiness(content_root: Path) -> list[ReadinessAssessment]:
    """Assess objective import/render readiness without granting human approval."""

    manifest = load_manifest(content_root)
    articles = manifest["articles"]
    article_paths = {str(article["path"]) for article in articles}
    assessments: list[ReadinessAssessment] = []
    for article in articles:
        relative_path = _safe_relative_path(str(article["path"]), suffix=".md")
        document = load_document(content_root / "articles" / relative_path)
        reasons = _readiness_reasons(content_root, article, document, article_paths)
        assessments.append(
            ReadinessAssessment(
                article_id=str(article["id"]),
                path=str(article["path"]),
                ready=not reasons,
                reasons=reasons,
                content_sha256=document.content_sha256,
                source_commit=str(article.get("source", {}).get("commit") or ""),
                word_count=markdown_prose_word_count(document.body),
                heading_count=markdown_heading_count(document.body),
                practice_link_count=len(extract_practice_links(document.body)),
            )
        )
    return assessments


def validate_inventory(content_root: Path) -> dict[str, Any]:
    data = load_manifest(content_root)
    glossary_rows = validate_glossary_metadata(content_root)
    articles = data["articles"]
    difficulties = load_article_difficulties(content_root)
    errors: list[str] = []
    ids: set[str] = set()
    paths: set[str] = set()
    routes: set[str] = set()
    full_count = 0
    synopsis_count = 0
    draft_count = 0
    ready_count = 0
    published_count = 0
    practice_link_count = 0
    history_event_count = 0
    source_hash_count = 0
    category_counts: Counter[str] = Counter()

    snapshot_path = content_root / "SNAPSHOT.json"
    try:
        snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise ValueError(f"invalid SNAPSHOT.json: {exc}") from exc
    if snapshot.get("schema") != SNAPSHOT_SCHEMA:
        errors.append(f"snapshot schema must be {SNAPSHOT_SCHEMA!r}")
    if snapshot.get("content_license") != CONTENT_LICENSE:
        errors.append(f"snapshot content_license must be {CONTENT_LICENSE!r}")
    upstream_commit = snapshot.get("upstream_commit")
    if not isinstance(upstream_commit, str) or not re.fullmatch(r"[0-9a-f]{40}", upstream_commit):
        errors.append("snapshot upstream_commit must be a 40-character lowercase Git hash")
    adaptation_commit = snapshot.get("commit")
    if not isinstance(adaptation_commit, str) or not re.fullmatch(
        r"[0-9a-f]{40}", adaptation_commit
    ):
        errors.append("snapshot commit must be a 40-character lowercase Git hash")
    required_snapshot_files = (
        "ATTRIBUTION.md",
        "LICENSE-CC-BY-SA-4.0.txt",
        "provenance/ATTRIBUTION.md",
        "provenance/THIRD_PARTY_NOTICES.md",
        "provenance/UPSTREAM_PIN",
    )
    for relative in required_snapshot_files:
        if not (content_root / _safe_relative_path(relative)).is_file():
            errors.append(f"snapshot is missing required provenance file {relative!r}")
    pin_path = content_root / "provenance" / "UPSTREAM_PIN"
    if pin_path.is_file() and pin_path.read_text(encoding="utf-8").strip() != upstream_commit:
        errors.append("provenance/UPSTREAM_PIN does not match SNAPSHOT.json upstream_commit")

    if data.get("schema_version") != 2:
        errors.append("metadata schema_version must be 2")

    manifest_ids = {
        str(article.get("id"))
        for article in articles
        if isinstance(article.get("id"), str) and article.get("id")
    }
    missing_difficulties = sorted(manifest_ids - set(difficulties))
    unknown_difficulties = sorted(set(difficulties) - manifest_ids)
    if missing_difficulties:
        errors.append(
            "articles missing an editorial difficulty: " + ", ".join(missing_difficulties)
        )
    if unknown_difficulties:
        errors.append(
            "difficulty metadata references unknown articles: "
            + ", ".join(unknown_difficulties)
        )

    article_paths_for_readiness = {str(article.get("path") or "") for article in articles}

    for position, article in enumerate(articles, 1):
        label = str(article.get("path") or article.get("id") or f"article #{position}")
        if article.get("index") != position:
            errors.append(f"{label}: expected index {position}, got {article.get('index')!r}")
        identifier = article.get("id")
        path_value = article.get("path")
        route = article.get("route")
        if not isinstance(identifier, str) or not identifier:
            errors.append(f"{label}: missing id")
            continue
        if identifier in ids:
            errors.append(f"{label}: duplicate id {identifier}")
        ids.add(identifier)
        if not isinstance(path_value, str):
            errors.append(f"{label}: missing path")
            continue
        if path_value in paths:
            errors.append(f"{label}: duplicate path")
        paths.add(path_value)
        if route in routes:
            errors.append(f"{label}: duplicate route")
        if isinstance(route, str):
            routes.add(route)
        try:
            relative_path = _safe_relative_path(path_value, suffix=".md")
        except ValueError as exc:
            errors.append(str(exc))
            continue
        expected_route = path_value[:-3] + "/index.html"
        if route != expected_route:
            errors.append(f"{label}: route must be {expected_route!r}")
        article_path = content_root / "articles" / relative_path
        if not article_path.is_file():
            errors.append(f"{label}: missing Markdown document")
            continue
        try:
            document = load_document(article_path)
        except (OSError, ValueError) as exc:
            errors.append(f"{label}: {exc}")
            continue
        if document.article_id != identifier:
            errors.append(f"{label}: front matter id {document.article_id!r} != {identifier!r}")
        if "\ufffd" in document.body:
            errors.append(f"{label}: Markdown contains Unicode replacement character U+FFFD")
        controls = disallowed_control_characters(document.body)
        if controls:
            codepoints = ", ".join(f"U+{ord(character):04X}" for character in controls)
            errors.append(f"{label}: Markdown contains disallowed control characters: {codepoints}")
        if not document.body.strip():
            errors.append(f"{label}: Markdown body is empty")

        translation = article.get("translation", {})
        scope = translation.get("scope")
        full_prose = translation.get("full_prose_translated")
        if scope == "full_upstream_article" and full_prose is True:
            full_count += 1
        elif scope == "uzbek_title_and_technical_synopsis_only" and full_prose is False:
            synopsis_count += 1
        else:
            errors.append(f"{label}: unrecognized scope/full_prose combination")

        source = article.get("source", {})
        if source.get("file") != f"src/{path_value}":
            errors.append(f"{label}: source.file does not match article path")
        if source.get("repo") != SOURCE_REPOSITORY:
            errors.append(f"{label}: unexpected source repository {source.get('repo')!r}")
        if source.get("commit") != upstream_commit:
            errors.append(f"{label}: source commit does not match the pinned upstream revision")
        if source.get("license") != CONTENT_LICENSE:
            errors.append(f"{label}: source license must be {CONTENT_LICENSE!r}")
        source_hash = source.get("sha256")
        if source_hash:
            source_hash_count += 1
            source_file_value = source.get("file")
            try:
                source_relative = _safe_relative_path(str(source_file_value), suffix=".md")
            except ValueError as exc:
                errors.append(f"{label}: {exc}")
            else:
                bundled_source = content_root / "upstream" / source_relative
                if not bundled_source.is_file():
                    errors.append(f"{label}: hashed upstream source is not bundled")
                else:
                    # Git hashes in source metadata are based on canonical LF
                    # text. Git may materialize CRLF files in a Windows clone.
                    normalized_source = bundled_source.read_text(encoding="utf-8").replace(
                        "\r\n", "\n"
                    )
                    if sha256_text(normalized_source) != source_hash:
                        errors.append(f"{label}: bundled upstream source hash mismatch")
        reviews = article.get("reviews", {})
        for review_type in ("technical", "language"):
            review = reviews.get(review_type, {})
            status = review.get("status")
            if status not in {"pending", "approved", "changes_requested"}:
                errors.append(f"{label}: invalid {review_type} review status {status!r}")
        history = article.get("review_history")
        if not isinstance(history, list):
            errors.append(f"{label}: review_history must be a list")
        else:
            history_event_count += len(history)

        publication = article.get("publication") or {}
        publication_status = publication.get("status")
        if publication_status not in {"draft", "ready", "published", "deprecated"}:
            errors.append(f"{label}: invalid publication status {publication_status!r}")
        elif publication_status == "draft":
            draft_count += 1
        elif publication_status == "ready":
            ready_count += 1
            readiness_reasons = _readiness_reasons(
                content_root,
                article,
                document,
                article_paths_for_readiness,
            )
            if readiness_reasons:
                errors.append(
                    f"{label}: ready article fails {READINESS_GATE_VERSION}: "
                    + ", ".join(readiness_reasons)
                )
            gate_event = next(
                (
                    event
                    for event in reversed(history)
                    if event.get("event") == "automated_readiness_gate_passed"
                    and event.get("gate_version") == READINESS_GATE_VERSION
                    and event.get("content_sha256") == document.content_sha256
                    and event.get("source_commit") == source.get("commit")
                ),
                None,
            )
            if not gate_event:
                errors.append(f"{label}: ready status has no current auditable gate event")
        elif publication_status == "published":
            published_count += 1
            technical = effective_review_status(article, "technical", document.content_sha256)
            language = effective_review_status(article, "language", document.content_sha256)
            if {technical, language} != {"approved"}:
                errors.append(
                    f"{label}: published status requires current technical and language approvals"
                )

        category_counts[str(article.get("category", ""))] += 1
        practice_link_count += len(extract_practice_links(document.body))

    if len(articles) != EXPECTED_ARTICLE_COUNT:
        errors.append(f"expected {EXPECTED_ARTICLE_COUNT} articles, found {len(articles)}")
    if full_count != EXPECTED_FULL_COUNT:
        errors.append(f"expected {EXPECTED_FULL_COUNT} full translations, found {full_count}")
    if synopsis_count != EXPECTED_SYNOPSIS_COUNT:
        errors.append(f"expected {EXPECTED_SYNOPSIS_COUNT} synopsis drafts, found {synopsis_count}")

    if errors:
        raise ValueError("content validation failed:\n- " + "\n- ".join(errors))

    return {
        "articles": len(articles),
        "article_difficulties": dict(
            sorted(Counter(difficulties.values()).items())
        ),
        "glossary_concepts": len(glossary_rows),
        "full_translations": full_count,
        "synopsis_drafts": synopsis_count,
        "draft_articles": draft_count,
        "ready_articles": ready_count,
        "published_articles": published_count,
        "practice_links": practice_link_count,
        "review_history_events": history_event_count,
        "articles_with_source_sha256": source_hash_count,
        "categories": dict(sorted(category_counts.items())),
    }


def article_export(
    content_root: Path, article: dict[str, Any], difficulty: str
) -> dict[str, Any]:
    path_value = str(article["path"])
    relative_path = _safe_relative_path(path_value, suffix=".md")
    markdown_path = content_root / "articles" / relative_path
    markdown_text = markdown_path.read_text(encoding="utf-8").replace("\r\n", "\n")
    document = split_document(markdown_text)
    body_hash = document.content_sha256
    return {
        "index": article["index"],
        "id": article["id"],
        "path": path_value,
        "route": article["route"],
        "public_path": "/" + str(article["route"]).removesuffix("index.html"),
        "category": article["category"],
        "category_uz": article["category_uz"],
        "subcategory": article["subcategory"],
        "subcategory_uz": article["subcategory_uz"],
        "difficulty": difficulty,
        "markdown_file": f"articles/{path_value}",
        "markdown": document.body,
        "content_sha256": body_hash,
        "document_sha256": sha256_text(markdown_text),
        "source": article["source"],
        "translation": article["translation"],
        "upstream": article["upstream"],
        "publication": article["publication"],
        "reviews": article["reviews"],
        "review_history": article["review_history"],
        "effective_reviews": {
            "technical": effective_review_status(article, "technical", body_hash),
            "language": effective_review_status(article, "language", body_hash),
        },
        "workflow_stage": workflow_stage(article, body_hash),
        "practice_links": extract_practice_links(document.body),
    }


def build_export(content_root: Path) -> dict[str, Any]:
    summary = validate_inventory(content_root)
    manifest = load_manifest(content_root)
    difficulties = load_article_difficulties(content_root)
    snapshot = json.loads((content_root / "SNAPSHOT.json").read_text(encoding="utf-8"))
    values = [
        article_export(content_root, article, difficulties[article["id"]])
        for article in manifest["articles"]
    ]
    return {
        "schema": EXPORT_SCHEMA,
        "source_snapshot": snapshot,
        "counts": summary,
        "license": {
            "content": CONTENT_LICENSE,
            "license_file": "LICENSE-CC-BY-SA-4.0.txt",
            "attribution_file": "ATTRIBUTION.md",
        },
        "articles": values,
    }


def export_content(content_root: Path, output: Path | None = None) -> Path:
    output_path = output or content_root / "exports" / "articles.v1.json"
    write_text(output_path, stable_json(build_export(content_root)))
    return output_path


def iter_manifest_files(content_root: Path) -> Iterable[Path]:
    for path in sorted(content_root.rglob("*")):
        if not path.is_file():
            continue
        if path.name == "MANIFEST.sha256":
            continue
        yield path


def write_checksum_manifest(content_root: Path) -> Path:
    rows = [
        f"{sha256_file(path)}  {path.relative_to(content_root).as_posix()}"
        for path in iter_manifest_files(content_root)
    ]
    target = content_root / "MANIFEST.sha256"
    write_text(target, "\n".join(rows) + "\n")
    return target


def validate_checksum_manifest(content_root: Path) -> None:
    manifest_path = content_root / "MANIFEST.sha256"
    expected: dict[str, str] = {}
    for line in manifest_path.read_text(encoding="utf-8").splitlines():
        digest, separator, relative = line.partition("  ")
        if not separator or not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise ValueError(f"invalid checksum row: {line!r}")
        _safe_relative_path(relative)
        if relative in expected:
            raise ValueError(f"duplicate checksum path: {relative!r}")
        expected[relative] = digest
    actual = {
        path.relative_to(content_root).as_posix(): sha256_file(path)
        for path in iter_manifest_files(content_root)
    }
    missing = sorted(set(expected) - set(actual))
    unlisted = sorted(set(actual) - set(expected))
    changed = sorted(
        path for path in expected.keys() & actual.keys() if expected[path] != actual[path]
    )
    if missing or unlisted or changed:
        raise ValueError(
            "checksum validation failed: "
            f"missing={missing[:5]}, unlisted={unlisted[:5]}, changed={changed[:5]}"
        )


def write_snapshot_documents(destination: Path, snapshot: dict[str, Any]) -> None:
    """Create the snapshot-local readme and complete adaptation attribution."""

    articles = load_manifest(destination)["articles"]
    full_count = sum(
        article["translation"]["scope"] == "full_upstream_article"
        and article["translation"]["full_prose_translated"] is True
        for article in articles
    )
    synopsis_count = len(articles) - full_count
    ready_count = sum(article["publication"]["status"] == "ready" for article in articles)
    practice_count = sum(
        len(extract_practice_links(load_document(destination / "articles" / article["path"]).body))
        for article in articles
    )
    technical_approvals = sum(
        article["reviews"]["technical"]["status"] == "approved" for article in articles
    )
    language_approvals = sum(
        article["reviews"]["language"]["status"] == "approved" for article in articles
    )
    published_count = sum(
        article["publication"]["status"] == "published" for article in articles
    )
    technical_pending = sum(
        article["reviews"]["technical"]["status"] == "pending" for article in articles
    )
    language_pending = sum(
        article["reviews"]["language"]["status"] == "pending" for article in articles
    )
    unpublished_count = len(articles) - published_count
    full_translators = sorted(
        {
            translator
            for article in articles
            if article["translation"]["scope"] == "full_upstream_article"
            for translator in article["translation"]["translators"]
        }
    )
    translator_credit = ", ".join(full_translators) or "CP.UZ contributors"
    adaptation_repository = str(snapshot["repository"]).removesuffix(".git")

    readme = f"""# CP.UZ learning-content snapshot

This directory is the portable source of truth for the new learning-only CP.UZ
website. It contains no judge, problem bank, contest, submission, or training
data.

## Inventory

- {len(articles)} registered Uzbek article routes.
- {full_count} source-ordered full upstream translations; {synopsis_count} synopsis-only drafts.
- {ready_count} articles passed the `{READINESS_GATE_VERSION}` automated readiness gate.
- {practice_count} external exercise references are extracted deterministically from lesson
  practice sections into the JSON export.
- {technical_approvals} technical approvals, {language_approvals} language approvals, and
  {published_count} published articles. Automated readiness does not replace either human review.

## Layout

- `articles/` — canonical translated Markdown and article assets, each linked
  to its exact upstream path and pinned revision.
- `metadata/articles.yml` — canonical identity, taxonomy, source, translation,
  upstream, publication, review, hash, and history metadata.
- `metadata/schema/articles.schema.json` — upstream metadata schema.
- `upstream/` — pinned English snapshots bundled by the source project.
- `exports/articles.v1.json` — deterministic, backend-neutral import payload.
- `SNAPSHOT.json` — exact repository and upstream revisions.
- `MANIFEST.sha256` — integrity hashes for every file except itself.
- `provenance/` — notices copied unchanged from the source repository.

`provenance/THIRD_PARTY_NOTICES.md` is retained verbatim as historical evidence
and contains an older partial-release count. The current machine-readable
inventory (`metadata/articles.yml`) and this snapshot's `ATTRIBUTION.md` are
authoritative for the exact {full_count}-full/{synopsis_count}-synopsis and
{ready_count}-ready/{published_count}-published state.

The Markdown body and `metadata/articles.yml` remain canonical. Generated HTML
must never be treated as editorial source. Regenerate the JSON payload and
checksums with `python scripts/export_content.py`, then validate with
`python scripts/validate_content.py`.

## Licensing

The adapted learning content is licensed under Creative Commons
Attribution-ShareAlike 4.0 International. See `ATTRIBUTION.md` and
`LICENSE-CC-BY-SA-4.0.txt`. Source notices are retained under `provenance/`.
"""
    attribution = f"""# Attribution and provenance

This learning-content snapshot adapts work by the
[cp-algorithms contributors]({snapshot['upstream_repository']}),
published at [cp-algorithms.com](https://cp-algorithms.com/).

- Original repository: `{snapshot['upstream_repository']}`
- Original revision: `{snapshot['upstream_commit']}`
- Original license: Creative Commons Attribution-ShareAlike 4.0 International
- Uzbek adaptation repository: `{adaptation_repository}`
- Imported adaptation revision: `{snapshot['commit']}`
- Adapter: CP.UZ
- Translator recorded by the source metadata: {translator_credit}

## Modifications

CP.UZ translated and adapted the original exposition into Uzbek while retaining
article-level source titles, URLs, paths, revisions, license metadata, formulas,
code samples, images, and external practice references. At the imported
revision, {full_count} of {len(articles)} routes contain full upstream translations and
{synopsis_count} remain synopsis-only. The automated evidence gate marks {ready_count} articles
ready for human review without granting approval. Review metadata is preserved exactly:
{technical_pending} remain pending technical review, {language_pending} remain pending language
review, and {unpublished_count} remain unpublished.

For the new site, the canonical Markdown and metadata were reorganized into a
portable snapshot and deterministic JSON import contract. Exercise statements
are not copied into a local problem bank; the lessons retain outbound references
to their original platforms.

No endorsement by cp-algorithms, its contributors, or any referenced exercise
platform is implied. Adaptations and further distributions must retain
attribution and use the same or a compatible CC BY-SA 4.0 license as required by
the license terms.
"""
    write_text(destination / "README.md", readme)
    write_text(destination / "ATTRIBUTION.md", attribution)


def copy_snapshot(source_root: Path, destination: Path) -> dict[str, Any]:
    """Copy the canonical inputs from an existing cp-uz/algo checkout."""

    required = [
        source_root / "docs",
        source_root / "data" / "articles.yml",
        source_root / "LICENSE",
    ]
    missing = [str(path) for path in required if not path.exists()]
    if missing:
        raise ValueError(f"source checkout is incomplete; missing: {missing}")
    if destination.exists():
        raise FileExistsError(f"destination already exists: {destination}")

    destination.mkdir(parents=True)
    shutil.copytree(source_root / "docs", destination / "articles")
    metadata_root = destination / "metadata"
    for relative in ARTICLE_METADATA_FILES:
        source = source_root / Path(*relative.split("/"))
        if source.is_file():
            target_relative = relative.removeprefix("data/")
            target = metadata_root / Path(*target_relative.split("/"))
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)

    upstream_root = source_root / "upstream"
    if upstream_root.is_dir():
        shutil.copytree(upstream_root, destination / "upstream")

    provenance_root = destination / "provenance"
    provenance_root.mkdir(parents=True, exist_ok=True)
    for relative in PROVENANCE_FILES:
        source = source_root / relative
        if source.is_file():
            shutil.copy2(source, provenance_root / relative)
    shutil.copy2(source_root / "LICENSE", destination / "LICENSE-CC-BY-SA-4.0.txt")

    repo_url = git_value(source_root, "config", "--get", "remote.origin.url", fallback="https://github.com/cp-uz/algo")
    commit = git_value(source_root, "rev-parse", "HEAD", fallback=None)
    commit_date = git_value(source_root, "show", "-s", "--format=%cI", "HEAD", fallback=None)
    upstream_pin = (source_root / "UPSTREAM_PIN").read_text(encoding="utf-8").strip()
    snapshot = {
        "schema": SNAPSHOT_SCHEMA,
        "repository": repo_url,
        "commit": commit,
        "commit_date": commit_date,
        "upstream_repository": "https://github.com/cp-algorithms/cp-algorithms",
        "upstream_commit": upstream_pin,
        "content_license": "CC-BY-SA-4.0",
        "canonical_inputs": ["articles/", "metadata/articles.yml"],
    }
    write_text(destination / "SNAPSHOT.json", stable_json(snapshot))
    write_snapshot_documents(destination, snapshot)
    return snapshot
