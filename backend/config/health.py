from django.db import connection
from django.http import JsonResponse


def health(request):
    """Lightweight liveness/readiness endpoint used by the reverse proxy."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception:
        return JsonResponse({"status": "unhealthy", "database": "unavailable"}, status=503)
    return JsonResponse({"status": "ok", "database": "ok"})
