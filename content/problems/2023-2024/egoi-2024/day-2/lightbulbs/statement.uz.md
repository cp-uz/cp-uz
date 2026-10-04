> Ushbu shart EGOI 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


1891-yil Eindhovenda o'zining chiroq fabrikasiga asos solgandan so'ng, Frederik Filips ajoyib ixtiro yaratdi: gorizontal yoki vertikal o'q bo'yicha cheksiz uzoqlikni yoritadigan chiroqlar. O'zining yangi ixtirosi bilan u zamonaviy uylarning ichki dizaynida revolyutsiya qilmoqchi.

U chiroqlarni o'zining o'g'li Jerard bilan birgalikda o'rnatmoqchi. Ular $N$ × $ N $ o'lchamli xonaga jami $N^2$ ta chiroq o'rnatishadi. Elektrni asrash uchun ular butun xonani iloji boricha kamroq chiroqlar yordamida yoritmoqchi. Har bir chiroq yoki gorizontal (o'zining qatoridagi barcha kataklarni yoritadi), yoki vertikal (o'zining ustunidagi barcha kataklarni yoritadi).

Afsuski, ular chiroqlarni o'rnatayotganda e'tiborsizlik qilishdi va qaysi chiroq gorizontal yoki vertikal ekanini eslay olishmaydi. Endilikda ular eksperimentlar o'tqazish orqali butun xonani yoritish uchun qaysi chiroqlarni yoqish kerakligini bilishmoqchi. Jerard chiroqlar o'rnatilgan xonada turadi, Frederik esa boshqa xonada chiroqlarni boshqaradi.

Har bir eksperimentda, Frederik har bir chiroqni yoqadi yoki o'chiradi, Jerard esa jami nechta katak yoritilganini sanaydi; ikkita yoki undan ko'p chiroq orqali yoritilgan kataklar faqat bir marta hisobga olinadi. Eksperimentlar davomida nechta chiroqlar yoritilgani ularni qiziqtirmaydi, lekin ular shoshilayotgani uchun iloji boricha kamroq eksperiment o'tqazishmoqchi.

Ularga butun xonani yorituvchi, va bunda iloji boricha kamroq chiroq ishlatuvchi joylashuvni aniqlashga yordam bering. Ular ko'pi bilan 2 000ta eksperiment o'tqazishlari mumkin. Ammo,

ko'proq ball olishingiz uchun ular kamroq eksperiment o'tqazishlari kerak.

## Dasturlash

Bu interaktiv masala.

- Dasturingiz $N$ butun sonni qabul qilish bilan boshlanishi kerak, bu xonaning eni va bo'yini beradi.

- Keyin, dasturingiz greyder bilan muloqot qilishi kerak. Eksperiment o'tqazish uchun, avval alohida qatorda so'roq belgisini chiqaring “ ? ”. Keyingi $N$ ta qatorda, 0 va 1 lardan tashkil $N$ × $ N $ jadvalni chiqaring, bu qaysi chiroqlar o'chiq (0) yoki qaysi chiroqlar yoniq (1) bo'lishi kerakligini bildiradi. So'ngra, keyingi qatorda yagona butun sonni o'qing ℓ (0 ≤ℓ≤ $ N$ 2), tanlangan chiroqlar yoqilganida nechta katak yoritilganini bildiradi.

- Javob bermoqchi bo'lsangiz, avval alohida qatorda undov belgisini chiqaring “ ! ”, keyin esa $N$ ta qatorda jadvalni yuqoridagi formatda chiqaring. Javobingiz qabul qilinishi uchun, **chiroqlar butun jadvalni yoritishi va ishlatilgan chiroqlar soni iloji boricha kam bo'lishi kerak** .

Shundan so'ng, dasturdan chiqishingiz kerak (exit).

Greyder adaptiv emas, ya'ni barcha chiroqlar holati muloqot boshlanishidan oldin aniqlangan va o'zgarmaydi.

Yodingizda tuting, har bir eksperimentni o'tqazgandan so'ng ma'lumotlar oqimini (standard output) bo'shatishni (flush) unutmang; aks holda yechimingiz “Time Limit Exceeded” verdiktini olishi mumkin. Pythonda qatorlarni o'qish uchun input() ishlatsangiz bu ish avtomatik amalga oshadi. C++da, cout << endl; yangi qator chiqazish bilan birga oqimni bo'shatadi; agar  printf ishlatsangiz,  fflush(stdout) ishlating.

## Cheklovlar va baholash

- $3 \le N \le 100$.

- Siz ko'pi bilan 2 000 ta eksperiment o'tqaza olasiz (javobni chiqarish eksperiment hisoblanmaydi). Agar bu chegaradan oshib ketsangiz “Wrong Answer” verdiktini olasiz.

Yechimingiz bir-nechta test guruhlarida tekshiriladi. Har bir test guruhi uchun qanchadir ball beriladi. Barcha test guruhlarida bir-nechta testlar bor. Test guruhining ballini olish uchun yechimingiz ushbu guruhdagi barcha testlarda to'g'ri ishlashi kerak.

|**Guruh**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|11|$N = 3$|
|2|11|$N \le 10$|
|3|78 gacha|Qo'shimcha cheklovlarsiz|

So'nggi testlar guruhida, sizning **ball o'tqazilgan eksperimentlar soniga bog'liq** va quyidagi formula orqali hisoblanadi:

$$\mathrm{score}=\begin{cases}(2000-Q)\cdot29/900,&200\le Q\le2000,\\58+(200-Q)\cdot4/23,&85\le Q\le200,\\78,&Q\le85.\end{cases}$$

bu yerda $Q$ istalgan testda o'tkazilgan maksimal eksperimentlar soni. Ball eng yaqin butun songacha yaxlitlanadi.

Quyidagi diagramma barcha test guruhlarini to'g'ri ishlagan taqdiringizda oladigan ballingizni $Q$ ning funksiyasi orqali ifodalaydi. Umuman olganda, 100 ball olish uchun barcha testlarni ko'pi bilan 85ta eksperiment orqali ishlashingiz kerak.

## Tekshirish qurilmasi

Yechimingizni tekshirishni osonlashtirish uchun, biz sizga sodda qurilmani taqdim etamiz. Uni masalaning Kattis sahifasining pastki qismidagi "attachments" bo'limidan ko'chirib olishingiz mumkin. Bu qurilmani ishlatish ixtiyoriy. E'tibor bering, Kattisning haqiqiy tekshiruvchi greyderi ushbu qurilmadan farq qiladi.

Qurilmani ishlatish uchun, ma'lumotlarni kiritish faylini (input file) yarating, masalan “sample1.in”. Fayl $N$ soni bilan boshlanishi va keyingi $N$ ta qatorda jadval berilishi kerak. Bu yerda V vertikal yorituvchi chiroqni,  H gorizontal yorituvchi chiroqni bildiradi. Masalan:

5 VVHVH HVHHV VHHVV HHHVH HHVVV

Python dasturlari uchun, aytaylik  solution.py (odatda  pypy3 solution.py buyruq orqali ishga tushirilad):

python3 testing_tool.py pypy3 solution.py < sample1.in

C++ dasturlari uchun, avval uni kompilyatsiya qiling: (misol uchun  g++ -g -O2 -std=gnu++20 - static solution.cpp -o solution.out buyruq orqali) va so'ngra:

python3 testing_tool.py ./solution.out < sample1.in

## Namunalar

Namunaviy muloqotda, dastur xona o'lchamini, ya'ni $N = 5$ ni o'qish bilan boshlanadi. Quyidagi rasmda yashirin jadval berilgan (buni dastur bilmaydi) va mumkin bo'lgan javoblardan biri berilgan (5ta chiroq ishlatuvchi). Rasmda bo'yalgan chiroqlar ular yoqilganini va to'qroq kataklar yoritilganini bildiradi.

Dastur rasmda ko'rsatilgandek ikkita eksperiment amalga oshiradi. Birinchi eksperimentda, yuqori chap burchakdagi ikkita vertikal chiroq orqali jami 10ta katak yoritiladi. Ikkinchi eksperimentda jami 13ta katak yoritiladi. Nihoyat, dastur javobni chiqaradi (yuqorida rasmdagi kabi) va tugaydi.

_Diagramma rasmiy PDFda keltirilgan._

---

Manba: [EGOI 2024 rasmiy masalalar arxivi](https://github.com/zehnsechs/egoi-2024-testdata/tree/47fefa0ff64124f7fd8421aa12b77ad689a0fb29). [Litsenziya: CC BY-SA](https://github.com/zehnsechs/egoi-2024-testdata/blob/47fefa0ff64124f7fd8421aa12b77ad689a0fb29/day2/lightbulbs/problem.yaml).
