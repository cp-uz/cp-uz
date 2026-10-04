> IOI 2023 rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). PDF - asosiy manba: diagrammalar, indekslar va murakkab formulalarni rasmiy PDFdan tekshiring.

Seged universitetining sun'iy intellekt bo'yicha tadqiqotchilari robotlarni dasturlash bo'yicha contest o'tkazmoqda. Sizning do'stingiz Hanga contestda ishtirok etishga qaror qildi. Maqsad, Vengriyaning mashhur podachi it zoti Pulining buyuk aql-zakovatiga qoyil qolgan holda, yakuniy _Pulibot_ ni dasturlashdir.

Pulibot ( $H $ + 2) × ( $ W $ + 2) katakchalardan tashkil topgan jadval shaklidagi labirintda sinovdan o'tkaziladi. Jadval satrlari shimoldan janubga −1 dan $ H $ gacha va ustunlari g'arbdan sharqqa −1 dan $ W $ gacha raqamlangan. Jadvalning $ r $ ($-1 \le r \le H$ ) satrida va $ c $ ($-1 \le c \le W$ ) ustunida joylashgan katakka ( $ r $ , $ c$ ) katak sifatida murojaat qilamiz.

$0 \le r < H $ va $0 \le c < W $ bo'ladigan ( $r $ , $ c $ ) katakchasini ko'rib chiqaylik. ( $ r $ , $ c$ ) katagiga **qo‘shni** 4 kataklar mavjud:

- ( $r $ , $ c - 1$) katak ( $ r $ , $ c$ ) katakning **g'arb** idagi katak deb ataladi;

- ( $r $ + 1, $ c $ ) katak ( $ r $ , $ c$ ) katakning **janub** idagi katak deb ataladi;

- ( $r $ , $ c $ + 1) katak ( $ r $ , $ c$ ) katakning **sharq** idagi katak deb ataladi;

- ( $r - 1$, $ c $ ) katak ( $ r $ , $ c$ ) katakning **shimol** idagi katak deb ataladi;

Agar $r = -1$ yoki $r = H$ yoki $c = -1$ yoki $c = W$ boʻlsa, ( $r $ , $ c$ ) katak labirintning **chegara** katagi deb ataladi. Labirintning chegara katagi bo'lmagan har bir katak **to'siq** katak yoki **bo'sh** katakdir. Bundan tashqari, har bir bo'sh katakda 0 va $Z_{\mathrm{MAX}}$ oralig'idagi nomanfiy butun son bilan ifodalangan **rang** mavjud. Dastlab, har bir bo'sh katakning rangi 0 ga teng.

Misol uchun, tarkibida bitta (1,3) katagida to'siq mavjud bo'lgan $H = 4$ va $W = 5$ labirintni ko'ring:

Yagona to'siq katakchasi X shaklida belgilangan. Labirintning chegara kataklari soyali fonda. Har bir bo'sh katakdagi raqam uning rangini ifodalaydi.

$(r_0,c_0)$ katakdan $(r_\ell,c_\ell)$ katagiga $\ell$ ($\ell>0$) uzunlikdagi **yo‘l** deb bir-biridan farqli $(r_0,c_0),(r_1,c_1),\ldots,(r_\ell,c_\ell)$ juftliklardan tashkil topgan hamda har bir $i$ ($0 \le i < \ell$) uchun $(r_i,c_i)$ va $(r_{i+1},c_{i+1})$ kataklari qoʻshni bo'lgan ketma-ketlikka aytiladi.

E'tibor bering, ℓ uzunlikdagi yo'lda aynan ℓ+ 1 ta katakchalar mavjud.

Contestda tadqiqotchilar (0,0) katakdan ( $H - 1$, $ W - 1$) katakgacha kamida bitta yo'l mavjud bo'lgan labirint o'rnatdilar. Bu (0,0) va ( $ H - 1$, $ W - 1$) kataklari bo'sh bo'lishi kafolatlanganligini bildiradi.

Hanga labirintning qaysi kataklari bo'sh va qaysi kataklari to'siq ekanligini bilmaydi.

Sizning vazifangiz Hangaga tadqiqotchilar tomonidan oʻrnatilgan nomaʼlum labirintda Pulibotni (0,0) katakdan ( $H - 1$, $ W - 1$) katagiga _eng qisqa yo'l_ (ya'ni minimal uzunlikdagi yo'l)ni topishga qodir bo'lishi uchun dasturlashda yordam berishdir. Pulibot spetsifikatsiyasi va tanlov qoidalari quyida tushuntirilgan.

E'tibor bering, ushbu masala shartining oxirgi qismida siz Pulibotni vizualizatsiya qilish uchun foydalanishingiz mumkin bo'lgan tool tasvirlangan.

### Pulibot ning Spetsifikatsiyasi

Har bir $-1 \le r \le H$ va $-1 \le c \le W$ uchun ( $r $ , $ c$ ) katakning **holat** ini quyidagi shaklda butun son sifatida aniqlang:

- agar ( $r $ , $ c $ ) katak chegara katagi bo'lsa, uning holati −2; agar ( $ r $ , $ c$ ) katak to'siq katak bo'lsa, uning holati −1;

- agar ( $r $ , $ c$ ) katak bo'sh katak bo'lsa, uning holati shu katakning rangiga teng;

Pulibot dasturi qadamlar ketma-ketligi sifatida bajariladi. Har bir qadamda Pulibot yaqin atrofdagi kataklarning holatini aniqlaydi va keyin ko'rsatmalarni bajaradi. U bajaradigan ko'rsatma aniqlangan holatlarga asoslangan holda bajariladi. Quyida yanada aniqroq tushuntirilgan

Faraz qilaylik, joriy bosqichning boshida Pulibot bo'sh katak bo'lgan ( $r $ , $ c$ ) katakchasida. Bosqich quyidagicha amalga oshiriladi:

1. Dastlab, Pulibot joriy **holat massivi** ni, ya’ni ( $r $ , $ c $ ) katak va barcha qoʻshni kataklarning holatidan tashkil topgan $ S $ = [ $ S[0]$, $ S[1]$, $ S[2]$, $ S[3]$, $ S[4]$] massivini aniqlaydi: $ S[0]$ - ( $ r $ , $ c $ ) katakning holati. $ S[1]$ - g'arbdagi katakning holati. $ S[2]$ - janubdagi katakning holati. $ S[3]$ - sharqdagi katakning holati.

$S[4]$ - shimoldagi katakning holati.

2. Keyin Pulibot aniqlangan holatlar massiviga mos keladigan **ko'rsatma** ( $Z $ , $ A$ )ni aniqlaydi.

3. Oxirida, Pulibot ushbu ko'rsatmani bajaradi: u ( $r $ , $ c $ ) katak rangiga $ Z $ rangini o'rnatadi va keyin u quyidagi amallardan biri bo'lgan $ A$ amalini bajaradi:

   - ( $r $ , $ c$ ) katagida _qoladi_ ;

   - 4 ta qo'shni kataklaridan biriga _o'tadi_ ;

   - dasturni _tugatadi_ .

Misol uchun, quyidagi rasmning chap tomonida ko'rsatilgan holatni ko'rib chiqing. Pulibot hozirda 0 rangi bilan (0,0) katagida. Pulibot $S$ = [0,−2,2,2,−2] holat massivini aniqlaydi. Pulibotda ushbu massivni aniqlab, joriy katak rangini $ Z = 1$ ga o'zgartiradigan va keyin sharqqa siljiydigan dastur bo'lishi mumkin, rasmning o'rtasida va o'ng tomonida ko'rsatilgandek:

### Robot Contest qoidalari

- Boshida Pulibot (0,0) katakka joylashtiriladi va o'z dasturini bajarishni boshlaydi.

- Pulibot bo'sh bo'lmagan katakka o'tishi mumkin emas.

- Pulibot dasturi ko'pi bilan 500 000 qadamdan so'ng tugatilishi kerak.

- Pulibot dasturi tugatilgandan so'ng, labirintdagi bo'sh kataklar quyidagicha ranglanishi kerak:

   - (0,0) dan ( $H - 1$, $ W - 1$) gacha bo'lgan eng qisqa yo'l mavjud bo'lib, bu yo'ldagi har bir katakning rangi 1 ga teng.

   - Boshqa barcha bo'sh kataklarning rangi 0.

- Pulibot o'z dasturini istalgan bo'sh katakda tugatishi mumkin.

Misol uchun, quyidagi rasmda $H = W = 6$ bilan mumkin bo'lgan labirint ko'rsatilgan. Chap tomonda boshlang'ich konfiguratsiya ko'rsatiladi va o'ng tomonda tugatilgandan so'ng bo'sh kataklarning bo'lishi mumkin bo'lgan bitta ranglanishi ko'rsatiladi:

## Implementatsiya tavsilotlari

Siz quyidagi protsedurani implement qilishingiz kerak

```
void program_pulibot()
```

- Ushbu protsedura Pulibot dasturini ishlab chiqishi kerak. Ushbu dastur $H$ va $W$ ning barcha qiymatlari va vazifa cheklovlariga javob beradigan har qanday labirint uchun to'g'ri ishlashi kerak.

- Ushbu protsedura har bir test uchun bir marta chaqiriladi.

Ushbu protsedura Pulibot dasturini yaratish uchun quyidagi protseduraga murojaat qilishi mumkin:

```
void set_instruction(int[] S, int Z, char A)
```

- $S$ : 5 uzunlikdagi holatlar massivi.

- $Z$ : rangni ifodalovchi manfiy boʻlmagan butun son.

- $A$ : Pulibot harakatini ifodalovchi bitta belgi:

- $S$ : array of length 5 describing a state array.

- $Z$ : a nonnegative integer representing a color.

- $A$ : a single character representing an action of Pulibot as follows:

   - H : o'z o'rnida qolish;

   - W : g arbga o tish;

   - S : janubga o'tish;

   - E : sharqqa o'tish;

   - N : shimolga o'tish;

   - T : dasturni tugatish.

- Ushbu protsedurani chaqirish Pulibotga $S$ holat massivini tanib olgandan so'ng ( $Z $ , $ A$ ) ko'rsatmasini bajarishini buyuradi.

Ushbu protsedurani bir xil $S$ holat massivi bilan bir necha marta chaqirish Output isn't correct verdictiga olib keladi.

Har bir mumkin boʻlgan $S$ holat massivi bilan “set_instruction” ga murojaat qilish shart emas. Biroq, agar Pulibot keyinchalik ko'rsatma o'rnatilmagan holat massivini tanib olsa, siz Output isn't correct verdictini olasiz.

program_pulibot tugallangandan so'ng, greyder bir yoki bir nechta labirintlar orqali Pulibot dasturini ishga tushiradi. Ushbu chaqiruvlar sizning yechimingiz uchun belgilangan vaqt chegarasida _hisoblanmaydi_ . Greyder _adaptiv emas_ , ya'ni har bir test holatida labirintlar to'plami oldindan belgilangan.

Agar Pulibot o'z dasturini tugatishdan oldin Robot tanlovi qoidalaridan birini buzsa, siz Output isn't correct verdictini olasiz.

## Misol

program_pulibot protsedurasi  set_instruction ga quyidagi tarzda murojaat qilishi mumkin:

|**Murojaat**|**Holatlar massivi**_S_**uchun ko'rsatma**|
|---|---|
|set_instruction([0, -2, -1, 0, -2], 1,<br>E)|1rangini o'rnating va sharqqa<br>harakatlaning|
|set_instruction([0, 1, -1, 0, -2], 1,<br>E)|1rangini o'rnating va sharqqa<br>harakatlaning|
|set_instruction([0, 1, 0, -2, -2], 1,<br>S)|1rangini o'rnating va janubga<br>harakatlaning|
|set_instruction([0, -1, -2, -2, 1], 1,<br>T)|1rangini o'rnating va dasturni yakunlang|

Quyidagi rasmda $H = 2$ va $W = 3$ boʻlgan labirint holatini koʻrib chiqing.

Ushbu maxsus labirint uchun Pulibot dasturi to'rt bosqichda ishlaydi. Pulibot taniydigan holat massivlari va u bajaradigan ko'rsatmalar yuqorida keltirilgan set_instruction ga to'rtta

murojaat to'liq mos keladi. Ushbu ko'rsatmalarning oxirgisi dasturni tugatadi.

Quyidagi rasmda to'rt bosqichning har biridan oldin va tugatishdan keyingi yakuniy ranglar ko'rsatilgan.

However, do note that this program of 4 instructions might not find a shortest path in other valid mazes. Therefore, if submitted, it will receive an  Output isn't correct verdict.

## Cheklovlar

$Z_{\mathrm{MAX}}$ = 19. Shunday qilib, Pulibot 0 dan 19 gacha bo'lgan ranglardan foydalanishi mumkin.

Pulibotni sinash uchun ishlatiladigan har bir labirint uchun:

- $2 \le H $ , $ W \le 15$

- (0,0) katakdan ( $H - 1$, $ W - 1$) katagiga kamida bitta yo'l bor.

## Subtasklar

1. (6 points) Labirintda hech qanday to'siq kataklar yo'q.

2. (10 points) $H = 2$

3. (18 points) Har bir bo'sh katakchalar o'rtasida aynan bitta yo'l bor, ya'ni bo'sh kataklar daraxt shaklida.

4. (20 points) (0,0) katakdan ( $H - 1$, $ W - 1$) katakgacha bo'lgan har bir eng qisqa yo'l $ H$ + $ W - 2$ uzunlikka ega.

5. (46 points) Hech qanday qo'shimcha cheklovlarsiz.

Agar test holatlarining birortasida set_instruction protsedurasiga yoki uning bajarilishi bo'yicha Pulibot dasturiga murojaatlar amalga oshirish tafsilotlarida tasvirlangan cheklovlarga mos kelmasa, ushbu subtask uchun yechimingiz bahosi 0 bo'ladi.

Har bir subtaskda siz deyarli to'g'ri rang berish orqali qisman ball olishingiz mumkin.

#### Rasmiy ravishda:

- Test ishining yechimi **to'liq** , agar bo'sh kataklarning yakuniy rangi Robot tanlovi qoidalariga javob bersa.

- Sinov ishining yechimi **qisman** , agar yakuniy rang quyidagicha ko'rinsa:

   - (0,0) dan ( $H - 1$, $ W - 1$) gacha bo'lgan eng qisqa yo'l mavjud bo'lib, uning uchun yo'lga kiritilgan har bir katakning rangi 1.

   - Jadvalda 1 rangli boshqa bo'sh katak yo'q.

   - Jadvaldagi baʼzi boʻsh kataklarning rangi 0 va 1 dan boshqa rangga ega.

Agar test ishi bo'yicha yechimingiz to'liq yoki qisman bo'lmasa, tegishli test ishi uchun ballingiz 0 bo'ladi.

1-4 subtasklarda toʻliq yechim uchun ball 100% ni tashkil qiladi va test ishining qisman yechimi uchun ball uning subtaski uchun ballning 50% ni tashkil qiladi.

5-subtaskda sizning ballingiz Pulibot dasturida ishlatiladigan ranglar soniga bog'liq. Aniqroq qilib aytganda, $Z^\star$ bilan set_instruction ga qilingan barcha murojaatlar uchun $ Z$ maksimal qiymatiga bog'liq. Ya'ni test ishining balli quyidagi jadval bo'yicha hisoblanadi:

|**Condition**|**Score (complete)**|**Score (partial)**|
|---|---|---|
|$11 \le Z^\star \le 19$|$20+(19-Z^\star)$|$12+(19-Z^\star)$|
|$Z^\star = 10$|31|23|
|$Z^\star = 9$|34|26|
|$Z^\star = 8$|38|29|
|$Z^\star = 7$|42|32|
|$Z^\star \le 6$|46|36|

Har bir subtask uchun ball subtaskdagi test holatlari uchun ballarning minimalidir.

## namuna Graderi

Namunaviy greyder kiritilgan ma'lumotlarni quyidagi formatda o'qiydi:

- 1 - qatorda: _H W_

- 2 + $r $ ($0 \le r < H $ ) - qatorda: $ m[r]$[0] $ m[r]$[1] … $ m[r]$[ $ W - 1$]

Bu yerda _m W_ ta qator va $H$ ustunli massivlar massivi boʻlib, labirintning chegaralanmagan kataklarini tavsiflaydi. $m[r]$[ $ c $ ] = 0, agar ( $ r $ , $ c $ ) katak boʻsh katak boʻlsa, $ m[r]$[ $ c $ ] = 1, agar ( $ r $ , $ c$ ) katak toʻsiq boʻlsa.

Namuna grayderi birinchi program_pulibot() ga murojaat qiladi. Agar namunaviy greyder protokol buzilishini aniqlasa, namunaviy greyder  `Protocol Violation: <MSG>` ni chop etadi va tugatadi, bunda  `<MSG>` quyidagi xato xabarlaridan biri hisoblanadi:

- Invalid array : −$2 \le S[i]$ ≤ $Z_{\mathrm{MAX}}$ ba'zi $ i$ uchun mos kelmaydi yoki $ S$ uzunligi 5 emas. Invalid color : $0 \le Z$ ≤ $Z_{\mathrm{MAX}}$ oraliqda emas.

- Invalid action : character $A$ belgisi  H,  W ,  S ,  E ,  N yoki  T lardan biri emas.

- Same state array : set_instruction bir xil $S$ massivi bilan kamida ikki marta chaqirilgan.

Aks holda,  program_pulibot tugallangandan so'ng, namunaviy greyder input bilan tavsiflangan labirintda Pulibot dasturini bajaradi.

Namuna greyderi ikkita natijani ishlab chiqaradi.

Birinchidan, namunaviy grader ishchi katalogdagi robot.bin fayliga Pulibotning harakatlari jurnalini yozadi. Ushbu fayl keyingi bo'limda tasvirlangan vizualizatsiya vositasining kirishi bo'lib xizmat qiladi.

Ikkinchidan, agar Pulibot dasturi muvaffaqiyatli yakunlanmasa, namunaviy grader quyidagi xato xabarlaridan birini chop etadi:

- Unexpected state : Pulibot  set_instruction chaqirilmagan holat massivini tan oldi. Invalid move : harakatni bajarish Pulibotning bo'sh bo'lmagan katakka o'tishiga olib keldi. Too many steps : Pulibot dasturni tugatmasdan 500 000 qadamlarni bajardi.

Aks holda, $e[r]$[ $ c $ ] ( $ r $ , $ c $ ) katakning Pulibot dasturi tugagandan keyingi holati boʻlsin. Namuna greyder $ H$ ta qatorni quyidagi formatda chop etadi:

1 + $r $ ($0 \le r < H $ ) - qatorda: $ e[r]$[0] $ e[r]$[1] … $ e[r]$[ $ W - 1$]

## Display Tool

Ushbu topshiriq uchun biriktirma paketida display.py nomli fayl mavjud. Chaqirilsa, ushbu Python skripti Pulibotning harakatlarini namunaviy grader kiritishi bilan tasvirlangan labirintda aks ettiradi. Buning uchun  robot.bin ikkilik fayli ishchi katalogda bo'lishi kerak.

Skriptni chaqirish uchun quyidagi buyruqni bajaring.

python3 display.py

Oddiy grafik interfeys paydo bo'ladi. Asosiy xususiyatlar quyidagilardan iborat:

Siz to'liq labirintning holatini kuzatishingiz mumkin. Pulibotning joriy joylashuvi to'rtburchak bilan ifodalangan.

- Siz yo'nalish tugmachalarini bosish yoki ularning tezkor tugmachalarini bosish orqali Pulibot qadamlarini ko'rib chiqishingiz mumkin. Bundan tashqari, ma'lum bir bosqichga o'tishingiz mumkin.

- Pulibot dasturining kelgusi bosqichi quyida ko'rsatilgan. U joriy holat massivini va u bajaradigan ko'rsatmani ko'rsatadi. Yakuniy bosqichdan so'ng, u greyderning xato xabarlaridan birini yoki dastur muvaffaqiyatli tugatilgan bo'lsa,  Terminated ko'rsatadi.

- Rangni ifodalovchi har bir raqamga siz vizual fon rangini, shuningdek, displey matnini belgilashingiz mumkin. Displey matni bu rangga ega bo'lgan har bir katakda paydo bo'ladigan qisqa qatordir. Siz quyidagi usullardan birida fon ranglarini belgilashingiz va matnlarni ko'rsatishingiz mumkin:

   - Colors tugmasini bosgandan so'ng ularni dialog oynasida o'rnating.

   - colors.txt fayli mazmunini tahrirlang.

- robot.bin ni qayta yuklash uchun Reload tugmasidan foydalaning. robot.bin tarkibi o'zgargan bo'lsa, bu foydali bo'ladi.
