---
article_id: graph--lca_tarjan
---
# Eng yaqin umumiy ajdod — Tarjanning offlayn algoritmi

Bizda $n$ ta tugunli $G$ daraxti va $(u, v)$ ko‘rinishidagi $m$ ta so‘rov bor.

Har bir $(u, v)$ so‘rov uchun $u$ va $v$ tugunlarning eng yaqin umumiy ajdodini, ya’ni ikkalasiga ham ajdod bo‘lgan va daraxtdagi chuqurligi eng katta tugunni topmoqchimiz.

$v$ tugun o‘zining ham ajdodi hisoblanadi, shuning uchun LCA so‘rovdagi ikki tugundan biri bo‘lishi ham mumkin.

Ushbu maqolada masalani offlayn tarzda yechamiz, ya’ni barcha so‘rovlar oldindan ma’lum deb hisoblaymiz va ularga istalgan tartibda javob beramiz.

Quyidagi algoritm barcha $m$ ta so‘rovga jami $O(n + m)$ vaqtda, ya’ni $m$ yetarlicha katta bo‘lganda har bir so‘rovga $O(1)$ dan javob berish imkonini beradi.

## Algoritm

Algoritm uni 1979-yilda kashf etgan Robert Tarjan nomi bilan atalgan; Tarjan ushbu algoritmda keng qo‘llanadigan [kesishmaydigan to‘plamlar birlashmasi](../data_structures/disjoint_set_union.md) ma’lumotlar tuzilmasiga ham ko‘plab hissa qo‘shgan.

Algoritm daraxt bo‘ylab bitta [DFS](depth-first-search.md) yurishi bilan barcha so‘rovlarga javob beradi.

Aniqrog‘i, $(u, v)$ so‘rovga $u$ tugunda, agar $v$ tugunga avval tashrif buyurilgan bo‘lsa, yoki aksincha javob beriladi.

Hozir $v$ tugunda turibmiz, rekursiv DFS chaqiruvlarini allaqachon bajardik va $(u, v)$ so‘rovning ikkinchi $u$ tuguniga ham avval tashrif buyurdik, deb faraz qilaylik.

Bu ikki tugunning LCA sini qanday topishni o‘rganamiz.

$\text{LCA}(u, v)$ yoki $v$ tugunning o‘zi, yoki uning ajdodlaridan biri ekaniga e’tibor bering.

Demak, $v$ ning ajdodlari (shu jumladan $v$ ning o‘zi) orasidan $u$ tugun avlodi bo‘ladigan eng quyi tugunni topishimiz kerak.

Shuningdek, belgilangan $v$ uchun daraxtning tashrif buyurilgan tugunlari o‘zaro kesishmaydigan to‘plamlarga bo‘linishiga e’tibor bering.

$v$ tugunning har bir $p$ ajdodi o‘ziga tegishli to‘plamga ega; bu to‘plamda $p$ tugun va ildizdan $v$ gacha yo‘lga kirmaydigan bolalarining ildizli barcha qismdaraxtlari mavjud.

$u$ tugunni o‘z ichiga oluvchi to‘plam $\text{LCA}(u, v)$ ni aniqlaydi:

LCA shu to‘plamning vakili, ya’ni $v$ bilan daraxt ildizi orasidagi yo‘lda yotadigan tugundir.

Faqat bu to‘plamlarning barchasini samarali saqlashni o‘rganish kerak.

Buning uchun DSU ma’lumotlar tuzilmasidan foydalanamiz.

Rank bo‘yicha birlashtirishni qo‘llay olish uchun har bir to‘plamning haqiqiy vakilini ($v$ bilan daraxt ildizi orasidagi yo‘ldagi qiymatni) `ancestor` massivida saqlaymiz.

DFS implementatsiyasini muhokama qilamiz.

Hozir $v$ tugunga tashrif buyurayotganimizni faraz qilaylik.

Tugunni DSU dagi yangi to‘plamga joylaymiz, `ancestor[v] = v`.

Odatdagidek, $v$ ning barcha bolalarini qayta ishlaymiz.

Buning uchun avval o‘sha tugundan rekursiv DFS chaqiramiz, keyin bu tugunni butun qismdaraxti bilan $v$ ning to‘plamiga qo‘shamiz.

Buni `union_sets` funksiyasi va undan keyingi `ancestor[find_set(v)] = v` o‘zlashtirish yordamida bajarish mumkin (`union_sets` to‘plam vakilini o‘zgartirishi mumkinligi sababli bu o‘zlashtirish zarur).

Nihoyat, barcha bolalarni qayta ishlagach, $u$ tugunga allaqachon tashrif buyurilgan barcha $(u, v)$ so‘rovlarga javob bera olamiz.

So‘rov javobi, ya’ni $u$ va $v$ ning LCA si `ancestor[find_set(u)]` tugun bo‘ladi.

Har bir so‘rovga faqat bir marta javob berilishini oson ko‘rish mumkin.

Algoritmning vaqt murakkabligini aniqlaymiz.

Birinchidan, DFS sababli $O(n)$ vaqt sarflanadi.

Ikkinchidan, `union_sets` funksiyasi $n$ marta chaqiriladi, bu ham jami $O(n)$ beradi.

Uchinchidan, har bir so‘rov uchun `find_set` chaqiriladi, bu $O(m)$ beradi.

Shunday qilib, umumiy vaqt murakkabligi $O(n + m)$; $m$ yetarlicha katta bo‘lganda bu bitta so‘rovga $O(1)$ vaqtga mos keladi.

## Implementatsiya

Quyida ushbu algoritm implementatsiyasi keltirilgan.

DSU implementatsiyasi kiritilmagan, chunki undan hech qanday o‘zgartirishsiz foydalanish mumkin.

```cpp
vector<vector<int>> adj;
vector<vector<int>> queries;
vector<int> ancestor;
vector<bool> visited;
void dfs(int v)
{
    visited[v] = true;
    ancestor[v] = v;
    for (int u : adj[v]) {
        if (!visited[u]) {
            dfs(u);
            union_sets(v, u);
            ancestor[find_set(v)] = v;
        }
    }
    for (int other_node : queries[v]) {
        if (visited[other_node])
            cout << "LCA of " << v << " and " << other_node
                 << " is " << ancestor[find_set(other_node)] << ".\n";
    }
}
void compute_LCAs() {
    // initialize n, adj and DSU
    // for (each query (u, v)) {
    //    queries[u].push_back(v);
    //    queries[v].push_back(u);
    // }

    ancestor.resize(n);
    visited.assign(n, false);
    dfs(0);
}
```

