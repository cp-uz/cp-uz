---
article_id: graph--lca_binary_lifting
---
# Eng yaqin umumiy ajdod — ikkilik ko‘tarilish

$G$ daraxt bo‘lsin.

Har bir `(u, v)` ko‘rinishidagi so‘rov uchun `u` va `v` tugunlarning eng yaqin umumiy ajdodini topmoqchimiz; ya’ni `u` dan ildizgacha yo‘lda ham, `v` dan ildizgacha yo‘lda ham yotadigan va bunday tugunlar bir nechta bo‘lsa, ildizdan eng uzoq joylashgan `w` tugunni topamiz.

Boshqacha aytganda, kerakli `w` tugun `u` va `v` ning eng quyi ajdodidir.

Xususan, `u` tugun `v` ning ajdodi bo‘lsa, `u` ularning eng yaqin umumiy ajdodi bo‘ladi.

Ushbu maqolada tavsiflanadigan algoritm daraxtga oldindan ishlov berish uchun $O(N \log N)$, keyin har bir LCA so‘rovi uchun $O(\log N)$ vaqt talab qiladi.

## Algoritm

Har bir tugun uchun undan bir pog‘ona yuqoridagi, ikki pog‘ona yuqoridagi, to‘rt pog‘ona yuqoridagi va hokazo ajdodlarni oldindan hisoblaymiz.

Ularni `up` massivida saqlaylik, ya’ni `up[i][j]` — `i` tugundan `2^j` pog‘ona yuqoridagi ajdod; bunda `i=1...N`, `j=0...ceil(log(N))`.

Bu ma’lumot istalgan tugundan yuqoridagi istalgan ajdodga $O(\log N)$ vaqtda sakrash imkonini beradi.

Ushbu massivni daraxt bo‘ylab [DFS](depth-first-search.md) yurishi yordamida hisoblash mumkin.

Har bir tugun uchun unga birinchi tashrif vaqti (ya’ni DFS tugunni kashf etgan vaqt) hamda undan chiqish vaqti (ya’ni barcha bolalarga tashrif buyurilib, DFS funksiyasidan chiqilgan vaqt)ni ham eslab qolamiz.

Bu ma’lumot yordamida bir tugun boshqasining ajdodi ekanini o‘zgarmas vaqtda aniqlash mumkin.

Endi `(u, v)` so‘rovini olganimizni faraz qilaylik.

Bir tugun ikkinchisining ajdodi yoki yo‘qligini darhol tekshira olamiz.

Bu holatda o‘sha tugunning o‘zi LCA bo‘ladi.

Agar `u` tugun `v` ning ajdodi ham, `v` tugun `u` ning ajdodi ham bo‘lmasa, `u` ning ajdodlari bo‘ylab `v` ning ajdodi bo‘lmagan eng yuqori (ya’ni ildizga eng yaqin) tugunni topguncha ko‘tarilamiz (ya’ni `x` tugun `v` ning ajdodi emas, ammo `up[x][0]` uning ajdodi bo‘ladi).

Bu `x` tugunni `up` massivi yordamida $O(\log N)$ vaqtda topish mumkin.

Jarayonni batafsilroq tavsiflaymiz.

`L = ceil(log(N))` bo‘lsin.

Dastlab `i = L` deb faraz qilaylik.

Agar `up[u][i]` tugun `v` ning ajdodi bo‘lmasa, `u = up[u][i]` deb olamiz va `i` ni kamaytiramiz.

Agar `up[u][i]` ajdod bo‘lsa, faqat `i` ni kamaytiramiz.

Barcha manfiy bo‘lmagan `i` lar uchun buni bajargach, `u` kerakli tugun bo‘lishi ravshan: `u` hali ham `v` ning ajdodi emas, ammo `up[u][0]` uning ajdodi.

Endi LCA javobi, ravshanki, `up[u][0]` — ya’ni `u` tugunning `v` ga ham ajdod bo‘lgan eng quyi ajdodi — bo‘ladi.

Demak, LCA so‘roviga javob berishda `i` `ceil(log(N))` dan `0` gacha ko‘rib chiqiladi va har iteratsiyada bir tugun ikkinchisining ajdodi yoki yo‘qligi tekshiriladi.

Natijada har bir so‘rovga $O(\log N)$ vaqtda javob berish mumkin.

## Implementatsiya

```cpp
int n, l;
vector<vector<int>> adj;

int timer;
vector<int> tin, tout;
vector<vector<int>> up;

void dfs(int v, int p)
{
    tin[v] = ++timer;
    up[v][0] = p;
    for (int i = 1; i <= l; ++i)
        up[v][i] = up[up[v][i-1]][i-1];

    for (int u : adj[v]) {
        if (u != p)
            dfs(u, v);
    }

    tout[v] = ++timer;
}

bool is_ancestor(int u, int v)
{
    return tin[u] <= tin[v] && tout[u] >= tout[v];
}
int lca(int u, int v)
{
    if (is_ancestor(u, v))
        return u;
    if (is_ancestor(v, u))
        return v;
    for (int i = l; i >= 0; --i) {
        if (!is_ancestor(up[u][i], v))
            u = up[u][i];
    }
    return up[u][0];
}

void preprocess(int root) {
    tin.resize(n);
    tout.resize(n);
    timer = 0;
    l = ceil(log2(n));
    up.assign(n, vector<int>(l + 1));
    dfs(root, root);
}
```

## Amaliy masalalar

* [LeetCode - Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node)
* [Codechef - Longest Good Segment](https://www.codechef.com/problems/LGSEG)
* [HackerEarth - Optimal Connectivity](https://www.hackerearth.com/practice/algorithms/graphs/graph-representation/practice-problems/algorithm/optimal-connectivity-c6ae79ca/)

