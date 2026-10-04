> Ushbu shart APIO 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Xanchjou markaziy maydonida mashhur qadimiy daraxt joylashgan bo'lib, u $N$ tugunli, 0 dan $N - 1$ gacha indekslangan, 0-tugun ildiz bo'lgan ildizli daraxt sifatida qaralishi mumkin.

Bolalari bo'lmagan tugun **barg tugun** deb ataladi. Har safar qadimiy daraxt barglarini to'kkanida, u bir vaqtda bitta barg tugunni o'chirish uchun tanlaydi. Bir kunda bir necha marta barglarini to'kishi mumkin.

Qadimiy daraxtni qo'riqlash uchun $M$ ta volontyor (0 dan $M - 1$ gacha indekslangan) mas'uldir. Ularning har biri mustaqil ravishda yil davomida barg to'kilishini quyidagi usulda yozib boradi:

Har kuni yangi to'kilgan barglarning indekslarini (ya'ni o'sha kuni o'chirilgan tugunlarning indekslarini) yig'ib, oldingi to'kilgan barglardan keyin istalgan tartibda yozib qo'yadi.

Masalan: Birinchi kuni 3 va 4 barglari to'kiladi, shuning uchun ular 3,4 yoki 4,3 deb yozadilar. Ikkinchi kuni 1 va 2 barglari to'kiladi, shuning uchun ular 1,2 yoki 2,1 deb yozishni davom ettiradilar. Yakuniy yozuv (3,4,1,2), (4,3,1,2), (3,4,2,1) yoki (4,3,2,1) bo'lishi mumkin.

Bu jarayon $K$ kun davom etadi, **har kuni yangi barglar to'kiladi** , faqat ildiz tugun qolguncha.

Sayohat paytida siz Xanchjouga tashrif buyurdingiz. Hozirda sovuq qish. Qadimiy daraxtning yalang'och shoxlariga qarab, to'kilayotgan barglarning go'zal manzarasini tasavvur qilmasdan turolmaysiz.

Siz bu yil barg to'kilishini necha kun ko'ra olishingiz mumkin bo'lganini bilishga juda qiziqasiz, lekin faqat $M$ volontyorning yozuvlarini topishingiz mumkin. Yozuvlardan $K$ ning maksimal mumkin bo'lgan qiymatini aniqlashga harakat qiling.

## Amalga oshirish tafsilotlari

Quyidagi funksiyani yozishingiz kerak:

```cpp
int solve(int N, int M, std::vector<int> F, std::vector<std::vector<int>> S);
```

$N $ : Qadimiy daraxtning tugunlari soni. $ M$ : Volontyorlar soni.

- $F $ : Uzunligi $ N $ bo'lgan butun sonlar massivi. $1 \le i \le N - 1$ uchun $F[i]$ tugun $i$ ning ota tuguni indeksini ifodalaydi. $F[0]$ har doim −1.

- $S $ : $ M $ ta massivni o'z ichiga olgan massiv. $ S $ ning har bir elementi uzunligi $ N - 1$ bo'lgan butun sonlar massivi. $ S[i]$[ $ j $ ] volontyor $ i $ tomonidan yozilgan $ j$ -indeksni ifodalaydi (0 dan boshlab).

- Funksiya yuqoridagi qoidalarga ko'ra $K$ ning maksimal mumkin bo'lgan qiymatini (ya'ni barg to'kilishi kunlarining mumkin bo'lgan maksimal sonini) ifodalovchi butun sonni qaytarishi kerak.

Har bir test holati uchun, baholovchi bu funksiyani bir necha marta chaqirishi mumkin. Har bir chaqiruv yangi ssenariy sifatida qayta ishlanishi kerak.

Eslatma: **Funksiya bir necha marta chaqirilishi mumkinligi sababli, ishtirokchilar avvalgi chaqiruvning qolgan ma'lumotlarining joriy chaqiruvga ta'siriga e'tibor berishlari kerak, ayniqsa global o'zgaruvchilarda saqlangan holatda.**

## Misollar

### 1-misol
Quyidagi chaqiruvga nazar soling:

solve(3, 1, {-1, 0, 0}, {{1, 2}});

Tegishli daraxt quyida ko'rsatilgan:

- 1 va 2-barglar bir kunda to'kilishi mumkin yoki 1-barg birinchi kunda, 2-barg esa ikkinchi kunda to'kilishi mumkin. Barg to'kilishi kunlar soni 2 kundan oshmaydi.

Shuning uchun, funksiya 2 qaytarishi kerak.

### 2-misol
Quyidagi chaqiruvga nazar soling:

solve(5, 2, {-1, 0, 0, 1, 1}, {{1, 2, 3, 4}, {4, 1, 2, 3}});

Tegishli daraxt quyida ko'rsatilgan:

Volontyorlarning yozuvlariga ko'ra, barg to'kilishi kamida 2 kun davom etgan bo'lsa, 4-barg turli kunlarda (birinchi va oxirgi) to'kiladi, va buning iloji yo'q.

Shuning uchun, funksiya 1 qaytarishi kerak.

## Cheklovlar

- $2 \le N \le 10^{5}$.

- $1 \le M \le 5$.

- Barcha chaqiruvlardagi $N\cdot M$ lar yig‘indisi $8\cdot10^5$ dan oshmaydi.

- $F[0] = -1$. Har bir $1 \le i \le N - 1$ uchun: $0 \le F[i] \le i - 1$

- Har bir $1 \le i \le M - 1$ uchun: $S[i]$ massivi 1,2,… , $N - 1$ ning permutatsiyasi. $F$ ildizli daraxtni tasvirlashi, va 0 uning ildizi bo'lishi kafolatlanadi.

## Qism masalalar

1. (11 ball): $M = 1$, $ N \le 10$, ∑ $ N \le 30$. 2. (14 ball): $ N \le 10$, ∑ $ N \le 30$ .

3. (5 ball): $M = 1$, $ N \le 1000$, ∑ $ N \le 2000$, $ F[i] = i - 1$. 4. (9 ball): $ M = 1$, $ N \le 1000$, ∑ $ N \le 2000$. 5. (5 ball): $ N \le 1000$, ∑ $ N \le 2000$, $ F[i] = i - 1$. 6. (11 ball): $ N \le 1000$, ∑ $ N \le 2000$. 7. (9 ball): $ M = 1$, $ F[i] = i - 1$. 8. (11 ball): $ M = 1$.

9. (9 ball): $F[i] = i - 1$.

10. (16 ball): Qo'shimcha cheklovlarsiz.

## Sample grader

Namunaviy greyder kirish oqimni quyidagi formatda o'qiydi:

- Qator 1: $T$ Quyidagi har bir $T$ ta ssenariy uchun:

- Qator 1: _N M_

- Qator 2: $F[1]$ $ F[2]$ ⋯ $ F $ [ $ N - 1$]

Qator 3 + $i $ ($0 \le i \le M - 1$): $ S[i]$[0] $ S[i]$[1] $ S[i]$[2] ⋯ $ S[i]$[ $ N - 2$]

Namunaviy greyder javoblaringizni quyidagi formatda chop etadi:

Har bir ssenariy uchun:

Qator 1:  solve funksiyaning qaytargan qiymati.

---

Manba: [APIO 2024 rasmiy masalalar arxivi](https://github.com/APIO-2024/apio2024_tasks/tree/01679c43ad7cdd9514bc2e74681b71c63ef90eb1). [Litsenziya: CC0 1.0](https://github.com/APIO-2024/apio2024_tasks/blob/01679c43ad7cdd9514bc2e74681b71c63ef90eb1/LICENSE).
