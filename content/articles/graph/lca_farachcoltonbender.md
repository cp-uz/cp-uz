---
article_id: graph--lca_farachcoltonbender
---
# Eng yaqin umumiy ajdod — Farach–Colton va Bender algoritmi

$G$ daraxt bo‘lsin.

Har bir $(u, v)$ ko‘rinishidagi so‘rov uchun $u$ va $v$ tugunlarning eng yaqin umumiy ajdodini topmoqchimiz; ya’ni $u$ dan ildizgacha yo‘lda ham, $v$ dan ildizgacha yo‘lda ham yotadigan va bunday tugunlar bir nechta bo‘lsa, ildizdan eng uzoq joylashgan $w$ tugunni topamiz.

Boshqacha aytganda, kerakli $w$ tugun $u$ va $v$ ning eng quyi ajdodidir.

Xususan, $u$ tugun $v$ ning ajdodi bo‘lsa, $u$ ularning eng yaqin umumiy ajdodi bo‘ladi.

Ushbu maqolada tavsiflanadigan algoritm Farach–Colton va Bender tomonidan ishlab chiqilgan.

U asimptotik jihatdan optimal.

## Algoritm

LCA masalasini RMQ masalasiga klassik keltirishdan foydalanamiz.

Daraxtning barcha tugunlarini [DFS](depth-first-search.md) yordamida aylanib chiqamiz va barcha tashrif buyurilgan tugunlar hamda ularning balandliklari saqlanadigan massiv tuzamiz.

Ikki $u$ va $v$ tugunning LCA si turdagi $u$ va $v$ uchrashlari orasida joylashgan, balandligi eng kichik tugundir.

Quyidagi rasmda graf uchun mumkin bo‘lgan Euler turini, uning ostidagi ro‘yxatda esa tashrif buyurilgan tugunlar va ularning balandliklarini ko‘rishingiz mumkin.

<div style="text-align: center;">
  <img src="LCA_Euler.png" alt="LCA uchun Euler turi">
</div>

$$\begin{array}{|l|c|c|c|c|c|c|c|c|c|c|c|c|c|}
\hline
\text{Tugunlar:}   & 1 & 2 & 5 & 2 & 6 & 2 & 1 & 3 & 1 & 4 & 7 & 4 & 1 \\ \hline
\text{Balandliklar:} & 1 & 2 & 3 & 2 & 3 & 2 & 1 & 2 & 1 & 2 & 3 & 2 & 1 \\ \hline
\end{array}$$

Bu keltirish haqida [Eng yaqin umumiy ajdod](lca.md) maqolasida batafsil o‘qishingiz mumkin.

O‘sha maqolada oraliq minimumi sqrt-dekompozitsiya yordamida $O(\sqrt{N})$ vaqtda yoki segment daraxti yordamida $O(\log N)$ vaqtda topilgan.

Ushbu maqolada berilgan oraliq minimum so‘rovlarini oldindan ishlov uchun hamon atigi $O(N)$ vaqt sarflagan holda, $O(1)$ vaqtda qanday yechish mumkinligini ko‘rib chiqamiz.

Keltirilgan RMQ masalasi juda maxsus ekaniga e’tibor bering:

massivdagi istalgan ikkita qo‘shni element aniq birga farq qiladi (chunki massiv elementlari yurish tartibida tashrif buyurilgan tugunlarning balandliklaridan boshqa narsa emas; biz yoki avlod tugunga tushamiz, bunda keyingi element birga katta bo‘ladi, yoki ajdodga qaytamiz, bunda keyingi element birga kichik bo‘ladi).

Farach–Colton va Bender algoritmi aynan shu maxsus RMQ masalasining yechimini tavsiflaydi.

Oraliq minimum so‘rovlarini bajaradigan massivni $A$ bilan belgilaylik.

$N$ esa $A$ ning o‘lchami bo‘lsin.

RMQ masalasini $O(N \log N)$ oldindan ishlov va har bir so‘rov uchun $O(1)$ vaqtda yechadigan sodda ma’lumotlar tuzilmasi mavjud: [Sparse Table](../data_structures/sparse-table.md).

Har bir $T[i][j]$ elementi $A$ massivning $[i, i + 2^j - 1]$ oralig‘idagi minimumiga teng bo‘lgan $T$ jadvalini yaratamiz.

Ravshanki, $0 \leq j \leq \lceil \log N \rceil$, demak Sparse Table o‘lchami $O(N \log N)$ bo‘ladi.

$T[i][j] = \min(T[i][j-1], T[i+2^{j-1}][j-1])$ ekanini qayd etib, jadvalni $O(N \log N)$ vaqtda oson qurish mumkin.

Bu ma’lumotlar tuzilmasi yordamida RMQ so‘roviga $O(1)$ vaqtda qanday javob beramiz?

So‘rov $[l, r]$ bo‘lsin. Javob $\min(T[l][\text{sz}], T[r-2^{\text{sz}}+1][\text{sz}])$ ga teng, bunda $\text{sz}$ — $2^{\text{sz}}$ qiymati $r-l+1$ oraliq uzunligidan katta bo‘lmagan eng katta daraja.

Darhaqiqat, $[l, r]$ oraliqni uzunligi $2^{\text{sz}}$ bo‘lgan ikkita kesma bilan — biri $l$ dan boshlanadigan, ikkinchisi $r$ da tugaydigan kesma bilan — qoplash mumkin.

Bu kesmalar ustma-ust tushadi, ammo bu hisoblashga xalaqit bermaydi.

Har bir so‘rovga haqiqatan $O(1)$ vaqt murakkabligida javob berish uchun $1$ dan $N$ gacha barcha mumkin bo‘lgan uzunliklar uchun $\text{sz}$ qiymatlarini bilishimiz kerak.

Ammo ularni oson oldindan hisoblash mumkin.

Endi oldindan ishlov murakkabligini $O(N)$ gacha yaxshilamoqchimiz.

$A$ massivni $K = 0.5 \log N$ o‘lchamli bloklarga bo‘lamiz; bu yerda $\log$ — asos 2 bo‘yicha logarifm.

Har bir blok uchun minimal elementni hisoblab, ularni $B$ massivda saqlaymiz.

$B$ ning o‘lchami $\frac{N}{K}$.

$B$ massivdan Sparse Table quramiz.

Uning o‘lchami va vaqt murakkabligi quyidagicha bo‘ladi:

$$\frac{N}{K}\log\left(\frac{N}{K}\right) = \frac{2N}{\log(N)} \log\left(\frac{2N}{\log(N)}\right) =$$

$$= \frac{2N}{\log(N)} \left(1 + \log\left(\frac{N}{\log(N)}\right)\right) \leq \frac{2N}{\log(N)} + 2N = O(N)$$

Endi faqat har bir blok ichidagi oraliq minimum so‘rovlariga tez javob berishni o‘rganish qoladi.

Darhaqiqat, olingan oraliq minimum so‘rovi $[l, r]$ bo‘lib, $l$ va $r$ turli bloklarda yotsa, javob quyidagi uch qiymatning minimumidir:

$l$ blokining $l$ dan boshlanuvchi suffiksi minimumi, $r$ blokining $r$ da tugaydigan prefiksi minimumi va ular orasidagi bloklar minimumi.

Oradagi bloklar minimumiga Sparse Table yordamida $O(1)$ vaqtda javob berish mumkin.

Demak, faqat bloklar ichidagi oraliq minimum so‘rovlari qoladi.

Bu yerda massivning maxsus xossasidan foydalanamiz.

Massivdagi qiymatlar — daraxtdagi balandliklar — har doim birga farq qilishini eslang.

Blokning birinchi elementini olib tashlab, uni blokdagi boshqa har bir elementdan ayirsak, har bir blokni $+1$ va $-1$ sonlaridan iborat uzunligi $K - 1$ bo‘lgan ketma-ketlik orqali aniqlash mumkin.

Bloklar juda kichik bo‘lgani sababli, uchrashi mumkin bo‘lgan turli ketma-ketliklar soni ham oz.

Mumkin bo‘lgan ketma-ketliklar soni:

$$2^{K-1} = 2^{0.5 \log(N) - 1} = 0.5 \left(2^{\log(N)}\right)^{0.5} = 0.5 \sqrt{N}$$

Shunday qilib, turli bloklar soni $O(\sqrt{N})$; demak, barcha turli bloklar ichidagi oraliq minimum so‘rovlari natijalarini $O(\sqrt{N} K^2) = O(\sqrt{N} \log^2(N)) = O(N)$ vaqtda oldindan hisoblash mumkin.

Implementatsiyada blokni uzunligi $K-1$ bo‘lgan bit niqob (u odatiy `int` ga sig‘adi) bilan tavsiflab, minimum indeksini o‘lchami $O(\sqrt{N} \log^2(N))$ bo‘lgan $\text{block}[\text{mask}][l][r]$ massivida saqlash mumkin.

Shunday qilib, har bir blok ichidagi oraliq minimum so‘rovlarini ham, bloklar oralig‘idagi so‘rovlarni ham jami $O(N)$ vaqtda oldindan hisoblashni o‘rgandik.

Bu oldindan hisoblangan ma’lumotlar bilan har bir so‘rovga ko‘pi bilan to‘rtta tayyor qiymat yordamida $O(1)$ vaqtda javob berish mumkin: `l` ni o‘z ichiga oluvchi blok minimumi, `r` ni o‘z ichiga oluvchi blok minimumi va ular orasidagi bloklarni qoplovchi ustma-ust ikkita kesmaning minimumlari.

## Implementatsiya

```cpp
int n;
vector<vector<int>> adj;

int block_size, block_cnt;
vector<int> first_visit;
vector<int> euler_tour;
vector<int> height;
vector<int> log_2;
vector<vector<int>> st;
vector<vector<vector<int>>> blocks;
vector<int> block_mask;
void dfs(int v, int p, int h) {
    first_visit[v] = euler_tour.size();
    euler_tour.push_back(v);
    height[v] = h;

    for (int u : adj[v]) {
        if (u == p)
            continue;
        dfs(u, v, h + 1);
        euler_tour.push_back(v);
    }
}

int min_by_h(int i, int j) {
    return height[euler_tour[i]] < height[euler_tour[j]] ? i : j;
}
void precompute_lca(int root) {
    // get euler tour & indices of first occurrences
    first_visit.assign(n, -1);
    height.assign(n, 0);
    euler_tour.reserve(2 * n);
    dfs(root, -1, 0);

    // precompute all log values
    int m = euler_tour.size();
    log_2.reserve(m + 1);
    log_2.push_back(-1);
    for (int i = 1; i <= m; i++)
        log_2.push_back(log_2[i / 2] + 1);

    block_size = max(1, log_2[m] / 2);
    block_cnt = (m + block_size - 1) / block_size;
    // precompute minimum of each block and build sparse table
    st.assign(block_cnt, vector<int>(log_2[block_cnt] + 1));
    for (int i = 0, j = 0, b = 0; i < m; i++, j++) {
        if (j == block_size)
            j = 0, b++;
        if (j == 0 || min_by_h(i, st[b][0]) == i)
            st[b][0] = i;
    }
    for (int l = 1; l <= log_2[block_cnt]; l++) {
        for (int i = 0; i < block_cnt; i++) {
            int ni = i + (1 << (l - 1));
            if (ni >= block_cnt)
                st[i][l] = st[i][l-1];
            else
                st[i][l] = min_by_h(st[i][l-1], st[ni][l-1]);
        }
    }
    // precompute mask for each block
    block_mask.assign(block_cnt, 0);
    for (int i = 0, j = 0, b = 0; i < m; i++, j++) {
        if (j == block_size)
            j = 0, b++;
        if (j > 0 && (i >= m || min_by_h(i - 1, i) == i - 1))
            block_mask[b] += 1 << (j - 1);
    }
    // precompute RMQ for each unique block
    int possibilities = 1 << (block_size - 1);
    blocks.resize(possibilities);
    for (int b = 0; b < block_cnt; b++) {
        int mask = block_mask[b];
        if (!blocks[mask].empty())
            continue;
        blocks[mask].assign(block_size, vector<int>(block_size));
        for (int l = 0; l < block_size; l++) {
            blocks[mask][l][l] = l;
            for (int r = l + 1; r < block_size; r++) {
                blocks[mask][l][r] = blocks[mask][l][r - 1];
                if (b * block_size + r < m)
                    blocks[mask][l][r] = min_by_h(b * block_size + blocks[mask][l][r],
                            b * block_size + r) - b * block_size;
            }
        }
    }
}
int lca_in_block(int b, int l, int r) {
    return blocks[block_mask[b]][l][r] + b * block_size;
}
int lca(int v, int u) {
    int l = first_visit[v];
    int r = first_visit[u];
    if (l > r)
        swap(l, r);
    int bl = l / block_size;
    int br = r / block_size;
    if (bl == br)
        return euler_tour[lca_in_block(bl, l % block_size, r % block_size)];
    int ans1 = lca_in_block(bl, l % block_size, block_size - 1);
    int ans2 = lca_in_block(br, 0, r % block_size);
    int ans = min_by_h(ans1, ans2);
    if (bl + 1 < br) {
        int l = log_2[br - bl - 1];
        int ans3 = st[bl+1][l];
        int ans4 = st[br - (1 << l)][l];
        ans = min_by_h(ans, min_by_h(ans3, ans4));
    }
    return euler_tour[ans];
}
```

