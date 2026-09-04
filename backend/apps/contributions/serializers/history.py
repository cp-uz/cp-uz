from rest_framework import serializers

from apps.accounts.serializers import UserSummarySerializer

from ..models import ProposalStatusEvent, ReviewRecord


class ReviewRecordSerializer(serializers.ModelSerializer):
    reviewer = UserSummarySerializer(read_only=True)
    stage_label = serializers.CharField(source="get_stage_display", read_only=True)
    decision_label = serializers.CharField(source="get_decision_display", read_only=True)
    is_current = serializers.BooleanField(read_only=True)

    class Meta:
        model = ReviewRecord
        fields = (
            "id",
            "stage",
            "stage_label",
            "decision",
            "decision_label",
            "content_hash",
            "reviewer",
            "notes",
            "is_current",
            "created_at",
        )


class StatusEventSerializer(serializers.ModelSerializer):
    actor = UserSummarySerializer(read_only=True)

    class Meta:
        model = ProposalStatusEvent
        fields = ("from_status", "to_status", "actor", "note", "created_at")
