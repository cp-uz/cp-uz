> Bu adaptiv graderli interaktiv masala. Interfeysning to‘liq fayllari va barcha tilga oid talablar rasmiy arxivda berilgan.

Alisa va Bob dastlab $1,2,\ldots,2n$ sonlaridan iborat to‘plam bilan o‘yin o‘ynaydi. O‘yin $n$ raund davom etadi:

1. Alisa joriy to‘plamdan ikki xil $x$ va $y$ sonini tanlaydi hamda ularni to‘plamdan o‘chiradi.
2. Bob shu ikki sondan birini o‘z hisobiga, qolganini Alisaning hisobiga qo‘shadi.

Bob ketma-ket ikki raundda berilgan juftlikning kattaroq sonini tanlay olmaydi.

Sizga Alisa yoki Bob roli beriladi. Maqsad — o‘z rolingizdagi yakuniy hisobni imkon qadar kattalashtirish.

## Amalga oshirish

Yechimda ikkala funksiya ham e’lon qilinishi kerak:

```cpp
void Alice(int n);
void Bob(int n);
```

### Alisa roli

`Alice(n)` ichida aynan $n$ marta quyidagi funksiya chaqiriladi:

```cpp
int AskBob(int x, int y);
```

$x$ va $y$ hali ishlatilmagan ikki xil son bo‘lishi kerak. Funksiya Bob tanlagan sonni qaytaradi.

### Bob roli

`Bob(n)` ichida har bir raundda avval

```cpp
pair<int, int> AskAlice();
```

chaqiriladi, so‘ng qaytgan juftlikdagi tanlangan $c$ soni

```cpp
void AnswerToAlice(int c);
```

orqali yuboriladi. Ikkala funksiya ham aynan $n$ marta chaqirilishi kerak va kattaroq sonni ketma-ket ikki raundda tanlash mumkin emas.

## Chegaralar va baholash

- $2\le n\le1000$;
- grader adaptiv: uning qarorlari siz qilgan chaqiruvlarga bog‘liq;
- rol parametri $k=1$ bo‘lsa Alisa, $k=2$ bo‘lsa Bob sifatida o‘ynaysiz;
- ball optimal raqibga qarshi erishilgan hisobga qarab beriladi.

Namuna grader formati, til shablonlari va yetti qism-masalaning aniq chegaralari rasmiy PDF hamda masala paketida keltirilgan.
