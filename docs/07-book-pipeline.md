# 07 — Book Pipeline: PDF/EPUB → Markdown

## Nega Markdown?

- ✅ LLM'lar Markdown'ni **eng yaxshi tushunadi** (senlararli tuzilma aniq)
- ✅ O'qish rejimida chiroyli render (headings, listlar, iqtiboslar)
- ✅ Boblarga ajratish oson (`#`/`##` sarlavhalar bo'yicha)
- ✅ O'zgartirish, diff, versiyalash — hamma narsa matn

## Umumiy oqim

```
Foydalanuvchi fayl tanlaydi (drag & drop)
   │
   ├─ .epub  → epub parser → HTML → turndown → Markdown    ✅ sifat yuqori
   ├─ .pdf   (matnga asoslangan) → pdf-parse → Markdown    ⚠️ jadvallar buzilishi mumkin
   └─ .pdf   (skan/rasm) → OCR kerakli fayl (PDF@200 DPI) → ⚠️ xato ko'p
   │
   ▼
library/<kitob-slug>/
├── content.md      ← to'liq matn, boblar # bilan ajratilgan
├── meta.json       ← title, author, chapters...
└── analysis/       ← AI tahlili (ideas, quizzes, apply)
   │
   ▼
Boblarga bo'lish (chunking) → har bob AI'ga → analysis/ → tayyor
```

## 1. EPUB (afzal qilinadi)

- Kutubxona: `epub.js` (JS) yoki `ebooklib` (Python)
- Ichidagi HTML → **turndown** bilan Markdown'ga
- Sarlavhalar (`<h1>-<h6>`) → `#` headinglar (bu bob bo'lish uchun muhim)
- Suratlar: lokal papkaga nusxalash, Markdown'da yo'l ko'rsatish
- Metadata (title/author) → `meta.json`

**Kutilgan sifat:** yuqori — EPUB allaqachon toza strukturali.

## 2. PDF — matnga asoslangan

- Kutubxona: `pdf-parse` (Node) yoki `pymupdf` (Python)
- Har sahifa matni → bloklar → Markdown
- ⚠️ **Mumkin muammolar:**
  - Ikkita ustunli sahifalar tartibi buzilishi
  - Jadvallar matnga aylanadi (o'qish mumkin, lekin buzilgan)
  - Sarlavhalar formati yo'qoladi → `##` ni AI yoki heuristic bilan tiklash
  - Sahifa raqamlari, header/footer chiqindisi → filtrlash

**Mitigatsiya:**
1. Konvertatsiyadan keyin **preview**: foydalanuvchi birinchi bobni ko'radi
2. Shikast fayl uchun: "Bu PDF murakkab — EPUB bo'lsa, sifat yaxshiroq bo'ladi"
3. Boblarni aniqlay olmasak — foydalanuvchi qo'lda sarlavha qo'shadi
   (yoki "Faqat 1 bob" rejimida qo'lda bo'lish)

## 3. PDF — skan (rasm) ⚠️ eng xavfli

- Matn yo'q → **OCR** kerak (Tesseract yoki AI vision API)
- O'zbek lotin/krill, murakkab shriftlarda xato ko'p bo'ladi
- **Boshlanishdagi qaror:** OCR ni **Bosqich 0'ga kiritmaymiz** —
  skan PDF'ga foydalanuvchiga aniq ogohlantirish:
  > "Bu faylda matn topilmadi (skanlangan bo'lishi mumkin).
  > Matnli PDF yoki EPUB ishlating."

## 4. Markdown konvertatsiya qoidalari

```markdown
# 1-bob: Sarlavha          ← har bob H1 yoki H2 bo'yicha

Matn paragraflari...

> Iqtibos (asosiy gaplar shu yerda)

- Ro'yxatlar

**Termin** — qisqa izoh
```

- Bob hoshiyalari: `# ` (H1) **yoki** `## ` (H2) — pilot kitobda qaysi biri
  mos kelishini sinab aniqlaymiz
- Unicode saqlanadi (o'zbekcha lotin, krill — o'zgarmaydi)
- Referenslar/sahifa raqamlari → oxirida yig'ib chiqish yoki o'chirish

## 5. Chunking (AI tahlili uchun)

```
content.md
   │
   ├─ Sarlavhalar bo'yicha boblarga bo'lish
   ├─ Agar bob juda uzun (> ~30-50k token) → paragraf chegarasida qayta bo'lish
   ├─ Agar bob juda qisqa → qo'shni bob bilan birlashtirish
   │
   ▼  Har bir chunk alohida AI chaqiruvi (agent rules bilan)
```

**Nega chunking:**
- Arzonroq (kam token)
- Aniqroq (model qisqa matnga yaxshiroq javob beradi)
- Progress ko'rinadi: "4/12 bob tahlil qilindi..."
- Xato bo'lsa — faqat bitta bobni qayta ishlash

## 6. Xato boshqaruvi

| Muammo | Yechim |
|--------|--------|
| PDF matni buzilgan (tartib) | Preview + qo'lda bob qo'shish imkoniyati |
| Bob ajratib bo'lmadi | "Faqat 1 bob" rejimi yoki qo'lda bo'lish |
| AI JSON qaytarmadi | 1 retry → `partial` holat, "Qayta urinish" tugmasi |
| Kimyo/fizika simvollari tushunilmadi | Maxsus qoida: "simvollarni saqla" (agent rules'ga qo'shish) |
| Skan PDF | Ogohlantirish (Bosqich 0'da OCR ko'rib chiqilmaydi) |

## 7. Qonuniy nuansa (mualliflik)

- ⚠️ `content.md` — **faqat lokal** saqlanadi, repo'ga, serverga yuborilmaydi
- ✅ Repo/serverda faqat: `meta.json` + `analysis/` (bizning transformatsiya
  qilingan tahlilimiz) — bu ochiq saqlash uchun xavfsiz
- ✅ AI'ga yuborilgan matn: faqat hozirgi bob (chunk), cheklangan hajm
- 📝 README'da izoh: "Kitob matni foydalanuvchining qurilmasida qoladi"

## 8. Bosqich 0'da sinash kerak bo'lgan fayllar

1. ✅ Yaxshi matnga asoslangan PDF (100+ sahifa)
2. ✅ EPUB (boshqa tilda ham, o'zbekchada ham)
3. ⚠️ Ikki ustunli PDF
4. ❌ Skan PDF → ogohlantirish ekrani qanday ko'rinadi?

**Natija:** har biri uchun `content.md` namunasi + sifat bahosi (1-5).
Faqat qoniqarli natija bilan Bosqich 1'ga o'tamiz.
