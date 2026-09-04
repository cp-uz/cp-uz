from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from ..serializers import (
    CpuzTokenObtainPairSerializer,
    GuestAuthResponseSerializer,
    GuestSessionRequestSerializer,
    UserSummarySerializer,
)
from ..services.guest_sessions import create_guest, resume_guest


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

    _create_guest = staticmethod(create_guest)

    _resume_guest = staticmethod(resume_guest)
