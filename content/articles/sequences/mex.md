---
article_id: sequences--mex
---
# Ketma-ketlikning MEX qiymati (eng kichik mavjud bo‘lmagan son)

Hajmi $N$ bo‘lgan $A$ massiv berilgan. Massivda uchramaydigan eng kichik nomanfiy sonni topish kerak. Bu son odatda **MEX** (*minimal excluded*, ya’ni eng kichik chiqarib tashlangan son) deb ataladi.

$$
\begin{align}
\text{mex}(\{0, 1, 2, 4, 5\}) &= 3 \\
\text{mex}(\{0, 1, 2, 3, 4\}) &= 5 \\
\text{mex}(\{1, 2, 3, 4, 5\}) &= 0 \\
\end{align}
$$

Hajmi $N$ bo‘lgan massivning MEX qiymati hech qachon $N$ dan katta bo‘la olmaydi.

Eng sodda usul — $A$ massividagi barcha elementlardan to‘plam tuzish. Shunda biror son massivda bor-yo‘qligini tez tekshirish mumkin. Keyin $0$ dan $N$ gacha bo‘lgan sonlarni ko‘rib chiqamiz va to‘plamda yo‘q birinchi sonni qaytaramiz.

## Amalga oshirish

Quyidagi algoritm $O(N \log N)$ vaqtda ishlaydi.

```{.cpp file=mex_simple}
int mex(vector<int> const& A) {
    set<int> b(A.begin(), A.end());

    int result = 0;
    while (b.count(result))
        ++result;
    return result;
}
```

Agar MEX qiymatini $O(N)$ vaqtda hisoblash kerak bo‘lsa, `set` o‘rniga mantiqiy qiymatlar vektoridan foydalanish mumkin. Bu massivning hajmi kirish massivi olishi mumkin bo‘lgan eng katta hajmga teng bo‘lishi kerak.

```{.cpp file=mex_linear}
int mex(vector<int> const& A) {
    static bool used[MAX_N+1] = { 0 };

    // berilgan sonlarni belgilaymiz
    for (int x : A) {
        if (x <= MAX_N)
            used[x] = true;
    }

    // MEX qiymatini topamiz
    int result = 0;
    while (used[result])
        ++result;

    // massivni yana tozalaymiz
    for (int x : A) {
        if (x <= MAX_N)
            used[x] = false;
    }

    return result;
}
```

Bu usul tez, lekin MEX qiymatini faqat bir marta hisoblash kerak bo‘lgandagina yaxshi ishlaydi. Massiv o‘zgarib turgani sababli MEX’ni qayta-qayta hisoblash talab etilsa, bu usul samarasiz bo‘ladi. Bunday vaziyat uchun kuchliroq tuzilma kerak.

## Massiv yangilanishlarida MEX

Bu variantda massivdagi ayrim sonlar o‘zgartiriladi va har bir yangilanishdan so‘ng yangi MEX qiymatini hisoblash kerak.

Bunday so‘rovlarni samarali bajaradigan ma’lumotlar tuzilmasi zarur. Usullardan biri $0$ dan $N$ gacha bo‘lgan har bir sonning takrorlanish miqdorini saqlash va uning ustiga daraxtsimon tuzilma, masalan, segment daraxti yoki treap qurishdir. Har bir tugun sonlar oralig‘ini ifodalaydi va oraliqdagi umumiy takrorlanish miqdori bilan birga turli sonlar miqdorini ham saqlaydi.

Bu tuzilmani $O(\log N)$ vaqtda yangilash, MEX qiymatini ham ikkilik qidiruv yordamida $O(\log N)$ vaqtda topish mumkin. Agar $[0, \lfloor N/2 \rfloor)$ oralig‘iga mos tugunda $\lfloor N/2 \rfloor$ ta turli son bo‘lmasa, ulardan biri yo‘q va MEX $\lfloor N/2 \rfloor$ dan kichik; qidiruv daraxtning chap shoxida davom etadi. Aks holda MEX kamida $\lfloor N/2 \rfloor$ bo‘ladi va o‘ng shoxga o‘tiladi.

Standart kutubxonadagi `map` va `set` tuzilmalaridan ham foydalanish mumkin (bu yondashuv [shu izohda](https://codeforces.com/blog/entry/81287?#comment-677837) tushuntirilgan). `map` har bir sonning takrorlanish miqdorini, `set` esa ayni paytda massivda yo‘q sonlarni saqlaydi. `set` tartiblangan bo‘lgani uchun `*set.begin()` MEX qiymatini beradi. Jami $O(N \log N)$ oldindan hisoblashdan so‘ng MEX $O(1)$ vaqtda olinadi, yangilash esa $O(\log N)$ vaqtda bajariladi.

```{.cpp file=mex_updates}
class Mex {
private:
    map<int, int> frequency;
    set<int> missing_numbers;
    vector<int> A;

public:
    Mex(vector<int> const& A) : A(A) {
        for (int i = 0; i <= A.size(); i++)
            missing_numbers.insert(i);

        for (int x : A) {
            ++frequency[x];
            missing_numbers.erase(x);
        }
    }

    int mex() {
        return *missing_numbers.begin();
    }

    void update(int idx, int new_value) {
        if (--frequency[A[idx]] == 0)
            missing_numbers.insert(A[idx]);
        A[idx] = new_value;
        ++frequency[new_value];
        missing_numbers.erase(new_value);
    }
};
```

## Mashq masalalari

- [AtCoder: Neq Min](https://atcoder.jp/contests/hhkb2020/tasks/hhkb2020_c)
- [Codeforces: Informatics in MAC](https://codeforces.com/contest/1935/problem/B)
- [Codeforces: Replace by MEX](https://codeforces.com/contest/1375/problem/D)
- [Codeforces: Vitya and Strange Lesson](https://codeforces.com/problemset/problem/842/D)
- [Codeforces: MEX Queries](https://codeforces.com/contest/817/problem/F)
