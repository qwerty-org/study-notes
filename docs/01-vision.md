# 01 — Vizya: Study Notes nima uchun kerak?

Study Notes — kitobni qisqartirib beruvchi xulosa generatori emas. Bu
foydalanuvchining o'z kompyuterida ishlaydigan lokal dastur bo'lib, uning
maqsadi o'quvchini **tushundim → tekshirdim → qo'lladim → eslab qoldim**
tsiklidan o'tkazishdir.

## Muammo

Ko'p odam kitobni oxirigacha o'qiydi, lekin undan foyda olmaydi:

1. **Tushunmaydi** — murakkab til va tanish bo'lmagan terminlar to'siq bo'ladi.
2. **Qo'llashni bilmaydi** — nazariyani o'z hayotidagi vaziyatga bog'lay olmaydi.
3. **Unutadi** — takrorlash tizimi yo'qligi sababli o'qiganlari tezda yo'qoladi.
4. **Maqsadsiz o'qiydi** — nimani o'zlashtirayotgani va bu nima uchun kerakligi
   noaniq.

Mavjud xulosa va qisqartma kitoblar asosan **mazmunni** yetkazadi;
"qachon va qanday qo'llash" degan savolga javob bermaydi. Shu bo'shliq
loyihaning asosini tashkil qiladi.

## Yechim

Kitob matni agent rules asosida AI bilan tahlil qilinib, foydalanuvchi uchun
darhol ishlatishga tayyor o'quv materialiga aylantiriladi:

```
Kitob (hozir: .md/.txt import; rejada: PDF/EPUB → Markdown)
   │
   ▼  Agent rules (.md fayllar) orqali AI tahlili
   │
   ├── 📌 Eng muhim g'oyalar — nima → nima uchun → qanday qo'llash
   ├── 📖 Terminlar lug'ati — oddiy, tushunarli tilda
   ├── 🎯 Vaziyatli quizlar — javob va uning sababi bilan
   ├── 🌍 "Qachon qo'llash" senariylari — vaziyat → to'g'ri harakat
   └── 🔁 Takrorlash navbati — interval asosida qaytarish
   │
   ▼  Foydalanuvchi
   │
   O'qiydi → tushunadi → quizda tekshiradi → hayotda qo'llaydi →
   → "qo'lladim" deb belgilaydi → takrorlaydi
```

## Eng muhim farqimiz: "Qo'llash" bosqichi

Har bir g'oya uchun asosiy format — bu nazariya emas, balki amaliy vaziyat:

> **Vaziyat:** Xodim ishdan keyin xato qildi va rahbar chaqirdi.
>
> **To'g'ri harakat:** "Men" gapirish texnikasi → *"Men bu ishni kechqurun
> qayta ko'rib chiqaman"* (o'zingizni emas, ishni muhokama qilish).
>
> ✅ To'g'ri javob / ❌ Noto'g'ri javob — sababi bilan.

Bu qism platformaning yuragi: u kitob sahifasidagi alohida tab va
"qo'lladim" jurnali sifatida amalga oshirilgan. Boshqa xulosa kitoblarida
bunday amaliy qatlam yo'q.

## Maqsadli auditoriya

Dastur dasturchi bo'lmagan, o'z kompyuterida mustaqil ishlaydigan
o'quvchilarga mo'ljallangan. Hisob yaratish talab qilinmaydi — mahalliy
profil yetarli.

- **Asosiy auditoriya:** shaxsiy rivojlanish, psixologiya va biznes
  adabiyotini o'qiyotganlar — bu sohalarda "qo'llash" bosqichi eng dolzarb.
- **Qo'shimcha:** talabalar va o'qituvchilar — darslik o'zlashtirish va
  imtihonga tayyorlanish.
- **Keyinchalik (Bosqich 2+):** kitob o'qish klublari, ustoz/professor
  profillari va obuna tizimi (`docs/02`, `docs/08`).

Birinchi versiya shaxsiy foydalanishga qaratilgan: server, sync va umumiy
kutubxona rejada qolgan.

## Asosiy printsiplar

1. **Hisobsiz va lokal** — login, email, parol yo'q; profil va ma'lumotlar
   foydalanuvchi kompyuterida saqlanadi.
2. **Bir marta bosing → ishlaydi** — server, database kabi texnik
   tushunchalar foydalanuvchiga ko'rinmaydi; har ekranda bitta asosiy
   harakat aniq.
3. **Bepul va ochiq kod** — monetizatsiya yo'q, kod MIT litsenziyasi ostida.
4. **Maxfiylik foydalanuvchi tanlovida** — Ollama bilan ishlaganda matn
   kompyuterdan chiqmaydi; bulutli API kaliti (Gemini / OpenAI / Groq)
   ishlatilganda tahlil uchun matn shu provayderga yuboriladi. Qaysi rejim
   ishlatilishini foydalanuvchi o'zi belgilaydi.
5. **AI qoidasi — matnli fayl** — agent xulqi kodda emas,
   `agent-rules/*.md` fayllarida yoziladi; qoidani o'zgartirish kodni
   o'zgartirishni talab qilmaydi.
6. **O'zbek tili birinchi** — interfeys va AI javoblari o'zbek tilida;
   boshqa tillar uchun til tanlagich hali qo'shilmagan (Bosqich 2+).
7. **Ma'lumot foydalanuvchiniki** — Sozlamalarda eksport, import va
   tozalash, shuningdek AI ulanishini tekshirish mavjud; xatolar tushunarli
   xabar bilan ko'rsatiladi.

## Muvaffaqiyat mezonlari

Kuzatish ko'rsatkichlari (o'lchash tizimi keyinchalik qo'shiladi):

- Foydalanuvchi dastlabki sozlashdan keyin 5 daqiqa ichida birinchi kitob
  tahliliga yetib boradi.
- Kamida 7 kun ketma-ket qaytadi (streak).
- Kamida bitta qoidani hayotda qo'llaganini "qo'lladim" jurnalida belgilaydi.
- Quiz o'rtacha balli 70% dan yuqori — bu tahlil sifati uchun ko'rsatkich.

## Hozirgi holat (2026-11)

Lokal MVP asosan tayyor: onboarding, kutubxona (ko'p fayl importi, qidiruv),
kitob sahifasi (6 tab), quiz sessiyasi, takrorlash, natijalar va sozlamalar
ishlaydi; demo kitob oldindan tahlil qilingan holda yetkaziladi. Foydalanuvchi
hozir `.md`/`.txt` fayllarni qo'sha oladi.

**Hali yo'q (Bosqich 2+):** PDF/EPUB konvertatsiya, AI ustoz chat, to'liq
FSRS, til tanlagich va eslatma vaqti. Tafsilotlar `docs/04-ui-ux.md` ning
"Amalga oshirilgan holat" bo'limida keltirilgan.
