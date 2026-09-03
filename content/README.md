# CP.UZ learning-content snapshot

This directory is the portable source of truth for CP.UZ articles, glossary,
olympiad seasons, events, participant profiles, and their editorial metadata.

## Inventory

- 163 registered Uzbek article routes.
- 163 source-ordered full upstream translations; 0 synopsis-only drafts.
- 163 articles passed the `cpuz.readiness.v1` automated readiness gate and are
  promoted by the backend importer to the public `published` site status.
- 885 external exercise references are extracted deterministically from lesson
  practice sections into the JSON export.
- 0 technical approvals and 0 language approvals. Public availability does not
  claim or replace either human review; correction and review remain open.

## Layout

- `articles/` — canonical translated Markdown and article assets, each linked
  to its exact upstream path and pinned revision.
- `seasons/` — editable season folders with one JSON per event and participant,
  imported directly by Django without a generated aggregate seed;
- `problems/` — season/event/set daraxti, har bir masala uchun JSON metadata va
  o‘zbekcha Markdown shart.
- `metadata/articles.yml` — canonical identity, taxonomy, source, translation,
  upstream, publication, review, hash, and history metadata.
- `metadata/article_difficulties.json` — every article's explicit editorial
  learning level (`beginner`, `intermediate`, or `advanced`). The levels are
  based on prerequisites, proof depth, and implementation complexity rather
  than being inferred from article order or a database default.
- `metadata/schema/articles.schema.json` — upstream metadata schema.
- `upstream/` — pinned English snapshots bundled by the source project.
- `exports/articles.v1.json` — deterministic, backend-neutral import payload.
- `SNAPSHOT.json` — exact repository and upstream revisions.
- `MANIFEST.sha256` — integrity hashes for every file except itself.
- `provenance/` — notices copied unchanged from the source repository.

`provenance/THIRD_PARTY_NOTICES.md` is retained verbatim as historical evidence
and contains an older partial-release count. The current machine-readable
inventory (`metadata/articles.yml`) and this snapshot's `ATTRIBUTION.md` are
authoritative for the exact 163-full/0-synopsis and 163-ready state. The Django
importer is authoritative for the public site release status.

The Markdown body and `metadata/articles.yml` remain canonical. Generated HTML
must never be treated as editorial source. Regenerate the JSON payload and
checksums with `python scripts/export_content.py`, then validate with
`python scripts/validate_content.py`.

## Licensing

The adapted learning content is licensed under Creative Commons
Attribution-ShareAlike 4.0 International. See `ATTRIBUTION.md` and
`LICENSE-CC-BY-SA-4.0.txt`. Source notices are retained under `provenance/`.
