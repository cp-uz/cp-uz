from unittest.mock import patch

from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.throttling import (
    LoginIdentityRateThrottle,
    LoginIpRateThrottle,
)


class LoginThrottleTests(TestCase):
    client_ip = "198.51.100.10"
    proxy_ip = "172.18.0.1"
    remote_addr = "172.19.0.5"

    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def tearDown(self):
        cache.clear()

    def post_login(self, username, *, path="/api/v1/auth/login/", spoofed_ip="203.0.113.1"):
        return self.client.post(
            path,
            {"username": username, "password": "wrong-password"},
            format="json",
            REMOTE_ADDR=self.remote_addr,
            HTTP_X_FORWARDED_FOR=f"{spoofed_ip}, {self.client_ip}, {self.proxy_ip}",
        )

    def test_sixth_attempt_for_same_username_and_client_is_throttled(self):
        statuses = [self.post_login("target").status_code for _ in range(6)]

        self.assertEqual(statuses, [401, 401, 401, 401, 401, 429])

    def test_users_behind_one_nat_have_separate_identity_buckets(self):
        for _ in range(5):
            self.assertEqual(self.post_login("first-user").status_code, 401)

        self.assertEqual(self.post_login("second-user").status_code, 401)

    def test_login_aliases_share_one_identity_bucket(self):
        statuses = [
            self.post_login("target", path="/api/v1/auth/login/").status_code
            for _ in range(3)
        ]
        statuses.extend(
            self.post_login("target", path="/api/v1/auth/token/").status_code
            for _ in range(3)
        )

        self.assertEqual(statuses, [401, 401, 401, 401, 401, 429])

    def test_spoofed_forwarded_prefix_does_not_change_client_bucket(self):
        statuses = [
            self.post_login("target", spoofed_ip=f"203.0.113.{index}").status_code
            for index in range(1, 7)
        ]

        self.assertEqual(statuses, [401, 401, 401, 401, 401, 429])

    def test_ip_burst_limit_stops_username_rotation(self):
        with (
            patch.object(LoginIdentityRateThrottle, "get_rate", return_value="5/min"),
            patch.object(LoginIpRateThrottle, "get_rate", return_value="3/min"),
        ):
            statuses = [
                self.post_login(f"user-{index}").status_code
                for index in range(1, 5)
            ]

        self.assertEqual(statuses, [401, 401, 401, 429])
