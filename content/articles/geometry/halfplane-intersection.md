---
article_id: geometry--halfplane-intersection
---
# Yarim tekisliklar kesishmasi

Ushbu maqolada yarim tekisliklar to‘plamining kesishmasini hisoblash masalasi ko‘riladi. Kesishma qavariq soha yoki qavariq ko‘pburchak sifatida tasvirlanadi: uning har bir nuqtasi barcha yarim tekisliklarga tegishli bo‘ladi. Maqsad shu ko‘pburchakni qurish yoki kesishma bo‘shligini aniqlashdir.

Nuqta, vektor va to‘g‘ri chiziqlar kesishmasi kabi asosiy geometrik amallarni bilish talab etiladi. Qavariq qobiq va Convex Hull Trick bilan tanishlik tushunishni osonlashtiradi, ammo shart emas.

## Dastlabki ta’riflar

Maqola davomida, alohida aytilmasa, quyidagilar faraz qilinadi:

1. Yarim tekisliklar soni $N$.
2. Chiziq bitta undagi nuqta $p$ va yo‘nalish vektori $pq$ bilan ifodalanadi. Yarim tekislik chiziq vektorining **chap** tomonini ruxsat etadi. Yarim tekislik burchagi — `pq` ning qutbiy burchagi.
3. Natijaviy kesishma chegaralangan yoki bo‘sh. Chegaralanmagan holatni qo‘llab-quvvatlash uchun yetarlicha katta to‘rtburchakni belgilaydigan to‘rtta yarim tekislik qo‘shiladi.
4. Dastlab parallel yarim tekisliklar yo‘q deb qaraladi; keyin bu holat alohida ko‘riladi.

Masalan, $y\ge2x-2$ yarim tekisligi $P=(1,0)$ nuqta va $PQ=(1,2)$ yo‘nalish vektori bilan berilishi mumkin.

## Sodda usul — $O(N^3)$

Barcha yarim tekislik chiziqlari juftlarining kesishish nuqtalarini hisoblaymiz va har bir nuqta barcha $N$ yarim tekislik ichida ekanini tekshiramiz. $\mathcal{O}(N^2)$ nomzodning har biri $\mathcal{O}(N)$ da tekshiriladi, jami $\mathcal{O}(N^3)$. Yaroqli nuqtalarning qavariq qobig‘i yakuniy sohani beradi.

Usul sodda va kesishma bo‘shligini kichik cheklovlarda tekshirish uchun qulay, ammo ko‘p masalalarda juda sekin.

## Inkremental usul — $O(N^2)$

Kesishmani yarim tekisliklarni bittadan qo‘shib qurish mumkin. Bu katta boshlang‘ich qavariq ko‘pburchakni har safar bitta chiziq bilan kesib, tashqaridagi qismini olib tashlashga teng. Qavariq ko‘pburchakni bitta yarim tekislik bilan kesish chiziqli vaqtda bajariladi, $N$ marta takrorlanganda $\mathcal{O}(N^2)$ olinadi.

## Sort-and-Incremental algoritmi — $O(N\log N)$

Natijaviy kesishma qavariq bo‘lgani uchun uning chegarasiga hissa qo‘shadigan yarim tekisliklar burchak bo‘yicha tartibda keladi. Yarim tekisliklarni burchak bo‘yicha saralab, ketma-ket qo‘shsak va ularni `deque` da saqlasak, keraksiz elementlarni faqat boshidan yoki oxiridan o‘chirishga to‘g‘ri keladi.

Yangi $H_k$ yarim tekislik kelganda:

- deque oxiridagi qo‘shni ikki yarim tekislik kesishish nuqtasi $H_k$ tashqarisida bo‘lsa, oxirgi yarim tekislik ortiqcha va o‘chiriladi;
- xuddi shunday tekshiruv deque boshida bajariladi;
- keyin $H_k$ deque oxiriga qo‘shiladi.

Har bir yarim tekislik bir marta qo‘shilib, ko‘pi bilan bir marta o‘chiriladi; saralashdan keyingi qism $\mathcal{O}(N)$.

### Parallel yarim tekisliklar

Qarama-qarshi yo‘nalgan parallel yarim tekisliklar bir-biriga zid bo‘lsa, kesishma bo‘sh. Bir xil yo‘nalgan parallel yarim tekisliklardan faqat eng cheklovchisini, ya’ni ruxsat etilgan chap sohani eng kichik qiladiganini saqlash kerak; qolganlari ortiqcha.

Katta bounding box qo‘shilishi burchak tartibida qarama-qarshi yo‘nalishlar orasiga boshqa yarim tekisliklarni kiritadi. Biroq o‘chirishlardan keyin zid parallel juft qo‘shni bo‘lib qolishi mumkin, shuning uchun u alohida aniqlanadi.

Algoritm bosqichlari:

1. Yarim tekisliklarni burchak bo‘yicha $\mathcal{O}(N\log N)$ da saralash.
2. Har birini deque ga qo‘shib, bosh va oxirdagi ortiqcha yarim tekisliklarni olib tashlash. Jami $\mathcal{O}(N)$.
3. Deque dagi qo‘shni chiziqlar kesishish nuqtalarini hisoblab, qavariq ko‘pburchakni tiklash. $\mathcal{O}(N)$.

Agar yarim tekisliklar oldindan burchak bo‘yicha saralangan bo‘lsa, butun algoritm chiziqli ishlaydi.

### To‘g‘ridan-to‘g‘ri implementatsiya

```cpp
const long double eps = 1e-9, inf = 1e9;

struct Point {
    long double x, y;
    explicit Point(long double x=0, long double y=0):x(x),y(y){}
    friend Point operator+(const Point& p,const Point& q){
        return Point(p.x+q.x,p.y+q.y);
    }
    friend Point operator-(const Point& p,const Point& q){
        return Point(p.x-q.x,p.y-q.y);
    }
    friend Point operator*(const Point& p,const long double& k){
        return Point(p.x*k,p.y*k);
    }
    friend long double dot(const Point& p,const Point& q){
        return p.x*q.x+p.y*q.y;
    }
    friend long double cross(const Point& p,const Point& q){
        return p.x*q.y-p.y*q.x;
    }
};

struct Halfplane {
    Point p,pq;
    long double angle;
    Halfplane(){}
    Halfplane(const Point& a,const Point& b):p(a),pq(b-a){
        angle=atan2l(pq.y,pq.x);
    }
    bool out(const Point& r) const {
        return cross(pq,r-p)<-eps;
    }
    bool operator<(const Halfplane& e) const {
        return angle<e.angle;
    }
    friend Point inter(const Halfplane& s,const Halfplane& t){
        long double alpha=cross(t.p-s.p,t.pq)/cross(s.pq,t.pq);
        return s.p+s.pq*alpha;
    }
};

vector<Point> hp_intersect(vector<Halfplane> H) {
    Point box[4]={Point(inf,inf),Point(-inf,inf),
                  Point(-inf,-inf),Point(inf,-inf)};
    for(int i=0;i<4;i++) H.emplace_back(box[i],box[(i+1)%4]);

    sort(H.begin(),H.end());
    deque<Halfplane> dq;

    for(const Halfplane& h:H){
        while(dq.size()>1&&h.out(inter(dq[dq.size()-1],dq[dq.size()-2])))
            dq.pop_back();
        while(dq.size()>1&&h.out(inter(dq[0],dq[1])))
            dq.pop_front();

        if(!dq.empty()&&fabsl(cross(h.pq,dq.back().pq))<eps){
            if(dot(h.pq,dq.back().pq)<0.0L) return {};
            if(h.out(dq.back().p)) dq.pop_back();
            else continue;
        }
        dq.push_back(h);
    }

    while(dq.size()>2&&dq[0].out(inter(dq[dq.size()-1],dq[dq.size()-2])))
        dq.pop_back();
    while(dq.size()>2&&dq.back().out(inter(dq[0],dq[1])))
        dq.pop_front();

    if(dq.size()<3) return {};
    vector<Point> ret(dq.size());
    for(int i=0;i+1<(int)dq.size();i++) ret[i]=inter(dq[i],dq[i+1]);
    ret.back()=inter(dq.back(),dq.front());
    return ret;
}
```

### Implementatsiya muhokamasi

Bir nechta yarim tekislik aynan bitta nuqtada kesishsa, natijada ketma-ket takroriy uchlar chiqishi mumkin. Bu kesishmaning bo‘shligini yoki ko‘pburchak yuzini hisoblashni buzmaydi; keyingi masala talab qilsa `std::unique` bilan olib tashlanadi. Algoritm davomida takroriy nuqtalarni erta o‘chirmaslik ma’qul, chunki yuzi nol bo‘lgan — bitta nuqta, kesma yoki chiziqdan iborat — kesishmalarni to‘g‘ri saqlash kerak.

Cheklov $ax+by+c\le0$ ko‘rinishida berilsa, ikki yo‘l bor: algoritmni shu ifoda uchun bevosita yozish yoki chiziqdan ikkita nuqta tanlab yuqoridagi ko‘rinishga o‘tkazish. Ortiqcha sonli xatolarni kamaytirish uchun odatda masalada berilgan ko‘rinish bilan bevosita ishlash yaxshiroq.

## Masalalar va qo‘llanishlar

### Qavariq ko‘pburchaklar kesishmasi

Har bir qavariq ko‘pburchak uning tomonlari belgilaydigan yarim tekisliklar kesishmasidir. $N$ ta ko‘pburchakning umumiy kesishmasi uchun barcha tomonlardan yarim tekisliklar tuzilib, bitta HPI bajariladi. Tomonlar umumiy soni $S$ bo‘lsa, murakkablik $\mathcal{O}(S\log S)$.

### Tekislikda ko‘rinuvchanlik

Sodda ko‘pburchakning butun chegarasi ko‘rinadigan nuqtalar to‘plami uning yadrosi deyiladi. Har bir yo‘naltirilgan tomon ko‘pburchak ichini saqlaydigan yarim tekislik beradi; barcha yarim tekisliklar kesishmasi yadrodir.

Nuqtalar $p_1,p_2,\ldots,p_n$ ni chapdan o‘ngga indeks tartibida ko‘rish mumkin bo‘lgan kuzatuvchi nuqta mavjudligini ham qo‘shni $p_ip_{i+1}$ kesmalarining tegishli tomonlarini yarim tekislik sifatida olib tekshirish mumkin.

### Yarim tekisliklar kesishmasi va ikkilik qidiruv

HPI ko‘pincha parametr bo‘yicha ikkilik qidiruv predikati sifatida ishlatiladi. Masalan, qavariq ko‘pburchak ichiga sig‘adigan eng katta aylana radiusi $r$ ni tekshirish uchun har bir tomon chizig‘i ichkariga $r$ masofaga parallel suriladi. Surilgan yarim tekisliklar kesishmasi bo‘sh bo‘lmasa, shunday aylana markazi mavjud. Predikat monotondir va radius bo‘yicha ikkilik qidiruv bajariladi.

