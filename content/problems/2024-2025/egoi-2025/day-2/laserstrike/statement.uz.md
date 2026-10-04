> Ushbu shart EGOI 2025 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Enn va uning do'sti Katrin yaqinda ularning sevimli o'yiniga aylangan yangi "Laser Strike" nomli stol o'yinini topib olishdi. Ushbu o'yinda ikkala o'yinchi birgalikda taxtadagi $N$ ta o'yin donalarini taxtadan olib tashlash uchun harakat qilishadi. O'yin ikki bosqichda o'tkaziladi. Gap shundaki, Katrin o'yin haqida to'liq ma'lumotga ega bo'lmaydi. O'yinda g'alaba qozonish uchun Enn va Katrin imkon qadar kamroq o'zaro muloqot qilib, birga ishlashlari kerak.

Doskada 0 dan $N - 1$ gacha raqamlangan $N$ ta noyob o'yin donalari mavjud. Ikkala o'yinchi ham bu o'yin donalarini ko'rishi mumkin.

O'yin donalari juftliklari oʻrtasida $N - 1$ ta bogʻlanishlar mavjud bo'lib, bu bog'lanishlarg orqali istalgan o'yin donasidan boshqa o'yin donasiga yetib borish mumkin. Boshqacha qilib aytganda, bu bogʻlanishlar daraxt hosil qiladi. **Bu ulanishlarni faqat Enn ko'ra oladi; Katrin ularni bilmaydi.**

O'yinning birinchi bosqichida Enn ℓ,ℓ,… ,ℓ0 1 $N - 2$ o'yin donalari tartibini tanlab olishi kerak, bu tanlangan o'yin donalari aynan shu tartibda o'yin taxtasidan olib tashlanadi va natijada bitta o'yin donasi qoladi. Bu o'yin donalari tartibi Katrindan sir saqlanadi. Agar u bu tartibni qayta yozib chiqa olsa, ular o'yinda g'alaba qozonishadi. O'yin donalarni olib tashlash quyidagi qoidaga javob berishi kerak: har safar o'yin donasi olib tashlanganida, u faqat bitta boshqa bir o'yin donasiga bog'langan bo'lishi kerak. Boshqacha qilib aytganda, olib tashlanadigan o'yin donasi, hali o'chirilmagan o'yin donalaridan hosil qilingan daraxtning bargi bo'lishi kerak ( $N - 1$ ta o'yin donalari olib tashlangandan so'ng, oxirgi o'yin donasi avtomatik ravishda o'chiriladi va o'yinchilar o'yinda g'alaba qozonishadi). Enn yuqoridagi qoidaga mos keladigan tartibni tanlashi kerak.

Keyin Enn Katringa binar satr shaklida xabar yozadi. Enn bu xabar uzunligini tanlay oladi, ammo xabar qanchalik kichik bo'lsa, ular shunchalik ko'p ball oladi.

Shundan so'ng o'yinning ikkinchi bosqichi boshlanadi. Bosqichning maqsadi Katrin $N - 1$ o'yin donalarini aynan ℓ,ℓ,… ,ℓ0 1 $N - 2$ tartibida taxtadan olib tashlashdadir.

U $N - 1$ ta yurish qiladi. $i $ yurishdan oldin Enn Katringa quyidagi xususiyatlarga ega $a $ , $ b$ juftligini aytadi:

$a < b$ ;

$a $ va $b$ o'yin donalari orasida o'chirilmagan bog'lanish mavjud; va $a$ yoki $b$ hozirgi yurishda o'chiriladigan o'yin donasi ℓ $i$ ga teng bo'lishi kerak.

E'tibor bering, Enn uchun ( $a $ , $ b $ ) ulanishi joriy daraxtdagi ℓ $ i$ bargi bilan yagona tarzda aniqlanadi.

Keyin Katrin doskadan $a$ yoki $b$ o'yin donasini olib tashlaydi. Olib tashlangan o'yin donasiga bog'liq qirralar ham o'chiriladi. Agar bu tanlagan o'yin donasi to'g'ri bo'lsa, ya'ni agar u ℓ $i$ ga teng bo'lsa - ular o'ynashda davom etishdi. Aks holda ular o'yinni yutqizishgan hisoblanadi.

Sizning vazifangiz o'yinda g'alaba qozonishlari uchun ikkala ishtirokchini ham, Enn va Katrinning strategiyalarini o'ylab topib yozishdir.

Sizning dasturingiz o'yinning birinchi bosqichida Enn yozgan xabarning uzunligiga qarab baholanadi.

## Kod yozish

Bu multi-run masala, ya'ni sizning dasturingiz ikki marta bajariladi.

Birinchi marta ishga tushirilganda, u o'yinning birinchi bosqichi uchun Enn o'rniga uning vazifasini bajarishi kerak. Shundan so'ng, ikkinchi marta ishga tushirilganda, u Katrinning yurishlarini, ya'ni o'yinning ikkinchi bosqichi uchun strategiyasini amalga oshirishi kerak.

Kirishning birinchi qatori ikkita butun sonni o'z ichiga oladi, $P $ va $N $ , bu yerda $ P $ ning qiymati 1 yoki 2 (birinchi yoki ikkinchi bosqich), va $ N$ - o'yin donalari soni.

Kirishning qolgan qismi bosqichga qarab farq qiladi:

#### **1-bosqich** : Enn

Yuqorida tasvirlangan birinchi qatordan keyingi $N - 1$ qatorda daraxtni qirralari kiritiladi. Har bir qatorda ikkita butun $a$ va $b$ ($0 \le a < b \le N - 1$) sonlari kiritiladi. Ular $ a$ va $ b$ o'yin donalari orasida bog'lanish borligini anglatadi.

Sizning dasturingiz Enn tomonidan yozilgan, har bir belgisi `0` yoki `1` bo'lgan, uzunligi ko'pi bilan 1 000 belgilardan iborat binar satrni ekranga chiqarishi bilan boshlanishi kerak. E'tibor bering, 0 uzunlikdagi qator chiqariladigan bo'ladigan bo'lsa, dasturingiz shunchaki bo'sh qatorni chiqarishi kerak.

Shundan so'ng, u alohida qatorlarda $N - 1$ butun sonlarni ℓ,ℓ,… ,ℓ0 1 $N - 2$ chiqarishi kerak, bu Enn daraxt barglarini olib tashlashni istayotgan tartibni ko'rsatadi. Tartib shunday bo'lishi kerakki,

agar o'yin donalari shu tartibda daraxtdan birma-bir olib tashlansa, navbatdagi tanlanadigan o'yin donasi doimo barg bo'lishi kerak, ya'ni daraxt doimo bog'langan holda qolishi kerak.

#### **2-bosqich** : Katrin

Yuqorida tasvirlangan birinchi qatordan keyingi qatorda, 1-bosqichda Enn bergan binar satr kiritiladi. Shundan soʻng, Katrin bajaradigan har bir yurish uchun jami $N - 1$ marta muloqot qadamlari bo'ladi.

$i $ -qadamda dasturingiz avval ikkita sonni o'qishi kerak, $ a $ va $ b $ ($0 \le a < b \le N - 1$). Bu sonlardan biri Enn tanlagan tartibdagi ℓ $ i $ donasi, hozirda daraxt bargi, ikkinchisi esa ℓ $ i$ ga ulangan va hali daraxtdan o'chirilmagan boshqa o'yin donasidir.

Keyin dasturingiz ℓ $i $ sonini chiqishi kerak, bu Katrin shu bargni olib tashlaganligini bildiradi. Agar dasturingiz ℓ $i$ ni to'g'ri topmasa, qizlar o'yinda yutqazishadi va sizning yechimingiz ushbu testdan uchun Wrong Answer hukmini oladi.

#### Tafsilotlar

Agar dasturingizning ikkita alohida ishga tushirish vaqtlarining _yig'indisi_ belgilangan muddatdan oshsa, sizning yechimingiz Time Limit Exceeded hukmi bilan baholanadi.

Har bir qatorni ekranga chop etgandan so'ng, buferni tozalashni unutmang, aks holda dasturingiz Time Limit Exceeded hukmini olishi mumkin. Python-da, satrlarni o'qish uchun `input()` foydalansangiz, bu avtomatik ravishda sodir bo'ladi. C++ tilida `cout << endl;` yangi qatorni chop etishdan tashqari, chop etgandan so'ng buferni tozalaydi. Bundan tashqari `printf` dan foydalansangiz, `fflush(stdout)` dan foydalanishni unutmang.

## Chegaralar va baholash

$N = 1000$.

Barcha bog'lanishlar uchun $0 \le a < b \le N - 1$.

Sizning yechimingiz har biri bir necha ballga ega bo'lgan subtasklarda sinovdan o'tkaziladi. Har bir subtask bir nechta testlarni o'z ichiga oladi. Subtaskdan ball olish uchun yechimingiz shu subtaskka tegishli barcha testlarga to'g'ri javob berishi kerak.

|**Subtask**|**Maksimal**<br>**ball**|**Cheklovlar**|
|---|---|---|
|1|8|Daraxt yulduzdir. Ya'ni, yagona tugundan tashqari barcha tugunlar<br>barglardir.|
|2|9|Daraxt - bu chiziq. Ya'ni, ikkita bargdan tashqari barcha tugunlarda<br>aniq ikkita qo'shni tugun mavjud.|
|3|21|Daraxt yulduz bo'lib, unga chiziqlar ulangan. Ya'ni, deyarli barcha<br>tugunlarning bitta yoki ikkita qo'shni tuguni mavjud. Bittagina<br>tugunda ikkitadan ikkitadan ortiq qo'shlar mavjud bo'lishi mumkin.|
|4|36|Har qanday ikkita tugun orasidagi masofa ko'pi bilan10.|
|5|26|Qo'shimcha cheklovlarsiz.|

Dasturingiz to'g'ri ishlagan har subtask uchun siz quyidagi formula bo'yicha ball olasiz:

$$\mathrm{score}=S_g\left(1-0.3\log_{10}\max(K,1)\right).$$

Bu yerda, istalgan subtask uchun, $S_g$ subtaskda olib bo'ladigan maksimal ball va $K$ bu subtaskdagi barcha testlar uchun Enn yuborgan xabarlar orasidan eng uzun xabar uzunligi. **Har bir test guruhi uchun ballingiz eng yaqin butun songa yaxlitlanadi.**

Quyidagi jadvalda $K$ ning bir necha qiymatlari uchun dasturingiz ushbu $K$ bilan barcha subtaskni ishlasa, oladigan ballar soni koʻrsatilgan. Xususan, 100 ball olish uchun yechimingiz har subtaskni $K \le 1$ bilan hal qilishi kerak.

|**K**|**1**|**5**|**10**|**50**|**100**|**500**|**1000**|
|---|---|---|---|---|---|---|---|
|**Baho**|100|79|70|49|39|20|11|

## Testlash vositasi

Yechimingizni sinab ko'rishni osonlashtirish uchun biz siz yuklab olishingiz mumkin bo'lgan sodda testlash vositani taqdim etamiz. Kattisdagi masala sahifasining pastki qismidagi "ilovalar" ga qarang. Vositadan foydalanish ixtiyoriy. Rasmiy Kattis greyderi taqdim etilgan testlash vositasidan farq qilishiga e'tibor bering.

Asbobdan foydalanish uchun “sample1.in” kabi kiritish faylini yarating, unda birinchi qatorda $N$ sonini va keyingi $N - 1$ ta qatorda daraxtni qirralarini, 1-bosqich kirish qismidagi kabi kiriting. Quyidagi namuna keltirilgan:

```
7
```

```
0 1
1 2
2 3
0 4
0 6
1 5
```

Python dasturingiz kodi `solution.py` deb tassavur qilaylik. (Odatda `pypy3 solution.py` buyrug'i bilan ishlatamiz). Vositani ishlatish uchun:

```
python3 testing_tool.py pypy3 solution.py < sample1.in
```

buyrug'ini ishga tushuring. C++ dasturlari uchun avval uni kompilyatsiya qiling (masalan, `g++ -g -O2 -std=gnu++23 - static solution.cpp -o solution.out` bilan) va keyin ishga tushiring:

```
python3 testing_tool.py ./solution.out < sample1.in
```

## Misollar

E'tibor bering, ushbu bo'limdagi namunani soddalashtirish uchun $N = 7$ qilib keltirilgan, shuning uchun ham bu test haqiqiy test bo'la olmaydi. Sizning yechimingiz bu testda ishashga majbur emas. Greyderdagi barcha test holatlarida $N = 1000$ bo'ladi.

Namunada Ennga quyidagi daraxt berilgan. Birinchi bosqichda Enn daraxtni o'qiydi, Katringa jo'natish uchun " `0110` " ikkilik qatorni tanlaydi, shuningdek, o'yin donalarini daraxtdan olib tashlash uchun [ℓ,ℓ,… ℓ0 1 $N - 2$] = [5,3,2,6,4,0] tartibini tanlaydi. Ikkinchi bosqichda Katrin birinchi bosqichda yuborilgan " `0110` " qatorini qabul qilib oladi. Keyin u (1,5) juftligini qabul qiladi va 5-tugunni olib tashlashga qaror qiladi, bu haqiqatan ham barg tugundir. Keyingi harakatidan oldin u (2,3) juftligini qabul qilib oladi va 3 bargini olib tashlaydi va hokazo.

Quyidagi rasmlar namuna testidagi o'zaro muloqotni tasvirlaydi:

|**grader output**|**your output**|
|---|---|
|1 7||
|0 1||
|1 2||
|2 3||
|0 4||
|0 6||
|1 5||
||0110|
||5|
||3|
||2|
||6|
||4|
||0<br>|
|**grader output**|**your output**|
|2 7||
|0110||
|1 5||
||5|
|2 3||
||3|
|1 2||
||2|
|0 6||
||6|
|0 4||
||4|
|0 1||
||0|

---

Manba: [EGOI 2025 rasmiy masalalar arxivi](https://github.com/egoi-org/egoi-2025/tree/e3bb2be66c3a837c57c7f8eac3b5173f40129e13). [Litsenziya: CC BY-SA](https://github.com/egoi-org/egoi-2025/blob/e3bb2be66c3a837c57c7f8eac3b5173f40129e13/day2/laserstrike/problem.yaml).
