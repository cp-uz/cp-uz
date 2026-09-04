from __future__ import annotations

import sys
import tempfile
import unittest
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from content_pipeline import (
    EXPORT_SCHEMA,
    GLOSSARY_REQUIRED_INITIALS,
    READINESS_GATE_VERSION,
    ReadinessAssessment,
    assess_article_readiness,
    build_export,
    disallowed_control_characters,
    extract_practice_links,
    load_article_difficulties,
    load_e_maxx_sources,
    load_glossary,
    load_manifest,
    parse_glossary_markdown,
    split_document,
    stable_json,
    validate_checksum_manifest,
    validate_inventory,
)
from problem_content import validate_problem_inventory
from review_readiness import apply_ready_status

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"


class ContentPipelineTests(unittest.TestCase):
    def test_front_matter_body_hash_boundary_is_preserved(self) -> None:
        document = split_document("---\narticle_id: algebra--sample\n---\n# Namuna\n")
        self.assertEqual(document.article_id, "algebra--sample")
        self.assertEqual(document.body, "# Namuna\n")

    def test_uzbek_practice_heading_variants_are_extracted(self) -> None:
        body = """# Dars

## Mashq masalalari

- [A](https://codeforces.com/problemset/problem/1/A)

## Keyingi bo‘lim

- [Ignored](https://example.com/not-practice)

## Masala misollari

- [B](https://atcoder.jp/contests/abc001/tasks/abc001_1) — boshlang‘ich
"""
        links = extract_practice_links(body)
        self.assertEqual([item["title"] for item in links], ["A", "B"])
        self.assertEqual([item["platform"] for item in links], ["Codeforces", "AtCoder"])
        self.assertEqual(links[1]["note"], "boshlang‘ich")

    def test_checked_in_snapshot_contract(self) -> None:
        summary = validate_inventory(CONTENT)
        self.assertEqual(summary["articles"], 163)
        self.assertEqual(summary["full_translations"], 163)
        self.assertEqual(summary["synopsis_drafts"], 0)
        self.assertEqual(summary["practice_links"], 885)
        self.assertEqual(summary["articles_with_source_sha256"], 49)
        self.assertEqual(summary["ready_articles"], 163)
        self.assertEqual(summary["draft_articles"], 0)
        self.assertEqual(summary["published_articles"], 0)
        self.assertGreaterEqual(summary["glossary_concepts"], 120)
        export = build_export(CONTENT)
        self.assertEqual(export["schema"], EXPORT_SCHEMA)
        self.assertEqual(len(export["articles"]), 163)
        self.assertEqual(
            summary["article_difficulties"],
            {"advanced": 38, "beginner": 58, "intermediate": 67},
        )
        self.assertEqual(
            {article["difficulty"] for article in export["articles"]},
            {"beginner", "intermediate", "advanced"},
        )
        self.assertTrue(all(article["content_sha256"] for article in export["articles"]))
        self.assertTrue(
            all(article["publication"]["status"] == "ready" for article in export["articles"])
        )
        self.assertTrue(
            all(
                article["workflow_stage"] == "technical_review_pending"
                for article in export["articles"]
            )
        )
        self.assertTrue(
            all(
                article["effective_reviews"] == {"technical": "pending", "language": "pending"}
                for article in export["articles"]
            )
        )

    def test_checked_in_export_is_current_and_deterministic(self) -> None:
        expected = stable_json(build_export(CONTENT))
        checked_in = (CONTENT / "exports" / "articles.v1.json").read_text(encoding="utf-8")
        self.assertEqual(checked_in, expected)

    def test_export_is_learning_content_only(self) -> None:
        export = build_export(CONTENT)
        self.assertEqual(
            set(export),
            {"schema", "source_snapshot", "counts", "license", "articles"},
        )
        forbidden_structural_keys = {
            "problem_bank",
            "problem_statement",
            "judge",
            "submissions",
            "verdicts",
            "contests",
            "training",
        }
        article_keys = set(export["articles"][0])
        self.assertTrue(forbidden_structural_keys.isdisjoint(article_keys))
        self.assertTrue(
            all(
                set(article) == article_keys and forbidden_structural_keys.isdisjoint(article)
                for article in export["articles"]
            )
        )

    def test_difficulty_metadata_covers_each_article_exactly_once(self) -> None:
        manifest = load_manifest(CONTENT)
        difficulties = load_article_difficulties(CONTENT)
        self.assertEqual(set(difficulties), {article["id"] for article in manifest["articles"]})
        self.assertEqual(
            Counter(difficulties.values()),
            Counter({"beginner": 58, "intermediate": 67, "advanced": 38}),
        )

    def test_e_maxx_sources_are_upstream_confirmed_and_exported(self) -> None:
        sources = load_e_maxx_sources(CONTENT)
        self.assertEqual(len(sources), 127)
        self.assertTrue(all(url.startswith("http://e-maxx.ru/algo/") for url in sources.values()))

        exported = {article["id"]: article for article in build_export(CONTENT)["articles"]}
        for article_id, url in sources.items():
            self.assertEqual(exported[article_id]["source"]["russian_url"], url)
        self.assertNotIn(
            "russian_url",
            exported["dynamic_programming--intro-to-dp"]["source"],
        )

    def test_practice_links_exclude_explanatory_references(self) -> None:
        export = build_export(CONTENT)
        links = [link for article in export["articles"] for link in article["practice_links"]]
        self.assertEqual(len(links), 885)
        self.assertFalse(any("wikipedia.org" in link["url"] for link in links))
        self.assertFalse(any("e-maxx.ru" in link["url"] for link in links))
        self.assertFalse(any(link["note"] == '"' for link in links))

    def test_all_articles_pass_objective_readiness_without_fake_approval(self) -> None:
        assessments = assess_article_readiness(CONTENT)
        self.assertEqual(len(assessments), 163)
        self.assertTrue(all(assessment.ready for assessment in assessments))
        self.assertEqual(sum(item.practice_link_count for item in assessments), 885)

        manifest = load_manifest(CONTENT)
        for article in manifest["articles"]:
            self.assertEqual(article["reviews"]["technical"]["status"], "pending")
            self.assertEqual(article["reviews"]["language"]["status"], "pending")
            self.assertTrue(
                any(
                    event.get("event") == "automated_readiness_gate_passed"
                    and event.get("gate_version") == READINESS_GATE_VERSION
                    for event in article["review_history"]
                )
            )

    def test_readiness_apply_is_idempotent(self) -> None:
        with tempfile.TemporaryDirectory(prefix="cpuz-ready-test-") as value:
            root = Path(value)
            metadata = root / "metadata"
            metadata.mkdir()
            (metadata / "articles.yml").write_text(
                """schema_version: 2
articles:
- id: algebra--sample
  path: algebra/sample.md
  source:
    commit: 0000000000000000000000000000000000000000
  publication:
    status: draft
    changed_at: null
    changed_by: null
  review_history: []
""",
                encoding="utf-8",
            )
            assessment = ReadinessAssessment(
                article_id="algebra--sample",
                path="algebra/sample.md",
                ready=True,
                reasons=(),
                content_sha256="a" * 64,
                source_commit="0" * 40,
                word_count=200,
                heading_count=3,
                practice_link_count=0,
            )
            first = apply_ready_status(
                root,
                [assessment],
                "test-gate",
                "2026-08-31T17:47:56+05:00",
            )
            second = apply_ready_status(
                root,
                [assessment],
                "test-gate",
                "2026-08-31T17:47:56+05:00",
            )
            result = load_manifest(root)["articles"][0]
            self.assertEqual((first, second), (1, 0))
            self.assertEqual(result["publication"]["status"], "ready")
            self.assertEqual(len(result["review_history"]), 1)

    def test_canonical_markdown_has_no_replacement_characters(self) -> None:
        article_files = list((CONTENT / "articles").rglob("*.md"))
        self.assertTrue(article_files)
        self.assertTrue(
            all("\ufffd" not in path.read_text(encoding="utf-8") for path in article_files)
        )
        self.assertTrue(
            all(
                not disallowed_control_characters(path.read_text(encoding="utf-8"))
                for path in article_files
            )
        )
        self.assertEqual(disallowed_control_characters("safe\tline\n"), [])
        self.assertEqual(disallowed_control_characters("broken\b"), ["\b"])

    def test_glossary_is_production_ready(self) -> None:
        rows = load_glossary(CONTENT)
        self.assertEqual(len(rows), 174)
        self.assertEqual(len(rows), len({row["source"].casefold() for row in rows}))
        self.assertEqual(len(rows), len({row["uzbek"].casefold() for row in rows}))
        self.assertEqual(
            {row["source"][0].upper() for row in rows},
            set(GLOSSARY_REQUIRED_INITIALS),
        )
        self.assertTrue(all(row["note"].endswith((".", "!", "?")) for row in rows))
        segment_tree = next(row for row in rows if row["source"] == "Segment Tree")
        self.assertEqual(segment_tree["uzbek"], "Segment daraxti")
        self.assertIn("Kesma daraxti", segment_tree["aliases"])
        sport_programming = next(row for row in rows if row["source"] == "Competitive Programming")
        self.assertEqual(sport_programming["uzbek"], "Sport dasturlash")
        euclidean_algorithm = next(row for row in rows if row["source"] == "Euclidean Algorithm")
        self.assertEqual(euclidean_algorithm["uzbek"], "Evklid algoritmi")
        self.assertNotIn("Yevklid", " ".join(euclidean_algorithm["aliases"]))

    def test_glossary_parser_rejects_alias_owned_by_another_concept(self) -> None:
        canonical = (CONTENT / "articles" / "glossary.md").read_text(encoding="utf-8")
        poisoned = canonical.replace("| Algorithm | Algoritm |", "| Algorithm | Graph |", 1)
        with self.assertRaisesRegex(ValueError, "already owned"):
            parse_glossary_markdown(poisoned)

    def test_glossary_parser_requires_every_english_initial(self) -> None:
        canonical = (CONTENT / "articles" / "glossary.md").read_text(encoding="utf-8")
        missing_j = canonical.replace("| Judge |", "| Automated Judge System |", 1)
        with self.assertRaisesRegex(ValueError, "missing: J"):
            parse_glossary_markdown(missing_j)

    def test_glossary_parser_rejects_duplicate_english_concepts(self) -> None:
        sample = """# Lug‘at

| English | O‘zbekcha | Izoh | Qidiruv aliaslari |
|---|---|---|---|
| Competitive Programming | Sport dasturlash | Algoritmik sport yo‘nalishi. | CP |
| Segment Tree | Segment daraxti | Oraliq so‘rovlarini tez bajaradi. | Kesma daraxti |
| Segment Tree | Boshqa Nom | Takror yozilgan atama. |  |
"""
        with self.assertRaisesRegex(ValueError, "duplicate English concept"):
            parse_glossary_markdown(sample)

    def test_checked_in_manifest(self) -> None:
        validate_checksum_manifest(CONTENT)

    def test_problem_catalog_is_file_granular_and_complete(self) -> None:
        self.assertEqual(
            validate_problem_inventory(CONTENT),
            {
                "problem_events": 6,
                "problem_sets": 15,
                "problems": 47,
                "problem_links": 82,
                "problem_attachments": 12,
                "problem_statement_pdfs": 47,
            },
        )

    def test_checksum_manifest_rejects_duplicate_paths(self) -> None:
        with tempfile.TemporaryDirectory(prefix="cpuz-manifest-test-") as value:
            root = Path(value)
            (root / "sample.txt").write_text("sample\n", encoding="utf-8")
            digest = "0" * 64
            (root / "MANIFEST.sha256").write_text(
                f"{digest}  sample.txt\n{digest}  sample.txt\n",
                encoding="utf-8",
            )
            with self.assertRaisesRegex(ValueError, "duplicate checksum path"):
                validate_checksum_manifest(root)


if __name__ == "__main__":
    unittest.main()
