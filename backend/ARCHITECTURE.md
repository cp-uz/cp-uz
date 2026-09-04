# Backend architecture

The backend separates Django project wiring, reusable infrastructure and product
domains. The public API and existing Django app labels are preserved by this
refactor; moving Python modules does not rename database tables or migrations.

```text
backend/
  core/
    settings/       base, development and production configuration
    urls.py         API/admin/SEO route composition
    asgi.py         ASGI entrypoint
    wsgi.py         Gunicorn/WSGI entrypoint
    seo.py          project robots.txt integration
    sitemaps.py     sitemap composition across product domains
  common/
    models.py       abstract TimeStampedModel
    health.py       database/cache readiness response
    frontend_routes.py
    pagination.py
    exceptions.py
  apps/
    accounts/       identities, authentication and guest upgrade
    articles/       lessons, taxonomy, prerequisites and revisions
    contributions/ reviewed edit proposals
    engagement/    user progress, notes, bookmarks and glossary quiz
    seasons/       olympiad seasons, events and participants
    problems/      event problem sets, statements and source links
    search/        cross-domain public search
    feedback/      feedback delivery and Telegram integration
    community/     community invitation integration
  content_tools/   framework-independent import contracts and integrity
```

Use `core.settings.development` locally and `core.settings.production` in
production. `core` composes the application; product domains do not import project
settings modules directly. Read configured values through `django.conf.settings`.
`common` may depend on Django and standard infrastructure packages, but it must
not import product models or services. Its timestamp model is abstract, so common
does not need a separate registered Django application.

## Domain boundaries

Each application owns its models, permissions and use cases. Larger modules use
packages organized by responsibility, with explicit public exports from
`models`, `serializers`, `views`, `services` or `selectors` as appropriate. Small
modules remain files. Public exports keep consumers independent of file layout;
they do not introduce alternate implementations or duplicate business rules.

For example, article models separate taxonomy, content, relations and glossary;
season models separate events, sources, participants and results. Engagement
separates reading state from quiz scoring. Account services separate credentials,
guest creation and upgrade, while problem PDF retrieval has its own service.

Views handle HTTP input, authentication and response selection. Serializers
validate and describe API data. Services own business operations and transaction
boundaries when a write touches several records or enforces a workflow. Selectors
own reusable read queries, visibility filters and related-object loading. Models
own persistent identities and invariants; database constraints enforce identities
that must hold across concurrent writes. Administrative and API mutations should
use the same service when they perform the same business operation.

Dependencies flow from views and commands through services/selectors to models.
Models must not import views, serializers or project URL composition. Cross-domain
dependencies should use another domain's public model/service/selector API. Avoid
importing another application's private package modules. Django migration files
remain historical records; retain an old callable import only when a migration
actually depends on it.

## Canonical content imports

`content_tools` is independent of Django and is shared by scripts and management
commands. It validates problem catalog identity, source paths and schema,
complete snapshot checksums, and the reviewed release inventory. Article export
validation and prerequisite reconciliation live in `apps.articles.importing`;
season parsing and semantic validation live in `apps.seasons.importing`.

Import commands read and validate their source before applying transactional
persistence. Repeated imports reconcile changed rows and related collections,
including removed prerequisites; they do not append duplicate records. A problem
slug is unique within its event across all sets, matching public URL identity.
Upstream fetchers prepare candidate directories. Promotion validates the complete
candidate and updates canonical checksums/inventory together.

## Runtime and verification

Readiness checks the database and Redis/cache because authentication throttles
and application APIs require both. Production trusts the two configured proxy
hops; host Nginx discards caller-provided forwarding headers. Gunicorn startup
only serves requests. Candidate release preparation owns migrations, static
collection and imports before public traffic is enabled.

Run backend checks from `backend/`:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py spectacular --validate --fail-on-warn --file /tmp/cpuz-openapi.yml
python -m coverage run manage.py test --verbosity 2
python -m coverage report --fail-under=80
python -m ruff check --config pyproject.toml . ../scripts ../deploy
```

Coverage includes `apps`, `core`, `common` and `content_tools`. Domain tests should
exercise observable invariants, authorization and transaction outcomes. Content
and deployment suites live in `scripts/` and `deploy/`; deployment failure tests
use fake external tools and temporary data. The separate container CI job builds
production images, imports twice and checks real HTTP routes in disposable volumes.
