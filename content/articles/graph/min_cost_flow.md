---
article_id: graph--min_cost_flow
---
# Minimal narxli oqim — ketma-ket eng qisqa yo‘llar algoritmi

$n$ ta tugun va $m$ ta qirradan iborat $G$ tarmoq berilgan.
Har bir qirra uchun (umuman olganda yo‘naltirilgan qirralar, ammo quyiga qarang) sig‘im — manfiy bo‘lmagan butun son — va shu qirra bo‘ylab oqimning har bir birligi uchun narx — biror butun son — berilgan.
Shuningdek, $s$ manba va $t$ qabul qiluvchi belgilangan.
Berilgan $K$ qiymat uchun aynan shuncha miqdordagi oqimni topishimiz va shu miqdordagi barcha oqimlar orasidan eng kichik narxliligini tanlashimiz kerak.
Bu masala **minimal narxli oqim masalasi** deb ataladi.

Ba’zan masala biroz boshqacha beriladi:
maksimal oqimni topish va barcha maksimal oqimlar orasidan eng kichik narxliligini tanlash kerak.
Bu **minimal narxli maksimal oqim masalasi** deb ataladi.
Har ikkala masalani ketma-ket eng qisqa yo‘llar algoritmi yordamida samarali yechish mumkin.

## Algoritm

Bu algoritm maksimal oqimni hisoblaydigan [Edmonds–Karp](edmonds_karp.md) algoritmiga juda o‘xshaydi.

### Eng sodda holat

Avval faqat eng sodda holatni ko‘ramiz: graf yo‘naltirilgan va istalgan tugunlar jufti orasida ko‘pi bilan bitta qirra bor (masalan, grafda $(i, j)$ qirra bo‘lsa, $(j, i)$ qirra ayni paytda mavjud bo‘la olmaydi).

Agar $(i, j)$ qirra mavjud bo‘lsa, $U_{i j}$ uning sig‘imi bo‘lsin.
$C_{i j}$ esa $(i, j)$ qirra bo‘ylab oqimning bir birlik narxi bo‘lsin.
Nihoyat, $F_{i, j}$ $(i, j)$ qirra bo‘ylab oqim bo‘lsin.
Dastlab barcha oqim qiymatlari nolga teng.
Tarmoqni quyidagicha **o‘zgartiramiz**:
har bir $(i, j)$ qirra uchun tarmoqqa sig‘imi $U_{j i} = 0$ va narxi $C_{j i} = -C_{i j}$ bo‘lgan **teskari qirra** $(j, i)$ ni qo‘shamiz.
Cheklovlarimizga ko‘ra $(j, i)$ qirra avval tarmoqda bo‘lmagan, shu sabab hali ham multigraf bo‘lmagan tarmoqqa egamiz.
Bundan tashqari, algoritm qadamlari davomida $F_{j i} = -F_{i j}$ shartini doim saqlaymiz.
Biror mahkamlangan $F$ oqim uchun **qoldiq tarmoq**ni quyidagicha aniqlaymiz (Ford–Fulkerson algoritmidagi kabi):
qoldiq tarmoq faqat to‘yinmagan qirralarni, ya’ni $F_{i j} < U_{i j}$ bo‘lgan qirralarni o‘z ichiga oladi va har bir shunday qirraning qoldiq sig‘imi $R_{i j} = U_{i j} - F_{i j}$ ga teng.
Endi minimal narxli oqimni hisoblash **algoritmi** haqida gapirishimiz mumkin.
Algoritmning har bir iteratsiyasida qoldiq grafda $s$ dan $t$ gacha eng qisqa yo‘lni topamiz.
Edmonds–Karpdan farqli ravishda, yo‘lni qirralar soni bo‘yicha emas, uning narxi bo‘yicha eng qisqa qilib qidiramiz.
Agar endi yo‘l mavjud bo‘lmasa, algoritm tugaydi va $F$ oqim izlangan oqim bo‘ladi.
Agar yo‘l topilsa, uning bo‘ylab oqimni imkon qadar oshiramiz (ya’ni yo‘ldagi minimal qoldiq sig‘im $R$ ni topib, oqimni shunga oshiramiz va teskari qirralardagi oqimni ayni miqdorga kamaytiramiz).
Agar biror paytda oqim $K$ qiymatiga yetsa, algoritmni to‘xtatamiz (algoritmning oxirgi iteratsiyasida oqimni yakuniy qiymat $K$ dan oshmaydigan miqdorgagina oshirish kerakligini unutmang).
Agar $K$ ni cheksizlikka tenglasak, algoritm minimal narxli maksimal oqimni topishini ko‘rish qiyin emas.
Demak, masalaning har ikkala variantini bir xil algoritm bilan yechish mumkin.

### Yo‘naltirilmagan graflar / multigraflar

Yo‘naltirilmagan graf yoki multigraf holati konseptual jihatdan yuqoridagi algoritmdan farq qilmaydi.
Algoritm bu graflarda ham ishlaydi.
Ammo uni implementatsiya qilish biroz qiyinlashadi.
**Yo‘naltirilmagan qirra** $(i, j)$ amalda bir xil sig‘im va qiymatlarga ega ikkita yo‘naltirilgan $(i, j)$ va $(j, i)$ qirralar bilan bir xil.
Yuqorida ta’riflangan minimal narxli oqim algoritmi har bir yo‘naltirilgan qirra uchun teskari qirra hosil qilgani sababli, yo‘naltirilmagan qirrani $4$ ta yo‘naltirilgan qirraga ajratadi va natijada **multigraf** hosil bo‘ladi.
**Parallel qirralar** bilan qanday ishlaymiz?
Birinchidan, parallel qirralarning har biri uchun oqim alohida saqlanishi kerak.
Ikkinchidan, eng qisqa yo‘lni qidirishda yo‘lda parallel qirralardan aynan qaysi biri ishlatilgani muhimligini hisobga olish zarur.
Shuning uchun odatdagi ajdodlar massivi bilan birga qaysi qirra orqali kelganimizning raqamini ham saqlashimiz kerak.
Uchinchidan, muayyan qirra bo‘ylab oqim oshirilganda teskari qirradagi oqimni kamaytirish kerak.
Parallel qirralar mavjud bo‘lgani uchun har bir qirra uchun uning teskari qirrasi raqamini saqlashimiz kerak.
Yo‘naltirilmagan graflar yoki multigraflarda boshqa to‘siq yo‘q.

### Murakkablik

Bu yerdagi algoritm umumiy holda kirish hajmiga nisbatan eksponensialdir. Aniqrog‘i, eng yomon holatda har bir iteratsiyada atigi $1$ birlik oqim surishi va hajmi $F$ bo‘lgan minimal narxli oqimni topish uchun $O(F)$ ta iteratsiya bajarishi mumkin. Shunda umumiy ishlash vaqti $O(F \cdot T)$ bo‘ladi, bu yerda $T$ — manbadan qabul qiluvchigacha eng qisqa yo‘lni topish uchun kerak bo‘ladigan vaqt.
Buning uchun [Bellman–Ford](bellman_ford.md) algoritmi ishlatilsa, ishlash vaqti $O(Fmn)$ bo‘ladi. [Dijkstra algoritmi](dijkstra.md)ni shunday o‘zgartirish ham mumkinki, u boshlang‘ich bosqichda $O(nm)$ preprocessing bajaradi, keyin har bir iteratsiyada $O(m \log n)$ vaqtda ishlaydi; umumiy vaqt $O(mn + Fm \log n)$ bo‘ladi.
[Bu yerda](http://web.archive.org/web/20211009144446/https://min-25.hatenablog.com/entry/2018/03/19/235802) shunday graf generatori berilganki, unda bunday algoritm $O(2^{n/2} n^2 \log n)$ vaqt talab qiladi.
O‘zgartirilgan Dijkstra algoritmi [Johnson algoritmi](https://en.wikipedia.org/wiki/Johnson%27s_algorithm)dagi potensiallardan foydalanadi. Ushbu algoritm va Dinic algoritmi g‘oyalarini birlashtirib, iteratsiyalar sonini $F$ dan $\min(F, nC)$ gacha kamaytirish mumkin, bu yerda $C$ — qirralar orasidagi maksimal narx. Potensiallar va ularning Dinic algoritmi bilan birlashtirilishi haqida [bu yerda](https://codeforces.com/blog/entry/105658) batafsil o‘qishingiz mumkin.

## Implementatsiya

Quyida eng sodda holat uchun eng qisqa yo‘llarni topishda [SPFA algoritmi](bellman_ford.md)dan foydalanadigan implementatsiya berilgan.

```{.cpp file=min_cost_flow_successive_shortest_path}
struct Edge
{
    int from, to, capacity, cost;
};

vector<vector<int>> adj, cost, capacity;

const int INF = 1e9;

void shortest_paths(int n, int v0, vector<int>& d, vector<int>& p) {
    d.assign(n, INF);
    d[v0] = 0;
    vector<bool> inq(n, false);
    queue<int> q;
    q.push(v0);
    p.assign(n, -1);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        inq[u] = false;
        for (int v : adj[u]) {
            if (capacity[u][v] > 0 && d[v] > d[u] + cost[u][v]) {
                d[v] = d[u] + cost[u][v];
                p[v] = u;
                if (!inq[v]) {
                    inq[v] = true;
                    q.push(v);
                }
            }
        }
    }
}
int min_cost_flow(int N, vector<Edge> edges, int K, int s, int t) {
    adj.assign(N, vector<int>());
    cost.assign(N, vector<int>(N, 0));
    capacity.assign(N, vector<int>(N, 0));
    for (Edge e : edges) {
        adj[e.from].push_back(e.to);
        adj[e.to].push_back(e.from);
        cost[e.from][e.to] = e.cost;
        cost[e.to][e.from] = -e.cost;
        capacity[e.from][e.to] = e.capacity;
    }
    int flow = 0;
    int cost = 0;
    vector<int> d, p;
    while (flow < K) {
        shortest_paths(N, s, d, p);
        if (d[t] == INF)
            break;

        // find max flow on that path
        int f = K - flow;
        int cur = t;
        while (cur != s) {
            f = min(f, capacity[p[cur]][cur]);
            cur = p[cur];
        }
        // apply flow
        flow += f;
        cost += f * d[t];
        cur = t;
        while (cur != s) {
            capacity[p[cur]][cur] -= f;
            capacity[cur][p[cur]] += f;
            cur = p[cur];
        }
    }

    if (flow < K)
        return -1;
    else
        return cost;
}
```

## Mashq masalalari

* [CSES - Task Assignment](https://cses.fi/problemset/task/2129)
* [CSES - Grid Puzzle II](https://cses.fi/problemset/task/2131)
* [AtCoder - Dream Team](https://atcoder.jp/contests/abc247/tasks/abc247_g)

