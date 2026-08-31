---
article_id: geometry--check-segments-intersection
---
# Ikki kesma kesishishini tekshirish

$(a,b)$ va $(c,d)$ kesmalar berilgan. Ular kamida bitta umumiy nuqtaga egami, shuni tekshirish kerak. Kesishish nuqtasining o‘zini topish shart emas. Butun koordinatalarda ishlaydigan usul ayniqsa qulay, chunki barcha tekshiruvlar vektor ko‘paytma va bir o‘lchamli oraliqlar kesishishiga keltiriladi.

## Algoritm

Avval kesmalar bir chiziqda yotadigan holatni ko‘ramiz. Agar $a,b,c,d$ kollinear bo‘lsa, kesmalar kesishishi uchun ularning $Ox$ o‘qidagi proyeksiyalari ham, $Oy$ o‘qidagi proyeksiyalari ham kesishishi yetarli va zarur.

Kollinear bo‘lmagan holatda $a$ va $b$ nuqtalar $(c,d)$ chiziqning qat’iy bir tomonida yotmasligi, shu bilan birga $c$ va $d$ nuqtalar $(a,b)$ chiziqning qat’iy bir tomonida yotmasligi kerak. Tomonlar orientatsiya qiymatlari bilan aniqlanadi:

$$
\operatorname{orient}(a,b,p)=(b-a)\times(p-a).
$$

Shuning uchun umumiy shart:

$$
\operatorname{sgn}(\operatorname{orient}(a,b,c))
\ne
\operatorname{sgn}(\operatorname{orient}(a,b,d))
$$

va

$$
\operatorname{sgn}(\operatorname{orient}(c,d,a))
\ne
\operatorname{sgn}(\operatorname{orient}(c,d,b)).
$$

Nol qiymat kesma uchining boshqa kesma chizig‘ida yotishini bildiradi va tegish holatini ham kesishish deb hisoblash imkonini beradi.

## Implementatsiya

Quyidagi kod butun koordinatalar uchun yozilgan. Koordinatalar ko‘paytmasi `long long` diapazonidan chiqmasligi kerak; katta chegaralarda `__int128` ishlatiladi.

```cpp
struct pt {
    long long x, y;
    pt() {}
    pt(long long _x, long long _y) : x(_x), y(_y) {}
    pt operator-(const pt& p) const { return pt(x - p.x, y - p.y); }
    long long cross(const pt& p) const { return x * p.y - y * p.x; }
    long long cross(const pt& a, const pt& b) const {
        return (a - *this).cross(b - *this);
    }
};

int sgn(const long long& x) {
    return x >= 0 ? x ? 1 : 0 : -1;
}

bool inter1(long long a, long long b, long long c, long long d) {
    if (a > b)
        swap(a, b);
    if (c > d)
        swap(c, d);
    return max(a, c) <= min(b, d);
}

bool check_inter(const pt& a, const pt& b,
                 const pt& c, const pt& d) {
    if (c.cross(a, d) == 0 && c.cross(b, d) == 0)
        return inter1(a.x, b.x, c.x, d.x) &&
               inter1(a.y, b.y, c.y, d.y);
    return sgn(a.cross(b, c)) != sgn(a.cross(b, d)) &&
           sgn(c.cross(d, a)) != sgn(c.cross(d, b));
}
```

`inter1` yopiq oraliqlar kesishishini tekshiradi. `<=` ishlatilgani sababli faqat bitta umumiy uchga ega kesmalar ham kesishuvchi deb olinadi.

## To‘g‘rilik asoslanishi

Agar kesmalar kollinear bo‘lsa, ularning har biri bitta chiziqdagi yopiq intervaldir. Ikki o‘lchamli koordinatalardan kamida bittasi chiziq bo‘ylab qat’iy o‘zgaradi; ikkala koordinata proyeksiyasining kesishishi umumiy nuqta mavjudligini aniq ifodalaydi.

Kollinear bo‘lmagan kesmalarda $(a,b)$ chiziq tekislikni ikki yarim tekislikka bo‘ladi. $(c,d)$ kesma bu chiziqni kesishi uchun uning uchlari turli yarim tekisliklarda yoki chiziqning o‘zida bo‘lishi kerak. Xuddi shu shart ikkinchi chiziq uchun ham bajarilganda kesmalar chiziqlar kesishgan nuqtaga ikkalasi ham yetib boradi. Shu sababli ikki juft orientatsiya ishorasi sharti zarur va yetarli.

## Murakkablik

Algoritm doimiy sondagi arifmetik amal bajaradi, ya’ni vaqt murakkabligi $O(1)$ va qo‘shimcha xotira $O(1)$.

