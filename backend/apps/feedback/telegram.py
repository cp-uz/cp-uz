from __future__ import annotations

import html
import json
import secrets
import uuid
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import ProxyHandler, Request, build_opener, urlopen

from django.conf import settings

from .models import FeedbackSubmission


class TelegramConfigurationError(RuntimeError):
    pass


class TelegramAPIError(RuntimeError):
    pass


TELEGRAM_CAPTION_LIMIT = 1024


def is_configured() -> bool:
    return bool(settings.TELEGRAM_BOT_TOKEN and settings.TELEGRAM_FEEDBACK_CHAT_ID)


def _api_call(method: str, fields: dict[str, str], file_field=None) -> dict:
    if not settings.TELEGRAM_BOT_TOKEN:
        raise TelegramConfigurationError("Telegram bot sozlanmagan.")

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/{method}"
    headers = {"User-Agent": "cp.uz feedback service"}
    if file_field is None:
        body = urlencode(fields).encode()
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    else:
        field_name, upload = file_field
        boundary = f"----cpuz-{uuid.uuid4().hex}"
        chunks: list[bytes] = []
        for name, value in fields.items():
            chunks.extend(
                [
                    f"--{boundary}\r\n".encode(),
                    f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
                    value.encode("utf-8"),
                    b"\r\n",
                ]
            )
        filename = Path(upload.name).name.replace('"', "") or "attachment"
        content_type = (
            (getattr(upload, "content_type", "") or "application/octet-stream")
            .replace("\r", "")
            .replace("\n", "")
        )
        upload.seek(0)
        chunks.extend(
            [
                f"--{boundary}\r\n".encode(),
                (
                    f'Content-Disposition: form-data; name="{field_name}"; '
                    f'filename="{filename}"\r\n'
                ).encode(),
                f"Content-Type: {content_type}\r\n\r\n".encode(),
                upload.read(),
                b"\r\n",
                f"--{boundary}--\r\n".encode(),
            ]
        )
        body = b"".join(chunks)
        headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"

    request = Request(url, data=body, headers=headers, method="POST")
    try:
        if settings.TELEGRAM_PROXY_URL:
            proxy_handler = ProxyHandler(
                {"http": settings.TELEGRAM_PROXY_URL, "https": settings.TELEGRAM_PROXY_URL}
            )
            response_context = build_opener(proxy_handler).open(  # noqa: S310
                request, timeout=settings.TELEGRAM_API_TIMEOUT_SECONDS
            )
        else:
            response_context = urlopen(  # noqa: S310
                request, timeout=settings.TELEGRAM_API_TIMEOUT_SECONDS
            )
        with response_context as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, UnicodeError, json.JSONDecodeError) as error:
        raise TelegramAPIError("Telegram API bilan bog‘lanib bo‘lmadi.") from error

    if not payload.get("ok") or not isinstance(payload.get("result"), (dict, bool)):
        raise TelegramAPIError("Telegram API so‘rovni qabul qilmadi.")
    return payload


def send_message(chat_id: str, text: str) -> dict:
    return _api_call(
        "sendMessage",
        {"chat_id": str(chat_id), "text": text, "parse_mode": "HTML"},
    )["result"]


def _feedback_text(submission: FeedbackSubmission, *, max_visible_length: int | None = None) -> str:
    contact_line = (
        f"\n<b>Aloqa:</b> {html.escape(submission.contact)}" if submission.contact else ""
    )
    visible_contact_line = f"\nAloqa: {submission.contact}" if submission.contact else ""
    visible_prefix = (
        f"cp.uz — yangi murojaat\n\nIsm: {submission.full_name}{visible_contact_line}\n\nIzoh:\n"
    )
    note = submission.note
    if max_visible_length is not None and len(visible_prefix) + len(note) > max_visible_length:
        available = max(1, max_visible_length - len(visible_prefix))
        note = f"{note[: available - 1].rstrip()}…"
    return (
        "<b>cp.uz — yangi murojaat</b>\n\n"
        f"<b>Ism:</b> {html.escape(submission.full_name)}"
        f"{contact_line}\n\n"
        f"<b>Izoh:</b>\n{html.escape(note)}"
    )


def send_feedback(submission: FeedbackSubmission, attachment=None) -> int:
    if attachment is None:
        text = _feedback_text(submission)
        result = send_message(settings.TELEGRAM_FEEDBACK_CHAT_ID, text)
        return int(result["message_id"])

    text = _feedback_text(submission, max_visible_length=TELEGRAM_CAPTION_LIMIT)
    content_type = (getattr(attachment, "content_type", "") or "").lower()
    method = "sendPhoto" if content_type.startswith("image/") else "sendDocument"
    field_name = "photo" if method == "sendPhoto" else "document"
    result = _api_call(
        method,
        {
            "chat_id": str(settings.TELEGRAM_FEEDBACK_CHAT_ID),
            "caption": text,
            "parse_mode": "HTML",
        },
        (field_name, attachment),
    )["result"]
    return int(result["message_id"])


def configure_webhook(*, drop_pending_updates: bool = False) -> dict:
    if not is_configured() or not settings.TELEGRAM_WEBHOOK_SECRET:
        raise TelegramConfigurationError("Telegram webhook sozlamalari to‘liq emas.")
    secret_value = settings.TELEGRAM_WEBHOOK_SECRET
    valid_secret = 32 <= len(secret_value) <= 256 and all(
        character.isalnum() or character in "_-" for character in secret_value
    )
    if not valid_secret:
        raise TelegramConfigurationError("Telegram webhook secret formati yaroqsiz.")

    return _api_call(
        "setWebhook",
        {
            "url": f"{settings.SITE_URL}/api/v1/telegram/webhook/",
            "secret_token": settings.TELEGRAM_WEBHOOK_SECRET,
            "allowed_updates": json.dumps(["message"]),
            "drop_pending_updates": "true" if drop_pending_updates else "false",
        },
    )


def webhook_secret_matches(candidate: str) -> bool:
    expected = settings.TELEGRAM_WEBHOOK_SECRET
    return bool(expected and candidate and secrets.compare_digest(candidate, expected))
