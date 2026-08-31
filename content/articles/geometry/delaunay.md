---
article_id: geometry--delaunay
---
# Delaunay triangulyatsiyasi va Voronoi diagrammasi

Tekislikda $\{p_i\}$ nuqtalar to‘plami berilgan bo‘lsin. Uning Voronoi diagrammasi $V(\{p_i\})$ — tekislikning $n$ ta $V_i$ sohaga bo‘linishi bo‘lib,

$$
V_i=\{p\in\mathbb{R}^2\mid \rho(p,p_i)=\min_k\rho(p,p_k)\}.
$$

Voronoi kataklari ko‘pburchaklar bo‘lib, ayrimlari cheksiz bo‘lishi mumkin. $\{p_i\}$ ning Delaunay triangulyatsiyasi $D(\{p_i\})$ esa shunday triangulyatsiyaki, har bir $T\in D(\{p_i\})$ uchburchakning tashqi aylanasining ichida hech bir $p_i$ nuqta yotmaydi; nuqtalar aylana chegarasida yotishiga ruxsat beriladi.

Barcha nuqtalar kollinear bo‘lgan degenerativ holatda Voronoi diagrammasi bog‘lanmagan bo‘lishi, odatdagi ma’nodagi Delaunay triangulyatsiyasi esa mavjud bo‘lmasligi mumkin.

## Xossalar

- Delaunay triangulyatsiyasi barcha mumkin bo‘lgan triangulyatsiyalar orasida eng kichik burchakni maksimal qiladi.
- Nuqtalar to‘plamining minimal Evklid ostov daraxti qirralari Delaunay triangulyatsiyasi qirralarining qism to‘plamidir.

Bu xossalar Delaunay triangulyatsiyasini sonli modellashtirish, yaqin qo‘shnilarni topish va geometrik graf qurish masalalarida foydali qiladi.

## Duallik

Nuqtalar kollinear emas va hech qaysi to‘rtta nuqta bitta aylanada yotmaydi deb faraz qilaylik. U holda Voronoi diagrammasi va Delaunay triangulyatsiyasi o‘zaro dualdir:

- har bir Delaunay uchburchagiga uning tashqi aylana markazi bo‘lgan Voronoi uchi mos keladi;
- umumiy Delaunay qirraga ega ikkita uchburchak markazlarini birlashtiruvchi Voronoi qirrasi mavjud;
- Delaunay qobig‘idagi qirralarga cheksiz Voronoi nurlari mos keladi.

Shuning uchun bittasi qurilgach, ikkinchisini $\mathcal{O}(n)$ da tiklash mumkin. To‘rtta yoki undan ortiq nuqta bitta aylanada yotsa, Delaunay triangulyatsiyasi yagona bo‘lmasligi mumkin. Bu holda bir xil tashqi aylanaga ega qo‘shni uchburchaklar orasidagi qirralarni olib tashlash orqali Voronoi diagrammasining dual grafigi olinadi.

## Delaunay va Voronoi diagrammasini qurish

Duallik sababli faqat bittasini tez qurish kifoya. Quyida Guibas va Stolfi taklif qilgan divide and conquer algoritmi bilan Delaunay triangulyatsiyasini $\mathcal{O}(n\log n)$ da quramiz.

## Quad-edge ma’lumotlar tuzilmasi

Triangulyatsiya `quad-edge` tuzilmasida saqlanadi. Har bir geometrik qirra to‘rtta bog‘langan yozuv bilan ifodalanadi: ikki qarama-qarshi primal yo‘nalish va ikki dual yo‘nalish.

Algoritm quyidagi amallardan foydalanadi:

1. `make_edge(a,b)` — `a` dan `b` ga izolyatsiyalangan qirra, uning teskari qirrasi va ikkita dual qirrani yaratadi.
2. `splice(a,b)` — `a->Onext` bilan `b->Onext` ni, shuningdek dual bog‘lanishlarni almashadi. Bu amal qirralar halqalarini birlashtiradi yoki ajratadi.
3. `delete_edge(e)` — `e` va uning teskari qirrasini tegishli halqalardan chiqarib, xotiradan o‘chiradi.
4. `connect(a,b)` — `a->Dest` dan `b->Org` ga shunday yangi qirra yaratadiki, `a`, `b` va yangi qirra bir xil chap yuzga ega bo‘ladi.

## Algoritm

Algoritm triangulyatsiyani quradi va ikkita qirrani qaytaradi: eng chap nuqtadan chiqadigan soat miliga teskari qobiq qirrasi hamda eng o‘ng nuqtadan chiqadigan soat mili yo‘nalishidagi qobiq qirrasi.

Nuqtalar avval $x$, teng bo‘lsa $y$ bo‘yicha saralanadi. $(l,r)$ oraliq uchun rekursiya bajariladi.

- Ikki nuqta bo‘lsa, ular orasidagi bitta qirra yaratiladi.
- Uch nuqta bo‘lsa, ketma-ket ikkita qirra yaratiladi va `splice` bilan bog‘lanadi. Nuqtalar kollinear bo‘lmasa, uchinchi qirra bilan uchburchak yopiladi; qaytariladigan tashqi qirralar orientatsiyaga bog‘liq.
- Kamida to‘rtta nuqta bo‘lsa, to‘plam chap $L$ va o‘ng $R$ yarmiga bo‘linadi, ular rekursiv triangulyatsiya qilinadi va so‘ng birlashtiriladi.

Birlashtirishda avval $L$ va $R$ ning pastki umumiy urinmasi topiladi va u `base` ko‘ndalang qirrasiga aylantiriladi. Keyingi ko‘ndalang qirralar pastdan yuqoriga qo‘shiladi. Har qadamda chap va o‘ng nomzodlar `lcand` va `rcand` olinadi. `in_circle` testi orqali Delaunay shartini buzadigan ichki qirralar o‘chiriladi. So‘ng ikki nomzoddan tashqi aylana bo‘yicha oldin uchraydigani tanlanib, yangi `base` qirrasi yaratiladi. Hech bir nomzod yaroqli bo‘lmaganda yuqori umumiy urinmaga yetilgan bo‘ladi.

Har darajadagi birlashtirish chiziqli, rekursiya chuqurligi $\mathcal{O}(\log n)$, shu sababli umumiy murakkablik $\mathcal{O}(n\log n)$.

## Implementatsiya

`in_circle` funksiyasining quyidagi varianti GCC/Clang dagi `__int128` turidan foydalanadi.

```cpp
typedef long long ll;

bool ge(const ll& a, const ll& b) { return a >= b; }
bool le(const ll& a, const ll& b) { return a <= b; }
bool eq(const ll& a, const ll& b) { return a == b; }
bool gt(const ll& a, const ll& b) { return a > b; }
bool lt(const ll& a, const ll& b) { return a < b; }
int sgn(const ll& a) { return a >= 0 ? a ? 1 : 0 : -1; }

struct pt {
    ll x, y;
    pt() { }
    pt(ll _x, ll _y) : x(_x), y(_y) { }
    pt operator-(const pt& p) const {
        return pt(x - p.x, y - p.y);
    }
    ll cross(const pt& p) const {
        return x * p.y - y * p.x;
    }
    ll cross(const pt& a, const pt& b) const {
        return (a - *this).cross(b - *this);
    }
    ll dot(const pt& p) const {
        return x * p.x + y * p.y;
    }
    ll dot(const pt& a, const pt& b) const {
        return (a - *this).dot(b - *this);
    }
    ll sqrLength() const {
        return this->dot(*this);
    }
    bool operator==(const pt& p) const {
        return eq(x, p.x) && eq(y, p.y);
    }
};

const pt inf_pt = pt((ll)1e18, (ll)1e18);

struct QuadEdge {
    pt origin;
    QuadEdge* rot = nullptr;
    QuadEdge* onext = nullptr;
    bool used = false;
    QuadEdge* rev() const {
        return rot->rot;
    }
    QuadEdge* lnext() const {
        return rot->rev()->onext->rot;
    }
    QuadEdge* oprev() const {
        return rot->onext->rot;
    }
    pt dest() const {
        return rev()->origin;
    }
};

QuadEdge* make_edge(pt from, pt to) {
    QuadEdge* e1 = new QuadEdge;
    QuadEdge* e2 = new QuadEdge;
    QuadEdge* e3 = new QuadEdge;
    QuadEdge* e4 = new QuadEdge;
    e1->origin = from;
    e2->origin = to;
    e3->origin = e4->origin = inf_pt;
    e1->rot = e3;
    e2->rot = e4;
    e3->rot = e2;
    e4->rot = e1;
    e1->onext = e1;
    e2->onext = e2;
    e3->onext = e4;
    e4->onext = e3;
    return e1;
}

void splice(QuadEdge* a, QuadEdge* b) {
    swap(a->onext->rot->onext, b->onext->rot->onext);
    swap(a->onext, b->onext);
}

void delete_edge(QuadEdge* e) {
    splice(e, e->oprev());
    splice(e->rev(), e->rev()->oprev());
    delete e->rev()->rot;
    delete e->rev();
    delete e->rot;
    delete e;
}

QuadEdge* connect(QuadEdge* a, QuadEdge* b) {
    QuadEdge* e = make_edge(a->dest(), b->origin);
    splice(e, a->lnext());
    splice(e->rev(), b);
    return e;
}

bool left_of(pt p, QuadEdge* e) {
    return gt(p.cross(e->origin, e->dest()), 0);
}

bool right_of(pt p, QuadEdge* e) {
    return lt(p.cross(e->origin, e->dest()), 0);
}

template <class T>
T det3(T a1, T a2, T a3,
       T b1, T b2, T b3,
       T c1, T c2, T c3) {
    return a1 * (b2 * c3 - c2 * b3)
         - a2 * (b1 * c3 - c1 * b3)
         + a3 * (b1 * c2 - c1 * b2);
}

bool in_circle(pt a, pt b, pt c, pt d) {
#if defined(__SIZEOF_INT128__)
    __int128 det = -det3<__int128>(
        b.x, b.y, b.sqrLength(),
        c.x, c.y, c.sqrLength(),
        d.x, d.y, d.sqrLength());
    det += det3<__int128>(
        a.x, a.y, a.sqrLength(),
        c.x, c.y, c.sqrLength(),
        d.x, d.y, d.sqrLength());
    det -= det3<__int128>(
        a.x, a.y, a.sqrLength(),
        b.x, b.y, b.sqrLength(),
        d.x, d.y, d.sqrLength());
    det += det3<__int128>(
        a.x, a.y, a.sqrLength(),
        b.x, b.y, b.sqrLength(),
        c.x, c.y, c.sqrLength());
    return det > 0;
#else
    auto ang = [](pt l, pt mid, pt r) {
        ll x = mid.dot(l, r);
        ll y = mid.cross(l, r);
        return atan2((long double)x, (long double)y);
    };
    long double val = ang(a, b, c) + ang(c, d, a)
                    - ang(b, c, d) - ang(d, a, b);
    return val > 1e-8;
#endif
}

pair<QuadEdge*, QuadEdge*> build_tr(int l, int r, vector<pt>& p) {
    if (r - l + 1 == 2) {
        QuadEdge* res = make_edge(p[l], p[r]);
        return {res, res->rev()};
    }
    if (r - l + 1 == 3) {
        QuadEdge *a = make_edge(p[l], p[l + 1]);
        QuadEdge *b = make_edge(p[l + 1], p[r]);
        splice(a->rev(), b);
        int sg = sgn(p[l].cross(p[l + 1], p[r]));
        if (sg == 0)
            return {a, b->rev()};
        QuadEdge* c = connect(b, a);
        if (sg == 1)
            return {a, b->rev()};
        return {c->rev(), c};
    }

    int mid = (l + r) / 2;
    QuadEdge *ldo, *ldi, *rdo, *rdi;
    tie(ldo, ldi) = build_tr(l, mid, p);
    tie(rdi, rdo) = build_tr(mid + 1, r, p);

    while (true) {
        if (left_of(rdi->origin, ldi)) {
            ldi = ldi->lnext();
            continue;
        }
        if (right_of(ldi->origin, rdi)) {
            rdi = rdi->rev()->onext;
            continue;
        }
        break;
    }

    QuadEdge* basel = connect(rdi->rev(), ldi);
    auto valid = [&basel](QuadEdge* e) {
        return right_of(e->dest(), basel);
    };

    if (ldi->origin == ldo->origin)
        ldo = basel->rev();
    if (rdi->origin == rdo->origin)
        rdo = basel;

    while (true) {
        QuadEdge* lcand = basel->rev()->onext;
        if (valid(lcand)) {
            while (in_circle(basel->dest(), basel->origin,
                             lcand->dest(), lcand->onext->dest())) {
                QuadEdge* t = lcand->onext;
                delete_edge(lcand);
                lcand = t;
            }
        }

        QuadEdge* rcand = basel->oprev();
        if (valid(rcand)) {
            while (in_circle(basel->dest(), basel->origin,
                             rcand->dest(), rcand->oprev()->dest())) {
                QuadEdge* t = rcand->oprev();
                delete_edge(rcand);
                rcand = t;
            }
        }

        if (!valid(lcand) && !valid(rcand))
            break;

        if (!valid(lcand) ||
            (valid(rcand) && in_circle(lcand->dest(), lcand->origin,
                                       rcand->origin, rcand->dest())))
            basel = connect(rcand, basel->rev());
        else
            basel = connect(basel->rev(), lcand->rev());
    }
    return {ldo, rdo};
}

vector<tuple<pt, pt, pt>> delaunay(vector<pt> p) {
    sort(p.begin(), p.end(), [](const pt& a, const pt& b) {
        return lt(a.x, b.x) || (eq(a.x, b.x) && lt(a.y, b.y));
    });
    p.erase(unique(p.begin(), p.end()), p.end());
    if (p.size() < 3)
        return {};

    auto res = build_tr(0, (int)p.size() - 1, p);
    QuadEdge* e = res.first;
    vector<QuadEdge*> edges = {e};

    while (lt(e->onext->dest().cross(e->dest(), e->origin), 0))
        e = e->onext;

    vector<pt> face_points;
    auto add = [&]() {
        QuadEdge* curr = e;
        do {
            curr->used = true;
            face_points.push_back(curr->origin);
            edges.push_back(curr->rev());
            curr = curr->lnext();
        } while (curr != e);
    };

    add();                       // tashqi yuz
    face_points.clear();
    int ptr = 0;
    while (ptr < (int)edges.size()) {
        e = edges[ptr++];
        if (!e->used)
            add();
    }

    vector<tuple<pt, pt, pt>> ans;
    for (int i = 0; i + 2 < (int)face_points.size(); i += 3)
        ans.emplace_back(face_points[i], face_points[i + 1], face_points[i + 2]);
    return ans;
}
```

Kirishda takroriy nuqtalarni olib tashlash kerak. Barcha nuqtalar kollinear bo‘lsa, uchburchaklar ro‘yxati bo‘sh bo‘ladi; bunday holat alohida qayta ishlanadi. Koordinata diapazoni katta bo‘lsa, `cross`, `dot` va aylana determinantida toshib ketishni qat’iy nazorat qilish zarur.

## Mashq masalalari

- [Timus 1504 — Good Manners](https://acm.timus.ru/problem.aspx?space=1&num=1504)
- [Timus 1520 — Empire Strikes Back](https://acm.timus.ru/problem.aspx?space=1&num=1520)
- [SGU 383 — Caravans](https://codeforces.com/problemsets/acmsguru/problem/99999/383)

