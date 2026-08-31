---
article_id: geometry--planar
---
# Tekis graf yuzlarini topish

Tekis graf tekislikka qirralari faqat umumiy uchlarda kesishadigan qilib joylashtirilgan grafdir. Joylashtirish, ya’ni har bir uchning koordinatalari berilgan deb faraz qilamiz. Maqsad — grafning barcha yuzlarini, shu jumladan tashqi yuzni topish.

Har bir yo‘naltirilmagan qirrani ikkita qarama-qarshi yo‘nalgan yarim qirra sifatida ko‘ramiz. Har bir yarim qirra aynan bitta yuzning chegarasida yotadi. Agar barcha yarim qirralarni bir martadan aylansak, barcha yuz chegaralarini olamiz.

## Algoritm

Avval har bir $v$ uchning qo‘shnilarini $v$ dan chiqadigan vektorning qutbiy burchagi bo‘yicha saralaymiz. Buni `atan2` hisoblamasdan ham bajarish mumkin: vektorlar yuqori va pastki yarim tekislikka ajratiladi, bir xil yarmidagi tartib esa vektor ko‘paytma ishorasi bilan aniqlanadi.

Endi $(v,u)$ yo‘naltirilgan qirrani olaylik. Shu qirraning chap tomonidagi yuz chegarasi bo‘ylab yurmoqchi bo‘lsak, $u$ ga kelgach, $u$ ning qutbiy tartiblangan qo‘shnilari orasida $v$ dan oldingi qo‘shnini tanlashimiz kerak. Bu eng o‘ng burilish bo‘lib, yuzni chap tomonda qoldiradi. Agar qarama-qarshi konvensiya tanlansa, keyingi qo‘shni olinadi va yuz o‘ng tomonda qoladi; muhim narsa butun algoritmda bir xil yo‘nalishni ishlatishdir.

Boshlang‘ich yarim qirradan boshlab shu qoidani takrorlaymiz. Boshlang‘ich yarim qirraga qaytganda bitta yuzning yopiq chegarasi hosil bo‘ladi. Ko‘rilgan har bir yo‘naltirilgan qirrani belgilaymiz va hali belgilanmagan yarim qirradan yangi aylanish boshlaymiz.

Agar graf bog‘langan bo‘lsa, har bir yuz bir dona yopiq zanjir bilan tasvirlanadi. Yuzning yo‘nalgan yuzasi shoelace formulasi orqali hisoblanadi:

$$
2S=\sum_i (x_i y_{i+1}-y_i x_{i+1}).
$$

Tanlangan yurish konvensiyasida ichki va tashqi yuzlarning ishoralari qarama-qarshi bo‘ladi. Masalan, ichki yuzlar soat miliga teskari aylansa, ularning yuzi musbat, tashqi yuzniki esa manfiy bo‘ladi. Shu orqali tashqi yuz aniqlanadi.

Algoritmning saralash qismi $\mathcal{O}(m\log m)$, barcha yarim qirralarni yurish esa $\mathcal{O}(m)$ vaqt oladi. Qo‘shnilar ro‘yxatida qarama-qarshi uchning indeksini ikkilik qidiruv bilan topilsa, yurish ham $\mathcal{O}(m\log m)$ bo‘ladi; har yarim qirra uchun pozitsiya oldindan saqlansa, u chiziqli bajariladi.

## Implementatsiya

Quyidagi kod bog‘langan graf uchun yuzlar ro‘yxatini qaytaradi. Har bir yuz uchlar indekslari ketma-ketligi bilan ifodalanadi.

```cpp
struct Point {
    long long x, y;
};

Point operator-(Point a, Point b) {
    return {a.x - b.x, a.y - b.y};
}

long long cross(Point a, Point b) {
    return a.x * b.y - a.y * b.x;
}

bool half(Point p) {
    return p.y < 0 || (p.y == 0 && p.x < 0);
}

vector<vector<int>> find_faces(
        const vector<Point>& p,
        vector<vector<int>> adj) {
    int n = (int)p.size();

    for (int v = 0; v < n; ++v) {
        sort(adj[v].begin(), adj[v].end(), [&](int a, int b) {
            Point A = p[a] - p[v];
            Point B = p[b] - p[v];
            if (half(A) != half(B))
                return half(A) < half(B);
            return cross(A, B) > 0;
        });
    }

    vector<vector<char>> used(n);
    for (int v = 0; v < n; ++v)
        used[v].assign(adj[v].size(), false);

    vector<vector<int>> faces;

    for (int v = 0; v < n; ++v) {
        for (int id = 0; id < (int)adj[v].size(); ++id) {
            if (used[v][id])
                continue;

            vector<int> face;
            int cur_v = v;
            int cur_id = id;

            while (!used[cur_v][cur_id]) {
                used[cur_v][cur_id] = true;
                face.push_back(cur_v);

                int to = adj[cur_v][cur_id];
                int back = lower_bound(
                    adj[to].begin(), adj[to].end(), cur_v,
                    [&](int a, int b) {
                        Point A = p[a] - p[to];
                        Point B = p[b] - p[to];
                        if (half(A) != half(B))
                            return half(A) < half(B);
                        return cross(A, B) > 0;
                    }) - adj[to].begin();

                // Qarama-qarshi yarim qirradan oldingi qirrani olamiz.
                int next_id = (back - 1 + (int)adj[to].size())
                            % (int)adj[to].size();
                cur_v = to;
                cur_id = next_id;
            }

            faces.push_back(face);
        }
    }

    return faces;
}
```

Amalda `lower_bound` komparatori qat’iy tartibga mos bo‘lishi kerak. Yanada ishonchli va tez variantda har bir `(v, adjacency index)` yarim qirra uchun uning qarama-qarshi yarim qirrasi indeksi oldindan yozib qo‘yiladi. Shunda keyingi qirraga o‘tish $\mathcal{O}(1)$ bo‘ladi.

Yuzaning ikki baravar qiymatini hisoblash:

```cpp
long long doubled_area(const vector<int>& face,
                       const vector<Point>& p) {
    long long area = 0;
    for (int i = 0; i < (int)face.size(); ++i) {
        Point a = p[face[i]];
        Point b = p[face[(i + 1) % face.size()]];
        area += cross(a, b);
    }
    return area;
}
```

## Bog‘lanmagan graf

Graf bog‘lanmagan bo‘lsa, bitta geometrik yuzning chegarasi bir nechta yopiq konturdan iborat bo‘lishi mumkin. Masalan, boshqa komponent ichida joylashgan komponent tashqi yuzda “teshik” hosil qiladi. Yuqoridagi yarim qirra yurishi barcha chegara konturlarini topadi, lekin qaysi konturlar bitta yuzga tegishli ekanini o‘zi aniqlamaydi.

Bunday holatda avval har bir bog‘langan komponentning konturlari topiladi. So‘ng konturlar orasidagi joylashuv munosabati point-in-polygon yoki point-location yordamida aniqlanadi: har bir kontur qaysi eng kichik tashqi kontur ichida ekaniga qarab yuzga biriktiriladi. Tashqi chegaralar va teshiklarning orientatsiyasi qarama-qarshi bo‘ladi.

Tekis, bog‘langan graf uchun Euler formulasi

$$
n-m+f=2
$$

bo‘lib, topilgan yuzlar sonini tekshirishda foydali. $c$ ta bog‘langan komponentli grafda esa

$$
n-m+f=1+c.
$$

