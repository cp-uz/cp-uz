---
article_id: string--z-function
---
# Z-funksiya va uni hisoblash

Uzunligi $n$ bo‘lgan $s$ satr berilgan bo‘lsin. Bu satrning **Z-funksiyasi** uzunligi $n$ bo‘lgan massiv bo‘lib, uning $i$-elementi $i$ pozitsiyadan boshlab $s$ ning dastlabki belgilariga mos keladigan eng ko‘p belgilar soniga teng.

Boshqacha aytganda, $z[i]$ — ayni paytda $s$ ning prefiksi va $s$ ning $i$ dan boshlanuvchi suffiksining prefiksi bo‘lgan eng uzun satr uzunligi.

**Eslatma.** Noaniqlik bo‘lmasligi uchun ushbu maqolada indekslar $0$ dan boshlanadi: $s$ ning birinchi belgisi indeksi $0$, oxirgi belgisining indeksi esa $n-1$.

Z-funksiyaning birinchi elementi $z[0]$ odatda bir qiymatli aniqlanmaydi. Bu maqolada uni nol deb olamiz; bu algoritm implementatsiyasiga ta’sir qilmaydi.

Maqolada Z-funksiyani $O(n)$ vaqtda hisoblaydigan algoritm va uning turli qo‘llanishlari bayon qilinadi.

## Misollar

Turli satrlar uchun Z-funksiya qiymatlari:

* `aaaaa` — $[0, 4, 3, 2, 1]$;
* `aaabaab` — $[0, 2, 1, 0, 2, 1, 0]$;
* `abacaba` — $[0, 0, 1, 0, 3, 0, 1]$.

## Sodda algoritm

Formal ta’rifni quyidagi oddiy $O(n^2)$ implementatsiya bilan ifodalash mumkin.

```cpp
vector<int> z_function_trivial(string s) {
	int n = s.size();
	vector<int> z(n);
	for (int i = 1; i < n; i++) {
		while (i + z[i] < n && s[z[i]] == s[i + z[i]]) {
			z[i]++;
		}
	}
	return z;
}
```

Har bir $i$ pozitsiya bo‘yicha yuramiz va $z[i] = 0$ dan boshlab, mos kelmaydigan juftlik topilmaguncha yoki satr oxiriga yetmaguncha qiymatni bittadan oshiramiz.

Bu, albatta, samarali implementatsiya emas. Endi samarali usulni quramiz.

## Z-funksiyani hisoblashning samarali algoritmi

Samarali algoritm olish uchun $z[i]$ qiymatlarni $i = 1$ dan $n-1$ gacha ketma-ket hisoblaymiz, ammo har bir yangi qiymatni topishda ilgari hisoblangan ma’lumotlardan imkon qadar ko‘p foydalanamiz.

Qisqalik uchun $s$ prefiksi bilan mos keladigan qism satrlarni **mos keluvchi kesmalar** deb ataymiz. Masalan, $z[i]$ — $i$ pozitsiyada boshlanib, $i + z[i] - 1$ pozitsiyada tugaydigan mos keluvchi kesma uzunligi.

Biz **eng o‘ngda tugaydigan mos keluvchi kesmaning $[l,r)$ indekslarini** saqlaymiz. Ya’ni topilgan barcha kesmalar orasidan oxiri eng o‘ngda joylashganini tanlaymiz. $r$ indeksni algoritm satrning qaysi chegarasigacha tekshirganining chegarasi deb qarash mumkin; uning o‘ngidagi qism haqida hali ma’lumot yo‘q.

Joriy, navbatdagi Z-funksiya qiymati hisoblanadigan indeks $i$ bo‘lsa, ikki holatdan biri yuz beradi:

* $i \geq r$ — joriy pozitsiya oldin qayta ishlangan qismdan **tashqarida**.

    Bu holda $z[i]$ ni **sodda algoritm** bilan, ya’ni belgilarni birma-bir taqqoslab hisoblaymiz. Oxirida $z[i] > 0$ bo‘lsa, eng o‘ng kesma indekslarini yangilash kerak, chunki yangi $r = i + z[i]$ avvalgi $r$ dan kattaroq bo‘lishi kafolatlangan.

* $i < r$ — joriy pozitsiya $[l,r)$ mos keluvchi kesmaning ichida.

    Bu holda oldin hisoblangan Z-qiymatlar yordamida $z[i]$ ni noldan kattaroq, ehtimol ancha katta boshlang‘ich qiymat bilan initsializatsiya qilish mumkin.

    $s[l \dots r)$ va $s[0 \dots r-l)$ qism satrlar **mos tushishini** kuzatamiz. Shuning uchun $z[i]$ uchun boshlang‘ich taxmin sifatida $s[0 \dots r-l)$ dagi mos pozitsiya uchun avval hisoblangan $z[i-l]$ qiymatini olish mumkin.

    Biroq $z[i-l]$ haddan tashqari katta bo‘lishi mumkin: uni $i$ pozitsiyaga qo‘llasak, $r$ chegaradan chiqib ketishi ehtimoli bor. Bunga yo‘l qo‘yib bo‘lmaydi, chunki $r$ ning o‘ngidagi belgilar haqida hech narsa bilmaymiz va ular talab qilingan belgilardan farq qilishi mumkin.

    Shunga o‘xshash holatga **misol**:

    $$ s = "aaaabaa" $$

    Oxirgi pozitsiyaga ($i = 6$) kelganimizda, joriy mos kesma $[5,7)$ bo‘ladi. $6$ pozitsiya $6-5=1$ pozitsiyaga mos keladi, u yerda $z[1]=3$. Ravshanki, $z[6]$ ni $3$ bilan initsializatsiya qilib bo‘lmaydi — bu butunlay noto‘g‘ri. Uni ko‘pi bilan $1$ bilan initsializatsiya qilish mumkin, chunki $[l,r)$ kesmaning $r$ chegarasidan chiqarmaydigan eng katta qiymat shu.

    Demak, $z[i]$ uchun xavfsiz **boshlang‘ich taxmin**:

    $$ z_0[i] = \min(r - i,\; z[i-l]) $$

    $z[i]$ ga $z_0[i]$ berilgach, uni **sodda algoritm** yordamida oshirishga harakat qilamiz, chunki $r$ chegaradan keyin moslik davom etadimi-yo‘qmi oldindan bilmaymiz.

Shunday qilib, algoritm ikki holatga bo‘linadi va ular faqat $z[i]$ ning **boshlang‘ich qiymati** bilan farq qiladi: birinchi holatda u nol, ikkinchisida esa yuqoridagi formula bilan oldingi qiymatlardan aniqlanadi. Shundan keyin ikkala tarmoq ham boshlang‘ich qiymatdan davom etadigan **sodda algoritm**ga keladi.

Algoritm juda sodda chiqadi. Har iteratsiyada sodda algoritm ishga tushirilishiga qaramay, sezilarli yutuqqa erishdik: hosil bo‘lgan algoritm chiziqli vaqtda ishlaydi. Quyida buni isbotlaymiz.

## Implementatsiya

Implementatsiya ancha ixcham:

```cpp
vector<int> z_function(string s) {
    int n = s.size();
    vector<int> z(n);
    int l = 0, r = 0;
    for(int i = 1; i < n; i++) {
        if(i < r) {
            z[i] = min(r - i, z[i - l]);
        }
        while(i + z[i] < n && s[z[i]] == s[i + z[i]]) {
            z[i]++;
        }
        if(i + z[i] > r) {
            l = i;
            r = i + z[i];
        }
    }
    return z;
}
```

### Implementatsiyaga izohlar

Butun yechim uzunligi $n$ bo‘lgan massivni — $s$ ning Z-funksiyasini — qaytaradigan funksiya ko‘rinishida berilgan.

Dastlab $z$ massiv nollar bilan to‘ldiriladi. Eng o‘ngdagi joriy mos kesma $[0,0)$ deb olinadi; bu ataylab kichik, hech qanday $i$ ni o‘z ichiga olmaydigan kesma.

$i = 1 \dots n-1$ sikl ichida avval $z[i]$ ning boshlang‘ich qiymatini aniqlaymiz: u nol bo‘lib qoladi yoki yuqoridagi formula bilan hisoblanadi.

Keyin sodda algoritm $z[i]$ ni imkon qadar oshirishga urinadi.

Oxirida zarur bo‘lsa, ya’ni $i + z[i] > r$ bo‘lsa, eng o‘ng mos kesma $[l,r)$ yangilanadi.

## Algoritmning asimptotikasi

Yuqoridagi algoritm satr uzunligiga nisbatan chiziqli, ya’ni $O(n)$ vaqtda ishlashini isbotlaymiz.

Isbot juda sodda.

Bizni ichma-ich joylashgan `while` sikli qiziqtiradi, chunki qolgan barcha ishlar jami $O(n)$ bo‘ladigan o‘zgarmas sondagi amallardan iborat.

`while` siklining **har bir iteratsiyasi** mos kesmaning o‘ng chegarasi $r$ ni oshirishini ko‘rsatamiz.

Buning uchun algoritmning ikki holatini ko‘rib chiqamiz:

* $i \geq r$

    Bu holda `while` sikli umuman ishlamasligi mumkin (agar $s[0] \ne s[i]$ bo‘lsa), yoki $i$ pozitsiyadan boshlab bir necha iteratsiya bajarib, har safar bitta belgi o‘ngga yuradi. Shundan so‘ng $r$ o‘ng chegara albatta yangilanadi.

    Demak, $i \geq r$ bo‘lganda `while` siklining har bir iteratsiyasi yangi $r$ qiymatini oshiradi.

* $i < r$

    Bu holda $z[i]$ yuqoridagi formula bilan berilgan $z_0$ boshlang‘ich qiymat bilan initsializatsiya qilinadi. $z_0$ ni $r-i$ bilan taqqoslaymiz. Uch holat bor:

    * $z_0 < r-i$

        Bu holda `while` sikli bir marta ham ishlamasligini isbotlaymiz.

        Masalan, qarama-qarshilikdan: `while` kamida bir marta ishlasa, boshlang‘ich $z[i]=z_0$ taxmin haqiqiy moslik uzunligidan kichik bo‘lgan bo‘lardi. Ammo $s[l \dots r)$ va $s[0 \dots r-l)$ bir xil bo‘lgani uchun bu $z[i-l]$ qiymati ham aslidan kichik hisoblanganini bildiradi.

        $z[i-l]$ to‘g‘ri va $r-i$ dan kichik bo‘lganligi sababli u talab qilinayotgan $z[i]$ qiymatining o‘ziga teng.

    * $z_0 = r-i$

        Bu holda `while` bir necha iteratsiya bajarishi mumkin, ammo ularning har biri $r$ ni oshiradi: taqqoslash $s[r]$ dan boshlanib, $[l,r)$ oraliqdan tashqariga chiqadi.

    * $z_0 > r-i$

        Bu holat $z_0$ ta’rifiga ko‘ra mumkin emas.

Shunday qilib, ichki siklning har bir iteratsiyasi $r$ ko‘rsatkichni o‘ngga surishini isbotladik. $r$ $n-1$ dan katta bo‘la olmagani uchun ichki sikl jami $n-1$ martadan ko‘p ishlamaydi.

Algoritmning qolgan qismi ravshanki $O(n)$ vaqtda ishlaydi; demak, Z-funksiyani hisoblash algoritmining umumiy vaqti chiziqli.

## Qo‘llanishlar

Endi Z-funksiyaning ayrim masalalardagi qo‘llanishlarini ko‘rib chiqamiz.

Bu qo‘llanishlar [prefiks funksiyasi](prefix-function.md) qo‘llanishlariga juda o‘xshaydi.

### Qism satrni qidirish

Chalkashmaslik uchun $t$ ni **matn satri**, $p$ ni esa **andoza** deb ataymiz. Masala: $p$ andozaning $t$ matn ichidagi barcha uchrashishlarini topish.

$s = p + \diamond + t$ yangi satrni tuzamiz, ya’ni $p$ va $t$ ni birlashtirib, orasiga $p$ da ham, $t$ da ham uchramaydigan $\diamond$ ajratgich belgisini qo‘yamiz.

$s$ uchun Z-funksiyani hisoblaymiz. Keyin $[0;\;\operatorname{length}(t)-1]$ oraliqdagi har bir $i$ uchun $k=z[i+\operatorname{length}(p)+1]$ qiymatni ko‘ramiz. Agar $k=\operatorname{length}(p)$ bo‘lsa, $t$ ning $i$-pozitsiyasida $p$ uchraydi; aks holda bu pozitsiyada uchrashish yo‘q.

Ishlash vaqti ham, xotira sarfi ham $O(\operatorname{length}(t)+\operatorname{length}(p))$.

### Satrdagi turli qism satrlar soni

Uzunligi $n$ bo‘lgan $s$ satr berilgan. Undagi turli qism satrlar sonini sanash kerak.

Masalani iterativ yechamiz: joriy turli qism satrlar sonini bilgan holda, $s$ oxiriga bitta belgi qo‘shilganda bu sonni qayta hisoblaymiz.

$s$ dagi turli qism satrlar soni $k$ bo‘lsin. $s$ oxiriga yangi $c$ belgi qo‘shamiz. Ravshanki, $c$ bilan tugaydigan yangi qism satrlar paydo bo‘lishi mumkin — aynan shu belgi bilan tugab, ilgari uchramagan satrlar.

$t=s+c$ satrni olib, uni teskarisiga yozamiz. Endi vazifa $t$ ning boshqa hech qayerida uchramaydigan prefikslar sonini topishdir. $t$ ning Z-funksiyasini hisoblab, uning maksimal qiymatini $z_{max}$ deb olamiz. Ravshanki, $t$ ning uzunligi $z_{max}$ bo‘lgan prefiksi $t$ ning o‘rtasida ham uchraydi. Undan qisqa prefikslar ham uchraydi.

Demak, $c$ belgisi $s$ ga qo‘shilganda paydo bo‘ladigan yangi qism satrlar soni $\operatorname{length}(t)-z_{max}$ ga teng.

Natijada uzunligi $n$ bo‘lgan satr uchun yechimning umumiy vaqti $O(n^2)$.

Ayni usul bilan satr boshiga belgi qo‘shilganda yoki satr oxiri yoxud boshidan belgi o‘chirilganda ham turli qism satrlar sonini $O(n)$ vaqtda qayta hisoblash mumkin.

### Satrni siqish

Uzunligi $n$ bo‘lgan $s$ satr berilgan. Uning eng qisqa “siqilgan” ifodasini, ya’ni $s$ bir yoki bir nechta $t$ nusxalarining ketma-ket birikmasi bo‘ladigan eng qisqa $t$ satrni topish kerak.

Yechim: $s$ ning Z-funksiyasini hisoblang, $n$ ni bo‘ladigan barcha $i$ lar bo‘yicha yuring va $i+z[i]=n$ bo‘lgan birinchi $i$ da to‘xtang. Shunda $s$ satrni uzunligi $i$ gacha siqish mumkin.

Bu faktning isboti [prefiks funksiyasi](prefix-function.md) yordamidagi yechim isboti bilan bir xil.

## Amaliy masalalar

* [CSES - Finding Borders](https://cses.fi/problemset/task/1732)
* [eolymp - Blocks of string](https://www.eolymp.com/en/problems/1309)
* [Codeforces - Password [Difficulty: Easy]](http://codeforces.com/problemset/problem/126/B)
* [UVA # 455 "Periodic Strings" [Difficulty: Medium]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=396)
* [UVA # 11022 "String Factoring" [Difficulty: Medium]](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1963)
* [UVa 11475 - Extend to Palindrome](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=2470)
* [LA 6439 - Pasti Pas!](https://icpcarchive.ecs.baylor.edu/index.php?option=com_onlinejudge&Itemid=8&category=588&page=show_problem&problem=4450)
* [Codechef - Chef and Strings](https://www.codechef.com/problems/CHSTR)
* [Codeforces - Prefixes and Suffixes](http://codeforces.com/problemset/problem/432/D)
* [Codeforces - "a" String Problem](https://codeforces.com/problemset/problem/1984/D)

