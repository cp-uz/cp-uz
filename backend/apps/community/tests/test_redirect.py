from django.test import SimpleTestCase, override_settings
from django.urls import reverse

from apps.community.crypto import (
    CommunityLinkConfigurationError,
    decrypt_discord_invite_url,
    encrypt_discord_invite_url,
)

TEST_SECRET = "community-test-secret"
TEST_INVITE = "https://discord.gg/example-code"


class CommunityLinkCryptoTests(SimpleTestCase):
    def test_invite_round_trip_uses_opaque_ciphertext(self):
        token = encrypt_discord_invite_url(TEST_INVITE, secret_key=TEST_SECRET)

        self.assertNotIn("discord", token.lower())
        self.assertNotIn("example-code", token)
        self.assertEqual(
            decrypt_discord_invite_url(token, secret_key=TEST_SECRET),
            TEST_INVITE,
        )

    def test_non_discord_destination_is_rejected(self):
        with self.assertRaises(CommunityLinkConfigurationError):
            encrypt_discord_invite_url(
                "https://example.com/discord.gg/example-code",
                secret_key=TEST_SECRET,
            )

    def test_non_invite_discord_page_is_rejected(self):
        with self.assertRaises(CommunityLinkConfigurationError):
            encrypt_discord_invite_url(
                "https://discord.com/channels/example",
                secret_key=TEST_SECRET,
            )


class DiscordRedirectTests(SimpleTestCase):
    @override_settings(SECRET_KEY=TEST_SECRET)
    def test_redirect_opens_the_decrypted_invite_without_caching(self):
        token = encrypt_discord_invite_url(TEST_INVITE, secret_key=TEST_SECRET)

        with override_settings(DISCORD_INVITE_URL_ENCRYPTED=token):
            response = self.client.get(reverse("community:discord"))

        self.assertRedirects(response, TEST_INVITE, fetch_redirect_response=False)
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        self.assertEqual(response.headers["Referrer-Policy"], "no-referrer")
        self.assertEqual(response.headers["X-Robots-Tag"], "noindex, nofollow")

    @override_settings(DISCORD_INVITE_URL_ENCRYPTED="not-a-valid-token")
    def test_invalid_token_is_not_exposed(self):
        response = self.client.get(reverse("community:discord"))

        self.assertEqual(response.status_code, 404)
        self.assertNotContains(response, "discord.gg", status_code=404)
