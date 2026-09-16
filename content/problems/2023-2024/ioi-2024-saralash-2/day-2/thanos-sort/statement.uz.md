> Ushbu shart IOI 2024 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Thanos sort

Tanosning saralash algoritmi deb quyidagi saralashga aytiladi:  - Agar massiv kamaymaslik
tartibida* saralangan bo’lsa, u holda Tanos hech narsa qilmaydi. - Aks holda Tanos cheksizlik
toshlari yordamida massivni teng ikkiga bo’ladi va istalgan yarmini o’chirib tashlaydi. - Massiv
saralanmagunicha shu ishni davom ettiradi.

Sizda uzunligi Nga teng bo’lgan a[1], a[2], ..., a[N] massivi bor. Shuningdek, Qta so’rovda sizga
l va r sonlari beriladi. Vazifangiz a[l], a[l + 1], ..., a[r] qismmassivni saralash uchun cheksizlik
toshlarini eng kamida nechi marta ishlatish kerakligini topish. Bunda berilgan qismmassiv
uzunligi 2ning darajasi ekanligi kafolatlanadi.

*Kamaymaslik tartibida har bir element o’zidan avvalgi elementdan kichkina bo’lmasligi lozim.
Ya’ni a[1] ≤a[2] ≤... ≤a[N].

Kiruvchi ma’lumotlar: Birinchi qatorda sizga N va Q sonlari beriladi - elementlar va so’rovlar
soni. Ikkinchi qatorda a[1], a[2], ..., a[N] - massiv elementlari. Keyingi Qta qatorda l va r - so’rovlar.

Chiquvchi ma’lumotlar: Qta qatorda har bir so’rov uchun javobni chiqaring.
## Namuna
Masalan, N = 9, a = [3, 1, 4, 1, 5, 9, 2, 6, 5] va Q = 3 bo’lsin.

1-so’rovda l = 1 va r = 8. Ya’ni a′ = [3, 1, 4, 1, 5, 9, 2, 6] massiv uchun minimal amallar sonini
topmoqchimiz. Birinchi amalda massivning chap qismini o’chirib yuboramiz, a′ = [5, 9, 2, 6].
Aytaylik ikkinchi amalda massivning o’ng qismini o’chirib yuboramiz. a′ = [5, 9] va u kamaymaslik
tartibida saralangan. 2ta amal ishlatganimiz uchun javob 2.

2-so’rovda l = 5 va r = 5. a‘ = [5] massiv saralangan bo’lgani uchun hech qanday amallar kerak
emas. Input (Kiruvchi ma’lumotlar):

9 3
3 1 4 1 5 9 2 6 5
1 8
5 5
3 4

Output (Chiquvchi ma’lumotlar):
## Chegaralar
- 1 ≤N ≤131 072
- 1 ≤Q ≤200 000
- 1 ≤a[i] ≤109, barcha 1 ≤i ≤N uchun
- 1 ≤l ≤r ≤N, hamda r −l + 1 = 2x, x-nomanfiy butun son
## Subtasks
  1. (6 ball) So’rovlarda r = l + 1
  2. (13 ball) N ≤8; Q = 1; l = 1; r = N
  3. (21 ball) Q = 1; l = 1; r = N
  4. (24 ball) Barcha so’rovlar uchun javob 2dan oshmaydi.
  5. (15 ball) N ≤16384
  6. (21 ball) Qo’shimcha chegaralarsiz.
