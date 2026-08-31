---
article_id: geometry--minkowski
---
# Qavariq ko‘pburchaklarning Minkowski yig‘indisi

Ikki nuqtalar to‘plami $P$ va $Q$ ning Minkowski yig‘indisi

$$
P+Q=\{p+q\mid p\in P,\ q\in Q\}
$$

sifatida aniqlanadi. Agar $P$ va $Q$ qavariq ko‘pburchaklar bo‘lsa, ularning Minkowski yig‘indisi ham qavariq ko‘pburchak bo‘ladi.

Geometrik ma’noda $Q$ ko‘pburchakning bir nuqtasi $P$ ning har bir nuqtasi bo‘ylab yuradi va natijada egallangan barcha joylar $P+Q$ ni hosil qiladi. Shuningdek, $P+Q$ ning har bir yo‘nalishdagi support funksiyasi $P$ va $Q$ support funksiyalari yig‘indisiga teng.

## Xossalar

Minkowski yig‘indisi kommutativ va assotsiativ:

$$
P+Q=Q+P,
\qquad
(P+Q)+R=P+(Q+R).
$$

Nuqtani qo‘shish ko‘pburchakni shu vektor bo‘yicha siljitadi. Ko‘pburchakni koordinatalar boshiga nisbatan akslantirish

$$
-Q=\{-q\mid q\in Q\}
$$

orqali Minkowski ayirmasi $P+(-Q)$ hosil qilinadi.

## Qavariq ko‘pburchaklar uchun chiziqli algoritm

$P$ va $Q$ uchlari soat miliga teskari tartibda berilgan bo‘lsin. Ularning qirra vektorlari ketma-ketliklari

$$
\overrightarrow{P_iP_{i+1}}
\quad\text{va}\quad
\overrightarrow{Q_jQ_{j+1}}
$$

polar burchak bo‘yicha tartiblangan. $P+Q$ qirralari shu ikki tartiblangan ketma-ketlikni birlashtirishdan hosil bo‘ladi; bir yo‘nalishdagi ketma-ket vektorlar qo‘shiladi.

Avval har bir ko‘pburchakning eng past $y$ koordinatali, tenglikda eng kichik $x$ koordinatali uchini birinchi qilamiz. Qavariq va CCW ko‘pburchakda shu nuqtadan boshlangan qirralar polar burchak bo‘yicha siklik tartiblangan bo‘ladi.

Ikki ko‘rsatkich $i$ va $j$ ni nolga qo‘yamiz. Har qadamda $P_i+Q_j$ natijaga qo‘shiladi. Keyingi qirralar vektor ko‘paytmasi bilan solishtiriladi:

- cross musbat bo‘lsa, $P$ qirrasi kichikroq burchakka ega va $i$ oshiriladi;
- cross manfiy bo‘lsa, $Q$ qirrasi tanlanib $j$ oshiriladi;
- cross nol bo‘lsa, qirralar bir yo‘nalishda va ikkala ko‘rsatkich oshiriladi.

Natija uchlari soni $|P|+|Q|$ dan oshmaydi, shuning uchun algoritm chiziqli.

## Implementatsiya

```cpp
struct pt {
    long long x, y;

    pt operator+(const pt& p) const {
        return pt{x + p.x, y + p.y};
    }
    pt operator-(const pt& p) const {
        return pt{x - p.x, y - p.y};
    }
    long long cross(const pt& p) const {
        return x * p.y - y * p.x;
    }
};

void reorder_polygon(vector<pt>& P) {
    size_t pos = 0;
    for (size_t i = 1; i < P.size(); i++) {
        if (P[i].y < P[pos].y ||
            (P[i].y == P[pos].y && P[i].x < P[pos].x))
            pos = i;
    }
    rotate(P.begin(), P.begin() + pos, P.end());
}

vector<pt> minkowski(vector<pt> P, vector<pt> Q) {
    // Birinchi uch eng past bo‘lishi kerak.
    reorder_polygon(P);
    reorder_polygon(Q);

    // Siklik indekslashni qulay qilish uchun dastlabki ikki uchni qo‘shamiz.
    P.push_back(P[0]);
    P.push_back(P[1]);
    Q.push_back(Q[0]);
    Q.push_back(Q[1]);

    vector<pt> result;
    size_t i = 0, j = 0;
    while (i < P.size() - 2 || j < Q.size() - 2) {
        result.push_back(P[i] + Q[j]);
        auto cr = (P[i + 1] - P[i]).cross(Q[j + 1] - Q[j]);
        if (cr >= 0 && i < P.size() - 2)
            ++i;
        if (cr <= 0 && j < Q.size() - 2)
            ++j;
    }
    return result;
}
```

Kirish ko‘pburchaklarida bitta to‘g‘ri chiziq bo‘ylab ketma-ket ortiqcha uchlar bo‘lsa, natijada ham kollinear uchlar qolishi mumkin. Kerak bo‘lsa, oldindan yoki keyin nol burilishli o‘rta uchlarni olib tashlash mumkin. Bir yoki ikki uchli degenerativ qavariq to‘plamlar alohida qayta ishlanadi.

## Ikki ko‘pburchak orasidagi masofa

Ikki qavariq ko‘pburchak orasidagi masofa

$$
\min_{p\in P,\ q\in Q}\|p-q\|
$$

bo‘lsin. $Q$ ni koordinatalar boshiga nisbatan akslantirsak, $p-q$ vektorlarning barcha qiymatlari $P+(-Q)$ ni tashkil qiladi. Shuning uchun masala koordinatalar boshidan $P+(-Q)$ ko‘pburchakkacha eng kichik masofani topishga keltiriladi.

Agar $(0,0)$ yig‘indi ko‘pburchak ichida yoki chegarasida bo‘lsa, $P$ va $Q$ kesishadi va masofa nol. Aks holda eng yaqin nuqta biror uchda yoki qirrada yotadi; barcha qirralarni chiziqli ko‘rib chiqish kifoya. Minkowski yig‘indisi ham chiziqli vaqtda qurilgani sababli umumiy murakkablik $O(|P|+|Q|)$.

## Amaliy masalalar

* [Codeforces 87E — Mogohu-Rea Idol](https://codeforces.com/problemset/problem/87/E)
* [Codeforces 1195F — Geometers Anonymous Club](https://codeforces.com/problemset/problem/1195/F)
* [TIMUS 1894 — Non-Flying Weather](https://acm.timus.ru/problem.aspx?space=1&num=1894)

