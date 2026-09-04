from __future__ import annotations

import uuid
from hashlib import sha256

from django.conf import settings
from django.db import models
from django.utils import timezone

from common.models import TimeStampedModel

from .taxonomy import Category, Tag


class ArticleQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status=Article.Status.PUBLISHED, published_at__isnull=False)

    def public(self):
        return self.filter(visibility=Article.Visibility.PUBLIC)

    def with_listing_data(self):
        return self.select_related("category").prefetch_related("tags")


class Article(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Qoralama"
        IN_REVIEW = "in_review", "Ko‘rib chiqilmoqda"
        PUBLISHED = "published", "Nashr qilingan"
        ARCHIVED = "archived", "Arxivlangan"

    class Difficulty(models.TextChoices):
        BEGINNER = "beginner", "Boshlang‘ich"
        INTERMEDIATE = "intermediate", "O‘rta"
        ADVANCED = "advanced", "Yuqori"

    class Visibility(models.TextChoices):
        PRIVATE = "private", "Yopiq"
        UNLISTED = "unlisted", "Faqat havola orqali"
        PUBLIC = "public", "Ochiq"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=240)
    slug = models.SlugField(max_length=260, unique=True)
    canonical_path = models.CharField(max_length=500, unique=True, null=True, blank=True)
    content_path = models.CharField(max_length=500, blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    summary = models.TextField()
    content = models.TextField(help_text="CommonMark/Markdown matni")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="articles")
    tags = models.ManyToManyField(Tag, related_name="articles", blank=True)
    prerequisites = models.ManyToManyField(
        "self",
        through="ArticlePrerequisite",
        through_fields=("article", "prerequisite"),
        symmetrical=False,
        related_name="unlocks",
        blank=True,
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    visibility = models.CharField(
        max_length=20, choices=Visibility.choices, default=Visibility.PRIVATE
    )
    difficulty = models.CharField(
        max_length=20, choices=Difficulty.choices, default=Difficulty.BEGINNER
    )
    language = models.CharField(max_length=10, default="uz-latn")
    estimated_reading_minutes = models.PositiveSmallIntegerField(default=5)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    cover_image_url = models.URLField(blank=True)
    source_url = models.URLField(blank=True)
    source_repository = models.URLField(blank=True)
    source_path = models.CharField(max_length=500, blank=True)
    source_commit = models.CharField(max_length=64, blank=True)
    content_license = models.CharField(max_length=80, default="CC-BY-SA-4.0")
    provenance = models.JSONField(default=dict, blank=True)
    content_hash = models.CharField(max_length=64, editable=False, db_index=True)
    seo_title = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=170, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="articles_created",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="articles_updated",
    )
    published_at = models.DateTimeField(null=True, blank=True)

    objects = ArticleQuerySet.as_manager()

    class Meta:
        ordering = ("category__order", "order", "title")
        indexes = [
            models.Index(
                fields=("visibility", "language", "order"), name="article_public_lang_idx"
            ),
            models.Index(fields=("category", "status", "order"), name="article_category_idx"),
            models.Index(
                fields=("status", "difficulty", "published_at"), name="article_difficulty_idx"
            ),
        ]

    def save(self, *args, **kwargs):
        self.content_hash = sha256(self.content.encode("utf-8")).hexdigest()
        if self.status == self.Status.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class ArticleRevision(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="revisions")
    version = models.PositiveIntegerField()
    title = models.CharField(max_length=240)
    summary = models.TextField()
    content = models.TextField()
    content_hash = models.CharField(max_length=64, db_index=True)
    change_summary = models.CharField(max_length=500, blank=True)
    source_commit = models.CharField(max_length=64, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="article_revisions",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-version",)
        constraints = [
            models.UniqueConstraint(fields=("article", "version"), name="unique_article_revision")
        ]

    def save(self, *args, **kwargs):
        if not self.content_hash:
            self.content_hash = sha256(self.content.encode("utf-8")).hexdigest()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.article} v{self.version}"
