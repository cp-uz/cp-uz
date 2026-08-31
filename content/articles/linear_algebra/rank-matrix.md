---
article_id: linear_algebra--rank-matrix
---
# Matritsa rangini topish

**Matritsa rangi** — uning chiziqli mustaqil satrlari yoki, unga teng ravishda, chiziqli mustaqil ustunlarining eng katta soni. Rang tushunchasi faqat kvadrat matritsalar uchun emas, istalgan to‘g‘ri to‘rtburchak matritsa uchun aniqlanadi.

Yana bir teng kuchli ta’rif: matritsa rangi undagi noldan farqli minorlarning eng katta tartibidir.

$A$ matritsa $N\times M$ o‘lchamli bo‘lsin. Uning rangi hech qachon $\min(N,M)$ dan katta bo‘lmaydi. Kvadrat matritsada determinant noldan farqli bo‘lsa, rang $N$ ga teng; determinant nol bo‘lsa, rang $N$ dan kichik.

## Gauss eliminatsiyasiga asoslangan algoritm

Rangni [Gauss eliminatsiyasi](linear-system-gauss.md) yordamida topish mumkin. Sistemani yechish yoki determinant hisoblashdagi kabi elementar satr amallari bajariladi. Har bir ustun uchun hali tayanch sifatida ishlatilmagan, joriy ustundagi elementi noldan farqli satr qidiriladi.

Bunday satr topilsa:

1. u yangi tayanch satr sifatida belgilanadi;
2. `rank` birga oshiriladi;
3. tayanch satr yordamida boshqa barcha satrlardagi joriy ustun elementi yo‘qotiladi.

Tayanch topilmasa, bu ustun oldingi ustunlarga chiziqli bog‘liq bo‘lib, tashlab ketiladi. Algoritm boshida rang nolga teng. Jarayon tugagach, topilgan tayanchlar soni matritsa rangidir.

Suzuvchi nuqtali matritsada sonni nol bilan bevosita solishtirish o‘rniga `EPS` aniqlik ishlatiladi. Sonli barqarorlik muhim bo‘lgan vaziyatda joriy ustundagi moduli eng katta elementni tayanch qilib olish ma’qul; quyidagi ixcham implementatsiya esa birinchi mos satrni oladi.

## Nima uchun tayanchlar soni rangga teng?

Elementar satr amallari satrlar orasidagi chiziqli bog‘liqlikni o‘zgartirmaydi, demak matritsa rangini ham o‘zgartirmaydi. Har yangi tayanch avvalgi tayanch ustunlarda nolga, o‘z ustunida esa noldan farqli qiymatga ega bo‘ladi. Shu sabab tayanch satrlar o‘zaro chiziqli mustaqil.

Boshqa tomondan, tayanch topilmagan har bir ustun avvalgi tayanchlar orqali ifodalanadi. Eliminatsiyadan keyin qolgan barcha satrlar tayanch satrlarning chiziqli kombinatsiyasidir. Demak, mustaqil satrlar soni topilgan tayanchlar sonidan katta ham, kichik ham bo‘la olmaydi.

## C++ implementatsiyasi

```cpp
const double EPS = 1E-9;

int compute_rank(vector<vector<double>> A) {
    int n = (int)A.size();
    int m = (int)A[0].size();

    int rank = 0;
    vector<bool> row_selected(n, false);

    for (int i = 0; i < m; ++i) {
        int j;
        for (j = 0; j < n; ++j) {
            if (!row_selected[j] && abs(A[j][i]) > EPS)
                break;
        }

        if (j != n) {
            ++rank;
            row_selected[j] = true;

            for (int p = i + 1; p < m; ++p)
                A[j][p] /= A[j][i];

            for (int k = 0; k < n; ++k) {
                if (k != j && abs(A[k][i]) > EPS) {
                    for (int p = i + 1; p < m; ++p)
                        A[k][p] -= A[j][p] * A[k][i];
                }
            }
        }
    }

    return rank;
}
```

`A` qiymat bo‘yicha uzatilgani sabab kirish matritsasi o‘zgarmaydi. `row_selected[j]` satr allaqachon tayanch bo‘lganini saqlaydi. Kod tayanch elementning o‘zini birga aylantirmaydi, lekin undan keyingi elementlarni tayanchga bo‘ladi; eliminatsiya uchun aynan shu qiymatlar yetarli.

## Murakkablik

Har bir $M$ ustun uchun ko‘pi bilan $N$ satr ko‘riladi va tayanch topilganda $N\times M$ gacha element yangilanadi. Umumiy vaqt murakkabligi

$$O(\min(N,M)\cdot N\cdot M),$$

kvadrat matritsa uchun esa $O(N^3)$. Matritsa nusxasi $O(NM)$ xotira, tanlangan satrlar massivi $O(N)$ qo‘shimcha xotira talab qiladi.

## Mashq masalalari

- [Timus 1041 — Nikifor](http://acm.timus.ru/problem.aspx?space=1&num=1041)
