from django.urls import reverse
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.seasons.serializers import EventGraphSerializer, SeasonLinkSerializer

from .catalog import ProblemSetLinkSerializer, ProblemSetSerializer, ProblemSummarySerializer
from .resources import ProblemAttachmentSerializer, ProblemLinkSerializer, StatementPdfSerializer


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
    statement_pdf = serializers.SerializerMethodField()

    class Meta(ProblemSummarySerializer.Meta):
        fields = ProblemSummarySerializer.Meta.fields + (
            "statement_markdown",
            "source_path",
            "statement_pdf",
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

    @extend_schema_field(ProblemSetLinkSerializer)
    def get_problem_set(self, obj) -> dict:
        return {
            "slug": obj.problem_set.slug,
            "title": obj.problem_set.title,
            "date_label": obj.problem_set.date_label,
            "order": obj.problem_set.order,
        }

    @extend_schema_field(StatementPdfSerializer(allow_null=True))
    def get_statement_pdf(self, obj) -> dict | None:
        if not obj.statement_pdf_url:
            return None
        proxy_path = reverse(
            "problems:statement-pdf",
            kwargs={
                "season_slug": obj.event.season.slug,
                "event_slug": obj.event.slug,
                "problem_slug": obj.slug,
            },
        )
        if obj.statement_pdf_sha256:
            proxy_path = f"{proxy_path}?v={obj.statement_pdf_sha256}"
        return {
            "url": proxy_path,
            "source_url": obj.statement_pdf_url,
            "sha256": obj.statement_pdf_sha256,
            "size_bytes": obj.statement_pdf_size_bytes,
            "page_count": obj.statement_pdf_page_count,
            "language": obj.statement_pdf_language,
            "provenance": obj.statement_pdf_provenance,
            "provenance_label": obj.get_statement_pdf_provenance_display(),
        }

    @extend_schema_field(SeasonLinkSerializer)
    def get_season(self, obj) -> dict:
        return SeasonLinkSerializer(obj.event.season).data

    @extend_schema_field(EventGraphSerializer)
    def get_event(self, obj) -> dict:
        return EventGraphSerializer(obj.event).data

    @extend_schema_field(ProblemSetSerializer(many=True))
    def get_sets(self, obj) -> list[dict]:
        return ProblemSetSerializer(self.context["event_sets"], many=True).data
