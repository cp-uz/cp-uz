> Ushbu shart EGOI 2025 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Lara buyum bozorlarini yaxshi ko'radi. O'tgan shanba kuni Bonnda Rheinaue-Flohmarkt, Germaniyaning eng yirik buyum bozorlaridan biri bo'lib o'tgan edi. Albatta, Lara butun kunni u yerda o'tkazdi, bozorda sayr qildi, narxlarda savdolashdi va har xil qiziqarli narsalarni sotib oldi. U uyga olib kelgan eng qiziq narsa bu dumaloq shakldagi kichik arfa edi. U o'ynashni boshlamoqchi bo'lganida, arfaning torlar bir-biriga parallel emas, balki hammasi har xil joyda ekanligini payqadi.

Aniqroq aytganda, aylana arfa ramkasi atrofida teng taqsimlangan 2 ⋅ $N $ ushlagich (pin) mavjud. $N$ ta torning har birini ikkita pin ushlab turadi va har bir pinga aynan bitta tor biriktirilgan.

Lara arfa haqida ko'p narsa bilmaydi, lekin u torlar bir-biriga parallel bo'lishi kerak deb qattiq shubhalanadi. Bu muammoni hal qilish uchun u arfani torlarini qayta tortishga qaror qiladi. Har bir qadamda u istalgan torning bir uchini pinidan ajratib olishi va uni boshqa pinga qayta ulashi mumkin. Jarayon davomida bir nechta torning uchlari bir xil pinga biriktirilgan holati yuzaga kelishi ruxsat etilgan. Jarayon oxirida, har bir pinga bitta aynan bitta tor ulanishi kerak va $N$ torlarning barchasi bir-biriga parallel bo'lishi kerak.

Quyida parallel torli arfalarga ikkita misol keltirilgan.

Qayta ulashning har bir qadami juda ko'p ish talab qilgani sababli, Lara arfani iloji boricha kamroq qadamlar bilan qayta tortishni istaydi. Laraga minimal sonli qadamlar yordamida torlarni shartlarga qanoatlantiruvchi qilib qayta tortishga yordam bering!

## Kirish

Kirishning birinchi qatorida arfadagi torlarning sonini bildiruvchi bitta $N$ butun soni mavjud. Torlar 0 dan $N - 1$ gacha raqamlangan.

Keyingi $N$ ning har birida ikkita son kiritiladi. Xususan, $i $ -qatorda kiritiladigan $a_i$ va $b_i$ sonlari, $ i $ -tor $a_i$ -pinga va $b_i$ -pinga ulanganligini anglatadi. Pinlar 0 dan 2 ⋅ $ N - 1$ gacha soat strelkasi bo'ylab aylanish tartibida raqamlangan. Har bir pinga aynan bitta tor ulangan.

## Chiqish $K$ butun sonini chiqaring, barcha torlar bir-biriga parallel bo'lishi uchun arfani o'zgartirishga zarur bo'lgan minimal qadamlar soni.

Bundan so'ng, keyingi qatordan boshlab, har birida $p$ , $ s $ va $ e $ uchta butun sonlaridan iborat $ K $ qatorlarini chiqaring. Har yangi qatordagi sonlar sizning yechimingizning navbatdagi bosqichida $ p $ - torning bir uchini $ s $ -pindan ajratib, $ e $ -pinga qayta biriktirilishi kerakligini bildiradi ($0 \le p \le N - 1$ , $0 \le s $ , $ e \le 2$ ⋅ $ N - 1$).

E'tibor bering, agar o'sha paytda $p$ -tor $ s$ -pin biriktirilmagan bo'lsa, qadamlar ketma-ketligi xato hisoblanadi.

Agar bir nechta to'g'ri javoblar mavjud bo'lsa, ulardan birini chop etishingiz mumkin. E'tibor bering, qisman to'g'ri javoblar keyingi bo'limda tushuntirilganidek, qisman ball to'plashi mumkin.

## Chegaralar va baholash

$4 \le N \le 100000$.

- 0 ≤ $a_i$ , $b_i$ ≤2 ⋅ $N - 1$. Barcha $a_i$ va $b_i$ har xil (unique).

Sizning yechimingiz har biri bir necha ballga ega bo'lgan subtasklarda sinovdan o'tkaziladi. Har bir subtask bir nechta testlarni o'z ichiga oladi. Har bir subtask uchun baholar quyidagicha belgilangan:

Agar dasturingiz subtaskdagi barcha testlarga to'g'ri javob bersa, siz 100% ball olasiz. Agar dasturingiz subtaskni to'liq yechmasa, lekin hech bo'lmaganida **subtaskdagi har bir test uchun minimal qadamlar sonini to'g'ri chiqarsa** , siz 50% ball olasiz.

Yechimingiz test guruhi uchun 50% ball to'plagan yoki yo'qligini aniqlashda faqatgina u chiqaradigan $K$ qiymati baholanadi. Dastur shunchaki $K$ qiymatini chiqarishi va tugashi yoki hattoki noto'g'ri harakatlar ketma-ketligini chiqarishi mumkin. E'tibor bering, sizning yechimingiz baribir vaqt chegarasiga sig'ishi va to'g'ri yakunlanishi kerak.

|**Subtasj**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|14|Barcha $i$ uchun,$i $-tor2 ⋅$ i $va2 ⋅$ i$+ 1pinlariga ulangan|
|2|16|Shartlarni qanoatlantirish uchun kerak bo'ladigan minimal qadamlar soni ko'pi<br>bilan2|
|3|12|0va1pinlariga bitta tor biriktirilgan yechim borligi kafolatlangan|
|4|28|$N \le 1000$|
|5|30|Qo'shimcha cheklovlarsiz|

## Misollar

Birinchi namunada beshta torli arfa berilgan. Birinchi qadamda 4-tor 8-pindan ajratiladi va 9 pinga qayta biriktiriladi. Keyingi qadamda 0-tor 5-pindan ajratiladi va 8 pinga qayta biriktiriladi. Oxirgi qadamda 1-tor 9-pindan ajratiladi va 5 pinga qayta biriktiriladi.

Endi har bir pinga aynan bitta tor biriktirilgan va barcha torlar bir-biriga parallel. Keltirilgan qadamlar ketma-ketligi quyidagi rasmda ko'rsatilgan.

Quyidagi rasmda 2, 3 va 4 namunalar uchun arfaning dastlabki holatlari ko'rsatilgan.

Birinchi namuna 4 va 5-subtasklardagi cheklovlarini qanoatlantiradi.

- Ikkinchi namuna 1, 3, 4 va 5-subtasklardagi cheklovlarini qanoatlantiradi. Uchunchi namuna 2, 4 va 5-subtasklardagi cheklovlarni qanoatlantiradi. To'rtinchi namuna 3, 4, va 5-subtasklardagi cheklovlarni qanoatlantiradi.

_Diagramma rasmiy PDFda keltirilgan._

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
5
1 5
4 9
6 3
2 7
0 8
```

**Chiquvchi ma’lumotlar**

```text
3
4 8 9
0 5 8
1 9 5
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
5
0 1
3 2
4 5
6 7
9 8
```

**Chiquvchi ma’lumotlar**

```text
4
1 3 9
4 9 3
2 5 7
3 7 5
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
4
1 4
6 3
5 2
7 0
```

**Chiquvchi ma’lumotlar**

```text
2
0 4 6
1 6 4
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
6
3 9
7 5
10 2
0 6
1 11
8 4
```

**Chiquvchi ma’lumotlar**

```text
6
3 6 1
4 1 2
2 2 3
0 3 4
5 4 5
1 5 6
```

---

Manba: [EGOI 2025 rasmiy masalalar arxivi](https://github.com/egoi-org/egoi-2025/tree/e3bb2be66c3a837c57c7f8eac3b5173f40129e13). [Litsenziya: CC BY-SA](https://github.com/egoi-org/egoi-2025/blob/e3bb2be66c3a837c57c7f8eac3b5173f40129e13/day2/stringproblem/problem.yaml).
