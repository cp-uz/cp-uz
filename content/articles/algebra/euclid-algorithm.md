---
article_id: algebra--euclid-algorithm
---
# Eng katta umumiy bo‘luvchini hisoblash uchun Evklid algoritmi

Ikkita manfiy bo‘lmagan $a$ va $b$ butun son berilgan. Ularning **EKUB**ini (eng katta umumiy bo‘luvchisini), ya’ni $a$ va $b$ ning ikkalasiga ham bo‘linadigan eng katta sonni topishimiz kerak.
U odatda $\gcd(a, b)$ bilan belgilanadi. Matematik jihatdan quyidagicha ta’riflanadi:

$$\gcd(a, b) = \max \{k > 0 : (k \mid a) \text{ va } (k \mid b) \}$$

(bu yerda "$\mid$" belgisi bo‘linuvchanlikni bildiradi, ya’ni "$k \mid a$" — "$k$ soni $a$ ni bo‘ladi" degani)
Sonlardan biri nol, ikkinchisi esa noldan farqli bo‘lsa, ta’rifga ko‘ra ularning eng katta umumiy bo‘luvchisi ikkinchi sondir. Ikkala son ham nol bo‘lganda eng katta umumiy bo‘luvchi aniqlanmagan (u istalgancha katta son bo‘lishi mumkin), ammo $\gcd$ ning assotsiativligini saqlash uchun uni ham nol deb belgilash qulay. Bundan sodda qoida kelib chiqadi: sonlardan biri nol bo‘lsa, eng katta umumiy bo‘luvchi ikkinchi songa teng.
Quyida ko‘rib chiqiladigan Evklid algoritmi ikkita $a$ va $b$ sonning eng katta umumiy bo‘luvchisini $O(\log \min(a, b))$ vaqtda topish imkonini beradi. Funksiya **assotsiativ** bo‘lgani sababli, **ikkitadan ko‘p sonning** EKUBini topish uchun $\gcd(a, b, c) = \gcd(a, \gcd(b, c))$ va shu kabi hisoblash mumkin.

Algoritm birinchi marta Evklidning “Negizlar” asarida (taxminan miloddan avvalgi 300-yilda) bayon qilingan, ammo uning kelib chiqishi bundan ham qadimgi bo‘lishi mumkin.
## Algoritm

Dastlab Evklid algoritmi quyidagicha ifodalangan: sonlardan biri nol bo‘lguncha kattasidan kichigini ayirish. Haqiqatan ham, agar $g$ soni $a$ va $b$ ni bo‘lsa, u $a-b$ ni ham bo‘ladi. Aksincha, agar $g$ soni $a-b$ va $b$ ni bo‘lsa, u $a = b + (a-b)$ ni ham bo‘ladi; demak, $\{a, b\}$ va $\{b,a-b\}$ to‘plamlarining umumiy bo‘luvchilari to‘plami bir xil.
$a$ dan $b$ kamida $\left\lfloor\frac{a}{b}\right\rfloor$ marta ayrilmaguncha $a$ kattaroq son bo‘lib qolishiga e’tibor bering. Shu sababli algoritmni tezlashtirish uchun $a-b$ o‘rniga $a-\left\lfloor\frac{a}{b}\right\rfloor b = a \bmod b$ ishlatiladi. Shunda algoritm nihoyatda sodda ko‘rinishga keladi:

$$\gcd(a, b) = \begin{cases}a,&\text{agar }b = 0 \\ \gcd(b, a \bmod b),&\text{aks holda.}\end{cases}$$
## Implementatsiya { #implementation }

```cpp
int gcd (int a, int b) {
    if (b == 0)
        return a;
    else
        return gcd (b, a % b);
}
```

C++ dagi ternar operatordan foydalanib, uni bir qatorga yozishimiz mumkin.

```cpp
int gcd (int a, int b) {
    return b ? gcd (b, a % b) : a;
}
```

Va nihoyat, rekursiyasiz implementatsiya:

```cpp
int gcd (int a, int b) {
    while (b) {
        a %= b;
        swap(a, b);
    }
    return a;
}
```
C++17 dan boshlab `gcd` C++ da [standart funksiya](https://en.cppreference.com/w/cpp/numeric/gcd) sifatida implementatsiya qilinganiga e’tibor bering.
## Vaqt murakkabligi

Algoritmning ishlash vaqti Evklid algoritmi bilan Fibonacci ketma-ketligi orasidagi hayratlanarli bog‘lanishni o‘rnatuvchi Lamé teoremasi yordamida baholanadi:

Agar $a > b \geq 1$ va biror $n$ uchun $b < F_n$ bo‘lsa, Evklid algoritmi ko‘pi bilan $n-2$ ta rekursiv chaqiruv bajaradi.
Bundan tashqari, bu teoremaning yuqori chegarasi optimal ekanini ko‘rsatish mumkin. $a = F_n$ va $b = F_{n-1}$ bo‘lganda `gcd(a, b)` aynan $n-2$ ta rekursiv chaqiruv bajaradi. Boshqacha aytganda, ketma-ket Fibonacci sonlari Evklid algoritmi uchun eng yomon kirish ma’lumotlaridir.

Fibonacci sonlari eksponensial o‘sgani sababli, Evklid algoritmi $O(\log \min(a, b))$ vaqtda ishlaydi.
Murakkablikni boshqacha baholash uchun $a \geq b$ bo‘lganda $a \bmod b$ qiymati $a$ dan kamida $2$ marta kichik ekanini payqash mumkin; demak, algoritmning har bir iteratsiyasida kattaroq son kamida ikki baravar kamayadi.
Bu mulohazani $a_1,\dots,a_n \leq C$ sonlar to‘plamining EKUBini hisoblash holatiga qo‘llasak, umumiy ishlash vaqtini $O(n \log C)$ emas, $O(n + \log C)$ deb baholash mumkin, chunki algoritmning har bir trivial bo‘lmagan iteratsiyasi joriy EKUB nomzodini kamida $2$ baravar kamaytiradi.
## Eng kichik umumiy karrali

Odatda **EKUK** deb belgilanadigan eng kichik umumiy karralini hisoblash quyidagi sodda formula yordamida EKUBni hisoblashga keltiriladi:

$$\text{lcm}(a, b) = \frac{a \cdot b}{\gcd(a, b)}$$

Demak, EKUKni Evklid algoritmi yordamida ayni vaqt murakkabligida hisoblash mumkin:

Avval $a$ ni EKUBga bo‘lib, butun son toshib ketishining oldini oladigan mumkin bo‘lgan implementatsiya quyidagicha:

```cpp
int lcm (int a, int b) {
    return a / gcd(a, b) * b;
}
```
## Ikkilik EKUB

Ikkilik EKUB algoritmi odatiy Evklid algoritmining optimallashtirilgan variantidir.

Odatiy algoritmning sekin qismi modul amallaridir. Modul amallarini $O(1)$ deb hisoblasak-da, ular qo‘shish, ayirish yoki bitli amallar kabi sodda amallardan ancha sekin.
Shu sababli ulardan qochish ma’qul.

Ma’lum bo‘lishicha, modul amallarini ishlatmaydigan tez EKUB algoritmini tuzish mumkin.
U bir nechta xossalarga asoslanadi:
  - Ikkala son ham juft bo‘lsa, ikkalasidan ham ikkini ajratib, qolgan sonlarning EKUBini hisoblaymiz: $\gcd(2a, 2b) = 2 \gcd(a, b)$.
  - Sonlardan biri juft, ikkinchisi toq bo‘lsa, juft sondagi $2$ ko‘paytuvchini olib tashlashimiz mumkin: agar $b$ toq bo‘lsa, $\gcd(2a, b) = \gcd(a, b)$.
  - Ikkala son ham toq bo‘lsa, sonlardan birini ikkinchisidan ayirish EKUBni o‘zgartirmaydi: $\gcd(a, b) = \gcd(b, a-b)$
Faqat shu xossalar va GCC dagi ayrim tez bitli funksiyalardan foydalanib, tez variantni implementatsiya qilishimiz mumkin:

```cpp
int gcd(int a, int b) {
    if (!a || !b)
        return a | b;
    unsigned shift = __builtin_ctz(a | b);
    a >>= __builtin_ctz(a);
    do {
        b >>= __builtin_ctz(b);
        if (a > b)
            swap(a, b);
        b -= a;
    } while (b);
    return a << shift;
}
```
Bunday optimallashtirish odatda zarur emasligiga va ko‘pchilik dasturlash tillarining standart kutubxonalarida EKUB funksiyasi allaqachon mavjudligiga e’tibor bering.
Masalan, C++17 da `numeric` sarlavha faylida `std::gcd` funksiyasi mavjud.
## Amaliy masalalar

- [CSAcademy - Greatest Common Divisor](https://csacademy.com/contest/archive/task/gcd/)
- [Codeforces 1916B - Two Divisors](https://codeforces.com/contest/1916/problem/B)
