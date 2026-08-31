---
article_id: algebra--discrete-log
---
# Diskret logarifm

Diskret logarifm — berilgan $a$, $b$ va $m$ butun sonlar uchun

$$a^x \equiv b \pmod m$$

tenglamani qanoatlantiradigan $x$ butun sonidir.

Diskret logarifm har doim ham mavjud bo‘lavermaydi. Masalan, $2^x \equiv 3 \pmod 7$ tenglamaning yechimi yo‘q. Diskret logarifm mavjudligini aniqlaydigan sodda shart yo‘q.
Ushbu maqolada 1971-yilda Shanks taklif qilgan, diskret logarifmni $O(\sqrt m)$ vaqtda hisoblaydigan **Baby-step giant-step** algoritmini tavsiflaymiz. Bu **meet-in-the-middle** algoritmidir, chunki masalani ikki yarmiga ajratish usulidan foydalanadi.
## Algoritm

Quyidagi tenglamani ko‘rib chiqamiz:

$$a^x \equiv b \pmod m,$$

bu yerda $a$ va $m$ o‘zaro tub.

$x=np-q$ bo‘lsin, bu yerda $n$ — oldindan tanlanadigan o‘zgarmas son (uni qanday tanlash keyinroq tushuntiriladi). $p$ **giant step** deb ataladi, chunki uni birga oshirish $x$ ni $n$ ga oshiradi. Xuddi shuningdek, $q$ **baby step** deb ataladi.

$[0;m)$ oraliqdagi istalgan $x$ sonini shu ko‘rinishda ifodalash mumkin; bunda $p\in[1;\lceil\frac mn\rceil]$ va $q\in[0;n]$.

U holda tenglama:
$$a^{np-q}\equiv b\pmod m.$$

$a$ va $m$ o‘zaro tub ekanidan foydalanib:

$$a^{np}\equiv ba^q\pmod m$$

ni olamiz. Bu yangi tenglamani soddalashtirib:

$$f_1(p)=f_2(q).$$

ko‘rinishida yozish mumkin.

Masalani meet-in-the-middle usuli bilan quyidagicha yechamiz:

* Barcha mumkin bo‘lgan $p$ lar uchun $f_1$ ni hisoblaymiz. Qiymat-argument juftliklari massivini saralaymiz.
* Barcha mumkin bo‘lgan $q$ lar uchun $f_2$ ni hisoblaymiz va saralangan massivdan mos $p$ ni ikkilik qidiruv bilan izlaymiz.
## Murakkablik

$f_1(p)$ ni [ikkilik darajaga oshirish algoritmi](binary-exp.md) yordamida $O(\log m)$ vaqtda hisoblaymiz. $f_2(q)$ uchun ham xuddi shunday.

Algoritmning birinchi qadamida har bir mumkin bo‘lgan $p$ uchun $f_1$ ni hisoblash, keyin qiymatlarni saralash kerak. Demak, bu qadamning murakkabligi:

$$O\left(\left\lceil \frac{m}{n} \right\rceil \left(\log m + \log \left\lceil \frac{m}{n} \right\rceil \right)\right) = O\left( \left\lceil \frac {m}{n} \right\rceil \log m\right)$$
Ikkinchi qadamda har bir mumkin bo‘lgan $q$ uchun $f_2(q)$ ni hisoblash va $f_1$ qiymatlari massivida ikkilik qidiruv bajarish kerak; shu sababli uning murakkabligi:

$$O\left(n \left(\log m + \log \frac{m}{n} \right) \right) = O\left(n \log m\right).$$

Bu ikki murakkablikni qo‘shsak, $\log m$ soni $n+m/n$ yig‘indisiga ko‘paytiriladi. Yig‘indi $n=m/n$ bo‘lganda minimum bo‘ladi. Demak, optimal ishlash uchun:

$$n=\sqrt m.$$

Shunda algoritmning murakkabligi:

$$O(\sqrt m\log m).$$
## Implementatsiya
### Eng sodda implementatsiya

Quyidagi kodda `powmod` funksiyasi $a^b\pmod m$ ni hisoblaydi, `solve` esa masalaning biror to‘g‘ri yechimini topadi.
Agar yechim bo‘lmasa $-1$, aks holda mumkin bo‘lgan yechimlardan bittasini qaytaradi.

```cpp
int powmod(int a, int b, int m) {
    int res = 1;
    while (b > 0) {
        if (b & 1) {
            res = (res * 1ll * a) % m;
        }
        a = (a * 1ll * a) % m;
        b >>= 1;
    }
    return res;
}
int solve(int a, int b, int m) {
    a %= m, b %= m;
    int n = sqrt(m) + 1;
    map<int, int> vals;
    for (int p = 1; p <= n; ++p)
        vals[powmod(a, p * n, m)] = p;
    for (int q = 0; q <= n; ++q) {
        int cur = (powmod(a, q, m) * 1ll * b) % m;
        if (vals.count(cur)) {
            int ans = vals[cur] * n - q;
            return ans;
        }
    }
    return -1;
}
```
Bu kodda $f_1$ qiymatlarini saqlash uchun C++ standart kutubxonasidagi `map` dan foydalandik.
`map` ichki tomondan qiymatlarni qizil-qora daraxtda saqlaydi.
Shuning uchun bu kod massiv va ikkilik qidiruv ishlatilgan variantdan biroz sekinroq, ammo yozish ancha oson.
Kodimiz $0^0=1$ deb faraz qilishiga e’tibor bering: ya’ni $0^x\equiv1\pmod m$ tenglama uchun ham, $0^x\equiv0\pmod1$ tenglama uchun ham $0$ ni yechim deb hisoblaydi.
Bu algebrada ko‘p ishlatiladigan kelishuv, ammo barcha sohalarda birdek qabul qilinmagan.
Ba’zan $0^0$ shunchaki aniqlanmagan deb olinadi.
Agar bu kelishuv sizga mos kelmasa, $a=0$ holini alohida qayta ishlash kerak:

```cpp
    if (a == 0)
        return b == 0 ? 1 : -1;
```
Yana bir jihat: bir xil $f_1$ qiymatiga mos keladigan bir nechta $p$ bo‘lsa, ulardan faqat bittasini saqlaymiz.
Bu holatda bu yetarli, chunki biz faqat mumkin bo‘lgan bitta yechimni qaytarmoqchimiz.
Barcha mumkin bo‘lgan yechimlarni qaytarish kerak bo‘lsa, `map<int, int>` ni, masalan, `map<int, vector<int>>` ga almashtirish kerak.
Ikkinchi qadamni ham shunga mos ravishda o‘zgartirish lozim.
## Yaxshilangan implementatsiya

Mumkin bo‘lgan yaxshilanishlardan biri — ikkilik darajaga oshirishdan voz kechish.
Buni $q$ har safar oshirilganda $a$ ga ko‘paytiriladigan bir o‘zgaruvchi va $p$ har safar oshirilganda $a^n$ ga ko‘paytiriladigan ikkinchi o‘zgaruvchini saqlash orqali bajarish mumkin.
Bu o‘zgarishdan keyin algoritm murakkabligi o‘sha-o‘sha qoladi, ammo $\log$ ko‘paytuvchi faqat `map` uchun qoladi.
`map` o‘rniga qo‘shish va qidirishning o‘rtacha murakkabligi $O(1)$ bo‘lgan hash-jadvaldan (`unordered_map`) ham foydalanish mumkin.
Masalalarda ko‘pincha tenglamani qanoatlantiradigan eng kichik $x$ so‘raladi.
Barcha javoblarni topib minimumini olish yoki birinchi topilgan javobni [Eyler teoremasi](phi-function.md#application) yordamida kamaytirish mumkin, ammo qiymatlarni hisoblash tartibini aqlli tanlab, birinchi topilgan javobning o‘zi minimum bo‘lishini ta’minlashimiz mumkin.

```{.cpp file=discrete_log}
// Returns minimum x for which a ^ x % m = b % m, a and m are coprime.
int solve(int a, int b, int m) {
    a %= m, b %= m;
    int n = sqrt(m) + 1;
    int an = 1;
    for (int i = 0; i < n; ++i)
        an = (an * 1ll * a) % m;

    unordered_map<int, int> vals;
    for (int q = 0, cur = b; q <= n; ++q) {
        vals[cur] = q;
        cur = (cur * 1ll * a) % m;
    }

    for (int p = 1, cur = 1; p <= n; ++p) {
        cur = (cur * 1ll * an) % m;
        if (vals.count(cur)) {
            int ans = n * p - vals[cur];
            return ans;
        }
    }
    return -1;
}
```

`unordered_map` ishlatilganda murakkablik $O(\sqrt m)$ bo‘ladi.
## $a$ va $m$ o‘zaro tub bo‘lmaganda { data-toc-label='a va m o‘zaro tub bo‘lmaganda' }

$g=\gcd(a,m)$ va $g>1$ bo‘lsin. Ravshanki, har qanday $x\ge1$ uchun $a^x\bmod m$ soni $g$ ga bo‘linadi.

Agar $g\nmid b$ bo‘lsa, $x$ uchun yechim yo‘q.

Agar $g\mid b$ bo‘lsa, $a=g\alpha$, $b=g\beta$, $m=g\nu$ deb olaylik.

$$
\begin{aligned}
a^x & \equiv b \mod m \\
(g \alpha) a^{x - 1} & \equiv g \beta \mod g \nu \\
\alpha a^{x-1} & \equiv \beta \mod \nu
\end{aligned}
$$
Baby-step giant-step algoritmini $ka^x\equiv b\pmod m$ tenglamani $x$ ga nisbatan yechadigan qilib oson kengaytirish mumkin.

```{.cpp file=discrete_log_extended}
// Returns minimum x for which a ^ x % m = b % m.
int solve(int a, int b, int m) {
    a %= m, b %= m;
    int k = 1, add = 0, g;
    while ((g = gcd(a, m)) > 1) {
        if (b == k)
            return add;
        if (b % g)
            return -1;
        b /= g, m /= g, ++add;
        k = (k * 1ll * a / g) % m;
    }
    int n = sqrt(m) + 1;
    int an = 1;
    for (int i = 0; i < n; ++i)
        an = (an * 1ll * a) % m;

    unordered_map<int, int> vals;
    for (int q = 0, cur = b; q <= n; ++q) {
        vals[cur] = q;
        cur = (cur * 1ll * a) % m;
    }

    for (int p = 1, cur = k; p <= n; ++p) {
        cur = (cur * 1ll * an) % m;
        if (vals.count(cur)) {
            int ans = n * p - vals[cur] + add;
            return ans;
        }
    }
    return -1;
}
```
Dastlab $a$ va $m$ ni o‘zaro tub holga keltirish $O(\log^2m)$ vaqtda bajarilgani sababli, umumiy vaqt murakkabligi avvalgidek $O(\sqrt m)$ bo‘lib qoladi.
## Mashq masalalari
* [Spoj - Power Modulo Inverted](http://www.spoj.com/problems/MOD/)
* [Topcoder - SplittingFoxes3](https://community.topcoder.com/stat?c=problem_statement&pm=14386&rd=16801)
* [CodeChef - Inverse of a Function](https://www.codechef.com/problems/INVXOR/)
* [Hard Equation](https://codeforces.com/gym/101853/problem/G) ($0^0$ aniqlanmagan deb faraz qiling)
* [CodeChef - Chef and Modular Sequence](https://www.codechef.com/problems/CHEFMOD)
## Manbalar
* [Wikipedia - Baby-step giant-step](https://en.wikipedia.org/wiki/Baby-step_giant-step)
* [Mathematics StackExchange’da Zanderning javobi](https://math.stackexchange.com/a/133054)
