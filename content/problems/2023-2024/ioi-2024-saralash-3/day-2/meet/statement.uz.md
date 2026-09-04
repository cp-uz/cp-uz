# Meetings (meet)

Dadorlandtiria mamlakatida $n$ ta shahar bor va ular $0$ dan $n-1$ gacha raqamlangan. Mamlakatni $n-1$ ta ikki tomonli yo'l bog'lab turadi, bunda barcha $0 \le i \le n-2$ uchun $u[i]$ va $v[i]$ shaharlar to'g'ridan-to'g'ri yo'l bilan bog'langan va bu yo'ldan o'tish uchun $w[i]$ dador dollari to'lash kerak. Dadorlandtiria mamlakatida ixtiyoriy shahardan boshqasiga yetib borish mumkin.

Buni qarangki, keyingi $q$ kun davomida ishchilar berilgan topshiriqlarni bajarishlari kerak. Aytaylik, navbatdagi kunda $m$ ta ishchi bor va ular $t[0], t[1], \ldots t[m-1]$ shaharlarda yashashadi, bu yerda $m$ – **juft** son. Topshiriqni bajarish uchun ishchilar $\frac{m}{2}$ ta ikki kishilik guruhlarga bo'linishlari talab etiladi. Bitta guruhdagi ishchilar qaysidir shaharda birga uchrashishlari kerak.

Vazifangiz ishchilarni guruhlarga shunday ajratib chiqishki, bunda yo'l harakati uchun sarflanadigan umumiy xarajat miqdori minimal bo'lsin.

## Implementation details
Vazifangiz quyidagi ikkita protsedurani dasturlash:
```
void init(int n, int[] u, int[] v, int[] w)
```
* $n$: jami shaharlar soni.
* $u$ va $v$: uzunliklari $n-1$ ga teng massivlar – qo'shni shaharlar.
* $w$: uzunligi $n-1$ ga teng massiv – yo'ldan o'tish narxlari.
* Protsedura hech narsa qaytarmaydi.
* Bu protseduraga chaqiruv aynan bir marta, barcha `cheapest_meeting` chaqiruvlaridan oldin qilinadi.

```
int64 cheapest_meeting(int m, int[] t)
```
* $m$: jami ishchilar soni.
* $t$: uzunligi $m$ ga teng massiv – ishchilar yashaydigan shaharlar.
* Protsedura barcha $m$ ta ibschini ikki kishilik guruhlarga ajratib chiqish uchun minimal qancha pul kerakligini qaytarishi kerak.
* Bu protsedura aynan $q$ marta chaqiriladi.

## Example
Ushbu chaqiruvni ko'raylik:

```
init(8, [4, 2, 2, 3, 0, 1, 1],
        [5, 5, 7, 5, 6, 5, 4],
        [2, 3, 1, 1, 4, 2, 3])
```

Bu misolda Dadorlandtiria quyidagi ko'rinishda bo'ladi:
<img src="https://i.ibb.co/wQZCY0H/graph-tree.png" alt="graph-tree" border="0">

Aytaylik keyin quyidagi chaqiruv qilinsin:

```
cheapest_meeting(4, [1, 4, 0, 7])
```

Biz $1, 4, 0$ va $7$-raqamli shaharlarda yashovchi insonlarni $\frac{m}{2}=2$ ta juftlikka ajratishimiz kerak. 
- Birinchi juftlik $7$ va $4$ bo'lsin. Agarda ular $5$-shaharda uchrashishsa, jami $4+2=6$ dador dollari sarflashadi.
- Ikkinchi juftlik $1$ va $0$ shaharlar bo'lsin. Agarda ular $6$-shaharda uchrashishsa, jami $3+4=7$ dador dollari kerak.

Umumiy xarajat $6+7=13$ dador dollari. Protsedura $13$ qaytarishi kerak.

Yana bir chaqiruv ko'raylik:
```
cheapest_meeting(2, [4, 5])
```
Yagona juftligimiz $(4, 5)$. Agar ular $4$-shaharda uchrashishsa, umumiy xarajat $0+2=2$ dador dollari bo'ladi. Protsedura $2$ qaytarishi kerak.


## Constraints

$S_m$ bu barcha `cheapest_meeting` chaqiruvlaridagi $m$ qiymatlar yig'indisi bo'lsin.

* $1 \le n \le 200\;000$
* $1 \le q \le 200\;000$
* $0 \le u[i] \lt v[i] \le n - 1$, barcha $0 \le i \le n-2$ uchun.
* $1 \le w[i] \le 10^9$, barcha $0 \le i \le n-2$ uchun.
* $0 \le t[j] \le n-1$, barcha $0 \le j \le m-1$ uchun
* $2 \le S_m \le 500\;000$
* $m$ – juft son

Hech qaysi `cheapest_meeting` chaqiruvida $i \lt j$ uchun $t[i]=t[j]$ shart bajarilmaydi.
Dadorlandtiria mamlakatida ixtiyoriy shahardan boshqa hamma shaharlarga borish mumkinligi kafolatlanadi.

## Subtasks
1. (5 ball) $u[i] = i$, $v[i] = i + 1$, barcha $0 \le i \le n-2$ uchun
1. (11 ball) $m \le 6$, $q \le 50\;000$
1. (15 ball) $n \le 100$
1. (15 ball) $n \le 1000$
1. (21 ball) $q=1$, $m=n$
1. (33 ball) Qo'shimcha chegaralarsiz.

## Sample Grader

Namunaviy graderga ma'lumotlarni quyidagi tartibda kiriting:

* qator $1$: $n \; q$
* qator $2+k$ ($0 \le k \le n-2$): $u[k] \; v[k] \; w[k]$
* qator $1+n+k$ ($0 \le k \le q-1$): $m \; t[0] \; \ldots \; t[m-1]$

Namunaviy grader javobni quyidagi tartibda chiqaradi:

* qator $1+k$ ($0 \le k \le n-2$): `cheapest_meeting` protsedurasi qaytargan javob.
