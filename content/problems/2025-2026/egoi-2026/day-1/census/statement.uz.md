> Ushbu shart EGOI 2026 rasmiy repository’sidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Cesenatico haqida kam ma’lum bo’lgan fakt shundaki, u 𝑁 nafar ayol informatika mutaxassislaridan
iborat yashirin jamiyatning maskanidir. Bu jamiyat juda maxfiy; a’zolarning hech biri bir-birini
tanimaydi. Har bir a’zoning noyob identifikatori (ID) bor: manfiy bo’lmagan butun son 𝐼.
A’zolar o’rtasidagi yagona muloqot bilvosita (to’g’ridan to’g’ri bo’lmagan) muloqotdir. Ular shahar
bo’ylab turli joylarda bo’r bilan yozilgan sonlar orqali muloqot qilishadi. Har 100 yilda jamiyat o’z
a’zolarini sanash uchun ro’yxatga olish (census) amaliyotini o’tkazadi. Ro’yxatga olish tugagandan
so’ng, har bir a’zo jamiyatdagi a’zolarning umumiy sonini bilishi kerak.
Ro’yxatga olish jarayoni bir necha kun davom etadi. Har kuni jarayonda qatnashishda davom
etayotgan har bir a’zo aynan bitta amalni tanlaydi va bajaradi: o’qish, yozish yoki qatnashishni
to’xtatish.

- Agar a’zo o’qish ni tanlasa, u 𝑃 manzilini tanlaydi. Kunduzi u 𝑃 manziliga tashrif buyuradi
va u yerga yozilgan sonni o’qiydi.

- Agar a’zo yozish ni tanlasa, u 𝑃 manzilini va 𝑉 sonini tanlaydi. Kechqurun u 𝑃 manziliga
boradi va u yerga yozilgan sonni 𝑉 ga o’zgartiradi. Qorong’u bo’lgani uchun, yangi sonni
yozishdan oldin u hozir yozilgan sonni o’qiy olmaydi.

- Agar a’zo to’xtatish ni tanlasa, u keyingi kunlarda boshqa hech qanday amal bajarmaydi.
Agar bir a’zo kimnidir sonni yozayotganini ko’rib qolsa, uni tanib qolishi mumkin. Shu sababli, ikki
yoki undan ortiq a’zoning bir kunda bir xil manzilga borib yozish amalini bajarishi qat’iyan man
etiladi. (O’qish uchun bunday cheklov yo’q, chunki o’qishni sezdirmasdan amalga oshirish mumkin.)
Agar bir yoki bir nechta a’zo boshqa bir a’zo yozmoqchi bo’lgan joydan o’qishni xohlasa, barcha
o’qish amallari yozishdan oldin sodir bo’ladi.
Jamiyatdagi hamma a’zolar, jami a’zolar sonini to’g’ri bilib olguniga qadar o’tadigan kunlar sonini
minimallashtirish uchun ro’yxatga olish jarayonini qanday rejalashtirishi kerak?
Muloqot
⇨
Bu interaktiv masala bo’lib, unda dasturingizning noma’lum sondagi ( 1 ≤ 𝑁 ≤ 100)
nusxalari bir vaqtning o’zida bajariladi. Har bir nusxa jamiyatning bitta a’zosini
simulyatsiya qiladi. Boshqa so’zlar bilan aytganda, sizning dasturingiz har bir jamiyat
a’zosi uchun aynan bir marta ishga tushiriladi.
1018 ta manzil mavjud. 𝑃 manzil indeksi bo’lsa, u 0 ≤ 𝑃 < 1018 shartini qanoatlantirishi kerak.
Dastlab, barcha manzillarda yozilgan qiymat 𝑉 = 0 ga teng.
Manzilga yozilgan yangi 𝑉 qiymati har doim 0 ≤ 𝑉 ≤ 109 bo’lgan butun son bo’lishi kerak. Aksariyat
qism-masalalarda (subtasks), 𝑉 faqatgina 0 yoki 1 bo’lishi mumkin. Qo’shimcha ma’lumot olish uchun
“Baholash” qismiga qarang.
Dasturingizning biror nusxasi ishga tushganda, u avvalo ikkita butun son 𝐼 va 𝑀 (0 ≤ 𝐼 ≤ 𝑀 − 1)
bo’lgan qatorni o’qib olishi kerak: ushbu nusxa tomonidan ifodalangan jamiyat a’zosining noyob
ID raqami va barcha mumkin bo’lgan IDlar soni. Har bir test holatida barcha nusxalar bir xil 𝑀
qiymatini va turlicha 𝐼 qiymatlarini oladi. Shuni yodda tutingki, hech qanday a’zoga tayinlanmagan
IDlar bo’lishi mumkin.
So’ngra, ro’yxatga olish jarayonidagi har bir kun uchun dasturingiz bajarmoqchi bo’lgan amalni
tanlashi va mos ravishda qator chiqarishi kerak:
Amal Ma’nosi
r 𝑃 𝑃 manzilini o’qish.
Ushbu qatorni chiqarganingizdan so’ng, dasturingiz 𝑃 manzilida yozilgan joriy qiymatni
o’qib olishi kerak.
w 𝑃 𝑉 𝑃 manziliga yangi 𝑉 qiymatini yozish.
Agar bir kunda bir nechta nusxa bir xil 𝑃 manziliga yozsa, siz Not correct hukmini olasiz.
Misollar va 3-qism masaladan tashqari, 0 ≤ 𝑉 ≤ 1 yozishingiz shart; “Baholash” qismiga
qarang.
! 𝑁 Javob berish va to’xtatish : 𝑁 ta a’zo borligini xabar qiling va ro’yxatga olishda
qatnashishni to’xtating.
Javob bergandan so’ng, dasturingiz normal holatda yakunlanishi kerak . (E’tibor
bering, dasturingizning boshqa nusxalari javob berib, chiqib ketguncha qo’shimcha kunlar
davomida ishlashda davom etishi mumkin.)
Agar dasturingizning biron bir nusxasi noto’g’ri 𝑁 qiymatini javob bersa, protokolni buzsa, 500
kundan ortiq vaqt ishlatsa yoki (har bir jarayon uchun) vaqt/xotira chegarasidan oshib ketsa,
topshirgan yechimingiz berilgan test uchun Not correct deb baholanadi.
Aks holda, dasturingiz test uchun (Partially) Correct (Qisman to’g’ri) bo’ladi va 𝐷 qiymati asosida
baholanadi: bu istalgan nusxa javob berishi uchun sarflagan maksimal kunlar soni. To’liq ball olish
uchun har bir test holatini 𝐷 ≤ 61 va 𝑉 ≤ 1 shartlari bilan yechishingiz kerak. Tafsilotlar uchun
“Baholash” qismiga qarang.
Buferni tozalash (Flushing). Agar siz taqdim etilgan shablonlardan foydalanmayotgan bo’lsangiz,
har bir qatorni chiqargandan so’ng standart chiqishni tozalaganingizga ishonch hosil qiling, aks holda
dasturingiz Not correct deb baholanishi mumkin. Pythonda, agar qatorlarni o’qish uchun input()
dan foydalansangiz, bu avtomatik ravishda amalga oshiriladi. C++ da cout << endl; yangi
qatorni chiqarishdan tashqari buferni ham tozalaydi; agar printf dan foydalanayotgan bo’lsangiz,
fflush(stdout) dan foydalaning.
Cheklovlar

- 1 ≤ 𝑁 ≤ 100.
- 1 ≤ 𝑀 ≤ 100000.
- Siz ko’pi bilan 500 kundan foydalanishingiz mumkin.

## Baholash

Dasturingiz subtasklarga bo’lingan bir nechta testlarda sinovdan o’tkaziladi. Subtaskda ball olish
uchun dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.

- Qism-masala 0 [ 0 ball]: Sample testlar (siz istalgan 0 ≤ 𝑉 ≤ 1000000000 butun sonini
yozishingiz mumkin).

- Qism-masala 1 [11 ball]: 𝑀 ≤ 100, va 𝑁 ta a’zoning IDlari 0, 1, …, 𝑁 − 1.
- Qism-masala 2 [12 ball]: 1 ≤ 𝑁 ≤ 2.
- Qism-masala 3 [22 ball]: 𝑀 ≤ 8000, va siz istalgan 0 ≤ 𝑉 ≤ 1000000000 butun sonini
yozishingiz mumkin.

- Qism-masala 4 [55 ball]: Qo’shimcha cheklovlar yo’q.
1, 2 va 4-qism masalalarda, har bir “Yozish” (Write) amalida faqat 𝑉 = 0 yoki 𝑉 = 1
yozishingiz mumkin.
𝑋𝑠 bu 𝑠 qism masala uchun maksimal ball bo’lsin (yuqorida ko’rsatilgan), va 𝐷𝑠 bu 𝑠 qism
masalalardagi testda dasturlaringizdan biri foydalangan eng katta kunlar soni bo’lsin. U holda:
score𝑠 =
{"#
"$𝑋𝑠 agar 𝐷𝑠 ≤ 61
𝑋𝑠 ⋅ (0.2 + 0.8 ⋅ 1.01(60−𝐷𝑠)) agar 61 < 𝐷𝑠 ≤ 500
0 agar 500 < 𝐷𝑠.
score𝑠 qiymati har bir qism masala uchun eng yaqin butun songa yaxlitlanadi va umumiy balingiz
bularning yig’indisidir. Masala uchun to’liq ball olish uchun har bir test holatida 𝐷 ≤ 61 va 𝑉 ≤ 1
bo’lishi kerak.
𝐷
score
0
10
20
30
40
50
60
70
80
90
100
0 60 100 150 200 250 300 350 400 450 500
Figure  1: Umumiy ball, agar har bir qism masalada bir xil maksimal 𝐷 bilan yechilgan deb faraz
qilinsa.
Misollar
Birinchi misol. Har bir ustun juftligi grader va dasturingizni bitta nusxasi o'rtasidagi aloqani
ko'rsatadi. (Gr. - Greyder; DN - Dasturingizni Nusxasi
Gr. DN. 0 Gr. DN. 1 Gr. DN. 2 Gr. DN. 3 Gr. DN. 4
0 100 1 100 2 100 3 100 4 100
w 12 1 w 50 1 w 99 0 w 7 1 r 5
0
r 50 r 7 r 12 w 1 1 ! 5
1 1 1
! 5 r 1 w 0 0 ! 5
1
! 5 ! 5
Ikkinchi misol.
Greyder Dasturingiz
Nusxasi 0
Greyder Dasturingiz
Nusxasi 1
0 8000 3 8000
w 0 0 w 2 1
w 1 1 r 1
0
r 2 r 2
1 1
! 2 r 1
1
! 2
Izoh
Birinchi misol. Bizda 𝑁 = 5 ta ketma-ket ID (0, 1, 2, 3, 4) ga ega a’zo va 𝑀 = 100 (1, 3 va 4-qism
masalar uchun amal qiladi) bor. 𝑖-nusxa uchun ID = 𝑖 lik jamiyat a’zosiga to’g’ri keladi. Yuqoridagi
keltirilgan o’zaro muloqotga misol bo’lishi mumkin bo’lgan mavjud ketma-ketliklardan biridir va u
samarali yoki oqilona strategiya bo’lmasligi mumkin shart emas ; u faqat protokol (muloqotlar)
qanday ishlashini ko’rsatish uchun keltirilgan.
Ikkinchi misol. Bizda 𝑁 = 2 ta a’zo bor, IDlari 0 va 3, va 𝑀 = 8000 (bu chegaralar faqatgina 2,
3 va 4-qism masalalarga to’g’ri kelishi mumkin). Birinchi kuni, ID si 0 ga ega a’zo 0 manziliga 0 ni
yozadi (o’zgarishsiz), va ID 3 ga ega a’zo 2 manziliga 1 ni yozadi. Hozirgi holat: “location” - manzil
hamda “value” - qiymat
location 0 1 2 3 4 …
value 0 0 1 0 0 …
Ikkinchi kuni, ID 0, 1 manziliga 1 ni yozadi va ID 3 xuddi shu manzilni o’qiydi. E’tibor bering, o’qish
kunduzi, kechqurungi yozishdan oldin sodir bo’ladi. Shu sababli, ID 3 hali ham 0 ni ko’radi.
location 0 1 2 3 4 …
value 0 1 1 0 0 …
Uchinchi kuni, ikkalasi ham 2 manzilini o’qiydi, u yerga 1 yozilgan.
To’rtinchi kuni, ID 0 jami 2 ta a’zo bor deb javob beradi (to’g’ri), ID 3 esa 1 manzilidagi 1 ni o’qiydi.
ID 0 shundan so’ng darhol chiqib ketadi va kelgusi kunlarda qatnashmaydi.
Nihoyat, 𝐷 = 5 kunda, qolgan a’zo ham 𝑁 = 2 deb to’g’ri javob beradi.
Testlash
Yechimingizni sinab ko’rishni osonlashtirish uchun biz CMSdan yuklab olishingiz mumkin bo’lgan
testlash vositani taqdim etamiz. Ushbu vositadan foydalanish ixtiyoriy. E’tibor bering, CMSdagi
rasmiy grader testlash vositasidan farq qiladi.
Vositadan foydalanish uchun sizga kirish fayli kerak. Siz taqdim etilgan namuna kirish fayllari
census.input0.txt va census.input1.txt dan foydalanishingiz yoki o’zingiznikini yaratishingiz
mumkin. Kirish fayli a’zolar soni 𝑁 va mumkin bo’lgan IDlar soni 𝑀 bilan boshlanishi, undan keyin
jamiyat a’zolarining IDlarini ko’rsatuvchi 𝑁 ta son bo’lgan qator kelishi kerak.
Python dasturlari uchun, aytaylik census.py (odatda pypy3 census.py sifatida ishga tushiriladi)
testlash vositasini quyidagicha ishga tushiring:
python3 testing_tool.py pypy3 census.py < census.input0.txt
C++ dasturlari uchun, avvalo yechimingizni kompilyatsiya qiling:
g++ -DEVAL -std=gnu++20 -O2 -pipe -static -s -o census census.cpp
va keyin testlash vositasini ishga tushiring:
python3 testing_tool.py ./census < census.input0.txt
E’tibor bering, ushbu masalada standart chiqish (stdout) grader bilan muloqot qilish uchun ishlatiladi,
shuning uchun uni xatolar ishlash (debugging) uchun ishlatmaslik kerak. Buning o’rniga, siz
standart xato chiqishidan (stderr) foydalanishingiz mumkin. C++ da siz cerr << msg << endl;
dan foydalanishingiz mumkin. Pythonda siz print(msg, file=sys.stderr) dan foydalanishingiz
mumkin.
Testlash vositasi ushbu stderr xabarlarini dasturingizning barcha nusxalari tomonidan amalga
oshirilgan so’rovlar bilan birga o’qiydi va taqdim etadi. Texnik sabablarga ko’ra ular bir-biridan biroz
farqli vaqtda ko’rinishi mumkinligini unutmang.
