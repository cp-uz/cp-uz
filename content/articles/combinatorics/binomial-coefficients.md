---
article_id: combinatorics--binomial-coefficients
---
# Binomial koeffitsiyentlar

Binomial koeffitsiyent $\binom n k$ — $n$ ta turli elementdan ularning joylashish tartibini hisobga olmasdan $k$ ta elementli to‘plam tanlash usullari soni (ya’ni tartiblanmagan to‘plamlar soni).

Binomial koeffitsiyentlar $(a+b)^n$ yoyilmasidagi koeffitsiyentlar hamdir (bu binomial teorema deb ataladi):

$$ (a+b)^n = \binom n 0 a^n + \binom n 1 a^{n-1} b + \binom n 2 a^{n-2} b^2 + \cdots + \binom n k a^{n-k} b^k + \cdots + \binom n n b^n $$

Bu formula va koeffitsiyentlarni samarali hisoblash imkonini beruvchi uchburchak XVII asrda Blaise Pascal tomonidan kashf etilgan deb hisoblanadi. Biroq u XIII asrda yashagan xitoylik matematik Yang Huiga ham ma’lum bo‘lgan. Uni fors olimi Umar Xayyom kashf etgan bo‘lishi ham mumkin. Bundan tashqari, miloddan avvalgi III asrda yashagan hind matematigi Pingala ham o‘xshash natijalarni olgan. Newtonning hissasi shundaki, u formulani natural bo‘lmagan daraja ko‘rsatkichlari uchun umumlashtirgan.

## Hisoblash

Hisoblash uchun **analitik formula**:

$$ \binom n k = \frac {n!} {k!(n-k)!} $$

Bu formulani tartiblangan joylashtirishlar masalasidan (ya’ni $n$ ta turli elementdan $k$ ta turli elementni tartib bilan tanlash usullari sonidan) oson keltirib chiqarish mumkin. Avval $k$ ta elementning tartiblangan tanlovlari sonini hisoblaymiz. Birinchi elementni tanlashning $n$ ta, ikkinchisini tanlashning $n-1$ ta, uchinchisini tanlashning $n-2$ ta va hokazo usuli bor. Natijada tartiblangan joylashtirishlar soni uchun $n(n-1)(n-2)\cdots(n-k+1)=\frac{n!}{(n-k)!}$ formulasini olamiz. Har bir tartiblanmagan tanlovga aynan $k!$ ta tartiblangan tanlov mos kelishini qayd etib, tartiblanmagan tanlovlarga oson o‘tamiz ($k!$ — $k$ ta elementning mumkin bo‘lgan permutatsiyalari soni). $\frac{n!}{(n-k)!}$ ni $k!$ ga bo‘lib, yakuniy formulani olamiz.

Mashhur «Pascal uchburchagi» bilan bog‘liq **rekurrent formula**:

$$ \binom n k = \binom {n-1} {k-1} + \binom {n-1} k $$

Buni analitik formuladan osongina keltirib chiqarish mumkin.

$n<k$ bo‘lganda $\binom n k$ ning qiymati nol deb qabul qilinishiga e’tibor bering.

## Xossalar

Binomial koeffitsiyentlarning ko‘plab xossalari mavjud. Quyida ulardan eng sodda xossalar keltirilgan:

*   Simmetriya qoidasi:

    \[ \binom n k = \binom n {n-k} \]

*   Ko‘paytuvchini tashqariga chiqarish:

    \[ \binom n k = \frac n k \binom {n-1} {k-1} \]

*   $k$ bo‘yicha yig‘indi:

    \[ \sum_{k = 0}^n \binom n k = 2 ^ n \]

*   $n$ bo‘yicha yig‘indi:

    \[ \sum_{m = 0}^n \binom m k = \binom {n + 1} {k + 1} \]

*   $n$ va $k$ bo‘yicha yig‘indi:

    \[ \sum_{k = 0}^m  \binom {n + k} k = \binom {n + m + 1} m \]

*   Kvadratlar yig‘indisi:

    \[ {\binom n 0}^2 + {\binom n 1}^2 + \cdots + {\binom n n}^2 = \binom {2n} n \]

*   Vaznli yig‘indi:

    \[ 1 \binom n 1 + 2 \binom n 2 + \cdots + n \binom n n = n 2^{n-1} \]

*   [Fibonacci sonlari](../algebra/fibonacci-numbers.md) bilan bog‘lanish:

    \[ \binom n 0 + \binom {n-1} 1 + \cdots + \binom {n-k} k + \cdots + \binom 0 n = F_{n+1} \]

## Hisoblash usullari

### Analitik formula yordamida bevosita hisoblash

Birinchi, bevosita formula kodda juda oson yoziladi, ammo bu usul $n$ va $k$ ning nisbatan kichik qiymatlaridayoq toshib ketishga moyil. Hatto javobning o‘zi biror ma’lumot turiga to‘liq sig‘sa ham, oraliq faktoriallarni hisoblash toshib ketishga olib kelishi mumkin. Shu sababli bu usul ko‘pincha faqat [uzun arifmetika](../algebra/big-integer.md) bilan ishlatilishi mumkin:

```cpp
int C(int n, int k) {
    int res = 1;
    for (int i = n - k + 1; i <= n; ++i)
        res *= i;
    for (int i = 2; i <= k; ++i)
        res /= i;
    return res;
}
```

### Yaxshilangan amalga oshirish

Yuqoridagi amalga oshirishda surat va maxraj bir xil miqdordagi ($k$ ta) ko‘paytuvchiga ega va ularning har biri kamida 1 ga tengligiga e’tibor bering. Shuning uchun kasrni har biri haqiqiy qiymatli bo‘lgan $k$ ta kasr ko‘paytmasi bilan almashtirishimiz mumkin. Biroq har bir qadamda joriy javobni navbatdagi kasrga ko‘paytirgandan keyin natija baribir butun son bo‘lib qoladi (bu ko‘paytuvchini tashqariga chiqarish xossasidan kelib chiqadi).

C++ da amalga oshirish:

```cpp
int C(int n, int k) {
    double res = 1;
    for (int i = 1; i <= k; ++i)
        res = res * (n - k + i) / i;
    return (int)(res + 0.01);
}
```

Bu yerda yig‘ilib borgan xatolar sababli suzuvchi nuqtali son haqiqiy qiymatdan biroz kichik bo‘lishi mumkinligini (masalan, $3$ o‘rniga $2.99999$) hisobga olib, uni ehtiyotkorlik bilan butun songa o‘tkazamiz.

### Pascal uchburchagi

Rekurrent munosabatdan foydalanib, binomial koeffitsiyentlar jadvalini — Pascal uchburchagini — qurish va javobni undan olish mumkin. Ushbu usulning afzalligi shundaki, oraliq natijalar hech qachon javobdan oshmaydi va jadvalning har bir yangi elementini hisoblash uchun faqat bitta qo‘shish amali kerak. Kamchiligi esa, agar butun jadval emas, faqat bitta qiymat kerak bo‘lsa, katta $n$ va $k$ uchun sekin ishlashidir. Chunki $\binom n k$ ni hisoblash uchun barcha $\binom i j$, $1\le i\le n$, $1\le j\le n$ qiymatlar jadvalini yoki hech bo‘lmaganda $1\le j\le\min(i,2k)$ gacha bo‘lgan qismini qurish kerak. Vaqt murakkabligini $\mathcal{O}(n^2)$ deb hisoblash mumkin.

C++ da amalga oshirish:

```cpp
const int maxn = ...;
int C[maxn + 1][maxn + 1];
C[0][0] = 1;
for (int n = 1; n <= maxn; ++n) {
    C[n][0] = C[n][n] = 1;
    for (int k = 1; k < n; ++k)
        C[n][k] = C[n - 1][k - 1] + C[n - 1][k];
}
```

Agar qiymatlarning butun jadvali kerak bo‘lmasa, uning faqat oxirgi ikkita satrini — joriy $n$-satr va oldingi $(n-1)$-satrni — saqlash kifoya.

### $O(1)$ da hisoblash {data-toc-label="O(1) da hisoblash"}

Nihoyat, ayrim holatlarda barcha faktoriallarni oldindan hisoblab, keyin kerakli binomial koeffitsiyentni faqat ikkita bo‘lish amali bilan olish foydali. Bu [uzun arifmetika](../algebra/big-integer.md) ishlatilganda va xotira butun Pascal uchburchagini oldindan hisoblashga yetmaganda qulay bo‘lishi mumkin.

## Binomial koeffitsiyentlarni $m$ moduli bo‘yicha hisoblash {data-toc-label="Binomial koeffitsiyentlarni m moduli bo‘yicha hisoblash"}

Binomial koeffitsiyentlarni biror $m$ moduli bo‘yicha hisoblash masalasi juda ko‘p uchraydi.

### Kichik $n$ uchun binomial koeffitsiyent {data-toc-label="Kichik n uchun binomial koeffitsiyent"}

Oldin muhokama qilingan Pascal uchburchagi yondashuvidan yetarlicha kichik $n$ uchun barcha $\binom{n}{k}\bmod m$ qiymatlarini hisoblashda foydalanish mumkin, chunki uning vaqt murakkabligi $\mathcal{O}(n^2)$. Bu yondashuv istalgan modul bilan ishlaydi, chunki unda faqat qo‘shish amallari qo‘llanadi.

### Katta tub modul bo‘yicha binomial koeffitsiyent

Binomial koeffitsiyentlar formulasi:

$$\binom n k = \frac {n!} {k!(n-k)!},$$

shuning uchun uni $m>n$ bo‘lgan biror tub $m$ moduli bo‘yicha hisoblamoqchi bo‘lsak, quyidagini olamiz:

$$\binom n k \equiv n! \cdot (k!)^{-1} \cdot ((n-k)!)^{-1} \mod m.$$

Avval $\text{MAXN}!$ gacha bo‘lgan barcha faktoriallarni $m$ moduli bo‘yicha $O(\text{MAXN})$ vaqtda oldindan hisoblaymiz.

```cpp
factorial[0] = 1;
for (int i = 1; i <= MAXN; i++) {
    factorial[i] = factorial[i - 1] * i % m;
}
```

Shundan keyin binomial koeffitsiyentni $O(\log m)$ vaqtda hisoblashimiz mumkin.

```cpp
long long binomial_coefficient(int n, int k) {
    return factorial[n] * inverse(factorial[k] * factorial[n - k] % m) % m;
}
```

Agar barcha faktoriallarning teskarilarini teskari elementni hisoblashning odatiy usuli bilan $O(\text{MAXN}\log m)$ vaqtda oldindan hisoblasak, binomial koeffitsiyentni hatto $O(1)$ vaqtda hisoblashimiz mumkin. Yoki $(x!)^{-1}\equiv((x-1)!)^{-1}\cdot x^{-1}$ taqqoslamadan va [barcha teskari elementlarni](../algebra/module-inverse.md#mod-inv-all-num) $O(n)$ da hisoblash usulidan foydalanib, oldindan hisoblashni $O(\text{MAXN})$ vaqtda bajarish mumkin.

```cpp
long long binomial_coefficient(int n, int k) {
    return factorial[n] * inverse_factorial[k] % m * inverse_factorial[n - k] % m;
}
```

### Tub son darajasi moduli bo‘yicha binomial koeffitsiyent { #mod-prime-pow}

Bu yerda binomial koeffitsiyentni biror tub son darajasi, ya’ni biror tub $p$ uchun $m=p^b$ moduli bo‘yicha hisoblamoqchimiz.
Agar $p>\max(k,n-k)$ bo‘lsa, oldingi bo‘limda bayon qilingan usuldan foydalanishimiz mumkin.
Ammo $p\le\max(k,n-k)$ bo‘lsa, $k!$ va $(n-k)!$ dan kamida biri $m$ bilan o‘zaro tub emas. Shuning uchun ularning teskari elementlarini hisoblab bo‘lmaydi — bunday teskari elementlar mavjud emas.
Shunga qaramay, binomial koeffitsiyentni hisoblash mumkin.

G‘oya quyidagicha.
Har bir $x!$ uchun $p^c$ soni $x!$ ni bo‘ladigan eng katta $c$ darajani, ya’ni $p^c~|~x!$ ni hisoblaymiz.
Bu sonni $c(x)$ deb belgilaymiz.
Shuningdek,

$$g(x):=\frac{x!}{p^{c(x)}}$$

deb olamiz. Shunda binomial koeffitsiyentni quyidagicha yozish mumkin:

$$\binom n k = \frac {g(n) p^{c(n)}} {g(k) p^{c(k)} g(n-k) p^{c(n-k)}} = \frac {g(n)} {g(k) g(n-k)}p^{c(n) - c(k) - c(n-k)}$$

Muhim jihat shundaki, endi $g(x)$ tarkibida $p$ tub bo‘luvchisi yo‘q.
Demak, $g(x)$ soni $m$ bilan o‘zaro tub va $g(k)$ hamda $g(n-k)$ ning modul bo‘yicha teskari elementlarini hisoblashimiz mumkin.

Barcha $g$ va $c$ qiymatlarini dinamik dasturlash yordamida $\mathcal{O}(n)$ vaqtda samarali oldindan hisoblagach, binomial koeffitsiyentni $O(\log m)$ vaqtda hisoblashimiz mumkin.
Yoki barcha teskari elementlar va $p$ ning barcha darajalarini oldindan hisoblab, binomial koeffitsiyentni $O(1)$ vaqtda olish mumkin.

Agar $c(n)-c(k)-c(n-k)\ge b$ bo‘lsa, $p^b~|~p^{c(n)-c(k)-c(n-k)}$ bo‘ladi va binomial koeffitsiyent $0$ ga tengligiga e’tibor bering.

### Ixtiyoriy modul bo‘yicha binomial koeffitsiyent

Endi binomial koeffitsiyentni ixtiyoriy $m$ moduli bo‘yicha hisoblaymiz.

$m$ ning tub ko‘paytuvchilarga ajralishi

$$m=p_1^{e_1}p_2^{e_2}\cdots p_h^{e_h}$$

bo‘lsin. Har bir $i$ uchun binomial koeffitsiyentni $p_i^{e_i}$ moduli bo‘yicha hisoblashimiz mumkin.
Natijada $h$ ta turli taqqoslama olamiz.
Barcha $p_i^{e_i}$ modullar o‘zaro tub bo‘lgani sababli, [Xitoy qoldiqlar teoremasi](../algebra/chinese-remainder-theorem.md) yordamida binomial koeffitsiyentni modullar ko‘paytmasi bo‘yicha, ya’ni kerakli $m$ moduli bo‘yicha hisoblashimiz mumkin.

### Katta $n$ va kichik modul uchun binomial koeffitsiyent {data-toc-label="Katta n va kichik modul uchun binomial koeffitsiyent"}

$n$ juda katta bo‘lganda, yuqorida muhokama qilingan $\mathcal{O}(n)$ algoritmlar amaliy bo‘lmay qoladi. Biroq $m$ modul kichik bo‘lsa, $\binom{n}{k}\bmod m$ ni hisoblashning boshqa usullari mavjud.

$m$ tub bo‘lganda ikkita imkoniyat bor:

* [Lucas teoremasi](https://en.wikipedia.org/wiki/Lucas's_theorem) qo‘llanishi mumkin. U $\binom{n}{k}\bmod m$ ni hisoblash masalasini $x_i,y_i<m$ bo‘lgan $\binom{x_i}{y_i}\bmod m$ ko‘rinishidagi $\log_m n$ ta masalaga ajratadi. Agar har bir kichraytirilgan koeffitsiyent oldindan hisoblangan faktoriallar va teskari faktoriallar yordamida topilsa, murakkablik $\mathcal{O}(m+\log_m n)$ bo‘ladi.
* [Faktorialni P moduli bo‘yicha](../algebra/factorial-modulo.md) hisoblash usuli kerakli $g$ va $c$ qiymatlarini olish hamda ularni [tub son darajasi moduli](#mod-prime-pow) bo‘limida bayon qilinganidek ishlatish uchun qo‘llanishi mumkin. Bu $\mathcal{O}(m\log_m n)$ vaqt oladi.

Agar $m$ tub bo‘lmasa, ammo kvadratlardan holi bo‘lsa, $m$ ning tub bo‘luvchilarini topish, koeffitsiyentni har bir tub bo‘luvchi moduli bo‘yicha yuqoridagi usullardan biri bilan hisoblash va umumiy javobni Xitoy qoldiqlar teoremasi yordamida olish mumkin.

Agar $m$ kvadratlardan holi bo‘lmasa, Lucas teoremasi o‘rniga uning [tub son darajalari uchun umumlashmasi](https://web.archive.org/web/20170202003812/http://www.dms.umontreal.ca/~andrew/PDF/BinCoeff.pdf) qo‘llanishi mumkin.

## Amaliy masalalar

* [Codechef - Number of ways](https://www.codechef.com/LTIME24/problems/NWAYS/)
* [Codeforces - Curious Array](http://codeforces.com/problemset/problem/407/C)
* [LightOj - Necklaces](http://www.lightoj.com/volume_showproblem.php?problem=1419)
* [HACKEREARTH: Binomial Coefficient](https://www.hackerearth.com/problem/algorithm/binomial-coefficient-1/description/)
* [SPOJ - Ada and Teams](http://www.spoj.com/problems/ADATEAMS/)
* [SPOJ - Greedy Walking](http://www.spoj.com/problems/UCV2013E/)
* [UVa 13214 - The Robot's Grid](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5137)
* [SPOJ - Good Predictions](http://www.spoj.com/problems/GOODB/)
* [SPOJ - Card Game](http://www.spoj.com/problems/HC12/)
* [SPOJ - Topper Rama Rao](http://www.spoj.com/problems/HLP_RAMS/)
* [UVa 13184 - Counting Edges and Graphs](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=5095)
* [Codeforces - Anton and School 2](http://codeforces.com/contest/785/problem/D)
* [Codeforces - Bacterial Melee](http://codeforces.com/contest/760/problem/F)
* [Codeforces - Points, Lines and Ready-made Titles](http://codeforces.com/contest/872/problem/E)
* [SPOJ - The Ultimate Riddle](https://www.spoj.com/problems/DCEPC13D/)
* [CodeChef - Long Sandwich](https://www.codechef.com/MAY17/problems/SANDWICH/)
* [Codeforces - Placing Jinas](https://codeforces.com/problemset/problem/1696/E)

## Manbalar

* [Blog fishi.devtail.io](https://fishi.devtail.io/weblog/2015/06/25/computing-large-binomial-coefficients-modulo-prime-non-prime/)
* [Question on Mathematics StackExchange](https://math.stackexchange.com/questions/95491/n-choose-k-bmod-m-using-chinese-remainder-theorem)
* [Question on CodeChef Discuss](https://discuss.codechef.com/questions/98129/your-approach-to-solve-sandwich)

