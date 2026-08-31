---
article_id: geometry--point-location
---
# Nuqta joylashuvini $O(\log N)$ da aniqlash

Quyidagi masalani ko‘rib chiqamiz: darajasi nol yoki bir bo‘lgan uchlari yo‘q tekis bo‘linish, ya’ni qirralari kesishmaydigan planar subdivision berilgan va ko‘p sonli so‘rovlar mavjud. Har bir so‘rov nuqta bo‘lib, nuqta qaysi yuzga tegishli ekanini aniqlash kerak. So‘rovlar oflayn ravishda har biri $\mathcal{O}(\log n)$ vaqtda bajariladi.

Bunday masala Voronoi diagrammasida nuqta joylashuvini aniqlashda yoki sodda ko‘pburchakdagi ko‘p so‘rovlarni qayta ishlashda uchraydi.

## Algoritm

Har bir $p=(x_0,y_0)$ so‘rov uchun quyidagi qirrani topmoqchimiz:

- agar nuqta biror qirrada yotsa, topilgan qirra shu qirra bo‘lishi kerak;
- aks holda qirra $x=x_0$ vertikal chiziqni yagona $(x_0,y)$ nuqtada kesishi, $y<y_0$ bo‘lishi va shunday qirralar orasida $y$ maksimal bo‘lishi kerak.

Masalani sweep line bilan oflayn yechamiz. Qirralar uchlari va so‘rov nuqtalarining $x$ koordinatalarini o‘sish tartibida ko‘rib chiqamiz. To‘rtta turdagi hodisa yaratiladi:

1. `add` — vertikal bo‘lmagan qirraning chap uchida;
2. `remove` — shu qirraning o‘ng uchida;
3. `vertical` — vertikal qirra uchun;
4. `get` — so‘rov nuqtasi uchun.

Bir xil $x$ koordinatadagi hodisalar `vertical`, `get`, `remove`, `add` tartibida qayta ishlanadi. Degenerativ holatlarni qamrab olish uchun shu $x$ dagi barcha hodisalar bajarilgach `get` so‘rovlari ikkinchi marta tekshiriladi va ikki natijadan yaxshirog‘i olinadi.

Sweep davomida ikki to‘plam saqlanadi:

- `t` — barcha faol vertikal bo‘lmagan qirralar;
- `vert` — joriy $x$ dagi vertikal qirralarning $y$ intervallari.

Yangi $x$ ga o‘tilganda `vert` tozalanadi. Vertikal hodisa tegishli intervalni `vert` ga qo‘shadi. `add` va `remove` hodisalari qirrani `t` ga qo‘shadi yoki undan o‘chiradi. `get` hodisasida avval nuqta biror vertikal qirrada yotishi ikkilik qidiruv bilan tekshiriladi. Aks holda `t` ichidan nuqtaning bevosita pastidagi qirra topiladi.

### Faol qirralar tartibi

Ikki qirra $(a,b)$ va $(c,d)$ uchun biri ikkinchisidan hech qachon yuqorida emasligini, ular umumiy $x$ oralig‘ida kesishmasligini hisobga olib, orientatsiyalar orqali aniqlash mumkin. Psevdokod:

```text
val = sgn((b-a) × (c-a)) + sgn((b-a) × (d-a))
if val != 0:
    return val > 0
val = sgn((d-c) × (a-c)) + sgn((d-c) × (b-c))
return val < 0
```

Planar subdivision qirralari ichki nuqtalarda kesishmagani sababli bu komparator butun umumiy $x$ oralig‘ida izchil tartib beradi.

Har bir so‘rov uchun tegishli pastki qirra topilgach, yuzni aniqlash qoladi. Qirra topilmasa, nuqta tashqi yuzda. Nuqta qirraning ustida bo‘lsa, yuz yagona emas va qirra indeksi qaytariladi. Aks holda nomzodlar qirraning ikki tomonidagi yuzlardir; kerakli yuz qirraning yuqori tomonidagi yuzdir.

Har bir vertikal bo‘lmagan qirra uchun “yuqoridagi yuz” oldindan topiladi. Har bir yuz chegarasi soat miliga teskari aylanganda, qirra bo‘ylab $x$ koordinata ortsa, shu yuz qirraning yuqori tomonida joylashgan bo‘ladi.

## Eslatma

Persistent qidiruv daraxtidan foydalanilsa, har bir $x$ koordinatadagi faol qirralar to‘plamining versiyasi saqlanadi va so‘rovlarni onlayn bajarish mumkin.

## Implementatsiya

Quyidagi skelet butun koordinatalar uchun mo‘ljallangan. Subdivision DCEL ko‘rinishida to‘g‘ri berilgan va tashqi yuz raqami `-1` deb olinadi. Natija `(1, face)` bo‘lsa nuqta yuz ichida, `(0, edge)` bo‘lsa qirra ustida yotadi.

```cpp
using ll = long long;

struct pt {
    ll x, y;
};

pt operator-(pt a, pt b) { return {a.x-b.x, a.y-b.y}; }
ll cross(pt a, pt b) { return a.x*b.y-a.y*b.x; }
ll cross(pt a, pt b, pt c) { return cross(b-a, c-a); }
int sgn(ll x) { return (x>0)-(x<0); }

struct edge {
    pt a, b;
    int id;
    int face_ab; // a -> b yo‘nalishda qirraning chapidagi yuz

    bool vertical() const { return a.x == b.x; }
};

bool on_segment(pt p, const edge& e) {
    return cross(e.a, e.b, p) == 0
        && min(e.a.x,e.b.x) <= p.x && p.x <= max(e.a.x,e.b.x)
        && min(e.a.y,e.b.y) <= p.y && p.y <= max(e.a.y,e.b.y);
}

// a qirra b qirradan pastdami?
struct edge_less {
    const vector<edge>* E;
    bool operator()(int i, int j) const {
        if (i == j) return false;
        const edge &s = (*E)[i], &t = (*E)[j];
        int val = sgn(cross(s.a, s.b, t.a))
                + sgn(cross(s.a, s.b, t.b));
        if (val != 0) return val > 0;
        val = sgn(cross(t.a, t.b, s.a))
            + sgn(cross(t.a, t.b, s.b));
        return val < 0;
    }
};
```

Amaliy yechimda so‘rov qirra emasligi sababli `set::lower_bound` uchun shaffof komparator yoki maxsus vaqtinchalik “gorizontal so‘rov qirrasi” ishlatiladi. Quyidagi yordamchi funksiya qirraning berilgan $x$ dagi balandligini kasrsiz taqqoslaydi:

```cpp
// e(x) <= p.y ekanini tekshiradi; e vertikal emas.
bool not_above(const edge& e, pt p) {
    pt a = e.a, b = e.b;
    if (a.x > b.x) swap(a, b);
    // y(x) = a.y + (b.y-a.y)(x-a.x)/(b.x-a.x)
    __int128 lhs = (__int128)(p.y-a.y) * (b.x-a.x);
    __int128 rhs = (__int128)(b.y-a.y) * (p.x-a.x);
    return lhs >= rhs;
}
```

Har bir `x` guruhida bajariladigan ishning tuzilishi:

```cpp
for (auto& group : events_by_x) {
    vertical_intervals.clear();

    for (auto e : group.vertical)
        vertical_intervals.push_back({min(E[e].a.y,E[e].b.y),
                                      max(E[e].a.y,E[e].b.y), e});
    sort(vertical_intervals.begin(), vertical_intervals.end());

    answer_all(group.queries);       // chap tomondagi holat
    for (int e : group.remove) active.erase(e);
    for (int e : group.add)    active.insert(e);
    answer_all(group.queries);       // o‘ng tomondagi holat
}
```

`answer_all` avval `vertical_intervals` da nuqtani qoplaydigan intervalni izlaydi. Topilmasa, `active` dagi $p$ dan baland bo‘lmagan eng katta qirrani topadi. Nuqta shu qirrada bo‘lsa `(0, edge_id)` qaytariladi; aks holda qirraning yuqori yuz raqami qaytariladi. Birinchi va ikkinchi o‘tish natijalaridan qirra ustida yotishni aniqlagan natija ustun olinadi, aks holda mavjud yuz natijasi ishlatiladi.

Barcha hodisalarni saralash $\mathcal{O}((n+q)\log(n+q))$ vaqt oladi. Har bir qo‘shish, o‘chirish va so‘rov $\mathcal{O}(\log n)$ bo‘lgani uchun umumiy murakkablik ham shu tartibda, xotira esa $\mathcal{O}(n+q)$.

