---
article_id: graph--finding-cycle
---
# Grafning siklsizligini tekshirish va siklni $O(M)$ vaqtda topish

Ilmoqlar va parallel qirralarsiz yo‘naltirilgan yoki yo‘naltirilmagan grafni ko‘rib chiqamiz. Graf siklsiz yoki yo‘qligini tekshirish, siklsiz bo‘lmasa esa istalgan siklni topishimiz kerak.

Bu masalani [chuqurlik bo‘yicha qidiruv](depth-first-search.md) yordamida $O(M)$ vaqtda yechish mumkin, bu yerda $M$ — qirralar soni.

## Algoritm

Grafda ketma-ket DFS ishga tushiramiz. Dastlab barcha tugunlar oq (0) rangda. Har bir tashrif buyurilmagan (oq) tugundan DFS boshlaymiz, unga kirishda kulrang (1), undan chiqishda esa qora (2) rang beramiz. DFS kulrang tugunga o‘tsa, sikl topilgan bo‘ladi (graf yo‘naltirilmagan bo‘lsa, ota tugunga olib boruvchi qirra hisobga olinmaydi).

Siklning o‘zini `parent` massivi yordamida tiklash mumkin.

## Implementatsiya

Quyida yo‘naltirilgan graf uchun implementatsiya keltirilgan.

```cpp
int n;
vector<vector<int>> adj;
vector<char> color;
vector<int> parent;
int cycle_start, cycle_end;
bool dfs(int v) {
    color[v] = 1;
    for (int u : adj[v]) {
        if (color[u] == 0) {
            parent[u] = v;
            if (dfs(u))
                return true;
        } else if (color[u] == 1) {
            cycle_end = v;
            cycle_start = u;
            return true;
        }
    }
    color[v] = 2;
    return false;
}

void find_cycle() {
    color.assign(n, 0);
    parent.assign(n, -1);
    cycle_start = -1;
    for (int v = 0; v < n; v++) {
        if (color[v] == 0 && dfs(v))
            break;
    }

    if (cycle_start == -1) {
        cout << "Acyclic" << endl;
    } else {
        vector<int> cycle;
        cycle.push_back(cycle_start);
        for (int v = cycle_end; v != cycle_start; v = parent[v])
            cycle.push_back(v);
        cycle.push_back(cycle_start);
        reverse(cycle.begin(), cycle.end());
        cout << "Cycle found: ";
        for (int v : cycle)
            cout << v << " ";
        cout << endl;
    }
}
```

Quyida yo‘naltirilmagan graf uchun implementatsiya keltirilgan.

Yo‘naltirilmagan ko‘rinishda biror `v` tugunga qora rang berilsa, DFS unga boshqa hech qachon tashrif buyurmasligiga e’tibor bering.

Buning sababi — `v` ga birinchi marta tashrif buyurganimizda u bilan bog‘langan barcha qirralarni allaqachon tekshirib bo‘lganmiz.

Agar DFS `v` tugunni qayta ishlashni sikl topmasdan tugatgan bo‘lsa, `v` va uning otasi orasidagi qirra olib tashlangach, `v` ni o‘z ichiga oluvchi bog‘langan komponent daraxt bo‘lishi kerak.

Shuning uchun kulrang va qora holatlarni farqlashning ham hojati yo‘q.

Demak, `color` belgilar vektorini `visited` mantiqiy vektoriga almashtirishimiz mumkin.

```cpp
int n;
vector<vector<int>> adj;
vector<bool> visited;
vector<int> parent;
int cycle_start, cycle_end;
bool dfs(int v, int par) { // passing vertex and its parent vertex
    visited[v] = true;
    for (int u : adj[v]) {
        if(u == par) continue; // skipping edge to parent vertex
        if (visited[u]) {
            cycle_end = v;
            cycle_start = u;
            return true;
        }
        parent[u] = v;
        if (dfs(u, parent[u]))
            return true;
    }
    return false;
}

void find_cycle() {
    visited.assign(n, false);
    parent.assign(n, -1);
    cycle_start = -1;
    for (int v = 0; v < n; v++) {
        if (!visited[v] && dfs(v, parent[v]))
            break;
    }

    if (cycle_start == -1) {
        cout << "Acyclic" << endl;
    } else {
        vector<int> cycle;
        cycle.push_back(cycle_start);
        for (int v = cycle_end; v != cycle_start; v = parent[v])
            cycle.push_back(v);
        cycle.push_back(cycle_start);
        cout << "Cycle found: ";
        for (int v : cycle)
            cout << v << " ";
        cout << endl;
    }
}
```

### Amaliy masalalar:

- [AtCoder : Reachability in Functional Graph](https://atcoder.jp/contests/abc357/tasks/abc357_e)
- [CSES : Round Trip](https://cses.fi/problemset/task/1669)
- [CSES : Round Trip II](https://cses.fi/problemset/task/1678/)

