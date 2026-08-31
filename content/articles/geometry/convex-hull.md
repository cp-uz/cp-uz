---
article_id: geometry--convex-hull
---
# Qavariq qobiqni qurish

Ushbu maqolada berilgan nuqtalar to‘plamining qavariq qobig‘ini qurish masalasi ko‘rib chiqiladi.

Tekislikda $N$ ta nuqta berilgan bo‘lsin. Maqsad — ularning barchasini o‘z ichiga oladigan eng kichik qavariq ko‘pburchakni, ya’ni qavariq qobiqni topish. Quyida 1972-yilda Graham tomonidan taklif qilingan Graham scan algoritmi va 1979-yilda Andrew tomonidan taklif qilingan monotone chain algoritmi keltiriladi. Har ikkala algoritmning murakkabligi $\mathcal{O}(N\log N)$ bo‘lib, parallel yoki onlayn ishlov berish kabi ayrim maxsus holatlardan tashqari, bu asimptotik jihatdan optimaldir.

## Graham scan algoritmi

Algoritm avval eng pastdagi $P_0$ nuqtani topadi. Agar eng kichik $y$ koordinataga ega bir nechta nuqta bo‘lsa, ulardan $x$ koordinatasi eng kichigi olinadi. Bu bosqich $\mathcal{O}(N)$ vaqt oladi.

Keyin qolgan barcha nuqtalar $P_0$ ga nisbatan qutbiy burchak bo‘yicha soat mili yo‘nalishida saralanadi. Ikki yoki undan ortiq nuqtaning qutbiy burchagi bir xil bo‘lsa, tenglik $P_0$ dan masofa bo‘yicha, yaqinidan uzoqqa qarab buziladi.

Shundan so‘ng nuqtalarni birma-bir ko‘rib chiqamiz. Joriy nuqta va undan oldingi ikkita nuqta soat mili yo‘nalishidagi burilish hosil qilishini ta’minlaymiz. Aks holda oldingi nuqta chiqarib tashlanadi, chunki u qobiqni noqavariq qiladi. Burilish yo‘nalishi uch nuqtaning orientatsiyasi orqali tekshiriladi.

Nuqtalarni stekda saqlaymiz. Barcha nuqtalar ko‘rib chiqilgach, stekda qavariq qobiqning soat mili yo‘nalishidagi uchlari qoladi.

Graham scan natijasiga chegaradagi barcha kollinear nuqtalarni ham kiritish kerak bo‘lsa, saralashdan keyin qo‘shimcha qadam bajariladi. $P_0$ dan eng uzoqda joylashgan va o‘zaro kollinear bo‘lgan, saralangan massivning oxiridagi nuqtalar teskari tartibga o‘giriladi. Aks holda algoritm shu nurdagi eng yaqin nuqtani olgach, keyingi kollinear nuqtalarni chiqarib tashlaydi.

Bu qadam faqat kollinear nuqtalarni kiritish talab qilinganda bajarilishi kerak. Oddiy holatda uni bajarish eng kichik qavariq qobiqni olishga xalaqit beradi.

### Implementatsiya

```cpp
struct pt {
    double x, y;
    bool operator == (pt const& t) const {
        return x == t.x && y == t.y;
    }
};

int orientation(pt a, pt b, pt c) {
    double v = a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);
    if (v < 0) return -1; // clockwise
    if (v > 0) return +1; // counter-clockwise
    return 0;
}

bool cw(pt a, pt b, pt c, bool include_collinear) {
    int o = orientation(a, b, c);
    return o < 0 || (include_collinear && o == 0);
}

bool collinear(pt a, pt b, pt c) {
    return orientation(a, b, c) == 0;
}

void convex_hull(vector<pt>& a, bool include_collinear = false) {
    pt p0 = *min_element(a.begin(), a.end(), [](pt a, pt b) {
        return make_pair(a.y, a.x) < make_pair(b.y, b.x);
    });
    sort(a.begin(), a.end(), [&p0](const pt& a, const pt& b) {
        int o = orientation(p0, a, b);
        if (o == 0)
            return (p0.x-a.x)*(p0.x-a.x) + (p0.y-a.y)*(p0.y-a.y)
                < (p0.x-b.x)*(p0.x-b.x) + (p0.y-b.y)*(p0.y-b.y);
        return o < 0;
    });
    if (include_collinear) {
        int i = (int)a.size()-1;
        while (i >= 0 && collinear(p0, a[i], a.back())) i--;
        reverse(a.begin()+i+1, a.end());
    }

    vector<pt> st;
    for (int i = 0; i < (int)a.size(); i++) {
        while (st.size() > 1 && !cw(st[st.size()-2], st.back(), a[i], include_collinear))
            st.pop_back();
        st.push_back(a[i]);
    }

    if (include_collinear == false && st.size() == 2 && st[0] == st[1])
        st.pop_back();

    a = st;
}
```

## Monotone chain algoritmi

Algoritm avval eng chapdagi va eng o‘ngdagi nuqtalarni topadi; ularni mos ravishda $A$ va $B$ deb belgilaymiz. Eng chap nuqta bir nechta bo‘lsa, $y$ koordinatasi eng kichigi $A$ sifatida, eng o‘ng nuqta bir nechta bo‘lsa, $y$ koordinatasi eng kattasi $B$ sifatida olinadi. $A$ va $B$ qavariq qobiqda yotishi aniq: ular eng chekka nuqtalar bo‘lib, boshqa nuqtalar jufti orqali hosil qilingan chiziq ichida qolib ketmaydi.

$AB$ chiziq tekislikni ikkiga ajratadi. $S_1$ to‘plamiga $AB$ dan yuqoridagi, $S_2$ to‘plamiga esa undan pastdagi nuqtalar kiradi. $AB$ ustidagi nuqtalarni istalgan tomonga kiritish mumkin; $A$ va $B$ esa har ikki to‘plamga kiradi. Algoritm yuqori va pastki zanjirlarni alohida qurib, keyin ularni birlashtiradi.

Barcha nuqtalarni $x$ koordinata bo‘yicha saralaymiz. Yuqori qobiqni qurishda joriy nuqta $B$ bo‘lsa yoki $A$, joriy nuqta va $B$ soat mili yo‘nalishidagi burilish hosil qilsa, joriy nuqta yuqori to‘plamga tegishli bo‘ladi. Uni qo‘shishdan oldin yuqori qobiqning oxirgi ikki nuqtasi bilan hosil bo‘lgan burilishni tekshiramiz. Burilish soat mili yo‘nalishida bo‘lmasa, oxirgi nuqtani chiqarib tashlaymiz.

Pastki qobiq ham xuddi shunday quriladi, faqat soat miliga teskari burilish talab qilinadi. Yuqori va pastki zanjirlar birlashtirilganda soat mili yo‘nalishida tartiblangan yakuniy qavariq qobiq olinadi.

Kollinear chegaraviy nuqtalarni kiritish uchun `cw` va `ccw` tekshiruvlarida tenglikka ham ruxsat beriladi. Barcha kirish nuqtalari bitta chiziqda yotsa, yuqori zanjir barcha nuqtalarni o‘z ichiga olib, natijada takrorlanishlar paydo bo‘lishi mumkin. Shu degenerativ holat alohida tekshiriladi va nuqtalar teskari tartibda qaytariladi.

### Implementatsiya

```cpp
struct pt {
    double x, y;
};

int orientation(pt a, pt b, pt c) {
    double v = a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);
    if (v < 0) return -1; // clockwise
    if (v > 0) return +1; // counter-clockwise
    return 0;
}

bool cw(pt a, pt b, pt c, bool include_collinear) {
    int o = orientation(a, b, c);
    return o < 0 || (include_collinear && o == 0);
}

bool ccw(pt a, pt b, pt c, bool include_collinear) {
    int o = orientation(a, b, c);
    return o > 0 || (include_collinear && o == 0);
}

void convex_hull(vector<pt>& a, bool include_collinear = false) {
    if (a.size() == 1)
        return;

    sort(a.begin(), a.end(), [](pt a, pt b) {
        return make_pair(a.x, a.y) < make_pair(b.x, b.y);
    });
    pt p1 = a[0], p2 = a.back();
    vector<pt> up, down;
    up.push_back(p1);
    down.push_back(p1);
    for (int i = 1; i < (int)a.size(); i++) {
        if (i == a.size() - 1 || cw(p1, a[i], p2, include_collinear)) {
            while (up.size() >= 2 && !cw(up[up.size()-2], up[up.size()-1], a[i], include_collinear))
                up.pop_back();
            up.push_back(a[i]);
        }
        if (i == a.size() - 1 || ccw(p1, a[i], p2, include_collinear)) {
            while (down.size() >= 2 && !ccw(down[down.size()-2], down[down.size()-1], a[i], include_collinear))
                down.pop_back();
            down.push_back(a[i]);
        }
    }

    if (include_collinear && up.size() == a.size()) {
        reverse(a.begin(), a.end());
        return;
    }
    a.clear();
    for (int i = 0; i < (int)up.size(); i++)
        a.push_back(up[i]);
    for (int i = (int)down.size() - 2; i > 0; i--)
        a.push_back(down[i]);
}
```

Saralash ikkala algoritmning ham asosiy xarajatidir, shuning uchun umumiy vaqt murakkabligi $\mathcal{O}(N\log N)$, qo‘shimcha xotira esa $\mathcal{O}(N)$ bo‘ladi.

## Mashq masalalari

- [Kattis — Convex Hull](https://open.kattis.com/problems/convexhull)
- [Kattis — Keep the Parade Safe](https://open.kattis.com/problems/parade)
- [Codeforces — I. Birthday](https://codeforces.com/problemset/problem/44/B)
- [Timus 1185 — Wall](https://acm.timus.ru/problem.aspx?space=1&num=1185)
- [USACO 2014 January, Gold — Cow Curling](https://usaco.org/)

