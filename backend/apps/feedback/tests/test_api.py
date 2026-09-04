from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from apps.feedback.models import FeedbackSubmission
from apps.feedback.serializers import MAX_ATTACHMENT_SIZE
from apps.feedback.telegram import TelegramAPIError


@override_settings(
    TELEGRAM_BOT_TOKEN="test-token",
    TELEGRAM_FEEDBACK_CHAT_ID="123456",
    TELEGRAM_WEBHOOK_SECRET="test_webhook_secret_value_1234567890",
    REST_FRAMEWORK={
        "DEFAULT_THROTTLE_RATES": {"feedback": "1000/hour"},
        "EXCEPTION_HANDLER": "common.exceptions.api_exception_handler",
    },
)
class FeedbackAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_contract_endpoint_exposes_attachment_limit(self):
        response = self.client.get(reverse("feedback:create"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["max_attachment_bytes"], MAX_ATTACHMENT_SIZE)

    @patch("apps.feedback.telegram.send_feedback", return_value=812)
    def test_submission_is_saved_without_attachment_and_delivered(self, send_feedback):
        attachment = SimpleUploadedFile("proof.pdf", b"%PDF-example", "application/pdf")

        response = self.client.post(
            reverse("feedback:create"),
            {
                "full_name": "Ali Valiyev",
                "contact": "@alivaliyev",
                "note": "Yangi material qo‘shishni taklif qilaman.",
                "attachment": attachment,
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        submission = FeedbackSubmission.objects.get()
        self.assertEqual(submission.delivery_status, FeedbackSubmission.DeliveryStatus.SENT)
        self.assertEqual(submission.telegram_message_id, 812)
        self.assertFalse(any(field.name == "attachment" for field in submission._meta.fields))
        send_feedback.assert_called_once()

    @patch("apps.feedback.telegram.send_feedback", return_value=813)
    def test_contact_is_optional(self, _send_feedback):
        response = self.client.post(
            reverse("feedback:create"),
            {
                "full_name": "Ali Valiyev",
                "note": "Aloqasiz murojaat.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(FeedbackSubmission.objects.get().contact, "")

    @patch("apps.feedback.telegram.send_feedback")
    def test_attachment_over_five_megabytes_is_rejected(self, send_feedback):
        attachment = SimpleUploadedFile(
            "too-large.pdf",
            b"x" * (MAX_ATTACHMENT_SIZE + 1),
            "application/pdf",
        )

        response = self.client.post(
            reverse("feedback:create"),
            {
                "full_name": "Ali Valiyev",
                "contact": "ali@example.com",
                "note": "Test",
                "attachment": attachment,
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(FeedbackSubmission.objects.count(), 0)
        send_feedback.assert_not_called()

    @patch(
        "apps.feedback.telegram.send_feedback",
        side_effect=TelegramAPIError("unavailable"),
    )
    def test_failed_delivery_is_recorded(self, _send_feedback):
        response = self.client.post(
            reverse("feedback:create"),
            {
                "full_name": "Ali Valiyev",
                "contact": "ali@example.com",
                "note": "Test",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 502)
        submission = FeedbackSubmission.objects.get()
        self.assertEqual(submission.delivery_status, FeedbackSubmission.DeliveryStatus.FAILED)
        self.assertNotEqual(submission.delivery_error, "")

    @patch("apps.feedback.telegram.send_message")
    def test_webhook_requires_secret_header_and_handles_admin_command(self, send_message):
        url = reverse("feedback:telegram-webhook")
        update = {"message": {"chat": {"id": 123456}, "text": "/start"}}

        denied = self.client.post(url, update, format="json")
        accepted = self.client.post(
            url,
            update,
            format="json",
            HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN="test_webhook_secret_value_1234567890",
        )

        self.assertEqual(denied.status_code, 403)
        self.assertEqual(accepted.status_code, 200)
        send_message.assert_called_once()

    @patch("apps.feedback.telegram.send_message")
    def test_webhook_ignores_commands_from_other_chats(self, send_message):
        response = self.client.post(
            reverse("feedback:telegram-webhook"),
            {"message": {"chat": {"id": 999}, "text": "/help"}},
            format="json",
            HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN="test_webhook_secret_value_1234567890",
        )

        self.assertEqual(response.status_code, 200)
        send_message.assert_not_called()
