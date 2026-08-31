---
article_id: dynamic_programming--intro-to-dp
---
# Dinamik dasturlashga kirish

Dinamik dasturlashning mohiyati — bir xil hisob-kitobni qayta-qayta bajarmaslik. Dinamik dasturlash masalalari ko‘pincha tabiiy ravishda rekursiya yordamida yechiladi. Bunday hollarda avval rekursiv yechimni yozib, keyin takrorlanadigan holatlarning javoblarini qidiruv jadvalida saqlash eng oson yo‘ldir. Bu jarayon memoizatsiyali yuqoridan pastga dinamik dasturlash deb ataladi. Inglizchadagi “memoization” so‘zi “memo” — qayd yozish ma’nosidan kelib chiqqan; uni “memorization” — yodlash bilan adashtirmaslik kerak.

Bu jarayonning eng sodda va klassik misollaridan biri Fibonacci ketma-ketligidir. Uning rekursiv ta’rifi $n \ge 2$ uchun $f(n) = f(n-1) + f(n-2)$, boshlang‘ich qiymatlari esa $f(0)=0$ va $f(1)=1$. C++ da bu quyidagicha yoziladi:

```cpp
int f(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return f(n - 1) + f(n - 2);
}
```

Bu rekursiv funksiyaning ishlash vaqti eksponensial — taxminan $O(2^n)$, chunki bitta funksiya chaqiruvi, ya’ni $f(n)$, hajmi deyarli bir xil bo‘lgan ikkita chaqiruvni — $f(n-1)$ va $f(n-2)$ ni keltirib chiqaradi.

## Fibonacci hisobini dinamik dasturlash bilan tezlashtirish (memoizatsiya)

Hozirgi rekursiv funksiyamiz Fibonacci sonlarini eksponensial vaqtda hisoblaydi. Shu sababli masala haddan tashqari og‘irlashib ketishidan oldin faqat kichik kirish qiymatlarini qayta ishlay olamiz. Masalan, $f(29)$ ni hisoblash *1 milliondan ortiq* funksiya chaqiruviga olib keladi!

Tezlikni oshirish uchun kichik masalalar soni aslida atigi $O(n)$ ekanini payqaymiz. Haqiqatan ham, $f(n)$ ni hisoblash uchun bizga faqat $f(n-1),f(n-2), \dots ,f(0)$ qiymatlari kerak. Demak, bu kichik masalalarni qayta-qayta hisoblash o‘rniga ularning har birini bir marta yechamiz va natijasini qidiruv jadvalida saqlaymiz. Keyingi chaqiruvlar shu jadvaldan foydalanib natijani darhol qaytaradi va eksponensial miqdordagi ortiqcha ish yo‘qoladi.

Har bir rekursiv chaqiruv qiymat avval hisoblangan-hisoblanmaganini qidiruv jadvalidan tekshiradi. Bu $O(1)$ vaqtda bajariladi. Agar qiymat oldin hisoblangan bo‘lsa, natijani qaytaramiz; aks holda funksiyani odatdagi usulda hisoblaymiz. Umumiy ishlash vaqti $O(n)$ bo‘ladi. Bu avvalgi eksponensial algoritmga nisbatan juda katta yaxshilanishdir.

```cpp
const int MAXN = 100;
bool found[MAXN];
int memo[MAXN];

int f(int n) {
    if (found[n]) return memo[n];
    if (n == 0) return 0;
    if (n == 1) return 1;

    found[n] = true;
    return memo[n] = f(n - 1) + f(n - 2);
}
```

Yangi memoizatsiyali rekursiv funksiyada avval *1 milliondan ortiq chaqiruv* talab qilgan $f(29)$ endi *atigi 57 ta* chaqiruv bilan hisoblanadi — funksiya chaqiruvlari soni qariyb *20 000 baravar* kamayadi. Qizig‘i shundaki, endi bizni algoritm emas, ma’lumot turi cheklaydi: $f(46)$ — ishorali 32 bitli butun songa sig‘adigan oxirgi Fibonacci soni.

Odatda, imkon bo‘lsa, holatlarni massivda saqlashga harakat qilamiz, chunki juda kichik qo‘shimcha xarajat bilan qidiruv vaqti $O(1)$ bo‘ladi. Biroq umumiy holda holatlarni istalgan usulda saqlash mumkin. Masalan, ikkilik qidiruv daraxtidan (C++ dagi `map`) yoki hash-jadvaldan (C++ dagi `unordered_map`) foydalanish mumkin.

Masalan:

```cpp
unordered_map<int, int> memo;
int f(int n) {
    if (memo.count(n)) return memo[n];
    if (n == 0) return 0;
    if (n == 1) return 1;

    return memo[n] = f(n - 1) + f(n - 2);
}
```

Yoki xuddi shunga o‘xshash:

```cpp
map<int, int> memo;
int f(int n) {
    if (memo.count(n)) return memo[n];
    if (n == 0) return 0;
    if (n == 1) return 1;

    return memo[n] = f(n - 1) + f(n - 2);
}
```

Umumiy memoizatsiyali rekursiv funksiya uchun bu ikki variant deyarli har doim massivga asoslangan variantdan sekinroq bo‘ladi. Holatning bir qismi sifatida vektor yoki satrlarni saqlash kerak bo‘lganda, bunday muqobil usullar ayniqsa foydalidir.

Memoizatsiyali rekursiv funksiyaning ishlash vaqtini sodda usulda quyidagicha tahlil qilish mumkin:

$$\text{work per subproblem} * \text{number of subproblems}$$

Holatlarni ikkilik qidiruv daraxtida, ya’ni C++ dagi `map` da saqlash texnik jihatdan $O(n \log n)$ vaqt beradi: har bir qidiruv va qo‘shish $O(\log n)$ ish talab qiladi, noyob kichik masalalar soni esa $O(n)$ ta.

Bu yondashuv yuqoridan pastga deb ataladi: funksiyani so‘ralgan qiymat bilan chaqiramiz, hisoblash yuqoridan — so‘rov qiymatidan — pastga, rekursiyaning bazaviy holatlariga qarab boradi va yo‘lda memoizatsiya yordamida qisqa yo‘llardan foydalanadi.

## Pastdan yuqoriga dinamik dasturlash

Hozirgacha faqat memoizatsiyali yuqoridan pastga dinamik dasturlashni ko‘rdik. Biroq masalalarni pastdan yuqoriga dinamik dasturlash bilan ham yechish mumkin. Pastdan yuqoriga yondashuv yuqoridan pastga yondashuvning aksi: hisoblash rekursiyaning bazaviy holatlaridan boshlanadi va tobora kattaroq qiymatlarga kengaytiriladi.

Fibonacci sonlari uchun pastdan yuqoriga yechim yaratish maqsadida bazaviy holatlarni massivda boshlang‘ich qiymatlar bilan to‘ldiramiz. Keyin rekursiv ta’rifni massiv elementlariga qo‘llaymiz:

```cpp
const int MAXN = 100;
int fib[MAXN];

int f(int n) {
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i <= n; i++) fib[i] = fib[i - 1] + fib[i - 2];

    return fib[n];
}
```

Albatta, bu ko‘rinish ikki sababga ko‘ra biroz noqulay. Birinchidan, funksiyani bir necha marta chaqirsak, bir xil ishni takrorlaymiz. Ikkinchidan, joriy elementni hisoblash uchun faqat oldingi ikkita qiymat kerak. Shuning uchun xotirani $O(n)$ dan $O(1)$ gacha kamaytirish mumkin.

$O(1)$ xotiradan foydalanadigan Fibonacci uchun pastdan yuqoriga dinamik dasturlash yechimi quyidagicha bo‘lishi mumkin:

```cpp
const int MAX_SAVE = 3;
int fib[MAX_SAVE];

int f(int n) {
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i <= n; i++)
        fib[i % MAX_SAVE] = fib[(i - 1) % MAX_SAVE] + fib[(i - 2) % MAX_SAVE];

    return fib[n % MAX_SAVE];
}
```

E’tibor bering, doimiy qiymatni `MAXN` dan `MAX_SAVE` ga o‘zgartirdik. Sababi biz murojaat qilishimiz kerak bo‘lgan elementlarning umumiy soni atigi 3 ta. Bu son endi kirish hajmi bilan o‘smaydi va ta’rifga ko‘ra $O(1)$ xotira sarflanadi. Bundan tashqari, faqat kerakli qiymatlarni saqlash uchun keng tarqalgan usul — qoldiq olish operatoridan foydalanamiz.

Dinamik dasturlashning asoslari shundan iborat: oldin bajargan ishingizni takrorlamang.

Dinamik dasturlashni yaxshiroq o‘rganish usullaridan biri — klassik misollarni o‘rganishdir.

## Klassik dinamik dasturlash masalalari
| Nomi                                           | Tavsif/misol                                                                                                                                                                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [0-1 ryukzak](../dynamic_programming/knapsack.md)                                   | Vaznlari $w_i$, qiymatlari $v_i$ bo‘lgan $N$ ta buyum va maksimal vazni $W$ bo‘lgan ryukzak berilgan. $1 \le k \le N$ bo‘lganda, $\sum_{i=1}^{k} w_i \le W$ shartini saqlagan holda buyumlarning $k$ elementli qism to‘plami uchun $\sum_{i=1}^{k} v_i$ ning eng katta qiymatini toping.                  |
| Qism to‘plam yig‘indisi                                     | $N$ ta butun son va $T$ berilgan. Berilgan to‘plamda elementlari yig‘indisi $T$ ga teng qism to‘plam mavjudligini aniqlang.                                                                                                         |
| [Eng uzun o‘suvchi qism ketma-ketlik (LIS)](../dynamic_programming/longest_increasing_subsequence.md)           | $N$ ta butun sondan iborat massiv berilgan. Massivdagi har bir keyingi elementi oldingisidan katta bo‘lgan eng uzun qism ketma-ketlikni toping.                                                       |
| Ikki o‘lchamli massivdagi yo‘llarni sanash                   | $N$ va $M$ berilgan. Har bir qadam $(i,j)$ dan $(i+1,j)$ yoki $(i,j+1)$ ga o‘tishdan iborat bo‘lsa, $(1,1)$ dan $(N, M)$ gacha bo‘lgan barcha turli yo‘llar sonini toping.                                                                               |
| Eng uzun umumiy qism ketma-ketlik                     | $s$ va $t$ satrlari berilgan. Ikkala satrning ham qism ketma-ketligi bo‘lgan eng uzun satr uzunligini toping.                                                                                                            |
| Yo‘naltirilgan asiklik grafdagi eng uzun yo‘l | Yo‘naltirilgan asiklik grafda (DAG) eng uzun yo‘lni topish.                                                                                                                                                                      |
| Eng uzun palindrom qism ketma-ketlik                | Berilgan satrning eng uzun palindrom qism ketma-ketligini (LPS) topish.                                                                                                                                                           |
| Tayoqni kesish                                    | Uzunligi $n$ birlik bo‘lgan tayoq va `cuts[i]` kesish nuqtasini bildiradigan butun sonlar massivi berilgan. Bitta kesish narxi kesilayotgan tayoq bo‘lagining uzunligiga teng. Barcha kesishlarning eng kichik umumiy narxini toping. |
| Tahrirlash masofasi                                  | Ikki satr orasidagi tahrirlash masofasi — bir satrni ikkinchisiga aylantirish uchun zarur bo‘lgan amallar sonining minimumi. Amallar: qo‘shish, o‘chirish va almashtirish.                                                         |

## Bog‘liq mavzular
* [Bitmaskli dinamik dasturlash](../dynamic_programming/profile-dynamics.md)
* Raqamlar bo‘yicha dinamik dasturlash
* Daraxtlarda dinamik dasturlash

Albatta, eng muhim usul — amaliyot qilish.

## Amaliy masalalar
* [LeetCode - 1137. N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/description/)
* [LeetCode - 118. Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/description/)
* [LeetCode - 1025. Divisor Game](https://leetcode.com/problems/divisor-game/description/)
* [Codeforces - Vacations](https://codeforces.com/problemset/problem/699/C)
* [Codeforces - Hard problem](https://codeforces.com/problemset/problem/706/C)
* [Codeforces - Zuma](https://codeforces.com/problemset/problem/607/b)
* [LeetCode - 221. Maximal Square](https://leetcode.com/problems/maximal-square/description/)
* [LeetCode - 1039. Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/description/)

## DP musobaqalari
* [Atcoder - Educational DP Contest](https://atcoder.jp/contests/dp/tasks)
* [CSES - Dynamic Programming](https://cses.fi/problemset/list/)

