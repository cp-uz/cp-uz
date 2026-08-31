---
article_id: algebra--fft
---
# Tez Fourier almashtirishi

Ushbu maqolada uzunligi $n$ bo‘lgan ikkita ko‘phadni $O(n \log n)$ vaqtda ko‘paytirish imkonini beradigan algoritmni ko‘rib chiqamiz. Bu $O(n^2)$ vaqt sarflaydigan sodda ko‘paytirishdan yaxshiroq.
Shubhasiz, ikkita uzun sonni ko‘paytirishni ham ko‘phadlarni ko‘paytirishga keltirish mumkin. Demak, ikkita uzun sonni ham $O(n \log n)$ vaqtda ko‘paytirish mumkin (bunda $n$ — sonlardagi raqamlar soni).
**Tez Fourier almashtirishi (FFT)** ning kashf etilishi odatda 1965-yilda algoritmni e’lon qilgan Cooley va Tukeyga nisbat beriladi.
Aslida esa FFT undan oldin ham bir necha marta qayta kashf etilgan, biroq zamonaviy kompyuterlar yaratilishidan avval uning ahamiyati tushunilmagan.
Ayrim tadqiqotchilar FFT kashfiyotini 1924-yilda Runge va Königga nisbat berishadi.
Ammo Gauss bunday usulni 1805-yildayoq ishlab chiqqan, faqat uni hech qachon nashr etmagan.
Bu yerda keltiriladigan FFT algoritmi $O(n \log n)$ vaqtda ishlashiga, lekin ixtiyoriy darajada katta ko‘phadlarni ixtiyoriy katta koeffitsiyentlar bilan ko‘paytirish yoki ixtiyoriy katta butun sonlarni ko‘paytirish uchun ishlamasligiga e’tibor bering.
U kichik koeffitsiyentli $10^5$ o‘lchamli ko‘phadlarni yoki uzunligi $10^6$ bo‘lgan ikkita sonni oson qayta ishlaydi; bu odatda musobaqa dasturlash masalalari uchun yetarli. $10^6$ bitli sonlarni ko‘paytirish miqyosidan oshganda, hisoblashda ishlatiladigan suzuvchi nuqtali sonlarning diapazoni va aniqligi yakuniy natijani aniq olish uchun yetarli bo‘lmaydi. Biroq ixtiyoriy katta ko‘phad yoki butun sonlarni ko‘paytira oladigan murakkabroq variantlar mavjud.
Masalan, 1971-yilda Schönhage va Strassen halqa tuzilmalarida FFT ni rekursiv qo‘llaydigan va $O(n \log n \log \log n)$ vaqtda ishlaydigan ixtiyoriy katta sonlarni ko‘paytirish variantini ishlab chiqdi.
Yaqinda esa (2019-yilda) Harvey va van der Hoeven haqiqiy $O(n \log n)$ vaqtda ishlaydigan algoritmni e’lon qildi.
## Diskret Fourier almashtirishi

Darajasi $n - 1$ bo‘lgan ko‘phad berilgan bo‘lsin:

$$A(x) = a_0 x^0 + a_1 x^1 + \dots + a_{n-1} x^{n-1}$$

Umumiylikni yo‘qotmagan holda $n$ — koeffitsiyentlar soni — 2 ning darajasi deb faraz qilamiz.
Agar $n$ 2 ning darajasi bo‘lmasa, yetishmayotgan $a_i x^i$ hadlarni qo‘shib, ularning $a_i$ koeffitsiyentlarini $0$ ga tenglaymiz.
Kompleks sonlar nazariyasiga ko‘ra, $x^n = 1$ tenglamaning $n$ ta kompleks yechimi bor (ular birlikning $n$-darajali ildizlari deyiladi) va yechimlar $k = 0 \dots n-1$ uchun $w_{n, k} = e^{\frac{2 k \pi i}{n}}$ ko‘rinishida bo‘ladi.
Bundan tashqari, bu kompleks sonlarning juda qiziqarli xossalari bor.
Masalan, asosiy $n$-darajali ildiz $w_n = w_{n, 1} = e^{\frac{2 \pi i}{n}}$ yordamida qolgan barcha $n$-darajali ildizlarni $w_{n, k} = (w_n)^k$ ko‘rinishida ifodalash mumkin.
$A(x)$ ko‘phadning (yoki unga ekvivalent ravishda $(a_0, a_1, \dots, a_{n-1})$ koeffitsiyentlar vektorining) **diskret Fourier almashtirishi (DFT)** ko‘phadning $x = w_{n, k}$ nuqtalardagi qiymatlari sifatida aniqlanadi, ya’ni u quyidagi vektor:

$$\begin{align}
\text{DFT}(a_0, a_1, \dots, a_{n-1}) &= (y_0, y_1, \dots, y_{n-1}) \\
&= (A(w_{n, 0}), A(w_{n, 1}), \dots, A(w_{n, n-1})) \\
&= (A(w_n^0), A(w_n^1), \dots, A(w_n^{n-1}))
\end{align}$$
Xuddi shunday, **teskari diskret Fourier almashtirishi** aniqlanadi:
ko‘phadning $(y_0, y_1, \dots, y_{n-1})$ qiymatlarining teskari DFT si ko‘phadning $(a_0, a_1, \dots, a_{n-1})$ koeffitsiyentlaridir.

$$\text{InverseDFT}(y_0, y_1, \dots, y_{n-1}) = (a_0, a_1, \dots, a_{n-1})$$

Shunday qilib, to‘g‘ri DFT ko‘phadning $n$-darajali birlik ildizlaridagi qiymatlarini hisoblasa, teskari DFT shu qiymatlar yordamida ko‘phad koeffitsiyentlarini tiklaydi.
### DFT qo‘llanilishi: ko‘phadlarni tez ko‘paytirish

$A$ va $B$ ko‘phadlar berilgan bo‘lsin.
Ularning har biri uchun DFT ni hisoblaymiz: $\text{DFT}(A)$ va $\text{DFT}(B)$.

Bu ko‘phadlarni ko‘paytirsak nima bo‘ladi?
Har bir nuqtada qiymatlar shunchaki ko‘paytirilishi ayon:

$$(A \cdot B)(x) = A(x) \cdot B(x).$$
Bu shuni anglatadiki, $\text{DFT}(A)$ va $\text{DFT}(B)$ vektorlarini — bir vektorning har bir elementini ikkinchi vektorning mos elementiga ko‘paytirib — ko‘paytirsak, $A \cdot B$ ko‘phadning DFT si bo‘lgan $\text{DFT}(A \cdot B)$ ni olamiz:

$$\text{DFT}(A \cdot B) = \text{DFT}(A) \cdot \text{DFT}(B)$$

Nihoyat, teskari DFT ni qo‘llab, quyidagini olamiz:

$$A \cdot B = \text{InverseDFT}(\text{DFT}(A) \cdot \text{DFT}(B))$$
O‘ng tomondagi ikkita DFT ko‘paytmasi deganda vektor elementlarining juftma-juft ko‘paytmasi nazarda tutiladi.
Buni $O(n)$ vaqtda hisoblash mumkin.
Agar DFT va teskari DFT ni $O(n \log n)$ vaqtda hisoblay olsak, ikkita ko‘phadning (demak, ikkita uzun sonning ham) ko‘paytmasini shu vaqt murakkabligida hisoblaymiz.
Ikki ko‘phadning darajalari bir xil bo‘lishi kerakligini ta’kidlash lozim.
Aks holda DFT natijasidagi ikki vektorning uzunliklari har xil bo‘ladi.
Buni qiymati $0$ bo‘lgan koeffitsiyentlarni qo‘shish orqali ta’minlash mumkin.

Bundan tashqari, ikkita ko‘phad ko‘paytmasining darajasi $2 (n - 1)$ bo‘lgani uchun har bir ko‘phadning darajasini ikki baravar oshirishimiz kerak (yana $0$ lar bilan to‘ldirib).
$n$ ta qiymatli vektordan $2n - 1$ ta koeffitsiyentli kerakli ko‘phadni tiklab bo‘lmaydi.
### Tez Fourier almashtirishi

**Tez Fourier almashtirishi** DFT ni $O(n \log n)$ vaqtda hisoblash imkonini beradigan usuldir.
FFT ning asosiy g‘oyasi bo‘lib tashla va hukmronlik qil usulini qo‘llashdir.
Ko‘phad koeffitsiyentlari vektorini ikkita vektorga ajratamiz, ularning har biri uchun DFT ni rekursiv hisoblaymiz va natijalarni birlashtirib butun ko‘phadning DFT sini olamiz.

Darajasi $n - 1$ bo‘lgan $A(x)$ ko‘phad berilgan bo‘lsin, bunda $n$ 2 ning darajasi va $n > 1$:
$$A(x) = a_0 x^0 + a_1 x^1 + \dots + a_{n-1} x^{n-1}$$

Uni ikkita kichikroq ko‘phadga — faqat juft pozitsiyalardagi koeffitsiyentlarni saqlaydigan va faqat toq pozitsiyalardagi koeffitsiyentlarni saqlaydigan ko‘phadlarga — ajratamiz:

$$\begin{align}
A_0(x) &= a_0 x^0 + a_2 x^1 + \dots + a_{n-2} x^{\frac{n}{2}-1} \\
A_1(x) &= a_1 x^0 + a_3 x^1 + \dots + a_{n-1} x^{\frac{n}{2}-1}
\end{align}$$

Quyidagini ko‘rish oson:

$$A(x) = A_0(x^2) + x A_1(x^2).$$
$A_0$ va $A_1$ ko‘phadlarning koeffitsiyentlari soni $A$ nikidan ikki baravar kam.
Agar $\text{DFT}(A_0)$ va $\text{DFT}(A_1)$ yordamida $\text{DFT}(A)$ ni chiziqli vaqtda hisoblasak, vaqt murakkabligi uchun $T_{\text{DFT}}(n) = 2 T_{\text{DFT}}\left(\frac{n}{2}\right) + O(n)$ rekurrent munosabatni olamiz. **Master teorema** bo‘yicha bundan $T_{\text{DFT}}(n) = O(n \log n)$ kelib chiqadi.

Bunga qanday erishishni o‘rganamiz.
$\left(y_k^0\right)_{k=0}^{n/2-1} = \text{DFT}(A_0)$ va $\left(y_k^1\right)_{k=0}^{n/2-1} = \text{DFT}(A_1)$ vektorlarini hisoblagan bo‘laylik.
$\left(y_k\right)_{k=0}^{n-1} = \text{DFT}(A)$ uchun ifoda topamiz.

Birinchi $\frac{n}{2}$ ta qiymat uchun yuqoridagi $A(x) = A_0(x^2) + x A_1(x^2)$ tenglamadan bevosita foydalanish mumkin:

$$y_k = y_k^0 + w_n^k y_k^1, \quad k = 0 \dots \frac{n}{2} - 1.$$

Ikkinchi $\frac{n}{2}$ ta qiymat uchun esa biroz boshqacha ifoda topish kerak:
$$\begin{align}
y_{k+n/2} &= A\left(w_n^{k+n/2}\right) \\
&= A_0\left(w_n^{2k+n}\right) + w_n^{k + n/2} A_1\left(w_n^{2k+n}\right) \\
&= A_0\left(w_n^{2k} w_n^n\right) + w_n^k w_n^{n/2} A_1\left(w_n^{2k} w_n^n\right) \\
&= A_0\left(w_n^{2k}\right) - w_n^k A_1\left(w_n^{2k}\right) \\
&= y_k^0 - w_n^k y_k^1
\end{align}$$

Bu yerda yana $A(x) = A_0(x^2) + x A_1(x^2)$ va $w_n^n = 1$, $w_n^{n/2} = -1$ ayniyatlaridan foydalandik.

Shunday qilib, butun $(y_k)$ vektorni hisoblash uchun kerakli formulalarni olamiz:
$$\begin{align}
y_k &= y_k^0 + w_n^k y_k^1, &\quad k = 0 \dots \frac{n}{2} - 1, \\
y_{k+n/2} &= y_k^0 - w_n^k y_k^1, &\quad k = 0 \dots \frac{n}{2} - 1.
\end{align}$$

(Bu $a + b$ va $a - b$ ko‘rinishidagi naqsh ba’zan **kapalak** (*butterfly*) deb ataladi.)

Shu tariqa DFT ni $O(n \log n)$ vaqtda hisoblashni o‘rgandik.
### Teskari FFT

Darajasi $n - 1$ bo‘lgan $A$ ko‘phadning $x = w_n^k$ nuqtalardagi qiymatlari — $(y_0, y_1, \dots y_{n-1})$ vektori — berilgan bo‘lsin.
Ko‘phadning $(a_0, a_1, \dots, a_{n-1})$ koeffitsiyentlarini tiklamoqchimiz.
Bu ma’lum masala **interpolyatsiya** deb ataladi va uni yechish uchun umumiy algoritmlar mavjud.
Ammo ushbu maxsus holatda (nuqtalar birlik ildizlari ekanini bilganimiz uchun) ancha sodda, amalda to‘g‘ri FFT bilan bir xil algoritmni olish mumkin.
DFT ni ta’rifiga ko‘ra matritsa ko‘rinishida yozishimiz mumkin:
$$
\begin{pmatrix}
w_n^0 & w_n^0 & w_n^0 & w_n^0 & \cdots & w_n^0 \\
w_n^0 & w_n^1 & w_n^2 & w_n^3 & \cdots & w_n^{n-1} \\
w_n^0 & w_n^2 & w_n^4 & w_n^6 & \cdots & w_n^{2(n-1)} \\
w_n^0 & w_n^3 & w_n^6 & w_n^9 & \cdots & w_n^{3(n-1)} \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
w_n^0 & w_n^{n-1} & w_n^{2(n-1)} & w_n^{3(n-1)} & \cdots & w_n^{(n-1)(n-1)}
\end{pmatrix} \begin{pmatrix}
a_0 \\ a_1 \\ a_2 \\ a_3 \\ \vdots \\ a_{n-1}
\end{pmatrix} = \begin{pmatrix}
y_0 \\ y_1 \\ y_2 \\ y_3 \\ \vdots \\ y_{n-1}
\end{pmatrix}
$$
Bu matritsa **Vandermonde matritsasi** deb ataladi.

Shunday qilib, $(y_0, y_1, \dots y_{n-1})$ vektorni chapdan matritsaning teskarisiga ko‘paytirib, $(a_0, a_1, \dots, a_{n-1})$ vektorni hisoblash mumkin:
$$
\begin{pmatrix}
a_0 \\ a_1 \\ a_2 \\ a_3 \\ \vdots \\ a_{n-1}
\end{pmatrix} = \begin{pmatrix}
w_n^0 & w_n^0 & w_n^0 & w_n^0 & \cdots & w_n^0 \\
w_n^0 & w_n^1 & w_n^2 & w_n^3 & \cdots & w_n^{n-1} \\
w_n^0 & w_n^2 & w_n^4 & w_n^6 & \cdots & w_n^{2(n-1)} \\
w_n^0 & w_n^3 & w_n^6 & w_n^9 & \cdots & w_n^{3(n-1)} \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
w_n^0 & w_n^{n-1} & w_n^{2(n-1)} & w_n^{3(n-1)} & \cdots & w_n^{(n-1)(n-1)}
\end{pmatrix}^{-1} \begin{pmatrix}
y_0 \\ y_1 \\ y_2 \\ y_3 \\ \vdots \\ y_{n-1}
\end{pmatrix}
$$
Tez tekshiruv matritsaning teskarisi quyidagi ko‘rinishga ega ekanini ko‘rsatadi:
$$
\frac{1}{n}
\begin{pmatrix}
w_n^0 & w_n^0 & w_n^0 & w_n^0 & \cdots & w_n^0 \\
w_n^0 & w_n^{-1} & w_n^{-2} & w_n^{-3} & \cdots & w_n^{-(n-1)} \\
w_n^0 & w_n^{-2} & w_n^{-4} & w_n^{-6} & \cdots & w_n^{-2(n-1)} \\
w_n^0 & w_n^{-3} & w_n^{-6} & w_n^{-9} & \cdots & w_n^{-3(n-1)} \\
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\
w_n^0 & w_n^{-(n-1)} & w_n^{-2(n-1)} & w_n^{-3(n-1)} & \cdots & w_n^{-(n-1)(n-1)}
\end{pmatrix}
$$

Demak, quyidagi formulani olamiz:
$$a_k = \frac{1}{n} \sum_{j=0}^{n-1} y_j w_n^{-k j}$$

Buni $y_k$ formulasi bilan taqqoslaymiz:

$$y_k = \sum_{j=0}^{n-1} a_j w_n^{k j}.$$

Bu masalalar deyarli bir xil ekanini ko‘ramiz. Shuning uchun $a_k$ koeffitsiyentlarni to‘g‘ri FFT dagi bo‘lib tashla va hukmronlik qil algoritmi bilan topish mumkin; faqat $w_n^k$ o‘rniga $w_n^{-k}$ ishlatamiz va oxirida hosil bo‘lgan koeffitsiyentlarni $n$ ga bo‘lamiz.
Demak, teskari DFT ni hisoblash to‘g‘ri DFT ni hisoblash bilan deyarli bir xil va uni ham $O(n \log n)$ vaqtda bajarish mumkin.
### Implementatsiya

Bu yerda FFT va teskari FFT ning sodda rekursiv **implementatsiyasini** bitta funksiyada keltiramiz, chunki to‘g‘ri va teskari FFT o‘rtasidagi farq juda kichik.
Kompleks sonlarni saqlash uchun C++ STL dagi `complex` turidan foydalanamiz.

```{.cpp file=fft_recursive}
using cd = complex<double>;
const double PI = acos(-1);

void fft(vector<cd> & a, bool invert) {
    int n = a.size();
    if (n == 1)
        return;
    vector<cd> a0(n / 2), a1(n / 2);
    for (int i = 0; 2 * i < n; i++) {
        a0[i] = a[2*i];
        a1[i] = a[2*i+1];
    }
    fft(a0, invert);
    fft(a1, invert);

    double ang = 2 * PI / n * (invert ? -1 : 1);
    cd w(1), wn(cos(ang), sin(ang));
    for (int i = 0; 2 * i < n; i++) {
        a[i] = a0[i] + w * a1[i];
        a[i + n/2] = a0[i] - w * a1[i];
        if (invert) {
            a[i] /= 2;
            a[i + n/2] /= 2;
        }
        w *= wn;
    }
}
```
Funksiyaga koeffitsiyentlar vektori beriladi; u DFT yoki teskari DFT ni hisoblab, natijani yana shu vektorda saqlaydi.
$\text{invert}$ argumenti to‘g‘ri yoki teskari DFT hisoblanishini ko‘rsatadi.
Funksiya ichida avval vektor uzunligi birga tengligini tekshiramiz; teng bo‘lsa, hech narsa qilish shart emas.
Aks holda $a$ vektorni $a0$ va $a1$ vektorlarga ajratib, ikkalasi uchun DFT ni rekursiv hisoblaymiz.
Keyin $wn$ qiymatini va $wn$ ning joriy darajasini saqlaydigan $w$ o‘zgaruvchini boshlang‘ich holatga keltiramiz.
So‘ng yuqoridagi formulalar yordamida natijaviy DFT qiymatlarini hisoblaymiz.
Agar $\text{invert}$ bayrog‘i o‘rnatilgan bo‘lsa, $wn$ ni $wn^{-1}$ bilan almashtiramiz va natijaning har bir qiymatini $2$ ga bo‘lamiz (bu rekursiyaning har bir darajasida bajarilgani uchun yakuniy qiymatlar $n$ ga bo‘linadi).

Ushbu funksiya yordamida **ikkita ko‘phadni ko‘paytirish** funksiyasini yaratish mumkin:
```{.cpp file=fft_multiply}
vector<int> multiply(vector<int> const& a, vector<int> const& b) {
    vector<cd> fa(a.begin(), a.end()), fb(b.begin(), b.end());
    int n = 1;
    while (n < a.size() + b.size())
        n <<= 1;
    fa.resize(n);
    fb.resize(n);

    fft(fa, false);
    fft(fb, false);
    for (int i = 0; i < n; i++)
        fa[i] *= fb[i];
    fft(fa, true);

    vector<int> result(n);
    for (int i = 0; i < n; i++)
        result[i] = round(fa[i].real());
    return result;
}
```
Bu funksiya butun koeffitsiyentli ko‘phadlar bilan ishlaydi, ammo uni boshqa turlar bilan ishlashga ham moslashtirish mumkin.
Kompleks sonlar bilan ishlashda ma’lum xato yuzaga kelgani uchun, oxirida natijaviy koeffitsiyentlarni yaxlitlashimiz kerak.

Nihoyat, ikkita uzun sonni **ko‘paytirish** funksiyasi ko‘phadlarni ko‘paytirish funksiyasidan deyarli farq qilmaydi.
Keyin bajarishimiz kerak bo‘lgan yagona ish — sonni normallashtirish:
```cpp
    int carry = 0;
    for (int i = 0; i < n; i++)
        result[i] += carry;
        carry = result[i] / 10;
        result[i] %= 10;
    }
```

Ikki son ko‘paytmasining uzunligi hech qachon ularning uzunliklari yig‘indisidan oshmagani uchun, vektor o‘lchami barcha ko‘chirish amallarini bajarishga yetarli.
### Yaxshilangan implementatsiya: joyida hisoblash

Samaradorlikni oshirish uchun rekursiv implementatsiyadan iterativ implementatsiyaga o‘tamiz.
Yuqoridagi rekursiv implementatsiyada $a$ vektorni aniq ravishda ikkita vektorga ajratdik: juft o‘rinlardagi elementlar bir vaqtinchalik vektorga, toq o‘rinlardagi elementlar esa boshqasiga joylashtirildi.
Ammo elementlarni ma’lum tartibda qayta joylashtirsak, bu vaqtinchalik vektorlarni yaratishga hojat qolmaydi (ya’ni barcha hisoblashlarni “joyida”, bevosita $A$ vektorining o‘zida bajarish mumkin).

Birinchi rekursiya darajasida indeksining eng kichik biti nol bo‘lgan elementlar $a_0$ vektorga, eng kichik biti bir bo‘lgan elementlar esa $a_1$ vektorga o‘tganiga e’tibor bering.
Ikkinchi rekursiya darajasida xuddi shu holat indeksning oxiridan ikkinchi biti uchun, keyingi darajalarda esa navbatdagi bitlar uchun sodir bo‘ladi.
Shuning uchun har bir koeffitsiyent indeksining bitlarini teskari qilib, elementlarni shu teskari qiymatlar bo‘yicha tartiblasak, kerakli tartibni olamiz (bu **bitlarni teskari tartiblash permutatsiyasi**, ya’ni bit-reversal permutation deyiladi).

Masalan, $n = 8$ uchun kerakli tartib quyidagicha:

$$a = \bigg\{ \Big[ (a_0, a_4), (a_2, a_6) \Big], \Big[ (a_1, a_5), (a_3, a_7) \Big] \bigg\}$$

Haqiqatan ham, birinchi rekursiya darajasida (figurali qavslar bilan o‘ralgan qismda) vektor $[a_0, a_2, a_4, a_6]$ va $[a_1, a_3, a_5, a_7]$ qismlariga ajraladi.
Ko‘rib turganimizdek, bitlarni teskari tartiblash permutatsiyasida bu vektorni shunchaki ikkita yarmiga: dastlabki $\frac{n}{2}$ ta va oxirgi $\frac{n}{2}$ ta elementga ajratishga mos keladi.
Keyin har bir yarim uchun rekursiv chaqiruv bajariladi.

Ularning har biri uchun olingan DFT natijasi elementlarning o‘z joyiga — mos ravishda $a$ vektorining birinchi va ikkinchi yarmiga — yozilgan bo‘lsin:

$$a = \bigg\{ \Big[y_0^0, y_1^0, y_2^0, y_3^0\Big], \Big[y_0^1, y_1^1, y_2^1, y_3^1 \Big] \bigg\}$$

Endi bu ikki DFT ni butun vektor uchun bitta DFT ga birlashtirmoqchimiz.
Elementlarning tartibi buning uchun aynan qulay va birlashtirishni ham bevosita shu vektorda bajarish mumkin.
$y_0^0$ va $y_0^1$ elementlarini olib, ular ustida butterfly almashtirishini bajaramiz.
Hosil bo‘lgan ikki qiymatning joyi boshlang‘ich ikki qiymatning joyi bilan bir xil, shuning uchun quyidagini olamiz:

$$a = \bigg\{ \Big[y_0^0 + w_n^0 y_0^1, y_1^0, y_2^0, y_3^0\Big], \Big[y_0^0 - w_n^0 y_0^1, y_1^1, y_2^1, y_3^1\Big] \bigg\}$$

Xuddi shunday, $y_1^0$ va $y_1^1$ uchun butterfly almashtirishini hisoblab, natijalarni ularning joyiga yozamiz va shu tarzda davom etamiz.
Natijada quyidagini olamiz:

$$a = \bigg\{ \Big[y_0^0 + w_n^0 y_0^1, y_1^0 + w_n^1 y_1^1, y_2^0 + w_n^2 y_2^1, y_3^0 + w_n^3 y_3^1\Big], \Big[y_0^0 - w_n^0 y_0^1, y_1^0 - w_n^1 y_1^1, y_2^0 - w_n^2 y_2^1, y_3^0 - w_n^3 y_3^1\Big] \bigg\}$$

Shu tariqa $a$ vektorining kerakli DFT sini hisobladik.

Bu yerda DFT ni faqat rekursiyaning birinchi darajasida hisoblash jarayonini tasvirladik, ammo ayni usul boshqa barcha darajalar uchun ham ishlashi ravshan.
Demak, bitlarni teskari tartiblash permutatsiyasini qo‘llagandan so‘ng DFT ni qo‘shimcha xotirasiz, joyida hisoblash mumkin.
Bu yana rekursiyadan voz kechish imkonini beradi.

Biz eng quyi darajadan boshlaymiz: vektorni juftliklarga ajratib, ularga butterfly almashtirishini qo‘llaymiz.
Natijada $a$ vektoriga rekursiyaning oxirgi darajasidagi ish qo‘llangan bo‘ladi.
Keyingi qadamda vektorni uzunligi $4$ bo‘lgan bloklarga ajratib, yana butterfly almashtirishini qo‘llaymiz; bu har bir uzunligi $4$ bo‘lgan blok uchun DFT ni beradi.
Shu tarzda davom etamiz.
Oxirgi qadamda $a$ ning ikkala yarmi uchun DFT natijalari mavjud bo‘ladi va butterfly almashtirishi orqali butun $a$ vektorining DFT sini olamiz.

```{.cpp file=fft_implementation_iterative}
using cd = complex<double>;
const double PI = acos(-1);

int reverse(int num, int lg_n) {
    int res = 0;
    for (int i = 0; i < lg_n; i++) {
        if (num & (1 << i))
            res |= 1 << (lg_n - 1 - i);
    }
    return res;
}

void fft(vector<cd> & a, bool invert) {
    int n = a.size();
    int lg_n = 0;
    while ((1 << lg_n) < n)
        lg_n++;
    for (int i = 0; i < n; i++) {
        if (i < reverse(i, lg_n))
            swap(a[i], a[reverse(i, lg_n)]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            cd w(1);
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i+j], v = a[i+j+len/2] * w;
                a[i+j] = u + v;
                a[i+j+len/2] = u - v;
                w *= wlen;
            }
        }
    }

    if (invert) {
        for (cd & x : a)
            x /= n;
    }
}
```

Avval har bir elementni indeksi bitlari teskari yozilgan o‘rindagi element bilan almashtirib, bitlarni teskari tartiblash permutatsiyasini qo‘llaymiz.
Keyin algoritmning $\log n - 1$ bosqichida mos $\text{len}$ o‘lchamli har bir blok uchun DFT ni hisoblaymiz.
Bu bloklarning barchasi uchun bir xil $\text{wlen}$ birlik ildizi ishlatiladi.
Barcha bloklar bo‘ylab yurib, ularning har biriga butterfly almashtirishini qo‘llaymiz.

Bitlarni teskari yozishni yanada optimallashtirish mumkin.
Oldingi implementatsiyada indeksning barcha bitlari bo‘ylab yurib, bitlari teskari yozilgan indeksni yangidan tuzdik.
Ammo bitlarni boshqa usulda teskari qilish mumkin.
$j$ allaqachon $i$ ning bitlari teskari yozilgan qiymatini saqlayotgan bo‘lsin.
$i + 1$ ga o‘tish uchun $i$ ni bittaga oshirishimiz va $j$ ni ham, lekin “teskari” sanoq sistemasida, bittaga oshirishimiz kerak.
Oddiy ikkilik sanoq sistemasida bir qo‘shish oxirdagi barcha birlarni nollarga, ularning oldidagi nolni esa birga aylantirishga teng.
“Teskarilangan” sanoq sistemasida esa boshidagi barcha birlarni va ulardan keyingi nolni almashtiramiz.

Shunday qilib, quyidagi implementatsiyani olamiz:

```{.cpp file=fft_implementation_iterative_opt}
using cd = complex<double>;
const double PI = acos(-1);

void fft(vector<cd> & a, bool invert) {
    int n = a.size();

    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1)
            j ^= bit;
        j ^= bit;

        if (i < j)
            swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            cd w(1);
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i+j], v = a[i+j+len/2] * w;
                a[i+j] = u + v;
                a[i+j+len/2] = u - v;
                w *= wlen;
            }
        }
    }

    if (invert) {
        for (cd & x : a)
            x /= n;
    }
}
```

Bundan tashqari, bitlarni teskari tartiblash permutatsiyasini oldindan hisoblab qo‘yish mumkin.
Bu ayniqsa barcha chaqiruvlarda $n$ o‘lcham bir xil bo‘lganda foydali.
Ammo hatto atigi uchta chaqiruv bo‘lganda ham (ikkita ko‘phadni ko‘paytirish uchun aynan shuncha chaqiruv kerak) ta’siri seziladi.
Shuningdek, barcha birlik ildizlari va ularning darajalarini oldindan hisoblash mumkin.

## Sonlar nazariyasidagi almashtirish

Endi maqsadni biroz o‘zgartiramiz.
Hali ham ikkita ko‘phadni $O(n \log n)$ vaqtda ko‘paytirmoqchimiz, ammo bu safar koeffitsiyentlarni biror tub $p$ son bo‘yicha modulda hisoblashni istaymiz.
Albatta, bu masala uchun oddiy DFT dan foydalanib, natijaga modul amalini qo‘llash mumkin.
Biroq bu, ayniqsa katta sonlar bilan ishlaganda, yaxlitlash xatolariga olib kelishi mumkin.
**Sonlar nazariyasidagi almashtirish (Number Theoretic Transform, NTT)** faqat butun sonlar bilan ishlash afzalligiga ega, shu sabab natijaning to‘g‘riligi kafolatlanadi.

Diskret Fourier almashtirishi kompleks sonlar va birlikning $n$-darajali ildizlariga asoslanadi.
Uni samarali hisoblash uchun ildizlarning xossalaridan keng foydalanamiz (masalan, bitta ildiz darajaga oshirish orqali boshqa barcha ildizlarni hosil qilishi).
Xuddi shu xossalar modul arifmetikasidagi birlikning $n$-darajali ildizlari uchun ham bajariladi.
Tub maydonda birlikning $n$-darajali ildizi deb quyidagilarni qanoatlantiradigan $w_n$ songa aytiladi:

$$\begin{align}
(w_n)^n &= 1 \pmod{p}, \\
(w_n)^k &\ne 1 \pmod{p}, \quad 1 \le k < n.
\end{align}$$

Qolgan $n-1$ ta ildiz $w_n$ ning darajalari sifatida olinadi.
Tez Fourier almashtirishi algoritmida foydalanish uchun ikkining darajasi bo‘lgan biror $n$ uchun va barcha kichikroq ikkining darajalari uchun ildiz mavjud bo‘lishi kerak.
Quyidagi qiziqarli xossani ko‘rish mumkin:

$$\begin{align}
(w_n^2)^m = w_n^n &= 1 \pmod{p}, \quad \text{bu yerda } m = \frac{n}{2}\\
(w_n^2)^k = w_n^{2k} &\ne 1 \pmod{p}, \quad 1 \le k < m.
\end{align}$$

Demak, $w_n$ birlikning $n$-darajali ildizi bo‘lsa, $w_n^2$ birlikning $\frac{n}{2}$-darajali ildizidir.
Natijada ikkining barcha kichikroq darajalari uchun ham kerakli darajadagi ildizlar mavjud va ularni $w_n$ yordamida hisoblash mumkin.

Teskari DFT ni hisoblash uchun $w_n$ ning $w_n^{-1}$ teskarisi kerak.
Tub modul uchun esa teskari element har doim mavjud.
Shunday qilib, kompleks ildizlardan talab qiladigan barcha xossalar modul arifmetikasida ham mavjud — buning uchun $n$-darajali birlik ildizi mavjud bo‘ladigan yetarlicha katta $p$ modulini tanlash kifoya.
Masalan, $p = 7340033$ modul va $w_{2^{20}} = 5$ qiymatlarini olish mumkin.
Bu modul yetarli bo‘lmasa, boshqa juftlik topish kerak.
$p = c 2^k + 1$ ko‘rinishidagi modullar uchun ($p$ tub bo‘lsa) birlikning $2^k$-darajali ildizi doimo mavjudligidan foydalanish mumkin.
$p$ ning [primitive root](primitive-root.md) elementi $g$ bo‘lsa, $g^c$ shunday $2^k$-darajali birlik ildizi ekanini ko‘rsatish mumkin.

```{.cpp file=fft_implementation_modular_arithmetic}
const int mod = 7340033;
const int root = 5;
const int root_1 = 4404020;
const int root_pw = 1 << 20;

void fft(vector<int> & a, bool invert) {
    int n = a.size();

    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1)
            j ^= bit;
        j ^= bit;

        if (i < j)
            swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        int wlen = invert ? root_1 : root;
        for (int i = len; i < root_pw; i <<= 1)
            wlen = (int)(1LL * wlen * wlen % mod);
        for (int i = 0; i < n; i += len) {
            int w = 1;
            for (int j = 0; j < len / 2; j++) {
                int u = a[i+j], v = (int)(1LL * a[i+j+len/2] * w % mod);
                a[i+j] = u + v < mod ? u + v : u + v - mod;
                a[i+j+len/2] = u - v >= 0 ? u - v : u - v + mod;
                w = (int)(1LL * w * wlen % mod);
            }
        }
    }
    if (invert) {
        int n_1 = inverse(n, mod);
        for (int & x : a)
            x = (int)(1LL * x * n_1 % mod);
    }
}
```

Bu yerda `inverse` funksiyasi modul bo‘yicha teskari elementni hisoblaydi ([Modul bo‘yicha multiplikativ teskari element](module-inverse.md) maqolasiga qarang).
`mod`, `root`, `root_pw` konstantalari modul va ildizni belgilaydi, `root_1` esa `root` ning `mod` bo‘yicha teskari elementidir.
Amalda bu implementatsiya kompleks sonlardan foydalanuvchi implementatsiyadan sekinroq (modul amallari juda ko‘p bo‘lgani sababli), ammo kamroq xotira ishlatishi va yaxlitlash xatolarining yo‘qligi kabi afzalliklarga ega.

## Ixtiyoriy modul bilan ko‘paytirish

Bu yerda oldingi bo‘limdagi maqsadga erishmoqchimiz:
ikkita $A(x)$ va $B(x)$ ko‘phadni ko‘paytirib, koeffitsiyentlarni biror $M$ son bo‘yicha modulda hisoblash.
Sonlar nazariyasidagi almashtirish faqat muayyan tub sonlar uchun ishlaydi.
Modul kerakli ko‘rinishda bo‘lmasa nima qilamiz?

Bir yo‘l — $c 2^k + 1$ ko‘rinishidagi bir nechta turli tub son bo‘yicha NTT bajarib, so‘ng yakuniy koeffitsiyentlarni hisoblash uchun [Xitoy qoldiqlar teoremasi](chinese-remainder-theorem.md)ni qo‘llash.

Boshqa yo‘l — $A(x)$ va $B(x)$ ko‘phadlarning har birini ikkita kichikroq ko‘phadga ajratish:

$$\begin{align}
A(x) &= A_1(x) + A_2(x) \cdot C \\
B(x) &= B_1(x) + B_2(x) \cdot C
\end{align}$$

bu yerda $C \approx \sqrt{M}$.
U holda $A(x)$ va $B(x)$ ko‘paytmasi quyidagicha ifodalanadi:

$$A(x) \cdot B(x) = A_1(x) \cdot B_1(x) + \left(A_1(x) \cdot B_2(x) + A_2(x) \cdot B_1(x)\right)\cdot C + \left(A_2(x) \cdot B_2(x)\right)\cdot C^2$$

$A_1(x)$, $A_2(x)$, $B_1(x)$ va $B_2(x)$ ko‘phadlarning koeffitsiyentlari $\sqrt M$ dan kichik bo‘ladi, shuning uchun paydo bo‘ladigan barcha ko‘paytmalarning koeffitsiyentlari $M \cdot n$ dan kichik bo‘ladi; odatda bu sonlar standart suzuvchi nuqtali turlar bilan ishlash uchun yetarlicha kichik.
Demak, bu yondashuvda kichikroq koeffitsiyentli ko‘phadlar ko‘paytmalari oddiy FFT va teskari FFT orqali hisoblanadi, so‘ng asl ko‘paytma $O(n)$ vaqtda modul bo‘yicha qo‘shish va ko‘paytirish yordamida tiklanadi.

## Qo‘llanishlar

DFT bir qarashda ko‘phadlarni ko‘paytirishga umuman aloqasi yo‘qdek tuyuladigan juda ko‘p masalalarda ishlatilishi mumkin.

### Barcha mumkin bo‘lgan yig‘indilar

Bizga ikkita $a[]$ va $b[]$ massiv berilgan.
Barcha mumkin bo‘lgan $a[i] + b[j]$ yig‘indilarni va har bir yig‘indi necha marta hosil bo‘lishini topish kerak.

Masalan, $a = [1,~ 2,~ 3]$ va $b = [2,~ 4]$ uchun $3$ yig‘indi $1$ usulda, $4$ ham $1$ usulda, $5$ — $2$ usulda, $6$ — $1$ usulda va $7$ — $1$ usulda hosil bo‘ladi.
$a$ va $b$ massivlari uchun ikkita $A$ va $B$ ko‘phad quramiz.
Massiv elementlari ko‘phaddagi darajalar bo‘ladi ($a[i] \Rightarrow x^{a[i]}$), mos hadning koeffitsiyenti esa bu son massivda necha marta uchrashini ko‘rsatadi.

Bu ikki ko‘phadni $O(n \log n)$ vaqtda ko‘paytirib, $C$ ko‘phadni olamiz; undagi darajalar qaysi yig‘indilarni hosil qilish mumkinligini, koeffitsiyentlar esa ularning necha marta hosil bo‘lishini bildiradi.
Misolimizda:

$$(1 x^1 + 1 x^2 + 1 x^3) (1 x^2 + 1 x^4) = 1 x^3 + 1 x^4 + 2 x^5 + 1 x^6 + 1 x^7$$

### Barcha mumkin bo‘lgan skalyar ko‘paytmalar

Bizga uzunligi $n$ bo‘lgan ikkita $a[]$ va $b[]$ massiv berilgan.
$a$ ning $b$ ning har bir siklik siljishi bilan skalyar ko‘paytmasini hisoblash kerak.

Uzunligi $2n$ bo‘lgan ikkita yangi massiv tuzamiz:
$a$ ni teskari aylantirib, oxiriga $n$ ta nol qo‘shamiz.
$b$ ni esa shunchaki o‘ziga ulaymiz.
Bu ikki massivni ko‘phadlar sifatida ko‘paytirib, ko‘paytma $c$ ning $c[n-1],~ c[n],~ \dots,~ c[2n-2]$ koeffitsiyentlariga qarasak, quyidagini olamiz:

$$c[k] = \sum_{i+j=k} a[i] b[j]$$

$i \ge n$ bo‘lgan barcha $a[i] = 0$ ekanini hisobga olsak:

$$c[k] = \sum_{i=0}^{n-1} a[i] b[k-i]$$

Bu yig‘indi $a$ vektori bilan $b$ ning $(k - (n - 1))$-siklik chapga siljishining skalyar ko‘paytmasi ekanini ko‘rish oson.
Demak, shu koeffitsiyentlar masala javobidir va ularni hamon $O(n \log n)$ vaqtda oldik.
$c[2n-1]$ koeffitsiyent ham $n$-siklik siljishni beradi, ammo bu $0$-siklik siljishning o‘zi, shuning uchun uni javobda alohida ko‘rib chiqish shart emas.

### Ikki tasma

Bizga qiymatlari $0$ va $1$ dan iborat ikkita Boolean tasma (siklik massiv) $a$ va $b$ berilgan.
Birinchi tasmani ikkinchisiga shunday biriktirishning barcha usullarini topish kerakki, hech bir o‘rinda birinchi tasmaning $1$ qiymati ikkinchi tasmaning $1$ qiymati yoniga tushmasin.

Bu masala aslida oldingi masaladan deyarli farq qilmaydi.
Ikki tasmani biriktirish ikkinchi massivni siklik siljitishga teng; ikki massivning skalyar ko‘paytmasi $0$ bo‘lsa, tasmalarni biriktirish mumkin.

### Satrda namuna qidirish

Bizga kichik lotin harflaridan iborat ikkita satr: matn $T$ va namuna $P$ berilgan.
Namunani matnda uchraydigan barcha o‘rinlarni hisoblash kerak.

Har bir satr uchun ko‘phad tuzamiz ($T[i]$ va $P[i]$ alifbodagi $26$ harfga mos $0$ dan $25$ gacha bo‘lgan sonlar):

$$A(x) = a_0 x^0 + a_1 x^1 + \dots + a_{n-1} x^{n-1}, \quad n = |T|$$

bu yerda

$$a_i = \cos(\alpha_i) + i \sin(\alpha_i), \quad \alpha_i = \frac{2 \pi T[i]}{26}.$$

Va

$$B(x) = b_0 x^0 + b_1 x^1 + \dots + b_{m-1} x^{m-1}, \quad m = |P|$$

bu yerda

$$b_i = \cos(\beta_i) - i \sin(\beta_i), \quad \beta_i = \frac{2 \pi P[m-i-1]}{26}.$$

$P[m-i-1]$ ifodasi namunani aniq ravishda teskari aylantirishiga e’tibor bering.

Ikki ko‘phadning $C(x) = A(x) \cdot B(x)$ ko‘paytmasidagi $(m-1+i)$-koeffitsiyent namuna matnning $i$ o‘rnida uchrash-uchramasligini ko‘rsatadi:

$$c_{m-1+i} = \sum_{j = 0}^{m-1} a_{i+j} \cdot b_{m-1-j} = \sum_{j=0}^{m-1} \left(\cos(\alpha_{i+j}) + i \sin(\alpha_{i+j})\right) \cdot \left(\cos(\beta_j) - i \sin(\beta_j)\right)$$

bu yerda $\alpha_{i+j} = \frac{2 \pi T[i+j]}{26}$ va $\beta_j = \frac{2 \pi P[j]}{26}$.

Moslik mavjud bo‘lsa, $T[i+j] = P[j]$ va demak $\alpha_{i+j} = \beta_j$.
Pifagorning trigonometrik ayniyatidan foydalanib quyidagini olamiz:

$$\begin{align}
c_{m-1+i} &= \sum_{j = 0}^{m-1}  \left(\cos(\alpha_{i+j}) + i \sin(\alpha_{i+j})\right) \cdot \left(\cos(\alpha_{i+j}) - i \sin(\alpha_{i+j})\right) \\
&= \sum_{j = 0}^{m-1} \cos(\alpha_{i+j})^2 + \sin(\alpha_{i+j})^2 = \sum_{j = 0}^{m-1} 1 = m.
\end{align}$$

Moslik bo‘lmasa, kamida bitta belgi farq qiladi; natijada ko‘paytmalardan kamida bittasi $a_{i+j} \cdot b_{m-1-j}$ birga teng bo‘lmaydi va $c_{m-1+i} \ne m$ kelib chiqadi.

### Joker belgili satrda namuna qidirish

Bu oldingi masalaning kengaytmasidir.
Bu safar namuna istalgan harfga mos keladigan `*` joker belgisini o‘z ichiga olishi mumkin.
Masalan, $a*c$ namunasi $abccaacc$ matnida aynan uch o‘rinda: $0$, $4$ va $5$ indekslarda uchraydi.
Xuddi shu ko‘phadlarni tuzamiz, faqat $P[m-i-1] = *$ bo‘lsa, $b_i = 0$ deb olamiz.
$P$ dagi joker belgilar soni $x$ bo‘lsa, $c_{m-1+i} = m - x$ bo‘lgan taqdirdagina $P$ namunasi $T$ matnining $i$ indeksida uchraydi.

## Mashq masalalari

- [SPOJ - POLYMUL](http://www.spoj.com/problems/POLYMUL/)
- [SPOJ - MAXMATCH](http://www.spoj.com/problems/MAXMATCH/)
- [SPOJ - ADAMATCH](http://www.spoj.com/problems/ADAMATCH/)
- [Codeforces - Yet Another String Matching Problem](http://codeforces.com/problemset/problem/954/I)
- [Codeforces - Lightsabers (hard)](http://codeforces.com/problemset/problem/958/F3)
- [Codeforces - Running Competition](https://codeforces.com/contest/1398/problem/G)
- [Kattis - A+B Problem](https://open.kattis.com/problems/aplusb)
- [Kattis - K-Inversions](https://open.kattis.com/problems/kinversions)
- [Codeforces - Dasha and cyclic table](http://codeforces.com/contest/754/problem/E)
- [CodeChef - Expected Number of Customers](https://www.codechef.com/COOK112A/problems/MMNN01)
- [CodeChef - Power Sum](https://www.codechef.com/SEPT19A/problems/PSUM)
- [Codeforces - Centroid Probabilities](https://codeforces.com/problemset/problem/1667/E)
