# Students (stud)

Sinfda $n$ ta o'quvchi bor, o'quvchilar $0$ dan $n-1$ gacha raqamlangan. Har bir o'quvchi faqat $[a[i]; b[i]]$ oralig'idagi kunlarda maktabga kelishi mumkin, qolgan kunlarda esa maktabga aniq kelmaydi. O'quvchi maktabga kelsa sinf yetakchisining kayfiyati $p[i]$ ga ortadi (yoki kamayadi). Shuningdek, har bir o'quvchining o'z reytingi bor, bunda $i$-o'quvchining reytingi $r[i]$.

Aytaylik, $n$ ta ssenariy ko'raylik. $i$-ssenariyda sinf yetakchisi $i$-raqamli o'quvchi bo'lsin. Siz shunday $t < r[i]$ bo'lgan $t$ sonini tanlashingiz kerakki, bunda faqatgina $r[j] \le t$ bo'lgan barcha o'quvchilar maktabga kelishadi. $t$ ning qiymatidan qat'iy nazar yetakchining o'zi ham maktabga keladi. Yetakchining maqsadi qaysidir kunda o'zining kayfiyatingizni maksimallashtirish. 

Siz buni hisoblashga yordam bering.

## Implementation details
Vazifangiz quyidagi protsedurani dasturlash:
```
int64[] get_pleasure(int n, int[] a, int[] b, int[] p, int[] r)
```
* $n$: jami o'quvchilar soni.
* $a$ va $b$: uzunligi $n$ ga teng bo'lgan massivlar – o'quvchilarning maktabga kela oladigan kunlari.
* $p$: uzunligi $n$ ga teng bo'lgan massiv – o'quvchilarning yetakchi kayfiyatini o'zgartirishi.
* $r$: uzunligi $n$ ga teng bo'lgan massivlar – o'quvchilarning reytingi.
* Protsedura uzunligi $n$ ga teng massiv qaytarishi kerak – har bir ssenariy uchun javob.
* Bu protsedura aynan bir marta chaqiriladi.

## Example
Quyidagi chaqiruvni ko'raylik:
```
get_pleasure(4, [1, 4, 1, 1],
                [2, 4, 4, 4],
                [-3, -2, 4, 0],
                [1, 1, 1, 4])
```

$r[0]=r[1]=r[2]=1$ bo'lgani uchun, ushbu o'quvchilar yetakchi bo'lganida $t$ ning har qanday qiymatida ham qolgan o'quvchilar maktabga kelishmaydi. Demak javob $p[i]$ ga teng.

$3$-o'quvchi yetakchi bo'lsa, u $t=2$ tanlashi mumkin. Shunda $0, 1$ va $2$-o'quvchilar va yetakchi sifatida $3$-o'quvchining o'zi ham maktabga keladi. Yetakchining kayfiyati quyidagicha bo'ladi:
* 1-kun: Faqat $0, 2$ va $3$-o'quvchilar maktabga kelishadi, chunki $1$-o'quvchining vaqt oralig'ida $1$-kun yo'q. Yetakchi kayfiyati $p[0]+p[2]+p[3]=-3+4+0=1$ ga teng.
* 2-kun: $0, 2$ va $3$-o'quvchilar maktabga kelishadi. Yetakchi kayfiyati $p[0]+p[2]+p[3]=-3+4+0=1$ ga teng.
* 3-kun: $2$ va $3$-o'quvchilar maktabga kelishadi. Yetakchi kayfiyati $p[2]+p[3]=4+0=4$ ga teng.
* 4-kun: $1, 2$ va $3$-o'quvchilar maktabga kelishadi. Yetakchi kayfiyati $p[1] + [2]+p[3]=-2+4+0=2$ ga teng.

Demak, $3$-kunda uning kayfiyati maksimal $4$ qiymatga erishar ekan. $i=3$ da javob $4$.

Protsedura $[-3, -2, 4, 4]$ qaytarishi kerak.

## Constraints

* $1 \le n \le 200 \; 000$
* $1 \le a[i] \le b[i] \le n$
* $1 \le r[i] \le n$
* $-10^9 \le p[i] \le 10^9$

## Subtasks

1. (13 ball) $a[i]=b[i]$, barcha $0 \le i \le n-1$ uchun
1. (15 ball) $n \le 200$
1. (22 ball) $n \le 2000$
1. (50 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n$
* qator $2$: $a[0] \; a[1] \; \ldots \; a[n - 1]$
* qator $3$: $b[0] \; b[1] \; \ldots \; b[n - 1]$
* qator $4$: $p[0] \; p[1] \; \ldots \; p[n - 1]$
* qator $5$: $r[0] \; r[1] \; \ldots \; r[n - 1]$

`get_pleasure` javob sifatida $v$ massivni qaytarsin. U holda namunaviy grader javobni quyidagi tartibda chiqaradi:

* qator $1$: $v[0] \; v[1] \; \ldots \; v[n - 1]$
