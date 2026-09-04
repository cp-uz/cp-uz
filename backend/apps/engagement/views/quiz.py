from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from ..selectors.leaderboard import quiz_state_payload
from ..serializers import (
    GlossaryQuizQuestionSerializer,
    GlossaryQuizScoreResponseSerializer,
    GlossaryQuizStateSerializer,
    GlossaryQuizSubmissionSerializer,
)
from ..services import issue_quiz_question, submit_quiz_answer


@extend_schema(
    tags=["Glossary quiz"],
    responses={200: GlossaryQuizStateSerializer},
)
class GlossaryLeaderboardView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(quiz_state_payload(request.user))


@extend_schema(tags=["Glossary quiz"], request=None, responses=GlossaryQuizQuestionSerializer)
class GlossaryQuizQuestionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "glossary_question"

    def post(self, request):
        return Response(GlossaryQuizQuestionSerializer(issue_quiz_question(request.user)).data)


@extend_schema(
    tags=["Glossary quiz"],
    request=GlossaryQuizSubmissionSerializer,
    responses={200: GlossaryQuizScoreResponseSerializer},
)
class GlossaryQuizScoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "glossary_quiz"

    def post(self, request):
        serializer = GlossaryQuizSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = submit_quiz_answer(user=request.user, **serializer.validated_data)
        # Ranking reads happen after the short write transaction has committed.
        payload = quiz_state_payload(request.user)
        payload["answer"] = {
            "question_id": str(question.pk),
            "is_correct": question.is_correct,
            "correct_answer": question.correct_answer,
        }
        return Response(payload)
