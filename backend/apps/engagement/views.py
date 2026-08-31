from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import (
    Bookmark,
    GlossaryQuizAnswer,
    GlossaryQuizScore,
    PersonalNote,
    ReadingProgress,
)
from .serializers import (
    BookmarkSerializer,
    GlossaryQuizStateSerializer,
    GlossaryQuizSubmissionSerializer,
    PersonalNoteSerializer,
    ReadingProgressSerializer,
)


class OwnedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ("get", "post", "put", "patch", "delete", "head", "options")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=("get",), url_path="all")
    def all_items(self, request):
        """Return this user's small learning collection without oversized page parameters."""

        queryset = self.filter_queryset(self.get_queryset())
        return Response(self.get_serializer(queryset, many=True).data)


@extend_schema_view(
    list=extend_schema(tags=["My learning"]),
    create=extend_schema(tags=["My learning"]),
    destroy=extend_schema(tags=["My learning"]),
)
class BookmarkViewSet(OwnedModelViewSet):
    queryset = Bookmark.objects.none()
    serializer_class = BookmarkSerializer
    http_method_names = ("get", "post", "delete", "head", "options")

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Bookmark.objects.none()
        return Bookmark.objects.filter(user=self.request.user).select_related("article__category")


@extend_schema_view(
    list=extend_schema(tags=["My learning"]),
    create=extend_schema(tags=["My learning"]),
    update=extend_schema(tags=["My learning"]),
    partial_update=extend_schema(tags=["My learning"]),
)
class ReadingProgressViewSet(OwnedModelViewSet):
    queryset = ReadingProgress.objects.none()
    serializer_class = ReadingProgressSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return ReadingProgress.objects.none()
        return ReadingProgress.objects.filter(user=self.request.user).select_related(
            "article__category"
        )


@extend_schema_view(
    list=extend_schema(tags=["My learning"]),
    create=extend_schema(tags=["My learning"]),
    update=extend_schema(tags=["My learning"]),
    partial_update=extend_schema(tags=["My learning"]),
)
class PersonalNoteViewSet(OwnedModelViewSet):
    queryset = PersonalNote.objects.none()
    serializer_class = PersonalNoteSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return PersonalNote.objects.none()
        return PersonalNote.objects.filter(user=self.request.user).select_related(
            "article__category"
        )


def _public_score_name(user) -> str:
    if user.is_guest:
        suffix = user.guest_session.public_id.hex[:6].upper()
        return f"Mehmon #{suffix}"
    if user.public_profile:
        return user.name
    return "Ishtirokchi"


def _leaderboard_entry(score, rank: int, current_user_id: int | None) -> dict:
    total = score.total_answers
    return {
        "rank": rank,
        "name": _public_score_name(score.user),
        "correct": score.correct_answers,
        "total": total,
        "percent": round(score.correct_answers / total * 100) if total else 0,
        "current_streak": score.current_streak,
        "best_streak": score.best_streak,
        "is_current_user": score.user_id == current_user_id,
        "updated_at": score.updated_at,
    }


def _quiz_state_payload(request) -> dict:
    current_user_id = request.user.pk if request.user.is_authenticated else None
    scores = list(
        GlossaryQuizScore.objects.filter(total_answers__gt=0)
        .select_related("user__guest_session")
        .order_by("-correct_answers", "-best_streak", "total_answers", "updated_at", "id")
    )
    entries = [
        _leaderboard_entry(score, rank, current_user_id)
        for rank, score in enumerate(scores, 1)
    ]
    personal = next((entry for entry in entries if entry["is_current_user"]), None)
    return {
        "leaderboard": entries[:3],
        "personal": personal,
        "participant_count": len(entries),
    }


@extend_schema(
    tags=["Glossary quiz"],
    responses={200: GlossaryQuizStateSerializer},
)
class GlossaryLeaderboardView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(_quiz_state_payload(request))


@extend_schema(
    tags=["Glossary quiz"],
    request=GlossaryQuizSubmissionSerializer,
    responses={200: GlossaryQuizStateSerializer},
)
class GlossaryQuizScoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "glossary_quiz"

    @transaction.atomic
    def post(self, request):
        serializer = GlossaryQuizSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        client_answer_id = serializer.validated_data["client_answer_id"]
        is_correct = serializer.validated_data["is_correct"]

        _, answer_created = GlossaryQuizAnswer.objects.get_or_create(
            user=request.user,
            client_answer_id=client_answer_id,
            defaults={"is_correct": is_correct},
        )
        if not answer_created:
            return Response(_quiz_state_payload(request))

        score, _ = GlossaryQuizScore.objects.select_for_update().get_or_create(
            user=request.user,
        )
        score.total_answers += 1
        if is_correct:
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

        return Response(_quiz_state_payload(request))
