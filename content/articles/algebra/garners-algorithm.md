---
article_id: algebra--garners-algorithm
---
# Garner algoritmi

[Xitoy qoldiqlar teoremasi](chinese-remainder-theorem.md)ning natijalaridan biri shuki, katta sonlarni kichik butun sonlar massivi yordamida ifodalashimiz mumkin.
Masalan, $p$ dastlabki $1000$ ta tub sonning ko‘paytmasi bo‘lsin. $p$ taxminan $3000$ xonali son.
$p$ dan kichik istalgan $a$ sonini $a_1,\ldots,a_k$ massivi bilan ifodalash mumkin, bu yerda $a_i \equiv a \pmod{p_i}$.
Ammo buning uchun, albatta, $a$ sonini uning ifodasidan qanday qayta tiklashni bilishimiz kerak.
Usullardan biri Xitoy qoldiqlar teoremasi haqidagi maqolada muhokama qilingan.

Ushbu maqolada ayni maqsadda ishlatilishi mumkin bo‘lgan muqobil usul — Garner algoritmini ko‘rib chiqamiz.
## Aralash asosli ifoda

$a$ sonini **aralash asosli** ko‘rinishda ifodalashimiz mumkin:

$$a = x_1 + x_2 p_1 + x_3 p_1 p_2 + \ldots + x_k p_1 \cdots p_{k-1} \text{ with }x_i \in [0, p_i)$$
Aralash asosli ifoda — ikkilik yoki o‘nlik sanoq tizimi kabi odatiy sanoq tizimlarining umumlashmasi bo‘lgan pozitsion sanoq tizimidir.
Masalan, o‘nlik sanoq tizimi asosi 10 bo‘lgan pozitsion sanoq tizimidir.
Har bir son $0$ dan $9$ gacha bo‘lgan $d_1d_2d_3\dots d_n$ raqamlar satri bilan ifodalanadi. Masalan, $415$ satri $4\cdot10^2+1\cdot10^1+5\cdot10^0$ sonini ifodalaydi.
Umumiy holda, asosi $b$ bo‘lgan pozitsion sanoq tizimida $d_1d_2d_3\dots d_n$ raqamlar satri $d_1b^{n-1}+d_2b^{n-2}+\cdots+d_nb^0$ sonini ifodalaydi.
Aralash asosli tizimda esa bitta asos bo‘lmaydi. Asos pozitsiyadan pozitsiyaga o‘zgaradi.
## Garner algoritmi

Garner algoritmi $x_1,\ldots,x_k$ raqamlarini hisoblaydi.
Bu raqamlar nisbatan kichikligiga e’tibor bering.
$x_i$ raqami $0$ dan $p_i-1$ gacha bo‘lgan butun sondir.

$r_{ij}$ bilan $p_i$ ning $p_j$ modul bo‘yicha teskari elementini belgilaymiz:

$$r_{ij} = (p_i)^{-1} \pmod{p_j}$$

uni [Modul bo‘yicha teskari element](module-inverse.md) maqolasidagi algoritm bilan topish mumkin.

$a$ ning aralash asosli ifodasini birinchi kongruensiyaga qo‘ysak:

$$a_1 \equiv x_1 \pmod{p_1}.$$
Ikkinchi tenglamaga qo‘ysak:

$$a_2 \equiv x_1 + x_2 p_1 \pmod{p_2},$$

$x_1$ ni ayirib, $p_1$ ga bo‘lgach, quyidagicha qayta yozish mumkin:

$$\begin{array}{rclr}
    a_2 - x_1 &\equiv& x_2 p_1 &\pmod{p_2} \\
    (a_2 - x_1) r_{12} &\equiv& x_2 &\pmod{p_2} \\
    x_2 &\equiv& (a_2 - x_1) r_{12} &\pmod{p_2}
\end{array}$$

Xuddi shu tarzda:

$$x_3 \equiv ((a_3 - x_1) r_{13} - x_2) r_{23} \pmod{p_3}.$$
Endi paydo bo‘layotgan qonuniyatni aniq ko‘rish mumkin; uni quyidagi kod bilan ifodalaymiz:

```cpp
for (int i = 0; i < k; ++i) {
    x[i] = a[i];
    for (int j = 0; j < i; ++j) {
        x[i] = r[j][i] * (x[i] - x[j]);

        x[i] = x[i] % p[i];
        if (x[i] < 0)
            x[i] += p[i];
    }
}
```

Shunday qilib, $x_i$ raqamlarini $O(k^2)$ vaqtda hisoblashni o‘rgandik. Endi $a$ sonini avvalgi formula yordamida topish mumkin:
$$a = x_1 + x_2 \cdot p_1 + x_3 \cdot p_1 \cdot p_2 + \ldots + x_k \cdot p_1 \cdots p_{k-1}$$

Amalda $a$ javobini deyarli albatta [ixtiyoriy aniqlikdagi arifmetika](big-integer.md) yordamida hisoblashga to‘g‘ri keladi. Ammo $x_i$ raqamlari kichik bo‘lgani uchun, odatda ularni o‘rnatilgan turlar yordamida hisoblash mumkin; shu sababli Garner algoritmi juda samarali.
## Garner algoritmining implementatsiyasi

Bu algoritmni Java tilida implementatsiya qilish qulay, chunki unda `BigInteger` sinfi orqali katta sonlar uchun o‘rnatilgan qo‘llab-quvvatlash mavjud.
Bu yerda katta sonlarni kongruensiyalar to‘plami ko‘rinishida saqlay oladigan implementatsiyani keltiramiz.
U qo‘shish, ayirish va ko‘paytirishni qo‘llab-quvvatlaydi.
Garner algoritmi yordamida kongruensiyalar to‘plamini yagona butun songa aylantirishimiz mumkin.
Ushbu kodda $10^9$ dan katta 100 ta tub son olinadi; bu $10^{900}$ gacha bo‘lgan sonlarni ifodalash imkonini beradi.

```java
final int SZ = 100;
int pr[] = new int[SZ];
int r[][] = new int[SZ][SZ];
void init() {
    for (int x = 1000 * 1000 * 1000, i = 0; i < SZ; ++x)
        if (BigInteger.valueOf(x).isProbablePrime(100))
            pr[i++] = x;

    for (int i = 0; i < SZ; ++i)
        for (int j = i + 1; j < SZ; ++j)
            r[i][j] =
                BigInteger.valueOf(pr[i]).modInverse(BigInteger.valueOf(pr[j])).intValue();
}

class Number {
    int a[] = new int[SZ];

    public Number() {
    }
    public Number(int n) {
        for (int i = 0; i < SZ; ++i)
            a[i] = n % pr[i];
    }

    public Number(BigInteger n) {
        for (int i = 0; i < SZ; ++i)
            a[i] = n.mod(BigInteger.valueOf(pr[i])).intValue();
    }

    public Number add(Number n) {
        Number result = new Number();
        for (int i = 0; i < SZ; ++i)
            result.a[i] = (a[i] + n.a[i]) % pr[i];
        return result;
    }
    public Number subtract(Number n) {
        Number result = new Number();
        for (int i = 0; i < SZ; ++i)
            result.a[i] = (a[i] - n.a[i] + pr[i]) % pr[i];
        return result;
    }

    public Number multiply(Number n) {
        Number result = new Number();
        for (int i = 0; i < SZ; ++i)
            result.a[i] = (int)((a[i] * 1l * n.a[i]) % pr[i]);
        return result;
    }
    public BigInteger bigIntegerValue(boolean can_be_negative) {
        BigInteger result = BigInteger.ZERO, mult = BigInteger.ONE;
        int x[] = new int[SZ];
        for (int i = 0; i < SZ; ++i) {
            x[i] = a[i];
            for (int j = 0; j < i; ++j) {
                long cur = (x[i] - x[j]) * 1l * r[j][i];
                x[i] = (int)((cur % pr[i] + pr[i]) % pr[i]);
            }
            result = result.add(mult.multiply(BigInteger.valueOf(x[i])));
            mult = mult.multiply(BigInteger.valueOf(pr[i]));
        }
        if (can_be_negative)
            if (result.compareTo(mult.shiftRight(1)) >= 0)
                result = result.subtract(mult);

        return result;
    }
}
```
