---
article_id: others--maximum_average_segment
---
# Eng katta yoki eng kichik yig‘indili ostkesmani topish

Bu yerda eng katta yig‘indili ostkesmani topish masalasi va uning ayrim ko‘rinishlari, jumladan masalani onlayn yechish algoritmi ko‘rib chiqiladi.

## Masala sharti

$a[1 \ldots n]$ sonlar massivi berilgan. Yig‘indisi eng katta bo‘lgan $a[l \ldots r]$ ostkesmani topish talab etiladi:

$$\max_{1 \le l \le r \le n} \sum_{i=l}^{r} a[i].$$

Masalan, $a[]$ massividagi barcha sonlar nomanfiy bo‘lsa, javob massivning o‘zi bo‘ladi. Massivda musbat hamda manfiy sonlar bo‘lishi mumkin bo‘lganda esa yechim oddiy emas.

**Eng kichik** yig‘indili ostkesmani topish masalasi aslida xuddi shu masala: barcha sonlarning ishorasini almashtirish kifoya.

## 1-algoritm

Avval deyarli ravshan bo‘lgan algoritmni ko‘ramiz. Keyinroq o‘ylab topish biroz qiyinroq, ammo kodi yanada qisqaroq boshqa algoritm beriladi.

### Algoritm tavsifi

Algoritm juda sodda.

Qulaylik uchun $s[i] = \sum_{j=1}^{i} a[j]$ deb belgilaymiz. Demak, $s[i]$ — $a[]$ massivining prefiks yig‘indilari massivi. Shuningdek, $s[0] = 0$ deb olamiz.

Endi $r = 1 \ldots n$ indekslari bo‘yicha yuramiz va har bir joriy $r$ uchun $[l,r]$ ostkesma yig‘indisi eng katta bo‘ladigan optimal $l$ ni tez topishni o‘rganamiz.

Rasmiy ravishda, joriy $r$ uchun $s[r] - s[l-1]$ qiymatini maksimal qiladigan, $r$ dan katta bo‘lmagan $l$ ni topish kerak. Oddiy o‘zgartirishdan so‘ng, $s[]$ massivining $[0,r-1]$ oralig‘idagi minimumini topish yetarli ekanini ko‘ramiz.

Shundan yechim darhol kelib chiqadi: $s[]$ dagi joriy minimum va uning o‘rnini saqlaymiz. Shu minimum yordamida joriy optimal $l$ indeksi $O(1)$ vaqtda topiladi; $r$ dan keyingi indeksga o‘tganda minimum yangilanadi.

Algoritm $O(n)$ vaqtda ishlaydi va asimptotik jihatdan optimal.

### Amalga oshirish

Kodda $s[]$ prefiks yig‘indilari massivini alohida saqlash ham shart emas — uning faqat joriy elementi kerak bo‘ladi.

Yuqoridagi 1 dan boshlangan raqamlashdan farqli ravishda, kodda 0 dan boshlangan massiv ishlatiladi.

Avval kerakli kesma chegaralarini emas, faqat sonli javobni topadigan yechim:

```cpp
int ans = a[0], sum = 0, min_sum = 0;
for (int r = 0; r < n; ++r) {
    sum += a[r];
    ans = max(ans, sum - min_sum);
    min_sum = min(min_sum, sum);
}
```

Endi kerakli kesmaning chegaralarini ham topadigan to‘liq yechim:

```cpp
int ans = a[0], ans_l = 0, ans_r = 0;
int sum = 0, min_sum = 0, min_pos = -1;
for (int r = 0; r < n; ++r) {
    sum += a[r];
    int cur = sum - min_sum;
    if (cur > ans) {
        ans = cur;
        ans_l = min_pos + 1;
        ans_r = r;
    }
    if (sum < min_sum) {
        min_sum = sum;
        min_pos = r;
    }
}
```

## 2-algoritm

Endi boshqa algoritmni ko‘ramiz. Uni tushunish biroz qiyinroq, ammo u yuqoridagi usuldan nafisroq va kodi ham qisqaroq. Bu algoritmni Jay Kadane 1984-yilda taklif qilgan.

### Algoritm tavsifi

Massiv bo‘ylab yurib, joriy qisman yig‘indini $s$ o‘zgaruvchida to‘playmiz. Agar biror paytda $s$ manfiy bo‘lsa, $s=0$ deb olamiz. Algoritm davomida $s$ olgan barcha qiymatlarning maksimumi masala javobi bo‘ladi.

**Isbot.** $s$ yig‘indi birinchi marta manfiy bo‘lgan indeksni ko‘ramiz. Nol qisman yig‘indidan boshlanib, oxirida manfiy qisman yig‘indiga keldik. Demak, massivning shu prefiksi va uning istalgan suffiksi manfiy yig‘indiga ega. Shu sababli bu ostkesma o‘zidan boshlanadigan hech bir kattaroq kesmaning yig‘indisini yaxshilamaydi va uni butunlay tashlab yuborish mumkin.

Biroq bu hali yetarli isbot emas: algoritm javobni faqat $s<0$ bo‘lgan o‘rinlardan keyin boshlanuvchi kesmalar orasidan izlaydi.

Ixtiyoriy $[l,r]$ kesmani olaylik va $l$ “muhim” o‘rin bo‘lmasin, ya’ni $l > p+1$, bu yerda $p$ — $s<0$ bo‘lgan oxirgi o‘rin. Oxirgi muhim o‘rin $l-1$ dan qat’iy oldinda bo‘lgani sababli $a[p+1 \ldots l-1]$ yig‘indi nomanfiy. Demak, $l$ ni $p+1$ o‘ringa surish javobni oshiradi yoki hech bo‘lmasa o‘zgartirmaydi.

Shunday qilib, javobni faqat $s<0$ bo‘lgan o‘rinlardan keyin boshlanuvchi kesmalar orasidan qidirish yetarli. Bu algoritmning to‘g‘riligini isbotlaydi.

### Amalga oshirish

1-algoritmdagi kabi, avval faqat sonli javobni topadigan soddalashtirilgan kod:

```cpp
int ans = a[0], sum = 0;

for (int r = 0; r < n; ++r) {
    sum += a[r];
    ans = max(ans, sum);
    sum = max(sum, 0);
}
```

Mos kesmaning chegaralarini ham saqlaydigan to‘liq yechim:

```cpp
int ans = a[0], ans_l = 0, ans_r = 0;
int sum = 0, minus_pos = -1;
for (int r = 0; r < n; ++r) {
    sum += a[r];
    if (sum > ans) {
        ans = sum;
        ans_l = minus_pos + 1;
        ans_r = r;
    }
    if (sum < 0) {
        sum = 0;
        minus_pos = r;
    }
}
```

## Bog‘liq masalalar

### Cheklovli eng katta yoki eng kichik yig‘indili ostkesma

Masala shartida kerakli $[l,r]$ kesmaga qo‘shimcha cheklovlar qo‘yilsa, masalan, uning $r-l+1$ uzunligi ma’lum oraliqda bo‘lishi talab etilsa, yuqoridagi algoritmni odatda oson umumlashtirish mumkin. Masala baribir $s[]$ massivida qo‘shimcha cheklovlarga mos minimum topishga keladi.

### Ikki o‘lchamli holat: eng katta yoki eng kichik yig‘indili ostmatritsa

Bu masala tabiiy ravishda yuqori o‘lchamlarga umumlashadi. Masalan, ikki o‘lchamda berilgan matritsadan elementlari yig‘indisi eng katta bo‘lgan $[l_1 \ldots r_1, l_2 \ldots r_2]$ ostmatritsani topish kerak.

Bir o‘lchamli yechim yordamida ikki o‘lchamli masala uchun $O(n^3)$ yechim olish oson. Barcha $l_1$ va $r_1$ qiymatlarini ko‘rib chiqamiz hamda har bir satrda $l_1$ dan $r_1$ gacha yig‘indini hisoblaymiz. Natijada $l_2$ va $r_2$ indekslarini topishga doir bir o‘lchamli masala hosil bo‘ladi va uni chiziqli vaqtda yechish mumkin.

Bu masala uchun **tezroq** algoritmlar ma’lum, ammo ular $O(n^3)$ dan uncha tez emas va juda murakkab. Yashirin koeffitsiyentlari sababli ko‘p hollarda oddiy algoritmdan ham yomon ishlaydi. Hozir ma’lum eng yaxshi algoritmning vaqti $O\left(n^3 \frac{\log^3 \log n}{\log^2 n}\right)$ (T. Chan, 2007, “More algorithms for all-pairs shortest paths in weighted graphs”).

Chan algoritmi va bu sohadagi ko‘plab boshqa natijalar aslida **tez matritsa ko‘paytirish**ni tasvirlaydi; bunda oddiy qo‘shish o‘rniga minimum, oddiy ko‘paytirish o‘rniga qo‘shish ishlatiladi. Eng katta yig‘indili ostmatritsa masalasini barcha tugun juftlari orasidagi eng qisqa yo‘llarga, uni esa shunday matritsa ko‘paytirishga keltirish mumkin.

### Eng katta yoki eng kichik o‘rtacha qiymatli ostkesma

Bu masalada o‘rtacha qiymati eng katta bo‘lgan $a[l,r]$ kesma izlanadi:

$$\max_{l \le r} \frac{1}{r-l+1} \sum_{i=l}^{r} a[i].$$

Agar $[l,r]$ kesmaga boshqa shart qo‘yilmasa, javob har doim massivning maksimum elementidan iborat uzunligi $1$ bo‘lgan kesma bo‘ladi. Masala faqat qo‘shimcha cheklovlar, masalan, kesma uzunligining quyi chegarasi mavjud bo‘lganda mazmunli.

Bunday holatda o‘rtacha qiymatga oid masalalarning **standart usuli** qo‘llanadi: kerakli eng katta o‘rtacha qiymatni **ikkilik qidiruv** bilan tanlaymiz.

Buning uchun quyidagi qismmasalani yechishni bilish kerak: $x$ soni berilganda, $a[]$ massivida barcha qo‘shimcha cheklovlarga mos va o‘rtacha qiymati $x$ dan katta bo‘lgan ostkesma mavjudligini tekshirish.

Har bir $a[]$ elementidan $x$ ni ayiramiz. Shunda qismmasala yangi massivda musbat yig‘indili ostkesma mavjudligini aniqlashga aylanadi; bu masalani esa yuqorida yechdik.

Natijada $O(T(n) \log W)$ murakkablikdagi yechim olinadi. Bu yerda $W$ — talab etilgan aniqlik, $T(n)$ esa uzunligi $n$ bo‘lgan massiv uchun qismmasalani yechish vaqti; u qo‘shimcha cheklovlarga qarab o‘zgaradi.

### Onlayn masalani yechish

Masala sharti quyidagicha: $n$ ta sonli massiv va $L$ soni beriladi. Har bir $(l,r)$ so‘roviga javoban $[l,r]$ oralig‘idan uzunligi kamida $L$ va arifmetik o‘rtachasi imkon qadar katta bo‘lgan ostkesmani topish kerak.

Bu masalaning algoritmi ancha murakkab. KADR (Yaroslav Tverdokhleb) o‘z algoritmini [rus tilidagi forumda](http://e-maxx.ru/forum/viewtopic.php?id=410) bayon qilgan.
