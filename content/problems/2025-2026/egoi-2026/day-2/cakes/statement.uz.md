> Ushbu shart EGOI 2026 rasmiy repository’sidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

kabi turli xil masalliqlar bilan bezatilgan. Lilianada jami 𝑁 xil turdagi masalliq bor va uning qo’lida
𝑖-turidagi masalliqdan 𝑎𝑖 dona mavjud.
Tortning “mazzaliligi” uning ustiga eng ko’p qo’yilgan masalliqning soni bilan belgilanadi. Masalan:

- {1, 1, 2, 2, 2} masalliqli tortning mazzaliligi 3 ga teng, chunki 2-masalliq uch marta qatnashgan.
- {0, 0, 1, 1, 2} masalliqli tortning mazzaliligi 2 ga teng, chunki ham 0, ham 1-masalliq ikki
martadan qatnashgan va hech qaysi masalliq undan ko’proq uchramaydi.
Liliana barcha masalliqlardan foydalanib, birorta masalliqni orttirmasdan, bir xil mazzalilikka ega
bir nechta tort pishirmoqchi. U hali nechta tort pishirishni hal qilmagan. U 𝑄 ta ssenariyni ko’rib
chiqmoqda, ularning har birida tortlar soni 𝐾𝑗 qilib belgilangan. Har bir ssenariy uchun, barcha
masalliqlarni taqsimlab, aynan 𝐾𝑗 ta tort hosil qilish mumkin yoki yo’q ekanligini aniqlang, bunda
barcha tortlar bir xil mazzalilikka ega bo’lishi kerak. Tortlar turlicha miqdordagi masalliqqa ega
bo’lishi mumkin, lekin har bir tort kamida bitta masalliqqa ega bo’lishi shart.
Kiruvchi ma’lumot
Kiruvchi ma’lumotlarning birinchi qatorida 𝑁 va 𝑄 butun sonlari berilgan, bular masalliqlar turlari
soni va ssenariylar sonini ifodalaydi. Ikkinchi qatorda 𝑁 ta butun son 𝑎0, 𝑎1, …, 𝑎𝑁−1 berilgan, bunda
𝑎𝑖 𝑖-turidagi masalliqning sonini bildiradi. Keyingi 𝑄 ta qatorning har birida bittadan butun son 𝐾𝑗
berilgan, bu 𝑗-ssenariy uchun tortlar sonini bildiradi.
Chiquvchi ma’lumot
𝑄 ta qator chiqaring. Agar barcha masalliqlarni aynan 𝐾𝑗 ta bir xil mazzalilikdagi tortlarga taqsimlash
imkoni bo’lsa, 𝑗-qatorga YES, aks holda NO chiqaring.
Cheklovlar

- 1 ≤ 𝑁 , 𝑄 ≤ 100 000.
- 1 ≤ 𝑎𝑖 ≤ 100 000.
- 1 ≤ 𝐾𝑗 ≤ 1018.

## Baholash

Dasturingiz qism-masalalarga guruhlangan (subtask) bir nechta testlarda sinovdan o’tkaziladi. Biror
qism-masaladan ball olishingiz uchun, sizning dasturingiz undagi barcha testlarda to’g’ri ishlashi
kerak.

- Qism-masala 0 [ 0 ball]: Sample misollar.
- Qism-masala 1 [ 9 ball]: 𝑁 = 1.
- Qism-masala 2 [22 ball]: 𝑄 = 1 va 𝐾𝑗 = 2.
- Qism-masala 3 [24 ball]: 𝑄 ≤ 5, 𝑁 ≤ 1000, 𝑎𝑖 ≤ 1000.
- Qism-masala 4 [24 ball]: 𝑄 ≤ 5.
- Qism-masala 5 [21 ball]: Qo’shimcha cheklovlar yo’q.
Misollar
stdin stdout
4 5
2 5 1 1
1
2
3
4
5
YES
NO
YES
NO
YES
1 1
4
2
YES
5 3
1 1 1 1 1
1
1000000000000000000
5
YES
NO
YES
Birinchi misolda, Lilianada to’rt xil masalliq bor: ikkita 0-turidagi (yashil uchburchaklar), beshta 1
-turidagi (sariq yulduzchalar), bitta 2-turidagi (to’q sariq doira) va bitta 3-turidagi (ko’k kvadrat)
masalliq.
𝐾 = 1 uchun, Liliana barcha masalliqlarni bitta tortga quyidagicha joylashtirib, mazzaliligi 5 bo’lgan
bitta tort tayyorlashi mumkin:

- 1-tort: {0, 0, 1, 1, 1, 1, 1, 2, 3} (1-masalliq besh marta qatnashgan).
Figure  1: 𝐾 = 1 uchun taqsimot namunasi.
𝐾 = 2 uchun, Liliana barcha masalliqlarni ikki xil mazzalilikdagi tortlarga taqsimlay olmaydi.
𝐾 = 3 uchun, Liliana 3 ta tort tayyorlashi mumkin, ularning har birining mazzaliligi 2 ga teng,
masalliqlarni quyidagicha taqsimlab:

- 1-tort: {0, 0, 1} (0-masalliq ikki marta qatnashgan).
- 2-tort: {1, 1, 2} (1-masalliq ikki marta qatnashgan).
- 3-tort: {1, 1, 3} (1-masalliq ikki marta qatnashgan).
Figure  2: 𝐾 = 3 uchun taqsimot namunasi.
𝐾 = 4 uchun, Liliana barcha masalliqlarni to’rt xil mazzalilikdagi tortlarga taqsimlay olmaydi.
𝐾 = 5 uchun, Liliana 5 ta tort tayyorlashi mumkin, ularning har birining mazzaliligi 1 ga teng,
masalliqlarni quyidagicha taqsimlab:

- 1-tort: {0, 1} (0 va 1 masalliqlari har biri bir martadan qatnashgan).
- 2-tort: {0, 1} (0 va 1 masalliqlari har biri bir martadan qatnashgan).
- 3-tort: {1} (1-masalliq bir marta qatnashgan).
- 4-tort: {1, 2} (1 va 2 masalliqlari har biri bir martadan qatnashgan).
- 5-tort: {1, 3} (1 va 3 masalliqlari har biri bir martadan qatnashgan).
Figure  3: 𝐾 = 5 uchun taqsimot namunasi.
