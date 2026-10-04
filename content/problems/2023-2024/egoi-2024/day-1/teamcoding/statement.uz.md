> Ushbu shart EGOI 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Eindhoven Gigantic Open-Source nomli institut juda ierarxik tuzilgan. Tashkilotda $N - 1$ xodim bo'lib, bosh direktor Annekedan boshqa har bir xodimning hisobot berishi kerak bo'lgan o'zining yagona boshlig'i bor, va ushbu ierarxiyada sikllar mavjud emas. Bu tashkilot tuzilishini ildizli daraxt sifatida tasvirlash mumkin, va uning ildiz uchida Anneke turadi. Tashkilotda xilma-xillik bo'lgani bois, xodimlar $K$ ta turdagi dasturlash tillarida kod yozadi, lekin har bir xodimda o'zining ma'qul ko'radigan bitta dasturlash tili bor.

Annekega jamoa uchun yangi katta loyiha kelib tushdi. Anneke bu loyihaga iloji boricha ko'proq resurs jalb etishni xohlaydi. Loyiha bo'yicha kimlar ish olib borishini aniqlash uchun Anneke quyidagi ishlarni bajaradi:

1. Jamoani yetakchisini aniqlash. Yetakchi ushbu loyiha qaysi dasturlash tilida bajarilishini ham belgilab beradi. Loyiha yetakchisining qismdaraxtida joylashgan hamda tanlangan dasturlash tilida kod yozuvchi har bir xodim loyihaga biriktiriladi.

2. Jamoa yetakchisi tomonidan tanlangan dasturlash tilida ishlovchi xodimlarni jamoaga jalb qilish orqali loyihaga biriktirilgan xodimlar sonini oshirish.

Loyiha ustida ishlovchi xodimlar sonini maksimal darajada ko'paytirish uchun, u quyidagi o'zgartirishlarni istalgan miqdorda amalga oshirishi mumkin:

1. U ikkita xodim tanlaydi:

   - Hozirda loyiha yetakchisining qismdaraxtidagi, lekin yetakchi ma'qul ko'radigan dasturlash tilida kod yozmaydigan bir xodim.

   - Ayni damda loyiha yetakchisiga bo'ysunmaydigan, lekin yetakchi ma'qul ko'radigan dasturlash tilida kod yozadigna bir xodim. Bundan tashqari, ushbu xodim tanlangan boshqa xodim bilan bir xil lavozimda bo'lishi kerak; ya'ni Annekega hisob berish zanjirida ular bo'ysunadigan boshliqlar soni bir xil

miqdorda bo'lishi kerak. Agar tashkilotni daraxt misolida tasavvur qilsak, u holda ikki xodim daraxtning bir xil balandligida bo'lishi kerak.

2. Bu xodimlar (aynan shu xodimlar - boshqalar emas) tashkilotdagi o'rinlarini almashadi. E'tibor bering, o'zgartirilgan xodimlarga hisob beruvchi xodimlar o'z joyida qoladi, ularda faqat ularni boshqaruvchi shaxslar o'zgaradi. Quyidagi misolda, 4-raqamli xodim loyiha yetakchisi deb belgilangan taqdirda, biz 3- va 2-raqamli xodimlarni o'zgartiramiz, 1- va 8-raqamlilarni emas.

Yangi loyiha ustida ish olib borishi mumkin bo'lgan xodimlarning eng ko'p miqdorini, shuningdek, ushbu miqdorga erishish uchun zarur bo'lgan o'zgarishlarning eng kam miqdorini aniqlang.

## Kiruvchi Ma'lumotlar

Birinchi qatorida ikkita butun son berilgan: $N $ va $K$ - EGOI tashkilotidagi xodimlar soni hamda xodimlar ishlatishi mumkin bo'lgan dasturlash tillari soni.

EGOI tashkilotidagi xodimlar 0 dan boshlab $N - 1$ gacha raqamlangan, Anneke, tashkilot bosh direktori, 0 raqami bilan belgilangan. Keyingi qatorda $N$ ta butun son ℓ $i $ with 0 ≤ℓ< _i K_ berilgan. Bunda $K$ xodimlar maq'ul ko'radigan dasturlash tillari soni.

Keyingi $N - 1$ ta qator kompaniya tuzilishini ko'rsatadi. $i $ -qatorda $b_i$ butun soni berilgan, bunda 0 ≤ $b_i$ < $ N $ bu $ i $ -xodimning to'g'ridan-to'g'ri bo'ysunuvchi rahbari. E'tibor bering, $ i $ faqat 1 dan $ N - 1$ gacha bo'lishi mumkin, chunki Annekening boshlig'i yo'q.

## Chiquvchi ma'lumotlar

Ikkita butun sondan iborat bitta qator chiqaring, bunda: $P $ va $S$ - loyiha ustida ish olib boruvchi xodimlarning eng ko'p miqdori (loyiha yetakchisini qo'shgan holda) va bunga erishish uchun lozim bo'lgan o'zgarishlarning _eng kam_ miqdori.

## Cheklovlar va baholash

- $1\le N\le10^5$ va $1\le K\le N$.

Yechimingiz bir necha test guruhida tekshiriladi. Har bir test guruhi uchun bir necha ball belgilangan. Barcha test guruhlarida bir necha test bor. Test guruhi uchun ball olish uchun Siz ushbu guruhdagi barcha testlarga yechim berishingiz kerak.

|**Guruh**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|12|$i $-xodimning to'g'ridan-to'g'ri boshlig'i$ i - 1$, barcha1 ≤$ i < N$uchun|
|2|19|$K \le 2$|
|3|27|Har bir dasturlash tilida uni ma'qul ko'radigan ko'pi bilan 10 nafar xodim<br>mavjud|
|4|23|$N \le 2000$|
|5|19|Qo'shimcha cheklovlarsiz|

## Namunalar

Birinchi ikki misolda tashkilot tuzilmasi quyidagicha ko'rinishga ega (bunda sxema dasturlash tilini ko'rsatadi: (0 = “yo'l-yo'l”, 1 = “nuqtali”, 2 = “oddiy”):

1-misolda, 1-raqamli xodimni loyiha yetakchisi deb belgilash mumkin. Bunda 4-raqamli xodim yetakchi bilan bir xil dasturlash tilini ma'qul ko'radi va buni yaxshilashning iloji yo'q. 2-misolda, butun tashkilotda Anneke yoqtiradigan 0-dasturlash tilini ma'qul ko'ruvchi 3 nafar xodim mavjud. Bu Annekeni loyiha rahbari sifatida tayinlash 3 kishidan iborat jamoa shakllantirish degani – bunda hech qanday o'zgarishlar talab etilmaydi.

3-misolda 4-raqamli xodimni loyiha yetakchisi sifatida belgilanadi hamda 1 & 8 va 2 & 3 raqamli xodimlar o'z joyini o'zgartirishi kerak bo'ladi - bu bizga jami 4-raqamli xodim ma'qul ko'ruvchi dasturlash tilida ishlaydigan 4 nafar xodimni beradi. 4-raqamli xodim ma'qul ko'ruvchi dasturlash tili - 2-dasturlash tili (oddiy). 4-misolda 6-raqamli xodimni loyiha rahbari sifatida tayinlash hamda 4 & 7 va 1 & 5 raqamli xodimlar o'rnini almashtirish eng yaxshi natija beradi. E'tibor bering, 4 nafar

xodimni yig'ish uchun loyiha rahbari tayinlanmagunga qadar 6 & 3 raqamli xodimlar o'rnini almashtira olmaymiz, chunki avval loyiha rahbari masalasini hal qilish kerak.

_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
5 3
0 1 2 2 1
0
1
2
3
```

**Chiquvchi ma’lumotlar**

```text
2 0
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
4 2
0 1 0 0
0
0
1
```

**Chiquvchi ma’lumotlar**

```text
3 0
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
9 3
0 0 2 1 2 0 2 1 2
4
8
1
0
4
1
0
7
```

**Chiquvchi ma’lumotlar**

```text
4 2
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
8 3
0 2 1 2 2 1 1 1
6
3
0
6
3
0
3
```

**Chiquvchi ma’lumotlar**

```text
3 2
```

---

Manba: [EGOI 2024 rasmiy masalalar arxivi](https://github.com/zehnsechs/egoi-2024-testdata/tree/47fefa0ff64124f7fd8421aa12b77ad689a0fb29). [Litsenziya: CC BY-SA](https://github.com/zehnsechs/egoi-2024-testdata/blob/47fefa0ff64124f7fd8421aa12b77ad689a0fb29/day1/teamcoding/problem.yaml).
