#!/usr/bin/env python3
"""Import EGOI 2026's official reviewed Uzbek statements into content/problems."""

from __future__ import annotations

import argparse
import io
import json
import re
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader
from sync_ioi_2026_archive import clean_pdf_text, fetch

REPOSITORY_ROOT = "https://raw.githubusercontent.com/egoi-org/egoi-2026/main"
OFFICIAL_ROOT = "https://egoi2026.it/competition/problems"


@dataclass(frozen=True)
class Task:
    day: int
    order: int
    archive_slug: str
    code: str
    title: str
    original_title: str
    problem_type: str = "standard"
    sample_count: int = 0

    @property
    def slug(self) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", "-", self.archive_slug).lower()


TASKS = (
    Task(1, 1, "ferriswheel", "A", "Charxpalak", "Ferris Wheel", sample_count=5),
    Task(1, 2, "ovenmasters", "B", "Pech ustalari", "Ovenmasters", sample_count=6),
    Task(1, 3, "biscuits", "C", "Pechenyelar", "Biscuits", sample_count=5),
    Task(1, 4, "census", "D", "Ro‘yxatga olish", "Census", "communication"),
    Task(
        2,
        1,
        "wateringplants",
        "E",
        "O‘simliklarni sug‘orish",
        "Watering Plants",
        sample_count=4,
    ),
    Task(2, 2, "cakes", "F", "Tortlar", "Cakes", sample_count=3),
    Task(2, 3, "foxfamilies", "G", "Tulki oilalari", "Fox Families", sample_count=3),
    Task(2, 4, "seatingplan", "H", "O‘tirish rejasi", "Seating Plan", "communication"),
)


def statement_url(task: Task) -> str:
    return f"{REPOSITORY_ROOT}/day{task.day}/{task.archive_slug}/statement/uz_UZ.pdf"


def parse_limits(payload: bytes) -> tuple[int | None, int | None]:
    text = PdfReader(io.BytesIO(payload)).pages[0].extract_text() or ""
    time_match = re.search(r"Vaqt cheklovi:\s*([\d.,]+)\s*soniya", text)
    memory_match = re.search(r"Xotira cheklovi:\s*(\d+)\s*MiB", text)
    time_limit = (
        round(float(time_match.group(1).replace(",", ".")) * 1000)
        if time_match
        else None
    )
    memory_limit = int(memory_match.group(1)) if memory_match else None
    return time_limit, memory_limit


def dump(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def practice_url(task: Task) -> str:
    if task.archive_slug == "census":
        return "https://qoj.ac/problem/18250"
    return f"https://oj.uz/problem/view/EGOI26_{task.archive_slug}"


def replace_standard_examples(markdown: str, task: Task) -> str:
    if not task.sample_count:
        return markdown

    examples = ["## Misollar"]
    for index in range(task.sample_count):
        root = f"{REPOSITORY_ROOT}/day{task.day}/{task.archive_slug}/statement"
        sample_input = (
            fetch(f"{root}/{task.archive_slug}.input{index}.txt")
            .decode("utf-8")
            .strip()
        )
        sample_output = (
            fetch(f"{root}/{task.archive_slug}.output{index}.txt")
            .decode("utf-8")
            .strip()
        )
        examples.extend(
            (
                "",
                f"### {index + 1}-misol",
                "",
                "**Kiruvchi ma’lumotlar**",
                "",
                "```text",
                sample_input,
                "```",
                "",
                "**Chiquvchi ma’lumotlar**",
                "",
                "```text",
                sample_output,
                "```",
            )
        )

    replacement = "\n".join(examples).rstrip()
    return (
        re.sub(
            r"(?ms)^## Misollar\s*.*?(?=^## |\Z)",
            replacement + "\n\n",
            markdown,
            count=1,
        ).rstrip()
        + "\n"
    )


def write_catalog(output_root: Path) -> None:
    event_root = output_root / "2025-2026" / "egoi-2026"
    dump(
        event_root / "event.json",
        {
            "document_type": "event",
            "schema_version": 1,
            "season_slug": "2025-2026",
            "event_slug": "egoi-2026",
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
                "description": f"EGOI 2026 — {day}-musobaqa kuni masalalari.",
                "date_label": "14-may, 2026" if day == 1 else "16-may, 2026",
                "order": day,
                "publication_status": "published",
                "problems": [task.slug for task in day_tasks],
            },
        )

        for task in day_tasks:
            pdf_url = statement_url(task)
            pdf = fetch(pdf_url)
            time_limit, memory_limit = parse_limits(pdf)
            problem_root = set_root / task.slug
            problem_root.mkdir(parents=True, exist_ok=True)
            statement = clean_pdf_text(
                task,
                pdf,
                source_name="EGOI 2026 rasmiy repozitoriysidagi",
            )
            (problem_root / "statement.uz.md").write_text(
                replace_standard_examples(statement, task),
                encoding="utf-8",
                newline="\n",
            )
            problem = {
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
                "tags": ["EGOI 2026"],
                "order": task.order,
                "publication_status": "published",
                "last_verified_on": "2026-09-03",
                "links": [
                    {
                        "kind": "original",
                        "title": "EGOI’dagi original inglizcha shart",
                        "url": f"{OFFICIAL_ROOT}/{task.archive_slug}.pdf",
                        "platform": "EGOI",
                        "is_official": True,
                        "is_primary": True,
                        "order": 0,
                    },
                    {
                        "kind": "practice",
                        "title": "Onlayn judge’da ishlash",
                        "url": practice_url(task),
                        "platform": "QOJ" if task.archive_slug == "census" else "OJ.uz",
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
            }
            if time_limit:
                problem["time_limit_ms"] = time_limit
            if memory_limit:
                problem["memory_limit_mb"] = memory_limit
            dump(problem_root / "problem.json", problem)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-root",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "content" / "problems",
    )
    args = parser.parse_args()
    write_catalog(args.output_root.resolve())
    print(f"EGOI 2026: {len(TASKS)} ta rasmiy o‘zbekcha shart yangilandi.")


if __name__ == "__main__":
    main()
