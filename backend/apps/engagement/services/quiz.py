import secrets
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.articles.models import GlossaryTerm

from ..models import GlossaryQuizAnswer, GlossaryQuizQuestion, GlossaryQuizScore

QUIZ_MODES = (
    (
        "english_to_uzbek",
        "English → O‘zbekcha",
        "Inglizcha atamaning o‘zbekcha muqobilini tanlang.",
        "english",
        "term",
    ),
    (
        "uzbek_to_english",
        "O‘zbekcha → English",
        "O‘zbekcha atamaning inglizcha muqobilini tanlang.",
        "term",
        "english",
    ),
    (
        "definition_to_english",
        "Izoh → English",
        "Izohga mos inglizcha atamani tanlang.",
        "definition",
        "english",
    ),
    (
        "definition_to_uzbek",
        "Izoh → O‘zbekcha",
        "Izohga mos o‘zbekcha atamani tanlang.",
        "definition",
        "term",
    ),
)


def _question_data():
    candidates = []
    for term in GlossaryTerm.objects.filter(is_published=True).order_by("?")[:128]:
        english = term.aliases[0] if isinstance(term.aliases, list) and term.aliases else ""
        if not isinstance(english, str) or not english.strip() or len(english) > 400:
            continue
        candidates.append(
            {"term": term.term, "english": english, "definition": term.short_definition}
        )
    random = secrets.SystemRandom()
    random.shuffle(candidates)
    modes = list(QUIZ_MODES)
    random.shuffle(modes)
    for mode, label, instruction, prompt_field, answer_field in modes:
        for target in candidates:
            answer = target[answer_field]
            pool = list(
                dict.fromkeys(
                    item[answer_field] for item in candidates if item[answer_field] != answer
                )
            )
            if len(pool) < 3:
                continue
            options = [answer, *random.sample(pool, 3)]
            random.shuffle(options)
            return {
                "mode": mode,
                "mode_label": label,
                "instruction": instruction,
                "prompt": target[prompt_field],
                "options": options,
                "correct_answer": answer,
            }
    raise ValidationError("Quiz uchun kamida to‘rtta turli atama kerak.")


def issue_quiz_question(user):
    current = (
        GlossaryQuizQuestion.objects.filter(
            user=user, answered_at__isnull=True, expires_at__gt=timezone.now()
        )
        .order_by("-created_at")
        .first()
    )
    if current is not None:
        return current
    data = _question_data()
    with transaction.atomic():
        get_user_model().objects.select_for_update().get(pk=user.pk)
        current = (
            GlossaryQuizQuestion.objects.filter(
                user=user, answered_at__isnull=True, expires_at__gt=timezone.now()
            )
            .order_by("-created_at")
            .first()
        )
        if current is not None:
            return current
        return GlossaryQuizQuestion.objects.create(
            user=user, expires_at=timezone.now() + timedelta(minutes=30), **data
        )


@transaction.atomic
def submit_quiz_answer(*, user, client_answer_id, question_id, selected_answer):
    get_user_model().objects.select_for_update().get(pk=user.pk)
    previous = (
        GlossaryQuizAnswer.objects.filter(user=user, client_answer_id=client_answer_id)
        .select_related("question")
        .first()
    )
    if previous is not None:
        if previous.question_id != question_id:
            raise ValidationError({"client_answer_id": "Bu identifikator boshqa javobga tegishli."})
        return previous.question
    question = (
        GlossaryQuizQuestion.objects.select_for_update().filter(pk=question_id, user=user).first()
    )
    if question is None:
        raise ValidationError({"question_id": "Savol topilmadi yoki sizga tegishli emas."})
    if question.answered_at is not None:
        return question
    if question.expires_at <= timezone.now():
        raise ValidationError({"question_id": "Savol muddati tugagan. Yangi savol oling."})
    if selected_answer not in question.options:
        raise ValidationError({"selected_answer": "Taklif qilingan javoblardan birini tanlang."})
    question.is_correct = selected_answer == question.correct_answer
    question.selected_answer = selected_answer
    question.answered_at = timezone.now()
    question.save(update_fields=("is_correct", "selected_answer", "answered_at"))
    GlossaryQuizAnswer.objects.create(
        user=user,
        question=question,
        client_answer_id=client_answer_id,
        is_correct=question.is_correct,
    )
    score, _ = GlossaryQuizScore.objects.select_for_update().get_or_create(user=user)
    score.total_answers += 1
    if question.is_correct:
        score.correct_answers += 1
        score.current_streak += 1
        score.best_streak = max(score.best_streak, score.current_streak)
    else:
        score.current_streak = 0
    score.save(
        update_fields=(
            "correct_answers",
            "total_answers",
            "current_streak",
            "best_streak",
            "updated_at",
        )
    )
    return question
