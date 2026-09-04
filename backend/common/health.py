import uuid

from django.core.cache import cache
from django.db import connection
from django.http import JsonResponse


def health(request):
    """Readiness includes the database and cache required by throttling and APIs."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception:
        return JsonResponse({"status": "unhealthy", "database": "unavailable"}, status=503)
    key = f"readiness:{uuid.uuid4().hex}"
    try:
        cache.set(key, "ok", timeout=10)
        if cache.get(key) != "ok":
            raise RuntimeError("Cache round trip failed")
        cache.delete(key)
    except Exception:
        return JsonResponse(
            {"status": "unhealthy", "database": "ok", "cache": "unavailable"}, status=503
        )
    return JsonResponse({"status": "ok", "database": "ok", "cache": "ok"})
