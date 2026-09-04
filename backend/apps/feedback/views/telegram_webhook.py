import logging

from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .. import telegram

logger = logging.getLogger(__name__)


class TelegramWebhookView(APIView):
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)
    parser_classes = (JSONParser,)

    @extend_schema(exclude=True)
    def post(self, request):
        supplied_secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token", "")
        if not telegram.webhook_secret_matches(supplied_secret):
            return Response(status=status.HTTP_403_FORBIDDEN)

        message = request.data.get("message") if isinstance(request.data, dict) else None
        if not isinstance(message, dict):
            return Response({"ok": True})

        chat = message.get("chat")
        text = message.get("text")
        if not isinstance(chat, dict) or not isinstance(text, str):
            return Response({"ok": True})

        if str(chat.get("id", "")) != str(settings.TELEGRAM_FEEDBACK_CHAT_ID):
            return Response({"ok": True})

        command = text.split(maxsplit=1)[0].split("@", 1)[0].lower()
        if command in {"/start", "/help"}:
            try:
                telegram.send_message(
                    str(chat["id"]),
                    "<b>cp.uz feedback boti ishlayapti.</b>\n"
                    "Saytdagi murojaatlar shu chatga keladi.",
                )
            except (telegram.TelegramAPIError, telegram.TelegramConfigurationError):
                logger.warning("Telegram webhook command response failed")

        return Response({"ok": True})
