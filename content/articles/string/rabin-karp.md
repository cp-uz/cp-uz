---
article_id: string--rabin-karp
---
# Satrda andozani qidirish uchun Rabin–Karp algoritmi

Bu algoritm xeshlash tushunchasiga asoslanadi. Shu sababli satrlarni xeshlash bilan tanish bo‘lmasangiz, avval [satrlarni xeshlash](string-hashing.md) maqolasini o‘qing.
 
Ushbu algoritm Rabin va Karp tomonidan 1987-yilda ishlab chiqilgan.

Masala: ikkita satr — $s$ andoza va $t$ matn berilgan. Andoza matnda uchrashadimi-yo‘qmi aniqlash va uchrasa, uning barcha uchrashish joylarini $O(|s| + |t|)$ vaqtda sanab chiqish talab etiladi.

Algoritm: avval $s$ andozaning xeshini hisoblaymiz.
$t$ matnning barcha prefikslari uchun xesh qiymatlarini hisoblaymiz.
Endi hisoblangan xeshlar yordamida uzunligi $|s|$ bo‘lgan istalgan qism satrni $s$ bilan o‘zgarmas vaqtda taqqoslay olamiz.
Shuning uchun uzunligi $|s|$ bo‘lgan har bir qism satrni andoza bilan taqqoslaymiz. Bunga jami $O(|t|)$ vaqt ketadi.
Demak, algoritmning yakuniy murakkabligi $O(|t| + |s|)$: andoza xeshini hisoblash uchun $O(|s|)$ va uzunligi $|s|$ bo‘lgan barcha qism satrlarni andoza bilan taqqoslash uchun $O(|t|)$ vaqt kerak bo‘ladi.

## Implementatsiya
```{.cpp file=rabin_karp}
vector<int> rabin_karp(string const& s, string const& t) {
    const int p = 31; 
    const int m = 1e9 + 9;
    int S = s.size(), T = t.size();

    vector<long long> p_pow(max(S, T)); 
    p_pow[0] = 1; 
    for (int i = 1; i < (int)p_pow.size(); i++) 
        p_pow[i] = (p_pow[i-1] * p) % m;

    vector<long long> h(T + 1, 0); 
    for (int i = 0; i < T; i++)
        h[i+1] = (h[i] + (t[i] - 'a' + 1) * p_pow[i]) % m; 
    long long h_s = 0; 
    for (int i = 0; i < S; i++) 
        h_s = (h_s + (s[i] - 'a' + 1) * p_pow[i]) % m; 

    vector<int> occurrences;
    for (int i = 0; i + S - 1 < T; i++) {
        long long cur_h = (h[i+S] + m - h[i]) % m;
        if (cur_h == h_s * p_pow[i] % m)
            occurrences.push_back(i);
    }
    return occurrences;
}
```

## Amaliy masalalar

* [SPOJ - Pattern Find](http://www.spoj.com/problems/NAJPF/)
* [Codeforces - Good Substrings](http://codeforces.com/problemset/problem/271/D)
* [Codeforces - Palindromic characteristics](https://codeforces.com/problemset/problem/835/D)
* [Leetcode - Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/)

