Sardor — gladiatorlar jangining ashaddiy muxlisi. Yaqinda katta turnir o'tkaziladi, unda $1$ dan $N$ gacha raqamlangan $N$ ta gladiator qatnashadi. Yillar davomida Sardor turli statistikalar to'plab, gladiatorlarning uchta har xil qurol — qilich, nayza va trident bilan mahoratini aniqlagan. Aniqrog'i, har bir qurol uchun u gladiatorlar reytingini tuzgan, unda birinchisi o'sha qurol bilan eng mohiri, oxirgisi esa eng zaifi hisoblanadi.

Turnir quyidagi g'ayrioddiy tuzilishga ega: jami $N-1$ ta jang bo'lib o'tadi. Har bir jangda turnirdan hali chiqib ketmagan ikki gladiator uchrashib, uchta quroldan biri bilan jang qiladi; o'sha qurol bilan mohirroq bo'lgani g'olib chiqadi, mag'lub bo'lgani esa turnirdan chiqib ketadi. Barcha $N-1$ ta jangdan keyin yagona gladiator qoladi va u turnir g'olibi deb e'lon qilinadi.

O'yinlar tashkilotchisi sifatida Sardor har qanday natijani belgilashga qodir: har bir jang uchun u qaysi ikki gladiator va qaysi qurol bilan jang qilishini tanlaydi; yagona shart — ularning ikkalasi ham hali turnirdan chiqib ketmagan bo'lishi.

Vaqti-vaqti bilan Sardor o'z ma'lumotlarini yangilab turadi: biror qurol reytingida ikki gladiatorning o'rnini almashtiradi. Bundan tashqari, Sardorning do'stlari unga shunday savollar bilan murojaat qilishadi: “falon raqamli gladiator $X$ — mening shogirdim, uning turnirda g'olib chiqishiga umuman imkoniyat bormi?” Sardorga yordam berish uchun shunday dastur yozingki, u yangilanishlarni qo'llasin va do'st so'raganda o'sha paytdagi reytinglarga ko'ra javob bersin.

## Amalga oshirish tafsilotlari

Siz quyidagi protseduralarni amalga oshirishingiz kerak.

```cpp

void init(int n, vector<int> r1, vector<int> r2, vector<int> r3)
```

- `n`: gladiatorlar soni, $0$ dan $n-1$ gacha raqamlangan.

- `r1`, `r2`, `r3`: uzunligi $n$ bo'lgan vektorlar — mos ravishda qilich, nayza va trident bo'yicha reytinglar. Ularning har birida $0$-o'rinda eng mohir, $n-1$ o'rinda eng zaif gladiator turadi; ya'ni $j$ indeksdagi qiymat — o'sha reytingning $j$-o'rnidagi gladiator.

- Bu protsedura aynan bir marta, boshqa har qanday protseduradan oldin chaqiriladi.

```cpp

int can_win(int x)
```

- `x`: gladiator ($0 \le x \le n-1$).

- Bu protsedura, joriy reytinglar bilan gladiator `x` biror janglar tanlovida g'olib chiqa olsa $1$, aks holda $0$ qaytarishi kerak.

```cpp

void update(int p, int a, int b)
```

- `p`: qurol ($0 \le p \le 2$; $0$ — qilich, $1$ — nayza, $2$ — trident).

- `a`, `b`: ikkita har xil gladiator ($0 \le a,b \le n-1$, $a \ne b$).

- Bu protsedura `p` qurol reytingida `a` va `b` gladiatorlarning o'rinlarini almashtiradi.

`init` bir marta chaqirilgandan so'ng, `can_win` va `update` protseduralari ixtiyoriy tartibda aralash holda jami $q$ marta chaqiriladi.

## Cheklovlar

- $1 \le N,q \le 100\,000$

- Uchala reyting ham $0,1,\ldots,n-1$ sonlarning o'rin almashtirishi (permutatsiyasi).

- `update` ning har bir chaqiruvida $a \ne b$.

## Qism masalalar

| Qism masala | Ball | Cheklovlar |
| --- | --- | --- |
| 1 | 7 | $N \le 15$, $q \le 10$ |
| 2 | 11 | $N \le 1000$, $q \le 10$ |
| 3 | 12 | $q \le 10$ |
| 4 | 21 | `update` hech qachon chaqirilmaydi |
| 5 | 49 | qo'shimcha cheklovlarsiz |

## Misol

Faraz qilaylik, $4$ ta gladiator bor va reytinglar (1-asosli belgilar bilan) quyidagicha:

```cpp

qilich: 1 2 3 4
nayza:  2 1 3 4
trident: 2 4 3 1
```

Grader quyidagi chaqiruvni amalga oshiradi:

```cpp

init(4, [0, 1, 2, 3], [1, 0, 2, 3], [1, 3, 2, 0])
```

- `can_win(0)` $1$ qaytaradi: agar har bir jang qilich bilan o'tkazilsa, gladiator $0$ (eng mohir qilichboz) hammani yengadi, demak u g'olib chiqa oladi.

- `can_win(3)` $1$ qaytaradi: gladiator $3$ ham g'olib chiqa oladi — masalan, gladiator $2$ va $3$ trident bilan jang qiladi ($3$ yutadi), gladiator $0$ va $1$ qilich bilan jang qiladi ($0$ yutadi), so'ng gladiator $0$ va $3$ trident bilan jang qiladi ($3$ yutadi).

- `update(2, 0, 3)` trident reytingida $0$ va $3$ gladiatorlarni almashtiradi, natijada reyting $2,1,3,4$ bo'ladi (1-asosli belgilarda).

- `can_win(3)` endi $0$ qaytaradi: almashtirishdan keyin gladiator $3$ har bir qurol bilan eng zaif bo'lib qoladi, shuning uchun u boshqa g'olib chiqa olmaydi.

## Sample grader (namunaviy grader)

Namunaviy grader kiruvchi ma'lumotni quyidagi formatda o'qiydi. Kiruvchi ma'lumotda gladiatorlar $1$ dan $N$ gacha raqamlanadi.

- 1-qator: `N q`

- 2-qator: qilich reytingidagi $N$ ta gladiator, eng mohiridan eng zaifigacha

- 3-qator: nayza reytingi, xuddi shunday tartibda

- 4-qator: trident reytingi, xuddi shunday tartibda

- keyingi $q$ qatorning har biri bitta hodisani bildiradi:

- `1 X` — so'rov: gladiator `X` turnirda g'olib chiqa oladimi?

- `2 P A B` — yangilanish: `P` qurol reytingida `A` va `B` gladiatorlarni almashtirish (`P = 1` qilich, `P = 2` nayza, `P = 3` trident).

Namunaviy grader barcha belgilarni protseduralar ishlatadigan 0-asosli raqamlashga o'tkazadi (har biridan $1$ ayiradi), `init` ni uchta reyting bilan bir marta chaqiradi, so'ng hodisalarni tartibida qayta ishlaydi: har bir `1 X` uchun `can_win` noldan farqli qiymat qaytarsa `YES`, aks holda `NO` chop etadi (har biri alohida qatorda); har bir `2 P A B` uchun `update` ni chaqiradi.

## Namunalar

### 1-namuna

**Kirish:**

```text
4 4
1 2 3 4
2 1 3 4
2 4 3 1
1 1
1 4
2 3 1 4
1 4
```

**Chiqish:**

```text
YES
YES
NO
```

### 2-namuna

**Kirish:**

```text
6 7
4 6 1 5 3 2
5 1 4 2 6 3
4 6 1 5 2 3
1 2
2 2 4 5
1 1
2 2 4 5
2 2 5 6
1 2
1 1
```

**Chiqish:**

```text
YES
NO
NO
YES
```
