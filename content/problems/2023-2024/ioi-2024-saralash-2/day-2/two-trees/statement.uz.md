> Ushbu shart IOI 2024 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Ikki daraxt

Daraxt deb bog’langan yo’nalmagan asiklik grafga aytiladi.

Sizga ikkita ildizli daraxt berilgan, ikkala daraxtda ham Ntadan tugun bor. Birinchi daraxtning
ildizi r1, ikkinchi daraxtning ildizi r2-tugun.

S1(v) deb shunday u tugunlar to’plamiga aytiladiki, birinchi daraxtda r1dan u tugunga boruvchi
yo’l v tugundan o’tadi. Xuddi shunday, S2(v) deb shunday u tugunlar to’plamiga aytiladiki,
ikkinchi daraxtda r2dan u tugunga boruvchi yo’l v tugundan o’tadi.

Sizdan so’ralgan narsa barcha 1 ≤v ≤N tugunlar uchun S1(v) ∩S2(v) to’plam kesishmalarining
o’lchamlarini topish.

Kiruvchi ma’lumotlar: Birinchi qatorda sizga N, r1 va r2 butun sonlari beriladi - tugunlar
soni va daraxtlarning ildizlari.

Ikkinchi qatorda p1[1], p1[2], ..., p1[N] butun sonlari beriladi. Bunda barcha 1 ≤i ≤N va  i̸ = r1
uchun birinchi daraxtda i va p1[i] tugunlar o’rtasida qirra bor.

Uchinchi qatorda p2[1], p2[2], ..., p2[N] butun sonlari beriladi. Bunda barcha 1 ≤i ≤N va  i̸ = r2
uchun ikkinchi daraxtda i va p2[i] tugunlar o’rtasida qirra bor.

E’tibor bering, p1[r1] va p2[r2] elementlarning qiymatlari −1ga teng.

Chiquvchi ma’lumotlar: Yagona qatorda Nta son chiqaring, har bir v uchun javob.
## Namuna
Masalan, N = 5, r1 = 3, r2 = 1 bo’lsin, hamda p1 = [3, 3, −1, 1, 2] va p2 = [−1, 1, 2, 3, 3] deylik. U
holda daraxtlar quyidagi ko’rinishda bo’ladi: _____
- S1(1) = {1, 4} va S2(1) = {1, 2, 3, 4, 5}. Ularning kesishmasi {1, 4}ga teng.
- S1(2) = {2, 5} va S2(1) = {2, 3, 4, 5}. Ularning kesishmasi {2, 5}ga teng.
- S1(3) = {1, 2, 3, 4, 5} va S2(3) = {3, 4, 5}. Ularning kesishmasi {3, 4, 5}ga teng.
- S1(4) = {4} va S2(4) = {4}. Ularning kesishmasi {4}ga teng.
- S1(5) = {5} va S2(1) = {5}. Ularning kesishmasi {5}ga teng.

Input (Kiruvchi ma’lumotlar):

5 3 1
3 3 -1 1 2
-1 1 2 3 3

Output (Chiquvchi ma’lumotlar):

2 2 3 1 1
## Chegaralar
- 2 ≤N ≤3 · 105
- 1 ≤r1, r2 ≤N
- 1 ≤p1[i] ≤N, barcha 1 ≤i ≤N va  i̸ = r1 uchun
- 1 ≤p2[i] ≤N, barcha 1 ≤i ≤N va  i̸ = r2 uchun
- p1[r1] = −1 va p2[r2] = −1 p1 va p2 massivlar daraxt hosil qilishi kafolatlanadi.
## Subtasks
c(v) bu p[i] = v bo’ladigan i indekslar soni bo’lsin. Binar daraxt deganda barcha 1 ≤v ≤N
tugunlar uchun c(v) = 0 yoki c(v) = 2 shart bajariladigan daraxtga aytiladi. Chiziqli daraxt
deganda barcha 1 ≤v ≤N tugunlar uchun c(v) ≤1 shart bajariladigan daraxtga aytiladi.

  1. (11 ball) Daraxtlar bir xil, ya’ni r1 = r2 va p1 = p2
  2. (12 ball) N ≤3000
  3. (13 ball) Ikkala daraxtlar ham binar.

  4. (17 ball) Ikkala daraxtlar ham chiziqli.

  5. (21 ball) Birinchi daraxt chiziqli.

  6. (26 ball) Qo’shimcha chegaralarsiz.
