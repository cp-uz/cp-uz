---
article_id: graph--push-relabel-faster
---
# Maksimal oqim — yaxshilangan push–relabel usuli

Yaxshiroq ishlash vaqtiga erishish uchun [push–relabel usuli](push-relabel.md)ni o‘zgartiramiz.

## Tavsif

O‘zgartirish nihoyatda sodda:

Avvalgi maqolada ortiqcha oqimli tugun hech qanday maxsus qoidasiz tanlangan edi.

Ammo har doim **balandligi eng katta** tugunlarni tanlab, ularda `push` va `relabel` amallarini bajarsak, murakkablik yaxshilanishi ma’lum bo‘ladi.

Bundan tashqari, eng katta balandlikli tugunlarni tanlash uchun hech qanday ma’lumotlar tuzilmasi kerak emas: eng katta balandlikli tugunlarni oddiy ro‘yxatda saqlaymiz va ularning barchasi qayta ishlangach (unda balandligi oldindan kichikroq tugunlar ro‘yxatga qo‘shiladi) yoki ortiqcha oqimli, balandligi kattaroq yangi tugun paydo bo‘lganda (biror tugunga `relabel` qo‘llangach) ro‘yxatni qayta hisoblaymiz.

Soddaligiga qaramay, bu o‘zgartirish murakkablikni ancha kamaytiradi.

Aniqrog‘i, hosil bo‘lgan algoritmning murakkabligi $O(V E + V^2 \sqrt{E})$, eng yomon holatda esa $O(V^3)$.

Bu o‘zgartirish Cheriyan va Maheshwari tomonidan 1989-yilda taklif qilingan.

## Implementatsiya

```{.cpp file=push_relabel_faster}
const int inf = 1000000000;

int n;
vector<vector<int>> capacity, flow;
vector<int> height, excess;

void push(int u, int v)
{
    int d = min(excess[u], capacity[u][v] - flow[u][v]);
    flow[u][v] += d;
    flow[v][u] -= d;
    excess[u] -= d;
    excess[v] += d;
}
void relabel(int u)
{
    int d = inf;
    for (int i = 0; i < n; i++) {
        if (capacity[u][i] - flow[u][i] > 0)
            d = min(d, height[i]);
    }
    if (d < inf)
        height[u] = d + 1;
}
vector<int> find_max_height_vertices(int s, int t) {
    vector<int> max_height;
    for (int i = 0; i < n; i++) {
        if (i != s && i != t && excess[i] > 0) {
            if (!max_height.empty() && height[i] > height[max_height[0]])
                max_height.clear();
            if (max_height.empty() || height[i] == height[max_height[0]])
                max_height.push_back(i);
        }
    }
    return max_height;
}
int max_flow(int s, int t)
{
    height.assign(n, 0);
    height[s] = n;
    flow.assign(n, vector<int>(n, 0));
    excess.assign(n, 0);
    excess[s] = inf;
    for (int i = 0; i < n; i++) {
        if (i != s)
            push(s, i);
    }
    vector<int> current;
    while (!(current = find_max_height_vertices(s, t)).empty()) {
        for (int i : current) {
            bool pushed = false;
            for (int j = 0; j < n && excess[i]; j++) {
                if (capacity[i][j] - flow[i][j] > 0 && height[i] == height[j] + 1) {
                    push(i, j);
                    pushed = true;
                }
            }
            if (!pushed) {
                relabel(i);
                break;
            }
        }
    }
    return excess[t];
}
```

