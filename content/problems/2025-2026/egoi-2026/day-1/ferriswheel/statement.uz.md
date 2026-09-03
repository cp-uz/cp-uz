> Ushbu shart EGOI 2026 rasmiy repository’sidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Cesenatico’ning asosiy maydonida shaharning diqqatga sazovor joylaridan biri bo’lgan rang-barang
charxpalak joylashgan. Qish paytida charxpalak qismlarga ajratilib, omborda saqlangan edi, lekin
endi yoz yaqinlashayotgani sababli uni yana qurish vaqti keldi! Hozir barcha qismlar maydonga yetib
keldi va sizning yordamingiz bilan biz ularni birga yig’amiz.
Oldingizda charxpalakni hosil qilish uchun aylanasi bo’ylab bir-biriga ulanishi kerak bo’lgan 𝑁 ta
alohida kabinalar bor. Kabinalar 0 dan 𝑁 − 1 gacha raqamlangan, lekin bu raqamlash ulash ketma-
ketligiga mos kelmasligi ham mumkin.
Har bir kabinada uni soat mili yo’nalishidagi keyingi kabina bilan ulash uchun ishlatiladigan maxsus
ulagich mavjud. Har bir ulagich quyidagi ikki turdan birida bo’lishi mumkin:

- [+] turi: faqat kattaroq raqamli kabinaga ulash uchun ishlatiladi;
- [-] turi: faqat kichikroq raqamli kabinaga ulash uchun ishlatiladi.
Quyidagi misolda, 2-kabinaning ulagich turi [+]. Bu soat mili yo’nalishi bo’yicha keyingi kabina 3
yoki 4 bo’lishi kerak.
0 + 1 - 2 + 3 - 4 -
Figure  1: 𝑁 = 5 ta alohida kabina, har birining ulagich turi [+] yoki [-].
Sizga kabinalar soni va ularning ulagich turlari berilgan. Sizning vazifangiz barcha 𝑁 ta kabinalardan
charxpalak yig’ish mumkin yoki yo’qligini aniqlashdir. Agar iloji bo’lsa, kabinalarni charxpalakda
qanday tartibda joylashishi mumkinligini ham topishingiz kerak.
0
3
2
4
1
`+`
`-`
`+`
`- -`
Figure  2: Figure 1 dagi kabinalardan tuzilgan charxpalakka misol.
Yuqoridagi rasmda keltirilgan beshta kabinadan yig’ish mumkin bo’lgan to’g’ri charxpalakka misol
ko’rsatilgan.
Rasmiy qilib aytganda, kabinalarning to’g’ri tartibi bu quyidagi xususiyatlarga ega bo’lgan
𝐶0, 𝐶1, …, 𝐶𝑁−1 sonlar ketma-ketligidir.

- Ketma-ketlikda 0 dan 𝑁 − 1 gacha bo’lgan har bir son aynan bir marta uchraydi.
- Har bir 0 ≤ 𝑖 ≤ 𝑁 − 2 uchun, 𝐶𝑖+1 kabina 𝐶𝑖 kabinaning ulagich turi tomonidan qo’yilgan
shartni qanoatlantirishi kerak. Ya’ni, agar 𝐶𝑖 kabinaning ulagich turi [ +] bo’lsa, u holda
𝐶𝑖+1 > 𝐶𝑖 bo’lishi kerak; agar u [-] bo’lsa, u holda 𝐶𝑖+1 < 𝐶𝑖 bo’ladi.

- Bundan tashqari, 𝐶0 kabina 𝐶𝑁−1 kabinaning ulagichi tomonidan qo’yilgan shartni
qanoatlantirishi kerak.

## Kiruvchi ma’lumotlar

Kiruvchi ma’lumotlar ikki qatordan iborat. Birinchi qatorda kabinalar sonini ifodalovchi bitta 𝑁
butun soni beriladi.
Ikkinchi qatorda ‘+’ va ‘-’ belgilardan iborat uzunligi 𝑁 bo’lgan 𝑆 satri beriladi. Agar 𝑆𝑖 = ‘+’ bo’lsa,
demak, 𝑖-kabinaning ulagichi [+] turiga ega. Agar 𝑆𝑖 = ‘-’ bo’lsa, demak, 𝑖-kabinaning ulagichi [-]
turiga ega.

## Chiquvchi ma’lumotlar

Agar shartlarni qanoatlantiradigan bironta ham ketma-ketlik mavjud bo’lmasa, NO yozuvini chiqaring.
Aks holda, YES va keyingi qatorda 𝑁 ta butun son — yaroqli charxpalakdagi kabinalarni ixtiyoriy
kabinadan boshlab, soat mili yo’nalishida chiqaring. Agar javoblar bir nechta bo’lsa, istalganini
chiqarishingiz mumkin.

## Chegaralar

- 3 ≤ 𝑁 ≤ 300000.
- 𝑆𝑖 = ‘+’ yoki ‘-’.

## Baholash

Dasturingiz subtasklarga bo’lingan bir nechta testlarda sinovdan o’tkaziladi. Subtaskda ball olish
uchun dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.

- Qism-masala 0 [ 0 ball]: Sample testlar.
- Qism-masala 1 [16 ball]: 𝑁 = 3.
- Qism-masala 2 [13 ball]: Satrda aynan bitta ‘+’ bor.
- Qism-masala 3 [24 ball]: 𝑆 satrida ‘+’ va ‘-’ belgilari navbatma-navbat keladi; ya’ni, har
bir 0 ≤ 𝑖 ≤ 𝑁 − 2 uchun 𝑆𝑖 ≠ 𝑆𝑖+1 sharti bajariladi.

- Qism-masala 4 [23 ball]: 𝑁 ≤ 1000.
- Qism-masala 5 [24 ball]: Qo’shimcha chegaralarsiz.
Misollar
stdin stdout
3
`+++`
NO
5
`+-+--`
YES
0 3 2 4 1
7
`------+`
NO
8
`+-+-+-+-`
YES
3 2 4 6 7 1 0 5
11
`+++--+-++--`
YES
10 0 5 8 9 4 2 6 3 1 7

## Tushuntirish

Birinchi misol. Bizga uchta kabina berilgan. Barcha ulagichlar [ +] turida bo’lgani uchun biz
kabinalarni shunday joylashtirishimiz kerakki, har bir kabinadan keyin kattaroq raqamli kabina kelsin.
Ko’rsatish mumkinki, uchta kabinaning hech qanday tartibi bu shartni qanoatlantirmaydi, shuning
uchun javob NO.
Ikkinchi misol. Muammo shartidagi rasmga qarang. Bizga beshta kabina berilgan. Ularni soat mili
yo’nalishida shunday joylashtirishimiz kerakki:

- 0 va 2-kabinalardan (ulagichi [+]) keyin darhol kattaroq raqamli kabina kelishi kerak;
- 1, 3 va 4-kabinalardan (ulagichi [-]) keyin darhol kichikroq raqamli kabina kelishi kerak.
Barcha bu shartlarni qanoatlantiradigan charxpalak quyidagi rasmda ko’rsatilgan. [ +] turidagi
ulagichlar uchun talablar bajariladi, chunki 0 < 3 va 2 < 4. [-] turidagi ulagichlar uchun talablar
bajariladi, chunki 1 > 0, 3 > 2 va 4 > 1. Ushbu charxpalakka mos keladigan bir nechta javoblar
mavjud: 0 3 2 4 1 o’rniga siz 3 2 4 1 0, 2 4 1 0 3, 4 1 0 3 2, yoki 1 0 3 2 4 ni ham
chiqarishingiz mumkin.
0
3
2
4
1
`+`
`-`
`+`
`- -`
Figure  3: Uchinchi sampledagi charxpalak.
Uchinchi misol. Bizga yettita kabina berilgan: oxirgisidan tashqari barcha ulagichlar [-] turiga ega,
oxirgisi esa [+] turiga ega. Biz kabinalarni shunday joylashtirishimiz kerakki, 6-kabinadan tashqari
har bir kabinadan keyin kichikroq raqamli kabina kelsin, 6-kabinadan keyin esa kattaroq raqamli
kabina kelsin. Ko’rsatish mumkinki, bunday tartib mavjud emas, shuning uchun javob NO.
To’rtinchi va beshinchi misol. Quyidagi rasmlarda so’nggi ikkita misoldagi chiquvchi
ma’lumotlarga mos keladigan charxpalaklar ko’rsatilgan.
3
2
4
6
7
1
0
5
`-`
`+`
`+`
`+`
`-`
`-`
`+`
`-`
Figure  4: To’rtinchi sampledagi charxpalak.
10
0
58
9
4
2
6
3 1
7
`-`
`+`
`++`
`-`
`-`
`+`
`-`
`-`
`+`
`+`
Figure  5: Beshinchi sampledagi charxpalak.
