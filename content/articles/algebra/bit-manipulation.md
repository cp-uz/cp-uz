---
article_id: algebra--bit-manipulation
---
# Bitlar bilan amallar

## Ikkilik son

**Ikkilik son** — asosi 2 bo‘lgan sanoq tizimida, ya’ni odatda faqat ikkita belgi — `0` (nol) va `1` (bir) yordamida yozilgan son.

Biror bit birga teng bo‘lsa, uni **o‘rnatilgan**, nolga teng bo‘lsa esa **tozalangan** deymiz.

$(a_k a_{k-1} \dots a_1 a_0)_2$ ikkilik soni quyidagi sonni ifodalaydi:

$$(a_k a_{k-1} \dots a_1 a_0)_2 = a_k \cdot 2^k + a_{k-1} \cdot 2^{k-1} + \dots + a_1 \cdot 2^1 + a_0 \cdot 2^0.$$
Masalan, $1101_2$ ikkilik soni 13 sonini ifodalaydi:

$$\begin{align}
1101_2 &= 1 \cdot 2^3 + 1 \cdot 2^2 + 0 \cdot 2^1 + 1 \cdot 2^0 \\
       &= 1\cdot 8 + 1 \cdot 4 + 0 \cdot 2 + 1 \cdot 1 = 13
\end{align}$$
Kompyuterlar butun sonlarni ikkilik sonlar ko‘rinishida ifodalaydi.
Musbat butun sonlar (ishorali va ishorasiz) shunchaki ikkilik raqamlari bilan ifodalanadi, manfiy qiymat ham olishi mumkin bo‘lgan ishorali sonlarning manfiy qiymatlari esa odatda [ikkilik qo‘shimcha kod](https://en.wikipedia.org/wiki/Two%27s_complement) yordamida ifodalanadi.

```cpp
unsigned int unsigned_number = 13;
assert(unsigned_number == 0b1101);

int positive_signed_number = 13;
assert(positive_signed_number == 0b1101);
int negative_signed_number = -13;
assert(negative_signed_number == 0b1111'1111'1111'1111'1111'1111'1111'0011);
```
Protsessorlar maxsus amallar yordamida bunday bitlarni juda tez o‘zgartira oladi.
Ayrim masalalarda ikkilik ko‘rinishlardan foydalanib ishlash vaqtini tezlashtirish mumkin.
Yana ayrim masalalarda (odatda kombinatorika yoki dinamik dasturlashda) berilgan obyektlar to‘plamidan qaysi obyektlarni tanlaganimizni kuzatish kerak bo‘ladi. Bunda yetarlicha katta butun sonning har bir biti bitta obyektni ifodalashi mumkin; obyekt tanlansa bit o‘rnatiladi, olib tashlansa tozalanadi.
## Bit operatorlari

Quyida kiritiladigan barcha operatorlar qat’iy uzunlikdagi butun sonlarda protsessorda darhol (qo‘shish amali bilan taxminan bir xil tezlikda) bajariladi.
### Bitli operatorlar
-   $\&$ : Bitli AND operatori birinchi operandning har bir bitini ikkinchi operandning mos biti bilan taqqoslaydi.
    Ikkala bit ham 1 bo‘lsa, natijaning mos biti 1 ga o‘rnatiladi. Aks holda mos natija biti 0 bo‘ladi.

-   $|$ : Bitli inklyuziv OR operatori birinchi operandning har bir bitini ikkinchi operandning mos biti bilan taqqoslaydi.
    Ikki bitdan kamida bittasi 1 bo‘lsa, natijaning mos biti 1 ga o‘rnatiladi. Aks holda u 0 bo‘ladi.
-   $\wedge$ : Bitli eksklyuziv OR (XOR) operatori birinchi operandning har bir bitini ikkinchi operandning mos biti bilan taqqoslaydi.
    Bitlardan biri 0, ikkinchisi 1 bo‘lsa, natijaning mos biti 1 bo‘ladi. Aks holda u 0 bo‘ladi.

-   $\sim$ : Bitli to‘ldirish (NOT) operatori sonning har bir bitini teskarisiga almashtiradi: o‘rnatilgan bitni tozalaydi, tozalangan bitni esa o‘rnatadi.

Misollar:
```
n         = 01011000
n-1       = 01010111
--------------------
n & (n-1) = 01010000
```

```
n         = 01011000
n-1       = 01010111
--------------------
n | (n-1) = 01011111
```

```
n         = 01011000
n-1       = 01010111
--------------------
n ^ (n-1) = 00001111
```

```
n         = 01011000
--------------------
~n        = 10100111
```
### Siljitish operatorlari

Bitlarni siljitish uchun ikkita operator mavjud.

-   $\gg$ Sonning oxirgi bir nechta ikkilik raqamini olib tashlab, uni o‘ngga siljitadi.
    Har bir bir pozitsiyali siljitish 2 ga butun bo‘lishni ifodalaydi; demak, $k$ pozitsiyaga o‘ngga siljitish $2^k$ ga butun bo‘lishdir.

    Masalan, $5 \gg 2 = 101_2 \gg 2 = 1_2 = 1$, bu $\frac{5}{2^2}=\frac54=1$ bilan bir xil.
    Ammo kompyuter uchun bitlarni siljitish bo‘lish amalidan ancha tez.
-   $\ll$ Sonning oxiriga nol raqamlarini qo‘shib, uni chapga siljitadi.
    O‘ngga siljitishga o‘xshash tarzda, $k$ pozitsiyaga chapga siljitish $2^k$ ga ko‘paytirishni ifodalaydi.

    Masalan, $5 \ll 3 = 101_2 \ll 3 = 101000_2 = 40$, bu $5\cdot2^3=5\cdot8=40$ bilan bir xil.

    Biroq qat’iy uzunlikdagi butun sonlarda bu eng chapdagi raqamlarning tushib qolishini anglatadi; juda ko‘p siljitsangiz, natija 0 bo‘ladi.
## Foydali hiylalar

### Bitni o‘rnatish/almashtirish/tozalash

Bitli siljitish va bir nechta sodda bitli amal yordamida bitni oson o‘rnatish, teskarisiga almashtirish yoki tozalash mumkin.
$1 \ll x$ — faqat $x$-biti o‘rnatilgan son; $\sim(1 \ll x)$ esa $x$-bitdan tashqari barcha bitlari o‘rnatilgan son.

- $n ~|~ (1 \ll x)$ son $n$ ning $x$-bitini o‘rnatadi;
- $n ~\wedge~ (1 \ll x)$ son $n$ ning $x$-bitini teskarisiga almashtiradi;
- $n ~\&~ \sim(1 \ll x)$ son $n$ ning $x$-bitini tozalaydi.
### Bit o‘rnatilganini tekshirish

$x$-bit qiymatini sonni $x$ pozitsiya o‘ngga siljitib, $x$-bitni birliklar xonasiga olib kelish va so‘ng 1 bilan bitli AND bajarib ajratib olish orqali tekshirish mumkin.

``` cpp
bool is_set(unsigned int number, int x) {
    return (number >> x) & 1;
}
```
### Son 2 ning darajasiga bo‘linishini tekshirish

AND amali yordamida $n$ soni juft ekanini tekshirish mumkin: $n ~\&~ 1=0$ bo‘lsa $n$ juft, $n ~\&~ 1=1$ bo‘lsa $n$ toq.
Umumiyroq holda, $n$ soni $2^k$ ga aynan $n ~\&~ (2^k-1)=0$ bo‘lganda bo‘linadi.

``` cpp
bool isDivisibleByPowerOf2(int n, int k) {
    int powerOf2 = 1 << k;
    return (n & (powerOf2 - 1)) == 0;
}
```
$2^k$ ni 1 ni $k$ pozitsiya chapga siljitib hisoblash mumkin.
Hiyla shuning uchun ishlaydiki, $2^k-1$ soni aynan $k$ ta birdan iborat.
$2^k$ ga bo‘linadigan son esa shu pozitsiyalarda nol raqamlarga ega bo‘lishi kerak.
### Butun son 2 ning darajasi ekanini tekshirish

Ikkining darajasi faqat bitta o‘rnatilgan bitga ega bo‘ladi (masalan, $32=0010~0000_2$), uning oldingi sonida esa o‘sha bit tozalanib, undan keyingi barcha bitlar o‘rnatilgan bo‘ladi ($31=0001~1111_2$).
Shuning uchun son bilan uning oldingi sonining bitli AND natijasi doimo 0, chunki ularning umumiy o‘rnatilgan biti yo‘q.
Bu holat faqat ikkining darajalari va umuman o‘rnatilgan biti yo‘q 0 soni uchun yuz berishini oson tekshirish mumkin.
``` cpp
bool isPowerOfTwo(unsigned int n) {
    return n && !(n & (n - 1));
}
```
### Eng o‘ngdagi o‘rnatilgan bitni tozalash

$n ~\&~ (n-1)$ ifodasi $n$ sonining eng o‘ngdagi o‘rnatilgan bitini o‘chiradi.
Bu ishlaydi, chunki $n-1$ ifodasi $n$ ning eng o‘ngdagi o‘rnatilgan bitidan keyingi barcha bitlarni, o‘sha bitning o‘zini ham qo‘shib, teskarisiga almashtiradi.
Shu sababli bu raqamlarning barchasi dastlabki sondagi bitlardan farq qiladi va bitli AND ulardan barchasini 0 ga aylantiradi; natijada dastlabki $n$ sonining faqat eng o‘ngdagi o‘rnatilgan biti o‘chadi.

Masalan, $52=0011~0100_2$ sonini ko‘rib chiqamiz:
```
n         = 00110100
n-1       = 00110011
--------------------
n & (n-1) = 00110000
```
### Brian Kernighan algoritmi

Yuqoridagi ifoda yordamida o‘rnatilgan bitlar sonini sanash mumkin.

G‘oya butun sonning faqat o‘rnatilgan bitlarini ko‘rib chiqishdan iborat: eng o‘ngdagi o‘rnatilgan bit sanalgach o‘chiriladi, shu sababli siklning keyingi iteratsiyasi navbatdagi eng o‘ngdagi bitni ko‘radi.

``` cpp
int countSetBits(int n)
{
    int count = 0;
    while (n)
    {
        n = n & (n - 1);
        count++;
    }
    return count;
}
```
### $n$ gacha o‘rnatilgan bitlarni sanash
$n$ sonigacha (shu jumladan) bo‘lgan barcha sonlarning o‘rnatilgan bitlarini sanash uchun Brian Kernighan algoritmini $n$ gacha bo‘lgan barcha sonlarga qo‘llash mumkin. Biroq bu musobaqa yechimlarida “Time Limit Exceeded” ga olib keladi.
$2^x$ gacha bo‘lgan sonlarda (ya’ni $1$ dan $2^x-1$ gacha) jami $x\cdot2^{x-1}$ ta o‘rnatilgan bit borligidan foydalanish mumkin. Buni quyidagicha tasavvur qilish mumkin:
```
0 ->   0 0 0 0
1 ->   0 0 0 1
2 ->   0 0 1 0
3 ->   0 0 1 1
4 ->   0 1 0 0
5 ->   0 1 0 1
6 ->   0 1 1 0
7 ->   0 1 1 1
8 ->   1 0 0 0
```

Eng chapdagidan tashqari barcha ustunlarda 4 tadan (ya’ni $2^2$ ta) o‘rnatilgan bit borligini ko‘ramiz. Demak, $2^3-1$ gacha bo‘lgan sonlarda o‘rnatilgan bitlar soni $3\cdot2^{3-1}$ ga teng.
Bu bilim yordamida quyidagi algoritmni tuzish mumkin:

- Berilgan sondan kichik yoki unga teng bo‘lgan ikkining eng katta darajasini toping. Uning daraja ko‘rsatkichini $x$ deb belgilang.
- $1$ dan $2^x-1$ gacha o‘rnatilgan bitlar sonini $x\cdot2^{x-1}$ formulasi bilan hisoblang.
- $2^x$ dan $n$ gacha eng katta razryaddagi o‘rnatilgan bitlar sonini sanab, javobga qo‘shing.
- $n$ dan $2^x$ ni ayiring va yangi $n$ bilan yuqoridagi qadamlarni takrorlang.
```cpp
int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            int x = std::bit_width(n) - 1;
            count += x << (x - 1);
            n -= 1 << x;
            count += n + 1;
        }
        return count;
}
```
### Qo‘shimcha hiylalar

- $n ~\&~ (n + 1)$ oxirdagi barcha birlarni tozalaydi: $0011~0111_2 \rightarrow 0011~0000_2$.
- $n ~|~ (n + 1)$ oxirgi tozalangan bitni o‘rnatadi: $0011~0101_2 \rightarrow 0011~0111_2$.
- $n ~\&~ -n$ oxirgi o‘rnatilgan bitni ajratib oladi: $0011~0100_2 \rightarrow 0000~0100_2$.

Yana ko‘plab hiylalarni [Hacker's Delight](https://en.wikipedia.org/wiki/Hacker%27s_Delight) kitobidan topish mumkin.
### Til va kompilyator yordami

C++20 dan boshlab C++ standart [bit](https://en.cppreference.com/w/cpp/header/bit) kutubxonasi orqali ushbu amallarning ayrimlarini qo‘llab-quvvatlaydi:

- `has_single_bit`: son ikkining darajasi ekanini tekshiradi;
- `bit_ceil` / `bit_floor`: sonni navbatdagi ikkining darajasigacha yuqoriga/pastga yaxlitlaydi;
- `rotl` / `rotr`: son bitlarini siklik chapga/o‘ngga aylantiradi;
- `countl_zero` / `countr_zero` / `countl_one` / `countr_one`: boshidagi/oxiridagi nollar/birlar sonini sanaydi;
- `popcount`: o‘rnatilgan bitlar sonini sanaydi.
Bundan tashqari, ayrim kompilyatorlarda bitlar bilan ishlash uchun oldindan aniqlangan funksiyalar mavjud.
Masalan, GCC [Built-in Functions Provided by GCC](https://gcc.gnu.org/onlinedocs/gcc/Other-Builtins.html) ro‘yxatidagi, C++ ning eski versiyalarida ham ishlaydigan funksiyalarni taqdim etadi:
- `__builtin_popcount(unsigned int)` o‘rnatilgan bitlar sonini qaytaradi (`__builtin_popcount(0b0001'0010'1100) == 4`);
- `__builtin_ffs(int)` birinchi (eng o‘ngdagi) o‘rnatilgan bit indeksini topadi (`__builtin_ffs(0b0001'0010'1100) == 3`);
- `__builtin_clz(unsigned int)` boshidagi nollar sonini beradi (`__builtin_clz(0b0001'0010'1100) == 23`);
- `__builtin_ctz(unsigned int)` oxiridagi nollar sonini beradi (`__builtin_ctz(0b0001'0010'1100) == 2`);
- ` __builtin_parity(x)` sonning bitli ifodasidagi birlar sonining juft-toqligini qaytaradi.
_E’tibor bering, ayrim amallar (C++20 funksiyalari ham, kompilyatorning built-in funksiyalari ham) GCC da `#pragma GCC target("popcnt")` kabi aniq protsessor nishonini yoqmasangiz ancha sekin ishlashi mumkin._
## Mashq masalalari

* [Codeforces - Raising Bacteria](https://codeforces.com/problemset/problem/579/A)
* [Codeforces - Fedor and New Game](https://codeforces.com/problemset/problem/467/B)
* [Codeforces - And Then There Were K](https://codeforces.com/problemset/problem/1527/A)
