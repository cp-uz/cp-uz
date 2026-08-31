---
article_id: game_theory--sprague-grundy-nim
---
# Sprague–Grundy teoremasi. Nim

## Kirish

Ushbu teorema ikki o‘yinchili **xolis** — inglizcha *impartial* — o‘yinlarni tavsiflaydi. Bunday o‘yinlarda mavjud yurishlar va yutish yoki yutqazish faqat o‘yin holatiga bog‘liq.
Boshqacha aytganda, ikki o‘yinchi orasidagi yagona farq — ulardan biri birinchi yurish qiladi.

Bundan tashqari, o‘yin **mukammal axborotli** deb faraz qilamiz: o‘yinchilardan hech qanday ma’lumot yashirilmagan, ular qoidalarni va mumkin bo‘lgan yurishlarni biladi.

O‘yin **chekli** deb olinadi, ya’ni ma’lum sondagi yurishdan keyin o‘yinchilardan biri yutqazuvchi holatga — undan boshqa holatga yurish qilib bo‘lmaydigan holatga — keladi.
Bunday holatni raqibiga qoldirgan o‘yinchi yutadi.
Tabiiyki, bu o‘yinda durang bo‘lmaydi.

Bunday o‘yinlarni *yo‘naltirilgan asiklik graf* yordamida to‘liq tasvirlash mumkin: tugunlar o‘yin holatlari, qirralar esa o‘tishlar — yurishlar — dir.
Chiquvchi qirrasi bo‘lmagan tugun yutqazuvchi tugun: shu tugundan yurish qilishi kerak bo‘lgan o‘yinchi yutqazadi.

Durang bo‘lmagani sababli barcha o‘yin holatlarini **yutuvchi** yoki **yutqazuvchi** deb tasniflash mumkin.
Yutuvchi holatlar — raqib eng yaxshi javoblarni tanlasa ham, uni muqarrar mag‘lubiyatga olib boradigan yurish mavjud bo‘lgan holatlar.
Yutqazuvchi holatlar — barcha yurishlar raqib uchun yutuvchi holatlarga olib boradigan holatlar.
Xulosa qilib aytganda, kamida bitta yutqazuvchi holatga o‘tish mavjud bo‘lsa, holat yutuvchi; bunday o‘tish bo‘lmasa, holat yutqazuvchi.

Vazifamiz — berilgan o‘yin holatlarini tasniflash.

Bunday o‘yinlar nazariyasi 1935-yilda Roland Sprague va 1939-yilda Patrick Michael Grundy tomonidan bir-biridan mustaqil ravishda ishlab chiqilgan.

## Nim

Bu o‘yin yuqorida sanab o‘tilgan cheklovlarga mos keladi.
Bundan tashqari, mukammal axborotli istalgan ikki o‘yinchili xolis o‘yinni Nim o‘yiniga keltirish mumkin.
Nimni o‘rganish boshqa barcha shunga o‘xshash o‘yinlarni yechishga imkon beradi; bu haqda keyinroq batafsil gaplashamiz.

Tarixan bu o‘yin qadim zamonlardan mashhur bo‘lgan.
Uning kelib chiqishi ehtimol Xitoyga borib taqaladi; hech bo‘lmaganda *Jianshizi* o‘yini unga juda o‘xshaydi.
Yevropadagi eng qadimgi ma’lumotlar XVI asrga tegishli.
O‘yinga nomni Charles Bouton bergan; u 1901-yilda o‘yinning to‘liq tahlilini e’lon qilgan.

### O‘yin tavsifi

Bir nechta tosh uyumi mavjud, har bir uyumda ma’lum sondagi tosh bor.
Bir yurishda o‘yinchi istalgan bitta uyumdan musbat sondagi toshni olib tashlashi mumkin.
Yurish qila olmaydigan o‘yinchi yutqazadi; bu barcha uyumlar bo‘sh bo‘lganda yuz beradi.

O‘yin holati musbat butun sonlarning multito‘plami bilan bir qiymatli tasvirlanadi.
Yurish tanlangan sonni qat’iy kamaytirishdan iborat; agar son nolga aylansa, u to‘plamdan olib tashlanadi.

### Yechim

Charles L. Bouton yechimi quyidagicha:

**Teorema.**
Joriy o‘yinchi faqat va faqat uyum o‘lchamlarining XOR-yig‘indisi nolga teng bo‘lmasa yutuvchi strategiyaga ega.
$a$ ketma-ketligining XOR-yig‘indisi $a_1 \oplus a_2 \oplus \ldots \oplus a_n$ ga teng; bu yerda $\oplus$ — bitlar bo‘yicha istisnoli YOKI amali.

**Isbot.**
Isbotning asosiy g‘oyasi raqib uchun **simmetrik strategiya** mavjudligidir.
XOR-yig‘indisi nol bo‘lgan holatga tushgan o‘yinchi uzoq muddatda uni noldan farqli qilib saqlab qola olmasligini ko‘rsatamiz: u XOR-yig‘indisi noldan farqli holatga o‘tsa, raqib doimo XOR-yig‘indisini yana nolga qaytaradigan yurishga ega bo‘ladi.

Teoremani matematik induksiya yordamida isbotlaymiz.

Bo‘sh Nim uchun — barcha uyumlar bo‘sh, ya’ni multito‘plam bo‘sh bo‘lganda — XOR-yig‘indi nolga teng va teorema to‘g‘ri.

Endi bo‘sh bo‘lmagan holatda turibmiz, deb faraz qilaylik.
Induksiya faraziga va o‘yinning asiklikligiga tayangan holda, joriy holatdan erishish mumkin bo‘lgan barcha holatlar uchun teorema isbotlangan deb olamiz.

Isbot ikki qismga bo‘linadi:
agar joriy holat uchun XOR-yig‘indi $s=0$ bo‘lsa, bu holat yutqazuvchi ekanini, ya’ni erishish mumkin bo‘lgan barcha holatlarda XOR-yig‘indi $t\neq0$ bo‘lishini ko‘rsatish kerak.
Agar $s\neq0$ bo‘lsa, $t=0$ bo‘lgan holatga olib boruvchi yurish mavjudligini ko‘rsatish kerak.

*   $s=0$ bo‘lsin va istalgan yurishni ko‘rib chiqaylik.
    Bu yurish bir uyumning $x$ o‘lchamini $y$ gacha kamaytiradi.
    $\oplus$ amalining elementar xossalaridan foydalanib, quyidagini olamiz:

    \[ t = s \oplus x \oplus y = 0 \oplus x \oplus y = x \oplus y \]

    $y<x$ bo‘lgani uchun $y\oplus x$ nol bo‘la olmaydi, demak $t\neq0$.
    Induksiya faraziga ko‘ra, erishish mumkin bo‘lgan har qanday holat yutuvchi; shuning uchun joriy holat yutqazuvchi.

*   $s\neq0$ bo‘lsin.
    $s$ sonining ikkilik yozuvini ko‘rib chiqamiz.
    Uning eng katta qiymatli nol bo‘lmagan biti indeksini $d$ deb belgilaylik.
    Yurishni $d$-biti o‘rnatilgan uyumda qilamiz. Bunday uyum albatta mavjud, aks holda $s$ da ham bu bit o‘rnatilmagan bo‘lardi.
    Uning $x$ o‘lchamini $y=x\oplus s$ gacha kamaytiramiz.
    $d$ dan katta pozitsiyalardagi barcha bitlar $x$ va $y$ da bir xil; $d$-bit esa $x$ da o‘rnatilgan, $y$ da o‘rnatilmagan.
    Shuning uchun $y<x$ va yurish qonuniy.
    Endi:

    \[ t = s \oplus x \oplus y = s \oplus x \oplus (s \oplus x) = 0 \]

    Demak, induksiya faraziga ko‘ra yutqazuvchi bo‘lgan erishiladigan holatni topdik; joriy holat yutuvchi.

**Natija.**
Nimning istalgan holatini XOR-yig‘indi o‘zgarmaydigan boshqa ekvivalent holat bilan almashtirish mumkin.
Bundan tashqari, bir nechta uyumli Nimni o‘lchami $s$ bo‘lgan bitta uyum bilan almashtirish mumkin.

### Misère o‘yini

**Misère o‘yini**da maqsad teskaridir: oxirgi toshni olib tashlagan o‘yinchi yutqazadi.
Ma’lum bo‘lishicha, misère Nimni deyarli oddiy Nim kabi optimal o‘ynash mumkin.
G‘oya avval misère o‘yinini oddiy Nim strategiyasi bilan o‘ynash, o‘yin oxiriga yaqin esa strategiyani almashtirishdir.
Yangi strategiyaga keyingi yurishdan so‘ng har bir uyumda ko‘pi bilan bittadan tosh qoladigan vaziyatda o‘tiladi.

Oddiy o‘yinda yurishdan keyin bittadan toshi bor uyumlar soni juft bo‘lishini ta’minlaymiz.
Misère o‘yinida esa bittadan toshi bor uyumlar soni toq bo‘ladigan yurishni tanlaymiz.
Bu strategiya ishlaydi, chunki strategiya almashtiriladigan holat o‘yin davomida albatta paydo bo‘ladi va bu holat yutuvchi: unda bittadan ortiq toshi bor aynan bitta uyum mavjud, shuning uchun Nim-yig‘indi nol emas.

## Xolis o‘yinlar va Nimning ekvivalentligi — Sprague–Grundy teoremasi

Endi istalgan xolis o‘yinning har bir holati uchun unga mos Nim holatini qanday topishni o‘rganamiz.

### Uyumni kattalashtirishga ruxsat berilgan Nim haqidagi lemma

Nimning quyidagi modifikatsiyasini ko‘rib chiqamiz: tanlangan uyumga **tosh qo‘shishga** ham ruxsat beriladi.
Qachon va qanday kattalashtirishga ruxsat berilishi haqidagi aniq qoidalar **biz uchun muhim emas**, biroq qoidalar o‘yinning **asiklik** bo‘lib qolishini ta’minlashi kerak. Keyingi bo‘limlarda misol o‘yinlar ko‘riladi.

**Lemma.**
Nimga kattalashtirish yurishlarini qo‘shish yutuvchi va yutqazuvchi holatlarni aniqlash usulini o‘zgartirmaydi.
Boshqacha aytganda, kattalashtirishlar foydasiz va yutuvchi strategiyada ulardan foydalanish shart emas.

**Isbot.**
O‘yinchi bir uyumga tosh qo‘shdi, deb faraz qilaylik. Raqibi uning yurishini oddiygina bekor qilishi — uyumdagi toshlar sonini avvalgi qiymatgacha kamaytirishi — mumkin.
O‘yin asiklik bo‘lgani uchun ertami-kechmi joriy o‘yinchi kattalashtirish yurishidan foydalana olmaydi va odatiy Nim yurishini qilishga majbur bo‘ladi.

### Sprague–Grundy teoremasi

Ikki o‘yinchili xolis o‘yinning $v$ holatini va undan bevosita erishish mumkin bo‘lgan $v_i$ holatlarni ko‘rib chiqamiz; bu yerda $i\in\{1,2,\dots,k\}$ va $k\geq0$.
$v$ holatiga o‘lchami $x$ bo‘lgan bitta uyumli, unga to‘liq ekvivalent Nim o‘yinini mos qo‘yish mumkin.
$x$ soni $v$ holatining **Grundy qiymati** yoki **nim-qiymati** deb ataladi.

Bundan tashqari, bu sonni quyidagi rekursiv formula bilan topish mumkin:

$$ x = \text{mex}\ \{ x_1, \ldots, x_k \}, $$

bu yerda $x_i$ — $v_i$ holatining Grundy qiymati, $\text{mex}$ — *minimum excludant* — esa berilgan to‘plamda uchramaydigan eng kichik manfiy bo‘lmagan butun son.

O‘yinni graf sifatida qarab, Grundy qiymatlarini chiqish qirrasi bo‘lmagan tugunlardan boshlab asta-sekin hisoblash mumkin.
Grundy qiymati nol bo‘lishi holat yutqazuvchi ekanini bildiradi.

**Isbot.**
Induksiya yordamida isbotlaymiz.

Yurishi bo‘lmagan tugunlar uchun $x$ qiymati bo‘sh to‘plamning $\text{mex}$ iga teng, ya’ni nol.
Bu to‘g‘ri, chunki bo‘sh Nim yutqazuvchi.

Endi boshqa istalgan $v$ tugunni ko‘rib chiqamiz.
Induksiya bo‘yicha unga erishiladigan tugunlarga mos $x_i$ qiymatlar allaqachon hisoblangan deb faraz qilamiz.

$p=\text{mex}\ \{x_1,\ldots,x_k\}$ bo‘lsin.
U holda istalgan $i\in[0,p)$ butun son uchun Grundy qiymati $i$ bo‘lgan erishiladigan tugun mavjudligini bilamiz.
Bu $v$ holati **uyumni kattalashtirishga ruxsat berilgan, o‘lchami $p$ bo‘lgan bitta uyumli Nim holatiga ekvivalent** ekanini anglatadi.
Bunday o‘yinda $p$ dan kichik har qanday o‘lchamdagi uyumga o‘tishlar va ehtimol $p$ dan katta o‘lchamdagi uyumlarga o‘tishlar mavjud.
Demak, $p$ haqiqatan ham joriy holatning kerakli Grundy qiymatidir.

## Teoremani qo‘llash

Nihoyat, istalgan ikki o‘yinchili xolis o‘yin uchun yutish yoki yutqazishni aniqlaydigan algoritmni tavsiflaymiz.

Berilgan holatning Grundy qiymatini hisoblash uchun:

* Ushbu holatdan barcha mumkin bo‘lgan o‘tishlarni toping.

* Har bir o‘tish **mustaqil o‘yinlar yig‘indisi**ga olib borishi mumkin; degenerativ holatda u bitta o‘yindan iborat.
  Har bir mustaqil o‘yinning Grundy qiymatini hisoblang va ularning XOR-yig‘indisini oling.
  Albatta, faqat bitta o‘yin bo‘lsa, XOR hech narsani o‘zgartirmaydi.

* Har bir o‘tish uchun Grundy qiymatini hisoblagach, joriy holat qiymatini shu sonlarning $\text{mex}$ i sifatida toping.

* Qiymat nol bo‘lsa, joriy holat yutqazuvchi; aks holda u yutuvchi.

Avvalgi bo‘limdan farqli ravishda, bu yerda o‘tishlar birlashtirilgan o‘yinlarga olib borishi mumkinligini hisobga olamiz.
Ularni uyum o‘lchamlari mustaqil o‘yinlarning Grundy qiymatlariga teng bo‘lgan Nim sifatida qaraymiz.
Bouton teoremasiga ko‘ra, oddiy Nimdagidek ularning XOR-yig‘indisini olish mumkin.

## Grundy qiymatlaridagi qonuniyatlar

Aniq masalalarni Grundy qiymatlari yordamida yechishda qiymatlar jadvalini tuzib, undagi **qonuniyatlarni izlash** ko‘pincha foydali.

Nazariy tahlili qiyin ko‘rinadigan ko‘plab o‘yinlarda Grundy qiymatlari davriy yoki oson tushuniladigan ko‘rinishga ega bo‘lib chiqadi.
Kuzatilgan qonuniyat aksariyat hollarda to‘g‘ri bo‘ladi va istalsa induksiya bilan isbotlanishi mumkin.

Biroq Grundy qiymatlarida bunday muntazamlik **har doim ham** mavjud emas. Hatto juda sodda ayrim o‘yinlar uchun ham bu qonuniyatlar mavjud yoki mavjud emasligini aniqlash ochiq masala bo‘lib qolmoqda; masalan, “Grundy o‘yini”.

## O‘yinlarga misollar

### Xochlar o‘yini

**Qoidalar.**
O‘lchami $1\times n$ bo‘lgan katakli tasmani ko‘rib chiqamiz. Bir yurishda o‘yinchi bitta xoch qo‘yishi kerak, ammo ikkita xochni yonma-yon — qo‘shni kataklarga — qo‘yish taqiqlanadi. Odatdagidek, qonuniy yurishi qolmagan o‘yinchi yutqazadi.

**Yechim.**
O‘yinchi biror katakka xoch qo‘yganda, tasma ikkita mustaqil qismga — xochning chap va o‘ng tomonlariga — bo‘lindi deb qarash mumkin.
Xoch qo‘yilgan katak hamda uning chap va o‘ng qo‘shnilari “yo‘q qilinadi”: ularga boshqa xoch qo‘yib bo‘lmaydi.
Shuning uchun kataklarni $1$ dan $n$ gacha raqamlasak, $1<i<n$ pozitsiyaga xoch qo‘yish tasmani uzunliklari $i-2$ va $n-i-1$ bo‘lgan ikki tasmaga ajratadi, ya’ni $i-2$ va $n-i-1$ o‘yinlari yig‘indisiga o‘tamiz.
Xoch 1- yoki $n$-pozitsiyaga qo‘yilgan chekka holatda $n-2$ o‘yiniga o‘tamiz.

Demak, $g(n)$ Grundy qiymati quyidagi ko‘rinishga ega:

$$g(n) = \text{mex} \Bigl( \{ g(n-2) \} \cup \{g(i-2) \oplus g(n-i-1) \mid 2 \leq i \leq n-1\} \Bigr) .$$

Shu tariqa $O(n^2)$ yechimga ega bo‘ldik.

Aslida $g(n)$ qiymati $n=52$ dan boshlab uzunligi 34 bo‘lgan davrga ega.

## Amaliy masalalar

- [KATTIS S-Nim](https://open.kattis.com/problems/snim)
- [CodeForces - Marbles (2018-2019 ACM-ICPC Brazil Subregional)](https://codeforces.com/gym/101908/problem/B)
- [KATTIS - Cuboid Slicing Game](https://open.kattis.com/problems/cuboidslicinggame)
- [HackerRank - Tower Breakers, Revisited!](https://www.hackerrank.com/contests/5-days-of-game-theory/challenges/tower-breakers-2)
- [HackerRank - Tower Breakers, Again!](https://www.hackerrank.com/contests/5-days-of-game-theory/challenges/tower-breakers-3/problem)
- [HackerRank - Chessboard Game, Again!](https://www.hackerrank.com/contests/5-days-of-game-theory/challenges/a-chessboard-game)
- [Atcoder - ABC368F - Dividing Game](https://atcoder.jp/contests/abc368/tasks/abc368_f)

