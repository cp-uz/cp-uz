---
article_id: geometry--intersecting_segments
---
# Kesishuvchi kesmalar juftini topish

Tekislikda $n$ ta kesma berilgan. Ulardan kamida ikkitasi kesishadimi-yo‘qmi aniqlash va kesishsa, istalgan bitta kesishuvchi juftni chiqarish talab etiladi.

Sodda algoritm barcha juftlarni tekshiradi va $\mathcal{O}(n^2)$ vaqt oladi. Quyida sweep line, ya’ni suriluvchi chiziq usuliga asoslangan $\mathcal{O}(n\log n)$ algoritm bayon qilinadi.

## Algoritm

$x=-\infty$ vertikal chiziqni tasavvur qilib, uni o‘ngga siljitamiz. Chiziq kesmalarning chap uchlariga yetganda kesmalar faol to‘plamga kiradi, o‘ng uchidan o‘tganda esa chiqadi. Dastlab vertikal kesmalar yo‘q deb tasavvur qilish mumkin; yakuniy implementatsiya ularni ham to‘g‘ri qayta ishlaydi.

Har bir vaqtda sweep line bilan kesishayotgan faol kesmalarni shu chiziqdagi $y$ koordinata bo‘yicha tartibda saqlaymiz. Bu tartib muhim, chunki ikki kesishuvchi kesmaning kesishish paytida $y$ koordinatalari tenglashadi.

Asosiy faktlar quyidagilar:

- Har bir sweep line holatida faqat qo‘shni kesmalarni ko‘rish kifoya.
- Chiziqning barcha haqiqiy $x$ holatlarini ko‘rib chiqish shart emas; kesmalar boshlanadigan yoki tugaydigan, ya’ni uchlarining abssissalariga teng holatlar yetarli.
- Yangi kesma paydo bo‘lganda uni avvalgi faol tartibga kerakli joyga qo‘shamiz va faqat tepa hamda pastdagi qo‘shnilari bilan kesishishini tekshiramiz.
- Kesma tugaganda u faol to‘plamdan o‘chiriladi. O‘chirishdan keyin bir-biriga qo‘shni bo‘lib qolgan yuqori va pastki kesmalar tekshiriladi.
- Boshqa juftlarni tekshirish kerak emas.

Bu faktlarning sababi oddiy. Kesishmaydigan ikki kesma o‘zaro vertikal tartibini o‘zgartira olmaydi: biri avval yuqorida, keyin pastda bo‘lsa, oraliqda ular kesishgan bo‘lardi. Kesishuvchi juft esa kesishish nuqtasida faol tartibda albatta qo‘shni bo‘lib qoladi. Demak, algoritm kesishuvchi juftni uning a’zolari qo‘shni bo‘lgan biror hodisada tekshiradi.

Bir xil $x$ koordinatada avval barcha boshlanuvchi kesmalarni qo‘shib, keyin tugaydiganlarini o‘chirish lozim. Shu orqali umumiy uchda kesishish holatlari ham o‘tkazib yuborilmaydi. Vertikal kesmalar ham to‘g‘rilikka xalaqit bermaydi: ularning chap va o‘ng uchlari bir $x$ da bo‘ladi va hodisalarni to‘g‘ri tartiblash ularni qamrab oladi.

Faol to‘plam muvozanatlangan qidiruv daraxtida saqlanadi. Har bir qo‘shish, o‘chirish va qo‘shnini topish $\mathcal{O}(\log n)$ vaqt oladi; jami $2n$ ta uch hodisasi bor. Shuning uchun umumiy murakkablik $\mathcal{O}(n\log n)$, xotira esa $\mathcal{O}(n)$.

## Implementatsiya

Quyidagi kod kesmalar uchlarini avval $x$ bo‘yicha tartiblaydi. `get_y(x)` kesmaning berilgan $x$ dagi ordinatasini qaytaradi. Faol to‘plam komparatori ikki kesmani ular ikkalasi ham mavjud bo‘lgan abssissada solishtiradi.

```cpp
const double EPS = 1E-9;

struct pt {
    double x, y;
};

struct seg {
    pt p, q;
    int id;

    double get_y(double x) const {
        if (abs(p.x - q.x) < EPS)
            return p.y;
        return p.y + (q.y - p.y) * (x - p.x) / (q.x - p.x);
    }
};

bool intersect1d(double l1, double r1, double l2, double r2) {
    if (l1 > r1)
        swap(l1, r1);
    if (l2 > r2)
        swap(l2, r2);
    return max(l1, l2) <= min(r1, r2) + EPS;
}

int vec(const pt& a, const pt& b, const pt& c) {
    double s = (b.x - a.x) * (c.y - a.y)
             - (b.y - a.y) * (c.x - a.x);
    return abs(s) < EPS ? 0 : (s > 0 ? +1 : -1);
}

bool intersect(const seg& a, const seg& b) {
    return intersect1d(a.p.x, a.q.x, b.p.x, b.q.x)
        && intersect1d(a.p.y, a.q.y, b.p.y, b.q.y)
        && vec(a.p, a.q, b.p) * vec(a.p, a.q, b.q) <= 0
        && vec(b.p, b.q, a.p) * vec(b.p, b.q, a.q) <= 0;
}

bool operator<(const seg& a, const seg& b) {
    double x = max(min(a.p.x, a.q.x), min(b.p.x, b.q.x));
    return a.get_y(x) < b.get_y(x) - EPS;
}

set<seg>::iterator prev_it(set<seg>::iterator it) {
    return it == active.begin() ? active.end() : --it;
}

set<seg>::iterator next_it(set<seg>::iterator it) {
    return ++it;
}
```

To‘liq asosiy funksiya:

```cpp
pair<int, int> solve(vector<seg> a) {
    int n = (int)a.size();
    vector<pair<pair<double, int>, pair<int, int>>> e;

    for (int i = 0; i < n; ++i) {
        a[i].id = i;
        if (a[i].p.x > a[i].q.x)
            swap(a[i].p, a[i].q);
        e.push_back({{a[i].p.x, +1}, {a[i].id, 0}});
        e.push_back({{a[i].q.x, -1}, {a[i].id, 0}});
    }

    sort(e.begin(), e.end(), [](auto A, auto B) {
        if (abs(A.first.first - B.first.first) > EPS)
            return A.first.first < B.first.first;
        return A.first.second > B.first.second; // add before remove
    });

    set<seg> active;
    vector<set<seg>::iterator> where(n);

    for (auto event : e) {
        int id = event.second.first;
        int type = event.first.second;

        if (type == +1) {
            auto it = active.lower_bound(a[id]);
            auto nxt = it;
            auto prv = (it == active.begin() ? active.end() : prev(it));

            if (nxt != active.end() && intersect(*nxt, a[id]))
                return {nxt->id, id};
            if (prv != active.end() && intersect(*prv, a[id]))
                return {prv->id, id};

            where[id] = active.insert(it, a[id]);
        } else {
            auto it = where[id];
            auto nxt = next(it);
            auto prv = (it == active.begin() ? active.end() : prev(it));

            if (nxt != active.end() && prv != active.end()
                    && intersect(*nxt, *prv))
                return {nxt->id, prv->id};

            active.erase(it);
        }
    }

    return {-1, -1};
}
```

Amaliy kodda `active` to‘plami yordamchi funksiyalardan oldin e’lon qilinishi yoki iterator yordamchilari lokal yozilishi kerak. Yuqoridagi asosiy g‘oya o‘zgarmaydi.

Komparatorning sweep line holatiga bog‘liq bo‘lishi odatda `std::set` uchun xavfli, ammo bu masalada algoritm birinchi kesishishni topishi bilanoq to‘xtaydi. Kesishish topilmaguncha faol kesmalarning nisbiy tartibi o‘zgarmaydi, shuning uchun daraxt invariantlari saqlanadi.

