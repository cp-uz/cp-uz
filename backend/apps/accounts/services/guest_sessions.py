import secrets
import uuid

from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import (
    AuthenticationFailed,
)

from ..models import GuestSession, User

INVALID_GUEST_HASH = make_password("invalid-guest-session-placeholder")


@transaction.atomic
def create_guest():
    identity = uuid.uuid4()
    user = User(
        username=f"guest_{identity.hex}",
        display_name="Mehmon",
        public_profile=False,
    )
    user.set_unusable_password()
    user.save()
    secret = secrets.token_urlsafe(32)
    session = GuestSession.objects.create(
        user=user,
        public_id=identity,
        secret_hash=make_password(secret),
    )
    return user, f"{session.public_id}.{secret}"


def resume_guest(credential):
    try:
        public_id_raw, secret = credential.split(".", 1)
        public_id = uuid.UUID(public_id_raw)
    except (ValueError, AttributeError):
        check_password("invalid", INVALID_GUEST_HASH)
        raise AuthenticationFailed("Guest sessiya tokeni yaroqsiz.") from None

    session = GuestSession.objects.select_related("user").filter(public_id=public_id).first()
    encoded_hash = session.secret_hash if session else INVALID_GUEST_HASH
    if not session or not check_password(secret, encoded_hash) or not session.user.is_active:
        raise AuthenticationFailed("Guest sessiya tokeni yaroqsiz.")
    GuestSession.objects.filter(pk=session.pk).update(last_seen_at=timezone.now())
    return session.user, credential
