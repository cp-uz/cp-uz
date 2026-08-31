---
article_id: string--prefix-function
---
# Prefiks funksiyasi. Knuth–Morris–Pratt algoritmi

## Prefiks funksiyasining ta’rifi

Uzunligi $n$ bo‘lgan $s$ satr berilgan.
Bu satrning **prefiks funksiyasi** uzunligi $n$ bo‘lgan $\pi$ massiv sifatida aniqlanadi: $\pi[i]$ — $s[0 \dots i]$ qism satrining ayni paytda shu qism satrning suffiksi ham bo‘lgan eng uzun xos prefiksi uzunligi.
Satrning o‘ziga teng bo‘lmagan prefiksi **xos prefiks** deyiladi.
Ta’rifga ko‘ra, $\pi[0] = 0$.

Prefiks funksiyasining matematik ta’rifi quyidagicha yoziladi:

$$\pi[i] = \max_ {k = 0 \dots i} \{k : s[0 \dots k-1] = s[i-(k-1) \dots i] \}$$

Masalan, `abcabcd` satrining prefiks funksiyasi $[0, 0, 0, 1, 2, 3, 0]$, `aabaaab` satriniki esa $[0, 1, 0, 1, 2, 2, 3]$ ga teng.

## Sodda algoritm

Prefiks funksiya ta’rifini bevosita takrorlaydigan algoritm quyidagicha:

```{.cpp file=prefix_slow}
vector<int> prefix_function(string s) {
    int n = (int)s.length();
    vector<int> pi(n);
    for (int i = 0; i < n; i++)
        for (int k = 0; k <= i; k++)
            if (s.substr(0, k) == s.substr(i-k+1, k))
                pi[i] = k;
    return pi;
}
```

Uning murakkabligi $O(n^3)$ ekanini ko‘rish oson; demak, uni yaxshilash uchun ancha imkon bor.

## Samarali algoritm

Bu algoritm 1977-yilda Knuth va Pratt, ulardan mustaqil ravishda esa Morris tomonidan taklif qilingan.
U qism satr qidirish algoritmining asosiy funksiyasi sifatida ishlatilgan.

### Birinchi optimallashtirish

Birinchi muhim kuzatuv: prefiks funksiya qiymati keyingi pozitsiyada ko‘pi bilan bittaga oshishi mumkin.

Haqiqatan, aks holda $\pi[i + 1] \gt \pi[i] + 1$ bo‘lsa, $i + 1$ pozitsiyada tugaydigan, uzunligi $\pi[i + 1]$ bo‘lgan suffiksdan oxirgi belgini olib tashlash mumkin.
Shunda $i$ pozitsiyada tugaydigan, uzunligi $\pi[i + 1] - 1$ bo‘lgan suffiks hosil bo‘ladi; bu $\pi[i]$ dan uzun, ya’ni qarama-qarshilik kelib chiqadi.

Quyidagi tasvir shu qarama-qarshilikni ko‘rsatadi.
$i$ pozitsiyadagi prefiksga teng eng uzun xos suffiks uzunligi $2$, $i+1$ pozitsiyada esa $4$ deb faraz qilingan.
U holda $s_0 ~ s_1 ~ s_2 ~ s_3$ satri $s_{i-2} ~ s_{i-1} ~ s_i ~ s_{i+1}$ satriga teng; demak, $s_0 ~ s_1 ~ s_2$ va $s_{i-2} ~ s_{i-1} ~ s_i$ ham teng bo‘ladi va $\pi[i]$ aslida $3$ bo‘lishi kerak.

$$\underbrace{\overbrace{s_0 ~ s_1}^{\pi[i] = 2} ~ s_2 ~ s_3}_{\pi[i+1] = 4} ~ \dots ~ \underbrace{s_{i-2} ~ \overbrace{s_{i-1} ~ s_{i}}^{\pi[i] = 2} ~ s_{i+1}}_{\pi[i+1] = 4}$$

Shunday qilib, keyingi pozitsiyaga o‘tganda prefiks funksiya qiymati bittaga oshishi, o‘zgarmasligi yoki biror miqdorga kamayishi mumkin.
Bu faktning o‘ziyoq algoritm murakkabligini $O(n^2)$ gacha tushiradi, chunki bir qadamda prefiks funksiya ko‘pi bilan bittaga o‘sadi.
Butun jarayonda funksiya jami ko‘pi bilan $n$ marta o‘sadi, shuning uchun jami kamayishlar soni ham ko‘pi bilan $n$ bo‘ladi.
Demak, atigi $O(n)$ ta satr taqqoslash bajariladi va umumiy murakkablik $O(n^2)$ bo‘ladi.

### Ikkinchi optimallashtirish

Endi satrlarni taqqoslash amallaridan ham voz kechamiz.
Buning uchun oldingi qadamlarda hisoblangan barcha ma’lumotlardan foydalanish kerak.

$i + 1$ uchun $\pi$ qiymatini hisoblaylik.
Agar $s[i+1] = s[\pi[i]]$ bo‘lsa, $\pi[i+1] = \pi[i] + 1$ ekanini aniq ayta olamiz, chunki $i$ pozitsiyada tugaydigan, uzunligi $\pi[i]$ bo‘lgan suffiks uzunligi $\pi[i]$ bo‘lgan prefiksga tengligini allaqachon bilamiz.
Buni yana bir misol bilan tasvirlaymiz:

$$\underbrace{\overbrace{s_0 ~ s_1 ~ s_2}^{\pi[i]} ~ \overbrace{s_3}^{s_3 = s_{i+1}}}_{\pi[i+1] = \pi[i] + 1} ~ \dots ~ \underbrace{\overbrace{s_{i-2} ~ s_{i-1} ~ s_{i}}^{\pi[i]} ~ \overbrace{s_{i+1}}^{s_3 = s_{i + 1}}}_{\pi[i+1] = \pi[i] + 1}$$

Aks holda, ya’ni $s[i+1] \neq s[\pi[i]]$ bo‘lsa, qisqaroq satrni sinab ko‘rishimiz kerak.
Jarayonni tezlashtirish uchun darhol $j \lt \pi[i]$ bo‘lgan va $i$ pozitsiyada prefiks xossasi bajariladigan, ya’ni $s[0 \dots j-1] = s[i-j+1 \dots i]$ bo‘lgan eng katta $j$ ga o‘tmoqchimiz:

$$\overbrace{\underbrace{s_0 ~ s_1}_j ~ s_2 ~ s_3}^{\pi[i]} ~ \dots ~ \overbrace{s_{i-3} ~ s_{i-2} ~ \underbrace{s_{i-1} ~ s_{i}}_j}^{\pi[i]} ~ s_{i+1}$$

Shunday $j$ topilsa, yana faqat $s[i+1]$ va $s[j]$ belgilarini taqqoslash kifoya.
Ular teng bo‘lsa, $\pi[i+1] = j + 1$ deb olamiz.
Aks holda prefiks xossasi bajariladigan, $j$ dan kichik eng katta qiymatni topishimiz va jarayonni davom ettirishimiz kerak.
Bu jarayon $j = 0$ gacha borishi mumkin.
Shunda $s[i+1] = s[0]$ bo‘lsa, $\pi[i+1] = 1$, aks holda $\pi[i+1] = 0$ bo‘ladi.

Demak, algoritmning umumiy sxemasi tayyor.
Faqat $j$ uchun keyingi qisqaroq uzunliklarni qanday samarali topish masalasi qoldi.
Qayta aytamiz: $i$ pozitsiyada prefiks xossasi bajariladigan joriy $j$, ya’ni $s[0 \dots j-1] = s[i-j+1 \dots i]$ berilgan; shu xossa bajariladigan eng katta $k \lt j$ ni topish kerak.

$$\overbrace{\underbrace{s_0 ~ s_1}_k ~ s_2 ~ s_3}^j ~ \dots ~ \overbrace{s_{i-3} ~ s_{i-2} ~ \underbrace{s_{i-1} ~ s_{i}}_k}^j ~s_{i+1}$$

Tasvirdan bu qiymat ilgari hisoblangan $\pi[j-1]$ bo‘lishi ko‘rinadi.

### Yakuniy algoritm

Endi satrlarni umuman taqqoslamaydigan va atigi $O(n)$ ta amal bajaradigan algoritmni tuzish mumkin.

Yakuniy tartib quyidagicha:

- $i = 1$ dan $i = n-1$ gacha yurib, $\pi[i]$ qiymatlarni hisoblaymiz ($\pi[0]$ ga shunchaki $0$ beriladi).
- Joriy $\pi[i]$ ni hisoblash uchun $i-1$ pozitsiyadagi eng yaxshi suffiks uzunligini bildiruvchi $j$ o‘zgaruvchini olamiz. Dastlab $j = \pi[i-1]$.
- $s[j]$ va $s[i]$ ni taqqoslab, uzunligi $j+1$ bo‘lgan suffiks prefiks ham ekanini tekshiramiz.
Ular teng bo‘lsa, $\pi[i] = j + 1$ deb olamiz; aks holda $j$ ni $\pi[j-1]$ ga kamaytirib, shu qadamni takrorlaymiz.
- $j = 0$ ga yetib, baribir moslik topilmasa, $\pi[i] = 0$ deb olib, keyingi $i + 1$ indeksga o‘tamiz.

### Implementatsiya

Implementatsiya hayratlanarli darajada qisqa va ifodali chiqadi.

```{.cpp file=prefix_fast}
vector<int> prefix_function(string s) {
    int n = (int)s.length();
    vector<int> pi(n);
    for (int i = 1; i < n; i++) {
        int j = pi[i-1];
        while (j > 0 && s[i] != s[j])
            j = pi[j-1];
        if (s[i] == s[j])
            j++;
        pi[i] = j;
    }
    return pi;
}
```

Bu **onlayn** algoritm: ma’lumot kelishi bilan qayta ishlanadi. Masalan, satr belgilarini birma-bir o‘qib, har bir yangi belgi uchun prefiks funksiya qiymatini darhol topish mumkin.
Algoritm baribir satrning o‘zini va ilgari hisoblangan prefiks funksiya qiymatlarini saqlashni talab qiladi. Ammo prefiks funksiyaning satrda olishi mumkin bo‘lgan maksimal qiymat $M$ oldindan ma’lum bo‘lsa, satrning faqat dastlabki $M+1$ ta belgisini va shuncha prefiks funksiya qiymatini saqlash yetarli.

## Qo‘llanishlar

### Satr ichida qism satr qidirish. Knuth–Morris–Pratt algoritmi

Bu prefiks funksiyaning klassik qo‘llanishidir.

$t$ matn va $s$ satr berilgan. $s$ satrning $t$ matndagi barcha uchrashish joylarini topib chiqarish kerak.

Qulaylik uchun $s$ satr uzunligini $n$, $t$ matn uzunligini esa $m$ deb belgilaymiz.

$s + \# + t$ satrni tuzamiz; bu yerda $\#$ belgisi $s$ da ham, $t$ da ham uchramaydigan ajratgich.
Shu satr uchun prefiks funksiyani hisoblaymiz.
Endi dastlabki $n + 1$ ta elementdan (ular $s$ va ajratgichga tegishli) tashqari prefiks funksiya qiymatlarining ma’nosini ko‘rib chiqamiz.
Ta’rifga ko‘ra, $\pi[i]$ qiymat $i$ pozitsiyada tugaydigan va prefiks bilan bir xil bo‘lgan eng uzun qism satr uzunligini ko‘rsatadi.
Bizning holatda bu $s$ bilan mos tushib, $i$ pozitsiyada tugaydigan eng uzun blokdir.
Ajratgich sababli uning uzunligi $n$ dan oshmaydi.
Agar $\pi[i] = n$ tenglikka erishilsa, $s$ satr shu pozitsiyada to‘liq uchraydi, ya’ni uning oxiri $i$ pozitsiyada joylashgan.
Faqat indekslar $s + \# + t$ satrida olinayotganini unutmang.

Demak, biror $i$ da $\pi[i] = n$ bo‘lsa, $t$ satrining $i - (n + 1) - n + 1 = i - 2n$ pozitsiyasida $s$ satr boshlanadi.

Prefiks funksiyani hisoblash tavsifida aytilganidek, uning qiymatlari ma’lum chegaradan oshmasligini bilsak, butun satr va butun funksiyani saqlash shart emas — faqat boshlang‘ich qismini saqlash kifoya.
Bu masalada faqat $s + \#$ satr va uning prefiks funksiya qiymatlarini saqlash kerak.
$t$ satr belgilarini birma-bir o‘qib, joriy prefiks funksiya qiymatini hisoblash mumkin.

Shunday qilib, Knuth–Morris–Pratt algoritmi masalani $O(n + m)$ vaqt va $O(n)$ xotirada yechadi.

### Har bir prefiksning uchrashishlari sonini hisoblash

Bu yerda birdaniga ikkita masalani ko‘rib chiqamiz.
Uzunligi $n$ bo‘lgan $s$ satr berilgan.
Birinchi variantda har bir $s[0 \dots i]$ prefiksining ayni $s$ satr ichida necha marta uchrashishini hisoblamoqchimiz.
Ikkinchi variantda qo‘shimcha $t$ satr beriladi va har bir $s[0 \dots i]$ prefiksining $t$ da necha marta uchrashishini topish kerak.

Avval birinchi masalani yechamiz.
$i$ pozitsiyadagi $\pi[i]$ qiymatini ko‘rib chiqamiz.
Ta’rifga ko‘ra, bu $s$ satrning uzunligi $\pi[i]$ bo‘lgan prefiksi $i$ pozitsiyada tugab uchrashishini va bu xossaga ega undan uzun prefiks yo‘qligini bildiradi.
Ayni pozitsiyada qisqaroq prefikslar ham tugashi mumkin.
Bu prefiks funksiyani hisoblashda javob bergan savolimiz bilan bir xil: $i$ pozitsiyada tugaydigan suffiks ham bo‘lgan uzunligi $j$ prefiks berilgan bo‘lsa, ayni xossaga ega undan keyingi kichikroq prefiks qaysi?
Demak, $i$ pozitsiyada uzunligi $\pi[i]$ bo‘lgan prefiks, undan keyin uzunligi $\pi[\pi[i] - 1]$ bo‘lgan prefiks, keyin $\pi[\pi[\pi[i] - 1] - 1]$ va hokazo prefikslar indeks nolga yetguncha tugaydi.
Shu sababli javobni quyidagicha hisoblash mumkin:

```{.cpp file=prefix_count_each_prefix}
vector<int> ans(n + 1);
for (int i = 0; i < n; i++)
    ans[pi[i]]++;
for (int i = n-1; i > 0; i--)
    ans[pi[i-1]] += ans[i];
for (int i = 0; i <= n; i++)
    ans[i]++;
```

Bu yerda avval har bir prefiks funksiya qiymati $\pi$ massivida necha marta uchrashini sanaymiz, keyin yakuniy javoblarni hisoblaymiz:
agar uzunligi $i$ bo‘lgan prefiks aynan $\text{ans}[i]$ marta uchrashishini bilsak, bu sonni uning ayni paytda prefiks ham bo‘lgan eng uzun suffiksi uchrashishlari soniga qo‘shish kerak.
Oxirida har bir natijaga $1$ qo‘shamiz, chunki prefikslarning o‘zini ham hisobga olish lozim.

Endi ikkinchi masalani ko‘ramiz.
Knuth–Morris–Pratt usulini qo‘llab, $s + \# + t$ satrni tuzamiz va uning prefiks funksiyasini hisoblaymiz.
Birinchi masaladan yagona farq: biz faqat $t$ satrga tegishli, ya’ni $i \ge n + 1$ bo‘lgan $\pi[i]$ qiymatlariga qiziqamiz.
Shu qiymatlar bilan birinchi masaladagi hisoblashlarni aynan takrorlaymiz.

### Satrdagi turli qism satrlar soni

Uzunligi $n$ bo‘lgan $s$ satr berilgan.
Unda uchraydigan turli qism satrlar sonini hisoblash kerak.

Masalani iterativ yechamiz.
Ya’ni hozirgi turli qism satrlar sonini bilgan holda, satr oxiriga bitta belgi qo‘shilganda bu sonni qanday qayta hisoblashni o‘rganamiz.

$s$ dagi turli qism satrlar soni hozir $k$ bo‘lsin va satr oxiriga $c$ belgisini qo‘shaylik.
Ravshanki, $c$ bilan tugaydigan ayrim yangi qism satrlar paydo bo‘ladi.
Oldin uchramagan shu yangi qism satrlar sonini hisoblamoqchimiz.

$t = s + c$ satrni olib, uni teskarisiga aylantiramiz.
Endi masala boshqa joyda uchramaydigan prefikslar sonini hisoblashga keladi.
Teskari $t$ satr prefiks funksiyasining maksimal qiymatini $\pi_{\text{max}}$ deb olsak, $s$ da uchraydigan eng uzun prefiks uzunligi $\pi_{\text{max}}$ bo‘ladi.
Ravshanki, undan qisqa barcha prefikslar ham uchraydi.

Demak, yangi $c$ belgi qo‘shilganda paydo bo‘ladigan yangi qism satrlar soni $|s| + 1 - \pi_{\text{max}}$ ga teng.

Har bir qo‘shilgan belgi uchun yangi qism satrlar sonini $O(n)$ vaqtda topamiz; umumiy murakkablik $O(n^2)$ bo‘ladi.

Turli qism satrlar sonini belgilarni satr boshiga qo‘shib, yoki satr boshi yoxud oxiridan belgilarni o‘chirib ham hisoblash mumkinligini qayd etish foydali.

### Satrni siqish

Uzunligi $n$ bo‘lgan $s$ satr berilgan.
Satrning eng qisqa “siqilgan” ko‘rinishini topmoqchimiz: shunday eng qisqa $t$ satr kerakki, $s$ ni $t$ ning bir yoki bir nechta nusxasi ketma-ket yozilishi sifatida ifodalash mumkin bo‘lsin.

Faqat $t$ uzunligini topish kifoya. Uzunlik ma’lum bo‘lsa, javob $s$ ning shu uzunlikdagi prefiksi bo‘ladi.

$s$ uchun prefiks funksiyani hisoblaymiz.
Uning oxirgi qiymati yordamida $k = n - \pi[n - 1]$ ni aniqlaymiz.
Agar $k$ soni $n$ ni bo‘lsa, javob $k$ bo‘lishini; aks holda samarali siqish yo‘q va javob $n$ ekanini ko‘rsatamiz.

$n$ soni $k$ ga bo‘linsin.
Satrni uzunligi $k$ bo‘lgan bloklarga ajratish mumkin.
Prefiks funksiya ta’rifiga ko‘ra, uzunligi $n-k$ bo‘lgan prefiks unga teng uzunlikdagi suffiksga teng.
Bu oxirgi blok undan oldingi blokka tengligini bildiradi.
Undan oldingi blok ham o‘zidan oldingisiga teng bo‘lishi kerak va hokazo.
Natijada barcha bloklar teng bo‘lib chiqadi, demak $s$ satrni uzunligi $k$ gacha siqish mumkin.

Bu haqiqatan optimal ekanini ham ko‘rsatish kerak.
Agar $k$ dan qisqaroq siqish mavjud bo‘lsa, satr oxiridagi prefiks funksiya qiymati $n-k$ dan katta bo‘lar edi.
Shuning uchun $k$ haqiqatan javobdir.

Endi $n$ soni $k$ ga bo‘linmasin.
Bu holda javob uzunligi $n$ ekanini ko‘rsatamiz.
Qarama-qarshilikdan isbotlaymiz.
Biror javob mavjud va siqilgan satr uzunligi $p$ bo‘lsin ($p$ soni $n$ ni bo‘ladi).
Unda prefiks funksiyaning oxirgi qiymati $n-p$ dan katta bo‘lishi, ya’ni suffiks birinchi blokni qisman qoplashi kerak.
Endi satrning ikkinchi blokini ko‘rib chiqamiz.
Prefiks suffiksga teng, ikkisi ham shu blokni qoplaydi va ularning o‘zaro siljishi $k$ blok uzunligi $p$ ni bo‘lmaydi (aks holda $k$ soni $n$ ni ham bo‘lardi); shuning uchun blokdagi barcha belgilar bir xil bo‘lishi kerak.
U holda butun satr bitta belgining takroridan iborat, demak uni uzunligi $1$ bo‘lgan satrgacha siqish mumkin. Bu $k = 1$ va $k$ soni $n$ ni bo‘lishini anglatadi.
Qarama-qarshilik.

$$\overbrace{s_0 ~ s_1 ~ s_2 ~ s_3}^p ~ \overbrace{s_4 ~ s_5 ~ s_6 ~ s_7}^p$$

$$s_0 ~ s_1 ~ s_2 ~ \underbrace{\overbrace{s_3 ~ s_4 ~ s_5 ~ s_6}^p ~ s_7}_{\pi[7] = 5}$$

$$s_4 = s_3, ~ s_5 = s_4, ~ s_6 = s_5, ~ s_7 = s_6 ~ \Rightarrow ~ s_0 = s_1 = s_2 = s_3$$

### Prefiks funksiya bo‘yicha avtomat qurish

Ikki satrni ajratgich orqali ulashga qaytamiz: $s$ va $t$ satrlar uchun $s + \# + t$ satrning prefiks funksiyasini hisoblaymiz.
$\#$ ajratgich bo‘lgani uchun prefiks funksiya qiymati hech qachon $|s|$ dan oshmaydi.
Shundan faqat $s + \#$ satr va uning prefiks funksiya qiymatlarini saqlash yetarli ekani kelib chiqadi; keyingi barcha belgilar uchun qiymatlarni kelishi bilan hisoblay olamiz:

$$\underbrace{s_0 ~ s_1 ~ \dots ~ s_{n-1} ~ \#}_{\text{need to store}} ~ \underbrace{t_0 ~ t_1 ~ \dots ~ t_{m-1}}_{\text{do not need to store}}$$

Haqiqatan, bunday vaziyatda $t$ dan keyingi $c$ belgini va oldingi pozitsiyadagi prefiks funksiya qiymatini bilish keyingi qiymatni hisoblash uchun yetarli; $t$ ning hech qanday oldingi belgilari yoki ulardagi prefiks funksiya qiymatlari kerak emas.

Boshqacha aytganda, **avtomat** — chekli holatlar mashinasini — qurish mumkin: uning holati joriy prefiks funksiya qiymati, bir holatdan boshqasiga o‘tish esa keyingi belgi orqali amalga oshadi.

$t$ satri hali berilmagan bo‘lsa ham, prefiks funksiya hisoblash algoritmining o‘zi bilan $(\text{old}_\pi, c) \rightarrow \text{new}_\pi$ o‘tishlar jadvalini qurish mumkin:

```{.cpp file=prefix_automaton_slow}
void compute_automaton(string s, vector<vector<int>>& aut) {
    s += '#';
    int n = s.size();
    vector<int> pi = prefix_function(s);
    aut.assign(n, vector<int>(26));
    for (int i = 0; i < n; i++) {
        for (int c = 0; c < 26; c++) {
            int j = i;
            while (j > 0 && 'a' + c != s[j])
                j = pi[j-1];
            if ('a' + c == s[j])
                j++;
            aut[i][c] = j;
        }
    }
}
```

Bu ko‘rinishda algoritm kichik lotin alifbosi uchun $O(n^2 26)$ vaqtda ishlaydi.
Ammo dinamik dasturlashdan foydalanib, jadvalning avval hisoblangan qismlarini qo‘llash mumkin.
$j$ qiymatdan $\pi[j-1]$ qiymatga o‘tganimizda, aslida $(j,c)$ o‘tishi $(\pi[j-1],c)$ o‘tishi bilan bir xil holatga olib borishini aytyapmiz; bu javob esa allaqachon aniq hisoblangan.

```{.cpp file=prefix_automaton_fast}
void compute_automaton(string s, vector<vector<int>>& aut) {
    s += '#';
    int n = s.size();
    vector<int> pi = prefix_function(s);
    aut.assign(n, vector<int>(26));
    for (int i = 0; i < n; i++) {
        for (int c = 0; c < 26; c++) {
            if (i > 0 && 'a' + c != s[i])
                aut[i][c] = aut[pi[i-1]][c];
            else
                aut[i][c] = i + ('a' + c == s[i]);
        }
    }
}
```

Natijada avtomatni $O(26n)$ vaqtda quramiz.

Bunday avtomat qachon foydali?
Avvalo, $s + \# + t$ satr uchun prefiks funksiyadan asosan bitta maqsadda — $s$ ning $t$ dagi barcha uchrashishlarini topishda — foydalanishimizni eslang.

Shu sababli avtomatning eng ravshan foydasi $s + \# + t$ uchun **prefiks funksiyani hisoblashni tezlashtirish**dir.
$s + \#$ uchun avtomat qurilgach, $s$ satrning o‘zini ham, undagi prefiks funksiya qiymatlarini ham saqlash shart emas.
Barcha o‘tishlar jadvalda oldindan hisoblangan.

Ammo ikkinchi, kamroq ravshan qo‘llanish ham bor.
$t$ satri muayyan qoidalar bo‘yicha qurilgan **nihoyatda katta satr** bo‘lsa, avtomatdan foydalanish mumkin.
Masalan, bu Gray satrlari yoki kirishdagi bir nechta qisqa satrlarning rekursiv birikmasidan tuzilgan satr bo‘lishi mumkin.

To‘liqlik uchun shunday masalani yechamiz:
$k \le 10^5$ son va uzunligi $\le 10^5$ bo‘lgan $s$ satr berilgan.
$s$ satr $k$-Gray satrida necha marta uchrashishini hisoblash kerak.
Gray satrlari quyidagicha aniqlanishini eslang:

$$\begin{align}
g_1 &= \text{"a"}\\
g_2 &= \text{"aba"}\\
g_3 &= \text{"abacaba"}\\
g_4 &= \text{"abacabadabacaba"}
\end{align}$$

Bunday hollarda $t$ satrni qurishning o‘zi ham imkonsiz, chunki uning uzunligi astronomik.
$k$-Gray satri uzunligi $2^k-1$.
Biroq satr boshidagi prefiks funksiya qiymatini bilgan holda, uning oxiridagi qiymatni samarali hisoblash mumkin.

Avtomatning o‘zidan tashqari, $G[i][j]$ qiymatlarni ham hisoblaymiz: bu $j$ holatdan boshlab $g_i$ satr qayta ishlangandan keyingi avtomat holati.
Bundan tashqari, $K[i][j]$ — $j$ holatdan boshlab $g_i$ ni qayta ishlash paytida $s$ satr necha marta uchrashishi.
Aslida $K[i][j]$ — amallar davomida prefiks funksiya $|s|$ qiymatini necha marta olganidir.
Masalaning javobi $K[k][0]$ bo‘ladi.

Bu qiymatlarni qanday hisoblaymiz?
Boshlang‘ich qiymatlar $G[0][j] = j$ va $K[0][j] = 0$.
Keyingi barcha qiymatlar oldingilar va avtomat yordamida hisoblanadi.
Biror $i$ uchun qiymatni hisoblashda $g_i$ satri $g_{i-1}$, alifboning $i$-belgisi va yana $g_{i-1}$ dan iboratligini eslaymiz.
Shuning uchun avtomat avval quyidagi holatga o‘tadi:

$$\text{mid} = \text{aut}[G[i-1][j]][i]$$

$$G[i][j] = G[i-1][\text{mid}]$$

$K[i][j]$ qiymatlar ham oson sanaladi:

$$K[i][j] = K[i-1][j] + (\text{mid} == |s|) + K[i-1][\text{mid}]$$

Shu tariqa Gray satrlari masalasini va xuddi shunday ko‘plab boshqa masalalarni yechish mumkin.
Masalan, ayni usul quyidagi masalani ham yechadi:
$s$ satr va bir nechta $t_i$ andozalar berilgan; har bir andoza oddiy belgilar satri bo‘lib, ichida oldingi satrlarning $t_k^{\text{cnt}}$ ko‘rinishidagi rekursiv qo‘yilmalari bo‘lishi mumkin. Bu belgilash shu joyga $t_k$ satrni $\text{cnt}$ marta qo‘yish kerakligini bildiradi.
Bunday andozalarga misol:

$$\begin{align}
t_1 &= \text{"abdeca"}\\
t_2 &= \text{"abc"} + t_1^{30} + \text{"abd"}\\
t_3 &= t_2^{50} + t_1^{100}\\
t_4 &= t_2^{10} + t_3^{100}
\end{align}$$

Rekursiv almashtirishlar satrni shunchalik kattalashtiradiki, uzunlik $100^{100}$ tartibiga yetishi mumkin.

Har bir satrda $s$ necha marta uchrashishini topish kerak.

Masala prefiks funksiya avtomatini qurib, keyin har bir andoza uchun o‘tishlarni oldingi natijalardan foydalanib hisoblash orqali aynan shu usulda yechiladi.

## Amaliy masalalar

* [UVA # 455 "Periodic Strings"](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=396)
* [UVA # 11022 "String Factoring"](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1963)
* [UVA # 11452 "Dancing the Cheeky-Cheeky"](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=2447)
* [UVA 12604 - Caesar Cipher](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4282)
* [UVA 12467 - Secret Word](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3911)
* [UVA 11019 - Matrix Matcher](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1960)
* [SPOJ - Pattern Find](http://www.spoj.com/problems/NAJPF/)
* [SPOJ - A Needle in the Haystack](https://www.spoj.com/problems/NHAY/)
* [Codeforces - Anthem of Berland](http://codeforces.com/contest/808/problem/G)
* [Codeforces - MUH and Cube Walls](http://codeforces.com/problemset/problem/471/D)
* [Codeforces - Prefixes and Suffixes](https://codeforces.com/contest/432/problem/D)

