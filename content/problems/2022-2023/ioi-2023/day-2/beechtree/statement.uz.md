> IOI 2023 rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). PDF - asosiy manba: diagrammalar, indekslar va murakkab formulalarni rasmiy PDFdan tekshiring.

Vétyem o'rmonlari - ko'plab rangli daraxtlarga ega mashhur o'rmon. Bu o'rmonning eng qadimgi va eng baland olxa daraxtlaridan biri Ős Vezér (Qadimgi rahbar) deb ataladi.

Ős Vezér daraxtini $N$ ta **tugun** va $N - 1$ ta **qirra** larning to'plami sifatida ifodalash mumkin. Tugunlar 0 dan $N - 1$ gacha raqamlangan, qirralar esa 1 dan $N - 1$ gacha raqamlangan. Har bir qirra daraxtning ikkita har xil tugunlarini bog'laydi. Xususan, $i $ ($1 \le i < N $ ) - qirra daraxtning $ i $ hamda $ P[i]$ ($0 \le P[i] < i $ ) - tugunlarini bog'laydi. $ P[i]$ tuguni $ i$ - tugunning **otasi** deb ataladi, hamda $ i$ -tugun $ P[i]$ - tugunning **bolasi** deb ataladi.

Har bir qirraning o'z rangi mavjud. Ranglar 1 dan $M$ gacha raqamlangan bo'lib qirralar shu $M$ xil ranglardan biriga bo'yalgan bo'ladi. i - qirraning rangi C[i] ga teng. Har xil qirralar bir xil rangda bo'yalgan bo'lishi mumkin.

Yuqoridagi ta'riflardan ma'lumki daraxtning $i = 0$ qiymatli qirrasi mavjud bo'lmaydi. Shu sababdan qulaylik yaratish maqsadida biz $P[0] = -1$ va $C[0] = 0$ qilib beramiz.

Misol uchun, Ős Vezér daraxtida tugunlar soni $N = 18$, mumkin bo'lgan ranglar soni $ M = 3$, mavjud bo'lgan 17 ta qirra $ P = [-1, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 10, 11, 11]$ hamda ranglar $ C$ = [0,1,2,3,1,2,3,1,3,3,2,1,1,2,2,1,2,3] ko'rinishida ifodalangan bo’lsa daraxt quyidagi rasmda ko'rsatilgandek ko'rinishga ega bo'ladi:

Árpád - tajribali o'rmonchi bo'lib, u daraxtning **qism daraxt** deb nomlanadigan qismlarini o'rganishni yaxshi ko'radi. Har bir $r$ ($0 \le r < N $ ) tugun uchun shu tugunning qism daraxti ( $ T $ ( $ r $ ) deb belgilanadi) mavjud bo'lib bu qism daraxt bir nechta tugunlardan iborat bo'ladi. $ s $ raqamli tugun $ T $ ( $ r$ ) ning a'zosi bo'la oladi, qachonki:

- $s = r$.

- $x$ tugun $T(r)$ ga tegishli bo'lsa, $x$ ning barcha bolalari ham $T(r)$ ga tegishlidir.

$T $ ( $ r $ ) qism daraxt a'zolari soni ∣ $ T $ ( $ r$ )∣ etib belgilanadi.

Árpád yaqinda murakkab, ammo qiziqarli qism daraxt xususiyatini topdi. Arpadning kashfiyoti qalam va qog'oz bilan juda ko'p o'ynashni o'z ichiga olgan va u buni tushunish uchun siz ham xuddi shunday qilishingiz kerak bo'lishi mumkin deb o'ylaydi. Shuningdek, u sizga bir nechta misollarni ko'rsatadi, keyin siz batafsil tahlil qilishingiz mumkin.

Faraz qilaylik, bizda o'zgarmas $r$ va $T$ ( $ r $ ) qism daraxtiga tegishli bo'lgan tugunlarning $v_0,v_1,\ldots,v_{|T(r)|-1}$ permutatsiyasi mavjud bo'lsin.

Har bir $i$ ($1 \le i < |T(r)|$) uchun, $f(i)$ ning qiymati $i-1$ ta $C[v_1],C[v_2],\ldots,C[v_{i-1}]$ ranglar ketma-ketligidagi $C[v_i]$ takrorlanishlar soni bo'lsin.

(E'tibor bering, $f$ (1) har doim 0 bo'ladi, chunki uning ta'rifidagi ranglar ketma-ketligi bo'sh.)

$[v_0,v_1,\ldots,v_{|T(r)|-1}]$ permutatsiyasi quyidagi shartlarni qanoatlantirsa **chiroyli permutatsiya** deyiladi:

- $v_0=r$.

- Har bir $i$ ($1 \le i < |T(r)|$) uchun, $v_i$ tugunning otasi $v_{f(i)}$ ga teng.

$0 \le r < N $ boʻlgan har qanday $r $ uchun agar $T $ ( $ r $ ) tugunlarining chiroyli permutatsiyasi mavjud bo'lsa $ T $ ( $ r$ ) qism daraxti **chiroyli qism daraxt** boʻladi. E'tibor bering, ta'rifga ko'ra, bitta tugundan iborat har bir qism daraxt chiroyli.

Yuqorida ko'rsatilgan daraxt misolida ko'rib chiqsak. $T $ (0) va $ T $ (3) qism daraxtlar chiroyli emasligini ko'rsatish mumkin. $ T $ (14) qism daraxt chiroyli, chunki u bittagina tugundan tashkil topgan. $ T$ (1) qism daraxt ham chiroyli, va biz uni quyida ko'rsatib o'tamiz.

Qism daraxtni tashkil etadigan tugunlarning [ $v_0$, $v_1$, $v_2$, $v_3$, $v_4$, $v_5$, $v_6$] = [1,4,5,12,13,6,14] permutatsiyasini ko'raylik. Ushbu ketma-ketlikdagi har bir tugunning indeksi tugunga biriktirilgan yorliqdagi raqam bilan ko'rsatilgan.

Endi biz buni **chiroyli permutatsiya** ekanligini isbotlaymiz.

$v_0=r=1$.

- $f $ (1) = 0 chunki $C[v_1] = C[4] = 1$ va bu qiymat [] ketma-ketligi tarkibida 0 marotaba ishtirok etadi, demak $P[v_1] = v_{f(1)} = v_0$ ya'ni $ P[4] = 1$. $ f $ (2) = 0 chunki $C[v_2] = C[5] = 2$ va bu qiymat [1] ketma-ketligi tarkibida 0 marotaba ishtirok etadi, demak $P[v_2] = v_{f(2)} = v_0$ ya'ni $ P[5] = 1$. $ f $ (3) = 1 chunki $C[v_3] = C[12] = 1$ va bu qiymat [1,2] ketma-ketligi tarkibida 1 marotaba ishtirok etadi, demak $P[v_3] = v_{f(3)} = v_1$ ya'ni $ P[12] = 4$.

- $f $ (4) = 1 chunki $C[v_4] = C[13] = 2$ va bu qiymat [1,2,1] ketma-ketligi tarkibida 1 marotaba ishtirok etadi, demak $P[v_4] = v_{f(4)} = v_1$ ya'ni $ P[13] = 4$.

- $f $ (5) = 0 chunki $C[v_5] = C[6] = 3$ va bu qiymat [1,2,1,2] ketma-ketligi tarkibida 0 marotaba ishtirok etadi, demak $P[v_5] = v_{f(5)} = v_0$ ya'ni $ P[6] = 1$.

- $f $ (6) = 2 chunki $C[v_6] = C[14] = 2$ va bu qiymat [1,2,1,2,3] ketma-ketligi tarkibida 2 marotaba ishtirok etadi, demak $P[v_6] = v_{f(6)} = v_2$ ya'ni $ P[14] = 5$.

Biz $T$ (1) da tugunlarning _chiroyli permutatsiya_ topa olganimiz uchun $ T$ (1) qism daraxti _chiroyli qism daraxt_ .

Sizning vazifangiz Árpádga Ős Vezérning har bir qism daraxti uchun uning chiroyli yoki chiroyli emasligini aniqlashga yordam berishdir.

## Implementatsiya tafsilotlari

Siz quyidagi funksiyani implement qilishingiz kerak.

```
int[] beechtree(int N, int M, int[] P, int[] C)
```

$N$ : daraxtdagi tugunlar soni.

- $M$ : qirralarning mumkin bo'lgan ranglar soni.

- $P $ , $ C $ : daraxtning qirralarini tavsiflovchi $ N$ uzunlikdagi massivlar.

- Ushbu protsedura $N$ uzunlikdagi $b$ massivni qaytarishi kerak. Har bir $r$ uchun $0 \le r < N$ , agar $ T$ ( $ r $ ) chiroyli boʻlsa, $ b[r] = 1$, aks holda $ b[r] = 0$ boʻlishi kerak.

- Ushbu protsedura har bir test uchun bir marta chaqiriladi.

## Misollar

### 1-misol
Consider the following call:

```
beechtree(4, 2, [-1, 0, 0, 0], [0, 1, 1, 2])
```

The tree is displayed in the following figure:

$T $ (1), $ T $ (2), and $ T $ (3) each consist of a single node and are therefore beautiful. $ T$ (0) is not beautiful. Therefore, the procedure should return [0,1,1,1].

### 2-misol
Consider the following call:

```
beechtree(18, 3, [-1, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 10, 11, 11], [0, 1, 2, 3, 1, 2, 3, 1, 3, 3, 2, 1, 1, 2, 2, 1, 2, 3])
```

This example is illustrated in the task description above.

The procedure should return [0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1].

### 3-misol
Quyidagi murojaatni ko'rib chiqing:

```
beechtree(7, 2, [-1, 0, 1, 1, 0, 4, 5], [0, 1, 1, 2, 2, 1, 1])
```

Ushbu misol quyidagi rasmda ko'rsatilgan.

$T$ (0) chiroyli bo'lmagan yagona qism daraxtdir. Funksiya [0,1,1,1,1,1,1] ni qaytarishi kerak.

## Cheklovlar

- $3 \le N \le 200\,000$

- $2 \le M \le 200\,000$

- har bir $i$ ($1 \le i < N $ ) uchun $0 \le P[i] < i$

- har bir $i$ ($1 \le i < N $ ) uchun $1 \le C[i] \le M$

- $P[0] = -1$ va $C[0] = 0$

## Subtask lar

1. (9 points) $N \le 8$ va $M \le 500$

2. (5 points) $i $ - qirra $ i $ tugunini $ i - 1$ tuguniga ulaydi. Ya'ni, har bir $ i$ ($1 \le i < N $ ) uchun $ P[i] = i - 1$ bo'ladi.

3. (9 points) 0 tugunidan boshqa har bir tugun 0 tuguniga ulanadi yoki 0 tuguniga ulangan tugunga ulanadi. Ya'ni, har bir $i$ ($1 \le i < N $ ) uchun $ P[i] = 0$ yoki $ P[P[i]] = 0$.

4. (8 points) $1 \le c \le M $ bo'lgan har bir $c $ uchun $c$ rangli ko'pi bilan ikkita qirra mavjud.

5. (14 points) $N \le 200$ va $M \le 500$

6. (14 points) $N \le 2\,000$ va $ M = 2$

7. (12 points) $N \le 2\,000$

8. (17 points) $M = 2$

9. (12 points) qo'shimcha cheklovlarsiz

## Namuna Graderi

Namunaviy greyder kiritilgan ma'lumotlarni quyidagi formatda o'qiydi:

- 1 qatori: _N M_

- 2 qatori: $P[0]$ $ P[1]$ … $P[ N - 1]$

- 3 qatori: $C[0]$ $ C[1]$ … $C[ N - 1]$

$b[0]$, $ b[1]$, … beechtree tomonidan qaytarilgan massiv elementlarini bildiradi. Namuna graderi javobingizni quyidagi formatda bitta qatorda chop etadi:

- 1 qatori: $b[0]$ $ b[1]$ …
