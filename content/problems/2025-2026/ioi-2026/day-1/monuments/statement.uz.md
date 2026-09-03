> Ushbu shart IOI 2026 rasmiy task archive’idagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Samarqanddagi mashhur Registon maydoni markazidan o'tuvchi bitta to'g'ri chiziqda joylashgan $N$ ta yodgorlik mavjud. Yodgorliklar 0 dan $N - 1$ gacha indekslangan. $i $ -yodgorlik ( $0 \le i < N $ ) dastlab $ X[i]$ butun sonli koordinatada joylashgan. Maydonning markazi 0-koordinata.

Arxitektorlar markazga nisbatan mukammal simmetriyani talab qiladilar. Ular ba'zi yodgorliklarni shunday ko'chirmoqchi bo'ladilarki, yakuniy konfiguratsiya 0-koordinatasiga nisbatan simmetrik bo'lsin.

Rasmiy ravishda:

- Har bir yodgorlik butun sonli koordinatada joylashtirilishi kerak.

- Har bir butun sonli koordinata **nol, bir yoki bir nechta yodgorliklarni** o'z ichiga olishi mumkin.

- Har bir $x > 0$ butun son uchun $x$ koordinatasidagi yodgorliklar soni − $x$ koordinatasidagi yodgorliklar soniga teng bo'lishi kerak. 0 koordinatasida istalgan miqdordagi (yoki 0 ta) yodgorliklar joylashishi mumkin.

Biroq, yodgorliklar ichidan $M$ tasi qadimiy va juda nozik bo'lganligi uchun ko'chirish mumkin emas. Ularning indekslari $P[0]$, $ P[1]$,… , $ P $ [ $ M - 1$]. Bu $ M$ ta yodgorlik asl koordinatalarida qolishi kerak. Qolgan $ N$ − $ M$ ta yodgorlikni istalgan butun sonli koordinataga ko'chirish mumkin.

Bitta yodgorlikni $a$ koordinatasidan $b$ koordinatasiga ko'chirish narxi ularning farqi, ya'ni ∣ $a $ − $ b$ ∣ ga teng. Umumiy xarajat barcha yodgorliklarning ko'chirish narxlarining yig'indisiga teng.

Sizning vazifangiz yodgorliklarning joylashuv koordinatlarini 0-koordinataga nisbatan simmetrik qilish uchun minimal umumiy xarajatni topish yoki berilgan cheklovlar ostida bunday simmetriyaga erishish mumkin emasligini aniqlashdir.

## Amalga oshirish

tafsilotlari

Siz quyidagi protsedurani shakllantirib berishingiz kerak:

```
long long get_cost(std::vector<int> X, std::vector<int> P)
```

- $X $ : yodgorliklarning boshlang'ich koordinatalarini ifodalovchi $ N$ uzunlikdagi saralangan massiv.

- $P $ : qadimiy yodgorliklar indekslarini o'z ichiga olgan $ M$ uzunlikdagi saralangan massiv.

Ushbu protsedura har bir test uchun bir marta chaqiriladi.

Protsedura bitta butun son qaytarishi kerak: joylashuv koordinatalarini 0-koordinataga nisbatan simmetrik qilish uchun minimal umumiy xarajat yoki agar buning iloji bo'lmasa, −1 .

## Cheklovlar

- $1 \le N \le 500\,000$
- $0 \le M \le N$
- $-10^9 \le X[0] \le X[1] \le \ldots \le X[N-1] \le 10^9$
- $0 \le P[0] < P[1] < \ldots < P[M-1] < N$

## Qism masalalar

|**Subtask**|**Ball**|**Qo'shimcha cheklovlar**|
|---|---|---|
|1|3|$M = N$|
|2|4|$M = 0$|
|3|5|$X[P[i]] < 0$ har bir $i$($0 \le i < M$) uchun.|
|4|6|$N \le 10$|
|5|5|$N \le 19$|
|6|5|$N \le 32$|
|7|13|$N \le 200$|
|8|17|$N \le 4000$|
|9|13|$M \le 4000$|
|10|29|Qo'shimcha cheklovlarsiz.|

## Misollar

### 1-misol
Quyidagi murojaatni ko'rib chiqing:

```
get_cost([-3, -2, 1, 3], [1, 2])
```

Yodgorliklarning dastlabki konfiguratsiyasi quyidagi rasmda ko'rsatilgan.

Dastlab [−3,−2,1,3] koordinatalarda $N = 4$ ta yodgorlik mavjud. Qadimiy yodgorliklarning indekslari $P[0] = 1$ va $P[1] = 2$ . Ya'ni, −2 va 1 koordinatalaridagi yodgorliklarni ko'chirib bo'lmaydi. −3 va 3 koordinatalaridagi yodgorliklar boshqa joyga ko'chirilishi mumkin.

Minimal umumiy xarajat bilan simmetriyaga erishish uchun yodgorliklarni quyidagicha ko'chirishimiz kerak:

- −3 koordinatasidagi yodgorlikni −1 koordinatasiga ko'chirish, narxi ∣(−3) −(−1)∣= 2. 3 koordinatasidagi yodgorlikni 2 koordinatasiga ko'chirish, narxi ∣3 −2∣= 1.

Ushbu ko'chirishlardan so'ng, konfiguratsiya simmetrik bo'ladi.

Umumiy xarajat qiymati 2 + 1 = 3 ga teng, shuning uchun protsedura 3 qaytarishi kerak.

### 2-misol
Quyidagi murojaatni ko'rib chiqing:

```
get_cost([2, 2, 2, 3], [])
```

Bu yerda $M = 0$ , ya'ni hech bir yodgorlik qadimiy emas va barcha yodgorliklarni ko'chirish mumkin. Minimal umumiy xarajatga ega yechimlardan biri barcha yodgorliklarni 0 koordinatasiga ko'chirish. Har bir yodgorlikning narxi quyidagicha:

- 0 , 1 va 2-yodgorliklar uchun ∣2 −0∣= 2 .

- 3-yodgorlik uchun ∣3 −0∣= 3 .

Umumiy xarajat 2 + 2 + 2 + 3 = 9 ni tashkil qiladi. Shuning uchun protsedura 9 qaytarishi kerak. Shuni e'tiborga olingki, ushbu umumiy xarajatga teng bo'lgan boshqa yechimlar ham mavjud.

Example 3

Quyidagi murojaatni ko'rib chiqing:

```
get_cost([1, 2, 3, 4], [0, 1, 2, 3])
```

Barcha 4 ta yodgorlik qadimiy va ularni ko'chirib bo'lmaydi. Ularning koordinatalari musbat bo'lgani uchun, konfiguratsiyani 0 koordinatasi atrofida simmetrik qilish imkonsiz. Shuning uchun, protsedura −1 qiymatini qaytarishi kerak.

## Namuna grader

### Kiruvchi ma’lumotlar

formati

```
N M
X[0] X[1] ... X[N-1]
P[0] P[1] ... P[M-1]
```

Agar $M$ ning qiymati 0 bo'lsa, uchinchi qator bo'sh bo'ladi.

### Chiquvchi ma’lumotlar

formati

```
C
```

Bu yerda $C$ - `get_cost` protsedurasi tomonidan qaytarilgan qiymat.
