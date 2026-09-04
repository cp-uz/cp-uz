"""Reconcile canonical prerequisite edges without retaining stale requirements."""

from django.core.management.base import CommandError

from apps.articles.models import ArticlePrerequisite


def reconcile_prerequisites(rows, article_map, stats):
    for row in rows:
        article = article_map[row["id"]]
        expected = set()
        for order, raw in enumerate(row.get("prerequisites") or []):
            key = (raw.get("id") or raw.get("path")) if isinstance(raw, dict) else raw
            prerequisite = article_map.get(key)
            if prerequisite is None or prerequisite == article:
                raise CommandError(f"{row['id']}: invalid prerequisite: {key!r}")
            if prerequisite.pk in expected:
                raise CommandError(f"{row['id']}: duplicate prerequisite: {key!r}")
            expected.add(prerequisite.pk)
            edge, created = ArticlePrerequisite.objects.get_or_create(
                article=article,
                prerequisite=prerequisite,
                defaults={
                    "order": order,
                    "note": raw.get("note", "") if isinstance(raw, dict) else "",
                },
            )
            note = raw.get("note", "") if isinstance(raw, dict) else ""
            if not created and (edge.order != order or edge.note != note):
                edge.order, edge.note = order, note
                edge.save(update_fields=("order", "note"))
                stats["prerequisites_updated"] += 1
            else:
                stats["prerequisites_created" if created else "prerequisites_reused"] += 1
        deleted, _ = (
            ArticlePrerequisite.objects.filter(article=article)
            .exclude(prerequisite_id__in=expected)
            .delete()
        )
        stats["prerequisites_deleted"] += deleted
