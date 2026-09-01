from apps.seasons.models import (
    Event,
    EventEdge,
    EventResource,
    EventRoute,
    EventSource,
    Participant,
    ParticipantAlias,
    ParticipantPlatformAccount,
    PublicationStatus,
    ResultEntry,
    Route,
    Season,
    VerificationStatus,
)


def build_public_graph():
    season = Season.objects.create(
        title="2025–2026 mavsumi",
        slug="2025-2026",
        summary="Sport dasturlash olimpiadalari mavsumi.",
        start_date="2025-09-01",
        end_date="2026-08-31",
        publication_status=PublicationStatus.PUBLISHED,
        verification_status=VerificationStatus.VERIFIED,
        is_featured=True,
        order=2026,
    )
    route = Route.objects.create(
        season=season,
        code="IOI",
        title="IOI yo‘nalishi",
        kind=Route.Kind.SELECTION,
        color=Route.Color.BLUE,
    )
    stage = Event.objects.create(
        season=season,
        code="1",
        slug="maktab-bosqichi",
        title="Maktab bosqichi",
        summary="Olimpiadaning boshlang‘ich bosqichi.",
        type=Event.Type.STAGE,
        publication_status=PublicationStatus.PUBLISHED,
        event_status=Event.Status.COMPLETED,
        verification_status=VerificationStatus.VERIFIED,
        date_precision=Event.DatePrecision.DAY,
        start_date="2025-09-20",
        mode=Event.Mode.ONSITE,
        order=1,
    )
    final = Event.objects.create(
        season=season,
        code="G1",
        slug="ioi-2026",
        title="IOI 2026",
        summary="Xalqaro informatika olimpiadasi.",
        description="Toshkentda o‘tkazilgan xalqaro final.",
        type=Event.Type.INTERNATIONAL,
        publication_status=PublicationStatus.PUBLISHED,
        event_status=Event.Status.COMPLETED,
        verification_status=VerificationStatus.VERIFIED,
        date_precision=Event.DatePrecision.RANGE,
        start_date="2026-08-09",
        end_date="2026-08-16",
        location="Toshkent, O‘zbekiston",
        mode=Event.Mode.ONSITE,
        order=2,
    )
    EventRoute.objects.create(event=stage, route=route, order=1)
    EventRoute.objects.create(
        event=final, route=route, order=2, node_style=EventRoute.NodeStyle.FINAL
    )
    EventEdge.objects.create(
        season=season,
        from_event=stage,
        to_event=final,
        route=route,
        relation_type=EventEdge.RelationType.QUALIFIES_TO,
    )
    EventResource.objects.create(
        event=final,
        type=EventResource.Type.RESULTS,
        title="Rasmiy natijalar",
        url="https://example.com/ioi/results",
        is_official=True,
    )
    EventSource.objects.create(
        event=final,
        type=EventSource.Type.OFFICIAL,
        title="Rasmiy sayt",
        url="https://example.com/ioi",
        is_primary=True,
        notes="Admin uchun manba izohi.",
    )
    participant = Participant.objects.create(
        full_name="Jahonali Xaydaraliyev",
        slug="jahonali-xaydaraliyev",
        country_code="UZB",
    )
    ParticipantAlias.objects.create(
        participant=participant,
        name="Jakhonali Khaydaraliev",
    )
    ParticipantPlatformAccount.objects.create(
        participant=participant,
        platform=ParticipantPlatformAccount.Platform.CODEFORCES,
        handle="jahonali",
        url="https://codeforces.com/profile/jahonali",
        is_verified=True,
    )
    ResultEntry.objects.create(
        event=final,
        source_key="participant:jahonali-xaydaraliyev",
        participant=participant,
        rank=12,
        medal=ResultEntry.Medal.SILVER,
        is_local=True,
    )
    return season, route, stage, final
