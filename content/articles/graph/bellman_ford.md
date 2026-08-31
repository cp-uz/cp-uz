---
article_id: graph--bellman_ford
---
# Bellman–Ford algoritmi

**Manfiy og‘irlikli qirralar mavjud bo‘lganda bitta boshlang‘ich tugundan eng qisqa yo‘llar**

Faraz qilaylik, bizga $n$ ta tugun va $m$ ta qirraga ega og‘irlikli yo‘naltirilgan $G$ grafi hamda biror belgilangan $v$ tugun berilgan. $v$ tugundan qolgan har bir tugungacha bo‘lgan eng qisqa yo‘llar uzunligini topish talab qilinadi.

Dijkstra algoritmidan farqli ravishda, bu algoritmni manfiy og‘irlikli qirralari bor graflarga ham qo‘llash mumkin. Biroq grafda manfiy sikl mavjud bo‘lsa, ayrim tugunlargacha eng qisqa yo‘l mavjud bo‘lmasligi aniq (chunki eng qisqa yo‘l og‘irligi minus cheksizlikka teng bo‘lishi kerak); shunga qaramay, algoritmni manfiy og‘irlikli sikl mavjudligini bildirish yoki hatto ushbu siklni tiklash uchun o‘zgartirish mumkin.

Algoritm ikki amerikalik olim — Richard Bellman va Lester Ford nomi bilan atalgan. Aslida Ford bu algoritmni 1956-yilda boshqa bir matematik masalani o‘rganish jarayonida ixtiro qilgan; o‘sha masala oxir-oqibat grafdagi eng qisqa yo‘llarni topish qismmasalasiga keltirilgan va Ford uni yechish algoritmining umumiy ko‘rinishini bergan.

Bellman esa 1958-yilda aynan eng qisqa yo‘lni topish masalasiga bag‘ishlangan maqola chop etgan va unda algoritmni hozir biz biladigan ko‘rinishda aniq ifodalagan.

## Algoritm tavsifi

Grafda manfiy og‘irlikli sikl yo‘q deb faraz qilamiz. Manfiy og‘irlikli sikl mavjud bo‘lgan holat quyida alohida bo‘limda ko‘rib chiqiladi.

$d[0 \ldots n-1]$ masofalar massivini yaratamiz; algoritm bajarilgach, unda masalaning javobi saqlanadi. Dastlab uni quyidagicha to‘ldiramiz: $d[v] = 0$, qolgan barcha $d[ ]$ elementlari esa cheksizlikka — $\infty$ ga teng bo‘ladi.

Algoritm bir necha fazadan iborat. Har bir fazada grafning barcha qirralari ko‘rib chiqiladi va algoritm og‘irligi $c$ bo‘lgan har bir $(a,b)$ qirra bo‘yicha **relaksatsiya** bajarishga urinadi. Qirra bo‘yicha relaksatsiya — $d[b]$ qiymatini $d[a] + c$ yordamida yaxshilashga urinishdir. Aslida bu $(a,b)$ qirradan va $a$ tugun uchun joriy javobdan foydalanib, $b$ tugun uchun javobni yaxshilashga urinayotganimizni anglatadi.

Grafda manfiy og‘irlikli sikllar yo‘q deb hisoblaganimizda, eng qisqa yo‘llarning barcha uzunliklarini to‘g‘ri hisoblash uchun algoritmning $n-1$ ta fazasi yetarli bo‘lishi ta’kidlanadi. Yetib borib bo‘lmaydigan tugunlar uchun $d[ ]$ masofa $\infty$ ga tengligicha qoladi.

## Implementatsiya

Ko‘plab boshqa graf algoritmlaridan farqli ravishda, Bellman–Ford algoritmi uchun grafni $n$ ta qirralar ro‘yxati (har bir tugundan chiquvchi qirralar ro‘yxati) yordamida emas, balki barcha qirralarning bitta umumiy ro‘yxati orqali ifodalash qulayroq. Implementatsiyani qirralarni ifodalovchi $\rm edge$ tuzilmasidan boshlaymiz. Algoritm kirishida $n$, $m$ sonlari, qirralarning $e$ ro‘yxati va boshlang‘ich $v$ tugun beriladi. Barcha tugunlar $0$ dan $n - 1$ gacha raqamlangan.

### Eng sodda implementatsiya

$\rm INF$ o‘zgarmasi “cheksizlik” sonini bildiradi — u barcha mumkin bo‘lgan yo‘l uzunliklaridan kattaroq bo‘ladigan qilib tanlanishi kerak.

```cpp
struct Edge {
    int a, b, cost;
};

int n, m, v;
vector<Edge> edges;
const int INF = 1000000000;
void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    for (int i = 0; i < n - 1; ++i)
        for (Edge e : edges)
            if (d[e.a] < INF)
                d[e.b] = min(d[e.b], d[e.a] + e.cost);
    // display d, for example, on the screen
}
```

`if (d[e.a] < INF)` tekshiruvi faqat grafda manfiy og‘irlikli qirralar mavjud bo‘lsa kerak bo‘ladi: bunday tekshiruvsiz hali yo‘l topilmagan tugunlardan ham relaksatsiya bajarilib, $\infty - 1$, $\infty - 2$ va hokazo ko‘rinishdagi noto‘g‘ri masofalar hosil bo‘lishi mumkin.

### Yaxshiroq implementatsiya

Bu algoritmni biroz tezlashtirish mumkin: ko‘pincha javobni bir necha fazadayoq olamiz, qolgan fazalarda esa foydali ish bajarilmaydi va barcha qirralarni bekorga ko‘rib chiqamiz. Shuning uchun joriy fazada biror qiymat o‘zgargan-o‘zgarmaganini bildiruvchi bayroq saqlaymiz; agar biror fazada hech narsa o‘zgarmasa, algoritmni to‘xtatish mumkin.

(Bu optimallashtirish asimptotik murakkablikni yaxshilamaydi, ya’ni ayrim graflarda baribir barcha $n-1$ faza kerak bo‘ladi, ammo algoritmning “o‘rtacha”, ya’ni tasodifiy graflardagi ishlashini sezilarli tezlashtiradi.)

Bu optimallashtirish bilan algoritm fazalari sonini qo‘lda $n-1$ bilan chegaralashning odatda hojati yo‘q — algoritm kerakli fazalar sonidan keyin o‘zi to‘xtaydi.

```cpp
void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    for (;;) {
        bool any = false;

        for (Edge e : edges)
            if (d[e.a] < INF)
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = d[e.a] + e.cost;
                    any = true;
                }
        if (!any)
            break;
    }
    // display d, for example, on the screen
}
```

### Yo‘lni tiklash

Endi algoritmni nafaqat eng qisqa yo‘llar uzunligini topadigan, balki eng qisqa yo‘llarning o‘zini ham tiklaydigan qilib qanday o‘zgartirish mumkinligini ko‘rib chiqamiz.

Buning uchun yana bir $p[0 \ldots n-1]$ massivini yaratamiz; unda har bir tugun uchun uning “ajdodi”, ya’ni shu tugunga olib keluvchi eng qisqa yo‘ldagi oxiridan oldingi tugun saqlanadi. Aslida istalgan $a$ tugungacha eng qisqa yo‘l — bu biror $p[a]$ tugungacha eng qisqa yo‘lning oxiriga $a$ tugunini qo‘shishdan hosil bo‘ladi.

Algoritmning mantiqi ham xuddi shunday: u bir tugungacha eng qisqa masofa allaqachon hisoblangan deb olib, shu tugundan boshqa tugunlargacha eng qisqa masofalarni yaxshilashga urinadi. Shuning uchun yaxshilash vaqtida $p[ ]$ ni, ya’ni yaxshilash qaysi tugundan sodir bo‘lganini eslab qolish kifoya.

Quyida berilgan $t$ tugungacha eng qisqa yo‘lni tiklaydigan Bellman–Ford implementatsiyasi keltirilgan:

```cpp
void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    vector<int> p(n, -1);

    for (;;) {
        bool any = false;
        for (Edge e : edges)
            if (d[e.a] < INF)
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = d[e.a] + e.cost;
                    p[e.b] = e.a;
                    any = true;
                }
        if (!any)
            break;
    }
    if (d[t] == INF)
        cout << "No path from " << v << " to " << t << ".";
    else {
        vector<int> path;
        for (int cur = t; cur != -1; cur = p[cur])
            path.push_back(cur);
        reverse(path.begin(), path.end());

        cout << "Path from " << v << " to " << t << ": ";
        for (int u : path)
            cout << u << ' ';
    }
}
```

Bu yerda $t$ tugundan boshlab, ajdodi bo‘lmagan boshlang‘ich tugunga yetguncha ajdodlar bo‘yicha yuramiz va yo‘ldagi barcha tugunlarni $\rm path$ ro‘yxatiga saqlaymiz. Ushbu ro‘yxat $v$ dan $t$ gacha eng qisqa yo‘lni teskari tartibda ifodalaydi, shuning uchun $\rm path$ ustida $\rm reverse()$ funksiyasini chaqirib, keyin yo‘lni chiqaramiz.

## Algoritmning isboti

Avvalo, yetib borib bo‘lmaydigan barcha $u$ tugunlar uchun algoritm to‘g‘ri ishlashiga e’tibor bering: $d[u]$ belgisi cheksizlikka tengligicha qoladi (chunki Bellman–Ford algoritmi boshlang‘ich $v$ tugundan yetib borish mumkin bo‘lgan barcha tugunlargacha biror yo‘l topadi, qolgan tugunlar uchun esa relaksatsiya hech qachon bajarilmaydi).

Endi quyidagi tasdiqni isbotlaymiz: $i$-faza bajarilgach, Bellman–Ford algoritmi qirralari soni $i$ dan oshmaydigan barcha eng qisqa yo‘llarni to‘g‘ri topadi.

Boshqacha aytganda, istalgan $a$ tugun uchun unga olib boruvchi eng qisqa yo‘ldagi qirralar sonini $k$ deb belgilaylik (bunday yo‘llar bir nechta bo‘lsa, ulardan istalganini olish mumkin). Ushbu tasdiqqa ko‘ra, algoritm $k$-faza tugagach, $a$ tugun uchun eng qisqa yo‘l topilishini kafolatlaydi.

**Isbot**:

Boshlang‘ich $v$ tugundan yo‘l mavjud bo‘lgan ixtiyoriy $a$ tugunni hamda unga olib boruvchi $(p_0=v, p_1, \ldots, p_k=a)$ eng qisqa yo‘lni ko‘rib chiqamiz. Birinchi fazadan oldin $p_0 = v$ tugungacha eng qisqa yo‘l to‘g‘ri topilgan. Birinchi faza davomida algoritm $(p_0,p_1)$ qirrani tekshiradi, demak birinchi fazadan so‘ng $p_1$ tugungacha masofa to‘g‘ri hisoblangan bo‘ladi.

Ushbu mulohazani $k$ marta takrorlasak, $k$-faza tugagach $p_k = a$ tugungacha masofa to‘g‘ri hisoblanishini ko‘ramiz; isbotlash talab qilingan narsa ham shu edi.

Nihoyat, istalgan eng qisqa yo‘l $n - 1$ tadan ortiq qirraga ega bo‘la olmasligini qayd etish kerak. Demak, algoritmning $(n-1)$-fazagacha ishlashi yetarli. Shundan keyin hech qanday relaksatsiya biror tugungacha masofani yaxshilay olmasligi kafolatlanadi.

## Manfiy sikl mavjud bo‘lgan holat

Yuqorida hamma joyda grafda manfiy sikl yo‘q deb hisobladik (aniqrog‘i, bizni boshlang‘ich $v$ tugundan yetib borish mumkin bo‘lgan manfiy sikl qiziqtiradi; yetib borib bo‘lmaydigan sikllar yuqoridagi algoritm ishiga ta’sir qilmaydi).

Manfiy sikl yoki sikllar mavjud bo‘lsa, ushbu sikldagi barcha tugunlargacha, shuningdek bu sikldan yetib borish mumkin bo‘lgan tugunlargacha masofalar aniqlanmagan bo‘ladi — ular minus cheksizlikka $(- \infty)$ teng deb olinishi kerak.

Bellman–Ford algoritmi bu siklning barcha tugunlari hamda undan yetib borish mumkin bo‘lgan tugunlar orasida relaksatsiyani cheksiz davom ettira olishini ko‘rish oson. Shu sababli fazalar sonini $n - 1$ bilan chegaralamasangiz, algoritm ushbu tugunlardan masofalarni doimiy yaxshilab, abadiy ishlaydi.

Shundan **boshlang‘ich $v$ tugundan yetib boriladigan manfiy og‘irlikli sikl mavjudligining mezoni** kelib chiqadi: $(n-1)$-faza tugagach algoritmni yana bitta faza ishlatsak va unda kamida bitta relaksatsiya bajarilsa, grafda $v$ dan yetib boriladigan manfiy og‘irlikli sikl mavjud; aks holda bunday sikl yo‘q.

Bundan tashqari, shunday sikl topilsa, Bellman–Ford algoritmini siklni undagi tugunlar ketma-ketligi sifatida tiklaydigan qilib o‘zgartirish mumkin. Buning uchun $n$-fazada relaksatsiya qilingan oxirgi $x$ tugunni eslab qolish yetarli. Bu tugun manfiy og‘irlikli siklning o‘zida yotadi yoki undan yetib borish mumkin bo‘ladi. Manfiy siklda yotishi kafolatlangan tugunga yetish uchun $x$ tugundan boshlab ajdodlar bo‘yicha $n$ marta o‘tamiz.

Shu tariqa, manfiy siklda yotishi kafolatlangan $y$ tugunga kelamiz. Endi shu tugundan ajdodlar bo‘yicha yurib, yana ayni $y$ tugunga qaytguncha davom etamiz (bu albatta sodir bo‘ladi, chunki manfiy og‘irlikli sikldagi relaksatsiyalar aylana bo‘ylab yuz beradi).

### Implementatsiya:

```cpp
void solve()
{
    vector<int> d(n, INF);
    d[v] = 0;
    vector<int> p(n, -1);
    int x;
    for (int i = 0; i < n; ++i) {
        x = -1;
        for (Edge e : edges)
            if (d[e.a] < INF)
                if (d[e.b] > d[e.a] + e.cost) {
                    d[e.b] = max(-INF, d[e.a] + e.cost);
                    p[e.b] = e.a;
                    x = e.b;
                }
    }
    if (x == -1)
        cout << "No negative cycle from " << v;
    else {
        int y = x;
        for (int i = 0; i < n; ++i)
            y = p[y];

        vector<int> path;
        for (int cur = y;; cur = p[cur]) {
            path.push_back(cur);
            if (cur == y && path.size() > 1)
                break;
        }
        reverse(path.begin(), path.end());

        cout << "Negative cycle: ";
        for (int u : path)
            cout << u << ' ';
    }
}
```

Manfiy sikl mavjudligi sababli algoritmning $n$ iteratsiyasi davomida masofalar juda katta manfiy qiymatlarga (bu yerda $W$ — grafdagi istalgan qirra og‘irligining maksimal absolut qiymati bo‘lsa, $-n m W$ tartibidagi manfiy sonlargacha) tushib ketishi mumkin. Shu bois kodda butun son toshib ketishiga qarshi quyidagi qo‘shimcha chorani qo‘lladik:

```cpp
d[e.b] = max(-INF, d[e.a] + e.cost);
```

Yuqoridagi implementatsiya biror boshlang‘ich $v$ tugundan yetib boriladigan manfiy siklni qidiradi; biroq algoritmni grafdagi istalgan manfiy siklni qidiradigan qilib o‘zgartirish mumkin. Buning uchun barcha $d[i]$ masofalarni cheksizlikka emas, nolga tenglash kerak — xuddi bir vaqtning o‘zida barcha tugunlardan eng qisqa yo‘llarni qidirayotgandek; bu o‘zgartirish manfiy siklni aniqlashning to‘g‘riligiga ta’sir qilmaydi.

Bu mavzu haqida batafsil ma’lumot uchun alohida [Grafda manfiy siklni topish](finding-negative-cycle-in-graph.md) maqolasiga qarang.

## Shortest Path Faster Algorithm (SPFA)

SPFA — Bellman–Ford algoritmining barcha relaksatsiya urinishlari ham muvaffaqiyatli bo‘lavermasligidan foydalanadigan yaxshilangan ko‘rinishi.

Asosiy g‘oya — relaksatsiya qilingan, ammo hali qo‘shnilarini relaksatsiya qilishi mumkin bo‘lgan tugunlargina saqlanadigan navbat yaratishdir.

Biror qo‘shnini relaksatsiya qila olganingizda, uni navbatga qo‘shish kerak. Bellman–Ford kabi bu algoritmdan ham manfiy sikllarni aniqlash uchun foydalanish mumkin.

Algoritmning eng yomon holatdagi murakkabligi Bellman–Fordniki kabi $O(n m)$, ammo amalda u ancha tez ishlaydi va [ayrimlar o‘rtacha $O(m)$ vaqtda ham ishlashini ta’kidlaydi](https://en.wikipedia.org/wiki/Shortest_Path_Faster_Algorithm#Average-case_performance). Shunga qaramay ehtiyot bo‘ling: bu deterministik algoritm va uni $O(n m)$ vaqtda ishlashga majbur qiladigan qarshi misollarni tuzish oson.

Implementatsiyada ayrim ehtiyot choralariga rioya qilish kerak; masalan, manfiy sikl mavjud bo‘lsa, algoritm abadiy ishlayveradi.

Buning oldini olish uchun har bir tugun necha marta relaksatsiya qilinganini saqlovchi hisoblagich yaratish va biror tugun $n$-marta relaksatsiya qilinishi bilanoq algoritmni to‘xtatish mumkin.

Shuningdek, tugun allaqachon navbatda bo‘lsa, uni yana navbatga qo‘shishning hojati yo‘qligiga e’tibor bering.

```{.cpp file=spfa}
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;
bool spfa(int s, vector<int>& d) {
    int n = adj.size();
    d.assign(n, INF);
    vector<int> cnt(n, 0);
    vector<bool> inqueue(n, false);
    queue<int> q;

    d[s] = 0;
    q.push(s);
    inqueue[s] = true;
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        inqueue[v] = false;

        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                if (!inqueue[to]) {
                    q.push(to);
                    inqueue[to] = true;
                    cnt[to]++;
                    if (cnt[to] > n)
                        return false;  // negative cycle
                }
            }
        }
    }
    return true;
}
```

## Onlayn hakamlardagi tegishli masalalar

Bellman–Ford algoritmi yordamida yechilishi mumkin bo‘lgan masalalar ro‘yxati:

* [E-OLYMP #1453 “Ford-Bellman” [qiyinlik: oson]](https://www.e-olymp.com/en/problems/1453)
* [UVA #423 “MPI Maelstrom” [qiyinlik: oson]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=364)
* [UVA #534 “Frogger” [qiyinlik: o‘rta]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=7&page=show_problem&problem=475)
* [UVA #10099 “The Tourist Guide” [qiyinlik: o‘rta]](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=12&page=show_problem&problem=1040)
* [UVA #515 “King” [qiyinlik: o‘rta]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=456)
* [UVA 12519 — The Farnsworth Parabox](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3964)

Shuningdek, [Grafda manfiy siklni topish](finding-negative-cycle-in-graph.md) maqolasidagi masalalar ro‘yxatiga qarang.

* [CSES — High Score](https://cses.fi/problemset/task/1673)
* [CSES — Cycle Finding](https://cses.fi/problemset/task/1197)

