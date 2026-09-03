Amina har kuni tanga yig'adi. Har kuni u aynan bir xil miqdorda tanga topadi. Keyin u shu kungi tangalarni uchta idishga bo'ladi: $A$, $B$ va $C$ idishlar. Bo'lish usuli har kuni har xil bo'lishi mumkin, lekin har kuni topilgan tangalarning umumiy soni doim bir xil.

$n$ ta kun bor, ular $0,1,\ldots,n-1$ deb raqamlangan. $i$-kunda Amina $a_i$, $b_i$, $c_i$ sonlarini yozadi: ular mos ravishda $A$, $B$ va $C$ idishlarga solingan tangalar soni.

To'liq ustunlar $a=(a_0,a_1,\ldots,a_{n-1})$, $b=(b_0,b_1,\ldots,b_{n-1})$, $c=(c_0,c_1,\ldots,c_{n-1})$. Har kuni umumiy son bir xil: $a_i+b_i+c_i=a_j+b_j+c_j$ barcha $i,j$ kunlar uchun.

Amina bir xil sonni ketma-ket ko'p marta yozishni yoqtirmaydi. Bitta ustunda hozirgi qiymat oldingisiga teng bo'lsa, u uni faqat bir marta yozadi. Ketma-ket teng qiymatlarning har bir maksimal bloki bitta qiymatga aylanadi. Hosil bo'lgan ustun qisqartirilgan ustun deyiladi.

Masalan, $a=[2,2,2,1,5]$ bo'lsa, qisqartirilgandan keyin $a'=[2,1,5]$. Faqat yonma-yon teng qiymatlar birlashtiriladi: $[2,2,1,2,2]$ qisqartirilsa $[2,1,2]$ bo'ladi. $a,b,c$ ning qisqartirilgan ustunlari $a',b',c'$ deb belgilanadi.

Yillar o'tib to'liq ustunlar yo'qoladi, faqat $a',b',c'$ qoladi. Amina $n$ ni ham eslaydi. Kundalik yo'qolishidan oldin u ko'pi bilan $k$ ta butun sondan iborat kichik eslatma $s$ yozib qo'yishi mumkin edi. Har bir son $0$ dan $2^{30}-1$ gacha bo'lishi kerak. Vazifa — eslatmani yozish va keyin shu ma'lumot orqali ustunlarni tiklash strategiyasini topish.

Dastur ikki alohida ishga tushirishda ishlaydi:

- Run 1 to'liq $a,b,c$ ustunlarini oladi va $s$ eslatmani qaytaradi.

- Run 2 $n$, $s$ va qisqartirilgan $a',b',c'$ ustunlarini oladi hamda to'liq $a,b,c$ ustunlarini qayta quradi.

Qayta qurilgan ustunlar asl ustunlar bilan bir xil bo'lishi shart emas. Ular quyidagilarni qanoatlantirishi kerak:

- Har bir qayta qurilgan ustun uzunligi aynan $n$.

- Har kuni umumiy son bir xil: $a_i+b_i+c_i$ barcha $i$ lar uchun bir xil.

- $a$ qisqartirilganda aynan $a'$ hosil bo'ladi.

- $b$ qisqartirilganda aynan $b'$ hosil bo'ladi.

- $c$ qisqartirilganda aynan $c'$ hosil bo'ladi.

Run 1 dan Run 2 ga o'tadigan yagona ma'lumot — $s$ eslatma.

### Amalga oshirish tafsilotlari

`jars.h` da e'lon qilingan ikki funksiyani implementatsiya qiling.

```cpp

vector<int> run_a(int k, vector<int> a, vector<int> b, vector<int> c);
vector<vector<int>> run_b(int n, vector<int> s, vector<int> a_c, vector<int> b_c, vector<int> c_c);
```

Barcha vektorlar 0-indeksli. C++ interfeysida qisqartirilgan $a',b',c'$ ustunlari `a_c`, `b_c`, `c_c` deb nomlangan.

### Run 1 — run_a

`run_a` bir marta chaqiriladi. U $k$ va asl $a,b,c$ ustunlarini oladi. Har bir ustun uzunligi $n$; har bir kun uchun $0 \le a_i,b_i,c_i < 2^{20}$; kunlik umumiy son bir xil. Funksiya $s$ eslatmani qaytarishi kerak.

Eslatma uchun $|s| \le k$ va $0 \le x < 2^{30}$ shartlari bajarilishi kerak.

### Run 2 — run_b

`run_b` $n$, $s$ va `a_c`, `b_c`, `c_c` ustunlarini oladi. U aynan uchta vektor qaytarishi kerak:

```cpp

return {a, b, c};
```

### Ikki ishga tushirish haqida muhim eslatma

Haqiqiy judge da Run 1 va Run 2 mustaqil jarayonlar sifatida bajariladi; global o'zgaruvchilar va xotira umumiy emas; fayllar orqali ma'lumot uzatib bo'lmaydi. Shuning uchun `run_a` ichida ma'lumotni global o'zgaruvchiga saqlab, `run_b` da ishlatish mumkin emas.

### Cheklovlar

- $1 \le n \le 30000$

- $1 \le k \le 60000$

- $0 \le a_i,b_i,c_i < 2^{20}$

- $a_i+b_i+c_i$ barcha $i$ lar uchun bir xil

- $s$ ko'pi bilan $k$ ta butun sondan iborat, har biri $[0,2^{30}-1]$ oraliqda.

### Qism masalalar

| Qism masala | Ball | n | k | Qo'shimcha | Kerakli |
| --- | --- | --- | --- | --- | --- |
| 1 | 4 | $n\le3$ | $k=1$ | — | — |
| 2 | 5 | $n\le10$ | $k=1$ | — | 1 |
| 3 | 8 | $n\le100$ | $k=4$ | — | 1, 2 |
| 4 | 9 | $n\le1000$ | $k=1000$ | — | — |
| 5 | 4 | — | $k=60000$ | — | — |
| 6 | 5 | — | $k=40000$ | — | 5 |
| 7 | 12 | — | $k=30000$ | — | 5, 6 |
| 8 | 13 | — | $k=15000$ | — | 5, 6, 7 |
| 9 | 7 | — | $k=1$ | $a_i=0$ | — |
| 10 | 13 | — | $k=3000$ | — | 5, 6, 7, 8 |
| 11 | 20 | — | $k=1100$ | — | 1–8, 10 |

### Misollar

1-misol (`examples/01.in`):

```cpp

4 6
2 3 5 5
4 3 3 1
6 6 4 6
```

Bu yerda $n=4$, $k=6$. Har kuni umumiy son $12$. Qisqartirilgandan keyin $a'=[2,3,5]$, $b'=[4,3,1]$, $c'=[6,4,6]$. Run 1 masalan $s=[4,1]$ qaytarishi mumkin; bu faqat tasvirlash uchun. Run 2 $4$ kunlik istalgan yaroqli kundalikni tiklashi kerak.

2-misol (`examples/02.in`):

```cpp

8 60000
9 4 5 7 5 7 7 7
3 3 3 2 4 4 5 6
2 7 6 5 5 3 2 1
```

Bu yerda $n=8$, $k=60000$. Har kuni umumiy son $14$. Qisqartirilgandan keyin $a'=[9,4,5,7,5,7]$, $b'=[3,2,4,5,6]$, $c'=[2,7,6,5,3,2,1]$. Ikkala misolda ham $s$ qiymatlari faqat tasvirlash uchun berilgan.

### Namunaviy grader

Bu masala uchun namunaviy grader `stub.cpp`. U `n k` ni va uchta ustunni o'qiydi, `run_a(k, a, b, c)` ni chaqiradi, eslatmani tekshiradi, ustunlarni qisqartiradi, `run_b(n, s, a_c, b_c, c_c)` ni chaqiradi va qaytarilgan kundalikni tekshiradi.

## Namunalar

### 1-namuna

**Kirish:**

```text
4 6
2 3 5 5
4 3 3 1
6 6 4 6
```

**Chiqish:**

```text
1
```

### 2-namuna

**Kirish:**

```text
8 60000
9 4 5 7 5 7 7 7
3 3 3 2 4 4 5 6
2 7 6 5 5 3 2 1
```

**Chiqish:**

```text
1
```
