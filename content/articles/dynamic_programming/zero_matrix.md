---
article_id: dynamic_programming--zero_matrix
---
# Eng katta nollardan iborat ostmatritsani topish

`n` ta qator va `m` ta ustundan iborat matritsa berilgan. Faqat nollardan tashkil topgan eng katta ostmatritsani toping. Ostmatritsa deganda matritsaning to‘g‘ri to‘rtburchak shaklidagi sohasi tushuniladi.

## Algoritm

Matritsa elementlarini `a[i][j]` deb belgilaymiz; bu yerda `i = 0...n - 1`, `j = 0... m - 1`. Soddalik uchun noldan farqli barcha elementlarni `1` ga teng deb hisoblaymiz.

### 1-qadam: yordamchi dinamika

Avval quyidagi yordamchi qiymatlarni hisoblaymiz: `d[i][j]` — `a[i][j]` katagining tepasida 1 joylashgan eng yaqin qator. Aniqroq aytganda, `d[i][j]` — `j`-ustunda elementi `1` ga teng bo‘lgan, `0` dan `i - 1` gacha bo‘lgan eng katta qator raqami.

Matritsani yuqori chap burchakdan pastki o‘ng burchakka qarab ko‘rib chiqayotganimizda, `i`-qatorda turgan paytimiz avvalgi qator qiymatlarini bilamiz. Shu sababli faqat qiymati 1 bo‘lgan elementlar uchun ma’lumotni yangilash kifoya. Keyingi algoritmda matritsani qatorlar bo‘yicha qayta ishlaganimiz va faqat joriy qator qiymatlari kerak bo‘lgani sababli, qiymatlarni oddiy `d[i]`, `i = 1...m - 1` massivida saqlashimiz mumkin.

```cpp
vector<int> d(m, -1);
for (int i = 0; i < n; ++i) {
    for (int j = 0; j < m; ++j) {
        if (a[i][j] == 1) {
            d[j] = i;
        }
    }
}
```

### 2-qadam: masalani yechish

Qatorlarni ko‘rib chiqib, ostmatritsaning barcha mumkin bo‘lgan chap va o‘ng chegaralarini sinash orqali masalani $O(n m^2)$ vaqtda yechish mumkin. To‘g‘ri to‘rtburchakning pastki chegarasi joriy qator bo‘ladi, yuqori chegarani esa `d[i][j]` yordamida topamiz. Ammo bundan ham yaxshiroq natijaga erishib, yechim murakkabligini sezilarli darajada kamaytirish mumkin.

Kerakli nollardan iborat ostmatritsa to‘rt tomondan uni kengaytirishga va javobni yaxshilashga to‘sqinlik qiluvchi birlar bilan chegaralangan bo‘lishi ravshan. Shuning uchun quyidagicha ish tutsak, javobni o‘tkazib yubormaymiz: `i`-qatorning har bir `j` katagi uchun — bu ehtimoliy nolli ostmatritsaning pastki qatori — `d[i][j]` ni joriy ostmatritsaning yuqori chegarasi deb olamiz. Endi uning optimal chap va o‘ng chegaralarini aniqlash, ya’ni ostmatritsani `j`-ustundan imkon qadar chapga va o‘ngga kengaytirish qoladi.

Imkon qadar chapga kengaytirish nimani anglatadi? `d[i][k1] > d[i][j]` shartini qanoatlantiradigan indeksni topish kerak. Ya’ni `k1` — `j` indeksining chap tomonida unga eng yaqin indeks. Bu yerda `k1` `j` dan chapda joylashadi. Shunda `k1 + 1` kerakli nolli ostmatritsaning chap ustuni bo‘ladi. Agar bunday indeks umuman mavjud bo‘lmasa, `k1` ni `-1` ga teng deb olamiz. Bu joriy nolli ostmatritsani chapga, `a` matritsasining chegarasigacha kengaytira olganimizni anglatadi.

Xuddi shunday, o‘ng chegara uchun `k2` indeksini aniqlaymiz: bu `j` ning o‘ng tomonidagi, `d[i][k2] > d[i][j]` shartini qanoatlantiruvchi eng yaqin indeks. Agar bunday indeks bo‘lmasa, `k2 = m` deb olamiz.

Demak, `k1` va `k2` indekslarini samarali topa olsak, joriy nolli ostmatritsa haqidagi barcha zarur ma’lumotga ega bo‘lamiz. Xususan, uning yuzi `(i - d[i][j]) * (k2 - k1 - 1)` ga teng bo‘ladi.

`i` va `j` belgilanganida `k1` va `k2` indekslarini qanday samarali topish mumkin? Buni amortizatsiyalangan $O(1)$ vaqtda bajarish mumkin.

Bunday murakkablikka erishish uchun stekdan quyidagicha foydalanamiz. Avval `k1` indeksini topishni o‘rganamiz va joriy `i` qatoridagi har bir `j` uchun uning qiymatini `d1[i][j]` da saqlaymiz. Buning uchun ustunlarni chapdan o‘ngga ko‘rib chiqamiz va stekda faqat `d[][]` qiymati `d[i][j]` dan qat’iy katta bo‘lgan ustunlarni saqlaymiz. `j` ustundan keyingi ustunga o‘tayotganda stek tarkibini yangilash kerakligi ravshan. Stek tepasidagi element mos kelmasa, ya’ni `d[][] <= d[i][j]` bo‘lsa, uni stekdan chiqaramiz. Elementlarni faqat stekning tepasidan olib tashlash kifoya: stekdagi ustunlarning `d` qiymatlari o‘suvchi ketma-ketlik hosil qiladi.

Har bir `j` uchun `d1[i][j]` qiymati ayni paytda stek tepasida turgan qiymatga teng bo‘ladi.

`k2` indekslarini topish uchun `d2[i][j]` dinamikasi xuddi shunday hisoblanadi, faqat ustunlar o‘ngdan chapga ko‘rib chiqiladi.

Har bir qatorda stekka aniq `m` ta element qo‘shiladi, demak undan chiqarishlar soni ham `m` dan oshmaydi. Shu sababli jami murakkablik chiziqli bo‘lib, algoritmning yakuniy vaqt murakkabligi $O(nm)$ ga teng.

Shuningdek, kirish ma’lumotlari — `a[][]` matritsasi — hisobga olinmasa, algoritm $O(m)$ xotira sarflashini ta’kidlash kerak.

### Implementatsiya

```cpp
int zero_matrix(vector<vector<int>> a) {
    int n = a.size();
    int m = a[0].size();

    int ans = 0;
    vector<int> d(m, -1), d1(m), d2(m);
    stack<int> st;
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            if (a[i][j] == 1)
                d[j] = i;
        }

        for (int j = 0; j < m; ++j) {
            while (!st.empty() && d[st.top()] <= d[j])
                st.pop();
            d1[j] = st.empty() ? -1 : st.top();
            st.push(j);
        }
        while (!st.empty())
            st.pop();

        for (int j = m - 1; j >= 0; --j) {
            while (!st.empty() && d[st.top()] <= d[j])
                st.pop();
            d2[j] = st.empty() ? m : st.top();
            st.push(j);
        }
        while (!st.empty())
            st.pop();

        for (int j = 0; j < m; ++j)
            ans = max(ans, (i - d[j]) * (d2[j] - d1[j] - 1));
    }
    return ans;
}
```

