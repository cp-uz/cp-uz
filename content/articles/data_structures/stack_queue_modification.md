---
article_id: data_structures--stack_queue_modification
---
# Minimum Stack va Minimum Queue

Ushbu maqolada uchta masalani ko‘rib chiqamiz: avval stackni undagi eng kichik elementni $O(1)$ vaqtda topish mumkin bo‘ladigan qilib o‘zgartiramiz; keyin queue uchun ham xuddi shunday imkoniyat yaratamiz; nihoyat, shu ma’lumotlar tuzilmalaridan foydalanib massivdagi berilgan uzunlikka ega barcha ostmassivlarning minimumini $O(n)$ vaqtda topamiz.

## Stackni o‘zgartirish

Stack ma’lumotlar tuzilmasini undagi eng kichik elementni $O(1)$ vaqtda topish mumkin bo‘ladigan qilib o‘zgartirmoqchimiz. Bunda stackka element qo‘shish va undan element olib tashlash amallarining asimptotik murakkabligi o‘zgarmasligi kerak.

Eslatib o‘tamiz: stackda elementlar faqat bitta uchidan qo‘shiladi va olib tashlanadi.

Buning uchun stackda faqat elementlarning o‘zini emas, balki juftliklarni saqlaymiz: elementning o‘zi va shu elementdan boshlab stackning pastigacha bo‘lgan qismdagi minimum.

```cpp
stack<pair<int, int>> st;
```

Butun stackdagi minimumni topish uchun faqat `stack.top().second` qiymatiga qarash kifoya ekani ravshan.

Yangi elementni stackka qo‘shish yoki undan element olib tashlash ham o‘zgarmas vaqtda bajarilishi aniq.

Implementatsiya:

* Element qo‘shish:

```cpp
int new_min = st.empty() ? new_elem : min(new_elem, st.top().second);
st.push({new_elem, new_min});
```

* Elementni olib tashlash:

```cpp
int removed_element = st.top().first;
st.pop();
```

* Minimumni topish:

```cpp
int minimum = st.top().second;
```

## Queueni o‘zgartirish (1-usul)

Endi queue bilan ham xuddi shu amallarni bajarishni istaymiz, ya’ni elementlarni oxiriga qo‘shamiz va boshidan olib tashlaymiz.

Bu yerda queueni o‘zgartirishning sodda usulini ko‘rib chiqamiz. Biroq uning katta kamchiligi bor: o‘zgartirilgan queue aslida barcha elementlarni saqlamaydi.

Asosiy g‘oya — queueda faqat minimumni aniqlash uchun kerak bo‘ladigan elementlarni saqlash. Aniqrog‘i, queuedagi qiymatlarni kamaymaydigan tartibda tutamiz, ya’ni eng kichik qiymat queue boshida turadi. Albatta, tartibni shunchaki ixtiyoriy usulda saqlamaymiz: haqiqiy joriy minimum har doim queueda qolishi kerak.

Shunda eng kichik element doimo queue boshida bo‘ladi. Yangi elementni queuega qo‘shishdan oldin “kesish” amalini bajarish kifoya: queuening oxiridan yangi elementdan katta bo‘lgan barcha elementlarni olib tashlaymiz, so‘ng yangi elementni oxiriga qo‘shamiz.

Bu bilan queuening tartibini buzmaymiz va yangi element keyingi biror qadamda minimum bo‘lib qolsa, uni yo‘qotmaymiz. Olib tashlangan elementlarning hech biri endi hech qachon minimum bo‘la olmaydi, shuning uchun ularni o‘chirish mumkin.

Queue boshidan bir elementni chiqarishni istaganimizda, u aslida u yerda bo‘lmasligi ham mumkin: oldinroq undan kichikroq element qo‘shilganda u o‘chirib yuborilgan bo‘lishi ehtimol. Shu sababli queuedan element o‘chirishda o‘chirilishi kerak bo‘lgan elementning qiymatini bilishimiz zarur. Agar queue boshidagi qiymat shu qiymatga teng bo‘lsa, uni xavfsiz olib tashlaymiz; aks holda hech narsa qilmaymiz.

Yuqoridagi amallarning implementatsiyasi:

```cpp
deque<int> q;
```

* Minimumni topish:

```cpp
int minimum = q.front();
```

* Element qo‘shish:

```cpp
while (!q.empty() && q.back() > new_element)
    q.pop_back();
q.push_back(new_element);
```

* Elementni olib tashlash:

```cpp
if (!q.empty() && q.front() == remove_element)
    q.pop_front();
```

Bu amallarning barchasi o‘rtacha $O(1)$ vaqt olishi ravshan, chunki har bir element faqat bir marta qo‘shilishi va faqat bir marta olib tashlanishi mumkin.

## Queueni o‘zgartirish (2-usul)

Bu — 1-usulning o‘zgartirilgan ko‘rinishi. Qaysi elementni olib tashlashimizni bilmasdan ham queue boshidan element o‘chira olishni istaymiz.

Buning uchun queuedagi har bir element bilan birga uning indeksini saqlaymiz. Shuningdek, jami nechta element qo‘shilganini va nechta element olib tashlanganini eslab boramiz.

```cpp
deque<pair<int, int>> q;
int cnt_added = 0;
int cnt_removed = 0;
```

* Minimumni topish:

```cpp
int minimum = q.front().first;
```

* Element qo‘shish:

```cpp
while (!q.empty() && q.back().first > new_element)
    q.pop_back();
q.push_back({new_element, cnt_added});
cnt_added++;
```

* Elementni olib tashlash:

```cpp
if (!q.empty() && q.front().second == cnt_removed) 
    q.pop_front();
cnt_removed++;
```

## Queueni o‘zgartirish (3-usul)

Bu yerda minimumni $O(1)$ vaqtda topish uchun queueni o‘zgartirishning yana bir usulini ko‘rib chiqamiz. Bu usulni implementatsiya qilish biroz murakkabroq, ammo bu safar barcha elementlar haqiqatan ham saqlanadi. Bundan tashqari, olib tashlanayotgan elementning qiymatini bilmasdan queue boshidan element o‘chira olamiz.

G‘oya masalani avval yechilgan stack masalasiga keltirishdan iborat. Demak, faqat ikkita stack yordamida queueni qanday modellashtirishni o‘rganishimiz kerak.

`s1` va `s2` nomli ikkita stack yaratamiz. Albatta, bu stacklar minimumni $O(1)$ vaqtda topishga imkon beradigan o‘zgartirilgan shaklda bo‘ladi. Yangi elementlarni `s1` stackiga qo‘shamiz, elementlarni esa `s2` stackidan olib tashlaymiz. Agar biror payt `s2` bo‘sh bo‘lsa, `s1` dagi barcha elementlarni `s2` ga ko‘chiramiz; bu amalda ularning tartibini teskarisiga aylantiradi.

Queue minimumini topish uchun ikki stack minimumining kichigini olish kifoya. Shunday qilib, barcha amallar o‘rtacha $O(1)$ vaqtda bajariladi: har bir element `s1` ga bir marta qo‘shiladi, `s2` ga bir marta ko‘chiriladi va `s2` dan bir marta chiqariladi.

Implementatsiya:

```cpp
stack<pair<int, int>> s1, s2;
```

* Minimumni topish:

```cpp
if (s1.empty() || s2.empty()) 
    minimum = s1.empty() ? s2.top().second : s1.top().second;
else
    minimum = min(s1.top().second, s2.top().second);
```

* Element qo‘shish:

```cpp
int minimum = s1.empty() ? new_element : min(new_element, s1.top().second);
s1.push({new_element, minimum});
```

* Elementni olib tashlash:

```cpp
if (s2.empty()) {
    while (!s1.empty()) {
        int element = s1.top().first;
        s1.pop();
        int minimum = s2.empty() ? element : min(element, s2.top().second);
        s2.push({element, minimum});
    }
}
int remove_element = s2.top().first;
s2.pop();
```

## Berilgan uzunlikdagi barcha ostmassivlar minimumini topish

Uzunligi $N$ bo‘lgan $A$ massiv va $M \le N$ soni berilgan bo‘lsin. Massivdagi uzunligi $M$ bo‘lgan har bir ostmassivning minimumini, ya’ni quyidagi qiymatlarni topishimiz kerak:

$$\min_{0 \le i \le M-1} A[i], \min_{1 \le i \le M} A[i], \min_{2 \le i \le M+1} A[i],~\dots~, \min_{N-M \le i \le N-1} A[i]$$

Masalani chiziqli, ya’ni $O(n)$ vaqtda yechish talab qilinadi.

Yuqoridagi uchta o‘zgartirilgan queuedan istalgan biri bilan masalani yechish mumkin. Yechim sodda: massivning dastlabki $M$ ta elementini queuega qo‘shamiz, minimumni topib chiqaramiz; keyin navbatdagi elementni qo‘shib, massivning eng oldingi elementini olib tashlaymiz va yangi minimumni chiqaramiz; shu jarayonni davom ettiramiz.

Queue bilan barcha amallar o‘rtacha o‘zgarmas vaqtda bajarilgani uchun butun algoritmning murakkabligi $O(n)$ bo‘ladi.

## Amaliy masalalar

* [Queries with Fixed Length](https://www.hackerrank.com/challenges/queries-with-fixed-length/problem)
* [Sliding Window Minimum](https://cses.fi/problemset/task/3221)
* [Binary Land](https://www.codechef.com/MAY20A/problems/BINLAND)

