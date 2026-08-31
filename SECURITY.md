# Xavfsizlik siyosati

## Qo‘llab-quvvatlanadigan holat

Xavfsizlik tuzatishlari `main` branch va undan chiqarilgan amaldagi release uchun qabul qilinadi. Repository’da alohida versioned release e’lon qilinmaguncha eski commitlar alohida qo‘llab-quvvatlanmaydi.

## Zaiflik haqida xabar berish

Zaiflikni public issue, discussion yoki chatga yozmang. GitHub repository’ning **Security → Report a vulnerability** oqimidan foydalaning. U mavjud bo‘lmasa, [Product Owner](https://t.me/asadullo_ganiev) bilan private xabarda bog‘lanib, batafsil exploit yoki secretni yuborishdan oldin xavfsiz almashuv kanalini kelishib oling.

Xabarda imkon qadar quyidagilar bo‘lsin:

- ta’sirlangan route, commit SHA yoki komponent;
- takrorlash uchun minimal qadamlar;
- kutilgan va real natija;
- ehtimoliy ta’sir va zarur shartlar;
- mavjud bo‘lsa, xavfsiz proof-of-concept va tavsiya etilgan tuzatish.

Token, shaxsiy ma’lumot yoki production secretni xabarga qo‘shmang. Begona ma’lumotni ko‘rmang, o‘zgartirmang va yuklab olmang; availability’ga zarar yetkazuvchi avtomatlashtirilgan test o‘tkazmang.

Maintainerlar uch ish kuni ichida qabul qilinganini bildirishga va yetti ish kuni ichida dastlabki triage berishga intiladi. Tuzatish va oshkor qilish muddati ta’sir hamda release xavfiga qarab kelishiladi. Muammo tuzatilmaguncha tafsilotlarni ommaviy tarqatmaslik so‘raladi.

## Scope

Auth/session, permission bypass, XSS, CSRF, injection, secret exposure, kontent yaxlitligi, dependency va deployment boundary buzilishi security scope’ga kiradi. Oddiy kontent xatosi, tarjima taklifi yoki ishlash tezligi bo‘yicha umumiy taklif esa odatiy issue/contribution oqimiga kiradi.
