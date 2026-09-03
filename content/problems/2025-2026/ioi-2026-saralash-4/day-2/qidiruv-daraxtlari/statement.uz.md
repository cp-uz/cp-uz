_Binar daraxt_ — bu $1$ dan $n$ gacha raqamlangan $n$ ta tugundan iborat ierarxik struktura. Har bir $k$ tugun _chap farzand_ va _o'ng farzand_ga ega bo'lishi mumkin. Agar $m$ tugun $k$ tugunning farzandi bo'lsa, $k$ ni $m$ ning _ota-onasi_ deymiz. $1$ raqamli tugun _ildiz_ deb ataladi; ildizning ota-onasi yo'q, qolgan har bir tugunda esa aniq bitta ota-ona bor. $k$ tugunning _avlodlari_ — $k$ dan farzandlarga ketma-ket o'tib yetib boriladigan barcha tugunlar. $k$ tugunning _qism daraxti_ $k$ va uning barcha avlodlaridan iborat. Har bir tugunda _qiymat_ saqlanadi — $0$ va $10^9$ orasidagi butun son (chegaralar bilan birga).

Binar daraxt _binar qidiruv daraxti_ deb ataladi, agar har bir $k$ tugun uchun quyidagilar bajarilsa:

- agar $k$ ning chap farzandi bo'lsa, chap farzandning qism daraxtidagi har bir

tugun qiymati $k$ qiymatidan **kichik yoki teng** bo'lsa;

- agar $k$ ning o'ng farzandi bo'lsa, o'ng farzandning qism daraxtidagi har bir

tugun qiymati $k$ qiymatidan **katta yoki teng** bo'lsa.

E'tibor bering: binar qidiruv daraxtining har bir qism daraxti ham binar qidiruv daraxti bo'ladi.

Sizga binar daraxt, so'ng berilgan tartibda bajarilishi kerak bo'lgan $m$ ta amal beriladi. Har bir amal bitta tugunning qiymatini yangi songa o'zgartiradi. Har bir amaldan keyin, o'sha paytdagi daraxt uchun, uning nechta qism daraxti binar qidiruv daraxti ekanini aniqlashingiz kerak.

## Implementation details

Quyidagi ikkita protsedurani amalga oshirishingiz kerak.

```cpp

void init(int n, vector<int> l, vector<int> r, vector<int> v)
```

- $n$: tugunlar soni. Tugunlar $0$ dan $n - 1$ gacha raqamlangan, ildiz —

$0$-tugun.

- $l$, $r$: uzunligi $n$ bo'lgan vektorlar. Har bir $i$ tugun uchun $l[i]$ —

$i$ tugunning chap farzandi indeksi, chap farzand bo'lmasa $-1$; $r[i]$ o'ng farzand uchun shunga o'xshash.

- $v$: uzunligi $n$ bo'lgan vektor; $v[i]$ — $i$ tugunning boshlang'ich qiymati.

- Bu protsedura `update` ga har qanday murojaatdan oldin aniq bir marta

chaqiriladi.

```cpp

int update(int k, int x)
```

- $k$, $x$: $k$ tugun qiymatini $x$ ga o'rnating ($0 \le k \le n - 1$).

- Bu protsedura shu paytgacha qo'llanilgan barcha o'zgarishlarni (shu amalni ham

qo'shib) hisobga olgan holda binar qidiruv daraxti bo'lgan qism daraxtlar sonini qaytarishi kerak.

- U aniq $m$ marta chaqiriladi.

## Constraints

- $1 \le n, m \le 200\,000$

- har bir $i$ uchun $0 \le v[i] \le 10^9$

- har bir amal uchun $0 \le x \le 10^9$

- Kirish har doim ildizi $0$-tugun bo'lgan to'g'ri ildizli binar daraxtni

tavsiflaydi.

## Subtasks

| Qism masala | Ball | Cheklovlar |
| --- | --- | --- |
| 1 | 20 | $1 \le n, m \le 5\,000$ |
| 2 | 40 | $1 \le n, m \le 200\,000$; har bir tugunda **ko'pi bilan bitta** farzand bor |
| 3 | 40 | $1 \le n, m \le 200\,000$ |

## Example

$6$ ta tugunli daraxtni ko'rib chiqamiz (ildiz — $0$-tugun, chap farzandi $1$, o'ng farzandi $2$; $1$-tugunda faqat chap farzand $3$ bor; $2$-tugunning chap farzandi $4$, o'ng farzandi $5$; $3$, $4$, $5$ tugunlar barglar).

Quyidagi chaqiruvlarni ko'rib chiqamiz:

```cpp

init(6, [1, 3, 4, -1, -1, -1], [2, -1, 5, -1, -1, -1], [4, 1, 3, 2, 2, 5])
update(2, 3)    returns 4
update(1, 2)    returns 5
update(2, 5)    returns 5
update(4, 4)    returns 6
update(5, 1)    returns 4
```

Masalan, birinchi `update(2, 3)` chaqiruvidan keyin qiymatlar $[4, 1, 3, 2, 2, 5]$ bo'ladi. Qidiruv daraxti bo'lgan qism daraxtlar — uchta barg ($3$, $4$, $5$ tugunlar) va $2$-tugunda ildizlangan qism daraxt; $1$-tugunning qism daraxti qidiruv daraxti emas, chunki uning chap farzandi kattaroq qiymatga ega, butun daraxt ham qidiruv daraxti emas. Demak, javob $4$.

## Sample grader

Namunaviy grader kirishni quyidagi formatda o'qiydi. Kirishda tugunlar $1$ dan $n$ gacha raqamlangan (ya'ni $1$-tugun ildiz), farzand $0$ ga teng bo'lsa, o'sha farzand yo'q degani.

- $1$-satr: $n\;m$

- $1 + k$-satr ($1 \le k \le n$ uchun): $l_k\;r_k$ — $k$ tugunning chap va o'ng

farzandi; $0$ "farzand yo'q" degani

- $n + 2$-satr: $v_1\;v_2\;\ldots\;v_n$ — boshlang'ich qiymatlar

- $n + 2 + j$-satr ($1 \le j \le m$ uchun): $k_j\;x_j$ — $j$-amal, $k_j$ tugun

qiymatini $x_j$ ga o'rnatadi

Namunaviy grader tugun belgilarini protseduralar ishlatadigan $0$-asosli indekslarga aylantiradi (har bir belgidan $1$ ni ayiradi, shunda yo'q farzandni bildiruvchi $0$ → $-1$ bo'ladi), `init` ni bir marta chaqiradi, so'ng har bir amal uchun `update` ni chaqiradi va qaytarilgan qiymatlarni quyidagi formatda chiqaradi:

- $j$-satr ($1 \le j \le m$ uchun): `update` ga $j$-chaqiruv qaytargan qiymat

Bu formatdan o'zingizning test holatlaringizni tayyorlashda foydalanishingiz mumkin.

## Namunalar

### 1-namuna

**Kirish:**

```text
6 5
2 3
4 0
5 6
0 0
0 0
0 0
4 1 3 2 2 5
3 3
2 2
3 5
5 4
6 1
```

**Chiqish:**

```text
4
5
5
6
4
```

### 2-namuna

**Kirish:**

```text
8 10
4 5
8 0
0 0
3 7
0 6
0 0
2 0
0 0
7 0 9 3 6 0 6 2
3 0
4 0
8 2
2 3
7 6
1 6
5 7
6 9
1 1
1 7
```

**Chiqish:**

```text
3
3
3
6
6
6
6
8
7
8
```
