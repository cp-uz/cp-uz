---
article_id: algebra--polynomial
---
# Ko‘phadlar va qatorlar ustidagi amallar

Musobaqa dasturlashidagi masalalar, ayniqsa qandaydir obyektlarni sanashga oid masalalar, ko‘pincha masalani ko‘phadlar va formal darajali qatorlar ustida biror narsani hisoblashga keltirish orqali yechiladi.

Bunga ko‘phadlarni ko‘paytirish, interpolyatsiya va ko‘phad logarifmi hamda eksponentasi kabi murakkabroq tushunchalar kiradi. Ushbu maqolada bunday amallar va ularni bajarishning keng tarqalgan yondashuvlari haqida qisqacha umumiy ma’lumot beriladi.
## Asosiy tushunchalar va faktlar

Ushbu bo‘limda turli ko‘phad amallarining ta’riflari va “intuitiv” xossalariga ko‘proq e’tibor qaratamiz. Ularni amalga oshirishning texnik tafsilotlari va murakkabliklari keyingi bo‘limlarda ko‘rib chiqiladi.
### Ko‘phadlarni ko‘paytirish

!!! info "Ta’rif"
	**Bir o‘zgaruvchili ko‘phad** — $A(x) = a_0 + a_1 x + \dots + a_n x^n$ ko‘rinishidagi ifodadir.
$a_0, \dots, a_n$ qiymatlar ko‘phad koeffitsiyentlari bo‘lib, odatda qandaydir sonlar yoki songa o‘xshash tuzilmalar to‘plamidan olinadi. Ushbu maqolada koeffitsiyentlar biror [maydon](https://en.wikipedia.org/wiki/Field_(mathematics))dan olinadi deb faraz qilamiz. Bu ular uchun qo‘shish, ayirish, ko‘paytirish va bo‘lish amallari (0 ga bo‘lishdan tashqari) yaxshi aniqlanganini va ular umuman olganda haqiqiy sonlarga o‘xshash xususiyatlarga ega ekanini anglatadi.
Bunday maydonga odatiy misol — tub $p$ modul bo‘yicha qoldiqlar maydoni.
Soddalik uchun bundan buyon _bir o‘zgaruvchili_ atamasini tushirib qoldiramiz, chunki maqolada faqat shu turdagi ko‘phadlarni ko‘rib chiqamiz. Kontekstdan tushunarli bo‘ladigan joylarda $A(x)$ o‘rniga $A$ deb ham yozamiz. $a_n \neq 0$ yoki $A(x)=0$ deb faraz qilinadi.

!!! info "Ta’rif"
	Ikki ko‘phadning **ko‘paytmasi** ularni arifmetik ifoda sifatida yoyish orqali aniqlanadi:
	$$
	A(x) B(x) = \left(\sum\limits_{i=0}^n a_i x^i \right)\left(\sum\limits_{j=0}^m b_j x^j\right) = \sum\limits_{i,j} a_i b_j x^{i+j} = \sum\limits_{k=0}^{n+m} c_k x^k = C(x).
	$$

	$C(x)$ koeffitsiyentlarining $c_0, c_1, \dots, c_{n+m}$ ketma-ketligi $a_0, \dots, a_n$ va $b_0, \dots, b_m$ ketma-ketliklarning **konvolyutsiyasi** deyiladi.

!!! info "Ta’rif"
	$a_n \neq 0$ bo‘lgan $A$ ko‘phadning **darajasi** $\deg A = n$ deb aniqlanadi.

	Moslik uchun $A(x) = 0$ ko‘phadning darajasi $\deg A = -\infty$ deb belgilanadi.
Ushbu belgilashda istalgan $A$ va $B$ ko‘phadlar uchun $\deg AB = \deg A + \deg B$.

Konvolyutsiyalar ko‘plab sanash masalalarini yechishning asosini tashkil etadi.

!!! example "Misol"
	Sizda birinchi turdagi $n$ ta va ikkinchi turdagi $m$ ta obyekt bor.

	Birinchi tur obyektlarning qiymatlari $a_1, \dots, a_n$, ikkinchi tur obyektlarning qiymatlari esa $b_1, \dots, b_m$.

	Birinchi turdan bitta va ikkinchi turdan bitta obyekt tanlaysiz. Ularning umumiy qiymati $k$ bo‘lishining nechta usuli bor?
??? hint "Yechim"
	$(x^{a_1} + \dots + x^{a_n})(x^{b_1} + \dots + x^{b_m})$ ko‘paytmani ko‘rib chiqing. Uni yoysangiz, har bir monom $(a_i, b_j)$ juftlikka mos keladi va $x^{a_i+b_j}$ oldidagi koeffitsiyentga hissa qo‘shadi. Boshqacha aytganda, javob ko‘paytmadagi $x^k$ oldidagi koeffitsiyentdir.

!!! example "Misol"
	Olti yoqli kubikni $n$ marta tashlaysiz va barcha tashlashlar natijalarini qo‘shasiz. Yig‘indi $k$ chiqish ehtimoli qancha?
??? hint "Yechim"
	Javob yig‘indisi $k$ bo‘lgan natijalar sonining barcha mumkin bo‘lgan natijalar soniga, ya’ni $6^n$ ga nisbatidir.

	Yig‘indisi $k$ bo‘lgan natijalar soni nechta? $n=1$ uchun uni $A(x) = x^1+x^2+\dots+x^6$ ko‘phad bilan ifodalash mumkin.

	$n=2$ uchun yuqoridagi misoldagi yondashuvdan foydalanib, u $(x^1+x^2+\dots+x^6)^2$ ko‘phad bilan ifodalanishini olamiz.
	Demak, masalaning javobi $(x^1+x^2+\dots+x^6)^n$ ko‘phadning $k$-koeffitsiyentini $6^n$ ga bo‘lish orqali topiladi.

$A(x)$ ko‘phaddagi $x^k$ oldidagi koeffitsiyent qisqacha $[x^k]A$ deb belgilanadi.
### Formal darajali qatorlar

!!! info "Ta’rif"
	**Formal darajali qator** — yaqinlashish xossalaridan qat’i nazar ko‘rib chiqiladigan $A(x) = a_0 + a_1 x + a_2 x^2 + \dots$ cheksiz yig‘indidir.

Boshqacha aytganda, masalan, $1+\frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\dots=2$ yig‘indini ko‘rib chiqqanimizda, hadlar soni cheksizlikka intilganda uning $2$ ga _yaqinlashishini_ nazarda tutamiz. Formal qatorlar esa faqat ularni tashkil etuvchi ketma-ketliklar nuqtayi nazaridan ko‘rib chiqiladi.
!!! info "Ta’rif"
	$A(x)$ va $B(x)$ formal darajali qatorlarning **ko‘paytmasi** ham ularni arifmetik ifoda sifatida yoyish orqali aniqlanadi:


	$$
	A(x) B(x) = \left(\sum\limits_{i=0}^\infty a_i x^i \right)\left(\sum\limits_{j=0}^\infty b_j x^j\right) = \sum\limits_{i,j} a_i b_j x^{i+j} = \sum\limits_{k=0}^{\infty} c_k x^k = C(x),
	$$

	bunda $c_0, c_1, \dots$ koeffitsiyentlar chekli yig‘indilar sifatida aniqlanadi:

	$$
	c_k = \sum\limits_{i=0}^k a_i b_{k-i}.
	$$
	$c_0, c_1, \dots$ ketma-ketligi $a_0, a_1, \dots$ va $b_0, b_1, \dots$ ketma-ketliklarning **konvolyutsiyasi** deb ham ataladi; bu tushunchani cheksiz ketma-ketliklarga umumlashtiradi.

Shunday qilib, ko‘phadlarni formal darajali qatorlarning koeffitsiyentlari soni chekli bo‘lgan xususiy holi deb qarash mumkin.
Formal darajali qatorlar sanash kombinatorikasida muhim rol o‘ynaydi; u yerda ular turli ketma-ketliklarning [hosil qiluvchi funksiyalari](https://en.wikipedia.org/wiki/Generating_function) sifatida o‘rganiladi. Hosil qiluvchi funksiyalar va ularning ortidagi intuitiv g‘oyani batafsil tushuntirish, afsuski, ushbu maqola doirasidan tashqarida. Qiziqqan o‘quvchi ularning kombinatorik ma’nosi haqida, masalan, [bu yerda](https://codeforces.com/blog/entry/103979) batafsil o‘qishi mumkin.
Biroq juda qisqacha shuni aytamizki, agar $A(x)$ va $B(x)$ o‘zlaridagi “atomlar” soni bo‘yicha qandaydir obyektlarni (masalan, daraxtlarni uchlar soni bo‘yicha) sanaydigan ketma-ketliklarning hosil qiluvchi funksiyalari bo‘lsa, $A(x) B(x)$ ko‘paytma $A$ va $B$ turidagi obyektlar juftligi sifatida tasvirlanadigan obyektlarni juftlikdagi jami “atomlar” soni bo‘yicha sanaydi.
!!! example "Misol"
	$A(x) = \sum\limits_{i=0}^\infty 2^i x^i$ har bir toshi 2 rangdan biriga bo‘yalgan toshlar paketlarini sanasin (demak, o‘lchami $i$ bo‘lgan shunday $2^i$ ta paket bor), $B(x) = \sum\limits_{j=0}^{\infty} 3^j x^j$ esa har bir toshi 3 rangdan biriga bo‘yalgan paketlarni sanasin.
U holda $C(x) = A(x) B(x) = \sum\limits_{k=0}^\infty c_k x^k$ dagi $c_k$ “ikki tosh paketi: birinchi paket faqat $A$ turidagi toshlardan, ikkinchi paket faqat $B$ turidagi toshlardan iborat va ikkala paketdagi jami toshlar soni $k$” ko‘rinishida tasvirlanadigan obyektlarni sanaydi.
Shunga o‘xshash tarzda, formal darajali qatorlar ustidagi ayrim boshqa funksiyalarning ham intuitiv ma’nosi bor.
### Ko‘phadlarni ustun usulida bo‘lish

Butun sonlardagi kabi, ko‘phadlar uchun ham ustun usulida bo‘lishni aniqlash mumkin.

!!! info "Ta’rif"

	Istalgan $A$ va $B \neq 0$ ko‘phadlar uchun $A$ ni

	$$
	A = D \cdot B + R,~ \deg R < \deg B,
	$$

	ko‘rinishida ifodalash mumkin. Bunda $R$ — $A$ ning $B$ modul bo‘yicha **qoldig‘i**, $D$ esa **bo‘linma** deyiladi.
$\deg A = n$ va $\deg B = m$ deb belgilaylik. Sodda usul — ustun usulida bo‘lish: $A$ ning darajasi $B$ ning darajasidan kichik bo‘lguncha $B$ ni $\frac{a_n}{b_m} x^{n - m}$ monomga ko‘paytirib, $A$ dan ayirasiz. Oxirida $A$ dan qolgan qism qoldiq (nomi ham shundan), jarayonda $B$ ni ko‘paytirgan ko‘phadlarning yig‘indisi esa bo‘linma bo‘ladi.
!!! info "Ta’rif"
	Agar $A$ va $B$ ning $C$ modul bo‘yicha qoldiqlari bir xil bo‘lsa, ular $C$ modul bo‘yicha **ekvivalent** deyiladi va

	$$
	A \equiv B \pmod{C}
	$$

	deb belgilanadi.

Ko‘phadlarni ustun usulida bo‘lish ko‘plab muhim xossalarga ega bo‘lgani uchun foydalidir:

- $A$ faqat va faqat $A \equiv 0 \pmod B$ bo‘lganda $B$ ning karralisidir.

- Bundan $A \equiv B \pmod C$ faqat va faqat $A-B$ $C$ ning karralisi bo‘lganda o‘rinli ekani kelib chiqadi.

- Xususan, $A \equiv B \pmod{C \cdot D}$ dan $A \equiv B \pmod{C}$ kelib chiqadi.
- Istalgan chiziqli $x-r$ ko‘phad uchun $A(x) \equiv A(r) \pmod{x-r}$.

- Bundan $A$ faqat va faqat $A(r)=0$ bo‘lganda $x-r$ ning karralisi ekani kelib chiqadi.

- Modul $x^k$ bo‘lganda $A \equiv a_0 + a_1 x + \dots + a_{k-1} x^{k-1} \pmod{x^k}$.
Formal darajali qatorlar uchun ustun usulida bo‘lishni to‘g‘ri aniqlab bo‘lmasligiga e’tibor bering. Buning o‘rniga $a_0 \neq 0$ bo‘lgan istalgan $A(x)$ uchun $A(x) A^{-1}(x) = 1$ shartni qanoatlantiradigan teskari formal darajali qator $A^{-1}(x)$ ni aniqlash mumkin. Bu fakt, o‘z navbatida, ko‘phadlarni ustun usulida bo‘lish natijasini hisoblash uchun ishlatilishi mumkin.
## Asosiy implementatsiya
[Bu yerda](https://cp-algorithms.github.io/cp-algorithms-aux/cp-algo/math/poly.hpp) ko‘phadlar algebrasining asosiy implementatsiyasini topishingiz mumkin.

U barcha sodda amallarni va boshqa bir nechta foydali metodlarni qo‘llab-quvvatlaydi. Asosiy sinf — koeffitsiyentlari `T` turida bo‘lgan ko‘phadlar uchun `poly<T>`.

Barcha `+`, `-`, `*`, `%` va `/` arifmetik amallari qo‘llab-quvvatlanadi; `%` va `/` Evklid bo‘lishidagi qoldiq va bo‘linmani anglatadi.
Tub `m` modul bo‘yicha qoldiqlar ustida arifmetik amallar bajarish uchun `modular<m>` sinfi ham mavjud.

Boshqa foydali funksiyalar:
- `deriv()`: $P(x)$ ning $P'(x)$ hosilasini hisoblaydi.
- `integr()`: $Q(0)=0$ bo‘ladigan $Q(x) = \int P(x)$ aniqmas integralni hisoblaydi.
- `inv(size_t n)`: $P^{-1}(x)$ ning dastlabki $n$ koeffitsiyentini $O(n \log n)$ vaqtda hisoblaydi.
- `log(size_t n)`: $\ln P(x)$ ning dastlabki $n$ koeffitsiyentini $O(n \log n)$ vaqtda hisoblaydi.
- `exp(size_t n)`: $\exp P(x)$ ning dastlabki $n$ koeffitsiyentini $O(n \log n)$ vaqtda hisoblaydi.
- `pow(size_t k, size_t n)`: $P^{k}(x)$ ning dastlabki $n$ koeffitsiyentini $O(n \log nk)$ vaqtda hisoblaydi.
- `deg()`: $P(x)$ ning darajasini qaytaradi.
- `lead()`: $x^{\deg P(x)}$ oldidagi koeffitsiyentni qaytaradi.
- `resultant(poly<T> a, poly<T> b)`: $a$ va $b$ ning rezultantini $O(|a| \cdot |b|)$ vaqtda hisoblaydi.
- `bpow(T x, size_t n)`: $x^n$ ni hisoblaydi.
- `bpow(T x, size_t n, T m)`: $x^n \pmod{m}$ ni hisoblaydi.
- `chirpz(T z, size_t n)`: $P(1), P(z), P(z^2), \dots, P(z^{n-1})$ ni $O(n \log n)$ vaqtda hisoblaydi.
- `vector<T> eval(vector<T> x)`: $P(x_1), \dots, P(x_n)$ ni $O(n \log^2 n)$ vaqtda hisoblaydi.
- `poly<T> inter(vector<T> x, vector<T> y)`: $P(x_i) = y_i$ juftliklar to‘plami bo‘yicha ko‘phadni $O(n \log^2 n)$ vaqtda interpolyatsiya qiladi.
- Yana boshqa imkoniyatlar ham bor — kodni bemalol o‘rganib chiqing!
## Arifmetika
### Ko‘paytirish

Eng asosiy amal — ikkita ko‘phadni ko‘paytirish. Ya’ni $A$ va $B$ ko‘phadlar berilgan bo‘lsin:

$$A = a_0 + a_1 x + \dots + a_n x^n$$

$$B = b_0 + b_1 x + \dots + b_m x^m$$

Quyidagicha aniqlanadigan $C = A \cdot B$ ko‘phadni hisoblash kerak:

$$\boxed{C = \sum\limits_{i=0}^n \sum\limits_{j=0}^m a_i b_j x^{i+j}}  = c_0 + c_1 x + \dots + c_{n+m} x^{n+m}.$$
Uni [tez Fourier almashtirishi](fft.md) yordamida $O(n \log n)$ vaqtda hisoblash mumkin; bu yerdagi deyarli barcha metodlar undan qism algoritm sifatida foydalanadi.
### Teskari qator

Agar $A(0) \neq 0$ bo‘lsa, $A^{-1} A = 1$ shartni qanoatlantiradigan $A^{-1}(x) = q_0+q_1 x + q_2 x^2 + \dots$ cheksiz formal darajali qator doimo mavjud. Ko‘pincha $A^{-1}$ ning dastlabki $k$ koeffitsiyentini (ya’ni uni $x^k$ modul bo‘yicha) hisoblash foydali bo‘ladi. Uni hisoblashning ikkita asosiy usuli mavjud.
#### Bo‘lib tashla va hukmronlik qil

Ushbu algoritm [Schönhage maqolasida](http://algo.inria.fr/seminars/sem00-01/schoenhage.pdf) tilga olingan va [Graeffe usulidan](https://en.wikipedia.org/wiki/Graeffe's_method) ilhomlangan. $B(x)=A(x)A(-x)$ uchun $B(x)=B(-x)$ o‘rinli ekani, ya’ni $B(x)$ juft ko‘phad ekani ma’lum. Bu uning faqat juft indeksli koeffitsiyentlari noldan farqli ekanini va $B(x)=T(x^2)$ ko‘rinishida ifodalanishini anglatadi. Demak, quyidagi o‘tishni bajarishimiz mumkin:
$$A^{-1}(x) \equiv \frac{1}{A(x)} \equiv \frac{A(-x)}{A(x)A(-x)} \equiv \frac{A(-x)}{T(x^2)} \pmod{x^k}$$

$T(x)$ ni bitta ko‘paytirish bilan hisoblash mumkinligiga e’tibor bering; undan keyin uning teskari qatorining faqat birinchi yarmidagi koeffitsiyentlar kerak bo‘ladi. Shunday qilib, $A^{-1} \pmod{x^k}$ ni hisoblashning boshlang‘ich masalasi $T^{-1} \pmod{x^{\lceil k / 2 \rceil}}$ ni hisoblashga keltiriladi.

Ushbu usulning murakkabligini

$$T(n) = T(n/2) + O(n \log n) = O(n \log n)$$

deb baholash mumkin.
#### Sieveking–Kung algoritmi

Bu yerda tasvirlanadigan umumiy jarayon Hensel lemmasidan kelib chiqqani uchun Hensel ko‘tarishi deb ataladi. Uni quyida batafsilroq ko‘rib chiqamiz, hozir esa maxsus yechimga e’tibor qaratamiz. Bu yerdagi “ko‘tarish” shuni anglatadiki, $A^{-1} \pmod x$ bo‘lgan $B_0=q_0=a_0^{-1}$ yaqinlashuvdan boshlaymiz va keyin $\bmod x^a$ dan $\bmod x^{2a}$ ga iterativ ravishda ko‘tarib boramiz.
$B_k \equiv A^{-1} \pmod{x^a}$ bo‘lsin. Keyingi yaqinlashuv $A B_{k+1} \equiv 1 \pmod{x^{2a}}$ tenglamani qanoatlantirishi kerak va uni $B_{k+1} = B_k + x^a C$ ko‘rinishida ifodalash mumkin. Bundan

$$A(B_k + x^{a}C) \equiv 1 \pmod{x^{2a}}$$

tenglama kelib chiqadi.

$A B_k \equiv 1 + x^a D \pmod{x^{2a}}$ bo‘lsin. U holda yuqoridagi tenglama

$$x^a(D+AC) \equiv 0 \pmod{x^{2a}} \implies D \equiv -AC \pmod{x^a} \implies C \equiv -B_k D \pmod{x^a}$$

ni beradi.

Bundan yakuniy formulani olish mumkin:
$$x^a C \equiv -B_k x^a D  \equiv B_k(1-AB_k) \pmod{x^{2a}} \implies \boxed{B_{k+1} \equiv B_k(2-AB_k) \pmod{x^{2a}}}$$

Shunday qilib, $B_0 \equiv a_0^{-1} \pmod x$ dan boshlab $AB_k \equiv 1 \pmod{x^{2^k}}$ shartni qanoatlantiradigan $B_k$ ketma-ketlikni

$$T(n) = T(n/2) + O(n \log n) = O(n \log n)$$

murakkablikda hisoblaymiz.
Bu yerdagi algoritm birinchi algoritmdan biroz murakkabroq ko‘rinishi mumkin, ammo uning juda mustahkam va amaliy asosi hamda boshqa nuqtayi nazardan qaralganda katta umumlashtirish imkoniyati bor; bu quyida tushuntiriladi.
### Evklid bo‘lishi

Darajalari $n$ va $m$ bo‘lgan $A(x)$ hamda $B(x)$ ko‘phadlarni ko‘rib chiqamiz. Yuqorida aytilganidek, $A(x)$ ni

$$A(x) = B(x) D(x) + R(x), \deg R < \deg B$$

ko‘rinishda qayta yozish mumkin.

$n \geq m$ bo‘lsin. Bundan $\deg D = n - m$ ekani va $A$ ning katta darajali $n-m+1$ ta koeffitsiyenti $R$ ga ta’sir qilmasligi kelib chiqadi. Demak, buni tenglamalar sistemasi sifatida qarab, $A(x)$ va $B(x)$ ning eng katta darajali $n-m+1$ ta koeffitsiyentidan $D(x)$ ni tiklash mumkin.
Biz nazarda tutayotgan chiziqli tenglamalar sistemasi quyidagi ko‘rinishda yoziladi:

$$\begin{bmatrix} a_n \\ \vdots \\ a_{m+1} \\ a_{m} \end{bmatrix} = \begin{bmatrix}
b_m & \dots & 0 & 0 \\
\vdots & \ddots & \vdots & \vdots \\
\dots & \dots & b_m & 0 \\
\dots & \dots & b_{m-1} & b_m
\end{bmatrix} \begin{bmatrix}d_{n-m} \\ \vdots \\ d_1 \\ d_0\end{bmatrix}$$

Ko‘rinishidan shuni xulosa qilish mumkinki, teskari yozilgan ko‘phadlarni
$$A^R(x) = x^nA(x^{-1})= a_n + a_{n-1} x + \dots + a_0 x^n$$

$$B^R(x) = x^m B(x^{-1}) = b_m + b_{m-1} x + \dots + b_0 x^m$$

$$D^R(x) = x^{n-m}D(x^{-1}) = d_{n-m} + d_{n-m-1} x + \dots + d_0 x^{n-m}$$

kiritgach, sistemani

$$A^R(x) \equiv B^R(x) D^R(x) \pmod{x^{n-m+1}}$$

ko‘rinishda qayta yozish mumkin.

Bundan $D(x)$ ning barcha koeffitsiyentlarini bir qiymatli tarzda tiklash mumkin:

$$\boxed{D^R(x) \equiv A^R(x) (B^R(x))^{-1} \pmod{x^{n-m+1}}}$$

Bundan esa, o‘z navbatida, $R(x) = A(x) - B(x)D(x)$ formula orqali $R(x)$ ni tiklash mumkin.
Yuqoridagi matritsa uchburchak [Toeplitz matritsa](https://en.wikipedia.org/wiki/Toeplitz_matrix) deb atalishiga e’tibor bering. Bu yerda ko‘rib turganimizdek, ixtiyoriy Toeplitz matritsali chiziqli tenglamalar sistemasini yechish aslida ko‘phadni teskarilashga ekvivalent. Bundan tashqari, uning teskari matritsasi ham uchburchak Toeplitz matritsa bo‘ladi va yuqoridagi atamalar bilan aytganda, uning elementlari $(B^R(x))^{-1} \pmod{x^{n-m+1}}$ ning koeffitsiyentlaridir.
## Ko‘phad funksiyalarini hisoblash
### Newton usuli

Sieveking–Kung algoritmini umumlashtiramiz. $P(x)$ ko‘phad bo‘lishi kerak bo‘lgan $F(P) = 0$ tenglamani ko‘rib chiqamiz; bunda $F(x)$ quyidagicha aniqlangan ko‘phad qiymatli funksiya:

$$F(x) = \sum\limits_{i=0}^\infty \alpha_i (x-\beta)^i,$$

bunda $\beta$ — qandaydir o‘zgarmas. Yangi formal $y$ o‘zgaruvchini kiritsak, $F(x)$ ni

$$F(x) = F(y) + (x-y)F'(y) + (x-y)^2 G(x,y)$$

ko‘rinishda ifodalash mumkinligini isbotlash mumkin. Bunda $F'(x)$ quyidagicha aniqlangan hosila formal darajali qatoridir:
$$F'(x) = \sum\limits_{i=0}^\infty (i+1)\alpha_{i+1}(x-\beta)^i,$$

$G(x, y)$ esa $x$ va $y$ ning qandaydir formal darajali qatori. Bu natija yordamida yechimni iterativ ravishda topish mumkin.

$F(Q_k) \equiv 0 \pmod{x^{a}}$ bo‘lsin. $F(Q_{k+1}) \equiv 0 \pmod{x^{2a}}$ bo‘ladigan $Q_{k+1} \equiv Q_k + x^a C \pmod{x^{2a}}$ ni topishimiz kerak.

Yuqoridagi formulaga $x = Q_{k+1}$ va $y=Q_k$ ni qo‘yib,

$$F(Q_{k+1}) \equiv F(Q_k) + (Q_{k+1} - Q_k) F'(Q_k) + (Q_{k+1} - Q_k)^2 G(x, y) \pmod x^{2a}$$

ni olamiz.
$Q_{k+1} - Q_k \equiv 0 \pmod{x^a}$ bo‘lgani uchun $(Q_{k+1} - Q_k)^2 \equiv 0 \pmod{x^{2a}}$ ham o‘rinli. Demak,

$$0 \equiv F(Q_{k+1}) \equiv F(Q_k) + (Q_{k+1} - Q_k) F'(Q_k) \pmod{x^{2a}}.$$

Oxirgi formula $Q_{k+1}$ ning qiymatini beradi:

$$\boxed{Q_{k+1} = Q_k - \dfrac{F(Q_k)}{F'(Q_k)} \pmod{x^{2a}}}$$

Shunday qilib, ko‘phadlarni teskarilash va $F(Q_k)$ ni hisoblashni bilsak, $P$ ning $n$ ta koeffitsiyentini

$$T(n) = T(n/2) + f(n)$$

murakkablikda topishimiz mumkin. Bu yerda $f(n)$ — odatda $O(n \log n)$ bo‘ladigan $F(Q_k)$ va $F'(Q_k)^{-1}$ ni hisoblash vaqti.

Yuqoridagi iterativ qoida sonli analizda [Newton usuli](https://en.wikipedia.org/wiki/Newton%27s_method) deb ataladi.
#### Hensel lemmasi

Yuqorida aytilganidek, formal va umumiy ko‘rinishda bu natija [Hensel lemmasi](https://en.wikipedia.org/wiki/Hensel%27s_lemma) deb ataladi. Ichma-ich halqalar ketma-ketligi bilan ishlaganimizda undan yanada kengroq ma’noda foydalanish mumkin. Ushbu xususiy holatda biz $x$, $x^2$, $x^3$ va hokazo modullar bo‘yicha ko‘phad qoldiqlari ketma-ketligi bilan ishladik.
Hensel ko‘tarishi foydali bo‘ladigan yana bir misol — [p-adik sonlar](https://en.wikipedia.org/wiki/P-adic_number). U yerda aslida $p$, $p^2$, $p^3$ va hokazo modullar bo‘yicha butun son qoldiqlari ketma-ketligi bilan ishlaymiz. Masalan, Newton usuli yordamida berilgan sanoq tizimi uchun barcha mumkin bo‘lgan [avtomorf sonlarni](https://en.wikipedia.org/wiki/Automorphic_number) (kvadrati o‘zining o‘zi bilan tugaydigan sonlarni) topish mumkin. Bu masala o‘quvchiga mashq sifatida qoldiriladi.
Yechimingiz 10 asosli sonlar uchun ishlashini tekshirish uchun [ushbu](https://acm.timus.ru/problem.aspx?space=1&num=1698) masalani ko‘rib chiqishingiz mumkin.
### Logarifm

$\ln P(x)$ funksiya uchun quyidagi tenglik ma’lum:

$$
\boxed{(\ln P(x))' = \dfrac{P'(x)}{P(x)}}
$$

Demak, $\ln P(x)$ ning $n$ ta koeffitsiyentini $O(n \log n)$ vaqtda hisoblash mumkin.


### Teskari qator

Ma’lum bo‘lishicha, Newton usuli orqali $A^{-1}$ formulasini olishimiz mumkin.
Buning uchun $A=Q^{-1}$ tenglamani olamiz. U holda:

$$F(Q) = Q^{-1} - A$$

$$F'(Q) = -Q^{-2}$$

$$\boxed{Q_{k+1} \equiv Q_k(2-AQ_k) \pmod{x^{2^{k+1}}}}$$
### Eksponenta

$e^{P(x)}=Q(x)$ ni hisoblashni o‘rganamiz. $\ln Q = P$ bo‘lishi kerak, demak:

$$F(Q) = \ln Q - P$$

$$F'(Q) = Q^{-1}$$

$$\boxed{Q_{k+1} \equiv Q_k(1 + P - \ln Q_k) \pmod{x^{2^{k+1}}}}$$
### $k$-daraja { data-toc-label="k-daraja" }

Endi $P^k(x)=Q$ ni hisoblashimiz kerak. Buni quyidagi formula orqali bajarish mumkin:

$$Q = \exp\left[k \ln P(x)\right]$$

Biroq logarifm va eksponentani faqat qandaydir boshlang‘ich $Q_0$ ni topa olsangizgina to‘g‘ri hisoblash mumkinligiga e’tibor bering.

Uni topish uchun ko‘phadning o‘zgarmas koeffitsiyenti logarifmi yoki eksponentasini hisoblash kerak.
Ammo buni oqilona bajarishning yagona holati: $Q = \ln P$ uchun $P(0)=1$ bo‘lib, $Q(0)=0$ chiqishi; $Q = e^P$ uchun esa $P(0)=0$ bo‘lib, $Q(0)=1$ chiqishidir.

Shuning uchun yuqoridagi formuladan faqat $P(0) = 1$ bo‘lganda foydalanish mumkin. Aks holda, agar $P(x) = \alpha x^t T(x)$ va $T(0)=1$ bo‘lsa, quyidagicha yozish mumkin:

$$\boxed{P^k(x) = \alpha^kx^{kt} \exp[k \ln T(x)]}$$

Agar $\sqrt[k]{\alpha}$ ni, masalan, $\alpha=1$ uchun hisoblay olsangiz, ko‘phadning qandaydir $k$-ildizini ham hisoblash mumkinligiga e’tibor bering.
## Qiymatlarni hisoblash va interpolyatsiya
### Chirp-z almashtirishi

Ko‘phad qiymatini $x_r = z^{2r}$ nuqtalarda hisoblash kerak bo‘lgan xususiy holatda quyidagini bajarish mumkin:

$$A(z^{2r}) = \sum\limits_{k=0}^n a_k z^{2kr}$$

$2kr = r^2+k^2-(r-k)^2$ ni qo‘yamiz. Shunda bu yig‘indi quyidagicha qayta yoziladi:

$$\boxed{A(z^{2r}) = z^{r^2}\sum\limits_{k=0}^n (a_k z^{k^2}) z^{-(r-k)^2}}$$

Bu $z^{r^2}$ ko‘paytuvchigacha $u_k = a_k z^{k^2}$ va $v_k = z^{-k^2}$ ketma-ketliklar konvolyutsiyasiga teng.
Bu yerda $u_k$ indekslari $0$ dan $n$ gacha, $v_k$ indekslari esa $-n$ dan $m$ gacha ekaniga e’tibor bering; bunda $m$ — sizga kerak bo‘lgan $z$ ning eng katta darajasi.

Endi ko‘phad qiymatini $x_r = z^{2r+1}$ nuqtalarda hisoblash kerak bo‘lsa, $a_k \to a_k z^k$ almashtirish orqali uni avvalgi masalaga keltirish mumkin.

Bu $z$ ning darajalaridagi qiymatlarni hisoblash uchun $O(n \log n)$ algoritm beradi; shu tariqa ikkining darajasi bo‘lmagan o‘lchamlar uchun ham DFT hisoblash mumkin.
Yana bir kuzatuv: $kr = \binom{k+r}{2} - \binom{k}{2} - \binom{r}{2}$. U holda

$$\boxed{A(z^r) = z^{-\binom{r}{2}}\sum\limits_{k=0}^n \left(a_k z^{-\binom{k}{2}}\right)z^{\binom{k+r}{2}}}$$
$A_0(x) = \sum\limits_{k=0}^n a_{n-k}z^{-\binom{n-k}{2}}x^k$ va $A_1(x) = \sum\limits_{k\geq 0}z^{\binom{k}{2}}x^k$ ko‘phadlar ko‘paytmasidagi $x^{n+r}$ oldidagi koeffitsiyent $z^{\binom{r}{2}}A(z^r)$ ga teng. $A_0(x)$ va $A_1(x)$ koeffitsiyentlarini hisoblash uchun $z^{\binom{k+1}{2}}=z^{\binom{k}{2}+k}$ formuladan foydalanish mumkin.
### Ko‘p nuqtada qiymat hisoblash
$A(x_1), \dots, A(x_n)$ ni hisoblash kerak deb faraz qilaylik. Yuqorida aytilganidek, $A(x) \equiv A(x_i) \pmod{x-x_i}$. Shuning uchun quyidagilarni bajarish mumkin:
1. Har bir $[l,r)$ segmentda $P_{l, r}(x) = (x-x_l)(x-x_{l+1})\dots(x-x_{r-1})$ ko‘paytma saqlanadigan segment daraxtini hisoblang.
2. Ildiz tugunda $l=1$ va $r=n+1$ dan boshlang. $m=\lfloor(l+r)/2\rfloor$ bo‘lsin. $A(x) \pmod{P_{l,m}(x)}$ ko‘phad bilan $[l,m)$ ga pastga tushing.
3. Bu rekursiv ravishda $A(x_l), \dots, A(x_{m-1})$ ni hisoblaydi. Endi $A(x) \pmod{P_{m,r}(x)}$ bilan $[m,r)$ uchun ham xuddi shuni bajaring.
4. Birinchi va ikkinchi rekursiv chaqiriq natijalarini birlashtirib, qaytaring.
Butun jarayon $O(n \log^2 n)$ vaqtda ishlaydi.
### Interpolyatsiya

$(x_i, y_i)$ juftliklar to‘plami berilganda ko‘phadni interpolyatsiya qilish uchun Lagrangening bevosita formulasi mavjud:

$$\boxed{A(x) = \sum\limits_{i=1}^n y_i \prod\limits_{j \neq i}\dfrac{x-x_j}{x_i - x_j}}$$

Uni bevosita hisoblash qiyin, ammo bo‘lib tashla va hukmronlik qil yondashuvi bilan $O(n \log^2 n)$ vaqtda hisoblash mumkin ekan:

$P(x) = (x-x_1)\dots(x-x_n)$ ni ko‘rib chiqamiz. $A(x)$ dagi maxrajlarning koeffitsiyentlarini bilish uchun quyidagi kabi ko‘paytmalarni hisoblashimiz kerak:
$$
P_i = \prod\limits_{j \neq i} (x_i-x_j)
$$

Ammo $P'(x)$ hosilani ko‘rib chiqsangiz, $P'(x_i) = P_i$ ekanini ko‘rasiz. Demak, qiymat hisoblash orqali $P_i$ larni $O(n \log^2 n)$ vaqtda topish mumkin.

Endi ko‘p nuqtada qiymat hisoblashdagi segment daraxtining o‘zida ishlaydigan rekursiv algoritmni ko‘rib chiqamiz. U barglarda har bir barg uchun $\dfrac{y_i}{P_i}$ qiymatidan boshlaydi.

Rekursiyadan qaytayotganda chap va o‘ng tugunlardan kelgan natijalarni $A_{l,r} = A_{l,m}P_{m,r} + P_{l,m} A_{m,r}$ sifatida birlashtirishimiz kerak.
Shu tariqa ildizga qaytganda unda aynan $A(x)$ hosil bo‘ladi.
Butun jarayon ham $O(n \log^2 n)$ vaqtda ishlaydi.
## EKUB va rezultantlar

$A(x) = a_0 + a_1 x + \dots + a_n x^n$ va $B(x) = b_0 + b_1 x + \dots + b_m x^m$ ko‘phadlar berilgan deb faraz qilamiz.

$\lambda_0, \dots, \lambda_n$ — $A(x)$ ning ildizlari, $\mu_0, \dots, \mu_m$ esa $B(x)$ ning ildizlari bo‘lsin; ildizlar o‘z karraliligi bilan hisoblangan.

$A(x)$ va $B(x)$ ning umumiy ildizi bor-yo‘qligini bilmoqchisiz. Buni aniqlashning o‘zaro bog‘liq ikkita usuli mavjud.
### Evklid algoritmi

Bu haqda allaqachon alohida [maqolamiz](euclid-algorithm.md) bor. Ixtiyoriy soha uchun Evklid algoritmini quyidagicha sodda yozish mumkin:

```cpp
template<typename T>
T gcd(const T &a, const T &b) {
	return b == T(0) ? a : gcd(b, a % b);
}
```

Ko‘phadlar $A(x)$ va $B(x)$ uchun u $O(nm)$ vaqtda ishlashini isbotlash mumkin.
### Rezultant

$A(\mu_0)\cdots A(\mu_m)$ ko‘paytmani hisoblaymiz. U faqat va faqat qandaydir $\mu_i$ $A(x)$ ning ildizi bo‘lganda nolga teng bo‘ladi.

Simmetriya uchun uni $b_m^n$ ga ham ko‘paytirib, butun ko‘paytmani quyidagi ko‘rinishda qayta yozishimiz mumkin:

$$\boxed{\mathcal{R}(A, B) = b_m^n\prod\limits_{j=0}^m A(\mu_j) = b_m^n a_m^n \prod\limits_{i=0}^n \prod\limits_{j=0}^m (\mu_j - \lambda_i)= (-1)^{mn}a_n^m \prod\limits_{i=0}^n B(\lambda_i)}$$
Yuqorida aniqlangan qiymat $A(x)$ va $B(x)$ ko‘phadlarning rezultanti deyiladi. Ta’rifdan quyidagi xossalarni olish mumkin:

1. $\mathcal R(A, B) = (-1)^{nm} \mathcal R(B, A)$.
2. $n=0$ yoki $m=0$ bo‘lganda $\mathcal R(A, B)= a_n^m b_m^n$.
3. Agar $b_m=1$ bo‘lsa, ixtiyoriy $C(x)$ ko‘phad va $n,m \geq 1$ uchun $\mathcal R(A - CB, B) = \mathcal R(A, B)$.
4. Bundan ixtiyoriy $A(x)$, $B(x)$, $C(x)$ uchun $\mathcal R(A, B) = b_m^{\deg(A) - \deg(A-CB)}\mathcal R(A - CB, B)$ kelib chiqadi.
Ajablanarlisi shundaki, bu ikki ko‘phadning rezultanti doimo ularning koeffitsiyentlari tegishli bo‘lgan halqaning o‘zidan ekanini anglatadi!

Bu xossalar rezultantni Evklid algoritmi bilan birga hisoblash imkonini ham beradi; bu $O(nm)$ vaqtda ishlaydi.

```cpp
template<typename T>
T resultant(poly<T> a, poly<T> b) {
	if(b.is_zero()) {
		return 0;
	} else if(b.deg() == 0) {
		return bpow(b.lead(), a.deg());
	} else {
		int pw = a.deg();
		a %= b;
		pw -= a.deg();
		base mul = bpow(b.lead(), pw) * base((b.deg() & a.deg() & 1) ? -1 : 1);
		base ans = resultant(b, a);
		return ans * mul;
	}
}
```
### Yarim-EKUB algoritmi

EKUB va rezultantlarni $O(n \log^2 n)$ vaqtda hisoblash usuli mavjud.

Buning uchun ishlatiladigan jarayon $a(x)$, $b(x)$ ko‘phadlar juftligini $\deg d(x) \leq \frac{\deg a(x)}{2}$ bo‘ladigan $c(x), d(x)$ juftligiga akslantiruvchi $2 \times 2$ chiziqli almashtirishni amalga oshiradi. Yetarlicha ehtiyotkor bo‘lsangiz, istalgan ko‘phadlar juftligining yarim-EKUBini kamida 2 marta kichik ko‘phadlar ustida ko‘pi bilan 2 ta rekursiv chaqiriq orqali hisoblash mumkin.
Algoritmning aniq tafsilotlarini tushuntirish biroz zerikarli, biroq uning implementatsiyasini kutubxonadagi `half_gcd` funksiyasida topishingiz mumkin.

Yarim-EKUB amalga oshirilgach, ko‘phadlar juftligi $\gcd(a, b)$ va $0$ ga kelguncha uni takroran qo‘llash mumkin.
## Masalalar

- [CodeChef - RNG](https://www.codechef.com/problems/RNG)
- [CodeForces - Basis Change](https://codeforces.com/gym/102129/problem/D)
- [CodeForces - Permutant](https://codeforces.com/gym/102129/problem/G)
- [CodeForces - Medium Hadron Collider](https://codeforces.com/gym/102129/problem/C)
