---
article_id: graph--flow_with_demands
---
# Talabli oqimlar

Oddiy oqim tarmog‘ida qirra oqimi yuqoridan faqat $c(e)$ sig‘im, pastdan esa $0$ bilan chegaralanadi.
Bu maqolada har bir qirradagi oqimdan ma’lum miqdorda oqim o‘tishini qo‘shimcha ravishda talab qiladigan, ya’ni oqimni pastdan **talab** funksiyasi $d(e)$ bilan chegaralaydigan oqim tarmoqlarini ko‘rib chiqamiz:

$$ d(e) \le f(e) \le c(e)$$

Demak, endi har bir qirra bo‘ylab o‘tkazishimiz shart bo‘lgan minimal oqim qiymati mavjud.
Bu oddiy oqim masalasining umumlashmasidir, chunki barcha $e$ qirralar uchun $d(e) = 0$ deb olish oddiy oqim tarmog‘ini beradi.
Oddiy oqim tarmog‘ida yaroqli oqim topish nihoyatda oson: $f(e) = 0$ deb olishning o‘zi yaroqli oqimdir.
Ammo har bir qirradagi oqim talabni qanoatlantirishi kerak bo‘lsa, yaroqli oqim topishning o‘zi birdaniga ancha murakkablashadi.

Biz ikkita masalani ko‘rib chiqamiz:

1. barcha cheklovlarni qanoatlantiradigan ixtiyoriy oqimni topish;
2. barcha cheklovlarni qanoatlantiradigan minimal oqimni topish.

## Ixtiyoriy oqimni topish

Tarmoqqa quyidagi o‘zgartirishlarni kiritamiz.
Yangi $s'$ manba va yangi $t'$ qabul qiluvchi, $s'$ manbadan boshqa har bir tugunga yangi qirra, har bir tugundan $t'$ qabul qiluvchiga yangi qirra va $t$ dan $s$ ga bitta qirra qo‘shamiz.
Bundan tashqari, yangi $c'$ sig‘im funksiyasini quyidagicha aniqlaymiz:

- har bir $(s', v)$ qirra uchun $c'((s', v)) = \sum_{u \in V} d((u, v))$;
- har bir $(v, t')$ qirra uchun $c'((v, t')) = \sum_{w \in V} d((v, w))$;
- eski tarmoqdagi har bir $(u, v)$ qirra uchun $c'((u, v)) = c((u, v)) - d((u, v))$;
- $c'((t, s)) = \infty$.

Agar yangi tarmoqda to‘yintiruvchi oqim — $s'$ dan chiquvchi har bir qirra to‘liq to‘ldiriladigan oqim; bu $t'$ ga kiruvchi har bir qirra to‘liq to‘ldirilishiga teng kuchli — mavjud bo‘lsa, talablar qo‘yilgan tarmoqda yaroqli oqim mavjud va haqiqiy oqimni yangi tarmoqdan oson tiklash mumkin.
Aks holda barcha shartlarni qanoatlantiradigan oqim mavjud emas.
To‘yintiruvchi oqim maksimal oqim bo‘lishi kerakligi sababli uni [Edmonds–Karp algoritmi](edmonds_karp.md) yoki [push–relabel algoritmi](push-relabel.md) kabi istalgan maksimal oqim algoritmi bilan topish mumkin.
Bu o‘zgartirishlarning to‘g‘riligini tushunish biroz qiyinroq.
Uni quyidagicha tasavvur qilish mumkin:
$d(e) > 0$ bo‘lgan har bir $e = (u, v)$ qirra dastlab ikkita qirraga almashtiriladi: biri $d(e)$ sig‘imli, ikkinchisi $c(e) - d(e)$ sig‘imli.
Birinchi qirrani to‘yintiradigan oqim topmoqchimiz, ya’ni bu qirradagi oqim uning sig‘imiga teng bo‘lishi shart.
Ikkinchi qirra unchalik muhim emas: undagi oqim sig‘imidan oshmasa, istalgan qiymatga ega bo‘lishi mumkin.
To‘yintirilishi shart bo‘lgan har bir qirrani ko‘rib, quyidagi amalni bajaramiz:
yangi $s'$ manbadan uning oxiri $v$ ga qirra chizamiz, uning boshi $u$ dan yangi $t'$ qabul qiluvchiga qirra chizamiz, qirraning o‘zini olib tashlaymiz va eski $t$ qabul qiluvchidan eski $s$ manbaga cheksiz sig‘imli qirra chizamiz.
Bu amallar orqali qirra to‘yintirilganini simulyatsiya qilamiz: $v$ dan qo‘shimcha $d(e)$ oqim chiqadi (buni $v$ ga kerakli miqdorda oqim beradigan yangi manba bilan simulyatsiya qilamiz), $u$ ham qo‘shimcha $d(e)$ oqim yuboradi (ammo eski qirra bo‘ylab emas, bu oqim to‘g‘ridan-to‘g‘ri yangi $t'$ qabul qiluvchiga boradi).
Dastlab $s - \dots - u - v - \dots - t$ yo‘l bo‘ylab oqadigan $d(e)$ qiymatli oqim endi $s' - v - \dots - t - s - \dots - u - t'$ yangi yo‘ldan borishi mumkin.
Yangi tarmoq ta’rifida faqat bitta soddalashtirish bor: agar jarayon bir xil tugunlar jufti orasida bir nechta qirra hosil qilsa, ular sig‘imlari yig‘indisiga ega bitta qirraga birlashtiriladi.

## Minimal oqim

Sig‘imi $\infty$ bo‘lgan $(t, s)$ qirra (eski qabul qiluvchidan eski manbaga) bo‘ylab mos eski tarmoqning butun oqimi o‘tishini qayd eting.
Ya’ni bu qirraning sig‘imi eski tarmoq oqimining qiymatiga ta’sir qiladi.
Bu qirraga yetarlicha katta sig‘im, ya’ni $\infty$ berish orqali eski tarmoq oqimini cheklamaymiz.
Bu qirrani kichikroq sig‘imlar bilan cheklasak, oqim qiymati kamayadi.
Ammo uni juda kichik qiymat bilan cheklasak, tarmoqda to‘yintiruvchi yechim bo‘lmaydi, ya’ni asl tarmoqdagi mos yechim qirralar talabini qanoatlantirmaydi.
Ravshanki, barcha cheklovlar hali ham qanoatlantiriladigan eng kichik qiymatni topish uchun bu yerda binary search ishlatish mumkin.
Bu asl tarmoqning minimal oqimini beradi.

