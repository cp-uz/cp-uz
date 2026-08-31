---
article_id: algebra--primitive-root
---
# Primitiv ildiz

## Ta’rif

Modul arifmetikasida $g$ soni, agar $n$ bilan o‘zaro tub bo‘lgan har bir son $n$ modul bo‘yicha $g$ ning biror darajasiga teng qoldiq bersa, `$n$ modul bo‘yicha primitiv ildiz` deb ataladi. Matematik tarzda, $g$ soni `$n$ modul bo‘yicha primitiv ildiz` bo‘lishi uchun va faqat shuning uchun $\gcd(a,n)=1$ bo‘lgan har qanday $a$ butun son uchun quyidagi tenglikni qanoatlantiradigan $k$ butun son mavjud bo‘lishi kerak:

$g^k \equiv a \pmod n$.
$k$ soni $a$ ning $g$ asos bo‘yicha $n$ moduldagi `indeksi` yoki `diskret logarifmi` deb ataladi. $g$ esa $n$ modul bo‘yicha butun sonlar multiplikativ guruhining `generatori` deb ham ataladi.

Xususan, $n$ tub son bo‘lgan holatda primitiv ildizning darajalari $1$ dan $n-1$ gacha bo‘lgan barcha sonlarni aylanib chiqadi.
## Mavjudlik

$n$ modul bo‘yicha primitiv ildiz faqat va faqat quyidagi hollarda mavjud:

* $n$ soni 1, 2 yoki 4 bo‘lsa; yoki
* $n$ toq tub sonning darajasi bo‘lsa $(n = p^k)$; yoki
* $n$ toq tub son darajasining ikki baravari bo‘lsa $(n = 2 \cdot p^k)$.

Bu teoremani Gauss 1801-yilda isbotlagan.
## Eyler funksiyasi bilan bog‘liqligi

$g$ soni $n$ modul bo‘yicha primitiv ildiz bo‘lsin. U holda $g^k \equiv 1 \pmod n$ tenglik bajariladigan eng kichik $k$ soni $\phi(n)$ ga tengligini ko‘rsatish mumkin. Bundan tashqari, teskarisi ham to‘g‘ri; ushbu maqolada aynan shu faktdan primitiv ildizni topishda foydalanamiz.

Bundan tashqari, agar $n$ modul bo‘yicha primitiv ildizlar mavjud bo‘lsa, ularning soni $\phi(\phi(n))$ ga teng.
## Primitiv ildizni topish algoritmi

Sodda algoritm $[1,n-1]$ oraliqdagi barcha sonlarni ko‘rib chiqadi. So‘ng ularning har biri primitiv ildiz ekanini tekshirish uchun barcha darajalarini hisoblab, ularning hammasi turlicha yoki yo‘qligini tekshiradi. Bu algoritm $O(g \cdot n)$ murakkablikka ega bo‘lib, juda sekin ishlaydi. Ushbu bo‘limda bir nechta mashhur teoremalardan foydalanuvchi tezroq algoritmni taklif qilamiz.

Oldingi bo‘limdan bilamizki, agar $g^k \equiv 1 \pmod n$ bajariladigan eng kichik $k$ soni $\phi(n)$ bo‘lsa, u holda $g$ primitiv ildizdir. Eyler teoremasiga ko‘ra, $n$ bilan o‘zaro tub bo‘lgan istalgan $a$ uchun $a^{\phi(n)} \equiv 1 \pmod n$. Shu sababli $g$ primitiv ildiz ekanini tekshirish uchun $\phi(n)$ dan kichik barcha $d$ lar uchun $g^d \not\equiv 1 \pmod n$ ekanini tekshirish kifoya. Ammo bu algoritm hamon juda sekin.

Lagrange teoremasidan istalgan sonning $n$ modul bo‘yicha 1 indeksining qiymati $\phi(n)$ ning bo‘luvchisi bo‘lishini bilamiz. Demak, $\phi(n)$ ning har bir xos bo‘luvchisi $d \mid \phi(n)$ uchun $g^d \not\equiv 1 \pmod n$ ekanini tekshirish yetarli. Bu allaqachon ancha tez algoritm, lekin uni yana yaxshilash mumkin.

$\phi(n)=p_1^{a_1}\cdots p_s^{a_s}$ ni tub ko‘paytuvchilarga ajratamiz. Oldingi algoritmda faqat $d=\frac{\phi(n)}{p_j}$ ko‘rinishidagi qiymatlarni tekshirish yetarli ekanini isbotlaymiz. Darhaqiqat, $d$ soni $\phi(n)$ ning istalgan xos bo‘luvchisi bo‘lsin. U holda shunday $j$ albatta mavjudki, $d \mid \frac{\phi(n)}{p_j}$, ya’ni $d\cdot k=\frac{\phi(n)}{p_j}$. Ammo agar $g^d \equiv 1 \pmod n$ bo‘lsa, quyidagini olardik:

$g^{\frac{\phi(n)}{p_j}} \equiv g^{d\cdot k} \equiv (g^d)^k \equiv 1^k \equiv 1 \pmod n$.

Ya’ni $\frac{\phi(n)}{p_i}$ ko‘rinishidagi sonlar orasida shart bajarilmaydigan kamida bittasi mavjud bo‘lardi.

Endi primitiv ildizni topish uchun to‘liq algoritmga egamiz:

* Avval $\phi(n)$ ni topib, uni tub ko‘paytuvchilarga ajratamiz.
* So‘ng $g \in [1,n]$ sonlarning barchasini ko‘rib chiqamiz va har birining primitiv ildiz ekanini quyidagicha tekshiramiz:
    * Barcha $g^{\frac{\phi(n)}{p_i}} \pmod n$ qiymatlarini hisoblaymiz.
    * Hisoblangan qiymatlarning barchasi $1$ dan farqli bo‘lsa, $g$ primitiv ildizdir.

    Bu algoritmning ishlash vaqti $O(Ans \cdot \log \phi(n) \cdot \log n)$ ga teng ($\phi(n)$ ning $\log \phi(n)$ ta bo‘luvchisi bor deb faraz qilamiz).

Shoup (1990, 1992) [umumlashgan Riemann gipotezasi](http://en.wikipedia.org/wiki/Generalized_Riemann_hypothesis) to‘g‘ri deb faraz qilinganda $g$ soni $O(\log^6 p)$ ekanini isbotlagan.
## Implementatsiya

Quyidagi kod `p` moduli tub son deb faraz qiladi. U istalgan `p` qiymati uchun ishlashi uchun $\phi(p)$ ni hisoblashni ham qo‘shishimiz kerak.
```cpp
int powmod (int a, int b, int p) {
	int res = 1;
	while (b)
		if (b & 1)
			res = int (res * 1ll * a % p),  --b;
		else
			a = int (a * 1ll * a % p),  b >>= 1;
	return res;
}

int generator (int p) {
	vector<int> fact;
	int phi = p-1,  n = phi;
	for (int i=2; i*i<=n; ++i)
		if (n % i == 0) {
			fact.push_back (i);
			while (n % i == 0)
				n /= i;
		}
	if (n > 1)
		fact.push_back (n);

	for (int res=2; res<=p; ++res) {
		bool ok = true;
		for (size_t i=0; i<fact.size() && ok; ++i)
			ok &= powmod (res, phi / fact[i], p) != 1;
		if (ok)  return res;
	}
	return -1;
}
```
