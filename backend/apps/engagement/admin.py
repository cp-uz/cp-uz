from django.contrib import admin

from .models import Bookmark, GlossaryQuizScore, PersonalNote, ReadingProgress


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
