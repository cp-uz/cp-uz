---
article_id: algebra--module-inverse
---
# Modul bo‘yicha multiplikativ teskari element

## Ta’rif

$a$ butun sonining [modul bo‘yicha multiplikativ teskari elementi](http://en.wikipedia.org/wiki/Modular_multiplicative_inverse) — $a\cdot x$ ko‘paytma biror $m$ modul bo‘yicha $1$ ga kongruent bo‘ladigan $x$ butun sonidir.
Formal yozuvda shunday $x$ butun sonni topmoqchimizki,

$$a \cdot x \equiv 1 \mod m.$$

$x$ ni shunchaki $a^{-1}$ bilan ham belgilaymiz.
Modul bo‘yicha teskari element har doim mavjud bo‘lavermasligini ta’kidlash kerak. Masalan, $m=4$, $a=2$ bo‘lsin.
$m$ modul bo‘yicha barcha mumkin bo‘lgan qiymatlarni tekshirib, yuqoridagi tenglamani qanoatlantiradigan $a^{-1}$ ni topib bo‘lmasligini ko‘rish mumkin.
Modul teskari element faqat va faqat $a$ hamda $m$ o‘zaro tub bo‘lganda (ya’ni $\gcd(a,m)=1$ bo‘lganda) mavjudligini isbotlash mumkin.
Ushbu maqolada teskari element mavjud bo‘lgan holatda uni topishning ikki usuli va barcha sonlarning modul teskari elementlarini chiziqli vaqtda topish usulini ko‘rsatamiz.
## Kengaytirilgan Evklid algoritmi yordamida modul teskari elementni topish

Quyidagi tenglamani ko‘rib chiqamiz ($x$ va $y$ noma’lum):

$$a \cdot x + m \cdot y = 1$$

Bu ikki o‘zgaruvchili [chiziqli Diofant tenglamasi](linear-diophantine-equation.md).
Havola qilingan maqolada ko‘rsatilganidek, $\gcd(a,m)=1$ bo‘lganda tenglama yechimga ega va uni [kengaytirilgan Evklid algoritmi](extended-euclid-algorithm.md) yordamida topish mumkin.
$\gcd(a,m)=1$ modul teskari element mavjudligining ayni sharti ekaniga e’tibor bering.
Endi tenglamaning ikkala tomonini $m$ modul bo‘yicha olsak, $m\cdot y$ hadi yo‘qoladi va tenglama quyidagi ko‘rinishga keladi:

$$a \cdot x \equiv 1 \mod m$$

Demak, $a$ ning modul teskari elementi $x$ dir.

Implementatsiya quyidagicha:

```cpp
int x, y;
int g = extended_euclidean(a, m, x, y);
if (g != 1) {
    cout << "No solution!";
}
else {
    x = (x % m + m) % m;
    cout << x << endl;
}
```
`x` ni qanday o‘zgartirayotganimizga e’tibor bering.
Kengaytirilgan Evklid algoritmi qaytargan `x` manfiy bo‘lishi mumkin, shuning uchun `x % m` ham manfiy chiqishi ehtimoli bor; uni musbat qilish uchun avval `m` ni qo‘shish kerak.

<div id="fermat-euler"></div>
## Ikkilik darajaga oshirish yordamida modul teskari elementni topish

Modul teskari elementni topishning yana bir usuli Eyler teoremasidan foydalanadi. Bu teorema $a$ va $m$ o‘zaro tub bo‘lganda quyidagi kongruensiya bajarilishini aytadi:

$$a^{\phi (m)} \equiv 1 \mod m$$
$\phi$ — [Eylerning totient funksiyasi](phi-function.md).
Yana bir bor, $a$ va $m$ ning o‘zaro tub bo‘lishi modul teskari element mavjudligi uchun ham ayni shart ekaniga e’tibor bering.

Agar $m$ tub son bo‘lsa, bu [Fermatning kichik teoremasi](http://en.wikipedia.org/wiki/Fermat's_little_theorem)ga soddalashadi:

$$a^{m - 1} \equiv 1 \mod m$$

Yuqoridagi tenglamalarning ikkala tomonini $a^{-1}$ ga ko‘paytirsak:
* Ixtiyoriy (ammo $a$ bilan o‘zaro tub) $m$ modul uchun: $a ^ {\phi (m) - 1} \equiv a ^{-1} \mod m$.
* Tub $m$ modul uchun: $a ^ {m - 2} \equiv a ^ {-1} \mod m$.

Bu natijalardan foydalanib, $O(\log m)$ vaqtda ishlaydigan [ikkilik darajaga oshirish algoritmi](binary-exp.md) yordamida modul teskari elementni oson topish mumkin.
Bu usul oldingi paragrafdagi usuldan tushunish osonroq bo‘lsa-da, $m$ tub bo‘lmagan holda Eyler phi-funksiyasini hisoblash kerak; bu esa $m$ ni faktorizatsiya qilishni talab qiladi va juda qiyin bo‘lishi mumkin. Agar $m$ ning tub ko‘paytuvchilarga ajratilishi ma’lum bo‘lsa, ushbu usulning murakkabligi $O(\log m)$.

<div id="finding-the-modular-inverse-using-euclidean-division"></div>
## Evklid bo‘linishi yordamida tub modullar uchun modul teskari elementni topish

$m>a$ bo‘lgan tub modul berilgan bo‘lsin (yoki bir qadamda modul olib $a$ ni kichraytirishimiz mumkin). [Evklid bo‘linishi](https://en.wikipedia.org/wiki/Euclidean_division)ga ko‘ra:

$$m = k \cdot a + r$$

bu yerda $k=\left\lfloor\frac{m}{a}\right\rfloor$ va $r=m\bmod a$. U holda:
$$
\begin{align*}
& \implies & 0          & \equiv k \cdot a + r   & \mod m \\
& \iff & r              & \equiv -k \cdot a      & \mod m \\
& \iff & r \cdot a^{-1} & \equiv -k              & \mod m \\
& \iff & a^{-1}         & \equiv -k \cdot r^{-1} & \mod m
\end{align*}
$$
$m$ tub bo‘lmasa, bu mulohaza umumiy holda to‘g‘ri emas, chunki $a^{-1}$ ning mavjudligi $r^{-1}$ ning mavjudligini anglatmaydi.
Buni ko‘rish uchun yuqoridagi formula yordamida $12$ modul bo‘yicha $5^{-1}$ ni hisoblab ko‘ramiz. Javob $5$ chiqishini istaymiz, chunki $5\cdot5\equiv1\bmod12$. Biroq $12=2\cdot5+2$, ya’ni $k=2$ va $r=2$, holbuki $2$ ning $12$ modul bo‘yicha teskari elementi yo‘q.
Modul tub bo‘lsa, $0<a<m$ bo‘lgan barcha $a$ lar $m$ modul bo‘yicha invertirlanuvchi; shuning uchun $m$ ga nisbatan $a$ sonining modul teskari elementini hisoblaydigan quyidagi rekursiv C++ funksiyani yozish mumkin:

```{.cpp file=modular_inverse_euclidean_division}
int inv(int a) {
  return a <= 1 ? a : m - (long long)(m/a) * inv(m % a) % m;
}
```
Bu rekursiyaning aniq vaqt murakkabligi noma’lum. U $O(\frac{\log m}{\log\log m})$ bilan $O(m^{\frac{1}{3}-\frac{2}{177}+\epsilon})$ orasida.
[On the length of Pierce expansions](https://arxiv.org/abs/2211.08374) maqolasiga qarang.
Amalda bu implementatsiya tez ishlaydi: masalan, $10^9+7$ modul uchun har doim 50 tadan kam iteratsiyada tugaydi.
<div id="mod-inv-all-num"></div>
Ushbu formulani qo‘llab, $[1,m-1]$ oraliqdagi har bir sonning modul teskari elementini $O(m)$ vaqtda oldindan hisoblashimiz ham mumkin.

```{.cpp file=modular_inverse_euclidean_division_all}
inv[1] = 1;
for(int a = 2; a < m; ++a)
    inv[a] = m - (long long)(m/a) * inv[m%a] % m;
```
## Sonlar massivi uchun $m$ modul bo‘yicha teskari elementlarni topish

Bizga massiv berilgan va undagi barcha sonlarning modul teskari elementini topmoqchimiz deb faraz qilaylik (ularning barchasi invertirlanuvchi).
Har bir son uchun teskari elementni alohida hisoblash o‘rniga, kasrni o‘zidan tashqari prefiks ko‘paytma va o‘zidan tashqari suffiks ko‘paytma bilan kengaytirishimiz mumkin; natijada faqat bitta teskari elementni hisoblash yetadi:
$$
\begin{align}
x_i^{-1} &= \frac{1}{x_i} = \frac{\overbrace{x_1 \cdot x_2 \cdots x_{i-1}}^{\text{prefix}_{i-1}} \cdot ~1~ \cdot \overbrace{x_{i+1} \cdot x_{i+2} \cdots x_n}^{\text{suffix}_{i+1}}}{x_1 \cdot x_2 \cdots x_{i-1} \cdot x_i \cdot x_{i+1} \cdot x_{i+2} \cdots x_n} \\
&= \text{prefix}_{i-1} \cdot \text{suffix}_{i+1} \cdot \left(x_1 \cdot x_2 \cdots x_n\right)^{-1}
\end{align}
$$
Kodda o‘zini hisobga olmaydigan prefiks ko‘paytmalar massivini (neytral elementdan boshlab) tuzamiz, barcha sonlar ko‘paytmasining modul teskari elementini hisoblaymiz va uni o‘zini hisobga olmaydigan prefiks hamda suffiks ko‘paytmalarga ko‘paytiramiz.
Suffiks ko‘paytma orqadan oldinga qarab yurish orqali hisoblanadi.
```cpp
std::vector<int> invs(const std::vector<int> &a, int m) {
    int n = a.size();
    if (n == 0) return {};
    std::vector<int> b(n);
    int v = 1;
    for (int i = 0; i != n; ++i) {
        b[i] = v;
        v = static_cast<long long>(v) * a[i] % m;
    }
    int x, y;
    extended_euclidean(v, m, x, y);
    x = (x % m + m) % m;
    for (int i = n - 1; i >= 0; --i) {
        b[i] = static_cast<long long>(x) * b[i] % m;
        x = static_cast<long long>(x) * a[i] % m;
    }
    return b;
}
```
## Mashq masalalari
* [UVa 11904 - One Unit Machine](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3055)
* [Hackerrank - Longest Increasing Subsequence Arrays](https://www.hackerrank.com/contests/world-codesprint-5/challenges/longest-increasing-subsequence-arrays)
* [Codeforces 300C - Beautiful Numbers](http://codeforces.com/problemset/problem/300/C)
* [Codeforces 622F - The Sum of the k-th Powers](http://codeforces.com/problemset/problem/622/F)
* [Codeforces 717A - Festival Organization](http://codeforces.com/problemset/problem/717/A)
* [Codeforces 896D - Nephren Runs a Cinema](http://codeforces.com/problemset/problem/896/D)
