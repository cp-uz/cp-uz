---
article_id: geometry--convex_hull_trick
---
# Convex Hull Trick va Li Chao Tree

Quyidagi masalani ko‘rib chiqamiz. $n$ ta shahar bor va siz avtomobilda $1$-shahardan $n$-shaharga borishingiz kerak. Buning uchun benzin sotib olinadi. $k$-shaharda bir litr benzin narxi $cost_k$. Dastlab bak bo‘sh, avtomobil esa har kilometrga bir litr benzin sarflaydi. Shaharlar bitta to‘g‘ri chiziqda, koordinatalari o‘sish tartibida joylashgan; $k$-shaharning koordinatasi $x_k$. Bundan tashqari, $k$-shaharga kirishda $toll_k$ to‘lanadi.

Safarning eng kichik xarajatini topish dinamik dasturlash bilan ifodalanadi:

$$
dp_i=toll_i+\min_{j<i}\bigl(cost_j(x_i-x_j)+dp_j\bigr).
$$

Sodda yechim $\mathcal{O}(n^2)$ vaqt oladi. Uni $\mathcal{O}(n\log n)$ yoki $\mathcal{O}(n\log(C\varepsilon^{-1}))$ gacha tezlashtirish mumkin; bu yerda $C$ — mumkin bo‘lgan eng katta $|x_i|$, $\varepsilon$ esa koordinata aniqligi. Buning uchun masala $kx+b$ chiziqli funksiyalarini to‘plamga qo‘shish va berilgan $x$ nuqtada ularning minimumini topishga keltiriladi.

Buning ikkita asosiy usuli bor.

## Convex Hull Trick

Chiziqli funksiyani tekislikdagi $(k,b)$ nuqta sifatida qaraymiz. $(x,1)$ vektor bilan skalyar ko‘paytma

$$
(k,b)\cdot(x,1)=kx+b
$$

bo‘ladi. Demak, berilgan $(x,1)$ uchun skalyar ko‘paytmasi eng kichik nuqtani izlaymiz. Bunday nuqta $(k,b)$ nuqtalarining pastki qavariq qobig‘ida yotadi.

Qobiqning nuqtalari va qirralarining ichkariga yo‘nalgan normal vektorlari saqlanadi. $(x,1)$ so‘rovi kelganda, burchagi shu vektorga eng yaqin normal topiladi; optimal funksiya tegishli qirraning uchlaridan biriga mos keladi. Buni shunday tushuntirish mumkin: $(x,1)$ bilan bir xil skalyar ko‘paytmaga ega nuqtalar $(x,1)$ ga perpendikulyar chiziqda yotadi. Minimum qobiqka shu yo‘nalishda urinuvchi chiziq tegadigan nuqtada olinadi.

Bu usul chiziqlar qiyaligi $k$ monoton tartibda qo‘shilganda yoki barcha chiziqlarni oldindan qo‘shib, so‘rovlarni keyin bajarish mumkin bo‘lgan oflayn holatda ayniqsa qulay. To‘liq onlayn holatda qobiqni muvozanatlangan to‘plam bilan yuritish ancha murakkab. Soddaroq alternativ sifatida har $\sqrt n$ ta yangi chiziqdan so‘ng qobiqni qayta qurish mumkin.

Quyida kompleks sonlardan foydalanadigan yordamchi funksiyalar keltirilgan.

```cpp
typedef int ftype;
typedef complex<ftype> point;
#define x real
#define y imag

ftype dot(point a, point b) {
    return (conj(a) * b).x();
}

ftype cross(point a, point b) {
    return (conj(a) * b).y();
}
```

Endi chiziqlar qiyaligi faqat ortib boradi va minimum so‘raladi deb olamiz. $(k,b)$ nuqtalari `hull` vektorida, qobiq qirralarining normal vektorlari esa `vecs` vektorida saqlanadi. Yangi nuqta qo‘shilganda qobiqning oxirgi qirrasi bilan oxirgi nuqtadan yangi nuqtaga yo‘nalgan vektor orasidagi burilish tekshiriladi. Burilish noto‘g‘ri bo‘lsa, oxirgi nuqta va unga mos normal o‘chiriladi.

So‘rovda `lower_bound` orqali so‘rov vektorining qaysi normal vektorlar orasiga tushishi topiladi va mos qobiq nuqtasi baholanadi.

```cpp
vector<point> hull, vecs;

void add_line(ftype k, ftype b) {
    point nw = {k, b};
    while (!vecs.empty() && dot(vecs.back(), nw - hull.back()) < 0) {
        hull.pop_back();
        vecs.pop_back();
    }
    if (!hull.empty()) {
        vecs.push_back(1i * (nw - hull.back()));
    }
    hull.push_back(nw);
}

int get(ftype x) {
    point query = {x, 1};
    auto it = lower_bound(vecs.begin(), vecs.end(), query, [](point a, point b) {
        return cross(a, b) > 0;
    });
    return dot(query, hull[it - vecs.begin()]);
}
```

Bu kod qiyaliklar monoton qo‘shilishini faraz qiladi. Bir xil qiyalikdagi chiziqlarda minimum uchun faqat eng kichik $b$ ga ega chiziqni saqlash kerak. Sonlar diapazoni katta bo‘lsa, `dot` va `cross` hisoblarida toshib ketishni oldini olish uchun kengroq butun turdan foydalaniladi.

## Li Chao daraxti

Li Chao daraxti chiziqlarni onlayn qo‘shish va nuqtadagi minimumni topishni soddaroq qiladi. Ikki xil chiziqli funksiya eng ko‘pi bilan bir nuqtada kesishadi. Shu sababli, intervalning o‘rta nuqtasida qaysi chiziq yaxshiroq ekanini bilsak, yomonroq chiziq faqat intervalning chap yoki o‘ng yarmidan birida g‘alaba qozonishi mumkin.

Koordinatalar sohasi $[0,C)$ bo‘lsin. Segment daraxtining har bir tugunida shu tugun intervalining o‘rta nuqtasida eng yaxshi bo‘lgan chiziq saqlanadi. Yangi chiziq qo‘shilganda joriy tugundagi chiziq bilan chap uch va o‘rta nuqtadagi qiymatlar taqqoslanadi. O‘rta nuqtada yangi chiziq yaxshiroq bo‘lsa, ular almashtiriladi. Qolgan yomonroq chiziq faqat kesishish bo‘lishi mumkin bo‘lgan yarmiga rekursiv yuboriladi.

Har bir qo‘shish bitta ildizdan barggacha yo‘l bo‘ylab tushadi, shuning uchun murakkablik $\mathcal{O}(\log C)$. Nuqtadagi so‘rov ham shu koordinataga mos ildiz-barg yo‘lidagi barcha chiziqlar qiymatining minimumini oladi va $\mathcal{O}(\log C)$ vaqt ishlaydi.

```cpp
typedef long long ftype;
typedef complex<ftype> point;
#define x real
#define y imag

const int maxn = 2e5;
const ftype inf = 1e18;

ftype dot(point a, point b) {
    return (conj(a) * b).x();
}

point line[4 * maxn];

void add_line(point nw, int v = 1, int l = 0, int r = maxn) {
    int m = (l + r) / 2;
    bool lef = dot(nw, {l, 1}) < dot(line[v], {l, 1});
    bool mid = dot(nw, {m, 1}) < dot(line[v], {m, 1});
    if (mid) {
        swap(line[v], nw);
    }
    if (r - l == 1) {
        return;
    } else if (lef != mid) {
        add_line(nw, 2 * v, l, m);
    } else {
        add_line(nw, 2 * v + 1, m, r);
    }
}

ftype get(int x, int v = 1, int l = 0, int r = maxn) {
    int m = (l + r) / 2;
    if (r - l == 1) {
        return dot(line[v], {x, 1});
    } else if (x < m) {
        return min(dot(line[v], {x, 1}), get(x, 2 * v, l, m));
    } else {
        return min(dot(line[v], {x, 1}), get(x, 2 * v + 1, m, r));
    }
}
```

Daraxtni ishlatishdan oldin barcha tugunlar $0x+\text{INF}$ neytral chizig‘i bilan to‘ldiriladi:

```cpp
fill(line, line + 4 * maxn, point(0, inf));
```

Koordinatalar juda katta yoki siqilmagan bo‘lsa, tugunlarni ehtiyojga qarab yaratadigan dinamik Li Chao daraxti ishlatiladi. Chiziq faqat ma’lum segmentda amal qilsa, segment daraxti bo‘ylab shu oraliqqa chiziq qo‘shiladigan variant ham quriladi.

Shaharlar masalasida $j$-holat quyidagi chiziqni hosil qiladi:

$$
y=cost_j\,x+(dp_j-cost_jx_j).
$$

$x_i$ da minimum so‘ralib, unga $toll_i$ qo‘shiladi. Shunday qilib kvadratik DP onlayn ravishda $\mathcal{O}(n\log C)$ da hisoblanadi.

