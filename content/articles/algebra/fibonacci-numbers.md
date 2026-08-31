---
article_id: algebra--fibonacci-numbers
---
# Fibonacci sonlari

Fibonacci ketma-ketligi quyidagicha aniqlanadi:

$$F_0 = 0, F_1 = 1, F_n = F_{n-1} + F_{n-2}$$

Ketma-ketlikning dastlabki elementlari ([OEIS A000045](http://oeis.org/A000045)) quyidagilar:

$$0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...$$

## Xossalari

Fibonacci sonlari ko‘plab qiziqarli xossalarga ega. Ulardan ba’zilari:

* Kassini ayniyati:

$$F_{n-1} F_{n+1} - F_n^2 = (-1)^n$$

> Buni induksiya yordamida isbotlash mumkin. Knuthning bir satrlik isboti quyida keltirilgan $2\times 2$ matritsaviy ko‘rinishning determinantini olishdan kelib chiqadi.

* “Qo‘shish” qoidasi:

$$F_{n+k} = F_k F_{n+1} + F_{k-1} F_n$$

* Oldingi ayniyatni $k = n$ holiga qo‘llasak, quyidagini olamiz:

$$F_{2n} = F_n (F_{n+1} + F_{n-1})$$

* Bundan induksiya yordamida istalgan musbat butun $k$ uchun $F_{nk}$ soni $F_n$ ga karrali ekanini isbotlash mumkin.

* Teskarisi ham to‘g‘ri: agar $F_m$ soni $F_n$ ga karrali bo‘lsa, u holda $m$ soni $n$ ga karrali.

* EKUB ayniyati:

$$GCD(F_m, F_n) = F_{GCD(m, n)}$$

* Fibonacci sonlari Evklid algoritmi uchun mumkin bo‘lgan eng yomon kirishlardir ([Evklid algoritmi](euclid-algorithm.md) maqolasidagi Lamé teoremasiga qarang).

## Fibonacci kodlash

Ketma-ketlikdan musbat butun sonlarni ikkilik kod so‘zlari bilan kodlash uchun foydalanish mumkin. Zeckendorf teoremasiga ko‘ra, istalgan natural $n$ soni Fibonacci sonlari yig‘indisi ko‘rinishida yagona tarzda ifodalanadi:

$$N = F_{k_1} + F_{k_2} + \ldots + F_{k_r}$$

bunda $k_1 \ge k_2 + 2,\ k_2 \ge k_3 + 2,\  \ldots,\  k_r \ge 2$ (ya’ni ifodada ketma-ket keladigan ikkita Fibonacci sonidan foydalanib bo‘lmaydi).
Bundan istalgan son Fibonacci kodlashida yagona tarzda kodlanishi kelib chiqadi.
Bu ifodani $d_0 d_1 d_2 \dots d_s 1$ ikkilik kodi bilan tasvirlash mumkin; bunda, agar ifodada $F_{i+2}$ ishlatilgan bo‘lsa, $d_i$ qiymati $1$ bo‘ladi.
Kod so‘zining tugaganini ko‘rsatish uchun uning oxiriga $1$ qo‘shiladi.
E’tibor bering, ketma-ket keluvchi ikkita 1-bit faqat shu joyda uchraydi.

$$\begin{aligned}
1 &=& 1 &=& F_2 &=& (11)_F \\
2 &=& 2 &=& F_3 &=& (011)_F \\
6 &=& 5 + 1 &=& F_5 + F_2 &=& (10011)_F \\
8 &=& 8 &=& F_6 &=& (000011)_F \\
9 &=& 8 + 1 &=& F_6 + F_2 &=& (100011)_F \\
19 &=& 13 + 5 + 1 &=& F_7 + F_5 + F_2 &=& (1001011)_F
\end{aligned}$$

$n$ butun sonini oddiy ochko‘z algoritm yordamida kodlash mumkin:

1. $n$ dan kichik yoki unga teng Fibonacci sonini topguningizcha, Fibonacci sonlarini eng kattasidan eng kichigiga qarab ko‘rib chiqing.
2. Bu son $F_i$ bo‘lsin. $n$ dan $F_i$ ni ayiring va kod so‘zining $i-2$-o‘rniga $1$ qo‘ying (o‘rinlar chapdagi eng birinchi bitdan o‘ngdagi eng oxirgi bitga qarab 0 dan raqamlanadi).

3. Qoldiq qolmaguncha takrorlang.

4. Kod so‘zining tugaganini ko‘rsatish uchun oxiriga $1$ qo‘shing.

Kod so‘zini dekodlash uchun avval oxirgi $1$ ni olib tashlang. So‘ng, agar $i$-bit o‘rnatilgan bo‘lsa (o‘rinlar chapdagi eng birinchi bitdan o‘ngdagi eng oxirgi bitga qarab 0 dan raqamlanadi), songa $F_{i+2}$ ni qo‘shing.

## $n$-Fibonacci sonini topish formulalari { data-toc-label="<script type='math/tex'>n</script>-Fibonacci sonini topish formulalari" }

### Yopiq ko‘rinishdagi ifoda

“Binet formulasi” deb ataladigan formula mavjud, garchi u Binetdan avval Moivrga ham ma’lum bo‘lgan bo‘lsa-da:

$$F_n = \frac{\left(\frac{1 + \sqrt{5}}{2}\right)^n - \left(\frac{1 - \sqrt{5}}{2}\right)^n}{\sqrt{5}}$$

Bu formulani induksiya yordamida oson isbotlash mumkin, biroq uni hosil qiluvchi funksiyalar tushunchasi yordamida yoki funksional tenglamani yechish orqali ham keltirib chiqarish mumkin.
Ikkinchi hadning moduli doimo $1$ dan kichik va juda tez (eksponensial ravishda) kamayishini darhol payqash mumkin. Demak, birinchi hadning o‘zi $F_n$ ga “deyarli” teng. Buni qat’iy ravishda quyidagicha yozish mumkin:

$$F_n = \left[\frac{\left(\frac{1 + \sqrt{5}}{2}\right)^n}{\sqrt{5}}\right]$$

bu yerda kvadrat qavslar eng yaqin butun songa yaxlitlashni bildiradi.
Kasr sonlar bilan ishlaganda bu ikki formula juda yuqori aniqlikni talab qilgani sababli, amaliy hisoblashlarda ularning foydasi kam.

### Fibonacci sonini chiziqli vaqtda hisoblash

$n$-Fibonacci sonini $n$ gacha bo‘lgan sonlarni birma-bir hisoblab, $O(n)$ vaqtda oson topish mumkin. Biroq, quyida ko‘rganimizdek, bundan tezroq usullar ham mavjud.

Iterativ yondashuvdan boshlashimiz mumkin. $F_n = F_{n-1} + F_{n-2}$ formulasidan foydalanish uchun bu qiymatlarni ketma-ket hisoblaymiz. Bunda $F_0$ va $F_1$ boshlang‘ich holatlarini hisobga olamiz.

```{.cpp file=fibonacci_linear}
int fib(int n) {
    int a = 0;
    int b = 1;
    for (int i = 0; i < n; i++) {
        int tmp = a + b;
        a = b;
        b = tmp;
    }
    return a;
}
```

Shu tarzda $O(n)$ vaqt ishlaydigan chiziqli yechimga ega bo‘lamiz; bunda ketma-ketlikdagi $n$ dan oldingi qiymatlar hisoblanadi.

### Matritsaviy ko‘rinish

$(F_n, F_{n-1})$ juftligidan $(F_{n+1}, F_n)$ juftligiga o‘tishni chiziqli rekurrentlikning $2\times 2$ matritsaga ko‘paytmasi ko‘rinishida ifodalash mumkin:

$$
\begin{pmatrix}
1 & 1 \\
1 & 0
\end{pmatrix}
\begin{pmatrix}
F_n \\
F_{n-1}
\end{pmatrix}
=
\begin{pmatrix}
F_n + F_{n-1}  \\
F_{n}
\end{pmatrix}
=
\begin{pmatrix}
F_{n+1}  \\
F_{n}
\end{pmatrix}
$$

Bu rekurrentlikni takrorlashga matritsalarni qayta-qayta ko‘paytirish sifatida qarash imkonini beradi; matritsalar esa qulay xossalarga ega. Xususan,

$$
\begin{pmatrix}
1 & 1 \\
1 & 0
\end{pmatrix}^n
\begin{pmatrix}
F_1 \\
F_0
\end{pmatrix}
=
\begin{pmatrix}
F_{n+1}  \\
F_{n}
\end{pmatrix}
$$

bu yerda $F_1 = 1, F_0 = 0$.
Aslida,

$$
\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}
= \begin{pmatrix} F_2 & F_1 \\ F_1 & F_0 \end{pmatrix}
$$

bo‘lgani uchun matritsaning o‘zidan bevosita foydalanish mumkin:

$$
\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n
= \begin{pmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{pmatrix}
$$

Shunday qilib, $F_n$ ni $O(\log n)$ vaqtda topish uchun matritsani $n$-darajaga ko‘tarish kerak. ([Ikkilik darajaga oshirish](binary-exp.md) maqolasiga qarang.)

```{.cpp file=fibonacci_matrix}
struct matrix {
    long long mat[2][2];
    matrix friend operator *(const matrix &a, const matrix &b){
        matrix c;
        for (int i = 0; i < 2; i++) {
          for (int j = 0; j < 2; j++) {
              c.mat[i][j] = 0;
              for (int k = 0; k < 2; k++) {
                  c.mat[i][j] += a.mat[i][k] * b.mat[k][j];
              }
          }
        }
        return c;
    }
};
matrix matpow(matrix base, long long n) {
    matrix ans{ {
      {1, 0},
      {0, 1}
    } };
    while (n) {
        if(n&1)
            ans = ans*base;
        base = base*base;
        n >>= 1;
    }
    return ans;
}

long long fib(int n) {
    matrix base{ {
      {1, 1},
      {1, 0}
    } };
    return matpow(base, n).mat[0][1];
}
```

### Tez ikkilantirish usuli

Yuqoridagi matritsaviy ifodani $n = 2\cdot k$ uchun yoyib,

$$
\begin{pmatrix}
F_{2k+1} & F_{2k}\\
F_{2k} & F_{2k-1}
\end{pmatrix}
=
\begin{pmatrix}
1 & 1\\
1 & 0
\end{pmatrix}^{2k}
=
\begin{pmatrix}
F_{k+1} & F_{k}\\
F_{k} & F_{k-1}
\end{pmatrix}
^2
$$

quyidagi soddaroq tenglamalarni olish mumkin:

$$ \begin{align}
F_{2k+1} &= F_{k+1}^2 + F_{k}^2 \\
F_{2k} &= F_k(F_{k+1}+F_{k-1}) = F_k (2F_{k+1} - F_{k})\\
\end{align}.$$

Demak, yuqoridagi ikki tenglamadan foydalanib, Fibonacci sonlarini quyidagi kod yordamida oson hisoblash mumkin:

```{.cpp file=fibonacci_doubling}
pair<int, int> fib (int n) {
    if (n == 0)
        return {0, 1};

    auto p = fib(n >> 1);
    int c = p.first * (2 * p.second - p.first);
    int d = p.first * p.first + p.second * p.second;
    if (n & 1)
        return {d, c + d};
    else
        return {c, d};
}
```

Yuqoridagi kod juftlik sifatida $F_n$ va $F_{n+1}$ ni qaytaradi.

## $p$ modul bo‘yicha davriylik

Fibonacci ketma-ketligini $p$ modul bo‘yicha qaraylik. Ketma-ketlik davriy ekanini isbotlaymiz.

Buni teskarisini faraz qilish orqali isbotlaymiz. $p$ modul bo‘yicha olingan Fibonacci sonlarining dastlabki $p^2 + 1$ ta juftligini qaraylik:

$$(F_0,\ F_1),\ (F_1,\ F_2),\ \ldots,\ (F_{p^2},\ F_{p^2 + 1})$$

$p$ modul bo‘yicha faqat $p$ xil qoldiq va ko‘pi bilan $p^2$ xil qoldiqlar juftligi bo‘lishi mumkin, shuning uchun ular orasida kamida ikkita bir xil juftlik mavjud. Bu ketma-ketlik davriy ekanini isbotlash uchun yetarli, chunki har bir Fibonacci soni faqat o‘zidan oldingi ikkita son orqali aniqlanadi. Demak, agar ketma-ket ikki sondan iborat ikkita juftlik takrorlansa, bu juftliklardan keyingi sonlar ham aynan bir xil tarzda takrorlanadi.

Endi ketma-ketlikda indekslari eng kichik bo‘lgan ikkita bir xil qoldiq juftligini tanlaymiz. Ular $(F_a,\ F_{a + 1})$ va $(F_b,\ F_{b + 1})$ bo‘lsin. $a = 0$ ekanini isbotlaymiz. Agar bu noto‘g‘ri bo‘lganida, undan oldingi $(F_{a-1},\ F_a)$ va $(F_{b-1},\ F_b)$ juftliklari mavjud bo‘lar edi va Fibonacci sonlarining xossasiga ko‘ra ular ham teng bo‘lar edi.

Biroq bu indekslari eng kichik bo‘lgan juftliklarni tanlaganimizga zid. Shu bilan predavriylik yo‘qligi (ya’ni sonlar $F_0$ dan boshlab davriy ekani) isbotlanadi.

## Mashq masalalari

* [SPOJ — Evklid algoritmiga qaytish](http://www.spoj.com/problems/MAIN74/)
* [SPOJ — Fibonacci yig‘indisi](http://www.spoj.com/problems/FIBOSUM/)
* [HackerRank — Fibonacci sonimi?](https://www.hackerrank.com/challenges/is-fibo/problem)
* [Project Euler — Juft Fibonacci sonlari](https://www.hackerrank.com/contests/projecteuler/challenges/euler002/problem)
* [DMOJ — Fibonacci ketma-ketligi](https://dmoj.ca/problem/fibonacci)
* [DMOJ — Fibonacci ketma-ketligi (qiyinroq)](https://dmoj.ca/problem/fibonacci2)
* [DMOJ UCLV — Raqamlangan qalamlar ketma-ketligi](https://dmoj.uclv.edu.cu/problem/secnum)
* [DMOJ UCLV — Ikki o‘lchamli Fibonacci](https://dmoj.uclv.edu.cu/problem/fibonacci)
* [DMOJ UCLV — Fibonacci hisoblash](https://dmoj.uclv.edu.cu/problem/fibonaccicalculatio)
* [LightOJ — Sonlar ketma-ketligi](https://lightoj.com/problem/number-sequence)
* [Codeforces — C. Fibonacci](https://codeforces.com/problemset/gymProblem/102644/C)
* [Codeforces — A. Hexadecimal teoremasi](https://codeforces.com/problemset/problem/199/A)
* [Codeforces — B. Doskadagi Fibonacci](https://codeforces.com/problemset/problem/217/B)
* [Codeforces — E. Fibonacci soni](https://codeforces.com/problemset/problem/193/E)
