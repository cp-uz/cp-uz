from rest_framework import serializers

from apps.seasons.serializers import EventGraphSerializer, SeasonLinkSerializer

from .models import Problem, ProblemAttachment, ProblemLink, ProblemSet


class ProblemLinkSerializer(serializers.ModelSerializer):
    kind_label = serializers.CharField(source="get_kind_display", read_only=True)

    class Meta:
        model = ProblemLink
        fields = (
            "id",
            "kind",
            "kind_label",
            "title",
            "url",
            "platform",
            "is_official",
            "is_primary",
            "order",
        )


class ProblemAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemAttachment
        fields = ("id", "title", "url", "content_type", "size_bytes", "order")


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


class ProblemDetailSerializer(ProblemSummarySerializer):
    statement_markdown = serializers.CharField()
    source_path = serializers.CharField()
    time_limit_ms = serializers.IntegerField(allow_null=True)
    memory_limit_mb = serializers.IntegerField(allow_null=True)
    max_score = serializers.DecimalField(max_digits=8, decimal_places=2, allow_null=True)
    tags = serializers.ListField(child=serializers.CharField())
    last_verified_on = serializers.DateField(allow_null=True)
    links = ProblemLinkSerializer(many=True, read_only=True)
    attachments = ProblemAttachmentSerializer(many=True, read_only=True)
    problem_set = serializers.SerializerMethodField()
    season = serializers.SerializerMethodField()
    event = serializers.SerializerMethodField()
    sets = serializers.SerializerMethodField()

    class Meta(ProblemSummarySerializer.Meta):
        fields = ProblemSummarySerializer.Meta.fields + (
            "statement_markdown",
            "source_path",
            "time_limit_ms",
            "memory_limit_mb",
            "max_score",
            "tags",
            "last_verified_on",
            "links",
            "attachments",
            "problem_set",
            "season",
            "event",
            "sets",
        )

    def get_problem_set(self, obj) -> dict:
        return {
            "slug": obj.problem_set.slug,
            "title": obj.problem_set.title,
            "date_label": obj.problem_set.date_label,
            "order": obj.problem_set.order,
        }

    def get_season(self, obj) -> dict:
        return SeasonLinkSerializer(obj.event.season).data

    def get_event(self, obj) -> dict:
        return EventGraphSerializer(obj.event).data

    def get_sets(self, obj) -> list[dict]:
        return ProblemSetSerializer(self.context["event_sets"], many=True).data
