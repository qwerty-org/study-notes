# K01 — Refined Warm Stone

**Decision:** one palette, no alternatives. Replace the rust `#A94F2A` + beige `#F4F0E8` identity with a cool, mineral **slate-teal** accent on quiet, desaturated **warm-stone** neutrals. Same editorial structure, same Fraunces/Manrope typography, same radii and spacing — only the colour changes. This is round 2, direction K01.

---

## 1. Full token tables (exact hex)

### 1.1 Light theme (`:root`)

| Token | New hex | Role |
|---|---|---|
| `--pm-bg` | `#F5F3F0` | Page canvas — pale limestone, grey-leaning, not yellow |
| `--pm-surface` | `#FCFBF9` | Cards, popovers, topbar |
| `--pm-surface-2` | `#ECE9E3` | Quiet wells, chips, quick-action tiles |
| `--pm-surface-3` | `#E1DED6` | Deeper wells, progress tracks |
| `--pm-ink` | `#232521` | Primary text / display — deep warm graphite |
| `--pm-ink-2` | `#53554F` | Secondary text, labels |
| `--pm-ink-3` | `#686961` | Tertiary text, captions, metadata |
| `--pm-line` | `#E3E0D9` | Hairlines, dividers |
| `--pm-line-strong` | `#CAC6BC` | Input borders, dividers needing weight |
| `--pm-accent` | `#3D615C` | **Only** accent — deep mineral slate-teal |
| `--pm-accent-soft` | `#E7EFEC` | Accent tint chips, focus halo, soft hover |
| `--pm-accent-hover` | `#314F4B` | Accent pressed/hover |
| `--pm-on-accent` | `#FFFFFF` | Text/icon on accent fills |
| `--pm-hero-gold` | `#DCCDB0` | Hero/story eyebrow + italic em, only on deep hero |
| `--pm-hero-ink` | `#F4F1EA` | Hero/story headings on deep hero gradient |
| `--pm-sage` | `#6E8579` | Muted sage — completion glyph / quiz-correct only |
| `--pm-sage-soft` | `#E9EFEA` | Sage tint, only with `--pm-sage` |
| `--pm-brass` | `#998563` | Muted brass — folio numbers only |
| `--pm-brass-soft` | `#F0EBE0` | Brass tint, only with `--pm-brass` |
| `--pm-danger` | `#A64B47` | Destructive outline text/border |
| `--pm-danger-soft` | `#F5E8E6` | Destructive hover/fill |
| `--pm-reader-paper` | `#FEFCF8` | Reader paper — *new in light* (was undefined) |
| `--pm-control-border` | `#D6D2C9` | Control border — *new in light* (was undefined) |
| `--pm-transparent` | `transparent` | Unchanged |
| `--pm-shadow-1` | `0 1px 2px rgba(35, 37, 33, 0.04), 0 8px 24px rgba(35, 37, 33, 0.05)` | Low lift |
| `--pm-shadow-2` | `0 2px 8px rgba(35, 37, 33, 0.05), 0 24px 60px rgba(35, 37, 33, 0.07)` | Modal / popover lift |
| `--pm-shadow-focus` | `0 0 0 3px var(--pm-accent-soft)` | Focus halo |

### 1.2 Dark theme (`[data-theme='dark']`)

| Token | New hex | Role |
|---|---|---|
| `--pm-bg` | `#1B1C1A` | Page canvas — neutral charcoal, no brown cast |
| `--pm-surface` | `#242623` | Cards, popovers, topbar |
| `--pm-surface-2` | `#2E302C` | Wells, chips, quick-action tiles |
| `--pm-surface-3` | `#383A35` | Deeper wells, hero gradient start |
| `--pm-ink` | `#F2F1EC` | Primary text / display |
| `--pm-ink-2` | `#CBCBC3` | Secondary text |
| `--pm-ink-3` | `#9C9D94` | Tertiary text |
| `--pm-line` | `#3A3C37` | Hairlines |
| `--pm-line-strong` | `#5D6059` | Stronger borders |
| `--pm-accent` | `#8FBDB4` | Muted slate-teal, lightened for dark canvas |
| `--pm-accent-soft` | `#25332F` | Accent tint / focus halo |
| `--pm-accent-hover` | `#A6CFC7` | Accent hover |
| `--pm-on-accent` | `#1B1C1A` | Dark text on light accent fill |
| `--pm-hero-gold` | `#DCCDB0` | Same warm chalk-gold as light |
| `--pm-hero-ink` | `#F2F1EC` | Hero text on dark gradient |
| `--pm-sage` | `#93A99C` | Completion glyph / quiz-correct only |
| `--pm-sage-soft` | `#26302A` | Sage tint |
| `--pm-brass` | `#C0AC86` | Folio numbers only |
| `--pm-brass-soft` | `#302A20` | Brass tint |
| `--pm-danger` | `#D98A82` | Destructive outline text/border |
| `--pm-danger-soft` | `#3A2624` | Destructive hover/fill |
| `--pm-reader-paper` | `#242622` | Reader paper, distinct from surface |
| `--pm-control-border` | `#55584F` | Control border |
| `--pm-transparent` | `transparent` | Unchanged |
| `--pm-shadow-1` | `inset 0 1px 0 rgba(242, 241, 236, 0.05), 0 10px 28px rgba(0, 0, 0, 0.45)` | Low lift |
| `--pm-shadow-2` | `inset 0 1px 0 rgba(242, 241, 236, 0.07), 0 28px 64px rgba(0, 0, 0, 0.55)` | Modal / popover lift |
| `--pm-shadow-focus` | `0 0 0 3px var(--pm-accent-soft)` | Focus halo |

Non-colour tokens (`--pm-r-*`, `--pm-s-*`, `--pm-fs-*`, `--pm-d-*`, `--pm-ease-*`, `--pm-font*`) are **unchanged**.

---

## 2. Explicit old → new mapping

### Light

| Token | Old | New |
|---|---|---|
| `--pm-bg` | `#faf8f4` | `#F5F3F0` |
| `--pm-surface` | `#ffffff` | `#FCFBF9` |
| `--pm-surface-2` | `#f4f0e8` | `#ECE9E3` |
| `--pm-surface-3` | `#ede7dc` | `#E1DED6` |
| `--pm-ink` | `#1f1b15` | `#232521` |
| `--pm-ink-2` | `#4b4337` | `#53554F` |
| `--pm-ink-3` | `#746a5b` | `#686961` |
| `--pm-line` | `#e9e3d8` | `#E3E0D9` |
| `--pm-line-strong` | `#d8cfbe` | `#CAC6BC` |
| `--pm-accent` | `#a94f2a` | `#3D615C` |
| `--pm-accent-soft` | `#f7eae3` | `#E7EFEC` |
| `--pm-accent-hover` | `#964421` | `#314F4B` |
| `--pm-on-accent` | `#ffffff` | `#FFFFFF` (unchanged, still valid) |
| `--pm-hero-gold` | `#dcc08a` | `#DCCDB0` |
| `--pm-hero-ink` | `#f5efe4` | `#F4F1EA` |
| `--pm-sage` | `#4f6b5d` | `#6E8579` |
| `--pm-sage-soft` | `#e8f0ea` | `#E9EFEA` |
| `--pm-brass` | `#a88342` | `#998563` |
| `--pm-brass-soft` | `#f5eedf` | `#F0EBE0` |
| `--pm-danger` | `#b5473d` | `#A64B47` |
| `--pm-danger-soft` | `#f7e9e7` | `#F5E8E6` |
| `--pm-reader-paper` | *(undefined — fell back)* | `#FEFCF8` |
| `--pm-control-border` | *(undefined — fell back)* | `#D6D2C9` |
| `--pm-shadow-1/2` | `rgba(31, 27, 21, …)` | `rgba(35, 37, 33, …)` |

### Dark

| Token | Old | New |
|---|---|---|
| `--pm-bg` | `#15130f` | `#1B1C1A` |
| `--pm-surface` | `#1e1b16` | `#242623` |
| `--pm-surface-2` | `#27231c` | `#2E302C` |
| `--pm-surface-3` | `#302b23` | `#383A35` |
| `--pm-ink` | `#f5efe4` | `#F2F1EC` |
| `--pm-ink-2` | `#cfc4b2` | `#CBCBC3` |
| `--pm-ink-3` | `#9e9383` | `#9C9D94` |
| `--pm-line` | `#373127` | `#3A3C37` |
| `--pm-line-strong` | `#7a6e59` | `#5D6059` |
| `--pm-accent` | `#e69a6c` | `#8FBDB4` |
| `--pm-accent-soft` | `#3a281f` | `#25332F` |
| `--pm-accent-hover` | `#f0ad83` | `#A6CFC7` |
| `--pm-on-accent` | `#15130f` | `#1B1C1A` |
| `--pm-hero-gold` | `#cbaa72` | `#DCCDB0` |
| `--pm-hero-ink` | `#f5efe4` | `#F2F1EC` |
| `--pm-sage` | `#93b5a3` | `#93A99C` |
| `--pm-sage-soft` | `#25332b` | `#26302A` |
| `--pm-brass` | `#d9b46e` | `#C0AC86` |
| `--pm-brass-soft` | `#33291b` | `#302A20` |
| `--pm-danger` | `#e07b6f` | `#D98A82` |
| `--pm-danger-soft` | `#2e1d1a` | `#3A2624` |
| `--pm-reader-paper` | `#221f18` | `#242622` |
| `--pm-control-border` | `#4e4638` | `#55584F` |
| `--pm-shadow-1/2` | `rgba(255, 244, 224, …)` inset | `rgba(242, 241, 236, …)` inset |

The single semantic move: **accent hue 18° rust → 174° mineral teal, saturation cut ~45%, and every warm surface desaturated toward neutral stone.** Ink loses its brown bias. Gold becomes chalk-gold, not butter-gold.

---

## 3. WCAG 2.1 contrast verification (computed, sRGB)

All values are computed with the standard relative-luminance formula. Threshold: **≥4.5:1 body**, ≥3:1 large text/UI. The hero gradient's mid stop is `color-mix(in srgb, var(--pm-accent) 40%, var(--pm-ink-2))` = `#4A5A54`; it is listed because that is the lightest point of the story panel.

| # | Pair (foreground / background) | Ratio | Use | Pass |
|---|---|---:|---|---|
| 1 | `--pm-ink #232521` / `--pm-bg #F5F3F0` | **13.96:1** | body text — light | ✅ AAA |
| 2 | `--pm-ink #232521` / `--pm-surface #FCFBF9` | **14.95:1** | display headings — light | ✅ AAA |
| 3 | `--pm-ink-2 #53554F` / `--pm-bg #F5F3F0` | **6.82:1** | secondary text — light | ✅ AA |
| 4 | `--pm-ink-2 #53554F` / `--pm-surface-2 #ECE9E3` | **6.23:1** | tile labels — light | ✅ AA |
| 5 | `--pm-ink-3 #686961` / `--pm-surface #FCFBF9` | **5.37:1** | captions — light | ✅ AA |
| 6 | `--pm-ink-3 #686961` / `--pm-bg #F5F3F0` | **5.01:1** | metadata — light | ✅ AA |
| 7 | `--pm-ink-3 #686961` / `--pm-surface-2 #ECE9E3` | **4.58:1** | chip text — light | ✅ AA |
| 8 | `--pm-on-accent #FFFFFF` / `--pm-accent #3D615C` | **6.86:1** | primary button — light | ✅ AA |
| 9 | `--pm-on-accent #FFFFFF` / `--pm-accent-hover #314F4B` | **8.93:1** | primary hover — light | ✅ AAA |
| 10 | `--pm-accent #3D615C` / `--pm-accent-soft #E7EFEC` | **5.86:1** | soft chip text — light | ✅ AA |
| 11 | `--pm-accent #3D615C` / `--pm-surface #FCFBF9` | **6.63:1** | links, active nav label | ✅ AA |
| 12 | `--pm-danger #A64B47` / `--pm-danger-soft #F5E8E6` | **4.72:1** | destructive hover — light | ✅ AA |
| 13 | `--pm-danger #A64B47` / `--pm-surface #FCFBF9` | **5.46:1** | destructive outline label | ✅ AA |
| 14 | `--pm-hero-ink #F4F1EA` / hero mid `#4A5A54` | **6.46:1** | story heading — light | ✅ AA |
| 15 | `--pm-hero-gold #DCCDB0` / hero mid `#4A5A54` | **4.65:1** | 12px story eyebrow — light | ✅ AA |
| 16 | `--pm-ink #232521` / `--pm-reader-paper #FEFCF8` | **15.09:1** | reader body — light | ✅ AAA |
| 17 | `--pm-ink #F2F1EC` / `--pm-bg #1B1C1A` | **15.13:1** | body text — dark | ✅ AAA |
| 18 | `--pm-ink #F2F1EC` / `--pm-surface #242623` | **13.49:1** | headings — dark | ✅ AAA |
| 19 | `--pm-ink-2 #CBCBC3` / `--pm-surface-2 #2E302C` | **8.17:1** | tile labels — dark | ✅ AA |
| 20 | `--pm-ink-3 #9C9D94` / `--pm-surface #242623` | **5.57:1** | captions — dark | ✅ AA |
| 21 | `--pm-on-accent #1B1C1A` / `--pm-accent #8FBDB4` | **8.23:1** | primary button — dark | ✅ AAA |
| 22 | `--pm-on-accent #1B1C1A` / `--pm-accent-hover #A6CFC7` | **10.08:1** | primary hover — dark | ✅ AAA |
| 23 | `--pm-accent #8FBDB4` / `--pm-accent-soft #25332F` | **6.34:1** | soft chip — dark | ✅ AA |
| 24 | `--pm-accent #8FBDB4` / `--pm-bg #1B1C1A` | **8.23:1** | links — dark | ✅ AAA |
| 25 | `--pm-danger #D98A82` / `--pm-danger-soft #3A2624` | **5.33:1** | destructive hover — dark | ✅ AA |
| 26 | `--pm-ink #F2F1EC` / `--pm-reader-paper #242622` | **13.50:1** | reader body — dark | ✅ AAA |

**Summary: 26/26 pairs pass. Minimum body-text ratio is 4.58:1; minimum accent fill ratio is 6.86:1; minimum decorative/hero ratio is 4.65:1.** Contrast improved on every previously risky pair: white on old rust `#A94F2A` was 4.28:1; white on new teal is 6.86:1. Dark auto-fix comment about "white on light terracotta 2.28:1" is obsolete — dark still uses dark ink on the light accent because it scores 8.23:1.

---

## 4. Rationale (exactly three sentences)

Rust `#A94F2A` is a high-chroma warm hue that reads as an alarm signal against equally warm beige `#F4F0E8`, so the whole screen vibrates with competing warmth and the eye never gets a neutral place to rest. Refined Warm Stone keeps the editorial, paper-like identity but pulls every surface toward grey-leaning limestone and replaces the accent with a desaturated mineral slate-teal that recedes instead of advancing, giving the interface a quiet, gallery-like calm. The result feels more premium because colour is spent deliberately — one cool accent, one chalk-gold highlight, everything else stone — rather than broadcast across buttons, chips, underlines, covers and progress bars at once.

---

## 5. Usage rules (binding)

### 5.1 Accent coverage budget

- **≤5% of any viewport** may be painted `--pm-accent` (filled area). Count it, don't feel it.
- **Exactly one** filled primary button per view (`--pm-accent` / `--pm-on-accent`): "Kitob qo'shish", "O'qishni boshlash", "AI ni sozlash" — never two on the same screen.
- Accent may also appear only as: the 2px active-nav underline, focus rings (`outline: 2px solid var(--pm-accent)`, 3px offset), text links, and at most **two** soft accent chips per view.
- **Never** use accent as: a card background, a book-cover fill, a progress-bar fill, a chart hue, a number colour in the reader, or a large hero background. Progress tracks use `--pm-surface-3`; progress fill uses `--pm-accent` only as a **thin (≤6px) bar**, never a block.
- Brand mark may keep an accent fill (it is ≤32×32px).

### 5.2 Sage and brass — almost never

- `--pm-sage` / `--pm-sage-soft` are permitted **only** for: the 24px completion ring in the daily loop (`13-dashboard-loop.css`) and the quiz-correct marker (`27-quiz.css`). Nothing else. Not chips, not book covers, not nav, not tiles.
- `--pm-brass` / `--pm-brass-soft` are permitted **only** for: reader folio numbers (`24-book-reader.css`, `26-book-cards.css`) and the onboarding story eyebrow/`em` via `--pm-hero-gold`. Nothing else.
- Existing sage book-cover artwork is **content**, not UI: it may remain as a desaturated sage fill `#6E8579` with `--pm-hero-ink` text, but no new sage UI surfaces may be added.
- If a rule above conflicts with an old `/* small brass accent */` comment, this document wins.

### 5.3 Recipes

**Chip (passive)** — `background: var(--pm-surface-2)` `#ECE9E3`; `color: var(--pm-ink-2)`; `border: 1px solid var(--pm-line)`; radius `--pm-r-pill`. **Chip (active/selected)** — `background: var(--pm-accent-soft)` `#E7EFEC`; `color: var(--pm-accent)`; no border. **Chip (streak/AI status)** — always passive; never accent-filled. No chip may use sage or brass.

**Modal / popover** — `background: var(--pm-surface)`; `border: 1px solid var(--pm-line)`; `box-shadow: var(--pm-shadow-2)`; title `--pm-ink`, body `--pm-ink-2`, close icon `--pm-ink-3`; footer primary = one accent button, secondary = transparent button with `--pm-line-strong` border, destructive = transparent with `--pm-danger` border/text and `--pm-danger-soft` hover. Backdrop is never accent-tinted.

**Reader** — paper `var(--pm-reader-paper)` (`#FEFCF8` / `#242622`), body `var(--pm-ink)` via Fraunces at reading size, secondary `var(--pm-ink-2)`, horizontal rules `var(--pm-line)`, folio `var(--pm-brass)` at 24px tabular, quote rule `var(--pm-line-strong)`. **Zero accent inside the paper area** — the bookmark icon and side nav live outside the paper and use `--pm-ink-3`, with the active side item using a 2px `--pm-accent` left rule only.

**Hero/story panel** — keep the existing gradient `linear-gradient(155deg, color-mix(in srgb, var(--pm-accent) 40%, var(--pm-ink-2)), var(--pm-ink))`; with teal this becomes `#4A5A54 → #232521`, a calm mineral dusk rather than rust-to-brown. Gold text `#DCCDB0` is the only warm note and it passes 4.65:1 even at the lightest stop.

---

## 6. What the user will see

**Dashboard.** The cream cast is gone: the canvas is a soft neutral limestone, cards are almost-white stone, and the only saturated thing on screen is one deep teal "Kitob qo'shish"-style button plus a thin teal underline under the active nav item. The four quick-action tiles are quiet grey wells with graphite icons instead of rust-tinted icons, the streak chip is plain stone, and the progress bar is a slim teal line on a stone track. The sage ring appears once, on the completed step of the daily loop — and only then. The whole page reads as a calm, well-lit study desk rather than a warm-orange banner.

**Book.** The cover stays as artwork (desaturated sage or stone), but the surrounding page is cool limestone; the big Fraunces title is deep graphite, not brown-black. The single teal "O'qishni boshlash" button is the only filled colour; the quiz button becomes a quiet outlined control. Inside the reader, the paper is a clean off-white (#FEFCF8) with no orange quotation rule, only a soft graphite rule, and the page number is a small muted brass — the page finally recedes so the text is the only thing competing for attention. Dark mode mirrors this with charcoal-stone surfaces and a pale teal accent that no longer glows orange.
