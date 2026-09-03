> Ushbu shart EGOI 2026 rasmiy repository’sidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Siz Italiyaning eng zo’r 𝑁 nafar pizza pishiruvchilari (qisqacha pitsapaz) kim eng yaxshi pitsa qilishini
aniqlash uchun musobaqalashgan “Excellent Glutenous Ovenmasters of Italy” tadbirida muxbirsiz.
Har bir pitsapaz bitta pitsa pishirdi va keyin pitsalar hakamlar hay’ati tomonidan baholanadi. Har
bir pitsa 0 (eng yaxshi) dan 𝑁 − 1 (eng yomon) gacha bo’lgan, bir biridan farq qiluvchi o’rinlarni
egalladi. Shundan so’ng har bir pitsapaz o’z pitsasi olgan o’rindek o’rin oladi.
Musobaqadan so’ng (pitsalar baholangandan so’ng), pitsa bazmida pitsalarni tatib ko’rish vaqti
keladi. Tadbirda barcha pitsapazlar ishtirok etadi va har bir ishtirokchi o’z pitsasini bazmga olib
keladi.
Pitsapazlar birin-ketin qandaydir tartibda kelishadi (egallagan o’rinlari bo’yicha kelishi shart emas).
Bazmda 0 dan 𝑀 − 1 gacha raqamlangan 𝑀 ≤ 𝑁 ta stol bor. Birinchi kelgan 𝑀 ta pitsapaz kelishlari
tartibiga ko’ra, 0 dan 𝑀 − 1 gacha bo’lgan stollarga qo’yishadi. Qolgan 𝑁 − 𝑀 ta pitsapazning har
biri o’zinikidan yaxshiroq, lekin o’zidan ko’p ham xafa bo’lib ketmasligi uchun, unchalik ham zo’r
bo’lmagan pitsani yeyishni xohlaydi. Ya’ni har safar yangi pitsapaz kelganda, ular stollardagi o’z
pitsasidan yaxshiroq, lekin mavjudlari ichida eng yomon pitsani tanlashadi. Ular tanlangan pitsasini
yeyish uchun o’sha stolga o’tirishadi. Stolda turgan pitsani to’liq yeb bo’lgach, ular keyinroq boshqa
pitsapaz yeyishi uchun o’zining pitsasini o’sha stolda qoldirib ketishadi. Agar kelgan pitsapaz uchun
mos pitsa topilmasa (barcha stollardagi pitsalar o’zinikidan yomonroq bo’lsa), pitsapaz xafa bo’lib
ketadi va o’z pitsasini o’zi bilan olib ketadi.
Quyidagi misolda 𝑀 = 2 ta stoli bor hamda bazmga o’rinlari 1, 0, 3, 5, 4, 2 bo’lgan ketma-ketligida
kelayotgan pitsapazlar ko’rsatilgan. Bu bazm birinchi sample misolga mos tushadi.
1 - o’rinli pitsapaz
keladi
`-`
stol 0
`-`
stol 1
1
0 - o’rinli pitsapaz
keladi
1
stol 0
`-`
stol 1
0
Figure  1: Birinchi kelgan 𝑀 = 2 ta pitsapaz pitsalarini kelish tartibida bo’sh stollarga (0, 1) qo’yadi.
3 - o’rinli pitsapaz
keladi
1
stol 0
0
stol 1
3
5 - o’rinli pitsapaz
keladi
3
stol 0
0
stol 1
5
4 - o’rinli pitsapaz
keladi
5
stol 0
0
stol 1
4
2 - o’rinli pitsapaz
keladi
5
stol 0
4
stol 1
2
Figure  2: Barcha stollar band bo’lgandan so’ng, har bir kelgan pitsapaz o’zinikidan yaxshiroq bo’lgan
eng yomon pitsa (strelka orqali ko’rsatilgan) joylashgan stolga boradi, o’sha pitsani yeydi va o’zinikini
qoldiradi. Agar yaxshiroq pitsa bo’lmasa, pitsapaz xafa bo’lib ketib qoladi (strelka yo’q).
Siz yozayotgan maqolada sen pitsapazlarning bazmga qanday tartibda kelganligi haqida yozmoqchisiz.
Afsuski, shirin pitsalarga chalg’ib ketib, pitsapazlarning kelish tartibini yozib qo’yishni esdan
chiqaribsiz. Yaxshiyamki, har bir stolda shu stolga qo’yilgan pitsalarning patnislari pitsalar tortilish
tartibida qo’yilganiligini ko’rishingiz mumkin.
1
3
5
stol 0
0
4
stol 1
← birinchi kelgan
← hozirgi
Figure  3: Birinchi misolga mos keladigan patnislar to’plami. Har bir to’plam shu stolda bo’lgan
pitsapazlarni kelish tartibida, pastdan (birinchi) tepaga (eng oxirgi) qarab sanab o’tadi. Ajratib
ko’rsatilgan patnisda bazm oxirida shu yerda qoldirilgan pitsa bor.
Sen bu ma’lumotlardan pitsapazlarning kelish tartibini tiklash uchun foydalanmoqchisiz. Bunga
mos tushuvchi bir nechta tartiblar bo’lishi mumkinligini bilasiz, shunga to’liq ball olish uchun siz
leksikografik jihatdan eng kichik to’g’ri keladigan tartibni topishing kerak.1

## Kiruvchi ma’lumotlar

Birinchi qatorda ikkita butun son 𝑁 va 𝑀 — pitsapazlar soni va bazmdagi stollar soni kiritiladi.
Keyin 𝑀 ta qator keladi, ularning har biri stoldagi patnislar to’plamini tasvirlaydi. 𝑖-qator 𝑖-stoldagi
patnislar soni 𝑇𝑖 - butun son bilan boshlanadi, undan keyin 𝑖-stolda bo’lgan 𝑗-pitsaning o’rnini
anglatuvchi 𝑇𝑖 ta 𝑏𝑖,𝑗 butun sonlari keladi.

## Chiquvchi ma’lumotlar

Agar shartlarni qanoatlantiruvchi hech qanday tartib bo’lmasa, NO deb chiqaring. Agar mumkin
bo’lgan tartib mavjud bo’lsa, YES deb chiqaring. Bu holda, ikkinchi qatorda pitsapazlarning kelish
tartibini anglatuvchi 𝑁 ta 𝑎0, 𝑎1, …, 𝑎𝑁−1 butun sonlarni chiqaring. Agar bunday tartiblar bir nechta
bo’lsa, ularning orasidan leksikografik eng kichigini chiqarishingiz kerak. E’tibor bering, qisman to’g’ri
javoblar ham “Baholash” qismida tushuntirilganidek ma’lum bir ballar bilan baholanishi mumkin.

## Chegaralar

- 1 ≤ 𝑀 ≤ 𝑁 ≤ 300000.
- 0 ≤ 𝑏𝑖,𝑗 ≤ 𝑁 − 1.
- Barcha 𝑏𝑖,𝑗 lar har xil.
- 1 ≤ 𝑇𝑖 ≤ 𝑁.
1𝑎0, 𝑎1,… , 𝑎𝑛−1 ketma-ketlik 𝑏0, 𝑏1,…,𝑏𝑛−1 ketma-ketlikdan leksikografik kichik hisoblanadi, qachonki qandaydir
0 ≤ 𝑡 < 𝑛 indeks uchun, barcha 𝑖 < 𝑡 uchun 𝑎𝑖 = 𝑏𝑖 va 𝑎𝑡 < 𝑏𝑡 bo’lsa.

## Baholash

Dasturingiz subtasklarga bo’lingan bir nechta testlarda sinovdan o’tkaziladi. Subtaskda ball olish
uchun dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.
⇨
Faqatgina birinchi qatori to’g’ri bo’lgan (YES yoki NO) yechimlar 20% ball oladi. Birinchi
qatori to’g’ri bo’lgan (YES yoki NO) va agar javob YES bo’lsa leksikografik eng kichigi bo’lishi
shart bo’lmagan har qanday to’g’ri tartibni chiqargan yechimlar qo’shimcha 20% ball
oladi. Qolgan 60% ballni olish uchun birinchi qator YES bo’lganda leksikografik eng kichik
to’g’ri tartibni chiqarishing kerak.

- Qism-masala 0 [ 0 ball]: Sample testlar.
- Qism-masala 1 [20 ball]: 𝑀 = 1.
- Qism-masala 2 [10 ball]: 𝑀 = 2, 𝑁 ≤ 200 va barcha 𝑇𝑖 lar yig’indisi 𝑁 ga teng (boshqacha
qilib aytganda, hech qaysi pitsapaz xafa bo’lib ketib qolmaydi).

- Qism-masala 3 [20 ball]: 𝑀 ≤ 𝑁 ≤ 200 va barcha 𝑇𝑖 lar yig’indisi 𝑁 ga teng (boshqacha
qilib aytganda, hech qaysi pitsapaz xafa bo’lib ketib qolmaydi).

- Qism-masala 4 [20 ball]: 𝑀 ≤ 10.
- Qism-masala 5 [30 ball]: Qo’shimcha chegaralarsiz.
Misollar
stdin stdout
6 2
3 1 3 5
2 0 4
YES
1 0 3 5 4 2
6 2
3 1 3 4
2 0 2
NO
4 2
2 0 3
2 1 2
NO
3 1
2 0 2
YES
0 2 1
8 1
8 7 6 5 4 3 2 1 0
NO
12 4
3 2 3 4
1 5
1 6
5 7 8 9 10 11
YES
2 5 6 7 0 1 3 4 8 9 10 11
Izoh
Birinchi misolning kiritilishi va chiqarilishi masala shartida ko’rsatilgan rasmlarga mos keladi.
Xususan, 1 va 2-rasmlarda pitsapazlarning bazmga kelish tartibi leksikografik jihatdan eng kichik
to’g’ri tartib hisoblangan 1, 0, 3, 5, 4, 2 dir.
Ikkinchi misolda patnislar to’plami mantiqqa to’g’ri kelmaydi, chunki 5-o’rinli pitsapaz xafa bo’lib
ketib qoladigan hech qanday kelish tartibi mavjud emas. Shuning uchun javob NO.
Uchinchi va beshinchi misollarda patnislar to’plami ham xato (ularni hosil qila oladigan hech qanday
kelish tartibi yo’q), shuning uchun javob NO.
To’rtinchi misolda (𝑁 = 3, 𝑀 = 1) faqatgina bitta kelish tartibi mumkin, ya’ni 0, 2, 1.
Oltinchi misolda ( 𝑁 = 12, 𝑀 = 4) shuni yodda tutki, 0 va 1 sonlari 𝑏𝑖,𝑗 qiymatlari orasida
qatnashmaydi. Bu degani bazm davomida qaysidir vaqtda 0 va 1-pitsapazlarning ikkalasi ham
xafa bo’lib ketib qolgan. Misoldagi javobda leksikografik jihatdan eng kichik to’g’ri kelish tartibi
ko’rsatilgan. Boshqa to’g’ri keladigan tartiblar ham bor; masalan, 2, 5, 6, 7, 8, 1, 3, 4, 9, 10, 11, 0.
Leksikografik eng kichik tartibni chiqarish o’rniga shu kabi boshqa to’g’ri tartibni YES dan keyin
chiqarish qisman to’g’ri deb hisoblanadi va buning uchun umumiy ballning 40% qismi beriladi.
