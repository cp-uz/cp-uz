---
article_id: graph--dinic
---
# Maksimal oqim — Dinic algoritmi

Dinic algoritmi maksimal oqim masalasini $O(V^2E)$ vaqtda yechadi. Maksimal oqim masalasi [Maksimal oqim — Ford–Fulkerson va Edmonds–Karp](edmonds_karp.md) maqolasida ta’riflangan. Bu algoritmni 1970-yilda Yefim Dinitz kashf qilgan.

## Ta’riflar

$G$ tarmog‘ining **qoldiq tarmog‘i** $G^R$ — $G$ dagi har bir $(v, u)$ qirra uchun ikkita qirrani o‘z ichiga oladigan tarmoq:<br>

- sig‘imi $c_{vu}^R = c_{vu} - f_{vu}$ bo‘lgan $(v, u)$ qirra;
- sig‘imi $c_{uv}^R = f_{vu}$ bo‘lgan $(u, v)$ qirra.

Biror tarmoqning **bloklovchi oqimi** — $s$ dan $t$ gacha bo‘lgan har bir yo‘lda shu oqim tomonidan to‘yintirilgan kamida bitta qirra mavjud bo‘ladigan oqimdir. Bloklovchi oqim maksimal bo‘lishi shart emasligini unutmang.
$G$ tarmoqning **qatlamli tarmog‘i** quyidagicha quriladi. Avval har bir $v$ tugun uchun $level[v]$ — faqat musbat sig‘imli qirralardan foydalanib $s$ dan bu tugungacha bo‘lgan eng qisqa (vaznsiz) yo‘lni hisoblaymiz. Keyin faqat $level[v] + 1 = level[u]$ shartini qanoatlantiradigan $(v, u)$ qirralarni qoldiramiz. Ravshanki, bu tarmoq asiklikdir.

## Algoritm

Algoritm bir necha fazadan iborat. Har bir fazada $G$ ning qoldiq tarmog‘i uchun qatlamli tarmoq quramiz. Keyin qatlamli tarmoqda ixtiyoriy bloklovchi oqimni topib, uni joriy oqimga qo‘shamiz.

## To‘g‘rilik isboti

Algoritm tugasa, maksimal oqimni topishini ko‘rsatamiz.

Agar algoritm tugagan bo‘lsa, u qatlamli tarmoqda bloklovchi oqim topa olmagan. Demak, qatlamli tarmoqda $s$ dan $t$ gacha yo‘l yo‘q. Bu qoldiq tarmoqda ham $s$ dan $t$ gacha yo‘l yo‘qligini anglatadi. Demak, oqim maksimal.

## Fazalar soni

Algoritm $V$ tadan kam fazada tugaydi. Buni isbotlash uchun avval ikkita lemmani isbotlaymiz.

**1-lemma.** Har bir iteratsiyadan keyin $s$ dan istalgan tugungacha bo‘lgan masofalar kamaymaydi, ya’ni $level_{i+1}[v] \ge level_i[v]$.

**Isbot.** $i$-faza va $v$ tugunni mahkamlaymiz. $G_{i+1}^R$ da $s$ dan $v$ gacha bo‘lgan ixtiyoriy eng qisqa $P$ yo‘lni ko‘ramiz. $P$ ning uzunligi $level_{i+1}[v]$ ga teng. $G_{i+1}^R$ faqat $G_i^R$ dagi qirralar va $G_i^R$ qirralariga teskari qirralarni o‘z ichiga olishi mumkinligini qayd etamiz. Agar $P$ da $G_i^R$ ga nisbatan teskari qirra bo‘lmasa, $P$ $G_i^R$ da ham yo‘l bo‘lgani uchun $level_{i+1}[v] \ge level_i[v]$. Endi $P$ da kamida bitta teskari qirra bor deb faraz qilamiz.
Birinchi shunday qirra $(u, w)$ bo‘lsin. Birinchi holatga ko‘ra $level_{i+1}[u] \ge level_i[u]$. $(u, w)$ qirra $G_i^R$ ga tegishli emas, demak $(w, u)$ qirra avvalgi iteratsiyadagi bloklovchi oqim ta’sirida bo‘lgan. Bundan $level_i[u] = level_i[w] + 1$ kelib chiqadi. Shuningdek, $level_{i+1}[w] = level_{i+1}[u] + 1$. Shu ikki tenglik va $level_{i+1}[u] \ge level_i[u]$ dan $level_{i+1}[w] \ge level_i[w] + 2$ ni olamiz. Endi yo‘lning qolgan qismi uchun ham xuddi shu fikrdan foydalanish mumkin.

**2-lemma.** $level_{i+1}[t] > level_i[t]$.

**Isbot.** Oldingi lemmaga ko‘ra $level_{i+1}[t] \ge level_i[t]$. $level_{i+1}[t] = level_i[t]$ deb faraz qilamiz. $G_{i+1}^R$ faqat $G_i^R$ dagi qirralar va $G_i^R$ qirralariga teskari qirralarni o‘z ichiga olishi mumkin. Bu $G_i^R$ da bloklovchi oqim tomonidan bloklanmagan eng qisqa yo‘l mavjudligini anglatadi. Bu qarama-qarshilik.

Ushbu ikki lemmadan fazalar soni $V$ dan kam ekanini olamiz: $level[t]$ ortadi, lekin u $V - 1$ dan katta bo‘la olmaydi.

## Bloklovchi oqimni topish

Har bir iteratsiyada bloklovchi oqimni topish uchun, oqim yuborish mumkin ekan, qatlamli tarmoqda $s$ dan $t$ ga DFS yordamida oqim yuborishga urinib ko‘rishimiz mumkin. Buni tezroq bajarish uchun endi oqim yuborishda ishlatib bo‘lmaydigan qirralarni chiqarib tashlash kerak. Buning uchun har bir tugunda ishlatilishi mumkin bo‘lgan keyingi qirrani ko‘rsatadigan ko‘rsatkich saqlash mumkin.
Bitta DFS ishga tushishi $O(k+V)$ vaqt oladi, bu yerda $k$ — shu ishga tushishda ko‘rsatkich siljishlari soni. Barcha ishga tushishlar bo‘yicha ko‘rsatkich siljishlari soni $E$ dan oshmaydi. Boshqa tomondan, har bir ishga tushish kamida bitta qirrani to‘yintirgani sababli ishga tushishlarning jami soni ham $E$ dan oshmaydi. Demak, bloklovchi oqimni topishning jami vaqti $O(VE)$.

## Murakkablik

Fazalar soni $V$ dan kam, shuning uchun umumiy murakkablik $O(V^2E)$.

## Birlik tarmoqlar

**Birlik tarmoq** — $s$ va $t$ dan boshqa istalgan tugun uchun **kiruvchi yoki chiquvchi qirralardan biri yagona va birlik sig‘imga ega** bo‘lgan tarmoq. Matching masalasini oqim yordamida yechish uchun quradigan tarmog‘imiz aynan shunday bo‘ladi.

Birlik tarmoqlarda Dinic algoritmi $O(E\sqrt{V})$ vaqtda ishlaydi. Buni isbotlaymiz.

Birinchidan, endi har bir faza $O(E)$ vaqtda ishlaydi, chunki har bir qirra ko‘pi bilan bir marta ko‘rib chiqiladi.
Ikkinchidan, allaqachon $\sqrt{V}$ ta faza bajarilgan deb faraz qilamiz. Unda uzunligi $\le\sqrt{V}$ bo‘lgan barcha oshiruvchi yo‘llar topilgan. $f$ joriy oqim, $f'$ esa maksimal oqim bo‘lsin. Ularning $f' - f$ ayirmasini ko‘ramiz. Bu $G^R$ da qiymati $|f'| - |f|$ bo‘lgan oqim va har bir qirrada uning qiymati $0$ yoki $1$. Uni $s$ dan $t$ gacha bo‘lgan $|f'| - |f|$ ta yo‘lga va ehtimol sikllarga ajratish mumkin.
Tarmoq birlik bo‘lgani uchun bu yo‘llar umumiy tugunga ega bo‘la olmaydi. Shuning uchun tugunlarning umumiy soni $\ge (|f'| - |f|)\sqrt{V}$, ammo u ayni paytda $\le V$. Demak, yana $\sqrt{V}$ ta iteratsiya ichida maksimal oqimni albatta topamiz.

### Birlik sig‘imli tarmoqlar

Barcha qirralar birlik sig‘imga ega, ammo kiruvchi va chiquvchi qirralar soni chegaralanmagan umumiyroq holatda yo‘llar umumiy tugunlarga emas, umumiy qirralarga ega bo‘la olmaydi. Xuddi shunday mulohaza iteratsiyalar soni uchun $\sqrt E$ chegarani isbotlash imkonini beradi; demak, bunday tarmoqlarda Dinic algoritmining ishlash vaqti ko‘pi bilan $O(E \sqrt E)$.
Nihoyat, birlik sig‘imli tarmoqlarda fazalar soni $O(V^{2/3})$ dan oshmasligini ham isbotlash mumkin; bu qirralari ayniqsa ko‘p bo‘lgan tarmoqlar uchun $O(EV^{2/3})$ muqobil bahosini beradi.

## Implementatsiya

```{.cpp file=dinic}
struct FlowEdge {
    int v, u;
    long long cap, flow = 0;
    FlowEdge(int v, int u, long long cap) : v(v), u(u), cap(cap) {}
};

struct Dinic {
    const long long flow_inf = 1e18;
    vector<FlowEdge> edges;
    vector<vector<int>> adj;
    int n, m = 0;
    int s, t;
    vector<int> level, ptr;
    queue<int> q;

    Dinic(int n, int s, int t) : n(n), s(s), t(t) {
        adj.resize(n);
        level.resize(n);
        ptr.resize(n);
    }
    void add_edge(int v, int u, long long cap) {
        edges.emplace_back(v, u, cap);
        edges.emplace_back(u, v, 0);
        adj[v].push_back(m);
        adj[u].push_back(m + 1);
        m += 2;
    }
    bool bfs() {
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int id : adj[v]) {
                if (edges[id].cap == edges[id].flow)
                    continue;
                if (level[edges[id].u] != -1)
                    continue;
                level[edges[id].u] = level[v] + 1;
                q.push(edges[id].u);
            }
        }
        return level[t] != -1;
    }
    long long dfs(int v, long long pushed) {
        if (pushed == 0)
            return 0;
        if (v == t)
            return pushed;
        for (int& cid = ptr[v]; cid < (int)adj[v].size(); cid++) {
            int id = adj[v][cid];
            int u = edges[id].u;
            if (level[v] + 1 != level[u])
                continue;
            long long tr = dfs(u, min(pushed, edges[id].cap - edges[id].flow));
            if (tr == 0)
                continue;
            edges[id].flow += tr;
            edges[id ^ 1].flow -= tr;
            return tr;
        }
        return 0;
    }
    long long flow() {
        long long f = 0;
        while (true) {
            fill(level.begin(), level.end(), -1);
            level[s] = 0;
            q.push(s);
            if (!bfs())
                break;
            fill(ptr.begin(), ptr.end(), 0);
            while (long long pushed = dfs(s, flow_inf)) {
                f += pushed;
            }
        }
        return f;
    }
};
```

## Mashq masalalari

* [SPOJ: FASTFLOW](https://www.spoj.com/problems/FASTFLOW/)

