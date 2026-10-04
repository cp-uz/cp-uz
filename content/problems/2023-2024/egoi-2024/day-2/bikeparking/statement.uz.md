> Ushbu shart EGOI 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Sanne yaqinda ajoyib biznes g'oya o'ylab topdi: Eindhoven vokzalida premium velosiped turargohini (parkovkani) ijaraga berish. O'zining daromadini oshirish uchun, u turargohlarni $N$ ta turli guruhlarga ajratib chiqdi, ular 0 dan $N - 1$ gacha raqamlangan. 0-guruhdagi turargoh vokzalga juda ham yaqin bo'lgani uchun ular premium turargoh hisoblanadi. Guruh raqamining o'sib borishi turargohning yomonlashib borishini bildiradi. $t$ -guruhdagi turargohda _xt_ ta velosiped qo'yish joylari bor.

Foydalanuvchilar velosipedlarini telefon dasturi orqali parkovka qilishadi. Har bir foydalanuvchining o'z obuna darajasi bor va ular obuna darajalariga mos keluvchi guruhdan joy berilishini xohlaydi. Ammo, xizmat ko'rsatish shartnomasida foydalanuvchilarga o'z darajasiga mos guruhdagi joyni ijaraga olishi kafolatlanmagan.

Agar $s$ -darajali foydalanuvchiga $ t$ -guruhdagi to'xtash joyi berilsa, quyidagi uchta holatdan biri sodir bo'ladi:

1. Agar $t < s$ bo'lsa, foydalanuvchi xursand bo'ladi va dasturga yaxshi izoh qoldiradi.

2. Agar $t = s$ bo'lsa, foydalanuvchi uchun bu qoniqarli bo'ladi va hech qanday izoh qoldirmaydi.

3. Agar $t > s$ bo'lsa, foydalanuvchi xafa bo'ladi va dasturga yomon izoh qoldiradi.

Hozirgi kunda, Sannening dasturida $y$ 0 + $ y $ 1 + ... + _yN_ −1 ta foydalanuvchi bor, bu yerda _ys_ deb obunasi bo'yicha $ s$ -darajadagi foydalanuvchilar soniga aytiladi. Siz Sannega to'xtash joylarini ajratishga yordam berishingiz kerak. Har bir foydalanuvchi aynan bitta to'xtash joyini olishi kerak. Hech qaysi to'xtash joyini bittadan ko'p odamga berish mumkin emas, lekin ba'zi to'xtash joylaridan hech kim foydalanmasligi ham mumkin. Shuningdek, jami foydalanuvchilar soni jami to'xtash joylari sonidan ko'p emas.

Sanne dasturining reytingini oshirmoqchi. Aytaylik, qoldirilgan yaxshi izohlar soni $U$ , yomon izohlar soni $ D$ bo'lsin. Sizning vazifangiz $ U$ − $ D$ ning qiymatini maksimallashtirish.

## Kiruvchi ma'lumotlar

Birinchi qatorda $N$ kiritiladi, guruh yoki darajalar soni.

Ikkinchi qatorda $N$ ta butun son kiritiladi $x$ 0, $ x$ 1,..., _xN_ −1, har bir guruhdagi to'xtash joylari soni.

Uchinchi qatorda $N$ ta butun son kiritiladi $y$ 0, $ y$ 1,..., _yN_ −1, har bir obuna darajasidagi foydalanuvchilar soni.

## Chiquvchi ma'lumotlar

Bitta butun son chiqaring, to'xtash joylari optimal ajratilganida $U$ − $ D$ ning maksimal qiymati.

## Cheklovlar va baholash

- $1\le N\le3\cdot10^5$.

- $0\le x_i,y_i\le10^9$ barcha $0\le i<N$ uchun.

- $\sum_{i=0}^{N-1}y_i\le\sum_{i=0}^{N-1}x_i\le10^9$.

Yechimingiz bir-nechta test guruhlarida tekshiriladi. Har bir test guruhi uchun qanchadir ball beriladi. Barcha test guruhlarida bir-nechta testlar bor. Test guruhining ballini olish uchun yechimingiz ushbu guruhdagi barcha testlarda to'g'ri ishlashi kerak.

|**Guruh**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|16|$N = 2$,$ x \le 100$,$ y \le 100$<br>$ i $<br>$ i$|
|2|9|$x = x = y = y $ barcha$i $,$ j $uchun. Boshqacha qilib aytganda$ x $va$ y $larning<br>barcha qiymatlari bir xil.<br>$ i $<br>$ j $<br>$ i $<br>$ j$|
|3|19|$x $,$ y \le 1$<br>$ i $<br>$ i$|
|4|24|$N $,$ x $,$ y \le 100$<br>$ i $<br>$ i$|
|5|32|Qo'shimcha cheklovlarsiz.|

## Namunalar

E'tibor bering, ba'zi namunalar barcha test guruhlariga mos tushmaydi. $i $ -namuna $ i$ -test guruhiga mos tushadi.

Birinchi misolda, Siz 0-darajadagi foydalanuvchiga 0-guruhdan to'xtash joyini berishingiz, ikkita 1- darajadagi foydalanuvchilarga 0-guruhdan to'xtash joyini berishingiz (natijada 2ta yaxshi izoh olasiz), va qolgan bitta 1-darajali foydalanuvchiga 1-guruhdan to'xtash joyini berishingiz mumkin. Shunda reyting 2 ga teng bo'ladi.

Ikkinchi misolda, Siz 1-daraja foydalanuvchiga 0-guruhdan to'xtash joyini berishingiz, 2-daraja foydalanuvchiga 1-guruhdan to'xtash joyini berishingiz, va 0-daraja foydalanuvchiga esa 2-

guruhdan to'xtash joyini berishingiz mumkin. Natijada Siz 2ta yaxshi va 1ta yomon izoh olasiz va reyting 1ga teng bo'ladi.

Uchinchi misolda, Siz 1-daraja foydalanuvchiga 0-guruhdan to'xtash joyi, 0-daraja foydalanuvchiga 2-guruhdan to'xtash joyi, va 4-daraja foydalanuvchiga 3-guruhdan to'xtash joyi berishingiz mumkin. Bu misolda ham 2ta yaxshi va 1ta yomon izoh olasiz va reyting 1ga teng bo'ladi.

To'rtinchi misol rasmda ko'rsatilgan. Siz 1-daraja foydalanuvchilariga 0-, 0-, 3- va 3-guruhdan to'xtash joylarini berib, 2ta yaxshi va 2ta yomon izohlar olasiz. Keyin, 2-daraja foydalanuvchilariga 1-, 2-, 3- and 3-guruhdan to'xtash joylarini berib, 1ta yaxshi va 2ta yomon izoh olasiz. Natijada jami 3ta yaxshi izoh, 4ta yomon izoh bilan −1 reyting olasiz. Rasmda "Tier" – to'xtash joyining guruhini, "Level" foydalanuvchi darajasini bildiradi.

Beshinchi misolda, barchaga o'zining darajasidagi to'xtash joylarini berishingiz mumkin. Reyting 0 ga teng bo'ladi.

_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
2
3 3
1 3
```

**Chiquvchi ma’lumotlar**

```text
2
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
3
1 1 1
1 1 1
```

**Chiquvchi ma’lumotlar**

```text
1
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
6
1 0 1 1 0 1
1 1 0 0 1 0
```

**Chiquvchi ma’lumotlar**

```text
1
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
4
2 1 1 8
0 4 4 0
```

**Chiquvchi ma’lumotlar**

```text
-1
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
1
1000000000
1000000000
```

**Chiquvchi ma’lumotlar**

```text
0
```

---

Manba: [EGOI 2024 rasmiy masalalar arxivi](https://github.com/zehnsechs/egoi-2024-testdata/tree/47fefa0ff64124f7fd8421aa12b77ad689a0fb29). [Litsenziya: CC BY-SA](https://github.com/zehnsechs/egoi-2024-testdata/blob/47fefa0ff64124f7fd8421aa12b77ad689a0fb29/day2/bikeparking/problem.yaml).
