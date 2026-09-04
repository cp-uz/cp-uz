from django.db.models import Q

from ..models import (
    GlossaryQuizScore,
)


def _public_score_name(user, *, is_current_user: bool = False) -> str:
    if user.is_guest:
        suffix = user.guest_session.public_id.hex[:6].upper()
        return f"Mehmon #{suffix}"
    if user.public_profile or is_current_user:
        return user.name
    return "Ishtirokchi"


def _leaderboard_entry(score, rank: int, current_user_id: int | None) -> dict:
    total = score.total_answers
    is_current_user = score.user_id == current_user_id
    return {
        "rank": rank,
        "name": _public_score_name(score.user, is_current_user=is_current_user),
        "correct": score.correct_answers,
        "total": total,
        "percent": round(score.correct_answers / total * 100) if total else 0,
        "current_streak": score.current_streak,
        "best_streak": score.best_streak,
        "is_current_user": is_current_user,
        "updated_at": score.updated_at,
    }


def quiz_state_payload(user) -> dict:
    current_user_id = user.pk if user.is_authenticated else None
    scores = GlossaryQuizScore.objects.filter(total_answers__gt=0).select_related(
        "user__guest_session"
    )
    entries = [
        _leaderboard_entry(score, rank, current_user_id) for rank, score in enumerate(scores[:3], 1)
    ]
    personal = next((entry for entry in entries if entry["is_current_user"]), None)
    if current_user_id is not None and personal is None:
        own_score = scores.filter(user_id=current_user_id).first()
        if own_score is not None:
            # Lexicographic ranking matches Meta.ordering, including deterministic ties.
            ahead = Q()
            equal = Q()
            for field in GlossaryQuizScore._meta.ordering:
                name = field.lstrip("-")
                lookup = "gt" if field.startswith("-") else "lt"
                value = getattr(own_score, name)
                ahead |= equal & Q(**{f"{name}__{lookup}": value})
                equal &= Q(**{name: value})
            personal = _leaderboard_entry(
                own_score, scores.filter(ahead).count() + 1, current_user_id
            )
    return {
        "leaderboard": entries,
        "personal": personal,
        "participant_count": scores.count(),
    }
