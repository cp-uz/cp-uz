from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.articles.models import Article, TimeStampedModel


class Bookmark(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookmarks"
    )
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="bookmarked_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        constraints = [
            models.UniqueConstraint(fields=("user", "article"), name="unique_user_bookmark")
        ]

    def __str__(self) -> str:
        return f"{self.user} → {self.article}"


class ReadingProgress(TimeStampedModel):
    class Status(models.TextChoices):
        NOT_STARTED = "not_started", "Boshlanmagan"
        IN_PROGRESS = "in_progress", "O‘qilmoqda"
        COMPLETED = "completed", "Tugallangan"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reading_progress"
    )
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="reader_progress")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_STARTED)
    percent = models.PositiveSmallIntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    last_heading = models.CharField(max_length=300, blank=True)
    last_read_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-last_read_at",)
        constraints = [
            models.UniqueConstraint(
                fields=("user", "article"), name="unique_user_reading_progress"
            ),
            models.CheckConstraint(
                condition=models.Q(percent__gte=0, percent__lte=100),
                name="reading_progress_valid_percent",
            ),
        ]

    def save(self, *args, **kwargs):
        if self.percent >= 100:
            self.percent = 100
            self.status = self.Status.COMPLETED
        elif self.percent > 0 and self.status == self.Status.NOT_STARTED:
            self.status = self.Status.IN_PROGRESS
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.user}: {self.article} ({self.percent}%)"


class PersonalNote(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="personal_notes"
    )
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="personal_notes")
    body = models.TextField()
    anchor = models.CharField(
        max_length=300,
        blank=True,
        help_text="Maqoladagi sarlavha identifikatori yoki boshqa stabil belgi.",
    )
    quote = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ("-updated_at",)
        indexes = [models.Index(fields=("user", "article"), name="note_user_article_idx")]

    def __str__(self) -> str:
        return f"{self.user}: {self.article}"


class GlossaryQuizScore(TimeStampedModel):
    """Cumulative result for the endless glossary quiz and its public leaderboard."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="glossary_quiz_score",
    )
    correct_answers = models.PositiveIntegerField(default=0)
    total_answers = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    best_streak = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("-correct_answers", "-best_streak", "total_answers", "updated_at", "id")
        constraints = [
            models.CheckConstraint(
                condition=models.Q(correct_answers__lte=models.F("total_answers")),
                name="glossary_quiz_score_valid",
            ),
            models.CheckConstraint(
                condition=models.Q(current_streak__lte=models.F("best_streak")),
                name="glossary_quiz_streak_valid",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.user}: {self.correct_answers}/{self.total_answers}"


class GlossaryQuizAnswer(models.Model):
    """A durable idempotency record for one client-side glossary quiz answer."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="glossary_quiz_answers",
    )
    client_answer_id = models.CharField(max_length=120)
    is_correct = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "client_answer_id"),
                name="unique_user_quiz_answer",
            )
        ]

    def __str__(self) -> str:
        return f"{self.user}: {self.client_answer_id}"
