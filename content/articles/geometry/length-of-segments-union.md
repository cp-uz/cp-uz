---
article_id: geometry--length-of-segments-union
---
# Kesmalar birlashmasining uzunligi

Sonlar o‘qida $n$ ta $[l_i,r_i]$ kesma berilgan. Ularning birlashmasi uzunligini, ya’ni kamida bitta kesmaga tegishli nuqtalar to‘plamining umumiy uzunligini topish talab qilinadi.

## Sweep-line g‘oyasi

Har bir kesma ikki hodisa yaratadi:

- $l_i$ nuqtada kesma boshlanadi;
- $r_i$ nuqtada kesma tugaydi.

Barcha $2n$ hodisani koordinata bo‘yicha saralaymiz va chapdan o‘ngga yuramiz. Hozirgi koordinata oldidagi ochiq kesmalar sonini $c$ bilan saqlaymiz. Agar oldingi hodisadan joriy hodisagacha bo‘lgan oraliqda $c>0$ bo‘lsa, shu uzunlik birlashmaga kiradi.

Bir xil koordinatadagi hodisalarni qayta ishlash tartibi javobga ta’sir qilmaydi, chunki bitta nuqtaning uzunligi nol. Biroq kodda juftliklarni saralashdan foydalanilganda qaysi belgi “boshlanish” va qaysi belgi “tugash” ekanini izchil tanlash kerak.

## Implementatsiya

Quyidagi kod har bir hodisani `(coordinate, is_right)` jufti sifatida saqlaydi. `is_right == false` chap uch, `true` o‘ng uchdir. Juftliklarning standart saralashida bir koordinatada chap uch oldin keladi.

```cpp
int length_union(const vector<pair<int, int>>& a) {
    int n = a.size();
    vector<pair<int, bool>> x(n * 2);
    for (int i = 0; i < n; i++) {
        x[i * 2] = {a[i].first, false};
        x[i * 2 + 1] = {a[i].second, true};
    }

    sort(x.begin(), x.end());

    int result = 0;
    int c = 0;
    for (int i = 0; i < n * 2; i++) {
        if (i > 0 && x[i].first > x[i - 1].first && c > 0)
            result += x[i].first - x[i - 1].first;
        if (x[i].second)
            c--;
        else
            c++;
    }
    return result;
}
```

Koordinatalar yoki jami uzunlik `int` dan katta bo‘lishi mumkin bo‘lsa, hodisa koordinatasi va `result` uchun `long long` ishlatiladi.

## To‘g‘rilik

Saralangan ketma-ket ikki turli hodisa koordinatasi $x_{i-1}<x_i$ orasida hech qanday kesma boshlanmaydi yoki tugamaydi. Demak, shu ochiq intervaldagi har bir nuqtani qoplaydigan kesmalar soni o‘zgarmas va aynan `c` ga teng. `c>0` bo‘lsa, butun $[x_{i-1},x_i]$ oralig‘i birlashmaga kiradi va uning uzunligi javobga bir marta qo‘shiladi. `c=0` bo‘lsa, u hech bir kesmaga kirmaydi. Barcha elementar oraliqlar ko‘rilgani uchun yig‘indi birlashma uzunligiga teng.

## Alternativ: kesmalarni birlashtirish

Kesmalarni chap uch bo‘yicha saralab, joriy birlashtirilgan $[L,R]$ kesmani saqlash ham mumkin. Yangi kesma $l>R$ dan boshlansa, oldingi uzunlikni qo‘shib yangi komponent ochiladi; aks holda $R=\max(R,r)$ bilan kengaytiriladi.

```cpp
long long length_union_merge(vector<pair<long long, long long>> segs) {
    if (segs.empty()) return 0;
    for (auto& [l, r] : segs)
        if (l > r) swap(l, r);
    sort(segs.begin(), segs.end());

    long long ans = 0;
    long long L = segs[0].first;
    long long R = segs[0].second;
    for (int i = 1; i < (int)segs.size(); ++i) {
        auto [l, r] = segs[i];
        if (l > R) {
            ans += R - L;
            L = l;
            R = r;
        } else {
            R = max(R, r);
        }
    }
    ans += R - L;
    return ans;
}
```

Ikkala yondashuvning murakkabligi saralash sababli $O(n\log n)$ vaqt va $O(n)$ xotiradir. Hodisalar usuli qoplama soni, aynan $k$ marta qoplangan uzunlik yoki dinamik qo‘shimcha ma’lumot hisoblash kabi sweep-line masalalariga oson umumlashadi.

