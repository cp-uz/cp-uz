"""Validate portable exports before opening a database write transaction."""

import json
from hashlib import sha256

from django.core.management.base import CommandError

from content_tools.integrity import verify_checksums


def validate_export(payload, export_path):
    if payload.get("schema") != "cpuz.learning-content.v1":
        raise CommandError(f"Qo‘llab-quvvatlanmaydigan schema: {payload.get('schema')!r}")

    content_root = export_path.parent.parent.resolve()
    snapshot = payload.get("source_snapshot") or {}
    license_meta = payload.get("license") or {}
    required_snapshot = (
        "schema",
        "commit",
        "repository",
        "upstream_commit",
        "upstream_repository",
        "content_license",
    )
    missing_snapshot = [key for key in required_snapshot if not snapshot.get(key)]
    if missing_snapshot:
        raise CommandError(f"Snapshot metadata yetishmaydi: {', '.join(missing_snapshot)}")
    if license_meta.get("content") != snapshot.get("content_license"):
        raise CommandError("Export license va snapshot license qiymatlari mos emas.")

    required_files = [
        content_root / str(license_meta.get("license_file", "")),
        content_root / str(license_meta.get("attribution_file", "")),
        content_root / "MANIFEST.sha256",
        content_root / "SNAPSHOT.json",
        content_root / "provenance" / "UPSTREAM_PIN",
    ]
    missing_files = [str(path) for path in required_files if not path.is_file()]
    if missing_files:
        raise CommandError(f"Provenance fayllari yetishmaydi: {', '.join(missing_files)}")

    pin = (content_root / "provenance" / "UPSTREAM_PIN").read_text(encoding="utf-8").strip()
    if pin != snapshot["upstream_commit"]:
        raise CommandError("UPSTREAM_PIN snapshot upstream commit bilan mos emas.")

    snapshot_file = json.loads((content_root / "SNAPSHOT.json").read_text(encoding="utf-8"))
    if snapshot_file != snapshot:
        raise CommandError("SNAPSHOT.json export source_snapshot bilan mos emas.")

    rows = payload["articles"]
    for field in ("id", "path", "route"):
        values = [row.get(field) for row in rows]
        if any(not value for value in values) or len(set(values)) != len(values):
            raise CommandError(f"Maqolalarning '{field}' qiymatlari bo‘sh yoki takrorlangan.")

    for row in rows:
        document_hash = str(row.get("document_sha256") or "")
        if len(document_hash) != 64:
            raise CommandError(f"document_sha256 mavjud emas: {row['id']}")
        markdown_file = (content_root / str(row.get("markdown_file") or "")).resolve()
        if not markdown_file.is_relative_to(content_root) or not markdown_file.is_file():
            raise CommandError(f"Maqola hujjati topilmadi yoki xavfli: {row['id']}")
        normalized = markdown_file.read_text(encoding="utf-8")
        actual_document_hash = sha256(normalized.encode("utf-8")).hexdigest()
        if actual_document_hash != document_hash:
            raise CommandError(f"document_sha256 mos emas: {row['id']}")

    verify_manifest(content_root)


def verify_manifest(content_root):
    try:
        verify_checksums(content_root)
    except (OSError, ValueError) as exc:
        raise CommandError(f"MANIFEST: {exc}") from exc
