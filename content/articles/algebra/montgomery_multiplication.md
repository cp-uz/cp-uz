---
article_id: algebra--montgomery_multiplication
---
# Montgomery ko‘paytirishi

Sonlar nazariyasidagi ko‘plab algoritmlar, masalan [tublikni tekshirish](primality_tests.md) yoki [butun sonlarni faktorizatsiya qilish](factorization.md), shuningdek RSA kabi kriptografik algoritmlar katta son modulida juda ko‘p amal bajarishni talab qiladi.
$x y \bmod n$ kabi ko‘paytmani odatiy algoritmlar bilan hisoblash ancha sekin, chunki ko‘paytmadan $n$ ni necha marta ayirish kerakligini bilish uchun bo‘lish amali bajariladi.
Bo‘lish esa, ayniqsa katta sonlarda, juda qimmat amal.
**Montgomery (modul) ko‘paytirishi** bunday ko‘paytmalarni tezroq hisoblash imkonini beradigan usuldir.
Ko‘paytmani bo‘lib, undan $n$ ni bir necha marta ayirish o‘rniga, u quyi bitlarni bekor qilish uchun $n$ ning karralilarini qo‘shadi va so‘ng quyi bitlarni shunchaki tashlab yuboradi.
## Montgomery ifodasi

Biroq Montgomery ko‘paytirishi tekin kelmaydi.
Algoritm faqat **Montgomery fazosi**da ishlaydi.
Ko‘paytirishni boshlashdan oldin sonlarimizni shu fazoga o‘tkazishimiz kerak.
Fazo uchun $n$ bilan o‘zaro tub bo‘lgan, ya’ni $\gcd(n,r)=1$ shartini qanoatlantiradigan musbat $r\ge n$ butun soni kerak.
Amalda har doim $r=2^m$ ni tanlaymiz, bu yerda $m$ — musbat butun son; chunki u holda $r$ ga ko‘paytirish, bo‘lish va modul olishni siljitishlar hamda boshqa bit amallari bilan samarali bajarish mumkin.
Deyarli barcha qo‘llanishlarda $n$ toq bo‘ladi, chunki juft sonni faktorizatsiya qilish qiyin emas.
Shu sababli $2$ ning istalgan darajasi $n$ bilan o‘zaro tub bo‘ladi.
$x$ sonining Montgomery fazosidagi vakili $\bar{x}$ quyidagicha aniqlanadi:

$$\bar{x} := x \cdot r \bmod n$$

E’tibor bering, bu o‘tkazishning o‘zi aynan optimallashtirmoqchi bo‘lgan ko‘paytirishimizdir.
Demak, u hamon qimmat amal.
Ammo sonni fazoga faqat bir marta o‘tkazish kerak.
Montgomery fazosiga kirgach, istalgancha amalni samarali bajarish mumkin.
Oxirida yakuniy natijani yana oddiy fazoga qaytaramiz.
Shunday qilib, $n$ modul bo‘yicha ko‘p amal bajarsak, bu muammo bo‘lmaydi.
Montgomery fazosida aksariyat amallarni odatdagidek bajarish mumkin.
Ikki elementni qo‘shish ($x\cdot r+y\cdot r\equiv(x+y)\cdot r\bmod n$), ayirish, tenglikni tekshirish va hatto son bilan $n$ ning eng katta umumiy bo‘luvchisini hisoblash mumkin (chunki $\gcd(n,r)=1$).
Bularning barchasi odatiy algoritmlar bilan bajariladi.

Ammo ko‘paytirish uchun bunday emas.

Natija quyidagicha bo‘lishini kutamiz:

$$\bar{x} * \bar{y} = \overline{x \cdot y} = (x \cdot y) \cdot r \bmod n.$$
Oddiy ko‘paytirish esa:

$$\bar{x} \cdot \bar{y} = (x \cdot y) \cdot r \cdot r \bmod n.$$

ni beradi. Shuning uchun Montgomery fazosidagi ko‘paytirish quyidagicha aniqlanadi:

$$\bar{x} * \bar{y} := \bar{x} \cdot \bar{y} \cdot r^{-1} \bmod n.$$
## Montgomery reduksiyasi

Montgomery fazosidagi ikki sonni ko‘paytirish $x\cdot r^{-1}\bmod n$ ni samarali hisoblashni talab qiladi.
Bu amal **Montgomery reduksiyasi** deb ataladi va **REDC** algoritmi nomi bilan ham tanilgan.

$\gcd(n,r)=1$ bo‘lgani uchun $0<r^{-1},n^{\prime}<n$ shartlarini qanoatlantiradigan ikkita $r^{-1}$ va $n^{\prime}$ soni mavjudligini bilamiz:

$$r \cdot r^{-1} + n \cdot n^{\prime} = 1.$$

$r^{-1}$ va $n^{\prime}$ ning ikkalasini ham [kengaytirilgan Evklid algoritmi](extended-euclid-algorithm.md) bilan hisoblash mumkin.

Ushbu ayniyatdan foydalanib $x\cdot r^{-1}$ ni quyidagicha yozamiz:

$$\begin{aligned}
x \cdot r^{-1} &= x \cdot r \cdot r^{-1} / r = x \cdot (-n \cdot n^{\prime} + 1) / r \\
&= (-x \cdot n \cdot n^{\prime} + x) / r \equiv (-x \cdot n \cdot n^{\prime} + l \cdot r \cdot n + x) / r \bmod n\\
&\equiv ((-x \cdot n^{\prime} + l \cdot r) \cdot n + x) / r \bmod n
\end{aligned}$$

Bu kongruensiyalar istalgan $l$ butun son uchun bajariladi.
Demak, $x\cdot n^{\prime}$ ga $r$ ning istalgan karralisini qo‘shish yoki ayirishimiz mumkin; boshqacha aytganda, $q:=x\cdot n^{\prime}$ ni $r$ modul bo‘yicha hisoblaymiz.

Shundan $x\cdot r^{-1}\bmod n$ ni hisoblaydigan quyidagi algoritm kelib chiqadi:

```text
function reduce(x):
    q = (x mod r) * n' mod r
    a = (x - q * n) / r
    if a < 0:
        a += n
    return a
```
$x<n\cdot n<r\cdot n$ (hatto $x$ ko‘paytirish natijasi bo‘lsa ham) va $q\cdot n<r\cdot n$ bo‘lgani sababli, $-n<(x-q\cdot n)/r<n$ ekanini bilamiz.
Shuning uchun yakuniy modul amali bitta tekshiruv va bitta qo‘shish bilan bajariladi.

Ko‘rib turganimizdek, Montgomery reduksiyasini og‘ir modul amallarisiz bajarish mumkin.
$r$ ni $2$ ning darajasi qilib tanlasak, algoritmdagi modul va bo‘lish amallarini bitmaska hamda siljitishlar bilan hisoblash mumkin.
Montgomery reduksiyasining ikkinchi qo‘llanishi sonni Montgomery fazosidan oddiy fazoga qaytarishdir.
## Tez teskari element hiylasi

$n^{\prime}:=n^{-1}\bmod r$ teskari elementni samarali hisoblash uchun Newton usulidan ilhomlangan quyidagi hiyladan foydalanish mumkin:

$$a \cdot x \equiv 1 \bmod 2^k \Longrightarrow a \cdot x \cdot (2 - a \cdot x) \equiv 1 \bmod 2^{2k}$$

Buni oson isbotlash mumkin.
Agar $a\cdot x=1+m\cdot2^k$ bo‘lsa:
$$\begin{aligned}
a \cdot x \cdot (2 - a \cdot x) &= 2 \cdot a \cdot x - (a \cdot x)^2 \\
&= 2 \cdot (1 + m \cdot 2^k) - (1 + m \cdot 2^k)^2 \\
&= 2 + 2 \cdot m \cdot 2^k - 1 - 2 \cdot m \cdot 2^k - m^2 \cdot 2^{2k} \\
&= 1 - m^2 \cdot 2^{2k} \\
&\equiv 1 \bmod 2^{2k}.
\end{aligned}$$

Demak, $a$ ning $2^1$ modul bo‘yicha teskari elementi sifatida $x=1$ dan boshlashimiz, hiylani bir necha marta qo‘llashimiz va har iteratsiyada $x$ ning to‘g‘ri bitlari sonini ikki baravar oshirishimiz mumkin.
## Implementatsiya

GCC kompilyatori `__int128` va `__uint128` turlari orqali 128 bitli butun sonlarni qo‘llab-quvvatlagani sababli, $x$, $y$ va $n$ uchalasi 64 bitli bo‘lsa, $x\cdot y\bmod n$ ni hali ham samarali hisoblash mumkin:

```cpp
long long result = (__int128)x * y % n;
```

Ammo 256 bitli butun son turi yo‘q.
Shuning uchun bu yerda 128 bitli ko‘paytirish implementatsiyasini ko‘rsatamiz.

```cpp
using u64 = uint64_t;
using u128 = __uint128_t;
using i128 = __int128_t;
struct u256 {
    u128 high, low;
    static u256 mult(u128 x, u128 y) {
        u64 a = x >> 64, b = x;
        u64 c = y >> 64, d = y;
        // (a*2^64 + b) * (c*2^64 + d) =
        // (a*c) * 2^128 + (a*d + b*c)*2^64 + (b*d)
        u128 ac = (u128)a * c;
        u128 ad = (u128)a * d;
        u128 bc = (u128)b * c;
        u128 bd = (u128)b * d;
        u128 carry = (u128)(u64)ad + (u128)(u64)bc + (bd >> 64u);
        u128 high = ac + (ad >> 64u) + (bc >> 64u) + (carry >> 64u);
        u128 low = (ad << 64u) + (bc << 64u) + bd;
        return {high, low};
    }
};
struct Montgomery {
    Montgomery(u128 n) : mod(n), inv(1) {
        for (int i = 0; i < 7; i++)
            inv *= 2 - n * inv;
    }

    u128 init(u128 x) {
        x %= mod;
        for (int i = 0; i < 128; i++) {
            x <<= 1;
            if (x >= mod)
                x -= mod;
        }
        return x;
    }

    u128 reduce(u256 x) {
        u128 q = x.low * inv;
        i128 a = x.high - u256::mult(q, mod).high;
        if (a < 0)
            a += mod;
        return a;
    }
    u128 mult(u128 a, u128 b) {
        return reduce(u256::mult(a, b));
    }

    u128 mod, inv;
};
```
## Tez o‘tkazish

Sonni Montgomery fazosiga o‘tkazishning hozirgi usuli ancha sekin.
Tezroq usullar mavjud.

Quyidagi munosabatga e’tibor bering:

$$\bar{x} := x \cdot r \bmod n = x \cdot r^2 / r = x * r^2$$

Sonni fazoga o‘tkazish — oddiy sonni $r^2$ ga Montgomery fazosining o‘zida ko‘paytirishdan iborat.
Shuning uchun $r^2\bmod n$ ni oldindan hisoblab, sonni 128 marta siljitish o‘rniga bitta ko‘paytirish bajarishimiz mumkin.
Quyidagi kodda `r2` ni `-n % n` bilan boshlaymiz; bu $r-n\equiv r\bmod n$ ga teng. Uni 4 marta siljitib $r\cdot2^4\bmod n$ ni olamiz.
Bu sonni Montgomery fazosidagi $2^4$ sifatida talqin qilish mumkin.
Uni 5 marta kvadratga oshirsak, $(2^4)^{2^5}=(2^4)^{32}=2^{128}=r$ ni Montgomery fazosida olamiz; bu aynan $r^2\bmod n$ ga teng.

```
struct Montgomery {
    Montgomery(u128 n) : mod(n), inv(1), r2(-n % n) {
        for (int i = 0; i < 7; i++)
            inv *= 2 - n * inv;
        for (int i = 0; i < 4; i++) {
            r2 <<= 1;
            if (r2 >= mod)
                r2 -= mod;
        }
        for (int i = 0; i < 5; i++)
            r2 = mul(r2, r2);
    }

    u128 init(u128 x) {
        return mult(x, r2);
    }

    u128 mod, inv, r2;
};
```
