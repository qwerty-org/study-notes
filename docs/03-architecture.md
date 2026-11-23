# 03 — Arxitektura: lokal, server'siz ilova

> **Hozirgi holat (v0.1.0).** UI React + Vite asosida brauzer prototipi sifatida
> ishlab chiqilmoqda (`localhost:5173`). Tauri/Electron qobig'i va SQLite —
> keyingi bosqich rejasi; hozirda ma'lumotlar brauzerning `localStorage`ida
> saqlanadi. Quyida **hozirgi kod** va **rejadagi** qismlar aniq ajratilgan.

## Asosiy tamoyil

```
❌ Server yo'q   ❌ Hosting yo'q   ❌ Login yo'q
✅ Ma'lumotlar foydalanuvchi qurilmasida saqlanadi
✅ AI: foydalanuvchi kaliti (BYOK) yoki lokal Ollama
```

**Aniqlik:** «Ma'lumot chiqmaydi» degan ibora faqat **saqlash**ga tegishli.
Yangi kitobni tahlil qilishda bob matni tanlangan provayderga yuboriladi
(Gemini / OpenAI) yoki Ollama orqali qurilmaning o'zida qayta ishlanadi.
Tayyor tahlil bilan o'qish, quiz va progress esa to'liq offline ishlaydi.

## Umumiy ko'rinish

```
study-notes/                         (npm workspaces)
├── apps/desktop/   @study-notes/desktop
│   ├── Vite dev server (5173)        → keyin: Tauri qobig'i (reja)
│   ├── HashRouter sahifalari         → Onboarding, Bosh sahifa, Kutubxona,
│   │                                   Kitob, Takrorlash, Natijalar, Sozlamalar
│   ├── AppStore (React Context)      ↔ @study-notes/core `store`
│   └── Dizayn: nx-* (yangi) + global.css/theme.css (eski, Dashboard)
├── packages/core/  @study-notes/core → tiplar, saqlash, bobga bo'lish,
│                                       takrorlash, sana yordamchilari
├── packages/ai/    @study-notes/ai   → provider adapteri, JSON, 3 agentli tahlil
├── agent-rules/                      → .md qoidalar + JSON sxemalari (kod emas)
├── content/books/                    → demo kitob: matn + tayyor tahlil
└── docs/                             → hujjatlar
```

**Ma'lumot oqimi (hozirgi kod):**

```
Sahifa (React)
   → useApp() ...................... AppStore (React Context)
   → store.* ....................... @study-notes/core → localStorage

useAnalyze()
   → analyzeChapter() .............. @study-notes/ai
   → complete() .................... Gemini / OpenAI API  yoki
                                     Ollama (localhost:11434)
```

`agent-rules/*.md` va `schemas/*.json` Vite `?raw` importi orqali to'g'ridan-to'g'ri
`apps/desktop/src/rules.ts` ga kiradi — alohida backend yoki konfiguratsiya fayli kerak emas.

## Ishga tushirish va yig'ish (hozirgi holat)

Ildiz `package.json` buyruqlari `@study-notes/desktop` workspace'iga yo'naltirilgan:

| Buyruq | Natija |
|--------|--------|
| `npm run dev` | `vite` — `http://localhost:5173` |
| `npm run build` | `tsc --noEmit` + `vite build` → `apps/desktop/dist/` |
| `npm run preview` | `vite preview` — tayyor build'ni ko'rish |

`apps/desktop/vite.config.ts`:

- `@study-notes/core` va `@study-notes/ai` aliaslari tegishli `src/index.ts` fayllariga;
- `server.fs.allow` repo ildizini o'z ichiga oladi — `agent-rules/` va `content/`
  fayllarini raw-import qilish uchun;
- port `5173`, build papkasi `dist`.

`src-tauri/` papkasi va `tauri.conf.json` **hozirda yo'q**, shuning uchun dastur
faqat brauzerda ishga tushadi.

## Tanlov: Tauri (Electron emas) — keyingi bosqich

Desktop qobig'i uchun asosiy tanlov Tauri hisoblanadi; UI backend'dan ajratilgani
uchun qobiq almashtirilsa ham sahifalar o'zgarmaydi.

| Mezon | Tauri (reja) | Electron (fallback) |
|-------|--------------|---------------------|
| Installer o'lchami | ~10–15 MB | ~150 MB |
| Xotira sarfi | Yengil | Og'ir |
| Avtomatik yangilash | Tayyor (updater) | Qo'shimcha sozlash |
| OS qo'llab-quvvatlash | Win / macOS / Linux | Xuddi shunday |
| Backend tili | Rust | Node.js |

**Hozirgi kodda qobiq integratsiyasi tayyor, lekin faol emas.**

- `@tauri-apps/api` dependency mavjud;
- `src/lib/windowControls.ts` Tauri API'ni **dinamik** import qiladi va
  `__TAURI_INTERNALS__` / `__TAURI_IPC__` globals borligini tekshiradi;
- `window.electronAPI` mavjud bo'lsa, Electron usuli ishlatiladi;
- qobiq bo'lmasa — **xavfsiz no-op**: xatolik tashlanmaydi, deraza tugmalari
  (`controlsAvailable()`) o'chirilgan holda ko'rsatiladi;
- `Layout.tsx` dagi `data-tauri-drag-region` atributlari brauzerda zararsiz.

## Qatlamli tuzilma (npm workspaces)

| Papka | Paket | Vazifa |
|-------|-------|--------|
| `apps/desktop/` | `@study-notes/desktop` | React UI, Vite, sahifalar, `AppStore`, stillar |
| `packages/core/` | `@study-notes/core` | `types`, `storage`, `parsing`, `repetition`, `date` |
| `packages/ai/` | `@study-notes/ai` | `providers`, `json`, `analyze` (core ga bog'liq) |
| `agent-rules/` | — | `analyst.md`, `quiz-master.md`, `life-mentor.md`, `tutor.md` + 3 sxema |
| `content/books/` | — | Demo kitob: `content.md`, `meta.json`, `analysis/*.json` |
| `docs/` | — | Ushbu hujjatlar |

Har bir paketning yagona kirish nuqtasi `src/index.ts` (barrel). Eksportlar
faqat **qo'shimcha** (additive) tarzda o'zgartiriladi — mavjud nomlarni o'zgartirish
`apps/desktop` va `@study-notes/ai` ni buzadi. `packages/ai` o'z navbatida
`@study-notes/core` tiplariga tayanadi.

## Sahifalar va navigatsiya (HashRouter)

`App.tsx` `HashRouter` dan foydalanadi — server yo'qligi sababli statik build ham
to'g'ri ishlaydi; yo'llar `#/kutubxona` ko'rinishida bo'ladi.

| Yo'l | Sahifa | Izoh |
|------|--------|------|
| `/onboarding` | `Onboarding` | 3 qadam: AI ulash, profil, birinchi kitob |
| `/` | `Dashboard` (index) | Bosh sahifa |
| `/kutubxona` | `Library` | Kitoblar ro'yxati, `.md`/`.txt` import |
| `/kitob/:slug` | `Book` | O'qish, g'oyalar, terminlar, quiz, «qo'lladim»; «AI ustoz» keyin |
| `/takrorlash` | `Repeat` | Takrorlash jadvali |
| `/natijalar` | `Stats` | Natijalarim |
| `/sozlamalar` | `Settings` | Profil, AI, eksport/import |
| `*` | — | `/` ga qaytaradi |

`Gate` komponenti `onboarding.done` bo'lmasa istalgan sahifani `/onboarding` ga
yo'naltiradi. `Layout` doimiy topbar (navigatsiya, streak, profil menyusi, deraza
tugmalari) va `<Outlet />` ni o'z ichiga oladi. `RouteEffects` yo'l o'zgarganda
`document.title` ni o'zbekcha label bilan yangilaydi va fokusni `main` sarlavhasiga
o'tkazadi (`preventScroll` bilan).

## Dizayn tizimi: `nx-` qatlami eski CSS ustida

`main.tsx` stillar quyidagi tartibda yuklanadi:

```
global.css, theme.css          → eski tuzilma (asosan Dashboard)
styles/nx/foundation.css       → tokenlar va umumiy bloklar
styles/nx/{library,book,repeat,stats,settings,onboarding,quiz}.css
```

- Barcha yangi klasslar `nx-` prefiksi bilan boshlanadi — eski Dashboard
  klasslari bilan to'qnashmaydi.
- `foundation.css` dagi `--nx-*` tokenlar eski `--text`, `--primary`, `--card`
  kabi o'zgaruvchilarga bog'langan; `[data-theme='dark']` rejimi qo'llab-quvvatlanadi.
- Yangi sahifalar `components/nx/NxUI.tsx` (`Ring`, `Bar`, `Stat`, `Empty`,
  `SectionHead`, `useToast`, `ConfirmModal`) va `nx/icons.tsx` dan foydalanadi.
- `Dashboard` hali eski `components/ui.tsx` / `components/icons.tsx` asosida.
- `.main > .page:has(.nx-page)` qoidasi eski konteynerning `max-width`/`padding`
  cheklovlarini yangi sahifalarda bekor qiladi.

Bu **o'tish davri**: maqsad barcha sahifalarni `nx-` tizimiga o'tkazish va eski
CSS ni olib tashlash; hozirda ikki qatlam birga mavjud.

## AI ulash: bitta interfeys, bir nechta provayder

`packages/ai/src/providers.ts` da `complete(cfg, systemPrompt, userText, signal?)`
yagona funksiya; konfiguratsiya — `AIConfig { provider, apiKey, model? }`.

| ID | Nomi | Kalit kerak | Standart model | Manzil |
|----|------|-------------|----------------|--------|
| `gemini` | Google Gemini | ha | `gemini-2.0-flash` | `generativelanguage.googleapis.com` |
| `openai` | OpenAI (GPT) | ha | `gpt-4o-mini` | `api.openai.com` |
| `ollama` | Ollama (lokal) | yo'q | `llama3.2` | `http://localhost:11434/api/chat` |

Provayder `Onboarding` yoki `Sozlamalar → AI ulash` da tanlanadi; standart —
`gemini`. «Ulanishni tekshirish» tugmasi shu `complete()` bilan sinov chaqiruv
qiladi. **`PROVIDERS` ro'yxatida faqat yuqoridagi 3 ta bor** — Groq hozirgi kodda
mavjud emas.

**Xavfsizlik va cheklovlar (hozirgi holat):**

- API kaliti `sn.aiConfig` ichida `localStorage` da saqlanadi — **shifrlanmagan**.
  OS keychain / shifrlangan JSON (`safeStorage`, Tauri keyring) — keyingi bosqich rejasi.
- `store.exportAll()` eksport faylida `apiKey: ''` qoldiradi — kalit tashqariga chiqmaydi.
- Brauzerda to'g'ridan-to'g'ri chaqiruv CORS ga bog'liq: Gemini va Ollama uni
  qo'llab-quvvatlaydi; OpenAI uchun brauzer rejimida muammo bo'lishi mumkin.
  Tauri qobig'iga o'tganda bu cheklov yo'qoladi.
- Tahlil paytida **faqat hozirgi bob** yuboriladi (chunking) — butun kitob bir
  matn sifatida yuborilmaydi.

## Ma'lumotlar saqlash: `localStorage` (hozir) → SQLite (reja)

`@study-notes/core` dagi `store` obyekti saqlash adapteri hisoblanadi:

| Kalit | Saqlanadigan qiymat |
|-------|---------------------|
| `sn.profile` | `Profile` (ism, avatar, streak, mavzu) |
| `sn.aiConfig` | `AIConfig` (provayder, kalit, model) |
| `sn.library` | `BookRecord[]` (kitoblar + tahlil + progress) |
| `sn.reviews` | `Review[]` (takrorlash jadvali) |
| `sn.applyLog` | `ApplyLogEntry[]` («men qo'lladim» jurnali) |
| `sn.onboarding` | `OnboardingState` |

`AppStore` qo'shimcha texnik kalitlardan foydalanadi: `sn.seeded` (demo kitob
bir marta qo'shilganligi) va `sn.ui.v2` (mavzu migratsiyasi).

**Ishonchlilik:** `load()` har doim sanitizatsiyadan o'tadi — buzilgan JSON, eski
shakl yoki noto'g'ri tip bo'lsa ham standart qiymat qaytariladi; `save()` avval
to'liq `JSON.stringify` qiladi. `exportAll()` / `importAll()` (`SCHEMA_VERSION = 1`)
JSON zaxira va tiklashni ta'minlaydi, `importAll` yozish xatosida eski qiymatlarni
qaytaradi. `clearAll()` barcha kalitlarni o'chiradi.

**Birinchi ishga tushirish:** `content/books/10-daqiqa-odatlar` demo kitob sifatida
kutubxonaga qo'shiladi (oldindan tayyorlangan tahlil bilan). Foydalanuvchi kitoblarni
o'chirsa ham takrorlash yozuvlari saqlanib qoladi va qayta seed qilinmaydi.

**SQLite (faqat reja).** Hozirda `data.db` fayli va jadvallar yo'q. Qobiq qo'shilganda
`store` interfeysi o'zgarmaydi — faqat uning ichki adapteri almashtiriladi.
Rejadagi jadvallar: `profile`, `books`, `chapters`, `key_ideas`, `terms`,
`quizzes`, `reviews`, `apply_log`, `notes`. Bu ro'yxat hozirgi ma'lumotlar tuzilmasi
emas, kelajakdagi ko'chirish rejasi.

## Spaced repetition

`packages/core/src/repetition.ts` da oddiy, bashorat qilinadigan jadval:

- `DEFAULT_INTERVALS = [1, 3, 7, 14, 30]` kun;
- `newReview()` — yangi yozuv (`state: 'new'`, `ease: 2.5`);
- `scheduleReview(r, quality)` — 0–2 «unutdi» → 1 kunga qaytarish, 3–5 → `ease`
  asosida intervalni oshirish (SM-2 ga o'xshash);
- `dueReviews()` — bugungi yoki o'tgan yozuvlarni barqaror tartibda beradi;
- **FSRS algoritmiga o'tish — reja**, hozirda FSRS yo'q.

Sanalar mahalliy kalendar bo'yicha hisoblanadi (`date.ts`: `localDay`,
`addLocalDays`). Bu UTC+5 da `toISOString()` ning oldingi kunga o'tib ketishi va
DST siljishining oldini oladi.

## Tahlil pipeline (Bosqich 1)

```
1. Import       → .md / .txt matni  (PDF/EPUB → Markdown konvertatsiya — reja)
2. Bobga bo'lish → splitChapters() — H1 (#) sarlavhalar bo'yicha
3. Har bob uchun 3 agent chaqiruvi:
      analyst.md     → keyIdeas + terms
      quiz-master.md → quizzes
      life-mentor.md → "hayotda qo'llash" senariylari
4. JSON ajratish va 1 marta qayta urinish (extractJSON / withJSONRetry)
5. Natija BookRecord.analysis ga yoziladi; status: 'analyzed'
6. Yangi quizlar uchun takrorlash yozuvlari yaratiladi (newReview)
```

Qoidalar va sxemalar `apps/desktop/src/rules.ts` orqali import qilinadi:
`agent-rules/*.md` — `?raw`, `agent-rules/schemas/*.json` — JSON sifatida.
`useAnalyze()` hook bobma-bob jarayonni boshqaradi, progress va xatolarni
foydalanuvchiga tushunarli shaklda ko'rsatadi (`analyzeErrorMessage`).

**Xatolar:** AI noto'g'ri JSON qaytarsa — 1 marta retry; baribir bo'lmasa yoki
tarmoq uzilsa — tugallangan boblar saqlanadi va kitob `status: 'partial'` deb
belgilanadi. `AbortSignal` va `runIdRef` komponent o'chirilganda yoki yangi tahlil
boshlanganda eski natijalarning yozilishining oldini oladi.

Markdown ko'rinish `marked` + `DOMPurify` (`lib/md.ts`) bilan render qilinadi —
foydalanuvchi import qilgan matn XSS dan tozalanadi.

**Hozircha yo'q:** PDF/EPUB konvertatsiya va AI ustoz chat (`Book` dagi
«AI ustoz» tabi `soon: true`, ya'ni rejada).

## Internet talablari

| Holat | Internet |
|-------|----------|
| O'qish, quiz, progress (tayyor tahlil bilan) | Yo'q |
| Demo kitob (oldindan tahlil qilingan) | Yo'q |
| Yangi kitob tahlili — Gemini / OpenAI | Ha |
| Yangi kitob tahlili — Ollama | Yo'q (`localhost`) |
| AI ustoz chat | Hozircha amalga oshirilmagan (reja) |

## Keyinchalik: server qo'shilsa (Bosqich 2-3) — reja

```
Hozir:   Desktop (Vite UI) ──(faqat AI API)──→ Internet
Keyin:   Desktop ──(AI API)──→ Internet
               └──(sync API)──→ Study Notes Server ──→ Web versiya
```

- Asosiy dastur **mustaqil ishlaydi** — server ixtiyoriy qo'shiladi;
- Server tahlillarni saqlaydi → web/public kutubxona hosil bo'ladi;
- Sync: foydalanuvchi xohlasa E2E shifrlab yuboradi;
- Arxitektura boshidanoq server'siz qurilgani uchun keyin qo'shish
  integratsiya emas, **alohida xizmat** bo'ladi.
