---
article_id: graph--pruefer_code
---
# Prüfer kodi

Ushbu maqolada belgilangan daraxtni sonlar ketma-ketligiga yagona usulda kodlash imkonini beruvchi **Prüfer kodi** (yoki Prüfer ketma-ketligi) deb ataluvchi tushunchani ko‘rib chiqamiz.

Prüfer kodi yordamida **Cayley formulasini** (to‘liq grafdagi ostov daraxtlar sonini beruvchi formulani) isbotlaymiz.

Shuningdek, graf bog‘langan bo‘lishi uchun unga qirralar qo‘shish usullari sonini hisoblash masalasining yechimini ko‘rsatamiz.

**Eslatma:** bitta tugundan iborat daraxtlarni ko‘rib chiqmaymiz — bu bir nechta tasdiqlar o‘zaro zid keladigan maxsus holatdir.

## Prüfer kodi

Prüfer kodi $n$ ta tugunli belgilangan daraxtni $[0; n-1]$ oraliqdagi $n - 2$ ta butun son ketma-ketligi yordamida kodlash usulidir.

Bu kodlash to‘liq grafning barcha ostov daraxtlari bilan sonli ketma-ketliklar orasida **biyeksiya** ham hosil qiladi.

Ko‘rinishning o‘ziga xosligi sababli Prüfer kodidan daraxtni saqlash va u bilan amallar bajarishda foydalanish amaliy emas, ammo Prüfer kodlari tez-tez, asosan kombinatorik masalalarni yechishda qo‘llanadi.

Uning ixtirochisi Heinz Prüfer ushbu kodni 1918-yilda Cayley formulasining isboti sifatida taklif qilgan.

### Berilgan daraxt uchun Prüfer kodini qurish

Prüfer kodi quyidagicha quriladi.

Quyidagi protsedurani $n - 2$ marta takrorlaymiz:

daraxtdagi raqami eng kichik bargni tanlaymiz, uni daraxtdan olib tashlaymiz va u bilan bog‘langan tugun raqamini yozib olamiz.

$n - 2$ iteratsiyadan keyin faqat $2$ ta tugun qoladi va algoritm tugaydi.

Shunday qilib, berilgan daraxt uchun Prüfer kodi $n - 2$ ta sondan iborat ketma-ketlik bo‘lib, har bir son olib tashlangan barg bilan bog‘langan tugunning raqamidir; demak, bu son $[0, n-1]$ oraliqda bo‘ladi.

Prüfer kodini hisoblash algoritmini barcha joriy barglar ro‘yxatini saqlovchi minimumni chiqarib olish ma’lumotlar tuzilmasi (masalan, C++ dagi `set` yoki `priority_queue`) yordamida $O(n \log n)$ vaqt murakkabligida oson implementatsiya qilish mumkin.

```{.cpp file=pruefer_code_slow}
vector<vector<int>> adj;
vector<int> pruefer_code() {
    int n = adj.size();
    set<int> leafs;
    vector<int> degree(n);
    vector<bool> killed(n, false);
    for (int i = 0; i < n; i++) {
        degree[i] = adj[i].size();
        if (degree[i] == 1)
            leafs.insert(i);
    }

    vector<int> code(n - 2);
    for (int i = 0; i < n - 2; i++) {
        int leaf = *leafs.begin();
        leafs.erase(leafs.begin());
        killed[leaf] = true;
        int v;
        for (int u : adj[leaf]) {
            if (!killed[u])
                v = u;
        }

        code[i] = v;
        if (--degree[v] == 1)
            leafs.insert(v);
    }

    return code;
}
```

Biroq bu qurishni chiziqli vaqtda ham implementatsiya qilish mumkin.

Bunday yondashuv keyingi bo‘limda tavsiflanadi.

### Berilgan daraxt uchun Prüfer kodini chiziqli vaqtda qurish

Algoritmning mohiyati biz olib tashlamoqchi bo‘lgan joriy barg tugunga doimo ishora qilib turadigan **harakatlanuvchi ko‘rsatkich**dan foydalanishdir.

Bir qarashda bu imkonsizdek tuyuladi, chunki Prüfer kodini qurish jarayonida bargning raqami ham oshishi, ham kamayishi mumkin.

Ammo chuqurroq qaralsa, aslida bunday emas.

Barglar soni oshmaydi. U yoki bittaga kamayadi (bitta barg tugunni olib tashlaymiz va yangi barg hosil bo‘lmaydi), yoki o‘zgarmaydi (bitta barg tugunni olib tashlab, boshqa bir yangi barg hosil qilamiz).

Birinchi holatda keyingi eng kichik barg tugunni qidirishdan boshqa yo‘l yo‘q.

Ikkinchi holatda esa yangi bargga aylangan tugundan foydalanishni davom ettirish mumkinmi yoki keyingi eng kichik bargni qidirish kerakmi, buni $O(1)$ vaqtda aniqlash mumkin.

Ko‘p hollarda yangi barg tugun bilan davom etishimiz mumkin.

Buning uchun $0$ dan $\text{ptr}$ gacha bo‘lgan tugunlar to‘plamida ko‘pi bilan bitta barg — aynan joriy barg — borligini bildiradigan $\text{ptr}$ o‘zgaruvchidan foydalanamiz.

Ushbu oraliqdagi boshqa barcha tugunlar daraxtdan allaqachon olib tashlangan yoki hali ham bittadan ortiq qo‘shni tugunga ega.

Shu bilan birga, $\text{ptr}$ dan katta birorta barg tugunni hali olib tashlamadik, deb hisoblaymiz.

Bu o‘zgaruvchi birinchi holatdayoq juda foydali.

Joriy barg tugun olib tashlangach, $0$ dan $\text{ptr}$ gacha oraliqda barg tugun bo‘la olmasligini bilamiz; demak, keyingi bargni qidirishni yana $0$ tugundan emas, bevosita $\text{ptr} + 1$ dan boshlashimiz mumkin.

Ikkinchi holatni esa yana ikki qismga ajratamiz:

Yangi hosil bo‘lgan barg tugun $\text{ptr}$ dan kichik bo‘lsa, u keyingi barg tugun bo‘lishi shart, chunki $\text{ptr}$ dan kichik boshqa tugun yo‘qligini bilamiz.

Yoki yangi hosil bo‘lgan barg tugun kattaroq bo‘ladi.

Bu holda u $\text{ptr}$ dan ham katta bo‘lishi shartligini bilamiz va qidirishni yana $\text{ptr} + 1$ dan boshlashimiz mumkin.

Keyingi barg tugunni topish uchun bir nechta chiziqli qidiruv bajarishimiz mumkin bo‘lsa-da, $\text{ptr}$ ko‘rsatkich faqat oshadi; shu sababli umumiy vaqt murakkabligi $O(n)$.

```{.cpp file=pruefer_code_fast}
vector<vector<int>> adj;
vector<int> parent;

void dfs(int v) {
    for (int u : adj[v]) {
        if (u != parent[v]) {
            parent[u] = v;
            dfs(u);
        }
    }
}
vector<int> pruefer_code() {
    int n = adj.size();
    parent.resize(n);
    parent[n-1] = -1;
    dfs(n-1);

    int ptr = -1;
    vector<int> degree(n);
    for (int i = 0; i < n; i++) {
        degree[i] = adj[i].size();
        if (degree[i] == 1 && ptr == -1)
            ptr = i;
    }
    vector<int> code(n - 2);
    int leaf = ptr;
    for (int i = 0; i < n - 2; i++) {
        int next = parent[leaf];
        code[i] = next;
        if (--degree[next] == 1 && next < ptr) {
            leaf = next;
        } else {
            ptr++;
            while (degree[ptr] != 1)
                ptr++;
            leaf = ptr;
        }
    }

    return code;
}
```

Kodda avval har bir tugun uchun uning `parent[i]` ajdodini, ya’ni bu tugun daraxtdan olib tashlanganda ega bo‘ladigan ajdodini topamiz.

Bu ajdodni daraxtga $n-1$ tugunda ildiz berish orqali topish mumkin.

Buning iloji bor, chunki $n-1$ tugun hech qachon daraxtdan olib tashlanmaydi.

Shuningdek, har bir tugunning darajasini hisoblaymiz.

`ptr` — qolgan barg tugunlarning (joriy `leaf` tugundan tashqari) eng kichik raqamini bildiruvchi ko‘rsatkich.

Agar `next` tugun ham barg bo‘lsa va `ptr` dan kichik bo‘lsa, uni joriy barg sifatida olamiz; aks holda ko‘rsatkichni oshirib, eng kichik barg tugunni chiziqli qidirishni boshlaymiz.

Bu kodning murakkabligi $O(n)$ ekanini oson ko‘rish mumkin.

### Prüfer kodining ayrim xossalari

- Prüfer kodi qurilgach, ikkita tugun qoladi. Ulardan biri eng katta raqamli $n-1$ tugun, ammo ikkinchi tugun haqida boshqa hech narsa aytib bo‘lmaydi.
- Har bir tugun Prüfer kodida aniq belgilangan miqdorda — uning darajasidan bir marta kam — uchraydi. Buni oson tekshirish mumkin, chunki uning belgisi kodga yozilgan har safar darajasi kamayadi va daraja $1$ ga yetgach, tugun olib tashlanadi. Qolgan ikki tugun uchun ham bu xossa to‘g‘ri.

### Prüfer kodi yordamida daraxtni tiklash

Daraxtni tiklash uchun avvalgi bo‘limda muhokama qilingan xossaning o‘ziga e’tibor qaratish kifoya.

Kerakli daraxtdagi barcha tugunlarning darajalarini allaqachon bilamiz.

Shu sababli barcha barg tugunlarni, shuningdek birinchi qadamda olib tashlangan birinchi bargni ham topishimiz mumkin (u eng kichik barg bo‘lishi kerak).

Bu barg tugun Prüfer kodining birinchi katagidagi songa mos tugun bilan bog‘langan edi.

Shu tariqa Prüfer kodi hosil qilingan vaqtda olib tashlangan birinchi qirrani topdik.

Bu qirrani javobga qo‘shib, qirraning ikkala uchidagi darajalarni kamaytirishimiz mumkin.

Prüfer kodidagi barcha sonlardan foydalanib bo‘lguncha ushbu amalni takrorlaymiz:

darajasi $1$ ga teng eng kichik tugunni topamiz, uni Prüfer kodidagi keyingi tugun bilan bog‘laymiz va darajani kamaytiramiz.

Oxirida darajasi $1$ ga teng faqat ikkita tugun qoladi.

Bular Prüfer kodini qurish jarayonida olib tashlanmagan tugunlardir.

Daraxtning oxirgi qirrasini hosil qilish uchun ularni o‘zaro bog‘laymiz.

Ulardan biri har doim $n-1$ tugun bo‘ladi.

Ushbu algoritmni $O(n \log n)$ vaqtda oson **implementatsiya** qilish mumkin: barcha barg tugunlarni saqlash uchun minimumni chiqarib olishni qo‘llab-quvvatlaydigan ma’lumotlar tuzilmasidan (masalan, C++ dagi `set<>` yoki `priority_queue<>`) foydalanamiz.

Quyidagi implementatsiya daraxtga mos qirralar ro‘yxatini qaytaradi.

```{.cpp file=pruefer_decode_slow}
vector<pair<int, int>> pruefer_decode(vector<int> const& code) {
    int n = code.size() + 2;
    vector<int> degree(n, 1);
    for (int i : code)
        degree[i]++;

    set<int> leaves;
    for (int i = 0; i < n; i++) {
        if (degree[i] == 1)
            leaves.insert(i);
    }
    vector<pair<int, int>> edges;
    for (int v : code) {
        int leaf = *leaves.begin();
        leaves.erase(leaves.begin());

        edges.emplace_back(leaf, v);
        if (--degree[v] == 1)
            leaves.insert(v);
    }
    edges.emplace_back(*leaves.begin(), n-1);
    return edges;
}
```

### Prüfer kodi yordamida daraxtni chiziqli vaqtda tiklash

Daraxtni chiziqli vaqtda olish uchun Prüfer kodini chiziqli vaqtda qurishda ishlatilgan usulning o‘zini qo‘llash mumkin.

Minimumni chiqarib olish uchun ma’lumotlar tuzilmasi kerak emas.

Buning o‘rniga joriy qirra qayta ishlangach, faqat bitta tugun bargga aylanishini kuzatishimiz mumkin.

Demak, shu tugun bilan davom etamiz yoki ko‘rsatkichni siljitib, chiziqli qidiruv yordamida undan kichikroq bargni topamiz.

```{.cpp file=pruefer_decode_fast}
vector<pair<int, int>> pruefer_decode(vector<int> const& code) {
    int n = code.size() + 2;
    vector<int> degree(n, 1);
    for (int i : code)
        degree[i]++;

    int ptr = 0;
    while (degree[ptr] != 1)
        ptr++;
    int leaf = ptr;
    vector<pair<int, int>> edges;
    for (int v : code) {
        edges.emplace_back(leaf, v);
        if (--degree[v] == 1 && v < ptr) {
            leaf = v;
        } else {
            ptr++;
            while (degree[ptr] != 1)
                ptr++;
            leaf = ptr;
        }
    }
    edges.emplace_back(leaf, n-1);
    return edges;
}
```

### Daraxtlar va Prüfer kodlari orasidagi biyeksiya

Har bir daraxt uchun unga mos Prüfer kodi mavjud.

Har bir Prüfer kodidan esa boshlang‘ich daraxtni tiklashimiz mumkin.

Bundan har bir Prüfer kodi (ya’ni $[0; n - 1]$ oraliqdagi $n-2$ ta son ketma-ketligi) ham biror daraxtga mos kelishi kelib chiqadi.

Shuning uchun barcha daraxtlar va barcha Prüfer kodlari orasida biyeksiya (**bir-biriga bir qiymatli moslik**) mavjud.

## Cayley formulasi

Cayley formulasiga ko‘ra, $n$ ta tugunli **to‘liq belgilangan grafdagi ostov daraxtlar soni** quyidagiga teng:

$$n^{n-2}$$

Bu formula uchun bir nechta isbot mavjud.

Prüfer kodi tushunchasi yordamida bu tasdiq mutlaqo tabiiy kelib chiqadi.

Darhaqiqat, $[0; n-1]$ oraliqdan olingan $n-2$ ta sondan iborat istalgan Prüfer kodi $n$ ta tugunli biror daraxtga mos keladi.

Bunday turli Prüfer kodlari soni $n^{n-2}$ ga teng.

Bunday har bir daraxt $n$ ta tugunli to‘liq grafning ostov daraxti bo‘lgani sababli, ostov daraxtlar soni ham $n^{n-2}$.

## Grafni bog‘langan qilish usullari soni

Prüfer kodlari tushunchasi bundan ham kuchliroq.

U Cayley formulasidan ancha umumiy formulalarni hosil qilish imkonini beradi.

Ushbu masalada bizga $n$ ta tugun va $m$ ta qirraga ega graf berilgan.

Grafda ayni vaqtda $k$ ta komponent mavjud.

Graf bog‘langan bo‘lishi uchun $k-1$ ta qirra qo‘shish usullari sonini hisoblamoqchimiz (ravshanki, $k-1$ — grafni bog‘langan qilish uchun zarur bo‘lgan minimal qirralar soni).

Bu masalani yechuvchi formulani keltirib chiqaramiz.

Grafdagi bog‘langan komponentlarning o‘lchamlarini $s_1, \dots, s_k$ bilan belgilaymiz.

Bir bog‘langan komponent ichida qirra qo‘sha olmaymiz.

Shu sababli bu masala $k$ ta tugunli to‘liq grafning ostov daraxtlari sonini qidirishga juda o‘xshaydi.

Yagona farq shuki, har bir tugunning asl “o‘lchami” $s_i$: $i$ tugun bilan bog‘langan har bir qirra aslida javobni $s_i$ ga ko‘paytiradi.

Shunday qilib, mumkin bo‘lgan usullar sonini hisoblash uchun bog‘lovchi daraxtda $k$ tugunning har biri necha marta ishlatilishini hisoblash muhim.

Masala formulasini olish uchun barcha mumkin bo‘lgan darajalar bo‘yicha javobni yig‘ish kerak.

Tugunlarni bog‘lagandan keyingi daraxtdagi tugun darajalari $d_1, \dots, d_k$ bo‘lsin.

Darajalar yig‘indisi qirralar sonining ikki baravariga teng:

$$\sum_{i=1}^k d_i = 2k - 2$$

Agar $i$ tugunning darajasi $d_i$ bo‘lsa, u Prüfer kodida $d_i - 1$ marta uchraydi.

$k$ ta tugunli daraxtning Prüfer kodi uzunligi $k-2$.

Demak, $i$ soni aynan $d_i - 1$ marta uchraydigan $k-2$ ta sonli kodni tanlash usullari soni **multinomial koeffitsiyent**ga teng:

$$\binom{k-2}{d_1-1, d_2-1, \dots, d_k-1} = \frac{(k-2)!}{(d_1-1)! (d_2-1)! \cdots (d_k-1)!}.$$

$i$ tugunga tutash har bir qirra javobni $s_i$ ga ko‘paytirishini hisobga olib, tugun darajalari $d_1, \dots, d_k$ deb faraz qilgandagi javobni olamiz:

$$s_1^{d_1} \cdot s_2^{d_2} \cdots s_k^{d_k} \cdot \binom{k-2}{d_1-1, d_2-1, \dots, d_k-1}$$

Yakuniy javobni olish uchun darajalarni tanlashning barcha mumkin bo‘lgan usullari bo‘yicha buni yig‘ishimiz kerak:

$$\sum_{\substack{d_i \ge 1 \\ \sum_{i=1}^k d_i = 2k -2}} s_1^{d_1} \cdot s_2^{d_2} \cdots s_k^{d_k} \cdot \binom{k-2}{d_1-1, d_2-1, \dots, d_k-1}$$

Hozircha bu juda noqulay javobdek ko‘rinadi, ammo quyidagini aytadigan **multinomial teorema**dan foydalanishimiz mumkin:

$$(x_1 + \dots + x_m)^p = \sum_{\substack{c_i \ge 0 \\ \sum_{i=1}^m c_i = p}} x_1^{c_1} \cdot x_2^{c_2} \cdots x_m^{c_m} \cdot \binom{p}{c_1, c_2, \dots c_m}$$

Bu allaqachon formulamizga juda o‘xshaydi.

Undan foydalanish uchun faqat $e_i = d_i - 1$ almashtirishni bajarish kerak:

$$\sum_{\substack{e_i \ge 0 \\ \sum_{i=1}^k e_i = k - 2}} s_1^{e_1+1} \cdot s_2^{e_2+1} \cdots s_k^{e_k+1} \cdot \binom{k-2}{e_1, e_2, \dots, e_k}$$

Multinomial teoremani qo‘llagach, **masalaning javobi**ni olamiz:

$$s_1 \cdot s_2 \cdots s_k \cdot (s_1 + s_2 + \dots + s_k)^{k-2} = s_1 \cdot s_2 \cdots s_k \cdot n^{k-2}$$

Tasodifan, bu formula $k = 1$ uchun ham to‘g‘ri.

## Amaliy masalalar

- [UVA #10843 - Anne's game](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=20&page=show_problem&problem=1784)
- [Timus #1069 - Prufer Code](http://acm.timus.ru/problem.aspx?space=1&num=1069)
- [Codeforces - Clues](http://codeforces.com/contest/156/problem/D)
- [Topcoder - TheCitiesAndRoadsDivTwo](https://community.topcoder.com/stat?c=problem_statement&pm=10774&rd=14146)

