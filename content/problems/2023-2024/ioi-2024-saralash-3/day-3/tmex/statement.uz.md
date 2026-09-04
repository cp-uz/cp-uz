# Tree MEX (tmex)

Gagorlandtiria mamlakatida $n$ ta shahar bor, bunda shaharlar $0$ dan $n-1$ gacha raqamlangan. Barcha $0 \le i \le n-2$ uchun $u[i]$ va $v[i]$  raqamli shaharlar o'rtasida ikki tomonli yo'l bor hamda yo'lning uzunligi $w[i]$ metr.

Shuningdek, har bir shahar aholisining sevimli soni bor. $i$-shaharning sevimli soni $a[i]$ ga teng. Buni qarangki, barcha $a[i]$ qiymatlar har xil.

$\rm dist$$(a,b)$ deganda $a$ shahardan $b$ shahargacha eng yaqin marshrut orqali borgandagi masofani aytaylik.

Gagorlandtiria prezidenti sizga $q$ ta so'rov beradi. Har bir so'rovda sizga $x$ shahar va $k$ soni beriladi. Agar $\rm dist$$(x, y) \le k$ bo'lgan $y$ shaharlarning sevimli raqamlari to'plamini $S$ desak, siz $\rm mex$$(S)$ ning qiymatini topishingiz kerak.

MEX - **M**inimum **Ex**cluded, to'plamda yo'q bo'lgan eng kichik nomanfiy son. Masalan, $\rm mex$$(\{1,2,0,7,3\})=4$ va $\rm mex$$(\{3,1\})=0$.

## Implementation details
Vazifangiz ikkita protsedurani dasturlash:
```
void init(int n, int[] a, int[] u, int[] v, int[] w)
```
* $n$: jami shaharlar soni.
* $a$: uzunligi $n$ ga teng massiv – shaharlar aholisining sevimli sonlari.
* $u$ va $v$: uzunligi $n-1$ ga teng massivlar – qo'shni shaharlar.
* $w$: uzunligi $n-1$ ga teng massiv – yo'llar uzunliklari.
* Protsedura hech narsa qaytarmaydi.
* Bu protsedura aynan bir marta chaqiriladi.

```
int query(int x, int k)
```
* $x$: so'rovdagi shahar raqami.
* $k$: so'ralayotgan masofa.
* Protsedura $\rm dist$$(x, y) \le k$ bo'lgan $y$ shaharlarning sevimli raqamlari to'plamining MEX qiymatini qaytarishi kerak.
* Bu protsedura aynan $q$ marta chaqiriladi.

## Example
Ushbu chaqiruvlar ketma-ketligini ko'raylik:

```
init(6, [4, 0, 5, 3, 2, 1], [0, 1, 3, 3, 1],
                            [1, 3, 5, 4, 2],
                            [3, 1, 2, 6, 2])
```

Gagorlandtiria quyidagi ko'rinishda. Bunda qizil rang bilan shahar aholisining sevimli soni yozilgan.

<img src="https://i.ibb.co/m5mKxG0/treemex.png" alt="treemex" border="0">

So'ngra quyidagi chaqiruv qilinsin:

```
query(3, 3)
```

$x=3$ shahardan $k=3$ masofa ichida joylashgan shaharlar bu $1, 2, 3, 5$. Demak $S=\{a[1], a[2], a[3], a[5]\} = \{0, 5, 3, 1\}$. To'plamning MEX qiymati esa $2$ ga teng. Protsedura $2$ qaytarishi kerak. 

Yana bir chaqiruv ko'raylik:
```
query(2, 0)
```

$2$-shahardan $0$ masofa ichida joylashgan yagona shahar bu $2$. $S=\{a[2]\} = \{5\}$. Protsedura $0$ qaytarishi kerak.

## Constraints

* $1 \le n \le 200\;000$
* $1 \le q \le 200\;000$
* $0 \le a[i] \le 10^9$, barcha $0 \le i \le n - 1$ uchun
* $0 \le u[i] < v[i] \le n - 1$, barcha $0 \le i \le n - 2$ uchun
* $1 \le w[i] \le 10^9$, barcha $0 \le i \le n - 2$ uchun
* $0 \le x \le n-1$, barcha so'rovlar uchun
* $0 \le k \le 10^{16}$, barcha so'rovlar uchun
* barcha $a[i]$ qiymatlar har xil

Gagorlandtiriada har bir shahardan boshqa barchasiga yo'llar orqali yetib borish mumkinligi kafolatlanadi.

## Subtasks

1. (10 ball) $a[i]=i$, $u[i]=0$, $v[i]=i+1$
1. (25 ball) $u[i]=i$, $v[i]=i+1$
1. (15 ball) $n, q \le 2000$
1. (50 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n \; q$
* qator $2$: $a[0] \; a[1] \; \ldots \; a[n-1]$
* qator $3+i$ ($0 \le i \le n-2$): $u[i] \; v[i] \; w[i]$
* qator $2+n+i$ ($0 \le i \le q-1$): $x \; k$

Namunaviy grader javoblarni quyidagi tartibda chiqaradi:

* qator $1 + i$ ($0 \le k \le q - 1$): $i$-tartibdagi `query` so'roviga qaytarilgan javob.
