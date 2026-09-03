Dilnoza uzun patnisda somsa yopdi. Patnisga chapdan o'ngga qaraganda, har bir somsa yoki go'shtli somsa, yoki qovoqli somsa ekanligini ko'rsa bo'ladi. Patnisni $a_1, a_2, \ldots, a_n$ massiv ko'rinishida yozamiz. Bu yerda $a_i=-1$ bo'lsa, $i$-somsa go'shtli, $a_i=+1$ bo'lsa, qovoqli ekanini bildiradi.

Dilnozaning ikkita o'g'li bor: Timurxon va Shohruhxon. Ularning ikkalasi ham qovoqli somsani go'shtli somsadan ko'ra ko'proq yaxshi ko'radi.

Bolalarga bo'lishish uchun bir qator somsalar berilganda, ular uni ikki chetidan yeya boshlaydi. Shohruhxon chap tomondan, Timurxon esa o'ng tomondan yeydi. Ikkalasi birgalikda butun qatorni yeb tugatadi. Lekin ular uchrashadigan joy oldindan belgilangan emas: bu har bir bolaning o'sha kuni qanchalik och va qanchalik tez ekaniga bog'liq, va Dilnoza buni oldindan bila olmaydi. Shunday qilib, qator qandaydir noma'lum joyda chap qism (Shohruhxon uchun) va o'ng qism (Timurxon uchun) ga bo'linadi. Qismlardan biri bo'sh bo'lishi mumkin; u holda bir bola butun qatorni yeydi, ikkinchisi esa hech narsa yemaydi.

Agar bolaning qismida qovoqli somsalar soni go'shtli somsalar sonidan kam bo'lmasa, u xursand bo'ladi. Dilnoza ular qayerda uchrashishidan qat'iy nazar, ikkala bola ham xursand bo'lishini xohlaydi.

Dilnozaning eri, Jasur, patnisdagi somsalarni o'zgartirishni yaxshi ko'radi. Vaqti-vaqti bilan u quyidagi ikki ishdan birini bajaradi:

- U $[l,r]$ oraliqni tanlaydi va undagi har bir somsani qaytadan tayyorlaydi. Bunda har bir go'shtli somsa qovoqliga, har bir qovoqli somsa esa go'shtliga aylanadi. Bu o'zgarish haqiqiy va abadiy saqlanadi.

- U $[l,r]$ oraliqni tanlaydi va Dilnozaga quyidagi vazifani beradi. Faqat $a_l, a_{l+1}, \ldots, a_r$ somsalarni inobatga olgan holda (qolganlari to'y uchun olib qo'yiladi), Dilnoza bu oraliqdan ba'zi somsalarni asl tartibida saqlab qoladi, qolganlarini esa chetga qo'yadi. Boshqa so'zlar bilan aytganda u saqlab qolgan somsalar qism ketma-ketlik hosil qiladi. U saqlab qoladigan somsalarini shunday tanlab bolalariga yeyish uchun berishi kerakki, bolalar keyin qayerda uchrashishidan qat'i nazar, ikkalasi ham xursand bo'lsin. Bu ikkinchi amal faqat xayolan bajariladi: patnisdagi hech narsa aslida o'zgarmaydi.

Ikkinchi turdagi har bir amal uchun Dilnoza bolalarga imkon qadar ko'proq somsa bermoqchi. Unga yordam bering: har bir bunday vazifa uchun u bera oladigan somsalarning eng ko'p sonini toping. U hech narsa bermasligi ham mumkin, shuning uchun javob $0$ bo'lishi ham mumkin.

## Implementation details

Quyidagi, `samsa.h` da e'lon qilingan uchta funksiyani to'ldirishingiz kerak.

```cpp

void init(int n, int q, vector<int> a)
```

- `n`: patnisdagi somsalar soni.

- `q`: Jasur bajaradigan amallar soni.

- `a`: uzunligi $n$ bo'lgan vektor. $0 \le i \le n-1$ uchun, $(i+1)$-somsa go'shtli bo'lsa `a[i]` qiymati $-1$, qovoqli bo'lsa $+1$ bo'ladi.

- Bu funksiya har qanday amaldan oldin aniq bir marta chaqiriladi.

```cpp

void invert(int l, int r)
```

Birinchi turdagi amalni bajaradi: $[l,r]$ oraliqdagi har bir somsa almashtiriladi (go'shtli qovoqliga, qovoqli esa go'shtliga aylanadi). $1 \le l \le r \le n$. Bu yerda `l` va `r` 1 dan boshlab indekslangan.

```cpp

int get_max(int l, int r)
```

$[l,r]$ oraliqda ikkinchi turdagi amalni bajaradi, $1 \le l \le r \le n$ (1 dan boshlab indekslangan). Yuqorida tavsiflanganidek, Dilnoza bera oladigan somsalarning eng ko'p sonini qaytarishi kerak.

`init` dan keyin `invert` va `get_max` protseduralari har bir amal uchun bir martadan, Jasur amallarni bajaradigan tartibda chaqiriladi.

## Cheklovlar

- $1 \le n,q \le 5 \cdot 10^5$

- har bir $i$ uchun $a_i \in \{-1,+1\}$

- har bir amal uchun $1 \le l \le r \le n$

- $q$ ta amaldan kamida bittasi ikkinchi turdagi amal.

## Kichik masalalar

| Kichik masala | Ball | $n$ | $q$ | Qo'shimcha | Talab qilinadi |
| --- | --- | --- | --- | --- | --- |
| 1 | 3 | — | — | $a_i=(-1)^{i+1}$ va 1-turdagi amallar yo'q | — |
| 2 | 14 | $n \le 16$ | — | 1-turdagi amallar yo'q | — |
| 3 | 16 | $n \le 100$ | $q \le 100$ | — | — |
| 4 | 14 | $n \le 3000$ | $q \le 3000$ | har bir 1-turdagi amalda $l=r$ | — |
| 5 | 17 | $n \le 2 \cdot 10^5$ | $q \le 2 \cdot 10^5$ | 1-turdagi amallar yo'q | — |
| 6 | 12 | $n \le 2 \cdot 10^5$ | $q \le 2 \cdot 10^5$ | har bir 1-turdagi amalda $l=r$ | 4, 5 |
| 7 | 11 | $n \le 2 \cdot 10^5$ | $q \le 2 \cdot 10^5$ | — | 3–6 |
| 8 | 13 | — | — | — | 1–7 |

Cheklov ustunidagi tire faqat umumiy cheklovlar amal qilishini bildiradi. 0-kichik masala — bu namuna testlari. Kichik masala o'z ballini faqat uning “Talab qilinadi” ustunida ko'rsatilgan har bir kichik masala ham to'liq yechilgan taqdirdagina oladi. Ballar yig'indisi $100$ ga teng.

## Namunaviy grader

Namunaviy grader kirishni quyidagi formatda o'qiydi:

- 1-qator: `n q`

- 2-qator: `a1 a2 ... an` — patnis, bunda har bir qiymat `-1` (go'shtli) yoki `+1` (qovoqli)

- $2+j$-qator ($1 \le j \le q$ uchun): bitta amal, `1 l r` yoki `2 l r`

Ikkinchi turdagi har bir amal uchun, tartib bo'yicha, grader `get_max` qaytargan qiymatni alohida qatorda chiqaradi.

## Misollar

### 1-misol

```cpp

8 6
1 -1 1 -1 1 -1 1 -1
2 1 8
2 2 7
2 3 3
2 4 4
2 1 5
2 4 8
```

Kutilayotgan natija:

```cpp

7
5
1
0
5
3
```

Bu yerda almashtirishlar yo'q, shuning uchun patnis butun vaqt davomida o'zgarmaydi: qovoqli, go'shtli, qovoqli, go'shtli, qovoqli, go'shtli, qovoqli, go'shtli.

Birinchi vazifa, $[1,8]$ oraliq (butun patnis). Dilnoza $7$ ta somsa olib qola oladi. Masalan, u oxirgi go'shtlisidan boshqa hammasini olib qoladi: qovoqli, go'shtli, qovoqli, go'shtli, qovoqli, go'shtli, qovoqli. Endi bolalar qayerda uchrashishini o'ylab ko'ring. Chapdagi bola qovoqlidan boshlaydi, o'ngdagi bola ham qovoqlidan boshlaydi, va hech bir tomonda go'shtli somsa qovoqlidan ko'p bo'lib qolmaydi. Shuning uchun ikkalasi ham xursand. U $8$ tasini ham olib qola olmaydi: u holda o'ng chetda go'shtli somsa qoladi, va Timurxon faqat o'sha oxirgi somsani yeydigan kunda u qovoqlidan ko'ra ko'proq go'shtli yeb qoladi.

Uchinchi vazifa, $[3,3]$ oraliq: faqat bitta qovoqli somsa. U uni beradi. Bir bola uni yeydi (bitta qovoqli, go'shtlisi yo'q), ikkinchisi esa hech narsa yemaydi, shuning uchun ikkalasi ham xursand va javob $1$. To'rtinchi vazifa, $[4,4]$ oraliq: faqat bitta go'shtli somsa. Agar u uni bersa, bir bola uni yeydi va qovoqlidan ko'ra ko'proq go'shtli yeb qoladi, shuning uchun u xursand emas. Uning yagona xavfsiz yo'li — hech narsa bermaslik, shuning uchun javob $0$.

### 2-misol

```cpp

10 8
1 1 -1 1 -1 -1 1 1 -1 1
2 1 10
2 6 10
1 4 7
2 1 10
2 3 8
1 1 10
2 1 10
2 5 9
```

Kutilayotgan natija:

```cpp

10
4
10
4
6
3
```

Patnis boshida quyidagicha: qovoqli, qovoqli, go'shtli, qovoqli, go'shtli, go'shtli, qovoqli, qovoqli, go'shtli, qovoqli.

Birinchi vazifa, $[1,10]$ oraliq (butun patnis). Dilnoza $10$ ta somsaning hammasini olib qola oladi. Bolalar qayerda uchrashishidan qat'i nazar, har bir tomonda qovoqlilar soni go'shtlilardan kam emas. Shuning uchun u hech narsani olib tashlashi shart emas, va javob $10$.

Keyin Jasur $[4,7]$ ni almashtiradi, undan so'ng butun patnis $[1,10]$ ni almashtiradi. Ikkala almashtirishdan keyin patnis quyidagicha bo'ladi: go'shtli, go'shtli, qovoqli, qovoqli, go'shtli, go'shtli, qovoqli, go'shtli, qovoqli, go'shtli — bunda endi go'shtli somsalar qovoqlilardan ko'p. Oxirgi vazifa, $[5,9]$ oraliq (go'shtli, go'shtli, qovoqli, go'shtli, qovoqli) uchun, faqat $2$ ta qovoqli somsa va $3$ ta go'shtli somsa bor. U xavfsiz tarzda bera oladigan eng ko'p miqdor — $3$ ta somsa, shuning uchun javob $3$.

## Namunalar

### 1-namuna

**Kirish:**

```text
8 6
1 -1 1 -1 1 -1 1 -1
2 1 8
2 2 7
2 3 3
2 4 4
2 1 5
2 4 8
```

**Chiqish:**

```text
OK
7
5
1
0
5
3
```

### 2-namuna

**Kirish:**

```text
7 6
1 1 -1 1 1 -1 1
2 1 7
1 3 3
2 1 7
1 6 6
2 2 6
2 4 4
```

**Chiqish:**

```text
OK
7
7
5
1
```

### 3-namuna

**Kirish:**

```text
10 8
1 1 -1 1 -1 -1 1 1 -1 1
2 1 10
2 6 10
1 4 7
2 1 10
2 3 8
1 1 10
2 1 10
2 5 9
```

**Chiqish:**

```text
OK
10
4
10
4
6
3
```
