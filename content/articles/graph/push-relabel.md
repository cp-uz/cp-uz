---
article_id: graph--push-relabel
---
# Maksimal oqim — push–relabel algoritmi

Push–relabel algoritmi (preflow–push algoritmi nomi bilan ham tanilgan) oqim tarmog‘idagi maksimal oqimni hisoblash algoritmidir.

Yechmoqchi bo‘lgan masalaning aniq ta’rifini [Maksimal oqim — Ford–Fulkerson va Edmonds–Karp](edmonds_karp.md) maqolasidan topish mumkin.

Ushbu maqolada masalani tarmoq bo‘ylab dastlabki oqimni (`preflow`) surish orqali yechishni ko‘rib chiqamiz; bu $O(V^4)$, aniqrog‘i $O(V^2 E)$ vaqtda ishlaydi.

Algoritm Andrew Goldberg va Robert Tarjan tomonidan 1985-yilda ishlab chiqilgan.

## Ta’riflar

Algoritm davomida **dastlabki oqim** (`preflow`) bilan ishlashimiz kerak bo‘ladi — bu oqim funksiyasiga o‘xshash $f$ funksiya, ammo u oqim saqlanishi cheklovini bajarishi shart emas.

U faqat quyidagi cheklovlarni qanoatlantirishi kerak:

$$0 \le f(e) \le c(e)$$

va

$$\sum_{(v, u) \in E} f((v, u)) \ge \sum_{(u, v) \in E} f((u, v))$$

Demak, ayrim tugun olgan oqim miqdori tarqatgan oqim miqdoridan ko‘proq bo‘lishi mumkin.

Bunday tugunda ortiqcha oqim mavjud deymiz va uning miqdorini **ortiqcha** funksiyasi orqali aniqlaymiz: $x(u) =\sum_{(v, u) \in E} f((v, u)) - \sum_{(u, v) \in E} f((u, v))$.

Oqim funksiyasidagi kabi, dastlabki oqim funksiyasi bilan ham qoldiq sig‘imlar va qoldiq grafni aniqlash mumkin.

Algoritm boshlang‘ich dastlabki oqimdan (ayrim tugunlarda ortiqcha oqim bo‘ladi) boshlaydi va bajarilish davomida bu dastlabki oqim qayta ishlanib, o‘zgartiriladi.

Oldindan ayrim tafsilotlarni aytsak, algoritm ortiqcha oqimli tugunni tanlaydi va ortiqchani qo‘shni tugunlarga suradi.

Bu amal manba va qabul qiluvchidan boshqa barcha tugunlarda ortiqcha oqim qolmaguncha takrorlanadi.

Ortiqcha oqimsiz dastlabki oqim yaroqli oqim ekanini ko‘rish oson.

Shu sababli algoritm haqiqiy oqim bilan tugaydi.

Biroq hali hal qilishimiz kerak bo‘lgan ikkita muammo bor.

Birinchidan, jarayon albatta tugashini qanday kafolatlaymiz?

Ikkinchidan, u shunchaki ixtiyoriy oqim emas, aynan maksimal oqim berishini qanday kafolatlaymiz?

Bu muammolarni hal qilish uchun har bir tugunga butun son biriktiradigan **belgilash** funksiyasi $h$ dan, ko‘pincha **balandlik** funksiyasi deb ham ataladigan funksiyadan foydalanamiz.

Agar $h(s) = |V|$, $h(t) = 0$ va qoldiq grafda $(u, v)$ qirra mavjud bo‘lganda — ya’ni $(u, v)$ qirraning qoldiq sig‘imi musbat bo‘lganda — $h(u) \le h(v) + 1$ bo‘lsa, belgilashni yaroqli deymiz.

Boshqacha aytganda, $u$ dan $v$ ga oqimni oshirish mumkin bo‘lsa, $v$ ning balandligi $u$ nikidan ko‘pi bilan birga kichik bo‘lishi mumkin, ammo unga teng yoki undan katta ham bo‘lishi mumkin.

Agar yaroqli belgilash funksiyasi mavjud bo‘lsa, qoldiq grafda $s$ dan $t$ gacha oshiruvchi yo‘l mavjud bo‘lmasligini qayd etish muhim.

Chunki bunday yo‘lning uzunligi ko‘pi bilan $|V| - 1$ ta qirra bo‘ladi va har bir qirra balandlikni ko‘pi bilan birga kamaytirishi mumkin; birinchi balandlik $h(s) = |V|$, oxirgisi $h(t) = 0$ bo‘lsa, buning imkoni yo‘q.

Ushbu belgilash funksiyasi yordamida push–relabel algoritmining strategiyasini ifodalash mumkin:

Yaroqli dastlabki oqim va yaroqli belgilash funksiyasidan boshlaymiz.

Har bir qadamda tugunlar orasida ortiqcha oqimning bir qismini suramiz va tugunlarning belgilarini yangilaymiz.

Har qadamdan keyin dastlabki oqim ham, belgilash ham yaroqli bo‘lib qolishini ta’minlashimiz kerak.

Algoritm tugaganida dastlabki oqim yaroqli oqim bo‘ladi.

Yaroqli belgilash ham mavjud bo‘lgani sababli qoldiq grafda $s$ bilan $t$ orasida yo‘l yo‘q; demak, oqim aslida maksimal oqimdir.

Ford–Fulkerson algoritmini push–relabel algoritmi bilan solishtirsak, ular bir-birining duali kabi ko‘rinadi.

Ford–Fulkerson algoritmi har doim yaroqli oqimni saqlab, oshiruvchi yo‘l qolmaguncha uni yaxshilaydi; push–relabel algoritmida esa hech qachon oshiruvchi yo‘l mavjud bo‘lmaydi va dastlabki oqim yaroqli oqimga aylanguncha uni yaxshilaymiz.

## Algoritm

Avval graf uchun yaroqli dastlabki oqim va belgilash funksiyasini boshlang‘ich holatga keltirishimiz kerak.

Ford–Fulkerson algoritmidagi kabi bo‘sh dastlabki oqimdan foydalanib bo‘lmaydi, chunki u holda oshiruvchi yo‘l mavjud bo‘ladi va bu yaroqli belgilash mavjud emasligini anglatadi.

Shuning uchun $s$ dan chiquvchi har bir qirrani maksimal sig‘imigacha to‘ldiramiz: $f((s, u)) = c((s, u))$.

Boshqa barcha qirralar oqimini nolga tenglaymiz.

Bu holatda yaroqli belgilash mavjud: manba uchun $h(s) = |V|$, boshqa barcha tugunlar uchun $h(u) = 0$.

Endi ikki amalni batafsilroq tavsiflaymiz.

`push` amali bilan $u$ tugundagi imkon qadar katta ortiqcha oqimni qo‘shni $v$ tugunga surishga harakat qilamiz.

Bitta qoida bor: $u$ dan $v$ ga faqat $h(u) = h(v) + 1$ bo‘lganda oqim surish mumkin.

Oddiy tilda, ortiqcha oqim pastga oqishi kerak, ammo juda tik tushmasligi kerak.

Albatta, faqat $\min(x(u), c((u, v)) - f((u, v)))$ miqdordagi oqimni surish mumkin.

Agar tugunda ortiqcha oqim bo‘lsa-yu, uni hech bir qo‘shni tugunga surishning imkoni bo‘lmasa, shu tugunning balandligini oshirishimiz kerak.

Bu amal `relabel` deb ataladi.

Belgilanganning yaroqliligini saqlagan holda balandlikni imkon qadar ko‘p oshiramiz.

Qisqacha, algoritm quyidagicha:

Yaroqli dastlabki oqim va yaroqli belgilashni boshlang‘ich holatga keltiramiz.

`push` yoki `relabel` amallaridan birini bajarish mumkin ekan, uni bajaramiz.

Shundan keyin dastlabki oqim haqiqiy oqimga aylanadi va uni qaytaramiz.

## Murakkablik

Tugun belgisining maksimal qiymati $2|V| - 1$ ekanini oson ko‘rsatish mumkin.

Bu paytda qolgan barcha ortiqcha oqim manbaga qaytarilishi mumkin va qaytariladi.

Bu ko‘pi bilan $O(V^2)$ ta `relabel` amalini beradi.

Shuningdek, ko‘pi bilan $O(V E)$ ta to‘yintiruvchi surish (qirraning butun sig‘imi ishlatiladigan `push`) va ko‘pi bilan $O(V^2 E)$ ta to‘yintirmaydigan surish (qirraning sig‘imi to‘liq ishlatilmaydigan `push`) bajarilishini ko‘rsatish mumkin.

Keyingi ortiqcha oqimli tugunni $O(1)$ vaqtda topishga imkon beradigan ma’lumotlar tuzilmasini tanlasak, algoritmning umumiy murakkabligi $O(V^2 E)$ bo‘ladi.

## Implementatsiya

```{.cpp file=push_relabel}
const int inf = 1000000000;

int n;
vector<vector<int>> capacity, flow;
vector<int> height, excess, seen;
queue<int> excess_vertices;

void push(int u, int v) {
    int d = min(excess[u], capacity[u][v] - flow[u][v]);
    flow[u][v] += d;
    flow[v][u] -= d;
    excess[u] -= d;
    excess[v] += d;
    if (d && excess[v] == d)
        excess_vertices.push(v);
}
void relabel(int u) {
    int d = inf;
    for (int i = 0; i < n; i++) {
        if (capacity[u][i] - flow[u][i] > 0)
            d = min(d, height[i]);
    }
    if (d < inf)
        height[u] = d + 1;
}
void discharge(int u) {
    while (excess[u] > 0) {
        if (seen[u] < n) {
            int v = seen[u];
            if (capacity[u][v] - flow[u][v] > 0 && height[u] > height[v])
                push(u, v);
            else
                seen[u]++;
        } else {
            relabel(u);
            seen[u] = 0;
        }
    }
}
int max_flow(int s, int t) {
    height.assign(n, 0);
    height[s] = n;
    flow.assign(n, vector<int>(n, 0));
    excess.assign(n, 0);
    excess[s] = inf;
    for (int i = 0; i < n; i++) {
    	if (i != s)
	        push(s, i);
    }
    seen.assign(n, 0);

    while (!excess_vertices.empty()) {
        int u = excess_vertices.front();
        excess_vertices.pop();
        if (u != s && u != t)
            discharge(u);
    }
    int max_flow = 0;
    for (int i = 0; i < n; i++)
        max_flow += flow[i][t];
    return max_flow;
}
```

Bu yerda ayni vaqtda ortiqcha oqimga ega barcha tugunlarni saqlash uchun `excess_vertices` navbatidan foydalanamiz.

Shu yo‘l bilan keyingi `push` yoki `relabel` amali bajariladigan tugunni o‘zgarmas vaqtda tanlash mumkin.

Oqim surish mumkin bo‘lgan qo‘shni tugunni qidirishga ortiqcha vaqt sarflamaslik uchun **joriy qirra** (`current-arc`) deb ataluvchi ma’lumotlar tuzilmasidan foydalanamiz.

Aslida qirralarni siklik tartibda ko‘rib chiqamiz va oxirgi ishlatilgan qirrani doimo saqlaymiz.

Shu tariqa, ma’lum bir belgilash qiymati uchun joriy qirrani faqat $O(n)$ marta almashtiramiz.

`relabel` amalining o‘zi ham $O(n)$ vaqt olgani sababli, bu umumiy murakkablikni yomonlashtirmaydi.

