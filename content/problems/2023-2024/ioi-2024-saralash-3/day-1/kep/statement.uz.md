# Kepuz Arena (kep)

`kep.uz` dasturlash platformasida Arena turidagi musobaqalar o'tqaziladi. Bu arenada Anvar $n$ ta bellashuvda qatnashdi, bellashuvlar $0$ dan $n-1$ gacha raqamlangan.

Anvarning natijalarini $s$ satr bilan belgilashimiz mumkin. Agar $s[i] = $ "$\rm{W}$" bo'lsa, Anvar $i$-bellashuvda g'alaba qozongan, $s[i] = $ "$\rm{D}$" bo'lsa bellashuv durang bilan yakunlangan, hamda $s[i] = $ "$\rm{L}$" bo'lsa Anvar mag'lub bo'lgan.

Arenada har bir g'alabaga $2$ ball, durang uchun $1$ ball, mag'lubiyat uchun esa $0$ ball beriladi. Biroq Anvar ketma-ket $3$ marta yutadigan bo'lsa, shu va keyingi har bir g'alabasi uchun qo'shimcha $1$ ball oladi. Bu bonuslar Anvar mag'lub bo'lguncha yoki durang o'ynaguncha davom etadi. 

Anvar `kep.uz` admini Nazarbekdan o'zi qatnashgan ba'zi bellashuv natijalarini o'chirib yuborishni so'rashi mumkin. Bunda qolgan bellashuv natijalari tartibi o'zgarmaydi.

Anvar olishi mumkin bo'lgan maksimal ballni toping.

## Implementation details
Vazifangiz quyidagi protsedurani dasturlash:
```
int max_points(int n, string s)
```
* $n$: jami bellashuvlar soni.
* $s$: uzunligi $n$ ga teng satr - bellashuv natijalari.
* Protsedura ba'zi bellashuvlarni o'chirgan holda Anvar olishi mumkin bo'lgan maksimal ballni qaytarishi kerak.
* Bu protsedura aynan bir marta chaqiriladi.

## Example
Ushbu chaqiruvni ko'raylik:

```
max_points(15, "LWWWDWWDDLWWWWL")
```

Nazarbek Anvarning $0$ va $4$-raqamli bellashuvlarini o'chirib yuborishi mumkin. Shunda 
$s=$ "$\rm{WWWWWDDLWWWWL}$" bo'ladi va Anvar $2+2+3+3+3+1+1+0+2+2+3+3+0=25$ ball oladi. Bu maksimal javob bo'lgani uchun protsedura $25$ qaytarishi kerak.

Yana bir chaqiruv misolida:

```
max_points(6, "WWWWWW")
```

Bu misolda Nazarbek hech narsani o'chirishi shart emas. Protsedura $2+2+3+3+3+3=16$ qaytarishi kerak.

## Constraints

* $1 \le n \le 200\;000$
* $s[i] \in \{$"$\rm{W}$", "$\rm{D}$", "$\rm{L}$"$\}$, barcha $0 \le i \le n-1$ uchun.

## Subtasks
1. (14 ball) $n \le 20$
1. (8 ball) $s$ satrda ko'pi bilan $2$ ta "$\rm{W}$" belgisi bor.
1. (20 ball) $s$ satrda ko'pi bilan $18$ ta "$\rm{D}$" belgisi bor.
1. (16 ball) $n \le 200$
1. (18 ball) $n \le 2000$
1. (24 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $s$

Namunaviy grader javobni quyidagi tartibda chiqaradi:

* qator $1$: `max_points` protsedurasi qaytargan javob.
