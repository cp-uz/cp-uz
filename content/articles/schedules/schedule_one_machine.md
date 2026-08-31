---
article_id: schedules--schedule_one_machine
---
# Ishlarni bitta mashinada rejalashtirish

Bu masalada $n$ ta ishni bitta mashinada bajarish uchun optimal jadval topiladi. $i$-ishni bajarish $t_i$ vaqt oladi, ammo ish boshlanishidan oldin $t$ soniya kutilsa, $f_i(t)$ jarima to‘lanadi.

Demak, ishlarning jami jarimasi eng kichik bo‘ladigan permutatsiyasini topish kerak. Ishlar permutatsiyasini $\pi$ bilan belgilasak ($\pi_1$ birinchi, $\pi_2$ ikkinchi va hokazo bajariladi), jami jarima quyidagiga teng:

$$F(\pi) = f_{\pi_1}(0) + f_{\pi_2}(t_{\pi_1}) + f_{\pi_3}(t_{\pi_1} + t_{\pi_2}) + \dots + f_{\pi_n}\left(\sum_{i=1}^{n-1} t_{\pi_i}\right)$$

## Maxsus holatlar uchun yechimlar

### Chiziqli jarima funksiyalari

Avval barcha jarima funksiyalari $f_i(t) = c_i \cdot t$ ko‘rinishidagi chiziqli funksiya bo‘lgan holatni yechamiz; bu yerda $c_i$ — nomanfiy son. Bu funksiyalarda o‘zgarmas had yo‘qligiga e’tibor bering. Agar o‘zgarmas hadlar bo‘lsa, ularning barchasini alohida yig‘ib, masalani ularsiz yechish mumkin.

Biror $\pi$ permutatsiyani va $i = 1 \dots n-1$ indeksni belgilaymiz. $\pi'$ permutatsiya $\pi$ dan $i$ va $i+1$ elementlarining o‘rni almashtirilishi bilan hosil bo‘lsin. Jarima qanchaga o‘zgarishini ko‘ramiz:

$$F(\pi') - F(\pi) =$$

O‘zgarish faqat $i$- va $(i+1)$-qo‘shiluvchilarda yuz berishi oson ko‘rinadi:

$$\begin{align}
&= c_{\pi_i'} \cdot \sum_{k = 1}^{i-1} t_{\pi_k'} + c_{\pi_{i+1}'} \cdot \sum_{k = 1}^i t_{\pi_k'} - c_{\pi_i} \cdot \sum_{k = 1}^{i-1} t_{\pi_k} - c_{\pi_{i+1}} \cdot \sum_{k = 1}^i t_{\pi_k} \\
&= c_{\pi_{i+1}} \cdot \sum_{k = 1}^{i-1} t_{\pi_k'} + c_{\pi_i} \cdot \sum_{k = 1}^i t_{\pi_k'} - c_{\pi_i} \cdot \sum_{k = 1}^{i-1} t_{\pi_k} - c_{\pi_{i+1}} \cdot \sum_{k = 1}^i t_{\pi_k} \\
&= c_{\pi_i} \cdot t_{\pi_{i+1}} - c_{\pi_{i+1}} \cdot t_{\pi_i}
\end{align}$$

Agar $\pi$ jadval optimal bo‘lsa, undagi har qanday almashtirish jarimani oshiradi yoki o‘zgartirmaydi. Shuning uchun optimal jadval uchun quyidagi shartni yozish mumkin:

$$c_{\pi_{i}} \cdot t_{\pi_{i+1}} - c_{\pi_{i+1}} \cdot t_{\pi_i} \ge 0 \quad \forall i = 1 \dots n-1$$

Hadlarni qayta joylashtirsak:

$$\frac{c_{\pi_i}}{t_{\pi_i}} \ge \frac{c_{\pi_{i+1}}}{t_{\pi_{i+1}}} \quad \forall i = 1 \dots n-1$$

Shunday qilib, ishlarni $\frac{c_i}{t_i}$ nisbatining kamaymaslik emas, **kamayish tartibida saralash** orqali **optimal jadval**ni olamiz.

Bu algoritm **almashtirish usuli** deb ataladigan yondashuv orqali qurilganini ta’kidlash kerak: ikkita qo‘shni elementning o‘rni almashtirildi, jarima o‘zgarishi hisoblandi va undan optimal tartibni topish qoidasi chiqarildi.

### Eksponensial jarima funksiyasi

Jarima funksiyasi quyidagi ko‘rinishda bo‘lsin:

$$f_i(t) = c_i \cdot e^{\alpha \cdot t},$$

bu yerda barcha $c_i$ sonlar nomanfiy, $\alpha$ o‘zgarmas esa musbat.

Almashtirish usulini qo‘llab, ishlarni quyidagi qiymatning kamayish tartibida saralash kerakligini oson aniqlash mumkin:

$$v_i = \frac{1 - e^{\alpha \cdot t_i}}{c_i}$$

### Bir xil monoton jarima funksiyasi

Bu holatda barcha $f_i(t)$ funksiyalar bir xil va monoton o‘suvchi bo‘ladi.

Bunda optimal permutatsiya ishlarni bajarilish vaqti $t_i$ ning o‘sish tartibida joylashtirishdan iborat ekani ravshan.

## Livshits–Kladov teoremasi

Livshits–Kladov teoremasi almashtirish usuli faqat yuqorida sanalgan uch holatda qo‘llanishini belgilaydi:

- chiziqli holat: $f_i(t) = c_i(t) + d_i$, bu yerda $c_i$ lar nomanfiy o‘zgarmaslar;
- eksponensial holat: $f_i(t) = c_i \cdot e^{\alpha \cdot t} + d_i$, bu yerda $c_i$ va $\alpha$ musbat o‘zgarmaslar;
- bir xil funksiyalar holati: $f_i(t) = \phi(t)$, bu yerda $\phi$ monoton o‘suvchi funksiya.

Boshqa barcha holatlarda bu usulni qo‘llab bo‘lmaydi.

Teorema jarima funksiyalari yetarlicha silliq, ya’ni ularning uchinchi hosilalari mavjud degan faraz ostida isbotlanadi.

Har uch holatda almashtirish usuli optimal jadvalni oddiy saralash bilan topishga olib keladi, demak ishlash vaqti $O(n \log n)$ bo‘ladi.
