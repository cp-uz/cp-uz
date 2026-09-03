> Ushbu shart EGOI 2026 rasmiy repository’sidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Har bir qavatda balkon (oynadan tashqariga chiqib turadigan joy) bor, u yerda rezidentlar quyoshda
toblanishadi va o’z o’simliklarini o’stirishadi. Rezidentlar u yerdan turib o’zlarining balkonidagi
o’simliklaridan tashqari bir qavat pastdagi balkondagi o’simliklarga ham qarab zavqlanishlari
mumkin. Barcha o’simliklar kuniga bir marta sug’orilishi kerak bo’lgani sababli, rezidentlar sug’orish
ishlarida bir-birlariga yordam berishga qaror qilishdi. Har bir rezident o’zidan bir qavat pastdagi
balkondagi o’simliklarni sug’orishda yordam berishi mumkin.
Har kuni ertalab (0-vaqtda), barcha rezidentlar binodan chiqib ketishadi. 𝑟-rezident uyga 𝑡𝑟 vaqtda
qaytadi. Agar 𝑟-rezident o’zidan bir qavat pastdagi rezidentdan qat’iy oldinroq uyga kelsa, ya’ni
𝑡𝑟 < 𝑡𝑟−1 bo’lsa, u holda 𝑟-rezident 𝑟 − 1-rezidentning o’rniga uning o’simliklarni sug’oradi. (Aks
holda, 𝑟 − 1-rezident o’z o’simliklarini o’zi sug’oradi). Har bir kun oxirida quyidagi hodisa turlaridan
aynan bittasi sodir bo’ladi:
! hodisasi Biror 𝑟-rezident keyingi kundan boshlab uyga qaytish vaqtini yangilaydi.
? hodisasi Biror 𝑟-rezident hozirgacha 𝑟 − 1-rezident uchun necha marta o’simliklarni
sug’organligini so’raydi.
E’tibor bering, 0-rezident boshqa hech kimning o’simliklarini sug’ormaydi va 𝑁 − 1-rezidentning
o’simliklari hech qachon boshqalar tomonidan sug’orilmaydi.
Sizning vazifangiz rezidentlarga ikkinchi turdagi barcha hodisalarga javob berishda yordam berishdir.

## Kiruvchi ma’lumotlar

Birinchi qatorda rezidentlar va kuzatiladigan kunlar sonini bildiruvchi ikkita butun 𝑁 va 𝐷 sonlari
beriladi.
Keyingi qatorda har bir rezidentning uyga qaytish vaqtlarining boshlang’ich qiymatlarini bildiruvchi
𝑁 ta 𝑡0, 𝑡1, …, 𝑡𝑁−1 butun sonlar kiritiladi.
So’ng 𝐷 ta qatorda hodisalar kiritiladi. Qatorlarning 𝑖-si 𝑖-kun oxiridagi hodisani tavsiflaydi.
Har bir hodisa quyidagi ikkita formatdan birida bo’ladi:
! r x 𝑟-rezident (0 ≤ 𝑟 ≤ 𝑁 − 1) keyingi kundan boshlab uyga 𝑥 vaqtda qaytishni boshlaydi, ya’ni
𝑡𝑟 qiymati 𝑥 ga o’zgaradi. E’tibor bering, 𝑥 ning joriy 𝑡𝑟 bilan bir xil bo’lishi ham mumkin.
? r 0-kun boshidan beri 𝑟-rezident (1 ≤ 𝑟 ≤ 𝑁 − 1) 𝑟 − 1-rezident o’simliklarini necha marta
sug’organligini so’raydi.
Kamida bitta ? hodisasi bo’lishi kafolatlanadi.

## Chiquvchi ma’lumotlar

Har bir ? hodisasi uchun alohida qatorda bitta yagona butun son chiqaring: 0-kun boshidan beri 𝑟-
rezident 𝑟 − 1-rezidentning o’simliklarini necha marta sug’organligi.
E’tibor bering, ushbu masalada siz rezident o’z o’simliklarini necha marta sug’organligini
hisoblashingiz kerak emas kerak.
Cheklovlar

- 2 ≤ 𝑁 ≤ 200 000.
- 1 ≤ 𝐷 ≤ 200 000.
- Dastlab va har bir o’zgarishdan keyin 1 ≤ 𝑡𝑟 ≤ 109.

## Baholash

Dasturingiz qism-masalalarga guruhlangan (subtask) bir nechta testlarda sinovdan o’tkaziladi. Biror
qism-masaladan ball olishingiz uchun, sizning dasturingiz undagi barcha testlarda to’g’ri ishlashi
kerak.

- Qism-masala 0 [ 0 ball]: Sample misollar.
- Qism-masala 1 [ 9 ball]: 𝐷 = 1, ya’ni roppa-rosa bitta hodisa bor va u ? turida.
- Qism-masala 2 [12 ball]: Barcha hodisalar ? turida.
- Qism-masala 3 [13 ball]: 𝑁 = 2.
- Qism-masala 4 [18 ball]: 𝑁 ≤ 2000 va 𝐷 ≤ 2000.
- Qism-masala 5 [21 ball]: Har bir rezident uyga qaytish vaqtini ko’pi bilan bir marta
o’zgartiradi.

- Qism-masala 6 [27 ball]: Qo’shimcha cheklovlar yo’q.
Misollar
stdin stdout
3 4
7 7 5
? 2
? 1
? 2
? 2
1
0
3
4
2 5
5 7
! 1 4
? 1
! 0 4
! 1 6
? 1
1
2
4 6
13 9 15 2
! 1 18
? 3
! 0 12
! 2 1
? 1
? 2
2
1
5
stdin stdout
3 6
5 2 4
? 1
! 1 8
! 0 10
! 1 3
? 1
? 2
1
4
2
Izoh
Figure  1: 1-misol. Sug’orish idishi rasmi, rezidentning o’zidan pastdagi rezidentning o’simliklarini
sug’orishini anglatadi.
Birinchi misol 2, 4, 5 va 6-qism-masalalar uchun mos tushadi. Jadvallar hech qachon yangilanmagani
uchun, 2-rezident 1-rezidentdan oldin uyga keladi va har kuni uning o’simliklarini sug’oradi. 0-
kundan so’ng, 2-rezident qo’shnisining o’simliklarini bir marta sug’organ. 0 va 1-rezidentlar uyga bir
xil vaqtda kelgani sababli, 1-rezident 0-rezidentning o’simliklarini sug’ormaydi. 1-kundan so’ng, 1-
rezident qo’shnisining o’simliklarini sug’ormagan. 2-kundan so’ng, 2-rezident o’simliklarni uch marta
sug’organ. 3-kundan so’ng, 2-rezident o’simliklarni to’rt marta sug’organ.
Figure  2: 2-misol.
Ikkinchi misol 3, 4 va 6-qism-masalalar uchun o’rinli. 0-kuni, 1-rezident qo’shnisining o’simliklarini
sug’ormaydi. 0-kundan so’ng, 1-rezidentning qaytish jadvali yangilanadi. U uyga 1-kuni qo’shnisidan
oldin kelgani sababli, uning o’simliklarini sug’oradi. 1-kundan so’ng, 1-rezident qo’shnisining
o’simliklarini bir marta sug’organ. 2-kuni, 1-rezident yana qo’shnisining o’simliklarini sug’oradi. 4-
kundan so’ng, 1-rezident jami ikki marta qo’shnisining o’simliklarini sug’organ.
Uchinchi misol 4, 5 va 6-qism-masalalarga mos keladi. E’tibor bering, bu misol uchun rasm
kiritilmagan.
Figure  3: 4-misol.
To’rtinchi misol 4 va 6-qism-masalalar uchun o’rinli. 0-kundan so’ng, 1-rezident qo’shnisining
o’simliklarini bir marta sug’organ. 4-kundan so’ng, 1-rezident qo’shnisining o’simliklarini to’rt marta
sug’organ (0, 1, 3 va 4-kunlari). 2-rezident qo’shnisining o’simliklarini jami ikki marta sug’organ ( 2
va 3-kunlari).
