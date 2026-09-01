from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.seasons.models import (
    Event,
    EventEdge,
    EventRoute,
    Participant,
    ResultEntry,
    Route,
    Season,
)


class SeasonModelValidationTests(TestCase):
    def setUp(self):
        self.season = Season.objects.create(
            title="2025–2026",
            slug="2025-2026",
            start_date="2025-09-01",
            end_date="2026-08-31",
        )
        self.other_season = Season.objects.create(
            title="2026–2027",
            slug="2026-2027",
            start_date="2026-09-01",
            end_date="2027-09-30",
        )
        self.event = Event.objects.create(
            season=self.season,
            code="1",
            slug="first-stage",
            title="Birinchi bosqich",
            type=Event.Type.STAGE,
        )

    def test_tba_event_rejects_exact_dates(self):
        self.event.start_date = "2025-10-01"
        with self.assertRaises(ValidationError):
            self.event.full_clean()

    def test_cross_season_membership_and_edge_are_rejected(self):
        other_route = Route.objects.create(
            season=self.other_season,
            code="IOI",
            title="IOI",
            kind=Route.Kind.SELECTION,
        )
        membership = EventRoute(event=self.event, route=other_route)
        with self.assertRaises(ValidationError):
            membership.full_clean()

        other_event = Event.objects.create(
            season=self.other_season,
            code="2",
            slug="second-stage",
            title="Ikkinchi bosqich",
            type=Event.Type.STAGE,
        )
        edge = EventEdge(
            season=self.season,
            from_event=self.event,
            to_event=other_event,
            relation_type=EventEdge.RelationType.RELATED_TO,
        )
        with self.assertRaises(ValidationError):
            edge.full_clean()

    def test_result_requires_exactly_one_subject(self):
        participant = Participant.objects.create(full_name="A A", slug="a-a")
        empty = ResultEntry(event=self.event)
        with self.assertRaises(ValidationError):
            empty.full_clean()

        invalid = ResultEntry(event=self.event, participant=participant)
        invalid.team_id = "00000000-0000-0000-0000-000000000001"
        with self.assertRaises(ValidationError):
            invalid.full_clean()
