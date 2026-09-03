from django.contrib.sitemaps import Sitemap

from apps.articles.models import Article, Category
from apps.problems.models import Problem
from apps.seasons.models import Event, PublicationStatus, Season
from config.frontend_routes import DICTIONARY_ROOT, algorithm_path, season_path, task_path


class ArticleSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = "https"

    def items(self):
        return Article.objects.public().only("slug", "canonical_path", "updated_at")

    def location(self, article):
        path = article.canonical_path or article.slug
        return algorithm_path(path)

    def lastmod(self, article):
        return article.updated_at


class CategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7
    protocol = "https"

    def items(self):
        return Category.objects.filter(is_active=True).only("slug", "updated_at")

    def location(self, category):
        return algorithm_path(category.slug)

    def lastmod(self, category):
        return category.updated_at


class SeasonSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7
    protocol = "https"

    def items(self):
        return Season.objects.published().only("slug", "updated_at")

    def location(self, season):
        return season_path(season.slug)

    def lastmod(self, season):
        return season.updated_at


class SeasonEventSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6
    protocol = "https"

    def items(self):
        return (
            Event.objects.published()
            .filter(season__publication_status=PublicationStatus.PUBLISHED)
            .select_related("season")
            .only("slug", "updated_at", "season__slug")
        )

    def location(self, event):
        return season_path(event.season.slug, event.slug)

    def lastmod(self, event):
        return event.updated_at


class ProblemSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.65
    protocol = "https"

    def items(self):
        return (
            Problem.objects.filter(
                publication_status=PublicationStatus.PUBLISHED,
                problem_set__publication_status=PublicationStatus.PUBLISHED,
                problem_set__event__publication_status=PublicationStatus.PUBLISHED,
                problem_set__event__season__publication_status=PublicationStatus.PUBLISHED,
            )
            .select_related("problem_set__event__season")
            .only(
                "slug",
                "updated_at",
                "problem_set__event__slug",
                "problem_set__event__season__slug",
            )
        )

    def location(self, problem):
        event = problem.problem_set.event
        return task_path(event.season.slug, event.slug, problem.slug)

    def lastmod(self, problem):
        return problem.updated_at


class StaticSitemap(Sitemap):
    changefreq = "weekly"
    protocol = "https"

    pages = {
        "home": ("/", 1.0),
        "articles": (algorithm_path(), 0.9),
        "problems": (task_path(), 0.85),
        "glossary": (f"{DICTIONARY_ROOT}/", 0.6),
        "about": ("/biz-haqimizda/", 0.4),
    }

    def items(self):
        return list(self.pages)

    def location(self, item):
        return self.pages[item][0]

    def priority(self, item):
        return self.pages[item][1]
