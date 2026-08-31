# cp.uz

`cp.uz` — sport dasturlash algoritmlarini o‘zbek tilida tizimli o‘rganish uchun ochiq bilim platformasi.

Platformada darsliklar katalogi, prerequisite-safe yo‘l xaritasi, atamalar lug‘ati, maqola readeri, shaxsiy progress, qaydlar va bookmarklar mavjud. Mashq havolalari tashqi platformalarga olib boradi; loyiha judge, contest, submission yoki alohida masalalar bankini o‘z ichiga olmaydi.

Canonical snapshot hozir 163 ta to‘liq o‘zbekcha maqola, 885 ta strukturalangan tashqi mashq havolasi va inglizcha termin asosida A–Z ni to‘liq qamragan 174 atamani saqlaydi. Maqolalarning tahririyat belgilagan darajalari 58 ta boshlang‘ich, 67 ta o‘rta va 38 ta yuqori maqolaga taqsimlangan. Automated readiness kontentning texnik va til bo‘yicha inson tasdig‘ini anglatmaydi; ichki review holati public nashr statusidan alohida saqlanadi.

## Repository arxitekturasi

```text
frontend/
  src/app/       router, provider va layoutlar
  src/modules/   auth, learning, engagement va landing modullari
  src/shared/    umumiy API, hook, theme va UI primitive’lari
backend/
  apps/          accounts, articles, contributions, engagement va search
  config/        Django settings, URL va ASGI/WSGI entrypointlar
content/
  articles/      canonical Markdown va media
  metadata/      taxonomy, provenance va review metadata
  exports/       deterministik backend import payloadi
scripts/         content export, readiness va integrity tekshiruvlari
deploy/          production Docker/Nginx va release kontrakti
```

Frontend API’ni typed data-access qatlamidan iste’mol qiladi. Django canonical JSON snapshotni idempotent import qiladi; generated export yoki checksumlar editorial source hisoblanmaydi.

## Lokal ishga tushirish

Talablar: Python 3.12, Node.js 22.12 yoki yangi versiya va npm. Lokal rivojlantirish uchun Docker ishlatilmaydi.

Birinchi terminalda:

```bash
cd backend
python -m venv .venv
# PowerShell: .\.venv\Scripts\Activate.ps1
# Linux/macOS: source .venv/bin/activate
python -m pip install -r requirements/dev.txt
python manage.py migrate
python manage.py import_content --path ../content/exports/articles.v1.json
python manage.py runserver 127.0.0.1:8000
```

Ikkinchi terminalda:

```bash
cd frontend
npm ci
npm run dev
```

Frontend Vite ko‘rsatgan lokal manzilda, backend esa `http://127.0.0.1:8000` da ishlaydi. Vite `/api` va `/media` so‘rovlarini Django serveriga uzatadi; qo‘shimcha lokal wrapper yoki environment variable kerak emas.

## Tekshiruvlar

Backend:

```bash
cd backend
python -m ruff check .
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py spectacular --validate --fail-on-warn --file openapi.local.yml
python manage.py test
```

Frontend va renderer:

```bash
cd frontend
npm run lint
npm run typecheck
npm test
npm run build
```

Canonical kontent va deploy kontrakti:

```bash
python scripts/validate_content.py
python -m unittest scripts/test_content_pipeline.py -v
python -m unittest discover -s deploy -p "test_*.py" -v
```

## CI/CD

`.github/workflows/ci.yml` pull requestlar, `main` pushlari va qo‘lda ishga tushirishda quyidagilarni gate qiladi:

- Ruff, Django check, migration drift, OpenAPI schema va to‘liq backend testlari;
- ESLint, TypeScript, to‘liq frontend/Markdown testlari va production build;
- canonical kontent checksumlari va deploy kontrakt testlari;
- barcha gate’lardan keyin production container build.

`.github/workflows/deploy.yml` faqat `main` uchun muvaffaqiyatli **CI** `push` runidan keyin avtomatik ishlaydi yoki aniq 40 belgili commit SHA bilan qo‘lda chaqiriladi. Workflow GitHub `production` environmenti, bitta production concurrency guruhi, pinned host key va restricted SSH keydan foydalanadi. Kerakli secrets:

- `CPUZ_DEPLOY_HOST`
- `CPUZ_DEPLOY_USER`
- `CPUZ_DEPLOY_KEY`
- `CPUZ_KNOWN_HOSTS`

Remote tomonga faqat `deploy <40-hex-sha>` yuboriladi; server SSH kaliti forced-command bilan cheklanishi kerak. Workflow konfiguratsiyasining repository’da mavjudligi production release muvaffaqiyatli bajarilganini anglatmaydi.

## Production

Docker faqat production release uchun ishlatiladi. Compose tashqi tarmoqqa faqat loopback’dagi application portini chiqaradi; PostgreSQL, Redis va Gunicorn host portlariga ochilmaydi. Server talablari, health gate, Nginx almashinuvi va rollback tartibi [deploy/README.md](deploy/README.md) da yozilgan.

## Hamkorlik va siyosatlar

- [Hissa qo‘shish](CONTRIBUTING.md)
- [Xavfsizlik siyosati](SECURITY.md)
- [Xulq-atvor qoidalari](CODE_OF_CONDUCT.md)
- [O‘zgarishlar tarixi](CHANGELOG.md)

Kod litsenziyasi [LICENSE](LICENSE) da, moslashtirilgan kontent atribusiyasi va CC BY-SA 4.0 shartlari esa [content/ATTRIBUTION.md](content/ATTRIBUTION.md) da ko‘rsatilgan. Har bir migratsiya qilingan maqola upstream manba va pinned revisionni saqlaydi.
