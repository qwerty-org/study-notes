# 01 — Vizya: Study Notes nima uchun kerak?

## Muammo

Ko'p odamlar kitobni o'qiydi (yoki "o'qib chiqdim" deydi), lekin:

1. ❌ Kitobni **umuman tushunmaydi** — murakkab til, terminlar
2. ❌ Tushunganda ham — **hayotda qanday qo'llashni bilmaydi**
3. ❌ Bir haftadan keyin **unutadi** — takrorlash yo'q
4. ❌ "Nima uchun o'qiganimni bilmayman" — maqsadsiz o'qish

Klassik xulosa kitoblari (davlat, xulosa) muammoni hal qilmaydi:
ular faqat **mazmunni** beradi, **qo'llashni** emas.

## Yechim

Platforma kitobni **foydalanuvchiga moslashtirib beradi**:

```
Kitob (PDF/EPUB)
   │
   ▼  AI tahlili (agent rules orqali)
   │
   ├── 📌 Eng muhim 10-20 g'oya (har biri: nima → nima uchun → qanday)
   ├── 📖 Terminlar lug'ati (oddiy, tushunarli tilda)
   ├── 🎯 Quizlar (nazariy + vaziyatli savollar)
   ├── 🌍 "Qachon qo'llash" — real vaziyat → to'g'ri harakat
   └── 🔁 Kunlik takrorlash rejasi (kun 1, 3, 7, 14...)
   │
   ▼  Foydalanuvchi
   │
   ✅ O'qiydi → tushunadi → quizda tekshiradi →
   → hayotda qo'llaydi → unutmaydi
```

## Eng muhim farqimiz: "Qo'llash" bosqichi

Har bir qoida uchun format:

> **Vaziyat:** Xodim ishdan keyin xato qildi va rahbarlik chaqirdi.
>
> **To'g'ri harakat:** "I" gapirish texnikasi → *"Men bu ishni kechqurun
> qayta ko'rib chiqaman"* (o'zingizni emas, xatoqorni ayblamasdan)
>
> ✅ To'g'ri javob / ❌ Noto'g'ri javob (va nima uchun)

Bu qism platformaning yuragi — boshqa xulosa kitoblarida bunday yo'q.

## Maqsadli auditoriya

Barchasi (boshlanish uchun cheklash yo'q):

- 📚 Oddiy kitob o'quvchilari — o'qiydi, lekin qo'llashni bilmaydi
- 🎓 Talabalar/o'qituvchilar — darslik, imtihonga tayyorlanish
- 🏢 Jamoalar — kompaniya kitob o'qish klubi (keyinchalik)

Birinchi versiya: **shaxsiy rivoj, psixologiya, biznes** kitoblari
(ularda "qo'llash" eng dolzarb).

## Asosiy printsiplar

1. **Hisobsiz ishlaydi** — login, email, parol yo'q (lokal dastur)
2. **Bir marta bosing → ishlaydi** — texnik tushuncha talab qilinmaydi
   (server, database, backend — foydalanuvchi bilmaydi)
3. **Butunlay bepul va open source** — pul topish maqsad emas
4. **Ma'lumot kompyuterdan chiqmaydi** — AI API'siz ishlash ham mumkin (Ollama)
5. **AI qoidasi — matnli fayl** — `.md` agent rules, kod emas
6. **O'zbek tilida to'liq** — interfeys va AI javoblari (bozordagi bo'shliq)

## Muvaffaqiyat mezonlari (keyinchalik o'lchaymiz)

- 🎯 Foydalanuvchi 5 daqiqada birinchi kitob tahliliga yetib boradi
- 🔥 Foydalanuvchi kamida 7 kun ketma-kun qaytadi (streak)
- ✅ Foydalanuvchi kamida 1 ta qoidani hayotda qo'llaganini belgilaydi
- 🎯 Quiz o'rtacha balli 70%+ (tahlil sifati yuqori demak)
