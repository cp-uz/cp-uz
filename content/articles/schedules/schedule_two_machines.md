---
article_id: schedules--schedule_two_machines
---
# Ishlarni ikkita mashinada rejalashtirish

Bu masalada $n$ ta ishni ikkita mashinada bajarish uchun optimal jadval topiladi. Har bir ish avval birinchi, keyin ikkinchi mashinada qayta ishlanishi kerak. $i$-ish birinchi mashinada $a_i$, ikkinchi mashinada $b_i$ vaqt oladi. Har bir mashina bir vaqtda faqat bitta ishni bajarishi mumkin.

Barcha ishlar tugaydigan vaqt imkon qadar kichik bo‘lishi uchun ularning optimal tartibini topmoqchimiz.

Bu yerda ko‘riladigan yechim S. M. Johnson nomi bilan atalgan **Johnson qoidasi**dir.

Mashinalar soni ikkitadan ko‘p bo‘lsa, masala NP-to‘liq bo‘lib qolishini ta’kidlash kerak.

## Algoritmni qurish

Avvalo, birinchi va ikkinchi mashinadagi ishlar tartibi bir xil bo‘lishi kerak deb olish mumkin. Haqiqatan, ishlar ikkinchi mashina uchun birinchi mashinada bajarilgach tayyor bo‘ladi. Agar ikkinchi mashina uchun bir nechta ish tayyor bo‘lsa, ularning tartibidan qat’i nazar jami bajarilish vaqti $b_i$ lar yig‘indisiga teng. Shu sababli ishlarni ikkinchi mashinaga birinchi mashinadagi tartibda yuborish hech qachon yomon emas.

Ishlar tartibi ularning kirishdagi $1, 2, \dots, n$ tartibiga teng bo‘lsin.

$x_i$ bilan ikkinchi mashinaning $i$-ishni boshlashidan oldingi **bekor turish vaqti**ni belgilaymiz. Maqsad — jami bekor turish vaqtini **minimallashtirish**:

$$F(x) = \sum x_i \rightarrow \min$$

Birinchi ish uchun $x_1 = a_1$. Ikkinchi ish birinchi mashinadan $a_1 + a_2$ vaqtda chiqadi, ikkinchi mashina esa $x_1 + b_1$ vaqtda bo‘shaydi. Shuning uchun $x_2 = \max((a_1 + a_2) - (x_1 + b_1), 0)$. Umumiy holda:

$$x_k = \max\left(\sum_{i=1}^k a_i - \sum_{i=1}^{k-1} b_i - \sum_{i=1}^{k-1} x_i, 0 \right)$$

Endi jami bekor turish vaqti $F(x)$ ni hisoblash mumkin. U quyidagi ko‘rinishga ega:

$$F(x) = \max_{k=1 \dots n} K_k,$$

bu yerda

$$K_k = \sum_{i=1}^k a_i - \sum_{i=1}^{k-1} b_i.$$

Buni induksiya yordamida oson tekshirish mumkin.

Endi **almashtirish usuli**dan foydalanamiz: ikkita qo‘shni $j$ va $j+1$ ishlarning o‘rnini almashtirib, jami bekor turish vaqti qanday o‘zgarishini ko‘ramiz.

$K_i$ ifodasidan faqat $K_j$ va $K_{j+1}$ o‘zgarishi ko‘rinadi; ularning yangi qiymatlarini $K_j'$ va $K_{j+1}'$ deb belgilaymiz.

Agar $j$ va $j+1$ ishlarni almashtirish jami bekor turish vaqtini oshirgan bo‘lsa, quyidagi shart bajarilishi kerak:

$$\max(K_j, K_{j+1}) \le \max(K_j', K_{j+1}')$$

Ikki ishning o‘rnini almashtirish umuman ta’sir qilmasligi ham mumkin. Yuqoridagi shart yetarli, lekin zarur shart emas.

Tengsizlikning ikki tomonidan $\sum_{i=1}^{j+1} a_i - \sum_{i=1}^{j-1} b_i$ ni olib tashlasak:

$$\max(-a_{j+1}, -b_j) \le \max(-b_{j+1}, -a_j)$$

Manfiy ishoralarni yo‘qotsak:

$$\min(a_j, b_{j+1}) \le \min(b_j, a_{j+1})$$

Shunday qilib, **taqqoslagich** hosil bo‘ldi. Ishlarni shu qoida bo‘yicha saralash orqali hech bir qo‘shni juftligini almashtirish yakuniy vaqtni yaxshilamaydigan optimal tartib olinadi.

Taqqoslagichga boshqacha qarab, saralashni yanada **soddalashtirish** mumkin. To‘rtta $(a_j, a_{j+1}, b_j, b_{j+1})$ vaqt orasidagi minimum birinchi mashinaga tegishli bo‘lsa, mos ish oldin bajarilishi kerak. Minimum ikkinchi mashina vaqtiga tegishli bo‘lsa, mos ish keyinroq bajariladi. Demak, ishlarni $\min(a_i, b_i)$ bo‘yicha saralaymiz. Joriy ishning birinchi mashinadagi vaqti ikkinchi mashinadagi vaqtidan kichik bo‘lsa, uni qolganlarning oldiga, aks holda qolganlarning ortiga qo‘yamiz.

Johnson qoidasi masalani saralash orqali yechadi va $O(n \log n)$ vaqt murakkabligini beradi.

## Amalga oshirish

Quyida algoritmning ikkinchi ko‘rinishi amalga oshirilgan.

```{.cpp file=johnsons_rule}
struct Job {
    int a, b, idx;

    bool operator<(Job o) const {
        return min(a, b) < min(o.a, o.b);
    }
};

vector<Job> johnsons_rule(vector<Job> jobs) {
    sort(jobs.begin(), jobs.end());
    vector<Job> a, b;
    for (Job j : jobs) {
        if (j.a < j.b)
            a.push_back(j);
        else
            b.push_back(j);
    }
    a.insert(a.end(), b.rbegin(), b.rend());
    return a;
}

pair<int, int> finish_times(vector<Job> const& jobs) {
    int t1 = 0, t2 = 0;
    for (Job j : jobs) {
        t1 += j.a;
        t2 = max(t2, t1) + j.b;
    }
    return make_pair(t1, t2);
}
```

Har bir ish haqidagi ma’lumot `Job` tuzilmasida saqlanadi. Birinchi funksiya barcha ishlarni saralab, optimal jadvalni hisoblaydi. Ikkinchi funksiya esa berilgan jadval bo‘yicha ikki mashinaning tugash vaqtlarini topadi.
