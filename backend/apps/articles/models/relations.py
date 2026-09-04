from __future__ import annotations

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from common.models import TimeStampedModel

from .content import Article


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
