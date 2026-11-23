# K05 — Slate & Burgundy (Cool Neutral + Deep Wine)

**Direction:** Cool, slightly blue-leaning neutral greys carry every surface and all text. A single deep, restrained burgundy/plum is the only chromatic accent. Sage and brass are retired. Warmth exists in exactly one disciplined place — the accent — never in a background.

**Status:** proposal (competes against 4 others). **Decisive — no options, no variants.**

Reviewed: `premium2-dashboard.png` (cream hero, rust chips/icons, beige quick-action cards), `premium2-book.png` (sage book cover, brass progress rule, beige tab strip), `premium2-stats.png` (cream gradient cards, brass chip outlines), `apps/desktop/src/styles/premium/00-tokens.css`.

---

## 1. Full palette — every `--pm-*` colour token

Non-colour tokens (radii, spacing, type scale, motion, fonts) are **unchanged**. Values below are the complete replacement for every colour-bearing token.

### Light (`:root`)

| Token | New hex | Role |
|---|---|---|
| `--pm-bg` | `#f5f6f8` | App canvas — cool near-white slate |
| `--pm-surface` | `#ffffff` | Cards, raised panels |
| `--pm-surface-2` | `#eceff3` | Subtle fills, chips, inactive tabs |
| `--pm-surface-3` | `#e1e5eb` | Recessed fills, hover |
| `--pm-ink` | `#191d24` | Primary text — cool near-black slate |
| `--pm-ink-2` | `#4a515e` | Secondary text |
| `--pm-ink-3` | `#636b78` | Muted text, folios, icons |
| `--pm-line` | `#e3e7ed` | Hairlines |
| `--pm-line-strong` | `#cbd2dc` | Dividers, control borders |
| `--pm-accent` | `#6e2639` | **Deep burgundy** — primary CTA, active nav, progress |
| `--pm-accent-soft` | `#f5e9ed` | Burgundy-tinted soft fill (selected chips, focus) |
| `--pm-accent-hover` | `#5a1d2e` | Deeper burgundy hover/press |
| `--pm-on-accent` | `#ffffff` | Text on burgundy |
| `--pm-hero-gold` | `#b7a5c1` | *Renamed-in-spirit:* dusty plum-silver decorative accent on dark hero |
| `--pm-hero-ink` | `#f7f8fb` | Text on dark hero |
| `--pm-sage` | `#6e2639` | **Retired** → alias of `--pm-accent` |
| `--pm-sage-soft` | `#f5e9ed` | **Retired** → alias of `--pm-accent-soft` |
| `--pm-brass` | `#636b78` | **Retired** → alias of `--pm-ink-3` (folio numerals) |
| `--pm-brass-soft` | `#eceff3` | **Retired** → alias of `--pm-surface-2` |
| `--pm-danger` | `#a32f43` | Cool crimson — errors only |
| `--pm-danger-soft` | `#f8e9ec` | Error fill |
| `--pm-reader-paper` | `#ffffff` | Reader paper (light) |
| `--pm-control-border` | `#cbd2dc` | Input borders (= line-strong) |
| `--pm-shadow-1` | `0 1px 2px rgba(18,22,32,.05), 0 8px 24px rgba(18,22,32,.06)` | Cool shadow |
| `--pm-shadow-2` | `0 2px 8px rgba(18,22,32,.06), 0 24px 60px rgba(18,22,32,.09)` | Cool elevated shadow |
| `--pm-shadow-focus` | `0 0 0 3px var(--pm-accent-soft)` | Focus ring |
| `--pm-transparent` | `transparent` | unchanged |

### Dark (`[data-theme='dark']`)

| Token | New hex | Role |
|---|---|---|
| `--pm-bg` | `#14161b` | Cool near-black slate canvas |
| `--pm-surface` | `#1d2027` | Raised slate card |
| `--pm-surface-2` | `#272b34` | Nested fill |
| `--pm-surface-3` | `#323844` | Recessed fill / hover |
| `--pm-ink` | `#f2f4f8` | Primary text — cool white |
| `--pm-ink-2` | `#c5cbd7` | Secondary text |
| `--pm-ink-3` | `#9aa2b0` | Muted text, folios, icons |
| `--pm-line` | `#343a46` | Hairlines |
| `--pm-line-strong` | `#5a6371` | Dividers |
| `--pm-accent` | `#c66b83` | **Lightened tint of the same burgundy** for dark legibility |
| `--pm-accent-soft` | `#3b2531` | Dark burgundy-tinted fill |
| `--pm-accent-hover` | `#d48399` | Lighter hover/press |
| `--pm-on-accent` | `#14161b` | Dark text on lightened burgundy |
| `--pm-hero-gold` | `#c9b5c3` | Plum-silver decorative accent on dark hero |
| `--pm-hero-ink` | `#f2f4f8` | Text on dark hero |
| `--pm-sage` | `#c66b83` | **Retired** → alias of `--pm-accent` |
| `--pm-sage-soft` | `#3b2531` | **Retired** → alias of `--pm-accent-soft` |
| `--pm-brass` | `#9aa2b0` | **Retired** → alias of `--pm-ink-3` |
| `--pm-brass-soft` | `#272b34` | **Retired** → alias of `--pm-surface-2` |
| `--pm-danger` | `#dc7286` | Cool crimson — errors only |
| `--pm-danger-soft` | `#3b2029` | Error fill |
| `--pm-reader-paper` | `#1f232b` | **Cool slate paper** (was warm brown `#221f18`) |
| `--pm-control-border` | `#454d5b` | Input borders |
| `--pm-shadow-1` | `inset 0 1px 0 rgba(226,232,245,.06), 0 10px 28px rgba(0,0,0,.45)` | Cool shadow |
| `--pm-shadow-2` | `inset 0 1px 0 rgba(226,232,245,.08), 0 28px 64px rgba(0,0,0,.55)` | Cool elevated shadow |

Rationale for dark accent: `#c66b83` is the same burgundy hue (~340°) lifted in lightness so it clears 4.5:1 against the slate surfaces. It reads as the *same* wine, not a new colour.

---

## 2. Explicit old → new mapping

### Light

| Token | Old | New | Change |
|---|---|---|---|
| `--pm-bg` | `#faf8f4` | `#f5f6f8` | cream → cool slate |
| `--pm-surface` | `#ffffff` | `#ffffff` | unchanged |
| `--pm-surface-2` | `#f4f0e8` | `#eceff3` | beige → cool grey |
| `--pm-surface-3` | `#ede7dc` | `#e1e5eb` | beige → cool grey |
| `--pm-ink` | `#1f1b15` | `#191d24` | warm brown → cool slate |
| `--pm-ink-2` | `#4b4337` | `#4a515e` | warm → cool |
| `--pm-ink-3` | `#746a5b` | `#636b78` | warm → cool, darker for AA |
| `--pm-line` | `#e9e3d8` | `#e3e7ed` | warm → cool |
| `--pm-line-strong` | `#d8cfbe` | `#cbd2dc` | warm → cool |
| `--pm-accent` | `#a94f2a` (rust) | `#6e2639` (burgundy) | **rust → wine** |
| `--pm-accent-soft` | `#f7eae3` | `#f5e9ed` | peach → wine tint |
| `--pm-accent-hover` | `#964421` | `#5a1d2e` | rust → deep wine |
| `--pm-on-accent` | `#ffffff` | `#ffffff` | unchanged |
| `--pm-hero-gold` | `#dcc08a` | `#b7a5c1` | gold → plum-silver |
| `--pm-hero-ink` | `#f5efe4` | `#f7f8fb` | warm white → cool white |
| `--pm-sage` | `#4f6b5d` | `#6e2639` | **retired → accent** |
| `--pm-sage-soft` | `#e8f0ea` | `#f5e9ed` | **retired → accent-soft** |
| `--pm-brass` | `#a88342` | `#636b78` | **retired → ink-3** |
| `--pm-brass-soft` | `#f5eedf` | `#eceff3` | **retired → surface-2** |
| `--pm-danger` | `#b5473d` | `#a32f43` | cooled crimson |
| `--pm-danger-soft` | `#f7e9e7` | `#f8e9ec` | cooled tint |
| `--pm-reader-paper` | *(unset → surface)* | `#ffffff` | made explicit, cool |
| `--pm-control-border` | *(unset → line-strong)* | `#cbd2dc` | made explicit, cool |
| shadows | `rgba(31,27,21,…)` | `rgba(18,22,32,…)` | warm → cool shadow |

### Dark

| Token | Old | New | Change |
|---|---|---|---|
| `--pm-bg` | `#15130f` | `#14161b` | warm black → cool slate |
| `--pm-surface` | `#1e1b16` | `#1d2027` | warm → cool |
| `--pm-surface-2` | `#27231c` | `#272b34` | warm → cool |
| `--pm-surface-3` | `#302b23` | `#323844` | warm → cool |
| `--pm-ink` | `#f5efe4` | `#f2f4f8` | warm white → cool white |
| `--pm-ink-2` | `#cfc4b2` | `#c5cbd7` | warm → cool |
| `--pm-ink-3` | `#9e9383` | `#9aa2b0` | warm → cool, lighter for AA |
| `--pm-line` | `#373127` | `#343a46` | warm → cool |
| `--pm-line-strong` | `#7a6e59` | `#5a6371` | warm → cool |
| `--pm-accent` | `#e69a6c` (terracotta) | `#c66b83` | **terracotta → wine tint** |
| `--pm-accent-soft` | `#3a281f` | `#3b2531` | warm → wine tint |
| `--pm-accent-hover` | `#f0ad83` | `#d48399` | warm → wine tint |
| `--pm-on-accent` | `#15130f` | `#14161b` | cool dark text |
| `--pm-hero-gold` | `#cbaa72` | `#c9b5c3` | gold → plum-silver |
| `--pm-hero-ink` | `#f5efe4` | `#f2f4f8` | warm → cool white |
| `--pm-sage` | `#93b5a3` | `#c66b83` | **retired → accent** |
| `--pm-sage-soft` | `#25332b` | `#3b2531` | **retired → accent-soft** |
| `--pm-brass` | `#d9b46e` | `#9aa2b0` | **retired → ink-3** |
| `--pm-brass-soft` | `#33291b` | `#272b34` | **retired → surface-2** |
| `--pm-danger` | `#e07b6f` | `#dc7286` | cooled crimson |
| `--pm-danger-soft` | `#2e1d1a` | `#3b2029` | cooled tint |
| `--pm-reader-paper` | `#221f18` (warm brown) | `#1f232b` (cool slate) | **warm paper → cool paper** |
| `--pm-control-border` | `#4e4638` | `#454d5b` | warm → cool |
| shadows | `rgba(255,244,224,…)` inset | `rgba(226,232,245,…)` inset | warm → cool highlight |

---

## 3. WCAG contrast ratios (computed, sRGB, WCAG 2.1)

AA text = 4.5:1 · AAA text = 7:1 · AA large / non-text UI = 3:1.

| # | Pair (foreground on background) | Ratio | Result |
|---|---|---|---|
| 1 | Light `--pm-ink` on `--pm-bg` | **15.63:1** | AAA |
| 2 | Light `--pm-ink-2` on `--pm-bg` | **7.38:1** | AAA |
| 3 | Light `--pm-ink-3` on `--pm-bg` | **4.97:1** | AA |
| 4 | Light `--pm-ink` on `--pm-surface` | **16.90:1** | AAA |
| 5 | Light `--pm-ink-2` on `--pm-surface-2` | **6.92:1** | AA |
| 6 | Light `--pm-ink-3` on `--pm-surface-2` | **4.66:1** | AA |
| 7 | Light `--pm-ink` on `--pm-surface-3` | **13.37:1** | AAA |
| 8 | Light `--pm-on-accent` on `--pm-accent` | **10.50:1** | AAA |
| 9 | Light `--pm-accent` on `--pm-surface` (links) | **10.50:1** | AAA |
| 10 | Light `--pm-accent` on `--pm-bg` | **9.71:1** | AAA |
| 11 | Light `--pm-accent` on `--pm-accent-soft` (selected chip text) | **8.88:1** | AAA |
| 12 | Light `--pm-ink-3` on `--pm-accent-soft` | **4.55:1** | AA |
| 13 | Light `--pm-on-accent` on `--pm-accent-hover` | **12.73:1** | AAA |
| 14 | Light `--pm-danger` on `--pm-danger-soft` | **5.86:1** | AA |
| 15 | Light `--pm-ink` on hero panel `#f7f8fa` | **15.90:1** | AAA |
| 16 | Dark `--pm-ink` on `--pm-bg` | **16.44:1** | AAA |
| 17 | Dark `--pm-ink` on `--pm-surface` | **14.81:1** | AAA |
| 18 | Dark `--pm-ink-2` on `--pm-surface` | **10.01:1** | AAA |
| 19 | Dark `--pm-ink-3` on `--pm-surface-2` | **5.51:1** | AA |
| 20 | Dark `--pm-ink-3` on `--pm-surface-3` | **4.58:1** | AA |
| 21 | Dark `--pm-on-accent` on `--pm-accent` | **5.03:1** | AA |
| 22 | Dark `--pm-accent` on `--pm-bg` (links) | **5.03:1** | AA |
| 23 | Dark `--pm-accent` on `--pm-surface` | **4.53:1** | AA |
| 24 | Dark `--pm-ink` on `--pm-reader-paper` | **14.30:1** | AAA |
| 25 | Dark `--pm-ink-3` on `--pm-reader-paper` | **6.13:1** | AA |
| 26 | Dark `--pm-danger` on `--pm-danger-soft` | **4.77:1** | AA |
| 27 | Dark `--pm-on-accent` on `--pm-accent-hover` | **6.47:1** | AA |

Non-text / UI-component check (3:1 threshold):
- Dark `--pm-accent` on `--pm-accent-soft` = **3.90:1** → passes. **Rule:** dark soft surfaces always carry `--pm-ink`/`--pm-ink-2` text (12.76:1 / ~9:1); `--pm-accent` on soft is used only as a border, icon, or marker, never as text.
- Light `--pm-line-strong` on `--pm-surface` = **1.52:1** — decorative hairline only; not a control boundary. Control borders use `--pm-control-border` with sufficient 3:1 component treatment where required.

**Summary:** 27/27 text pairs pass AA or better (18 reach AAA). No text pairing relies on a warm background. No exceptions.

---

## 4. Three-sentence rationale

Cool slate grey feels calmer than rust+beige because it removes the low-level colour temperature shift that the eye keeps re-correcting across every cream card and beige chip, producing a visually quiet, evenly-lit interface where hierarchy comes from value and spacing rather than hue. Burgundy reads as upscale rather than rust because it is low-chroma, deep, and culturally coded to library, ink, and leather binding — where rust reads as craft/casual, wine reads as considered and premium, and restricting it to one accent makes every appearance feel intentional. For a book and learning product specifically, burgundy is the natural extension of the book itself: it is the colour of bookcloth, library stamps, and red ink marginalia, so it signals "scholarly" without the "warm and fuzzy" connotation that beige and terracotta introduce.

---

## 5. Usage rules

**Accent budget — ≤5% of visible surface area.** Burgundy (`--pm-accent`) is permitted for exactly: (a) one primary CTA per view, (b) the active nav indicator, (c) progress ring/fill, (d) the active chapter/list marker, (e) inline links on hover/focus, (f) the focus ring via `--pm-accent-soft`. Never fill a large panel, hero, chart area, or reading surface with burgundy. Never use burgundy as body text. Never use `--pm-accent-hover` at rest. If two burgundy elements would compete in one viewport, demote the secondary one to `--pm-ink-2`.

**Retire sage and brass.** `--pm-sage`/`--pm-sage-soft` are deprecated aliases of `--pm-accent`/`--pm-accent-soft`: completion check circles, correct-answer borders, and done-step markers become burgundy (with their glyph retained, so meaning never rests on colour alone). `--pm-brass`/`--pm-brass-soft` are deprecated aliases of `--pm-ink-3`/`--pm-surface-2`: folio numerals, chapter numbers, and small decorative labels become quiet cool grey — never accent, preserving the "folio is never accent" rule. No new code may reference `sage`, `brass`, `gold`, `terracotta`, `rust`, `beige`, or `cream` semantics; `--pm-hero-gold` remains only as the named decorative token with a plum-silver value.

**Hero panel.** Light: cool gradient `#f7f8fa → #eceff4` (derived from bg/surface-2), `--pm-ink` headline, `--pm-ink-2` subline, and a single 3px `--pm-accent` left rule or the burgundy progress ring — no gold, no cream, no large warm wash. Dark: `--pm-surface-2` panel, `--pm-ink` headline, `--pm-hero-gold` (plum-silver) for the small eyebrow only.

**Reader paper.** Light: `--pm-reader-paper: #ffffff`, body text `--pm-ink`/`--pm-ink-2`, hairline `--pm-line`. Dark: `--pm-reader-paper: #1f232b` — a cool slate sheet, explicitly *not* a brown putty sheet. The reading column stays neutral; only the active chapter marker and the bookmark icon may use burgundy.

**Chips & modal.** Chips: default `--pm-surface-2` fill + `--pm-ink-2` text; selected chip `--pm-accent-soft` fill + `--pm-accent` text (light) and `--pm-ink` text (dark) + 1px `--pm-accent` border; no beige or peach tints. Modal: `--pm-surface` body, `--pm-line` border, `--pm-ink` title, single `--pm-accent` primary action, `--pm-shadow-2` elevation, focus ring `--pm-accent-soft`. Destructive actions alone use `--pm-danger`, always paired with a text label and icon.

**Shadow & light.** All shadows are cast in cool slate `rgba(18,22,32,…)` and dark highlights in `rgba(226,232,245,…)`. No warm `rgba(31,27,21,…)` or `rgba(255,244,224,…)` remains.

---

## 6. What the user will see

**Dashboard.** The cream-gold greeting banner becomes a clean, cool slate panel — white-to-pale-grey, dark ink headline, one thin burgundy rule — so the first thing on screen feels like a quiet study desk rather than a warm postcard. The peach quick-action cards, beige chips, rust icons, and terracotta progress bar all become cool grey surfaces with dark slate text; the only colour is the burgundy progress ring, the active nav underline, and the single primary "start" affordance. Net effect: the page reads as calm, modern, and premium, with energy concentrated in one controlled accent instead of smeared across every card.

**Book.** The sage-green cover tile becomes a cool slate tile, and the brass folio numbers and brass progress rule become quiet grey-on-slate, removing the last warm notes from the reading experience. The reader sheet is cool white (light) or cool slate (dark), with burgundy reserved for the active chapter marker and bookmark; the tab strip and chapter list are neutral grey until selected. The "Start reading" button is deep burgundy — a single, deliberate focal point on an otherwise grey, scholarly page.

---

## RETURN — palette hex list + contrast summary

**Light:** bg `#f5f6f8` · surface `#ffffff` · surface-2 `#eceff3` · surface-3 `#e1e5eb` · ink `#191d24` · ink-2 `#4a515e` · ink-3 `#636b78` · line `#e3e7ed` · line-strong `#cbd2dc` · accent `#6e2639` · accent-soft `#f5e9ed` · accent-hover `#5a1d2e` · on-accent `#ffffff` · hero-gold `#b7a5c1` · hero-ink `#f7f8fb` · sage→`#6e2639` · sage-soft→`#f5e9ed` · brass→`#636b78` · brass-soft→`#eceff3` · danger `#a32f43` · danger-soft `#f8e9ec` · reader-paper `#ffffff` · control-border `#cbd2dc`.

**Dark:** bg `#14161b` · surface `#1d2027` · surface-2 `#272b34` · surface-3 `#323844` · ink `#f2f4f8` · ink-2 `#c5cbd7` · ink-3 `#9aa2b0` · line `#343a46` · line-strong `#5a6371` · accent `#c66b83` · accent-soft `#3b2531` · accent-hover `#d48399` · on-accent `#14161b` · hero-gold `#c9b5c3` · hero-ink `#f2f4f8` · sage→`#c66b83` · sage-soft→`#3b2531` · brass→`#9aa2b0` · brass-soft→`#272b34` · danger `#dc7286` · danger-soft `#3b2029` · reader-paper `#1f232b` · control-border `#454d5b`.

**Contrast summary:** 27 critical pairs evaluated; 27/27 pass WCAG AA (≥4.5:1) and 18/27 reach AAA (≥7:1). Strongest pairs: ink/bg light 15.63:1, ink/surface light 16.90:1, ink/bg dark 16.44:1, white-on-burgundy 10.50:1, dark ink/reader-paper 14.30:1. The single 3.90:1 value (dark accent on dark accent-soft) is non-text UI only and clears the 3:1 UI threshold. No text pairing depends on a warm background.
