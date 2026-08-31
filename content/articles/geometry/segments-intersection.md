---
article_id: geometry--segments-intersection
---
# Kesmalar kesishmasi

Tekislikda $[a,b]$ va $[c,d]$ yopiq kesmalar berilgan. Ularning kesishmasini topish kerak. Natija uch xil bo‘lishi mumkin:

1. kesishma bo‘sh;
2. kesishma bitta nuqta;
3. kesmalar kollinear va ularning kesishmasi yana bir kesma.

Maqoladagi yondashuv haqiqiy koordinatalarda ishlaydi va chiziqlar tenglamasi, proyeksiyalar hamda `EPS` yordamida degenerativ holatlarni qayta ishlaydi.

## Yordamchi tuzilmalar

```cpp
const double EPS = 1E-9;

struct pt {
    double x, y;

    bool operator<(const pt& p) const {
        return x < p.x - EPS ||
               (abs(x - p.x) < EPS && y < p.y - EPS);
    }
};

struct line {
    double a, b, c;

    line() {}
    line(pt p, pt q) {
        a = p.y - q.y;
        b = q.x - p.x;
        c = -a * p.x - b * p.y;
        norm();
    }

    void norm() {
        double z = sqrt(a * a + b * b);
        if (abs(z) > EPS)
            a /= z, b /= z, c /= z;
    }

    double dist(pt p) const {
        return a * p.x + b * p.y + c;
    }
};
```

Nuqtalarni leksikografik taqqoslash kesma uchlarini bir xil tartibga keltirish va kollinear kesishmani topish uchun ishlatiladi. Chiziq koeffitsiyentlari normallashtirilgani sababli `dist` ishorali masofani beradi.

Determinant va bir o‘lchamli oraliqlar kesishishi:

```cpp
double det(double a, double b, double c, double d) {
    return a * d - b * c;
}

bool betw(double l, double r, double x) {
    return min(l, r) <= x + EPS && x <= max(l, r) + EPS;
}

bool intersect_1d(double a, double b, double c, double d) {
    if (a > b) swap(a, b);
    if (c > d) swap(c, d);
    return max(a, c) <= min(b, d) + EPS;
}
```

Ikki parallel bo‘lmagan chiziqning kesishish nuqtasi:

```cpp
pt intersect_lines(line m, line n) {
    double zn = det(m.a, m.b, n.a, n.b);
    return {
        -det(m.c, m.b, n.c, n.b) / zn,
        -det(m.a, m.c, n.a, n.c) / zn
    };
}
```

## Asosiy algoritm

Natijani `left` va `right` nuqtalar orqali qaytaramiz. Bitta nuqta kesishmasida ular teng bo‘ladi; kesma kesishmasida ular kesishma kesmaning uchlaridir.

```cpp
bool intersect(pt a, pt b, pt c, pt d, pt& left, pt& right) {
    if (!intersect_1d(a.x, b.x, c.x, d.x) ||
        !intersect_1d(a.y, b.y, c.y, d.y))
        return false;

    line m(a, b);
    line n(c, d);
    double zn = det(m.a, m.b, n.a, n.b);

    if (abs(zn) < EPS) {
        if (abs(m.dist(c)) > EPS || abs(n.dist(a)) > EPS)
            return false;

        if (b < a) swap(a, b);
        if (d < c) swap(c, d);
        left = max(a, c);
        right = min(b, d);
        return true;
    }

    left = right = intersect_lines(m, n);
    return betw(a.x, b.x, left.x) &&
           betw(a.y, b.y, left.y) &&
           betw(c.x, d.x, left.x) &&
           betw(c.y, d.y, left.y);
}
```

Avval $x$ va $y$ proyeksiyalar kesishishi tekshiriladi. Bu tez rad etish bilan birga kollinear holatda ham zarur shartdir.

Agar determinant nolga yaqin bo‘lsa, chiziqlar parallel. Bir chiziqdagi nuqtaning ikkinchi chiziqqacha ishorali masofasi ham nolga yaqin bo‘lmasa, ular turli parallel chiziqlar va kesishma yo‘q. Aks holda kesmalar kollinear. Uchlar leksikografik tartibga keltirilib, kesishma $[\max(a,c),\min(b,d)]$ sifatida olinadi.

Determinant nol bo‘lmasa, chiziqlar yagona nuqtada kesishadi. Shu nuqta ikkala kesmaning koordinata oraliqlarida yotsa, u kesmalar kesishmasidir.

## Degenerativ kesmalar

Kesmalardan biri nuqta bo‘lsa, chiziqning normalizatsiyasi nol uzunlik sababli alohida e’tibor talab qiladi. Amaliy implementatsiyada avval `a == b` va `c == d` holatlarini ajratish, nuqtaning kesmada yotishini orientatsiya va koordinata oraliqlari bilan tekshirish xavfsizroq.

## Murakkablik

Barcha amallar doimiy vaqtda bajariladi: vaqt $O(1)$, qo‘shimcha xotira $O(1)$.

