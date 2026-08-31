---
article_id: algebra--balanced-ternary
---
# Muvozanatlangan uchlik sanoq tizimi

!["Muvozanatlangan uchlik tizimidan foydalanuvchi Setun kompyuteri"](https://earltcampbell.files.wordpress.com/2014/12/setun.jpeg?w=300)
Bu nostandart, ammo baribir pozitsion **sanoq tizimi**dir. Uning o‘ziga xosligi shundaki, raqamlar `-1`, `0` va `1` qiymatlaridan birini olishi mumkin.
Shunga qaramay, uning asosi hamon `3` (chunki uchta mumkin bo‘lgan qiymat bor). Raqam sifatida `-1` ni yozish noqulay bo‘lgani uchun,
keyingi o‘rinlarda bu maqsadda `Z` harfidan foydalanamiz. Agar bu sizga juda g‘alati tizimdek tuyulsa, rasmga qarang: unda shu tizimdan foydalanuvchi kompyuterlardan biri ko‘rsatilgan.

Muvozanatlangan uchlik tizimida yozilgan dastlabki bir nechta son quyidagicha:
```nohighlight
    0    0
    1    1
    2    1Z
    3    10
    4    11
    5    1ZZ
    6    1Z0
    7    1Z1
    8    10Z
    9    100
```

Bu tizim manfiy qiymatlarni oldiga minus belgisi qo‘ymasdan yozish imkonini beradi: istalgan musbat sondagi raqamlarni shunchaki teskarisiga almashtirish mumkin.

```nohighlight
    -1   Z
    -2   Z1
    -3   Z0
    -4   ZZ
    -5   Z11
```

Manfiy son `Z` bilan, musbat son esa `1` bilan boshlanishiga e’tibor bering.
## O‘girish algoritmi
Berilgan sonni avval odatiy uchlik sanoq tizimida vaqtincha ifodalash orqali **muvozanatlangan uchlik** tizimiga o‘tkazish oson. Son odatiy uchlik ko‘rinishda bo‘lganda, uning raqamlari `0`, `1` yoki `2` bo‘ladi. Eng kichik razryaddan boshlab yurib, barcha `0` va `1` larni o‘zgarishsiz qoldirishimiz mumkin,
ammo `2` ni `Z` ga aylantirib, keyingi raqamga `1` qo‘shish kerak. `3` raqamlari ham xuddi shu qoida bo‘yicha `0` ga aylantirilishi kerak —
bunday raqamlar dastlabki sonda bo‘lmaydi, ammo ayrim `2` lar oshirilgandan so‘ng paydo bo‘lishi mumkin.
**1-misol:** `64` ni muvozanatlangan uchlik tizimiga o‘tkazamiz. Avval sonni odatiy uchlik tizimida yozamiz:

$$ 64_{10} = 02101_{3} $$

Uni eng kichik razryadli (eng o‘ngdagi) raqamdan boshlab qayta ishlaymiz:

- `1`, `0` va `1` o‘zgarishsiz qoldiriladi. (Chunki muvozanatlangan uchlik tizimida `0` va `1` ga ruxsat etiladi.)
- `2` `Z` ga aylantiriladi va uning chapidagi raqam bittaga oshiriladi; natijada `1Z101` hosil bo‘ladi.

Yakuniy natija — `1Z101`.

Pozitsion og‘irliklarni qo‘shib, uni o‘nlik tizimga qaytaramiz:
$$ 1Z101 = 81 \cdot 1 + 27 \cdot (-1) + 9 \cdot 1 + 3 \cdot 0 + 1 \cdot 1 = 64_{10} $$

**2-misol:** `237` ni muvozanatlangan uchlik tizimiga o‘tkazamiz. Avval sonni odatiy uchlik tizimida yozamiz:

$$ 237_{10} = 22210_{3} $$

Uni eng kichik razryadli (eng o‘ngdagi) raqamdan boshlab qayta ishlaymiz:
- `0` va `1` o‘zgarishsiz qoldiriladi. (Chunki muvozanatlangan uchlik tizimida `0` va `1` ga ruxsat etiladi.)
- `2` `Z` ga aylantiriladi va uning chapidagi raqam bittaga oshiriladi; `23Z10` hosil bo‘ladi.
- `3` `0` ga aylantiriladi va uning chapidagi raqam bittaga oshiriladi; `30Z10` hosil bo‘ladi.
- `3` `0` ga aylantiriladi va uning chapidagi (sukut bo‘yicha `0` bo‘lgan) raqam bittaga oshiriladi; natijada `100Z10` hosil bo‘ladi.

Yakuniy natija — `100Z10`.

Pozitsion og‘irliklarni qo‘shib, uni o‘nlik tizimga qaytaramiz:
$$ 100Z10 = 243 \cdot 1 + 81 \cdot 0 + 27 \cdot 0 + 9 \cdot (-1) + 3 \cdot 1 + 1 \cdot 0 = 237_{10} $$
## Mashq masalalari

* [Topcoder SRM 604, Div1-250](http://community.topcoder.com/stat?c=problem_statement&pm=12917&rd=15837)
