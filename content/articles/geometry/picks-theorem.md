---
article_id: geometry--picks-theorem
---
# Pick teoremasi — panjaraviy ko‘pburchak yuzi

Barcha uchlari butun koordinatali nuqtalarda yotadigan sodda ko‘pburchak **panjaraviy ko‘pburchak** deyiladi. Uning ichidagi panjara nuqtalari sonini $I$, chegarasidagi panjara nuqtalari sonini $B$ bilan belgilaymiz. Pick teoremasi ko‘pburchak yuzini juda sodda formula bilan beradi:

$$
\boxed{S=I+\frac{B}{2}-1}.
$$

Ekvivalent ravishda,

$$
2S=2I+B-2.
$$

Formula ko‘pburchakning shakli, qavariqligi yoki qirralar qiyaligiga bog‘liq emas; faqat ko‘pburchak sodda va barcha uchlar panjara nuqtalari bo‘lishi kerak.

## Misollar

Birlik kvadrat uchun $I=0$, $B=4$:

$$
S=0+\frac42-1=1.
$$

Tomonlari $a$ va $b$ bo‘lgan o‘qlarga parallel to‘g‘ri to‘rtburchakda

$$
I=(a-1)(b-1),
\qquad
B=2a+2b.
$$

Pick formulasi

$$
(a-1)(b-1)+a+b-1=ab
$$

natijani beradi.

## Chegaradagi panjara nuqtalarini hisoblash

Butun nuqtalar $A=(x_1,y_1)$ va $B=(x_2,y_2)$ orasidagi kesmada, ikkala uchni ham hisoblaganda,

$$
\gcd(|x_2-x_1|,|y_2-y_1|)+1
$$

ta panjara nuqta yotadi. Ko‘pburchak qirralari bo‘yicha uchlar ikki marta sanalmasligi uchun chegaradagi umumiy nuqtalar soni

$$
B=\sum_{i=0}^{n-1}
\gcd(|x_{i+1}-x_i|,|y_{i+1}-y_i|)
$$

bo‘ladi.

Yuzaning ikki baravari shoelace formulasi bilan aniq butun son sifatida topiladi:

$$
2S=\left|\sum_i x_i y_{i+1}-y_i x_{i+1}\right|.
$$

Shundan ichki nuqtalar soni

$$
I=\frac{2S-B+2}{2}
$$

kelib chiqadi.

## Implementatsiya

```cpp
struct point {
    long long x, y;
};

long long boundary_lattice_points(const vector<point>& p) {
    long long B = 0;
    int n = p.size();
    for (int i = 0; i < n; ++i) {
        int j = (i + 1) % n;
        B += std::gcd(llabs(p[j].x - p[i].x),
                      llabs(p[j].y - p[i].y));
    }
    return B;
}

long long doubled_area(const vector<point>& p) {
    long long a = 0;
    int n = p.size();
    for (int i = 0; i < n; ++i) {
        int j = (i + 1) % n;
        a += p[i].x * p[j].y - p[i].y * p[j].x;
    }
    return llabs(a);
}

long long interior_lattice_points(const vector<point>& p) {
    long long A2 = doubled_area(p);
    long long B = boundary_lattice_points(p);
    return (A2 - B + 2) / 2;
}
```

## Isbot g‘oyasi

Pick formulasini panjaraviy uchburchaklardan boshlab, ko‘pburchakni qirra bilan ikkiga bo‘lishda invariant saqlanishini ko‘rsatish orqali isbotlash mumkin.

Agar ikkita panjaraviy ko‘pburchak umumiy qirra bo‘ylab birlashtirilsa, yuzalar qo‘shiladi. Ichki va chegaradagi nuqtalar sonlari ham shunday o‘zgaradiki,

$$
I+\frac B2-1
$$

ifoda additiv bo‘lib qoladi: umumiy qirraning ichki panjara nuqtalari yangi birlashgan ko‘pburchakda ichki nuqtalarga aylanadi, qirra uchlari esa chegarada qoladi. Shuning uchun formula triangulyatsiya orqali butun ko‘pburchakka yoyiladi.

Eng sodda panjaraviy uchburchak — ichida ham, qirralarining uchlaridan boshqa panjara nuqtalari ham bo‘lmagan primitive uchburchak — yuzi $1/2$ ga teng. Unda $I=0$, $B=3$ va formula bajariladi. Panjaraviy uchburchakni primitive uchburchaklarga ajratish orqali asosiy holat olinadi.

## Cheklovlar

Teorema o‘zini kesuvchi ko‘pburchaklarga bevosita qo‘llanmaydi. Uchlari butun bo‘lmagan ko‘pburchak uchun ham oddiy $I,B$ formulasi yetarli emas; bunday holat [panjaraviy bo‘lmagan ko‘pburchakdagi panjara nuqtalari](lattice-points.md) masalasiga olib keladi.

Hisoblash murakkabligi $O(n\log C)$, bu yerda $C$ koordinatalar farqining maksimal moduli; logarifm qirralardagi `gcd` hisoblaridan keladi.

