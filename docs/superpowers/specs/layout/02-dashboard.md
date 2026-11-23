# L02 — Dashboard: layout decisions

> Qarorlar hujjati. CSS faqat **paste-ready taklif** sifatida keltirilgan — amalda hech qaysi
> `.css` fayliga yozilmadi. Barcha o'lchamlar 8px gridga, ranglar/soyalar/radiuslar `--pm-*`
> tokenlariga bog'langan (`docs/superpowers/specs/2026-11-23-premium-design-system.md`).
> Sibling qaror: `04-book.md` bilan bir xil token/kenglik tizimi ishlatiladi.

## Global o'zgaruvchilar (qarorlarning asosi)

| Nom | Qiymat | Izoh |
|---|---|---|
| `--pm-page-wide` | `1200px` | content maksimal kengligi, markazda (`04-book.md` bilan bir xil) |
| Side padding | `48px` (1440/900), `24px` (620), `20px` (375) | sahifa ichki cheti |
| Grid content | `1104px` @1440 · `804px` @900 · `572px` @620 · `335px` @375 | `1200−96` / `900−96` / `620−48` / `375−40` |
| Vertikal ritm | hero→kartalar `32px`, kartalar→split `32px`, stack ichi `16px` | kichik guruhlar `16px`, bo'limlar `32px` |
| Page padding | `48px 48px 96px` (1440/900), `24px 24px 64px` (620/375) | pastki 96/64 — nafas |
| Karta padding | `24px` (1440/900), `20px` (620/375) | katta panel (`Davom ettirish`) `32px` / mobil `20px` |
| Grid shkala | `8 / 12 / 16 / 24 / 32 / 48 / 64 / 80` | barcha gap/min-height/padding |
| Fontlar | `--font-display` (Fraunces 600), `--font-ui` (Manrope 500–700) | `04-book.md` bilan bir xil |
| Rang byudjeti | `--pm-ink` + `--pm-accent` | `--pm-sage` faqat bajarilgan belgida, `--pm-brass` faqat streak nuqtasida |

**Editorial prinsip:** bitta e'tibor markazi — **`Davom ettirish` kartasidagi yagona primary CTA
(`O'qishni davom ettir`)**. Hero bu markaz bilan raqobatlashmaydi: u faqat orientatsiya
(salomatlashuv + kun konteksti). Shuning uchun hero ring'i o'chiriladi, barcha rangli chip/tone
neutralizatsiya qilinadi, kartalar ichidagi kartalar yo'q qilinadi.

---

## D1 — Hero

**Qaror:** 2 ustunli editorial blok: `[avatar] [matn]`. To'rtinchi element sifatida ring **mavjud
emas** — joriy kitob progressi allaqachon `Davom ettirish` kartasidagi yagona 6px bar bilan
ko'rsatiladi. Faqat bitta katta sarlavha (40px Fraunces) e'tibor markazi hisoblanadi.

### O'lcham va joylashuv jadvali

| Breakpoint | Hero balandligi | Ichki grid | Avatar | Salomatlashuv | Subtitle | Chips | Ring |
|---|---|---|---|---|---|---|---|
| **1440** | `min-height:184px`, padding `32px` | `56px minmax(0,1fr)`, gap `24px` | `56×56`, radius `16px` | `40px` Fraunces, col 2 / row 1 | `16px --pm-ink-2`, col 2 / row 2, `margin-top:8px` | col 2 / row 3, `margin-top:16px`, `gap:8px` | **o'chiriladi (0px)** |
| **900** | `min-height:160px`, padding `24px` | `56px minmax(0,1fr)`, gap `24px` | `56×56`, radius `16px` | `30px` Fraunces | `15px`, 1 qator | bir qator (wrap yo'q) | **o'chiriladi (0px)** |
| **620** | `min-height:216px`, padding `24px` | `48px minmax(0,1fr)`, gap `16px` | `48×48`, radius `12px` | `30px` Fraunces | `15px`, 2 qatorgacha | 2 qatorgacha wrap | **o'chiriladi (0px)** |
| **375** | `min-height:240px`, padding `24px 20px` | `40px minmax(0,1fr)`, gap `16px` | `40×40`, radius `10px` | `24px` Fraunces | `14px`, 3 qatorgacha | 2 qator, `gap:8px` | **o'chiriladi (0px)** |

**Matn bloki:** `max-width:720px` (uzun chiziq 66ch dan oshmaydi). Salomatlashuv va subtitle
chapga tekis. Chips matn blokining oxirgi qatori — 3 ta neutral chip:

| Chip | Fon | Matn | Belgi |
|---|---|---|---|
| `1 kunlik streak` | `--pm-surface-2` | `--pm-ink-2` | 6px `--pm-brass` nuqta (yagona brass ishlatilishi) |
| `0 ta bob o'qildi` | `--pm-surface-2` | `--pm-ink-2` | yo'q |
| `Quiz boshlanmagan` | `--pm-surface-2` | `--pm-ink-2` | yo'q |

Chip o'lchami barcha breakpointlarda: `height:28px`, `padding:0 12px`, `radius:999px`,
`font:12px --font-ui` (eski amber/green/primary fonlari olib tashlanadi).

### Wireframe (1440)

```
┌────────────────────────────────────────────────────────────────┐  ← border yo'q, shadow-1
│  ┌────┐  Salom, o'quvchi 🦊                  (40px Fraunces)   │
│  │ 🦊 │  Bugun uchun 5 ta takrorlash savoli tayyor...  (16px)  │
│  │56px│  [• 1 kunlik streak] [0 ta bob o'qildi] [Quiz…]        │
│  └────┘   ↑ 28px chip, 12px matn, 8px gap                      │
│                                                                │
│  (o'ng tomon bo'sh — ataylab nafas; ring yo'q)                 │
└────────────────────────────────────────────────────────────────┘
   184px balandlik · 32px padding
```

### Paste-ready CSS

```css
.nx-dash .nx-hero{
  display:grid;
  grid-template-columns:56px minmax(0,1fr);  /* ring kolonkasi yo'q */
  gap:24px; align-items:center;
  min-height:184px;
  padding:32px;
  background:var(--pm-surface);
  border:0; border-radius:24px; box-shadow:var(--pm-shadow-1);
  position:relative;
}
.nx-dash .nx-hero::before{            /* gradient FAQAT hero'da, juda past kontrast */
  content:''; position:absolute; inset:0; border-radius:24px;
  background:radial-gradient(560px 240px at 100% 0%, var(--pm-accent-soft), transparent 70%);
  opacity:.55; pointer-events:none;
}
.nx-dash .nx-hero__avatar{
  width:56px; height:56px; border-radius:16px;
  display:grid; place-items:center; font-size:28px;
  background:var(--pm-surface-2); color:var(--pm-ink);
}
.nx-dash .nx-hero__text{max-width:720px; min-width:0; position:relative;}
.nx-dash .nx-hero__title{
  margin:0; font:600 40px/1.1 var(--font-display);
  letter-spacing:-.035em; color:var(--pm-ink);
}
.nx-dash .nx-hero__sub{
  margin:8px 0 0; font-size:16px; line-height:1.5; color:var(--pm-ink-2);
}
.nx-dash .nx-hero__meta{
  display:flex; flex-wrap:wrap; gap:8px; margin-top:16px;
}
.nx-dash .nx-hero .nx-chip{
  height:28px; padding:0 12px; border-radius:999px;
  background:var(--pm-surface-2); color:var(--pm-ink-2);
  font:600 12px var(--font-ui);
}
.nx-dash .nx-hero .nx-chip--streak::before{
  content:''; width:6px; height:6px; border-radius:50%;
  background:var(--pm-brass);
}
.nx-dash .nx-hero .nx-ring{display:none;}   /* ring butunlay o'chiriladi */

@media (max-width:900px){
  .nx-dash .nx-hero{min-height:160px; padding:24px; gap:24px;}
  .nx-dash .nx-hero__title{font-size:30px;}
  .nx-dash .nx-hero__sub{font-size:15px;}
}
@media (max-width:620px){
  .nx-dash .nx-hero{grid-template-columns:48px minmax(0,1fr); gap:16px; min-height:216px;}
  .nx-dash .nx-hero__avatar{width:48px; height:48px; border-radius:12px; font-size:24px;}
}
@media (max-width:375px){
  .nx-dash .nx-hero{grid-template-columns:40px minmax(0,1fr); gap:16px; min-height:240px; padding:24px 20px;}
  .nx-dash .nx-hero__avatar{width:40px; height:40px; border-radius:10px; font-size:20px;}
  .nx-dash .nx-hero__title{font-size:24px;}
  .nx-dash .nx-hero__sub{font-size:14px;}
}
```

---

## D2 — Yuqori kartalar qatori va vertikal ritm

**Qaror:** uchta karta 1440 da teng uch ustun; 900 da `2 + 1` (ko'rsatkichlar butun qatorga
yayiladi va 4 ta stat bir qatorda); 620/375 da bitta ustun. Kartalar `align-items:start` —
**tabiiy balandlik**, cho'zilmaydi (ichida bo'sh qolmaydi).

### Grid jadvali

| Breakpoint | `grid-template-columns` | Gap | Karta kengligi (reja / amallar / ko'rsatkichlar) | Qator 2 |
|---|---|---|---|---|
| **1440** | `repeat(3, minmax(0, 1fr))` | `24px` | `352 / 352 / 352px` | stats keyingi bo'limda emas, 1-qatorda |
| **900** | `repeat(2, minmax(0, 1fr))` | `24px` | `390 / 390px`, stats `804px` (to'liq qator) | stats 2-qator, `grid-column:1 / -1` |
| **620** | `minmax(0, 1fr)` | `16px` | `572 / 572 / 572px` | 3 ta ketma-ket |
| **375** | `minmax(0, 1fr)` | `16px` | `335 / 335 / 335px` | 3 ta ketma-ket |

### Vertikal ritm jadvali

| Orasidagi bo'shliq | 1440/900 | 620/375 |
|---|---|---|
| Page yuqori padding | `48px` | `24px` |
| Hero → kartalar qatori | `32px` | `24px` |
| Kartalar qatori → split | `32px` | `24px` |
| Split ichidagi stack (karta→karta) | `16px` | `16px` |
| Page pastki padding | `96px` | `64px` |
| Karta ichki sarlavha → kontent | `16px` | `16px` |

### Paste-ready CSS

```css
.nx-dash .nx-top-grid{
  display:grid;
  grid-template-columns:repeat(3, minmax(0,1fr));
  gap:24px; align-items:start;
  margin-top:32px;
}
.nx-dash .nx-card{
  background:var(--pm-surface);
  border:0; border-radius:16px;
  padding:24px; box-shadow:var(--pm-shadow-1);
  min-height:0;                 /* tabiiy balandlik — cho'zilmaydi */
}
.nx-dash .nx-card__head{
  display:flex; align-items:center; justify-content:space-between;
  gap:8px; margin-bottom:16px; padding-bottom:12px;
  border-bottom:1px solid var(--pm-line);
}
.nx-dash .nx-card__head h3{
  margin:0; font:600 20px/1.2 var(--font-display);
  letter-spacing:-.02em; color:var(--pm-ink);
}
.nx-dash .nx-eyebrow{
  font:700 12px var(--font-ui); color:var(--pm-accent);
  text-transform:none; letter-spacing:0;   /* ALL CAPS yo'q */
}
.nx-dash .nx-card__note{
  margin:0 0 16px; font-size:13px; line-height:1.5;
  color:var(--pm-ink-3); max-width:72ch;
}
.nx-dash .nx-text-link{
  font:700 14px var(--font-ui); color:var(--pm-accent);
  background:none; border:0; padding:0;   /* chip emas, oddiy matn */
}
@media (max-width:900px){
  .nx-dash .nx-top-grid{grid-template-columns:repeat(2, minmax(0,1fr));}
  .nx-dash .nx-top-grid__stats{grid-column:1 / -1;}
}
@media (max-width:620px){
  .nx-dash .nx-top-grid{grid-template-columns:minmax(0,1fr); gap:16px; margin-top:24px;}
  .nx-dash .nx-card{padding:20px;}
}
```

---

## D3 — Ichki geometriya: reja / amallar / ko'rsatkichlar

### D3.1 — «Bugungi reja» qatorlari

**Qaror:** ichki karta borderlari o'chiriladi; qatorlar 1px `--pm-line` hairline bilan ajratilgan
tekis bandlar. Har bir qator: `[icon 40] [matn 1fr] [check 24]`.

| Breakpoint | Ustunlar | Icon | Qator `min-height` | Padding | Qator orasi | Check |
|---|---|---|---|---|---|---|
| **1440** | `40px minmax(0,1fr) 24px` | `40×40`, radius `10px` | `64px` | `12px 0` | `0` + hairline | `24px`, `--pm-sage` (bajarilganda) |
| **900** | bir xil | `40×40` | `64px` | `12px 0` | bir xil | bir xil |
| **620** | bir xil | `40×40` | `64px` | `12px 0` | bir xil | bir xil |
| **375** | bir xil | `40×40` | `64px` | `12px 0` | bir xil | bir xil |

Matn: title `14px/700 --pm-ink`, sub `13px --pm-ink-3` (ellipsis, 1 qator).

```css
.nx-dash .nx-todo{display:flex; flex-direction:column; gap:0;}
.nx-dash .nx-todo__row{
  display:grid; grid-template-columns:40px minmax(0,1fr) 24px;
  align-items:center; gap:12px;
  min-height:64px; padding:12px 0;
  border:0; border-bottom:1px solid var(--pm-line);
  background:transparent; text-decoration:none; color:var(--pm-ink);
}
.nx-dash .nx-todo__row:last-child{border-bottom:0;}
.nx-dash .nx-todo__icon{
  width:40px; height:40px; border-radius:10px;
  display:grid; place-items:center;
  background:var(--pm-surface-2); color:var(--pm-ink-2);
}
.nx-dash .nx-todo__body{min-width:0; display:flex; flex-direction:column; gap:4px;}
.nx-dash .nx-todo__body b{font:700 14px var(--font-ui);}
.nx-dash .nx-todo__body small{font-size:13px; color:var(--pm-ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.nx-dash .nx-todo__check{
  width:24px; height:24px; border-radius:999px;
  display:grid; place-items:center;
  border:1px solid var(--pm-line-strong); color:var(--pm-ink-3);
}
.nx-dash .nx-todo__row.is-done .nx-todo__check{
  background:var(--pm-sage); border-color:var(--pm-sage); color:var(--pm-surface);
}
```

### D3.2 — «Tezkor amallar» plitkalari

**Qaror:** plitkalar karta ichida karta **emas** — `--pm-surface-2` yuzasi, border yo'q.
Barcha 4 ta ikonka neutral (`--pm-ink-2`); blue/yellow/purple tonlari o'chiriladi (rang byudjeti
2 tagacha). 375 da 1 ustunli gorizontal qatorga o'tadi.

| Breakpoint | Ustunlar | Plitka kengligi | Plitka `min-height` | Gap | Ichki padding | Joylashuv |
|---|---|---|---|---|---|---|
| **1440** | `2` | `146px` | `112px` | `12px` | `16px` | vertikal: icon → title → sub |
| **900** | `2` | `165px` | `112px` | `12px` | `16px` | vertikal |
| **620** | `2` | `260px` | `112px` | `12px` | `16px` | vertikal |
| **375** | `1` | `295px` | `64px` | `0` + hairline | `12px 0` | gorizontal: `[icon] [matn]` |

```css
.nx-dash .nx-actions{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px;}
.nx-dash .nx-action{
  display:flex; flex-direction:column; align-items:flex-start; gap:8px;
  min-height:112px; padding:16px;
  border:0; border-radius:10px; background:var(--pm-surface-2);
  text-decoration:none; color:var(--pm-ink);
}
.nx-dash .nx-action__icon{
  width:40px; height:40px; margin-bottom:auto; border-radius:10px;
  display:grid; place-items:center;
  background:var(--pm-surface); color:var(--pm-ink-2);
}
.nx-dash .nx-action b{font:700 14px/1.3 var(--font-ui);}
.nx-dash .nx-action small{font-size:13px; line-height:1.4; color:var(--pm-ink-3);}
@media (max-width:375px){
  .nx-dash .nx-actions{grid-template-columns:minmax(0,1fr); gap:0;}
  .nx-dash .nx-action{
    flex-direction:row; align-items:center; gap:12px;
    min-height:64px; padding:12px 0; border-radius:0;
    background:transparent; border-bottom:1px solid var(--pm-line);
  }
  .nx-dash .nx-action:last-child{border-bottom:0;}
  .nx-dash .nx-action__icon{width:40px; height:40px; margin:0; background:var(--pm-surface-2);}
}
```

### D3.3 — «Umumiy ko'rsatkichlar» stat grid

**Qaror:** ichki borderlar yo'q; icon qiymat bilan **bir qator** (ustida emas), label
sentence-case `12px` (ALL CAPS va letter-spacing yo'q). Qiymat `24px` Fraunces, tabular-nums.

| Breakpoint | Ustunlar | Stat kengligi | `min-height` | Gap | Kartadagi joylashuv |
|---|---|---|---|---|---|
| **1440** | `2` (2×2) | `146px` | `88px` | `12px` | 3-karta ichida |
| **900** | `4` (1 qator) | `180px` | `88px` | `12px` | to'liq qator karta ichida |
| **620** | `2` (2×2) | `260px` | `88px` | `12px` | 3-karta ichida |
| **375** | `2` (2×2) | `141px` | `88px` | `12px` | 3-karta ichida |

```css
.nx-dash .nx-stats{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px;}
.nx-dash .nx-stat{
  display:flex; flex-direction:column; gap:4px;
  min-height:88px; padding:16px;
  border:0; border-radius:10px; background:var(--pm-surface-2);
}
.nx-dash .nx-stat__top{display:flex; align-items:center; gap:8px;}
.nx-dash .nx-stat__top svg{width:18px; height:18px; color:var(--pm-ink-3);}
.nx-dash .nx-stat b{
  font:600 24px/1.15 var(--font-display);
  font-variant-numeric:tabular-nums; color:var(--pm-ink);
}
.nx-dash .nx-stat span{font-size:12px; color:var(--pm-ink-3);}
@media (max-width:900px) and (min-width:621px){
  .nx-dash .nx-stats{grid-template-columns:repeat(4,minmax(0,1fr));}
}
```

---

## D4 — Ikkilamchi bloklar (vazn va joylashuv)

**Qaror:** faqat 1440 da ikki ustun; 900/620/375 da bitta ustun va **qat'iy tartib**:
`Davom ettirish → Bugungi vaziyat → Kutubxonam → AI holati → Oxirgi faoliyat`.

| Blok | Vazn | 1440 joylashuv | Konteyner | Nima qoladi |
|---|---|---|---|---|
| **Davom ettirish** | **Eng yuqori** — yagona primary CTA | chap ustun, 1-o'rin | `padding:32px`, radius `16px`, `shadow-1` | muqova `72×96`, title `20px`, 6px progress bar, CTA `48px`, (ixtiyoriy ghost `44px`) |
| **Bugungi vaziyat** | O'rta | chap ustun, 2-o'rin | `padding:24px`, radius `16px`, `shadow-1` | vaziyat matni `16px`, ghost `44px`, "Barcha vaziyatlar" → oddiy 14px link |
| **Kutubxonam** | O'rta-past | chap ustun, 3-o'rin | `padding:24px`, `shadow-1` | 5 qator, muqova `44px`, hairline ajratgich, bar `96px`, "Barchasi" → matn link |
| **AI holati** | **Past** (demoted) | o'ng ustun, 1-o'rin | `padding:24px`, `shadow-1` | provider nomi `14px`, status `12px --pm-ink-3`, text link `14px accent`. 40px binafsha ikonka + chip + to'liq kenglik tugmasi o'chiriladi |
| **Oxirgi faoliyat** | **Eng past** (demoted) | o'ng ustun, 2-o'rin | `padding:24px`, `shadow-1` | **3 ta** qator, icon `24px` neutral check, title `14px`, meta `12px`. Header chip + 36px rangli icon box o'chiriladi |

### Split grid jadvali

| Breakpoint | `grid-template-columns` | Gap | Chap / o'ng kenglik |
|---|---|---|---|
| **1440** | `minmax(0,1.6fr) minmax(0,1fr)` | `24px` | `664 / 416px` |
| **900** | `minmax(0,1fr)` | `24px` (bo'limlar), `16px` (stack) | `804px` |
| **620** | `minmax(0,1fr)` | `16px` | `572px` |
| **375** | `minmax(0,1fr)` | `16px` | `335px` |

### Muqova va CTA o'lchamlari

| Breakpoint | `Davom ettirish` muqovasi | CTA balandligi | CTA kengligi |
|---|---|---|---|
| **1440** | `72×96px` | `48px`, padding `0 24px` | `fit-content` |
| **900** | `56×75px` | `48px` | `fit-content` |
| **620** | `48×64px` | `48px` | `100%` |
| **375** | `48×64px` | `48px` | `100%` |

```css
.nx-dash .nx-split{
  display:grid; grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);
  gap:24px; align-items:start; margin-top:32px;
}
.nx-dash .nx-stack{display:flex; flex-direction:column; gap:16px;}
.nx-dash .nx-card--continue{padding:32px;}
.nx-dash .nx-cover{aspect-ratio:3/4; width:72px; border-radius:10px;}
.nx-dash .nx-progress{height:6px; background:var(--pm-surface-2); border-radius:999px;}
.nx-dash .nx-btn--primary{
  height:48px; padding:0 24px; border-radius:12px;
  background:var(--pm-accent); color:var(--pm-surface);
  font:700 14px var(--font-ui); border:0;
}
.nx-dash .nx-btn--ghost{
  height:44px; padding:0 16px; border-radius:10px;
  border:1px solid var(--pm-line); background:transparent; color:var(--pm-ink-2);
  font:700 14px var(--font-ui);
}
.nx-dash .nx-important-row{
  display:grid; grid-template-columns:72px minmax(0,1fr); gap:16px; align-items:center;
}
.nx-dash .nx-list-row{
  display:grid; grid-template-columns:44px minmax(0,1fr) 96px; gap:12px;
  align-items:center; min-height:64px; padding:12px 0;
  border-bottom:1px solid var(--pm-line);
}
.nx-dash .nx-list-row:last-child{border-bottom:0;}
.nx-dash .nx-status-line{
  display:flex; align-items:center; justify-content:space-between;
  gap:8px; min-height:44px;
}
@media (max-width:900px){
  .nx-dash .nx-split{grid-template-columns:minmax(0,1fr); gap:24px;}
  .nx-dash .nx-cover{width:56px;}
}
@media (max-width:620px){
  .nx-dash .nx-split{margin-top:24px;}
  .nx-dash .nx-card--continue{padding:20px;}
  .nx-dash .nx-cover{width:48px;}
  .nx-dash .nx-btn--primary,.nx-dash .nx-btn--ghost{width:100%; justify-content:center;}
}
@media (max-width:375px){
  .nx-dash .nx-list-row{grid-template-columns:40px minmax(0,1fr);}
  .nx-dash .nx-list-row .nx-progress{display:none;}  /* tor ekranda bar yashiriladi */
}
```

---

## D5 — O'chiriladi / pastlashtiriladi (qat'iy qarorlar)

| Element | Qaror | Sabab |
|---|---|---|
| Hero `Ring 80px` + `JORIY KITOB PROGRESSI` (ALL CAPS) | **O'chiriladi (0px)** | `Davom ettirish` dagi 6px bar bilan duplikatsiya; ikkinchi doira e'tiborni bo'ladi |
| Hero 3 ta rangli chip (amber/green/blue) | **Neutralizatsiya** — `--pm-surface-2`, streakda 6px brass nuqta | rang byudjeti 2 tagacha |
| Hero dual gradient + 1.5px border | **Bitta past kontrastli gradient, border yo'q** | "kartalar to'lgan" muammosi |
| `KUNLIK HALQA` ALL CAPS eyebrow | **`12px` sentence-case `--pm-accent`** | ALL CAPS taqiqlangan |
| `.todo-row` ichki border + fon | **O'chiriladi** → 1px hairline ajratgich | karta ichidagi karta |
| `.qaction` border + blue/yellow/purple tone | **O'chiriladi** → `--pm-surface-2` yuzasi | ranglar ko'pligi |
| `.stat` border + ALL CAPS label + icon ustida | **O'chiriladi** → inline icon, `12px` sentence-case | o'qiluvchanlik |
| `Batafsil` / `Barchasi` / `0/3 bajarildi` chip | **Oddiy matn link/matn** | chip soni kamayadi |
| AI holati: 40px binafsha icon + status chip + keng tugma | **O'chiriladi** → status matn + text link | eng past vazn |
| Oxirgi faoliyat: 5 qator + 36px rangli icon + header chip | **3 qatorgacha qisqartiriladi**, icon `24px` neutral | eng past vazn |
| Barcha kartalarda hover `translateY(-2px)` + `shadow-pop` | **O'chiriladi** — faqat background o'zgarishi | sokin, premium harakat |
| `.page` dagi 2 ta radial gradient | **O'chiriladi** — gradient faqat hero'da | spec qoidasi |

---

## Breakpoint wireframes

### 1440 (content 1104px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ HERO 184px · [🦊56] Salom, o'quvchi 🦊 (40) · sub 16 · 3 neutral chip      │
│              (o'ng bo'sh — ring yo'q)                                    │
└──────────────────────────────────────────────────────────────────────────┘
   ↕ 32px
┌──────────────────┬──────────────────┬──────────────────┐
│ Bugungi reja 352 │ Tezkor amallar   │ Umumiy k.'lar    │
│ eyebrow 12       │ 352px            │ 352px            │
│ h3 20  [0/3 matn]│ ┌────┬────┐      │ ┌─────┬─────┐    │
│ ──────────────── │ │icon│icon│      │ │ 1   │ 0   │    │
│ ▸ icon ▸ matn ▸✓ │ │titl│titl│      │ │kitob│bob  │    │
│ ──────────────── │ │sub │sub │      │ ├─────┼─────┤    │
│ ▸ icon ▸ matn ▸✓ │ └────┴────┘      │ │ —   │ 0   │    │
│ ──────────────── │ ┌────┬────┐      │ │quiz │qo'll│    │
│ ▸ icon ▸ matn ▸○ │ │icon│icon│      │ └─────┴─────┘    │
│                  │ └────┴────┘      │ Batafsil →       │
└──────────────────┴──────────────────┴──────────────────┘
   ↕ 32px
┌─────────────────────────────────┬──────────────────────┐
│ DAVOM ETTIRISH 664 (padding 32) │ AI HOLATI 416         │
│ [muqova72×96] Kitob nomi (20)   │ Gemini · tayyor      │
│ ▬▬▬▬▬▬▬▬▬ 0%                   │ Kalit kiritilmagan   │
│ [ O'qishni davom ettir → ]      │ AI sozlamalari →     │
│ ─────────────────────────────── │ ──────────────────── │
│ BUGUNGI VAZIYAT (padding 24)    │ OXIRGI FAOLIYAT      │
│ Vaziyat matni 16px              │ ✓ Qoida 1 · Bugun    │
│ [ O'z javobimni topaman ]       │ ✓ Qoida 2 · Kecha    │
│ Barcha vaziyatlar →             │ ✓ Qoida 3 · 21.11    │
│ ─────────────────────────────── │                      │
│ KUTUBXONAM (5 qator)            │                      │
│ [44] Nom · 0/4 bob ▬ 0%  ›      │                      │
└─────────────────────────────────┴──────────────────────┘
```

### 900 (content 804px)

```
┌────────────────────────────────────────────────────────┐
│ HERO 160px · [🦊56] Salom, o'quvchi 🦊 (30) · chips     │
└────────────────────────────────────────────────────────┘
   ↕ 32
┌───────────────────────┬───────────────────────┐
│ Bugungi reja 390      │ Tezkor amallar 390    │
│ 3 ta 64px qator       │ 2×2 · 165×112         │
└───────────────────────┴───────────────────────┘
┌────────────────────────────────────────────────────────┐
│ Umumiy ko'rsatkichlar 804 · 4 stat × 180px × 88px      │
└────────────────────────────────────────────────────────┘
   ↕ 32
┌────────────────────────────────────────────────────────┐
│ DAVOM ETTIRISH (muqova 56×75, CTA 48 fit-content)      │
│ BUGUNGI VAZIYAT                                        │
│ KUTUBXONAM                                             │
│ AI HOLATI                                              │
│ OXIRGI FAOLIYAT (3 qator)                              │
└────────────────────────────────────────────────────────┘
```

### 620 (content 572px)

```
┌────────────────────────────────────────────┐
│ HERO 216px · [🦊48] Salom… (30) · chips 2 qator│
└────────────────────────────────────────────┘
   ↕ 24
┌────────────────────────────────────────────┐
│ Bugungi reja 572 · 3 × 64px                │
├────────────────────────────────────────────┤ 16
│ Tezkor amallar 572 · 2×2 · 260×112         │
├────────────────────────────────────────────┤ 16
│ Umumiy ko'rsatkichlar · 2×2 · 260×88       │
└────────────────────────────────────────────┘
   ↕ 24
┌────────────────────────────────────────────┐
│ DAVOM ETTIRISH · muqova 48×64 · CTA 100%   │
│ BUGUNGI VAZIYAT · ghost 44px 100%          │
│ KUTUBXONAM · 5 qator                       │
│ AI HOLATI · 1 qator status                 │
│ OXIRGI FAOLIYAT · 3 qator                  │
└────────────────────────────────────────────┘
```

### 375 (content 335px)

```
┌──────────────────────────────────┐
│ HERO 240px · [🦊40] Salom… (24)  │
│ sub 14px (3 qator)               │
│ [• streak] [bob] [quiz]          │
└──────────────────────────────────┘
   ↕ 24
┌──────────────────────────────────┐
│ Bugungi reja 335 · 3 × 64px      │
├──────────────────────────────────┤ 16
│ Tezkor amallar · 4 × 64px        │
│ [icon] Kitob qo'shish            │
│ [icon] Takrorlash                │
│ [icon] Quiz ishlash              │
│ [icon] Vaziyatni sinash          │
├──────────────────────────────────┤ 16
│ Umumiy ko'rsatkichlar · 2×2 141px│
└──────────────────────────────────┘
   ↕ 24
┌──────────────────────────────────┐
│ DAVOM ETTIRISH · muqova 48×64    │
│ [ O'qishni davom ettir   ] 48px  │
│ BUGUNGI VAZIYAT                  │
│ KUTUBXONAM (bar yashirilgan)     │
│ AI HOLATI                        │
│ OXIRGI FAOLIYAT (3 qator)        │
└──────────────────────────────────┘
```

---

## Xulosalar / xavflar

- **Findings:** screenshot dagi asosiy muammo — hero "karta + ring + 3 rangli chip" bilan
  ikkinchi e'tibor markazi yaratadi; keyin 3 ta karta ichida yana 10+ ta borderli karta/chip bor.
  Qarorlar ularni hairline va `--pm-surface-2` yuzalari bilan almashtirib, bitta CTA ni qoldiradi.
- **Risks:** (1) `.nx-dash` root klassi taklif qilingan — implementator uni mavjud `.page`
  wrapper'iga bog'lashi kerak (TSX ga tegish shart emas); (2) `375` da tezkor amallar 1 ustunga
  o'tadi — bu 4 ta qator qo'shadi, lekin 137px kenglikda matn ezilmaydi; (3) `Davom ettirish`
  muqovasi `72×96` — `Cover` komponentining `variant="sm"` o'lchami bilan moslashtirilishi kerak.
- **Verification:** har bir breakpoint uchun `1440 / 900 / 620 / 375` da hero balandligi, top-grid
  ustunlari (`3/2/1/1`), stat grid (`2/4/2/2`), qaction grid (`2/2/2/1`), split (`2/1/1/1`) va
  gorizontal oqish yo'qligi yuqoridagi jadvaldan tekshiriladi. Ring butun sahifada mavjud emasligi,
  ALL CAPS label qolmagani va bitta primary CTA borligi alohida tekshiriladi.
