---
article_id: data_structures--sqrt-tree
---
# Sqrt Tree

$n$ ta elementdan iborat $a$ massivi va assotsiativlik xususiyatini qanoatlantiruvchi $\circ$ amali berilgan bo‘lsin, ya’ni istalgan $x$, $y$, $z$ uchun

$$(x\circ y)\circ z=x\circ(y\circ z).$$

$\gcd$, $\min$, $\max$, $+$, $\text{and}$, $\text{or}$, $\text{xor}$ kabi amallar ushbu shartni qanoatlantiradi.

Shuningdek, $q(l,r)$ so‘rovlari berilgan. Har bir so‘rov uchun

$$a_l\circ a_{l+1}\circ\dots\circ a_r$$

qiymatini hisoblash kerak.

Sqrt Tree bunday so‘rovlarga $O(1)$ vaqtda javob beradi; oldindan hisoblash vaqti va xotira sarfi $O(n\log\log n)$.

## Tavsif

### Sqrt Decomposition qurish

Avval [Sqrt Decomposition](sqrt_decomposition.md) qilamiz. Massivni har biri $\sqrt n$ o‘lchamli $\sqrt n$ ta blokka ajratamiz. Har bir blok uchun quyidagilarni hisoblaymiz:

1. Blok ichida yotadigan va blok boshidan boshlanadigan so‘rovlar javoblari — $\text{prefixOp}$.
2. Blok ichida yotadigan va blok oxirida tugaydigan so‘rovlar javoblari — $\text{suffixOp}$.

Bundan tashqari, yana bir massivni hisoblaymiz:

3. $\text{between}_{i,j}$, $i\le j$ — $i$-blok boshidan boshlanib, $j$-blok oxirida tugaydigan so‘rov javobi. Bloklar soni $\sqrt n$ bo‘lgani uchun ushbu massiv o‘lchami $O((\sqrt n)^2)=O(n)$ bo‘ladi.

Misolni ko‘rib chiqamiz.

$\circ$ amali $+$, ya’ni kesmadagi yig‘indini hisoblaymiz, va $a$ massivi quyidagicha bo‘lsin:

`{1, 2, 3, 4, 5, 6, 7, 8, 9}`

U uchta blokka ajraladi: `{1, 2, 3}`, `{4, 5, 6}` va `{7, 8, 9}`.

Birinchi blok uchun $\text{prefixOp}$ — `{1, 3, 6}`, $\text{suffixOp}$ esa `{6, 5, 3}`.

Ikkinchi blok uchun $\text{prefixOp}$ — `{4, 9, 15}`, $\text{suffixOp}$ esa `{15, 11, 6}`.

Uchinchi blok uchun $\text{prefixOp}$ — `{7, 15, 24}`, $\text{suffixOp}$ esa `{24, 17, 9}`.

$\text{between}$ massivi:

~~~~~
{
    {6, 21, 45},
    {0, 15, 39},
    {0, 0,  24}
}
~~~~~

($i>j$ bo‘lgan noto‘g‘ri elementlar nol bilan to‘ldirilgan deb olamiz.)

Bu massivlarni $O(n)$ vaqt va xotirada oson hisoblash mumkin.

Endi ayrim so‘rovlarga shu massivlar yordamida javob bera olamiz. Agar so‘rov bitta blok ichiga to‘liq sig‘masa, uni uch qismga ajratamiz: birinchi blokning suffix qismi, ketma-ket joylashgan bir nechta to‘liq bloklar va oxirgi blokning prefix qismi. Javob $\text{suffixOp}$ dagi bitta qiymat, $\text{between}$ dagi bitta qiymat va $\text{prefixOp}$ dagi bitta qiymatga $\circ$ amalini qo‘llash orqali olinadi.

Biroq bitta blok ichiga to‘liq sig‘adigan so‘rovlarni bu uch massiv yordamida qayta ishlay olmaymiz. Demak, yana bir g‘oya kerak.

### Daraxt qurish

Faqat bitta blok ichiga sig‘adigan so‘rovlarga javob bera olmayapmiz. **Har bir blok uchun yuqoridagi tuzilmaning o‘zini yana qursak-chi?** Buni rekursiv ravishda, blok o‘lchami 1 yoki 2 bo‘lguncha davom ettirish mumkin. Bunday bloklar javobini $O(1)$ vaqtda bevosita hisoblash oson.

Natijada daraxt hosil bo‘ladi. Daraxtning har bir tuguni massivning biror kesmasini ifodalaydi. Uzunligi $k$ bo‘lgan kesmani ifodalovchi tugunning $\sqrt k$ ta farzandi — har bir blok uchun bittadan — bo‘ladi. Har bir tugunda o‘zi ifodalagan kesma uchun yuqoridagi uchta massiv saqlanadi. Ildiz butun massivni ifodalaydi; uzunligi 1 yoki 2 bo‘lgan kesmalar tugunlari barglardir.

Bu daraxt balandligi $O(\log\log n)$ ekanligi ravshan. Agar tugun uzunligi $k$ bo‘lgan massivni ifodalasa, uning farzandlari uzunligi $\sqrt k$ bo‘ladi. $\log(\sqrt k)=\frac{\log k}{2}$, ya’ni daraxtning har qatlamida $\log k$ ikki baravar kamayadi. Har bir massiv elementi daraxtning har bir qatlamida aynan bir marta qatnashgani uchun qurish vaqti va xotira sarfi $O(n\log\log n)$ bo‘ladi.

Endi so‘rovga $O(\log\log n)$ vaqtda javob bera olamiz. Daraxt bo‘ylab uzunligi 1 yoki 2 bo‘lgan kesmaga yetguncha — u yerda javob $O(1)$ da topiladi — yoki so‘rov bir blokka to‘liq sig‘maydigan birinchi kesmaga kelguncha pastga tushamiz. Ikkinchi holatda javobni oldingi bo‘limdagi uch qismga ajratish usuli bilan topamiz.

Shunday qilib, bir so‘rov uchun $O(\log\log n)$ ga erishdik. Bundan ham tezroq qilish mumkinmi?

### So‘rov murakkabligini optimallashtirish

Eng tabiiy optimallashtirishlardan biri kerakli daraxt tugunini binary search yordamida topishdir. Bu bir so‘rov murakkabligini $O(\log\log\log n)$ gacha tushiradi. Ammo bundan ham tezroq yo‘l bor.

Quyidagi ikki shartni ta’minlaymiz:

1. Har bir blok o‘lchami ikkilik daraja bo‘lsin.
2. Har bir qatlamdagi barcha bloklar teng bo‘lsin.

Buning uchun massiv o‘lchami ikkilik darajaga aylanguncha unga bir nechta nol element qo‘shish mumkin. Ayrim blok o‘lchamlari ikkilik daraja bo‘lishi uchun ikki baravar kattalashishi mumkin, ammo ular baribir $O(\sqrt k)$ o‘lchamda qoladi va tugun ichidagi massivlarni chiziqli vaqtda qurish imkoniyati saqlanadi.

Endi so‘rov uzunligi $2^k$ bo‘lgan bitta blok ichiga to‘liq sig‘ish-sig‘masligini oson tekshiramiz. So‘rov chegaralari $l$ va $r$ ni — indekslash noldan boshlanadi — ikkilik ko‘rinishda yozamiz. Masalan, $k=4$, $l=39$, $r=46$ bo‘lsin:

$$l=39_{10}=100111_2,$$

$$r=46_{10}=101110_2.$$

Bitta qatlamdagi kesmalar ham, ularning bloklari ham teng o‘lchamli. Misolda blok o‘lchami $2^k=2^4=16$. Bloklar butun massivni qoplaydi: birinchi blok $0$ dan $15$ gacha, ya’ni ikkilik ko‘rinishda $000000_2$ dan $001111_2$ gacha; ikkinchisi $16$ dan $31$ gacha, ya’ni $010000_2$ dan $011111_2$ gacha va hokazo. Bitta blok qamrab olgan indekslar faqat oxirgi $k$ ta bitda farq qilishi mumkin.

Bizning misolda $l$ va $r$ ning eng kichik to‘rtta bitidan boshqa bitlari teng, demak ular bitta blokda yotadi. Umuman olganda, $k$ tadan ko‘p eng kichik bit farq qilmasligini, ya’ni $l\ \text{xor}\ r$ qiymati $2^k-1$ dan oshmasligini tekshirish kifoya.

Bu kuzatuv yordamida so‘rovga javob berish uchun mos qatlamni tez topish mumkin:

1. Massiv o‘lchamidan oshmaydigan har bir $i$ uchun 1 ga teng eng yuqori bitni topamiz. Buni DP va oldindan hisoblangan massiv bilan tez bajarish mumkin.
2. Har bir $q(l,r)$ so‘rovida $l\ \text{xor}\ r$ ning eng yuqori bitini topamiz. Shu ma’lumot orqali so‘rovni oson qayta ishlash mumkin bo‘lgan qatlamni tanlaymiz. Buning uchun ham oldindan hisoblangan massivdan foydalanish mumkin.

Tafsilotlar quyidagi kodda ko‘rsatilgan.

Natijada har bir so‘rovga $O(1)$ vaqtda javob bera olamiz.

## Elementlarni yangilash

Sqrt Tree elementlarni yangilashni ham qo‘llab-quvvatlaydi. Bitta element yangilanishlari ham, butun kesma yangilanishlari ham mumkin.

### Bitta elementni yangilash

$a_x=val$ o‘zlashtirishini bajaradigan $\text{update}(x,val)$ so‘rovini ko‘rib chiqamiz. Uni yetarlicha tez bajarish kerak.

#### Sodda yondashuv

Avval bitta element o‘zgarganda daraxtda nimalar o‘zgarishini ko‘ramiz. Uzunligi $l$ bo‘lgan tugun va uning $\text{prefixOp}$, $\text{suffixOp}$, $\text{between}$ massivlarini olaylik. $\text{prefixOp}$ va $\text{suffixOp}$ dan faqat $O(\sqrt l)$ ta element — o‘zgargan element joylashgan blok ichidagilar — o‘zgaradi. $\text{between}$ da esa $O(l)$ ta element o‘zgaradi. Demak, tugunda jami $O(l)$ ta qiymat yangilanadi.

Har bir $x$ element har bir qatlamda aynan bitta tugunda qatnashadi. Ildiz — 0-qatlam — uzunligi $O(n)$; 1-qatlam tugunlari uzunligi $O(\sqrt n)$; 2-qatlam tugunlari uzunligi $O(\sqrt{\sqrt n})$ va hokazo. Shu sababli bir yangilanish vaqti

$$O(n+\sqrt n+\sqrt{\sqrt n}+\dots)=O(n).$$

Bu juda sekin. Uni tezlashtirish mumkin.

#### Sqrt Tree ichidagi Sqrt Tree

Yangilashdagi asosiy to‘siq ildiz tugunning $\text{between}$ massivini qayta qurishdir. Uni butunlay olib tashlaymiz. Ildizning $\text{between}$ massivi o‘rniga boshqa bir Sqrt Tree saqlaymiz va uni $\text{index}$ deb ataymiz. U $\text{between}$ bilan bir xil vazifani — bloklar kesmalari so‘rovlariga javob berishni — bajaradi. Daraxtning qolgan tugunlarida $\text{index}$ yo‘q; ular odatiy $\text{between}$ massivlarini saqlaydi.

Agar Sqrt Tree ildizida $\text{index}$ bo‘lsa, u _indexed_; ildizida $\text{between}$ bo‘lsa, _unindexed_ deyiladi. Muhim jihat: $\text{index}$ ning o‘zi **unindexed** Sqrt Tree bo‘ladi.

Indexed daraxtda bitta elementni yangilash algoritmi:

- $\text{prefixOp}$ va $\text{suffixOp}$ ni $O(\sqrt n)$ vaqtda yangilash.
- $\text{index}$ ni yangilash. Uning uzunligi $O(\sqrt n)$ va unda faqat o‘zgargan blokni ifodalovchi bitta element yangilanadi. Ushbu qadam $O(\sqrt n)$ vaqt oladi; buning uchun bo‘lim boshidagi «sekin» algoritmdan foydalanish mumkin.
- O‘zgargan blokni ifodalovchi farzand tugunga o‘tib, uni «sekin» algoritm bilan $O(\sqrt n)$ vaqtda yangilash.

So‘rov murakkabligi hamon $O(1)$ bo‘lib qoladi: so‘rovda $\text{index}$ dan ko‘pi bilan bir marta foydalanamiz va bu $O(1)$ vaqt oladi.

Demak, bitta elementni yangilashning umumiy murakkabligi $O(\sqrt n)$.

### Kesmani yangilash

Sqrt Tree kesmadagi barcha elementlarga bitta qiymat o‘zlashtirish kabi amallarni ham bajara oladi. $\text{massUpdate}(x,l,r)$ barcha $l\le i\le r$ uchun $a_i=x$ degani.

Buning ikki yondashuvi bor. Birinchisi $\text{massUpdate}$ ni $O(\sqrt n\log\log n)$ vaqtda bajarib, so‘rov murakkabligini $O(1)$ da saqlaydi. Ikkinchisi $\text{massUpdate}$ ni $O(\sqrt n)$ vaqtda bajaradi, ammo so‘rov murakkabligi $O(\log\log n)$ bo‘ladi.

Segment tree dagidek lazy propagation ishlatamiz: ayrim tugunlarni _lazy_ deb belgilaymiz va ularni faqat zarur bo‘lganda push qilamiz. Segment tree dan farqli jihati shuki, tugunni push qilish qimmat va uni so‘rov paytida bajarib bo‘lmaydi. 0-qatlamdagi tugunni push qilish $O(\sqrt n)$ vaqt oladi. Shuning uchun so‘rov ichida tugunlarni push qilmaymiz; faqat joriy tugun yoki uning otasi lazy ekanini tekshirib, javobni hisoblashda bu holatni hisobga olamiz.

#### Birinchi yondashuv

Bu yondashuvda faqat 1-qatlamdagi, uzunligi $O(\sqrt n)$ bo‘lgan tugunlar lazy bo‘lishi mumkin. Bunday tugun push qilinganda, o‘zi bilan birga butun ost-daraxti $O(\sqrt n\log\log n)$ vaqtda yangilanadi. $\text{massUpdate}$ quyidagicha bajariladi:

- 1-qatlam tugunlari va ularga mos bloklarni ko‘rib chiqamiz.
- $\text{massUpdate}$ to‘liq qamrab olgan bloklarni $O(\sqrt n)$ vaqtda lazy deb belgilaymiz.
- Qisman qamrab olingan bloklar ko‘pi bilan ikkita bo‘ladi. Ularni $O(\sqrt n\log\log n)$ vaqtda qayta quramiz; ular oldindan lazy bo‘lgan bo‘lsa, buni hisobga olamiz.
- Qisman qamrab olingan bloklar uchun $\text{prefixOp}$ va $\text{suffixOp}$ ni $O(\sqrt n)$ vaqtda yangilaymiz.
- $\text{index}$ ni $O(\sqrt n\log\log n)$ vaqtda qayta quramiz.

Lazy propagation so‘rovlarga quyidagicha ta’sir qiladi:

- So‘rov to‘liq lazy blok ichida yotsa, lazy qiymatni hisobga olib uni $O(1)$ da hisoblaymiz.
- So‘rov ko‘p blokdan iborat bo‘lib, ayrimlari lazy bo‘lsa, lazy holatni faqat eng chap va eng o‘ng blok uchun alohida hisobga olish kerak. Qolgan bloklar $\text{index}$ orqali hisoblanadi; u har bir o‘zgartirishdan keyin qayta qurilgani uchun lazy blok javobini allaqachon biladi.

So‘rov murakkabligi $O(1)$ bo‘lib qoladi.

#### Ikkinchi yondashuv

Bu yondashuvda ildizdan tashqari har bir tugun lazy bo‘lishi mumkin; hatto $\text{index}$ ichidagi tugunlar ham. So‘rov paytida barcha ota tugunlardagi lazy teglarni tekshirishga to‘g‘ri keladi, shuning uchun so‘rov murakkabligi $O(\log\log n)$ bo‘ladi.

Buning evaziga $\text{massUpdate}$ tezlashadi:

- To‘liq qamrab olingan bloklarga lazy teglar qo‘shiladi; bu $O(\sqrt n)$.
- Ko‘pi bilan ikkita qisman qamrab olingan blok uchun $\text{prefixOp}$ va $\text{suffixOp}$ $O(\sqrt n)$ vaqtda yangilanadi.
- $\text{index}$ ni yangilash unutilmaydi. Shu $\text{massUpdate}$ algoritmidan foydalanib, bu $O(\sqrt n)$ vaqt oladi.
- Unindexed ost-daraxtlar uchun $\text{between}$ massivi yangilanadi.
- Qisman qamrab olingan bloklarni ifodalovchi tugunlarga o‘tib, $\text{massUpdate}$ rekursiv chaqiriladi.

Rekursiv chaqiruvda prefix yoki suffix $\text{massUpdate}$ bajariladi. Prefix va suffix yangilanishlarida ko‘pi bilan bitta farzand qisman qamrab olinadi. Demak, 1-qatlamda bitta tugun, 2-qatlamda ikkita tugun va har bir chuqurroq qatlamda ko‘pi bilan ikkita tugun ko‘riladi. Vaqt murakkabligi

$$O(\sqrt n+\sqrt{\sqrt n}+\dots)=O(\sqrt n).$$

Bu yondashuv segment tree dagi oraliq yangilanishiga o‘xshaydi.

## Implementatsiya

Quyidagi Sqrt Tree implementatsiyasi $O(n\log\log n)$ vaqtda quriladi, so‘rovlarga $O(1)$ da javob beradi va bitta elementni $O(\sqrt n)$ da yangilaydi.

~~~~~cpp
SqrtTreeItem op(const SqrtTreeItem &a, const SqrtTreeItem &b);

inline int log2Up(int n) {
	int res = 0;
	while ((1 << res) < n) {
		res++;
	}
	return res;
}

class SqrtTree {
private:
	int n, lg, indexSz;
	vector<SqrtTreeItem> v;
	vector<int> clz, layers, onLayer;
	vector< vector<SqrtTreeItem> > pref, suf, between;
	
	inline void buildBlock(int layer, int l, int r) {
		pref[layer][l] = v[l];
		for (int i = l+1; i < r; i++) {
			pref[layer][i] = op(pref[layer][i-1], v[i]);
		}
		suf[layer][r-1] = v[r-1];
		for (int i = r-2; i >= l; i--) {
			suf[layer][i] = op(v[i], suf[layer][i+1]);
		}
	}
	
	inline void buildBetween(int layer, int lBound, int rBound, int betweenOffs) {
		int bSzLog = (layers[layer]+1) >> 1;
		int bCntLog = layers[layer] >> 1;
		int bSz = 1 << bSzLog;
		int bCnt = (rBound - lBound + bSz - 1) >> bSzLog;
		for (int i = 0; i < bCnt; i++) {
			SqrtTreeItem ans;
			for (int j = i; j < bCnt; j++) {
				SqrtTreeItem add = suf[layer][lBound + (j << bSzLog)];
				ans = (i == j) ? add : op(ans, add);
				between[layer-1][betweenOffs + lBound + (i << bCntLog) + j] = ans;
			}
		}
	}
	
	inline void buildBetweenZero() {
		int bSzLog = (lg+1) >> 1;
		for (int i = 0; i < indexSz; i++) {
			v[n+i] = suf[0][i << bSzLog];
		}
		build(1, n, n + indexSz, (1 << lg) - n);
	}
	
	inline void updateBetweenZero(int bid) {
		int bSzLog = (lg+1) >> 1;
		v[n+bid] = suf[0][bid << bSzLog];
		update(1, n, n + indexSz, (1 << lg) - n, n+bid);
	}
	
	void build(int layer, int lBound, int rBound, int betweenOffs) {
		if (layer >= (int)layers.size()) {
			return;
		}
		int bSz = 1 << ((layers[layer]+1) >> 1);
		for (int l = lBound; l < rBound; l += bSz) {
			int r = min(l + bSz, rBound);
			buildBlock(layer, l, r);
			build(layer+1, l, r, betweenOffs);
		}
		if (layer == 0) {
			buildBetweenZero();
		} else {
			buildBetween(layer, lBound, rBound, betweenOffs);
		}
	}
	
	void update(int layer, int lBound, int rBound, int betweenOffs, int x) {
		if (layer >= (int)layers.size()) {
			return;
		}
		int bSzLog = (layers[layer]+1) >> 1;
		int bSz = 1 << bSzLog;
		int blockIdx = (x - lBound) >> bSzLog;
		int l = lBound + (blockIdx << bSzLog);
		int r = min(l + bSz, rBound);
		buildBlock(layer, l, r);
		if (layer == 0) {
			updateBetweenZero(blockIdx);
		} else {
			buildBetween(layer, lBound, rBound, betweenOffs);
		}
		update(layer+1, l, r, betweenOffs, x);
	}
	
	inline SqrtTreeItem query(int l, int r, int betweenOffs, int base) {
		if (l == r) {
			return v[l];
		}
		if (l + 1 == r) {
			return op(v[l], v[r]);
		}
		int layer = onLayer[clz[(l - base) ^ (r - base)]];
		int bSzLog = (layers[layer]+1) >> 1;
		int bCntLog = layers[layer] >> 1;
		int lBound = (((l - base) >> layers[layer]) << layers[layer]) + base;
		int lBlock = ((l - lBound) >> bSzLog) + 1;
		int rBlock = ((r - lBound) >> bSzLog) - 1;
		SqrtTreeItem ans = suf[layer][l];
		if (lBlock <= rBlock) {
			SqrtTreeItem add = (layer == 0) ? (
				query(n + lBlock, n + rBlock, (1 << lg) - n, n)
			) : (
				between[layer-1][betweenOffs + lBound + (lBlock << bCntLog) + rBlock]
			);
			ans = op(ans, add);
		}
		ans = op(ans, pref[layer][r]);
		return ans;
	}
public:
	inline SqrtTreeItem query(int l, int r) {
		return query(l, r, 0, 0);
	}
	
	inline void update(int x, const SqrtTreeItem &item) {
		v[x] = item;
		update(0, 0, n, 0, x);
	}
	
	SqrtTree(const vector<SqrtTreeItem>& a)
		: n((int)a.size()), lg(log2Up(n)), v(a), clz(1 << lg), onLayer(lg+1) {
		clz[0] = 0;
		for (int i = 1; i < (int)clz.size(); i++) {
			clz[i] = clz[i >> 1] + 1;
		}
		int tlg = lg;
		while (tlg > 1) {
			onLayer[tlg] = (int)layers.size();
			layers.push_back(tlg);
			tlg = (tlg+1) >> 1;
		}
		for (int i = lg-1; i >= 0; i--) {
			onLayer[i] = max(onLayer[i], onLayer[i+1]);
		}
		int betweenLayers = max(0, (int)layers.size() - 1);
		int bSzLog = (lg+1) >> 1;
		int bSz = 1 << bSzLog;
		indexSz = (n + bSz - 1) >> bSzLog;
		v.resize(n + indexSz);
		pref.assign(layers.size(), vector<SqrtTreeItem>(n + indexSz));
		suf.assign(layers.size(), vector<SqrtTreeItem>(n + indexSz));
		between.assign(betweenLayers, vector<SqrtTreeItem>((1 << lg) + bSz));
		build(0, 0, n, 0);
	}
};

~~~~~

## Masalalar

[CodeChef — SEGPROD](https://www.codechef.com/NOV17/problems/SEGPROD)

