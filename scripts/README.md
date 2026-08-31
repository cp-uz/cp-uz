# CP.UZ content pipeline

These scripts migrate the learning material only. They do not create a problem
bank, judge, contest, or training subsystem.

Requirements: Python 3.11+ and `PyYAML>=6,<7`.

## Reproduce the checked-in snapshot

Use an exact commit when refreshing production content:

```bash
python scripts/sync_cpuz_algo.py \
  --ref f0b048b6c6228433ffa7d7fd82bf5139a0ae7125 \
  --destination content-next
python scripts/validate_content.py --content-root content-next
```

The sync command refuses to overwrite an existing directory. This makes the
reviewed `content/` snapshot immutable by default and avoids silently deleting
local editorial work.

To regenerate the backend-neutral export after an intentional content edit:

```bash
python scripts/export_content.py
python scripts/validate_content.py
```

The same command treats `content/articles/glossary.md` as the glossary source
of truth, validates exactly 174 unique four-column concepts, and regenerates
`content/metadata/glossary.json`, `.yml`, and `.csv` before refreshing the
checksum manifest. Each generated row contains `source`, `uzbek`, `note`, and
an additional `aliases` string list.

## Automated readiness gate

`review_readiness.py` is report-only unless `--apply` is passed. It validates
all 163 Markdown documents, full-translation metadata, pinned-source structure
where a source snapshot is bundled, internal links, local assets, extracted
practice-link parity, heading parsing, KaTeX, and the production Markdown
adapter:

```bash
python scripts/review_readiness.py
python scripts/review_readiness.py --apply \
  --actor cpuz-readiness-gate \
  --at 2026-08-31T17:47:56+05:00
```

Apply mode is all-or-nothing and records the gate version, content hash, pinned
source commit, actor, and timestamp in append-only `review_history`. A `ready`
publication value means the automated import/render evidence passed and maps to
Django `in_review`; it does **not** create a technical or language approval and
does not publish an article. Only current human approvals for both stages may
produce Django `published` status.

`content/exports/articles.v1.json` is deterministic for a given snapshot. Each
entry includes the Markdown body, body/document SHA-256, source revision and
license, translation fidelity, technical/language review records, append-only
review history, publication state, computed workflow stage, and structured
external exercise references.

## Django management-command contract

The future backend should expose an idempotent command with this interface:

```text
python manage.py import_learning_content \
  content/exports/articles.v1.json \
  --checksum-manifest content/MANIFEST.sha256 \
  --dry-run
```

Importer requirements:

1. Verify `MANIFEST.sha256`, export schema `cpuz.learning-content.v1`, all
   `content_sha256` values, unique stable article IDs, paths, and routes before
   opening a write transaction.
2. Upsert articles by stable `id`; never key identity from a mutable title.
3. Store canonical Markdown without converting it to HTML. Rendered/sanitized
   HTML is a cache and may be rebuilt.
4. Preserve `source`, `translation`, `upstream`, `reviews`, `review_history`, and
   `publication` exactly. Map automated `ready` to `in_review`; never turn
   `pending` into an approval or publish without both current human approvals.
5. Replace practice-reference child rows for one article as a set keyed by URL.
   They are outbound lesson references only; do not fetch or copy statements.
6. Apply the whole import in one database transaction. Any failed hash, stale
   review invariant, or duplicate must roll back the complete run.
7. A second import of the same export must produce zero semantic changes.
8. Keep the attribution and CC BY-SA link visible on every adapted article and
   on a site-wide attribution page.

Suggested command output is a dry-run/import summary with created, updated,
unchanged, rejected, and practice-link counts. The contract deliberately avoids
specific Django model or app names so the content snapshot remains portable.
