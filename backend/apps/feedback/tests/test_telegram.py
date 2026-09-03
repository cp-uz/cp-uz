import json
import re
from html import unescape
from io import BytesIO
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, override_settings

from apps.feedback import telegram


class FakeResponse(BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


@override_settings(
    TELEGRAM_BOT_TOKEN="test-token",
    TELEGRAM_FEEDBACK_CHAT_ID="123456",
    TELEGRAM_WEBHOOK_SECRET="test_webhook_secret_value_1234567890",
    TELEGRAM_API_TIMEOUT_SECONDS=5,
    TELEGRAM_PROXY_URL="",
    SITE_URL="https://cp.uz",
)
class TelegramServiceTests(SimpleTestCase):
    @patch("apps.feedback.telegram.urlopen")
    def test_webhook_is_configured_with_secret_header_contract(self, urlopen):
        urlopen.return_value = FakeResponse(json.dumps({"ok": True, "result": True}).encode())

        telegram.configure_webhook()

        request = urlopen.call_args.args[0]
        body = request.data.decode()
        self.assertIn("https%3A%2F%2Fcp.uz%2Fapi%2Fv1%2Ftelegram%2Fwebhook%2F", body)
        self.assertIn("secret_token=test_webhook_secret_value_1234567890", body)
        self.assertNotIn("test-token", body)

    @override_settings(TELEGRAM_PROXY_URL="http://proxy.example:8080")
    @patch("apps.feedback.telegram.build_opener")
    def test_telegram_proxy_is_used_when_configured(self, build_opener):
        build_opener.return_value.open.return_value = FakeResponse(
            json.dumps({"ok": True, "result": {"message_id": 7}}).encode()
        )

        telegram.send_message("123456", "Test")

        build_opener.assert_called_once()
        build_opener.return_value.open.assert_called_once()

    @patch("apps.feedback.telegram._api_call")
    def test_photo_is_forwarded_as_one_message_with_caption(self, api_call):
        api_call.return_value = {"ok": True, "result": {"message_id": 42}}
        submission = type(
            "Submission",
            (),
            {
                "full_name": "Ali",
                "contact": "@ali",
                "note": "Salom",
                "id": "feedback-id",
            },
        )()
        photo = SimpleUploadedFile("photo.jpg", b"jpeg", "image/jpeg")

        message_id = telegram.send_feedback(submission, photo)

        self.assertEqual(message_id, 42)
        api_call.assert_called_once()
        self.assertEqual(api_call.call_args.args[0], "sendPhoto")
        self.assertIs(api_call.call_args.args[2][1], photo)
        fields = api_call.call_args.args[1]
        self.assertIn("<b>Ism:</b> Ali", fields["caption"])
        self.assertIn("<b>Izoh:</b>\nSalom", fields["caption"])
        self.assertNotIn("feedback-id", fields["caption"])
        self.assertEqual(fields["parse_mode"], "HTML")

    @patch("apps.feedback.telegram._api_call")
    def test_document_is_forwarded_as_one_message_with_caption(self, api_call):
        api_call.return_value = {"ok": True, "result": {"message_id": 44}}
        submission = type(
            "Submission",
            (),
            {"full_name": "Ali", "contact": "", "note": "Salom", "id": "feedback-id"},
        )()
        document = SimpleUploadedFile("proof.pdf", b"pdf", "application/pdf")

        message_id = telegram.send_feedback(submission, document)

        self.assertEqual(message_id, 44)
        api_call.assert_called_once()
        self.assertEqual(api_call.call_args.args[0], "sendDocument")
        self.assertIs(api_call.call_args.args[2][1], document)
        self.assertNotIn("<b>Aloqa:</b>", api_call.call_args.args[1]["caption"])
        self.assertNotIn("feedback-id", api_call.call_args.args[1]["caption"])

    @patch("apps.feedback.telegram._api_call")
    def test_attachment_caption_stays_within_telegram_limit(self, api_call):
        api_call.return_value = {"ok": True, "result": {"message_id": 45}}
        submission = type(
            "Submission",
            (),
            {"full_name": "Ali", "contact": "@ali", "note": "a" * 3000},
        )()
        photo = SimpleUploadedFile("photo.jpg", b"jpeg", "image/jpeg")

        telegram.send_feedback(submission, photo)

        caption = api_call.call_args.args[1]["caption"]
        visible_caption = unescape(re.sub(r"<[^>]+>", "", caption))
        self.assertLessEqual(len(visible_caption), telegram.TELEGRAM_CAPTION_LIMIT)
        self.assertTrue(visible_caption.endswith("…"))
