---
article_id: algebra--binary-exp
---
# Ikkilik darajaga oshirish

Ikkilik darajaga oshirish (kvadratlash orqali darajaga oshirish deb ham ataladi) — $n$ manfiy bo‘lmagan butun son bo‘lganda $a^n$ ni sodda usul talab qiladigan $O(n)$ ta ko‘paytirish o‘rniga atigi $O(\log n)$ ta ko‘paytirish yordamida hisoblash imkonini beradigan usuldir.

U arifmetikaga aloqador bo‘lmagan ko‘plab masalalarda ham muhim qo‘llanishlarga ega, chunki undan **assotsiativlik** xossasiga ega bo‘lgan istalgan amal bilan foydalanish mumkin:

$$(X \cdot Y) \cdot Z = X \cdot (Y \cdot Z)$$
Buning eng yaqqol misollari modul bo‘yicha ko‘paytirish, matritsalarni ko‘paytirish va quyida ko‘rib chiqiladigan boshqa masalalardir.
## Algoritm

$a$ ni $n$-darajaga oshirish sodda usulda $a$ ni o‘ziga $n-1$ marta ko‘paytirish ko‘rinishida ifodalanadi:
$a^{n} = a \cdot a \cdot \ldots \cdot a$. Biroq katta $a$ yoki $n$ uchun bu yondashuv amaliy emas.

$a^{b+c} = a^b \cdot a^c$ va $a^{2b} = a^b \cdot a^b = (a^b)^2$.

Ikkilik darajaga oshirish g‘oyasi ishni daraja ko‘rsatkichining ikkilik yozuvidan foydalanib qismlarga ajratishdan iborat.

Masalan, $n$ ni ikkilik sanoq tizimida yozamiz:

$$3^{13} = 3^{1101_2} = 3^8 \cdot 3^4 \cdot 3^1$$
$n$ sonining ikkilik yozuvida aynan $\lfloor \log_2 n \rfloor + 1$ ta raqam bo‘lgani sababli, agar $a^1, a^2, a^4, a^8, \dots, a^{2^{\lfloor \log_2 n \rfloor}}$ darajalarini bilsak, bizga atigi $O(\log n)$ ta ko‘paytirish kerak bo‘ladi.

Demak, faqat shu darajalarni tez hisoblash usulini bilishimiz kerak.
Yaxshiyamki, bu juda oson, chunki ketma-ketlikdagi har bir element avvalgi elementning kvadratidir.
$$\begin{align}
3^1 &= 3 \\
3^2 &= \left(3^1\right)^2 = 3^2 = 9 \\
3^4 &= \left(3^2\right)^2 = 9^2 = 81 \\
3^8 &= \left(3^4\right)^2 = 81^2 = 6561
\end{align}$$

Shunday qilib, $3^{13}$ ning yakuniy qiymatini olish uchun ulardan faqat uchtasini ko‘paytirish kifoya ($n$ dagi mos bit o‘rnatilmagani uchun $3^2$ tashlab ketiladi):
$3^{13} = 6561 \cdot 81 \cdot 3 = 1594323$
Bu algoritmning yakuniy murakkabligi $O(\log n)$: $a$ ning $\log n$ ta darajasini hisoblaymiz, so‘ng ulardan javobni olish uchun ko‘pi bilan yana $\log n$ ta ko‘paytirish bajaramiz.

Quyidagi rekursiv yondashuv ham ayni g‘oyani ifodalaydi:

$$a^n = \begin{cases}
1 &\text{agar } n == 0 \\
\left(a^{\frac{n}{2}}\right)^2 &\text{agar } n > 0 \text{ va } n \text{ juft bo‘lsa}\\
\left(a^{\frac{n - 1}{2}}\right)^2 \cdot a &\text{agar } n > 0 \text{ va } n \text{ toq bo‘lsa}\\
\end{cases}$$
## Implementatsiya

Avval rekursiv formulani to‘g‘ridan-to‘g‘ri kodga ko‘chiradigan rekursiv yondashuv:

```cpp
long long binpow(long long a, long long b) {
    if (b == 0)
        return 1;
    long long res = binpow(a, b / 2);
    if (b % 2)
        return res * res * a;
    else
        return res * res;
}
```
Ikkinchi yondashuv xuddi shu vazifani rekursiyasiz bajaradi.
U barcha darajalarni siklda hisoblaydi va $n$ dagi mos biti o‘rnatilganlarini javobga ko‘paytiradi.
Ikkala yondashuvning murakkabligi bir xil bo‘lsa-da, rekursiv chaqiruvlarning qo‘shimcha xarajati bo‘lmagani uchun bu yondashuv amalda tezroq ishlaydi.
```cpp
long long binpow(long long a, long long b) {
    long long res = 1;
    while (b > 0) {
        if (b & 1)
            res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}
```
## Qo‘llanishlar
### Katta darajalarni biror son modulida samarali hisoblash

**Masala:**
$x^n \bmod m$ ni hisoblang.
Bu juda ko‘p uchraydigan amal. Masalan, undan [modul bo‘yicha multiplikativ teskari elementni](module-inverse.md) hisoblashda foydalaniladi.

**Yechim:**
Modul amali ko‘paytirishga xalaqit bermasligini ($a \cdot b \equiv (a \bmod m) \cdot (b \bmod m) \pmod m$) bilganimiz uchun ayni koddan foydalanib, har bir ko‘paytirishni modul bo‘yicha ko‘paytirishga almashtirishimiz mumkin:
```cpp
long long binpow(long long a, long long b, long long m) {
    a %= m;
    long long res = 1;
    while (b > 0) {
        if (b & 1)
            res = res * a % m;
        a = a * a % m;
        b >>= 1;
    }
    return res;
}
```
**Eslatma:**
Katta $b >> m$ uchun bu algoritmni tezlashtirish mumkin.
Agar $m$ musbat va $\gcd(x, m) = 1$ bo‘lsa, tub $m$ uchun $x^n \equiv x^{n \bmod (m-1)} \pmod{m}$, murakkab $m$ uchun esa $x^n \equiv x^{n \bmod{\phi(m)}} \pmod{m}$ bo‘ladi.
Bu bevosita Fermatning kichik teoremasi va Eyler teoremasidan kelib chiqadi; batafsil ma’lumot uchun [Modul bo‘yicha teskari elementlar](module-inverse.md#fermat-euler) haqidagi maqolaga qarang.
### Fibonacci sonlarini samarali hisoblash

**Masala:** $n$-Fibonacci soni $F_n$ ni hisoblang.
**Yechim:** Batafsil ma’lumot uchun [Fibonacci sonlari haqidagi maqolaga](fibonacci-numbers.md) qarang.
Bu yerda algoritmning faqat umumiy ko‘rinishini ko‘rib chiqamiz.
Keyingi Fibonacci sonini hisoblash uchun faqat oldingi ikkita son kerak, chunki $F_n = F_{n-1} + F_{n-2}$.
Biz ushbu almashtirishni tasvirlaydigan $2 \times 2$ matritsa tuza olamiz:
$F_i$ va $F_{i+1}$ dan $F_{i+1}$ va $F_{i+2}$ ga o‘tish.
Masalan, bu almashtirishni $F_0$ va $F_1$ juftligiga qo‘llasak, u $F_1$ va $F_2$ juftligiga aylanadi.
Shunday qilib, ushbu almashtirish matritsasini $n$-darajaga oshirib, $F_n$ ni $O(\log n)$ vaqt murakkabligida topishimiz mumkin.
### Permutatsiyani $k$ marta qo‘llash { data-toc-label='Permutatsiyani <script type="math/tex">k</script> marta qo‘llash' }

**Masala:** Uzunligi $n$ bo‘lgan ketma-ketlik berilgan. Unga berilgan permutatsiyani $k$ marta qo‘llang.

**Yechim:** Permutatsiyani ikkilik darajaga oshirish yordamida $k$-darajaga oshirib, keyin uni ketma-ketlikka qo‘llash kifoya. Natijada vaqt murakkabligi $O(n \log k)$ bo‘ladi.
```cpp
vector<int> applyPermutation(vector<int> sequence, vector<int> permutation) {
    vector<int> newSequence(sequence.size());
    for(int i = 0; i < sequence.size(); i++) {
        newSequence[i] = sequence[permutation[i]];
    }
    return newSequence;
}
vector<int> permute(vector<int> sequence, vector<int> permutation, long long k) {
    while (k > 0) {
        if (k & 1) {
            sequence = applyPermutation(sequence, permutation);
        }
        permutation = applyPermutation(permutation, permutation);
        k >>= 1;
    }
    return sequence;
}
```
**Eslatma:** Bu masalani permutatsiya grafini qurib, har bir siklni alohida ko‘rib chiqish orqali chiziqli vaqtda yanada samarali yechish mumkin. Bunda har bir sikl uchun $k$ ni sikl uzunligi bo‘yicha modulga keltirib, shu siklga kiruvchi har bir sonning yakuniy o‘rnini topish mumkin.
### Nuqtalar to‘plamiga geometrik amallar to‘plamini tez qo‘llash
**Masala:** $n$ ta $p_i$ nuqta berilgan; ularning har biriga $m$ ta almashtirishni qo‘llang. Har bir almashtirish siljitish, masshtablash yoki berilgan o‘q atrofida berilgan burchakka aylantirish bo‘lishi mumkin. Bundan tashqari, berilgan almashtirishlar ro‘yxatini $k$ marta qo‘llaydigan `loop` amali ham mavjud (`loop` amallari ichma-ich joylashishi mumkin). Barcha almashtirishlarni $O(n \cdot length)$ dan tezroq qo‘llashingiz kerak, bu yerda $length$ — `loop` amallari yoyib yozilgandan keyin qo‘llanadigan almashtirishlarning umumiy soni.
**Yechim:** Turli xil almashtirishlar koordinatalarni qanday o‘zgartirishini ko‘rib chiqamiz:

* Siljitish amali: koordinatalarning har biriga alohida konstanta qo‘shadi.
* Masshtablash amali: koordinatalarning har birini alohida konstantaga ko‘paytiradi.
* Aylantirish amali: almashtirish murakkabroq (bu yerda tafsilotlarga kirmaymiz), ammo yangi koordinatalarning har biri baribir eski koordinatalarning chiziqli kombinatsiyasi sifatida ifodalanishi mumkin.
Ko‘rib turganingizdek, har bir almashtirish koordinatalar ustidagi chiziqli amal sifatida ifodalanadi. Demak, almashtirish quyidagi ko‘rinishdagi $4 \times 4$ matritsa bilan yozilishi mumkin:

$$\begin{pmatrix}
a_{11} & a_ {12} & a_ {13} & a_ {14} \\
a_{21} & a_ {22} & a_ {23} & a_ {24} \\
a_{31} & a_ {32} & a_ {33} & a_ {34} \\
a_{41} & a_ {42} & a_ {43} & a_ {44}
\end{pmatrix}$$

Bu matritsa eski koordinatalar va birlikdan iborat vektorga ko‘paytirilganda, yangi koordinatalar va birlikdan iborat yangi vektorni beradi:
$$\begin{pmatrix} x & y & z & 1 \end{pmatrix} \cdot
\begin{pmatrix}
a_{11} & a_ {12} & a_ {13} & a_ {14} \\
a_{21} & a_ {22} & a_ {23} & a_ {24} \\
a_{31} & a_ {32} & a_ {33} & a_ {34} \\
a_{41} & a_ {42} & a_ {43} & a_ {44}
\end{pmatrix}
 = \begin{pmatrix} x' & y' & z' & 1 \end{pmatrix}$$
(Nega soxta to‘rtinchi koordinatani kiritdik, deb so‘rashingiz mumkin. Bu kompyuter grafikasida keng qo‘llanadigan [bir jinsli koordinatalarning](https://en.wikipedia.org/wiki/Homogeneous_coordinates) go‘zalligidir. Ularsiz siljitish kabi affin amallarni bitta matritsa ko‘paytmasi bilan ifodalab bo‘lmaydi, chunki buning uchun koordinatalarga konstanta _qo‘shish_ kerak. Yuqoriroq o‘lchamda esa affin almashtirish chiziqli almashtirishga aylanadi!)
Almashtirishlarning matritsa ko‘rinishida ifodalanishiga bir nechta misol:

* Siljitish amali: $x$ koordinatani $5$ ga, $y$ koordinatani $7$ ga va $z$ koordinatani $9$ ga siljitish.

$$\begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
5 & 7 & 9 & 1
\end{pmatrix}$$

* Masshtablash amali: $x$ koordinatani $10$ marta, qolgan ikkitasini esa $5$ marta masshtablash.

$$\begin{pmatrix}
10 & 0 & 0 & 0 \\
0 & 5 & 0 & 0 \\
0 & 0 & 5 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}$$
* Aylantirish amali: o‘ng qo‘l qoidasiga muvofiq $x$ o‘qi atrofida $\theta$ gradusga aylantirish (soat mili yo‘nalishiga teskari).

$$\begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & \cos \theta & -\sin \theta & 0 \\
0 & \sin \theta & \cos \theta & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}$$
Endi har bir almashtirish matritsa sifatida ifodalangach, almashtirishlar ketma-ketligi ushbu matritsalar ko‘paytmasi bilan, $k$ marta takrorlanadigan `loop` esa matritsaning $k$-darajasi bilan ifodalanadi (uni ikkilik darajaga oshirish orqali $O(\log{k})$ vaqtda hisoblash mumkin). Shu yo‘l bilan barcha almashtirishlarni ifodalovchi matritsa avval $O(m \log{k})$ vaqtda hisoblanadi, keyin u $n$ ta nuqtaning har biriga jami $O(n)$ vaqtda qo‘llanadi; umumiy murakkablik $O(n + m \log{k})$ bo‘ladi.
### Grafdagi uzunligi $k$ bo‘lgan yo‘llar soni { data-toc-label='Grafdagi uzunligi <script type="math/tex">k</script> bo‘lgan yo‘llar soni' }

**Masala:** $n$ ta uchli yo‘naltirilgan vaznsiz graf berilgan. Istalgan $u$ uchdan istalgan boshqa $v$ uchga uzunligi $k$ bo‘lgan yo‘llar sonini toping.
**Yechim:** Bu masala [alohida maqolada](../graph/fixed_length_paths.md) batafsil ko‘rib chiqilgan. Algoritm grafning qo‘shnilik matritsasi $M$ ni ($i$ dan $j$ ga qirra bo‘lsa $m_{ij}=1$, aks holda $0$ bo‘lgan matritsa) $k$-darajaga oshirishdan iborat. Shundan so‘ng $m_{ij}$ — $i$ dan $j$ ga uzunligi $k$ bo‘lgan yo‘llar soni bo‘ladi. Ushbu yechimning vaqt murakkabligi $O(n^3 \log k)$.
**Eslatma:** O‘sha maqolada bu masalaning yana bir varianti ham ko‘rib chiqiladi: qirralar vaznli va aynan $k$ ta qirrani o‘z ichiga olgan eng kichik vaznli yo‘lni topish talab qilinadi. Maqolada ko‘rsatilganidek, bu masala ham qo‘shnilik matritsasini darajaga oshirish orqali yechiladi. Matritsada $i$ dan $j$ ga qirraning vazni, qirra bo‘lmasa esa $\infty$ turadi.
Ikki matritsani odatiy ko‘paytirish amali o‘rniga o‘zgartirilgan amal ishlatiladi:
ko‘paytirish o‘rniga ikki qiymat qo‘shiladi, yig‘indi o‘rniga esa minimum olinadi.
Ya’ni: $result_{ij} = \min\limits_{1\ \leq\ k\ \leq\ n}(a_{ik} + b_{kj})$.
### Ikkilik darajaga oshirish varianti: ikki sonni $m$ modul bo‘yicha ko‘paytirish { data-toc-label='Ikkilik darajaga oshirish varianti: ikki sonni <script type="math/tex">m</script> modul bo‘yicha ko‘paytirish' }

**Masala:** Ikki $a$ va $b$ sonini $m$ modul bo‘yicha ko‘paytiring. $a$ va $b$ ichki ma’lumot turlariga sig‘adi, biroq ularning ko‘paytmasi 64 bitli butun songa sig‘maydi. Maqsad katta sonlar arifmetikasidan foydalanmasdan $a \cdot b \pmod m$ ni hisoblashdir.
**Yechim:** Yuqorida tasvirlangan ikkilik qurish algoritmini qo‘llaymiz, faqat ko‘paytirishlar o‘rniga qo‘shishlarni bajaramiz. Boshqacha aytganda, ikki sonni ko‘paytirishni $O(\log m)$ ta qo‘shish va ikkiga ko‘paytirish amaliga “yoydik” (ikkiga ko‘paytirishning o‘zi ham aslida qo‘shishdir).
$$a \cdot b = \begin{cases}
0 &\text{agar }a = 0 \\
2 \cdot \frac{a}{2} \cdot b &\text{agar }a > 0 \text{ va }a \text{ juft bo‘lsa} \\
2 \cdot \frac{a-1}{2} \cdot b + b &\text{agar }a > 0 \text{ va }a \text{ toq bo‘lsa}
\end{cases}$$
**Eslatma:** Bu masalani suzuvchi nuqtali amallar yordamida boshqacha usulda ham yechish mumkin. Avval suzuvchi nuqtali sonlar yordamida $\frac{a \cdot b}{m}$ ifodani hisoblab, uni ishorasiz butun $q$ ga o‘tkazing. So‘ng ishorasiz butun sonlar arifmetikasi yordamida $a \cdot b$ dan $q \cdot m$ ni ayirib, javobni topish uchun $m$ modulini oling. Bu yechim unchalik ishonchli ko‘rinmaydi, ammo juda tez va implementatsiyasi juda oson.
Qo‘shimcha ma’lumot uchun [bu yerga](https://cs.stackexchange.com/questions/77016/modular-multiplication) qarang.
## Amaliy masalalar
* [UVa 1230 - MODEX](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=3671)
* [UVa 374 - Big Mod](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=310)
* [UVa 11029 - Leading and Trailing](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1970)
* [Codeforces - Parking Lot](http://codeforces.com/problemset/problem/630/I)
* [leetcode - Count good numbers](https://leetcode.com/problems/count-good-numbers/)
* [Codechef - Chef and Riffles](https://www.codechef.com/JAN221B/problems/RIFFLES)
* [Codeforces - Decoding Genome](https://codeforces.com/contest/222/problem/E)
* [Codeforces - Neural Network Country](https://codeforces.com/contest/852/problem/B)
* [Codeforces - Magic Gems](https://codeforces.com/problemset/problem/1117/D)
* [SPOJ - The last digit](http://www.spoj.com/problems/LASTDIG/)
* [SPOJ - Locker](http://www.spoj.com/problems/LOCKER/)
* [LA - 3722 Jewel-eating Monsters](https://vjudge.net/problem/UVALive-3722)
* [SPOJ - Just add it](http://www.spoj.com/problems/ZSUM/)
* [Codeforces - Stairs and Lines](https://codeforces.com/contest/498/problem/E)
