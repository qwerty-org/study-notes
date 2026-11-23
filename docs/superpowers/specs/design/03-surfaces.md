# D03 — Surfaces, Shadow, Radius, Density (DESIGN DECISION, final)

> Law source: `docs/superpowers/specs/2026-11-23-premium-design-system.md` §4/§5 + `apps/desktop/src/styles/premium/00-tokens.css`.
> This document DECIDES. Element agents implement. No CSS is written here.
> Reviewed against `after-dashboard.png`, `after-library.png`, `after-settings.png`, `after-stats.png` (1440×900).

---

## 0. Diagnosis (what we are fixing)

All four screenshots show the same failure: **every region is a bordered + radius + shadowed white box, nested inside other bordered white boxes.**

| Screen | Framed boxes visible at 1440×900 (approx) | Problem |
|---|---|---|
| Dashboard | ≥20 — `.hero`, 3× `.grid-fit > .card`, 3× `.todo-row`, 4× `.qaction`, 4× `.stat`, 5× `.split .card`, `.book-row`s | frames inside frames; no focal point |
| Library | ~7 — 4× `.nx-library-stats .nx-stat`, `.nx-dropzone`, `.nx-book-card`, `.nx-book-add` | every stat is a card; dropzone competes with data |
| Settings | ~6 — `.nx-settings-nav`, `.nx-settings-content > .nx-panel`, 3× `.nx-setting-row`, reset row | panel inside panel; sidebar reads as a card |
| Stats | ~9 — `.nx-stats-hero`, 4× `.nx-stat`, `.nx-stats-activity`, `.nx-journal`, 2× `.nx-stats-bottom .nx-panel` | 4 stat cards + 3 more panels, all identical |

Root cause: legacy `.card` / `.nx-card` / `.nx-panel` / `.nx-stat` each set `border: 1.5px solid` + `border-radius` + `box-shadow` **by default**, so every wrapper became a frame. Premium layer fixes this by making "frame" an **opt-in** reserved for one element per screen.

---

## 1. Surface system (exact)

### 1.1 Token → role map

| Token | Light / Dark | Role | Frame? |
|---|---|---|---|
| `--pm-bg` | `#FAF8F4` / `#15130F` | Page canvas. The "paper". Default background of every region. | Never |
| `--pm-surface` | `#FFFFFF` / `#1E1B16` | **Focal fill only** — the one elevated panel/hero per screen; modals/popovers. | Yes (shadow-1 / shadow-2) |
| `--pm-surface-2` | `#F4F0E8` / `#27231C` | Flat grouped blocks: stat cells, setting rows, chart tracks, dropzone fill, hover. | No — flat |
| `--pm-transparent` *(NEW — see §7)* | `transparent` | Default fill for rows, actions, chips at rest, list sections. Page grain shows through. | No |
| `--pm-surface-3` | `#EDE7DC` / `#302B23` | **Do not use for surfaces.** Skeleton loading fill only. | No |

### 1.2 Border rule — when a border is allowed

A `1px solid var(--pm-line)` border is allowed **only** on:
1. **Form controls at rest**: `input`, `.nx-segmented`, ghost/secondary buttons.
2. **The dashed placeholder**: `.nx-dropzone`, `.nx-book-add` → `1px dashed var(--pm-line-strong)`.
3. **Hairline dividers**: `border-bottom` / `border-top: 1px solid var(--pm-line)` inside a section or between list rows — **never a full box outline**.

Forbidden everywhere else: `border: 1.5px` (legacy), full-box borders on `.card`/`.nx-card`/`.nx-panel`/`.nx-stat`/rows/nested cards, colored borders, `filter: drop-shadow`, multicolor/colored shadows, inner + outer double shadows.
Focus is `outline: 2px solid var(--pm-accent); outline-offset: 3px` — **not** a border. Do not use `--pm-shadow-focus` for keyboard focus.

### 1.3 Elevation — exact values (already in `00-tokens.css`, keep unchanged)

| Level | Token | Light value | Dark value | Where used |
|---|---|---|---|---|
| 0 | `none` | `box-shadow: none` | `box-shadow: none` | Default for **all** content: stats, rows, actions, nested blocks, chips, book cards. |
| 1 | `--pm-shadow-1` | `0 1px 2px rgba(31,27,21,.04), 0 8px 24px rgba(31,27,21,.05)` | `0 1px 2px rgba(0,0,0,.35), 0 10px 28px rgba(0,0,0,.28)` | **The single focal panel per screen** (`.hero`, `.nx-stats-hero`, `.nx-settings-content > .nx-panel`). Nothing else. |
| 2 | `--pm-shadow-2` | `0 2px 8px rgba(31,27,21,.05), 0 24px 60px rgba(31,27,21,.07)` | `0 4px 12px rgba(0,0,0,.4), 0 28px 64px rgba(0,0,0,.42)` | Overlays only: modal, popover, menu, toast. Never static page content. |

No elevation 3, no custom shadows, no `rgba` literals in element files (use tokens).

### 1.4 Radius — exact per component

| Component | Radius | Token |
|---|---|---|
| Focal panel / hero / primary modal | **24px** | `--pm-r-lg` |
| Standard framed card (book cover artwork, rare overlay card) | **16px** | `--pm-r` |
| Flat grouped block (`.nx-stat`, `.nx-setting-row`, `.nx-dropzone`, icon tile >40px) | **12px** | `--pm-r-control` *(NEW — §7)* |
| Button, input, `.nx-segmented`, small icon tile (≤40px), kbd | **12px / 10px** | `--pm-r-control` / `--pm-r-sm` |
| Chip, badge, avatar, ring, status pill | **999px** | `--pm-r-pill` |
| Open field / list row / divider / full-bleed section | **0** (inherits parent clip) | — |

`--pm-r-sm` stays 10px; do not round every nested box to 16px — smaller, flatter things get smaller radii.

---

## 2. The Container Budget — **"1 / 3 at 1440px"** (hard cap)

**Definition — "framed surface":** a region with BOTH (a) a fill distinct from `--pm-bg`, AND (b) a visible boundary (any border or any shadow).

> **At 1440×900: max 3 framed surfaces per screen — of which max 1 may use `--pm-shadow-1`. Target = 1.**
> Exempt from the count (but still shadow-free): form controls with 1px `--pm-line`, dashed placeholders, chips/badges, and book-cover artwork.
> No two adjacent siblings may both be framed. If a screen needs more structure, demote the second frame to a Type B flat block or a Type C open field (§5).

### 2.1 Per-screen budget & de-frame list (selectors named from DOM/screenshots)

**Dashboard — current ≥20 → target 1**
| Selector | Decision | New treatment |
|---|---|---|
| `.hero` | **KEEP — the focal frame** | `--pm-surface`, `--pm-shadow-1`, `border: 0`, radius 24, ultra-low-contrast gradient allowed here only |
| `.grid-fit > .card` (3: Bugungi reja / Tezkor amallar / Umumiy ko'rsatkichlar) | **DE-FRAME all 3** | `--pm-transparent`, `box-shadow: none`, `border: 0`; pad 0; use a top hairline `--pm-line` + 24px gap. Internal groups become Type B blocks. |
| `.card > .todo > .todo-row` | DE-FRAME | flat; `border-bottom: 1px solid var(--pm-line)` (last-child none); padding 12px 16px |
| `.qactions > .qaction` | DE-FRAME | flat Type B `--pm-surface-2` tile, radius 12, **no border, no shadow**, gap 12px |
| `.grid-2 > .stat` (dashboard) | DE-FRAME | flat Type B `--pm-surface-2`, radius 12, no border/shadow |
| `.split > .stack > .card` (Davom ettirish / Bugungi vaziyat / Kutubxonam / AI holati / Oxirgi faoliyat) | **DE-FRAME all 5** | flat on `--pm-bg`; separate with 1px top hairline + 32px vertical rhythm |
| `.book-row`, `.book-row.journal` | DE-FRAME | flat rows, bottom hairline only |

**Library — current ~7 → target 0 framed (2 dashed placeholders exempt)**
| Selector | Decision | New treatment |
|---|---|---|
| `.nx-library-stats .nx-stat` (4) | **DE-FRAME all 4** | flat on `--pm-bg`, no border/shadow; value uses `--pm-ink`; gap 16px; optional 1px vertical hairlines between cells |
| `.nx-dropzone` | **KEEP as the 1 dashed placeholder** | `1px dashed var(--pm-line-strong)`, fill `--pm-surface-2`, radius 16, **no shadow** |
| `.nx-book-card` | DE-FRAME | flat; `.nx-book-cover` artwork is the only colored field (radius 16, no shadow); body on `--pm-bg` |
| `.nx-book-add` | KEEP as dashed placeholder | `1px dashed var(--pm-line-strong)`, transparent, no shadow |
| `.nx-search-wrap input`, `.nx-segmented` | controls — exempt | 1px `--pm-line`, radius 12, no shadow |

**Settings — current ~6 → target 1**
| Selector | Decision | New treatment |
|---|---|---|
| `.nx-settings-content > .nx-panel` | **KEEP — the focal frame** | `--pm-surface`, `--pm-shadow-1`, border 0, radius 24, padding 32 |
| `.nx-settings-nav` | **DE-FRAME** | flat on `--pm-bg`, no border/shadow; active `.nx-settings-nav__item.is-active` = `--pm-accent-soft` fill + 2px left `--pm-accent` bar, radius 12, no frame |
| `.nx-setting-row`, `.nx-setting-row--muted`, `.nx-field` (nested) | DE-FRAME | flat children of the focal panel; muted rows may use `--pm-surface-2` **flat fill** (no border/shadow), radius 12; 1px divider between rows |
| `.nx-avatar-pick`, `.nx-provider` | controls — exempt | active = `--pm-accent-soft` + `--pm-accent` 1px; rest 1px `--pm-line`; no shadow |
| `.nx-panel__head` | keep divider | `border-bottom: 1px solid var(--pm-line)` inside the focal panel |

**Stats — current ~9 → target 1**
| Selector | Decision | New treatment |
|---|---|---|
| `.nx-stats-hero.nx-card` | **KEEP — the focal frame** | `--pm-surface`, `--pm-shadow-1`, border 0, radius 24; low-contrast gradient allowed here only |
| `.nx-stats-grid .nx-stat` (4: accent/success/warn/plain) | **DE-FRAME all 4** | flat Type B `--pm-surface-2`, radius 12, no border/shadow; gap 16px; status color only in the small icon |
| `.nx-stats-activity.nx-card`, `.nx-journal.nx-panel`, `.nx-stats-bottom .nx-panel` (incl `.nx-next-step`) | **DE-FRAME all 4** | flat sections on `--pm-bg`, top hairline `--pm-line`, 32px vertical rhythm; chart bars stay `--pm-surface-2` |
| `.nx-badge`, `.nx-chip` | exempt | pill, `--pm-surface-2` fill, no border/shadow |

---

## 3. Density — exact px

| Context | Value (≥900px) | ≤620px |
|---|---|---|
| Focal panel (Type A) internal padding | **32px** | 20px |
| Standard flat block (Type B) internal padding | **24px** | 20px |
| Flat stat cell / setting row padding | **16px 20px** | 12px 16px |
| List row (`todo-row`, `book-row`, timeline item) padding | **12px 16px** | 12px 16px |
| Gap between top-level framed/focal panels | **24px** | 16px |
| Grid gap between flat cells (`.nx-grid--4`, `.qactions`) | **16px** | 12px |
| Gap between major sections (`.nx-head`→stats→activity→journal) | **32px** | 24px |
| Gap within a group / `.stack` | **16px** | 12px |
| Icon ↔ text / chip ↔ label | **8px** | 8px |
| Hairline divider | **1px `--pm-line`** | same |
| Page top / bottom padding | **48px / 96px** | 24px / 64px |
| Topbar height | **72px** (already correct) | 72px |

Rule: flat cells may be tight (16px gap); framed surfaces must be airy (24–32px). Never pad a de-framed region as if it were still a card — remove the padding with the frame.

---

## 4. Paper texture — **KEEP, demote to canvas only**

**Decision: keep the grain, remove the wash, never apply grain to surfaces.**

Rationale: warm paper is part of the identity (spec §"o'tmishdan saqlanadigan"), and the grain is nearly invisible in the screenshots — it costs nothing and adds tactility. The failure mode would be re-applying it to each card, which would make every flat block look dirty.

Exact guidance:
1. **Single owner:** `--paper-grain` is defined in `theme.css` (token owner). Element agents must **not** redeclare it and must **not** add any `background-image` to `.pm-scope`, `.card`, `.nx-card`, `.nx-panel`, `.nx-stat`, `.nx-dropzone`, or chips.
2. **Apply only to** the page canvas `.main` and the reader paper `.nx-reader-paper` (book agent's scope). `.main` keeps `background-color: var(--pm-bg); background-image: var(--paper-grain); background-blend-mode: soft-light;`.
3. **Remove** the `radial-gradient(...)` wash from `.main` — the spec allows a gradient only in the hero/focal panel (`--pm-surface` with ≤6% accent), nowhere else. The hero/focal panel may keep its own ultra-low-contrast gradient.
4. **Reduce** the SVG rect `opacity` in `--paper-grain` from `.25` → **`.12`** (old→new in §7). Keep `180×180` tile, `feTurbulence baseFrequency .85`, `numOctaves 3`, `stitchTiles stitch`.
5. **Dark mode:** set `background-image: none` on `.main` (grain reads as noise on #15130F). Keep reader-paper grain unchanged — it is an intentional paper metaphor there.
6. No `filter: drop-shadow`, no colored shadow, no extra pseudo-element noise layers.

---

## 5. Three distinct surface types (how we avoid "all rounded cards, same shadow")

| Type | Name | Fill | Boundary | Shadow | Radius | Share of screen | Examples |
|---|---|---|---|---|---|---|---|
| **A** | **The Folio** (focal frame) | `--pm-surface` | **none** (no border at all) | `--pm-shadow-1` | 24px | ≤1 per screen | `.hero`, `.nx-stats-hero`, `.nx-settings-content > .nx-panel` |
| **B** | **The Leaf** (flat block) | `--pm-surface-2` | **none** | **none** | 12px | ~20–30% | `.nx-stat`, `.nx-setting-row`, `.qaction`, chart track, `.nx-dropzone` fill |
| **C** | **The Rule** (open field) | `--pm-transparent` | 1px hairline **divider only**, never a closed box | **none** | 0 / inherited | ≥60% (dominant) | `.split .card` after de-frame, `.todo-row`, `.book-row`, `.nx-journal` entries, page sections |

**Special — The Placeholder:** dashed `1px var(--pm-line-strong)`, transparent fill, no shadow, radius 16. Only for explicit empty/drop targets (`.nx-dropzone`, `.nx-book-add`). Exempt from budget but must stay shadow-free.

Differentiation guarantees:
- **Only Type A elevates.** If you reach for `box-shadow` and the element is not the single focal panel or an overlay, stop — it is a Type B or C.
- **Only Type A uses 24px radius**; B is 12px, C has no radius. Adjacent siblings must never share the same treatment.
- **Type C lets the page grain show through** — this is the signature of the new look: most content sits directly on paper, divided by rules and whitespace, not boxes.
- Accent (where needed) appears as a **2px left rule or bottom underline** on Type C, never as a glow/shadow.
- If a layout breaks the 1-A / 3-framed cap, demote the redundant frame: A → B (keep fill, drop shadow, shrink radius) or B → C (drop fill, add hairline).

---

## 6. Dark mode — surfaces & shadow

| Decision | Value / rule |
|---|---|
| Surface steps | Keep tokens: `--pm-bg #15130F` → `--pm-surface #1E1B16` → `--pm-surface-2 #27231C`. Each step ~1 level apart; the Folio reads via **shadow**, not border. |
| Borders | Almost none: 1px `--pm-line #373127` only on controls/dashed placeholders. **No full-box borders**, no 1.5px. |
| Elevation 1 (focal) | Keep `--pm-shadow-1` dark: `0 1px 2px rgba(0,0,0,.35), 0 10px 28px rgba(0,0,0,.28)` — stronger black-based, color-neutral. |
| Elevation 2 (overlay) | Keep `--pm-shadow-2` dark: `0 4px 12px rgba(0,0,0,.4), 0 28px 64px rgba(0,0,0,.42)`. |
| Type B in dark | `--pm-surface-2 #27231C` is already lighter than the Folio `#1E1B16` — it reads as "raised ink" without a shadow. Do not add one. |
| Accent | `#E69A6C` used only for focus/active/focal 2px rule. No colored glow. `--pm-accent-soft #3A281F` for active fills. |
| Grain | `.main` → `background-image: none` in dark (§4.5). Reader paper keeps grain. |
| Dividers | `--pm-line #373127` at 1px; `--pm-line-strong #4E4638` for dashed placeholder. Slightly higher contrast than light, but still hairline. |

---

## 7. `--pm-*` token changes — old → new

Everything else in `00-tokens.css` is **unchanged and confirmed** (shadow-1/2 dark + light values, radii 10/16/24/999, surface/ink/line/accent palette). Required deltas:

| Token | Old | New | Reason / owner |
|---|---|---|---|
| `--pm-transparent` | *(absent)* | **`transparent`** (both themes) | NEW. Gives element agents a legal "no fill" token — spec rule §8.2 forbids literal hex/rgb. Needed for every de-framed Type C region. **Add to `00-tokens.css` `:root`** (token owner, requested here). |
| `--pm-r-control` | *(absent)* | **`12px`** (both themes) | NEW. Reconciles spec §5 ("button radius 12px") with the token set (only 10/16/24/999 existed). Prevents agents from hard-coding 12px. **Add to `00-tokens.css`**. |
| `--paper-grain` *(in `theme.css`, not `--pm-*`)* | SVG rect `opacity=".25"` | SVG rect `opacity=".12"` | Reduce grain intensity; canvas-only (§4). Token owner to update. |
| `--pm-surface-3` | `#EDE7DC` / `#302B23` | *same values*, **usage restricted** | Do not use as a surface fill in Wave 3; skeleton/loading only. No value change. |
| `--pm-shadow-focus` | `0 0 0 3px var(--pm-accent-soft)` | *unchanged*, usage restricted | Soft halo for non-keyboard emphasis only. Keyboard focus stays `outline: 2px solid --pm-accent; offset 3px` (spec §5). |
| Legacy `--shadow-card`, `--shadow-pop`, `--nx-shadow*` | various | **do not use in premium layer** | Premium selectors must explicitly reset `box-shadow: none` on de-framed elements; premium imports last, so no `!important` needed (spec §8.3). |

---

## 8. Forwarded to element agents (what each owner must do)

- **Token owner (`00-tokens.css`)**: add `--pm-transparent: transparent;` and `--pm-r-control: 12px;`; keep all shadow/radius values as-is.
- **Theme/canvas owner (`theme.css`)**: grain opacity `.25 → .12`; remove radial wash from `.main`; `background-image: none` on `.main` in `[data-theme='dark']`.
- **Dashboard agents (`.12`–`.16`)**: keep `.hero` as sole Folio; de-frame every `.grid-fit > .card`, `.todo-row`, `.qaction`, `.stat`, `.split .card`, `.book-row` per §2.1.
- **Library agents (`.17`–`.20`)**: flat `.nx-stat` row; keep `.nx-dropzone` + `.nx-book-add` as the only dashed frames; de-frame `.nx-book-card`.
- **Settings agent (`.30`)**: keep `.nx-settings-content > .nx-panel` as sole Folio; de-frame `.nx-settings-nav` and nested `.nx-setting-row/.nx-field`.
- **Stats agent (`.29`)**: keep `.nx-stats-hero` as sole Folio; de-frame 4× `.nx-stat`, `.nx-stats-activity`, `.nx-journal`, `.nx-stats-bottom .nx-panel`.
- **All agents**: Type B = `--pm-surface-2` + radius 12 + **no border/shadow**; Type C = `--pm-transparent` + hairline divider only; never introduce a second shadow-1 surface; use only `--pm-*` tokens; keep focus rings, ARIA, reduced-motion intact.
