---
article_id: data_structures--sqrt_decomposition
---
# Sqrt Decomposition

Sqrt Decomposition — ostmassiv elementlari yig‘indisini, minimum yoki maksimumni topish kabi ko‘p uchraydigan amallarni $O(\sqrt n)$ ta amal bilan bajarish imkonini beradigan usul yoki ma’lumotlar tuzilmasi. Bu sodda $O(n)$ algoritmdan ancha tez.

Avval ushbu g‘oyaning eng sodda qo‘llanishlaridan biri uchun ma’lumotlar tuzilmasini ko‘rib chiqamiz. Keyin uni boshqa masalalarga qanday umumlashtirish mumkinligini, oxirida esa g‘oyaning biroz boshqacha qo‘llanishini — kiruvchi so‘rovlarni ildizli bloklarga ajratishni o‘rganamiz.

## Sqrt decomposition asosidagi ma’lumotlar tuzilmasi

$a[0 \dots n-1]$ massiv berilgan. Ixtiyoriy $l$ va $r$ uchun $a[l \dots r]$ elementlar yig‘indisini $O(\sqrt n)$ ta amal bilan topadigan tuzilma qurish talab qilinsin.

### Tavsif

Sqrt decompositionning asosiy g‘oyasi — oldindan hisoblash. $a$ massivini uzunligi taxminan $\sqrt n$ bo‘lgan bloklarga ajratamiz va har bir $i$-blok elementlari yig‘indisini $b[i]$ da oldindan hisoblaymiz.

Blok uzunligi ham, bloklar soni ham yuqoriga yaxlitlangan $\sqrt n$ ga teng deb olish mumkin:

$$ s = \lceil \sqrt n \rceil $$

Shunda $a$ massivi quyidagicha bloklarga bo‘linadi:

$$ \underbrace{a[0], a[1], \dots, a[s-1]}_{\text{b[0]}}, \underbrace{a[s], \dots, a[2s-1]}_{\text{b[1]}}, \dots, \underbrace{a[(s-1) \cdot s], \dots, a[n-1]}_{\text{b[s-1]}} $$

Agar $n$ soni $s$ ga bo‘linmasa, oxirgi blok boshqalaridan qisqaroq bo‘lishi mumkin; bu muammo tug‘dirmaydi. Har bir $k$-blok uchun undagi elementlar yig‘indisi ma’lum:

$$ b[k] = \sum\limits_{i=k\cdot s}^{\min {(n-1,(k+1)\cdot s - 1})} a[i] $$

$b[k]$ qiymatlarini hisoblash $O(n)$ ta amal talab qiladi. Endi bu qiymatlar $[l,r]$ so‘roviga qanday yordam berishini ko‘ramiz.

Agar $[l,r]$ yetarlicha uzun bo‘lsa, uning ichida bir nechta to‘liq blok yotadi. Har bir to‘liq blok yig‘indisini bittagina amal bilan $b$ massivdan olish mumkin. Faqat oraliqning chap va o‘ng chetida ko‘pi bilan ikkita to‘liq bo‘lmagan qism qoladi; ularning elementlari bevosita yig‘iladi.

Demak, $[l,r]$ yig‘indisini topish uchun ikkita “dum” — $[l\dots (k + 1)\cdot s-1]$ va $[p\cdot s\dots r]$ elementlarini hamda $k+1$ dan $p-1$ gacha bo‘lgan to‘liq bloklarning $b[i]$ qiymatlarini qo‘shamiz:

$$ \sum\limits_{i=l}^r a[i] = \sum\limits_{i=l}^{(k+1) \cdot s-1} a[i] + \sum\limits_{i=k+1}^{p-1} b[i] + \sum\limits_{i=p\cdot s}^r a[i] $$

_Eslatma: $k=p$ bo‘lsa, ya’ni $l$ va $r$ bitta blokda yotsa, yuqoridagi formula qo‘llanmaydi; bu holda elementlar odatiy usulda yig‘iladi._

Har bir dum uzunligi $s$ dan oshmaydi, yig‘indiga kiradigan to‘liq bloklar soni ham $s$ dan oshmaydi. $s\approx\sqrt n$ tanlangani sababli $[l,r]$ yig‘indisini hisoblash uchun jami $O(\sqrt n)$ ta amal yetadi.

### Implementatsiya

Eng sodda implementatsiyadan boshlaymiz:

```cpp
// input data
int n;
vector<int> a (n);

// preprocessing
int len = (int) sqrt (n + .0) + 1; // size of the block and the number of blocks
vector<int> b (len);
for (int i=0; i<n; ++i)
    b[i / len] += a[i];

// answering the queries
for (;;) {
    int l, r;
  // read input data for the next query
    int sum = 0;
    for (int i=l; i<=r; )
        if (i % len == 0 && i + len - 1 <= r) {
            // if the whole block starting at i belongs to [l, r]
            sum += b[i / len];
            i += len;
        }
        else {
            sum += a[i];
            ++i;
        }
}
```

Bu implementatsiya keragidan ortiq bo‘lish amallarini bajaradi; bo‘lish boshqa oddiy arifmetik amallarga qaraganda ancha sekin. Buning o‘rniga $l$ va $r$ indekslari tegishli bo‘lgan bloklarning $c_l$ va $c_r$ indekslarini bir marta hisoblaymiz. So‘ng $c_l+1\dots c_r-1$ to‘liq bloklarini aylanib chiqib, $c_l$ va $c_r$ bloklaridagi dumlarni alohida qayta ishlaymiz. Bu yuqoridagi formulaga aynan mos keladi va $c_l=c_r$ holatini alohida ko‘rib chiqadi.

```cpp
int sum = 0;
int c_l = l / len,   c_r = r / len;
if (c_l == c_r)
    for (int i=l; i<=r; ++i)
        sum += a[i];
else {
    for (int i=l, end=(c_l+1)*len-1; i<=end; ++i)
        sum += a[i];
    for (int i=c_l+1; i<=c_r-1; ++i)
        sum += b[i];
    for (int i=c_r*len; i<=r; ++i)
        sum += a[i];
}
```

## Boshqa masalalar

Hozirgacha uzluksiz ostmassiv elementlari yig‘indisini topdik. Masalani **massivning alohida elementlarini yangilash** amali bilan kengaytirish mumkin. $a[i]$ o‘zgarsa, u tegishli bo‘lgan $k=i/s$ blokning $b[k]$ qiymatini bitta amal bilan yangilash kifoya:

$$ b[k] += a_{new}[i] - a_{old}[i] $$

Yig‘indi o‘rniga ostmassiv minimumi yoki maksimumini topish ham mumkin. Alohida elementlarni yangilash ham talab qilinsa, $b[k]$ ni qayta hisoblash uchun $k$-blokning barcha qiymatlarini ko‘rib chiqish kerak bo‘ladi; bu $O(s)=O(\sqrt n)$ ta amal oladi.

Xuddi shu yondashuv nol elementlar sonini, birinchi noldan farqli elementni, ma’lum xususiyatni qanoatlantiruvchi elementlar sonini va boshqa ko‘plab agregatlarni topishga qo‘llanadi.

Masalalarning yana bir turi — **oraliqdagi barcha elementlarni yangilash**: ularni oshirish yoki berilgan qiymatga almashtirish.

Masalan, ikki amal mavjud bo‘lsin: $[l,r]$ dagi barcha elementlarga $\delta$ qo‘shish va $a[i]$ qiymatini so‘rash. Har bir $k$-blokning barcha elementlariga qo‘shilishi kerak bo‘lgan qiymatni $b[k]$ da saqlaymiz; dastlab $b[k]=0$. “Qo‘shish” amalida $[l,r]$ ichida to‘liq yotgan bloklar uchun $b[k]$ ga $\delta$ qo‘shamiz, chetdagi dum elementlarining $a[i]$ qiymatlarini esa bevosita oshiramiz. $i$ nuqtadagi javob $a[i]+b[i/s]$ bo‘ladi. Shunday qilib, oraliqqa qo‘shish $O(\sqrt n)$, nuqta so‘rovi esa $O(1)$ vaqtda bajariladi.

Bu ikki sinfni birlashtirib, **oraliqni yangilash** va **oraliq so‘rovi**ni bir vaqtda qo‘llab-quvvatlash ham mumkin. Ikkala amal ham $O(\sqrt n)$ vaqtda bajariladi. Buning uchun odatda ikkita blok massivi — masalan, `b` va `c` — kerak bo‘ladi: biri dangasa yangilanishlarni, ikkinchisi esa so‘rov agregatlarini saqlaydi.

Sqrt decomposition tartiblangan sonlar to‘plamini saqlashda ham ishlatiladi. Sonlarni qo‘shish va o‘chirish, son mavjudligini tekshirish hamda $k$-eng katta sonni topish kerak bo‘lsin. Sonlar o‘sish tartibida saqlanib, har birida taxminan $\sqrt n$ ta element bo‘lgan bloklarga ajratiladi. Qo‘shish yoki o‘chirishdan keyin qo‘shni bloklarning boshi va oxiri orasida elementlarni ko‘chirish orqali bloklar qayta muvozanatlanadi.

## Mo algoritmi

Sqrt decompositionga yaqin boshqa bir g‘oya $Q$ ta oraliq so‘roviga offline tartibda $O((N+Q)\sqrt N)$ vaqtda javob berishga imkon beradi.

Bu oldingi usullardan yomonroqdek ko‘rinishi mumkin: murakkablik biroz kattaroq va so‘rovlar orasida qiymatlarni yangilab bo‘lmaydi. Shunga qaramay, ko‘p masalalarda Mo algoritmining muhim ustunligi bor. Oddiy sqrt decompositionda har bir blok javobini oldindan hisoblab, so‘rov vaqtida blok javoblarini birlashtirish kerak. Ayrim masalalarda aynan shu birlashtirish amali juda qiyin.

Masalan, har bir so‘rov oraliqning **modasi**, ya’ni eng ko‘p uchraydigan sonni so‘rashi mumkin. Har bir blok uchun barcha sonlar chastotasini saqlash va keyin bir nechta blok ma’lumotini tez birlashtirish oson emas. **Mo algoritmi** esa faqat bitta joriy ma’lumotlar tuzilmasini saqlaydi; unga bajariladigan amallar bir elementni qo‘shish yoki olib tashlashdan iborat bo‘ladi.

So‘rovlarga indekslari bo‘yicha maxsus tartibda javob beramiz. Avval chap chegarasi 0-blokda bo‘lgan barcha so‘rovlar, keyin chap chegarasi 1-blokda bo‘lganlar va hokazo qayta ishlanadi. Har bir chap blok ichida so‘rovlar o‘ng chegarasi bo‘yicha saralanadi.

Bitta ma’lumotlar tuzilmasi joriy oraliq haqidagi ma’lumotni saqlaydi. Dastlab bu oraliq bo‘sh. Maxsus tartibdagi keyingi so‘rovga o‘tishda joriy oraliqning chap yoki o‘ng uchidan bittadan element qo‘shib yoki olib tashlab, uni yangi so‘rov oralig‘iga aylantiramiz. Shuning uchun kerakli tuzilmada faqat bitta elementni qo‘shish va o‘chirish amallarini samarali implementatsiya qilish kifoya.

So‘rovlarga asl tartibda emas, qayta saralangan tartibda javob berilgani uchun bu usul faqat offline so‘rovlar uchun qo‘llanadi.

### Implementatsiya

Mo algoritmida joriy oraliqqa indeks qo‘shish va undan indeks olib tashlash uchun ikkita funksiya ishlatiladi.

```cpp
void remove(idx);  // TODO: remove value at idx from data structure
void add(idx);     // TODO: add value at idx from data structure
int get_answer();  // TODO: extract the current answer of the data structure

int block_size;

struct Query {
    int l, r, idx;
    bool operator<(Query other) const
    {
        return make_pair(l / block_size, r) <
               make_pair(other.l / block_size, other.r);
    }
};

vector<int> mo_s_algorithm(vector<Query> queries) {
    vector<int> answers(queries.size());
    sort(queries.begin(), queries.end());

    // TODO: initialize data structure

    int cur_l = 0;
    int cur_r = -1;
    // invariant: data structure will always reflect the range [cur_l, cur_r]
    for (Query q : queries) {
        while (cur_l > q.l) {
            cur_l--;
            add(cur_l);
        }
        while (cur_r < q.r) {
            cur_r++;
            add(cur_r);
        }
        while (cur_l < q.l) {
            remove(cur_l);
            cur_l++;
        }
        while (cur_r > q.r) {
            remove(cur_r);
            cur_r--;
        }
        answers[q.idx] = get_answer();
    }
    return answers;
}
```

Masalaga qarab boshqa ma’lumotlar tuzilmasi tanlanadi va `add`/`remove`/`get_answer` funksiyalari mos ravishda yoziladi.

Masalan, oraliq yig‘indisi so‘ralsa, tuzilma sifatida dastlab $0$ bo‘lgan bitta butun son yetadi. `add` tegishli pozitsiyadagi qiymatni javobga qo‘shadi, `remove` uni ayiradi, `get_answer` esa joriy butun sonni qaytaradi.

Moda so‘rovlari uchun joriy oraliqda har bir son necha marta uchrashini saqlaydigan binary search tree, masalan `map<int, int>`, va chastota–son juftliklarini tartibda saqlaydigan ikkinchi daraxt, masalan `set<pair<int, int>>`, ishlatish mumkin. `add` avval sonning eski juftligini ikkinchi BSTdan o‘chiradi, birinchi tuzilmadagi chastotani oshiradi va yangi juftlikni qayta qo‘shadi. `remove` xuddi shunday ishlaydi, faqat chastotani kamaytiradi. `get_answer` ikkinchi daraxtdagi eng yaxshi juftlikni $O(1)$ vaqtda oladi.

### Murakkablik

Barcha so‘rovlarni saralash $O(Q\log Q)$ vaqt oladi. Endi `add` va `remove` funksiyalari necha marta chaqirilishini baholaymiz.

Blok uzunligi $S$ bo‘lsin. Chap chegarasi bir xil blokda bo‘lgan so‘rovlar o‘ng chegarasi bo‘yicha saralangan. Shu sababli bu blokdagi barcha so‘rovlar davomida `add(cur_r)` va `remove(cur_r)` jami $O(N)$ marta chaqiriladi. Barcha $N/S$ ta blok uchun bu $O(\frac{N}{S}N)$ chaqiruv beradi.

Ikki ketma-ket so‘rov orasida `cur_l` ko‘pi bilan $O(S)$ ga o‘zgaradi. Demak, `add(cur_l)` va `remove(cur_l)` uchun qo‘shimcha $O(SQ)$ chaqiruv bor.

$S\approx\sqrt N$ tanlansa, jami $O((N+Q)\sqrt N)$ ta elementar amal hosil bo‘ladi. `add` va `remove` ning har biri $O(F)$ bo‘lsa, umumiy murakkablik $O((N+Q)F\sqrt N)$ ga teng.

### Ishlash vaqtini yaxshilash bo‘yicha maslahatlar

- Blok uzunligini aynan $\sqrt N$ olish har doim eng tez variant emas. Masalan, $\sqrt N=750$ bo‘lsa, amalda 700 yoki 800 yaxshiroq ishlashi mumkin. Muhimi, blok uzunligini runtime’da hisoblamasdan `const` qilish ma’qul: kompilyator konstanta bo‘yicha bo‘lishni yaxshi optimallashtiradi.
- Toq bloklarda o‘ng chegarani o‘sish tartibida, juft bloklarda esa kamayish tartibida saralash mumkin. Oddiy saralash har yangi blok boshida o‘ng ko‘rsatkichni massiv oxiridan boshiga qaytaradi. “Ilon” tartibida esa bunday katta sakrashlar kerak bo‘lmaydi.

```cpp
bool cmp(pair<int, int> p, pair<int, int> q) {
    if (p.first / BLOCK_SIZE != q.first / BLOCK_SIZE)
        return p < q;
    return (p.first / BLOCK_SIZE & 1) ? (p.second < q.second) : (p.second > q.second);
}
```

Yanada tezroq saralash yondashuvi haqida [bu yerda](https://codeforces.com/blog/entry/61203) o‘qishingiz mumkin.

## Mashq masalalari

- [Codeforces - Kuriyama Mirai's Stones](https://codeforces.com/problemset/problem/433/B)
- [Codeforces - Another Problem about Beautiful Pairs](https://codeforces.com/contest/2197/problem/D)
- [UVA - 12003 - Array Transformer](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3154)
- [UVA - 11990 Dynamic Inversion](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3141)
- [SPOJ - Give Away](http://www.spoj.com/problems/GIVEAWAY/)
- [Codeforces - Till I Collapse](http://codeforces.com/contest/786/problem/C)
- [Codeforces - Destiny](http://codeforces.com/contest/840/problem/D)
- [Codeforces - Holes](http://codeforces.com/contest/13/problem/E)
- [Codeforces - XOR and Favorite Number](https://codeforces.com/problemset/problem/617/E)
- [Codeforces - Powerful array](http://codeforces.com/problemset/problem/86/D)
- [SPOJ - DQUERY](https://www.spoj.com/problems/DQUERY)
- [Codeforces - Robin Hood Archery](https://codeforces.com/contest/2014/problem/H)

