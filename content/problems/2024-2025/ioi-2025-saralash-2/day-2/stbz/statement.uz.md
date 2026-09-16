> Ushbu shart IOI 2025 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Stabilizatsiya

Ixtiyoriy x[0],x[1],… ,x[m −1] va y[0],y[1],… ,y[m −1] binar massivlarning go'zalligi quyidagi
tartibda hisoblanadi.

Har daqiqada quyidagi protsess bo'ladi deylik:

      →1     z    deb   z   massivning  1  marta   o'ngga   surilgan   holatini   aytamiz,   ya'ni
      →1     z  = z[m −1],z[0],z[1],z[2],… ,z[m −2]
     Barcha 0 ≤i < m uchun, x[i] := x[i] & x→1 [i] hamda y[i] := y[i] & y →1 [i] amallarini bir
     vaqtda bajarish, bu yerda & bitwise AND amali.

Ikkala massivlar ham o'zgarishdan to'xtaganida protsess ham to'xtaydi.

Protsess boshlanishidan oldin siz quyidagi almashtirtishni istalgancha bajara olasiz:

       Ixtiyoriy i tanlang va x[i] va y[i] qiymatlarini almashtirib qo'ying.

x va y massivlarning go'zalligi deb u massivlar aro xohlagancha almashtirishlar qilgandan so'ng
protsess bajarilishiga ketadigan minimal vaqtga aytiladi.

Sizga  uzunliklari n  bo'lgan  a[0],a[1],… ,a[n −1] va  b[0],b[1],… ,b[n −1]  binar  massivlar
berilgan.

Sizga ikki xil shakldagi so'rovlar beriladi:

      i,c,d – massivlarni o'zgartirish, a[i] := c va b[i] := d
      l,r – Agar m = r −l + 1, x = a[l … r] va y = b[l … r] bo'lsa, ularning go'zalligini topish.

E'tibor bering: Protsess faqatgina x va y massivlarga  ta'sir qiladi. Berilgan a va b massivlar
faqatgina update so'rovi orqali o'zgarishi mumkin. Umuman aytganda, query so'rovlari bir biriga
hech qanday ta'sir o'tqazmaydi.
## Implementation details
Siz quyidagi uchta protsedurani dasturlashingiz kerak:

   void init(int n, vector<int> a, vector<int> b)

      n: massivlar uzunligi.

                                                                                               stbz (1 of 4)
      a,b: uzunligi n bo'lgan massivlar.
     Bu protsedura hech narsa qaytarmaydi.
     Bu protsedura aynan bir marta, barcha so'rovlardan oldin chaqiriladi.

   int query(int l, int r)

       l,r: so'rovdagi oraliq.
     Bu protsedura m = r −l + 1, x = a[l … r] va y = b[l … r] bo'lsa x va y ning go'zalligini
      qaytarishi lozim.

   void update(int i, int c, int d)

        i: 0 va n −1 oralig'idagi indeks.
       a[i] := c va b[i] := d shaklidagi massivni o'zgartirish so'rovi.
     Bu protsedura hech narsa qaytarmaydi.

query va update protseduralari jami q marta chaqiriladi.

Example

Quyidagi chaqiruvni ko'raylik:

   init(6, [1, 0, 1, 1, 1, 1], [0, 0, 1, 1, 1, 1])

Demak, n = 5, a = [1,0,1,1,1,1] va b = [0,0,1,1,1,1].

Birinchi so'rov quyidagicha bo'lsin:

   query(0, 5)

Ya'ni, x = a va y = b massiv juftligining go'zalligi. 0- va 2-indexda alishtiruv qilsak nima bo'lishiga
qaraylik: x = [0,0,1,1,1,1],y = [1,0,1,1,1,1]. Endi protsess bajarilsa, massivlar bu ko'rinishda
o'zgaradi:

      1-daqiqa: x = [0,0,1,1,1,0],y = [0,0,1,1,1,1]
      2-daqida: x = [0,0,1,1,0,0],y = [0,0,1,1,1,0]
      3-daqida: x = [0,0,1,0,0,0],y = [0,0,1,1,0,0]
      4-daqida: x = [0,0,0,0,0,0],y = [0,0,1,0,0,0]
      5-daqida: x = [0,0,0,0,0,0],y = [0,0,0,0,0,0]
      6-daqida: x = [0,0,0,0,0,0],y = [0,0,0,0,0,0]

5-daqidada oxirgi o'zgarish bo'lgan, shuning uchun protsessga 5-daqiqa ketdi dteymiz. Protsessga
ketadigan vaqtni boshqa alishtiruvlar bilan bundan kamroq vaqt ketadigan qilishning iloji yo'qligini

                                                                                               stbz (2 of 4)
isbotlash mumkin. Shuning uchun, so'rovga javob - 5.

Ikkinchi so'rov:

   update(4, 0, 0)

a va b massivlarni o'zgartirish so'rovi. Bu so'rovdan so'ng: a = [1,0,1,1,0,1],b = [0,0,1,1,0,1]

Uchinchi so'rov:

   query(0, 4)

So'ralayotgan oraliq x = [1,0,1,1,0] va y = [0,0,1,1,0]. Bu safar hech qanday alishtirish qilmasak
nima bo'lishiga qaraylik:

      1-daqida: x = [0,0,1,0,0,0],y = [0,0,1,0,0,1]
      2-daqida: x = [0,0,0,0,0,0],y = [0,0,0,0,0,0]
      3-daqida: x = [0,0,0,0,0,0],y = [0,0,0,0,0,0]

2-daqidada oxirgi o'zgarish bo'ldi. Har qanday alishtirish qilsak ham protsessni bundan qisqaroq
qilishning iloji yo'qligini isbotlash mumkin. Shuning uchun go'zallik 2 bo'ladi va so'rovga javobni 2
qaytarish kerak.
## Constraints
     2 ≤n,q ≤200 000
     0 ≤a[i],b[i] ≤1 (barcha 0 ≤i < n uchun)
     0 ≤c,d ≤1
     0 ≤l < r ≤n −1
     0 ≤i ≤n −1
## Subtasks
    1. (10 ball) n ≤15,q = 1
    2. (11 ball) n,q ≤500
    3. (11 ball) n,q ≤2000
    4. (30 ball) n,q ≤200 000 (hech qanday update so'rovlar yo'q)
    5. (38 ball) n,q ≤200 000
## Sample grader
Namunaviy grader ma'lumotlarni quyidagi tartibda o'qiydi:

      qator 1: n

                                                                                               stbz (3 of 4)
      qator 2: a[0] a[1] … a[n −1]
      qator 3: b[0] b[1] … b[n −1]
      qator 4: q
      qator 4 + i (0 ≤i < q): so'rov

so'rov formati quyidagidan biri:

     0 l r – query(l, r)
     1 i c d – update(i, c, d)

Har bir bajarilgan so'rov uchun, namunaviy grader javoblarni quyidagi tartibda chiqaradi:

      qator 1 + i: query() funksiyasi qaytargan soni.

                                                                                               stbz (4 of 4)
