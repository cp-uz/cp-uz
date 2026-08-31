---
article_id: graph--dijkstra_sparse
---
# Siyrak graflarda Dijkstra algoritmi

Masala bayoni, algoritm, implementatsiya va to‘g‘rilik isbotini [Dijkstra algoritmi](dijkstra.md) maqolasidan topish mumkin.

## Algoritm

Dijkstra algoritmining murakkabligini chiqarishda ikkita omildan foydalanganimizni eslaylik:

- eng kichik $d[v]$ masofaga ega belgilanmagan tugunni topish vaqti;
- relaksatsiya, ya’ni $d[\text{to}]$ qiymatlarini o‘zgartirish vaqti.

Eng sodda implementatsiyada bu amallar mos ravishda $O(n)$ va $O(1)$ vaqt talab qiladi. Birinchi amal $O(n)$ marta, ikkinchisi esa $O(m)$ marta bajarilgani uchun $O(n^2+m)$ murakkablik olingan edi. Bu zich graf, ya’ni $m\approx n^2$ bo‘lganda optimal.

Siyrak graflarda esa $m$ qirralarning mumkin bo‘lgan maksimal $n^2$ sonidan ancha kichik bo‘ladi va birinchi had sababli bu murakkablik optimal emas. Shuning uchun birinchi amalning ishlash vaqtini yaxshilash, albatta ikkinchi amalni keskin sekinlashtirmaslik kerak.

Buning uchun turli yordamchi ma’lumotlar tuzilmalaridan foydalanish mumkin. Eng samaralisi **Fibonacci uyumi** bo‘lib, u minimumni olish amalini $O(\log n)$, elementni yangilash amalini esa $O(1)$ vaqtda bajaradi. Natijada Dijkstra algoritmi uchun $O(n\log n+m)$ murakkablik olinadi; bu eng qisqa yo‘l qidirish masalasi uchun nazariy minimum hamdir. Demak algoritm optimal ishlaydi va Fibonacci uyumi bu nuqtayi nazardan optimal ma’lumotlar tuzilmasidir.

Ikkala amalni ham $O(1)$ da bajaradigan ma’lumotlar tuzilmasi mavjud emas. Aks holda tasodifiy sonlar ro‘yxatini chiziqli vaqtda saralash mumkin bo‘lar edi, bu esa imkonsiz. Qiziq tomoni, Thorup butun sonli vaznlar uchun $O(m)$ vaqtda eng qisqa yo‘l topadigan algoritm yaratgan, ammo u butunlay boshqa g‘oyadan foydalanadi; shuning uchun yuqoridagi fikrga zid emas.

Fibonacci uyumlari bu vazifa uchun optimal murakkablikni beradi, ammo ularni amalga oshirish ancha murakkab va yashirin doimiysi ham katta. Murosa sifatida minimumni chiqarish va elementni yangilash amallarining ikkalasini ham $O(\log n)$ vaqtda bajaradigan tuzilmalardan foydalanish mumkin. Shunda Dijkstra algoritmi

$$O(n\log n+m\log n)=O(m\log n)$$

vaqtda ishlaydi.

C++ ikkita shunday ma’lumotlar tuzilmasini beradi: `set` va `priority_queue`. Birinchisi qizil-qora daraxtga, ikkinchisi uyumga asoslangan. Shu sababli `priority_queue` odatda kichikroq yashirin doimiyga ega, biroq unda elementni olib tashlash amali yo‘q. Shu muammo uchun aylanma yo‘l ishlatiladi va natijada nazariy jihatdan $\log n$ o‘rniga biroz yomonroq $\log m$ koeffitsiyenti kelib chiqadi; asimptotik nuqtayi nazardan ular baribir bir xil.

## Implementatsiya

### `set`

Avval `set` konteyneridan boshlaymiz. Tugunlarni $d[]$ qiymatlari bo‘yicha tartibda saqlashimiz kerakligi sababli, masofa va tugun indeksidan iborat juftliklarni saqlash qulay. `set` ichida juftliklar avtomatik ravishda masofa bo‘yicha tartiblanadi.

```{.cpp file=dijkstra_sparse_set}
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;

void dijkstra(int s, vector<int> & d, vector<int> & p) {
    int n = adj.size();
    d.assign(n, INF);
    p.assign(n, -1);
    d[s] = 0;
    set<pair<int, int>> q;
    q.insert({0, s});
    while (!q.empty()) {
        int v = q.begin()->second;
        q.erase(q.begin());

        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;

            if (d[v] + len < d[to]) {
                q.erase({d[to], to});
                d[to] = d[v] + len;
                p[to] = v;
                q.insert({d[to], to});
            }
        }
    }
}
```

Oddiy Dijkstra implementatsiyasidagi $u[]$ massiviga endi ehtiyoj yo‘q. Bu ma’lumotni saqlash va eng kichik masofali tugunni topish uchun `set` dan foydalanamiz; u ma’lum ma’noda navbat vazifasini bajaradi.

Asosiy sikl to‘plam, ya’ni navbat bo‘shaguncha ishlaydi. Eng kichik masofali tugun chiqariladi. Har bir muvaffaqiyatli relaksatsiyada avval eski juftlik to‘plamdan o‘chiriladi, masofa yangilangach esa yangi juftlik navbatga qo‘shiladi.

### `priority_queue`

`set` implementatsiyasidan asosiy farq shuki, ko‘plab tillarda, jumladan C++da ham, `priority_queue` ichidan ixtiyoriy elementni olib tashlab bo‘lmaydi; nazariy jihatdan uyum bunday amalni qo‘llashi mumkin bo‘lsa ham, standart konteyner uni bermaydi.

Shuning uchun aylanma yo‘l ishlatamiz: eski juftlikni navbatdan umuman o‘chirmaymiz. Natijada bitta tugun bir vaqtning o‘zida turli masofalar bilan navbatda bir necha marta turishi mumkin. Bu juftliklar orasida faqat birinchi elementi tegishli $d[]$ qiymatiga teng bo‘lganlari joriy; qolganlari eskirgan.

Demak kichik o‘zgartirish kerak: har iteratsiya boshida navbatdan keyingi juftlikni olgach, u joriy juftlikmi yoki oldin qayta ishlangan eski juftlikmi, tekshiramiz. Bu tekshiruv juda muhim; aks holda murakkablik $O(nm)$ gacha yomonlashishi mumkin.

`priority_queue` standart holatda elementlarni kamayish tartibida saralaydi. O‘sish tartibini olish uchun unda manfiy masofalarni saqlash yoki boshqa solishtirish funksiyasini berish mumkin. Quyida ikkinchi usul ishlatilgan.

```{.cpp file=dijkstra_sparse_pq}
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;

void dijkstra(int s, vector<int> & d, vector<int> & p) {
    int n = adj.size();
    d.assign(n, INF);
    p.assign(n, -1);
    d[s] = 0;
    using pii = pair<int, int>;
    priority_queue<pii, vector<pii>, greater<pii>> q;
    q.push({0, s});
    while (!q.empty()) {
        int v = q.top().second;
        int d_v = q.top().first;
        q.pop();
        if (d_v != d[v])
            continue;
        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;

            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
                q.push({d[to], to});
            }
        }
    }
}
```

Amaliyotda `priority_queue` varianti `set` variantidan biroz tezroq ishlaydi. Qiziq tomoni, [2007-yildagi texnik hisobot](https://www3.cs.stonybrook.edu/~rezaul/papers/TR-07-54.pdf) `decrease-key` amalisiz variant `decrease-key` ishlatadigan variantdan tezroq ishlashini, siyrak graflarda esa farq yanada katta bo‘lishini ko‘rsatgan.

### Juftliklardan voz kechish

Konteynerlarda juftliklar o‘rniga faqat tugun indekslarini saqlash orqali ishlash tezligini yana biroz oshirish mumkin. Bunda solishtirish operatorini qayta aniqlash kerak: u ikki tugunni $d[]$ da saqlangan masofalari bo‘yicha solishtiradi.

Relaksatsiya natijasida ayrim tugunlarning masofasi o‘zgaradi, ammo ma’lumotlar tuzilmasi o‘zini avtomatik ravishda qayta saralamaydi. Navbatdagi tugun masofasini ichkarida turib o‘zgartirish tuzilmaning invariantlarini buzishi mumkin. Oldingidek, tugunni relaksatsiyadan avval olib tashlab, keyin qayta kiritish kerak.

Ixtiyoriy elementni faqat `set` dan o‘chirish mumkin bo‘lgani uchun bu optimallashtirish faqat `set` usuliga tatbiq qilinadi va `priority_queue` implementatsiyasida ishlamaydi. Amaliyotda ayniqsa masofalar `long long` yoki `double` kabi katta turlarda saqlanganda bu optimallashtirish tezlikni sezilarli oshiradi.

