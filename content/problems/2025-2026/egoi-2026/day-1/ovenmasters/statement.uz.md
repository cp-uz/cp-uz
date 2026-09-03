> Ushbu shart EGOI 2026 rasmiy repozitoriysidagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Siz Italiyaning eng zo’r $N$ nafar pizza pishiruvchilari (qisqacha pitsapaz) kim eng yaxshi pitsa qilishini aniqlash uchun musobaqalashgan “Excellent Glutenous Ovenmasters of Italy” tadbirida muxbirsiz. Har bir pitsapaz bitta pitsa pishirdi va keyin pitsalar hakamlar hay’ati tomonidan baholanadi. Har bir pitsa 0 (eng yaxshi) dan $N-1$ (eng yomon) gacha bo’lgan, bir biridan farq qiluvchi o’rinlarni egalladi. Shundan so’ng har bir pitsapaz o’z pitsasi olgan o’rindek o’rin oladi.

Musobaqadan so’ng (pitsalar baholangandan so’ng), pitsa bazmida pitsalarni tatib ko’rish vaqti keladi. Tadbirda barcha pitsapazlar ishtirok etadi va har bir ishtirokchi o’z pitsasini bazmga olib keladi.

Pitsapazlar birin-ketin qandaydir tartibda kelishadi (egallagan o’rinlari bo’yicha kelishi shart emas). Bazmda 0 dan $M-1$ gacha raqamlangan $M\le N$ ta stol bor. Birinchi kelgan $M$ ta pitsapaz kelishlari tartibiga ko’ra, 0 dan $M-1$ gacha bo’lgan stollarga qo’yishadi. Qolgan $N-M$ ta pitsapazning har biri o’zinikidan yaxshiroq, lekin o’zidan ko’p ham xafa bo’lib ketmasligi uchun, unchalik ham zo’r bo’lmagan pitsani yeyishni xohlaydi. Ya’ni har safar yangi pitsapaz kelganda, ular stollardagi o’z pitsasidan yaxshiroq, lekin mavjudlari ichida eng yomon pitsani tanlashadi. Ular tanlangan pitsasini yeyish uchun o’sha stolga o’tirishadi. Stolda turgan pitsani to’liq yeb bo’lgach, ular keyinroq boshqa pitsapaz yeyishi uchun o’zining pitsasini o’sha stolda qoldirib ketishadi. Agar kelgan pitsapaz uchun mos pitsa topilmasa (barcha stollardagi pitsalar o’zinikidan yomonroq bo’lsa), pitsapaz xafa bo’lib ketadi va o’z pitsasini o’zi bilan olib ketadi.

Quyidagi misolda $M = 2$ ta stoli bor hamda bazmga o’rinlari 1, 0, 3, 5, 4, 2 bo’lgan ketma-ketligida kelayotgan pitsapazlar ko’rsatilgan. Bu bazm birinchi sample misolga mos tushadi.

_Diagramma rasmiy PDFda keltirilgan._

**1-rasm.** Birinchi kelgan $M = 2$ ta pitsapaz pitsalarini kelish tartibida bo’sh stollarga (0, 1) qo’yadi.

_Diagramma rasmiy PDFda keltirilgan._

**2-rasm.** Barcha stollar band bo’lgandan so’ng, har bir kelgan pitsapaz o’zinikidan yaxshiroq bo’lgan eng yomon pitsa (strelka orqali ko’rsatilgan) joylashgan stolga boradi, o’sha pitsani yeydi va o’zinikini qoldiradi. Agar yaxshiroq pitsa bo’lmasa, pitsapaz xafa bo’lib ketib qoladi (strelka yo’q).

Siz yozayotgan maqolada sen pitsapazlarning bazmga qanday tartibda kelganligi haqida yozmoqchisiz. Afsuski, shirin pitsalarga chalg’ib ketib, pitsapazlarning kelish tartibini yozib qo’yishni esdan chiqaribsiz. Yaxshiyamki, har bir stolda shu stolga qo’yilgan pitsalarning patnislari pitsalar tortilish tartibida qo’yilganiligini ko’rishingiz mumkin.

**stol 0**

_Diagramma rasmiy PDFda keltirilgan._

**3-rasm.** Birinchi misolga mos keladigan patnislar to’plami. Har bir to’plam shu stolda bo’lgan pitsapazlarni kelish tartibida, pastdan (birinchi) tepaga (eng oxirgi) qarab sanab o’tadi. Ajratib ko’rsatilgan patnisda bazm oxirida shu yerda qoldirilgan pitsa bor.

Sen bu ma’lumotlardan pitsapazlarning kelish tartibini tiklash uchun foydalanmoqchisiz. Bunga mos tushuvchi bir nechta tartiblar bo’lishi mumkinligini bilasiz, shunga to’liq ball olish uchun siz leksikografik jihatdan eng kichik to’g’ri keladigan tartibni topishing kerak.[1]

## Kiruvchi ma’lumotlar

Birinchi qatorda ikkita butun son $N$ va $M$ — pitsapazlar soni va bazmdagi stollar soni kiritiladi. Keyin $ M$ ta qator keladi, ularning har biri stoldagi patnislar to’plamini tasvirlaydi. $ i $-qator $ i $-stoldagi patnislar soni $ T_{i}$ - butun son bilan boshlanadi, undan keyin $ i$-stolda bo’lgan $ j$-pitsaning o’rnini anglatuvchi $ T_{i}$ ta $ b_{i}$,$ j$ butun sonlari keladi.

## Chiquvchi ma’lumotlar

Agar shartlarni qanoatlantiruvchi hech qanday tartib bo’lmasa, NO deb chiqaring. Agar mumkin bo’lgan tartib mavjud bo’lsa, YES deb chiqaring. Bu holda, ikkinchi qatorda pitsapazlarning kelish tartibini anglatuvchi $N$ ta $a_{0}$, $ a_{1}$, …, $ a_{N-1}$ butun sonlarni chiqaring. Agar bunday tartiblar bir nechta bo’lsa, ularning orasidan leksikografik eng kichigini chiqarishingiz kerak. E’tibor bering, qisman to’g’ri javoblar ham “Baholash” qismida tushuntirilganidek ma’lum bir ballar bilan baholanishi mumkin.

## Chegaralar

- 1 $\le M\le N\le 300000$.

- 0 $\le bi $,$ j \le N-1$.

- Barcha $b_{i}$,$ j$ lar har xil.

- 1 $\le Ti \le N$ .

> $1a0$, $ a_{1}$,… , $ a_{n-1}$ ketma-ketlik $ b_{0}$, $ b_{1}$,…,$ b_{n-1}$ ketma-ketlikdan leksikografik kichik hisoblanadi, qachonki qandaydir 0 $\le t < n $ indeks uchun, barcha $i < t $ uchun $a_{i} = b_{i}$ va $a_{t} < b_{t}$ bo’lsa.

## Baholash

Dasturingiz subtasklarga bo’lingan bir nechta testlarda sinovdan o’tkaziladi. Subtaskda ball olish uchun dasturingiz undagi barcha testlarda to’g’ri ishlashi kerak.

Faqatgina birinchi qatori to’g’ri bo’lgan (YES yoki NO) yechimlar 20% ball oladi. Birinchi qatori to’g’ri bo’lgan (YES yoki NO) va agar javob YES bo’lsa leksikografik eng kichigi bo’lishi ⇨ shart bo’lmagan **har qanday to’g’ri** tartibni chiqargan yechimlar qo’shimcha 20% ball oladi. Qolgan 60% ballni olish uchun birinchi qator YES bo’lganda leksikografik eng kichik to’g’ri tartibni chiqarishing kerak.

- **Qism-masala 0 [ 0 ball]** : Sample testlar.

- **Qism-masala 1 [20 ball]** : $M = 1$.

- **Qism-masala 2 [10 ball]** : $M = 2$, $ N\le 200$ va barcha $ T_{i}$ lar yig’indisi $ N$ ga teng (boshqacha qilib aytganda, hech qaysi pitsapaz xafa bo’lib ketib qolmaydi).

- **Qism-masala 3 [20 ball]** : $M\le N\le 200$ va barcha $T_{i}$ lar yig’indisi $N$ ga teng (boshqacha qilib aytganda, hech qaysi pitsapaz xafa bo’lib ketib qolmaydi).

- **Qism-masala 4 [20 ball]** : $M\le 10$.

- **Qism-masala 5 [30 ball]** : Qo’shimcha chegaralarsiz.

## Misollar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
6 2
3 1 3 5
2 0 4
```

**Chiquvchi ma’lumotlar**

```text
YES
1 0 3 5 4 2
```

### 2-misol

**Kiruvchi ma’lumotlar**

```text
6 2
3 1 3 4
2 0 2
```

**Chiquvchi ma’lumotlar**

```text
NO
```

### 3-misol

**Kiruvchi ma’lumotlar**

```text
4 2
2 0 3
2 1 2
```

**Chiquvchi ma’lumotlar**

```text
NO
```

### 4-misol

**Kiruvchi ma’lumotlar**

```text
3 1
2 0 2
```

**Chiquvchi ma’lumotlar**

```text
YES
0 2 1
```

### 5-misol

**Kiruvchi ma’lumotlar**

```text
8 1
8 7 6 5 4 3 2 1 0
```

**Chiquvchi ma’lumotlar**

```text
NO
```

### 6-misol

**Kiruvchi ma’lumotlar**

```text
12 4
3 2 3 4
1 5
1 6
5 7 8 9 10 11
```

**Chiquvchi ma’lumotlar**

```text
YES
2 5 6 7 0 1 3 4 8 9 10 11
```

## Izoh
Birinchi misolning kiritilishi va chiqarilishi masala shartida ko’rsatilgan rasmlarga mos keladi. Xususan, 1 va 2-rasmlarda pitsapazlarning bazmga kelish tartibi leksikografik jihatdan eng kichik to’g’ri tartib hisoblangan 1, 0, 3, 5, 4, 2 dir.

Ikkinchi misolda patnislar to’plami mantiqqa to’g’ri kelmaydi, chunki 5-o’rinli pitsapaz xafa bo’lib ketib qoladigan hech qanday kelish tartibi mavjud emas. Shuning uchun javob NO.

Uchinchi va beshinchi misollarda patnislar to’plami ham xato (ularni hosil qila oladigan hech qanday kelish tartibi yo’q), shuning uchun javob NO.

To’rtinchi misolda ($N = 3$, $ M = 1$) faqatgina bitta kelish tartibi mumkin, ya’ni 0, 2, 1.

Oltinchi misolda ($N = 12$, $ M = 4$) shuni yodda tutki, 0 va 1 sonlari $ b_{i}$,$ j$ qiymatlari orasida qatnashmaydi. Bu degani bazm davomida qaysidir vaqtda 0 va 1-pitsapazlarning ikkalasi ham xafa bo’lib ketib qolgan. Misoldagi javobda leksikografik jihatdan eng kichik to’g’ri kelish tartibi ko’rsatilgan. Boshqa to’g’ri keladigan tartiblar ham bor; masalan, 2, 5, 6, 7, 8, 1, 3, 4, 9, 10, 11, 0. Leksikografik eng kichik tartibni chiqarish o’rniga shu kabi boshqa to’g’ri tartibni YES dan keyin chiqarish qisman to’g’ri deb hisoblanadi va buning uchun umumiy ballning 40% qismi beriladi.
