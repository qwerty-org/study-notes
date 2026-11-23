# Premium Design System — Study Notes (Wave 3)

> Bu hujjat Wave 3 dagi **har bir** agent uchun yagona vizual qonun. Agentlar undan og'ishmaydi.

## Muammo (Wave 2 natijasi)

O'lchamlar gridga tushdi, lekin ko'rinish hali **premium emas**:
- kichik (10–13px) kulrang matnlar ko'p → o'qish qiyin, arzon ko'rinadi;
- har bir narsa karta ichida: border + radius + shadow → "kartalar to'lgan", ritm yo'q;
- ierarxiya zaif: sarlavha, label va yordamchi matn deyarli bir xil;
- ranglar ko'p (terracotta + amber + green + blue) → bezovta;
- bo'shliqlar "to'g'ri" lekin qattiq, nafas olmaydi;
- dark mode va mobil ekranda bu muammolar kuchayadi.

## Premium vizual yo'nalish

**Xarakter:** sokin, aniq, qimmatbaho qog'oz/editorial. Kam rang, kuchli tipografiya, keng nafas, yumshoq chuqurlik. Bitta e'tibor markazi — har ekranda bitta asosiy harakat.

**O'tmishdan saqlanadigan:** terrakota identikligi, Fraunces + Manrope, iliq qog'oz fon, o'zbek tili, dark mode.

### 1. Palitra (qat'iy)

| Token | Light | Dark | Ishlatilishi |
|-------|-------|------|--------------|
| `--pm-bg` | `#FAF8F4` | `#15130F` | sahifa foni |
| `--pm-surface` | `#FFFFFF` | `#1E1B16` | karta/panel yuzi |
| `--pm-surface-2` | `#F4F0E8` | `#27231C` | ikkilamchi yuz, track |
| `--pm-ink` | `#1F1B15` | `#F5EFE4` | asosiy matn |
| `--pm-ink-2` | `#4B4337` | `#CFC4B2` | ikkilamchi matn |
| `--pm-ink-3` | `#746A5B` | `#9E9383` | yordamchi (faqat ≥12px) |
| `--pm-line` | `#E9E3D8` | `#373127` | nozik ajratgich |
| `--pm-line-strong` | `#D8CFBE` | `#4E4638` | kuchli ajratgich |
| `--pm-accent` | `#A94F2A` | `#E69A6C` | faqat asosiy harakat + faol holat |
| `--pm-accent-soft` | `#F7EAE3` | `#3A281F` | faol fon |
| `--pm-sage` | `#4F6B5D` | `#93B5A3` | muvaffaqiyat (kam ishlatiladi) |
| `--pm-brass` | `#A88342` | `#D9B46E` | urg'u (faqat 1–2 joy) |

**Qoida:** bitta ekranda ko'pi bilan **2 ta rang** (ink + accent). Amber/green/blue faqat ma'noli holat chipida, kichik maydonda.

### 2. Tipografiya

- Display: `Fraunces Variable`, weight 600, `letter-spacing: -0.035em`.
- UI: `Manrope Variable`, weight 500–700.
- **Type scale:** `12 / 13 / 14 / 16 / 18 / 20 / 24 / 30 / 40 / 54`.
- **Asosiy matn ≥14px**, ikkilamchi ≥13px, yordamchi ≥12px. 11px faqat kbd/chip.
- Sarlavha ekranda kamida 30px ( sahifa title 40px ), kichik bo'lim sarlavhasi 18–20px.
- Chiziq uzunligi: o'qish 66ch, yordamchi matn ≤72ch.
- Hech qanday ALL CAPS label. Hech qanday "→" tugma matnining oxirida (ikonka alohida).
- Raqamlar `font-variant-numeric: tabular-nums`.

### 3. Bo'shliq va ritm

- 8px grid: `8 / 12 / 16 / 24 / 32 / 48 / 64 / 80`.
- Karta ichki padding: **24px** (mobil 20px). Katta panel: **32px**.
- Bo'limlar orasidagi vertikal ritm: **32px**, kichik guruhlar ichida **16px**.
- Sahifa yuqori padding **48px**, pastki **96px** (nafas).
- Elementlar orasidagi tipik gap: 8px (ikon–matn), 12px (tugma ichi), 16px (qatorlar), 24px (kartalar).

### 4. Yuzalar va chuqurlik

- **Border o'rniga oq maydon + yumshoq soya.** Faqat zarur joyda 1px `--pm-line`.
- `--pm-shadow-1: 0 1px 2px rgba(31,27,21,.04), 0 8px 24px rgba(31,27,21,.05)`
- `--pm-shadow-2: 0 2px 8px rgba(31,27,21,.05), 0 24px 60px rgba(31,27,21,.07)`
- Radius ierarxiyasi: kichik 10px, karta 16px, katta panel 24px, pill 999px.
- Gradient faqat hero'da (juda past kontrastli); boshqa hech qayerda yo'q.
- Hech qanday `filter: drop-shadow`, hech qanday ko'p qatlamli rangli shadow.

### 5. Komponent retseptlari (barcha agentlar bularga amal qiladi)

**Tugma (primary):** balandlik 48px, padding `0 24px`, radius 12px, font 14px/700, fon `--pm-accent`, matn oq, faqat pastki 1px ichki soya. Hover: 2% qorong'i. **Faqat bitta primary harakat ekranda.**

**Tugma (secondary/ghost):** balandlik 44px, fon transparent, 1px `--pm-line`, matn `--pm-ink-2`. Hover: `--pm-surface-2`.

**Chip:** balandlik 28px, padding `0 12px`, radius 999px, font 12px, fon `--pm-surface-2`, matn `--pm-ink-2`. Faol: `--pm-accent-soft` + `--pm-accent`.

**Karta:** fon `--pm-surface`, radius 16px, padding 24px, `--pm-shadow-1`, border yo'q. Ichida sarlavha 18px, keyingi qator 16px gap.

**Sarlavha bloki:** eyebrow 12px/700 `--pm-accent` (harf oralig'i 0.08em, lekin ALL CAPS emas), title 40px Fraunces, subtitle 16px `--pm-ink-2`, margin-bottom 32px.

**Nav oddiy matn** (hech qanday pill/chelka): 14px/600 `--pm-ink-3`; faol: `--pm-ink` + pastki 2px `--pm-accent` chiziq. Badge faqat faol bo'lmaganda.

**Ikonka:** 18px standart, 16px kichik, 20px katta; stroke 1.8; matn bilan 8px gap; `currentColor`.

**Focus:** barcha interactive elementlar uchun `2px --pm-accent`, offset 3px. Faqat script-focus qilingan sarlavha/main da outline yo'q.

### 6. Harakat va holat

- Bitta page-entry harakati: opacity + 8px translateY, 320ms, faqat birinchi render.
- Hover: 160ms, faqat background/transform 1px.
- `prefers-reduced-motion` → barcha harakat o'chadi.
- Empty state: katta icon (48px, `--pm-accent-soft` doira), sarlavha 20px, qisqa izoh, bitta aniq harakat tugmasi.
- Loading: skeleton `--pm-surface-2`, shimmer yo'q (faqat past opacity o'zgarishi).
- Error: `--pm-accent` chap chiziq, oddiy matn, "qayta urinish" harakati.

### 7. Dark mode

Dark — shunchaki ranglarni almashtirish emas: kontrast pastroq, soya kuchliroq, border deyarli yo'q, accent ochroq (`#E69A6C`). Matn `--pm-ink` `#F5EFE4`, ikkilamchi `#CFC4B2`.

### 8. Agentlar uchun qat'iy qoidalar

1. Faqat o'zingizga biriktirilgan `styles/premium/<element>.css` fayliga yozing. Boshqa faylga tegmang.
2. Faqat `--pm-*` tokenlaridan foydalaning (lit hex/rgb yo'q). Yangi token kerak bo'lsa, summary'da so'rang.
3. `!important` ishlatman — aggregate import tartibi (premium oxirida) yetarli. Faqat `prefers-reduced-motion` da oldingi qoidalarni yengish uchun ruxsat.
4. Selektoringiz faqat o'zingizga tegishli elementga ta'sir qilishi kerak. Boshqa agentning elementiga tegmang.
5. Eski klass nomlarini o'zgartirmang (TSX ularga tayanadi). Yangi class qo'shish mumkin, lekin TSX ga yozolmaysiz — kerak bo'lsa summary'da bildiring.
6. Accessibilityni zaiflashtirmang: focus ring, ARIA bog'langan selektorlar, reduced-motion saqlansin.
7. Har bir agent o'z elementini **1440 / 900 / 620 / 375** kengliklarda ko'z oldiga keltirib yozadi.
8. Return: Findings / Changes / Risks / Verification.
