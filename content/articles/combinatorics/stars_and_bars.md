---
article_id: combinatorics--stars_and_bars
---
# Yulduzlar va ajratgichlar usuli

Yulduzlar va ajratgichlar (*stars and bars*) — ayrim kombinatorik masalalarni yechish uchun ishlatiladigan matematik usul. U bir xil obyektlarni guruhlarga ajratish usullari sonini hisoblash kerak bo‘lgan hollarda qo‘llanadi.

## Teorema

$n$ ta bir xil obyektni belgilangan $k$ ta qutiga joylashtirish usullari soni

$$\binom{n + k - 1}{n}.$$

Isbotda obyektlar yulduzlarga aylantiriladi, qutilar esa ajratgichlar bilan bir-biridan ajratiladi; usulning nomi ham shundan kelib chiqqan.
Masalan, $\bigstar | \bigstar \bigstar |~| \bigstar \bigstar$ yozuvi quyidagi holatni ifodalaydi:
birinchi qutida bitta obyekt, ikkinchi qutida ikkita obyekt, uchinchi quti bo‘sh, oxirgi qutida esa ikkita obyekt bor.
Bu 5 ta obyektni 4 ta qutiga taqsimlash usullaridan biridir.

Har bir taqsimotni $n$ ta yulduz va $k-1$ ta ajratgich yordamida ifodalash mumkinligi, shuningdek, $n$ ta yulduz va $k-1$ ta ajratgichning har bir permutatsiyasi bitta taqsimotni ifodalashi ravshan.
Demak, $n$ ta bir xil obyektni belgilangan $k$ ta qutiga taqsimlash usullari soni $n$ ta yulduz va $k-1$ ta ajratgich permutatsiyalari soniga teng.
[Binomial koeffitsiyent](binomial-coefficients.md) bizga kerakli formulani beradi.

## Manfiy bo‘lmagan butun sonlar yig‘indilari soni

Bu masala teoremaning bevosita qo‘llanishidir.

Quyidagi tenglamaning yechimlari sonini hisoblash kerak:

$$x_1 + x_2 + \dots + x_k = n$$

bunda $x_i \ge 0$.

Yechimni yana yulduzlar va ajratgichlar yordamida ifodalashimiz mumkin.
Masalan, $n=4$, $k=3$ uchun $1+3+0=4$ yechimni $\bigstar | \bigstar \bigstar \bigstar |$ ko‘rinishida ifodalash mumkin.

Bu aynan yulduzlar va ajratgichlar teoremasi ekani oson ko‘rinadi.
Shuning uchun javob $\binom{n + k - 1}{n}$ ga teng.

## Musbat butun sonlar yig‘indilari soni

Ikkinchi teorema musbat butun sonlar uchun qulay talqin beradi. Quyidagi tenglamaning yechimlarini ko‘rib chiqamiz:

$$x_1 + x_2 + \dots + x_k = n$$

bunda $x_i \ge 1$.

$n$ ta yulduzni ko‘rib chiqishimiz mumkin, ammo bu safar yulduzlar orasiga ko‘pi bilan *bitta ajratgich* qo‘yish mumkin, chunki ikki yulduz orasidagi ikkita ajratgich $x_i=0$ ni, ya’ni bo‘sh qutini anglatgan bo‘lardi.
Yulduzlar orasida $n-1$ ta bo‘shliq bor va ulardan $k-1$ tasiga ajratgich qo‘yish kerak. Demak, javob $\binom{n-1}{k-1}$ ga teng.

## Quyi chegarali butun sonlar yig‘indilari soni

Bu natijani turli quyi chegaralarga ega butun sonlar yig‘indilariga ham osongina umumlashtirish mumkin.
Ya’ni quyidagi tenglamaning yechimlari sonini hisoblamoqchimiz:

$$x_1 + x_2 + \dots + x_k = n$$

bunda $x_i \ge a_i$.

$x_i' := x_i - a_i$ almashtirishdan so‘ng quyidagi o‘zgartirilgan tenglamani olamiz:

$$(x_1' + a_i) + (x_2' + a_i) + \dots + (x_k' + a_k) = n$$

$$\Leftrightarrow ~ ~ x_1' + x_2' + \dots + x_k' = n - a_1 - a_2 - \dots - a_k$$

bunda $x_i' \ge 0$.
Shunday qilib, masalani $x_i' \ge 0$ bo‘lgan soddaroq holatga keltirdik va yana yulduzlar va ajratgichlar teoremasini qo‘llashimiz mumkin.

## Yuqori chegarali butun sonlar yig‘indilari soni

[Kiritish–chiqarish prinsipi](./inclusion-exclusion.md) yordamida butun sonlarga yuqori chegaralar ham qo‘yish mumkin.
Tegishli maqoladagi [Yuqori chegarali butun sonlar yig‘indilari soni](./inclusion-exclusion.md#number-of-upper-bound-integer-sums) bo‘limiga qarang.

## Amaliy masalalar

* [Codeforces - Array](https://codeforces.com/contest/57/problem/C)
* [Codeforces - Kyoya and Coloured Balls](https://codeforces.com/problemset/problem/553/A)
* [Codeforces - Colorful Bricks](https://codeforces.com/contest/1081/problem/C)
* [Codeforces - Two Arrays](https://codeforces.com/problemset/problem/1288/C)
* [Codeforces - One-Dimensional Puzzle](https://codeforces.com/contest/1931/problem/G)

