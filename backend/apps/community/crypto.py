from __future__ import annotations

import base64
import hashlib
from urllib.parse import urlsplit

from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings

ALLOWED_DISCORD_HOSTS = frozenset({"discord.gg", "discord.com", "www.discord.com"})
KEY_CONTEXT = b"cpuz.community-link.v1\0"


class CommunityLinkConfigurationError(ValueError):
    pass


def _validate_discord_invite_url(url: str) -> str:
    value = url.strip()
    parsed = urlsplit(value)
    host = (parsed.hostname or "").lower()
    path = parsed.path.strip("/")
    try:
        port = parsed.port
    except ValueError as error:
        raise CommunityLinkConfigurationError("Discord invite URL porti noto'g'ri.") from error

    if (
        parsed.scheme != "https"
        or host not in ALLOWED_DISCORD_HOSTS
        or parsed.username
        or parsed.password
        or port not in {None, 443}
        or not path
        or (host != "discord.gg" and not path.startswith("invite/"))
        or parsed.fragment
    ):
        raise CommunityLinkConfigurationError("Faqat HTTPS Discord invite URL ruxsat etiladi.")
    return value


def _fernet(secret_key: str | None = None) -> Fernet:
    secret = secret_key if secret_key is not None else settings.SECRET_KEY
    if not secret:
        raise CommunityLinkConfigurationError("Shifrlash kaliti sozlanmagan.")
    digest = hashlib.sha256(KEY_CONTEXT + secret.encode("utf-8")).digest()
    return Fernet(base64.urlsafe_b64encode(digest))


def encrypt_discord_invite_url(url: str, *, secret_key: str | None = None) -> str:
    value = _validate_discord_invite_url(url)
    return _fernet(secret_key).encrypt(value.encode("utf-8")).decode("ascii")


def decrypt_discord_invite_url(token: str, *, secret_key: str | None = None) -> str:
    if not token:
        raise CommunityLinkConfigurationError("Discord invite tokeni sozlanmagan.")
    try:
        value = _fernet(secret_key).decrypt(token.encode("ascii")).decode("utf-8")
    except (InvalidToken, UnicodeDecodeError, UnicodeEncodeError) as error:
        raise CommunityLinkConfigurationError("Discord invite tokenini ochib bo'lmadi.") from error
    return _validate_discord_invite_url(value)
