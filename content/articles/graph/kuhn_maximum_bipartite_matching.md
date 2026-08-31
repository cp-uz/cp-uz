---
article_id: graph--kuhn_maximum_bipartite_matching
---
# Ikki bo‘lakli grafda eng katta matching uchun Kuhn algoritmi

## Masala

$n$ ta tugun va $m$ ta qirrali ikki bo‘lakli $G$ graf berilgan. Maksimal matchingni toping, ya’ni tanlangan qirralarning hech biri boshqa tanlangan qirra bilan umumiy tugunga ega bo‘lmaydigan qilib imkon qadar ko‘p qirra tanlang.

## Algoritm tavsifi

### Kerakli ta’riflar

* **Matching** $M$ — grafning juft-jufti bilan qo‘shni bo‘lmagan qirralari to‘plami (boshqacha aytganda, $M$ to‘plamidagi ko‘pi bilan bitta qirra grafning istalgan tuguniga tutashishi kerak).
Matchingning **quvvati** — undagi qirralar soni.
Matchingdagi biror qirraga tutash barcha tugunlar (ya’ni $M$ hosil qilgan qism grafda darajasi aynan bir bo‘lgan tugunlar) ushbu matching tomonidan **to‘yintirilgan** deb ataladi.

* **Maksimal matching** — $G$ grafning boshqa hech bir matchingining xos qism to‘plami bo‘lmagan $M$ matching.

* **Eng katta matching** (maksimal quvvatli matching deb ham ataladi) — mumkin bo‘lgan eng ko‘p qirrani o‘z ichiga oladigan matching. Har bir eng katta matching maksimal matchingdir.

* Bu yerda uzunligi $k$ bo‘lgan **yo‘l**, agar boshqacha ko‘rsatilmagan bo‘lsa, $k$ ta qirrani o‘z ichiga olgan *oddiy* yo‘lni (ya’ni takrorlangan tugun yoki qirrasiz yo‘lni) anglatadi.

* **Almashinuvchi yo‘l** (ikki bo‘lakli grafda, biror matchingga nisbatan) — qirralari navbatma-navbat matchingga tegishli va tegishli bo‘lmagan yo‘l.

* **Oshiruvchi yo‘l** (ikki bo‘lakli grafda, biror matchingga nisbatan) — boshlang‘ich va oxirgi tugunlari to‘yinmagan, ya’ni matchingga kirmaydigan almashinuvchi yo‘l.

* $A$ va $B$ to‘plamlarning $A \oplus B$ bilan belgilanuvchi **simmetrik ayirmasi** (**diz’yunkt birlashma** deb ham ataladi) — $A$ yoki $B$ ning aynan bittasiga tegishli, ammo ikkalasiga bir paytda tegishli bo‘lmagan barcha elementlar to‘plami.
Ya’ni $A \oplus B = (A-B) \cup (B-A) = (A \cup B) - (A \cap B)$.

### Berge lemmasi

Bu lemma 1957-yilda fransuz matematigi **Claude Berge** tomonidan isbotlangan, garchi uni 1891-yilda daniyalik matematik **Julius Petersen** va 1931-yilda vengriyalik matematik **Dénes Kőnig** avvalroq kuzatgan bo‘lsalar ham.

#### Bayon

$M$ matching eng katta $\Leftrightarrow$ $M$ matchingga nisbatan oshiruvchi yo‘l mavjud emas.

#### Isbot

Ikki tomonlama implikatsiyaning har ikki tomoni qarama-qarshilik orqali isbotlanadi.

1. $M$ matching eng katta $\Rightarrow$ $M$ matchingga nisbatan oshiruvchi yo‘l mavjud emas.

    Berilgan eng katta $M$ matchingga nisbatan $P$ oshiruvchi yo‘l mavjud bo‘lsin. $P$ oshiruvchi yo‘lning uzunligi albatta toq bo‘ladi va undagi $M$ ga kirmaydigan qirralar soni $M$ ga kiradigan qirralar sonidan bittaga ko‘p bo‘ladi.
    Asl $M$ matchingdagi $P$ ga ham kiradigan qirralardan tashqari barcha qirralarni hamda $P$ dagi $M$ ga kirmaydigan qirralarni olib, yangi $M'$ matching yaratamiz.
    Bu yaroqli matching, chunki $P$ ning boshlang‘ich va oxirgi tugunlari $M$ tomonidan to‘yintirilmagan, qolgan tugunlar esa faqat $P \cap M$ matching tomonidan to‘yintirilgan.
    Yangi $M'$ matching $M$ dan bitta ko‘p qirraga ega bo‘ladi, demak $M$ eng katta bo‘la olmas edi.

    Formal ravishda, biror eng katta $M$ matchingga nisbatan $P$ oshiruvchi yo‘l berilsa, $M'=P\oplus M$ matching uchun $|M'|=|M|+1$, bu esa qarama-qarshilik.

2. $M$ matching eng katta $\Leftarrow$ $M$ matchingga nisbatan oshiruvchi yo‘l mavjud emas.

    $M$ dan kattaroq quvvatli $M'$ matching mavjud bo‘lsin. $Q=M\oplus M'$ simmetrik ayirmani ko‘ramiz. $Q$ qism graf endi albatta matching bo‘lishi shart emas.
    $Q$ dagi istalgan tugunning darajasi ko‘pi bilan $2$, demak uning barcha bog‘langan komponentlari quyidagi uch turdan biriga kiradi:

    * yakkalangan tugun;
    * qirralari navbatma-navbat $M$ va $M'$ dan olingan (oddiy) yo‘l;
    * qirralari navbatma-navbat $M$ va $M'$ dan olingan juft uzunlikdagi sikl.

    $M'$ ning quvvati $M$ nikidan katta bo‘lgani sababli $Q$ da $M'$ dan olingan qirralar $M$ dan olingan qirralardan ko‘proq. Dirichlet prinsipiga ko‘ra, kamida bitta bog‘langan komponent $M'$ dan $M$ ga qaraganda ko‘proq qirra olgan yo‘l bo‘ladi. Har bir bunday yo‘l almashinuvchi bo‘lgani uchun uning boshlang‘ich va oxirgi tugunlari $M$ tomonidan to‘yintirilmagan bo‘ladi; demak, u $M$ uchun oshiruvchi yo‘l. Bu farazga zid. &ensp; $\blacksquare$

### Kuhn algoritmi

Kuhn algoritmi Berge lemmasining bevosita qo‘llanishidir. Uning mohiyati quyidagicha:
avval bo‘sh matching olamiz. Keyin algoritm oshiruvchi yo‘l topa olar ekan, matchingni shu yo‘l bo‘ylab almashtirib yangilaymiz va oshiruvchi yo‘l qidirishni takrorlaymiz. Bunday yo‘lni topish imkonsiz bo‘lishi bilan jarayonni to‘xtatamiz — joriy matching eng katta bo‘ladi.
Oshiruvchi yo‘llarni qanday topishni batafsil tushuntirish qoladi. Kuhn algoritmi bunday yo‘llardan istalganini [chuqurlik bo‘yicha](depth-first-search.md) yoki [kenglik bo‘yicha](breadth-first-search.md) qidiruv yordamida topadi. Algoritm grafning barcha tugunlarini navbat bilan ko‘rib, har biridan boshlab oshiruvchi yo‘l topishga urinadi.
Kirish graf allaqachon ikki qismga ajratilgan deb faraz qilsak, algoritmni tavsiflash qulayroq (aslida algoritmni grafni oshkora ikki qismga ajratmasdan ham implementatsiya qilish mumkin).
Algoritm grafning birinchi qismidagi barcha $v$ tugunlarni ko‘radi: $v=1\ldots n_1$. Agar joriy $v$ tugun joriy matching tomonidan allaqachon to‘yintirilgan bo‘lsa (ya’ni unga tutash biror qirra allaqachon tanlangan bo‘lsa), bu tugunni o‘tkazib yuboramiz. Aks holda algoritm uni to‘yintirishga urinadi va buning uchun shu tugundan boshlanuvchi oshiruvchi yo‘lni qidiradi.
Oshiruvchi yo‘l maxsus chuqurlik yoki kenglik bo‘yicha qidiruv yordamida topiladi (implementatsiya soddaligi uchun odatda chuqurlik bo‘yicha qidiruv ishlatiladi).
Dastlab chuqurlik bo‘yicha qidiruv birinchi qismdagi joriy to‘yinmagan $v$ tugunda turadi. Shu tugundan chiquvchi barcha qirralarni ko‘ramiz. Joriy qirra $(v,to)$ bo‘lsin. Agar $to$ tugun matching tomonidan hali to‘yintirilmagan bo‘lsa, oshiruvchi yo‘l topishga muvaffaq bo‘ldik: u bitta $(v,to)$ qirradan iborat.
Bu holda ushbu qirrani matchingga qo‘shib, $v$ tugundan oshiruvchi yo‘l qidirishni to‘xtatamiz. Aks holda, $to$ tugun biror $(to,p)$ qirra bilan allaqachon to‘yintirilgan bo‘lsa, shu qirra bo‘ylab o‘tamiz: demak, $(v,to),(to,p),\ldots$ qirralardan o‘tadigan oshiruvchi yo‘lni topishga urinib ko‘ramiz.
Buning uchun qidiruvda shunchaki $p$ tugunga o‘tamiz — endi shu tugundan oshiruvchi yo‘l topishga urinib ko‘ramiz.
Shunday qilib, $v$ tugundan ishga tushirilgan qidiruv yo oshiruvchi yo‘l topib, $v$ tugunni to‘yintiradi, yo bunday oshiruvchi yo‘l topmaydi (demak, bu $v$ tugunni to‘yintirib bo‘lmaydi).

$v=1\ldots n_1$ tugunlarning barchasi ko‘rib chiqilgach, joriy matching eng katta bo‘ladi.

### Ishlash vaqti

Kuhn algoritmini butun grafda $n$ ta chuqurlik/kenglik bo‘yicha qidiruv ishga tushirishlar ketma-ketligi sifatida tasavvur qilish mumkin. Shuning uchun butun algoritm $O(nm)$ vaqtda, eng yomon holatda esa $O(n^3)$ vaqtda ishlaydi.
Biroq bu bahoni biroz yaxshilash mumkin. Ma’lum bo‘lishicha, Kuhn algoritmida grafning qaysi qismi birinchi, qaysi qismi ikkinchi sifatida tanlanishi muhim.
Haqiqatan, yuqoridagi implementatsiyada chuqurlik/kenglik bo‘yicha qidiruv faqat birinchi qism tugunlaridan boshlanadi, shuning uchun butun algoritm $O(n_1m)$ vaqtda ishlaydi; bu yerda $n_1$ — birinchi qismdagi tugunlar soni. Eng yomon holatda bu $O(n_1^2n_2)$ ga teng ($n_2$ — ikkinchi qismdagi tugunlar soni).
Bu birinchi qismda ikkinchisiga qaraganda kamroq tugun bo‘lishi foydaliroq ekanini ko‘rsatadi. Juda nomutanosib graflarda ($n_1$ va $n_2$ juda farqli bo‘lganda) bu ishlash vaqtlarida sezilarli farq beradi.

## Implementatsiya

### Standart implementatsiya

Yuqoridagi algoritmning chuqurlik bo‘yicha qidiruvga asoslangan va oshkora ikki qismga ajratilgan ikki bo‘lakli grafni qabul qiladigan implementatsiyasini keltiramiz.
Bu implementatsiya juda ixcham va ehtimol uni shu ko‘rinishda yodda saqlash kerak.
Bu yerda $n$ — birinchi qismdagi tugunlar soni, $k$ — ikkinchi qismdagi tugunlar soni, $g[v]$ esa birinchi qismdagi $v$ tugundan chiquvchi qirralar ro‘yxati (ya’ni shu qirralar $v$ dan olib boradigan tugunlar raqamlari ro‘yxati). Ikkala qism tugunlari mustaqil raqamlangan: birinchi qism tugunlari $1\ldots n$, ikkinchi qismdagilar $1\ldots k$.
Keyin ikkita yordamchi massiv bor: $\rm mt$ va $\rm used$. Birinchisi — $\rm mt$ — joriy matching haqidagi ma’lumotni saqlaydi. Dasturlash qulayligi uchun bu ma’lumot faqat ikkinchi qism tugunlari uchun saqlanadi: $\textrm{mt[}i\rm]$ — ikkinchi qismdagi $i$ tugun bilan qirra orqali bog‘langan birinchi qism tugunining raqami (yoki undan matching qirrasi chiqmasa $-1$). Ikkinchi $\rm used$ massiv — chuqurlik bo‘yicha qidiruvda tugunlarga “tashrif”ning odatdagi massivi (u DFS bir tugunga ikki marta kirmasligi uchun kerak).
$\texttt{try\_kuhn}$ funksiya chuqurlik bo‘yicha qidiruvdir. Agar u $v$ tugundan oshiruvchi yo‘l topa olsa, $\rm true$ qaytaradi; bunda funksiya topilgan zanjir bo‘ylab matchingni allaqachon almashtirib bo‘lgan deb hisoblanadi.
Funksiya ichida birinchi qismdagi $v$ tugundan chiquvchi barcha qirralar ko‘riladi va quyidagisi tekshiriladi: agar qirra to‘yinmagan $to$ tugunga olib borsa yoki $to$ to‘yintirilgan bo‘lsa-yu, $\textrm{mt[}to\rm]$ dan rekursiv boshlab oshiruvchi zanjir topish mumkin bo‘lsa, oshiruvchi yo‘l topdik deymiz. $\rm true$ natija bilan qaytishdan oldin joriy qirrani almashtiramiz: $to$ ga tutash matching qirrasini $v$ tugunga yo‘naltiramiz.
Asosiy dastur avval joriy matching bo‘shligini bildiradi ($\rm mt$ ro‘yxat $-1$ lar bilan to‘ldiriladi). Keyin birinchi qismdagi $v$ tugun uchun $\texttt{try\_kuhn}$ chaqiriladi va avval $\rm used$ massiv nollangach, undan chuqurlik bo‘yicha qidiruv boshlanadi.
Matching hajmini asosiy dasturdagi $\texttt{try\_kuhn}$ chaqiruvlaridan $\rm true$ qaytarganlar soni sifatida oson olish mumkinligini qayd etish kerak. Izlanayotgan eng katta matchingning o‘zi $\rm mt$ massivida saqlanadi.

```cpp
int n, k;
vector<vector<int>> g;
vector<int> mt;
vector<bool> used;
bool try_kuhn(int v) {
    if (used[v])
        return false;
    used[v] = true;
    for (int to : g[v]) {
        if (mt[to] == -1 || try_kuhn(mt[to])) {
            mt[to] = v;
            return true;
        }
    }
    return false;
}

int main() {
    //... reading the graph ...

    mt.assign(k, -1);
    for (int v = 0; v < n; ++v) {
        used.assign(n, false);
        try_kuhn(v);
    }
    for (int i = 0; i < k; ++i)
        if (mt[i] != -1)
            printf("%d %d\n", mt[i] + 1, i + 1);
}
```

Kuhn algoritmini ikki bo‘lakli ekani ma’lum, ammo qismlarga oshkora ajratilishi berilmagan graflarda ishlaydigan qilib oson implementatsiya qilish mumkinligini yana bir bor qayd etamiz. Bu holda qulay ikki qismga ajratishdan voz kechib, barcha ma’lumotni grafning barcha tugunlari uchun saqlash kerak. Buning uchun $g$ ro‘yxatlar massivi endi faqat birinchi qism tugunlari uchun emas, grafning barcha tugunlari uchun beriladi (albatta, ikkala qism tugunlari endi umumiy $1$ dan $n$ gacha raqamlashda bo‘ladi). $\rm mt$ va $\rm used$ massivlari ham ikkala qism tugunlari uchun aniqlanadi va shunga mos holatda saqlanishi kerak.

### Yaxshilangan implementatsiya

Algoritmni quyidagicha o‘zgartiramiz. Algoritmning asosiy siklidan oldin biror sodda algoritm (oddiy **evristik algoritm**) yordamida **ixtiyoriy matching** topamiz va shundan keyingina bu matchingni yaxshilaydigan $\texttt{try\_kuhn}()$ chaqiruvlari siklini bajaramiz. Natijada tasodifiy graflarda algoritm sezilarli tezroq ishlaydi, chunki ko‘pchilik graflarda evristika bilan yetarlicha katta matchingni oson topish, keyin esa odatiy Kuhn algoritmi bilan uni eng kattasigacha yaxshilash mumkin. Shu tariqa evristika yordamida joriy matchingga allaqachon kiritilgan tugunlardan chuqurlik bo‘yicha qidiruv boshlash xarajatini tejaymiz.
Masalan, birinchi qismdagi barcha tugunlar bo‘yicha yurib, har biri uchun matchingga qo‘shish mumkin bo‘lgan ixtiyoriy qirrani topib, uni qo‘shish mumkin.
Hatto shunday sodda evristika ham Kuhn algoritmini bir necha baravar tezlashtirishi mumkin.

Asosiy siklni biroz o‘zgartirish kerakligini unutmang. Asosiy siklda $\texttt{try\_kuhn}$ chaqirilganda joriy tugun hali matchingga kiritilmagan deb faraz qilinadi, shuning uchun tegishli tekshiruv qo‘shish zarur.
Implementatsiyada faqat $\textrm{main}()$ funksiyasidagi kod o‘zgaradi:

```cpp
int main() {
    // ... reading the graph ...
    mt.assign(k, -1);
    vector<bool> used1(n, false);
    for (int v = 0; v < n; ++v) {
        for (int to : g[v]) {
            if (mt[to] == -1) {
                mt[to] = v;
                used1[v] = true;
                break;
            }
        }
    }
    for (int v = 0; v < n; ++v) {
        if (used1[v])
            continue;
        used.assign(n, false);
        try_kuhn(v);
    }
    for (int i = 0; i < k; ++i)
        if (mt[i] != -1)
            printf("%d %d\n", mt[i] + 1, i + 1);
}
```

**Yana bir yaxshi evristika** quyidagicha. Har bir qadamda eng kichik darajali (ammo yakkalanmagan) tugunni topadi, undan ixtiyoriy qirrani tanlab matchingga qo‘shadi, keyin shu ikki tugunni ularga tutash barcha qirralar bilan birga grafdan olib tashlaydi. Bunday ochko‘z usul tasodifiy graflarda juda yaxshi ishlaydi; ko‘p hollarda hatto eng katta matchingni ham quradi (ammo unga qarshi test mavjud va unda u eng katta matchingdan ancha kichik matching topadi).

## Eslatmalar

* Kuhn algoritmi **Hungarian algoritmi**da, **Kuhn–Munkres algoritmi** deb ham ataladigan algoritmda qism dastur sifatida ishlatiladi.
* Kuhn algoritmi $O(nm)$ vaqtda ishlaydi. Odatda uni implementatsiya qilish sodda, ammo ikki bo‘lakli grafda eng katta matching masalasi uchun samaraliroq algoritmlar ham mavjud, masalan $O(\sqrt{n}m)$ vaqtda ishlaydigan **Hopcroft–Karp–Karzanov algoritmi**.
* [Minimal tugun qoplamasi masalasi](https://en.wikipedia.org/wiki/Vertex_cover) umumiy graflar uchun NP-qiyin. Ammo [Kőnig teoremasi](https://en.wikipedia.org/wiki/K%C5%91nig%27s_theorem_(graph_theory)) ikki bo‘lakli graflarda eng katta matching quvvati minimal tugun qoplamasi quvvatiga tengligini beradi. Demak, ikki bo‘lakli graflarda minimal tugun qoplamasi masalasini polinomial vaqtda yechish uchun maksimal matching algoritmlaridan foydalanishimiz mumkin.

## Mashq masalalari

* [Kattis - Gopher II](https://open.kattis.com/problems/gopher2)
* [Kattis - Borders](https://open.kattis.com/problems/borders)

