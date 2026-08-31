from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import GuestSession, User


@admin.register(User)
class CpuzUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "cp.uz profili",
            {
                "fields": (
                    "display_name",
                    "bio",
                    "avatar_url",
                    "github_url",
                    "preferred_language",
                    "public_profile",
                )
            },
        ),
    )
    list_display = (
        "username",
        "name",
        "email",
        "preferred_language",
        "is_guest",
        "is_staff",
    )


@admin.register(GuestSession)
class GuestSessionAdmin(admin.ModelAdmin):
    list_display = ("public_id", "user", "created_at", "last_seen_at")
    search_fields = ("public_id", "user__username")
    readonly_fields = ("user", "public_id", "secret_hash", "created_at", "last_seen_at")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
