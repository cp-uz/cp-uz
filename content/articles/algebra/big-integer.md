---
article_id: algebra--big-integer
---
# Ixtiyoriy aniqlikdagi arifmetika

Ixtiyoriy aniqlikdagi arifmetika, “bignum” yoki oddiygina “uzun arifmetika” deb ham ataladi, standart ma’lumot turlariga sig‘maydigan juda katta sonlarni qayta ishlash imkonini beradigan ma’lumotlar tuzilmalari va algoritmlar to‘plamidir. Quyida ixtiyoriy aniqlikdagi arifmetikaning bir necha turi keltiriladi.
## Klassik butun sonli uzun arifmetika

Asosiy g‘oya — sonni biror sanoq sistemasidagi “raqamlari” massivi sifatida saqlash. Eng ko‘p ishlatiladigan asoslar: o‘nlik, o‘nlikning darajalari ($10^4$ yoki $10^9$) va ikkilik.

Bunday ko‘rinishdagi sonlar ustida amallar ustunlab qo‘shish, ayirish, ko‘paytirish va bo‘lishning “maktab” algoritmlari yordamida bajariladi. Tez ko‘paytirish algoritmlari — tezkor Fourier almashtirishi va Karatsuba algoritmidan ham foydalanish mumkin.
Bu yerda faqat manfiy bo‘lmagan butun sonlar uchun uzun arifmetikani tasvirlaymiz. Algoritmlarni manfiy sonlarga kengaytirish uchun qo‘shimcha “manfiy son” bayrog‘ini kiritib saqlash yoki ikkilik qo‘shimcha kod ko‘rinishidan foydalanish kerak.
### Ma’lumotlar tuzilmasi

Sonlarni `vector<int>` ko‘rinishida saqlaymiz; undagi har bir element sonning bitta “raqami” bo‘ladi.

```cpp
typedef vector<int> lnum;
```

Tezlikni oshirish uchun asos sifatida $10^9$ dan foydalanamiz; shunda uzun sonning har bir “raqami” birdaniga 9 ta o‘nlik raqamni saqlaydi.

```cpp
const int base = 1000*1000*1000;
```
Raqamlar kichik razryaddan katta razryadga qarab saqlanadi. Barcha amallar shunday implementatsiya qilinadiki, operandlarda bosh nol bo‘lmasa, har bir amaldan keyin natijada ham bosh nol bo‘lmaydi. Bosh nol hosil qilishi mumkin bo‘lgan har bir amal ulardan xalos qiladigan kod bilan tugashi kerak. E’tibor bering, bu ko‘rinishda nol sonining ikki to‘g‘ri yozuvi mavjud: bo‘sh vektor va bitta nol raqamli vektor.
### Chiqarish

Uzun butun sonni chiqarish eng sodda amaldir. Avval vektorning oxirgi elementini (vektor bo‘sh bo‘lsa 0 ni), so‘ng qolgan elementlarni, kerak bo‘lsa oldiga nollar qo‘shib, aynan 9 xonali qilib chiqaramiz.

```cpp
printf ("%d", a.empty() ? 0 : a.back());
for (int i=(int)a.size()-2; i>=0; --i)
	printf ("%09d", a[i]);
```
Vektorda 2 tadan kam element bo‘lganda ishorasiz butun sonning qiymati kamayib, chegaradan chiqib ketmasligi uchun `a.size()` ni butun songa o‘tkazganimizga e’tibor bering.
### Kiritish

Uzun butun sonni o‘qish uchun uning yozuvini `string` ga o‘qiymiz, keyin “raqamlar”ga aylantiramiz:

```cpp
for (int i=(int)s.length(); i>0; i-=9)
	if (i < 9)
		a.push_back (atoi (s.substr (0, i).c_str()));
	else
		a.push_back (atoi (s.substr (i-9, 9).c_str()));
```

Agar `string` o‘rniga `char` massiv ishlatsak, kod yanada qisqa bo‘ladi:

```cpp
for (int i=(int)strlen(s); i>0; i-=9) {
	s[i] = 0;
	a.push_back (atoi (i>=9 ? s+i-9 : s));
}
```

Kiritishda bosh nollar bo‘lishi mumkin bo‘lsa, ularni quyidagicha olib tashlash mumkin:

```cpp
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```
### Qo‘shish

Uzun butun $a$ soniga $b$ ni qo‘shib, natijani $a$ da saqlash:

```cpp
int carry = 0;
for (size_t i=0; i<max(a.size(),b.size()) || carry; ++i) {
	if (i == a.size())
		a.push_back (0);
	a[i] += carry + (i < b.size() ? b[i] : 0);
	carry = a[i] >= base;
	if (carry)  a[i] -= base;
}
```
### Ayirish

Uzun butun $a$ sonidan $b$ ni ayirib ($a \ge b$), natijani $a$ da saqlash:

```cpp
int carry = 0;
for (size_t i=0; i<b.size() || carry; ++i) {
	a[i] -= carry + (i < b.size() ? b[i] : 0);
	carry = a[i] < 0;
	if (carry)  a[i] += base;
}
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```

Ayirishdan keyin uzun butun sonlarda bosh nol bo‘lmasligi haqidagi kelishuvni saqlash uchun bosh nollarni olib tashlaymiz.
### Qisqa butun songa ko‘paytirish

Uzun butun $a$ sonini qisqa butun $b$ ga ($b<base$) ko‘paytirib, natijani $a$ da saqlash:

```cpp
int carry = 0;
for (size_t i=0; i<a.size() || carry; ++i) {
	if (i == a.size())
		a.push_back (0);
	long long cur = carry + a[i] * 1ll * b;
	a[i] = int (cur % base);
	carry = int (cur / base);
}
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```
Qo‘shimcha optimallashtirish: ishlash vaqti nihoyatda muhim bo‘lsa, avval bo‘linmaning butun qismini (`carry` o‘zgaruvchisini) topib, so‘ng qoldiqni ko‘paytirish yordamida hisoblash orqali ikkita bo‘lishni bittaga almashtirish mumkin. Bu odatda kodni tezlashtiradi, ammo farq juda katta emas.
### Uzun butun songa ko‘paytirish

Uzun butun $a$ va $b$ sonlarini ko‘paytirib, natijani $c$ da saqlash:

```cpp
lnum c (a.size()+b.size());
for (size_t i=0; i<a.size(); ++i)
	for (int j=0, carry=0; j<(int)b.size() || carry; ++j) {
		long long cur = c[i+j] + a[i] * 1ll * (j < (int)b.size() ? b[j] : 0) + carry;
		c[i+j] = int (cur % base);
		carry = int (cur / base);
	}
while (c.size() > 1 && c.back() == 0)
	c.pop_back();
```
### Qisqa butun songa bo‘lish

Uzun butun $a$ sonini qisqa butun $b$ ga ($b<base$) bo‘lib, butun natijani $a$ da, qoldiqni esa `carry` da saqlash:

```cpp
int carry = 0;
for (int i=(int)a.size()-1; i>=0; --i) {
	long long cur = a[i] + carry * 1ll * base;
	a[i] = int (cur / b);
	carry = int (cur % b);
}
while (a.size() > 1 && a.back() == 0)
	a.pop_back();
```
## Faktorizatsiya ko‘rinishidagi uzun butun sonlar arifmetikasi

G‘oya butun sonni uning faktorizatsiyasi, ya’ni uni bo‘ladigan tub sonlarning darajalari ko‘rinishida saqlashdan iborat.

Bu yondashuvni implementatsiya qilish juda oson; ko‘paytirish va bo‘lishni oson (asimptotik jihatdan klassik usuldan tezroq) bajarishga imkon beradi, ammo qo‘shish va ayirishni qo‘llab-quvvatlamaydi. Klassik yondashuvga qaraganda xotiradan ham juda tejamkor foydalanadi.
Bu usul ko‘pincha tub bo‘lmagan $M$ modul bo‘yicha hisoblarda ishlatiladi; bunday holda son uni bo‘ladigan $M$ bo‘luvchilarining darajalari va $M$ modul bo‘yicha qoldiq sifatida saqlanadi.
## Tub modullar bo‘yicha uzun butun son arifmetikasi (Garner algoritmi)

G‘oya tub sonlar to‘plamini tanlash (odatda ular standart butun son turiga sig‘adigan darajada kichik bo‘ladi) va butun sonni shu tub sonlarning har biriga bo‘lgandagi qoldiqlar vektori sifatida saqlashdan iborat.
Xitoy qoldiqlar teoremasiga ko‘ra, bu ko‘rinish 0 dan shu tub sonlar ko‘paytmasidan bir ayirilganigacha bo‘lgan istalgan sonni yagona tarzda tiklash uchun yetarli. [Garner algoritmi](garners-algorithm.md) sonni bunday ko‘rinishdan odatiy butun songa qaytarish imkonini beradi.
Bu usul klassik yondashuvga qaraganda xotirani tejaydi (ammo faktorizatsiya ko‘rinishidagidek katta emas). Bundan tashqari, modul sifatida ishlatilgan tub sonlar soniga proporsional vaqtda tez qo‘shish, ayirish va ko‘paytirish imkonini beradi (implementatsiya uchun [Xitoy qoldiqlar teoremasi](chinese-remainder-theorem.md) maqolasiga qarang).
Kamchiligi shundaki, butun sonni odatiy ko‘rinishga qaytarish ancha mehnat talab qiladi va ko‘paytirishni qo‘llab-quvvatlaydigan klassik ixtiyoriy aniqlikdagi arifmetikani implementatsiya qilishni talab etadi. Bundan tashqari, bu usul bo‘lishni qo‘llab-quvvatlamaydi.
## Kasrlar uchun ixtiyoriy aniqlikdagi arifmetika

Dasturlash musobaqalarida kasrlar butun sonlarga qaraganda kamroq uchraydi, kasrlar uchun uzun arifmetikani implementatsiya qilish esa ancha murakkab. Shu sababli musobaqalarda kasrli uzun arifmetikaning faqat kichik qismi uchraydi.
### Qisqarmas kasrlar arifmetikasi

Son $\frac{a}{b}$ qisqarmas kasr sifatida ifodalanadi, bu yerda $a$ va $b$ butun sonlar. Kasrlar ustidagi barcha amallar shu kasrlarning butun surat va maxrajlari ustidagi amallar ko‘rinishida yozilishi mumkin. Odatda surat va maxrajni saqlash uchun klassik ixtiyoriy aniqlikdagi arifmetikadan foydalanish talab qilinadi, ammo ba’zan o‘rnatilgan 64 bitli butun son turi yetarli bo‘ladi.
### Suzuvchi nuqta pozitsiyasini alohida tur sifatida saqlash

Ba’zan masalada toshib ketish yoki aniqlikning yo‘qolishiga yo‘l qo‘ymagan holda juda kichik yoki juda katta sonlar bilan ishlash talab qilinadi. O‘rnatilgan `double` turi 8–10 bayt ishlatadi va daraja ko‘rsatkichini $[-308;308]$ oralig‘ida saqlaydi; ba’zan bu yetarli emas.
Yondashuv juda sodda: daraja ko‘rsatkichi qiymatini saqlash uchun alohida butun o‘zgaruvchi ishlatiladi va har bir amaldan keyin suzuvchi nuqtali son normallashtiriladi, ya’ni daraja ko‘rsatkichi mos ravishda o‘zgartirilib, son $[0.1;1)$ oralig‘iga qaytariladi.
Bunday ikki son ko‘paytirilganda yoki bo‘linganda ularning daraja ko‘rsatkichlari mos ravishda qo‘shiladi yoki ayiriladi. Sonlar qo‘shilganda yoki ayirilganda esa, avval sonlardan birini daraja ko‘rsatkichlari farqiga teng darajadagi 10 ga ko‘paytirib, ularni umumiy daraja ko‘rsatkichiga keltirish kerak.

Yakuniy eslatma: daraja ko‘rsatkichi asosi 10 bo‘lishi shart emas. Suzuvchi nuqtali sonlarning ichki ifodasini hisobga olsak, asos sifatida 2 dan foydalanish eng ma’qul.
## Mashq masalalari

* [UVA - How Many Fibs?](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1124)
* [UVA - Product](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1047)
* [UVA - Maximum Sub-sequence Product](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=728)
* [SPOJ - Fast Multiplication](http://www.spoj.com/problems/MUL/en/)
* [SPOJ - GCD2](http://www.spoj.com/problems/GCD2/)
* [UVA - Division](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1024)
* [UVA - Fibonacci Freeze](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=436)
* [UVA - Krakovia](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1866)
* [UVA - Simplifying Fractions](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1755)
* [UVA - 500!](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=564)
* [Hackerrank - Factorial digit sum](https://www.hackerrank.com/contests/projecteuler/challenges/euler020/problem)
* [UVA - Immortal Rabbits](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4803)
* [SPOJ - 0110SS](http://www.spoj.com/problems/IWGBS/)
* [Codeforces - Notepad](http://codeforces.com/contest/17/problem/D)
