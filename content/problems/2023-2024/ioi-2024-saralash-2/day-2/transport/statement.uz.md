> Ushbu shart IOI 2024 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Transport

Dadorlandtiria mamlakatida (N + 1)ta shahar bor va ular 1dan (N + 1)gacha raqamlangan.
Shuningdek, mamlakatda 4 xil transport turi bor: avtobus, taksi, poyezd, samolyot.

Sizga o’lchamlari 4 × N bo’lgan ikki o’lchamli a massiv berilgan. a[t][i] bu t-transport yordamida
i-shahardan (i + 1)-shaharga borish uchun chipta narxi. Agar a[t][i] = −1 bo’lsa u holda bu
transport bilan i va (i + 1)-shaharlar orasida yurib bo’lmaydi.

Bundan tashqari, har bir transport uchun oylik abonement mavjud. Agar siz qaysidir transportga
abonement sotib olsangiz undan tekinga xohlaganingizcha foydalanishingiz mumkin. t-transport
abonementi c[t] dollar turadi.

Vazifangiz 1-shahardan (N +1)-shaharga borish uchun eng kamida qancha pul sarflash kerakligini
topish. Agar buni iloji yo’q bo’lsa −1 chiqaring.

E’tibor bering, Dadorlandtiria mamlakatida barcha yo’llar bir tomonlik. Ya’ni i-shahardan
(i + 1)-shaharga o’tish mumkin, biroq (i + 1)-shahardan i-shaharga o’tib bo’lmaydi.

Kiruvchi ma’lumotlar: Birinchi qatorda sizga N, c[1], c[2], c[3], c[4] sonlari beriladi - yo’llar
soni va abonement narxlari. Keyingi 4ta qatorda Ntadan butun son, ikki o’lchamli a massiv
elementlari.

Chiquvchi ma’lumotlar: Yagona qatorda 1-shahardan (N +1)-shaharga borish uchun minimal
pul miqdori. Agar buni iloji yo’q bo’lsa −1 chiqaring.
## Namuna
Masalan, N = 5, c = [11, 6, 10, 99] bo’lsin. 2- va 3- transportlarga c[2] + c[3] = 5 + 10 = 15 dollarga
abonement sotib olamiz. Shunda: * 1-shahardan 2-shaharga bepul boramiz. (2-transport orqali).
* 2-shahardan 3-shaharga bepul boramiz. (3-transport orqali). * 3-shahardan 4-shaharga 4 dollar
evaziga boramiz. (1-transport orqali). * 4-shahardan 5-shaharga bepul boramiz. (3-transport

orqali). * 5-shahardan 6-shaharga bepul boramiz. (2-transport orqali).

Jami 15 + 0 + 0 + 4 + 0 + 0 = 19 dollar ishlatdik. Ko’rsatish mumkinki 19 minimal javob.

Input (Kiruvchi ma’lumotlar):

5 11 5 10 99

-1 5 4 -1 -1
4 -1 -1 -1 9
-1 8 -1 6 -1
10 10 10 10 10

Output (Chiquvchi ma’lumotlar):
## Chegaralar
- 1 ≤N ≤105
- 1 ≤c[t] ≤108, barcha 1 ≤t ≤4 uchun
- −1 ≤a[t][i] ≤1000, barcha 1 ≤t ≤4 va 1 ≤i ≤N uchun
## Subtasks
  1. (11 ball) a[i][j]̸ = −1
  2. (10 ball) Abonement sotib olmasdan ham optimal javob topish mumkin.
  3. (20 ball) Faqat 1ta transportga abonement sotib olish orqali optimal javob topish mumkin.
  4. (21 ball) Ko’pi bilan 2ta transportga abonement sotib olish orqali optimal javob topish
    mumkin.
  5. (29 ball) Faqatgina 1- va/yoki 2- turdagi transportlar orqali optimal javobni topish mumkin.
  6. (9 ball) Qo’shimcha chegaralarsiz.
