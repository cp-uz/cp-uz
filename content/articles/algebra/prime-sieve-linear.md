---
article_id: algebra--prime-sieve-linear
---
# Chiziqli elak

$n$ soni berilgan. $[2;n]$ kesmadagi barcha tub sonlarni topish kerak.

Bu masalani yechishning standart usuli — [Eratosfen elagidan](sieve-of-eratosthenes.md) foydalanish. Bu algoritm juda sodda, ammo uning ishlash vaqti $O(n \log \log n)$.

Subchiziqli vaqt murakkabligiga ega (ya’ni $o(n)$) ko‘plab algoritmlar ma’lum bo‘lsa-da, quyida tasvirlangan algoritm soddaligi bilan qiziqarli: u klassik Eratosfen elagidan murakkab emas.
Bundan tashqari, bu algoritm qo‘shimcha natija sifatida $[2; n]$ kesmadagi **barcha sonlarning tub ko‘paytuvchilarga ajratilishini** hisoblaydi; bu ko‘plab amaliy masalalarda foydali bo‘lishi mumkin.

Berilgan algoritmning kamchiligi — klassik Eratosfen elagiga qaraganda ko‘proq xotira ishlatishi: unga $n$ ta sondan iborat massiv kerak, klassik Eratosfen elagi uchun esa $n$ bit xotira yetarli (bu 32 baravar kam).
Shuning uchun ushbu algoritmdan faqat taxminan $10^7$ tartibidagi va undan katta bo‘lmagan sonlar uchun foydalanish maqsadga muvofiq.

Algoritm Paul Pritchardga tegishli. U Pritchardning 1987-yildagi ishida keltirilgan 3.3-algoritmning bir ko‘rinishidir (manbalar maqola oxirida berilgan).

## Algoritm

Maqsadimiz $[2; n]$ kesmadagi har bir $i$ son uchun uning **eng kichik tub bo‘luvchisi** $lp [i]$ ni hisoblash.

Bundan tashqari, topilgan barcha tub sonlar ro‘yxatini ham saqlashimiz kerak — uni $pr []$ deb ataymiz.

Avval $lp [i]$ qiymatlarini nol bilan to‘ldiramiz; bu barcha sonlarni tub deb taxmin qilayotganimizni bildiradi. Algoritm davomida bu massiv asta-sekin to‘ldiriladi.

Endi sonlarni 2 dan $n$ gacha ko‘rib chiqamiz. Joriy $i$ soni uchun ikki holat mavjud:

- $lp[i] = 0$ — bu $i$ tub ekanini, ya’ni uning hech qanday kichikroq bo‘luvchisini topmaganimizni anglatadi.
  Shuning uchun $lp [i] = i$ deb belgilaymiz va $i$ ni $pr[]$ ro‘yxatining oxiriga qo‘shamiz.

- $lp[i] \neq 0$ — bu $i$ murakkab ekanini va uning eng kichik tub bo‘luvchisi $lp [i]$ ekanini anglatadi.

Ikkala holatda ham $i$ ga bo‘linadigan sonlar uchun $lp []$ qiymatlarini yangilaymiz. Biroq maqsadimiz har bir son uchun $lp []$ qiymatini ko‘pi bilan bir marta o‘rnatishdir. Buni quyidagicha bajarish mumkin:
$x_j = i \cdot p_j$ sonlarini qaraylik, bunda $p_j$ — $lp [i]$ dan kichik yoki unga teng barcha tub sonlar (shuning uchun barcha tub sonlar ro‘yxatini saqlashimiz kerak).

Shu ko‘rinishdagi barcha sonlar uchun $lp [x_j] = p_j$ deb belgilaymiz.

Algoritmning to‘g‘riligi va ishlash vaqti isboti implementatsiyadan keyin keltirilgan.

## Implementatsiya

```cpp
const int N = 10000000;
vector<int> lp(N+1);
vector<int> pr;

for (int i=2; i <= N; ++i) {
	if (lp[i] == 0) {
		lp[i] = i;
		pr.push_back(i);
	}
	for (int j = 0; i * pr[j] <= N; ++j) {
		lp[i * pr[j]] = pr[j];
		if (pr[j] == lp[i]) {
			break;
		}
	}
}
```

## To‘g‘rilik isboti

Algoritm barcha $lp []$ qiymatlarini to‘g‘ri o‘rnatishini va har bir qiymat aynan bir marta o‘rnatilishini isbotlashimiz kerak. Shunda algoritm chiziqli vaqtda ishlaydi, chunki uning qolgan barcha amallari, ravshanki, $O(n)$ vaqtda bajariladi.

Har bir $i$ soni quyidagi ko‘rinishda aynan bitta ifodaga ega ekaniga e’tibor bering:

$$i = lp [i] \cdot x,$$

bunda $lp [i]$ — $i$ ning eng kichik tub bo‘luvchisi, $x$ esa $lp [i]$ dan kichik hech qanday tub ko‘paytuvchiga ega emas, ya’ni

$$lp [i] \le lp [x].$$

Endi buni algoritmimizning amallari bilan solishtiraylik: aslida, har bir $x$ uchun algoritm $x$ ni ko‘paytirish mumkin bo‘lgan barcha tub sonlarni, ya’ni $lp [x]$ gacha bo‘lgan tub sonlarning barchasini, yuqoridagi ko‘rinishdagi sonlarni olish maqsadida ko‘rib chiqadi.

Demak, algoritm har bir murakkab sonni aynan bir marta ko‘rib chiqadi va shu yerda $lp []$ ning to‘g‘ri qiymatini o‘rnatadi. Isbot tugadi.

## Ishlash vaqti va xotira

$O(n)$ ishlash vaqti klassik Eratosfen elagining $O(n \log \log n)$ vaqtidan yaxshiroq bo‘lsa-da, ular orasidagi farq unchalik katta emas.
Amalda chiziqli elak Eratosfen elagining odatiy implementatsiyasi bilan taxminan bir xil tezlikda ishlaydi.

Eratosfen elagining segmentlangan elak kabi optimallashtirilgan ko‘rinishlari bilan taqqoslaganda esa u ancha sekinroq.
Bu algoritmning xotira talablarini — uzunligi $n$ bo‘lgan $lp []$ massivi va uzunligi $\frac n {\ln n}$ bo‘lgan $pr []$ massivini — hisobga olsak, u har jihatdan klassik elakdan yomonroqdek ko‘rinadi.
Biroq uning asosiy afzalligi shuki, algoritm $lp []$ massivini hisoblaydi; bu massiv yordamida $[2; n]$ kesmadagi istalgan sonni uning faktorizatsiyasi uzunligiga proporsional vaqtda tub ko‘paytuvchilarga ajratish mumkin. Bundan tashqari, atigi bitta qo‘shimcha massiv yordamida faktorizatsiyani topishda bo‘lish amallaridan butunlay qochish mumkin.

Barcha sonlarning faktorizatsiyasini bilish ayrim masalalarda juda foydali va bu algoritm ularni chiziqli vaqtda topish imkonini beradigan sanoqli algoritmlardan biridir.

## Manbalar

- Paul Pritchard, **Linear Prime-Number Sieves: a Family Tree**, Science of Computer Programming, 9-jild (1987), 17–35-betlar.
