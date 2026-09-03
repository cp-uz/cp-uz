> Ushbu o‘zbekcha shart IZhO 2026 tashkilotchisi e’lon qilgan rasmiy inglizcha PDF asosida tayyorlandi.

Hakamlar idorasi $n\times m$ katakli to‘g‘ri to‘rtburchak jadvaldan iborat. Toshbaqa $t=1$ vaqtda $(1,1)$ katakda paydo bo‘ladi. Har bir keyingi vaqtda u aynan bitta katak pastga yoki o‘ngga yuradi va oxir-oqibat $(n,m)$ ga yetadi. Demak, jami $T=n+m-1$ ta vaqt holati mavjud.

Jadvalga $k$ ta tuzoq o‘rnatilgan. $i$-tuzoq:

- yuqori chap burchagi $(x_i,y_i)$;
- tomoni $s_i$ bo‘lgan kvadrat hududni qoplaydi;
- bir marta faollashtirish narxi $cost_i$.

Ya’ni u $x_i\le a\le x_i+s_i-1$ va $y_i\le b\le y_i+s_i-1$ shartlarini qanoatlantiruvchi barcha $(a,b)$ kataklarni qoplaydi.

Tuzoq faqat toshbaqa qoplangan katakda turgan **aynan o‘sha vaqtda** yoqilsa ishlaydi. Istalgan vaqtda bir nechta tuzoqni yoqish mumkin va har bir yoqish alohida narxlanadi.

Toshbaqaning yo‘li oldindan noma’lum. Qaysi vaqtda qaysi tuzoqlar yoqilishini oldindan shunday belgilangki, har qanday mumkin bo‘lgan yo‘lda toshbaqa albatta tutilsin. Minimal umumiy narxni toping; kafolatlab tutish imkonsiz bo‘lsa, `-1` chiqaring.

## Kiruvchi ma’lumotlar

Birinchi qatorda $n,m,k$ beriladi ($2\le n,m\le10^5$, $1\le k\le10^5$).

Keyingi $k$ qatorning har birida $x_i,y_i,s_i,cost_i$ beriladi. Har bir tuzoq hududi jadval ichida to‘liq joylashishi kafolatlanadi, $0\le cost_i\le10^9$.

## Chiquvchi ma’lumotlar

Har qanday yo‘lda toshbaqani tutishni kafolatlaydigan jadvalning minimal narxini yoki bunday jadval bo‘lmasa `-1` ni chiqaring.

## Misol

**Kirish**

```text
2 3 2
1 2 2 5
2 1 1 3
```

**Chiqish**

```text
5
```

Birinchi tuzoqni $t=3$ da faollashtirish barcha mumkin bo‘lgan yo‘llarni qoplaydi.
