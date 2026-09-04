from rest_framework import serializers

from ..models import GlossaryQuizQuestion
from ..services import QUIZ_MODES


class GlossaryQuizSubmissionSerializer(serializers.Serializer):
    client_answer_id = serializers.CharField(max_length=120, allow_blank=False)
    question_id = serializers.UUIDField()
    selected_answer = serializers.CharField(max_length=400, trim_whitespace=False)


class GlossaryQuizQuestionSerializer(serializers.ModelSerializer):
    mode = serializers.ChoiceField(choices=[mode[0] for mode in QUIZ_MODES], read_only=True)
    options = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = GlossaryQuizQuestion
        fields = ("id", "mode", "mode_label", "instruction", "prompt", "options", "expires_at")


class GlossaryQuizAnswerResultSerializer(serializers.Serializer):
    question_id = serializers.UUIDField()
    is_correct = serializers.BooleanField()
    correct_answer = serializers.CharField()


class GlossaryLeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField(min_value=1)
    name = serializers.CharField()
    correct = serializers.IntegerField(min_value=0)
    total = serializers.IntegerField(min_value=0)
    percent = serializers.IntegerField(min_value=0, max_value=100)
    current_streak = serializers.IntegerField(min_value=0)
    best_streak = serializers.IntegerField(min_value=0)
    is_current_user = serializers.BooleanField()
    updated_at = serializers.DateTimeField()


class GlossaryQuizStateSerializer(serializers.Serializer):
    leaderboard = GlossaryLeaderboardEntrySerializer(many=True)
    personal = GlossaryLeaderboardEntrySerializer(allow_null=True)
    participant_count = serializers.IntegerField(min_value=0)


class GlossaryQuizScoreResponseSerializer(GlossaryQuizStateSerializer):
    answer = GlossaryQuizAnswerResultSerializer()
