import json
import math
import shutil
from collections import Counter
from datetime import datetime
from hashlib import sha256
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.db.models import Max
from django.utils.dateparse import parse_datetime
from django.utils.text import slugify

from apps.articles.importing.prerequisites import reconcile_prerequisites
from apps.articles.importing.validation import validate_export, verify_manifest
from apps.articles.models import (
    Article,
    ArticleContributor,
    ArticleRevision,
    Category,
    ExternalPracticeReference,
    GlossaryTerm,
    Tag,
)
from apps.contributions.models import ReviewRecord

CATEGORY_STYLE = {
    "algebra": ("solar:calculator-minimalistic-bold", "#7C3AED"),
    "data-structures": ("solar:database-bold", "#2563EB"),
    "dynamic-programming": ("solar:layers-bold", "#0891B2"),
    "geometry": ("solar:ruler-angular-bold", "#EA580C"),
    "graphs": ("solar:graph-up-bold", "#16A34A"),
    "string-processing": ("solar:text-field-focus-bold", "#DB2777"),
    "combinatorics": ("solar:infinity-bold", "#9333EA"),
    "linear-algebra": ("solar:widget-5-bold", "#4F46E5"),
    "numerical-methods": ("solar:chart-square-bold", "#0284C7"),
    "miscellaneous": ("solar:box-minimalistic-bold", "#475569"),
}

PLATFORM_MAP = {
    "codeforces": ExternalPracticeReference.Platform.CODEFORCES,
    "atcoder": ExternalPracticeReference.Platform.ATCODER,
    "cses": ExternalPracticeReference.Platform.CSES,
    "kattis": ExternalPracticeReference.Platform.KATTIS,
    "spoj": ExternalPracticeReference.Platform.SPOJ,
    "leetcode": ExternalPracticeReference.Platform.LEETCODE,
    "kep.uz": ExternalPracticeReference.Platform.KEP,
    "kep": ExternalPracticeReference.Platform.KEP,
}

REVIEW_DECISIONS = {
    "approved": ReviewRecord.Decision.APPROVED,
    "changes_requested": ReviewRecord.Decision.CHANGES_REQUESTED,
    "rejected": ReviewRecord.Decision.REJECTED,
}


def article_status_from_export(row):
    """Map editorial readiness without inventing publication or review approval."""

    publication_status = (row.get("publication") or {}).get("status", "draft")
    if publication_status == "draft":
        return Article.Status.DRAFT
    if publication_status == "ready":
        # The readiness gate is the release boundary for the public learning site.
        # Human technical/language review remains visible in provenance and does not
        # get fabricated merely because the lesson is now publicly available.
        return Article.Status.PUBLISHED
    if publication_status == "deprecated":
        return Article.Status.ARCHIVED
    if publication_status != "published":
        raise CommandError(f"Noma’lum publication status: {publication_status!r}")

    effective_reviews = row.get("effective_reviews") or {}
    if (
        effective_reviews.get("technical") != "approved"
        or effective_reviews.get("language") != "approved"
        or row.get("workflow_stage") != "published"
    ):
        raise CommandError(
            f"{row.get('id', '<unknown>')}: published holati joriy texnik va til "
            "tasdiqlarini talab qiladi."
        )
    return Article.Status.PUBLISHED


def article_difficulty_from_export(row):
    """Require the canonical editorial level instead of a model default."""

    value = row.get("difficulty")
    if value not in Article.Difficulty.values:
        raise CommandError(f"{row.get('id', '<unknown>')}: noto‘g‘ri difficulty qiymati: {value!r}")
    return value


class Command(BaseCommand):
    help = "cp-uz content snapshotini idempotent ravishda bilim bazasiga import qiladi."

    def add_arguments(self, parser):
        parser.add_argument("--path", required=True, help="articles.v1.json fayli")
        parser.add_argument(
            "--assets-root",
            help="Rasmlar joylashgan articles/ katalogi; default: export yonidagi ../articles",
        )
        parser.add_argument("--skip-assets", action="store_true")
        parser.add_argument("--skip-glossary", action="store_true")
        parser.add_argument(
            "--glossary-path",
            help="Glossary JSON fayli; default: export yonidagi ../metadata/glossary.json",
        )
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **options):
        export_path = Path(options["path"]).expanduser().resolve()
        if not export_path.is_file():
            raise CommandError(f"Export topilmadi: {export_path}")

        try:
            payload = json.loads(export_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise CommandError(f"Export o‘qilmadi: {exc}") from exc

        rows = payload.get("articles")
        if not isinstance(rows, list):
            raise CommandError("Noto‘g‘ri export: 'articles' ro‘yxati mavjud emas.")
        declared_count = payload.get("counts", {}).get("articles")
        if declared_count is not None and declared_count != len(rows):
            raise CommandError(f"Export soni mos emas: counts={declared_count}, rows={len(rows)}")
        self._validate_export(payload, export_path)

        stats = Counter()
        source_snapshot = payload.get("source_snapshot", {})
        with transaction.atomic():
            article_map = self._import_articles(rows, source_snapshot, stats)
            self._import_prerequisites(rows, article_map, stats)
            if not options["skip_glossary"]:
                glossary_path = (
                    Path(options["glossary_path"]).expanduser().resolve()
                    if options["glossary_path"]
                    else export_path.parent.parent / "metadata" / "glossary.json"
                )
                self._import_glossary(glossary_path.resolve(), stats)
            if not options["skip_assets"]:
                assets_root = (
                    Path(options["assets_root"]).expanduser().resolve()
                    if options["assets_root"]
                    else export_path.parent.parent / "articles"
                )
                self._copy_assets(assets_root.resolve(), stats, dry_run=options["dry_run"])
            if options["dry_run"]:
                transaction.set_rollback(True)

        if not options["dry_run"]:
            cache.delete("public-knowledge-stats-v1")

        mode = "DRY RUN" if options["dry_run"] else "IMPORT"
        details = ", ".join(f"{key}={value}" for key, value in sorted(stats.items()))
        self.stdout.write(self.style.SUCCESS(f"{mode} tugadi: {details}"))

    def _import_articles(self, rows, source_snapshot, stats):
        article_map = {}
        for row in rows:
            self._validate_row(row)
            category = self._category_for(row, stats)
            markdown = row["markdown"]
            expected_hash = row.get("content_sha256")
            actual_hash = sha256(markdown.encode("utf-8")).hexdigest()
            if expected_hash and expected_hash != actual_hash:
                raise CommandError(f"Kontent hash mos emas: {row['id']}")

            translation = row.get("translation") or {}
            source = row.get("source") or {}
            publication = row.get("publication") or {}
            canonical_path = (row.get("public_path") or row.get("path", "")).strip("/")
            if canonical_path.endswith(".md"):
                canonical_path = canonical_path[:-3]
            title = translation.get("title") or source.get("title") or row["id"]
            summary = translation.get("idea") or self._first_paragraph(markdown)
            subtitle = (translation.get("complexity") or "")[:300]
            status = article_status_from_export(row)
            difficulty = article_difficulty_from_export(row)

            article, created = Article.objects.get_or_create(
                slug=row["id"],
                defaults={
                    "title": title,
                    "summary": summary,
                    "content": markdown,
                    "category": category,
                    "canonical_path": canonical_path,
                },
            )
            old_hash = article.content_hash if not created else None
            article.title = title
            article.subtitle = subtitle
            article.summary = summary
            article.content = markdown
            article.category = category
            article.canonical_path = canonical_path
            article.content_path = row.get("path") or row.get("markdown_file", "").removeprefix(
                "articles/"
            )
            article.status = status
            article.visibility = Article.Visibility.PUBLIC
            article.difficulty = difficulty
            article.language = "uz-latn"
            article.estimated_reading_minutes = max(1, math.ceil(len(markdown.split()) / 200))
            article.order = int(row.get("index") or 0)
            article.source_url = source.get("url") or ""
            article.source_repository = source.get("repo") or ""
            article.source_path = source.get("file") or ""
            article.source_commit = source.get("commit") or ""
            article.content_license = source.get("license") or payload_license(source_snapshot)
            article.seo_title = title[:70]
            article.seo_description = summary[:170]
            article.provenance = {
                "snapshot": source_snapshot,
                "translation": translation,
                "source": source,
                "upstream": row.get("upstream") or {},
                "publication": publication,
                "reviews": row.get("reviews") or {},
                "effective_reviews": row.get("effective_reviews") or {},
                "workflow_stage": row.get("workflow_stage"),
                "document_sha256": row.get("document_sha256"),
            }
            if status == Article.Status.PUBLISHED:
                article.published_at = self._parse_datetime(publication.get("changed_at"))
            else:
                article.published_at = None
            article.save()

            stats["articles_created" if created else "articles_updated"] += 1
            if created or old_hash != article.content_hash:
                version = (
                    ArticleRevision.objects.filter(article=article).aggregate(max=Max("version"))[
                        "max"
                    ]
                    or 0
                ) + 1
                ArticleRevision.objects.create(
                    article=article,
                    version=version,
                    title=article.title,
                    summary=article.summary,
                    content=article.content,
                    content_hash=article.content_hash,
                    change_summary="cp-uz content snapshot importi",
                    source_commit=article.source_commit,
                )
                stats["revisions_created"] += 1

            self._sync_tags(article, source, stats)
            self._sync_translators(article, translation, stats)
            self._sync_practice(article, row.get("practice_links") or [], stats)
            self._sync_reviews(article, row, stats)
            article_map[row["id"]] = article
            article_map[row.get("path", "")] = article
            article_map[canonical_path] = article
        return article_map

    def _validate_row(self, row):
        for key in ("id", "markdown", "category"):
            if not row.get(key):
                raise CommandError(f"Maqola qatorida '{key}' yo‘q: {row.get('id', '<unknown>')}")

    _validate_export = staticmethod(validate_export)
    _verify_manifest = staticmethod(verify_manifest)

    def _category_for(self, row, stats):
        root_slug = slugify(row["category"])
        icon, color = CATEGORY_STYLE.get(root_slug, ("solar:folder-bold", "#475569"))
        root, created = Category.objects.update_or_create(
            slug=root_slug,
            defaults={
                "name": row.get("category_uz") or row["category"],
                "icon": icon,
                "color": color,
                "is_active": True,
            },
        )
        stats["categories_created" if created else "categories_updated"] += 1
        subcategory = row.get("subcategory")
        if not subcategory:
            return root
        child_slug = f"{root_slug}--{slugify(subcategory)}"
        child, created = Category.objects.update_or_create(
            slug=child_slug,
            defaults={
                "name": row.get("subcategory_uz") or subcategory,
                "parent": root,
                "icon": icon,
                "color": color,
                "is_active": True,
            },
        )
        stats["categories_created" if created else "categories_updated"] += 1
        return child

    def _sync_tags(self, article, source, stats):
        names = (source.get("extra_front_matter") or {}).get("upstream_tags") or []
        tags = []
        for name in names:
            tag, created = Tag.objects.get_or_create(
                slug=slugify(name), defaults={"name": str(name)}
            )
            stats["tags_created" if created else "tags_reused"] += 1
            tags.append(tag)
        article.tags.set(tags)

    def _sync_translators(self, article, translation, stats):
        for order, name in enumerate(translation.get("translators") or []):
            user = self._imported_user(str(name), "translator")
            _, created = ArticleContributor.objects.get_or_create(
                article=article,
                user=user,
                role=ArticleContributor.Role.TRANSLATOR,
                defaults={"order": order},
            )
            stats["contributors_created" if created else "contributors_reused"] += 1

    def _sync_practice(self, article, links, stats):
        seen = set()
        for order, link in enumerate(links):
            url = str(link.get("url") or "").strip()
            if not url or url in seen:
                continue
            seen.add(url)
            raw_platform = str(link.get("platform") or "Boshqa").strip()
            platform = PLATFORM_MAP.get(
                raw_platform.casefold(), ExternalPracticeReference.Platform.OTHER
            )
            custom = raw_platform if platform == ExternalPracticeReference.Platform.OTHER else ""
            _, created = ExternalPracticeReference.objects.update_or_create(
                article=article,
                url=url,
                defaults={
                    "platform": platform,
                    "custom_platform": custom,
                    "title": (link.get("title") or url)[:240],
                    "note": link.get("note") or link.get("section_heading") or "",
                    "order": order,
                    "is_active": True,
                },
            )
            stats["practice_created" if created else "practice_updated"] += 1
        article.practice_references.exclude(url__in=seen).update(is_active=False)

    def _sync_reviews(self, article, row, stats):
        reviews = row.get("reviews") or {}
        for stage in (ReviewRecord.Stage.TECHNICAL, ReviewRecord.Stage.LANGUAGE):
            review = reviews.get(stage) or {}
            self._create_review(article, stage, review, stats)
        for event in row.get("review_history") or []:
            stage = event.get("stage") or event.get("review_type")
            if stage in {
                ReviewRecord.Stage.TECHNICAL,
                ReviewRecord.Stage.LANGUAGE,
                ReviewRecord.Stage.EDITORIAL,
            }:
                self._create_review(article, stage, event, stats)

    def _create_review(self, article, stage, data, stats):
        decision = REVIEW_DECISIONS.get(data.get("status") or data.get("decision"))
        reviewer_name = data.get("reviewer") or data.get("reviewed_by")
        content_hash = data.get("content_sha256") or data.get("content_hash")
        if not decision or not reviewer_name or not content_hash:
            return
        reviewer = self._imported_user(str(reviewer_name), "reviewer")
        review, created = ReviewRecord.objects.get_or_create(
            article=article,
            proposal=None,
            stage=stage,
            decision=decision,
            content_hash=content_hash,
            reviewer=reviewer,
            defaults={"notes": data.get("notes") or ""},
        )
        reviewed_at = self._parse_datetime(data.get("reviewed_at") or data.get("created_at"))
        if created and reviewed_at:
            ReviewRecord.objects.filter(pk=review.pk).update(created_at=reviewed_at)
        stats["reviews_created" if created else "reviews_reused"] += 1

    _import_prerequisites = staticmethod(reconcile_prerequisites)

    def _copy_assets(self, assets_root, stats, dry_run=False):
        if not assets_root.is_dir():
            self.stderr.write(self.style.WARNING(f"Assets katalogi topilmadi: {assets_root}"))
            return
        destination_root = (Path(settings.MEDIA_ROOT) / "content").resolve()
        allowed = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"}
        for source in assets_root.rglob("*"):
            if not source.is_file() or source.suffix.casefold() not in allowed:
                continue
            relative = source.relative_to(assets_root)
            destination = (destination_root / relative).resolve()
            if destination_root not in destination.parents:
                raise CommandError(f"Xavfli asset yo‘li: {relative}")
            if destination.exists() and self._file_hash(source) == self._file_hash(destination):
                stats["assets_unchanged"] += 1
                continue
            if dry_run:
                stats["assets_would_copy"] += 1
                continue
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
            stats["assets_copied"] += 1

    def _import_glossary(self, glossary_path, stats):
        if not glossary_path.is_file():
            self.stderr.write(self.style.WARNING(f"Glossary fayli topilmadi: {glossary_path}"))
            return

        try:
            rows = json.loads(glossary_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise CommandError(f"Glossary o‘qilmadi: {exc}") from exc
        if not isinstance(rows, list):
            raise CommandError("Noto‘g‘ri glossary: JSON ro‘yxat bo‘lishi kerak.")

        grouped = {}
        for row in rows:
            if not isinstance(row, dict):
                raise CommandError("Noto‘g‘ri glossary qatori: obyekt kutilgan.")
            term = str(row.get("uzbek") or "").strip()
            source = str(row.get("source") or "").strip()
            if not term or not source:
                raise CommandError("Glossary qatorida source/uzbek bo‘sh bo‘lishi mumkin emas.")
            row_aliases = row.get("aliases", [])
            if not isinstance(row_aliases, list) or not all(
                isinstance(alias, str) for alias in row_aliases
            ):
                raise CommandError("Glossary qatoridagi aliases matnlar ro‘yxati bo‘lishi kerak.")
            bucket = grouped.setdefault(term, {"aliases": [], "alias_keys": set(), "notes": []})
            for alias in (source, *row_aliases):
                alias = alias.strip()
                alias_key = alias.casefold()
                if alias and alias_key not in bucket["alias_keys"]:
                    bucket["aliases"].append(alias)
                    bucket["alias_keys"].add(alias_key)
            note = str(row.get("note") or "").strip()
            if note and note not in bucket["notes"]:
                bucket["notes"].append(note)

        seen = set()
        for term, data in grouped.items():
            aliases = data["aliases"]
            notes = data["notes"]
            definition = (
                "\n\n".join(notes)
                if notes
                else (f"Sport dasturlashda “{', '.join(aliases)}” deb ishlatiladigan atama.")
            )
            short_definition = notes[0] if notes else f"English: {', '.join(aliases)}."
            slug = slugify(term) or f"term-{sha256(term.encode('utf-8')).hexdigest()[:12]}"
            defaults = {
                "term": term,
                "slug": slug[:180],
                "short_definition": short_definition[:400],
                "definition": definition,
                "aliases": aliases,
                "is_published": True,
            }
            glossary_term = GlossaryTerm.objects.filter(term__iexact=term).first()
            if glossary_term is None:
                glossary_term = GlossaryTerm.objects.filter(slug=defaults["slug"]).first()
            if glossary_term is None:
                glossary_term = GlossaryTerm.objects.create(**defaults)
                created = True
                changed = True
            else:
                created = False
                changed_fields = []
                for field, value in defaults.items():
                    if getattr(glossary_term, field) != value:
                        setattr(glossary_term, field, value)
                        changed_fields.append(field)
                if changed_fields:
                    glossary_term.save(update_fields=(*changed_fields, "updated_at"))
                changed = bool(changed_fields)
            seen.add(glossary_term.pk)
            if created:
                stats["glossary_created"] += 1
            elif changed:
                stats["glossary_updated"] += 1
            else:
                stats["glossary_unchanged"] += 1

        GlossaryTerm.objects.exclude(pk__in=seen).update(is_published=False)

    def _imported_user(self, display_name, role):
        User = get_user_model()
        digest = sha256(display_name.encode("utf-8")).hexdigest()[:10]
        base = slugify(display_name)[:120] or role
        username = f"import-{base}-{digest}"[:150]
        user, created = User.objects.get_or_create(
            username=username,
            defaults={"display_name": display_name[:120], "is_active": False},
        )
        if created:
            user.set_unusable_password()
            user.save(update_fields=("password",))
        return user

    @staticmethod
    def _first_paragraph(markdown):
        for block in markdown.split("\n\n"):
            cleaned = block.strip()
            if cleaned and not cleaned.startswith(("#", "```", "$$")):
                return cleaned[:500]
        return "Sport dasturlash bo‘yicha o‘zbekcha darslik."

    @staticmethod
    def _parse_datetime(value):
        if not value:
            return None
        parsed = parse_datetime(str(value))
        if parsed:
            return parsed
        try:
            return datetime.fromisoformat(str(value))
        except ValueError:
            return None

    @staticmethod
    def _file_hash(path):
        digest = sha256()
        with path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                digest.update(chunk)
        return digest.hexdigest()


def payload_license(source_snapshot):
    return source_snapshot.get("content_license") or "CC-BY-SA-4.0"
