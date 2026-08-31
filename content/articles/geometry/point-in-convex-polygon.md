---
article_id: geometry--point-in-convex-polygon
---
# Nuqtaning qavariq ko‘pburchakka tegishliligini $O(\log N)$ da tekshirish

Qavariq ko‘pburchak va ko‘plab so‘rov nuqtalari berilgan. Har bir nuqta ko‘pburchak ichida yoki chegarasida yotishini $O(\log n)$ vaqtda aniqlash kerak. Ko‘pburchak uchlari soat miliga teskari tartibda berilgan deb hisoblaymiz.

## G‘oya

$p_0$ uchini tayanch nuqta sifatida olamiz. Qavariqlik sababli $p_0$ dan qolgan uchlarga chizilgan nurlar ko‘pburchakni

$$
(p_0,p_1,p_2),
(p_0,p_2,p_3),\dots,
(p_0,p_{n-2},p_{n-1})
$$

uchburchaklar yelpig‘ichiga ajratadi.

So‘rov nuqta $q$ avval $p_0p_1$ va $p_0p_{n-1}$ chegaraviy nurlar orasida ekanini tekshiramiz. Ya’ni

$$
(p_1-p_0)\times(q-p_0)\ge0
$$

va

$$
(p_{n-1}-p_0)\times(q-p_0)\le0
$$

bo‘lishi kerak. So‘ng $q$ yo‘nalishi qaysi ketma-ket nurlar orasida ekanini binary search bilan topamiz. Agar indeks $i$ topilib,

$$
(p_i-p_0)\times(q-p_0)\ge0,
\qquad
(p_{i+1}-p_0)\times(q-p_0)\le0
$$

bo‘lsa, $q$ faqat $(p_0,p_i,p_{i+1})$ uchburchagida bo‘lishi mumkin. Oxirida nuqtaning shu uchburchak ichida yoki chegarasida ekanini yuza/orientatsiya orqali tekshiramiz.

## Oldindan tayyorlash

Maqoladagi implementatsiya barcha koordinatalarni $p_0$ ga nisbatan siljitadi va `seq[i] = p[i+1] - p[0]` vektorlarni saqlaydi. `translation` tayanch nuqta bo‘ladi.

```cpp
struct pt {
    long long x, y;

    pt operator+(const pt& p) const { return {x + p.x, y + p.y}; }
    pt operator-(const pt& p) const { return {x - p.x, y - p.y}; }
    long long cross(const pt& p) const { return x * p.y - y * p.x; }
    long long dot(const pt& p) const { return x * p.x + y * p.y; }
    long long sqrLen() const { return this->dot(*this); }
};

pt translation;
vector<pt> seq;

void prepare(vector<pt>& points) {
    int n = points.size();
    int pos = 0;
    for (int i = 1; i < n; i++) {
        if (points[i].x < points[pos].x ||
            (points[i].x == points[pos].x &&
             points[i].y < points[pos].y))
            pos = i;
    }
    rotate(points.begin(), points.begin() + pos, points.end());

    // Agar kirish soat mili bo‘yicha bo‘lsa, tartibni aylantirish kerak.
    if ((points[1] - points[0]).cross(points.back() - points[0]) < 0)
        reverse(points.begin() + 1, points.end());

    translation = points[0];
    seq.resize(n - 1);
    for (int i = 0; i < n - 1; i++)
        seq[i] = points[i + 1] - translation;
}
```

## So‘rovni tekshirish

```cpp
long long abs_cross(pt a, pt b) {
    return llabs(a.cross(b));
}

bool pointInTriangle(pt a, pt b, pt c, pt p) {
    long long s1 = abs_cross(b - a, c - a);
    long long s2 = abs_cross(a - p, b - p)
                 + abs_cross(b - p, c - p)
                 + abs_cross(c - p, a - p);
    return s1 == s2;
}

bool point_in_convex_polygon(pt point) {
    point = point - translation;
    int n = seq.size();

    if (seq[0].cross(point) != 0 &&
        ((seq[0].cross(point) > 0) !=
         (seq[0].cross(seq[n - 1]) > 0)))
        return false;

    if (seq[n - 1].cross(point) != 0 &&
        ((seq[n - 1].cross(point) > 0) !=
         (seq[n - 1].cross(seq[0]) > 0)))
        return false;

    if (seq[0].cross(point) == 0)
        return point.sqrLen() <= seq[0].sqrLen();
    if (seq[n - 1].cross(point) == 0)
        return point.sqrLen() <= seq[n - 1].sqrLen();

    int l = 0, r = n - 1;
    while (r - l > 1) {
        int mid = (l + r) / 2;
        if (seq[mid].cross(point) >= 0)
            l = mid;
        else
            r = mid;
    }

    return pointInTriangle({0, 0}, seq[l], seq[l + 1], point);
}
```

Yuqoridagi kodning ishora shartlari orientatsiyaga bog‘liq. Amaliyotda ko‘pburchakni aniq CCW tartibga keltirib, quyidagi soddaroq shartlardan foydalanish osonroq:

```cpp
bool inside_convex(const vector<pt>& p, pt q) {
    int n = p.size();
    if ((p[1] - p[0]).cross(q - p[0]) < 0) return false;
    if ((p[n - 1] - p[0]).cross(q - p[0]) > 0) return false;

    int l = 1, r = n - 1;
    while (r - l > 1) {
        int m = (l + r) / 2;
        if ((p[m] - p[0]).cross(q - p[0]) >= 0)
            l = m;
        else
            r = m;
    }
    return (p[r] - p[l]).cross(q - p[l]) >= 0;
}
```

Chegarani ichki deb hisoblash uchun tengliklar `>=`/`<=` bilan qabul qilinadi. Faqat qat’iy ichki nuqtalar kerak bo‘lsa, qirralarda yotish holatlari chiqarib tashlanadi.

## To‘g‘rilik va murakkablik

Qavariq ko‘pburchakda $p_0$ dan uchlarga yo‘nalishlar polar burchak bo‘yicha monoton. Shu sababli so‘rov yo‘nalishini binary search bilan ikkita qo‘shni nur orasiga joylashtirish mumkin. Yelpig‘ich uchburchaklari ko‘pburchakni ustma-ust tushmaydigan qismlarga ajratadi; shuning uchun topilgan uchburchakdagi tekshiruv butun ko‘pburchak uchun zarur va yetarli.

Oldindan tayyorlash $O(n)$, har bir so‘rov $O(\log n)$ vaqt va $O(1)$ qo‘shimcha xotira oladi.

