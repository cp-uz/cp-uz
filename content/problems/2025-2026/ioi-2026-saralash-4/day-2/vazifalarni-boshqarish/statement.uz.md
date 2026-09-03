Bulutli infratuzilma ikkita asosiy qayta ishlovchi blokdan iborat: **Server A** va **Server B**. Ular manzillari $-10^9$ dan $10^9$ gacha bo‘lgan ulkan, sinxronlashtirilgan virtual xotira maydonida ishlaydi.

Dastlab, Server A ning o‘qish/yozish boshi $A$ manzilda, Server B ning boshi esa $B$ manzilda joylashgan.

Tizimga ketma-ket bajarilishi shart bo‘lgan $N$ ta muhim ma’lumot yangilash hodisalari keladi. $i$-hodisa ($0 \le i \le N-1$) $T[i]$ xotira manzilida sodir bo‘ladi. Qattiq bog‘liqliklar sababli hodisalar **aynan berilgan tartibda** bajarilishi kerak (0-hodisa, so‘ng 1-hodisa, ..., $N-1$-hodisa).

Har bir hodisa uchun Server A yoki Server B dan biri tegishli manzilga ko‘chib borib, yangilanishni bajarishi kerak. Server boshining $X$ manzildan $Y$ manzilga ko‘chish narxi $|X-Y|$ energiya birligiga teng.

Barcha $N$ ta yangilanishni bajarish uchun zarur bo‘ladigan minimal umumiy energiya sarfini toping.

## Implementation Details

Quyidagi funksiyani yozishingiz kerak:

```cpp

long long min_energy(int N, int A, int B, vector<int> T);
```

- `N` — ma’lumot yangilash hodisalari soni.

- `A` — Server A boshining boshlang‘ich manzili.

- `B` — Server B boshining boshlang‘ich manzili.

- `T` — uzunligi `N` bo‘lgan massiv, unda ketma-ket hodisalar sodir bo‘ladigan manzillar berilgan.

- Funksiya `long long` turidagi bitta son qaytarishi kerak — serverlar boshlarini ko‘chirish uchun kerak bo‘lgan minimal umumiy energiya.

## Constraints

- $1 \le N \le 3 \cdot 10^5$

- $-10^9 \le A, B \le 10^9$

- $-10^9 \le T[i] \le 10^9$ barcha $0 \le i \le N-1$ uchun

## Subtasks

| Qism | Ball | Cheklovlar |
| --- | --- | --- |
| 1 | 10 | $\lvert T[i] \rvert, \lvert A \rvert \le 1000$, $B = 10^9$ |
| 2 | 15 | $N \le 20$ |
| 3 | 20 | $N \le 3000$ |
| 4 | 15 | $N \le 10^5$, $\lvert T[i] \rvert, \lvert A \rvert, \lvert B \rvert \le 100$ |
| 5 | 25 | $\lvert T[i] \rvert, \lvert A \rvert, \lvert B \rvert \le 2 \cdot 10^5$ |
| 6 | 15 | Qo‘shimcha cheklovlar yo‘q |

## Examples

### Misol 1

Quyidagi chaqiriqni ko‘rib chiqamiz:

```cpp

min_energy(8, 5, 25, {8, 22, 12, 18, 14, 16, 30, 2});
```

Funksiya `44` qiymatini qaytarishi kerak.

**Izoh:**

- **Server A** 5 manzildan 8 manzilga ko‘chadi va 0-hodisani bajaradi (sarflangan energiya: $|5-8|=3$).

- **Server B** 25 manzildan 22 manzilga ko‘chadi va 1-hodisani bajaradi (sarflangan energiya: $|25-22|=3$).

- **Server A** 8 manzildan 12 manzilga ko‘chadi va 2-hodisani bajaradi (sarflangan energiya: $|8-12|=4$).

- **Server B** 22 manzildan 18 manzilga ko‘chadi va 3-hodisani bajaradi (sarflangan energiya: $|22-18|=4$).

- **Server A** 12 manzildan 14 manzilga ko‘chadi va 4-hodisani bajaradi (sarflangan energiya: $|12-14|=2$).

- **Server B** 18 manzildan 16 manzilga ko‘chadi va 5-hodisani bajaradi (sarflangan energiya: $|18-16|=2$).

- **Server B** 16 manzildan 30 manzilga ko‘chadi va 6-hodisani bajaradi (sarflangan energiya: $|16-30|=14$).

- **Server A** 14 manzildan 2 manzilga ko‘chadi va 7-hodisani bajaradi (sarflangan energiya: $|14-2|=12$).

Minimal umumiy energiya sarfi:

$$
3+3+4+4+2+2+14+12=44
$$

### Misol 2

Quyidagi chaqiriqni ko‘rib chiqamiz:

```cpp

min_energy(5, 100000, 500000, {120000, 450000, 130000, 460000, 140000});
```

Funksiya `100000` qiymatini qaytarishi kerak.

**Izoh:**

- **Server A** 100000 manzildan 120000 manzilga ko‘chadi (20000 energiya).

- **Server B** 500000 manzildan 450000 manzilga ko‘chadi (50000 energiya).

- **Server A** 120000 manzildan 130000 manzilga ko‘chadi (10000 energiya).

- **Server B** 450000 manzildan 460000 manzilga ko‘chadi (10000 energiya).

- **Server A** 130000 manzildan 140000 manzilga ko‘chadi (10000 energiya).

Minimal umumiy energiya sarfi:

$$
20000+50000+10000+10000+10000=100000
$$

## Sample Grader

Namunaviy grader kirishni quyidagi formatda o‘qiydi:

- 1-qator: `N`

- 2-qator: `A B`

- 3-qator: `T[0] T[1] ... T[N-1]`

Grader `min_energy` funksiyasini bir marta chaqiradi va qaytgan natijani quyidagi formatda chiqaradi:

- 1-qator: `min_energy` funksiyasi qaytargan qiymat

## Namunalar

### 1-namuna

**Kirish:**

```text
8 5 25
8 22 12 18 14 16 30 2
```

**Chiqish:**

```text
OK
44
```

### 2-namuna

**Kirish:**

```text
5 100000 500000
120000 450000 130000 460000 140000
```

**Chiqish:**

```text
OK
100000
```
