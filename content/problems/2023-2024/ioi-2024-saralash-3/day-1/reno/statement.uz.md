# Renovations (reno)

Dadorlandtiria mamlakatida $n$ ta shahar bor va ular $0$ dan $n-1$ gacha raqamlangan. Mamlakatni $m$ ta ikki tomonli yo'l bog'lab turadi, yo'llar ham $0$ dan $m-1$ gacha raqamlangan. Bunda $i$-raqamli yo'l $u[i]$ va $v[i]$ raqamli shaharlarni bog'lab turadi.

Buni qarangki, barcha yo'llar eski va ta'mirga muhtoj. Qaysidir yo'ldan  foydalangandan so'ng o'sha yo'l yurib bo'lmaydigan holatga keladi. $i$-raqamli yo'ldan foydalangandan so'ng uni ta'mirlashga $w[i]$ dador dollari kerak. Ta'mirlangan yo'l ham bir marta foydalangandan so'ng yana ta'mirtalab holatga kelib qoladi.

Aytaylik, $x$-shahardan $y$-shaharga borib, so'ngra yana $x$-shaharga qaytib kelmoqchisiz. Ta'mirtalab yo'ldan yana foydalanmoqchi bo'lsangiz uning ta'mirlash pulini to'laysiz. Shu xarajatlar yig'indisiga $f(x, y)$ deyiladi.

Davlatbek sizdan nechta $(x, y)$ juftliklar uchun $f(x, y) \le T$ shart bajarilishini so'ramoqda, bunda $0 \le x \lt y \le n - 1$. Siz Davlatbekka yordam bering.

## Implementation details
Vazifangiz quyidagi protsedurani dasturlash:
```
int64 count_pairs(int n, int m, int64 T, int[] u, int[] v, int[] w)
```
* $n$: jami shaharlar soni.
* $m$: jami yo'llar soni.
* $T$: javobni topish so'ralayotgan konstanta.
* $u$ va $v$: uzunligi $m$ ga teng bo'lgan massivlar – to'g'ridan-to'g'ri yo'l bilan ulangan qo'shni shaharlar.
* $w$: uzunligi $m$ ga teng bo'lgan massiv – yo'llarni ta'mirlashga ketadigan pul miqdori.
* Protsedura $f(x,y) \le T$ bo'lgan $(x,y)$ juftliklar sonini qaytarishi kerak.
* Bu protsedura aynan bir marta chaqiriladi.

## Example
Ushbu chaqiruvni ko'raylik:

```
count_pairs(8, 9, 4, [0, 0, 1, 2, 2, 3, 3, 2, 3],
                     [1, 4, 4, 4, 6, 5, 6, 5, 7],
                     [2, 3, 3, 4, 1, 3, 2, 6, 5])
```

Protsedura javob sifatida $21$ qaytarishi kerak.

Masalan, $f(0, 7)$ ni hisoblab ko'raylik. Davlatbek avval $0 \rarr 4 \rarr 2 \rarr 6 \rarr 3 \rarr 7$ shaharlar yo'nalishida yurishi mumkin. Bunda $1, 3, 4, 6, 8$ raqamli yo'llar ta'mirtalab holatga keladi.

Avval             |  Keyin
:-------------------------:|:-------------------------:
<img src="https://i.ibb.co/DKc7n8z/graph-1.png" alt="graph-1" border="0" width="300">  |  <img src="https://i.ibb.co/PGMcSzJ/graph-2.png" alt="graph-2" border="0" width="300">

Ortga qaytish uchun Davlatbek $3$ va $8$ raqamli yo'llarni $w[3]+w[8]=4+5=9$ dador dollari evaziga ta'mirlashi kerak. Shunda u $7 \rarr 3 \rarr 5 \rarr 2 \rarr 4 \rarr 1 \rarr 0$ marshruti orqali $0$-shaharga qaytishi mumkin. Demak $f(0, 7)=9$. 

Biroq $9 \gt 4=T$ bo'lgani uchun javobga ta'sir qilmaydi. $f(0, 4)=0$ va $f(1, 2)=4$ esa javobni ikkitaga oshiradi.

## Constraints

* $2 \le n \le 200\;000$
* $1 \le m \le 200\;000$
* $0 \le T \le 2 \cdot 10^{14}$
* $0 \le u[i] < v[i] \le n-1$, barcha $0 \le i \le m-1$ uchun.
* $1 \le w[i] \le 10^9$, barcha $0 \le i \le m-1$ uchun.

Hech qaysi $i<j$ juftlik uchun $(u[i], v[i])$ va $(u[j], v[j])$ teng emas.
Ixtiyoriy shaharlar juftligida ularning biridan ikkinchisiga yo'llar orqali borish mumkin.

## Subtasks
1. (6 ball) $n \le 200$, $m=n-1$
1. (8 ball) $n \le 2000$, $m=n-1$
1. (27 ball) $m=n-1$
1. (20 ball) $T \le 100$
1. (11 ball) $n \le 200$
1. (12 ball) $n \le 2000$
1. (16 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n \; m \; T$
* qator $2+k$ ($0 \le k \le m-1$): $u[k] \; v[k] \; w[k]$

Namunaviy grader javobni quyidagi tartibda chiqaradi:

* qator $1$: `count_pairs` protsedurasi qaytargan javob.
