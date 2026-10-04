> IOI 2025 rasmiy arxividagi o‘zbekcha tarjima (CC BY). Diagrammalar va asl sahifa tartibi uchun rasmiy PDFdan foydalaning.

Nayra festivalda o'yin o'ynamoqda, unda bosh sovrin - Koloradaning Laguna shahriga sayohat. O'yin kuponlarni sotib olish uchun tokenlardan foydalanishdan iborat. Kuponni sotib olish qo'shimcha tokenlar olib kelishi mumkin. Maqsad - iloji boricha ko'proq kupon olish.

U o'yinni $A$ ta token bilan boshlaydi.
$0$ dan $N-1$ gacha raqamlangan $N$ ta kupon mavjud.
Nayra $i$( $0 \leq i < N$ ) - kuponni sotib olish uchun $P[i]$ ta token toʻlashi kerak (va xariddan oldin unda kamida $P[i]$ ta token boʻlishi kerak).
U har bir kuponni ko'pi bilan bir martadan sotib olishi mumkin.

Bundan tashqari, har bir $i$ ( $0 \leq i < N$ ) - kupon o'zining **turi**ga ega, bu tur $T[i]$ bilan belgilanadi, uning qiymati ** $1$ va $4$ oraligʻidagi butun sondir**.
Nayra $i$ - kuponni sotib olgach, qolgan tokenlar soni $T[i]$ ga koʻpaytiriladi.
Boshqa so'zlar bilan aytganda, agar u oʻyinning qaysidir nuqtasida $X$ ta tokenga ega boʻlsa va $i$ - kuponni sotib olsa (buning uchun $X \geq P[i]$ bo'lishi kerak), xariddan keyin u $(X - P[i]) \cdot T[i]$ ta tokenga ega boʻladi.

Sizning vazifangiz - Nayra sotib olgan **kuponlar** ning umumiy sonini maksimallashtirish uchun qaysi kuponlarni va qanday tartibda sotib olishi kerakligini aniqlashdan iborat.
Agar bir nechta xaridlar ketma-ketligi maksimal natijaga erishsa, ulardan istalganiga natija sifatida berishingiz mumkin.

## Implement tafsilotlari

Siz quyidagi protsedurani implement qilishingiz kerak.

```
std::vector<int> max_coupons(int A, std::vector<int> P,
    std::vector<int> T)
```

* $A$ : Nayra tokenlarining dastlabki soni.
* $P$ : kuponlar narxini ko'rsatuvchi $N$ uzunlikdagi massiv.
* $T$ : kuponlar turini ko'rsatuvchi $N$ uzunlikdagi massiv.
* Ushbu protsedura har bir test case uchun bir marta chaqiriladi.

Protsedura $R$ massivini qaytarishi kerak, unda Nayra xaridlarini quyidagicha ko'rsatadi:
* $R$ massivining uzunligi u sotib olishi mumkin bo'lgan kuponlarning maksimal soni bo'lishi kerak.
* Massivning elementlari xronologik tartibda u sotib olishi kerak bo'lgan kuponlar indeksidir.
  Ya'ni, u birinchi bo'lib $R[0]$ kuponini, ikkinchi bo'lib $R[1]$ kuponini va hokazolarni sotib oladi.
* $R$ massivining barcha elementlari noyob (unique) bo'lishi kerak.

Agar birorta ham kupon sotib olinmasa, $R$ bo'sh massiv bo'lishi kerak.

## Cheklovlar

* $1 \leq N \leq 200\,000$
* $1 \leq A \leq 10^{9}$
* Har bir $i$ ($0 \leq i < N$) uchun $1 \leq P[i] \leq 10^{9}.$
* Har bir $i$ ($0 \leq i < N$) uchun $1 \leq T[i] \leq 4.$

## Subtask lar

| Subtask | Ball | Qo'shimcha Cheklovlar                                              |
| :-----: | :---: | ------------------------------------------------------------------- |
|    1    |  $5$  | Har bir $i$ ($0 \leq i < N$) uchun $T[i] = 1$.                   |
|    2    |  $7$  | $N \leq 3000$; Har bir $i$ ($0 \leq i < N$) uchun $T[i] \leq 2$. |
|    3    | $12$  | Har bir $i$ ($0 \leq i < N$) uchun $T[i] \leq 2$.                |
|    4    | $15$  | $N \leq 70$                                                         |
|    5    | $27$  | Nayra barcha $N$ ta kuponni (qaysidir tartibda) sotib olishi mumkin.                      |
|    6    | $16$  | Har bir $i$ ($0 \leq i < N$) uchun $(A - P[i]) \cdot T[i] < A$.  |
|    7    | $18$  | Qo'shimcha cheklovlarsiz.                                          |

## Misollar

### 1 - misol

Quyidagi chaqiruvni ko'rib chiqing.

```
max_coupons(13, [4, 500, 8, 14], [1, 3, 3, 4])
```

Nayra dastlab $A = 13$ ta tokenga ega. U $3$ ta kuponni quyidagi tartibda sotib olishi mumkin:

| Sotib olingan kupon | Kuponning narxi | Kuponning turi | Xariddan keyingi tokenlar soni |
| :-----------: | :----------: | :---------: | :---------------------------------: |
|      $2$      |     $8$      |     $3$     |       $(13 - 8) \cdot 3 = 15$       |
|      $3$      |     $14$     |     $4$     |       $(15 - 14) \cdot 4 = 4$       |
|      $0$      |     $4$      |     $1$     |        $(4 - 4) \cdot 1 = 0$        |

Bu misolda Nayra $3$ tadan ortiq kupon sotib ololmaydi va yuqorida tavsiflangan xaridlar ketma-ketligi u $3$ ta sotib olishining yagona usuli hisoblanadi.
Demak, protsedura $[2, 3, 0]$ qaytarishi kerak.


### 2 - misol

Quyidagi chaqiruvni ko'rib chiqing.

```
max_coupons(9, [6, 5], [2, 3])
```

Ushbu misolda Nayra ikkala kuponni istalgan tartibda sotib olishi mumkin.
Demak, protsedura $[0, 1]$ yoki $[1, 0]$ qaytarishi kerak.

### 3 - misol

Quyidagi chaqiruvni ko'rib chiqing. Ushbu misolda Nayrada bitta token bor, bu hech bir kuponni sotib olish uchun yetarli emas.
Demak, protsedura $[\ ]$ (bo'sh massiv) ni qaytarishi kerak.

```
max_coupons(1, [2, 5, 7], [4, 3, 1])
```

## Namunaviy Greyder

Kirish formati:

```
N A
P[0] T[0]
P[1] T[1]
...
P[N-1] T[N-1]
```

Chiqish formati:

```
S
R[0] R[1] ... R[S-1]
```

Bu yerda $S$: `max_coupons` tomonidan qaytarilgan $R$ massivining uzunligi.
