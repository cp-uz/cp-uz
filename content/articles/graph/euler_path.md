---
article_id: graph--euler_path
---
# Euler yo‘lini $O(M)$ vaqtda topish

Euler yo‘li — grafning barcha qirralaridan aynan bir marta o‘tadigan yo‘l.

Euler sikli — sikl bo‘lgan Euler yo‘lidir.

Masala — **ilmoqlari bo‘lishi mumkin bo‘lgan yo‘naltirilmagan multigrafda** Euler yo‘lini topish.

## Algoritm

Avval Euler yo‘li mavjud yoki yo‘qligini tekshirishimiz mumkin.

Quyidagi teoremadan foydalanamiz. Euler sikli mavjud bo‘lishi uchun va faqat shuning uchun barcha tugunlarning darajalari juft bo‘lishi kerak.

Euler yo‘li mavjud bo‘lishi uchun va faqat shuning uchun toq darajali tugunlar soni ikki bo‘lishi kerak (yoki Euler sikli mavjud bo‘lgan holatda nol).

Bundan tashqari, albatta, graf yetarlicha bog‘langan bo‘lishi kerak (ya’ni undan barcha ajratilgan tugunlar olib tashlansa, bog‘langan graf qolishi kerak).

Euler yo‘li yoki Euler siklini topish uchun quyidagi strategiyadan foydalanish mumkin:

Barcha sodda sikllarni topib, ularni bitta siklga birlashtiramiz — bu Euler sikli bo‘ladi.

Agar grafdagi Euler yo‘li sikl bo‘lmasa, yetishmayotgan qirrani qo‘shamiz, Euler siklini topamiz, keyin ortiqcha qirrani olib tashlaymiz.

Barcha sikllarni qidirish va birlashtirish sodda rekursiv protsedura yordamida bajarilishi mumkin:

```nohighlight
procedure FindEulerPath(V)
  1. iterate through all the edges outgoing from vertex V;
       remove this edge from the graph,
       and call FindEulerPath from the second end of this edge;
  2. add vertex V to the answer.
```

Ushbu algoritmning murakkabligi qirralar soniga nisbatan chiziqli ekanligi ravshan.

Xuddi shu algoritmni rekursiyasiz ko‘rinishda ham yozish mumkin:

```nohighlight
stack St;
put start vertex in St;
until St is empty
  let V be the value at the top of St;
  if degree(V) = 0, then
    add V to the answer;
    remove V from the top of St;
  otherwise
    find any edge coming out of V;
    remove it from the graph;
    put the second end of this edge in St;
```

Algoritmning bu ikki ko‘rinishi ekvivalentligini tekshirish oson. Biroq ikkinchi ko‘rinish aniq tezroq va kodi ancha samarali bo‘ladi.

## Domino masalasi

Bu yerda klassik Euler sikli masalasini — Domino masalasini keltiramiz.

$N$ ta domino mavjud; ma’lumki, har bir dominoning ikki uchida bittadan son yozilgan (odatda 1 dan 6 gacha, lekin bizning holatda bu muhim emas). Barcha dominolarni bir qatorga shunday joylashtirmoqchisizki, istalgan ikkita qo‘shni dominoning umumiy tomonida yozilgan sonlar bir xil bo‘lsin. Dominolarni aylantirishga ruxsat beriladi.

Masalani boshqacha ifodalaymiz. Dominolarda yozilgan sonlar graf tugunlari, dominolar esa graf qirralari bo‘lsin (raqamlari $(a,b)$ bo‘lgan har bir domino $(a,b)$ va $(b,a)$ qirralarni ifodalaydi). U holda masalamiz shu grafda Euler yo‘lini topish masalasiga keltiriladi.

## Implementatsiya

Quyidagi dastur grafda Euler sikli yoki yo‘lini qidirib chiqaradi; agar mavjud bo‘lmasa, $-1$ chiqaradi.

Dastlab dastur tugunlar darajasini tekshiradi: toq darajali tugunlar bo‘lmasa, grafda Euler sikli bor; toq darajali tugunlar soni $2$ bo‘lsa, grafda faqat Euler yo‘li bor (Euler sikli yo‘q); bunday tugunlar soni $2$ dan ko‘p bo‘lsa, grafda Euler sikli ham, Euler yo‘li ham mavjud emas.

Euler yo‘lini (sikl bo‘lmaganini) topish uchun quyidagini qilamiz: $V1$ va $V2$ — toq darajali ikki tugun bo‘lsa, shunchaki $(V1, V2)$ qirrani qo‘shamiz, hosil bo‘lgan grafda Euler siklini topamiz (u albatta mavjud bo‘ladi), keyin javobdan “soxta” $(V1, V2)$ qirrani olib tashlaymiz.

Euler siklini aynan yuqorida tavsiflangan usulda (rekursiyasiz ko‘rinishda) qidiramiz va shu bilan birga algoritm oxirida graf bog‘langan yoki yo‘qligini tekshiramiz (graf bog‘lanmagan bo‘lsa, algoritm oxirida unda ayrim qirralar qoladi va bu holda $-1$ chiqarish kerak).

Nihoyat, dastur grafda ajratilgan tugunlar bo‘lishi mumkinligini ham hisobga oladi.

Ushbu masalada qo‘shnilik matritsasidan foydalanayotganimizga e’tibor bering.

Bundan tashqari, bu implementatsiya keyingi qirrani to‘liq qidiruv bilan topadi, buning uchun matritsaning butun satri qayta-qayta ko‘rib chiqiladi.

Yaxshiroq usul — grafni qo‘shnilik ro‘yxati sifatida saqlash, qirralarni $O(1)$ vaqtda olib tashlash va teskari qirralarni alohida ro‘yxatda belgilashdir.

Shu yo‘l bilan $O(N)$ algoritmga erishish mumkin.

```cpp
int main() {
    int n;
    vector<vector<int>> g(n, vector<int>(n));
    // reading the graph in the adjacency matrix
    vector<int> deg(n);
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j)
            deg[i] += g[i][j];
    }

    int first = 0;
    while (first < n && !deg[first])
        ++first;
    if (first == n) {
        cout << -1;
        return 0;
    }
    int v1 = -1, v2 = -1;
    bool bad = false;
    for (int i = 0; i < n; ++i) {
        if (deg[i] & 1) {
            if (v1 == -1)
                v1 = i;
            else if (v2 == -1)
                v2 = i;
            else
                bad = true;
        }
    }

    if (v1 != -1)
        ++g[v1][v2], ++g[v2][v1];
    stack<int> st;
    st.push(first);
    vector<int> res;
    while (!st.empty()) {
        int v = st.top();
        int i;
        for (i = 0; i < n; ++i)
            if (g[v][i])
                break;
        if (i == n) {
            res.push_back(v);
            st.pop();
        } else {
            --g[v][i];
            --g[i][v];
            st.push(i);
        }
    }
    if (v1 != -1) {
        for (size_t i = 0; i + 1 < res.size(); ++i) {
            if ((res[i] == v1 && res[i + 1] == v2) ||
                (res[i] == v2 && res[i + 1] == v1)) {
                vector<int> res2;
                for (size_t j = i + 1; j < res.size(); ++j)
                    res2.push_back(res[j]);
                for (size_t j = 1; j <= i; ++j)
                    res2.push_back(res[j]);
                res = res2;
                break;
            }
        }
    }
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (g[i][j])
                bad = true;
        }
    }

    if (bad) {
        cout << -1;
    } else {
        for (int x : res)
            cout << x << " ";
    }
}
```

### Amaliy masalalar:

- [CSES : Mail Delivery](https://cses.fi/problemset/task/1691)
- [CSES : Teleporters Path](https://cses.fi/problemset/task/1693)
- [Codeforces - Melody](https://codeforces.com/contest/2110/problem/E)
- [Codeforces - Tanya and Password](https://codeforces.com/contest/508/problem/D)

