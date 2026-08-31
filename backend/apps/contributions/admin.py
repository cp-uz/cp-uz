from django.contrib import admin

from .models import EditProposal, ProposalStatusEvent, ReviewRecord


class ReviewInline(admin.TabularInline):
    model = ReviewRecord
    extra = 0
    readonly_fields = ("stage", "decision", "content_hash", "reviewer", "notes", "created_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class StatusEventInline(admin.TabularInline):
    model = ProposalStatusEvent
    extra = 0
    readonly_fields = ("from_status", "to_status", "actor", "note", "created_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(EditProposal)
class EditProposalAdmin(admin.ModelAdmin):
    list_display = ("article", "submitter", "status", "is_stale", "updated_at")
    list_filter = ("status", "created_at")
    search_fields = ("article__title", "submitter__username", "change_summary")
    autocomplete_fields = ("article", "submitter")
    readonly_fields = ("base_content_hash", "proposal_hash", "submitted_at", "resolved_at")
    inlines = (ReviewInline, StatusEventInline)


@admin.register(ReviewRecord)
class ReviewRecordAdmin(admin.ModelAdmin):
    list_display = ("article", "proposal", "stage", "decision", "reviewer", "created_at")
    list_filter = ("stage", "decision", "created_at")
    search_fields = ("article__title", "reviewer__username", "notes")
    readonly_fields = tuple(field.name for field in ReviewRecord._meta.fields)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
