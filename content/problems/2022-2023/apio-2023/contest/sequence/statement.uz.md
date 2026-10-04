> Ushbu shart APIO 2023 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Sehrli APIO podshohligida Alisa nomli yosh va g'aroyib talaba istiqomat qiladi. Alisada o'zining matematik bilimlarini sinovchi ajoyib masalalarni yechishga qoniqtirib bo'lmaydigan qiziqishi bor. Bir kuni u kelib chiqishi no'malum bo'lgan uzunligi $N$ ga teng sonlar ketma-ketligiga duch keldi(aniqrog'i $A[0]$, $ A[1]$,⋯, $ A $ [ $ N - 1$]), hamda Alisa ketma-ketlik sirlarini o'rganish xohishiga qarshi tura olmadi.

Endi, Alisa o'zinig bir nechta tadqiqotlarini siz bilan ulashmoqchi. Ammo bundan oldin, keling ba'zi bir narsalarni aniqlashtirib olaylik:

- $W(l,r,x)=\sum_{i=l}^{r} I[A[i]=x]$: $A[l],\ldots,A[r]$ ichida $x$ ning uchrashlar soni.

- Bo‘sh bo‘lmagan $B[0],\ldots,B[k-1]$ ketma-ketlikni o‘sish tartibida saralab, $C[0],\ldots,C[k-1]$ ni hosil qiling. Uning medianalari to‘plami:

$$S(\{B[0],\ldots,B[k-1]\})=\left\{C\left[\left\lfloor\frac{k-1}{2}\right\rfloor\right],C\left[\left\lceil\frac{k-1}{2}\right\rceil\right]\right\}.$$

Masalan, $S(\{6,3,5,4,6,2,3\})=\{4\}$, $S(\{4,2,3,1\})=\{2,3\}$ va $S(\{5,4,2,4\})=\{4\}$.

$S(l,r)$ orqali $A[l],\ldots,A[r]$ ketma-ketligining medianalari to‘plamini belgilaymiz. Alisa quyidagi eng katta qiymatni topishni istaydi:

$$\max_{0\le l\le r\le N-1}\ \max_{x\in S(l,r)} W(l,r,x).$$

Alisa javobni topib bo‘lgan bo‘lsa-da, natijasini tasdiqlash uchun yordam izlamoqda. Sizdan shu javobni hisoblovchi dastur yozish so‘raladi.

## Kod yozish detallari

Quyidagi funksiyani e'lon qilishingiz kerak bo'ladi:

```cpp
int sequence(int N, std::vector<int> A);
```

$N $ : $ A$ ketma-ketlik uzunligi.

- $A $ : $ A $ ketma-ketlikni ifodalovchi uzunligi $ N $ ga teng massiv, array of length $ N$ .

Bu funksiya bitta butun son - barcha ( $l $ , $ r$ ) juftliklar orasidan so'ralgan qyimatning eng kattasini qaytarishi kerak.

Bu funksiya 1 martagina chaqiriladi.

## Namunalar

### Namuna 1

Quyidagicha funksiya chaqiruvini ko'rib chiqaylik:

sequence(7, {1, 2, 3, 1, 2, 1, 3});

Bu funksiya 3 qaytarishi kerak.

Ushbu holatda, $S $ (0,5) = {1,2}, $ W $ (0,5,1) = 3, $ W$ (0,5,2) = 2. Demak, (0,5) ning qiymati 3. Barcha juftliklar orasida (0,5) eng katta qiymatga ega ekanligini tekshirish qiyin emas.

### Namuna 2

Quyidagicha funksiya chaqiruvini ko'rib chiqaylik:

sequence(9, {1, 1, 2, 3, 4, 3, 2, 1, 1});

Bu funksiya 2 qaytarishi kerak.

### Namuna 3

Quyidagicha funksiya chaqiruvini ko'rib chiqaylik:

sequence(14, {2, 6, 2, 5, 3, 4, 2, 1, 4, 3, 5, 6, 3, 2});

Bu funksiya 3 qaytarishi kerak.

## Chegaralar

$1 \le N \le 5$ × $10^{5}$ $1 \le A[i] \le N$

## Qism masalalar

1.(11 points): $N \le 100$. 2.(17 points): $ N \le 2$ × $10^{3}$.

3.(7 points): Quyidagi shartlarni qanoatlantiruvchi $x$ mavjudligi kafolatlanadi: ∀$0 \le i < x $ , $ A[i] \le A $ [ $ i $ + 1] va ∀ $ x < i < N $ , $ A[i] \le A $ [ $ i - 1$].

- 4.(12 points): $A[i] \le 3$.

- 5.(13 points): $W $ (0, $ N - 1$, $ A[i]$) ≤2 ($0 \le i \le N - 1$ bo'lgan barcha $i$ lar uchun)

- 6.(22 points): $N \le 8$ × $10^{4}$.

- 7.(18 points): Qo'shimcha cheklanishlarsiz.

## Namunaviy greyder

Namunaviy greyder ma'lumotlarni quyidagi formatda o'qiydi:

Qator 1: $N$ Qator 2: $A[0]$ $ A[1]$ ⋯ $ A $ [ $ N - 1$].

Namunaviy greyder natijani quyidagi formatda chiqaradi:

Qator 1:  sequence() funksiyasi qaytargan natija.

---

Manba: [APIO 2023 rasmiy masalalar arxivi](https://github.com/apio2023/apio2023_tasks/tree/af6519ce925e3489a07ed4248a4fb10860246e8a). [Litsenziya: CC0 1.0](https://github.com/apio2023/apio2023_tasks/blob/af6519ce925e3489a07ed4248a4fb10860246e8a/LICENSE).
