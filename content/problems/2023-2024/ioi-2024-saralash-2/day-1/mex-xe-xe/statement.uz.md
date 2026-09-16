> Ushbu shart IOI 2024 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# MEX-xe-xe

Nodir, Gavhar, Gulnoza, Yahyo va Umid birgalikda NGGYU™kompaniyasiga asos solishdi.
Kompaniyaning asosiy ustuvorlik vazifasi MEX haqida masala ishlash.

MEX - Minimum Excluded, massivda yo’q bo’lgan eng kichkina nomanfiy butun son. Masalan
MEX([1, 2, 0, 5]) = 3 va MEX([1, 3]) = 0.

Sizga Nta elementdan iborat a[1], a[2], ..., a[N] massiv berilgan.

Berilgan k son uchun, a massivni bir-nechta bo’laklarga bo’lishingiz mumkin. Agar har bir
bo’lakning MEX qiymati kdan oshmasa, u holda bu ajratish yaxshi deyiladi. f(k) deb, yaxshi
ajratishdagi minimal bo’laklar soniga aytiladi.

Barcha 1 ≤k ≤N uchun f(k) qiymatini toping.

Kiruvchi ma’lumotlar:

Birinchi qatorda sizga N soni beriladi.
Ikkinchi qatorda a[1], a[2], ..., a[N].

Chiquvchi ma’lumotlar:

Yagona qatorda Nta butun son - f(1), f(2), ..., f(N) chiqaring.
## Namuna
Masalan, N = 8 va a = [0, 1, 1, 2, 0, 2, 1, 0] bo’lsin.

f(1) = 5, chunki massivni [0]; [1, 1, 2]; [0, 2]; [1]; [0] qilib 5ta bo’lakka bo’lishimiz mumkin.

f(2) = 3, chunki massivni [0, 1, 1]; [2, 0, 2]; [1, 0] qilib 3ta bo’lakka bo’lishimiz mumkin.

Input (Kiruvchi ma’lumotlar):

0 1 1 2 0 2 1 0

Output (Chiquvchi ma’lumotlar):

5 3 1 1 1 1 1 1
## Chegaralar
- 1 ≤N ≤106
- 0 ≤a[i] < N, barcha 1 ≤i ≤N uchun
## Subtasks
  1. (7 ball) N ≤100
  2. (7 ball) N ≤1000
  3. (7 ball) N ≤3000
  4. (7 ball) N ≤5000.
  5. (7 ball) N ≤10 000.
  6. (7 ball) N ≤20 000.
  7. (7 ball) N ≤30 000.
  8. (7 ball) N ≤40 000.
  9. (9 ball) N ≤100 000.
 10. (7 ball) N ≤150 000.
 11. (7 ball) N ≤250 000.
 12. (7 ball) N ≤350 000.
 13. (7 ball) N ≤500 000.
 14. (7 ball) Qo’shimcha chegaralarsiz.
