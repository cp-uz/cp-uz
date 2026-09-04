from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .profile import UserSummarySerializer


class CpuzTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["name"] = user.name
        token["is_staff"] = user.is_staff
        token["is_guest"] = user.is_guest
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSummarySerializer(self.user).data
        return data


class GuestSessionRequestSerializer(serializers.Serializer):
    session_token = serializers.CharField(required=False, allow_blank=False, max_length=180)


class GuestAuthResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    session_token = serializers.CharField()
    created = serializers.BooleanField()
    user = UserSummarySerializer()
