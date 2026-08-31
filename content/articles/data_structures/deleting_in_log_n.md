---
article_id: data_structures--deleting_in_log_n
---
# Ma’lumotlar tuzilmasidan $O(T(n)\log n)$ vaqtda o‘chirish

Element qo‘shishni amortizatsiyalangan emas, balki **haqiqiy** $O(T(n))$ vaqtda bajaradigan ma’lumotlar tuzilmasi mavjud deb faraz qilamiz. Ushbu usul offline sharoitda o‘chirish amalini $O(T(n)\log n)$ vaqtda qo‘llab-quvvatlash imkonini beradi.

## Algoritm

Har bir element qo‘shilgan va o‘chirilgan vaqtlar orasidagi bir yoki bir nechta vaqt oralig‘ida ma’lumotlar tuzilmasida “tirik” bo‘ladi. So‘rovlar vaqt o‘qining nuqtalari deb qaraladi va shu o‘q ustida segment tree quriladi.

Muayyan element faol bo‘lgan har bir vaqt oralig‘i segment treening $O(\log n)$ ta tuguniga ajratiladi. Element aynan shu tugunlarning ro‘yxatlariga yoziladi. Tuzilma holati haqida javob talab qiladigan har bir so‘rov esa vaqtiga mos bargga joylashtiriladi.

Barcha so‘rovlarni qayta ishlash uchun segment tree bo‘ylab DFS bajaramiz:

1. Tugunga kirganda uning ro‘yxatidagi barcha elementlarni ma’lumotlar tuzilmasiga qo‘shamiz.
2. Tugun ichki tugun bo‘lsa, farzandlariga o‘tamiz; barg bo‘lsa, shu vaqtdagi so‘rovga javob beramiz.
3. Tugundan chiqayotganda kirishda bajarilgan barcha o‘zgarishlarni orqaga qaytaramiz.

Agar tuzilmani o‘zgartirish $O(T(n))$ vaqt olsa, bajarilgan o‘zgarishlarni stackda saqlab, ularni ham $O(T(n))$ vaqtda rollback qilish mumkin.

Muhim ogohlantirish: rollback ishlatilganda amortizatsiyalangan murakkablik kafolati odatda saqlanmaydi. Shuning uchun asosiy qo‘shish amali **haqiqiy**, ya’ni har bir chaqiruv uchun alohida $O(T(n))$ bo‘lishi kerak.

## Izohlar

Biror obyekt “tirik” bo‘lgan vaqt oraliqlari ustida segment tree qurish g‘oyasi faqat ma’lumotlar tuzilmalari masalalariga xos emas. U vaqt bo‘yicha faollashadigan obyektlar, qirralar yoki cheklovlarni offline qayta ishlashga oid boshqa masalalarda ham qo‘llanadi. Quyidagi mashq masalalari bunga misol bo‘ladi.

## Implementatsiya

Quyidagi implementatsiya [dinamik bog‘langanlik](https://en.wikipedia.org/wiki/Dynamic_connectivity) masalasiga mo‘ljallangan. U qirralarni qo‘shish va o‘chirish hamda har bir vaqtda bog‘langan komponentlar sonini topishni qo‘llab-quvvatlaydi.

`dsu_with_rollbacks` path compression ishlatmaydi, chunki path compression ko‘plab ota ko‘rsatkichlarini o‘zgartirib, rollbackni qimmatlashtiradi. Union by rank esa har bir muvaffaqiyatli birlashtirishda faqat doimiy sondagi qiymatlarni o‘zgartiradi; ular `op` stackiga yoziladi. `QueryTree` har bir qirrani u faol bo‘lgan vaqt oralig‘ini qoplaydigan segment tree tugunlariga qo‘shadi, so‘ng DFS davomida ularni vaqtincha DSUga kiritadi.

```{.cpp file=dynamic-conn}
struct dsu_save {
    int v, rnkv, u, rnku;

    dsu_save() {}

    dsu_save(int _v, int _rnkv, int _u, int _rnku)
        : v(_v), rnkv(_rnkv), u(_u), rnku(_rnku) {}
};

struct dsu_with_rollbacks {
    vector<int> p, rnk;
    int comps;
    stack<dsu_save> op;
    dsu_with_rollbacks() {}

    dsu_with_rollbacks(int n) {
        p.resize(n);
        rnk.resize(n);
        for (int i = 0; i < n; i++) {
            p[i] = i;
            rnk[i] = 0;
        }
        comps = n;
    }

    int find_set(int v) {
        return (v == p[v]) ? v : find_set(p[v]);
    }
    bool unite(int v, int u) {
        v = find_set(v);
        u = find_set(u);
        if (v == u)
            return false;
        comps--;
        if (rnk[v] > rnk[u])
            swap(v, u);
        op.push(dsu_save(v, rnk[v], u, rnk[u]));
        p[v] = u;
        if (rnk[u] == rnk[v])
            rnk[u]++;
        return true;
    }
    void rollback() {
        if (op.empty())
            return;
        dsu_save x = op.top();
        op.pop();
        comps++;
        p[x.v] = x.v;
        rnk[x.v] = x.rnkv;
        p[x.u] = x.u;
        rnk[x.u] = x.rnku;
    }
};

struct query {
    int v, u;
    bool united;
    query(int _v, int _u) : v(_v), u(_u) {
    }
};

struct QueryTree {
    vector<vector<query>> t;
    dsu_with_rollbacks dsu;
    int T;

    QueryTree() {}
    QueryTree(int _T, int n) : T(_T) {
        dsu = dsu_with_rollbacks(n);
        t.resize(4 * T + 4);
    }

    void add_to_tree(int v, int l, int r, int ul, int ur, query& q) {
        if (ul > ur)
            return;
        if (l == ul && r == ur) {
            t[v].push_back(q);
            return;
        }
        int mid = (l + r) / 2;
        add_to_tree(2 * v, l, mid, ul, min(ur, mid), q);
        add_to_tree(2 * v + 1, mid + 1, r, max(ul, mid + 1), ur, q);
    }
    void add_query(query q, int l, int r) {
        add_to_tree(1, 0, T - 1, l, r, q);
    }
    void dfs(int v, int l, int r, vector<int>& ans) {
        for (query& q : t[v]) {
            q.united = dsu.unite(q.v, q.u);
        }
        if (l == r)
            ans[l] = dsu.comps;
        else {
            int mid = (l + r) / 2;
            dfs(2 * v, l, mid, ans);
            dfs(2 * v + 1, mid + 1, r, ans);
        }
        for (query q : t[v]) {
            if (q.united)
                dsu.rollback();
        }
    }
    vector<int> solve() {
        vector<int> ans(T);
        dfs(1, 0, T - 1, ans);
        return ans;
    }
};
```

`unite` muvaffaqiyatsiz bo‘lsa, ya’ni ikki uch allaqachon bitta komponentda bo‘lsa, hech narsa stackka qo‘shilmaydi. Shu sababli `query.united` qiymati DFSdan qaytishda faqat haqiqatan bajarilgan birlashtirishlarni rollback qilish uchun ishlatiladi. Har bir faol qirra $O(\log T)$ ta tugunda paydo bo‘lgani uchun umumiy qo‘shish va rollbacklar soni ham shu ko‘paytuvchiga ega.

## Masalalar

- [Codeforces - Connect and Disconnect](https://codeforces.com/gym/100551/problem/A)
- [Codeforces - Addition on Segments](https://codeforces.com/contest/981/problem/E)
- [Codeforces - Extending Set of Points](https://codeforces.com/contest/1140/problem/F)

