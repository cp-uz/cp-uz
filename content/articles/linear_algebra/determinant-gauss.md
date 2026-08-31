---
article_id: linear_algebra--determinant-gauss
---
# Determinantni Gauss usuli bilan hisoblash

$N\times N$ o‘lchamli $A$ matritsa berilgan. Uning determinantini hisoblash kerak.

## Algoritm

Yechim [chiziqli tenglamalar sistemasini yechishdagi Gauss usuli](linear-system-gauss.md) g‘oyalariga asoslanadi.

Matritsaga sistemani yechishdagi kabi elementar satr amallari qo‘llanadi, ammo joriy satr tayanch $a_{ii}$ elementga to‘liq bo‘linmaydi. Bir satrdan boshqa satrning ko‘paytmasini ayirish determinant qiymatini o‘zgartirmaydi. Ikki satr o‘rni almashtirilganda esa determinant ishorasi teskarilanadi.

Gauss eliminatsiyasidan keyin matritsa yuqori uchburchak ko‘rinishga keladi. Uchburchak matritsa determinanti bosh diagonaldagi elementlar ko‘paytmasiga teng. Demak, javob diagonal ko‘paytmasidan va nechta satr almashtirilganidan olinadi: almashtirishlar soni toq bo‘lsa, ishora o‘zgartiriladi.

Joriy ustunda noldan farqli tayanch topilmasa, matritsa buzilgan va uning determinanti $0$ ga teng. Suzuvchi nuqtali sonlarda nolni bevosita emas, `EPS` aniqlik bilan tekshirish va sonli barqarorlik uchun moduli eng katta tayanchni tanlash kerak.

## Nima uchun ishlaydi?

Har bir eliminatsiya qadami $R_j \leftarrow R_j-cR_i$ ko‘rinishida bo‘lib, determinantni o‘zgartirmaydi. Satrlar o‘rnini almashtirish determinantni $-1$ ga ko‘paytiradi. Eliminatsiya oxiridagi uchburchak matritsa uchun determinant diagonal elementlar ko‘paytmasidir. Kod har bir satr almashtirish ishorasini va har bir tayanchni `det` ichida saqlagani sabab yakuniy qiymat boshlang‘ich matritsa determinantiga teng bo‘ladi. Biror ustunda tayanch topilmasa, satrlar chiziqli bog‘liq bo‘ladi va determinant nolga teng.

## Murakkablik

Tashqi sikl $N$ marta ishlaydi; har qadamda tayanch qidirish $O(N)$, qolgan satr va ustunlarni yangilash $O(N^2)$ turadi. Umumiy vaqt murakkabligi $O(N^3)$. Matritsa joyida o‘zgartirilgani uchun, kirish matritsasidan tashqari, qo‘shimcha xotira sarfi $O(1)$.

## C++ implementatsiyasi

```cpp
const double EPS = 1E-9;
int n;
vector<vector<double>> a(n, vector<double>(n));

double det = 1;
for (int i = 0; i < n; ++i) {
    int k = i;
    for (int j = i + 1; j < n; ++j)
        if (abs(a[j][i]) > abs(a[k][i]))
            k = j;

    if (abs(a[k][i]) < EPS) {
        det = 0;
        break;
    }

    swap(a[i], a[k]);
    if (i != k)
        det = -det;

    det *= a[i][i];
    for (int j = i + 1; j < n; ++j)
        a[i][j] /= a[i][i];

    for (int j = 0; j < n; ++j)
        if (j != i && abs(a[j][i]) > EPS)
            for (int k = i + 1; k < n; ++k)
                a[j][k] -= a[i][k] * a[j][i];
}

cout << det;
```

Har bir $i$-qadamda kod $i$-ustundagi moduli eng katta elementni topadi. Tayanch deyarli nol bo‘lsa, javob darhol nol qilinadi. Aks holda satrlar almashtiriladi, determinant ishorasi yangilanadi, tayanch javobga ko‘paytiriladi va qolgan satrlardagi joriy ustun yo‘qotiladi.

Butun sonli matritsada `double` yaxlitlash xatosi nojo‘ya bo‘lsa, masala shartiga qarab aniq kasrlar, modul arifmetikasi yoki bo‘lishsiz Bareiss algoritmi kabi usullar afzal bo‘lishi mumkin.

## Mashq masalalari

- [Codeforces 167E — Wizards and Bets](http://codeforces.com/contest/167/problem/E)
