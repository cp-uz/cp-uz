# Soccer (soccer)

QPFL — Qiziqarli Professional Futbol Ligasida jami $2 \cdot n$ ta jamoa o'ynaydi, bunda jamoalar $0$ dan $2 \cdot n-1$ gacha raqamlangan.

Bugun jamoalar taqdiri hal bo'ladigan kun. So'nggi tur oldidan $i$-raqamli jamoa $p[i]$ ochko to'plagan. Bugun jami $n$ ta o'yin bo'lib, unda $a[i]$ va $b[i]$ raqamli jamoalar bir-biriga qarshi o'ynashadi $(0 \le i \le n-1)$.

Albatta barchani qiziqtiradigan savol, har bir jamoaning yakunda olishi mumkin bo'lgan eng yuqori o'rni. Buni hisoblashga yordam bering.

Jamoaning egallagan o'rni o'zidan qat'iy ko'p ochko to'plagan jamoalar soni $+ \; 1$ ga teng. Bir xil ochko to'plagan jamoalar bir xil o'rinni egallashadi.

O'yin natijasiga ko'ra g'olib jamoaga $3$ ochko, mag'lubga $0$ ochko beriladi. Agarda o'yin durang bilan yakunlansa, ikkala jamoa ham $1$ ochkodan olishadi.

Masalan, $n=2$, $p=[47,45,50,48]$, $a=[0,3]$, $b=[2,1]$ bo'lsin. Qulaylik uchun $0, 1, 2, 3$ raqamli jamoalarni mos ravishda "Nasaf", "OKMK", "Paxtakor" hamda "Navbahor" deb nomlaylik. U holda so'nggi tur oldidan jadval quyidagi ko'rinishda bo'ladi:
O'rni         |  Jamoa nomi (raqami) | Ochko
:------------:|:----------------:|---
1 | Paxtakor (2) | $50$ 
2 | Navbahor (3)  | $48$
3 | Nasaf (0) | $47$
4 | OKMK (1)  | $45$

Hamda so'nggi turdagi raqiblar:
Jamoa 1 |  Jamoa 2
:------:|:------:
Nasaf (0) |  Paxtakor (2)
Navbahor (3) | OKMK (1)

Nasaf jamoasi uchun eng yaxshi ssenariyni ko'raylik. Bunda Nasaf Paxtakor ustidan g'alaba qozonishi, Navbahor va OKMK o'yini esa durang bilan yakunlanishi kerak. Shunda Nasaf va Paxtakorda $50$ ochkodan, Navbahorda $49$ ochko, OKMKda esa $46$ ochko bo'ladi. Yakuniy jadval:
O'rni         |  Jamoa nomi (raqami) | Ochko
:------------:|:----------------:|---
1 | Paxtakor (2) | $50$ 
1 | Nasaf (0)    | $50$
3 | Navbahor (3) | $49$
4 | OKMK (1)     | $46$

Demak Nasafning olishi mumkin bo'lgan eng yuqori o'rni $1$ ekan.

Xuddi shunday, Paxtakor va Navbahor jamoalari ham eng yaxshi ssenariyda $1$-o'rinni olishlari mumkin. OKMK jamoasi esa eng yaxshi holatda faqat $2$-o'rinni olishi mumkin.

## Implementation details
Vazifangiz quyidagi protsedurani dasturlash:
```
int[] best_rank(int n, int[] p, int[] a, int[] b)
```
* $n$: jami juftliklar soni.
* $p$: uzunligi $2 \cdot n$ ga teng bo'lgan massiv – har bir jamoaning ochkolari soni.
* $a$ va $b$: uzunliklari $n$ ga teng bo'lgan massivlar – so'nggi turdagi raqib jamoalarning raqamlari.
* Protsedura uzunligi $2 \cdot n$ ga teng massiv qaytarishi kerak. Bunda javobning $i$-elementi $i$-raqamli jamoaning eng yaxshi o'rni bo'lishi kerak.
* Bu protsedura aynan bir marta chaqiriladi.

## Example
Ushbu chaqiruvni ko'raylik:

```
min_cost(2, [47, 45, 50, 48], [0, 3], [2, 1])
```
Bu misol masala shartida tushuntirildi. Protsedura  javob sifatida $[1, 2, 1, 1]$ qaytarishi kerak.

## Constraints

* $1 \le n \le 100\;000$
* $0 \le p[i] \le 500\;000$ (barcha $0 \le i \le 2 \cdot n - 1$ uchun)
* $0 \le a[i] \le 2 \cdot n-1$ (barcha $0 \le i \le n - 1$ uchun)
* $0 \le b[i] \le 2 \cdot n-1$ (barcha $0 \le i \le n - 1$ uchun)

$a$ va $b$ massivlar ichida $[0, 2 \cdot n-1]$ oralig'idagi barcha sonlar aynan bir martadan qatnashganligi kafolatlanadi.

## Subtasks

1. (6 ball) $n \le 2$
2. (11 ball) $n \le 12$
3. (17 ball) $n \le 200$
4. (20 ball) $n \le 2000$
5. (46 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n$
* qator $2$: $p[0] \; p[1] \; \ldots \; p[2 \cdot n - 1]$
* qator $3+k$ ($0 \le k \le n-1$): $a[k] \; b[k]$

`best_rank` protsedurasi javob sifatida $r[0],r[1], \ldots r[2 \cdot n-1]$ massivni qaytargan bo'lsin. U holda namunaviy grader javobni quyidagi tartibda chiqaradi:

* qator $1$: $r[0] \; r[1] \; \ldots \; r[2 \cdot n - 1]$
