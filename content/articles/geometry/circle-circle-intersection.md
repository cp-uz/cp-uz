---
article_id: geometry--circle-circle-intersection
---
# Ikki aylananing kesishmasi

Markazlari $(x_1,y_1)$ va $(x_2,y_2)$, radiuslari $r_1$ va $r_2$ bo‘lgan ikki aylananing umumiy nuqtalarini topish kerak.

## Koordinatalarni siljitish

Avval birinchi aylana markazini koordinatalar boshiga ko‘chiramiz:

$$
(x_2',y_2')=(x_2-x_1,\ y_2-y_1).
$$

Endi aylana tenglamalari

$$
x^2+y^2=r_1^2
$$

va

$$
(x-x_2')^2+(y-y_2')^2=r_2^2
$$

bo‘ladi. Ikkinchi tenglamadan birinchisini ayirsak, kvadrat hadlar yo‘qoladi:

$$
-2x x_2'-2y y_2'+x_2'^2+y_2'^2=r_2^2-r_1^2.
$$

Bu

$$
Ax+By+C=0
$$

chiziq tenglamasi bo‘lib,

$$
A=-2x_2',\qquad
B=-2y_2',\qquad
C=x_2'^2+y_2'^2+r_1^2-r_2^2.
$$

Demak, ikki aylana kesishishi masalasi markazi boshda va radiusi $r_1$ bo‘lgan aylananing shu chiziq bilan kesishishiga keltiriladi.

## Maxsus holatlar

Agar markazlar bir xil bo‘lsa, ya’ni $x_2'=y_2'=0$:

- $r_1=r_2$ bo‘lsa, aylanalar ustma-ust tushadi va cheksiz ko‘p umumiy nuqta mavjud;
- radiuslar turli bo‘lsa, umumiy nuqta yo‘q.

Markazlar turli bo‘lsa, umumiy nuqtalar sonini markazlar orasidagi $d$ masofa orqali ham aniqlash mumkin:

- $d>r_1+r_2$ — aylanalar tashqi tomondan ajralgan;
- $d<|r_1-r_2|$ — bir aylana ikkinchisining ichida va tegmaydi;
- $d=r_1+r_2$ yoki $d=|r_1-r_2|$ — bitta urinma nuqta;
- $|r_1-r_2|<d<r_1+r_2$ — ikkita kesishish nuqtasi.

## Implementatsiya

```cpp
const double EPS = 1e-9;

struct point {
    double x, y;
};

struct circle_intersection_result {
    // infinite == true bo‘lsa aylanalar ustma-ust tushadi.
    bool infinite = false;
    vector<point> points;
};

circle_intersection_result intersect_circles(point c1, double r1,
                                             point c2, double r2) {
    circle_intersection_result res;
    double x2 = c2.x - c1.x;
    double y2 = c2.y - c1.y;

    if (abs(x2) < EPS && abs(y2) < EPS) {
        if (abs(r1 - r2) < EPS)
            res.infinite = true;
        return res;
    }

    double A = -2.0 * x2;
    double B = -2.0 * y2;
    double C = x2 * x2 + y2 * y2 + r1 * r1 - r2 * r2;

    double den = A * A + B * B;
    double x0 = -A * C / den;
    double y0 = -B * C / den;
    double lhs = C * C;
    double rhs = r1 * r1 * den;

    if (lhs > rhs + EPS)
        return res;

    if (abs(lhs - rhs) < EPS) {
        res.points.push_back({x0 + c1.x, y0 + c1.y});
        return res;
    }

    double mult = sqrt((rhs - lhs) / den) / sqrt(den);
    point p = {x0 + B * mult, y0 - A * mult};
    point q = {x0 - B * mult, y0 + A * mult};
    p.x += c1.x; p.y += c1.y;
    q.x += c1.x; q.y += c1.y;
    res.points.push_back(p);
    res.points.push_back(q);
    return res;
}
```

Bu kod [aylana va chiziq kesishmasi](circle-line-intersection.md) formulasini bevosita ichida qo‘llaydi. Amaliy loyihada ikki masala uchun bitta yordamchi funksiyadan foydalanish mumkin.

## Alternativ geometrik formula

Markazlar orasidagi masofa $d$ bo‘lsin. Birinchi markazdan markazlar chizig‘i bo‘ylab umumiy xordaning o‘rtasigacha masofa

$$
a=\frac{r_1^2-r_2^2+d^2}{2d}
$$

va xordning yarim uzunligi

$$
h=\sqrt{r_1^2-a^2}
$$

bo‘ladi. Birlik vektor $\mathbf e=(c_2-c_1)/d$ va unga perpendikulyar $\mathbf e_\perp=(-e_y,e_x)$ orqali nuqtalar

$$
p=c_1+a\mathbf e+h\mathbf e_\perp,
\qquad
q=c_1+a\mathbf e-h\mathbf e_\perp
$$

topiladi. Bu formula ham $O(1)$ vaqtda ishlaydi, ammo barcha degenerativ holatlar oldindan ajratilishi kerak.

