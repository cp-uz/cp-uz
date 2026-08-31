---
article_id: graph--finding-negative-cycle-in-graph
---
# Grafda manfiy siklni topish

Sizga $N$ ta tugun va $M$ ta qirraga ega yo‘naltirilgan og‘irlikli $G$ grafi berilgan. Agar mavjud bo‘lsa, undagi istalgan manfiy og‘irlikli siklni toping.

Masalaning boshqa ifodasida ular orasida istalgancha kichik og‘irlikli yo‘l mavjud bo‘lgan barcha tugunlar juftlarini topish talab qilinadi.

Masalaning bu ikki variantini turli algoritmlar yordamida yechish qulay, shuning uchun bu yerda ikkalasini ham muhokama qilamiz.

## Bellman–Ford algoritmidan foydalanish

Bellman–Ford algoritmi grafda manfiy og‘irlikli sikl mavjud yoki yo‘qligini tekshirish va mavjud bo‘lsa, shunday sikllardan birini topish imkonini beradi.

Algoritm tafsilotlari [Bellman–Ford](bellman_ford.md) algoritmi haqidagi maqolada tavsiflangan.

Bu yerda uning faqat ushbu masalaga qo‘llanishini bayon qilamiz.

Bellman–Fordning standart implementatsiyasi biror boshlang‘ich $v$ tugundan yetib boriladigan manfiy siklni qidiradi; biroq algoritmni grafdagi istalgan manfiy siklni qidiradigan qilib o‘zgartirish mumkin.

Buning uchun barcha $d[i]$ masofalarni cheksizlikka emas, nolga tenglash kerak — xuddi bir vaqtning o‘zida barcha tugunlardan eng qisqa yo‘llarni qidirayotgandek; bu o‘zgartirish manfiy siklni aniqlashning to‘g‘riligiga ta’sir qilmaydi.

Bellman–Ford algoritmining $N$ ta iteratsiyasini bajaring. Oxirgi iteratsiyada hech qanday o‘zgarish bo‘lmasa, grafda manfiy og‘irlikli sikl yo‘q. Aks holda masofasi o‘zgargan biror tugunni olib, sikl topilguncha uning ajdodlari bo‘yicha yuring. Topilgan sikl kerakli manfiy og‘irlikli sikl bo‘ladi.

### Implementatsiya

```cpp
struct Edge {
    int a, b, cost;
};

int n;
vector<Edge> edges;
const int INF = 1000000000;

void solve() {
    vector<int> d(n, 0);
    vector<int> p(n, -1);
    int x;

    for (int i = 0; i < n; ++i) {
        x = -1;
        for (Edge e : edges) {
            if (d[e.a] + e.cost < d[e.b]) {
                d[e.b] = max(-INF, d[e.a] + e.cost);
                p[e.b] = e.a;
                x = e.b;
            }
        }
    }

    if (x == -1) {
        cout << "No negative cycle found.";
    } else {
        for (int i = 0; i < n; ++i)
            x = p[x];

        vector<int> cycle;
        for (int v = x;; v = p[v]) {
            cycle.push_back(v);
            if (v == x && cycle.size() > 1)
                break;
        }
        reverse(cycle.begin(), cycle.end());

        cout << "Negative cycle: ";
        for (int v : cycle)
            cout << v << ' ';
        cout << endl;
    }
}
```

## Floyd–Warshall algoritmidan foydalanish

Floyd–Warshall algoritmi masalaning ikkinchi variantini — ular orasida eng qisqa yo‘l mavjud bo‘lmagan (ya’ni istalgancha kichik og‘irlikli yo‘l mavjud bo‘lgan) barcha $(i, j)$ tugunlar juftlarini topishni — yechish imkonini beradi.

Tafsilotlarni yana [Floyd–Warshall](all-pair-shortest-path-floyd-warshall.md) maqolasidan topish mumkin; bu yerda uning faqat ushbu masalaga qo‘llanishini tavsiflaymiz.

Grafda Floyd–Warshall algoritmini ishga tushiring.

Dastlab har bir $v$ uchun $d[v][v] = 0$ bo‘ladi.

Ammo algoritm tugagach, agar $v$ dan o‘ziga manfiy uzunlikli yo‘l mavjud bo‘lsa, $d[v][v]$ qiymati $0$ dan kichik bo‘ladi.

Bundan ular orasida eng qisqa yo‘l mavjud bo‘lmagan barcha tugunlar juftlarini ham topish uchun foydalanishimiz mumkin.

Barcha $(i, j)$ tugunlar juftlarini ko‘rib chiqamiz va har bir juft uchun ular orasida eng qisqa yo‘l mavjud yoki yo‘qligini tekshiramiz.

Buning uchun oraliq $t$ tugunning barcha imkoniyatlarini sinab ko‘ramiz.

Agar $d[t][t] < 0$ bo‘lgan (ya’ni manfiy og‘irlikli siklga kiradigan), $i$ dan yetib borish mumkin bo‘lgan va undan $j$ ga yetib borish mumkin bo‘lgan biror oraliq $t$ tugun mavjud bo‘lsa, $(i, j)$ juft uchun eng qisqa yo‘l mavjud emas.

U holda $i$ dan $j$ gacha yo‘lning og‘irligini istalgancha kichik qilish mumkin.

Buni `-INF` bilan belgilaymiz.

### Implementatsiya

```cpp
for (int i = 0; i < n; ++i) {
    for (int j = 0; j < n; ++j) {
        for (int t = 0; t < n; ++t) {
            if (d[i][t] < INF && d[t][t] < 0 && d[t][j] < INF)
                d[i][j] = - INF;
        }
    }
}
```

## Amaliy masalalar

- [UVA: Wormholes](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=499)
- [SPOJ: Alice in Amsterdam, I mean Wonderland](http://www.spoj.com/problems/UCV2013B/)
- [SPOJ: Johnsons Algorithm](http://www.spoj.com/problems/JHNSN/)

