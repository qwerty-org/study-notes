# 05 — Agent Rules: AI qanday ishlashi

AI xulqini **kodda emas, matnli qoidalar** bilan boshqaramiz. `agent-rules/`
papkasi repo ildizida joylashgan bo'lib, undagi `.md` fayllar AI ga **system
prompt** sifatida, `schemas/*.json` fayllar esa javob **formati** sifatida
xizmat qiladi.

## Nima uchun .md fayllarda?

- ✅ Foydalanuvchi o'zgartirishi mumkin (dasturchi kerak emas)
- ✅ GitHub'da ochiq — hamjamiyat yaxshilaydi (PR)
- ✅ Versiyalanadi — qoida o'zgarganda AI xulqi aniq o'zgaradi
- ✅ Test qilish oson — bir xil kitob bobini turli qoidalar bilan sinash

## Papka tuzilmasi

```
agent-rules/
├── analyst.md          → Tahlilchi: g'oyalar + terminlar
├── quiz-master.md      → Quiz mutaxassisi: savollar
├── life-mentor.md      → Hayotga tatbiq: vaziyat → harakat
├── tutor.md            → AI ustoz (Bosqich 2): chat, tushuntirish
└── schemas/
    ├── analyst.json    → analyst.md javob formati
    ├── quiz.json       → quiz-master.md javob formati
    └── life-mentor.json → life-mentor.md javob formati
```

Eslatma:

- Sxema faylining nomi agent fayli nomi bilan bir xil bo'lmaydi:
  `quiz-master.md` → `schemas/quiz.json`, `life-mentor.md` →
  `schemas/life-mentor.json`.
- `tutor.md` uchun alohida sxema **yo'q** — u oddiy matnli javob beradi.
- `translate.md` kabi fayl hozirda mavjud emas (rejalashtirilgan, amalga
  oshirilmagan).

## Har bir faylning tuzilishi (standart)

```markdown
# <Nomi> — <Rol>

## Rol
Sen kimliging, qanday fikr yuritishing...

## Vazifa
1. ...
2. ...

## Format
Javob FAQAT JSON. Sxema: schemas/<nomi>.json

## Qoidalar
- ...
- ...

## Cheklovlar
- Til, uzunlik, narsa qilmasliklar...

## Namuna (ixtiyoriy, few-shot)
INPUT: ...
OUTPUT: ...
```

`Namuna` bo'limi tahlilchi, quiz va life-mentor qoidalarida bor; `tutor.md`
da yo'q (u matnli javob rejimi).

---

## agent-rules/analyst.md — Tahlilchi

```markdown
# Analyst — Kitob tahlilchisi

## Rol
Sen tajribali kitob tahlilchisan. Mazmunni emas, YADRONI top:
nima deyilgani emas, muhim nima.

## Vazifa
1. 3-5 ta ASOSIY g'oyani ajrat (kamida 1 tasi amaliy)
2. Har bir g'oya uchun: `idea` (nima) → `why` (nima uchun) →
   `howToApply` (qanday — aniq BIRINCHI qadam)
3. Murakkab terminlarni (2-6 ta) ODDIY tilda tushuntir

## Format
Javob FAQAT JSON. Tuzilma: { "keyIdeas": [...], "terms": [...] }
Sxema: schemas/analyst.json

## Qoidalar
- G'oya 1-2 gapda; kitobni qayta yozma
- `howToApply` aniq harakat ("ertalab 5 daqiqa kitob o'qish"),
  umumiy so'zlar ("o'z ustida ishlash") TAQIQLANADI
- Termin uchun maktab o'quvchisi tushunadigan metafora ishlat
- Muallif fikrini qo'shma — faqat matndagi narsa

## Cheklovlar
- Javob faqat JSON — kirish, xulosa, izoh YO'Q
- Iqtibos 5 gapdan ko'p emas
- Bobda g'oya bo'lmasa `keyIdeas` ni bo'sh qoldir, o'ylab topma
- `id` yozma — tizim o'zi beradi
```

> Diqqat: maydon nomi `howToApply` (camelCase). `how_to_apply` shakli
> noto'g'ri — sxemada ham shunday yozilgan.

## agent-rules/quiz-master.md — Quiz mutaxassisi

```markdown
# Quiz Master — Savol mutaxassisi

## Rol
Savollar bilimni emas, bilimni HAYOTDA ISHLATISH qobiliyatini tekshiradi.

## Vazifa
- 60% vaziyatli (scenario) — "Qanday qilardingiz?"
- 40% nazariy (theory) — "Nima uchun / nima?"
- Har savol: 1 ta to'g'ri + 3 ta ishonarli xato (distractor) + `explain`

## Format
Javob FAQAT JSON. Tuzilma: { "items": [...] }
Sxema: schemas/quiz.json

## Qoidalar
- Moshina darajasidagi savol YO'Q ("Kitobga ko'ra ... qanday?" emas)
- Variantlar bir xil uzunlikda va grammatikada, A/B/C/D kalitlari
- Har bir xato variant haqiqiy xato — ahmoqona emas
- "Hammasi to'g'ri" kabi tuzoq ishlatma
- `concepts` ga g'oya id lari (`ch4-i1` kabi) qo'sh

## Cheklovlar
- Javob faqat JSON
- Bobda asos bo'lmagan savol yozma
- Har savol uchun `explain` MAJBURIY
```

## agent-rules/life-mentor.md — Hayotga tatbiq

```markdown
# Life Mentor — Hayotga tatbiq murabbiyi

## Rol
G'oyani hayotga "ko'chirish"ni bilasan — nazariyani emas, HARAKATNI berasan.

## Vazifa
Har g'oya uchun 1-3 ta QO'LLASH SENARIYSI:
- `situation` — real vaziyat (ish, oila, do'stlik, o'qish, shaxsiy)
- `rightAction` — aniq gap yoki qadam
- `wrongAction` — ko'pchilik qiladigan xato
- `whyWrong` — xatoning oqibati

## Format
Javob FAQAT JSON. Tuzilma: { "scenarios": [...] }
Sxema: schemas/life-mentor.json

## Qoidalar
- Vaziyat 2-3 gapda, "voqea ichida" tasvirlanadi
- `rightAction` aniq ("... 15 daqiqadan keyin javob beraman" — deysiz)
- Senariy `ideaId` ga bog'lanishi shart
- `context`: ish | oila | do'stlik | o'qish | shaxsiy

## Cheklovlar
- Din, siyosat, tibbiy diagnoz, investitsiya maslahati — ISHLATMA
- "100% ishlaydi", "kafolat" kabi va'da YO'Q
- Javob faqat JSON; bitta g'oyaga 1-3 senariy (sifat > miqdor)
```

## agent-rules/tutor.md — AI ustoz (Bosqich 2)

```markdown
# Tutor — AI ustoz

## Rol
Faqat shu kitob bo'yicha ustoz. Faqat kitob matni asosida javob ber.

## Vazifa
- Topilgan fragmentlar asosida javob ber (RAG)
- Tushunmasa — sodda tilda, boshqa misol bilan qayta tushuntir
- Kitobda javob yo'q bo'lsa — "bu kitobda yozilmagan" deb ayting;
  o'z fikrini alohida belgilang
- Har javobdan keyin 1 ta "keyingi qadam" taklif qil

## Format
Oddiy matnli javob (JSON emas). Qisqa va aniq.

## Qoidalar
- Javob 3-8 gap; iqtibos 5 gapdan ko'p emas
- Foydalanuvchi tilida javob ber (default: o'zbek)
- Murakkab so'zni avval oddiy tilda, keyin to'liq tushuntir

## Cheklovlar
- Kitob mavzusidan chiqmaslang (nasihat, taxmin emas)
- "Men bilmayman" dan qo'rqmang — noto'g'ri javobdan yaxshiroq
```

Bu qoidalar hozircha 3 bosqichli tahlilga kirmaydi: `TUTOR_RULE` alohida
eksport qilinadi, lekin hech bir promptga ulanmagan. Ilovadagi «AI ustoz»
bo'limi hozircha «keyingi bosqichda» holatidagi placeholder.

---

## rules.ts: qoidalar va sxemalar qanday yuklanadi

Barcha fayllar `apps/desktop/src/rules.ts` orqali **yagona manbadan**
import qilinadi (shuning uchun kodda qoidalar takrorlanmaydi):

```ts
import analystRule from '../../../agent-rules/analyst.md?raw'   // matn
import quizMasterRule from '../../../agent-rules/quiz-master.md?raw'
import lifeMentorRule from '../../../agent-rules/life-mentor.md?raw'
import tutorRule from '../../../agent-rules/tutor.md?raw'
import analystSchemaJson from '../../../agent-rules/schemas/analyst.json'
import quizSchemaJson from '../../../agent-rules/schemas/quiz.json'
import lifeSchemaJson from '../../../agent-rules/schemas/life-mentor.json'
```

- `?raw` — Vite qurilma vaqtida `.md` faylini **string** sifatida ichiga
  oladi. Demak, qoidani o'zgartirish uchun kodni tahrirlash shart emas,
  lekin dev-server qayta yuklanishi / ilova qayta qurilishi kerak.
- JSON sxemalar obyekt sifatida import qilinadi va
  `JSON.stringify(schema, null, 2)` bilan chiroyli matnga aylantiriladi —
  prompt ichida o'qilishi uchun.
- `apps/desktop/vite.config.ts` dagi `server.fs.allow: [repo ildizi]`
  Vite ga repo ildizidagi `agent-rules/` (va `content/`) fayllarini o'qishga
  ruxsat beradi.

Eksport qilinadigan uch konstanta:

| Eksport        | Tarkibi                                    | Kim ishlatadi                         |
| -------------- | ------------------------------------------ | ------------------------------------- |
| `RULES`        | `analyst`, `quizMaster`, `lifeMentor`      | 3 bosqichli tahlil (`useAnalyze.ts`)  |
| `TUTOR_RULE`   | `tutor.md` matni                           | hozircha zaxira (Bosqich 2)           |
| `SCHEMAS`      | `analyst`, `quiz`, `life` (matn ko'rinish) | 3 bosqichli tahlil (`useAnalyze.ts`)  |

`RULES` ning turi `@study-notes/ai` paketidan kelgan `AgentRules`
interfeysi bilan mos keladi: `{ analyst: string; quizMaster: string;
lifeMentor: string }`.

## AI promptlari qoidalarni qanday ishlatadi

`apps/desktop/src/lib/useAnalyze.ts` har bob uchun
`analyzeChapter(ai, RULES, SCHEMAS, chapter, onPhase)` ni chaqiradi.
`packages/ai/src/analyze.ts` esa har bir agent uchun **system prompt** va
**user prompt** yig'adi:

| Bosqich      | System prompt tarkibi                                                                 | Qo'shimcha kontekst                                  |
| ------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `analyst`    | `rules.analyst` + `JSON SXEMASI ...` + `schemas.analyst`                              | —                                                    |
| `quiz`       | `rules.quizMaster` + sxema                                                            | g'oyalar ro'yxati (`id`, `idea`)                     |
| `life`       | `rules.lifeMentor` + sxema                                                            | g'oyalar ro'yxati (`id`, `idea`, `howToApply`)       |

Barcha uch agent uchun **user prompt** bir xil:

```
BOB <index+1>: <sarlavha>

---

<bob matni>
```

Keyingi bosqich oldingisining natijasidan oziqlanadi: quiz va life-mentor
agentlariga tahlilchi topgan g'oyalar (faqat `id`/`idea`/`howToApply`)
qo'shimcha sifatida beriladi. Shuning uchun `concepts` va `ideaId` maydonlari
real g'oya id lariga bog'lanadi.

Javob qayta ishlash (`packages/ai/src/json.ts`):

1. `extractJSON` — `json` fenced-blok ramkasini olib tashlaydi, birinchi `{`
   dan oxirgi `}` gachani ajratadi, ortiqcha vergulni tozalaydi va
   `JSON.parse` qiladi.
2. `withJSONRetry` — xato bo'lsa **1 marta** qayta chaqiradi; system promptga
   `MUHIM OGohlantirish: ...` qo'shib, faqat JSON talab qilinadi.
3. `id` larni kod beradi (model ularni bo'sh qoldiradi):
   `ch<n>-i<n>` (g'oya), `ch<n>-q<n>` (savol), `ch<n>-a<n>` (senariy).
   Savolning `chapter` maydoni ham kod tomonidan o'rnatiladi.

Sxema **dasturiy validatsiya** emas, balki prompt ichidagi ko'rsatma sifatida
ishlaydi (kodda `ajv` kabi sxema tekshirgich yo'q): asosiy nazorat — JSON
ajratib olish va kerak bo'lganda bitta retry.

Provayderlar (`gemini`, `openai`, `ollama`) bitta `complete(cfg, system,
user)` interfeysi orqali chaqiriladi; qoidalar aynan `system` xabariga,
bob matni esa `user` xabariga joylashadi.

## Ishlash tartibi (pipeline ichida)

```
Bob matni (chunk)
   │
   ├─→ system: agent-rules/analyst.md + schemas/analyst.json
   │   user:   BOB <n>: <sarlavha> + bob matni
   │   resp:   JSON → extractJSON → g'oyalar + terminlar
   │
   ├─→ system: agent-rules/quiz-master.md + schemas/quiz.json + g'oyalar
   │   resp:   JSON → savollar (concepts = g'oya id lari)
   │
   └─→ system: agent-rules/life-mentor.md + schemas/life-mentor.json + g'oyalar
       resp:   JSON → senariylar (ideaId = g'oya id si)

Natija → book.analysis (AppStore) + rulesVersion: 'rules-2026-10-31'
       → quiz savollari uchun spaced repetition jadvali (newReview)
```

Bosqichlar `onPhase` orqali UI ga uzatiladi (`analyst` → `quiz` → `life`);
ekranda mos ravishda «G'oyalar va terminlar», «Quiz savollari»,
«Hayotdagi vaziyatlar» ko'rsatiladi.

**Xato boshqaruvi:**

1. JSON noto'g'ri → system promptga izoh qo'shib **1 marta** retry.
2. Baribir xato → tugallangan boblar saqlanadi, kitob holati `partial`;
   foydalanuvchiga tushunarli xabar va «Qayta urinish» tugmasi ko'rsatiladi.
3. Hammasi muvaffaqiyatli bo'lsa → holat `analyzed`, test savollari uchun
   takrorlash jadvali yaratiladi.

## Qoidalarni test qilish (Bosqich 0)

Bitta pilot kitob bobi ustida:

1. `agent-rules/` + pilot bob → AI chaqiruvi → JSON
2. Sifatni baholash: g'oyalar aniqmi? Termin soddami? Quiz ishlaydimi?
3. Qoidani tuzatish → qayta chaqirish → farqni solishtirish
4. Faqat qoniqarli bo'lganda → kodga ulash

## Foydalanuvchi o'zgartirsa nima bo'ladi?

- Qoidalar repo fayllari bo'lgani uchun ularni o'zgartirish (dev-server
  yoki qayta qurish bilan) darhol keyingi AI chaqiruvlariga ta'sir qiladi.
- Kitob sahifasidagi **«AI tahlil qilish»** tugmasi qayta tahlil qiladi;
  xato yuz berganda **«Qayta urinish»** tugmasi bilan tugallanmagan boblar
  davom ettiriladi.
- Eski tahlil `book.analysis` da saqlanadi va yangi natija bilan
  almashtiriladi (har bir saqlashda `rulesVersion` ham yoziladi).
- Foydalanuvchi o'z `rule` faylini yuklash / sozlamalarda alohida
  «AI qoidalari» paneli — **hozirda amalga oshirilmagan** (Bosqich 2 rejasi).
