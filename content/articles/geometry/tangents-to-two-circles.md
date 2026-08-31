---
article_id: geometry--tangents-to-two-circles
---
# Ikki aylanaga umumiy urinmalar

Ikki aylana berilgan. Ikkalasiga bir vaqtda urinadigan barcha to‘g‘ri chiziqlarni topish kerak. Algoritm aylanalardan biri yoki ikkalasi radiusi nol bo‘lgan nuqtaga degeneratsiyalangan holatda ham ishlaydi; shu sababli u berilgan nuqtadan aylanaga urinmalarni topish uchun ham qo‘llanadi.

## Umumiy urinmalar soni

Ikki aylananing umumiy urinmalari soni $0,1,2,3,4$ yoki cheksiz bo‘lishi mumkin. Ustma-ust tushgan aylanalar cheksiz ko‘p umumiy urinmaga ega. Bir aylana ikkinchisining ichida yotsa, odatda umumiy urinma yo‘q; ichki tomondan tegsa bitta urinma mavjud.

Umumiy holatda to‘rtta urinma bo‘ladi: ikkita tashqi va ikkita ichki urinma. Aylanalar tegishganda ayrim urinmalar ustma-ust tushadi, shuning uchun turli geometrik chiziqlar soni uch yoki bittaga kamayishi mumkin. Quyidagi algebraik algoritm to‘rtta ishora kombinatsiyasini ko‘radi; degenerativ holatda qaytarilgan ayrim chiziqlar bir xil bo‘lishi mumkin.

## Algoritm

Soddalik uchun birinchi aylana markazini $(0,0)$ ga siljitamiz. Uning radiusi $r_1$, ikkinchi aylana markazi $v=(v_x,v_y)$ va radiusi $r_2$ bo‘lsin. Izlanayotgan chiziq

$$
ax+by+c=0
$$

ko‘rinishda va normallashgan:

$$
a^2+b^2=1.
$$

Chiziqning koordinatalar boshigacha masofasi $|c|$, ikkinchi markazgacha masofasi esa $|av_x+bv_y+c|$. Urinmalik shartlari:

$$
|c|=r_1,
\qquad
|av_x+bv_y+c|=r_2.
$$

Modullarni to‘rtta usulda ochamiz. $d_1=\pm r_1$, $d_2=\pm r_2$ deb olsak,

$$
a^2+b^2=1,
\qquad c=d_1,
\qquad av_x+bv_y+c=d_2.
$$

$r=d_2-d_1$ va $z=v_x^2+v_y^2$ belgilashlardan keyin yechimlardan bir oilasi:

$$
a=\frac{rv_x+v_y\sqrt{z-r^2}}{z},
\qquad
b=\frac{rv_y-v_x\sqrt{z-r^2}}{z},
\qquad c=d_1.
$$

$z-r^2<0$ bo‘lsa, shu ishora kombinatsiyasi uchun urinma mavjud emas. Kvadrat ildiz nol bo‘lsa, ikkita algebraik yechim bitta chiziqqa birlashadi.

Asl birinchi markaz $(x_0,y_0)$ bo‘lsa, koordinatalarni orqaga siljitish uchun

$$
c\leftarrow c-a x_0-b y_0
$$

qilinadi.

## Implementatsiya

```cpp
struct pt {
    double x, y;

    pt operator-(pt p) {
        pt res = {x - p.x, y - p.y};
        return res;
    }
};

struct circle : pt {
    double r;
};

struct line {
    double a, b, c;
};

const double EPS = 1E-9;

double sqr(double a) {
    return a * a;
}
```

Yordamchi funksiya bitta $(d_1,d_2)$ ishora kombinatsiyasiga mos urinmani qo‘shadi:

```cpp
void tangents(pt c, double r1, double r2, vector<line>& ans) {
    double r = r2 - r1;
    double z = sqr(c.x) + sqr(c.y);
    double d = z - sqr(r);
    if (d < -EPS)
        return;
    d = sqrt(abs(d));
    line l;
    l.a = (c.x * r + c.y * d) / z;
    l.b = (c.y * r - c.x * d) / z;
    l.c = r1;
    ans.push_back(l);
}
```

Asosiy funksiya radiuslarning barcha ishora variantlarini ko‘radi va chiziqlarni asl koordinatalarga qaytaradi:

```cpp
vector<line> tangents(circle a, circle b) {
    vector<line> ans;
    for (int i = -1; i <= 1; i += 2)
        for (int j = -1; j <= 1; j += 2)
            tangents(b - a, a.r * i, b.r * j, ans);
    for (size_t i = 0; i < ans.size(); ++i)
        ans[i].c -= ans[i].a * a.x + ans[i].b * a.y;
    return ans;
}
```

Agar markazlar ustma-ust tushsa, `z == 0` bo‘lib, formulada bo‘lish mumkin emas. Bu holat alohida tekshiriladi: radiuslar teng bo‘lsa cheksiz ko‘p urinma, teng bo‘lmasa umumiy urinma yo‘q.

Degenerativ holatlarda bir xil chiziq bir necha marta chiqishi mumkin. Faqat turli geometrik chiziqlar kerak bo‘lsa, normallashtirilgan koeffitsiyentlarni `EPS` bilan taqqoslab takrorlarini olib tashlash lozim.

## Amaliy masala

* [TIMUS 1163 — Chapaev](https://acm.timus.ru/problem.aspx?space=1&num=1163)

