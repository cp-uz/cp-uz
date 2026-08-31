---
article_id: num_methods--binary_search
---
# Ikkilik qidiruv

**Ikkilik qidiruv** qidiruv oralig‘ini har qadamda ikki qismga bo‘lib, kerakli chegarani tez topish usulidir. Uning eng mashhur qo‘llanishi tartiblangan massivdan qiymat izlash, ammo oraliqni ikkiga ajratish g‘oyasi ko‘plab boshqa masalalarda ham ishlaydi.

## Tartiblangan massivda qidirish

$$A_0\le A_1\le\dots\le A_{n-1}$$

ko‘rinishida tartiblangan massiv va $k$ qiymat berilgan bo‘lsin. $k$ massivda bor-yo‘qligini tekshirish kerak. Barcha elementlarni ketma-ket solishtiradigan chiziqli qidiruv $O(n)$ vaqt oladi va massiv tartiblanganidan foydalanmaydi.

![Massivdan 7 qiymatini ikkilik qidiruv bilan topish](https://upload.wikimedia.org/wikipedia/commons/8/83/Binary_Search_Depiction.svg)

*Tasvir: [AlwaysAngry](https://commons.wikimedia.org/wiki/User:AlwaysAngry), [Wikimedia Commons’dagi original fayl](https://commons.wikimedia.org/wiki/File:Binary_Search_Depiction.svg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en).*

$L<R$ indekslar uchun $A_L\le k\le A_R$ ekani ma’lum deb faraz qilaylik. Tartiblilikdan $k$ faqat $A_L,A_{L+1},\ldots,A_R$ orasida bo‘lishi mumkinligi kelib chiqadi. $L<M<R$ indeks tanlab, $k$ ni $A_M$ bilan solishtiramiz:

1. $A_L\le k\le A_M$ bo‘lsa, qidiruv $[L,M]$ ga qisqaradi;
2. $A_M\le k\le A_R$ bo‘lsa, qidiruv $[M,R]$ ga qisqaradi.

$R=L+1$ bo‘lganda oraliqda ichki indeks qolmaydi va chegaralar bevosita javobni beradi. Eng yomon holatda yangi oraliq uzunligi $\max(M-L,R-M)$ bo‘ladi. Uni kichraytirish uchun

$$M\approx\frac{L+R}{2}$$

tanlanadi; shunda ikkala qism ham taxminan $(R-L)/2$ uzunlikda. $h$ qadamdan keyin uzunlik $(R-L)/2^h\approx1$ ga tushadi, ya’ni

$$h\approx\log_2(R-L)\in O(\log n).$$

Masalan, $n\approx2^{20}\approx10^6$ bo‘lsa, chiziqli qidiruv taxminan millionta, ikkilik qidiruv esa atigi yigirmata solishtirish bajaradi.

### Quyi va yuqori chegara

Ko‘pincha elementning istalgan uchrashuvini emas, quyidagilardan birini topish qulay:

- **quyi chegara** (`lower_bound`) — $k$ dan kichik bo‘lmagan birinchi element indeksi;
- **yuqori chegara** (`upper_bound`) — $k$ dan katta bo‘lgan birinchi element indeksi.

Bu ikki chegara orasidagi yarim ochiq oraliq massivdagi $k$ ga teng barcha elementlarni qamraydi va bo‘sh bo‘lishi ham mumkin. $k$ mavjudligini tekshirish uchun quyi chegara topilib, u massiv ichida ekanligi va mos element $k$ ga tengligi tekshiriladi.

### Ishonchli implementatsiya

$A_L\le k<A_R$ invariantini saqlaymiz; faol oraliq $[L,R)$ bo‘ladi. Chekka holatlarni kamaytirish uchun $L=-1$ va $R=n$ bilan boshlanadi. Algoritm $A_{-1}$ yoki $A_n$ ni hech qachon o‘qimaydi; ular faqat fikran $-\infty$ va $+\infty$ chegaralari sifatida qaraladi.

```cpp
// a[0], a[1], ..., a[n - 1] tartiblangan massiv
int l = -1, r = n;
while (r - l > 1) {
    int m = std::midpoint(l, r);
    if (k < a[m]) {
        r = m; // a[l] <= k < a[m] <= a[r]
    } else {
        l = m; // a[l] <= a[m] <= k < a[r]
    }
}
```

Sikl davomida doim $L<M<R$, shuning uchun soxta chegaralardagi elementlar o‘qilmaydi. Yakunda $L$ — $k$ dan katta bo‘lmagan oxirgi element indeksi yoki bunday element bo‘lmasa $-1$; $R$ esa $k$ dan katta birinchi element indeksi yoki bunday element bo‘lmasa $n$.

`m = (l + r) / 2` ifodasi musbat katta indekslar yig‘indisida toshib ketishi mumkin. Bu xato JDK implementatsiyasida qariyb to‘qqiz yil saqlanib qolgan; tafsilotlar [Google Research maqolasida](https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html) berilgan. `l + (r - l) / 2` musbat chegaralarda xavfsizroq, lekin `l` manfiy bo‘lganda hamma holatni qoplamaydi. C++20 dagi `std::midpoint(l, r)` barcha butun chegaralar uchun xavfsiz yechimdir.

## Ixtiyoriy monoton predikatda qidirish

Ikkilik qidiruv faqat massiv elementi bilan solishtirishga bog‘liq emas. Quyidagi monoton Boolean funksiya berilgan bo‘lsin:

$$f:\{0,1,\ldots,n-1\}\to\{0,1\},$$

$$f(0)\le f(1)\le\dots\le f(n-1).$$

Demak, qiymatlar avval `false`, keyin esa `true` bo‘ladi. Ikkilik qidiruv shu ikki qism orasidagi o‘tish nuqtasini topadi. Bu ayniqsa $f(i)$ ni bitta nuqtada tekshirish mumkin, ammo uni barcha $i$ lar uchun hisoblash qimmat bo‘lganda foydali.

```cpp
// f(0) <= f(1) <= ... <= f(n - 1)
int l = -1, r = n;
while (r - l > 1) {
    int m = std::midpoint(l, r);
    if (f(m)) {
        r = m; // f(l) = 0, f(m) = 1
    } else {
        l = m; // f(m) = 0, f(r) = 1
    }
}
```

To‘g‘rilik `f(l)=false` va `f(r)=true` sikl invariantiga tayanadi. Har iteratsiyada `m` shu ikki chegara orasida yotadi; natijaga qarab bir chegara `m` ga ko‘chadi va invariant saqlanadi. $r-l$ qat’iy kamayadi. Sikl $r-l=1$ bo‘lganda tugaydi va `r` birinchi `true` nuqta bo‘ladi. Agar hamma qiymat `false` bo‘lsa `l=n-1`, hammasi `true` bo‘lsa `l=-1` chiqadi.

### Javob bo‘yicha ikkilik qidiruv

Ba’zan aniq javobni bevosita qurish qiyin, lekin “javob kamida $\lambda$ mi?” savolini tekshirish oson. Agar bu predikat $\lambda$ bo‘yicha monoton bo‘lsa, javob chegarasini ikkilik qidiruv bilan topish mumkin.

Masalan, $a_1,\ldots,a_n$ massivda uzunligi kamida $x+1$ bo‘lgan kesmalarning pastga yaxlitlangan eng katta o‘rtachasini topish kerak:

$$\left\lfloor\frac{a_l+a_{l+1}+\dots+a_r}{r-l+1}\right\rfloor,
\qquad r-l\ge x.$$

Javob kamida $\lambda$ ekanini tekshirish

$$\frac{a_l+a_{l+1}+\dots+a_r}{r-l+1}\ge\lambda$$

shartli kesma mavjudligini aniqlashga teng. Tengsizlikni quyidagicha yozamiz:

$$(a_l-\lambda)+(a_{l+1}-\lambda)+\dots+(a_r-\lambda)\ge0.$$

Endi $a_i-\lambda$ massivda uzunligi kamida $x+1$ va yig‘indisi manfiy bo‘lmagan kesma borligini prefiks yig‘indilari bilan tekshirish mumkin. Tekshiruv natijasi $\lambda$ oshgani sari `true` dan `false` ga bir marta o‘tadi.

## Haqiqiy sonlar oralig‘ida qidirish

$f:\mathbb{R}\to\mathbb{R}$ funksiya $[L,R]$ da uzluksiz va $f(L)\le f(R)$ bo‘lsin. [Oraliq qiymatlar teoremasiga](https://en.wikipedia.org/wiki/Intermediate_value_theorem) ko‘ra, istalgan $y\in[f(L),f(R)]$ uchun $f(x)=y$ bo‘ladigan $x\in[L,R]$ mavjud. Bu yerda funksiya monoton bo‘lishi shart emas; qaysi yarim oraliqda kerakli qiymat saqlanishini uzluksizlik va qarama-qarshi belgilar asosida tanlash yetarli.

$x$ ni $\pm\delta$ aniqlik bilan topish uchun

$$O\left(\log\frac{R-L}{\delta}\right)$$

iteratsiya kerak. Har qadamda $M=(L+R)/2$ olinib, $f(M)$ ning $y$ ga nisbati bo‘yicha tegishli yarim oraliq saqlanadi.

Masalan, $f(x)=x^3+ax^2+bx+c$ toq darajali ko‘phad uchun yetarlicha kichik $L$ da $f(L)<0$, yetarlicha katta $R$ da $f(R)>0$. Ikkilik qidiruv $f(x)=0$ ildizni o‘z ichiga olgan oraliqni istalgan aniqlikkacha toraytiradi.

## Ikkining darajalari bilan qidirish

Ikkilik qidiruvning boshqa ko‘rinishida faol oraliq o‘rniga joriy `i` ko‘rsatkich va $2^k$ qadam saqlanadi. Dastlab `i=L`. Har iteratsiyada predikat `i+2^k` nuqtada tekshiriladi. U hali `false` bo‘lsa, `i` shu nuqtaga siljiydi; aks holda joyida qoladi. Keyin $k$ birga kamaytiriladi.

Bu usul daraxtlarda berilgan balandlikdagi ajdodni yoki ikki tugunning eng yaqin umumiy ajdodini topish, shuningdek Fenwick daraxtida $k$-noldan farqli elementni qidirish kabi masalalarda keng qo‘llanadi.

## Murakkablikni eslab qolish

Diskret oraliqdagi ikkilik qidiruv $O(\log n)$ marta predikat chaqiradi. Agar bitta tekshiruv $T$ vaqt olsa, umumiy murakkablik $O(T\log n)$. Javob oralig‘i $[L,R]$ bo‘lsa, iteratsiyalar soni $O(\log(R-L))$; haqiqiy sonlarda esa kerakli $\delta$ aniqlik ham hisobga olinadi.

## Mashq masalalari

- [LeetCode — Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [LeetCode — Search Insert Position](https://leetcode.com/problems/search-insert-position/)
- [LeetCode — First Bad Version](https://leetcode.com/problems/first-bad-version/)
- [LeetCode — Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/)
- [LeetCode — Find Peak Element](https://leetcode.com/problems/find-peak-element/)
- [LeetCode — Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [LeetCode — Find Right Interval](https://leetcode.com/problems/find-right-interval/)
- [Codeforces 706B — Interesting Drink](https://codeforces.com/problemset/problem/706/B/)
- [Codeforces 670D1 — Magic Powder 1](https://codeforces.com/problemset/problem/670/D1)
- [Codeforces 165C — Another Problem on Strings](https://codeforces.com/problemset/problem/165/C)
- [Codeforces 760B — Frodo and Pillows](https://codeforces.com/problemset/problem/760/B)
- [Codeforces 551C — GukiZ Hates Boxes](https://codeforces.com/problemset/problem/551/C)
- [Codeforces 645C — Enduring Exodus](https://codeforces.com/problemset/problem/645/C)
- [Codeforces 590B — Chip ’n Dale Rescue Rangers](https://codeforces.com/problemset/problem/590/B)
- [Codeforces 251A — Points on Line](https://codeforces.com/problemset/problem/251/A)
