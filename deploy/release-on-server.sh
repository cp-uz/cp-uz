#!/usr/bin/env bash
set -Eeuo pipefail

umask 077

APP_DIR="/home/cp_uz"
HOST_NGINX_CONFIG="/home/nginx-non-kep.conf"
HTTP_PORT="18181"
RELEASE_STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ROLLBACK_DIR="/root/cpuz-rollbacks/${RELEASE_STAMP}"
LOCAL_FIXTURE="${APP_DIR}/.release/local-db.json"
LOCAL_FIXTURE_LOADED=0

if [[ "${EUID}" -ne 0 ]]; then
  echo "This release must run as root." >&2
  exit 1
fi

if [[ "$(realpath -m "${APP_DIR}")" != "/home/cp_uz" ]]; then
  echo "Unexpected app directory; refusing release." >&2
  exit 1
fi

if [[ ! -f "${HOST_NGINX_CONFIG}" ]]; then
  echo "Missing shared host Nginx config: ${HOST_NGINX_CONFIG}" >&2
  exit 1
fi

cd "${APP_DIR}"

for required in .env compose.yaml content/exports/articles.v1.json deploy/nginx-host-cpuz.conf deploy/replace_cpuz_nginx_block.py; do
  if [[ ! -f "${required}" ]]; then
    echo "Missing ${APP_DIR}/${required}" >&2
    exit 1
  fi
done

# The file is read by Compose and contains every production secret.
chown root:root .env
chmod 0600 .env

if [[ -e "${LOCAL_FIXTURE}" ]]; then
  if [[ ! -f "${LOCAL_FIXTURE}" ]]; then
    echo "Local database fixture is not a regular file." >&2
    exit 1
  fi
  if [[ "$(realpath -e "${LOCAL_FIXTURE}")" != "${LOCAL_FIXTURE}" ]]; then
    echo "Local database fixture resolved unexpectedly; refusing release." >&2
    exit 1
  fi
  chown root:root "${LOCAL_FIXTURE}"
  chmod 0600 "${LOCAL_FIXTURE}"
fi

python3 - <<'PY'
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re


path = Path(".env")
values: dict[str, str] = {}
for line_number, raw_line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
    line = raw_line.strip()
    if not line or line.startswith("#"):
        continue
    if "=" not in line:
        raise SystemExit(f"Invalid .env line {line_number}: expected KEY=VALUE")
    key, value = line.split("=", 1)
    key = key.strip()
    value = value.strip()
    if not re.fullmatch(r"[A-Z][A-Z0-9_]*", key):
        raise SystemExit(f"Invalid .env key on line {line_number}")
    if key in values:
        raise SystemExit(f"Duplicate .env key: {key}")
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        value = value[1:-1]
    values[key] = value


def required(name: str) -> str:
    value = values.get(name, "")
    if not value:
        raise SystemExit(f"Missing required .env value: {name}")
    if "CHANGE_ME" in value:
        raise SystemExit(f"Placeholder remains in .env: {name}")
    return value


if required("DJANGO_SETTINGS_MODULE") != "config.settings.production":
    raise SystemExit("DJANGO_SETTINGS_MODULE must be config.settings.production")
if not re.fullmatch(r"[A-Za-z0-9_-]{50,}", required("DJANGO_SECRET_KEY")):
    raise SystemExit("DJANGO_SECRET_KEY must be a 50+ character URL-safe value")
if required("CPUZ_BIND_ADDRESS") != "127.0.0.1":
    raise SystemExit("CPUZ_BIND_ADDRESS must remain 127.0.0.1 on the shared host")
if required("CPUZ_HTTP_PORT") != "18181":
    raise SystemExit("CPUZ_HTTP_PORT must remain 18181")

allowed_hosts = {item.strip() for item in required("DJANGO_ALLOWED_HOSTS").split(",")}
if not {"cp.uz", "www.cp.uz"}.issubset(allowed_hosts):
    raise SystemExit("DJANGO_ALLOWED_HOSTS must contain cp.uz and www.cp.uz")
trusted_origins = {
    item.strip() for item in required("DJANGO_CSRF_TRUSTED_ORIGINS").split(",")
}
if not {"https://cp.uz", "https://www.cp.uz"}.issubset(trusted_origins):
    raise SystemExit("DJANGO_CSRF_TRUSTED_ORIGINS is missing a production origin")

db_name = required("POSTGRES_DB")
db_user = required("POSTGRES_USER")
db_password = required("POSTGRES_PASSWORD")
if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_-]*", db_name):
    raise SystemExit("POSTGRES_DB must be a simple identifier")
if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_-]*", db_user):
    raise SystemExit("POSTGRES_USER must be a simple identifier")
if not re.fullmatch(r"[A-Za-z0-9_-]{32,}", db_password):
    raise SystemExit("POSTGRES_PASSWORD must be a 32+ character URL-safe value")

database_url = urlsplit(required("DATABASE_URL"))
if database_url.scheme not in {"postgres", "postgresql"}:
    raise SystemExit("DATABASE_URL must use the postgresql scheme")
if database_url.hostname != "db" or database_url.port != 5432:
    raise SystemExit("DATABASE_URL must target db:5432 inside Compose")
if unquote(database_url.username or "") != db_user:
    raise SystemExit("DATABASE_URL user does not match POSTGRES_USER")
if unquote(database_url.password or "") != db_password:
    raise SystemExit("DATABASE_URL password does not match POSTGRES_PASSWORD")
if unquote(database_url.path.lstrip("/")) != db_name:
    raise SystemExit("DATABASE_URL database does not match POSTGRES_DB")
if required("REDIS_URL") != "redis://redis:6379/1":
    raise SystemExit("REDIS_URL must target the internal redis service")
PY

install -d -m 0700 "${ROLLBACK_DIR}"
cp -a "${HOST_NGINX_CONFIG}" "${ROLLBACK_DIR}/nginx-non-kep.conf"

docker compose config --quiet

# Preserve the database before a later release can apply new migrations. The
# volume may exist even when its previous container is stopped.
if docker volume inspect cpuz_postgres_data >/dev/null 2>&1; then
  if ! docker compose up -d --wait --wait-timeout 120 db; then
    docker compose logs --tail=150 db
    echo "Existing PostgreSQL volume could not be started for backup." >&2
    exit 1
  fi
  docker compose exec -T db sh -ec \
    'exec pg_dump --format=custom --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"' \
    >"${ROLLBACK_DIR}/postgres.dump"
  if [[ ! -s "${ROLLBACK_DIR}/postgres.dump" ]]; then
    echo "PostgreSQL backup is empty; refusing release." >&2
    exit 1
  fi
fi

docker compose build --pull
if ! docker compose up -d --remove-orphans --wait --wait-timeout 180; then
  docker compose ps
  docker compose logs --tail=150 db redis web frontend
  echo "New cp.uz containers did not become healthy; host Nginx is unchanged." >&2
  exit 1
fi

# The initial production release may carry an operator-supplied fixture exported
# from the local SQLite database. It is deliberately ignored by Git and is only
# accepted at one exact root-only path. Load it into a completely empty
# application database, or accept it on a retry only when every included model
# already has the exact fixture count. This avoids merging a local snapshot into
# an unrelated production database.
if [[ -f "${LOCAL_FIXTURE}" ]]; then
  fixture_expected="$(python3 - "${LOCAL_FIXTURE}" <<'PY'
import json
import sys
from collections import Counter
from pathlib import Path


path = Path(sys.argv[1])
payload = json.loads(path.read_text(encoding="utf-8"))
if not isinstance(payload, list) or not payload:
    raise SystemExit("Local database fixture must be a non-empty JSON list")

counts: Counter[str] = Counter()
for index, item in enumerate(payload):
    if not isinstance(item, dict) or not isinstance(item.get("model"), str):
        raise SystemExit(f"Invalid fixture object at index {index}")
    counts[item["model"]] += 1

if counts.get("accounts.user", 0) < 1 or counts.get("articles.article", 0) != 163:
    raise SystemExit(f"Unexpected local fixture corpus: {dict(counts)}")

print(json.dumps(dict(sorted(counts.items())), separators=(",", ":")))
PY
  )"

  fixture_labels="$(python3 - "${LOCAL_FIXTURE}" <<'PY'
import json
import sys
from pathlib import Path


payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
print(",".join(sorted({item["model"] for item in payload})))
PY
  )"

  existing_core_count="$(docker compose exec -T web python manage.py shell -c '
from apps.accounts.models import User
from apps.articles.models import Article
print(User.objects.count() + Article.objects.count())
' | tail -n 1 | tr -d '\r')"

  if [[ "${existing_core_count}" == "0" ]]; then
    docker compose exec -T web python manage.py loaddata --format=json - \
      <"${LOCAL_FIXTURE}"
  fi

  fixture_actual="$(docker compose exec -T web python manage.py shell -c "
import json
from django.apps import apps
labels = '${fixture_labels}'.split(',')
counts = {
    label: apps.get_model(label).objects.count()
    for label in labels
}
print(json.dumps(dict(sorted(counts.items())), separators=(',', ':')))
" | tail -n 1 | tr -d '\r')"

  if [[ "${fixture_actual}" != "${fixture_expected}" ]]; then
    echo "Local database fixture count mismatch after load." >&2
    echo "Expected: ${fixture_expected}" >&2
    echo "Actual:   ${fixture_actual}" >&2
    exit 1
  fi
  LOCAL_FIXTURE_LOADED=1
fi

# The import is transactional and idempotent. A new database must not go live empty.
docker compose exec -T web python manage.py import_content \
  --path /app/content/exports/articles.v1.json

docker compose exec -T web python manage.py shell -c '
from apps.articles.models import Article, Category, ExternalPracticeReference, GlossaryTerm
actual = {
    "articles": Article.objects.count(),
    "public_articles": Article.objects.public().count(),
    "root_categories": Category.objects.filter(parent__isnull=True, is_active=True).count(),
    "practice_references": ExternalPracticeReference.objects.filter(is_active=True).count(),
    "glossary_terms": GlossaryTerm.objects.filter(is_published=True).count(),
}
expected = {
    "articles": 163,
    "public_articles": 163,
    "root_categories": 10,
    "practice_references": 885,
    "glossary_terms": 174,
}
assert actual == expected, f"Imported corpus mismatch: {actual} != {expected}"
print(actual)
'

healthy=0
for _ in $(seq 1 30); do
  if curl --fail --silent --show-error "http://127.0.0.1:${HTTP_PORT}/healthz" >/dev/null \
    && curl --fail --silent --show-error "http://127.0.0.1:${HTTP_PORT}/api/v1/health/" >/dev/null; then
    healthy=1
    break
  fi
  sleep 2
done

if [[ "${healthy}" -ne 1 ]]; then
  docker compose ps
  docker compose logs --tail=150 web frontend
  echo "New cp.uz HTTP checks failed; host Nginx is unchanged." >&2
  exit 1
fi

python3 deploy/replace_cpuz_nginx_block.py \
  "${HOST_NGINX_CONFIG}" \
  deploy/nginx-host-cpuz.conf \
  "${ROLLBACK_DIR}/nginx-non-kep.candidate.conf"

install -m 0644 "${ROLLBACK_DIR}/nginx-non-kep.candidate.conf" "${HOST_NGINX_CONFIG}"

restore_host_nginx() {
  install -m 0644 "${ROLLBACK_DIR}/nginx-non-kep.conf" "${HOST_NGINX_CONFIG}"
  nginx -t
  systemctl reload nginx
}

if ! nginx -t; then
  restore_host_nginx
  echo "Candidate Nginx config failed validation and was restored." >&2
  exit 1
fi

systemctl reload nginx

smoke_public() {
  local endpoint
  for endpoint in /healthz / /api/v1/health/; do
    curl --fail --silent --show-error \
      --retry 8 --retry-delay 2 --retry-all-errors \
      --noproxy '*' \
      --resolve cp.uz:443:127.0.0.1 \
      "https://cp.uz${endpoint}" >/dev/null || return 1
  done
}

if ! smoke_public; then
  restore_host_nginx
  echo "Public HTTPS smoke tests failed; host Nginx was rolled back." >&2
  exit 1
fi

# Archive both exact legacy trees before deleting either one.
for legacy_path in /home/cpuz /home/cpuz-frontend; do
  if [[ ! -e "${legacy_path}" ]]; then
    continue
  fi

  resolved_path="$(realpath -e "${legacy_path}")"
  case "${resolved_path}" in
    /home/cpuz|/home/cpuz-frontend) ;;
    *)
      echo "Legacy path resolved unexpectedly (${resolved_path}); refusing cleanup." >&2
      exit 1
      ;;
  esac

  archive="${ROLLBACK_DIR}/$(basename "${resolved_path}").tar.gz"
  tar --one-file-system --numeric-owner -C /home -czf "${archive}" \
    "$(basename "${resolved_path}")"
  tar -tzf "${archive}" >/dev/null
done

for legacy_path in /home/cpuz /home/cpuz-frontend; do
  if [[ -e "${legacy_path}" ]]; then
    rm -rf -- "${legacy_path}"
  fi
  if [[ -e "${legacy_path}" ]]; then
    echo "Legacy path still exists after cleanup: ${legacy_path}" >&2
    exit 1
  fi
done

if ! smoke_public; then
  for legacy_name in cpuz cpuz-frontend; do
    archive="${ROLLBACK_DIR}/${legacy_name}.tar.gz"
    if [[ -f "${archive}" && ! -e "/home/${legacy_name}" ]]; then
      tar -C /home -xzf "${archive}"
    fi
  done
  restore_host_nginx
  echo "Final smoke tests failed; legacy paths and host Nginx were restored." >&2
  exit 1
fi

if [[ "${LOCAL_FIXTURE_LOADED}" -eq 1 ]]; then
  rm -f -- "${LOCAL_FIXTURE}"
fi

docker compose ps
echo "cp.uz release ${RELEASE_STAMP} completed. Rollback artifacts: ${ROLLBACK_DIR}"
