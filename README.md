# 📚 Study Notes

> Kitobni o'qish emas — **o'rganish va hayotda qo'llash** uchun platforma.

Ko'pchilik kitobni oxirigacha o'qiydi, lekin undagi fikrlarni hayotda qo'llay
olmaydi. Study Notes shu bo'shliqni to'ldiradi: asosiy g'oyalarni ajratadi,
terminlarni sodda tilda tushuntiradi, amaliy savollar beradi va har bir qoida
uchun **qachon va qanday qo'llash** ko'rsatadi.

## Hozirda ishlaydi

- **Boshlang'ich sozlash** — ism/avatar, AI provayderi va kaliti yoki Ollama
- **Kutubxona** — `.md`, `.txt`, `.markdown`, `.mdx` fayllarni yuklash
  (drag & drop), qidirish, filtrlash, panellar/ro'yxat ko'rinishi, o'chirish
- **AI tahlil** — har bob uchun 3 bosqich: g'oyalar + terminlar → quiz →
  hayotiy vaziyatlar; xato bo'lsa bir marta qayta urinish, tugallanmagan
  boblar saqlanadi (`partial` holati)
- **Kitob o'quvchisi** — matn, xulosalar, terminlar, quiz, "hayotda qo'llash"
  bo'limlari; shrift hajmi va qog'oz rangi sozlanadi
- **Takrorlash** — savol va g'oyalar vaqt o'tishi bilan qayta ko'rsatiladi
  (spaced repetition); "Men qo'lladim" jurnali mavjud
- **Natijalar** — o'qish foizi, streak, quiz statistikasi
- **Ma'lumotlar** — hamma narsa lokal (localStorage); JSON eksport/import,
  to'liq o'chirish; API kaliti eksportga kirmaydi
- **Ko'rinish** — yorug'/tungi mavzu, qulay o'qish sozlamalari

## Hozircha yo'q (rejada)

- **PDF/EPUB import** — hozircha faqat matn formatlari qabul qilinadi
- **AI ustoz chat UI** — qoida (`agent-rules/tutor.md`) tayyor, ammo promptga
  ulanmagan; kitob sahifasidagi bo'lim «tez orada» holatida
- **i18n** — interfeys faqat o'zbek tilida
- **Bildirishnomalar/eslatmalar** — takrorlash kuni haqida avtomatik xabar yo'q
- **Desktop qobig'i** — hozirda Vite dev serverda brauzerda ishlaydi; Tauri
  qobig'i, server, onlayn kutubxona va ustoz obunasi keyingi bosqichlar

## Texnik tuzilma

- **UI:** Vite + React 19 + React Router (`HashRouter`) — server talab qilmaydi
- **Paketlar:** `packages/core` (tiplar, saqlash, matnni boblarga bo'lish),
  `packages/ai` (provayderlar, JSON qayta ishlash, 3 bosqichli tahlil)
- **AI:** Gemini / OpenAI (API kalit) yoki Ollama (`localhost:11434`, offline)
- **Agent qoidalari:** `agent-rules/*.md` — AI xulqi matnli fayllarda,
  `schemas/*.json` — javob formati; barchasi `rules.ts` orqali yagona manbadan
  import qilinadi
- **Saqlash:** localStorage (SQLite desktop qobig'i bilan birga rejalashtirilgan)

## Ishga tushirish

Node.js ^20.19 yoki ≥22.12 kerak (Vite 8 talabi).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit + vite build
npm run preview  # build natijasini ko'rish
```

Buyruqlar root `package.json` dan `@study-notes/desktop` workspace'iga
yo'naltirilgan. `node_modules` mavjud bo'lsa, `npm install` qayta talab
qilinmaydi.

## Demo kitob

`content/books/10-daqiqa-odatlar` — "10 daqiqali odatlar: kichik qadamlar bilan
katta o'zgarish" (4 bob). Platforma jamoasi tomonidan formatni sinash uchun
yozilgan; xulosalar, terminlar, 8 ta quiz va hayotiy vaziyatlar oldindan
tahlil qilingan. Birinchi ishga tushirishda kutubxonaga avtomatik qo'shiladi.
Dev rejimida uning ichki bog'liqligi (idlar, slug, g'oya havolalari) avtomatik
tekshiriladi.

**Birinchi ochilganda:**
1. Onboardingda AI'ni ulang (Gemini/OpenAI kaliti yoki Ollama)
2. Kutubxonada demo kitobni oching yoki o'zingizning `.md`/`.txt` faylingizni
   qo'shing
3. Kitob sahifasida **«AI tahlil qilish»** ni bosing, so'ng quiz va takrorlash
   bo'limlaridan foydalaning

## Mavjudlik (accessibility)

- Klaviatura: barcha boshqaruv elementlari `Tab`/`Enter`/`Space` bilan
  ishlaydi; «asosiy kontentga o'tish» havolasi bor
- Route almashganda fokus sahifa sarlavhasiga o'tkaziladi
- ARIA rollari va holat xabarlari (`aria-current`, `aria-live`, `role="status"`,
  `role="radiogroup"`), aniq `aria-label` yorliqlari
- Fokus ko'rinishi `:focus-visible` bilan ta'minlangan; animatsiyalar
  `prefers-reduced-motion` da o'chiriladi
- Yorug'/tungi mavzu, katta shrift va turli qog'oz ranglari mavjud

## Hujjatlar

| Fayl | Mavzu |
|------|-------|
| [docs/01-vision.md](docs/01-vision.md) | G'oya, maqsad, auditoriya, printsiplar |
| [docs/02-roadmap.md](docs/02-roadmap.md) | Bosqichli reja (MVP → server → online) |
| [docs/03-architecture.md](docs/03-architecture.md) | Texnik arxitektura (lokal, Tauri, AI) |
| [docs/04-ui-ux.md](docs/04-ui-ux.md) | Sahifalar, wireframe, dizayn printsiplari |
| [docs/05-agent-rules.md](docs/05-agent-rules.md) | AI agent rules tuzilmasi |
| [docs/06-data-formats.md](docs/06-data-formats.md) | JSON formatlar (tahlil, quiz, progress) |
| [docs/07-book-pipeline.md](docs/07-book-pipeline.md) | PDF/EPUB → Markdown konvertatsiya (reja) |
| [docs/08-future-server.md](docs/08-future-server.md) | Keyinchalik: server, online, obuna |
| [docs/09-open-questions.md](docs/09-open-questions.md) | Ochiq savollar va xatarlar |

## Litsenziya

MIT — [LICENSE](LICENSE). To'liq bepul, monetizatsiya yo'q.
