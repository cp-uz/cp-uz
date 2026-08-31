---
article_id: graph--bridge-searching
---
# Grafdagi ko‘priklarni $O(N+M)$ vaqtda topish

Bizga yo‘naltirilmagan graf berilgan. Olib tashlanganda graf uzilib qoladigan, aniqroq aytganda grafdagi bog‘langan komponentlar sonini oshiradigan qirra **ko‘prik** deb ataladi. Vazifa berilgan grafdagi barcha ko‘priklarni topishdan iborat.

Norasmiy tarzda masalani shunday ifodalash mumkin: yo‘llar bilan bog‘langan shaharlar xaritasi berilgan; olib tashlanganda biror shaharlar jufti orasidagi yo‘l yo‘qolib ketadigan barcha «muhim» yo‘llarni topish kerak.

Bu yerda tavsiflanadigan algoritm [chuqurlik bo‘yicha qidiruvga](depth-first-search.md) asoslanadi va $O(N+M)$ murakkablikka ega; bu yerda $N$ — tugunlar, $M$ esa qirralar soni.

[Ko‘priklarni onlayn topish](bridge-searching-online.md) haqida alohida maqola ham mavjud. Bu yerda bayon qilinadigan offline algoritmdan farqli ravishda, onlayn algoritm o‘zgarib turadigan grafda barcha ko‘priklar ro‘yxatini saqlab boradi; bunda grafga faqat yangi qirralar qo‘shiladi deb faraz qilinadi.

## Algoritm

Grafning ixtiyoriy `root` tugunini tanlab, undan [chuqurlik bo‘yicha qidiruv](depth-first-search.md) boshlaymiz. Quyidagi, isbotlash oson bo‘lgan faktga e’tibor bering:

- DFS ichida $v$ tugundan chiquvchi qirralarni ko‘rib chiqayotgan bo‘laylik. Joriy $(v,to)$ qirra ko‘prik bo‘lishi uchun va faqat shundagina DFS daraxtidagi $to$ tugun va uning hech bir avlodidan $v$ tugunga yoki $v$ ning biror ajdodiga orqa qirra bo‘lmasligi kerak. Haqiqatan, bu shart $v$ dan $to$ ga $(v,to)$ qirradan boshqa yo‘l yo‘qligini anglatadi.

Endi bu faktni har bir tugun uchun samarali tekshirishni o‘rganishimiz kerak. Chuqurlik bo‘yicha qidiruv hisoblaydigan «tugunga kirish vaqti»dan foydalanamiz.

$\texttt{tin}[v]$ qiymat $v$ tugunga kirish vaqtini bildirsin. Bundan tashqari, $\texttt{low}$ massivini kiritamiz. U $v$ tugunning o‘zidan yoki uning avlodlaridan bitta qirra yordamida yetish mumkin bo‘lgan DFS tugunlari orasidagi eng erta kirish vaqtini saqlaydi.

$\texttt{low}[v]$ — $\texttt{tin}[v]$, $(v,p)$ orqa qirra bilan $v$ ga ulangan har bir $p$ tugunning $\texttt{tin}[p]$ kirish vaqti hamda DFS daraxtida $v$ ning bevosita avlodi bo‘lgan har bir $to$ tugunning $\texttt{low}[to]$ qiymatlari minimumidir:

$$\texttt{low}[v] = \min \left\{
    \begin{array}{ll}
    \texttt{tin}[v] \\
    \texttt{tin}[p]  &\text{ barcha }p\text{ uchun, agar }(v,p)\text{ orqa qirra bo‘lsa} \\
    \texttt{low}[to] &\text{ barcha }to\text{ uchun, agar }(v,to)\text{ daraxt qirrasi bo‘lsa}
    \end{array}
\right\}$$

$v$ tugundan yoki uning biror avlodidan $v$ ning biror ajdodiga orqa qirra mavjud bo‘lishi uchun va faqat shundagina $v$ ning shunday $to$ farzandi mavjud bo‘ladiki, $\texttt{low}[to] \leq \texttt{tin}[v]$. Agar $\texttt{low}[to] = \texttt{tin}[v]$ bo‘lsa, orqa qirra bevosita $v$ ga keladi; aks holda u $v$ ning ajdodlaridan biriga keladi.

Demak DFS daraxtidagi joriy $(v,to)$ qirra ko‘prik bo‘lishi uchun va faqat shundagina

$$\texttt{low}[to] > \texttt{tin}[v]$$

bo‘lishi kerak.

## Implementatsiya

Implementatsiya uchta holatni farqlashi kerak: DFS daraxtidagi qirra bo‘ylab pastga tushish, tugunning ajdodiga qaytuvchi orqa qirrani topish va tugunning otasiga qaytish. Bu holatlar quyidagicha:

- $\texttt{visited}[to] = false$ — qirra DFS daraxtining bir qismi;
- $\texttt{visited}[to] = true$ va $to \ne parent$ — qirra ajdodlardan biriga boruvchi orqa qirra;
- $to = parent$ — qirra DFS daraxtida otaga qaytadi.

Buni amalga oshirish uchun joriy tugunning ota tugunini parametr sifatida qabul qiladigan chuqurlik bo‘yicha qidiruv funksiyasi kerak.

Parallel qirralar mavjud bo‘lgan holatda ota tomonga ketuvchi qirrani e’tiborsiz qoldirishda ehtiyot bo‘lish lozim. Buning uchun `parent_skipped` bayrog‘ini qo‘shamiz; u ota tugunga olib boradigan qirralardan faqat bittasini tashlab ketishimizni kafolatlaydi.

```{.cpp file=bridge_searching_offline}
void IS_BRIDGE(int v,int to); // some function to process the found bridge
int n; // number of nodes
vector<vector<int>> adj; // adjacency list of graph
vector<bool> visited;
vector<int> tin, low;
int timer;

void dfs(int v, int p = -1) {
    visited[v] = true;
    tin[v] = low[v] = timer++;
    bool parent_skipped = false;
    for (int to : adj[v]) {
        if (to == p && !parent_skipped) {
            parent_skipped = true;
            continue;
        }
        if (visited[to]) {
            low[v] = min(low[v], tin[to]);
        } else {
            dfs(to, v);
            low[v] = min(low[v], low[to]);
            if (low[to] > tin[v])
                IS_BRIDGE(v, to);
        }
    }
}

void find_bridges() {
    timer = 0;
    visited.assign(n, false);
    tin.assign(n, -1);
    low.assign(n, -1);
    for (int i = 0; i < n; ++i) {
        if (!visited[i])
            dfs(i);
    }
}
```

Asosiy funksiya `find_bridges` bo‘lib, u zarur boshlang‘ich qiymatlarni o‘rnatadi va grafning har bir bog‘langan komponentida chuqurlik bo‘yicha qidiruvni boshlaydi.

`IS_BRIDGE(a,b)` — $(a,b)$ qirra ko‘prik ekanini qayta ishlaydigan funksiya; masalan, u qirrani ekranga chiqarishi mumkin.

Bu implementatsiya parallel qirralarni hisobga olmasa noto‘g‘ri ishlashi mumkin. Albatta parallel qirra hech qachon javobning bir qismi bo‘lmaydi, shuning uchun `IS_BRIDGE` xabar qilingan qirra parallel qirra emasligini qo‘shimcha tekshirishi mumkin. Boshqa yo‘l — `dfs` funksiyasiga ota tugun o‘rniga tugunga kirishda ishlatilgan qirraning indeksini uzatish va barcha qirralarning indekslarini saqlash.

## Mashq masalalari

- [UVA #796 "Critical Links"](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=737) [qiyinlik: oson]
- [UVA #610 "Street Directions"](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=551) [qiyinlik: o‘rta]
- [Case of the Computer Network (Codeforces Round #310 Div. 1 E)](http://codeforces.com/problemset/problem/555/E) [qiyinlik: qiyin]
* [UVA 12363 - Hedge Mazes](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3785)
* [UVA 315 - Network](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=251)
* [GYM - Computer Network (J)](http://codeforces.com/gym/100114)
* [SPOJ - King Graffs Defense](http://www.spoj.com/problems/GRAFFDEF/)
* [SPOJ - Critical Edges](http://www.spoj.com/problems/EC_P/)
* [Codeforces - Break Up](http://codeforces.com/contest/700/problem/C)
* [Codeforces - Tourist Reform](http://codeforces.com/contest/732/problem/F)
* [Codeforces - Non-academic problem](https://codeforces.com/contest/1986/problem/F)

