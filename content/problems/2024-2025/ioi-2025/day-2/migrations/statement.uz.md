> IOI 2025 rasmiy arxividagi o‘zbekcha tarjima (CC BY). Diagrammalar va asl sahifa tartibi uchun rasmiy PDFdan foydalaning.

Tabiat tarixi muzeyi Boliviyadagi dinozavrlarning migratsiya usullarini o'rganmoqda.
Paleontologlar dinozavr izlarini $N$ ta turli hududlarda topdilar, ularning yoshi kamayish tartibida $0$ dan $N - 1$ gacha raqamlangan: bu yerda $0$ - hudud eng qadimgi iz, $N - 1$ - hudud esa eng yosh iz hisoblanadi.

Dinozavrlar har bir hududga ( $0$ - hududdan tashqari) ma'lum, eski hududdan ko'chib o'tgan.
Har bir $i$ ($1 \leq i \leq N - 1$) - hudud uchun aynan bitta eski $P[i]$ ($P[i] < i$) hududi mavjud bo'lib, ba'zi dinozavrlar to'g'ridan-to'g'ri $P[i]$ - hududdan $i$ - hududga ko'chib o'tgan.
Bitta eski hudud bir nechta yosh hududlarga ko'chish manbai bo'lishi mumkin.

Paleontologlar har bir migratsiyani $i$ va $P[i]$ hududlari oʻrtasida **yoʻnaltirilmagan bogʻlanish** sifatida modellashtirishdi.
Bunda har qanday ikkita alohida $x$ va $y$ hududlari uchun bog'lanishlar ketma-ketligini yurib o'tish orqali $x$ dan $y$ gacha sayohat qilish mumkin.
$x$ va $y$ hududlari orasidagi **masofa** deb $x$ dan $y$ gacha sayohat qilish uchun zarur bo'lgan bog'lanishlarning minimal soniga aytiladi.

Misol uchun, quyidagi rasmda $N = 5$ ta hududlardan iborat boʻlgan holat koʻrsatilgan, bu yerda $P[1] = 0$, $P[2] = 1$, $P[3] = 2$ va $P[4] = 2$.<br>
$3$ - hududdan $4$ - hududga $2$ ta bog'lanish orqali sayohat qilish mumkin, shuning uchun ular orasidagi masofa $2$ ga teng.


<div style="width: 50%; margin: auto;">
_Diagramma rasmiy PDFda keltirilgan._
</div>

Muzeyning maqsadi mumkin bo'lgan eng maksimal masofaga ega bo'lgan hududlar juftligini aniqlashdan iborat.

E'tibor bering, bu juftlik yagona bo'lishi shart emas: masalan, yuqoridagi misolda $(0, 3)$ va $(0, 4)$ juftliklari $3$ masofaga ega, bu maksimaldir. Bunday hollarda maksimal masofaga erishgan har qanday juftlik to'g'ri hisoblanadi.

Dastlab $P[i]$ qiymatlari **nomaʼlum**.
Muzey $1, 2, \ldots, N-1$ hududlariga aynan shu tartibda tashrif buyurish uchun tadqiqot guruhini yuboradi.
Tadqiqotchilar guruhi har bir $i$ ( $1 \leq i \leq N-1$ ) - hududga yetib borgach, quyidagi amallarning ikkalasini ham bajaradi:
* $P[i]$ qiymatini, ya'ni $i$ - hududga migratsiya manbasini aniqlaydi.
* Oldin toʻplangan maʼlumotlarga asoslanib, muzeyga **bitta** xabar yuborish yoki ushbu hududdan hech qanday xabar yubormaslik toʻgʻrisida qaror qabul qiladi.

Xabarlar qimmat sun'iy yo'ldosh aloqa tizimi orqali uzatiladi, shuning uchun har bir xabar $1$ dan $20\,000$ gacha bo'lgan butun son bo'lishi kerak.
Bundan tashqari, tadqiqotchilar guruhiga **ko'pi bilan $50$ ** ta xabar yuborishga ruxsat etilgan.

Sizning vazifangiz quyidagi strategiyani implement qilishdan iborat:
* Tadqiqotchilar guruhi xabar yuboriladigan hududni hamda yuboriladigan xabarning qiymatini tanlaydi.
* Muzey olingan xabarlarning qiymatidan va qaysi hududlardan olinganligiga asoslanib maksimal masofaga ega hududlar juftligini aniqlashi mumkin.

Sun'iy yo'ldosh orqali katta qiymatlarni yuborish qimmatga tushadi. Sizning ballingiz yuborilgan eng yuqori butun songa va uzatilgan xabarlarning umumiy soniga bog'liq bo'ladi.

## Implement tafsilotlari

Siz ikkita protsedurani implement qilishingiz kerak; biri tadqiqot guruhi uchun, ikkinchisi muzey uchun.

**tadqiqot guruhi** uchun implement qilishingiz kerak bo'lgan protsedura:

```
int send_message(int N, int i, int Pi)
```

* $N$ : oyoq izlari bo'lgan hududlar soni.
* $i$ : tadqiqot guruhi hozir tashrif buyurayotgan hudud indeksi.
* $Pi$ : $P[i]$ qiymati.
* Ushbu protsedura har bir test case uchun $N-1$ marta, $i = 1, 2, ... , N-1$ tartibida chaqiriladi.

Ushbu protsedura $i$ - hududda tadqiqot guruhi tomonidan bajarilgan harakatni ko'rsatib $S[i]$ qiymatini qaytarishi kerak:
* $S[i] = 0$ : tadqiqot guruhi $i$ - hududdan xabar yubormaslikka qaror qilsa.
* $1 \leq S[i] \leq 20\,000$ : tadqiqot guruhi $i$ hududdan xabar sifatida $S[i]$ butun sonini yuborishga qaror qilsa.

**Muzey** uchun implement qilishingiz kerak bo'lgan protsedura:

```
std::pair<int,int> longest_path(std::vector<int> S)
```

* $S$ : $N$ uzunlikdagi massiv bo'lib:
    * $S[0] = 0$ .
    * Har bir $1 \leq i \leq N-1$ uchun $S[i]$ `send_message(N, i, Pi)` tomonidan qaytariladigan butun sondir.
* Ushbu protsedura har bir test case uchun bir marta chaqiriladi.

Ushbu protsedura maksimal masofaga ega bir juft hududni $(U, V)$ ko'rinishida qaytarishi kerak.

Haqiqiy baholashda yuqoridagi protseduralarni chaqiruvchi dastur **aniq ikki marta** ishga tushiriladi.
* Dasturning birinchi ishga tushirilishida:
    * `send_message` aynan $N - 1$ marta chaqiriladi.
    * **Dasturingiz ketma-ket chaqiruvlar davomida ma’lumotlarni saqlashi mumkin.**
    * Qaytarilgan qiymatlar ( $S$ massivi) baholash tizimi tomonidan saqlanadi.
    * Ba'zi hollarda greyderning hatti-harakati **moslashuvchan**. Bu shuni anglatadiki, `send_message` ga chaqiruvdagi $P[i]$ qiymati tadqiqot guruhining oldingi chaqiruvlar davomida qilgan harakatlariga bog'liq bo'lishi mumkin.
* Dasturning ikkinchi ishga tushirilishida:
    * `longest_path` aynan bir marta chaqiriladi. `longest_path` uchun mavjud bo'lgan yagona ma'lumot birinchi ishga tushirishda olingan $S$ massividir.

## Cheklovlar

* $N = 10\,000$
* Har bir $i$ ($1 \leq i \leq N-1$) uchun $0 \leq P[i] < i$.

## Subtask lar va Ball

| Subtask | Ball | Qo'shimcha cheklovlar     |
|:-------:|:-----:| -------------------------- |
| 1       | $30$  | Maksimal masofaga ega juftliklardan birida $0$ - hudud ishtirok etadi. |
| 2       | $70$  | Qo'shimcha cheklovlarsiz. |

$Z$ qiymati $S$ massivida mavjud bo'lgan maksimal butun son bo'lsin va $M$ tadqiqot guruhi tomonidan yuborilgan xabarlar soni bo'lsin.

Test case larning birortasida, agar quyidagi shartlardan kamida bittasi bajarilsa, ushbu test case bo‘yicha yechimingiz bahosi $0$ bo‘ladi (CMSda `Output isn't correct` deb xabar qilinadi):
* $S$ dagi kamida bitta element qiymati yaroqsiz.
* $Z > 20\,000$ yoki $M > 50$ .
* `longest_path` protsedurasi qaytargan natija noto'g'ri.

Aks holda, 1-subtask uchun ballingiz quyidagicha hisoblanadi:

| Holat                    | Ball  |
|:----------------------------:|:------:|
| $9\,998 \leq Z \leq 20\,000$ | $10$   |
| $102 \leq Z \leq 9 997$      | $16$   |
| $5 \leq Z \leq 101$          | $23$   |
| $Z \leq 4$                   | $30$   |

2-subtask uchun ballingiz quyidagicha hisoblanadi:

| Holat                          | Ball                                         |
|:----------------------------------:|:---------------------------------------------:|
| $5 \leq Z \leq 20\,000$ va $M \leq 50$            | $35 - 25 \log_{4000}\left(\frac{Z}{5}\right)$ |
| $Z \leq 4$ va $32 \leq M \leq 50$ | $40$                                          |
| $Z \leq 4$ va $9 \leq M \leq 31$        | $70 - 30 \log_{4}\left(\frac{M}{8}\right)$    |
| $Z \leq 4$ va $M \leq 8$          | $70$                                          |


## Misol

$N = 10\,000$ bo'lsin. $P[1] = 0$ , $P[2] = 1$ , $P[3] = 2$ , $P[4] = 2$ va $P[i] = 1$ ($i > 4$) boʻlgan vaziyatni koʻrib chiqaylik.

<div style="width: 50%; margin: auto;">
_Diagramma rasmiy PDFda keltirilgan._
</div>

Faraz qilaylik, tadqiqot guruhining strategiyasi har doim $10 \cdot V + U$ xabarini yuborishdir.
Maksimal masofaga ega bo'lgan $(U, V)$ hududlari juftligi `send_message` chaqiruvi natijasida o'zgaradi.

Dastlab, maksimal masofaga ega bo'lgan juftlik $(U, V) = (0, 0)$ dir.
Dasturni birinchi ishga tushirishda quyidagi chaqiruvlar ketma-ketligini ko'rib chiqing:

| Procedure chaqiruvi              | $(U, V)$ | Qaytarilgan natija ($S[i]$) |
|:----------------------------|:--------:|:------------:|
| `send_message(10000, 1, 0)` | $(0,1)$  | $10$ |
| `send_message(10000, 2, 1)` | $(0,2)$  | $20$ |
| `send_message(10000, 3, 2)` | $(0,3)$  | $30$ |
| `send_message(10000, 4, 2)` | $(0,3)$  | $0$  |

E'tibor bering, qolgan barcha chaqiruvlarda $P[i]$ qiymati $1$ ga teng.
Bu shuni anglatadiki, maksimal masofaga ega bo'lgan juftlik o'zgarmaydi va jamoa boshqa xabarlar yubormaydi.

Keyin, dasturning ikkinchi ishga tushirilganda quyidagi chaqiruv amalga oshiriladi:

```
longest_path([0, 10, 20, 30, 0, ...])
```

Muzey tadqiqot guruhi tomonidan yuborilgan so'nggi xabarni o'qiydi, u $S[3] = 30$ , va $(0, 3)$ maksimal masofaga ega bo'lgan hududlar juftligi ekanligini xulosa qiladi.
Shunday qilib, chaqiruv $(0, 3)$ qaytaradi.

E'tibor bering, bu yondashuv har doim ham Muzeyga maksimal masofaga ega juftlikni to'g'ri aniqlashga imkon bermaydi.

## Namunaviy greyder

Namunaviy greyder odatiy greyderlardan farqli holda bir marta ishga tushirilganda `send_message` va `longest_path` ketma-ketligida chaqiruvlarni amalga oshiradi.

Kirish formati:

```
N
P[1] P[2] ... P[N-1]
```

Chiqish formati:

```
S[1] S[2] ... S[N-1]
U V
```

Esda tutingki, siz $N$ ning istalgan qiymati bilan namunaviy greyderdan foydalanishingiz mumkin.
