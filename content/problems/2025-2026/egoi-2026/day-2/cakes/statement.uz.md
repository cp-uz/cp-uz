> Ushbu shart EGOI 2026 rasmiy repozitoriysidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Liliana tug’ilgan kunini nishonlayapti va barcha do’stlarini taklif qildi! Tug’ilgan kun kechasini yanada maxsus qilish uchun u bir nechta tort tortiq qilmoqchi, ularning har biri qulupnay, bodom yoki banan kabi turli xil masalliqlar bilan bezatilgan. Lilianada jami $N$ xil turdagi masalliq bor va uning qo’lida $i$-turidagi masalliqdan $ a_{i}$ dona mavjud.

Tortning “mazzaliligi” uning ustiga eng ko’p qo’yilgan masalliqning soni bilan belgilanadi. Masalan:

- {1, 1, 2, 2, 2} masalliqli tortning mazzaliligi 3 ga teng, chunki 2-masalliq uch marta qatnashgan.

- {0, 0, 1, 1, 2} masalliqli tortning mazzaliligi 2 ga teng, chunki ham 0, ham 1-masalliq ikki martadan qatnashgan va hech qaysi masalliq undan ko’proq uchramaydi.

Liliana **barcha masalliqlardan** foydalanib, birorta masalliqni orttirmasdan, bir xil mazzalilikka ega bir nechta tort pishirmoqchi. U hali nechta tort pishirishni hal qilmagan. U $Q$ ta ssenariyni ko’rib chiqmoqda, ularning har birida tortlar soni $K_{j}$ qilib belgilangan. Har bir ssenariy uchun, barcha masalliqlarni taqsimlab, aynan $K_{j}$ ta tort hosil qilish mumkin yoki yo’q ekanligini aniqlang, bunda barcha tortlar bir xil mazzalilikka ega bo’lishi kerak. Tortlar turlicha miqdordagi masalliqqa ega bo’lishi mumkin, lekin har bir tort kamida bitta masalliqqa ega bo’lishi shart.

## Kiruvchi ma’lumot
Kiruvchi ma’lumotlarning birinchi qatorida $N$ va $Q$ butun sonlari berilgan, bular masalliqlar turlari soni va ssenariylar sonini ifodalaydi. Ikkinchi qatorda $N$ ta butun son $a_{0}$, $ a_{1}$, …, $ a_{N-1}$ berilgan, bunda $ a_{i}$ $ i $-turidagi masalliqning sonini bildiradi. Keyingi $ Q $ ta qatorning har birida bittadan butun son $ K_{j}$ berilgan, bu $ j$-ssenariy uchun tortlar sonini bildiradi.

## Chiquvchi ma’lumotlar

$Q$ ta qator chiqaring. Agar barcha masalliqlarni aynan $K_{j}$ ta bir xil mazzalilikdagi tortlarga taqsimlash imkoni bo’lsa, $j$-qatorga YES, aks holda NO chiqaring.

## Cheklovlar

- 1 $\le N $, $ Q\le 100000$.

- 1 $\le ai \le 100000$.

- 1 $\le Kj \le 10^{18}$ .

## Baholash

Dasturingiz qism-masalalarga guruhlangan (subtask) bir nechta testlarda sinovdan o’tkaziladi. Biror qism-masaladan ball olishingiz uchun, sizning dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.

- **Qism-masala 0 [ 0 ball]** : Sample misollar.

- **Qism-masala 1 [ 9 ball]** : $N = 1$.

- **Qism-masala 2 [22 ball]** : $Q = 1$ va $K_{j} = 2$.

- **Qism-masala 3 [24 ball]** : $Q\le 5$, $ N\le 1000$, $ a_{i} \le 1000$.

- **Qism-masala 4 [24 ball]** : $Q\le 5$.

- **Qism-masala 5 [21 ball]** : Qo’shimcha cheklovlar yo’q.

## Misollar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
4 5
2 5 1 1
1
2
3
4
5
```

**Chiquvchi ma’lumotlar**

```text
YES
NO
YES
NO
YES
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
1 1
4
2
```

**Chiquvchi ma’lumotlar**

```text
YES
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
5 3
1 1 1 1 1
1
1000000000000000000
5
```

**Chiquvchi ma’lumotlar**

```text
YES
NO
YES
```
