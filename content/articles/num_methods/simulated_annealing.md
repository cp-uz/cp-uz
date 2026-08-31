---
article_id: num_methods--simulated_annealing
---
# Simulyatsiyalangan toblash

**Simulyatsiyalangan toblash** (Simulated Annealing, SA) — funksiyaning global optimumiga yaqin yechim izlaydigan tasodifiy algoritm. Qidiruvda tasodifiylik ishlatilgani uchun ayni kirishda turli ishga tushirishlar turli javob berishi mumkin.

## Masala modeli

Har bir $s$ holat uchun energiyani hisoblaydigan $E(s)$ funksiya berilgan. Maqsad

$$s_{best}=\arg\min_s E(s)$$

holatni topish. SA holatlar diskret, qidiruv fazosi juda katta va $E(s)$ ko‘plab mahalliy minimumlarga ega masalalarda ayniqsa foydali. U aniq global optimumni kafolatlamaydi, ammo yaxshi modellashtirilsa vaqt chegarasi ichida sifatli yaqinlashuv topishi mumkin.

### Misol: kommivoyajer masalasi

[Kommivoyajer masalasida](https://en.wikipedia.org/wiki/Travelling_salesman_problem) tekislikda koordinatalari bilan berilgan nuqtalar mavjud. Barcha nuqtalarga bir marta tashrif buyurib, boshlang‘ich nuqtaga qaytadigan eng qisqa tartibni topish kerak. Bu yerda:

- holat — nuqtalarning biror permutatsiyasi;
- $E(s)$ — shu tartibda qurilgan yopiq yo‘l uzunligi;
- qo‘shni holat — masalan, ikkita nuqtaning o‘rnini almashtirish orqali olingan yangi permutatsiya.

## Fizik o‘xshatish

Metallurgiyadagi toblash jarayonida material qizdirilib, asta sovitiladi. Yuqori harorat atomlarga hozirgi past energiyali tuzilishdan chiqib, vaqtincha yuqoriroq energiyali holatlardan o‘tishga imkon beradi. Sekin sovish davomida ular ichki energiyasi yanada kichik tuzilishga joylashishi mumkin.

SA shu jarayonni modellashtiradi. Algoritm tasodifiy holat va yuqori temperatura bilan boshlanadi. Yuqori temperaturada energiyasi yomonroq qo‘shni holatlar ham qabul qilinadi; bu qidiruvni mahalliy minimumdan chiqaradi. Temperatura pasaygani sari bunday o‘tish ehtimoli kamayadi va qidiruv topilgan yaxshi minimum atrofida jamlanadi.

![Ko‘p mahalliy optimumli funksiyada simulyatsiyalangan toblash](https://upload.wikimedia.org/wikipedia/commons/d/d5/Hill_Climbing_with_Simulated_Annealing.gif)

## Asosiy tushunchalar

### Energiya funksiyasi

$E(s)$ minimallashtiriladigan maqsad funksiyasidir. Maksimallashtirish masalasini $E(s)=-F(s)$ qilib minimallashtirishga aylantirish mumkin. Energiya tez hisoblanishi juda muhim; imkon bo‘lsa, qo‘shni holat energiyasi butun holatni qayta sanamasdan, faqat o‘zgargan qismlar orqali yangilanadi.

### Holat va qo‘shnichilik

Holatlar fazosi $E$ funksiyaning aniqlanish sohasidir. Qo‘shni holat joriy holatdan sodda lokal o‘zgarish bilan olinadi. Qo‘shnichilik juda tor bo‘lsa qidiruv sekin yuradi, juda keskin bo‘lsa yaxshi hudud atrofida barqarorlashish qiyinlashadi. Kommivoyajerda ikki nuqtani almashtirish, kesmani teskari aylantirish (`2-opt`) yoki nuqtani boshqa joyga ko‘chirish keng tarqalgan variantlardir.

### Temperatura va sovish

$T$ temperatura yomonroq holatni qabul qilishga tayyorlikni bildiradi. $u$ esa sovish koeffitsiyenti:

$$T\leftarrow T\cdot u,\qquad 0<u<1.$$

$u$ birga qancha yaqin bo‘lsa, sovish shuncha sekin va iteratsiyalar soni ko‘proq bo‘ladi. Sekin sovish odatda yechim sifatini oshiradi, ammo ko‘proq vaqt talab qiladi.

## Qabul qilish ehtimoli

Joriy energiya $E$, qo‘shni energiya $E_{next}$ bo‘lsin. Yaxshiroq holat, ya’ni $E_{next}<E$, doim qabul qilinadi. Yomonroq holat esa

$$p=\exp\left(-\frac{E_{next}-E}{T}\right)$$

ehtimol bilan qabul qilinadi. Bu ehtimol [Gibbs taqsimoti](https://en.wikipedia.org/wiki/Gibbs_measure) bilan bog‘liq. $\mathcal U_{[0,1]}$ bir jinsli tasodifiy son bo‘lsa, o‘tish $\mathcal U_{[0,1]}\le p$ bo‘lganda amalga oshadi. Temperatura katta bo‘lsa $p$ birga yaqin; temperatura tushganda ayni energiya yo‘qotishining qabul qilinish ehtimoli kichrayadi.

```cpp
bool accept(double energy, double next_energy, double temperature,
            mt19937& rng) {
    if (next_energy < energy)
        return true;

    double probability = exp(-(next_energy - energy) / temperature);
    bernoulli_distribution take(probability);
    return take(rng);
}
```

Generator havola bo‘yicha uzatiladi; aks holda har chaqiruv generator nusxasining bir xil boshlang‘ich holatidan foydalanishi mumkin.

## Algoritm

1. Boshlang‘ich $s$ holat, $T_0$ temperatura va $u$ sovish koeffitsiyentini tanlang.
2. Joriy holatdan tasodifiy $s_{next}$ qo‘shni holat yarating.
3. U yaxshiroq bo‘lsa yoki ehtimollik funksiyasi ruxsat bersa, joriy holatni yangilang.
4. Barcha iteratsiyalar bo‘yicha eng yaxshi $s_{best}$ ni alohida saqlang.
5. Temperaturani kamaytiring va vaqt yoki temperatura chegarasigacha takrorlang.

Eng yaxshi holatni joriy holatdan alohida saqlash zarur: algoritm yaxshi yechimdan yomonrog‘iga ataylab o‘tishi mumkin.

## C++ shablon

```cpp
class State {
public:
    State() {
        // Boshlang‘ich holatni yarating.
    }

    State next(mt19937& rng) const {
        State candidate = *this;
        // candidate ichida tasodifiy lokal o‘zgarish bajaring.
        return candidate;
    }

    double energy() const {
        // Maqsad funksiyasini hisoblang.
    }
};

pair<double, State> simulated_annealing() {
    mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());

    State current;
    State best = current;
    double temperature = 10000.0;
    const double decay = 0.995;
    double energy = current.energy();
    double best_energy = energy;

    while (temperature > 1.0) {
        State candidate = current.next(rng);
        double next_energy = candidate.energy();

        if (accept(energy, next_energy, temperature, rng)) {
            current = std::move(candidate);
            energy = next_energy;

            if (energy < best_energy) {
                best = current;
                best_energy = energy;
            }
        }

        temperature *= decay;
    }

    return {best_energy, best};
}
```

Maksimum izlash uchun `energy()` asl funksiyaning manfiy qiymatini qaytarishi va yakuniy energiya ishorasi yana teskarilanishi mumkin.

## Parametrlarni tanlash

- **Boshlang‘ich $T$.** Dastlabki yomonroq qadamlarning sezilarli qismi qabul qilinadigan darajada katta bo‘lishi kerak. Energiya farqlari masshtabiga moslashtiriladi.
- **Sovish $u$.** Keng va ko‘p minimumli fazoda `0.998`–`0.999` kabi sekin sovish, torroq fazoda `0.99` atrofidagi qiymat yetarli bo‘lishi mumkin. Bu qat’iy qoida emas; tajriba bilan sozlanadi.
- **To‘xtash.** Faqat temperaturaga emas, qat’iy vaqt limitiga ham tayanish sport dasturlashda qulay. Shu orqali yechim mavjud vaqtning deyarli barchasidan foydalanadi.
- **Qayta ishga tushirish.** Bir uzun yugurish o‘rniga turli seed va boshlang‘ich holatlarda bir nechta qisqaroq yugurish ba’zan yaxshiroq natija beradi.

$T_0$ dan $1$ gacha $T\leftarrow Tu$ bilan sovitilsa, iteratsiyalar soni taxminan

$$N=\left\lceil-\log_u T_0\right\rceil.$$

Agar bitta iteratsiya narxi va ruxsat etilgan $N$ ma’lum bo‘lsa, boshlang‘ich temperaturani

$$T_0=u^{-N}$$

orqali baholash mumkin. Amalda vaqt bo‘yicha to‘xtash va energiya farqlari taqsimotidan $T_0$ tanlash ishonchliroq.

## TSP uchun soddalashtirilgan holat

```cpp
class State {
public:
    vector<pair<int, int>> points;

    State() : points{{0, 0}, {2, 2}, {0, 2}, {2, 0},
                     {0, 1}, {1, 2}, {2, 1}, {1, 0}} {}

    State next(mt19937& rng) const {
        State candidate = *this;
        uniform_int_distribution<int> choose(0, (int)points.size() - 1);
        int a = choose(rng);
        int b = choose(rng);
        swap(candidate.points[a], candidate.points[b]);
        return candidate;
    }

    static double distance(pair<int, int> a, pair<int, int> b) {
        return hypot(a.first - b.first, a.second - b.second);
    }

    double energy() const {
        double result = 0;
        int n = (int)points.size();
        for (int i = 0; i < n; ++i)
            result += distance(points[i], points[(i + 1) % n]);
        return result;
    }
};
```

Bu sodda qo‘shnichilik faqat ikkita nuqtani almashtiradi. Katta TSP holatlarida `2-opt` o‘zgarishi va yo‘l uzunligini $O(1)$ da yangilash ancha samarali.

## Foydali modifikatsiyalar

- Vaqt limitidan oshmaslik uchun `while` ichiga vaqt bo‘yicha to‘xtash sharti qo‘shing.
- Eksponensial sovishni chiziqli, logarifmik yoki qayta qizdirishli jadval bilan almashtirish mumkin.
- Energiya farqining ta’sirini o‘zgartirish uchun eksponent asosini yoki masshtabini almashtiring. Masalan:

```cpp
bool accept_with_base(double energy, double next_energy, double temperature,
                      mt19937& rng) {
    const double base = 2.0; // istalgan 1 dan katta haqiqiy son
    double probability = pow(base, -(next_energy - energy) / temperature);
    if (probability >= 1.0)
        return true;
    return bernoulli_distribution(probability)(rng);
}
```

  Energiya farqini butunlay olib tashlash katta va kichik yomonlashuvlarni bir xil ehtimolda qabul qiladi va odatda kamroq ma’lumotdan foydalanadi.
- Energiya hisobini inkremental qiling va holat nusxalashini kamaytiring.
- Yakuniy yechimni deterministik lokal qidiruv bilan yaxshilang.

SA tasodifiy evristika bo‘lgani uchun uni bir nechta seed bilan sinash, javoblar taqsimotini o‘lchash va eng yomon vaqtni emas, qat’iy vaqt limitini boshqarish muhim.

## Murakkablik

$N$ iteratsiya va bitta qo‘shni holatni yaratib baholash narxi $C$ bo‘lsa, vaqt $O(NC)$. Xotira holat hajmiga bog‘liq. Global optimum kafolati va universal parametrlar yo‘q; algoritm sifati holat modeli, qo‘shnichilik, temperatura jadvali va ajratilgan vaqtga bog‘liq.

## Mashq masalalari

- [USACO 2017 January — Subsequence Reversal](https://usaco.org/index.php?page=viewproblem2&cpid=698)
- [Codeforces 1556H — DIY Tree](https://codeforces.com/contest/1556/problem/H)
- [AtCoder — Contest Scheduling](https://atcoder.jp/contests/intro-heuristics/tasks/intro_heuristics_a)
