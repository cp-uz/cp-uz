> Ushbu shart IOI 2024 saralash II bosqichining O‘zbekiston delegatsiyasi tekshirgan original o‘zbekcha PDF asosida berildi. Formulalar, jadvallar va diagrammalarning aniq ko‘rinishi uchun PDFdan foydalaning.

# Kartalar

Bu interaktiv masala!

Gulnoza o’ylab topgan yangi Onu o’yinida N xil turdagi karta bor, bunda ularga 1dan Ngacha
sonlar yozilgan. O’yinda jami 2N dona karta bor va bunda har bir turdagi kartadan aynan 2ta
nusxada bor. Bir xil son yozilgan kartalar juftliklar deb ataladi.

Yahyo barcha kartalarni bir qatorga orqa tomoni bilan qo’yib chiqdi. Yahyoga kartalarda qanday

son yozilgani ko’rinadi, Gulnozaga esa yo’q. Gulnozaning vazifasi Yahyoga so’rovlar berish orqali

barcha juftliklarni topib chiqish. Buning uchun Gulnoza bitta so’rovda kartalar to’plamini tanlab

oladi, Yahyo esa shu to’plamda necha xil turdagi kartalar borligini aytadi.

Gulnozaga yordam bering!

Kodlash tartibi

Dastur boshida sizga N soni beriladi, ya’ni turli xil kartalar soni. So’rov berish uchun:

? k a[1] a[2] ... a[k]

formatida ekranga chiqaring. Bunda k – tanlangan kartalar to’plamidagi elementlar soni, a[i] esa
kartalar indeksi. Indekslar o’sish tartibida chiqarlishi lozim, ya’ni 1 ≤a[1] < a[2] < ... < a[k] ≤

2N

So’ngra kiruvchi ma’lumotlardan d sonini qabul qiling, d – to’plamdagi har xil kartalar soni.

Javobni topganingizdan so’ng uni chiqarish uchun:

! x[1] y[1] x[2] y[2] ... x[N] y[N]

formatida chiqaring, bunda x[i] va y[i] kartalar bir xil turda bo’lishi kerak.
## Namuna
Masalan, N = 4 va Yahyo kartalarni [2, 3, 2, 1, 4, 4, 3, 1] ko’rinishida joylashtirgan bo’lsin. Ya’ni bir
xil son yozilgan juftliklar bu (4, 8), (1, 3), (2, 7) va (5, 6).

Birinchi so’rovda Gulnoza [1, 2, 3] indeksdagi kartalar haqida so’rov beradi. Bu kartalarda
[2, 3, 2] sonlari yozilgan. Jami 2 xil turdagi kartalar borligi uchun Yahyo 2 deb javob beradi.

Agar Gulnoza [2, 4, 6, 7] deb so’rov bersa, Yahyo 3 deb javob beradi, chunki [3, 1, 4, 3] sonlari orasida
3 xil qiymat bor.

Shundan so’ng Gulnoza [2, 7, 5, 6, 1, 3, 8, 4] ko’rinishida javob beradi. Ya’ni 2 va 7-kartalarda bir xil
son yozilgan, 5 va 6-kartalarda bir xil son yozilgan va h.k.

E’tibor bering, Gulnoza [7, 2, 5, 6, 1, 3, 8, 4] yoki [8, 4, 3, 1, 2, 7, 6, 5] ko’rinishida javob berganida
ham uning javobi to’g’ri hisoblanar edi.

                        INPUT  OUTPUT

                                ? 3 1 2 3

                                ? 4 2 4 6 7

                                ! 2 7 5 6 1 3 8 4
## Chegaralar
- 1 ≤N ≤256
- Jami so’rovlar soni 20 000dan oshmasligi zarur.
## Subtasks
  1. (9 ball) N ≤2
  2. (19 ball) N ≤100
  3. (7 ball) Ko’pi bilan bitta juftlik yonma-yon joylashmagan

  4. (65 ball) Qo’shimcha chegaralarsiz.

Shuningdek, 4-subtaskda qism ball olishingiz mumkin. Aytaylik, 4-subtask testlari orasida eng
ko’p ishlatgan so’rovlaringiz soni q bo’lsin. U holda, quyidagicha ball olasiz:

                                  Shart              Ball

                                20 000 < q            0
                            10 000 < q ≤20 000       15

                             2300 < q ≤10 000   15 + 50 ·
                                                                 q
                                     q ≤2300            65
