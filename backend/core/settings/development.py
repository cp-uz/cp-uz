from .base import *  # noqa: F403

DEBUG = env_bool("DJANGO_DEBUG", True)  # noqa: F405
SECRET_KEY = os.getenv(  # noqa: F405
    "DJANGO_SECRET_KEY", "cpuz-local-development-key-not-for-production-2026"
)
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,testserver")  # noqa: F405

CORS_ALLOWED_ORIGINS = env_list(  # noqa: F405
    "DJANGO_CORS_ALLOWED_ORIGINS",
    os.getenv(  # noqa: F405
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:8081,http://127.0.0.1:8081,http://localhost:5173,http://127.0.0.1:5173",
    ),
)
CSRF_TRUSTED_ORIGINS = env_list(  # noqa: F405
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    os.getenv(  # noqa: F405
        "CSRF_TRUSTED_ORIGINS",
        "http://localhost:8081,http://127.0.0.1:8081,http://localhost:5173,http://127.0.0.1:5173",
    ),
)
