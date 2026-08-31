---
article_id: dynamic_programming--knuth-optimization
---
# Knuth optimallashtirishi

Knuth–Yao tezlashtirishi deb ham ataladigan Knuth optimallashtirishi oraliqlar bo‘yicha dinamik dasturlashning maxsus holati bo‘lib, yechim vaqt murakkabligini chiziqli koeffitsiyentga yaxshilaydi: standart oraliq DPdagi $O(n^3)$ dan $O(n^2)$ gacha.

## Shartlar

Tezlashtirish quyidagi ko‘rinishdagi o‘tishlarga qo‘llanadi:

$$dp(i, j) = \min_{i \leq k < j} [ dp(i, k) + dp(k+1, j) + C(i, j) ].$$

[Divide and Conquer DP](./divide-and-conquer-dp.md) dagidek, o‘tish ifodasini minimum qiladigan $k$ larning eng katta qiymatini $opt(i, j)$ deb belgilaymiz. Maqolaning davomida $opt$ «optimal bo‘linish nuqtasi» deb ataladi. Optimallashtirish uchun quyidagi tengsizlik bajarilishi kerak:

$$opt(i, j-1) \leq opt(i, j) \leq opt(i+1, j).$$

$C$ xarajat funksiyasi barcha $a \leq b \leq c \leq d$ uchun quyidagi shartlarni qanoatlantirsa, bu tengsizlik rost ekanini ko‘rsatish mumkin:

1. $C(b, c) \leq C(a, d)$;

2. $C(a, c) + C(b, d) \leq C(a, d) + C(b, c)$ — to‘rtburchak tengsizligi (quadrangle inequality, QI).

Bu natija quyida isbotlanadi.

## Algoritm

DP holatlarini shunday tartibda qayta ishlaymizki, $dp(i, j)$ dan oldin $dp(i, j-1)$ va $dp(i+1, j)$, ular bilan birga esa $opt(i, j-1)$ va $opt(i+1, j)$ hisoblangan bo‘lsin. Shunda $opt(i, j)$ ni hisoblashda $k$ ning $i$ dan $j-1$ gacha bo‘lgan barcha qiymatlarini emas, faqat $opt(i, j-1)$ dan $opt(i+1, j)$ gacha bo‘lganlarini tekshirish kifoya. $(i,j)$ juftliklarini shu tartibda ko‘rish uchun ichma-ich sikllarda $i$ ni maksimal qiymatdan minimal qiymatgacha, $j$ ni esa $i+1$ dan maksimal qiymatgacha yuritish yetarli.

### Umumiy implementatsiya

Implementatsiya masalaga qarab o‘zgarsa-da, quyida ancha umumiy misol keltirilgan. Kod tuzilishi oraliq DP kodiga deyarli aynan o‘xshaydi.

```{.cpp file=knuth_optimization}

int solve() {
    int N;
    ... // read N and input
    int dp[N][N], opt[N][N];

    auto C = [&](int i, int j) {
        ... // Implement cost function C.
    };

    for (int i = 0; i < N; i++) {
        opt[i][i] = i;
        ... // Initialize dp[i][i] according to the problem
    }

    for (int i = N-2; i >= 0; i--) {
        for (int j = i+1; j < N; j++) {
            int mn = INT_MAX;
            int cost = C(i, j);
            for (int k = opt[i][j-1]; k <= min(j-1, opt[i+1][j]); k++) {
                if (mn >= dp[i][k] + dp[k+1][j] + cost) {
                    opt[i][j] = k; 
                    mn = dp[i][k] + dp[k+1][j] + cost; 
                }
            }
            dp[i][j] = mn; 
        }
    }

    return dp[0][N-1];
}
```

### Murakkablik

Algoritm murakkabligini quyidagi yig‘indi orqali baholash mumkin:

$$
\sum\limits_{i=1}^N \sum\limits_{j=i+1}^N [opt(i+1,j)-opt(i,j-1)] =
\sum\limits_{i=1}^N \sum\limits_{j=i}^{N-1} [opt(i+1,j+1)-opt(i,j)].
$$

Ko‘rinib turibdiki, bu ifodadagi hadlarning aksariyati o‘zaro qisqaradi; faqat $j=N-1$ bo‘lgan musbat hadlar va $i=1$ bo‘lgan manfiy hadlar qoladi. Shuning uchun butun yig‘indini

$$
\sum\limits_{k=1}^N[opt(k,N)-opt(1,k)] = O(n^2),
$$

sifatida baholash mumkin. Oddiy oraliq DP ishlatilganda esa baho $O(n^3)$ bo‘lardi.

### Amaliyotda

Knuth optimallashtirishining eng ko‘p uchraydigan qo‘llanishi yuqoridagi o‘tishga ega oraliq DPdir. Asosiy qiyinchilik — xarajat funksiyasi berilgan shartlarni qanoatlantirishini isbotlash. Eng sodda holatda $C(i,j)$ xarajat funksiyasi biror $S$ massivning $S[i], S[i+1], \ldots, S[j]$ elementlari yig‘indisidan iborat bo‘ladi; aniq massiv masalaga bog‘liq. Ba’zan xarajat funksiyasi murakkabroq ham bo‘lishi mumkin.

Shuni yodda tutingki, DP o‘tishi va xarajat funksiyasiga qo‘yilgan shartlardan ham muhimroq narsa — optimal bo‘linish nuqtasi haqidagi tengsizlikdir. Ayrim masalalarda, masalan optimal ikkilik qidiruv daraxti masalasida — bu optimallashtirish dastlab aynan shu masala uchun yaratilgan — o‘tish va xarajat funksiyalari kamroq ravshan bo‘lishi mumkin. Shunga qaramay, $opt(i, j-1) \leq opt(i, j) \leq opt(i+1, j)$ ekanini isbotlashning o‘zi optimallashtirishdan foydalanish uchun yetarli.

### To‘g‘rilik isboti

Algoritmning $C(i,j)$ ga qo‘yilgan shartlar nuqtayi nazaridan to‘g‘riligini isbotlash uchun berilgan shartlar bajarilganda

$$
opt(i, j-1) \leq opt(i, j) \leq opt(i+1, j)
$$

bo‘lishini ko‘rsatish kifoya.

!!! lemma "Lemma"
    Masala shartlari bajarilsa, $dp(i,j)$ ham to‘rtburchak tengsizligini qanoatlantiradi.

??? hint "Isbot"
    Bu lemma kuchli induksiya yordamida isbotlanadi. Isbot Knuth–Yao tezlashtirishini taqdim etgan F. Frances Yao muallifligidagi <a href="https://dl.acm.org/doi/pdf/10.1145/800141.804691">Efficient Dynamic Programming Using Quadrangle Inequalities</a> maqolasidan olingan; aynan ushbu tasdiq maqoladagi 2.1-lemmadir. G‘oya $l = d-a$ uzunlik bo‘yicha induksiya qilishdan iborat. $l=1$ holat ravshan. $l>1$ uchun ikkita holatni ko‘ramiz:

    1. $b=c$

       Tengsizlik $dp(a,b)+dp(b,d)\leq dp(a,d)$ ko‘rinishiga keladi. Bu yerda barcha $i$ uchun $dp(i,i)=0$ deb olinadi; ushbu optimallashtirish ishlatiladigan barcha masalalarda shunday bo‘ladi. $opt(a,d)=z$ bo‘lsin.

       - Agar $z<j$ bo‘lsa,

         quyidagiga e’tibor bering:

         $$
            dp(a, b) \leq dp_{z}(a, b) = dp(a, z) + dp(z+1, b) + C(a, b).
            $$

         Shuning uchun

         $$
            dp(a, b) + dp(b, d) \leq dp(a, z) + dp(z+1, b) + dp(b, d) + C(a, b)
            $$

         Induksiya faraziga ko‘ra, $dp(z+1,b)+dp(b,d)\leq dp(z+1,d)$. Bundan tashqari, shart bo‘yicha $C(a,b)\leq C(a,d)$. Bu ikki faktni yuqoridagi tengsizlik bilan birlashtirsak, kerakli natijani olamiz.

       - Agar $z\geq j$ bo‘lsa, bu holatning isboti avvalgi holatga simmetrik.

    2. $b<c$

       $opt(b,c)=z$ va $opt(a,d)=y$ bo‘lsin.

       - Agar $z\leq y$ bo‘lsa,

         $$
            dp(a, c) + dp(b, d) \leq dp_{z}(a, c) + dp_{y}(b, d)
            $$

         bu yerda

         $$
            dp_{z}(a, c) + dp_{y}(b, d) = C(a, c) + C(b, d) + dp(a, z) + dp(z+1, c) + dp(b, y) + dp(y+1, d).
            $$

         $C$ uchun QI va $z+1\leq y+1\leq c\leq d$ indekslarida DP holati uchun induksiya farazidan kelib chiqadigan QIni qo‘llasak, kerakli natija hosil bo‘ladi.

       - Agar $z>y$ bo‘lsa, bu holatning isboti avvalgisiga simmetrik.

    Shu bilan lemma isbotlandi.

Endi quyidagi vaziyatni ko‘rib chiqamiz. $i \leq p \leq q < j$ bo‘lgan ikkita indeks bor. $dp_{k} = C(i, j) + dp(i, k) + dp(k+1, j)$ deb belgilaymiz.

Quyidagi implikatsiyani isbotlay olamiz deb faraz qilaylik:

$$
dp_{p}(i, j-1) \geq dp_{q}(i, j-1) \implies dp_{p}(i, j) \geq dp_{q}(i, j).
$$

$q=opt(i,j-1)$ deb olamiz. Ta’rifga ko‘ra, $dp_p(i,j-1)\geq dp_q(i,j-1)$. Shuning uchun tengsizlikni barcha $i\leq p\leq q$ uchun qo‘llasak, $opt(i,j)$ kamida $opt(i,j-1)$ ga teng ekanini kelib chiqaramiz; bu kerakli tengsizlikning birinchi yarmini isbotlaydi.

Endi $p+1 \leq q+1 \leq j-1 \leq j$ indekslari uchun QIni qo‘llasak, quyidagini olamiz:

$$\begin{align}
&dp(p+1, j-1) + dp(q+1, j) ≤ dp(q+1, j-1) + dp(p+1, j) \\
\implies& (dp(i, p) + dp(p+1, j-1) + C(i, j-1)) + (dp(i, q) + dp(q+1, j) + C(i, j)) \\  
\leq& (dp(i, q) + dp(q+1, j-1) + C(i, j-1)) + (dp(i, p) + dp(p+1, j) + C(i, j)) \\  
\implies& dp_{p}(i, j-1) + dp_{q}(i, j) ≤ dp_{p}(i, j) + dp_{q}(i, j-1) \\
\implies& dp_{p}(i, j-1) - dp_{q}(i, j-1) ≤ dp_{p}(i, j) - dp_{q}(i, j) \\
\end{align}$$

Nihoyat,

$$\begin{align}
&dp_{p}(i, j-1) \geq dp_{q}(i, j-1) \\
&\implies 0 \leq dp_{p}(i, j-1) - dp_{q}(i, j-1) \leq dp_{p}(i, j) - dp_{q}(i, j) \\
&\implies dp_{p}(i, j) \geq dp_{q}(i, j)
\end{align}$$  

Shu bilan tengsizlikning birinchi qismi, ya’ni $opt(i,j-1)\leq opt(i,j)$ isbotlandi. Ikkinchi qism — $opt(i,j)\leq opt(i+1,j)$ — xuddi shu g‘oya yordamida, $dp(i,p)+dp(i+1,q)≤dp(i+1,p)+dp(i,q)$ tengsizligidan boshlanib isbotlanadi.

Shu bilan isbot yakunlandi.

## Amaliy masalalar

- [UVA - Cutting Sticks](https://onlinejudge.org/external/100/10003.pdf)
- [UVA - Prefix Codes](https://onlinejudge.org/external/120/12057.pdf)
- [SPOJ - Breaking String](https://www.spoj.com/problems/BRKSTRNG/)
- [UVA - Optimal Binary Search Tree](https://onlinejudge.org/external/103/10304.pdf)

## Manbalar

- [Geeksforgeeks maqolasi](https://www.geeksforgeeks.org/knuths-optimization-in-dynamic-programming/)
- [DP tezlashtirishlari haqidagi hujjat](https://home.cse.ust.hk/~golin/COMP572/Notes/DP_speedup.pdf)
- [Efficient Dynamic Programming Using Quadrangle Inequalities](https://dl.acm.org/doi/pdf/10.1145/800141.804691)

