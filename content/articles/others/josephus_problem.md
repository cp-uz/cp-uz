---
article_id: others--josephus_problem
---
# Josephus masalasi

## Masala sharti

$n$ va $k$ natural sonlari berilgan. $1$ dan $n$ gacha bo‘lgan barcha sonlar aylana bo‘ylab yozilgan. Avval birinchi sondan boshlab $k$-son sanaladi va o‘chiriladi. So‘ng keyingi sondan boshlab yana $k$ ta son sanaladi va $k$-son o‘chiriladi. Jarayon bitta son qolguncha davom etadi. Oxirgi qolgan sonni topish talab etiladi.

Bu masalani I asrda **Flavius Josephus** taklif qilgan, garchi uning dastlabki ko‘rinishi torroq, ya’ni $k=2$ uchun bo‘lgan.

Jarayonni to‘g‘ridan-to‘g‘ri modellashtirish bilan masalani $O(n^2)$ vaqtda yechish mumkin. [Segment daraxti](../data_structures/segment_tree.md) yordamida bu vaqtni $O(n \log n)$ gacha yaxshilash mumkin. Ammo bundan ham tezroq yechim izlaymiz.

## $O(n)$ yechimni modellashtirish

$J_{n,k}$ masala javobini oldingi kichik masalalar javobi orqali ifodalovchi qonuniyatni topishga harakat qilamiz.

To‘g‘ridan-to‘g‘ri modellashtirish bilan, masalan, quyidagi qiymatlar jadvalini tuzish mumkin:

$$\begin{array}{ccccccccccc}
n\setminus k & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 \\
1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \\
2 & 2 & 1 & 2 & 1 & 2 & 1 & 2 & 1 & 2 & 1 \\
3 & 3 & 3 & 2 & 2 & 1 & 1 & 3 & 3 & 2 & 2 \\
4 & 4 & 1 & 1 & 2 & 2 & 3 & 2 & 3 & 3 & 4 \\
5 & 5 & 3 & 4 & 1 & 2 & 4 & 4 & 1 & 2 & 4 \\
6 & 6 & 5 & 1 & 5 & 1 & 4 & 5 & 3 & 5 & 2 \\
7 & 7 & 7 & 4 & 2 & 6 & 3 & 5 & 4 & 7 & 5 \\
8 & 8 & 1 & 7 & 6 & 3 & 1 & 4 & 4 & 8 & 7 \\
9 & 9 & 3 & 1 & 1 & 8 & 7 & 2 & 3 & 8 & 8 \\
10 & 10 & 5 & 4 & 5 & 3 & 3 & 9 & 1 & 7 & 8 \\
\end{array}$$

Jadvalda quyidagi **qonuniyat** aniq ko‘rinadi:

$$J_{n,k} = \left((J_{n-1,k} + k - 1) \bmod n\right) + 1$$

$$J_{1,k} = 1$$

Pozitsiyalarni 1 dan raqamlash formulani biroz noqulay qiladi. Ularni 0 dan raqamlasak, juda sodda formula olinadi:

$$J_{n,k} = (J_{n-1,k} + k) \bmod n$$

Shunday qilib, Josephus masalasini $O(n)$ amal bilan yechadigan usul topildi.

## Amalga oshirish

1 dan raqamlash uchun sodda **rekursiv yechim**:

```{.cpp file=josephus_rec}
int josephus(int n, int k) {
    return n > 1 ? (josephus(n-1, k) + k - 1) % n + 1 : 1;
}
```

**Rekursiyasiz ko‘rinish**:

```{.cpp file=josephus_iter}
int josephus(int n, int k) {
    int res = 0;
    for (int i = 1; i <= n; ++i)
        res = (res + k) % i;
    return res + 1;
}
```

Bu formulani tahliliy ravishda ham chiqarish mumkin. Yana pozitsiyalarni 0 dan raqamlaymiz. Birinchi son o‘chirilgach, $n-1$ ta son qoladi. Jarayonni davom ettirganda, dastlabki indeksi $k \bmod n$ bo‘lgan sondan boshlaymiz. Qolgan aylana 0 dan boshlanganida uning javobi $J_{n-1,k}$ bo‘lar edi; aslida $k$ dan boshlaganimiz uchun $J_{n,k} = (J_{n-1,k} + k) \bmod n$ bo‘ladi.

## $O(k \log n)$ yechimni modellashtirish

$k$ nisbatan kichik bo‘lsa, yuqoridagi $O(n)$ rekursiv yechimdan tezroq usul topish mumkin. $k$ soni $n$ dan ancha kichik bo‘lsa, bitta bosqichda $\left\lfloor \frac{n}{k} \right\rfloor$ ta sonni alohida aylanib chiqmasdan o‘chirish mumkin.

Shundan keyin $n - \left\lfloor \frac{n}{k} \right\rfloor$ ta son qoladi va $\left\lfloor \frac{n}{k} \right\rfloor \cdot k$-sondan boshlaymiz. Demak, javob indeksini shuncha surish kerak. $\left\lfloor \frac{n}{k} \right\rfloor \cdot k$ qiymati $-n \bmod k$ ga tengligini ko‘rish mumkin. Har $k$-sonni o‘chirganimiz sababli natija indeksidan oldin nechta son o‘chirilganini ham qo‘shish kerak; buni natija indeksini $k-1$ ga bo‘lib topamiz.

$n<k$ bo‘lgan holatni ham alohida qayta ishlash zarur. Aks holda yuqoridagi optimallashtirish cheksiz rekursiyaga olib keladi.

Qulaylik uchun 0 dan raqamlashdagi **amalga oshirish**:

```{.cpp file=josephus_fast0}
int josephus(int n, int k) {
    if (n == 1)
        return 0;
    if (k == 1)
        return n-1;
    if (k > n)
        return (josephus(n-1, k) + k) % n;
    int cnt = n / k;
    int res = josephus(n - cnt, k);
    res -= n % k;
    if (res < 0)
        res += n;
    else
        res += res / (k - 1);
    return res;
}
```

Algoritmning **murakkabligi**ni baholaymiz. $n<k$ holati eski yechim bilan $O(k)$ vaqtda bajariladi. Asosiy algoritmning har bir bosqichidan keyin $n$ ta son o‘rniga $n\left(1-\frac{1}{k}\right)$ ta son qoladi. Shuning uchun bosqichlar soni $x$ ni taxminan quyidagi tenglamadan topish mumkin:

$$n\left(1-\frac{1}{k}\right)^x = 1.$$

Ikki tomondan logarifm olsak:

$$\ln n + x \ln\left(1-\frac{1}{k}\right) = 0,$$

$$x = -\frac{\ln n}{\ln\left(1-\frac{1}{k}\right)}.$$

Logarifmni Taylor qatoriga yoyib, taxminiy baho olamiz:

$$x \approx k \ln n.$$

Demak, algoritmning haqiqiy murakkabligi $O(k \log n)$.

## $k=2$ uchun tahliliy yechim

Josephus Flavius taklif qilgan ayni shu xususiy holat ancha oson yechiladi.

$n$ juft bo‘lsa, barcha juft raqamlar o‘chiriladi va $\frac{n}{2}$ o‘lchamli masala qoladi. $n$ uchun javob $\frac{n}{2}$ uchun javobni ikkiga ko‘paytirib, pozitsiya siljishi sababli birni ayirish orqali olinadi:

$$J_{2n,2} = 2J_{n,2} - 1$$

$n$ toq bo‘lsa, barcha juft raqamlar, so‘ng birinchi raqam o‘chiriladi va $\frac{n-1}{2}$ o‘lchamli masala qoladi. Pozitsiya siljishini hisobga olib:

$$J_{2n+1,2} = 2J_{n,2} + 1$$

Bu rekurrent bog‘lanishni kodda bevosita ishlatish mumkin. Qonuniyatni boshqa ko‘rinishda ham yozish mumkin: $J_{n,2}$ barcha toq sonlar ketma-ketligidan iborat bo‘lib, $n$ ikkining darajasi bo‘lganda yana birdan boshlanadi. Bitta formula bilan:

$$J_{n,2} = 1 + 2\left(n-2^{\lfloor \log_2 n \rfloor}\right)$$

## $k>2$ uchun tahliliy yechim

Masala sodda ko‘rinsa va u haqda ko‘plab maqolalar yozilgan bo‘lsa ham, $k>2$ uchun Josephus masalasining sodda tahliliy ifodasi hozirgacha topilmagan. Kichik $k$ lar uchun ayrim formulalar chiqarilgan, ammo amalda ularning barchasini qo‘llash qiyin. Masalan, Halbeisen va Hungerbuhlerning “The Josephus Problem”, shuningdek Odlyzko va Wilfning “Functional iteration and the Josephus problem” ishlariga qarang.
