> Ushbu shart EGOI 2025 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Bu yilgi EGOI musobaqasi Bonn shahrida tashkil etilmoqda. Tashkilotchilar har bir jamoaga ko'pi bilan bittadan sovg'a qutisini tarqatmoqchi, bunda har bir jamoa 0 dan $T - 1$ gacha raqamlangan. Ishtirokchilar bir qatorda aralash turishibdi. Shuning uchun bir jamoaga mansub odamlar yonmayon turmasligi mumkin. E'tibor bering: kamida bitta jamoada bir kishidan ko'proq ishtirokchi bo'lishi kafolatlangan. Qatorda jami $N$ kishi bor. $i$ -indeksdagi shaxs $a_i$ -jamoaga tegishli. Masala quyidagicha: har bir jamoa ko'pi bilan bittadan sovg'a qutisi olishi kerak.

Bu shartni qanoatlantirish uchun tashkilotchilar har bir ishtirokchidan u qaysi jamoada ekanliklarini so'rab chiqa olishmaydi. Buning o'rniga, sovg'a berishni jarayonini to'xtatib, bir nechta ishtirokchilarni o'tkazib yuborib, sovg'a berish jarayonini davom ettirishlari mumkin. Bu amalni tashkilotchilar aynan bir marta qilishlari lozim. Boshqa so'zlar bilan aytganda, tashkilotchilar tanlangan [ℓ, $r$ ] oraliqdagi ishtirokchilardan tashqari barchaga sovg'a berishadi.

Har bir jamoa sovg‘a olishi shart emas. Tashkilotchilar ikkita sovg'a oladigan jamoalar yo'qligini ta'minlagan holda sovg'a oladigan jamoalar sonini iloji boricha ko'p qilishni istashadi. Bu esa, bu masala uchun, shu shart ostida sovg'a berilmay o'tkazib yuborilgan ishtirokchilar sonini minimallashtirishga teng kuchli. Tashkilotchilarga sovg‘ani qachon vaqtincha to‘xtatish yaxshiroq bo‘lishini aniqlashda yordam bering – bunda o‘tkazib yuborilgan ishtirokchilar soni imkon qadar kam bo'lsin.

## Kirish

Birinchi qatorda ikkita butun son: $T $ va $N$ – jami jamoalar va qatordagi ishtirokchilar soni beriladi.

Ikkinchi qatorda $N$ ta butun son: $a_i$ - qatorning $i$ -joyida joylashgan ishtirokchi qaysi jamoaga tegishli ekanligi kiritiladi. 0 va $ T - 1$ oralig'idagi har bir butun son kamida bir marta paydo bo'lishi kafolatlanadi.

## Chiqish

Ikkita butun son ℓ va $r$ ni ekranga chiqaring. Bunda ℓ qatorda o'tkazib yuborilgan birinchi ishtirokchi indeksi va $r$ o'tkazib yuborilgan oxirigi ishtirokchi indeksi. Agar shartga to'g'ri keladigan bir nechta yechim bo'lsa, istalganini chiqaring.

## Chegaralar va baholash

- $1 \le T < N \le 500000$.

- 0 ≤ $a_i$ ≤ $T - 1$.

Sizning yechimingiz har biri bir necha ballga ega bo'lgan subtasklarda sinovdan o'tkaziladi. Har bir subtask bir nechta testlarni o'z ichiga oladi. Subtaskdan ball olish uchun yechimingiz shu subtaskka tegishli barcha testlarga to'g'ri javob berishi kerak.

|**Subtask**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|8|$N = T$ + 1, ya'ni bor yo'g'i bittagina jamoa ishtirokchilari 2 marta uchraydi|
|2|11|$N = 2$ ⋅$ T$va har bir jamoa ishtirokchisi qatorning birinchi yarmida bir marta<br>va ikkinchi yarmida bir martadan uchraydi|
|3|14|$1 \le T < N \le 500$|
|4|21|$N = 2$ ⋅$ T$va har bir jamoa ishtirokchisi 2 marta uchraydi|
|5|22|$1 \le T < N \le 5000$|
|6|24|Qo'shimcha cheklovlarsiz|

## Misollar

Birinchi namuna 1, 3, 5 va 6 subtaskdagi cheklovlarini qondiradi. Quyidagi rasmda tasvirlanganidek, ikki xil javob to'g'ri deb qabul qilinishi mumkin: `1 1` tagiga ko'k uzulishsiz to'g'ri chiziq chizilgan va `4 4` tagiga qizil uzma chiziq to'g'ri chiqizlgan. Ikki holatda ham, to'rttala jamoa ham sovg'a oladi va hech bir jamoa ikki marta sovg'a olmaydi.

Ikkinchi namuna 2, 3, 4, 5 va 6 subtaskdagi cheklovlarini qondiradi. Quyidagi rasmda tasvirlanganidek, ikki xil javob to'g'ri deb qabul qilinishi mumkin: `0 2` va `3 5` . Ikkala holatda ham, uchta jamoaga bittadan sovg'alar beriladi.

Uchinchi namuna 3, 4, 5 va 6 subtasklardagi cheklovlarini qondiradi. Optimal yechimda, quyida ko'rsatilganidek, uchta jamoa sovg'a oladi. 0 , 1 va 7 indekslardagi ishtirokchilar sovg'a olishadi va mos ravishda 0 , 2 va3 jamoalar sovgʻalar oladi. Bu yagona mumkin bo'lgan yechim.

To'rtinchi namuna 3, 5 va 6 subtaskdagi cheklovlarini qondiradi. Quyidagi rasmda tasvirlanganidek, yana ikkita turli to'g'ri javob bo'lishi mumkin: `0 3` va `1 4` . Ikkala holatda ham aynan ikkita jamoa (jamoa 0 va jamoa 1) sovg'a oladi. 2 jamoasi sovg'a olmaydi, chunki buning uchun 0 yoki 1 jamoalariga ikkita sovg'a berish kerak bo'ladi, bu esa qat'iyan man etilgan.

Beshinchi namuna 3, 5 va 6 subtaskdagi cheklovlarini qondiradi. Quyidagi rasmda tasvirlanganidek yagona mumkin bo'lgan javob `2 3` . Barcha - to'rttala jamoaga ham sovg'alar beriladi.

Oltinchi namuna 3, 5 va 6 subtasklardagi cheklovlarini qondiradi. Quyida ko'rsatilganidek, beshta jamoadan ko'pi bilan to'rttasi sovg'a olishi mumkin. 0 , 9, 10 va 11 indekslarida ishtirokchilari mos ravishda 3, 4, 1 va 0 jamoalari sovg'a olishadi. Bu yagona mumkin bo'lgan yechim.

_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
4 5
1 3 0 2 3
```

**Chiquvchi ma’lumotlar**

```text
1 1
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
3 6
1 0 2 2 1 0
```

**Chiquvchi ma’lumotlar**

```text
0 2
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
4 8
0 2 0 1 2 1 3 3
```

**Chiquvchi ma’lumotlar**

```text
2 6
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
3 6
1 1 2 0 1 0
```

**Chiquvchi ma’lumotlar**

```text
0 3
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
4 6
0 1 2 0 3 2
```

**Chiquvchi ma’lumotlar**

```text
2 3
```

### 6-misol

**Kiruvchi ma’lumotlar**

```text
5 13
3 3 3 1 2 0 3 3 2 1 4 1 0
```

**Chiquvchi ma’lumotlar**

```text
1 9
```

---

Manba: [EGOI 2025 rasmiy masalalar arxivi](https://github.com/egoi-org/egoi-2025/tree/e3bb2be66c3a837c57c7f8eac3b5173f40129e13). [Litsenziya: CC BY-SA](https://github.com/egoi-org/egoi-2025/blob/e3bb2be66c3a837c57c7f8eac3b5173f40129e13/day1/giftboxes/problem.yaml).
