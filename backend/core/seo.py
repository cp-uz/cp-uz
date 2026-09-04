from django.conf import settings
from django.http import HttpResponse


def robots_txt(request):
    body = "\n".join(
        (
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin/",
            "Disallow: /api/",
            f"Sitemap: {settings.SITE_URL}/sitemap.xml",
            "",
        )
    )
    return HttpResponse(body, content_type="text/plain; charset=utf-8")
