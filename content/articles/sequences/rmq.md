---
article_id: sequences--rmq
---
# RMQ — oraliqdagi eng kichik element

$A[1\ldots N]$ massiv berilgan. Har bir $(L,R)$ so‘rov uchun $L$ dan $R$ gacha, ikkala chegara ham kiradigan oraliqdagi eng kichik elementni topish kerak:

$$\operatorname{RMQ}(L,R)=\min_{L\le i\le R}A_i.$$

RMQ (Range Minimum Query) masalasi bevosita uchrashi yoki boshqa algoritmning ichki qismi bo‘lishi mumkin. Masalan, daraxtdagi [eng yaqin umumiy ajdod](../graph/lca.md) masalasini Eyler yurishi orqali RMQ ga keltirish mumkin.

## Qaysi yechimni tanlash kerak?

Eng yaxshi tuzilma massiv o‘zgaradimi, barcha so‘rovlar oldindan ma’lummi va xotira cheklovi qandayligiga bog‘liq. Oddiy $O(N)$ ko‘rish kichik kirish yoki juda kam so‘rov uchun yetarli; ko‘p so‘rovda esa oldindan ishlov berish o‘zini oqlaydi.

Quyidagi jadval asosiy variantlarni solishtiradi:

| Usul | Qurish | So‘rov | Yangilash | Shart |
|---|---:|---:|---:|---|
| Oddiy ko‘rish | $O(1)$ | $O(N)$ | $O(1)$ | So‘rovlar kam |
| Kvadrat ildizli dekompozitsiya | $O(N)$ | $O(\sqrt N)$ | $O(1)$ yoki $O(\sqrt N)$ | Sodda dinamik yechim |
| Segment daraxti | $O(N)$ | $O(\log N)$ | $O(\log N)$ | Umumiy dinamik RMQ |
| Siyrak jadval | $O(N\log N)$ | $O(1)$ | Qo‘llanmaydi | Statik massiv |
| Sqrt tree | $O(N\log\log N)$ | $O(1)$ | Odatda yo‘q | Murakkab, tez statik yechim |
| Arpa usuli + DSU | $O(N+Q)$ | Amortizatsion $O(1)$ | Yo‘q | Barcha so‘rovlar oflayn |
| Dekart daraxti + LCA | $O(N)$ | $O(1)$ | Yo‘q | Optimal statik murakkablik |

## Yangilanishli massiv

So‘rovlar orasida $A_i$ qiymatlari o‘zgarsa, oldindan hisoblangan statik minimumlar eskiradi. Bunday vaziyatda quyidagi tuzilmalar ishlatiladi.

### Kvadrat ildizli dekompozitsiya

[Kvadrat ildizli dekompozitsiya](../data_structures/sqrt_decomposition.md) massivni taxminan $\sqrt N$ o‘lchamli bloklarga ajratadi va har blok minimumini saqlaydi. So‘rov ikki chekkadagi to‘liq bo‘lmagan qismlarni elementma-element, o‘rtadagi to‘liq bloklarni esa tayyor minimumlar orqali ko‘radi.

- qurish: $O(N)$;
- so‘rov: $O(\sqrt N)$;
- bitta qiymatni yangilash: tegishli blokni qayta sanash bilan $O(\sqrt N)$, qo‘shimcha tuzilma bilan ayrim holatda tezroq.

Afzalligi — kodning soddaligi; kamchiligi — katta $N,Q$ da logarifmik tuzilmalardan sekinligi.

### Segment daraxti

[Segment daraxti](../data_structures/segment_tree.md) har tugunda unga tegishli kesma minimumini saqlaydi. So‘rov $[L,R]$ ni $O(\log N)$ ta daraxt tuguniga ajratadi, bitta element yangilanganda esa ildizgacha bo‘lgan yo‘l qayta hisoblanadi.

- qurish: $O(N)$;
- so‘rov: $O(\log N)$;
- yangilash: $O(\log N)$.

Bu dinamik RMQ uchun eng universal tanlov. Kod kvadrat ildizli dekompozitsiyadan uzunroq, lekin murakkablik kafolati yaxshiroq va oraliq yangilashlarga kengaytirish mumkin.

### Fenwick daraxti haqida

[Fenwick daraxti](../data_structures/fenwick.md) prefiks agregatlari uchun juda ixcham va $O(\log N)$ ishlaydi. Biroq minimumda yig‘indidagidek teskari amal yo‘q: ikki prefiks minimumidan $[L,R]$ minimumini chiqarib bo‘lmaydi. Shu sabab oddiy Fenwick daraxti faqat $L=1$ ko‘rinishidagi prefiks minimumlari yoki yangilanishlar monoton bo‘lgan maxsus holatlarga mos; umumiy RMQ uchun segment daraxti kerak.

## Statik massiv

Massiv qurilgandan keyin o‘zgarmasa, ko‘proq oldindan hisoblab, so‘rovni tezlashtirish mumkin.

### Siyrak jadval

[Siyrak jadval](../data_structures/sparse-table.md) uzunligi $2^k$ bo‘lgan barcha oraliqlar minimumini saqlaydi. Minimum idempotent bo‘lgani uchun $[L,R]$ ni bir-birini qoplashi mumkin bo‘lgan ikkita $2^k$ oraliq bilan yopish mumkin:

$$k=\lfloor\log_2(R-L+1)\rfloor,$$

$$\operatorname{RMQ}(L,R)=\min(st[k][L],st[k][R-2^k+1]).$$

Qurish $O(N\log N)$ vaqt va xotira, har so‘rov $O(1)$ oladi. Statik RMQ uchun soddalik va tezlik muvozanati ko‘pincha eng yaxshi shu usulda.

### Sqrt tree

[Sqrt tree](../data_structures/sqrt-tree.md) $O(N\log\log N)$ oldindan ishlov va $O(1)$ so‘rov beradi. Nazariy jihatdan siyrak jadvaldan qurilishi tezroq, ammo implementatsiyasi ancha murakkab. Odatda cheklovlar siyrak jadvalni sig‘dirmaganda yoki tuzilma boshqa assotsiativ amallar uchun ham kerak bo‘lganda tanlanadi.

### Oflayn DSU — Arpa usuli

Barcha so‘rovlar oldindan ma’lum bo‘lsa, [DSU va Arpa usuli](../data_structures/disjoint_set_union.md#arpa) so‘rovlarni o‘ng chegarasi bo‘yicha qayta ishlaydi. Monoton stek keyingi kichik element bog‘lanishlarini yaratadi, DSU esa joriy minimum vakilini tez topadi.

Oldindan ishlov va barcha so‘rovlar jami $O((N+Q)\alpha(N))$, amalda deyarli chiziqli. Afzalligi — tez va ixchamligi; cheklovi — so‘rovlarga kelish tartibida onlayn javob bera olmasligi.

### Dekart daraxti va LCA

Massivdan minimum-uyum xossali [Dekart daraxti](../graph/rmq_linear.md) qurilsa, $[L,R]$ minimumi $L$ va $R$ tugunlarning eng yaqin umumiy ajdodiga mos keladi. [Farach–Colton–Bender](../graph/lca_farachcoltonbender.md) algoritmi bilan birga qurish $O(N)$, so‘rov $O(1)$ bo‘ladi. Bu optimal asimptotika beradi, lekin kod hajmi katta va oddiy siyrak jadvalga qaraganda xatoga moyilroq.

## Amaliy tanlov

- Massiv o‘zgaradi: odatda segment daraxti.
- Massiv statik, xotira yetarli: siyrak jadval.
- Kod soddaligi ustun va cheklov o‘rtacha: kvadrat ildizli dekompozitsiya.
- Barcha so‘rovlar oldindan ma’lum: Arpa usulini ko‘rib chiqing.
- Chiziqli qurish va $O(1)$ so‘rov qat’iy talab qilinsa: Dekart daraxti + LCA.

Indekslar bazasi (`0` yoki `1`) va $[L,R]$ ning yopiq oraliq ekanini implementatsiya boshida aniq belgilash ko‘plab chegaraviy xatolarni oldini oladi. Bo‘sh oraliq uchun neytral qiymat sifatida $+\infty$ ishlatiladi.

## Mashq masalalari

- [SPOJ — Range Minimum Query](http://www.spoj.com/problems/RMQSQ/)
- [CodeChef — Chef and Array](https://www.codechef.com/problems/FRMQ)
- [Codeforces 1454F — Array Partition](https://codeforces.com/contest/1454/problem/F)
