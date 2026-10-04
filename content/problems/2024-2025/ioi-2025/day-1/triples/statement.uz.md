> IOI 2025 rasmiy arxividagi o‘zbekcha tarjima (CC BY). Diagrammalar va asl sahifa tartibi uchun rasmiy PDFdan foydalaning.

Cordillera Oriental - Boliviya bo'ylab cho'zilgan And tog'laridagi tog' tizmasi.
U $0$ dan $N - 1$ gacha raqamlangan $N$ ta togʻ choʻqqilari ketma-ketligidan iborat.
$i$ ($0 \leq i < N$ )  - choʻqqisining **balandligi** $H[i]$ boʻlib, u $1$ va $N - 1$ oraligʻidagi butun sondir.

$0 \leq i < j < N$ bo'lgan har qanday ikkita $i$ va $j$ cho'qqilari uchun ular orasidagi **masofa** $d(i, j) = j - i$ sifatida aniqlanadi.

Qadimgi Inka afsonalariga ko'ra, cho'qqilarning uchligi **afsonaviy**, agar u quyidagi maxsus xususiyatga ega bo'lsa:
uchta cho'qqining balandliklari uchligi, ularning har ikki juftliklari orasidagi masofalarning uchligiga **tartibni inobatga olmagan holda** o'zaro **mos** keladi.

Aniqroq qilganda $(i, j, k)$  indekslari uchligi afsonaviy bo'ladi, qachonki
* $0 \leq i < j < k < N$, va
* $(H[i], H[j], H[k])$ balandliklar uchligi $(d(i,j), d(i,k), d(j,k))$ juftliklar orasidagi masofalar uchligiga tartibni inobatga olmagan holda mos keladi.

Masalan, $0, 1, 2$ indekslari uchun juftlik masofalar uchligi $(1, 2, 1)$ ga teng, hamda balandliklar $(H[0],H[1],H[2]) = (1,1,2)$ ga teng bo'lsa, yoki $(H[0],H[1],H[2]) = (1,2,1)$ yoki $(H[0],H[1],H[2]) = (2,1,1)$ hammasi ularga mos keladi, lekin $(H[0], H[1], H[2])=(1,2,2)$ balandliklari ularga mos kelmaydi.

Bu muammo ikki qismdan iborat bo‘lib, har bir kichik vazifa **I qism** yoki **II qism** bilan bog‘langan.
Siz quyi vazifalarni istalgan tartibda bajarishingiz mumkin.
Xususan, siz II qismga kirishdan oldin I qismni toʻliq ishlashingiz shart emas.

## I qism

Tog' tizmasining tavsifini hisobga olgan holda, sizning vazifangiz afsonaviy uchliklar sonini hisoblashdir.

### Amalga oshirish tafsilotlari

Siz quyidagi protsedurani implement qilishingiz kerak.

```
long long count_triples(std::vector<int> H)
```

* $H$ : choʻqqilarning balandligini ifodalovchi $N$ uzunlikdagi massiv.
* Ushbu protsedura har bir test ishi uchun bir marta chaqiriladi.

Protsedura tog' tizmasidagi afsonaviy uchliklar soni $T$ ni, ya'ni butun sonni qaytarishi kerak.

### Cheklovlar

* $3 \leq N \leq 200\,000$
* Har bir $i$ ($0 \leq i < N$) uchun $1 \leq H[i] \leq N - 1$.

### Subtask lar

I qism jami $70$ ballga teng.

| Subtask | Ball  | Qo'shimcha cheklovlar |
| :-----: | :----: | ---------------------- |
| 1       | $8$    | $N \leq 100$
| 2       | $6$    | har bir $i$ ($0 \leq i < N$) uchun $H[i] \leq 10$.
| 3       | $10$   | $N \leq 2000$
| 4       | $11$   | Balandliklar kamaymaydigan (non-decreasing). <br> Ya'ni, har bir $i$ ($1 \leq i < N$) uchun $H[i - 1] \leq H[i]$.
| 5       | $16$   | $N \leq 50\,000$
| 6       | $19$   | Qo'shimcha cheklovlarsiz.

### Misol

Quyidagi murojaatni ko'rib chiqing.

```
count_triples([4, 1, 4, 3, 2, 6, 1])
```

Tog' tizmalarida $3$ ta afsonaviy uchlik bor, bular:

* $(i,j,k)=(1,3,4)$ uchun $(1,3,2)$ balandliklari $(2,3,1)$ juftlik masofalariga mos keladi.
* $(i,j,k)=(2,3,6)$ uchun $(4,3,1)$ balandliklari $(1,4,3)$ juftlik masofalariga mos keladi.
* $(i,j,k)=(3,4,6)$ uchun $(3,2,1)$ balandliklari $(1,3,2)$ juftlik masofalariga mos keladi.

Shunday qilib, protsedura $3$ qaytarishi kerak.

E'tibor bering, $(0, 2, 4)$ indekslari afsonaviy uchlikni tashkil etmaydi, chunki $(4,4,2)$ balandliklari $(2,4,2)$ juftlik masofalariga mos kelmaydi.

## II qism

Sizning vazifangiz ko'plab afsonaviy uchliklarga ega tog' tizmalarini qurishdir. Bu qism **qisman baholanuvchi**  $6$ ta **output-only** subtasklardan iborat.

Har bir subtask da sizga $M$ va $K$ ikkita musbat sonlar beriladi va siz **koʻpi bilan** $M$ ta choʻqqilar bilan togʻ tizmasini qurishingiz kerak.
Agar yechimingiz **kamida** $K$ afsonaviy uchlikdan iborat bo‘lsa, siz ushbu subtask uchun to‘liq ball olasiz.
Aks holda, sizning ballingiz yechimingizdagi afsonaviy uchlik soniga mutanosib bo'ladi.

E'tibor bering, sizning yechimingiz to'g'ri tog' tizmasidan iborat bo'lishi kerak.
Xususan, sizning yechimingiz $N$ ta cho'qqilarga ega deylik ($3 \leq N \leq M$ qondirishi kerak).
Keyin, $H[i]$ bilan belgilangan $i$ ( $0 \leq i < N$ ) - choʻqqining balandligi $1$ va $N - 1$ oraligʻidagi butun son boʻlishi kerak.



### Amalga oshirish tafsilotlari

Yechimni yuborishning ikkita usuli mavjud va har bir subtask uchun ularning ixtiyoriy biridan foydalanishingiz mumkin:
* **Output file**
* **Procedure call**

Yechimni **Output file** orqali yuborish uchun quyidagi formatda matn faylini yarating va yuboring:
```
N
H[0] H[1] ... H[N-1]
```

Yechimni **Procedure call** orqali yuborish uchun quyidagi tartibni amalga oshirishingiz kerak.

```
std::vector<int> construct_range(int M, int K)
```

* $M$ : cho'qqilarning maksimal soni.
* $K$ : afsonaviy uchliklarning kerakli soni.
* Ushbu protsedura har bir subtask uchun bir marta chaqiriladi.

Protsedura cho'qqilarning balandligini ifodalovchi $N$ uzunlikdagi $H$ massivni qaytarishi kerak.

### Subtask lar va ball

II qism jami $30$ ballga teng.
Har bir subtask uchun $M$ va $K$ qiymatlari belgilangan va quyidagi jadvalda keltirilgan:

| Subtask | Ball | $M$        | $K$             |
| :-----: | :---: | :--------: | :-------------: |
| 7       | $5$   | $20$       | $30$
| 8       | $5$   | $500$      | $2000$
| 9       | $5$   | $5000$     | $50\,000$
| 10      | $5$   | $30\,000$  | $700\,000$
| 11      | $5$   | $100\,000$ | $2\,000\,000$
| 12      | $5$   | $200\,000$ | $12\,000\,000$

Har bir subtask uchun, agar sizning yechimingiz toʻgʻri togʻ tizimini tashkil qilmasa, sizning ballingiz $0$ boʻladi (CMSda `Output isn't correct` deb xabar qilinadi).

Aks holda, $T$ sizning yechimingizdagi afsonaviy uchlik sonini bildirsin.
Shunda, subtask uchun ballingiz:
$$5 \cdot \min\left(1,\frac{T}{K}\right).$$

## Greyder namunasi

I va II qismlarda bir xil namunaviy greyder dasturi qo'llaniladi, ikkita qism o'rtasidagi farq kirishning birinchi qatori bilan belgilanadi.

I qism uchun kiritish formati:

```
1
N
H[0] H[1] ... H[N-1]
```

I qism uchun chiqish formati:
```
T
```


II qism uchun kiritish formati:

```
2
M K
```

II qism uchun chiqish formati:

```
N
H[0] H[1] ... H[N-1]
```

E'tibor bering, namunaviy greyderning chiqishi II qismdagi chiqish fayli uchun kerakli formatga mos keladi.
