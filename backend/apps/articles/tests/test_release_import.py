"""Cross-domain import of the actual reviewed snapshot into an isolated database."""

import io
import tempfile
from pathlib import Path

from django.core.management import call_command
from django.test import TestCase, override_settings

from apps.articles.models import Article, ArticleRevision

ROOT = Path(__file__).resolve().parents[4]


class ReleaseImportTests(TestCase):
    def test_full_release_import_and_repeat_preserve_identity_and_revisions(self):
        with tempfile.TemporaryDirectory(prefix="cpuz-import-media-") as media:
            with override_settings(MEDIA_ROOT=media):
                output = io.StringIO()
                identities, revision_count = None, None
                for _ in range(2):
                    call_command(
                        "import_content",
                        path=ROOT / "content/exports/articles.v1.json",
                        stdout=output,
                    )
                    call_command(
                        "import_seasons", path=ROOT / "content/seasons", prune=True, stdout=output
                    )
                    call_command(
                        "import_problems", path=ROOT / "content/problems", prune=True, stdout=output
                    )
                    call_command(
                        "verify_release_content",
                        content_root=ROOT / "content",
                        manifest=ROOT / "deploy/content-inventory.json",
                        stdout=output,
                    )
                    current = dict(Article.objects.values_list("slug", "pk"))
                    if identities is not None:
                        self.assertEqual(current, identities)
                        self.assertEqual(ArticleRevision.objects.count(), revision_count)
                    identities = current
                    revision_count = ArticleRevision.objects.count()
                self.assertTrue(identities)
