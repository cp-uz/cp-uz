Siz va do'stingiz bir xil $N$ ta qo'shiqdan iborat pleylistga egasiz; qo'shiqlar $1$ dan $N$ gacha raqamlangan. Pleylist — barcha qo'shiqlarning bir tartibi, ya'ni permutatsiya. Sizning pleylistingiz $p$, do'stingizniki $q$.

Pleylistning $K$-bo'lagi — undagi $K$ ta ketma-ket qo'shiqdan iborat blok. Sizning pleylistingizdan bitta $K$-bo'lak va do'stingiznikidan bitta $K$-bo'lak olinganda, ularning mosligi ikkala bo'lakda ham uchraydigan qo'shiqlar sonidir. Ikki pleylistning o'xshashligi — barcha tanlashlar bo'yicha eng katta moslik.

Keyingi $Q$ kunning har birida siz $p$ pleylistingizda qo'shni ikkita qo'shiqni almashtirasiz. Har bir almashtirish doimiy. Do'stingizning $q$ pleylisti o'zgarmaydi.

Boshlang'ich pleylistlar uchun va har bir almashtirishdan so'ng o'xshashlikni hamda shu o'xshashlikka erishuvchi $K$-bo'laklar juftliklari sonini aniqlang.

### Amalga oshirish tafsilotlari

```cpp

vector<pair<long long, long long>> similarity(int N, int K, vector<int> p, vector<int> q, vector<int> t);
```

- `N`: qo'shiqlar soni.

- `K`: bo'lak uzunligi.

- `p`: uzunligi $N$ bo'lgan massiv; uning $i$-elementi sizning pleylistingizdagi $i$-pozitsiyadagi qo'shiq.

- `q`: uzunligi $N$ bo'lgan massiv; uning $i$-elementi do'stingiz pleylistidagi $i$-pozitsiyadagi qo'shiq.

- `t`: uzunligi $Q$ bo'lgan massiv. Har bir $t_i$ uchun $1 \le t_i \le N-1$ va $i$-kuni $t_i$ hamda $t_i+1$ pozitsiyalar almashtiriladi.

- Protsedura $Q+1$ ta juftlik qaytaradi: $0$-element boshlang'ich holat, $i$-element dastlabki $i$ ta almashtirishdan keyingi holat.

### Cheklovlar

- $2 \le N \le 100000$

- $1 \le K \le N$

- $0 \le Q \le 100000$

- Har bir $i$ uchun $1 \le t_i \le N-1$.

### Subtasklar

| Subtask | Ball | Cheklovlar |
| --- | --- | --- |
| 1 | 7 | $Q=0$ va $N\le100$ |
| 2 | 10 | $Q=0$ va $N\le5000$ |
| 3 | 33 | $Q=0$ |
| 4 | 7 | $N\le100$ va $Q\le100$ |
| 5 | 10 | $N\le5000$ va $Q\le5000$ |
| 6 | 33 | qo'shimcha cheklovlarsiz |

### Baholash

Agar subtask ichida barcha o'xshashlik qiymatlari to'g'ri bo'lsa-yu, ayrim sonlar noto'g'ri bo'lsa, shu subtask ballining $50\%$ i beriladi. To'liq ball uchun har testda ikkala son ham to'g'ri bo'lishi kerak. Biror o'xshashlik xato bo'lsa, subtask uchun $0$ ball beriladi.

### 1-misol

```cpp

similarity(4, 3, [2, 4, 1, 3], [1, 2, 3, 4], [])
```

Bu yerda $Q=0$. To'rtta moslikning ham o'lchami $2$, demak o'xshashlik $2$ va barcha $4$ ta juftlik unga erishadi. Protsedura $[(2,4)]$ qaytaradi.

### 2-misol

```cpp

similarity(5, 3, [1, 4, 3, 2, 5], [4, 5, 1, 2, 3], [3, 1, 4])
```

Protsedura $[(2,5),(2,6),(3,1),(3,1)]$ qaytaradi — boshlang'ich holat va har bir almashtirishdan keyingi javoblar.

### Namunaviy grader

Namunaviy grader quyidagilarni o'qiydi: 1-qator `N K Q`; 2-qator $p$ pleylist; 3-qator $q$ pleylist; keyingi $Q$ qatorning har biri bitta $t_i$. U `similarity` ni bir marta chaqiradi va qaytarilgan juftliklarni alohida satrlarda chop etadi.

## Namunalar

### 1-namuna

**Kirish:**

```text
2 1 1
1 2
1 2
1
```

**Chiqish:**

```text
OK
1 2
1 2
```

### 2-namuna

**Kirish:**

```text
4 3 0
2 4 1 3
1 2 3 4
```

**Chiqish:**

```text
OK
2 4
```

### 3-namuna

**Kirish:**

```text
5 3 3
1 4 3 2 5
4 5 1 2 3
3
1
4
```

**Chiqish:**

```text
OK
2 5
2 6
3 1
3 1
```
