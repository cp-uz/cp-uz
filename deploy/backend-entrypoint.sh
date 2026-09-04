#!/bin/sh
set -eu

exec gunicorn core.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout "${GUNICORN_TIMEOUT:-90}" \
  --access-logfile - \
  --error-logfile -

