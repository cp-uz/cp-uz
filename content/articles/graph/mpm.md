---
article_id: graph--mpm
---
# Maksimal oqim — MPM algoritmi

MPM (Malhotra, Pramodh-Kumar va Maheshwari) algoritmi maksimal oqim masalasini $O(V^3)$ vaqtda yechadi. Bu algoritm [Dinic algoritmi](dinic.md)ga o‘xshaydi.

## Algoritm

Dinic algoritmi kabi MPM ham fazalarda ishlaydi; har bir fazada $G$ ning qoldiq tarmog‘i uchun qatlamli tarmoqdagi bloklovchi oqimni topamiz.
Dinic algoritmidan asosiy farqi — bloklovchi oqimni qanday topishimizda.
$L$ qatlamli tarmoqni ko‘ramiz.
Har bir tugun uchun uning _kirish potensiali_ va _chiqish potensiali_ni quyidagicha aniqlaymiz:

$$\begin{align}
p_{in}(v) &= \sum\limits_{(u, v)\in L}(c(u, v) - f(u, v)) \\
p_{out}(v) &= \sum\limits_{(v, u)\in L}(c(v, u) - f(v, u))
\end{align}$$

Shuningdek, $p_{in}(s) = p_{out}(t) = \infty$ deb olamiz.
$p_{in}$ va $p_{out}$ berilganda _potensial_ni $p(v) = \min(p_{in}(v), p_{out}(v))$ deb aniqlaymiz.
Agar $p(r) = \min\{p(v)\}$ bo‘lsa, $r$ tugunni _tayanch tugun_ deb ataymiz.
Biror $r$ tayanch tugunni ko‘ramiz.
Oqimni $p(r)$ ga shunday oshirish mumkinki, natijada $p(r)$ nolga teng bo‘ladi, deb da’vo qilamiz.
Bu to‘g‘ri, chunki $L$ asiklik: $r$ dan chiquvchi qirralar bo‘ylab oqimni sursak, u $t$ ga yetib boradi, negaki oqim yetib kelgan har bir tugunda uni tashqariga surish uchun yetarli chiqish potensiali mavjud.
Xuddi shunday, oqimni $s$ dan tortib kelishimiz mumkin.
Bloklovchi oqimni qurish shu faktga asoslanadi.
Har bir iteratsiyada tayanch tugunni topamiz va $s$ dan $t$ ga $r$ orqali oqim suramiz.
Bu jarayonni BFS bilan simulyatsiya qilish mumkin.
To‘liq to‘yingan barcha yoylarni $L$ dan olib tashlash mumkin, chunki ular ushbu fazada keyin boshqa ishlatilmaydi.
Xuddi shuningdek, $s$ va $t$ dan boshqa, kiruvchi yoki chiquvchi yoyi qolmagan barcha tugunlarni ham o‘chirish mumkin.
Har bir faza $O(V^2)$ vaqtda ishlaydi: ko‘pi bilan $V$ ta iteratsiya mavjud (chunki hech bo‘lmaganda tanlangan tayanch tugun o‘chiriladi) va har bir iteratsiyada o‘tilgan barcha qirralarni, ko‘pi bilan $V$ tasidan tashqari, o‘chiramiz.
Yig‘ib, $O(V^2 + E) = O(V^2)$ ni olamiz.
Fazalar soni $V$ dan kam bo‘lgani sababli (isbot [bu yerda](dinic.md)), MPM jami $O(V^3)$ vaqtda ishlaydi.

## Implementatsiya

```{.cpp file=mpm}
struct MPM{
    struct FlowEdge{
        int v, u;
        long long cap, flow;
        FlowEdge(){}
        FlowEdge(int _v, int _u, long long _cap, long long _flow)
            : v(_v), u(_u), cap(_cap), flow(_flow){}
        FlowEdge(int _v, int _u, long long _cap)
            : v(_v), u(_u), cap(_cap), flow(0ll){}
    };
    const long long flow_inf = 1e18;
    vector<FlowEdge> edges;
    vector<char> alive;
    vector<long long> pin, pout;
    vector<list<int> > in, out;
    vector<vector<int> > adj;
    vector<long long> ex;
    int n, m = 0;
    int s, t;
    vector<int> level;
    vector<int> q;
    int qh, qt;
    void resize(int _n){
        n = _n;
        ex.resize(n);
        q.resize(n);
        pin.resize(n);
        pout.resize(n);
        adj.resize(n);
        level.resize(n);
        in.resize(n);
        out.resize(n);
    }
    MPM(){}
    MPM(int _n, int _s, int _t){resize(_n); s = _s; t = _t;}
    void add_edge(int v, int u, long long cap){
        edges.push_back(FlowEdge(v, u, cap));
        edges.push_back(FlowEdge(u, v, 0));
        adj[v].push_back(m);
        adj[u].push_back(m + 1);
        m += 2;
    }
    bool bfs(){
        while(qh < qt){
            int v = q[qh++];
            for(int id : adj[v]){
                if(edges[id].cap - edges[id].flow < 1)continue;
                if(level[edges[id].u] != -1)continue;
                level[edges[id].u] = level[v] + 1;
                q[qt++] = edges[id].u;
            }
        }
        return level[t] != -1;
    }
    long long pot(int v){
        return min(pin[v], pout[v]);
    }
    void remove_node(int v){
        for(int i : in[v]){
            int u = edges[i].v;
            auto it = find(out[u].begin(), out[u].end(), i);
            out[u].erase(it);
            pout[u] -= edges[i].cap - edges[i].flow;
        }
        for(int i : out[v]){
            int u = edges[i].u;
            auto it = find(in[u].begin(), in[u].end(), i);
            in[u].erase(it);
            pin[u] -= edges[i].cap - edges[i].flow;
        }
    }
    void push(int from, int to, long long f, bool forw){
        qh = qt = 0;
        ex.assign(n, 0);
        ex[from] = f;
        q[qt++] = from;
        while(qh < qt){
            int v = q[qh++];
            if(v == to)
                break;
            long long must = ex[v];
            auto it = forw ? out[v].begin() : in[v].begin();
            while(true){
                int u = forw ? edges[*it].u : edges[*it].v;
                long long pushed = min(must, edges[*it].cap - edges[*it].flow);
                if(pushed == 0)break;
                if(forw){
                    pout[v] -= pushed;
                    pin[u] -= pushed;
                }
                else{
                    pin[v] -= pushed;
                    pout[u] -= pushed;
                }
                if(ex[u] == 0)
                    q[qt++] = u;
                ex[u] += pushed;
                edges[*it].flow += pushed;
                edges[(*it)^1].flow -= pushed;
                must -= pushed;
                if(edges[*it].cap - edges[*it].flow == 0){
                    auto jt = it;
                    ++jt;
                    if(forw){
                        in[u].erase(find(in[u].begin(), in[u].end(), *it));
                        out[v].erase(it);
                    }
                    else{
                        out[u].erase(find(out[u].begin(), out[u].end(), *it));
                        in[v].erase(it);
                    }
                    it = jt;
                }
                else break;
                if(!must)break;
            }
        }
    }
    long long flow(){
        long long ans = 0;
        while(true){
            pin.assign(n, 0);
            pout.assign(n, 0);
            level.assign(n, -1);
            alive.assign(n, true);
            level[s] = 0;
            qh = 0; qt = 1;
            q[0] = s;
            if(!bfs())
                break;
            for(int i = 0; i < n; i++){
                out[i].clear();
                in[i].clear();
            }
            for(int i = 0; i < m; i++){
                if(edges[i].cap - edges[i].flow == 0)
                    continue;
                int v = edges[i].v, u = edges[i].u;
                if(level[v] + 1 == level[u] && (level[u] < level[t] || u == t)){
                    in[u].push_back(i);
                    out[v].push_back(i);
                    pin[u] += edges[i].cap - edges[i].flow;
                    pout[v] += edges[i].cap - edges[i].flow;
                }
            }
            pin[s] = pout[t] = flow_inf;
            while(true){
                int v = -1;
                for(int i = 0; i < n; i++){
                    if(!alive[i])continue;
                    if(v == -1 || pot(i) < pot(v))
                        v = i;
                }
                if(v == -1)
                    break;
                if(pot(v) == 0){
                    alive[v] = false;
                    remove_node(v);
                    continue;
                }
                long long f = pot(v);
                ans += f;
                push(v, s, f, false);
                push(v, t, f, true);
                alive[v] = false;
                remove_node(v);
            }
        }
        return ans;
    }
};
```

