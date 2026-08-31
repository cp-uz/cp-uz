---
article_id: algebra--all-submasks
---
# Submaskalarni sanab chiqish

## Berilgan maskaning barcha submaskalarini sanab chiqish

$m$ bitmaskasi berilgan bo‘lsin. Uning barcha submaskalari, ya’ni faqat $m$ maskasida mavjud bitlar o‘rnatilgan $s$ maskalari bo‘ylab samarali yurish kerak.

Bit amallari bilan bog‘liq hiylalarga asoslangan ushbu algoritm implementatsiyasini ko‘rib chiqamiz:

```cpp
int s = m;
while (s > 0) {
 ... you can use s ...
 s = (s-1) & m;
}
```

yoki yanada ixcham `for` operatoridan foydalanib:

```cpp
for (int s=m; s; s=(s-1)&m)
 ... you can use s ...
```
Kodning ikkala variantida ham nolga teng submaska qayta ishlanmaydi. Uni sikldan tashqarida qayta ishlashimiz yoki, masalan, unchalik chiroyli bo‘lmagan quyidagi tuzilishdan foydalanishimiz mumkin:

```cpp
for (int s=m; ; s=(s-1)&m) {
 ... you can use s ...
 if (s==0)  break;
}
```

Yuqoridagi kod nima sababdan $m$ ning barcha submaskalariga takrorlanmasdan va kamayish tartibida tashrif buyurishini ko‘rib chiqamiz.
Joriy bitmaska $s$ berilgan va keyingi bitmaskaga o‘tmoqchimiz, deb faraz qilaylik. $s$ maskasidan birni ayirganda, eng o‘ngdagi o‘rnatilgan bit olib tashlanadi va uning o‘ngidagi barcha bitlar 1 ga aylanadi. Keyin $m$ maskasida mavjud bo‘lmagani uchun submaskaga kira olmaydigan barcha «ortiqcha» bir bitlarni olib tashlaymiz. Buni `(s-1) & m` bitli amali yordamida bajaramiz.
Natijada $s-1$ maskasini u olishi mumkin bo‘lgan eng katta qiymatgacha «kesamiz»; bu kamayish tartibida $s$ dan keyingi submaskadir.
Shunday qilib, bu algoritm har bir iteratsiyada atigi ikkita amal bajarib, berilgan maskaning barcha submaskalarini kamayish tartibida hosil qiladi.

$s = 0$ bo‘lgan hol alohida e’tibor talab qiladi. $s-1$ bajarilgach, barcha bitlari o‘rnatilgan maska (-1 ning bitli ifodasi) hosil bo‘ladi, `(s-1) & m` dan keyin esa $s$ yana $m$ ga teng bo‘ladi. Shu sababli $s = 0$ maskasiga ehtiyot bo‘ling: agar sikl nolda tugamasa, algoritm cheksiz siklga kirib qolishi mumkin.
## Barcha maskalar va ularning submaskalari bo‘ylab yurish. Murakkablik $O(3^n)$

Ko‘plab masalalarda, ayniqsa bitmaska bo‘yicha dinamik dasturlash ishlatiladigan masalalarda, barcha bitmaskalar bo‘ylab va har bir maska uchun uning barcha submaskalari bo‘ylab yurish talab qilinadi:

```cpp
for (int m=0; m<(1<<n); ++m)
 	for (int s=m; s; s=(s-1)&m)
 ... s and m ...
```

Ichki sikl jami $O(3^n)$ ta iteratsiya bajarishini isbotlaymiz.

**Birinchi isbot**: $i$-bitni ko‘rib chiqamiz. U uchun aynan uchta imkoniyat bor:
1. u $m$ maskasiga kiritilmagan (demak, $s$ submaskasiga ham kiritilmagan),
2. u $m$ ga kiritilgan, ammo $s$ ga kiritilmagan, yoki
3. u ham $m$, ham $s$ ga kiritilgan.

Jami $n$ ta bit bo‘lgani uchun, $3^n$ ta turli kombinatsiya mavjud bo‘ladi.
**Ikkinchi isbot**: $m$ maskasida $k$ ta yoqilgan bit bo‘lsa, uning $2^k$ ta submaskasi bo‘lishiga e’tibor bering. $k$ ta yoqilgan bitli maskalar soni jami $\binom{n}{k}$ ta bo‘lgani uchun ([binomial koeffitsiyentlar](../combinatorics/binomial-coefficients.md)ga qarang), barcha maskalar bo‘yicha kombinatsiyalarning umumiy soni:

$$\sum_{k=0}^n \binom{n}{k} \cdot 2^k$$
Bu sonni hisoblash uchun yuqoridagi yig‘indi binom teoremasi bo‘yicha $(1+2)^n$ yoyilmasiga teng ekaniga e’tibor bering. Demak, isbotlash talab qilinganidek, $3^n$ ta kombinatsiya bor.
## Mashq masalalari
* [Atcoder - Close Group](https://atcoder.jp/contests/abc187/tasks/abc187_f)
* [Codeforces - Nuclear Fusion](http://codeforces.com/problemset/problem/71/E)
* [Codeforces - Sandy and Nuts](http://codeforces.com/problemset/problem/599/E)
* [Uva 1439 - Exclusive Access 2](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4185)
* [UVa 11825 - Hackers' Crackdown](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2925)
