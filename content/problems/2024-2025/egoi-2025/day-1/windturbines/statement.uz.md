> Ushbu shart EGOI 2025 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Annaga Shimoliy dengizdagi 0,1,… , $N - 1$ raqamlangan $N$ ta turbinalaridan tashkil topgan yangi qirg'oqdan uzoq shamol stansiyasi uchun simlarni loyihalash topshirilgan. Uning maqsadi - barcha turbinalarni qirg'oqqa iloji boricha arzonroq usulda ulanishini ta'minlash.

Anna $M$ ta qurilishi mumkin lekin hali qurilmagan (potentsial) ulanishlar ro'yxatiga ega, ularning har biri ikkita shamol turbinasini o'zaro bog'laydi va ma'lum bir narxga ega. Bundan tashqari, yaqin atrofdagi shahar o'z qirg'og'iga ketma-ket kelgan [ℓ, $r $ ] oraliqdagi turbinalarni ulash xarajatlarini qoplashga rozi bo'ldi. Bu degani, ℓ≤ $ t \le r $ oraliqdagi barcha $ t$ turbinalar qirg'oqga bepulga ulangan. Agar barcha potensial ulanishlar qurilsa, istalgan bir turbinadan boshqa bir turbinaga yetib borish mumkinligi kafolatlanadi. Bundan kelib chiqqan holda, kamida bitta turbina qirg'oqga ulangan zahoti, hamma turbinalarni bir biriga borib bo'ladigan qilib ulash orqali barcha turbinalardan keladigan quvvatni qirg'oqqa o'tkazish mumkinligini anglatadi. Albatta, qirg'oqqa ko'proq ulanish arzonroq umumiy xarajatlarga olib keladi.

Annaning vazifasi har bir shamol turbinasi qirg'oqqa (ehtimol, boshqa shamol turbinalari orqali) yetib borishini ta'minlash bilan birga, ularning xarajatlari yig'indisini minimallashtiradigan potentsial ulanishlar to'plamini tanlashdir.

Aniq qaror qabul qilish uchun shahar Annaga $Q$ ta har xil [ℓ, $r$ ] oraliqlarni qirg'oqga ulash uchun taklif qiladi. Shahar ma'muriyari Annadan shu takliflarning har biri uchun minimal xarajatni hisoblashga yordam bering.

## Kirish

Kirishning birinchi qatorida uchta butun son, $N $ , $ M $ va $ Q$ sonlari kiritiladi.

Keyingi $M$ ta qatorda har birida uchta butun son mavjud, $u_i$ , $v_i$ va $c_i$ . $i$ -chi satr $u_i$ va $v_i$ shamol turbinalari o'rtasidagi potentsial aloqani tavsiflaydi, bunda uning narxi $c_i$ hisoblanadi. Ushbu ulanishlar yo'naltirilmagan va ikki xil turbinani bog'laydi. Ikkita har xil sim bir xil turbinalarni

bog'lamaydi. Agar barcha potentsial ulanishlar qurilgan bo'lsa, har qanday shamol turbinasidan boshqasiga (to'g'ridan-to'g'ri yoki bilvosita) borish mumkinligi kafolatlanadi.

Keyingi $Q$ satrlarning har birida ikkitadan butun son, ℓ $i $ va $r_i$ kiritiladi, ular ℓ,ℓ+ 1,… , _i i ri_ shamol turbinalari toʻgʻridan-toʻ shamolga ulangandangi taklifni tavsiflaydi. E'tibor bering, qirg'oq to'g'ridan-to'g'ri bitta shamol turbinasiga ulangan holat, $r_i$ = ℓ $i$ bo'lishi mumkin.

## Chiqish

$Q$ ta qatorda har bir taklifning har biri uchun bittadan butun sonni ekranga chiqaring, har biri bitta butun sonni o'z ichiga oladi, har bir turbina o'z kuchini qirg'oqqa yetkazishi uchun turbinalarni ulashning minimal qiymati.

## Chegaralar va baholash

- $2 \le N \le 100000$.

- $1 \le M \le 100000$.

- $1 \le Q \le 200000$.

- $0\le u_i,v_i\le N-1$.

- $u_i$ ≠ $v_i$ , va har bir shamol turbinasi juftligi o'rtasida ko'pi bilan bitta to'g'ridan-to'g'ri aloqa mavjud.

- 1 ≤ $c_i$ ≤1 000 000 000.

- $0\le\ell_i\le r_i\le N-1$.

Sizning yechimingiz har biri bir necha ballga ega bo'lgan subtasklarda sinovdan o'tkaziladi. Har bir subtask bir nechta testlarni o'z ichiga oladi. Subtaskdan ball olish uchun yechimingiz shu subtaskka tegishli barcha testlarga to'g'ri javob berishi kerak

|**Subtask**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|8|$M = N - 1$ va $i$-potensial bog'lanish uchun $ u = i$va $ v = i$+ 1, yaʼni barcha<br>ulanishlar qurilgan boʻlsa, ular quyidagicha bitta to'g'ri yoʻl hosil qiladi<br>0 ↔1 ↔2 ↔… ↔$ N - 1$<br>$ i $<br>$ i$|
|2|11|$N,M,Q\le2000$ va $\sum_i(r_i-\ell_i+1)\le2000$.|
|3|13|barcha $i$ uchun $r$ = ℓ+ 1<br>$ i $<br>$ i$|
|4|17|barcha $i$ uchun1 ≤$c \le 2$ i.e., har bir ulanish1yoki2narxiga ega<br>$i$|
|5|16|$\sum_i(r_i-\ell_i+1)\le400000$.|
|6|14|barcha $i$ uchunℓ= 0<br>$i$|
|7|21|Qo'shimcha cheklovlarsiz|

## Misollar

Birinchi misolda bizga potentsial ulanishlarning quyidagi grafigi berilgan.

Bizga 3 xil taklif berilgan. Birinchi taklifda 1-turbina qirg'oqqa ulangan yagona turbinadir. Bunday holda, 0 turbina va 2 turbina o'rtasidagi ulanishdan tashqari barcha ulanishlarni ushlab qurishimiz kerak, bu 2 + 3 + 6 + 3 = 14 umumiy xarajatni beradi. Keyingi taklifda 3- va 4- turbinalar qirg'oqqa ulanadi. Bu holda biz (1,0) , (1,2) va (2,4) bog'lanishlarini quramiz, 8 ga teng narx ga erishamiz. Uchinchi taklifda 0 turbinasidan tashqari hammasi qirg'oqqa ulangan. Bunday holda, biz uni boshqa bir turbinaga ulashimiz yetarli, (0,1) ulanishini tanlaymiz.

Birinchi va oltinchi namunalar 2, 5 va 7 subtaskdagi cheklovlarni qanoatlantiradi. Ikkinchi va yettinchi namunalar 1, 2, 5 va 7 subtaskdagi cheklovlariga javob beradi. Uchinchi namunalar 2, 3, 5 va 7 subtaskdagi cheklovlariga javob beradi. beshinchi namuna 2, 5, 6 va 7 subtaskdagi cheklovlarini qondiradi.



_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
5 5 3
1 0 2
0 2 5
1 2 3
3 0 6
2 4 3
1 1
3 4
1 4
```

**Chiquvchi ma’lumotlar**

```text
14
8
2
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
5 4 4
0 1 3
1 2 1
2 3 5
3 4 2
0 4
2 3
2 4
2 2
```

**Chiquvchi ma’lumotlar**

```text
0
6
4
11
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
7 7 4
6 4 3
1 4 5
3 2 4
0 3 2
5 2 3
4 0 1
1 3 1
0 1
2 3
4 5
5 6
```

**Chiquvchi ma’lumotlar**

```text
12
10
10
10
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
7 7 3
2 6 1
1 0 1
0 5 1
1 2 2
3 4 1
5 3 1
5 4 1
5 6
1 3
3 4
```

**Chiquvchi ma’lumotlar**

```text
5
4
6
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
7 7 4
6 4 3
1 4 5
3 2 4
0 3 2
5 2 3
4 0 1
1 3 1
0 3
0 6
0 1
0 4
```

**Chiquvchi ma’lumotlar**

```text
7
0
12
6
```

### 6-misol

**Kiruvchi ma’lumotlar**

```text
9 13 4
0 1 1
2 0 3
1 2 4
5 4 4
2 5 6
3 1 7
8 1 4
6 3 9
0 3 5
3 5 3
4 3 2
6 2 4
7 8 5
1 8
4 7
6 7
1 2
```

**Chiquvchi ma’lumotlar**

```text
1
14
22
24
```

### 7-misol

**Kiruvchi ma’lumotlar**

```text
6 5 1
0 1 1000000000
1 2 1000000000
2 3 1000000000
3 4 1000000000
4 5 1000000000
1 1
```

**Chiquvchi ma’lumotlar**

```text
5000000000
```

---

Manba: [EGOI 2025 rasmiy masalalar arxivi](https://github.com/egoi-org/egoi-2025/tree/e3bb2be66c3a837c57c7f8eac3b5173f40129e13). [Litsenziya: CC BY-SA](https://github.com/egoi-org/egoi-2025/blob/e3bb2be66c3a837c57c7f8eac3b5173f40129e13/day1/windturbines/problem.yaml).
