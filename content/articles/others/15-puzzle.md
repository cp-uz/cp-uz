---
article_id: others--15-puzzle
---
# 15 Puzzle o‘yini: yechim mavjudligini aniqlash

Bu o‘yin $4 \times 4$ katakli taxtada o‘ynaladi. Unda 1 dan 15 gacha raqamlangan 15 ta tosh bor, bitta katak esa bo‘sh qoladi va 0 bilan belgilanadi. Har safar toshlardan birini bo‘sh katakka surib, taxtani quyidagi holatga keltirish kerak:

$$\begin{matrix} 1 & 2 & 3 & 4 \\ 5 & 6 & 7 & 8 \\ 9 & 10 & 11 & 12 \\ 13 & 14 & 15 & 0 \end{matrix}$$

“15 Puzzle” o‘yinini 1880-yilda Noyes Chapman yaratgan.

## Yechim mavjudligi

Quyidagi masalani ko‘ramiz: taxtaning biror holati berilganida, uni maqsad holatiga olib boruvchi yurishlar ketma-ketligi mavjudligini aniqlash kerak.

Taxtada quyidagi holat berilgan bo‘lsin:

$$\begin{matrix} a_1 & a_2 & a_3 & a_4 \\ a_5 & a_6 & a_7 & a_8 \\ a_9 & a_{10} & a_{11} & a_{12} \\ a_{13} & a_{14} & a_{15} & a_{16} \end{matrix}$$

Bu yerda elementlardan biri nolga teng va bo‘sh katakni bildiradi: $a_z = 0$.

Nol elementini tashlab yuborib, taxtadagi joylashuvga mos quyidagi permutatsiyani ko‘ramiz:

$$a_1 a_2 \ldots a_{z-1} a_{z+1} \ldots a_{15} a_{16}$$

Bu permutatsiyadagi inversiyalar sonini $N$ deb belgilaymiz. Ya’ni $i < j$, ammo $a_i > a_j$ bo‘lgan $a_i$ va $a_j$ juftliklari soni $N$ ga teng.

Bo‘sh element joylashgan satr indeksini $K$ deylik. Bizning raqamlashimizda $K = (z - 1) \mathbin{\mathrm{div}} 4 + 1$.

U holda **yechim faqat va faqat $N + K$ juft bo‘lganda mavjud**.

## Amalga oshirish

Yuqoridagi algoritmni quyidagi dastur kodi bilan ifodalash mumkin:

```cpp
int a[16];
for (int i=0; i<16; ++i)
    cin >> a[i];

int inv = 0;
for (int i=0; i<16; ++i)
    if (a[i])
        for (int j=0; j<i; ++j)
            if (a[j] > a[i])
                ++inv;
for (int i=0; i<16; ++i)
    if (a[i] == 0)
        inv += 1 + i / 4;

puts ((inv & 1) ? "No Solution" : "Solution Exists");
```

## Isbot

1879-yilda Johnson $N + K$ toq bo‘lsa, yechim mavjud emasligini isbotlagan. O‘sha yili Story $N + K$ juft bo‘lgan barcha holatlarda yechim borligini isbotlagan.

Biroq bu isbotlarning barchasi ancha murakkab edi.

1999-yilda Archer ancha sodda isbot taklif qilgan; uning maqolasini [bu yerdan](http://www.cs.cmu.edu/afs/cs/academic/class/15859-f01/www/notes/15-puzzle.pdf) yuklab olish mumkin.

## Mashq masalalari

* [Hackerrank — N-puzzle](https://www.hackerrank.com/challenges/n-puzzle)
