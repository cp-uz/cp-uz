# Olimpiada mavsumlari canonical content formati

Bu katalog cp.uz season timeline, olimpiadalar va mahalliy ishtirokchilar uchun tahrir
qilinadigan yagona manba. Har bir mavsum, olimpiada va ishtirokchi alohida JSON faylda
saqlanadi; bazadagi satrlar `import_seasons` orqali deterministik va idempotent yaratiladi.

## Tuzilma

```text
content/seasons/
  2025-2026/
    season.json
    events/
      apio-2026.json
      ioi-2026.json
      ...
    participants/
      jahonali-xaydaraliyev.json
      ...
  2026-2027/
    season.json
    events/
      ...
    participants/
      ...
  schema/
    season-content.schema.json
```

- `season.json` — mavsum metadata, route va eventlar orasidagi edge’lar.
- `events/<slug>.json` — bitta olimpiada/bosqich, resurslar, manbalar va natijalar.
- `participants/<slug>.json` — bitta canonical ishtirokchi profili va platforma akkauntlari.
- Event natijasidagi `participant` qiymati profil JSON’ini takrorlamaydi; u participant
  slugiga reference bo‘ladi.
- Katalog va fayl nomlari ichidagi slug bilan aynan teng bo‘lishi shart.

## Import

Buyruqlar `backend` katalogida bajariladi:

```bash
python manage.py import_seasons --dry-run
python manage.py import_seasons --prune
python manage.py import_seasons --path ../content/seasons --dry-run
```

Default manzil repository’da `content/seasons`, production containerda
`/app/content/seasons`.

- Import bitta tranzaksiyada ishlaydi: xato bo‘lsa hech narsa qisman saqlanmaydi.
- Bir katalogni qayta import qilish dublikat yaratmaydi. Mavsum `slug`, route/event `code`,
  resource/source `url`, participant `slug`, natija esa `key` orqali yangilanadi.
- `--dry-run` validatsiya va importni bajaradi, so‘ng tranzaksiyani rollback qiladi.
- `--prune` canonical fayllardan olib tashlangan season bolalari, natijalar, aliaslar va
  participant platforma akkauntlarini bazadan ham tozalaydi.
- `--clear` import qilinayotgan season sluglarini oldin o‘chirib qayta yaratadi; oddiy deploy
  uchun tavsiya qilinmaydi.
- Eski bitta `season_seed.json` fayli backward compatibility va testlar uchun `--path` orqali
  hali ham qabul qilinadi, lekin editorial manba sifatida ishlatilmaydi.

## Mavsum fayli

```json
{
  "slug": "2026-2027",
  "title": "2026–2027 sport dasturlash mavsumi",
  "summary": "Mavsum tavsifi.",
  "start_date": "2026-09-01",
  "end_date": "2027-09-30",
  "publication_status": "published",
  "verification_status": "pending",
  "is_featured": true,
  "order": 20,
  "routes": [
    {
      "code": "main",
      "title": "Asosiy olimpiada va IOI yo‘li",
      "kind": "official",
      "color": "blue",
      "order": 10
    }
  ],
  "edges": []
}
```

## Event fayli

```json
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
    {"route_code": "main", "order": 100, "node_style": "final"}
  ],
  "resources": [],
  "sources": [],
  "results": [
    {
      "key": "G1:participant:jahonali-xaydaraliyev",
      "participant": "jahonali-xaydaraliyev",
      "rank": 12,
      "score": "139.34",
      "medal": "silver",
      "is_local": true,
      "order": 1
    }
  ]
}
```

## Participant fayli

```json
{
  "full_name": "Jahonali Xaydaraliyev",
  "slug": "jahonali-xaydaraliyev",
  "country_code": "UZB",
  "school": "Muhammad al-Xorazmiy nomidagi ixtisoslashtirilgan maktab",
  "photo_url": "/assets/seasons/participants/jahonali-xaydaraliyev.jpg",
  "aliases": ["Jakhonali Khaydaraliev"],
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

Hozir qo‘llab-quvvatlanadigan platformalar: `codeforces`, `atcoder`, `kepuz` va
`robocontest`. Har bir akkauntda `handle`, `url`, ixtiyoriy `title`, `is_verified`,
`is_public` va `order` maydonlari mavjud.

## Identifikator va statuslar

- `Season.slug` global va o‘zgarmas: masalan `2025-2026`.
- `Route.code` va `Event.code` mavsum ichida unique.
- `Event.slug` URL va event fayli nomi uchun ishlatiladi.
- Har bir resultga barqaror `key` berish tavsiya qilinadi.
- `publication_status`, `event_status` va `verification_status` bir-biridan mustaqil.
- Sana noma’lum bo‘lsa `date_precision: "tba"` va `start_date/end_date: null` ishlatiladi;
  taxminiy soxta sana qo‘yilmaydi.
- Ism transliteratsiyasi farq qilsa bitta `full_name` va qidiruv uchun `aliases` ishlatiladi.

To‘liq validatsiya qoidalari [`schema/season-content.schema.json`](schema/season-content.schema.json)
faylida. Manba va aniqlik izohlari [`DATA_NOTES.md`](DATA_NOTES.md) da saqlanadi.
