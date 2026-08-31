---
article_id: graph--tree_painting
---
# Daraxt qirralarini bo‘yash

Bu juda ko‘p uchraydigan masala. $N$ ta tugundan iborat $G$ daraxti berilgan. So‘rovlarning ikki turi mavjud: birinchi turda qirra bo‘yaladi, ikkinchi turda esa ikki tugun orasidagi bo‘yalgan qirralar soni so‘raladi.

Bu yerda har bir so‘rovga $O(\log N)$ vaqtda javob beradigan, [segment daraxti](../data_structures/segment_tree.md)dan foydalanuvchi ancha sodda yechimni tasvirlaymiz.
Dastlabki ishlov berish bosqichi $O(N)$ vaqt oladi.

## Algoritm

Avval ikkinchi turdagi har bir $(i,j)$ so‘rovni $(l,i)$ va $(l,j)$ ko‘rinishidagi ikkita so‘rovga ajratish uchun [LCA](lca.md)ni topishimiz kerak; bu yerda $l$ — $i$ va $j$ ning eng quyi umumiy ajdodi.
$(i,j)$ so‘rovining javobi ikkala qism-so‘rov javoblarining yig‘indisiga teng bo‘ladi.
Bu ikki so‘rov maxsus tuzilishga ega: birinchi tugun ikkinchi tugunning ajdodidir.
Maqolaning qolgan qismida faqat mana shunday maxsus so‘rovlar haqida gapiramiz.

Avval **dastlabki ishlov berish** bosqichini tasvirlaymiz.
Daraxt ildizidan chuqurlik bo‘yicha qidiruvni ishga tushiring va ushbu DFS ning Euler aylanib chiqishini yozib boring (qidiruv tugunga birinchi marta kirganida va uning har bir farzandidan qaytganimizda tugun ro‘yxatga qo‘shiladi).
Xuddi shu usuldan LCA uchun dastlabki ishlov berishda ham foydalanish mumkin.
Bu ro‘yxat har bir qirrani o‘z ichiga oladi (ya’ni, agar $i$ va $j$ qirraning uchlari bo‘lsa, ro‘yxatning biror joyida $i$ va $j$ yonma-yon turadi) va qirra unda aynan ikki marta paydo bo‘ladi: to‘g‘ri yo‘nalishda ($i$ dan $j$ ga, bunda $i$ tugun ildizga $j$ dan yaqinroq) va teskari yo‘nalishda ($j$ dan $i$ ga).
Bu qirralar uchun ikkita ro‘yxat quramiz.
Birinchi ro‘yxatda to‘g‘ri yo‘nalishdagi barcha qirralarning rang holati, ikkinchisida esa teskari yo‘nalishdagi barcha qirralarning rang holati saqlanadi.
Qirra bo‘yalgan bo‘lsa $1$, aks holda $0$ dan foydalanamiz.
Bu ikki ro‘yxatning har biri ustida yig‘indi va bitta elementni o‘zgartirishni qo‘llab-quvvatlaydigan segment daraxti quramiz; ularni $T1$ va $T2$ deb ataymiz.

Endi $i$ tugun $j$ tugunning ajdodi bo‘lgan $(i,j)$ so‘roviga javob beraylik.
$i$ va $j$ orasidagi yo‘lda nechta qirra bo‘yalganini aniqlashimiz kerak.
Euler aylanib chiqishida $i$ va $j$ ning birinchi uchrashgan joylarini topamiz; ularning pozitsiyalari mos ravishda $p$ va $q$ bo‘lsin (agar bu pozitsiyalar dastlabki ishlov berishda oldindan hisoblab qo‘yilsa, buni $O(1)$ vaqtda bajarish mumkin).
U holda so‘rovning **javobi** $T1[p..q-1]$ yig‘indisidan $T2[p..q-1]$ yig‘indisini ayirishga teng.

**Nega?**
Euler aylanib chiqishidagi $[p;q]$ kesmani qaraymiz.
U $i$ dan $j$ gacha bizga kerak bo‘lgan yo‘lning barcha qirralarini, shuningdek $i$ dan boshlanuvchi boshqa yo‘llarda yotgan ayrim qirralarni ham o‘z ichiga oladi.
Biroq bizga kerak bo‘lgan qirralar bilan qolgan qirralar orasida bitta muhim farq bor: kerakli qirralar faqat bir marta, to‘g‘ri yo‘nalishda yozilgan bo‘ladi; qolgan barcha qirralar esa ikki marta — bir marta to‘g‘ri va bir marta teskari yo‘nalishda — paydo bo‘ladi.
Shuning uchun $T1[p..q-1] - T2[p..q-1]$ ayirmasi to‘g‘ri javobni beradi ($-1$ kerak, aks holda $j$ tugundan chiqib ketuvchi bitta ortiqcha qirra ham hisobga olinadi).
Segment daraxtidagi yig‘indi so‘rovi $O(\log N)$ vaqtda bajariladi.

**Birinchi turdagi so‘rov**ga (qirrani bo‘yashga) javob berish yanada oson: $T1$ va $T2$ ni yangilash, ya’ni qirramizga mos elementni bittadan o‘zgartirish kifoya (qirrani ro‘yxatda topish ham, agar bu qidiruv dastlabki ishlov berish paytida bajarilsa, $O(1)$ vaqtda mumkin).
Segment daraxtidagi bitta o‘zgartirish $O(\log N)$ vaqtda bajariladi.

## Implementatsiya

Quyida LCA hisoblashni ham o‘z ichiga olgan yechimning to‘liq implementatsiyasi keltirilgan:

```cpp
const int INF = 1000 * 1000 * 1000;

typedef vector<vector<int>> graph;

vector<int> dfs_list;
vector<int> edges_list;
vector<int> h;
void dfs(int v, const graph& g, const graph& edge_ids, int cur_h = 1) {
    h[v] = cur_h;
    dfs_list.push_back(v);
    for (size_t i = 0; i < g[v].size(); ++i) {
        if (h[g[v][i]] == -1) {
            edges_list.push_back(edge_ids[v][i]);
            dfs(g[v][i], g, edge_ids, cur_h + 1);
            edges_list.push_back(edge_ids[v][i]);
            dfs_list.push_back(v);
        }
    }
}

vector<int> lca_tree;
vector<int> first;
void lca_tree_build(int i, int l, int r) {
    if (l == r) {
        lca_tree[i] = dfs_list[l];
    } else {
        int m = (l + r) >> 1;
        lca_tree_build(i + i, l, m);
        lca_tree_build(i + i + 1, m + 1, r);
        int lt = lca_tree[i + i], rt = lca_tree[i + i + 1];
        lca_tree[i] = h[lt] < h[rt] ? lt : rt;
    }
}

void lca_prepare(int n) {
    lca_tree.assign(dfs_list.size() * 8, -1);
    lca_tree_build(1, 0, (int)dfs_list.size() - 1);
    first.assign(n, -1);
    for (int i = 0; i < (int)dfs_list.size(); ++i) {
        int v = dfs_list[i];
        if (first[v] == -1)
            first[v] = i;
    }
}
int lca_tree_query(int i, int tl, int tr, int l, int r) {
    if (tl == l && tr == r)
        return lca_tree[i];
    int m = (tl + tr) >> 1;
    if (r <= m)
        return lca_tree_query(i + i, tl, m, l, r);
    if (l > m)
        return lca_tree_query(i + i + 1, m + 1, tr, l, r);
    int lt = lca_tree_query(i + i, tl, m, l, m);
    int rt = lca_tree_query(i + i + 1, m + 1, tr, m + 1, r);
    return h[lt] < h[rt] ? lt : rt;
}
int lca(int a, int b) {
    if (first[a] > first[b])
        swap(a, b);
    return lca_tree_query(1, 0, (int)dfs_list.size() - 1, first[a], first[b]);
}

vector<int> first1, first2;
vector<char> edge_used;
vector<int> tree1, tree2;

void query_prepare(int n) {
    first1.resize(n - 1, -1);
    first2.resize(n - 1, -1);
    for (int i = 0; i < (int)edges_list.size(); ++i) {
        int j = edges_list[i];
        if (first1[j] == -1)
            first1[j] = i;
        else
            first2[j] = i;
    }
    edge_used.resize(n - 1);
    tree1.resize(edges_list.size() * 8);
    tree2.resize(edges_list.size() * 8);
}

void sum_tree_update(vector<int>& tree, int i, int l, int r, int j, int delta) {
    tree[i] += delta;
    if (l < r) {
        int m = (l + r) >> 1;
        if (j <= m)
            sum_tree_update(tree, i + i, l, m, j, delta);
        else
            sum_tree_update(tree, i + i + 1, m + 1, r, j, delta);
    }
}
int sum_tree_query(const vector<int>& tree, int i, int tl, int tr, int l, int r) {
    if (l > r || tl > tr)
        return 0;
    if (tl == l && tr == r)
        return tree[i];
    int m = (tl + tr) >> 1;
    if (r <= m)
        return sum_tree_query(tree, i + i, tl, m, l, r);
    if (l > m)
        return sum_tree_query(tree, i + i + 1, m + 1, tr, l, r);
    return sum_tree_query(tree, i + i, tl, m, l, m) +
           sum_tree_query(tree, i + i + 1, m + 1, tr, m + 1, r);
}
int query(int v1, int v2) {
    return sum_tree_query(tree1, 1, 0, (int)edges_list.size() - 1, first[v1], first[v2] - 1) -
           sum_tree_query(tree2, 1, 0, (int)edges_list.size() - 1, first[v1], first[v2] - 1);
}
int main() {
    // reading the graph
    int n;
    scanf("%d", &n);
    graph g(n), edge_ids(n);
    for (int i = 0; i < n - 1; ++i) {
        int v1, v2;
        scanf("%d%d", &v1, &v2);
        --v1, --v2;
        g[v1].push_back(v2);
        g[v2].push_back(v1);
        edge_ids[v1].push_back(i);
        edge_ids[v2].push_back(i);
    }

    h.assign(n, -1);
    dfs(0, g, edge_ids);
    lca_prepare(n);
    query_prepare(n);
    for (;;) {
        if () {
            // request for painting edge x;
            // if start = true, then the edge is painted, otherwise the painting
            // is removed
            edge_used[x] = start;
            sum_tree_update(tree1, 1, 0, (int)edges_list.size() - 1, first1[x],
                            start ? 1 : -1);
            sum_tree_update(tree2, 1, 0, (int)edges_list.size() - 1, first2[x],
                            start ? 1 : -1);
        } else {
            // query the number of colored edges on the path between v1 and v2
            int l = lca(v1, v2);
            int result = query(l, v1) + query(l, v2);
            // result - the answer to the request
        }
    }
}
```

