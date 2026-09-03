Bekzod to‘g‘ri metall sterjenlardan bezakli yopiq romlar yasaydigan temirchi. Unda to‘rt xil shakldagi sterjenlar bor va ular quyilish usuli sababli ish stolida istalgan joyga siljitilishi (parallel ko‘chirilishi) mumkin, lekin **burilishi mumkin emas**. Butun koordinatali panjarada bu to‘rt tur quyidagicha:

- $a$ ta uzunligi $1$ bo‘lgan **gorizontal** sterjen ($x$ o‘qiga parallel);

- $b$ ta uzunligi $1$ bo‘lgan **vertikal** sterjen ($y$ o‘qiga parallel);

- $c$ ta uzunligi $\sqrt{2}$ bo‘lgan, musbat $x$ o‘qiga $45^\circ$ burchakdagi **diagonal** sterjen;

- $d$ ta uzunligi $\sqrt{2}$ bo‘lgan, musbat $x$ o‘qiga $135^\circ$ burchakdagi **diagonal** sterjen.

Bekzod **barcha** sterjenlarini uchma-uch payvandlab, burchaklari butun koordinatali nuqtalarda yotadigan bitta yopiq rom yasamoqchi. Rom **sodda ko‘pburchak** bo‘lishi kerak: uning tomonlari kesishmasligi va hatto tegmasligi kerak, faqat ketma-ket sterjenlar umumiy uchida tutashishi mumkin. Ikki ketma-ket sterjen kollinear bo‘lishi mumkin (bunda ular uzunroq bitta to‘g‘ri tomonni hosil qiladi).

Bunday barcha romlar orasida Bekzod yuzasi **mumkin bo‘lgan eng kichik** romni xohlaydi. Berilgan sterjenlar uchun kamida bitta yaroqli rom mavjud deb hisoblashingiz mumkin.

## Vazifa

$a, b, c, d$ sonlari berilgan. Aynan $a$ ta gorizontal, $b$ ta vertikal, $c$ ta diagonal ($45^\circ$) va $d$ ta diagonal ($135^\circ$) sterjendan foydalanadigan, **minimal yuzali** sodda ko‘pburchakni toping.

## Implementatsiya tafsilotlari

Quyidagi prosedurani yozishingiz kerak. Grader uni har bir test uchun bir marta chaqiradi.

```cpp

vector<pair<int,int>> construct(int a, int b, int c, int d)
```

- $a, b, c, d$: to‘rt turdagi sterjenlar soni.

- Prosedura $n = a + b + c + d$ ta panjara nuqtalaridan iborat ro‘yxat qaytarishi kerak — ular ko‘pburchak burchaklari **tartib bo‘yicha** (soat mili bo‘yicha yoki teskari) beriladi.

- Qaytarilgan **birinchi** nuqta $(0, 0)$ bo‘lishi kerak.

- Ketma-ket nuqtalar (oxirgisi va birinchisi ham) aynan bitta sterjen vektori bilan farq qilishi kerak va butun ko‘pburchak bo‘yicha har bir sterjen turi talab qilingan miqdorda ishlatilishi kerak.

- Ko‘pburchak sodda bo‘lishi kerak: tomonlar tegmasligi va kesishmasligi kerak, faqat ketma-ket sterjenlar umumiy uchida tutashadi. Ketma-ket tomonlar kollinear bo‘lishi mumkin.

## Cheklovlar

- $0 \le a, b, c, d \le 100$

- $a + b + c + d \ge 3$

- Berilgan sterjenlar kamida bitta yaroqli rom yasashga imkon beradi.

## Subtasklar

| Subtask | Ball | Qo‘shimcha cheklovlar |
| --- | --- | --- |
| 1 | 5 | $c = d = 0$ |
| 2 | 5 | $a = b = 0$ |
| 3 | 10 | $a + b + c + d \le 6$ |
| 4 | 10 | $a + b + c + d \le 20$ |
| 5 | 10 | $a + b + c + d \le 40$ |
| 6 | 10 | $a + b + c + d \le 80$ |
| 7 | 10 | $a + b + c + d \le 150$ |
| 8 | 10 | $a + b + c + d \le 200$ |
| 9 | 10 | $a + b + c + d \le 300$ |
| 10 | 20 | Qo‘shimcha cheklov yo‘q |

## Baholash

Agar biror test uchun prosedurangiz berilgan sterjenlardan aynan foydalanadigan yaroqli sodda ko‘pburchak qaytarmasa, mos subtask uchun $0$ ball oladi. Agar u yaroqli, lekin minimal yuzali bo‘lmagan ko‘pburchak qaytarsa, quyidagicha qisman ball olishi mumkin.

$j$-test uchun $r_j$ — qaytarilgan ko‘pburchak yuzasining minimal mumkin bo‘lgan yuzaga nisbati bo‘lsin. $k$-subtask uchun $z_k$ — shu subtaskdagi testlar orasidagi $r_j$ qiymatlarining eng kattasi bo‘lsin. $k$-subtask uchun beriladigan ball foizi $P_k = 10$, agar $z_k \ge 3$ bo‘lsa; aks holda

$$
P_k = \frac{25}{8}\,(3 - z_k)^4 + 10 .
$$

Shunday qilib, yaroqli, lekin optimal bo‘lmagan yechim subtask ballining $10\%$ dan $60\%$ gacha qismini oladi; bu uning eng yomon yuza nisbati optimalga qanchalik yaqinligiga bog‘liq. Optimal yechim to‘liq $100\%$ oladi.

## Misol

Quyidagi chaqiriqni ko‘rib chiqing:

```cpp

construct(1, 1, 1, 0)
```

Optimal qaytariladigan qiymatlardan biri $(0,0), (1,1), (0,1)$ burchakli uchburchak bo‘lib, uning yuzasi $\tfrac{1}{2}$:

```cpp

[(0, 0), (1, 1), (0, 1)]
```

`construct(0, 0, 6, 4)` chaqirig‘i uchun optimal qaytariladigan qiymatlardan biri:

```cpp

[(0, 0), (1, 1), (2, 2), (3, 3), (2, 4), (1, 3), (0, 2), (-1, 3), (-2, 2), (-1, 1)]
```

## Namuna grader

Namuna grader inputni quyidagi formatda o‘qiydi:

- $1$-qator: $a\;b\;c\;d$

U `construct(a, b, c, d)` ni chaqiradi va qaytarilgan uchlarni har birini alohida qatorga chiqaradi:

- $1 + i$-qator ($0 \le i < n$, bu yerda $n = a + b + c + d$): $x_i\;y_i$ — qaytarilgan $(i+1)$-uch koordinatalari

## Namunalar

### 1-namuna

**Kirish:**

```text
1 1 1 0
```

**Chiqish:**

```text
1
```

### 2-namuna

**Kirish:**

```text
0 0 6 4
```

**Chiqish:**

```text
16
```
