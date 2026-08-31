---
article_id: graph--mst_kruskal_with_dsu
---
# Minimal ostov daraxt — DSU bilan Kruskal algoritmi

Minimal ostov daraxt masalasi va Kruskal algoritmi haqidagi tushuntirish uchun avval [Kruskal algoritmi haqidagi asosiy maqola](mst_kruskal.md)ni o‘qing.

Ushbu maqolada Kruskal algoritmini implementatsiya qilish uchun [“Kesishmaydigan to‘plamlar birlashmasi”](../data_structures/disjoint_set_union.md) ma’lumotlar tuzilmasidan foydalanamiz; bu algoritmga $O(M \log N)$ vaqt murakkabligiga erishish imkonini beradi.

## Tavsif

Kruskal algoritmining sodda ko‘rinishidagi kabi, grafning barcha qirralarini og‘irlik bo‘yicha kamaymaydigan tartibda saralaymiz.

Keyin `make_set` funksiyasini chaqirish orqali har bir tugunni o‘zining alohida daraxtiga (ya’ni alohida to‘plamiga) joylaymiz — bu jami $O(N)$ vaqt oladi.

Barcha qirralarni saralangan tartibda ko‘rib chiqamiz va har bir qirra uchun uning uchlari turli daraxtlarga tegishli yoki yo‘qligini aniqlaymiz (har biri $O(1)$ bo‘lgan ikkita `find_set` chaqiruvi bilan).

Nihoyat, ikkita daraxtni (to‘plamni) birlashtirishimiz kerak; buning uchun DSU ning `union_sets` funksiyasi chaqiriladi — bu ham $O(1)$.

Shunday qilib, umumiy vaqt murakkabligi $O(M \log N + N + M)$ = $O(M \log N)$ bo‘ladi.

## Implementatsiya

Quyida rank bo‘yicha birlashtirishdan foydalanadigan Kruskal algoritmi implementatsiyasi keltirilgan.

```cpp
vector<int> parent, rank;

void make_set(int v) {
    parent[v] = v;
    rank[v] = 0;
}

int find_set(int v) {
    if (v == parent[v])
        return v;
    return parent[v] = find_set(parent[v]);
}
void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) {
        if (rank[a] < rank[b])
            swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b])
            rank[a]++;
    }
}

struct Edge {
    int u, v, weight;
    bool operator<(Edge const& other) {
        return weight < other.weight;
    }
};

int n;
vector<Edge> edges;

int cost = 0;
vector<Edge> result;
parent.resize(n);
rank.resize(n);
for (int i = 0; i < n; i++)
    make_set(i);
sort(edges.begin(), edges.end());

for (Edge e : edges) {
    if (find_set(e.u) != find_set(e.v)) {
        cost += e.weight;
        result.push_back(e);
        union_sets(e.u, e.v);
    }
}
```

E’tibor bering: minimal ostov daraxt aynan $N-1$ ta qirrani o‘z ichiga olgani sababli, shuncha qirra topilishimiz bilanoq `for` siklini to‘xtatishimiz mumkin.

## Amaliy masalalar

Bu mavzudagi amaliy masalalar ro‘yxati uchun [Kruskal algoritmi haqidagi asosiy maqola](mst_kruskal.md)ga qarang.

