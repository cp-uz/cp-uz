---
article_id: string--expression_parsing
---
# Ifodani tahlil qilish

Sonlar va turli operatorlardan iborat matematik ifodani saqlovchi satr berilgan.
Satr uzunligi $n$ bo‘lsa, uning qiymatini $O(n)$ vaqtda hisoblash kerak.

Bu yerda muhokama qilinadigan algoritm ifodani bevosita yoki bilvosita **teskari polyak yozuvi**ga o‘giradi va hosil bo‘lgan ifodani hisoblaydi.

## Teskari polyak yozuvi

Teskari polyak yozuvi — matematik ifodalarni operatorlari operandlardan keyin joylashadigan shaklda yozish usuli.
Masalan, quyidagi ifoda

$$a + b * c * d + (e - f) * (g * h + i)$$

teskari polyak yozuvida quyidagicha yoziladi:

$$a b c * d * + e f - g h * i + * +$$

Teskari polyak yozuvi avstraliyalik faylasuf va kompyuter fanlari mutaxassisi Charles Hamblin tomonidan 1950-yillarning o‘rtalarida, polyak matematigi Jan Łukasiewicz 1920-yilda taklif qilgan polyak yozuvi asosida ishlab chiqilgan.

Teskari polyak yozuvining qulayligi shundaki, bu shakldagi ifodani chiziqli vaqtda **juda oson hisoblash** mumkin.
Dastlab bo‘sh stek olamiz.
Teskari polyak yozuvidagi operand va operatorlarni ketma-ket ko‘rib chiqamiz.
Joriy element son bo‘lsa, uning qiymatini stek tepasiga qo‘yamiz; operator bo‘lsa, stek tepasidagi ikkita elementni olamiz, amalni bajaramiz va natijani yana stek tepasiga qo‘yamiz.
Oxirida stekda aynan bitta element qoladi; u ifoda qiymatidir.

Ravshanki, bunday hisoblash $O(n)$ vaqtda ishlaydi.

## Sodda ifodalarni tahlil qilish

Hozircha soddalashtirilgan masalani ko‘ramiz:
barcha operatorlar **binar**, ya’ni ikkita argument oladi, va barchasi **chapdan assotsiativ**, ya’ni ustuvorliklar teng bo‘lsa, amallar chapdan o‘ngga bajariladi.
Qavslardan foydalanish mumkin.

Ikkita stek tashkil qilamiz: biri sonlar, ikkinchisi operatorlar va qavslar uchun.
Dastlab ikkala stek ham bo‘sh.
Ikkinchi stek uchun barcha amallar qat’iy kamayuvchi ustuvorlik bo‘yicha tartiblangan bo‘lishi shartini saqlaymiz.
Stekda qavslar bo‘lsa, operatorlarning har bir bloki — bitta qavs juftiga mos qism — alohida tartiblanadi; butun stekning o‘zi tartiblangan bo‘lishi shart emas.

Ifoda belgilarini chapdan o‘ngga ko‘rib chiqamiz.
Joriy belgi raqam bo‘lsa, butun son qiymatini sonlar stekiga qo‘yamiz.
Joriy belgi ochuvchi qavs bo‘lsa, uni operatorlar stekiga qo‘yamiz.
Joriy belgi yopuvchi qavs bo‘lsa, ochuvchi qavsgacha stekdagi barcha operatorlarni bajaramiz, ya’ni qavs ichidagi barcha amallarni hisoblaymiz.
Joriy belgi operator bo‘lsa, stek tepasida shu operator bilan teng yoki undan yuqori ustuvorlikdagi operator turgan ekan, o‘sha amalni bajaramiz; keyin yangi operatorni stekka qo‘yamiz.

Butun satr qayta ishlangach, stekda ayrim operatorlar qolishi mumkin; ularni ham bajarib chiqamiz.

Quyida $+$, $-$, $*$ va $/$ operatorlari uchun shu usul implementatsiyasi keltirilgan:

```{.cpp file=expression_parsing_simple}
bool delim(char c) {
    return c == ' ';
}

bool is_op(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/';
}

int priority (char op) {
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/')
        return 2;
    return -1;
}

void process_op(stack<int>& st, char op) {
    int r = st.top(); st.pop();
    int l = st.top(); st.pop();
    switch (op) {
        case '+': st.push(l + r); break;
        case '-': st.push(l - r); break;
        case '*': st.push(l * r); break;
        case '/': st.push(l / r); break;
    }
}

int evaluate(string& s) {
    stack<int> st;
    stack<char> op;
    for (int i = 0; i < (int)s.size(); i++) {
        if (delim(s[i]))
            continue;
        
        if (s[i] == '(') {
            op.push('(');
        } else if (s[i] == ')') {
            while (op.top() != '(') {
                process_op(st, op.top());
                op.pop();
            }
            op.pop();
        } else if (is_op(s[i])) {
            char cur_op = s[i];
            while (!op.empty() && priority(op.top()) >= priority(cur_op)) {
                process_op(st, op.top());
                op.pop();
            }
            op.push(cur_op);
        } else {
            int number = 0;
            while (i < (int)s.size() && isalnum(s[i]))
                number = number * 10 + s[i++] - '0';
            --i;
            st.push(number);
        }
    }

    while (!op.empty()) {
        process_op(st, op.top());
        op.pop();
    }
    return st.top();
}
```

Shunday qilib, ifoda qiymatini $O(n)$ vaqtda hisoblashni o‘rgandik; bunda teskari polyak yozuvidan bilvosita foydalandik.
Yuqoridagi implementatsiyani ozgina o‘zgartirib, ifodaning teskari polyak yozuvidagi aniq ko‘rinishini ham olish mumkin.

## Unar operatorlar

Endi ifodada **unar** operatorlar, ya’ni bitta argument oladigan operatorlar ham bor deb faraz qilaylik.
Unar plyus va unar minus bunga odatiy misol.

Bu holdagi farqlardan biri — joriy operator unar yoki binar ekanini aniqlashimiz kerak.

Unar operator oldidan doimo boshqa operator, ochuvchi qavs yoki hech narsa kelishini — agar u ifoda boshida turgan bo‘lsa — kuzatish mumkin.
Aksincha, binar operator oldidan har doim operand, ya’ni son, yoki yopuvchi qavs keladi.
Demak, keyingi operator unar bo‘lishi mumkinmi-yo‘qmi belgilab borish oson.

Bundan tashqari, unar va binar operatorlarni turlicha bajarish kerak.
Unar operator ustuvorligini barcha binar operatorlar ustuvorligidan yuqori tanlash lozim.

Yana ayrim unar operatorlar, masalan unar plyus va unar minus, aslida **o‘ngdan assotsiativ** ekanini hisobga olish kerak.

## O‘ngdan assotsiativlik

O‘ngdan assotsiativlik ustuvorliklar teng bo‘lganda operatorlar o‘ngdan chapga hisoblanishini anglatadi.

Yuqorida aytilganidek, unar operatorlar odatda o‘ngdan assotsiativ.
Darajaga oshirish ham o‘ngdan assotsiativ operatorga misol: $a \wedge b \wedge c$ odatda $(a^b)^c$ emas, $a^{b^c}$ deb tushuniladi.

O‘ngdan assotsiativ operatorlarni to‘g‘ri qayta ishlash uchun nima o‘zgarishi kerak?
O‘zgarish juda kichik.
Ustuvorliklar teng bo‘lsa, o‘ngdan assotsiativ amal bajarilishini keyinga qoldiramiz.

Faqat quyidagi satrni

```cpp
while (!op.empty() && priority(op.top()) >= priority(cur_op))
```

bunga almashtirish kerak:

```cpp
while (!op.empty() && (
        (left_assoc(cur_op) && priority(op.top()) >= priority(cur_op)) ||
        (!left_assoc(cur_op) && priority(op.top()) > priority(cur_op))
    ))
```

Bu yerda `left_assoc` operator chapdan assotsiativ ekanini aniqlaydigan funksiya.

Quyida binar $+$, $-$, $*$, $/$ operatorlari hamda unar $+$ va $-$ operatorlari uchun implementatsiya berilgan.

```{.cpp file=expression_parsing_unary}
bool delim(char c) {
    return c == ' ';
}

bool is_op(char c) {
    return c == '+' || c == '-' || c == '*' || c == '/';
}

bool is_unary(char c) {
    return c == '+' || c=='-';
}

int priority (char op) {
    if (op < 0) // unary operator
        return 3;
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/')
        return 2;
    return -1;
}

void process_op(stack<int>& st, char op) {
    if (op < 0) {
        int l = st.top(); st.pop();
        switch (-op) {
            case '+': st.push(l); break;
            case '-': st.push(-l); break;
        }
    } else {
        int r = st.top(); st.pop();
        int l = st.top(); st.pop();
        switch (op) {
            case '+': st.push(l + r); break;
            case '-': st.push(l - r); break;
            case '*': st.push(l * r); break;
            case '/': st.push(l / r); break;
        }
    }
}

int evaluate(string& s) {
    stack<int> st;
    stack<char> op;
    bool may_be_unary = true;
    for (int i = 0; i < (int)s.size(); i++) {
        if (delim(s[i]))
            continue;
        
        if (s[i] == '(') {
            op.push('(');
            may_be_unary = true;
        } else if (s[i] == ')') {
            while (op.top() != '(') {
                process_op(st, op.top());
                op.pop();
            }
            op.pop();
            may_be_unary = false;
        } else if (is_op(s[i])) {
            char cur_op = s[i];
            if (may_be_unary && is_unary(cur_op))
                cur_op = -cur_op;
            while (!op.empty() && (
                    (cur_op >= 0 && priority(op.top()) >= priority(cur_op)) ||
                    (cur_op < 0 && priority(op.top()) > priority(cur_op))
                )) {
                process_op(st, op.top());
                op.pop();
            }
            op.push(cur_op);
            may_be_unary = true;
        } else {
            int number = 0;
            while (i < (int)s.size() && isalnum(s[i]))
                number = number * 10 + s[i++] - '0';
            --i;
            st.push(number);
            may_be_unary = false;
        }
    }

    while (!op.empty()) {
        process_op(st, op.top());
        op.pop();
    }
    return st.top();
}
```

