from __future__ import annotations

import uuid
from hashlib import sha256

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=80, blank=True)
    color = models.CharField(max_length=20, blank=True)
    parent = models.ForeignKey(
        "self", on_delete=models.PROTECT, null=True, blank=True, related_name="children"
    )
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("order", "name")
        verbose_name_plural = "categories"
        indexes = [models.Index(fields=("is_active", "order"), name="category_active_order_idx")]

    def clean(self):
        if self.parent_id and self.parent_id == self.pk:
            raise ValidationError({"parent": "Kategoriya o‘ziga ota kategoriya bo‘la olmaydi."})

    def __str__(self) -> str:
        return self.name


class Tag(TimeStampedModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class ArticleQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status=Article.Status.PUBLISHED, published_at__isnull=False)

    def public(self):
        return self.filter(visibility=Article.Visibility.PUBLIC)

    def with_listing_data(self):
        return self.select_related("category").prefetch_related("tags", "contributors__user")


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


class ArticleContributor(TimeStampedModel):
    class Role(models.TextChoices):
        AUTHOR = "author", "Muallif"
        TRANSLATOR = "translator", "Tarjimon"
        EDITOR = "editor", "Muharrir"
        TECHNICAL_REVIEWER = "technical_reviewer", "Texnik reviewer"
        LANGUAGE_REVIEWER = "language_reviewer", "Til revieweri"

    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="contributors")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="article_contributions"
    )
    role = models.CharField(max_length=30, choices=Role.choices)
    order = models.PositiveSmallIntegerField(default=0)
    note = models.CharField(max_length=240, blank=True)

    class Meta:
        ordering = ("order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=("article", "user", "role"), name="unique_article_contributor_role"
            )
        ]

    def __str__(self) -> str:
        return f"{self.article}: {self.user} ({self.get_role_display()})"


class ArticlePrerequisite(models.Model):
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="prerequisite_links"
    )
    prerequisite = models.ForeignKey(Article, on_delete=models.PROTECT, related_name="unlock_links")
    order = models.PositiveSmallIntegerField(default=0)
    note = models.CharField(max_length=240, blank=True)

    class Meta:
        ordering = ("order", "prerequisite__title")
        constraints = [
            models.UniqueConstraint(
                fields=("article", "prerequisite"), name="unique_article_prerequisite"
            ),
            models.CheckConstraint(
                condition=~models.Q(article=models.F("prerequisite")),
                name="article_prerequisite_not_self",
            ),
        ]

    def clean(self):
        if self.article_id == self.prerequisite_id:
            raise ValidationError("Maqola o‘ziga prerequisite bo‘la olmaydi.")

    def __str__(self) -> str:
        return f"{self.article} ← {self.prerequisite}"


class ExternalPracticeReference(TimeStampedModel):
    class Platform(models.TextChoices):
        CODEFORCES = "codeforces", "Codeforces"
        ATCODER = "atcoder", "AtCoder"
        CSES = "cses", "CSES"
        KATTIS = "kattis", "Kattis"
        SPOJ = "spoj", "SPOJ"
        LEETCODE = "leetcode", "LeetCode"
        KEP = "kep", "KEP.uz"
        OTHER = "other", "Boshqa"

    class Level(models.TextChoices):
        WARM_UP = "warm_up", "Qizish"
        RECOMMENDED = "recommended", "Tavsiya etiladi"
        CHALLENGE = "challenge", "Murakkab sinov"

    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="practice_references"
    )
    platform = models.CharField(max_length=30, choices=Platform.choices)
    custom_platform = models.CharField(max_length=80, blank=True)
    title = models.CharField(max_length=240)
    url = models.URLField(max_length=700)
    difficulty_label = models.CharField(max_length=80, blank=True)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.RECOMMENDED)
    note = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("order", "title")
        constraints = [
            models.UniqueConstraint(fields=("article", "url"), name="unique_article_practice_url")
        ]

    def clean(self):
        if self.platform == self.Platform.OTHER and not self.custom_platform:
            raise ValidationError({"custom_platform": "Boshqa platforma nomini kiriting."})

    @property
    def platform_name(self) -> str:
        return (
            self.custom_platform
            if self.platform == self.Platform.OTHER
            else self.get_platform_display()
        )

    def __str__(self) -> str:
        return f"{self.platform_name}: {self.title}"


class GlossaryTerm(TimeStampedModel):
    term = models.CharField(max_length=160, unique=True)
    slug = models.SlugField(max_length=180, unique=True)
    short_definition = models.CharField(max_length=400)
    definition = models.TextField()
    aliases = models.JSONField(default=list, blank=True)
    related_articles = models.ManyToManyField(Article, related_name="glossary_terms", blank=True)
    is_published = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="glossary_terms_created",
    )

    class Meta:
        ordering = ("term",)

    def __str__(self) -> str:
        return self.term


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
