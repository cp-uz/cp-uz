---
article_id: geometry--nearest_points
---
# Eng yaqin nuqtalar juftini topish

## Masala sharti

Tekislikda $n$ ta nuqta berilgan. Har bir $p_i$ nuqta $(x_i,y_i)$ koordinatalari bilan aniqlanadi. Ular orasidan o‘zaro masofasi eng kichik bo‘lgan ikkita turli nuqtani topish kerak:

$$
\min_{\substack{i,j=0\ldots n-1\\i\ne j}}\rho(p_i,p_j).
$$

Oddiy Evklid masofasi ishlatiladi:

$$
\rho(p_i,p_j)=\sqrt{(x_i-x_j)^2+(y_i-y_j)^2}.
$$

Barcha juftlarni ko‘rish $\mathcal{O}(n^2)$ vaqt oladi. Quyidagi Shamos–Hoey algoritmi esa $\mathcal{O}(n\log n)$ da ishlaydi va taqqoslashlar daraxti modelida optimaldir.

## Algoritm

Divide and conquer sxemasidan foydalanamiz. Rekursiv funksiya nuqtalar to‘plamini taxminan teng ikkiga bo‘ladi, har bir yarmida javobni topadi va so‘ng ikki yarim orasidagi juftlarni tekshirib natijalarni birlashtiradi.

Birlashtirish bosqichi $\mathcal{O}(n)$ da bajarilsa,

$$
T(n)=2T(n/2)+\mathcal{O}(n)=\mathcal{O}(n\log n).
$$

Nuqtalarni avval $(x,y)$ juftligi bo‘yicha saralaymiz:

$$
p_i<p_j\Longleftrightarrow (x_i<x_j)\lor((x_i=x_j)\land(y_i<y_j)).
$$

O‘rta indeks $m=\lfloor n/2\rfloor$ olinadi. Chap va o‘ng yarmdagi eng yaxshi masofalar $h_1$ va $h_2$ bo‘lsa, $h=\min(h_1,h_2)$ deb olamiz.

Endi optimal juftning bir nuqtasi chapda, ikkinchisi o‘ngda bo‘lishi mumkin. Bunday juft uchun har ikki nuqta ajratuvchi vertikal chiziqdan $h$ dan kichik masofada yotishi shart. Demak, faqat

$$
B=\{p_i\mid |x_i-x_m|<h\}
$$

polosadagi nuqtalarni ko‘ramiz.

$B$ nuqtalari $y$ bo‘yicha saralangan bo‘lsin. Har bir $p_i$ uchun faqat

$$
C(p_i)=\{p_j\in B\mid y_i-h<y_j\le y_i\}
$$

nuqtalari tekshiriladi. Bir qarashda $C(p_i)$ katta bo‘lishi mumkindek ko‘rinadi, ammo uning o‘lchami doimiy bilan chegaralangan.

Haqiqatan, $p_i$ va $C(p_i)$ nuqtalari o‘lchami $2h\times h$ bo‘lgan to‘g‘ri to‘rtburchakda yotadi. Uni ikki dona $h\times h$ kvadratga ajratamiz. Har bir yarimning o‘zida istalgan ikki nuqta orasidagi masofa kamida $h$, aks holda rekursiv javob noto‘g‘ri bo‘lardi. Kvadratni yana to‘rtta $h/2\times h/2$ kvadratga bo‘lsak, har bir kichik kvadratda ko‘pi bilan bitta nuqta bo‘lishi mumkin, chunki uning diagonali $h/\sqrt2<h$. Natijada tekshiriladigan oldingi nuqtalar soni kichik doimiydan oshmaydi; odatda eng ko‘pi bilan yettita keyingi qo‘shnini tekshirish yetarli.

Rekursiyaning har bosqichida $B$ ni qayta saralash $\mathcal{O}(n\log^2 n)$ ga olib kelardi. Buni oldini olish uchun rekursiv funksiya o‘z oralig‘idagi nuqtalarni $y$ bo‘yicha saralangan holda qaytaradi. Ikki yarim natijasi merge sort kabi chiziqli vaqtda birlashtiriladi.

Takroriy nuqtalar mavjud bo‘lsa, minimal masofa nol bo‘ladi. Implementatsiya buni ham tabiiy ravishda aniqlaydi.

## Implementatsiya

Masofa o‘rniga uning kvadratini saqlash `sqrt` chaqiruvlarini va suzuvchi nuqta xatolarini kamaytiradi. Quyidagi kod nuqtalarning asl indekslarini ham saqlab, eng yaqin juftni qaytaradi.

```cpp
struct pt {
    long long x, y;
    int id;
};

bool cmp_x(const pt& a, const pt& b) {
    if (a.x != b.x) return a.x < b.x;
    return a.y < b.y;
}

bool cmp_y(const pt& a, const pt& b) {
    if (a.y != b.y) return a.y < b.y;
    return a.x < b.x;
}

using i128 = __int128_t;

i128 dist2(const pt& a, const pt& b) {
    i128 dx = (i128)a.x - b.x;
    i128 dy = (i128)a.y - b.y;
    return dx * dx + dy * dy;
}

vector<pt> a, tmp;
i128 best;
pair<int, int> best_pair;

void upd_ans(const pt& a, const pt& b) {
    i128 d = dist2(a, b);
    if (d < best) {
        best = d;
        best_pair = {a.id, b.id};
    }
}

void rec(int l, int r) {
    if (r - l <= 3) {
        for (int i = l; i < r; ++i)
            for (int j = i + 1; j < r; ++j)
                upd_ans(a[i], a[j]);
        sort(a.begin() + l, a.begin() + r, cmp_y);
        return;
    }

    int m = (l + r) / 2;
    long long midx = a[m].x;
    rec(l, m);
    rec(m, r);

    merge(a.begin() + l, a.begin() + m,
          a.begin() + m, a.begin() + r,
          tmp.begin(), cmp_y);
    copy(tmp.begin(), tmp.begin() + (r - l), a.begin() + l);

    vector<pt> strip;
    strip.reserve(r - l);
    for (int i = l; i < r; ++i) {
        i128 dx = (i128)a[i].x - midx;
        if (dx * dx >= best)
            continue;

        for (int j = (int)strip.size() - 1; j >= 0; --j) {
            i128 dy = (i128)a[i].y - strip[j].y;
            if (dy * dy >= best)
                break;
            upd_ans(a[i], strip[j]);
        }
        strip.push_back(a[i]);
    }
}

pair<pair<int, int>, i128> closest_pair(vector<pt> points) {
    a = move(points);
    sort(a.begin(), a.end(), cmp_x);
    tmp.resize(a.size());
    best = ((i128)1 << 126);
    best_pair = {-1, -1};
    rec(0, (int)a.size());
    return {best_pair, best};
}
```

Muhim noziklik: rekursiyadan oldin `midx` qiymatini saqlash kerak, chunki rekursiv chaqiriqlardan so‘ng oralig‘idagi nuqtalar $y$ bo‘yicha qayta tartiblanadi. Kodda aynan shu bajarilgan.

Agar koordinatalar va ularning farqlari `long long` diapazonida xavfsiz bo‘lsa, `best` uchun `long long` yetadi. Katta koordinatalarda kvadrat hisoblash uchun `__int128` ishlatish zarur.

