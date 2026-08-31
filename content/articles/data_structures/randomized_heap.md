---
article_id: data_structures--randomized_heap
---
# Tasodifiylashtirilgan heap

Tasodifiylashtirilgan heap — tasodifiylashtirish yordamida barcha amallarni kutilgan logarifmik vaqtda bajarishga imkon beradigan heap.

**Min-heap** — har bir tugundagi qiymat uning farzandlaridagi qiymatlardan kichik yoki ularga teng bo‘lgan ikkilik daraxt. Demak, daraxtdagi minimum har doim ildiz tugunda joylashadi.

Max-heap ham xuddi shunday aniqlanadi, faqat “kichik” o‘rniga “katta” munosabati ishlatiladi.

Heapning odatiy amallari quyidagilar:

- qiymat qo‘shish;
- minimumni olish;
- minimumni o‘chirish;
- ikkita heapni birlashtirish (takroriy qiymatlarni o‘chirmasdan);
- ixtiyoriy elementni o‘chirish, agar uning daraxtdagi o‘rni ma’lum bo‘lsa.

Tasodifiylashtirilgan heap juda sodda implementatsiya bilan bu amallarning barchasini kutilgan $O(\log n)$ vaqtda bajaradi.

## Ma’lumotlar tuzilmasi

Ikkilik heapning tuzilishini darhol quyidagicha ifodalash mumkin:

```{.cpp file=randomized_heap_structure}
struct Tree {
    int value;
    Tree * l = nullptr;
    Tree * r = nullptr;
};
```

Har bir tugunda bitta qiymat saqlanadi. Bundan tashqari, chap va o‘ng farzandlarga ko‘rsatkichlar mavjud; tegishli farzand bo‘lmasa, ko‘rsatkich `null` qiymatiga teng bo‘ladi.

## Amallar

Barcha amallarni bitta asosiy amalga — ikkita heapni bitta heapga **birlashtirish** amaliga keltirish mumkinligini ko‘rish qiyin emas.

Haqiqatan ham, heapga yangi qiymat qo‘shish mavjud heapni faqat shu qiymatli bitta tugundan iborat heap bilan birlashtirishga teng. Minimumni topish uchun hech qanday qo‘shimcha amal kerak emas: minimum ildizdagi qiymatning o‘zi. Minimumni o‘chirish esa ildizning chap va o‘ng farzandlarini birlashtirish natijasiga teng. Ixtiyoriy elementni o‘chirish ham shunga o‘xshaydi: o‘chirilayotgan tugunning farzandlarini birlashtirib, tugunning o‘rniga hosil bo‘lgan heapni qo‘yamiz.

Shunday qilib, faqat ikkita heapni birlashtirish amalini implementatsiya qilish kifoya; qolgan barcha amallar unga sodda tarzda keltiriladi.

Ikkita $T_1$ va $T_2$ heap berilgan bo‘lsin. Har bir heapning ildizida uning minimumi turadi. Demak, natijaviy heapning ildizi shu ikkita qiymatning kichigi bo‘ladi. Ildizlardagi qiymatlarni solishtirib, kichikroq qiymatli tugunni yangi ildiz sifatida tanlaymiz.

Endi tanlangan tugunning farzandlari bilan qolgan heapni birlashtirish kerak. Buning uchun tanlangan tugunning ikki farzandidan birini olib, uni qolgan heap bilan birlashtiramiz. Natijada yana aynan ikkita heapni birlashtirish masalasiga qaytamiz. Bu jarayon albatta tugaydi, chunki qadamlar soni ikki heap balandliklari yig‘indisi bilan cheklangan.

O‘rtacha logarifmik murakkablikka erishish uchun qaysi farzand tanlanishini shunday belgilashimiz kerakki, o‘rtacha yo‘l uzunligi logarifmik bo‘lsin. Buning tabiiy yechimi — farzandni **tasodifiy** tanlash.

Birlashtirish amalining implementatsiyasi:

```{.cpp file=randomized_heap_merge}
Tree* merge(Tree* t1, Tree* t2) {
    if (!t1 || !t2)
        return t1 ? t1 : t2;
    if (t2->value < t1->value)
        swap(t1, t2);
    if (rand() & 1)
        swap(t1->l, t1->r);
    t1->l = merge(t1->l, t2);
    return t1;
}
```

Avval heaplardan biri bo‘sh yoki yo‘qligi tekshiriladi. Ulardan biri bo‘sh bo‘lsa, hech qanday birlashtirish bajarish shart emas va bo‘sh bo‘lmagan heap qaytariladi.

Aks holda, zarur bo‘lsa `t1` va `t2` almashtirilib, ildizidagi qiymati kichikroq bo‘lgan heap `t1` qilinadi. `t1` ning chap farzandini `t2` bilan birlashtirmoqchimiz; farzandlardan birini tasodifiy tanlash uchun avval `t1` ning chap va o‘ng farzandlarini tasodifiy ravishda almashtiramiz, keyin rekursiv birlashtirishni bajaramiz.

## Murakkablik

$h(T)$ tasodifiy miqdorni kiritamiz. U $T$ heapning ildizidan barggacha tasodifiy tanlangan yo‘lning uzunligini, ya’ni qirralar sonini bildiradi.

`merge` algoritmi $O(h(T_1) + h(T_2))$ qadam bajarishi ravshan. Shuning uchun amallarning murakkabligini tushunish uchun $h(T)$ tasodifiy miqdorni o‘rganishimiz kerak.

### Kutilgan qiymat

$h(T)$ ning matematik kutilmasi heapdagi tugunlar soni logarifmi bilan yuqoridan baholanadi:

$$\mathbf{E} h(T) \le \log(n+1)$$

Buni induksiya bilan oson isbotlash mumkin. $L$ va $R$ — $T$ ildizining chap va o‘ng ost-daraxtlari, $n_L$ va $n_R$ esa ulardagi tugunlar soni bo‘lsin; demak, $n = n_L + n_R + 1$.

Induksiya qadami quyidagicha:

$$\begin{align}
\mathbf{E} h(T) &= 1 + \frac{\mathbf{E} h(L) + \mathbf{E} h(R)}{2}
\le 1 + \frac{\log(n_L + 1) + \log(n_R + 1)}{2} \\
&= 1 + \log\sqrt{(n_L + 1)(n_R + 1)} = \log 2\sqrt{(n_L + 1)(n_R + 1)} \\
&\le \log \frac{2\left((n_L + 1) + (n_R + 1)\right)}{2} = \log(n_L + n_R + 2) = \log(n+1)
\end{align}$$

### Kutilgan qiymatdan oshib ketish

Faqat kutilgan qiymatning o‘zi eng yomon holat haqida yetarli ma’lumot bermaydi. Muayyan daraxtda ildizdan tugunlargacha bo‘lgan yo‘llar o‘rtacha $\log(n+1)$ dan ancha katta bo‘lishi nazariy jihatdan mumkin.

Endi kutilgan qiymatdan sezilarli oshib ketish ehtimoli juda kichik ekanini isbotlaymiz:

$${\cal P}(h(T) > (c+1) \log n) < \frac{1}{n^c}$$

ixtiyoriy musbat o‘zgarmas $c$ uchun.

$P$ bilan heap ildizidan barglargacha bo‘lgan va uzunligi $(c+1)\log n$ dan katta yo‘llar to‘plamini belgilaymiz. Uzunligi $|p|$ bo‘lgan har bir $p$ yo‘l tasodifiy yo‘l sifatida tanlanish ehtimoli $2^{-|p|}$ ga teng. Shuning uchun:

$${\cal P}(h(T) > (c+1) \log n) = \sum_{p \in P} 2^{-|p|} < \sum_{p \in P} 2^{-(c+1) \log n} = |P| n^{-(c+1)} \le n^{-c}$$

### Algoritm murakkabligi

Demak, `merge` algoritmi va u orqali ifodalangan boshqa barcha amallar o‘rtacha $O(\log n)$ vaqtda bajariladi.

Bundan tashqari, ixtiyoriy musbat $\epsilon$ uchun shunday musbat $c$ o‘zgarmas mavjudki, amalning $c\log n$ dan ko‘p qadam talab qilish ehtimoli $n^{-\epsilon}$ dan kichik bo‘ladi. Bu baho ma’lum ma’noda algoritmning eng yomon holatdagi xatti-harakatini ham tavsiflaydi.

