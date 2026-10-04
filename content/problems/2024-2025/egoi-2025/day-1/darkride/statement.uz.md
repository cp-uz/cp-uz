> Ushbu shart EGOI 2025 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Erika yaqinda Bonn yaqinidagi Phantasialand ko'ngilochar bog'ida yozgi ishga joylashdi. U qorong'u sayohat o'tadigan xonalardagi chiroqlarni boshqarish uchun yollangan.

Sayohat 0 dan $N - 1$ gacha raqamlangan $N$ xonalaridan oʻtadi. Xonalar 0-indeksdagi xonadan boshlanib, $N - 1$-indeksdagi xonagacha, o'sish tartibida joylashgan. Har bir xonadagi chiroqni jami $ N$ ta (0 dan $ N - 1$ gacha raqamlangan) o'tkazgichdan aynan bittasi orqali yoqib o'chirsa, ya'ni boshqarsa bo'ladi. $ s $ -indeksdagi o'tkazgich (bu yerda $0 \le s < N$ ) _ps_ -xonasidagi yorugʻlikni boshqaradi.

Erikaning boshlig'i undan birinchi va oxirgi xonalarda chiroqlarni yoqib, qolganlarini o'chirishni so'radi. Oson tuyuladi, to'g'rimi? Boshqa so'zlar bilan aytganda, u faqatgina shunday ikkita $A$ va $B$ kalitlarini yoqishi kerakki, _pA_ = 0 va _pB_ = $N - 1$ (yoki _pB_ = 0 va _pA_ = $ N - 1$) bo'lsin. Afsuski, Erikaning boshlig'i boshqaruv elementlarini tavsiflaganida to'liq e'tibor bermadi va **endi u** $ p$ **massivini eslay olmaydi, ya'ni qaysi o'tkazgich qaysi xonani boshqarishini bilmaydi** .

Erika buni boshlig'igi sezishidan oldin qilishi kerak. Har sayohatning boshida Erika barcha chiroqlarni o'chiradi. Keyin u ba'zi xonadagi chiroqlarni, ya'ni ba'zi o'tkazgichlarni yoqishi mumkin. Harakat xonadan xonaga o'tayotganda, har safar yoritilgan xonadan yoritilmagan xonaga yoki aksincha, yoritilmagan xonadan yoritilgan xonaga o'tganida, Erika yo'lovchilarning hayajondan qichqirganini eshitadi. Harakat tezligi har xil bo'lishi mumkin, shuning uchun Erika qaysi xonalar yoqilganligini to'g'ridan-to'g'ri aniqlay olmaydi, lekin hech bo'lmaganda qichqiriqlar sonini eshitadi. Ya'ni, u yo'lovchilar yoritilgan xonadan yoritilmagan xonaga yoki yoritilmagan xonadan yoritilgan xonaga necha marta o'tishini bilib oladi.

Siz Erikaga boshlig'i sezishidan oldin birinchi va oxirgi xonalardagi chiroqlarni boshqaradigan o'tkazgichlar qayerda joylashganligini aniqlashga yordam bera olasizmi? Siz ko'pi bilan 30 ta sayohatlardan foydalanishingiz mumkin.

## Muloqot

Bu interaktiv masala.

- Sizning dasturingiz bitta butun son: $N$ - xonalar sonini o'qishdan boshlanishi kerak.

- Keyin dasturingiz greyder bilan o'zaro muloqotda bo'lishi kerak. Sayohatni boshlash uchun yagona qatorda oldin “ `?` ” - savol belgisini, so'ngra $N$ uzunlikdagi binar satrni - qaysi o'tkazgichlarni ishlatishini, `0` (o'chirilgan) va `1` (yoqilgan) dan satrni chop etishingiz kerak. Keyin dasturingiz bitta butun sonni - ℓ ( 0 ≤ℓ< $N$ ) ni o'qishi kerak. Bu, oxirgi sayohat uchun Erika yo'lovchilarning qichqirig'ini necha marta eshitishini anglatadi.

- Javob bermoqchi bo'lganingizda, yagona qatorda oldin “ `!` ” - undov belgisini, keyin ikkita butun $A$ va $B$ ( $0 \le A $ , $ B < N$ ) sonlari joylashgan qatorni chop etishingiz kerak. Sizning javobingiz qabul qilinishi uchun bu sonlar, istalgan tartibda, birinchi va oxirigi xonadagi chiroqlarni boshqaruvchi o'tkazgichlarning indekslari bo'lishi kerak. Bundan so'ng dasturingiz ishlashni to'xtatishi kerak.

Greyder adaptiv emas, ya'ni $p$ massivi muloqot boshlanishidan oldin ma'lum va o'zgaritilmaydi.

Har bir sayohatni boshlagandan so'ng, buferni tozalashni unutmang, aks holda dasturingiz Time Limit Exceeded hukmini olishi mumkin. Python-da, satrlarni o'qish uchun `input()` foydalansangiz, bu avtomatik ravishda sodir bo'ladi. C++ tilida `cout << endl;` yangi qatorni chop etishdan tashqari, chop etgandan so'ng buferni tozalaydi. Bundan tashqari printf dan foydalansangiz, `fflush(stdout)` dan foydalanishni unutmang.

## Chegaralar va baholash

- $3\le N\le30000$.

- Ko‘pi bilan 30 ta sayohat amalga oshirishingiz mumkin; yakuniy javob sayohat hisoblanmaydi. Limitdan oshilsa, `Wrong Answer` beriladi.


Sizning yechimingiz har biri bir necha ballga ega bo'lgan subtasklarda sinovdan o'tkaziladi. Har bir subtask bir nechta testlarni o'z ichiga oladi. Subtaskdan ball olish uchun yechimingiz shu subtaskka tegishli barcha testlarga to'g'ri javob berishi kerak.

|**Subtask**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|9|$N = 3$|
|2|15|$N \le 30$|
|3|17|$p = 0$, ya'ni0-indeksdagi o'tkazgich0-xonani boshqaradi<br>0|
|4|16|$N$ juft; bir chekka xona o‘tkazgichi $0\le A<N/2$, ikkinchisi $N/2\le B<N$ oralig‘ida.|
|5|14|$N \le 1000$|
|6|29|Qo'shimcha cheklovlarsiz|

## Testlash vositasi

Yechimingizni sinab ko'rishni osonlashtirish uchun biz siz yuklab olishingiz mumkin bo'lgan sodda testlash vositani taqdim etamiz. Kattisdagi masala sahifasining pastki qismidagi "ilovalar" ga qarang. Vositadan foydalanish ixtiyoriy. Rasmiy Kattis greyderi taqdim etilgan testlash vositasidan farq qilishiga e'tibor bering.

Vositadan foydalanish uchun “sample1.in” kabi kiritish faylini yarating, u birinchi qatorda $N$ soni bilan boshlanib, keyingi qatorda yashirin o'tkazgichlarni joylashuvini koʻrsatuvchi $p$ 0, $ p$ 1,..., _pN_ −1 massivi bilan tugashi kerak. Masalan:

```
5
2 1 0 3 4
```

Python dasturingiz kodi `solution.py` deb tassavur qilaylik. (Odatda `pypy3 solution.py` buyrug'i bilan ishlatamiz), Vositani ishlatish uchun:

```
python3 testing_tool.py pypy3 solution.py < sample1.in
```

buyrug'ini ishga tushuring.

C++ dasturlari uchun avval uni kompilyatsiya qiling (masalan, `g++ -g -O2 -std=gnu++23 - static solution.cpp -o solution.out` bilan) va keyin ishga tushiring:

```
python3 testing_tool.py ./solution.out < sample1.in
```

## Misollar

Birinchi namunada yashirin o'tkazgichlar massivi [ $p $ 0, $ p $ 1, $ p $ 2, $ p $ 3, $ p $ 4] = [2,1,0,3,4] . Bu 2, 5 va 6 subtaskdagi cheklovlarini qondiradi. Birinchidan, dastur $ N = 5$ butun sonini o'qiydi. Keyin dastur 2 ta: 4 va 0 o'tkazgichlarni yoqgan sayohatni boshlaydi. Bu o'tkazgichlar quyidagi xonalardagi chiroqlarni yoqadi $ p$ 4 = 4 va $ p$ 0 = 2; quyidagi rasmga qarang. Erika, sayohat natijasida, 3 qichqiriqni eshitadi (rasmda ko'rsatkich/strelkalar bilan belgilangan): birinchisi bu harakat yoritilmagan 1-xonadan yoritilgan 2-xonaga o'tganda; ikkinchisi yoritilgan 2-xonadan yoritilmagan 3-xonaga o'tgandan; uchinchidan, yoritilmagan 3-xonadan yoritilgan 4-xonaga o'tganda. Keyin dastur $ p$ 0, $ p $ 2 va $ p $ 3 xonalari yonib turadigan yana bitta sayohatni so'raydi va Erika 3 qichqiriqni eshitadi. Nihoyat, dastur $ A = 2$ va $ B = 4$ bilan javob beradi, bu haqiqatan ham to'g'ri, chunki ular birinchi va oxirgi xonalarni nazorat qiladi ( $ p $ 2 = 0 va $ p $ 4 = 4 . $ A = 4$ va $ B = 2$ ham toʻgʻri javob sifatida qabul qilinadi.

Ikkinchi namunada yashirin o'tkazgichlar massivi [ $p $ 0, $ p $ 1, $ p $ 2] = [2,0,1] . Bu 1, 2, 5 va 6 subtasklardagi cheklovlarini qondiradi. Dastur 3 ta o'tkazgichlar yoqilgan sayohat boshlashni so'raydi. Bu barcha xonalar yoritilganligini bildirganligi sababli, Erika hech qanday qichqiriqni eshitmaydi. Ikkinchi sayohatda 1 va 0 o'tkazgichlari yoqiladi, $ p $ 1 = 0 va $ p$ 0 = 2 xonalarni yoritadi, 1- xona esa yoritilmaydi. Erika ikkita qichqiriqni eshitadi: 0-xonadan (yoritilgan) 1-xonaga (yoritilmagan) va 1-xonadan (yoritilmagan) 2-xonaga (yoritilgan) o'tganda. Yakuniy sayohatda hech qanday kalit yoqilmaydi, ya'ni uchta xonaning hech qaysisi yoritilmagan va Erika yana hech qanday qichqiriqni eshitmaydi. Keyin dastur 1 va 0 kalitlari bilan javob beradi, ular haqiqatan ham birinchi va oxirgi xonalarni boshqaradi. Ikkala “ `! 0 1` ” va “ `! 1 0` ” javoblar qabul qilinadi.

Uchinchi namunada yashirin o'tkazgichlar massivi [ $p $ 0, $ p $ 1, $ p $ 2, $ p$ 3] = [0,1,2,3] . Bu 2, 3, 4, 5 va 6 subtaskdagi cheklovlarini qanoatlantiradi.

### Birinchi namuna

_Diagramma rasmiy PDFda keltirilgan._

### Ikkinchi namuna

_Diagramma rasmiy PDFda keltirilgan._

### Uchinchi namuna

_Diagramma rasmiy PDFda keltirilgan._

---

Manba: [EGOI 2025 rasmiy masalalar arxivi](https://github.com/egoi-org/egoi-2025/tree/e3bb2be66c3a837c57c7f8eac3b5173f40129e13). [Litsenziya: CC BY-SA](https://github.com/egoi-org/egoi-2025/blob/e3bb2be66c3a837c57c7f8eac3b5173f40129e13/day1/darkride/problem.yaml).
