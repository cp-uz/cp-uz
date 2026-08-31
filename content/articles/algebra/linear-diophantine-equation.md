---
article_id: algebra--linear-diophantine-equation
---
# Chiziqli Diofant tenglamasi

Chiziqli Diofant tenglamasi (ikki o‘zgaruvchili) umumiy holda quyidagi ko‘rinishdagi tenglamadir:

$$ax + by = c$$

bu yerda $a$, $b$, $c$ — berilgan butun sonlar, $x$, $y$ esa noma’lum butun sonlar.

Ushbu maqolada bunday tenglamalarga oid bir nechta klassik masalani ko‘rib chiqamiz:

* bitta yechimni topish;
* barcha yechimlarni topish;
* berilgan oraliqdagi yechimlar sonini va yechimlarning o‘zini topish;
* $x + y$ qiymati minimal bo‘lgan yechimni topish.
## Aynigan holat

Alohida ko‘rib chiqilishi kerak bo‘lgan aynigan holat — $a = b = 0$. $c = 0$ bo‘lish-bo‘lmasligiga qarab, yechimlar umuman bo‘lmasligi yoki cheksiz ko‘p bo‘lishi oson ko‘rinadi. Maqolaning qolgan qismida bu holatni e’tiborga olmaymiz.
## Analitik yechim

$a \neq 0$ va $b \neq 0$ bo‘lganda $ax+by=c$ tenglamasini quyidagi tenglamalardan istalgan biri sifatida ekvivalent ravishda qarash mumkin:

\begin{align}
ax &\equiv c \pmod b \\
by &\equiv c \pmod a
\end{align}

Umumiylikni yo‘qotmasdan, $b \neq 0$ deb faraz qilamiz va birinchi tenglamani ko‘rib chiqamiz. $a$ va $b$ o‘zaro tub bo‘lganda uning yechimi quyidagicha:

$$x \equiv ca^{-1} \pmod b,$$

bu yerda $a^{-1}$ — $a$ ning $b$ modul bo‘yicha [teskari elementi](module-inverse.md).
$a$ va $b$ o‘zaro tub bo‘lmaganda, barcha butun $x$ lar uchun $ax$ ning $b$ modul bo‘yicha qiymatlari $g=\gcd(a, b)$ ga bo‘linadi; demak, yechim faqat $c$ ham $g$ ga bo‘lingandagina mavjud. Bu holatda tenglamani $g$ ga qisqartirish orqali yechimlardan birini topish mumkin:

$$(a/g) x \equiv (c/g) \pmod{b/g}.$$

$g$ ning ta’rifiga ko‘ra $a/g$ va $b/g$ o‘zaro tub, shuning uchun yechim aniq ko‘rinishda quyidagicha beriladi:

$$\begin{cases}
x \equiv (c/g)(a/g)^{-1}\pmod{b/g},\\
y = \frac{c-ax}{b}.
\end{cases}$$
## Algoritmik yechim

**Bézout lemmasi** (Bézout ayniyati deb ham ataladi) quyidagi yechimni tushunishda foydali natijadir.

> $g = \gcd(a,b)$ bo‘lsin. U holda $ax + by = g$ tenglikni qanoatlantiradigan butun $x,y$ sonlar mavjud.
>
> Bundan tashqari, $g$ — $ax + by$ ko‘rinishida yozilishi mumkin bo‘lgan eng kichik musbat butun son; $ax + by$ ko‘rinishidagi barcha butun sonlar $g$ ning karralisidir.
Ikki noma’lumli Diofant tenglamasining bitta yechimini topish uchun [Kengaytirilgan Evklid algoritmidan](extended-euclid-algorithm.md) foydalanish mumkin. Avval $a$ va $b$ ni manfiy bo‘lmagan deb faraz qilamiz. $a$ va $b$ ga kengaytirilgan Evklid algoritmini qo‘llasak, ularning eng katta umumiy bo‘luvchisi $g$ ni hamda quyidagi tenglikni qanoatlantiradigan $x_g$ va $y_g$ sonlarni topamiz:

$$a x_g + b y_g = g$$
Agar $c$ soni $g = \gcd(a, b)$ ga bo‘linsa, berilgan Diofant tenglamasi yechimga ega; aks holda yechim mavjud emas. Isbot bevosita: ikki sonning chiziqli kombinatsiyasi ularning umumiy bo‘luvchisiga bo‘linadi.

Endi $c$ soni $g$ ga bo‘linadi deb faraz qilamiz. U holda:

$$a \cdot x_g \cdot \frac{c}{g} + b \cdot y_g \cdot \frac{c}{g} = c$$

Demak, Diofant tenglamasining yechimlaridan biri:

$$x_0 = x_g \cdot \frac{c}{g},$$

$$y_0 = y_g \cdot \frac{c}{g}.$$
Yuqoridagi g‘oya $a$ yoki $b$, yoxud ikkalasi ham manfiy bo‘lganda ham ishlaydi. Faqat zarur bo‘lganda $x_0$ va $y_0$ ishorasini o‘zgartirish kerak.

Nihoyat, bu g‘oyani quyidagicha implementatsiya qilish mumkin (kod $a = b = 0$ holatini ko‘rib chiqmasligiga e’tibor bering):

```{.cpp file=linear_diophantine_any}
int gcd(int a, int b, int& x, int& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    int x1, y1;
    int d = gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - y1 * (a / b);
    return d;
}
bool find_any_solution(int a, int b, int c, int &x0, int &y0, int &g) {
    g = gcd(abs(a), abs(b), x0, y0);
    if (c % g) {
        return false;
    }

    x0 *= c / g;
    y0 *= c / g;
    if (a < 0) x0 = -x0;
    if (b < 0) y0 = -y0;
    return true;
}
```
## Barcha yechimlarni olish

Bitta $(x_0, y_0)$ yechimdan berilgan tenglamaning barcha yechimlarini olish mumkin.

$g = \gcd(a, b)$ bo‘lsin va $x_0, y_0$ quyidagi tenglikni qanoatlantiradigan butun sonlar bo‘lsin:

$$a \cdot x_0 + b \cdot y_0 = c$$

$x_0$ ga $b / g$ ni qo‘shish va ayni vaqtda $y_0$ dan $a / g$ ni ayirish tenglikni buzmasligini ko‘ramiz:
$$a \cdot \left(x_0 + \frac{b}{g}\right) + b \cdot \left(y_0 - \frac{a}{g}\right) = a \cdot x_0 + b \cdot y_0 + a \cdot \frac{b}{g} - b \cdot \frac{a}{g} = c$$

Bu jarayonni yana takrorlash mumkinligi ayon, demak quyidagi ko‘rinishdagi barcha sonlar:

$$x = x_0 + k \cdot \frac{b}{g}$$

$$y = y_0 - k \cdot \frac{a}{g}$$

berilgan Diofant tenglamasining yechimlaridir.
Tenglama chiziqli bo‘lgani uchun barcha yechimlar bir to‘g‘ri chiziqda yotadi va $g$ ning ta’rifiga ko‘ra bu berilgan Diofant tenglamasining barcha mumkin bo‘lgan yechimlari to‘plamidir.
## Berilgan oraliqdagi yechimlar sonini va yechimlarni topish

Oldingi bo‘limdan yechimlarga hech qanday cheklov qo‘ymasak, ular cheksiz ko‘p bo‘lishi ravshan. Shu sababli ushbu bo‘limda $x$ va $y$ oraliqlariga cheklovlar qo‘shamiz hamda barcha yechimlarni sanash va ro‘yxatlashga harakat qilamiz.

Ikkita oraliq berilgan bo‘lsin: $[min_x; max_x]$ va $[min_y; max_y]$; faqat shu ikki oraliqdagi yechimlarni topmoqchimiz.
Agar $a$ yoki $b$ $0$ bo‘lsa, masala faqat bitta yechimga ega bo‘lishiga e’tibor bering. Bu holatni bu yerda ko‘rib chiqmaymiz.

Avval $x \ge min_x$ shartni qanoatlantiradigan va $x$ qiymati eng kichik bo‘lgan yechimni topishimiz mumkin. Buning uchun dastlab Diofant tenglamasining istalgan yechimini topamiz. So‘ng oldingi bo‘limdagi barcha yechimlar to‘plami haqidagi bilimimizdan foydalanib, yechimni $x \ge min_x$ bo‘ladigan qilib siljitamiz. Buni $O(1)$ vaqtda bajarish mumkin.
$x$ ning bu minimal qiymatini $l_{x1}$ bilan belgilaymiz.
Xuddi shunday, $x \le max_x$ shartni qanoatlantiradigan $x$ ning maksimal qiymatini topamiz. Bu qiymatni $r_{x1}$ bilan belgilaymiz.

Xuddi shu tarzda $y$ ning minimal $(y \ge min_y)$ va maksimal $(y \le max_y)$ qiymatlarini topamiz. Ularga mos $x$ qiymatlarini $l_{x2}$ va $r_{x2}$ bilan belgilaymiz.

Yakuniy javob — $x$ qiymati $[l_{x1}, r_{x1}]$ va $[l_{x2}, r_{x2}]$ oraliqlar kesishmasida bo‘lgan barcha yechimlar. Bu kesishmani $[l_x, r_x]$ bilan belgilaymiz.
Quyidagi kod ushbu g‘oyani implementatsiya qiladi.
Boshida $a$ va $b$ ni $g$ ga bo‘lishimizga e’tibor bering.
$a x + b y = c$ tenglama $\frac{a}{g} x + \frac{b}{g} y = \frac{c}{g}$ tenglamaga ekvivalent bo‘lgani uchun ikkinchisidan foydalanishimiz mumkin; bunda $\gcd(\frac{a}{g}, \frac{b}{g}) = 1$ bo‘ladi va formulalar soddalashadi.

```{.cpp file=linear_diophantine_all}
void shift_solution(int & x, int & y, int a, int b, int cnt) {
    x += cnt * b;
    y -= cnt * a;
}
int find_all_solutions(int a, int b, int c, int minx, int maxx, int miny, int maxy) {
    int x, y, g;
    if (!find_any_solution(a, b, c, x, y, g))
        return 0;
    a /= g;
    b /= g;

    int sign_a = a > 0 ? +1 : -1;
    int sign_b = b > 0 ? +1 : -1;

    shift_solution(x, y, a, b, (minx - x) / b);
    if (x < minx)
        shift_solution(x, y, a, b, sign_b);
    if (x > maxx)
        return 0;
    int lx1 = x;
    shift_solution(x, y, a, b, (maxx - x) / b);
    if (x > maxx)
        shift_solution(x, y, a, b, -sign_b);
    int rx1 = x;

    shift_solution(x, y, a, b, -(miny - y) / a);
    if (y < miny)
        shift_solution(x, y, a, b, -sign_a);
    if (y > maxy)
        return 0;
    int lx2 = x;

    shift_solution(x, y, a, b, -(maxy - y) / a);
    if (y > maxy)
        shift_solution(x, y, a, b, sign_a);
    int rx2 = x;
    if (lx2 > rx2)
        swap(lx2, rx2);
    int lx = max(lx1, lx2);
    int rx = min(rx1, rx2);

    if (lx > rx)
        return 0;
    return (rx - lx) / abs(b) + 1;
}
```

$l_x$ va $r_x$ ni topganimizdan keyin barcha yechimlarni sanab chiqish ham oson. Barcha $k \ge 0$ lar uchun $x = l_x + k \cdot \frac{b}{g}$ qiymatlarini $x = r_x$ bo‘lguncha ko‘rib chiqish va $a x + b y = c$ tenglama yordamida mos $y$ qiymatlarini topish kifoya.
## $x + y$ qiymati minimal bo‘lgan yechimni topish { data-toc-label='<script type="math/tex">x + y</script> qiymati minimal bo‘lgan yechimni topish' }

Bu yerda $x$ va $y$ ga ham qandaydir cheklov berilishi kerak, aks holda javob manfiy cheksizlikka ketishi mumkin.

G‘oya oldingi bo‘limdagiga o‘xshaydi: Diofant tenglamasining istalgan yechimini topamiz, so‘ng ayrim shartlarni qanoatlantirish uchun yechimni siljitamiz.

Nihoyat, minimumni topish uchun barcha yechimlar to‘plami haqidagi bilimdan foydalanamiz:
$$x' = x + k \cdot \frac{b}{g},$$

$$y' = y - k \cdot \frac{a}{g}.$$

$x + y$ quyidagicha o‘zgarishiga e’tibor bering:

$$x' + y' = x + y + k \cdot \left(\frac{b}{g} - \frac{a}{g}\right) = x + y + k \cdot \frac{b-a}{g}$$

Agar $a < b$ bo‘lsa, $k$ ning eng kichik mumkin bo‘lgan qiymatini tanlashimiz kerak. Agar $a > b$ bo‘lsa, $k$ ning eng katta mumkin bo‘lgan qiymatini tanlaymiz. Agar $a = b$ bo‘lsa, barcha yechimlarda $x + y$ yig‘indisi bir xil bo‘ladi.
## Amaliy masalalar

* [Spoj - Crucial Equation](http://www.spoj.com/problems/CEQU/)
* [SGU 106](http://codeforces.com/problemsets/acmsguru/problem/99999/106)
* [Codeforces - Ebony and Ivory](http://codeforces.com/contest/633/problem/A)
* [Codechef - Get AC in one go](https://www.codechef.com/problems/COPR16G)
* [LightOj - Solutions to an equation](http://www.lightoj.com/volume_showproblem.php?problem=1306)
* [Atcoder - F - S = 1](https://atcoder.jp/contests/abc340/tasks/abc340_f)
