---
article_id: algebra--factorial-modulo
---
# Faktorial $p$ modul bo‘yicha

Ba’zi hollarda suratida ham, maxrajida ham faktoriallar qatnashadigan murakkab formulalarni biror tub $p$ modul bo‘yicha ko‘rib chiqish kerak bo‘ladi; masalan, binomial koeffitsiyentlar formulasida shunday holat uchraydi.
Biz $p$ nisbatan kichik bo‘lgan holatni ko‘rib chiqamiz.
Bu masala faktoriallar kasrning ham suratida, ham maxrajida paydo bo‘lgandagina ma’noga ega.
Aks holda $p!$ va undan keyingi hadlarning barchasi nolga aylanadi.
Ammo kasrlarda $p$ ko‘paytuvchilari qisqarishi mumkin va natijaviy ifoda $p$ modul bo‘yicha noldan farqli bo‘ladi.
Shunday qilib, masalani formal tarzda quyidagicha ifodalash mumkin: faktorialda uchraydigan $p$ ga karrali barcha ko‘paytuvchilarni hisobga olmasdan $n! \bmod p$ ni hisoblamoqchimiz.
Tasavvur qiling, $n!$ ning tub ko‘paytuvchilarga ajratilishini yozamiz, barcha $p$ ko‘paytuvchilarini olib tashlaymiz va qolgan ko‘paytmani $p$ modul bo‘yicha hisoblaymiz.
Bu *o‘zgartirilgan* faktorialni $n!_{\%p}$ bilan belgilaymiz.
Masalan, $7!_{\%p} \equiv 1 \cdot 2 \cdot \underbrace{1}_{3} \cdot 4 \cdot 5 \underbrace{2}_{6} \cdot 7 \equiv 2 \bmod 3$.
Ushbu o‘zgartirilgan faktorialni samarali hisoblashni o‘rganish turli kombinatorik formulalarning qiymatini tez topish imkonini beradi (masalan, [binomial koeffitsiyentlar](../combinatorics/binomial-coefficients.md)).
## Algoritm
Bu o‘zgartirilgan faktorialni oshkora yozamiz.
$$\begin{aligned}
n!_{\%p} &=& 1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot \underbrace{1}_{p} \cdot (p+1) \cdot (p+2) \cdot \ldots \cdot (2p-1) \cdot \underbrace{2}_{2p} \\
 & &\quad \cdot (2p+1) \cdot \ldots \cdot (p^2-1) \cdot \underbrace{1}_{p^2} \cdot (p^2 +1) \cdot \ldots \cdot n \pmod{p} \\\\
&=& 1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot \underbrace{1}_{p} \cdot 1 \cdot 2 \cdot \ldots \cdot (p-1) \cdot \underbrace{2}_{2p} \cdot 1 \cdot 2 \\
& &\quad \cdot \ldots \cdot (p-1) \cdot \underbrace{1}_{p^2} \cdot 1 \cdot 2 \cdot \ldots \cdot (n \bmod p) \pmod{p}
\end{aligned}$$
Faktorial oxirgisidan tashqari uzunligi bir xil bo‘lgan bir nechta blokka bo‘linishini aniq ko‘rish mumkin.
$$\begin{aligned}
n!_{\%p}&=& \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 1}_{1\text{st}} \cdot \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 2}_{2\text{nd}} \cdot \ldots \\\\
& & \cdot \underbrace{1 \cdot 2 \cdot 3 \cdot \ldots \cdot (p-2) \cdot (p-1) \cdot 1}_{p\text{th}} \cdot \ldots \cdot \quad \underbrace{1 \cdot 2 \cdot \cdot \ldots \cdot (n \bmod p)}_{\text{tail}} \pmod{p}.
\end{aligned}$$
Bloklarning asosiy qismini hisoblash oson — bu shunchaki $(p-1)!\ \mathrm{mod}\ p$.
Uni dasturiy ravishda hisoblashimiz yoki istalgan tub $p$ uchun $(p-1)! \bmod p=-1$ ekanini aytadigan Wilson teoremasini qo‘llashimiz mumkin.
Bunday bloklar soni aynan $\lfloor \frac{n}{p} \rfloor$ ta, shuning uchun $-1$ ni $\lfloor \frac{n}{p} \rfloor$-darajaga oshirishimiz kerak.
Buni [ikkilik darajaga oshirish](binary-exp.md) yordamida logarifmik vaqtda bajarish mumkin; ammo natija $-1$ va $1$ orasida almashishini ham payqash mumkin, shuning uchun daraja ko‘rsatkichining juft-toqligiga qarash va u toq bo‘lsa $-1$ ga ko‘paytirishning o‘zi yetarli.
Ko‘paytirish o‘rniga joriy natijani $p$ dan ayirishimiz ham mumkin.
Oxirgi to‘liq bo‘lmagan blok qiymatini alohida $O(p)$ vaqtda hisoblash mumkin.


Endi har bir blokning faqat oxirgi elementi qoldi.
Hisobga olingan elementlarni yashirsak, quyidagi andozani ko‘ramiz:

$$n!_{\%p} = \underbrace{ \ldots \cdot 1 } \cdot \underbrace{ \ldots \cdot 2} \cdot \ldots \cdot \underbrace{ \ldots \cdot (p-1)} \cdot \underbrace{ \ldots \cdot 1 } \cdot \underbrace{ \ldots \cdot 1} \cdot \underbrace{ \ldots \cdot 2} \cdots$$
Bu yana bir *o‘zgartirilgan* faktorial, faqat o‘lchami ancha kichik.
U $\lfloor n/p \rfloor !_{\%p}$ ga teng.

Shunday qilib, *o‘zgartirilgan* $n!_{\%p}$ faktorialini hisoblash davomida $O(p)$ ta amal bajardik va endi $\lfloor n/p \rfloor !_{\%p}$ ni hisoblash qoldi.
Biz rekurrent formulaga ega bo‘ldik.
Rekursiya chuqurligi $O(\log_p n)$, demak algoritmning umumiy asimptotikasi $O(p\log_p n)$.
E’tibor bering, agar $0!,~1!,~2!,~\dots,~(p-1)!$ faktoriallarini $p$ modul bo‘yicha oldindan hisoblasak, murakkablik shunchaki $O(\log_p n)$ bo‘ladi.
## Implementatsiya

Bu dumli rekursiya holati bo‘lgani uchun rekursiyaga ehtiyoj yo‘q va uni iteratsiya bilan oson amalga oshirish mumkin.
Quyidagi implementatsiyada $0!,~1!,~2!,~\dots,~(p-1)!$ ni oldindan hisoblaymiz; shu sababli ishlash vaqti $O(p+\log_p n)$.
Funksiyani bir necha marta chaqirish kerak bo‘lsa, oldindan hisoblashni funksiya tashqarisida bajarib, $n!_{\%p}$ ni har safar $O(\log_p n)$ vaqtda hisoblash mumkin.
```cpp
int factmod(int n, int p) {
    vector<int> f(p);
    f[0] = 1;
    for (int i = 1; i < p; i++)
        f[i] = f[i-1] * i % p;

    int res = 1;
    while (n > 1) {
        if ((n/p) % 2)
            res = p - res;
        res = res * f[n%p] % p;
        n /= p;
    }
    return res;
}
```
Muqobil ravishda, xotira cheklangan bo‘lib, barcha faktoriallarni saqlash imkoni bo‘lmasa, faqat kerakli faktoriallarni eslab qolish, ularni saralash va so‘ng $0!,~1!,~2!,~\dots,~(p-1)!$ ni oshkora saqlamasdan bitta siklda hisoblab chiqish mumkin.
## $p$ ning karraliligi

Binomial koeffitsiyentni $p$ modul bo‘yicha hisoblamoqchi bo‘lsak, qo‘shimcha ravishda $n!$ dagi $p$ ning karraliligini, ya’ni $n!$ ning tub ko‘paytuvchilarga ajratilishida $p$ necha marta qatnashishini yoki *o‘zgartirilgan* faktorialni hisoblashda $p$ ni necha marta o‘chirganimizni bilishimiz kerak.

[Legendre formulasi](https://en.wikipedia.org/wiki/Legendre%27s_formula) buni $O(\log_p n)$ vaqtda hisoblash imkonini beradi.
Formula $\nu_p$ karralilikni quyidagicha beradi:
$$\nu_p(n!) = \sum_{i=1}^{\infty} \left\lfloor \frac{n}{p^i} \right\rfloor$$

Shundan quyidagi implementatsiyani olamiz:

```cpp
int multiplicity_factorial(int n, int p) {
    int count = 0;
    do {
        n /= p;
        count += n;
    } while (n);
    return count;
}
```
Bu formulani oldingi bo‘limlardagi g‘oyalar yordamida juda oson isbotlash mumkin.
$p$ ko‘paytuvchisini o‘z ichiga olmaydigan barcha elementlarni olib tashlaymiz.
Natijada $\lfloor n/p \rfloor$ ta element qoladi.
Ularning har biridan $p$ ko‘paytuvchisini olib tashlasak, $1\cdot2\cdots\lfloor n/p\rfloor=\lfloor n/p\rfloor!$ ko‘paytmasini olamiz va yana rekursiyaga kelamiz.
