---
article_id: combinatorics--bracket_sequences
---
# Muvozanatlangan qavslar ketma-ketliklari

**Muvozanatlangan qavslar ketma-ketligi** — faqat qavslardan iborat shunday satrki, unga mos sonlar va matematik amallarni qo‘shish orqali to‘g‘ri matematik ifoda hosil qilish mumkin.

Uni formal ravishda quyidagicha ta’riflash mumkin:

- $e$, ya’ni bo‘sh satr, muvozanatlangan qavslar ketma-ketligidir.
- Agar $s$ muvozanatlangan qavslar ketma-ketligi bo‘lsa, $(s)$ ham shunday ketma-ketlikdir.
- Agar $s$ va $t$ muvozanatlangan qavslar ketma-ketliklari bo‘lsa, $st$ ham shunday ketma-ketlikdir.

Masalan, `(())()` muvozanatlangan qavslar ketma-ketligi, ammo `())(` muvozanatlangan emas.

Xuddi shunday usulda bir nechta turdagi qavslardan tuzilgan ketma-ketliklarni ham ta’riflash mumkin.

Ushbu maqolada muvozanatlangan qavslar ketma-ketliklariga oid bir nechta klassik masalani ko‘rib chiqamiz. Keyingi o‘rinlarda ularni qisqacha **ketma-ketliklar** deb ataymiz. Ko‘riladigan masalalar:

- ketma-ketlikning to‘g‘riligini tekshirish;
- ketma-ketliklar sonini hisoblash;
- leksikografik tartibdagi keyingi ketma-ketlikni topish;
- berilgan o‘lchamdagi barcha ketma-ketliklarni hosil qilish;
- ketma-ketlik indeksini topish;
- $k$-ketma-ketlikni hosil qilish.

Har bir masalaning faqat bitta turdagi qavsga ruxsat berilgan sodda ko‘rinishi va bir nechta turdagi qavsga ruxsat berilgan murakkabroq ko‘rinishini muhokama qilamiz.

## Muvozanatni tekshirish

Berilgan satr muvozanatlangan yoki yo‘qligini tekshirmoqchimiz.

Avval faqat bitta turdagi qavs bor deb faraz qilamiz. Bu holat uchun juda sodda algoritm mavjud.

$\text{depth}$ — hozirda yopilmagan ochuvchi qavslar soni bo‘lsin. Dastlab $\text{depth}=0$. Satrning barcha belgilarini ketma-ket ko‘ramiz. Joriy belgi ochuvchi qavs bo‘lsa, $\text{depth}$ ni bittaga oshiramiz; aks holda bittaga kamaytiramiz. Agar istalgan paytda $\text{depth}$ manfiy bo‘lib qolsa yoki satr oxirida u $0$ ga teng bo‘lmasa, satr muvozanatlangan emas. Aks holda u muvozanatlangan.

Bir nechta qavs turi qatnashsa, algoritmni o‘zgartirish kerak. $\text{depth}$ hisoblagichi o‘rniga stek yaratib, uchragan barcha ochuvchi qavslarni unda saqlaymiz.

Joriy belgi ochuvchi qavs bo‘lsa, uni stekka qo‘shamiz. Yopuvchi qavs bo‘lsa, stek bo‘sh emasligini va stekning yuqori elementi joriy yopuvchi qavs bilan bir turda ekanini tekshiramiz. Ikkala shart bajarilsa, ochuvchi qavsni stekdan olib tashlaymiz. Istalgan paytda shartlardan biri bajarilmasa yoki satr oxirida stek bo‘sh bo‘lmasa, satr muvozanatlangan emas. Aks holda u muvozanatlangan.

## Muvozanatlangan ketma-ketliklar soni

### Formula

Faqat bitta turdagi qavsdan foydalanilganda muvozanatlangan qavslar ketma-ketliklari sonini [Catalan sonlari](catalan-numbers.md) yordamida hisoblash mumkin. Uzunligi $2n$ bo‘lgan, ya’ni $n$ juft qavsli muvozanatlangan ketma-ketliklar soni:

$$\frac{1}{n+1} \binom{2n}{n}$$

Agar $k$ turdagi qavsga ruxsat berilsa, har bir juft boshqa juftlardan mustaqil ravishda $k$ turdan istalganiga tegishli bo‘lishi mumkin. Shuning uchun muvozanatlangan qavslar ketma-ketliklari soni:

$$\frac{1}{n+1} \binom{2n}{n} k^n$$

### Dinamik dasturlash

Bu sonlarni **dinamik dasturlash** yordamida ham hisoblash mumkin.

$d[n]$ — $n$ juft qavsli to‘g‘ri qavslar ketma-ketliklari soni bo‘lsin. Birinchi o‘rinda doimo ochuvchi qavs turadi va undan keyin biror joyda shu juftning mos yopuvchi qavsi bo‘ladi. Bu juftning ichida ham, undan keyin ham muvozanatlangan qavslar ketma-ketligi joylashishi ravshan.

$d[n]$ ni hisoblash uchun birinchi qavs juftining ichida $i$ juftli nechta muvozanatlangan ketma-ketlik va bu juftdan keyin $n-1-i$ juftli nechta muvozanatlangan ketma-ketlik borligini ko‘rib chiqamiz. Natijada:

$$d[n] = \sum_{i=0}^{n-1} d[i] \cdot d[n-1-i]$$

Bu rekurrent munosabatning boshlang‘ich qiymati $d[0]=1$.

## Leksikografik tartibdagi keyingi muvozanatlangan ketma-ketlikni topish

Bu bo‘limda faqat bitta turdagi qavsga ruxsat berilgan holatni ko‘rib chiqamiz.

Muvozanatlangan ketma-ketlik berilgan. Leksikografik tartibda undan keyin keladigan muvozanatlangan ketma-ketlikni topish kerak.

Shunday eng o‘ngdagi ochuvchi qavsni topishimiz kerakki, uni yopuvchi qavsga almashtirganda hosil bo‘lgan prefiksda muvozanat buzilmasin. Bu o‘rinni almashtirgandan keyin satrning qolgan qismini leksikografik jihatdan eng kichik usulda to‘ldiramiz: avval imkon qadar ko‘p ochuvchi qavs, so‘ng qolgan o‘rinlarga yopuvchi qavs qo‘yamiz. Boshqacha aytganda, imkon qadar uzun prefiksni o‘zgartirmay qoldirib, suffiksni leksikografik eng kichik yaroqli suffiksga almashtiramiz.

Kerakli o‘rinni topish uchun belgilarni o‘ngdan chapga qarab ko‘rib, ochuvchi va yopuvchi qavslar balansini $\text{depth}$ da saqlaymiz. Ochuvchi qavsga duch kelsak, $\text{depth}$ ni kamaytiramiz; yopuvchi qavsga duch kelsak, oshiramiz. Agar ochuvchi qavsni ko‘rib chiqib bo‘lgandan keyin balans musbat bo‘lsa, o‘zgartirish mumkin bo‘lgan eng o‘ng o‘rinni topgan bo‘lamiz.

Belgini almashtiramiz, o‘ng tomonga nechta ochuvchi va nechta yopuvchi qavs qo‘shish kerakligini hisoblaymiz va ularni leksikografik jihatdan eng kichik tartibda joylashtiramiz.

Mos o‘rin topilmasa, berilgan ketma-ketlik allaqachon eng katta mumkin bo‘lgan ketma-ketlik va undan keyingi javob mavjud emas.

```{.cpp file=next_balanced_brackets_sequence}
bool next_balanced_sequence(string & s) {
    int n = s.size();
    int depth = 0;
    for (int i = n - 1; i >= 0; i--) {
        if (s[i] == '(')
            depth--;
        else
            depth++;

        if (s[i] == '(' && depth > 0) {
            depth--;
            int open = (n - i - 1 - depth) / 2;
            int close = n - i - 1 - open;
            string next = s.substr(0, i) + ')' + string(open, '(') + string(close, ')');
            s.swap(next);
            return true;
        }
    }
    return false;
}
```

Bu funksiya keyingi muvozanatlangan qavslar ketma-ketligini $O(n)$ vaqtda hisoblaydi. Keyingi ketma-ketlik mavjud bo‘lmasa, `false` qaytaradi.

## Barcha muvozanatlangan ketma-ketliklarni topish

Ba’zan berilgan uzunlikdagi barcha muvozanatlangan qavslar ketma-ketliklarini topish va chiqarish talab qilinadi.

Ularni hosil qilish uchun leksikografik jihatdan eng kichik ketma-ketlik $((\dots(())\dots))$ dan boshlash va oldingi bo‘limda tasvirlangan algoritm bilan ketma-ket ravishda navbatdagi leksikografik ketma-ketlikni topish mumkin.

Agar ketma-ketlik uzunligi juda katta bo‘lmasa, masalan $n<12$ bo‘lsa, C++ STL dagi `next_permutation` funksiyasi yordamida barcha permutatsiyalarni hosil qilib, har birining muvozanatlanganligini tekshirish ham qulay.

Ularni barcha ketma-ketliklarni dinamik dasturlash bilan sanashda qo‘llagan g‘oyalarimiz yordamida ham hosil qilish mumkin. Bu g‘oyalarni keyingi ikki bo‘limda ko‘rib chiqamiz.

## Ketma-ketlik indeksi

$n$ juft qavsli muvozanatlangan qavslar ketma-ketligi berilgan. Uning $n$ juft qavsli barcha muvozanatlangan ketma-ketliklar leksikografik ro‘yxatidagi indeksini topish kerak.

Yordamchi $d[i][j]$ massivini aniqlaymiz. Bu yerda $i$ — yarim muvozanatlangan qavslar ketma-ketligining uzunligi, $j$ esa joriy balans, ya’ni ochuvchi va yopuvchi qavslar sonlari ayirmasi. **Yarim muvozanatlangan** deganda har bir yopuvchi qavsga mos ochuvchi qavs bor, ammo har bir ochuvchi qavsga mos yopuvchi qavs bo‘lishi shart emasligi tushuniladi. $d[i][j]$ — ushbu parametrlarga mos ketma-ketliklar soni.

Bu sonlarni dastlab bitta qavs turi uchun hisoblaymiz.

$i=0$ boshlang‘ich qiymatida javob ravshan: $d[0][0]=1$, $j>0$ uchun esa $d[0][j]=0$.

Endi $i>0$ bo‘lsin va ketma-ketlikning oxirgi belgisini ko‘rib chiqaylik. Oxirgi belgi ochuvchi qavs `(` bo‘lgan bo‘lsa, oldingi holat $(i-1,j-1)$ edi. U yopuvchi qavs `)` bo‘lgan bo‘lsa, oldingi holat $(i-1,j+1)$ edi. Shunday qilib, quyidagi rekurrent formulani olamiz:

$$d[i][j] = d[i-1][j-1] + d[i-1][j+1]$$

Manfiy $j$ uchun $d[i][j]=0$ ekani ravshan. Demak, bu massivni $O(n^2)$ vaqtda hisoblash mumkin.

Endi berilgan ketma-ketlikning indeksini topamiz.

Avval faqat bitta qavs turi bo‘lsin. Joriy ichma-ichlik darajasini bildiruvchi $\text{depth}$ hisoblagichini saqlab, ketma-ketlik belgilarini chapdan o‘ngga ko‘ramiz.

Agar joriy $s[i]$ belgisi `(` bo‘lsa, $\text{depth}$ ni bittaga oshiramiz. Agar $s[i]$ belgisi `)` bo‘lsa, javobga

$$d[2n-i-1][\text{depth}+1]$$

ni qo‘shishimiz kerak. Bu qiymat joriy o‘rinda `(` bilan boshlanadigan barcha mumkin bo‘lgan davomlarni, ya’ni berilgan ketma-ketlikdan leksikografik jihatdan kichik ketma-ketliklarni hisobga oladi. Shundan keyin $\text{depth}$ ni bittaga kamaytiramiz.

Endi $k$ ta turli qavs turi mavjud bo‘lsin.

Joriy $s[i]$ belgiga qaraganimizda, $\text{depth}$ ni yangilashdan oldin joriy belgidan kichik bo‘lgan barcha qavs turlarini ko‘rib chiqamiz. Har bir shunday qavsni joriy o‘ringa qo‘yib ko‘ramiz; yangi balans $\text{ndepth}=\text{depth}\pm1$ bo‘ladi. So‘ng uzunligi $2n-i-1$, balansi $\text{ndepth}$ bo‘lgan davomlar sonini javobga qo‘shamiz:

$$d[2n - i - 1][\text{ndepth}] \cdot k^{\frac{2n - i - 1 - ndepth}{2}}$$

Bu formula quyidagicha keltirib chiqariladi. Avval bir nechta qavs turi borligini “unutib”, faqat $d[2n-i-1][\text{ndepth}]$ javobini olamiz. Endi $k$ turdagi qavsga ruxsat berilsa javob qanday o‘zgarishini ko‘ramiz.

Hali aniqlanmagan $2n-i-1$ ta o‘rin bor. Ularning $\text{ndepth}$ tasi ochuvchi qavslar sababli oldindan belgilangan. Qolgan qavslarning

$$\frac{2n-i-1-\text{ndepth}}{2}$$

juftining har biri istalgan turga tegishli bo‘lishi mumkin. Shu sababli sonni $k$ ning tegishli darajasiga ko‘paytiramiz.

## $k$-ketma-ketlikni topish {data-toc-label="k-ketma-ketlikni topish"}

$n$ — ketma-ketlikdagi qavs juftlari soni bo‘lsin. Barcha muvozanatlangan ketma-ketliklarning leksikografik tartiblangan ro‘yxatidagi $k$-ketma-ketlikni topish kerak.

Oldingi bo‘limdagidek, uzunligi $i$ va balansi $j$ bo‘lgan yarim muvozanatlangan qavslar ketma-ketliklari sonini bildiruvchi $d[i][j]$ yordamchi massivini hisoblaymiz.

Avval faqat bitta qavs turi bo‘lsin.

Hosil qilayotgan satrimizning belgilarini chapdan o‘ngga ko‘ramiz. Oldingi masaladagidek, joriy ichma-ichlik darajasini bildiruvchi $\text{depth}$ hisoblagichini saqlaymiz. Har bir o‘rinda ochuvchi yoki yopuvchi qavs qo‘yishni tanlash kerak.

Ochuvchi qavs qo‘yish uchun

$$d[2n-i-1][\text{depth}+1]\ge k$$

sharti bajarilishi kerak. Shart bajarilsa, $\text{depth}$ ni oshirib, keyingi belgiga o‘tamiz. Aks holda $k$ dan $d[2n-i-1][\text{depth}+1]$ ni ayiramiz, yopuvchi qavs qo‘yamiz va davom etamiz.

```{.cpp file=kth_balances_bracket}
string kth_balanced(int n, int k) {
    vector<vector<int>> d(2*n+1, vector<int>(n+1, 0));
    d[0][0] = 1;
    for (int i = 1; i <= 2*n; i++) {
        d[i][0] = d[i-1][1];
        for (int j = 1; j < n; j++)
            d[i][j] = d[i-1][j-1] + d[i-1][j+1];
        d[i][n] = d[i-1][n-1];
    }

    string ans;
    int depth = 0;
    for (int i = 0; i < 2*n; i++) {
        if (depth + 1 <= n && d[2*n-i-1][depth+1] >= k) {
            ans += '(';
            depth++;
        } else {
            ans += ')';
            if (depth + 1 <= n)
                k -= d[2*n-i-1][depth+1];
            depth--;
        }
    }
    return ans;
}
```

Endi $k$ turdagi qavs mavjud bo‘lsin. Yechim faqat biroz o‘zgaradi: $d[2n-i-1][\text{ndepth}]$ qiymatini

$$k^{(2n-i-1-\text{ndepth})/2}$$

ga ko‘paytirish va keyingi belgi uchun bir nechta qavs turi bo‘lishi mumkinligini hisobga olish kerak.

Quyidagi implementatsiyada ikki turdagi — yumaloq va kvadrat — qavslar ishlatiladi:

```{.cpp file=kth_balances_bracket_multiple}
string kth_balanced2(int n, int k) {
    vector<vector<int>> d(2*n+1, vector<int>(n+1, 0));
    d[0][0] = 1;
    for (int i = 1; i <= 2*n; i++) {
        d[i][0] = d[i-1][1];
        for (int j = 1; j < n; j++)
            d[i][j] = d[i-1][j-1] + d[i-1][j+1];
        d[i][n] = d[i-1][n-1];
    }

    string ans;
    int shift, depth = 0;

    stack<char> st;
    for (int i = 0; i < 2*n; i++) {

        // '('
        shift = ((2*n-i-1-depth-1) / 2);
        if (shift >= 0 && depth + 1 <= n) {
            int cnt = d[2*n-i-1][depth+1] << shift;
            if (cnt >= k) {
                ans += '(';
                st.push('(');
                depth++;
                continue;
            }
            k -= cnt;
        }

        // ')'
        shift = ((2*n-i-1-depth+1) / 2);
        if (shift >= 0 && depth && st.top() == '(') {
            int cnt = d[2*n-i-1][depth-1] << shift;
            if (cnt >= k) {
                ans += ')';
                st.pop();
                depth--;
                continue;
            }
            k -= cnt;
        }
            
        // '['
        shift = ((2*n-i-1-depth-1) / 2);
        if (shift >= 0 && depth + 1 <= n) {
            int cnt = d[2*n-i-1][depth+1] << shift;
            if (cnt >= k) {
                ans += '[';
                st.push('[');
                depth++;
                continue;
            }
            k -= cnt;
        }

        // ']'
        ans += ']';
        st.pop();
        depth--;
    }
    return ans;
}
```

