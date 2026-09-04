<a href="https://imgbb.com/"><img src="https://i.ibb.co/JR695Fp/IOI-2024-Wide-Colored-on-White-BG.png" alt="IOI-2024-Wide-Colored-on-White-BG" style="float: right;" width="200" border="0"></a>

# Triangles (tri)

Ulug'bekda $n$ dona tayoqcha bor, bunda tayoqchalar $0$ dan $n-1$ gacha raqamlangan hamda $i$-tayoqning uzunligi $a[i]$ metr. 

Ulug'bek yaqinda uchburchak tengsizligi haqida o'qib qoldi. Unga ko'ra, uzunliklari $x, y, z$ metr bo'lgan tayoqlardan uchburchak yasash uchun, quyidagi shartlar bajarilishi kerak: $(x+y>z)$, $(x+z>y)$, hamda $(y+z>x)$. Bu uchburchakning perimetri esa $x+y+z$ metrga teng.

Ulug'bek sizga $q$ marta so'rov beradi:
- $p \; v$ -> $p$-tayoqning uzunligini $v$ metrga o'zgartirib qo'yish, ya'ni $a[p] := v$ qilish
- $l \; r$ -> faqatgina $a[l], a[l+1], \ldots, a[r]$ tayoqchalarni ishlatgan holda eng katta perimetrga ega uchburchakni topish. Bunda har bir tayoqchani ko'pi bilan bir marta ishlatish mumkin.

Ulug'bekning so'rovlariga javob bering.

## Implementation details
Vazifangiz uchta protsedurani dasturlash:
```
void init(int[] a)
```
* $a$: uzunligi $n$ ga teng bo'lgan massiv -- tayoqlar uzunliklari
* Protsedura hech narsa qaytarmaydi.
* Bu protsedura aynan bir marta chaqiriladi.

```
void change(int p, int v)
```
* $p$: o'zgartirish kerak bo'lgan tayoqning indeksi
* $v$: tayoqning uzunligi
* Protsedura hech narsa qaytarmaydi.

```
int answer(int l, int r)
```
* $l$, $r$: sizdan so'ralgan oraliq
* Bu protsedura oraliqdagi tayoqchalardan hosil qilish mumkin bo'lgan eng katta perimetrni qaytarishi kerak. 
* Agar hech qaysi tayoqlar uchligi uchburchak tengsizligini qanoatlantirmasa, javob sifatida $0$ qaytaring.

`change` hamda `answer` protseduralari jami $q$ marta chaqiriladi.

## Example
Ushbu chaqiruvlar ketma-ketligini ko'raylik:

```
init([3, 1, 4, 1, 5, 9, 2])
```
Demak $n=7$ va $a = [3, 1, 4, 1, 5, 9, 2].$

```
answer(2, 6)
```

$[2, 6]$ oralig'idagi tayoqchalar uzunliklari $[4, 1, 5, 9, 2]$ ga teng. Biz $a[2] = 4$, $a[4] = 5$, hamda $a[6]=2$ tayoqchalar yordamida perimetri $4+5+2=11$ metrga teng bo'lgan uchburchak yasashimiz mumkin.
Protsedura javob sifatida $11$ qaytarishi kerak.

```
change(0, 7)
```

Bu chaqiruvda $a[0] := 7$ amalni bajarish kerak. $a=[7,1,4,1,5,9,2]$.

```
answer(0, 2)
```

Bu chaqiruvda $[0, 2]$ oraliq uchun javobni topish kerak. Yagona uchlik $(7,1,4)$ uchburchak tengsizligini qanoatlantirmagani uchun, protsedura $0$ qaytarishi kerak.

## Constraints

* $1 \le n \le 200\;000$
* $1 \le q \le 200\;000$
* $1 \le a[i] \le 500\;000\;000$ (barcha $0 \le i \le n - 1$ uchun)
* $0 \le p \le n - 1$
* $1 \le v \le 500\;000\;000$
* $0 \le l \le r \le n-1$

## Subtasks

1. (3 ball) $n, q \le 80$
1. (7 ball) $n, q \le 400$
1. (16 ball) $n, q \le 3000$
1. (15 ball) Barcha $a[i]$ va $v$ qiymatlar 2ning butun darajasiga teng.
1. (16 ball) `change` so'rovlari yo'q.
1. (20 ball) $a[i], v \le 100\;000$
1. (10 ball) $n \le 50\;000$
1. (13 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n \; q$
* qator $2$: $a[0] \; a[1] \; \ldots \; a[n - 1]$
* qator $3 + k$ ($0 \le k \le q - 1$): $0 \; p \; v$ yoki $1 \; l \; r$. Bunda $0$ – `change` amali uchun, $1$ – `answer` uchun.

`answer` so'rovlar soni $w$ ta bo'lsin. U holda namunaviy grader javoblarni quyidagi tartibda chiqaradi:

* qator $1 + k$ ($0 \le k \le w - 1$): $k$-tartibdagi `answer` so'roviga qaytarilgan javob.