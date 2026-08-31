---
article_id: combinatorics--burnside
---
# Burnside lemmasi va Pólya sanash teoremasi

## Burnside lemmasi

**Burnside lemmasi** 1897-yilda Burnside tomonidan ifodalangan va isbotlangan. Biroq tarixan uni 1887-yilda Frobenius, undan ham oldin — 1845-yilda Cauchy kashf qilgan. Shu sababli u ba’zan **Cauchy–Frobenius lemmasi** deb ham ataladi.

Burnside lemmasi ichki simmetriyaga asoslanib, to‘plamdagi ekvivalentlik sinflari sonini hisoblash imkonini beradi.

### Obyektlar va tasvirlar

Obyektlar soni bilan ularning tasvirlari sonini aniq farqlash kerak.

Turli tasvirlar bir xil obyektga mos kelishi mumkin, ammo har bir tasvir, albatta, aynan bitta obyektga mos keladi. Shuning uchun barcha tasvirlar to‘plami ekvivalentlik sinflariga bo‘linadi.

Bizning vazifamiz obyektlar sonini yoki xuddi shu ma’noda ekvivalentlik sinflari sonini hisoblashdir.

Quyidagi misol obyekt bilan tasvir o‘rtasidagi farqni aniqroq ko‘rsatadi.

### Misol: ikkilik daraxtlarni bo‘yash

Quyidagi masala berilgan bo‘lsin.

$n$ ta tugunli ildizli ikkilik daraxtni ikki rangga bo‘yash usullari sonini topish kerak. Har bir tugunda chap va o‘ng farzandlar bir-biridan farqlanmaydi.

Bu yerda obyektlar to‘plami — daraxtning turli bo‘yalishlari to‘plami.

Endi tasvirlar to‘plamini aniqlaymiz. Bo‘yalish tasviri har bir tugunga rang tayinlaydigan $f(v)$ funksiya bo‘lsin; bu yerda ranglar sifatida $0$ va $1$ ishlatiladi. Tasvirlar to‘plami shunday barcha mumkin bo‘lgan funksiyalarni o‘z ichiga oladi va uning o‘lchami ravshan ravishda $2^n$ ga teng.

Shu bilan birga, bu to‘plamni ekvivalentlik sinflariga ajratamiz.

Masalan, $n=3$ bo‘lsin va daraxt $1$-ildiz hamda uning $2$ va $3$ farzandlaridan iborat bo‘lsin. Quyidagi $f_1$ va $f_2$ funksiyalar ekvivalent deb qaraladi:

$$\begin{array}{ll}
f_1(1)=0 & f_2(1)=0\\
f_1(2)=1 & f_2(2)=0\\
f_1(3)=0 & f_2(3)=1
\end{array}$$

### Invariant permutatsiyalar

Nega $f_1$ va $f_2$ funksiyalar bir ekvivalentlik sinfiga tegishli?

Intuitiv jihatdan bu tushunarli: $1$-tugunning $2$ va $3$ farzandlarini o‘rin almashtirishimiz mumkin. Shunday o‘zgartirishdan keyin $f_1$ funksiya $f_2$ bilan ustma-ust tushadi.

Formal ravishda bu shunday **invariant permutatsiya** $\pi$ mavjudligini anglatadiki, u obyektning o‘zini o‘zgartirmaydi, faqat uning tasvirini o‘zgartiradi va:

$$f_2\pi\equiv f_1$$

bo‘ladi.

Obyekt ta’rifidan kelib chiqib barcha invariant permutatsiyalarni, ya’ni tasvirga qo‘llanganda obyektni o‘zgartirmaydigan barcha permutatsiyalarni topish mumkin.

So‘ng ikkita $f_1$ va $f_2$ funksiya ekvivalentligini, ya’ni bir xil obyektga mos kelishini, har bir invariant permutatsiya uchun

$$f_2\pi\equiv f_1$$

shartini yoki unga teng kuchli $f_1\pi\equiv f_2$ shartini tekshirish orqali aniqlash mumkin. Shartni qanoatlantiradigan kamida bitta permutatsiya topilsa, $f_1$ va $f_2$ ekvivalent; aks holda ekvivalent emas.

Obyekt ta’rifiga nisbatan barcha invariant permutatsiyalarni topish Burnside lemmasi va Pólya sanash teoremasini qo‘llashdagi asosiy qadamdir.

Bu invariant permutatsiyalar aniq masalaga bog‘liq va ularni topish ko‘pincha intuitiv mulohazalarga tayangan evristik jarayon. Biroq aksariyat hollarda boshqa barcha permutatsiyalarni hosil qiladigan bir nechta “asosiy” permutatsiyani qo‘lda topish kifoya; qolgan ishni kompyuterga topshirish mumkin.

Invariant permutatsiyalar **guruh** hosil qilishi qiyin emas: ikkita invariant permutatsiyaning ko‘paytmasi, ya’ni kompozitsiyasi ham invariant permutatsiyadir.

Invariant permutatsiyalar guruhini $G$ bilan belgilaymiz.

### Lemma ta’rifi

Lemmani ifodalash uchun algebradan yana bitta ta’rif kerak.

$\pi$ permutatsiyaning **qo‘zg‘almas nuqtasi** $f$ — shu permutatsiya ta’sirida o‘zgarmaydigan element:

$$f\equiv f\pi.$$

Masalan, yuqoridagi misolda $\pi$ qo‘llanganda o‘zgarmaydigan bo‘yalishlarga mos funksiyalar $f$ qo‘zg‘almas nuqtalardir. Bu yerda “o‘zgarmaslik” funksiyalar tengligining formal ma’nosida tushuniladi.

$\pi$ permutatsiyaning **qo‘zg‘almas nuqtalari sonini** $I(\pi)$ bilan belgilaymiz.

**Burnside lemmasi** quyidagicha:

Ekvivalentlik sinflari soni $G$ guruhidagi barcha permutatsiyalarning qo‘zg‘almas nuqtalari sonlari yig‘indisini guruh o‘lchamiga bo‘lishga teng:

$$|\text{Classes}|=\frac1{|G|}\sum_{\pi\in G}I(\pi)$$

Burnside lemmasining o‘zi amaliyotda har doim ham juda qulay emas, chunki $I(\pi)$ qiymatini tez topish yo‘li darhol ko‘rinmasligi mumkin. Shunga qaramay, u ekvivalentlik sinflarini hisoblash g‘oyasining matematik mohiyatini eng ravshan ko‘rsatadi.

### Burnside lemmasining isboti

Bu yerda berilgan isbot amaliy qo‘llanishlar uchun muhim emas, shuning uchun birinchi o‘qishda uni tashlab ketish mumkin.

Quyidagi isbot ma’lum isbotlarning eng soddalaridan biri bo‘lib, guruhlar nazariyasidan foydalanmaydi. Uni Kenneth P. Bogart 1991-yilda e’lon qilgan.

Quyidagini isbotlashimiz kerak:

$$|\text{Classes}|\cdot|G|=\sum_{\pi\in G}I(\pi)$$

O‘ng tomondagi qiymat $f\pi\equiv f$ shartini qanoatlantiradigan “invariant juftliklar” $(f,\pi)$ sonidan boshqa narsa emas.

Yig‘ish tartibini almashtirish mumkinligi ravshan. Yig‘indini barcha $f$ elementlar bo‘yicha olib, har biri uchun $J(f)$ — $f$ qo‘zg‘almas nuqta bo‘ladigan permutatsiyalar sonini — qo‘shamiz:

$$|\text{Classes}|\cdot|G|=\sum_fJ(f)$$

Bu formulani isbotlash uchun ustunlari barcha $f_i$ funksiyalar, satrlari esa barcha $\pi_j$ permutatsiyalar bilan belgilangan jadval tuzamiz. Har bir katakka $f_i\pi_j$ qiymatini yozamiz.

Jadval ustunlarini to‘plamlar deb qarasak, ayrim ustunlar bir xil bo‘ladi. Bu shu ustunlarga mos $f$ funksiyalar ekvivalent ekanini anglatadi. Demak, to‘plam sifatida turli ustunlar soni sinflar soniga teng.

Guruhlar nazariyasi nuqtayi nazaridan $f_i$ bilan belgilangan ustun shu elementning orbitasidir. Ekvivalent elementlarning orbitalari bir xil va orbitalar soni aynan sinflar sonini beradi.

Shunday qilib, jadval ustunlari ekvivalentlik sinflariga ajraladi.

Bir sinfni mahkamlab, undagi ustunlarni ko‘rib chiqamiz.

Birinchidan, bu ustunlarda faqat shu ekvivalentlik sinfiga tegishli $f_i$ elementlar qatnashishi mumkin. Aks holda biror invariant $\pi_j$ permutatsiya funksiyalardan birini boshqa ekvivalentlik sinfiga o‘tkazgan bo‘lardi, bu esa mumkin emas.

Ikkinchidan, har bir $f_i$ elementi shu sinfdagi har bir ustunda bir xil marta uchraydi; bu ham ustunlar ekvivalent elementlarga mos kelishidan kelib chiqadi.

Shundan bitta ekvivalentlik sinfidagi barcha ustunlar multito‘plam sifatida bir xil degan xulosaga kelamiz.

Endi ixtiyoriy $f$ elementni mahkamlaymiz. Bir tomondan, u o‘z ustunida ta’rifga ko‘ra aynan $J(f)$ marta uchraydi. Ikkinchi tomondan, bir ekvivalentlik sinfidagi barcha ustunlar multito‘plam sifatida bir xil. Demak, shu sinfning har bir ustunida istalgan $g$ element aynan $J(g)$ marta uchraydi.

Har bir ekvivalentlik sinfidan ixtiyoriy bittadan ustun tanlab, ulardagi elementlar sonini qo‘shsak, bir tomondan $|\text{Classes}|\cdot|G|$ ni olamiz, chunki ustunlar sonini satrlar soniga ko‘paytiryapmiz. Ikkinchi tomondan, oldingi mulohazalarga ko‘ra barcha $f$ lar uchun $J(f)$ qiymatlari yig‘indisini olamiz:

$$|\text{Classes}|\cdot|G|=\sum_fJ(f)$$

Bu talab qilingan tenglikdir.

## Pólya sanash teoremasi

Pólya sanash teoremasi Burnside lemmasining umumlashmasi bo‘lib, ekvivalentlik sinflari sonini topish uchun qulayroq vosita ham beradi.

Bu teoremani Pólyadan oldin, 1927-yilda Redfield kashf qilgan, ammo uning nashri matematiklar e’tiboridan chetda qolgan. Pólya 1937-yilda mustaqil ravishda ayni natijalarga kelgan va uning nashri ko‘proq muvaffaqiyat qozongan.

Bu yerda Pólya sanash teoremasining amaliyotda juda foydali bo‘lgan faqat maxsus holatini ko‘rib chiqamiz. Teoremaning umumiy formulasi muhokama qilinmaydi.

$C(\pi)$ bilan $\pi$ permutatsiyadagi sikllar sonini belgilaymiz. U holda quyidagi formula — **Pólya sanash teoremasining maxsus holati** — o‘rinli:

$$|\text{Classes}|=\frac1{|G|}\sum_{\pi\in G}k^{C(\pi)}$$

Bu yerda $k$ — tasvirning har bir elementi qabul qilishi mumkin bo‘lgan qiymatlar soni. Ikkilik daraxtni bo‘yash misolida $k=2$.

### Asoslash

Bu formula Burnside lemmasining bevosita natijasidir. Uni olish uchun lemmada qatnashadigan $I(\pi)$ uchun aniq ifodani topish kifoya.

$I(\pi)$ — $\pi$ permutatsiyaning qo‘zg‘almas nuqtalari soni ekanini eslaymiz. Biror $\pi$ permutatsiya va $f$ elementni ko‘rib chiqamiz.

$\pi$ qo‘llanganda $f$ ning elementlari permutatsiya sikllari bo‘ylab ko‘chadi. Natijada $f\equiv f\pi$ bo‘lishi kerakligi sababli bitta sikl ta’sir qiladigan barcha elementlar bir xil qiymatga ega bo‘lishi shart. Turli sikllar esa bir-biridan mustaqil.

Shuning uchun $\pi$ ning har bir sikli uchun $k$ ta mumkin qiymatdan bittasini tanlashimiz mumkin. Natijada qo‘zg‘almas nuqtalar soni:

$$I(\pi)=k^{C(\pi)}$$

## Qo‘llanish: marjonlarni bo‘yash

“Marjon” masalasi klassik kombinatorik masalalardan biridir.

$n$ ta donadan iborat, har bir donasi $k$ rangdan biriga bo‘yalishi mumkin bo‘lgan turli marjonlar sonini topish kerak. Ikki marjonni taqqoslashda ularni aylantirish mumkin, ammo teskarisiga o‘girish mumkin emas; ya’ni siklik siljishga ruxsat beriladi.

Bu masalada invariant permutatsiyalar guruhini darhol topish mumkin:

$$\begin{align}
\pi_0&=1\ 2\ 3\ \dots\ n\\
\pi_1&=2\ 3\ \dots\ n\ 1\\
\pi_2&=3\ \dots\ n\ 1\ 2\\
&\dots\\
\pi_{n-1}&=n\ 1\ 2\ 3\dots
\end{align}$$

$C(\pi_i)$ ni hisoblash uchun aniq formula topamiz.

Avval $\pi_i$ permutatsiyaning $j$-o‘rnida $i+j$ qiymati, $n$ modul bo‘yicha olingan holda, turishiga e’tibor beramiz. $\pi_i$ ning sikl tuzilishini ko‘rsak, $1$ elementi $1+i$ ga, $1+i$ elementi $1+2i$ ga, u $1+3i$ ga va hokazo, $1+kn$ ko‘rinishidagi songa yetguncha o‘tadi. Qolgan elementlar uchun ham xuddi shunday mulohaza o‘rinli.

Demak, barcha sikllarning uzunligi bir xil va:

$$\frac{\operatorname{lcm}(i,n)}i=\frac n{\gcd(i,n)}$$

ga teng. Shuning uchun $\pi_i$ dagi sikllar soni $\gcd(i,n)$ ga teng.

Bu qiymatlarni Pólya sanash teoremasiga qo‘ysak, masala javobini olamiz:

$$\frac1n\sum_{i=1}^n k^{\gcd(i,n)}$$

Formulani shu ko‘rinishda qoldirish yoki yanada soddalashtirish mumkin.

Yig‘indini $n$ ning barcha bo‘luvchilari bo‘yicha yuradigan qilib o‘zgartiramiz. Dastlabki yig‘indida ko‘plab teng hadlar bor: $i$ soni $n$ ning bo‘luvchisi bo‘lmasa ham, $\gcd(i,n)$ ni hisoblash orqali shunday bo‘luvchi olinadi.

Shuning uchun har bir $d\mid n$ bo‘luvchining $k^{\gcd(d,n)}=k^d$ hadi yig‘indida bir necha marta uchraydi. Javobni quyidagicha yozish mumkin:

$$\frac1n\sum_{d\mid n}C_dk^d,$$

bu yerda $C_d$ — $\gcd(i,n)=d$ bo‘lgan $i$ sonlar miqdori.

Bu qiymat uchun aniq ifoda topamiz. Har qanday shunday $i$ son

$$i=dj,\qquad\gcd\left(j,\frac nd\right)=1$$

ko‘rinishga ega; aks holda $\gcd(i,n)>d$ bo‘lardi. Demak, shunday $j$ lar sonini hisoblash kerak.

[Eulerning phi funksiyasi](../algebra/phi-function.md) $C_d=\phi(n/d)$ natijani beradi. Shunday qilib, javob:

$$\frac1n\sum_{d\mid n}\phi\left(\frac nd\right)k^d$$

## Qo‘llanish: torusni bo‘yash

Ekvivalentlik sinflari soni uchun har doim ham aniq formula chiqarib bo‘lmaydi. Ko‘p masalalarda guruhdagi permutatsiyalar soni qo‘lda hisoblash uchun juda katta bo‘ladi va ularning sikllar sonini analitik topib bo‘lmaydi.

Bunday holatda butun $G$ guruhini hosil qila oladigan bir nechta “asosiy” permutatsiyani qo‘lda topish kerak. So‘ng $G$ guruhidagi barcha permutatsiyalarni hosil qiladigan, ulardagi sikllar sonini sanaydigan va formula bo‘yicha javobni hisoblaydigan dastur yozish mumkin.

Torusni bo‘yash masalasini misol sifatida ko‘rib chiqamiz.

$n\times m$ ($n<m$) katakli qog‘oz varaq berilgan va uning ayrim kataklari qora. Avval uzunligi $m$ bo‘lgan ikki tomonini bir-biriga yopishtirib silindr hosil qilinadi. Keyin silindrning yuqori va pastki aylanalarini buramasdan yopishtirib torus hosil qilinadi.

Yopishtirilgan chiziqlar ko‘rinmaydi va torusni turli yo‘nalishda aylantirish mumkin deb hisoblab, turli bo‘yalgan toruslar sonini topish kerak.

Yana $n\times m$ qog‘oz varaqdan boshlaymiz. Quyidagi o‘zgartirishlar ekvivalentlik sinfini saqlashi oson ko‘rinadi:

- qatorlarni siklik siljitish;
- ustunlarni siklik siljitish;
- varaqni $180^\circ$ ga burish.

Shuningdek, bu o‘zgartirishlar invariant o‘zgartirishlarning butun guruhini hosil qila oladi.

Qog‘oz kataklarini biror usulda raqamlasak, ushbu uch turdagi o‘zgartirishga mos $p_1$, $p_2$, $p_3$ permutatsiyalarni yozish mumkin. Keyin faqat ularning ko‘paytmalari orqali hosil bo‘ladigan barcha permutatsiyalarni yaratish qoladi.

Barcha bunday permutatsiyalar

$$p_1^{i_1}p_2^{i_2}p_3^{i_3}$$

ko‘rinishida bo‘ladi, bu yerda $i_1=0\ldots m-1$, $i_2=0\ldots n-1$, $i_3=0\ldots1$.

Masala implementatsiyasi:

```cpp
using Permutation = vector<int>;

void operator*=(Permutation& p, Permutation const& q) {
    Permutation copy = p;
    for (int i = 0; i < p.size(); i++)
        p[i] = copy[q[i]];
}
int count_cycles(Permutation p) {
    int cnt = 0;
    for (int i = 0; i < p.size(); i++) {
        if (p[i] != -1) {
            cnt++;
            for (int j = i; p[j] != -1;) {
                int next = p[j];
                p[j] = -1;
                j = next;
            }
        }
    }
    return cnt;
}
int solve(int n, int m) {
    Permutation p(n*m), p1(n*m), p2(n*m), p3(n*m);
    for (int i = 0; i < n*m; i++) {
        p[i] = i;
        p1[i] = (i % n + 1) % n + i / n * n;
        p2[i] = (i / n + 1) % m * n + i % n;
        p3[i] = (m - 1 - i / n) * n + (n - 1 - i % n);
    }
    set<Permutation> s;
    for (int i1 = 0; i1 < n; i1++) {
        for (int i2 = 0; i2 < m; i2++) {
            for (int i3 = 0; i3 < 2; i3++) {
                s.insert(p);
                p *= p3;
            }
            p *= p2;
        }
        p *= p1;
    }
    int sum = 0;
    for (Permutation const& p : s) {
        sum += 1 << count_cycles(p);
    }
    return sum / s.size();
}
```

## Amaliy masalalar

- [CSES — Counting Necklaces](https://cses.fi/problemset/task/2209)
- [CSES — Counting Grids](https://cses.fi/problemset/task/2210)
- [Codeforces — Buildings](https://codeforces.com/gym/101873/problem/B)
- [CS Academy — Cube Coloring](https://csacademy.com/contest/beta-round-8/task/cube-coloring/)
- [Codeforces — Side Transmutations](https://codeforces.com/contest/1065/problem/E)
- [LightOJ — Necklace](https://vjudge.net/problem/LightOJ-1419)
- [POJ — Necklace of Beads](http://poj.org/problem?id=1286)
- [CodeChef — Lucy and Flowers](https://www.codechef.com/problems/DECORATE)
- [HackerRank — Count the Necklaces](https://www.hackerrank.com/contests/infinitum12/challenges/count-the-necklaces)
- [POJ — Magic Bracelet](http://poj.org/problem?id=2888)
- [SPOJ — Sorting Machine](https://www.spoj.com/problems/SRTMACH/)
- [Project Euler — Pizza Toppings](https://projecteuler.net/problem=281)
- [ICPC 2011 SERCP — Alphabet Soup](https://basecamp.eolymp.com/tr/problems/3064)
- [GCPC 2017 — Buildings](https://basecamp.eolymp.com/en/problems/11615)

