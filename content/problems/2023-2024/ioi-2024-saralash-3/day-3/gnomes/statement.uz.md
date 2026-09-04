# Gnomes (gnomes)

Dadorlandtiria mamlakatida $n$ ta gnom bor, ular $0$ dan $n - 1$ gacha raqamlangan. Kunlardan bir kuni yovuz Dr. Dilyor gnomlarni o'g'irlab ketdi va ularni Dr. Dilyor Evil Inc. ga olib kelib, qiyin topshiriq berdi.

Gnomlar aylana shaklida turishibdi. Dr. Dilyor kelib har bir gnomning boshiga rangli qalpoq kiydiradi. Qalpoq rangi $0$ dan $k - 1$ gacha ixtiyoriy son bo'lishi mumkin. Hech qaysi gnom o'zining boshidagi qalpoq rangini ko'rmaydi, biroq qolgan $n - 1$ ta gnomning qalpoqlari rangini ko'ra oladi.

Hammaga qalpoq kiydirilgandan so'ng, barcha gnomlar bir vaqtda $0$ va $h - 1$ oralig'idagi butun son aytadi (barcha bir xil son aytishi shart emas). So'ngra barcha gnomlar o'zining qalpog'ining rangini aytishi kerak.

Dr. Dilyor qalpoqlarni kiydirishni boshlashidan avval gnomlar o'zaro kelishib, reja tuzib olishlari mumkin. Qalpoq kiydirish boshlanganidan so'ng hech qanday rejalashtirish mumkin emas.

Barcha gnomlar o'z qalpog'i rangini to'g'ri topsa, Dr. Dilyor ularni qo'yib yuboradi. Agarda kimdir adashadigan bo'lsa, ularning barchasi qamoqxonada abadiy qolib ketishadi. Siz gnomlarga yordam bering.

## Implementation details

Vazifangiz quyidagi protseduralarni dasturlash:

```cpp
void init(int n, int k, int h)
```

- $n$: jami gnomlar soni.
- $k$: jami qalpoq ranglari soni.
- $h$: gnomlar aytishi mumkin bo'lgan maksimal son.
- Protsedura hech narsa qaytarmaydi.

```cpp
int say_number(int id, int[] a)
```

- $id$: gnomning raqami.
- $a$: uzunligi $n - 1$ ga teng massiv, $id$-raqamli gnomdan boshqa barcha gnomlarning qalpoq ranglari.
- Protsedura $id$-raqamli gnomning aytishi kerak bo'lgan sonni qaytarishi kerak.

```cpp
int answer(int id, int[] a, int[] c)
```

- $id$: gnomning raqami.
- $a$: uzunligi $n - 1$ ga teng massiv, $id$-raqamli gnomdan boshqa barcha gnomlarning qalpoq ranglari.
- $c$: uzunligi $n$ ga teng massiv. Bu yerda $c[i]$ — $i$-raqamli gnomning aytgan soni.
- Protsedura $id$-raqamli gnom qalpog'ining rangini qaytarishi kerak.

Har bir testda bir nechta mustaqil ssenariy ko'riladi. Agar testda $t$ ta ssenariy bor bo'lsa, yuqoridagi dasturlar quyidagi tartibda uch marta ishlatiladi:

Birinchi qismda `init` protsedurasi bir marta chaqiriladi (barcha ssenariylarda $n$, $k$ va $h$ qiymatlari bir xil bo'ladi). So'ng `say_number` protsedurasi aynan $t \cdot n$ marta chaqiriladi (har bir ssenariy uchun $n$ marta, ya'ni har bir gnom uchun). Qaytarilgan natijalar sistemada saqlanadi.

Ikkinchi dastur qayta ishga tushiriladi. `init` protsedurasi bir marta chaqiriladi. So'ng `answer` protsedurasi aynan $t \cdot n$ marta chaqiriladi. **Har bir chaqiruvda ixtiyoriy ssenariy tanlanishi mumkin.**

Umuman olganda, kod qayta ishga tushganda barcha o'zgaruvchilar o'chib ketadi, **birinchi qismdan so'ng static yoki global o'zgaruvchilarga saqlangan ma'lumotlardan ikkinchi qismda foydalanib bo'lmaydi.**

## Example

Aytaylik, $n = 5$, $k = 12$ va $h = 100$ bo'lsin. Gnomlarning qalpoq raqamlari esa $p = [4, 11, 7, 0, 2]$ bo'lsin. U holda quyidagi chaqiruvlar ketma-ketligi bo'ladi:

```text
init(5, 12, 100)
```

Bu chaqiruv sizga $n$ va $k$ ning qiymatlari haqida ma'lumot beradi.

So'ngra quyidagi chaqiruvlar bo'lsin:

```text
say_number(0, [11, 7, 0, 2])
say_number(1, [4, 7, 0, 2])
say_number(2, [4, 11, 0, 2])
say_number(3, [4, 11, 7, 2])
say_number(4, [4, 11, 7, 0])
```

Aytaylik, bu chaqiruvlar mos ravishda $6$, $2$, $7$, $5$ va $10$ sonlarini qaytardi.

So'ngra quyidagi chaqiruvlar qilinadi (istalgan tartibda):

```text
answer(0, [11, 7, 0, 2], [6, 2, 7, 5, 10])
answer(1, [4, 7, 0, 2],  [6, 2, 7, 5, 10])
answer(2, [4, 11, 0, 2], [6, 2, 7, 5, 10])
answer(3, [4, 11, 7, 2], [6, 2, 7, 5, 10])
answer(4, [4, 11, 7, 0], [6, 2, 7, 5, 10])
```

Bunda `answer` protseduralari mos ravishda $4$, $11$, $7$, $0$, $2$ sonlarini qaytarishi kerak.

## Constraints

- $1 \le t \le 100$
- $2 \le n \le 20$
- $2 \le k \le 500\,000$
- $2 \le h \le 500\,000$
- $0 \le p[i] \le k - 1$, barcha $0 \le i \le n - 1$ uchun

## Subtasks

1. (5 ball) $n = k = h$, barcha $p[i]$ qiymatlar har xil.
2. (5 ball) $k = h$.
3. (20 ball) $h = 20$ va barcha qalpoq uchun xuddi o'sha rangdagi boshqa qalpoq ham topiladi.
4. (70 ball) $n = 20$, $k = 500\,000$, $h = 10$.

Shuningdek, 4-subtaskda qism ball olishingiz mumkin. Aytaylik, $m$ — barcha testlar uchun `say_number` funksiyasi qaytargan sonlar ichida maksimumi bo'lsin. U holda quyidagicha ball olasiz:

| Shart | Ball |
|---|---:|
| $10 \le m$ | 0 |
| $5 \le m < 10$ | 15 |
| $2 \le m < 5$ | $60 - 10 \cdot m$ |
| $m < 2$ | 70 |

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

- qator 1: $n\ k\ h\ t$

Keyingi $t$ ta ssenariy uchun ma'lumotlarni quyidagicha kiriting:

- $p[0]\ p[1]\ \ldots\ p[n - 1]$

So'ngra namunaviy grader javoblarni quyidagi tartibda chiqaradi:

- qator 1: $m$

Keyingi $t$ ta qatorda har bir ssenariy uchun javob ($r$ — qaytarilgan massiv):

- $r[0]\ r[1]\ \ldots\ r[n - 1]$

Shuningdek, `init`, `say_number`, `answer` protseduralariga qilingan chaqiruvlar va ulardan qaytgan natijalarni grader `log.txt` fayliga chiqaradi.
