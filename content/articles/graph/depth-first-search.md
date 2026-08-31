---
article_id: graph--depth-first-search
---
# Chuqurlik bo‘yicha qidiruv (DFS)

Chuqurlik bo‘yicha qidiruv graflarning asosiy algoritmlaridan biridir.

Chuqurlik bo‘yicha qidiruv $u$ manba tugundan har bir tugungacha grafdagi leksikografik jihatdan birinchi yo‘lni topadi. U daraxtda eng qisqa yo‘llarni ham topadi, chunki daraxtdagi har ikki tugun orasida faqat bitta oddiy yo‘l mavjud; umumiy graflarda esa bu xossa bajarilmaydi.

Algoritm $O(m+n)$ vaqtda ishlaydi; bu yerda $n$ — tugunlar, $m$ esa qirralar soni.

## Algoritm tavsifi

DFS g‘oyasi graf ichiga imkon qadar chuqur kirish va tashrif buyurilmagan qo‘shnisi qolmagan tugunga yetganda orqaga qaytishdan iborat.

Algoritmni rekursiv tarzda tasvirlash va amalga oshirish juda oson. Qidiruvni bitta tugundan boshlaymiz. Tugunga tashrif buyurgach, ilgari tashrif buyurilmagan har bir qo‘shni tugun uchun yana DFS bajariladi. Shu tariqa boshlang‘ich tugundan yetib borish mumkin bo‘lgan barcha tugunlarga tashrif buyuramiz. Tafsilotlar implementatsiyada ko‘rsatilgan.

## Chuqurlik bo‘yicha qidiruvning qo‘llanishlari

* $u$ manba tugundan grafning barcha tugunlarigacha biror yo‘lni topish.
* $u$ manbadan barcha tugunlargacha leksikografik jihatdan birinchi yo‘lni topish.
* Daraxtdagi bir tugun boshqa tugunning ajdodi ekanini tekshirish. Har bir qidiruv chaqiruvining boshida va oxirida tugunning kirish hamda chiqish «vaqtlarini» eslab qolamiz. Shunda istalgan $(i,j)$ tugunlar jufti uchun javobni $O(1)$ vaqtda olish mumkin: $i$ tugun $j$ ning ajdodi bo‘lishi uchun va faqat shundagina $	ext{entry}[i] < 	ext{entry}[j]$ hamda $	ext{exit}[i] > 	ext{exit}[j]$ bo‘lishi kerak.
* Ikki tugunning eng quyi umumiy ajdodini — LCAni — topish.
* Topologik tartiblash. Har bir tugunga aynan bir marta tashrif buyurish uchun chuqurlik bo‘yicha qidiruvlar seriyasini $O(n+m)$ vaqtda bajaring. Kerakli topologik tartib tugunlarni chiqish vaqtining kamayish tartibida saralash orqali olinadi.
* Berilgan graf siklsiz ekanini tekshirish va grafdagi sikllarni topish. Quyida aytilganidek, buning uchun har bir bog‘langan komponentdagi orqa qirralarni aniqlash mumkin.
* Yo‘naltirilgan grafning kuchli bog‘langan komponentlarini topish. Avval grafni topologik tartiblang. Keyin grafning transpozitsiyasini tuzing va topologik tartib belgilagan ketma-ketlikda yana bir chuqurlik bo‘yicha qidiruvlar seriyasini bajaring. Har bir DFS chaqiruvi hosil qilgan komponent bitta kuchli bog‘langan komponent bo‘ladi.
* Yo‘naltirilmagan grafdagi ko‘priklarni topish. Avval chuqurlik bo‘yicha qidiruvlar seriyasini bajarib, har bir qirrani undan o‘tgan yo‘nalishimiz bo‘yicha yo‘naltirish orqali berilgan grafni yo‘naltirilgan grafga aylantiring. Keyin shu yo‘naltirilgan grafning kuchli bog‘langan komponentlarini toping. Uchlari turli kuchli bog‘langan komponentlarga tegishli qirralar ko‘prik bo‘ladi.

## Graf qirralarini tasniflash

$G$ graf qirralarini $(u,v)$ qirraning uchlari $u$ va $v$ ning kirish hamda chiqish vaqtlaridan foydalanib tasniflash mumkin. Bunday tasnif ko‘pincha [ko‘priklarni topish](bridge-searching.md) va [artikulyatsiya nuqtalarini topish](cutpoints.md) kabi masalalarda ishlatiladi.

DFS bajaramiz va uchragan qirralarni quyidagi qoidalar asosida tasniflaymiz.

Agar $v$ ga hali tashrif buyurilmagan bo‘lsa:

* **Daraxt qirrasi.** Agar $v$ tugunga $u$ dan keyin tashrif buyurilsa, $(u,v)$ qirra daraxt qirrasi deyiladi. Boshqacha aytganda, $v$ ga ilk marta tashrif buyurilayotgan va shu paytda $u$ qayta ishlanayotgan bo‘lsa, $(u,v)$ daraxt qirrasidir. Bunday qirralar DFS daraxtini hosil qiladi; ularning nomi ham shundan kelib chiqqan.

Agar $v$ ga $u$ dan oldin tashrif buyurilgan bo‘lsa:

* **Orqa qirra.** Agar $v$ tugun $u$ ning ajdodi bo‘lsa, $(u,v)$ orqa qirra deyiladi. $v$ ajdod bo‘lishi uchun aynan $v$ ga kirilgan, ammo undan hali chiqilmagan bo‘lishi kerak. Orqa qirra siklni yopadi: DFS rekursiyasida $v$ ajdoddan $u$ avlodgacha yo‘l bor, $u$ avloddan $v$ ajdodga esa orqa qirra mavjud. Shu sababli orqa qirralar yordamida sikllarni aniqlash mumkin.
* **Oldinga qirra.** Agar $v$ tugun $u$ ning avlodi bo‘lsa, $(u,v)$ oldinga qirra deyiladi. Ya’ni $v$ ga allaqachon tashrif buyurib undan chiqilgan va $	ext{entry}[u] < 	ext{entry}[v]$ bo‘lsa, $(u,v)$ oldinga qirradir.
* **Ko‘ndalang qirra.** Agar $v$ tugun $u$ ning na ajdodi, na avlodi bo‘lsa, $(u,v)$ ko‘ndalang qirra deyiladi. Boshqacha aytganda, $v$ ga tashrif buyurib undan chiqilgan va $	ext{entry}[u] > 	ext{entry}[v]$ bo‘lsa, $(u,v)$ ko‘ndalang qirradir.

**Teorema.** $G$ yo‘naltirilmagan graf bo‘lsin. $G$ da DFS bajarilganda uchragan har bir qirra daraxt qirrasi yoki orqa qirra sifatida tasniflanadi; demak oldinga va ko‘ndalang qirralar faqat yo‘naltirilgan graflarda mavjud bo‘lishi mumkin.

$(u,v)$ — $G$ dagi ixtiyoriy qirra bo‘lsin va umumiylikni yo‘qotmagan holda $u$ ga $v$ dan oldin tashrif buyurilgan, ya’ni $	ext{entry}[u] < 	ext{entry}[v]$ deb faraz qilaylik. DFS har bir qirrani faqat bir marta qayta ishlagani uchun $(u,v)$ qirrani qayta ishlash va tasniflashning faqat ikki usuli bor.

* Qirrani birinchi marta $u$ dan $v$ ga qarab ko‘ramiz. $	ext{entry}[u] < 	ext{entry}[v]$ bo‘lgani va DFS rekursiv ishlagani sababli, chaqiruvlar stekida yuqoriga qaytib $u$ tugundan chiqishimizdan oldin $v$ tugun to‘liq ko‘rib chiqilib, undan chiqiladi. DFS $(u,v)$ qirrani ilk bor $u$ dan $v$ ga qarab ko‘rayotganda $v$ hali tashrif buyurilmagan bo‘lishi shart; aks holda $u$ va $v$ qo‘shni bo‘lgani uchun qidiruv $v$ dan chiqishdan oldin qirrani $v$ dan $u$ ga qarab ko‘rgan bo‘lardi. Demak $(u,v)$ daraxt qirrasidir.
* Qirrani birinchi marta $v$ dan $u$ ga qarab ko‘ramiz. $u$ tugun $v$ dan oldin topilgan va qirralar faqat bir marta qayta ishlanganligi uchun, $(u,v)$ qirrani ilk bor $v$ dan $u$ ga qarab ko‘rishimizning yagona imkoniyati — $u$ dan $v$ ga $(u,v)$ qirrasidan foydalanmaydigan boshqa yo‘l mavjud bo‘lishidir. Shunda $u$ tugun $v$ ning ajdodiga aylanadi. $(u,v)$ qirra hali chiqilmagan $u$ ajdodga $v$ avloddan qaytib, siklni yopadi. Demak $(u,v)$ orqa qirradir.

Qirrani qayta ishlashning faqat shu ikki usuli mavjud va ikkala holatning tasnifi yuqorida berildi. Shunday qilib, yo‘naltirilmagan grafda DFS uchratgan har bir qirra daraxt qirrasi yoki orqa qirra bo‘ladi; oldinga va ko‘ndalang qirralar faqat yo‘naltirilgan graflarda mavjud. Teorema isbotlandi.

## Implementatsiya

```cpp
vector<vector<int>> adj; // graph represented as an adjacency list
int n; // number of vertices

vector<bool> visited;

void dfs(int v) {
	visited[v] = true;
	for (int u : adj[v]) {
		if (!visited[u])
			dfs(u);
    }
}
```

Bu chuqurlik bo‘yicha qidiruvning eng sodda implementatsiyasidir. Qo‘llanishlarda aytilganidek, kirish va chiqish vaqtlarini hamda tugun rangini hisoblash foydali bo‘lishi mumkin. Hali tashrif buyurilmagan tugunlarni $0$, tashrif buyurilgan, ammo ulardan hali chiqilmagan tugunlarni $1$, tugundan chiqib bo‘linganini esa $2$ rang bilan belgilaymiz.

Quyidagi umumiy implementatsiya bu qiymatlarni ham hisoblaydi:

```cpp
vector<vector<int>> adj; // graph represented as an adjacency list
int n; // number of vertices

vector<int> color;

vector<int> time_in, time_out;
int dfs_timer = 0;

void dfs(int v) {
	time_in[v] = dfs_timer++;
	color[v] = 1;
	for (int u : adj[v])
		if (color[u] == 0)
			dfs(u);
	color[v] = 2;
	time_out[v] = dfs_timer++;
}
```

## Mashq masalalari

* [SPOJ: ABCPATH](http://www.spoj.com/problems/ABCPATH/)
* [SPOJ: EAGLE1](http://www.spoj.com/problems/EAGLE1/)
* [Codeforces: Kefa and Park](http://codeforces.com/problemset/problem/580/C)
* [Timus:Werewolf](http://acm.timus.ru/problem.aspx?space=1&num=1242)
* [Timus:Penguin Avia](http://acm.timus.ru/problem.aspx?space=1&num=1709)
* [Timus:Two Teams](http://acm.timus.ru/problem.aspx?space=1&num=1106)
* [SPOJ - Ada and Island](http://www.spoj.com/problems/ADASEA/)
* [UVA 657 - The die is cast](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=598)
* [SPOJ - Sheep](http://www.spoj.com/problems/KOZE/)
* [SPOJ - Path of the Rightenous Man](http://www.spoj.com/problems/RIOI_2_3/)
* [SPOJ - Validate the Maze](http://www.spoj.com/problems/MAKEMAZE/)
* [SPOJ - Ghosts having Fun](http://www.spoj.com/problems/GHOSTS/)
* [Codeforces - Underground Lab](http://codeforces.com/contest/781/problem/C)
* [DevSkill - Maze Tester (archived)](http://web.archive.org/web/20200319103915/https://www.devskill.com/CodingProblems/ViewProblem/3)
* [DevSkill - Tourist (archived)](http://web.archive.org/web/20190426175135/https://devskill.com/CodingProblems/ViewProblem/17)
* [Codeforces - Anton and Tree](http://codeforces.com/contest/734/problem/E)
* [Codeforces - Transformation: From A to B](http://codeforces.com/contest/727/problem/A)
* [Codeforces - One Way Reform](http://codeforces.com/contest/723/problem/E)
* [Codeforces - Centroids](http://codeforces.com/contest/709/problem/E)
* [Codeforces - Generate a String](http://codeforces.com/contest/710/problem/E)
* [Codeforces - Broken Tree](http://codeforces.com/contest/758/problem/E)
* [Codeforces - Dasha and Puzzle](http://codeforces.com/contest/761/problem/E)
* [Codeforces - Making genome In Berland](http://codeforces.com/contest/638/problem/B)
* [Codeforces - Road Improvement](http://codeforces.com/contest/638/problem/C)
* [Codeforces - Garland](http://codeforces.com/contest/767/problem/C)
* [Codeforces - Labeling Cities](http://codeforces.com/contest/794/problem/D)
* [Codeforces - Send the Fool Further!](http://codeforces.com/contest/802/problem/J1)
* [Codeforces - The tag Game](http://codeforces.com/contest/813/problem/C)
* [Codeforces - Leha and Another game about graphs](http://codeforces.com/contest/841/problem/D)
* [Codeforces - Shortest path problem](http://codeforces.com/contest/845/problem/G)
* [Codeforces - Upgrading Tree](http://codeforces.com/contest/844/problem/E)
* [Codeforces - From Y to Y](http://codeforces.com/contest/849/problem/C)
* [Codeforces - Chemistry in Berland](http://codeforces.com/contest/846/problem/E)
* [Codeforces - Wizards Tour](http://codeforces.com/contest/861/problem/F)
* [Codeforces - Ring Road](http://codeforces.com/contest/24/problem/A)
* [Codeforces - Mail Stamps](http://codeforces.com/contest/29/problem/C)
* [Codeforces - Ant on the Tree](http://codeforces.com/contest/29/problem/D)
* [SPOJ - Cactus](http://www.spoj.com/problems/CAC/)
* [SPOJ - Mixing Chemicals](http://www.spoj.com/problems/AMR10J/)

