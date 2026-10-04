> IOI 2024 rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). PDF - asosiy manba: diagrammalar, indekslar va murakkab formulalarni rasmiy PDFdan tekshiring.

Indekslari 0 dan $N - 1$ gacha belgilangan $N$ ta **tugun** dan iborat **daraxt** berilgan. 0-node **ildiz** deyiladi. Ildizdan tashqari hamma tugunni faqat bitta **otasi** bor. Har bir $1 \le i < N$ bo'lgan $i$ uchun, $i $ -tugunni otasi $ P[i]$ orqali belgilangan, bunda $ P[i] < i$ . Shuningdek, $ P[0] = -1$ ligi ham ma'lum.

Har bir $i$ ($0 \le i < N $ ) uchun, $ i$ tugunning qism daraxtiga quyidagilar kiradi:

- $i$ , va

- otasi $i$ bo'lgan har qanday tugun, va

- otasini otasi $i$ bo'lgan har qanday tugun, va

- otasini otasini otasi $i$ bo'lgan har qanday tugun, va

- hokazo.

Quyidagi rasmda $N = 6$ bo'lgan namunaviy daraxt keltirilgan. Har bir strelka tugunni uni otasi bilan bog'laydi, ildiz esa otasi yo'q bo'lgani uchun bundan mustasno. 2-tugunning qism daraxti 2, 3, 4 va 5-tugunlarni o'z ichiga oladi. 0-tugunning qism daraxti daraxtdagi barcha 6 ta tugunni o'z ichiga oladi va 4-tugunni qism daraxti esa faqatgina 4-tugunni o'z ichiga oladi.

Har bir tugun uchun nomanfiy **og'irlik** qiymati belgilangan. $i $ -tugunni ($0 \le i < N $ ) og'irligini $ W[i]$ orqali belgilaymiz.

Sizning vazifangiz $Q$ ta so'rovga javob beruvchi dastur tuzishdan iborat, bunda har bitta so'rov ( $L $ , $ R$ ) sonlar juftligi orqali ifodalangan. So'rovlarga javob quyidagicha hisoblanishi lozim.

Har bir tugunga, **koeffitsient** nomli qiymatlarni belgilaylik. Bu kabi belgilash $C[0]$,… , $ C $ [ $ N - 1$] ketma-ketlik orqali ifodalanadi, bunda $ i$ tugunga $ C[i]$ ($0 \le i < N$ ) qiymat belgilangan. Bu ketmaketlikni **koeffitsient ketma-ketligi** deb nomlaymiz. Shuningdek, koeffitsient ketma-ketligining har bir elementi manfiy, 0 yoki musbat son bo'lishi mumkin.

Har bir ( $L $ , $ R $ ) so'rov uchun, agar quyidagi shartlar bajarilsa koeffitsient ketma ketligi **valid** deyiladi: $ i $ tugunning qism daraxtidagi tugunlarning koeffitsientlari yig'indisi qiymati $ L $ va $ R$ oralig'ida bo'lsa.

Ma'lum bir $C[0]$,… , $ C $ [ $ N - 1$] koeffitsient ketma-ketligi uchun $ i$ tugunning **narxi** deb ∣ $ C[i]$∣⋅ $ W[i]$ qiymatga aytiladi, bunda ∣ $ C[i]$∣ deb $ C[i]$ ning absolyut qiymatiga aytiladi. **Umumiy narx** deb esa barcha tugunlarning narxlari yig'indisiga aytiladi. Sizning vazifangiz, har bir so'rov uchun, ma'lum bir valid koeffitsient ketma-ketligi orqali **minimum umumiy narx** qiymatini topishdan iborat.

## Kod yozish detallari

Quyidagi ikkita funksiyani kodlashingiz lozim:

```
void init(std::vector<int> P, std::vector<int> W)
```

- $P $ , $ W $ : uzunligi $ N$ bo'lgan tugunlarning ota-onalari va og'irliklarini ifodalaydigan butun sonli massivlar.

- Bu funksiya har bir test uchun grader va sizning dasturingiz o'rtasidagi muloqot davomida faqat bir marta chaqiriladi.

```
long long query(int L, int R)
```

$L $ , $ R$ : so'rovni ifodalovchi butun sonlar.

Bu funksyia har bir test uchun `init` funksiyasi chaqirilganidan so'ng $Q$ marta chaqiriladi. Bu funksiya, berilgan so'rovga javobni qaytarishi kerak.

## Chegaralar

- $1 \le N \le 200\,000$ $1 \le Q \le 100\,000$ $ P[0] = -1$

- $0 \le P[i] < i $ har bir $1 \le i < N $ bo'lgan $i$ uchun

- $0 \le W[i] \le 1\,000\,000$ har bir $0 \le i < N$ bo'lgan $i$ uchun

- $1 \le L \le R \le 1\,000\,000$ har bir so'rvda

## Qism masalalar

|**Qism masala**|**Ball**|**Qo'shimcha cheklovlar**|
|---|---|---|
|1|10|$Q \le 10$;$ W[P[i]] \le W[i]$har bir1 ≤$ i < N $bo'lgan$ i$uchun|
|2|13|$Q \le 10$;$ N \le 2\,000$|
|3|18|$Q \le 10$;$ N \le 60\,000$|
|4|7|$W[i] = 1$ har bir0 ≤$i < N $ bo'lgan$i$ uchun|
|5|11|$W[i] \le 1$ har bir0 ≤$i < N $ bo'lgan$i$ uchun|
|6|22|$L = 1$|
|7|19|Qo'shimcha cheklovlarsiz|

## Misollar

Quyidagi funksiya chaqiruvlarini ko'raylik:

```
init([-1, 0, 0], [1, 1, 1])
```

Daraxtda 3 ta tugun bor, ildiz va uning 2 ta bolasi. Hamma tugunlarni og'irligi 1.

### `query(1, 1)`

Bu so'rovda $L = R = 1$, bu degani har bir qism daraxtdagi koeffitsientlar yig'indisi 1 bo'lishi lozim. [−1,1,1] koeffitsient ketma-ketligini ko'raylik. Daraxt va uning mos koeffitsientlari(kulrang to'rtburchaklar ichida) quyidagi rasmda keltirilgan.

Har bir $i$ ($0 \le i < 3$) tugun uchun, $ i$ ning qism daraxtidagi tugunlarning koeffitsientlari yig'indisi 1 ga teng. Shuning uhcun, koeffitsient ketma-ketligi valid. Umumiy narx quyidagicha hisoblangan:

|**Tugun**|**Og'irligi**|**Koeffitsient**|**Narxi**|
|---|---|---|---|
|0|1|-1|∣−1 ∣⋅1 = 1|
|1|1|1|∣1 ∣⋅1 = 1|
|2|1|1|∣1 ∣⋅1 = 1|

Shuning uchun umumiy narx 3 ga teng. Bu mumkin bo'lgan yagona valid koeffitsient ketma-ketligi, shuning uchun bu funksiya 3 qaytarishi lozim.

```
query(1, 2)
```

Bu so'rov uchun minimum umumiy narx 2 ga teng. Bu natijaga [0,1,1] koeffitsient ketma-ketligi orqali erishish mumkin.

## Namunaviy Grader

Kiritish formati:

```
N
P[1]  P[2] ...  P[N-1]
W[0]  W[1] ...  W[N-2] W[N-1]
Q
L[0]  R[0]
L[1]  R[1]
...
L[Q-1]  R[Q-1]
```

bunda $L[j]$ va $R[j]$ (for $0 \le j < Q$ ) `query` ga $ j$ -chaqiruvdagi kiruvchi argumentlarni bildiradi. Yodda tutingki, kiruvchi ma'lumotlarni 2-qatorida **bor yo'g'i** $ N - 1$ **ta son** mavjud, chunki namunaviy grader $ P[0]$ qiymatini o'qimaydi.

Chiqarish formati:

```
A[0]
A[1]
...
A[Q-1]
```

bunda $A[j]$ (for $0 \le j < Q$ ) `query` ga $ j$ -chaqiruvdagi qaytarilgan javob qiymati.
