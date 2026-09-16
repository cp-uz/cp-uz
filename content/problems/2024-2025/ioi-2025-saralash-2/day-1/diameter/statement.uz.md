> Ushbu shart IOI 2025 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Diametr

Dadorlandtiria mamlakatida n ta shahar bor, ular 0 dan n −1 gacha raqamlangan. Shuningdek,
mamlakatda aynan n ta to'g'ridan-to'g'ri yo'l barcha shaharlarni bog'lab turadi. Xususan, barcha
0 ≤i ≤n −1 uchun u[i] va v[i]-raqamli shaharlar to'g'ridan-to'g'ri yo'l bilan bog'langan.

Buni qarangki, Dadorlandtiria mamlakatidagi barcha yo'llar ta'mirga muhtoj. Mamlakat rahbari har
bir yo'lni ta'mirlash aholi uchun qanchalik noqulaylik tug'dirishini bilmoqchi.

Xususan, har kuni mamlakatda qaysidir yo'l ta'mirlash ishlari uchun yopib qo'yiladi. Noqulaylik
darajasi deb, orasidagi sayohat vaqti eng uzoq bo'lgan shaharlar juftligiga aytiladi. E'tibor bering,
qaysidir ikki shahar orasida sayohat qilish ilojsiz bo'lib qolishi ham mumkin.

Har bir yo'l uchun, uni yopilishi natijasida mamlakatdagi eng uzoq sayohat vaqtini toping. Agar
qaysidir shaharlar orasida sayohat qilish ilojsiz bo'lib qolsa, javob sifatida −1 qaytaring.
## Implementation details
Siz quyidagi protsedurani dasturlashingiz kerak:

  vector<int> find_diameters(int n, vector<int> u, vector<int> v)

      n: jami shaharlar va yo'llar soni.
      u, v: uzunligi n ga teng bo'lgan massivlar – yo'llar haqida ma'lumot.
     Bu protsedura uzunligi n bo'lgan massiv qaytarishi kerak, bunda i-element i-yo'l yopilishi
      natijasida hosil bo'ladigan eng uzoq sayohat vaqti, yoki −1.
     Bu protsedura aynan bir marta chaqiriladi.

Example

Quyidagi chaqiruvni ko'raylik:

   find_diameters(4, [1, 1, 0, 3], [0, 2, 3, 1])

Dastlab, Dadorlandtiria mamlakati quyidagi ko'rinishda:

                                                                                     diameter (1 of 3)
0-yo'lni ta'mirlash paytida, mamlakat quyidagi ko'rinishga keladi, bunda eng uzoq sayohat vaqti 3
ga teng: 0 →3 →1 →2.

1-yo'lni ta'mirlash paytida, mamlakat quyidagi ko'rinishga keladi, bunda 0 va 2 shaharlar orasida
sayohat qilishni iloji qolmaydi.

2-yo'lni ta'mirlash paytida, mamlakat quyidagi ko'rinishga keladi, bunda eng uzoq sayohat vaqti 2
ga teng: 3 →1 →2.

                                                                                     diameter (2 of 3)
3-yo'lni ta'mirlash paytida, mamlakat quyidagi ko'rinishga keladi, bunda eng uzoq sayohat vaqti 3
ga teng: 3 →0 →1 →2.

Shunday qilib, find_diameters() protsedurasi javob sifatida [3,−1,2,3] massivini qaytarishi
kerak.
## Constraints
     3 ≤n ≤200 000
     0 ≤u[i],v[i] ≤n −1 va u[i] ≠v[i] (barcha 0 ≤i < n uchun)
     Hech qaysi (u[i],v[i]) juftligi ikki marta uchramaydi.
      Dastlab, mamlakat bog'langan, ya'ni ixtiyoriy shaharlar juftligi uchun ular orasida sayohat
       qilish mumkin.
## Subtasks
    1. (3 ball) u[i] = i va v[i] = (i + 1) mod n barcha 0 ≤i < n uchun
    2. (9 ball) n ≤100
    3. (21 ball) n ≤2000
    4. (9 ball) k ≤2000. Bu yerda k ‐ javob −1 bo'lmaydigan yo'llar soni.
    5. (58 ball) Qo'shimcha cheklovlarsiz.
## Sample grader
Namunaviy grader ma'lumotlarni quyidagi tartibda o'qiydi:

      qator 1: n
      qator 2 + i (0 ≤i < n): u[i] v[i]

Aytaylik, find_diameters() protsedurasi javob sifatida r massivni qaytarsin. Namunaviy grader
javoblarni quyidagi tartibda chiqaradi:

      qator 1: r[0] r[1] … r[n −1]

                                                                                     diameter (3 of 3)
