---
article_id: graph--hungarian-algorithm
---
# Tayinlash masalasini yechish uchun Hungarian algoritmi

## Tayinlash masalasining bayoni

Tayinlash masalasining bir nechta standart ta’rifi mavjud (ularning barchasi mohiyatan o‘zaro teng kuchli). Ulardan ayrimlari:

- $n$ ta ish va $n$ ta ishchi bor. Har bir ishchi ma’lum bir ish uchun kutayotgan pul miqdorini ko‘rsatadi. Har bir ishchiga faqat bitta ish tayinlanishi mumkin. Maqsad ishlarni ishchilarga umumiy xarajat minimal bo‘ladigan qilib tayinlashdir.
- $n \times n$ o‘lchamli $A$ matritsa berilgan. Har bir satrdan bittadan sonni shunday tanlash kerakki, har bir ustundan aynan bitta son tanlansin va tanlangan sonlar yig‘indisi minimal bo‘lsin.
- $n \times n$ o‘lchamli $A$ matritsa berilgan. $\sum A[i]\left[p[i]\right]$ qiymat minimal bo‘ladigan uzunligi $n$ bo‘lgan $p$ permutatsiyani topish kerak.
- Har bir qismida $n$ tadan tugun bo‘lgan to‘liq ikki bo‘lakli grafni ko‘ramiz; har bir qirraga vazn berilgan. Maqsad umumiy vazni minimal bo‘lgan mukammal matchingni topishdir.

Yuqoridagi barcha holatlar “**kvadrat**” masalalar ekanini, ya’ni ikkala o‘lcham ham doim $n$ ga tengligini qayd etish muhim. Amalda $n$ va $m$ teng bo‘lmagan hamda $\min(n,m)$ ta element tanlash kerak bo‘lgan shunga o‘xshash “**to‘g‘ri to‘rtburchak**” ta’riflar ham ko‘p uchraydi. Ammo satr yoki ustunlarni mos ravishda nol yoki cheksiz qiymatlar bilan qo‘shish orqali “to‘g‘ri to‘rtburchak” masalani har doim “kvadrat” masalaga aylantirish mumkinligini ko‘rish mumkin.
Shuningdek, **minimal** yechimni qidirishga o‘xshash ravishda **maksimal** yechimni topish masalasini ham qo‘yish mumkin. Ammo bu ikki masala o‘zaro teng kuchli: barcha vaznlarni $-1$ ga ko‘paytirish kifoya.

## Hungarian algoritmi

### Tarixiy ma’lumot

Algoritm 1955-yilda Harold **Kuhn** tomonidan ishlab chiqilgan va e’lon qilingan. Kuhnning o‘zi unga “Hungarian” nomini bergan, chunki u vengriyalik matematiklar Dénes Kőnig va Jenő Egerváryning avvalgi ishlariga asoslangan edi.<br>
1957-yilda James **Munkres** bu algoritm narxlardan mustaqil ravishda (qat’iy) polinomial vaqtda ishlashini ko‘rsatdi.<br>
Shuning uchun adabiyotlarda bu algoritm nafaqat “Hungarian”, balki “Kuhn–Munkres algoritmi” yoki “Munkres algoritmi” deb ham ataladi.<br>
Biroq 2006-yilda xuddi shu algoritmni **Kuhndan bir asr oldin** nemis matematigi Carl Gustav **Jacobi** ixtiro qilgani aniqlandi. Uning 1890-yilda vafotidan keyin nashr etilgan _Ixtiyoriy oddiy differensial tenglamalar sistemasining tartibini tadqiq qilish haqida_ asarida boshqa natijalar qatori tayinlash masalasini yechadigan polinomial algoritm ham bor edi. Afsuski, nashr lotin tilida bo‘lgani sababli matematiklar orasida e’tiborsiz qolgan.
Kuhnning dastlabki algoritmi $\mathcal{O}(n^4)$ asimptotik murakkablikka ega bo‘lganini, faqat keyinroq Jack **Edmonds** va Richard **Karp** (hamda ulardan mustaqil ravishda **Tomizawa**) uni $\mathcal{O}(n^3)$ asimptotik murakkablikka qanday yaxshilashni ko‘rsatganini ham qayd etish kerak.

### $\mathcal{O}(n^4)$ algoritm

Noaniqlik bo‘lmasligi uchun, biz asosan tayinlash masalasining matritsa ko‘rinishi bilan ishlashimizni darhol qayd etamiz (ya’ni $A$ matritsa berilgan va undan turli satr hamda ustunlarda yotadigan $n$ ta katak tanlash kerak). Massivlarni $1$ dan boshlab indekslaymiz; masalan, $A$ matritsaning indekslari $A[1\dots n][1\dots n]$.
Shuningdek, $A$ matritsadagi barcha sonlar **manfiy emas** deb faraz qilamiz (agar bunday bo‘lmasa, barcha sonlarga biror o‘zgarmas qiymat qo‘shib, matritsani har doim manfiy bo‘lmagan qilish mumkin).

Quyidagi shartni qanoatlantiradigan ixtiyoriy ikkita $u[1\ldots n]$ va $v[1\ldots n]$ sonlar massivini **potensial** deb ataymiz:

$$u[i]+v[j]\leq A[i][j],\quad i=1\dots n,\ j=1\dots n$$

(Ko‘rib turganingizdek, $u[i]$ matritsaning $i$-satriga, $v[j]$ esa $j$-ustuniga mos keladi.)
Potensial elementlari yig‘indisini uning **$f$ qiymati** deb ataymiz:

$$f=\sum_{i=1}^{n} u[i] + \sum_{j=1}^{n} v[j].$$

Bir tomondan, izlanayotgan $sol$ yechim narxi istalgan potensial qiymatidan **kichik emas**ligini ko‘rish oson.

!!! info ""

    **Lemma.** $sol\geq f$.

??? info "Isbot"
    Masalaning izlanayotgan yechimi $A$ matritsaning $n$ ta katagidan iborat, shuning uchun ularning har biri uchun $u[i]+v[j]\leq A[i][j]$. $sol$ dagi barcha elementlar turli satr va ustunlarda yotgani sababli, tanlangan barcha $A[i][j]$ lar bo‘yicha bu tengsizliklarni qo‘shsak, tengsizlikning chap tomonida $f$, o‘ng tomonida esa $sol$ hosil bo‘ladi.

Boshqa tomondan, bu tengsizlikni **tenglikka** aylantiradigan yechim va potensial doim mavjud ekan. Quyida tasvirlanadigan Hungarian algoritmi bu faktning konstruktiv isboti bo‘ladi. Hozircha shuni qayd etamizki, agar biror yechim narxi biror potensial qiymatiga teng bo‘lsa, bu yechim **optimal**dir.

Biror potensialni mahkamlaymiz. Agar $u[i]+v[j]=A[i][j]$ bo‘lsa, $(i,j)$ qirrani **qattiq** deb ataymiz.
Tayinlash masalasining ikki bo‘lakli graf yordamidagi muqobil ta’rifini eslaymiz. Faqat qattiq qirralardan tuzilgan ikki bo‘lakli grafni $H$ bilan belgilaymiz. Hungarian algoritmi joriy potensial uchun $H$ grafning **qirralar soni bo‘yicha eng katta matchingi** $M$ ni saqlaydi. $M$ da $n$ ta qirra paydo bo‘lishi bilanoq masala yechimi aynan $M$ bo‘ladi (chunki bu narxi potensial qiymatiga teng bo‘lgan yechimdir).

To‘g‘ridan-to‘g‘ri **algoritm tavsifi**ga o‘tamiz.

**1-qadam.** Dastlab potensial nol deb olinadi (barcha $i$ lar uchun $u[i]=v[i]=0$), $M$ matching esa bo‘sh deb olinadi.

**2-qadam.** Keyin algoritmning har bir qadamida potensialni o‘zgartirmasdan joriy $M$ matching quvvatini bittaga oshirishga urinib ko‘ramiz (matching qattiq qirralardan tuzilgan $H$ grafda qidirilishini eslang). Buning uchun ikki bo‘lakli grafda eng katta matching topadigan odatdagi [Kuhn algoritmi](kuhn_maximum_bipartite_matching.md) ishlatiladi. Bu algoritmni shu yerda eslaymiz.
Matching $M$ ning barcha qirralari o‘ng qismdan chap qismga, $H$ grafning qolgan barcha qirralari esa qarama-qarshi tomonga yo‘naltiriladi.
Matching izlash terminologiyasidan tugun joriy matching qirrasiga tutash bo‘lsa to‘yintirilgan deb atalishini eslaymiz. Joriy matchingning hech bir qirrasiga tutashmagan tugun to‘yinmagan deb ataladi. Birinchi qirrasi matchingga kirmaydigan, keyingi qirralari esa navbatma-navbat matchingga kirib-kirmaydigan toq uzunlikdagi yo‘l oshiruvchi yo‘l deb ataladi.
Chap qismdagi barcha to‘yinmagan tugunlardan [chuqurlik bo‘yicha](depth-first-search.md) yoki [kenglik bo‘yicha](breadth-first-search.md) qidiruv boshlanadi. Agar qidiruv natijasida o‘ng qismdagi to‘yinmagan tugunga yetib borish mumkin bo‘lsa, chap qismdan o‘ng qismga oshiruvchi yo‘l topdik. Yo‘lning toq raqamli qirralarini matchingga qo‘shib, juft raqamli qirralarini undan olib tashlasak (ya’ni birinchi qirrani qo‘shib, ikkinchisini chiqarib, uchinchisini qo‘shib va hokazo), matching quvvatini bittaga oshiramiz.
Agar oshiruvchi yo‘l bo‘lmasa, joriy $M$ matching $H$ grafda maksimaldir.

**3-qadam.** Agar joriy qadamda joriy matching quvvatini oshirib bo‘lmasa, keyingi qadamlarda matchingni oshirish uchun ko‘proq imkoniyat paydo bo‘ladigan qilib potensial qayta hisoblanadi.
Kuhn algoritmining oxirgi qidiruvi davomida chap qismda tashrif buyurilgan tugunlar to‘plamini $Z_1$, o‘ng qismda tashrif buyurilgan tugunlar to‘plamini $Z_2$ bilan belgilaymiz.

$\Delta$ qiymatini hisoblaymiz:

$$\Delta = \min_{i\in Z_1,\ j\notin Z_2} A[i][j]-u[i]-v[j].$$

!!! info ""

    **Lemma.** $\Delta>0$.

??? info "Isbot"
    $\Delta=0$ deb faraz qilamiz. Unda $i\in Z_1$ va $j\notin Z_2$ bo‘lgan qattiq $(i,j)$ qirra mavjud. Bundan $(i,j)$ qirra o‘ng qismdan chap qismga yo‘naltirilgan, ya’ni $M$ matchingga kiritilgan bo‘lishi kerakligi kelib chiqadi. Ammo bu mumkin emas, chunki to‘yintirilgan $i$ tugunga faqat $j$ dan $i$ ga qirra bo‘ylab o‘tib yetishimiz mumkin edi. Demak, $\Delta>0$.

Endi potensialni quyidagicha **qayta hisoblaymiz**:

- barcha $i\in Z_1$ tugunlar uchun $u[i]\gets u[i]+\Delta$;
- barcha $j\in Z_2$ tugunlar uchun $v[j]\gets v[j]-\Delta$.

!!! info ""

    **Lemma.** Hosil bo‘lgan potensial hanuz to‘g‘ri potensialdir.

??? info "Isbot"
    Qayta hisoblashdan keyin barcha $i,j$ uchun $u[i]+v[j]\leq A[i][j]$ bo‘lishini ko‘rsatamiz. $i\in Z_1$ va $j\in Z_2$ bo‘lgan $A$ elementlari uchun $u[i]+v[j]$ yig‘indi o‘zgarmaydi, shuning uchun tengsizlik saqlanadi. $i\notin Z_1$ va $j\in Z_2$ bo‘lgan elementlar uchun $u[i]+v[j]$ yig‘indi $\Delta$ ga kamayadi, demak tengsizlik yana saqlanadi.
    $i\in Z_1$ va $j\notin Z_2$ bo‘lgan qolgan elementlar uchun yig‘indi ortadi, ammo tengsizlik baribir saqlanadi, chunki $\Delta$ ta’rifiga ko‘ra tengsizlikni buzmaydigan eng katta oshishdir.

!!! info ""

    **Lemma.** Qattiq qirralardan tuzilgan eski $M$ matching yaroqli qoladi, ya’ni matchingning barcha qirralari qattiqligicha qoladi.

??? info "Isbot"
    Potensial o‘zgarishi natijasida biror qattiq $(i,j)$ qirra qattiqligini yo‘qotishi uchun $u[i]+v[j]=A[i][j]$ tenglik $u[i]+v[j]<A[i][j]$ tengsizlikka aylanishi kerak. Ammo bu faqat $i\notin Z_1$ va $j\in Z_2$ bo‘lganda yuz berishi mumkin. $i\notin Z_1$ esa $(i,j)$ qirra matching qirrasi bo‘la olmaganini anglatadi.

!!! info ""

    **Lemma.** Potensial har bir qayta hisoblangandan keyin qidiruv erisha oladigan tugunlar soni, ya’ni $|Z_1|+|Z_2|$, qat’iy ortadi.

??? info "Isbot"
    Birinchidan, qayta hisoblashdan oldin erishish mumkin bo‘lgan istalgan tugunga keyin ham erishish mumkinligini qayd etamiz. Haqiqatan, biror tugunga erishish mumkin bo‘lsa, chap qismdagi to‘yinmagan tugundan boshlanib, erishilgan tugunlardan unga boruvchi biror yo‘l mavjud. $(i,j)$ ko‘rinishdagi, $i\in Z_1$, $j\in Z_2$ qirralar uchun $u[i]+v[j]$ yig‘indi o‘zgarmagani sababli, potensial o‘zgargandan keyin bu butun yo‘l saqlanadi.
    Ikkinchidan, qayta hisoblashdan keyin kamida bitta yangi tugunga erishish mumkin bo‘lishini ko‘rsatamiz. Bu $\Delta$ ta’rifidan kelib chiqadi: $\Delta$ aniqlanadigan $(i,j)$ qirra qattiq bo‘lib qoladi, demak $j$ tugunga $i$ tugundan erishish mumkin bo‘ladi.

Oxirgi lemma sababli oshiruvchi yo‘l topilib, $M$ matching quvvati oshishidan oldin **ko‘pi bilan $n$ marta potensial qayta hisoblanishi mumkin**.
Demak, ertami-kechmi mukammal $M^*$ matchingga mos potensial topiladi va $M^*$ masalaning javobi bo‘ladi.
Algoritm murakkabligi $\mathcal{O}(n^4)$: jami matching ko‘pi bilan $n$ marta oshadi; har bir oshishdan oldin ko‘pi bilan $n$ marta potensial qayta hisoblanadi va har bir qayta hisoblash $\mathcal{O}(n^2)$ vaqtda bajariladi.
Bu yerda $\mathcal{O}(n^4)$ algoritm implementatsiyasini keltirmaymiz, chunki u quyida tasvirlanadigan $\mathcal{O}(n^3)$ algoritm implementatsiyasidan qisqaroq bo‘lmaydi.

### $\mathcal{O}(n^3)$ algoritm

Endi xuddi shu algoritmni $\mathcal{O}(n^3)$ vaqtda (to‘g‘ri to‘rtburchak $n\times m$ masalalar uchun $\mathcal{O}(n^2m)$ vaqtda) implementatsiya qilishni o‘rganamiz.

Asosiy g‘oya — matritsaning barcha satrlarini birdan emas, **bittadan ko‘rib chiqish**. Shunda yuqorida tasvirlangan algoritm quyidagi ko‘rinishga keladi:

1. $A$ matritsaning keyingi satrini ko‘rib chiqamiz.
2. Shu satrdan boshlanuvchi oshiruvchi yo‘l yo‘q ekan, potensialni qayta hisoblaymiz.
3. Oshiruvchi yo‘l topilishi bilan matchingni uning bo‘ylab o‘zgartiramiz (shu tariqa oxirgi qirrani matchingga qo‘shamiz) va 1-qadamdan, ya’ni keyingi satrni ko‘rib chiqishdan davom etamiz.

Kerakli murakkablikka erishish uchun matritsaning har bir satri uchun bajariladigan 2–3-qadamlarni $\mathcal{O}(n^2)$ vaqtda (to‘g‘ri to‘rtburchak masalalarda $\mathcal{O}(nm)$ vaqtda) implementatsiya qilish zarur.

Buning uchun yuqorida isbotlangan ikkita faktni eslaymiz:

- Potensial o‘zgarganda Kuhn qidiruvi bilan erishish mumkin bo‘lgan tugunlarga keyin ham erishish mumkin bo‘ladi.
- Oshiruvchi yo‘l topilishidan oldin jami faqat $\mathcal{O}(n)$ marta potensial qayta hisoblanishi mumkin.

Bulardan kerakli murakkablikka erishishga imkon beradigan quyidagi **asosiy g‘oyalar** kelib chiqadi:

- Oshiruvchi yo‘l mavjudligini tekshirish uchun potensial har qayta hisoblangandan keyin Kuhn qidiruvini boshidan boshlash shart emas. Buning o‘rniga Kuhn qidiruvini **iterativ ko‘rinishda** bajarish mumkin: potensial qayta hisoblangandan keyin qo‘shilgan qattiq qirralarni ko‘ramiz va agar ularning chap uchlariga erishish mumkin bo‘lsa, o‘ng uchlarini ham erishiladigan deb belgilab, qidiruvni ulardan davom ettiramiz.
- Bu fikrni rivojlantirib, algoritmni quyidagicha tasvirlash mumkin: siklning har bir qadamida potensial qayta hisoblanadi. Shundan so‘ng erishiladigan bo‘lib qolgan ustun aniqlanadi (har bir qayta hisoblashdan keyin yangi erishiladigan tugunlar paydo bo‘lgani sababli bunday ustun doim mavjud). Agar ustun to‘yinmagan bo‘lsa, oshiruvchi zanjir topilgan. Aks holda, ustun to‘yintirilgan bo‘lsa, unga mos matching satriga ham erishish mumkin bo‘ladi.
- Potensialni sodda $\mathcal{O}(n^2)$ variantdan tezroq qayta hisoblash uchun har bir ustun uchun yordamchi minimumlarni saqlash kerak:

    <br><div style="text-align:center">$minv[j]=\min_{i\in Z_1} A[i][j]-u[i]-v[j].$</div><br>

    Kerakli $\Delta$ qiymati ular orqali quyidagicha ifodalanishini ko‘rish oson:

    <br><div style="text-align:center">$\Delta=\min_{j\notin Z_2} minv[j].$</div><br>

    Demak, endi $\Delta$ ni $\mathcal{O}(n)$ vaqtda topish mumkin.
    Yangi tashrif buyurilgan satrlar paydo bo‘lganda $minv$ massivini yangilash zarur. Qo‘shilgan satr uchun buni $\mathcal{O}(n)$ vaqtda bajarish mumkin (barcha satrlar bo‘yicha jami $\mathcal{O}(n^2)$). Potensial qayta hisoblanganda ham $minv$ massivini yangilash kerak; bu ham $\mathcal{O}(n)$ vaqtda bajariladi ($minv$ faqat hali erishilmagan ustunlar uchun o‘zgaradi, aynan $\Delta$ ga kamayadi).

Shunday qilib, algoritm quyidagi ko‘rinishga ega: tashqi siklda matritsa satrlarini bittadan ko‘ramiz. Har bir satr $\mathcal{O}(n^2)$ vaqtda qayta ishlanadi, chunki faqat $\mathcal{O}(n)$ marta potensial qayta hisoblanishi mumkin (har biri $\mathcal{O}(n)$ vaqtda), $minv$ massivi esa $\mathcal{O}(n^2)$ vaqtda saqlanadi; Kuhn algoritmi ham $\mathcal{O}(n^2)$ vaqtda ishlaydi (u $\mathcal{O}(n)$ ta iteratsiya ko‘rinishida bo‘lib, har biri yangi ustunga tashrif buyuradi).
Natijaviy murakkablik $\mathcal{O}(n^3)$ yoki masala to‘g‘ri to‘rtburchak bo‘lsa $\mathcal{O}(n^2m)$.

## Hungarian algoritmining implementatsiyasi

Quyidagi implementatsiya bir necha yil oldin **Andrey Lopatin** tomonidan ishlab chiqilgan. U hayratlanarli darajada ixcham: butun algoritm **30 qator kod**dan iborat.
Implementatsiya $n\leq m$ bo‘lgan $A[1\dots n][1\dots m]$ to‘g‘ri to‘rtburchak matritsa uchun yechim topadi. Qulaylik va kod ixchamligi uchun matritsa indekslari $1$ dan boshlanadi: implementatsiya soxta nolinchi satr va nolinchi ustun kiritadi, bu ko‘p sikllarni qo‘shimcha tekshiruvlarsiz umumiy ko‘rinishda yozish imkonini beradi.
$u[0\ldots n]$ va $v[0\ldots m]$ massivlari potensialni saqlaydi. Dastlab ular nolga tenglanadi; bu nollardan iborat satrli matritsaga mos keladi (ushbu implementatsiya uchun $A$ matritsada manfiy sonlar bor-yo‘qligi muhim emasligini qayd eting).
$p[0\ldots m]$ massivi matchingni saqlaydi: har bir $j=1\ldots m$ ustun uchun tanlangan satrning $p[j]$ raqamini (yoki hali hech narsa tanlanmagan bo‘lsa $0$ ni) saqlaydi. Implementatsiya qulayligi uchun $p[0]$ joriy satr raqamiga teng deb olinadi.

$minv[1\ldots m]$ massivi yuqorida tasvirlanganidek, potensialni tez qayta hisoblash uchun har bir $j$ ustun bo‘yicha kerakli yordamchi minimumlarni saqlaydi.
$way[1\ldots m]$ massivi keyinchalik oshiruvchi yo‘lni tiklashimiz uchun bu minimumlar qayerda erishilganligi haqidagi ma’lumotni saqlaydi. Yo‘lni tiklash uchun faqat ustun qiymatlarini saqlash yetarli, chunki satr raqamlarini matchingdan, ya’ni $p$ massivdan olish mumkin. Demak, har bir $j$ ustun uchun $way[j]$ yo‘ldagi oldingi ustun raqamini (yoki oldingisi bo‘lmasa $0$ ni) saqlaydi.
Algoritmning o‘zi matritsa satrlari bo‘yicha tashqi **sikl** bo‘lib, uning ichida matritsaning $i$-satri ko‘rib chiqiladi. Birinchi _do-while_ sikl bo‘sh $j0$ ustun topilguncha ishlaydi. Siklning har bir iteratsiyasi $j0$ raqamli yangi ustunni tashrif buyurilgan deb belgilaydi ($j0$ avvalgi iteratsiyada hisoblangan, boshida esa nolga teng — ya’ni soxta ustundan boshlaymiz), shuningdek matchingda unga tutash yangi $i0$ satrni, ya’ni $p[j0]$ ni belgilaydi (boshida $j0=0$ bo‘lganda $i$-satr olinadi).
Yangi tashrif buyurilgan $i0$ satr paydo bo‘lgani sababli $minv$ massivi va $\Delta$ ni mos ravishda qayta hisoblash kerak. Agar $\Delta$ yangilansa, $j1$ ustun erishilgan minimumga aylanadi (bunday implementatsiyada $\Delta$ nol bo‘lishi ham mumkinligini qayd eting; bu joriy qadamda potensialni o‘zgartirib bo‘lmasligi, chunki yangi erishiladigan ustun allaqachon mavjudligini anglatadi). Shundan so‘ng potensial va $minv$ massivi qayta hisoblanadi.
_do-while_ sikli oxirida $j0$ ustunda tugaydigan oshiruvchi yo‘lni topdik; uni `way` ajdodlar massivi yordamida “teskari ochish” mumkin.
<tt>INF</tt> o‘zgarmasi “cheksizlik”, ya’ni $A$ kirish matritsasidagi barcha mumkin bo‘lgan sonlardan aniq kattaroq son.

```{.cpp file=hungarian}
vector<int> u (n+1), v (m+1), p (m+1), way (m+1);
for (int i=1; i<=n; ++i) {
    p[0] = i;
    int j0 = 0;
    vector<int> minv (m+1, INF);
    vector<bool> used (m+1, false);
    do {
        used[j0] = true;
        int i0 = p[j0],  delta = INF,  j1;
        for (int j=1; j<=m; ++j)
            if (!used[j]) {
                int cur = A[i0][j]-u[i0]-v[j];
                if (cur < minv[j])
                    minv[j] = cur,  way[j] = j0;
                if (minv[j] < delta)
                    delta = minv[j],  j1 = j;
            }
        for (int j=0; j<=m; ++j)
            if (used[j])
                u[p[j]] += delta,  v[j] -= delta;
            else
                minv[j] -= delta;
        j0 = j1;
    } while (p[j0] != 0);
    do {
        int j1 = way[j0];
        p[j0] = p[j1];
        j0 = j1;
    } while (j0);
}
```

Javobni odatiyroq ko‘rinishda, ya’ni har bir $i=1\ldots n$ satr uchun unda tanlangan ustunning $ans[i]$ raqamini topish quyidagicha bajariladi:

```cpp
vector<int> ans (n+1);
for (int j=1; j<=m; ++j)
    ans[p[j]] = j;
```

Matching narxini shunchaki nolinchi ustun potensialining qarama-qarshi ishorali qiymati sifatida olish mumkin. Haqiqatan, koddan ko‘rinib turibdiki, $-v[0]$ barcha $\Delta$ qiymatlari yig‘indisini, ya’ni potensialning umumiy o‘zgarishini saqlaydi.
Bir vaqtning o‘zida bir nechta $u[i]$ va $v[j]$ qiymatlari o‘zgarishi mumkin bo‘lsa-da, potensialning umumiy o‘zgarishi aynan $\Delta$ ga teng, chunki oshiruvchi yo‘l topilmaguncha erishiladigan satrlar soni erishiladigan ustunlar sonidan aynan bittaga ko‘p (faqat joriy $i$ satrning tashrif buyurilgan ustun ko‘rinishidagi “jufti” yo‘q):

```cpp
int cost = -v[0];
```

## Ketma-ket eng qisqa yo‘llar algoritmi bilan bog‘lanish

Hungarian algoritmini tayinlash masalasiga moslashtirilgan [ketma-ket eng qisqa yo‘llar algoritmi](min_cost_flow.md) sifatida ko‘rish mumkin. Tafsilotlarga kirmasdan, ular orasidagi bog‘lanish uchun intuitiv tushuntirish beramiz.

Ketma-ket eng qisqa yo‘llar algoritmi qirra vaznlarini qayta belgilash usuli sifatida Johnson algoritmining o‘zgartirilgan variantidan foydalanadi. U to‘rt qadamga bo‘linadi:

- $s$ tugundan boshlab [Bellman–Ford](bellman_ford.md) algoritmini ishlating va har bir tugun uchun $s$ dan $v$ gacha yo‘lning minimal $h(v)$ vaznini toping.

Asosiy algoritmning har bir qadami uchun:

- Asl graf qirralarining vaznlarini $w(u,v)\gets w(u,v)+h(u)-h(v)$ tarzida qayta belgilang.
- Asl tarmoqning eng qisqa yo‘llar qism grafini topish uchun [Dijkstra](dijkstra.md) algoritmini ishlating.
- Keyingi iteratsiya uchun potensiallarni yangilang.

Ushbu tavsifdan $h(v)$ va potensiallar orasida kuchli o‘xshashlik borligini ko‘rish mumkin: ularning bir-biriga faqat o‘zgarmas siljishgacha tengligini tekshirish mumkin. Bundan tashqari, qayta vaznlashdan keyin barcha nol vaznli qirralar to‘plami asosiy algoritm oqimni oshirishga urinadigan eng qisqa yo‘llar qism grafini ifodalashini ko‘rsatish mumkin.
Hungarian algoritmida ham shu hodisa yuz beradi: qattiq qirralardan (ya’ni $A[i][j]-u[i]-v[j]$ qiymati nol bo‘lgan qirralardan) qism graf yaratib, matching hajmini oshirishga urinib ko‘ramiz.
4-qadamda barcha $h(v)$ qiymatlar yangilanadi: oqim tarmog‘ini har o‘zgartirganimizda manbadan masofalar to‘g‘ri qolishini ta’minlashimiz kerak (aks holda keyingi iteratsiyada Dijkstra algoritmi ishlamay qolishi mumkin). Bu potensiallardagi yangilashga o‘xshaydi, ammo bu holda ular bir xil miqdorga oshirilmaydi.

Potensiallarni chuqurroq tushunish uchun ushbu [maqola](https://codeforces.com/blog/entry/105658)ga qarang.

## Masala misollari

Quyida tayinlash masalasiga bog‘liq, juda sodda masalalardan unchalik ravshan bo‘lmaganlarigacha bir nechta misol keltirilgan:

- Ikki bo‘lakli graf berilgan va unda **minimal vaznli eng katta matching**ni topish talab etiladi (ya’ni avval matching hajmi maksimal qilinadi, keyin uning narxi minimallashtiriladi).<br>
  Yechish uchun shunchaki yo‘q qirralar o‘rniga “cheksizlik” sonini qo‘yib tayinlash masalasini quramiz. Keyin masalani Hungarian algoritmi bilan yechib, javobdan cheksiz vaznli qirralarni olib tashlaymiz (agar masalada mukammal matching ko‘rinishidagi yechim bo‘lmasa, ular javobga kirishi mumkin).
- Ikki bo‘lakli graf berilgan va unda **maksimal vaznli eng katta matching**ni topish talab etiladi.<br>
  Yechim yana ravshan: barcha vaznlarni minus birga ko‘paytirish kerak.
- **Tasvirlarda harakatlanuvchi obyektlarni aniqlash** masalasi: ikkita tasvir olingan va natijada ikkita koordinatalar to‘plami hosil bo‘lgan. Birinchi va ikkinchi tasvirdagi obyektlarni moslashtirish, ya’ni ikkinchi tasvirdagi har bir nuqta birinchi tasvirdagi qaysi nuqtaga mos kelishini aniqlash talab etiladi. Bunda solishtirilgan nuqtalar orasidagi masofalar yig‘indisini minimallashtirish kerak (ya’ni obyektlar jami eng qisqa yo‘l bosib o‘tgan yechimni qidiramiz).<br>
  Yechish uchun qirra vaznlari nuqtalar orasidagi Evklid masofalari bo‘lgan tayinlash masalasini qurib, yechamiz.
- **Lokatorlar yordamida harakatlanuvchi obyektlarni aniqlash** masalasi: fazodagi obyekt o‘rnini emas, faqat uning yo‘nalishini aniqlay oladigan ikkita lokator mavjud. Turli nuqtalarda joylashgan ikkala lokator ham $n$ ta shunday yo‘nalish ko‘rinishidagi ma’lumot olgan. Obyektlarning o‘rnini, ya’ni obyektlarning kutilayotgan joylarini va ularga mos yo‘nalishlar juftlarini shunday aniqlash kerakki, obyektlardan yo‘nalish nurlarigacha masofalar yig‘indisi minimal bo‘lsin.<br>
  Yechim: yana tayinlash masalasini qurib, yechamiz; chap qism tugunlari birinchi lokatorning $n$ ta yo‘nalishi, o‘ng qism tugunlari ikkinchi lokatorning $n$ ta yo‘nalishi, qirra vaznlari esa mos nurlar orasidagi masofalardir.
- **Yo‘naltirilgan asiklik grafni yo‘llar bilan qoplash**: yo‘naltirilgan asiklik graf berilgan. Grafning har bir tuguni aynan bitta yo‘lda yotadigan qilib eng kichik sondagi yo‘llarni (soni teng bo‘lsa, umumiy vazni eng kichiklarini) topish talab etiladi.<br>
  Yechim berilgan grafdan mos ikki bo‘lakli graf qurib, unda minimal vaznli eng katta matchingni topishdir. Batafsil alohida maqolaga qarang.
- **Daraxtni bo‘yash kitobi**. Barglardan tashqari har bir tugun aynan $k-1$ ta bolaga ega bo‘lgan daraxt berilgan. Har bir tugun uchun mavjud $k$ rangdan bittasini shunday tanlash kerakki, qo‘shni ikki tugun bir xil rangga ega bo‘lmasin. Bundan tashqari, har bir tugun va rang uchun shu tugunni shu rangga bo‘yash narxi ma’lum; umumiy narxni minimallashtirish talab etiladi.<br>
  Bu masalani dinamik dasturlash yordamida yechamiz. Ya’ni $d[v][c]$ qiymatini hisoblashni o‘rganamiz, bu yerda $v$ — tugun raqami, $c$ — rang raqami, $d[v][c]$ esa ildizi $v$ bo‘lgan qism daraxtdagi barcha tugunlarni, $v$ tugunning o‘zini $c$ rangga bo‘yagan holda, bo‘yash uchun kerak bo‘ladigan minimal narx.
  $d[v][c]$ ni hisoblash uchun qolgan $k-1$ rangni $v$ tugunning bolalari orasida taqsimlash kerak; buning uchun tayinlash masalasini qurish va yechish zarur (chap qism tugunlari ranglar, o‘ng qism tugunlari bolalar, qirra vaznlari esa mos $d$ qiymatlari).<br>
  Demak, har bir $d[v][c]$ qiymat tayinlash masalasini yechish orqali hisoblanadi va natijada $\mathcal{O}(nk^4)$ asimptotika olinadi.
- Agar tayinlash masalasida vaznlar qirralarda emas, tugunlarda va faqat **bir xil qismdagi tugunlarda** bo‘lsa, Hungarian algoritmi kerak emas: tugunlarni vazn bo‘yicha saralab, odatdagi [Kuhn algoritmi](kuhn_maximum_bipartite_matching.md)ni ishga tushirish kifoya (batafsil [alohida maqola](http://e-maxx.ru/algo/vertex_weighted_matching)ga qarang).
- Quyidagi **maxsus holat**ni ko‘ramiz. Chap qismdagi har bir tugunga $\alpha[i]$, o‘ng qismdagi har bir tugunga $\beta[j]$ soni berilgan bo‘lsin. Istalgan $(i,j)$ qirraning vazni $\alpha[i]\cdot\beta[j]$ ga teng (sonlar ma’lum). Tayinlash masalasini yeching.<br>
  Hungarian algoritmisiz yechish uchun avval har ikki qismda ikkitadan tugun bo‘lgan holatni ko‘ramiz. Bu holda osongina ko‘rish mumkinki, tugunlarni teskari tartibda bog‘lash yaxshiroq: kichikroq $\alpha[i]$ li tugunni kattaroq $\beta[j]$ li tugunga bog‘lash kerak.
  Bu qoidani ixtiyoriy sondagi tugunlarga oson umumlashtirish mumkin: birinchi qism tugunlarini $\alpha[i]$ qiymatlarining o‘sish tartibida, ikkinchi qism tugunlarini $\beta[j]$ qiymatlarining kamayish tartibida saralab, tugunlarni shu tartibda juftlab bog‘lash kerak. Natijada $\mathcal{O}(n\log n)$ murakkablikdagi yechim olamiz.
- **Potensiallar masalasi**. $A[1\ldots n][1\ldots m]$ matritsa berilgan. Istalgan $i$ va $j$ uchun $u[i]+v[j]\leq a[i][j]$ bo‘ladigan va $u$ hamda $v$ massivlari elementlari yig‘indisi maksimal bo‘ladigan $u[1\ldots n]$ va $v[1\ldots m]$ massivlarni topish talab etiladi.<br>
  Hungarian algoritmini bilgan holda bu masalani yechish qiyin emas: Hungarian algoritmi aynan masala shartini qanoatlantiradigan shunday $u,v$ potensialni topadi. Boshqa tomondan, Hungarian algoritmini bilmasdan bunday masalani yechish deyarli imkonsizdek ko‘rinadi.

    !!! info "Izoh"

        Bu masala tayinlash masalasining **dual masalasi** deb ham ataladi: tayinlashning umumiy narxini minimallashtirish potensiallar yig‘indisini maksimallashtirishga teng kuchli.

## Adabiyotlar

- [Ravindra Ahuja, Thomas Magnanti, James Orlin. Network Flows [1993]](https://books.google.it/books/about/Network_Flows.html?id=rFuLngEACAAJ&redir_esc=y)
- [Harold Kuhn. The Hungarian Method for the Assignment Problem [1955]](https://link.springer.com/chapter/10.1007/978-3-540-68279-0_2)
- [James Munkres. Algorithms for Assignment and Transportation Problems [1957]](https://www.jstor.org/stable/2098689)

## Mashq masalalari

- [UVA - Crime Wave - The Sequel](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1687)
- [UVA - Warehouse](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1829)
- [SGU - Beloved Sons](http://acm.sgu.ru/problem.php?contest=0&problem=210)
- [UVA - The Great Wall Game](http://livearchive.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1277)
- [UVA - Jogging Trails](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1237)

