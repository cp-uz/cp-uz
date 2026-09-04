from django.urls import path

from .views import GlossaryLeaderboardView, GlossaryQuizQuestionView, GlossaryQuizScoreView

app_name = "glossary_quiz"

urlpatterns = [
    path("leaderboard/", GlossaryLeaderboardView.as_view(), name="leaderboard"),
    path("questions/", GlossaryQuizQuestionView.as_view(), name="questions"),
    path("score/", GlossaryQuizScoreView.as_view(), name="score"),
]
