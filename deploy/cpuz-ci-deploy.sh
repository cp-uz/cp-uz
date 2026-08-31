#!/usr/bin/env bash
set -Eeuo pipefail

# This file is installed once as /usr/local/sbin/cpuz-ci-deploy and used as
# the forced command for the dedicated GitHub Actions SSH key. It deliberately
# accepts one operation only: deploy an exact 40-character commit that is
# reachable from origin/main.

umask 077
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

APP_DIR="/home/cp_uz"
REPOSITORY_URL="https://github.com/cp-uz/cp-uz.git"
ORIGINAL_COMMAND="${SSH_ORIGINAL_COMMAND:-}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "The cp.uz deploy command must run as root." >&2
  exit 1
fi

if [[ ! "${ORIGINAL_COMMAND}" =~ ^deploy\ ([0-9a-f]{40})$ ]]; then
  echo "Only 'deploy <40-character commit SHA>' is allowed." >&2
  exit 2
fi
DEPLOY_SHA="${BASH_REMATCH[1]}"

install -d -m 0700 "${APP_DIR}" "${APP_DIR}/.release"
if [[ "$(realpath -m "${APP_DIR}")" != "/home/cp_uz" ]]; then
  echo "Unexpected application directory; refusing deploy." >&2
  exit 1
fi

exec 9>/run/lock/cpuz-deploy.lock
if ! flock -w 1800 9; then
  echo "Another cp.uz deployment is still running." >&2
  exit 75
fi

cd "${APP_DIR}"
if [[ ! -d .git ]]; then
  git init --initial-branch=main
  git remote add origin "${REPOSITORY_URL}"
else
  current_origin="$(git remote get-url origin 2>/dev/null || true)"
  if [[ -z "${current_origin}" ]]; then
    git remote add origin "${REPOSITORY_URL}"
  elif [[ "${current_origin}" != "${REPOSITORY_URL}" ]]; then
    echo "Unexpected Git origin; refusing deploy." >&2
    exit 1
  fi
fi

git fetch --no-tags --prune origin \
  '+refs/heads/main:refs/remotes/origin/main'
git cat-file -e "${DEPLOY_SHA}^{commit}"
if ! git merge-base --is-ancestor "${DEPLOY_SHA}" refs/remotes/origin/main; then
  echo "Requested commit is not reachable from origin/main." >&2
  exit 1
fi

# .env and .release are ignored, root-only server state. No git clean is used.
git reset --hard "${DEPLOY_SHA}"
if [[ "$(git rev-parse HEAD)" != "${DEPLOY_SHA}" ]]; then
  echo "Checked out revision does not match the requested SHA." >&2
  exit 1
fi

bash deploy/release-on-server.sh
