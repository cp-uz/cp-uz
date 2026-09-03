> Ushbu shart IOI 2026 rasmiy task archive’idagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Barchin va Charos 2N×2M o'lchamdagi, kvadrat kataklardan iborat jadvalda o'yin
o'ynashmoqda. Qatorlar yuqoridan pastga 0 dan 2N−1 gacha, ustunlar esa chapdan o'ngga 0
dan 2M−1 gacha raqamlangan. 0≤i <2N va 0≤j <2M uchun, i qatoridagi va j ustunidagi
katakchani (i,j) bilan belgilaymiz.
Barchin Charosga birma-bir N⋅M ta blok beradi. Har bir blok to'rtta 1×1 o'lchamdagi katak
lardan iborat 2×2 kvadrat shaklida bo'ladi. Barchin blokning har bir katagini qora yoki oq rangga
bo'yagan va hech bo'lmaganda bitta katak oq ekanligiga kafolat beradi.
Charos har bir blokni qabul qilgandan so'ng darhol, keyin qanday blokni olishini bilmasdan, uni
jadval ustiga qo'yadi. Bloklarni aylantirib bo'lmaydi. Har bir blok jadval ichiga to'liq joylashtirilishi,
ya'ni, to'rtta katakchasi ham jadval ichida joylashishi kerak. Bundan tashqari, har bir blokning
yuqori chap qismidagi katak jadvalning qator va ustun koordinatalari juft bo'lgan katakchasida
bo'lishi kerak. Jadvalning har bir katagi ko'pi bilan bitta blok tomonidan qoplanadi.
Agar biron bir blok qo'yilgandan so'ng, jadvalda to'rtta qora katakcha bilan qoplangan 2×2
kvadrat mavjud bo'lsa, Barchin o'yinda g'alaba qozonadi. Boshqacha qilib aytganda, qaysidir a
(0≤a<2N−1) va b (0≤b<2M−1) uchun, agar (a,b), (a+1,b), (a,b+1), (a+1,b+1)
katakchalarining barchasi qora rang bilan qoplangan bo'lsa Barchin g'alaba qozonadi. a va b
indekslari juft bo'lishi shart emas.
Agar Charos barcha N⋅M ta blokni Barchin hech qachon yutmaydigan qilib joylashtirsa, u g'alaba
qozonadi. N⋅M ta blokni joylashtirgandan so'ng jadval to'liq qoplanishini unutmang.
Sizning vazifangiz Charosning o'yinda g'alaba qozonishi uchun strategiyani shakllantirishdir.
Optimal strategiya tanlanganda, berilgan cheklovlar ostida, Charos keyinchalik oladigan
bloklarining ranglaridan qat'i nazar, g'alaba qozonishini kafolatlash mumkin.

## Amalga oshirish tafsilotlari

Siz ikkita protsedurani shakllantirishingiz kerak:
void init(int N, int M)
N: Jadvaldagi qatorlar sonining yarmi.
M: Jadvaldagi ustunlar sonining yarmi.
Ushbu protsedura har bir testda dasturning boshida bir marta chaqiriladi.
std::pair<int, int> receive_block(int TL, int TR, int BL, int BR)
TL , TR , BL , BR : rasmda ko'rsatilganidek, joriy blokning mos ravishda yuqori chap,
yuqori o'ng, pastki chap va pastki o'ng kataklarining ranglari. Har bir qiymat 0 (oq) yoki 1
(qora) bo'lishi mumkin.
Ushbu protsedura har bir test uchun init protsedurasiga chaqiruvdan so'ng aynan N⋅M
marta chaqiriladi.
Ushbu protsedura (i,j) butun sonlar juftligini qaytarishi kerak, bu yerda blokning yuqori chap
qismi joylashtirilishi kerak bo'lgan katakning i qator koordinatasini va j ustun koordinatasini
anglatadi. i va j ikkalasi ham juft bo'lishi kerak va 2×2 maydoni avval joylashtirilgan bloklar bilan
bir-birining ustiga chiqmasligi kerak.
Agar receive_block bu talablarga javob bermaydigan juftlikni qaytarsa yoki blok qo'yilgandan
so'ng, 2×2 kvadrat qora rangli katakchalar bilan to'liq qoplanib qolsa, grader darhol dasturingizni
to'xtatadi va ushbu test uchun Output isn't correct degan verdikt qaytaradi.
Graderning xatti-harakati adaptive emas. Bu shuni anglatadiki, Barchin Charosga beradigan
bloklar ketma-ketligi init chaqirilishidan oldin aniqlagan bo'ladi.

## Cheklovlar

Har bir blok uchun S uning to'rtta katakchasi orasidagi qora ranglilari soni bo'lsin. Ya'ni,
S=TL+TR+BL+BR .
1≤N,M≤100
Har bir blok uchun 0≤S≤3.

## Qism masalalar

Subtask Ball Qo'shimcha Cheklovlar
1 6 Har bir blok uchun S=1, va N=2.
2 16 Har bir blok uchun S=3. N=M, N ning qiymati juft, va bo'lishi mumkin
bo'lgan to'rtta holatning har biri marta ishtirok etadi.
3 10 Har bir blok uchun S=1.
4 29 Har bir blok uchun S≤2.
5 39 Qo'shimcha cheklovlarsiz.

## Misol

N=1 va M=2 bo'lgan o'yinni ko'rib chiqaylik, ya'ni jadvalda 2 ta qator va 4 ta ustun mavjud.
Grader birinchi bo'lib murojaat qiladi:
init(1, 2)
Dastlab, barcha kataklar bo'sh. Jadval quyidagi ko'rinishda bo'ladi:
Joylashtirish uchun N⋅M=2 ta blok mavjud. Aytaylik, Barchin yuqori o'ng burchakda uchta qora
va bitta oq katakchadan iborat blokni beradi. Grader chaqiradi:
receive_block(1, 0, 1, 1)
Charos ushbu blokni jadvalning chap tomoniga joylashtirishga qaror qiladi, va (0,0) qaytaradi.
Jadval quyidagi ko'rinishga o'zgaradi:
4N2
Keyin Barchin yuqori chap burchakda uchta qora katakcha va bitta oq katakchadan iborat yana
bitta blokni beradi:
receive_block(0, 1, 1, 1)
2×2 blokining yuqori chap burchagi bo'lib xizmat qilishi mumkin bo'lgan juft qator va juft ustunli
yagona bo'sh katak (0,2) dir, shuning uchun Charos (0,2) qaytaradi. Jadval quyidagi holatga
keladi:
Hech qanday 2×2 kvadrat qora rang bilan to'liq qoplanmagan, shuning uchun Charos barcha
bloklarni Barchin yutmaydigan qilib joylashtirdi. Charos o'yinda g'alaba qozondi.

## Namuna grader

## Kiruvchi ma’lumotlar formati

N M
TL[0] TR[0] BL[0] BR[0]
TL[1] TR[1] BL[1] BR[1]
...
TL[NM-1] TR[NM-1] BL[NM-1] BR[NM-1]

## Chiquvchi ma’lumotlar formati

R[0] C[0]
R[1] C[1]
...
R[NM-1] C[NM-1]
Bu yerda R[k] va C[k] - k-chaqiruvda receive_block funksiyasi qaytargan butun sonlar juftligi.
