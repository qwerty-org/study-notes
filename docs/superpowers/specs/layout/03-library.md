# L03 — Library layout decisions (1440 / 900 / 620 / 375)

Agent: L03, LAYOUT DECISION ARCHITECT. This document decides **placement and size only**.
No implementation file is touched. All colour/shadow/radius/type tokens are `--pm-*`
(`premium/00-tokens.css`); geometry is literal px snapped to the 8px grid
(`--pm-s-1…--pm-s-8` = 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80).

Source of truth: `docs/superpowers/specs/2026-11-23-premium-design-system.md`,
`apps/desktop/src/pages/Library.tsx`, `apps/desktop/src/styles/nx/library.css`,
`premium/00-tokens.css`, `nx/foundation.css`, screenshot `shots/after-library.png`.

---

## 0. Container geometry (fixed input, not a decision)

`.nx-page--wide` has `max-width:none`; padding comes from `nx/foundation.css`.
Content width = viewport − 2 × page padding.

| Breakpoint | Page padding (L/R) | Page padding top | Page padding bottom | **Content width** |
|---|---|---|---|---|
| 1440 | 48 (`--pm-s-6`) | 48 (`--pm-s-6`) | 96 (2 × `--pm-s-6`) | **1344** |
| 900 | 20 (keep foundation, ≤900) | 20 | 64 (`--pm-s-7`) | **860** |
| 620 | 16 (`--pm-s-3`) | 20 | 64 (`--pm-s-7`) | **588** |
| 375 | 12 (foundation ≤420) | 20 | 64 (`--pm-s-7`) | **351** |

Vertical rhythm between blocks (all breakpoints): header → stats **32**,
stats → dropzone **32**, dropzone → section head **32**, section head → filter row **24**,
filter row → grid **24**. Within a block: 8 (icon↔text), 12 (label↔value is 8;
hint↔note is 12), 16 (control groups), 24 (cards).

---

## 1. DECISION — Page header + primary action

**Decision: one left-aligned editorial title block; the single primary CTA sits in the
same row, vertically centred against the whole block, right-aligned. It is the only
primary control on screen. Eyebrow is sentence case (no ALL CAPS).**

| Value | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Eyebrow size / weight / line / tracking | 12 / 700 / 16 / 0.08em | same | same | same |
| Eyebrow → title gap | 12 | 12 | 12 | 12 |
| Title size / line / tracking | 40 / 44 / −0.035em | 40 / 44 | 30 / 33 | 30 / 33 |
| Title → subtitle gap | 12 | 12 | 12 | 12 |
| Subtitle size / line / measure | 16 / 24 / 66ch (≈528) | same | same | 16 / 24 / full width |
| Header → stats gap | 32 | 32 | 32 | 32 |
| Header layout | row | row | column | column |
| CTA placement | right, centre | right, centre | below subtitle, left | below subtitle, full width |
| CTA size | 48 h, 0 24 pad, r12, 14/700 | same | 48 h, min-w 208 | 48 h, w 351 (100%) |
| Header block height (≈) | 132 | 132 | 145 | 145 |

```css
.nx-library .nx-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--pm-s-4); margin-bottom: var(--pm-s-5);
}
.nx-library .nx-head > div:first-child { min-width: 0; }
.nx-library .nx-eyebrow {
  display: block; margin-bottom: var(--pm-s-2);
  font-size: var(--pm-fs-12); font-weight: 700; line-height: 16px;
  letter-spacing: .08em; text-transform: none; color: var(--pm-accent);
}
.nx-library .nx-eyebrow::before { width: 20px; height: 2px; }
.nx-library .nx-title {
  font: 600 var(--pm-fs-40)/1.1 var(--pm-font-display);
  letter-spacing: -.035em; color: var(--pm-ink);
}
.nx-library .nx-subtitle {
  margin-top: var(--pm-s-2); max-width: 66ch;
  font-size: var(--pm-fs-16); line-height: 1.5; color: var(--pm-ink-2);
}
.nx-library .nx-head__actions { flex: 0 0 auto; align-items: center; }
.nx-library .nx-head__actions .nx-btn--lg {
  height: 48px; min-height: 48px; padding: 0 var(--pm-s-4);
  border-radius: 12px; font-size: var(--pm-fs-14); font-weight: 700;
}
@media (max-width: 620px) {
  .nx-library .nx-head { flex-direction: column; align-items: stretch; gap: var(--pm-s-4); }
  .nx-library .nx-title { font-size: var(--pm-fs-30); line-height: 1.1; }
  .nx-library .nx-head__actions { justify-content: flex-start; }
  .nx-library .nx-head__actions .nx-btn--lg { min-width: 208px; }
}
@media (max-width: 420px) {
  .nx-library .nx-head__actions .nx-btn--lg { width: 100%; }
}
```

---

## 2. DECISION — The 4 statistics: NOT cards. One quiet inline statistic row.

**Decision: drop all four card frames (border, radius, surface, shadow), drop the four
toned icons, and render one border-divided inline row of label + number. Neutral ink
only — no accent/success/warn colouring.**

| Value | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Columns | 4 × 336 | 4 × 215 | 4 × 147 | 2 × 175 |
| Row height | 80 | 80 | 80 | 160 (2 × 80) |
| Cell padding | 12 / 24 | 12 / 16 | 12 / 16 | 12 / 16 |
| Divider | 1px `--pm-line` left of items 2–4 | same | same | left on even items, top on items 3–4 |
| Label | 13 / 16 / 600 `--pm-ink-2` | same | same | same |
| Label → value gap | 8 | 8 | 8 | 8 |
| Value | 30 / 30 Fraunces 600, `tabular-nums`, `--pm-ink` | same | same | same |
| Icons | hidden | hidden | hidden | hidden |
| Row → dropzone gap | 32 | 32 | 32 | 32 |

Width math: 1344/4=336; (860)/4=215; (588)/4=147; (351)/2=175.5 ≈ 175.

```css
.nx-library-stats {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0; margin-bottom: var(--pm-s-5);
}
.nx-library-stats .nx-stat {
  height: 80px; padding: 12px var(--pm-s-4);
  border: 0; border-left: 1px solid var(--pm-line); border-radius: 0;
  background: none; box-shadow: none;
}
.nx-library-stats .nx-stat:first-child { border-left: 0; padding-left: 0; }
.nx-library-stats .nx-stat__top { display: block; }
.nx-library-stats .nx-stat__icon { display: none; }
.nx-library-stats .nx-stat__label {
  font-size: var(--pm-fs-13); font-weight: 600; line-height: 16px;
  color: var(--pm-ink-2);
}
.nx-library-stats .nx-stat__value {
  margin-top: var(--pm-s-1);
  font: 600 var(--pm-fs-30)/1 var(--pm-font-display);
  font-variant-numeric: tabular-nums; color: var(--pm-ink);
}
.nx-library-stats .nx-stat--accent .nx-stat__value,
.nx-library-stats .nx-stat--success .nx-stat__value,
.nx-library-stats .nx-stat--warn .nx-stat__value { color: var(--pm-ink); }
@media (max-width: 900px) {
  .nx-library-stats .nx-stat { padding: 12px var(--pm-s-3); }
}
@media (max-width: 420px) {
  .nx-library-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .nx-library-stats .nx-stat { border-top: 1px solid var(--pm-line); }
  .nx-library-stats .nx-stat:nth-child(-n+2) { border-top: 0; }
  .nx-library-stats .nx-stat:nth-child(odd) { border-left: 0; padding-left: 0; }
}
```

---

## 3. DECISION — Dropzone: quiet white import strip, NOT a dashed box

**Decision: remove the dashed border and the double gradient. One white surface with
`--pm-shadow-1`, radius 16, 96px high on wide screens. Icon left, copy left, secondary
button right. Drag-active = accent-soft fill + 2px inset accent ring, no scale.**

| Value | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Width | 1344 | 860 | 588 | 351 |
| Height | 96 | 96 | 96 | 172 (natural) |
| Padding | 0 / 32 | 0 / 24 | 0 / 24 | 24 / 16 |
| Icon→copy gap / copy→button gap | 24 / 24 | 16 / 16 | 16 / 16 | 12 (grid row gap 16) |
| Icon box | 48 × 48, r10 | same | same | 48 × 48 r10 |
| Copy title | 18 / 23 Fraunces 600, left | 18 / 23 | 18 / 23 | 16 / 21 |
| Copy sub | 13 / 18 `--pm-ink-2`, max 72ch | same | same | 13 / 18, wraps 2 lines |
| Button | 44 h, 0 24 pad, r10, secondary | same | same | 48 h, full width, row 2 |
| Note below | 12 `--pm-ink-3`, 14px icon, gap 8, margin-top 12, left 32 | left 24 | left 24 | left 0 |
| Strip → note → section gap | 12 then 32 | 12 then 32 | 12 then 32 | 12 then 32 |

375 layout is a 2-row grid: row 1 = `[48px icon][copy]`, row 2 = full-width button.
Height proof: 24 + 65 (copy) + 12 + 48 + 24 = 173 → declared 172.

```css
.nx-dropzone-wrapper { margin-bottom: var(--pm-s-5); }
.nx-dropzone {
  display: flex; align-items: center; gap: var(--pm-s-4);
  min-height: 96px; padding: 0 var(--pm-s-5);
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface); box-shadow: var(--pm-shadow-1);
  transition: background .16s ease, box-shadow .16s ease;
}
.nx-dropzone.is-over {
  background: var(--pm-accent-soft);
  box-shadow: inset 0 0 0 2px var(--pm-accent);
  transform: none;
}
.nx-dropzone:focus-visible {
  outline: 2px solid var(--pm-accent); outline-offset: 3px;
  box-shadow: var(--pm-shadow-focus);
}
.nx-dropzone__icon {
  display: grid; place-items: center; flex: 0 0 48px;
  width: 48px; height: 48px; border-radius: var(--pm-r-sm);
  background: var(--pm-accent-soft); color: var(--pm-accent);
}
.nx-dropzone__copy { display: flex; flex-direction: column; gap: var(--pm-s-1); flex: 1; min-width: 0; }
.nx-dropzone__copy b {
  font: 600 var(--pm-fs-18)/1.3 var(--pm-font-display); color: var(--pm-ink);
}
.nx-dropzone__copy span {
  max-width: 72ch; font-size: var(--pm-fs-13); line-height: 1.4; color: var(--pm-ink-2);
}
.nx-dropzone__pick {
  flex: 0 0 auto; align-self: center;
  height: 44px; padding: 0 var(--pm-s-4); border: 1px solid var(--pm-line);
  border-radius: 10px; background: transparent; color: var(--pm-ink-2);
  font-size: var(--pm-fs-14); font-weight: 700;
}
.nx-dropzone__note {
  display: flex; align-items: center; gap: var(--pm-s-1);
  margin-top: var(--pm-s-2); padding-left: var(--pm-s-5);
  font-size: var(--pm-fs-12); color: var(--pm-ink-3);
}
@media (max-width: 900px) {
  .nx-dropzone { padding: 0 var(--pm-s-4); gap: var(--pm-s-3); }
  .nx-dropzone__note { padding-left: var(--pm-s-4); }
}
@media (max-width: 420px) {
  .nx-dropzone {
    display: grid; grid-template-columns: 48px minmax(0, 1fr);
    gap: var(--pm-s-3) var(--pm-s-2); padding: var(--pm-s-4) var(--pm-s-3);
  }
  .nx-dropzone__icon { grid-column: 1; grid-row: 1; }
  .nx-dropzone__copy { grid-column: 2; grid-row: 1; }
  .nx-dropzone__copy b { font-size: var(--pm-fs-16); }
  .nx-dropzone__pick { grid-column: 1 / -1; grid-row: 2; width: 100%; height: 48px; }
  .nx-dropzone__note { padding-left: 0; }
}
```

---

## 4. DECISION — Search / view toggle / filters

**Decision: two rows, never three. Row A = section title + search + view toggle.
Row B = filter row directly above the grid as a plain text tab bar with one full-width
bottom rule (no segmented pill container). View toggle is two bare icon buttons; the
active one gets an accent-soft square. Filters scroll horizontally on small screens.**

| Value | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Section title | 20 / 24 Fraunces 600 | same | same | same |
| Search width × height | 248 × 40 | 248 × 40 | flex 1 (min 180) × 40 | flex 1 (min 0, ≈267) × 40 |
| Search ↔ toggle gap | 16 | 16 | 12 | 8 |
| View toggle | 80 × 36 (2 × 36, gap 8) | same | same | same |
| Row A → Row B gap | 24 | 24 | 24 | 24 |
| Filter bar height | 40 | 40 | 40 | 40 |
| Filter item gap | 24 | 24 | 24 (scroll) | 24 (scroll) |
| Filter text | 14 / 600, inactive `--pm-ink-3`, active `--pm-ink` | same | same | same |
| Active marker | 2px `--pm-accent` bottom rule | same | same | same |
| Filter row → grid gap | 24 | 24 | 24 | 24 |

Filters live **between** the section head and the grid; they never sit inside a card
and never wrap to two lines.

```css
.nx-library .nx-section-head { align-items: center; margin-bottom: var(--pm-s-4); }
.nx-library .nx-section-head .nx-h2 {
  font: 600 var(--pm-fs-20)/1.2 var(--pm-font-display);
  letter-spacing: -.02em; color: var(--pm-ink);
}
.nx-library .nx-section-head .nx-hint {
  margin-top: var(--pm-s-1); font-size: var(--pm-fs-13); color: var(--pm-ink-3);
}
.nx-library .nx-section-head > .nx-row { gap: var(--pm-s-3); align-items: center; }
.nx-search-wrap { width: 248px; }
.nx-library .nx-input--with-icon { height: 40px; min-height: 40px; }
.nx-library .nx-segmented.nx-library__view {
  display: flex; gap: var(--pm-s-1); padding: 0;
  border: 0; border-radius: 0; background: none;
}
.nx-library .nx-library__view button {
  width: 36px; height: 36px; min-height: 36px; padding: 0;
  border: 1px solid transparent; border-radius: 10px;
  background: transparent; color: var(--pm-ink-3);
}
.nx-library .nx-library__view button[aria-pressed='true'] {
  border-color: var(--pm-line);
  background: var(--pm-accent-soft); color: var(--pm-accent);
}
.nx-filter-row.nx-segmented {
  display: flex; align-items: stretch; gap: var(--pm-s-4);
  height: 40px; padding: 0; margin-bottom: var(--pm-s-4);
  border: 0; border-bottom: 1px solid var(--pm-line); border-radius: 0;
  background: none; overflow-x: auto; overflow-y: hidden;
}
.nx-filter-row button {
  position: relative; flex: 0 0 auto; min-height: 40px;
  padding: 0 0 12px; border: 0; border-radius: 0; background: none;
  font-size: var(--pm-fs-14); font-weight: 600;
  color: var(--pm-ink-3); white-space: nowrap;
}
.nx-filter-row button[aria-pressed='true'] { color: var(--pm-ink); }
.nx-filter-row button[aria-pressed='true']::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -1px;
  height: 2px; background: var(--pm-accent);
}
@media (max-width: 620px) {
  .nx-library .nx-section-head { flex-direction: column; align-items: stretch; gap: var(--pm-s-3); }
  .nx-library .nx-section-head > .nx-row { width: 100%; }
  .nx-search-wrap { flex: 1 1 180px; min-width: 0; width: auto; }
}
@media (max-width: 420px) {
  .nx-library .nx-section-head > .nx-row { gap: var(--pm-s-1); }
}
```

---

## 5. DECISION — Book grid

**Decision: fixed column counts (no `auto-fill`), 24px gap on desktop / 16px below 620.
Cards keep a surface + `--pm-shadow-1` but lose their border. Cover uses a 3:2 ratio,
not a fixed 160px. The add-book tile is the last in-grid cell, quiet `--pm-surface-2`,
no dashed frame. Empty state replaces the grid, left-aligned.**

| Value | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Columns | 4 | 3 | 2 | 1 |
| Column width | 318 | 271 | 286 | 351 |
| Gap | 24 | 24 | 16 | 16 |
| Card height (fixed) | 384 | 360 | 368 | 412 |
| Cover (3:2) | 318 × 212 | 271 × 181 | 286 × 191 | 351 × 234 |
| Cover padding | 24 | 24 | 16 | 16 |
| Body padding | 24 | 24 | 16 | 16 |
| Body gap | 12 | 12 | 12 | 12 |
| Title / author | 16 / 22, 13 / 18 | same | same | same |
| Add tile | last cell, 318 × 384, `--pm-surface-2`, r16 | 271 × 360 | 286 × 368 | 351 × 412 |
| Empty state | left, padding 48 / 0, margin-top 32, icon 48 | same | same | padding 32 / 0 |

Width proof: 1344−3·24=1272→318; 860−2·24=812→270.7≈271; 588−16=572→286; 351.

```css
.nx-book-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--pm-s-4); align-items: stretch;
}
.nx-book-card {
  height: 384px; display: flex; flex-direction: column;
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface); box-shadow: var(--pm-shadow-1);
  overflow: hidden; cursor: pointer;
}
.nx-book-cover {
  position: relative; aspect-ratio: 3 / 2; height: auto; flex: 0 0 auto;
  padding: var(--pm-s-4); display: flex; flex-direction: column; justify-content: flex-end;
  isolation: isolate; overflow: hidden;
}
.nx-book-card__body {
  display: flex; flex-direction: column; gap: var(--pm-s-2);
  flex: 1; padding: var(--pm-s-4);
}
.nx-book-card__title { font-size: var(--pm-fs-16); line-height: 1.35; }
.nx-book-card__author { font-size: var(--pm-fs-13); }
.nx-book-card__progress { margin-top: auto; padding-top: var(--pm-s-1); }
.nx-book-add {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--pm-s-1); height: 384px;
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface-2); color: var(--pm-ink-2);
  font-family: inherit; cursor: pointer;
}
.nx-book-add__icon {
  display: grid; place-items: center; width: 48px; height: 48px;
  border-radius: var(--pm-r-sm); background: var(--pm-surface);
}
.nx-book-add b { font: 600 var(--pm-fs-16)/1.3 var(--pm-font-display); color: var(--pm-ink); }
.nx-book-add small { font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-library .nx-empty {
  margin-top: var(--pm-s-5); padding: var(--pm-s-6) 0; text-align: left;
}
.nx-library .nx-empty__icon { width: 48px; height: 48px; }
.nx-library .nx-empty p { max-width: 48ch; font-size: var(--pm-fs-14); }
/* List view */
.nx-book-grid--list { grid-template-columns: 1fr; gap: var(--pm-s-2); }
.nx-book-grid--list .nx-book-card { height: 104px; flex-direction: row; align-items: center; }
.nx-book-grid--list .nx-book-cover {
  aspect-ratio: auto; width: 144px; height: 96px; padding: var(--pm-s-3);
}
.nx-book-grid--list .nx-book-add { height: 104px; flex-direction: row; gap: var(--pm-s-3); }
@media (max-width: 900px) {
  .nx-book-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .nx-book-card, .nx-book-add { height: 360px; }
}
@media (max-width: 620px) {
  .nx-book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-3); }
  .nx-book-card, .nx-book-add { height: 368px; }
  .nx-book-cover, .nx-book-card__body { padding: var(--pm-s-3); }
  .nx-book-grid--list .nx-book-card { height: 96px; }
  .nx-book-grid--list .nx-book-cover { width: 96px; height: 64px; padding: var(--pm-s-2); }
}
@media (max-width: 420px) {
  .nx-book-grid { grid-template-columns: 1fr; gap: var(--pm-s-3); }
  .nx-book-card, .nx-book-add { height: 412px; }
  .nx-library .nx-empty { padding: var(--pm-s-5) 0; }
}
```

---

## 6. DECISION — Container count reduction (final list)

| Element | Before | **Decision** | Frames removed |
|---|---|---|---|
| 4 stat cards | 4 × border+radius+shadow+white | **1 inline row, 0 cards**, dividers only | 4 |
| Stat icons | 4 toned icons | **hidden** | 4 decorations / 3 colours |
| Dropzone | dashed 1.5px border + 2 gradients | **1 white band, shadow-1, r16, no border** | 1 border, 2 gradients |
| Filter row | filled segmented pill container | **plain text tab bar + bottom rule** | 1 |
| View toggle | filled segmented pill container | **2 bare icon buttons** | 1 |
| Book card | border + shadow | **shadow only** | 1 border per card |
| Add-book tile | dashed 1.5px border | **surface-2 fill, no border** | 1 border |
| Eyebrow | ALL CAPS, 11px, 0.16em | **sentence case, 12px, 0.08em** | — |

Colour budget after decisions: `--pm-ink` + `--pm-accent` only, with `--pm-sage` /
`--pm-brass` absent outside semantic chips on a book card. Focus rings and
`prefers-reduced-motion` overrides stay intact (only `transform` is removed from the
drag-active state).

---

## 7. ASCII wireframes

### 1440 — content 1344 (x = 48…1392)

```
┌───────────────────────────────── top nav ─────────────────────────────────────────┐
└───────────────────────────────────────────────────────────────────────────────────┘
   48                                                                          1392
   ─ Shaxsiy to'plam                                          ┌───────────────────┐
   Kutubxonang  40/44                                        │ + Kitob qo'shish  │ 48
   Kitob qo'shing, AI tahlil qiling va bilimni hayotda        └───────────────────┘
   qo'llang. Hamma ma'lumot shu qurilmada.  16/24, 66ch
   ─────────────────────────────────────────────────────────────── 32 ──────────────
   Jami kitoblar │ O'qilmoqda │ Tugatilgan │ Tahlil kutyapti                   80
        1              0            0               0
   ─────────────────────────────────────────────────────────────── 32 ──────────────
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │  ▣  Kitoblarni bu yerga tashlang                    ┌───────────────────┐  │ 96
   │     Bir nechta faylni bir vaqtning o'zida … .md     │ Fayl tanlash      │  │
   │                                                    └───────────────────┘  │
   └─────────────────────────────────────────────────────────────────────────────┘
      ⓘ PDF va EPUB konvertatsiyasi keyingi bosqichda…
   ─────────────────────────────────────────────────────────────── 32 ──────────────
   Kitoblar                              ┌──────────────────┐ ┌────┬────┐
                                         │ 🔍 Sarlavha… 248 │ │ ▦  │ ☰  │  40
                                         └──────────────────┘ └────┴────┘
   Barchasi·1   O'qilmoqda·0   Tugatilgan·0   Tahlil kutyapti·0 ─────────────  40
   ─────────────────────────────────────────────────────────────── 24 ──────────────
   ┌────318───┐ ┌────318───┐ ┌────318───┐ ┌────318───┐
   │  cover   │ │  cover   │ │  cover   │ │    +     │
   │   3:2    │ │   3:2    │ │   3:2    │ │ Yana     │  384
   │  212     │ │  212     │ │  212     │ │ kitob    │
   ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
   │ chips    │ │ chips    │ │ chips    │ │          │
   │ title    │ │ title    │ │ title    │ │          │
   │ ▬▬ 100%  │ │ ▬▬  0%   │ │ ▬▬  0%   │ │          │
   └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### 900 — content 860 (x = 20…880)

```
   ─ Shaxsiy to'plam                                       ┌──────────────────┐
   Kutubxonang  40/44                                     │ + Kitob qo'shish │
   Kitob qo'shing, AI tahlil qiling va bilimni…            └──────────────────┘
   ───────────────────────────────────────────────────────────── 32
   Jami kitoblar │ O'qilmoqda │ Tugatilgan │ Tahlil kutyapti          80 (4×215)
   ───────────────────────────────────────────────────────────── 32
   ┌──────────────────────────────────────────────────────────────────────────┐
   │ ▣  Kitoblarni bu yerga tashlang                [ Fayl tanlash ]         │ 96
   └──────────────────────────────────────────────────────────────────────────┘
      ⓘ PDF va EPUB …
   ───────────────────────────────────────────────────────────── 32
   Kitoblar                                [ 🔍 248 ] [ ▦ | ☰ ]
   Barchasi·1   O'qilmoqda·0   Tugatilgan·0   Tahlil kutyapti·0 ────
   ───────────────────────────────────────────────────────────── 24
   ┌────271───┐ ┌────271───┐ ┌────271───┐
   │ cover 181│ │ cover 181│ │    +     │  360
   ├──────────┤ ├──────────┤ ├──────────┤
   │ body     │ │ body     │ │          │
   └──────────┘ └──────────┘ └──────────┘
```

### 620 — content 588 (x = 16…604)

```
   ─ Shaxsiy to'plam
   Kutubxonang  30/33
   Kitob qo'shing, AI tahlil qiling va bilimni hayotda qo'llang.
   Hamma ma'lumot shu qurilmada.
   ┌────────────────────────┐                              208 × 48
   │ + Kitob qo'shish       │
   └────────────────────────┘
   ──────────────────────────────────────────────────────── 32
   Jami │ O'qilmoqda │ Tugatilgan │ Tahlil kutyapti          80 (4×147)
   ──────────────────────────────────────────────────────── 32
   ┌────────────────────────────────────────────────────────────┐
   │ ▣  Kitoblarni bu yerga tashlang         [ Fayl tanlash ]   │ 96
   │    Bir nechta faylni bir vaqtning…                         │
   └────────────────────────────────────────────────────────────┘
      ⓘ PDF va EPUB …
   ──────────────────────────────────────────────────────── 32
   Kitoblar
   ┌──────────────────────────────────┐ ┌────┬────┐
   │ 🔍 Sarlavha yoki muallif…        │ │ ▦  │ ☰  │            40
   └──────────────────────────────────┘ └────┴────┘
   Barchasi·1  O'qilmoqda·0  Tugatilgan·0  Tahlil kutyapti·0 →  (scroll) ─
   ──────────────────────────────────────────────────────── 24
   ┌─────286─────┐ ┌─────286─────┐
   │  cover 191  │ │      +      │  368
   ├─────────────┤ ├─────────────┤
   │ body / 16   │ │             │
   └─────────────┘ └─────────────┘
```

### 375 — content 351 (x = 12…363)

```
   ─ Shaxsiy to'plam
   Kutubxonang  30/33
   Kitob qo'shing, AI tahlil qiling va bilimni hayotda
   qo'llang. Hamma ma'lumot shu qurilmada.
   ┌───────────────────────────────────────────────────┐
   │            + Kitob qo'shish                      │ 351 × 48
   └───────────────────────────────────────────────────┘
   ──────────────────────────────────────────────────── 32
   Jami kitoblar  │  O'qilmoqda                         80
   ────────────────────────────────────────────────────
        1         │      0
   Tugatilgan     │  Tahlil kutyapti                    80
        0         │      0
   ──────────────────────────────────────────────────── 32
   ┌───────────────────────────────────────────────────┐
   │ ▣   Kitoblarni bu yerga tashlang                  │
   │     Bir nechta faylni bir vaqtning o'zida…        │
   │     .md, .txt                                     │
   │ ┌───────────────────────────────────────────────┐ │ 172
   │ │              Fayl tanlash                    │ │
   │ └───────────────────────────────────────────────┘ │
   └───────────────────────────────────────────────────┘
     ⓘ PDF va EPUB konvertatsiyasi keyingi bosqichda…
   ──────────────────────────────────────────────────── 32
   Kitoblar
   ┌──────────────────────────────────┐ ┌────┬────┐
   │ 🔍 Sarlavha yoki muallif…        │ │ ▦  │ ☰  │   40
   └──────────────────────────────────┘ └────┴────┘
   Barchasi·1   O'qilmoqda·0   Tugatilgan·0 → (scroll) ───────
   ──────────────────────────────────────────────────── 24
   ┌───────────────────────────────────────────────────┐
   │  cover 351 × 234                                 │
   ├───────────────────────────────────────────────────┤  412
   │  chips / title / author / ▬▬ 100%                │
   └───────────────────────────────────────────────────┘
   ┌───────────────────────────────────────────────────┐
   │                    +                              │  412
   │            Yana kitob qo'shish                    │
   └───────────────────────────────────────────────────┘
```

---

## 8. Notes / risks for the CSS implementer & TSX owner

1. **Two primaries on the empty library** (header CTA + empty-state CTA). Layout rule:
   header CTA stays primary; the empty-state action must be rendered as a secondary
   (`nx-btn--soft`) button. That needs a TSX change in `Library.tsx` line ~319 — I did
   not edit it.
2. Uppercase cover author (`.nx-book-cover__author { text-transform: uppercase }`) and
   the eyebrow's uppercase violate the spec's "no ALL CAPS" rule; eyebrow is solved in
   CSS here, cover author belongs to the book-card owner.
3. The 4 book covers use hard-coded gradient hex colours in TSX; `--pm-*` tokens cannot
   reach them without a TSX change. Flagged, not changed (colour, not layout).
4. `nx-dropzone__pick` is a `<span role-less>` with `onClick`; keep keyboard access via
   the outer `role="button"` element, do not remove its focus ring.
5. No new token requested. All decisions use existing `--pm-*` tokens plus literal px
   that map to the 8px grid. `96px` = 2 × `--pm-s-6`; `172px` is the natural mobile
   dropzone height derived from 24 + 65 + 12 + 48 + 24.
