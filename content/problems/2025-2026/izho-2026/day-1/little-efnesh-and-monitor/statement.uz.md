> Ushbu o‘zbekcha shart IZhO 2026 tashkilotchisi e’lon qilgan rasmiy inglizcha PDF asosida tayyorlandi. Baholash tafsilotlari va asl nusxa yuqoridagi rasmiy havolada mavjud.

Kichik Efnesh ekranda bitta butun son — $x$ ni ko‘rsatadigan monitor topdi. Monitor yonida $n$ ta tugma bor. Har bir tugma joriy $x$ qiymatiga quyidagi amallardan birini qo‘llaydi:

- `and v`: $x \gets x\mathbin{\&}v$;
- `or v`: $x \gets x\mathbin{|}v$.

Bu yerda $\&$ va $|$ mos ravishda bitli `AND` va bitli `OR` amallaridir.

Har bir so‘rovda monitorning boshlang‘ich qiymati $x$ va kerakli yakuniy qiymati $y$ beriladi. Tugmalarni istalgan tartibda bosish, shuningdek, bir tugmani bir necha marta bosish mumkin.

Har bir so‘rov uchun $x$ dan $y$ ni hosil qilish mumkinligini aniqlang. Mumkin bo‘lsa, tugmalarni **eng kam marta** bosadigan ketma-ketlikni chiqaring.

## Kiruvchi ma’lumotlar

Birinchi qatorda $n$ va $q$ beriladi ($1\le n\le 2\cdot10^5$, $1\le q\le10^4$) — tugmalar va so‘rovlar soni.

Keyingi $n$ qatorning har birida `and` yoki `or` satri hamda $v_i$ soni beriladi ($0\le v_i\le10^5$).

Keyingi $q$ qatorning har birida bitta so‘rov — $x$ va $y$ beriladi ($0\le x,y\le10^5$).

## Chiquvchi ma’lumotlar

Har bir so‘rov uchun:

- o‘tkazish imkonsiz bo‘lsa, `-1` chiqaring;
- aks holda, birinchi qatorda minimal bosishlar soni $k$ ni, undan keyingi $k$ qatorda esa bajariladigan `and v` yoki `or v` amalini tartib bilan chiqaring.

## Misol

**Kirish**

```text
3 2
and 3
or 6
and 7
5 3
8 5
```

**Chiqish**

```text
3
and 3
or 6
and 3
-1
```
