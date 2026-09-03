> Ushbu shart IOI 2026 rasmiy task archive’idagi O‘zbekiston delegatsiyasi tekshirgan o‘zbekcha PDF asosida berildi. Diagramma va ilovalar uchun quyidagi rasmiy PDF havolasidan foydalaning.

Toshkent hokimi mashhur Magic City ko'ngilochar bog'ini qayta loyihalashni xohlaydi. Sizga musbat
butun son K berilgan va vazifangiz quyidagi talablarga javob beradigan bog'ni loyihalashdan iborat.
Butun son N (atraksionlar soni) tanlang va atraksionlarni 0 dan N−1 gacha bo'lgan butun
sonlar bilan belgilang.
Har xil 2 ta attraksion orasiga ikki tomonlama yo'laklar qo'shing. 2 ta atraksion orasida bir
nechta yo'laklar bo'lishi mumkin. Yo'laklar yordamida har qanday 2 ta attraksiondan bir
biriga borish imkoni bo'lishi shart emas.
0≤i<N bo'lgan har bir i uchun i-atraksionga T[i] turini belgilang. 0 dan 2K−1 gacha
raqamlangan 2K ta tur mavjud. Har bir tur kamida bitta atraksionga belgilanishi kerak. Har xil
atraksionlar bir xil turga ega bo'lishi mumkin.
Bozor tadqiqotlari shuni ko'rsatdiki:
1. Har bir sayohatchi bir xil atraksionga ketma-ket tashrif buyurmasdan 3 ta atraksionga borishni
xohlaydi.
2. Mehmonlar ko'p yo'laklarga ega bo'lgan attraksionlarni yoqtirmaydilar.
Shahar hokimi barcha potentsial sayohatchilarni mamnun qilishni xohlaydi va dizayningizga ikki shart
qo'yadi.
Turlarning tartibli uchligini (t ,t ,t ) 0≤t ,t ,t <2K qiziqarli deb ataylik, agar t ≠t va t ≠t
bo'lsa. t ning t ga teng bo'lishi mumkinligini yodda tuting. Shuning uchun, 2K⋅(2K−1) ta
qiziqarli uchlik mavjud.
Shart 1: Har bir qiziqarli uchlik (t ,t ,t ) uchun uchta atraksion a , a , a (0≤a ,a ,a <N) mavjud
bo'lishi kerak, quyidagi shartlarning hammasini bajargan holda:
a ,a ,a turlari t ,t ,t bilan mos keladi. Ya'ni, T[a ]=t , T[a ]=t va T[a ]=t .
a va a orasida yo'lak bor.
a va a orasida yo'lak bor.
a va a orasida yo'lak bo'lishi yoki bo'lmasligi ahamiyatsiz. Shuningdek, e'tiborga olingki, t =t
bo'lganda, a va a atraksionlari bir xil bo'lishi mumkin.
Shart 2: Har bir attraksion eng ko'pi bilan K ta yo'laklarga ulangan bo'lishi mumkin.
Ushbu vazifa qisman baholash (partial scoring) li 50 ta output-only subtasklardan iborat. Har bir
subtask K ning ma'lum bir qiymatiga mos keladi va siz shu K qiymati uchun yuqoridagi barcha
1 2 3 1 2 3 1 2 2 3
1 3 2
1 2 3 1 2 3 1 2 3
1 2 3 1 2 3 1 1 2 2 3 3
1 2
2 3
1 3 1 3
1 3
shartlarni bajaradigan bog'ni loyihalashingiz kerak. Sizning ballaringiz yechimingizdagi attraksionlar
soniga bog'liq – kamroq attraksionlar yuqoriroq ball olishi mumkin.

## Amalga oshirish tafsilotlari

Yechimingizni topshirishning ikki usuli mavjud va har bir subtask uchun ulardan birini ishlatishingiz
mumkin:
Protseduraga murojaat
Chiqish fayli (output file)
Yechimingizni protseduraga murojaat usuli orqali topshirish uchun quyidagi protsedurani yozib
chiqishingiz kerak.
std::pair<std::vector<int>, std::vector<std::pair<int, int>>> construct(int K)
K: attraksion turlari sonining yarmi va har bir attraksionga ulangan yo'laklarning maksimal
ruxsat etilgan soni.
Ushbu protsedura har bir subtask uchun aynan bir marta chaqiriladi.
Protsedura ko'ngilochar bog'ni tasvirlovchi (T,E) juftligini qaytarishi kerak. M ni bog'ingizdagi
yo'laklar soni deb olaylik.
T: N uzunlikdagi massiv bo'lib, atraksionlar turlarini tasvirlaydi.
E: piyoda yo'laklarni tasvirlovchi uzunligi M bo'lgan massiv. Har bir 0≤j <M uchun
E[j]=(U[j],V[j]) atraksion U[j] va atraksion V[j] o'rtasidagi ikki tomonlama yo'lakni
anglatadi.
Yechimingiz chiqish fayli orqali yuborish uchun quyidagi formatda matnli fayl yarating va
yuboring:
N M
T[0] T[1] ... T[N-1]
U[0] V[0]
U[1] V[1]
...
U[M-1] V[M-1]
E'tibor bering, yechimingiz to'g'ri deb hisoblanishi uchun quyidagi cheklovlarga javob berishi kerak:
N≤2000
0≤T[i]<2K har bir 0≤i<N uchun, va har bir tur kamida bitta atraksionga belgilangan
bo'lishi kerak.
Har bir 0≤j <M uchun 0≤U[j],V[j]<N va U[j]≠V[j].
Shart 1 va Shart 2 bajarilishi kerak.

## Cheklovlar

1≤K≤50
Scoring
1 dan 50 gacha bo'lgan har bir K uchun bittadan, jami 50 ta subtask mavjud. i-subtask uchun, K ning
qiymati i ga teng.
Har bir subtaskning balli S va bog'dagi mo'ljal qilingan atraksionlar soni P quyidagi jadvalga muvofiq
belgilanadi.
Subtasklar S P
1 1 2
2 8 12
3 9 24
4 9 40
5 9 50
6 - 10 4 12⋅K
11 - 12 3 12⋅K
13 - 50 1 12⋅K
Har bir subtask uchun, agar sizning yechimingiz to'g'ri ko'ngilochar bog' loyihasini tasvirlamasa, unda
yechimingizning balli 0 ga teng bo'ladi (CMSda Output isn't correct deb xabar qilinadi).
Aks holda, ballaringiz quyidagi tarzda N va S hamda P parametrlari asosida hisoblanadi:
Holat Ball
N≤P S
P<N≤2P (0.4+0.3⋅ )⋅S
2P<N≤2000 (0.1+0.3⋅ )⋅S

## Misol

Quyidagi chaqiruvni ko'rib chiqaylik:
construct(1)
P2P−N
N2P
Ushbu misolda K=1, shuning uchun 2K=2 ta turdagi atraksionlar mavjud. Quyidagi rasm N=4
ta atraksion va M=2 ta yo'lakli to'g'ri yechimni ko'rsatadi. 0,1,2 atraksionlari 0 turiga kiradi, atraksion
3 esa 1 turiga kiradi.
Bu yerda ikki qiziqarli uchlik mavjud:
(0,1,0) turidagi uchlik uchun (a ,a ,a )=(2,3,2) ni tanlashimiz mumkin.
(1,0,1) turidagi uchlik uchun (a ,a ,a )=(3,2,3) ni tanlashimiz mumkin.
Bu shart 1 qanoatlantirilganligini anglatadi.
Protsedura ([0,0,0,1],[(0,1),(2,3)]) juftligini qaytarishi mumkin. E'tibor bering, ushbu misol uchun
taqdim etilgan yechim K=1 uchun eng yaxshi bo'lmasligi mumkin.

## Namuna grader

## Kiruvchi ma’lumotlar formati

K

## Chiquvchi ma’lumotlar formati

N M
T[0] T[1] ... T[N-1]
U[0] V[0]
U[1] V[1]
...
U[M-1] V[M-1]
Graderning chiqish natijasi "output format" talabiga mos kelishi kerakligini unutmang.
1 2 3
1 2 3
