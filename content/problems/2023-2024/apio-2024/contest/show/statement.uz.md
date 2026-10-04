> Ushbu shart APIO 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Alisa va Bob juda mashhur sehrgarlar hisoblanishadi. Ularning sehrlariga qiziqib qolgan badavlat ayol Katerina esa Alisa va Bobga ajoyib tomosha ko'rsatishlari evaziga ko'pgina pul va'da qildi. Tomosha detallari quyidagicha:

- 1-qadam: Bob xonaga kiradi va Katerinadan boshqa hech kim bilan gaplasha olmaydi. So'ngra, Alisa Katerinaga $n$ sonini aytadi, bunda son 2 va 5 000 oralig'ida.

- 2-qadam: Katerina Alisaga $X$ sonini aytadi, bunda son 1 va $10^{18}$ oralig'ida.

- 3-qadam: Alisa aynan $n$ ta tugunlik daraxt yasaydi va uni Katerinaga beradi.

- 4-qadam: Katerina daraxtdan ko'pi bilan $\left\lfloor(n-2)/2\right\rfloor$ ta qirrani o'chirib yuboradi, qolgan qirralarni esa Bobga beradi.

- 5-qadam: Bob grafni yaxshilab o'rganib chiqadi va Katerina Alisaga qaysi sonni aytganini topadi.

Biroq, Alisa va Bob bu tomoshani bajarish uchun o'zlarini bilimi yetmaydi deb hisoblashadi, shuning uchun ular sizdan yordam so'rashdi. Iltimos, Alisaning strategiyasini va Bobning strategiyasini tuzuvchi dastur yozing va Katerinaning chellenjini yutib chiqing.

## Amalga oshirish tafsilotlari

Siz **ikkita fayl** jo'natishingiz kerak:

Birinchi fayl nomi Alice.cpp , bunda Alisaning strategiyasi ifodalanishi kerak. Fayl #include direktivi orqali Alice.h kutubxonasini o'z ichiga olishi kerak. Fayl quyidagi funksiyani ishlab chiqishi kerak:

```cpp
std::vector<std::pair<int, int>> Alice();
```

- Barcha testlar uchun, bu funksiya boshlanish qismida aynan bir marta chaqiriladi.

- Funksiya tomoshaning 3-qadamida Alisa Katerinaga beradigan daraxt qirralarini ifodalovchi pair'lar vector'ini qaytarishi kerak.

   - E'tibor bering, daraxt tugunlari 1 dan boshlab raqamlanishi lozim.

   - Qaytarilgan qirralar daraxt hosil qilishi lozim, ya'ni aynan $n - 1$ ta qirra va barcha tugunlar bog'langan.

Alice() funksiyasi quyidagi funksiyani **aynan bir marta** chaqirishi lozim:

```cpp
long long setN(int n);
```

- Bu funksiya yordamida, Alisa tomoshaning 1-qadamidagi $n$ parametrini Katerinaga aytadi. Funksiya sizga $X$ sonini qaytaradi, tomoshaning 2-qadamida Katerina Alisaga aytadigan son.

Ikkinchi faylning nomi  Bob.cpp , bunda Bobning strategiyasini ifodalashingiz kerak. Fayl  #include direktivi orqali  Bob.h kutubxonasini o'z ichiga olishi kerak. Fayl quyidagi funksiyani ishlab chiqishi kerak:

```cpp
long long Bob(std::vector<std::pair<int, int>> V);
```

- Barcha testlar uchun bu funksiya aynan bir marta, Alice() funksiya chaqiruvidan keyin chaqiriladi.

- Bu yerda $V$ parametri tomoshaning 4-qadamida Katerina Bobga beradigan qirralar ro'yxatini ifodalaydi.

- Qirralar **tartiblangan** holatda beriladi, ya'ni:

   - Qirraning ikki chetidagi tugunlar uchun, kichikroq raqamli tugun birinchi keladi;

   - Barcha tugunlar o'sish bo'yicha tartiblanadi. Ya'ni avval birinchi tugun, so'ngra ikkinchi tugun bo'yicha tartiblanadi.

- Funksiya yagona butun son qaytarishi kerak, $X$ ning qiymatini.

## Sample Interaction

|**Chaqiruv**|**Qaytarilgan qiymat**|
|---|---|
|Alice()||
|setN(4)|3|
||{{1,2},{2,3},{2,4}}|
|Bob({{1,2},{2,4}})|3|

Ya'ni quyidagi ssenariy:

- 1-qadam: Alisa Katerinaga 4 sonini aytadi.

- 2-qadam: Katerina Alisaga 3 sonini aytadi.

- 3-qadam: Alisa 4 ta tugunlik va {{1,2},{2,3},{2,4}} qirralik daraxt yasaydi va uni Katerinaga beradi.

- 4-qadam: Katerina 2 va 3 raqamli tugunlarni bog'lovchi qirrani o'chiradi, va qolgan {{1,2},{2,4}} qirralarni Bobga beradi.

- 5-qadam: Bob 3 sonini aytadi. Uning javobi to'g'ri bo'lgani uchun, ular chellenjda yutib chiqishadi.

## Cheklovlar

$1\le X\le10^{18}$.

## Qism masalalar

1. (5 ball): $X \le 5000$.

2. (30 ball): $X \le 25000000$.

3. (65 ball): Qo'shimcha cheklovlarsiz.

## Namuna grader

Namunaviy greyder ma'lumotlarni quyidagi tartibda o'qiydi:

Qator 1: $T $ ( $ T$ ∈{1,2})

agar $T = 1$ bo'lsa, namunaviy greyder quyidagini o'qiydi:

- Qator 2: $X $ ($1 \le X \le 10^{18}$)

Namunaviy greyder  Alice() funksiyasi qaytargan javobni quyidagi tartibda chiqaradi:

   - Qator 1: $n$

   - Qator 2 + $i $ ($0 \le i \le n - 2$): $ u[i]$ $ v[i]$, bu yerda $ u[i]$, $ v[i]$ tugunlar orasida qirra bor.

- agar $T = 2$, namunaviy greyder quyidagilarni o'qiydi:

   - Qator 2: _n m_ ($2 \le n \le 5000$, $ n - 1$ − $\left\lfloor(n-2)/2\right\rfloor$ ≤ $ m \le n - 1$), bu yerda $ n$ tugunlar soni, va $ m$ qolgan qirralar soni. Qator 3 + $ i $ ($0 \le i \le m - 1$): $ u[i]$ $ v[i]$, bu yerda $ u[i]$, $ v[i]$ tugunlar orasida qirra bor.

Namunaviy greyder  Bob() funksiyasi qaytargan javobni quyidagi tartibda chiqaradi:

- Qator 1: $X$

---

Manba: [APIO 2024 rasmiy masalalar arxivi](https://github.com/APIO-2024/apio2024_tasks/tree/01679c43ad7cdd9514bc2e74681b71c63ef90eb1). [Litsenziya: CC0 1.0](https://github.com/APIO-2024/apio2024_tasks/blob/01679c43ad7cdd9514bc2e74681b71c63ef90eb1/LICENSE).
