# 15-150 HW09 grader

Standalone Flask service mounted at `https://cp.uz/grader15150/`. Course staff
have personal admin accounts inside this grader. These roles do not grant
access to cp.uz's Django administration.

## Private assets and accounts

Obtain `autograde.tar` from the supplied `grader15150.zip` and place it beside
the Dockerfile on a private build host. It contains reference solutions and
tests: never commit it, put it under a web root, or publish the grading image.
The Git and Docker ignore files keep private grader assets out of the main
application's source archive and images.

Install `server/requirements.txt` in a virtual environment. Provision accounts:

```bash
python server/app.py make-roster /private/id.txt \
  --roster /private/roster.csv --credentials /private/new-access-codes.csv
```

`Staff:` selects the `admin` role; `Students:` selects `student`. Plain username
lists default to `student`. Headings and blank lines never become accounts.
Re-running preserves existing access-code hashes and updates the listed roles.
Only new accounts appear in the new credentials export, which must not already
exist. Keep that export private; the deployed roster contains salted hashes.
Existing accounts absent from an incremental list are retained. To revoke an
account, remove its row from the private roster. To reset its code, remove the
row and provision that username again, explicitly using its intended section.
Role changes and code resets apply to existing sessions on their next request.

## Install and expose

On the Linux Docker/systemd host, after reviewing the private roster:

```bash
docker build -t cpuz-hw09-autograder:hw09 .
sudo bash deploy/install.sh /private/roster.csv cpuz-hw09-autograder:hw09
```

The installer preserves an existing secret key and runtime limits, installs
hashed accounts, and pins the service to the built image ID. It uses one
Gunicorn worker because the submission lock and queue are process-local.
The initial production concurrency is one container to limit load on the
shared host. Adjust `MAX_PARALLEL`, `MAX_PENDING`, `MAX_SUBMISSIONS` and
`GRADE_TIMEOUT` in `/opt/grader15150/grader.env`, then restart the service.

The cp.uz host Nginx template contains the dedicated `/grader15150` proxy route.
For an independent installation, insert `deploy/nginx-grader15150.conf` inside
the correct TLS server block, run `nginx -t`, and reload. Keep the public cp.uz
service worker's `/grader15150` exclusion; private login/results must never
replace the public app shell cache. Secure, HttpOnly cookies use a separate
name and `/grader15150` path; all responses prohibit caching and indexing.

Test both staff and student access before opening the route. Staff can inspect
all submissions and filter by username; students can inspect only their own.
All users may submit the two required source files, directly or in a ZIP, with
a default maximum of five submissions. A reference submission should score
60/60. Test with a staff account so student submission allowances remain intact.

## Isolation and operations

Containers use a non-root UID, no network, no Linux capabilities, a read-only
root filesystem, bounded tmpfs/output, and memory, CPU and process limits.
Only source files and submission metadata are mounted from the host, both
read-only. Results return over stdout rather than a writable host mount.
Timeout and overflow handling explicitly remove the named container. Service
startup removes only containers labelled `app=cpuz-grader15150` and marks
interrupted jobs as infrastructure errors. Docker startup failures and service
interruptions do not consume attempts. Owners and staff can retry those records
using **Retry grading**, without uploading the files again. Compilation and
execution failures still count toward the limit.

Startup also maintains `grader15150-image-guard`, a restricted, networkless
container running only `sleep`. Its live image reference prevents routine
`docker image prune -a` / `docker system prune -a` from deleting the otherwise
idle grader image between submissions. Do not remove this container during
server cleanup. Its label is separate from grading jobs so recovery leaves it
running. The health endpoint checks that the configured image actually exists,
and uploads are rejected without spending an attempt if it is unavailable.

The supplied Gradescope tester executes student SML and the evaluator in the
same process/container. Host isolation does not make this evaluator resistant
to deliberate score forgery or reference-solution introspection. Treat results
as course feedback; a tamper-resistant official judge requires a separate
evaluation boundary.

Logs: `journalctl -u grader15150` and
`/opt/grader15150/data/submissions/<id>/log.txt`. Source files and results remain
under the private data directory. The admin result view exposes grader logs
only to staff. Back up the data directory and `grader.env` securely.

```bash
python -m unittest discover -s server -p 'test_*.py' -v
python -m ruff check .
```

For local UI work set a random `SECRET_KEY` of at least 32 characters, point
`ROSTER` at a private test roster, and run `python server/app.py serve` on
`127.0.0.1:8150`. Local serve explicitly disables the secure-cookie requirement;
the production Gunicorn factory always enables it.
