---
article_id: algebra--linear_congruence_equation
---
# Chiziqli taqqoslama

Bu tenglama quyidagi ko‘rinishga ega:

$$a \cdot x \equiv b \pmod n,$$

bunda $a$, $b$ va $n$ berilgan butun sonlar, $x$ esa noma’lum butun son.

$[0,n-1]$ oraliqdagi $x$ qiymatini topish talab qilinadi (ravshanki, butun sonlar o‘qida bir-biridan $n \cdot k$ ga farq qiladigan cheksiz ko‘p yechim bo‘lishi mumkin; bunda $k$ ixtiyoriy butun son). Agar yechim yagona bo‘lmasa, barcha yechimlarni qanday olishni ham ko‘rib chiqamiz.

## Teskari elementni topish orqali yechish

Avval $a$ va $n$ **o‘zaro tub** bo‘lgan ($\gcd(a,n)=1$) soddaroq holatni ko‘rib chiqamiz.
Bu holda $a$ ning [teskari elementini](module-inverse.md) topib, tenglamaning ikkala tomonini unga ko‘paytirish orqali **yagona** yechimni olamiz:

$$x \equiv b \cdot a ^ {- 1} \pmod n$$

Endi $a$ va $n$ **o‘zaro tub bo‘lmagan** ($\gcd(a,n) \ne 1$) holatni qaraylik.
Bu holda yechim har doim ham mavjud emas (masalan, $2 \cdot x \equiv 1 \pmod 4$ taqqoslamaning yechimi yo‘q).

$g = \gcd(a,n)$, ya’ni $a$ va $n$ ning [eng katta umumiy bo‘luvchisi](euclid-algorithm.md) bo‘lsin (bu holatda u birdan katta).
Agar $b$ soni $g$ ga bo‘linmasa, yechim mavjud emas. Haqiqatan, istalgan $x$ uchun tenglamaning chap tomoni $a \cdot x \pmod n$ doimo $g$ ga bo‘linadi, o‘ng tomoni esa bo‘linmaydi; bundan yechim yo‘qligi kelib chiqadi.

Agar $g$ soni $b$ ni bo‘lsa, tenglamaning ikkala tomonini $g$ ga bo‘lib (ya’ni $a$, $b$ va $n$ ni $g$ ga bo‘lib), yangi tenglamani olamiz:

$$a^\prime \cdot x \equiv b^\prime \pmod{n^\prime}$$

Bu tenglamada $a^\prime$ va $n^\prime$ allaqachon o‘zaro tub, bunday tenglama bilan qanday ishlashni esa bilamiz.
$x$ uchun yechim sifatida $x^\prime$ ni olamiz.

$x^\prime$ dastlabki tenglamaning ham yechimi bo‘lishi ravshan.
Biroq u **yagona yechim bo‘lmaydi**.
Dastlabki tenglamaning aynan $g$ ta yechimi mavjudligini ko‘rsatish mumkin va ular quyidagi ko‘rinishda bo‘ladi:

$$x_i \equiv (x^\prime + i\cdot n^\prime) \pmod n \quad \text{for } i = 0 \ldots g-1$$

Xulosa qilib, chiziqli taqqoslamaning **yechimlari soni** yoki $g = \gcd(a,n)$ ga, yoki nolga teng.

## Kengaytirilgan Evklid algoritmi yordamida yechish

Chiziqli taqqoslamani quyidagi Diofant tenglamasiga aylantirib yozish mumkin:

$$a \cdot x + n \cdot k = b,$$

bunda $x$ va $k$ noma’lum butun sonlar.

Bu tenglamani yechish usuli [Chiziqli Diofant tenglamalari](linear-diophantine-equation.md) maqolasida tasvirlangan va [kengaytirilgan Evklid algoritmi](extended-euclid-algorithm.md) ni qo‘llashdan iborat.
O‘sha maqolada topilgan bitta yechimdan barcha yechimlarni olish usuli ham keltirilgan; diqqat bilan qaralganda, bu usul avvalgi bo‘limda tasvirlangan usulga mutlaqo ekvivalent.
