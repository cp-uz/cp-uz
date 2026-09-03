> Ushbu o‘zbekcha shart IZhO 2026 tashkilotchisi e’lon qilgan rasmiy inglizcha PDF asosida tayyorlandi.

Musbat butun sonlardan iborat $a[1..n]$ massivi va `type` soni berilgan.

Maqsadli $S$ yig‘indi uchun quyidagi ochko‘z algoritm aniqlanadi:

1. massiv elementlarini **o‘smaydigan** tartibda saralang;
2. $r\gets S$ deb oling;
3. elementlarni shu tartibda ko‘ring. Joriy $x\le r$ bo‘lsa, uni tanlab $r\gets r-x$ qiling;
4. barcha elementlar ko‘rilgach $r=0$ bo‘lsa, algoritm muvaffaqiyatli.

Agar massiv elementlarining biror qism-to‘plami bilan hosil qilinadigan **har qanday** $S$ uchun yuqoridagi algoritm aynan $S$ ni tuza olsa, massiv **ochko‘z** deyiladi.

Massivga aynan bitta musbat $t$ sonini qo‘shish kerak. $a\cup\{t\}$ ochko‘z massiv bo‘lsa, $t$ **yaroqli** hisoblanadi.

- `type = 0` bo‘lsa, yaroqli $t$ lar soni chekli yoki cheksizligini aniqlang.
- `type = 1` bo‘lsa, barcha yaroqli $t$ larni chiqaring yoki ular cheksiz ko‘pligini bildiring.

## Kiruvchi ma’lumotlar

Birinchi qatorda $n$ va `type` beriladi ($1\le n\le10^5$, `type` $\in\{0,1\}$).

Ikkinchi qatorda $a_1,a_2,\ldots,a_n$ ($1\le a_i\le10^5$) beriladi.

## Chiquvchi ma’lumotlar

`type = 0` bo‘lsa, faqat `finite` yoki `infinite` chiqaring.

`type = 1` bo‘lsa:

- birinchi qatorda `finite` yoki `infinite`;
- javob chekli bo‘lsa, ikkinchi qatorda yaroqli qiymatlar soni $k$;
- uchinchi qatorda barcha yaroqli $t$ larni o‘sish tartibida chiqaring.

## Misollar

```text
Kirish:
3 1
1 2 4

Chiqish:
infinite
```

```text
Kirish:
5 1
1 1 4 4 5

Chiqish:
finite
3
1 2 3
```
