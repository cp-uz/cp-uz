---
article_id: algebra--gray-code
---
# Gray kodi

Gray kodi — ketma-ket ikkita qiymat faqat bitta bitda farq qiladigan ikkilik sanoq tizimi.
$n$ sonining Gray kodidagi ifodasini $G(n)$ bilan belgilaymiz. 3 bitli sonlar uchun Gray kodlari ketma-ketligi quyidagicha: 000, 001, 011, 010, 110, 111, 101, 100; demak, $G(4) = (110)_2 = 6$.
Masalan, $G(3) = (010)_2$ va $G(4) = (110)_2$ aynan bitta — eng chapdagi bitda farq qiladi. Xuddi shuningdek, $G(4) = 110$ va $G(5) = (111)_2$ aynan bitta — eng o‘ngdagi bitda farq qiladi. Bu xossa barcha ketma-ket sonlar uchun o‘rinli.

Bu kodni Frank Gray 1953-yilda ixtiro qilgan.
## Gray kodini topish

$n$ sonining bitlari va $G(n)$ sonining bitlarini ko‘rib chiqamiz. $G(n)$ ning $i$-biti faqat $n$ ning $i$-biti 1 va $(i + 1)$-biti 0 bo‘lganda yoki aksincha ($i$-biti 0 va $(i + 1)$-biti 1 bo‘lganda) 1 ga teng bo‘lishiga e’tibor bering. Shunday qilib, $G(n) = n \oplus (n >> 1)$:

```cpp
int g (int n) {
    return n ^ (n >> 1);
}
```
## Gray kodining teskarisini topish

Gray kodi $g$ berilgan bo‘lsa, dastlabki $n$ sonini tiklash kerak.

Eng katta razryadli bitlardan eng kichik razryadli bitlarga qarab yuramiz (eng kichik razryadli bitning indeksi 1, eng katta razryadli bitniki esa $k$ bo‘lsin). $n$ sonining $n_i$ bitlari bilan $g$ sonining $g_i$ bitlari orasidagi bog‘lanish:
$$\begin{align}
  n_k &= g_k, \\
  n_{k-1} &= g_{k-1} \oplus n_k = g_k \oplus g_{k-1}, \\
  n_{k-2} &= g_{k-2} \oplus n_{k-1} = g_k \oplus g_{k-1} \oplus g_{k-2}, \\
  n_{k-3} &= g_{k-3} \oplus n_{k-2} = g_k \oplus g_{k-1} \oplus g_{k-2} \oplus g_{k-3},
  \vdots
\end{align}$$

Buni kodda yozishning eng sodda usuli:

```cpp
int rev_g (int g) {
  int n = 0;
  for (; g; g >>= 1)
    n ^= g;
  return n;
}
```
## Amaliy qo‘llanishlar
Gray kodlarining ba’zan ancha kutilmagan foydali qo‘llanishlari bor:

*   $n$ bitli Gray kodi giperkubda Hamilton siklini hosil qiladi; bunda har bir bit bitta o‘lchamga mos keladi.

*   Gray kodlari raqamli signallarni analog signallarga o‘girishdagi xatolarni kamaytirish uchun (masalan, sensorlarda) ishlatiladi.
*   Gray kodidan Hanoi minoralari masalasini yechishda foydalanish mumkin.
    Disklar sonini $n$ bilan belgilaymiz. Barcha bitlari noldan iborat uzunligi $n$ bo‘lgan Gray kodidan ($G(0)$) boshlaymiz va ketma-ket Gray kodlari orasida ($G(i)$ dan $G(i+1)$ ga) o‘tamiz.
    Joriy Gray kodining $i$-biti $i$-diskni ifodalasin
    (eng kichik razryadli bit eng kichik diskka, eng katta razryadli bit esa eng katta diskka mos keladi).
    Har bir qadamda aynan bitta bit o‘zgargani uchun, $i$-bitning o‘zgarishini $i$-diskni ko‘chirish deb qarashimiz mumkin.
    Har bir qadamda (boshlang‘ich va oxirgi holatlardan tashqari) har bir disk uchun (eng kichik diskdan tashqari) aynan bitta mumkin bo‘lgan yurish borligiga e’tibor bering.
    Eng kichik disk uchun doimo ikkita yurish imkoniyati bo‘ladi, ammo doimo javobga olib boradigan strategiya mavjud:
    agar $n$ toq bo‘lsa, eng kichik diskning yurishlari ketma-ketligi $f \to t \to r \to f \to t \to r \to ...$
    ko‘rinishida bo‘ladi, bu yerda $f$ — boshlang‘ich tayoqcha, $t$ — yakuniy tayoqcha, $r$ esa qolgan tayoqcha),
    agar $n$ juft bo‘lsa esa: $f \to r \to t \to f \to r \to t \to ...$.
*   Gray kodlari genetik algoritmlar nazariyasida ham ishlatiladi.
## Mashq masalalari
*   <a href="https://cses.fi/problemset/task/2205">Gray Code &nbsp;&nbsp;&nbsp;&nbsp; [Qiyinlik: oson]</a>
*   <a href="http://codeforces.com/problemsets/acmsguru/problem/99999/249">SGU #249 <b>"Matrix"</b> &nbsp;&nbsp;&nbsp;&nbsp; [Qiyinlik: o‘rta]</a>
