> IOI 2024 rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). PDF - asosiy manba: diagrammalar, indekslar va murakkab formulalarni rasmiy PDFdan tekshiring.

Salma devordagi mozaikani bo'yamoqchi. Mozaika $N$ × $ N $ doskadan iborat bo'lib, $N^2$ ta dastlab bo'yalmagan 1 × 1 kvadratlardan iborat. Mozaikani qatorlari tepadan pastga 0 dan $ N - 1$ gacha raqamlangan va ustunlari esa chapdan o'ngga 0 dan $ N - 1$ gacha raqamlangan. $ i $ -qator va $ j $ - ustundagi ($0 \le i < N $ , $0 \le j < N $ ) kvadrat ( $ i $ , $ j$ ) orqali ifodalanadi. Har bir kvadrat oq (0 soni) yoki qora (1 soni) rangda bo'yalishi mumkin.

Mozaikani bo'yash uchun, Salma dastlab uzunligi $N$ bo'lgan $X$ va $Y$ massivlarni tanlaydi, bunda massivlardagi qiymatlar 0 yoki 1 dan iborat va $X[0] = Y[0]$ bo'ladi. U eng yuqori qatordagi(0-qator) kvadratlarni $X$ massivga ko'ra bo'yaydi, bunda (0, $j $ ) kvadratning rangi $ X[j]$ ($0 \le j < N $ ) bo'ladi. Shuningdek u eng chapgi ustundagi(0-ustun) kvadratlarni $ Y $ massivga ko'ra bo'yaydi, bunda ( $ i $ ,0) kvadratning rangi $ Y[i]$ ($0 \le i < N$ ) bo'ladi.

So'ng u barcha kvadratlar bo'yalmaguncha quyidagi amalni takrorlaydi:

- Yuqoridagi qo'shinisi (( $i - 1$, $ j $ ) kvadrat) va chapgi qo'shnisi (( $ i $ , $ j - 1$) kvadrat) _allaqachon bo'yalgan_ ( $ i $ , $ j$ ) _bo'yalmagan_ kvadratni topadi.

- So'ng agar shu ikkala qo'shnisini rangi oq bo'lsa, ( $i $ , $ j $ ) kvadratni qora rangga bo'yaydi, aks holda esa ( $ i $ , $ j$ )ni oq rangda bo'yaydi.

Kvadratlarning jarayon so'nggidagi rangi Salmani kvadratlarni bo'yash tartibiga bog'liq emasligini isbotlash mumkin.

Yasmin mozaika kvadratlarining ranglariga qiziqmoqda. U Salmadan 0 dan $Q - 1$ gacha raqamlangan $Q$ ta savol so'raydi. $k $ -savolda ($0 \le k < Q$ ), Yasmin to'g'ri to'rtburchakni quyidagi qiymatlar orqali ifodalaydi:

- Eng yuqori qator $T[k]$ va eng quyi qator $B[k]$ ($0 \le T[k] \le B[k] < N $ ), Eng chap ustun $ L[k]$ va eng o'ng ustun $ R[k]$ ($0 \le L[k] \le R[k] < N$ ).

Savolning javobi shu berilgan qism to'g'ri to'rtburchakdagi qora kvadratlar soniga teng. Aniqrog'i, Salma $T[k] \le i \le B[k]$, $ L[k] \le j \le R[k]$ bo'lgan va ( $ i $ , $ j$ ) qora bo'lgan kvadratlar sonini topishi lozim.

Yasminning savollariga javob beradigan dastur tuzing.

## Kod yozish detallari

Quyidagi funksiyani kodlashingiz lozim:

```
std::vector<long long> mosaic(
    std::vector<int> X, std::vector<int> Y,
    std::vector<int> T, std::vector<int> B,
    std::vector<int> L, std::vector<int> R)
```

- $X $ , $ Y $ : eng yuqori qator va eng chap ustundagi kvadratlarning rangini ifodalovchi uzunligi $ N$ bo'lgan massivlar.

- $T $ , $ B $ , $ L $ , $ R $ : Yasminning savollarini ifodalaydigan uzunligi $ Q$ bo'lgan massivlar.

- Funksiya uzunligi $Q$ bo'lgan $C$ massivni qaytarishi lozim, bunda $C[k]$ ning qiymati $k$ ($0 \le k < Q$ ) savolning javobi bo'lishi lozim.

- Bu funksiya har bir test uchun faqat bir marta chaqiriladi.

## Chegaralar

- $1 \le N \le 200\,000$

- $1 \le Q \le 200\,000$

- $X[i]$ ∈{0,1} va $ Y[i]$ ∈{0,1} har bir $0 \le i < N$ bo'lgan $i$ uchun $X[0] = Y[0]$

- $0 \le T[k] \le B[k] < N $ va $0 \le L[k] \le R[k] < N $ har bir $0 \le k < Q $ bo'lgan $k$ uchun

## Qism masalalar

|**Qism masala**|**Ball**|**Qo'shimcha cheklovlar**|
|---|---|---|
|1|5|$N \le 2$;$ Q \le 10$|
|2|7|$N \le 200$;$ Q \le 200$|
|3|7|$T[k] = B[k] = 0$(har bir0 ≤$ k < Q $bo'lgan$ k$uchun)|
|4|10|$N \le 5000$|
|5|8|$X[i] = Y[i] = 0$(har bir0 ≤$ i < N $bo'lgan$ i$uchun )|
|6|22|$T[k] = B[k]$ va $L[k] = R[k]$(har bir0 ≤$ k < Q $bo'lgan$ k$uchun)|
|7|19|$T[k] = B[k]$(har bir0 ≤$ k < Q $bo'lgan$ k$uchun)|
|8|22|Qo'shimcha cheklovlar yo'q.|

## Misol

Quyidagi funksiya chaqiruvini ko'raylik

```
mosaic([1, 0, 1, 0], [1, 1, 0, 1], [0, 2], [3, 3], [0, 0], [3, 2])
```

Bu misol quyidagi rasmlarda ifodalangan. Chapdagi rasm mozaikadagi kvadratlar ranglarini ko'rsatadi. O'rtadagi va o'ngdagi rasmlar Yasmin birinchi va ikkinchi so'rovlarida so'ragan qism to'g'ri to'rtburchaklarni ko'rsatadi.

So'rovlarga javoblar(ya'ni kulrang kvadratlardagi birlar soni) mos ravishda 7 va 3. Shuning uchun funksiya [7,3] qaytaradi.

## Namunaviy Grader

### Kiritish formati:

```
N
X[0]  X[1]  ...  X[N-1]
Y[0]  Y[1]  ...  Y[N-1]
Q
T[0]  B[0]  L[0]  R[0]
T[1]  B[1]  L[1]  R[1]
...
T[Q-1]  B[Q-1]  L[Q-1]  R[Q-1]
```

Chiqarish formati:

```
C[0]
C[1]
...
C[S-1]
```

Bunda, $S $ `mosaic` qaytargan $ C$ massivni uzunligini bildiradi.
