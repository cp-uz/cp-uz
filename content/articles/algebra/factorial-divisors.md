---
article_id: algebra--factorial-divisors
---
# Faktorial bo‘luvchisining darajasini topish

Ikkita $n$ va $k$ sonlari berilgan. $k^x$ soni $n!$ ni bo‘ladigan eng katta butun $x$ ni topish talab etiladi.

## $k$ tub son bo‘lganda {data-toc-label="k tub bo‘lganda"}

Avval $k$ tub son bo‘lgan holatni ko‘rib chiqamiz. Faktorialning ochiq ko‘rinishi:

$$n! = 1 \cdot 2 \cdot 3 \ldots (n-1) \cdot n$$

Ko‘paytmaning har bir $k$-elementi $k$ ga bo‘linadi, ya’ni javobga $+1$ qo‘shadi. Bunday elementlar soni $\Bigl\lfloor\dfrac{n}{k}\Bigr\rfloor$ ga teng.

Keyin har bir $k^2$-element $k^2$ ga bo‘linadi va javobga yana $+1$ qo‘shadi. $k$ ning birinchi darajasi oldingi bandda allaqachon hisoblangan. Bunday elementlar soni $\Bigl\lfloor\dfrac{n}{k^2}\Bigr\rfloor$ ga teng.

Xuddi shu tarzda, har bir $i$ uchun har bir $k^i$-element javobga yana $+1$ qo‘shadi; bunday elementlar soni $\Bigl\lfloor\dfrac{n}{k^i}\Bigr\rfloor$ bo‘ladi.

Demak, yakuniy javob:

$$\Bigl\lfloor\dfrac{n}{k}\Bigr\rfloor + \Bigl\lfloor\dfrac{n}{k^2}\Bigr\rfloor + \ldots + \Bigl\lfloor\dfrac{n}{k^i}\Bigr\rfloor + \ldots$$

Bu natija [Legendre formulasi](https://en.wikipedia.org/wiki/Legendre%27s_formula) nomi bilan ham ma’lum.
Yig‘indi, albatta, chekli: taxminan faqat dastlabki $\log_k n$ ta hadi noldan farqli bo‘ladi. Shuning uchun algoritmning vaqt murakkabligi $O(\log_k n)$.

### Dastur kodi

```cpp

int fact_pow (int n, int k) {
	int res = 0;
	while (n) {
		n /= k;
		res += n;
	}
	return res;
}

```

## $k$ murakkab son bo‘lganda {data-toc-label="k murakkab bo‘lganda"}

Yuqoridagi g‘oyani bevosita qo‘llab bo‘lmaydi. Buning o‘rniga $k$ ni tub ko‘paytuvchilarga ajratamiz:

$$k = k_1^{p_1} \cdot \ldots \cdot k_m^{p_m}.$$

Har bir $k_i$ uchun yuqoridagi algoritm yordamida uning $n!$ tarkibida necha marta qatnashishini topamiz va bu qiymatni $a_i$ deb belgilaymiz. Murakkab $k$ uchun javob:

$$\min_ {i=1 \ldots m} \dfrac{a_i}{p_i}$$

bo‘ladi.

