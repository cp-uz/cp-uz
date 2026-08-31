---
article_id: dynamic_programming--divide-and-conquer-dp
---
# Divide and Conquer yordamida DP optimallashtirishi

Divide and Conquer — dinamik dasturlash uchun optimallashtirish usuli.

### Dastlabki shartlar

Ayrim dinamik dasturlash masalalarida quyidagi ko‘rinishdagi rekurrent formula uchraydi:

$$
dp(i, j) = \min_{0 \leq k \leq j} \\{ dp(i - 1, k - 1) + C(k, j) \\}
$$

bu yerda $C(k,j)$ — narx funksiyasi, $j\lt 0$ bo‘lganda esa $dp(i,j)=0$.

$0\leq i\lt m$, $0\leq j\lt n$ bo‘lsin va $C$ ni hisoblash $O(1)$ vaqt talab qilsin. U holda yuqoridagi rekurrent formulani bevosita hisoblash $O(mn^2)$ vaqt oladi: $m\times n$ ta holat va har bir holat uchun $n$ ta o‘tish mavjud.

$opt(i,j)$ bilan yuqoridagi ifodani minimum qiladigan $k$ qiymatini belgilaymiz. Narx funksiyasi to‘rtburchak tengsizlikni qanoatlantiradi deb faraz qilsak, barcha $i,j$ uchun $opt(i,j)\leq opt(i,j+1)$ ekanini ko‘rsatish mumkin. Bu **monotonlik sharti** deb ataladi. Shunda Divide and Conquer DP optimallashtirishini qo‘llash mumkin: belgilangan $i$ uchun optimal “bo‘linish nuqtasi” $j$ oshgani sari kamaymaydi.

Bu barcha holatlarni samaraliroq hisoblash imkonini beradi. Belgilangan $i$ va $j$ uchun $opt(i,j)$ ni hisobladik, deylik. Unda istalgan $j'<j$ uchun $opt(i,j')\leq opt(i,j)$ ekanini bilamiz. Demak, $opt(i,j')$ ni hisoblashda barcha bo‘linish nuqtalarini tekshirish shart emas.

Ishlash vaqtini kamaytirish uchun Divide and Conquer g‘oyasini qo‘llaymiz. Avval $opt(i,n/2)$ ni hisoblaymiz. Keyin $opt(i,n/4)$ ni hisoblaymiz va uning $opt(i,n/2)$ dan katta emasligini bilamiz; $opt(i,3n/4)$ ni hisoblaganda esa uning $opt(i,n/2)$ dan kichik emasligini bilamiz. Rekursiv ravishda `opt` ning quyi va yuqori chegaralarini saqlab borib, $O(mn\log n)$ ishlash vaqtiga erishamiz. Implementatsiya tafsilotlari quyidagi kodda keltirilgan.

Divide and Conquer murakkabligini isbotlash uchun avvalo rekursiyada $O(\log n)$ ta daraja borligiga e’tibor bering. Har bir darajada $O(n)$ ta amal bajarilishini ko‘rsatamiz. Rekursiyaning $k$-darajasidagi `opt` oraliqlarining — koddagi `optl` va `optr` — umumiy uzunligini $S_k$ deb belgilaylik. $k$-darajadagi uzunligi $x$ bo‘lgan oraliq bo‘linganda, hosil bo‘lgan oraliqlarning umumiy uzunligi ko‘pi bilan $x+1$ bo‘ladi. Bundan tashqari, $k$-darajada ko‘pi bilan $2^k$ ta bo‘lish bajariladi, demak $S_{k+1}\leq S_k+2^k$. $S_0=n$ dan boshlab bu chegarani induksiya bilan qo‘llasak, har bir $k$-daraja uchun

$$
S_k < n + 2^k \in O(n).
$$

Shunday qilib, bitta Divide and Conquer hisobining murakkabligi $O(n\log n)$, butun DP hisobining murakkabligi esa $O(mn\log n)$ bo‘ladi.

## Umumiy implementatsiya

Implementatsiya masalaga qarab farqlansa-da, quyidagi andoza ko‘p holatlarda ishlaydi.
`compute` funksiyasi $i-1$-qatorning `dp_before` holatlari berilganda $i$-qatorning `dp_cur` holatlarini hisoblaydi.
Uni `compute(0, n-1, 0, n-1)` ko‘rinishida chaqirish kerak. `solve` funksiyasi `m` ta qatorni hisoblaydi va natijani qaytaradi.

```{.cpp file=divide_and_conquer_dp}
int m, n;
vector<long long> dp_before, dp_cur;

long long C(int i, int j);

// compute dp_cur[l], ... dp_cur[r] (inclusive)
void compute(int l, int r, int optl, int optr) {
    if (l > r)
        return;

    int mid = (l + r) >> 1;
    pair<long long, int> best = {LLONG_MAX, -1};

    for (int k = optl; k <= min(mid, optr); k++) {
        best = min(best, {(k ? dp_before[k - 1] : 0) + C(k, mid), k});
    }

    dp_cur[mid] = best.first;
    int opt = best.second;

    compute(l, mid - 1, optl, opt);
    compute(mid + 1, r, opt, optr);
}

long long solve() {
    dp_before.assign(n,0);
    dp_cur.assign(n,0);

    for (int i = 0; i < n; i++)
        dp_before[i] = C(0, i);

    for (int i = 1; i < m; i++) {
        compute(0, n - 1, 0, n - 1);
        dp_before = dp_cur;
    }

    return dp_before[n - 1];
}
```

### E’tibor berish kerak bo‘lgan jihatlar

Divide and Conquer DP masalalaridagi eng katta qiyinchilik — $opt$ ning monotonligini isbotlash. Bu xossa o‘rinli bo‘ladigan muhim maxsus holatlardan biri narx funksiyasi to‘rtburchak tengsizlikni qanoatlantirishidir, ya’ni barcha $a\leq b\leq c\leq d$ uchun $C(a,c)+C(b,d)\leq C(a,d)+C(b,c)$.

Ko‘p Divide and Conquer DP masalalarini Convex Hull Trick yordamida ham yechish mumkin va aksincha. Har ikkala usulni bilish va tushunish foydalidir.

## Amaliy masalalar

- [AtCoder - Yakiniku Restaurants](https://atcoder.jp/contests/arc067/tasks/arc067_d)
- [CodeForces - Ciel and Gondolas](https://codeforces.com/contest/321/problem/E) (Kiritish-chiqarishda ehtiyot bo‘ling.)
- [CodeForces - Levels And Regions](https://codeforces.com/problemset/problem/673/E)
- [CodeForces - Partition Game](https://codeforces.com/contest/1527/problem/E)
- [CodeForces - The Bakery](https://codeforces.com/problemset/problem/834/D)
- [CodeForces - Yet Another Minimization Problem](https://codeforces.com/contest/868/problem/F)
- [Codechef - CHEFAOR](https://www.codechef.com/problems/CHEFAOR)
- [CodeForces - GUARDS](https://codeforces.com/gym/103536/problem/A) (Bu maqolada ko‘rib chiqilgan aynan shu masala.)
- [Hackerrank - Guardians of the Lunatics](https://www.hackerrank.com/contests/ioi-2014-practice-contest-2/challenges/guardians-lunatics-ioi14)
- [Hackerrank - Mining](https://www.hackerrank.com/contests/world-codesprint-5/challenges/mining)
- [Kattis - Money (ACM ICPC World Finals 2017)](https://open.kattis.com/problems/money)
- [SPOJ - ADAMOLD](https://www.spoj.com/problems/ADAMOLD/)
- [SPOJ - LARMY](https://www.spoj.com/problems/LARMY/)
- [SPOJ - NKLEAVES](https://www.spoj.com/problems/NKLEAVES/)
- [Timus - Bicolored Horses](https://acm.timus.ru/problem.aspx?space=1&num=1167)
- [USACO - Circular Barn](https://usaco.org/index.php?page=viewproblem2&cpid=626)
- [UVA - Arranging Heaps](https://onlinejudge.org/external/125/12524.pdf)
- [UVA - Naming Babies](https://onlinejudge.org/external/125/12594.pdf)

## Manbalar

- [Michael Levinning Quora javobi](https://www.quora.com/What-is-divide-and-conquer-optimization-in-dynamic-programming)
- [“Sothe” the Algorithm Wolf video darsi](https://www.youtube.com/watch?v=wLXEWuDWnzI)

