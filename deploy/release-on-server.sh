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

for required in .env compose.yaml content/exports/articles.v1.json deploy/backup_sqlite.py deploy/nginx-host-cpuz.conf deploy/replace_cpuz_nginx_block.py deploy/validate_production_env.py; do
  if [[ ! -f "${required}" ]]; then
    echo "Missing ${APP_DIR}/${required}" >&2
    exit 1
  fi
done

# The restricted deploy account checks Git out with umask 077. Canonical
# content contains no secrets and is bind-mounted read-only into the non-root
# Django container, so normalize only this exact tree to traversable/readable
# permissions. Refuse symlinks before the recursive operation.
if [[ "$(realpath -e content)" != "${APP_DIR}/content" ]]; then
  echo "Canonical content resolved unexpectedly; refusing release." >&2
  exit 1
fi
if find content -type l -print -quit | grep -q .; then
  echo "Canonical content must not contain symbolic links." >&2
  exit 1
fi
find content -type d -exec chmod 0755 {} +
find content -type f -exec chmod 0644 {} +

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

python3 deploy/validate_production_env.py .env

install -d -m 0700 "${ROLLBACK_DIR}"
cp -a "${HOST_NGINX_CONFIG}" "${ROLLBACK_DIR}/nginx-non-kep.conf"

docker compose config --quiet

# Preserve the persistent SQLite database before a later release applies new
# migrations. SQLite's online backup API produces a transactionally consistent
# file even while the current web container is serving reads and writes.
if docker volume inspect cpuz_sqlite_data >/dev/null 2>&1; then
  web_container="$(docker compose ps -q web | head -n 1)"
  if [[ -z "${web_container}" ]]; then
    echo "SQLite volume exists without a running cpuz web container; refusing an unbacked release." >&2
    exit 1
  fi
  sqlite_staged_backup="/app/data/.cpuz-pre-release-${RELEASE_STAMP}.sqlite3"
  docker compose exec -T web python - \
    /app/data/db.sqlite3 "${sqlite_staged_backup}" \
    <deploy/backup_sqlite.py
  if ! docker cp \
    "${web_container}:${sqlite_staged_backup}" \
    "${ROLLBACK_DIR}/sqlite.sqlite3"; then
    docker compose exec -T web python -c \
      "from pathlib import Path; Path('${sqlite_staged_backup}').unlink(missing_ok=True)"
    echo "Could not copy the SQLite backup out of the persistent volume." >&2
    exit 1
  fi
  docker compose exec -T web python -c \
    "from pathlib import Path; Path('${sqlite_staged_backup}').unlink()"
  if [[ ! -s "${ROLLBACK_DIR}/sqlite.sqlite3" ]]; then
    echo "SQLite backup is empty; refusing release." >&2
    exit 1
  fi
  chmod 0600 "${ROLLBACK_DIR}/sqlite.sqlite3"
fi

docker compose build --pull
if ! docker compose up -d --remove-orphans --wait --wait-timeout 180; then
  docker compose ps
  docker compose logs --tail=150 redis web frontend
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

docker compose exec -T web python manage.py import_seasons \
  --path /app/content/seasons \
  --prune

docker compose exec -T web python manage.py import_problems \
  --path /app/content/problems \
  --prune

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

docker compose exec -T web python manage.py shell -c '
from apps.problems.models import Problem, ProblemAttachment, ProblemLink, ProblemSet
from apps.seasons.models import PublicationStatus
actual = {
    "sets": ProblemSet.objects.count(),
    "public_sets": ProblemSet.objects.filter(publication_status=PublicationStatus.PUBLISHED).count(),
    "problems": Problem.objects.count(),
    "public_problems": Problem.objects.filter(publication_status=PublicationStatus.PUBLISHED).count(),
    "links": ProblemLink.objects.count(),
    "attachments": ProblemAttachment.objects.count(),
}
expected = {
    "sets": 8,
    "public_sets": 8,
    "problems": 26,
    "public_problems": 26,
    "links": 52,
    "attachments": 26,
}
assert actual == expected, f"Imported problem catalog mismatch: {actual} != {expected}"
print(actual)
'

docker compose exec -T web python manage.py shell -c '
from apps.seasons.models import Event, EventEdge, ResultEntry, Route, Season
actual = {
    "seasons": Season.objects.count(),
    "public_seasons": Season.objects.published().count(),
    "routes": Route.objects.count(),
    "events": Event.objects.count(),
    "public_events": Event.objects.published().count(),
    "edges": EventEdge.objects.count(),
    "local_results": ResultEntry.objects.filter(is_local=True).count(),
}
expected = {
    "seasons": 2,
    "public_seasons": 2,
    "routes": 12,
    "events": 50,
    "public_events": 50,
    "edges": 42,
    "local_results": 73,
}
assert actual == expected, f"Imported season data mismatch: {actual} != {expected}"
print(actual)
'

SMOKE_ENDPOINTS=(
  /healthz
  /
  /api/v1/health/
  /api/v1/seasons/current/
  /api/v1/problems/
  /seasons/2026-2027
  /masalalar
  /masalalar/2025-2026/ioi-2026-saralash-4/temir-rom
  /masalalar/2025-2026/ioi-2026/ball-machine
  /masalalar/2025-2026/egoi-2026/ferriswheel
  /boot.css
  /loader-facts.js
  /assets/brand/cpuz-logo.png
  /assets/team/asadullo-ganiev.png
  /assets/team/dilshodbek-khujaev.png
  /assets/team/dilyorbek-valijanov.png
  /assets/team/ulugbek-abdimanabov.png
)

healthy=0
for _ in $(seq 1 30); do
  healthy=1
  for endpoint in "${SMOKE_ENDPOINTS[@]}"; do
    if ! curl --fail --silent --show-error \
      "http://127.0.0.1:${HTTP_PORT}${endpoint}" >/dev/null; then
      healthy=0
      break
    fi
  done
  if [[ "${healthy}" -eq 1 ]]; then
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
  for endpoint in "${SMOKE_ENDPOINTS[@]}"; do
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
