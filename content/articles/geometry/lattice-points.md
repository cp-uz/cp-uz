---
article_id: geometry--lattice-points
---
# Panjaraviy bo‘lmagan ko‘pburchakdagi panjara nuqtalari

Uchlari ixtiyoriy ratsional yoki haqiqiy koordinatalarda yotadigan ko‘pburchak ichidagi butun koordinatali nuqtalar sonini sanash kerak. Barcha uchlari panjara nuqtalari bo‘lganda [Pick teoremasi](picks-theorem.md) mavjud, ammo ixtiyoriy uchlar uchun boshqa yondashuv zarur.

Asosiy g‘oya ko‘pburchakning har bir qirrasini alohida ko‘rib, uning ostidagi panjara nuqtalar sonini orientatsiyaga qarab musbat yoki manfiy ishora bilan qo‘shishdir. Bu ko‘pburchak yuzini trapesiyalar orqali hisoblashga o‘xshaydi.

## Bitta qirra ostidagi nuqtalar

$A=(x_1,y_1)$ va $B=(x_2,y_2)$ qirra vertikal bo‘lmasin. Uni chiziqli funksiya sifatida yozamiz:

$$
y=y_1+(y_2-y_1)\frac{x-x_1}{x_2-x_1}
 =kx+b,
$$

bu yerda

$$
k=\frac{y_2-y_1}{x_2-x_1},
\qquad
b=\frac{y_1x_2-x_1y_2}{x_2-x_1}.
$$

$x=x'+\lceil x_1\rceil$ almashtirish orqali chap chegarani $x'=0$ ga ko‘chiramiz. Yangi ozod had

$$
b'=b+k\lceil x_1\rceil
$$

bo‘ladi. $n=\lfloor x_2-\lceil x_1\rceil\rfloor$ deb olamiz. Chegaralarda ikki marta sanashdan qochish uchun masala odatda

$$
\sum_{x=0}^{n-1}\lfloor kx+b\rfloor
$$

ko‘rinishdagi floor-sum ni hisoblashga keltiriladi. Qaysi chegara ochiq yoki yopiq ekanini barcha qirralar uchun bir xil qoidada tanlash, vertikal qirralar va chegaradagi nuqtalarni alohida qo‘shish kerak.

Quyida $k\ge0$ va $b\ge0$ deb faraz qilinadi. Manfiy qiyalikda qirra yo‘nalishini almashtirish yoki $x=-t$ almashtirishdan foydalanish mumkin. Manfiy $b$ esa butun siljish bilan musbat diapazonga keltiriladi.

## Floor-sum ni rekursiv hisoblash

Hisoblash kerak bo‘lgan funksiya:

$$
F(k,b,n)=\sum_{x=0}^{n-1}\lfloor kx+b\rfloor.
$$

Ikki asosiy holat mavjud.

### $k\ge1$ yoki $b\ge1$

Butun qismlarni ajratamiz:

$$
k=\lfloor k\rfloor+\{k\},
\qquad
b=\lfloor b\rfloor+\{b\}.
$$

Shunda

$$
F(k,b,n)=
\lfloor k\rfloor\frac{n(n-1)}2+
\lfloor b\rfloor n+
F(\{k\},\{b\},n).
$$

Birinchi ikki had chiziq ostidagi butun “qatlamlar” sonini beradi, qolgan masalada esa $0\le k,b<1$.

### $0\le k<1$ va $0\le b<1$

$m=\lfloor kn+b\rfloor$ deb olamiz. Agar $m=0$ bo‘lsa, barcha hadlar nol va javob nol.

$m>0$ bo‘lsa, panjara nuqtalar to‘plamini koordinatalar sistemasini almashtirib sanaymiz: yangi boshlang‘ich nuqta $(n,m)$, yangi o‘qlar esa eski sistemada pastga va chapga yo‘naladi. Natijada qiyalik $1/k$ bo‘lgan kichikroq masala hosil bo‘ladi:

$$
F(k,b,n)=F\left(\frac1k,\frac{kn+b-\lfloor kn+b\rfloor}{k},\lfloor kn+b\rfloor\right)
$$

va oldingi bosqichda ajratilgan butun qatlamlar bilan qo‘shiladi.

Bu transformatsiya Evklid algoritmiga o‘xshaydi: katta qiyalikning butun qismi olib tashlanadi, keyin qiyalik teskarilanadi. Shu sababli rekursiya chuqurligi logarifmik.

## Implementatsiya

`Fraction` aniq ratsional sonlar sinfi bo‘lib, qo‘shish, ayirish, ko‘paytirish, bo‘lish, taqqoslash va `floor()` ni qo‘llab-quvvatlaydi deb hisoblaymiz.

```cpp
long long count_lattices(Fraction k, Fraction b, long long n) {
    auto fk = k.floor();
    auto fb = b.floor();
    long long cnt = 0;

    if (k >= 1 || b >= 1) {
        cnt += (fk * (n - 1) + 2 * fb) * n / 2;
        k -= fk;
        b -= fb;
    }

    auto t = k * n + b;
    auto ft = t.floor();
    if (ft >= 1) {
        cnt += count_lattices(1 / k,
                              (t - t.floor()) / k,
                              t.floor());
    }
    return cnt;
}
```

Funksiya $0\le x<n$ va $0<y\le\lfloor kx+b\rfloor$ shartlarni qanoatlantiradigan butun $(x,y)$ nuqtalarni sanaydi. Chegaradagi $y=0$, oxirgi $x=n$ va qirraning o‘zidagi nuqtalar umumiy polygon algoritmida tanlangan yarim ochiq konvensiyaga muvofiq qo‘shiladi yoki chiqariladi.

## Ko‘pburchak bo‘yicha yig‘ish

Ko‘pburchak qirralari orientatsiyalangan bo‘lsin. Har bir vertikal bo‘lmagan qirra uchun chapdan o‘ngga yo‘nalishda qirra ostidagi panjara nuqtalar sonini topamiz. Qirra asl chegara bo‘ylab chapdan o‘ngga ketsa hissani qo‘shamiz, o‘ngdan chapga ketsa ayiramiz. Ichki bo‘lmagan ustunlar va tashqi hududlar qarama-qarshi qirralar hissasi bilan bekor bo‘ladi, ko‘pburchak ichidagi har bir panjara nuqta bir marta qoladi.

Chegaradagi nuqtalar masala ta’rifiga qarab kiritilishi yoki chiqarilishi mumkin. Eng ishonchli usul barcha qirralarni yarim ochiq oraliq sifatida, masalan chap uchni kiritib o‘ng uchni chiqargan holda qayta ishlashdir. Vertikal qirralar floor-sum ga hissa bermaydi, lekin chegarani hisoblashda alohida ko‘riladi.

## Murakkablik va aniqlik

Har bir rekursiv qadamda sanalayotgan nuqtalarning sezilarli qismi ajratiladi yoki Evklid algoritmidagi kabi parametrlar kamayadi. Rekursiya $O(\log C)$ qadamda tugaydi, bu yerda $C$ ratsional koeffitsiyentlarning son va maxraj o‘lchamiga bog‘liq. $n$ qirrali ko‘pburchak uchun umumiy murakkablik $O(n\log C)$.

Aniq natija kerak bo‘lsa `Fraction` son va maxrajni `gcd` ga qisqartirib saqlashi kerak. Agar boshlang‘ich son va maxrajlar moduli $C$ dan oshmasa, rekursiyadagi qiymatlar taxminan $C^2$ gacha o‘sishi mumkin. `double` ishlatilsa, butun songa juda yaqin qiymatlarni `floor` qilishda alohida `EPS` qoidasi zarur; noto‘g‘ri yumaloqlash butun bir panjara qatorini xato sanashi mumkin.

