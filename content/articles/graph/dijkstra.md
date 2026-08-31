---
article_id: graph--dijkstra
---
# Dijkstra algoritmi

$n$ ta tugun va $m$ ta qirraga ega vaznli yo‘naltirilgan yoki yo‘naltirilmagan graf berilgan. Barcha qirralarning vaznlari manfiy emas. Shuningdek, $s$ boshlang‘ich tugun berilgan. Ushbu maqolada $s$ boshlang‘ich tugundan boshqa barcha tugunlargacha bo‘lgan eng qisqa yo‘llarning uzunliklarini topish va eng qisqa yo‘llarning o‘zini chiqarish masalasi ko‘rib chiqiladi.

Bu masala **bitta manbadan eng qisqa yo‘llar masalasi** deb ham ataladi.

## Algoritm

Quyidagi algoritmni gollandiyalik kompyuter olimi Edsger W. Dijkstra 1959-yilda bayon qilgan.

Har bir $v$ tugun uchun $s$ dan $v$ gacha hozirgacha topilgan eng qisqa yo‘l uzunligini `d[v]` da saqlaydigan $d[]$ massivini yaratamiz. Dastlab $d[s]=0$, boshqa barcha tugunlar uchun masofa cheksizlikka teng. Implementatsiyada cheksizlik sifatida mumkin bo‘lgan istalgan yo‘l uzunligidan katta bo‘lishi kafolatlangan yetarlicha katta son tanlanadi:

$$d[v]=\infty,\qquad v\ne s.$$

Bundan tashqari, har bir $v$ tugun belgilangan yoki belgilanmaganini saqlaydigan $u[]$ mantiqiy massivini yuritamiz. Dastlab barcha tugunlar belgilanmagan:

$$u[v]={\rm false}.$$

Dijkstra algoritmi $n$ ta iteratsiya bajaradi. Har bir iteratsiyada hali belgilanmagan tugunlar orasidan $d[v]$ qiymati eng kichik bo‘lgan $v$ tugun tanlanadi. Birinchi iteratsiyada $s$ boshlang‘ich tugun tanlanishi ravshan.

Tanlangan $v$ tugun belgilanadi. So‘ng $v$ dan **relaksatsiyalar** bajariladi: $(v,\text{to})$ ko‘rinishidagi barcha qirralar ko‘rib chiqiladi va algoritm har bir $\text{to}$ tugun uchun $d[\text{to}]$ qiymatini yaxshilashga urinadi. Joriy qirra uzunligi $len$ bo‘lsa, relaksatsiya formulasi:

$$d[\text{to}]=\min(d[\text{to}],d[v]+len).$$

Barcha bunday qirralar ko‘rilgach, joriy iteratsiya tugaydi. $n$ ta iteratsiyadan keyin barcha tugunlar belgilanadi va algoritm yakunlanadi. Topilgan $d[v]$ qiymatlar $s$ dan barcha $v$ tugunlargacha bo‘lgan eng qisqa yo‘llar uzunliklari ekanini quyida isbotlaymiz.

Agar ayrim tugunlarga $s$ dan yetib bo‘lmasa, ular uchun $d[v]$ qiymat cheksizligicha qoladi. Algoritmning oxirgi iteratsiyalari bunday tugunlarni tanlashi mumkin, ammo ular uchun foydali ish bajarilmaydi. Shu sababli tanlangan tugungacha masofa cheksiz bo‘lishi bilanoq algoritmni to‘xtatish mumkin.

### Eng qisqa yo‘llarni tiklash

Ko‘pincha faqat eng qisqa yo‘l uzunligi emas, yo‘lning o‘zi ham kerak bo‘ladi. $s$ dan istalgan tugungacha eng qisqa yo‘lni tiklash uchun yetarli ma’lumotni qanday saqlashni ko‘ramiz. $p[]$ ajdodlar massivini yuritamiz; har bir $v\ne s$ uchun $p[v]$ — $s$ dan $v$ gacha bo‘lgan eng qisqa yo‘ldagi oxiridan oldingi tugun.

Agar $v$ gacha eng qisqa yo‘ldan $v$ ni olib tashlasak, $p[v]$ da tugaydigan yo‘l qoladi va u $p[v]$ tugun uchun eng qisqa yo‘l bo‘ladi. Ajdodlar massivi yordamida istalgan tugungacha yo‘lni tiklash mumkin: $v$ dan boshlab joriy tugunning ajdodiga qayta-qayta o‘tamiz va $s$ boshlang‘ich tugunga yetguncha davom etamiz. Shunda tugunlari teskari tartibda yozilgan kerakli eng qisqa yo‘l olinadi.

$v$ tugungacha eng qisqa $P$ yo‘l:

$$P=(s,\ldots,p[p[p[v]]],p[p[v]],p[v],v).$$

Ajdodlar massivini qurish juda oson: har bir muvaffaqiyatli relaksatsiyada, ya’ni tanlangan $v$ tugundan biror $\text{to}$ tugungacha masofa yaxshilanganda, $\text{to}$ ning ajdodini $v$ ga yangilaymiz:

$$p[\text{to}]=v.$$

## Isbot

Dijkstra algoritmining to‘g‘riligi quyidagi asosiy tasdiqqa tayangan:

**Biror $v$ tugun belgilanganidan keyin uning joriy $d[v]$ masofasi eng qisqa masofaga teng va boshqa o‘zgarmaydi.**

Isbot induksiya bilan bajariladi. Birinchi iteratsiyada tasdiq ravshan: yagona belgilangan tugun $s$, $d[s]=0$ esa $s$ gacha eng qisqa yo‘l uzunligidir.

Endi tasdiq oldingi barcha iteratsiyalar, ya’ni allaqachon belgilangan tugunlar uchun to‘g‘ri deb faraz qilamiz va joriy iteratsiya tugagach ham buzilmasligini isbotlaymiz. $v$ — joriy iteratsiyada tanlanib belgilanadigan tugun bo‘lsin. $d[v]$ aynan $v$ gacha eng qisqa yo‘l uzunligi $l[v]$ ga tengligini ko‘rsatish kerak.

$v$ gacha eng qisqa $P$ yo‘lni ko‘ramiz. Uni ikki qismga ajratamiz: faqat belgilangan tugunlardan iborat $P_1$ qism — u hech bo‘lmaganda $s$ ni o‘z ichiga oladi — va yo‘lning qolgan $P_2$ qismi. $P_2$ ichida belgilangan tugun ham bo‘lishi mumkin, ammo uning birinchi tuguni albatta belgilanmagan. $P_2$ ning birinchi tugunini $p$, $P_1$ ning oxirgi tugunini $q$ deb belgilaymiz.

Avval $p$ uchun $d[p]=l[p]$ ekanini isbotlaymiz. Oldingi iteratsiyalardan birida $q$ tanlanib, undan relaksatsiya bajarilgan. $p$ ning tanlanishiga ko‘ra, $p$ gacha eng qisqa yo‘l $q$ gacha eng qisqa yo‘l va $(q,p)$ qirradan iborat. Demak $q$ dan relaksatsiya $d[p]$ ni $l[p]$ eng qisqa yo‘l uzunligiga tenglagan.

Qirra vaznlari manfiy bo‘lmagani uchun $l[p]=d[p]$ qiymat $v$ gacha eng qisqa yo‘l uzunligi $l[v]$ dan katta emas. Dijkstra eng qisqa mumkin bo‘lgan yo‘ldan ham qisqaroq yo‘l topa olmasligi sababli $l[v]\le d[v]$. Shunday qilib:

$$d[p]=l[p]\le l[v]\le d[v].$$

Boshqa tomondan, $p$ ham, $v$ ham belgilanmagan va joriy iteratsiyada $p$ emas, $v$ tanlangan. Demak:

$$d[p]\ge d[v].$$

Ikki tengsizlikdan $d[p]=d[v]$ kelib chiqadi. Yuqoridagi tenglik va tengsizliklardan esa:

$$d[v]=l[v].$$

Isbot tugadi.

## Implementatsiya

Dijkstra algoritmi $n$ ta iteratsiya bajaradi. Har iteratsiyada $d[v]$ qiymati eng kichik bo‘lgan belgilanmagan $v$ tugun topiladi, belgilanadi va undan chiquvchi barcha $(v,\text{to})$ qirralar bo‘yicha $d[\text{to}]$ ni yaxshilashga uriniladi.

Algoritm ishlash vaqti quyidagilardan iborat:

* $O(n)$ ta belgilanmagan tugun ichidan eng kichik $d[v]$ qiymatli tugunni $n$ marta qidirish;
* $m$ ta relaksatsiya urinishlari.

Eng sodda implementatsiyada har bir tugun qidiruvi $O(n)$, har bir relaksatsiya esa $O(1)$ vaqt oladi. Natijaviy asimptotika:

$$O(n^2+m).$$

Bu murakkablik zich, ya’ni $m\approx n^2$ bo‘lgan graflar uchun optimal. Siyrak graflarda, $m$ qiymat mumkin bo‘lgan maksimal $n^2$ qirralardan ancha kichik bo‘lganda, masalani $O(n\log n+m)$ murakkablikda yechish mumkin. Algoritm va implementatsiya [Siyrak graflarda Dijkstra](dijkstra_sparse.md) maqolasida berilgan.

```{.cpp file=dijkstra_dense}
const int INF = 1000000000;
vector<vector<pair<int, int>>> adj;
void dijkstra(int s, vector<int> & d, vector<int> & p) {
    int n = adj.size();
    d.assign(n, INF);
    p.assign(n, -1);
    vector<bool> u(n, false);
    d[s] = 0;
    for (int i = 0; i < n; i++) {
        int v = -1;
        for (int j = 0; j < n; j++) {
            if (!u[j] && (v == -1 || d[j] < d[v]))
                v = j;
        }

        if (d[v] == INF)
            break;

        u[v] = true;
        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;

            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                p[to] = v;
            }
        }
    }
}
```

Graf `adj` qo‘shnilik ro‘yxati sifatida saqlanadi. Har bir $v$ tugun uchun `adj[v]` undan chiquvchi qirralar ro‘yxatini, ya’ni `pair<int,int>` larni saqlaydi; juftlikning birinchi elementi qirraning ikkinchi uchidagi tugun, ikkinchi elementi qirra vaznidir.

Funksiya $s$ boshlang‘ich tugunni va qaytariladigan qiymatlar sifatida ishlatiladigan ikkita vektorni qabul qiladi. Avval $d[]$ masofalar, $u[]$ belgilar va $p[]$ ajdodlar massivlari boshlang‘ich holatga keltiriladi. Keyin $n$ ta iteratsiya bajariladi. Har safar belgilanmagan tugunlar orasidan $d[v]$ masofasi eng kichik $v$ tanlanadi. Agar $d[v]$ cheksiz bo‘lsa, algoritm to‘xtaydi. Aks holda $v$ belgilanadi va undan chiquvchi barcha qirralar ko‘riladi. Qirra bo‘ylab relaksatsiya mumkin bo‘lsa, $d[\text{to}]$ va $p[\text{to}]$ yangilanadi.

Barcha iteratsiyalardan keyin $d[]$ barcha tugunlargacha eng qisqa yo‘l uzunliklarini, $p[]$ esa $s$ dan boshqa tugunlarning ajdodlarini saqlaydi. Istalgan $t$ tugungacha yo‘l quyidagicha tiklanadi:

```{.cpp file=dijkstra_restore_path}
vector<int> restore_path(int s, int t, vector<int> const& p) {
    vector<int> path;

    for (int v = t; v != s; v = p[v])
        path.push_back(v);
    path.push_back(s);
    reverse(path.begin(), path.end());
    return path;
}
```

## Manbalar

* Edsger Dijkstra. *A note on two problems in connexion with graphs* [1959].
* Thomas Cormen, Charles Leiserson, Ronald Rivest, Clifford Stein. *Introduction to Algorithms* [2005].

## Mashq masalalari

* [Timus - Ivan's Car](http://acm.timus.ru/problem.aspx?space=1&num=1930) [qiyinlik: o‘rta]
* [Timus - Sightseeing Trip](http://acm.timus.ru/problem.aspx?space=1&num=1004)
* [SPOJ - SHPATH](http://www.spoj.com/problems/SHPATH/) [qiyinlik: oson]
* [Codeforces - Dijkstra?](http://codeforces.com/problemset/problem/20/C) [qiyinlik: oson]
* [Codeforces - Shortest Path](http://codeforces.com/problemset/problem/59/E)
* [Codeforces - Jzzhu and Cities](http://codeforces.com/problemset/problem/449/B)
* [Codeforces - The Classic Problem](http://codeforces.com/problemset/problem/464/E)
* [Codeforces - President and Roads](http://codeforces.com/problemset/problem/567/E)
* [Codeforces - Complete The Graph](http://codeforces.com/problemset/problem/715/B)
* [TopCoder - SkiResorts](https://community.topcoder.com/stat?c=problem_statement&pm=12468)
* [TopCoder - MaliciousPath](https://community.topcoder.com/stat?c=problem_statement&pm=13596)
* [SPOJ - Ada and Trip](http://www.spoj.com/problems/ADATRIP/)
* [LA - 3850 - Here We Go(relians) Again](https://vjudge.net/problem/UVALive-3850)
* [GYM - Destination Unknown (D)](http://codeforces.com/gym/100625)
* [UVA 12950 - Even Obsession](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=4829)
* [GYM - Journey to Grece (A)](http://codeforces.com/gym/100753)
* [UVA 13030 - Brain Fry](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=866&page=show_problem&problem=4918)
* [UVA 1027 - Toll](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3468)
* [UVA 11377 - Airport Setup](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2372)
* [Codeforces - Dynamic Shortest Path](http://codeforces.com/problemset/problem/843/D)
* [UVA 11813 - Shopping](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2913)
* [UVA 11833 - Route Change](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=226&page=show_problem&problem=2933)
* [SPOJ - Easy Dijkstra Problem](http://www.spoj.com/problems/EZDIJKST/en/)
* [LA - 2819 - Cave Raider](https://vjudge.net/problem/UVALive-2819)
* [UVA 12144 - Almost Shortest Path](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=3296)
* [UVA 12047 - Highest Paid Toll](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3198)
* [UVA 11514 - Batman](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2509)
* [Codeforces - Team Rocket Rises Again](http://codeforces.com/contest/757/problem/F)
* [UVA - 11338 - Minefield](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2313)
* [UVA 11374 - Airport Express](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2369)
* [UVA 11097 - Poor My Problem](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2038)
* [UVA 13172 - The music teacher](https://uva.onlinejudge.org/index.php?option=onlinejudge&Itemid=8&page=show_problem&problem=5083)
* [Codeforces - Dirty Arkady's Kitchen](http://codeforces.com/contest/827/problem/F)
* [SPOJ - Delivery Route](http://www.spoj.com/problems/DELIVER/)
* [SPOJ - Costly Chess](http://www.spoj.com/problems/CCHESS/)
* [CSES - Shortest Routes 1](https://cses.fi/problemset/task/1671)
* [CSES - Flight Discount](https://cses.fi/problemset/task/1195)
* [CSES - Flight Routes](https://cses.fi/problemset/task/1196)

