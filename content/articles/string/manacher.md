---
article_id: string--manacher
---
# Manacher algoritmi — barcha palindrom ostsatrlarni $O(N)$ da topish

## Masala bayoni

Uzunligi $n$ bo‘lgan $s$ satri berilgan. $s[i\dots j]$ ostsatri palindrom bo‘ladigan barcha $(i, j)$ juftliklarni toping. $t = t_{rev}$ bo‘lsa, $t$ satri palindrom deyiladi (bu yerda $t_{rev}$ — $t$ satrining teskarisi).

## Aniqroq masala bayoni

Eng yomon holatda satrda $O(n^2)$ tagacha palindrom ostsatr bo‘lishi mumkin va bir qarashda bu masala uchun chiziqli algoritm mavjud emasdek ko‘rinadi.

Ammo palindromlar haqidagi ma’lumotni **ixcham ko‘rinishda** saqlash mumkin: har bir $i$ pozitsiya uchun markazi shu pozitsiyada bo‘lgan bo‘sh bo‘lmagan palindromlar sonini topamiz.

Bir xil markazga ega palindromlar uzluksiz zanjir hosil qiladi: ya’ni markazi $i$ da bo‘lgan uzunligi $l$ ga teng palindrom mavjud bo‘lsa, markazi yana $i$ da bo‘lgan uzunliklari $l-2$, $l-4$ va hokazo palindromlar ham mavjud. Shuning uchun barcha palindrom ostsatrlar haqidagi ma’lumotni shu tarzda to‘playmiz.

Toq va juft uzunlikdagi palindromlar mos ravishda $d_{odd}[i]$ va $d_{even}[i]$ massivlarida alohida hisobga olinadi. Juft uzunlikdagi palindromning ikkita markaziy belgisi $s[i]$ va $s[i-1]$ bo‘lsa, uning markazi $i$ pozitsiyada deb hisoblaymiz.

Masalan, $s = abababc$ satrida markazi $s[3] = b$ pozitsiyada bo‘lgan uchta toq uzunlikdagi palindrom bor, ya’ni $d_{odd}[3] = 3$:

$$a\ \overbrace{b\ a\ \underbrace{b}_{s_3}\ a\ b}^{d_{odd}[3]=3} c$$

$s = cbaabd$ satrida esa markazi $s[3] = a$ pozitsiyada bo‘lgan ikkita juft uzunlikdagi palindrom bor, ya’ni $d_{even}[3] = 2$:

$$c\ \overbrace{b\ a\ \underbrace{a}_{s_3}\ b}^{d_{even}[3]=2} d$$

Ajablanarlisi shundaki, ushbu “palindromlik massivlari” — $d_{odd}[]$ va $d_{even}[]$ ni chiziqli vaqtda hisoblaydigan yetarlicha sodda algoritm mavjud. Ushbu maqolada shu algoritm tasvirlanadi.

## Yechim

Umuman olganda, bu masalaning ko‘plab yechimlari bor: [satrlarni xeshlash](string-hashing.md) yordamida uni $O(n\cdot \log n)$ vaqtda, [suffiks daraxtlari](suffix-tree-ukkonen.md) va tezkor LCA yordamida esa $O(n)$ vaqtda yechish mumkin.

Ammo bu yerda tasvirlangan usul **ancha** sodda hamda vaqt va xotira murakkabligidagi yashirin doimiysi kichikroq. Ushbu algoritmni **Glenn K. Manacher** 1975-yilda kashf qilgan.

Bu masalani va umuman palindromlar bilan bog‘liq masalalarni yechishning yana bir zamonaviy usuli palindrom daraxti yoki eertree deb ataladigan tuzilmadan foydalanishdir.

## Sodda algoritm

Keyingi izohda noaniqlik bo‘lmasligi uchun “sodda algoritm” deganda nimani nazarda tutishimizni belgilaymiz.

Bu algoritm har bir $i$ markaz pozitsiyasi uchun tegishli belgilar juftini taqqoslab, iloji boricha javobni bittadan oshirib boradi.

Bunday algoritm sekin: u javobni faqat $O(n^2)$ vaqtda hisoblay oladi.

Sodda algoritm implementatsiyasi:

```cpp
vector<int> manacher_odd_trivial(string s) {
    int n = s.size();
    s = "$" + s + "^";
    vector<int> p(n + 2);
    for(int i = 1; i <= n; i++) {
        while(s[i - p[i]] == s[i + p[i]]) {
            p[i]++;
        }
    }
    return vector<int>(begin(p) + 1, end(p) - 1);
}
```

Satr chetlarini alohida qayta ishlamaslik uchun `$` va `^` terminal belgilaridan foydalanildi.

## Manacher algoritmi

Barcha toq uzunlikdagi palindrom ostsatrlarni topish, ya’ni $d_{odd}[]$ ni hisoblash algoritmini tasvirlaymiz.

Tez hisoblash uchun topilgan eng o‘ngdagi (ost)palindromning **ochiq chegaralari $(l, r)$** ni saqlaymiz (ya’ni joriy eng o‘ngdagi (ost)palindrom $s[l+1] s[l+2] \dots s[r-1]$ bo‘ladi). Dastlab $l = 0, r = 1$ deb olamiz; bu bo‘sh satrga mos keladi.

Endi navbatdagi $i$ uchun $d_{odd}[i]$ ni hisoblamoqchimiz va $d_{odd}[]$ ning barcha oldingi qiymatlari allaqachon hisoblangan. Quyidagicha ish tutamiz:

* Agar $i$ joriy ostpalindrom tashqarisida bo‘lsa, ya’ni $i \geq r$, sodda algoritmni ishga tushiramiz.

    Shunday qilib, $d_{odd}[i]$ ni ketma-ket oshiramiz va har safar joriy eng o‘ngdagi $[i - d_{odd}[i]\dots i + d_{odd}[i]]$ ostsatr palindrom ekanini tekshiramiz. Birinchi mos kelmaslikni topganimizda yoki $s$ chegarasiga yetganimizda to‘xtaymiz. Shu paytda $d_{odd}[i]$ to‘liq hisoblangan bo‘ladi. Shundan keyin $(l, r)$ ni yangilashni unutmaslik kerak. $r$ joriy eng o‘ngdagi ostpalindromning oxirgi indeksini ifodalaydigan qilib yangilanishi lozim.

* Endi $i \le r$ bo‘lgan holatni ko‘rib chiqamiz. $d_{odd}[]$ ning oldin hisoblangan qiymatlaridan ma’lumot olishga harakat qilamiz. $(l, r)$ ostpalindrom ichida $i$ ning “oynadagi” pozitsiyasini topamiz, ya’ni $j = l + (r - i)$ pozitsiyani olamiz va $d_{odd}[j]$ qiymatini tekshiramiz. $j$ pozitsiyasi $(l+r)/2$ ga nisbatan $i$ ga simmetrik bo‘lgani uchun **deyarli har doim** $d_{odd}[i] = d_{odd}[j]$ deb olishimiz mumkin. Quyidagi rasmiy ifoda buni ko‘rsatadi ($j$ atrofidagi palindrom amalda $i$ atrofidagi palindromga “ko‘chiriladi”):

    $$
    \ldots\ 
    \overbrace{
        s_{l+1}\ \ldots\ 
        \underbrace{
            s_{j-d_{odd}[j]+1}\ \ldots\ s_j\ \ldots\ s_{j+d_{odd}[j]-1}\ 
        }_\text{palindrome}\ 
        \ldots\ 
        \underbrace{
            s_{i-d_{odd}[j]+1}\ \ldots\ s_i\ \ldots\ s_{i+d_{odd}[j]-1}\ 
        }_\text{palindrome}\ 
        \ldots\ s_{r-1}\ 
    }^\text{palindrome}\ 
    \ldots
    $$

    Ammo to‘g‘ri qayta ishlanishi kerak bo‘lgan **murakkab holat** bor: “ichki” palindrom “tashqi” palindrom chegarasiga yetganda, ya’ni $j - d_{odd}[j] \le l$ (yoki ayni ma’noda $i + d_{odd}[j] \ge r$) bo‘lganda. “Tashqi” palindromdan tashqaridagi simmetriya kafolatlanmagani uchun shunchaki $d_{odd}[i] = d_{odd}[j]$ deb olish noto‘g‘ri: $i$ pozitsiyadagi palindrom ham aynan shu uzunlikka ega deb aytish uchun ma’lumot yetarli emas.

    Aslida bunday holatlarni to‘g‘ri qayta ishlash uchun hozircha palindrom uzunligini cheklashimiz, ya’ni $d_{odd}[i] = r - i$ deb olishimiz kerak. Shundan so‘ng $d_{odd}[i]$ ni iloji boricha oshirishga harakat qiladigan sodda algoritmni ishga tushiramiz.

    Bu holatning tasviri ($j$ markazli palindrom “tashqi” palindrom ichiga sig‘adigan qilib cheklanadi):

    $$
    \ldots\ 
    \overbrace{
        \underbrace{
            s_{l+1}\ \ldots\ s_j\ \ldots\ s_{j+(j-l)-1}\ 
        }_\text{palindrome}\ 
        \ldots\ 
        \underbrace{
            s_{i-(r-i)+1}\ \ldots\ s_i\ \ldots\ s_{r-1}
        }_\text{palindrome}\ 
    }^\text{palindrome}\ 
    \underbrace{
        \ldots \ldots \ldots \ldots \ldots
    }_\text{try moving here}
    $$

    Tasvirdan ko‘rinadiki, $j$ markazli palindrom kattaroq bo‘lib, “tashqi” palindromdan tashqariga chiqishi mumkin, ammo markaz sifatida $i$ ni olganimizda faqat “tashqi” palindrom ichiga to‘liq sig‘adigan qismdan foydalanishimiz mumkin. Biroq $i$ pozitsiya uchun javob — $d_{odd}[i]$ — bu qismdan ancha katta bo‘lishi mumkin. Shuning uchun keyin sodda algoritmni ishga tushirib, uni “tashqi” palindromdan tashqariga, ya’ni “try moving here” bilan ko‘rsatilgan sohaga kengaytirishga harakat qilamiz.

Yana bir bor: har bir $d_{odd}[i]$ ni hisoblagandan keyin $(l, r)$ qiymatlarini yangilashni unutmaslik kerak.

## Manacher algoritmining murakkabligi

Bir qarashda bu algoritmning vaqt murakkabligi chiziqli ekani aniq emas, chunki muayyan pozitsiya uchun javobni qidirishda sodda algoritmni tez-tez ishga tushiramiz.

Ammo sinchiklab tahlil qilinganda algoritm chiziqli ekanini ko‘rish mumkin. Aslida ushbu algoritmga o‘xshash [Z-funksiyani qurish algoritmi](z-function.md) ham chiziqli vaqtda ishlaydi.

Sodda algoritmning har bir iteratsiyasi $r$ ni bittaga oshirishini ko‘rish mumkin. Bundan tashqari, algoritm davomida $r$ hech qachon kamaymaydi. Demak, sodda algoritm jami $O(n)$ ta iteratsiya bajaradi.

Manacher algoritmining qolgan qismlari ham ravshanki chiziqli vaqtda ishlaydi. Shunday qilib, vaqt murakkabligi $O(n)$ bo‘ladi.

## Manacher algoritmi implementatsiyasi

$d_{odd}[]$ ni hisoblash uchun quyidagi kodni olamiz. E’tibor berish kerak bo‘lgan jihatlar:

 - $i$ — joriy palindromning markaziy belgisi indeksi.
 - Agar $i$ $r$ dan oshsa, $d_{odd}[i]$ qiymati $0$ ga teng qilib boshlanadi.
 - Agar $i$ $r$ dan oshmasa, $d_{odd}[i]$ yoki $(l,r)$ da $i$ ning oynadagi pozitsiyasi bo‘lgan $j$ uchun $d_{odd}[j]$ qiymati bilan boshlanadi, yoki $d_{odd}[i]$ “tashqi” palindrom o‘lchami bilan cheklanadi.
 - `while` sikli sodda algoritmni anglatadi. Uni $k$ qiymatidan qat’i nazar ishga tushiramiz.
 - Markazi $i$ da bo‘lgan palindrom o‘lchami $x$ bo‘lsa, $d_{odd}[i]$ qiymati $\frac{x+1}{2}$ ni saqlaydi.

```{.cpp file=manacher_odd}
vector<int> manacher_odd(string s) {
    int n = s.size();
    s = "$" + s + "^";
    vector<int> p(n + 2);
    int l = 0, r = 1;
    for(int i = 1; i <= n; i++) {
        if(i <= r) {
            p[i] = min(r - i, p[l + (r - i)]);
        }
        while(s[i - p[i]] == s[i + p[i]]) {
            p[i]++;
        }
        if(i + p[i] > r) {
            l = i - p[i], r = i + p[i];
        }
    }
    return vector<int>(begin(p) + 1, end(p) - 1);
}
```

## Juft-toqlik bilan ishlash

Manacher algoritmini toq va juft uzunliklar uchun alohida implementatsiya qilish mumkin bo‘lsa-da, juft uzunliklar uchun variant ko‘pincha murakkabroq deb hisoblanadi: u kamroq tabiiy va off-by-one xatolariga oson olib keladi.

Buni yengillashtirish uchun butun masalani faqat toq uzunlikdagi palindromlar bilan ishlaydigan holatga keltirish mumkin. Buning uchun satrdagi har bir belgi orasiga, shuningdek satr boshi va oxiriga qo‘shimcha `#` belgisini qo‘yamiz:

$$abcbcba \to \#a\#b\#c\#b\#c\#b\#a\#,$$

$$d = [1,2,1,2,1,4,1,8,1,4,1,2,1,2,1].$$

Ko‘rinib turibdiki, $d[2i]=2 d_{even}[i]+1$ va $d[2i+1]=2 d_{odd}[i]$; bu yerda $d$ — `#` bilan birlashtirilgan satrdagi toq uzunlikdagi palindromlar uchun Manacher massivi, $d_{odd}$ va $d_{even}$ esa boshlang‘ich satr uchun yuqorida ta’riflangan massivlardir.

Haqiqatan ham, `#` belgilari markazi hanuz boshlang‘ich satr belgilarida bo‘lgan toq uzunlikdagi palindromlarga ta’sir qilmaydi; ammo boshlang‘ich satrning juft uzunlikdagi palindromlari yangi satrda markazi `#` belgilarida bo‘lgan toq uzunlikdagi palindromlarga aylanadi.

E’tibor bering, $d[2i]$ va $d[2i+1]$ mos ravishda markazi $i$ da bo‘lgan eng katta toq va juft uzunlikdagi palindromlar uzunligining birga oshirilgan qiymatidir.

Reduksiya quyidagicha implementatsiya qilinadi:

```cpp
vector<int> manacher(string s) {
    string t;
    for(auto c: s) {
        t += string("#") + c;
    }
    auto res = manacher_odd(t + "#");
    return vector<int>(begin(res) + 1, end(res) - 1);
}
```

Soddalik uchun massivni $d_{odd}$ va $d_{even}$ ga ajratish hamda ularni bevosita hisoblash keltirilmagan.

## Masalalar

- [Library Checker - Enumerate Palindromes](https://judge.yosupo.jp/problem/enumerate_palindromes)
- [Longest Palindrome](https://cses.fi/problemset/task/1111)
- [UVA 11475 - Extend to Palindrome](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=26&page=show_problem&problem=2470)
- [GYM - (Q) QueryreuQ](https://codeforces.com/gym/101806/problem/Q)
- [CF - Prefix-Suffix Palindrome](https://codeforces.com/contest/1326/problem/D2)
- [SPOJ - Number of Palindromes](https://www.spoj.com/problems/NUMOFPAL/)
- [Kattis - Palindromes](https://open.kattis.com/problems/palindromes)

