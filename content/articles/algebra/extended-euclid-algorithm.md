---
article_id: algebra--extended-euclid-algorithm
---
# Kengaytirilgan Evklid algoritmi

[Evklid algoritmi](euclid-algorithm.md) ikkita manfiy bo‘lmagan $a$ va $b$ butun sonning faqat eng katta umumiy bo‘luvchisini (EKUB) hisoblasa, uning kengaytirilgan varianti EKUBni $a$ va $b$ orqali ifodalash usulini, ya’ni quyidagi tenglikni qanoatlantiradigan $x$ va $y$ koeffitsiyentlarni ham topadi:

$$a \cdot x + b \cdot y = \gcd(a, b)$$
[Bézout ayniyati](https://en.wikipedia.org/wiki/B%C3%A9zout%27s_identity) tufayli bunday ifodani har doim topish mumkinligini ta’kidlash muhim. Masalan, $\gcd(55, 80) = 5$, shuning uchun $5$ ni $55$ va $80$ hadlarining chiziqli kombinatsiyasi sifatida ifodalash mumkin: $55 \cdot 3 + 80 \cdot (-2) = 5$.

Bu masalaning umumiyroq ko‘rinishi [Chiziqli Diofant tenglamalari](linear-diophantine-equation.md) haqidagi maqolada muhokama qilinadi.
U aynan shu algoritmga tayanadi.
## Algoritm

Ushbu bo‘limda $a$ va $b$ ning EKUBini $g$ bilan belgilaymiz.

Dastlabki algoritmga kiritiladigan o‘zgarishlar juda sodda.
Algoritmni eslasak, uning $b = 0$ va $a = g$ bilan tugashini ko‘ramiz.
Bu parametrlar uchun koeffitsiyentlarni oson topamiz: $g \cdot 1 + 0 \cdot 0 = g$.
$(x, y) = (1, 0)$ koeffitsiyentlardan boshlab, rekursiv chaqiruvlar bo‘ylab orqaga qaytishimiz mumkin.
Faqat $(a, b)$ dan $(b, a \bmod b)$ ga o‘tishda $x$ va $y$ koeffitsiyentlar qanday o‘zgarishini aniqlashimiz kerak.

Faraz qilaylik, $(b, a \bmod b)$ uchun $(x_1, y_1)$ koeffitsiyentlarni topdik:

$$b \cdot x_1 + (a \bmod b) \cdot y_1 = g$$

va $(a, b)$ uchun $(x, y)$ juftligini topmoqchimiz:

$$ a \cdot x + b \cdot y = g$$

$a \bmod b$ ni quyidagicha ifodalash mumkin:
$$ a \bmod b = a - \left\lfloor \frac{a}{b} \right\rfloor \cdot b$$

Bu ifodani $(x_1, y_1)$ koeffitsiyentlar tenglamasiga qo‘ysak:

$$ g = b \cdot x_1 + (a \bmod b) \cdot y_1 = b \cdot x_1 + \left(a - \left\lfloor \frac{a}{b} \right\rfloor \cdot b \right) \cdot y_1$$

hadlarni qayta tartiblagandan so‘ng:

$$g = a \cdot y_1 + b \cdot \left( x_1 - y_1 \cdot \left\lfloor \frac{a}{b} \right\rfloor \right)$$

$x$ va $y$ qiymatlarini topdik:
$$\begin{cases}
x = y_1 \\
y = x_1 - y_1 \cdot \left\lfloor \frac{a}{b} \right\rfloor
\end{cases} $$
## Implementatsiya

```{.cpp file=extended_gcd}
int gcd(int a, int b, int& x, int& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    int x1, y1;
    int d = gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - y1 * (a / b);
    return d;
}
```

Yuqoridagi rekursiv funksiya EKUBni qaytaradi hamda koeffitsiyentlar qiymatini funksiyaga havola orqali uzatilgan `x` va `y` ga yozadi.
Kengaytirilgan Evklid algoritmining bu implementatsiyasi manfiy butun sonlar uchun ham to‘g‘ri natija beradi.
## Iterativ variant

Kengaytirilgan Evklid algoritmini iterativ tarzda ham yozish mumkin.
U rekursiyadan foydalanmagani uchun kod rekursiv variantdan biroz tezroq ishlaydi.
```{.cpp file=extended_gcd_iter}
int gcd(int a, int b, int& x, int& y) {
    x = 1, y = 0;
    int x1 = 0, y1 = 1, a1 = a, b1 = b;
    while (b1) {
        int q = a1 / b1;
        tie(x, x1) = make_tuple(x1, x - q * x1);
        tie(y, y1) = make_tuple(y1, y - q * y1);
        tie(a1, b1) = make_tuple(b1, a1 - q * b1);
    }
    return a1;
}
```
`a1` va `b1` o‘zgaruvchilariga diqqat bilan qarasangiz, ular odatiy [Evklid algoritmining](euclid-algorithm.md#implementation) iterativ variantidagi qiymatlarni aynan takrorlashini ko‘rasiz. Demak, algoritm hech bo‘lmaganda to‘g‘ri EKUBni hisoblaydi.

Algoritm koeffitsiyentlarni ham nega to‘g‘ri hisoblashini ko‘rish uchun istalgan paytda (while sikli boshlanishidan oldin va har bir iteratsiya oxirida) quyidagi invariantlar bajarilishini ko‘rib chiqing:

$$x \cdot a + y \cdot b = a_1$$
$$x_1 \cdot a + y_1 \cdot b = b_1$$

Iteratsiya oxiridagi qiymatlarni shtrix ($'$) bilan belgilaylik va $q = \frac{a_1}{b_1}$ deb faraz qilaylik. [Evklid algoritmidan](euclid-algorithm.md) quyidagiga egamiz:

$$a_1' = b_1$$

$$b_1' = a_1 - q \cdot b_1$$

Birinchi invariant saqlanishi uchun quyidagi tenglik bajarilishi kerak:

$$x' \cdot a + y' \cdot b = a_1' = b_1$$

$$x' \cdot a + y' \cdot b = x_1 \cdot a + y_1 \cdot b$$

Ikkinchi invariant uchun ham xuddi shunday quyidagi tenglik bajarilishi kerak:
$$x_1' \cdot a + y_1' \cdot b = a_1 - q \cdot b_1$$

$$x_1' \cdot a + y_1' \cdot b = (x - q \cdot x_1) \cdot a + (y - q \cdot y_1) \cdot b$$

$a$ va $b$ ning koeffitsiyentlarini taqqoslash orqali har bir o‘zgaruvchi uchun yangilash formulalarini keltirib chiqarish mumkin; ular invariantlarning algoritm davomida saqlanishini ta’minlaydi.

Oxirida $a_1$ EKUBni saqlashini bilamiz, shuning uchun $x \cdot a + y \cdot b = g$.
Bu talab qilingan koeffitsiyentlarni topganimizni anglatadi.
Kodni yana optimallashtirib, `a1` va `b1` o‘zgaruvchilarini olib tashlash va shunchaki `a` hamda `b` ni qayta ishlatish mumkin.
Biroq shunday qilsangiz, invariantlar yordamida asoslash imkonini yo‘qotasiz.
## Amaliy masalalar

* [UVA - 10104 - Euclid Problem](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1045)
* [GYM - (J) Once Upon A Time](http://codeforces.com/gym/100963)
* [UVA - 12775 - Gift Dilemma](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4628)
