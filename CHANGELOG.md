# O‘zgarishlar tarixi

Muhim o‘zgarishlar shu faylda qayd etiladi. Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) tamoyillariga amal qiladi; versioned release jarayoni boshlanganida Semantic Versioning qo‘llanadi.

## [Unreleased]

Bu bo‘lim repository source holatini tasvirlaydi; production deployment muvaffaqiyatli bajarilganini tasdiqlamaydi.

### Added

- React/TypeScript learning UI: katalog, yo‘l xaritasi, maqola readeri, lug‘at va shaxsiy o‘qish vositalari.
- Django API: maqolalar, qidiruv, guest/account auth, engagement va ikki bosqichli contribution review modeli.
- 163 canonical o‘zbekcha maqola, deterministik export, checksum va automated readiness pipeline.
- Har bir maqolani qamrab oladigan explicit editorial daraja metadata’si: 58 boshlang‘ich, 67 o‘rta va 38 yuqori.
- Inglizcha termin asosida A–Z ni to‘liq qamragan 174 atamali lug‘at va cheksiz to‘rt variantli mini test.
- Bitta canonical manbadan darhol chiqadigan 28 algoritmik faktli, scroll-lock va reduced-motion holatlari tekshirilgan loading screen.
- Backend, frontend, kontent, deploy kontrakti va production container buildini tekshiradigan CI workflow.
- CI’dan o‘tgan `main` commitini yoki qo‘lda berilgan aniq SHA’ni restricted SSH command orqali chiqarishga mo‘ljallangan deploy workflow.

### Changed

- Guest sessiyasini ayni user va engagement ma’lumotlarini saqlagan holda haqiqiy akkauntga aylantirish oqimi kengaytirildi.
- Legacy maqola URL’lari canonical reader route’lariga moslashtirildi.
- Public maqola UI’sida ichki pending-review warningi olib tashlanib, real `Nashr qilingan` holati va ikkilamchi tahrir actioni ajratildi.
- Katalog metadata’si line iconlar va soft status/daraja chiplari bilan, landing/article bannerlari esa light/dark kontrast bilan yaxshilandi.

### Security

- Deploy workflow host identity’ni supplied `known_hosts` bilan qat’iy tekshiradi va remote tomonga faqat `deploy <40-hex-sha>` buyrug‘ini yuboradi.
- Production Compose topologiyasi application portini loopback bilan cheklashga mo‘ljallangan; real server holati alohida operator tekshiruvini talab qiladi.
