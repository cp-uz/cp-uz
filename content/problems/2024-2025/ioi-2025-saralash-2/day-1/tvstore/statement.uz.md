> Ushbu shart IOI 2025 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Televizor do‘koni

Televizor do'koni (tvstore)

Dadorlandtiria prezidenti Asadulloning kattagina televizor do'koni bor. Do'konda n ta turdagi
televizor bor, ular 0 dan n −1 gacha raqamlangan. i-turdagi televizorning ekran o'lchamlari
w[i] × h[i] piksel, narxi esa c[i] dador dollari. Do'konda har bir turdagi televizordan cheksiz ko'p
miqdorda bor.

Asadulloning oldiga q ta mijoz tashrif buyuradi, raqamlari 0 dan q −1 gacha. Bunda j-raqamli
mijoz tomonlari nisbati x[j] : y[j] bo'lgan film tomosha qilmoqchi, hamyonida esa b[j] dador
dollar puli bor.

Qaysidir film televizorga qo'yilganda, film o'zining tomonlari nisbatini saqlagan holda ekran
o'lchamlariga moslashadi, bunda ekranning ortib qolgan piksellari qora rang bilan to'ldiriladi.
Albatta, ishlatiladigan piksellar soni butun son bo'lishi kerak.

Masalan, televizorning ekran o'lchamlari 1920 × 1080 piksel bo'lsa, hamda filmning tomonlari
nisbati  20 : 9   bo'lsa,  u  holda  ekranning  1920 × 864  qismidan   foydalaniladi,  chunki
1920 : 864 = 20 : 9. Boshqa bir misolda, agar film tomonlari nisbati 37 : 17 kabi g'alati ifoda bo'lsa,
u holda ekranning 1887 × 867 qismidan foydalanish mumkin bo'ladi.

Har bir mijoz o'zining filmini eng yuqori sifatda tomosha qilishni istaydi. Har bir mijoz uchun,
to'lashga puli yetadigan, hamda foydalaniladigan piksellar soni maksimal bo'lgan televizorni
topishga yordam bering. Agar ular o'zlari uchun mos keladigan televizor topa olmasa, javob
sifatida −1  qaytaring.  Agar  bir-nechta  televizor  maksimal  sifatga  erishsa,  ixtiyoriysini
qaytarishingiz mumkin.

E'tibor bering, televizorlarni aylantirish mumkin emas.
## Implementation details
Siz quyidagi protsedurani dasturlashingiz kerak:

  vector<int> best_tv(int n, vector<int> w, vector<int> h, vector<int> c,
                       int q, vector<int> x, vector<int> y, vector<int> b)

      n: jami televizorlar soni.
     w, h, c: uzunligi n ga teng bo'lgan massivlar – televizorlar haqida ma'lumot.
       q: jami mijozlar soni.

                                                                                                   tvstore (1 of 3)
      x, y, b: uzunligi q ga teng bo'lgan massivlar – mijozlar haqida ma'lumot.
     Bu protsedura uzunligi q bo'lgan massiv qaytarishi kerak, bunda j-element j-mijoz uchun
     eng yaxshi televizorning indeksi.
     Bu protsedura aynan bir marta chaqiriladi.

Example

Quyidagi chaqiruvni ko'raylik:

  best_tv(2,
           [1920, 3840],
           [1080, 2400],
          [ 350,  800],
           6,
          [ 20,  37,  16, 1600, 4000,  20],
          [  9,  17,  10, 1000, 4001,   9],
           [500, 350, 900,  900, 1000, 100])

Bu misolda ikki xil televizor turi bor: 0-turdagi televizorning ekran o'lchamlari 1920 × 1080 piksel,
narxi esa 350 dador dollari. 1-turdagi televizorning ekran o'lchamlari 3840 × 2400 piksel, narxi esa
800 dador dollari.

0-mijozda 500 dador dollari pul bor va u o'ziga 0-turdagi televizor sotib olib o'zining 20 : 9 filmini
tomosha qiladi.

1-mijozda 350 dador dollari pul bor u ham o'ziga 0-turdagi televizor sotib oladi.

2-mijoz o'ziga 1-turdagi televizor sotib oladi.

3-mijoz ham o'ziga 1-turdagi televizor sotib oladi. E'tibor bering, 2 va 3-raqamli mijozlarda bir xil
miqdorda pul bor, va  ikkalasi ham  bir  xil nisbatdagi filmni tomosha qilishmoqchi, chunki
16 : 10 = 1600 : 1000.

4-mijozda 1000 dador dollari pul bor, lekin afsuski hech qaysi televizor 4000 : 4001 nisbatli filmni
ko'rsata olmaydi.

5-mijozda 100 dador dollari pul bor, va u hech qaysi televizorni sotib olishga yetmaydi.

Shunday qilib, protsedura javob sifatida [0,0,1,1,−1,−1] qaytarishi kerak.
## Constraints
     1 ≤n ≤100 000
     1 ≤q ≤100 000
     1 ≤w[i],h[i],c[i] ≤106 (barcha 0 ≤i < n uchun)

                                                                                                   tvstore (2 of 3)
     1 ≤x[j],y[j],b[j] ≤106 (barcha 0 ≤j < q uchun)
## Subtasks
    1. (14 ball) n,q ≤1000
    2. (15 ball) w[i],h[i],x[j],y[j] ≤30 barcha i va j uchun
    3. (25 ball) w[i] = h[i] barcha i uchun
    4. (25 ball) c[i] = b[j] = 1 barcha i va j uchun
    5. (21 ball) Qo'shimcha cheklovlarsiz.
## Sample grader
Namunaviy grader ma'lumotlarni quyidagi tartibda o'qiydi:

      qator 1: n
      qator 2 + i (0 ≤i < n): w[i] h[i] c[i]
      qator 2 + n: q
      qator 3 + n + j (0 ≤j < q): x[j] y[j] b[j]

Aytaylik, best_tv() protsedurasi javob sifatida r massivni qaytarsin. Namunaviy grader javoblarni
quyidagi tartibda chiqaradi:

      qator 1 + j (0 ≤j < q): r[j]

                                                                                                   tvstore (3 of 3)
