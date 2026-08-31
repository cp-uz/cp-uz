#!/usr/bin/env bash
set -Eeuo pipefail

# One-time production bootstrap. The two arguments are temporary files copied
# by an operator: the reviewed forced-command wrapper and its public key.

umask 077

WRAPPER_SOURCE="${1:-/tmp/cpuz-ci-deploy.sh}"
PUBLIC_KEY_SOURCE="${2:-/tmp/cpuz-actions.pub}"
WRAPPER_TARGET="/usr/local/sbin/cpuz-ci-deploy"
AUTHORIZED_KEYS="/root/.ssh/authorized_keys"

if [[ "${EUID}" -ne 0 ]]; then
  echo "CI access installation must run as root." >&2
  exit 1
fi

for source_file in "${WRAPPER_SOURCE}" "${PUBLIC_KEY_SOURCE}"; do
  if [[ ! -f "${source_file}" || -L "${source_file}" ]]; then
    echo "Expected a regular non-symlink file: ${source_file}" >&2
    exit 1
  fi
done

public_key="$(<"${PUBLIC_KEY_SOURCE}")"
public_key="${public_key%$'\r'}"
if [[ ! "${public_key}" =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+\ cpuz-github-actions-[0-9]{8}$ ]]; then
  echo "Unexpected deployment public key format." >&2
  exit 1
fi

bash -n "${WRAPPER_SOURCE}"
if command -v shellcheck >/dev/null 2>&1; then
  shellcheck "${WRAPPER_SOURCE}"
fi

install -o root -g root -m 0755 "${WRAPPER_SOURCE}" "${WRAPPER_TARGET}"
install -d -o root -g root -m 0700 /root/.ssh /home/cp_uz /home/cp_uz/.release
touch "${AUTHORIZED_KEYS}"
chown root:root "${AUTHORIZED_KEYS}"
chmod 0600 "${AUTHORIZED_KEYS}"

forced_entry="restrict,command=\"${WRAPPER_TARGET}\" ${public_key}"
replacement="$(mktemp /root/.ssh/authorized_keys.cpuz.XXXXXX)"
trap 'rm -f -- "${replacement}"' EXIT
awk '
  index($0, " cpuz-github-actions-20260831") == 0 { print }
' "${AUTHORIZED_KEYS}" >"${replacement}"
printf '%s\n' "${forced_entry}" >>"${replacement}"
chown root:root "${replacement}"
chmod 0600 "${replacement}"
mv -f -- "${replacement}" "${AUTHORIZED_KEYS}"
trap - EXIT

echo "Restricted cp.uz CI access installed."
