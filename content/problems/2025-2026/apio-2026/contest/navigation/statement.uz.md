> Bu ikki alohida jarayonda bajariladigan kommunikatsion masala. To‘liq grader talablari va diagrammalar rasmiy PDFda mavjud.

Tayvandagi robotlashtirilgan yo‘l tarmog‘i $0$ dan $N-1$ gacha raqamlangan $N$ ta tugun va $N-1$ ta kabeldan iborat daraxt. Tugunlardan aynan $K=6$ tasi quvvat stansiyasi. Tarmoqning tarmoqlanish koeffitsiyenti kamida $B$: har bir tugunning darajasi $1$ yoki kamida $B$.

Har bir kabelga $0$ dan $99$ gacha tur berish mumkin. Robot qishloq tugunida turganda faqat $K$, $B$ va shu tugunga ulangan kabellar turlarini — noma’lum tartibdagi $C$ ro‘yxatini — ko‘radi. Har bir kabel uchun undan yurish nechta quvvat stansiyasigacha bo‘lgan masofani kamaytirishini topishi kerak.

Siz kabel turlarini belgilash strategiyasi va faqat mahalliy turlarni ko‘radigan navigatsiya dasturini yozasiz.

## Birinchi jarayon

```cpp
vector<int> construct_network(
    int N, int K, int B,
    vector<int> U,
    vector<int> V,
    vector<int> P
);
```

$U[i]$ va $V[i]$ — $i$-kabelning uchlari, $P$ esa $K=6$ ta quvvat stansiyasining raqamlari. Uzunligi $N-1$ bo‘lgan $T$ massivini qaytaring; $T[i]$ — kabel turi va $0\le T[i]<100$.

## Ikkinchi jarayon

```cpp
vector<int> navigate(int K, int B, vector<int> C);
```

$C$ — bir qishloq tuguniga ulangan kabellar turlari. Xuddi shu uzunlikdagi $D$ massivini qaytaring. $D[i]$ — $C[i]$ kabeli bo‘ylab yurganda masofa kamayadigan quvvat stansiyalari soni.

Ikki funksiya alohida jarayonlarda ishlaydi. `navigate` asl daraxtga, tugun raqamlariga yoki `construct_network` chaqiruvlari tartibiga tayanishi mumkin emas.

## Chegaralar

- $K=6$;
- $K<N\le100\,000$;
- barcha `construct_network` chaqiruvlaridagi $N$ lar yig‘indisi $100\,000$ dan oshmaydi;
- barcha `navigate` chaqiruvlaridagi $|C|$ lar yig‘indisi $200\,000$ dan oshmaydi;
- $C$ dagi kabellar tartibi ixtiyoriy;
- tarmoq daraxt va har bir ichki tugun darajasi kamida $B$.

## Baholash

Javoblar to‘g‘ri bo‘lishi shart. Qo‘shimcha ball ishlatilgan turlar diapazoniga bog‘liq. Barcha qaytarilgan $T$ qiymatlaridan katta eng kichik son $S$ bo‘lsin; $S$ qancha kichik bo‘lsa, ball shuncha yuqori. Masalan, ayrim qism-masalalarda to‘liq ball uchun $S\le4$ yoki $S\le5$ talab qilinadi.
