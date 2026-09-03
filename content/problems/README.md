# Olimpiada masalalari

Bu katalog `Masalalar` bo‘limining canonical source of truth’i. Ma’lumotlar production
bazasiga `python manage.py import_problems --path /app/content/problems --prune` orqali
tranzaksion va idempotent import qilinadi.

## Tuzilma

```text
content/problems/
  2025-2026/
    ioi-2026-saralash-4/
      event.json
      day-1/
        set.json
        yashirin-tartib/
          problem.json
          statement.uz.md
```

- `event.json` mavjud `content/seasons` season va event sluglariga ulanadi hamda set
  papkalarini tartib bilan sanaydi.
- `set.json` kun/bosqich metadata va masala papkalarini sanaydi.
- `problem.json` sarlavha, limitlar, tarjima holati, manbalar, yechish havolalari va
  attachmentlarni saqlaydi.
- `statement.uz.md` — KaTeX bilan render qilinadigan o‘zbekcha Markdown shart.

Har bir URL aniq provenance bilan kiritiladi: `original` asl shart/manbaga,
`practice` esa masalani topshirish mumkin bo‘lgan platformaga olib boradi. Bir platforma
ikkala vazifani bajarsa, ikkala link ham saqlanishi mumkin. Tasdiqlanmagan yoki topilmagan
manba taxmin bilan kiritilmaydi.

## Tekshirish va import

```bash
cd backend
python manage.py import_problems --dry-run
python manage.py import_problems --prune
```

`--dry-run` sxema, season/event bog‘lanishi, fayl pathlari va model validatsiyasini
bazani o‘zgartirmasdan tekshiradi. `--prune` canonical ro‘yxatdan olib tashlangan set,
masala, link va attachmentlarni o‘chiradi.

Tashqi rasmiy arxivlardan yangilanadigan datasetlar uchun reproducible maintainer
skriptlari bor. Masalan, IOI 2026 dagi delegatsiya tekshirgan o‘zbekcha PDF’larni
yangilash:

```bash
python scripts/sync_ioi_2026_archive.py
python scripts/sync_egoi_2026_archive.py
```

IZhO 2026 katalogi tashkilotchining [rasmiy masalalar arxivi](https://izho.kz/contest/problems/)
va undagi 11–12-yanvar inglizcha PDF’lariga tayanadi. APIO 2026 masalalari esa
[tashkilotchining ochiq task repozitoriysi](https://github.com/apio2026/apio-2026)dan
olingan; yechish havolalari QOJ’dagi mos mirrorlarga olib boradi. Rasmiy arxivda
submission tizimi ochiq qolmagan bo‘lsa, `original` havolaning o‘zi public katalog
uchun yetarli: mavjud bo‘lmagan `practice` URL taxmin qilinmaydi.

JSON hujjatlari [`schema/problem-content.schema.json`](schema/problem-content.schema.json)
bilan tekshiriladi. Yangi masala qo‘shilganda avval `problem.json` va
`statement.uz.md` yaratiladi, so‘ng uning papkasi tegishli `set.json` dagi `problems`
ro‘yxatiga qo‘shiladi.
