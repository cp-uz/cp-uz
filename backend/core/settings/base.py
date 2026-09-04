import os
from datetime import timedelta
from pathlib import Path

import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def env_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-development-only-key")
DEBUG = False
ALLOWED_HOSTS: list[str] = []

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sitemaps",
    "corsheaders",
    "django_filters",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    "apps.accounts",
    "apps.articles",
    "apps.engagement",
    "apps.contributions",
    "apps.search",
    "apps.seasons",
    "apps.problems",
    "apps.feedback",
    "apps.community",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"

DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=60,
        conn_health_checks=True,
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "uz-latn"
LANGUAGES = [
    ("uz-latn", "O‘zbekcha"),
    ("ru", "Русский"),
    ("en", "English"),
]
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
SITE_URL = os.getenv("SITE_URL", "https://cp.uz").rstrip("/")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"

REST_FRAMEWORK = {
    # Direct development requests do not trust client-supplied forwarding headers.
    "NUM_PROXIES": int(os.getenv("DJANGO_TRUSTED_PROXY_COUNT", "0")),
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "common.pagination.StandardResultsSetPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "EXCEPTION_HANDLER": "common.exceptions.api_exception_handler",
    "DATETIME_FORMAT": "%Y-%m-%dT%H:%M:%SZ",
    "DEFAULT_THROTTLE_RATES": {
        "login_ip": os.getenv("LOGIN_IP_THROTTLE", "30/min"),
        "login_username": os.getenv("LOGIN_USERNAME_THROTTLE", "10/min"),
        "token_refresh": os.getenv("TOKEN_REFRESH_THROTTLE", "60/min"),
        "glossary_question": os.getenv("GLOSSARY_QUESTION_THROTTLE", "600/hour"),
        "guest_session": os.getenv("GUEST_SESSION_THROTTLE", "20/hour"),
        "guest_upgrade": os.getenv("GUEST_UPGRADE_THROTTLE", "5/hour"),
        "glossary_quiz": os.getenv("GLOSSARY_QUIZ_THROTTLE", "600/hour"),
        "feedback": os.getenv("FEEDBACK_THROTTLE", "5/hour"),
    },
}

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_FEEDBACK_CHAT_ID = os.getenv("TELEGRAM_FEEDBACK_CHAT_ID", "").strip()
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET", "").strip()
TELEGRAM_PROXY_URL = os.getenv("TELEGRAM_PROXY_URL", "").strip()
TELEGRAM_API_TIMEOUT_SECONDS = int(os.getenv("TELEGRAM_API_TIMEOUT_SECONDS", "15"))
DISCORD_INVITE_URL_ENCRYPTED = os.getenv("DISCORD_INVITE_URL_ENCRYPTED", "").strip()

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_MINUTES", "30"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "14"))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

SPECTACULAR_SETTINGS = {
    # Avoid OS-dependent prefix inference (Windows and POSIX commonpath differ).
    "SCHEMA_PATH_PREFIX": "",
    "TITLE": "cp.uz Knowledge API",
    "DESCRIPTION": "O‘zbek tilidagi sport dasturlash bilim platformasi API si.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SWAGGER_UI_SETTINGS": {"persistAuthorization": True},
    "ENUM_NAME_OVERRIDES": {
        "GlossaryQuizModeEnum": [
            "english_to_uzbek",
            "uzbek_to_english",
            "definition_to_english",
            "definition_to_uzbek",
        ],
        "ArticleStatusEnum": "apps.articles.models.Article.Status",
        "ProposalStatusEnum": "apps.contributions.models.EditProposal.Status",
        "ReadingProgressStatusEnum": "apps.engagement.models.ReadingProgress.Status",
        "SeasonPublicationStatusEnum": "apps.seasons.models.PublicationStatus",
        "SeasonVerificationStatusEnum": "apps.seasons.models.VerificationStatus",
        "SeasonEventTypeEnum": "apps.seasons.models.Event.Type",
        "SeasonEventModeEnum": "apps.seasons.models.Event.Mode",
        "SeasonResourceTypeEnum": "apps.seasons.models.EventResource.Type",
        "SeasonSourceTypeEnum": "apps.seasons.models.EventSource.Type",
    },
}

CORS_ALLOWED_ORIGINS = env_list(
    "DJANGO_CORS_ALLOWED_ORIGINS", os.getenv("CORS_ALLOWED_ORIGINS", "")
)
CSRF_TRUSTED_ORIGINS = env_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS", os.getenv("CSRF_TRUSTED_ORIGINS", "")
)
CORS_ALLOW_CREDENTIALS = True

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "cpuz-api-cache",
    }
}

EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "cp.uz <noreply@cp.uz>")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {name} {message}",
            "style": "{",
        }
    },
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "verbose"}},
    "root": {"handlers": ["console"], "level": os.getenv("LOG_LEVEL", "INFO")},
}
