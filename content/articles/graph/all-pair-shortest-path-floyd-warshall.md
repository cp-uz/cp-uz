---
article_id: graph--all-pair-shortest-path-floyd-warshall
---
# Floyd–Warshall algoritmi

Bizga $n$ ta tugunga ega yo‘naltirilgan yoki yo‘naltirilmagan og‘irlikli $G$ grafi berilgan.

Vazifa — har bir $i$ va $j$ tugunlar jufti orasidagi eng qisqa yo‘l uzunligi $d_{ij}$ ni topish.

Grafda manfiy og‘irlikli qirralar bo‘lishi mumkin, ammo manfiy og‘irlikli sikllar bo‘lmasligi kerak.

Agar shunday manfiy sikl mavjud bo‘lsa, uni qayta-qayta aylanib o‘tish va har bir iteratsiyada yo‘l narxini kamaytirish mumkin.

Shu sababli ayrim yo‘llarning qiymatini istalgancha kichik qilish mumkin, boshqacha aytganda, ular uchun eng qisqa yo‘l aniqlanmagan bo‘ladi.

Bu avtomatik ravishda yo‘naltirilmagan grafda manfiy og‘irlikli qirra bo‘la olmasligini anglatadi, chunki bunday qirra bo‘ylab oldinga va orqaga istalgancha yurishning o‘zi manfiy sikl hosil qiladi.

Ushbu algoritmdan manfiy sikllar mavjudligini aniqlash uchun ham foydalanish mumkin.

Algoritm tugagach, biror $v$ tugundan o‘ziga masofa manfiy bo‘lsa, grafda manfiy sikl mavjud.

Bu algoritm Robert Floyd va Stephen Warshallning 1962-yilda bir vaqtda chop etilgan maqolalarida e’lon qilingan.

Biroq Bernard Roy 1959-yildayoq mohiyatan xuddi shu algoritmni chop etgan, ammo uning nashri e’tibordan chetda qolgan.

## Algoritm tavsifi

Algoritmning asosiy g‘oyasi — istalgan ikki tugun orasidagi eng qisqa yo‘lni topish jarayonini ketma-ket bir nechta fazaga bo‘lish.

Tugunlarni $1$ dan $n$ gacha raqamlaymiz.

Masofalar matritsasi $d[ ][ ]$ bo‘lsin.

$k$-fazadan oldin ($k = 1 \dots n$), istalgan $i$ va $j$ tugunlar uchun $d[i][j]$ qiymati $i$ dan $j$ gacha bo‘lgan hamda yo‘lning ichki tugunlari sifatida faqat $\{1, 2, ..., k-1\}$ tugunlardan foydalanadigan eng qisqa yo‘l uzunligini saqlaydi.

Boshqacha aytganda, $k$-fazadan oldin $d[i][j]$ qiymati $i$ tugundan $j$ tugungacha eng qisqa yo‘l uzunligiga teng bo‘ladi, bunda yo‘lga faqat raqami $k$ dan kichik tugunlar ichki tugun sifatida kirishi mumkin (yo‘lning boshi va oxiri bu cheklovga bo‘ysunmaydi).

Bu xossa birinchi faza uchun bajarilishini tekshirish oson. $k = 0$ uchun, agar $i$ va $j$ orasida og‘irligi $w_{i j}$ bo‘lgan qirra mavjud bo‘lsa, $d[i][j] = w_{i j}$; qirra mavjud bo‘lmasa, $d[i][j] = \infty$ qilib matritsani to‘ldirish mumkin.

Amalda $\infty$ o‘rniga yetarlicha katta bir son olinadi.

Keyinroq ko‘rganimizdek, bu algoritm uchun zarur talabdir.

Endi $k$-fazada ekanimizni va $d[ ][ ]$ matritsasini $(k + 1)$-faza talablariga mos keladigan qilib hisoblamoqchi ekanimizni faraz qilaylik.

Ayrim $(i, j)$ tugunlar juftlari uchun masofalarni yangilashimiz kerak.

Tubdan farq qiladigan ikki holat mavjud:

* $i$ tugundan $j$ tugungacha ichki tugunlari $\{1, 2, \dots, k\}$ to‘plamidan olingan eng qisqa yo‘l, ichki tugunlari $\{1, 2, \dots, k-1\}$ to‘plamidan olingan eng qisqa yo‘l bilan bir xil. Bu holda o‘tish vaqtida $d[i][j]$ o‘zgarmaydi.

* Ichki tugunlari $\{1, 2, \dots, k\}$ to‘plamidan bo‘lgan eng qisqa yo‘l qisqaroq. Bu yangi, qisqaroq yo‘l $k$ tugun orqali o‘tishini anglatadi. Demak, $i$ dan $j$ gacha eng qisqa yo‘lni ikkita yo‘lga ajratish mumkin: $i$ dan $k$ gacha va $k$ dan $j$ gacha. Bu ikki yo‘l ham ichki tugun sifatida faqat $\{1, 2, \dots, k-1\}$ tugunlardan foydalanishi va shu xususiyatga ega yo‘llar orasida eng qisqa bo‘lishi aniq. Shuning uchun ularning uzunliklari oldindan hisoblangan va $i$ dan $j$ gacha eng qisqa yo‘l uzunligini $d[i][k] + d[k][j]$ sifatida hisoblashimiz mumkin.

Bu ikki holatni birlashtirib, $k$-fazada barcha $(i, j)$ juftlar uchun eng qisqa yo‘l uzunligini quyidagicha qayta hisoblash mumkinligini olamiz:

$$d_{\text{new}}[i][j] = min(d[i][j], d[i][k] + d[k][j])$$

Demak, $k$-fazada bajariladigan ish — barcha tugunlar juftlarini ko‘rib chiqish va ular orasidagi eng qisqa yo‘l uzunligini qayta hisoblashdan iborat.

Natijada $n$-fazadan keyin masofalar matritsasidagi $d[i][j]$ qiymati $i$ va $j$ orasidagi eng qisqa yo‘l uzunligiga teng bo‘ladi; agar ular orasida yo‘l mavjud bo‘lmasa, qiymat $\infty$ bo‘ladi.

Yakuniy bir eslatma: $k$-fazaning eng qisqa yo‘llarini vaqtincha saqlash uchun alohida $d_{\text{new}}[ ][ ]$ masofalar matritsasini yaratish shart emas, ya’ni har bir fazada barcha o‘zgarishlarni bevosita $d[ ][ ]$ matritsasining o‘zida bajarish mumkin.

Darhaqiqat, istalgan $k$-fazada masofalar matritsasidagi yo‘llarning masofasini faqat yaxshilaymiz; shu sababli $(k+1)$-faza yoki undan keyin qayta ishlanadigan biror tugunlar jufti uchun eng qisqa yo‘l uzunligini yomonlashtira olmaymiz.

Ushbu algoritmning vaqt murakkabligi, ravshanki, $O(n^3)$.

## Implementatsiya

$d[][]$ — avval tushuntirilganidek, $0$-faza bo‘yicha to‘ldirilgan $n \times n$ o‘lchamli ikki o‘lchovli massiv bo‘lsin.

Shuningdek, $0$-fazada har bir $i$ uchun $d[i][i] = 0$ qilamiz.

U holda algoritm quyidagicha implementatsiya qilinadi:

```cpp
for (int k = 0; k < n; ++k) {
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
        }
    }
}
```

Agar istalgan $i$ va $j$ tugunlar orasida qirra bo‘lmasa, $d[i][j]$ matritsa elementi katta sonni (grafdagi istalgan yo‘l uzunligidan kattaroq bo‘ladigan darajada katta sonni) saqlaydi deb faraz qilinadi.

U holda bu mavjud bo‘lmagan qirradan foydalanish hech qachon foydali bo‘lmaydi va algoritm to‘g‘ri ishlaydi.

Biroq grafda manfiy og‘irlikli qirralar mavjud bo‘lsa, maxsus choralar ko‘rish kerak.

Aks holda matritsadagi natijaviy qiymatlar $\infty - 1$, $\infty - 2$ va hokazo ko‘rinishda bo‘lishi mumkin; albatta, bu ham tegishli tugunlar orasida yo‘l mavjud emasligini bildiradi.

Shuning uchun grafda manfiy og‘irlikli qirralar bo‘lsa, mavjud bo‘lmagan yo‘llar orqali o‘tishlar bajarilmasligi uchun Floyd–Warshall algoritmini quyidagicha yozish yaxshiroq:

```cpp
for (int k = 0; k < n; ++k) {
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (d[i][k] < INF && d[k][j] < INF)
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
        }
    }
}
```

## Eng qisqa yo‘ldagi tugunlar ketma-ketligini tiklash

Istalgan ikki tugun orasidagi eng qisqa yo‘lni tugunlar ketma-ketligi ko‘rinishida tiklash imkonini beradigan qo‘shimcha ma’lumotni saqlash oson.

Buning uchun $d[ ][ ]$ masofalar matritsasiga qo‘shimcha ravishda, ikki tugun orasidagi eng qisqa masofa oxirgi marta qaysi fazada o‘zgartirilganini saqlovchi $p[ ][ ]$ ajdodlar matritsasini yuritish kerak.

Faza raqami kerakli eng qisqa yo‘lning o‘rtasidagi tugundan boshqa narsa emasligi aniq.

Endi faqat $i$ bilan $p[i][j]$ orasidagi hamda $p[i][j]$ bilan $j$ orasidagi eng qisqa yo‘llarni topish kerak.

Bu eng qisqa yo‘lni tiklaydigan sodda rekursiv algoritmga olib keladi.

## Haqiqiy sonli og‘irliklar holati

Qirra og‘irliklari butun emas, balki haqiqiy sonlar bo‘lsa, suzuvchi nuqtali turlar bilan ishlashda yuz beradigan xatolarni hisobga olish kerak.

Floyd–Warshall algoritmida xatolar juda tez yig‘ilib boradigan noxush xususiyat mavjud.

Darhaqiqat, birinchi fazada $\delta$ xato bo‘lsa, u ikkinchi iteratsiyaga $2 \delta$, uchinchi iteratsiyaga $4 \delta$ ko‘rinishida va hokazo tarqalishi mumkin.

Buning oldini olish uchun quyidagi taqqoslash yordamida xatoni (EPS = $\delta$) hisobga oladigan qilib algoritmni o‘zgartirish mumkin:

```cpp
if (d[i][k] + d[k][j] < d[i][j] - EPS)
    d[i][j] = d[i][k] + d[k][j];
```

## Manfiy sikllar holati

Formal jihatdan Floyd–Warshall algoritmi manfiy og‘irlikli sikl yoki sikllarni o‘z ichiga olgan graflarga qo‘llanmaydi.

Ammo $i$ dan boshlanib, manfiy siklga kirib, $j$ da tugaydigan yo‘l mavjud bo‘lmagan barcha $(i, j)$ tugunlar juftlari uchun algoritm baribir to‘g‘ri ishlaydi.

Javob mavjud bo‘lmagan tugunlar jufti uchun (ular orasidagi yo‘lda manfiy sikl mavjudligi sababli) Floyd algoritmi masofalar matritsasida qandaydir sonni saqlaydi — bu son juda katta manfiy bo‘lishi mumkin, lekin shart emas.

Biroq Floyd–Warshall algoritmini bunday juftlarni ehtiyotkorlik bilan qayta ishlaydigan va ular uchun, masalan, $-\text{INF}$ chiqaradigan qilib yaxshilash mumkin.

Buni quyidagicha amalga oshirish mumkin:

Berilgan graf uchun oddiy Floyd–Warshall algoritmini ishga tushiramiz.

Shundan keyin $i$ va $j$ tugunlar orasida eng qisqa yo‘l mavjud emasligi uchun va faqat shuning uchun $i$ dan yetib boriladigan va undan $j$ ga yetib borish mumkin bo‘lgan hamda $d[t][t] < 0$ shartini qanoatlantiradigan biror $t$ tugun mavjud bo‘lishi kerak.

Bundan tashqari, Floyd–Warshall algoritmini manfiy siklli graflarda qo‘llaganda masofalar eksponensial tezlikda manfiy tomonga ketib qoladigan vaziyatlar yuz berishi mumkinligini unutmaslik kerak.

Shuning uchun eng kichik masofani biror qiymat (masalan, $-\text{INF}$) bilan chegaralab, butun son toshib ketishini oldini olish kerak.

Grafda manfiy sikllarni topish haqida batafsil ma’lumot uchun alohida [Grafda manfiy siklni topish](finding-negative-cycle-in-graph.md) maqolasiga qarang.

## Amaliy masalalar

- [UVA: Page Hopping](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=762)
- [SPOJ: Possible Friends](http://www.spoj.com/problems/SOCIALNE/)
- [CODEFORCES: Greg and Graph](http://codeforces.com/problemset/problem/295/B)
- [SPOJ: CHICAGO - 106 miles to Chicago](http://www.spoj.com/problems/CHICAGO/)
* [UVA 10724 - Road Construction](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1665)
* [UVA  117 - The Postal Worker Rings Once](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=53)
* [Codeforces - Traveling Graph](http://codeforces.com/problemset/problem/21/D)
* [UVA - 1198 - The Geodetic Set Problem](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3639)
* [UVA - 10048 - Audiophobia](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=989)
* [UVA - 125 - Numbering Paths](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=61)
* [LOJ - Travel Company](http://lightoj.com/volume_showproblem.php?problem=1221)
* [UVA 423 - MPI Maelstrom](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=364)
* [UVA 1416 - Warfare And Logistics](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4162)
* [UVA 1233 - USHER](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3674)
* [UVA 10793 - The Orc Attack](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1734)
* [UVA 10099 The Tourist Guide](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1040)
* [UVA 869 - Airline Comparison](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=810)
* [UVA 13211 - Geonosis](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5134)
* [SPOJ - Defend the Rohan](http://www.spoj.com/problems/ROHAAN/)
* [Codeforces - Roads in Berland](http://codeforces.com/contest/25/problem/C)
* [Codeforces - String Problem](http://codeforces.com/contest/33/problem/B)
* [GYM - Manic Moving (C)](http://codeforces.com/gym/101223)
* [SPOJ - Arbitrage](http://www.spoj.com/problems/ARBITRAG/)
* [UVA - 12179 - Randomly-priced Tickets](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3331)
* [LOJ - 1086 - Jogging Trails](http://lightoj.com/volume_showproblem.php?problem=1086)
* [SPOJ - Ingredients](http://www.spoj.com/problems/INGRED/)
* [CSES - Shortest Routes II](https://cses.fi/problemset/task/1672)

