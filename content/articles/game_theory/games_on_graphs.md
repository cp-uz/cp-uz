---
article_id: game_theory--games_on_graphs
---
# Ixtiyoriy graflardagi o‘yinlar

Ikkita o‘yinchi ixtiyoriy $G$ grafida o‘yin o‘ynasin.
Ya’ni o‘yinning joriy holati grafning ma’lum bir tuguni bilan ifodalanadi.
O‘yinchilar navbat bilan yurish qiladi va joriy tugundan uni qo‘shni tugun bilan bog‘lovchi qirra orqali o‘tadi.
O‘yin qoidasiga qarab, yurish qila olmay qolgan o‘yinchi yutqazishi yoki yutishi mumkin.
Biz eng umumiy holatni — sikllarga ega ixtiyoriy yo‘naltirilgan grafni — ko‘rib chiqamiz.
Boshlang‘ich holat berilganda, ikkala o‘yinchi ham optimal strategiya bilan o‘ynasa kim yutishini yoki o‘yin durang bilan tugashini aniqlashimiz kerak.

Bu masalani juda samarali yechamiz.
Grafning barcha mumkin bo‘lgan boshlang‘ich tugunlari uchun javobni qirralar soniga nisbatan chiziqli, ya’ni $O(m)$ vaqtda topamiz.

## Algoritm tavsifi

Agar biror tugundan boshlagan o‘yinchi, raqibi qanday yurish qilishidan qat’i nazar, optimal o‘ynab yuta olsa, bu tugunni **yutuvchi tugun** deb ataymiz.
Xuddi shunday, agar biror tugundan boshlagan o‘yinchi raqibi optimal o‘ynaganda yutqazsa, bu tugunni **yutqazuvchi tugun** deb ataymiz.

Grafdagi ayrim tugunlarning yutuvchi yoki yutqazuvchi ekanini oldindan bilamiz: xususan, chiqish qirrasi bo‘lmagan barcha tugunlarning yutuvchi yoki yutqazuvchi ekani oldindan ma’lum.
Shuningdek, quyidagi **qoidalar** o‘rinli:

- agar tugundan yutqazuvchi tugunga olib boradigan kamida bitta chiqish qirrasi bo‘lsa, tugunning o‘zi yutuvchi;
- agar ma’lum bir tugunning barcha chiqish qirralari yutuvchi tugunlarga olib borsa, tugunning o‘zi yutqazuvchi;
- agar jarayon oxirida hali aniqlanmagan tugunlar qolsa va ularning hech biri birinchi yoki ikkinchi qoidaga mos kelmasa, optimal o‘yinda ularning har biridan boshlangan o‘yin durang bilan tugaydi.

Shu qoidalarning o‘zidan darhol $O(nm)$ vaqtda ishlaydigan algoritm tuzish mumkin: barcha tugunlarni ko‘rib chiqib, birinchi yoki ikkinchi qoidani qo‘llashga urinib, bu jarayonni takrorlaymiz.

Ammo jarayonni tezlashtirib, murakkablikni $O(m)$ gacha tushirish mumkin.
Dastlab yutuvchi yoki yutqazuvchi ekani ma’lum bo‘lgan barcha tugunlarni ko‘rib chiqamiz.
Ularning har biridan [chuqurlik bo‘yicha qidiruv](../graph/depth-first-search.md) boshlaymiz.
Bu DFS teskari yo‘nalishdagi qirralar bo‘ylab yuradi.
Avvalo, u yutuvchi yoki yutqazuvchi deb allaqachon belgilangan tugunlarga qayta kirmaydi.
Bundan tashqari, qidiruv yutqazuvchi tugundan hali aniqlanmagan tugunga teskari qirra bo‘ylab o‘tsa, bu tugunni yutuvchi deb belgilaymiz va DFSni shu yangi tugundan davom ettiramiz.

Agar yutuvchi tugundan hali aniqlanmagan tugunga o‘tsak, undan chiquvchi barcha qirralar yutuvchi tugunlarga olib borishini tekshirishimiz kerak.
Har bir tugun uchun yutuvchi tugunlarga olib boradigan qirralar sonini saqlab, bu tekshiruvni $O(1)$ vaqtda bajarish mumkin.
Demak, yutuvchi tugundan aniqlanmagan tugunga o‘tganda hisoblagichni oshiramiz va uning qiymati tugunning chiqish darajasiga teng bo‘lganini tekshiramiz.
Agar teng bo‘lsa, bu tugunni yutqazuvchi deb belgilaymiz va DFSni undan davom ettiramiz.
Aks holda tugunning yutuvchi yoki yutqazuvchi ekanini hali bilmaymiz, shuning uchun undan DFSni davom ettirishning ma’nosi yo‘q.

Jami har bir yutuvchi va har bir yutqazuvchi tugunga aynan bir marta tashrif buyuramiz; aniqlanmagan tugunlarga tashrif buyurilmaydi. Har bir qirra ham ko‘pi bilan bir marta ko‘rib chiqiladi.
Shunday qilib, murakkablik $O(m)$ ga teng.

## Implementatsiya

Quyida shu DFSning implementatsiyasi keltirilgan.
`adj_rev` o‘zgaruvchisi grafning qo‘shnilik ro‘yxatini **teskari** ko‘rinishda saqlaydi, deb faraz qilamiz: grafning $(i, j)$ qirrasini saqlash o‘rniga $(j, i)$ qirrasini saqlaymiz.
Har bir tugunning chiqish darajasi ham oldindan hisoblangan deb olamiz.

```cpp
vector<vector<int>> adj_rev;

vector<bool> winning;
vector<bool> losing;
vector<bool> visited;
vector<int> degree;
void dfs(int v) {
    visited[v] = true;
    for (int u : adj_rev[v]) {
        if (!visited[u]) {
            if (losing[v])
                winning[u] = true;
            else if (--degree[u] == 0)
                losing[u] = true;
            else
                continue;
            dfs(u);
        }
    }
}
```

## Misol: “Politsiyachi va o‘g‘ri”

Quyida bunday o‘yinning aniq bir misoli keltirilgan.
O‘lchami $m \times n$ bo‘lgan taxta mavjud.
Ayrim kataklarga kirib bo‘lmaydi.
Politsiyachi va o‘g‘rining boshlang‘ich koordinatalari ma’lum.
Kataklardan biri chiqish hisoblanadi.
Agar biror payt politsiyachi va o‘g‘ri bir katakda tursa, politsiyachi yutadi.
Agar o‘g‘ri chiqish katagiga yetib borsa va politsiyachi ayni katakda bo‘lmasa, o‘g‘ri yutadi.
Politsiyachi sakkiz yo‘nalishning barchasida, o‘g‘ri esa faqat to‘rtta yo‘nalishda — koordinata o‘qlari bo‘ylab — yura oladi.
Politsiyachi va o‘g‘ri navbatma-navbat yuradi.
Biroq ular istasa o‘z navbatini o‘tkazib yuborishi ham mumkin.
Birinchi yurishni politsiyachi qiladi.

Endi **grafni quramiz**.
Buning uchun o‘yin qoidalarini formal ko‘rinishga keltirishimiz kerak.
O‘yinning joriy holati politsiyachining $P$ koordinatasi, o‘g‘rining $T$ koordinatasi va yurish kimga tegishli ekani bilan aniqlanadi. Oxirgi o‘zgaruvchini $P_{\text{turn}}$ deb ataymiz; u politsiyachining navbati bo‘lsa `true` qiymatga ega.
Demak, graf tuguni $(P, T, P_{\text{turn}})$ uchligi bilan aniqlanadi.
Shundan so‘ng grafni o‘yin qoidalariga bevosita amal qilish orqali osongina qurish mumkin.

Keyin dastlab qaysi tugunlar yutuvchi, qaysilari yutqazuvchi ekanini aniqlashimiz kerak.
Bu yerda **nozik jihat** bor.
Tugunning yutuvchi yoki yutqazuvchi bo‘lishi koordinatalardan tashqari $P_{\text{turn}}$ ga, ya’ni navbat kimga tegishli ekaniga ham bog‘liq.
Agar politsiyachining navbati bo‘lsa, politsiyachi va o‘g‘ri koordinatalari teng bo‘lgan tugun yutuvchi; agar tugun yutuvchi bo‘lmasa va o‘g‘ri chiqish katagida turgan bo‘lsa, u yutqazuvchi.
Agar o‘g‘rining navbati bo‘lsa, ikki o‘yinchining koordinatalari teng bo‘lgan tugun yutqazuvchi; agar tugun yutqazuvchi bo‘lmasa va o‘g‘ri chiqish katagida turgan bo‘lsa, u yutuvchi.

Implementatsiyadan oldin grafni **ochiqdan-ochiq** to‘liq qurish yoki kerakli qirralarni **jarayon davomida** yaratish usulidan birini tanlash kerak.
Bir tomondan, grafni to‘liq qurish ancha sodda va xato qilish ehtimoli kamroq.
Boshqa tomondan, kod hajmi ortadi va ishlash vaqti qirralarni jarayon davomida yaratish usuliga qaraganda sekinroq bo‘ladi.

Quyidagi implementatsiya grafni to‘liq quradi:

```cpp
struct State {
    int P, T;
    bool Pstep;
};

vector<State> adj_rev[100][100][2]; // [P][T][Pstep]
bool winning[100][100][2];
bool losing[100][100][2];
bool visited[100][100][2];
int degree[100][100][2];
void dfs(State v) {
    visited[v.P][v.T][v.Pstep] = true;
    for (State u : adj_rev[v.P][v.T][v.Pstep]) {
        if (!visited[u.P][u.T][u.Pstep]) {
            if (losing[v.P][v.T][v.Pstep])
                winning[u.P][u.T][u.Pstep] = true;
            else if (--degree[u.P][u.T][u.Pstep] == 0)
                losing[u.P][u.T][u.Pstep] = true;
            else
                continue;
            dfs(u);
        }
    }
}
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];
    for (int P = 0; P < n*m; P++) {
        for (int T = 0; T < n*m; T++) {
            for (int Pstep = 0; Pstep <= 1; Pstep++) {
                int Px = P/m, Py = P%m, Tx = T/m, Ty = T%m;
                if (a[Px][Py]=='*' || a[Tx][Ty]=='*')
                    continue;

                bool& win = winning[P][T][Pstep];
                bool& lose = losing[P][T][Pstep];
                if (Pstep) {
                    win = Px==Tx && Py==Ty;
                    lose = !win && a[Tx][Ty] == 'E';
                } else {
                    lose = Px==Tx && Py==Ty;
                    win = !lose && a[Tx][Ty] == 'E';
                }
                if (win || lose)
                    continue;
                State st = {P,T,!Pstep};
                adj_rev[P][T][Pstep].push_back(st);
                st.Pstep = Pstep;
                degree[P][T][Pstep]++;

                const int dx[] = {-1, 0, 1, 0, -1, -1, 1, 1};
                const int dy[] = {0, 1, 0, -1, -1, 1, -1, 1};
                for (int d = 0; d < (Pstep ? 8 : 4); d++) {
                    int PPx = Px, PPy = Py, TTx = Tx, TTy = Ty;
                    if (Pstep) {
                        PPx += dx[d];
                        PPy += dy[d];
                    } else {
                        TTx += dx[d];
                        TTy += dy[d];
                    }
                    if (PPx >= 0 && PPx < n && PPy >= 0 && PPy < m && a[PPx][PPy] != '*' &&
                        TTx >= 0 && TTx < n && TTy >= 0 && TTy < m && a[TTx][TTy] != '*')
                    {
                        adj_rev[PPx*m+PPy][TTx*m+TTy][!Pstep].push_back(st);
                        ++degree[P][T][Pstep];
                    }
                }
            }
        }
    }
    for (int P = 0; P < n*m; P++) {
        for (int T = 0; T < n*m; T++) {
            for (int Pstep = 0; Pstep <= 1; Pstep++) {
                if ((winning[P][T][Pstep] || losing[P][T][Pstep]) && !visited[P][T][Pstep])
                    dfs({P, T, (bool)Pstep});
            }
        }
    }
    int P_st, T_st;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (a[i][j] == 'P')
                P_st = i*m+j;
            else if (a[i][j] == 'T')
                T_st = i*m+j;
        }
    }

    if (winning[P_st][T_st][true]) {
        cout << "Police catches the thief"  << endl;
    } else if (losing[P_st][T_st][true]) {
        cout << "The thief escapes" << endl;
    } else {
        cout << "Draw" << endl;
    }
}
```

