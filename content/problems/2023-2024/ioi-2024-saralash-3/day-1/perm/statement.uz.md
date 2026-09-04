# Permute-inator (perm)

Asadulloda uzunligi $n$ bo'lgan $p$ permutatsiya bor, bunda elementlar $0$ dan $n-1$ gacha raqamlangan. Permutatsiyada $[0, n-1]$ oralig'idagi har bir son aynan bir marta uchraydi.

Biroq, bu permutatsiyasini yovuz Dr. Dilyor o'g'irlab ketti va Asadullo bilan o'yin o'ynashni taklif qildi. 

Aytaylik, Asadullo uzunligi $m$ bo'lgan $x[0], x[1], \ldots, x[m-1]$ indekslarni tanlasin. Bunda barcha $0 \le i \le m - 1$ uchun $0 \le x[i] \le n - 1$. Bunda indekslar har xil bo'lishi **shart&nbsp;emas**. Bu so'rovga javoban Dr. Dilyor $p[x[i]] > p[x[i + 1]]$ bo'lgan ($0 \le i \le m-2$) indekslar sonini qaytaradi.

Masalan, $n=6$ va $p=[3, 0, 2, 5, 1, 4]$ bo'lsin. Agar Asadullo $x=[0, 2, 5, 0, 3]$ tanlasa, Dr. Dilyor $2$ deb javob beradi, chunki $p[x[0]] = 3 > 2= p[x[1]]$ va $p[x[2]] = 4 > 3 = p[x[3]]$.
Agar Asadullo $x=[1, 2, 1]$ indekslarni tanlasa Dr. Dilyor unga $1$ deb javob javob  qaytaradi, chunki $p[x[1]] = 2 > 0 = p[x[2]]$.

So'rovlar berish orqali Asadulloga o'zining permutatsiyasini tiklashga yordam bering.

## Implementation details
Vazifangiz bitta protsedurani dasturlash:
```
int[] find_permutation(int n)
```
* $n$: permutatsiyaning uzunligi.
* Protsedura o'g'irlangan permutatsiyani qaytarishi kerak.
* Bu protsedura aynan bir marta chaqiriladi.

Shuningdek, quyidagi protseduralarni chaqirishingiz mumkin. 

```
int ask(int[] x)
```
* $x$: so'raladigan indekslar. Bunda barcha $0 \le i \le m - 1$ uchun $0 \le x[i] \le n - 1$ shart bajarilishi kerak. 
* Protsedura $p[x[i]] > p[x[i+1]]$ bo'lgan $0 \le i \le m-2$ indekslar sonini qaytaradi.
* Bu protsedurani ko'pi bilan $10\;000$ marta chaqirishingiz mumkin.
* Barcha so'rovlardagi $m$ qiymatlar yig'indisi $1\;000\;000$ dan oshmasligi kerak.

## Example
Masala shartidagi misolni ko'raylik.
Sizga quyidagi chaqiruv qilindi:
```
find_permutation(6)
```

Yo'qolgan permutatsiyaning uzunligi $6$ ga teng ekani haqida ma'lumot olasiz. 

Aytaylik, keyin quyidagi chaqiruvni qilsangiz:

```
ask([0, 2, 5, 0, 3])
```

Bu protsedura javob sifatida $2$ qaytaradi.

So'ngra quyidagi chaqiruvni qilsangiz:

```
ask([1, 2, 1])
```

Protsedura javob sifatida $1$ qaytaradi.

Shundan so'ng, qandaydir usul yordamida $p=[3, 0, 2, 5, 1, 4]$ ekanini aniqladingiz deylik. U holda `find_permutation` protsedurasi javob sifatida $[3, 0, 2, 5, 1, 4]$ qaytarishi kerak.

## Constraints

* $1 \le n \le 128$
* $0 \le p[i] \le n - 1$ (barcha $0 \le i \le n - 1$ uchun)
* $p$ massivning barcha elementlari har xil

## Subtasks

1. (5 ball) $n \le 7$
2. (95 ball) Qo'shimcha chegaralarsiz.
**Shuningdek**, $2$-subtaskda qism ball olishingiz mumkin. Aytaylik, 2-subtask testlari orasida eng ko'p ishlatgan so'rovlaringiz soni $q$ bo'lsin. U holda, quyidagicha ball olasiz: 

Shart         |  Ball
:----------------:|:---------------------------:
$10\;000 \lt q$             | $0$ 
$1000 \lt q \le 10\;000$    | $8$
$700 \lt q \le 1000$        | $19$
$127 \lt q \le 700$         | $15 + 70 \cdot \frac{128}{q}$
$q \le 127$                 | $95$


## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n$
* qator $2$: $p[0] \; p[1] \; \ldots \; p[n - 1]$

Agarda dasturingiz $p$ permutatsiyani to'g'ri topsa ekranga `Accepted: q` yozuvini chiqaradi, bu yerda $q$ - ishlatilgan so'rovlar soni. Aks holda, `Failed: MSG` so'zlarini chiqaradi, bu yerda `MSG` quyidagilardan biri bo'lishi mumkin:
* `Invalid index` – qaysidir $i$ uchun $0 \le x[i] \le n-1$ shart bajarilmasa.
* `Too many queries` – so'rovlar soni $10\;000$ tadan oshib ketsa yoki so'rovlardagi $m$ qiymatlar yig'indisi $1\;000\;000$ dan oshib ketsa.
* `Wrong guess` – $p$ permutatsiya noto'g'ri topilgan bo'lsa. U holda keyingi qatorda $a[0] \; a[1] \; \ldots \; a[n - 1]$ chiqariladi, bunda $a$ – `find_permutation` protsedurasi qaytargan massiv.
