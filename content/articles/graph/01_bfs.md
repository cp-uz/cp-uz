---
article_id: graph--01_bfs
---
# 0–1 BFS

Ma’lumki, **og‘irliksiz grafda** bitta boshlang‘ich tugundan qolgan barcha tugunlargacha eng qisqa yo‘llarni [kenglik bo‘yicha qidiruv](breadth-first-search.md) yordamida $O(|E|)$ vaqtda topish mumkin; bunda masofa — boshlang‘ich tugundan boshqa tugungacha o‘tish uchun kerak bo‘ladigan qirralarning eng kam sonidir.

Bunday grafni har bir qirrasining og‘irligi $1$ bo‘lgan og‘irlikli graf sifatida ham talqin qilish mumkin.

Agar grafdagi barcha qirralar bir xil og‘irlikka ega bo‘lmasa, $O(|V|^2 + |E|)$ yoki $O(|E| \log |V|)$ vaqtda ishlaydigan [Dijkstra](dijkstra.md) kabi umumiyroq algoritm kerak bo‘ladi.

Biroq og‘irliklar yanada cheklangan bo‘lsa, ko‘pincha bundan yaxshiroq natijaga erishish mumkin.

Ushbu maqolada har bir qirraning og‘irligi $0$ yoki $1$ bo‘lganda, BFS yordamida SSSP (bitta manbadan eng qisqa yo‘llar) masalasini $O(|E|)$ vaqtda qanday yechish mumkinligini ko‘rsatamiz.

## Algoritm

Algoritmni Dijkstra algoritmini sinchiklab o‘rganish va maxsus grafimiz qanday oqibatlarga olib kelishini tahlil qilish orqali hosil qilishimiz mumkin.

Dijkstra algoritmining umumiy ko‘rinishi quyidagicha (bu yerda ustuvor navbat sifatida `set` ishlatilgan):

```cpp
d.assign(n, INF);
d[s] = 0;
set<pair<int, int>> q;
q.insert({0, s});
while (!q.empty()) {
    int v = q.begin()->second;
    q.erase(q.begin());

    for (auto edge : adj[v]) {
        int u = edge.first;
        int w = edge.second;
        if (d[v] + w < d[u]) {
            q.erase({d[u], u});
            d[u] = d[v] + w;
            q.insert({d[u], u});
        }
    }
}
```

Navbatdagi boshlang‘ich `s` tugundan boshqa istalgan ikki tugungacha masofalar orasidagi farq ko‘pi bilan birga teng ekanini ko‘rish mumkin.

Xususan, har bir $u \in Q$ uchun $d[v] \le d[u] \le d[v] + 1$ ekanini bilamiz.

Buning sababi shuki, har bir iteratsiyada navbatga faqat joriy masofaga teng yoki undan birga katta masofali tugunlarni qo‘shamiz.

Faraz qilaylik, navbatda $d[u] - d[v] > 1$ bo‘lgan $u$ mavjud. U holda $u$ navbatga boshqa bir $t$ tugun orqali qo‘shilgan bo‘lishi kerak va $d[t] \ge d[u] - 1 > d[v]$ bo‘ladi.

Ammo buning imkoni yo‘q, chunki Dijkstra algoritmi tugunlarni masofa o‘sish tartibida ko‘rib chiqadi.

Demak, navbat tartibi quyidagicha ko‘rinadi:

$$Q = \underbrace{v}_{d[v]}, \dots, \underbrace{u}_{d[v]}, \underbrace{m}_{d[v]+1} \dots \underbrace{n}_{d[v]+1}$$

Bu tuzilma shu qadar soddaki, haqiqiy ustuvor navbat kerak emas, ya’ni muvozanatlangan ikkilik daraxtdan foydalanish ortiqcha bo‘ladi.

Oddiy ikki uchli navbatdan foydalanishimiz mumkin: agar tegishli qirraning og‘irligi $0$ bo‘lsa, ya’ni $d[u] = d[v]$ bo‘lsa, yangi tugunni navbat boshiga; qirra og‘irligi $1$ bo‘lsa, ya’ni $d[u] = d[v] + 1$ bo‘lsa, navbat oxiriga qo‘shamiz.

Shu tariqa navbat har doim saralangan holda qoladi.

```cpp
vector<int> d(n, INF);
d[s] = 0;
deque<int> q;
q.push_front(s);
while (!q.empty()) {
    int v = q.front();
    q.pop_front();
    for (auto edge : adj[v]) {
        int u = edge.first;
        int w = edge.second;
        if (d[v] + w < d[u]) {
            d[u] = d[v] + w;
            if (w == 1)
                q.push_back(u);
            else
                q.push_front(u);
        }
    }
}
```

## Dial algoritmi

Qirralar og‘irliklariga bundan kattaroq qiymatlarga ega bo‘lishga ruxsat bersak, bu g‘oyani yanada umumlashtirish mumkin.

Agar grafdagi har bir qirraning og‘irligi $\le k$ bo‘lsa, navbatdagi tugunlarning boshlang‘ich tugungacha masofalari $v$ tugunning boshlang‘ich tugungacha masofasidan ko‘pi bilan $k$ ga farq qiladi.

Shuning uchun navbatdagi tugunlar uchun $k + 1$ ta savatcha saqlashimiz mumkin; eng kichik masofaga mos savatcha bo‘shab qolganida, keyingi kattaroq masofali savatchani olish uchun siklik siljitish bajaramiz.

Bu umumlashtirish **Dial algoritmi** deb ataladi.

## Amaliy masalalar

- [Labyrinth](https://codeforces.com/contest/1063/problem/B)
- [KATHTHI](http://www.spoj.com/problems/KATHTHI/)
- [DoNotTurn](https://community.topcoder.com/stat?c=problem_statement&pm=10337)
- [Ocean Currents](https://onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2620)
- [Olya and Energy Drinks](https://codeforces.com/problemset/problem/877/D)
- [Three States](https://codeforces.com/problemset/problem/590/C)
- [Colliding Traffic](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2621)
- [CHamber of Secrets](https://codeforces.com/problemset/problem/173/B)
- [Spiral Maximum](https://codeforces.com/problemset/problem/173/C)
- [Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid)

