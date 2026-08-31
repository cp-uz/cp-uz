---
article_id: sequences--k-th
---
# $K$-tartibli statistikani $O(N)$ vaqtda topish

Hajmi $N$ bo‘lgan $A$ massiv va $K$ soni berilgan. Vazifa massivdagi $K$-eng katta sonni, ya’ni $K$-tartibli statistikani topishdan iborat.

Asosiy g‘oya tez saralash algoritmidagi bo‘lish usulidan foydalanishdir. Algoritmning o‘zi sodda; tez saralashdan farqli ravishda, uning o‘rtacha $O(N)$ vaqtda ishlashini isbotlash qiyinroq.

## Amalga oshirish (rekursiyasiz)

```cpp
template <class T>
T order_statistics (std::vector<T> a, unsigned n, unsigned k)
{
    using std::swap;
    for (unsigned l=1, r=n; ; )
    {
        if (r <= l+1)
        {
            // joriy qism hajmi 1 yoki 2, shuning uchun javobni topish oson
            if (r == l+1 && a[r] < a[l])
                swap (a[l], a[r]);
            return a[k];
        }

        // a[l], a[l+1], a[r] elementlarini tartiblaymiz
        unsigned mid = (l + r) >> 1;
        swap (a[mid], a[l+1]);
        if (a[l] > a[r])
            swap (a[l], a[r]);
        if (a[l+1] > a[r])
            swap (a[l+1], a[r]);
        if (a[l] > a[l+1])
            swap (a[l], a[l+1]);

        // bo‘lishni bajaramiz
        // tayanch a[l + 1], ya’ni a[l], a[l + 1], a[r] orasidagi mediana
        unsigned
            i = l+1,
            j = r;
        const T
            cur = a[l+1];
        for (;;)
        {
            while (a[++i] < cur) ;
            while (a[--j] > cur) ;
            if (i > j)
                break;
            swap (a[i], a[j]);
        }

        // tayanchni o‘z joyiga qo‘yamiz
        a[l+1] = a[j];
        a[j] = cur;

        // kerakli element bo‘lishi shart bo‘lgan qismdagina davom etamiz
        if (j >= k)
            r = j-1;
        if (j <= k)
            l = i;
    }
}
```

## Izohlar

* Yuqoridagi tasodifiylashtirilgan algoritm [Quickselect](https://en.wikipedia.org/wiki/Quickselect) deb ataladi. U ishonchli ishlashi uchun chaqirishdan oldin $A$ massivini tasodifiy aralashtirish yoki tayanch sifatida tasodifiy element tanlash kerak. Masalani chiziqli vaqtda yechadigan deterministik algoritmlar ham bor; masalan, [medianalar medianasi](https://en.wikipedia.org/wiki/Median_of_medians).
* C++ tilidagi [std::nth_element](https://en.cppreference.com/w/cpp/algorithm/nth_element) shu vazifani bajaradi, ammo GCC amalga oshirishining eng yomon holatdagi vaqti $O(n \log n)$ bo‘ladi.
* $K$ ta eng kichik elementni topish masalasini $K$-elementni topishga chiziqli qo‘shimcha ish bilan keltirish mumkin: ular aynan $K$-elementdan kichik elementlardir.

## Mashq masalalari

- [Leetcode: Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/description/)
- [CODECHEF: Median](https://www.codechef.com/problems/CD1IT1)
