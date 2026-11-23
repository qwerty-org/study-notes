# 04 — UI/UX: sahifalar va dizayn

> **Hujjat maqomi:** Ushbu hujjat Study Notes desktop ilovasining UI/UX bo'yicha
> asosiy ma'lumotnomasidir. "Amalga oshirilgan holat", "Dizayn tizimi",
> "Foydalanish imkoniyati" va "Responsive" bo'limlari joriy kod
 (`apps/desktop/src`) asosida tekshirilgan. ASCII chizmalar esa **tarixiy
 kontsept** bo'lib, ular faqat dizayn niyatini ko'rsatadi; amaldagi ko'rinish
 yuqoridagi tekshirilgan bo'limlarda tavsiflangan.

---

## 1. Dizayn tamoyili: "Bir marta bosing → ishlaydi"

Foydalanuvchi **dasturchi emas**. Hech qanday texnik savol yo'q.
Har ekranda **bitta asosiy harakat** aniq ko'rinadi.

Ilova mahalliy (lokal) ishlaydi: server va hisob talab qilinmaydi, ma'lumotlar
shu kompyuterda saqlanadi. Bu interfeysdagi "Ma'lumotlar faqat lokal" kabi
ishora va yozuvlarda aks etgan.

## 2. Navigatsiya — yuqori panel (2026-11, amalda)

> **Eslatma:** Quyidagi chap sidebar chizmasi **tarixiy** maqsadlarda qoldirildi.
> Amalda **yuqori panel** (`Layout.tsx` ichidagi `.topbar > nav.topnav`)
> qo'llaniladi: `Bosh sahifa · Kutubxona · Takrorlash · Natijalarim · Sozlamalar`.
> `/kitob/:slug` uchun **Kutubxona**, `/sozlamalar` uchun **Sozlamalar** faol
> ko'rinadi (`aria-current="page"` ham shunga qarab qo'yiladi).
> Deraza tugmalari (kichraytirish/kattalashtirish/yopish) faqat desktop
> qobig'ida faol; preview'da `disabled`.

Faol navigatsiya elementi `Layout.tsx` dagi `isActive()` orqali aniqlanadi:
`/kitob/:slug` ham `/kutubxona` ga tegishli hisoblanadi.

### Arxiv (tarixiy): dastlabki sidebar taklifi

> ⚠️ **Faqat tarixiy ma'lumot uchun.** Hozirgi amalga oshirishda sidebar yo'q.

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

## 3. Sahifalar ro'yxati (konseptual jami 9)

> Quyidagi jadval **konseptual ekranlar** ro'yxati. Amaldagi `HashRouter`
> marshrutlari soni 7 ta (pastga qarang); "O'qish", "Quiz", "AI ustoz" kabi
> rejimlar alohida marshrut emas, balki kitob sahifasidagi tab/fullscreen
> holatlardir.

| # | Sahifa | Muhimligi | Qisqacha |
|---|--------|-----------|----------|
| 1 | Onboarding | ⭐⭐⭐ | 3 qadamli sihirbaz (1 marta) |
| 2 | Bosh sahifa | ⭐⭐⭐ | Kunlik loop: o'qish → takrorlash → qo'llash |
| 3 | Kutubxona | ⭐⭐⭐ | Drag & drop import |
| 4 | Kitob sahifasi | ⭐⭐⭐⭐⭐ | 6 tab — platformaning yuragi |
| 5 | O'qish rejimi | ⭐⭐⭐⭐ | Matn + boblar + iqtibos belgilash |
| 6 | Quiz rejimi | ⭐⭐⭐⭐ | Vaziyatli savollar + sabab |
| 7 | AI ustoz (chat) | ⭐⭐⭐ | Bosqich 2 — hali yo'q |
| 8 | Mening natijalarim | ⭐⭐⭐ | Streak, "qo'lladim" jurnali |
| 9 | Sozlamalar | ⭐⭐ | AI, mavzu, til, eksport |

### Amalda mavjud marshrutlar (`App.tsx`, tekshirilgan)

| Marshrut | Komponent | Navigatsiyadagi nomi |
|----------|-----------|----------------------|
| `/onboarding` | `pages/Onboarding` | "Boshlang'ich sozlash" |
| `/` | `pages/Dashboard` | "Bosh sahifa" |
| `/kutubxona` | `pages/Library` | "Kutubxona" |
| `/kitob/:slug` | `pages/Book` | "Kitob" |
| `/takrorlash` | `pages/Repeat` | "Takrorlash" |
| `/natijalar` | `pages/Stats` | "Natijalarim" |
| `/sozlamalar` | `pages/Settings` | "Sozlamalar" |

Birinchi ishga tushirishda `Gate` komponenti `onboarding.done === false`
bo'lsa `/onboarding` ga yo'naltiradi. Noma'lum marshrut `/` ga qaytariladi.

---

## 4. Tarixiy kontsept chizmalar (1–7-bo'limlar)

> ⚠️ **QUYIDAGI BARCHA ASCII CHIZMALAR TARIXIY KONTSEPTDIR.** Ular dastlabki
> dizayn niyatini saqlab qolish uchun qoldirilgan. Amaldagi ko'rinish, tugma
> nomlari va tuzilma uchun **"Amalga oshirilgan holat"** bo'limiga murojaat
> qiling. Chizmalardagi ayrim elementlar (masalan, "AI ustoz" chati,
> til tanlagich, eslatma vaqti) hali amalga oshirilmagan —
> **"Qolgan bo'shliqlar"** bo'limiga qarang.

### 4.1. Onboarding — birinchi ochilganda (kontsept)

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

### 4.2. Bosh sahifa / Dashboard (kontsept)

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

### 4.3. Kutubxona (kontsept)

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

### 4.4. Kitob sahifasi — platformaning yuragi (kontsept)

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

### 4.5. Quiz rejimi (kontsept)

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

### 4.6. Mening natijalarim (kontsept)

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

### 4.7. Sozlamalar (kontsept)

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

## 5. Dizayn printsiplari

1. **Minimal + toza** — kam rang, ko'p havo (editorial uslub)
2. **Bitta asosiy harakat** har ekranda — bitta rangli tugma
3. **Gamifikatsiya o'lchovli** — streak 🔥, ballar; Duolingo kabi g'ovur emas
4. **Tungi rejim majburiy** — kitob o'quvchilari kechqurun o'qiydi
5. **O'zbek tilida to'liq** — interfeys, AI javoblari ham (konsept; amalda faqat O'zbek)
6. **Bo'sh holatlar ham chiroyli** — empty state har doim keyingi qadamni ko'rsatadi
7. **Progress har doim ko'rinadi** — % yoki bob raqami (motivatsiya)

---

## 6. Dizayn tizimi: yakuniy token qiymatlari (tekshirilgan, 2026-11)

Tokenlar ikki qatlamda aniqlanadi:
`apps/desktop/src/styles/theme.css` (asosiy palette, tipografiya, mavzular) va
`apps/desktop/src/styles/nx/foundation.css` (`nx-*` prefiksli yangi bo'limlar
uchun qo'shimcha tokenlar). `nx` tokenlari ko'p hollarda asosiy tokenlarga
`var()` orqali bog'langan, shuning uchun mavzu almashganda barcha bo'limlar
bir vaqtda yangilanadi.

### 6.1. `theme.css` — yorug' mavzu (`:root`)

| Guruh | Token | Qiymat |
|-------|-------|--------|
| Fon | `--bg` | `#f5f2ea` |
| | `--card` | `#fffdf8` |
| | `--sidebar` | `#fbf8f1` |
| | `--elevated` | `#eee9dc` |
| | `--seg-active` | `#fffdf8` |
| | `--input-bg` | `#fffdf8` |
| Chiziq | `--border` | `#e2dccd` |
| | `--border-strong` | `#cdc4b1` |
| Matn | `--text` | `#26231e` |
| | `--muted` | `#6b6457` |
| | `--faint` | `#746d62` |
| Asosiy | `--primary` | `#a94f2a` |
| | `--primary-hover` | `#9c4623` |
| | `--primary-dark` | `#82391d` |
| | `--primary-soft` | `rgba(169, 79, 42, 0.11)` |
| Ikkilamchi | `--blue` | `#3d6d61` |
| | `--blue-dark` | `#2f554b` |
| | `--blue-soft` | `rgba(61, 109, 97, 0.12)` |
| Ogohlantirish | `--yellow` | `#ba842c` |
| | `--yellow-dark` | `#956a21` |
| | `--yellow-soft` | `rgba(186, 132, 44, 0.16)` |
| Xato | `--red` | `#b5473d` |
| | `--red-dark` | `#96382f` |
| | `--red-soft` | `rgba(181, 71, 61, 0.12)` |
| Muvaffaqiyat | `--green` | `#4c7b5b` |
| | `--green-soft` | `rgba(76, 123, 91, 0.14)` |
| Binafsha | `--purple` | `#8b6f9e` |
| | `--purple-dark` | `#735683` |
| | `--purple-soft` | `rgba(139, 111, 158, 0.14)` |

> **Kontrast uchun muhim:** `--primary` dastlab `#b4542d` edi, lekin fon va
> `elevated` ustida 4.5:1 (WCAG AA) ga yetmaganligi sababli **minimal
> quyuqlashtirilib `#a94f2a` ga o'zgartirilgan** (kod ichidagi izoh ham shuni
> qayd etadi). Hujjatlarning eski versiyalaridagi `#B4542D` qiymati
> eskirgan — yakuniy qiymat `#a94f2a`.

**Alias va yordamchi tokenlar:**

| Token | Qiymat |
|-------|--------|
| `--accent` | `var(--primary)` |
| `--amber` / `--amber-soft` | `var(--yellow)` / `var(--yellow-soft)` |
| `--ring-track` | `var(--elevated)` |
| `--btn2-face` | `#ece6d8` |
| `--btn2-shadow` | `#d8d0bd` |
| `--btn2-text` | `#494334` |

### 6.2. `theme.css` — tungi mavzu (`[data-theme='dark']`)

Mavzu `profile.theme === 'dark'` bo'lganda `<html>` (yoki ildiz element) da
`data-theme="dark"` o'rnatiladi.

| Guruh | Token | Qiymat |
|-------|-------|--------|
| Fon | `--bg` | `#16140f` |
| | `--card` | `#201d17` |
| | `--sidebar` | `#1c1914` |
| | `--elevated` | `#2a261e` |
| | `--seg-active` | `#302b22` |
| | `--input-bg` | `#1c1914` |
| Chiziq | `--border` | `#373127` |
| | `--border-strong` | `#4a4235` |
| Matn | `--text` | `#f3ecdd` |
| | `--muted` | `#a99f8c` |
| | `--faint` | `#8b8476` |
| Asosiy | `--primary` | `#e08b5c` |
| | `--primary-hover` | `#eb9c70` |
| | `--primary-dark` | `#f0b08a` |
| | `--primary-soft` | `rgba(224, 139, 92, 0.14)` |
| Ikkilamchi | `--blue` | `#7fb0a2` |
| | `--blue-dark` | `#9bc7bb` |
| | `--blue-soft` | `rgba(127, 176, 162, 0.14)` |
| Ogohlantirish | `--yellow` | `#d9a94f` |
| | `--yellow-dark` | `#ecc271` |
| Xato | `--red` | `#e07b6f` |
| | `--red-dark` | `#ef9a90` |
| Muvaffaqiyat | `--green` | `#86b592` |
| | `--green-soft` | `rgba(134, 181, 146, 0.14)` |
| Tugma | `--btn2-face` | `#2c2720` |
| | `--btn2-shadow` | `#17140f` |
| | `--btn2-text` | `#e8dfcd` |

> Tungi mavzuda `--yellow-soft`, `--red-soft` va `--purple` kabi tokenlar
> qayta aniqlanmagan — ular yorug' mavzudagi qiymatni meros qilib oladi.
> Asosiy tugmada esa matn rangi `#20160f` qilib belgilanadi
> (`[data-theme='dark'] .nx-btn--primary`), bu och terrakota fonda kontrastni
> ta'minlaydi.

### 6.3. `theme.css` — soyalar, radiuslar, o'lchamlar, shriftlar

| Token | Yorug' | Tungi |
|-------|--------|-------|
| `--shadow-card` | `0 1px 2px rgba(58,46,28,.05), 0 10px 30px rgba(58,46,28,.035)` | `0 1px 2px rgba(0,0,0,.3)` |
| `--shadow-pop` | `0 20px 56px rgba(40,30,16,.18)` | `0 20px 60px rgba(0,0,0,.55)` |
| `--shadow-seg` | `0 1px 3px rgba(58,46,28,.12)` | `0 1px 3px rgba(0,0,0,.35)` |

| Token | Qiymat | Izoh |
|-------|--------|------|
| `--r-sm` | `8px` | Kichik radius |
| `--r` | `12px` | Asosiy radius |
| `--r-lg` | `18px` | Katta radius |
| `--r-pill` | `999px` | Pill shakl |
| `--nx-r-pill` | `var(--r-pill)` | `nx-chip` uchun yagona pill shkalasi |
| `--topbar-h` | `64px` | Yuqori panel balandligi |
| `--content-max` | `none` | Sahifalar to'liq kenglikda; faqat o'qish matni ~72ch bilan cheklanadi |
| `--font` | `'Manrope Variable', 'Segoe UI', system-ui, sans-serif` | UI matni |
| `--font-display` | `'Fraunces Variable', Georgia, 'Times New Roman', serif` | Sarlavha, kitob matni, raqamlar |
| `--paper-grain` | SVG `feTurbulence` data-URI | Qog'oz donadorligi (past kontrastli tekstura) |

Asosiy matn o'lchami `body { font-size: 14.5px; line-height: 1.6 }`.
`.main` fonida `radial-gradient` (asosiy rang 6%) + `--paper-grain`
(`background-blend-mode: normal, soft-light`) qo'llaniladi.

### 6.4. `nx/foundation.css` — qo'shimcha tokenlar

| Token | Yorug' | Tungi | Izoh |
|-------|--------|-------|------|
| `--nx-success` | `#4c7b5b` | `#86b592` | Muvaffaqiyat |
| `--nx-success-soft` | `rgba(76,123,91,.13)` | `rgba(134,181,146,.15)` | |
| `--nx-warn` | `#ba842c` | `#d9a94f` | Ogohlantirish |
| `--nx-warn-soft` | `rgba(186,132,44,.14)` | `rgba(217,169,79,.15)` | |
| `--nx-ink` | `var(--text)` | — | Asosiy matn |
| `--nx-line` | `var(--border)` | — | Chiziq |
| `--nx-muted` | `var(--muted)` | — | Ikkinchi darajali matn |
| `--nx-surface` | `var(--card)` | — | Karta yuzi |
| `--nx-surface-2` | `var(--elevated)` | — | Ko'tarilgan yuzi |
| `--nx-accent` | `var(--primary)` | — | Asosiy rang |
| `--nx-accent-soft` | `var(--primary-soft)` | — | Yumshoq asosiy rang |
| `--nx-r` | `14px` | — | Karta radiusi |
| `--nx-r-sm` | `9px` | — | Kichik radius |
| `--nx-r-lg` | `20px` | — | Panel radiusi |
| `--nx-r-pill` | `var(--r-pill, 999px)` | — | Chip radiusi |

Soyalar: `--nx-shadow` (yorug' `0 1px 2px rgba(48,38,22,.04), 0 12px 32px
rgba(48,38,22,.045)`; tungi `0 1px 2px rgba(0,0,0,.25), 0 14px 34px
rgba(0,0,0,.2)`), `--nx-shadow-lg` = `0 24px 64px rgba(32,24,12,.18)`.

---

## 7. Foydalanish imkoniyati (Accessibility / a11y) standarti

Amalga oshirilgan yechimlar **WCAG 2.1 AA** yo'nalishiga asoslangan. Quyida
kodda tasdiqlangan talablar keltirilgan.

### 7.1. Klaviatura

| Element | Xatti-harakat |
|---------|---------------|
| Skip link | `Layout.tsx` dagi "Asosiy mazmunga o'ting" havolasi `#main-content` ga o'tadi; fokuslanganda ko'rinadi (`top: 8px`) |
| Marshrut o'zgarishi | `RouteEffects` fokusni `main h1/h2` ga o'tkazadi (`tabindex="-1"`, `focus({ preventScroll: true })`); dastlabki yuklashda fokus o'g'irlanmaydi |
| Profil menyusi | `Escape` yopadi va fokusni avatar tugmasiga qaytaradi; `Tab`/`Shift+Tab` menyu ichida qamaladi; ochilganda birinchi band fokuslanadi |
| Tasdiqlash modali (`ConfirmModal`) | `Tab` fokusni dialog ichida ushlab turadi, `Escape` yopadi, yopilganda fokus ochgan tugmaga qaytadi; xavfsiz harakat ("Bekor qilish") avtomatik fokuslanadi, xavfli tugma emas |
| Kitob tablari | `ArrowLeft` / `ArrowRight` / `Home` / `End` — faol tablar bo'ylab harakat; roving `tabIndex` (faqat tanlangan tab `0`) |
| Quiz | `1–4` — javob tanlash, `Enter`/`Bo'sh joy` — keyingi savol, `Escape` — chiqish. Fokus qamalmaydi (`Tab` va modifier tugmalariga aralashmaydi); javob ochilganda "Keyingi" ga, yangi savolda birinchi variantga qaytadi |
| Dropzone / karta elementlari | `role="button"` + `tabIndex={0}` + `Enter`/`Bo'sh joy` bilan faollashtirish (Kutubxona, termin kartalari, onboarding) |
| Onboarding | Bosqich o'zgarganda sarlavhaga fokus; API kaliti maydoniga avtomatik fokus |

**Muhim:** `AI ustoz` tabi `disabled` va klaviatura navigatsiyasidan chiqarib
tashlangan (`TABS.filter((t) => !t.soon)`), shuning uchun fokus "tez orada"
belgisiga qamalib qolmaydi.

### 7.2. ARIA

- **Navigatsiya:** `<nav aria-label="Asosiy navigatsiya">`, faol havolada
  `aria-current="page"`.
- **Profil menyusi:** `aria-label`, `aria-haspopup="menu"`, `aria-controls`,
  `aria-expanded`; popup `role="menu"`, elementlar `role="menuitem"` /
  `role="menuitemradio"` + `aria-checked`.
- **Kitob tablari:** `role="tablist"` → `role="tab"` (`aria-selected`,
  `aria-controls="nx-book-panel"`), `role="tabpanel"` (`aria-labelledby`,
  `tabIndex={0}`).
- **Tanlovlar:** `role="radiogroup"` / `role="radio"` + `aria-checked`
  (Quiz javoblari, AI provayderi); `aria-pressed` — segmented/filtr tugmalari.
- **Progress:** `role="progressbar"` + `aria-valuemin` / `aria-valuemax` /
  `aria-valuenow` / `aria-valuetext` / `aria-label` (halqa, chiziqli progress,
  kitob foizi).
- **Xabarlar:** `role="status"` (muvaffaqiyat, yuklanish), `role="alert"`
  (xatolar), `aria-live="polite"` (kutubxona holati, AI ulanish fikri).
- **Dekorativ elementlar:** ikonkalar `aria-hidden="true"`, `focusable="false"`;
  ma'no anglatuvchi grafiklar `role="img"` + `aria-label`.
- **Shakllar:** `aria-invalid`, `aria-describedby`, `aria-busy`, `aria-expanded`,
  `<label htmlFor>` bilan bog'langan maydonlar.

### 7.3. Kontrast

- Asosiy rang `#b4542d` → `#a94f2a` ga quyuqlashtirilib, yorug' fon va
  `elevated` ustida **4.5:1** ko'rsatkichiga erishilgan (WCAG AA).
- Tungi mavzuda och terrakota `#e08b5c` ustidagi matn `#20160f` qilib
  belgilangan.
- `nx-chip`, `nx-stat`, `nx-btn` kabi komponentlar ranglari to'g'ridan-to'g'ri
  tema tokenlaridan olinadi, bu mavzular bo'ylab izchil kontrastni ta'minlaydi.

### 7.4. Fokus ko'rinishi (focus-visible)

- Global: `:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }`.
- `nx-*` interaktiv elementlari uchun qo'shimcha:
  `outline: 2px solid var(--nx-accent)` + `box-shadow: 0 0 0 4px var(--nx-accent-soft)`.
- `nx-input:focus-visible` — outline + chegara rangi + `0 0 0 3px` halo.
- Faqat ikonka bo'lgan modal yopish tugmasi `nx-modal__close:focus-visible`
  `outline-offset: 3px` bilan ajralib turadi.
- `@media (forced-colors: active)` da `outline-color: Highlight` qo'llaniladi —
  yuqori kontrast rejimida halqa yo'qolmaydi.

### 7.5. Harakatni kamaytirish (reduced-motion)

- `theme.css` global qoidasi: `prefers-reduced-motion: reduce` da barcha
  animatsiya/o'tishlar `0.01ms` ga qisqartiriladi, iteratsiya 1 ga tushiriladi.
- `foundation.css` `nx-*` qismlari uchun uni to'ldiradi: animatsiya va
  o'tishlar **butunlay o'chiriladi** (`animation: none !important`,
  `transition: none !important`). Bu `nx-page`, `nx-toast`, `nx-overlay`,
  `nx-modal`, `nx-progress > span`, `nx-ring .value`, shuningdek tugma/switch/
  input'targa tegishli.
- `book.css`, `library.css`, `stats.css`, `quiz.css` ham o'z reduced-motion
  bloklariga ega.
- JavaScript tomonida ham hisobga olinadi: `Book.tsx` tabga o'tishda
  `matchMedia('(prefers-reduced-motion: reduce)')` orqali `scrollIntoView`
  harakatini `smooth` yoki `auto` qilib tanlaydi.

### 7.6. forced-colors

`foundation.css` va `settings.css` da `@media (forced-colors: active)` mavjud;
fokus halqasi tizim rangiga (`Highlight`) o'zgartiriladi.

---

## 8. Responsive breakpointlar

Asosiy (NX) shkala — **900 / 620**; tor ekranlar uchun qo'shimcha himoya —
**480 / 420 / 375** (fayllar bo'yicha farqlanadi). Eski `global.css`
qatlamida 900 / 660 / 480 mavjud.

| Breakpoint | Fayl | O'zgarish |
|------------|------|-----------|
| `max-width: 900px` | `foundation.css`, `book.css`, `stats.css`, `repeat.css`, `settings.css` | `.nx-page` ichki bo'shliqlari kamayadi; 3/4 ustunli grid → 2 ustun; panel sarlavhalari qisqaradi. Shuningdek eski `.page` konteynerining padding'i bekor qilinadi |
| `max-width: 620px` | `foundation.css`, `book.css`, `onboarding.css`, `stats.css`, `repeat.css`, `settings.css` | Barcha grid → 1 ustun; `.nx-head`, `.nx-section-head`, `.nx-panel__head` vertikal joylashadi va wrap qilinadi; modal ichki bo'shlig'i qisqaradi |
| `max-width: 480px` | `global.css` (eski qatlam) | Eski Dashboard elementlari uchun qo'shimcha tor ekran moslashuvi |
| `max-width: 420px` | `foundation.css` | Gorizontal siljishning oldini oladi: `.nx-page` yon bo'shliqlari 14px; `.nx-title` `clamp(24px, 7vw, 28px)`; `.nx-empty` va modal yopish tugmasi kichraytiriladi |
| `max-width: 375px` | `settings.css` | Sozlamalar ekranida eng tor qurilmalar uchun oxirgi himoya chizig'i |

Qo'shimcha (bo'limga xos) breakpointlar: `min-width: 1024px` va `660px`
(`global.css`), `860px` (`onboarding.css`), `720px` (`library.css`), `640px`
(`quiz.css`), `1480px` / `min-width: 1700px` (`book.css`, `library.css`) —
katta ekranlarda ustunlar sonini oshirish uchun.

> **Eslatma:** 900px dan pastda "pastki tab bar" ko'rinishi **faqat tarixiy
> chizmada** mavjud — amalda navigatsiya barcha kengliklarda yuqori panelda
> qoladi.

---

## 9. Harakat (motion) printsiplari

Harakat ma'lumot berish uchun ishlatiladi, bezak uchun emas. Barcha kirish
animatsiyalari **pastga siljish + ochilish** (yakuniy holatga qarab harakat)
sxemasiga amal qiladi; tezliklar qisqa (0.16–0.6s) va sust (ease-out) tusli.

| Animatsiya | Davomiylik | Egri chiziq | Tavsif |
|------------|-----------|-------------|--------|
| `nx-page-in` (Dashboard `.page`) | `0.35s` | `cubic-bezier(0.22, 1, 0.36, 1)` | `translateY(8px)` + opacity |
| `nx-rise` (`.nx-page`) | `0.4s` | `cubic-bezier(0.22, 1, 0.36, 1)` | `translateY(10px)` + opacity |
| `nx-toast-in` | `0.25s` | `ease` | pastdan ko'tarilish |
| `nx-fade` (overlay) | `0.18s` | `ease` | ochilish |
| `nx-modal-in` | `0.24s` | `cubic-bezier(0.22, 1, 0.36, 1)` | `translateY(14px) scale(0.97)` |
| `nx-progress > span` (kenglik) | `0.5s` | `cubic-bezier(0.22, 1, 0.36, 1)` | progress to'ldirilishi |
| `nx-ring .value` (stroke) | `0.6s` | `cubic-bezier(0.22, 1, 0.36, 1)` | halqa to'ldirilishi |
| Tugma/ikonka o'tishlari | `0.16s` | `ease` | hover/fokus/chegara |
| Switch | `0.2s` | `ease` / `cubic-bezier(0.22, 1, 0.36, 1)` | tugma sur'ilishi |

Tugma bosilganda `transform: translateY(1px) scale(0.985)` bilan tezkor
"bosilganlik" hissi beriladi. Barcha harakatlar reduced-motion da o'chiriladi
(7.5-bo'lim).

## 10. Skeleton ekranlar (loading, konsept + amal)

- Tahlil vaqtida: **bob bob progress** ("4/12 bob tahlil qilindi...") —
  foydalanuvchi kutayotganini ko'radi, zerikmaydi
- Skeleton shimmer — har bir yuklanish ekrani uchun (konsept)
- Amalda: `aria-busy`, `role="status"` va `nx-progress` orqali jarayon
  ko'rsatiladi; xatolar tushunarli xabar bilan almashtirilgan

---

## 11. Amalga oshirilgan holat (2026-11, tekshirilgan)

Dashboard tuzilmasi o'zgarishsiz qoldirildi. Qolgan barcha bo'limlar yangi
"Iliq qog'oz stoli" dizayn tizimida qayta qurildi.

| Bo'lim | Amaldagi tuzilma |
|--------|------------------|
| Onboarding | 2 ustunli kirish ekrani, 3 label'li bosqich (`aria-current="step"`), AI provayderi/kaliti, ism + avatar, birinchi kitobni qo'shish |
| Kutubxona | Statistika, ko'p fayl import (drag & drop + `role="button"` dropzone), qidiruv/filtr (`aria-pressed`), panel/ro'yxat ko'rinishi |
| Kitob | Yig'ich hero, `role="tablist"` tablar, fokusli o'qish stoli (Aa shrifti, fon almashtirish, boblar, izohlar), g'oya/termin/vaziyat modullari, progress `role="progressbar"` |
| Quiz | To'liq ekranli sessiya (`nx-book-quiz`), klaviatura (1–4, Enter, Esc), sabablar va zaif mavzular tahlili |
| Takrorlash | Sessiya karti, navbat ro'yxati, interval jadvali vizualizatsiyasi, natija `role="status"` |
| Natijalar | 7 kunlik faollik grafigi, badge'lar, "qo'lladim" jurnali (birinchi o'rinda) |
| Sozlamalar | Guruhlangan ikki ustunli tuzilma (4 bo'lim), in-app tasdiqlash modali, ulanishni tekshirish, fokus qamash bilan xavfsiz o'chirish |

**Kitob tablarining amaldagi holati** (`pages/Book.tsx`):

| Tab | Holat |
|-----|-------|
| `O'qish` (`read`) | ✅ Faol |
| `Xulosalar` (`ideas`) | ✅ Faol |
| `Terminlar` (`terms`) | ✅ Faol |
| `Quiz` (`quiz`) | ✅ Faol |
| `Hayotda qo'llash` (`apply`) | ✅ Faol |
| `AI ustoz` (`tutor`) | ⛔ `soon: true` — o'chirilgan, "tez orada" belgisi |

**Amalga oshirilgan muhim xatolar tuzatildi:** UTC sana o'rniga mahalliy sana;
g'oya va vaziyat belgilarining aralashib ketishi (`kind`/`refId` bilan
ajratildi); dropzone'da klaviatura; native `confirm()` o'rniga modal; xom API
xatolari o'rniga tushunarli xabar; marshrut o'zgarishida sarlavhaga fokus
(o'tish animatsiyasi bilan sakrashning oldini olish uchun `preventScroll`).

## 12. Qolgan bo'shliqlar (Bosqich 2+, amalda yo'q)

| Element | Amaldagi holat |
|---------|----------------|
| **AI ustoz chat** | `tutor` tabi `soon: true`, `setTab()` ichida `if (k === 'tutor') return`; faqat "tez orada" belgisi |
| **PDF/EPUB konvertatsiya/import** | Yo'q; faqat mavjud tahlil/import oqimi. "Dastur haqida" bo'limida keyingi bosqich sifatida qayd etilgan |
| **i18n (til tanlagich)** | Faqat O'zbekcha; Sozlamalarda `nx-chip--outline` "O'zbek" va izoh: "Hozircha faqat o'zbekcha. Boshqa tillar keyingi bosqichda" |
| **Bildirish/eslatma vaqti** | Yo'q; "20:00 · tez orada" chiplari va "Eslatmalar keyingi bosqichda qo'shiladi" izohi |
| **FSRS** | Yo'q (takrorlash jadvali oddiy intervallarga asoslangan) |
| **Onlayn kutubxona / obuna** | Yo'q, "Dastur haqida" bo'limida kelgusi rejalar sifatida qayd etilgan |

**E'tibor talab qiladigan jihatlar:** ushbu hujjatdagi a11y talablari kod
tekshiruvi asosida yozilgan; mustaqil avtomatlashtirilgan kontrast/ARIA audit
hisoboti mavjud emas. Yangi komponentlar qo'shilganda 7-bo'limdagi standart va
6-bo'limdagi token qiymatlariga rioya qilish talab etiladi.
