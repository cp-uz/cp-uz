Sizga $0$ dan $n-1$ gacha raqamlangan, $0$-tugunda ildizlangan $n$ tugunli daraxt berilgan. Har bir $i$ tugun butun $a_i$ qiymatini saqlaydi.

Daraxtning bog'langan bo'lagini musbat $k$ butun son uchun $k$-yaxshi deymiz, agar quyidagi ikkala shart bajarilsa:

- bo'lakning har bir $(u, v)$ qirrasi uchun, bunda $u$ — $v$ ning otasi, $a_v = (a_u + 1) \bmod k$;

- bo'lakning har bir $v$ tuguni uchun $a_v < k$.

Har bir $k$ uchun narx $f(k)$ berilgan.

Siz daraxt qirralarining istalgan qism to'plamini kesishingiz mumkin; bu daraxtni bog'langan bo'laklar — o'rmonga — ajratadi. Hosil bo'lgan har bir bo'lak uchun shu bo'lak $k$-yaxshi bo'ladigan musbat $k$ ni tanlaysiz va uning $f(k)$ narxini to'laysiz. Umumiy narx barcha bo'laklar bo'yicha $f(k)$ larning yig'indisi. O'rmonning eng kichik mumkin bo'lgan umumiy narxini aniqlang.

### Amalga oshirish tafsilotlari

Siz quyidagi protsedurani amalga oshirishingiz kerak.

```cpp

long long min_cost(int n, vector<int> a, vector<int> f, vector<int> u, vector<int> v);
```

- `n`: tugunlar soni; ular $0$ dan $n-1$ gacha raqamlangan, $0$-tugun ildiz.

- `a`: uzunligi $n$ bo'lgan vektor; `a[i]` — $i$-tugunning qiymati.

- `f`: uzunligi $n$ bo'lgan vektor; $1 \le k \le n$ uchun `f[k - 1]` — $f(k)$ ning narxi.

- `u, v`: uzunligi $n-1$ bo'lgan vektorlar. Har bir $i$ uchun `u[i]` va `v[i]` tugunlar orasida qirra mavjud.

- Protsedura eng kichik mumkin bo'lgan umumiy narxni qaytarishi kerak.

- Bu protsedura aniq bir marta chaqiriladi.

### Cheklovlar

- $1 \le n \le 300\,000$

- Har bir $i$ uchun $0 \le a_i \le n-1$.

- Har bir $k$ uchun $1 \le f(k) \le 10^9$.

- $n-1$ ta qirra tugunlarni daraxtga bog'laydi.

### Qism masalalar

| Qism masala | Ball | Cheklovlar |
| --- | --- | --- |
| 1 | 12 | $n \le 5\,000$; daraxt zanjir va $0$-tugun uning bir uchi |
| 2 | 20 | daraxt zanjir va $0$-tugun uning bir uchi |
| 3 | 7 | $n \le 20$ |
| 4 | 22 | $n \le 5\,000$ |
| 5 | 39 | qo'shimcha cheklovlarsiz |

### Misol

$7$ tugunli quyidagi chaqiruvni ko'rib chiqaylik:

```cpp

min_cost(7, [2, 3, 0, 3, 2, 0, 0], [6, 8, 2, 9, 9, 9, 9], [0, 1, 0, 3, 4, 4], [1, 2, 3, 4, 5, 6]);
```

Qirralar: $0-1$, $1-2$, $0-3$, $3-4$, $4-5$, $4-6$. Optimal kesish faqat bitta $3-4$ qirrani olib tashlaydi va ikki bo'lakdan iborat o'rmon hosil bo'ladi:

- $\{0,1,2,3\}$ — $4$-yaxshi sifatida (qiymatlar $2,3,0,3$; har qirra bo'yicha qiymat $4$ moduli bo'yicha $1$ ga ortadi va hammasi $<4$), narxi $f(4)=9$;

- $\{4,5,6\}$ — $3$-yaxshi sifatida (qiymatlar $2,0,0$), narxi $f(3)=2$.

Umumiy narx $9+2=11$, bu eng kichigi, shuning uchun protsedura $11$ qaytaradi.

### Namunaviy grader

Namunaviy grader kirishni quyidagi formatda o'qiydi. Kirishda tugunlar $1$ dan $n$ gacha raqamlangan.

- 1-satr: `n`

- 2-satr: $n$ ta qiymat (ulardan $i$-nchisi — $a_i$)

- 3-satr: $n$ ta narx (ulardan $k$-nchisi — $f(k)$)

- keyingi $n-1$ satrning har biri: qirra bilan bog'langan ikki tugun

Namunaviy grader qirra satrlaridagi har bir tugun belgisidan $1$ ni ayiradi, $a_i$ qiymatlari va $f(k)$ narxlarini o'zgartirmaydi, `min_cost` ni chaqiradi va qaytarilgan qiymatni bitta satrda chop etadi.

## Namunalar

### 1-namuna

**Kirish:**

```text
7
2 3 0 3 2 0 0
6 8 2 9 9 9 9
1 2
2 3
1 4
4 5
5 6
5 7
```

**Chiqish:**

```text
11
```

### 2-namuna

**Kirish:**

```text
7
2 3 0 3 2 0 0
6 8 2 9 9 9 1
1 2
2 3
1 4
4 5
5 6
5 7
```

**Chiqish:**

```text
4
```

### 3-namuna

**Kirish:**

```text
8
2 0 1 2 0 0 0 3
2 3 4 2 9 8 7 6
1 2
2 3
3 4
4 5
5 6
6 7
7 8
```

**Chiqish:**

```text
8
```
