Qadimiy ziyoratgoh $0$ dan $n-1$ gacha raqamlangan $n$ ta kameradan iborat tarmoq bo'lib, ular $n-1$ ta ikki tomonlama yo'lak bilan shunday bog'langanki, istalgan ikki kamera orasida aniq bitta yo'l mavjud (kameralar daraxt hosil qiladi). $k$ ta kamerada qimmatbaho relikviya saqlanadi; hech bir kamerada bittadan ortiq relikviya yo'q.

Relikviyalarni himoya qilish uchun ba'zi kameralarga qo'riqchilar joylashtirishingiz kerak. Har bir qo'riqchi **o'ziga eng yaqin barcha relikviyalarni va faqat ularni** qo'riqlaydi. Ikki kamera orasidagi **masofa** — ular orasidagi yagona yo'ldagi kameralar soni (ikkala chekka kamera ham hisobga olinadi); qo'riqchi va relikviya bitta kamerada bo'lishi mumkin, u holda qo'riqchi faqat o'sha relikviyani qo'riqlaydi. Agar bir nechta relikviya qo'riqchiga eng yaqin masofada teng kelsa, qo'riqchi ularning barchasini qo'riqlaydi.

**Har bir relikviyani kamida bitta qo'riqchi qo'riqlashi** uchun zarur bo'lgan **eng kam qo'riqchilar sonini** aniqlang va shu minimumga erishadigan bitta joylashuvni keltiring.

## Amalga oshirish tafsilotlari

Quyidagi protsedurani amalga oshirishingiz kerak.

```cpp

vector<int> place_guards(int n, vector<int> u, vector<int> v, vector<int> relic)
```

- `n`: kameralar soni, $0$ dan $n-1$ gacha raqamlangan.

- `u`, `v`: uzunligi $n-1$ bo'lgan vektorlar. Har bir $i$ uchun `u[i]` va `v[i]` kameralar o'rtasida yo'lak mavjud.

- `relic`: uzunligi $k$ bo'lgan vektor; relikviya saqlanadigan turli kameralar.

- Protsedura qo'riqchilar joylashtiriladigan kameralar vektorini qaytarishi kerak. Qaytarilgan joylashuv faqat **eng kichik o'lchamga ega** bo'lsa va **har bir relikviya qo'riqlangan** bo'lsa qabul qilinadi. Ikkala shartni qanoatlantiruvchi har qanday joylashuv qabul qilinadi.

- Bu protsedura aniq bir marta chaqiriladi.

## Cheklovlar

- $1 \le k \le n \le 500\,000$

- $n-1$ ta yo'lak kameralarni daraxtga bog'laydi.

- $k$ ta relikviya kamerasi turlicha.

## Qism masalalar

| Qism masala | Ball | Cheklovlar |
| --- | --- | --- |
| 1 | 8 | kameralar yo'l hosil qiladi: har bir $i$ uchun $i$ va $i+1$ kameralar bog'langan |
| 2 | 18 | $k \le 15$ |
| 3 | 23 | $n \le 2\,000$ |
| 4 | 51 | qo'shimcha cheklovsiz |

## Misol

To'rtta kamera $0-1-2-3$ yo'lni hosil qilsin, relikviyalar $0$ va $3$ kameralarda bo'lsin. Quyidagi chaqiruvni ko'rib chiqamiz:

```cpp

place_guards(4, [0, 1, 2], [1, 2, 3], [0, 3])
```

To'g'ri javoblardan biri — `[0, 2]` ni qaytarish (ikki qo'riqchi). $0$ kameradagi qo'riqchiga eng yaqin relikviya $0$ kamerada, $2$ kameradagi qo'riqchiga eng yaqin relikviya esa $3$ kamerada, shuning uchun ikkala relikviya ham qo'riqlanadi. Bu yerda bitta qo'riqchi yetarli emas, demak minimum $2$; masalan, `[1, 3]` ni qaytarish ham xuddi shunday to'g'ri bo'lardi.

PDFdagi rasmda kattaroq misol keltirilgan: $9$ ta kameradan iborat ziyoratgoh (1 dan 9 gacha belgilangan), relikviyalar $2, 5, 6, 7, 9$ kameralarda. Eng kam uchta qo'riqchi — $1, 4, 9$ kameralarda — barcha relikviyalarni qo'riqlaydi.

## Namunaviy grader

Namunaviy grader kirishni quyidagi formatda o'qiydi. Kirishda kameralar $1$ dan $n$ gacha raqamlangan.

- 1-satr: `n k`

- $1+i$-satr ($1 \le i \le n-1$ uchun): $i$-yo'lak bilan bog'langan ikki kamera

- $n+1$-satr: relikviya saqlanadigan $k$ ta kamera

Namunaviy grader kamera belgilarini protsedura ishlatadigan 0-asosli raqamlashga aylantiradi (har bir belgidan $1$ ni ayiradi), `place_guards` ni chaqiradi, so'ng qaytarilgan kameralarni 1-asosli belgilarga qaytarib chiqaradi:

- 1-satr: `X` — qaytarilgan qo'riqchilar soni

- 2-satr: qo'riqchilar joylashtiriladigan `X` ta kamera

Bu formatdan o'z test holatlaringizni tayyorlashda foydalanishingiz mumkin. Ko'p optimal joylashuvlar bo'lishi mumkinligi sababli, rasmiy graderda chiqishingiz checker bilan baholanadi: `X` minimal qo'riqchilar soniga teng bo'lsa va joylashuv har bir relikviyani qo'riqlasa, qabul qilinadi.

## Namunalar

### 1-namuna

**Kirish:**

```text
4 2
1 2
2 3
3 4
1 4
```

**Chiqish:**

```text
OK
2
3 1
```

### 2-namuna

**Kirish:**

```text
9 5
1 2
2 3
3 4
3 5
1 6
1 7
7 8
8 9
2 5 6 7 9
```

**Chiqish:**

```text
OK
3
3 8 1
```

### 3-namuna

**Kirish:**

```text
20 9
1 2
2 3
2 4
4 5
4 6
5 7
7 8
8 9
7 10
10 11
6 12
6 13
6 17
13 14
14 15
14 16
17 18
18 19
18 20
1 3 9 11 12 15 16 19 20
```

**Chiqish:**

```text
OK
3
5 13 17
```
