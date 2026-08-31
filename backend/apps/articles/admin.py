from django.contrib import admin

from .models import (
    Article,
    ArticleContributor,
    ArticlePrerequisite,
    ArticleRevision,
    Category,
    ExternalPracticeReference,
    GlossaryTerm,
    Tag,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "order", "is_active", "updated_at")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "updated_at")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


class ContributorInline(admin.TabularInline):
    model = ArticleContributor
    extra = 0
    autocomplete_fields = ("user",)


class PrerequisiteInline(admin.TabularInline):
    model = ArticlePrerequisite
    fk_name = "article"
    extra = 0
    autocomplete_fields = ("prerequisite",)


class PracticeReferenceInline(admin.TabularInline):
    model = ExternalPracticeReference
    extra = 0


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "difficulty",
        "status",
        "visibility",
        "language",
        "is_featured",
        "updated_at",
    )
    list_filter = ("status", "visibility", "difficulty", "language", "is_featured", "category")
    list_editable = ("status", "visibility", "is_featured")
    search_fields = ("title", "subtitle", "summary", "content")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("tags",)
    autocomplete_fields = ("category", "created_by", "updated_by")
    readonly_fields = ("content_hash", "created_at", "updated_at", "published_at")
    inlines = (ContributorInline, PrerequisiteInline, PracticeReferenceInline)

    def save_model(self, request, obj, form, change):
        if not obj.created_by_id:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(GlossaryTerm)
class GlossaryTermAdmin(admin.ModelAdmin):
    list_display = ("term", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("term", "aliases", "definition")
    prepopulated_fields = {"slug": ("term",)}
    filter_horizontal = ("related_articles",)


@admin.register(ArticleRevision)
class ArticleRevisionAdmin(admin.ModelAdmin):
    list_display = ("article", "version", "created_by", "created_at")
    list_filter = ("created_at",)
    search_fields = ("article__title", "change_summary", "content")
    readonly_fields = tuple(field.name for field in ArticleRevision._meta.fields)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
