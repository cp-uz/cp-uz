from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from ..serializers import (
    CpuzTokenObtainPairSerializer,
)
from ..throttles import LoginIPThrottle, LoginUsernameThrottle


class CpuzTokenObtainPairView(TokenObtainPairView):
    serializer_class = CpuzTokenObtainPairSerializer
    throttle_classes = [LoginIPThrottle, LoginUsernameThrottle]


class CpuzTokenRefreshView(TokenRefreshView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "token_refresh"
