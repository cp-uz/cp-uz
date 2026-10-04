> Ushbu shart EGOI 2025 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Siz yashirin tashlandiq uyning bir xonasida, Bonn shahrining juda qattiq saqlanadigan sirlarni yashiruvchi qadimiy kitobni topdingiz. Shahar tubida $M$ ta suv kanallari bilan tutashgan $N$ ta g'orlar tizimi mavjud. Har bir suv kanalida bir yo'nalishli sehrli oqim mavjud bo'lib, u qayiqni kanal bo'ylab tezda olib o'tishi mumkin.

G'or tizimi hozirda $N - 1$-g'orda joylashgan bitta chiqishga ega.

Siz kashfiyotingizdan juda xursandsiz va g'orlarni o'rganishni istaysiz! Biroq, g'or tizimida chaqirilmagan mehmonlarning ustidan kulishni yaxshi ko'radigan troll yashaydi.

Troll cheklangan sehrli kuchga ega - u sizning tashrifingiz paytida, sizni chiqishga borishingizni qiyinlashtirish maqsadida **ko'pi bilan bir marta** sizning g'or tizimini o'zgartirishi mumkin: .

G'orga tashrifingiz bosqichlar ketma-ketligidan iborat bo'ladi. Har bir bosqichda quyidagilar yuz beradi:

1. Birinchidan, troll o'zining sehrli kuchidan foydalanish yoki foydalanmasligini tanlashi kerak. Agar foydalanadigan bo'lsa qilsa, u quyidagilarni bajaradi: har bir kanaldagi sehrli oqim o'z yo'nalishini teskarisiga o'zgartiradi: $a $ → $ b $ darhol $ b $ → $ a$ ga o'zgaradi;

   - $N - 1$-g'ordagi chiqish yopiladi; va

   - 0-g'orda chiqish ochiladi.

2. Keyin, siz hozirgi g'oringizdan oqib chiqadigan sehrli oqimni tanlaysiz va boshqa g'orga sayohat qilish uchun qayig'ingizdan foydalanasiz. Soddaroq bo'lishi uchun, qayiqdan foydalanishni "harakat" deb ataymiz.

Bundan tashqari, siz chiqish joylashgan g'orda bo'lib qolsangiz, **darhol** g'orlar tizimini tark etish uchun undan foydalanasiz. E'tibor bering, agar siz 0-g'orda bo'lsangiz va troll o'zining sehrli kuchidan foydalanishga qaror qilsa ham, shu hodisa sodir bo'ladi.

Maqsadingiz EGOI yopilish marosimiga yetib borish uchun imkon qadar tezroq g'orlar tizimini tark etishdir. Trollning maqsadi mutlaqo teskari; u sizni o'zining g'orlarida iloji boricha uzoq vaqt ushlab

turishni xohlaydi.

Troll har doim sizning joylashuvingizni biladi va u o'zining sehrli kuchidan optimal tarzda, ya'ni maqsadiga erishish uchun eng qulay vaqtda foydalanishni tanlaydi.

Har bir $c$ ( $0 \le c \le N - 2$ ) g'ori uchun alohida, $ c $ -g'orda sayohatingizni boshlangan holatni tassavur qiling. Holatlarning har biri uchun troll qachon o'z kuchidan qachon foydalanishni tanlashidan qat'i nazar, $ c$ g'oridan aniq chiqishingiz uchun kerak bo'ladigan **minimal bosqichlar sonini aniqlang** .

Troll sehrini ishlatishidan oldin, 0-g'ordan istalgan boshqa g'orga va istalgan g'ordan $N - 1$-g'orga borish mumkinligi kafolatlanadi.

## Kirish

Kirishning birinchi qatori ikkita $N$ va $M$ butun sonlarini o'z ichiga oladi. Bu yerda $N$ g'orlar soni va $M$ suv kanallari soni.

Keyingi $M$ qatorning har biri ikkitadan $a_i$ va $b_i$ butun sonlari kiritiladi. Bu sonlar, hozir $a_i$ -g'ordan $b_i$ -g'orga olib boradigan kanal mavjudligini anglatadi. G'orni o'zini o'zi bilan bog'laydigan kanal yo'q. Har bir g'or juftligi uchun har bir yo'nalishda ko'pi bilan bitta kanal mavjud.

## Chiqish $N - 1$ butun sondan iborat yagona qatorni chiqaring, bu yerda $i$ -butun son, $0 \le i \le N - 2$, $ i$ - g'ordan boshlagan holatingizda, chiqishga aniq yetib borishga kerak bo'ladigan minimal qadamlar sonini anglatadi.

E'tibor bering, siz $N - 1$-g'or uchun javobni chiqarmaysiz (chunki bu g'ordan darhol chiqib ketishingiz mumkin).

## Chegaralar va baholash

- $2 \le N \le 200000$.

- $1 \le M \le 500000$.

- 0 ≤ $a_i$ , $b_i$ ≤ $N - 1$ va $a_i$ ≠ $b_i$ .

- Oqimlarni teskari qilishdan oldin, 0-g'ordan boshqa barcha g'orga, barcha g'ordan $N - 1$ g'orga borib bo'ladi.

Sizning yechimingiz har biri bir necha ballga ega bo'lgan subtasklarda sinovdan o'tkaziladi. Har bir subtask bir nechta testlarni o'z ichiga oladi. Subtaskdan ball olish uchun yechimingiz shu subtaskka tegishli barcha testlarga to'g'ri javob berishi kerak.

|**Subtask**|**Ball**|**Cheklovlar**|
|---|---|---|
|1|12|Barcha $i$ uchun $M = N - 1$,$ a = i $va$ b = i $+ 1. Boshqa so'zlar bilan<br>aytganda, g'orlar sistemasi bitta0 →1 →2 →… →$ N - 1$yo'lni hozil qiladi<br>$ i $<br>$ i$|
|2|15|Barcha0 ≤$i \le N - 2$ uchun,$i $-g'ordan$ N - 1$-g'orga to'g'ridan to'g'ri olib<br>boradidan kanal mavjud. Boshqa kanallar ham bo'lishi mumkinligini<br>unutmang.|
|3|20|$N $,$ M \le 2000$|
|4|29|Istalgan g'orni tark etgandan so'ng, unga qaytib kelishning iloji yo'q (kanallar<br>yo'nalishi<br>teskari<br>bo'lishigacha).<br>Boshqacha<br>qilib<br>aytganda,<br>kanallar<br>yo'naltirilgan asiklik grafikni hosil qiladi.|
|5|24|Qo'shimcha cheklovlarsiz|

## Misollar

Birinchi misol uchun 1-g'orda boshlagan holatingizni ko'rib chiqaylik. Yoʻnalishni teskari oʻzgartirish qachon sodir bo'lishini bilmaganingiz uchun ham, 4-g'ordagi chiqishga tomon harakatlanishni boshlashingiz kerak. Buni 2-g'orga yoki 3-g'orga o'tish orqali amalga oshirishingiz mumkin. Bu yerda 3-g'or orqali o'tish yaxshi variant, chunki u yerda boʻlganingizda kanal yo'nalishlari teskari qilinsa, endi sizda 3-gʻordan to'g'ridan-to'g'ri 0-g'orga sayohat qilish va g'orlar tizimidan chiqib ketish imkoniyatingiz bo'ladi.

Aniqrog'i, troll o'zining sehrli kuchidan foydalanishga qaror qilishi uchun faqat uch xil vaziyat bor:

- Agar siz 1-g'orda boʻlganingizda troll o'z kuchidan darhol foydalansa, siz 1-g'ordan to'g'ridanto'g'ri 0-g'orga borishingiz va chiqib ketishingiz mumkin.

- Agar siz 1-g'ordan 3-g'orga o'tganingizdan so'ng troll o'z kuchidan foydalansa, siz 3-g'ordan to'g'ridan-to'g'ri 0-g'orga sayohat qilishingiz va chiqishingiz mumkin. Agar trol bu ikki holatda ham o'z kuchini ishlatmaslikka qaror qilsa, siz 3-g'ordan 4-g'orga borasiz va undagi chiqish orqali g'orlar tizimidan chiqib ketasiz.

Birinchi vaziyatda siz faqat bitta harakat qilishingiz kerak edi, boshqa vaziyatlarda siz ikkita harakat qilasiz. Bundan kelib chiqqan holda, bu holat uchun javob max(1,2,2) = 2 .

E'tibor bering, agar siz 1-g'ordan 2-g'orga o'tishni tanlasangiz, trol sizni uchta harakat qilishga majburlashi mumkin.

Birinchi va ikkinchi namuna 3, 4 va 5-subtasklardagi cheklovlarini qanoatlantiradi. Uchinchi namuna barcha subtasklardagi cheklovlarini qanoatlantiradi. To'rtinchi namuna 3 va 5- subtasklardagi qanoatlantiradi, va u quyidagi rasmda tasvirlangan.

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
5 6
0 1
1 2
1 3
2 4
3 4
0 3
```

**Chiquvchi ma’lumotlar**

```text
2 2 2 1
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
7 10
2 6
5 3
4 2
1 6
2 3
3 6
4 5
0 4
4 1
0 1
```

**Chiquvchi ma’lumotlar**

```text
2 1 2 3 2 4
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
2 1
0 1
```

**Chiquvchi ma’lumotlar**

```text
1
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
6 8
0 1
4 0
1 2
2 3
3 5
0 4
4 5
2 0
```

**Chiquvchi ma’lumotlar**

```text
2 4 3 3 1
```

---

Manba: [EGOI 2025 rasmiy masalalar arxivi](https://github.com/egoi-org/egoi-2025/tree/e3bb2be66c3a837c57c7f8eac3b5173f40129e13). [Litsenziya: CC BY-SA](https://github.com/egoi-org/egoi-2025/blob/e3bb2be66c3a837c57c7f8eac3b5173f40129e13/day2/currents/problem.yaml).
