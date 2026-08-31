# cp.uz frontend

React, TypeScript, Vite va MUI asosidagi cp.uz o‘quv platformasi frontend qismi.

## Lokal ishga tushirish

Django backend `127.0.0.1:8000` da ishlab turgan bo‘lishi kerak. Keyin:

```sh
npm ci
npm run dev
```

Frontend `http://127.0.0.1:8081` da ochiladi. Vite `/api` va `/media`
so‘rovlarini lokal Django serveriga avtomatik uzatadi; Docker, alohida wrapper
script yoki `VITE_API_URL` kerak emas.

## Tekshiruv

```sh
npm run lint
npm run build
```

Markdown adapteri uchun qo‘shimcha tekshiruvlar:

```sh
npm run test:markdown
```

## Production API manzili

Production buildda API bazasi kerak bo‘lsa `VITE_API_URL` orqali berilishi mumkin.
Docker deployment konfiguratsiyasi uni `/api/v1` qilib o‘rnatadi.
