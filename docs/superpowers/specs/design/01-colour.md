# 01 — Colour decisions (DESIGN LEAD, D01)

> Scope: colour only. No CSS implemented, no other file touched.
> Sources: `2026-11-23-premium-design-system.md`, `styles/premium/00-tokens.css`,
> `shots/after-dashboard.png`, `shots/onboarding.png` (the "study-notes-after.png" file is not present;
> `onboarding.png` is the onboarding screenshot and was reviewed instead).
> This document is binding for all element agents.

---

## 0. Token change ledger — READ FIRST

**No existing `--pm-*` hex value is changed.** Every value in `00-tokens.css` survives.
The two real bugs found in the current UI are **usage bugs**, not token bugs:

1. Dark-mode primary button: white text on `--pm-accent` `#E69A6C` = **2.28:1 → FAIL**.
   Fix = **text on accent flips to `--pm-bg` `#15130F` (8.13:1)**. Light mode keeps white.
2. Brass `#A88342` = 3.51:1 on white → **display-only (≥24px)**. The 11px brass eyebrow in
   onboarding ("KITOBNI O'QISH EMAS") must become `--pm-accent`.

**Three NEW tokens are requested** (add to `00-tokens.css` by the tokens owner, not by element agents):

| New token | Light | Dark | Reason |
|-----------|-------|------|--------|
| `--pm-on-accent` | `#FFFFFF` | `#15130F` | kills the 2.28:1 dark button failure at the source |
| `--pm-hero-gold` | `#DCC08A` | `#DCC08A` | light brass is only 2.42:1 on the hero's light stop — unreadable even at 54px |
| `--pm-hero-ink` | `#F5EFE4` | `#F5EFE4` | hero is a dark surface in BOTH themes; light `--pm-ink` would be 2.6:1 on it |

Until `--pm-on-accent` lands, use the exact equivalents:
light `color: var(--pm-surface)`, dark `color: var(--pm-bg)`.
Until the hero tokens land, element agents must ask for them — **do not invent hex literals**.

---

## 1. Final palette — LIGHT (exact hex)

| Role | Token | Hex | Verdict |
|------|-------|-----|---------|
| Page background | `--pm-bg` | `#FAF8F4` | keep — warm paper, 16.15:1 vs ink |
| Card / panel | `--pm-surface` | `#FFFFFF` | keep |
| Secondary surface / track | `--pm-surface-2` | `#F4F0E8` | keep |
| Tertiary surface / hover | `--pm-surface-3` | `#EDE7DC` | keep |
| Primary text | `--pm-ink` | `#1F1B15` | keep |
| Secondary text | `--pm-ink-2` | `#4B4337` | keep |
| Meta text (≥12px only) | `--pm-ink-3` | `#746A5B` | keep — 4.67:1 worst case, passes |
| Hairline | `--pm-line` | `#E9E3D8` | keep — decorative only |
| Strong hairline | `--pm-line-strong` | `#D8CFBE` | keep — decorative only |
| Accent (terracotta) | `--pm-accent` | `#A94F2A` | keep — 5.16:1 on bg, 5.47:1 on surface |
| Accent active fill | `--pm-accent-soft` | `#F7EAE3` | keep — accent on it 4.65:1 |
| Accent hover | `--pm-accent-hover` | `#964421` | keep — darker, 6.68:1 vs white |
| Success (sage) | `--pm-sage` | `#4F6B5D` | keep — 5.84:1 on surface |
| Success fill | `--pm-sage-soft` | `#E8F0EA` | keep — sage on it 5.03:1 |
| Brass (display only) | `--pm-brass` | `#A88342` | keep, **≥24px only**, 3.51:1 on white |
| Brass fill | `--pm-brass-soft` | `#F5EEDF` | keep — decorative fill only, never brass text on it (3.03:1) |

## 1b. Final palette — DARK (exact hex)

| Role | Token | Hex | Verdict |
|------|-------|-----|---------|
| Page background | `--pm-bg` | `#15130F` | keep — warm espresso, not neutral grey/black |
| Card / panel | `--pm-surface` | `#1E1B16` | keep |
| Secondary surface / track | `--pm-surface-2` | `#27231C` | keep |
| Tertiary surface / hover | `--pm-surface-3` | `#302B23` | keep |
| Primary text | `--pm-ink` | `#F5EFE4` | keep — 15.00:1 on surface |
| Secondary text | `--pm-ink-2` | `#CFC4B2` | keep — 9.96:1 |
| Meta text (≥12px only) | `--pm-ink-3` | `#9E9383` | keep — 5.68:1 |
| Hairline | `--pm-line` | `#373127` | keep — nearly invisible by design |
| Strong hairline | `--pm-line-strong` | `#4E4638` | keep |
| Accent (light copper) | `--pm-accent` | `#E69A6C` | keep for TEXT/active (7.52:1 on surface); **never white text on it** |
| Accent active fill | `--pm-accent-soft` | `#3A281F` | keep — accent on it 6.12:1 |
| Accent hover | `--pm-accent-hover` | `#F0AD83` | keep — with dark `--pm-on-accent` = 9.73:1 |
| Success (sage) | `--pm-sage` | `#93B5A3` | keep — 7.67:1 |
| Success fill | `--pm-sage-soft` | `#25332B` | keep — 5.91:1 |
| Brass (display only) | `--pm-brass` | `#D9B46E` | keep — 8.75:1 on surface |
| Brass fill | `--pm-brass-soft` | `#33291B` | keep — 7.26:1 |

**Rejected alternative:** darkening dark accent to `#A8542F` would make white text pass (5.28:1)
but drops accent-on-surface to ~3.4:1, breaking eyebrows, active labels and the focus ring.
Rejected. The light copper stays; the *text on it* changes.

---

## 2. Usage rules — WHEN each colour is used

### Accent coverage budget (hard limits, per screen)

| Surface hue | Max share of visible pixels | Notes |
|-------------|-----------------------------|-------|
| Ink family (ink/ink-2/ink-3) + paper surfaces | ≥ 93% | the design is ink-on-paper |
| `--pm-accent` (all fills + text + rings combined) | **≤ 5%** | 1 primary button + active nav/tab underline + 1 eyebrow ≈ 2–4% |
| All chromatic colour combined (accent + sage + brass) | **≤ 7%** | and **max 2 chromatic hues besides ink** on one screen |
| `--pm-sage` | ≤ 1% and **max 1 instance** | one semantic success signal only |
| `--pm-brass` | ≤ 1% and **max 1 instance** | one non-interactive display ornament only |

If a screen already has a primary CTA + active nav + eyebrow in accent, **no further accent is allowed**.
A second "call to action" becomes a ghost/secondary button.

### Exact role assignment

| Colour | USE for | NEVER use for |
|--------|---------|---------------|
| `--pm-accent` | the single primary CTA fill; active nav/tab 2px underline; eyebrow (12px/700); focus ring; selected-row 1px border; error left rail; progress **fill**; the one "recommended" highlight | large background blocks, icons in every action tile, chip text en masse, hover fills for unrelated items |
| `--pm-sage` | one true success/positive state per screen: saved ✓, completed step, the single "TAVSIYA" recommendation tag | streak counters, "not started", neutral stats, decorative icons, buttons |
| `--pm-brass` | exactly one display-size ornament (hero italic phrase) at ≥24px Fraunces | eyebrow/label/body at any size, chips, buttons, links, status, icons on UI controls |
| `--pm-ink` | page/section titles, primary body, active nav text, numeric KPI values | helper/meta text |
| `--pm-ink-2` | secondary body, subtitles, labels, inactive nav, chip text | titles, disabled-looking primary actions |
| `--pm-ink-3` | meta/helper only, **12px minimum**; timestamps, "5 ta savol", captions | any primary action, any text <12px, body copy |
| `--pm-line` | decorative hairline between blocks | focus ring, input borders, interactive boundaries (too faint: 1.28:1) |
| `--pm-line-strong` | input border, ghost button border, dividers that must be seen | focus ring (1.55:1 — use accent) |

### Colours that MUST be removed from the current screens

These are ad-hoc pastels from Wave 2, **not tokens**. Delete every one:

| Screenshot location | Remove | Replace with |
|---------------------|--------|--------------|
| Dashboard amber/orange "1 kunlik streak" chip | amber fill + amber text | `--pm-surface-2` fill + `--pm-ink-2` text; flame icon `--pm-accent` |
| Dashboard green "0 ta bob o'qildi" chip | green fill + green text | `--pm-surface-2` + `--pm-ink-2` |
| Dashboard blue/teal "Quiz boshlanmagan" chip | blue fill + blue text | `--pm-surface-2` + `--pm-ink-2` |
| Dashboard 4 quick-action icon tiles (green / terracotta / amber / purple fills) | all 4 coloured tiles | uniform `--pm-surface-2` tile + `--pm-ink-2` icon; the one primary action may use `--pm-accent-soft` + `--pm-accent` |
| Dashboard pink "sozlanmagan" chip | pink fill + pink text | attention state → `--pm-accent-soft` + `--pm-accent` (the one semantic exception) |
| Dashboard bottom blue progress bar | blue fill | track `--pm-surface-2`, fill `--pm-accent` |
| Dashboard sage "Davom etish" chip | sage | if status → `--pm-surface-2` + `--pm-ink-2`; if action → `--pm-accent-soft` + `--pm-accent` |
| Onboarding 11px brass eyebrow "KITOBNI O'QISH EMAS" | brass text | `--pm-accent` (5.47:1) — or `--pm-ink-2` if accent budget is spent |
| Onboarding brass star/spark icons in feature list | brass | `--pm-ink-3` stroke icons (decorative, neutral) — gold is reserved for the hero phrase |
| Any white glow / multi-layer coloured shadow / `drop-shadow` | all | only `--pm-shadow-1` / `--pm-shadow-2` |

Allowed to stay: the single sage "TAVSIYA" tag on the selected provider (one semantic success instance),
sage completion checks on genuinely completed tasks only.

---

## 3. Contrast matrix — every specified text/background pair

Threshold: **4.5:1 body (<24px)** · **3:1 large (≥24px, or ≥18.66px bold)** · **3:1 UI component boundary**.
All numbers are computed with the WCAG 2.x relative-luminance formula.

### 3.1 LIGHT

| Pair | FG / BG | Ratio | Class |
|------|---------|-------|-------|
| ink / bg | `#1F1B15` / `#FAF8F4` | **16.15** | AA body |
| ink / surface | `#1F1B15` / `#FFFFFF` | **17.13** | AA body |
| ink / surface-2 | `#1F1B15` / `#F4F0E8` | **15.07** | AA body |
| ink / surface-3 | `#1F1B15` / `#EDE7DC` | **13.92** | AA body |
| ink-2 / bg | `#4B4337` / `#FAF8F4` | **9.18** | AA body |
| ink-2 / surface | `#4B4337` / `#FFFFFF` | **9.73** | AA body |
| ink-2 / surface-2 | `#4B4337` / `#F4F0E8` | **8.56** | AA body |
| ink-3 / bg | `#746A5B` / `#FAF8F4` | **5.01** | AA body (12px+) |
| ink-3 / surface | `#746A5B` / `#FFFFFF` | **5.31** | AA body (12px+) |
| ink-3 / surface-2 | `#746A5B` / `#F4F0E8` | **4.67** | AA body — tightest passing pair, do not lighten ink-3 |
| accent / bg (eyebrow) | `#A94F2A` / `#FAF8F4` | **5.16** | AA body |
| accent / surface | `#A94F2A` / `#FFFFFF` | **5.47** | AA body |
| accent / accent-soft (active chip) | `#A94F2A` / `#F7EAE3` | **4.65** | AA body |
| accent / surface-2 | `#A94F2A` / `#F4F0E8` | **4.81** | AA body |
| on-accent / accent (primary button) | `#FFFFFF` / `#A94F2A` | **5.47** | AA body |
| on-accent / accent-hover | `#FFFFFF` / `#964421` | **6.68** | AA body |
| sage / surface | `#4F6B5D` / `#FFFFFF` | **5.84** | AA body |
| sage / sage-soft | `#4F6B5D` / `#E8F0EA` | **5.03** | AA body |
| brass / surface — **≥24px ONLY** | `#A88342` / `#FFFFFF` | **3.51** | AA large **only**; FAIL at 11px |
| brass / bg — **≥24px ONLY** | `#A88342` / `#FAF8F4` | **3.31** | AA large **only** |
| brass / brass-soft | `#A88342` / `#F5EEDF` | **3.03** | fill only — **never brass text here** |
| hero-gold / hero light stop | `#DCC08A` / `#6B4426` | **4.82** | AA body / AA large |
| hero-ink / hero light stop | `#F5EFE4` / `#6B4426` | **7.40** | AA body |
| ink-3 / warm hero card `#FBF7F0→#F7EFE4` | `#746A5B` / `#F7EFE4` | **4.66** | AA body — keep hero card at or lighter than this stop |
| line vs surface (decorative) | `#E9E3D8` / `#FFFFFF` | 1.28 | not a text pair — hairline only |
| line-strong vs surface (decorative) | `#D8CFBE` / `#FFFFFF` | 1.55 | hairline only — **not an acceptable focus ring** |
| focus ring accent vs surface | `#A94F2A` / `#FFFFFF` | **5.47** | exceeds 3:1 UI ✓ |

### 3.2 DARK

| Pair | FG / BG | Ratio | Class |
|------|---------|-------|-------|
| ink / bg | `#F5EFE4` / `#15130F` | **16.21** | AA body |
| ink / surface | `#F5EFE4` / `#1E1B16` | **15.00** | AA body |
| ink / surface-2 | `#F5EFE4` / `#27231C` | **13.66** | AA body |
| ink / surface-3 | `#F5EFE4` / `#302B23` | **12.27** | AA body |
| ink-2 / bg | `#CFC4B2` / `#15130F` | **10.77** | AA body |
| ink-2 / surface | `#CFC4B2` / `#1E1B16` | **9.96** | AA body |
| ink-2 / surface-2 | `#CFC4B2` / `#27231C` | **9.08** | AA body |
| ink-3 / bg | `#9E9383` / `#15130F` | **6.14** | AA body (12px+) |
| ink-3 / surface | `#9E9383` / `#1E1B16` | **5.68** | AA body (12px+) |
| ink-3 / surface-2 | `#9E9383` / `#27231C` | **5.18** | AA body (12px+) |
| accent / bg (eyebrow) | `#E69A6C` / `#15130F` | **8.13** | AA body |
| accent / surface | `#E69A6C` / `#1E1B16` | **7.52** | AA body |
| accent / accent-soft | `#E69A6C` / `#3A281F` | **6.12** | AA body |
| accent / surface-2 | `#E69A6C` / `#27231C` | **6.85** | AA body |
| **on-accent / accent (button)** | **`#15130F` / `#E69A6C`** | **8.13** | AA body — **dark text, never white** |
| on-accent / accent-hover | `#15130F` / `#F0AD83` | **9.73** | AA body |
| ~~white / accent~~ | ~~`#FFFFFF` / `#E69A6C`~~ | **2.28 FAIL** | **banned** |
| sage / surface | `#93B5A3` / `#1E1B16` | **7.67** | AA body |
| sage / sage-soft | `#93B5A3` / `#25332B` | **5.91** | AA body |
| brass / surface — ≥24px only | `#D9B46E` / `#1E1B16` | **8.75** | AA body (still display-only by role) |
| brass / brass-soft | `#D9B46E` / `#33291B` | **7.26** | AA body |
| hero-gold / hero light stop | `#DCC08A` / `#6B4426` | **4.82** | AA large / body |
| hero-ink / hero light stop | `#F5EFE4` / `#6B4426` | **7.40** | AA body |
| focus ring accent vs surface | `#E69A6C` / `#1E1B16` | **7.52** | exceeds 3:1 UI ✓ |
| line vs surface (decorative) | `#373127` / `#1E1B16` | 1.33 | hairline only |

---

## 4. Hero gradient — DECISION: **KEEP, but CHANGE the values**

The left panel is the single focal point and carries the terracotta editorial identity. Removing it would
flatten the product. Keeping the current brown is wrong: the light stop was too orange-heavy and the
11px brass eyebrow on it failed contrast. **Keep the structure, replace the stops.**

### Onboarding hero (both themes — a dark surface in light and dark mode)

```
background: linear-gradient(155deg, #6B4426 0%, #523322 55%, #3E2716 100%);
```

| Check | Value |
|-------|-------|
| Internal gradient contrast (lightest ↔ darkest) | **1.65:1** — deliberately "juda past kontrastli", no visible banding |
| hero-ink `#F5EFE4` on lightest stop `#6B4426` | **7.40:1** AA body |
| hero-ink on mid `#523322` | **9.89:1** AA body |
| hero-ink on darkest `#3E2716` | **12.18:1** AA body |
| hero-gold `#DCC08A` on lightest stop | **4.82:1** AA body / large |
| hero-gold on mid / darkest | **6.44 / 7.93** AA |

Rules for the hero: eyebrow, body and feature list = `--pm-hero-ink`; only the italic display phrase
("hayotida qo'llash") = `--pm-hero-gold`, Fraunces ≥40px. No brass token here
(`#A88342` is only 2.42:1 on the light stop). No drop shadow, no second gradient anywhere else.

### Dashboard greeting hero (light theme)

```
background: linear-gradient(135deg, #FBF7F0 0%, #F7EFE4 100%);
```
Keep it near-paper with `--pm-shadow-1`, no border. Do **not** darken the end stop past `#F7EFE4`:
ink-3 on it is 4.66:1, the tightest passing pair in the system. Dark theme:
`linear-gradient(135deg, #241F18 0%, #2A2319 100%)` — surface-adjacent, never a brown glow.

---

## 5. Colour recipe table — per surface type

| Surface / state | LIGHT | DARK | Contrast (text on bg) |
|-----------------|-------|------|-----------------------|
| **Card** | bg `--pm-surface`; radius 16; padding 24; `--pm-shadow-1`; no border | bg `--pm-surface`; `--pm-shadow-1` (deep black, no glow) | ink 17.13 / ink-2 9.73 |
| **Large panel** | bg `--pm-surface`; radius 24; padding 32; `--pm-shadow-2` | bg `--pm-surface`; `--pm-shadow-2` | ink 17.13 |
| **Panel divider** | 1px `--pm-line` | 1px `--pm-line` | decorative only |
| **Chip — neutral** | bg `--pm-surface-2`; text `--pm-ink-2` | bg `--pm-surface-2`; text `--pm-ink-2` | 8.56 / 9.08 |
| **Chip — active/selected** | bg `--pm-accent-soft`; text `--pm-accent` | bg `--pm-accent-soft`; text `--pm-accent` | 4.65 / 6.12 |
| **Chip — success (max 1)** | bg `--pm-sage-soft`; text `--pm-sage` | bg `--pm-sage-soft`; text `--pm-sage` | 5.03 / 5.91 |
| **Chip — attention (max 1)** | bg `--pm-accent-soft`; text `--pm-accent`; 1px `--pm-accent` | same, 1px `--pm-accent` | 4.65 / 6.12 |
| **Active tab / active nav** | text `--pm-ink` + 2px bottom `--pm-accent`; no pill | same | ink 17.13; underline 5.47 vs surface |
| **Inactive tab / nav** | text `--pm-ink-3`, 14px/600; no pill, no badge | text `--pm-ink-3` | 5.31 / 5.68 |
| **Input (rest)** | bg `--pm-surface`; 1px `--pm-line-strong`; text `--pm-ink` | bg `--pm-surface`; 1px `--pm-line-strong`; text `--pm-ink` | 17.13 / 15.00 |
| **Input (placeholder)** | `--pm-ink-3` ≥12px | `--pm-ink-3` | 5.31 / 5.68 |
| **Input (focus)** | 1px `--pm-accent`; outline 2px `--pm-accent`, offset 3px (`--pm-bg` halo) | same, halo `--pm-bg` | 5.47 / 7.52 |
| **Input (error)** | 1px `--pm-accent` + 3px left rail `--pm-accent` | same | 5.47 / 7.52 |
| **Button — primary** | bg `--pm-accent`; text `--pm-surface` (= white); 48px | bg `--pm-accent`; text `--pm-bg` (`--pm-on-accent`); 48px | 5.47 / **8.13** |
| **Button — primary hover** | bg `--pm-accent-hover`; text `--pm-surface` | bg `--pm-accent-hover`; text `--pm-bg` | 6.68 / 9.73 |
| **Button — ghost/secondary** | transparent; 1px `--pm-line-strong`; text `--pm-ink-2` | same | 9.73 / 9.96 |
| **Button — ghost hover** | bg `--pm-surface-2` | bg `--pm-surface-3` | 9.73 (unchanged text) / 12.27 |
| **Row / list hover** | bg `--pm-surface-2` | bg `--pm-surface-3` | ink 15.07 / 12.27 |
| **Progress track** | bg `--pm-surface-2` | bg `--pm-surface-2` | — |
| **Progress fill** | bg `--pm-accent` | bg `--pm-accent` | ≥3:1 vs track ✓ |
| **Skeleton / loading** | bg `--pm-surface-2`, opacity 0.6→1, no shimmer | bg `--pm-surface-3`, 0.6→1 | — |
| **Focus ring (any interactive)** | 2px `--pm-accent`, offset 3px | 2px `--pm-accent`, offset 3px | 5.47 / 7.52 |
| **Empty-state icon disc** | bg `--pm-accent-soft`; glyph `--pm-accent` | bg `--pm-accent-soft`; glyph `--pm-accent` | 4.65 / 6.12 |
| **KPI number** | `--pm-ink`, Fraunces, tabular-nums | `--pm-ink` | 17.13 / 15.00 |
| **Eyebrow (12px/700)** | `--pm-accent` | `--pm-accent` | 5.47 / 8.13 |

---

## 6. Dark mode — decisions beyond inversion

1. **Base is warm, not neutral.** `#15130F / #1E1B16 / #27231C / #302B23` keep a brown undertone;
   never substitute `#000000`, `#121212` or cool slate.
2. **Accent flips role, not value.** `#E69A6C` is a *light* copper: it is a TEXT/active colour
   (7.52:1 on surface). Only the thing *on top of it* inverts to `#15130F`. White on it is banned.
3. **Surfaces carry the depth, borders nearly vanish.** `--pm-line` `#373127` on surface is 1.33:1 —
   intentional. Structure comes from surface steps + shadow, never from bright borders.
4. **Shadows: deeper and larger, zero light/grey glow.** Keep
   `--pm-shadow-1: 0 1px 2px rgba(0,0,0,.35), 0 10px 28px rgba(0,0,0,.28)` and
   `--pm-shadow-2: 0 4px 12px rgba(0,0,0,.4), 0 28px 64px rgba(0,0,0,.42)`.
   No `drop-shadow`, no coloured shadow, no white halo.
5. **Muted list (reduce, don't remove):** `--pm-ink-3` only for ≥12px meta; `--pm-sage` restricted to
   one success instance; `--pm-brass` restricted to one display ornament; `--pm-accent-soft` used
   only for genuinely selected rows; all chip fills default to `--pm-surface-2`, not accent-soft.
6. **Focus halo** = `--pm-bg` (dark page) rather than a soft glow, so the 2px accent ring reads cleanly.
7. **Images/emoji:** the dashboard fox avatar and hero emoji stay as-is; no recolour, no filter.
8. **Hero stays dark in both themes** (`#6B4426 → #3E2716`) — it is copy on a dark surface, not an inversion.

---

## 7. Handoff / risks

- **Blocker for one agent:** the onboarding provider card currently has a 1px terracotta border on the
  selected item. Keep that border `--pm-accent` (5.47:1 vs surface) and the fill `--pm-accent-soft`.
  The "TAVSIYA" tag is the screen's single allowed sage instance.
- **Blocker for another agent:** any file that writes `color: #fff` on `--pm-accent` must be changed.
  Use `--pm-on-accent` (light `#FFFFFF`, dark `#15130F`).
- **Risk:** brass is only 3.51:1 on white. Enforcement is by role (≥24px, one instance), not by token.
  If an agent needs brass at 12px, escalate — do not silently darken the token.
- **Risk:** ink-3 on `#F4F0E8` is 4.67:1 and on `#F7EFE4` is 4.66:1. Both pass, but any further
  warm-tint darkening of those surfaces breaks AA. Keep hero cards at `#F7EFE4` or lighter.
- **Verification performed:** all 60+ pair ratios above computed directly from the exact hex values;
  no estimate used. Screens mentally checked at 1440 / 900 / 620 / 375 — accent budget holds at
  narrow widths because accent is a small fill/underline, not a surface.
