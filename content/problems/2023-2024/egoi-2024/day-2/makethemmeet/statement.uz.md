> Ushbu shart EGOI 2024 rasmiy arxividagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.


Mila va Laura uzoq yillik onlayn do'stlar: ular hayotda hech ko'rishmagan. Shu kunlarda ularning ikkovi ham aynan bir tadbirda qatnashmoqda – bu ular albatta uchrashib qolishlari kerak degani. Biroq ular joylashgan mehmonxona juda katta va odamni chalkashtiradi. Shuning uchun ular bir necha kun o'tgan bo'lsa ham haligacha uchrashishmadi.

Mehmonxonada $N$ ta xona bor, ular 0 dan $N - 1$ gacha raqamlangan. Har bir xonaga rangi o'zgaruvchi chiroq o'rnatilgan. Siz mehmonxonaning elektr tizimi bilan shug'ullanuvchi xonani topib oldingiz, bu sizga chiroqlar rangini o'zgartirish imkonini beradi. Sizning maqsadingiz chiroqlardan foydalangan holda Mila va Laurani yo'naltirib, ularning uchrashuvini tashkillashtirishdan iborat.

Mehmonxonani $N$ ta tugun (xonalar) va $M$ ta qirra (xonalarni birlashtiruvchi korridorlar)li graf ko'rinishida tasvirlashimiz mumkin. Mila va Laura ikkita har xil xonada boshlashadi, biroq siz aynan qaysi xonalar ekanini bilmaysiz. Siz bir nechta amal bajarishingiz mumkin. Har bir amal $N$ ta butun son ( $c $ 0, $ c $ 1,..., _cN_ −1) ni chiqarishdan iborat: bunda $ i $ -xonadagi chiroqning rangi $c_i$ bo'ladi (har bir $ i = 0$,1,..., $ N - 1$ uchun). Shunda Mila va Laura ayni damda qaysi rangdagi chiroqli xonada bo'lsalar aynan shu rangdagi chiroqli qo'shni xonaga o'tadilar. Agar yon-atrofda bunday xona bo'lmasa, ular o'z joylarida qoladilar. Agar bunday xonalar bir-nechta bo'lsa, ular ixtiyoriy xonalarni tanlashadi.

Agar bajargan qaysidir amalingiz paytida, Mila va Laura bitta xonada bo'lsalar yoki bitta korridordan bir vaqtda o'tsalar, siz ularning uchrashishlariga muvaffaq bo'lgan bo'lasiz. Siz ko'pi bilan 20 000ta amal bajarishingiz mumkin, biroq amallar soni kamroq bo'lsa, ballingiz yuqoriroq bo'ladi.

Eslatib o'tamiz, siz Mila va Laura aynan qaysi xonalardan boshlashlari yoki bir xil rangda yoritilgan bir nechta xona bo'lsa, aynan qaysi biriga qarab yurishlarini bilmaysiz. **Ular qaysi xonadan boshlashlari yoki qaysi xonaga qarab yurishlaridan qat'iy nazar siz bergan yechim to'g'ri ishlashi kerak.**

## Kiruvchi ma'lumotlar

Birinchi qatorda ikkita butun son kiritiladi: $N $ va $M $ - mehmonxonadagi xonalar va korridorlar soni. Keyingi $ M$ ta qatorning har birida ikkitadan butun son kiritiladi: $u_i$ va $v_i$ , ya'ni $u_i$ -raqamli va $v_i$ - raqamli xonalar korridor bilan bog'langan.

## Chiquvchi ma'lumotlar

Birinchi qatorda $K$ butun sonni chiqaring, bu bajariladigan amallar soni.

Keyingi $K$ qatorlarning har birida $N$ tadan butun son $c$ 0, $ c $ 1,..., _cN_ −1 chiqaring, bunda har bir $ i $ uchun 0 ≤ $c_i$ ≤ $ N $ bo'lishi kerak. Bu $ K$ ta qator sizning amallaringizni xronologik tartibda ifodalaydi.

## Cheklovlar va baholash

- $2 \le N \le 100$.

- $N-1\le M\le N(N-1)/2$.

- 0 ≤ $u_i$ , $v_i$ ≤ $N - 1$, va $u_i$ ≠ $v_i$ .

- Barcha xonadan barcha boshqa xonalarga borish mumkin. Bundan tashqari, bu yerda qaysidir xonaning o'zidan-o'ziga boradigan korridorlar yo'q, hamda hech qaysi xonalar juftligi orasida bittadan ortiq korridor yo'q.

- Ko'pi bilan 20 000 ta amalni bajarishingiz mumkin, (ya'ni, $K \le 20000$).

Yechimingiz bir-nechta test guruhlarida tekshiriladi. Har bir test guruhi uchun qanchadir ball beriladi. Barcha test guruhlarida bir-nechta testlar bor. Test guruhining ballini olish uchun yechimingiz ushbu guruhdagi barcha testlarda to'g'ri ishlashi kerak.

|**Guruh**|**Maks**<br>**ball**|**Cheklovlar**|
|---|---|---|
|1|10|$M = N - 1$, va korridorlar -(0,1),(0,2),(0,3),...,(0,$ N - 1$). Ya'ni graf<br>yulduz shaklida.|
|2|13|$M=N(N-1)/2$, ya’ni graf to‘liq.|
|3|11|$M = N - 1$, va(0,1),(1,2),(2,3),...,($ N - 2$,$ N - 1$)korridorlar. Ya'ni graf<br>yo'l ko'rinishida.|
|4|36|$M = N - 1$. Ya'ni graf daraxt shaklida.|
|5|30|Qo'shimcha cheklovlarsiz.|

Sizning dasturingiz to'g'ri ishlagan har bir test guruhi uchun siz quyidagi formula bo'yicha baho olasiz:

$$\mathrm{score}=\left\lfloor S_g\min\left(1,\frac{2000}{K_g+1900}+\frac15\right)\right\rfloor.$$

bu yerda $S_g$ – test guruhi uchun beriladigan maksimal ball; $K_g$ – sizning yechimingiz test guruhidagi istalgan test uchun amalga oshirgan maksimal amallar soni. Ya'ni, maksimal ball olish uchun barcha testlarda ko'pi bilan 600 ta amalni bajarashingiz kerak.

Quyidagi diagramma oladigan ballingizni $K_g$ ning funksiyasi orqali ifodalaydi.

## Namunalar

Misolda 3 uzunlikdagi yo'l berilgan, shunday ekan, u 3, 4, yoki 5-test guruhiga tegishli bo'lishi mumkin. Agar chiroqlar misoldagi chiquvchi ma'lumotdagidek bo'yalgan bo'lsa, Mila va Laura doim uchrashib qoladi.

Masalan, tasavvur qiling, Mila 0 tugunda, Laura esa 1 tugunda boshlaydi:

- Birinchi amal: Mila 1-xonaga borishi shart. Agar Laura 0-xonaga borsa, unda ular 0 va 1 o'rtasidagi korridorda uchrashadi. Buni o'rniga, Laura 2-xonaga bordi deylik. Ikkinchi amal: Mila 0-xonaga qaytib boradi va Laura 2-xonada qoladi.

- Uchinchi amal: Mila yana 1-xonaga boradi va Laura 2-xonada qoladi.

- To'rtinchi amal: Mila 2-xonaga boradi va Laura 1-xonaga boradi. Shuning uchun ular 1 va 2- xonalar orasidagi korridorda uchrashadi.

- Beshinchi amal: Mila va Laura o'rin almashadi va yana qayta ko'rishadi (ammo buning endi farqi yo'q, chunki ular bundan avval ko'rishib bo'lgan).

Eslatib o'tamiz, bu dugonalar 0 va 1-xonalarda boshlagandagina sodir bo'ladigan hodisa. Ta'kidlash joizki, aynan shunday ketma-ketlikdagi amallar qizlar qayerdan boshlashi va qay tomonga qarab yurishidan qat'iy nazar ularning uchrashishlarini ta'minlaydi.

## Namuna testlar

### 1-misol

**Kiruvchi ma’lumotlar**

```text
3 2
0 1
1 2
```

**Chiquvchi ma’lumotlar**

```text
5
2 2 2
2 2 3
2 2 3
1 2 2
1 2 2
```

---

Manba: [EGOI 2024 rasmiy masalalar arxivi](https://github.com/zehnsechs/egoi-2024-testdata/tree/47fefa0ff64124f7fd8421aa12b77ad689a0fb29). [Litsenziya: CC BY-SA](https://github.com/zehnsechs/egoi-2024-testdata/blob/47fefa0ff64124f7fd8421aa12b77ad689a0fb29/day2/makethemmeet/problem.yaml).
