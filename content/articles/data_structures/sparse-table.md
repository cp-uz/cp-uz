---
article_id: data_structures--sparse-table
---
# Sparse Table

Sparse Table — oraliq so‘rovlariga javob berishga imkon beruvchi ma’lumotlar tuzilmasi. U aksariyat oraliq so‘rovlariga $O(\log n)$ vaqtda javob bera oladi, ammo uning haqiqiy kuchi oraliq minimumi so‘rovlarida yoki ularga ekvivalent bo‘lgan oraliq maksimumi so‘rovlarida namoyon bo‘ladi. Bunday so‘rovlar uchun javobni $O(1)$ vaqtda hisoblash mumkin.

Ushbu ma’lumotlar tuzilmasining yagona asosiy kamchiligi — undan faqat _o‘zgarmas_ massivlarda foydalanish mumkin. Ya’ni ikki so‘rov orasida massivni o‘zgartirib bo‘lmaydi. Massivning biror elementi o‘zgarsa, butun tuzilmani qaytadan hisoblash kerak.

## Intuitsiya

Har qanday manfiy bo‘lmagan sonni kamayib boruvchi ikkilik darajalar yig‘indisi ko‘rinishida yagona usulda ifodalash mumkin. Bu sonning ikkilik yozuvini boshqa shaklda ifodalash, xolos. Masalan, $13 = (1101)_2 = 8 + 4 + 1$. $x$ soni uchun qo‘shiluvchilar soni ko‘pi bilan $\lceil \log_2 x \rceil$ ta bo‘ladi.

Xuddi shu mulohazaga ko‘ra, istalgan oraliqni uzunliklari kamayib boruvchi ikkilik darajalar bo‘lgan oraliqlar birlashmasi ko‘rinishida yagona usulda ifodalash mumkin. Masalan,
$[2, 14] = [2, 9] \cup [10, 13] \cup [14, 14]$; bu yerda umumiy oraliq uzunligi 13, alohida oraliqlarning uzunliklari esa mos ravishda 8, 4 va 1. Bu holatda ham birlashma ko‘pi bilan $\lceil \log_2(\text{oraliq uzunligi}) \rceil$ ta oraliqdan iborat bo‘ladi.

Sparse Table g‘oyasi ikkilik darajaga teng uzunlikdagi barcha oraliq so‘rovlari javoblarini oldindan hisoblashdan iborat. Keyin boshqa bir so‘rov oralig‘ini ikkilik darajali uzunliklarga ega oraliqlarga ajratamiz, oldindan hisoblangan javoblarni olamiz va ularni birlashtirib yakuniy javobni topamiz.

## Oldindan hisoblash

Oldindan hisoblangan so‘rovlar javoblarini saqlash uchun ikki o‘lchamli massivdan foydalanamiz. $\text{st}[i][j]$ uzunligi $2^i$ bo‘lgan $[j, j + 2^i - 1]$ oralig‘i javobini saqlaydi.

Ikki o‘lchamli massivning o‘lchami $(K + 1) \times \text{MAXN}$ bo‘ladi; bu yerda $\text{MAXN}$ — massivning mumkin bo‘lgan eng katta uzunligi. $K$ quyidagi shartni qanoatlantirishi kerak:
$\text{K} \ge \lfloor \log_2 \text{MAXN} \rfloor$, chunki $2^{\lfloor \log_2 \text{MAXN} \rfloor}$ biz qo‘llab-quvvatlashimiz kerak bo‘lgan eng katta ikkilik darajali oraliq uzunligidir.

Uzunligi amaliy chegaralarda bo‘lgan massivlar uchun ($\le 10^7$ ta element) $K = 25$ yaxshi qiymat hisoblanadi.

Xotiraga ketma-ket murojaat qilish va keshdan samarali foydalanish uchun $\text{MAXN}$ o‘lchami ikkinchi indeks sifatida joylashtirilgan.

```{.cpp file=sparsetable_definition}
int st[K + 1][MAXN];
```

Uzunligi $2^i$ bo‘lgan $[j, j + 2^i - 1]$ oralig‘i uzunligi $2^{i - 1}$ bo‘lgan $[j, j + 2^{i - 1} - 1]$ va $[j + 2^{i - 1}, j + 2^i - 1]$ oraliqlariga qulay tarzda ajraladi. Shu sababli jadvalni dinamik dasturlash yordamida samarali qurish mumkin:

```{.cpp file=sparsetable_generation}
std::copy(array.begin(), array.end(), st[0]);
for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = f(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```

$f$ funksiyasi so‘rov turiga bog‘liq. Oraliq yig‘indisi so‘rovlari uchun u yig‘indini, oraliq minimumi so‘rovlari uchun esa minimumni hisoblaydi.

Oldindan hisoblashning vaqt murakkabligi $O(\text{N} \log \text{N})$.

## Oraliq yig‘indisi so‘rovlari

Bu turdagi so‘rovlarda berilgan oraliqdagi barcha qiymatlar yig‘indisini topmoqchimiz. Shuning uchun $f$ funksiyasining tabiiy ta’rifi $f(x, y) = x + y$ bo‘ladi.

Ma’lumotlar tuzilmasini quyidagicha qurish mumkin:

```{.cpp file=sparsetable_sum_generation}
long long st[K + 1][MAXN];

std::copy(array.begin(), array.end(), st[0]);

for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = st[i - 1][j] + st[i - 1][j + (1 << (i - 1))];
```

$[L, R]$ oralig‘i yig‘indisi so‘roviga javob berish uchun eng katta darajadan boshlab ikkilik darajalarni ko‘rib chiqamiz. $2^i$ qiymati oraliq uzunligidan, ya’ni $R-L+1$ dan kichik yoki teng bo‘lishi bilan $[L, L + 2^i - 1]$ qismini qayta ishlaymiz va qolgan $[L + 2^i, R]$ oralig‘iga o‘tamiz.

```{.cpp file=sparsetable_sum_query}
long long sum = 0;
for (int i = K; i >= 0; i--) {
    if ((1 << i) <= R - L + 1) {
        sum += st[i][L];
        L += 1 << i;
    }
}
```

Oraliq yig‘indisi so‘rovining vaqt murakkabligi $O(K) = O(\log \text{MAXN})$.

## Oraliq minimumi so‘rovlari (RMQ)

Sparse Table aynan shu turdagi so‘rovlarda eng samarali ishlaydi.

Oraliq minimumini hisoblashda bir qiymatni bir marta yoki ikki marta hisobga olishning farqi yo‘q. Shu sababli oraliqni bir nechta o‘zaro kesishmaydigan qismlarga ajratish o‘rniga, uni uzunligi ikkilik darajaga teng bo‘lgan atigi ikkita ustma-ust tushuvchi oraliqqa ajratishimiz mumkin.

Masalan, $[1, 6]$ oralig‘ini $[1, 4]$ va $[3, 6]$ oraliqlariga ajratamiz. $[1, 6]$ oralig‘ining minimumi $[1, 4]$ minimumi bilan $[3, 6]$ minimumining kichigiga tengligi ravshan.

Demak, $[L, R]$ oralig‘i minimumini quyidagicha hisoblash mumkin:

$$\min(\text{st}[i][L], \text{st}[i][R - 2^i + 1]) \quad \text{ where } i = \log_2(R - L + 1)$$

Buning uchun $\log_2(R-L+1)$ qiymatini tez hisoblay olishimiz kerak. Barcha logarifmlarni oldindan hisoblash mumkin:

```{.cpp file=sparse_table_log_table}
int lg[MAXN+1];
lg[1] = 0;
for (int i = 2; i <= MAXN; i++)
    lg[i] = lg[i/2] + 1;
```

Yoki logarifmni qo‘shimcha $O(1)$ xotira va $O(1)$ vaqtda so‘rov paytida hisoblash mumkin:

```c++
// C++20
#include <bit>
int log2_floor(unsigned long i) {
    return std::bit_width(i) - 1;
}
// pre C++20
int log2_floor(unsigned long long i) {
    return i ? __builtin_clzll(1) - __builtin_clzll(i) : -1;
}
```

[Ushbu benchmark](https://quick-bench.com/q/Zghbdj_TEkmw4XG2nqOpD3tsJ8U) `lg` massividan foydalanish kesh misslari sababli sekinroq ekanini ko‘rsatadi.

Shundan so‘ng Sparse Table tuzilmasini oldindan hisoblaymiz. Bu safar $f$ funksiyasini $f(x, y) = \min(x, y)$ deb olamiz.

```{.cpp file=sparse_table_minimum_generation}
int st[K + 1][MAXN];

std::copy(array.begin(), array.end(), st[0]);
for (int i = 1; i <= K; i++)
    for (int j = 0; j + (1 << i) <= N; j++)
        st[i][j] = min(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
```

$[L, R]$ oralig‘ining minimumi quyidagicha hisoblanadi:

```{.cpp file=sparse_table_minimum_query}
int i = lg[R - L + 1];
int minimum = min(st[i][L], st[i][R - (1 << i) + 1]);
```

Oraliq minimumi so‘rovining vaqt murakkabligi $O(1)$.

## Ko‘proq turdagi so‘rovlarni qo‘llab-quvvatlovchi o‘xshash tuzilmalar

Oldingi bo‘limdagi $O(1)$ yondashuvning asosiy cheklovlaridan biri — u faqat [idempotent funksiyalar](https://en.wikipedia.org/wiki/Idempotence) so‘rovlarini qo‘llab-quvvatlaydi. Masalan, oraliq minimumi uchun juda yaxshi ishlaydi, ammo shu yondashuv bilan oraliq yig‘indisi so‘roviga javob berib bo‘lmaydi.

Istalgan assotsiativ funksiya bilan ishlay oladigan va oraliq so‘rovlariga $O(1)$ vaqtda javob beradigan o‘xshash ma’lumotlar tuzilmalari mavjud. Ulardan biri [Disjoint Sparse Table](https://discuss.codechef.com/questions/117696/tutorial-disjoint-sparse-table) deb ataladi. Yana biri — [Sqrt Tree](sqrt-tree.md).

## Amaliy masalalar

* [SPOJ - RMQSQ](http://www.spoj.com/problems/RMQSQ/)
* [SPOJ - THRBL](http://www.spoj.com/problems/THRBL/)
* [Codechef - MSTICK](https://www.codechef.com/problems/MSTICK)
* [Codechef - SEAD](https://www.codechef.com/problems/SEAD)
* [Codeforces - CGCDSSQ](http://codeforces.com/contest/475/problem/D)
* [Codeforces - R2D2 and Droid Army](http://codeforces.com/problemset/problem/514/D)
* [Codeforces - Maximum of Maximums of Minimums](http://codeforces.com/problemset/problem/872/B)
* [SPOJ - Miraculous](http://www.spoj.com/problems/TNVFC1M/)
* [DevSkill - Multiplication Interval (archived)](http://web.archive.org/web/20200922003506/https://devskill.com/CodingProblems/ViewProblem/19)
* [Codeforces - Animals and Puzzles](http://codeforces.com/contest/713/problem/D)
* [Codeforces - Trains and Statistics](http://codeforces.com/contest/675/problem/E)
* [SPOJ - Postering](http://www.spoj.com/problems/POSTERIN/)
* [SPOJ - Negative Score](http://www.spoj.com/problems/RPLN/)
* [SPOJ - A Famous City](http://www.spoj.com/problems/CITY2/)
* [SPOJ - Diferencija](http://www.spoj.com/problems/DIFERENC/)
* [Codeforces - Turn off the TV](http://codeforces.com/contest/863/problem/E)
* [Codeforces - Map](http://codeforces.com/contest/15/problem/D)
* [Codeforces - Awards for Contestants](http://codeforces.com/contest/873/problem/E)
* [Codeforces - Longest Regular Bracket Sequence](http://codeforces.com/contest/5/problem/C)
* [CSES - Static Range Minimum Queries](https://cses.fi/problemset/task/1647)
* [Codeforces - Array Stabilization (GCD version)](http://codeforces.com/problemset/problem/1547/F)

