# 📚 Study Notes

> Kitobni o'qish emas — **o'rganish va hayotda qo'llash** uchun platforma.

Foydalanuvchi kitobni to'liq o'qiydi, lekin tushunmaydi yoki qoidalarini hayotda
qo'llashni bilmaydi — bizning platforma shu bo'shliqni to'ldiradi:

- 📌 Kitobdagi **eng muhim joylarni avtomatik aniqlaydi**
- 📖 **Terminlarni** oddiy tilda tushuntiradi
- 🎯 **Quizlar** beradi (nazariy + vaziyatga asoslangan)
- 🌍 Har bir qoida uchun **"qachon va qanday qo'llash"** — real vaziyatlar
- 🔁 Kunlik **takrorlash** (spaced repetition) — unutmaslik uchun

## 🔑 Asosiy qarorlar

| Qaror | Tushuntirish |
|-------|--------------|
| **Lokal desktop dastur** | Server yo'q, ma'lumot foydalanuvchi kompyuteridan chiqmaydi |
| **Open source, butunlay bepul** | Monetizatsiya yo'q. Kod MIT litsenziyasi |
| **AI: BYOK + Ollama** | Foydalanuvchi o'z API kalitini kiritadi yoki to'liq offline ishlaydi |
| **Agent rules — .md fayllarda** | AI xulqi kod emas, matnli qoidalar bilan boshqariladi |
| **PDF/EPUB → Markdown** | Barcha tahlil Markdown ustida ishlaydi |
| **Login yo'q** | Mahalliy profil, hisobsiz ishlaydi |
| **Keyinchalik: server + online** | Professor/ustozlarga obuna, o'zaro bilim almashish |

## 📂 Hujjatlar

| Fayl | Mavzu |
|------|-------|
| [docs/01-vision.md](docs/01-vision.md) | G'oya, maqsad, auditotiya, printsiplar |
| [docs/02-roadmap.md](docs/02-roadmap.md) | Bosqichli rejа (MVP → server → online) |
| [docs/03-architecture.md](docs/03-architecture.md) | Texnik arxitektura (lokal, Tauri, SQLite, AI) |
| [docs/04-ui-ux.md](docs/04-ui-ux.md) | Sahifalar, wireframe, dizayn printsiplari |
| [docs/05-agent-rules.md](docs/05-agent-rules.md) | AI agent rules tuzilmasi |
| [docs/06-data-formats.md](docs/06-data-formats.md) | JSON formatlar (tahlil, quiz, progress) |
| [docs/07-book-pipeline.md](docs/07-book-pipeline.md) | PDF/EPUB → Markdown konvertatsiya |
| [docs/08-future-server.md](docs/08-future-server.md) | Keyinchalik: server, online, obuna tizimi |
| [docs/09-open-questions.md](docs/09-open-questions.md) | Ochiq savollar va xatarlar |

## 🛠️ Texnik xulosa (qisqacha)

- **Desktop:** Tauri (Windows/macOS/Linux) + React (Next.js uslubidagi UI)
- **Ma'lumotlar:** SQLite (foydalanuvchining lokal papkasida)
- **AI:** OpenAI / Gemini / Groq (API key) **yoki** Ollama (offline)
- **Konvertatsiya:** EPUB → turndown, PDF → pdf-parse (skan: OCR + ogohlantirish)
- **Tahlil:** boblarga bo'lib (chunking) → agent rules orqali AI chaqiruvi

## 🚀 Ishga tushirish (hozircha Vite dev server bilan)

> Tauri/Electron qobig'i keyinroq qo'shiladi (Rust toolchain talab qiladi) —
> hozircha UI alohida ishlab chiqilmoqda (docs/03 §Tanlov).

```bash
# 1. Bog'liqliklar
npm install

# 2. Dastur (http://localhost:5173)
npm run dev

# 3. Production build
npm run build
```

**Birinchi ochilganda:**
1. Onboardingda AI'ni ulang (Gemini kaliti yoki Ollama)
2. Kutubxonada demo kitob tayyor — unda xulosalar, terminlar, quiz va
   «hayotda qo'llash» senariylari oldindan tahlil qilingan
3. `.md`/`.txt` faylni drag & drop qilib o'zingizning kitobingizni qo'shing
   va «AI tahlil» ni boshlang (agent-rules/ fayllari ishlatiladi)

## 📖 Birinchi qadam (Bosqich 0)

1. `agent-rules/` fayllarini yozish (analyst, quiz-master, life-mentor)
2. JSON formatlarini aniqlash va 1 pilot kitobda sinash
3. PDF/EPUB → Markdown konvertatsiyani sinash (eng xavfli texnik qism)
4. Repozitoriyani yaratish: README, MIT litsenziya, papka tuzilmasi
