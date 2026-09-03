> Bu dastur ikki marta alohida ishga tushiriladigan masala. Ikki ishga tushirish orasida global xotira saqlanmaydi; ma’lumotni faqat chiroqlar holatida kodlash mumkin.

$n$ ta uy yo‘llar bilan daraxt shaklida ulangan. Uylar $0$ dan $n-1$ gacha raqamlangan, har bir uy darajasi ko‘pi bilan $3$. $i$-uydagi chiroqning boshlang‘ich holati $a_i\in\{0,1\}$ va sirli uy $s$ berilgan.

## Birinchi ishga tushirish

Siz daraxtni, $a$ massivini va $s$ ni bilasiz. Ayrim chiroqlarni yoqish yoki o‘chirish orqali yakuniy $b$ holatini tanlaysiz:

```cpp
vector<bool> FirstRun(
    int n,
    vector<pair<int, int>> edges,
    vector<bool> a,
    int s
);
```

Keyin uylar noma’lum $p$ permutatsiyasi bilan qayta raqamlanadi. Eski $v$ uy yangi $p(v)$ raqamni oladi; yo‘llar ham xuddi shu tarzda qayta nomlanadi va $c_{p(v)}=b_v$ bo‘ladi.

## Ikkinchi ishga tushirish

Siz faqat qayta raqamlangan daraxt va $c$ holatlarini olasiz. Sirli uyning yangi raqami $p(s)$ ni qaytaring:

```cpp
int SecondRun(
    int n,
    vector<pair<int, int>> edges,
    vector<bool> c
);
```

## Chegaralar

- $1\le n\le2\cdot10^5$;
- $n$ toq;
- graf daraxt;
- har bir uchning darajasi ko‘pi bilan $3$.

## Baholash

Yechim `SecondRun` doim to‘g‘ri uy raqamini qaytarsa, to‘g‘ri hisoblanadi. Birinchi bosqichda holati o‘zgartirilgan chiroqlar soni

$$
K=|\{i\mid a_i\ne b_i\}|
$$

bo‘lsin. Ball testlar bo‘yicha $K$ ning eng katta qiymatiga bog‘liq: qancha kam chiroq o‘zgartirilsa, natija shuncha yuqori. Aniq ball formulasi, sample grader va til shablonlari rasmiy PDFdagi paketda berilgan.
