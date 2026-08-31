from django.contrib.sitemaps import Sitemap

from apps.articles.models import Article, Category


class ArticleSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = "https"

    def items(self):
        return Article.objects.public().only("slug", "canonical_path", "updated_at")

    def location(self, article):
        path = article.canonical_path or article.slug
        return f"/algoritmlar/{path.strip('/')}/"

    def lastmod(self, article):
        return article.updated_at


class CategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.7
    protocol = "https"

    def items(self):
        return Category.objects.filter(is_active=True).only("slug", "updated_at")

    def location(self, category):
        return f"/algoritmlar/{category.slug}/"

    def lastmod(self, category):
        return category.updated_at


class StaticSitemap(Sitemap):
    changefreq = "weekly"
    protocol = "https"

    pages = {
        "home": ("/", 1.0),
        "articles": ("/algoritmlar/", 0.9),
        "glossary": ("/lugat/", 0.6),
        "about": ("/biz-haqimizda/", 0.4),
    }

    def items(self):
        return list(self.pages)

    def location(self, item):
        return self.pages[item][0]

    def priority(self, item):
        return self.pages[item][1]
