---
article_id: graph--bridge-searching-online
---
# Ko‘priklarni onlayn topish

Bizga yo‘naltirilmagan graf berilgan. Olib tashlanganda grafni uzib qo‘yadigan, aniqroq aytganda bog‘langan komponentlar sonini oshiradigan qirra **ko‘prik** deb ataladi. Vazifamiz berilgan grafdagi barcha ko‘priklarni topishdir.

Norasmiy aytganda, yo‘llar xaritasidagi barcha «muhim» yo‘llarni topishimiz kerak: ulardan istalgan bittasi olib tashlansa, ayrim shaharlar boshqa shaharlardan yetib bo‘lmaydigan bo‘lib qoladi.

Bu masalani [Ko‘priklarni $O(N+M)$ vaqtda topish](bridge-searching.md) maqolasi [chuqurlik bo‘yicha qidiruv](depth-first-search.md) yordamida yechadi. Bu maqoladagi algoritm ancha murakkabroq, ammo uning muhim afzalligi bor: u **onlayn** ishlaydi, ya’ni kiruvchi grafni oldindan to‘liq bilish shart emas. Qirralar birma-bir qo‘shiladi va har bir qo‘shishdan so‘ng algoritm joriy grafdagi ko‘priklar sonini qayta hisoblaydi. Boshqacha aytganda, algoritm dinamik, o‘zgarib turadigan grafda samarali ishlash uchun mo‘ljallangan.

Masalaning qat’iy bayoni quyidagicha. Dastlab graf bo‘sh va $n$ ta tugundan iborat. Keyin grafga qo‘shiladigan qirrani bildiruvchi $(a,b)$ tugunlar juftlarini ketma-ket qabul qilamiz. Har bir qirra qo‘shilgandan so‘ng grafdagi ko‘priklarning joriy sonini chiqarish kerak.

Barcha ko‘priklar ro‘yxatini yuritish, shuningdek 2-qirra-bog‘langan komponentlarni ochiq ravishda qo‘llab-quvvatlash ham mumkin.

Quyida tavsiflanadigan algoritm $O(n\log n+m)$ vaqtda ishlaydi; bu yerda $m$ — qo‘shilgan qirralar soni. Algoritm [kesishmaydigan to‘plamlar birlashmasi — DSU](../data_structures/disjoint_set_union.md) tuzilmasiga asoslanadi. Biroq ushbu maqoladagi implementatsiya rang bo‘yicha birlashtirishsiz soddalashtirilgan DSUdan foydalangani sababli $O(n\log n+m\log n)$ vaqt sarflaydi.

## Algoritm

Avval $k$-qirra-bog‘langan komponent tushunchasini ta’riflaymiz: bu $k$ tadan kam qirra olib tashlanganda ham bog‘langan bo‘lib qoladigan bog‘langan komponentdir.

Ko‘priklar grafni 2-qirra-bog‘langan komponentlarga bo‘lishini ko‘rish juda oson. Har bir 2-qirra-bog‘langan komponentni bitta tugunga siqib, siqilgan grafda faqat ko‘priklarni qirra sifatida qoldirsak, siklsiz graf, ya’ni o‘rmon hosil bo‘ladi. Quyidagi algoritm ushbu o‘rmonni ham, 2-qirra-bog‘langan komponentlarni ham ochiq ravishda saqlab boradi.

Dastlab graf bo‘sh bo‘lgani uchun unda o‘zaro bog‘lanmagan $n$ ta 2-qirra-bog‘langan komponent mavjud.

Navbatdagi $(a,b)$ qirra qo‘shilganda uch xil holat yuz berishi mumkin:

* $a$ va $b$ tugunlar bitta 2-qirra-bog‘langan komponentda. Bu qirra ko‘prik emas va o‘rmon tuzilmasini o‘zgartirmaydi; uni tashlab ketish mumkin. Ko‘priklar soni o‘zgarmaydi.
* $a$ va $b$ butunlay boshqa bog‘langan komponentlarda, ya’ni turli daraxtlarga tegishli. Bunda $(a,b)$ yangi ko‘prikka aylanadi, ikki daraxt bitta daraxtga birlashtiriladi va barcha eski ko‘priklar saqlanib qoladi. Ko‘priklar soni bittaga oshadi.
* $a$ va $b$ bitta bog‘langan komponentda, ammo turli 2-qirra-bog‘langan komponentlarda. Bunda yangi qirra eski ko‘priklarning bir qismi bilan birgalikda sikl hosil qiladi. Ushbu qirralarning barchasi ko‘prik bo‘lishdan chiqadi va hosil bo‘lgan sikl yangi 2-qirra-bog‘langan komponentga siqilishi kerak. Ko‘priklar soni bir yoki bir necha birlikka kamayadi.

Demak, butun masala 2-qirra-bog‘langan komponentlar o‘rmonida shu amallarni samarali bajarishga keltiriladi.

## O‘rmonni saqlash uchun ma’lumotlar tuzilmalari

Bizga kerak bo‘ladigan yagona ma’lumotlar tuzilmasi — [DSU](../data_structures/disjoint_set_union.md). Aslida uning ikkita nusxasini yuritamiz: bittasi bog‘langan komponentlarni, ikkinchisi 2-qirra-bog‘langan komponentlarni saqlaydi. Bundan tashqari, 2-qirra-bog‘langan komponentlar o‘rmonidagi daraxtlar tuzilmasini ota ko‘rsatkichlari bilan ifodalaymiz: har bir 2-qirra-bog‘langan komponent daraxtdagi ajdodining indeksini `par[]` da saqlaydi.

Endi kerak bo‘ladigan amallarni ketma-ket ko‘rib chiqamiz.

* **Ikki tugun bir xil bog‘langan yoki 2-qirra-bog‘langan komponentda ekanini tekshirish.** Bu odatiy DSU amali bilan bajariladi: tegishli DSUlardagi vakillarni topib, solishtiramiz.

* **$(a,b)$ qirra bilan ikki daraxtni birlashtirish.** $a$ ham, $b$ ham o‘z daraxtlarining ildizi bo‘lmasligi mumkin. Shuning uchun ikki daraxtni ulash uchun ulardan birini qayta ildizlash kerak. Masalan, $a$ tugun joylashgan daraxtni $a$ ga qayta ildizlab, so‘ng `par[a] = b` deb belgilab uni boshqa daraxtga ulash mumkin.

  Qayta ildizlash samaradorligi masalasi paydo bo‘ladi. Ildizi $r$ bo‘lgan daraxtni $v$ tugunga qayta ildizlash uchun $v$ bilan $r$ orasidagi barcha tugunlardan o‘tish, `par[]` ko‘rsatkichlarini teskari yo‘nalishga burish va bog‘langan komponentlar uchun javob beruvchi DSUdagi ajdod ko‘rsatkichlarini ham yangilash kerak. Qayta ildizlash narxi $O(h)$, bu yerda $h$ — daraxt balandligi. Uni daraxtdagi tugunlar soni bo‘lgan $	ext{size}$ orqali $O(\text{size})$ deb ham yuqoridan baholash mumkin; yakuniy murakkablik o‘zgarmaydi.

  Endi standart usulni qo‘llaymiz: kamroq tugunga ega daraxtni qayta ildizlaymiz. Eng yomon holat taxminan teng hajmli ikki daraxt birlashtirilganda yuz berishi intuitiv ravishda ravshan, ammo natijada ikki baravar katta daraxt hosil bo‘ladi va shu holat ko‘p marta takrorlana olmaydi. Umumiy xarajat quyidagi rekurrent formula bilan yoziladi:

  \[T(n)=\max_{k=1\ldots n-1}\left\{T(k)+T(n-k)+O(\min(k,n-k))\right\}.\]

  Bu yerda $T(n)$ — daraxtlarni qayta ildizlash va birlashtirish orqali $n$ tugunli daraxt hosil qilish uchun zarur amallar soni. $n$ o‘lchamli daraxt $k$ va $n-k$ o‘lchamli ikki kichik daraxtni birlashtirishdan hosil bo‘ladi. Ushbu rekurrentlikning yechimi $T(n)=O(n\log n)$. Demak har safar kichikroq daraxtni qayta ildizlasak, barcha qayta ildizlash amallariga sarflangan umumiy vaqt $O(n\log n)$ bo‘ladi. Har bir bog‘langan komponent hajmini saqlash kerak, buni DSU oson qo‘llab-quvvatlaydi.

* **Yangi $(a,b)$ qirra hosil qilgan siklni topish.** $a$ va $b$ daraxtda allaqachon bog‘langan, shuning uchun ularning [eng quyi umumiy ajdodini](lca.md) topish kerak. Sikl $b$ dan LCAgacha bo‘lgan yo‘l, LCAdan $a$ gacha bo‘lgan yo‘l va $(a,b)$ qirradan iborat bo‘ladi.

  Sikl topilgach, undagi barcha tugunlarni bitta tugunga siqamiz. Sikl uzunligiga proporsional vaqt allaqachon sarflanadi, shuning uchun LCAni ham sikl uzunligiga proporsional algoritm bilan topish mumkin; tez LCA algoritmiga ehtiyoj yo‘q. Daraxt tuzilmasi haqida barcha ma’lumot `par[]` ota massivida mavjud bo‘lgani sababli eng tabiiy algoritm quyidagicha: $a$ va $b$ tugunlarni tashrif buyurilgan deb belgilang, keyin `par[a]` va `par[b]` ajdodlariga o‘ting va ularni belgilang, so‘ng ajdodlar bo‘ylab davom eting; oldin belgilangan tugunga yetganimizda u izlayotgan LCA bo‘ladi. Sikl tugunlarini $a$ va $b$ dan LCAgacha yana bir marta yurib topamiz. Algoritm murakkabligi izlanayotgan sikl uzunligiga proporsional.

* **Daraxtga $(a,b)$ qirra qo‘shilganda hosil bo‘lgan siklni siqish.** Topilgan siklning barcha tugunlaridan yangi 2-qirra-bog‘langan komponent yaratish kerak. Siklning o‘zi avvalgi 2-qirra-bog‘langan komponentlardan tuzilgan bo‘lishi mumkin, ammo bu hech narsani o‘zgartirmaydi. Siqish daraxt tuzilmasini buzmasligi, barcha `par[]` ko‘rsatkichlari va ikkala DSU ham to‘g‘ri qolishi lozim.

  Bunga erishishning eng sodda yo‘li siklning barcha tugunlarini ularning LCAiga siqishdir. LCA sikldagi eng yuqori tugun bo‘lgani sababli uning `par[]` ko‘rsatkichi o‘zgarmaydi. Sikldagi boshqa tugunlar mavjud bo‘lishdan to‘xtagani uchun ularning ota ko‘rsatkichlarini yangilash shart emas; 2-qirra-bog‘langan komponentlar DSUsida esa bu tugunlarning barchasi LCAga ishora qiladi.

  2-qirra-bog‘langan komponentlar DSUsini rang bo‘yicha birlashtirishsiz amalga oshiramiz, shu sababli har bir so‘rov uchun o‘rtacha $O(\log n)$ murakkablik olinadi. Har so‘rovga o‘rtacha $O(1)$ erishish uchun sikl tugunlarini rang bo‘yicha birlashtirish va `par[]` ni shunga mos tayinlash kerak bo‘lardi.

## Implementatsiya

Quyida butun algoritmning yakuniy implementatsiyasi keltirilgan. Yuqorida aytilganidek, soddalik uchun 2-qirra-bog‘langan komponentlar DSUsi rang bo‘yicha birlashtirishsiz yozilgan; shu sababli natijaviy o‘rtacha murakkablik $O(\log n)$ bo‘ladi.

Bu implementatsiya ko‘priklarning o‘zini emas, faqat `bridges` sonini saqlaydi. Barcha ko‘priklardan iborat `set` yaratish qiyin emas. Dastlab `init()` funksiyasi chaqiriladi: u ikkala DSUni boshlang‘ich holatga keltiradi, har bir tugun uchun alohida to‘plam yaratadi, hajmni birga tenglaydi va `par` ajdodlarni o‘rnatadi. Asosiy funksiya `add_edge(a,b)` bo‘lib, yangi qirrani qayta ishlaydi va grafga qo‘shadi.

```cpp
vector<int> par, dsu_2ecc, dsu_cc, dsu_cc_size;
int bridges;
int lca_iteration;
vector<int> last_visit;

void init(int n) {
    par.resize(n);
    dsu_2ecc.resize(n);
    dsu_cc.resize(n);
    dsu_cc_size.resize(n);
    lca_iteration = 0;
    last_visit.assign(n, 0);
    for (int i=0; i<n; ++i) {
        dsu_2ecc[i] = i;
        dsu_cc[i] = i;
        dsu_cc_size[i] = 1;
        par[i] = -1;
    }
    bridges = 0;
}

int find_2ecc(int v) {
    if (v == -1)
        return -1;
    return dsu_2ecc[v] == v ? v : dsu_2ecc[v] = find_2ecc(dsu_2ecc[v]);
}

int find_cc(int v) {
    v = find_2ecc(v);
    return dsu_cc[v] == v ? v : dsu_cc[v] = find_cc(dsu_cc[v]);
}

void make_root(int v) {
    int root = v;
    int child = -1;
    while (v != -1) {
        int p = find_2ecc(par[v]);
        par[v] = child;
        dsu_cc[v] = root;
        child = v;
        v = p;
    }
    dsu_cc_size[root] = dsu_cc_size[child];
}
void merge_path (int a, int b) {
    ++lca_iteration;
    vector<int> path_a, path_b;
    int lca = -1;
    while (lca == -1) {
        if (a != -1) {
            a = find_2ecc(a);
            path_a.push_back(a);
            if (last_visit[a] == lca_iteration){
                lca = a;
                break;
                }
            last_visit[a] = lca_iteration;
            a = par[a];
        }
        if (b != -1) {
            b = find_2ecc(b);
            path_b.push_back(b);
            if (last_visit[b] == lca_iteration){
                lca = b;
                break;
                }
            last_visit[b] = lca_iteration;
            b = par[b];
        }

    }
    for (int v : path_a) {
        dsu_2ecc[v] = lca;
        if (v == lca)
            break;
        --bridges;
    }
    for (int v : path_b) {
        dsu_2ecc[v] = lca;
        if (v == lca)
            break;
        --bridges;
    }
}

void add_edge(int a, int b) {
    a = find_2ecc(a);
    b = find_2ecc(b);
    if (a == b)
        return;

    int ca = find_cc(a);
    int cb = find_cc(b);
    if (ca != cb) {
        ++bridges;
        if (dsu_cc_size[ca] > dsu_cc_size[cb]) {
            swap(a, b);
            swap(ca, cb);
        }
        make_root(a);
        par[a] = dsu_cc[a] = b;
        dsu_cc_size[cb] += dsu_cc_size[a];
    } else {
        merge_path(a, b);
    }
}
```

2-qirra-bog‘langan komponentlar DSUsi `dsu_2ecc` vektorida saqlanadi va vakilni qaytaruvchi funksiya `find_2ecc(v)` dir. Bu funksiya kodning qolgan qismida ko‘p marta ishlatiladi: bir nechta tugun bitta tugunga siqilgach, ular mavjud bo‘lishdan to‘xtaydi va o‘rmonda faqat vakil tugungina to‘g‘ri `par` ajdodiga ega bo‘ladi.

Bog‘langan komponentlar DSUsi `dsu_cc` vektorida saqlanadi; komponent hajmlari uchun qo‘shimcha `dsu_cc_size` vektori mavjud. `find_cc(v)` bog‘langan komponentning vakilini, amalda daraxt ildizini qaytaradi.

`make_root(v)` daraxtni yuqorida bayon qilinganidek qayta ildizlaydi: $v$ dan ajdodlar bo‘ylab ildizgacha yuradi va har safar `par` ko‘rsatkichini teskari yo‘nalishga buradi. `dsu_cc` dagi bog‘langan komponent vakiliga havola ham yangi ildizga ishora qilishi uchun yangilanadi. Qayta ildizlashdan keyin yangi ildizga komponentning to‘g‘ri hajmini tayinlash kerak. Siqib yuborilgan boshqa tugun o‘rniga 2-qirra-bog‘langan komponent vakilini olish uchun `find_2ecc()` chaqirilishiga ham e’tibor beriladi.

`merge_path(a,b)` siklni topish va siqishni yuqorida bayon qilingan usulda bajaradi. U $a$ va $b$ ni parallel ravishda yuqoriga ko‘tarib, ikkinchi marta uchragan tugunni topadi; bu tugun LCA bo‘ladi. Samaradorlik uchun har bir LCA qidiruviga yagona identifikator berilib, o‘tilgan tugunlar shu identifikator bilan belgilanadi. Bu $O(1)$ amallar bilan ishlaydi; `set` dan foydalanish kabi boshqa yondashuvlar sekinroq bo‘ladi.

O‘tilgan yo‘llar `path_a` va `path_b` vektorlarida saqlanadi. Keyin ular bo‘ylab LCAgacha ikkinchi marta yurib, siklning barcha tugunlari olinadi. Sikl tugunlarining barchasi LCAga biriktirilib siqiladi; rang bo‘yicha birlashtirish ishlatilmagani uchun o‘rtacha murakkablik $O(\log n)$. O‘tilgan qirralarning barchasi ilgari ko‘prik bo‘lgan, shuning uchun sikldagi har bir qirra uchun `bridges` bittaga kamaytiriladi.

Nihoyat, `add_edge(a,b)` so‘rov funksiyasi $a$ va $b$ tugunlar qaysi bog‘langan komponentlarda yotishini aniqlaydi. Ular turli komponentlarda bo‘lsa, kichikroq daraxt qayta ildizlanib kattaroq daraxtga ulanadi. Tugunlar bitta daraxtda, ammo turli 2-qirra-bog‘langan komponentlarda bo‘lsa, siklni aniqlab bitta 2-qirra-bog‘langan komponentga siqadigan `merge_path(a,b)` chaqiriladi.

