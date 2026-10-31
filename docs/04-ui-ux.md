# 04 — UI/UX: sahifalar va dizayn

## Dizayn tamoyili: "Bir marta bosing → ishlaydi"

Foydalanuvchi **dasturchi emas**. Hech qanday texnik savol yo'q.
Har ekranda **bitta asosiy harakat** aniq ko'rinadi.

## Navigatsiya — chap tomonda sidebar

```
┌──────┬──────────────────────────────────────┐
│ 🏠   │                                      │
│ Bosh │         Asosiy content               │
│      │                                      │
│ 📚   │                                      │
│ Kutub│                                      │
│ xona │                                      │
│      │                                      │
│ 🔁   │                                      │
│ Tak- │                                      │
│ rorla│                                      │
│      │                                      │
│ 📊   │                                      │
│ Natija│                                     │
│ mlar │                                      │
│ ───  │                                      │
│ ⚙️   │                                      │
│ Sozl.│                                      │
└──────┴──────────────────────────────────────┘
   900px dan pastda → pastki tab bar (mobil uslub)
```

## Sahifalar ro'yxati (jami 9)

| # | Sahifa | Muhimligi | Qisqacha |
|---|--------|-----------|----------|
| 1 | Onboarding | ⭐⭐⭐ | 3 qadamli sihirbaz (1 marta) |
| 2 | Bosh sahifa | ⭐⭐⭐ | Kunlik loop: o'qish → takrorlash → qo'llash |
| 3 | Kutubxona | ⭐⭐⭐ | Drag & drop import |
| 4 | Kitob sahifasi | ⭐⭐⭐⭐⭐ | 6 tab — platformaning yuragi |
| 5 | O'qish rejimi | ⭐⭐⭐⭐ | Matn + boblar + iqtibos belgilash |
| 6 | Quiz rejimi | ⭐⭐⭐⭐ | Vaziyatli savollar + sabab |
| 7 | AI ustoz (chat) | ⭐⭐⭐ | Bosqich 2 |
| 8 | Mening natijalarim | ⭐⭐⭐ | Streak, "qo'lladim" jurnali |
| 9 | Sozlamalar | ⭐⭐ | AI, mavzu, til, eksport |

---

## 1. Onboarding — birinchi ochilganda (1 marta)

```
┌────────────────────────────────────────┐
│   👋 Xush kelibsiz!                    │
│   Kitobni o'qish emas, hayotda         │
│   qo'llashni o'rgatamiz                │
│                                        │
│   ① AI ulang    ② Shaxsiyatingiz       │
│   ③ Birinchi kitob                     │
│                                        │
│         [ Davom eting → ]              │
└────────────────────────────────────────┘
```

- **1-qadam — AI ulash** (eng muhim, 1 daqiqa):

```
┌─ AI ni ulang (1 daqiqa) ────────────────┐
│ ( ) Google Gemini — bepul, tez     ✅   │  ← tavsiya
│ ( ) OpenAI — aniqroq, to'lovli          │
│ ( ) Ollama — to'liq offline, bepul      │
│                                         │
│ Key: [••••••••••]                       │
│ [Kalitni olish bo'yicha video (2 min)]  │
└─────────────────────────────────────────┘
```
- **2-qadam** — ism + avatar (parol emas!)
- **3-qadam** — "birinchi kitobni yuklang" (demo ham bo'ladi)
- Bu sahifa qayta ko'rinmaydi (Sozlamalardan qayta ochsa bo'ladi)

## 2. 🏠 Bosh sahifa (Dashboard)

**Maqsad: "Bugun nima qilaman?" — 3 soniyada javob**

```
┌─────────────────────────────────────────────┐
│ Salom, Aziz! 👋          🔥 12 kun streak   │
│                                             │
│ ┌── Davom ettiring ──────────────────────┐  │
│ │ 📖 "Atomic Habits" — 43%  ▓▓▓▓░░      │  │
│ │ [ O'qishni davom ettir ]   ← bitta    │  │
│ └────────────────────────────────────────┘  │
│                                             │
│ 🔁 Bugungi takrorlash (5 ta)   [ Boshlash]  │
│ ✅ Bugungi qo'llash: 2 ta vaziyat           │
│                                             │
│ ┌─ Statistika ────┐  ┌─ Yo'nalish ───────┐ │
│ │ 📚 4 ta kitob   │  │ Har kuni 1 ta     │ │
│ │ ⏱ 6h o'qish     │  │ vaziyatda          │ │
│ │ 🎯 87% quiz     │  │ qo'llang deb      │ │
│ └─────────────────┘  │ eslatamiz 🫡      │ │
└──────────────────────────────────────────────┘
```

**Kunlik loop (shu uch bosqich — platformaning hayoti):**
1. 📖 O'qishni davom ettir (5-10 daqiqa)
2. 🔁 Takrorlash quizi (2 daqiqa)
3. ✅ "Bugun qo'lladim" belgilash (10 soniya)

## 3. 📚 Kutubxona

```
┌─────────────────────────────────────────────┐
│ Kutubxonam        [ + Kitob qo'shish ]      │
│ [O'qilmoqda] [Tugatilgan] [Barchasi]       │
│                                             │
│ ┌────┐  ┌────┐  ┌────┐  ┌────┐             │
│ │ 📕 │  │ 📗 │  │ 📘 │  │ ＋ │  ← drag &  │
│ │43% │  │100%│  │ 0% │  │Yuk-│    drop     │
│ └────┘  └────┘  └────┘  │lash│    zona     │
│ Atomic  Ikki  ...        └────┘             │
└─────────────────────────────────────────────┘
```

- Import: **drag & drop** yoki fayl tanlash → "Tahlil qilinmoqda..." (progress)
- **Bo'sh holat:** "Kutubxonangiz bo'sh — birinchi kitobni yuklang 👇"

## 4. 📖 Kitob sahifasi — platformaning yuragi

**6 ta tab:**

```
┌─────────────────────────────────────────────┐
│ ← Kutubxona                                │
│ 📕 Atomic Habits          ▓▓▓▓░░ 43%       │
│ [O'qish] [Xulosalar] [Terminlar] [Quiz]    │
│ [Hayotda qo'llash] [🤖 AI ustoz]           │
├─────────────────────────────────────────────┤
│ TAB O'qish     — matn + boblar + belgilash  │
│ TAB Xulosalar  — g'oya → nima uchun → qanday│
│ TAB Terminlar  — kartochkalar (bosib aylant.)│
│ TAB Quiz       — vaziyatli savollar         │
│ TAB Qo'llash   — vaziyat → harakat senariylari│
│ TAB AI ustoz   — chat (Bosqich 2)           │
└─────────────────────────────────────────────┘
```

**Xulosalar tabi namunasi:**
```
┌─────────────────────────────────────────────┐
│ 📌 4-bob: "Odatlar shakllanishi"            │
│                                             │
│ 💡 G'oya: "1% yaxshilanish — kuniga 37%     │
│           yiliga yaxshilanish"              │
│    ℹ️ Nima uchun: ...                       │
│    🌍 Qanday qo'llash: ertalab 1 daqiqa     │
│           boshlash → 90 kunlik odat         │
│    ✅ Men qo'lladim                         │
└─────────────────────────────────────────────┘
```

## 5. 🎯 Quiz rejimi (to'liq ekran)

```
┌─────────────────────────────────────────────┐
│  Takrorlash 3/5              Progress ●●○○○ │
│                                             │
│  📍 Vaziyat:                                │
│  "Siz do'stingizga va'da berdingiz,         │
│   lekin bajarolmadingiz..."                 │
│                                             │
│  Qanday javob berish yaxshi?                │
│  ( ) "Kechirasiz, band edim"               │
│  (✓) "Va'dani bajara olmadim, kechirasiz   │
│       — keyin qayta kelishib olamiz"  ✅    │
│  ( ) "Siz ham doim va'dani buzasaniz"      │
│                                             │
│  ✅ To'g'ri! Sabab: ...                     │
│          [ Keyingi → ]                      │
└─────────────────────────────────────────────┘
```

- **Natija ekrani:** ball, zaif mavzular → "shu bobni takrorla" taklifi

## 6. 📊 Mening natijalarim

```
┌─────────────────────────────────────────────┐
│ 👤 Aziz          🔥 12 kun  🏅 5 badge     │
│ 📊 Haftalik faollik grafigi                 │
│ 📚 4 ta kitob (2 tugatilgan)  🎯 87% quiz  │
│                                             │
│ ✅ "Qo'lladim" jurnali:                     │
│  • Bugun: "2-minuta qoidasi" — ofisda       │
│  • Kecha: "I gapirish" — oilada             │
│                                             │
│ [ Ma'lumotlarni eksport qilish ]            │
└─────────────────────────────────────────────┘
```

> **"Qo'lladim jurnali" — eng g'alaba qozonadigan feature:**
> foydalanuvchi ko'radi: "men 30 ta qoidani hayotda qo'llabman".

## 7. ⚙️ Sozlamalar

```
┌─────────────────────────────────────────────┐
│ 🤖 AI:  ( ) Gemini  ( ) OpenAI  ( ) Ollama │
│         Key: [••••••]  [Ulangan ✅]         │
│ 🌙 Mavzu: Tungi / Kunduzi                   │
│ 🌐 Til: O'zbek (default) / English / Русский│
│ 🔔 Takrorlash vaqti: 20:00                  │
│ 📦 Ma'lumotlar: [Eksport] [Import] [Tozalash]│
│ ℹ️ Versiya · GitHub · Litsenziya            │
└─────────────────────────────────────────────┘
```

---

## Dizayn printsiplari

1. **Minimal + toza** — kam rang, ko'p havo (Notion uslubi)
2. **Bitta asosiy harakat** har ekranda — bitta rangli tugma
3. **Gamifikasiya o'lchovli** — streak 🔥, ballar, lekin Duolingo kabi g'ovur emas
4. **Tungi rejim majburiy** — kitob o'quvchilari kechqurun o'qiydi
5. **O'zbek tilida to'liq** — interfeys, AI javoblari ham
6. **Bo'sh holatlar ham chiroyli** — empty state har doim keyingi qadamni ko'rsatadi
7. **Progress har doim ko'rinadi** — % yoki bob raqami (motivatsiya)

## Ranglar (taxminiy, keyin aniqlashtiramiz)

```
Asosiy:    indigo/ko'k (#4F46E5) — ishonch, bilim
Aksent:    yashil (#10B981) — muvaffaqiyat, "to'g'ri javob"
Ogohlant.: sariq/orange — streak 🔥, eslatma
Xato:      qizil (#EF4444) — "noto'g'ri javob"
Tungi:     #0F172A fon, #1E293B kartochkalar
```

## Skeleton ekranlar (loading)

- Tahlil vaqtida: **bob bob progress** ("4/12 bob tahlil qilindi...")
  — foydalanuvchi kutayotganini ko'radi, zerikmaydi
- Skeleton shimmer — har bir yuklanish ekrani uchun
