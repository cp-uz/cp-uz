---
article_id: string--main_lorentz
---
# Takrorlanishlarni topish

Uzunligi $n$ bo‘lgan $s$ satr berilgan.

**Takrorlanish** — bir satrning ketma-ket ikki marta uchrashidir. Boshqacha aytganda, takrorlanishni $i<j$ indekslar juftligi bilan ifodalash mumkin; bunda $s[i\dots j]$ qism satri ketma-ket yozilgan ikkita bir xil satrdan iborat bo‘ladi.

Masala — berilgan $s$ satrdagi barcha takrorlanishlarni topish. Uning soddalashtirilgan ko‘rinishlari ham mavjud: istalgan bitta takrorlanishni yoki eng uzun takrorlanishni topish.

Bu yerda tasvirlanadigan algoritm Main va Lorentz tomonidan 1982-yilda e’lon qilingan.

## Misol

Quyidagi satrdagi takrorlanishlarni ko‘rib chiqamiz:

$$acababaee$$

Bu satrda quyidagi uchta takrorlanish mavjud:

* $s[2\dots 5]=abab$
* $s[3\dots 6]=baba$
* $s[7\dots 8]=ee$

Yana bir misol:

$$abaaba$$

Bu yerda faqat ikkita takrorlanish bor:

* $s[0\dots 5]=abaaba$
* $s[2\dots 3]=aa$

## Takrorlanishlar soni

Umumiy holda uzunligi $n$ bo‘lgan satrda $O(n^2)$ tagacha takrorlanish bo‘lishi mumkin. Eng sodda misol — bir xil harf $n$ marta yozilgan satr: bu holda juft uzunlikdagi istalgan qism satr takrorlanishdir. Umuman, davri qisqa bo‘lgan har qanday davriy satr juda ko‘p takrorlanishni o‘z ichiga oladi.

Biroq bu fakt takrorlanishlar sonini $O(n\log n)$ vaqtda hisoblashga to‘sqinlik qilmaydi, chunki algoritm takrorlanishlarni siqilgan ko‘rinishda — bir vaqtning o‘zida bir nechta elementdan iborat guruhlar sifatida — bera oladi.

Davriy qism satrlar guruhlarini to‘rtta sondan iborat kortejlar bilan ifodalaydigan tushuncha ham mavjud. Bunday guruhlar soni satr uzunligiga nisbatan ko‘pi bilan chiziqli ekani isbotlangan.

Takrorlanishlar soniga oid yana bir nechta qiziqarli natija:

* **Primitiv takrorlanishlar** — ya’ni yarmilarining o‘zi takrorlanish bo‘lmagan takrorlanishlar — soni ko‘pi bilan $O(n\log n)$.
* Takrorlanishlarni **Crochemore uchliklari** deb ataladigan $(i,\,p,\,r)$ sonlar uchligi bilan kodlasak — bu yerda $i$ boshlanish pozitsiyasi, $p$ takrorlanuvchi qism satr uzunligi, $r$ esa takrorlanishlar soni — barcha takrorlanishlarni $O(n\log n)$ ta shunday uchlik bilan ifodalash mumkin.
* Quyidagicha aniqlanadigan Fibonacci satrlari

$$
\begin{align}
t_0 &= a, \\
t_1 &= b, \\
t_i &= t_{i-1}+t_{i-2}
\end{align}
$$

“kuchli” davriydir. $f_i$ Fibonacci satridagi takrorlanishlar soni, hatto Crochemore uchliklari bilan siqilgan ko‘rinishda ham, $O(f_n\log f_n)$ bo‘ladi. Primitiv takrorlanishlar soni ham $O(f_n\log f_n)$.

## Main–Lorentz algoritmi

Main–Lorentz algoritmining asosiy g‘oyasi — bo‘lib tashla va hukmronlik qil usuli.

Algoritm boshlang‘ich satrni ikki yarmiga bo‘ladi va ikki rekursiv chaqiruv yordamida har bir yarm ichida to‘liq joylashgan takrorlanishlarni hisoblaydi. Keyin qiyin qism keladi: birinchi yarmda boshlanib, ikkinchi yarmda tugaydigan barcha takrorlanishlar topiladi. Ularni **kesib o‘tuvchi takrorlanishlar** deb ataymiz. Bu Main–Lorentz algoritmining asosiy qismi bo‘lib, uni batafsil ko‘rib chiqamiz.

Bo‘lib tashla va hukmronlik qil algoritmlarining murakkabligi yaxshi o‘rganilgan. [Master teoremasi](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms))ga ko‘ra, kesib o‘tuvchi takrorlanishlarni $O(n)$ vaqtda topa olsak, umumiy algoritm $O(n\log n)$ vaqtda ishlaydi.

### Kesib o‘tuvchi takrorlanishlarni qidirish

Demak, satrning $u$ deb ataladigan birinchi yarmida boshlanib, $v$ deb ataladigan ikkinchi yarmida tugaydigan barcha takrorlanishlarni topmoqchimiz:

$$s=u+v$$

$u$ va $v$ uzunliklari taxminan $|s|/2$ ga teng.

Ixtiyoriy takrorlanishni ko‘rib, uning o‘rta belgisiga — aniqrog‘i, takrorlanishning ikkinchi yarmidagi birinchi belgiga — qaraylik. Agar takrorlanish $s[i\dots j]$ qism satri bo‘lsa, uning o‘rta belgisi $(i+j+1)/2$ pozitsiyada joylashadi.

Bu belgi $u$ satrida yoki $v$ satrida joylashishiga qarab takrorlanishni **chap** yoki **o‘ng** deb ataymiz. Boshqacha aytganda, takrorlanishning katta qismi $u$ ichida bo‘lsa, u chap; aks holda o‘ng takrorlanish deyiladi.

Avval barcha chap takrorlanishlarni qanday topishni muhokama qilamiz. Barcha o‘ng takrorlanishlar xuddi shu usulda topiladi.

Chap takrorlanish uzunligini $2l$ bilan belgilaylik, ya’ni uning har bir yarmi uzunligi $l$. Takrorlanishning $v$ satriga tushadigan birinchi belgisini ko‘rib chiqamiz; u $s$ satrining $|u|$ pozitsiyasida turadi. Bu belgi undan $l$ pozitsiya oldingi belgi bilan teng. O‘sha oldingi pozitsiyani $cntr$ deb belgilaymiz.

$cntr$ pozitsiyani qayd etib, unga mos barcha takrorlanishlarni qidiramiz.

Masalan:

$$c~\underset{cntr}{a}~c~|~a~d~a$$

Vertikal chiziq satrning ikki yarmini ajratadi. Bu yerda $cntr=1$ pozitsiya qayd etilgan va shu pozitsiyada $caca$ takrorlanishi topiladi.

$cntr$ pozitsiyani qayd etishimiz bilan mumkin bo‘lgan takrorlanishlar uzunligi ham aniqlanishi ravshan:

$$l=|u|-cntr.$$

Bu takrorlanishlarni qanday topishni bilganimizdan so‘ng, $cntr$ ning $0$ dan $|u|-1$ gacha bo‘lgan barcha qiymatlarini ko‘rib chiqamiz va uzunligi mos ravishda

$$l=|u|,\ |u|-1,\ \dots,\ 1$$

bo‘lgan barcha chap kesib o‘tuvchi takrorlanishlarni topamiz.

### Chap kesib o‘tuvchi takrorlanishlar mezoni

Qayd etilgan $cntr$ uchun barcha shunday takrorlanishlarni qanday topamiz? Bu pozitsiyada bir nechta takrorlanish bo‘lishi mumkinligini unutmaslik kerak.

Yana bir tasviriy misolga, bu safar $abcabc$ takrorlanishiga qaraylik:

$$\overbrace{a}^{l_1}~\overbrace{\underset{cntr}{b}~c}^{l_2}~\overbrace{a}^{l_1}~|~\overbrace{b~c}^{l_2}$$

Bu yerda takrorlanish qismlarining uzunliklarini $l_1$ va $l_2$ bilan belgiladik: $l_1$ — takrorlanishning $cntr-1$ pozitsiyagacha bo‘lgan qismi uzunligi, $l_2$ esa $cntr$ dan takrorlanish yarmining oxirigacha bo‘lgan qism uzunligi. Takrorlanishning jami uzunligi

$$2l=l_1+l_2+l_1+l_2$$

bo‘ladi.

$cntr$ pozitsiyadagi uzunligi

$$2l=2(l_1+l_2)=2(|u|-cntr)$$

bo‘lgan takrorlanish uchun zarur va yetarli shartlarni hosil qilamiz:

* $k_1$ — $cntr$ pozitsiyasidan oldingi dastlabki $k_1$ ta belgi $u$ satrining oxirgi $k_1$ ta belgisi bilan mos tushadigan eng katta son bo‘lsin:

$$u[cntr-k_1\dots cntr-1]=u[|u|-k_1\dots |u|-1].$$

* $k_2$ — $cntr$ pozitsiyasidan boshlanadigan $k_2$ ta belgi $v$ satrining dastlabki $k_2$ ta belgisi bilan mos tushadigan eng katta son bo‘lsin:

$$u[cntr\dots cntr+k_2-1]=v[0\dots k_2-1].$$

* U holda quyidagi shartlarni qanoatlantiradigan har bir $(l_1,l_2)$ juftlik uchun takrorlanish mavjud:

$$
\begin{align}
l_1 &\le k_1, \\
l_2 &\le k_2.
\end{align}
$$

Xulosa qilib:

* Muayyan $cntr$ pozitsiyani qayd etamiz.
* Endi topiladigan barcha takrorlanishlarning uzunligi $2l=2(|u|-cntr)$ bo‘ladi. Bunday takrorlanishlar bir nechta bo‘lishi mumkin; ular $l_1$ va $l_2=l-l_1$ uzunliklarga bog‘liq.
* Yuqorida tavsiflanganidek $k_1$ va $k_2$ ni topamiz.
* So‘ng mos takrorlanishlar aynan qismlar uzunliklari quyidagi shartlarni qanoatlantiradiganlar bo‘ladi:

$$
\begin{align}
l_1+l_2 &= l=|u|-cntr, \\
l_1 &\le k_1, \\
l_2 &\le k_2.
\end{align}
$$

Endi faqat har bir $cntr$ pozitsiya uchun $k_1$ va $k_2$ qiymatlarini tez hisoblash qoladi. Yaxshiyamki, ularni [Z-funksiya](z-function.md) yordamida $O(1)$ vaqtda olish mumkin:

* Har bir pozitsiya uchun $k_1$ ni topish maqsadida $\overline{u}$, ya’ni teskari yozilgan $u$ satrining Z-funksiyasini hisoblaymiz. Muayyan $cntr$ uchun $k_1$ Z-funksiya massivining tegishli qiymatiga teng bo‘ladi.
* Barcha $k_2$ qiymatlarini oldindan hisoblash uchun $v+\#+u$ satrining Z-funksiyasini hisoblaymiz. Shundan so‘ng $k_2$ ni olish uchun Z-funksiya massivining tegishli qiymatiga murojaat qilish kifoya.

Bu barcha chap kesib o‘tuvchi takrorlanishlarni topish uchun yetarli.

### O‘ng kesib o‘tuvchi takrorlanishlar

O‘ng kesib o‘tuvchi takrorlanishlarni hisoblashda ham xuddi shunday yo‘l tutamiz: $cntr$ markazni $u$ satrining oxirgi belgisiga mos keladigan belgi sifatida aniqlaymiz.

Bu holda $k_1$ — $cntr$ pozitsiyasidan oldingi, $cntr$ ning o‘zini ham o‘z ichiga oladigan va $u$ satrining oxirgi belgilari bilan mos tushadigan belgilar sonining maksimumi. $k_2$ esa $cntr+1$ pozitsiyadan boshlanib, $v$ satri belgilari bilan mos tushadigan belgilar sonining maksimumi bo‘ladi.

Shunday qilib, $k_1$ va $k_2$ qiymatlarini $\overline{u}+\#+\overline{v}$ hamda $v$ satrlarining Z-funksiyalarini hisoblash orqali topamiz.

Shundan so‘ng barcha $cntr$ pozitsiyalarini ko‘rib chiqib, chap kesib o‘tuvchi takrorlanishlar uchun ishlatilgan mezonning o‘zidan foydalanamiz.

### Implementatsiya

Main–Lorentz algoritmining quyidagi implementatsiyasi barcha takrorlanishlarni $O(n\log n)$ vaqtda to‘rtta sondan iborat o‘ziga xos $(cntr,l,k_1,k_2)$ kortejlar ko‘rinishida topadi. Agar satrdagi takrorlanishlar sonini yoki faqat eng uzun takrorlanishni topmoqchi bo‘lsangiz, shu axborotning o‘zi yetarli va ishlash vaqti $O(n\log n)$ bo‘lib qoladi.

Agar bu kortejlarni yoyib, har bir takrorlanishning boshlanish va tugash pozitsiyalarini olish kerak bo‘lsa, ishlash vaqti $O(n^2)$ bo‘ladi — satrda $O(n^2)$ ta takrorlanish bo‘lishi mumkinligini eslang. Quyidagi implementatsiya aynan shunday qiladi va topilgan barcha takrorlanishlarni boshlanish hamda tugash indekslari juftliklari vektorida saqlaydi.

```cpp
vector<int> z_function(string const& s) {
    int n = s.size();
    vector<int> z(n);
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r)
            z[i] = min(r-i+1, z[i-l]);
        while (i + z[i] < n && s[z[i]] == s[i+z[i]])
            z[i]++;
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}

int get_z(vector<int> const& z, int i) {
    if (0 <= i && i < (int)z.size())
        return z[i];
    else
        return 0;
}

vector<pair<int, int>> repetitions;
void convert_to_repetitions(int shift, bool left, int cntr, int l, int k1, int k2) {
    for (int l1 = max(1, l - k2); l1 <= min(l, k1); l1++) {
        if (left && l1 == l) break;
        int l2 = l - l1;
        int pos = shift + (left ? cntr - l1 : cntr - l - l1 + 1);
        repetitions.emplace_back(pos, pos + 2*l - 1);
    }
}

void find_repetitions(string s, int shift = 0) {
    int n = s.size();
    if (n == 1)
        return;
    int nu = n / 2;
    int nv = n - nu;
    string u = s.substr(0, nu);
    string v = s.substr(nu);
    string ru(u.rbegin(), u.rend());
    string rv(v.rbegin(), v.rend());

    find_repetitions(u, shift);
    find_repetitions(v, shift + nu);

    vector<int> z1 = z_function(ru);
    vector<int> z2 = z_function(v + '#' + u);
    vector<int> z3 = z_function(ru + '#' + rv);
    vector<int> z4 = z_function(v);
    for (int cntr = 0; cntr < n; cntr++) {
        int l, k1, k2;
        if (cntr < nu) {
            l = nu - cntr;
            k1 = get_z(z1, nu - cntr);
            k2 = get_z(z2, nv + 1 + cntr);
        } else {
            l = cntr - nu + 1;
            k1 = get_z(z3, nu + 1 + nv - 1 - (cntr - nu));
            k2 = get_z(z4, (cntr - nu) + 1);
        }
        if (k1 + k2 >= l)
            convert_to_repetitions(shift, cntr < nu, cntr, l, k1, k2);
    }
}
```

