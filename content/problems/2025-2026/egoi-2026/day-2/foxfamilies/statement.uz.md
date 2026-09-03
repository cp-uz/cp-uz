> Ushbu shart EGOI 2026 rasmiy repository’sidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

kundan-kunga tiklanmoqda. Har kuni qo’riqxonaga bitta yangi tulki qo’shilmoqda. Biolog Simona
bu tiklanish jarayonini kuzatyapti va u har qanday vaqtda tulkilar yaratgan turli oilalar soni bilan
qiziqmoqda. Simona har bir 𝑖-tulkining ov qilish hududi borligini, uni 𝐿𝑖 < 𝑅𝑖 bo’lgan [𝐿𝑖,𝑅𝑖] kesma
orqali ko’rsatish mumkinligini biladi. Bu hududlar ustma-ust tushishi yoki biri ikkinchisining ichida
bo’lishi ham mumkin. O’zining izlanishlari orqali Simona biladiki, agar ikki 𝑖 va 𝑗 tulkining ov qilish
hududlaridan biri ikkinchisining ichida joylashsa (𝐿𝑖 ≤ 𝐿𝑗 < 𝑅𝑗 ≤ 𝑅𝑖 yoki 𝐿𝑗 ≤ 𝐿𝑖 < 𝑅𝑖 ≤ 𝑅𝑗), ular
to’g’ridan-to’g’ri qarindosh hisoblanadi. Ikki tulki bitta oila a’zosi hisoblanadi, agarda ular to’g’ridan-
to’g’ri qarindosh bo’lsa yoki to’g’ridan-to’g’ri qarindosh bo’lgan tulkilar zanjiri orqali bog’langan
bo’lsa.1
𝑖-tulki (0 ≤ 𝑖 ≤ 𝑁 −1) 𝑖-kuni kelib shundan so’ng doimiy qo’riqxonada yashaydi, hamda o’zining
[𝐿𝑖,𝑅𝑖] ov qilish hududini abadiy saqlab qoladi. Har bir tulkining kelishi oilaviy munosabatlarni
o’zgartirishi yoki o’zgartirmasligi mumkin. Har kundan so’ng, Simona 𝑖-tulki kelganidan keyin jami
nechta tulki oilasi borligini bilmoqchi.

## Kiruvchi ma’lumotlar

Kiruvchi ma’lumotlarning birinchi qatorida bitta butun son 𝑁 — kunlar soni beriladi. Keyingi 𝑁
ta qatorning har birida ikkitadan butun son, 𝑖-tulkining ov qilish hududini anglatuvchi 𝐿𝑖 va 𝑅𝑖
qatnashadi.

## Chiquvchi ma’lumotlar

𝑁 ta qator chiqaring. 𝑖-qator (0 ≤ 𝑖 ≤ 𝑁 −1 uchun) o’zida bitta butun sonni — 𝑖-tulki kelganidan
keyin mavjud bo’lgan tulki oilalari sonini qaytarishi kerak.
Cheklovlar

- 1 ≤ 𝑁 ≤ 100000.
- 0 ≤ 𝐿𝑖 < 𝑅𝑖 ≤ 200000.
- Hech qaysi (𝐿𝑖,𝑅𝑖) juftlik bir martadan ortiq uchramaydi.

## Baholash

Dasturingiz qism-masalalarga guruhlangan (subtask) bir nechta testlarda sinovdan o’tkaziladi. Biror
qism-masaladan ball olishingiz uchun, sizning dasturingiz undagi barcha testlarda to’g’ri ishlashi
kerak.

- Qism-masala 0 [ 0 ball]: Sample misollar.
- Qism-masala 1 [10 ball]: 𝑁 ≤ 100.
- Qism-masala 2 [15 ball]: 𝑁 ≤ 2000.
- Qism-masala 3 [16 ball]: 𝑅𝑖 −𝐿𝑖 ≤ 2.
- Qism-masala 4 [23 ball]: 𝐿𝑖 < 𝐿𝑖+1.
- Qism-masala 5 [36 ball]: Qo’shimcha cheklovlar yo’q.
1Rasmiy aytganda, ikkita 𝑎 va 𝑏 tulki bir xil oilada bo’ladi, agarda shunday 𝑐0,𝑐1,…𝑐𝑚−1 tulkilar ketma-ketligi mavjud
bo’lib, 𝑎 = 𝑐0 va 𝑏 = 𝑐𝑚−1 bo’lib turib, har bir 0 ≤ 𝑖 < 𝑚−1 uchun 𝑐𝑖 tulki 𝑐𝑖+1 ga to’g’ridan-to’g’ri qarindosh bo’lsa.
Misollar
stdin stdout
4
1 4
3 6
3 4
6 7
1
2
1
2
6
0 1
1 2
2 3
3 4
4 5
2 4
1
2
3
4
5
4
5
0 5
1 4
2 7
3 6
4 5
1
1
2
2
1
Izoh
Birinchi misol 1, 2 va 5-qism-masalalar cheklovlariga tushadi. Ikkinchi misol 1, 2, 3 va 5-qism-
masalalar cheklovlariga tushadi. Uchinchi misol 1, 2, 4 va 5-qism-masalalar cheklovlariga tushadi.
Birinchi misol. Birinchi tulki kelganidan keyin bitta oila bo’ladi. Ikkinchi tulki kelganidan keyin
ikkita oila bo’ladi, chunki [1,4] va [3,6] kesishadi lekin ikkisi ham bir-birining ichiga kirmaydi. Keyin
[3,4] hududli tulki keladi: u ham [1,4] hamda [3,6] ichida joylashgan, shuning uchun bu ikkita oila
birlashib, oilalar soni 1 ga aylanadi. Oxiri, [6,7] hududiga ega tulki oldingi hududlarni o’z ichiga ham
olmaydi, ularning ichiga ham kirmaydi, shuning uchun u yangi oila tuzadi va oilalar soni 2 ta bo’ladi.
𝑖 = 0
1 3 4 6 7
0 [1, 4]
𝑖 = 1
1 3 4 6 7
0 [1, 4]
1 [3, 6]
𝑖 = 2
1 3 4 6 7
0 [1, 4]
1 [3, 6]
2 [3, 4]
𝑖 = 3
1 3 4 6 7
0 [1, 4]
1 [3, 6]
2 [3, 4]
3 [6, 7]
