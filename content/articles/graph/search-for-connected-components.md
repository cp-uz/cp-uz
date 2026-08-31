---
article_id: graph--search-for-connected-components
---
# Grafda bog‘langan komponentlarni topish

$n$ ta tugun va $m$ ta qirraga ega yo‘naltirilmagan $G$ graf berilgan. Undagi barcha bog‘langan komponentlarni, ya’ni har bir guruh ichida istalgan tugundan istalgan boshqa tugunga yetib borish mumkin bo‘lgan, turli guruhlar orasida esa hech qanday yo‘l mavjud bo‘lmagan tugunlar guruhlarini topish talab etiladi.

## Masalani yechish algoritmi

* Masalani yechish uchun chuqurlik bo‘yicha qidiruv yoki kenglik bo‘yicha qidiruvdan foydalanish mumkin.
* Aslida DFSning bir qator ishga tushirishlarini bajaramiz. Birinchi ishga tushirish birinchi tugundan boshlanadi va birinchi bog‘langan komponentdagi barcha tugunlar aylanib chiqiladi, ya’ni topiladi. Keyin qolgan tugunlar orasidan hali tashrif buyurilmagan birinchi tugunni topib, undan chuqurlik bo‘yicha qidiruvni boshlaymiz va shu tariqa ikkinchi bog‘langan komponentni topamiz. Barcha tugunlarga tashrif buyurilguncha shu jarayon davom etadi.
* Algoritmning umumiy asimptotik ishlash vaqti $O(n+m)$. Haqiqatan, algoritm bir tugunni ikki marta qayta ishlamaydi; demak har bir qirra aynan ikki marta — qirraning har bir uchidan bittadan — ko‘riladi.

## Implementatsiya

``` cpp
int n;
vector<vector<int>> adj;
vector<bool> used;
vector<int> comp;

void dfs(int v) {
    used[v] = true;
    comp.push_back(v);
    for (int u : adj[v]) {
        if (!used[u])
            dfs(u);
    }
}

void find_comps() {
    used.assign(n, false);
    for (int v = 0; v < n; ++v) {
        if (!used[v]) {
            comp.clear();
            dfs(v);
            cout << "Component:" ;
            for (int u : comp)
                cout << ' ' << u;
            cout << endl ;
        }
    }
}
```

* Asosiy funksiya `find_comps()` bo‘lib, u grafning bog‘langan komponentlarini topadi va chiqaradi.
* Graf qo‘shnilik ro‘yxati ko‘rinishida saqlanadi, ya’ni `adj[v]` da `v` tugundan qirra boradigan tugunlar ro‘yxati turadi.
* `comp` vektori joriy bog‘langan komponentdagi tugunlar ro‘yxatini saqlaydi.

## Kodning iterativ implementatsiyasi

Juda chuqur rekursiv funksiyalar odatda muammo tug‘diradi. Har bir rekursiv chaqiruv stekda oz miqdorda xotira talab qiladi, dasturlarda esa odatda stek uchun ajratilgan joy cheklangan. Shu sababli millionlab tugunli bog‘langan grafda rekursiv DFS bajarganda stek toshib ketishi mumkin.

Rekursiv dasturni stek ma’lumotlar tuzilmasini qo‘lda yuritish orqali har doim iterativ dasturga aylantirish mumkin. Bu ma’lumotlar tuzilmasi heap xotirasida ajratilgani sababli chaqiruvlar stekining toshib ketishi yuz bermaydi.

```cpp
int n;
vector<vector<int>> adj;
vector<bool> used;
vector<int> comp;

void dfs(int v) {
    stack<int> st;
    st.push(v);
    
    while (!st.empty()) {
        int curr = st.top();
        st.pop();
        if (!used[curr]) {
            used[curr] = true;
            comp.push_back(curr);
            for (int i = adj[curr].size() - 1; i >= 0; i--) {
                st.push(adj[curr][i]);
            }
        }
    }
}

void find_comps() {
    used.assign(n, false);
    for (int v = 0; v < n ; ++v) {
        if (!used[v]) {
            comp.clear();
            dfs(v);
            cout << "Component:" ;
            for (int u : comp)
                cout << ' ' << u;
            cout << endl ;
        }
    }
}
```

## Mashq masalalari

- [SPOJ: CT23E](http://www.spoj.com/problems/CT23E/)
- [CODECHEF: GERALD07](https://www.codechef.com/MARCH14/problems/GERALD07)
- [CSES: Building Roads](https://cses.fi/problemset/task/1666)

