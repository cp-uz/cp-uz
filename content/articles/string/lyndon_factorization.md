---
article_id: string--lyndon_factorization
---
# Lyndon faktorizatsiyasi

## Lyndon faktorizatsiyasi

Avval Lyndon faktorizatsiyasi tushunchasini ta’riflaymiz.

Satr o‘zining har qanday notrivial **suffiksi**dan qat’iy **kichik** bo‘lsa, u **sodda** satr (yoki Lyndon so‘zi) deyiladi.
Sodda satrlarga misollar: $a$, $b$, $ab$, $aab$, $abb$, $ababb$, $abcd$.
Satr sodda bo‘lishi uchun va faqat shundagina u o‘zining barcha notrivial **siklik siljitishlari**dan qat’iy **kichik** bo‘lishini ko‘rsatish mumkin.

Endi $s$ satri berilgan bo‘lsin.
$s$ satrining **Lyndon faktorizatsiyasi** — bu $s = w_1 w_2 \dots w_k$ ko‘rinishidagi ajratish bo‘lib, bunda barcha $w_i$ satrlar sodda va ular o‘smas tartibda joylashgan: $w_1 \ge w_2 \ge \dots \ge w_k$.

Har qanday satr uchun bunday faktorizatsiya mavjud va yagona ekanini ko‘rsatish mumkin.

## Duval algoritmi

Duval algoritmi Lyndon faktorizatsiyasini $O(n)$ vaqtda, $O(1)$ qo‘shimcha xotira bilan quradi.

Avval yana bir tushunchani kiritamiz:
$t = w w \dots w \overline{w}$ ko‘rinishidagi satr **pre-sodda** deyiladi; bunda $w$ sodda satr, $\overline{w}$ esa $w$ ning prefiksi (bo‘sh bo‘lishi ham mumkin).
Sodda satrning o‘zi ham pre-sodda hisoblanadi.

Duval algoritmi ochko‘z algoritmdir.
Uning ishlashining istalgan paytida $s$ satri amalda $s = s_1 s_2 s_3$ ko‘rinishida uch qismga bo‘lingan bo‘ladi: $s_1$ uchun Lyndon faktorizatsiyasi allaqachon topilgan va yakunlangan, $s_2$ satri pre-sodda (va undagi sodda satr uzunligini bilamiz), $s_3$ esa hali umuman ko‘rib chiqilmagan.
Har bir iteratsiyada Duval algoritmi $s_3$ satrining birinchi belgisini olib, uni $s_2$ satriga qo‘shishga urinadi.
Agar $s_2$ endi pre-sodda bo‘lmay qolsa, $s_2$ ning bir qismi uchun Lyndon faktorizatsiyasi ma’lum bo‘ladi va bu qism $s_1$ ga o‘tadi.

Algoritmni batafsilroq tasvirlaymiz.
$i$ ko‘rsatkichi doimo $s_2$ satrining boshini ko‘rsatadi.
Tashqi sikl $i < n$ bo‘lguncha ishlaydi.
Sikl ichida yana ikkita ko‘rsatkichdan foydalanamiz: $j$ — $s_3$ ning boshini, $k$ esa ayni paytda taqqoslanayotgan belgini ko‘rsatadi.
Biz $s[j]$ belgisini $s_2$ satriga qo‘shmoqchimiz; buning uchun uni $s[k]$ belgisi bilan taqqoslash kerak.
Uch xil holat yuz berishi mumkin:

- $s[j] = s[k]$: bu holda $s[j]$ belgisini $s_2$ ga qo‘shish uning pre-soddaligini buzmaydi.
  Shuning uchun $j$ va $k$ ko‘rsatkichlarini bittadan oshiramiz.
- $s[j] > s[k]$: bu holda $s_2 + s[j]$ satri sodda bo‘ladi.
  $j$ ni oshirib, $k$ ni yana $s_2$ ning boshiga qaytaramiz; shunda keyingi belgi sodda so‘zning boshi bilan taqqoslanadi.
- $s[j] < s[k]$: $s_2 + s[j]$ satri endi pre-sodda emas.
  Shuning uchun pre-sodda $s_2$ satrini uning sodda satrlariga va, ehtimol, bo‘sh bo‘lgan qoldiqqa ajratamiz.
  Sodda satrning uzunligi $j - k$ bo‘ladi.
  Keyingi iteratsiyada qolgan $s_2$ bilan boshidan davom etamiz.

### Implementatsiya

Quyida berilgan $s$ satrining kerakli Lyndon faktorizatsiyasini qaytaruvchi Duval algoritmi implementatsiyasi keltirilgan.

```{.cpp file=duval_algorithm}
vector<string> duval(string const& s) {
    int n = s.size();
    int i = 0;
    vector<string> factorization;
    while (i < n) {
        int j = i + 1, k = i;
        while (j < n && s[k] <= s[j]) {
            if (s[k] < s[j])
                k = i;
            else
                k++;
            j++;
        }
        while (i <= k) {
            factorization.push_back(s.substr(i, j - k));
            i += j - k;
        }
    }
    return factorization;
}
```

### Murakkablik

Ushbu algoritmning ishlash vaqtini baholaymiz.

**Tashqi `while` sikli** ko‘pi bilan $n$ ta iteratsiya bajaradi, chunki har bir iteratsiya oxirida $i$ oshadi.
Ikkinchi ichki `while` sikli ham $O(n)$ vaqtda ishlaydi, chunki u faqat yakuniy faktorizatsiyani chiqaradi.

Demak, bizni faqat **birinchi ichki `while` sikli** qiziqtiradi.
Eng yomon holatda u nechta iteratsiya bajaradi?
Tashqi siklning har bir iteratsiyasida aniqlanadigan sodda so‘zlar qo‘shimcha ravishda taqqoslangan qoldiqdan uzunroq ekanini ko‘rish oson.
Shuning uchun qoldiqlar uzunliklarining yig‘indisi ham $n$ dan kichik bo‘ladi; demak, birinchi ichki `while` sikli jami ko‘pi bilan $O(n)$ ta iteratsiya bajaradi.
Hatto belgilar taqqoslashlarining umumiy soni $4n - 3$ dan oshmaydi.

## Eng kichik siklik siljitishni topish

$s$ satri berilgan bo‘lsin.
$s + s$ satri uchun Lyndon faktorizatsiyasini quramiz (bu $O(n)$ vaqt oladi).
Faktorizatsiyada boshlanish pozitsiyasi $n$ dan kichik (ya’ni $s$ ning birinchi nusxasida boshlangan) va tugash pozitsiyasi $n$ dan katta yoki unga teng (ya’ni $s$ ning ikkinchi nusxasida tugagan) bo‘lgan sodda satrni qidiramiz.
Ta’kidlanishicha, shu sodda satrning boshlanish pozitsiyasi kerakli eng kichik siklik siljitishning boshi bo‘ladi.
Buni Lyndon ajratish ta’rifidan foydalanib oson tekshirish mumkin.

Sodda blokning boshini oson topish mumkin: tashqi siklning har bir iteratsiyasi boshida joriy pre-sodda satrning boshini ko‘rsatuvchi $i$ ko‘rsatkichini eslab qolish kifoya.

Natijada quyidagi implementatsiyani olamiz:

```{.cpp file=smallest_cyclic_string}
string min_cyclic_string(string s) {
    s += s;
    int n = s.size();
    int i = 0, ans = 0;
    while (i < n / 2) {
        ans = i;
        int j = i + 1, k = i;
        while (j < n && s[k] <= s[j]) {
            if (s[k] < s[j])
                k = i;
            else
                k++;
            j++;
        }
        while (i <= k)
            i += j - k;
    }
    return s.substr(ans, n / 2);
}
```

## Masalalar

- [UVA #719 - Glass Beads](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=660)

