#!/usr/bin/env python3
"""Import the official reviewed Uzbek IOI 2026 statements into canonical content.

The script intentionally downloads only immutable files from the official IOI task
archive. It requires ``pypdf`` and is a maintainer tool; production reads the
generated files from ``content/problems`` and never depends on the network.
"""

from __future__ import annotations

import argparse
import io
import json
import re
import urllib.request
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader

ARCHIVE_ROOT = "https://raw.githubusercontent.com/ioi/task-archive/master/2026"
OFFICIAL_ROOT = "https://ioinformatics.org/files"
PRACTICE_ROOT = "https://oj.uz/problem/view"
USER_AGENT = "cp-uz-content-sync/1.0"


@dataclass(frozen=True)
class Task:
    day: int
    order: int
    archive_slug: str
    code: str
    title: str
    original_title: str
    problem_type: str
    official_number: int

    @property
    def slug(self) -> str:
        return self.archive_slug.replace("machine", "-machine").replace("city", "-city")


TASKS = (
    Task(1, 1, "ballmachine", "A", "Koptok mashinasi", "Ball Machine", "communication", 1),
    Task(1, 2, "monuments", "B", "Yodgorliklar", "Monuments", "standard", 2),
    Task(1, 3, "tiling", "C", "Plitkalar o‘yini", "Tiling Game", "communication", 3),
    Task(2, 1, "classroom", "D", "Sinf o‘yini", "Classroom Game", "two_step", 4),
    Task(2, 2, "magiccity", "E", "Sehrli shahar", "Magic City", "standard", 5),
    Task(2, 3, "partition", "F", "Bo‘linish", "Partition", "two_step", 6),
)

SECTION_TITLES = {
    "Implementation Details": "Amalga oshirish tafsilotlari",
    "Amalga oshirish tafsilotlari": "Amalga oshirish tafsilotlari",
    "Constraints": "Cheklovlar",
    "Chegaralar": "Chegaralar",
    "Subtasks": "Qism masalalar",
    "Subtasks and Scoring": "Qism masalalar va baholash",
    "Baholash": "Baholash",
    "Example": "Misol",
    "Misol": "Misol",
    "Sample Grader": "Namuna grader",
    "Input format:": "Kiruvchi ma’lumotlar formati",
    "Output format:": "Chiquvchi ma’lumotlar formati",
    "Kiruvchi ma’lumotlar": "Kiruvchi ma’lumotlar",
    "Chiquvchi ma’lumotlar": "Chiquvchi ma’lumotlar",
    "Tushuntirish": "Tushuntirish",
}


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def statement_url(task: Task) -> str:
    return f"{ARCHIVE_ROOT}/day{task.day}/{task.archive_slug}/translations/uz_UZ.pdf"


def clean_pdf_text(
    task: Task,
    payload: bytes,
    source_name: str = "IOI 2026 rasmiy task archive’idagi",
) -> str:
    pages = PdfReader(io.BytesIO(payload)).pages
    raw_lines: list[str] = []
    footer = re.compile(
        rf"^{re.escape(task.archive_slug)}(?:\s+\(\d+ of \d+\)|\s+\d+\s*/\s*\d+\s*-\s*sahifa)$"
    )
    for page_index, page in enumerate(pages):
        lines = (page.extract_text() or "").replace("\u00ad", "").splitlines()
        if page_index == 0:
            lines = lines[4:]
        raw_lines.extend(line for line in lines if not footer.match(line.strip()))

    normalized: list[str] = []
    for raw in raw_lines:
        line = raw.strip().replace("ﬁ", "fi").replace("ﬂ", "fl")
        line = re.sub(r"[ \t]+", " ", line)
        if not line:
            normalized.append("")
            continue
        if re.fullmatch(r"[+=-]+(?:\s+[+=-]+)*", line):
            normalized.append(f"`{line}`")
            continue
        if line.startswith("• "):
            if normalized and normalized[-1] != "" and not normalized[-1].startswith("- "):
                normalized.append("")
            normalized.append(f"- {line[2:]}")
            continue
        heading = SECTION_TITLES.get(line)
        if heading:
            normalized.extend(("", f"## {heading}", ""))
        else:
            normalized.append(line)

    body = "\n".join(normalized)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    return (
        f"> Ushbu shart {source_name} O‘zbekiston delegatsiyasi "
        "tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun "
        "quyidagi rasmiy PDF havolasidan foydalaning.\n\n"
        f"{body}\n"
    )


def dump(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_catalog(output_root: Path) -> None:
    event_root = output_root / "2025-2026" / "ioi-2026"
    dump(
        event_root / "event.json",
        {
            "document_type": "event",
            "schema_version": 1,
            "season_slug": "2025-2026",
            "event_slug": "ioi-2026",
            "sets": ["day-1", "day-2"],
        },
    )

    for day in (1, 2):
        day_tasks = [task for task in TASKS if task.day == day]
        set_root = event_root / f"day-{day}"
        dump(
            set_root / "set.json",
            {
                "document_type": "problem_set",
                "schema_version": 1,
                "slug": f"day-{day}",
                "title": f"{day}-kun",
                "description": f"IOI 2026 — {day}-musobaqa kuni masalalari.",
                "date_label": "11-avgust, 2026" if day == 1 else "13-avgust, 2026",
                "order": day,
                "publication_status": "published",
                "problems": [task.slug for task in day_tasks],
            },
        )

        for task in day_tasks:
            pdf_url = statement_url(task)
            problem_root = set_root / task.slug
            problem_root.mkdir(parents=True, exist_ok=True)
            (problem_root / "statement.uz.md").write_text(
                clean_pdf_text(task, fetch(pdf_url)), encoding="utf-8"
            )
            dump(
                problem_root / "problem.json",
                {
                    "document_type": "problem",
                    "schema_version": 1,
                    "slug": task.slug,
                    "code": task.code,
                    "title": task.title,
                    "original_title": task.original_title,
                    "statement_file": "statement.uz.md",
                    "translation_status": "reviewed_translation",
                    "problem_type": task.problem_type,
                    "max_score": 100,
                    "difficulty_label": "Xalqaro olimpiada",
                    "tags": ["IOI 2026"],
                    "order": task.order,
                    "publication_status": "published",
                    "last_verified_on": "2026-09-03",
                    "links": [
                        {
                            "kind": "original",
                            "title": "IOI’dagi original inglizcha shart",
                            "url": f"{OFFICIAL_ROOT}/ioi2026problem{task.official_number}.pdf",
                            "platform": "IOI",
                            "is_official": True,
                            "is_primary": True,
                            "order": 0,
                        },
                        {
                            "kind": "practice",
                            "title": "OJ.uz’da ishlash",
                            "url": f"{PRACTICE_ROOT}/IOI26_{task.archive_slug}",
                            "platform": "OJ.uz",
                            "is_official": False,
                            "is_primary": True,
                            "order": 1,
                        },
                    ],
                    "attachments": [
                        {
                            "title": "Rasmiy o‘zbekcha statement (PDF)",
                            "url": pdf_url,
                            "content_type": "application/pdf",
                            "order": 0,
                        }
                    ],
                },
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-root",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "content" / "problems",
    )
    args = parser.parse_args()
    write_catalog(args.output_root.resolve())
    print(f"IOI 2026: {len(TASKS)} ta rasmiy o‘zbekcha shart yangilandi.")


if __name__ == "__main__":
    main()
