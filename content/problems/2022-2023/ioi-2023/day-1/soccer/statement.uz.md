> IOI 2023 rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). PDF - asosiy manba: diagrammalar, indekslar va murakkab formulalarni rasmiy PDFdan tekshiring.

Nadyerdo - bu Debresen shahrida joylashgan $N$ × $ N $ o'lchamdagi jadval shaklida ifodalash mumkin bo'lgan kvadrat shaklidagi o'rmon. Jadvalning qatorlari shimoldan janubga tomon 0 dan $ N - 1$ gacha raqamlangan va ustunlar esa g'arbdan sharqqa tomon 0 dan $ N - 1$ gacha raqamlangan. Jadvalning $ r$ - satrining $ c$ - ustunida joylashgan katakchani ( $ r $ , $ c$ ) katak deb ataymiz.

O'rmonda har bir katakda **bo'sh** yoki **daraxt** mavjud. O'rmonda kamida bitta katak bo'sh.

Shaharning mashhur sport klubi DVSC o'rmonda yangi futbol stadioni qurishni rejalashtirmoqda. $s $ oʻlchamdagi stadion (bu yerda $s \ge 1$) $ s $ ta _boʻsh_ $(r_0,c_0),\ldots,(r_{s-1},c_{s-1})$ katakchalar toʻplamidir Bu shuni anglatadiki:

- 0 dan $s - 1$ gacha boʻlgan har bir $i$ uchun $(r_i,c_i)$ katak boʻsh,

- har bir $i$ , $ j $ ($0 \le i < j < s$ ) uchun, $r_i \ne r_j$ yoki $c_i \ne c_j$ dan kamida bittasi o'rinli bo'ladi.

Futbol o'yin to'p yordamida o'ynaladi, u stadion kataklari bo'ylab harakatlanadi. **to'g'ridan-to'g'ri zarba** quyidagi ikkita harakatdan biri sifatida belgilanadi:

- Agar stadion $r$ - satrning $ a$ - ustunidan $ b$ ($0 \le r $ , $ a $ , $ b < N $ , $ a \ne b $ ) - ustunigacha bo'lgan barcha kataklarni o'z ichiga olsa to'pni ( $ r $ , $ a $ ) katagidan ( $ r $ , $ b$ ) katagiga to'g'ridan-to'g'ri zarba bilan ko'chirish mumkin. Ya'ni,

   - agar $a < b$ bo'lsa stadion $a \le k \le b$ oraliqdagi har bir $k$ uchun ( $r $ , $ k$ ) katakni o'z ichiga olsa,

   - agar $a > b$ bo'lsa stadion $b \le k \le a$ oraliqdagi har bir $k$ uchun ( $r $ , $ k$ ) katakni o'z ichiga olsa,

- Agar stadion $c$ - ustunning $ a$ - qatoridan $ b$ ($0 \le r $ , $ a $ , $ b < N $ , $ a \ne b $ ) - qatorigacha bo'lgan barcha kataklarni o'z ichiga olsa to'pni ( $ a $ , $ c $ ) katagidan ( $ b $ , $ c$ ) katagiga to'g'ridan-to'g'ri zarba bilan ko'chirish mumkin. Ya'ni,

   - agar $a < b$ bo'lsa stadion $a \le k \le b$ oraliqdagi har bir $k$ uchun ( $k $ , $ c$ ) katakni o'z ichiga olsa,

   - agar $a > b$ bo'lsa stadion $b \le k \le a$ oraliqdagi har bir $k$ uchun ( $k $ , $ c$ ) katakni o'z ichiga olsa,

To'pni stadionning ixtiyoriy katagidan boshqa bir ixtiyoriy katagiga ko'pi bilan 2 ta to'g'ridan-to'g'ri zarba bilan o'tkazishni imkoni bo'lsa stadion **muntazam** deyiladi. Etibor bering 1 o'lchamdagi har qanday stadion muntazamdir.

Misol uchun, (1,0) va (4,2) katakchalarida daraxtlar va boshqa barcha kataklar boʻsh boʻlgan $N = 5$ oʻlchamli oʻrmonni koʻrib chiqaylik. Quyidagi rasmda uchta mumkin bo'lgan stadion

ko'rsatilgan. Daraxtlar bo'lgan kataklar qoraygan va stadiondagi kataklar chiziqli.

Chap tarafdagi stadion muntazam. Biroq o'rtadagi stadion muntazam emas, chunki (4,1) katakdan (4,3) katakka o'tish uchun eng kamida 3 ta to'g'ridan-to'g'ri zarba kerak. O'ng tarafdagi stadion ham muntazam emas, chunki to'pni (3,0) katakdan (1,3) katakka olib o'tib bo'lmaydi.

Sport klubi iloji boricha kengroq bo'lgan muntazam stadion qurmoqchi. Sizning vazifangiz o'rmonda $s$ o'lchamdagi muntazam stadion mavjud bo'lishi uchun $s$ ning maksimal qiymatini topishdir.

## Amalga oshirish

tafsilotlari

Siz quyidagi funksiyani implement qilishingiz kerak:

```
int biggest_stadium(int N, int[][] F)
```

$N$ : o'rmon o'lchami.

- $F $ : $ N $ ta qator va $ N $ ta ustundan iborat bo'lgan o'rmonning holatini ifodalaydigan ikki o'lchamli massiv. Har bir $ r $ ($0 \le r < N $ ) va $ c $ ($0 \le c < N $ ) uchun $ F[r]$[ $ c $ ] = 0 bo'lsa ( $ r $ , $ c $ ) bo'sh katak, va $ F[r]$[ $ c$ ] = 1 bo'lsa bu katakda daraxt mavjudligini anglatadi.

- Bu funksiya o'rmonda qurish mumkin bo'lgan maksimum o'lchamdagi muntazam stadionning o'lchamini qaytarishi kerak.

- Har bir test case uchun bu funksiya anniq bir marotaba ishlatiladi!

## Misol

Consider the following call:

```
biggest_stadium(5, [[0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0]])
```

In this example, the forest is displayed on the left and a regular stadium of size 20 is displayed on the right of the following figure:

Since there is no regular stadium of size 21 or greater, the procedure should return 20.

## Cheklovlar

- $1 \le N \le 2\,000$

- $0 \le F[i]$[ $ j $ ] ≤1 (for each $ i $ and $ j $ such that $0 \le i < N $ and $0 \le j < N$ )

- There is at least one empty cell in the forest. In other words, $F[i]$[ $ j $ ] = 0 for some $0 \le i < N $ and $0 \le j < N$ .

## Qism masalalar

1. (6 points) There is at most one cell containing a tree.

2. (8 points) $N \le 3$

3. (22 points) $N \le 7$

4. (18 points) $N \le 30$

5. (16 points) $N \le 500$

6. (30 points) No additional constraints.

In each subtask, you can obtain 25% of the subtask score if your program judges correctly whether the set consisting of _all_ the empty cells is a regular stadium.

More precisely, for each test case in which the set consisting of all the empty cells is a regular stadium, your solution:

- gets full points if it returns the correct answer (which is the size of the set consisting of all the empty cells).

- gets 0 points otherwise.

For each test case in which the set consisting of all the empty cells is _not_ a regular stadium, your solution:

- gets full points if it returns the correct answer.

- gets 0 points if it returns the size of the set consisting of all the empty cells.

- gets 25% of the points if it returns any other value.

The score for each subtask is the minimum of the points for the test cases in the subtask.

## Namuna grader

The sample grader reads the input in the following format:

- line 1: $N$

- line 2 + $i $ ($0 \le i < N $ ): $ F[i]$[0] $ F[i]$[1] … $ F[i]$[ $ N - 1$]

The sample grader prints your answer in the following format:

- line 1: the return value of  biggest_stadium
