from rest_framework import serializers

from ..models import User


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


class AccountDeleteSerializer(serializers.Serializer):
    confirmation = serializers.CharField(
        max_length=20,
        trim_whitespace=False,
        help_text='Akkauntni o‘chirishni tasdiqlash uchun aynan "O‘CHIRISH" deb yuboring.',
    )
    password = serializers.CharField(
        required=False,
        allow_blank=False,
        max_length=128,
        trim_whitespace=False,
        write_only=True,
        style={"input_type": "password"},
        help_text="Oddiy akkaunt uchun joriy parol majburiy; mehmon akkaunti uchun yuborilmaydi.",
    )

    def validate_confirmation(self, value):
        if value != "O‘CHIRISH":
            raise serializers.ValidationError('Tasdiqlash uchun aynan "O‘CHIRISH" deb yozing.')
        return value

    def validate(self, attrs):
        user = self.context["request"].user
        if user.is_guest:
            return attrs

        password = attrs.get("password")
        if not password:
            raise serializers.ValidationError({"password": ["Joriy parolni kiriting."]})
        if not user.check_password(password):
            raise serializers.ValidationError({"password": ["Joriy parol noto‘g‘ri."]})
        return attrs
