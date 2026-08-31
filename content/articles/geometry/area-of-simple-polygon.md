---
article_id: geometry--area-of-simple-polygon
---
# Sodda ko‘pburchak yuzi

Tekislikda uchlari $p_0,p_1,\dots,p_{n-1}$ bo‘lgan sodda ko‘pburchak berilgan. “Sodda” degani uning chegarasi o‘zini kesmaydi. Uchlar chegara bo‘ylab ketma-ket, soat mili bo‘yicha yoki unga teskari tartibda berilgan. Ko‘pburchak yuzini $O(n)$ vaqtda topish kerak.

## Trapesiyalar orqali formula

Har bir yo‘nalgan qirra $(p_i,p_{i+1})$ bilan $Ox$ o‘qi orasidagi yo‘nalgan trapesiya yuzini ko‘ramiz. $p_i=(x_i,y_i)$ va $p_{i+1}=(x_{i+1},y_{i+1})$ bo‘lsa, uning yo‘nalgan yuzi

$$
\frac{(x_i-x_{i+1})(y_i+y_{i+1})}{2}
$$

ga teng. Chegara bo‘ylab barcha qirralarning hissasini qo‘shganda ko‘pburchak tashqarisidagi qismlar qarama-qarshi ishoralar bilan bekor bo‘ladi, ichki qism esa bir marta qoladi.

Demak,

$$
S=\frac12\left|\sum_{i=0}^{n-1}
(x_i-x_{i+1})(y_i+y_{i+1})\right|,
$$

bu yerda indekslar modul $n$ bo‘yicha olinadi.

## Shoelace formulasi

Yuqoridagi ifodani ochib va siklik yig‘indilarni qayta guruhlab, mashhur “shoelace” formulasiga kelamiz:

$$
2S=\left|\sum_{i=0}^{n-1}
(x_i y_{i+1}-y_i x_{i+1})\right|.
$$

Bu har bir ketma-ket radius-vektor juftining vektor ko‘paytmalari yig‘indisidir:

$$
2S=\left|\sum_{i=0}^{n-1} p_i\times p_{i+1}\right|.
$$

Modul olinmasa, natija yo‘nalgan yuza bo‘ladi. Soat miliga teskari tartib odatiy koordinata sistemasida musbat, soat mili bo‘yicha tartib manfiy qiymat beradi.

## Implementatsiya

```cpp
struct point {
    long long x, y;
};

long long doubled_signed_area(const vector<point>& p) {
    long long area = 0;
    for (int i = 0; i < (int)p.size(); ++i) {
        int j = (i + 1) % p.size();
        area += p[i].x * p[j].y - p[i].y * p[j].x;
    }
    return area;
}

double polygon_area(const vector<point>& p) {
    return abs(doubled_signed_area(p)) / 2.0;
}
```

Katta koordinatalarda yig‘indi va ko‘paytmalar uchun `__int128` kerak bo‘lishi mumkin:

```cpp
__int128 doubled_signed_area128(const vector<point>& p) {
    __int128 area = 0;
    for (int i = 0; i < (int)p.size(); ++i) {
        int j = (i + 1) % p.size();
        area += (__int128)p[i].x * p[j].y
              - (__int128)p[i].y * p[j].x;
    }
    return area;
}
```

Agar koordinatalar haqiqiy bo‘lsa, `long double` ishlatilishi va yig‘ish xatosini kamaytirish uchun Kahan summation kabi usullar ko‘rib chiqilishi mumkin.

## Uchburchaklarga ajratish

Istalgan $q$ nuqtani tanlab,

$$
\sum_{i=0}^{n-1}(p_i-q)\times(p_{i+1}-q)
$$

yig‘indini hisoblash ham xuddi shu natijani beradi. Har bir had $q,p_i,p_{i+1}$ uchburchagining ikki baravar yo‘nalgan yuzidir. $q$ ko‘pburchak ichida bo‘lishi shart emas; tashqaridagi uchburchaklar yo‘nalgan ishoralar yordamida to‘g‘ri bekor bo‘ladi.

## To‘g‘rilik

Har bir qirra va koordinatalar boshi hosil qiladigan yo‘nalgan uchburchak yuzasi $\frac12(p_i\times p_{i+1})$. Chegara bo‘ylab yig‘ilganda ichki qismning orientatsiyasi bir xil, tashqi ortiqcha qismlar esa qo‘shni qirralardan qarama-qarshi ishorada keladi. Natijada aynan ko‘pburchakning yo‘nalgan yuzi qoladi.

## Murakkablik

Bitta sikl bajariladi: vaqt $O(n)$, qo‘shimcha xotira $O(1)$.

