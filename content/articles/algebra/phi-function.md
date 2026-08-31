---
article_id: algebra--phi-function
---
# Eylerning phi-funksiyasi

Eylerning totient funksiyasi, **phi-funksiya** $\phi (n)$ deb ham ataladi, 1 dan $n$ gacha bo‘lgan va $n$ bilan o‘zaro tub bo‘lgan butun sonlar sonini hisoblaydi. Ikki sonning eng katta umumiy bo‘luvchisi $1$ ga teng bo‘lsa, ular o‘zaro tub deyiladi ($1$ istalgan son bilan o‘zaro tub deb hisoblanadi).

Dastlabki bir nechta musbat butun son uchun $\phi(n)$ qiymatlari quyidagicha:
$$\begin{array}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}
\hline
n & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 & 13 & 14 & 15 & 16 & 17 & 18 & 19 & 20 & 21 \\ \hline
\phi(n) & 1 & 1 & 2 & 2 & 4 & 2 & 6 & 4 & 6 & 4 & 10 & 4 & 12 & 6 & 8 & 8 & 16 & 6 & 18 & 8 & 12 \\ \hline
\end{array}$$
## Xossalari

Eylerning totient funksiyasini istalgan son uchun hisoblashga quyidagi xossalar yetarli:

  - Agar $p$ tub son bo‘lsa, barcha $1 \le q < p$ uchun $\gcd(p, q) = 1$. Shuning uchun:

$$\phi (p) = p - 1.$$

  - Agar $p$ tub son va $k \ge 1$ bo‘lsa, $1$ dan $p^k$ gacha bo‘lgan sonlar orasida aynan $p^k / p$ tasi $p$ ga bo‘linadi.
    Bundan quyidagi natija kelib chiqadi:

$$\phi(p^k) = p^k - p^{k-1}.$$
  - Agar $a$ va $b$ o‘zaro tub bo‘lsa:

    \[\phi(a b) = \phi(a) \cdot \phi(b).\]
    Bu munosabatning to‘g‘riligini darhol ko‘rish oson emas. U [Xitoy qoldiqlar teoremasi](chinese-remainder-theorem.md)dan kelib chiqadi. Xitoy qoldiqlar teoremasi har bir $0 \le x < a$ va har bir $0 \le y < b$ uchun $z \equiv x \pmod{a}$ hamda $z \equiv y \pmod{b}$ shartlarini qanoatlantiradigan yagona $0 \le z < a b$ mavjudligini kafolatlaydi. $z$ soni $a b$ bilan o‘zaro tub bo‘lishi uchun va faqat shuning uchun $x$ soni $a$ bilan, $y$ esa $b$ bilan o‘zaro tub bo‘lishi kerakligini ko‘rsatish qiyin emas.
Demak, $a b$ bilan o‘zaro tub butun sonlar soni $a$ va $b$ bilan o‘zaro tub sonlar miqdorlarining ko‘paytmasiga teng.
  - Umumiy holda, $a$ va $b$ o‘zaro tub bo‘lmasa ham,

    \[\phi(ab) = \phi(a) \cdot \phi(b) \cdot \dfrac{d}{\phi(d)}\]

    tenglik bajariladi, bu yerda $d = \gcd(a, b)$.

Shunday qilib, dastlabki uchta xossadan foydalanib, $n$ ni tub ko‘paytuvchilarga ajratish orqali $\phi(n)$ ni hisoblashimiz mumkin.
Agar $n = {p_1}^{a_1} \cdot {p_2}^{a_2} \cdots {p_k}^{a_k}$ bo‘lib, $p_i$ lar $n$ ning tub ko‘paytuvchilari bo‘lsa,
$$\begin{align}
\phi (n) &= \phi ({p_1}^{a_1}) \cdot \phi ({p_2}^{a_2}) \cdots  \phi ({p_k}^{a_k}) \\
&= \left({p_1}^{a_1} - {p_1}^{a_1 - 1}\right) \cdot \left({p_2}^{a_2} - {p_2}^{a_2 - 1}\right) \cdots \left({p_k}^{a_k} - {p_k}^{a_k - 1}\right) \\
&= p_1^{a_1} \cdot \left(1 - \frac{1}{p_1}\right) \cdot p_2^{a_2} \cdot \left(1 - \frac{1}{p_2}\right) \cdots p_k^{a_k} \cdot \left(1 - \frac{1}{p_k}\right) \\
&= n \cdot \left(1 - \frac{1}{p_1}\right) \cdot \left(1 - \frac{1}{p_2}\right) \cdots \left(1 - \frac{1}{p_k}\right)
\end{align}$$
## Implementatsiya

Quyidagi implementatsiya $O(\sqrt{n})$ vaqtda faktorizatsiyadan foydalanadi:

```cpp
int phi(int n) {
    int result = n;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            while (n % i == 0)
                n /= i;
            result -= result / i;
        }
    }
    if (n > 1)
        result -= result / n;
    return result;
}
```
## $1$ dan $n$ gacha Eyler totient funksiyasi $O(n \log\log{n})$ vaqtda { #etf_1_to_n data-toc-label="1 dan n gacha Eyler totient funksiyasi O(n log log n) vaqtda" }
Agar $1$ dan $n$ gacha bo‘lgan barcha sonlarning totient qiymati kerak bo‘lsa, $n$ ta sonning har birini faktorizatsiya qilish samarasiz.
[Eratosfen elagi](sieve-of-eratosthenes.md)dagi ayni g‘oyadan foydalanishimiz mumkin.
Usul yuqorida ko‘rsatilgan xossaga tayanadi, ammo har bir son uchun har bir tub ko‘paytuvchi bo‘yicha vaqtinchalik natijani yangilash o‘rniga, barcha tub sonlarni topamiz va har bir tub son uchun unga bo‘linadigan barcha sonlarning vaqtinchalik natijasini yangilaymiz.
Bu yondashuv mohiyatan Eratosfen elagi bilan bir xil bo‘lgani uchun, murakkabligi ham bir xil: $O(n \log \log n)$.

```cpp
void phi_1_to_n(int n) {
    vector<int> phi(n + 1);
    for (int i = 0; i <= n; i++)
        phi[i] = i;

    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) {
            for (int j = i; j <= n; j += i)
                phi[j] -= phi[j] / i;
        }
    }
}
```
### [Segmentlangan elak](sieve-of-eratosthenes.md#segmented-sieve) yordamida $L$ dan $R$ gacha totientlarni topish { data-toc-label="Segmentlangan elak yordamida L dan R gacha totientlarni topish" }

Agar $L$ dan $R$ gacha bo‘lgan barcha sonlarning totient qiymati kerak bo‘lsa, [segmentlangan elak](sieve-of-eratosthenes.md#segmented-sieve) yondashuvidan foydalanishimiz mumkin.
Algoritm avval [chiziqli elak](prime-sieve-linear.md) yordamida $O(\sqrt{R})$ vaqt va xotirada $\sqrt{R}$ gacha bo‘lgan barcha tub sonlarni oldindan hisoblaydi. Keyin $[L,R]$ oraliqdagi har bir son uchun shu tub sonlar bo‘ylab yurib, faktorizatsiyaga asoslangan $\phi$ formulasini qo‘llaydi. Har bir sonning hali faktorizatsiya qilinmagan qismini kuzatish uchun qoldiqlar massivini saqlaymiz. Agar barcha kichik tub sonlar ko‘rib chiqilgandan keyin qoldiq 1 dan katta bo‘lib qolsa, bu $\sqrt{R}$ dan katta tub ko‘paytuvchi mavjudligini bildiradi; u oxirgi o‘tishda qayta ishlanadi.
Oraliq uchun umumiy murakkablik $O((R - L + 1) \log \log R) + \sqrt{R}$.

```cpp
const long long MAX_RANGE = 1e6 + 6;
vector<long long> primes;
long long phi[MAX_RANGE], rem[MAX_RANGE];

vector<int> linear_sieve(int n) {
    vector<bool> composite(n + 1, 0);
    vector<int> prime;

    // 0 and 1 are not composite (nor prime)
    composite[0] = composite[1] = 1;
    for(int i = 2; i <= n; i++) {
        if(!composite[i]) prime.push_back(i);
        for(int j = 0; j < prime.size() && i * prime[j] <= n; j++) {
            composite[i * prime[j]] = true;
            if(i % prime[j] == 0) break;
        }
    }
    return prime;
}

// To get the value of phi(x) for L <= x <= R, use phi[x - L].
void segmented_phi(long long L, long long R) {
    for(long long i = L; i <= R; i++) {
        rem[i - L] = i;
        phi[i - L] = i;
    }
    for(long long i : primes) {
        for(long long j = max(i * i, (L + i - 1) / i * i); j <= R; j += i) {
            phi[j - L] -= phi[j - L] / i;
            while(rem[j - L] % i == 0) rem[j - L] /= i;
        }
    }

    for(long long i = 0; i < R - L + 1; i++) {
        if(rem[i] > 1) phi[i] -= phi[i] / rem[i];
    }
}
```
## Bo‘luvchilar yig‘indisi xossasi { #divsum}

Ushbu qiziqarli xossani Gauss aniqlagan:

$$ \sum_{d|n} \phi{(d)} = n$$

Bu yerda yig‘indi $n$ ning barcha musbat bo‘luvchilari $d$ bo‘yicha olinadi.

Masalan, 10 ning bo‘luvchilari 1, 2, 5 va 10.
Shuning uchun $\phi{(1)} + \phi{(2)} + \phi{(5)} + \phi{(10)} = 1 + 1 + 4 + 4 = 10$.
### Bo‘luvchilar yig‘indisi xossasi yordamida 1 dan $n$ gacha totientlarni topish { data-toc-label="Bo‘luvchilar yig‘indisi xossasi yordamida 1 dan n gacha totientlarni topish" }

Bo‘luvchilar yig‘indisi xossasi 1 dan $n$ gacha bo‘lgan barcha sonlarning totient qiymatini hisoblashga ham imkon beradi.
Bu implementatsiya Eratosfen elagiga asoslangan oldingi implementatsiyadan biroz sodda, biroq murakkabligi ham sal yomonroq: $O(n \log n)$.
```cpp
void phi_1_to_n(int n) {
    vector<int> phi(n + 1);
    phi[0] = 0;
    phi[1] = 1;
    for (int i = 2; i <= n; i++)
        phi[i] = i - 1;

    for (int i = 2; i <= n; i++)
        for (int j = 2 * i; j <= n; j += i)
              phi[j] -= phi[i];
}
```
## Eyler teoremasida qo‘llanishi { #application }

Eyler totient funksiyasining eng mashhur va muhim xossasi **Eyler teoremasi**da ifodalanadi:

$$a^{\phi(m)} \equiv 1 \pmod m \quad \text{if } a \text{ and } m \text{ are relatively prime.}$$

$m$ tub bo‘lgan xususiy holda Eyler teoremasi **Fermatning kichik teoremasi**ga aylanadi:

$$a^{m - 1} \equiv 1 \pmod m$$
Eyler teoremasi va Eyler totient funksiyasi amaliy masalalarda juda ko‘p uchraydi; masalan, ikkalasi ham [modul bo‘yicha multiplikativ teskari element](module-inverse.md)ni hisoblashda ishlatiladi.

Bevosita natija sifatida quyidagi ekvivalentlikni ham olamiz:

$$a^n \equiv a^{n \bmod \phi(m)} \pmod m$$

Bu juda katta $n$ uchun $x^n \bmod m$ ni hisoblash imkonini beradi; ayniqsa $n$ boshqa bir hisoblashning natijasi bo‘lsa, uni modul bo‘yicha hisoblash mumkin bo‘ladi.
### Guruhlar nazariyasi
$\phi(n)$ — $(\mathbb Z / n\mathbb Z)^\times$ [modul $n$ bo‘yicha multiplikativ guruhining tartibi](https://en.wikipedia.org/wiki/Multiplicative_group_of_integers_modulo_n), ya’ni birliklar guruhining (multiplikativ teskari elementga ega elementlar guruhining) o‘lchamidir. Multiplikativ teskari elementga ega elementlar aynan $n$ bilan o‘zaro tub bo‘lgan elementlardir.
$a$ elementning $n$ modul bo‘yicha [multiplikativ tartibi](https://en.wikipedia.org/wiki/Multiplicative_order), $\operatorname{ord}_n(a)$ bilan belgilanadi va $a^k \equiv 1 \pmod n$ bo‘ladigan eng kichik $k>0$ ga teng. $\operatorname{ord}_n(a)$ — $a$ hosil qilgan qismguruhning o‘lchami; shuning uchun Lagrange teoremasiga ko‘ra, istalgan $a$ ning multiplikativ tartibi $\phi(n)$ ni bo‘lishi kerak.
Agar $a$ ning multiplikativ tartibi mumkin bo‘lgan eng katta qiymat — $\phi(n)$ ga teng bo‘lsa, $a$ [primitiv ildiz](primitive-root.md) bo‘ladi va guruh ta’rifga ko‘ra siklikdir.
## Umumlashtirish

Oxirgi ekvivalentlikning kamroq mashhur bir ko‘rinishi bor; u $x$ va $m$ o‘zaro tub bo‘lmagan holatda ham $x^n \bmod m$ ni samarali hisoblash imkonini beradi.
Istalgan $x$, $m$ va $n \geq \log_2 m$ uchun:

$$x^{n}\equiv x^{\phi(m)+[n \bmod \phi(m)]} \mod m$$

Isbot:
$x$ va $m$ ning umumiy tub bo‘luvchilari $p_1, \dots, p_t$, ularning $m$ dagi darajalari esa $k_i$ bo‘lsin.
Ular yordamida $a = p_1^{k_1} \dots p_t^{k_t}$ ni aniqlaymiz; u holda $\frac{m}{a}$ soni $x$ bilan o‘zaro tub bo‘ladi.
$a$ soni $x^k$ ni bo‘ladigan eng kichik $k$ sonini olaylik.
$n \ge k$ deb faraz qilsak, quyidagini yozishimiz mumkin:
$$\begin{align}x^n \bmod m &= \frac{x^k}{a}ax^{n-k}\bmod m \\
&= \frac{x^k}{a}\left(ax^{n-k}\bmod m\right) \bmod m \\
&= \frac{x^k}{a}\left(ax^{n-k}\bmod a \frac{m}{a}\right) \bmod m \\
&=\frac{x^k}{a} a \left(x^{n-k} \bmod \frac{m}{a}\right)\bmod m \\
&= x^k\left(x^{n-k} \bmod \frac{m}{a}\right)\bmod m
\end{align}$$

Uchinchi va to‘rtinchi satrlarning teng kuchliligi $ab \bmod ac = a(b \bmod c)$ faktidan kelib chiqadi.
Haqiqatan, $b = cd + r$ va $r < c$ bo‘lsa, $ab = acd + ar$ hamda $ar < ac$ bo‘ladi.
$x$ va $\frac{m}{a}$ o‘zaro tub bo‘lgani uchun Eyler teoremasini qo‘llab, quyidagi samarali formulani olamiz ($k$ juda kichik; aslida $k \le \log_2 m$):

$$x^n \bmod m = x^k\left(x^{n-k \bmod \phi(\frac{m}{a})} \bmod \frac{m}{a}\right)\bmod m.$$
Bu formulani bevosita qo‘llash qiyin, ammo undan $x^n \bmod m$ ning xatti-harakatini tahlil qilishda foydalanish mumkin. $(x^1 \bmod m, x^2 \bmod m, x^3 \bmod m, \dots)$ darajalar ketma-ketligi dastlabki $k$ ta (yoki undan kam) elementdan so‘ng uzunligi $\phi\left(\frac{m}{a}\right)$ bo‘lgan siklga kirishini ko‘ramiz.
$\phi\left(\frac{m}{a}\right)$ soni $\phi(m)$ ni bo‘ladi (chunki $a$ va $\frac{m}{a}$ o‘zaro tub bo‘lgani uchun $\phi(a) \cdot \phi\left(\frac{m}{a}\right) = \phi(m)$), demak davr uzunligi $\phi(m)$ deb ham aytishimiz mumkin.
$\phi(m) \ge \log_2 m \ge k$ bo‘lgani sababli, bizga kerak bo‘lgan ancha sodda formulaga kelamiz:
$$ x^n \equiv x^{\phi(m)} x^{(n - \phi(m)) \bmod \phi(m)} \bmod m \equiv x^{\phi(m)+[n \bmod \phi(m)]} \mod m.$$
## Mashq masalalari
* [SPOJ #4141 "Euler Totient Function" [Qiyinlik: juda oson]](http://www.spoj.com/problems/ETF/)
* [UVA #10179 "Irreducible Basic Fractions" [Qiyinlik: oson]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1120)
* [UVA #10299 "Relatives" [Qiyinlik: oson]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1240)
* [UVA #11327 "Enumerating Rational Numbers" [Qiyinlik: o‘rta]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2302)
* [TIMUS #1673 "Admission to Exam" [Qiyinlik: yuqori]](http://acm.timus.ru/problem.aspx?space=1&num=1673)
* [UVA 10990 - Another New Function](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1931)
* [Codechef - Golu and Sweetness](https://www.codechef.com/problems/COZIE)
* [SPOJ - LCM Sum](http://www.spoj.com/problems/LCMSUM/)
* [GYM - Simple Calculations  (F)](http://codeforces.com/gym/100975)
* [UVA 13132 - Laser Mirrors](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5043)
* [SPOJ - GCDEX](http://www.spoj.com/problems/GCDEX/)
* [UVA 12995 - Farey Sequence](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4878)
* [SPOJ - Totient in Permutation (easy)](http://www.spoj.com/problems/TIP1/)
* [LOJ - Mathematically Hard](http://lightoj.com/volume_showproblem.php?problem=1007)
* [SPOJ - Totient Extreme](http://www.spoj.com/problems/DCEPCA03/)
* [SPOJ - Playing with GCD](http://www.spoj.com/problems/NAJPWG/)
* [SPOJ - G Force](http://www.spoj.com/problems/DCEPC12G/)
* [SPOJ - Smallest Inverse Euler Totient Function](http://www.spoj.com/problems/INVPHI/)
* [Codeforces - Power Tower](http://codeforces.com/problemset/problem/906/D)
* [Kattis - Exponial](https://open.kattis.com/problems/exponial)
* [LeetCode - 372. Super Pow](https://leetcode.com/problems/super-pow/)
* [Codeforces - The Holmes Children](http://codeforces.com/problemset/problem/776/E)
* [Codeforces - Small GCD](https://codeforces.com/contest/1900/problem/D)
