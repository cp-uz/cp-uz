---
article_id: algebra--primality_tests
---
# Tub sonlik testlari

Ushbu maqolada sonning tub yoki tub emasligini aniqlash uchun bir nechta algoritm tasvirlanadi.

## Sinov tariqasida bo‘lish

Ta’rifga ko‘ra, tub sonning $1$ va o‘zidan boshqa bo‘luvchilari bo‘lmaydi.
Murakkab sonning esa kamida bitta qo‘shimcha bo‘luvchisi mavjud; uni $d$ deb ataylik.
Tabiiyki, $\frac{n}{d}$ ham $n$ ning bo‘luvchisi.
$d \le \sqrt{n}$ yoki $\frac{n}{d} \le \sqrt{n}$ ekanini, ya’ni $d$ va $\frac{n}{d}$ bo‘luvchilarining kamida bittasi $\sqrt{n}$ dan katta emasligini oson ko‘rish mumkin.
Bu ma’lumotdan sonning tubligini tekshirish uchun foydalanish mumkin.
$2$ dan $\sqrt{n}$ gacha bo‘lgan sonlardan birortasi $n$ ning bo‘luvchisi ekanini tekshirib, notrivial bo‘luvchi topishga urinib ko‘ramiz.
Agar shunday bo‘luvchi mavjud bo‘lsa, $n$ albatta tub emas; aks holda u tub.

```cpp
bool isPrime(int x) {
    for (int d = 2; d * d <= x; d++) {
        if (x % d == 0)
            return false;
    }
    return x >= 2;
}
```

Bu tub sonlik tekshiruvining eng sodda ko‘rinishi.
Bu funksiyani ancha optimallashtirish mumkin. Masalan, siklda faqat barcha toq sonlarni tekshirish mumkin, chunki yagona juft tub son — 2.
Bunday optimallashtirishlarning bir nechtasi [butun sonlarni faktorizatsiya qilish](factorization.md) maqolasida tasvirlangan.

## Fermat tub sonlik testi

Bu ehtimollik testidir.

Fermatning kichik teoremasiga ([Eylerning phi-funksiyasi](phi-function.md) maqolasiga ham qarang) ko‘ra, $p$ tub son va u bilan o‘zaro tub $a$ butun son uchun quyidagi tenglik o‘rinli:

$$a^{p-1} \equiv 1 \bmod p$$

Umumiy holda bu teorema murakkab sonlar uchun o‘rinli emas.
Bundan tub sonlik testi tuzish uchun foydalanish mumkin.
$2 \le a \le p - 2$ butun sonini tanlaymiz va tenglik bajariladimi-yo‘qmi, tekshiramiz.
Agar u bajarilmasa, ya’ni $a^{p-1} \not\equiv 1 \bmod p$ bo‘lsa, $p$ tub bo‘la olmasligini bilamiz.
Bu holatda $a$ asosini $p$ ning murakkabligi uchun *Fermat guvohi* deb ataymiz.
Biroq bu tenglik murakkab son uchun ham bajarilishi mumkin.
Shuning uchun tenglik bajarilsa, tub sonlik isbotiga ega bo‘lmaymiz.
Faqat $p$ ni *ehtimol tub* deb ayta olamiz.
Agar son aslida murakkab bo‘lib chiqsa, $a$ asosini *Fermat yolg‘onchisi* deb ataymiz.
Testni barcha mumkin bo‘lgan $a$ asoslari uchun ishga tushirsak, sonning tub ekanini haqiqatan ham isbotlashimiz mumkin.
Ammo amalda bunday qilinmaydi, chunki bu *sinov tariqasida bo‘lish* usulidan ham ancha ko‘p ish talab qiladi.
Buning o‘rniga test tasodifiy tanlangan $a$ qiymatlari bilan bir necha marta takrorlanadi.
Agar murakkablik guvohini topmasak, sonning haqiqatan ham tub bo‘lish ehtimoli juda yuqori.

```cpp
bool probablyPrimeFermat(int n, int iter=5) {
    if (n < 4)
        return n == 2 || n == 3;
    for (int i = 0; i < iter; i++) {
        int a = 2 + rand() % (n - 3);
        if (binpower(a, n - 1, n) != 1)
            return false;
    }
    return true;
}
```

$a^{p-1}$ darajani samarali hisoblash uchun [ikkilik darajaga oshirish](binary-exp.md) usulidan foydalanamiz.
Ammo bir yomon xabar bor:
ba’zi murakkab sonlar uchun $n$ bilan o‘zaro tub barcha $a$ larda $a^{n-1} \equiv 1 \bmod n$ tenglik bajariladi; masalan, $561 = 3 \cdot 11 \cdot 17$ soni.
Bunday sonlar *Karmaykl sonlari* deb ataladi.
Fermat tub sonlik testi bu sonlarni faqat juda omadimiz kelib, $\gcd(a, n) \ne 1$ bo‘lgan $a$ asosini tanlasak aniqlay oladi.
Shunga qaramay, Fermat testi juda tezligi va Karmaykl sonlari juda kam uchrashi sababli amalda hamon ishlatiladi.
Masalan, $10^9$ dan kichik atigi 646 ta shunday son mavjud.

## Miller–Rabin tub sonlik testi

Miller–Rabin testi Fermat testidagi g‘oyalarni kengaytiradi.

Toq $n$ soni uchun $n-1$ juft bo‘ladi va undan 2 ning barcha darajalarini ajratib olishimiz mumkin.
Quyidagicha yozamiz:

$$n - 1 = 2^s \cdot d,~\text{bunda}~d~\text{toq}.$$

Bu Fermat kichik teoremasidagi tenglamani ko‘paytuvchilarga ajratish imkonini beradi:

$$\begin{array}{rl}
a^{n-1} \equiv 1 \bmod n &\Longleftrightarrow a^{2^s d} - 1 \equiv 0 \bmod n \\
&\Longleftrightarrow (a^{2^{s-1} d} + 1) (a^{2^{s-1} d} - 1) \equiv 0 \bmod n \\
&\Longleftrightarrow (a^{2^{s-1} d} + 1) (a^{2^{s-2} d} + 1) (a^{2^{s-2} d} - 1) \equiv 0 \bmod n \\
&\quad\vdots \\
&\Longleftrightarrow (a^{2^{s-1} d} + 1) (a^{2^{s-2} d} + 1) \cdots (a^{d} + 1) (a^{d} - 1) \equiv 0 \bmod n \\
\end{array}$$

Agar $n$ tub bo‘lsa, $n$ ushbu ko‘paytuvchilardan birini bo‘lishi shart.
Miller–Rabin tub sonlik testida aynan shu tasdiq tekshiriladi; u Fermat testidagi tasdiqning qat’iyroq ko‘rinishidir.
$2 \le a \le n-2$ asos uchun

$$a^d \equiv 1 \bmod n$$

tenglik yoki biror $0 \le r \le s - 1$ uchun

$$a^{2^r d} \equiv -1 \bmod n$$

tenglik bajarilishini tekshiramiz.
Agar yuqoridagi tengliklarning hech birini qanoatlantirmaydigan $a$ asosini topsak, $n$ ning murakkabligi uchun *guvoh* topgan bo‘lamiz.
Bu holatda $n$ tub emasligini isbotlagan bo‘lamiz.
Fermat testidagidek, tenglamalar to‘plami murakkab son uchun ham bajarilishi mumkin.
Bu holda $a$ asosi *kuchli yolg‘onchi* deb ataladi.
Agar $a$ asosi tenglamalardan birini qanoatlantirsa, $n$ faqat *kuchli ehtimol tub son* bo‘ladi.
Biroq Karmaykl sonlariga o‘xshab, barcha notrivial asoslar yolg‘onchi bo‘ladigan sonlar mavjud emas.
Aslida, asoslarning ko‘pi bilan $\frac{1}{4}$ qismi kuchli yolg‘onchi bo‘lishi mumkinligini ko‘rsatish mumkin.
Agar $n$ murakkab bo‘lsa, tasodifiy asos uning murakkabligini ko‘rsatish ehtimoli $\ge 75\%$.
Turli tasodifiy asoslarni tanlab, bir nechta iteratsiya bajarsak, son haqiqatan tubmi yoki murakkabmi, juda katta ehtimollik bilan aniqlay olamiz.
Quyida 64-bitli butun sonlar uchun implementatsiya keltirilgan.

```cpp
using u64 = uint64_t;
using u128 = __uint128_t;

u64 binpower(u64 base, u64 e, u64 mod) {
    u64 result = 1;
    base %= mod;
    while (e) {
        if (e & 1)
            result = (u128)result * base % mod;
        base = (u128)base * base % mod;
        e >>= 1;
    }
    return result;
}
bool check_composite(u64 n, u64 a, u64 d, int s) {
    u64 x = binpower(a, d, n);
    if (x == 1 || x == n - 1)
        return false;
    for (int r = 1; r < s; r++) {
        x = (u128)x * x % n;
        if (x == n - 1)
            return false;
    }
    return true;
};

bool MillerRabin(u64 n, int iter=5) { // returns true if n is probably prime, else returns false.
    if (n < 4)
        return n == 2 || n == 3;
    int s = 0;
    u64 d = n - 1;
    while ((d & 1) == 0) {
        d >>= 1;
        s++;
    }

    for (int i = 0; i < iter; i++) {
        int a = 2 + rand() % (n - 3);
        if (check_composite(n, a, d, s))
            return false;
    }
    return true;
}
```

Miller–Rabin testidan oldin dastlabki bir nechta tub sonlardan biri bo‘luvchi ekanini qo‘shimcha ravishda tekshirish mumkin.
Bu testni ancha tezlashtiradi, chunki murakkab sonlarning aksariyatida juda kichik tub bo‘luvchilar mavjud.
Masalan, barcha sonlarning $88\%$ ida $100$ dan kichik tub ko‘paytuvchi bor.

### Deterministik ko‘rinish

Miller faqat $\le O((\ln n)^2)$ bo‘lgan barcha asoslarni tekshirish orqali algoritmni deterministik qilish mumkinligini ko‘rsatgan.
Keyinroq Bach aniq chegara berdi: faqat $a \le 2 \ln(n)^2$ asoslarini tekshirish kifoya.
Bu hamon juda ko‘p asos degani.
Shu sababli yanada kichik chegaralarni topishga juda katta hisoblash quvvati sarflangan.
Ma’lum bo‘lishicha, 32-bitli butun sonni tekshirish uchun dastlabki 4 ta tub asosni — 2, 3, 5 va 7 ni — tekshirish kifoya.
Bu testdan noto‘g‘ri o‘tadigan eng kichik murakkab son $3,215,031,751 = 151 \cdot 751 \cdot 28351$.
64-bitli butun sonni tekshirish uchun esa dastlabki 12 ta tub asosni — 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 va 37 ni — tekshirish kifoya.
Natijada quyidagi deterministik implementatsiya hosil bo‘ladi:

```cpp
bool MillerRabin(u64 n) { // returns true if n is prime, else returns false.
    if (n < 2)
        return false;

    int r = 0;
    u64 d = n - 1;
    while ((d & 1) == 0) {
        d >>= 1;
        r++;
    }

    for (int a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (n == a)
            return true;
        if (check_composite(n, a, d, r))
            return false;
    }
    return true;
}
```

Tekshiruvni faqat 7 ta asos — 2, 325, 9375, 28178, 450775, 9780504 va 1795265022 — yordamida ham bajarish mumkin.
Biroq bu sonlar (2 dan tashqari) tub emasligi sababli, tekshirilayotgan son ushbu asoslarning biror tub bo‘luvchisiga — 2, 3, 5, 13, 19, 73, 193, 407521 yoki 299210837 ga — teng emasligini ham qo‘shimcha tekshirish kerak.

## Mashq masalalari

- [SPOJ — Tubmi yoki yo‘qmi](https://www.spoj.com/problems/PON/)
- [Project Euler — Tub sonlar naqshini tadqiq qilish](https://projecteuler.net/problem=146)
