---
article_id: geometry--enclosing-circle
---
# Eng kichik qamrab oluvchi aylana

Quyidagi masalani ko‘rib chiqamiz. $n\le10^5$ ta $p_i=(x_i,y_i)$ nuqta berilgan. Ularning barchasini ichida yoki chegarasida saqlaydigan radiusi eng kichik aylana — **eng kichik qamrab oluvchi aylana**, qisqacha MEC (*minimum enclosing circle*) — topilishi kerak. Ba’zi masalalarda aylananing o‘zini, boshqalarida esa qaysi nuqtalar uning chegarasida yotishini aniqlash talab qilinadi.

Bu masalaning sodda randomizatsiyalangan yechimi birinchi qarashda uchta ichma-ich sikl sababli $O(n^3)$ ga o‘xshaydi. Aslida esa uning kutilgan ishlash vaqti $O(n)$.

Avvalo yechim yagona ekanini qayd etamiz.

## Nega eng kichik qamrab oluvchi aylana yagona?

MEC radiusi $r$ bo‘lsin. Har bir $p_i$ nuqta markazida radiusi $r$ bo‘lgan aylana chizamiz. Radiusi $r$ bo‘lib, barcha $p_i$ larni qoplaydigan aylananing mumkin bo‘lgan markazlari aynan shu $n$ ta yopiq diskning kesishmasidir.

Agar kesishma bitta nuqtadan iborat bo‘lsa, markazning yagonaligi darhol kelib chiqadi. Agar kesishma musbat yuzali soha bo‘lsa, radiusni juda kichik miqdorga kamaytirganda ham kesishma bo‘sh bo‘lmay qoladi. Bu esa $r$ minimal degan farazga zid.

Xuddi shu mulohaza aylana oldindan berilgan bitta $p_i$ nuqtadan yoki ikkita $p_i,p_j$ nuqtadan o‘tishi sharti ostidagi minimal aylananing ham yagonaligini ko‘rsatadi. Boshqa isbotda ikki xil MEC mavjud deb faraz qilinadi: ularning kesishmasi barcha nuqtalarni saqlaydi, biroq boshlang‘ich aylanalarnikidan kichikroq diametrga ega bo‘ladi va undan kichikroq aylana bilan qoplanishi mumkin — yana qarama-qarshilik.

## Welzl algoritmi

Qisqalik uchun $\operatorname{mec}(p_1,\ldots,p_n)$ bilan $\{p_1,\ldots,p_n\}$ to‘plamining MEC ini, $P_i=\{p_1,\ldots,p_i\}$ bilan esa birinchi $i$ ta nuqta to‘plamini belgilaymiz.

Welzl 1991-yilda taklif qilgan algoritm quyidagicha ishlaydi:

1. Kirish nuqtalarini tasodifiy permutatsiya qilish.
2. Joriy nomzod aylana sifatida $C=\operatorname{mec}(p_1,p_2)$ ni olish.
3. $i=3,\ldots,n$ bo‘yicha yurib, $p_i\in C$ ekanini tekshirish.
   1. Agar $p_i\in C$ bo‘lsa, $C$ ayni paytda $P_i$ ning MEC idir.
   2. Aks holda $p_i$ yangi MEC chegarasida yotishi shart. $C=\operatorname{mec}(p_i,p_1)$ deb olib, $j=2,\ldots,i$ bo‘yicha yurish.
      1. Agar $p_j\in C$ bo‘lsa, $C$ — $p_i$ dan o‘tuvchi aylanalar orasida $P_j$ ning MEC idir.
      2. Aks holda $p_j$ ham chegarada bo‘lishi shart. $C=\operatorname{mec}(p_i,p_j)$ deb olib, $k=1,\ldots,j$ bo‘yicha yurish.
         1. Agar $p_k\in C$ bo‘lsa, $C$ — $p_i$ va $p_j$ dan o‘tuvchi aylanalar orasida $P_k$ ning MEC idir.
         2. Aks holda uchala nuqta chegarada yotadi va $C=\operatorname{mec}(p_i,p_j,p_k)$ olinadi.

Har bir ichma-ich darajada invariant mavjud: $C$ avvalgi nuqtalarni qoplaydigan va qo‘shimcha ravishda oldindan belgilangan nol, bir yoki ikki nuqtadan o‘tadigan minimal aylanadir. Ichki sikl tugaganda uning invarianti tashqi siklning joriy iteratsiyasi invariantiga aylanadi. Shu orqali butun algoritmning to‘g‘riligi kelib chiqadi.

Texnik tafsilotlarni vaqtincha chetga sursak, algoritmning karkasi quyidagicha:

```cpp
struct point { /* ... */ };

// Is represented by 2 or 3 points on its circumference
struct mec { /* ... */ };

bool inside(mec const& C, point p) {
    /* ... */
}

// Choose some good generator of randomness for the shuffle
mt19937_64 gen(chrono::steady_clock::now().time_since_epoch().count());

mec enclosing_circle(vector<point> &p) {
    int n = p.size();
    ranges::shuffle(p, gen);
    auto C = mec{p[0], p[1]};
    for (int i = 0; i < n; i++) {
        if (!inside(C, p[i])) {
            C = mec{p[i], p[0]};
            for (int j = 0; j < i; j++) {
                if (!inside(C, p[j])) {
                    C = mec{p[i], p[j]};
                    for (int k = 0; k < j; k++) {
                        if (!inside(C, p[k])) {
                            C = mec{p[i], p[j], p[k]};
                        }
                    }
                }
            }
        }
    }
    return C;
}
```

Bu karkas $n\ge2$ holat uchun yozilgan. Amaliy kodda $n=0$ va $n=1$ holatlari alohida qaytariladi.

### Murakkablik tahlili

Eng ichki, $k$ bo‘yicha sikl ishga tushsa, uning vaqti $O(j)$. Endi $j$ bo‘yicha sikl qanchalik tez-tez ichki siklni ishga tushirishini ko‘ramiz.

Ichki sikl faqat $p_j$ nuqta $P_j$ ning, qo‘shimcha ravishda $p_i$ dan o‘tadigan MEC chegarasidagi muhim nuqtalardan biri bo‘lgandagina boshlanadi. Bunday muhim nuqtalar ko‘pi bilan ikkita: agar chegarada ikkitadan ko‘p nuqta bo‘lsa, ulardan bittasini olib tashlaganda ham qolgan kamida uchta nuqta aylanani yagona aniqlab turadi va aylana kichraymaydi.

Boshlang‘ich permutatsiya tasodifiy bo‘lgani uchun, $p_j$ ning shu ko‘pi bilan ikkita “omadsiz” nuqtadan biri bo‘lish ehtimoli ko‘pi bilan $2/j$. Shuning uchun $j$ siklining kutilgan qiymati

$$
\sum_{j=1}^{i}\frac{2}{j}\cdot O(j)=O(i).
$$

Xuddi shu fikrni tashqi $i$ sikliga qo‘llasak, uning umumiy kutilgan vaqti $O(n)$ chiqadi. Algoritmning eng yomon holati kubik bo‘lishi mumkin, ammo tasodifiy aralashtirish uni kutilgan chiziqli vaqtga olib keladi.

## Nuqta ikki yoki uch nuqtaning MEC ida ekanini tekshirish

`point` va `mec` turlarini qanday ifodalashni ko‘ramiz. Ushbu masalada nuqtalar uchun `std::complex` juda qulay:

```cpp
using ftype = int64_t;
using point = complex<ftype>;
```

Kompleks son $x+yi$ tekislikdagi $(x,y)$ nuqtaga mos keladi. Oddiy qo‘shish va haqiqiy songa ko‘paytirishdan tashqari, kompleks sonlarni ko‘paytirish ularning qutbiy burchaklarini qo‘shadi, kompleks qo‘shma olish esa burchak ishorasini o‘zgartiradi. Bu xossalar ikki yoki uch berilgan nuqta aniqlaydigan aylana ichida $z$ yotishini juda ixcham tekshirishga imkon beradi.

### Ikki nuqtaning MEC i

$a$ va $b$ nuqtalarning MEC i markazi $(a+b)/2$, radiusi $|a-b|/2$ bo‘lgan, ya’ni $ab$ kesma diametr bo‘lgan aylanadir. $z$ nuqta shu aylana ichida yoki chegarasida yotishi uchun $\angle azb$ o‘tkir bo‘lmasligi kerak.

Kompleks sonlarda

$$
I_0=(b-z)\overline{(a-z)}
$$

ifodaning qutbiy burchagi $\angle azb$ ga teng. Burchak o‘tkir bo‘lmasligi uchun $I_0$ ning haqiqiy qismi musbat bo‘lmasligi kerak:

$$
\operatorname{Re}(I_0)\le0.
$$

Tenglik $z$ aynan aylana chegarasida yotishini anglatadi.

### Uch nuqtaning MEC i

$a,b,c$ bir chiziqda yotmaydigan bo‘lsin. $z$ ni qo‘shsak, $abcz$ to‘rtburchak hosil bo‘ladi. Quyidagi ishorali burchaklar yig‘indisini ko‘ramiz:

$$
\angle azb+\angle bca.
$$

Siklik to‘rtburchakda $c$ va $z$ $ab$ ning bir tomonida bo‘lsa, tegishli ichki burchaklar teng bo‘ladi va ishorali yig‘indi $0^\circ$ ga teng; qarama-qarshi tomonlarda bo‘lsa, yig‘indi $180^\circ$ ga teng bo‘ladi.

$\angle azb$ — $(b-z)\overline{(a-z)}$ ning, $\angle bca$ esa $(a-c)\overline{(b-c)}$ ning qutbiy burchagi. Demak, ularning yig‘indisi

$$
I_1=(b-z)\overline{(a-z)}(a-c)\overline{(b-c)}
$$

kompleks sonining qutbiy burchagiga teng. $z$ aylana chegarasida bo‘lsa, $I_1$ ning mavhum qismi nol bo‘ladi. Ichkarida yoki tashqarida ekanini esa shu mavhum qismning ishorasi hamda

$$
I_2=(a-c)\overline{(b-c)}
$$

ning ishorasi orqali ajratish mumkin.

Agar $\operatorname{Im}(I_2)<0$ bo‘lsa, indikator sifatida $-\operatorname{Im}(I_1)$, aks holda $\operatorname{Im}(I_1)$ olinadi. Indikator manfiy bo‘lsa nuqta ichkarida, musbat bo‘lsa tashqarida, nol bo‘lsa chegarada yotadi.

Bu tekshiruv to‘rtta kompleks sonni ko‘paytiradi. Kirish koordinatalarining eng katta moduli $A$ bo‘lsa, oraliq qiymatlar $O(A^4)$ gacha o‘sishi mumkin. Afzalligi shundaki, koordinatalar butun bo‘lsa, ikkala tekshiruvni ham butun sonlarda aniq bajarish mumkin; faqat overflow chegarasini ehtiyotkorlik bilan tanlash kerak.

### Implementatsiya

MEC to‘g‘ridan-to‘g‘ri uning chegarasidagi ikki yoki uch nuqta bilan ifodalanadi:

```cpp
using mec = variant<
    array<point, 2>,
    array<point, 3>
>;
```

`std::visit` yordamida ikkala holatni bitta funksiyada tekshiramiz:

```cpp
/* I < 0 if z inside C,
   I > 0 if z outside C,
   I = 0 if z on the circumference of C */
ftype indicator(mec const& C, point z) {
    return visit([&](auto &&C) {
        point a = C[0], b = C[1];
        point I0 = (b - z) * conj(a - z);
        if constexpr (size(C) == 2) {
            return real(I0);
        } else {
            point c = C[2];
            point I2 = (a - c) * conj(b - c);
            point I1 = I0 * I2;
            return imag(I2) < 0 ? -imag(I1) : imag(I1);
        }
    }, C);
}

bool inside(mec const& C, point p) {
    return indicator(C, p) <= 0;
}
```

Agar masala aylanani sonli markaz va radius bilan chiqarishni talab qilsa, yakuniy `mec` ning ikki yoki uch chegara nuqtasidan markazni alohida hisoblash mumkin. Ikki nuqtada markaz ularning o‘rtasi; uch nuqtada esa uchburchakning tashqi chizilgan aylana markazidir.

## Amaliy masalalar

- [Library Checker — Minimum Enclosing Circle](https://judge.yosupo.jp/problem/minimum_enclosing_circle)
- [BOI 2002 — Aliens](https://www.spoj.com/problems/ALIENS/)

