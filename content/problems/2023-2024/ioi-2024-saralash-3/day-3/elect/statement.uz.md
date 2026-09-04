# Elections (elect)

Yaqinda Dadorlandtiria mamlakatida deputatlar saylovi bo'lib o'tadi. Saylovda jami $n$ ta saylovchi bor va ular $0$ dan $n-1$ gacha raqamlangan. Shuningdek, saylovda jami $k$ ta nomzod bo'lib, ular $0$ dan $k-1$ gacha raqamlangan. E'tibor bering, nomzodlarning o'zlari saylovda qatnashishmaydi, ya'ni jami $n+k$ ta odam bor. 

Anchadan beri deputat bo'lish orzusida yurgan Komiljon saylovga o'z nomzodini qo'ygan. Komiljonning tartib raqami $0$.

Saylovoldi ma'lumotlarga ko'ra $i$-saylovchi $p[i]$ raqamli nomzodga ovoz bermoqchi. Biroq, Komiljon $c[i]$ dador dollari evaziga $i$-saylovchini Komiljonga ovoz berishga ko'ndirishi mumkin.

Komiljon saylovda g'olib chiqishi uchun qolgan barcha nomzodlardan **qat'iy ko'proq** ovoz to'plashi kerak. Buning uchun Komiljon eng kamida qancha xarajat qilishi kerak?

## Implementation details
Vazifangiz quyidagi protsedurani dasturlash:
```
int64 min_cost(int n, int k, int[] p, int[] c)
```
* $n$: jami saylovchilar soni.
* $k$: jami nomzodlar soni.
* $p$: uzunligi $n$ ga teng bo'lgan massiv – saylovchilarning kimga ovoz bermoqchi ekanligi.
* $c$: uzunligi $n$ ga teng bo'lgan massiv – har bir saylovchini sotib olish narxi.
* Protsedura javob sifatida saylovda yutish uchun kerak bo'ladigan minimal pul miqdorini qaytarishi kerak.
* Bu protsedura aynan bir marta chaqiriladi.

## Example
Ushbu chaqiruvni ko'raylik:

```
min_cost(7, 3, [1, 2, 0, 2, 2, 1, 1], [3, 4, 9, 9, 8, 1, 2])
```
Demak $n=7$, $k=3$, $p = [1, 2, 0, 2, 2, 1, 1]$ va $c = [3, 4, 9, 9, 8, 1, 2]$.

Komiljon $1$ va $5$ raqamli saylovchilar bilan kelishishi mumkin. Shunda $c[1] + c[5] = 4 + 1 = 5$ dador dollari ishlatadi. Shunda Komiljon saylovda $3$ta ovoz oladi, qolgan nomzodlar esa $2$tadan ovoz oladi.

Boshqa misol ko'raylik:
```
min_cost(3, 2, [0, 1, 0], [9, 9, 9])
```
Ko'rish mumkinki Komiljonda $2$ta ovoz, uning raqibida esa $1$ta ovoz bor. Demak, pul sarflashning hojati yo'q. Protsedura $0$ qaytarishi kerak.

## Constraints

* $2 \le n \le 200\;000$
* $2 \le k \le n$
* $0 \le p[i] \le k-1$ (barcha $0 \le i \le n - 1$ uchun)
* $1 \le c[i] \le 10^9$ (barcha $0 \le i \le n - 1$ uchun)

## Subtasks

1. (8 ball) $n \le 18$
1. (12 ball) $n \le 200$
1. (22 ball) $n \le 2000$
1. (6 ball) $k = 2$
1. (10 ball) $k = 3$
1. (15 ball) $c[i] = 1$
1. (27 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n \; k$
* qator $2$: $p[0] \; p[1] \; \ldots \; p[n - 1]$
* qator $3$: $c[0] \; c[1] \; \ldots \; c[n - 1]$

Namunaviy grader javobni quyidagi tartibda chiqaradi:

* qator $1$: `min_cost` protsedurasi qaytargan javob.
