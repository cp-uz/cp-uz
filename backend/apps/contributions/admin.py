from django.contrib import admin

from .models import EditProposal, ProposalStatusEvent, ReviewRecord
from .services import EDITABLE_STATUSES, update_proposal


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
    readonly_fields = (
        "status",
        "base_content_hash",
        "proposal_hash",
        "submitted_at",
        "resolved_at",
    )
    inlines = (ReviewInline, StatusEventInline)

    def get_readonly_fields(self, request, obj=None):
        fields = self.readonly_fields
        if obj is not None:
            fields += ("article", "submitter")
            if obj.status not in EDITABLE_STATUSES:
                fields += (
                    "proposed_title",
                    "proposed_summary",
                    "proposed_content",
                    "change_summary",
                )
        return fields

    def save_model(self, request, obj, form, change):
        if not change:
            return super().save_model(request, obj, form, change)
        if obj.status not in EDITABLE_STATUSES:
            return
        saved = update_proposal(
            obj,
            {
                field: getattr(obj, field)
                for field in (
                    "proposed_title",
                    "proposed_summary",
                    "proposed_content",
                    "change_summary",
                )
            },
        )
        obj.proposal_hash = saved.proposal_hash


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
