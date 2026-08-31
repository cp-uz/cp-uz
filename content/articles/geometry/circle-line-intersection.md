---
article_id: geometry--circle-line-intersection
---
# Aylana va to‘g‘ri chiziq kesishmasi

Markazi koordinatalar boshida, radiusi $r$ bo‘lgan aylana va

$$
ax+by+c=0
$$

to‘g‘ri chiziq berilgan. Ularning kesishish nuqtalarini topish talab qilinadi. Markazi boshqa nuqtada bo‘lgan aylana uchun avval koordinatalarni markazga siljitish, javobdan so‘ng nuqtalarni orqaga siljitish kifoya.

## Geometrik yechim

Koordinatalar boshidan chiziqqa tushirilgan perpendikulyarning asosini $(x_0,y_0)$ deb belgilaymiz. Chiziq normal vektori $(a,b)$ bo‘lgani uchun eng yaqin nuqta shu yo‘nalishda yotadi. Standart proyeksiya formulasi:

$$
x_0=-\frac{ac}{a^2+b^2},
\qquad
y_0=-\frac{bc}{a^2+b^2}.
$$

Koordinatalar boshidan chiziqqacha masofaning kvadrati

$$
d_0^2=\frac{c^2}{a^2+b^2}
$$

bo‘ladi.

Uch holat mavjud:

1. $d_0>r$ bo‘lsa, chiziq aylana tashqarisidan o‘tadi va kesishma yo‘q;
2. $d_0=r$ bo‘lsa, chiziq urinma va yagona nuqta $(x_0,y_0)$;
3. $d_0<r$ bo‘lsa, ikkita kesishish nuqtasi mavjud.

Uchinchi holatda kesishish nuqtalarining $(x_0,y_0)$ dan chiziq bo‘ylab masofasi

$$
d=\sqrt{r^2-d_0^2}
$$

ga teng. Chiziqning birlik yo‘nalish vektori

$$
\frac{(-b,a)}{\sqrt{a^2+b^2}}
$$

bo‘lgani uchun siljish komponentlari

$$
\Delta x=-b\sqrt{\frac{r^2-d_0^2}{a^2+b^2}},
\qquad
\Delta y=a\sqrt{\frac{r^2-d_0^2}{a^2+b^2}}
$$

bo‘ladi. Javoblar:

$$
(x_0+\Delta x,y_0+\Delta y),
\qquad
(x_0-\Delta x,y_0-\Delta y).
$$

## Implementatsiya

```cpp
const double EPS = 1e-9;

struct point {
    double x, y;
};

vector<point> circle_line_intersection(double r,
                                       double a,
                                       double b,
                                       double c) {
    vector<point> ans;
    double den = a * a + b * b;
    double x0 = -a * c / den;
    double y0 = -b * c / den;
    double lhs = c * c;
    double rhs = r * r * den;

    if (lhs > rhs + EPS)
        return ans;

    if (abs(lhs - rhs) < EPS) {
        ans.push_back({x0, y0});
        return ans;
    }

    double mult = sqrt((rhs - lhs) / den) / sqrt(den);
    double ax = x0 + b * mult;
    double ay = y0 - a * mult;
    double bx = x0 - b * mult;
    double by = y0 + a * mult;
    ans.push_back({ax, ay});
    ans.push_back({bx, by});
    return ans;
}
```

Formulani quyidagicha ham yozish mumkin:

```cpp
double d = r * r - c * c / (a * a + b * b);
double mult = sqrt(d / (a * a + b * b));
point p1 = {x0 + b * mult, y0 - a * mult};
point p2 = {x0 - b * mult, y0 + a * mult};
```

Haqiqiy sonlarda $d$ nazariy jihatdan nol bo‘lsa ham hisoblash xatosi sababli ozgina manfiy chiqishi mumkin. Shuning uchun holatlarni `EPS` bilan ajratib, `sqrt` ga uzatishdan oldin $d$ ni kamida nolga tenglashtirish mumkin.

## Nega geometrik usul afzal

Aylana tenglamasi $x^2+y^2=r^2$ ga chiziq tenglamasidan bir o‘zgaruvchini qo‘yib, kvadrat tenglama yechish ham mumkin. Biroq bu usul ko‘proq algebraik amallarni talab qiladi va ayrim yo‘nalishlarda, masalan $b\approx0$ bo‘lganda, alohida shartlar yoki sonli beqarorlik keltirib chiqaradi. Perpendikulyar proyeksiyaga asoslangan formula simmetrik, qisqa va barcha chiziq yo‘nalishlari uchun bir xil ishlaydi.

## Siljitilgan aylana

Aylana markazi $(x_c,y_c)$ bo‘lsa, $X=x-x_c$, $Y=y-y_c$ deb olamiz. Chiziq

$$
aX+bY+(ax_c+by_c+c)=0
$$

ko‘rinishga keladi. Yuqoridagi algoritmda yangi $c'=ax_c+by_c+c$ ishlatiladi va topilgan $(X,Y)$ nuqtalarga markaz qo‘shiladi.

Murakkablik $O(1)$ vaqt va $O(1)$ qo‘shimcha xotiradir.

