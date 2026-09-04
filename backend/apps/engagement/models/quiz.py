import uuid

from django.conf import settings
from django.db import models

from common.models import TimeStampedModel


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
        indexes = [
            models.Index(
                fields=("-correct_answers", "-best_streak", "total_answers", "updated_at", "id"),
                name="quiz_leaderboard_order_idx",
            )
        ]
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


class GlossaryQuizQuestion(models.Model):
    """A server-issued question whose answer stays private until submission."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="glossary_quiz_questions"
    )
    mode = models.CharField(max_length=40)
    mode_label = models.CharField(max_length=80)
    instruction = models.CharField(max_length=160)
    prompt = models.TextField()
    options = models.JSONField(default=list)
    correct_answer = models.CharField(max_length=400)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    answered_at = models.DateTimeField(null=True, blank=True)
    selected_answer = models.CharField(max_length=400, blank=True)
    is_correct = models.BooleanField(null=True)

    class Meta:
        indexes = [
            models.Index(
                fields=("user", "answered_at", "expires_at"), name="quiz_open_question_idx"
            )
        ]

    def __str__(self):
        return f"{self.user_id}: {self.mode} ({self.pk})"


class GlossaryQuizAnswer(models.Model):
    """A durable idempotency record for one client-side glossary quiz answer."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="glossary_quiz_answers",
    )
    client_answer_id = models.CharField(max_length=120)
    question = models.OneToOneField(
        GlossaryQuizQuestion,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="answer_record",
    )
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
