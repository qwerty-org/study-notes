# 06 — Data Formats: JSON formatlar

Barcha AI javoblari va saqlash formatlari shu hujjatda aniqlanadi.
**Bosqich 0'da 1 pilot kitobda qo'lda shu formatlarga moslab sinash kerak.**

---

## 1. Kitob metadata — `meta.json`

```json
{
  "slug": "atomic-habits",
  "title": "Atomic Habits",
  "author": "James Clear",
  "language": "en",
  "sourceFormat": "epub",
  "chapters": 20,
  "status": "analyzed",
  "analysisVersion": 1,
  "rulesVersion": "2026-10-31",
  "addedAt": "2026-10-31T10:00:00Z"
}
```

> ⚠️ `content.md` (to'liq matn) faqat foydalanuvchida — repo'ga KIRMAYDI.

---

## 2. Tahlilchi javobi — `analysis/ideas.json`

`agent-rules/analyst.md` → `schemas/analyst.json`

```json
{
  "book": "atomic-habits",
  "chapters": [
    {
      "index": 4,
      "title": "Odatlar shakllanishi",
      "keyIdeas": [
        {
          "id": "ch4-i1",
          "idea": "Kichik o'zgarishlar yig'indisi katta natija beradi (1% qoidasi).",
          "why": "Inson odatlar tizimi kuchli, shuning uchun katta sakrash emas, mustahkam takrorlash ta'sir qiladi.",
          "howToApply": "Har kuni bitta 1 daqiqali harakatni tanlang va 90 kun davom ettiring.",
          "applyTags": ["ish", "shaxsiy-rtivoj"]
        }
      ],
      "terms": [
        {
          "term": "Odat tsikli",
          "definitionSimple": "Rag'bat → xatti-harakat → mukofot halqasi. Har bir odat shu to'rt bosqichdan o'tadi.",
          "metaphor": "Komp'yuterda skript yurgandek — avtomatik ishga tushish."
        }
      ]
    }
  ]
}
```

---

## 3. Quiz — `analysis/quizzes.json`

`agent-rules/quiz-master.md` → `schemas/quiz.json`

```json
{
  "book": "atomic-habits",
  "items": [
    {
      "id": "ch4-q1",
      "chapter": 4,
      "type": "scenario",
      "question": "Siz yangi odatni boshladingiz — 3-kun to'satdan unutdingiz. Eng yaxshi harakat qaysi?",
      "options": [
        { "key": "A", "text": "Odatni bekor qilaman — demak, men uchun emas" },
        { "key": "B", "text": "Ertaga qaytib, boshidan boshlayman va signalni kuchliroq qilaman" },
        { "key": "C", "text": "Keyingi haftagacha kutaman, keyin qaytaman" },
        { "key": "D", "text": "Bir kunda 2 barobar bajarib, kechikishni qoplayman" }
      ],
      "answer": "B",
      "explain": {
        "correct": "Bir martalik tushish odatni buzmaydi — muhim to'xtash emas, qaytish. Signalni (eslatma) kuchliroq qilish sababni yo'qotadi.",
        "wrong": {
          "A": "Bir marta tushish — odatning o'limi emas, qayta boshlash imkoniyati.",
          "C": "Kutish odatni yanada susaytiradi — qayta qo'shish qiyinlashadi.",
          "D": "Ortiqcha yuk motivatsiyani buzadi va charchatadi."
        }
      },
      "difficulty": "easy",
      "concepts": ["ch4-i1"]
    },
    {
      "id": "ch4-q2",
      "chapter": 4,
      "type": "theory",
      "question": "1% qoidasi nima haqida?",
      "options": [ "...4 ta variant..." ],
      "answer": "C",
      "explain": { "correct": "...", "wrong": { "...": "..." } },
      "difficulty": "easy",
      "concepts": ["ch4-i1"]
    }
  ]
}
```

---

## 4. Hayotda qo'llash — `analysis/apply.json`

`agent-rules/life-mentor.md` → `schemas/life-mentor.json`

```json
{
  "book": "atomic-habits",
  "scenarios": [
    {
      "id": "ch4-a1",
      "ideaId": "ch4-i1",
      "situation": "Rahbar sizdan tez vazifa so'radi. Siz bir zumda 'ha' dedingiz, keyin kechqurun bajarolmadingiz.",
      "rightAction": "Ish boshlashdan oldin: 'Bajarishga vaqtimni tekshirib, 15 daqiqadan keyin javob beraman' — deyish.",
      "wrongAction": "Darhol 'ha' deyib, keyin vazifani tashlab qo'yish.",
      "whyWrong": "Tez rozilik — kelajakdagi ishonchni yemiradi. Kechikish emas, vadasizlik muammo.",
      "context": "ish"
    }
  ]
}
```

---

## 5. Spaced repetition jadvali — SQLite (FSRS)

Kitob tahlil tugagach **har bir g'oya/quiz uchun** takrorlash jadvali:

```json
{
  "reviewId": "ch4-q1",
  "type": "quiz",
  "dueDate": "2026-11-01",
  "interval": 1,
  "ease": 2.5,
  "reps": 0,
  "lapses": 0,
  "state": "new"
}
```

**Standart jadval (boslang'ich):**

| Takror | Interval |
|--------|----------|
| 1-chi | 1 kun |
| 2-chi | 3 kun |
| 3-chi | 7 kun |
| 4-chi | 14 kun |
| 5-chi | 30 kun |

> Keyin FSRS algoritmi javob sifatiga qarab intervalni o'zgartiradi
> (to'g'ri/tez → uzaytirish, noto'g'ri/qiyin → qisqartirish).

---

## 6. "Men qo'lladim" jurnali — `apply_log`

```json
{
  "id": "log-2026-10-31-1",
  "ideaId": "ch4-i1",
  "date": "2026-11-01",
  "note": "Ertalab 5 daqiqa kitob o'qish odatini boshladim",
  "context": "uy"
}
```

---

## 7. Foydalanuvchi profili va progress (SQLite, `data.db`)

```json
{
  "profile": {
    "name": "Aziz",
    "avatar": "🦊",
    "streak": 12,
    "lastActive": "2026-11-01",
    "language": "uz",
    "theme": "dark"
  },
  "aiConfig": {
    "provider": "gemini",
    "apiKeyEncrypted": "••••••",
    "model": "gemini-2.0-flash"
  },
  "bookProgress": {
    "book": "atomic-habits",
    "percent": 43,
    "currentChapter": 8,
    "quizAvg": 87
  }
}
```

---

## 8. Umumiy qoidalar

| Qoida | Tushuntirish |
|-------|--------------|
| `id` doimiy | `ch4-i1` = bob 4, g'oya 1 — qayta tahlilda ham saqlanadi |
| `applyTags` | "qo'llash jurnali" va statistika uchun kontekst filtri |
| `concepts` | Quiz → g'oya bog'lanishi: zaif javob = g'oyani qayta o'qish |
| `rulesVersion` | Qoida o'zgarsa — tahlil qayta hisoblanishi mumkin |
| JSON Schema | Har bir format uchun `schemas/*.json` — AI javobi shu yerda validatsiya qilinadi |
| Til | AI javoblari o'zbekcha (foydalanuvchi tilida), `sourceFormat` asl matn tili |

## Validatsiya qoidalari

1. AI JSON qaytarishi **shart** — boshqa matn qabul qilinmaydi
2. JSON parse xatosi → 1 retry (xato bilan qayta so'raladi)
3. Sxemaga mos kelmasa (masalan `answer` "A-D" emas) → tuzatish yoki `partial`
4. Majburiy maydonlar yo'q bo'lsa → bob `partial` holatda saqlanadi
