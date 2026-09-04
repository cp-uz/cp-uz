# Frontend arxitekturasi

Frontend uchta yuqori qatlamga bo‘linadi:

```text
src/
  app/       # dastur kompozitsiyasi: router, layout, provider, tema, config va global uslublar
  modules/   # mahsulot imkoniyatlari va ularning biznes chegaralari
  shared/    # bir nechta modul ishlatadigan, domen bilmaydigan primitivlar
```

## Modul qoidasi

Murakkab modulda oqim bir yo‘nalishda yuradi:

`ui -> application -> domain contract -> data-access repository -> API`

- `domain` — React va tarmoqdan mustaqil turlar, contractlar va sof funksiyalar.
- `data-access` — HTTP, API DTOlari, mapperlar va repository implementatsiyasi.
- `application` — UI ishlatadigan use-case va hooklar. U DTO tafsilotlarini bilmaydi.
- `ui` — sahifa va komponentlar. Sahifa asosan kompozitsiya qiladi; to‘g‘ridan-to‘g‘ri `fetch` chaqirmaydi.

Har bir modul `application`, `domain` va ataylab tanlangan kichik public entrypointlar orqali tashqi API beradi. Router `pages/<page>.ts` entrypointlarini alohida lazy import qiladi. `markdown`, `article-card`, `sync-status`, `guest-upgrade-dialog` va `preview` qayta ishlatiladigan imkoniyatlar uchun aniq chegaralardir. Modul ichidagi komponent page yonida qoladi; bir necha sahifada kerak bo‘lsa `ui/shared`ga ko‘chadi. Biznes ma’nosiga ega bo‘lmagan primitivlargina global `shared`ga chiqadi.

## Modullar

- `learning` — maqola katalogi, maqola detaili, yo‘l xaritasi va lug‘at.
- `auth` — foydalanuvchi/mehmon sessiyasi va kirish oqimi.
- `engagement` — bookmark, o‘qish progressi, qayd va profil statistikasi.
- `landing` — bosh sahifa kompozitsiyasi; learning modulining public application APIidan foydalanadi.
- `problems` — masalalar katalogi, detail va kech yuklanadigan PDF renderer.
- `seasons` — mavsum, bosqich, natija va ishtirokchi ko‘rinishlari.

## App chegarasi

`app` providerlarni ulaydi, route va layoutlarni yig‘adi, tema/global uslub/config ni beradi. Route konfiguratsiyasi sahifalarni alohida entrypointdan import qiladi; katalog ochilganda Markdown va PDF kodi yuklanmaydi.

## Importlar

Aliaslar yuqori qatlamlarni ko‘rsatadi: `app/*`, `modules/*`, `shared/*`. Deep import faqat ayni modul ichida ishlatiladi. `eslint-architecture.mjs` alias, relative va dynamic importlarda qatlam chegaralarini tekshiradi: shared mahsulot modullarini bilmaydi, modul appga qaram emas, domain React/HTTP’dan mustaqil, UI HTTP’ni data-access orqali chaqiradi.

## API va sessiya

`shared/api/http` JSON xatolari, public GET cache va cache invalidation primitivlarini beradi. Auth moduli bitta parallel refresh, sessiya avlodi, AbortSignal va foydalanuvchi identifikatori orqali kech javoblarning boshqa sessiyaga o‘tishini to‘sadi. Har mutation oldidan va tugagach private cache bekor qilinadi. Engagement va quiz navbatlari foydalanuvchi IDsi bilan saqlanadi; yangi loginning vaqtinchalik sessionKey qiymati eski callbacklarni ajratadi.

`npm run api:generate` Django OpenAPI sxemasidan `shared/api/generated/schema.d.ts` yaratadi. `npm run api:check` CI’da farq bo‘lsa yiqiladi. Backend `.venv` avtomatik topiladi; boshqa Python uchun `CPUZ_PYTHON` qo‘llanadi. Mapperlar generated DTOlarni domen obyektlariga aylantiradi; buzilgan muvaffaqiyatli javob bo‘sh obyektga yashirilmaydi.

## Test va build

`npm test` sof funksiyalar, haqiqiy React/store lifecycle ssenariylari va Markdown korpusini tekshiradi. `npm run test:bundle` build manifestdagi static import grafiga qarab kataloglarga renderer kirib qolishini va boshlang‘ich JS hajmining oshishini to‘sadi. PDF sahifalari viewport yaqinida render qilinadi, text layer va havolalar alohida DOMda; to‘liq Markdown matni muqobil ko‘rinishdir.

## Yangi feature uchun tekshiruv

1. Biznes modeli va repository contracti `domain`da joylashganmi?
2. HTTP va DTO mapping faqat `data-access`dami?
3. UI repository/use-case orqali ishlayaptimi?
4. `Page.tsx` render va orchestration bilan cheklanganmi?
5. Yangi global helper haqiqatan bir nechta modulga kerakmi?
6. `npm run lint`, `npm run api:check`, `npm test`, `npm run build`, `npm run test:pwa` va `npm run test:bundle` o‘tyaptimi?
