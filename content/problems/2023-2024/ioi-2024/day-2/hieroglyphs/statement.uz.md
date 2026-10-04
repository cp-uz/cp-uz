> IOI 2024 rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). PDF - asosiy manba: diagrammalar, indekslar va murakkab formulalarni rasmiy PDFdan tekshiring.

Bir qator olimlar ierogliflar ketma-ketliklari o'rtasidagi o'xshashliklarni o'rganishmoqda. Ular har bir ieroglifni nomanfiy son orqali ifodalashadi. O'rganish davomida ular ierogliflar bo'yicha quyidagi tushunchalardan foydalanishadi.

Berilgan ketma-ketlik $A$ uchun, $S $ ketma-ketlik $A $ ning **qism ketma-ketligi** deyiladi, agar $A $ dagi ba'zi (yoki hech qaysi) elementlarni o'chirish orqali $S$ ni hosil qilish mumkin bo'lsa.

Quyidagi jadvalda $A$ = [3,2,1,2] ketma-ketlikni ba'zi qism ketma-ketliklari keltirilgan.

|**Ketma-ketlik**|_A_**dan qanday hosil qilish mumkin**|
|---|---|
|[3, 2, 1, 2]|Hech qaysi element o'chirilmaydi.|
|[2, 1, 2]|[~~3~~<br>~~,~~2, 1, 2]|
|[3, 2, 2]|[3, 2,~~1~~<br>~~,~~2]|
|[3, 2]|[3,~~2~~<br>~~,~~ ~~1~~<br>~~,~~2] or [3, 2,~~1~~<br>~~,~~ ~~2~~<br>~~]~~|
|[3]|[3,~~2~~<br>~~,~~ ~~1~~<br>~~,~~ ~~2~~<br>~~]~~|
|[ ]|[~~3~~<br>~~,~~ ~~2~~<br>~~,~~ ~~1~~<br>~~,~~ ~~2~~<br>~~]~~|

Ammo, [3,3] yoki [1,3]lar $A$ ning qism ketma-ketligi emas.

$A $ va $B $ ierogliflar ketma-ketligini ko'raylik. $S $ ketma-ketlik $A $ va $B $ ketma-ketlikni **umumiy qism ketma-ketligi** bo'lishi uchun $S $ ham $A $ ni va ham $B $ ni qism ketma-ketligi bo'lishi lozim. Shuningdek, $U $ ketma-ketlik $A $ va $B$ ketma-ketlikni **universal qism ketma-ketligi** bo'lishi uchun quyidagi shartlar bajarilishi lozim:

- $U $ ketma-ketlik ham $A $ ni va ham $B$ ni qism ketma-ketligi bo'lishi,

- $A $ va $B $ ning barcha umumiy qism ketma-ketliklari $U$ ning ham qism ketma-ketligi bo'lishi lozim.

Shuni aytish mumkinki, ixtiyoriy $A$ va $B$ ketma-ketlik uchun ko'pi bilan bitta univeral qism ketmaketlik bo'lishi mumkin.

Olimlar ikkita $A$ va $B$ ierogliflar ketma-ketligini topishdi. $A $ ketma-ketlik $N $ ta ieroglifdan, $B $ ketmaketlik esa $M $ ta ieroglifdan iborat. Olimlarga $A $ va $B$ ning univeral qism ketma-ketligini topishda, yoki bunday ketma-ketlik mavjud emasligini aniqlashda yordam bering.

## Kod yozish detallari

Quyidagi funksiyani kodlashingiz lozim:

```
std::vector<int> ucs(std::vector<int> A, std::vector<int> B)
```

- $A $ : birinchi ketma-ketlikni ifodalovchi uzunligi $ N$ bo'lgan massiv.

- $B $ : ikkinchi ketma-ketlikni ifodalovchi uzunligini $ M$ bo'lgan massiv.

- Agar $A$ and $B$ uchun universal qism ketma-ketlik mavjud bo'lsa, funksiya shu qism ketmaketlikni qaytarishi lozim. Aks holda esa, funksiya [−1] qaytarishi lozim(uzunligi 1 bo'lgan faqat −1 elementdan iborat massiv).

- Bu funksiya har bir test uchun faqat bir marta chaqiriladi.

## Chegaralar

- $1 \le N \le 100\,000$

- $1 \le M \le 100\,000$

- $0 \le A[i] \le 200\,000$ har bir $0 \le i < N$ bo'lgan $i$ uchun

- $0 \le B[j] \le 200\,000$ har bir $0 \le j < M$ bo'lgan $j$ uchun

## Qism masalalar

|**Qism**<br>**masala**|**Ball**|**Qo'shimcha cheklovlar**|
|---|---|---|
|1|3|$N = M $;$ A $va$ B $ketma-ketliklarning har biri0dan$ N - 1$gacha bo'lgan<br>turli xil $ N$ta sondan iborat.|
|2|15|Ixtiyoriy butun son $k$ uchun, ($A $ dagi$k $ ga teng elementlar soni) + ($B $ dagi$k$<br>ga teng elementlar soni) ko'pi bilan3bo'ladi.|
|3|10|$A[i] \le 1$ har bir0 ≤$i < N $ bo'lgan i uchun;$B[j] \le 1$ har bir0 ≤$j < M $<br>bo'lgan$ j$uchun|
|4|16|$A $ va$B$ uchun universal qism ketma-ketlik mavjud.|
|5|14|$N \le 3000$;$ M \le 3000$|
|6|42|Qo'shimcha cheklovlar yo'q.|

## Misollar

### 1-Misol

Quyidagi funksiya chaqiruvini ko'raylik.

```
ucs([0, 0, 1, 0, 1, 2], [2, 0, 1, 0, 2])
```

Bu yerda $A$ va $B$ ning umumiy qism ketma-ketliklari quyidagilar: [ ], [0], [1], [2], [0,0], [0,1], [0,2], [1,0], [1,2], [0,0,2], [0,1,0], [0,1,2], [1,0,2] va [0,1,0,2].

[0,1,0,2] ketma-ketlik $A$ va $B$ ning umumiy qism ketma-ketligi bo'lgani va $A$ va $B$ ning barcha umumiy qism ketma-ketliklari [0,1,0,2] ning qism ketma-ketligi bo'lgani uchun, bu funksiya [0,1,0,2] qaytarishi lozim.

### 2-Misol

Quyidagi funksiya chaqiruvini ko'raylik.

```
ucs([0, 0, 2], [1, 1])
```

Bu yerda $A$ va $B$ ning yagona umumiy qism ketma-ketligi bo'sh ketma-ketlik [ ]. Shuning uchun funksiya bo'sh massivni [ ] qaytarishi lozim.

### 3-Misol

Quyidagi funksiya chaqiruvini ko'raylik.

```
ucs([0, 1, 0], [1, 0, 1])
```

Bu yerda $A$ va $B$ ning umumiy qism ketma-ketliklari quyidagilar: [ ],[0],[1],[0,1] va [1,0]. Shuni ko'rsatish mumkinki, bu ketma-ketliklar uchun universal qism ketma-ketlik mavjud emas. Shuning uchun, funksiya [−1] qaytarishi lozim.

## Namunaviy Grader

Kiritish formati:

```
N  M
A[0]  A[1]  ...  A[N-1]
B[0]  B[1]  ...  B[M-1]
```

Chiqarish formati:

```
T
R[0]  R[1]  ...  R[T-1]
```

Bu yerda, $R $ `ucs` funksiya qaytargan massiv va $ T$ uning uzunligini bildiradi.
