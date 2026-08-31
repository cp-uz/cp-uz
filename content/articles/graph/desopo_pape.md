---
article_id: graph--desopo_pape
---
# D´Esopo–Pape algoritmi

Bizga og‘irliklari $w_i$ bo‘lgan, $n$ ta tugun va $m$ ta qirraga ega graf hamda boshlang‘ich $v_0$ tugun berilgan.

Vazifa — $v_0$ tugundan qolgan har bir tugungacha eng qisqa yo‘lni topish.

D´Esopo–Pape algoritmi ko‘p hollarda [Dijkstra algoritmi](dijkstra.md) va [Bellman–Ford algoritmi](bellman_ford.md)dan tezroq ishlaydi hamda manfiy qirralar mavjud bo‘lganda ham ishlaydi.

Ammo manfiy sikllar mavjud bo‘lganda ishlamaydi.

## Tavsif

$d$ massivida eng qisqa yo‘llar uzunliklari saqlansin, ya’ni $d_i$ — $v_0$ tugundan $i$ tugungacha joriy eng qisqa yo‘l uzunligi.

Dastlab bu massivning $d_{v_0} = 0$ elementidan boshqa barcha elementlari cheksizlik bilan to‘ldiriladi.

Algoritm tugagach, ushbu massivda eng qisqa masofalar saqlanadi.

$p$ massivida joriy ajdodlar saqlansin, ya’ni $p_i$ — $v_0$ dan $i$ gacha joriy eng qisqa yo‘lda $i$ tugunning bevosita ajdodi.

$d$ massivi kabi, $p$ massivi ham algoritm davomida bosqichma-bosqich o‘zgaradi va oxirida yakuniy qiymatlarini oladi.

Endi algoritmning o‘ziga o‘tamiz.

Har bir qadamda tugunlarning uchta to‘plami saqlanadi:

- $M_0$ — masofasi allaqachon hisoblangan tugunlar (garchi bu masofa hali yakuniy bo‘lmasligi mumkin);
- $M_1$ — masofasi ayni vaqtda hisoblanayotgan tugunlar;
- $M_2$ — masofasi hali hisoblanmagan tugunlar.

$M_1$ to‘plamidagi tugunlar ikki uchli navbatda (`deque`) saqlanadi.

Algoritmning har bir qadamida $M_1$ to‘plamidan (navbat boshidan) bitta tugun olamiz.

Tanlangan tugun $u$ bo‘lsin.

Ushbu $u$ tugunni $M_0$ to‘plamiga o‘tkazamiz.

Keyin bu tugundan chiquvchi barcha qirralarni ko‘rib chiqamiz.

Joriy qirraning ikkinchi uchi $v$, og‘irligi esa $w$ bo‘lsin.

- Agar $v$ tugun $M_2$ ga tegishli bo‘lsa, uni navbat oxiriga qo‘shish orqali $M_1$ to‘plamiga o‘tkazamiz. $d_v$ qiymatini $d_u + w$ ga tenglaymiz.
- Agar $v$ tugun $M_1$ ga tegishli bo‘lsa, $d_v$ qiymatini yaxshilashga harakat qilamiz: $d_v = \min(d_v, d_u + w)$. $v$ allaqachon $M_1$ va navbat ichida bo‘lgani uchun uni qayta qo‘shish shart emas.
- Agar $v$ tugun $M_0$ ga tegishli bo‘lsa va $d_v$ ni yaxshilash mumkin bo‘lsa, ya’ni $d_v > d_u + w$ bo‘lsa, $d_v$ ni yaxshilaymiz va $v$ tugunni navbat boshiga joylashtirib, yana $M_1$ to‘plamiga o‘tkazamiz.

Albatta, $d$ massividagi har bir yangilanish bilan $p$ massividagi mos elementni ham yangilashimiz kerak.

## Implementatsiya

Har bir tugun ayni vaqtda qaysi to‘plamda ekanini saqlash uchun $m$ massividan foydalanamiz.

```{.cpp file=desopo_pape}
struct Edge {
    int to, w;
};

int n;
vector<vector<Edge>> adj;

const int INF = 1e9;

void shortest_paths(int v0, vector<int>& d, vector<int>& p) {
    d.assign(n, INF);
    d[v0] = 0;
    vector<int> m(n, 2);
    deque<int> q;
    q.push_back(v0);
    p.assign(n, -1);
    while (!q.empty()) {
        int u = q.front();
        q.pop_front();
        m[u] = 0;
        for (Edge e : adj[u]) {
            if (d[e.to] > d[u] + e.w) {
                d[e.to] = d[u] + e.w;
                p[e.to] = u;
                if (m[e.to] == 2) {
                    m[e.to] = 1;
                    q.push_back(e.to);
                } else if (m[e.to] == 0) {
                    m[e.to] = 1;
                    q.push_front(e.to);
                }
            }
        }
    }
}
```

## Murakkablik

Algoritm odatda juda tez ishlaydi — aksariyat hollarda hatto Dijkstra algoritmidan ham tezroq.

Biroq algoritm eksponensial vaqt sarflaydigan holatlar mavjud; shu sababli eng yomon holat kafolati talab qilinadigan vazifalar uchun u mos emas. Qo‘shimcha ma’lumot uchun [Stack Overflow](https://stackoverflow.com/a/67642821) va [Codeforces](https://codeforces.com/blog/entry/3793)dagi muhokamalarga qarang.

