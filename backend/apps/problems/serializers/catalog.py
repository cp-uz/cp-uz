from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.seasons.serializers import EventGraphSerializer, SeasonLinkSerializer

from ..models import Problem, ProblemSet


class ProblemSummarySerializer(serializers.ModelSerializer):
    translation_status_label = serializers.CharField(
        source="get_translation_status_display", read_only=True
    )
    problem_type_label = serializers.CharField(source="get_problem_type_display", read_only=True)

    class Meta:
        model = Problem
        fields = (
            "id",
            "slug",
            "code",
            "title",
            "original_title",
            "translation_status",
            "translation_status_label",
            "problem_type",
            "problem_type_label",
            "rating",
            "difficulty_label",
            "order",
        )


class ProblemSetSerializer(serializers.ModelSerializer):
    problems = serializers.SerializerMethodField()

    class Meta:
        model = ProblemSet
        fields = ("id", "slug", "title", "description", "date_label", "order", "problems")

    @extend_schema_field(ProblemSummarySerializer(many=True))
    def get_problems(self, obj) -> list[dict]:
        problems = getattr(obj, "public_problems", None)
        if problems is None:
            problems = obj.problems.filter(publication_status="published")
        return ProblemSummarySerializer(problems, many=True).data


class ProblemCatalogEventLinkSerializer(serializers.Serializer):
    code = serializers.CharField()
    slug = serializers.CharField()
    title = serializers.CharField()
    short_title = serializers.CharField(allow_blank=True)
    summary = serializers.CharField(allow_blank=True)
    start_date = serializers.DateField(allow_null=True)
    end_date = serializers.DateField(allow_null=True)
    event_status = serializers.CharField()
    date_label = serializers.CharField(allow_blank=True)


class ProblemCatalogEventSerializer(serializers.Serializer):
    season = SeasonLinkSerializer()
    event = ProblemCatalogEventLinkSerializer()
    sets = ProblemSetSerializer(many=True, read_only=True)
    problem_count = serializers.IntegerField(read_only=True)


class ProblemCatalogResponseSerializer(serializers.Serializer):
    seasons = SeasonLinkSerializer(many=True)
    events = ProblemCatalogEventSerializer(many=True)


class ProblemEventResponseSerializer(serializers.Serializer):
    season = SeasonLinkSerializer()
    event = EventGraphSerializer()
    sets = ProblemSetSerializer(many=True)


class ProblemSetLinkSerializer(serializers.Serializer):
    slug = serializers.CharField()
    title = serializers.CharField()
    date_label = serializers.CharField(allow_blank=True)
    order = serializers.IntegerField()
