# 03 — Arxitektura: lokal desktop dastur

## Asosiy tamoyil

```
❌ Server yo'q   ❌ Hosting yo'q   ❌ Login yo'q   ❌ Ma'lumot chiqmaydi
✅ Hammasi foydalanuvchining kompyuterida
```

## Umumiy ko'rinish

```
┌──────────────────────────────────────────────────────────┐
│                 Study Notes Desktop (Tauri)              │
│                                                          │
│  ┌──────────────┐   ┌───────────────┐   ┌─────────────┐  │
│  │  UI (React)  │   │  Core (Rust/  │   │  AI Client  │  │
│  │  - Sahifalar │   │   Node)       │   │  - OpenAI   │──┼──→ HTTPS API
│  │  - State     │   │  - Import     │   │  - Gemini   │  │   (faqat API key
│  │  - Mavzu     │   │  - Konvertats │   │  - Groq     │  │    bilan chaqiruv)
│  └──────────────┘   │  - Tahlil     │   │  - Ollama   │──┼──→ localhost:11434
│                     │  - Quiz/FSRS  │   │    (lokal)  │  │    (to'liq offline)
│                     └───────┬───────┘   └─────────────┘  │
│                             │                            │
│                     ┌───────▼───────┐                    │
│                     │    SQLite     │                    │
│                     │  (bitta fayl) │                    │
│                     └───────────────┘                    │
│                                                          │
│  Ma'lumot papkasi (foydalanuvchida):                     │
│  ~/Library/Application Support/study-notes/  (macOS)     │
│  %APPDATA%/study-notes/                          (Win)  │
│  ├── data.db          ← SQLite (progress, profil, sozl.) │
│  ├── config.json      ← AI sozlamalar (key shifrlangan)  │
│  └── library/         ← kutubxonalar                     │
│      └── <kitob-slug>/                                   │
│          ├── content.md     ← konvertatsiya qilingan matn│
│          ├── meta.json      ← metadata                   │
│          └── analysis/      ← AI tahlili (JSON)          │
└──────────────────────────────────────────────────────────┘
```

## Tanlov: Tauri (Electron emas)

| Mezon | Tauri ⭐ | Electron |
|-------|---------|----------|
| Installer o'lchami | ~10-15 MB | ~150 MB |
| Xotira | Yengil | Og'ir |
| Avtomatik yangilash | Tayyor (updater) | Qo'shimcha sozlash |
| OS qo'llab-quvvatlash | Win / macOS / Linux | Xuddi shunday |
| Backend tili | Rust | Node.js |

**Fallback:** Agar Rust tomoni to'siq bo'lsa — Electron + Node.js backend.
UI (React) ikkala holatda ham bir xil qayta ishlatiladi, shuning uchun
**UI'ni backend'dan ajratib qo'yish** muhim.

## Qatlamli tuzilma

```
apps/desktop/       → Tauri shelli + React UI (sahifalar, komponentlar)
packages/core/      → Import, konvertatsiya, tahlil orchestratsiyasi,
                      SQLite, spaced repetition (FSRS)
packages/ai/        → Bitta interfeys, bir nechta provider:
                      openai() | gemini() | groq() | ollama()
agent-rules/        → AI qoidalari (.md) — kod emas, matn
content/books/      → Tayyor tahlillar (faqat meta + analysis, MATN EMAS)
docs/               → Ushbu hujjatlar
```

## AI ulash: bitta interfeys, bir nechda provider

```ts
// packages/ai — barcha providerlar bitta shaklda
interface AIProvider {
  complete(systemPrompt: string, userText: string): Promise<string>
}

// Foydalanuvchi sozlamada tanlaydi:
// - OpenAI / Gemini / Groq  → API key (sozlamada saqlanadi, shifrlangan)
// - Ollama                  → localhost, kalit kerak emas, offline
```

**Xavfsizlik:**
- API key faqat lokal saqlanadi, hech qayerga yuborilmaydi
- OS keychain / shifrlangan JSON (Electron `safeStorage`, Tauri keyring)
- Tahlil uchun yuborilgan matn: **faqat hozirgi bob** (chunking) — cheklangan

## Ma'lumotlar bazasi — SQLite (nega)

- ❌ Foydalanuvchi "database o'rnatish" ni ko'rmaydi — bitta fayl
- ✅ Nol konfiguratsiya, nol server
- ✅ Eksport/import oson (faylni nusxalash)
- ✅ Bir nechda qurilmada keyinchalik sync qilish oson

**Asosiy jadvallar (taxminiy):**
```
profile      → ism, avatar, streak, sozlamalar
books        → slug, title, author, status, progress
chapters     → book_id, index, title, content_path
key_ideas    → book_id, chapter_id, idea, why, how_to_apply
terms        → book_id, term, definition_simple
quizzes      → book_id, chapter_id, type, question, options, answer, explain
reviews      → quiz_id, due_date, interval, ease (FSRS)
apply_log    → idea_id, date, note   ← "Men qo'lladim" jurnali
notes        → book_id, text, source (qo'lda yozilgan eslatmalar)
```

## Tahlil pipeline (Bosqich 1)

```
Foydalanuvchi PDF/EPUB tanlaydi
   │
   1. Konvertatsiya  →  content.md (boblarga bo'lingan)
   │
   2. Chunking       →  har bob alohida (token chegarasiga mos)
   │
   3. Har bob uchun AI chaqiruvi (agent rules bilan):
   │     analyst.md      → key_ideas + terms  (JSON)
   │     quiz-master.md  → quizzes            (JSON)
   │     life-mentor.md  → how_to_apply       (vaziyat→harakat)
   │
   4. Saqlash        →  analysis/ JSON + SQLite
   │
   5. Spaced repetition jadvali yaratiladi (kun 1, 3, 7, 14)
   │
   ▼  Kitob tayyor — foydalanuvchi o'qishni boshlaydi
```

**Xatolar:** AI noto'g'ri JSON qaytarsa → qayta urinish (retry) →
baribir bo'lmasa → bob "qisman tahlil qilingan" deb belgilanadi va
foydalanuvchiga xabar qilinadi.

## Internet talablari

| Holat | Internet |
|-------|----------|
| O'qish, quiz, progress (tayyor tahlil bilan) | ❌ Kerak emas |
| Yangi kitob tahlili — API key (OpenAI/Gemini) | ✅ Kerak |
| Yangi kitob tahlili — Ollama | ❌ Kerak emas (lokal) |
| AI ustoz chat (Bosqich 2) | Ollag'ga qarab |

## Keyinchalik: server qo'shilsa (Bosqich 2-3)

```
Hozir:   Desktop ──(faqat AI API)──→ Internet
Keyin:   Desktop ──(AI API)──→ Internet
              └────(sync API)──→ Study Notes Server ──→ Web versiya
```

- Desktop **hamon mustaqil ishlaydi** — server ixtiyoriy qo'shiladi
- Server tahlillarni saqlaydi → web/public kutubxona hosil bo'ladi
- Sync: foydalanuvchi xohlasa E2E shifrlab yuboradi
- Arxitektura boshidanoq server'siz qurilgani uchun
  **keyin qo'shish integratsiya emas, alohida xizmat** bo'ladi
