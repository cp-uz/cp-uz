---
article_id: graph--mst_prim
---
# Minimal ostov daraxt — Prim algoritmi

Bizga $n$ ta tugun va $m$ ta qirraga ega og‘irlikli yo‘naltirilmagan $G$ grafi berilgan.

Bu grafning barcha tugunlarini bog‘laydigan va eng kichik og‘irlikka ega (ya’ni qirralar og‘irliklari yig‘indisi minimal bo‘lgan) ostov daraxtini topish talab qilinadi.

Ostov daraxt — istalgan tugundan boshqa istalgan tugunga aynan bitta sodda yo‘l orqali yetib borish mumkin bo‘ladigan qirralar to‘plamidir.

Eng kichik og‘irlikka ega ostov daraxt **minimal ostov daraxt** deb ataladi.

Chapdagi rasmda og‘irlikli yo‘naltirilmagan graf, o‘ngdagi rasmda esa unga mos minimal ostov daraxt ko‘rsatilgan.

<div style="text-align: center;">
  <img src="MST_before.png" alt="Tasodifiy graf">
  <img src="MST_after.png" alt="Ushbu grafning minimal ostov daraxti">
</div>

Istalgan ostov daraxtda albatta $n-1$ ta qirra bo‘lishini ko‘rish oson.

Bu masala ko‘plab vazifalarda tabiiy ravishda uchraydi.

Masalan, quyidagi masalada:

$n$ ta shahar mavjud va har bir shaharlar jufti uchun ular orasida yo‘l qurish narxi berilgan (yoki ular orasida yo‘l qurish jismonan imkonsiz ekanini bilamiz).

Har bir shahardan boshqa istalgan shaharga borish mumkin bo‘ladigan va barcha yo‘llarni qurish narxi minimal bo‘ladigan tarzda yo‘llar qurishimiz kerak.

## Prim algoritmi

Ushbu algoritmni dastlab chex matematigi Vojtěch Jarník 1930-yilda kashf etgan.

Biroq algoritm, asosan, uni 1957-yilda qayta kashf etib, qayta chop etgan amerikalik matematik Robert Clay Prim nomi bilan mashhur.

Bundan tashqari, Edsger Dijkstra ham bu algoritmni 1959-yilda chop etgan.

### Algoritm tavsifi

Bu yerda algoritmning eng sodda ko‘rinishini tavsiflaymiz.

Minimal ostov daraxt qirralarni bittadan qo‘shish orqali bosqichma-bosqich quriladi.

Dastlab ostov daraxt faqat bitta, ixtiyoriy tanlangan tugundan iborat bo‘ladi.

Keyin shu tugundan chiquvchi eng kichik og‘irlikli qirra tanlanib, ostov daraxtga qo‘shiladi.

Shundan keyin ostov daraxt allaqachon ikkita tugundan iborat bo‘ladi.

Endi bir uchi allaqachon tanlangan tugunda (ya’ni ostov daraxtga kirgan tugunda), ikkinchi uchi esa tanlanmagan tugunda bo‘lgan eng kichik og‘irlikli qirrani tanlab qo‘shamiz.

Shu tarzda davom etamiz, ya’ni har safar bitta tanlangan tugunni bitta tanlanmagan tugun bilan bog‘laydigan eng kichik og‘irlikli qirrani tanlab qo‘shamiz.

Jarayon ostov daraxt barcha tugunlarni o‘z ichiga olguncha (yoki ekvivalent ravishda, unda $n - 1$ ta qirra bo‘lguncha) takrorlanadi.

Oxirida qurilgan ostov daraxt minimal bo‘ladi.

Agar dastlabki graf bog‘lanmagan bo‘lsa, ostov daraxt mavjud emas; demak, tanlangan qirralar soni $n - 1$ dan kichik bo‘ladi.

### Isbot

$G$ graf bog‘langan, ya’ni javob mavjud bo‘lsin.

Prim algoritmi topgan natijaviy grafni $T$, biror minimal ostov daraxtni esa $S$ deb belgilaymiz.

$T$ haqiqatan ham ostov daraxt va $G$ ning qismgrafi ekanligi ravshan.

Faqat $S$ va $T$ ning og‘irliklari tengligini ko‘rsatishimiz kerak.

Algoritmda $S$ ga kirmaydigan qirra birinchi marta $T$ ga qo‘shilgan paytni ko‘rib chiqamiz.

Bu qirrani $e$, uning uchlarini $a$ va $b$, allaqachon tanlangan tugunlar to‘plamini esa $V$ deb belgilaymiz ($a \in V$ va $b \notin V$, yoki aksincha).

Minimal ostov daraxt $S$ da $a$ va $b$ tugunlar biror $P$ yo‘l orqali bog‘langan.

Bu yo‘lda bir uchi $V$ da, ikkinchi uchi esa $V$ dan tashqarida yotadigan $f$ qirrani topish mumkin.

Algoritm $f$ o‘rniga $e$ ni tanlagani uchun, $f$ ning og‘irligi $e$ ning og‘irligidan katta yoki unga teng.

Minimal ostov daraxt $S$ ga $e$ qirrani qo‘shamiz va $f$ qirrani olib tashlaymiz.

$e$ ni qo‘shish orqali sikl hosil qildik; $f$ ham yagona siklga kirgani uchun, uni olib tashlagach natijaviy graf yana siklsiz bo‘ladi.

Sikldan faqat bitta qirrani olib tashlaganimiz sababli natijaviy graf hamon bog‘langan.

Natijaviy ostov daraxtning umumiy og‘irligi kattaroq bo‘la olmaydi, chunki $e$ ning og‘irligi $f$ nikidan katta emas; u kichikroq ham bo‘la olmaydi, chunki $S$ minimal ostov daraxt edi.

Demak, $f$ qirrani $e$ ga almashtirib, boshqa bir minimal ostov daraxt hosil qildik.

Bundan tashqari, $e$ va $f$ bir xil og‘irlikka ega bo‘lishi kerak.

Shunday qilib, Prim algoritmida tanlangan barcha qirralarning og‘irliklari istalgan minimal ostov daraxt qirralarining og‘irliklariga mos keladi; demak, Prim algoritmi haqiqatan ham minimal ostov daraxt hosil qiladi.

## Implementatsiya

Algoritmning murakkabligi mos qirralar orasidan keyingi minimal qirrani qanday qidirishimizga bog‘liq.

Turli murakkablik va implementatsiyalarga olib keluvchi bir nechta yondashuv mavjud.

### Sodda implementatsiyalar: $O(n m)$ va $O(n^2 + m \log n)$

Qirrani barcha mumkin bo‘lgan qirralarni ko‘rib chiqish orqali qidirsak, eng kichik og‘irlikli qirrani topish $O(m)$ vaqt oladi.

Umumiy murakkablik $O(n m)$ bo‘ladi.

Eng yomon holatda bu $O(n^3)$ bo‘lib, juda sekin.

Har bir allaqachon tanlangan tugundan faqat bitta qirrani ko‘rib chiqish orqali algoritmni yaxshilash mumkin.

Masalan, har bir tugundan chiquvchi qirralarni og‘irlik bo‘yicha o‘sish tartibida saralash va birinchi yaroqli qirraga (ya’ni tanlanmagan tugunga olib boruvchi qirraga) ko‘rsatkich saqlash mumkin.

Keyin minimal qirra topilib tanlangach, ko‘rsatkichlarni yangilaymiz.

Bu $O(n^2 + m)$ murakkablikni beradi; qirralarni saralash uchun qo‘shimcha $O(m \log n)$ kerak bo‘ladi, natijada eng yomon holatdagi murakkablik $O(n^2 \log n)$ bo‘ladi.

Quyida biroz farqli ikkita algoritmni ko‘rib chiqamiz: biri zich, ikkinchisi siyrak graflar uchun; ikkalasining ham murakkabligi yaxshiroq.

### Zich graflar: $O(n^2)$

Masalaga boshqa tomondan yondashamiz:

hali tanlanmagan har bir tugun uchun undan allaqachon tanlangan tugunga olib boruvchi minimal qirrani saqlaymiz.

U holda har bir qadamda faqat shu minimal og‘irlikli qirralarni ko‘rib chiqish kerak bo‘ladi; bu $O(n)$ vaqt oladi.

Biror qirra qo‘shilgach, ayrim minimal qirra ko‘rsatkichlarini qayta hisoblash kerak.

Og‘irliklar faqat kamayishi mumkinligiga e’tibor bering: hali tanlanmagan har bir tugunning minimal og‘irlikli qirrasi o‘zgarmasligi yoki yangi tanlangan tugunga olib boruvchi qirra bilan yangilanishi mumkin.

Shu sababli bu fazani ham $O(n)$ vaqtda bajarish mumkin.

Natijada Prim algoritmining $O(n^2)$ murakkablikdagi ko‘rinishini oldik.

Xususan, bu implementatsiya Evklid minimal ostov daraxti masalasi uchun juda qulay:

tekislikda $n$ ta nuqta bor, har bir nuqtalar jufti orasidagi masofa Evklid masofasi va shu to‘liq grafning minimal ostov daraxtini topmoqchimiz.

Bu masalani tavsiflangan algoritm yordamida $O(n^2)$ vaqt va $O(n)$ xotirada yechish mumkin; [Kruskal algoritmi](mst_kruskal.md) bilan buni amalga oshirib bo‘lmaydi.

```cpp
int n;
vector<vector<int>> adj; // adjacency matrix of graph
const int INF = 1000000000; // weight INF means there is no edge

struct Edge {
    int w = INF, to = -1;
};

void prim() {
    int total_weight = 0;
    vector<bool> selected(n, false);
    vector<Edge> min_e(n);
    min_e[0].w = 0;

    for (int i=0; i<n; ++i) {
        int v = -1;
        for (int j = 0; j < n; ++j) {
            if (!selected[j] && (v == -1 || min_e[j].w < min_e[v].w))
                v = j;
        }
        if (min_e[v].w == INF) {
            cout << "No MST!" << endl;
            exit(0);
        }

        selected[v] = true;
        total_weight += min_e[v].w;
        if (min_e[v].to != -1)
            cout << v << " " << min_e[v].to << endl;

        for (int to = 0; to < n; ++to) {
            if (adj[v][to] < min_e[to].w)
                min_e[to] = {adj[v][to], v};
        }
    }

    cout << total_weight << endl;
}
```

$n \times n$ o‘lchamli `adj[][]` qo‘shnilik matritsasi qirralar og‘irliklarini saqlaydi; ikki tugun orasida qirra bo‘lmasa, `INF` og‘irlik ishlatiladi.

Algoritm ikkita massivdan foydalanadi: qaysi tugunlar allaqachon tanlanganini ko‘rsatuvchi `selected[]` bayroqlar massivi va hali tanlanmagan har bir tugun uchun tanlangan tugunga olib boruvchi minimal og‘irlikli qirrani saqlovchi `min_e[]` massivi (u qirra og‘irligi va ikkinchi uchini saqlaydi).

Algoritm $n$ ta qadam bajaradi; har bir iteratsiyada qirra og‘irligi eng kichik bo‘lgan tugun tanlanadi va qolgan barcha tugunlarning `min_e[]` qiymatlari yangilanadi.

### Siyrak graflar: $O(m \log n)$

Yuqorida tavsiflangan algoritmda minimumni topish va ayrim qiymatlarni o‘zgartirish amallarini to‘plam amallari sifatida talqin qilish mumkin.

Bu ikki klassik amalni ko‘plab ma’lumotlar tuzilmalari, masalan, C++ dagi `set` (qizil-qora daraxt orqali implementatsiya qilingan) qo‘llab-quvvatlaydi.

Asosiy algoritm o‘zgarmaydi, ammo endi minimal qirrani $O(\log n)$ vaqtda topishimiz mumkin.

Boshqa tomondan, ko‘rsatkichlarni qayta hisoblash endi $O(n \log n)$ vaqt oladi, bu avvalgi algoritmdan yomonroq.

Lekin umumiy hisobda faqat $O(m)$ marta yangilash va minimal qirrani $O(n)$ marta qidirishimiz kerakligini hisobga olsak, umumiy murakkablik $O(m \log n)$ bo‘ladi.

Siyrak graflar uchun bu yuqoridagi algoritmdan yaxshiroq, ammo zich graflar uchun sekinroq bo‘ladi.

```cpp
const int INF = 1000000000;

struct Edge {
    int w = INF, to = -1;
    bool operator<(Edge const& other) const {
        return make_pair(w, to) < make_pair(other.w, other.to);
    }
};

int n;
vector<vector<Edge>> adj;
void prim() {
    int total_weight = 0;
    vector<Edge> min_e(n);
    min_e[0].w = 0;
    set<Edge> q;
    q.insert({0, 0});
    vector<bool> selected(n, false);
    for (int i = 0; i < n; ++i) {
        if (q.empty()) {
            cout << "No MST!" << endl;
            exit(0);
        }

        int v = q.begin()->to;
        selected[v] = true;
        total_weight += q.begin()->w;
        q.erase(q.begin());

        if (min_e[v].to != -1)
            cout << v << " " << min_e[v].to << endl;
        for (Edge e : adj[v]) {
            if (!selected[e.to] && e.w < min_e[e.to].w) {
                q.erase({min_e[e.to].w, e.to});
                min_e[e.to] = {e.w, v};
                q.insert({e.w, e.to});
            }
        }
    }

    cout << total_weight << endl;
}
```

Bu yerda graf `adj[]` qo‘shnilik ro‘yxati orqali ifodalangan; `adj[v]` da $v$ tugun uchun barcha qirralar (og‘irlik va boriladigan tugun juftlari ko‘rinishida) saqlanadi.

`min_e[v]` $v$ tugundan allaqachon tanlangan tugunga olib boruvchi eng kichik og‘irlikli qirrani (yana og‘irlik va boriladigan tugun jufti ko‘rinishida) saqlaydi.

Bundan tashqari, `q` navbat hali tanlanmagan barcha tugunlar bilan `min_e` og‘irliklari o‘sish tartibida to‘ldiriladi.

Algoritm `n` ta qadam bajaradi; har bir qadamda `min_e` og‘irligi eng kichik bo‘lgan `v` tugunni tanlaydi (uni navbat boshidan chiqarib oladi), keyin bu tugundan chiquvchi barcha qirralarni ko‘rib chiqadi va `min_e` qiymatlarini yangilaydi (yangilash paytida eski qirrani `q` navbatdan olib tashlab, yangi qirrani qo‘shish ham kerak).

