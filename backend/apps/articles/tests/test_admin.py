from unittest.mock import patch

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase

from apps.articles.admin import ArticleAdmin
from apps.articles.models import Article, Category
from apps.contributions.models import ReviewRecord


class ArticleAdminReviewTests(TestCase):
    def setUp(self):
        self.reviewer = get_user_model().objects.create_superuser(
            username="reviewer",
            password="strong-pass-123",
        )
        self.article = Article.objects.create(
            title="Ikkilik daraja",
            slug="algebra--binary-exp",
            canonical_path="algebra/binary-exp",
            summary="Darajani tez hisoblash.",
            content="# Ikkilik daraja",
            category=Category.objects.create(name="Algebra", slug="algebra"),
            visibility=Article.Visibility.PUBLIC,
        )
        self.model_admin = ArticleAdmin(Article, admin.site)
        self.request = RequestFactory().post("/admin/articles/article/")
        self.request.user = self.reviewer

    @patch.object(ArticleAdmin, "message_user")
    def test_admin_action_marks_current_content_fully_reviewed(self, message_user):
        self.model_admin.mark_translation_reviewed(
            self.request,
            Article.objects.filter(pk=self.article.pk),
        )

        reviews = ReviewRecord.objects.filter(
            article=self.article,
            content_hash=self.article.content_hash,
            decision=ReviewRecord.Decision.APPROVED,
        )
        self.assertEqual(
            set(reviews.values_list("stage", flat=True)),
            {ReviewRecord.Stage.TECHNICAL, ReviewRecord.Stage.LANGUAGE},
        )
        self.assertTrue(all(row.reviewer == self.reviewer for row in reviews))
        self.assertEqual(
            self.model_admin.translation_review_status(self.article), "Tekshiruvdan o‘tgan"
        )
        message_user.assert_called_once()

    @patch.object(ArticleAdmin, "message_user")
    def test_admin_action_is_idempotent_while_content_hash_is_unchanged(self, _message_user):
        queryset = Article.objects.filter(pk=self.article.pk)
        self.model_admin.mark_translation_reviewed(self.request, queryset)
        self.model_admin.mark_translation_reviewed(self.request, queryset)

        self.assertEqual(ReviewRecord.objects.filter(article=self.article).count(), 2)

    @patch.object(ArticleAdmin, "message_user")
    def test_content_change_requires_a_new_review(self, _message_user):
        self.model_admin.mark_translation_reviewed(
            self.request,
            Article.objects.filter(pk=self.article.pk),
        )
        self.article.content = "# Yangilangan mazmun"
        self.article.save()

        self.assertEqual(self.model_admin.translation_review_status(self.article), "AI-tarjima")
