> Ushbu shart IOI 2025 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Yana daraxtlar

Yangi yil arafasida Komiljon tog'ga chiqib ajoyib yangi yil daraxtini topdi. Daraxtning go'zalligini ko'rgan
Xurshid quyidagi masalani o'ylab topdi.

Sizga n ta tugunli ildizli daraxt berilgan. Daraxtning tugunlari 0 dan n −1 gacha raqamlangan, daraxt ildizi
esa r-raqamli tugun. Barcha i ≠r uchun i-tugunning otasi p[i]-raqamli tugun.

Ixtiyoriy a va b tugunlar uchun, lca(a,b) deb, shu tugunlarning eng kichkina umumiy otasiga aytiladi.
Xususan, ixtiyoriy x uchun lca(x,x) = x.

f(a,b) ni quyidagicha ifodalaylik:

                                  f(a,b) = a ⋅n 2 + lca(a,b) ⋅n + b

Shuningdek, barcha (a,b) juftliklar uchun f(a,b) ning qiymatini avvaliga bo'sh bo'lgan s massivga qo'shib
chiqaylik va kamaymaslik tartibida saralab olaylik. Bunda a = b holatlar ham hisobga olinadi, ya'ni s
massivda aynan n 2 ta element bor.

Sizga q ta so'rovda k sonlari beriladi. Har bir so'rov uchun: saralangan s massivining k-elementini toping
(indekslar 0 dan boshlanadi).
## Implementation details
Siz quyidagi protsedurani dasturlashingiz kerak:

   vector<long long> answer(int n, int r, vector<int> p, int q, vector<long long> k);

      n: daraxtdagi tugunlar soni.
       r: daraxtning ildizi.
       p: uzunligi n bo'lgan massiv – daraxt haqida ma'lumot. p[r] = −1.
       q: jami so'rovlar soni.
       k: uzunligi q bo'lgan massiv – so'rovlar haqida ma'lumot.
     Bu protsedura uzunligi q bo'lgan massiv qaytarishi kerak, bunda j-element j-so'rov uchun javob.
     Bu protsedura aynan bir marta chaqiriladi.

Example

Example 1

Quyidagi chaqiruvni ko'raylik:

  answer(5, 0, [-1, 0, 0, 2, 2], 3, [11, 17, 3])

                                                                                                     tree (1 of 3)
Daraxt quyidagi ko'rinishda:

Saralagandan            so'ng,           s           quyidagi            ko'rinishga             keladi:
s = [0,1,2,3,4,25,27,28,29,31,50,51,62,63,64,75,76,87,89,93,100,101,112,113,124].

q = 3 ta so'rovlar quyidagicha:

      k[0] = 11, s[11] = 51. Bu javob quyidagi ko'rinishda olinadi: f(2,1) = 2 ⋅52 + 0 ⋅5 + 1 = 51
      k[1] = 17, s[17] = 87. Bu javob quyidagi ko'rinishda olinadi: f(3,2) = 3 ⋅52 + 2 ⋅5 + 2 = 87
      k[2] = 3, s[3] = 3. Bu javob quyidagi ko'rinishda olinadi: f(0,4) = 0 ⋅52 + 0 ⋅5 + 4 = 4

Protsedura javob sifatida [51,87,4] massivini qaytarishi kerak.

Example 2

Quyidagi chaqiruvni ko'raylik:

  answer(7, 2, [2, 0, -1, 1, 1, 3, 5], 7, [30, 2, 46, 38, 15, 31, 30])

Daraxt quyidagi ko'rinishda:

                                                                                                     tree (2 of 3)
Protsedura javob sifatida [206,3,318,261,113,208,206] massivini qaytarishi kerak.
## Constraints
     2 ≤n ≤106
     0 ≤r ≤n −1
     0 ≤p[i] ≤n −1 (barcha 0 ≤i < n va i ≠r uchun)
       p[r] = −1
     1 ≤q ≤106
     0 ≤k[j] ≤n 2 −1 (barcha 0 ≤j ≤q −1 uchun)
## Subtasks
d deb daraxtning chuqurligini, ya'ni ildizdan istalgan tugungacha maksimal masofani aytaylik.

Qaysidir v tugunning darajasi bu v ga bog'langan boshqa tugunlar soni bo'lsin. e deb barcha tugunlar
orasidagi maksimal darajaga aytiladi.

    1. (7 ball) n,q ≤300
    2. (13 ball) n,q ≤2000
    3. (13 ball) n,q ≤105 , d ≤20
    4. (17 ball) d ≤20
    5. (15 ball) e ≤2
    6. (13 ball) n,q ≤105
    7. (22 ball) Qo'shimcha cheklovlarsiz.
## Sample grader
Namunaviy grader ma'lumotlarni quyidagi tartibda o'qiydi:

      qator 1: n r
      qator 2: p[0] p[1] … p[n −1]
      qator 3: q
      qator 3 + j (0 ≤j < q): k[j]

Aytaylik, answer() protsedurasi javob sifatida t massivni qaytarsin. Namunaviy grader javoblarni quyidagi
tartibda chiqaradi:

      qator 1 + j (0 ≤j < q): t[j]

                                                                                                     tree (3 of 3)
