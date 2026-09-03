Muhammad al-Xorazmiy nomidagi ixtisoslashtirilgan maktabida yangi dars xonasi ochilmoqda va uni roppa-rosa $n$ ta ikki kishilik partalar bilan jihozlash kerak.

Partalar $k$ xil turda bo'lib, har bir tur o'zi mo'ljallangan bo'ylar oralig'i bilan tavsiflanadi. $i$-tur parta bo'yi $L_i$ dan $R_i$ gacha (chegaralari bilan birga) bo'lgan har qanday o'quvchiga qulay keladi. O'ziga mos kelmaydigan partaga o'tirgan o'quvchi noqulay his qiladi va biz bu **noqulaylik**ni o'quvchi bo'yidan partaning eng yaqin chegarasigacha bo'lgan masofa sifatida o'lchaymiz. Aniqroq qilib aytganda, bo'yi $h$ bo'lgan o'quvchi $i$-tur partaga o'tirsa, noqulaylik $h < L_i$ bo'lganda $L_i - h$ ga, $h > R_i$ bo'lganda $h - R_i$ ga va $L_i \le h \le R_i$ bo'lganda $0$ ga teng bo'ladi.

Masalan, $L_i = 100$ va $R_i = 120$ bo'lgan parta bo'yi $80$ bo'lgan o'quvchi uchun $20$, bo'yi $130$ bo'lgan o'quvchi uchun $10$ va bo'yi $105$ bo'lgan o'quvchi uchun $0$ noqulaylik keltiradi.

Dars xonasidan navbatma-navbat $m$ ta sinflar foydalanadi. Har bir sinf(group)da roppa-rosa $2n$ ta o'quvchidan iborat va ularning barchasining bo'yi oldindan ma'lum. Siz oldin $n$ ta partani sotib olasiz, sotib olganingizdan so'ng ular darsxonaga o'rnatiladi va doimiy qoladi; istalgan turdagi nol yoki bir nechta marta sotib olish mumkin. Ma'lum bir sinf darsxonaga kirganda, undagi $2n$ nafar o'quvchisi har bir partaga roppa-rosa ikkitadan nafardan o'tirishadi.

Sizning vazifangiz — qaysi $n$ ta partani sotib olishni va har bir guruhni qanday joylashtirishni shunday tanlashki, barcha $m$ ta guruhdagi barcha o'quvchilar bo'yicha **umumiy noqulaylik** iloji boricha eng kichik bo'lsin.

## Implementation details

Quyidagi, `seats.h` da e'lon qilingan funksiyani to'ldirishingiz kerak.

```cpp

long long minimum_discomfort(int m, int n, int k,
                             vector<int> L, vector<int> R,
                             vector<vector<int>> groups)
```

- $m$: sinf xonasidan foydalanadigan sinflar soni.

- $n$: sotib olinadigan partalar soni.

- $k$: parta turlari soni.

- `L`, `R`: uzunligi $k$ bo'lgan vektorlar. $i$-tur parta bo'yi `L[i]` dan

`R[i]` gacha bo'lgan o'quvchilarga mos keladi (indekslar $0 \le i \le k-1$).

- `groups`: $m$ ta vektordan iborat vektor, har birining uzunligi $2n$.

`groups[i][0], groups[i][1], ..., groups[i][2n-1]` qiymatlari $(i+1)$-sinfdagi $2n$ ta o'quvchining bo'ylari.

- Bu funksiya erishish mumkin bo'lgan minimal umumiy noqulaylikni qaytarishi

kerak.

- U roppa-rosa bir marta chaqiriladi.

## Constraints

- $1 \le m, n \le 200\,000$ va $m \cdot n \le 200\,000$

- $2 \le k \le 200\,000$

- har bir $i$ parta turi uchun $1 \le L_i \le R_i \le 10^9$

- har bir o'quvchi uchun $1 \le \texttt{groups}[i][j] \le 10^9$

## Subtasks

| Subtask | Ball | $m$ | $n$ | $k$ | Qo'shimcha | Kerakli qism masala |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 10 | $m \le 100$ | $n = 1$ | $k \le 50$ | — | — |
| 2 | 10 | $m = 1$ | $n \le 1000$ | $k \le 50$ | — | — |
| 3 | 10 | $m \le 50$ | $n \le 5$ | $k \le 3$ | — | — |
| 4 | 10 | $m \le 100$ | $n \le 1000$ | $k = 2$ | — | — |
| 5 | 10 | $m \le 100$ | $n \le 1000$ | $k \le 3$ | — | 3, 4 |
| 6 | 10 | $m \le 100$ | $n \le 1000$ | $k \le 50$ | $L_i = R_i$ | — |
| 7 | 10 | $m \le 100$ | $n \le 1000$ | $k \le 50$ | — | 0, 1–6 |
| 8 | 8 | — | — | — | $L_i = R_i$ | 6 |
| 9 | 8 | $m \le 100$ | — | — | — | 0, 1–7 |
| 10 | 10 | — | $n \le 100$ | — | — | 0, 1, 3 |
| 11 | 4 | — | — | — | — | 0, 1–10 |

Cheklov ustunidagi tire ("—") faqat umumiy cheklovlar amal qilishini bildiradi. $0$-qism masala misol testlarini bildiradi. Qism masala o'z ballini faqat "Kerakli qism masala" ustunida ko'rsatilgan barcha qism masalalar ham to'liq yechilgan taqdirdagina oladi. Ballar yig'indisi $100$ ga teng.

## Examples

### 1-misol

```cpp

minimum_discomfort(1, 2, 2, [5, 50], [25, 90], [[60, 5, 10, 40]])
```

Bu chaqiruv `10` ni qaytaradi.

Bitta guruh bor. Har bir turdan bittadan parta sotib olish optimaldir. Bo'yi $5$ va $10$ bo'lgan o'quvchilarni 1-tur partaga ($[5, 25]$ oralig'i, ikkalasi ham mos keladi), bo'yi $40$ va $60$ bo'lgan o'quvchilarni esa 2-tur partaga ($[50, 90]$ oralig'i) o'tqazamiz. Faqat bo'yi $40$ bo'lgan o'quvchi noqulay o'tiradi, uning noqulayligi $50 - 40 = 10$, demak umumiy noqulaylik $10$ ga teng.

Xuddi shu test namunaviy grader kirish formatida:

```cpp

1 2 2
5 25
50 90
60 5 10 40
```

Kutilayotgan natija:

```cpp

10
```

### 2-misol

```cpp

minimum_discomfort(2, 3, 3, [200, 300, 100], [400, 500, 600],
                   [[300, 330, 440, 40, 30, 300],
                    [150, 250, 350, 450, 550, 300]])
```

Bu chaqiruv `130` ni qaytaradi.

Xuddi shu test namunaviy grader kirish formatida:

```cpp

2 3 3
200 400
300 500
100 600
300 330 440 40 30 300
150 250 350 450 550 300
```

Kutilayotgan natija:

```cpp

130
```

## Sample grader

Namunaviy grader kirishni quyidagi formatda o'qiydi:

- $1$-satr: $m\;n\;k$

- $1 + i$-satr ($1 \le i \le k$ uchun): $L_i\;R_i$ — $i$-tur partaning bo'y

oralig'i

- $1 + k + i$-satr ($1 \le i \le m$ uchun): $2n$ ta butun son

$h_1\;h_2\;\ldots\;h_{2n}$ — $i$-guruhdagi o'quvchilarning bo'ylari

So'ng grader bu argumentlar bilan `minimum_discomfort` ni bir marta chaqiradi va uning qaytargan qiymatini chiqaradi:

- $1$-satr: bitta son - minimal umumiy noqulaylik.

## Namunalar

### 1-namuna

**Kirish:**

```text
1 2 2
5 25
50 90
60 5 10 40
```

**Chiqish:**

```text
OK
10
```

### 2-namuna

**Kirish:**

```text
2 3 3
200 400
300 500
100 600
300 330 440 40 30 300
150 250 350 450 550 300
```

**Chiqish:**

```text
OK
130
```

### 3-namuna

**Kirish:**

```text
1 3 4
10 100
200 200
10 100
300 1000
5 10 20 15 200 90
```

**Chiqish:**

```text
OK
105
```
