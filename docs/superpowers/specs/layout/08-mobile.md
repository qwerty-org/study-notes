# 08 — Mobile layout decisions (`≤620px`, `≤375px`)

> Agent L08 · LAYOUT DECISION ARCHITECT · Wave 3
> Source of truth: `docs/superpowers/specs/2026-11-23-premium-design-system.md`, `apps/desktop/src/styles/premium/00-tokens.css`
> Visual reference: `mobile-dashboard.png`, `mobile-book.png` (375×812)
> **This document is a decision record. No options are offered — the values below are binding.**
> CSS in §9 is paste-ready for `premium/02-topbar.css` and `premium/34-responsive.css` (loaded last in `premium/index.css`).

---

## 0. Non-negotiables

1. Every colour comes from `--pm-*`; no literal hex/rgb. Spacing uses the 8px grid / `--pm-s-*` tokens. The only sanctioned off-grid value is **20px mobile card padding** (design spec §3).
2. No `!important`. No new class names (all selectors below already exist in TSX). No TSX edits.
3. Single column everywhere below 620px. No side-by-side cards, no two-column shells, no floating sidebars — **the only exception is the deliberately paired 2-up grids listed in §5/§7/§8** (quick actions, stat tiles, book covers at 620).
4. One primary action per screen; on mobile it is always full-width and 48px tall.
5. Order on mobile = DOM order. No CSS `order` gymnastics across sibling containers.
6. `prefers-reduced-motion` and all focus rings stay intact.

---

## 1. Per-breakpoint rule table (exact px)

| Rule | 1440 (reference) | ≤ 900 | ≤ 620 | ≤ 375 |
|---|---|---|---|---|
| Topbar height | 72 | 72 | **64** | **56** |
| Topbar padding-inline | 32 (`--pm-s-5`) | 24 (`--pm-s-4`) | 16 (`--pm-s-3`) | **8 (`--pm-s-1`)** |
| Topbar column-gap | 24 (`--pm-s-4`) | 16 (`--pm-s-3`) | 12 (`--pm-s-2`) | **8 (`--pm-s-1`)** |
| Page padding-inline | 48 (`--pm-s-6`) | 32 (`--pm-s-5`) | **24 (`--pm-s-4`)** | **16 (`--pm-s-3`)** |
| Main padding-top (under fixed topbar) | 48 | 48 | **80 (`--pm-s-8`)** | **80 (`--pm-s-8`)** |
| Main padding-bottom | 96 | 96 | **64 (`--pm-s-7`)** | **64 (`--pm-s-7`)** |
| Card inner padding | 24 (`--pm-s-4`) | 24 | **20** (sanctioned) | **20** (sanctioned) |
| Large panel padding | 32 (`--pm-s-5`) | 32 | 20 | 20 |
| Card↔card gap | 24 (`--pm-s-4`) | 16 | **16 (`--pm-s-3`)** | **16 (`--pm-s-3`)** |
| Page title | 40 (`--pm-fs-40`) | 40 | **30 (`--pm-fs-30`)** | **24 (`--pm-fs-24`)** |
| Section title (`h3`, `.nx-h3`) | 20 (`--pm-fs-20`) | 20 | 18 (`--pm-fs-18`) | **18 (`--pm-fs-18`)** |
| Subtitle / secondary text | 16 / 14 | 16 / 14 | 14 (`--pm-fs-14`) | **13 (`--pm-fs-13`)** |
| Auxiliary (chips only) | 12 | 12 | 12 | **12 (`--pm-fs-12`)** — never below |
| Nav presentation | text + icon | text + icon | **icon only (44×44)** | **3 icons only (40×40)** |
| Streak chip in topbar | visible | visible | **hidden** | **hidden** |
| Window controls | 3×40 | 3×40 | 3×36 | **3×32, gap 8** |
| Dashboard top cards | 3 cols | 3 cols | **1 col** | **1 col** |
| Quick actions | 4 cols | 4 cols | **2 cols, gap 8** | **2 cols, gap 8, tile ≥104h** |
| Dashboard stats | 4 cols | 2 cols | **2 cols, gap 8** | **2 cols, gap 8** |
| Book hero | cover + info + action (3) | 2 rows | **1 col; cover 64 + info; action row spans** | same as ≤620 |
| Book tabs | all inline | all inline | **horizontal scroll, nowrap** | **horizontal scroll, 3 visible** |
| Reader side (TOC) | 256px sidebar | 220px sidebar | **inline block above article** | **inline block above article** |
| Settings layout | nav 240px + content | nav 200px + content | **nav strip on top + content** | same + hints hidden |
| Onboarding | aside 42% + card | aside hidden | **aside hidden, card full width** | same |
| Min tap target (content) | 44 | 44 | **44×44** | **44×44** |
| Min tap target (topbar chrome) | 44 | 44 | **40×40** | **40×40 icons / 36 avatar / 32 window** |

**8px-grid map:** `8→--pm-s-1`, `12→--pm-s-2`, `16→--pm-s-3`, `24→--pm-s-4`, `32→--pm-s-5`, `48→--pm-s-6`, `64→--pm-s-7`, `80→--pm-s-8`. Derived grid values: `20` (mobile card pad, §3), `40` (5×8 icon button), `56` (7×8 topbar), `88` (11×8 hero action ring row), `104` (13×8 action tile), `160` (20×8 cover block).

---

## 2. Topbar @375 — decision

**What stays visible, left→right:**
1. **Brand mark** — `.brand .mark` 32×32, radius `--pm-r-sm` (10px), `IconBookOpen` 16px. Wordmark `<b>Study Notes</b>` **hidden**. It remains the `Link to="/"` → this is how **Home** is reached.
2. **Three nav icons** — `Library`, `Repeat`, `Stats`. Each 40×40 with an 18px icon; `gap: 8`. `.nav-txt` hidden. `.nav-badge` (count `5`) stays **only** on Repeat, 16px circle, 11px digits, absolute top `-2` right `-2`.
   - Home (`href="/"`) and Settings (`href="/sozlamalar"`) nav items are **hidden** at ≤375.
3. **Avatar** — `.avatar-btn` 36×36 circle, 1px `--pm-line-strong` ring, emoji 20px. **Settings and theme are reached through the existing avatar popup** (`.popmenu` keeps its Settings link + theme segmented control).
4. **Window controls** — all three stay visible: 32×32 buttons, 16px glyphs, `gap: 8`, separated from the avatar by an 8px gap and a 1px `--pm-line` divider. They remain disabled outside Tauri.
5. **Streak chip hidden** (`.streak-chip{display:none}` at ≤620) — streak is preserved in the dashboard hero and Stats.

**How nav is reached at 375:** brand mark → Home; icon strip → Library / Repeat / Stats; avatar popup → Settings + theme. No hamburger, no second row, no bottom tab bar.

**Sizing budget check (375 = 359px content):**
`32 brand + 8 + 136 nav(3×40+2×8) + 8 + 36 avatar + 8 + 104 window(3×32+2×8) = 332px` → 27px slack. Fits without wrapping.

```
375 topbar wireframe (56px tall)
┌──────────────────────────────────────────────────────┐
│8px │32│8│ 40 8 40 8 40 │8│ 36 │8│ 32 8 32 8 32 │8px │
│    [▣]  [▤] [↻⁵] [▥]    [🦊] │ −  □  ×             │
└──────────────────────────────────────────────────────┘
 ▣ brand→Home   ▤ Library   ↻ Repeat(badge)   ▥ Stats
 🦊 avatar→popup{Settings, theme}   −□× window controls
```

---

## 3. Page shell: padding, header, hero stacking, card order

- `.main` / `.page`: `padding: 80px 16px 64px` at 375 (80px top clears the 56px fixed topbar with 24px breathing). At 620: `80px 24px 64px`.
- `.nx-head` and `.hero`: `display:flex; flex-direction:column; align-items:stretch; gap:16px`. The action block (`.nx-head__actions`) goes **below** the title block and becomes full-width.
- Title `.nx-title`, `.hero h1`, `.nx-book-hero__title`: **24px / 700 / line-height 1.2 / letter-spacing -0.035em** at 375; 30px at 620. Max 3 lines, then ellipsis.
- Subtitle `.nx-subtitle`, `.hero small`: **13px / `--pm-ink-2` / line-height 1.5** at 375 (14px at 620).
- Eyebrow `.nx-eyebrow`: 12px / 700 / `--pm-accent`, letter-spacing 0.08em, never uppercase.
- `.section-head`: `flex-wrap:wrap; gap:8px`; title 18px; chip drops to the next line only if it cannot fit.
- **Hero stacking:** `.profile-col` stays a row (avatar left, info right, `gap:12`, avatar 48×48 radius 12). `.hero-goal` moves to a **new full-width row below** with a 1px `--pm-line` top border, `padding-top:16px`, Ring 80px centred, caption 12px. Chip row wraps (`gap:8`).
- **Card stacking order (dashboard):** single column, DOM order, 16px gaps:
  `Hero → Bugungi reja → Tezkor amallar → Umumiy ko'rsatkichlar → Davom ettirish → Bugungi vaziyat → Kutubxonam → AI holati → Oxirgi faoliyat`.
  (Primary "Davom ettirish" CTA stays where it is in the DOM; no reordering — CSS-only safe.)

---

## 4. Dashboard @375

```
┌───────────────────────────────────────┐ 375 + 16px page pad
│ [▣][▤][↻5][▥]      [🦊]  − □ ×        │ topbar 56
├───────────────────────────────────────┤
│ ╭───────────────────────────────────╮ │ hero: pad20, r24
│ │[🦊] Salom, o'quvchi 🦊             │ │ 24/700
│ │    Bugun 5 ta takrorlash savoli…  │ │ 13px
│ │    [🔥 1 kunlik][📖 0 ta bob]      │ │ chips wrap, 28h
│ │    [Quiz boshlanmagan]            │ │
│ │  ───────────────────────────────  │ │ line
│ │            ╭───╮                 │ │
│ │            │0% │  Ring 80         │ │
│ │            ╰───╯                 │ │
│ │      JORIY KITOB PROGRESSI        │ │ 12px
│ ╰───────────────────────────────────╯ │
│ ╭───────────────────────────────────╮ │ card
│ │ Kunlik halqa       0/3 bajarildi  │ │ 18px + chip
│ │ Bugungi reja                      │ │
│ │ O'qish→takrorlash→qo'llash…       │ │ 13px
│ │ ┌───────────────────────────────┐ │ │
│ │ │[▤] Kitobni o'qish        [✓] │ │ │ todo-row ≥56
│ │ │    10 daqiqali odatlar…       │ │ │ 13px
│ │ └───────────────────────────────┘ │ │
│ │ [↻] Takrorlash               [✓] │ │
│ │ [💡] Hayotda qo'llash        [✓] │ │
│ ╰───────────────────────────────────╯ │
│ ╭───────────────────────────────────╮ │
│ │ Tezkor amallar                    │ │
│ │ ┌──────────┐ ┌──────────┐         │ │ 2 cols / gap8
│ │ │[▤] Kitob │ │[↻] Takror │         │ │ tile ≥104h
│ │ │ qo'shish │ │ lash      │         │ │
│ │ └──────────┘ └──────────┘         │ │
│ │ ┌──────────┐ ┌──────────┐         │ │
│ │ │[◎] Quiz  │ │[✦] AI     │         │ │
│ │ └──────────┘ └──────────┘         │ │
│ ╰───────────────────────────────────╯ │
│ ╭───────────────────────────────────╮ │
│ │ Umumiy ko'rsatkichlar    Batafsil │ │
│ │ ┌──────────┐ ┌──────────┐         │ │ stats 2 cols
│ │ │ 3 kitob  │ │ 4 bob    │         │ │
│ │ ├──────────┤ ├──────────┤         │ │
│ │ │ Quiz %   │ │ Qo'llanma│         │ │
│ │ └──────────┘ └──────────┘         │ │
│ ╰───────────────────────────────────╯ │
└───────────────────────────────────────┘
```

**Exact rules**
- Hero: `padding:20`, radius `--pm-r-lg` (24), `--pm-shadow-1`; `.profile-col` row gap 12; `.big-avatar` 48×48 radius 12. Chips 28px tall, padding `0 12`, font 12, radius pill. Ring 80px centred with 8px gap to caption.
- `.todo-row`: `min-height:56`, `padding:8px 12`, `gap:12`, radius `--pm-r-sm`, 1px `--pm-line`; `.t-icon` 40×40 radius 10; `.t-body b` 14/700; `.t-body small` 13/500 `--pm-ink-2`, one line with ellipsis; `.t-check` 24px circle (done: `--pm-sage`). Row itself is the tap target (56≥44).
- `.qactions`: `grid-template-columns:repeat(2,minmax(0,1fr)); gap:8`. `.qaction`: `min-height:104`, `padding:12`, radius 10, background `--pm-surface-2`, `align-items:flex-start`; icon 32px; title 14/700; sub 12px `--pm-ink-3`.
- `.grid-2` (stats): `repeat(2,minmax(0,1fr)); gap:8`; each `Stat` min-height 88, padding 12, value 24px Fraunces tabular, label 13px.
- `.split` and both `.stack`s: single column, `gap:16`. `.btn-lg`, `.btn-block`: 48px, full width, radius 12.
- `.book-row` in "Kutubxonam": hide the 96px inline progress bar at 375 (`display:none`); keep cover 40×56, title 14, sub 13, chevron 16.

---

## 5. Book @375

**Hero stacking decision:** 1 column. Cover sits left of the info block in a `64px | 1fr` grid; the whole action block spans both columns below and becomes `64px ring | 1fr primary`, with the ghost Quiz button on its own full-width line.

```
┌───────────────────────────────────────┐
│ [▣][▤][↻5][▥]      [🦊]  − □ ×        │
│ ‹ Kutubxonaga qaytish                 │ 44h back
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬   │ 4px progress
│ ╭───────────────────────────────────╮ │ hero pad20
│ │ [✨ Tahlil tayyor][MD][4 bob]     │ │ chips wrap 8
│ │ ╭───╮ 10 daqiqali odatlar:        │ │ cover 64×88
│ │ │10 │ kichik qadamlar bilan       │ │ title 24/700
│ │ │ani│ katta o'zgarish             │ │ 3 lines max
│ │ ╰───╯ Study Notes (demo) · 31.10  │ │ 13px
│ │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 0%   │ │ bar + % 13
│ │ ╭───╮ ╭─────────────────────────╮ │ │
│ │ │0% │ │  O'qishni boshlash  →   │ │ │ ring64 + 48h
│ │ ╰───╯ ╰─────────────────────────╯ │ │
│ │ ╭─────────────────────────────────╮│ │
│ │ │        Quiz ishlash            ││ │ 44h ghost
│ │ ╰─────────────────────────────────╯│ │
│ ╰───────────────────────────────────╯ │
│ │O'qish│ Xulosalar 12 │ Terminlar →  │ tabs scroll
│ ╭───────────────────────────────────╮ │
│ │ (0%) 0/4  bob o'qildi             │ │ side INLINE
│ │ [ ✓ Bobni tugattim ]             │ │ 48h full
│ │ BOBLAR                       4    │ │
│ │ ┌───────────────────────────────┐ │ │
│ │ │1  Odat nima va nima uchun…    │ │ │ 44h row
│ │ └───────────────────────────────┘ │ │
│ ╰───────────────────────────────────╯ │
│ [☰] Bob 1/4 · Odat nima…  [1/3 sahifa]│ toolbar row 1
│            [A−][Aa][A+][🪶][🔖]        │ toolbar row 2
│ ┌───────────────────────────────────┐ │
│ │ Matn 15–26px (reader setting)     │ │ article 66ch
│ │ line-height 1.6, padding 20       │ │
│ └───────────────────────────────────┘ │
│ [Oldingi]   hint 12px  [Keyingi →]    │ footer wrap
└───────────────────────────────────────┘
```

**Decisions**
- **Tab bar: horizontal scroll, never wrap.** `.nx-book-tabs{display:flex; flex-wrap:nowrap; overflow-x:auto; scroll-snap-type:x proximity; scrollbar-width:none; height:48}`; tabs `flex:0 0 auto; min-width:96; height:44; padding:0 12; font:13/600`; gap 8; active tab keeps the 2px `--pm-accent` underline. At 375 ≈3 tabs visible; `.nx-book-tab__soon` label hidden, disabled "AI ustoz" stays visible but muted. `scroll-padding-inline:16px` keeps the active tab fully in view.
- **Reader toolbar: wraps to exactly 2 rows.** Row 1: TOC toggle 40px → title (flex, truncate) → page chip 12px. Row 2: `A− / Aa / A+` + sepia + notes, right-aligned, each 40×40. Implemented with `flex-wrap:wrap` + `order` (see §9) — no DOM change.
- **Sidebar/TOC: INLINE, not a drawer.** The screenshot proves the reader side renders as a full-width card above the article at 375. `.nx-reader{display:flex; flex-direction:column}`; `.nx-reader-side` becomes an inline card (order unchanged: side → main → notes), padding 20, radius 16, margin-bottom 16. `.nx-toc` is a vertical list, `max-height:240; overflow-y:auto`, items ≥44px tall with 10px radius; clicking a chapter updates the reader in place. `.nx-reader-notes` also becomes an inline single-column block **below** the article. No off-canvas transform, no scrim, no TSX change.
- `.nx-reader-footer`: `flex-wrap:wrap`; buttons 44px min; hint `order:3; flex-basis:100%; text-align:center`.
- `.nx-quote-bar`: wraps; buttons move to a second full-width row.

---

## 6. Library / Repeat / Stats / Settings / Onboarding — column collapses & order

| Page | Desktop layout | ≤620 | ≤375 — element order |
|---|---|---|---|
| **Library** | head row; 4 stats; dropzone row; head+search/view; filter row; 4-col book grid | head→column; stats 2×2; dropzone column; search full + view right; filters scroll; books 2 cols | **head(block→button) → stats 2×2 → dropzone(icon 48, copy, full button) → "Kitoblar" + hint → search(full width) → view toggle(row, right) → filter row(scroll) → book grid 1 col → add card 1 col** |
| **Repeat** | head; 2-col (session card \| queue); schedule card | 1 col; session ring centred above info | **head → result banner(wrap, button full) → session card(ring 96 centred → eyebrow/title/subtitle → chips wrap → CTA full → keyboard hint 12) → queue rows(chip+text, overdue chip wraps to line 2) → schedule card(head → intro → intervals 5 across → caption → bar → foot)** |
| **Stats** | head; hero row; 4 stats; activity; journal; 2-col bottom | hero column; stats 2×2; bottom 1 col | **head(block→export full) → hero(profile row → ring row) → stats 2×2 → activity(head column → badges wrap 2×2 → chart 7 bars in one row) → journal(head → filter scroll → timeline 1 col) → bottom panels 1 col** |
| **Settings** | head; nav 240px + content | nav becomes horizontal sticky strip above content | **head → notice → nav strip(4 tabs, 96 min-width, scroll, hints hidden, foot hidden) → content panel → modal**. Inside panels: `.nx-setting-row` column (text block then full-width control); `.nx-provider-grid` 1 col; `.nx-avatar-picks` 4 cols × 2 rows of 44px; `.nx-data-row` column (icon+body then full-width button) |
| **Onboarding** | aside 42% + card | aside hidden, card full width | **steps row 3 × 48px (numbers only at 375) → eyebrow → title 24 → subtitle 13 → form fields stacked → note → inline error → actions(primary on top, ghost below, both full width)**. Step 2: name → avatar grid 4×2 → actions. Step 3: drop zone (icon 48) → demo card(column, button full) → actions |

**Extra exact rules**
- Library: `.nx-search-wrap` `width:100%`; `.nx-library__view` 2 buttons ×44px on their own row; `.nx-filter-row` nowrap + scroll; book card cover full-width 160px tall in the 1-col grid; `.nx-book-cover__del` 44×44.
- Repeat: `.nx-intervals` stays 5 across at 375 with `gap:4`, dot 28px, label 12px; `.nx-queue__row` `min-height:56`, gap 8; `.nx-session-card__keys` hidden at ≤375 (keyboard shortcuts are desktop-only).
- Stats: `.nx-activity-chart` keeps 7 columns (each `min-width:0`, bar min-height 8px); `.nx-timeline__item` single column; `.nx-journal__title` wraps.
- Settings: nav `position:sticky; top:56px; z-index:60; background:var(--pm-bg)`; only `.nx-settings-nav__item b` shown at 375 (small hints hidden at ≤620 already); `.nx-settings-nav__foot` hidden; `.nx-key-wrap` keeps input + 44px eye button in one row; all `.nx-input` 48px tall, font 14px (prevents iOS zoom).
- Onboarding: `.nx-onboarding-card` padding 20, radius 24, max-width none; `.nx-onboarding-steps li` shows only `01/02/03` at 375; `.nx-onb-providers` 1 col; `.nx-onb-actions{flex-direction:column-reverse}` so the primary CTA is on top.

---

## 7. Touch targets & text minimums (binding)

- **Content interactive:** ≥44×44 CSS px (WCAG 2.5.8 AA+). Buttons: primary 48px, secondary/ghost 44px, icon buttons 44×44 (glyph 16–18px). Cards/rows used as links ≥56px tall.
- **Topbar chrome exception:** nav icons 40×40, avatar 36×36, window buttons 32×32 — all separated by ≥8px gaps. Window controls are disabled outside Tauri, so they are not counted as app touch targets.
- **Chips/tags:** 28px tall is the only sub-44 interactive height allowed, and only when the chip is non-interactive (`span`). Interactive chips get a 44px tap area via padding.
- **Text floor:** primary/body **14px**, secondary **13px**, auxiliary **12px** (chips, kbd, captions only). Nothing below 12px anywhere. Reader article honours the user's 15–26px setting with `line-height:1.6`.
- **Measure:** body text `max-width:66ch`; auxiliary ≤72ch.
- **Focus:** every interactive element keeps `2px --pm-accent` outline, `outline-offset:3px`.

---

## 8. Risks / handoff notes

- Topbar `02-topbar.css` already contains a `@media (max-width:480px)` block; the `≤375` block in §9 must come **after** it (it does — `34-responsive.css` is imported last) so the brand/nav/avatar/window sizing wins.
- `.nx-toc` default state is open (`tocOpen=true`); the inline decision needs no TSX change because the side is a normal block, not an overlay.
- Hiding Home/Settings nav items at 375 is safe: Home = brand link, Settings = existing `.popmenu` link. Do not hide the avatar button.
- No new tokens needed. If a future agent wants a bottom tab bar, that is a product decision, not a responsive one — rejected here.

---

## 9. Paste-ready CSS

### 9a. `premium/02-topbar.css` — append after existing blocks

```css
/* L08 — ≤620: icons only, streak out */
@media (max-width: 620px) {
  .topbar,
  .app > .topbar {
    height: 64px;
    padding: 0 var(--pm-s-3);
    column-gap: var(--pm-s-2);
  }
  .topbar .brand b { display: none; }
  .topbar .brand .mark { width: 32px; height: 32px; border-radius: var(--pm-r-sm); }
  .topbar .nav-txt { display: none; }
  .topbar .nav-item { width: 44px; height: 44px; justify-content: center; padding: 0; }
  .topbar .streak-chip { display: none; }
  .topbar .avatar-btn { width: 40px; height: 40px; }
  .topbar .win-btn { width: 36px; height: 36px; }
  .topbar .win-controls { gap: var(--pm-s-1); }
}

/* L08 — ≤375: exact 32 | 3×40 | 36 | 3×32 chrome */
@media (max-width: 375px) {
  .topbar,
  .app > .topbar {
    height: 56px;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 0 var(--pm-s-1);
    column-gap: var(--pm-s-1);
  }
  .topbar .brand .mark { width: 32px; height: 32px; flex: 0 0 32px; }
  .topbar .topnav { display: flex; align-items: center; gap: var(--pm-s-1); min-width: 0; }
  .topbar .nav-item[href="/"],
  .topbar .nav-item[href="/sozlamalar"] { display: none; }
  .topbar .nav-item { position: relative; width: 40px; height: 40px; flex: 0 0 40px; }
  .topbar .nav-item svg { width: 18px; height: 18px; }
  .topbar .nav-badge {
    position: absolute; top: -2px; right: -2px;
    min-width: 16px; height: 16px; padding: 0 4px;
    border-radius: var(--pm-r-pill); font-size: var(--pm-fs-12); line-height: 16px;
  }
  .topbar .topbar-right { display: flex; align-items: center; gap: var(--pm-s-1); }
  .topbar .avatar-btn { width: 36px; height: 36px; flex: 0 0 36px; font-size: 20px; }
  .topbar .win-controls { display: flex; gap: var(--pm-s-1); padding-left: var(--pm-s-1); border-left: 1px solid var(--pm-line); }
  .topbar .win-btn { width: 32px; height: 32px; flex: 0 0 32px; }
  .topbar .win-btn svg { width: 16px; height: 16px; }
  .topbar .popmenu { width: calc(100vw - var(--pm-s-3)); max-width: 320px; }
}
```

### 9b. `premium/34-responsive.css` — shell + shared primitives

```css
/* L08 — page shell */
@media (max-width: 620px) {
  .main,
  .page { padding: var(--pm-s-8) var(--pm-s-4) var(--pm-s-7); }
  .nx-page,
  .nx-book { padding-inline: var(--pm-s-4); }
  .card,
  .nx-card,
  .nx-panel { padding: 20px; border-radius: var(--pm-r); }
  .section-head,
  .nx-panel__head,
  .nx-head { flex-wrap: wrap; gap: var(--pm-s-1); }
  .nx-eyebrow { font-size: var(--pm-fs-12); font-weight: 700; letter-spacing: .08em; color: var(--pm-accent); }
  .nx-title { font-size: var(--pm-fs-30); line-height: 1.2; letter-spacing: -.035em; }
  .nx-subtitle,
  .nx-hint { font-size: var(--pm-fs-14); line-height: 1.5; }
  .nx-h3 { font-size: var(--pm-fs-18); }
  .nx-btn,
  .nx-btn--lg,
  .btn,
  .btn-lg,
  .btn-block { min-height: 48px; width: 100%; border-radius: var(--pm-r-sm); }
  .nx-btn--sm,
  .nx-btn--ghost,
  .nx-icon-btn { min-height: 44px; }
  .nx-input { min-height: 48px; font-size: var(--pm-fs-14); }
}

@media (max-width: 375px) {
  .main,
  .page { padding: var(--pm-s-8) var(--pm-s-3) var(--pm-s-7); }
  .nx-page,
  .nx-book { padding-inline: var(--pm-s-3); }
  .nx-title,
  .nx-book-hero__title,
  .hero h1 { font-size: var(--pm-fs-24); line-height: 1.2; letter-spacing: -.035em; }
  .nx-subtitle,
  .nx-hint,
  .hero small { font-size: var(--pm-fs-13); }
  .nx-chip,
  .chip { height: 28px; padding: 0 var(--pm-s-2); font-size: var(--pm-fs-12); }
  .nx-head { display: flex; flex-direction: column; align-items: stretch; gap: var(--pm-s-3); }
  .nx-head__actions,
  .nx-head__actions .nx-btn { width: 100%; }
}
```

### 9c. Dashboard

```css
@media (max-width: 620px) {
  .hero { display: flex; flex-direction: column; gap: var(--pm-s-3); padding: 20px; border-radius: var(--pm-r-lg); }
  .profile-col { flex-direction: row; align-items: flex-start; gap: var(--pm-s-2); }
  .big-avatar { width: 48px; height: 48px; flex: 0 0 48px; border-radius: var(--pm-r-sm); }
  .hero-goal { flex-direction: row; justify-content: center; align-items: center; gap: var(--pm-s-2); padding-top: var(--pm-s-3); border-top: 1px solid var(--pm-line); }
  .grid-fit,
  .split,
  .split > .stack { display: flex; flex-direction: column; gap: var(--pm-s-3); min-width: 0; }
  .grid-fit > .card { width: 100%; }
  .todo { display: flex; flex-direction: column; gap: var(--pm-s-1); }
  .todo-row { min-height: 56px; gap: var(--pm-s-2); padding: var(--pm-s-1) var(--pm-s-2); border-radius: var(--pm-r-sm); }
  .t-icon { width: 40px; height: 40px; flex: 0 0 40px; border-radius: var(--pm-r-sm); }
  .t-body { min-width: 0; }
  .t-body b { font-size: var(--pm-fs-14); font-weight: 700; }
  .t-body small { display: block; font-size: var(--pm-fs-13); color: var(--pm-ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .t-check { width: 24px; height: 24px; flex: 0 0 24px; }
}

@media (max-width: 375px) {
  .hero-goal { flex-direction: column; }
  .hero-goal small { font-size: var(--pm-fs-12); text-align: center; }
  .hero .row.wrap { flex-wrap: wrap; gap: var(--pm-s-1); }
  .qactions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-1); }
  .qaction { min-height: 104px; padding: var(--pm-s-2); border-radius: var(--pm-r-sm); background: var(--pm-surface-2); align-items: flex-start; }
  .qicon { width: 32px; height: 32px; }
  .qaction b { font-size: var(--pm-fs-14); }
  .qaction small { font-size: var(--pm-fs-12); color: var(--pm-ink-3); }
  .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-1); }
  .grid-2 > * { min-height: 88px; padding: var(--pm-s-2); min-width: 0; }
  .book-row > [role="progressbar"] { display: none; }
}
```

### 9d. Book

```css
@media (max-width: 620px) {
  .nx-back { min-height: 44px; }
  .nx-book-progress { height: 4px; margin-bottom: var(--pm-s-3); }
  .nx-book-hero { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: var(--pm-s-2); padding: 20px; border-radius: var(--pm-r-lg); }
  .nx-book-hero__cover { grid-column: 1; width: 64px; height: 88px; }
  .nx-book-hero__info { grid-column: 2; min-width: 0; }
  .nx-book-hero__info .nx-row { flex-wrap: wrap; gap: var(--pm-s-1); }
  .nx-book-hero__title { max-width: 100%; }
  .nx-book-hero__action { grid-column: 1 / -1; display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: var(--pm-s-2); align-items: center; }
  .nx-book-hero__action .nx-btn--primary { min-height: 48px; }
  .nx-book-hero__action .nx-btn--ghost { grid-column: 1 / -1; width: 100%; min-height: 44px; }
  .nx-book-tabs { display: flex; flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: none; height: 48px; gap: var(--pm-s-1); }
  .nx-book-tabs::-webkit-scrollbar { display: none; }
  .nx-book-tab { flex: 0 0 auto; min-width: 96px; height: 44px; padding: 0 var(--pm-s-2); font-size: var(--pm-fs-13); scroll-snap-align: start; }
  .nx-reader { display: flex; flex-direction: column; gap: var(--pm-s-3); }
  .nx-reader-side,
  .nx-reader-notes { padding: 20px; border-radius: var(--pm-r); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); }
  .nx-reader-side { width: 100%; }
  .nx-reader-progress { display: flex; align-items: center; gap: var(--pm-s-2); }
  .nx-reader-side > .nx-btn { width: 100%; min-height: 48px; }
  .nx-toc { max-height: 240px; overflow-y: auto; }
  .nx-toc__item { min-height: 44px; padding: var(--pm-s-1) var(--pm-s-2); border-radius: var(--pm-r-sm); font-size: var(--pm-fs-14); }
  .nx-reader-main { min-width: 0; }
  .nx-reader-paper { max-width: 66ch; padding: 20px; line-height: 1.6; }
  .nx-reader-notes { display: flex; flex-direction: column; gap: var(--pm-s-3); }
  .nx-quote-bar { flex-wrap: wrap; gap: var(--pm-s-1); }
}

@media (max-width: 375px) {
  .nx-book-tab__soon { display: none; }
  .nx-reader-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--pm-s-1); padding-block: var(--pm-s-1); }
  .nx-toc-toggle { order: 1; width: 40px; height: 40px; flex: 0 0 40px; }
  .nx-reader-toolbar__title { order: 2; flex: 1 1 calc(100% - 160px); min-width: 0; overflow: hidden; }
  .nx-reader-toolbar__title b,
  .nx-reader-toolbar__title span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--pm-fs-13); }
  .nx-reader-toolbar > .nx-chip { order: 3; flex: 0 0 auto; font-size: var(--pm-fs-12); }
  .nx-reader-aa { order: 4; display: flex; margin-left: auto; }
  .nx-reader-toolbar > .nx-icon-btn:not(.nx-toc-toggle) { order: 4; width: 40px; height: 40px; }
  .nx-reader-aa button { width: 40px; height: 40px; font-size: var(--pm-fs-14); }
  .nx-reader-footer { display: flex; flex-wrap: wrap; gap: var(--pm-s-1); }
  .nx-reader-footer .nx-hint { order: 3; flex: 1 1 100%; text-align: center; font-size: var(--pm-fs-12); }
  .nx-quote-bar > .nx-btn { flex: 1 1 100%; }
}
```

### 9e. Library / Repeat / Stats

```css
@media (max-width: 620px) {
  /* Library */
  .nx-library-stats,
  .nx-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-1); }
  .nx-dropzone { display: flex; flex-direction: column; align-items: stretch; gap: var(--pm-s-2); padding: 20px; }
  .nx-dropzone__icon { width: 48px; height: 48px; margin-inline: auto; }
  .nx-dropzone__copy { text-align: center; }
  .nx-dropzone__pick { width: 100%; min-height: 44px; }
  .nx-library-content .nx-head,
  .nx-library-content .nx-section-head { flex-direction: column; align-items: stretch; }
  .nx-library-content .nx-input-wrap { width: 100%; }
  .nx-search-wrap { width: 100%; }
  .nx-filter-row { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .nx-book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-1); }
  .nx-library__view { display: flex; justify-content: flex-end; gap: var(--pm-s-1); }
  .nx-library__view button { width: 44px; height: 44px; }

  /* Repeat */
  .nx-repeat-main,
  .nx-stats-bottom { grid-template-columns: minmax(0, 1fr); gap: var(--pm-s-3); }
  .nx-session-card { display: flex; flex-direction: column; align-items: stretch; gap: var(--pm-s-3); }
  .nx-session-card__ring { display: flex; justify-content: center; }
  .nx-session-card__chips { flex-wrap: wrap; gap: var(--pm-s-1); }
  .nx-repeat-result { flex-wrap: wrap; gap: var(--pm-s-2); }
  .nx-repeat-result .nx-btn { width: 100%; }
  .nx-queue__row { min-height: 56px; gap: var(--pm-s-1); align-items: flex-start; flex-wrap: wrap; }
  .nx-intervals { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
  .nx-intervals__dot { width: 28px; height: 28px; font-size: var(--pm-fs-12); }

  /* Stats */
  .nx-stats-hero { display: flex; flex-direction: column; gap: var(--pm-s-3); }
  .nx-stats-hero__profile { min-width: 0; }
  .nx-stats-hero__ring { display: flex; align-items: center; gap: var(--pm-s-2); }
  .nx-stats-activity .nx-section-head { flex-direction: column; align-items: stretch; }
  .nx-badges { flex-wrap: wrap; gap: var(--pm-s-1); }
  .nx-activity-chart { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }
  .nx-activity-day { min-width: 0; }
  .nx-journal__title { flex-wrap: wrap; }
  .nx-timeline__item { display: block; }
}

@media (max-width: 375px) {
  .nx-book-grid { grid-template-columns: minmax(0, 1fr); }
  .nx-book-cover { height: 160px; }
  .nx-book-cover__del { width: 44px; height: 44px; }
  .nx-session-card__keys { display: none; }
  .nx-intervals__step b { font-size: var(--pm-fs-12); }
}
```

### 9f. Settings / Onboarding

```css
@media (max-width: 620px) {
  .nx-settings-layout { display: flex; flex-direction: column; gap: var(--pm-s-3); }
  .nx-settings-nav {
    position: sticky; top: 64px; z-index: 60;
    display: flex; flex-wrap: nowrap; overflow-x: auto; gap: var(--pm-s-1);
    padding-block: var(--pm-s-1); background: var(--pm-bg);
    scrollbar-width: none;
  }
  .nx-settings-nav__item { flex: 0 0 auto; min-width: 96px; min-height: 44px; padding: var(--pm-s-1) var(--pm-s-2); }
  .nx-settings-nav__item small,
  .nx-settings-nav__foot { display: none; }
  .nx-setting-row { display: flex; flex-direction: column; align-items: stretch; gap: var(--pm-s-2); }
  .nx-setting-row > div:last-child,
  .nx-setting-row .nx-segmented { width: 100%; }
  .nx-provider-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-1); }
  .nx-data-row { display: flex; flex-direction: column; align-items: stretch; gap: var(--pm-s-2); }
  .nx-data-row .nx-btn { width: 100%; min-height: 44px; }
  .nx-onboarding { display: block; }
  .nx-onboarding-aside { display: none; }
  .nx-onboarding-main { width: 100%; padding: var(--pm-s-3); }
  .nx-onboarding-card { max-width: none; padding: 20px; border-radius: var(--pm-r-lg); }
}

@media (max-width: 375px) {
  .nx-settings-nav { top: 56px; }
  .nx-settings-nav__item b { font-size: var(--pm-fs-13); }
  .nx-provider-grid { grid-template-columns: minmax(0, 1fr); }
  .nx-avatar-picks { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--pm-s-1); }
  .nx-avatar-pick { width: 100%; min-height: 44px; font-size: 22px; }
  .nx-onboarding-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--pm-s-1); }
  .nx-onboarding-steps li { min-height: 44px; justify-content: center; }
  .nx-onboarding-steps li > span:last-child { display: none; }
  .nx-onb-providers { grid-template-columns: minmax(0, 1fr); }
  .nx-onb-actions { display: flex; flex-direction: column-reverse; gap: var(--pm-s-1); }
  .nx-onb-actions .nx-btn { width: 100%; min-height: 48px; }
  .nx-onb-demo { display: flex; flex-direction: column; align-items: stretch; gap: var(--pm-s-2); }
  .nx-onb-demo .nx-btn { width: 100%; min-height: 44px; }
}
```
