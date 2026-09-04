from django.test import TestCase
from rest_framework.test import APIClient

from apps.seasons.models import Event, PublicationStatus, Season

from .factories import build_public_graph


class SeasonApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.season, cls.route, cls.stage, cls.final = build_public_graph()
        cls.hidden_season = Season.objects.create(
            title="Yopiq mavsum",
            slug="hidden-season",
            start_date="2024-09-01",
            end_date="2025-08-31",
            publication_status=PublicationStatus.DRAFT,
        )
        cls.hidden_event = Event.objects.create(
            season=cls.season,
            code="DRAFT",
            slug="draft-event",
            title="Yopiq tadbir",
            type=Event.Type.STAGE,
            publication_status=PublicationStatus.DRAFT,
        )
        cls.client = APIClient()

    def test_list_only_returns_published_seasons_with_public_event_count(self):
        response = self.client.get("/api/v1/seasons/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["slug"], "2025-2026")
        self.assertEqual(response.data[0]["event_count"], 2)

    def test_graph_is_complete_and_does_not_expose_drafts(self):
        response = self.client.get("/api/v1/seasons/2025-2026/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([route["code"] for route in response.data["routes"]], ["IOI"])
        self.assertEqual([event["code"] for event in response.data["events"]], ["1", "G1"])
        self.assertEqual(len(response.data["edges"]), 1)

        final = response.data["events"][1]
        self.assertEqual(final["resources"][0]["type"], "results")
        self.assertEqual(final["sources"][0]["url"], "https://example.com/ioi")
        self.assertEqual(final["results"][0]["medal"], "silver")
        self.assertEqual(
            final["results"][0]["participant"]["aliases"],
            ["Jakhonali Khaydaraliev"],
        )

    def test_current_returns_featured_graph(self):
        response = self.client.get("/api/v1/seasons/current/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["slug"], "2025-2026")
        self.assertIn("events", response.data)

    def test_event_detail_is_nested_under_season(self):
        response = self.client.get("/api/v1/seasons/2025-2026/events/ioi-2026/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["code"], "G1")
        self.assertEqual(response.data["season"]["slug"], "2025-2026")
        self.assertEqual(response.data["incoming_edges"][0]["from_event_code"], "1")
        self.assertEqual(response.data["sources"][0]["notes"], "Admin uchun manba izohi.")

        wrong_season = self.client.get("/api/v1/seasons/2026-2027/events/ioi-2026/")
        self.assertEqual(wrong_season.status_code, 404)

    def test_draft_event_and_season_are_not_retrievable(self):
        event = self.client.get("/api/v1/seasons/2025-2026/events/draft-event/")
        season = self.client.get("/api/v1/seasons/hidden-season/")
        self.assertEqual(event.status_code, 404)
        self.assertEqual(season.status_code, 404)

    def test_participant_profile_contains_public_accounts_and_season_results(self):
        response = self.client.get("/api/v1/seasons/2025-2026/participants/jahonali-xaydaraliyev/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["full_name"], "Jahonali Xaydaraliyev")
        self.assertEqual(response.data["platform_accounts"][0]["platform"], "codeforces")
        self.assertTrue(response.data["platform_accounts"][0]["is_verified"])
        self.assertEqual(response.data["season_results"][0]["event_slug"], "ioi-2026")
        self.assertEqual(response.data["season_results"][0]["medal"], "silver")

    def test_participant_profile_is_scoped_to_published_season(self):
        response = self.client.get(
            "/api/v1/seasons/hidden-season/participants/jahonali-xaydaraliyev/"
        )
        self.assertEqual(response.status_code, 404)

    def test_published_season_and_event_are_in_sitemap(self):
        response = self.client.get("/sitemap.xml")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, f"/seasons/{self.season.slug}/")
        self.assertContains(
            response,
            f"/seasons/{self.season.slug}/{self.final.slug}/",
        )
        self.assertNotContains(response, f"/seasons/{self.season.slug}/draft-event/")
