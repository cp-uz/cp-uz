from django.db import IntegrityError
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.exceptions import (
    PermissionDenied,
)
from rest_framework.exceptions import (
    ValidationError as DRFValidationError,
)
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from ..serializers import (
    CpuzTokenObtainPairSerializer,
    GuestUpgradeRequestSerializer,
    GuestUpgradeResponseSerializer,
    UserSummarySerializer,
)
from ..services.guest_upgrade import upgrade_guest


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

    _upgrade_guest = staticmethod(upgrade_guest)
