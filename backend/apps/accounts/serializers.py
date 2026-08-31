import re

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSummarySerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    is_guest = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "name",
            "avatar_url",
            "github_url",
            "is_guest",
        )


class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "display_name",
            "name",
            "bio",
            "avatar_url",
            "github_url",
            "preferred_language",
            "public_profile",
            "is_guest",
            "date_joined",
        )
        read_only_fields = ("id", "username", "date_joined", "name", "is_guest")


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


RESERVED_USERNAMES = frozenset(
    {
        "admin",
        "administrator",
        "anonymous",
        "api",
        "cp_uz",
        "cpuz",
        "guest",
        "login",
        "logout",
        "me",
        "moderator",
        "register",
        "root",
        "staff",
        "support",
        "system",
    }
)
USERNAME_PATTERN = re.compile(r"^[a-z][a-z0-9_-]{2,29}$")


class GuestUpgradeRequestSerializer(serializers.Serializer):
    username = serializers.CharField(
        min_length=3,
        max_length=30,
        trim_whitespace=True,
        error_messages={
            "blank": "Foydalanuvchi nomini kiriting.",
            "min_length": "Foydalanuvchi nomi kamida 3 belgidan iborat bo‘lishi kerak.",
            "max_length": "Foydalanuvchi nomi 30 belgidan oshmasligi kerak.",
        },
    )
    first_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=150,
        trim_whitespace=True,
        help_text="Ixtiyoriy ism. Bo‘sh qiymat qabul qilinadi.",
        error_messages={"max_length": "Ism 150 belgidan oshmasligi kerak."},
    )
    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=150,
        trim_whitespace=True,
        help_text="Ixtiyoriy familiya. Bo‘sh qiymat qabul qilinadi.",
        error_messages={"max_length": "Familiya 150 belgidan oshmasligi kerak."},
    )

    def validate_username(self, value):
        username = value.lower()
        if not USERNAME_PATTERN.fullmatch(username):
            raise serializers.ValidationError(
                "Foydalanuvchi nomi kichik harf bilan boshlanishi va faqat lotin harflari, "
                "raqam, '_' yoki '-' belgilaridan iborat bo‘lishi kerak."
            )
        if username in RESERVED_USERNAMES or username.startswith("guest_"):
            raise serializers.ValidationError("Bu foydalanuvchi nomidan foydalanib bo‘lmaydi.")

        request = self.context.get("request")
        queryset = User.objects.filter(username__iexact=username)
        if request and request.user.is_authenticated:
            queryset = queryset.exclude(pk=request.user.pk)
        if queryset.exists():
            raise serializers.ValidationError("Bu foydalanuvchi nomi band.")
        return username


class GuestUpgradeResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    username = serializers.CharField()
    one_time_password = serializers.CharField(
        help_text="Faqat shu javobda ko‘rsatiladigan, server yaratgan parol."
    )
    user = UserSummarySerializer()
