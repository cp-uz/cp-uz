import os

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403

DEBUG = False
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "")  # noqa: F405
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "cp.uz,www.cp.uz")  # noqa: F405

if len(SECRET_KEY) < 50:
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set to a strong production value")
if not os.getenv("DATABASE_URL"):  # noqa: F405
    raise ImproperlyConfigured("DATABASE_URL must be set in production")

# Production deliberately uses one persistent SQLite database. A generous busy
# timeout and WAL mode make short concurrent writes from Gunicorn workers wait
# instead of failing immediately with "database is locked".
if DATABASES["default"]["ENGINE"] != "django.db.backends.sqlite3":  # noqa: F405
    raise ImproperlyConfigured("Production DATABASE_URL must use SQLite")
DATABASES["default"]["CONN_MAX_AGE"] = 0  # noqa: F405
DATABASES["default"]["OPTIONS"] = {  # noqa: F405
    "timeout": int(os.getenv("SQLITE_BUSY_TIMEOUT_SECONDS", "30")),
    "transaction_mode": "IMMEDIATE",
    "init_command": "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;",
}

SECURE_SSL_REDIRECT = env_bool("SECURE_SSL_REDIRECT", True)  # noqa: F405
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))  # noqa: F405
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.getenv("REDIS_URL", "redis://127.0.0.1:6379/1"),  # noqa: F405
    }
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST", "")  # noqa: F405
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))  # noqa: F405
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)  # noqa: F405
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")  # noqa: F405
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")  # noqa: F405
