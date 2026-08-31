from django.contrib import admin

from .models import Bookmark, GlossaryQuizAnswer, GlossaryQuizScore, PersonalNote, ReadingProgress


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ("user", "article", "created_at")
    search_fields = ("user__username", "article__title")
    autocomplete_fields = ("user", "article")


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "article", "status", "percent", "last_read_at")
    list_filter = ("status",)
    search_fields = ("user__username", "article__title")
    autocomplete_fields = ("user", "article")


@admin.register(PersonalNote)
class PersonalNoteAdmin(admin.ModelAdmin):
    list_display = ("user", "article", "anchor", "updated_at")
    search_fields = ("user__username", "article__title", "body")
    autocomplete_fields = ("user", "article")

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset if request.user.is_superuser else queryset.none()


@admin.register(GlossaryQuizScore)
class GlossaryQuizScoreAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "correct_answers",
        "total_answers",
        "current_streak",
        "best_streak",
        "updated_at",
    )
    search_fields = ("user__username", "user__display_name")
    autocomplete_fields = ("user",)


@admin.register(GlossaryQuizAnswer)
class GlossaryQuizAnswerAdmin(admin.ModelAdmin):
    list_display = ("user", "client_answer_id", "is_correct", "created_at")
    list_filter = ("is_correct",)
    search_fields = ("user__username", "client_answer_id")
    autocomplete_fields = ("user",)
    readonly_fields = ("user", "client_answer_id", "is_correct", "created_at")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
