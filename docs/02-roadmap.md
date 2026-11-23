# 02 — Roadmap: bosqichli reja

> **Holat: 2026-11-23.** Ushbu hujjat kodning hozirgi holatini aks ettiradi.
> Belgi: **[x]** bajarilgan · **[~]** qisman · **[ ]** boshlanmagan.
> Manbalar: `README.md`, `docs/04-ui-ux.md`, `docs/09-open-questions.md`, `apps/desktop/src/`, `packages/`.

## Umumiy ko'rinish

```
Bosqich 0        Bosqich 1            Bosqich 2          Bosqich 3
Poydevor    →    Lokal MVP       →    Server +      →    Online public
(1-2 hafta)      (4-6 hafta)          jamoaviy           + obuna

[x] Formatlar      [x] UI (7 sahifa)   [ ] AI ustoz chat  [ ] Web versiya
[x] Agent rules    [x] Kutubxona       [ ] Server / API   [ ] Ustoz profillari
[x] Pilot kitob    [x] Tahlil + quiz   [ ] Hamjamiyat     [ ] Obuna
[x] Repo + README  [x] Takrorlash*     [ ] Sync           [ ] Bilim almashish
[x] AI provayderi  [x] Sozlamalar*
                   [~] PDF/EPUB, FSRS, i18n, eslatma — qolgan ishlar
```

`*` **Takrorlash** — oddiy interval jadvali (1/3/7/14/30 kun), FSRS emas.
`*` **Sozlamalar** — mavzu va eksport tayyor; til tanlagich va eslatma vaqti hali yo'q.

**Qisqa xulosa:** UI va asosiy o'quv loopi (kitob yuklash → tahlil → o'qish →
quiz → takrorlash) ishlab chiqilgan. Hali yetishmaydi: PDF/EPUB konvertatsiya,
FSRS, ko'p tillilik, bildirishnomalar va AI ustoz chat.

---

## Bosqich 0 — Poydevor (1-2 hafta)

**Maqsad:** Eng xavfli va noaniq qismlarni erta sinash.

| Ish | Tafsilot | Holat |
|-----|----------|-------|
| 1. JSON formatlarini aniqlash | `docs/06-data-formats.md` asosida pilot kitobni tahlil qilish | [x] `agent-rules/schemas/` — analyst, quiz, life-mentor |
| 2. Agent rules yozish | `analyst.md`, `quiz-master.md`, `life-mentor.md` (+ `tutor.md` zaxirada) | [x] |
| 3. PDF/EPUB → MD sinash | 3-4 xil faylda (yaxshi PDF, skan PDF, EPUB) — **eng xavfli qism** | [ ] hozir faqat `.md`/`.txt` import; konvertatsiya keyin |
| 4. AI'ni sinash | Pilot kitob bobini agent rules bilan tahlil qilish, sifatni baholash | [x] Gemini / OpenAI / Ollama adapteri + bobma-bob tahlil ishlaydi |
| 5. Repozitoriya | papka tuzilmasi, README, MIT litsenziya | [x] |

**Natija:** format va AI sifati sinovdan o'tdi; **PDF/EPUB konvertatsiya hali
ochilmagan xatar** bo'lib qoldi va Bosqich 1 qoldiqlariga o'tkazildi.

**Checkout savoli (hal qilindi):** pilot kitob — *"10 daqiqali odatlar"*
(`content/books/10-daqiqa-odatlar`), o'zbek tilida, 4 bobli, oldindan tahlil
qilingan demo sifatida kiritilgan.

---

## Bosqich 1 — Lokal MVP (4-6 hafta)

**Maqsad:** Foydalanuvchi o'z kompyuterida to'liq yo'lni bosib o'tsin:
Kitob yuklash → Tahlil → O'qish → Quiz → Takrorlash.

**Holat:** UI va o'quv loopining asosiy qismi tayyor (7 sahifa, 6 tabli kitob
sahifasi, "Iliq qog'oz stoli" dizayn tizimi). Quyidagi bandlar kodga qarab
baholangan.

### Haftalik bo'linish (asl taxminiy reja)

| Hafta | Ish | Holat |
|-------|-----|-------|
| 1-2 | Asosiy layout (yuqori panel, router, mavzu) | [x] |
| 2-3 | Kutubxona + import (drag & drop) | [x] faqat matnli fayllar |
| 3-4 | Tahlil chaqiruvi (AI ulash, agent rules, progress) | [x] |
| 4-5 | Kitob sahifasi: Xulosalar / Terminlar / O'qish tablari | [x] |
| 5-6 | Quiz + takrorlash + Progress + "Men qo'lladim" | [x] oddiy jadval bilan |

### MVP tarkibi (majburiy)

- [x] Onboarding (3 qadam: AI → ism → birinchi kitob)
- [x] Bosh sahifa: davom ettir + bugungi takrorlash + streak
- [x] Kutubxona: drag & drop import, holatlar (o'qilmoqda/tugatilgan) — faqat `.md`/`.txt`
- [x] Tahlil: boblarga bo'lib AI chaqiruvi, progress (analyst → quiz-master → life-mentor)
- [x] Kitob sahifasi: O'qish, Xulosalar, Terminlar, Quiz, Hayotda qo'llash
      (AI ustoz tabi mavjud, lekin "tez orada" belgisi bilan o'chirilgan)
- [x] Quiz rejimi: savol → javob → sabab → natija, klaviatura boshqaruvi (1–4, Enter, Esc)
- [x] Spaced repetition: 1/3/7/14/30 kunlik interval jadvali (FSRS emas — pastga qarang)
- [x] "Men qo'lladim" tugmasi + jurnal
- [x] AI ulash: Gemini / OpenAI / Ollama (API kalit lokal saqlanadi; xavfsiz
      saqlash/shifrlash hali amalga oshirilmagan)
- [~] Sozlamalar: mavzu (tungi/kunduz) va eksport tayyor; **til tanlagich va
      eslatma vaqti — yo'q** (placeholder)

### Hali bajarilmagan (MVP ichidagi qoldiq ishlar)

- [ ] **PDF/EPUB → Markdown konvertatsiya** — import faqat `.md`, `.markdown`,
      `.mdx`, `.txt`; kutubxonada "PDF va EPUB konvertatsiyasi keyingi bosqichda"
      deb ko'rsatiladi
- [ ] **FSRS algoritmi** — hozir `DEFAULT_INTERVALS = [1, 3, 7, 14, 30]` va
      `ease` omili (`packages/core/src/repetition.ts`); haqiqiy FSRS keyin
- [ ] **i18n / til tanlagich** — interfeys faqat o'zbekcha; sozlamada
      "Hozircha faqat o'zbekcha. Boshqa tillar keyingi bosqichda"
- [ ] **Bildirishnomalar / eslatma vaqti** — sozlamada "20:00 · tez orada"
- [ ] **AI ustoz chat** — `agent-rules/tutor.md` tayyor, o'chirilgan tab bor,
      lekin suhbat ulanmagan (Bosqich 2 ga tegishli)
- [ ] **SQLite va Tauri qobig'i** — hozir `localStorage` va Vite dev server;
      `data.db` va desktop qobiq keyin

### MVP'da YO'Q (ataylab)

- ❌ Server, login, sync
- ❌ AI ustoz (to'liq chat) — Bosqich 2
- ❌ Hamjamiyat / PR bilan kitob qo'shish
- ❌ Mobil ilova
- ❌ To'lov / obuna

---

## Bosqich 2 — Server + jamoaviy (keyin)

- [ ] 🤖 **AI ustoz** — kitob matni bo'yicha savol-javob (RAG); `tutor.md` qoida
      fayli tayyor, chat ulanmagan
- [ ] 🌐 **Server** — tahlillarni saqlash va ulashish (API)
- [ ] 👥 **Hamjamiyat** — tahlillar GitHub PR yoki server orqali qo'shiladi,
      moderator tekshiradi
- [ ] ☁️ **Ixtiyoriy sync** — boshqa qurilmada davom etish (E2E shifrlangan)
- [ ] 📊 **Tahlil sifati baholash** — foydalanuvchi "bu yomon edi" tugmasi

## Bosqich 3 — Online public + obuna (g'oya)

Sabab: foydalanuvchi **boshqa professor va ustozlarga obuna bo'lib** ularni
kuzatib borishi, **o'zaro bilim almashishi** kerak.

- [ ] 🌍 Web versiya (foydalanuvchi o'rnatmasdan ishlatadi)
- [ ] 👨‍🏫 **Ustoz/professor profillari** — o'z tahlillari, kurslari, yo'nalishlari
- [ ] 🔔 **Obuna** — ustozlar yangi tahlil/maqola chiqarganda push
- [ ] 💬 **O'zaro almashish** — izohlar, eslatmalar, "qo'lladim" jurnallari
      umumiy (ixtiyoriy, yopiq jamoalar ham)
- [ ] 📚 **Umumiy kutubxona** — hamjamiyat tahlillari

> Eslatma: Bosqich 3 pullik qismlari bo'lishi mumkin (obuna ustozlarga),
> lekin asosiy platforma **bepul qoladi** — bu loyihaning qoidasi.

---

## Keyingi real qadamlar (tavsiya etilgan tartib)

1. **PDF/EPUB → MD konvertatsiya** — eng xavfli texnik qism; avval yaxshi
   PDF va EPUB bilan sinab, skan PDF'lar uchun ogohlantirish qo'shish
   (`docs/07-book-pipeline.md`).
2. **FSRS ga o'tish** — oddiy jadval o'rniga FSRS parametrlari bilan almashtirish;
   mavjud `Review` tuzilmasi (`ease`, `reps`, `lapses`) mos keladi.
3. **Ko'p tillilik (i18n)** — ikkinchi til (English yoki Русский) uchun
   matnlarni resurslarga ajratish.
4. **Bildirishnomalar** — kunlik takrorlash eslatmasi (default 20:00),
   desktop qobiq bilan birga.
5. **AI ustoz chat** — `tutor.md` asosida RAG suhbati; Bosqich 2 boshlanishi.
6. **SQLite + Tauri qobig'i** — `localStorage` dan `data.db` ga o'tish va
   real desktop build (hozir UI faqat Vite dev serverda).

---

## Umumiy xatarlar

| Xatar | Holat | Kamaytirish |
|-------|-------|-------------|
| PDF konvertatsiya sifati past | ⚠️ ochiq (hozir implementatsiya yo'q) | Erta sinash; yomon fayllarga ogohlantirish; EPUB'ni afzal ko'rish |
| AI tahlil sifati noaniq | ✅ qisman hal qilindi | Agent rules + JSON sxema va retry; pilot kitobda qo'lda baholash |
| Desktop framework tanlovi | ⚠️ ochiq (Tauri qobig'i hali yo'q) | UI backend'dan ajratilgan; Rust to'siq bo'lsa Electron'ga fallback |
| Ma'lumotlarning xavfsizligi | ⚠️ ochiq | API kalit lokal, lekin shifrlanmagan — keychain/safeStorage qo'shish |
| Hujjatlar eskirib qolishi | doimiy | Har bir qaror `docs/` da — hujjat = manba |
