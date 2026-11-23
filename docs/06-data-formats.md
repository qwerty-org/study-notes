# 06 — Data Formats: JSON formatlar

Barcha AI javoblari va saqlash formatlari shu hujjatda aniqlanadi.
**Bosqich 0'da 1 pilot kitobda qo'lda shu formatlarga moslab sinash kerak.**

> 📌 Namunalar `content/books/10-daqiqa-odatlar/` pilot kitobining **haqiqiy**
> fayllaridan olingan: kalitlar va tuzilma aynan mos, matnlar qisqartirilgan
> bo'lishi mumkin. Kalitlar `packages/core/src/types.ts` tiplari va
> `agent-rules/schemas/*.json` sxemalari bilan moslashtirilgan.
>
> `analysis/` papkasidagi uch fayl (`ideas.json`, `quizzes.json`, `apply.json`)
> kodda bitta `BookAnalysis` obyektiga birlashtiriladi (`apps/desktop/src/seed.ts`):
> `book`, `rulesVersion`, `analyzedAt` → `ideas.json` dan; `chapters` →
> `ideas.json.chapters`; `quizzes` → `quizzes.json.items`; `scenarios` →
> `apply.json.scenarios`.

---

## 1. Kitob metadata — `meta.json`

Haqiqiy fayl: `content/books/10-daqiqa-odatlar/meta.json`.

```json
{
  "slug": "10-daqiqa-odatlar",
  "title": "10 daqiqali odatlar: kichik qadamlar bilan katta o'zgarish",
  "author": "Study Notes (demo)",
  "language": "uz",
  "sourceFormat": "md",
  "chapters": 4,
  "status": "analyzed",
  "analysisVersion": 1,
  "rulesVersion": "2026-10-31",
  "addedAt": "2026-10-31T10:00:00Z",
  "note": "Demo kitob — formatni sinash uchun platforma jamoasi tomonidan yozilgan."
}
```

| Maydon | Turi (`BookMeta`) | Majburiy | Izoh |
|--------|-------------------|----------|------|
| `slug` | `string` | ✅ | Kitob identifikatori; fayl nomi bilan bog'liq, doimiy |
| `title` | `string` | ✅ | Sarlavha |
| `author` | `string` | — | Muallif (ma'lum bo'lsa) |
| `language` | `string` | — | Asl matn tili; AI javoblari foydalanuvchi tilida bo'ladi |
| `sourceFormat` | `'md' \| 'txt' \| 'pdf' \| 'epub'` | ✅ | Manba fayl formati |
| `chapters` | `number` | ✅ | Jami boblar soni (indeks emas) |
| `status` | `'imported' \| 'analyzing' \| 'analyzed' \| 'partial'` | ✅ | Tahlil holati |
| `analysisVersion` | `number` | — | Pipeline versiyasi; o'zgarsa qayta tahlil talab qilinadi |
| `rulesVersion` | `string` | — | Qo'llanilgan agent-qoidalar versiyasi |
| `addedAt` | `string` (ISO 8601) | ✅ | Kutubxonaga qo'shilgan vaqt |
| `note` | `string` | — | Demo izohi / qo'shimcha eslatma |

> ⚠️ `content.md` (to'liq matn) faqat foydalanuvchida — repo'ga KIRMAYDI.
> Qo'shimcha maydonlar (masalan `note`) `sanitizeMeta` tomonidan saqlanadi, lekin
> ularsiz ham format to'g'ri hisoblanadi.

---

## 2. Tahlilchi javobi — `analysis/ideas.json`

`agent-rules/analyst.md` → `schemas/analyst.json`

Yuqori darajadagi kalitlar: `book`, `rulesVersion`, `analyzedAt`, `chapters`.

```json
{
  "book": "10-daqiqa-odatlar",
  "rulesVersion": "2026-10-31",
  "analyzedAt": "2026-10-31T10:00:00Z",
  "chapters": [
    {
      "index": 0,
      "title": "Odat nima va nima uchun muhim",
      "keyIdeas": [
        {
          "id": "ch1-i1",
          "idea": "Kunlik qarorlarning aksariyatini ong emas, odatlar qabul qiladi.",
          "why": "Odat — miyaning ish yukini kamaytiradigan rejasi; odatsiz har bir harakatni o'ylab chiqish kerak va miya charchaydi.",
          "howToApply": "Bugun 5 daqiqa o'tirib, kunlik takrorlanuvchi 3 ta odatingizni yozib chiqing (ichish, telefon, boshlash).",
          "applyTags": ["shaxsiy"]
        }
      ],
      "terms": [
        {
          "term": "Odat tsikli",
          "definitionSimple": "Signal boshlaydi, xohish undaydi, harakat bajariladi, mukofot mustahkamlaydi — shu to'rtlik takrorlanadi.",
          "metaphor": "Komp'yuterda skript avtomatik ishga tushgandek"
        }
      ]
    }
  ]
}
```

**Sxema talablari:**

- `keyIdeas` — 1–5 ta; ichida `idea`, `why`, `howToApply` majburiy.
  `id` sxemada ixtiyoriy bo'lsa-da, pilot ma'lumotda **har doim** yoziladi va
  boshqa fayllardan havola qilinadi.
- `applyTags` — ixtiyoriy; tavsiya etilgan qiymatlar: `ish`, `oila`,
  `do'stlik`, `o'qish`, `shaxsiy` (sxema tavsifi).
- `terms` — 1–6 ta; `term` va `definitionSimple` majburiy, `metaphor` ixtiyoriy.
- `index` — **0 asosli** (`Chapter.index` bilan mos), lekin `id` dagi bob
  nomeri **1 asosli**: `index: 0` → `ch1-i1`, `index: 3` → `ch4-i1`.

---

## 3. Quiz — `analysis/quizzes.json`

`agent-rules/quiz-master.md` → `schemas/quiz.json`

Yuqori darajadagi kalitlar: `book`, `items`.

```json
{
  "book": "10-daqiqa-odatlar",
  "items": [
    {
      "id": "ch1-q1",
      "chapter": 0,
      "type": "scenario",
      "question": "Siz yangi yil qarori qabul qildingiz: \"Bundan keyin har kuni 2 soat o'qiyman!\" Bir haftadan keyin to'satdan to'xtadingiz. Nima noto'g'ri edi?",
      "options": [
        { "key": "A", "text": "Irodangiz yetmadi — odam birini tanlashi kerak" },
        { "key": "B", "text": "Reja juda katta edi — kichik va aniq qadam bilan boshlash kerak edi" },
        { "key": "C", "text": "2 soat kam — 4 soat qilish kerak edi" },
        { "key": "D", "text": "Kitob noto'g'ri tanlangan" }
      ],
      "answer": "B",
      "explain": {
        "correct": "Katta sakrash motivatsiyani so'ndiradi. 1% qoidasi kichik, barqaror qadamni talab qiladi — boshlash oson bo'lishi kerak.",
        "wrong": {
          "A": "Muammo irodada emas — rejaning o'zida. Iroda charchaydi, kichik qadam esa charchamaydi.",
          "C": "Ko'proq — tezroq emas. Yuk orttirish yana tezroq to'xtashga olib keladi.",
          "D": "Kitob muammo emas — hajm muammo. Boshqa kitob bilan ham xuddi shu xato takrorlanadi."
        }
      },
      "difficulty": "easy",
      "concepts": ["ch1-i3"]
    }
  ]
}
```

**Sxema talablari:**

- `items` — 3–8 ta; majburiy kalitlar: `id`, `chapter`, `type`, `question`,
  `options`, `answer`, `explain`.
- `chapter` — 0 asosli bob indeksi (`ideas.json.chapters[].index` bilan mos).
- `type` — `scenario` | `theory`.
- `options` — **aynan 4 ta**, `key` faqat `A`–`D`; `answer` ham `A`–`D`.
- `explain.correct` majburiy; `explain.wrong` — ixtiyoriy lug'at
  (noto'g'ri variant kaliti → izoh), kalitlari `options[].key` ga mos keladi.
- `difficulty` — `easy` | `medium` | `hard` (ixtiyoriy).
- `concepts` — g'oya id'lari massivi (ixtiyoriy); zaif javob shu g'oyalarni
  qayta o'qishga olib keladi. Havolalar `ideas.json` dagi mavjud id larga
  tegishli bo'lishi kerak.

---

## 4. Hayotda qo'llash — `analysis/apply.json`

`agent-rules/life-mentor.md` → `schemas/life-mentor.json`

Yuqori darajadagi kalitlar: `book`, `scenarios`.

```json
{
  "book": "10-daqiqa-odatlar",
  "scenarios": [
    {
      "id": "ch1-a1",
      "ideaId": "ch1-i3",
      "situation": "Siz bir hafta davomida har kuni o'qishga 2 soat vaqt ajratdingiz, lekin 3-kundan keyin charchab to'xtadingiz va endi umuman boshlamayapsiz.",
      "rightAction": "Bugun 10 daqiqagacha qisqartiring: \"Faqat ochib, bitta bob o'qiyman\" deydingiz va shu bilan boshlaysiz.",
      "wrongAction": "Kechikkaningizni yopish uchun bir kunda 3 soat o'qishga urinish.",
      "whyWrong": "Ortiqcha yuk charchatadi va keyingi to'xtashni kafolatlaydi — kichik qadam barqarorlikni saqlaydi.",
      "context": "o'qish"
    }
  ]
}
```

**Sxema talablari:**

- `scenarios` — 1–15 ta; majburiy kalitlar: `id`, `ideaId`, `situation`,
  `rightAction`, `wrongAction`.
- `ideaId` — `ideas.json` dagi g'oya id siga havola (pilot: `ch1-a1` → `ch1-i3`).
- `whyWrong` — ixtiyoriy; `context` — `ish`, `oila`, `do'stlik`, `o'qish`,
  `shaxsiy` qiymatlaridan biri (ixtiyoriy).
- Barcha `id` lar `ideas.json` / `quizzes.json` dagi id lar bilan **noyob**
  bo'lishi kerak — aks holda "Men qo'lladim" jurnali noto'g'ri bog'lanadi
  (`apps/desktop/src/seed.ts` dagi `checkDemoIntegrity` shuni tekshiradi).

---

## 5. Spaced repetition jadvali — `reviews`

Kitob tahlil tugagach **har bir g'oya/quiz uchun** takrorlash yozuvi yaratiladi.
Kodda bu `Review[]` massivi bo'lib, `sn.reviews` kaliti ostida saqlanadi
(kelajakda SQLite jadvali).

```json
{
  "reviewId": "ch1-q1",
  "book": "10-daqiqa-odatlar",
  "type": "quiz",
  "dueDate": "2026-11-01",
  "interval": 1,
  "ease": 2.5,
  "reps": 0,
  "lapses": 0,
  "state": "new"
}
```

| Maydon | Turi | Izoh |
|--------|------|------|
| `reviewId` | `string` | Quiz yoki g'oya id si |
| `book` | `string` | Kitob slug'i (**majburiy** — eski namunalarda yo'q edi) |
| `type` | `'quiz' \| 'idea'` | Nima takrorlanadi |
| `dueDate` | `string` (`YYYY-MM-DD`) | Keyingi takrorlash kuni |
| `interval` | `number` | Hozirgi oraliq, kunlarda (0 — hali takrorlanmagan) |
| `ease` | `number` | FSRS/SM-2 ease omili (taxminan 1.3–3.0) |
| `reps` | `number` | Muvaffaqiyatli takrorlashlar soni |
| `lapses` | `number` | Unutilishlar soni |
| `state` | `'new' \| 'learning' \| 'review'` | Joriy holat |

**Standart jadval (boslang'ich):**

| Takror | Interval |
|--------|----------|
| 1-chi | 1 kun |
| 2-chi | 3 kun |
| 3-chi | 7 kun |
| 4-chi | 14 kun |
| 5-chi | 30 kun |

> Keyin FSRS algoritmi javob sifatiga qarab intervalni o'zgartiradi
> (to'g'ri/tez → uzaytirish, noto'g'ri/qiyin → qisqartirish). Hozircha FSRS
> Bosqich 2+ rejasida.

---

## 6. "Men qo'lladim" jurnali — `applyLog`

`ApplyLogEntry` yozuvi (`sn.applyLog` kaliti). Har bir yozuv **g'oya** yoki
**vaziyat** (senariy) belgisini qayd etadi:

```json
{
  "id": "log-2026-10-31-1",
  "book": "10-daqiqa-odatlar",
  "ideaId": "ch4-i2",
  "refId": "ch4-i2",
  "kind": "idea",
  "date": "2026-11-01",
  "note": "Ertalab 5 daqiqa kitob o'qish odatini boshladim",
  "context": "shaxsiy"
}
```

Vaziyat uchun yozuv (`kind: "scenario"`):

```json
{
  "id": "log-2026-10-31-2",
  "book": "10-daqiqa-odatlar",
  "ideaId": "ch2-i1",
  "refId": "ch2-a1",
  "kind": "scenario",
  "date": "2026-11-01",
  "context": "ish"
}
```

| Maydon | Turi | Izoh |
|--------|------|------|
| `id` | `string` | Yozuv identifikatori (`crypto.randomUUID()`) |
| `book` | `string` | Kitob slug'i (**majburiy**) |
| `ideaId` | `string` | Bog'langan g'oya id si — eski kod bilan moslik uchun har doim yoziladi |
| `date` | `string` (`YYYY-MM-DD`) | Qo'llangan kun (mahalliy sana) |
| `note` | `string` | Foydalanuvchi izohi (ixtiyoriy) |
| `context` | `string` | Erkin satr: `ish`, `uy`, `shaxsiy` va h.k. (ixtiyoriy) |
| `kind` | `'idea' \| 'scenario'` | Yozuv turi (ixtiyoriy; yo'q bo'lsa `idea` deb hisoblanadi) |
| `refId` | `string` | Asl obyekt id si (ixtiyoriy; yo'q bo'lsa `ideaId` ishlatiladi) |

### `kind` / `refId` farqi (muhim)

Ilgarda g'oya va vaziyat belgilari bir xil `ideaId` bilan saqlanar, natijada
vaziyatga qo'yilgan belgi g'oyaning "Qo'lladim" tugmasini ham yoritib qo'yardi.
Bu ajratish orqali tuzatildi (`docs/04-ui-ux.md`, 2026-11):

- **`kind: 'idea'`** → `refId` = g'oya id si (masalan `ch4-i2`);
- **`kind: 'scenario'`** → `refId` = **vaziyat id si** (masalan `ch2-a1`),
  `ideaId` esa bog'langan g'oya id si bo'lib qoladi;
- eski yozuvlarda `kind`/`refId` yo'q — ular `idea` deb o'qiladi va
  `refId ?? ideaId` orqali ko'rsatiladi (`sanitizeApplyLog`,
  `packages/core/src/storage.ts`).

---

## 7. Foydalanuvchi profili va progress

Hozirgi amalga oshirish **localStorage** (kelajakda SQLite `data.db`). Kalitlar:
`sn.profile`, `sn.aiConfig`, `sn.library`, `sn.reviews`, `sn.applyLog`,
`sn.onboarding`. Eksport/import bitta JSON fayl (`app: "study-notes"`,
`version: 1`) bilan amalga oshiriladi; eksport paytida `apiKey` **tozalanadi**.

```json
{
  "profile": {
    "name": "Aziz",
    "avatar": "🦊",
    "streak": 12,
    "lastActive": "2026-11-01",
    "language": "uz",
    "theme": "dark",
    "onboarded": true
  },
  "aiConfig": {
    "provider": "gemini",
    "apiKey": "",
    "model": "gemini-2.0-flash"
  },
  "bookProgress": {
    "percent": 43,
    "currentChapter": 3,
    "currentPage": 12,
    "readChapters": [0, 1, 2, 3],
    "quizCorrect": 26,
    "quizTotal": 30,
    "reader": { "fontSize": 16, "paper": "paper" },
    "highlights": []
  }
}
```

| Guruh | Maydonlar | Izoh |
|-------|-----------|------|
| `profile` | `name`, `avatar`, `streak`, `lastActive?`, `language`, `theme`, `onboarded` | `language` faqat `uz`; `theme` — `dark` \| `light`; `streak` har faol kunda yangilanadi |
| `aiConfig` | `provider`, `apiKey`, `model?` | `provider` — `gemini` \| `openai` \| `ollama`; `apiKey` faqat lokal saqlanadi (eksportga kirmaydi) |
| `bookProgress` | `percent`, `currentChapter`, `currentPage?`, `readChapters`, `quizCorrect`, `quizTotal`, `reader?`, `highlights?` | `quizAvg` yo'q — o'rtacha ball `quizCorrect / quizTotal` dan hisoblanadi; `currentChapter` 0 asosli |
| `onboarding` | `step`, `done` | `sn.onboarding` kalitida alohida saqlanadi |

> Eski fayllarda `apiKeyEncrypted` va `quizAvg` ko'rinishi mumkin — ular joriy
> kontraktda yo'q; to'g'ri nomlar `apiKey` va `quizCorrect`/`quizTotal`.

---

## 8. Umumiy qoidalar

| Qoida | Tushuntirish |
|-------|--------------|
| `id` doimiy | `ch4-i1` = 4-bob, 1-g'oya — qayta tahlilda ham saqlanadi. Bob `index` 0 dan, `id` dagi bob nomeri 1 dan boshlanadi |
| ID lar noyob | G'oya, savol va vaziyat id lari o'zaro takrorlanmasligi kerak |
| `applyTags` | "qo'llash jurnali" va statistika uchun kontekst filtri (`ish`, `oila`, `do'stlik`, `o'qish`, `shaxsiy`) |
| `concepts` | Quiz → g'oya bog'lanishi: zaif javob = g'oyani qayta o'qish |
| `kind` / `refId` | Jurnaldagi g'oya va vaziyat belgilarini ajratadi; `refId` asl obyekt id si |
| `rulesVersion` | Qoida o'zgarsa — tahlil qayta hisoblanishi mumkin |
| `analyzedAt` | Tahlil tugagan vaqt (ISO 8601), `BookAnalysis` ga kiritiladi |
| JSON Schema | Har bir format uchun `agent-rules/schemas/*.json` — AI javobi shu yerda validatsiya qilinadi |
| Til | AI javoblari o'zbekcha (foydalanuvchi tilida), `sourceFormat` asl matn tili |

## Validatsiya qoidalari

1. AI JSON qaytarishi **shart** — boshqa matn qabul qilinmaydi.
2. JSON parse xatosi → 1 retry (xato bilan qayta so'raladi).
3. Sxemaga mos kelmasa (masalan `answer` "A–D" emas yoki `options` 4 ta emas)
   → tuzatish yoki `partial`.
4. Majburiy maydonlar yo'q bo'lsa → bob `partial` holatda saqlanadi.
5. Saqlashdan o'qishda barcha yozuvlar `sanitize*` funksiyalari orqali o'tadi:
   eski/shikastlangan qiymatlar standart bilan to'ldiriladi, ilova tashlamaydi.
