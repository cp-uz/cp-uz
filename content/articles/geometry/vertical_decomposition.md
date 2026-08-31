---
article_id: geometry--vertical_decomposition
---
# Vertikal dekompozitsiya

## Umumiy ko‘rinish

Vertikal dekompozitsiya ko‘plab geometrik masalalarda ishlatiladigan kuchli usuldir. Umumiy g‘oya tekislikni ayrim “qulay” xossalarga ega vertikal polosalarga ajratish va har bir polosa uchun masalani mustaqil yechishdan iborat. Quyida bu g‘oya bir nechta misolda ko‘rsatiladi.

## Uchburchaklar birlashmasining yuzi

Tekislikda $n$ ta uchburchak berilgan va ularning birlashmasi yuzini topish kerak bo‘lsin. Uchburchaklar kesishmaganida masala oson bo‘lardi. Kesishishlardan xalos bo‘lish uchun barcha uchlar va turli uchburchaklar tomonlarining kesishish nuqtalari orqali vertikal chiziqlar o‘tkazamiz. Bunday chiziqlar $\mathcal{O}(n^2)$ ta, demak $\mathcal{O}(n^2)$ vertikal polosa hosil bo‘lishi mumkin.

Bitta polosani ko‘rib chiqamiz. Har bir vertikal bo‘lmagan kesma polosani chapdan o‘ngga to‘liq kesib o‘tadi yoki uning ichiga umuman kirmaydi. Polosa ichida ikkita tomon kesishmaydi. Shu sababli uchburchaklar birlashmasining polosadagi qismi asoslari polosaning vertikal chegaralarida yotadigan o‘zaro kesishmaydigan trapetsiyalardan iborat.

Polosani kesib o‘tuvchi tomon tegishli uchburchakning ichi undan yuqorida bo‘lsa “pastki”, ichi undan pastda bo‘lsa “yuqori” chegara sifatida qaraladi. Yuqori chegarani ochuvchi qavs, pastki chegarani yopuvchi qavs deb tasavvur qilib, $y$ bo‘yicha tartiblangan tomonlardan hosil bo‘lgan qavslar ketma-ketligini to‘g‘ri kichik ketma-ketliklarga ajratamiz. Har bir juft bir trapetsiyani belgilaydi.

Polosalarni oshkora qurib, har biri uchun barcha tomonlarni saralash $\mathcal{O}(n^3\log n)$ vaqt va $\mathcal{O}(n^2)$ xotira talab qiladi.

### 1-optimizatsiya

Murakkablikni $\mathcal{O}(n^2\log n)$ gacha kamaytiramiz. Har bir polosa uchun trapetsiyalarni alohida qurish o‘rniga, bitta uchburchak tomoni $s=(s_0,s_1)$ ni mahkamlab, u qaysi polosalarda biror trapetsiyaning tomoni bo‘lishini topamiz.

$s$ yuqori tomon bo‘lsin. U trapetsiya chegarasi bo‘lishi uchun uning pastidagi qavslar balansi nol bo‘lishi kerak. Shunday qilib, vertikal scanline o‘rniga $s$ ga nisbatan balansga ta’sir qiladigan boshqa kesmalar qismlari bo‘yicha gorizontal mantiqda hodisalar yig‘amiz.

Boshqa vertikal bo‘lmagan $t=(t_0,t_1)$ kesmani olaylik. $s$ va $t$ proyeksiyalarining $Ox$ dagi kesishmasi $[x_1,x_2]$ bo‘lsin. U bo‘sh yoki bitta nuqtadan iborat bo‘lsa, ular bir polosaning ichini birga kesib o‘tmaydi va $t$ tashlab yuboriladi. Aks holda $s$ va $t$ kesishmasi $I$ uchun uch holat bor.

1. **$I=\varnothing$.** $[x_1,x_2]$ bo‘ylab $t$ to‘liq $s$ dan yuqori yoki pastda. Yuqorida bo‘lsa, $s$ ning chegaraviy bo‘lishiga ta’sir qilmaydi. Pastda bo‘lsa, $t$ yuqori yoki pastki tomon ekaniga qarab balansga butun $[x_1,x_2]$ da $+1$ yoki $-1$ qo‘shiladi.
2. **$I$ bitta $p$ nuqta.** $[x_1,x_2]$ ni $[x_1,p_x]$ va $[p_x,x_2]$ ga bo‘lib, oldingi holatga keltiriladi.
3. **$I$ kesma.** $s$ va $t$ ning tegishli qismlari ustma-ust tushadi. $t$ qarama-qarshi turdagi tomon bo‘lsa, $s$ bu oraliqda trapetsiya tomoni bo‘la olmaydi. Bir xil turdagi ustma-ust tomonlarda noaniqlikni yo‘qotish uchun faqat indeksi eng kichik kesmani vakil sifatida qoldiramiz; qolganiga, masalan, balansni hech qachon nol qilmaydigan `-2` hodisa beriladi.

$[x_1,x_2]$ ga $w$ qo‘shishni ikkita hodisa bilan ifodalaymiz: $(x_1,w)$ va $(x_2,-w)$. Hodisalar $x$ bo‘yicha saralanib, sweep line bilan yuriladi. Balans nol bo‘lgan oraliqlarda $s$ trapetsiya tomoni hisoblanadi va uning ostidagi yoki ustidagi integral yuzga qo‘shiladi.

### 2-optimizatsiya

Birinchi optimizatsiyadan so‘ng polosalarning o‘zini saqlashga hojat qolmaydi. Har bir mahkamlangan kesma uchun faqat $\mathcal{O}(n)$ hodisa kerak, shuning uchun xotira $\mathcal{O}(n)$ gacha kamayadi.

## Qavariq ko‘pburchaklar kesishmasi

Vertikal dekompozitsiyaning yana bir qo‘llanishi — ikkita qavariq ko‘pburchak kesishmasini chiziqli vaqtda topish. Har ikki ko‘pburchakning barcha uchlari orqali vertikal chiziqlar o‘tkazilsin. Har bir polosa bilan bitta qavariq ko‘pburchakning kesishmasi trapetsiya, uchburchak, kesma yoki nuqtadan iborat bo‘ladi. Har polosada shu sodda shakllar kesishmasi topilib, natijalar ketma-ket birlashtiriladi. Uchlar tartiblangan bo‘lgani uchun ikki ko‘pburchak bo‘ylab ko‘rsatkichlar faqat oldinga siljiydi va umumiy vaqt $\mathcal{O}(|P|+|Q|)$ bo‘ladi.

## Implementatsiya

Quyidagi kod uchburchaklar birlashmasi yuzini $\mathcal{O}(n^2\log n)$ vaqt va $\mathcal{O}(n)$ qo‘shimcha xotirada hisoblaydi.

```cpp
typedef double dbl;
const dbl eps = 1e-9;

inline bool eq(dbl x, dbl y) { return fabs(x-y) < eps; }
inline bool lt(dbl x, dbl y) { return x < y-eps; }
inline bool gt(dbl x, dbl y) { return x > y+eps; }
inline bool le(dbl x, dbl y) { return x < y+eps; }
inline bool ge(dbl x, dbl y) { return x > y-eps; }

struct pt {
    dbl x, y;
    pt operator-(const pt& p) const { return {x-p.x, y-p.y}; }
    pt operator+(const pt& p) const { return {x+p.x, y+p.y}; }
    pt operator*(dbl a) const { return {x*a, y*a}; }
    dbl cross(const pt& p) const { return x*p.y-y*p.x; }
    dbl dot(const pt& p) const { return x*p.x+y*p.y; }
    bool operator==(const pt& p) const { return eq(x,p.x)&&eq(y,p.y); }
};

struct Line {
    pt p[2];
    Line() {}
    Line(pt a, pt b): p{a,b} {}
    pt vec() const { return p[1]-p[0]; }
    pt& operator[](size_t i) { return p[i]; }
};

inline bool lexComp(const pt& l, const pt& r) {
    if (fabs(l.x-r.x)>eps) return l.x<r.x;
    return l.y<r.y;
}

vector<pt> interSegSeg(Line l1, Line l2) {
    if (eq(l1.vec().cross(l2.vec()),0)) {
        if (!eq(l1.vec().cross(l2[0]-l1[0]),0)) return {};
        if (!lexComp(l1[0],l1[1])) swap(l1[0],l1[1]);
        if (!lexComp(l2[0],l2[1])) swap(l2[0],l2[1]);
        pt l=lexComp(l1[0],l2[0])?l2[0]:l1[0];
        pt r=lexComp(l1[1],l2[1])?l1[1]:l2[1];
        if (l==r) return {l};
        return lexComp(l,r)?vector<pt>{l,r}:vector<pt>();
    }
    dbl s=(l2[0]-l1[0]).cross(l2.vec())/l1.vec().cross(l2.vec());
    pt inter=l1[0]+l1.vec()*s;
    if (ge(s,0)&&le(s,1)&&le((l2[0]-inter).dot(l2[1]-inter),0))
        return {inter};
    return {};
}

inline char get_segtype(Line segment, pt other_point) {
    if (eq(segment[0].x,segment[1].x)) return 0;
    if (!lexComp(segment[0],segment[1])) swap(segment[0],segment[1]);
    return (segment[1]-segment[0]).cross(other_point-segment[0])>0?1:-1;
}

dbl union_area(vector<tuple<pt,pt,pt>> triangles) {
    vector<Line> segments(3*triangles.size());
    vector<char> segtype(segments.size());
    for (size_t i=0;i<triangles.size();i++) {
        pt a,b,c; tie(a,b,c)=triangles[i];
        segments[3*i]=lexComp(a,b)?Line(a,b):Line(b,a);
        segtype[3*i]=get_segtype(segments[3*i],c);
        segments[3*i+1]=lexComp(b,c)?Line(b,c):Line(c,b);
        segtype[3*i+1]=get_segtype(segments[3*i+1],a);
        segments[3*i+2]=lexComp(c,a)?Line(c,a):Line(a,c);
        segtype[3*i+2]=get_segtype(segments[3*i+2],b);
    }

    vector<dbl> k(segments.size()), b(segments.size());
    for (size_t i=0;i<segments.size();i++) if (segtype[i]) {
        k[i]=(segments[i][1].y-segments[i][0].y)/
             (segments[i][1].x-segments[i][0].x);
        b[i]=segments[i][0].y-k[i]*segments[i][0].x;
    }

    dbl ans=0;
    for (size_t i=0;i<segments.size();i++) {
        if (!segtype[i]) continue;
        dbl l=segments[i][0].x, r=segments[i][1].x;
        vector<pair<dbl,int>> evts;

        for (size_t j=0;j<segments.size();j++) {
            if (!segtype[j]||i==j) continue;
            dbl l1=segments[j][0].x, r1=segments[j][1].x;
            if (ge(l1,r)||ge(l,r1)) continue;
            dbl common_l=max(l,l1), common_r=min(r,r1);
            auto pts=interSegSeg(segments[i],segments[j]);

            if (pts.empty()) {
                dbl yi=k[i]*common_l+b[i];
                dbl yj=k[j]*common_l+b[j];
                if (lt(yj,yi)==(segtype[i]==1)) {
                    int w=-segtype[i]*segtype[j];
                    evts.emplace_back(common_l,w);
                    evts.emplace_back(common_r,-w);
                }
            } else if (pts.size()==1) {
                int w=-segtype[i]*segtype[j];
                dbl yi=k[i]*common_l+b[i], yj=k[j]*common_l+b[j];
                if (lt(yj,yi)==(segtype[i]==1)) {
                    evts.emplace_back(common_l,w);
                    evts.emplace_back(pts[0].x,-w);
                }
                yi=k[i]*common_r+b[i]; yj=k[j]*common_r+b[j];
                if (lt(yj,yi)==(segtype[i]==1)) {
                    evts.emplace_back(pts[0].x,w);
                    evts.emplace_back(common_r,-w);
                }
            } else if (segtype[j]!=segtype[i]||j>i) {
                evts.emplace_back(common_l,-2);
                evts.emplace_back(common_r,2);
            }
        }

        evts.emplace_back(l,0);
        sort(evts.begin(),evts.end());
        size_t j=0; int balance=0;
        while (j<evts.size()) {
            size_t ptr=j;
            while (ptr<evts.size()&&eq(evts[j].first,evts[ptr].first))
                balance+=evts[ptr++].second;
            if (!balance&&!eq(evts[j].first,r)) {
                dbl nx=ptr==evts.size()?r:evts[ptr].first;
                ans-=segtype[i]*(k[i]*(nx+evts[j].first)+2*b[i])
                    *(nx-evts[j].first);
            }
            j=ptr;
        }
    }
    return ans/2;
}
```

## Masalalar

- [Codeforces 62C — Inquisition](https://codeforces.com/problemset/problem/62/C)
- [Codeforces 107E — Darts](https://codeforces.com/problemset/problem/107/E)

