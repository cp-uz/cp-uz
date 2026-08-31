---
article_id: others--stern_brocot_tree_farey_sequences
---
# Stern–Brocot daraxti va Farey ketma-ketliklari

## Stern–Brocot daraxti

Stern–Brocot daraxti barcha musbat kasrlar to‘plamini ifodalovchi nafis tuzilmadir. Uni 1858-yilda nemis matematigi Moritz Stern va 1861-yilda fransuz soatsozi Achille Brocot bir-biridan mustaqil ravishda kashf etgan. Ayrim manbalarda esa bu kashfiyot qadimgi yunon matematigi Eratosthenga tegishli deb ko‘rsatiladi.

Qurilish nolinchi iteratsiyada quyidagi ikki kasrdan boshlanadi:

$$
\frac{0}{1}, \frac{1}{0}
$$

Ikkinchi qiymat qat’iy ma’noda kasr emas, ammo uni cheksizlikni ifodalovchi qisqarmas kasr sifatida talqin qilish mumkin.

Har bir keyingi iteratsiyada barcha qo‘shni $\frac{a}{b}$ va $\frac{c}{d}$ kasrlar olinib, ularning orasiga [mediant](https://en.wikipedia.org/wiki/Mediant_(mathematics)) deb ataladigan $\frac{a+c}{b+d}$ kasr qo‘yiladi.

Dastlabki iteratsiyalar quyidagicha ko‘rinadi:

$$
\begin{array}{c}
\dfrac{0}{1}, \dfrac{1}{1}, \dfrac{1}{0} \\
\dfrac{0}{1}, \dfrac{1}{2}, \dfrac{1}{1}, \dfrac{2}{1}, \dfrac{1}{0} \\
\dfrac{0}{1}, \dfrac{1}{3}, \dfrac{1}{2}, \dfrac{2}{3}, \dfrac{1}{1}, \dfrac{3}{2}, \dfrac{2}{1}, \dfrac{3}{1}, \dfrac{1}{0}
\end{array}
$$

Jarayon cheksiz davom ettirilsa, *barcha* musbat kasrlar hosil bo‘ladi. Bundan tashqari, kasrlarning barchasi *takrorlanmas* va *qisqarmas* bo‘ladi. Ular o‘sish tartibida ham joylashadi.

Bu xossalarni isbotlashdan oldin Stern–Brocot daraxtini ro‘yxat emas, haqiqiy daraxt ko‘rinishida tasvirlaymiz. Daraxtdagi har bir kasrning ikki farzandi bor. Har bir farzand chapdagi eng yaqin ajdod bilan o‘ngdagi eng yaqin ajdodning mediantidir.

<div style="text-align: center;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/37/SternBrocotTree.svg" alt="Stern–Brocot daraxti">
</div>

## Isbotlar

**Tartib.** Tartiblanganlikni isbotlash oson. Ikki kasrning medianti har doim ularning orasida yotadi:

$$
\frac{a}{b} \le \frac{a+c}{b+d} \le \frac{c}{d},
$$

agar

$$
\frac{a}{b} \le \frac{c}{d}
$$

bo‘lsa. Ikki tengsizlikni kasrlarni umumiy maxrajga keltirish bilan osongina ko‘rsatish mumkin.

Nolinchi iteratsiyada tartib o‘suvchi bo‘lgani uchun u har bir keyingi iteratsiyada ham saqlanadi.

**Qisqarmaslik.** Buni isbotlash uchun istalgan ikkita qo‘shni $\frac{a}{b}$ va $\frac{c}{d}$ kasr uchun

$$bc-ad=1$$

bo‘lishini ko‘rsatamiz.

Ikki o‘zgaruvchili $ax+by=c$ Diofant tenglama faqat va faqat $c$ soni $\gcd(a,b)$ ga karrali bo‘lganda yechimga ega ekanini eslaymiz. Bizning holatda bundan $\gcd(a,b)=\gcd(c,d)=1$ kelib chiqadi; aynan shuni ko‘rsatish kerak.

Nolinchi iteratsiyada $bc-ad=1$ ekani ravshan. Endi mediant qo‘shilganda ham bu xossa saqlanishini ko‘rsatish qoladi.

Qo‘shni kasrlar $bc-ad=1$ shartni bajarsin. Mediant ro‘yxatga qo‘shilgach:

$$
\frac{a}{b}, \frac{a+c}{b+d}, \frac{c}{d}
$$

yangi ifodalar quyidagicha bo‘ladi:

$$\begin{align}
b(a+c)-a(b+d)&=1 \\
c(b+d)-d(a+c)&=1.
\end{align}$$

Ularning rostligi $bc-ad=1$ dan oson kelib chiqadi.

Demak, xossa har doim saqlanadi va barcha kasrlar qisqarmas bo‘ladi.

**Barcha kasrlarning mavjudligi.** Bu isbot Stern–Brocot daraxtida kasrni topish bilan chambarchas bog‘liq. Tartiblanganlik xossasiga ko‘ra, kasrning chap ost-daraxtida faqat undan kichik, o‘ng ost-daraxtida esa faqat undan katta kasrlar joylashadi. Demak, daraxt ildizidan boshlab, maqsad joriy kasrdan kichik bo‘lsa chapga, katta bo‘lsa o‘ngga yurib kasrni qidirish mumkin.

Ixtiyoriy musbat $\frac{x}{y}$ maqsad kasrni tanlaymiz. U $\frac{0}{1}$ va $\frac{1}{0}$ orasida yotadi. Shuning uchun u daraxtda bo‘lmasligining yagona imkoni — unga yetish uchun cheksiz ko‘p qadam kerak bo‘lishi.

Shunday bo‘lsa, barcha iteratsiyalarda

$$
\frac{a}{b} < \frac{x}{y} < \frac{c}{d}
$$

bajariladi. Butun $z$ uchun $z>0$ faqat va faqat $z\ge1$ ekanidan foydalanib, buni quyidagicha yozish mumkin:

$$
\begin{align}
bx-ay&\ge1 \\
cy-dx&\ge1.
\end{align}
$$

Birinchi tengsizlikni $c+d$ ga, ikkinchisini $a+b$ ga ko‘paytirib, ularni qo‘shamiz:

$$
(c+d)(bx-ay)+(a+b)(cy-dx) \ge a+b+c+d.
$$

Ifodani ochib va yuqorida isbotlangan $bc-ad=1$ xossadan foydalanib:

$$x+y \ge a+b+c+d$$

natijani olamiz.

Har bir iteratsiyada $a,b,c,d$ sonlaridan kamida bittasi ortadi. Demak, $\frac{x}{y}$ ni qidirish jarayoni $x+y$ tadan ko‘p iteratsiya davom eta olmaydi. Bu unga boradigan yo‘l cheksiz degan farazga zid. Shunday qilib, $\frac{x}{y}$ daraxtda albatta mavjud.

## Daraxtni qurish algoritmi

Stern–Brocot daraxtining istalgan ost-daraxtini qurish uchun chap va o‘ng ajdodlarni bilish yetarli. Birinchi sathda ular mos ravishda $\frac{0}{1}$ va $\frac{1}{0}$. Ularning mediantini hisoblab, bir sath pastga tushamiz: chap ost-daraxtda mediant o‘ng ajdodning, o‘ng ost-daraxtda esa chap ajdodning o‘rnini egallaydi.

Quyidagi psevdokod butun cheksiz daraxtni qurishga urinadi:

```cpp
void build(int a = 0, int b = 1, int c = 1, int d = 0, int level = 1) {
    int x = a + c, y = b + d;

    ... daraxtning joriy sathidagi x/y kasrini chiqarish

    build(a, b, x, y, level + 1);
    build(x, y, c, d, level + 1);
}
```

## Kasrni qidirish algoritmi

Barcha kasrlar daraxtda mavjudligi isbotida qidiruv algoritmi allaqachon tasvirlandi, ammo uni yana takrorlaymiz. Bu ikkilik qidiruv algoritmidir. Dastlab daraxt ildizida turib, maqsad kasrni joriy kasr bilan solishtiramiz. Ular teng bo‘lsa, jarayon tugaydi. Maqsad kichik bo‘lsa chap farzandga, aks holda o‘ng farzandga o‘tamiz.

### Sodda qidiruv

Quyidagi kod $\frac{p}{q}$ kasrga olib boruvchi yo‘lni mos ravishda chap va o‘ng farzandga o‘tishni bildiradigan `'L'` va `'R'` belgilar ketma-ketligi sifatida qaytaradi. Bunday belgilar ketma-ketligi har bir musbat kasrni yagona aniqlaydi va Stern–Brocot sanoq tizimi deb ataladi.

```cpp
string find(int p, int q) {
    int pL = 0, qL = 1;
    int pR = 1, qR = 0;
    int pM = 1, qM = 1;
    string res;
    while(pM != p || qM != q) {
        if(p * qM < pM * q) {
            res += 'L';
            tie(pR, qR) = {pM, qM};
        } else {
            res += 'R';
            tie(pL, qL) = {pM, qM};
        }
        tie(pM, qM) = pair{pL + pR, qL + qR};
    }
    return res;
}
```

Stern–Brocot sanoq tizimida irratsional sonlar cheksiz belgilar ketma-ketligiga mos keladi. Irratsional songa tomon cheksiz yo‘lda algoritm maxrajlari asta-sekin o‘suvchi qisqarmas kasrlarni topadi va ular irratsional sonning tobora aniq yaqinlashuvlarini beradi. Cheksiz ketma-ketlikning prefiksini olish orqali istalgan aniqlikdagi yaqinlashuvga erishish mumkin. Bu qo‘llanish soatsozlikda muhim bo‘lib, daraxt aynan shu sohada kashf etilganini tushuntiradi.

$\frac{p}{q}$ kasr uchun hosil bo‘ladigan ketma-ketlik uzunligi $O(p+q)$ gacha yetishi mumkin; masalan, $\frac{p}{1}$ ko‘rinishidagi kasrda. Shu sababli yuqoridagi algoritmni **faqat bunday murakkablik maqbul bo‘lganda ishlatish kerak**.

### Logarifmik qidiruv

Yaxshiyamki, algoritmni $O(\log(p+q))$ murakkablikni kafolatlaydigan qilib yaxshilash mumkin. Joriy chegara kasrlar $\frac{p_L}{q_L}$ va $\frac{p_R}{q_R}$ bo‘lsa, o‘ngga $a$ qadam yurish $\frac{p_L+a p_R}{q_L+a q_R}$ kasrga, chapga $a$ qadam yurish esa $\frac{a p_L+p_R}{a q_L+q_R}$ kasrga olib kelishini ko‘ramiz.

Demak, bittadan `L` yoki `R` qadam tashlash o‘rniga bir yo‘nalishda birdaniga $k$ qadam yurib, keyin yo‘nalishni almashtirish mumkin. Shunday qilib, $\frac{p}{q}$ kasrga olib boruvchi yo‘lni bir xil belgilar guruhlarining uzunliklari bilan kodlangan ko‘rinishda topamiz.

Yo‘nalishlar navbatma-navbat almashgani uchun har safar qaysi tomonga yurish ma’lum. Qulaylik uchun $\frac{p}{q}$ kasrga yo‘lni quyidagi kasrlar ketma-ketligi sifatida ifodalash mumkin:

$$
\frac{p_0}{q_0}, \frac{p_1}{q_1}, \frac{p_2}{q_2}, \dots, \frac{p_n}{q_n}, \frac{p_{n+1}}{q_{n+1}}=\frac{p}{q},
$$

bu yerda $\frac{p_{k-1}}{q_{k-1}}$ va $\frac{p_k}{q_k}$ — $k$-qadamdagi qidiruv oralig‘i chegaralari. Boshlanishida $\frac{p_0}{q_0}=\frac{0}{1}$ va $\frac{p_1}{q_1}=\frac{1}{0}$. $k$-qadamdan keyin quyidagi kasrga o‘tiladi:

$$
\frac{p_{k+1}}{q_{k+1}} = \frac{p_{k-1}+a_k p_k}{q_{k-1}+a_k q_k},
$$

bu yerda $a_k$ — musbat butun son. Agar [uzluksiz kasrlar](../algebra/continued-fractions.md) bilan tanish bo‘lsangiz, $\frac{p_i}{q_i}$ ketma-ketligi $\frac{p}{q}$ ning yaqinlashuvchi kasrlari, $[a_1; a_2, \dots, a_n, 1]$ esa $\frac{p}{q}$ ning uzluksiz kasr ko‘rinishi ekanini payqaysiz.

Bu bog‘lanish $\frac{p}{q}$ ni uzluksiz kasrga yoyish algoritmiga o‘xshash tarzda uning yo‘lidagi bir xil qadamlar guruhlarini topish imkonini beradi:

```cpp
auto find(int p, int q) {
    bool right = true;
    vector<pair<int, char>> res;
    while(q) {
        res.emplace_back(p / q, right ? 'R' : 'L');
        tie(p, q) = pair{q, p % q};
        right ^= 1;
    }
    res.back().first--;
    return res;
}
```

Biroq bu usul $\frac{p}{q}$ oldindan ma’lum bo‘lib, uning Stern–Brocot daraxtidagi o‘rnini topmoqchi bo‘lgandagina ishlaydi.

Amalda ko‘pincha $\frac{p}{q}$ oldindan ma’lum bo‘lmaydi, ammo aniq $\frac{x}{y}$ uchun $\frac{x}{y}<\frac{p}{q}$ ekanini tekshira olamiz.

Bunda joriy $\frac{p_{k-1}}{q_{k-1}}$ va $\frac{p_k}{q_k}$ chegaralarni saqlab, har bir $a_k$ ni ikkilik qidiruv bilan topish orqali Stern–Brocot daraxtidagi qidiruvni taqlid qilish mumkin. Algoritm texnikroq bo‘ladi va masala $a_k$ ni tezroq, masalan, ma’lum ifodaning `floor` qiymati orqali topishga imkon bermasa, murakkabligi $O(\log^2(x+y))$ gacha yetishi mumkin.

## Farey ketma-ketligi

$n$-tartibli Farey ketma-ketligi — maxrajlari $n$ dan oshmaydigan, $0$ bilan $1$ orasidagi kasrlarning saralangan ketma-ketligi.

Ketma-ketliklar 1816-yilda Farey ketma-ketligidagi istalgan kasr o‘z qo‘shnilarining medianti bo‘lishini taxmin qilgan ingliz geologi John Farey nomi bilan ataladi. Bu natijani keyinroq Cauchy isbotlagan, ammo ulardan mustaqil ravishda matematik Haros 1802-yildayoq deyarli shu xulosaga kelgan.

Farey ketma-ketliklarining o‘ziga xos ko‘plab qiziqarli xossalari bor, ammo ularning Stern–Brocot daraxti bilan aloqasi eng ravshanidir. Aslida Farey ketma-ketliklarini daraxt shoxlarini kesib olish orqali hosil qilish mumkin.

Stern–Brocot daraxtini qurish algoritmidan Farey ketma-ketliklari algoritmi kelib chiqadi. $\frac{0}{1}, \frac{1}{0}$ kasrlar ro‘yxatidan boshlaymiz. Har bir keyingi iteratsiyada mediantni faqat uning maxraji $n$ dan oshmasa qo‘shamiz. Bir payt ro‘yxat o‘zgarishdan to‘xtaydi va kerakli Farey ketma-ketligi hosil bo‘ladi.

### Farey ketma-ketligining uzunligi

$n$-tartibli Farey ketma-ketligi $(n-1)$-tartibli ketma-ketlikning barcha elementlarini, shuningdek maxraji $n$ bo‘lgan barcha qisqarmas kasrlarni o‘z ichiga oladi. Keyingilar soni aynan Eyler funksiyasi $\varphi(n)$ ga teng. Demak, $n$-tartibli Farey ketma-ketligining $L_n$ uzunligi:

$$L_n = L_{n-1}+\varphi(n),$$

yoki rekursiyani ochib yozsak:

$$L_n = 1+\sum_{k=1}^n \varphi(k).$$
