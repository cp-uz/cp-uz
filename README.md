# cp.uz

`cp.uz` — sport dasturlash algoritmlarini o‘zbek tilida tizimli o‘rganish uchun ochiq bilim platformasi.

Platformada darsliklar katalogi, prerequisite-safe yo‘l xaritasi, atamalar lug‘ati, olimpiada mavsumlari, o‘zbekcha olimpiada masalalari, maqola readeri, shaxsiy progress, qaydlar va bookmarklar mavjud. Har bir darslik oxirida mavzuni mustahkamlash uchun saralangan tashqi mashq havolalari beriladi.

Maqolalar [cp-algorithms](https://cp-algorithms.com/) materiallari asosida o‘zbek tiliga tarjima va mahalliy o‘quvchi uchun adaptatsiya qilingan. Avvalgi o‘zbekcha tarjimalar [cp-uz/algo](https://github.com/cp-uz/algo) snapshotidan migratsiya qilingan; canonical kontent har bir maqolaning upstream manbasi va pinned revisionini saqlaydi.

Canonical snapshot hozir 163 ta to‘liq o‘zbekcha maqola, 885 ta strukturalangan tashqi mashq havolasi va inglizcha termin asosida A–Z ni to‘liq qamragan 174 atamani saqlaydi. Maqolalarning tahririyat belgilagan darajalari 58 ta boshlang‘ich, 67 ta o‘rta va 38 ta yuqori maqolaga taqsimlangan; barcha maqolalar importda nashr qilingan holatga o‘tadi.

## Repository arxitekturasi

```text
frontend/
  src/app/       router, provider va layoutlar
  src/modules/   auth, learning, engagement, seasons, problems va landing modullari
  src/shared/    umumiy API, hook, theme va UI primitive’lari
backend/
  apps/          accounts, articles, contributions, engagement, search, seasons va problems
  core/          Django settings, URL, ASGI/WSGI va SEO integratsiyasi
  common/        umumiy model, readiness, route, pagination va xato yordamchilari
  content_tools/ Django'dan mustaqil content kontrakti va integrity tekshiruvlari
content/
  articles/      canonical Markdown va media
  seasons/       season, event va participant canonical JSON fayllari
  problems/      event/set/masala JSON metadata va o‘zbekcha Markdown shartlar
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
python manage.py import_seasons --path ../content/seasons --prune
python manage.py import_problems --path ../content/problems --prune
python manage.py runserver 127.0.0.1:8000
```

Ikkinchi terminalda:

```bash
cd frontend
npm ci
npm run dev
```

Frontend Vite ko‘rsatgan lokal manzilda, backend esa `http://127.0.0.1:8000` da ishlaydi. Vite `/api` va `/media` so‘rovlarini Django serveriga uzatadi; qo‘shimcha lokal wrapper yoki environment variable kerak emas.

Olimpiada mavsumlari har bir season, event va participant uchun alohida canonical JSON fayllarda saqlanadi. Format sxemasi, minimal namuna, `--dry-run` va idempotent import qoidalari [season content qo‘llanmasida](content/seasons/README.md) berilgan.

Olimpiada masalalari har bir event, set va masala uchun tahrirlash oson bo‘lgan alohida JSON/Markdown fayllarda saqlanadi. Format va import qoidalari [masalalar content qo‘llanmasida](content/problems/README.md) berilgan.

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

Production va CI smoke tekshiruvlari Docker ishlatadi; lokal Django/Vite ish jarayoni o‘zgarmaydi. Har release Git SHA bo‘yicha alohida katalog va image ID bilan saqlanadi. Kandidat alohida Compose project, SQLite/media volume’lari va navbatdagi `127.0.0.1:18181` yoki `18182` portida tekshiriladi. Redis hamda Gunicorn host portlariga ochilmaydi.

Promote vaqtida cp.uz qisqa maintenance holatiga o‘tadi, eski web jarayonlari to‘xtatiladi va eng so‘nggi baza nusxasi kandidatda migration/importdan o‘tadi. HTTP/TLS tekshiruvlaridan keyin trafik ochiladi. Ungacha xato chiqsa oldingi containerlar va Nginx qaytariladi; eski SQLite sxemasiga tegilmaydi. Trafik ochilgandan keyingi ma’lumotlarni eski backup bilan avtomatik almashtirish taqiqlangan. Oldingi release kataloglari va volume’lari recovery uchun saqlanadi.

Kontent hajmi `deploy/content-inventory.json` manifestida review qilinadi. Canonical o‘zgarishlardan so‘ng `python scripts/release_inventory.py --write` bilan uni yangilang va `python scripts/release_inventory.py` bilan tekshiring. Ishlayotgan release haqidagi state `/home/cp_uz/.release/active.json` da saqlanadi. Server talablari, immutable checkout, health gate va recovery tartibi [deploy/README.md](deploy/README.md) da berilgan.

## Hamkorlik va siyosatlar

- [Hissa qo‘shish](CONTRIBUTING.md)
- [Xavfsizlik siyosati](SECURITY.md)
- [Xulq-atvor qoidalari](CODE_OF_CONDUCT.md)
- [O‘zgarishlar tarixi](CHANGELOG.md)

Kod litsenziyasi [LICENSE](LICENSE) da, moslashtirilgan kontent atribusiyasi va CC BY-SA 4.0 shartlari esa [content/ATTRIBUTION.md](content/ATTRIBUTION.md) da ko‘rsatilgan. Har bir migratsiya qilingan maqola upstream manba va pinned revisionni saqlaydi.
