---
article_id: geometry--lines-intersection
---
# To‘g‘ri chiziqlarning kesishish nuqtasi

Tekislikda ikkita to‘g‘ri chiziq berilgan. Ularning yagona kesishish nuqtasini topish yoki chiziqlar parallel ekanini aniqlash kerak. Chiziqlar

$$
a_1x+b_1y+c_1=0,
\qquad
a_2x+b_2y+c_2=0
$$

ko‘rinishda beriladi.

## Determinant yordamida yechim

Ikki tenglamali chiziqli sistema uchun determinant

$$
D=a_1b_2-a_2b_1
$$

bo‘ladi. Agar $D\ne0$ bo‘lsa, Kramer qoidasiga ko‘ra yagona kesishish nuqtasi mavjud:

$$
x=-\frac{c_1b_2-c_2b_1}{D},
\qquad
y=-\frac{a_1c_2-a_2c_1}{D}.
$$

Ekvivalent ko‘rinish:

$$
x=\frac{b_1c_2-b_2c_1}{D},
\qquad
y=\frac{c_1a_2-c_2a_1}{D}.
$$

Agar $D=0$ bo‘lsa, normal vektorlar proporsional va chiziqlar parallel. Bu holatda chiziqlar yo turli, yo ustma-ust tushadi. Masalan,

$$
a_1c_2-a_2c_1=0,
\qquad
b_1c_2-b_2c_1=0
$$

ham bajarilsa, chiziqlar ustma-ust tushadi.

## Haqiqiy sonlar uchun tuzilma

Quyidagi tuzilma ikki nuqtadan chiziq quradi va koeffitsiyentlarni $\sqrt{a^2+b^2}=1$ bo‘ladigan qilib normallashtiradi. Normallashtirish nuqtadan chiziqqacha masofa kabi amallarni soddalashtiradi.

```cpp
const double EPS = 1e-9;

struct pt {
    double x, y;
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
        if (z > EPS) {
            a /= z;
            b /= z;
            c /= z;
        }
    }
};
```

Ikki chiziqning determinanti va kesishish nuqtasi:

```cpp
double det(double a, double b, double c, double d) {
    return a * d - b * c;
}

bool intersect(line m, line n, pt &res) {
    double zn = det(m.a, m.b, n.a, n.b);
    if (abs(zn) < EPS)
        return false;
    res.x = -det(m.c, m.b, n.c, n.b) / zn;
    res.y = -det(m.a, m.c, n.a, n.c) / zn;
    return true;
}
```

`intersect` `false` qaytarsa, yagona nuqta yo‘q; parallel va ustma-ust holatlarni alohida ajratish mumkin.

```cpp
bool parallel(line m, line n) {
    return abs(det(m.a, m.b, n.a, n.b)) < EPS;
}

bool equivalent(line m, line n) {
    return abs(det(m.a, m.b, n.a, n.b)) < EPS &&
           abs(det(m.a, m.c, n.a, n.c)) < EPS &&
           abs(det(m.b, m.c, n.b, n.c)) < EPS;
}
```

## Parametrik ko‘rinish

Chiziqlar nuqta va yo‘nalish vektori orqali ham berilishi mumkin:

$$
p+t\,r,
\qquad q+u\,s.
$$

Ular parallel bo‘lmasa,

$$
t=\frac{(q-p)\times s}{r\times s}
$$

va kesishish nuqtasi $p+tr$ ga teng.

```cpp
struct vec {
    double x, y;
    vec operator+(vec other) const { return {x + other.x, y + other.y}; }
    vec operator-(vec other) const { return {x - other.x, y - other.y}; }
    vec operator*(double k) const { return {x * k, y * k}; }
};

double cross(vec a, vec b) {
    return a.x * b.y - a.y * b.x;
}

bool line_intersection(vec p, vec r, vec q, vec s, vec &ans) {
    double d = cross(r, s);
    if (abs(d) < EPS)
        return false;
    double t = cross(q - p, s) / d;
    ans = p + r * t;
    return true;
}
```

## Sonli aniqlik

`double` bilan ishlaganda determinant mutlaq nolga tenglashtirilmaydi; `abs(D) < EPS` kabi tekshiruv qo‘llanadi. `EPS` koordinatalar miqyosiga bog‘liq. Juda katta koordinatalarda nisbiy xatoni ham hisobga olish yoki imkon bo‘lsa butun determinantlar va ratsional javobdan foydalanish kerak.

Agar kirish koeffitsiyentlari butun bo‘lsa, parallel ekanini `__int128` da aniq tekshirish mumkin. Kesishish koordinatalari kasr bo‘lishi mumkin, shuning uchun javobni ratsional sonlar jufti yoki `long double` orqali saqlash tanlanadi.

