---
article_id: geometry--basic-geometry
---
# Geometriya asoslari

Ushbu maqolada analitik geometriyaning asosini tashkil qiladigan Evklid fazosidagi nuqtalar ustidagi asosiy amallar ko‘rib chiqiladi. Har bir $\mathbf r$ nuqtaga koordinatalar boshidan $\mathbf r$ ga yo‘nalgan $\vec{\mathbf r}$ vektorni mos qo‘yamiz. Keyingi o‘rinlarda nuqta va uning radius-vektorini alohida ajratmaymiz: “nuqta” atamasi vektor ma’nosida ham ishlatiladi.

## Chiziqli amallar

Ikki va uch o‘lchamli nuqtalar chiziqli fazoni tashkil qiladi. Shuning uchun nuqtalarni qo‘shish, ayirish va son bilan ko‘paytirish amallari aniqlangan. Ikki o‘lchamli nuqta uchun asosiy implementatsiya:

```cpp
struct point2d {
    ftype x, y;
    point2d() {}
    point2d(ftype x, ftype y): x(x), y(y) {}
    point2d& operator+=(const point2d &t) {
        x += t.x;
        y += t.y;
        return *this;
    }
    point2d& operator-=(const point2d &t) {
        x -= t.x;
        y -= t.y;
        return *this;
    }
    point2d& operator*=(ftype t) {
        x *= t;
        y *= t;
        return *this;
    }
    point2d& operator/=(ftype t) {
        x /= t;
        y /= t;
        return *this;
    }
    point2d operator+(const point2d &t) const {
        return point2d(*this) += t;
    }
    point2d operator-(const point2d &t) const {
        return point2d(*this) -= t;
    }
    point2d operator*(ftype t) const {
        return point2d(*this) *= t;
    }
    point2d operator/(ftype t) const {
        return point2d(*this) /= t;
    }
};
point2d operator*(ftype a, point2d b) {
    return b * a;
}
```

Uch o‘lchamli nuqta xuddi shu usulda yoziladi:

```cpp
struct point3d {
    ftype x, y, z;
    point3d() {}
    point3d(ftype x, ftype y, ftype z): x(x), y(y), z(z) {}
    point3d& operator+=(const point3d &t) {
        x += t.x;
        y += t.y;
        z += t.z;
        return *this;
    }
    point3d& operator-=(const point3d &t) {
        x -= t.x;
        y -= t.y;
        z -= t.z;
        return *this;
    }
    point3d& operator*=(ftype t) {
        x *= t;
        y *= t;
        z *= t;
        return *this;
    }
    point3d& operator/=(ftype t) {
        x /= t;
        y /= t;
        z /= t;
        return *this;
    }
    point3d operator+(const point3d &t) const {
        return point3d(*this) += t;
    }
    point3d operator-(const point3d &t) const {
        return point3d(*this) -= t;
    }
    point3d operator*(ftype t) const {
        return point3d(*this) *= t;
    }
    point3d operator/(ftype t) const {
        return point3d(*this) /= t;
    }
};
point3d operator*(ftype a, point3d b) {
    return b * a;
}
```

Bu yerda `ftype` koordinatalar uchun ishlatiladigan tur bo‘lib, odatda `int`, `long long` yoki `double` tanlanadi. Butun koordinatalar va faqat qo‘shish, ayirish, ko‘paytirish talab qilinadigan masalalarda butun tur aniq natija beradi. Bo‘lish, uzunlik va burchaklar ishlatilganda odatda `double` zarur bo‘ladi.

## Skalyar ko‘paytma

### Ta’rif

$\mathbf a$ va $\mathbf b$ vektorlarning skalyar ko‘paytmasi geometrik jihatdan

$$
\mathbf a\cdot\mathbf b=|\mathbf a|\,|\mathbf b|\cos\theta,
$$

bu yerda $\theta$ — vektorlar orasidagi burchak. Boshqacha aytganda, birinchi vektor uzunligi ikkinchi vektorning birinchi vektor yo‘nalishidagi proyeksiyasi uzunligiga ko‘paytiriladi.

Skalyar ko‘paytma quyidagi muhim xossalarga ega:

1. $\mathbf a\cdot\mathbf b=\mathbf b\cdot\mathbf a$;
2. $(\alpha\mathbf a)\cdot\mathbf b=\alpha(\mathbf a\cdot\mathbf b)$;
3. $(\mathbf a+\mathbf b)\cdot\mathbf c=\mathbf a\cdot\mathbf c+\mathbf b\cdot\mathbf c$.

Koordinatalarda

$$
(x_1,y_1)\cdot(x_2,y_2)=x_1x_2+y_1y_2,
$$

uch o‘lchamda esa

$$
(x_1,y_1,z_1)\cdot(x_2,y_2,z_2)=x_1x_2+y_1y_2+z_1z_2.
$$

```cpp
ftype dot(point2d a, point2d b) {
    return a.x * b.x + a.y * b.y;
}
ftype dot(point3d a, point3d b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
```

Masalalarda qiymatni hisoblash uchun algebraik ta’rif ishlatiladi, lekin formulani qo‘llash yo‘lini ko‘rish uchun geometrik ma’noni yodda tutish kerak.

### Xossalar va qo‘llanishlar

Skalyar ko‘paytma orqali ko‘plab geometrik kattaliklar aniqlanadi:

1. kvadrat norma: $|\mathbf a|^2=\mathbf a\cdot\mathbf a$;
2. uzunlik: $|\mathbf a|=\sqrt{\mathbf a\cdot\mathbf a}$;
3. $\mathbf a$ ning $\mathbf b$ yo‘nalishidagi skalyar proyeksiyasi: $\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|}$;
4. vektorlar orasidagi burchak: $\arccos\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$;
5. skalyar ko‘paytma musbat bo‘lsa burchak o‘tkir, manfiy bo‘lsa o‘tmas, nol bo‘lsa vektorlar o‘zaro perpendikulyar.

```cpp
ftype norm(point2d a) {
    return dot(a, a);
}
double abs(point2d a) {
    return sqrt(norm(a));
}
double proj(point2d a, point2d b) {
    return dot(a, b) / abs(b);
}
double angle(point2d a, point2d b) {
    return acos(dot(a, b) / abs(a) / abs(b));
}
```

$\mathbf r\cdot\mathbf a=C$ tenglamani qanoatlantiradigan barcha $\mathbf r$ nuqtalar $\mathbf a$ ga perpendikulyar gipertekislikni hosil qiladi. Ikki o‘lchamda bu to‘g‘ri chiziq, uch o‘lchamda tekislikdir. Shuning uchun 2D chiziqni

$$
\mathbf r\cdot\mathbf n=C
$$

yoki

$$
(\mathbf r-\mathbf r_0)\cdot\mathbf n=0
$$

ko‘rinishda berish mumkin. Bu yerda $\mathbf n$ chiziqqa normal vektor, $\mathbf r_0$ esa chiziqdagi istalgan nuqta.

## Vektor ko‘paytma

### Uch o‘lchamli ta’rif

$\mathbf b\times\mathbf c$ vektor $\mathbf b$ va $\mathbf c$ ga perpendikulyar bo‘lib, uning uzunligi shu ikki vektor quradigan parallelogramm yuziga teng:

$$
|\mathbf b\times\mathbf c|=|\mathbf b|\,|\mathbf c|\sin\theta.
$$

Yo‘nalish o‘ng qo‘l qoidasi bilan tanlanadi. $\mathbf a\cdot(\mathbf b\times\mathbf c)$ aralash ko‘paytma deyiladi; uning moduli uch vektor quradigan parallelepiped hajmiga teng.

Muhim xossalar:

1. $\mathbf a\times\mathbf b=-\mathbf b\times\mathbf a$;
2. $(\alpha\mathbf a)\times\mathbf b=\alpha(\mathbf a\times\mathbf b)$;
3. $(\mathbf a+\mathbf b)\times\mathbf c=\mathbf a\times\mathbf c+\mathbf b\times\mathbf c$;
4. $\mathbf a\cdot(\mathbf b\times\mathbf c)=\mathbf b\cdot(\mathbf c\times\mathbf a)=\mathbf c\cdot(\mathbf a\times\mathbf b)$;
5. ikki vektor kollinear bo‘lsa va faqat shunda ularning vektor ko‘paytmasi nol.

Koordinatalarda:

$$
\mathbf a\times\mathbf b=
\begin{pmatrix}
 a_yb_z-a_zb_y\\
 a_zb_x-a_xb_z\\
 a_xb_y-a_yb_x
\end{pmatrix}.
$$

```cpp
point3d cross(point3d a, point3d b) {
    return point3d(a.y * b.z - a.z * b.y,
                   a.z * b.x - a.x * b.z,
                   a.x * b.y - a.y * b.x);
}
ftype triple(point3d a, point3d b, point3d c) {
    return dot(a, cross(b, c));
}
```

### Ikki o‘lchamli vektor ko‘paytma

Ikki o‘lchamli vektorlarni $z=0$ tekisligiga joylashtirsak, ularning vektor ko‘paytmasi faqat $z$ koordinataga ega bo‘ladi. Shu sababli 2D da skalyar qiymat sifatida

$$
\operatorname{cross}(\mathbf a,\mathbf b)=a_xb_y-a_yb_x
$$

ishlatiladi.

```cpp
ftype cross(point2d a, point2d b) {
    return a.x * b.y - a.y * b.x;
}
```

Bu qiymatning moduli vektorlar quradigan parallelogramm yuziga teng. Ishora esa burilish yo‘nalishini ko‘rsatadi: musbat qiymat $\mathbf a$ dan $\mathbf b$ ga soat miliga teskari burilishni, manfiy qiymat soat mili bo‘yicha burilishni bildiradi.

Uchta $a,b,c$ nuqta uchun

$$
\operatorname{cross}(b-a,c-a)
$$

qiymati uchburchakning ikki baravar yo‘nalgan yuzidir. U nol bo‘lsa nuqtalar bir chiziqda; musbat bo‘lsa $a\to b\to c$ chap burilish, manfiy bo‘lsa o‘ng burilish hosil qiladi.

## Chiziqlar kesishishi

Ikki o‘lchamda chiziqni nuqta va yo‘nalish vektori bilan

$$
\mathbf r=\mathbf a+t\mathbf d
$$

ko‘rinishda berish mumkin. Ikki chiziq

$$
\mathbf a_1+t\mathbf d_1=\mathbf a_2+s\mathbf d_2
$$

kesishsa, vektor ko‘paytmadan

$$
t=\frac{(\mathbf a_2-\mathbf a_1)\times\mathbf d_2}{\mathbf d_1\times\mathbf d_2}
$$

kelib chiqadi. Maxraj nol bo‘lsa yo‘nalishlar parallel. Surat ham nol bo‘lsa chiziqlar ustma-ust tushadi; aks holda ular turli parallel chiziqlardir.

```cpp
point2d intersect(point2d a1, point2d d1,
                  point2d a2, point2d d2) {
    return a1 + cross(a2 - a1, d2) / cross(d1, d2) * d1;
}
```

Uch o‘lchamda ikki chiziq odatda bir tekislikda bo‘lmasligi mumkin. Ularning komplanarligi aralash ko‘paytma bilan tekshiriladi:

$$
(\mathbf a_2-\mathbf a_1)\cdot(\mathbf d_1\times\mathbf d_2)=0.
$$

## Tekisliklar kesishishi

Tekislik normal vektor va undagi nuqta orqali

$$
(\mathbf r-\mathbf r_0)\cdot\mathbf n=0
$$

ko‘rinishda beriladi. Ikki parallel bo‘lmagan tekislikning kesishmasi yo‘nalishi $\mathbf n_1\times\mathbf n_2$ bo‘lgan chiziqdir. Uchta tekislikning yagona kesishish nuqtasini Kramer qoidasi yoki aralash ko‘paytma orqali topish mumkin.

Quyidagi formula $\mathbf r\cdot\mathbf n_i=d_i$ ($i=1,2,3$) tekisliklarning kesishish nuqtasini beradi:

$$
\mathbf r=
\frac{
 d_1(\mathbf n_2\times\mathbf n_3)+
 d_2(\mathbf n_3\times\mathbf n_1)+
 d_3(\mathbf n_1\times\mathbf n_2)
}{
 \mathbf n_1\cdot(\mathbf n_2\times\mathbf n_3)
}.
$$

Maxraj nol bo‘lsa normal vektorlar chiziqli bog‘liq va yagona kesishish nuqtasi mavjud emas.

Geometrik algoritmlarda koordinata turi va sonli xatolarni tanlash juda muhim. Butun koordinatalarda orientatsiya va kesishish shartlarini imkon qadar `long long` yoki kengroq butun turda hisoblash kerak. Haqiqiy sonlarda esa tenglik o‘rniga masala o‘lchamiga mos `EPS` bilan taqqoslash qo‘llanadi.

