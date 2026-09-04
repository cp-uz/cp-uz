# Production releases

Production uses host Nginx TLS, loopback application ports, Gunicorn, Redis and
SQLite. No service other than the frontend Nginx publishes a host port. The
outer proxy replaces client-provided X-Forwarded-For; the inner proxy appends its
peer, matching Django's two trusted proxy hops.

The host requires Python 3.12, Bash, Docker with Compose v2, Nginx, curl and flock.
The Django runtime entrypoints are `core.settings.production` and `core.wsgi`.
Before the first release using this layout, update the host `.env` setting to
`DJANGO_SETTINGS_MODULE=core.settings.production` and install the reviewed SSH
wrapper. Existing container configuration remains attached to its old image for
rollback; the source tree does not retain a legacy `config` package.

## Immutable release protocol

The restricted `cpuz-ci-deploy` SSH command accepts only `deploy <40-hex-sha>`,
checks that SHA belongs to origin/main and serializes operations with flock.
Automatic GitHub deployments follow successful push CI on main. Manual workflow
dispatches also require the latest CI run for that exact main push SHA to succeed
before configuring SSH; a missing, running or failed CI run blocks deployment.
It exports Git into `/home/cp_uz/.release/releases/<sha>` without resetting the
live checkout or content bind mount. Reinstall the reviewed wrapper with
`install-ci-access.sh` when its protocol changes.

`release-on-server.sh <sha>` runs the release transaction in `release.py`:

1. Validate the root-owned `/home/cp_uz/.env`; build each SHA image once and store
   its immutable image ID in a Compose overlay.
2. Create a unique Compose project with its own SQLite, static and media volumes
   on the inactive loopback port (18181 or 18182). Detect the original `cpuz`
   project automatically for the first upgrade.
3. Copy an online SQLite snapshot and media from the current release, then run
   migrations, static collection, all canonical imports and reviewed inventory
   verification against this candidate only. Run local HTTP smoke checks.
4. Put the cp.uz TLS block in maintenance mode for public clients. Only loopback
   can reach the candidate while its exact TLS routes are checked. Stop/drain
   old web/frontend containers, copy the latest database and media again, and
   rerun preparation. Previous database and image versions remain untouched.
5. Configure the Telegram webhook, check local TLS, save active state atomically,
   and reopen public traffic. No fallible post-promotion operation restores an
   earlier database automatically.

Failures before traffic is reopened stop the candidate, start the old containers
and restore the original Nginx block and active state. This also handles incompatible
SQLite migrations because they only touched a copied database. Signals before
activation trigger this rollback. An interruption during the final reload is an
ambiguous cutover: preserve candidate data and inspect the saved state before
acting, since it may already contain new public writes.

The one-time `/home/cp_uz/.release/local-db.json` fixture is read through stdin
into an initially empty candidate only. It is retained root-only for review;
subsequent releases use the actual live volume. Legacy directories and successful
old volumes are retained rather than deleted by the release operation.

## Environment and inventory

Use `.env.example` and `deploy/validate_production_env.py`. Keep `.env` mode 0600,
use a 50+ character random URL-safe Django key, and populate the Telegram and
encrypted Discord values. Database URL stays `sqlite:////app/data/db.sqlite3`;
Redis stays `redis://redis:6379/1`. The orchestrator selects the loopback port and
unique Compose project; the checked-in default port remains 18181.

`NPM_PROXY_URL` remains an ephemeral Docker build argument. Do not persist proxy
credentials in Dockerfiles or image layers. Secrets never enter immutable Git
release directories or image overlays.

Runtime counts come from reviewed `deploy/content-inventory.json`, including a
hash of the complete canonical checksum manifest. After a canonical content edit:

```bash
python scripts/export_content.py
python scripts/release_inventory.py --write
python scripts/validate_content.py
python scripts/release_inventory.py
```

Review both the content and inventory diffs. `prepare-content.sh` owns migrations
and imports; the web entrypoint only serves Gunicorn. Restarting a web container
therefore cannot unexpectedly migrate a database.

## Recovery

`/home/cp_uz/.release/active.json` records the active SHA, exact images, project,
containers, port and named volumes. Each `.release/runs/<stamp-sha>` stores the
pre-release Nginx config and immutable image overlay. Previous containers/volumes
remain available. Do not run `docker compose down --volumes` against production.

For a failed pre-promotion operation, first inspect its log and saved state;
automatic rollback reports any recovery failure explicitly. If the host lost
power or was killed, keep maintenance active while confirming which volume has
the latest user writes. Start the recorded old containers only if the candidate
never accepted public writes, then validate and restore that run's
`nginx.before.conf`. After public writes resumed, use a forward repair or an
operator-reviewed data migration; restoring an older database would lose writes.
No automatic cleanup removes recovery artifacts. Retain and back up the active
and previous volumes before operator-led housekeeping.

After the final reload command is issued, an error or interruption has an
uncertain outcome: Nginx may already have accepted candidate writes. The release
therefore preserves the candidate and active state for inspection instead of
starting an older database. Errors before that command, including final Nginx
configuration validation, still recover the previous deployment automatically.

## Verification without deployment

```bash
python -m unittest discover -s deploy -p 'test_*.py' -v
shellcheck deploy/*.sh
bash deploy/smoke-compose.sh
```

The Python suite injects build/import/HTTP/TLS/cutover failures and exercises a
real Bash boundary backed entirely by fake tools. `smoke-compose.sh` runs real
production images in a unique disposable CI Compose project, imports twice and
checks HTTP routes. It needs a non-secret CI `.env` and Docker. It does not call
Telegram or alter host Nginx, active release state, or production volumes.
