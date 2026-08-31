---
article_id: dynamic_programming--longest_increasing_subsequence
---
# Eng uzun o‘suvchi qism ketma-ketlik

$n$ ta sondan iborat $a[0 \dots n-1]$ massivi berilgan.
Vazifa — $a$ massivining eng uzun qat’iy o‘suvchi qism ketma-ketligini topish.

Formal ravishda, quyidagi shartlarni qanoatlantiruvchi indekslarning eng uzun $i_1,\dots,i_k$ ketma-ketligini qidiramiz:

$$i_1 < i_2 < \dots < i_k,\quad
a[i_1] < a[i_2] < \dots < a[i_k]$$

Ushbu maqolada masalani yechadigan bir nechta algoritmni ko‘rib chiqamiz.
Shuningdek, shu masalaga keltirish mumkin bo‘lgan ayrim boshqa masalalarni ham muhokama qilamiz.

## Dinamik dasturlash yordamida $O(n^2)$ yechim {data-toc-label="Solution in O(n^2) with dynamic programming"}

Dinamik dasturlash juda katta sinfdagi masalalarni yechishga imkon beruvchi umumiy usuldir.
Bu yerda uni aynan ushbu masalaga qo‘llaymiz.

Avval faqat eng uzun o‘suvchi qism ketma-ketlikning **uzunligini** topamiz, keyin esa qism ketma-ketlikning o‘zini tiklashni o‘rganamiz.

### Uzunlikni topish

$d[0\dots n-1]$ massivini ta’riflaymiz; $d[i]$ — $i$ indeksdagi element bilan tugaydigan eng uzun o‘suvchi qism ketma-ketlik uzunligi.

!!! example

    $$\begin{array}{ll}
    a &= \{8, 3, 4, 6, 5, 2, 0, 7, 9, 1\} \\
    d &= \{1, 1, 2, 3, 3, 1, 1, 4, 5, 2\}
    \end{array}$$

    4-indeksda tugaydigan eng uzun o‘suvchi qism ketma-ketlik $\{3,4,5\}$ bo‘lib, uning uzunligi 3. 8-indeksda tugaydigan eng uzun qism ketma-ketlik $\{3,4,5,7,9\}$ yoki $\{3,4,6,7,9\}$ bo‘lishi mumkin; ikkalasining ham uzunligi 5. 9-indeksda tugaydigan eng uzun qism ketma-ketlik esa uzunligi 2 bo‘lgan $\{0,1\}$ dir.

Bu massivni ketma-ket hisoblaymiz: avval $d[0]$, keyin $d[1]$ va hokazo.
Massiv hisoblangach, masalaning javobi $d[]$ massividagi eng katta qiymat bo‘ladi.

Joriy indeks $i$ bo‘lsin.
Ya’ni $d[i]$ qiymatini hisoblamoqchimiz va avvalgi $d[0],\dots,d[i-1]$ qiymatlarning barchasi ma’lum.
Ikki holat mavjud:

- $d[i]=1$: kerakli qism ketma-ketlik faqat $a[i]$ elementidan iborat.

- $d[i]>1$: qism ketma-ketlik $a[i]$ bilan tugaydi, undan bevosita oldin esa $j<i$ va $a[j]<a[i]$ shartlarini qanoatlantiruvchi biror $a[j]$ soni turadi.
  $a[j]$ da tugaydigan qism ketma-ketlikning o‘zi ham $a[j]$ da tugaydigan eng uzun o‘suvchi qism ketma-ketliklardan biri bo‘lishi ravshan.
  $a[i]$ soni shu qism ketma-ketlikni bir elementga uzaytiradi.
  Demak, $j<i$ va $a[j]<a[i]$ shartlarini qanoatlantiruvchi barcha $j$ larni ko‘rib chiqib, $a[j]$ da tugaydigan eng uzun o‘suvchi qism ketma-ketlikka $a[i]$ ni qo‘shish orqali olinadigan eng uzun variantni tanlaymiz.
  $a[j]$ da tugaydigan eng uzun o‘suvchi qism ketma-ketlik uzunligi $d[j]$ bo‘lgani uchun, uni bir elementga uzaytirish $d[j]+1$ uzunlikni beradi.

  $$d[i] = \max_{\substack{j < i \\ a[j] < a[i]}} \left(d[j] + 1\right)$$

Bu ikki holatni birlashtirsak, $d[i]$ uchun yakuniy formulani olamiz:

$$d[i] = \max\left(1, \max_{\substack{j < i \\ a[j] < a[i]}} \left(d[j] + 1\right)\right)$$

### Implementatsiya

Quyidagi implementatsiya yuqorida tavsiflangan algoritm yordamida eng uzun o‘suvchi qism ketma-ketlik uzunligini hisoblaydi.

```{.cpp file=lis_n2}
int lis(vector<int> const& a) {
    int n = a.size();
    vector<int> d(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i])
                d[i] = max(d[i], d[j] + 1);
        }
    }
    int ans = d[0];
    for (int i = 1; i < n; i++) {
        ans = max(ans, d[i]);
    }
    return ans;
}
```

### Qism ketma-ketlikni tiklash

Hozirgacha faqat qism ketma-ketlik uzunligini topishni o‘rgandik, uning o‘zini topishni emas.
Qism ketma-ketlikni tiklash uchun $d[]$ bilan birga hisoblanadigan qo‘shimcha $p[0\dots n-1]$ yordamchi massivini yaratamiz.
$p[i]$ — $i$ da tugaydigan eng uzun o‘suvchi qism ketma-ketlikdagi oxiridan ikkinchi elementning $j$ indeksi.
Boshqacha aytganda, $p[i]$ — $d[i]$ ning eng katta qiymati olingan o‘sha $j$ indeksidir.
Ma’lum ma’noda $p[]$ massivi ajdodlarga ko‘rsatadi.

Qism ketma-ketlikni tiklash uchun $d[i]$ maksimal bo‘lgan $i$ indeksdan boshlaymiz va butun qism ketma-ketlik tiklanmaguncha, ya’ni $d[i]=1$ bo‘lgan elementga yetguncha ajdodlar bo‘ylab yuramiz.

### Tiklash implementatsiyasi

Oldingi bo‘limdagi kodni biroz o‘zgartiramiz.
$d[]$ bilan birga $p[]$ massivini hisoblaymiz, keyin qism ketma-ketlikni tiklaymiz.

Qulaylik uchun avval barcha ajdodlarni $p[i]=-1$ deb belgilaymiz.
$d[i]=1$ bo‘lgan elementlar uchun ajdod qiymati $-1$ bo‘lib qoladi; bu tiklashni biroz qulaylashtiradi.

```{.cpp file=lis_n2_restore}
vector<int> lis(vector<int> const& a) {
    int n = a.size();
    vector<int> d(n, 1), p(n, -1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i] && d[i] < d[j] + 1) {
                d[i] = d[j] + 1;
                p[i] = j;
            }
        }
    }

    int ans = d[0], pos = 0;
    for (int i = 1; i < n; i++) {
        if (d[i] > ans) {
            ans = d[i];
            pos = i;
        }
    }
    vector<int> subseq;
    while (pos != -1) {
        subseq.push_back(a[pos]);
        pos = p[pos];
    }
    reverse(subseq.begin(), subseq.end());
    return subseq;
}
```

### Qism ketma-ketlikni tiklashning muqobil usuli

Qism ketma-ketlikni yordamchi $p[]$ massivi ishlatmasdan ham tiklash mumkin.
Joriy $d[i]$ qiymatini qaytadan hisoblab, maksimum qaysi yo‘l bilan olinganini aniqlash kifoya.

Bu usul kodni biroz uzaytiradi, evaziga bir oz xotirani tejaydi.

## Dinamik dasturlash va ikkilik qidiruv yordamida $O(n \log n)$ yechim {data-toc-label="Solution in O(n log n) with dynamic programming and binary search"}

Masala uchun tezroq yechim olish maqsadida avval $O(n^2)$ vaqtda ishlaydigan boshqa dinamik dasturlash yechimini tuzamiz, keyin uni $O(n\log n)$ gacha yaxshilaymiz.

Bu safar $d[0\dots n]$ dinamik dasturlash massividan foydalanamiz.
Endi $d[l]$ qiymati $a[i]$ elementiga ham, massiv prefiksiga ham to‘g‘ridan-to‘g‘ri mos kelmaydi.
$d[l]$ — uzunligi $l$ bo‘lgan o‘suvchi qism ketma-ketlik tugashi mumkin bo‘lgan eng kichik element.

Dastlab $d[0]=-{\infty}$, qolgan barcha uzunliklar uchun esa $d[l]=\infty$ deb olamiz.

Sonlarni yana ketma-ket qayta ishlaymiz: avval $a[0]$, keyin $a[1]$ va hokazo. Har qadamda $d[]$ massivini joriy prefiksga mos holda saqlaymiz.

!!! example
    $a=\{8,3,4,6,5,2,0,7,9,1\}$ massivi berilgan bo‘lsin. Quyida uning barcha prefikslari va ularga mos dinamik dasturlash massivlari keltirilgan.
    Massiv qiymatlari har doim ham aynan oxirgi pozitsiyada o‘zgarmasligiga e’tibor bering.

    $$
    \begin{array}{ll}
    \text{prefix} = \{\} &\quad d = \{-\infty, \infty, \dots\}\\
    \text{prefix} = \{8\} &\quad d = \{-\infty, 8, \infty, \dots\}\\
    \text{prefix} = \{8, 3\} &\quad d = \{-\infty, 3, \infty, \dots\}\\
    \text{prefix} = \{8, 3, 4\} &\quad d = \{-\infty, 3, 4, \infty, \dots\}\\
    \text{prefix} = \{8, 3, 4, 6\} &\quad d = \{-\infty, 3, 4, 6, \infty, \dots\}\\
    \text{prefix} = \{8, 3, 4, 6, 5\} &\quad d = \{-\infty, 3, 4, 5, \infty, \dots\}\\
    \text{prefix} = \{8, 3, 4, 6, 5, 2\} &\quad d = \{-\infty, 2, 4, 5, \infty, \dots \}\\
    \text{prefix} = \{8, 3, 4, 6, 5, 2, 0\} &\quad d = \{-\infty, 0, 4, 5, \infty, \dots \}\\
    \text{prefix} = \{8, 3, 4, 6, 5, 2, 0, 7\} &\quad d = \{-\infty, 0, 4, 5, 7, \infty, \dots \}\\
    \text{prefix} = \{8, 3, 4, 6, 5, 2, 0, 7, 9\} &\quad d = \{-\infty, 0, 4, 5, 7, 9, \infty, \dots \}\\
    \text{prefix} = \{8, 3, 4, 6, 5, 2, 0, 7, 9, 1\} &\quad d = \{-\infty, 0, 1, 5, 7, 9, \infty, \dots \}\\
    \end{array}
    $$

$a[i]$ ni qayta ishlayotganimizda o‘zimizga quyidagi savolni beramiz: joriy $a[i]$ sonini $d[0\dots n]$ massiviga qachon yozamiz?

Agar $a[i]$ da tugaydigan uzunligi $l$ bo‘lgan eng uzun o‘suvchi qism ketma-ketlik mavjud bo‘lsa va uzunligi $l$ bo‘lgan hech bir o‘suvchi qism ketma-ketlik undan kichikroq sonda tugamasa, $d[l]=a[i]$ deb belgilaymiz.

Oldingi yondashuvdagidek, uzunligi $l$ bo‘lgan eng uzun o‘suvchi qism ketma-ketlikdan $a[i]$ ni olib tashlasak, uzunligi $l-1$ bo‘lgan boshqa o‘suvchi qism ketma-ketlik hosil bo‘ladi.
Shuning uchun uzunligi $l-1$ bo‘lgan eng uzun o‘suvchi qism ketma-ketlikni $a[i]$ bilan uzaytirmoqchimiz. Oxirgi elementi eng kichik bo‘lgan uzunligi $l-1$ qism ketma-ketlik eng qulay variantdir, ya’ni $d[l-1]$ elementi bilan tugaydigan qism ketma-ketlik.

Uzunligi $l-1$ bo‘lgan o‘suvchi qism ketma-ketlikni $a[i]$ bilan aynan $d[l-1]<a[i]$ bo‘lganda uzaytirish mumkin.
Demak, har bir $l$ uzunlikni ko‘rib chiqib, shu shart yordamida qism ketma-ketlikni uzaytirish mumkinligini tekshiramiz.

Bundan tashqari, uzunligi $l$ bo‘lgan va undan ham kichikroq sonda tugaydigan qism ketma-ketlikni avval topgan bo‘lishimiz mumkinligini tekshirish kerak.
Shuning uchun faqat $a[i]<d[l]$ bo‘lganda yangilaymiz.

$a[]$ ning barcha elementlari qayta ishlangach, kerakli qism ketma-ketlik uzunligi $d[l]<\infty$ bo‘lgan eng katta $l$ ga teng.

```{.cpp file=lis_method2_n2}
int lis(vector<int> const& a) {
    int n = a.size();
    const int INF = 1e9;
    vector<int> d(n+1, INF);
    d[0] = -INF;

    for (int i = 0; i < n; i++) {
        for (int l = 1; l <= n; l++) {
            if (d[l-1] < a[i] && a[i] < d[l])
                d[l] = a[i];
        }
    }
    int ans = 0;
    for (int l = 0; l <= n; l++) {
        if (d[l] < INF)
            ans = l;
    }
    return ans;
}
```

Endi ikkita muhim kuzatuv qilamiz.

1. $d$ massivi doimo tartiblangan bo‘ladi:
   barcha $l=1\dots n$ uchun $d[l-1]<d[l]$.

   Bu ravshan: uzunligi $l$ bo‘lgan o‘suvchi qism ketma-ketlikning oxirgi elementini olib tashlasak, uzunligi $l-1$ bo‘lgan va kichikroq sonda tugaydigan o‘suvchi qism ketma-ketlik hosil bo‘ladi.

2. $a[i]$ elementi ko‘pi bilan bitta $d[l]$ qiymatini yangilaydi.

   Bu yuqoridagi implementatsiyadan bevosita kelib chiqadi.
   Massivda $d[l-1]<a[i]<d[l]$ sharti bajariladigan faqat bitta joy bo‘lishi mumkin.

Demak, $d[]$ massividagi kerakli elementni [ikkilik qidiruv](../num_methods/binary_search.md) yordamida $O(\log n)$ vaqtda topish mumkin.
Amalda $d[]$ massividagi $a[i]$ dan qat’iy katta bo‘lgan birinchi sonni topamiz va uni yuqoridagi implementatsiyadagi kabi yangilashga urinib ko‘ramiz.

### Implementatsiya

Natijada quyidagi yaxshilangan $O(n\log n)$ implementatsiyani olamiz:

```{.cpp file=lis_method2_nlogn}
int lis(vector<int> const& a) {
    int n = a.size();
    const int INF = 1e9;
    vector<int> d(n+1, INF);
    d[0] = -INF;

    for (int i = 0; i < n; i++) {
        int l = upper_bound(d.begin(), d.end(), a[i]) - d.begin();
        if (d[l-1] < a[i] && a[i] < d[l])
            d[l] = a[i];
    }
    int ans = 0;
    for (int l = 0; l <= n; l++) {
        if (d[l] < INF)
            ans = l;
    }
    return ans;
}
```

### Qism ketma-ketlikni tiklash

Bu yondashuvda ham qism ketma-ketlikni tiklash mumkin.
Bu safar ikkita yordamchi massivni saqlash kerak.
Ulardan biri $d[]$ dagi elementlarning $a[]$ dagi indekslarini ko‘rsatadi.
Bundan tashqari, yana “ajdodlar” massivi $p[i]$ ni yaratamiz.
$p[i]$ — $i$ elementda tugaydigan optimal qism ketma-ketlikdagi avvalgi element indeksi.
$a[]$ massivi bo‘ylab yurish va $d[]$ ni hisoblash jarayonida bu ikki massivni ham oson saqlash mumkin.
Oxirida ular yordamida kerakli qism ketma-ketlikni tiklash qiyin emas.

## Ma’lumotlar tuzilmalari yordamida $O(n \log n)$ yechim {data-toc-label="Solution in O(n log n) with data structures"}

Eng uzun o‘suvchi qism ketma-ketlikni yuqoridagi ikkilik qidiruv usulidan tashqari oddiy ma’lumotlar tuzilmalari yordamida ham $O(n\log n)$ vaqtda topish mumkin.

Birinchi usulga qaytaylik.
$d[i]$ qiymati $j<i$ va $a[j]<a[i]$ bo‘lgan indekslar orasidagi $d[j]+1$ ning eng katta qiymati ekanini eslang.

Quyidagicha qo‘shimcha $t[]$ massivini ta’riflasak,

$$t[a[i]] = d[i],$$

$d[i]$ qiymatini hisoblash masalasi $t[]$ massivining bir prefiksidagi **eng katta qiymatni** topish masalasiga teng bo‘ladi:

$$d[i] = \max\left(t[0 \dots a[i] - 1] + 1\right)$$

O‘zgarib turadigan massiv prefiksining maksimumini topish — ko‘plab ma’lumotlar tuzilmalari bilan yechiladigan standart masala.
Masalan, [segment daraxti](../data_structures/segment_tree.md) yoki [Fenwick daraxti](../data_structures/fenwick.md) dan foydalanish mumkin.

Bu usulning ayrim **kamchiliklari** bor.
Implementatsiya uzunligi va murakkabligi bo‘yicha u ikkilik qidiruv usulidan yomonroq.
Bundan tashqari, kirishdagi $a[i]$ sonlari juda katta bo‘lsa, sonlarni siqish — ularni $0$ dan $n-1$ gacha qayta raqamlash — yoki dinamik segment daraxtidan foydalanish, ya’ni daraxtning faqat kerakli shoxlarini yaratish kabi usullar kerak bo‘ladi.
Aks holda xotira sarfi juda katta bo‘ladi.

Boshqa tomondan, bu usulning **afzalliklari** ham bor.
Unda dinamik dasturlash yechimining nozik xossalari haqida o‘ylash shart emas.
Shuningdek, yondashuv masalani juda oson umumlashtirish imkonini beradi; quyidagi bo‘limga qarang.

## Bog‘liq masalalar

Quyida eng uzun o‘suvchi qism ketma-ketlik masalasiga yaqin bo‘lgan bir nechta masala keltirilgan.

### Eng uzun kamaymaydigan qism ketma-ketlik

Bu deyarli aynan o‘sha masala.
Faqat endi qism ketma-ketlikda teng sonlardan foydalanishga ruxsat beriladi.

Yechim ham deyarli bir xil.
Faqat tengsizlik belgilarini o‘zgartirish va ikkilik qidiruvga kichik tuzatish kiritish kerak.

### Eng uzun o‘suvchi qism ketma-ketliklar soni

Birinchi ko‘rib chiqilgan usuldan — $O(n^2)$ variantidan yoki ma’lumotlar tuzilmalari ishlatiladigan variantdan — foydalanish mumkin.
Faqat $d[i]$ qiymatiga ega, ya’ni $a[i]$ da tugaydigan eng uzun o‘suvchi qism ketma-ketliklarni nechta usul bilan hosil qilish mumkinligini ham saqlash kerak.

$a[i]$ da tugaydigan eng uzun o‘suvchi qism ketma-ketliklar soni $d[j]$ maksimal bo‘lgan barcha $j$ lar uchun, $j$ da tugaydigan qism ketma-ketliklar sonlari yig‘indisiga teng.
Bunday $j$ lar bir nechta bo‘lishi mumkin, shuning uchun ularning barchasini qo‘shish kerak.

Segment daraxti yordamida bu yondashuvni ham $O(n\log n)$ vaqtda amalga oshirish mumkin.

Bu masalada ikkilik qidiruv yondashuvidan foydalanib bo‘lmaydi.

### Ketma-ketlikni qoplaydigan o‘smaydigan qism ketma-ketliklarning eng kichik soni

$n$ ta $a[0\dots n-1]$ sondan iborat massiv berilgan. Har bir rangga tegishli sonlar o‘smaydigan qism ketma-ketlik hosil qiladigan qilib, sonlarni eng kam sondagi rang bilan bo‘yash kerak.

Buni yechish uchun kerakli ranglarning eng kichik soni eng uzun o‘suvchi qism ketma-ketlik uzunligiga tengligini payqaymiz.

**Isbot:**
Bu ikki masalaning **dualligini** isbotlashimiz kerak.
Eng uzun o‘suvchi qism ketma-ketlik uzunligini $x$, ketma-ketlikni qoplaydigan o‘smaydigan qism ketma-ketliklarning eng kichik sonini $y$ deb belgilaylik.
$x=y$ ekanini ko‘rsatish kerak.

$y<x$ bo‘lishi mumkin emasligi ravshan: qat’iy o‘suvchi $x$ ta element mavjud bo‘lsa, ularning hech qaysi ikkitasi bir xil o‘smaydigan qism ketma-ketlikka kira olmaydi.
Demak, $y\geq x$.

Endi qarama-qarshilik usuli bilan $y>x$ ham mumkin emasligini ko‘rsatamiz.
$y>x$ deb faraz qilaylik.
$y$ ta o‘smaydigan qism ketma-ketlikdan iborat istalgan optimal qoplamani ko‘rib chiqamiz.
Uni quyidagicha o‘zgartiramiz:
birinchi qism ketma-ketlik ikkinchisidan oldin boshlanadigan va birinchi qism ketma-ketlikning boshlang‘ich soni ikkinchisining boshlang‘ich sonidan katta yoki teng bo‘lgan ikki qism ketma-ketlik mavjud ekan, birinchi qism ketma-ketlikning boshlang‘ich sonini ajratib olib, ikkinchisining boshiga qo‘shamiz.

Chekli sondagi qadamdan keyin yana $y$ ta qism ketma-ketlik qoladi va ularning boshlang‘ich sonlari uzunligi $y$ bo‘lgan o‘suvchi qism ketma-ketlik hosil qiladi.
Ammo $y>x$ deb faraz qilgan edik; bu qarama-qarshilik.
Demak, $y=x$.

**Qism ketma-ketliklarni tiklash:**
Ketma-ketlikni kerakli qism ketma-ketliklarga ochko‘z usulda ajratish mumkin.
Chapdan o‘ngga yurib, joriy sonni oxirgi elementi joriy sondan katta yoki teng bo‘lgan qism ketma-ketliklar orasida oxirgi elementi eng kichik bo‘lganiga qo‘shamiz.

## Amaliy masalalar

- [ACMSGURU - "North-East"](http://codeforces.com/problemsets/acmsguru/problem/99999/521)
- [Codeforces - LCIS](http://codeforces.com/problemset/problem/10/D)
- [Codeforces - Tourist](http://codeforces.com/contest/76/problem/F)
- [SPOJ - DOSA](https://www.spoj.com/problems/DOSA/)
- [SPOJ - HMLIS](https://www.spoj.com/problems/HMLIS/)
- [SPOJ - ONEXLIS](https://www.spoj.com/problems/ONEXLIS/)
- [SPOJ - SUPPER](http://www.spoj.com/problems/SUPPER/)
- [Topcoder - AutoMarket](https://community.topcoder.com/stat?c=problem_statement&pm=3937&rd=6532)
- [Topcoder - BridgeArrangement](https://community.topcoder.com/stat?c=problem_statement&pm=2967&rd=5881)
- [Topcoder - IntegerSequence](https://community.topcoder.com/stat?c=problem_statement&pm=5922&rd=8075)
- [UVA - Back To Edit Distance](https://onlinejudge.org/external/127/12747.pdf)
- [UVA - Happy Birthday](https://onlinejudge.org/external/120/12002.pdf)
- [UVA - Tiling Up Blocks](https://onlinejudge.org/external/11/1196.pdf)

