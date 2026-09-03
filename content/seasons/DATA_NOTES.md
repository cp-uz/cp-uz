# Season seed: manba va aniqlik izohlari

`content/seasons/` 2026-09-01 holatiga ko‘ra 2025–2026 hamda 2026–2027 sport
dasturlash mavsumlarini alohida season, event va participant JSON fayllarida saqlaydi.
Katalog `import_seasons` orqali idempotent import qilinadi. Mavsum biriktirilishi o‘quv/saralash
sikliga qarab belgilanadi; shu sababli IOI 2027 sentabrda bo‘lsa ham 2026–2027 siklining
yakuniy tuguni hisoblanadi.

## Aniqlik qoidasi

- `verified` + `day/range`: sana va fakt birlamchi rasmiy manbada tekshirilgan.
- `verified` + `month`: oy tekshirilgan, lekin barcha kunlar ishonchli ochiq manbada yo‘q.
- `pending` yoki `date_precision: tba`: tugun yo‘l xaritasi uchun kerak, ammo sana,
  format yoki kvota hali rasmiy tasdiqlanmagan. 2025-yil sanalari 2027-ga taxmin sifatida
  ko‘chirilmagan.
- `13A` va `13B` — Al-Xorazmiy yo‘lidagi tekshirilgan tuman/shahar hamda hududiy
  bosqichlarni yo‘qotmaslik uchun qo‘shimcha kodlar. Foydalanuvchi bergan `1–15`,
  `G1–G5`, `U1–U2` kodlarining barchasi ham saqlangan; `14` xalqaro Al-Xorazmiy/KhIMIO
  terma jamoasi saralashining I bosqichi.
- Oltin rang alohida route emas: `G1–G5` o‘z yo‘nalishining `node_style: final` tuguni.

## 2025–2026 qamrovi

Quyidagi mahalliy natijalar rasmiy jadvaldan kiritilgan:

- IOI 2026 — 8 O‘zbekiston ishtirokchisi (4 asosiy va mezbonning 4 qo‘shimcha
  ishtirokchisi), [IOI Statistics](https://stats.ioinformatics.org/results/UZB).
- EGOI 2026 — 4 ishtirokchi, [EGOI Statistics](https://stats.egoi.org/countries/UZB/results/).
- APIO 2026 — rasmiy reytingdagi 6 O‘zbekiston ishtirokchisi: 1 kumush, 2 bronza va
  3 medalsiz natija. O‘rin, ball va medal holati
  [APIO 2026 rasmiy reytingi](https://www.apio2026.ntnu.tw/ranking)dan olindi;
  medal jami [Fan olimpiadalari markazi](https://olympcenter.uz/uz/olympiads/mintaqaviy)
  statistikasi bilan ham tasdiqlandi. Oldingi mahalliy xabardagi «4 medal» ma’lumoti
  tashkilotchi jadvaliga zid bo‘lgani uchun ishlatilmadi.
- KhIMIO 2026 — rasmiy natija jadvalidagi 44 O‘zbekiston ishtirokchisi,
  [khimio.uz/results](https://www.khimio.uz/results).
- IZhO 2026 informatika — 7 ishtirokchi: 2 oltin, 2 kumush, 2 bronza va 1 medalsiz natija,
  [rasmiy IZhO natijalari](https://izho.kz/contest/results-izho-2026/).
- InfO(1)Cup 2026 — 4 ishtirokchi,
  [rasmiy medal jadvali](https://info1cup.com/archive/2026/MEDALS%20DISTRIBUTION%20INFO1CUP_2026.pdf).

Asosiy mahalliy yo‘l Fan olimpiadalari markazi va
[Olympcenter](https://olympcenter.uz/uz/olympiads/local) manbalari bilan bog‘langan.
IOI 2026 tayyorgarligi alohida sanalari to‘liq ochiq bo‘lmagan sakkiz yig‘inni bitta `T1`
agregat tugunida saqlaydi. Timeline 2025-yil noyabr–2026-yil iyul oy chegaralarini
ko‘rsatadi; boshlanish davri, yig‘inlar soni va xorijiy murabbiylar ishtiroki
[Raqamli texnologiyalar vazirligi](https://gov.uz/ru/digital/news/view/200451) bilan
tasdiqlangan.

## Ochiq qolgan TBA bandlar

- 2025–2026 Asosiy olimpiada maktab bosqichi vazirlik xati bo‘yicha 17–25-sentabr
  oralig‘iga aniqlandi; maktablar fan kunini shu oynada mustaqil belgilagan.
- EGOI yo‘lidagi hududiy Qizlar olimpiadasi (`10`) 29-noyabrda o‘tkazilgani rasmiy post
  va RoboContest/Electicode natijalari bilan tasdiqlandi. Alohida maktab bosqichi (`9`)
  uchun nashrga xos yagona reja-grafik topilmagani sababli faqat shu tugun TBA qoladi.
- Al-Xorazmiy maktab bosqichining hududiy reja oynasi 11–22-dekabr deb kiritildi;
  alohida maktablar shu oraliqda turli kunlarda o‘tkazgan.
- APIO milliy ishtirokchilarni shakllantirish tuguni (`15`) uchun alohida ochiq saralash
  sanasi topilmadi; u APIO finaliga `related_to`, `qualifies_to` emas.
- IOI 2026 yakuniy saralashida 2-, 3- va 4-turlar mos ravishda 11-, 13- va 14-iyunda
  rasmiy postlarda tasdiqlangan. Timeline hujjatlashtirilgan 11–14-iyun oralig‘ini
  ko‘rsatadi; 1-turning aniq kuni alohida ochiq postda topilmadi.
- VKOSHP 2025–2026 jadvalida O‘zbekiston jamoasining ishonchli rasmiy natijasi
  aniqlanmagani uchun mahalliy natija kiritilmadi.
- 2026–2027 milliy bosqichlar, treninglar, IZhO/KhIMIO/VKOSHP/InfO(1)Cup sanalari TBA.
  Tasdiqlangan xalqaro ma’lumotlar: IOI 2027 — 12–19-sentabr, Potsdam;
  EGOI 2027 — Varshava, sana TBA; APIO 2027 — Suzhou, sana TBA.

Ismlar bir nechta rasmiy manbada turlicha transliteratsiya qilinganida bitta canonical
`full_name` va qidiruv/import uchun `aliases` ishlatiladi. Ballar JSON float xatosini
oldini olish uchun kasrli qiymatlarda decimal string sifatida saqlangan. Har bir natijada
event kodi, ishtirokchi slugi va kerak bo‘lsa kategoriyadan tuzilgan barqaror `key` bor;
shu sababli natijalar tartibi o‘zgarganda ham idempotent import mavjud satrni yangilaydi.

## Ishtirokchi platforma profillari

Seedga faqat ism yoki handle taxmini bilan emas, ochiq profil yoki ishtirokchi ro‘yxatida aniq
mosligi ko‘ringan Codeforces akkauntlari kiritildi. Hozir Jahonali Xaydaraliyev (`JahonaliX`),
Timur Kadirbergenov (`Timosh`), Ulug‘bek Raxmatullayev (`Ulugbek2008`), Jahongirshoh
Avazxonov (`_Jahongir_`), Humoyun Abduraupov (`khba`), Isamatdin Baybolov (`Isamatdin`),
Sardor Salimov (`0gur4ik`), Oysha Mirzatillayeva (`Aisham`) va Rayxona Sanakulova
(`AzulSafiro`) profillari mavjud. Asosiy tekshiruv manbalari:

- Codeforcesdagi bevosita public profil sahifalari;
- [KhIMIO 2025 ishtirokchilar ro‘yxati](https://codeforces.com/blog/entry/142658);
- [APIO 2026 muhokamasidagi O‘zbekiston natijalari](https://codeforces.com/blog/entry/153474);
- [IOI 2026 O‘zbekiston natijalari va handlelar](https://codeforces.com/blog/entry/155963).

IOI Statistics va EGOI Statistics sahifalarida aniq ishtirokchiga biriktirilgan rasmiy portretlar
lokal asset sifatida saqlandi. Rasm topilmagan profillarda ism-harflar o‘rniga neytral ishtirokchi
avatari ishlaydi. Platforma
akkauntlari hozircha Codeforces, AtCoder, KEP.uz va Robocontest bilan cheklangan; ular admin
paneldagi inline formada kiritiladi.

Rasmiy portret manbalari:

- IOI Statistics: Jakhonali Khaydaraliev (`9095`), Jahongir Shoh Avazkhonov (`9094`),
  Ulug‘bek Rakhmatullaev (`8464`), Timur Kadirbergenov (`8810`) va Sardor Salimov (`8809`);
- EGOI Statistics: Oysha Mirzatillaeva (`709`) va Raykhona Sanakulova (`1215`).
- EGOI Statistics: Malika Khojamuratova (`708`).
- RoboContest: Temurbek Ubaydullayevning tasdiqlangan `temur_ubaydullayev` profili.
- Ixtisoslashtirilgan ta’lim muassasalari agentligi: Umar Xayyom xalqaro olimpiadasi
  natijalari kollajida ism bilan belgilangan Shahruz Erkinov portreti.

Platforma logolari ham runtime tashqi URLga bog‘lanmasligi uchun rasmiy sayt aktivlaridan lokal
saqlandi: Codeforces favicon, AtCoder favicon, KEP.uz `logo.svg` va Robocontest favicon.

## Rasmiy brend aktivlari

Timeline uchun tashqi URLlarga runtime’da bog‘lanmaslik maqsadida rasmiy aktivlarning
optimallashtirilgan lokal nusxalari `frontend/public/assets/seasons/` ichida saqlanadi:

- `olympcenter.png` — Fan olimpiadalari markazining 512×512 rasmiy ikonkasidan
  256×256 nusxa; manba: <https://olympcenter.uz/icon.png?a536ce808700bde2>.
- `ioi.png` — umumiy IOI belgisi, 264×206 PNG; manba:
  <https://ioinformatics.org/icons/ioi-logo-2020.png>.
- `egoi.png` — umumiy EGOI header belgisi, 240×78 PNG; manba:
  <https://egoi.org/EGOI_header.png>.
- `khimio.png` — KhIMIO rasmiy `logoblue.png` belgisining 520×400 nusxasi; manba:
  <https://www.khimio.uz/logo/logoblue.png>.
- `apio-2026.png` — APIO Taiwan 2026 mezbon saytida berilgan 1280×632 PNG wordmark.
  APIOning barqaror markaziy brend aktivi topilmadi; shu sababli bu fayl faqat
  2025–2026 mavsumiga xos. 2026–2027 route headerida umumiy ikonka fallback ishlatiladi.
  Provenance: <https://www.apio2026.ntnu.tw/>.
- `vkoshp.ico` — VKOSHP rasmiy NEERC maktab olimpiadalari saytining favicon belgisi;
  manba: <https://neerc.ifmo.ru/favicon.ico>.
- `info1cup.png` — InfO(1)Cup rasmiy saytidagi yashil aylana favicon belgisi;
  manba: <https://info1cup.com/favicon.png>.
