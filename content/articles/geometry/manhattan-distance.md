---
article_id: geometry--manhattan-distance
---
# Manhattan masofasi

## Ta’rif

Tekislikdagi $p$ va $q$ nuqtalari orasidagi masofani ularning $x$ va $y$ koordinatalari farqlarining modullari yig‘indisi sifatida aniqlash mumkin:

$$
d(p,q)=|x_p-x_q|+|y_p-y_q|.
$$

Bunday masofa **Manhattan geometriyasi** yoki **taksikab geometriyasi** deb ataladigan modelga mos keladi. Unda nuqtalar katakli shahardagi chorrahalar sifatida qaraladi va faqat ko‘chalar bo‘ylab — gorizontal yoki vertikal — yurish mumkin. Shu sababli ikki nuqta orasida bir nechta eng qisqa yo‘l bo‘lishi mumkin, biroq ularning har birining uzunligi yuqoridagi formula bilan bir xil bo‘ladi.

Manhattan masofasi bilan bog‘liq bir nechta foydali algebraik o‘zgartirish va algoritmlar mavjud. Quyida ulardan ayrimlari ko‘rib chiqiladi.

## Manhattan masofasida eng uzoq nuqtalar jufti

$n$ ta $P$ nuqta berilgan bo‘lsin. $|x_p-x_q|+|y_p-y_q|$ qiymatini maksimum qiladigan $p,q$ juftni topmoqchimiz.

Avval bir o‘lchamli holatni, ya’ni $y=0$ ni ko‘raylik. Asosiy kuzatuv shuki, modul ichidagi ifodaning mumkin bo‘lgan ishoralarini to‘liq ko‘rib chiqish mumkin:

$$
|x_p-x_q|=\begin{cases}
x_p-x_q,&x_p\ge x_q,\\
-x_p+x_q,&x_p<x_q,
\end{cases}
=
\max(x_p-x_q,-x_p+x_q).
$$

Masalan, $p$ koordinatasiga musbat, $q$ koordinatasiga manfiy ishora tanlansa, quyidagi ifoda olinadi:

$$
\max_{p,q\in P}(x_p-x_q)
=
\max_{p\in P}x_p+\max_{q\in P}(-x_q).
$$

Muhimi, bu yerda $p$ va $q$ ni tanlash bir-biridan mustaqil bo‘lib qoldi.

G‘oyani ikki va undan ko‘p o‘lchamga kengaytirish mumkin. $d$ o‘lchamda koordinatalar uchun $2^d$ ta ishora niqobi mavjud. Masalan, ikki o‘lchamda ikkala koordinata uchun ham musbat ishora tanlansa,

$$
\max_{p,q\in P}
\bigl[(x_p-x_q)+(y_p-y_q)\bigr]
=
\max_{p\in P}(x_p+y_p)+
\max_{q\in P}(-x_q-y_q).
$$

Har bir niqob uchun nuqtaning ishorali koordinatalari yig‘indisining minimum va maksimum qiymatini hisoblash yetarli. Ularning farqi shu niqobga mos eng katta masofadir. Barcha niqoblar bo‘yicha maksimum javobni beradi.

Quyidagi kod usulni $d$ o‘lcham uchun umumlashtiradi va $O(n\cdot2^d\cdot d)$ vaqtda ishlaydi:

```cpp
long long ans = 0;
for (int msk = 0; msk < (1 << d); msk++) {
    long long mx = LLONG_MIN, mn = LLONG_MAX;
    for (int i = 0; i < n; i++) {
        long long cur = 0;
        for (int j = 0; j < d; j++) {
            if (msk & (1 << j)) cur += p[i][j];
            else cur -= p[i][j];
        }
        mx = max(mx, cur);
        mn = min(mn, cur);
    }
    ans = max(ans, mx - mn);
}
```

## Nuqtalarni burish va Chebyshev masofasi

Barcha haqiqiy $m,n$ sonlar uchun quyidagi ayniyat o‘rinli:

$$
|m|+|n|=\max(|m+n|,|m-n|).
$$

Buni $m$ va $n$ ning ishoralarini alohida holatlar bo‘yicha tekshirib isbotlash mumkin.

Ayniyatni Manhattan masofasi formulasiga qo‘llasak,

$$
\begin{aligned}
d((x_1,y_1),(x_2,y_2))
&=|x_1-x_2|+|y_1-y_2|\\
&=\max\bigl(
|(x_1+y_1)-(x_2+y_2)|,\\
&\hspace{3.6em}|(y_1-x_1)-(y_2-x_2)|
\bigr).
\end{aligned}
$$

Oxirgi ifoda $(x_1+y_1,y_1-x_1)$ va $(x_2+y_2,y_2-x_2)$ nuqtalari orasidagi **Chebyshev masofasi**dir. Demak,

$$
\alpha:(x,y)\longmapsto(x+y,y-x)
$$

o‘zgartirishidan keyin asl nuqtalar orasidagi Manhattan masofasi ularning tasvirlari orasidagi Chebyshev masofasiga aylanadi.

Geometrik jihatdan, $\alpha$ markazi $(0,0)$ bo‘lgan spiral o‘xshashlikdir: tekislik soat mili yo‘nalishida $45^\circ$ ga buriladi va $\sqrt2$ marta kattalashtiriladi. Bu o‘zgartirish Manhattan sharlarini o‘qlarga parallel kvadratlarga aylantirgani uchun ko‘plab geometrik masalalarni soddalashtiradi.

## Manhattan minimal ostov daraxti

Manhattan MST masalasida tekislikdagi nuqtalarni umumiy og‘irligi eng kichik bo‘lgan daraxt bilan ulash talab qilinadi. Ikki nuqtani bog‘lovchi qirra og‘irligi ularning Manhattan masofasiga teng. Soddalik uchun barcha nuqtalar turli joylarda yotadi deb faraz qilamiz.

$O(n\log n)$ yechimning g‘oyasi: har bir nuqta uchun sakkizta oktantning har biridagi eng yaqin qo‘shnini topish. Natijada atigi $O(n)$ ta nomzod qirra olinadi va ular orasida biror Manhattan MST mavjud bo‘ladi. So‘ng bu nomzodlarga oddiy Kruskal algoritmi qo‘llanadi.

### Nega har bir oktantdan faqat eng yaqin qo‘shni yetarli?

$s$ nuqtaga nisbatan bir xil oktantda joylashgan $p$ va $q$ nuqtalarni olaylik. Oktantning geometrik cheklovlaridan

$$
d(p,q)<\max(d(s,p),d(s,q))
$$

kelib chiqadi. Shuning uchun biror MST da $s$ bir vaqtning o‘zida $p$ va $q$ ga ulangan bo‘lsa, og‘irroq $(s,p)$ yoki $(s,q)$ qirrani olib tashlab, uning o‘rniga $(p,q)$ qirrani qo‘shish daraxtni bog‘langan holda qoldiradi va umumiy og‘irlikni kamaytiradi. Demak, $s$ dan bir oktant ichiga MST ning ko‘pi bilan eng yaqin nuqtaga boruvchi qirrasi kerak bo‘ladi.

Masalan, $s$ ga nisbatan $R_1$ oktantni

$$
x_s\le x,
\qquad
x_s-y_s>x-y
$$

shartlari bilan berish mumkin. Boshqa oktantlar koordinatalarni almashtirish va ishoralarni o‘zgartirish orqali shu holatga keltiriladi.

## Har bir oktantdagi eng yaqin qo‘shnini $O(n\log n)$ da topish

Aniqlik uchun shimol-shimoli-sharqiy, ya’ni $R_1$ oktantni ko‘ramiz. Qolgan yo‘nalishlar ayni algoritmni nuqtalarni burib takrorlash orqali olinadi.

Sweep-line nuqtalarni janubi-g‘arbdan shimoli-sharqqa, ya’ni $x+y$ ning kamaymaydigan tartibida ko‘radi. Hali shu oktantdagi eng yaqin qo‘shnisi topilmagan nuqtalar **faol to‘plam**da saqlanadi.

Yangi $p$ nuqta kelganda, $p$ nuqta oktantida yotadigan har bir faol $s$ uchun $p$ eng yaqin qo‘shni bo‘ladi. Haqiqatan,

$$
d(p,s)=|x_p-x_s|+|y_p-y_s|
=(x_p+y_p)-(x_s+y_s),
$$

chunki $p$ shimol-shimoli-sharqiy oktantda. Keyin ko‘riladigan barcha nuqtalarning $x+y$ qiymati bundan kichik bo‘lmaydi; shuning uchun ular $s$ ga yaqinroq bo‘la olmaydi. Bunday $s$ nuqtalar faol to‘plamdan o‘chiriladi, so‘ng $p$ ning o‘zi qo‘shiladi.

$p$ nuqta $s$ ning $R_1$ oktantida bo‘lishi uchun

- $x_s\le x_p$;
- $x_p-y_p<x_s-y_s$

shartlari bajarilishi kerak.

Faol to‘plamdagi hech bir nuqta boshqasining $R_1$ sohasida yotmaydi. Shu sababli faol nuqtalarni $x$ bo‘yicha tartiblasak, $x$ tartibi $x-y$ tartibiga ham mos keladi: agar $x_{q_1}<x_{q_2}$ bo‘lsa, unda $x_{q_1}-y_{q_1}\le x_{q_2}-y_{q_2}$. Demak, mos keluvchi $s$ lar tartiblangan to‘plamda ketma-ket joylashadi.

$x_s\le x_p$ bo‘lgan eng katta $x_s$ dan boshlab, $x$ ni kamaytirib yuramiz. $x_p-y_p>x_s-y_s$ bo‘lib qolganida to‘xtash mumkin; tenglikka ruxsat berish koordinatalari teng bo‘lishi mumkin bo‘lgan holatni ham qoplaydi. Har bir faol nuqta ishlov berilgach darhol o‘chiriladi, shuning uchun barcha ichki yurishlarning jami amortizatsiyalangan qiymati $O(n)$, `map` amallari bilan umumiy murakkablik $O(n\log n)$ bo‘ladi.

Bitta aylantirish asl yo‘nalish bilan birga unga qarama-qarshi yo‘nalishdagi eng yaqin qirralarni ham beradi. Shu sababli sakkiz marta emas, to‘rtta transformatsiya yetarli.

Algoritmning qisqacha qadamlari:

1. Nuqtalarni $x+y$ ning kamaymaydigan tartibida saralash.
2. Har bir $p$ uchun faol to‘plamda $x_s\le x_p$ bo‘lgan eng katta $x_s$ dan boshlash va oktant sharti buzilguncha nuqtalarni ko‘rib chiqish.
3. Har bir mos $s$ uchun $(s,p,d(s,p))$ qirrani nomzodlar ro‘yxatiga qo‘shish va $s$ ni faol to‘plamdan o‘chirish.
4. $p$ ni faol to‘plamga qo‘shish.
5. Koordinatalarni burib, barcha oktantlar qamrab olinguncha takrorlash.
6. Nomzod qirralarda Kruskal algoritmini bajarish.

Quyidagi implementatsiya KACTL dagi variantga asoslangan. Funksiya Kruskalga berilishi mumkin bo‘lgan `(weight, u, v)` uchliklarini qaytaradi:

```cpp
struct point {
    long long x, y;
};

// Returns a list of edges in the format (weight, u, v).
// Passing this list to Kruskal algorithm will give the Manhattan MST.
vector<tuple<long long, int, int>> manhattan_mst_edges(vector<point> ps) {
    vector<int> ids(ps.size());
    iota(ids.begin(), ids.end(), 0);
    vector<tuple<long long, int, int>> edges;
    for (int rot = 0; rot < 4; rot++) { // for every rotation
        sort(ids.begin(), ids.end(), [&](int i, int j){
            return (ps[i].x + ps[i].y) < (ps[j].x + ps[j].y);
        });
        map<int, int, greater<int>> active; // (xs, id)
        for (auto i : ids) {
            for (auto it = active.lower_bound(ps[i].x); it != active.end();
                 active.erase(it++)) {
                int j = it->second;
                if (ps[i].x - ps[i].y > ps[j].x - ps[j].y) break;
                assert(ps[i].x >= ps[j].x && ps[i].y >= ps[j].y);
                edges.push_back({(ps[i].x - ps[j].x) +
                                 (ps[i].y - ps[j].y), i, j});
            }
            active[ps[i].x] = i;
        }
        for (auto &p : ps) { // rotate
            if (rot & 1) p.x *= -1;
            else swap(p.x, p.y);
        }
    }
    return edges;
}
```

Nomzodlar soni $O(n)$, ularni topish $O(n\log n)$ va Kruskal ham $O(n\log n)$ vaqt oladi. Shunday qilib, Manhattan MST ning umumiy murakkabligi $O(n\log n)$.

## Masalalar

- [AtCoder Beginner Contest 178E — Dist Max](https://atcoder.jp/contests/abc178/tasks/abc178_e)
- [Codeforces 1093G — Multidimensional Queries](https://codeforces.com/problemset/problem/1093/G)
- [Codeforces 944F — Game with Tokens](https://codeforces.com/problemset/problem/944/F)
- [AtCoder Code Festival 2017 D — Four Coloring](https://atcoder.jp/contests/code-festival-2017-quala/tasks/code_festival_2017_quala_d)
- [ICPC Asia EC Regionals Online Contest 2023 — Minimum Manhattan Distance](https://codeforces.com/gym/104591/problem/J)

