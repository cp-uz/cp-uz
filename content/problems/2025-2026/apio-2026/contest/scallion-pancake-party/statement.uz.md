> Bu bir nechta mustaqil jarayon o‘rtasida ma’lumot kodlashga asoslangan kommunikatsion masala. To‘liq grader interfeysi rasmiy PDFda mavjud.

Bohan bazm uchun $N$ xil ko‘k piyozli quymoq ta’mini tayyorlaydi. Jami $N^2$ ta quymoq $0$ dan $N^2-1$ gacha raqamlangan paketlarga joylangan; har bir ta’m aynan $N$ marta uchraydi. Har bir quymoq dastlab $K$ ta teng bo‘lakdan iborat. $F[b]$ — $b$-paketdagi ta’m.

$N$ ta mehmon $0,1,\ldots,N-1$ xonalarga bittadan joylashtiriladi. $i$-xonadagi mehmonga taqiqlangan $P[i]$ ta’mi aytiladi; $P$ — $0,1,\ldots,N-1$ ning permutatsiyasi. Ba’zi testlarda mehmonga xona raqami ham aytiladi, boshqalarida esa aytilmaydi.

Xonalar ketma-ket ishlaydi. Har bir xonaga barcha paketlar $0$ dan $N^2-1$ gacha tartib bilan olib kiriladi. Mehmon paketning ta’mi va qolgan bo‘laklar sonini ko‘radi:

- ta’m uning $P[i]$ qiymatiga teng bo‘lsa, hech narsa yeya olmaydi;
- aks holda, $0$ dan paketda qolgan bo‘laklar sonigacha yeyishi mumkin.

Barcha xonalar tugagach tashqaridagi mehmonlar paketlarning $F$ ta’mlari va qolgan $S$ bo‘laklarini ko‘rib, butun $P$ permutatsiyasini tiklashi kerak. Mehmonlar o‘yin boshlanishidan oldin umumiy strategiyani kelishib olishi mumkin, ammo jarayonlar orasida xotira almashilmaydi.

## Amalga oshirish

Xonadagi mehmon uchun:

```cpp
void init(int N, int K, int p, int r);
int strategy(int b, int f, int s);
```

- `p` — shu xonaning taqiqlangan ta’mi;
- xona raqami oshkor qilinsa `r` shu raqam, aks holda `-1`;
- `strategy` $b$-paketdan yeyiladigan bo‘laklar sonini qaytaradi;
- `f == p` bo‘lsa javob majburiy ravishda $0$, aks holda $0\le x\le s$.

Tashqaridagi mehmonlar uchun:

```cpp
vector<int> guess(
    int N, int K,
    vector<int> F,
    vector<int> S
);
```

Funksiya to‘g‘ri $P$ permutatsiyasini qaytarishi kerak.

## Chegaralar

- $1\le T\le400$ ta mustaqil o‘yin;
- $2\le N\le30$;
- barcha o‘yinlardagi $N$ lar yig‘indisi $27\,000$ dan oshmaydi;
- $1\le K\le N$ va $K\in\{1,3,N\}$;
- $P$ — permutatsiya;
- har bir ta’m $F$ da aynan $N$ marta uchraydi;
- grader adaptiv emas: $P$ va $F$ o‘yin boshlanishidan oldin belgilanadi.

Yechim barcha o‘yinlarda $P$ ni aniq tiklashi kerak.
