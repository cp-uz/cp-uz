---
article_id: combinatorics--counting_labeled_graphs
---
# Belgilangan graflarni sanash

## Belgilangan graflar

Grafdagi tugunlar soni $n$ bo‘lsin.

$n$ ta tugunga ega belgilangan graflar soni $G_n$ ni hisoblash kerak. **Belgilangan** degani tugunlar $1$ dan $n$ gacha bo‘lgan sonlar bilan belgilanganini anglatadi. Graf qirralari yo‘naltirilmagan, sirtmoqlar va karrali qirralar taqiqlangan deb qaraymiz.

Grafning barcha mumkin bo‘lgan qirralari to‘plamini ko‘rib chiqamiz. Har bir $(i,j)$ qirra uchun $i<j$ deb olishimiz mumkin, chunki graf yo‘naltirilmagan va sirtmoqlar yo‘q. Shuning uchun barcha mumkin bo‘lgan qirralar soni

$$\binom{n}{2}=\frac{n(n-1)}{2}$$

ga teng.

Har bir belgilangan graf o‘z qirralari bilan yagona aniqlanadi. Har bir mumkin bo‘lgan qirrani grafga kiritish yoki kiritmaslik mumkin. Demak, $n$ ta tugunga ega belgilangan graflar soni:

$$G_n = 2^{\frac{n(n-1)}{2}}$$

## Bog‘langan belgilangan graflar

Endi graf bog‘langan bo‘lishi kerak degan qo‘shimcha cheklov qo‘yamiz.

$n$ ta tugunga ega bog‘langan graflarning kerakli sonini $C_n$ bilan belgilaymiz.

Avval nechta **bog‘lanmagan** graf mavjudligini aniqlaymiz. Shunda bog‘langan graflar soni $G_n$ dan bog‘lanmagan graflar sonini ayirish orqali topiladi. Hisobni qulaylashtirish uchun **bog‘lanmagan ildizli graflar** sonini sanaymiz. Ildizli graf — tugunlaridan biri ildiz sifatida alohida ajratib ko‘rsatilgan graf.

$n$ ta belgilangan tugunga ega grafning ildizini tanlashning aynan $n$ ta usuli bor. Shu sababli oxirida bog‘lanmagan ildizli graflar sonini $n$ ga bo‘lib, oddiy bog‘lanmagan graflar sonini olamiz.

Ildiz tugun o‘lchami $1,\ldots,n-1$ bo‘lgan biror bog‘langan komponentda joylashadi.

Ildiz tugun $k$ ta tugunli bog‘langan komponentga tegishli bo‘lgan

$$k\binom{n}{k}C_kG_{n-k}$$

ta graf mavjud. Haqiqatan ham, komponentning $k$ ta tugunini tanlashning $\binom{n}{k}$ ta usuli bor; ularni $C_k$ xil usulda bog‘lash mumkin; komponentdagi $k$ ta tugunning istalgani ildiz bo‘lishi mumkin; qolgan $n-k$ ta tugun esa $G_{n-k}$ xil ixtiyoriy graf hosil qiladi.

Shunday qilib, $n$ ta tugunga ega bog‘lanmagan graflar soni:

$$\frac{1}{n} \sum_{k=1}^{n-1} k \binom{n}{k} C_k G_{n-k}$$

Nihoyat, bog‘langan graflar soni:

$$C_n = G_n - \frac{1}{n} \sum_{k=1}^{n-1} k \binom{n}{k} C_k G_{n-k}$$

## $k$ ta bog‘langan komponentli belgilangan graflar {data-toc-label="k ta bog‘langan komponentli belgilangan graflar"}

Oldingi bo‘limdagi formulaga asoslanib, $n$ ta tugun va $k$ ta bog‘langan komponentga ega belgilangan graflar sonini sanashni o‘rganamiz.

Bu sonni dinamik dasturlash yordamida hisoblash mumkin. Har bir $i\le n$ va $j\le k$ uchun

$$D[i][j]$$

qiymatini — $i$ ta tugun va $j$ ta komponentga ega belgilangan graflar sonini — hisoblaymiz.

Oldingi qiymatlar ma’lum bo‘lganda navbatdagi $D[n][k]$ elementni qanday hisoblashni ko‘rib chiqamiz. Odatdagi usulni qo‘llab, oxirgi, ya’ni $n$-raqamli tugunni olamiz. Bu tugun biror komponentga tegishli.

Ushbu komponentning o‘lchami $s$ bo‘lsin. Komponentdagi qolgan $s-1$ ta tugunni tanlashning $\binom{n-1}{s-1}$ ta usuli, ularni bog‘langan grafga aylantirishning esa $C_s$ ta usuli bor. Bu komponentni grafdan olib tashlaganimizdan keyin $n-s$ ta tugun va $k-1$ ta bog‘langan komponent qoladi.

Shuning uchun quyidagi rekurrent munosabatni olamiz:

$$D[n][k] = \sum_{s=1}^{n} \binom{n-1}{s-1} C_s D[n-s][k-1]$$

