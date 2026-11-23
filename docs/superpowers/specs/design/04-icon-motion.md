# D04 — Iconography, Motion & Micro-interactions (decision spec)

> Qaror hujjati. Element agentlari **shuni oladi**, o'zicha yangi harakat/ikonka qo'shmaydi.
> Manba: `2026-11-23-premium-design-system.md` §5 (Ikonka/Focus), §6 (Harakat),
> `apps/desktop/src/components/nx/icons.tsx`, `apps/desktop/src/components/nx/NxUI.tsx`,
> `apps/desktop/src/styles/premium/00-tokens.css`.
> CSS yozmayman — faqat qaror. **Motion CSS egasi: `35-motion.css`**; qolgan element fayllari
> faqat shu qiymatlarni iste'mol qiladi, o'z `@keyframes` yaratmaydi.

---

## 0. Taklif qilinadigan yangi tokenlar (00-tokens.css egasiga so'rov)

Harakat qiymatlari ham tokenlashsin; agentlar bloklanmasligi uchun literal fallback yozildi.

| Token (taklif) | Qiymat | Literal ekvivalenti |
|---|---|---|
| `--pm-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | entrance/modal/progress/flip-ish |
| `--pm-ease-std` | `cubic-bezier(0.4, 0, 0.2, 1)` | hover/tab/nav/selection/focus |
| `--pm-d-hover` | `160ms` | — |
| `--pm-d-enter` | `320ms` | — |

Rang/soya uchun **faqat mavjud** `--pm-*`: `--pm-accent`, `--pm-accent-soft`, `--pm-ink`,
`--pm-ink-2`, `--pm-ink-3`, `--pm-line`, `--pm-line-strong`, `--pm-surface-2`,
`--pm-shadow-focus`. Yangi rang kerak emas.

---

## 1. Ikonka tizimi

**Asos (`icons.tsx`):** `viewBox 0 0 24 24`, `fill:none`, `stroke:currentColor`,
`stroke-linecap/join:round`, `aria-hidden="true"`, `focusable="false"`. Bu o'zgarishsiz qoladi.
**Qoida:** stroke ikonka — hech qachon CSS bilan `color` berilmaydi, faqat `currentColor`
(orqali ota element rangi). Har qator ichida bitta stroke qalinligi.

### 1.1 O'lcham / qalinlik — qat'iy jadval

| Kontekst | Class / selector (ma'lum) | Icon px | Stroke | Color | Gap (matngacha) |
|---|---|---|---|---|---|
| Topbar / yon nav elementi | `.nav-*` (P03), `.nx-toc__item` | **18** | 1.8 | `currentColor` (faol: `--pm-ink`, pasif: `--pm-ink-3`) | 8px |
| Primary tugma (matnli) | `.nx-btn--primary` | **18** | 1.8 | oq (`currentColor`) | 8px |
| Secondary / ghost tugma | `.nx-btn--ghost`, `.nx-back` | **18** | 1.8 | `--pm-ink-2` | 8px |
| Katta tugma (`--lg`) | `.nx-btn--lg` | **20** | 1.8 | currentColor | 8px |
| Chip (ichidagi ikonka) | `.nx-chip`, `.nx-chip--accent` | **16** | 1.8 | `--pm-ink-2` / faol `--pm-accent` | 6px |
| Karta sarlavhasi | `.nx-card h2/h3`, `.nx-section-head` | **18** | 1.8 | `--pm-ink` | 8px |
| Reader toolbar (icon-only) | `.nx-reader-toolbar .nx-icon-btn` | **18** | 1.8 | `--pm-ink-2` | — |
| Umumiy icon-only tugma | `.nx-icon-btn`, `.nx-modal__close` | **18** (close: 16) | 1.8 | `--pm-ink-2` | — |
| Stat ikonkasi | `.nx-stat__icon` | **16** | 1.8 | `--pm-ink-3` / tone rangi | — |
| Kbd/chip ichidagi belgi | `.nx-kbd` | 14 (faqat raqam/belgi) | — | --pm-ink-3 | — |
| Empty state ikonkasi | `.nx-empty__icon` | **48** | **1.5** | `--pm-accent` | — |
| Ring/Bar ichidagi ikonka yo'q | `.nx-ring`, `.nx-progress` | — | — | — | — |

Faqat uchta o'lcham mavjud: **16 / 18 / 20**, + empty state **48** (maxsus). 17, 19, 22, 24 yo'q.
`size` prop orqali TSX dagi `size={14}` (mas. `QuizRunner` natijalar qatorida `IconCheck size={14}`)
— **qonuniy istisno**, faqat natija jadvalidagi 12px qator uchun; boshqa joyda 14 ishlatilmaydi.

### 1.2 Outline vs Filled

| Holat | Qo'llanish | Qoida |
|---|---|---|
| **Outline** (default) | Barcha navigatsiya, harakat, toolbar, karta, stat, empty state | `fill:none`, stroke 1.8 (empty: 1.5) |
| **Filled** | Faqat: (1) `IconPlay` media triangle, (2) `IconMore` 3 nuqta, (3) tanlangan/saqlangan belgi (to'ldirilgan check, to'ldirilgan bookmark), (4) chip ichidagi kichik status nuqtasi | `fill:currentColor`, `stroke:none` |
| aralash | Hech qachon bitta ikonkani yarmi fill, yarmi stroke qilmang (`IconPlay` va `IconMore` allaqachon to'g'ri) | — |

 filled ↔ outline almashinuvi **faqat holat o'zgarishida** bo'ladi, hover'da emas; o'tish
`opacity`/`fill` 160ms `--pm-ease-std` (yoki yangi ikonka cross-fade) — shake/scale yo'q.

### 1.3 Icon-only tugma qanday ko'rinishi shart

| Xususiyat | Qiymat |
|---|---|
| Hit target | **40×40px** (desktop), **min 44×44px** (touch / ≤620px) |
| Radius | `--pm-r-sm` (10px) |
| Fon | `transparent` (hover: `--pm-surface-2`) |
| Ikonka | 18px, `--pm-ink-2`, markazda |
| Hover | fon 160ms `--pm-ease-std`; ikonka rangi `--pm-ink` |
| Active/pressed | fon `--pm-accent-soft`, ikonka `--pm-accent` |
| Disabled | `opacity:.45`, `pointer-events:none`,harakat yo'q |
| Accessibility | `aria-label` majburiy (ikonka o'zi `aria-hidden`); focus ring 3px offset bilan kesilmasligi uchun `overflow:visible` |
| Close/Modal | `.nx-modal__close` 16px ikonka, target 40×40, offset 3px ring |

---

## 2. Harakat tizimi

### 2.1 Mavjud bo'lgan yagona o'tishlar (boshqasi yo'q)

| ID | Element | Property | Duration | Easing | Eslatma |
|---|---|---|---|---|---|
| `T1 ENTER` | Sahifa ichidagi asosiy kontent root'i (`.nx-page` / sahifa `main`) | `opacity`, `transform: translateY(8px→0)` | **320ms** | `--pm-ease-out` | **Bitta** orkestratsiya, mount'da 1 marta |
| `T2 HOVER` | Tugma, chip, nav, karta, row | `background-color`, `color`, `border-color`, `transform: translateY(-1px)` | **160ms** | `--pm-ease-std` | Faqat 1px lift; soya o'zgarmaydi |
| `T3 PRESS` | Tugma, icon-only | `transform: translateY(1px) scale(.985)` | **100ms** | `--pm-ease-std` | Release 160ms |
| `T4 SELECT` | Nav underline, tab indikator, chip faol, quiz option | `transform` / `background-color` / `border-color` | **160ms** | `--pm-ease-std` | — |
| `T5 PROGRESS` | `.nx-progress > span` width, `.nx-ring .value` stroke-dashoffset | width **320ms**, ring **480ms** | `--pm-ease-out` | shimmer yo'q |
| `T6 FADE` | Overlay fon, kontent cross-fade, skeleton | `opacity` | **160ms** | `linear` | Faqat opacity |
| `T7 TOAST` | `.nx-toast` kirish | `opacity`, `translateY(12px→0)` | **240ms** | `--pm-ease-out` | chiqish 160ms faqat opacity |
| `T8 MODAL` | `.nx-modal` kirish | `opacity`, `translateY(12px→0) scale(.98→1)` | **240ms** | `--pm-ease-out` | overlay 160ms `T6` |
| `T9 FLIP` | `.term-inner` | `transform: rotateY(0→180deg)` | **420ms** | `--pm-ease-std` | perspective 900px |

> Easinglar: `--pm-ease-out` = tez boshlab sokin tugaydi (entrance/overlay/progress);
> `--pm-ease-std` = simmetrik (holat/hover/tanlash). Hech qanday `bounce`, `elastic`, `overshoot`.

### 2.2 Yagona orkestratsiyali kirish

- **Faqat bitta element** `T1` oladi: sahifa kontenti root'i. Har bir karta/row **almaydi**.
- Stagger, delay, cascade — **taqiqlangan** (bitta diqqat markazi qoidasi).
- `T1` 320ms davom etayotganda boshqa `T*` boshlanmaydi (qarang §5 Motion budget).
- Modal/toast o'z kirishini saqlaydi (`T7/T8`) — ular sahifa kontenti emas, overlay.
- Route almashganda `T1` qayta ishga tushadi (mount), lekin ichki elementlar yana harakatsiz.
- Skeleton: statik `--pm-surface-2`, shimmer yo'q, faqat `opacity` o'zgarishi (`T6`).

### 2.3 Reduced motion — shartsiz

`@media (prefers-reduced-motion: reduce)` da:
- Barcha `animation` va `transition` = **`none`** (jumladan `T1…T9`).
- Flip holati **instant** almashadi (ma'no `aria-expanded` + statik yuz orqali yetkaziladi).
- Progress yakuniy qiymatga darhol o'tadi.
- Toast/modal darhol ko'rinadi.
- **Focus ring o'zgarishsiz qoladi** (accessibility).
- Faqat shu media-blokda oldingi qoidalarni `!important` bilan yengish ruxsat etiladi.

---

## 3. Micro-interactions (aniq timing)

| Element | Trigger | Effekt | Duration / Easing | Qo'shimcha shart |
|---|---|---|---|---|
| **Button (primary/ghost)** | hover | bg/color o'zgarishi | 160ms `--pm-ease-std` | hover faqat 2% qorong'i (`--pm-accent-hover`) |
| | press | `translateY(1px) scale(.985)` | 100ms in / 160ms out | disabled'da hech narsa |
| **Nav active** | faol bo'lish | pastki 2px `--pm-accent` chiziq `scaleX(0→1)` (origin left) + rang `--pm-ink-3→--pm-ink` | 160ms `--pm-ease-std` | pill/fon yo'q; badge faqat nofaolda |
| **Tab switching** | tab tanlash | indikator `translateX` 200ms `--pm-ease-std`; label rang 160ms; kontent **faqat opacity** cross-fade 120ms `linear` | 200 / 160 / 120ms | panel butunlay siljimaydi; slide yo'q |
| **Card hover** | hover | `translateY(-1px)` + `border-color`→`--pm-line-strong` (border bor bo'lsa) | 160ms `--pm-ease-std` | **soya o'zgarmaydi**; rasm bo'lsa `scale(1.02)` 240ms `--pm-ease-out`, `overflow:hidden` |
| **Flip card** (`term-card.flipped`) | click | `rotateY(0→180deg)`, `perspective:900px` | **420ms `--pm-ease-std`** | yuzlar `backface-visibility:hidden`; soya/border animatsiyasi yo'q; teskarisi xuddi shu 420ms |
| **Quiz option** (`.nx-option`) | tanlash | bg `--pm-accent-soft`, border `--pm-accent`, `picked` | 160ms `--pm-ease-std` | tugma bosilganda blur** yo'q** |
| | reveal | to'g'ri→`--pm-sage-soft`, noto'g'ri→`--pm-accent-soft`; key badge `opacity 0→1` | 160ms `--pm-ease-std` / 120ms `linear` | **shake, pulse, flash yo'q**; bloklangan variantlar `opacity:.6` 160ms |
| **Toast arrival** | `show()` | `opacity 0→1` + `translateY(12px→0)` | **240ms `--pm-ease-out`** | 2600ms avto-yopish (NxUI.tsx); chiqish **160ms faqat opacity**; `role=status`, `aria-live=polite` saqlanadi |
| **Modal open** | ochish | overlay `opacity` 160ms `linear`; karta `opacity` + `translateY(12px→0) scale(.98→1)` | **240ms `--pm-ease-out`** | `backdrop-filter` animatsiyasi yo'q; yopish 140ms yoki instant; autofocus + focus trap buzilmaydi |

Qo'shimcha: `.nx-scenario__reveal` ochilishi `T6` (opacity 160ms) + kontent `T1` emas,
balki 120ms opacity; `nx-rise` kabi eski keyframe'lar premium qatlamda ishlatilmaydi.

---

## 4. Focus ring dizayni

| Xususiyat | Qaror |
|---|---|
| Ko'rinish | `outline: 2px solid var(--pm-accent)` |
| Offset | **3px** (input: 2px) |
| Halo | **yo'q** — `--pm-shadow-focus` statik qo'shimcha sifatida ishlatilmaydi (ikki halqa bo'lmaydi) |
| Trigger | **`:focus-visible` faqat** (mouse click'da ko'rinmaydi) |
| Animatsiya | **0ms — yo'q**. Na transition, na keyframe. Fokus darhol paydo bo'ladi |
| Qamrov | `.nx-btn`, `.nx-icon-btn`, `.nx-back`, `.nx-switch`, `.nx-segmented button`, `.nx-input`, `.nx-modal__close`, nav/tab/chip/card interactive, `.nx-dropzone`, `.nx-book-card`, `.nx-toc__item` |
| Input | outline 2px accent, offset 2px + `border-color: var(--pm-accent)` |
| Icon-only | 3px offset `overflow:visible` bilan kesilmaydi; 40×40 target bilan birga |
| forced-colors | `outline-color: Highlight` |
| Script-focus | sarlavha / `main` ga `outline:none` (faqat dasturiy fokus) |
| Reduced motion | **o'zgarishsiz** — ring ko'rinishda qoladi |
| Hover bilan chalkash | focus ustun turadi: hover fon o'zgarishi ring'ni yashirmaydi |

---

## 5. Motion budget

**Bitta ekranda bir vaqtda maksimal 3 ta animatsiya.**

| Vaziyat | Ruxsat etilgan | Hisob |
|---|---|---|
| Sahifa kirishi (`T1`) | 1 (`T1`) | 320ms tugaguncha boshqa hech qanday `T*` boshlanmaydi |
| Hover | 1 (faqat hover qilingan element) | Grid'da faqat bitta karta; qo'shni kartalar harakatlanmaydi |
| Progress bor ekran | ring 1 + bar 1 = 2 | `T1` bilan bir vaqtda bo'lmaydi |
| Toast | 1 (`T7`) | boshka hover bo'lsa jami 2 |
| Modal ochiq | overlay 1 + karta 1 = 2 | `T1` va card-hover **suppress** qilinadi; toast qo'shilsa jami 3 (limit) |
| Flip | 1 (`T9`) | boshqa flip bir vaqtda harakatlanmaydi (ketma-ket bosing) |
| Infinite / loop | **0** | `nx-pulse` va har qanday infinite animation o'chiriladi |
| Stagger / cascade | **0** | — |

Qo'shimcha chegaralar:
- Har bir element uchun **bitta property guruhi** (mas. `bg + color` **yoki** `transform` — `bg + transform + shadow` birga emas).
- `scale` maksimum **1.02**; rotation faqat flip va chevron 180° holat almashinuvi.
- 3 dan ortiq animatsiya talab qiladigan dizayn **qabul qilinmaydi** — dizaynni soddalashtiring.

---

## STOP-LIST (hech qachon)

```
✗ font-size / font-weight / letter-spacing / line-height animatsiyasi
✗ width / height / top / left / right / bottom / margin / padding animatsiyasi
✗ box-shadow animatsiyasi (hover'da soya o'zgarishi — yo'q)
✗ filter / backdrop-filter / blur animatsiyasi
✗ `transition: all` / `animation: ... infinite`
✗ bounce / elastic / overshoot / shake / pulse / flash / marquee
✗ stagger, delay, cascade, har bir kartaga alohida entrance
✗ 1px dan katta translateY hover lift; 1.02 dan katta scale
✗ Drop-shadow, rangli ko'p qatlamli soya
✗ 16/18/20/48 dan boshqa ikonka o'lchami (14 faqat natija jadvalidagi istisno)
✗ 1.8 dan boshqa stroke (empty state 1.5 — istisno)
✗ hover'da outline/fill almashinuvi
✗ mouse click'da focus ring ko'rinishi (:focus-visible emas)
✗ reduced-motion holatida harakat qoldirish
✗ 3 tadan ortiq bir vaqtli animatsiya
```

---

### Element agentlariga yo'l-yo'riq

- **35-motion.css (motion egasi):** yuqoridagi `T1…T9` keyframe/transition'lari + reduced-motion override'ini yozadi. Yangi keyframe ixtiro qilmaydi.
- **Ikonka iste'molchilari (P03 nav, P08 buttons, P09 chips, P23 toolbar, empty state, stat):** faqat §1 jadvalidagi px/stroke/color; `currentColor` buzilmaydi.
- **Karta/tab/quiz/modallar (P20, P22, P26, P27, feedback):** §3 dagi timing'lar; o'z `transition` qiymatlarini qo'shmang.
- **00-tokens.css egasi:** §0 dagi 4 tokenni qo'shadi (yoki literal qiymatlar ishlatiladi).
- Yangi class kerak bo'lsa — TSX ga yozolmaysiz, summary'da bildiring (spec qoidasi 5).
