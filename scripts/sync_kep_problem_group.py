#!/usr/bin/env python3
"""Snapshot a reviewed KEP.uz problem group into canonical cp.uz problem content."""

from __future__ import annotations

import argparse
import html
import json
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from problem_staging import stage_catalog

API_ROOT = "https://kep.uz/api/problems"
PROBLEM_ROOT = "https://kep.uz/problems"
TST_DAYS = (
    ("day-1", "1-kun", (2318, 2317, 2316)),
    ("day-2", "2-kun", (2321, 2320, 2319)),
    ("day-3", "3-kun", (2324, 2323, 2322)),
    ("day-4", "4-kun", (2327, 2326, 2325)),
)
SLUGS = {
    2316: "temir-rom",
    2317: "deyarli-anagrammalar",
    2318: "yashirin-tartib",
    2319: "vazifalarni-boshqarish",
    2320: "darsxona-partalari",
    2321: "qidiruv-daraxtlari",
    2322: "qoriqchilar",
    2323: "somsa",
    2324: "gladiatorlar",
    2325: "uch-idish",
    2326: "ormon",
    2327: "pleylist",
}


class MarkdownParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.output: list[str] = []
        self.list_depth = 0
        self.in_pre = False
        self.pre_buffer: list[str] = []
        self.in_table = False
        self.table_rows: list[list[str]] = []
        self.current_row: list[str] | None = None
        self.current_cell: list[str] | None = None
        self.link_href = ""

    def emit(self, value: str):
        if self.current_cell is not None:
            self.current_cell.append(value)
        elif self.in_pre:
            self.pre_buffer.append(value)
        else:
            self.output.append(value)

    def newline(self, count: int = 1):
        self.emit("\n" * count)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        attributes = dict(attrs)
        if tag in {"h1", "h2", "h3", "h4"}:
            self.newline(2)
            self.emit("#" * int(tag[1]) + " ")
        elif tag == "p":
            self.newline(2)
        elif tag in {"strong", "b"}:
            self.emit("**")
        elif tag in {"em", "i"}:
            self.emit("_")
        elif tag == "code" and not self.in_pre:
            self.emit("`")
        elif tag == "pre":
            self.newline(2)
            self.in_pre = True
            self.pre_buffer = []
        elif tag in {"ul", "ol"}:
            self.list_depth += 1
            self.newline()
        elif tag == "li":
            self.newline()
            self.emit(f"{'  ' * max(0, self.list_depth - 1)}- ")
        elif tag == "br":
            self.newline()
        elif tag == "a":
            self.link_href = attributes.get("href") or ""
            self.emit("[")
        elif tag == "img":
            src = attributes.get("src") or ""
            alt = attributes.get("alt") or "Rasm"
            if src:
                self.emit(f"![{alt}]({src})")
        elif tag == "table":
            self.in_table = True
            self.table_rows = []
            self.newline(2)
        elif tag == "tr":
            self.current_row = []
        elif tag in {"th", "td"}:
            self.current_cell = []

    def handle_endtag(self, tag: str):
        if tag in {"h1", "h2", "h3", "h4", "p"}:
            self.newline(2)
        elif tag in {"strong", "b"}:
            self.emit("**")
        elif tag in {"em", "i"}:
            self.emit("_")
        elif tag == "code" and not self.in_pre:
            self.emit("`")
        elif tag == "pre":
            code = "".join(self.pre_buffer).strip("\n")
            self.in_pre = False
            self.pre_buffer = []
            self.emit(f"\n\n```cpp\n{code}\n```\n\n")
        elif tag in {"ul", "ol"}:
            self.list_depth = max(0, self.list_depth - 1)
            self.newline()
        elif tag == "li":
            self.newline()
        elif tag == "a":
            self.emit(f"]({self.link_href})" if self.link_href else "]")
            self.link_href = ""
        elif tag in {"th", "td"}:
            cell = re.sub(r"\s+", " ", "".join(self.current_cell or [])).strip()
            if self.current_row is not None:
                self.current_row.append(cell.replace("|", "\\|"))
            self.current_cell = None
        elif tag == "tr":
            if self.current_row:
                self.table_rows.append(self.current_row)
            self.current_row = None
        elif tag == "table":
            self.in_table = False
            if self.table_rows:
                width = max(len(row) for row in self.table_rows)
                rows = [row + [""] * (width - len(row)) for row in self.table_rows]
                self.emit("| " + " | ".join(rows[0]) + " |\n")
                self.emit("| " + " | ".join(["---"] * width) + " |\n")
                for row in rows[1:]:
                    self.emit("| " + " | ".join(row) + " |\n")
            self.table_rows = []
            self.newline(2)

    def handle_data(self, data: str):
        if self.in_table and self.current_cell is None:
            return
        self.emit(data)

    def markdown(self) -> str:
        value = html.unescape("".join(self.output))
        value = value.replace("\r\n", "\n").replace("\r", "\n")
        value = re.sub(r"\\\((.+?)\\\)", r"$\1$", value, flags=re.DOTALL)
        value = re.sub(r"\\\[(.+?)\\\]", r"\n$$\n\1\n$$\n", value, flags=re.DOTALL)
        value = value.replace("\u00a0", " ")
        value = re.sub(r"[ \t]+\n", "\n", value)
        value = re.sub(r"\n{3,}", "\n\n", value)
        return value.strip() + "\n"


def fetch_problem(problem_id: int) -> dict[str, Any]:
    request = urllib.request.Request(
        f"{API_ROOT}/{problem_id}/",
        headers={"Accept": "application/json", "User-Agent": "cp.uz content snapshot/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def statement_markdown(payload: dict[str, Any]) -> str:
    parser = MarkdownParser()
    parser.feed(payload["body"])
    output = parser.markdown()
    samples = payload.get("sampleTests") or []
    if samples:
        output += "\n## Namunalar\n"
        for index, sample in enumerate(samples, start=1):
            output += (
                f"\n### {index}-namuna\n\n**Kirish:**\n\n```text\n{sample['input'].rstrip()}\n```\n"
            )
            output += f"\n**Chiqish:**\n\n```text\n{sample['output'].rstrip()}\n```\n"
    return output


def stable_json(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def write_snapshot(root: Path):
    event_root = root / "2025-2026" / "ioi-2026-saralash-4"
    event_root.mkdir(parents=True, exist_ok=True)
    (event_root / "event.json").write_text(
        stable_json(
            {
                "document_type": "event",
                "schema_version": 1,
                "season_slug": "2025-2026",
                "event_slug": "ioi-2026-saralash-4",
                "sets": [day_slug for day_slug, _title, _ids in TST_DAYS],
            }
        ),
        encoding="utf-8",
        newline="\n",
    )

    for day_order, (day_slug, day_title, problem_ids) in enumerate(TST_DAYS, start=1):
        day_root = event_root / day_slug
        day_root.mkdir(exist_ok=True)
        problem_slugs = [SLUGS[problem_id] for problem_id in problem_ids]
        (day_root / "set.json").write_text(
            stable_json(
                {
                    "document_type": "problem_set",
                    "schema_version": 1,
                    "slug": day_slug,
                    "title": day_title,
                    "description": f"Uzbekistan TST 2026 — {day_title} masalalari.",
                    "order": day_order,
                    "publication_status": "published",
                    "problems": problem_slugs,
                }
            ),
            encoding="utf-8",
            newline="\n",
        )

        for problem_order, problem_id in enumerate(problem_ids, start=1):
            payload = fetch_problem(problem_id)
            slug = SLUGS[problem_id]
            problem_root = day_root / slug
            problem_root.mkdir(exist_ok=True)
            attachments = [
                {
                    "title": item["name"],
                    "url": item["url"],
                    "content_type": item.get("contentType", ""),
                    "size_bytes": item.get("size"),
                    "order": index,
                }
                for index, item in enumerate(payload.get("attachments") or [])
            ]
            problem_url = f"{PROBLEM_ROOT}/{problem_id}"
            problem_document = {
                "document_type": "problem",
                "schema_version": 1,
                "slug": slug,
                "code": chr(64 + problem_order),
                "title": payload["title"],
                "statement_file": "statement.uz.md",
                "translation_status": "original_uzbek",
                "problem_type": "interactive"
                if any(tag["name"] == "Interaktiv masala" for tag in payload.get("tags", []))
                else "standard",
                "time_limit_ms": payload.get("timeLimit"),
                "memory_limit_mb": payload.get("memoryLimit"),
                "max_score": 100,
                "rating": payload.get("problemRating"),
                "difficulty_label": payload.get("difficultyTitle", ""),
                "tags": [tag["name"] for tag in payload.get("tags", [])],
                "order": problem_order,
                "publication_status": "published",
                "last_verified_on": "2026-09-03",
                "links": [
                    {
                        "kind": "original",
                        "title": "KEP.uz’dagi o‘zbekcha shart",
                        "url": problem_url,
                        "platform": "KEP.uz",
                        "is_official": False,
                        "is_primary": True,
                        "order": 0,
                    },
                    {
                        "kind": "practice",
                        "title": "KEP.uz’da ishlash",
                        "url": problem_url,
                        "platform": "KEP.uz",
                        "is_official": False,
                        "is_primary": True,
                        "order": 1,
                    },
                ],
                "attachments": attachments,
            }
            (problem_root / "problem.json").write_text(
                stable_json(problem_document),
                encoding="utf-8",
                newline="\n",
            )
            (problem_root / "statement.uz.md").write_text(
                statement_markdown(payload),
                encoding="utf-8",
                newline="\n",
            )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "tmp" / "candidates" / "ioi-2026-saralash-4",
    )
    args = parser.parse_args()
    stage_catalog(args.output, write_snapshot)
    print("Uzbekistan TST 2026: 4 set va 12 masala canonical contentga yozildi.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
