---
article_id: algebra--discrete-root
---
# Diskret ildiz

Diskret ildizni topish masalasi quyidagicha ta’riflanadi. Tub $n$ hamda ikkita $a$ va $k$ butun son berilgan bo‘lsin. Quyidagi tenglikni qanoatlantiradigan barcha $x$ larni topish kerak:

$x^k \equiv a \pmod n$
## Algoritm

Masalani [diskret logarifm masalasi](discrete-log.md)ga keltirib yechamiz.

$n$ modul bo‘yicha [primitiv ildiz](primitive-root.md) tushunchasidan foydalanamiz. $g$ soni $n$ modul bo‘yicha primitiv ildiz bo‘lsin. $n$ tub bo‘lgani uchun u albatta mavjud va uni $O(Ans\cdot\log\phi(n)\cdot\log n)=O(Ans\cdot\log^2n)$ va $\phi(n)$ ni faktorizatsiya qilish vaqtida topish mumkin.

$a=0$ holini oson alohida ko‘rib chiqish mumkin. Bu holda ravshanki, yagona javob $x=0$.
$n$ tub ekanini va $1$ dan $n-1$ gacha bo‘lgan istalgan sonni primitiv ildizning darajasi sifatida ifodalash mumkinligini bilganimiz uchun, diskret ildiz masalasini quyidagicha yozamiz:

$(g^y)^k \equiv a \pmod n$

bu yerda

$x \equiv g^y \pmod n$

Bu o‘z navbatida quyidagi ko‘rinishga keltiriladi:

$(g^k)^y \equiv a \pmod n$
Endi faqat bitta noma’lum $y$ qoldi va bu diskret logarifm masalasidir. Yechimni Shanksning baby-step giant-step algoritmi yordamida $O(\sqrt n\log n)$ vaqtda topish mumkin (yoki yechim yo‘qligini aniqlash mumkin).

Bitta $y_0$ yechim topilgach, diskret ildiz masalasining yechimlaridan biri $x_0=g^{y_0}\pmod n$ bo‘ladi.
## Ma’lum bitta yechimdan barcha yechimlarni topish

Berilgan masalani to‘liq yechish uchun yechimlardan biri $x_0=g^{y_0}\pmod n$ ma’lum bo‘lganda barcha yechimlarni topishimiz kerak.

Primitiv ildizning tartibi har doim $\phi(n)$ ga tengligini, ya’ni $g$ ning $1$ beradigan eng kichik darajasi $\phi(n)$ ekanini eslaylik. Shuning uchun daraja ko‘rsatkichiga $\phi(n)$ ni qo‘shsak ham ayni qiymatni olamiz:

$x^k \equiv g^{ y_0 \cdot k + l \cdot \phi (n)} \equiv a \pmod n \forall l \in Z$
Demak, barcha yechimlar quyidagi ko‘rinishda:

$x = g^{y_0 + \frac {l \cdot \phi (n)}{k}} \pmod n \forall l \in Z$.

Bu yerda kasr butun son bo‘lishi uchun $l$ tanlanadi. Buning uchun surat $\phi(n)$ va $k$ ning eng kichik umumiy karralisiga bo‘linishi kerak. Ikki sonning eng kichik umumiy karralisi $lcm(a,b)=\frac{a\cdot b}{gcd(a,b)}$ ekanini eslasak:

$x = g^{y_0 + i \frac {\phi (n)}{gcd(k, \phi (n))}} \pmod n \forall i \in Z$.

ni olamiz. Bu diskret ildiz masalasining barcha yechimlari uchun yakuniy formula.
## Implementatsiya

Quyida primitiv ildiz va diskret logarifmni topish, so‘ng barcha yechimlarni topib chiqarish protseduralari bilan birga to‘liq implementatsiya keltirilgan.
```cpp
int gcd(int a, int b) {
	return a ? gcd(b % a, a) : b;
}

int powmod(int a, int b, int p) {
	int res = 1;
	while (b > 0) {
		if (b & 1) {
			res = res * a % p;
		}
		a = a * a % p;
		b >>= 1;
	}
	return res;
}

// Finds the primitive root modulo p
int generator(int p) {
	vector<int> fact;
	int phi = p-1, n = phi;
	for (int i = 2; i * i <= n; ++i) {
		if (n % i == 0) {
			fact.push_back(i);
			while (n % i == 0)
				n /= i;
		}
	}
	if (n > 1)
		fact.push_back(n);
	for (int res = 2; res <= p; ++res) {
		bool ok = true;
		for (int factor : fact) {
			if (powmod(res, phi / factor, p) == 1) {
				ok = false;
				break;
			}
		}
		if (ok) return res;
	}
	return -1;
}

// This program finds all numbers x such that x^k = a (mod n)
int main() {
	int n, k, a;
	scanf("%d %d %d", &n, &k, &a);
	if (a == 0) {
		puts("1\n0");
		return 0;
	}

	int g = generator(n);

	// Baby-step giant-step discrete logarithm algorithm
	int sq = (int) sqrt (n + .0) + 1;
	vector<pair<int, int>> dec(sq);
	for (int i = 1; i <= sq; ++i)
		dec[i-1] = {powmod(g, i * sq * k % (n - 1), n), i};
	sort(dec.begin(), dec.end());
	int any_ans = -1;
	for (int i = 0; i < sq; ++i) {
		int my = powmod(g, i * k % (n - 1), n) * a % n;
		auto it = lower_bound(dec.begin(), dec.end(), make_pair(my, 0));
		if (it != dec.end() && it->first == my) {
			any_ans = it->second * sq - i;
			break;
		}
	}
	if (any_ans == -1) {
		puts("0");
		return 0;
	}

	// Print all possible answers
	int delta = (n-1) / gcd(k, n-1);
	vector<int> ans;
	for (int cur = any_ans % delta; cur < n-1; cur += delta)
		ans.push_back(powmod(g, cur, n));
	sort(ans.begin(), ans.end());
	printf("%d\n", ans.size());
	for (int answer : ans)
		printf("%d ", answer);
}
```
## Mashq masalalari

* [Codeforces - Lunar New Year and a Recursive Sequence](https://codeforces.com/contest/1106/problem/F)
