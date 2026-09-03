> Ushbu o‘zbekcha shart IZhO 2026 tashkilotchisi e’lon qilgan rasmiy inglizcha PDF asosida tayyorlandi.

$1$ dan $n$ gacha raqamlangan uchlardan iborat daraxt berilgan. Daraxt — $n-1$ ta qirrali, bog‘langan va siklsiz yo‘naltirilmagan graf.

Tanlangan ildizdan chuqurlik bo‘yicha qidiruv — DFS ishga tushiriladi. Global taymer dastlab $0$ ga teng. DFS $v$ uchiga kirganda:

1. taymer bittaga oshiriladi;
2. $tin_v$ kirish vaqti taymerning joriy qiymatiga tenglanadi;
3. $v$ ning hali ko‘rilmagan qo‘shnilari bo‘yicha DFS rekursiv chaqiriladi.

Muhim jihat: har bir uchning qo‘shnilari qirralar kirishda uchragan tartibda ko‘rib chiqiladi.

Agar $tin_v=v$ bo‘lsa, $v$ uchi **omadli** deb ataladi. Har bir $i$ ($1\le i\le n$) uchun DFS ildizi $i$ bo‘lgandagi omadli uchlar sonini toping.

## Kiruvchi ma’lumotlar

Birinchi qatorda $n$ ($1\le n\le10^5$) beriladi.

Keyingi $n-1$ qatorning har birida daraxt qirrasini ifodalovchi $u_i$ va $v_i$ beriladi ($1\le u_i,v_i\le n$, $u_i\ne v_i$).

## Chiquvchi ma’lumotlar

Bitta qatorda $n$ ta son chiqaring. $i$-son DFS $i$ uchidan boshlangandagi omadli uchlar soni bo‘lsin.

## Misollar

**Kirish**

```text
3
1 2
1 3
```

**Chiqish**

```text
3 1 0
```

**Kirish**

```text
10
6 2
4 9
3 8
2 3
8 10
5 10
5 9
6 7
1 4
```

**Chiqish**

```text
1 0 0 0 2 2 0 0 0 1
```
