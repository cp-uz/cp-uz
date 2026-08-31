---
article_id: linear_algebra--determinant-kraut
---
# Determinantni Kraut usuli bilan hisoblash

Kraut usuli $N\times N$ matritsa determinantini $O(N^3)$ vaqtda hisoblaydi. Uning asosiy g‘oyasi $A$ matritsani quyi va yuqori uchburchak matritsalar ko‘paytmasiga ajratishdir:

$$A=LU.$$

Bu yerda $L$ — quyi uchburchak, $U$ esa yuqori uchburchak matritsa. Umumiylikni yo‘qotmagan holda $L$ bosh diagonalidagi barcha elementlarni $1$ deb olish mumkin.

## Determinant va LU ajratish

Ko‘paytma determinantining xossasiga ko‘ra

$$\det(A)=\det(L)\det(U).$$

Uchburchak matritsa determinanti uning bosh diagonalidagi elementlar ko‘paytmasiga teng. $L_{ii}=1$ bo‘lgani uchun $\det(L)=1$, demak

$$\det(A)=\prod_{i=1}^{N}U_{ii}.$$

Shunday qilib, $L$ va $U$ topilgach, determinantni hisoblash uchun $U$ diagonalini ko‘paytirish kifoya.

Har qanday teskarilanuvchi matritsa satrlarni almashtirishga ruxsat berilganda LU ajratishga ega. Satr almashtirishsiz va $L$ diagonali birlardan iborat ko‘rinishning mavjudligi hamda yagonaligi barcha yetakchi bosh minorlar noldan farqli bo‘lishiga bog‘liq. Amaliy implementatsiya nol yoki juda kichik tayanchdan qochish uchun satrlarni almashtiradi; har bir almashtirish determinant ishorasini teskarilaydi.

## $L$ va $U$ elementlarini hisoblash

$A$ matritsa o‘lchami $N$ bo‘lsin. Dastlab

$$L_{ii}=1,\qquad i=1,2,\ldots,N$$

qilib olinadi. Keyin har bir $j=1,2,\ldots,N$ ustun uchun ikki qadam bajariladi.

Avval $i=1,2,\ldots,j$ satrlardagi $U$ elementlari hisoblanadi:

$$U_{ij}=A_{ij}-\sum_{k=1}^{i-1}L_{ik}U_{kj}.$$

So‘ng $i=j+1,j+2,\ldots,N$ satrlar uchun $L$ elementlari topiladi:

$$L_{ij}=\frac{1}{U_{jj}}\left(A_{ij}-\sum_{k=1}^{j-1}L_{ik}U_{kj}\right).$$

Formulalar $A_{ij}=\sum_k L_{ik}U_{kj}$ tenglikdan bevosita kelib chiqadi. Birinchi formulada joriy $U_{ij}$ dan oldin ma’lum bo‘lgan hadlar ayriladi. Ikkinchisida ayni qoldiq tayanch $U_{jj}$ ga bo‘linadi.

## Tayanchlash va sonli barqarorlik

Tayanch $U_{jj}$ nol bo‘lsa, ikkinchi formuladagi bo‘lish bajarilmaydi. Bundan tashqari, juda kichik tayanch suzuvchi nuqtali hisoblarda xatoni keskin kattalashtirishi mumkin. Quyidagi kod har bir satrni undagi eng katta modulga nisbatan masshtablaydi va joriy ustunda masshtablangan moduli eng katta satrni tanlaydi. Bu **masshtablangan qisman tayanchlash** deyiladi.

Satr almashtirilganda `sign` qiymati o‘zgartiriladi. $L$ va $U$ alohida matritsalarda emas, bitta `a` matritsada saqlanadi: diagonal va uning yuqori qismi $U$ ga, diagonal osti esa $L$ ning diagonal ostidagi elementlariga tegishli.

## Java implementatsiyasi

Original implementatsiya butun determinantni aniqroq tiklash uchun `BigDecimal` bilan oraliq hisoblarni 100 xonali aniqlikda olib boradi va yakunda `BigInteger` qaytaradi.

```java
static BigInteger det(BigDecimal a[][], int n) {
    try {
        for (int i = 0; i < n; i++) {
            boolean nonzero = false;
            for (int j = 0; j < n; j++)
                if (a[i][j].compareTo(new BigDecimal(BigInteger.ZERO)) != 0)
                    nonzero = true;
            if (!nonzero)
                return BigInteger.ZERO;
        }

        BigDecimal scaling[] = new BigDecimal[n];
        for (int i = 0; i < n; i++) {
            BigDecimal big = new BigDecimal(BigInteger.ZERO);
            for (int j = 0; j < n; j++)
                if (a[i][j].abs().compareTo(big) > 0)
                    big = a[i][j].abs();
            scaling[i] = (new BigDecimal(BigInteger.ONE)).divide(
                big, 100, BigDecimal.ROUND_HALF_EVEN
            );
        }

        int sign = 1;

        for (int j = 0; j < n; j++) {
            for (int i = 0; i < j; i++) {
                BigDecimal sum = a[i][j];
                for (int k = 0; k < i; k++)
                    sum = sum.subtract(a[i][k].multiply(a[k][j]));
                a[i][j] = sum;
            }

            BigDecimal big = new BigDecimal(BigInteger.ZERO);
            int imax = -1;
            for (int i = j; i < n; i++) {
                BigDecimal sum = a[i][j];
                for (int k = 0; k < j; k++)
                    sum = sum.subtract(a[i][k].multiply(a[k][j]));
                a[i][j] = sum;
                BigDecimal cur = sum.abs().multiply(scaling[i]);
                if (cur.compareTo(big) >= 0) {
                    big = cur;
                    imax = i;
                }
            }

            if (j != imax) {
                for (int k = 0; k < n; k++) {
                    BigDecimal t = a[j][k];
                    a[j][k] = a[imax][k];
                    a[imax][k] = t;
                }

                BigDecimal t = scaling[imax];
                scaling[imax] = scaling[j];
                scaling[j] = t;
                sign = -sign;
            }

            if (j != n - 1)
                for (int i = j + 1; i < n; i++)
                    a[i][j] = a[i][j].divide(
                        a[j][j], 100, BigDecimal.ROUND_HALF_EVEN
                    );
        }

        BigDecimal result = new BigDecimal(1);
        if (sign == -1)
            result = result.negate();
        for (int i = 0; i < n; i++)
            result = result.multiply(a[i][i]);

        return result.divide(
            BigDecimal.valueOf(1), 0, BigDecimal.ROUND_HALF_EVEN
        ).toBigInteger();
    } catch (Exception e) {
        return BigInteger.ZERO;
    }
}
```

## Murakkablik va cheklovlar

Har bir $j$ ustunda $O(N)$ ta element hisoblanadi va har biri uchun ko‘pi bilan $O(N)$ ta oldingi had yig‘iladi. Shu sabab umumiy vaqt murakkabligi $O(N^3)$, matritsani saqlash uchun xotira $O(N^2)$.

Kod istisno yuz bersa nol qaytaradi, shuning uchun ishlab chiqarish kodida nol determinant bilan arifmetik xatoni alohida ajratish ma’qul. Yuqoridagi nusxada satrning noldan farqliligi `compareTo(...) != 0` bilan tekshiriladi; bu barcha qiymatlari manfiy bo‘lgan satrni ham to‘g‘ri qabul qiladi. Bunday implementatsion mayda tafsilotlar natijaning ishonchliligi uchun muhim.
