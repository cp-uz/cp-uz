---
article_id: num_methods--simpson-integration
---
# Simpson formulasi bilan integrallash

Quyidagi aniq integralni sonli yaqinlashtirish kerak:

$$\int_a^b f(x)\,dx.$$

Bu yerda tavsiflanadigan yechim Thomas Simpsonning 1743-yilda chop etilgan ishlaridan birida berilgan. Usul funksiya grafigini kichik oraliqlarda to‘g‘ri chiziq bilan emas, parabola bilan yaqinlashtiradi.

## Simpson formulasi

$n$ musbat butun son bo‘lsin. $[a,b]$ kesmani $2n$ ta teng qismga bo‘lamiz:

$$x_i=a+ih,\qquad i=0,1,\ldots,2n,$$

$$h=\frac{b-a}{2n}.$$

Integral har bir $[x_{2i-2},x_{2i}]$, $i=1,2,\ldots,n$ juft oraliqda alohida yaqinlashtirilib, natijalar qo‘shiladi.

Bitta $[x_{2i-2},x_{2i}]$ bo‘lakda $f(x)$ o‘rniga uchta

$$\bigl(x_{2i-2},f(x_{2i-2})\bigr),\quad
\bigl(x_{2i-1},f(x_{2i-1})\bigr),\quad
\bigl(x_{2i},f(x_{2i})\bigr)$$

nuqtadan o‘tadigan yagona $P(x)$ parabola olinadi. Uni, masalan, Lagrange interpolyatsiyasi bilan qurish mumkin. Parabolani aniq integrallash quyidagi sodda formulani beradi:

$$\int_{x_{2i-2}}^{x_{2i}} f(x)\,dx
\approx
\left(f(x_{2i-2})+4f(x_{2i-1})+f(x_{2i})\right)\frac h3.$$

Barcha juft bo‘laklarni qo‘shsak, **kompozit Simpson formulasi** hosil bo‘ladi:

$$\int_a^b f(x)\,dx\approx
\left(
f(x_0)+4f(x_1)+2f(x_2)+4f(x_3)+\dots+
2f(x_{2n-2})+4f(x_{2n-1})+f(x_{2n})
\right)\frac h3.$$

Chegaradagi qiymatlar bir martadan, ichki toq indekslar $4$, ichki juft indekslar esa $2$ koeffitsiyent bilan olinadi. Shu sabab bo‘linishlar soni albatta juft bo‘lishi kerak.

## Nima uchun parabola yetarli?

Simpson formulasi darajasi uchdan katta bo‘lmagan ko‘phadlarni aniq integrallaydi. Qurilish kvadratik interpolyatsiyadan kelib chiqqan bo‘lsa-da, nuqtalarning o‘rta nuqtaga nisbatan simmetrik joylashuvi toq darajali xato hadlarini bekor qiladi. Natijada kubik funksiya uchun ham formula aniq chiqadi.

Silliq umumiy funksiya har kichik oraliqda Taylor qatori bilan ifodalanadi. Birinchi mos kelmaydigan had to‘rtinchi hosilaga bog‘liq bo‘lib, xato yuqori tartibda kamayadi. Bu trapetsiya usuliga qaraganda bir xil bo‘linish sonida ko‘pincha ancha aniq natija beradi.

## Xatolik

Bitta $[a,b]$ panel uchun Simpson yaqinlashuvi xatosi

$$-\frac1{90}\left(\frac{b-a}{2}\right)^5 f^{(4)}(\xi),$$

bu yerda $\xi\in(a,b)$. Xato asimptotik ravishda $(b-a)^5$ ga proporsional. Oddiy interpolyatsion qarash to‘rtinchi tartibni kutgandek tuyuladi, ammo simmetrik nuqtalar qo‘shimcha bir tartib yutadi.

$N=2n$ ta teng bo‘linishli kompozit formula uchun, $f^{(4)}$ uzluksiz bo‘lsa, qandaydir $\xi\in(a,b)$ da

$$E=-\frac{b-a}{180}h^4f^{(4)}(\xi)$$

bo‘ladi. Demak, $h$ ikki baravar kichraytirilsa, xato taxminan $16$ baravar kamayadi.

Bu nazariy baho funksiya yetarlicha silliq bo‘lganda amal qiladi. Uzilish, keskin burchak, singulyarlik yoki kuchli tebranish bo‘lsa, intervalni moslashtirib bo‘lish yoki boshqa sonli usul kerak bo‘lishi mumkin.

## C++ implementatsiyasi

Quyidagi kodda `steps` juft va musbat bo‘lishi shart. `f(x)` masalaga mos foydalanuvchi funksiyasidir.

```cpp
double simpson_integration(double a, double b, int steps) {
    assert(steps > 0 && steps % 2 == 0);

    double h = (b - a) / steps;
    double sum = f(a) + f(b);

    for (int i = 1; i < steps; ++i) {
        double x = a + h * i;
        sum += f(x) * ((i & 1) ? 4.0 : 2.0);
    }

    return sum * h / 3.0;
}
```

Pinlangan upstream implementatsiya `steps = 1'000'000` dan foydalanadi. Qat’iy katta qiymat sodda, ammo har masalada samarali emas: silliq funksiyada ortiqcha hisob, murakkab hududda esa yetarli bo‘lmagan aniqlik berishi mumkin.

## Python implementatsiyasi

```python
from collections.abc import Callable


def simpson_integration(
    f: Callable[[float], float],
    a: float,
    b: float,
    steps: int,
) -> float:
    if steps <= 0 or steps % 2 != 0:
        raise ValueError("steps musbat va juft bo‘lishi kerak")

    h = (b - a) / steps
    total = f(a) + f(b)

    for i in range(1, steps):
        x = a + h * i
        total += f(x) * (4 if i % 2 else 2)

    return total * h / 3
```

## Amaliy aniqlik nazorati

Xatoning aniq yuqori chegarasi uchun $\max|f^{(4)}(x)|$ kerak, u esa ko‘pincha noma’lum. Amalda $N$ va $2N$ bo‘linishdagi natijalar solishtiriladi. To‘rtinchi tartibli usul bo‘lgani uchun ularning farqi xatoni taxminan baholashga yordam beradi. Farq talab qilingan `eps` dan kichik bo‘lguncha bo‘linish soni ikki baravar oshirilishi mumkin.

Adaptive Simpson usuli butun intervalni bir xil mayda bo‘lish o‘rniga, xato katta bo‘lgan bo‘laklarnigina rekursiv ajratadi. Funksiya ayrim joylarda tez, boshqa joylarda sekin o‘zgarsa, bu yondashuv ancha kam `f` chaqiruvi bilan ayni aniqlikka erishadi.

## Murakkablik

$N$ ta bo‘linish uchun kompozit Simpson usuli $N+1$ marta funksiya qiymatini hisoblaydi: vaqt $O(N)$, qo‘shimcha xotira $O(1)$. Adaptive variantning vaqti funksiya shakli va talab qilingan xatoga bog‘liq.

## Mashq masalalari

- [Latin American Regionals 2012 — Environment Protection](https://matcomgrader.com/problem/9335/environment-protection/)
