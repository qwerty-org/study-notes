# 09 — Ochiq savollar va xatarlar

> Har bir savol javobsiz qolmasligi uchun: **qaror / mas'ul / sana** qo'shiladi.
> Javob topilganda shu faylga yozamiz (yoki tegishli hujjatga).

## A. Bosqich 0 uchun javob kerak (tez orada)

| # | Savol | Variantlar | Holat |
|---|-------|-----------|-------|
| A1 | **Pilot qaysi kitob?** (formatni sinash uchun) | Atomic Habits / o'zbek tilidagi kitob / boshqa | ⬜ ochiq |
| A2 | **Pilot tili?** | Inglizcha (AI sifati yuqori) / o'zbekcha (auditoriyaga yaqin) | ⬜ ochiq |
| A3 | **Qaysi provider bilan boshlaymiz?** | Gemini (bepul, oson) / Groq (bepul, tez) / OpenAI | ⬜ ochiq |
| A4 | **Desktop framework yakuniy?** | Tauri ⭐ / Electron (fallback) — 1 haftalik prototipda sinab qaror | ⬜ ochiq |
| A5 | **Backend tili?** | Rust (Tauri bilan) / Node.js (UI bilan bir tilda) | ⬜ ochiq |
| A6 | **Repo nomi?** | `study-notes` / boshqa | ⬜ ochiq |

## B. Dizayn savollari

| # | Savol | Holat |
|---|-------|-------|
| B1 | Ranglar palitrasini yakuniy qilish (docs/04 taxminiy) | ⬜ |
| B2 | Logotip / brend nomi yakuniy? (hozircha: Study Notes) | ⬜ |
| B3 | Ikkinchi til: English default qilaymi, o'zbekcha qoldaymi? | ⬜ |
| B4 | Yosh auditoriya (o'smirlar/talabalar/kattalar) — UI uslubiga ta'sir qiladi | ⬜ |

## C. Texnik xatarlar

| Xatar | Daraja | Yechim | Holat |
|-------|--------|--------|-------|
| C1 | ⚠️ Yuqori | PDF konvertatsiya sifati past chiqishi | Bosqich 0'da 4 xil faylda sinash (docs/07) |
| C2 | ⚠️ Yuqori | AI tahlil sifati qoniqarsiz | Agent rules + few-shot; pilot kitobda qo'lda baholash |
| C3 | O'rtacha | Skan PDF'lar ishlamaydi | Bosqich 0'da qaror: OCR keyingroq, hozir ogohlantirish |
| C4 | O'rtacha | Tauri'da Rust to'siq bo'lsa | UI'ni ajratib qo'yganmiz — Electron'ga fallback |
| C5 | Past | Windows SmartScreen ogohlantirishi | Avval portable .zip; keyin code signing |
| C6 | Past | API narxi (agar katta kitob bo'lsa) | Chunking + bob sonini ko'rsatish; Ollama alternativasi |

## D. Qonuniy (huquqiy)

| # | Savol | Hozircha qilingan qaror | Holat |
|---|-------|------------------------|-------|
| D1 | Mualliflik: to'liq matnni saqlash | `content.md` faqat lokal, repo'ga KIRMAYDI (docs/07) | ✅ qaror |
| D2 | Tahlil (transformatsiya) ochiq saqlansa bo'ladimi? | Ha — meta + analysis ochiq | ✅ qaror (yuridik tekshiruv keyin) |
| D3 | AI provayderlar shartlari (matn yuborish) | Foydalanuvchi o'z kaliti bilan — uning mas'uliyati, README'da yoziladi | ⬜ README'ga yozish kerak |
| D4 | Litsenziya | MIT (kod) | ✅ qaror |

## E. Produkt savollari (Bosqich 1 oldin)

| # | Savol | Holat |
|---|-------|-------|
| E1 | Quiz'da nechta savol bobga? (5-8 taxminiy) | ⬜ pilotda sinaymiz |
| E2 | Spaced repetition FSRS boshladikmi, oddiy jadval bilanmi? | ⬜ Oddiy jadval bilan boshlash (docs/06), FSRS keyin |
| E3 | Kitob tugagach nima? (sertifikat, "qayta o'qish", yangi kitob taklifi) | ⬜ |
| E4 | "Men qo'lladim" — notifications/eshitma qachon? (kunlik 20:00) | ⬜ Sozlamalarda default |
| E5 | Bir nechta shaxsiy profil (oilaviy kompyuter)? | ⬜ Hozircha bitta profil |

## F. Reja holati (docs/02 asosida)

```
[x] G'oya aniqlandi
[x] Asosiy qarorlar qabul qilindi (lokal, bepul, BYOK+Ollama, agent rules)
[x] Hujjatlar yozildi (docs/01-09)
[ ] Bosqich 0 boshlandi  ← HOZIR SHU YERDAMIZ
    [ ] Pilot kitob tanlandi (A1, A2)
    [ ] agent-rules/ yozildi
    [ ] JSON formatlar pilotda sinandi
    [ ] PDF/EPUB → MD sinovi
    [ ] GitHub repo yaratildi
[ ] Bosqich 1 (desktop MVP)
[ ] Bosqich 2 (server)
[ ] Bosqich 3 (online + obuna)
```
