---
article_id: algebra--divisors
---
# Bo‘luvchilar soni / bo‘luvchilar yig‘indisi

Ushbu maqolada berilgan $n$ sonining bo‘luvchilari soni $d(n)$ va bo‘luvchilari yig‘indisi $\sigma(n)$ ni qanday hisoblashni ko‘rib chiqamiz.

## Bo‘luvchilar soni

$d$ bo‘luvchining tub ko‘paytuvchilarga ajratilishi $n$ ning tub ko‘paytuvchilarga ajratilishining qismi bo‘lishi kerakligi ravshan. Masalan, $6 = 2 \cdot 3$ soni $60 = 2^2 \cdot 3 \cdot 5$ ning bo‘luvchisi.
Demak, $n$ ning tub ko‘paytuvchilarga ajratilishidagi barcha turli qism to‘plamlarni topish kifoya.
Odatda $x$ elementli to‘plamning qism to‘plamlari soni $2^x$ ga teng.
Biroq to‘plamda takrorlanuvchi elementlar bo‘lsa, bu endi to‘g‘ri emas. Bizning holatda ayrim tub ko‘paytuvchilar $n$ ning faktorizatsiyasida bir necha marta uchrashi mumkin.

Agar $p$ tub ko‘paytuvchi $n$ ning faktorizatsiyasida $e$ marta qatnashsa, qism to‘plamda $p$ ko‘paytuvchidan ko‘pi bilan $e$ marta foydalanishimiz mumkin.
Bu $e+1$ xil tanlov borligini anglatadi.
Shuning uchun, agar $n$ ning tub ko‘paytuvchilarga ajratilishi $p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$ ko‘rinishida bo‘lsa va $p_i$ lar turli tub sonlar bo‘lsa, bo‘luvchilar soni:

$$d(n) = (e_1 + 1) \cdot (e_2 + 1) \cdots (e_k + 1)$$

Buni quyidagicha tushunish mumkin:

* Agar faqat bitta turli tub bo‘luvchi bo‘lsa, $n = p_1^{e_1}$, unda ravshanki $e_1 + 1$ ta bo‘luvchi bor: $1, p_1, p_1^2, \dots, p_1^{e_1}$.
* Agar ikkita turli tub bo‘luvchi bo‘lsa, $n = p_1^{e_1} \cdot p_2^{e_2}$, barcha bo‘luvchilarni jadval ko‘rinishida joylashtirish mumkin.

$$\begin{array}{c|ccccc}
& 1 & p_2 & p_2^2 & \dots & p_2^{e_2} \\\hline
1 & 1 & p_2 & p_2^2 & \dots & p_2^{e_2} \\
p_1 & p_1 & p_1 \cdot p_2 & p_1 \cdot p_2^2 & \dots & p_1 \cdot p_2^{e_2} \\
p_1^2 & p_1^2 & p_1^2 \cdot p_2 & p_1^2 \cdot p_2^2 & \dots & p_1^2 \cdot p_2^{e_2} \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
p_1^{e_1} & p_1^{e_1} & p_1^{e_1} \cdot p_2 & p_1^{e_1} \cdot p_2^2 & \dots & p_1^{e_1} \cdot p_2^{e_2} \\
\end{array}$$

Demak, bo‘luvchilar soni bevosita $(e_1 + 1) \cdot (e_2 + 1)$ ga teng.

* Ikkitadan ortiq turli tub ko‘paytuvchi bo‘lgan holat uchun ham xuddi shunday mulohaza yuritish mumkin.

```cpp
long long numberOfDivisors(long long num) {
    long long total = 1;
    for (int i = 2; (long long)i * i <= num; i++) {
        if (num % i == 0) {
            int e = 0;
            do {
                e++;
                num /= i;
            } while (num % i == 0);
            total *= e + 1;
        }
    }
    if (num > 1) {
        total *= 2;
    }
    return total;
}
```

## Bo‘luvchilar yig‘indisi

Oldingi bo‘limdagi mulohazaning o‘zidan foydalanish mumkin.

* Agar faqat bitta turli tub bo‘luvchi bo‘lsa, $n = p_1^{e_1}$, yig‘indi:

$$1 + p_1 + p_1^2 + \dots + p_1^{e_1} = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1}$$

* Agar ikkita turli tub bo‘luvchi bo‘lsa, $n = p_1^{e_1} \cdot p_2^{e_2}$, avvalgidek jadval tuzish mumkin.
  Faqat endi elementlar sonini sanash o‘rniga ularning yig‘indisini hisoblamoqchimiz.
  Barcha kombinatsiyalar yig‘indisini quyidagicha ifodalash mumkinligini oson ko‘rish mumkin:

$$\left(1 + p_1 + p_1^2 + \dots + p_1^{e_1}\right) \cdot \left(1 + p_2 + p_2^2 + \dots + p_2^{e_2}\right)$$

$$ = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1}$$

* Umumiy holda, $n = p_1^{e_1} \cdot p_2^{e_2} \cdots p_k^{e_k}$ uchun quyidagi formula kelib chiqadi:

$$\sigma(n) = \frac{p_1^{e_1 + 1} - 1}{p_1 - 1} \cdot \frac{p_2^{e_2 + 1} - 1}{p_2 - 1} \cdots \frac{p_k^{e_k + 1} - 1}{p_k - 1}$$

```cpp
long long SumOfDivisors(long long num) {
    long long total = 1;

    for (int i = 2; (long long)i * i <= num; i++) {
        if (num % i == 0) {
            int e = 0;
            do {
                e++;
                num /= i;
            } while (num % i == 0);
            long long sum = 0, pow = 1;
            do {
                sum += pow;
                pow *= i;
            } while (e-- > 0);
            total *= sum;
        }
    }
    if (num > 1) {
        total *= (1 + num);
    }
    return total;
}
```

## Multiplikativ funksiyalar

Multiplikativ funksiya — o‘zaro tub $a$ va $b$ uchun

$$f(a \cdot b) = f(a) \cdot f(b)$$

tenglikni qanoatlantiradigan $f(x)$ funksiyadir.

$d(n)$ ham, $\sigma(n)$ ham multiplikativ funksiyalardir.

Multiplikativ funksiyalar sonlar nazariyasidagi masalalarda juda foydali bo‘lishi mumkin bo‘lgan ko‘plab qiziqarli xossalarga ega.
Masalan, ikkita multiplikativ funksiyaning Dirichlet konvolyutsiyasi ham multiplikativ bo‘ladi.

## Mashq masalalari

- [SPOJ — COMDIV](https://www.spoj.com/problems/COMDIV/)
- [SPOJ — DIVSUM](https://www.spoj.com/problems/DIVSUM/)
- [SPOJ — DIVSUM2](https://www.spoj.com/problems/DIVSUM2/)
