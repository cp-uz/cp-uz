import django_filters
from django.db import models

from .models import Article


class ArticleFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(method="filter_category")
    tag = django_filters.CharFilter(field_name="tags__slug")
    prerequisite = django_filters.CharFilter(field_name="prerequisites__slug")
    difficulty = django_filters.MultipleChoiceFilter(choices=Article.Difficulty.choices)
    featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = Article
        fields = ("category", "tag", "prerequisite", "difficulty", "featured", "language")

    def filter_category(self, queryset, name, value):
        return queryset.filter(
            models.Q(category__slug=value) | models.Q(category__parent__slug=value)
        )
