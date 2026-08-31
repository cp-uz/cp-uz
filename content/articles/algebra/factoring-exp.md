---
article_id: algebra--factoring-exp
---
# Faktorlash orqali ikkilik darajaga oshirish

$a$, $x$, $y$ butun sonlari va $d \geq 3$ berilgan, $x$ toq bo‘lganda $ax^y \pmod{2^d}$ ni hisoblash masalasini ko‘rib chiqamiz.

Quyidagi algoritm bu masalani $O(d)$ ta qo‘shish va bitli amal hamda $y$ ga bitta ko‘paytirish yordamida yechish imkonini beradi.

$2^d$ modul bo‘yicha multiplikativ guruhning tuzilishi sababli, $x \equiv 1 \pmod 4$ shartni qanoatlantiradigan istalgan $x$ sonini

$$
x \equiv b^{L(x)} \pmod{2^d},
$$

ko‘rinishda ifodalash mumkin, bu yerda $b \equiv 5 \pmod 8$. Umumiylikni yo‘qotmasdan $x \equiv 1 \pmod 4$ deb faraz qilamiz, chunki $x \equiv 3 \pmod 4$ holni $x \mapsto -x$ va $a \mapsto (-1)^{y} a$ almashtirishlari orqali $x \equiv 1 \pmod 4$ holga keltirish mumkin. Bu belgilashlarda $ax^y$ quyidagicha ifodalanadi:

$$
a x^y \equiv a b^{yL(x)} \pmod{2^d}.
$$

Algoritmning asosiy g‘oyasi $2^d$ modul bo‘yicha ishlayotganimiz faktidan foydalanib, $L(x)$ va $b^{y L(x)}$ hisoblashni soddalashtirishdir. Keyinroq ayon bo‘ladigan sabablarga ko‘ra, $L(x)$ o‘rniga $4L(x)$ bilan ishlaymiz, ammo uni $2^{d-2}$ emas, $2^d$ modul bo‘yicha olamiz.

Ushbu maqolada 32-bitli butun sonlar uchun implementatsiyani ko‘rib chiqamiz. Quyidagicha belgilaymiz:
* `mbin_log_32(r, x)` — $r+4L(x) \pmod{2^d}$ ni hisoblaydigan funksiya;
* `mbin_exp_32(r, x)` — $r b^{\frac{x}{4}} \pmod{2^d}$ ni hisoblaydigan funksiya;
* `mbin_power_odd_32(a, x, y)` — $ax^y \pmod{2^d}$ ni hisoblaydigan funksiya.

U holda `mbin_power_odd_32` quyidagicha implementatsiya qilinadi:
```cpp
uint32_t mbin_power_odd_32(uint32_t rem, uint32_t base, uint32_t exp) {
    if (base & 2) {
        /* divider is considered negative */
        base = -base;
        /* check if result should be negative */
        if (exp & 1) {
            rem = -rem;
        }
    }
    return (mbin_exp_32(rem, mbin_log_32(0, base) * exp));
}
```
## $x$ dan $4L(x)$ ni hisoblash

$x \equiv 1 \pmod 4$ bo‘lgan toq $x$ sonini olaylik. Uni

$$
x \equiv (2^{a_1}+1)\dots(2^{a_k}+1) \pmod{2^d},
$$

ko‘rinishda ifodalash mumkin, bu yerda $1 < a_1 < \dots < a_k < d$. Har bir ko‘paytuvchi uchun $L(\cdot)$ to‘g‘ri aniqlangan, chunki ularning barchasi $4$ modul bo‘yicha $1$ ga teng. Demak,

$$
4L(x) \equiv 4L(2^{a_1}+1)+\dots+4L(2^{a_k}+1) \pmod{2^{d}}.
$$

Shunday qilib, barcha $1 < k < d$ uchun $t_k = 4L(2^n+1)$ qiymatlarni oldindan hisoblasak, istalgan $x$ soni uchun $4L(x)$ ni hisoblay olamiz.
32-bitli butun sonlar uchun quyidagi jadvaldan foydalanish mumkin:
```cpp
const uint32_t mbin_log_32_table[32] = {
    0x00000000, 0x00000000, 0xd3cfd984, 0x9ee62e18,
    0xe83d9070, 0xb59e81e0, 0xa17407c0, 0xce601f80,
    0xf4807f00, 0xe701fe00, 0xbe07fc00, 0xfc1ff800,
    0xf87ff000, 0xf1ffe000, 0xe7ffc000, 0xdfff8000,
    0xffff0000, 0xfffe0000, 0xfffc0000, 0xfff80000,
    0xfff00000, 0xffe00000, 0xffc00000, 0xff800000,
    0xff000000, 0xfe000000, 0xfc000000, 0xf8000000,
    0xf0000000, 0xe0000000, 0xc0000000, 0x80000000,
};
```
Amalda yuqorida tasvirlanganidan biroz boshqacha yondashuv ishlatiladi. $x$ ni ko‘paytuvchilarga ajratish o‘rniga, uni $2^d$ modul bo‘yicha $1$ ga aylantirgunimizcha ketma-ket $2^n+1$ ga ko‘paytiramiz. Shu yo‘l bilan $x^{-1}$ ning ifodasini topamiz, ya’ni

$$
x (2^{a_1}+1)\dots(2^{a_k}+1) \equiv 1 \pmod {2^d}.
$$
Buning uchun $1 < n < d$ bo‘lgan $n$ larni ko‘rib chiqamiz. Agar joriy $x$ sonining $n$-biti o‘rnatilgan bo‘lsa, $x$ ni $2^n+1$ ga ko‘paytiramiz; C++ da buni qulay tarzda `x = x + (x << n)` deb yozish mumkin. Bu $n$ dan kichik bitlarni o‘zgartirmaydi, ammo $x$ toq bo‘lgani sababli $n$-bitni nolga aylantiradi.

Bularning barchasini hisobga olsak, `mbin_log_32(r, x)` funksiyasi quyidagicha implementatsiya qilinadi:

```cpp
uint32_t mbin_log_32(uint32_t r, uint32_t x) {
    uint8_t n;
    for (n = 2; n < 32; n++) {
        if (x & (1 << n)) {
            x = x + (x << n);
            r -= mbin_log_32_table[n];
        }
    }

    return r;
}
```

$4L(x) = -4L(x^{-1})$ ekaniga e’tibor bering. Shu sababli $4L(2^n+1)$ ni qo‘shish o‘rniga, uni dastlab $0$ ga teng bo‘lgan $r$ dan ayiramiz.
## $4L(x)$ dan $x$ ni hisoblash

$k \geq 1$ uchun

$$
(a 2^{k}+1)^2 = a^2 2^{2k} +a 2^{k+1}+1 = b2^{k+1}+1,
$$

tenglik bajarilishiga e’tibor bering. Bundan takroriy kvadratlash yordamida

$$
(2^a+1)^{2^b} \equiv 1 \pmod{2^{a+b}}.
$$

natijani olish mumkin.

Bu natijani $a=2^n+1$ va $b=d-k$ ga qo‘llab, $2^n+1$ ning multiplikativ tartibi $2^{d-n}$ ning bo‘luvchisi ekanini olamiz.
Bu esa o‘z navbatida $L(2^n+1)$ soni $2^{n}$ ga bo‘linishi kerakligini anglatadi, chunki $b$ ning tartibi $2^{d-2}$, $b^y$ ning tartibi esa $2^{d-2-v}$ ga teng; bu yerda $2^v$ — $y$ ni bo‘ladigan ikkilikning eng katta darajasi. Shuning uchun

$$
2^{d-k} \equiv 0 \pmod{2^{d-2-v}},
$$

bo‘lishi kerak va demak $v$ soni $k-2$ dan katta yoki unga teng. Bu biroz noqulay; uni yumshatish uchun maqola boshida $L(x)$ ni $4$ ga ko‘paytirishimizni aytdik. Endi $4L(x)$ ma’lum bo‘lsa, $4L(x)$ dagi bitlarni ketma-ket tekshirish orqali uni $4L(2^n+1)$ lar yig‘indisiga yagona tarzda ajratish mumkin. Agar $n$-bit $1$ ga teng bo‘lsa, natijani $2^n+1$ ga ko‘paytiramiz va joriy $4L(x)$ dan $4L(2^n+1)$ ni ayiramiz.

Demak, `mbin_exp_32` quyidagicha implementatsiya qilinadi:

```cpp
uint32_t mbin_exp_32(uint32_t r, uint32_t x) {
    uint8_t n;
    for (n = 2; n < 32; n++) {
        if (x & (1 << n)) {
            r = r + (r << n);
            x -= mbin_log_32_table[n];
        }
    }

    return r;
}
```
## Qo‘shimcha optimallashtirishlar

$4L(2^{d-1}+1)=2^{d-1}$ ekaniga va $2k \geq d$ bo‘lganda

$$
(2^n+1)^2 \equiv 2^{2n} + 2^{n+1}+1 \equiv 2^{n+1}+1 \pmod{2^d},
$$

tenglik bajarilishiga e’tibor bersangiz, iteratsiyalar sonini ikki baravar kamaytirish mumkin.
Bundan $2n \geq d$ uchun $4L(2^n+1)=2^n$ ekanini olish mumkin. Shu sababli algoritmni faqat $\frac{d}{2}$ gacha yuritib, qolgan qismini yuqoridagi faktdan foydalanib bitli amallar bilan hisoblash orqali soddalashtirish mumkin:
```cpp
uint32_t mbin_log_32(uint32_t r, uint32_t x) {
    uint8_t n;

    for (n = 2; n != 16; n++) {
        if (x & (1 << n)) {
            x = x + (x << n);
            r -= mbin_log_32_table[n];
        }
    }

    r -= (x & 0xFFFF0000);

    return r;
}

uint32_t mbin_exp_32(uint32_t r, uint32_t x) {
    uint8_t n;

    for (n = 2; n != 16; n++) {
        if (x & (1 << n)) {
            r = r + (r << n);
            x -= mbin_log_32_table[n];
        }
    }

    r *= 1 - (x & 0xFFFF0000);
    return r;
}
```
## Logarifmlar jadvalini hisoblash

Logarifmlar jadvalini hisoblash uchun [Pohlig–Hellman algoritmini](https://en.wikipedia.org/wiki/Pohlig–Hellman_algorithm) modul ikkilikning darajasi bo‘lgan holga moslashtirish mumkin.

Bu yerdagi asosiy vazifamiz $g^x \equiv y \pmod{2^d}$ tenglikni qanoatlantiradigan $x$ ni hisoblashdir; bu yerda $g=5$, $y$ esa $2^n+1$ ko‘rinishidagi son.

Tenglikning ikkala tomonini $k$ marta kvadratga oshirib,

$$
g^{2^k x} \equiv y^{2^k} \pmod{2^d}.
$$

tenglikka kelamiz.

$g$ ning tartibi $2^{d}$ dan katta emasligiga e’tibor bering (aslida u $2^{d-2}$ dan katta emas, ammo qulaylik uchun $2^d$ bilan ishlaymiz). Shu sababli $k=d-1$ deb olsak, chap tomonda $g^1$ yoki $g^0$ hosil bo‘ladi; bu $y^{2^k}$ ni $g$ bilan taqqoslash orqali $x$ ning eng kichik bitini aniqlash imkonini beradi. Endi $x=x_0 + 2^k x_1$ bo‘lsin, bu yerda $x_0$ — ma’lum qism, $x_1$ esa hali noma’lum. U holda

$$
g^{x_0+2^k x_1} \equiv y \pmod{2^d}.
$$

Tenglikning ikkala tomonini $g^{-x_0}$ ga ko‘paytirib,
$$
g^{2^k x_1} \equiv (g^{-x_0} y) \pmod{2^d}.
$$

ni olamiz.

Endi ikkala tomonni $d-k-1$ marta kvadratga oshirib, $x$ ning keyingi bitini olish mumkin; shu tarzda oxir-oqibat uning barcha bitlari tiklanadi.
## Manbalar

* [M30, Hans Petter Selasky, 2009](https://ia601602.us.archive.org/29/items/B-001-001-251/B-001-001-251.pdf#page=640)
