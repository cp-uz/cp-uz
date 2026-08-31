from django.urls import path

from .views import GlossaryLeaderboardView, GlossaryQuizScoreView

app_name = "glossary_quiz"

urlpatterns = [
    path("leaderboard/", GlossaryLeaderboardView.as_view(), name="leaderboard"),
    path("score/", GlossaryQuizScoreView.as_view(), name="score"),
]
