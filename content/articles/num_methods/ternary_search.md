---
article_id: num_methods--ternary_search
---
# Uchlik qidiruv

$[l,r]$ oraliqda **unimodal** $f(x)$ funksiya berilgan bo‘lsin. Unimodallik quyidagi ikki holatdan birini anglatadi:

1. funksiya avval qat’iy o‘sadi, bitta nuqta yoki biror oraliqda maksimumga erishadi, keyin qat’iy kamayadi;
2. funksiya avval qat’iy kamayadi, minimumga erishadi, keyin qat’iy o‘sadi.

Quyida birinchi holatda $[l,r]$ dagi maksimumni topamiz. Minimum uchun barcha taqqoslashlar simmetrik ravishda teskarilanadi.

## Algoritm

Oraliq ichidan

$$l<m_1<m_2<r$$

bo‘ladigan ikkita nuqta tanlab, $f(m_1)$ va $f(m_2)$ ni hisoblaymiz. Uch holat mavjud.

- **$f(m_1)<f(m_2)$.** Maksimum $[l,m_1]$ da bo‘la olmaydi. Ikkala nuqta ham o‘suvchi qismda yoki faqat $m_1$ o‘suvchi qismda yotadi. Qidiruv $[m_1,r]$ da davom etadi.
- **$f(m_1)>f(m_2)$.** Oldingi holatga simmetrik: maksimum $[m_2,r]$ da bo‘la olmaydi va yangi oraliq $[l,m_2]$ bo‘ladi.
- **$f(m_1)=f(m_2)$.** Ikkala nuqta maksimal plato ichida yoki $m_1$ o‘suvchi, $m_2$ kamayuvchi qismda turadi. Maksimum $[m_1,m_2]$ da saqlanadi. Kodni soddalashtirish uchun bu holat yuqoridagi ikki holatdan biriga qo‘shib yuborilishi mumkin.

Har taqqoslashdan keyin $[l,r]$ qisqaroq $[l',r']$ bilan almashtiriladi. Jarayon takrorlansa, oraliq istalgan aniqlikkacha torayadi.

Odatda nuqtalar oraliqni uchta teng qismga bo‘ladigan qilib olinadi:

$$m_1=l+\frac{r-l}{3},$$

$$m_2=r-\frac{r-l}{3}.$$

$m_1$ va $m_2$ bir-biriga yaqinroq tanlansa, bir iteratsiyadagi qisqarish biroz tezlashishi mumkin, ammo funksiyani qayta hisoblash va sonli aniqlik masalalari ham hisobga olinadi.

## Murakkablik

Har iteratsiyada qidiruv oralig‘ining taxminan uchdan biri tashlanadi:

$$T(n)=T(2n/3)+O(1)=\Theta(\log n).$$

Bu bahoni [Master teoremasi](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)) orqali ham olish mumkin.

Demak, iteratsiyalar soni oraliq uzunligiga nisbatan logarifmik. Haqiqiy sonlarda murakkablik boshlang‘ich uzunlik va talab qilingan mutlaq xato $\varepsilon$ ga bog‘liq:

$$O\left(\log\frac{r-l}{\varepsilon}\right).$$

Bitta $f(x)$ hisoblash $C$ vaqt olsa, oddiy implementatsiyaning umumiy vaqti $O(C\log((r-l)/\varepsilon))$ bo‘ladi.

## Butun argumentli funksiya

$x$ faqat butun qiymat olsa, $[l,r]$ diskret oraliq bo‘ladi. $m_1$ va $m_2$ ni oraliqni taxminan uchga bo‘ladigan butun nuqtalar sifatida tanlash algoritm to‘g‘riligini o‘zgartirmaydi.

Farq to‘xtash shartida: $r-l<3$ bo‘lganda $m_1$ va $m_2$ ni bir-biridan hamda chegaralardan farqli tanlash imkonsiz. Sikl davom ettirilsa, chegaralar o‘zgarmay qolib, cheksiz sikl yuz berishi mumkin. Shuning uchun kichik oraliq qolishi bilan $l,l+1,\ldots,r$ nuqtalarning barchasi bevosita tekshiriladi.

```cpp
long long ternary_search_integer(long long l, long long r) {
    while (r - l >= 3) {
        long long m1 = l + (r - l) / 3;
        long long m2 = r - (r - l) / 3;
        if (f(m1) < f(m2))
            l = m1;
        else
            r = m2;
    }

    long long best = l;
    for (long long x = l + 1; x <= r; ++x)
        if (f(x) > f(best))
            best = x;
    return best;
}
```

## Oltin kesim bo‘yicha qidiruv

Ba’zi masalalarda $f(x)$ ni hisoblash qimmat, lekin aniqlik sabab iteratsiyalar sonini kamaytirib bo‘lmaydi. Oltin kesim usuli birinchi iteratsiyadan keyin har qadamda funksiyani faqat bitta yangi nuqtada hisoblash imkonini beradi.

$m_1$ va $m_2$ quyidagi nisbatni saqlasin:

$$\frac{r-l}{r-m_1}=\frac{r-l}{m_2-l}=\varphi.$$

$l=m_1$ qilib yangilanganda yangi $m_1'$ eski $m_2$ bilan ustma-ust tushishini istaymiz. Bundan

$$\frac{r-m_1}{r-m_2}=\varphi$$

kelib chiqadi. Nisbatlarni almashtirib soddalashtirsak,

$$\varphi^2-\varphi-1=0$$

tenglama hosil bo‘ladi. Musbat yechim — mashhur oltin nisbat:

$$\varphi=\frac{1+\sqrt5}{2}.$$

Shunda

$$m_1=l+\frac{r-l}{1+\varphi},\qquad
m_2=r-\frac{r-l}{1+\varphi}.$$

Har yangilanishda yangi ichki nuqtalardan biri avvalgi nuqta bilan bir xil bo‘ladi va uning $f$ qiymati qayta ishlatiladi. $r=m_2$ bo‘lgan simmetrik holatda ham ayni $\varphi$ chiqadi.

## Haqiqiy sonlar uchun C++ implementatsiyasi

```cpp
double ternary_search(double l, double r) {
    const double eps = 1e-9;

    while (r - l > eps) {
        double m1 = l + (r - l) / 3;
        double m2 = r - (r - l) / 3;
        double f1 = f(m1);
        double f2 = f(m2);

        if (f1 < f2)
            l = m1;
        else
            r = m2;
    }

    return f(l);
}
```

Bu yerdagi `eps` funksiya qiymatidagi emas, $x$ koordinatasidagi mutlaq xatoni nazorat qiladi. `f` ning o‘zi noaniq hisoblanishidan keladigan xato bunga kirmaydi.

Muqobil to‘xtash sharti sifatida qat’iy iteratsiyalar sonini ishlatish mumkin. Bu chegaralarning kattaligidan mustaqil va talab qilingan nisbiy aniqlikni bashorat qilishni osonlashtiradi. Sport dasturlash masalalarida xato chegarasi ko‘pincha $10^{-6}$ bo‘ladi; `double` uchun 200–300 iteratsiya odatda yetarli, lekin masala sharti va $f$ hisobining barqarorligi albatta tekshiriladi.

## Qachon ishlatmaslik kerak?

Uchlik qidiruv faqat unimodallik isbotlanganida ishonchli. Bir nechta mahalliy maksimum yoki minimumli funksiyada u global optimumni tashlab yuborishi mumkin. Diskret funksiyada keng plato va yaxlitlashlar ham to‘xtash shartiga ehtiyotkorlik talab qiladi. Predikat monoton bo‘lsa, uchlik qidiruv emas, ikkilik qidiruv odatda sodda va tezroq yechimdir.

## Mashq masalalari

- [Codeforces 1978B — New Bakery](https://codeforces.com/problemset/problem/1978/B)
- [CodeChef — Race Time](https://www.codechef.com/problems/AMCS03)
- [HackerEarth — Rescuer](https://www.hackerearth.com/problem/algorithm/rescuer-2d2495cb/)
- [SPOJ — Building Construction](http://www.spoj.com/problems/KOPC12A/)
- [Codeforces 578C — Weakness and Poorness](http://codeforces.com/problemset/problem/578/C)
- [LightOJ 1146 — Closest Distance](http://lightoj.com/volume_showproblem.php?problem=1146)
- [Codeforces Gym 101309D — Dome of Circus](http://codeforces.com/gym/101309)
- [UVA — Galactic Taxes](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4898)
- [Codeforces Gym 100829A — Chasing the Cheetahs](http://codeforces.com/gym/100829)
- [UVA 12197 — Trick or Treat](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3349)
- [Codeforces 439D — Devu and His Brother](https://codeforces.com/problemset/problem/439/D)
- [CodeChef — Is This JEE](https://www.codechef.com/problems/ICM2003)
- [Codeforces 1355E — Restorer Distance](https://codeforces.com/contest/1355/problem/E)
- [Timus 1058 — Chocolate](https://acm.timus.ru/problem.aspx?space=1&num=1058)
- [Timus 1436 — Billboard](https://acm.timus.ru/problem.aspx?space=1&num=1436)
- [Timus 1451 — Beerhouse Tale](https://acm.timus.ru/problem.aspx?space=1&num=1451)
- [Timus 1719 — Kill the Shaitan-Boss](https://acm.timus.ru/problem.aspx?space=1&num=1719)
- [Timus 1913 — Titan Ruins](https://acm.timus.ru/problem.aspx?space=1&num=1913)
