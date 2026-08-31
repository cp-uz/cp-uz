---
article_id: combinatorics--generating_combinations
---
# Barcha $K$-kombinatsiyalarni hosil qilish

Ushbu maqolada barcha $K$-kombinatsiyalarni hosil qilish masalasini muhokama qilamiz.
$N$ va $K$ natural sonlari hamda $1$ dan $N$ gacha bo‘lgan sonlar to‘plami berilgan.
Vazifa — **o‘lchami $K$ bo‘lgan barcha qism to‘plamlarni** hosil qilish.

## Keyingi leksikografik $K$-kombinatsiyani hosil qilish {data-toc-label="Keyingi leksikografik K-kombinatsiyani hosil qilish"}

Avval kombinatsiyalarni leksikografik tartibda hosil qilamiz.
Buning algoritmi sodda. Birinchi kombinatsiya ${1, 2, ..., K}$ bo‘ladi. Endi undan leksikografik tartibda darhol keyin keladigan kombinatsiyani qanday topishni ko‘ramiz. Buning uchun joriy kombinatsiyani ko‘rib chiqib, hali o‘zining eng katta mumkin bo‘lgan qiymatiga yetmagan eng o‘ng elementni topamiz. Bu elementni topgach, uni $1$ ga oshiramiz va undan keyingi barcha elementlarga ruxsat etilgan eng kichik qiymatlarni beramiz.

```{.cpp file=next_combination}
bool next_combination(vector<int>& a, int n) {
    int k = (int)a.size();
    for (int i = k - 1; i >= 0; i--) {
        if (a[i] < n - k + i + 1) {
            a[i]++;
            for (int j = i + 1; j < k; j++)
                a[j] = a[j - 1] + 1;
            return true;
        }
    }
    return false;
}
```

## Qo‘shni kombinatsiyalar bitta element bilan farq qiladigan barcha $K$-kombinatsiyalarni hosil qilish {data-toc-label="Qo‘shni kombinatsiyalar bitta element bilan farq qiladigan barcha K-kombinatsiyalarni hosil qilish"}

Bu safar barcha $K$-kombinatsiyalarni shunday tartibda hosil qilmoqchimizki, qo‘shni kombinatsiyalar aynan bitta element bilan farq qilsin.

Buni [Gray kodi](../algebra/gray-code.md) yordamida yechish mumkin:
har bir qism to‘plamga bitmaska mos qo‘ysak, ushbu bitmaskalarni Gray kodlari tartibida hosil qilib va ko‘rib chiqib, kerakli javobni olishimiz mumkin.

$K$-kombinatsiyalarni hosil qilish masalasini Gray kodlari yordamida boshqacha ham yechish mumkin:
$0$ dan $2^N-1$ gacha bo‘lgan sonlar uchun Gray kodlarini hosil qilib, tarkibida aynan $K$ ta `1` bo‘lgan kodlarnigina qoldiramiz.
Ajablanarli jihati shundaki, hosil bo‘lgan, $K$ ta yoqilgan bitga ega maskalar ketma-ketligida istalgan ikkita qo‘shni maska — birinchi va oxirgi maska ham siklik ma’noda qo‘shni hisoblanadi — aynan ikkita bit bilan farq qiladi. Bu aynan bizga kerak bo‘lgan o‘zgarishdir: bitta sonni olib tashlash va bitta sonni qo‘shish.

Buni isbotlaymiz.

Isbot uchun $G(N)$ ketma-ketlikni ($N$-Gray kodini ifodalovchi ketma-ketlikni) quyidagicha olish mumkinligini eslaymiz:

$$G(N) = 0G(N-1) \cup 1G(N-1)^\text{R}$$

Ya’ni $N-1$ uchun Gray kodlari ketma-ketligini olib, har bir hadning boshiga `0` qo‘yamiz. So‘ng $N-1$ uchun Gray kodlari ketma-ketligini teskari tartibda olib, har bir maskaning boshiga `1` qo‘yamiz va bu ikki ketma-ketlikni birlashtiramiz.

Endi isbotni keltirishimiz mumkin.

Avval birinchi va oxirgi maskalar aynan ikkita bitda farq qilishini isbotlaymiz. Buning uchun $G(N)$ ketma-ketligining birinchi maskasi $N-K$ ta `0` va ulardan keyin $K$ ta `1` dan iborat bo‘lishini qayd etish kifoya. Ya’ni uning birinchi biti `0`, undan keyin $(N-K-1)$ ta `0`, so‘ng $K$ ta yoqilgan bit keladi. Oxirgi maska esa `1`, undan keyin $(N-K)$ ta `0` va so‘ng $K-1$ ta `1` ko‘rinishida bo‘ladi.
Matematik induksiya prinsipini va $G(N)$ formulasini qo‘llash isbotni yakunlaydi.

Endi istalgan ikkita qo‘shni kod ham aynan ikkita bitda farq qilishini ko‘rsatishimiz kerak. Buni Gray kodlarini hosil qilishning rekursiv tenglamasini ko‘rib chiqish orqali amalga oshirish mumkin. $G(N-1)$ dan tuzilgan ikki yarimning ichida tasdiq to‘g‘ri deb faraz qilamiz. Endi ushbu ikki yarim birlashtiriladigan chegarada hosil bo‘lgan yangi qo‘shni juft ham to‘g‘ri ekanini, ya’ni ular aynan ikkita bitda farq qilishini isbotlashimiz kerak.

Buni birinchi yarimning oxirgi maskasi va ikkinchi yarimning birinchi maskasi ma’lum bo‘lgani uchun qilish mumkin. Birinchi yarimning oxirgi maskasi `1`, undan keyin $(N-K-1)$ ta `0`, so‘ng $K-1$ ta `1` ko‘rinishida bo‘ladi. Ikkinchi yarimning birinchi maskasi esa `0`, undan keyin $(N-K-2)$ ta `0` va so‘ng $K$ ta `1` ko‘rinishida bo‘ladi. Demak, bu ikki maskani taqqoslaganda aynan ikkita farqli bitni topamiz.

Quyida barcha $2^n$ ta mumkin bo‘lgan qism to‘plamni hosil qilib, o‘lchami $K$ bo‘lganlarini tanlaydigan sodda amalga oshirish keltirilgan.

```{.cpp file=generate_all_combinations_naive}
int gray_code (int n) {
    return n ^ (n >> 1);
}

int count_bits (int n) {
    int res = 0;
    for (; n; n >>= 1)
        res += n & 1;
    return res;
}

void all_combinations (int n, int k) {
    for (int i = 0; i < (1 << n); i++) {
        int cur = gray_code (i);
        if (count_bits(cur) == k) {
            for (int j = 0; j < n; j++) {
                if (cur & (1 << j))
                    cout << j + 1;
            }
            cout << "\n";
        }
    }
}
```

Faqat yaroqli kombinatsiyalarni quradigan va shu sababli $O\left(N \cdot \binom{N}{K}\right)$ vaqtda ishlaydigan samaraliroq amalga oshirish ham mavjudligini aytib o‘tish lozim. Biroq u rekursiv bo‘lib, $N$ ning kichik qiymatlarida oldingi yechimga qaraganda kattaroq doimiy ko‘paytuvchiga ega bo‘lishi mumkin.

Amalga oshirish quyidagi formuladan kelib chiqadi:

$$G(N, K) = 0G(N-1, K) \cup 1G(N-1, K-1)^\text{R}$$

Bu formula Gray kodini aniqlovchi umumiy tenglamani o‘zgartirish orqali olinadi va mos elementlardan qism ketma-ketlikni tanlash orqali ishlaydi.

Uning amalga oshirilishi quyidagicha:

```{.cpp file=generate_all_combinations_fast}
vector<int> ans;

void gen(int n, int k, int idx, bool rev) {
    if (k > n || k < 0)
        return;

    if (!n) {
        for (int i = 0; i < idx; ++i) {
            if (ans[i])
                cout << i + 1;
        }
        cout << "\n";
        return;
    }

    ans[idx] = rev;
    gen(n - 1, k - rev, idx + 1, false);
    ans[idx] = !rev;
    gen(n - 1, k - !rev, idx + 1, true);
}

void all_combinations(int n, int k) {
    ans.resize(n);
    gen(n, k, 0, false);
}
```

