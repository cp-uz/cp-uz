Bir xil uzunlikdagi sonlar ketma-ketligi **deyarli teng** deyiladi, agar ular **aynan bitta** pozitsiyada farq qilsa. Bir xil uzunlikdagi ikki ketma-ketlik **deyarli anagramma** deyiladi, agar birinchi ketma-ketlik elementlarini qayta tartiblash orqali ikkinchi ketma-ketlikdan deyarli teng bo'lgan ketma-ketlikni hosil qilish mumkin bo'lsa.

Masalan, $(1, 3, 2)$ va $(2, 3, 3)$ ketma-ketliklari deyarli anagramma, chunki birinchi ketma-ketlik elementlaridan $(2, 3, 1)$ ketma-ketligini hosil qilish mumkin, u ikkinchi ketma-ketlikdan faqat uchinchi pozitsiyada farq qiladi.

Sizga $n$ ta butun sondan iborat $x = x_1, x_2, \ldots, x_n$ massiv va $q$ ta so'rov berilgan. Har bir so'rov $x$ ning ketma-ket elementlaridan iborat bir xil uzunlikdagi ikkita kesmadan tashkil topadi. Har bir so'rov uchun bu ikki kesma deyarli anagramma yoki yo'qligini aniqlang.

So'rovda kesmalar birinchi va oxirgi elementlarining indekslari orqali beriladi. Aniqroq aytganda, $a$ va $b$ indekslari uchun $x_a^b$ massivi $x$ ning $a$-elementidan $b$-elementigacha bo'lgan elementlar ketma-ketligidir: $x_a^b = x_a, x_{a+1}, \ldots, x_b$. Har bir so'rov bir xil uzunlikdagi ikki kesmani bildiruvchi $(a, b)$ va $(c, d)$ indeks juftliklaridan iborat; agar $x_a^b$ va $x_c^d$ kesmalari deyarli anagramma bo'lsa, so'rov javobi "`YES`", aks holda "`NO`" bo'ladi.

## Implementatsiya tafsilotlari

Quyidagi ikki protsedurani yozishingiz kerak.

```cpp

void init(int n, vector<int> x)
```

- $n$: massiv uzunligi.

- $x$: uzunligi $n$ bo'lgan vektor, massiv elementlari ($x[0], \ldots, x[n-1]$).

- Bu protsedura `query` chaqiruvlaridan oldin aynan bir marta chaqiriladi.

```cpp

bool query(int a, int b, int c, int d)
```

- $a, b, c, d$: $x_a^b$ va $x_c^d$ kesmalarini bildiruvchi 1 dan boshlab raqamlangan indekslar ($1 \le a \le b \le n$, $1 \le c \le d \le n$, $b - a = d - c$).

- Agar ikki kesma deyarli anagramma bo'lsa (javob "`YES`"), protsedura `true`, aks holda (javob "`NO`") `false` qaytarishi kerak.

- U aynan $q$ marta chaqiriladi.

## Cheklovlar

- $1 \le n, q \le 100\,000$

- $0 \le x_j \le 10^9$

## Subtasklar

| Subtask | Ball | Cheklovlar |
| --- | --- | --- |
| 1 | 10 | $1 \le n, q \le 1\,000$ |
| 2 | 15 | $1 \le n, q \le 50\,000$, $\;0 \le x_j \le 30$ |
| 3 | 30 | $1 \le n \le 100\,000$, $\;1 \le q \le 10\,000$ |
| 4 | 45 | $1 \le n, q \le 100\,000$ |

## Misol

Quyidagi chaqiruvlarni ko'rib chiqing:

```cpp

init(6, [1, 3, 2, 3, 1, 2])
query(1, 1, 2, 2)    returns true    (YES)
query(2, 3, 3, 4)    returns false   (NO)
query(2, 3, 4, 5)    returns true    (YES)
query(1, 3, 2, 4)    returns true    (YES)
```

Masalan, uchinchi so'rovda kesmalar $x_2^3 = (3, 2)$ va $x_4^5 = (3, 1)$ bo'lib, ular deyarli anagramma, shuning uchun `query(2, 3, 4, 5)` `true` qaytaradi.

## Sample grader

Sample grader inputni quyidagi formatda o'qiydi:

- line $1$: $n\;q$

- line $2$: $x_1\;x_2\;\ldots\;x_n$

- line $3 + j$ ($0 \le j < q$ uchun): $a\;b\;c\;d$ — `query` ning $(j+1)$-chaqiruvi parametrlari

U massiv bilan `init` ni bir marta, keyin $q$ ta so'rovning har biri uchun `query` ni bir marta chaqiradi va qaytarilgan javoblarni quyidagi formatda chiqaradi:

- line $1 + j$ ($0 \le j < q$ uchun): agar `query` ning $(j+1)$-chaqiruvi `true` qaytargan bo'lsa `YES`, aks holda `NO`

## Namunalar

### 1-namuna

**Kirish:**

```text
6 4
1 3 2 3 1 2
1 1 2 2
2 3 3 4
2 3 4 5
1 3 2 4
```

**Chiqish:**

```text
YES
NO
YES
YES
```
