from django.contrib import admin

from .models import Problem, ProblemAttachment, ProblemLink, ProblemSet


class ProblemLinkInline(admin.TabularInline):
    model = ProblemLink
    extra = 0


class ProblemAttachmentInline(admin.TabularInline):
    model = ProblemAttachment
    extra = 0


@admin.register(ProblemSet)
class ProblemSetAdmin(admin.ModelAdmin):
    list_display = ("title", "event", "order", "publication_status")
    list_filter = ("publication_status", "event__season")
    search_fields = ("title", "event__title")
    autocomplete_fields = ("event",)
    ordering = ("event__season", "event__order", "order")


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "title",
        "problem_set",
        "translation_status",
        "difficulty_label",
        "publication_status",
    )
    list_filter = (
        "publication_status",
        "translation_status",
        "problem_type",
        "problem_set__event__season",
    )
    search_fields = ("code", "title", "original_title", "problem_set__title")
    autocomplete_fields = ("problem_set",)
    inlines = (ProblemLinkInline, ProblemAttachmentInline)
    ordering = (
        "problem_set__event__season",
        "problem_set__event__order",
        "problem_set__order",
        "order",
    )
