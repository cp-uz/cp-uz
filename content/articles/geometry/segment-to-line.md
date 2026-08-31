---
article_id: geometry--segment-to-line
---
# Kesma uchun to‘g‘ri chiziq tenglamasini topish

Tekislikda uchlari $(x_1,y_1)$ va $(x_2,y_2)$ bo‘lgan kesma berilgan. Shu ikki nuqtadan o‘tuvchi cheksiz to‘g‘ri chiziqning

$$
ax+by+c=0
$$

ko‘rinishdagi tenglamasini topish talab qilinadi.

## Ikki nuqtadan chiziq tenglamasini chiqarish

Chiziq bo‘ylab yo‘nalish vektori

$$
\mathbf d=(x_2-x_1,\ y_2-y_1)
$$

bo‘ladi. Chiziqning normal vektori unga perpendikulyar bo‘lishi kerak. Masalan,

$$
\mathbf n=(y_1-y_2,\ x_2-x_1)
$$

vektorni olish mumkin, chunki

$$
(x_2-x_1)(y_1-y_2)+(y_2-y_1)(x_2-x_1)=0.
$$

Shuning uchun

$$
a=y_1-y_2,\qquad b=x_2-x_1.
$$

Chiziq birinchi nuqtadan o‘tishi uchun

$$
a x_1+b y_1+c=0,
$$

demak

$$
c=-a x_1-b y_1=x_1y_2-x_2y_1.
$$

Natijada tayyor formula:

$$
\boxed{
 a=y_1-y_2,\qquad
 b=x_2-x_1,\qquad
 c=x_1y_2-x_2y_1
}
$$

bo‘ladi.

Bu koeffitsiyentlarni istalgan nol bo‘lmagan songa bir vaqtda ko‘paytirish yoki bo‘lish chiziqni o‘zgartirmaydi. Masalan, $(a,b,c)$ va $(ka,kb,kc)$ bir xil geometrik chiziqni ifodalaydi.

## Butun koordinatalar uchun implementatsiya

Agar kirish koordinatalari butun bo‘lsa, koeffitsiyentlarni ham butun sonlarda hisoblash mumkin. Koordinatalar katta bo‘lishi mumkinligi sababli ko‘paytmalarga `long long` ishlatish ma’qul.

```cpp
struct point {
    long long x, y;
};

struct line {
    long long a, b, c;
};

line line_from_segment(point p, point q) {
    line l;
    l.a = p.y - q.y;
    l.b = q.x - p.x;
    l.c = p.x * q.y - q.x * p.y;
    return l;
}
```

Koeffitsiyentlarni kanonik ko‘rinishga keltirish kerak bo‘lsa, $g=\gcd(|a|,|b|,|c|)$ ga bo‘lish mumkin. So‘ng birinchi nol bo‘lmagan koeffitsiyent musbat bo‘lishi uchun uchalasining ishorasi bir vaqtda almashtiriladi. Bu chiziqlarni taqqoslash yoki `set`/`map` kaliti sifatida saqlashda qulay.

```cpp
line normalize(line l) {
    long long g = std::gcd(std::gcd(llabs(l.a), llabs(l.b)), llabs(l.c));
    if (g != 0) {
        l.a /= g;
        l.b /= g;
        l.c /= g;
    }
    if (l.a < 0 || (l.a == 0 && l.b < 0) ||
        (l.a == 0 && l.b == 0 && l.c < 0)) {
        l.a = -l.a;
        l.b = -l.b;
        l.c = -l.c;
    }
    return l;
}
```

## Maxsus holatlar

Agar ikkala uch bir xil nuqta bo‘lsa, $a=b=c=0$ chiqadi va bu to‘g‘ri chiziqni aniqlamaydi. Masala shartida kesma uzunligi musbat ekanini tekshirish yoki bu degenerativ holatni alohida qayta ishlash kerak.

Vertikal chiziqda $x_1=x_2$ bo‘ladi. Formula avtomatik ravishda $b=0$ va $a\ne0$ beradi; chiziq $x=x_1$ ko‘rinishga keladi. Gorizontal chiziqda esa $a=0$ bo‘lib, $y=y_1$ hosil bo‘ladi. Shu sababli qiyalik $k$ ishlatadigan $y=kx+b$ ko‘rinishidan farqli ravishda $ax+by+c=0$ barcha yo‘nalishlar uchun bir xil ishlaydi.

Nuqtaning chiziqning qaysi tomonida yotishini $ax+by+c$ iforasi ishorasi orqali aniqlash mumkin. Qiymat nol bo‘lsa nuqta chiziqda, musbat va manfiy qiymatlar esa chiziqning ikki turli tomonini bildiradi.

