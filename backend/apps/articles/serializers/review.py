from rest_framework import serializers

from apps.contributions.models import ReviewRecord


class ReviewDecisionSerializer(serializers.Serializer):
    decision = serializers.ChoiceField(choices=ReviewRecord.Decision.choices)
    created_at = serializers.DateTimeField()


class ArticleReviewStateSerializer(serializers.Serializer):
    technical_approved = serializers.BooleanField()
    language_approved = serializers.BooleanField()
    fully_reviewed = serializers.BooleanField()
    content_hash = serializers.CharField()
    latest = serializers.DictField(child=ReviewDecisionSerializer(allow_null=True))
