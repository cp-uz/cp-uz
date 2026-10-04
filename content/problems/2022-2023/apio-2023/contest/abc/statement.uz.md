> Ushbu shart APIO 2023 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Cyberland Circuit fondi(Circuit=sxema) $n$ nafar a'zodan iborat. Bir bir a'zo o'zining takrorlanmas ismiga va sevimli soniga ega(sevimli soni takrorlanishi mumkin, lekin ismlar takrorlanmas)

Barcha fond a'zolari o'zaro $m$ ta xat alishishgan. Har bir xat o'z yuboruvchisi va qabul qiluvchisiga ega, hamda xatning ichida yuboruvchining sevimli soni yozilgan.

Barcha fond a'zosi, o'ziga kelgan xatlarning ichidagi sonlarning yig'indisini hisoblaydi va bu qiymatni 65536 (ya'ni, $2^{16}$) bo'lgan qoldig'ini topib uni o'zining natijaviy soni deb qabul qiladi.

Sizning vazifangiz barcha natijaviy sonlarni aniqlash.

Biroq, ahvol siz o'ylaganchalik sodda emas. Alisa, Bob va Sxema bu masalani qiyinroq usulda yechishni hal qilishdi:

- Alisa $n$ nafar fond a'zosining barchasi haqida ma'lumotlarni (ismi va sevimli soni) biladi, ammo xatlar haqida hech nimani bilmaydi. U Sxemaga uzunligi $10^{5}$ dan oshmagan binar satr yuborishi lozim.

- Bob $m$ xatni biladi (yuboruvchi va qabul qiluvchilarining ismlarini), ammo fond a'zolari haqida ma'lumotga ega emas. U ham Sxemaga uzunligi $10^{5}$ dan oshmagan binar satr yuborishi lozim.

- Sxema o'z navbatida Alisa va Bob yuborgan satrlarni qabul qilib bu satrlardan foydalangan holda uzunligi 16 $n$ bo'lgan binar satrni natija sifatida hosil qilishi lozim. Biroq, hisoblash kuchi kam bo'lganligi sababli, Sxema faqatgina sodda mantiqiy amallarni bajara oladi (misol uchun., AND, OR, NOT).

Quyida Sxemaning ishlashi to'liqroq bayon etilgan.

### Sxemaning ishlashi

Yo'lak - sxemaning asosiy elementi hisoblanadi. Yo'lakka 2 ta yoki 0 ta mantiqiy qiymat kiradi(sxema turiga ko'ra) va yo'lakdan 1 ta mantiqiy qiymat(natija) chiqadi. Ikki xil turdagi yo'lak mavjud: kirituvchi va hisoblovchi.

- Kirituvchi yo'lakka hech qanday qiymat kirmaydi, unda faqat chiqish mavjud. Bu yo'laklar yordamida Alisa va Bob bergan satrlardagi bitlar ifodalanadi.

   - Jami _lA_ + _lB_ ta kirituvchi yo'laklar bo'ladi, hamda ular 0 dan ( _lA_ + _lB_ −1) gacha raqam, bu yerda _lA_ , _lB_ mos ravishda Alisa va Bob yuborgan satrlar uzunliklari.

- $0 \le i $ < _lA_ , uchun $ i $ -yo'lak chiqishida Alisa bergan satrning $ i$ -biti beriladi.

- Hisoblovchi yo'lak 2 ta kirish va 1 ta chiqishga ega, bu turdagi yo'lak hisoblash jarayoni uchun javob beradi. Hisoblovchi yo'laklar uchun raqamlash ( _lA_ + _lB_ ) dan boshlanadi.

   - Har bir yo'lak uchun siz kirish sifatida 2 ta boshqa yo'lak raqamlarini(indekslarini) va amal turi $p$ ($0 \le p \le 15$) ni kiritishingiz lozim.

      - Sikllar hosil bo'lishini oldini olish maqsadida, kirishga belgilagan yo'lak raqamlari shu yo'lak raqamidan kichikroq bo'lishi shart.

      - Kirishga belgilagan ikki yo'laklarning natijasi(chiqish) mos ravishda $x$ 0 va $ x$ 1 bo'ladigan bo'lsa ( $ x $ 0, $ x$ 1 ∈{0,1}), unda bu hisoblovchi yo'lak natijasi quyidagi funksiya orqali hisoblanadi:

$$f(p,x_0,x_1)=\left\lfloor\frac{p}{2^{x_0+2x_1}}\right\rfloor\bmod 2.$$

Quyida sizga foydali bo'lishi mumkin bo'lgan namunalar berilgan:

| $x_0$ | $x_1$ | AND ($p=8$) | OR ($p=14$) | XOR ($p=6$) | NOT $x_0$ ($p=5$) |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 |

## Kod yozish detallari

Iltimos, e'tibor bering:

- Barcha massivlarning indekslari 0 dan boshlanadi. Misol uchun, agar  a bu uzunligi  n bo'lgan massiv deyilsa, demak  a[0] to  a[n1] gacha elementlari a massiv elementlari hisoblanadi. Oraliqdan tashqaridagi indekslarga murojaat etish chegaradan-chiqish xatolarini hosil qilishi mumkin.

- Barcha satrlar null belgisi -  \0 bilan tugaydi.

Quyidagi funksiyalarni e'lon qilishingiz kerak bo'ladi:

### Alisa

```cpp
int alice(const int n, const char names[][5], const unsigned short numbers[], bool outputs_alice[]);
```

|**Yo'nalish**|**Nomi**|**Uzunligi**|**Ma'nosi**|**Cheklovlari**|
|---|---|---|---|---|
||n|1|$n $|$0 \le n \le 700$|
|Kirish|names|$n$|Fond a'zolari<br>ismlari.|Barcha ismlar unikal(takrorlanmas) va ko'pi bilan4ta kichik Ingliz<br>alifbosi harflaridan tashkil topgan.|
||numbers|$n$|Mos fond<br>a'zosining<br>sevimli soni.|Barcha sonlar0dan65535gacha oraliqdan olingan butun sonlar.|
|Output|outputs_alice|$l $<br>$ A$|Sxemaga<br>yuboriladigan<br>binar satr.||
||Qaytarish(return)<br>qiymati|1|$l $<br>$ A $|_l_**uzunligi**10**dan oshmasligiga qarashingiz kerak, bundan**<br>**tashqari bir xil**_n_**lar uchun**_l_**qiymati bir xil bo'lishi lozim.**<br>$ A $<br>5<br>$ A$|

### Bob

```cpp
int bob(const int m, const char senders[][5], const char recipients[][5], bool outputs_bob[]);
```

|**Yo'nalish**|**Nomi**|**Uzunligi**|**Ma'nosi**|**Cheklovlari**|
|---|---|---|---|---|
||m|1|$m $|$0 \le m \le 1000$|
|Kirish|senders|$m$|Har bir xatning<br>yuboruvchisi ismi.||
||recipients|$m$|Har bir xatni qabul<br>qiluvchisining<br>ismi..|Barcha ismlar Alisaga berilgan (kirish sifatida).|
|Chiqish|outputs_bob|$l $<br>$ B$|Sxemaga<br>yuboriladigan<br>binar satr.||
||Qaytarish(return)<br>qiymati|1|$l $<br>$ B $|_l_**uzunligi**10**dan oshmasligiga qarashingiz kerak, bundan**<br>**tashqari bir xil**_m_**lar uchun**_l_**qiymati bir xil bo'lishi lozim.**<br>$ B $<br>5<br>$ B$|

### Sxema

Sxemaning hisoblash jarayoni, haqiqiy sxemaniki bilan bir xilligiga ishonch hosil qilish uchun, sxema Alisa va Bobdan qaytgan satrlarni qabul qilmaydi. Sizga faqatgina Alisa va Bob qaytargan satr uzunliklari beriladi, siz sxema tuzilishini chiqarishingiz kerak.

```cpp
int circuit(const int la, const int lb, int operations[], int operands[][2], int outputs_circuit[][16]);
```

|**Yo'nalish**<br>**Nomi**|**Uzunligi**|**Ma'nosi**<br>**Cheklovlari**|
|---|---|---|

|**Yo'nalish**|**Nomi**|**Uzunligi**|**Ma'nosi**|**Cheklovlari**|
|---|---|---|---|---|
|Kirish|la|1|$l $<br>$ A$||
||lb|1|$l $<br>$ B$||
||operations|$l$|Har bir hisoblovchi<br>yo'lak bajaradigan amal<br>turi.|0dan15gacha oraliqdan butun son.|
||operands|$l$|Kirish sifatida berilgan 2<br>ta boshqa yo'lak<br>raqamlari - operandlar.|Bu 2 raqamning har biri ushbu yo'lak raqamidan kichik<br>bo'lishi shart.|
|Chiqish|outputs_circuit|$n $|Sxema ishlashidan<br>so'ng natija sifatida<br>qabul qilinadigan<br>yo'laklar.|outputs_circuit[i][j]  i-a'zoning natijaviy soni eng<br>kichik bitdan boshlab sanaganda$ j$-biti. Fond a'zolari<br>Alisaga berilgan ro'yxat bo'yicha tartiblangan.|
||Qaytarish(return)<br>qiymati|1|$l $, kirish yo'laklarini<br>inobatga olganda, jami<br>ishlatilgan yo'laklar<br>soni.|$ l \le 2$ × 10**ekanligiga qarashingiz kerak**<br>7|

Siz raqami(indeksi) _lA_ + _lB_ dan kichik bo'lgan yo'lak ma'lumotlarini( operations va operands ) ham o'zgartirishingiz, ammo greyder buni inobatga olmaydi.

## Namunalar

Quyidagicha funksiya chaqiruvini ko'rib chiqaylik:

alice(3, {"alic", "bob", "circ"}, {10000, 20000, 30000}, outputs_alice); bob(5, {"alic", "bob", "bob", "circ", "circ"}, {"circ", "circ", "alic", "circ", "circ"}, outputs_bob);

Bu quyidagi holatni tasvirlaydi:

Alisa fondda 3 ta a'zo borligini biladi,  alic ismli a'zoning sevili soni 10000 va h.k.  alica() funksiyasi quyidagicha ishlashi mumkin (bu namuna, to'g'ri strategiyani kafolatlamaydi),

alice() ning qaytarish qiymati 2, bu _lA_ = 2 ni ifodalaydi. alice() funksiyasining ichida  outputs_alice[0] = 1, outputs_alice[1] = 0 , deb o'rnatiladi, ya'ni natijaviy satr 10 ko'rinishida.

- Bob jami 5 xat borligini biladi, birinchi xat  alic dan  circ ga va h.k.  bob() funksiyasi quyidagicha ishlashi mumkin (bu namuna, to'g'ri strategiyani kafolatlamaydi),

   - bob() funksiyasining qaytarish qiymati 3, bu _lB_ = 3 ni ifodalaydi. bob() funksiyasining ichida,  outputs_bob[0] = 1, outputs_bob[1] = 1, outputs_bob[2] = 0 deb o'rnatiladi, ya'ni natijaviy satr 110 ko'rinishida.

Oldin chaqirilgan  alice() va  bob() funksiyalarining natijalariga tayangan holda, quyidagicha chaqiruv qilsak bo'ladi:

circuit(2, 3, operations, operands, outputs_circuit);

To'g'ri natijaga olib keluvchi holatlardan biri:

circuit() funksiyasi qaytaradigan natija 7, ya'ni biz yana qo'shimcha 2 ta yo'lak qo'shamiz, 5 va 6 yo'laklarini.

- circuit() funksiyasini ichida,  operations va  operands ni hamda  outputs_circuit ni quyidagicha o'rnating: operations = {-1, -1, -1, -1, -1, 8, 14} ,  -1 bu yerda kirituvchi yo'laklarni anglatadi. Sababi kirituvchi yo'laklar hisoblay olmaydi;

   - operands = {{-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}, {0, 4}, {2, 5}} ; outputs_circuit = {{5, 5, 5, 5, 5, 6, 5, 5, 5, 6, 6, 6, 5, 5, 6, 5}, ...} . Massiv uzunroq, shunga uni ilova qilingan  abc.cpp faylidan ochib ko'rishingiz mumkin.

Tepadagi funksiyalarga tayangan holda, natija quyidagicha hisoblanadi:

- Hisoblash amali 8 bo'lgan hisoblovchi yo'lak qo'shing, unga kirish 0 va 4 yo'lak chiqishlari bo'lsin. 0-yo'lak Alisa qaytargan satrning 0-biti bilan bir xil, demak 0-yo'lak natijasi 1. Chunki Alisa 10 qaytargan edi; 4-yo'lak Bob qaytargan satrning 2-bitini anglatadi, bu

esa 0, chunki Bob 110 satrini qaytargan edi. Shunday qilib bu yangi 5-yo'lak natijasi $f$ (8,0,1) = 0 AND 1 = 0.

- Hisoblash amali 14 bo'lgan yangi yo'lak qo'shing, unga kirish 2 va 5 yo'lak chiqishlari bo'lsin. 2 yo'lak Bob qaytargan satrning 0-biri bilan bir xil, demak 2-yo'lak natijasi 1; 5-yo'lak natijasi 0. Shunday qilib bu yangi 6-yo'lak natijasi $f$ (14,1,0) = 1 OR 0 = 1. output_circuit[0]  alic ning natijaviy sonini anglatadi, ya'ni (0100111000100000)2 = 20000. alic faqatgina bob dan xat olgan ekan, undagi natija haqiqatdan ham 20000.

- bob ning natijaviy soni 0, chunki u hech kimdan xat olmagan; circ ning natijaviy soni (10000 + 20000 + 30000 + 30000) mod 65536 = 24464 bo'ladi.

abc.cpp dagi yechim mana shu testdan o'tadi, boshqa testlardan o'tishini kafatlamaymiz.

## Chegaralar

Barcha testlar uchun:

- $0 \le n \le 700$,$0 \le m \le 1000$.

- Barcha ismlar unikal, hamda faqatgina kichik Ingliz alifbo harflaridan iborat. Barcha ismlarning uzunligi 4 dan katta emas. Har bir fond a'zosizning sevimli soni 0 dan 65535 gacha oraliqdan olingan.

- Xatlarning yuboruvchilari ismlari Alisaning  names massivida uchragan.

- alice() va  bob() funksiyalari chaqiruvlari 2048 MiB xotira chegarasiga va 0.02 sekund vaqt chegaralariga ega. circuit() funksiyasi esa 2048 MiB xotira chegarasiga va 7 sekund vaqt chegarasiga ega.

**To'liq baholash uchun,  alice() va  bob() funksiyalari bitta test ichida bir necha marta chaqirilishi mumkin.** Har bir chaqiruv 0.02 sekund vaqt chegarasiga ega bo'ladi.

## Qism masalalar

### Qism masalalar, tip A (12 ball)

1,2,3 qism masalalar A tipdagi qism masalalardir. Bu yerda $n = 1$.

Har bir qism masala quyidagicha qo'shimcha cheklovlarga ega:

- Subtask 1 (4 ball): $m = 0$. Subtask 2 (4 ball): $0 \le m \le 1$. Subtask 3 (4 ball): $0 \le m \le 1000$.

### Qism masalalar, tip B (54 ball)

4,5,6 qism masalalar B tipdagi qism masalalardir. Bu yerda:

- $0 \le n \le 30$, $n/2\le m\le n^2$. Bir vaqtning o'zida bir xil yuboruvchisi va qabul qiluvchisi bo'lgan ikkita xat, ya'ni ikkita bir xil xat mavjud emas. Barcha fond a'zolarining ismlari Bobning kirishiga beriladi(ya'ni, har bir fond a'zosi kamida bir marta xat yuboradi yoki kamida bir marta xat qabul qiladi).

Har bir qism masala quyidagicha qo'shimcha cheklovlarga ega:

- Subtask 4 (24 ball): $n = 26$, barcha fond a'zolarining ismlari uzunligi 1 ga teng, hamda Alisaning kirishiga ular aniq  a dan  z gacha tartiblangan holda kiritiladi.

- Subtask 5 (24 points): $n = 26$.

- Subtask 6 (6 ball): Maxsus cheklovlarsiz.

### Qism masalalar, tip C (34 ball)

7,8,9 qism masalalar C tipdagi qism masalalardir. Bu yerda: $0 \le n \le 700$,$0 \le m \le 1000$.

Har bir qism masala quyidagicha qo'shimcha cheklovlarga ega:

- Subtask 7 (18 points): $n = 676$,barcha fond a'zolarining ismlari uzunligi 2 ga teng, hamda Alisaning kirishiga ular aniq leksigrafik saralangan holda kiritiladi (ya'ni.,  aa ,  ab ,  ac , ...,  az ,  ba , ...,  bz ,  ca , ...,  zz ).

- Subtask 8 (10 points): $n = 676$.

- Subtask 9 (6 points): Maxsus cheklovlarsiz.

## Namunaviy greyder

Namunaviy greyder ma'lumotlarni quyidagi formatda o'qiydi:

qator 1: _n m_ qator 2 + $i $ ($0 \le i \le n - 1$): _names numbersi i_ qator 2 + $ n $ + $ i $ ($0 \le i \le m - 1$): _senders recipientsi i_ .

Namunaviy greyder natijani quyidagi formatda chiqaradi:

Agar dastur muvaffaqiyatli yakunlansa, namunaviy greyder har birida bittadan son bo'lgan $n$ ta qator chiqaradi. Har bir son funksiyalaringiz hisoblagan navbatdagi fond a'zosining natijaviy sonini chiqaradi. Aks holda, greyder chiqish oqimiga hech narsa chiqarmaydi va xatolik haqida ma'lumotlarni  abc.log ga papkadagi yozadi. Qo'shimcha ravishda, namunaviy greyder _lA_ , _lB_ , $l$ ning qiymatlarini va har bir funksiyaning chqiruvi olgan vaqtni  abc.log ga yozib qoldiradi.

**Namunaviy greyder xotira chegarasini va bir xil** $n $ **/** $ m$ **lar uchun** _lA_ **/** _lB_ **larning bir xilligini tekshirmaydi.**

---

Manba: [APIO 2023 rasmiy masalalar arxivi](https://github.com/apio2023/apio2023_tasks/tree/af6519ce925e3489a07ed4248a4fb10860246e8a). [Litsenziya: CC0 1.0](https://github.com/apio2023/apio2023_tasks/blob/af6519ce925e3489a07ed4248a4fb10860246e8a/LICENSE).
