from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import tempfile
import urllib.request
from pathlib import Path
from typing import Any

from pypdf import PdfReader, PdfWriter

RAW_BASE_DEFAULT = "https://raw.githubusercontent.com/cp-uz/problem-statements/main"
IZHO_DOWNLOADS = {
    "https://drive.google.com/file/d/1NMunRDjD3087xrS7jCPOIGeg3GPRkoJx/view": (
        "https://drive.usercontent.google.com/download?id=1NMunRDjD3087xrS7jCPOIGeg3GPRkoJx&export=download&confirm=t"
    ),
    "https://drive.google.com/file/d/1a3UJXmzlkspGrXtEFM5UAR2qIcEA5s8x/view": (
        "https://drive.usercontent.google.com/download?id=1a3UJXmzlkspGrXtEFM5UAR2qIcEA5s8x&export=download&confirm=t"
    ),
}
IZHO_PAGE_RANGES = {
    "2025-2026/izho-2026/day-1/fixed-tour": (0, 2),
    "2025-2026/izho-2026/day-1/game": (2, 4),
    "2025-2026/izho-2026/day-1/little-efnesh-and-monitor": (4, 7),
    "2025-2026/izho-2026/day-2/another-turtle-problem": (0, 2),
    "2025-2026/izho-2026/day-2/greedy-arrays": (2, 4),
    "2025-2026/izho-2026/day-2/light-bulbs": (4, 6),
}


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def download_pdf(url: str, target: Path) -> None:
    request = urllib.request.Request(
        IZHO_DOWNLOADS.get(url, url),
        headers={"User-Agent": "cp.uz problem statement corpus builder"},
    )
    with urllib.request.urlopen(request, timeout=120) as response, target.open("wb") as output:
        shutil.copyfileobj(response, output)
    if target.read_bytes()[:4] != b"%PDF":
        raise RuntimeError(f"PDF bo‘lmagan javob olindi: {url}")


def cached_download(url: str, cache_root: Path) -> Path:
    target = cache_root / f"{hashlib.sha256(url.encode()).hexdigest()}.pdf"
    if not target.exists():
        download_pdf(url, target)
    return target


def write_page_range(source: Path, target: Path, start: int, end: int) -> None:
    reader = PdfReader(source)
    if end > len(reader.pages):
        raise RuntimeError(f"{source}: {start + 1}–{end} sahifalar mavjud emas")
    writer = PdfWriter()
    for page_index in range(start, end):
        writer.add_page(reader.pages[page_index])
    with target.open("wb") as output:
        writer.write(output)


def file_metadata(path: Path) -> dict[str, int | str]:
    payload = path.read_bytes()
    return {
        "sha256": hashlib.sha256(payload).hexdigest(),
        "size_bytes": len(payload),
        "page_count": len(PdfReader(path).pages),
    }


def language_for(relative_problem: str) -> str:
    if "/apio-2026/" in relative_problem or "/izho-2026/" in relative_problem:
        return "en"
    return "uz"


def statement_pdf_attachment(data: dict[str, Any]) -> dict[str, Any] | None:
    return next(
        (
            attachment
            for attachment in data.get("attachments", [])
            if attachment.get("content_type", "").lower() == "application/pdf"
        ),
        None,
    )


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def build_corpus(
    content_root: Path,
    generated_root: Path,
    output_root: Path,
    raw_base: str,
    update_content: bool,
) -> list[dict[str, Any]]:
    manifest: list[dict[str, Any]] = []
    problem_files = sorted(content_root.glob("*/*/*/*/problem.json"))
    if not problem_files:
        raise RuntimeError(f"Masala fayllari topilmadi: {content_root}")

    with tempfile.TemporaryDirectory(prefix="cpuz-pdf-cache-") as cache_value:
        cache_root = Path(cache_value)
        for problem_file in problem_files:
            problem_directory = problem_file.parent
            relative_problem = problem_directory.relative_to(content_root).as_posix()
            output_pdf = output_root / relative_problem / "statement.pdf"
            output_pdf.parent.mkdir(parents=True, exist_ok=True)
            data = read_json(problem_file)
            attachment = statement_pdf_attachment(data)

            if attachment:
                source_url = str(attachment["url"])
                downloaded = cached_download(source_url, cache_root)
                if relative_problem in IZHO_PAGE_RANGES:
                    write_page_range(downloaded, output_pdf, *IZHO_PAGE_RANGES[relative_problem])
                else:
                    shutil.copyfile(downloaded, output_pdf)
                provenance = "official"
            else:
                source_pdf = generated_root / relative_problem / "statement.pdf"
                if not source_pdf.is_file():
                    raise RuntimeError(f"Generatsiya qilingan PDF topilmadi: {source_pdf}")
                shutil.copyfile(source_pdf, output_pdf)
                source_url = ""
                provenance = "generated"

            metadata = file_metadata(output_pdf)
            relative_pdf = f"{relative_problem}/statement.pdf"
            pdf_record = {
                "url": f"{raw_base.rstrip('/')}/{relative_pdf}",
                **metadata,
                "language": language_for(relative_problem),
                "provenance": provenance,
            }
            manifest.append(
                {
                    "season": relative_problem.split("/", 1)[0],
                    "event": relative_problem.split("/")[1],
                    "set": relative_problem.split("/")[2],
                    "problem": data["slug"],
                    "title": data["title"],
                    "path": relative_pdf,
                    "source_url": source_url or None,
                    **pdf_record,
                }
            )

            if update_content:
                data["statement_pdf"] = pdf_record
                data["attachments"] = [
                    item
                    for item in data.get("attachments", [])
                    if item.get("content_type", "").lower() != "application/pdf"
                ]
                if not data["attachments"]:
                    data.pop("attachments")
                write_json(problem_file, data)

    write_json(
        output_root / "manifest.json",
        {
            "schema_version": 1,
            "document_type": "problem_statement_manifest",
            "problem_count": len(manifest),
            "statements": manifest,
        },
    )
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Canonical masala PDF corpusini yuklaydi, ajratadi va tekshiradi."
    )
    parser.add_argument(
        "--content-root",
        type=Path,
        default=Path("content/problems"),
    )
    parser.add_argument("--generated-root", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    parser.add_argument("--raw-base", default=RAW_BASE_DEFAULT)
    parser.add_argument("--update-content", action="store_true")
    args = parser.parse_args()

    manifest = build_corpus(
        content_root=args.content_root.resolve(),
        generated_root=args.generated_root.resolve(),
        output_root=args.output_root.resolve(),
        raw_base=args.raw_base,
        update_content=args.update_content,
    )
    official = sum(item["provenance"] == "official" for item in manifest)
    generated = len(manifest) - official
    print(f"PDF corpus tayyor: total={len(manifest)}, official={official}, generated={generated}")


if __name__ == "__main__":
    main()
