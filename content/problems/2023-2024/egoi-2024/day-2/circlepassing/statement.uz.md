> Ushbu shart EGOI 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Bu Anoukning maktabdagi birinchi kuni. Uning jismoniy tarbiya o'qituvchisi o'quvchilar bilan ismlarni o'rganish o'yinini o'ynashga qaror qildi. Sinfda 2 $N $ nafar o'quvchi bor. Ularning ko'pchiligi bir-birini tanimaydi, biroq $M$ juft o'quvchi yaqin do'stlar bo'lib, hamma narsani birgalikda qiladi. Har bir o'quvchining ko'pi bilan bitta yaqin do'sti bor.

O'qituvchi barcha o'quvchilarni aylana bo'ylab joylashtirib, ularni ketma-ket 0 dan 2 $N - 1$ gacha bo'lgan sonlar bo'yicha raqamladi. Shunda, har bir $0 \le i < 2$ $ N - 1$ uchun $ i$ va $ i$ + 1 raqamli o'quvchilar yonma-yon turibdi. Bundan tashqari, 0 va 2 $ N - 1$ raqamli o'quvchilar ham yonma-yon turibdi.

O'qituvchi o'quvchilarining yangi do'stlar orttirishini xohlaydi, buning uchun yaqin do'stlar birbiridan iloji boricha uzoqroq joylashishi kerak, ya'ni bir-birining ro'parasida. Ya'ni, $i $ -raqamli juftlikni tashkil etuvchi do'stlar mos ravishda $k_i$ va ( $k_i$ + $ N $ )-o'rinlarida turishi kerak, bunda 0 ≤ $k_i$ < $ N$ .

O'qituvchi ikki $x$ va $y$ -o'quvchilarni tanlab, $ x $ -o'quvchining qo'liga koptok tutqazadi. Shunda koptok $ y$ -o'quvchigacha yetib kelishi kerak, biroq o'quvchilar koptokni faqatgina o'zlari ismini bilgan o'quvchiga berishlari mumkin. Yaqin do'stlar bir-birining ismini bilishi aniq. Qoidalar tushuntirilar ekan, o'quvchilar o'z yonida turgan ikki o'quvchi ismini ham so'rab oldi. Ushbu holatlardan tashqari, hech kim boshqa ismlarni bilmaydi.

O'quvchilar o'yinni $Q$ marotaba o'ynashadi. Har bir o'yinda o'qituvchi yangi ikki o'quvchini tanlaydi. O'quvchilar e'tibor bermagani bois, ular o'yin davomida yangi ismlarni eslab qola olmaydi. Har o'yinda koptok $x$ -o'quvchidan $ y$ -o'quvchigacha yetib borishi uchun eng kamida necha marotaba uzatilishi kerak?

## Kiruvchi ma'lumotlar

Birinchi qatorda uchta butun son berilgan, $N $ , $ M $ va $ Q $ . Bunda 2 $ N $ – Anouk o'qiydigan sinfdagi o'quvchilar soni, $ M $ – yaqin do'stlardan iborat juftlik soni, $ Q$ – o'ynalgan o'yinlar soni.

Ikkinchi qatorda $M$ ta butun son kiritiladi, $k $ 0,..., _kM_ −1. Bunda $k_i$ yaqin do'stlardan iborat $ i $ -juftlikni bildiradi. Har bir $ i $ uchun, yaqin do'stlar $k_i$ va $k_i$ + $ N$ sonli joylarda turadi. Har bir o'quvchining ko'pi bilan bitta yaqin do'sti bor.

Navbatdagi $Q$ qatorlarning har birida ikkitadan butun son kiritiladi, $x_i$ va $y_i$ , bu $i$ -o'yinda tanlangan ikki nafar o'quvchi.

## Chiquvchi ma'lumotlar

$Q$ ta qator chiqaring. $i $ -qatorda bitta butun son bo'lishi kerak, bunda butun son - $ i$ -o'yindagi uzatmalar soni.

## Cheklovlar va baholash

- $2\le N\le5\cdot10^8$.

- $1\le M\le5\cdot10^5$, $M\le N$ va $1\le Q\le2\cdot10^4$.

- $0\le k_0<k_1<\cdots<k_{M-1}<N$.

- $0\le x_i,y_i<2N$ va $x_i\ne y_i$.

Yechimingiz bir-nechta test guruhlarida tekshiriladi. Har bir test guruhi uchun qanchadir ball beriladi. Barcha test guruhlarida bir-nechta testlar bor. Test guruhining ballini olish uchun yechimingiz ushbu guruhdagi barcha testlarda to'g'ri ishlashi kerak.

|**Group**|**Score**|**Limits**|
|---|---|---|
|1|14|$M = 1$ va $x = k$ . Boshqacha qilib aytganda, bir juftgina yaqin do'stlar bor va<br>har bir o'yinda koptok ushlab turgan o'quvchining yaqin do'sti bor.<br>$ i$<br>0|
|2|20|$N $,$ M $,$ Q \le 1000$|
|3|22|$N\le10^7$ va $M,Q\le1000$.|
|4|17|$x = 0$, barcha $ i$uchun<br>$ i$|
|5|27|Qo'shimcha cheklovlarsiz|

## Namunalar

Quyidagi ikki suratda birinchi va to'rtinchi misollardagi joylashuv ko'rsatilgan. Bir-birini taniydigan ikki o'quvchi qirra yordamida bog'langan.

Birinchi misoldagi birinchi o'yinda koptok 1-raqamli o'quvchiga berildi. U koptokni o'zining yaqin do'sti 5-raqamli o'quvchiga berdi. Koptok 4-o'quvchiga 5-o'quvchi uzatganidan so'ng yetib keladi. Bunda jami ikkita uzatma talab etiladi.

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
4 1 5
1
1 4
1 5
1 7
1 2
1 6
```

**Chiquvchi ma’lumotlar**

```text
2
1
2
1
2
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
6 1 3
5
5 7
5 1
5 11
```

**Chiquvchi ma’lumotlar**

```text
2
3
1
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
4 2 4
2 3
0 2
0 3
0 6
0 7
```

**Chiquvchi ma’lumotlar**

```text
2
2
2
1
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
5 2 5
0 4
0 9
1 8
8 3
1 6
3 9
```

**Chiquvchi ma’lumotlar**

```text
1
3
3
3
2
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
500000000 4 3
543234 1234566 2300001 249999999
2334445 123567
6578996 12455726
3 269979899
```

**Chiquvchi ma’lumotlar**

```text
2210878
5876730
231106567
```

---

Manba: [EGOI 2024 rasmiy masalalar arxivi](https://github.com/zehnsechs/egoi-2024-testdata/tree/47fefa0ff64124f7fd8421aa12b77ad689a0fb29). [Litsenziya: CC BY-SA](https://github.com/zehnsechs/egoi-2024-testdata/blob/47fefa0ff64124f7fd8421aa12b77ad689a0fb29/day2/circlepassing/problem.yaml).
