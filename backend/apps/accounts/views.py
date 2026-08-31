import secrets
import uuid

from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError, transaction
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.exceptions import (
    AuthenticationFailed,
    PermissionDenied,
)
from rest_framework.exceptions import (
    ValidationError as DRFValidationError,
)
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import GuestSession, User
from .serializers import (
    CpuzTokenObtainPairSerializer,
    GuestAuthResponseSerializer,
    GuestSessionRequestSerializer,
    GuestUpgradeRequestSerializer,
    GuestUpgradeResponseSerializer,
    UserProfileSerializer,
    UserSummarySerializer,
)

INVALID_GUEST_HASH = make_password("invalid-guest-session-placeholder")
UPGRADE_PASSWORD_ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%_-"


def _generate_one_time_password(user):
    random = secrets.SystemRandom()
    while True:
        characters = [
            secrets.choice("abcdefghijkmnopqrstuvwxyz"),
            secrets.choice("ABCDEFGHJKLMNPQRSTUVWXYZ"),
            secrets.choice("23456789"),
            secrets.choice("!@#$%_-"),
        ]
        characters.extend(secrets.choice(UPGRADE_PASSWORD_ALPHABET) for _ in range(16))
        random.shuffle(characters)
        password = "".join(characters)
        try:
            validate_password(password, user=user)
        except DjangoValidationError:
            continue
        return password


class CpuzTokenObtainPairView(TokenObtainPairView):
    serializer_class = CpuzTokenObtainPairSerializer


@extend_schema(
    tags=["Authentication"],
    request=GuestSessionRequestSerializer,
    responses={200: GuestAuthResponseSerializer, 201: GuestAuthResponseSerializer},
)
class GuestSessionView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "guest_session"

    def post(self, request):
        serializer = GuestSessionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        credential = serializer.validated_data.get("session_token")
        if credential:
            guest, credential = self._resume_guest(credential)
            created = False
        else:
            guest, credential = self._create_guest()
            created = True

        refresh = CpuzTokenObtainPairSerializer.get_token(guest)
        payload = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "session_token": credential,
            "created": created,
            "user": UserSummarySerializer(guest).data,
        }
        return Response(payload, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @staticmethod
    @transaction.atomic
    def _create_guest():
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

    @staticmethod
    def _resume_guest(credential):
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


@extend_schema(
    tags=["Authentication"],
    request=GuestUpgradeRequestSerializer,
    responses={200: GuestUpgradeResponseSerializer},
)
class GuestUpgradeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "guest_upgrade"

    def post(self, request):
        if not request.user.is_guest:
            raise PermissionDenied("Faqat mehmon sessiyasini akkauntga aylantirish mumkin.")

        serializer = GuestUpgradeRequestSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        try:
            user, password = self._upgrade_guest(
                user_id=request.user.pk,
                username=serializer.validated_data["username"],
                first_name=serializer.validated_data.get("first_name"),
                last_name=serializer.validated_data.get("last_name"),
            )
        except IntegrityError:
            raise DRFValidationError({"username": ["Bu foydalanuvchi nomi band."]}) from None

        refresh = CpuzTokenObtainPairSerializer.get_token(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "one_time_password": password,
                "user": UserSummarySerializer(user).data,
            }
        )

    @staticmethod
    @transaction.atomic
    def _upgrade_guest(*, user_id, username, first_name=None, last_name=None):
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


@extend_schema(tags=["Account"])
class CurrentUserView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
