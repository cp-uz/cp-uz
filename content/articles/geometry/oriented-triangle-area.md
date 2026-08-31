---
article_id: geometry--oriented-triangle-area
---
# Uchburchakning yo‘nalgan yuzi

Uchta $p_1$, $p_2$ va $p_3$ nuqta berilgan. Ular hosil qilgan uchburchakning yo‘nalgan, ya’ni ishorali yuzini hisoblash kerak.

Ishora quyidagicha aniqlanadi. Tasavvur qiling, $p_1$ nuqtada turibsiz va $p_2$ tomon qarab turibsiz. $p_1$ dan $p_2$ ga yurganingizda $p_3$ o‘ng tomoningizda qolsa, uch nuqta soat mili bo‘yicha burilish hosil qiladi va yo‘nalgan yuza manfiy bo‘ladi. $p_3$ chap tomonda bo‘lsa, burilish soat miliga teskari va yuza musbat. Uchala nuqta kollinear bo‘lsa, yuza nol.

Yo‘nalgan yuza orqali oddiy geometrik yuzani uning modulini olish bilan topamiz. Bundan tashqari, nuqtalar berilgan tartibda soat mili bo‘yicha yoki unga teskari joylashganini aniqlash mumkin. Bu xossa qavariq qobiq, kesmalar kesishishi va nuqtaning ko‘pburchakka tegishliligini tekshirish kabi ko‘plab algoritmlarda ishlatiladi.

## Hisoblash

$2\times2$ matritsa determinanti uning ustun vektorlari quradigan parallelogrammning yo‘nalgan yuziga teng. Bu [geometriya asoslari](basic-geometry.md) maqolasidagi ikki o‘lchamli vektor ko‘paytmaning aynan o‘zidir.

$\overrightarrow{p_1p_2}$ va $\overrightarrow{p_1p_3}$ vektorlarni olsak,

$$
2S=
\begin{vmatrix}
 x_2-x_1 & x_3-x_1\\
 y_2-y_1 & y_3-y_1
\end{vmatrix}
=(x_2-x_1)(y_3-y_1)-(x_3-x_1)(y_2-y_1).
$$

Maqoladagi ekvivalent formula $\overrightarrow{p_1p_2}$ va $\overrightarrow{p_2p_3}$ vektorlaridan foydalanadi:

$$
2S=
\begin{vmatrix}
 x_2-x_1 & x_3-x_2\\
 y_2-y_1 & y_3-y_2
\end{vmatrix}.
$$

Ikki formula teng, chunki ikkinchi ustunga birinchi ustunni qo‘shish determinantni o‘zgartirmaydi.

$2S$ ni saqlash ko‘pincha qulay: butun koordinatalarda u butun son bo‘ladi va bo‘lish yoki haqiqiy son xatosi talab qilinmaydi. Oddiy yuza $|2S|/2$ ga teng.

## Implementatsiya

Quyidagi kod `point2d` uchun ayirish va `cross` funksiyasi oldindan aniqlangan deb hisoblaydi:

```cpp
int signed_area_parallelogram(point2d p1,
                              point2d p2,
                              point2d p3) {
    return cross(p2 - p1, p3 - p2);
}

double triangle_area(point2d p1,
                     point2d p2,
                     point2d p3) {
    return abs(signed_area_parallelogram(p1, p2, p3)) / 2.0;
}

bool clockwise(point2d p1,
               point2d p2,
               point2d p3) {
    return signed_area_parallelogram(p1, p2, p3) < 0;
}

bool counter_clockwise(point2d p1,
                       point2d p2,
                       point2d p3) {
    return signed_area_parallelogram(p1, p2, p3) > 0;
}
```

Katta butun koordinatalarda ko‘paytma toshib ketishi mumkin. Masalan, koordinatalar moduli $10^9$ gacha bo‘lsa, har bir ko‘paytma $10^{18}$ ga yaqinlashadi va ayirma signed 64-bit chegarasiga juda yaqin bo‘ladi. Xavfsiz yechimda `__int128` ishlatiladi:

```cpp
__int128 orient(point p1, point p2, point p3) {
    return (__int128)(p2.x - p1.x) * (p3.y - p1.y)
         - (__int128)(p2.y - p1.y) * (p3.x - p1.x);
}
```

## Geometrik ma’no

- $2S>0$: $p_1\to p_2\to p_3$ chap burilish;
- $2S<0$: o‘ng burilish;
- $2S=0$: kollinearlik.

Qavariq ko‘pburchakning uchlari soat miliga teskari tartibda berilsa, ketma-ket uchliklarning orientatsiyasi manfiy bo‘lmasligi kerak. Kesmalar kesishishida esa bir kesma uchlarining ikkinchi kesma chizig‘iga nisbatan tomonlari aynan shu ishora bilan aniqlanadi.

## Amaliy masala

* [CodeChef — Chef and Polygons](https://www.codechef.com/problems/CHEFPOLY)

