# L06 — Layout decisions: Settings + Onboarding

> Agent L06 (layout decision architect). Scope: **placement, sizes, alignment, breakpoints only** — no CSS is implemented here. Paste-ready declarations are *specifications* for the owners of `styles/premium/30-settings.css` and `styles/premium/31-onboarding.css`.
> Source of truth: `docs/superpowers/specs/2026-11-23-premium-design-system.md`.
> Reference screenshots: `after-settings.png` (1440) and `study-notes-after.png` (onboarding, 1440).
> Reference code: `pages/Settings.tsx`, `pages/Onboarding.tsx`, `styles/nx/settings.css`, `styles/nx/onboarding.css`.

---

## 0. Global rules applied to both screens

| Rule | Decision |
|------|----------|
| Grid | Every gap/padding is one of `8 / 12 / 16 / 24 / 32 / 48 / 64 / 80` → `--pm-s-1 … --pm-s-8`. Component **widths/heights** that have no token (256, 560, 480, 72, 64, 48, 44, 40, 28, 24) are exact multiples of 8 and are written as literal px. |
| Typography | Display `Fraunces` 600 `-0.035em`; UI `Manrope` 600/700. Type scale only `--pm-fs-12/13/14/16/18/20/24/30/40`. Body ≥14, secondary 13, helper 12. |
| Case | **No ALL CAPS** labels. Legacy `text-transform: uppercase` on eyebrow / about-grid / aside-foot is removed; keep letter-spacing `0.08em` and sentence case. |
| Surfaces | Prefer `--pm-surface` + `--pm-shadow-1/2` over borders. A 1px `--pm-line` is allowed only where a control needs a selection affordance (inputs, provider rows, tabs). |
| Color | Max 2 hues per screen: `--pm-ink` + `--pm-accent`. `--pm-sage` only for "done"/"success" step, `--pm-brass` only for the single "Tavsiya" chip and the story-panel emphasis. No new hues. |
| Focus | `outline: 2px solid var(--pm-accent); outline-offset: 3px;` on every interactive element. Legacy `box-shadow: 0 0 0 4px var(--nx-accent-soft)` focus rings are replaced with `box-shadow: none` in the premium layer. |
| One focal CTA | Settings: only the **AI section** has a filled primary ("Saqlash"); profile/data/about sections use ghost/soft actions. Onboarding: only **"Davom etish" / "Kutubxonani ochish"** is filled primary on every step. |
| Breakpoints | `1440` (desktop), `900` (tablet — collapse), `620` (compact — stack), `375` (minimal — protect tap targets). |

### Token-to-px cheat sheet
`--pm-s-1`=8 · `--pm-s-2`=12 · `--pm-s-3`=16 · `--pm-s-4`=24 · `--pm-s-5`=32 · `--pm-s-6`=48 · `--pm-s-7`=64 · `--pm-s-8`=80
`--pm-r-sm`=10 · `--pm-r`=16 · `--pm-r-lg`=24 · `--pm-r-pill`=999

---

# A. SETTINGS

## A.1 Decision register — one decision per row

| ID | Decision (single chosen outcome) | Rejected alternative |
|----|----------------------------------|----------------------|
| **S-1** | At 1440 use a **two-column grid**: page horizontal padding **48px**, nav **256px**, gap **32px**, content **1056px** (`1440 − 96 − 256 − 32`). Columns: `256px minmax(0,1fr)`. | 240px + 24px (legacy) — too tight for 14px nav text; content had no rhythm. |
| **S-2** | Notice banner is **full width above the grid**, not inside a column; margin-bottom **24px**. | Placing it inside the content panel (hides it when another section is active). |
| **S-3** | Side nav stays **vertical at 1440**; becomes a **single-row horizontally scrollable tab strip at ≤900** (decision: **yes, it becomes tabs**). Active marker flips from a **left 2px bar** (vertical) to a **bottom 2px underline** (tabs). | Legacy 2×2 wrapped grid at ≤620 — breaks reading order and costs a row. |
| **S-4** | Nav items are **plain text**, no pill/filled background. Inactive `--pm-ink-3`, active `--pm-accent` + 2px bar. | Legacy `--pm-accent-soft` pill — violates "nav oddiy matn". |
| **S-5** | Nav hint text (`Ism, mavzu, til`) stays visible at 1440/900 and is **visually hidden (sr-only) at ≤620**, never `display:none` (preserves accessible name). | Removing `<small>` from DOM (not allowed — TSX dependency). |
| **S-6** | Panel head **24px 32px**, 1px `--pm-line` bottom rule, title **18px/700**, trailing icon **18px**, right-aligned. | Legacy 20px 24px with soft card border. |
| **S-7** | Panel body **32px** padding (16px at ≤620). Internal vertical rhythm **32px between groups**, **8px label→control**. | Legacy 24px uniform gap. |
| **S-8** | Labels sit **above** inputs, left-aligned; controls never stretch. Inputs capped at **480px**, height **48px**. Input→hint gap **8px**. | Full-width inputs (bad line length on 1056px panel). |
| **S-9** | Avatar row: label above, **8 tiles × 48px** in one row at 1440, gap **8px**. At 620 → **6 columns**, at 375 → **4 columns**, tile stays 48px. Emoji 24px. | Shrinking tiles below 48px on mobile (tap target). |
| **S-10** | Setting rows (Ko'rinish / Til / Eslatma) are **borderless `--pm-surface-2` slabs**, radius **16px**, padding **16px 24px**, min-height **72px**. Text block left (max **60ch**), control right, gap **24px**. | Legacy 1px-border rows at 20px padding with `opacity:.75` — washed-out text. |
| **S-11** | Muted rows keep **full opacity**; "coming soon" controls are static 28px outline chips (`--pm-line-strong`), not disabled-looking opacity. | `opacity: .75` (fails contrast guidance). |
| **S-12** | Data/export rows are **white slabs** with `--pm-shadow-1`, radius 16px, padding **16px 24px**, min-height **88px**; icon **48×48** in `--pm-accent-soft`; gap **16px**; action is a **44px ghost button** on the right. | Legacy 40px icon + 40px button + 1px border row. |
| **S-13** | `@media (max-width:900px)`: one column; nav tabs full width; nav foot hidden; provider grid 1 column. `@media (max-width:620px)`: setting rows and data rows **stack** (control/button on the next line, full width). `@media (max-width:375px)`: inputs full width, avatar 4 columns, notice padding 12/16. | Legacy 480px breakpoint adds a third competing rule set. |
| **S-14** | Segmented control height **44px** (track 4px padding, buttons 36px, radius 10px); active button `--pm-accent-soft` + `--pm-accent`; at ≤620 it becomes a **2-column grid** filling the row. | Legacy 32px buttons. |

## A.2 Wireframes

### 1440 — vertical nav (page pad 48)
```
┌─ topbar ────────────────────────────────────────────────────────────────┐
│ 42px                                                            42px  │
│  eyebrow 12 · title 40 · subtitle 16                                  │
│  [ ⓘ notice — full width, 16/24, accent-soft ]        mb 24           │
│  ┌── NAV 256 ──┐   gap 32   ┌────────── CONTENT 1056 ────────────────┐ │
│  │ 12px pad    │             │ head 24/32 : title18          [icon18] │ │
│  │ ▌Profile    │             │──────────────────── 1px ──────────────│ │
│  │  Ism, mavzu │             │ body pad 32                           │ │
│  │  AI ulash   │             │  label14            [control → right] │ │
│  │  Ma'lumotlar│             │  input 480×48                         │ │
│  │  Dastur...  │             │  hint13                               │ │
│  │ ─────────── │             │  Avatar                               │ │
│  │ 🔒 lokal    │             │  [48][48][48][48][48][48][48][48]     │ │
│  └─────────────┘             │  ┌ slab 72: text        segmented ┐   │ │
│                              │  ├ slab 72: text          chip    ┤   │ │
│                              │  └ ghost button (not primary)     ┘   │ │
│                              └───────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 900 — horizontal tabs (page pad 32)
```
┌──────────────────────────────────────────────────────────────────┐
│ eyebrow · title · subtitle            (pad 32)                  │
│ [notice full width]                                             │
│ ┌ Profile ┐┌ AI ┐┌ Ma'lumotlar ┐┌ Dastur haqida ┐ → scroll →    │
│ └─────────┘└───┘└──────────────┘└───────────────┘               │
│   active = bottom 2px accent underline; single row; foot hidden │
│  ┌────────────────── PANEL full 836 ──────────────────────────┐  │
│  │ head 24/32                                                │  │
│  │ body 32: labels left / controls right, 480px cap retained │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 620 / 375 — stacked (page pad 16)
```
┌───────────────────────────┐   ┌─────────────────────────┐
│ eyebrow · title 30        │   │ eyebrow · title 30      │
│ [notice 12/16]            │   │ [notice 12/16]          │
│ ┌Profile┐┌AI┐┌Ma'lumot→   │   │ ┌Profile┐┌AI┐┌Ma'lumot→ │
│ └underline active┘ scroll │   │ └underline┘ scroll      │
│ ┌── PANEL ──────────────┐ │   │ ┌── PANEL ────────────┐ │
│ │ head pad16 (wrap ok)  │ │   │ │ head pad16           │ │
│ │ body pad16            │ │   │ │ body pad16           │ │
│ │ label14               │ │   │ │ label14              │ │
│ │ input 100%            │ │   │ │ input 100%           │ │
│ │ hint13                │ │   │ │ hint13               │ │
│ │ avatar 6×48 (2 rows)  │ │   │ │ avatar 4×48 (2 rows) │ │
│ │ ┌ slab 16 ──────────┐ │ │   │ │ ┌ slab ────────────┐ │ │
│ │ │ Ko'rinish         │ │ │   │ │ │ Ko'rinish        │ │ │
│ │ │ hint13            │ │ │   │ │ │ [segmented 2col] │ │ │
│ │ │ [segmented 2col]  │ │ │   │ │ └──────────────────┘ │ │
│ │ └───────────────────┘ │ │   │ └──────────────────────┘ │
│ └───────────────────────┘ │   └─────────────────────────┘
│          620              │             375
```

## A.3 Geometry tables

| Element | 1440 | 900 | 620 | 375 | Grid/token |
|---------|------|-----|-----|-----|------------|
| Page horizontal padding | 48 | 32 | 16 | 16 | `--pm-s-6 / s-5 / s-3 / s-3` |
| Layout columns | `256 + 32 + 1056` | `1fr` | `1fr` | `1fr` | grid, gap `--pm-s-5 → s-4` |
| Nav width / height behaviour | 256, sticky | 100%, static tabs | 100%, scroll tabs | 100%, scroll tabs | — |
| Nav item padding | 12/16 | 12/16 | 12/16 | 12/16 | `--pm-s-2 / s-3` |
| Nav item text | 14/700 → 13 hint | 14 → 13 | 14, hint sr-only | 14, hint sr-only | `--pm-fs-14 / s-13` |
| Nav gap | 8 | 8 | 8 | 8 | `--pm-s-1` |
| Notice padding / mb | 16/24 · 24 | 16/24 · 24 | 16/24 · 24 | 12/16 · 16 | `--pm-s-3/s-4 · s-4 / s-2/s-3 · s-3` |
| Panel head padding | 24/32 | 24/32 | 16 | 16 | `--pm-s-3 s-4 → s-5 → s-3` |
| Panel body padding | 32 | 32 | 16 | 16 | `--pm-s-5 → s-3` |
| Group gap (panel body) | 32 | 32 | 32 | 32 | `--pm-s-5` ⚠ inline-style conflict — see Risks |
| Label → input → hint | 8 / 8 | 8 / 8 | 8 / 8 | 8 / 8 | `--pm-s-1` |
| Input height / max-width | 48 / 480 | 48 / 480 | 48 / 100% | 48 / 100% | 48 = 6×8 |
| Avatar tiles / gap | 8×48 / 8 | 8×48 / 8 | 6×48 / 8 | 4×48 / 8 | `--pm-s-1` |
| Setting row padding / min-h | 16/24 · 72 | 16/24 · 72 | 16 · auto | 16 · auto | `--pm-s-3/s-4` |
| Data row padding / min-h | 16/24 · 88 | 16/24 · 88 | 16 · auto | 16 · auto | `--pm-s-3/s-4` |
| Data icon | 48 | 48 | 48 | 48 | `--pm-s-6` |
| Segmented total height | 44 | 44 | 44 (2-col) | 44 (2-col) | 44 = 5.5×8 (control height, no token) |
| Action buttons | 44 / 48 | 44 / 48 | 44 / 48 | 44 / 48 | ghost/primary recipes |

Alignment note: label text block and hint share the same left edge as the panel head title (panel body x = content x + 32). All right-side controls share a common right edge at panel body x + width − 32. At ≥900 the 480px input cap means its right edge does **not** align with the right controls — deliberate: controls align to the row slab edge, inputs align to the label grid.

## A.4 Paste-ready declarations — Settings

```css
/* ===== premium/30-settings.css — L06 layout spec ===== */

/* S-2 notice */
.nx-settings-notice {
  display: flex; align-items: center; gap: var(--pm-s-2);
  margin-bottom: var(--pm-s-4);
  padding: var(--pm-s-3) var(--pm-s-4);
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-accent-soft); color: var(--pm-accent);
  font-size: var(--pm-fs-13); line-height: 1.5;
}
.nx-settings-notice svg { width: 18px; height: 18px; flex: 0 0 auto; }

/* S-1 layout */
.nx-settings-layout {
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  gap: var(--pm-s-5);
  align-items: start;
}

/* S-3/S-4 nav */
.nx-settings-nav {
  position: sticky; top: calc(var(--topbar-h, 56px) + var(--pm-s-3));
  display: flex; flex-direction: column; gap: var(--pm-s-1);
  padding: var(--pm-s-2);
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface); box-shadow: var(--pm-shadow-1);
}
.nx-settings-nav__item {
  position: relative;
  display: flex; flex-direction: column; gap: var(--pm-s-1);
  padding: var(--pm-s-2) var(--pm-s-3);
  border: 0; border-radius: var(--pm-r-sm);
  background: transparent; color: var(--pm-ink-3); text-align: left;
  font-family: var(--pm-font); transition: color .16s ease;
}
.nx-settings-nav__item b { font-size: var(--pm-fs-14); font-weight: 700; }
.nx-settings-nav__item small { font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-settings-nav__item.is-active { background: transparent; color: var(--pm-accent); }
.nx-settings-nav__item.is-active::before {
  content: ''; position: absolute; left: 0; top: var(--pm-s-1); bottom: var(--pm-s-1);
  width: 2px; border-radius: var(--pm-r-pill); background: var(--pm-accent);
}
.nx-settings-nav__foot {
  display: flex; align-items: center; gap: var(--pm-s-1);
  margin-top: var(--pm-s-1);
  padding: var(--pm-s-3) var(--pm-s-3) var(--pm-s-1);
  border-top: 1px solid var(--pm-line);
  color: var(--pm-ink-3); font-size: var(--pm-fs-12);
}

/* S-6/S-7 panel */
.nx-settings-content .nx-panel {
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface); box-shadow: var(--pm-shadow-1);
}
.nx-settings-content .nx-panel__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--pm-s-3) var(--pm-s-5);
  border-bottom: 1px solid var(--pm-line);
}
.nx-settings-content .nx-panel__head .nx-h3 {
  font-size: var(--pm-fs-18); font-weight: 700; color: var(--pm-ink);
}
.nx-settings-content .nx-panel__head svg { width: 18px; height: 18px; color: var(--pm-ink-3); }
.nx-settings-content .nx-panel__body { padding: var(--pm-s-5); }

/* S-8 fields */
.nx-settings-content .nx-field {
  display: flex; flex-direction: column; gap: var(--pm-s-1);
}
.nx-settings-content .nx-label { font-size: var(--pm-fs-14); font-weight: 700; color: var(--pm-ink); }
.nx-settings-content .nx-hint { font-size: var(--pm-fs-13); color: var(--pm-ink-3); line-height: 1.5; }
.nx-settings-content .nx-input {
  height: 48px; max-width: 480px; padding: 0 var(--pm-s-3);
  border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm);
  background: var(--pm-surface); color: var(--pm-ink); font-size: var(--pm-fs-14);
}
.nx-settings-content .nx-key-wrap { max-width: 480px; gap: var(--pm-s-1); }

/* S-9 avatar */
.nx-avatar-picks { display: grid; grid-template-columns: repeat(8, 48px); gap: var(--pm-s-1); }
.nx-avatar-pick {
  width: 48px; height: 48px; font-size: 24px;
  border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm);
  background: var(--pm-surface-2); color: var(--pm-ink);
}
.nx-avatar-pick.is-active {
  border-color: var(--pm-accent); background: var(--pm-accent-soft);
  box-shadow: var(--pm-shadow-focus);
}

/* S-10/S-11 setting rows */
.nx-setting-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--pm-s-4); min-height: 72px;
  padding: var(--pm-s-3) var(--pm-s-4);
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface-2); box-shadow: var(--pm-shadow-1);
}
.nx-setting-row > div:first-child { max-width: 60ch; }
.nx-setting-row b { font-size: var(--pm-fs-14); font-weight: 700; color: var(--pm-ink); }
.nx-setting-row .nx-hint { margin-top: var(--pm-s-1); }
.nx-setting-row > :last-child { flex: 0 0 auto; }
.nx-setting-row--muted { opacity: 1; }
.nx-settings-content .nx-chip {
  height: 28px; padding: 0 var(--pm-s-2); gap: var(--pm-s-1);
  border: 1px solid var(--pm-line-strong); border-radius: var(--pm-r-pill);
  background: var(--pm-surface); color: var(--pm-ink-2); font-size: var(--pm-fs-12);
}

/* S-14 segmented */
.nx-settings-content .nx-segmented {
  display: inline-flex; gap: 4px; padding: 4px;
  border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm);
  background: var(--pm-surface);
}
.nx-settings-content .nx-segmented button {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--pm-s-1);
  min-height: 36px; padding: 0 var(--pm-s-3);
  border: 0; border-radius: var(--pm-r-sm);
  background: transparent; color: var(--pm-ink-2); font-size: var(--pm-fs-13);
}
.nx-settings-content .nx-segmented button[aria-pressed='true'] {
  background: var(--pm-accent-soft); color: var(--pm-accent);
}

/* S-12 data/export rows */
.nx-data-row {
  display: flex; align-items: center; gap: var(--pm-s-3);
  min-height: 88px; padding: var(--pm-s-3) var(--pm-s-4);
  border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface); box-shadow: var(--pm-shadow-1);
}
.nx-data-row__icon {
  display: grid; place-items: center; width: 48px; height: 48px; flex: 0 0 auto;
  border-radius: var(--pm-r-sm); background: var(--pm-accent-soft); color: var(--pm-accent);
}
.nx-data-row--danger .nx-data-row__icon { background: var(--pm-accent-soft); color: var(--pm-accent); }
.nx-data-row__body { flex: 1 1 auto; min-width: 0; }
.nx-data-row__body b { font-size: var(--pm-fs-14); font-weight: 700; }
.nx-data-row__body .nx-hint { margin-top: var(--pm-s-1); }

/* S-13 responsive */
@media (max-width: 900px) {
  .nx-settings-layout { grid-template-columns: minmax(0, 1fr); gap: var(--pm-s-4); }
  .nx-settings-nav {
    position: relative; top: 0;
    flex-direction: row; flex-wrap: nowrap; gap: var(--pm-s-1);
    overflow-x: auto; overflow-y: hidden; scroll-snap-type: x proximity;
    padding: var(--pm-s-1);
  }
  .nx-settings-nav__item {
    flex: 0 0 auto; min-width: 160px; scroll-snap-align: start;
  }
  .nx-settings-nav__item.is-active::before {
    left: var(--pm-s-2); right: var(--pm-s-2); top: auto; bottom: 0;
    width: auto; height: 2px;
  }
  .nx-settings-nav__foot { display: none; }
  .nx-provider-grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 620px) {
  .nx-settings-content .nx-panel__head { padding: var(--pm-s-3); flex-wrap: wrap; }
  .nx-settings-content .nx-panel__body { padding: var(--pm-s-3); }
  .nx-settings-nav__item small {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap;
  }
  .nx-setting-row {
    flex-direction: column; align-items: flex-start;
    gap: var(--pm-s-2); padding: var(--pm-s-3);
  }
  .nx-setting-row > :last-child { width: 100%; }
  .nx-settings-content .nx-segmented { display: grid; grid-template-columns: 1fr 1fr; width: 100%; }
  .nx-avatar-picks { grid-template-columns: repeat(6, 48px); }
  .nx-data-row { flex-wrap: wrap; padding: var(--pm-s-3); }
  .nx-data-row__body { flex: 1 1 calc(100% - 64px); }
  .nx-data-row > .nx-btn { margin-left: 64px; }
}
@media (max-width: 375px) {
  .nx-avatar-picks { grid-template-columns: repeat(4, 48px); }
  .nx-settings-content .nx-segmented button { padding: 0 var(--pm-s-2); }
  .nx-data-row > .nx-btn { margin-left: 0; width: 100%; }
  .nx-settings-content .nx-input, .nx-settings-content .nx-key-wrap { max-width: 100%; }
  .nx-settings-notice { padding: var(--pm-s-2) var(--pm-s-3); }
}

/* Focus — replaces legacy box-shadow ring, keeps 2px/3px premium ring */
.nx-settings :is(button, input, a):focus-visible {
  outline: 2px solid var(--pm-accent); outline-offset: 3px;
  box-shadow: none;
}
```

---

# B. ONBOARDING

## B.1 Decision register — one decision per row

| ID | Decision (single chosen outcome) | Rejected alternative |
|----|----------------------------------|----------------------|
| **O-1** | Split at 1440 is **42% story / 58% form** (`minmax(0,42fr) minmax(0,58fr)`) → 605px / 835px. | 50/50 (story cramped) or 35/65 (loses the hero). |
| **O-2** | At **≤900 the story panel is hidden**, layout becomes one column and the card centers. Decision: **no split at tablet**. | Keeping a 378px story column at 900 — headline wraps to 5+ lines. |
| **O-3** | Card width **560px**, padding **32px**, radius **24px**, shadow `--pm-shadow-2`, no border. Content width = 496px. | Legacy 560/40px padding + 1px border + 20px radius. |
| **O-4** | Main area padding **32px** (1440/900), **16px** (620/375); card `margin: auto 0`, vertically centered with scroll fallback. | Sticky top alignment (wastes space on short steps). |
| **O-5** | Step indicator: **3 equal columns**, gap **8px**, badge **24×24** radius 10, label **13px/600**, `padding-bottom: 12px`, bottom rule 2px, `margin-bottom: 32px`. Colors: active `--pm-accent`, done `--pm-sage`, future `--pm-line`. | Legacy 20px badge + 11px label (below legibility floor). |
| **O-6** | At **≤620** steps stay **3 columns but show badges only**; labels become sr-only (accessible, not `display:none`); badges grow to **32×32**. `margin-bottom: 24px`. | Legacy vertical 1-column steps (adds ~100px above the fold). |
| **O-7** | Step header geometry: eyebrow **12px/700** `--pm-accent` (sentence case), title **30px Fraunces** with **8px** below to subtitle **16px** `--pm-ink-2`. Implemented as flex gap 16px with subtitle `margin-top: -8px` → net 8px. | 24px title (too weak vs story panel). |
| **O-8** | Provider rows: **full-width stacked list**, gap **8px**, row min-height **64px**, padding **16px**, radius **10px**, 1px `--pm-line`; name **14px/700**, hint **13px** `--pm-ink-3`, gap **8px**. | Legacy 12/16 padding + 13/11 type (hint under floor). |
| **O-9** | Single "Tavsiya" tag becomes a **28px pill**, `12px` text, `--pm-brass-soft` / `--pm-brass`, top-right **12px** inset. At **375** it goes **static** below the name to guarantee no overlap. | Legacy green `--pm-success-soft` chip (introduces a third hue). |
| **O-10** | Explanatory note sits **directly after the provider list**, before the key field; full card width, padding **16px**, radius **16px**, `--pm-accent-soft`, icon **18px**, gap **12px**, 13px `--pm-ink-2`. Uniform **16px** step rhythm (no extra margin). | Placing it below the key input (user has already hesitated by then). |
| **O-11** | Action row is separated by a **1px `--pm-line` rule**; total space above = **32px** (parent 16px gap + `margin-top: 16px`), `padding-top: 24px`; ghost left, **filled primary right, 48px**, single focal CTA. | Legacy 20px padding-top and 8px margin. |
| **O-12** | At **≤620** actions **stack full width**, ghost above primary; DOM order unchanged → tab order preserved. | `column-reverse` (visual order ≠ tab order). |
| **O-13** | Story panel: padding **48px** vertical / **64px** horizontal at 1440; brand top, quote vertically centered (`margin: auto 0`), features + version foot bottom. Quote eyebrow **12px**, h1 **40px Fraunces/600** line-height 1.08, p **14px / 42ch**, features **13px** gap **12px**, foot **12px** no caps, margin-top **32px**. | Legacy clamp 36–56px h1 and uppercase foot. |
| **O-14** | Form internals: input **48px**, radius 10px, padding 0 16px; key eye button **48×48** with 1px `--pm-line`; labels 14px/700; hints 13px. Dropzone **32px 24px** padding, radius 16px; demo row icon **48×48**, padding 16px. | Legacy 40px eye button / 18px radius dropzone. |

## B.2 Wireframes

### 1440 — 42 / 58 split
```
┌─ STORY 42% = 605 ─────────────┬─ FORM 58% = 835 ─────────────────────────────┐
│ pad 48 / 64                   │ main pad 32; card 560 centered, pad 32, r24   │
│ [📖] Study Notes 20           │ ┌───────────────────────────────────────────┐ │
│                               │ │ [01 AI ulash][02 Shaxsiyat][03 Birinchi] │ │
│            (auto)             │ │  ═══ active ▔▔▔  ═══       ═══          │ │
│  — Kitobni o'qish emas         │ │                                           │ │
│  Tushunish va hayotda          │ │ 1-qadam  (12/700 accent)                  │ │
│  qo'llash uchun.  ← 40 Fraunces│ │ AI'ni ulang  (30 Fraunces)                │ │
│  em = brass                    │ │ Kitoblarni siz uchun...  (16)             │ │
│  14px / 42ch body              │ │                                           │ │
│            (auto)             │ │ ┌ Google Gemini      [TAVSIYA] ┐ 64       │ │
│  ✦ AI bilan chuqur tahlil      │ │ ├ OpenAI (GPT)                ┤ 64       │ │
│  ✓ Kunlik takrorlash           │ │ └ Ollama (lokal)             ┘ 64       │ │
│  🔒 Ma'lumot faqat sizda        │ │ [ ⓘ Nega kalit kerak? ... accent-soft ]  │ │
│                               │ │ API kalit                                 │ │
│  v0.1.0 · bepul va ochiq      │ │ [ input 48 .............. ][👁 48]        │ │
│                               │ │ Kalitni qayerdan olish? (13 link)         │ │
│                               │ │ Model (ixtiyoriy)                         │ │
│                               │ │ [ input 48 ....................... ]      │ │
│                               │ │ ───────────── 1px ─────────────────────── │ │
│                               │ │ [Keyinroq sozlayman]      [DAVOM ETISH →] │ │
│                               │ │  ghost 44                     primary 48  │ │
│                               │ └───────────────────────────────────────────┘ │
└───────────────────────────────┴───────────────────────────────────────────────┘
                                        ONE focal CTA
```

### 900 — story hidden, card centered
```
┌─────────────────────────────────────────────────────────┐
│ main pad 32, background --pm-bg                        │
│              ┌──── CARD 560, pad 32 ────┐              │
│              │ steps 3 cols (labels on) │              │
│              │ ...all fields full card  │              │
│              └──────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

### 620 / 375 — compact card
```
┌──────────────────────────┐  ┌────────────────────────┐
│ main pad 16              │  │ main pad 16            │
│ ┌── CARD 100%, pad 16 ─┐ │  │ ┌── CARD 100%, p16 ──┐ │
│ │ (01)──(02)──(03)      │ │  │ │ (01)──(02)──(03)   │ │
│ │  badges only, 32px    │ │  │ │  badges only       │ │
│ │ 1-qadam / title 30    │ │  │ │ 1-qadam / title 30 │ │
│ │ subtitle 16           │ │  │ │ subtitle 16        │ │
│ │ ┌ Gemini   [TAVSIYA]┐ │ │  │ │ ┌ Gemini          ┐ │ │
│ │ ├ OpenAI (GPT)      ┤ │ │  │ │ │ TAVSIYA (static)│ │ │
│ │ └ Ollama (lokal)   ┘ │ │  │ │ ├ OpenAI (GPT)    ┤ │ │
│ │ [note accent-soft]   │ │  │ │ └ Ollama (lokal)  ┘ │ │
│ │ API kalit            │ │  │ │ [note]             │ │
│ │ [input+eye 48]       │ │  │ │ [input+eye 48]     │ │
│ │ Model                │ │  │ │ Model              │ │
│ │ [input 48]           │ │  │ │ [input 48]         │ │
│ │ ─────── 1px ──────── │ │  │ │ ───── 1px ──────── │ │
│ │ [Keyinroq sozlayman] │ │  │ │ [Keyinroq...]      │ │
│ │ [  DAVOM ETISH 48  ] │ │  │ │ [DAVOM ETISH 48]   │ │
│ └──────────────────────┘ │  │ └────────────────────┘ │
│          620              │  │         375           │
└──────────────────────────┘  └────────────────────────┘
```

## B.3 Geometry tables

| Element | 1440 | 900 | 620 | 375 | Grid/token |
|---------|------|-----|-----|-----|------------|
| Story / form split | 42% / 58% (605/835) | 100% form, story hidden | same | same | `42fr / 58fr` |
| Story padding | 48 / 64 | — | — | — | `--pm-s-6 / s-7` |
| Story h1 / line-height | 40 / 1.08 | — | — | — | `--pm-fs-40` |
| Main padding | 32 | 32 | 16 | 16 | `--pm-s-5 / s-3` |
| Card width / padding | 560 / 32 | 560 / 32 | 100% / 16 | 100% / 16 | 560=70×8, `--pm-s-5/s-3` |
| Card radius / shadow | 24 / shadow-2 | 24 / shadow-2 | 16 / shadow-2 | 16 / shadow-2 | `--pm-r-lg → --pm-r` |
| Steps: columns / gap / mb | 3 / 8 / 32 | 3 / 8 / 32 | 3 / 8 / 24 | 3 / 8 / 24 | `--pm-s-1 · s-5/s-4` |
| Step badge / label | 24 / 13px | 24 / 13px | 32 / sr-only | 32 / sr-only | 24=3×8, `--pm-fs-13` |
| Step rule | 2px, pb 12 | 2px, pb 12 | 2px, pb 12 | 2px, pb 12 | `--pm-s-2` |
| Step gap (content) | 16 | 16 | 16 | 16 | `--pm-s-3` |
| Provider rows: count / gap | 3 stacked / 8 | 3 / 8 | 3 / 8 | 3 / 8 | `--pm-s-1` |
| Provider row padding / min-h | 16 / 64 | 16 / 64 | 12 / 64 | 12 / 64 | `--pm-s-3/s-2` |
| Tavsiya chip | 28h, inset 12 | 28h, inset 12 | 28h, inset 12 | 28h, **static** | chip recipe |
| Note padding / radius / gap | 16 / 16 / 12 | same | 16 / 16 / 12 | 12 / 16 / 12 | `--pm-s-3/s-2` |
| Input / eye height | 48 / 48 | 48 / 48 | 48 / 48 | 48 / 48 | 48=6×8 |
| Action row: mt / pt | 16(+16 gap)=32 / 24 | same | same | same | `--pm-s-3 / s-4` |
| Primary / ghost height | 48 / 44 | 48 / 44 | 48 / 44 (full width) | 48 / 44 (full width) | button recipes |
| Dropzone padding | 32/24 | 32/24 | 32/24 | 24/16 | `--pm-s-5/s-4 → s-4/s-3` |
| Demo icon / padding | 48 / 16 | 48 / 16 | 48 / 16 | 48 / 16 | `--pm-s-6 / s-3` |

## B.4 Paste-ready declarations — Onboarding

> **Token request for the story panel (see §C):** `--pm-aside-from`, `--pm-aside-to`, `--pm-on-dark`, `--pm-on-dark-2`, `--pm-on-dark-3`, `--pm-on-dark-accent`. Declarations below reference them; they must be added to `00-tokens.css` by that file's owner (no literal hex in this layer).

```css
/* ===== premium/31-onboarding.css — L06 layout spec ===== */

/* O-1 split */
.nx-onboarding {
  display: grid;
  grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
  min-height: 100vh;
  background: var(--pm-bg);
}

/* O-13 story panel — gradient stays only here (hero exception) */
.nx-onboarding-aside {
  display: flex; flex-direction: column;
  padding: var(--pm-s-6) clamp(var(--pm-s-5), 5vw, var(--pm-s-7));
  color: var(--pm-on-dark);
  background:
    radial-gradient(ellipse 70% 50% at 80% 10%, color-mix(in srgb, var(--pm-aside-to) 40%, transparent), transparent 70%),
    radial-gradient(ellipse 60% 50% at 10% 90%, color-mix(in srgb, var(--pm-sage) 30%, transparent), transparent 70%),
    linear-gradient(155deg, var(--pm-aside-from), var(--pm-aside-to) 70%);
  overflow: hidden;
}
.nx-onboarding-brand { gap: var(--pm-s-1); font-size: var(--pm-fs-20); color: var(--pm-on-dark); }
.nx-onboarding-mark {
  display: grid; place-items: center; width: 40px; height: 40px;
  border-radius: var(--pm-r-sm);
  background: color-mix(in srgb, var(--pm-on-dark) 14%, transparent);
}
.nx-onboarding-quote { margin: auto 0; }
.nx-onboarding-quote .nx-eyebrow {
  color: var(--pm-on-dark-accent); font-size: var(--pm-fs-12);
  font-weight: 700; letter-spacing: 0.08em; text-transform: none;
}
.nx-onboarding-quote h1 {
  font-family: var(--pm-font-display); font-size: var(--pm-fs-40);
  font-weight: 600; line-height: 1.08; letter-spacing: -0.035em;
  margin: var(--pm-s-4) 0;
}
.nx-onboarding-quote h1 em { color: var(--pm-on-dark-accent); font-style: italic; }
.nx-onboarding-quote p {
  max-width: 42ch; font-size: var(--pm-fs-14); line-height: 1.7;
  color: var(--pm-on-dark-2);
}
.nx-onboarding-features { gap: var(--pm-s-2); }
.nx-onboarding-features > div {
  display: flex; align-items: center; gap: var(--pm-s-1);
  font-size: var(--pm-fs-13); color: var(--pm-on-dark-2);
}
.nx-onboarding-features svg { color: var(--pm-on-dark-accent); }
.nx-onboarding-aside-foot {
  margin-top: var(--pm-s-5); font-size: var(--pm-fs-12);
  letter-spacing: 0.08em; text-transform: none; color: var(--pm-on-dark-3);
}

/* O-3/O-4 card */
.nx-onboarding-main {
  display: flex; align-items: center; justify-content: center;
  padding: var(--pm-s-5); overflow-y: auto; background: var(--pm-bg);
}
.nx-onboarding-card {
  width: min(560px, 100%); margin: auto 0;
  padding: var(--pm-s-5);
  border: 0; border-radius: var(--pm-r-lg);
  background: var(--pm-surface); box-shadow: var(--pm-shadow-2);
}

/* O-5 steps */
.nx-onboarding-steps {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--pm-s-1); margin: 0 0 var(--pm-s-5);
  padding: 0; list-style: none;
}
.nx-onboarding-steps li {
  position: relative;
  display: flex; align-items: center; gap: var(--pm-s-1);
  min-width: 0; padding-bottom: var(--pm-s-2);
  border-bottom: 2px solid var(--pm-line);
  color: var(--pm-ink-3); font-size: var(--pm-fs-13);
  font-weight: 600; line-height: 1.3;
}
.nx-onboarding-steps li > span:first-child {
  display: grid; place-items: center; width: 24px; height: 24px; flex: 0 0 auto;
  border-radius: var(--pm-r-sm); background: var(--pm-surface-2);
  color: var(--pm-ink-3); font-size: var(--pm-fs-12);
  font-variant-numeric: tabular-nums;
}
.nx-onboarding-steps li.is-active { border-color: var(--pm-accent); color: var(--pm-accent); }
.nx-onboarding-steps li.is-active > span:first-child {
  background: var(--pm-accent); color: var(--pm-surface);
}
.nx-onboarding-steps li.is-done { border-color: var(--pm-sage); color: var(--pm-sage); }
.nx-onboarding-steps li.is-done > span:first-child {
  background: var(--pm-sage-soft); color: var(--pm-sage);
}

/* O-7 step header + O-8 providers + O-9 tag + O-10 note */
.nx-onboarding-step { display: flex; flex-direction: column; gap: var(--pm-s-3); }
.nx-onboarding-step .nx-eyebrow {
  font-size: var(--pm-fs-12); font-weight: 700;
  letter-spacing: 0.08em; text-transform: none; color: var(--pm-accent);
}
.nx-onboarding-step .nx-title--sm {
  font-family: var(--pm-font-display); font-size: var(--pm-fs-30);
  font-weight: 600; letter-spacing: -0.035em;
}
.nx-onboarding-step .nx-subtitle {
  margin-top: -8px; font-size: var(--pm-fs-16); color: var(--pm-ink-2);
}
.nx-onb-providers { display: flex; flex-direction: column; gap: var(--pm-s-1); }
.nx-onb-provider {
  position: relative; display: flex; flex-direction: column; gap: var(--pm-s-1);
  min-height: 64px; padding: var(--pm-s-3);
  border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm);
  background: var(--pm-surface); color: var(--pm-ink); text-align: left;
}
.nx-onb-provider.is-active {
  border-color: var(--pm-accent); background: var(--pm-accent-soft);
}
.nx-onb-provider b { font-size: var(--pm-fs-14); font-weight: 700; }
.nx-onb-provider small { font-size: var(--pm-fs-13); color: var(--pm-ink-3); line-height: 1.4; }
.nx-onb-provider__tag {
  position: absolute; top: var(--pm-s-2); right: var(--pm-s-2);
  display: inline-flex; align-items: center; height: 28px;
  padding: 0 var(--pm-s-2); border-radius: var(--pm-r-pill);
  background: var(--pm-brass-soft); color: var(--pm-brass);
  font-size: var(--pm-fs-12); font-weight: 700;
  letter-spacing: 0; text-transform: none;
}
.nx-onb-note {
  display: flex; align-items: flex-start; gap: var(--pm-s-2);
  padding: var(--pm-s-3); border: 0; border-radius: var(--pm-r);
  background: var(--pm-accent-soft); color: var(--pm-ink-2);
  font-size: var(--pm-fs-13); line-height: 1.6;
}
.nx-onb-note svg { width: 18px; height: 18px; flex: 0 0 auto; color: var(--pm-accent); }
.nx-onb-note b { color: var(--pm-accent); font-weight: 700; }

/* O-14 form internals */
.nx-onboarding-step .nx-label { font-size: var(--pm-fs-14); font-weight: 700; color: var(--pm-ink); }
.nx-onboarding-step .nx-hint { font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-onboarding .nx-input {
  height: 48px; padding: 0 var(--pm-s-3);
  border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm);
  background: var(--pm-surface); color: var(--pm-ink); font-size: var(--pm-fs-14);
}
.nx-onboarding .nx-key-wrap { gap: var(--pm-s-1); }
.nx-onboarding .nx-icon-btn {
  width: 48px; height: 48px; flex: 0 0 auto;
  border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm);
  background: var(--pm-surface); color: var(--pm-ink-2);
}
.nx-onb-drop {
  display: flex; flex-direction: column; align-items: center; gap: var(--pm-s-1);
  padding: var(--pm-s-5) var(--pm-s-4);
  border: 1px dashed var(--pm-line-strong); border-radius: var(--pm-r);
  background: color-mix(in srgb, var(--pm-accent) 4%, var(--pm-surface));
  color: var(--pm-ink-2);
}
.nx-onb-drop b { font-size: var(--pm-fs-14); color: var(--pm-ink); }
.nx-onb-drop small { font-size: var(--pm-fs-12); }
.nx-onb-demo {
  display: flex; align-items: center; gap: var(--pm-s-3);
  padding: var(--pm-s-3); border: 0; border-radius: var(--pm-r);
  background: var(--pm-surface-2);
}
.nx-onb-demo__icon {
  display: grid; place-items: center; width: 48px; height: 48px; flex: 0 0 auto;
  border-radius: var(--pm-r-sm); background: var(--pm-sage-soft); color: var(--pm-sage);
}
.nx-onb-demo__body { flex: 1 1 auto; min-width: 0; }
.nx-onb-demo b { font-size: var(--pm-fs-14); }
.nx-onb-demo .nx-hint { margin-top: var(--pm-s-1); }

/* O-11 action row — one focal CTA */
.nx-onb-actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--pm-s-2);
  margin-top: var(--pm-s-3);      /* + parent 16px gap = 32px total */
  padding-top: var(--pm-s-4);
  border-top: 1px solid var(--pm-line);
}
.nx-onb-actions .nx-btn--primary {
  height: 48px; padding: 0 var(--pm-s-4);
  border: 0; border-radius: var(--pm-r-sm);
  background: var(--pm-accent); color: var(--pm-surface); font-size: var(--pm-fs-14);
}
.nx-onb-actions .nx-btn--ghost,
.nx-onb-actions .nx-btn--soft {
  height: 44px; padding: 0 var(--pm-s-3);
  border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm);
  background: transparent; color: var(--pm-ink-2); font-size: var(--pm-fs-14);
}

/* O-2/O-6/O-9/O-12 responsive */
@media (max-width: 900px) {
  .nx-onboarding { grid-template-columns: minmax(0, 1fr); }
  .nx-onboarding-aside { display: none; }
  .nx-onboarding-main { padding: var(--pm-s-5); }
}
@media (max-width: 620px) {
  .nx-onboarding-main { padding: var(--pm-s-3); }
  .nx-onboarding-card { padding: var(--pm-s-3); border-radius: var(--pm-r); }
  .nx-onboarding-steps { margin-bottom: var(--pm-s-4); }
  .nx-onboarding-steps li { justify-content: center; }
  .nx-onboarding-steps li > span:first-child { width: 32px; height: 32px; }
  .nx-onboarding-steps li > span:last-child {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap;
  }
  .nx-onb-provider { padding: var(--pm-s-2); }
  .nx-onb-actions { flex-direction: column; align-items: stretch; }
  .nx-onb-actions .nx-btn { width: 100%; }
  .nx-onb-demo { flex-wrap: wrap; }
  .nx-onb-demo__body { flex: 1 1 calc(100% - 60px); }
  .nx-onb-demo .nx-btn { width: 100%; }
}
@media (max-width: 375px) {
  .nx-onb-provider__tag {
    position: static; align-self: flex-start; margin-top: var(--pm-s-1);
  }
  .nx-onb-note { padding: var(--pm-s-2); }
  .nx-onb-drop { padding: var(--pm-s-4) var(--pm-s-3); }
}

/* Focus */
.nx-onboarding :is(button, input, a, [role='button']):focus-visible {
  outline: 2px solid var(--pm-accent); outline-offset: 3px;
  box-shadow: none;
}
```

---

# C. Risks / owner requests

| # | Issue | Owner action |
|---|-------|--------------|
| **R-1** | `Settings.tsx` sets inline `style={{ gap: 24 }}` on the profile/AI panel bodies and `gap: 20` on Data. Inline styles beat author CSS without `!important` (forbidden by spec §8.3), so the decided 32px group rhythm cannot be enforced from CSS alone. | **TSX owner**: remove the three inline `gap` props; premium CSS then supplies `--pm-s-5`. Until then the effective group gap stays 24/20 — a known, visible deviation. |
| **R-2** | Story panel needs theme-independent light-on-brown values. Requested additions to `00-tokens.css`: `--pm-aside-from:#7A3A22`, `--pm-aside-to:#3F2A24`, `--pm-on-dark:#F5EFE4`, `--pm-on-dark-2:rgba(245,239,228,.78)`, `--pm-on-dark-3:rgba(245,239,228,.56)`, `--pm-on-dark-accent:#E8C69A`. | **Token owner** add them (light + dark blocks; same values in both, panel is always dark). |
| **R-3** | `01-qadam` eyebrow uses `text-transform: uppercase` from `nx/foundation.css` `.nx-eyebrow`. Premium selectors set `text-transform: none` but must import after foundation (they do, per `premium/index.css`). | No action beyond keeping import order. |
| **R-4** | `.nx-onboarding-quote h1` is an `<h1>` and step titles are `<h2>` — heading order is fine; keep `tabIndex={-1}` + `headingRef.focus()` on step change (already in TSX). | Preserve as-is; do not remove focus management. |
| **R-5** | At ≤620 hiding step labels visually requires the sr-only technique (included) — screen readers still announce "01 AI ulash". | QA check with a screen reader; do not swap to `display:none`. |
| **R-6** | Button radius 12px in spec §5 has no token; declarations use `--pm-r-sm` (10px) to honor "only `--pm-*` tokens". | Either accept 10px or have token owner add `--pm-r-btn:12px`. Decision here: **accept 10px**. |

## Verification checklist (for the implementing agents)
- 1440: nav 256 / gap 32 / content 1056; card 560×32; split 605/835 measurable.
- 900: nav is one scrollable row, foot hidden, story hidden, card centered 560.
- 620: setting rows stacked, avatar 6 columns, steps badges-only, actions stacked full width.
- 375: avatar 4 columns, Tavsiya tag static, inputs full width, no horizontal page scroll.
- Focus ring `2px` / offset `3px` on all interactive elements; reduced-motion rules from legacy layer remain effective.
