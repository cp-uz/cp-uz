> Ushbu shart EGOI 2026 rasmiy repozitoriysidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Alplardagi katta hudud yaqinda tabiat qo’riqxonasi deb e’lon qilindi. Boshida qo’riqxonada tulkilar yo’q edi. Biroq, himoya qilish choralari to’g’ri bajarilgani tufayli qo’riqxonadagi tulkilar populyatsiyasi kundan-kunga tiklanmoqda. Har kuni qo’riqxonaga bitta yangi tulki qo’shilmoqda. Biolog Simona bu tiklanish jarayonini kuzatyapti va u har qanday vaqtda tulkilar yaratgan turli oilalar soni bilan qiziqmoqda. Simona har bir $i$-tulkining ov qilish hududi borligini, uni $ L_{i} < R_{i}$ bo’lgan [$ L_{i}$, $ R_{i}$] kesma orqali ko’rsatish mumkinligini biladi. Bu hududlar ustma-ust tushishi yoki biri ikkinchisining ichida bo’lishi ham mumkin. O’zining izlanishlari orqali Simona biladiki, agar ikki $ i$ va $ j$ tulkining ov qilish hududlaridan biri ikkinchisining ichida joylashsa ($ L_{i} \le Lj < R_{j} \le Ri $ yoki $ L_{j} \le Li < R_{i} \le Rj$), ular _to’g’ridan-to’g’ri qarindosh_ hisoblanadi. Ikki tulki bitta _oila_ a’zosi hisoblanadi, agarda ular to’g’ridanto’g’ri qarindosh bo’lsa yoki to’g’ridan-to’g’ri qarindosh bo’lgan tulkilar zanjiri orqali bog’langan bo’lsa.[1]

$i $-tulki (0 $\le i\le N-1$) $ i $-kuni kelib shundan so’ng doimiy qo’riqxonada yashaydi, hamda o’zining [$ L_{i}$, $ R_{i}$] ov qilish hududini abadiy saqlab qoladi. Har bir tulkining kelishi oilaviy munosabatlarni o’zgartirishi yoki o’zgartirmasligi mumkin. Har kundan so’ng, Simona $ i$-tulki kelganidan keyin jami nechta tulki oilasi borligini bilmoqchi.

## Kiruvchi ma’lumotlar

Kiruvchi ma’lumotlarning birinchi qatorida bitta butun son $N$ — kunlar soni beriladi. Keyingi $ N$ ta qatorning har birida ikkitadan butun son, $ i $-tulkining ov qilish hududini anglatuvchi $ L_{i}$ va $ R_{i}$ qatnashadi.

## Chiquvchi ma’lumotlar

$N$ ta qator chiqaring. $i $-qator (0 $\le i\le N-1$ uchun) o’zida bitta butun sonni — $i$-tulki kelganidan keyin mavjud bo’lgan tulki oilalari sonini qaytarishi kerak.

## Cheklovlar

- 1 $\le N\le 100000$.

- 0 $\le Li < R_{i} \le 200000$.

- Hech qaysi ($L_{i}$, $ R_{i}$) juftlik bir martadan ortiq uchramaydi.

## Baholash

Dasturingiz qism-masalalarga guruhlangan (subtask) bir nechta testlarda sinovdan o’tkaziladi. Biror qism-masaladan ball olishingiz uchun, sizning dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.

- **Qism-masala 0 [ 0 ball]** : Sample misollar.

- **Qism-masala 1 [10 ball]** : $N\le 100$.

- **Qism-masala 2 [15 ball]** : $N\le 2000$.

- **Qism-masala 3 [16 ball]** : $R_{i}$ $-Li \le 2$.

- **Qism-masala 4 [23 ball]** : $L_{i} < L_{i+1}$.

- **Qism-masala 5 [36 ball]** : Qo’shimcha cheklovlar yo’q.

> 1Rasmiy aytganda, ikkita $a$ va $b$ tulki bir xil oilada bo’ladi, agarda shunday $c_{0}$, $ c_{1}$, $...cm-1$ tulkilar ketma-ketligi mavjud bo’lib, $a = c_{0}$ va $b = c_{m-1}$ bo’lib turib, har bir 0 $\le i < m-1$ uchun $c_{i}$ tulki $c_{i+1}$ ga to’g’ridan-to’g’ri qarindosh bo’lsa.

## Misollar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
4
1 4
3 6
3 4
6 7
```

**Chiquvchi ma’lumotlar**

```text
1
2
1
2
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
6
0 1
1 2
2 3
3 4
4 5
2 4
```

**Chiquvchi ma’lumotlar**

```text
1
2
3
4
5
4
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
5
0 5
1 4
2 7
3 6
4 5
```

**Chiquvchi ma’lumotlar**

```text
1
1
2
2
1
```

## Izoh
Birinchi misol 1, 2 va 5-qism-masalalar cheklovlariga tushadi. Ikkinchi misol 1, 2, 3 va 5-qismmasalalar cheklovlariga tushadi. Uchinchi misol 1, 2, 4 va 5-qism-masalalar cheklovlariga tushadi.

**Birinchi misol.** Birinchi tulki kelganidan keyin bitta oila bo’ladi. Ikkinchi tulki kelganidan keyin ikkita oila bo’ladi, chunki [1, 4] va [3, 6] kesishadi lekin ikkisi ham bir-birining ichiga kirmaydi. Keyin [3, 4] hududli tulki keladi: u ham [1, 4] hamda [3, 6] ichida joylashgan, shuning uchun bu ikkita oila birlashib, oilalar soni 1 ga aylanadi. Oxiri, [6, 7] hududiga ega tulki oldingi hududlarni o’z ichiga ham olmaydi, ularning ichiga ham kirmaydi, shuning uchun u yangi oila tuzadi va oilalar soni 2 ta bo’ladi.

_Diagramma rasmiy PDFda keltirilgan._
