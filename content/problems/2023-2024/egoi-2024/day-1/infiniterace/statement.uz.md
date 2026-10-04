> Ushbu shart EGOI 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Eindhoven shahrida har yili marafon bo'lib o'tadi. Bu yili esa tashkilotchilar ajoyib narsa o'ylab topishdi: marafon uzunligi 42 kilometr bo'lish o'rniga cheksiz davom etadi! Qoidalarni oson qilish uchun, poyga Eindhoven universitetining yugurish yo'lagida bo'lib o'tadi, ishtirokchilar esa yo'lak bo'ylab cheksiz ko'p marta aylanishadi.

Poygada $N$ ta ishtirokchi bor va ular 0 dan $N - 1$ gacha raqamlangan. Anika poyga uchun hammadan oldin ro'yxatdan o'tgan, shuning uchun uning tartib raqami 0. Ya'ni u shundoqqina finish chizig'idan so'ng poygani boshlaydi, boshqa barcha ishtirokchilar esa poygani undan oldinroqda boshlaydi. Anika nechta aylana yugurganini sanamaydi, lekin u kimnidir quvlab o'tsa yoki kimdir uni quvlab o'tsa barchasini eslab qoladi. Anika eng kamida necha marta finish chizig'ini kesib o'tgan? Hech kim teskari yugurmaydi, hamda hech qanday quvib o'tishlar finish chizig'i ustida sodir bo'lmaydi. E'tibor bering, ishtirokchilar har doim ham bir xil tezlikda yugurmasligi mumkin.

## Kiruvchi ma'lumotlar

Birinchi qatorda $N$ butun son beriladi, ishtirokchilar soni.

Ikkinchi qatorda $Q$ butun son, jami voqealar soni.

Keyingi $Q$ ta qatorda barcha voqealar sodir bo'lish tartibida beriladi. Bunda $i$ -qatorda $x_i$ butun son kiritiladi.

- Agar $x_i$ > 0 bo'lsa, Anika $x_i$ -raqamli ishtirokchini quvib o'tgan. Agar $x_i$ < 0 bo'lsa, (− $x_i$ )-raqamli ishtirokchi Anikani quvib o'tgan.

## Chiquvchi ma'lumotlar

Bitta butun son chiqaring: Anika finish chizig'ini kamida necha marta kesib o'tgani.

## Cheklovlar va baholash

- $2 \le N \le 200000$.

- $1 \le Q \le 200000$.

- 1 ≤ $x_i$ ≤ $N - 1$ yoki −( $N - 1$) ≤ $x_i$ ≤−1.

Yechimingiz bir-nechta test guruhlarida tekshiriladi. Har bir test guruhi uchun qanchadir ball beriladi. Barcha test guruhlarida bir-nechta testlar bor. Test guruhining ballini olish uchun yechimingiz ushbu guruhdagi barcha testlarda to'g'ri ishlashi kerak.

|**Guruh**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|29|$N = 2$|
|2|34|$x > 0$, barcha $ i$uchun (ya'ni, Anika faqat quvib o'tadi)<br>$ i$|
|3|22|$N $,$ Q \le 100$|
|4|15|Qo'shimcha cheklovlarsiz|

## Namunalar

E'tibor bering, ba'zi namunalar barcha test guruhlariga mos tushmaydi.

Birinchi misolda, poygada $N = 4$ ta ishtirokchi bor va $Q = 5$ ta voqea bo'lib o'tadi. Avval 2- ishtirokchi Anikani quvlab o'tadi, va u endi Anikadan to'liq aylana oldinda. Keyin esa Anika 2- ishtirokchini quvlab o'tadi. So'ngra Anika 1-ishtirokchini quvlab o'tadi va 3-ishtirokchidan qolib ketadi. Bu vaqtda Anika hali ham o'zining birinchi aylanasida bo'lishi mumkin. Yakunda Anika 2- ishtirokchini yana bir marta quvlab o'tadi, bu esa Anika finish chizig'ini kamida bir marta kesib o'tganini bildiradi.

Ikkinchi misolda, Anikadan tashqari bittagina ishtirokchi bor. Anika uni 4 marta quvlab o'tadi, demak Anika finish chizig'ini kamida uch marta kesib o'tgan.

_Diagramma rasmiy PDFda keltirilgan._

_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
4
5
-2
2
1
-3
2
```

**Chiquvchi ma’lumotlar**

```text
1
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
2
4
1
1
1
1
```

**Chiquvchi ma’lumotlar**

```text
3
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
2
5
1
-1
1
-1
-1
```

**Chiquvchi ma’lumotlar**

```text
0
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
200000
7
199999
199999
1
199999
55
199999
55
```

**Chiquvchi ma’lumotlar**

```text
3
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
3
6
1
2
2
2
1
1
```

**Chiquvchi ma’lumotlar**

```text
3
```

---

Manba: [EGOI 2024 rasmiy masalalar arxivi](https://github.com/zehnsechs/egoi-2024-testdata/tree/47fefa0ff64124f7fd8421aa12b77ad689a0fb29). [Litsenziya: CC BY-SA](https://github.com/zehnsechs/egoi-2024-testdata/blob/47fefa0ff64124f7fd8421aa12b77ad689a0fb29/day1/infiniterace2/problem.yaml).
