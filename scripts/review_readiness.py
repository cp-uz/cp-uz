#!/usr/bin/env python3
"""Assess and explicitly apply CP.UZ automated article-readiness evidence."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import tempfile
from collections import Counter
from datetime import datetime
from pathlib import Path

import yaml
from content_pipeline import (
    READINESS_GATE_VERSION,
    assess_article_readiness,
    build_export,
    export_content,
    load_manifest,
    stable_json,
    validate_checksum_manifest,
    validate_inventory,
    write_checksum_manifest,
    write_text,
)


def parse_timestamp(value: str) -> str:
    normalized = value.replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(normalized)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("--at ISO-8601 sana-vaqt bo‘lishi kerak") from exc
    if parsed.tzinfo is None:
        raise argparse.ArgumentTypeError("--at vaqt mintaqasini ham o‘z ichiga olishi kerak")
    return value


def run_renderer_audit(repository_root: Path, export_payload: dict) -> str:
    with tempfile.TemporaryDirectory(prefix="cpuz-readiness-render-") as temporary:
        export_path = Path(temporary) / "articles.v1.json"
        write_text(export_path, stable_json(export_payload))
        environment = os.environ.copy()
        environment["CPUZ_CONTENT_EXPORT"] = str(export_path)
        completed = subprocess.run(
            ["node", "scripts/audit-markdown.mjs"],
            cwd=repository_root / "frontend",
            env=environment,
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
    output = "\n".join(
        part.strip() for part in (completed.stdout, completed.stderr) if part.strip()
    )
    if completed.returncode:
        raise RuntimeError(f"frontend Markdown renderer audit failed:\n{output}")
    return output


def report_payload(assessments) -> dict:
    failure_reasons = Counter(reason for assessment in assessments for reason in assessment.reasons)
    return {
        "gate_version": READINESS_GATE_VERSION,
        "article_count": len(assessments),
        "ready_count": sum(assessment.ready for assessment in assessments),
        "not_ready_count": sum(not assessment.ready for assessment in assessments),
        "practice_link_count": sum(assessment.practice_link_count for assessment in assessments),
        "failure_reasons": dict(sorted(failure_reasons.items())),
        "not_ready": [assessment.as_dict() for assessment in assessments if not assessment.ready],
    }


def apply_ready_status(content_root: Path, assessments, actor: str, at: str) -> int:
    manifest_path = content_root / "metadata" / "articles.yml"
    manifest = load_manifest(content_root)
    assessments_by_id = {assessment.article_id: assessment for assessment in assessments}
    changed = 0

    for article in manifest["articles"]:
        assessment = assessments_by_id[str(article["id"])]
        if not assessment.ready:
            continue
        publication = article["publication"]
        if publication["status"] == "published":
            continue

        current_event = next(
            (
                event
                for event in reversed(article["review_history"])
                if event.get("event") == "automated_readiness_gate_passed"
                and event.get("gate_version") == READINESS_GATE_VERSION
                and event.get("content_sha256") == assessment.content_sha256
                and event.get("source_commit") == assessment.source_commit
            ),
            None,
        )
        if publication["status"] != "ready":
            publication.update({"status": "ready", "changed_at": at, "changed_by": actor})
            changed += 1
        if not current_event:
            article["review_history"].append(
                {
                    "event": "automated_readiness_gate_passed",
                    "actor": actor,
                    "at": at,
                    "stage": "editorial",
                    "decision": "ready",
                    "gate_version": READINESS_GATE_VERSION,
                    "notes": (
                        "To‘liq tarjima, metadata, manba, tuzilma, ichki havola, asset, "
                        "mashq-paritet va renderer avtomatik tekshiruvlaridan o‘tdi; "
                        "insonning texnik va til tekshiruvi hali alohida talab qilinadi."
                    ),
                    "content_sha256": assessment.content_sha256,
                    "source_commit": assessment.source_commit,
                }
            )

    write_text(
        manifest_path,
        yaml.safe_dump(manifest, allow_unicode=True, sort_keys=False, width=1000),
    )
    return changed


def main() -> int:
    repository_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--content-root", type=Path, default=repository_root / "content")
    parser.add_argument("--report-json", type=Path)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--actor")
    parser.add_argument("--at", type=parse_timestamp)
    args = parser.parse_args()

    if args.apply and (not args.actor or not args.at):
        parser.error("--apply uchun --actor va vaqt mintaqali --at majburiy")

    content_root = args.content_root.resolve()
    validate_inventory(content_root)
    export_payload = build_export(content_root)
    renderer_output = run_renderer_audit(repository_root, export_payload)
    assessments = assess_article_readiness(content_root)
    report = report_payload(assessments)
    report["renderer_audit"] = renderer_output

    if args.report_json:
        write_text(args.report_json.resolve(), stable_json(report))
    print(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True))

    if not args.apply:
        return 0 if report["not_ready_count"] == 0 else 2
    if report["not_ready_count"]:
        raise SystemExit("Readiness qo‘llanmadi: barcha maqolalar gate’dan o‘tishi kerak.")

    tracked_paths = (
        content_root / "metadata" / "articles.yml",
        content_root / "exports" / "articles.v1.json",
        content_root / "MANIFEST.sha256",
    )
    backups = {path: path.read_bytes() if path.is_file() else None for path in tracked_paths}
    try:
        changed = apply_ready_status(content_root, assessments, args.actor, args.at)
        validate_inventory(content_root)
        export_content(content_root)
        write_checksum_manifest(content_root)
        validate_checksum_manifest(content_root)
        final_summary = validate_inventory(content_root)
    except Exception:
        for path, value in backups.items():
            if value is None:
                path.unlink(missing_ok=True)
            else:
                path.write_bytes(value)
        raise

    print(
        "APPLIED "
        f"changed={changed} ready={final_summary['ready_articles']} "
        f"draft={final_summary['draft_articles']} published={final_summary['published_articles']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
