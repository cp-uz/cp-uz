from rest_framework import serializers


class EditorialStatsSerializer(serializers.Serializer):
    draft = serializers.IntegerField()
    in_review = serializers.IntegerField()
    published = serializers.IntegerField()


class PublicStatsSerializer(serializers.Serializer):
    articles = serializers.IntegerField()
    categories = serializers.IntegerField()
    practice_references = serializers.IntegerField()
    full_translations = serializers.IntegerField()
    synopsis_drafts = serializers.IntegerField()
    editorial = EditorialStatsSerializer()
