> IOI 2025 rasmiy arxividagi o‘zbekcha tarjima (CC BY). Diagrammalar va asl sahifa tartibi uchun rasmiy PDFdan foydalaning.

Boliviyalik arxeolog janob Pacha Tivanaku yaqinida Tivanaku davrida (milodiy 300-1000) dunyoni tasvirlaydigan qadimiy hujjatni topdi.
O'sha paytda $1$ dan $N$ gacha raqamlangan $N$ ta mamlakat mavjud edi.

Hujjatda qo'shni mamlakatlarning $M$ ta turli juftliklari ro'yxati mavjud:
$$(A[0], B[0]), (A[1], B[1]), \ldots, (A[M-1], B[M-1]).$$
Har bir $i$ ( $0 \leq i < M$ ) uchun hujjatda $A[i]$ davlati $B[i]$ davlatiga (va aksincha) qoʻshni boʻlganligi koʻrsatilgan.
Ro'yxatga kiritilmagan mamlakatlar juftligi qo'shni emas edi.

Janob Pacha dunyo xaritasini shunday yaratmoqchiki, davlatlar o'rtasidagi barcha qo'shniliklar aynan Tiwanaku davridagidek bo'lsin.
Buning uchun u birinchi navbatda $K$ musbat sonini tanlaydi.
Keyin u xaritani  $0$ dan $K - 1$ gacha yuqoridan pastga va  $0$ dan $K - 1$ gacha chapdan o'ngga raqamlangan $K \times K$ kataklardan iborat to'rtburchak shaklida chizadi.

U $N$ ta ranglardan foydalanib, xaritaning har bir katakchasini ranglamoqchi.
Ranglar $1$ dan $N$ gacha raqamlangan va $j$ ( $1 \leq j \leq N$ ) - mamlakat $j$ rangi bilan ifodalanadi.

Rang quyidagi barcha **shartlar**ga javob berishi kerak:
* Har bir $j$ ( $1 \leq j \leq N$ ) uchun $j$ rangli kamida bitta katak mavjud.
* Qo'shni mamlakatlarning har bir juftligi uchun $(A[i], B[i])$ kamida bitta qo'shni kataklar juftligi mavjud bo'lib, ulardan biri $A[i]$ , ikkinchisi esa $B[i]$ rangiga bo'yalgan. Ikki katak yonma-yon bo'lsa, qo'shni hisoblanadi.
* Turli xil rangdagi qo'shni kataklarning har bir jufti uchun bu ikki rang bilan ifodalangan mamlakatlar Tiwanaku davrida qo'shni deb belgilangan bo'lishi kerak.

Misol uchun, agar $N = 3$ , $M = 2$ va qoʻshni mamlakatlar juftlari $(1,2)$ va $(2,3)$ boʻlsa, $(1,3)$ jufti qoʻshni boʻlmagan va quyidagi $K = 3$ oʻlchamli xaritasi barcha shartlarni qanoatlantiradi.

_Diagramma rasmiy PDFda keltirilgan._


Xususan, mamlakat xaritada qo'shni hududlardan tashkil topgan bo'lishi **shart emas**. Yuqoridagi xaritada 3-mamlakat qo'shni hududlardan, 1-va 2-mamlakat esa uzilgan hududlardan tashkil topgan.

Sizning vazifangiz janob Pachaga $K$ qiymatini tanlash va xarita yaratishda yordam berishdir.
Hujjat bunday xaritaning mavjudligini kafolatlaydi.
Janob Pacha kichikroq xaritalarni afzal ko'rganligi sababli, oxirgi subtaskda sizning ballingiz $K$ qiymatiga bog'liq va $K$ ning pastroq qiymatlari yaxshi natijaga olib kelishi mumkin.
Biroq, $K$ ning minimal mumkin bo'lgan qiymatini topish shart emas.

## Amalga oshirish tafsilotlari

Siz quyidagi protsedurani implement qilishingiz kerak:

```
std::vector<std::vector<int>> create_map(int N, int M,
    std::vector<int> A, std::vector<int> B)
```
  * $N$ : mamlakatlar soni.
  * $M$ : qoʻshni mamlakatlar juftliklari soni.
  * $A$ va $B$ : qoʻshni mamlakatlarni tavsiflovchi $M$ uzunlikdagi massivlar.
  * Ushbu protsedura har bir testda ** $50$ martagacha** chaqirilishi mumkin.

Jarayon xaritani ifodalovchi $C$ massivini qaytarishi kerak.
$K$ soni $C$ ning uzunligi bo'lsin.
  * $C$ ning har bir elementi $K$ uzunlikdagi qiymati $1$ dan $N$ gacha boʻlgan butun sonlar massivi boʻlishi kerak.
  * $C[i][j]$ qiymati $i$ - qator va $j$ ($0 \leq i,j < K$) - ustundagi katak rangiga teng bo'lishi kerak.
  * $K$ qiymati $240$ dan kam yoki unga teng boʻlishi kerak.

## Cheklovlar

* $1 \le N \le 40$
* $0 \le M \le \frac{N \cdot (N - 1)}{2}$
* Har bir $i$ ($0 \le i < M$) uchun $1 \le A[i] < B[i] \le N$.
* $(A[0], B[0]), \ldots , (A[M - 1], B[M - 1])$ juftliklari har xil.
* Barcha shartlarga javob beradigan kamida bitta xarita mavjud.


## Subtask lar va ball

| Subtask | Ball  | Qo'shimcha cheklovlar |
| :-----: | :----: | ---------------------- |
| 1       | $5$    | $M = N - 1$,  har bir $0 \le i < M$ uchun $A[i] = i + 1, B[i] = i + 2$.
| 2       | $10$   | $M = N - 1$
| 3       | $7$    | $M = \frac{N \cdot (N - 1)}{2}$
| 4       | $8$    |  $1$ - mamlakat boshqa barcha mamlakatlarga qo'shni. Ba'zi boshqa mamlakatlar juftliklari ham qo'shni bo'lishi mumkin.
| 5       | $14$   | $N \leq 15$
| 6       | $56$   | Qo'shimcha cheklovlarsiz

6-subtaskda sizning ballingiz $K$ qiymatiga bog'liq.
* Agar `create_map` tomonidan qaytarilgan har qanday xarita barcha shartlarga javob bermasa, subtask uchun ballingiz $0$ bo'ladi.
* Aks holda, $R$ `create_map` ga barcha murojaatlar uchun $K / N$ ning **maksimal** qiymati boʻlsin.
Keyin quyidagi jadvalga muvofiq **qisman ball** olasiz:

| Limits           | Score         |
| :---------------:| :------------:|
| $6 < R$          | $0$           |
| $4 < R \leq 6$   | $14$          |
| $3 < R \leq 4$   | $28$          |
| $2.5 < R \leq 3$ | $42$          |
| $2 < R \leq 2.5$ | $49$          |
| $R \leq 2$       | $56$          |


## Misol

CMS-da quyidagi ikkala stsenariy bitta test ishining bir qismi sifatida kiritilgan.

### Misol 1

Quyidagi murojaatni ko'rib chiqing:

```
create_map(3, 2, [1, 2], [2, 3])
```

Bu vazifa tavsifidagi misol, shuning uchun protsedura quyidagi xaritani qaytarishi mumkin.

```
[
[2, 3, 3],
[2, 3, 2],
[1, 2, 1]
]
```

### Misol 2

Quyidagi murojaatni ko'rib chiqing:

```
create_map(4, 4, [1, 1, 2, 3], [2, 3, 4, 4])
```

Bu misolda $N = 4$ , $M = 4$ va mamlakat juftliklari $(1, 2)$ , $(1, 3)$ , $(2, 4)$ va $(3, 4)$ qoʻshni.
Demak, $(1, 4)$ va $(2, 3)$ juftlari qoʻshni emas.

Jarayon barcha shartlarni qondiradigan $K = 7$ o'lchamining quyidagi xaritasini qaytarishi mumkin.

```
[
[2, 1, 3, 3, 4, 3, 4],
[2, 1, 3, 3, 3, 3, 3],
[2, 1, 1, 1, 3, 4, 4],
[2, 2, 2, 1, 3, 4, 3],
[1, 1, 1, 2, 4, 4, 4],
[2, 2, 1, 2, 2, 4, 3],
[2, 2, 1, 2, 2, 4, 4]
]
```

Xarita kichikroq bo'lishi mumkin; masalan, protsedura $K = 2$ o'lchamining quyidagi xaritasini qaytarishi mumkin.

```
[
[3, 1],
[4, 2]
]
```

E'tibor bering, ikkala xarita ham $K/N \leq 2$ ni qondiradi.

## Greyder namunasi

Kirishning birinchi qatorida bitta butun son $T$ , stsenariylar soni bo'lishi kerak.
$T$ stsenariylarining tavsifi quyida koʻrsatilgan formatda boʻlishi kerak.

Kirish formati:
```
N M
A[0] B[0]
:
A[M-1] B[M-1]
```

Chiqish formati:
```
P
Q[0] Q[1] ... Q[P-1]

C[0][0] ... C[0][Q[0]-1]
:
C[P-1][0] ... C[P-1][Q[P-1]-1]
```

Bu yerda $P$`create_map` tomonidan qaytarilgan $C$ massivining uzunligi va $Q[i]$ ( $0 \leq i < P$ ) $C[i]$ uzunligi.
E'tibor bering, chiqish formatidagi 3-qator ataylab bo'sh qoldirilgan.
