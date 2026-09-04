from django.db.models import Prefetch

from ..models import Article, ArticlePrerequisite, ExternalPracticeReference


def article_details(queryset):
    """Load detail relationships with the same visibility rules as public routes."""
    return queryset.prefetch_related(
        "contributors__user__guest_session",
        Prefetch(
            "prerequisite_links",
            queryset=ArticlePrerequisite.objects.filter(
                prerequisite__visibility=Article.Visibility.PUBLIC
            ).select_related("prerequisite__category"),
            to_attr="public_prerequisite_links",
        ),
        Prefetch(
            "practice_references",
            queryset=ExternalPracticeReference.objects.filter(is_active=True),
            to_attr="active_practice_references",
        ),
        "review_records",
    )
