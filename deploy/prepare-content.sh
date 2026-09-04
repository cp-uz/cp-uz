#!/bin/sh
# Runs only against a disposable candidate or an isolated CI database.
set -eu
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py import_content --path /app/content/exports/articles.v1.json
python manage.py import_seasons --path /app/content/seasons --prune
python manage.py import_problems --path /app/content/problems --prune
python manage.py verify_release_content
