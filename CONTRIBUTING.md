# Hissa qo‘shish

cp.uz sport dasturlash algoritmlarini o‘zbek tilida o‘rgatuvchi, learning-only ochiq platformadir. Judge, contest, submission yoki alohida masalalar banki bu loyiha doirasiga kirmaydi; darslikdagi mashqlar tashqi platformalarga havola qiladi.

Ishtirok etishdan oldin [Code of Conduct](CODE_OF_CONDUCT.md) va xavfsizlik muammolari uchun [Security Policy](SECURITY.md) bilan tanishing.

## Muhitni tayyorlash

Talablar: Python 3.12, Node.js 22.12 yoki yangi versiya va npm.

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

Boshqa terminalda:

```bash
cd frontend
npm ci
npm run dev
```

Vite `/api` va `/media` so‘rovlarini lokal Django serveriga uzatadi. Lokal rivojlantirish uchun Docker talab qilinmaydi.

## Qayerni o‘zgartirish kerak

- `frontend/src/app` — router, provider va umumiy layoutlar.
- `frontend/src/modules` — mahsulot modullari; modul chegaralarini va typed API qatlamini saqlang.
- `frontend/src/shared` — faqat bir nechta modulga kerak bo‘ladigan umumiy kod.
- `backend/apps` — Django domen ilovalari, API va testlar.
- `content/articles` hamda `content/metadata/articles.yml` — darsliklarning canonical manbasi.
- `scripts` — deterministik import, readiness va kontent validatsiyasi.
- `deploy` — production kontrakti; unrelated serverlar yoki loyihalarni scope’ga kiritmang.

Generated `content/exports/articles.v1.json` va `content/MANIFEST.sha256` fayllarini qo‘lda tahrirlamang. Canonical Markdown yoki metadata o‘zgargach:

```bash
python scripts/export_content.py
python scripts/validate_content.py
python -m unittest scripts/test_content_pipeline.py -v
```

Automated readiness renderer, link, metadata va yaxlitlik dalilidir; u texnik yoki til bo‘yicha inson tasdig‘i o‘rnini bosmaydi. Review holatini dalilsiz ommaviy ravishda o‘zgartirmang.

## Majburiy tekshiruvlar

Pull request yuborishdan oldin o‘zgarishga mos testlar bilan birga quyidagi to‘liq gate’larni yuriting:

```bash
cd backend
python -m ruff check .
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py spectacular --validate --fail-on-warn --file openapi.local.yml
python manage.py test

cd ../frontend
npm run lint
npm run typecheck
npm test
npm run build
```

`openapi.local.yml` tekshiruv artefakti, commit qilinadigan source emas.

## Pull request talablari

- Bitta aniq maqsadga qaratilgan, kichik va tekshiriladigan diff yuboring.
- Foydalanuvchi ko‘radigan matnni tabiiy o‘zbekcha yozing; raw importer/model identifikatorlarini UI’da ko‘rsatmang.
- Yangi xatti-harakatga test, API o‘zgarishiga schema va backward-compatibility izohi qo‘shing.
- Legacy `/algo/...` havolalari, Markdown ichki linklari va media yo‘llarini buzmaslikni tekshiring.
- Secret, `.env`, real token, database dump yoki shaxsiy ma’lumot commit qilmang.
- Qaysi buyruqlar ishlatilgani va natijasini PR tavsifida yozing.

Kontent CC BY-SA 4.0 talablariga, kod esa repository [LICENSE](LICENSE) shartlariga mos bo‘lishi kerak. Upstream atribusiya va pinned revisionni saqlang.
