---
article_id: linear_algebra--linear-system-gauss
---
# Gauss usuli va chiziqli tenglamalar sistemasi

$m$ ta noma’lumli $n$ ta chiziqli algebraik tenglamalar sistemasi berilgan bo‘lsin. Sistemaning yechimi yo‘qligini, yagona yechimga yoki cheksiz ko‘p yechimga egaligini aniqlash, yechim mavjud bo‘lsa esa ulardan bittasini topish talab qilinadi.

Masala quyidagi sistemani yechishdan iborat:

$$\begin{align}
a_{11} x_1 + a_{12} x_2 + &\dots + a_{1m} x_m = b_1 \\
a_{21} x_1 + a_{22} x_2 + &\dots + a_{2m} x_m = b_2\\
&\vdots \\
a_{n1} x_1 + a_{n2} x_2 + &\dots + a_{nm} x_m = b_n.
\end{align}$$

Bu yerda $a_{ij}$ ($1 \le i \le n$, $1 \le j \le m$) va $b_i$ ($1 \le i \le n$) ma’lum koeffitsiyentlar, $x_i$ lar esa noma’lumlardir.

Matritsa ko‘rinishida sistema yanada ixcham yoziladi:

$$Ax=b,$$

bu yerda $A$ — $a_{ij}$ koeffitsiyentlardan tuzilgan $n \times m$ o‘lchamli matritsa, $b$ esa $n$ o‘lchamli ustun vektor.

Maqoladagi usulni istalgan $p$ modul bo‘yicha tuzilgan sistemaga ham qo‘llash mumkin:

$$\begin{align}
a_{11} x_1 + a_{12} x_2 + &\dots + a_{1m} x_m \equiv b_1 \pmod p \\
a_{21} x_1 + a_{22} x_2 + &\dots + a_{2m} x_m \equiv b_2 \pmod p \\
&\vdots \\
a_{n1} x_1 + a_{n2} x_2 + &\dots + a_{nm} x_m \equiv b_n \pmod p.
\end{align}$$

## Gauss–Jordan eliminatsiyasi

Quyida tavsiflanadigan algoritmni aniqroq qilib **Gauss–Jordan eliminatsiyasi** deyish kerak. U Gauss usulining Jordan 1887-yilda ta’riflagan ko‘rinishidir.

## Umumiy ko‘rinish

Algoritm har bir tenglamadan noma’lumlarni ketma-ket yo‘qotib boradi. Jarayon oxirida har bir ishlov berilgan tenglamada faqat bitta asosiy noma’lum qoladi. $n=m$ bo‘lgan va sistema yagona yechimga ega holatda buni $A$ matritsani birlik matritsaga aylantirish deb tasavvur qilish mumkin; o‘shanda javob oxirgi ustundagi koeffitsiyentlardan bevosita olinadi.

Gauss eliminatsiyasi yechimlar to‘plamini o‘zgartirmaydigan ikki elementar almashtirishga asoslanadi:

- ikki tenglamaning o‘rnini almashtirish mumkin;
- istalgan tenglamani o‘zining noldan farqli koeffitsiyentdagi nusxasi va boshqa satrlarning ixtiyoriy koeffitsiyentli chiziqli kombinatsiyasi bilan almashtirish mumkin.

Birinchi qadamda birinchi satr $a_{11}$ ga bo‘linadi. So‘ng birinchi ustundagi qolgan koeffitsiyentlarni nol qilish uchun har bir $i$-satrga birinchi satrning $-a_{i1}$ ga ko‘paytirilgan nusxasi qo‘shiladi. Xuddi shu amallar $b$ vektoriga ham bajariladi; amalda $b$ ni $A$ matritsaning $(m+1)$-ustuni deb qarash qulay.

Natijada birinchi ustunning birinchi elementi $1$, qolgan elementlari $0$ bo‘ladi. Keyin ikkinchi satr va ikkinchi ustun uchun ayni jarayon takrorlanadi: satr $a_{22}$ ga bo‘linadi va u boshqa satrlardan kerakli koeffitsiyentlarda ayrilib, ikkinchi ustun tozalanadi. Barcha ustunlarga ishlov berilgach, kvadrat va buzilmagan sistemada $A$ birlik matritsaga aylanadi.

## Tayanch elementni tanlash

Yuqoridagi sodda tavsifda muhim holat chetda qoldi: $i$-qadamda $a_{ii}=0$ bo‘lishi mumkin va bunday songa bo‘lib bo‘lmaydi. Shunda $i$-ustuni noldan farqli bo‘lgan boshqa satr topilib, joriy satr bilan almashtiriladi. Tanlangan element **tayanch element**, satr esa **tayanch satr** deyiladi.

Bu yerda ustunlar emas, faqat satrlar almashtiriladi. Ustunlar almashtirilsa, ular noma’lumlarning tartibini ham o‘zgartiradi va javobni qaytarishda bu almashtirishlarni teskari bajarish kerak bo‘ladi.

Hatto $a_{ii}\ne0$ bo‘lganda ham, suzuvchi nuqtali hisoblarda odatda joriy ustundagi moduli eng katta $a_{ji}$ elementi tayanch qilib olinadi. **Qisman tayanchlash** deb ataladigan bu evristika keyingi hisoblarda sonlar diapazoni va yaxlitlash xatosini kamaytiradi. Tayanchlashsiz hatto taxminan $20\times20$ matritsada ham xato sezilarli kattalashishi yoki suzuvchi nuqtali tur diapazonidan chiqib ketishi mumkin.

## Buzilgan va to‘g‘ri to‘rtburchak sistemalar

$m=n$, determinant noldan farqli va yechim yagona bo‘lsa, algoritm $A$ ni birlik matritsaga aylantiradi. Umumiy holatda esa $n$ va $m$ teng bo‘lishi shart emas, sistema buzilgan bo‘lishi ham mumkin.

Joriy ustunda, joriy satrdan boshlab, noldan farqli tayanch topilmasa, bu ustunga ishlov berib bo‘lmaydi. Mos $x_i$ noma’lum erkin bo‘lishi yoki sistema umuman yechimga ega bo‘lmasligi mumkin. Implementatsiyada bunday ustun tashlab ketilib, keyingi ustunlar bilan ish davom ettiriladi.

Jarayon davomida ayrim noma’lumlar erkin ekanligi aniqlanishi mumkin. $m>n$ bo‘lsa, kamida $m-n$ ta erkin noma’lum mavjud. Haqiqiy sonlar maydonida kamida bitta erkin noma’lum bor va sistema mos bo‘lsa, u cheksiz ko‘p yechimga ega: erkin o‘zgaruvchi ixtiyoriy qiymat oladi, bog‘liq o‘zgaruvchilar esa u orqali ifodalanadi.

Biroq erkin o‘zgaruvchining mavjudligi yechim borligini kafolatlamaydi. Ishlov berilmagan satrda barcha noma’lum koeffitsiyentlari nol, lekin ozod had noldan farqli bo‘lsa, qarama-qarshilik hosil bo‘ladi. Buni erkin o‘zgaruvchilarga nol berib, qolganlarini hisoblash va olingan vektorni boshlang‘ich sistemaga qo‘yib tekshirish mumkin.

## C++ implementatsiyasi

Quyidagi `gauss` funksiyasi kengaytirilgan $[A\mid b]$ matritsani qabul qiladi; oxirgi ustun $b$ vektoridir. Tayanch satr joriy ustundagi moduli eng katta element bo‘yicha tanlanadi.

Funksiya yechimlar sonini $0$, $1$ yoki `INF` bilan qaytaradi. Kamida bitta yechim mavjud bo‘lsa, uning qiymatlari `ans` vektoriga yoziladi.

```cpp
const double EPS = 1e-9;
const int INF = 2; // haqiqiy cheksizlik yoki juda katta son bo‘lishi shart emas

int gauss(vector<vector<double>> a, vector<double>& ans) {
    int n = (int)a.size();
    int m = (int)a[0].size() - 1;

    vector<int> where(m, -1);
    for (int col = 0, row = 0; col < m && row < n; ++col) {
        int sel = row;
        for (int i = row; i < n; ++i)
            if (abs(a[i][col]) > abs(a[sel][col]))
                sel = i;
        if (abs(a[sel][col]) < EPS)
            continue;
        for (int i = col; i <= m; ++i)
            swap(a[sel][i], a[row][i]);
        where[col] = row;

        for (int i = 0; i < n; ++i)
            if (i != row) {
                double c = a[i][col] / a[row][col];
                for (int j = col; j <= m; ++j)
                    a[i][j] -= a[row][j] * c;
            }
        ++row;
    }

    ans.assign(m, 0);
    for (int i = 0; i < m; ++i)
        if (where[i] != -1)
            ans[i] = a[where[i]][m] / a[where[i]][i];

    for (int i = 0; i < n; ++i) {
        double sum = 0;
        for (int j = 0; j < m; ++j)
            sum += ans[j] * a[i][j];
        if (abs(sum - a[i][m]) > EPS)
            return 0;
    }

    for (int i = 0; i < m; ++i)
        if (where[i] == -1)
            return INF;
    return 1;
}
```

Muhim tafsilotlar:

- funksiya joriy `col` ustuni va `row` satrini alohida yuritadi;
- `where[i]` qiymati $x_i$ ustunining tayanchi qaysi satrda ekanini saqlaydi; `-1` qiymat o‘zgaruvchi erkinligini bildiradi;
- implementatsiya joriy satrni tayanch elementga bo‘lmaydi, shu sabab yakuniy matritsa aynan birlik matritsa bo‘lmaydi; javob `a[where[i]][m] / a[where[i]][i]` orqali olinadi;
- topilgan yechim boshlang‘ich kengaytirilgan matritsaga qayta qo‘yilib tekshiriladi. Tekshiruv o‘tsa, erkin o‘zgaruvchi bor-yo‘qligiga qarab `1` yoki `INF` qaytariladi.

## Murakkablik

Algoritm ko‘pi bilan $m$ fazadan iborat. Har fazada tayanch satrni qidirish va almashtirish $O(n+m)$, tayanch topilsa uni boshqa satrlardan yo‘qotish esa $O(nm)$ vaqt oladi. Umumiy murakkablik

$$O(\min(n,m)\cdot n\cdot m).$$

$n=m$ bo‘lgan kvadrat sistemada bu $O(n^3)$ ga teng. Ikki moduldagi sistemani bitlar yordamida ancha tez ishlash mumkin.

## Oldinga va orqaga yurish bilan tezlatish

Yuqoridagi Gauss–Jordan implementatsiyasini ikki fazaga ajratib, amallar sonini qariyb ikki baravar kamaytirish mumkin:

1. **Oldinga yurish.** Joriy satr faqat undan pastdagi satrlardan ayiriladi. Natijada diagonal emas, yuqori uchburchak matritsa olinadi.
2. **Orqaga yurish.** Avval oxirgi noma’lum topiladi, so‘ng u oldingi tenglamalarga qo‘yilib navbatdagi noma’lumlar hisoblanadi.

Orqaga yurish $O(nm)$ vaqt oladi. Asosiy yutuq oldinga yurishda satrlarning faqat yarmiga o‘rtacha ishlov berilishidan keladi.

## Modul bo‘yicha sistema

Gauss–Jordan usuli modul bo‘yicha sistemalarda ham ishlaydi. Modul $2$ ga teng bo‘lsa, satrlarni `bitset` ko‘rinishida saqlab, ayirish va qo‘shishni XOR bilan bajarish ayniqsa samarali:

```cpp
int gauss(vector<bitset<N>> a, int n, int m, bitset<N>& ans) {
    vector<int> where(m, -1);
    for (int col = 0, row = 0; col < m && row < n; ++col) {
        for (int i = row; i < n; ++i)
            if (a[i][col]) {
                swap(a[i], a[row]);
                break;
            }
        if (!a[row][col])
            continue;
        where[col] = row;

        for (int i = 0; i < n; ++i)
            if (i != row && a[i][col])
                a[i] ^= a[row];
        ++row;
    }
    // Implementatsiyaning qolgan qismi yuqoridagidek.
}
```

Bitlarni bir so‘zga zich joylash tufayli kod qisqaradi va amaliy tezlik mashina so‘zi kengligiga qarab taxminan $32$ yoki $64$ baravar oshishi mumkin.

## Tayanch tanlash evristikalari

Barcha matritsalar uchun eng yaxshi yagona evristika yo‘q. Joriy ustundagi moduli eng katta elementni olish amalda yaxshi ishlaydi va ko‘pincha butun qolgan qismmatritsadan eng katta elementni tanlaydigan **to‘liq tayanchlash**ga yaqin aniqlik beradi.

Shunga qaramay, ikkala yondashuv ham tenglamalarning qanday masshtablanganiga bog‘liq. Masalan, bir tenglama $10^6$ ga ko‘paytirilgan bo‘lsa, uning koeffitsiyentlari birinchi tayanch bo‘lib tanlanish ehtimoli juda katta. Buni yumshatish uchun **yashirin tayanchlash** ishlatiladi: satrlar go‘yo eng katta elementi birga teng qilib normallangandek taqqoslanadi. Implementatsiya har bir satrdagi maksimal modulni alohida saqlashi mumkin; satrning o‘zini doimiy normallash esa yig‘ilib boruvchi xatoni oshirishi ehtimol.

## Yechim aniqligini yaxshilash

Tayanchlash evristikalariga qaramay, maxsus tuzilgan $50$–$100$ o‘lchamli matritsalarda Gauss–Jordan sezilarli sonli xato berishi mumkin. Bunday vaziyatda olingan yechimni sodda iteratsion sonli usul bilan aniqlashtirish mumkin.

Amaliy jarayon ikki bosqichli bo‘ladi: avval Gauss–Jordan boshlang‘ich yechimni topadi, keyin iteratsion usul shu yechimdan boshlab qoldiqni kamaytiradi.

## Mashq masalalari

- [SPOJ — Xor Maximization](http://www.spoj.com/problems/XMAX/)
- [CodeChef — Knight Moving](https://www.codechef.com/SEP12/problems/KNGHTMOV)
- [LightOJ — Graph Coloring](http://lightoj.com/volume_showproblem.php?problem=1279)
- [UVA 12910 — Snakes and Ladders](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4775)
- [Timus 1042 — Central Heating](http://acm.timus.ru/problem.aspx?space=1&num=1042)
- [Timus 1766 — Humpty Dumpty](http://acm.timus.ru/problem.aspx?space=1&num=1766)
- [Timus 1266 — Kirchhoff’s Law](http://acm.timus.ru/problem.aspx?space=1&num=1266)
- [Codeforces 1411G — No Game No Life](https://codeforces.com/problemset/problem/1411/G)
