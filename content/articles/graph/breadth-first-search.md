---
article_id: graph--breadth-first-search
---
# Kenglik bo‘yicha qidiruv (BFS)

Kenglik bo‘yicha qidiruv graflarda qo‘llanadigan asosiy va eng muhim qidiruv algoritmlaridan biridir.

Algoritm ishlash usuli tufayli kenglik bo‘yicha qidiruv istalgan tugungacha topgan yo‘l o‘sha tugungacha bo‘lgan eng qisqa yo‘l, ya’ni vaznsiz grafda eng kam sondagi qirralarni o‘z ichiga oladigan yo‘l bo‘ladi.

Algoritm $O(n + m)$ vaqtda ishlaydi; bu yerda $n$ — tugunlar soni, $m$ esa qirralar soni.

## Algoritm tavsifi

Algoritm kirishda vaznsiz graf va boshlang‘ich $s$ tugunning identifikatorini qabul qiladi. Kiruvchi graf yo‘naltirilgan ham, yo‘naltirilmagan ham bo‘lishi mumkin — buning algoritm uchun farqi yo‘q.

Algoritmni graf bo‘ylab tarqalayotgan yong‘in sifatida tasavvur qilish mumkin: nolinchi qadamda faqat $s$ manba tugun yonmoqda. Har bir qadamda har bir yonayotgan tugundagi olov uning barcha qo‘shnilariga tarqaladi. Algoritmning bitta iteratsiyasida «olov halqasi» kenglik bo‘yicha bir birlikka kengayadi; algoritm nomi ham shundan kelib chiqqan.

Aniqroq aytganda, algoritm quyidagicha bayon qilinadi. Qayta ishlanishi kerak bo‘lgan tugunlarni saqlaydigan $q$ navbatini va har bir tugun yoqilgan, ya’ni tashrif buyurilgan yoki yo‘qligini ko‘rsatadigan `used[]` mantiqiy massivini yarating.

Dastlab $s$ manbani navbatga qo‘shing va `used[s] = true` deb belgilang; qolgan barcha $v$ tugunlar uchun `used[v] = false` bo‘lsin. Keyin navbat bo‘shamaguncha siklni davom ettiring: har iteratsiyada navbat boshidagi tugunni oling, undan chiqadigan barcha qirralarni ko‘rib chiqing va ulardan birortasi hali yoqilmagan tugunga olib borsa, o‘sha tugunni yoqing hamda navbatga qo‘shing.

Natijada navbat bo‘shagan paytda «olov halqasi» $s$ manbadan yetib borish mumkin bo‘lgan barcha tugunlarni qamrab olgan bo‘ladi va har bir tugunga mumkin bo‘lgan eng qisqa yo‘l orqali yetib boriladi.

Eng qisqa yo‘llarning uzunliklarini ham hisoblash mumkin; buning uchun `d[]` yo‘l uzunliklari massivini yuritish kifoya. Shuningdek, barcha eng qisqa yo‘llarni tiklash uchun ma’lumot saqlash mumkin: buning uchun har bir tugunga qaysi tugundan kelganimizni saqlovchi `p[]` «ota» massivini yuritish kerak.

## Implementatsiya

Tavsiflangan algoritmning C++ va Java kodlarini yozamiz.

=== "C++"
    ```cpp
    vector<vector<int>> adj;  // adjacency list representation
    int n; // number of nodes
    int s; // source vertex

    queue<int> q;
    vector<bool> used(n);
    vector<int> d(n), p(n);

    q.push(s);
    used[s] = true;
    p[s] = -1;
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        for (int u : adj[v]) {
            if (!used[u]) {
                used[u] = true;
                q.push(u);
                d[u] = d[v] + 1;
                p[u] = v;
            }
        }
    }
    ```
=== "Java"
    ```java
    ArrayList<ArrayList<Integer>> adj = new ArrayList<>(); // adjacency list representation
        
    int n; // number of nodes
    int s; // source vertex


    LinkedList<Integer> q = new LinkedList<Integer>();
    boolean used[] = new boolean[n];
    int d[] = new int[n];
    int p[] = new int[n];

    q.push(s);
    used[s] = true;
    p[s] = -1;
    while (!q.isEmpty()) {
        int v = q.pop();
        for (int u : adj.get(v)) {
            if (!used[u]) {
                used[u] = true;
                q.push(u);
                d[u] = d[v] + 1;
                p[u] = v;
            }
        }
    }
    ```

Agar manbadan biror $u$ tugungacha bo‘lgan eng qisqa yo‘lni tiklab chiqarish kerak bo‘lsa, buni quyidagicha bajarish mumkin:

=== "C++"
    ```cpp
    if (!used[u]) {
        cout << "No path!";
    } else {
        vector<int> path;
        for (int v = u; v != -1; v = p[v])
            path.push_back(v);
        reverse(path.begin(), path.end());
        cout << "Path: ";
        for (int v : path)
            cout << v << " ";
    }
    ```
=== "Java"
    ```java
    if (!used[u]) {
        System.out.println("No path!");
    } else {
        ArrayList<Integer> path = new ArrayList<Integer>();
        for (int v = u; v != -1; v = p[v])
            path.add(v);
        Collections.reverse(path);
        for(int v : path)
            System.out.println(v);
    }
    ```

## BFSning qo‘llanishlari

* Vaznsiz grafda bir manbadan boshqa tugunlargacha bo‘lgan eng qisqa yo‘llarni topish.
* Yo‘naltirilmagan grafning barcha bog‘langan komponentlarini $O(n+m)$ vaqtda topish. Buning uchun avvalgi ishga tushirishlarda tashrif buyurilgan tugunlardan tashqari har bir tugundan BFS boshlaymiz. Ya’ni har yangi bog‘langan komponent uchun odatiy BFS bajaramiz, ammo `used[]` massivini har safar nollamaymiz. Umumiy ishlash vaqti baribir $O(n+m)$ bo‘lib qoladi. `used[]` ni nollamasdan grafda bir nechta BFS bajarish **kenglik bo‘yicha qidiruvlar seriyasi** deb ataladi.
* Agar o‘yin yoki masalaning har bir holatini graf tuguni, bir holatdan boshqasiga o‘tishlarni esa graf qirralari sifatida tasvirlash mumkin bo‘lsa, masalani yoki o‘yinni eng kam yurishlar soni bilan yechish.
* Vaznlari $0$ yoki $1$ bo‘lgan grafda eng qisqa yo‘lni topish. Buning uchun odatiy kenglik bo‘yicha qidiruvni biroz o‘zgartirish kifoya: `used[]` massivini yuritish o‘rniga tugungacha yangi masofa hozir topilgan masofadan kichikroq yoki yo‘qligini tekshiramiz. Joriy qirraning vazni nol bo‘lsa, tugunni navbatning boshiga, aks holda oxiriga qo‘shamiz. Bu o‘zgartirish [0–1 BFS](01_bfs.md) maqolasida batafsil tushuntirilgan.
* Yo‘naltirilgan vaznsiz grafdagi eng qisqa siklni topish. Har bir tugundan kenglik bo‘yicha qidiruvni boshlang. Joriy tugundan manba tugunga qaytuvchi qirrani ko‘rishimiz bilanoq, manba tugunni o‘z ichiga olgan eng qisqa sikl topildi. Shu vaqtda BFSni to‘xtatib, keyingi tugundan yangi BFSni boshlash mumkin. Shunday topilgan sikllarning barchasidan — har bir BFS uchun ko‘pi bilan bittadan — eng qisqasini tanlang.
* Berilgan $(a,b)$ tugunlar jufti orasidagi istalgan eng qisqa yo‘lda yotadigan barcha qirralarni topish. Buning uchun ikkita BFS bajaring: bittasini $a$ dan, ikkinchisini $b$ dan. $d_a[]$ — $a$ dan boshlangan birinchi BFS topgan eng qisqa masofalar massivi, $d_b[]$ esa $b$ dan boshlangan ikkinchi BFS topgan eng qisqa masofalar massivi bo‘lsin. Endi har bir $(u,v)$ qirra $a$ bilan $b$ orasidagi biror eng qisqa yo‘lda yotadimi yoki yo‘qmi, quyidagi shart bilan tekshiriladi: $d_a[u] + 1 + d_b[v] = d_a[b]$.
* Berilgan $(a,b)$ tugunlar jufti orasidagi istalgan eng qisqa yo‘lda yotadigan barcha tugunlarni topish. Yana $a$ va $b$ dan ikkita BFS bajaring va mos ravishda $d_a[]$ hamda $d_b[]$ masofalar massivlarini oling. Har bir $v$ tugun uchun mezon: $d_a[v] + d_b[v] = d_a[b]$.
* Vaznsiz grafda $s$ manbadan $t$ maqsadgacha bo‘lgan juft uzunlikdagi eng qisqa yurishni topish. Buning uchun tugunlari $(v,c)$ holatlardan iborat yordamchi graf tuzamiz; bu yerda $v$ — joriy tugun, $c=0$ yoki $c=1$ esa joriy uzunlik pariteti. Asl grafdagi har bir $(u,v)$ qirra yangi grafda $((u,0),(v,1))$ va $((u,1),(v,0))$ qirralarga aylanadi. Shundan so‘ng $(s,0)$ boshlang‘ich tugundan $(t,0)$ yakuniy tugungacha eng qisqa yurishni topish uchun BFS bajaramiz.<br>**Eslatma:** bu bandda «yo‘l» emas, aynan «yurish» atamasi ishlatilgan, chunki topilgan yurish uzunligini juft qilish uchun unda tugunlar takrorlanishi mumkin. Yo‘naltirilgan grafda juft uzunlikdagi eng qisqa oddiy yo‘lni topish masalasi NP-to‘liq; yo‘naltirilmagan grafda esa u [chiziqli vaqtda yechilishi mumkin](https://onlinelibrary.wiley.com/doi/abs/10.1002/net.3230140403), biroq buning uchun ancha murakkab yondashuv talab qilinadi.

## Mashq masalalari

* [SPOJ: AKBAR](http://spoj.com/problems/AKBAR)
* [SPOJ: NAKANJ](http://www.spoj.com/problems/NAKANJ/)
* [SPOJ: WATER](http://www.spoj.com/problems/WATER)
* [SPOJ: MICE AND MAZE](http://www.spoj.com/problems/MICEMAZE/)
* [Timus: Caravans](http://acm.timus.ru/problem.aspx?space=1&num=2034)
* [DevSkill - Holloween Party (archived)](http://web.archive.org/web/20200930162803/http://www.devskill.com/CodingProblems/ViewProblem/60)
* [DevSkill - Ohani And The Link Cut Tree (archived)](http://web.archive.org/web/20170216192002/http://devskill.com:80/CodingProblems/ViewProblem/150)
* [SPOJ - Spiky Mazes](http://www.spoj.com/problems/SPIKES/)
* [SPOJ - Four Chips (hard)](http://www.spoj.com/problems/ADV04F1/)
* [SPOJ - Inversion Sort](http://www.spoj.com/problems/INVESORT/)
* [Codeforces - Shortest Path](http://codeforces.com/contest/59/problem/E)
* [SPOJ - Yet Another Multiple Problem](http://www.spoj.com/problems/MULTII/)
* [UVA 11392 - Binary 3xType Multiple](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2387)
* [UVA 10968 - KuPellaKeS](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1909)
* [Codeforces - Police Stations](http://codeforces.com/contest/796/problem/D)
* [Codeforces - Okabe and City](http://codeforces.com/contest/821/problem/D)
* [SPOJ - Find the Treasure](http://www.spoj.com/problems/DIGOKEYS/)
* [Codeforces - Bear and Forgotten Tree 2](http://codeforces.com/contest/653/problem/E)
* [Codeforces - Cycle in Maze](http://codeforces.com/contest/769/problem/C)
* [UVA - 11312 - Flipping Frustration](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2287)
* [SPOJ - Ada and Cycle](http://www.spoj.com/problems/ADACYCLE/)
* [CSES - Labyrinth](https://cses.fi/problemset/task/1193)
* [CSES - Message Route](https://cses.fi/problemset/task/1667/)
* [CSES - Monsters](https://cses.fi/problemset/task/1194)
* [UVA 704 - Colour Hash](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=9&page=show_problem&problem=645) (ikki yo‘nalishli BFS)

