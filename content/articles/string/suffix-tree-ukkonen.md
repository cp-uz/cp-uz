---
article_id: string--suffix-tree-ukkonen
---
# Suffiks daraxti. Ukkonen algoritmi

*Ushbu maqola qoralama bo‘lib, algoritmning tavsifini o‘z ichiga olmaydi. Algoritm tavsifi uchun boshqa manbalarga, masalan, Dan Gusfieldning [Algorithms on Strings, Trees, and Sequences](https://www.cs.cmu.edu/afs/cs/project/pscico-guyb/realworld/www/slidesF06/cmuonly/gusfield.pdf) kitobiga murojaat qiling.*
Ushbu algoritm uzunligi $n$ bo‘lgan berilgan $s$ satr uchun suffiks daraxtini $O(n\log(k))$ vaqt ichida quradi, bu yerda $k$ — alifbo o‘lchami (agar $k$ o‘zgarmas deb hisoblansa, asimptotik murakkablik chiziqli bo‘ladi).

Algoritmga kirish sifatida $s$ satri va uning $n$ uzunligi beriladi; ular global o‘zgaruvchilar orqali uzatiladi.

Asosiy `build_tree` funksiyasi suffiks daraxtini quradi. Daraxt `node` strukturalari massivi ko‘rinishida saqlanadi, bunda `node[0]` daraxt ildizidir.
Kodni soddalashtirish uchun qirralar ham shu strukturalarda saqlanadi: har bir tugunning `node` strukturasi u bilan ota tuguni orasidagi qirra haqidagi ma’lumotni saqlaydi. Umuman olganda, har bir `node` quyidagi axborotni saqlaydi:

* `(l, r)` — ushbu tugunga olib boruvchi qirraga mos `s[l..r-1]` qism satrining chap va o‘ng chegaralari;
* `par` — ota tugun;
* `link` — suffiks havolasi;
* `next` — ushbu tugundan chiqadigan qirralar ro‘yxati.
```cpp
string s;
int n;

struct node {
	int l, r, par, link;
	map<char,int> next;

	node (int l=0, int r=0, int par=-1)
		: l(l), r(r), par(par), link(-1) {}
	int len()  {  return r - l;  }
	int &get (char c) {
		if (!next.count(c))  next[c] = -1;
		return next[c];
	}
};
node t[MAXN];
int sz;

struct state {
	int v, pos;
	state (int v, int pos) : v(v), pos(pos)  {}
};
state ptr (0, 0);

state go (state st, int l, int r) {
	while (l < r)
		if (st.pos == t[st.v].len()) {
			st = state (t[st.v].get( s[l] ), 0);
			if (st.v == -1)  return st;
		}
		else {
			if (s[ t[st.v].l + st.pos ] != s[l])
				return state (-1, -1);
			if (r-l < t[st.v].len() - st.pos)
				return state (st.v, st.pos + r-l);
			l += t[st.v].len() - st.pos;
			st.pos = t[st.v].len();
		}
	return st;
}

int split (state st) {
	if (st.pos == t[st.v].len())
		return st.v;
	if (st.pos == 0)
		return t[st.v].par;
	node v = t[st.v];
	int id = sz++;
	t[id] = node (v.l, v.l+st.pos, v.par);
	t[v.par].get( s[v.l] ) = id;
	t[id].get( s[v.l+st.pos] ) = st.v;
	t[st.v].par = id;
	t[st.v].l += st.pos;
	return id;
}

int get_link (int v) {
	if (t[v].link != -1)  return t[v].link;
	if (t[v].par == -1)  return 0;
	int to = get_link (t[v].par);
	return t[v].link = split (go (state(to,t[to].len()), t[v].l + (t[v].par==0), t[v].r));
}

void tree_extend (int pos) {
	for(;;) {
		state nptr = go (ptr, pos, pos+1);
		if (nptr.v != -1) {
			ptr = nptr;
			return;
		}

		int mid = split (ptr);
		int leaf = sz++;
		t[leaf] = node (pos, n, mid);
		t[mid].get( s[pos] ) = leaf;

		ptr.v = get_link (mid);
		ptr.pos = t[ptr.v].len();
		if (!mid)  break;
	}
}

void build_tree() {
	sz = 1;
	for (int i=0; i<n; ++i)
		tree_extend (i);
}
```
## Siqilgan implementatsiya

Ushbu siqilgan implementatsiyani [freopen](http://codeforces.com/profile/freopen) taklif qilgan.
```cpp
const int N=1000000,INF=1000000000;
string a;
int t[N][26],l[N],r[N],p[N],s[N],tv,tp,ts,la;

void ukkadd (int c) {
	suff:;
	if (r[tv]<tp) {
		if (t[tv][c]==-1) { t[tv][c]=ts;  l[ts]=la;
			p[ts++]=tv;  tv=s[tv];  tp=r[tv]+1;  goto suff; }
		tv=t[tv][c]; tp=l[tv];
	}
	if (tp==-1 || c==a[tp]-'a') tp++; else {
		l[ts+1]=la;  p[ts+1]=ts;
		l[ts]=l[tv];  r[ts]=tp-1;  p[ts]=p[tv];  t[ts][c]=ts+1;  t[ts][a[tp]-'a']=tv;
		l[tv]=tp;  p[tv]=ts;  t[p[ts]][a[l[ts]]-'a']=ts;  ts+=2;
		tv=s[p[ts-2]];  tp=l[ts-2];
		while (tp<=r[ts-2]) {  tv=t[tv][a[tp]-'a'];  tp+=r[tv]-l[tv]+1;}
		if (tp==r[ts-2]+1)  s[ts-2]=tv;  else s[ts-2]=ts;
		tp=r[tv]-(tp-r[ts-2])+2;  goto suff;
	}
}

void build() {
	ts=2;
	tv=0;
	tp=0;
	fill(r,r+N,(int)a.size()-1);
	s[0]=1;
	l[0]=-1;
	r[0]=-1;
	l[1]=-1;
	r[1]=-1;
	memset (t, -1, sizeof t);
	fill(t[1],t[1]+26,0);
	for (la=0; la<(int)a.size(); ++la)
		ukkadd (a[la]-'a');
}
```
Izohlar qo‘shilgan ayni kod:
```cpp
const int N=1000000,    // maximum possible number of nodes in suffix tree
	INF=1000000000; // infinity constant
string a;       // input string for which the suffix tree is being built
int t[N][26],   // array of transitions (state, letter)
	l[N],   // left...
	r[N],   // ...and right boundaries of the substring of a which correspond to incoming edge
	p[N],   // parent of the node
	s[N],   // suffix link
	tv,     // the node of the current suffix (if we're mid-edge, the lower node of the edge)
	tp,     // position in the string which corresponds to the position on the edge (between l[tv] and r[tv], inclusive)
	ts,     // the number of nodes
	la;     // the current character in the string

void ukkadd(int c) { // add character s to the tree
	suff:;      // we'll return here after each transition to the suffix (and will add character again)
	if (r[tv]<tp) { // check whether we're still within the boundaries of the current edge
		// if we're not, find the next edge. If it doesn't exist, create a leaf and add it to the tree
		if (t[tv][c]==-1) {t[tv][c]=ts;l[ts]=la;p[ts++]=tv;tv=s[tv];tp=r[tv]+1;goto suff;}
		tv=t[tv][c];tp=l[tv];
	} // otherwise just proceed to the next edge
	if (tp==-1 || c==a[tp]-'a')
		tp++; // if the letter on the edge equal c, go down that edge
	else {
		// otherwise split the edge in two with middle in node ts
		l[ts]=l[tv];r[ts]=tp-1;p[ts]=p[tv];t[ts][a[tp]-'a']=tv;
		// add leaf ts+1. It corresponds to transition through c.
		t[ts][c]=ts+1;l[ts+1]=la;p[ts+1]=ts;
		// update info for the current node - remember to mark ts as parent of tv
		l[tv]=tp;p[tv]=ts;t[p[ts]][a[l[ts]]-'a']=ts;ts+=2;
		// prepare for descent
		// tp will mark where are we in the current suffix
		tv=s[p[ts-2]];tp=l[ts-2];
		// while the current suffix is not over, descend
		while (tp<=r[ts-2]) {tv=t[tv][a[tp]-'a'];tp+=r[tv]-l[tv]+1;}
		// if we're in a node, add a suffix link to it, otherwise add the link to ts
		// (we'll create ts on next iteration).
		if (tp==r[ts-2]+1) s[ts-2]=tv; else s[ts-2]=ts;
		// add tp to the new edge and return to add letter to suffix
		tp=r[tv]-(tp-r[ts-2])+2;goto suff;
	}
}

void build() {
	ts=2;
	tv=0;
	tp=0;
	fill(r,r+N,(int)a.size()-1);
	// initialize data for the root of the tree
	s[0]=1;
	l[0]=-1;
	r[0]=-1;
	l[1]=-1;
	r[1]=-1;
	memset (t, -1, sizeof t);
	fill(t[1],t[1]+26,0);
	// add the text to the tree, letter by letter
	for (la=0; la<(int)a.size(); ++la)
		ukkadd (a[la]-'a');
}
```
## Amaliy masalalar

* [UVA 10679 - I Love Strings!!!](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1620)

