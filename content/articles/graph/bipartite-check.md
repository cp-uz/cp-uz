---
article_id: graph--bipartite-check
---
# Grafning ikki bo‘lakli ekanini tekshirish

Ikki bo‘lakli graf — tugunlarini ikkita kesishmaydigan to‘plamga shunday ajratish mumkin bo‘lgan grafki, har bir qirra turli to‘plamlardagi ikkita tugunni bog‘laydi (ya’ni bir to‘plamdagi tugunlarni bog‘laydigan qirralar yo‘q). Bu to‘plamlar odatda tomonlar deb ataladi.

Sizga yo‘naltirilmagan graf berilgan. Uning ikki bo‘lakli ekanini tekshiring va agar shunday bo‘lsa, tomonlarini chiqaring.

## Algoritm

Graf faqat va faqat uning barcha sikllari juft uzunlikka ega bo‘lsa ikki bo‘lakli bo‘lishini aytadigan teorema mavjud. Ammo amalda ta’rifning boshqa ifodasidan foydalanish qulayroq: graf faqat va faqat uni ikki rangga bo‘yash mumkin bo‘lsa ikki bo‘laklidir.
Hali tashrif buyurilmagan har bir tugundan boshlab [kenglik bo‘yicha qidiruvlar](breadth-first-search.md) ketma-ketligini bajaramiz. Har bir qidiruvda boshlang‘ich tugunni 1-tomonga biriktiramiz. Biror tomonga biriktirilgan tugunning hali tashrif buyurilmagan qo‘shnisiga har safar borganda uni ikkinchi tomonga biriktiramiz.
Biror tomonga biriktirilgan tugunning allaqachon tashrif buyurilgan qo‘shnisiga o‘tmoqchi bo‘lsak, u boshqa tomonga biriktirilganini tekshiramiz; agar u ayni tomonga biriktirilgan bo‘lsa, graf ikki bo‘lakli emas degan xulosaga kelamiz. Barcha tugunlarga tashrif buyurib, ularni tomonlarga muvaffaqiyatli biriktirsak, graf ikki bo‘lakli ekanini bilamiz va uning ajratilishini qurib bo‘lgan bo‘lamiz.

## Implementatsiya

```cpp
int n;
vector<vector<int>> adj;
vector<int> side(n, -1);
bool is_bipartite = true;
queue<int> q;
for (int st = 0; st < n; ++st) {
    if (side[st] == -1) {
        q.push(st);
        side[st] = 0;
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int u : adj[v]) {
                if (side[u] == -1) {
                    side[u] = side[v] ^ 1;
                    q.push(u);
                } else {
                    is_bipartite &= side[u] != side[v];
                }
            }
        }
    }
}
cout << (is_bipartite ? "YES" : "NO") << endl;
```

### Mashq masalalari:

- [SPOJ - BUGLIFE](http://www.spoj.com/problems/BUGLIFE/)
- [Codeforces - Graph Without Long Directed Paths](https://codeforces.com/contest/1144/problem/F)
- [Codeforces - String Coloring (easy version)](https://codeforces.com/contest/1296/problem/E1)
- [CSES : Building Teams](https://cses.fi/problemset/task/1668)
- [Codeforces - Alternating Path](https://codeforces.com/contest/2204/problem/D)

