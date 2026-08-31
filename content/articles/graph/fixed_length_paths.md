---
article_id: graph--fixed_length_paths
---
# Belgilangan uzunlikdagi yo‘llar soni va eng qisqa yo‘llar

Quyidagi maqolada bitta g‘oyaga asoslangan ikki masalaning yechimi tavsiflanadi:

masalani matritsa tuzishga keltirish va yechimni odatiy matritsa ko‘paytmasi yoki o‘zgartirilgan ko‘paytma yordamida hisoblash.

## Belgilangan uzunlikdagi yo‘llar soni

Bizga $n$ ta tugunga ega yo‘naltirilgan og‘irliksiz $G$ grafi va $k$ butun soni berilgan.

Vazifa quyidagicha:

har bir $(i, j)$ tugunlar jufti uchun ular orasidagi uzunligi $k$ bo‘lgan yo‘llar sonini topish kerak.

Yo‘llar sodda bo‘lishi shart emas, ya’ni bitta yo‘l ichida tugunlar va qirralarga istalgancha qayta kirish mumkin.

Graf qo‘shnilik matritsasi orqali berilgan deb faraz qilamiz, ya’ni $n \times n$ o‘lchamli $G[][]$ matritsada $i$ tugun $j$ tugun bilan qirra orqali bog‘langan bo‘lsa $G[i][j] = 1$, bog‘lanmagan bo‘lsa $G[i][j] = 0$.

Quyidagi algoritm parallel qirralar mavjud bo‘lgan holatda ham ishlaydi:

agar biror $(i, j)$ tugunlar jufti $m$ ta qirra bilan bog‘langan bo‘lsa, buni qo‘shnilik matritsasida $G[i][j] = m$ deb yozishimiz mumkin.

Algoritm grafda ilmoqlar (tugunni o‘zi bilan bog‘laydigan qirralar) mavjud bo‘lsa ham ishlaydi.

Tuzilgan qo‘shnilik matritsasi $k = 1$ holat uchun masalaning javobi ekanligi ravshan.

U har bir tugunlar jufti orasidagi uzunligi $1$ bo‘lgan yo‘llar sonini saqlaydi.

Yechimni iterativ ravishda quramiz:

biror $k$ uchun javobni bilamiz deb faraz qilaylik.

Endi $k + 1$ uchun javobni qanday qurish mumkinligini tavsiflaymiz.

$k$ holat uchun matritsani $C_k$, qurmoqchi bo‘lgan matritsani esa $C_{k+1}$ deb belgilaymiz.

Quyidagi formula yordamida $C_{k+1}$ ning har bir elementini hisoblash mumkin:

$$C_{k+1}[i][j] = \sum_{p = 1}^{n} C_k[i][p] \cdot G[p][j]$$

Formula $C_k$ va $G$ matritsalarning ko‘paytmasidan boshqa narsani hisoblamayotganini ko‘rish oson:

$$C_{k+1} = C_k \cdot G$$

Demak, masala yechimini quyidagicha ifodalash mumkin:

$$C_k = \underbrace{G \cdot G \cdots G}_{k \text{ marta}} = G^k$$

Matritsa ko‘paytmasini [ikkilik darajaga oshirish](../algebra/binary-exp.md) yordamida katta darajaga samarali ko‘tarish mumkinligini qayd etish qoladi.

Bu $O(n^3 \log k)$ murakkablikdagi yechimni beradi.

## Belgilangan uzunlikdagi eng qisqa yo‘llar

Bizga $n$ ta tugunga ega yo‘naltirilgan og‘irlikli $G$ grafi va $k$ butun soni berilgan.

Har bir $(i, j)$ tugunlar jufti uchun aynan $k$ ta qirradan iborat bo‘lgan $i$ dan $j$ gacha eng qisqa yo‘l uzunligini topishimiz kerak.

Graf qo‘shnilik matritsasi orqali, ya’ni $n \times n$ o‘lchamli $G[][]$ matritsa yordamida berilgan deb faraz qilamiz; bunda har bir $G[i][j]$ element $i$ tugundan $j$ tugunga qirra uzunligini saqlaydi.

Ikki tugun orasida qirra bo‘lmasa, matritsaning tegishli elementi cheksizlikka — $\infty$ ga teng qilinadi.

Bu ko‘rinishda qo‘shnilik matritsasi $k = 1$ holat uchun masalaning javobi ekanligi ravshan.

U har bir tugunlar jufti orasidagi eng qisqa yo‘l uzunligini yoki bitta qirradan iborat yo‘l mavjud bo‘lmasa $\infty$ ni saqlaydi.

Yana masala yechimini iterativ ravishda qurishimiz mumkin:

biror $k$ uchun javobni bilamiz deb faraz qilaylik.

$k+1$ uchun javobni qanday hisoblashni ko‘rsatamiz.

$k$ uchun matritsani $L_k$, qurmoqchi bo‘lgan matritsani esa $L_{k+1}$ deb belgilaylik.

Quyidagi formula $L_{k+1}$ ning har bir elementini hisoblaydi:

$$L_{k+1}[i][j] = \min_{p = 1 \ldots n} \left(L_k[i][p] + G[p][j]\right)$$

Bu formulaga diqqat bilan qarasak, matritsa ko‘paytmasi bilan o‘xshashlikni ko‘ramiz:

aslida $L_k$ matritsa $G$ matritsaga ko‘paytirilmoqda; farqi shundaki, ko‘paytirish amalining o‘rniga minimumni, ichki amal sifatida esa ko‘paytirish o‘rniga qo‘shishni olamiz.

$$L_{k+1} = L_k \odot G,$$

bu yerda $\odot$ amali quyidagicha aniqlangan:

$$A \odot B = C~~\Longleftrightarrow~~C_{i j} = \min_{p = 1 \ldots n}\left(A_{i p} + B_{p j}\right)$$

Demak, masala yechimini o‘zgartirilgan ko‘paytma yordamida quyidagicha ifodalash mumkin:

$$L_k = \underbrace{G \odot \ldots \odot G}_{k~\text{marta}} = G^{\odot k}$$

O‘zgartirilgan ko‘paytma, ravshanki, assotsiativ bo‘lgani uchun, bu darajaga oshirishni ham [ikkilik darajaga oshirish](../algebra/binary-exp.md) yordamida samarali hisoblash mumkin.

Shunday qilib, bu yechim ham $O(n^3 \log k)$ murakkablikka ega.

## Masalalarni uzunligi ko‘pi bilan $k$ bo‘lgan yo‘llar uchun umumlashtirish {data-toc-label="Masalalarni uzunligi ko‘pi bilan k bo‘lgan yo‘llar uchun umumlashtirish"}

Yuqoridagi yechimlar belgilangan $k$ uchun masalalarni yechadi.

Biroq yechimlarni yo‘llarda ko‘pi bilan $k$ ta qirra bo‘lishiga ruxsat etilgan masalalar uchun ham moslashtirish mumkin.

Buni kirish grafini biroz o‘zgartirish orqali amalga oshirish mumkin.

Har bir tugunni ikkilantiramiz:

har bir $v$ tugun uchun yana bitta $v'$ tugun yaratamiz va $(v, v')$ qirra hamda $(v', v')$ ilmoqni qo‘shamiz.

$i$ dan $j$ gacha ko‘pi bilan $k$ ta qirrali yo‘llar soni $i$ dan $j'$ gacha aynan $k + 1$ ta qirrali yo‘llar soniga teng. Chunki uzunligi $m \le k$ bo‘lgan har bir $[p_0 = i,~p_1,~\ldots,~p_{m-1},~p_m = j]$ yo‘lni uzunligi $k + 1$ bo‘lgan $[p_0 = i,~p_1,~\ldots,~p_{m-1},~p_m = j, j', \ldots, j']$ yo‘lga akslantiruvchi biyeksiya mavjud.

Xuddi shu usulni ko‘pi bilan $k$ ta qirrali eng qisqa yo‘llarni hisoblash uchun ham qo‘llash mumkin.

Yana har bir tugunni ikkilantirib, yuqorida aytilgan ikki qirrani og‘irligi $0$ qilib qo‘shamiz.

