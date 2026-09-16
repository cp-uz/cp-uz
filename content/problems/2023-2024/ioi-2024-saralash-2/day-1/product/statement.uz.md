> Ushbu shart IOI 2024 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Ko‘paytma

Gavhar kiyim do’konidan so’ng sonlar do’konini ham ochdi. Do’konda i-sonning qiymati a[i]ga
teng va narxi c[i] so’m turadi.

Umidning sevimli soni T ga teng. Umid do’kondan bir-nechta sonlarni sotib olmoqchi, bunda
ularning ko’paytmasi T ga teng bo’lishi, umumiy narxi esa minimal bo’lishi zarur. Umidga yordam
bering.
## Kiruvchi ma’lumotlar
Birinchi qatorda sizga N va T sonlari beriladi.
Ikkinchi qatorda a[1], a[2], ..., a[N] - sonlarning qiymati.
Uchinchi qatorda c[1], c[2], ..., c[N] - sonlarning narxi.
## Chiquvchi ma’lumotlar
Agar ko’paytmani T ga tenglashtirishning iloji yo’q bo’lsa, yagona qatorda −1 chiqaring. Aks
holda:

Birinchi qatorda C - minimal narx, k - tanlangan elementlar soni.
Ikkinchi qatorda b[1], b[2], ..., b[k] - tanlangan sonlar indekslari.
Bunda 1 ≤b[1] < b[2] < ... < b[k] ≤N bo’lishi, a[b[1]] · ... · a[b[k]] = T va c[b[1]] + ... + c[b[k]] = C
bo’lishi talab e’tiladi.

Agar minimal narxda sotib olish variantlari ko’p bo’lsa, ulardan ixtiyoriysini chiqarishingiz
mumkin.
## Namuna
Masalan, N = 6, a = [2, 3, 6, 7, 2, 1], c = [1, 4, 9, 1, 3, 1] va T = 12 bo’lsin. Agarda Umid 1, 2, va
5-o’rindagi sonlarni sotib olsa a[1]·a[2]· a[5] = 2·3·2 = 12 bo’ladi va c[1]+c[2]+c[5] = 1+4+3 = 8
so’m bo’ladi.

Input (Kiruvchi ma’lumotlar) #1

6 12

2 3 6 7 2 1
1 4 9 1 3 1

Output (Chiquvchi ma’lumotlar) #1

8 3
1 2 5

Ikkinchi misolda ko’paytmani 18ga tenglashtirishning iloji yo’q. Shuning uchun javobda −1
chiqarish kerak.

Input (Kiruvchi ma’lumotlar) #2

4 18
3 2 2 4
9 2 7 5

Output (Chiquvchi ma’lumotlar) #2

-1
## Chegaralar
- 1 ≤N ≤105
- 2 ≤T ≤109
- 1 ≤a[i] ≤109, barcha 1 ≤i ≤N uchun
- 1 ≤c[i] ≤109, barcha 1 ≤i ≤N uchun
## Subtasks
  1. (12 ball) N ≤18
  2. (13 ball) N ≤100, T ≤100
  3. (20 ball) N ≤1000, T ≤1000.
  4. (11 ball) T = 2x, bunda x - musbat butun son.
  5. (29 ball) C[i] = 1, barcha 1 ≤i ≤N uchun
  6. (15 ball) Qo’shimcha chegaralarsiz

Shuningdek, har bir subtaskda, agar minimal narxni topib, aynan qaysi sonlarni sotib olish
kerakligini chiqarmasangiz, shu subtask ballarini 70% miqdorini qo’lga kiritasiz. Bunda javobda
k = 0 chiqarishingiz kerak, ya’ni:

C 0
