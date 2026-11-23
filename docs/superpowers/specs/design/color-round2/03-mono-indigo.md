# Colour Round 2 — Direction 03: MONO / INDIGO

**Status:** proposed, decisive (competes against 4 alternatives). **Author:** K03 (Colour Direction Designer).
**Scope:** colour tokens only — `apps/desktop/src/styles/premium/00-tokens.css`. No type, spacing, radius, motion, or component CSS changes.
**Mandate:** kill the warm cream / terracotta / sage / brass direction. Replace it with a disciplined near-monochrome cool-grey system and exactly **one** accent: a deep indigo. Maximum calm, minimum chroma, high-end editorial.

---

## 1. FULL PALETTE — every `--pm-*` colour token

### 1.1 Light (`:root`)

| Token | Old (light) | **New (light)** | Role |
|---|---|---|---|
| `--pm-bg` | `#faf8f4` | **`#F7F8FA`** | App canvas — cool off-white, hue ≈ 220 |
| `--pm-surface` | `#ffffff` | **`#FFFFFF`** | Cards / paper base (pure neutral white) |
| `--pm-surface-2` | `#f4f0e8` | **`#F0F2F6`** | Chips, secondary tiles, hover fill |
| `--pm-surface-3` | `#ede7dc` | **`#E6E9EF`** | Highest neutral recess, hero gradient end |
| `--pm-ink` | `#1f1b15` | **`#171A21`** | Primary text — cool near-black |
| `--pm-ink-2` | `#4b4337` | **`#4A505E`** | Secondary text / icons |
| `--pm-ink-3` | `#746a5b` | **`#646D7E`** | Tertiary text / meta / glyphs (≥4.5 on every light surface) |
| `--pm-line` | `#e9e3d8` | **`#E2E6ED`** | Hairline dividers |
| `--pm-line-strong` | `#d8cfbe` | **`#C7CDD9`** | Emphasised hairline / control border / checkbox ring |
| `--pm-accent` | `#a94f2a` | **`#2E3A8C`** | THE single accent — deep indigo |
| `--pm-accent-soft` | `#f7eae3` | **`#EAECF7`** | Accent tint — soft periwinkle wash |
| `--pm-accent-hover` | `#964421` | **`#232E73`** | Accent pressed/hover — deeper indigo |
| `--pm-on-accent` | `#ffffff` | **`#FFFFFF`** | Text/icon on indigo (10.00:1) |
| `--pm-hero-gold` | `#dcc08a` | **`#B9C4F0`** | Repointed: hero eyebrow/em highlight (pale indigo, not gold) |
| `--pm-hero-ink` | `#f5efe4` | **`#F7F8FA`** | Text on deep hero gradient |
| `--pm-sage` | `#4f6b5d` | **`#2E3A8C`** | FOLDED into accent — completion = indigo |
| `--pm-sage-soft` | `#e8f0ea` | **`#EAECF7`** | FOLDED into accent-soft |
| `--pm-brass` | `#a88342` | **`#646D7E`** | FOLDED into neutral scale — folio numbers = ink-3 |
| `--pm-brass-soft` | `#f5eedf` | **`#F0F2F6`** | FOLDED into neutral scale — surface-2 |
| `--pm-danger` | `#b5473d` | **`#B14856`** | Muted cool rose (semantic exception, still low-chroma) |
| `--pm-danger-soft` | `#f7e9e7` | **`#F9EDF0`** | Danger wash |
| `--pm-reader-paper` | *(undefined in light)* | **`#FBFCFE`** | Reader paper — cool near-white (new light definition) |
| `--pm-control-border` | *(undefined in light)* | **`#C7CDD9`** | Control border = line-strong (new light definition) |
| `--pm-transparent` | `transparent` | **`transparent`** | Unchanged |
| `--pm-shadow-1` | warm `rgba(31,27,21,…)` | **`0 1px 2px rgba(23,26,33,.05), 0 8px 24px rgba(23,26,33,.06)`** | Cool shadow |
| `--pm-shadow-2` | warm `rgba(31,27,21,…)` | **`0 2px 8px rgba(23,26,33,.06), 0 24px 60px rgba(23,26,33,.08)`** | Cool deep shadow |
| `--pm-shadow-focus` | `0 0 0 3px var(--pm-accent-soft)` | **`0 0 0 3px var(--pm-accent-soft)`** | Unchanged reference |

### 1.2 Dark (`[data-theme='dark']`)

| Token | Old (dark) | **New (dark)** | Role |
|---|---|---|---|
| `--pm-bg` | `#15130f` | **`#101218`** | Cool near-black canvas |
| `--pm-surface` | `#1e1b16` | **`#171A22`** | Raised card |
| `--pm-surface-2` | `#27231c` | **`#1E222D`** | Secondary / hover fill |
| `--pm-surface-3` | `#302b23` | **`#272C39`** | Highest neutral recess; hero gradient start |
| `--pm-ink` | `#f5efe4` | **`#EFF1F6`** | Primary text — cool near-white |
| `--pm-ink-2` | `#cfc4b2` | **`#B7BECD`** | Secondary text |
| `--pm-ink-3` | `#9e9383` | **`#8B93A5`** | Tertiary text / glyphs |
| `--pm-line` | `#373127` | **`#2B3140`** | Hairline divider |
| `--pm-line-strong` | `#7a6e59` | **`#495165`** | Emphasised hairline / control border |
| `--pm-accent` | `#e69a6c` | **`#8C97E8`** | THE single accent — luminous indigo for dark ground |
| `--pm-accent-soft` | `#3a281f` | **`#232A48`** | Indigo wash |
| `--pm-accent-hover` | `#f0ad83` | **`#A0AAF0`** | Brighter indigo hover |
| `--pm-on-accent` | `#15130f` | **`#101218`** | Deep text on luminous indigo (6.87:1) |
| `--pm-hero-gold` | `#cbaa72` | **`#C3CBF5`** | Pale indigo hero highlight |
| `--pm-hero-ink` | `#f5efe4` | **`#EFF1F6`** | Hero text |
| `--pm-sage` | `#93b5a3` | **`#8C97E8`** | FOLDED into accent |
| `--pm-sage-soft` | `#25332b` | **`#232A48`** | FOLDED into accent-soft |
| `--pm-brass` | `#d9b46e` | **`#8B93A5`** | FOLDED into ink-3 |
| `--pm-brass-soft` | `#33291b` | **`#1E222D`** | FOLDED into surface-2 |
| `--pm-danger` | `#e07b6f` | **`#E88894`** | Muted cool rose |
| `--pm-danger-soft` | `#2e1d1a` | **`#3A2029`** | Danger wash |
| `--pm-reader-paper` | `#221f18` | **`#191C25`** | Cool dark paper |
| `--pm-control-border` | `#4e4638` | **`#495165`** | Control border |
| `--pm-transparent` | `transparent` | **`transparent`** | Unchanged |
| `--pm-shadow-1` | warm `rgba(255,244,224,.06)` inset | **`inset 0 1px 0 rgba(230,236,255,.06), 0 10px 28px rgba(0,0,0,.45)`** | Cool light-edge + black lift |
| `--pm-shadow-2` | warm `rgba(255,244,224,.08)` inset | **`inset 0 1px 0 rgba(230,236,255,.08), 0 28px 64px rgba(0,0,0,.55)`** | Cool deep lift |

**Palette hex list (copy-ready):**
`F7F8FA · FFFFFF · F0F2F6 · E6E9EF · 171A21 · 4A505E · 646D7E · E2E6ED · C7CDD9 · 2E3A8C · EAECF7 · 232E73 · FFFFFF · B9C4F0 · F7F8FA · FBFCFE · B14856 · F9EDF0` (light)
`101218 · 171A22 · 1E222D · 272C39 · EFF1F6 · B7BECD · 8B93A5 · 2B3140 · 495165 · 8C97E8 · 232A48 · A0AAF0 · 101218 · C3CBF5 · EFF1F6 · 191C25 · E88894 · 3A2029` (dark)

---

## 2. EXPLICIT OLD → NEW MAPPING

**Chroma removal is the whole point:** every cream/amber/terracotta/green value collapses onto the cool-grey ramp `#F7F8FA → #E6E9EF → #C7CDD9 → #646D7E → #4A505E → #171A21`. Only indigo keeps saturation.

| # | Old value | Category | New value | What changed |
|---|---|---|---|---|
| 1 | `#faf8f4` warm cream bg | surface | `#F7F8FA` | Hue 40° → 220°; same perceived lightness, zero warmth |
| 2 | `#f4f0e8` beige tile | surface-2 | `#F0F2F6` | Cool grey, keeps hierarchy step |
| 3 | `#ede7dc` beige recess | surface-3 | `#E6E9EF` | Cool grey recess |
| 4 | `#1f1b15` brown-black ink | text | `#171A21` | Cool near-black, slightly darker |
| 5 | `#4b4337` brown-grey ink-2 | text | `#4A505E` | Cool grey |
| 6 | `#746a5b` brown-grey ink-3 | text | `#646D7E` | Darkened to clear 4.5:1 on all light surfaces |
| 7 | `#e9e3d8` warm line | line | `#E2E6ED` | Cool hairline |
| 8 | `#d8cfbe` warm strong line | line | `#C7CDD9` | Cool strong hairline |
| 9 | `#a94f2a` terracotta accent | accent | `#2E3A8C` | **Hero move:** the only vivid hue becomes deep indigo |
| 10 | `#f7eae3` peach accent-soft | accent tint | `#EAECF7` | Periwinkle wash |
| 11 | `#964421` rust hover | accent | `#232E73` | Deeper indigo |
| 12 | `#f7eae3`→`#ffffff` on-accent | text | `#FFFFFF` | Kept white; now 10.00:1 (was 3.4:1 on terracotta) |
| 13 | `#dcc08a` hero gold | hero | `#B9C4F0` | Pale indigo highlight on the dark hero |
| 14 | `#f5efe4` hero ink | hero | `#F7F8FA` | Cool near-white |
| 15 | `#4f6b5d` sage success | secondary hue | `#2E3A8C` | **Retired:** completion/success uses the single accent |
| 16 | `#e8f0ea` sage-soft | secondary tint | `#EAECF7` | Folded to accent-soft |
| 17 | `#a88342` brass folio | secondary hue | `#646D7E` | **Retired:** folio numerals become neutral ink-3 |
| 18 | `#f5eedf` brass-soft | secondary tint | `#F0F2F6` | Folded to surface-2 |
| 19 | `#b5473d` warm red danger | semantic | `#B14856` | Muted cool rose; keeps semantic separation at 5.34:1 |
| 20 | `#f7e9e7` danger-soft | semantic | `#F9EDF0` | Cool-tinted wash |
| 21 | `#15130f` dark bg | surface | `#101218` | Cool near-black |
| 22 | `#1e1b16` dark surface | surface | `#171A22` | Cool raised card |
| 23 | `#27231c` dark surface-2 | surface | `#1E222D` | Cool secondary |
| 24 | `#302b23` dark surface-3 | surface | `#272C39` | Cool recess |
| 25 | `#f5efe4` dark ink | text | `#EFF1F6` | Cool near-white |
| 26 | `#cfc4b2` dark ink-2 | text | `#B7BECD` | Cool grey |
| 27 | `#9e9383` dark ink-3 | text | `#8B93A5` | Cool grey, 6.08:1 on bg |
| 28 | `#373127` dark line | line | `#2B3140` | Cool hairline |
| 29 | `#7a6e59` dark strong line | line | `#495165` | Cool strong hairline |
| 30 | `#e69a6c` dark terracotta | accent | `#8C97E8` | Luminous indigo for dark ground |
| 31 | `#3a281f` dark accent-soft | accent tint | `#232A48` | Indigo wash |
| 32 | `#f0ad83` dark hover | accent | `#A0AAF0` | Brighter indigo |
| 33 | `#221f18` dark reader paper | paper | `#191C25` | Cool dark paper |
| 34 | `#4e4638` dark control border | control | `#495165` | Cool control border |
| 35 | warm shadows `rgba(31,27,21)` / `rgba(255,244,224)` | shadow | `rgba(23,26,33)` / `rgba(230,236,255)` inset | Shadow tint follows the new neutral hue |
| 36 | reader-paper / control-border absent in light | gap | `#FBFCFE` / `#C7CDD9` | Added light definitions so both themes are symmetric |

---

## 3. WCAG 2.1 CONTRAST — 32 critical pairs (all pass AA ≥4.5:1)

Light hero gradient start computed as `color-mix(accent 40%, ink-2 60%)` = `#3F4770`; end = `#171A21`. Dark hero gradient = `#272C39 → #101218`.

| # | Pair | Foreground | Background | Ratio | Result |
|---|---|---|---|---|---|
| 1 | Primary text / canvas | `#171A21` | `#F7F8FA` | **16.38:1** | AAA |
| 2 | Primary text / card | `#171A21` | `#FFFFFF` | **17.41:1** | AAA |
| 3 | Secondary text / canvas | `#4A505E` | `#F7F8FA` | **7.60:1** | AAA |
| 4 | Secondary text / tile | `#4A505E` | `#F0F2F6` | **7.21:1** | AAA |
| 5 | Tertiary text / card | `#646D7E` | `#FFFFFF` | **5.21:1** | AA |
| 6 | Tertiary text / canvas | `#646D7E` | `#F7F8FA` | **4.90:1** | AA |
| 7 | Tertiary text / tile | `#646D7E` | `#F0F2F6` | **4.65:1** | AA |
| 8 | Accent label on accent | `#FFFFFF` | `#2E3A8C` | **10.00:1** | AAA |
| 9 | Accent text on tint | `#2E3A8C` | `#EAECF7` | **8.49:1** | AAA |
| 10 | Accent link on card | `#2E3A8C` | `#FFFFFF` | **10.00:1** | AAA |
| 11 | Hero text / gradient start | `#F7F8FA` | `#3F4770` | **8.42:1** | AAA |
| 12 | Hero text / gradient end | `#F7F8FA` | `#171A21` | **16.38:1** | AAA |
| 13 | Hero highlight / gradient start | `#B9C4F0` | `#3F4770` | **5.21:1** | AA |
| 14 | Hero highlight / gradient end | `#B9C4F0` | `#171A21` | **10.13:1** | AAA |
| 15 | Destructive text / card | `#B14856` | `#FFFFFF` | **5.34:1** | AA |
| 16 | Reader body / paper | `#171A21` | `#FBFCFE` | **16.96:1** | AAA |
| 17 | Reader meta / paper | `#4A505E` | `#FBFCFE` | **7.87:1** | AAA |
| 18 | Dark primary / canvas | `#EFF1F6` | `#101218` | **16.57:1** | AAA |
| 19 | Dark primary / card | `#EFF1F6` | `#171A22` | **15.39:1** | AAA |
| 20 | Dark secondary / card | `#B7BECD` | `#171A22` | **9.33:1** | AAA |
| 21 | Dark tertiary / canvas | `#8B93A5` | `#101218` | **6.08:1** | AA |
| 22 | Dark tertiary / card | `#8B93A5` | `#171A22` | **5.64:1** | AA |
| 23 | Dark tertiary / tile | `#8B93A5` | `#1E222D` | **5.16:1** | AA |
| 24 | Dark accent / card | `#8C97E8` | `#171A22` | **6.38:1** | AA |
| 25 | Dark accent / canvas | `#8C97E8` | `#101218` | **6.87:1** | AA |
| 26 | Dark text on accent | `#101218` | `#8C97E8` | **6.87:1** | AA |
| 27 | Dark accent text on tint | `#8C97E8` | `#232A48` | **5.15:1** | AA |
| 28 | Dark hero text / gradient start | `#EFF1F6` | `#272C39` | **12.34:1** | AAA |
| 29 | Dark hero text / gradient end | `#EFF1F6` | `#101218` | **16.57:1** | AAA |
| 30 | Dark hero highlight / start | `#C3CBF5` | `#272C39` | **8.75:1** | AAA |
| 31 | Dark destructive / card | `#E88894` | `#171A22` | **6.94:1** | AA |
| 32 | Dark reader body / paper | `#EFF1F6` | `#191C25` | **15.06:1** | AAA |

**Contrast summary:** 32/32 pairs pass WCAG AA (≥4.5:1); 17/32 reach AAA (≥7:1). Lowest ratio is 4.65:1 (tertiary text on the lightest tile) — intentionally the only "just-passing" pair, because tertiary text is the quietest layer. No pair relies on large-text exemptions. Focus rings use `--pm-accent` against `--pm-bg` (10.00:1 light / 6.87:1 dark), well above the 3:1 non-text requirement.

---

## 4. RATIONALE (3 sentences)

Near-monochrome cool grey is the most comfortable choice for a reading app because it removes the constant low-level chroma shifts that make a screen feel busy — the eye rests on one hue family and only wakes up where the interface actually asks it to. A single deep indigo reads as editorial and expensive precisely because it is rationed: it is a considered mark on a disciplined page, not the wall-to-wall hue that makes consumer apps feel like "cheap SaaS." Indigo sits adjacent to the blue end of the grey ramp and carries a cool-but-inked warmth of its own, so the system stays calm and modern without feeling clinical — and the paper surface stays near-white rather than icy, which is what keeps long-form reading inviting.

---

## 5. USAGE RULES

### 5.1 Accent budget (hard rule)
- **≤5% of visible pixels** on any screen may be `--pm-accent` / `--pm-accent-soft`. Count icon glyphs, focus rings, the active nav underline, one primary CTA, and completion ticks — that is the entire budget.
- **One accent per view grouping:** at most one filled indigo button per card/section. Secondary actions stay `--pm-transparent` with `--pm-line` border and `--pm-ink-2` text.
- Indigo may appear as: primary CTA fill, active tab/nav underline, focus ring, progress fill, completed-state tick, and active chip. It may **not** appear as: page background, large panel fill (except the hero, below), body text, or decorative gradients.
- Grey ramp does the structural work: surfaces, dividers, hover states, tertiary text, folio numbers, icons. If a decision is "which grey?", choose the lower-chroma option.

### 5.2 Retire sage / brass — do not keep a second or third hue
- **sage → accent.** The completed-task circle and quiz "correct" border use `--pm-sage`, which is now an alias of `--pm-accent`. Nothing turns green. A single accent means success and navigation share one language.
- **brass → neutral.** Folio numerals, book-card numbers, chapter markers and "tez orada" notes move to `--pm-brass` = `--pm-ink-3` (`#646D7E` light / `#8B93A5` dark). Their soft wash moves to `--pm-brass-soft` = `--pm-surface-2`. Important: these remain *typographic* details in Fraunces — the neutral tone preserves the editorial folio feel without a gold second accent.
- Keep the token names as aliases for compatibility; do not reintroduce distinct green or gold values. Any new component reaching for sage or brass is, by definition, reaching for the accent or the neutral ramp.

### 5.3 Hero panel
- Light: `linear-gradient(155deg, color-mix(in srgb, var(--pm-accent) 40%, var(--pm-ink-2)), var(--pm-ink))` → `#3F4770 → #171A21`. Text `--pm-hero-ink` `#F7F8FA`; eyebrow and italic emphasis `--pm-hero-gold` `#B9C4F0` (5.21:1 minimum). No gold, no amber, no warm glow.
- Dark: `linear-gradient(155deg, var(--pm-surface-3), var(--pm-on-accent))` → `#272C39 → #101218`; text `#EFF1F6`, highlight `#C3CBF5` (8.75:1 minimum).
- The hero is the **only** large indigo-adjacent surface. Everything else on that screen is neutral. The gradient stays a straight 155° two-stop — no extra radial layers.

### 5.4 Reader paper
- Light: `--pm-reader-paper: #FBFCFE` — cool near-white, distinct from `#FFFFFF` card white by just enough to read as paper. Body text `--pm-ink` (16.96:1), selectors `--pm-accent` only when active.
- Dark: `--pm-reader-paper: #191C25` — cool charcoal, text `#EFF1F6` (15.06:1). No sepia, no cream, no yellow cast in either theme; remove `nx-reader-paper--sepia`'s warm wash from the colour layer.
- The quoted lead-in rule beside paragraphs becomes `--pm-line-strong` (neutral), **not** terracotta. Selection highlight uses `--pm-accent-soft` with `--pm-ink`.

### 5.5 Chips, tabs, modal
- **Chips:** default `--pm-surface-2` + `--pm-ink-2`, no border, no shadow. Only the genuinely active chip switches to `--pm-accent-soft` + `--pm-accent`. The "recommended" chip loses brass: neutral `--pm-surface-2` + `--pm-ink-3`.
- **Tabs:** active underline and active pill = indigo; inactive = `--pm-ink-3`. Count chips as one accent group, not many.
- **Modal / overlay:** overlay scrim `rgba(16,18,24,.55)` (cool, not warm brown); modal card `--pm-surface` with `--pm-shadow-2` and `--pm-line` hairline. Primary action is the single indigo button; close button `--pm-ink-3`; destructive action uses `--pm-danger` outline only. No coloured modal header.

---

## 6. WHAT THE USER WILL SEE

### Dashboard
The cream background becomes a clean cool near-white (`#F7F8FA`); every warm beige tile, peach icon circle, terracotta nav underline and rust CTA disappears. The hero greeting card is now a deep indigo-to-ink gradient with pale-indigo italic emphasis and a cool white progress ring — calm and premium, not "orange app". The four quick-action cards are neutral grey tiles with small indigo glyphs only; the streak chip is neutral grey, with indigo reserved for the one active state. The daily-loop check circles are neutral outlines that fill **indigo** when completed (no green). Stats, dividers and the "Batafsil" button are pure cool grey; the single filled indigo element on the page is the primary action, so the eye lands on it immediately. Nothing is sepia, brass or sage — the page reads like a quietly typeset editorial dashboard.

### Book
The book screen loses the green cover block and brass folio numerals: covers become cool grey/indigo-neutral with `--pm-hero-ink` type and a quiet `--pm-ink-3` mark. The "O'qishni boshlash" CTA is deep indigo with white text at 10.00:1 instead of terracotta; the "Quiz ishlash" button stays neutral outline. The reader paper is cool near-white (`#FBFCFE`) rather than warm cream, with charcoal body text, a neutral left rule, and folio/chapter numbers in grey Fraunces. The active chapter and active tab carry the indigo accent; everything else — topic chips, term counts, sidebar, progress ring — is a disciplined cool grey. Result: a longer, more comfortable reading session with zero warm cast and no competing accent colours.

---

## 7. IMPLEMENTATION NOTE (single-file change)

Apply the table in §1 to `:root` and `[data-theme='dark']` in `apps/desktop/src/styles/premium/00-tokens.css`. Add the two missing light definitions (`--pm-reader-paper`, `--pm-control-border`). Update the two shadow tokens in each block to cool-tinted RGBA. No other file is touched by this direction; component CSS keeps every existing `var(--pm-*)` reference, which now resolves to the new palette.
