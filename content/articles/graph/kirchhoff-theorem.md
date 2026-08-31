---
article_id: graph--kirchhoff-theorem
---
# Kirchhoff teoremasi: ostov daraxtlar sonini topish

Masala: sizga qo‘shnilik matritsasi yordamida ifodalangan bog‘langan yo‘naltirilmagan graf (unda parallel qirralar bo‘lishi mumkin) berilgan. Ushbu grafning turli ostov daraxtlari sonini toping.

Quyidagi formula Kirchhoff tomonidan 1847-yilda isbotlangan.

## Kirchhoffning matritsaviy daraxt teoremasi

$A$ grafning qo‘shnilik matritsasi bo‘lsin: $A_{u,v}$ — $u$ va $v$ orasidagi qirralar soni.

$D$ grafning darajalar matritsasi bo‘lsin: bu diagonal matritsa bo‘lib, $D_{u,u}$ qiymati $u$ tugunning darajasiga teng (parallel qirralar va ilmoqlar — $u$ tugunni o‘zi bilan bog‘laydigan qirralar — ham hisobga olinadi).

Grafning Laplas matritsasi $L = D - A$ sifatida aniqlanadi.

Kirchhoff teoremasiga ko‘ra, ushbu matritsaning barcha kofaktorlari o‘zaro teng va grafning ostov daraxtlari soniga teng.

Matritsaning $(i,j)$ kofaktori — $i$-satr va $j$-ustun olib tashlangandan keyin hosil bo‘lgan matritsa determinantining $(-1)^{i + j}$ ga ko‘paytmasidir.

Demak, masalan, $L$ matritsaning oxirgi satri va oxirgi ustunini olib tashlash mumkin; hosil bo‘lgan matritsa determinantining absolut qiymati ostov daraxtlar sonini beradi.

Matritsa determinantini [Gauss usuli](../linear_algebra/determinant-gauss.md) yordamida $O(N^3)$ vaqtda topish mumkin.

Bu teoremaning isboti ancha murakkab va bu yerda keltirilmaydi; isbotning umumiy ko‘rinishi hamda parallel qirralarsiz va yo‘naltirilgan graflar uchun teorema variantlari haqida [Wikipedia](https://en.wikipedia.org/wiki/Kirchhoff%27s_theorem)dan o‘qishingiz mumkin.

## Kirchhoffning elektr zanjiri qonunlari bilan bog‘lanish

Kirchhoffning matritsaviy daraxt teoremasi va elektr zanjirlari uchun Kirchhoff qonunlari o‘zaro chiroyli tarzda bog‘langan. Om qonuni va Kirchhoffning birinchi qonuni yordamida zanjirning $i$ va $j$ nuqtalari orasidagi $R_{ij}$ qarshilik quyidagiga tengligini ko‘rsatish mumkin:

$$R_{ij} = \frac{ \left| L^{(i,j)} \right| }{ | L^j | }.$$

Bu yerda $L$ matritsa teskari qarshiliklar $A$ matritsasidan ($A_{i,j}$ — $i$ va $j$ nuqtalar orasidagi o‘tkazgich qarshiligining teskarisi) Kirchhoffning matritsaviy daraxt teoremasida tavsiflangan usul orqali hosil qilinadi.

$T^j$ — $j$-satr va $j$-ustuni olib tashlangan matritsa, $T^{(i,j)}$ esa $i$ va $j$ ga mos ikkita satr hamda ikkita ustun olib tashlangan matritsadir.

Kirchhoff teoremasi ushbu formulaga geometrik ma’no beradi.

## Amaliy masalalar

- [CODECHEF: Roads in Stars](https://www.codechef.com/problems/STARROAD)
- [SPOJ: Maze](http://www.spoj.com/problems/KPMAZE/)
- [CODECHEF: Complement Spanning Trees](https://www.codechef.com/problems/CSTREE)

