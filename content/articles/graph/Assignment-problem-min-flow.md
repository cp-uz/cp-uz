---
article_id: graph--Assignment-problem-min-flow
---
# Tayinlash masalasini minimal narxli oqim yordamida yechish

**Tayinlash masalasi**ning o‘zaro teng kuchli ikkita ta’rifi bor:

- $A[1..N, 1..N]$ kvadrat matritsa berilgan. Undan shunday $N$ ta element tanlash kerakki, har bir satr va har bir ustundan aynan bittadan element tanlansin hamda shu elementlar qiymatlari yig‘indisi eng kichik bo‘lsin.
- $N$ ta buyurtma va $N$ ta mashina bor. Har bir buyurtmani har bir mashinada ishlab chiqarish narxi ma’lum. Har bir mashinada faqat bitta buyurtma bajarilishi mumkin. Barcha buyurtmalarni mashinalarga umumiy narx minimal bo‘ladigan qilib tayinlash talab etiladi.

Bu yerda masalani [minimal narxli oqim](min_cost_flow.md) topish algoritmiga asoslanib yechamiz; tayinlash masalasi $\mathcal{O}(N^3)$ vaqtda yechiladi.

## Tavsif

Ikki bo‘lakli tarmoq quramiz: $S$ manba, $T$ qabul qiluvchi bor; birinchi qismda $N$ ta tugun (matritsa satrlari yoki buyurtmalarga mos), ikkinchi qismda ham $N$ ta tugun (matritsa ustunlari yoki mashinalarga mos) mavjud. Birinchi to‘plamdagi har bir $i$ tugun bilan ikkinchi to‘plamdagi har bir $j$ tugun orasida sig‘imi $1$ va narxi $A_{ij}$ bo‘lgan qirra chizamiz. $S$ manbadan birinchi to‘plamdagi barcha $i$ tugunlarga sig‘imi $1$ va narxi $0$ bo‘lgan qirralar chizamiz.
Ikkinchi to‘plamdagi har bir $j$ tugundan $T$ qabul qiluvchiga sig‘imi $1$ va narxi $0$ bo‘lgan qirra chizamiz.
Hosil bo‘lgan tarmoqda minimal narxli maksimal oqimni topamiz. Ravshanki, oqim qiymati $N$ ga teng bo‘ladi. Shundan so‘ng birinchi qismdagi har bir $i$ tugun uchun ikkinchi qismda $F_{ij}=1$ bo‘lgan aynan bitta $j$ tugun mavjud.
Nihoyat, bu birinchi qism tugunlari bilan ikkinchi qism tugunlari orasidagi o‘zaro bir qiymatli moslik bo‘lib, masalaning yechimidir (topilgan oqim minimal narxga ega bo‘lgani uchun tanlangan qirralar narxlari yig‘indisi mumkin bo‘lgan eng kichik qiymatga ega; bu optimallik mezonidir).
Tayinlash masalasi uchun ushbu yechimning murakkabligi minimal narxli maksimal oqim qaysi algoritm bilan topilishiga bog‘liq. [Dijkstra](dijkstra.md) ishlatilsa murakkablik $\mathcal{O}(N^3)$, [Bellman–Ford](bellman_ford.md) ishlatilsa $\mathcal{O}(N^4)$ bo‘ladi. Sababi, oqim hajmi $O(N)$, Dijkstra algoritmining har bir iteratsiyasini $O(N^2)$, Bellman–Ford iteratsiyasini esa $O(N^3)$ vaqtda bajarish mumkin.

## Implementatsiya

Bu yerda berilgan implementatsiya uzun; ehtimol uni sezilarli darajada qisqartirish mumkin.
Eng qisqa yo‘llarni topish uchun [SPFA algoritmi](bellman_ford.md) ishlatilgan.

```cpp
const int INF = 1000 * 1000 * 1000;
vector<int> assignment(vector<vector<int>> a) {
    int n = a.size();
    int m = n * 2 + 2;
    vector<vector<int>> f(m, vector<int>(m));
    int s = m - 2, t = m - 1;
    int cost = 0;
    while (true) {
        vector<int> dist(m, INF);
        vector<int> p(m);
        vector<bool> inq(m, false);
        queue<int> q;
        dist[s] = 0;
        p[s] = -1;
        q.push(s);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            inq[v] = false;
            if (v == s) {
                for (int i = 0; i < n; ++i) {
                    if (f[s][i] == 0) {
                        dist[i] = 0;
                        p[i] = s;
                        inq[i] = true;
                        q.push(i);
                    }
                }
            } else {
                if (v < n) {
                    for (int j = n; j < n + n; ++j) {
                        if (f[v][j] < 1 && dist[j] > dist[v] + a[v][j - n]) {
                            dist[j] = dist[v] + a[v][j - n];
                            p[j] = v;
                            if (!inq[j]) {
                                q.push(j);
                                inq[j] = true;
                            }
                        }
                    }
                } else {
                    for (int j = 0; j < n; ++j) {
                        if (f[v][j] < 0 && dist[j] > dist[v] - a[j][v - n]) {
                            dist[j] = dist[v] - a[j][v - n];
                            p[j] = v;
                            if (!inq[j]) {
                                q.push(j);
                                inq[j] = true;
                            }
                        }
                    }
                }
            }
        }
        int curcost = INF;
        for (int i = n; i < n + n; ++i) {
            if (f[i][t] == 0 && dist[i] < curcost) {
                curcost = dist[i];
                p[t] = i;
            }
        }
        if (curcost == INF)
            break;
        cost += curcost;
        for (int cur = t; cur != -1; cur = p[cur]) {
            int prev = p[cur];
            if (prev != -1)
                f[cur][prev] = -(f[prev][cur] = 1);
        }
    }
    vector<int> answer(n);
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (f[i][j + n] == 1)
                answer[i] = j;
        }
    }
    return answer;
}
```

