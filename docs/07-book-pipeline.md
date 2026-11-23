# 07 — Kitob pipeline: matn → Markdown → bobma-bob AI tahlil

Bu hujjat kitob matnini qurilmaga olib kirishdan tortib, uni AI bilan bobma-bob
tahlil qilishgacha bo'lgan to'liq yo'lni tavsiflaydi.

> **Holat belgilari**
>
> - ✅ **Amalga oshirilgan** — brauzer prototipida ishlaydigan kod
>   (`apps/desktop/src/pages/Library.tsx`, `apps/desktop/src/lib/useAnalyze.ts`,
>   `packages/core/src/parsing.ts`, `packages/ai/src/analyze.ts`).
> - 🔮 **Kelajak** — rejalashtirilgan, lekin hozirgi kodda **yo'q** (PDF/EPUB
>   konvertatsiyasi, OCR, uzun bobni qayta bo'lish).
>
> Hozirgi prototip **faqat matnli fayllar** (`.md`, `.markdown`, `.mdx`, `.txt`)
> bilan ishlaydi. Kutubxona ekranidagi izoh ham buni tasdiqlaydi:
> _"PDF va EPUB konvertatsiyasi keyingi bosqichda. Matnli fayllar eng yaxshi natija beradi."_

## Holat jadvali (bir qarashda)

| Bosqich | Holat | Izoh |
|---------|-------|------|
| Fayl tanlash (drag & drop / picker), bir nechta fayl | ✅ | `Library.tsx` |
| `.md` / `.markdown` / `.mdx` / `.txt` o'qish | ✅ | `file.text()` orqali |
| Matnni `BookRecord.content` ga saqlash | ✅ | `localStorage` (`sn.library`) |
| `#` (H1) sarlavhalar bo'yicha boblarga bo'lish | ✅ | `splitChapters()` |
| `##` bo'yicha bo'lish, uzun/qisqa bob qayta bo'lish | 🔮 | Hozircha yo'q |
| Bobma-bob AI tahlil (3 agent) | ✅ | `analyzeChapter()` |
| JSON retry va xato xabarlarini tarjima qilish | ✅ | `withJSONRetry`, `analyzeErrorMessage` |
| Qisman natijani `partial` holatda saqlash | ✅ | `savePartial()` |
| Takrorlash (spaced repetition) jadvalini yaratish | ✅ | 5 tadan guruhlab, kuniga |
| PDF → Markdown, EPUB → Markdown | 🔮 | Kodda yo'q |
| OCR (skanlangan PDF) | 🔮 | Bosqich 0 ga kiritilmagan |

## Nega Markdown?

- ✅ LLM'lar Markdown'ni **eng yaxshi tushunadi** (semantik tuzilma aniq)
- ✅ O'qish rejimida chiroyli render (headings, listlar, iqtiboslar)
- ✅ Boblarga ajratish oson (`#` sarlavhalar bo'yicha)
- ✅ O'zgartirish, diff, versiyalash — hamma narsa matn

Shu sababli prototip matnli faylni to'g'ridan-to'g'ri Markdown deb qabul qiladi:
`.txt` ham ichki tuzilmasi bo'yicha xuddi shunday qayta ishlanadi (farqi faqat
`meta.sourceFormat` maydonida qayd etiladi).

## Umumiy oqim

```
(Foydalanuvchi fayl tanlaydi — drag & drop yoki "Kitob qo'shish")
   │
   ├─ ✅ .md / .markdown / .mdx / .txt → file.text() → matn
   │
   └─ 🔮 .pdf / .epub → konvertatsiya → Markdown   (hozircha yo'q)
   │
   ▼
✅ Matn tekshiriladi (bo'sh emas), sarlavha olinadi, slug yaratiladi
   │
   ▼
✅ splitChapters(content) → Chapter[]   (# H1 bo'yicha)
   │
   ▼
✅ Har bob: analyst → quiz-master → life-mentor  (3 ta AI chaqiruvi)
   │      JSON retry (1 marta) · xatolik → partial saqlash
   ▼
✅ BookAnalysis → BookRecord.analysis + meta.status = 'analyzed' | 'partial'
   │
   ▼
✅ Yangi quizlar uchun takrorlash jadvali (review) yaratiladi
```

## 1. Matn import qilish ✅ (amalga oshirilgan)

`Library.tsx` dagi `importFiles()`:

- **Qabul qilinadi:** `.md`, `.markdown`, `.mdx`, `.txt` (`ACCEPT` / `SUPPORTED`).
- **Bir nechta fayl** bir vaqtda qo'shiladi; yuklash progressi
  (`{ done, total }`) ko'rsatiladi.
- Fayl `await file.text()` bilan o'qilib, butun matn `BookRecord.content` ga
  yoziladi — alohida `content.md` fayli yaratilmaydi (pastga qarang: §8).
- **Tekshiruvlar:**
  - qo'llab-quvvatlanmaydigan kengaytma → `faqat .md, .markdown, .mdx yoki .txt`
  - bo'sh fayl → `fayl bo'sh`
  - o'qish xatosi → `o'qib bo'lmadi`
- **Sarlavha:** `titleFromContent()` birinchi bo'sh bo'lmagan qatorni oladi
  (`^#{1,2}` sarlavha yoki 3–80 belgili qator); topilmasa — fayl nomi
  (kengaytmasiz).
- **Slug:** `slugify(sarlavha)`, takrorlanishda `-2`, `-3`, … qo'shiladi;
  `kitob` reserved so'zi chetlab o'tiladi.
- **Metadata:** `sourceFormat` = `md` (md/mdx) yoki `txt` (txt/markdown),
  `chapters` = `splitChapters(text).length`, `status` = `imported`,
  `addedAt` = ISO vaqt.
- Yagona fayl qo'shilganda foydalanuvchi avtomatik tarzda `/kitob/{slug}`
  sahifasiga o'tkaziladi; AI tahlil esa kitob sahifasidan boshlanadi.

> Eslatma: `BookMeta.sourceFormat` turi `pdf` va `epub` qiymatlariga ruxsat
> beradi, lekin **UI ularni qabul qilmaydi** — bu turlar kelajakdagi
> konvertatsiya uchun ajratilgan.

## 2. EPUB 🔮 (kelajak)

Reja (hozirgi kodda yo'q):

- Kutubxona: `epub.js` (JS) yoki `ebooklib` (Python)
- Ichidagi HTML → **turndown** bilan Markdown'ga
- `<h1>–<h6>` → `#` headinglar (bob bo'lish uchun muhim)
- Suratlar lokal papkaga nusxalanadi, Markdown'da yo'l ko'rsatiladi
- Metadata (title/author) → `meta`

**Kutilgan sifat:** yuqori — EPUB allaqachon toza strukturali.
**Amalga oshirish sharti:** `sourceFormat: 'epub'` faqat konvertatsiyadan
keyin o'rnatilishi kerak (hozir import faqat `md`/`txt` yozadi).

## 3. PDF — matnga asoslangan 🔮 (kelajak)

Reja (hozirgi kodda yo'q):

- Kutubxona: `pdf-parse` (Node) yoki `pymupdf` (Python)
- Har sahifa matni → bloklar → Markdown
- ⚠️ **Mumkin muammolar:** ikki ustunli sahifalar tartibining buzilishi,
  jadvallarning matnga aylanishi, sarlavha formatining yo'qolishi,
  sahifa raqami / header / footer chiqindilari

**Mitigatsiya rejasi:**
1. Konvertatsiyadan keyin **preview** (birinchi bobni ko'rsatish)
2. Murakkab PDF uchun: _"Bu PDF murakkab — EPUB bo'lsa sifat yaxshiroq bo'ladi"_
3. Boblarni aniqlay olmasak — foydalanuvchi qo'lda sarlavha qo'shadi
   yoki "Faqat 1 bob" rejimi ishlatiladi

Hozircha foydalanuvchi buni qo'lda qilishi kerak: PDF'ni tashqi vosita bilan
`.md`/`.txt` ga aylantirib, so'ng prototipga import qilish.

## 4. PDF — skan (rasm) ⚠️ 🔮 (kelajak, kiritilmaydi)

- Matn yo'q → **OCR** kerak (Tesseract yoki AI vision API)
- O'zbek lotin/krill va murakkab shriftlarda xato ko'p
- **Qaror:** OCR **Bosqich 0 ga kiritilmaydi**. Kelajakda skan PDF uchun aniq
  ogohlantirish ko'rsatilishi kerak:
  > "Bu faylda matn topilmadi (skanlangan bo'lishi mumkin).
  > Matnli PDF yoki EPUB ishlating."

Hozirgi prototip bunday faylni umuman qabul qilmaydi (kengaytma `.pdf` bo'lgani
uchun import ro'yxatiga kirmaydi).

## 5. Markdown qoidalari va bob ajratish ✅ / 🔮

**Amalga oshirilgan** (`packages/core/src/parsing.ts`):

- `splitChapters(content)` faqat **`# ` (H1)** sarlavhalar bo'yicha bo'ladi
  (regex `^#\s+(.*)$`); `## ` alohida bob yaratmaydi, bob matnida qoladi.
- CRLF → LF normalizatsiya qilinadi.
- Sarlavhadagi `1-bob:`, `2 – bob:` kabi prefikslar olib tashlanadi
  (`/^\d+[-–—]\s*bob\s*:\s*/i`).
- Birinchi sarlavhagacha bo'lgan qatorlar **"Kirish"** bobi deb ataladi.
- Bo'sh boblar tashlab yuboriladi; `index` tartib bilan beriladi.
- Unicode (o'zbekcha lotin/krill) o'zgarishsiz saqlanadi.

Kutilgan Markdown ko'rinishi (tavsiya etiladi):

```markdown
# 1-bob: Sarlavha

Matn paragraflari...

> Iqtibos (asosiy gaplar shu yerda)

- Ro'yxatlar

**Termin** — qisqa izoh
```

**Hozircha amalga oshirilmagan** (🔮): uzun bobni paragraf chegarasida qayta
bo'lish, qisqa boblarni birlashtirish, referens/sahifa raqamlarini yig'ib
chiqish yoki o'chirish.

## 6. Chunking va AI tahlil ✅ (amalga oshirilgan)

`useAnalyze(book)` (`apps/desktop/src/lib/useAnalyze.ts`) va
`analyzeChapter()` (`packages/ai/src/analyze.ts`):

- Boblar **ketma-ket** qayta ishlanadi (`for` + `await`).
- Har bob uchun **3 ta agent chaqiruvi** (tartib muhim):
  1. **analyst** — `G'oyalar va terminlar` (`keyIdeas`, `terms`)
  2. **quiz-master** — `Quiz savollari` (g'oyalar asosida)
  3. **life-mentor** — `Hayotdagi vaziyatlar` (g'oyalar asosida)
- Agent qoidalari va JSON sxemalari `agent-rules/*.md?raw` va
  `agent-rules/schemas/*.json` dan olinadi (`apps/desktop/src/rules.ts`).
- AI ga yuboriladigan `user` xabar: `BOB {n}: {sarlavha}\n\n---\n\n{bob matni}`.
  **Faqat hozirgi bob** yuboriladi, butun kitob emas.
- Avtomatik ID lar: `ch{n}-i{m}` (g'oya), `ch{n}-q{m}` (quiz),
  `ch{n}-a{m}` (vaziyat).
- **Progress:** `{ done, total, phase, title }` — foydalanuvchi
  "4/12 bob tahlil qilindi" ko'rinishidagi holatni ko'radi.
- **Natija saqlash:** `BookAnalysis` = `book` (slug),
  `rulesVersion: 'rules-2026-10-31'`, `analyzedAt`, `chapters`, `quizzes`,
  `scenarios`. `updateBook()` orqali kitobga yoziladi;
  `meta.status` → `analyzed` (muvaffaqiyat) yoki `partial` (xato),
  `meta.chapters` va `meta.rulesVersion` ham yangilanadi.
- **Takrorlash jadvali:** yangi quizlar uchun `Review` yozuvlari yaratiladi,
  `dueDate` 5 tadan guruhlab kuniga taqsimlanadi (`addDays(floor(i / 5))`);
  mavjud `reviewId` lar takrorlanmaydi.
- **Bekor qilish xavfsizligi:** `mountedRef` va `runIdRef` komponent
  o'chganda yoki yangi tahlil boshlanganda eski natijalarning yozilishining
  oldini oladi.
- Matn topilmasa: _"Kitobda tahlil qilinadigan matn topilmadi. Avval matn qo‘shing."_

**Nega chunking:** arzonroq (kam token), aniqroq (model qisqa matnga yaxshiroq
javob beradi), progress ko'rinadi, xato bo'lsa nazariy jihatdan bitta bobni
qayta ishlash mumkin (pastga qarang: §7 — qayta ishga tushirish hozircha to'liq
boblar ro'yxatidan boshlanadi).

## 7. Xato boshqaruvi va texnik xavflar

**Amalga oshirilgan:**

- `extractJSON()` — ```` ```json ```` fence'larini, ortiqcha matnni va
  oxirgi vergulni tozalab `JSON.parse` qiladi.
- `withJSONRetry()` — JSON parse xatosida **1 marta** qayta urinadi
  (modelga "faqat JSON qaytar" degan izoh bilan).
- `analyzeErrorMessage()` — xom API xatolarini tushunarli o'zbekcha xabarga
  aylantiradi (kalit/401/403, 429/band, Ollama ishlamadi, JSON tushunilmadi,
  tarmoq/5xx, umumiy holat).
- Xato yuz berganda tugallangan boblar `partial` holatda saqlanadi.

**Texnik xavflar jadvali:**

| Muammo / xavf | Hozirgi holat | Yechim / eslatma |
|---------------|---------------|------------------|
| PDF/EPUB konvertatsiyasi yo'q | 🔮 UI aniq "keyingi bosqichda" deb ogohlantiradi | Hozircha faylni tashqi vositada `.md`/`.txt` ga aylantirib import qilish |
| Skan PDF (OCR) | 🔮 Kiritilmagan; `.pdf` umuman qabul qilinmaydi | Matnli fayl talab qilinadi; kelajakda aniq ogohlantirish kerak |
| Faqat H1 bo'yicha bo'lish | ✅ Ishlaydi, lekin `##` bob yaratmaydi | Bob ichidagi H2 lar matn sifatida qoladi; muallif H1 ishlatishi kerak |
| Uzun bob token limitiga chiqishi | 🔮 Qayta bo'lish yo'q | Hozircha bob butunlay yuboriladi → sifat/xato xavfi; keyin paragraf bo'yicha bo'lish kerak |
| Qo'lda sarlavha / "Faqat 1 bob" | 🔮 Yo'q | Bo'lmagan taqdirda butun matn "Kirish" bobi sifatida tahlil qilinadi |
| Qisman tahlilni davom ettirish | ⚠️ Xabar "tugallanmagan boblar davom etadi" deydi, lekin kod har safar **0-bobdan** boshlaydi | Mavjud natijalar ustiga yoziladi; haqiqiy resume mexanizmi keyingi vazifa |
| Sxema validatsiyasi | ⚠️ Sxema promptga kiritiladi, JSON parse qilinadi, lekin dasturiy sxema tekshiruvi yo'q | Noto'g'ri maydon (masalan `answer` qiymati) model ixtiyorida; keyin validator qo'shish kerak |
| CORS | ✅ Gemini va Ollama brauzerda ishlaydi; OpenAI uchun CORS muammosi bo'lishi mumkin | Desktop qobig'iga (Tauri/Electron) o'tganda muammo yo'qoladi |
| Kalit talabi | ✅ `ollama` dan boshqa provayderda kalit shart (`needKey`) | Sozlamalar → AI bo'limida kalit qo'shish |
| `localStorage` hajmi / yozib bo'lmaslik | ⚠️ `lsSet()` xatoni jim yutadi | Katta kitoblar saqlanmay qolishi mumkin; kelajakda SQLite (Tauri/Electron) |

## 8. Saqlash va qonuniy nuansa (mualliflik)

**Saqlash (hozirgi holat):**

- Ma'lumotlar `packages/core/src/storage.ts` adapteri orqali
  **brauzer `localStorage`** da saqlanadi (`sn.library`, `sn.reviews`,
  `sn.applyLog`, `sn.aiConfig` va boshqalar).
- Kitob matni va tahlili **bitta `BookRecord` obyekti** ichida:
  `meta` + `content` (butun matn) + `analysis` + `progress`.
- Kelajakda Tauri/Electron qobig'ida **SQLite** ga o'tish rejalashtirilgan —
  saqlash interfeysi (`store`) bir xil bo'lib qoladi.
- Eksport/import mavjud, lekin API kaliti eksportga kiritilmaydi
  (`apiKey: ''` bilan chiqariladi).

**Maxfiylik:**

- Kitob matni foydalanuvchi qurilmasida saqlanadi, repo'ga yuborilmaydi.
- ✅ AI ga **faqat hozirgi bob** matni yuboriladi.
- ⚠️ **Provayderga qarab farq bor:** `ollama` tanlansa matn lokal
  (`http://localhost:11434`) qayta ishlanadi; `gemini` yoki `openai`
  tanlansa bob matni ularning **bulut API** siga yuboriladi. Shuning uchun
  mualliflik huquqi bor matnlarni bulut provayderi bilan tahlil qilishdan
  oldin foydalanuvchi xabardor bo'lishi kerak.
- Repo/serverda faqat bizning o'zgartirilgan tahlilimiz (`analysis/`) saqlanishi
  rejalashtirilgan; xom `content` hech qachon repo'ga kirmaydi.

## 9. Bosqich 0'da sinash kerak bo'lgan fayllar

Hozirgi prototipda **faqat matnli fayllar** bilan sinov o'tkazish mumkin:

1. ✅ To'g'ri tuzilgan `.md` (H1 sarlavhalar bilan, 100+ bob bo'lmasa ham)
2. ✅ Oddiy `.txt` (sarlavhasiz — "Kirish" bobi hosil bo'lishini tekshirish)
3. ✅ `.markdown` / `.mdx` kengaytmalari
4. ⚠️ Ustma-ust sarlavhalar / izchil bo'lmagan H1 — xato xabari qanday ko'rinadi?
5. 🔮 Yaxshi matnga asoslangan PDF (konvertatsiya amalga oshirilgandan keyin)
6. 🔮 EPUB (o'zbekcha va boshqa tilda)
7. 🔮 Ikki ustunli PDF
8. 🔮 Skan PDF → ogohlantirish ekrani

**Natija (kelajak uchun mezon):** har bir format uchun Markdown namunasi +
sifat bahosi (1–5). Faqat qoniqarli natija bilan konvertatsiya Bosqich 1 ga
o'tkaziladi. Hozirgi bosqichda asosiy maqsad — `.md`/`.txt` import va
bobma-bob tahlilning barqaror ishlashini ta'minlash.
