> Ushbu shart EGOI 2026 rasmiy repozitoriysidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Cesenatico haqida kam ma’lum bo’lgan fakt shundaki, u $N$ nafar ayol informatika mutaxassislaridan iborat yashirin jamiyatning maskanidir. Bu jamiyat juda maxfiy; a’zolarning hech biri bir-birini tanimaydi. Har bir a’zoning noyob identifikatori (ID) bor: manfiy bo’lmagan butun son $I$.

A’zolar o’rtasidagi yagona muloqot bilvosita (to’g’ridan to’g’ri bo’lmagan) muloqotdir. Ular shahar bo’ylab turli joylarda bo’r bilan yozilgan sonlar orqali muloqot qilishadi. Har 100 yilda jamiyat o’z a’zolarini sanash uchun ro’yxatga olish (census) amaliyotini o’tkazadi. Ro’yxatga olish tugagandan so’ng, har bir a’zo jamiyatdagi a’zolarning umumiy sonini bilishi kerak.

Ro’yxatga olish jarayoni bir necha kun davom etadi. Har kuni jarayonda qatnashishda davom etayotgan har bir a’zo aynan bitta amalni tanlaydi va bajaradi: **o’qish** , **yozish** yoki qatnashishni **to’xtatish** .

- Agar a’zo **o’qish** ni tanlasa, u $P$ manzilini tanlaydi. Kunduzi u $P$ manziliga tashrif buyuradi va u yerga yozilgan sonni o’qiydi.

- Agar a’zo **yozish** ni tanlasa, u $P$ manzilini va $V$ sonini tanlaydi. Kechqurun u $P$ manziliga boradi va u yerga yozilgan sonni $V$ ga o’zgartiradi. Qorong’u bo’lgani uchun, yangi sonni yozishdan oldin u hozir yozilgan sonni o’qiy olmaydi.

- Agar a’zo **to’xtatish** ni tanlasa, u keyingi kunlarda boshqa hech qanday amal bajarmaydi.

Agar bir a’zo kimnidir sonni yozayotganini ko’rib qolsa, uni tanib qolishi mumkin. Shu sababli, ikki yoki undan ortiq a’zoning bir kunda bir xil manzilga borib yozish amalini bajarishi qat’iyan man etiladi. (O’qish uchun bunday cheklov yo’q, chunki o’qishni sezdirmasdan amalga oshirish mumkin.)

Agar bir yoki bir nechta a’zo boshqa bir a’zo yozmoqchi bo’lgan joydan o’qishni xohlasa, barcha o’qish amallari yozishdan oldin sodir bo’ladi.

Jamiyatdagi hamma a’zolar, jami a’zolar sonini to’g’ri bilib olguniga qadar o’tadigan kunlar sonini minimallashtirish uchun ro’yxatga olish jarayonini qanday rejalashtirishi kerak?

## Muloqot
Bu interaktiv masala bo’lib, unda dasturingizning noma’lum sondagi (1 $\le N\le 100$) nusxalari bir vaqtning o’zida bajariladi. Har bir nusxa jamiyatning bitta a’zosini ⇨ simulyatsiya qiladi. Boshqa so’zlar bilan aytganda, sizning dasturingiz har bir jamiyat a’zosi uchun aynan bir marta ishga tushiriladi.

$10^{18}$ ta manzil mavjud. $P $ manzil indeksi bo’lsa, u 0 $\le P < 10^{18}$ shartini qanoatlantirishi kerak. Dastlab, barcha manzillarda yozilgan qiymat $V = 0$ ga teng.

Manzilga yozilgan yangi $V$ qiymati har doim 0 $\le V\le $10 < sup>9</sup> bo’lgan butun son bo’lishi kerak. Aksariyat qism-masalalarda (subtasks),$ V$ faqatgina 0 yoki 1 bo’lishi mumkin. Qo’shimcha ma’lumot olish uchun “Baholash” qismiga qarang.

Dasturingizning biror nusxasi ishga tushganda, u avvalo ikkita butun son $I$ va $M$ (0 $\le I\le M-1$) bo’lgan qatorni o’qib olishi kerak: ushbu nusxa tomonidan ifodalangan jamiyat a’zosining noyob ID raqami va barcha mumkin bo’lgan IDlar soni. Har bir test holatida barcha nusxalar bir xil $ M$ qiymatini va turlicha $ I$ qiymatlarini oladi. Shuni yodda tutingki, hech qanday a’zoga tayinlanmagan IDlar bo’lishi mumkin.

So’ngra, ro’yxatga olish jarayonidagi har bir kun uchun dasturingiz bajarmoqchi bo’lgan amalni tanlashi va mos ravishda qator chiqarishi kerak:

|**Amal**|**Ma’nosi**|
|---|---|
|r $P$|$ P $manzilini**o’qish**.<br>Ushbu qatorni chiqarganingizdan so’ng, dasturingiz$ P$manzilida yozilgan joriy qiymatni<br>o’qib olishi kerak.|
|w $P$ $ V $|$ P $manziliga yangi$ V $qiymatini**yozish**.<br>Agar bir kunda bir nechta nusxa bir xil$ P $manziliga yozsa, siz_Not correct_hukmini olasiz.<br>Misollar va 3-qism masaladan tashqari,0 $\le V\le 1$ yozishingiz shart; “Baholash” qismiga<br>qarang.|
|!$N $|**Javob berish va to’xtatish**:$ N$ta a’zo borligini xabar qiling va ro’yxatga olishda<br>qatnashishni to’xtating.<br>Javob bergandan so’ng,**dasturingiz normal holatda yakunlanishi kerak**. (E’tibor<br>bering, dasturingizning boshqa nusxalari javob berib, chiqib ketguncha qo’shimcha kunlar<br>davomida ishlashda davom etishi mumkin.)|

Agar dasturingizning biron bir nusxasi noto’g’ri $N$ qiymatini javob bersa, protokolni buzsa, 500 kundan ortiq vaqt ishlatsa yoki (har bir jarayon uchun) vaqt/xotira chegarasidan oshib ketsa, topshirgan yechimingiz berilgan test uchun _Not correct_ deb baholanadi.

Aks holda, dasturingiz test uchun _(Partially) Correct_ (Qisman to’g’ri) bo’ladi va $D$ qiymati asosida baholanadi: bu istalgan nusxa javob berishi uchun sarflagan maksimal kunlar soni. To’liq ball olish uchun har bir test holatini $D\le 61$ va $V\le 1$ shartlari bilan yechishingiz kerak. Tafsilotlar uchun “Baholash” qismiga qarang.

**Buferni tozalash (Flushing).** Agar siz taqdim etilgan shablonlardan foydalanmayotgan bo’lsangiz, har bir qatorni chiqargandan so’ng standart chiqishni tozalaganingizga ishonch hosil qiling, aks holda dasturingiz _Not correct_ deb baholanishi mumkin. Pythonda, agar qatorlarni o’qish uchun input() dan foydalansangiz, bu avtomatik ravishda amalga oshiriladi. C++ da cout << endl; yangi qatorni chiqarishdan tashqari buferni ham tozalaydi; agar printf dan foydalanayotgan bo’lsangiz, fflush(stdout) dan foydalaning.

## Cheklovlar

- 1 $\le N\le 100$.

- 1 $\le M\le 100000$.

- Siz ko’pi bilan 500 kundan foydalanishingiz mumkin.

## Baholash

Dasturingiz subtasklarga bo’lingan bir nechta testlarda sinovdan o’tkaziladi. Subtaskda ball olish uchun dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.

- **Qism-masala 0 [ 0 ball]** : Sample testlar (siz istalgan 0 $\le V\le 1000000000$ butun sonini yozishingiz mumkin).

- **Qism-masala 1 [11 ball]** : $M\le 100$, va $ N$ ta a’zoning IDlari 0, 1, …, $ N-1$.

- **Qism-masala 2 [12 ball]** : 1 $\le N\le 2$.

- **Qism-masala 3 [22 ball]** : $M\le 8000$, va siz istalgan 0 $\le V\le 1000000000$ butun sonini yozishingiz mumkin.

- **Qism-masala 4 [55 ball]** : Qo’shimcha cheklovlar yo’q.

**1, 2 va 4-qism masalalarda, har bir “Yozish” (Write) amalida faqat $V = 0$ yoki $V = 1$ yozishingiz mumkin.**

$X_{s}$ bu $s$ qism masala uchun maksimal ball bo’lsin (yuqorida ko’rsatilgan), va $D_{s}$ bu $s$ qism masalalardagi testda dasturlaringizdan biri foydalangan eng katta kunlar soni bo’lsin. U holda:

score $s$ qiymati har bir qism masala uchun eng yaqin butun songa yaxlitlanadi va umumiy balingiz bularning yig’indisidir. Masala uchun to’liq ball olish uchun har bir test holatida $D\le 61$ va $V\le 1$ bo’lishi kerak.

_Diagramma rasmiy PDFda keltirilgan._

**1-rasm.** Umumiy ball, agar har bir qism masalada bir xil maksimal $D$ bilan yechilgan deb faraz qilinsa.

## Misollar

Birinchi misol. Har bir ustun juftligi grader va dasturingizni bitta nusxasi o'rtasidagi aloqani ko'rsatadi. (Gr. - Greyder; DN - Dasturingizni Nusxasi

|**Gr.**|**DN. 0**|**Gr.**|**DN. 1**|**Gr.**|**DN. 2**|**Gr.**|**DN. 3**|**Gr.**|**DN. 4**|
|---|---|---|---|---|---|---|---|---|---|
|0 100||1 100||2 100||3 100||4 100||
||w 12 1||w 50 1||w 99 0||w 7 1||r 5|
|||||||||0||
||r 50||r 7||r 12||w 1 1||! 5|
|1||1||1||||||
||! 5|1|r 1||w 0 0||! 5|||
||||! 5||! 5|||||

Ikkinchi misol.

_Diagramma rasmiy PDFda keltirilgan._

## Izoh
**Birinchi misol.** Bizda $N = 5$ ta ketma-ket ID (0, 1, 2, 3, 4) ga ega a’zo va $M = 100$ (1, 3 va 4-qism masalar uchun amal qiladi) bor. $ i $-nusxa uchun ID = $ i$ lik jamiyat a’zosiga to’g’ri keladi. Yuqoridagi keltirilgan o’zaro muloqotga misol bo’lishi mumkin bo’lgan mavjud ketma-ketliklardan biridir va u samarali yoki oqilona strategiya bo’lmasligi mumkin **shart emas** ; u faqat protokol (muloqotlar) qanday ishlashini ko’rsatish uchun keltirilgan.

**Ikkinchi misol.** Bizda $N = 2$ ta a’zo bor, IDlari 0 va 3, va $M = 8000$ (bu chegaralar faqatgina 2, 3 va 4-qism masalalarga to’g’ri kelishi mumkin). Birinchi kuni, ID si 0 ga ega a’zo 0 manziliga 0 ni yozadi (o’zgarishsiz), va ID 3 ga ega a’zo 2 manziliga 1 ni yozadi. Hozirgi holat: “location” - manzil hamda “value” - qiymat

Ikkinchi kuni, ID 0, 1 manziliga 1 ni yozadi va ID 3 xuddi shu manzilni o’qiydi. E’tibor bering, o’qish kunduzi, kechqurungi yozishdan oldin sodir bo’ladi. Shu sababli, ID 3 hali ham 0 ni ko’radi.

Uchinchi kuni, ikkalasi ham 2 manzilini o’qiydi, u yerga 1 yozilgan.

To’rtinchi kuni, ID 0 jami 2 ta a’zo bor deb javob beradi (to’g’ri), ID 3 esa 1 manzilidagi 1 ni o’qiydi. ID 0 shundan so’ng darhol chiqib ketadi va kelgusi kunlarda qatnashmaydi.

Nihoyat, $D = 5$ kunda, qolgan a’zo ham $N = 2$ deb to’g’ri javob beradi.

## Testlash
Yechimingizni sinab ko’rishni osonlashtirish uchun biz CMSdan yuklab olishingiz mumkin bo’lgan testlash vositani taqdim etamiz. Ushbu vositadan foydalanish ixtiyoriy. E’tibor bering, CMSdagi rasmiy grader testlash vositasidan farq qiladi.

Vositadan foydalanish uchun sizga kirish fayli kerak. Siz taqdim etilgan namuna kirish fayllari census.input0.txt va census.input1.txt dan foydalanishingiz yoki o’zingiznikini yaratishingiz

mumkin. Kirish fayli a’zolar soni $N$ va mumkin bo’lgan IDlar soni $M$ bilan boshlanishi, undan keyin jamiyat a’zolarining IDlarini ko’rsatuvchi $N$ ta son bo’lgan qator kelishi kerak.

Python dasturlari uchun, aytaylik census.py (odatda pypy3 census.py sifatida ishga tushiriladi) testlash vositasini quyidagicha ishga tushiring:

python3 testing_tool.py pypy3 census.py < census.input0.txt

C++ dasturlari uchun, avvalo yechimingizni kompilyatsiya qiling:

g++ -DEVAL -std=gnu++20 -O2 -pipe -static -s -o census census.cpp

va keyin testlash vositasini ishga tushiring:

python3 testing_tool.py ./census < census.input0.txt

E’tibor bering, ushbu masalada standart chiqish (stdout) grader bilan muloqot qilish uchun ishlatiladi, shuning uchun uni xatolar ishlash (debugging) uchun ishlatmaslik kerak. Buning o’rniga, siz standart xato chiqishidan (stderr) foydalanishingiz mumkin. C++ da siz cerr << msg << endl; dan foydalanishingiz mumkin. Pythonda siz print(msg, file=sys.stderr) dan foydalanishingiz mumkin.

Testlash vositasi ushbu stderr xabarlarini dasturingizning barcha nusxalari tomonidan amalga oshirilgan so’rovlar bilan birga o’qiydi va taqdim etadi. Texnik sabablarga ko’ra ular bir-biridan biroz farqli vaqtda ko’rinishi mumkinligini unutmang.
