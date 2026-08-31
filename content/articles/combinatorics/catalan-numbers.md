---
article_id: combinatorics--catalan-numbers
---
# Catalan sonlari

Catalan sonlari — ko‘pincha rekursiv aniqlangan obyektlarni o‘z ichiga oladigan ko‘plab kombinatorik masalalarda foydali bo‘lgan sonlar ketma-ketligi.

Bu ketma-ketlik XIX asrda yashagan belgiyalik matematik [Catalan](https://en.wikipedia.org/wiki/Eug%C3%A8ne_Charles_Catalan) sharafiga nomlangan. Aslida, u Catalandan bir asr oldin yashagan Eulerga ham ma’lum bo‘lgan.

Noldan boshlab dastlabki Catalan sonlari $C_n$:

$$1, 1, 2, 5, 14, 42, 132, 429, 1430, \ldots$$

### Ayrim kombinatorik masalalardagi qo‘llanishlar

Catalan soni $C_n$ quyidagilarning javobidir:

- $n$ ta ochuvchi va $n$ ta yopuvchi qavsdan iborat to‘g‘ri qavslar ketma-ketliklari soni.
- $n+1$ ta bargli ildizli to‘liq ikkilik daraxtlar soni (tugunlar raqamlanmagan). Har bir tuguni yoki ikkita farzandga ega, yoki umuman farzandsiz bo‘lgan ildizli ikkilik daraxt **to‘liq** deyiladi.
- $n+1$ ta ko‘paytuvchini qavslar bilan to‘liq guruhlash usullari soni.
- Qavariq $(n+2)$-burchak triangulyatsiyalari soni, ya’ni diagonallar yordamida ko‘pburchakni o‘zaro kesishmaydigan uchburchaklarga ajratish usullari soni.
- Aylana ustidagi $2n$ ta nuqtani $n$ ta o‘zaro kesishmaydigan vatar bilan ulash usullari soni.
- $n$ ta ichki tugunga ega [izomorf bo‘lmagan](https://en.wikipedia.org/wiki/Graph_isomorphism) to‘liq ikkilik daraxtlar soni (ichki tugun — kamida bitta farzandga ega tugun).
- $n\times n$ o‘lchamli kvadrat panjarada $(0,0)$ nuqtadan $(n,n)$ nuqtaga boradigan va bosh diagonalning yuqorisiga chiqmaydigan monoton panjara yo‘llari soni.
- [Stek yordamida saralash mumkin bo‘lgan](https://en.wikipedia.org/wiki/Stack-sortable_permutation) uzunligi $n$ bo‘lgan permutatsiyalar soni. Permutatsiyani stek yordamida saralash mumkin bo‘lishi uchun va faqat shuning uchun $i<j<k$ hamda $a_k<a_i<a_j$ bo‘ladigan indekslar mavjud bo‘lmasligi ko‘rsatilishi mumkin.
- $n$ elementli to‘plamning [kesishmaydigan bo‘linishlari](https://en.wikipedia.org/wiki/Noncrossing_partition) soni.
- $1\ldots n$ zinapoyani $n$ ta to‘g‘ri to‘rtburchak bilan qoplash usullari soni. Zinapoya $n$ ta ustundan iborat bo‘lib, $i$-ustunning balandligi $i$ ga teng.

## Hisoblash

Catalan sonlari uchun ikkita formula mavjud: **rekurrent** va **analitik**. Yuqorida sanalgan masalalarning barchasi ekvivalent, ya’ni bir xil javobga ega deb qaraladi. Shu sababli quyidagi formulalarni isbotlashda isbot eng qulay bo‘lgan masalani tanlaymiz.

### Rekurrent formula

$$C_0 = C_1 = 1$$

$$C_n = \sum_{k = 0}^{n-1} C_k C_{n-1-k} , {n} \geq 2$$

Rekurrent formulani to‘g‘ri qavslar ketma-ketligi masalasidan osongina keltirib chiqarish mumkin.

Eng chapdagi ochuvchi qavs $l$ ga ma’lum bir yopuvchi qavs $r$ mos keladi. U ketma-ketlikni ikkita qismga ajratadi va bu qismlarning har biri ham to‘g‘ri qavslar ketma-ketligi bo‘lishi kerak. Formula ham shunga mos ravishda ikki qismga bo‘linadi. $k=r-l-1$ deb belgilasak, har bir belgilangan $r$ uchun aynan $C_kC_{n-1-k}$ ta shunday qavslar ketma-ketligi mavjud bo‘ladi. Barcha mumkin bo‘lgan $k$ lar bo‘yicha yig‘ib, $C_n$ uchun rekurrent munosabatni olamiz.

Buni boshqacha ham tasavvur qilish mumkin. Ta’rifga ko‘ra, $C_n$ to‘g‘ri qavslar ketma-ketliklari sonini bildiradi. Ketma-ketlikni uzunliklari $k$ va $n-k$ bo‘lgan ikki qismga ajratish mumkin; ikkala qism ham to‘g‘ri qavslar ketma-ketligi bo‘lishi kerak. Masalan:

`( ) ( ( ) )` ketma-ketligini `( )` va `( ( ) )` qismlariga ajratish mumkin, ammo `( ) (` va `( ) )` qismlariga ajratib bo‘lmaydi. Yana barcha mumkin bo‘lgan $k$ lar bo‘yicha yig‘ib, $C_n$ uchun rekurrent munosabatni olamiz.

#### C++ implementatsiyasi

```cpp
const int MOD = ....
const int MAX = ....
int catalan[MAX];
void init() {
    catalan[0] = catalan[1] = 1;
    for (int i=2; i<=n; i++) {
        catalan[i] = 0;
        for (int j=0; j < i; j++) {
            catalan[i] += (catalan[j] * catalan[i-j-1]) % MOD;
            if (catalan[i] >= MOD) {
                catalan[i] -= MOD;
            }
        }
    }
}
```

### Analitik formula

$$C_n = \frac{1}{n + 1} {\binom{2n}{n}}$$

Bu yerda $\binom{n}{k}$ odatiy binomial koeffitsiyent, ya’ni $n$ elementli to‘plamdan $k$ ta obyekt tanlash usullari sonini bildiradi.

Yuqoridagi formulani kvadrat panjaradagi monoton yo‘llar masalasidan osongina keltirib chiqarish mumkin. $n\times n$ panjaradagi barcha monoton yo‘llar soni $\binom{2n}{n}$ ga teng.

Endi bosh diagonalni kesib o‘tadigan monoton yo‘llar sonini sanaymiz. Shunday yo‘ldagi diagonalning yuqorisida joylashgan birinchi qirrani topamiz va shu qirradan keyingi butun yo‘l qismini diagonalga nisbatan akslantiramiz. Natijada har doim $(n-1)\times(n+1)$ panjaradagi monoton yo‘l hosil bo‘ladi. Aksincha, $(n-1)\times(n+1)$ panjaradagi har qanday monoton yo‘l diagonal bilan kesishishi shart.

Shu tariqa $n\times n$ panjarada bosh diagonalni kesib o‘tadigan barcha monoton yo‘llarni sanab chiqdik.

$(n-1)\times(n+1)$ panjaradagi monoton yo‘llar soni $\binom{2n}{n-1}$ ga teng. Bunday yo‘llarni “yomon” yo‘llar deb ataylik. Bosh diagonalni kesib o‘tmaydigan monoton yo‘llar sonini olish uchun barcha yo‘llardan “yomon” yo‘llarni ayiramiz va quyidagi formulaga ega bo‘lamiz:

$$C_n = \binom{2n}{n} - \binom{2n}{n-1} = \frac{1}{n + 1} \binom{2n}{n} , {n} \geq 0$$

## Manbalar

- [Catalan Number by Tom Davis](http://www.geometer.org/mathcircles/catalan.pdf)
- [Catalan Numbers and Catalan Convolution](https://codeforces.com/blog/entry/87585)

## Amaliy masalalar

- [CodeChef — PANSTACK](https://www.codechef.com/APRIL12/problems/PANSTACK/)
- [SPOJ — Skyline](http://www.spoj.com/problems/SKYLINE/)
- [UVA — Safe Salutations](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=932)
- [Codeforces — How many trees?](http://codeforces.com/problemset/problem/9/D)
- [SPOJ — FUNPROB](http://www.spoj.com/problems/FUNPROB/)
- [LOJ — 1170 — Counting Perfect BST](http://lightoj.com/volume_showproblem.php?problem=1170)
- [UVA — 12887 — The Soldier's Dilemma](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4752)

