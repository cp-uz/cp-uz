---
article_id: graph--edge_vertex_connectivity
---
# Qirra bog‘liqligi / tugun bog‘liqligi

## Ta’rif

$n$ ta tugun va $m$ ta qirrali yo‘naltirilmagan $G$ graf berilgan.
Qirra bog‘liqligi ham, tugun bog‘liqligi ham grafni tavsiflaydigan xususiyatlardir.

### Qirra bog‘liqligi

$G$ grafning **qirra bog‘liqligi** $\lambda$ — $G$ graf uzilib qolishi uchun olib tashlash kerak bo‘lgan qirralarning eng kichik soni.

Masalan, avvaldan uzilgan grafning qirra bog‘liqligi $0$, kamida bitta ko‘prigi bor bog‘langan grafniki $1$, ko‘prigi yo‘q bog‘langan grafniki esa kamida $2$.
Agar $G$ grafdan $S$ dagi barcha qirralarni olib tashlagach, $s$ va $t$ tugunlar turli bog‘langan komponentlarda qolsa, $S$ qirralar to‘plami $s$ va $t$ tugunlarni **ajratadi** deymiz.

Grafning qirra bog‘liqligi barcha mumkin bo‘lgan $(s,t)$ juftlari orasida ikki $s$ va $t$ tugunni ajratadigan shunday to‘plamning minimal hajmiga tengligi ravshan.

### Tugun bog‘liqligi

$G$ grafning **tugun bog‘liqligi** $\kappa$ — $G$ graf uzilib qolishi uchun olib tashlash kerak bo‘lgan tugunlarning eng kichik soni.
Masalan, avvaldan uzilgan grafning tugun bog‘liqligi $0$, artikulyatsiya nuqtasi bor bog‘langan grafniki esa $1$.
To‘liq grafning tugun bog‘liqligini $n-1$ deb aniqlaymiz.
Boshqa barcha graflar uchun tugun bog‘liqligi $n-2$ dan oshmaydi, chunki qirra bilan bog‘lanmagan ikkita tugunni topib, qolgan $n-2$ ta tugunning barchasini olib tashlash mumkin.
Agar $G$ grafdan $T$ dagi barcha tugunlarni olib tashlagach, $s$ va $t$ tugunlar turli bog‘langan komponentlarda qolsa, $T$ tugunlar to‘plami $s$ va $t$ tugunlarni **ajratadi** deymiz.

Grafning tugun bog‘liqligi barcha mumkin bo‘lgan $(s,t)$ juftlari orasida ikki $s$ va $t$ tugunni ajratadigan shunday to‘plamning minimal hajmiga tengligi ravshan.

## Xossalar

### Whitney tengsizliklari

**Whitney tengsizliklari** (1932) qirra bog‘liqligi $\lambda$, tugun bog‘liqligi $\kappa$ va grafdagi istalgan tugunning minimal darajasi $\delta$ orasidagi bog‘lanishni beradi:

$$\kappa \le \lambda \le \delta$$

Intuitiv ravishda, grafni uzadigan $\lambda$ o‘lchamli qirralar to‘plamimiz bo‘lsa, har bir qirraning uchlaridan birini tanlab, grafni ham uzadigan tugunlar to‘plamini yaratishimiz mumkin.
Bu to‘plamning hajmi $\le \lambda$.
Agar minimal darajasi $\delta$ bo‘lgan tugunni tanlab, unga tutash barcha qirralarni olib tashlasak, yana uzilgan graf hosil bo‘ladi.
Shu sababli ikkinchi tengsizlik $\lambda \le \delta$.
Whitney tengsizliklarini yaxshilab bo‘lmasligi qiziq:
ya’ni bu tengsizlikni qanoatlantiradigan istalgan uchta son uchun kamida bitta mos graf mavjud.
Shunday graflardan birini quyidagicha qurish mumkin:
graf $2(\delta+1)$ ta tugundan iborat bo‘ladi; dastlabki $\delta+1$ ta tugun clique hosil qiladi (har bir tugunlar jufti qirra bilan bog‘langan), keyingi $\delta+1$ ta tugun esa ikkinchi clique hosil qiladi.
Bundan tashqari, ikki clique’ni $\lambda$ ta qirra bilan shunday bog‘laymizki, bunda birinchi clique’da $\lambda$ ta turli tugun, ikkinchi clique’da esa faqat $\kappa$ ta tugun ishlatiladi.
Hosil bo‘lgan graf uchala xususiyatga ham ega bo‘ladi.

### Ford–Fulkerson teoremasi

**Ford–Fulkerson teoremasi** ikki tugunni bog‘laydigan qirra bo‘yicha kesishmaydigan yo‘llarning eng katta soni shu tugunlarni ajratadigan qirralarning eng kichik soniga tengligini anglatadi.

## Qiymatlarni hisoblash

### Maksimal oqim yordamida qirra bog‘liqligi

Bu usul Ford–Fulkerson teoremasiga asoslanadi.

Barcha $(s,t)$ tugunlar juftlari bo‘yicha yuramiz va har bir juft orasida kesishmaydigan yo‘llarning eng katta sonini topamiz.
Bu qiymatni maksimal oqim algoritmi yordamida topish mumkin:
$s$ ni manba, $t$ ni qabul qiluvchi qilib, har bir qirraga $1$ sig‘im beramiz.
Shunda maksimal oqim kesishmaydigan yo‘llar soniga teng.
[Edmonds–Karp](../graph/edmonds_karp.md) ishlatadigan algoritmning murakkabligi $O(V^2VE^2)=O(V^3E^2)$.
Ammo bu bahoda yashirin ko‘paytuvchi borligini qayd etish kerak, chunki maksimal oqim algoritmi barcha manba va qabul qiluvchilar uchun sekin ishlaydigan graf yaratish amalda deyarli mumkin emas.
Ayniqsa, tasodifiy graflarda algoritm ancha tez ishlaydi.

### Qirra bog‘liqligi uchun maxsus algoritm

Qirra bog‘liqligini topish masalasi **global minimal kesim**ni topish masalasiga teng.

Bu masala uchun maxsus algoritmlar ishlab chiqilgan.
Ulardan biri $O(V^3)$ yoki $O(VE+V^2\log V)$ vaqtda ishlaydigan [Stoer–Wagner algoritmi](stoer_wagner_mincut.md).

### Tugun bog‘liqligi

Yana barcha $s$ va $t$ tugunlar juftlari bo‘yicha yuramiz va har bir juft uchun $s$ va $t$ ni ajratadigan tugunlarning minimal sonini topamiz.

Bunda avvalgi bo‘limlarda tasvirlangan maksimal oqim yondashuvini qo‘llashimiz mumkin.
$x\ne s$ va $x\ne t$ bo‘lgan har bir $x$ tugunni $x_1$ va $x_2$ ikkita tugunga ajratamiz.
Bu ikki tugunni sig‘imi $1$ bo‘lgan $(x_1,x_2)$ yo‘naltirilgan qirra bilan bog‘laymiz va barcha $(u,v)$ qirralarni har ikkisining sig‘imi $1$ bo‘lgan $(u_2,v_1)$ va $(v_2,u_1)$ yo‘naltirilgan qirralarga almashtiramiz.
Qurilishdan kelib chiqib, maksimal oqim qiymati $s$ va $t$ ni ajratish uchun kerak bo‘ladigan tugunlarning minimal soniga teng bo‘ladi.

