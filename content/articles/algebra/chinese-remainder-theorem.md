---
article_id: algebra--chinese-remainder-theorem
---
# Xitoy qoldiqlar teoremasi

Xitoy qoldiqlar teoremasini (maqolaning qolgan qismida XQT deb yuritamiz) xitoylik matematik Sun Zi kashf qilgan.
## Ifodalanishi

$m = m_1 \cdot m_2 \cdots m_k$ bo‘lsin, bu yerda $m_i$ lar juft-jufti bilan o‘zaro tub. $m_i$ lardan tashqari quyidagi kongruensiyalar sistemasi ham berilgan:

$$\left\{\begin{array}{rcl}
    a & \equiv & a_1 \pmod{m_1} \\
    a & \equiv & a_2 \pmod{m_2} \\
      & \vdots & \\
    a & \equiv & a_k \pmod{m_k}
\end{array}\right.$$

bu yerda $a_i$ lar berilgan o‘zgarmas sonlar. XQTning dastlabki shakli berilgan kongruensiyalar sistemasi $m$ modul bo‘yicha har doim *bitta va faqat bitta* yechimga ega ekanini aytadi.
Masalan,

$$\left\{\begin{array}{rcl}
    a & \equiv & 2 \pmod{3} \\
    a & \equiv & 3 \pmod{5} \\
    a & \equiv & 2 \pmod{7}
\end{array}\right.$$

kongruensiyalar sistemasi $105$ modul bo‘yicha $23$ yechimga ega, chunki $23 \bmod{3} = 2$, $23 \bmod{5} = 3$ va $23 \bmod{7} = 2$.
Barcha yechimlarni $k \in \mathbb{Z}$ uchun $23 + 105\cdot k$ ko‘rinishida yozish mumkin.
### Natija

XQTdan quyidagi tenglama

$$x \equiv a \pmod{m}$$

quyidagi tenglamalar sistemasiga teng kuchli ekani kelib chiqadi:

$$\left\{\begin{array}{rcl}
    x & \equiv & a_1 \pmod{m_1} \\
      & \vdots & \\
    x & \equiv & a_k \pmod{m_k}
\end{array}\right.$$

(Yuqoridagidek, $m = m_1 m_2 \cdots m_k$ va $m_i$ lar juft-jufti bilan o‘zaro tub deb faraz qilamiz.)
## Ikki modul uchun yechim

O‘zaro tub $m_1,m_2$ uchun ikki tenglamali sistemani ko‘rib chiqamiz:

$$
\left\{\begin{align}
    a &\equiv a_1 \pmod{m_1} \\
    a &\equiv a_2 \pmod{m_2} \\
\end{align}\right.
$$

$a \pmod{m_1m_2}$ uchun yechim topmoqchimiz. [Kengaytirilgan Evklid algoritmi](extended-euclid-algorithm.md) yordamida shunday Bézout koeffitsiyentlari $n_1,n_2$ ni topishimiz mumkinki,

$$n_1 m_1 + n_2 m_2 = 1.$$
Aslida $n_1$ va $n_2$ mos ravishda $m_1$ va $m_2$ ning $m_2$ hamda $m_1$ bo‘yicha [modul teskari elementlari](module-inverse.md)dir.
$n_1m_1 \equiv 1 \pmod{m_2}$ bo‘lgani uchun $n_1 \equiv m_1^{-1} \pmod{m_2}$; xuddi shuningdek, $n_2 \equiv m_2^{-1} \pmod{m_1}$.

Shu ikki koeffitsiyent yordamida yechimni aniqlaymiz:

$$a = a_1 n_2 m_2 + a_2 n_1 m_1 \bmod{m_1 m_2}$$

$a \bmod{m_1}$ va $a \bmod{m_2}$ ni hisoblab, bu haqiqatan ham yechim ekanini oson tekshirish mumkin:
$$
\begin{array}{rcll}
a & \equiv & a_1 n_2 m_2 + a_2 n_1 m_1 & \pmod{m_1}\\
  & \equiv & a_1 (1 - n_1 m_1) + a_2 n_1 m_1 & \pmod{m_1}\\
  & \equiv & a_1 - a_1 n_1 m_1 + a_2 n_1 m_1 & \pmod{m_1}\\
  & \equiv & a_1 & \pmod{m_1}
\end{array}
$$

Xitoy qoldiqlar teoremasi $m_1m_2$ modul bo‘yicha faqat bitta yechim mavjudligini ham kafolatlashiga e’tibor bering.
Buni ham oson isbotlash mumkin.
Ikki xil $x$ va $y$ yechim mavjud deb faraz qilamiz.
$x \equiv a_i \pmod{m_i}$ va $y \equiv a_i \pmod{m_i}$ bo‘lgani sababli, $x-y \equiv 0 \pmod{m_i}$; bundan $x-y \equiv 0 \pmod{m_1m_2}$, yoki teng kuchli ravishda $x \equiv y \pmod{m_1m_2}$ kelib chiqadi.
Demak, $x$ va $y$ aslida bitta yechimdir.
## Umumiy hol uchun yechim

### Induktiv yechim

$m_1m_2$ soni $m_3$ bilan o‘zaro tub bo‘lgani sababli, istalgan sondagi modullar uchun ikki modulga oid yechimni induktiv ravishda takroran qo‘llashimiz mumkin.
Avval dastlabki ikki kongruensiyadan foydalanib $b_2 := a \pmod{m_1m_2}$ ni hisoblaymiz,
so‘ng $a \equiv b_2 \pmod{m_1m_2}$ va $a \equiv a_3 \pmod{m_3}$ kongruensiyalaridan foydalanib $b_3 := a \pmod{m_1m_2m_3}$ ni hisoblaymiz va hokazo.
### Bevosita qurish

Lagrange interpolyatsiyasiga o‘xshash bevosita konstruksiya ham mumkin.

$M_i := \prod_{i \neq j}m_j$ — $m_i$ dan boshqa barcha modullar ko‘paytmasi, $N_i$ esa $N_i := M_i^{-1} \bmod{m_i}$ modul teskari element bo‘lsin.
U holda kongruensiyalar sistemasining yechimi:

$$a \equiv \sum_{i=1}^k a_i M_i N_i \pmod{m_1 m_2 \cdots m_k}$$

Bu haqiqatan yechim ekanini barcha $i$ lar uchun $a \bmod{m_i}$ ni hisoblash orqali tekshirish mumkin.
$i \neq j$ bo‘lganda $M_j$ soni $m_i$ ga karrali bo‘lgani uchun:
$$\begin{array}{rcll}
a & \equiv & \sum_{j=1}^k a_j M_j N_j & \pmod{m_i} \\
  & \equiv & a_i M_i N_i              & \pmod{m_i} \\
  & \equiv & a_i M_i M_i^{-1}         & \pmod{m_i} \\
  & \equiv & a_i                      & \pmod{m_i}
\end{array}$$
### Implementatsiya

```{.cpp file=chinese_remainder_theorem}
struct Congruence {
    long long a, m;
};

long long chinese_remainder_theorem(vector<Congruence> const& congruences) {
    long long M = 1;
    for (auto const& congruence : congruences) {
        M *= congruence.m;
    }
    long long solution = 0;
    for (auto const& congruence : congruences) {
        long long a_i = congruence.a;
        long long M_i = M / congruence.m;
        long long N_i = mod_inv(M_i, congruence.m);
        solution = (solution + a_i * M_i % M * N_i) % M;
    }
    return solution;
}
```
## O‘zaro tub bo‘lmagan modullar uchun yechim

Yuqorida aytilganidek, oldingi algoritm faqat o‘zaro tub $m_1,m_2,\dots,m_k$ modullar uchun ishlaydi.

Modullar o‘zaro tub bo‘lmagan holda kongruensiyalar sistemasi $\operatorname{lcm}(m_1,m_2,\dots,m_k)$ modul bo‘yicha aynan bitta yechimga ega bo‘ladi yoki umuman yechimga ega bo‘lmaydi.

Masalan, quyidagi sistemada birinchi kongruensiya yechim toq bo‘lishini, ikkinchisi esa yechim juft bo‘lishini talab qiladi.
Son bir vaqtning o‘zida ham toq, ham juft bo‘lishi mumkin emas; shuning uchun yechim yo‘qligi ravshan.
$$\left\{\begin{align}
    a & \equiv 1 \pmod{4} \\
    a & \equiv 2 \pmod{6}
\end{align}\right.$$

Sistemaning yechimi bor-yo‘qligini aniqlash juda oson.
Agar yechim bo‘lsa, biroz o‘zgartirilgan kongruensiyalar sistemasiga dastlabki algoritmni qo‘llashimiz mumkin.

Bitta $a \equiv a_i \pmod{m_i}$ kongruensiya, $p_1^{n_1}p_2^{n_2}\cdots p_k^{n_k}$ soni $m_i$ ning tub ko‘paytuvchilarga ajratilishi bo‘lganda, $a \equiv a_i \pmod{p_j^{n_j}}$ kongruensiyalar sistemasiga teng kuchli.
Bu faktdan foydalanib, sistemani modullari faqat tub sonlarning darajalaridan iborat sistemaga aylantira olamiz.
Masalan, yuqoridagi sistema quyidagiga teng kuchli:

$$\left\{\begin{array}{ll}
    a \equiv 1          & \pmod{4} \\
    a \equiv 2 \equiv 0 & \pmod{2} \\
    a \equiv 2          & \pmod{3}
\end{array}\right.$$

Dastlab ba’zi modullarda umumiy ko‘paytuvchilar bo‘lgani uchun, bir xil tub songa asoslangan, ammo darajalari turlicha bo‘lishi mumkin bo‘lgan bir nechta kongruensiya hosil bo‘ladi.
Bir xil tub songa asoslangan kongruensiyalar orasida eng katta tub darajali modulga ega kongruensiya eng kuchlisi bo‘lishini ko‘rish mumkin.
U boshqa bir kongruensiya bilan zid keladi yoki qolgan kongruensiyalarning barchasini allaqachon keltirib chiqaradi.

Bizning holimizda $a \equiv 1 \pmod 4$ kongruensiya $a \equiv 1 \pmod 2$ ni keltirib chiqaradi va shu sababli $a \equiv 0 \pmod 2$ ikkinchi kongruensiyaga zid.
Demak, bu kongruensiyalar sistemasining yechimi yo‘q.
Agar zidlik bo‘lmasa, tenglamalar sistemasi yechimga ega.
Eng katta tub darajali modullarga ega kongruensiyalardan boshqa barcha kongruensiyalarni e’tibordan chetda qoldirishimiz mumkin.
Endi bu modullar o‘zaro tub bo‘ladi va sistemani yuqoridagi bo‘limlarda muhokama qilingan algoritm bilan yechish mumkin.

Masalan, quyidagi sistema $\operatorname{lcm}(10,12)=60$ modul bo‘yicha yechimga ega:

$$\left\{\begin{align}
    a & \equiv 3 \pmod{10} \\
    a & \equiv 5 \pmod{12}
\end{align}\right.$$
Kongruensiyalar sistemasi quyidagi sistemaga teng kuchli:

$$\left\{\begin{align}
    a & \equiv 3 \equiv 1 \pmod{2} \\
    a & \equiv 3 \equiv 3 \pmod{5} \\
    a & \equiv 5 \equiv 1 \pmod{4} \\
    a & \equiv 5 \equiv 2 \pmod{3}
\end{align}\right.$$

Bir xil tub modulga ega yagona kongruensiyalar $a \equiv 1 \pmod 4$ va $a \equiv 1 \pmod 2$ dir.
Birinchisi ikkinchisini allaqachon keltirib chiqaradi; shuning uchun ikkinchisini tashlab, o‘rniga o‘zaro tub modulli quyidagi sistemani yechamiz:
$$\left\{\begin{align}
    a & \equiv 3 \equiv 3 \pmod{5} \\
    a & \equiv 5 \equiv 1 \pmod{4} \\
    a & \equiv 5 \equiv 2 \pmod{3}
\end{align}\right.$$

Uning yechimi $53 \pmod{60}$; haqiqatan ham $53 \bmod{10}=3$ va $53 \bmod{12}=5$.
## Garner algoritmi

XQTning yana bir natijasi shuki, katta sonlarni kichik butun sonlar massivi yordamida ifodalashimiz mumkin.
Juda katta sonlar bilan ko‘p hisoblashlar bajarish (masalan, 1000 xonali sonlarni bo‘lish) qimmat bo‘lishi mumkin; buning o‘rniga bir nechta o‘zaro tub modul tanlab, katta sonni kongruensiyalar sistemasi sifatida ifodalash va barcha amallarni shu sistema ustida bajarish mumkin.
$m_1m_2\cdots m_k$ dan kichik istalgan $a$ soni $a_1,\ldots,a_k$ massivi bilan ifodalanadi, bu yerda $a \equiv a_i \pmod{m_i}$.
Yuqoridagi algoritm yordamida katta sonni kerak bo‘lgan paytda qayta tiklash mumkin.

Muqobil ravishda sonni **aralash asosli** ko‘rinishda ifodalash mumkin:

$$a = x_1 + x_2 m_1 + x_3 m_1 m_2 + \ldots + x_k m_1 \cdots m_{k-1} \text{ with }x_i \in [0, m_i)$$

Alohida [Garner algoritmi](garners-algorithm.md) maqolasida muhokama qilingan Garner algoritmi $x_i$ koeffitsiyentlarni hisoblaydi.
Shu koeffitsiyentlar yordamida to‘liq sonni qayta tiklash mumkin.
## Mashq masalalari:

* [Google Code Jam - Golf Gophers](https://github.com/google/coding-competitions-archive/blob/main/codejam/2019/round_1a/golf_gophers/statement.pdf)
* [Hackerrank - Number of sequences](https://www.hackerrank.com/contests/w22/challenges/number-of-sequences)
* [Codeforces - Remainders Game](http://codeforces.com/problemset/problem/687/B)
