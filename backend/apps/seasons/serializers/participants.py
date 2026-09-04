from rest_framework import serializers

from ..models import (
    Participant,
    ParticipantPlatformAccount,
    ResultEntry,
    Team,
    TeamMember,
)


class ParticipantPlatformAccountSerializer(serializers.ModelSerializer):
    platform_label = serializers.CharField(source="get_platform_display", read_only=True)

    class Meta:
        model = ParticipantPlatformAccount
        fields = (
            "id",
            "platform",
            "platform_label",
            "handle",
            "url",
            "title",
            "is_verified",
            "order",
        )


class ParticipantSerializer(serializers.ModelSerializer):
    aliases = serializers.SerializerMethodField()

    class Meta:
        model = Participant
        fields = (
            "id",
            "full_name",
            "slug",
            "country_code",
            "region",
            "school",
            "handle",
            "bio",
            "photo_url",
            "aliases",
        )

    def get_aliases(self, obj) -> list[str]:
        return [alias.name for alias in obj.aliases.all()]


class ParticipantSeasonResultSerializer(serializers.ModelSerializer):
    event_slug = serializers.CharField(source="event.slug", read_only=True)
    event_title = serializers.CharField(source="event.title", read_only=True)
    event_short_title = serializers.CharField(source="event.short_title", read_only=True)
    event_start_date = serializers.DateField(
        source="event.start_date", read_only=True, allow_null=True
    )
    event_end_date = serializers.DateField(source="event.end_date", read_only=True, allow_null=True)

    class Meta:
        model = ResultEntry
        fields = (
            "id",
            "event_slug",
            "event_title",
            "event_short_title",
            "event_start_date",
            "event_end_date",
            "rank",
            "score",
            "score_label",
            "medal",
            "award_title",
            "category",
            "result_url",
            "order",
        )


class ParticipantDetailSerializer(ParticipantSerializer):
    platform_accounts = ParticipantPlatformAccountSerializer(many=True, read_only=True)
    season_results = ParticipantSeasonResultSerializer(many=True, read_only=True)

    class Meta(ParticipantSerializer.Meta):
        fields = ParticipantSerializer.Meta.fields + ("platform_accounts", "season_results")


class TeamMemberSerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True)

    class Meta:
        model = TeamMember
        fields = ("role", "order", "participant")


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ("id", "name", "code", "country_code", "school", "members")


class ResultEntrySerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True, allow_null=True)
    team = TeamSerializer(read_only=True, allow_null=True)

    class Meta:
        model = ResultEntry
        fields = (
            "id",
            "rank",
            "score",
            "score_label",
            "medal",
            "award_title",
            "category",
            "is_local",
            "result_url",
            "notes",
            "order",
            "participant",
            "team",
        )
