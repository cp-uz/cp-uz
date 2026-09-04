# Production deployment

Production topology keeps the shared host Nginx and its existing Let's Encrypt certificate intact:

```text
Internet → host Nginx :443 → 127.0.0.1:18181 → cpuz frontend Nginx
                                                ├─ React static files
                                                └─ /api + /admin → Django/Gunicorn → SQLite
```

Only `cp.uz` and `www.cp.uz` are changed. The host Nginx source is `/home/nginx-non-kep.conf`; unrelated server blocks and all unrelated Docker projects remain outside this release.

## Release invariants

1. Application files live at exactly `/home/cp_uz` and secrets live only in `/home/cp_uz/.env` with mode `0600`.
2. Compose publishes exactly `127.0.0.1:18181`; Redis and Gunicorn have no host port, and the SQLite file is stored only in the persistent `cpuz_sqlite_data` volume.
3. Every container and both local HTTP health routes must pass before host Nginx changes.
4. Only the exact TLS block containing `server_name cp.uz www.cp.uz;` may be replaced, and `nginx -t` must pass before reload.
5. The homepage, frontend health route and Django health route must all pass through local TLS before legacy cleanup.
6. Legacy paths `/home/cpuz` and `/home/cpuz-frontend` are archived and verified before either exact path is deleted.

The generic HTTP-to-HTTPS server block already present in `/home/nginx-non-kep.conf` is deliberately preserved.

## Environment

Copy `.env.example` to `/home/cp_uz/.env`, replace the secret-key placeholder, then keep the file root-only:

```bash
python3 -c 'import secrets; print(secrets.token_urlsafe(48))'
chmod 0600 /home/cp_uz/.env
```

Discord manzilini frontend bundle ichiga yozmang. `DJANGO_SECRET_KEY` o‘rnatilgach,
invite URL’ni shell tarixida qoldirmaydigan interaktiv buyruq bilan shifrlang va
chiqqan `DISCORD_INVITE_URL_ENCRYPTED=...` qatorini `/home/cp_uz/.env` fayliga
joylang:

```bash
docker compose run --rm web python manage.py encrypt_discord_invite
```

`DJANGO_SECRET_KEY` o‘zgarsa tokenni ham shu buyruq bilan qayta yaratish kerak.

`DATABASE_URL` must remain `sqlite:////app/data/db.sqlite3`; this path is backed by the `cpuz_sqlite_data` named volume and survives container replacement. Do not change `CPUZ_BIND_ADDRESS`, `CPUZ_HTTP_PORT`, `DJANGO_SETTINGS_MODULE`, the database path or Redis host from their checked-in production values.

When the npm registry is reachable only through a proxy, set `NPM_PROXY_URL`
in the same root-only `.env` file. Compose passes it to the frontend build as
Docker's predefined `HTTP_PROXY` and `HTTPS_PROXY` build arguments. The
Dockerfile deliberately does not declare or persist those arguments, so proxy
credentials do not become an image layer or `docker history` entry. Leave the
value empty when no proxy is needed.

## Initial release

The first release can migrate the current local SQLite data without committing
the database or a fixture to Git. Export it with Django's `dumpdata`, verify it
against a clean migrated database, then copy it to the one accepted root-only
path:

```bash
install -d -m 0700 /home/cp_uz/.release
install -o root -g root -m 0600 local-db.json /home/cp_uz/.release/local-db.json
```

The release only loads this fixture when the application database is empty. On
a retry it requires every included model count to match exactly. It then runs
the canonical content, season and problem imports; verifies 163 published articles,
885 active practice references, 174 public glossary terms, 3 published seasons,
51 season events, 73 local result rows, 15 public problem sets and 47 public problems;
and removes the server copy of the fixture only after the final public HTTPS checks pass.

After the repository and completed `.env` are present in `/home/cp_uz`:

```bash
cd /home/cp_uz
bash deploy/release-on-server.sh
```

The release performs environment validation, saves the current shared Nginx file, creates a transactionally consistent backup of an existing SQLite database on later runs, builds and waits for Compose health, imports the canonical article and season snapshots idempotently, switches only the cp.uz TLS block, runs HTTPS smoke tests, and then removes the two exact legacy paths. Rollback artifacts are stored in a timestamped root-only directory under `/root/cpuz-rollbacks/`.

No Docker command is part of the local developer workflow; local Django and Vite runs are documented in the root README.

## Restricted CI/CD access

GitHub Actions uses a dedicated ED25519 key, not an unrestricted interactive
root key. Copy the reviewed [cpuz-ci-deploy.sh](cpuz-ci-deploy.sh) and the
dedicated public key to temporary server files, then run
[install-ci-access.sh](install-ci-access.sh) once as root. It installs the
wrapper as root-owned `/usr/local/sbin/cpuz-ci-deploy` and appends the key with
both `restrict` and `command="/usr/local/sbin/cpuz-ci-deploy"` options. The command accepts only
`deploy <40-character SHA>`, verifies that the commit is reachable from the
public repository's `main` branch, serializes releases with `flock`, and invokes
the audited release script.

The repository's `Deploy` workflow requires these environment secrets:

- `CPUZ_DEPLOY_HOST`
- `CPUZ_DEPLOY_USER`
- `CPUZ_DEPLOY_KEY`
- `CPUZ_KNOWN_HOSTS`

Automatic deployment runs only after the `CI` workflow succeeds for a push to
`main`. The workflow passes the exact tested commit SHA to the restricted
server command.

## Manual rollback

Use the timestamp printed by the release. Restore the shared config first, and restore legacy archives only when rolling all the way back to the pre-rebuild site:

```bash
ROLLBACK_DIR=/root/cpuz-rollbacks/YYYYMMDDTHHMMSSZ
install -m 0644 "$ROLLBACK_DIR/nginx-non-kep.conf" /home/nginx-non-kep.conf
test ! -f "$ROLLBACK_DIR/cpuz.tar.gz" || tar -C /home -xzf "$ROLLBACK_DIR/cpuz.tar.gz"
test ! -f "$ROLLBACK_DIR/cpuz-frontend.tar.gz" || tar -C /home -xzf "$ROLLBACK_DIR/cpuz-frontend.tar.gz"
nginx -t
systemctl reload nginx
```

If `sqlite.sqlite3` exists, it is an online SQLite backup captured before that
release's migrations and verified with `PRAGMA quick_check`. Database
restoration is intentionally a separate operator action because it overwrites
current application data. Stop `frontend` and `web`, preserve the current
volume first, replace `/app/data/db.sqlite3` in `cpuz_sqlite_data` with the
backup, remove any stale `db.sqlite3-wal` and `db.sqlite3-shm` files, then start
Compose and repeat the health checks.
