<a href="https://imgbb.com/"><img src="https://i.ibb.co/JR695Fp/IOI-2024-Wide-Colored-on-White-BG.png" alt="IOI-2024-Wide-Colored-on-White-BG" style="float: right;" width="200" border="0"></a>

# Frequency (freq)

$f(b)$ deganda $b$ massivda eng ko'p uchragan sonni nechi marta borligiga aytaylik. Masalan, $f([3, 1, 3, 3, 3]) = 4$ va $f(1, 2, 3) = 1$. $b$ massiv go'zal deyilishi uchun, $x \le f(b) \le y$ shart bajarilishi kerak, bu yerda $x$ va $y$ – berilgan sonlar.

Ozodda uzunligi $n$ ga teng $a$ massiv bor, massivda indeksatsiya $0$ dan $n-1$ gacha. Ozod massivni shunday ketma-ket bo'laklarga bo'lmoqchiki, bunda har bir bo'lak go'zal massivni tashkil qilsin. Bunda har bir element aynan bitta bo'lakka tegishli bo'lishi kerak. 

Ozod bunday bo'laklar sonini maksimallashtirmoqchi. Siz unga yordam bering.

## Implementation details
Vazifangiz quyidagi protsedurani dasturlash:
```
int max_blocks(int n, int x, int y, int[] a)
```
* $n$: jami elementlar soni.
* $x$ va $y$: massiv go'zalligini aniqlash uchun ishlatiladigan parametrlar.
* $a$: uzunligi $n$ ga teng bo'lgan massiv.
* Protsedura javob sifatida maksimum bo'laklar sonini topishi kerak.
* Agar massivni go'zal bo'laklarga bo'lishni iloji yo'q bo'lsa, protsedura $-1$ qaytarishi kerak.
* Bu protsedura aynan bir marta chaqiriladi.

## Example
Quyidagi chaqiruvni ko'raylik:
```
max_blocks(10, 2, 4, [1, 3, 2, 3, 2, 2, 2, 2, 2, 4])
```

Massivni $[1, 3, 2, 3]$, $[2, 2, 2]$, $[2, 2, 4]$ ko'rinishida uchta bo'lakka bo'lishimiz mumkin. Bunda $f([1, 3, 2, 3])=2$, $f([2, 2, 2])=3$ va $f([2, 2, 4]) = 2$. Massivni uchtadan ortiq bo'lakka bo'la olmaganimiz uchun, protsedura $3$ qaytarishi kerak.

Yana bir misol ko'raylik:
```
max_blocks(5, 2, 2, [1, 2, 3, 4, 5])
```
Massivni yaxshi bo'laklarga bo'lish imkonsiz bo'lgani uchun protsedura $-1$ qaytarishi kerak.

## Constraints

* $1 \le n \le 200 \; 000$
* $1 \le x \le y \le n$
* $1 \le a[i] \le 10^6$

## Subtasks

1. (10 ball) $n \le 18$
1. (11 ball) $n \le 100$
1. (19 ball) $n \le 2000$
1. (14 ball) $y \le 10$, $a[i] \le 10$, barcha $0 \le i \le n - 1$ uchun
1. (15 ball) $y=n$
1. (31 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n \; x \; y$
* qator $2$: $a[0] \; a[1] \; \ldots \; a[n - 1]$

Namunaviy grader javobni quyidagi tartibda chiqaradi:

* qator $1$: `max_blocks` protsedurasi qaytargan javob.
