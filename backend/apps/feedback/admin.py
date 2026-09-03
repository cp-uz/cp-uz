from django.contrib import admin

from .models import FeedbackSubmission


@admin.register(FeedbackSubmission)
class FeedbackSubmissionAdmin(admin.ModelAdmin):
    list_display = ("full_name", "contact", "delivery_status", "created_at")
    list_filter = ("delivery_status", "created_at")
    search_fields = ("full_name", "contact", "note")
    readonly_fields = (
        "id",
        "full_name",
        "contact",
        "note",
        "delivery_status",
        "telegram_message_id",
        "delivery_error",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
