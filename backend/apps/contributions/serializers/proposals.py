from rest_framework import serializers

from apps.accounts.serializers import UserSummarySerializer
from apps.articles.models import Article
from apps.articles.serializers import ArticleLinkSerializer

from ..models import EditProposal, ReviewRecord
from .history import ReviewRecordSerializer, StatusEventSerializer


class EditProposalSerializer(serializers.ModelSerializer):
    article = ArticleLinkSerializer(read_only=True)
    article_slug = serializers.SlugRelatedField(
        source="article", slug_field="slug", queryset=Article.objects.public(), write_only=True
    )
    submitter = UserSummarySerializer(read_only=True)
    is_stale = serializers.BooleanField(read_only=True)
    reviews = ReviewRecordSerializer(many=True, read_only=True)
    status_events = StatusEventSerializer(many=True, read_only=True)

    class Meta:
        model = EditProposal
        fields = (
            "id",
            "article",
            "article_slug",
            "submitter",
            "base_content_hash",
            "proposed_title",
            "proposed_summary",
            "proposed_content",
            "proposal_hash",
            "change_summary",
            "status",
            "is_stale",
            "github_pr_url",
            "submitted_at",
            "resolved_at",
            "created_at",
            "updated_at",
            "reviews",
            "status_events",
        )
        read_only_fields = (
            "id",
            "base_content_hash",
            "proposal_hash",
            "status",
            "github_pr_url",
            "submitted_at",
            "resolved_at",
            "created_at",
            "updated_at",
        )

    def validate_change_summary(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("O‘zgarish mazmunini kamida 10 belgi bilan yozing.")
        return value

    def update(self, instance, validated_data):
        from ..services import update_proposal

        return update_proposal(instance, validated_data)


class ProposalReviewInputSerializer(serializers.Serializer):
    stage = serializers.ChoiceField(choices=ReviewRecord.Stage.choices)
    decision = serializers.ChoiceField(choices=ReviewRecord.Decision.choices)
    notes = serializers.CharField(required=False, allow_blank=True)


class ProposalTransitionInputSerializer(serializers.Serializer):
    note = serializers.CharField(required=False, allow_blank=True)
