---
article_id: algebra--continued-fractions
---
# Uzluksiz kasrlar

**Uzluksiz kasr** — haqiqiy sonni ratsional sonlarning maxsus yaqinlashuvchi ketma-ketligi orqali ifodalash usuli. Ular musobaqaviy dasturlashda foydali, chunki ularni hisoblash oson va berilgan qiymatdan oshmaydigan maxrajlar orasida asosiy haqiqiy sonning eng yaxshi ratsional yaqinlashuvini samarali topish mumkin.
Bundan tashqari, uzluksiz kasrlar Evklid algoritmi bilan chambarchas bog‘langan; shu sababli ular ko‘plab sonlar nazariyasiga oid masalalarda ishlatiladi.

## Uzluksiz kasr ko‘rinishi

!!! info "Ta’rif"
    $a_0, a_1, \dots, a_k \in \mathbb Z$ va $a_1, a_2, \dots, a_k \geq 1$ bo‘lsin. U holda

    $$r=a_0 + \frac{1}{a_1 + \frac{1}{\dots + \frac{1}{a_k}}},$$

    ifoda $r$ ratsional sonining **uzluksiz kasr ko‘rinishi** deb ataladi va qisqacha $r=[a_0;a_1,a_2,\dots,a_k]$ tarzida belgilanadi.

??? example
    $r = \frac{5}{3}$ bo‘lsin. Uni uzluksiz kasr ko‘rinishida ifodalashning ikki usuli bor:
    $$
    \begin{align}
    r = [1;1,1,1] &= 1+\frac{1}{1+\frac{1}{1+\frac{1}{1}}},\\
    r = [1;1,2] &= 1+\frac{1}{1+\frac{1}{2}}.
    \end{align}
    $$

Har qanday ratsional sonni uzluksiz kasr ko‘rinishida aynan $2$ usulda ifodalash mumkinligini isbotlash mumkin:

$$r = [a_0;a_1,\dots,a_k,1] = [a_0;a_1,\dots,a_k+1].$$

Bundan tashqari, $r=\frac{p}{q}$ uchun bunday uzluksiz kasrning $k$ uzunligi $k = O(\log \min(p, q))$ deb baholanadi.
Buning sababi uzluksiz kasrni qurish tafsilotlarini ko‘rib chiqqanimizda ayon bo‘ladi.

!!! info "Ta’rif"
    $a_0,a_1,a_2, \dots$ — $a_1, a_2, \dots \geq 1$ shartni qanoatlantiruvchi butun sonlar ketma-ketligi bo‘lsin. $r_k = [a_0; a_1, \dots, a_k]$ deb olamiz. U holda

    $$r = a_0 + \frac{1}{a_1 + \frac{1}{a_2+\dots}} = \lim\limits_{k \to \infty} r_k$$

    ifoda $r$ irratsional sonining **uzluksiz kasr ko‘rinishi** deb ataladi va qisqacha $r = [a_0;a_1,a_2,\dots]$ tarzida belgilanadi.

$r=[a_0;a_1,\dots]$ va butun $k$ uchun $r+k = [a_0+k; a_1, \dots]$ bo‘lishiga e’tibor bering.

Yana bir muhim kuzatuv: $a_0 > 0$ bo‘lsa, $\frac{1}{r}=[0;a_0, a_1, \dots]$; $a_0 = 0$ bo‘lsa esa, $\frac{1}{r} = [a_1; a_2, \dots]$.

!!! info "Ta’rif"
    Yuqoridagi ta’rifdagi $r_0, r_1, r_2, \dots$ ratsional sonlar $r$ ning **konvergentlari** deb ataladi.

    Mos ravishda, alohida $r_k = [a_0; a_1, \dots, a_k] = \frac{p_k}{q_k}$ soni $r$ ning $k$-**konvergenti** deb ataladi.

??? example
    $r = [1; 1, 1, 1, \dots]$ ni ko‘rib chiqamiz. Induksiya yordamida $r_k = \frac{F_{k+2}}{F_{k+1}}$ ekanini isbotlash mumkin; bu yerda $F_k$ — $F_0 = 0$, $F_1 = 1$ va $F_{k} = F_{k-1} + F_{k-2}$ orqali aniqlangan Fibonacci ketma-ketligi. Binet formulasidan

    $$r_k = \frac{\phi^{k+2} - \psi^{k+2}}{\phi^{k+1} - \psi^{k+1}},$$

    ekani ma’lum; bu yerda $\phi = \frac{1+\sqrt{5}}{2} \approx 1.618$ — oltin nisbat va $\psi = \frac{1-\sqrt{5}}{2} = -\frac{1}{\phi} \approx -0.618$. Demak,

    $$r = 1+\frac{1}{1+\frac{1}{1+\dots}}=\lim\limits_{k \to \infty} r_k = \phi = \frac{1+\sqrt{5}}{2}.$$

    Aynan shu holatda $r$ ni topishning boshqa yo‘li

    $$r = 1+\frac{1}{r} \implies r^2 = r + 1$$

    tenglamani yechishdan iborat bo‘lishi mumkinligiga e’tibor bering.

!!! info "Ta’rif"
    $r_k = [a_0; a_1, \dots, a_{k-1}, a_k]$ bo‘lsin. $1 \leq t \leq a_k$ uchun $[a_0; a_1, \dots, a_{k-1}, t]$ sonlari **yarim konvergentlar** deb ataladi.
    Odatda $r$ dan katta (yarim) konvergentlarni **yuqori** (yarim) konvergentlar, $r$ dan kichiklarini esa **quyi** (yarim) konvergentlar deb ataymiz.

!!! info "Ta’rif"
    Konvergentlarga qo‘shimcha ravishda, **[to‘liq bo‘linmalar](https://en.wikipedia.org/wiki/Complete_quotient)** ni $s_k = [a_k; a_{k+1}, a_{k+2}, \dots]$ tarzida aniqlaymiz.

    Mos ravishda, alohida $s_k$ ni $r$ ning $k$-to‘liq bo‘linmasi deb ataymiz.

Yuqoridagi ta’riflardan $k \geq 1$ uchun $s_k \geq 1$ ekani kelib chiqadi.

$[a_0; a_1, \dots, a_k]$ ni formal algebraik ifoda sifatida qarab, $a_i$ lar o‘rnida ixtiyoriy haqiqiy sonlarga ruxsat bersak,

$$r = [a_0; a_1, \dots, a_{k-1}, s_k]$$

ni olamiz.

Xususan, $r = [s_0] = s_0$. Boshqa tomondan, $s_k$ ni

$$s_k = [a_k; s_{k+1}] = a_k + \frac{1}{s_{k+1}}$$

ko‘rinishida yozish mumkin. Demak, $s_k$ dan $a_k = \lfloor s_k \rfloor$ va $s_{k+1} = (s_k - a_k)^{-1}$ ni hisoblaymiz.
$s_k=a_k$ bo‘lmasa, $a_0, a_1, \dots$ ketma-ketlik aniq aniqlangan; tenglik faqat $r$ ratsional son bo‘lganda yuz beradi.

Shunday qilib, har qanday irratsional $r$ soni uchun uzluksiz kasr ko‘rinishi yagona aniqlanadi.

### Implementatsiya

Kod namunalarida asosan chekli uzluksiz kasrlarni qaraymiz.

$s_k$ dan $s_{k+1}$ ga o‘tish

$$s_k =\left\lfloor s_k \right\rfloor + \frac{1}{s_{k+1}}$$

ko‘rinishiga ega.

Bu ifodadan keyingi to‘liq bo‘linma

$$s_{k+1} = \left(s_k-\left\lfloor s_k\right\rfloor\right)^{-1}$$

sifatida topiladi.

$s_k=\frac{p}{q}$ uchun bu

$$
s_{k+1} = \left(\frac{p}{q}-\left\lfloor \frac{p}{q} \right\rfloor\right)^{-1} = \frac{q}{p-q\cdot \lfloor \frac{p}{q} \rfloor} = \frac{q}{p \bmod q}
$$

degani.

Shunday qilib, $r=\frac{p}{q}$ ning uzluksiz kasr ko‘rinishini hisoblash $p$ va $q$ uchun Evklid algoritmi qadamlari bilan bir xil.

Bundan $\frac{p_k}{q_k} = [a_0; a_1, \dots, a_k]$ uchun $\gcd(p_k, q_k) = 1$ ekani ham kelib chiqadi. Demak, konvergentlar doimo qisqarmas bo‘ladi.

=== "C++"
    ```cpp
    auto fraction(int p, int q) {
        vector<int> a;
        while(q) {
            a.push_back(p / q);
            tie(p, q) = make_pair(q, p % q);
        }
        return a;
    }
    ```

=== "Python"
    ```py
    def fraction(p, q):
        a = []
        while q:
            a.append(p // q)
            p, q = q, p % q
        return a
    ```

## Asosiy natijalar

Uzluksiz kasrlarni keyinroq batafsil o‘rganishga turtki berish uchun hozir bir nechta asosiy faktlarni keltiramiz.

??? note "Rekurrent formula"
    $r_k = \frac{p_k}{q_k}$ konvergentlari uchun ularni tez hisoblash imkonini beradigan quyidagi rekurrent formula o‘rinli:

    $$\frac{p_k}{q_k}=\frac{a_k p_{k-1} + p_{k-2}}{a_k q_{k-1} + q_{k-2}},$$

    bu yerda $\frac{p_{-1}}{q_{-1}}=\frac{1}{0}$ va $\frac{p_{-2}}{q_{-2}}=\frac{0}{1}$.

??? note "Og‘ishlar"
    $r_k = \frac{p_k}{q_k}$ ning $r$ dan og‘ishini umumiy holda

    $$\left|\frac{p_k}{q_k}-r\right| \leq \frac{1}{q_k q_{k+1}} \leq \frac{1}{q_k^2}$$

    tarzida baholash mumkin.

    Ikkala tomonni $q_k$ ga ko‘paytirib, muqobil bahoni olamiz:

    $$|p_k - q_k r| \leq \frac{1}{q_{k+1}}.$$

    Yuqoridagi rekurrent formuladan $q_k$ kamida Fibonacci sonlaridek tez o‘sishi kelib chiqadi.
    Quyidagi rasmda konvergentlarning $r=\frac{1+\sqrt 5}{2}$ ga qanday yaqinlashishi tasvirlangan:

    ![](https://upload.wikimedia.org/wikipedia/commons/b/b4/Golden_ration_convergents.svg)

    $r=\frac{1+\sqrt 5}{2}$ ko‘k nuqtali chiziq bilan tasvirlangan. Toq konvergentlar unga yuqoridan, juft konvergentlar esa pastdan yaqinlashadi.

??? note "Panjara qobiqlari"
    $y=rx$ chiziqning yuqori va past tomonidagi nuqtalarning qavariq qobiqlarini ko‘rib chiqamiz.

    Toq konvergentlar $(q_k;p_k)$ yuqori qobiq uchlari, juft konvergentlar $(q_k;p_k)$ esa quyi qobiq uchlari bo‘ladi.

    Qobiqlardagi barcha butun koordinatali uchlar $(q;p)$ ko‘rinishida bo‘lib,

    $$\frac{p}{q} = \frac{tp_{k-1} + p_{k-2}}{tq_{k-1} + q_{k-2}}$$

    tenglikni biror butun $0 \leq t \leq a_k$ uchun qanoatlantiradi. Boshqacha aytganda, qobiqdagi panjara nuqtalari to‘plami yarim konvergentlar to‘plamiga mos keladi.
    Quyidagi rasmda $r=\frac{9}{7}$ ning konvergentlari va yarim konvergentlari (oraliq kulrang nuqtalar) ko‘rsatilgan.

    ![](https://upload.wikimedia.org/wikipedia/commons/9/92/Continued_convergents_geometry.svg)

??? note "Eng yaxshi yaqinlashuvlar"
    Biror $x$ uchun $q \leq x$ sharti ostida $\left|r-\frac{p}{q}\right|$ ni minimallashtiruvchi kasr $\frac{p}{q}$ bo‘lsin.

    U holda $\frac{p}{q}$ — $r$ ning yarim konvergentidir.

Oxirgi fakt $r$ ning eng yaxshi ratsional yaqinlashuvlarini uning yarim konvergentlarini tekshirish orqali topish imkonini beradi.

Quyida bu faktlarning batafsil izohi, sezgir talqini va intuitiv tushuntirishlari keltiriladi.

## Konvergentlar

Oldin aniqlangan konvergentlarni yaqindan ko‘rib chiqamiz. $r=[a_0, a_1, a_2, \dots]$ uchun uning konvergentlari

\begin{gather}
r_0=[a_0],\\r_1=[a_0, a_1],\\ \dots,\\ r_k=[a_0, a_1, \dots, a_k]
\end{gather}

bo‘ladi.

Konvergentlar uzluksiz kasrlarning asosiy tushunchasidir, shu sababli ularning xossalarini o‘rganish muhim.

$r$ sonining $k$-konvergenti $r_k = \frac{p_k}{q_k}$ ni

$$r_k = \frac{P_k(a_0,a_1,\dots,a_k)}{P_{k-1}(a_1,\dots,a_k)} = \frac{a_k p_{k-1} + p_{k-2}}{a_k q_{k-1} + q_{k-2}},$$

ko‘rinishida hisoblash mumkin. Bu yerda $P_k(a_0,\dots,a_k)$ — [kontinuant](https://en.wikipedia.org/wiki/Continuant_(mathematics)), ya’ni

$$P_k(x_0,x_1,\dots,x_k) = \det \begin{bmatrix}
x_k & 1 & 0 & \dots & 0 \\
-1 & x_{k-1} & 1 & \dots & 0 \\
0 & -1 & x_2 & . & \vdots \\
\vdots & \vdots & . & \ddots & 1 \\
0 & 0 & \dots & -1 & x_0
\end{bmatrix}_{\textstyle .}$$

orqali aniqlangan ko‘p o‘zgaruvchili ko‘phad.

Demak, $r_k$ — $r_{k-1}$ va $r_{k-2}$ ning vaznli [mediantasi](https://en.wikipedia.org/wiki/Mediant_(mathematics)).

Izchillik uchun yana ikkita konvergent: $r_{-1} = \frac{1}{0}$ va $r_{-2} = \frac{0}{1}$ aniqlanadi.

??? hint "Batafsil tushuntirish"

    $r_k$ ning surat va maxrajini $a_0, a_1, \dots, a_k$ ning ko‘p o‘zgaruvchili ko‘phadlari sifatida qarash mumkin:

    $$r_k = \frac{P_k(a_0, a_1, \dots, a_k)}{Q_k(a_0,a_1, \dots, a_k)}.$$

    Konvergent ta’rifidan

    $$r_k = a_0 + \frac{1}{[a_1;a_2,\dots, a_k]}= a_0 + \frac{Q_{k-1}(a_1, \dots, a_k)}{P_{k-1}(a_1, \dots, a_k)} = \frac{a_0 P_{k-1}(a_1, \dots, a_k) + Q_{k-1}(a_1, \dots, a_k)}{P_{k-1}(a_1, \dots, a_k)}$$

    kelib chiqadi.

    Bundan $Q_k(a_0, \dots, a_k) = P_{k-1}(a_1, \dots, a_k)$ va

    $$P_k(a_0, \dots, a_k) = a_0 P_{k-1}(a_1, \dots, a_k) + P_{k-2}(a_2, \dots, a_k)$$

    munosabatlari olinadi.

    Dastlab $r_0 = \frac{a_0}{1}$ va $r_1 = \frac{a_0 a_1 + 1}{a_1}$, demak

    $$\begin{align}P_0(a_0)&=a_0,\\ P_1(a_0, a_1) &= a_0 a_1 + 1.\end{align}$$

    Izchillik uchun $P_{-1} = 1$ va $P_{-2}=0$ deb olish hamda formal ravishda $r_{-1} = \frac{1}{0}$ va $r_{-2}=\frac{0}{1}$ deyish qulay.

    Sonli analizdan ixtiyoriy uch diagonalli matritsaning determinanti

    $$T_k = \det \begin{bmatrix}
    a_0 & b_0 & 0 & \dots & 0 \\
    c_0 & a_1 & b_1 & \dots & 0 \\
    0 & c_1 & a_2 & . & \vdots \\
    \vdots & \vdots & . & \ddots & c_{k-1} \\
    0 & 0 & \dots & b_{k-1} & a_k
    \end{bmatrix}$$

    ni $T_k = a_k T_{k-1} - b_{k-1} c_{k-1} T_{k-2}$ rekurrent formulasi orqali hisoblash mumkinligi ma’lum. Uni $P_k$ bilan solishtirib, bevosita ifodani olamiz:

    $$P_k = \det \begin{bmatrix}
    x_k & 1 & 0 & \dots & 0 \\
    -1 & x_{k-1} & 1 & \dots & 0 \\
    0 & -1 & x_2 & . & \vdots \\
    \vdots & \vdots & . & \ddots & 1 \\
    0 & 0 & \dots & -1 & x_0
    \end{bmatrix}_{\textstyle .}$$

    Bu ko‘phad uzluksiz kasrlar bilan yaqin aloqasi sababli [kontinuant](https://en.wikipedia.org/wiki/Continuant_(mathematics)) nomi bilan ham tanilgan. Bosh diagonal ketma-ketligi teskari aylantirilganda kontinuant o‘zgarmaydi. Bu uni hisoblashning muqobil formulasini beradi:

    $$P_k(a_0, \dots, a_k) = a_k P_{k-1}(a_0, \dots, a_{k-1}) + P_{k-2}(a_0, \dots, a_{k-2}).$$

### Implementatsiya

Konvergentlarni $p_{-2}, p_{-1}, p_0, p_1, \dots, p_k$ va $q_{-2}, q_{-1}, q_0, q_1, \dots, q_k$ ketma-ketliklari jufti sifatida hisoblaymiz:

=== "C++"
    ```cpp
    auto convergents(vector<int> a) {
        vector<int> p = {0, 1};
        vector<int> q = {1, 0};
        for(auto it: a) {
            p.push_back(p[p.size() - 1] * it + p[p.size() - 2]);
            q.push_back(q[q.size() - 1] * it + q[q.size() - 2]);
        }
        return make_pair(p, q);
    }
    ```

=== "Python"
    ```py
    def convergents(a):
        p = [0, 1]
        q = [1, 0]
        for it in a:
            p.append(p[-1]*it + p[-2])
            q.append(q[-1]*it + q[-2])
        return p, q
    ```

## Uzluksiz kasrlar daraxtlari

Barcha mumkin bo‘lgan uzluksiz kasrlarni foydali daraxt tuzilmalariga birlashtirishning ikkita asosiy usuli bor.

### Stern–Brocot daraxti

[Stern–Brocot daraxti](../others/stern_brocot_tree_farey_sequences.md) barcha turli musbat ratsional sonlarni o‘z ichiga oluvchi ikkilik qidiruv daraxtidir.

Daraxt umumiy holda quyidagicha ko‘rinadi:

<figure>
<img src="https://upload.wikimedia.org/wikipedia/commons/3/37/SternBrocotTree.svg">
<figcaption>
<a href="https://commons.wikimedia.org/wiki/File:SternBrocotTree.svg">Rasm</a> muallifi <a href="https://commons.wikimedia.org/wiki/User:Aaron_Rotenberg">Aaron Rotenberg</a>; u <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en">CC BY-SA 3.0</a> litsenziyasi ostida tarqatiladi.
</figcaption>
</figure>

$\frac{0}{1}$ va $\frac{1}{0}$ kasrlari mos ravishda daraxtning chap va o‘ng tomonida “virtual” saqlanadi.

So‘ngra tugundagi kasr uning yuqorisidagi $\frac{a}{b}$ va $\frac{c}{d}$ kasrlarining mediantasi $\frac{a+c}{b+d}$ bo‘ladi.
$\frac{p_k}{q_k}=\frac{a_k p_{k-1} + p_{k-2}}{a_k q_{k-1} + q_{k-2}}$ rekurrent formula uzluksiz kasr ko‘rinishi daraxtdagi $\frac{p_k}{q_k}$ ga olib boruvchi yo‘lni kodlashini anglatadi. $[a_0; a_1, \dots, a_{k}, 1]$ ni topish uchun $a_0$ marta o‘ngga, $a_1$ marta chapga, $a_2$ marta o‘ngga va shu tartibda $a_k$ gacha yurish kerak.

$[a_0; a_1, \dots, a_k,1]$ ning otasi oxirgi ishlatilgan yo‘nalishda bir qadam orqaga qaytish orqali olinadi.
Boshqacha aytganda, $a_k > 1$ bo‘lsa, u $[a_0; a_1, \dots, a_k-1,1]$; $a_k = 1$ bo‘lsa, $[a_0; a_1, \dots, a_{k-1}, 1]$ bo‘ladi.

Shunday qilib, $[a_0; a_1, \dots, a_k, 1]$ ning bolalari $[a_0; a_1, \dots, a_k+1, 1]$ va $[a_0; a_1, \dots, a_k, 1, 1]$ dir.

Stern–Brocot daraxtini indekslaymiz. Ildiz tugunga $1$ indeks beriladi. So‘ngra $v$ tugun uchun chap bola indeksi $v$ ning yetakchi bitini $1$ dan $10$ ga, o‘ng bola indeksi esa $1$ dan $11$ ga almashtirish orqali olinadi:

<figure><img src="https://upload.wikimedia.org/wikipedia/commons/1/18/Stern-brocot-index.svg" width="500px"/></figure>

Bu indekslashda ratsional sonning uzluksiz kasr ko‘rinishi uning ikkilik indeksidagi [ketma-ket takrorlanish uzunliklari kodini](https://en.wikipedia.org/wiki/Run-length_encoding) beradi.

$\frac{5}{2} = [2;2] = [2;1,1]$ uchun indeks $1011_2$ bo‘ladi va bitlarni kichik razryaddan boshlab qaragandagi takrorlanish uzunliklari kodi $[2;1,1]$ dir.

Yana bir misol: $\frac{2}{5} = [0;2,2]=[0;2,1,1]$ ning indeksi $1100_2$ bo‘lib, uning takrorlanish uzunliklari kodi haqiqatan ham $[0;2,2]$ ga teng.

Stern–Brocot daraxti aslida [treap](../data_structures/treap.md) ekanini ta’kidlash joiz. Ya’ni u $\frac{p}{q}$ qiymati bo‘yicha ikkilik qidiruv daraxti, lekin $p$ va $q$ ning har ikkisi bo‘yicha heap hisoblanadi.

!!! example "Uzluksiz kasrlarni solishtirish"
    $A=[a_0; a_1, \dots, a_n]$ va $B=[b_0; b_1, \dots, b_m]$ berilgan. Qaysi kasr kichik?

??? hint "Yechim"
    Hozircha $A$ va $B$ irratsional hamda ularning uzluksiz kasr ko‘rinishlari Stern–Brocot daraxtidagi cheksiz pastlashni bildiradi deb faraz qilamiz.

    Yuqorida aytilganidek, bu ko‘rinishda $a_0$ pastlashdagi ketma-ket o‘ng burilishlar sonini, $a_1$ undan keyingi chap burilishlar sonini va hokazoni bildiradi. Shu sabab $a_k$ va $b_k$ ni solishtirganda, ular teng bo‘lsa, $a_{k+1}$ va $b_{k+1}$ ga o‘tamiz. Aks holda, o‘ngga pastlayotgan bo‘lsak, $a_k < b_k$ ni, chapga pastlayotgan bo‘lsak esa, $A < B$ ni aniqlash uchun $a_k > b_k$ ni tekshiramiz.

    Boshqacha aytganda, irratsional $A$ va $B$ uchun $A < B$ bo‘lishi aynan $(a_0, -a_1, a_2, -a_3, \dots) < (b_0, -b_1, b_2, -b_3, \dots)$ leksikografik tengsizlikka teng kuchli.

    Endi $\infty$ ni uzluksiz kasr ko‘rinishining formal elementi sifatida ishlatib, $A-\varepsilon$ va $A+\varepsilon$ irratsional sonlarini, ya’ni $A$ dan kichik (katta), ammo boshqa istalgan haqiqiy sondan unga yaqinroq elementlarni taqlid qilish mumkin. Aniqrog‘i, $A=[a_0; a_1, \dots, a_n]$ uchun bu ikki elementdan biri $[a_0; a_1, \dots, a_n, \infty]$, ikkinchisi esa $[a_0; a_1, \dots, a_n - 1, 1, \infty]$ bilan ifodalanadi.

    Ularning qaysi biri $A-\varepsilon$, qaysi biri $A+\varepsilon$ ga mos kelishini $n$ ning juft-toqligi orqali yoki ularni irratsional sonlar sifatida solishtirib aniqlash mumkin.

    === "Python"
        ```py
        # check if a < b assuming that a[-1] = b[-1] = infty and a != b
        def less(a, b):
            a = [(-1)**i*a[i] for i in range(len(a))]
            b = [(-1)**i*b[i] for i in range(len(b))]
            return a < b
        # [a0; a1, ..., ak] -> [a0, a1, ..., ak-1, 1]
        def expand(a):
            if a: # empty a = inf
                a[-1] -= 1
                a.append(1)
            return a

        # return a-eps, a+eps
        def pm_eps(a):
            b = expand(a.copy())
            a.append(float('inf'))
            b.append(float('inf'))
            return (a, b) if less(a, b) else (b, a)
        ```

!!! example "Eng yaxshi ichki nuqta"
    $\frac{0}{1} \leq \frac{p_0}{q_0} < \frac{p_1}{q_1} \leq \frac{1}{0}$ berilgan. $(q; p)$ leksikografik jihatdan eng kichik va $\frac{p_0}{q_0} < \frac{p}{q} < \frac{p_1}{q_1}$ bo‘ladigan $\frac{p}{q}$ ratsional sonni toping.

??? hint "Yechim"
    Stern–Brocot daraxti nuqtai nazaridan bu $\frac{p_0}{q_0}$ va $\frac{p_1}{q_1}$ ning LCA sini topish demakdir. Stern–Brocot daraxti bilan uzluksiz kasrlar orasidagi bog‘lanish tufayli, bu LCA taxminan $\frac{p_0}{q_0}$ va $\frac{p_1}{q_1}$ uzluksiz kasr ko‘rinishlarining eng uzun umumiy prefiksiga mos keladi.

    Demak, $\frac{p_0}{q_0} = [a_0; a_1, \dots, a_{k-1}, a_k, \dots]$ va $\frac{p_1}{q_1} = [a_0; a_1, \dots, a_{k-1}, b_k, \dots]$ irratsional sonlar bo‘lsa, LCA $[a_0; a_1, \dots, \min(a_k, b_k)+1]$ bo‘ladi.

    Ratsional $r_0$ va $r_1$ uchun ulardan biri LCA ning o‘zi bo‘lishi mumkin, bu esa alohida holatlarni ko‘rib chiqishni talab qiladi. Yechimni soddalashtirish uchun oldingi masalada chiqarilgan $r_0 + \varepsilon$ va $r_1 - \varepsilon$ ning uzluksiz kasr ko‘rinishlaridan foydalanish mumkin.

    === "Python"
        ```py
        # finds lexicographically smallest (q, p)
        # such that p0/q0 < p/q < p1/q1
        def middle(p0, q0, p1, q1):
            a0 = pm_eps(fraction(p0, q0))[1]
            a1 = pm_eps(fraction(p1, q1))[0]
            a = []
            for i in range(min(len(a0), len(a1))):
                a.append(min(a0[i], a1[i]))
                if a0[i] != a1[i]:
                    break
            a[-1] += 1
            p, q = convergents(a)
            return p[-1], q[-1]
        ```

!!! example "[GCJ 2019, Round 2 - New Elements: Part 2](https://codingcompetitions.withgoogle.com/codejam/round/0000000000051679/0000000000146184)"
    Sizga $N$ ta musbat butun sonlar jufti $(C_i, J_i)$ berilgan. $C_i x + J_i y$ qat’iy o‘suvchi ketma-ketlik bo‘ladigan musbat butun sonlar jufti $(x, y)$ ni topish kerak.
    Shunday juftlar orasida leksikografik jihatdan eng kichigini toping.

??? hint "Yechim"
    Shartni qayta yozsak, barcha $i$ uchun $A_i x + B_i y$ musbat bo‘lishi kerak; bu yerda $A_i = C_i - C_{i-1}$ va $B_i = J_i - J_{i-1}$.

    $A_i x + B_i y > 0$ tengsizliklari orasida to‘rtta muhim guruh bor:

    1. $A_i, B_i > 0$ bo‘lganlarini e’tiborsiz qoldirish mumkin, chunki $x, y > 0$ izlayapmiz.
    2. $A_i, B_i \leq 0$ bo‘lsa, javob `IMPOSSIBLE` bo‘ladi.
    3. $A_i > 0$, $B_i \leq 0$. Bunday cheklovlar $\frac{y}{x} < \frac{A_i}{-B_i}$ ga teng kuchli.
    4. $A_i \leq 0$, $B_i > 0$. Bunday cheklovlar $\frac{y}{x} > \frac{-A_i}{B_i}$ ga teng kuchli.

    To‘rtinchi guruhdagi $\frac{-A_i}{B_i}$ lar orasidagi eng kattasini $\frac{p_0}{q_0}$, uchinchi guruhdagi $\frac{A_i}{-B_i}$ lar orasidagi eng kichigini esa $\frac{p_1}{q_1}$ deb olamiz.

    Endi masala $\frac{p_0}{q_0} < \frac{p_1}{q_1}$ berilganda, $(q;p)$ leksikografik jihatdan eng kichik va $\frac{p_0}{q_0} < \frac{p}{q} < \frac{p_1}{q_1}$ bo‘ladigan $\frac{p}{q}$ kasrni topishga keldi.

    === "Python"
        ```py
        def solve():
            n = int(input())
            C = [0] * n
            J = [0] * n
            # p0/q0 < y/x < p1/q1
            p0, q0 = 0, 1
            p1, q1 = 1, 0
            fail = False
            for i in range(n):
                C[i], J[i] = map(int, input().split())
                if i > 0:
                    A = C[i] - C[i-1]
                    B = J[i] - J[i-1]
                    if A <= 0 and B <= 0:
                        fail = True
                    elif B > 0 and A < 0: # y/x > (-A)/B if B > 0
                        if (-A)*q0 > p0*B:
                            p0, q0 = -A, B
                    elif B < 0 and A > 0: # y/x < A/(-B) if B < 0
                        if A*q1 < p1*(-B):
                            p1, q1 = A, -B
            if p0*q1 >= p1*q0 or fail:
                return 'IMPOSSIBLE'
            p, q = middle(p0, q0, p1, q1)
            return str(q) + ' ' + str(p)
        ```

### Calkin–Wilf daraxti

Uzluksiz kasrlarni ikkilik daraxtga joylashtirishning birmuncha sodda usuli — [Calkin–Wilf daraxti](https://en.wikipedia.org/wiki/Calkin–Wilf_tree).

Daraxt odatda quyidagicha ko‘rinadi:

<figure>
<img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Calkin–Wilf_tree.svg" width="500px"/>
<figcaption><a href="https://commons.wikimedia.org/wiki/File:Calkin–Wilf_tree.svg">Rasm</a> mualliflari <a href="https://commons.wikimedia.org/wiki/User:Olli_Niemitalo">Olli Niemitalo</a> va <a href="https://commons.wikimedia.org/wiki/User:Proz">Proz</a>; u <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en">CC0 1.0</a> ostida tarqatiladi.</figcaption>
</figure>

Daraxt ildizida $\frac{1}{1}$ soni joylashadi. $\frac{p}{q}$ sonli tugunning bolalari $\frac{p}{p+q}$ va $\frac{p+q}{q}$ bo‘ladi.

Stern–Brocot daraxtidan farqli ravishda, Calkin–Wilf daraxti ikkilik _qidiruv_ daraxti emas, shu sababli undan ratsional ikkilik qidiruv uchun foydalanib bo‘lmaydi.

Calkin–Wilf daraxtida $\frac{p}{q}$ kasrning bevosita otasi $p>q$ bo‘lsa $\frac{p-q}{q}$, aks holda $\frac{p}{q-p}$ dir.
Stern–Brocot daraxtida konvergentlar rekurrent formulasidan foydalangandik. Uzluksiz kasr bilan Calkin–Wilf daraxti orasidagi bog‘lanishni ko‘rish uchun to‘liq bo‘linmalar rekurrent formulasini eslaymiz. Agar $s_k = \frac{p}{q}$ bo‘lsa, $s_{k+1} = \frac{q}{p \mod q} = \frac{q}{p-\lfloor p/q \rfloor \cdot q}$.
Boshqa tomondan, $p > q$ bo‘lgan paytda $s_k = \frac{p}{q}$ dan Calkin–Wilf daraxtidagi otasiga qayta-qayta o‘tsak, $\frac{p \mod q}{q} = \frac{1}{s_{k+1}}$ ga yetamiz. Davom etsak, $s_{k+2}$, keyin $\frac{1}{s_{k+3}}$ va hokazolarga yetamiz. Bundan quyidagilarni chiqarish mumkin:

1. $a_0> 0$ bo‘lsa, Calkin–Wilf daraxtida $[a_0; a_1, \dots, a_k]$ ning bevosita otasi $\frac{p-q}{q}=[a_0 - 1; a_1, \dots, a_k]$.
2. $a_0 = 0$ va $a_1 > 1$ bo‘lsa, uning bevosita otasi $\frac{p}{q-p} = [0; a_1 - 1, a_2, \dots, a_k]$.
3. $a_0 = 0$ va $a_1 = 1$ bo‘lsa, uning bevosita otasi $\frac{p}{q-p} = [a_2; a_3, \dots, a_k]$.

Mos ravishda, $\frac{p}{q} = [a_0; a_1, \dots, a_k]$ ning bolalari:

1. $\frac{p+q}{q}=1+\frac{p}{q}$, ya’ni $[a_0+1; a_1, \dots, a_k]$;
2. $\frac{p}{p+q} = \frac{1}{1+\frac{q}{p}}$, ya’ni $a_0 > 0$ bo‘lsa $[0, 1, a_0, a_1, \dots, a_k]$, $a_0=0$ bo‘lsa esa $[0, a_1+1, a_2, \dots, a_k]$.

E’tiborlisi, Calkin–Wilf daraxtining tugunlarini kenglik bo‘yicha qidiruv tartibida raqamlab chiqsak — ildiz $1$, $v$ tugunning bolalari mos ravishda $2v$ va $2v+1$ — ratsional sonning Calkin–Wilf daraxtidagi indeksi Stern–Brocot daraxtidagi indeks bilan bir xil bo‘ladi.
Demak, Stern–Brocot va Calkin–Wilf daraxtlarining bir xil darajalaridagi sonlar to‘plami bir xil, faqat ularning tartibi [bitlarni teskari joylashtirish permutatsiyasi](https://en.wikipedia.org/wiki/Bit-reversal_permutation) orqali farq qiladi.

## Yaqinlashish

$r$ soni va uning $k$-konvergenti $r_k=\frac{p_k}{q_k}$ uchun quyidagi formula o‘rinli:

$$r_k = a_0 + \sum\limits_{i=1}^k \frac{(-1)^{i-1}}{q_i q_{i-1}}.$$

Xususan,

$$r_k - r_{k-1} = \frac{(-1)^{k-1}}{q_k q_{k-1}}$$

va

$$p_k q_{k-1} - p_{k-1} q_k = (-1)^{k-1}.$$

Bundan

$$\left| r-\frac{p_k}{q_k} \right| \leq \frac{1}{q_{k+1}q_k} \leq \frac{1}{q_k^2}$$

kelib chiqadi.

Oxirgi tengsizlik $r_k$ va $r_{k+1}$ odatda $r$ ning turli tomonlarida yotishidan kelib chiqadi, shuning uchun

$$|r-r_k| = |r_k-r_{k+1}|-|r-r_{k+1}| \leq |r_k - r_{k+1}|.$$

??? tip "Batafsil tushuntirish"

    $|r-r_k|$ ni baholash uchun avval qo‘shni konvergentlar orasidagi farqni baholaymiz. Ta’rifga ko‘ra,

    $$\frac{p_k}{q_k} - \frac{p_{k-1}}{q_{k-1}} = \frac{p_k q_{k-1} - p_{k-1} q_k}{q_k q_{k-1}}.$$

    Suratdagi $p_k$ va $q_k$ ni rekurrent formulalar bilan almashtirsak,

    $$\begin{align} p_k q_{k-1} - p_{k-1} q_k &= (a_k p_{k-1} + p_{k-2}) q_{k-1} - p_{k-1} (a_k q_{k-1} + q_{k-2})
    \\&= p_{k-2} q_{k-1} - p_{k-1} q_{k-2},\end{align}$$

    ni olamiz. Demak, $r_k - r_{k-1}$ suratining qiymati doimo $r_{k-1} - r_{k-2}$ suratining qarama-qarshi ishoralisidir. U esa

    $$r_1 - r_0=\left(a_0+\frac{1}{a_1}\right)-a_0=\frac{1}{a_1}$$

    uchun $1$ ga teng. Shuning uchun

    $$r_k - r_{k-1} = \frac{(-1)^{k-1}}{q_k q_{k-1}}.$$

    Bu $r_k$ ni cheksiz qatorning qism yig‘indisi sifatida muqobil ifodalash imkonini beradi:

    $$r_k = (r_k - r_{k-1}) + \dots + (r_1 - r_0) + r_0
    = a_0 + \sum\limits_{i=1}^k \frac{(-1)^{i-1}}{q_i q_{i-1}}.$$

    Rekurrent munosabatdan $q_k$ kamida Fibonacci sonlaridek tez monoton o‘sishi kelib chiqadi. Shu sababli

    $$r = \lim\limits_{k \to \infty} r_k = a_0 + \sum\limits_{i=1}^\infty \frac{(-1)^{i-1}}{q_i q_{i-1}}$$

    doimo aniq aniqlangan, chunki mos qator har doim yaqinlashadi. E’tiborlisi, qoldiq qator

    $$r-r_k = \sum\limits_{i=k+1}^\infty \frac{(-1)^{i-1}}{q_i q_{i-1}}$$

    $q_i q_{i-1}$ lar qanchalik tez kamayishi sababli $(-1)^k$ bilan bir xil ishoraga ega. Demak, juft indeksli $r_k$ lar $r$ ga pastdan, toq indekslilari esa yuqoridan yaqinlashadi:

    <figure><img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Golden_ration_convergents.svg" width="600px"/>
    <figcaption>_$r=\phi = \frac{1+\sqrt{5}}{2}=[1;1,1,\dots]$ ning konvergentlari va ularning $r$ dan masofasi._</figcaption></figure>

    Rasmdan

    $$|r-r_k| = |r_k - r_{k+1}| - |r-r_{k+1}| \leq |r_k - r_{k+1}|$$

    ekanini ko‘ramiz. Ya’ni $r$ va $r_k$ orasidagi masofa hech qachon $r_k$ va $r_{k+1}$ orasidagi masofadan katta emas:

    $$\left|r-\frac{p_k}{q_k}\right| \leq \frac{1}{q_k q_{k+1}} \leq \frac{1}{q_k^2}.$$

!!! example "Kengaytirilgan Evklidmi?"
    $A, B, C \in \mathbb Z$ berilgan. $Ax + By = C$ bo‘ladigan $x, y \in \mathbb Z$ ni toping.

??? hint "Yechim"
    Bu masala odatda [kengaytirilgan Evklid algoritmi](../algebra/extended-euclid-algorithm.md) bilan yechilsa-da, uzluksiz kasrlar yordamida sodda va bevosita yechim mavjud.

    $\frac{A}{B}=[a_0; a_1, \dots, a_k]$ bo‘lsin. Yuqorida $p_k q_{k-1} - p_{k-1} q_k = (-1)^{k-1}$ isbotlandi. $p_k$ va $q_k$ o‘rniga $A$ va $B$ ni qo‘ysak,

    $$Aq_{k-1} - Bp_{k-1} = (-1)^{k-1} g,$$

    ni olamiz; bu yerda $g = \gcd(A, B)$. Agar $C$ soni $g$ ga bo‘linsa, yechim $x = (-1)^{k-1}\frac{C}{g} q_{k-1}$ va $y = (-1)^{k}\frac{C}{g} p_{k-1}$ bo‘ladi.

    === "Python"
        ```py
        # return (x, y) such that Ax+By=C
        # assumes that such (x, y) exists
        def dio(A, B, C):
            p, q = convergents(fraction(A, B))
            C //= A // p[-1] # divide by gcd(A, B)
            t = (-1) if len(p) % 2 else 1
            return t*C*q[-2], -t*C*p[-2]
        ```

## Chiziqli-kasrli almashtirishlar

Uzluksiz kasrlar uchun yana bir muhim tushuncha — [chiziqli-kasrli almashtirishlar](https://en.wikipedia.org/wiki/Linear_fractional_transformation).

!!! info "Ta’rif"
    **Chiziqli-kasrli almashtirish** — biror $a,b,c,d \in \mathbb R$ uchun $f(x) = \frac{ax+b}{cx+d}$ ko‘rinishidagi $f : \mathbb R \to \mathbb R$ funksiya.

$L_0(x)=\frac{a_0 x + b_0}{c_0 x + d_0}$ va $L_1(x)=\frac{a_1 x + b_1}{c_1 x + d_1}$ chiziqli-kasrli almashtirishlarining $(L_0 \circ L_1)(x) = L_0(L_1(x))$ kompozitsiyasi ham chiziqli-kasrli almashtirishdir:

$$\frac{a_0\frac{a_1 x + b_1}{c_1 x + d_1} + b_0}{c_0 \frac{a_1 x + b_1}{c_1 x + d_1} + d_0} = \frac{a_0(a_1 x + b_1) + b_0 (c_1 x + d_1)}{c_0 (a_1 x + b_1) + d_0 (c_1 x + d_1)} = \frac{(a_0 a_1 + b_0 c_1) x + (a_0 b_1 + b_0 d_1)}{(c_0 a_1 + d_0 c_1) x + (c_0 b_1 + d_0 d_1)}.$$

Chiziqli-kasrli almashtirishning teskarisi ham chiziqli-kasrli almashtirishdir:

$$y = \frac{ax+b}{cx+d} \iff y(cx+d) = ax + b \iff x = -\frac{dy-b}{cy-a}.$$

!!! example "[DMOPC '19 Contest 7 P4 - Bob and Continued Fractions](https://dmoj.ca/problem/dmopc19c7p4)"
    Musbat butun sonlardan iborat $a_1, \dots, a_n$ massiv berilgan. $m$ ta so‘rovga javob berish kerak. Har bir so‘rovda $[a_l; a_{l+1}, \dots, a_r]$ ni hisoblang.

??? hint "Yechim"
    Agar uzluksiz kasrlarni birlashtira olsak, bu masalani segment daraxti bilan yechish mumkin.

    Umumiy holda $[a_0; a_1, \dots, a_k, b_0, b_1, \dots, b_k] = [a_0; a_1, \dots, a_k, [b_1; b_2, \dots, b_k]]$.

    $L_{k}(x) = [a_k; x] = a_k + \frac{1}{x} = \frac{a_k\cdot x+1}{1\cdot x + 0}$ deb belgilaymiz. $L_k(\infty) = a_k$ ekaniga e’tibor bering. Bu belgilashda

    $$[a_0; a_1, \dots, a_k, x] = [a_0; [a_1; [\dots; [a_k; x]]]] = (L_0 \circ L_1 \circ \dots \circ L_k)(x) = \frac{p_k x + p_{k-1}}{q_k x + q_{k-1}}$$

    bo‘ladi.

    Demak, masala

    $$(L_l \circ L_{l+1} \circ \dots \circ L_r)(\infty)$$

    ni hisoblashga keldi.

    Almashtirishlar kompozitsiyasi assotsiativ, shuning uchun segment daraxtining har bir tugunida uning ost-daraxtidagi almashtirishlar kompozitsiyasini saqlash mumkin.

!!! example "Uzluksiz kasrning chiziqli-kasrli almashtirilishi"
    $L(x) = \frac{ax+b}{cx+d}$ bo‘lsin. $A=[a_0; a_1, \dots, a_n]$ uchun $L(A)$ ning $[b_0; b_1, \dots, b_m]$ uzluksiz kasr ko‘rinishini hisoblang.

    _Bu ixtiyoriy $\frac{p}{q}$ uchun $A + \frac{p}{q} = \frac{qA + p}{q}$ va $A \cdot \frac{p}{q} = \frac{p A}{q}$ ni hisoblash imkonini beradi._

??? hint "Yechim"
    Yuqorida $[a_0; a_1, \dots, a_k] = (L_{a_0} \circ L_{a_1} \circ \dots \circ L_{a_k})(\infty)$ ekanini qayd etdik. Demak, $L([a_0; a_1, \dots, a_k]) = (L \circ L_{a_0} \circ L_{a_1} \circ \dots L_{a_k})(\infty)$.

    Shunday qilib, $L_{a_0}$, $L_{a_1}$ va hokazolarni ketma-ket qo‘shib,

    $$(L \circ L_{a_0} \circ \dots \circ L_{a_k})(x) = L\left(\frac{p_k x + p_{k-1}}{q_k x + q_{k-1}}\right)=\frac{a_k x + b_k}{c_k x + d_k}$$

    ni hisoblay olamiz.

    $L(x)$ teskarilanuvchi bo‘lgani uchun $x$ bo‘yicha monoton hamdir. Shu sabab har qanday $x \geq 0$ uchun $L(\frac{p_k x + p_{k-1}}{q_k x + q_{k-1}})$ qiymati $L(\frac{p_k}{q_k}) = \frac{a_k}{c_k}$ va $L(\frac{p_{k-1}}{q_{k-1}}) = \frac{b_k}{d_k}$ orasida yotadi.
    Bundan tashqari, $x=[a_{k+1}; \dots, a_n]$ bo‘lganda u $L(A)$ ga teng. Demak, $b_0 = \lfloor L(A) \rfloor$ qiymati $\lfloor L(\frac{p_k}{q_k}) \rfloor$ va $\lfloor L(\frac{p_{k-1}}{q_{k-1}}) \rfloor$ orasida. Agar ular teng bo‘lsa, ikkalasi ham $b_0$ ga teng.

    $L(A) = (L_{b_0} \circ L_{b_1} \circ \dots \circ L_{b_m})(\infty)$ ekaniga e’tibor bering. $b_0$ ni bilgach, joriy almashtirishga $L_{b_0}^{-1}$ ni kompozitsiya qilib, $L_{a_{k+1}}$, $L_{a_{k+2}}$ va hokazolarni qo‘shishda davom etamiz. Navbatdagi pastga yaxlitlashlar tenglashishini kutib, ulardan $b_1$ va keyingi qiymatlarni chiqaramiz; shu tarzda $[b_0; b_1, \dots, b_m]$ ning barcha hadlarini tiklaymiz.

!!! example "Uzluksiz kasrlar arifmetikasi"
    $A=[a_0; a_1, \dots, a_n]$ va $B=[b_0; b_1, \dots, b_m]$ bo‘lsin. $A+B$ va $A \cdot B$ ning uzluksiz kasr ko‘rinishlarini hisoblang.

??? hint "Yechim"
    G‘oya oldingi masalaga o‘xshaydi, ammo $L(x) = \frac{ax+b}{cx+d}$ o‘rniga $L(x, y) = \frac{axy+bx+cy+d}{exy+fx+gy+h}$ ikki chiziqli-kasrli almashtirishini qarash kerak.

    $L(x) \mapsto L(L_{a_k}(x))$ o‘rniga joriy almashtirishni $L(x, y) \mapsto L(L_{a_k}(x), y)$ yoki $L(x, y) \mapsto L(x, L_{b_k}(y))$ tarzida o‘zgartirasiz.

    Keyin $\lfloor \frac{a}{e} \rfloor = \lfloor \frac{b}{f} \rfloor = \lfloor \frac{c}{g} \rfloor = \lfloor \frac{d}{h} \rfloor$ ekanini tekshirasiz. Agar ularning barchasi bir xil bo‘lsa, bu qiymatni natijaviy kasrdagi $c_k$ sifatida olasiz va almashtirishni

    $$L(x, y) \mapsto \frac{1}{L(x, y) - c_k}$$

    ko‘rinishiga o‘zgartirasiz.

!!! info "Ta’rif"
    $x = [a_0; a_1, \dots]$ uzluksiz kasri biror $k$ uchun $x = [a_0; a_1, \dots, a_k, x]$ bo‘lsa, **davriy** deb ataladi.

    $x = [a_0; a_1, \dots]$ uzluksiz kasri $x = [a_0; a_1, \dots, a_k, y]$ va $y$ davriy bo‘lsa, **oxir-oqibat davriy** deb ataladi.

$x = [1; 1, 1, \dots]$ uchun $x = 1 + \frac{1}{x}$, demak $x^2 = x + 1$. Davriy uzluksiz kasrlar bilan kvadrat tenglamalar orasida umumiy bog‘lanish bor. Quyidagi tenglamani ko‘rib chiqamiz:

$$ x = [a_0; a_1, \dots, a_k, x].$$

Bir tomondan, bu tenglama $x$ ning uzluksiz kasr ko‘rinishi $k+1$ davrga ega ekanini anglatadi.

Boshqa tomondan, konvergentlar formulasidan bu tenglama

$$x = \frac{p_k x + p_{k-1}}{q_k x + q_{k-1}}$$

degani.

Ya’ni $x$ o‘zining chiziqli-kasrli almashtirilishiga teng. Tenglamadan $x$ ikkinchi darajali

$$q_k x^2 + (q_{k-1}-p_k)x - p_{k-1} = 0$$

tenglamaning ildizi ekani kelib chiqadi.

Xuddi shunday mulohaza oxir-oqibat davriy uzluksiz kasrlar uchun ham o‘rinli: $x = [a_0; a_1, \dots, a_k, y]$, bu yerda $y=[b_0; b_1, \dots, b_k, y]$. Birinchi tenglamadan $x = L_0(y)$, ikkinchisidan $y = L_1(y)$ ni chiqaramiz; bu yerda $L_0$ va $L_1$ — chiziqli-kasrli almashtirishlar. Demak,

$$x = (L_0 \circ L_1)(y) = (L_0 \circ L_1 \circ L_0^{-1})(x).$$

Bundan ham kuchliroq faktni isbotlash mumkin; uni birinchi bo‘lib Lagrange isbotlagan: butun koeffitsiyentli ixtiyoriy $ax^2+bx+c=0$ kvadrat tenglamaning $x$ yechimi oxir-oqibat davriy uzluksiz kasrdir.

!!! example "Kvadratik irratsionallik"
    $x, y, z, n \in \mathbb Z$ va $n > 0$ mukammal kvadrat bo‘lmaganda $\alpha = \frac{x+y\sqrt{n}}{z}$ ning uzluksiz kasrini toping.

??? hint "Yechim"
    Bu sonning $k$-to‘liq bo‘linmasi $s_k$ uchun umumiy holda

    $$\alpha = [a_0; a_1, \dots, a_{k-1}, s_k] = \frac{s_k p_{k-1} + p_{k-2}}{s_k q_{k-1} + q_{k-2}}$$

    o‘rinli.

    Demak,

    $$s_k = -\frac{\alpha q_{k-1} - p_{k-1}}{\alpha q_k - p_k} = -\frac{q_{k-1} y \sqrt n + (x q_{k-1} - z p_{k-1})}{q_k y \sqrt n + (xq_k-zp_k)}.$$

    Surat va maxrajni $(xq_k - zp_k) - q_k y \sqrt n$ ga ko‘paytirib, maxrajdagi $\sqrt n$ dan xalos bo‘lamiz. Shunday qilib, to‘liq bo‘linmalar

    $$s_k = \frac{x_k + y_k \sqrt n}{z_k}$$

    ko‘rinishiga ega.

    $s_k$ ma’lum deb, $s_{k+1}$ ni topamiz.

    Avvalo, $a_k = \lfloor s_k \rfloor = \left\lfloor \frac{x_k + y_k \lfloor \sqrt n \rfloor}{z_k} \right\rfloor$. So‘ngra

    $$s_{k+1} = \frac{1}{s_k-a_k} = \frac{z_k}{(x_k - z_k a_k) + y_k \sqrt n} = \frac{z_k (x_k - y_k a_k) - y_k z_k \sqrt n}{(x_k - y_k a_k)^2 - y_k^2 n}.$$

    $t_k = x_k - y_k a_k$ deb belgilasak,

    \begin{align}x_{k+1} &=& z_k t_k, \\ y_{k+1} &=& -y_k z_k, \\ z_{k+1} &=& t_k^2 - y_k^2 n.\end{align}

    Bunday ko‘rinishning qulay tomoni shundaki, $x_{k+1}, y_{k+1}, z_{k+1}$ ni ularning eng katta umumiy bo‘luvchisiga qisqartirsak, natija yagona bo‘ladi. Demak, undan joriy holat oldin takrorlangan-takrorlanmaganini va bu holat avval qaysi indeksda bo‘lganini tekshirish uchun foydalanish mumkin.

    Quyida $\alpha = \sqrt n$ ning uzluksiz kasr ko‘rinishini hisoblash kodi keltirilgan:

    === "Python"
        ```py
        # compute the continued fraction of sqrt(n)
        def sqrt(n):
            n0 = math.floor(math.sqrt(n))
            x, y, z = 1, 0, 1
            a = []
            def step(x, y, z):
                a.append((x * n0 + y) // z)
                t = y - a[-1]*z
                x, y, z = -z*x, z*t, t**2 - n*x**2
                g = math.gcd(x, math.gcd(y, z))
                return x // g, y // g, z // g
            used = dict()
            for i in range(n):
                used[x, y, z] = i
                x, y, z = step(x, y, z)
                if (x, y, z) in used:
                    return a
        ```

    Xuddi shu `step` funksiyasi bilan, faqat boshlang‘ich $x$, $y$ va $z$ ni o‘zgartirib, ixtiyoriy $\frac{x+y \sqrt{n}}{z}$ uchun ham uzluksiz kasrni hisoblash mumkin.

!!! example "[Tavrida NU Akai Contest - Continued Fraction](https://timus.online/problem.aspx?space=1&num=1814)"
    $x$ va $k$ berilgan, $x$ mukammal kvadrat emas. $\sqrt x = [a_0; a_1, \dots]$ bo‘lsin. $0 \leq k \leq 10^9$ uchun $\frac{p_k}{q_k}=[a_0; a_1, \dots, a_k]$ ni toping.

??? hint "Yechim"
    $\sqrt x$ ning davrini hisoblagach, uzluksiz kasr ko‘rinishi hosil qilgan chiziqli-kasrli almashtirish ustida ikkilik darajaga oshirish yordamida $a_k$ ni hisoblash mumkin. Natijaviy almashtirishni topish uchun $T$ uzunlikdagi davrni bitta almashtirishga siqib, uni $\lfloor \frac{k-1}{T}\rfloor$ marta takrorlaysiz; qolgan almashtirishlarni esa qo‘lda birlashtirasiz.

    === "Python"
        ```py
        x, k = map(int, input().split())

        mod = 10**9+7

        # compose (A[0]*x + A[1]) / (A[2]*x + A[3]) and (B[0]*x + B[1]) / (B[2]*x + B[3])
        def combine(A, B):
            return [t % mod for t in [A[0]*B[0]+A[1]*B[2], A[0]*B[1]+A[1]*B[3], A[2]*B[0]+A[3]*B[2], A[2]*B[1]+A[3]*B[3]]]

        A = [1, 0, 0, 1] # (x + 0) / (0*x + 1) = x

        a = sqrt(x)

        T = len(a) - 1 # period of a
        # apply ak + 1/x = (ak*x+1)/(1x+0) to (Ax + B) / (Cx + D)
        for i in reversed(range(1, len(a))):
            A = combine([a[i], 1, 1, 0], A)

        def bpow(A, n):
            return [1, 0, 0, 1] if not n else combine(A, bpow(A, n-1)) if n % 2 else bpow(combine(A, A), n // 2)


        C = (0, 1, 0, 0) # = 1 / 0
        while k % T:
            i = k % T
            C = combine([a[i], 1, 1, 0], C)
            k -= 1
        C = combine(bpow(A, k // T), C)
        C = combine([a[0], 1, 1, 0], C)
        print(str(C[1]) + '/' + str(C[3]))
        ```

## Geometrik talqin

$r_k = \frac{p_k}{q_k}$ konvergent uchun $\vec r_k = (q_k;p_k)$ deb olamiz. U holda quyidagi rekurrent formula o‘rinli:

$$\vec r_k = a_k \vec r_{k-1} + \vec r_{k-2}.$$

$\vec r = (1;r)$ bo‘lsin. U holda har bir $(x;y)$ vektor qiyalik koeffitsiyenti $\frac{y}{x}$ ga teng bo‘lgan songa mos keladi.

[Psevdoskalyar ko‘paytma](../geometry/basic-geometry.md) $(x_1;y_1) \times (x_2;y_2) = x_1 y_2 - x_2 y_1$ tushunchasi yordamida

$$s_k = -\frac{\vec r_{k-2} \times \vec r}{\vec r_{k-1} \times \vec r} = \left|\frac{\vec r_{k-2} \times \vec r}{\vec r_{k-1} \times \vec r}\right|$$

ekanini ko‘rsatish mumkin (quyidagi tushuntirishga qarang).

Oxirgi tenglik $r_{k-1}$ va $r_{k-2}$ sonlari $r$ ning turli tomonlarida yotishi, demak, $\vec r_{k-1}$ va $\vec r_{k-2}$ ning $\vec r$ bilan psevdoskalyar ko‘paytmalari qarama-qarshi ishoraga ega bo‘lishidan kelib chiqadi. $a_k = \lfloor s_k \rfloor$ ni hisobga olsak, $\vec r_k$ formulasi

$$\vec r_k = \vec r_{k-2} + \left\lfloor \left| \frac{\vec r \times \vec r_{k-2}}{\vec r \times \vec r_{k-1}}\right|\right\rfloor \vec r_{k-1}$$

ko‘rinishini oladi.

$\vec r_k \times r = (q;p) \times (1;r) = qr - p$ ekaniga e’tibor bering. Demak,

$$a_k = \left\lfloor \left| \frac{q_{k-1}r-p_{k-1}}{q_{k-2}r-p_{k-2}} \right| \right\rfloor.$$

??? hint "Tushuntirish"
    Yuqorida $a_k = \lfloor s_k \rfloor$ ekanini qayd etdik; bu yerda $s_k = [a_k; a_{k+1}, a_{k+2}, \dots]$. Boshqa tomondan, konvergentlar rekurrent formulasidan

    $$r = [a_0; a_1, \dots, a_{k-1}, s_k] = \frac{s_k p_{k-1} + p_{k-2}}{s_k q_{k-1} + q_{k-2}}$$

    ni olamiz.

    Vektor ko‘rinishida bu

    $$\vec r \parallel s_k \vec r_{k-1} + \vec r_{k-2}$$

    tarzida yoziladi; ya’ni $\vec r$ va $s_k \vec r_{k-1} + \vec r_{k-2}$ kollinear — ularning qiyalik koeffitsiyenti bir xil. Tenglikning ikkala tomonini $\vec r$ bilan [psevdoskalyar ko‘paytirib](../geometry/basic-geometry.md),

    $$0 = s_k (\vec r_{k-1} \times \vec r) + (\vec r_{k-2} \times \vec r)$$

    ni olamiz. Bundan yakuniy formula

    $$s_k = -\frac{\vec r_{k-2} \times \vec r}{\vec r_{k-1} \times \vec r}$$

    kelib chiqadi.

!!! example "Burunni cho‘zish algoritmi"
    Har safar $\vec p$ vektorga $\vec r_{k-1}$ ni qo‘shganda, $\vec p \times \vec r$ qiymati $\vec r_{k-1} \times \vec r$ ga ortadi.

    Demak, $a_k=\lfloor s_k \rfloor$ — $\vec r_{k-2}$ ga $\vec r_{k-1}$ vektorini $\vec r$ bilan vektor ko‘paytma ishorasini o‘zgartirmasdan qo‘shish mumkin bo‘lgan eng katta butun marta soni.

    Boshqacha aytganda, $a_k$ — $\vec r$ aniqlagan chiziqni kesib o‘tmasdan $\vec r_{k-1}$ ni $\vec r_{k-2}$ ga qo‘shish mumkin bo‘lgan eng katta butun marta soni:

    <figure><img src="https://upload.wikimedia.org/wikipedia/commons/9/92/Continued_convergents_geometry.svg" width="700px"/>
    <figcaption>_$r=\frac{7}{9}=[0;1,3,2]$ ning konvergentlari. Yarim konvergentlar kulrang strelkalar orasidagi oraliq nuqtalarga mos keladi._</figcaption></figure>

    Yuqoridagi rasmda $\vec r_2 = (4;3)$ vektori $\vec r_1 = (1;1)$ ni $\vec r_0 = (1;0)$ ga qayta-qayta qo‘shish orqali olinadi.

    $y=rx$ chizig‘ini kesmasdan $\vec r_1$ ni $\vec r_0$ ga yana qo‘shib bo‘lmay qolganda, chiziqning boshqa tomoniga o‘tamiz va $\vec r_3 = (9;7)$ ni olish uchun $\vec r_2$ ni $\vec r_1$ ga qayta-qayta qo‘shamiz.

    Bu jarayon chiziqqa yaqinlashadigan, uzunligi eksponentsial o‘suvchi vektorlarni hosil qiladi.
    Shu xossasi sababli ketma-ket konvergent vektorlarni hosil qilish jarayoni Boris Delaunay tomonidan **burunni cho‘zish algoritmi** deb atalgan.

$\vec r_{k-2}$, $\vec r_k$ va $\vec 0$ nuqtalarda qurilgan uchburchakka qarasak, uning ikkilangan yuzi

$$|\vec r_{k-2} \times \vec r_k| = |\vec r_{k-2} \times (\vec r_{k-2} + a_k \vec r_{k-1})| = a_k |\vec r_{k-2} \times \vec r_{k-1}| = a_k$$

bo‘lishini ko‘ramiz.

[Pick teoremasi](../geometry/picks-theorem.md) bilan birga bu uchburchak ichida qat’iy yotuvchi panjara nuqtalari yo‘qligini va uning chegarasidagi yagona panjara nuqtalari $\vec 0$ hamda $0 \leq t \leq a_k$ butun $t$ lar uchun $\vec r_{k-2} + t \cdot \vec r_{k-1}$ ekanini anglatadi. Barcha mumkin bo‘lgan $k$ lar uchun bu uchburchaklarni birlashtirsak, juft va toq indeksli konvergent vektorlar hosil qilgan ko‘pburchaklar orasidagi sohada butun nuqtalar yo‘qligi kelib chiqadi.

Bu esa toq koeffitsiyentli $\vec r_k$ lar $y=rx$ chiziq ustida $x \geq 0$ bo‘lgan panjara nuqtalarining qavariq qobig‘ini, juft koeffitsiyentli $\vec r_k$ lar esa chiziq ostida $x > 0$ bo‘lgan panjara nuqtalarining qavariq qobig‘ini hosil qilishini anglatadi.

!!! info "Ta’rif"
    Bu ko‘pburchaklar uzluksiz kasrlarning bunday geometrik talqinini birinchi taklif qilgan Felix Klein sharafiga **Klein ko‘pburchaklari** deb ham ataladi.

## Masala misollari

Endi eng muhim fakt va tushunchalar kiritildi; aniq masala misollarini ko‘rib chiqish vaqti keldi.

!!! example "Chiziq ostidagi qavariq qobiq"
    $r=[a_0;a_1,\dots,a_k]=\frac{p_k}{q_k}$ uchun $0 \leq x \leq N$ va $0 \leq y \leq rx$ shartlarini qanoatlantiruvchi $(x;y)$ panjara nuqtalarining qavariq qobig‘ini toping.

??? hint "Yechim"
    Agar $0 \leq x$ chegaralanmagan to‘plamni qaraganimizda, yuqori qavariq qobiq $y=rx$ chizig‘ining o‘zi bo‘lardi.
    Biroq $x \leq N$ qo‘shimcha cheklovi sababli qavariq qobiqni saqlash uchun bir payt kelib chiziqdan chetga chiqish kerak bo‘ladi.

    $t = \lfloor \frac{N}{q_k}\rfloor$ bo‘lsin. U holda $(0;0)$ dan keyingi qobiqdagi dastlabki $t$ ta panjara nuqtasi $1 \leq \alpha \leq t$ butun $\alpha$ lar uchun $\alpha \cdot (q_k; p_k)$ bo‘ladi.

    Ammo $(t+1)(q_k; p_k)$ keyingi panjara nuqtasi bo‘la olmaydi, chunki $(t+1)q_k > N$.
    Qobiqdagi keyingi panjara nuqtalariga o‘tish uchun $x \leq N$ ni saqlagan holda $y=rx$ dan eng kichik miqdorga chetga chiqadigan $(x;y)$ nuqtaga borish kerak.

    <figure><img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Lattice-hull.svg" width="500px"/>
    <figcaption>$0 \leq x \leq 19$ uchun $y=\frac{4}{7}x$ ostidagi panjara nuqtalarining qavariq qobig‘i $(0;0), (7;4), (14;8), (16;9), (18;10), (19;10)$ nuqtalardan iborat.</figcaption></figure>

    $(x; y)$ qavariq qobiqdagi joriy oxirgi nuqta bo‘lsin. Keyingi $(x'; y')$ nuqta $x' \leq N$ shartni qanoatlantiradi va $(x'; y') - (x; y) = (\Delta x; \Delta y)$ vektor $y=rx$ chizig‘iga imkon qadar yaqin. Boshqacha aytganda, $(\Delta x; \Delta y)$ $\Delta x \leq N - x$ hamda $\Delta y \leq r \Delta x$ shartlari ostida $r \Delta x - \Delta y$ ni maksimallashtiradi.

    Bunday nuqtalar $y=rx$ ostidagi panjara nuqtalarining qavariq qobig‘ida yotadi. Demak, $(\Delta x; \Delta y)$ $r$ ning quyi yarim konvergenti bo‘lishi kerak.
    Shuning uchun $(\Delta x; \Delta y)$ biror toq $i$ va $0 \leq t < a_i$ uchun $(q_{i-1}; p_{i-1}) + t \cdot (q_i; p_i)$ ko‘rinishiga ega.

    Bunday $i$ ni topish uchun barcha mumkin bo‘lgan $i$ larni kattasidan boshlab ko‘rib chiqamiz va $N-x-q_{i-1} \geq 0$ bo‘ladigan $i$ uchun $t = \lfloor \frac{N-x-q_{i-1}}{q_i} \rfloor$ ni olamiz.

    $(\Delta x; \Delta y) = (q_{i-1}; p_{i-1}) + t \cdot (q_i; p_i)$ bo‘lganda, yarim konvergent xossalari tufayli $\Delta y \leq r \Delta x$ sharti saqlanadi.
    $t < a_i$ ham bajariladi, chunki $i+2$ dan olingan yarim konvergentlar allaqachon ishlatib bo‘lingan; demak, $x + q_{i-1} + a_i q_i = x+q_{i+1}$ qiymati $N$ dan katta.

    Endi $(x;y)$ ga $(\Delta x; \Delta y)$ ni $N$ dan oshmasdan $k = \lfloor \frac{N-x}{\Delta x} \rfloor$ marta qo‘shish mumkin; undan keyin navbatdagi yarim konvergentga o‘tamiz.

    === "C++"
        ```cpp
        // returns [ah, ph, qh] such that points r[i]=(ph[i], qh[i]) constitute upper convex hull
        // of lattice points on 0 <= x <= N and 0 <= y <= r * x, where r = [a0; a1, a2, ...]
        // and there are ah[i]-1 integer points on the segment between r[i] and r[i+1]
        auto hull(auto a, int N) {
            auto [p, q] = convergents(a);
            int t = N / q.back();
            vector ah = {t};
            vector ph = {0, t*p.back()};
            vector qh = {0, t*q.back()};
            for(int i = q.size() - 1; i >= 0; i--) {
                if(i % 2) {
                    while(qh.back() + q[i - 1] <= N) {
                        t = (N - qh.back() - q[i - 1]) / q[i];
                        int dp = p[i - 1] + t * p[i];
                        int dq = q[i - 1] + t * q[i];
                        int k = (N - qh.back()) / dq;
                        ah.push_back(k);
                        ph.push_back(ph.back() + k * dp);
                        qh.push_back(qh.back() + k * dq);
                    }
                }
            }
            return make_tuple(ah, ph, qh);
        }
        ```

    === "Python"
        ```py
        # returns [ah, ph, qh] such that points r[i]=(ph[i], qh[i]) constitute upper convex hull
        # of lattice points on 0 <= x <= N and 0 <= y <= r * x, where r = [a0; a1, a2, ...]
        # and there are ah[i]-1 integer points on the segment between r[i] and r[i+1]
        def hull(a, N):
            p, q = convergents(a)
            t = N // q[-1]
            ah = [t]
            ph = [0, t*p[-1]]
            qh = [0, t*q[-1]]
            for i in reversed(range(len(q))):
                if i % 2 == 1:
                    while qh[-1] + q[i-1] <= N:
                        t = (N - qh[-1] - q[i-1]) // q[i]
                        dp = p[i-1] + t*p[i]
                        dq = q[i-1] + t*q[i]
                        k = (N - qh[-1]) // dq
                        ah.append(k)
                        ph.append(ph[-1] + k * dp)
                        qh.append(qh[-1] + k * dq)
            return ah, ph, qh
        ```

!!! example "[Timus - Crime and Punishment](https://timus.online/problem.aspx?space=1&num=1430)"
    Butun $A$, $B$ va $N$ sonlari berilgan. $Ax + By \leq N$ va $Ax + By$ mumkin qadar katta bo‘ladigan $x \geq 0$ va $y \geq 0$ ni toping.

??? hint "Yechim"
    Bu masalada $1 \leq A, B, N \leq 2 \cdot 10^9$, shuning uchun uni $O(\sqrt N)$ da yechish mumkin. Biroq uzluksiz kasrlar yordamida $O(\log N)$ yechim mavjud.

    Qulaylik uchun $x \mapsto \lfloor \frac{N}{A}\rfloor - x$ almashtirish orqali $x$ yo‘nalishini teskarilaymiz. Endi $0 \leq x \leq \lfloor \frac{N}{A} \rfloor$, $By - Ax \leq N \;\bmod\; A$ bo‘ladigan va $By - Ax$ ni maksimallashtiradigan $(x;y)$ nuqtani topish kerak. Har bir $x$ uchun optimal $y$ qiymati $\lfloor \frac{Ax + (N \bmod A)}{B} \rfloor$.

    Masalani umumiyroq ko‘rinishda ko‘rish uchun $0 \leq x \leq N$ va $y = \lfloor \frac{Ax+B}{C} \rfloor$ orasidan eng yaxshi nuqtani topadigan funksiya yozamiz.

    Asosiy yechim g‘oyasi oldingi masalani takrorlaydi, ammo chiziqdan uzoqlashish uchun quyi yarim konvergentlarni ishlatish o‘rniga, chiziqni kesmasdan va $x \leq N$ ni buzmasdan unga yaqinlashish uchun yuqori yarim konvergentlardan foydalaniladi. Oldingi masaladan farqli ravishda, yaqinlashayotganda $y=\frac{Ax+B}{C}$ chizig‘ini kesib o‘tmaslik kerak; yarim konvergentning $t$ koeffitsiyentini hisoblashda buni hisobga olish zarur.

    === "Python"
        ```py
        # (x, y) such that y = (A*x+B) // C,
        # Cy - Ax is max and 0 <= x <= N.
        def closest(A, B, C, N):
            # y <= (A*x + B)/C <=> diff(x, y) <= B
            def diff(x, y):
                return C*y-A*x
            a = fraction(A, C)
            p, q = convergents(a)
            ph = [B // C]
            qh = [0]
            for i in range(2, len(q) - 1):
                if i % 2 == 0:
                    while diff(qh[-1] + q[i+1], ph[-1] + p[i+1]) <= B:
                        t = 1 + (diff(qh[-1] + q[i-1], ph[-1] + p[i-1]) - B - 1) // abs(diff(q[i], p[i]))
                        dp = p[i-1] + t*p[i]
                        dq = q[i-1] + t*q[i]
                        k = (N - qh[-1]) // dq
                        if k == 0:
                            return qh[-1], ph[-1]
                        if diff(dq, dp) != 0:
                            k = min(k, (B - diff(qh[-1], ph[-1])) // diff(dq, dp))
                        qh.append(qh[-1] + k*dq)
                        ph.append(ph[-1] + k*dp)
            return qh[-1], ph[-1]
        def solve(A, B, N):
            x, y = closest(A, N % A, B, N // A)
            return N // A - x, y
        ```

!!! example "[June Challenge 2017 - Euler Sum](https://www.codechef.com/problems/ES)"
    $e = [2; 1, 2, 1, 1, 4, 1, 1, 6, 1, \dots, 1, 2n, 1, \dots]$ — Eyler soni va $N \leq 10^{4000}$ bo‘lganda $\sum\limits_{x=1}^N \lfloor ex \rfloor$ ni hisoblang.

??? hint "Yechim"
    Bu yig‘indi $1 \leq x \leq N$ va $1 \leq y \leq ex$ shartlarini qanoatlantiruvchi $(x;y)$ panjara nuqtalari soniga teng.

    $y=ex$ ostidagi nuqtalarning qavariq qobig‘i qurilgach, bu sonni [Pick teoremasi](../geometry/picks-theorem.md) yordamida hisoblash mumkin:

    === "C++"
        ```cpp
        // sum floor(k * x) for k in [1, N] and x = [a0; a1, a2, ...]
        int sum_floor(auto a, int N) {
            N++;
            auto [ah, ph, qh] = hull(a, N);
            // The number of lattice points within a vertical right trapezoid
            // on points (0; 0) - (0; y1) - (dx; y2) - (dx; 0) that has
            // a+1 integer points on the segment (0; y1) - (dx; y2).
            auto picks = [](int y1, int y2, int dx, int a) {
                int b = y1 + y2 + a + dx;
                int A = (y1 + y2) * dx;
                return (A - b + 2) / 2 + b - (y2 + 1);
            };
            int ans = 0;
            for(size_t i = 1; i < qh.size(); i++) {
                ans += picks(ph[i - 1], ph[i], qh[i] - qh[i - 1], ah[i - 1]);
            }
            return ans - N;
        }
        ```

    === "Python"
        ```py
        # sum floor(k * x) for k in [1, N] and x = [a0; a1, a2, ...]
        def sum_floor(a, N):
            N += 1
            ah, ph, qh = hull(a, N)
            # The number of lattice points within a vertical right trapezoid
            # on points (0; 0) - (0; y1) - (dx; y2) - (dx; 0) that has
            # a+1 integer points on the segment (0; y1) - (dx; y2).
            def picks(y1, y2, dx, a):
                b = y1 + y2 + a + dx
                A = (y1 + y2) * dx
                return (A - b + 2) // 2 + b - (y2 + 1)
            ans = 0
            for i in range(1, len(qh)):
                ans += picks(ph[i-1], ph[i], qh[i]-qh[i-1], ah[i-1])
            return ans - N
        ```

!!! example "[NAIPC 2019 - It's a Mod, Mod, Mod, Mod World](https://open.kattis.com/problems/itsamodmodmodmodworld)"
    $p$, $q$ va $n$ berilgan. $\sum\limits_{i=1}^n [p \cdot i \bmod q]$ ni hisoblang.

??? hint "Yechim"
    $a \bmod b = a - \lfloor \frac{a}{b} \rfloor b$ ekanini hisobga olsak, bu masala oldingi masalaga kamayadi. Ushbu faktdan foydalanib, yig‘indi

    $$\sum\limits_{i=1}^n \left(p \cdot i - \left\lfloor \frac{p \cdot i}{q} \right\rfloor q\right) = \frac{pn(n+1)}{2}-q\sum\limits_{i=1}^n \left\lfloor \frac{p \cdot i}{q}\right\rfloor$$

    ko‘rinishiga keladi.

    Ammo $x$ ning $1$ dan $N$ gacha qiymatlari uchun $\lfloor rx \rfloor$ ni yig‘ish — oldingi masaladan bajara oladigan amalimiz.

    === "C++"
        ```cpp
        void solve(int p, int q, int N) {
            cout << p * N * (N + 1) / 2 - q * sum_floor(fraction(p, q), N) << "\n";
        }
        ```

    === "Python"
        ```py
        def solve(p, q, N):
            return p * N * (N + 1) // 2 - q * sum_floor(fraction(p, q), N)
        ```

!!! example "[Library Checker - Sum of Floor of Linear](https://judge.yosupo.jp/problem/sum_of_floor_of_linear)"
    $N$, $M$, $A$ va $B$ berilgan. $\sum\limits_{i=0}^{N-1} \lfloor \frac{A \cdot i + B}{M} \rfloor$ ni hisoblang.

??? hint "Yechim"
    Bu hozirgacha ko‘rilgan masalalar orasida texnik jihatdan eng qiyini.

    Xuddi shu yondashuvdan foydalanib, $y = \frac{Ax+B}{M}$ chiziq ostidagi nuqtalarning to‘liq qavariq qobig‘ini qurish mumkin.
    $B = 0$ holatini qanday yechishni allaqachon bilamiz. Bundan tashqari, bu qavariq qobiqni $[0, N-1]$ kesmada chiziqqa eng yaqin panjara nuqtasigacha qanday qurish ham ma’lum — bu yuqoridagi “Crime and Punishment” masalasida bajarilgan.

    Endi eng yaqin nuqtaga yetgach, chiziq aslida shu nuqtadan o‘tadi deb hisoblash mumkinligini kuzatamiz: haqiqiy chiziq bilan eng yaqin nuqtadan o‘tishi uchun biroz pastga siljitilgan chiziq orasida $[0,N-1]$ kesmada boshqa panjara nuqtalari yo‘q.

    Demak, $[0,N-1]$ da $y=\frac{Ax+B}{M}$ chiziq ostidagi to‘liq qavariq qobiqni qurish uchun avval chiziqqa eng yaqin nuqtagacha qobiqni quramiz, keyin esa chiziq shu nuqtadan o‘tadi deb, $B=0$ uchun qavariq qobiq qurish algoritmini qayta ishlatamiz:

    === "Python"
        ```py
        # hull of lattice (x, y) such that C*y <= A*x+B
        def hull(A, B, C, N):
            def diff(x, y):
                return C*y-A*x
            a = fraction(A, C)
            p, q = convergents(a)
            ah = []
            ph = [B // C]
            qh = [0]
            def insert(dq, dp):
                k = (N - qh[-1]) // dq
                if diff(dq, dp) > 0:
                    k = min(k, (B - diff(qh[-1], ph[-1])) // diff(dq, dp))
                ah.append(k)
                qh.append(qh[-1] + k*dq)
                ph.append(ph[-1] + k*dp)
            for i in range(1, len(q) - 1):
                if i % 2 == 0:
                    while diff(qh[-1] + q[i+1], ph[-1] + p[i+1]) <= B:
                        t = (B - diff(qh[-1] + q[i+1], ph[-1] + p[i+1])) // abs(diff(q[i], p[i]))
                        dp = p[i+1] - t*p[i]
                        dq = q[i+1] - t*q[i]
                        if dq < 0 or qh[-1] + dq > N:
                            break
                        insert(dq, dp)

            insert(q[-1], p[-1])
            for i in reversed(range(len(q))):
                if i % 2 == 1:
                    while qh[-1] + q[i-1] <= N:
                        t = (N - qh[-1] - q[i-1]) // q[i]
                        dp = p[i-1] + t*p[i]
                        dq = q[i-1] + t*q[i]
                        insert(dq, dp)
            return ah, ph, qh
        ```

!!! example "[OKC 2 - From Modular to Rational](https://codeforces.com/gym/102354/problem/I)"
    $1 \leq p, q \leq 10^9$ bo‘lgan $\frac{p}{q}$ ratsional son mavjud. Bir nechta $m \sim 10^9$ tub sonlar uchun $p q^{-1}$ ning $m$ modul bo‘yicha qiymatini so‘rashingiz mumkin. $\frac{p}{q}$ ni tiklang.

    _Teng kuchli ifoda:_ $1 \leq x \leq N$ uchun $Ax \;\bmod\; M$ ni minimallashtiruvchi $x$ ni toping.

??? hint "Yechim"
    Xitoy qoldiqlar teoremasiga ko‘ra, natijani bir nechta tub son moduli bo‘yicha so‘rash ularning ko‘paytmasi moduli bo‘yicha so‘rash bilan bir xil. Shu sabab umumiylikni yo‘qotmagan holda, qoldiqni yetarlicha katta $m$ modul bo‘yicha bilamiz deb faraz qilamiz.

    Berilgan $r$ qoldiq uchun $p \equiv qr \pmod m$ ning bir nechta mumkin bo‘lgan $(p,q)$ yechimlari bo‘lishi mumkin. Biroq $(p_1,q_1)$ va $(p_2,q_2)$ ikkalasi ham yechim bo‘lsa, $p_1q_2 \equiv p_2q_1 \pmod m$ ham o‘rinli. $\frac{p_1}{q_1} \ne \frac{p_2}{q_2}$ deb faraz qilsak, $|p_1q_2-p_2q_1|$ kamida $m$ bo‘ladi.

    Shartga ko‘ra $1 \leq p,q \leq 10^9$. Demak, $p_1,q_1,p_2,q_2$ ning barchasi $10^9$ dan oshmasa, farq ko‘pi bilan $10^{18}$ bo‘ladi. $m > 10^{18}$ uchun $1 \leq p,q \leq 10^9$ chegaradagi $\frac{p}{q}$ yechim ratsional son sifatida yagona.

    Shunday qilib, berilgan $r$ va $m$ uchun $1 \leq q \leq 10^9$ hamda $qr \;\bmod\; m \leq 10^9$ bo‘ladigan ixtiyoriy $q$ ni topish kerak.
    Bu amalda $1 \leq q \leq 10^9$ oralig‘ida $qr \bmod m$ ni minimallashtiradigan $q$ ni topish bilan bir xil.

    $qr = km + b$ bo‘lsa, $1 \leq q \leq 10^9$ va $qr-km \geq 0$ qiymati mumkin qadar kichik bo‘ladigan $(q,k)$ juftni topishimiz kerak.

    $m$ o‘zgarmas bo‘lgani uchun uni $m$ ga bo‘lib, masalani $1 \leq q \leq 10^9$ va $\frac{r}{m}q-k \geq 0$ qiymatini minimallashtiradigan $q$ ni topish tarzida qayta yozamiz.

    Uzluksiz kasrlar tilida bu $\frac{k}{q}$ kasri $\frac{r}{m}$ ning eng yaxshi Diofant yaqinlashuvi bo‘lishi kerakligini anglatadi; $\frac{r}{m}$ ning faqat quyi yarim konvergentlarini tekshirish kifoya.

    === "Python"
        ```py
        # find Q that minimizes Q*r mod m for 1 <= k <= n < m
        def mod_min(r, n, m):
            a = fraction(r, m)
            p, q = convergents(a)
            for i in range(2, len(q)):
                if i % 2 == 1 and (i + 1 == len(q) or q[i+1] > n):
                    t = (n - q[i-1]) // q[i]
                    return q[i-1] + t*q[i]
        ```

## Mashq masalalari

- [UVa OJ - Continued Fractions](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=775)
- [ProjectEuler+ #64: Odd period square roots](https://www.hackerrank.com/contests/projecteuler/challenges/euler064/problem)
- [Codeforces Round #184 (Div. 2) - Continued Fractions](https://codeforces.com/contest/305/problem/B)
- [Codeforces Round #201 (Div. 1) - Doodle Jump](https://codeforces.com/contest/346/problem/E)
- [Codeforces Round #325 (Div. 1) - Alice, Bob, Oranges and Apples](https://codeforces.com/contest/585/problem/C)
- [POJ Founder Monthly Contest 2008.03.16 - A Modular Arithmetic Challenge](http://poj.org/problem?id=3530)
- [2019 Multi-University Training Contest 5 - fraction](http://acm.hdu.edu.cn/showproblem.php?pid=6624)
- [SnackDown 2019 Elimination Round - Election Bait](https://www.codechef.com/SNCKEL19/problems/EBAIT)
- [Code Jam 2019 round 2 - Continued Fraction](https://github.com/google/coding-competitions-archive/blob/main/codejam/2019/round_2/new_elements_part_2/statement.pdf)
