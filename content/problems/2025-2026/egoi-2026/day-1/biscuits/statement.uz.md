> Ushbu shart EGOI 2026 rasmiy repozitoriysidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Avrora va Bianka amaretti pechenyelarini yaxshi ko’rishadi va bugun ularning bobosi kattakon pechenyalar to’plamini pishirdi. Pechenyelarni o’zaro bo’lishib olish uchun ular quyidagi o’yinni o’ylab topishdi. To’plamda hech bo’lmasa bitta pechenya bor ekan, ular quyidagi jarayonni takrorlashadi:

1. Avrora $X\ge 0$ butun sonini tanlaydi.

2. Keyin, Bianka quyidagi shartlarni qanoatlantiruvchi $Y\ge 0$ butun sonini tanlaydi:

   - to’plamdan kamida $Y$ ta pechenye qolgan bo’lishi kerak, va

   - $Y \ne X$.

3. Keyin Avrora eng ustidagi $Y$ ta pechenyeni yeydi (agar $Y = 0$ bo’lsa, umuman pechenye yemaydi).

4. Agar hali ham pechenyalar qolgan bo’lsa, Bianka eng ustidagi bitta pechenyeni yeydi.

Albatta, har bir qiz imkon qadar xursand bo’lishni istaydi. To’plamdagi har bir pechenye 1 $\le Wi \le 50$ og’irlikka ega. Barcha pechenyelar yeb bo’lingach, har bir qizning **xursandchiligi** o’yin davomida u yegan barcha pechenyelar og’irliklarining yig’indisiga teng bo’ladi. Ikkala qiz ham o’yinni optimal o’ynashni bilishadi — ular har bir qadamda o’z xursandchiligini maksimal darajaga ko’taradigan yurishlarni amalga oshiradi.

O’yin juda qiziqarli bo’lgani uchun, endi ular uni har kuni o’ynashni xohlashadi! Keyingi $Q$ kun davomida ularning bobosi har kuni xuddi shuncha miqdordagi pechenyelardan iborat yangi pechenyelar to’plamini pishiradi. O’yinni qiziqarliroq qilish uchun, har kuni u faqat bitta pechenyening og’irligini o’zgartiradi, qolganlarining og’irligi esa oldingi kundagidek qoladi.

Dastlabki to’plam uchun uchun va to’plamdagi har bir shunday o’zgarishdan so’ng, siz har kungi o’yin oxirida **Biankaning xursandchiligini** aniqlashingiz kerak.

## Kiruvchi ma’lumotlar

Kiruvchi ma’lumotlarning birinchi qatorida ikkita butun son $N$ va $Q$ beriladi, bular to’plamdagi pechenyalar soni va o’zgarishlar sonini anglatadi. Pechenyalar yuqoridan pastga qarab 0 dan $N-1$ gacha raqamlangan. 0 eng yuqoridagi va $N-1$ eng pastdagi pechenye raqamlari.

Ikkinchi qatorda $N$ ta butun son $W_{0}$, $ W_{1}$, …, $ W_{N-1}$ — pechenyalarning dastlabki og’irliklari kiritiladi. Keyingi $ Q$ ta qatorning $ i$-sida ikkita butun son $ P_{i}$ va $ Z_{i}$ berilgan bo’lib, bu $ i$-o’zgarishni tavsiflaydi: ya’ni ularning bobosi $ P_{i-}$pechenyening og’irligini $ Z_{i}$ ga o’zgartiradi. Boshqacha qilib aytganda, $ W_{Pi}$ ning qiymati $ Z_{i}$ ga o’zgaradi.

## Chiquvchi ma’lumotlar

$Q+$ 1 ta butun sonni, har bir o’yindan so’ng Biankaning xursandchiligini chop eting.

## Chegaralar

- 2 $\le N\le 100000$.

- 0 $\le Q\le 100000$.

- 1 $\le Wi \le 50$ (ha, amaretti pechenyalari juda yengil!).

• 0 $\le Pi \le N-1$ va 1 $\le Zi \le 50$.

## Baholash

Dasturingiz subtasklarga bo’lingan bir nechta testlarda sinovdan o’tkaziladi. Subtaskda ball olish uchun dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.

- **Qism-masala 0 [ 0 ball]** : Sample testlar.

- **Qism-masala 1 [ 8 ball]** : $Q = 0$ va $W_{i} = 1$.

- **Qism-masala 2 [ 9 ball]** : $N\le 3$, $ Q\le 5$.

- **Qism-masala 3 [11 ball]** : Istalgan vaqtda $W_{i}$ og’irliklar o’smaydigan tartibda bo’ladi; boshqacha qilib aytganda, $W_{0} \ge W1$ ≥… $\ge WN-1$ sharti doimo bajariladi.

- **Qism-masala 4 [13 ball]** : $N\le 100$, $ Q\le 50$.

- **Qism-masala 5 [18 ball]** : $N\le 20000$, $ Q\le 50$.

- **Qism-masala 6 [12 ball]** : $N\le 20000$, $ Q\le 5000$.

- **Qism-masala 7 [29 ball]** : Qo’shimcha chegaralarsiz.

## Misollar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
2 1
10 15
1 1
```

**Chiquvchi ma’lumotlar**

```text
10
1
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
5 2
1 1 1 1 2
2 20
3 30
```

**Chiquvchi ma’lumotlar**

```text
3
4
24
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
4 2
1 2 4 8
3 2
2 3
```

**Chiquvchi ma’lumotlar**

```text
7
4
4
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
3 0
1 1 1
```

**Chiquvchi ma’lumotlar**

```text
1
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
3 4
50 8 1
1 1
1 8
2 7
2 1
```

**Chiquvchi ma’lumotlar**

```text
8
1
8
8
8
```

## Izoh
**Birinchi misol.** Birinchi kuni pechenyalarning og’irliklari 10 va 15 ga teng.

- Avrora tanlashi uchun optimal raqam bu $X = 1$. Shundan so’ng, Bianka $ Y = 0$ ni tanlaydi va eng ustidagi pechenyeni yeydi.

- Ikkinchi yurishda, Avrora $X = 0$ ni tanlaydi. Biankaning yagona varianti bu $Y = 1$ ni tanlash. Keyin, Avrora 15 og’irlikdagi pechenyeni yeydi va o’yin tugaydi.

Ikkinchi kuni 1-pechenyening og’irligi 1 ga o’zgartiriladi va pechenyalarning og’irliklari endi [10, 1] ga teng bo’ladi.

- Avrora tanlashi uchun optimal raqam bu $X = 0$. Keyin, Bianka $ Y = 1$ ni tanlaydi. Avrora eng ustki pechenyeni yeydi, Bianka esa qolganini yeydi.

O’yindan so’ng Biankaning xursandchiligi 1 ga teng bo’ladi.

- **Ikkinchi misol.** Pechenyalarning dastlabki og’irliklari yuqoridan pastga qarab [1, 1, 1, 1, 2] ga teng.

   - Avrora uchun $X = 0$ ni tanlash optimal. Shundan so’ng Bianka $Y = 1$ ni tanlaydi. Avrora birinchi pechenyeni yeydi, Bianka esa ikkinchisini.

   - Keyingi navbatda, Avrora $X = 0$ ni tanlaydi. Keyin Bianka $Y = 2$ ni tanlaydi. Avrora keyingi ikkita pechenyeni yeydi, Bianka esa oxirgisini. O’yin Biankaning umumiy xursandchiligi 3 bo’lishi bilan tugaydi.

Birinchi o’zgarishdan keyin og’irliklar [1, 1, 20, 1, 2] ga teng bo’ladi.

- Endi Avrora uchun $X = 2$ ni tanlash optimal. (Agar u boshqa istalgan qiymatni tanlasa, Bianka $Y = 2$ ni tanlagan bo’lar edi va u holda Avrora o’rtadagi katta pechenyeni yeya olmas edi.) Avroraning tanloviga javoban, Bianka $Y = 0$ ni tanlaydi va birinchi pechenyeni yeydi. Qolgan pechenye og’irliklari [1, 20, 1, 2].

- Ikkinchi navbatda, Avrora $X = 1$ ni, Bianka esa $Y = 0$ ni tanlaydi. Yana Bianka eng ustki pechenyeni yeydi. Shundan so’ng, qolgan pechenye og’irliklari [20, 1, 2] bo’lib qoladi.

- Uchinchi navbatda, Avrora $X = 0$ ni tanlaydi. Bianka $Y = 2$ ni tanlaydi. Shundan so’ng Avrora 20 va 1 og’irlikdagi pechenyelarni yeydi, va oxirida Bianka oxirgi 2 og’irlikdagi pechenyeni yeydi. Bianka yegan pechenyelarning umumiy og’irligi 1 + 1 + 2 = 4.

Ikkinchi o’zgarishdan keyin og’irliklar [1, 1, 20, 30, 2] ga teng. Agar ikkala qiz ham optimal o’ynasa, Bianka 30 og’irlikdagisidan tashqari barcha pechenyelarni yeydi.
