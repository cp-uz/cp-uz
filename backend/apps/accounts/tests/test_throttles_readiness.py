from unittest.mock import patch

from django.core.cache import cache
from django.test import TestCase
from rest_framework.settings import api_settings
from rest_framework.test import APIClient, APIRequestFactory
from rest_framework.throttling import ScopedRateThrottle


class ThrottleReadinessTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_login_username_limit_applies_across_login_aliases(self):
        client = APIClient()
        for index in range(10):
            path = "/api/v1/auth/login/" if index % 2 else "/api/v1/auth/token/"
            response = client.post(path, {"username": "unknown", "password": "bad"}, format="json")
            self.assertEqual(response.status_code, 401)
        response = client.post(
            "/api/v1/auth/login/", {"username": "UNKNOWN", "password": "bad"}, format="json"
        )
        self.assertEqual(response.status_code, 429)

    def test_forwarded_prefix_cannot_change_identity_behind_two_trusted_proxies(self):
        factory = APIRequestFactory()
        throttle = ScopedRateThrottle()
        with patch.object(api_settings, "NUM_PROXIES", 2):
            identities = [
                throttle.get_ident(
                    factory.get(
                        "/",
                        REMOTE_ADDR="172.18.0.2",
                        HTTP_X_FORWARDED_FOR=f"{prefix}, 198.51.100.5, 172.18.0.1",
                    )
                )
                for prefix in ("forged-one", "forged-two")
            ]
        self.assertEqual(identities, ["198.51.100.5", "198.51.100.5"])

    def test_readiness_detects_unavailable_cache(self):
        with patch("common.health.cache.set", side_effect=ConnectionError("Redis unavailable")):
            response = self.client.get("/api/v1/health/")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["cache"], "unavailable")
        response = self.client.get("/api/v1/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["cache"], "ok")
