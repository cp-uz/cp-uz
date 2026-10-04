> Ushbu shart APIO 2023 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

3724-yil kirib keldi, hamda endi APIOni o'tkazish navbati Cyberland mamlakati zimmasiga tushdi. Ushbu dunyoda, 0 dan $N - 1$ gacha raqamlangan jami $N$ ta mamlakat mavjud hamda ular 0 dan $M - 1$ gacha raqamlangan jami $M$ ta yo'nalmagan(ikkila tomonga ham yurib bo'ladigan) yo'llar bilan bog'langan. Har bir yo'l ikkita har xil, $x[i]$ va $y[i]$ mamlakatlarni o'zaro bog'laydi hamda bu yo'ldan o'tish $c[i]$ vaqt birligi talab etadi. Sizning mamlakatingizdan tashqari barcha mamlakatlar Cyberland mamlakatida APIOda ishtirok etish uchun yig'ilib bo'lishdi. Siz 0-mamlakatda istiqomat qilasiz, Cyberland esa $H$ -mamlakat hisoblanadi. Mamlakatdagi eng aqlli inson sifatida, tezlik bilan yana bir bor yordamingiz kerak bo'ladi. Sizdan sizning mamlakatingizdan Cyberland mamlakatiga yetib borish uchun kerak bo'ladigan minimal vaqt miqdorini topish so'ralgan.

Ba'zi mamlakatlar o'z maxsus sehriga ega. Ba'zi mamlakatlarda siz hozirgacha sarflagan jami vaqtingizni 0 ga tushirishingiz mumkin(tozalash-sehri). Boshqa ba'zi mamlakatlarda esa hozirgacha sarflagan jami vaqtingizni 2 ga bo'lishingiz mumkin(2-ga-bo'lish-sehri). Mamlakatlarga istalgan marta qayta kirishingiz mumkin. Har safar mamlakatga kirganingizda **maxsus sehrni ishlatish yoki ishlatmaslikni siz o'zingiz tanlay olasiz** . Ammo mamlakatga **har bir kirishingizda ko'pi bilan bir marta maxsus sehrni ishlata olasiz** (agar ko'p marta kirsangiz, har safar yangidan ishlatishingiz mumkin). Bundan tashqari, siz 2-ga-bo'lish-sehrini **jami miqdorda ko'pi bilan** $K$ **marta** ishlata olasiz. Yodda tuting **bir marta Cyberlandga yetsangiz, undan boshqa chiqa olmaysiz** sababi APIO musobaqasi tez orada boshlanadi.

Sizga _arr_ massivi berilgan bo'lib, _arri_ sizga $i$ -mamlakatning sehrini ko'rsatadi. 3 xil turdagi sehr mavjud:

_arri_ = 0, tozalash-sehrini anglatadi, u orqali hozirgacha sarflagan vaqtingizni 0 ga tenglashtirishingiz mumkin.

- _arri_ = 1, hech qanday sehr yo'q, ya'ni hozirgacha sarflagan vaqtingiz o'zgarishsiz qoladi. _arri_ = 2, 2-ga-bo'lish-sehrini anglatadi, u orqali hozirgacha sarflagan vaqtingizni 2 ga bo'lib beradi.

_arr_ 0 = _arrH_ = 1 ekanligi kafolatlanadi. Boshqa so'zlar bilan aytganda, Cyberland hamda sizning mamlakatingiz hech qanday sehrga ega emas.

Sizning mamlakatingiz APIOga kechikmoqchi emas, shuning uchun Cyberlandga yetib olish uchun kerak bo'ladigan minimal vaqt miqdorini topishingiz kerak. Agar Cyberlandga yetib bora olmasangiz, javob −1 bo'lishi lozim.

## Kod yozish detallari

Quyidagi funksiyani e'lon qilishingiz kerak bo'ladi:

```cpp
double solve(int N, int M, int K, int H, std::vector<int> x, std::vector<int> y, std::vector<int> c, std::vector<int> arr);
```

- $N$ : mamlakatlar soni.

- $M$ : yo'nalmagan yo'llar soni.

- $K$ : 2-ga-bo'lish-sehrini ishlatishga bo'lgan chegara.

- $H$ : Cyberland mamlakatining raqami(indeksi).

- $x $ , $ y $ , $ c $ : uzunliklari $ M $ ga teng uchta massiv. ( $ x[i]$, $ y[i]$, $ c[i]$) uchlik $ i$ -yo'lni anglatadi. Bu yo'l $ x[i]$ mamlakatni $ y[i]$ mamlakat bilan bog'laydi hamda undan o'tish $ c[i]$ vaqt talab etadi.

- _arr_ : uzunligi $N$ ga teng massiv. _arr_ [ $i $ ] $ i$ -mamlakatdagi maxsus sehr turini anglatadi.

- Bu funksiya sizning mamlakatingizdan Cyberland mamlakatiga yetib olish uchun ketadigan minimal vaqt miqdorini qaytarishi lozim, agar buni iloji bo'lmasa −1 qaytarishi kerak. Bu funksiya bir martadan ko'proq marta chaqirilishi mumkin.

Dasturingiz qaytargan javob $ans_1$, asl natija $ans_2$ bo‘lsin. Javob $\frac{|ans_1-ans_2|}{\max(ans_2,1)}\le10^{-6}$ bo‘lsa to‘g‘ri hisoblanadi.

Diqqat: **Funksiya ko'p marta chaqirilishi mumkin ekan, eski chaqiruvlarda ishlatilgan ma'lumotlarni yangi chaqiruvga bo'ladigan ta'sirini inobatga olishingiz kerak bo'ladi.**

## Namunalar

Namuna 1

Quyidagicha funksiya chaqiruvini ko'rib chiqaylik:

solve(3, 2, 30, 2, {1, 2}, {2, 0}, {12, 4}, {1, 2, 1});

Cyberlandga olib boradigan yagona usul 0 →2, chunki siz Cyberlandga yetganingizdan so'ng boshqa hech qayerga bora olmaysiz. Bunda vaqt hisobi quyidagicha bo'ladi.

|**mamlakat raqami**||**sarflangan vaqt**|
|---|---|---|
|0|0||
|2|0 + 4→|4(yig'indi)→4(maxsus sehr)|

Shuning uchun ham funksiya 4 qaytarishi lozim.

### Namuna 2

Quyidagicha funksiya chaqiruvini ko'rib chiqaylik:

solve(4, 4, 30, 3, {0, 0, 1, 2}, {1, 2, 3, 3}, {5, 4, 2, 4}, {1, 0, 2, 1});

Sizning mamlakatingizdan Cyberlandga 2 xil usulda borish mumkin. Ular 0 →1 →3 va 0 →2 →3.

- 0 →1 →3 yo'li uchun vaqt hisobi quyidagicha bo'ladi:

|**mamlakat raqami**|**sarflangan vaqt**|
|---|---|
|0|0|
|1|0 + 5→5(yig'indi)→0(maxsus sehr)|
|3|0 + 2→2(yig'indi)→2(maxsus sehr)|

0 →2 →3 yo'li uchun vaqt hisobi quyidagicha bo'ladi:

|**mamlakat raqami**|**sarflangan vaqt**|
|---|---|
|0|0|
|2|0 + 4→4(yig'indi)→2(maxsus sehr)|
|3|2 + 4→6(yig'indi)→6(maxsus sehr)|

Shuning uchun ham funksiya 4 qaytarishi lozim.

## Chegaralar

- $2\le N\le10^5$, barcha chaqiruvlardagi $N$ lar yig‘indisi $10^5$ dan oshmaydi.

- $0\le M\le\min(10^5,N(N-1)/2)$, barcha chaqiruvlardagi $M$ lar yig‘indisi $10^5$ dan oshmaydi.

- $1\le K\le10^6$ va $1\le H<N$.

- $0\le x[i],y[i]<N$, $x[i]\ne y[i]$ va $1\le c[i]\le10^9$.

- $arr[i]\in\{0,1,2\}$.

Ikki mamlakat ko‘pi bilan bitta yo‘l bilan bog‘langanligi kafolatlanadi.

## Qism masalalar

1. (5 ball): $N \le 3$, $ K \le 30$.

2. (8 ball): $M = N - 1$, $ K \le 30$, _arr_ [ $ i $ ] = 1, siz $ M$ ta yo'llardan foydalangan holda istalgan mamlakatdan boshqa mamlakatga sayohat qila olasiz.

3. (13 ball): $M = N - 1$, $ K \le 30$, _arr_ [ $ i $ ] ∈0,1, siz $ M$ ta yo'llardan foydalangan holda istalgan mamlakatdan boshqa mamlakatga sayohat qila olasiz.

4. (19 ball): $M = N - 1$, $ K \le 30$, $ x[i] = i $ , $ y[i] = i$ + 1.

5. (7 ball): $K \le 30$, _arr_ [ $ i$ ] = 1.

6. (16 ball): $K \le 30$, _arr_ [ $ i$ ] ∈{0,1}.

7. (29 ball): $K \le 30$.

8. (3 ball): Qo'shimcha cheklovlarsiz.

## Namunaviy greyder

Namunaviy greyder ma'lumotlarni quyidagi formatda o'qiydi:

qator 1: $T$

$T$ ta test(funksiya chaqiruvi)ning har biri uchun:

- qator 1: _N M K_

- qator 2: $H$

- qator 3: _arr_ [0] _arr_ [1] _arr_ [2]⋯ _arr_ [ $N - 1$] qator 4 + $ i $ ($0 \le i \le M - 1$): $ x[i]$ $ y[i]$ $ z[i]$

Namunaviy greyder natijani quyidagi formatda chiqaradi:

Har bir test uchun:

qator 1:  solve funksiyasi qaytargan qiymat.

---

Manba: [APIO 2023 rasmiy masalalar arxivi](https://github.com/apio2023/apio2023_tasks/tree/af6519ce925e3489a07ed4248a4fb10860246e8a). [Litsenziya: CC0 1.0](https://github.com/apio2023/apio2023_tasks/blob/af6519ce925e3489a07ed4248a4fb10860246e8a/LICENSE).
