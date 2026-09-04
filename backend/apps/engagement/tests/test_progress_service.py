from datetime import timedelta
from types import SimpleNamespace

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.articles.models import Article, Category
from apps.engagement.models import Bookmark, ReadingProgress
from apps.engagement.serializers import ReadingProgressSerializer


class ProgressServiceTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="progress-reader")
        self.category = Category.objects.create(name="Category", slug="progress-category")
        self.article = Article.objects.create(
            title="Lesson",
            slug="lesson",
            summary="Summary",
            content="Content",
            category=self.category,
            visibility="public",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_stale_instances_cannot_overwrite_higher_progress_or_heading(self):
        progress = ReadingProgress.objects.create(user=self.user, article=self.article, percent=50)
        context = {"request": SimpleNamespace(user=self.user)}
        high = ReadingProgressSerializer(
            ReadingProgress.objects.get(pk=progress.pk),
            data={"percent": 90, "last_heading": "later"},
            partial=True,
            context=context,
        )
        stale = ReadingProgressSerializer(
            ReadingProgress.objects.get(pk=progress.pk),
            data={"percent": 70, "last_heading": "earlier"},
            partial=True,
            context=context,
        )
        self.assertTrue(high.is_valid(), high.errors)
        self.assertTrue(stale.is_valid(), stale.errors)
        high.save()
        stale.save()
        progress.refresh_from_db()
        self.assertEqual((progress.percent, progress.last_heading), (90, "later"))

    def test_post_upsert_updates_last_read_and_rejects_article_retargeting(self):
        progress = ReadingProgress.objects.create(user=self.user, article=self.article, percent=25)
        yesterday = timezone.now() - timedelta(days=1)
        ReadingProgress.objects.filter(pk=progress.pk).update(last_read_at=yesterday)
        response = self.client.post(
            "/api/v1/me/progress/",
            {"article_slug": self.article.slug, "percent": 50},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        progress.refresh_from_db()
        self.assertGreater(progress.last_read_at, yesterday)
        other = Article.objects.create(
            title="Other",
            slug="other",
            summary="Summary",
            content="Content",
            category=self.category,
            visibility="public",
        )
        response = self.client.patch(
            f"/api/v1/me/progress/{progress.pk}/", {"article_slug": other.slug}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_bookmark_collection_query_count_does_not_grow_with_articles(self):
        for index in range(8):
            article = Article.objects.create(
                title=f"Lesson {index}",
                slug=f"lesson-{index}",
                summary="Summary",
                content="Content",
                category=self.category,
                visibility="public",
            )
            Bookmark.objects.create(user=self.user, article=article)
        with self.assertNumQueries(2):
            response = self.client.get("/api/v1/me/bookmarks/all/")
        self.assertEqual(len(response.data), 8)
