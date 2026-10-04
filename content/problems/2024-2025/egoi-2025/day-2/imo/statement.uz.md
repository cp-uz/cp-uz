> Ushbu shart EGOI 2025 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Xalqaro matematika olimpiadasi (IMO) har yili maktab o'quvchilari uchun o'tkaziladigan matematika musobaqasidir. IMOning 2025 yilgi nashri EGOI bilan bir vaqtda bo'lib o'tmoqda. Siz buni o'qiyotganingizda, IMOning ikki musobaqa kunlari ham yakunlangan bo'ladi va baholash ham deyarli yakunlangan bo'ladi.

EGOI kabi dasturlash musobaqalaridan farqli o'laroq, bu muobaqada baholash qo'lda amalga oshiriladi, hamda bu uzoq va mashaqqatli jarayon hisoblanadi.

Bu yil IMOchilarga $M$ ta masala ishlash taklif etildi (0 dan $M - 1$ gacha raqamlangan) va har bir masaladan ko'pi bilan $K$ ball to'plash mumkin. Musobaqada jami $N$ nafar ishtirokchilar qatnashmoqda. $i $ -ishtirokchi $ j $ masaladan $a_i$ , $ j $ ball oldi, bu yerda $a_i$ , $ j $ soni 0 va $ K $ o'rtasidagi butun sondir. Ishtirokchilarning reytingi har bir ishtirokchining umumiy balliga qarab belgilanadi, durrang vaqti, ishtirokchilarning indeksiga qaraladi. Boshqa so'zlar bilan aytganda, $ x $ -ishtirokchi natijalar jadvalida $ y$ -ishtirokchildan balandroqda turadi, agar:

- $x $ -ishtirokchining jami to'plagan balli $ y$ -ishtirokchinikidan ko'proq bo'lganidan;

- yoki ularning jami to'plagan ballari o'zaro teng va $x < y$ .

Yakuniy natijalar jadvalini chiqarish uchun tashkilotchilar $a_i$ , $j $ qiymatlarining bir qismini namoyish etishlari kerak. Agar baho qiymat namoyish etilmagan boʻlsa, u 0 va $K$ oʻrtasidagi butun son ekanligi maʼlum bo'ladi xolos.

Tashkilotchilar $a_i$ , $j$ qiymatlarini iloji boricha kamroq miqdorda ochishni xohlashadi. Shu bilan birga, ular har bir kishi yakuniy reytingni to'liq bilishiga ishonch hosil qilishlari kerak. Boshqacha qilib aytganda, ular shunday qiymatlar to'plamini ochib berishlari kerakki, unga mos keladigan yagona natijalar jadvali mavjud bo'lsin.

Shunaqangi eng kichik $S$ ni topingki, bor yo'g'i $S$ ta $a_i$ , $j$ qiymatlarining ko'rsatish orqali natijalar jadvalini noyob tarzda to'liq tiklashning iloji bo'lsin.

## Kirish

Birinchi qatorda uchta butun $N$ , $ M $ va $ K$ sonlari mavjud. Ular mos ravishda musobaqadagi ishtirokchilari soni, masalalar soni va va har masalaning maksimal ballini anglatadi.

Keyingi $N$ ta qatorning har birida $M$ tadan son kiritiladi. Bunda, $i $ -qatorda $a_i$ , $ j $ qiymatlari kiritiladi. Ya'ni, birinchi qatorda $ a $ 0,0, $ a $ 0,1,… , $ a $ 0, $ M - 1$ sonlari, ikkinchi qatorda $ a$ 1,0, $ a $ 1,1,… , $ a $ 1, $ M - 1$ sonlari va h.k. kiritiladi.

## Chiqish

Bitta butun $S$ sonini, yakuniy natijalar jadvalini noyob tarzda tiklay olish uchun ko'rsatish yetarli bo'ladigan minimal baholar sonini ekranga chiqaring.

## Chegaralar va baholash

- $2 \le N \le 20000$.

- $1 \le M \le 100$.

- $1 \le K \le 100$.

- Barcha $i$ , $ j $ juftlik uchun 0 ≤ $a_i$ , $ j \le K $ , bunda $0 \le i \le N - 1$ va $0 \le j \le M - 1$.

Sizning yechimingiz har biri bir necha ballga ega bo'lgan subtasklarda sinovdan o'tkaziladi. Har bir subtask bir nechta testlarni o'z ichiga oladi. Subtaskdan ball olish uchun yechimingiz shu subtaskka tegishli barcha testlarga to'g'ri javob berishi kerak.

|**Subtask**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|10|$N = M = 2$ va $K = 1$|
|2|13|$N = 2$|
|3|10|$N $ ⋅$ M \le 16$|
|4|18|$K = 1$|
|5|21|$N \le 10000$va $ M$,$ K \le 10$|
|6|28|Qo'shimcha cheklovlarsiz|

## Misollar

Birinchi misolda, 20 ta baholar quyidagicha qilib namoyish etilishi mumkin:

|7|7|0|∙|7|∙|
|---|---|---|---|---|---|
|7|3|0|7|2|1|
|∙|0|0|∙|0|0|
|7|7|7|7|7|1|

Bu yerda uchinchi ishtirokchi 0 dan 14 gacha umumiy ballga ega ekanligi ma'lum, bundan kelib chiqqan holda uning natijasi har qanday boshqa ishtirokchining natijasidan pastroq ekanligi aniq. 20 ta bahodan kamroq baholar namoyish etilgandan, natijalar jadvalini noyob usulda tiklashning iloji yo'qligini ko'rsatish mumkin. Misol uchun, agar biz tepadagi jadvaldan uchinchi ishtirokchining biron bir 0 bahosini yashiradigan bo'lsak, bu ishtirokchi umumiy 21 ballgacha to'plashi mumkin bo'ladi. Bu mumkin emas, chunki ikkinchi ishtirokchi umumiy 20 ballga ega, lekin u uchinchi ishtirokchidan yuqoriroq o'rinni egallashi kafolatlanishi kerak.

Birinchi namuna 5 va 6-subtaskdagi cheklovlarini qanoatlantiradi.

Ikkinchi misolda biz faqat birinchi ishtirokchining ballini yoki faqat ikkinchi ishtirokchining ballini ochishimiz mumkin (lekin ikkalasini ham emas). Agar biz faqat birinchi ishtirokchining ballini namoyish qilsak, birinchi ishtirokchining umumiy balli 1 ekanligini bilamiz. Bundan kelib chiqqan holda, agar ikkinchi ishtirokchi ham 1 ball oladigan bo'lsa ham, birinchi ishtirokchi yuqoriroq o'rinni egallaydi, chunki uning indeksi pastroq. Xuddi shunday qilib, agar biz faqat ikkinchi ishtirokchining ballini oshkor qilsak, biz uning nol ball to'plaganini bilamiz. Demak, birinchi ishtirokchi necha ball to'plashidan qat'iy nazar, u yuqoriroq o'rinni egallaydi.

Ikkinchi namuna 2 , 3 , 4 , 5 va 6-subtaskdagi cheklovlarini qanoatlantiradi.

Uchinchi namuna 2 , 3 , 5 va 6-subtaskdagi cheklovlarini qanoatlantiradi.

To'rtinchi namuna barcha subtasklardagi cheklovlarini qanoatlantiradi.

_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
4 6 7
7 7 0 2 7 0
7 3 0 7 2 1
7 0 0 7 0 0
7 7 7 7 7 1
```

**Chiquvchi ma’lumotlar**

```text
20
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
2 1 1
1
0
```

**Chiquvchi ma’lumotlar**

```text
1
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
2 2 7
7 4
7 0
```

**Chiquvchi ma’lumotlar**

```text
2
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
2 2 1
0 1
1 0
```

**Chiquvchi ma’lumotlar**

```text
2
```

---

Manba: [EGOI 2025 rasmiy masalalar arxivi](https://github.com/egoi-org/egoi-2025/tree/e3bb2be66c3a837c57c7f8eac3b5173f40129e13). [Litsenziya: CC BY-SA](https://github.com/egoi-org/egoi-2025/blob/e3bb2be66c3a837c57c7f8eac3b5173f40129e13/day2/imo/problem.yaml).
