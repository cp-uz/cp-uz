from django.db import transaction
from rest_framework.exceptions import (
    PermissionDenied,
)
from rest_framework.exceptions import (
    ValidationError as DRFValidationError,
)

from ..models import GuestSession, User
from .credentials import _generate_one_time_password


@transaction.atomic
def upgrade_guest(*, user_id, username, first_name=None, last_name=None):
    user = User.objects.select_for_update().get(pk=user_id)
    guest_session = GuestSession.objects.select_for_update().filter(user_id=user.pk).first()
    if guest_session is None:
        raise PermissionDenied("Faqat mehmon sessiyasini akkauntga aylantirish mumkin.")
    if User.objects.filter(username__iexact=username).exclude(pk=user.pk).exists():
        raise DRFValidationError({"username": ["Bu foydalanuvchi nomi band."]})

    user.username = username
    user.display_name = ""
    updated_fields = ["username", "display_name", "password"]
    if first_name is not None:
        user.first_name = first_name
        updated_fields.append("first_name")
    if last_name is not None:
        user.last_name = last_name
        updated_fields.append("last_name")
    password = _generate_one_time_password(user)
    user.set_password(password)
    user.save(update_fields=updated_fields)
    guest_session.delete()
    return user, password
