---
article_id: string--string-hashing
---
# Satrlarni xeshlash

Xeshlash algoritmlari juda ko‘p masalalarni yechishda foydali.
Biz satrlarni samarali taqqoslash masalasini yechmoqchimiz.
Eng sodda usul ikki satr harflarini bevosita taqqoslashdir; agar satrlar uzunliklari $n_1$ va $n_2$ bo‘lsa, bu usulning vaqt murakkabligi $O(\min(n_1, n_2))$ ga teng.
Biz bundan yaxshiroq natija olishni istaymiz.
Satrlarni xeshlash g‘oyasi quyidagicha: har bir satrni biror butun songa akslantiramiz va satrlarning o‘zi o‘rniga shu sonlarni taqqoslaymiz.
Bu satrlarni taqqoslash vaqtini $O(1)$ gacha kamaytiradi.
Bunday o‘zgartirish uchun **xesh funksiya** deb ataladigan funksiya kerak.
Uning vazifasi satrni butun songa — satrning **xeshi**ga — aylantirishdir.
Quyidagi shart bajarilishi kerak: agar $s$ va $t$ satrlar teng bo‘lsa ($s = t$), ularning xeshlari ham teng bo‘lishi shart ($\text{hash}(s) = \text{hash}(t)$).
Aks holda satrlarni xesh orqali taqqoslay olmaymiz.
Teskarisi esa bajarilishi shart emasligini e’tiborga oling.
Xeshlar teng bo‘lsa ($\text{hash}(s) = \text{hash}(t)$), satrlar albatta teng bo‘lishi shart emas.
Masalan, har qanday $s$ uchun $\text{hash}(s) = 0$ deb aniqlangan funksiya ham formal jihatdan to‘g‘ri xesh funksiyadir.
Albatta, bu mutlaqo foydasiz misol, biroq u xesh funksiya ta’rifiga mos keladi.
Teskarisi shart emasligining sababi — mumkin bo‘lgan satrlar soni eksponensial darajada ko‘pligidir.
Hatto uzunligi 15 dan kichik, faqat kichik lotin harflaridan tuzilgan barcha satrlarni farqlamoqchi bo‘lsak ham, xesh 64 bitli butun songa (masalan, `unsigned long long` ga) sig‘maydi, chunki bunday satrlar juda ko‘p.
Bundan tashqari, ixtiyoriy uzunlikdagi butun sonlarni taqqoslashni ham xohlamaymiz, chunki bunda murakkablik yana $O(n)$ bo‘ladi.
Shuning uchun odatda xesh funksiya satrlarni $[0, m)$ kabi o‘zgarmas oraliqdagi sonlarga akslantiradi; shunda satrlarni taqqoslash o‘zgarmas uzunlikdagi ikkita butun sonni taqqoslashga aylanadi.
Tabiiyki, $s \neq t$ bo‘lsa, $\text{hash}(s) \neq \text{hash}(t)$ bo‘lish ehtimoli juda yuqori bo‘lishini istaymiz.
Yodda tutish kerak bo‘lgan asosiy nuqta shu.
Xeshlashdan foydalanish 100% deterministik to‘g‘ri natijani kafolatlamaydi, chunki mutlaqo boshqa ikkita satrning xeshi bir xil chiqishi mumkin; bu **kolliziya** deyiladi.
Biroq masalalarning juda katta qismida buni e’tiborsiz qoldirish mumkin, chunki turli satrlar xeshlarining kolliziya ehtimoli juda kichik.
Ushbu maqolada kolliziya ehtimolini qanday juda past saqlash mumkinligini ham ko‘rib chiqamiz.

## Satr xeshini hisoblash

Uzunligi $n$ bo‘lgan $s$ satr xeshini aniqlashning yaxshi va keng tarqalgan usuli quyidagicha:

$$\begin{align}
\text{hash}(s) &= s[0] + s[1] \cdot p + s[2] \cdot p^2 + ... + s[n-1] \cdot p^{n-1} \mod m \\
&= \sum_{i=0}^{n-1} s[i] \cdot p^i \mod m,
\end{align}$$

bu yerda $p$ va $m$ — oldindan tanlangan musbat sonlar.
Bu **polinomial siljuvchi xesh funksiyasi** deyiladi.
$p$ ni kirish alifbosidagi belgilar soniga yaqin tub son qilib tanlash ma’qul.
Masalan, kirish faqat ingliz alifbosining kichik harflaridan iborat bo‘lsa, $p = 31$ yaxshi tanlovdir.
Kirishda katta va kichik harflar bo‘lishi mumkin bo‘lsa, $p = 53$ ni tanlash mumkin.
Ushbu maqoladagi kod $p = 31$ dan foydalanadi.
$m$ katta son bo‘lishi kerak, chunki ikkita tasodifiy satr kolliziyasi ehtimoli taxminan $\approx \frac{1}{m}$ ga teng.
Ba’zan $m = 2^{64}$ tanlanadi, chunki 64 bitli butun sonning to‘lib ketishi aynan modul bo‘yicha amal kabi ishlaydi.
Biroq $p$ tanlovidan qat’i nazar kolliziya qiluvchi satrlarni yasash usuli mavjud.
Shu sababli amaliyotda $m = 2^{64}$ tavsiya etilmaydi.
$m$ uchun katta tub son yaxshi tanlovdir.
Maqoladagi kod $m = 10^9+9$ dan foydalanadi.
Bu katta son, lekin ikkita qiymat ko‘paytmasini 64 bitli butun sonlarda hisoblash uchun yetarlicha kichik.
Quyida faqat kichik harflardan iborat $s$ satr xeshini hisoblash misoli keltirilgan.
$s$ ning har bir belgisini butun songa aylantiramiz.
Bu yerda $a \rightarrow 1$, $b \rightarrow 2$, $\dots$, $z \rightarrow 26$ moslikdan foydalanamiz.
$a \rightarrow 0$ deb olish yaxshi fikr emas, chunki unda $a$, $aa$, $aaa$, $\dots$ satrlarning barchasi $0$ xeshga ega bo‘ladi.

```{.cpp file=hashing_function}
long long compute_hash(string const& s) {
    const int p = 31;
    const int m = 1e9 + 9;
    long long hash_value = 0;
    long long p_pow = 1;
    for (char c : s) {
        hash_value = (hash_value + (c - 'a' + 1) * p_pow) % m;
        p_pow = (p_pow * p) % m;
    }
    return hash_value;
}
```

$p$ darajalarini oldindan hisoblash unumdorlikni oshirishi mumkin.

## Misol masalalar

### Satrlar massividagi takroriy satrlarni topish

Masala: har birining uzunligi $m$ dan oshmaydigan $n$ ta $s_i$ satr berilgan. Barcha takroriy satrlarni topish va ularni guruhlarga ajratish kerak.
Satrlarni saralashga asoslangan oddiy algoritmning vaqt murakkabligi $O(n m \log n)$ bo‘ladi: saralash $O(n \log n)$ ta taqqoslash talab qiladi, har bir taqqoslash esa $O(m)$ vaqt oladi.
Xeshlardan foydalansak, taqqoslash vaqtini $O(1)$ gacha kamaytiramiz va $O(nm + n \log n)$ vaqtda ishlaydigan algoritmga ega bo‘lamiz.

Har bir satr xeshini hisoblaymiz, xeshlarni indekslar bilan birga saralaymiz, so‘ng teng xeshli indekslarni guruhlaymiz.

```{.cpp file=hashing_group_identical_strings}
vector<vector<int>> group_identical_strings(vector<string> const& s) {
    int n = s.size();
    vector<pair<long long, int>> hashes(n);
    for (int i = 0; i < n; i++)
        hashes[i] = {compute_hash(s[i]), i};

    sort(hashes.begin(), hashes.end());
    vector<vector<int>> groups;
    for (int i = 0; i < n; i++) {
        if (i == 0 || hashes[i].first != hashes[i-1].first)
            groups.emplace_back();
        groups.back().push_back(hashes[i].second);
    }
    return groups;
}
```

### Berilgan satr qism satrlarining xeshini tez hisoblash

Masala: $s$ satr hamda $i$ va $j$ indekslar berilgan. $s[i \dots j]$ qism satrining xeshini topish kerak.

Ta’rifga ko‘ra:

$$\text{hash}(s[i \dots j]) = \sum_{k = i}^j s[k] \cdot p^{k-i} \mod m$$

Ikki tomonni $p^i$ ga ko‘paytirsak:

$$\begin{align}
\text{hash}(s[i \dots j]) \cdot p^i &= \sum_{k = i}^j s[k] \cdot p^k \mod m \\
&= \text{hash}(s[0 \dots j]) - \text{hash}(s[0 \dots i-1]) \mod m
\end{align}$$

Demak, $s$ satrning har bir prefiksi xeshini bilsak, shu formula orqali istalgan qism satr xeshini bevosita hisoblay olamiz.
Yagona muammo shundaki, $\text{hash}(s[0 \dots j]) - \text{hash}(s[0 \dots i-1])$ qiymatini $p^i$ ga bo‘la olishimiz kerak.
Buning uchun $p^i$ ning [modul bo‘yicha multiplikativ teskarisini](../algebra/module-inverse.md) topib, natijani shu teskari songa ko‘paytirish lozim.
Har bir $p^i$ uchun teskari qiymatni oldindan hisoblab qo‘yish mumkin; shunda $s$ ning istalgan qism satri xeshi $O(1)$ vaqtda topiladi.

Biroq bundan ham sodda usul bor.
Ko‘p hollarda qism satr xeshini aynan o‘zini hisoblash shart emas; xeshning $p$ ning biror darajasiga ko‘paytirilgan qiymati yetarli.
Faraz qilaylik, ikkita qism satr xeshidan biri $p^i$ ga, ikkinchisi $p^j$ ga ko‘paytirilgan.
Agar $i < j$ bo‘lsa, birinchi xeshni $p^{j-i}$ ga; aks holda ikkinchi xeshni $p^{i-j}$ ga ko‘paytiramiz.
Natijada ikkala xesh ham $p$ ning bir xil darajasiga — $i$ va $j$ ning maksimumiga — ko‘paytirilgan bo‘ladi va ularni hech qanday bo‘lishsiz oson taqqoslash mumkin.

## Xeshlashning qo‘llanishlari

Xeshlashning odatiy qo‘llanishlari:

* satr ichida andoza qidirish uchun $O(n)$ vaqtli [Rabin–Karp algoritmi](rabin-karp.md);
* satrdagi turli qism satrlar sonini $O(n^2)$ vaqtda hisoblash (quyiga qarang);
* palindrom qism satrlar sonini hisoblash.

### Satrdagi turli qism satrlar sonini aniqlash

Masala: faqat kichik ingliz harflaridan iborat, uzunligi $n$ bo‘lgan $s$ satr berilgan. Undagi turli qism satrlar sonini topish kerak.
Bu masalani yechish uchun qism satr uzunligi $l = 1 \dots n$ bo‘yicha yuramiz.
Har bir $l$ uchun uzunligi $l$ bo‘lgan barcha qism satrlarning bir xil $p$ darajasiga ko‘paytirilgan xeshlari massivini tuzamiz.
Massivdagi turli elementlar soni satrdagi uzunligi $l$ bo‘lgan turli qism satrlar soniga teng.
Bu sonni yakuniy javobga qo‘shamiz.

Qulaylik uchun $h[i]$ bilan $i$ ta belgidan iborat prefiks xeshini belgilaymiz va $h[0] = 0$ deb olamiz.

```{.cpp file=hashing_count_unique_substrings}
int count_unique_substrings(string const& s) {
    int n = s.size();

    const int p = 31;
    const int m = 1e9 + 9;
    vector<long long> p_pow(n);
    p_pow[0] = 1;
    for (int i = 1; i < n; i++)
        p_pow[i] = (p_pow[i-1] * p) % m;

    vector<long long> h(n + 1, 0);
    for (int i = 0; i < n; i++)
        h[i+1] = (h[i] + (s[i] - 'a' + 1) * p_pow[i]) % m;
    int cnt = 0;
    for (int l = 1; l <= n; l++) {
        unordered_set<long long> hs;
        for (int i = 0; i <= n - l; i++) {
            long long cur_h = (h[i + l] + m - h[i]) % m;
            cur_h = (cur_h * p_pow[n-i-1]) % m;
            hs.insert(cur_h);
        }
        cnt += hs.size();
    }
    return cnt;
}
```

Bu masala uchun $O(n^2)$ eng yaxshi mumkin bo‘lgan murakkablik emasligini e’tiborga oling.
$O(n \log n)$ yechim [suffiks massivlari](suffix-array.md) haqidagi maqolada tasvirlangan; [suffiks daraxti](./suffix-tree-ukkonen.md) yoki [suffiks avtomati](./suffix-automaton.md) yordamida esa uni $O(n)$ vaqtda ham hisoblash mumkin.

## Kolliziya ehtimolini kamaytirish

Ko‘pincha yuqoridagi polinomial xeshning o‘zi yetarli bo‘ladi va testlarda kolliziya yuz bermaydi.
Kolliziya ehtimoli atigi $\approx \frac{1}{m}$ ekanini eslang.
$m = 10^9 + 9$ uchun bu ehtimol $\approx 10^{-9}$ bo‘lib, juda kichik.
Ammo bu faqat bitta taqqoslash uchun.
Agar $s$ satrni $10^6$ ta turli satr bilan taqqoslasak-chi?
Kamida bitta kolliziya yuz berish ehtimoli endi $\approx 10^{-3}$ ga yetadi.
Agar $10^6$ ta turli satrni o‘zaro taqqoslasak (masalan, turli satrlar sonini sanasak), kamida bitta kolliziya ehtimoli allaqachon $\approx 1$ bo‘ladi.
Bunday masalada kolliziya yuz berib, noto‘g‘ri javob chiqishi deyarli muqarrar.

Ehtimolni yaxshilashning juda sodda usuli bor.
Har bir satr uchun ikkita turli xeshni (ikki xil $p$ va/yoki ikki xil $m$ bilan) hisoblab, alohida sonlar o‘rniga shu juftliklarni taqqoslaymiz.
Agar ikkala xesh funksiyada ham $m$ taxminan $10^9$ bo‘lsa, bu deyarli $m \approx 10^{18}$ bo‘lgan bitta xesh funksiyaga teng.
$10^6$ ta satrni o‘zaro taqqoslaganda, kamida bitta kolliziya ehtimoli endi $\approx 10^{-6}$ gacha kamayadi.

## Amaliy masalalar

* [Good Substrings - Codeforces](https://codeforces.com/contest/271/problem/D)
* [A Needle in the Haystack - SPOJ](http://www.spoj.com/problems/NHAY/)
* [String Hashing - Kattis](https://open.kattis.com/problems/hashing)
* [Double Profiles - Codeforces](http://codeforces.com/problemset/problem/154/C)
* [Password - Codeforces](http://codeforces.com/problemset/problem/126/B)
* [SUB_PROB - SPOJ](http://www.spoj.com/problems/SUB_PROB/)
* [INSQ15_A](https://www.codechef.com/problems/INSQ15_A)
* [SPOJ - Ada and Spring Cleaning](http://www.spoj.com/problems/ADACLEAN/)
* [GYM - Text Editor](http://codeforces.com/gym/101466/problem/E)
* [12012 - Detection of Extraterrestrial](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3163)
* [Codeforces - Games on a CD](http://codeforces.com/contest/727/problem/E)
* [UVA 11855 - Buzzwords](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2955)
* [Codeforces - Santa Claus and a Palindrome](http://codeforces.com/contest/752/problem/D)
* [Codeforces - String Compression](http://codeforces.com/contest/825/problem/F)
* [Codeforces - Palindromic Characteristics](http://codeforces.com/contest/835/problem/D)
* [SPOJ - Test](http://www.spoj.com/problems/CF25E/)
* [Codeforces - Palindrome Degree](http://codeforces.com/contest/7/problem/D)
* [Codeforces - Deletion of Repeats](http://codeforces.com/contest/19/problem/C)
* [HackerRank - Gift Boxes](https://www.hackerrank.com/contests/womens-codesprint-5/challenges/gift-boxes)

