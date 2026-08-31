---
article_id: string--aho_corasick
---
# Aho–Corasick algoritmi

Aho–Corasick algoritmi matn ichidan bir vaqtning o‘zida bir nechta shablonni tez qidirish imkonini beradi. Shablon satrlar to‘plami **lug‘at** deb ham ataladi. Lug‘atdagi satrlarning jami uzunligini $m$, alifbo hajmini esa $k$ bilan belgilaymiz. Algoritm trie asosida $O(mk)$ vaqtda chekli holatlar avtomatini quradi va keyin shu avtomat yordamida matnni qayta ishlaydi.

Algoritm Alfred Aho va Margaret Corasick tomonidan 1975-yilda taklif qilingan.

## Trie qurish

![“Java”, “Rad”, “Rand”, “Rau”, “Raum” va “Rose” so‘zlari asosidagi trie](https://upload.wikimedia.org/wikipedia/commons/e/e2/Trie.svg)

“Java”, “Rad”, “Rand”, “Rau”, “Raum” va “Rose” so‘zlari asosidagi trie. [nd](https://de.wikipedia.org/wiki/Benutzer:Nd) muallifligidagi rasm [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) litsenziyasi ostida tarqatiladi.

Formal ravishda, trie — ildizli daraxt bo‘lib, uning har bir qirrasi biror harf bilan belgilangan va bir tugundan chiquvchi qirralarning belgilari o‘zaro farq qiladi.

Triedagi har bir tugunni ildizdan shu tugungacha bo‘lgan yo‘ldagi qirra belgilari hosil qiladigan satr bilan aynanlashtiramiz.

Har bir tugunda, agar u lug‘atdagi biror shablonga mos kelsa, o‘rnatiladigan $\text{output}$ bayrog‘i ham bo‘ladi.

Shunga ko‘ra, satrlar to‘plamining triesi shunday trieki, undagi har bir $\text{output}$ tugun to‘plamdagi bitta satrga mos keladi va, aksincha, to‘plamdagi har bir satrga bitta $\text{output}$ tugun mos keladi.

Endi berilgan satrlar to‘plami uchun ularning jami uzunligiga nisbatan chiziqli vaqtda trie qanday qurilishini tasvirlaymiz.

Daraxt tugunlari uchun quyidagi strukturani kiritamiz:

```cpp
const int K = 26;

struct Vertex {
    int next[K];
    bool output = false;

    Vertex() {
        fill(begin(next), end(next), -1);
    }
};

vector<Vertex> trie(1);
```

Bu yerda trieni $\text{Vertex}$ obyektlari massivi sifatida saqlaymiz. Har bir $\text{Vertex}$ ichida $\text{output}$ bayrog‘i va qirralar $\text{next}[]$ massivi ko‘rinishida saqlanadi: $\text{next}[i]$ — $i$ belgili qirra bo‘ylab o‘tganda yetib boriladigan tugun indeksi, bunday qirra bo‘lmasa esa $-1$. Dastlab trie faqat indeks $0$ bo‘lgan ildiz tugundan iborat.

Endi $s$ satrini triega qo‘shadigan funksiyani yozamiz. Implementatsiya sodda: ildizdan boshlaymiz va $s$ belgilariga mos qirralar mavjud ekan, ular bo‘ylab yuramiz. Navbatdagi belgi uchun qirra bo‘lmasa, yangi tugun yaratib, uni qirra bilan ulaymiz. Jarayon oxirida so‘nggi tugunning $\text{output}$ bayrog‘ini o‘rnatamiz.

```cpp
void add_string(string const& s) {
    int v = 0;
    for (char ch : s) {
        int c = ch - 'a';
        if (trie[v].next[c] == -1) {
            trie[v].next[c] = trie.size();
            trie.emplace_back();
        }
        v = trie[v].next[c];
    }
    trie[v].output = true;
}
```

Bu implementatsiya, ravshanki, chiziqli vaqtda ishlaydi. Har bir tugunda $k$ ta havola saqlangani sababli, xotira sarfi $O(mk)$ bo‘ladi.

Har bir tugundagi massiv o‘rniga map ishlatib, xotira sarfini $O(m)$ gacha kamaytirish mumkin. Biroq bunda vaqt murakkabligi $O(m\log k)$ gacha oshadi.

## Avtomat qurish

Berilgan satrlar to‘plami uchun trieni qurib bo‘ldik, deb faraz qilaylik. Endi unga boshqa tomondan qaraymiz. Har qanday tugunga mos satr to‘plamdagi bir yoki bir nechta satrning prefiksi bo‘ladi; demak, triedagi har bir tugunni to‘plamdagi bir yoki bir nechta satr ichidagi holat sifatida talqin qilish mumkin.

Aslida, trie tugunlarini chekli deterministik avtomat holatlari deb qarash mumkin. Har qanday holatdan biror kirish harfi yordamida boshqa holatga, ya’ni to‘plamdagi satrlardagi boshqa pozitsiyaga o‘tishimiz mumkin. Masalan, lug‘atda faqat $abc$ satri bo‘lsa va biz $ab$ tugunida turgan bo‘lsak, $c$ harfi orqali $abc$ tuguniga o‘tamiz.

Shunday qilib, trie qirralarini tegishli harf bo‘yicha avtomat o‘tishlari deb tushunishimiz mumkin. Ammo avtomatda har bir holat va harf juftligi uchun o‘tish aniqlangan bo‘lishi kerak. Biror harf bilan o‘tishga urinib, trieda unga mos qirra topilmasa ham, baribir qaysidir holatga o‘tishimiz lozim.

Aniqroq aytganda, biz $t$ satriga mos holatda turibmiz va $c$ belgisi orqali boshqa holatga o‘tmoqchimiz, deb faraz qilaylik. Agar $c$ bilan belgilangan qirra mavjud bo‘lsa, shu qirra bo‘ylab o‘tib, $t+c$ satriga mos tugunga boramiz. Bunday qirra bo‘lmasa, joriy holat qayta ishlangan matnning eng uzun qisman mos prefiksi bo‘lib qolishi haqidagi invariantni saqlash uchun, triedagi $t$ satrining eng uzun xos suffiksiga mos satrni topib, o‘tishni o‘sha yerdan bajarishga harakat qilishimiz kerak.

Masalan, trie $ab$ va $bc$ satrlaridan qurilgan bo‘lsin va hozir $ab$ satriga mos, ayni paytda $\text{output}$ ham bo‘lgan tugunda turaylik. $c$ harfi bilan o‘tish uchun avval $b$ satriga mos holatga, so‘ng u yerdan $c$ harfli qirra bo‘ylab o‘tishga majburmiz.

![“a”, “ab”, “bc”, “bca”, “c” va “caa” so‘zlari asosidagi Aho–Corasick avtomati](https://upload.wikimedia.org/wikipedia/commons/9/90/A_diagram_of_the_Aho-Corasick_string_search_algorithm.svg)

“a”, “ab”, “bc”, “bca”, “c” va “caa” so‘zlari asosidagi Aho–Corasick avtomati. Ko‘k strelkalar suffiks havolalarini, yashil strelkalar terminal havolalarni bildiradi.

$p$ tugunning **suffiks havolasi** $p$ tugunga mos satrning eng uzun xos suffiksiga ko‘rsatadigan qirradir. Yagona maxsus holat — trie ildizi: uning suffiks havolasi o‘ziga ko‘rsatadi. Endi avtomatdagi o‘tishlar haqidagi fikrni quyidagicha qayta ifodalash mumkin: joriy trie tugunidan navbatdagi harf bilan o‘tish mavjud bo‘lmaguncha yoki ildizga yetgunimizcha suffiks havolasi bo‘ylab yuramiz.

Demak, avtomat qurish masalasini triedagi barcha tugunlarning suffiks havolalarini topish masalasiga keltirdik. Qizig‘i shundaki, bu suffiks havolalarini avtomatda qurilgan o‘tishlarning o‘zi yordamida topamiz.

Ildizning va uning barcha bevosita farzandlarining suffiks havolalari ildizga ko‘rsatadi. Daraxtning chuqurroq qismidagi istalgan $v$ tugun uchun suffiks havolasini quyidagicha hisoblash mumkin: $p$ — $v$ ning otasi, $c$ esa $p$ dan $v$ ga olib boruvchi qirra belgisi bo‘lsin. Avval $p$ ga boramiz, so‘ng uning suffiks havolasidan o‘tamiz va u yerdan $c$ harfi bilan o‘tishni bajaramiz.

Shunday qilib, o‘tishlarni topish masalasi suffiks havolalarini topishga, suffiks havolalarini topish masalasi esa ildizga yaqin tugunlardan tashqari hollarda bitta suffiks havolasi va bitta o‘tishni topishga keltirildi. Hosil bo‘lgan rekursiv bog‘liqlikni chiziqli vaqtda yechish mumkin.

Implementatsiyaga o‘tamiz. Endi har bir $v$ tugun uchun uning otasi $p$ va $p$ dan $v$ ga olib boruvchi qirraning $pch$ belgisini saqlaymiz. Bundan tashqari, har bir tugunda $\text{link}$ suffiks havolasini — hali hisoblanmagan bo‘lsa $-1$ — va $\text{go}[k]$ massivida avtomatning har bir belgi bo‘yicha o‘tishini — yana hali hisoblanmagan bo‘lsa $-1$ — saqlaymiz.

```cpp
const int K = 26;

struct Vertex {
    int next[K];
    bool output = false;
    int p = -1;
    char pch;
    int link = -1;
    int go[K];

    Vertex(int p=-1, char ch='$') : p(p), pch(ch) {
        fill(begin(next), end(next), -1);
        fill(begin(go), end(go), -1);
    }
};

vector<Vertex> t(1);

void add_string(string const& s) {
    int v = 0;
    for (char ch : s) {
        int c = ch - 'a';
        if (t[v].next[c] == -1) {
            t[v].next[c] = t.size();
            t.emplace_back(v, ch);
        }
        v = t[v].next[c];
    }
    t[v].output = true;
}

int go(int v, char ch);

int get_link(int v) {
    if (t[v].link == -1) {
        if (v == 0 || t[v].p == 0)
            t[v].link = 0;
        else
            t[v].link = go(get_link(t[v].p), t[v].pch);
    }
    return t[v].link;
}

int go(int v, char ch) {
    int c = ch - 'a';
    if (t[v].go[c] == -1) {
        if (t[v].next[c] != -1)
            t[v].go[c] = t[v].next[c];
        else
            t[v].go[c] = v == 0 ? 0 : go(get_link(v), ch);
    }
    return t[v].go[c];
}
```

Suffiks havolalari va o‘tishlar memoizatsiya qilingani tufayli, barcha suffiks havolalari va o‘tishlarni topishning jami vaqti chiziqli bo‘lishini ko‘rish oson.

G‘oyaning tasviriy tushuntirishi uchun Stanford slaydlarining 103-slaydiga qarang.

### BFS asosidagi qurish

O‘tishlar va suffiks havolalarini `go` hamda `get_link` funksiyalarining rekursiv chaqiruvlari bilan hisoblash o‘rniga, ularni ildizdan boshlab pastdan yuqoriga, aniqrog‘i BFS tartibida qurish mumkin. Lug‘at faqat bitta satrdan iborat bo‘lsa, bunda bizga tanish Knuth–Morris–Pratt algoritmi hosil bo‘ladi.

Bu yondashuvning yuqoridagi usulga nisbatan ayrim afzalliklari bor: uning ishlash vaqti satrlarning jami $m$ uzunligiga emas, triedagi tugunlar soni $n$ ga bog‘liq. Bundan tashqari, katta alifbolar uchun uni persistent massiv ma’lumotlar tuzilmasi yordamida moslashtirish mumkin. Natijada qurish vaqti $O(mk)$ o‘rniga $O(n\log k)$ bo‘ladi; $m$ qiymati $n^2$ gacha yetishi mumkinligini hisobga olsak, bu sezilarli yaxshilanishdir.

Ildizdan BFS tugunlarni ularga mos satrlar uzunligi ortib borish tartibida ko‘rishini ishlatib, induktiv mulohaza yuritamiz. $v$ tugunda turganimizda uning $u=link[v]$ suffiks havolasi allaqachon hisoblangan, uzunligi qisqaroq barcha tugunlarning o‘tishlari ham to‘liq ma’lum, deb faraz qilishimiz mumkin.

Hozir $v$ tugunda turib, $c$ belgisini ko‘rib chiqayotgan bo‘laylik. Asosan ikki holat mavjud:

1. $go[v][c]=-1$. Bu holda $go[v][c]=go[u][c]$ deb belgilashimiz mumkin; o‘ng tomon induksiya faraziga ko‘ra allaqachon ma’lum.
2. $go[v][c]=w\ne -1$. Bu holda $link[w]=go[u][c]$ deb belgilashimiz mumkin.

Shu tariqa, har bir tugun va belgi juftligi uchun $O(1)$ vaqt sarflab, $O(nk)$ umumiy vaqtga erishamiz. Bu yerdagi asosiy ortiqcha xarajat — birinchi holatda $u$ dan juda ko‘p o‘tishlarni nusxalashimiz; ikkinchi holatdagi o‘tishlar esa trie qirralarini tashkil qiladi va barcha tugunlar bo‘yicha jami $n$ ta bo‘ladi. $go[u][c]$ qiymatlarini nusxalamaslik uchun persistent massivdan foydalanish mumkin: dastlab $go[u]$ ni $go[v]$ ga nusxalaymiz, keyin faqat o‘tishi farq qiladigan belgilar qiymatini yangilaymiz. Bu $O(n\log k)$ algoritmni beradi.

## Qo‘llanishlar

### Berilgan to‘plamdagi barcha satrlarni matndan topish

Bizga satrlar to‘plami va matn berilgan. To‘plamdagi barcha satrlarning matndagi barcha uchrashuvlarini $O(\text{len}+\text{ans})$ vaqtda chiqarish kerak; bu yerda $\text{len}$ — matn uzunligi, $\text{ans}$ esa javob hajmi.

Satrlar to‘plami uchun avtomat quramiz. Endi trie ildizidan boshlab matnni avtomat yordamida harfma-harf qayta ishlaymiz. Biror paytda $v$ holatda turgan va navbatdagi harf $c$ bo‘lsa, $\text{go}(v,c)$ orqali keyingi holatga o‘tamiz. Bunda joriy mos qism satr uzunligi $1$ ga ortadi yoki suffiks havolasi bo‘ylab o‘tish sababli kamayadi.

$v$ holat uchun to‘plamdagi satrlardan birortasi mos kelganini qanday aniqlaymiz? Avvalo, agar $\text{output}$ tugunda tursak, unga mos satr matnning joriy pozitsiyasida tugashi ravshan. Ammo moslik faqat shu holatda yuz bermaydi: suffiks havolalari bo‘ylab yurib bir yoki bir nechta $\text{output}$ tugunga yetish mumkin bo‘lsa, topilgan har bir $\text{output}$ tugunga mos satr ham shu joyda uchraydi. Buni $\{dabce,abc,bc\}$ satrlar to‘plami va $dabc$ matni misolida ko‘rish mumkin.

Har bir $\text{output}$ tugunda unga mos satr indeksini — to‘plamda bir xil satrlar bo‘lsa, indekslar ro‘yxatini — saqlasak, joriy holatga mos barcha satr indekslarini joriy tugundan ildizgacha suffiks havolalari bo‘ylab yurib $O(n)$ vaqtda topish mumkin. Biroq bu eng samarali yechim emas, chunki umumiy murakkablik $O(n\,\text{len})$ bo‘ladi.

Buni suffiks havolalari orqali erishiladigan eng yaqin $\text{output}$ tugunni hisoblab va saqlab optimallashtirish mumkin; bu ba’zan **exit link** deb ataladi. Uni lazy usulda jami chiziqli vaqtda hisoblash mumkin. Shunda har bir tugundan suffiks havolalari yo‘lidagi keyingi belgilangan tugunga, ya’ni keyingi moslikka $O(1)$ vaqtda o‘tamiz. Har bir topilgan moslik uchun $O(1)$ vaqt sarflanadi va umumiy murakkablik $O(\text{len}+\text{ans})$ bo‘ladi.

Agar uchrashuv indekslarini topish emas, faqat ularning sonini hisoblash kerak bo‘lsa, har bir $v$ tugun uchun suffiks havolalari yo‘lidagi belgilangan tugunlar sonini oldindan hisoblash mumkin. Buni jami $O(n)$ vaqtda bajarib, keyin barcha mosliklar sonini $O(\text{len})$ vaqtda yig‘ish mumkin.

### Berilgan satrlarning hech birini o‘z ichiga olmaydigan, berilgan uzunlikdagi leksikografik eng kichik satrni topish

Bizga satrlar to‘plami va $L$ uzunlik berilgan. Uzunligi $L$ bo‘lgan, berilgan satrlarning hech birini o‘z ichiga olmaydigan satrlar ichidan leksikografik eng kichigini topish kerak.

Satrlar to‘plami uchun avtomat quramiz. $\text{output}$ tugunlar to‘plamdagi biror satr mos kelgan holatlar ekanini eslaylik. Bu masalada mosliklardan qochishimiz kerakligi sababli, bunday holatlarga kirish mumkin emas. Boshqa barcha tugunlarga kirish mumkin. Demak, avtomatdan barcha “yomon” tugunlarni o‘chirib, qolgan avtomat grafida uzunligi $L$ bo‘lgan leksikografik eng kichik yo‘lni topamiz. Masalani, masalan, [chuqurlik bo‘yicha qidiruv](../graph/depth-first-search.md) yordamida $O(L)$ vaqtda yechish mumkin.

### Berilgan barcha satrlarni o‘z ichiga oladigan eng qisqa satrni topish

Bu yerda ham xuddi shu g‘oyalardan foydalanamiz. Har bir tugunda ayni holatda mos keladigan satrlarni bildiruvchi niqob saqlaymiz. Shunda masalani quyidagicha qayta ifodalash mumkin: dastlab $(v=\text{root},\,\text{mask}=0)$ holatda turib, $(v,\,\text{mask}=2^n-1)$ holatga yetish kerak; bu yerda $n$ — to‘plamdagi satrlar soni. Bir holatdan boshqasiga harf bilan o‘tganda niqobni mos ravishda yangilaymiz. [Kenglik bo‘yicha qidiruv](../graph/breadth-first-search.md) yordamida $(v,\,\text{mask}=2^n-1)$ holatiga olib boradigan eng qisqa yo‘lni topish mumkin.

### Berilgan $k$ ta satrni o‘z ichiga oladigan, uzunligi $L$ bo‘lgan leksikografik eng kichik satrni topish {data-toc-label="Berilgan k ta satrni o‘z ichiga oladigan, uzunligi L bo‘lgan leksikografik eng kichik satrni topish"}

Oldingi masaladagidek, har bir tugun uchun unga mos mosliklar sonini, ya’ni suffiks havolalari orqali erishiladigan belgilangan tugunlar sonini hisoblaymiz. Masalani qayta ifodalaymiz: joriy holat $(v,\,\text{len},\,\text{cnt})$ uchligi bilan aniqlanadi va $(\text{root},0,0)$ holatdan $v$ ixtiyoriy tugun bo‘lishi mumkin bo‘lgan $(v,L,k)$ holatga yetish kerak. Bunday yo‘lni chuqurlik bo‘yicha qidiruv yordamida topish mumkin. Qidiruv qirralarni tabiiy tartibda ko‘rib chiqsa, topilgan yo‘l avtomatik ravishda leksikografik eng kichik bo‘ladi.

## Masalalar

* [UVA 11590 — Prefix Lookup](https://onlinejudge.org/)
* [UVA 11171 — SMS](https://onlinejudge.org/)
* [UVA 10679 — I Love Strings!!](https://onlinejudge.org/external/106/10679.html)
* [Codeforces — x-prime Substrings](https://codeforces.com/problemset/problem/1400/F)
* [Codeforces — Frequency of String](https://codeforces.com/problemset/problem/963/D)
* [CodeChef — TWOSTRS](https://www.codechef.com/MAY20A/problems/TWOSTRS)

## Manbalar

* [Stanford CS166 — Aho–Corasick Automata](https://web.stanford.edu/class/archive/cs/cs166/cs166.1206/lectures/02/Slides02.pdf) ([qisqartirilgan versiya](https://web.stanford.edu/class/archive/cs/cs166/cs166.1206/lectures/02/Small02.pdf))

