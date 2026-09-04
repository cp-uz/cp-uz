#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
if [[ "${EUID}" -ne 0 || ! "${1:-}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Root and an exact 40-character revision are required." >&2
  exit 2
fi
if [[ "${CPUZ_RELEASE_LOCK_HELD:-}" != 1 ]]; then
  exec 9>/run/lock/cpuz-deploy.lock
  flock -w 1800 9
fi
RELEASE_DIR="/home/cp_uz/.release/releases/$1"
if [[ "$(realpath -e "${RELEASE_DIR}")" != "${RELEASE_DIR}" ]]; then
  echo "Unexpected immutable release directory." >&2
  exit 1
fi
exec python3 "${RELEASE_DIR}/deploy/release.py" "$1"
