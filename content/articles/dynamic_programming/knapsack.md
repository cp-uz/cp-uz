---
article_id: dynamic_programming--knapsack
---
# Ryukzak masalasi

Oldindan bilish tavsiya etiladi: [Dinamik dasturlashga kirish](https://cp-algorithms.com/dynamic_programming/intro-to-dp.html)

## Kirish

Quyidagi misolni ko‘rib chiqamiz:

### [[USACO07 Dec] Charm Bracelet](https://www.acmicpc.net/problem/6144)

$n$ ta turli buyum va sig‘imi $W$ bo‘lgan ryukzak bor. Har bir buyumning ikkita xususiyati mavjud: vazni ($w_{i}$) va qiymati ($v_{i}$).

Buyumlarning shunday qism to‘plamini tanlab ryukzakka joylashtirish kerakki, umumiy vazn $W$ sig‘imdan oshmasin va umumiy qiymat maksimal bo‘lsin.

Yuqoridagi misolda har bir buyum faqat ikkita holatdan birida bo‘lishi mumkin: tanlangan yoki tanlanmagan. Bu ikkilik 0 va 1 ga mos keladi. Shu sababli bunday masala “0-1 ryukzak masalasi” deb ataladi.

## 0-1 ryukzak

### Tushuntirish

Yuqoridagi masalaning kirish ma’lumotlari quyidagilardan iborat: $i$-buyumning vazni $w_{i}$, uning qiymati $v_{i}$ va ryukzakning umumiy sig‘imi $W$.

$f_{i, j}$ dinamik dasturlash holati faqat dastlabki $i$ ta buyum ko‘rib chiqilganda, sig‘imi $j$ bo‘lgan ryukzakka joylashtirish mumkin bo‘lgan maksimal umumiy qiymatni saqlasin.

Dastlabki $i-1$ ta buyumga tegishli barcha holatlar hisoblangan deb faraz qilaylik. $i$-buyum uchun qanday imkoniyatlar bor?

- Buyum ryukzakka qo‘yilmasa, qolgan sig‘im ham, umumiy qiymat ham o‘zgarmaydi. Demak, bu holdagi maksimal qiymat $f_{i-1, j}$ ga teng.
- Buyum ryukzakka qo‘yilsa, qolgan sig‘im $w_{i}$ ga kamayadi, umumiy qiymat esa $v_{i}$ ga oshadi. Demak, bu holdagi maksimal qiymat $f_{i-1, j-w_i} + v_i$ ga teng.

Bundan DP o‘tish formulasini hosil qilamiz:

$$f_{i, j} = \max(f_{i-1, j}, f_{i-1, j-w_i} + v_i)$$

Bundan tashqari, $f_{i}$ faqat $f_{i-1}$ ga bog‘liq bo‘lgani uchun birinchi o‘lchamni olib tashlashimiz mumkin. Natijada quyidagi o‘tish qoidasini olamiz:

$$f_j \gets \max(f_j, f_{j-w_i}+v_i)$$

Bu qoida $j$ ning **kamayib boruvchi** tartibida bajarilishi kerak. Shunda $f_{j-w_i}$ yashirin ravishda $f_{i,j-w_i}$ ga emas, aynan $f_{i-1,j-w_i}$ ga mos keladi.

**Bu o‘tish qoidasini tushunish juda muhim, chunki ryukzak masalalaridagi aksariyat o‘tishlar xuddi shu usulda keltirib chiqariladi.**

### Implementatsiya

Ta’riflangan algoritmni $O(nW)$ vaqtda quyidagicha amalga oshirish mumkin:

```.c++
for (int i = 1; i <= n; i++)
  for (int j = W; j >= w[i]; j--)
    f[j] = max(f[j], f[j - w[i]] + v[i]);
```

Bajarilish tartibiga yana bir bor e’tibor bering. Quyidagi invariantni saqlash uchun unga qat’iy rioya qilish zarur: $(i, j)$ juftligi qayta ishlanishidan oldin $k > j$ uchun $f_k$ qiymati $f_{i,k}$ ga, $k < j$ uchun esa $f_{i-1,k}$ ga mos keladi. Bu $f_{j-w_i}$ qiymati $i$-qadamdan emas, $(i-1)$-qadamdan olinishini ta’minlaydi.

## Cheksiz ryukzak

Cheksiz ryukzak modeli 0-1 ryukzakka o‘xshaydi. Yagona farq shundaki, har bir buyumni faqat bir marta emas, cheklanmagan miqdorda tanlash mumkin.

0-1 ryukzak g‘oyasidan foydalanib holatni shunday belgilaymiz: $f_{i, j}$ — dastlabki $i$ ta buyumdan foydalanib, maksimal sig‘im $j$ bo‘lgan ryukzakda olish mumkin bo‘lgan eng katta qiymat.

Holat ta’rifi 0-1 ryukzakdagi ta’rifga o‘xshash bo‘lsa-da, o‘tish qoidasi boshqacha ekaniga e’tibor berish kerak.

### Tushuntirish

Sodda yondashuvda dastlabki $i$ ta buyum uchun har bir buyum necha marta olinishini sanab chiqamiz. Buning vaqt murakkabligi $O(n^2W)$ bo‘ladi.

Bu quyidagi o‘tish formulasini beradi:

$$f_{i, j} = \max\limits_{k=0}^{\infty}(f_{i-1, j-k\cdot w_i} + k\cdot v_i)$$

Ayni paytda uni quyidagi “yassi” formulaga soddalashtirish mumkin:

$$f_{i, j} = \max(f_{i-1, j},f_{i, j-w_i} + v_i)$$

Buning sababi shundaki, $f_{i, j-w_i}$ qiymati allaqachon $f_{i, j-2\cdot w_i}$ va undan oldingi holatlar orqali yangilangan bo‘ladi.

0-1 ryukzakdagi kabi, xotira murakkabligini optimallashtirish uchun birinchi o‘lchamni olib tashlash mumkin. Natijada 0-1 ryukzakdagi bilan bir xil o‘tish qoidasini olamiz:

$$f_j \gets \max(f_j, f_{j-w_i}+v_i)$$

### Implementatsiya

Ta’riflangan algoritmni $O(nW)$ vaqtda quyidagicha amalga oshirish mumkin:

```.c++
for (int i = 1; i <= n; i++)
  for (int j = w[i]; j <= W; j++)
    f[j] = max(f[j], f[j - w[i]] + v[i]);
```

O‘tish formulasi bir xil bo‘lishiga qaramay, yuqoridagi kod 0-1 ryukzak uchun noto‘g‘ri.

Kodga sinchiklab qarasak, hozir qayta ishlanayotgan $i$-buyum va joriy $f_{i,j}$ holati uchun $j\geqslant w_{i}$ bo‘lganda, $f_{i,j}$ ga $f_{i,j-w_{i}}$ ta’sir qilishini ko‘ramiz. Bu $i$-buyumni ryukzakka bir necha marta qo‘yish imkoniga teng. Aynan shu xususiyat cheksiz ryukzakka mos keladi, 0-1 ryukzakka emas.

## Cheklangan sonli ryukzak

Cheklangan sonli ryukzak ham 0-1 ryukzakning bir variantidir. Asosiy farq shundaki, har bir buyumdan atigi 1 ta emas, $k_i$ ta nusxa mavjud.

### Tushuntirish

Juda sodda g‘oya: “har bir buyumni $k_i$ marta tanlash” — “bir xil buyumning $k_i$ ta nusxasini bittadan tanlash” bilan teng. Shunday qilib masalani 0-1 ryukzak modeliga aylantirish mumkin. Uning o‘tish funksiyasi:

$$f_{i, j} = \max_{k=0}^{k_i}(f_{i-1,j-k\cdot w_i} + k\cdot v_i)$$

Bu jarayonning vaqt murakkabligi $O(W\sum\limits_{i=1}^{n}k_i)$.

### Ikkilik guruhlash optimallashtirishi

Optimallashtirish uchun cheklangan sonli ryukzak modelini yana 0-1 ryukzak modeliga aylantiramiz. Yuqoridagi yondashuv bilan $O(Wn)$ qismini bundan ortiq yaxshilab bo‘lmaydi, shuning uchun $O(\sum k_i)$ qismiga e’tibor qaratamiz.

$A_{i, j}$ — $i$-buyumni bo‘lish natijasida hosil qilingan $j$-buyumni bildirsin. Yuqoridagi sodda yondashuvda barcha $j \leq k_i$ uchun $A_{i, j}$ bir xil buyumning bittadan nusxasini anglatadi. Samaradorlikning past bo‘lishiga asosiy sabab — juda ko‘p takroriy ish bajarishimiz. Masalan, $\{A_{i, 1},A_{i, 2}\}$ ni tanlash bilan $\{A_{i, 2}, A_{i, 3}\}$ ni tanlash mutlaqo teng holatlardir. Demak, bo‘lish usulini optimallashtirish vaqt murakkabligini ancha kamaytiradi.

Guruhlashni samaraliroq qilish uchun ikkilik guruhlashdan foydalaniladi.

Aniqrog‘i, $A_{i, j}$ o‘zida $2^j$ ta alohida buyumni saqlaydi ($j\in[0,\lfloor \log_2(k_i+1)\rfloor-1]$). Agar $k_i + 1$ soni 2 ning butun darajasi bo‘lmasa, yetishmayotgan qismini to‘ldirish uchun hajmi $k_i-(2^{\lfloor \log_2(k_i+1)\rfloor}-1)$ bo‘lgan yana bir guruh ishlatiladi.

Yuqoridagi bo‘lish usuli yordamida bir nechta $A_{i, j}$ guruhini tanlab, $k_i$ dan oshmaydigan istalgan miqdordagi buyumni hosil qilish mumkin. Har bir buyum shu tarzda bo‘lingach, masalaning yangi ko‘rinishini oddiy 0-1 ryukzak usuli bilan yechish kifoya.

Bu optimallashtirish $O(W\sum\limits_{i=1}^{n}\log k_i)$ vaqt murakkabligini beradi.

### Implementatsiya

```c++
index = 0;
for (int i = 1; i <= n; i++) {
  int c = 1, p, h, k;
  cin >> p >> h >> k;
  while (k > c) {
    k -= c;
    list[++index].w = c * p;
    list[index].v = c * h;
    c *= 2;
  }
  list[++index].w = p * k;
  list[index].v = h * k;
}
```

### Monoton navbat bilan optimallashtirish

Bu optimallashtirishda ryukzak masalasini [maksimum navbat](https://cp-algorithms.com/data_structures/stack_queue_modification.html) masalasiga aylantirishga harakat qilamiz.

Tavsifni qulaylashtirish uchun $g_{x, y} = f_{i, x \cdot w_i + y} ,\space g'_{x, y} = f_{i-1, x \cdot w_i + y}$ deb belgilaymiz. Shunda o‘tish qoidasini quyidagicha yozish mumkin:

$$g_{x, y} = \max_{k=0}^{k_i}(g'_{x-k, y} + v_i \cdot k)$$

Endi $G_{x, y} = g'_{x, y} - v_i \cdot x$ deb olamiz. O‘tish qoidasining yangi ko‘rinishi:

$$g_{x, y} \gets \max_{k=0}^{k_i}(G_{x-k, y}) + v_i \cdot x$$

Bu klassik monoton navbat optimallashtirishi ko‘rinishiga keladi. $G_{x, y}$ ni $O(1)$ vaqtda hisoblash mumkin, shuning uchun qat’iy belgilangan $y$ uchun $g_{x, y}$ qiymatlarini $O(\lfloor \frac{W}{w_i} \rfloor)$ vaqtda topamiz.

Demak, barcha $g_{x, y}$ qiymatlarini topish murakkabligi $O(\lfloor \frac{W}{w_i} \rfloor) \times O(w_i) = O(W)$ bo‘ladi.

Shu tariqa algoritmning umumiy murakkabligi $O(nW)$ gacha kamayadi.

## Aralash ryukzak

Aralash ryukzak masalasi yuqorida tavsiflangan uch turdagi masalalarning birikmasidir. Ya’ni ayrim buyumlarni faqat bir marta, ayrimlarini cheksiz marta, boshqalarini esa ko‘pi bilan $k$ marta olish mumkin.

Masala murakkab ko‘rinishi mumkin, ammo avvalgi ryukzak turlarining asosiy g‘oyalarini tushunib, ularni birlashtirsangiz, yechim sodda bo‘ladi. Yechimning psevdokodi:

```c++
for (each item) {
  if (0-1 knapsack)
    Apply 0-1 knapsack code;
  else if (complete knapsack)
    Apply complete knapsack code;
  else if (multiple knapsack)
    Apply multiple knapsack code;
}
```

## Amaliy masalalar

- [Atcoder: Knapsack-1](https://atcoder.jp/contests/dp/tasks/dp_d)
- [Atcoder: Knapsack-2](https://atcoder.jp/contests/dp/tasks/dp_e)
- [LeetCode - 494. Target Sum](https://leetcode.com/problems/target-sum)
- [LeetCode - 416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum)
- [LeetCode - 474. Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes)
- [CSES: Book Shop II](https://cses.fi/problemset/task/1159)
- [DMOJ: Knapsack-3](https://dmoj.ca/problem/knapsack)
- [DMOJ: Knapsack-4](https://dmoj.ca/problem/knapsack4)

