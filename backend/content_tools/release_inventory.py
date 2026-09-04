"""Reviewed source inventory consumed by release verification."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from content_tools.problem_catalog import load_catalog


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def build_inventory(content: Path):
    articles = read(content / "exports/articles.v1.json")["articles"]
    glossary = read(content / "metadata/glossary.json")
    seasons = [read(path) for path in sorted((content / "seasons").glob("*/season.json"))]
    events = [read(path) for path in sorted((content / "seasons").glob("*/events/*.json"))]
    catalog, _ = load_catalog(content / "problems")
    sets = [item for event in catalog for item in event["sets"]]
    problems = [item["data"] for group in sets for item in group["problems"]]
    return {
        "schema": "cpuz.release-inventory.v1",
        "source_manifest_sha256": hashlib.sha256(
            (content / "MANIFEST.sha256").read_bytes()
        ).hexdigest(),
        "counts": {
            "articles": len(articles),
            "published_articles": sum(
                row["publication"]["status"] in {"ready", "published"} for row in articles
            ),
            "root_categories": len({row["category"] for row in articles}),
            "practice_references": sum(len(row["practice_links"]) for row in articles),
            "glossary_terms": len({row["uzbek"] for row in glossary}),
            "seasons": len(seasons),
            "public_seasons": sum(row["publication_status"] == "published" for row in seasons),
            "routes": sum(len(row.get("routes", [])) for row in seasons),
            "events": len(events),
            "public_events": sum(row["publication_status"] == "published" for row in events),
            "edges": sum(len(row.get("edges", row.get("relations", []))) for row in seasons),
            "local_results": sum(
                result.get("is_local", True) for row in events for result in row.get("results", [])
            ),
            "sets": len(sets),
            "public_sets": sum(row["data"]["publication_status"] == "published" for row in sets),
            "problems": len(problems),
            "public_problems": sum(row["publication_status"] == "published" for row in problems),
            "links": sum(len(row["links"]) for row in problems),
            "attachments": sum(len(row.get("attachments", [])) for row in problems),
            "statement_pdfs": sum(bool(row["statement_pdf"]["url"]) for row in problems),
        },
    }


def check_inventory(content, manifest):
    expected = read(manifest)
    current = build_inventory(content)
    if expected != current:
        raise ValueError(
            "Release inventory is stale; regenerate and review deploy/content-inventory.json"
        )
    return expected["counts"]
