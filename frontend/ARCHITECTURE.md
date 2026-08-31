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

Har bir modul faqat kichik va ataylab tanlangan `index.ts` barrel orqali tashqi API beradi. Modul ichida hali qayta ishlatilmaydigan komponent page yonida qoladi; 2+ sahifada kerak bo‘lsa `ui/shared`ga ko‘chadi. Bir nechta modul ishlatadigan, biznes ma’nosiga ega bo‘lmagan kodgina global `shared`ga chiqadi.

## Modullar

- `learning` — maqola katalogi, maqola detaili, yo‘l xaritasi va lug‘at.
- `auth` — foydalanuvchi/mehmon sessiyasi va kirish oqimi.
- `engagement` — bookmark, o‘qish progressi, qayd va profil statistikasi.
- `landing` — bosh sahifa kompozitsiyasi; learning modulining public application APIidan foydalanadi.

## App chegarasi

`app` biznes logikasini saqlamaydi. U faqat providerlarni ulaydi, route va layoutlarni yig‘adi, tema/global uslub/config ni beradi. Route konfiguratsiyasi modul sahifalarini modul barrelidan import qiladi.

## Importlar

Aliaslar yuqori qatlamlarni ko‘rsatadi: `app/*`, `modules/*`, `shared/*`. Eski `src/cp/*` compatibility importlari qaytarilmaydi. Deep import faqat ayni modul ichida ishlatiladi; tashqaridan modulning public barrel APIi ishlatiladi.

## Yangi feature uchun tekshiruv

1. Biznes modeli va repository contracti `domain`da joylashganmi?
2. HTTP va DTO mapping faqat `data-access`dami?
3. UI repository/use-case orqali ishlayaptimi?
4. `Page.tsx` render va orchestration bilan cheklanganmi?
5. Yangi global helper haqiqatan bir nechta modulga kerakmi?
6. `npm run lint`, `npm run build` va `npm run test:markdown` o‘tyaptimi?
