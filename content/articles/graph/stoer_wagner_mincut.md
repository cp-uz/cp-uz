---
article_id: graph--stoer_wagner_mincut
---
# Minimal kesim — Stoer–Wagner algoritmi

## Masala ta’rifi

$n$ ta tugun va $m$ ta qirrali yo‘naltirilmagan vaznli $G$ graf berilgan. $C$ kesim — tugunlarning bo‘sh bo‘lmagan va barcha tugunlarni ham o‘z ichiga olmaydigan xos qism to‘plami (amalda kesim tugunlarni ikkita bo‘sh bo‘lmagan to‘plamga ajratadi: $C$ ga tegishli tugunlar va qolgan barcha tugunlar). Kesim vazni kesimdan o‘tuvchi, ya’ni aynan bitta uchi $C$ da bo‘lgan qirralar vaznlari yig‘indisidir:

$$ w(C) = \sum_{\substack{(v,u) \in E \\ u \in C,\ v \not\in C}} c(v,u), $$

bu yerda $E$ $G$ grafdagi barcha qirralar to‘plamini, $c(v,u)$ esa $(v,u)$ qirraning vaznini bildiradi.

Vazni **minimal bo‘lgan kesim**ni topish talab etiladi.

Ba’zan bu masala “global minimal kesim” deb ataladi — manba va qabul qiluvchi tugunlar berilib, qabul qiluvchini o‘z ichiga olib, manbani o‘z ichiga olmaydigan minimal $C$ kesimni topish masalasidan farqlash uchun. Global minimal kesim barcha mumkin bo‘lgan manba–qabul qiluvchi juftlari bo‘yicha minimal narxli kesimlarning minimumiga teng.
Bu masalani maksimal oqim algoritmi yordamida yechish mumkin bo‘lsa-da (barcha mumkin bo‘lgan manba va qabul qiluvchi juftlari uchun uni $O(n^2)$ marta ishga tushirib), quyida Mechthild Stoer va Frank Wagner 1994-yilda taklif qilgan ancha sodda va tez algoritmni tavsiflaymiz.
Umumiy holda sirtmoqlar va parallel qirralarga ruxsat beriladi, ammo sirtmoqlar natijaga mutlaqo ta’sir qilmaydi, parallel qirralarni esa har doim ularning yig‘indi vazniga ega bitta qirra bilan almashtirish mumkin. Shuning uchun soddalik uchun kirish grafida sirtmoq va parallel qirralar yo‘q deb faraz qilamiz.

## Algoritm tavsifi

Algoritmning **asosiy g‘oyasi** juda sodda. Quyidagi jarayonni iterativ takrorlaymiz: biror $s$ va $t$ tugunlar jufti orasidagi minimal kesimni topamiz, keyin shu ikki tugunni bittaga birlashtiramiz (ularning qo‘shnilik ro‘yxatlarini ulaymiz). Oxir-oqibat, $n-1$ ta iteratsiyadan so‘ng graf bitta tugungacha siqiladi va jarayon to‘xtaydi. Shundan so‘ng javob topilgan $n-1$ ta kesimning minimumidir.
Haqiqatan, har bir $i$-bosqichda $s_i$ va $t_i$ tugunlar orasida topilgan minimal $C_i$ kesim yo izlanayotgan global minimal kesim bo‘lib chiqadi, yo aksincha $s_i$ va $t_i$ ni turli to‘plamlarga joylashtirish foydasiz bo‘ladi; demak, bu ikki tugunni bittaga birlashtirish bilan hech narsani yomonlashtirmaymiz.
Shunday qilib, masalani quyidagiga keltirdik: berilgan grafda biror ixtiyoriy $s$ va $t$ tugunlar jufti orasidagi **minimal kesim**ni topish. Bu masalani yechish uchun yana iterativ jarayon taklif qilinadi. Dastlab ixtiyoriy bitta tugunni o‘z ichiga oladigan $A$ tugunlar to‘plamini kiritamiz. Har bir qadamda $A$ to‘plamiga **eng kuchli bog‘langan** tugunni, ya’ni quyidagi qiymati maksimal bo‘lgan $v \not\in A$ tugunni topamiz:

$$ w(v,A) = \sum_{\substack{(v,u) \in E \\ u \in A}} c(v,u) $$

(ya’ni bir uchi $v$ da, ikkinchi uchi $A$ da bo‘lgan qirralar vaznlari yig‘indisi maksimal).
Bu jarayon ham barcha tugunlar $A$ to‘plamiga o‘tganda $n-1$ ta iteratsiyadan so‘ng tugaydi (aytgancha, bu jarayon [Prim algoritmi](mst_prim.md)ga juda o‘xshaydi). **Stoer–Wagner teoremasi**ga ko‘ra, $A$ ga oxirgi qo‘shilgan ikki tugunni $s$ va $t$ deb belgilasak, $s$ va $t$ orasidagi minimal kesim faqat bitta — $t$ tugundan iborat bo‘ladi.
Bu teoremaning isboti keyingi bo‘limda beriladi (ko‘pincha bo‘lgani kabi, isbotning o‘zi algoritmni tushunishga deyarli yordam bermaydi).
Demak, **Stoer–Wagner algoritmining umumiy sxemasi** quyidagicha. Algoritm $n-1$ ta fazadan iborat. Har bir fazada $A$ to‘plami dastlab biror tugunni o‘z ichiga oladi va tugunlarning boshlang‘ich $w(v,A)$ vaznlari hisoblanadi.
Keyin $n-1$ ta iteratsiya bajariladi; har birida $w(v,A)$ qiymati eng katta bo‘lgan $u$ tugun tanlanib, $A$ to‘plamiga qo‘shiladi, so‘ng qolgan tugunlarning $w$ qiymatlari qayta hisoblanadi (buning uchun tanlangan $u$ tugunning qo‘shnilik ro‘yxatidagi barcha qirralardan o‘tish kerakligi ravshan). Barcha iteratsiyalar bajarilgach, oxirgi qo‘shilgan ikkita tugunni $s$ va $t$ da saqlaymiz; $w(t,A \setminus t)$ qiymatini $s$ va $t$ orasida topilgan minimal kesim narxi sifatida olish mumkin.
Keyin topilgan minimal kesimni joriy javob bilan solishtiramiz; agar u kichikroq bo‘lsa, javobni yangilab, keyingi fazaga o‘tamiz.
Murakkab ma’lumotlar tuzilmalaridan foydalanmasak, eng muhim qism $w$ qiymati eng katta tugunni topishdir. Buni $O(n)$ vaqtda bajarsak, har biri $n-1$ ta iteratsiyali $n-1$ ta faza mavjud bo‘lgani sababli algoritmning yakuniy **murakkabligi** $O(n^3)$ bo‘ladi.
$w$ qiymati eng katta tugunni topish uchun **Fibonacci heap** ishlatsak (u kalit qiymatini amortizatsiyalangan $O(1)$ vaqtda oshirish va maksimumni amortizatsiyalangan $O(\log n)$ vaqtda chiqarish imkonini beradi), bitta fazada $A$ to‘plamiga oid barcha amallar $O(m + n \log n)$ vaqtda bajariladi. Bu holatda algoritmning yakuniy murakkabligi $O(nm + n^2 \log n)$.

## Stoer–Wagner teoremasining isboti

Teorema bayonini eslaymiz. Har safar $A$ to‘plamiga unga eng kuchli bog‘langan tugunni qo‘shib, barcha tugunlarni bittadan qo‘shsak, oxiridan oldin qo‘shilgan tugunni $s$, oxirgi qo‘shilganini $t$ deb belgilaymiz. Unda minimal $s$-$t$ kesim faqat bitta — $t$ tugundan iborat.

Buni isbotlash uchun ixtiyoriy $s$-$t$ kesim $C$ ni ko‘rib, uning vazni faqat $t$ tugundan iborat kesim vaznidan kichik bo‘la olmasligini ko‘rsatamiz:

$$ w(\{t\}) \le w(C). $$

Buning uchun quyidagi faktni isbotlaymiz. $A_v$ — $v$ tugun qo‘shilishidan bevosita oldingi $A$ to‘plam holati bo‘lsin. $C_v$ — $C$ kesim tomonidan $A_v \cup \{v\}$ to‘plamida hosil qilingan kesim bo‘lsin (sodda qilib aytganda, $C_v$ shu ikki tugunlar to‘plamining kesishmasiga teng). Bundan tashqari, agar $v$ tugun va undan oldin qo‘shilgan tugun $C$ kesimning turli qismlariga tegishli bo‘lsa, $v$ tugunni $C$ kesimga nisbatan faol deb ataymiz. Shunda har bir faol $v$ tugun uchun quyidagi tengsizlik bajariladi, deb da’vo qilamiz:

$$ w(v,A_v) \le w(C_v). $$

Xususan, $t$ faol tugun (chunki undan oldin qo‘shilgan tugun $s$ edi) va $v=t$ uchun bu tengsizlik teorema bayoniga aylanadi:

$$ w(t,A_t) = w(\{t\}) \le w(C_t) = w(C). $$

Demak, bu tengsizlikni matematik induksiya yordamida isbotlaymiz.

Birinchi faol $v$ tugun uchun tengsizlik bajariladi (hatto tenglikka aylanadi), chunki $A_v$ ning barcha tugunlari kesimning bir qismiga, $v$ esa ikkinchi qismiga tegishli.
Endi bu tengsizlik biror $v$ tugungacha bo‘lgan barcha faol tugunlar uchun bajariladi deb faraz qilamiz; undan keyingi faol $u$ tugun uchun isbotlaymiz. Buning uchun chap tomonni o‘zgartiramiz:

$$ w(u,A_u) \equiv w(u,A_v) + w(u,A_u \setminus A_v). $$

Avval quyidagini qayd etamiz:

$$ w(u,A_v) \le w(v,A_v), $$

bu $A$ to‘plami $A_v$ ga teng bo‘lgan paytda unga $u$ emas, aynan $v$ tugun qo‘shilganidan kelib chiqadi; demak, $v$ ning $w$ qiymati eng katta edi.
Bundan tashqari, induksiya faraziga ko‘ra $w(v,A_v) \le w(C_v)$, shuning uchun:

$$ w(u,A_v) \le w(C_v), $$

bundan esa:

$$ w(u,A_u) \le w(C_v) + w(u,A_u \setminus A_v). $$

Endi $u$ tugun va $A_u \setminus A_v$ dagi barcha tugunlar $C$ kesimning turli qismlarida ekanini qayd etamiz. Shu sabab $w(u,A_u \setminus A_v)$ qiymati $w(C_u)$ da hisobga olinadigan, ammo $w(C_v)$ da hali hisobga olinmagan qirralar vaznlari yig‘indisini bildiradi. Bundan:

$$ w(u,A_u) \le w(C_v) + w(u,A_u \setminus A_v) \le w(C_u), $$

ya’ni kerakli natijani olamiz.

Biz $w(v,A_v) \le w(C_v)$ munosabatini isbotladik va yuqorida aytilganidek, butun teorema undan kelib chiqadi.

## Implementatsiya

Eng sodda va tushunarli implementatsiyada (murakkabligi $O(n^3)$) graf qo‘shnilik matritsasi ko‘rinishida beriladi. Javob `best_cost` va `best_cut` o‘zgaruvchilarida saqlanadi (minimal kesim narxi va unga kiradigan tugunlar).
Har bir tugun uchun `exist` massivi u hali mavjudmi yoki boshqa tugun bilan birlashtirilganmi, shuni saqlaydi. Har bir siqilgan $i$ tugun uchun `v[i]` ro‘yxati shu $i$ tugunga siqilgan asl tugunlar raqamlarini saqlaydi.
Algoritm $n-1$ ta fazadan iborat (`ph` o‘zgaruvchisi bo‘yicha sikl). Har bir faza boshida barcha tugunlar $A$ to‘plamidan tashqarida bo‘ladi, shuning uchun `in_a` massivi nollar bilan to‘ldiriladi va barcha tugunlarning $w$ bog‘liqliklari nolga teng. $n-\mathrm{ph}$ ta iteratsiyaning har birida $w$ qiymati eng katta `sel` tugun topiladi. Agar bu oxirgi iteratsiya bo‘lsa, zarur bo‘lsa javob yangilanadi va oxiridan oldin tanlangan `prev` hamda oxirgi tanlangan `sel` tugun bittaga birlashtiriladi.
Agar iteratsiya oxirgisi bo‘lmasa, `sel` tugun $A$ to‘plamiga qo‘shiladi, so‘ng qolgan barcha tugunlarning vaznlari qayta hisoblanadi.
Algoritm ishlash davomida `g` grafni “buzishi”ni unutmang; agar keyin ham undan foydalanish kerak bo‘lsa, funksiyani chaqirishdan oldin uning nusxasini saqlash zarur.

```{.cpp file=stoer_wagner_mincut}
const int MAXN = 500;
int n;
long long g[MAXN][MAXN];
long long best_cost = (1LL << 62);
vector<int> best_cut;
void mincut() {
    vector<int> v[MAXN];
    for (int i = 0; i < n; ++i)
        v[i].assign(1, i);
    long long w[MAXN];
    bool exist[MAXN], in_a[MAXN];
    memset(exist, true, sizeof exist);
    for (int ph = 0; ph < n - 1; ++ph) {
        memset(in_a, false, sizeof in_a);
        memset(w, 0, sizeof w);
        for (int it = 0, prev; it < n - ph; ++it) {
            int sel = -1;
            for (int i = 0; i < n; ++i)
                if (exist[i] && !in_a[i] && (sel == -1 || w[i] > w[sel]))
                    sel = i;
            if (it == n - ph - 1) {
                if (w[sel] < best_cost) {
                    best_cost = w[sel];
                    best_cut = v[sel];
                }
                v[prev].insert(v[prev].end(), v[sel].begin(), v[sel].end());
                for (int i = 0; i < n; ++i)
                    g[prev][i] = g[i][prev] += g[sel][i];
                exist[sel] = false;
            } else {
                in_a[sel] = true;
                for (int i = 0; i < n; ++i)
                    w[i] += g[sel][i];
                prev = sel;
            }
        }
    }
}
```

## Adabiyotlar

- [Mechthild Stoer, Frank Wagner. A Simple Min-Cut Algorithm. Journal of the ACM, 44(4):585-591, 1997](https://dl.acm.org/doi/10.1145/263867.263872)
- [Kurt Mehlhorn, Christian Uhrig. The minimum cut algorithm of Stoer and Wagner [1995]](https://www.researchgate.net/publication/2483703_The_minimum_cut_algorithm_of_Stoer_and_Wagner)

