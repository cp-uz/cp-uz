#!/bin/bash
# Install the standalone service after building and testing the grading image.
set -euo pipefail
if [[ $(id -u) != 0 || $# != 2 ]]; then
  echo "Usage (as root): bash deploy/install.sh /private/roster.csv image:tag" >&2
  exit 1
fi
GRADER_SOURCE=$(cd "$(dirname "$0")/.." && pwd)
GRADER_ROSTER=$(realpath "$1")
GRADER_IMAGE=$(docker image inspect --format '{{.Id}}' "$2")
if ! id grader15150 >/dev/null 2>&1; then
  useradd --system --home-dir /opt/grader15150 --no-create-home --shell /usr/sbin/nologin grader15150
fi
install -d -m 0750 -o root -g grader15150 /opt/grader15150 /opt/grader15150/server /opt/grader15150/server/templates
install -d -m 0700 -o grader15150 -g grader15150 /opt/grader15150/data /opt/grader15150/data/submissions
if systemctl is-active --quiet grader15150; then
  systemctl stop grader15150
fi
install -m 0640 -o root -g grader15150 "$GRADER_SOURCE"/server/*.py /opt/grader15150/server/
install -m 0640 -o root -g grader15150 "$GRADER_SOURCE"/server/requirements.txt /opt/grader15150/server/
install -m 0640 -o root -g grader15150 "$GRADER_SOURCE"/server/templates/*.html /opt/grader15150/server/templates/
install -m 0600 -o root -g root "$GRADER_SOURCE/autograde.tar" /opt/grader15150/autograde.tar
install -m 0600 -o grader15150 -g grader15150 "$GRADER_ROSTER" /opt/grader15150/data/roster.csv
umask 0022
python3 -m venv /opt/grader15150/venv
env -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY -u http_proxy -u https_proxy -u all_proxy \
  /opt/grader15150/venv/bin/pip --isolated install --disable-pip-version-check \
  -r /opt/grader15150/server/requirements.txt
GRADER_IMAGE="$GRADER_IMAGE" python3 - <<'PY'
import os
import secrets
from pathlib import Path
path = Path('/opt/grader15150/grader.env')
values = {}
if path.exists():
    for line in path.read_text().splitlines():
        if line and not line.startswith('#'):
            key, value = line.split('=', 1)
            values[key] = value
values.setdefault('SECRET_KEY', secrets.token_hex(32))
values.update({
    'DATA_DIR': '/opt/grader15150/data/submissions',
    'ROSTER': '/opt/grader15150/data/roster.csv',
    'IMAGE': os.environ['GRADER_IMAGE'],
    'COOKIE_PATH': '/grader15150',
})
for key, value in {'MAX_SUBMISSIONS': '5', 'MAX_PARALLEL': '1', 'MAX_PENDING': '20', 'GRADE_TIMEOUT': '300'}.items():
    values.setdefault(key, value)
path.touch(mode=0o600, exist_ok=True)
path.chmod(0o600)
path.write_text(''.join(f'{key}={value}\n' for key, value in values.items()))
PY
install -m 0644 -o root -g root "$GRADER_SOURCE/deploy/grader15150.service" /etc/systemd/system/grader15150.service
systemctl daemon-reload
systemctl enable --now grader15150
for _ in {1..20}; do
  if curl --fail --silent http://127.0.0.1:8150/health; then
    printf '\nGrader service is ready on loopback port 8150.\n'
    exit 0
  fi
  sleep 1
done
systemctl status --no-pager grader15150
exit 1
