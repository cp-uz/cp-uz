# Season timeline import formati

`season_seed.json` — cp.uz olimpiada mavsumlarining ko‘chma va idempotent manbasi. Formatning
rasmiy tavsifi [`season_seed.schema.json`](season_seed.schema.json) faylida. Hozirgi versiya:
`schema_version: 1`.

## Import

Buyruqlar `backend` katalogida bajariladi:

```bash
python manage.py import_seasons --dry-run
python manage.py import_seasons
python manage.py import_seasons --prune
python manage.py import_seasons --path /absolute/path/to/season_seed.json --dry-run
```

- Import bitta tranzaksiyada ishlaydi: xato bo‘lsa hech narsa qisman saqlanmaydi.
- Bir faylni qayta import qilish dublikat yaratmaydi. Mavsum `slug`, route va event `code`,
  resource/source `url`, natija esa `key` orqali yangilanadi.
- `--dry-run` barcha model va bog‘lanishlarni tekshiradi, statistika chiqaradi va tranzaksiyani
  rollback qiladi.
- `--prune` faqat import qilinayotgan mavsumlarda JSON’dan olib tashlangan route, event, edge,
  membership, resource, source, result, team va team memberlarni o‘chiradi.
- `--clear` fayldagi season sluglariga mos mavsumlarni oldin butunlay o‘chiradi. U odatiy deploy
  uchun emas, nazoratli to‘liq qayta import uchun mo‘ljallangan.

Default fayl manzili: `apps/seasons/data/season_seed.json`.

## Identifikatorlar

- `Season.slug` global va o‘zgarmas: masalan `2025-2026`.
- `Route.code` mavsum ichida unique: `ioi`, `egoi`, `khimio`, `apio`, `unofficial`.
- `Event.code` mavsum ichida unique va chizmadagi qisqa kod bo‘lishi mumkin: `1`, `G1`, `U2`.
- `Event.slug` URL uchun mavsum ichida unique: `ioi-2026`.
- Har bir resultga barqaror `key` berish tavsiya qilinadi. U berilmasa importer subject,
  category va orderdan deterministik key yasaydi.

Ism yozilishlari turli manbalarda farq qilsa, bitta canonical `full_name` va `aliases` ro‘yxati
ishlatiladi. Importer alias orqali mavjud ishtirokchini topadi va alohida dublikat yaratmaydi.

Ishtirokchi profilini natijalardan birida bir marta boyitish yetarli: keyingi importlarda shu
entity qayta ishlatiladi. `bio` va `photo_url` public kartochka uchun, `platform_accounts` esa
Codeforces, AtCoder, KEP.uz va Robocontest akkauntlari uchun ishlatiladi. Har bir akkauntda
`platform`, `handle`, `url`, ixtiyoriy `title`, `is_verified`,
`is_public` va `order` maydonlari bor. `is_public: false` akkaunt public API’da ko‘rsatilmaydi.
Xuddi shu maydonlarni Django adminidagi ishtirokchi sahifasida ham tahrirlash mumkin.

```json
{
  "full_name": "Jahonali Xaydaraliyev",
  "slug": "jahonali-xaydaraliyev",
  "photo_url": "/assets/seasons/participants/jahonali-xaydaraliyev.jpg",
  "platform_accounts": [
    {
      "platform": "codeforces",
      "handle": "JahonaliX",
      "url": "https://codeforces.com/profile/JahonaliX",
      "is_verified": true
    }
  ]
}
```

## Statuslar

Uch holat bir-biridan mustaqil:

- `publication_status`: ma’lumot public API’da ko‘rinadimi;
- `event_status`: tadbir TBA, rejalashtirilgan, jonli yoki yakunlanganmi;
- `verification_status`: kiritilgan faktlar manba bilan tekshirilganmi.

Sana noma’lum bo‘lsa `date_precision: "tba"` va `start_date/end_date: null` ishlatiladi. Soxta
sana qo‘yilmaydi. Mavsumga biriktirilgan event sanasi mavsumning nominal oralig‘idan tashqarida
bo‘lishi mumkin — masalan, keyinroq o‘tkaziladigan xalqaro final.

## Minimal namuna

```json
{
  "schema_version": 1,
  "seasons": [
    {
      "slug": "2026-2027",
      "title": "2026–2027 mavsumi",
      "start_date": "2026-09-01",
      "end_date": "2027-09-30",
      "publication_status": "published",
      "verification_status": "pending",
      "routes": [
        {
          "code": "ioi",
          "title": "IOI yo‘nalishi",
          "kind": "selection",
          "color": "blue"
        }
      ],
      "events": [
        {
          "code": "G1",
          "slug": "ioi-2027",
          "title": "IOI 2027",
          "type": "international",
          "publication_status": "published",
          "event_status": "scheduled",
          "verification_status": "verified",
          "date_precision": "range",
          "start_date": "2027-09-12",
          "end_date": "2027-09-19",
          "route_memberships": [
            {"route_code": "ioi", "order": 100, "node_style": "final"}
          ],
          "resources": [],
          "sources": [],
          "results": []
        }
      ],
      "edges": []
    }
  ]
}
```
