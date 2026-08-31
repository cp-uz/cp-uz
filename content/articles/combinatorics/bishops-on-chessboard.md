---
article_id: combinatorics--bishops-on-chessboard
---
# Shaxmat taxtasiga fillarni joylashtirish

$N\times N$ o‘lchamli shaxmat taxtasiga hech qaysi ikkita fil bir-biriga hujum qilmaydigan qilib $K$ ta filni joylashtirish usullari sonini toping.

## Algoritm

Bu masalani dinamik dasturlash yordamida yechish mumkin.

Shaxmat taxtasining diagonallarini quyidagicha raqamlaymiz: qora diagonallarga toq indekslar, oq diagonallarga juft indekslar beriladi; har bir rang ichida diagonallar ulardagi kataklar soni kamaymaydigan tartibda raqamlanadi. Quyida $5\times5$ taxta uchun misol keltirilgan:

$$\begin{matrix}
\bf{1} & 2 & \bf{5} & 6 & \bf{9} \\
2 & \bf{5} & 6 & \bf{9} & 8 \\
\bf{5} & 6 & \bf{9} & 8 & \bf{7} \\
6 & \bf{9} & 8 & \bf{7} & 4 \\
\bf{9} & 8 & \bf{7} & 4 & \bf{3} \\
\end{matrix}$$

`D[i][j]` — indeksi `i` dan katta bo‘lmagan va `i`-diagonal bilan bir xil rangdagi diagonallarga `j` ta filni joylashtirish usullari soni bo‘lsin.

Bu yerda `i = 1...2N-1` va `j = 0...K`.

`D[i][j]` ni faqat `D[i-2]` qiymatlaridan foydalanib hisoblash mumkin. Indeksdan 2 ayirishimizning sababi — faqat `i` bilan bir xil rangdagi diagonallarni ko‘rib chiqishimiz.

`D[i][j]` qiymatini hosil qilishning ikki yo‘li bor:

1. Barcha `j` ta filni oldingi diagonallarga joylashtiramiz. Buning `D[i-2][j]` ta usuli bor.
2. `i`-diagonalga bitta fil, oldingi diagonallarga esa `j-1` ta fil joylashtiramiz. Buning usullari soni `i`-diagonaldagi kataklar sonidan `j-1` ni ayirishga teng, chunki oldingi diagonallarga qo‘yilgan `j-1` ta filning har biri joriy diagonaldagi bittadan katakni band qiladi.

`i`-diagonaldagi kataklar sonini quyidagicha hisoblash mumkin:

```cpp
int squares (int i) {
    if (i & 1)
        return i / 4 * 2 + 1;
    else
        return (i - 1) / 4 * 2 + 2;
}
```

Boshlang‘ich holatlar sodda: `D[i][0] = 1` va `D[1][1] = 1`.

Barcha `D[i][j]` qiymatlarini hisoblaganimizdan so‘ng javobni quyidagicha olamiz. Qora diagonallarga joylashtirilgan fillar sonining barcha `i=0...K` qiymatlarini ko‘rib chiqamiz; shunda oq diagonallardagi fillar soni `K-i` bo‘ladi.

Qora va oq diagonallarga qo‘yilgan fillar bir-biriga hech qachon hujum qilmaydi, shuning uchun bu joylashtirishlarni mustaqil bajarish mumkin. Oxirgi qora diagonal indeksi `2N-1`, oxirgi oq diagonal indeksi esa `2N-2`.

Har bir `i` uchun javobga

```text
D[2N-1][i] * D[2N-2][K-i]
```

qiymatini qo‘shamiz.

## Implementatsiya

```cpp
int bishop_placements(int N, int K)
{
    if (K > 2 * N - 1)
        return 0;

    vector<vector<int>> D(N * 2, vector<int>(K + 1));
    for (int i = 0; i < N * 2; ++i)
        D[i][0] = 1;
    D[1][1] = 1;
    for (int i = 2; i < N * 2; ++i)
        for (int j = 1; j <= K; ++j)
            D[i][j] = D[i-2][j] + D[i-2][j-1] * (squares(i) - j + 1);

    int ans = 0;
    for (int i = 0; i <= K; ++i)
        ans += D[N*2-1][i] * D[N*2-2][K-i];
    return ans;
}
```

