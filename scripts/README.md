# CP.UZ content pipeline

These scripts synchronize, validate, and export the Uzbek learning material
translated and adapted from cp-algorithms sources.

Requirements: Python 3.12 and the locked backend development requirements.

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
of truth, validates unique four-column concepts and A–Z coverage, and regenerates
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
publication value means the automated import/render evidence passed; the
production importer publishes that lesson while preserving technical and
language review metadata as separate editorial provenance.

`content/exports/articles.v1.json` is deterministic for a given snapshot. Each
entry includes the Markdown body, body/document SHA-256, source revision and
license, translation fidelity, technical/language review records, append-only
review history, publication state, computed workflow stage, and structured
external exercise references.

## Problem statement PDF corpus

The problem catalog renders one canonical PDF per problem. Official individual
statements are mirrored without modification; the two IZhO day booklets are
split into individual problem files. Problems without an official PDF are
exported from the frontend's `?pdf-export=1` print view into A4 documents first.

After those generated files exist under `tmp/generated-statements`, rebuild the
corpus and refresh every `problem.json` record with verified metadata:

```bash
python scripts/build_problem_statement_corpus.py \
  --content-root content/problems \
  --generated-root tmp/generated-statements \
  --output-root tmp/problem-statements-repo \
  --update-content
```

The command downloads official sources, splits IZhO booklets, validates every
PDF, calculates SHA-256, byte size and page count, and writes `manifest.json`.
The output is published in `cp-uz/problem-statements`; `problem.json` files may
only reference that repository's raw URLs. Run `python scripts/export_content.py`
afterward to refresh `content/MANIFEST.sha256`.

## Canonical imports and reviewed releases

The supported commands are `import_content`, `import_seasons` and `import_problems`.
They parse and validate complete source documents before database writes and
apply persistence in transactions. Ready learning articles become public while
technical/language review provenance remains unchanged. Prerequisite edits are
reconciled as sets, including removals, ordering and notes.

The shared `backend/content_tools` package owns problem catalog validation and
whole-snapshot integrity. Article export validation and season parsing live in
their domains' `importing` packages. `content_pipeline.py` is the CLI facade;
`content_io.py` owns portable serialization and filesystem helpers;
`glossary_content.py` owns glossary validation and deterministic metadata output.

After article or glossary edits, run `export_content.py`, then
`release_inventory.py --write`, review the inventory diff, and run
`validate_content.py` plus `release_inventory.py`. Corpus size is reviewed data
in `deploy/content-inventory.json`, not a runtime constant. Initial snapshot
counts in tests remain regression fixtures.

## Upstream problem candidates

IOI, EGOI and KEP synchronizers write a fresh directory under `tmp/candidates` by
default. They refuse existing output directories and canonical content paths.
The complete canonical problem tree is copied to staging, then only the upstream
candidate is refreshed. A network or parsing failure leaves canonical files intact.

Finish/review problem metadata, generate missing print PDFs, and run the PDF
builder against the candidate using `--content-root tmp/candidates/<event>` and
`--update-content`. Official source attachments are retained. Existing official
mirrors can also rebuild without their old attachments: their hash, size and
page count are verified before reuse. Canonical metadata is updated only after
the entire PDF corpus succeeds.

Then promote the reviewed, schema-valid candidate:

```bash
python scripts/promote_problem_catalog.py tmp/candidates/ioi-2026
python scripts/validate_content.py
python scripts/release_inventory.py
```

Promotion validates every event/set/problem, event-level unique problem slugs,
URLs, files and PDF metadata before swapping the problem directory. Checksum and
release inventory updates are rolled back together if publication fails. The
original snapshot is retained under `.cpuz-promote-*` with an explicit recovery
error if filesystem rollback itself fails; automatic cleanup cannot delete it.
The source candidate remains available for review. Publishing generated PDF binaries
to the statement repository remains an explicit separate operation.

## Tests and dependencies

```bash
python -m unittest discover -s scripts -p 'test_*.py' -v
python -m ruff check scripts deploy --config backend/pyproject.toml
```

The standard dev requirements include the PDF corpus test dependency. PDF archive
extraction additionally requires the optional maintainer packages `pymupdf` and
`pymupdf4llm`. Deliberate dependency upgrades use
`python scripts/lock_dependencies.py`, followed by review and CI on Linux.
