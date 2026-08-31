---
article_id: graph--cutpoints
---
# Grafdagi artikulyatsiya nuqtalarini $O(N+M)$ vaqtda topish

Bizga yo‘naltirilmagan graf berilgan. O‘zi va unga tutash qirralar olib tashlanganda graf uzilib qoladigan, aniqroq aytganda grafdagi bog‘langan komponentlar sonini oshiradigan tugun **artikulyatsiya nuqtasi** yoki **kesuvchi tugun** deb ataladi. Vazifa berilgan grafdagi barcha artikulyatsiya nuqtalarini topishdan iborat.

Bu yerda tavsiflanadigan algoritm [chuqurlik bo‘yicha qidiruvga](depth-first-search.md) asoslanadi va $O(N+M)$ murakkablikka ega; bu yerda $N$ — tugunlar, $M$ esa qirralar soni.

## Algoritm

Grafning ixtiyoriy `root` tugunini tanlab, undan [chuqurlik bo‘yicha qidiruv](depth-first-search.md) boshlaymiz. Quyidagi, isbotlash oson bo‘lgan faktga e’tibor bering.

- DFS ichida $v\ne root$ tugundan chiquvchi qirralarni ko‘rib chiqayotgan bo‘laylik. Agar joriy $(v,to)$ qirra shunday bo‘lsaki, DFS daraxtidagi $to$ tugun yoki uning hech bir avlodidan $v$ ning biror ajdodiga orqa qirra bo‘lmasa, $v$ artikulyatsiya nuqtasidir. Aks holda $v$ artikulyatsiya nuqtasi emas.
- Endi $v=root$ bo‘lgan qolgan holatni ko‘ramiz. Ildiz tugun DFS daraxtida bittadan ko‘p farzandga ega bo‘lishi uchun va faqat shundagina artikulyatsiya nuqtasi bo‘ladi.

Endi bu faktni har bir tugun uchun samarali tekshirishni o‘rganamiz. Chuqurlik bo‘yicha qidiruv hisoblaydigan «tugunga kirish vaqti»dan foydalanamiz.

$tin[v]$ qiymat $v$ tugunga kirish vaqtini bildirsin. Har bir $v$ uchun yuqoridagi faktni tekshirishga imkon beruvchi $low[v]$ massivini kiritamiz. $low[v]$ — $tin[v]$, $(v,p)$ orqa qirra orqali $v$ ga ulangan har bir $p$ tugunning $tin[p]$ kirish vaqti va DFS daraxtida $v$ ning bevosita avlodi bo‘lgan har bir $to$ uchun $low[to]$ qiymatlari minimumidir:

$$low[v] = \min \begin{cases} tin[v] \\ tin[p] &\text{ barcha }p\text{ uchun, agar }(v,p)\text{ orqa qirra bo‘lsa} \\ low[to] &\text{ barcha }to\text{ uchun, agar }(v,to)\text{ daraxt qirrasi bo‘lsa} \end{cases}$$

$v$ tugundan yoki uning avlodlaridan $v$ ning biror ajdodiga orqa qirra mavjud bo‘lishi uchun va faqat shundagina $v$ ning shunday $to$ farzandi mavjud bo‘ladiki, $low[to] < tin[v]$. Agar $low[to] = tin[v]$ bo‘lsa, orqa qirra bevosita $v$ ga keladi; aks holda u $v$ ning ajdodlaridan biriga keladi.

Demak DFS daraxtidagi $v$ tugun uchun shunday $to$ farzand mavjud bo‘lib, $low[to] \geq tin[v]$ bo‘lsa, $v$ artikulyatsiya nuqtasidir; ildiz holati esa alohida ko‘rib chiqiladi.

## Implementatsiya

Implementatsiya uchta holatni farqlashi kerak: DFS daraxtidagi qirra bo‘ylab pastga tushish, tugunning ajdodiga boruvchi orqa qirrani topish va tugunning otasiga qaytish. Holatlar:

- $visited[to]=false$ — qirra DFS daraxtining bir qismi;
- $visited[to]=true$ va $to\ne parent$ — qirra ajdodlardan biriga boruvchi orqa qirra;
- $to=parent$ — qirra DFS daraxtidagi otaga qaytadi.

Buning uchun joriy tugunning ota tugunini parametr sifatida qabul qiladigan chuqurlik bo‘yicha qidiruv funksiyasi kerak.

```cpp
int n; // number of nodes
vector<vector<int>> adj; // adjacency list of graph
vector<bool> visited;
vector<int> tin, low;
int timer;

void dfs(int v, int p = -1) {
    visited[v] = true;
    tin[v] = low[v] = timer++;
    int children=0;
    for (int to : adj[v]) {
        if (to == p) continue;
        if (visited[to]) {
            low[v] = min(low[v], tin[to]);
        } else {
            dfs(to, v);
            low[v] = min(low[v], low[to]);
            if (low[to] >= tin[v] && p!=-1)
                IS_CUTPOINT(v);
            ++children;
        }
    }
    if(p == -1 && children > 1)
        IS_CUTPOINT(v);
}

void find_cutpoints() {
    timer = 0;
    visited.assign(n, false);
    tin.assign(n, -1);
    low.assign(n, -1);
    for (int i = 0; i < n; ++i) {
        if (!visited[i])
            dfs (i);
    }
}
```

Asosiy funksiya `find_cutpoints` bo‘lib, u zarur boshlang‘ich qiymatlarni o‘rnatadi va grafning har bir bog‘langan komponentida chuqurlik bo‘yicha qidiruvni boshlaydi.

`IS_CUTPOINT(a)` — $a$ tugun artikulyatsiya nuqtasi ekanini qayta ishlaydigan funksiya; masalan, u tugunni ekranga chiqarishi mumkin. Ehtiyot bo‘ling: bir tugun uchun bu funksiya bir necha marta chaqirilishi mumkin.

## Mashq masalalari

- [UVA #10199 "Tourist Guide"](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=13&page=show_problem&problem=1140) [qiyinlik: oson]
- [UVA #315 "Network"](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=5&page=show_problem&problem=251) [qiyinlik: oson]
- [SPOJ - Submerging Islands](http://www.spoj.com/problems/SUBMERGE/)
- [Codeforces - Cutting Figure](https://codeforces.com/problemset/problem/193/A)

