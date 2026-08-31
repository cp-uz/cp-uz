---
article_id: dynamic_programming--profile-dynamics
---
# Buzilgan profil bo‘yicha DP: “Parquet” masalasi

Buzilgan profil bo‘yicha DP yordamida odatda quyidagi turdagi masalalar yechiladi:

- biror sohani (masalan, shaxmat taxtasi yoki panjarani) ma’lum shakllar (masalan, dominolar) bilan to‘liq qoplash usullari sonini topish;
- sohani eng kam sondagi shakllar bilan qoplash usulini topish;
- eng kam sondagi joy yoki katak qoplanmay qoladigan qisman qoplashni topish;
- boshqa hech qanday shakl qo‘shib bo‘lmaydigan, shu bilan birga eng kam sondagi shakllardan iborat qisman qoplashni topish.

## “Parket” masalasi

**Masala sharti.** O‘lchami $N \times M$ bo‘lgan panjara berilgan. Uni $2 \times 1$ o‘lchamli shakllar bilan qoplash usullari sonini toping. Hech bir katak qoplanmay qolmasligi va shakllar o‘zaro ustma-ust tushmasligi kerak.

DP holatini $dp[i, mask]$ deb olamiz; bu yerda $i = 1, \ldots N$ va $mask = 0, \ldots 2^M - 1$.
$i$ joriy ko‘rib chiqilgan panjaradagi qatorlar sonini, $mask$ esa joriy panjaraning oxirgi qatori holatini bildiradi. Agar $mask$ ning $j$-biti $0$ bo‘lsa, unga mos katak qoplangan; aks holda katak hali qoplanmagan.

Masalaning javobi, ravshanki, $dp[N, 0]$ bo‘ladi.

DP holatlarini $i = 1, \cdots N$ va $mask = 0, \ldots 2^M - 1$ bo‘yicha ko‘rib chiqamiz. Har bir `mask` uchun faqat oldinga o‘tishlar qilamiz, ya’ni joriy panjaraga shakllar _qo‘shamiz_.

### Implementatsiya

```cpp
int n, m;
vector < vector<long long> > dp;


void calc (int x = 0, int y = 0, int mask = 0, int next_mask = 0)
{
	if (x == n)
		return;
	if (y >= m)
		dp[x+1][next_mask] += dp[x][mask];
	else
	{
		int my_mask = 1 << y;
		if (mask & my_mask)
			calc (x, y+1, mask, next_mask);
		else
		{
			calc (x, y+1, mask, next_mask | my_mask);
			if (y+1 < m && ! (mask & my_mask) && ! (mask & (my_mask << 1)))
				calc (x, y+2, mask, next_mask);
		}
	}
}


int main()
{
	cin >> n >> m;
	dp.resize (n+1, vector<long long> (1<<m));
	dp[0][0] = 1;
	for (int x=0; x<n; ++x)
		for (int mask=0; mask<(1<<m); ++mask)
			calc (x, 0, mask, 0);

	cout << dp[n][0];

}
```

## Amaliy masalalar

- [UVA 10359 - Tiling](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1300)
- [UVA 10918 - Tri Tiling](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1859)
- [SPOJ GNY07H (Four Tiling)](https://www.spoj.com/problems/GNY07H/)
- [SPOJ M5TILE (Five Tiling)](https://www.spoj.com/problems/M5TILE/)
- [SPOJ MNTILE (MxN Tiling)](https://www.spoj.com/problems/MNTILE/)
- [SPOJ DOJ1](https://www.spoj.com/problems/DOJ1/)
- [SPOJ DOJ2](https://www.spoj.com/problems/DOJ2/)
- [SPOJ BTCODE_J](https://www.spoj.com/problems/BTCODE_J/)
- [SPOJ PBOARD](https://www.spoj.com/problems/PBOARD/)
- [ACM HDU 4285 - Circuits](http://acm.hdu.edu.cn/showproblem.php?pid=4285)
- [LiveArchive 4608 - Mosaic](https://vjudge.net/problem/UVALive-4608)
- [Timus 1519 - Formula 1](https://acm.timus.ru/problem.aspx?space=1&num=1519)
- [Codeforces Parquet](https://codeforces.com/problemset/problem/26/C)

## Manbalar

- [EvilBunny blogi](https://web.archive.org/web/20180712171735/https://blog.evilbuggy.com/2018/05/broken-profile-dynamic-programming.html)
- [“syg96” muallifligidagi TopCoder retsepti](https://apps.topcoder.com/forums/?module=Thread&start=0&threadID=697369)
- [sk765 blogposti](http://sk765.blogspot.com/2012/02/dynamic-programming-with-profile.html)

