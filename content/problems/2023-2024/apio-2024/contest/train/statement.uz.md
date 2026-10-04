> Ushbu shart APIO 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

2992-yili, ko'p ishlar robotlar tomonidan bajariladi. Buning natijasida, ko'p odamlar bo'sh vaqtga ega. Shu sababli sizning oilangiz sayyoralararo sayohatga chiqishga qaror qildi!

Bog'langan va 0 dan $N - 1$ gacha raqamlangan $N$ ta sayyoralar va $M$ ta sayyoralararo poezdlar qatnovlari bor. Har bir poyezd qatnovi $i$ ($0 \le i < M $ ) $ A[i]$ vaqtda, $ X[i]$-sayyoradan harakatini boshlaydi va $ B[i]$ vaqtda $ Y[i]$-sayyoraga yetadi, hamda bu poyezd qatnovi uchun $ C[i]$ miqdorda pul to'lash lozim. Poyezdlar qatnovi sayyoralararo sayohatning yagoni usulidir. Biror qatnovning yakunida qolib, xuddi shu sayyoradan boshqa poyezd qatnoviga chiqishingiz mumkin (va bu vaqt talab etmaydi). Ya'ni, $ q[0]$, $ q[1]$,..., $ q[P]$ poyezd qatnovlari ketma-ketligi to'g'ri hisoblanishi uchun, istalgan $1 \le k \le P$ uchun, $Y $ [ $ q $ [ $ k - 1$]] = $ X[q[k]]$ va $ B$ [ $ q $ [ $ k - 1$]] ≤ $ A[q[k]]$ shartlari bajarilishi lozim.

Sayyoralararo sayohat vaqt talab etadi, shuning uchun, poyezd qatnovlari to'lovidan tashqari, oziqovqat xarajatlari ham muhimligini tushunib yetdingiz. Baxtingizga **sayyoralararo poezdlarda cheksiz miqdorda bepul ovqat beriladi** . Bu degani, agar sizning oilangiz $i$ -poyezd qatnoviga chiqsa, ular $ A[i]$ va $ B[i]$ **(ikki chegara ham kiradi)** vaqt oralig'ida bepul ovqat olishlari mumkin. Ammo sizning oilangiz $ i$ -sayyorada o'zlarining keyingi poyezdini kutishayotgan bo'lsa, siz har bir ovqat qabuli uchun $ T[i]$ miqdorda pul sarflashingiz lozim.

Sizning oilangizning jami $W$ marta ovqat qabul qilishlari kerak, bunda $i$ -chi ($0 \le i < W $ ) ovqat qabuli $ L[i]$ va $ R[i]$ **(ikki chegara ham kiradi)** vaqt oralig'ining istalgan vaqtida bo'lishi mumkin. **Ovqat qabul qilishga hech qancha vaqt ketmaydi.**

Hozir, 0-vaqtda, sizning oilangiz 0-sayyoradadir. Oilangiz $N - 1$-sayyoraga yetib borish uchun minimal xarajatni aniqlang. Agar oilangiz bu sayohatni uyushtira olmasa, javobingiz −1 bo'lishi kerak.

## Amalga oshirish tafsilotlari

Siz quyidagi funksiyani yozishingiz lozim:

```cpp
long long solve(int N, int M, int W, std::vector<int> T, std::vector<int> X, std::vector<int> Y, std::vector<int> A, std::vector<int> B, std::vector<int> C, std::vector<int> L, std::vector<int> R);
```

$N$ : sayyoralar soni.

- $M$ : sayyoralararo poyezd qatnovlari soni.

- $W$ : ovqat qabullari soni.

- $T $ : uzunligi $ N $ ga teng massiv. $ T[i]$ soni $ i$ -sayyoradagi bir martalik ovqat narxini anglatadi. $ X $ , $ Y $ , $ A $ , $ B $ , $ C $ : har birining uzunligi $ M $ ga teng massiv. ( $ X[i]$, $ Y[i]$, $ A[i]$, $ B[i]$, $ C[i]$) beshligi $ i$ - poyezd qatnovini tasvirlaydi.

- $L $ , $ R $ : har birining uzunligi $ W $ ga teng massiv. ( $ L[i]$, $ R[i]$) juftligi $ i$ -ovqat qabuli bo'lishi kerak vaqt oralig'ini anglatadi.

- Bu funksiya 0-sayyoradan $N - 1$-sayyoraga yetib borish kerak bo'ladigan minimal pul miqdorini qaytarishini lozim. Agar 0-sayyoradan $ N - 1$-sayyoraga ma'lum poyezd qatnovlari orqali yetib borishning iloji bo'lmasa −1 qaytarishi lozim.

- Har bir test uchun, bu funksiya alohida aynan 1 marta chaqiriladi.

## Misollar

### 1-misol
Quyidagicha funksiya chaqiruvini tahlil qilaylik:

solve(3, 3, 1, {20, 30, 40}, {0, 1, 0}, {1, 2, 2}, {1, 20, 18}, {15, 30, 40}, {10, 5, 40}, {16}, {19});

$N - 1$-sayyoraga yetishning usullaridan biri, bu 0-poyezd qatnoviga minish va keyin 1-poyezd qatnoviga chiqish, shunda jami pul sarfi 45 ga teng bo'ladi (quyidagi jadvalda to'liqroq tushuntirligan).

|**Vaqt**|**Harakat**|**Harajat (agar bo'lsa)**|
|---|---|---|
|1|0-sayyorada0-poyezd qatnoviga chiqish|10|
|15|1-sayyoraga yetib kelish||
|16|0-ovqat qabulini1-sayyorada bajarish|30|
|20|1-sayyorada1-poyezd qatnoviga chiqish|5|
|30|2-sayyoraga yetib kelish||

Ammo bundan yaxshiroq yo'l, $N - 1$-sayyoraga faqatgina 2-poyezd qatnovi orqali borishdir. Bunda jami pul sarfi 40 bo'ladi (quyidagi jadvalda to'liqroq tushuntirligan).

|**Vaqt**|**Harakat**|**Harajat (agar bo'lsa)**|
|---|---|---|
|18|0-sayyorada2-poyezd qatnoviga chiqish|40|
|19|0-ovqat qabulini2-poyezd qatnovida bajarish||
|40|2-sayyoraga yetib kelish||

Shu usulda $N - 1$-sayyoraga yetib kelasiz. 0-ovqat qabulini 18-vaqtda bajarsa ham bo'ladi.

Bundan optimalroq usul yo'q. Shuning uchun funksiyangiz 40 ni qaytarishi lozim.

### 2-misol
Quyidagicha funksiya chaqiruvini tahlil qilaylik:

solve(3, 5, 6, {30, 38, 33}, {0, 1, 0, 0, 1}, {2, 0, 1, 2, 2}, {12, 48, 26, 6, 49}, {16, 50, 28, 7, 54}, {38, 6, 23, 94, 50}, {32, 14, 42, 37, 2, 4}, {36, 14, 45, 40, 5, 5});

Optimal yo'l bu oldin 0-poyezd qatnoviga minish va 38 miqdorda pul sarflash kerak. 1-ovqatni 0- poyezd qatnovi davomida bepulga olsa bo'ladi. 0, 2, va 3-ovqatlar 2-sayyorada, 33 × 3 = 99 pul miqdori evaziga olinishi lozim. 4 va 5-ovqatlar 0-sayyorada 30 × 2 = 60 pul miqdoriga olinishi lozim. Shunda jami xarajat 38 + 99 + 60 = 197 ni tashkil etadi.

Shuning uchun ham funksiya 197 ni qaytarishi lozim.

## Cheklovlar

- $2 \le N \le 10^{5}$.

- $0 \le M $ , $ W \le 10^{5}$.

- $0 \le X[i]$, $ Y[i] < N $ , $ X[i] \ne Y[i]$.

- $1 \le A[i] < B[i] \le 10^{9}$.

- $1 \le T[i]$, $ C[i] \le 10^{9}$.

- $1 \le L[i] \le R[i] \le 10^{9}$.

## Qism masalalar

1. (5 ball): $N $ , $ M $ , $ A[i]$, $ B[i]$, $ L[i]$, $ R[i] \le 10^{3}$ and $ W \le 10$.

2. (5 ball): $W = 0$.

3. (30 ball): Hech qaysi ikki ovqat qabul vaqtlari kesishmaydi. Ya'ni, istalgan $z$ vaqt momenti uchun ($1 \le z \le 10^{9}$), $ L[i] \le z \le R[i]$ sharti bajariladigan $ i$ lar soni ko'pi bilan bitta ( $0 \le i < W$ ).

4. (60 ball): Qo'shimcha cheklovlarsiz.

## Namuna grader

Namunaviy greyder kirish oqimni quyidagi formatda o'qiydi:

- Qator 1: _N M W_

Qator 2: $T[0]$ $ T[1]$ $ T[2]$ ⋯ $ T $ [ $ N - 1$]

- Qator 3 + $i $ ($0 \le i < M $ ): $ X[i]$ $ Y[i]$ $ A[i]$ $ B[i]$ $ C[i]$

Qator 3 + $M $ + $ i $ ($0 \le i < W $ ): $ L[i]$ $ R[i]$

Namunaviy greyder javoblaringizni quyidagi formatda chop etadi:

Qator 1:  solve -funksiyasi qaytargan son.

---

Manba: [APIO 2024 rasmiy masalalar arxivi](https://github.com/APIO-2024/apio2024_tasks/tree/01679c43ad7cdd9514bc2e74681b71c63ef90eb1). [Litsenziya: CC0 1.0](https://github.com/APIO-2024/apio2024_tasks/blob/01679c43ad7cdd9514bc2e74681b71c63ef90eb1/LICENSE).
