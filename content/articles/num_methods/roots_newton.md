---
article_id: num_methods--roots_newton
---
# Ildiz topish uchun Newton usuli

Newton usuli — $f(x)=0$ tenglamaning ildizini taqribiy topadigan iteratsion sonli usul. Isaac Newton uni taxminan 1664-yilda yaratgan. Ba’zan usul Newton–Raphson deb ataladi: Raphson ayni g‘oyani keyinroq mustaqil topgan, ammo uning maqolasi oldinroq nashr qilingan.

$f(x)$ funksiya $[a,b]$ da uzluksiz va differensiallanuvchi, qidirilayotgan ildiz shu oraliqda mavjud deb faraz qilamiz. Maqsad ildizlardan bittasini topishdir.

## Geometrik g‘oya va formula

Algoritmga $f(x)$ dan tashqari boshlang‘ich yaqinlashuv $x_0$ ham beriladi. $x_i$ qiymat ma’lum bo‘lsa, funksiya grafigiga $(x_i,f(x_i))$ nuqtada urinma o‘tkaziladi. Urinmaning $x$ o‘qi bilan kesishgan koordinatasi keyingi yaqinlashuv $x_{i+1}$ sifatida olinadi.

Urinma qiyaligi $f'(x_i)$, tenglamasi esa

$$y-f(x_i)=f'(x_i)(x-x_i)$$

bo‘ladi. $x$ o‘qida $y=0$ va $x=x_{i+1}$, shuning uchun

$$-f(x_i)=f'(x_i)(x_{i+1}-x_i).$$

Bu tenglamadan Newton iteratsiyasi kelib chiqadi:

$$x_{i+1}=x_i-\frac{f(x_i)}{f'(x_i)}.$$

Funksiya yetarlicha silliq va $x_i$ ildizga yetarlicha yaqin bo‘lsa, $x_{i+1}$ odatda yanada yaqin bo‘ladi. Oddiy ildiz atrofida yaqinlashish **kvadratik**: shartlar bajarilganda aniq raqamlar soni har iteratsiyada taxminan ikki baravar ortadi.

## Yaqinlashish shartlari va ehtiyot choralari

Newton usuli har qanday boshlang‘ich nuqtadan kafolatli yaqinlashmaydi. Quyidagi holatlar muammo tug‘dirishi mumkin:

- $f'(x_i)=0$ yoki juda kichik bo‘lsa, formula aniqlanmaydi yoki juda katta qadam beradi;
- boshlang‘ich nuqta ildizdan uzoq bo‘lsa, iteratsiya boshqa ildizga ketishi, siklga tushishi yoki cheksiz uzoqlashishi mumkin;
- ko‘p karrali ildizda odatiy kvadratik tezlik yo‘qoladi;
- faqat `abs(x - nx) < eps` sharti funksiyaning o‘zidagi xato katta bo‘lsa, yolg‘on to‘xtash berishi mumkin.

Amaliy kod iteratsiyalar soniga limit qo‘yishi, `f'(x)` ni `EPS` bilan tekshirishi va kerak bo‘lsa `abs(f(x))` qoldiqni ham nazorat qilishi kerak. Ildiz qamrab olingan $[a,b]$ oraliq ma’lum bo‘lsa, Newton qadamini ikkilik qidiruv bilan birlashtirgan gibrid usul xavfsizroq.

## Kvadrat ildizni hisoblash

$\sqrt n$ ni topish uchun

$$f(x)=x^2-n$$

deb olamiz. $f'(x)=2x$ ni umumiy formulaga qo‘yib soddalashtirsak,

$$x_{i+1}=\frac{x_i+n/x_i}{2}$$

hosil bo‘ladi. Bu formula ba’zan Bobil usuli deb ham ataladi.

### Haqiqiy kvadrat ildiz

Ratsional $n\ge0$ sonning ildizini `eps` aniqlikkacha hisoblash:

```cpp
double sqrt_newton(double n) {
    if (n == 0)
        return 0;

    const double eps = 1E-15;
    double x = max(1.0, n);

    for (int iteration = 0; iteration < 200; ++iteration) {
        double nx = (x + n / x) / 2;
        if (abs(x - nx) < eps * max(1.0, abs(nx)))
            return nx;
        x = nx;
    }

    return x;
}
```

Nisbiy xatoga o‘xshash to‘xtash sharti juda katta va juda kichik $n$ lar uchun faqat mutlaq `eps` dan barqarorroq. Manfiy $n$ haqiqiy kvadrat ildizga ega emas va kirish sharti bilan cheklanishi yoki alohida xato sifatida qaytarilishi kerak.

### Butun kvadrat ildiz

Butun $n\ge0$ uchun $x^2\le n$ shartni qanoatlantiradigan eng katta butun $x$ kerak bo‘lsin. Butun bo‘lish sabab iteratsiya javob atrofidagi ikki qiymat orasida sakrashi mumkin. Agar oldingi qadamda $x$ kamayib, navbatdagi qadamda yana oshmoqchi bo‘lsa, jarayon to‘xtatiladi.

```cpp
int isqrt_newton(int n) {
    if (n == 0)
        return 0;

    int x = max(1, n);
    bool decreased = false;

    for (;;) {
        int nx = (x + n / x) >> 1;
        if (x == nx || (nx > x && decreased))
            break;
        decreased = nx < x;
        x = nx;
    }

    return x;
}
```

Hisob `int` diapazoniga yaqin bo‘lsa, `x + n / x` yig‘indisini `long long` da bajarish toshib ketishni oldini oladi.

### Juda katta sonlar

`BigInteger` bilan ishlaganda boshlang‘ich yaqinlashuv tezlikka katta ta’sir qiladi. $n$ ning bitlar soni `bits` bo‘lsa, $2^{\lfloor bits/2\rfloor}$ ildiz tartibiga yaqin qiymat beradi.

```java
public static BigInteger isqrtNewton(BigInteger n) {
    if (n.signum() == 0)
        return BigInteger.ZERO;

    BigInteger a = BigInteger.ONE.shiftLeft((n.bitLength() + 1) / 2);
    boolean decreased = false;

    for (;;) {
        BigInteger b = n.divide(a).add(a).shiftRight(1);
        if (a.compareTo(b) == 0 || (a.compareTo(b) < 0 && decreased))
            break;
        decreased = a.compareTo(b) > 0;
        a = b;
    }

    return a;
}
```

Pinlangan upstream maqoladagi o‘lchovda $n=10^{1000}$ uchun bit uzunligiga asoslangan boshlang‘ich qiymat taxminan $60$ millisekund, `1` dan boshlash esa taxminan $120$ millisekund olgan. Aniq vaqt qurilma va kutubxona versiyasiga bog‘liq, ammo yaxshi boshlang‘ich yaqinlashuvning foydasi saqlanadi.

## Murakkablik

Umumiy Newton usulida vaqt iteratsiyalar soni va bitta $f(x),f'(x)$ hisoblash narxiga bog‘liq. Oddiy ildiz yaqinida kvadratik yaqinlashish sabab $p$ bit aniqlikka yetish uchun iteratsiyalar soni odatda $O(\log p)$. Katta butun sonlarda esa har iteratsiyaning narxi katta sonlarni bo‘lish va qo‘shish murakkabligi bilan belgilanadi.

## Mashq masalalari

- [UVA 10428 — The Roots](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=16&page=show_problem&problem=1369)
