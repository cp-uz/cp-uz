> Ushbu o‘zbekcha shart APIO 2026 rasmiy task repozitoriysidagi inglizcha PDF asosida tayyorlandi. Diagrammalar, qism-masalalar va grader paketi rasmiy havolada mavjud.

APIO shahrida $0$ dan $N-1$ gacha raqamlangan velosiped stansiyalari bor. Har oqshom $i$-stansiyada $A[i]$ ta velosiped bo‘ladi, ertalab esa aynan $B[i]$ ta bo‘lishi kerak.

Stansiyalar $N-1$ ta birlik uzunlikdagi yo‘l bilan daraxt shaklida ulangan. Muvozanatlovchi yuk mashinasi istalgan stansiyadan boshlashi va istalgan stansiyada tugatishi mumkin. Mashina boshida bo‘sh. Stansiyaga kelganda u istalgancha velosiped yuklaydi yoki tushiradi; mashina va stansiyalar sig‘imi cheklanmagan, ammo hech qayerdagi velosipedlar soni manfiy bo‘la olmaydi.

Barcha stansiyalarni $B$ holatiga olib keladigan yo‘lning minimal masofasini va shu masofaga ega strategiyani qaytaring.

## Amalga oshirish

```cpp
pair<vector<int>, vector<long long>>
find_rebalancing_strategy(
    int N,
    vector<int> A,
    vector<int> B,
    vector<int> U,
    vector<int> V
);
```

Funksiya uzunligi teng bo‘lgan $(X,Y)$ massivlarini qaytaradi. $X[0],X[1],\ldots,X[k]$ — mashina kirgan stansiyalar ketma-ketligi; ketma-ket ikki stansiya yo‘l bilan bevosita ulangan bo‘lishi kerak. $Y[j]\ge0$ bo‘lsa, $X[j]$ ga $Y[j]$ ta velosiped tushiriladi; $Y[j]<0$ bo‘lsa, $-Y[j]$ ta velosiped yuklanadi.

Har bir prefiksda:

- mashinadagi velosipedlar soni manfiy bo‘lmasligi;
- har bir stansiyadagi velosipedlar soni manfiy bo‘lmasligi;

va yakunda har bir $i$ uchun stansiyadagi son $B[i]$ ga teng bo‘lishi shart. Yo‘l masofasi $k$ bo‘ladi va u mumkin bo‘lgan eng kichik qiymatga teng bo‘lishi kerak.

## Chegaralar

- $2\le N\le300\,000$;
- barcha chaqiruvlardagi $N$ lar yig‘indisi $300\,000$ dan oshmaydi;
- $0\le A[i],B[i]\le10$;
- $\sum A[i]=\sum B[i]$;
- kamida bitta $i$ uchun $A[i]\ne B[i]$;
- $U$ va $V$ uzunligi $N-1$, ular bog‘langan daraxtni ifodalaydi.

## Namuna

```text
N = 4
A = [10, 1, 5, 0]
B = [10, 0, 3, 3]
U = [0, 1, 1]
V = [1, 2, 3]
```

Optimal javoblardan biri:

```text
X = [2, 1, 3]
Y = [-2, -1, 3]
```

Mashina $2$-stansiyadan ikki velosiped, $1$-stansiyadan bitta velosiped oladi va uchalasini $3$-stansiyaga olib boradi. Umumiy masofa $2$.
