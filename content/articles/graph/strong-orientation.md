---
article_id: graph--strong-orientation
---
# Kuchli yo‘naltirish

Yo‘naltirilmagan grafning **kuchli yo‘naltirilishi** — har bir qirraga shunday yo‘nalish berishki, natijadagi graf [kuchli bog‘langan](strongly-connected-components.md) bo‘lsin. Ya’ni qirralar yo‘naltirilgandan so‘ng, yo‘naltirilgan qirralar bo‘ylab istalgan tugundan istalgan boshqa tugunga yetib borish mumkin bo‘lishi kerak.

## Yechim

Albatta, buni har qanday graf uchun bajarib bo‘lmaydi. Grafdagi biror [ko‘prik](bridge-searching.md)ni ko‘raylik. Unga biror yo‘nalish berishga majburmiz va shundan keyin ko‘prikdan faqat bitta yo‘nalishda o‘tish mumkin bo‘ladi. Demak ko‘prikning bir uchidan ikkinchisiga ikki tomondan ham yetib borish imkoni yo‘qoladi va grafni kuchli bog‘langan qilib bo‘lmaydi.

Endi ko‘priksiz bog‘langan grafda [DFS](depth-first-search.md) bajaraylik. Barcha tugunlarga tashrif buyurishimiz ravshan. Grafda ko‘prik yo‘qligi sababli, DFS daraxtining istalgan qirrasini olib tashlaganimizda ham qirraning pastki tomonidan yuqori tomoniga kamida bitta orqa qirrani o‘z ichiga olgan yo‘l orqali chiqish mumkin. Bundan DFS daraxtining istalgan tugunidan uning ildiziga yetib borish mumkinligi kelib chiqadi. DFS daraxtining ildizidan esa istalgan tugunga tushish mumkin. Demak kuchli yo‘naltirish topildi.

Boshqacha aytganda, ko‘priksiz bog‘langan grafni kuchli yo‘naltirish uchun unda DFS bajaring, DFS daraxti qirralarini ildizdan uzoqlashadigan tomonga, qolgan barcha qirralarni esa DFS daraxtidagi avloddan ajdodga qarab yo‘naltiring.

Aynan ko‘priksiz bog‘langan graflargina kuchli yo‘naltirishga ega bo‘lishi haqidagi natija **Robbins teoremasi** deb ataladi.

## Masalaning kengaytmasi

Endi kuchli bog‘langan komponentlar soni imkon qadar kichik bo‘ladigan graf yo‘naltirilishini topish masalasini ko‘ramiz.

Har bir bog‘langan komponentni alohida ko‘rib chiqish mumkin. Faqat ko‘priksiz graflar kuchli yo‘naltirilishi mumkinligi sababli, barcha ko‘priklarni vaqtincha olib tashlaymiz. Natijada bir nechta ko‘priksiz komponent hosil bo‘ladi; ularning soni **dastlabki bog‘langan komponentlar soni + ko‘priklar soni** ga teng. Har bir shunday komponentni kuchli yo‘naltirish mumkinligini bilamiz.

Bizga qirralarni olib tashlash emas, faqat yo‘naltirish ruxsat etilgan, ammo ko‘priklarni istalgan tomonga yo‘naltirish mumkin. Buning eng sodda usuli — yuqorida tavsiflangan algoritmni hech qanday o‘zgartirishsiz har bir dastlabki bog‘langan komponentda bajarish.

### Implementatsiya

Kirishda $n$ — tugunlar soni, $m$ — qirralar soni, keyingi $m$ qatorda esa qirralar beriladi.

Chiqishning birinchi qatorida kuchli bog‘langan komponentlarning eng kichik soni, ikkinchi qatorida esa $m$ ta belgidan iborat satr chiqariladi. Har bir belgi:

- `>` — kirishdagi mos qirra chapdagi tugundan o‘ngdagi tugunga qarab yo‘naltirilganini;
- `<` — qirra teskari tomonga yo‘naltirilganini bildiradi.

Bu ko‘priklarni topish algoritmining qirralarni ham yo‘naltiradigan o‘zgartirilgan ko‘rinishidir. Muqobil ravishda avval qirralarni yo‘naltirib, keyin hosil bo‘lgan yo‘naltirilgan grafdagi kuchli bog‘langan komponentlarni sanash ham mumkin.

```cpp
vector<vector<pair<int, int>>> adj; // adjacency list - vertex and edge pairs
vector<pair<int, int>> edges;
vector<int> tin, low;
int bridge_cnt;
string orient;
vector<bool> edge_used;
void find_bridges(int v) {
	static int time = 0;
	low[v] = tin[v] = time++;
	for (auto p : adj[v]) {
		if (edge_used[p.second]) continue;
		edge_used[p.second] = true;
		orient[p.second] = v == edges[p.second].first ? '>' : '<';
		int nv = p.first;
		if (tin[nv] == -1) { // if nv is not visited yet
			find_bridges(nv);
			low[v] = min(low[v], low[nv]);
			if (low[nv] > tin[v]) {
				// a bridge between v and nv
				bridge_cnt++;
			}
		} else {
			low[v] = min(low[v], tin[nv]);
		}
	}
}
int main() {
	int n, m;
	scanf("%d %d", &n, &m);
	adj.resize(n);
	tin.resize(n, -1);
	low.resize(n, -1);
	orient.resize(m);
	edges.resize(m);
	edge_used.resize(m);
	for (int i = 0; i < m; i++) {
		int a, b;
		scanf("%d %d", &a, &b);
		a--; b--;
		adj[a].push_back({b, i});
		adj[b].push_back({a, i});
		edges[i] = {a, b};
	}
	int comp_cnt = 0;
	for (int v = 0; v < n; v++) {
		if (tin[v] == -1) {
			comp_cnt++;
			find_bridges(v);
		}
	}
	printf("%d\n%s\n", comp_cnt + bridge_cnt, orient.c_str());
}
```

## Mashq masalalari

* [26th Polish OI - Osiedla](https://szkopul.edu.pl/problemset/problem/nldsb4EW1YuZykBlf4lcZL1Y/site/)

