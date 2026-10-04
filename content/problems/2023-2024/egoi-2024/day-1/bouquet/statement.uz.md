> Ushbu shart EGOI 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Dunyodagi eng katta bog'lardan biri hisoblangan Keukenhofga tashrif buyurgan Liki gullarni juda ham yaxshi ko'rib qoldi, shuning uchun u yo'lda o'sadigan lolalardan buket yasamoqchi. Biroq, gullarni terayotganda Liki Niderlandiyaning lolalarni asrash qonunlarini hurmat qilishi kerak.

Yo'lda to'g'ri chiziq bo'ylab $N$ ta lola o'sadi, lolalar chapdan-o'ngga 0 dan $N - 1$ gacha raqamlangan. Lolalarni asrash qonuni barcha $i$ -raqamli lola uchun $ l[i]$ va $ r[i]$ butun sonlarini belgilagan. Agarda Liki $ i$ -raqamli lolani buketga qo'shsa, u $ i$ -loladan $ l[i]$ tagacha chapda joylashgan yoki $ i$ -loladan $ r[i]$ tagacha o'ngda joylashgan lolalarni buketga qo'sha olmaydi. E'tibor bering, agarda $ i$ -lolaning chap tarafda $ l[i]$ tadan kamroq, yoki o'ng tarafida $ r[i]$ tadan kamroq lola qolgan bo'lsa, o'sha tarafdagi barcha lolalar buketga qo'shila olmaydi.

Liki agar lolalarni optimal usulda tanlasa, buketda eng ko'pi bilan nechta lola bo'lishi mumkinligini bilmoqchi. Uning savoliga javob berib go'zal buket yasashga yordam bering!

## Kiruvchi ma'lumotlar

Birinchi qatorda $N$ butun son beriladi, yo'lda o'suvchi lolalar soni.

Keyingi $N$ ta qatorda ikkitadan butun son $l_i$ va $r_i$ kiritiladi, $i$ -lola uchun qonun tomonidan belgilangan qiymatlar.

## Chiquvchi ma'lumotlar

Bitta butun son chiqaring: qonunni buzmagan holda ko'pi bilan nechta lolani tanlash mumkinligini.

## Cheklovlar va baholash

- $1 \le N \le 2$ ⋅$10^{5}$.

- 0 ≤ $l_i$ , $r_i$ ≤ $N $ , barcha $ i = 0$,1,..., $ N - 1$ uchun.

Yechimingiz bir-nechta test guruhlarida tekshiriladi. Har bir test guruhi uchun qanchadir ball beriladi. Barcha test guruhlarida bir-nechta testlar bor. Test guruhining ballini olish uchun yechimingiz ushbu guruhdagi barcha testlarda to'g'ri ishlashi kerak.

|**Guruh**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|8|$l = r = l = r $ , barcha ($ i $,$ j $) juftliklar uchun<br>$ i $<br>$ i $<br>$ j $<br>$ j$|
|2|16|$r = 0$, barcha $ i$uchun<br>$ i$|
|3|28|$N \le 1000$|
|4|18|$l $ ,$ r \le 2$barcha $ i$uchun<br>$ i $<br>$ i$|
|5|30|Qo'shimcha cheklovlarsiz|

## Namunalar

E'tibor bering, ba'zi namunalar barcha test guruhlariga mos tushmaydi.

Birinchi misolda, agar Liki 0-lolani tanlasa, u o'ngroqda joylashgan ikkita lolani tanlay olmaydi. 1- lolani tanlash 2-lolani tanlashni ta'qiqlamaydi, biroq 2-lola 1-lolani tanlashga yo'l qo'ymaydi. Demak, Liki maksimum 1 ta lolani tanlashi mumkin.

Ikkinchi misolda, Liki tanlashi mumkin bo'lgan maksimal lolalar soni 3 ga teng va buni qilish usuli rasmda ko'rsatilgan. Lolalar bundan boshqa usulda tanlansa javob kichkinaroq bo'ladi.

Uchinchi misolda, maksimal javob 4 va buni 0, 1, 3 va 6-raqamli lolalar orqali hosil qilish mumkin.

_Diagramma rasmiy PDFda keltirilgan._

_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
3
0 3
1 0
1 0
```

**Chiquvchi ma’lumotlar**

```text
1
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
5
0 3
1 0
0 1
2 0
1 0
```

**Chiquvchi ma’lumotlar**

```text
3
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
7
0 0
0 0
1 0
1 0
2 0
3 0
2 0
```

**Chiquvchi ma’lumotlar**

```text
4
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
6
2 2
2 2
2 2
2 2
2 2
2 2
```

**Chiquvchi ma’lumotlar**

```text
2
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
7
0 2
2 0
1 1
2 2
0 0
0 1
0 1
```

**Chiquvchi ma’lumotlar**

```text
3
```

---

Manba: [EGOI 2024 rasmiy masalalar arxivi](https://github.com/zehnsechs/egoi-2024-testdata/tree/47fefa0ff64124f7fd8421aa12b77ad689a0fb29). [Litsenziya: CC BY-SA](https://github.com/zehnsechs/egoi-2024-testdata/blob/47fefa0ff64124f7fd8421aa12b77ad689a0fb29/day1/bouquet/problem.yaml).
