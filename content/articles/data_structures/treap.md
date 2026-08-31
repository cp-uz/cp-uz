---
article_id: data_structures--treap
---
# Treap (Cartesian tree)

Treap — binary tree va binary heap xususiyatlarini birlashtiruvchi ma’lumotlar tuzilmasi. Uning nomi ham aynan `tree + heap` birikmasidan kelib chiqqan.

Aniqroq aytganda, treap $(X,Y)$ juftliklarini shunday ikkilik daraxtda saqlaydiki, u $X$ bo‘yicha binary search tree, $Y$ bo‘yicha esa binary heap bo‘ladi. Agar daraxtning biror tugunida $(X_0,Y_0)$ qiymatlari saqlansa, chap ost-daraxtdagi barcha tugunlar uchun $X\le X_0$, o‘ng ost-daraxtdagi barcha tugunlar uchun $X_0\le X$, ikkala ost-daraxtdagi barcha tugunlar uchun esa $Y\le Y_0$ bo‘ladi.

Treapni ko‘pincha «Cartesian tree» deb ham atashadi, chunki uni Dekart tekisligiga tabiiy joylashtirish mumkin:

<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Treap.svg" width="350px"/>
</center>

Treap Raimund Seidel va Cecilia Aragon tomonidan 1989-yilda taklif qilingan.

## Bunday tashkil etishning afzalliklari

Ushbu implementatsiyada $X$ qiymatlari kalitlar va bir vaqtning o‘zida treapda saqlanadigan qiymatlar hisoblanadi; $Y$ qiymatlari esa **prioritetlar** deyiladi. Prioritetlar bo‘lmaganda treap oddiy $X$ bo‘yicha binary search tree bo‘lar edi. Bitta $X$ qiymatlar to‘plamiga ko‘plab turli daraxtlar mos kelishi, ularning ayrimlari degeneratsiyalashgan — masalan, linked list shaklida — bo‘lishi mumkin. Bunday daraxtlarda asosiy amallar $O(N)$ vaqt talab qiladi.

Boshqa tomondan, prioritetlar o‘zaro turli bo‘lsa, quriladigan daraxtni **yagona** tarzda aniqlaydi; bu daraxtga qiymatlar qaysi tartibda qo‘shilganiga bog‘liq emas. Tegishli teorema bilan buni isbotlash mumkin. Agar prioritetlar **tasodifiy tanlansa**, o‘rtacha holatda degeneratsiyalashmagan daraxt olinadi va asosiy amallarning $O(\log N)$ murakkabligi ta’minlanadi. Shu sababli ushbu tuzilma **randomized binary search tree** deb ham ataladi.

## Amallar

Treap quyidagi amallarni qo‘llab-quvvatlaydi:

- **Insert $(X,Y)$** — $O(\log N)$. Daraxtga yangi tugun qo‘shadi. Variantlardan birida funksiyaga faqat $X$ berilib, $Y$ amal ichida tasodifiy hosil qilinadi.
- **Search $(X)$** — $O(\log N)$. Berilgan $X$ kalitli tugunni qidiradi. Implementatsiya oddiy binary search tree dagi kabi.
- **Erase $(X)$** — $O(\log N)$. Berilgan $X$ kalitli tugunni topib, daraxtdan o‘chiradi.
- **Build $(X_1,\dots,X_N)$** — $O(N)$. Qiymatlar ro‘yxatidan daraxt quradi. $X_1,\dots,X_N$ saralangan bo‘lsa, buni chiziqli vaqtda bajarish mumkin.
- **Union $(T_1,T_2)$** — $O(M\log(N/M))$. Barcha elementlar turli deb faraz qilib, ikki daraxtni birlashtiradi. Birlashtirish paytida takroriy elementlarni o‘chirish kerak bo‘lganda ham xuddi shu murakkablikka erishish mumkin.
- **Intersect $(T_1,T_2)$** — $O(M\log(N/M))$. Ikki daraxt kesishmasini, ya’ni umumiy elementlarini topadi. Ushbu amal implementatsiyasi bu maqolada ko‘rib chiqilmaydi.

Bundan tashqari, treap binary search tree bo‘lgani sababli $K$-eng katta elementni topish yoki element indeksini aniqlash kabi boshqa amallarni ham bajarishi mumkin.

## Implementatsiya tavsifi

Implementatsiya nuqtayi nazaridan har bir tugunda $X$, $Y$ va chap ($L$) hamda o‘ng ($R$) farzandlarga ko‘rsatkichlar saqlanadi.

Barcha kerakli amallarni atigi ikkita yordamchi amal — Split va Merge — orqali implementatsiya qilamiz.

### Split

<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Treap_split.svg" width="450px"/>
</center>

**Split $(T,X)$** $T$ daraxtini $L$ va $R$ nomli ikki ost-daraxtga ajratadi va ularni natija sifatida qaytaradi. $L$ barcha $X_L\le X$ kalitli elementlarni, $R$ esa barcha $X_R>X$ kalitli elementlarni o‘z ichiga oladi. Amal $O(\log N)$ murakkablikka ega va sodda rekursiya bilan bajariladi:

1. Agar ildiz tugun qiymati $R\le X$ bo‘lsa, `L` kamida `R->L` va `R` dan iborat bo‘ladi. `R->R` uchun `split` ni chaqirib, natijalarni `L'` va `R'` deb belgilaymiz. Yakunda `L` ga `L'` ham kiradi, `R=R'` bo‘ladi.
2. Agar ildiz tugun qiymati $R>X$ bo‘lsa, `R` kamida `R` va `R->R` dan iborat bo‘ladi. `R->L` uchun `split` ni chaqirib, natijalarni `L'` va `R'` deb belgilaymiz. Yakunda `L=L'`, `R` esa `R'` ni ham o‘z ichiga oladi.

Demak, split algoritmi:

1. ildiz tugun qaysi ost-daraxtga — chap yoki o‘ngga — kirishini aniqlaydi;
2. uning farzandlaridan biri uchun rekursiv `split` chaqiradi;
3. rekursiv natijadan foydalanib yakuniy javobni quradi.

### Merge

<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Treap_merge.svg" width="500px"/>
</center>

**Merge $(T_1,T_2)$** ikkita $T_1$ va $T_2$ ost-daraxtini birlashtirib, yangi daraxtni qaytaradi. Bu amal ham $O(\log N)$ murakkablikka ega. Uning sharti: $T_1$ va $T_2$ tartiblangan, ya’ni $T_1$ dagi barcha $X$ kalitlar $T_2$ dagi kalitlardan kichik bo‘lishi kerak. Daraxtlarni $Y$ prioritetlar tartibini buzmasdan birlashtirish zarur.

Buning uchun ildizidagi $Y$ prioriteti kattaroq bo‘lgan daraxtni yangi ildiz sifatida tanlaymiz. Keyin boshqa daraxtni tanlangan ildizning tegishli ost-daraxti bilan rekursiv ravishda `Merge` qilamiz.

### Insert

<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Treap_insert.svg" width="500px"/>
</center>

Endi **Insert $(X,Y)$** implementatsiyasi tabiiy. Avval daraxt bo‘ylab oddiy $X$ bo‘yicha binary search tree dagidek pastga tushamiz va prioriteti $Y$ dan kichik bo‘lgan birinchi tugunda to‘xtaymiz. Yangi element qo‘yiladigan joy topildi. So‘ng shu tugundan boshlanuvchi ost-daraxt uchun **Split $(T,X)$** ni chaqirib, qaytgan $L$ va $R$ daraxtlarini yangi tugunning chap va o‘ng farzandlari qilamiz.

Muqobil usulda boshlang‘ich treapni $X$ bo‘yicha ajratib, yangi tugun bilan ikki marta `merge` bajarish mumkin; rasmda shu variant ko‘rsatilgan.

### Erase

<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Treap_erase.svg" width="500px"/>
</center>

**Erase $(X)$** implementatsiyasi ham sodda. Avval oddiy binary search tree dagidek daraxt bo‘ylab tushib, o‘chiriladigan $X$ elementni topamiz. Tugun topilgach, uning farzandlari uchun **Merge** chaqiramiz va natijani o‘chirilayotgan element o‘rniga qo‘yamiz.

Muqobil ravishda, $X$ ni o‘z ichiga olgan ost-daraxtni ikkita split orqali ajratib, qolgan treaplarni birlashtirish mumkin.

### Build

**Build** amalini $N$ marta **Insert** chaqirish orqali $O(N\log N)$ murakkablikda implementatsiya qilish mumkin.

### Union

**Union $(T_1,T_2)$** amalining nazariy murakkabligi $O(M\log(N/M))$, amalda esa u odatda juda yaxshi, ehtimol kichik yashirin o‘zgarmas bilan ishlaydi. Umumiylikni yo‘qotmasdan $T_1\to Y>T_2\to Y$, ya’ni $T_1$ ildizi natija ildizi bo‘ladi, deb faraz qilaylik. Natijani olish uchun $T_1\to L$, $T_1\to R$ va $T_2$ daraxtlarini $T_1$ ildizining farzandlari bo‘la oladigan ikkita daraxtga birlashtirish kerak.

Buning uchun **Split $(T_2,T_1\to X)$** ni chaqirib, $T_2$ ni $L$ va $R$ qismlarga ajratamiz. Keyin ularni $T_1$ farzandlari bilan rekursiv birlashtiramiz: **Union $(T_1\to L,L)$** va **Union $(T_1\to R,R)$**. Natijada javobning chap va o‘ng ost-daraxtlari hosil bo‘ladi.

## Implementatsiya

```cpp
struct item {
	int key, prior;
	item *l, *r;
	item () { }
	item (int key) : key(key), prior(rand()), l(NULL), r(NULL) { }
	item (int key, int prior) : key(key), prior(prior), l(NULL), r(NULL) { }
};
typedef item* pitem;
```

Bu tugun ta’rifi. Unda ikkita farzand ko‘rsatkichi, BST uchun butun `key` va heap uchun butun `prior` saqlanadi. Prioritet tasodifiy son generatori orqali tayinlanadi.

```cpp
void split (pitem t, int key, pitem & l, pitem & r) {
	if (!t)
		l = r = NULL;
	else if (t->key <= key)
        split (t->r, key, t->r, r),  l = t;
	else
        split (t->l, key, l, t->l),  r = t;
}
```

Bu yerda `t` — ajratiladigan treap, `key` esa ajratish chegarasi bo‘lgan BST qiymati. Natijalar `return` orqali qaytarilmaydi; ulardan quyidagicha foydalanamiz:

```cpp
pitem l = nullptr, r = nullptr;
split(t, 5, l, r);
if (l) cout << "Left subtree size: " << (l->size) << endl;
if (r) cout << "Right subtree size: " << (r->size) << endl;
```

`split` funksiyasini tushunish qiyin tuyulishi mumkin, chunki unda ko‘rsatkichlar (`pitem`) ham, shu ko‘rsatkichlarga reference lar (`pitem &l`) ham ishlatiladi. `split(t,k,l,r)` chaqiruvi so‘z bilan quyidagini anglatadi: «`t` treapni `k` qiymati bo‘yicha ikki treapga ajrat; chap treapni `l` ga, o‘ng treapni `r` ga yoz».

Endi oldingi bo‘limda ko‘rilgan holatlar asosida bu ta’rifni ikki rekursiv chaqiruvga qo‘llaymiz. Birinchi `if` bo‘sh treap uchun oddiy bazaviy holatdir.

1. Ildiz tugun qiymati `key` dan kichik yoki teng bo‘lsa, `split(t->r, key, t->r, r)` ni chaqiramiz. Bu «`t->r` treapni `key` bo‘yicha ajratib, chap natijani `t->r` ga, o‘ng natijani `r` ga yoz» degani. Shundan keyin `l=t` qilamiz. Endi `l` natijasi `t->l`, `t` va rekursiv chaqiruvdan chiqqan `t->r` ni to‘g‘ri tartibda birlashtirilgan holda o‘z ichiga oladi.
2. Ildiz tugun qiymati `key` dan katta bo‘lsa, `split(t->l, key, l, t->l)` ni chaqiramiz. Bu «`t->l` treapni `key` bo‘yicha ajratib, chap natijani `l` ga, o‘ng natijani `t->l` ga yoz» degani. Shundan keyin `r=t` qilamiz. Endi `r` natijasi rekursiv natija bo‘lgan `t->l`, `t` va `t->r` ni to‘g‘ri tartibda o‘z ichiga oladi.

Implementatsiya hali ham tushunarsiz bo‘lsa, uni _induktiv_ qarash foydali: rekursiv chaqiruvlarni cheksiz ochishga urinmang. `split` bo‘sh treapda to‘g‘ri ishlaydi deb oling; keyin bitta tugunli, undan so‘ng ikki tugunli treapda tekshiring va har bosqichda kichikroq treaplar uchun funksiya to‘g‘ri ishlashidan foydalaning.

```cpp
void insert (pitem & t, pitem it) {
	if (!t)
		t = it;
	else if (it->prior > t->prior)
		split (t, it->key, it->l, it->r),  t = it;
	else
		insert (t->key <= it->key ? t->r : t->l, it);
}

void merge (pitem & t, pitem l, pitem r) {
	if (!l || !r)
		t = l ? l : r;
	else if (l->prior > r->prior)
		merge (l->r, l->r, r),  t = l;
	else
		merge (r->l, l, r->l),  t = r;
}
void erase (pitem & t, int key) {
	if (t->key == key) {
		pitem th = t;
		merge (t, t->l, t->r);
		delete th;
	}
	else
		erase (key < t->key ? t->l : t->r, key);
}

pitem unite (pitem l, pitem r) {
	if (!l || !r)  return l ? l : r;
	if (l->prior < r->prior)  swap (l, r);
	pitem lt, rt;
	split (r, l->key, lt, rt);
	l->l = unite (l->l, lt);
	l->r = unite (l->r, rt);
	return l;
}
```

## Ost-daraxt o‘lchamlarini saqlash

Treap imkoniyatlarini kengaytirish uchun ko‘pincha har bir tugun ost-daraxtidagi tugunlar sonini `item` tuzilmasining `int cnt` maydonida saqlash kerak bo‘ladi. Masalan, daraxtdagi $K$-eng katta elementni yoki saralangan ro‘yxatdagi element indeksini $O(\log N)$ vaqtda topish mumkin. Bu amallarning implementatsiyasi oddiy binary search tree dagi bilan bir xil.

Daraxt o‘zgarganda — tugun qo‘shilganda, o‘chirilganda va hokazo — ayrim tugunlarning `cnt` qiymatlarini yangilash kerak. Ikki funksiya yaratamiz: `cnt()` tugun mavjud bo‘lsa uning `cnt` qiymatini, aks holda 0 ni qaytaradi; `upd_cnt()` esa chap va o‘ng farzandlarining `cnt` qiymatlari allaqachon yangilangan deb olib, joriy tugun `cnt` qiymatini hisoblaydi. `cnt` qiymatlarini doim to‘g‘ri saqlash uchun `insert`, `erase`, `split` va `merge` oxiriga `upd_cnt()` chaqiruvlarini qo‘shish kifoya.

```cpp
int cnt (pitem t) {
	return t ? t->cnt : 0;
}

void upd_cnt (pitem t) {
	if (t)
		t->cnt = 1 + cnt(t->l) + cnt (t->r);
}
```

## Offline rejimda treapni $O(N)$ da qurish {data-toc-label="Building a Treap in O(N) in offline mode"}

Saralangan kalitlar ro‘yxati berilganda treapni kalitlarni bittadan qo‘shishning $O(N\log N)$ vaqtidan tezroq qurish mumkin. Kalitlar saralanganligi sababli muvozanatlangan binary search tree ni chiziqli vaqtda oson quramiz. $Y$ heap qiymatlarini tasodifiy boshlang‘ich qiymatlar bilan to‘ldiramiz, keyin ularni $X$ kalitlardan mustaqil ravishda heapify qilib, [heapni $O(N)$ da quramiz](https://en.wikipedia.org/wiki/Binary_heap#Building_a_heap).

```cpp
void heapify (pitem t) {
	if (!t) return;
	pitem max = t;
	if (t->l != NULL && t->l->prior > max->prior)
		max = t->l;
	if (t->r != NULL && t->r->prior > max->prior)
		max = t->r;
	if (max != t) {
		swap (t->prior, max->prior);
		heapify (max);
	}
}
pitem build (int * a, int n) {
	// Construct a treap on values {a[0], a[1], ..., a[n - 1]}
	if (n == 0) return NULL;
	int mid = n / 2;
	pitem t = new item (a[mid], rand ());
	t->l = build (a, mid);
	t->r = build (a + mid + 1, n - mid - 1);
	heapify (t);
	upd_cnt(t)
	return t;
}
```

Eslatma: `upd_cnt(t)` faqat ost-daraxt o‘lchamlari kerak bo‘lsa chaqiriladi.

Yuqoridagi yondashuv har doim mukammal muvozanatlangan daraxt beradi va bu odatda amaliy jihatdan yaxshi. Biroq u har bir tugunga boshida berilgan prioritetlarni saqlamaydi. Shu sababli u quyidagi masalani yechishga yaramaydi:

!!! example "[acmsguru — Cartesian Tree](https://codeforces.com/problemsets/acmsguru/problem/99999/155)"
    $(x_i,y_i)$ juftliklari ketma-ketligi berilgan. Ular ustida Cartesian tree quring. Barcha $x_i$ va barcha $y_i$ qiymatlar o‘zaro turli.

Bu masalada prioritetlar tasodifiy emas. Shuning uchun tugunlarni bittadan qo‘shish kvadratik yechimga olib kelishi mumkin.

Yechimlardan biri — har bir element uchun undan chap va o‘ngda joylashgan, prioriteti undan kichik bo‘lgan eng yaqin elementlarni topish. Shu ikki elementdan prioriteti kattaroq bo‘lgani joriy elementning otasi bo‘lishi kerak.

Bu masalani [minimum stack](./stack_queue_modification.md) modifikatsiyasi yordamida chiziqli vaqtda yechish mumkin:

```cpp
void connect(auto from, auto to) {
    vector<pitem> st;
    for(auto it: ranges::subrange(from, to)) {
        while(!st.empty() && st.back()->prior > it->prior) {
            st.pop_back();
        }
        if(!st.empty()) {
            if(!it->p || it->p->prior < st.back()->prior) {
                it->p = st.back();
            }
        }
        st.push_back(it);
    }
}
pitem build(int *x, int *y, int n) {
    vector<pitem> nodes(n);
    for(int i = 0; i < n; i++) {
        nodes[i] = new item(x[i], y[i]);
    }
    connect(nodes.begin(), nodes.end());
    connect(nodes.rbegin(), nodes.rend());
    for(int i = 0; i < n; i++) {
        if(nodes[i]->p) {
            if(nodes[i]->p->key < nodes[i]->key) {
                nodes[i]->p->r = nodes[i];
            } else {
                nodes[i]->p->l = nodes[i];
            }
        }
    }
    return nodes[min_element(y, y + n) - y];
}
```

## Implicit Treap

Implicit treap — oddiy treapning sodda, ammo juda kuchli modifikatsiyasi. Uni quyidagi amallarni online rejimda $O(\log N)$ vaqtda bajaradigan massiv sifatida qarash mumkin:

- massivning istalgan joyiga element qo‘shish;
- ixtiyoriy elementni o‘chirish;
- istalgan oraliqda yig‘indi, minimum, maksimum va boshqa qiymatlarni topish;
- istalgan oraliqqa son qo‘shish yoki uni bir qiymatga bo‘yash;
- istalgan oraliqdagi elementlar tartibini teskarisiga aylantirish.

G‘oya shundan iboratki, kalitlar massiv elementlarining noldan boshlanuvchi **indekslari** bo‘lishi kerak. Lekin bu qiymatlarni ochiq saqlamaymiz; aks holda, masalan, element qo‘shish daraxtning $O(N)$ ta tugunida kalitni o‘zgartirishi mumkin edi.

Tugun kaliti undan kichik bo‘lgan tugunlar soniga teng. Bunday tugunlar nafaqat uning chap ost-daraxtida, balki ajdodlarining chap ost-daraxtlarida ham bo‘lishi mumkin.

Aniqroq, $T$ tugunning **implicit kaliti** uning chap ost-daraxtidagi $cnt(T\to L)$ tugunlar soniga, shuningdek $T$ tugun $P$ ajdodning o‘ng ost-daraxtida yotadigan har bir $P$ uchun $cnt(P\to L)+1$ qiymatlar yig‘indisiga teng.

Endi joriy tugunning implicit kalitini tez hisoblash mumkin. Barcha amallarda tugunga daraxt bo‘ylab pastga tushib kelganimiz sababli, ushbu yig‘indini to‘plab borib funksiyaga uzatamiz. Chap ost-daraxtga o‘tsak yig‘indi o‘zgarmaydi; o‘ng ost-daraxtga o‘tsak u $cnt(T\to L)+1$ ga oshadi.

Yangi **Split** va **Merge** implementatsiyalari:

```cpp
void merge (pitem & t, pitem l, pitem r) {
	if (!l || !r)
		t = l ? l : r;
	else if (l->prior > r->prior)
		merge (l->r, l->r, r),  t = l;
	else
		merge (r->l, l, r->l),  t = r;
	upd_cnt (t);
}

void split (pitem t, pitem & l, pitem & r, int key, int add = 0) {
	if (!t)
		return void( l = r = 0 );
	int cur_key = add + cnt(t->l); //implicit key
	if (key <= cur_key)
		split (t->l, l, t->l, key, add),  r = t;
	else
		split (t->r, t->r, r, key, add + 1 + cnt(t->l)),  l = t;
	upd_cnt (t);
}
```

Yuqoridagi implementatsiyada $split(T,T_1,T_2,k)$ chaqiruvidan so‘ng $T_1$ daraxti $T$ ning dastlabki $k$ ta elementidan — implicit kaliti $k$ dan kichik elementlardan — iborat bo‘ladi, $T_2$ esa qolgan barcha elementlarni saqlaydi.

Implicit treapdagi turli amallar implementatsiyasini ko‘rib chiqamiz:

- **Element qo‘shish.** Elementni $pos$ pozitsiyaga qo‘shish kerak bo‘lsin. Treapni $[0..pos-1]$ va $[pos..sz]$ massivlariga mos keladigan ikki qismga ajratish uchun $split(T,T_1,T_2,pos)$ ni chaqiramiz. So‘ng $merge(T_1,T_1,\text{new item})$ orqali $T_1$ ni yangi tugun bilan birlashtiramiz; barcha shartlar bajarilishi ravshan. Oxirida $merge(T,T_1,T_2)$ orqali daraxtlarni yana $T$ ga birlashtiramiz.
- **Element o‘chirish.** Bu yanada sodda: o‘chiriladigan $T$ elementni topamiz, uning $L$ va $R$ farzandlarini birlashtiramiz va $T$ o‘rniga merge natijasini qo‘yamiz. Implicit treapdagi element o‘chirish oddiy treapdagi bilan aynan bir xil.
- **Oraliqda yig‘indi, minimum va hokazoni topish.** Avval `item` tuzilmasiga tugun ost-daraxti uchun maqsad funksiyaning qiymatini saqlaydigan $F$ maydonini qo‘shamiz. Uni ost-daraxt o‘lchamlarini saqlash kabi yangilash oson: tugun qiymatini farzandlar qiymatlaridan hisoblaydigan funksiya yaratib, daraxtni o‘zgartiradigan barcha funksiyalar oxirida uni chaqiramiz. $[A;B]$ oralig‘iga mos daraxt qismini olish uchun $split(T,T_2,T_3,B+1)$, keyin $split(T_2,T_1,T_2,A)$ ni chaqiramiz. Shundan keyin $T_2$ aynan $[A;B]$ elementlaridan iborat bo‘ladi va javob uning ildizidagi $F$ maydonida turadi. So‘rovdan keyin $merge(T,T_1,T_2)$ va $merge(T,T,T_3)$ orqali daraxtni tiklaymiz.
- **Oraliqqa qo‘shish yoki bo‘yash.** Oldingi bandga o‘xshash ishlaymiz, lekin $F$ o‘rniga ost-daraxtga qo‘shiladigan qiymatni yoki u bo‘yaladigan qiymatni saqlovchi `add` maydonini tutamiz. Har qanday amal oldidan bu qiymatni to‘g‘ri `push` qilish — $T\to L\to add$ va $T\to R\to add$ ni o‘zgartirib, ota tugundagi `add` ni tozalash — kerak. Shunda daraxt o‘zgarsa ham ma’lumot yo‘qolmaydi.
- **Oraliqni teskarisiga aylantirish.** Bu ham oldingi amalga o‘xshaydi. `rev` mantiqiy bayroq qo‘shib, joriy tugun ost-daraxtini teskarisiga aylantirish kerak bo‘lganda uni `true` qilamiz. Bu qiymatni `push` qilish biroz murakkabroq: tugunning farzandlarini almashtiramiz va ularda ham bayroqni teskarilaymiz.

Quyida oraliqni teskarisiga aylantirishni qo‘llab-quvvatlaydigan implicit treap implementatsiyasi berilgan. Har bir tugunda massivning joriy pozitsiyadagi haqiqiy qiymatini saqlovchi `value` maydoni bor. Shuningdek, implicit treapning joriy holatiga mos massivni chiqaruvchi `output()` funksiyasi implementatsiya qilingan.

```cpp
typedef struct item * pitem;
struct item {
	int prior, value, cnt;
	bool rev;
	pitem l, r;
};

int cnt (pitem it) {
	return it ? it->cnt : 0;
}
void upd_cnt (pitem it) {
	if (it)
		it->cnt = cnt(it->l) + cnt(it->r) + 1;
}

void push (pitem it) {
	if (it && it->rev) {
		it->rev = false;
		swap (it->l, it->r);
		if (it->l)  it->l->rev ^= true;
		if (it->r)  it->r->rev ^= true;
	}
}

void merge (pitem & t, pitem l, pitem r) {
	push (l);
	push (r);
	if (!l || !r)
		t = l ? l : r;
	else if (l->prior > r->prior)
		merge (l->r, l->r, r),  t = l;
	else
		merge (r->l, l, r->l),  t = r;
	upd_cnt (t);
}
void split (pitem t, pitem & l, pitem & r, int key, int add = 0) {
	if (!t)
		return void( l = r = 0 );
	push (t);
	int cur_key = add + cnt(t->l);
	if (key <= cur_key)
		split (t->l, l, t->l, key, add),  r = t;
	else
		split (t->r, t->r, r, key, add + 1 + cnt(t->l)),  l = t;
	upd_cnt (t);
}

void reverse (pitem t, int l, int r) {
	pitem t1, t2, t3;
	split (t, t1, t2, l);
	split (t2, t2, t3, r-l+1);
	t2->rev ^= true;
	merge (t, t1, t2);
	merge (t, t, t3);
}
void output (pitem t) {
	if (!t)  return;
	push (t);
	output (t->l);
	printf ("%d ", t->value);
	output (t->r);
}
```

## Adabiyot

- [Blelloch, Reid-Miller — “Fast Set Operations Using Treaps”](https://www.cs.cmu.edu/~scandal/papers/treaps-spaa98.pdf)

## Amaliy masalalar

- [SPOJ — Ada and Aphids](http://www.spoj.com/problems/ADAAPHID/)
- [SPOJ — Ada and Harvest](http://www.spoj.com/problems/ADACROP/)
- [Codeforces — Radio Stations](http://codeforces.com/contest/762/problem/E)
- [SPOJ — Ghost Town](http://www.spoj.com/problems/COUNT1IT/)
- [SPOJ — Arrangement Validity](http://www.spoj.com/problems/IITWPC4D/)
- [SPOJ — All in One](http://www.spoj.com/problems/ALLIN1/)
- [Codeforces — Dog Show](http://codeforces.com/contest/847/problem/D)
- [Codeforces — Yet Another Array Queries Problem](http://codeforces.com/contest/863/problem/D)
- [SPOJ — Mean of Array](http://www.spoj.com/problems/MEANARR/)
- [SPOJ — TWIST](http://www.spoj.com/problems/TWIST/)
- [SPOJ — KOILINE](http://www.spoj.com/problems/KOILINE/)
- [CodeChef — The Prestige](https://www.codechef.com/problems/PRESTIGE)
- [Codeforces — T-Shirts](https://codeforces.com/contest/702/problem/F)
- [Codeforces — Wizards and Roads](https://codeforces.com/problemset/problem/167/D)
- [Codeforces — Yaroslav and Points](https://codeforces.com/contest/295/problem/E)

