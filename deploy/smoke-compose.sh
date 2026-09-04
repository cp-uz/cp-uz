#!/usr/bin/env bash
# Production-image runtime smoke in a unique project with disposable volumes.
set -Eeuo pipefail
cd "$(dirname "$0")/.."
export CPUZ_RELEASE_TAG="ci-${GITHUB_SHA:-local}"
export CPUZ_HTTP_PORT="18183"
export CPUZ_ENV_FILE="${CPUZ_ENV_FILE:-$(pwd)/.env}"
project="cpuz-ci-${GITHUB_RUN_ID:-$$}"
compose=(docker compose --env-file "$CPUZ_ENV_FILE" -p "$project")
cleanup() {
  local result=$?
  if [[ "$result" -ne 0 ]]; then
    "${compose[@]}" logs --tail=100 || true
  fi
  "${compose[@]}" down --volumes --remove-orphans
  return "$result"
}
trap cleanup EXIT
"${compose[@]}" build
CPUZ_TEST_CONTAINER_IMAGE="cpuz-web:${CPUZ_RELEASE_TAG}" \
  python3 -m unittest discover -s deploy -p 'test_container_snapshot.py' -v
"${compose[@]}" up -d --wait redis
"${compose[@]}" run --rm --no-deps --entrypoint sh web /app/prepare-content.sh
"${compose[@]}" up -d --no-build --wait --wait-timeout 180
for endpoint in /healthz / /api/v1/health/ /api/v1/problems/ /api/v1/seasons/current/; do
  curl --fail --silent --show-error --max-time 30 --output /dev/null \
    -H 'Host: cp.uz' "http://127.0.0.1:${CPUZ_HTTP_PORT}${endpoint}"
done
# A repeat import must preserve the same reviewed inventory.
"${compose[@]}" run --rm --no-deps --entrypoint sh web /app/prepare-content.sh
"${compose[@]}" exec -T web python manage.py verify_release_content
