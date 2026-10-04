> IOI 2025 rasmiy arxividagi o‘zbekcha tarjima (CC BY). Diagrammalar va asl sahifa tartibi uchun rasmiy PDFdan foydalaning.

Amaru chet el do'konidan suvenirlar sotib olmoqda.
U yerda $N$ **turdagi** suvenirlar mavjud.
Do'konda har bir turdagi suvenirlardan cheksiz ko'p mavjud.

Har bir suvenir turining qat'iy belgilangan narxi bor.
Ya'ni, $i$ ( $0 \leq i < N$ ) turidagi suvenirning narxi $P[i]$ tangaga teng,
bu yerda $P[i]$ musbat butun son.

Amaru suvenir turlari narxi bo'yicha kamayish tartibida saralanganligini va suvenirlar narxi har xil ekanligini biladi. Ya'ni, $P[0] > P[1] > \cdots > P[N-1] > 0$ . Bundan tashqari, u $P[0]$ qiymatini bilib oldi. Afsuski, Amaru suvenirlar narxi haqida boshqa ma’lumotga ega emas.

Amaru bir nechta suvenirlar sotib olish uchun sotuvchi bilan bir qator tranzaksiyalarni amalga oshiradi.

Har bir tranzaksiya quyidagi bosqichlardan iborat:

1. Amaru sotuvchiga bir qancha (musbat) tanga beradi.
2. Sotuvchi bu tangalarni Amaru ko‘ra olmaydigan orqa xonadagi stol ustiga qo‘yib qo‘yadi.
3. Sotuvchi har bir suvenir turini $0, 1, \ldots, N-1$ tartibda, birma-bir ko'rib chiqadi.
   Har bir turdagi suvenir uchun **aniq bir marta** quyidagi amal bajariladi.
    * $i$ suvenir turini ko'rib chiqayotganda,
       agar stoldagi tangalarning joriy soni kamida $P[i]$ bo'lsa, u holda
        * sotuvchi stoldan $P[i]$ miqdordagi tangalarni olib tashlaydi va
        * sotuvchi stol ustiga $i$ - turidagi suvenirdan bir dona qo'yadi.
4. Sotuvchi Amaruga stolda qolgan barcha tangalarni va stol ustidagi barcha suvenirlarni beradi.

Eslatma: Tranzaktsiya boshlanishidan oldin stolda tangalar yoki suvenirlar yo'qligini unutmang.

Sizning vazifangiz Amaruga bir qancha tranzaksiyalarni bajarishni ko'rsatishdan iborat, shunday qilib:
* har bir tranzaksiyada u **kamida bitta** suvenir sotib oladi va
* Umumiy miqdorda u  har bir $i$($0 \leq i < N$) uchun $i$ - turdagi suvenirdan **aynan**  $i$ ta sotib oladi.
E'tibor bering, bu degani Amaru $0$ - turdagi suvenirni xarid qilmasligi kerakligini anglatadi.

Amaru tranzaktsiyalar sonini minimallashtirishi shart emas va u cheksiz tangalarga ega.

## Amalga oshirish tafsilotlari

Siz quyidagi protsedurani implement qilishingiz kerak.

```
void buy_souvenirs(int N, long long P0)
```

* $N$: suvenir turlari soni.
* $P0$: $P[0]$ ning qiymati.
* Ushbu protsedura har bir test uchun bir marta chaqiriladi.

Yuqoridagi protsedura Amaruga tranzaksiyalarni amalga oshirish uchun quyidagi protseduraga murojaatlar qilishi mumkin:

```
std::pair<std::vector<int>, long long> transaction(long long M)
```

* $M$: Amaru tomonidan sotuvchiga topshirilgan tangalar soni.
* Protsedura juftlik qiymat qaytaradi.
  Juftlikning birinchi elementi $L$ massivi bo'lib, u sotib olingan suvenirlar turlarini o'z ichiga oladi (ortib borayotgan tartibda). Ikkinchi element butun son $R$ , tranzaktsiyadan keyin Amaruga qaytarilgan tangalar soni.
* $P[0] > M \geq P[N-1]$ bo'lishi talab qilinadi. $P[0] > M$ sharti Amaru $0$ - turdagi hech qanday suvenir sotib olmasligini ta'minlaydi va $M \geq P[N-1]$ Amaru kamida bitta suvenir sotib olishini ta'minlaydi.
  Agar bu shartlar bajarilmasa, sizning yechimingiz `Output isn't correct: Invalid argument` verdiktini oladi.
  E'tibor bering, $P[0]$ dan farqli o'laroq, kiritishda $P[N-1]$ qiymati ko'rsatilmagan.
* Har bir testda protsedura ko'pi bilan $5000$ marta chaqirilishi mumkin.

Grader ning harakati **moslashuvchan emas**.
Bu shuni anglatadiki, $P$ narxlari ketma-ketligi `buy_souvenirs` chaqirilishidan oldin belgilanadi.

## Cheklovlar

* $2 \leq N \leq 100$
* har bir $i$ ($0 \leq i < N$) uchun $1 \leq P[i] \leq 10^{15}$.
* har bir $i$ ($0 \leq i < N - 1$) uchun $P[i] > P[i+1]$ .

## Subtask lar

| Subtask | Ball  | Qo'shimcha cheklovlar |
| :-----: | :----: | ---------------------- |
| 1       | $4$    | $N = 2$
| 2       | $3$    | Har bir $i$ ($0 \leq i < N$) uchun $P[i] = N - i$.
| 3       | $14$   | Har bir $i$ ($0 \leq i < N$) uchun $P[i] \leq P[i+1] + 2$.
| 4       | $18$   | $N = 3$
| 5       | $28$   | Har bir $i$($0 \leq i < N-2$) uchun $P[i+1] + P[i+2] \leq P[i]$ . <br> Har bir $i$($0 \leq i < N-1$) uchun $P[i] \leq 2 \cdot P[i+1]$ .
| 6       | $33$   | Qo'shimcha cheklovlarsiz.

## Misol

Quyidagi chaqiruvni ko'rib chiqing.

```
buy_souvenirs(3, 4)
```

$N = 3$ turdagi suvenirlar mavjud va $P[0] = 4$.
E'tibor bering, $P$ narxlarining faqat uchta mumkin bo'lgan ketma-ketligi mavjud:
 $[4, 3, 2]$,
 $[4, 3, 1]$,
 va $[4, 2, 1]$.

Tasavvur qiling, `buy_souvenirs``transaction(2)` chaqirildi.
Aytaylik, chaqiruv $([2], 1)$ juftligini qaytardi, ya'ni Amaru $2$ - turdagi bitta suvenir sotib oldi va sotuvchi unga $1$ tanga qaytim berdi.
E'tibor bering, bu bizga $P = [4, 3, 1]$ degan xulosa chiqarish imkonini beradi, chunki:

* $P = [4, 3, 2]$ uchun `transaction(2)`$([2], 0)$ qaytargan boʻlardi.
* $P = [4, 2, 1]$ uchun `transaction(2)`$([1], 0)$ qaytargan boʻlardi.

Keyin `buy_souvenirs``transaction(3)` ga murojaat qilishi mumkin, bu esa $([1], 0)$ qaytaradi, ya'ni Amaru $1$ turidagi bitta suvenir sotib oladi va sotuvchi unga $0$ - tanga qaytarib beradi.
Hozirgacha u jami $1$ turidagi bitta suvenirni va $2$ turidagi bitta suvenirni sotib oldi.

Nihoyat, `buy_souvenirs`$([2], 0)$ qaytaradigan `transaction(1)` ga murojaat qilishi mumkin, ya'ni Amaru $2$ - turdagi bitta suvenir sotib oldi.
E'tibor bering, biz bu yerda `transaction(2)` dan ham foydalanishimiz mumkin edi.
Ayni paytda Amaruda jami $1$ - turidagi bitta suvenir va kerak bo'lganda $2$ - turidagi ikkita suvenir mavjud.

## Greyder namunasi

Kiritish formati:

```
N
P[0]  P[1] ... P[N-1]
```

Chiqish formati:
```
Q[0]  Q[1] ... Q[N-1]
```

Bu yerda $Q[i]$ har bir $i$ ($0 \leq i < N$ ) uchun jami sotib olingan $i$ - turidagi suvenirlar soni.
