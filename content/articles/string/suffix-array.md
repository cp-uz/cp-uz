---
article_id: string--suffix-array
---
# Suffikslar massivi

## Ta’rif

Uzunligi $n$ bo‘lgan $s$ satr berilgan bo‘lsin. $s$ satrning $i$-suffiksi deb $s[i \ldots n-1]$ ostsatriga aytiladi.

Suffikslar massivi berilgan satrning barcha suffikslari saralangandan keyin ularning boshlanish indekslarini ifodalovchi butun sonlardan iborat bo‘ladi.

Misol sifatida $s=abaab$ satrini ko‘raylik. Uning barcha suffikslari quyidagicha:

$$\begin{array}{ll}
0. & abaab \\
1. & baab \\
2. & aab \\
3. & ab \\
4. & b
\end{array}$$

Bu satrlarni saralaganimizdan so‘ng:

$$\begin{array}{ll}
2. & aab \\
3. & ab \\
0. & abaab \\
4. & b \\
1. & baab
\end{array}$$

Demak, $s$ uchun suffikslar massivi $(2,~3,~0,~4,~1)$ bo‘ladi.

Ma’lumotlar tuzilmasi sifatida suffikslar massivi ma’lumotlarni siqish, bioinformatika va umuman satrlar hamda satr qidiruvi bilan ishlaydigan sohalarda keng qo‘llanadi.

## Qurish

### $O(n^2\log n)$ usul

Bu eng sodda usuldir. Barcha suffikslarni hosil qilamiz, ularning dastlabki indekslarini saqlagan holda quicksort yoki mergesort yordamida saralaymiz. Saralash $O(n\log n)$ ta taqqoslash bajaradi, ikki satrni taqqoslash esa qo‘shimcha $O(n)$ vaqt oladi. Shuning uchun yakuniy murakkablik $O(n^2\log n)$ bo‘ladi.

### $O(n\log n)$ usul

Qat’iy aytganda, quyidagi algoritm suffikslarni emas, satrning siklik siljishlarini saralaydi. Biroq undan suffikslarni saralash algoritmini juda oson olish mumkin: satr oxiriga undagi barcha belgilardan kichik bo‘lgan ixtiyoriy belgi qo‘shish kifoya. Odatda `$` belgisi ishlatiladi. Shunda saralangan siklik siljishlar tartibi saralangan suffikslar tartibiga teng bo‘ladi. Buni $dabbb$ satri misolida ko‘rish mumkin:

$$\begin{array}{lll}
1. & abbb\$d & abbb \\
4. & b\$dabb & b \\
3. & bb\$dab & bb \\
2. & bbb\$da & bbb \\
0. & dabbb\$ & dabbb
\end{array}$$

Siklik siljishlarni saralayotganimiz sababli siklik ostsatrlarni ko‘ramiz. Hatto $i>j$ bo‘lganda ham $s[i\dots j]$ yozuvini ishlatamiz; bu holda aslida $s[i\dots n-1]+s[0\dots j]$ satri nazarda tutiladi. Bundan tashqari, barcha indekslar $|s|$ moduli bo‘yicha olinadi; yozuvni soddalashtirish uchun modul amali ko‘pincha ko‘rsatilmaydi.

Muhokama qilinayotgan algoritm $\lceil\log n\rceil+1$ ta iteratsiya bajaradi. $k$-iteratsiyada ($k=0\dots\lceil\log n\rceil$) uzunligi $2^k$ bo‘lgan $n$ ta siklik ostsatr saralanadi. $\lceil\log n\rceil$-iteratsiyadan keyin uzunligi $2^{\lceil\log n\rceil}\ge n$ bo‘lgan ostsatrlar saralangan bo‘ladi, bu esa barcha siklik siljishlarni saralashga teng.

Har bir iteratsiyada $p[0\dots n-1]$ permutatsiyasini saqlaymiz: $p[i]$ — saralangan tartibdagi $i$-ostsatrning boshlanish indeksi. Bundan tashqari, $c[0\dots n-1]$ massivini saqlaymiz; $c[i]$ $i$ dan boshlanuvchi ostsatr qaysi ekvivalentlik sinfiga tegishli ekanini bildiradi. Ayrim ostsatrlar bir xil bo‘lishi mumkin va algoritm ularga bir xil munosabatda bo‘lishi kerak. Qulaylik uchun sinflar noldan boshlab raqamlanadi.

$c[i]$ sonlari tartib haqidagi ma’lumotni ham saqlaydigan qilib beriladi: bir ostsatr ikkinchisidan kichik bo‘lsa, uning sinf raqami ham kichik bo‘ladi. Ekvivalentlik sinflari sonini `classes` o‘zgaruvchisida saqlaymiz.

Misol sifatida $s=aaba$ satrini ko‘raylik. Har bir iteratsiyadagi siklik ostsatrlar hamda ularga mos $p[]$ va $c[]$ massivlari:

$$\begin{array}{cccc}
0: & (a,~a,~b,~a) & p=(0,~1,~3,~2) & c=(0,~0,~1,~0)\\
1: & (aa,~ab,~ba,~aa) & p=(0,~3,~1,~2) & c=(0,~1,~2,~0)\\
2: & (aaba,~abaa,~baaa,~aaab) & p=(3,~0,~1,~2) & c=(1,~2,~3,~0)
\end{array}$$

$p[]$ qiymatlari yagona bo‘lmasligi mumkin. Masalan, $0$-iteratsiyada $p=(3,~1,~0,~2)$ yoki $p=(3,~0,~1,~2)$ ham bo‘lishi mumkin. Bu variantlarning barchasi ostsatrlarni saralangan tartibga keltiradi va shuning uchun to‘g‘ri. Biroq $c[]$ massivi qat’iy aniqlangan va unda noaniqlik bo‘lmaydi.

Endi implementatsiyaga o‘tamiz. Funksiya $s$ satrini qabul qilib, saralangan siklik siljishlar permutatsiyasini qaytaradi.

```cpp
vector<int> sort_cyclic_shifts(string const& s) {
    int n = s.size();
    const int alphabet = 256;
```

Boshlanishida, ya’ni $0$-iteratsiyada, uzunligi $1$ bo‘lgan siklik ostsatrlarni saralashimiz kerak. Bu barcha belgilarni saralash va ularni ekvivalentlik sinflariga ajratish demakdir; bir xil belgilar bir sinfga tushadi. Buni, masalan, counting sort bilan sodda bajarish mumkin. Har bir belgi satrda necha marta uchrashini sanaymiz va shu ma’lumot yordamida $p[]$ massivini quramiz.

Keyin $p[]$ bo‘ylab yurib, qo‘shni belgilarni taqqoslash orqali $c[]$ ni quramiz.

```cpp
    vector<int> p(n), c(n), cnt(max(alphabet, n), 0);
    for (int i = 0; i < n; i++)
        cnt[s[i]]++;
    for (int i = 1; i < alphabet; i++)
        cnt[i] += cnt[i-1];
    for (int i = 0; i < n; i++)
        p[--cnt[s[i]]] = i;
    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i < n; i++) {
        if (s[p[i]] != s[p[i-1]])
            classes++;
        c[p[i]] = classes - 1;
    }
```

Endi iteratsiya qadamini ko‘ramiz. $k-1$-qadam bajarilgan va shu qadam uchun $p[]$ hamda $c[]$ qiymatlari hisoblangan deb faraz qilamiz. $k$-qadam qiymatlarini $O(n)$ vaqtda hisoblashni istaymiz. Bu qadam $O(\log n)$ marta bajarilgani uchun butun algoritmning murakkabligi $O(n\log n)$ bo‘ladi.

Uzunligi $2^k$ bo‘lgan siklik ostsatr uzunligi $2^{k-1}$ bo‘lgan ikkita ostsatrdan tashkil topadi. Oldingi bosqichdagi $c[]$ ekvivalentlik sinflari yordamida bunday qismlarni $O(1)$ da taqqoslash mumkin. Demak, $i$ va $j$ pozitsiyalardan boshlanuvchi uzunligi $2^k$ bo‘lgan ostsatrlarni taqqoslash uchun zarur barcha ma’lumot mos ravishda
$(c[i],~c[i+2^{k-1}])$ va $(c[j],~c[j+2^{k-1}])$ juftliklarida saqlanadi.

$$\dots \overbrace{\underbrace{s_i\dots s_{i+2^{k-1}-1}}_{\text{uzunlik}=2^{k-1},~\text{sinf}=c[i]}\quad
\underbrace{s_{i+2^{k-1}}\dots s_{i+2^k-1}}_{\text{uzunlik}=2^{k-1},~\text{sinf}=c[i+2^{k-1}]}}^{\text{uzunlik}=2^k}\dots$$

Shuning uchun sodda yechim — uzunligi $2^k$ bo‘lgan ostsatrlarni shu sonlar juftligi bo‘yicha saralash. Bu kerakli $p[]$ tartibini beradi. Biroq odatiy saralash $O(n\log n)$ vaqt oladi va natijada suffikslar massivini $O(n\log^2 n)$ da quradigan algoritm hosil bo‘ladi.

Juftliklarni tez qanday saralaymiz? Ularning elementlari $n$ dan oshmaydi, shuning uchun yana counting sort ishlatish mumkin. Ammo juftliklarni counting sort bilan bevosita saralash eng samarali variant emas. Yashirin konstantani yaxshilash uchun radix sort asosidagi usuldan foydalanamiz.

Avval juftliklarni ikkinchi element, keyin birinchi element bo‘yicha barqaror saralash kerak. Lekin ikkinchi elementlar oldingi iteratsiyada allaqachon saralangan. Demak, juftliklarni ikkinchi element bo‘yicha tartiblash uchun $p[]$ dagi har bir indeksdan $2^{k-1}$ ni ayirish kifoya. Masalan, uzunligi $2^{k-1}$ bo‘lgan eng kichik ostsatr $i$ dan boshlansa, ikkinchi yarmi shu ostsatr bo‘lgan uzunligi $2^k$ ostsatr $i-2^{k-1}$ dan boshlanadi.

Shunday qilib, oddiy ayirishlar bilan juftliklarning ikkinchi elementlari bo‘yicha tartibni olamiz. Endi birinchi element bo‘yicha barqaror saralash qoladi; uni counting sort bajaradi.

Oxirida $c[]$ ekvivalentlik sinflarini qayta hisoblash kerak. Avvalgidek, saralangan $p[]$ permutatsiyasi bo‘ylab yurib, qo‘shni juftliklarni taqqoslash yetarli.

Quyida implementatsiyaning qolgan qismi. `pn[]` va `cn[]` vaqtinchalik massivlari mos ravishda ikkinchi element bo‘yicha permutatsiyani va yangi ekvivalentlik sinflarini saqlaydi.

```cpp
    vector<int> pn(n), cn(n);
    for (int h = 0; (1 << h) < n; ++h) {
        for (int i = 0; i < n; i++) {
            pn[i] = p[i] - (1 << h);
            if (pn[i] < 0)
                pn[i] += n;
        }
        fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int i = 0; i < n; i++)
            cnt[c[pn[i]]]++;
        for (int i = 1; i < classes; i++)
            cnt[i] += cnt[i-1];
        for (int i = n-1; i >= 0; i--)
            p[--cnt[c[pn[i]]]] = pn[i];
        cn[p[0]] = 0;
        classes = 1;
        for (int i = 1; i < n; i++) {
            pair<int, int> cur = {c[p[i]], c[(p[i] + (1 << h)) % n]};
            pair<int, int> prev = {c[p[i-1]], c[(p[i-1] + (1 << h)) % n]};
            if (cur != prev)
                ++classes;
            cn[p[i]] = classes - 1;
        }
        c.swap(cn);
    }
    return p;
}
```

Algoritm $O(n\log n)$ vaqt va $O(n)$ xotira talab qiladi. Soddalik uchun alifbo sifatida to‘liq ASCII diapazoni ishlatildi.

Agar satr faqat ma’lum belgilar to‘plamidan, masalan, kichik lotin harflaridan iboratligi ma’lum bo‘lsa, implementatsiyani optimallashtirish mumkin. Biroq yutuq odatda kichik bo‘ladi, chunki alifbo o‘lchami faqat birinchi iteratsiyada ahamiyatli. Keyingi iteratsiyalar ekvivalentlik sinflari soniga bog‘liq; hatto boshlang‘ich alifbo atigi ikkita belgidan iborat bo‘lsa ham, sinflar soni tezda $O(n)$ ga yetishi mumkin.

Bu algoritm faqat siklik siljishlarni saralashini ham unutmang. Bo‘lim boshida aytilganidek, satrdagi barcha belgilardan kichik belgi qo‘shib, hosil bo‘lgan satrning siklik siljishlarini saralash orqali suffikslarning saralangan tartibini olamiz. Masalan, `s+$` satrini saralash $s$ ning suffikslar massivini beradi, faqat uning boshida $|s|$ indeksi turadi.

```cpp
vector<int> suffix_array_construction(string s) {
    s += "$";
    vector<int> sorted_shifts = sort_cyclic_shifts(s);
    sorted_shifts.erase(sorted_shifts.begin());
    return sorted_shifts;
}
```

## Qo‘llanishlar

### Eng kichik siklik siljishni topish

Yuqoridagi algoritm satr oxiriga belgi qo‘shmasdan barcha siklik siljishlarni saralaydi. Shuning uchun $p[0]$ eng kichik siklik siljishning boshlanish pozitsiyasini beradi.

### Satr ichidan ostsatrni topish

Matn $t$ oldindan ma’lum, qidiriladigan $s$ satr esa so‘rov vaqtida beriladigan holatni ko‘raylik. $t$ uchun suffikslar massivini $O(|t|\log|t|)$ vaqtda quramiz. $s$ ning har qanday uchrashi $t$ ning biror suffiksining prefiksi bo‘lishi kerak. Suffikslar saralanganligi uchun $p$ massivida $s$ bo‘yicha binary search bajarish mumkin.

Binary search davomida joriy suffiksni $s$ bilan taqqoslash $O(|s|)$ vaqt oladi, demak qidiruv murakkabligi $O(|s|\log|t|)$ bo‘ladi. Agar $s$ matnda bir necha marta uchrasa, bu uchrashlarning barchasi $p$ da ketma-ket joylashadi. Ikkinchi binary search bilan uchrashlar sonini, so‘ng ularning barcha pozitsiyalarini topish mumkin.

### Bir satrning ikkita ostsatrini taqqoslash

Berilgan $s$ satrning bir xil uzunlikdagi ikkita ostsatrini $O(1)$ vaqtda, ya’ni birinchisi ikkinchisidan kichikmi-yo‘qmi, taqqoslashni istaymiz.

Buning uchun suffikslar massivini $O(|s|\log|s|)$ vaqtda qurib, har bir iteratsiyadagi oraliq $c[]$ ekvivalentlik sinflarini saqlab qolamiz.

Uzunligi ikkilik daraja bo‘lgan ikkita ostsatrni $O(1)$ da taqqoslash uchun ularning ekvivalentlik sinflarini solishtirish kifoya. Endi bu usulni ixtiyoriy uzunlikdagi ostsatrlarga umumlashtiramiz.

Boshlanish indekslari $i$ va $j$, uzunligi $l$ bo‘lgan ikkita ostsatrni taqqoslaylik. $2^k\le l$ bo‘ladigan eng katta $k$ ni topamiz. Ikki ostsatrni taqqoslashni uzunligi $2^k$ bo‘lgan ikkita ustma-ust tushuvchi blok juftligini taqqoslashga almashtirish mumkin: avval $i$ va $j$ dan boshlanuvchi bloklar, ular teng bo‘lsa, $i+l-1$ va $j+l-1$ pozitsiyalarda tugaydigan bloklar solishtiriladi.

Taqqoslash implementatsiyasi quyidagicha. Funksiyaga oldindan hisoblangan $k$ beriladi. $k=\lfloor\log l\rfloor$ orqali topilishi mumkin, lekin barcha $l$ lar uchun logarifmlarni oldindan hisoblash samaraliroq. Xuddi shu g‘oya [Sparse Table](../data_structures/sparse-table.md) maqolasida ham ishlatiladi.

```cpp
int compare(int i, int j, int l, int k) {
    pair<int, int> a = {c[k][i], c[k][(i+l-(1 << k))%n]};
    pair<int, int> b = {c[k][j], c[k][(j+l-(1 << k))%n]};
    return a == b ? 0 : a < b ? -1 : 1;
}
```

### Qo‘shimcha xotira bilan ikkita suffiksning eng uzun umumiy prefiksi

Berilgan $s$ satrda $i$ va $j$ pozitsiyalardan boshlanuvchi ikkita ixtiyoriy suffiksning eng uzun umumiy prefiksini — LCP ni hisoblashni istaymiz.

Bu usul $O(|s|\log|s|)$ qo‘shimcha xotira ishlatadi. Faqat chiziqli xotira talab qiladigan mutlaqo boshqa usul keyingi bo‘limda bayon qilinadi.

Suffikslar massivini $O(|s|\log|s|)$ vaqtda quramiz va har bir iteratsiyadagi $c[]$ massivlarini saqlab qolamiz.

$i$ va $j$ dan boshlanuvchi suffikslarning LCP sini hisoblaymiz. Uzunligi ikkilik daraja bo‘lgan ikkita ostsatrni $O(1)$ da taqqoslay olamiz. Ikkilik darajalarni kattasidan kichigiga qarab tekshiramiz; agar joriy uzunlikdagi ostsatrlar teng bo‘lsa, shu uzunlikni javobga qo‘shamiz va teng qismning o‘ngidan davom etamiz, ya’ni $i$ hamda $j$ ga joriy ikkilik darajani qo‘shamiz.

```cpp
int lcp(int i, int j) {
    int ans = 0;
    for (int k = log_n; k >= 0; k--) {
        if (c[k][i % n] == c[k][j % n]) {
            ans += 1 << k;
            i += 1 << k;
            j += 1 << k;
        }
    }
    return ans;
}
```

Bu yerda `log_n` — $n$ ning ikkilik logarifmi pastga yaxlitlangan qiymatiga teng konstanta.

### Qo‘shimcha xotirasiz ikkita suffiksning eng uzun umumiy prefiksi

Vazifa avvalgi bo‘limdagidek: $s$ satrning ikkita suffiksi uchun LCP ni hisoblash kerak.

Bu safar faqat $O(|s|)$ xotira ishlatiladi. Preprocessing natijasi satr haqida o‘zi ham muhim ma’lumot saqlovchi massiv bo‘ladi. LCP so‘rovlari shu massivdagi RMQ so‘rovlari orqali javoblanadi; turli RMQ implementatsiyalari bilan logarifmik yoki hatto o‘zgarmas so‘rov vaqtiga erishish mumkin.

Algoritmning asosi quyidagi g‘oya: saralangan tartibdagi har bir qo‘shni suffiks juftligining LCP sini hisoblaymiz. Ya’ni $\text{lcp}[0\dots n-2]$ massivini quramiz, bunda $\text{lcp}[i]$ $p[i]$ va $p[i+1]$ pozitsiyalardan boshlanuvchi suffikslarning eng uzun umumiy prefiksi uzunligidir. Bu massiv qo‘shni suffikslar uchun javobni beradi.

Ixtiyoriy, qo‘shni bo‘lishi shart bo‘lmagan ikkita suffiks uchun javob ham shu massivdan olinadi. $p[i]$ va $p[j]$ suffikslarining LCP si

$$\min(\text{lcp}[i],~\text{lcp}[i+1],~\dots,~\text{lcp}[j-1])$$

ga teng.

Demak, `lcp` massivi qurilgach, masala turli murakkablikdagi ko‘plab yechimlari mavjud bo‘lgan [RMQ](../sequences/rmq.md) masalasiga keladi.

Asosiy vazifa `lcp` massivini qurishdir. Buning uchun massivni $O(n)$ vaqtda hisoblaydigan Kasai algoritmidan foydalanamiz.

Saralangan tartibdagi ikkita qo‘shni suffiksning boshlanish pozitsiyalari $i$ va $j$, ularning LCP si esa $k>0$ bo‘lsin. Har ikki suffiksning birinchi belgisini olib tashlasak, ya’ni $i+1$ va $j+1$ suffikslarini olsak, ularning umumiy prefiksi kamida $k-1$ bo‘ladi. Bu qiymatni `lcp` massiviga darhol yoza olmaymiz, chunki yangi suffikslar saralangan tartibda qo‘shni bo‘lmasligi mumkin.

$i+1$ suffiksi $j+1$ suffiksidan kichik bo‘ladi, ammo ularning orasida boshqa suffikslar bo‘lishi mumkin. Ikki suffiksning LCP si ular orasidagi barcha qo‘shni o‘tishlar minimumiga teng bo‘lgani uchun, shu oraliqdagi har bir qo‘shni juftlik LCP si kamida $k-1$ bo‘ladi; $i+1$ bilan undan keyingi suffiks uchun qiymat bundan kattaroq ham bo‘lishi mumkin.

Endi algoritmni yozish mumkin. Suffikslarni uzunligi kamayib boradigan tartibda, ya’ni boshlanish indeksi $i=0,1,\dots$ bo‘yicha ko‘ramiz. $i$ suffiksidan $i+1$ suffiksiga o‘tish birinchi belgini olib tashlashga teng bo‘lgani uchun oldingi $k$ qiymatini qayta ishlata olamiz. Bundan tashqari, har bir suffiksning saralangan ro‘yxatdagi pozitsiyasini beruvchi `rank` massivi kerak bo‘ladi.

```cpp
vector<int> lcp_construction(string const& s, vector<int> const& p) {
    int n = s.size();
    vector<int> rank(n, 0);
    for (int i = 0; i < n; i++)
        rank[p[i]] = i;

    int k = 0;
    vector<int> lcp(n-1, 0);
    for (int i = 0; i < n; i++) {
        if (rank[i] == n - 1) {
            k = 0;
            continue;
        }
        int j = p[rank[i] + 1];
        while (i + k < n && j + k < n && s[i+k] == s[j+k])
            k++;
        lcp[rank[i]] = k;
        if (k)
            k--;
    }
    return lcp;
}
```

Har iteratsiyada $k$ ko‘pi bilan bir marta kamayadi (`rank[i]==n-1` holatida u to‘g‘ridan-to‘g‘ri nolga tushiriladi), demak jami $O(n)$ marta kamayadi. Ikki satr LCP si ko‘pi bilan $n-1$ bo‘lgani sababli $k$ jami faqat $O(n)$ marta oshadi. Shuning uchun algoritm $O(n)$ vaqtda ishlaydi.

### Turli ostsatrlar soni

$s$ satr uchun suffikslar massivi va LCP massivini oldindan hisoblaymiz. Shu ma’lumot yordamida satrdagi turli ostsatrlar sonini topish mumkin.

$p[0]$, keyin $p[1]$ va hokazo pozitsiyalardan boshlanuvchi qaysi prefikslar yangi ostsatr berishini ko‘ramiz. Suffikslarni saralangan tartibda olganimiz uchun hech bir ostsatr e’tibordan chetda qolmaydi.

Suffikslar saralanganligi sababli joriy $p[i]$ suffiksi uning $p[i-1]$ suffiksi bilan umumiy bo‘lgan prefikslaridan tashqari barcha prefikslari orqali yangi ostsatr beradi. Ya’ni dastlabki $\text{lcp}[i-1]$ ta prefiks yangi emas. Joriy suffiks uzunligi $n-p[i]$ bo‘lgani uchun $p[i]$ da $n-p[i]-\text{lcp}[i-1]$ ta yangi ostsatr boshlanadi. Barcha suffikslar bo‘yicha yig‘ib:

$$\sum_{i=0}^{n-1}(n-p[i])-\sum_{i=0}^{n-2}\text{lcp}[i]
=\frac{n^2+n}{2}-\sum_{i=0}^{n-2}\text{lcp}[i]$$

natijani olamiz.

## Amaliy masalalar

* [UVA 760 - DNA Sequencing](https://onlinejudge.org/external/7/760.html)
* [UVA 1223 - Editor](https://onlinejudge.org/external/12/1223.html)
* [CodeChef - Tandem](https://www.codechef.com/problems/TANDEM)
* [CodeChef - Substrings and Repetitions](https://www.codechef.com/problems/ANUSAR)
* [CodeChef - Entangled Strings](https://www.codechef.com/problems/TANGLED)
* [Codeforces - Martian Strings](https://codeforces.com/problemset/problem/149/E)
* [Codeforces - Little Elephant and Strings](https://codeforces.com/problemset/problem/204/E)
* [SPOJ - Ada and Terramorphing](https://www.spoj.com/problems/ADAPHOTO/)
* [SPOJ - Ada and Substring](https://www.spoj.com/problems/ADASTRNG/)
* [UVA 1227 - The longest constant gene](https://onlinejudge.org/external/12/1227.html)
* [SPOJ - Longest Common Substring](https://www.spoj.com/problems/LCS/)
* [UVA 11512 - GATTACA](https://onlinejudge.org/external/115/11512.html)
* [LA 7502 - Suffixes and Palindromes](https://vjudge.net/problem/UVALive-7502)
* [GYM - Por Costel and the Censorship Committee](https://codeforces.com/gym/100923/problem/J)
* [UVA 1254 - Top 10](https://onlinejudge.org/external/12/1254.html)
* [UVA 12191 - File Recover](https://onlinejudge.org/external/121/12191.html)
* [UVA 12206 - Stammering Aliens](https://onlinejudge.org/external/122/12206.html)
* [CodeChef - Jarvis and LCP](https://www.codechef.com/problems/INSQ16F)
* [LA 3943 - Liking's Letter](https://vjudge.net/problem/UVALive-3943)
* [UVA 11107 - Life Forms](https://onlinejudge.org/external/111/11107.html)
* [UVA 12974 - Exquisite Strings](https://onlinejudge.org/external/129/12974.html)
* [UVA 10526 - Intellectual Property](https://onlinejudge.org/external/105/10526.html)
* [UVA 12338 - Anti-Rhyme Pairs](https://onlinejudge.org/external/123/12338.html)
* [SPOJ - Suffix Array](https://www.spoj.com/problems/SARRAY/)
* [LA 4513 - Stammering Aliens](https://vjudge.net/problem/UVALive-4513)
* [SPOJ - LCS2](https://www.spoj.com/problems/LCS2/)
* [Codeforces - Fake News (hard)](https://codeforces.com/problemset/problem/802/I)
* [SPOJ - Longest Common Substring](https://www.spoj.com/problems/LCS0/)
* [SPOJ - Lexicographical Substring Search](https://www.spoj.com/problems/SUBLEX/)
* [Codeforces - Forbidden Indices](https://codeforces.com/problemset/problem/873/F)
* [Codeforces - Tricky and Clever Password](https://codeforces.com/problemset/problem/30/E)
* [LA 6856 - Circle of digits](https://vjudge.net/problem/UVALive-6856)

