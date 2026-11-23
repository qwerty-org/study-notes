# 06 — Dark Mode (Design Lead decision)

> Single source of truth for the **dark theme** of `study-notes`. Element agents implement these values; they do not re-decide them.
> Spec: `docs/superpowers/specs/2026-11-23-premium-design-system.md` · Tokens: `apps/desktop/src/styles/premium/00-tokens.css` · Legacy dark: `apps/desktop/src/styles/theme.css` `[data-theme='dark']`.
>
> **Provenance note:** the referenced `after-dashboard.png` (light) was **not present in the workspace** at decision time — no file of that name exists anywhere under `docs/`, `apps/`, or the user profile. Decisions below were derived from the shipped spec, the live token file, legacy `theme.css` dark block, and the shipped TSX (as sibling doc `08-hierarchy.md` also records). If the screenshot later appears and contradicts source, source wins.

---

## 0. OLD → NEW — every token change (read this first)

All ratios are WCAG 2.1 contrast, computed on the **dark** backgrounds. "Inherited" means the token was added by the token agent to `:root` but **not** overridden in `[data-theme='dark']`, so it silently leaks a light-mode value into dark mode.

| Token | OLD (current / inherited) | NEW (final dark) | Why — decisive reason |
|---|---|---|---|
| `--pm-on-accent` | `#ffffff` (inherited) | **`#15130f`** | White on light accent `#e69a6c` = **2.28:1** → fails AA. Dark ink on accent = **8.13:1**. This is the single biggest bug in the current dark theme: every primary button is unreadable. |
| `--pm-line-strong` | `#4e4638` | **`#7a6e59`** | Old = 1.99:1 on `--pm-bg` — effectively invisible as a control boundary (WCAG 1.4.11 needs ≥3:1). New = 3.71 bg / 3.43 surface / 3.13 surface-2. Use **only** for ghost-button / input / segmented outlines; decorative dividers keep `--pm-line`. |
| `--pm-shadow-1` | `0 1px 2px rgba(0,0,0,.35), 0 10px 28px rgba(0,0,0,.28)` | **`inset 0 1px 0 rgba(245,239,228,.06), 0 1px 2px rgba(0,0,0,.50), 0 10px 28px rgba(0,0,0,.55)`** | Pure black cannot darken `#15130f` meaningfully; the current shadow is invisible. A 1px light rim lifts the surface edge instead. |
| `--pm-shadow-2` | `0 4px 12px rgba(0,0,0,.40), 0 28px 64px rgba(0,0,0,.42)` | **`inset 0 1px 0 rgba(245,239,228,.09), 0 6px 16px rgba(0,0,0,.60), 0 32px 72px rgba(0,0,0,.70)`** | Same reason, stronger; hero/modal/popmenu need a visible elevation cue on near-black. |
| `--pm-shadow-focus` | `0 0 0 3px var(--pm-accent-soft)` | **`0 0 0 3px rgba(230,154,108,.28)`** | `#3a281f` on `#15130f` = **1.33:1** — the halo is invisible. The 2px solid accent ring still does the accessible work; halo becomes a real, soft accent glow. |
| `--pm-danger` | `#b5473d` (inherited light) | **`#e07b6f`** | #b5473d = 3.47:1 on bg → fails AA body text. New = 6.39 bg / 5.91 surface. |
| `--pm-danger-soft` | `#f7e9e7` (inherited light) | **`#2e1d1a`** | A light-pink fill would be a glare hole in a dark UI. New keeps danger text at 5.53:1 on its own tint. |
| `--pm-hero-gold` | `#dcc08a` (inherited light) | **`#cbaa72`** | Old passes (9.77:1) but reads as a bright glow on dark; muted to 7.79:1 on surface / 7.42:1 on hero panel. |

**Every other `--pm-*` token is UNCHANGED.** The supplied dark text palette and accent/sage/brass hues already pass AA — do not "fix" them. Below is the full final palette so agents can work from one table.

---

## 1. Final dark palette — exact hex for every `--pm-*` token

| Token | FINAL dark value | Status | Role |
|---|---|---|---|
| `--pm-bg` | `#15130f` | keep | warm near-black page canvas |
| `--pm-surface` | `#1e1b16` | keep | card / panel / topbar / popmenu face |
| `--pm-surface-2` | `#27231c` | keep | input fill, chip fill, track, hover |
| `--pm-surface-3` | `#302b23` | keep | raised fill, skeleton, deepest chip |
| `--pm-ink` | `#f5efe4` | keep | primary text, headings, on-accent fallback |
| `--pm-ink-2` | `#cfc4b2` | keep | body / secondary text |
| `--pm-ink-3` | `#9e9383` | keep | hints ≥12px only; icons, inactive nav |
| `--pm-line` | `#373127` | keep | **decorative** dividers only (1.44:1 — never a control boundary) |
| `--pm-line-strong` | `#7a6e59` | **CHANGED** | 1px outline of ghost buttons, inputs, segmented controls |
| `--pm-accent` | `#e69a6c` | keep | one CTA, focus ring, active underline, progress fill |
| `--pm-accent-soft` | `#3a281f` | keep | active chip fill, selection, muted accent wash |
| `--pm-accent-hover` | `#f0ad83` | keep | hover of accent fill (dark on-accent text = 9.73:1) |
| `--pm-on-accent` | `#15130f` | **CHANGED** | text/icon on any `--pm-accent` fill |
| `--pm-hero-gold` | `#cbaa72` | **CHANGED** | hero-only gilded detail, max 1–2 spots |
| `--pm-hero-ink` | `#f5efe4` | keep | equals `--pm-ink` in dark |
| `--pm-sage` | `#93b5a3` | keep | verified/success state, chip text only |
| `--pm-sage-soft` | `#25332b` | keep | sage chip fill |
| `--pm-brass` | `#d9b46e` | keep | badge/earned state, chip text only |
| `--pm-brass-soft` | `#33291b` | keep | brass chip fill |
| `--pm-danger` | `#e07b6f` | **CHANGED** | destructive text / outline only, never filled |
| `--pm-danger-soft` | `#2e1d1a` | **CHANGED** | danger chip fill |
| `--pm-transparent` | `transparent` | keep | — |
| `--pm-shadow-1` | see §4 (3 layers) | **CHANGED** | cards, rows, chips with depth |
| `--pm-shadow-2` | see §4 (3 layers) | **CHANGED** | hero, dropzone, popmenu, modal |
| `--pm-shadow-focus` | `0 0 0 3px rgba(230,154,108,.28)` | **CHANGED** | soft focus halo |
| `--pm-r-sm` / `--pm-r` / `--pm-r-lg` / `--pm-r-pill` / `--pm-r-control` | `10 / 16 / 24 / 999 / 12px` | keep | radius hierarchy |
| type scale, spacing, fonts, motion tokens | unchanged | keep | dark changes colour/depth only |

**New token requests (not introduced here — element agents must use the listed fallback):**

| Requested token | Proposed dark / light | Fallback until added |
|---|---|---|
| `--pm-reader-paper` | `#221f18` / `#fffdf8` | `var(--pm-surface)` in dark |
| `--pm-control-border` | can alias `--pm-line-strong` | `var(--pm-line-strong)` |

---

## 2. Contrast validation — computed ratios, every text/background pair

AA thresholds used: **≥4.5:1** for body text, **≥3:1** for large text (≥24px regular / ≥18.66px bold) and for UI component boundaries. All values below are computed, not estimated.

### 2.1 Body text (≥4.5:1)

| Foreground | Background | Ratio | Result |
|---|---|---:|---|
| `--pm-ink` `#f5efe4` | `--pm-bg` `#15130f` | **16.21:1** | PASS |
| `--pm-ink` `#f5efe4` | `--pm-surface` `#1e1b16` | **15.00:1** | PASS |
| `--pm-ink` `#f5efe4` | `--pm-surface-2` `#27231c` | **13.66:1** | PASS |
| `--pm-ink` `#f5efe4` | `--pm-surface-3` `#302b23` | **12.27:1** | PASS |
| `--pm-ink-2` `#cfc4b2` | `--pm-bg` `#15130f` | **10.77:1** | PASS |
| `--pm-ink-2` `#cfc4b2` | `--pm-surface` `#1e1b16` | **9.96:1** | PASS |
| `--pm-ink-2` `#cfc4b2` | `--pm-surface-2` `#27231c` | **9.08:1** | PASS |
| `--pm-ink-3` `#9e9383` | `--pm-bg` `#15130f` | **6.14:1** | PASS |
| `--pm-ink-3` `#9e9383` | `--pm-surface` `#1e1b16` | **5.68:1** | PASS |
| `--pm-ink-3` `#9e9383` | `--pm-surface-2` `#27231c` | **5.18:1** | PASS (12px-safe) |
| `--pm-accent` `#e69a6c` | `--pm-bg` `#15130f` | **8.13:1** | PASS |
| `--pm-accent` `#e69a6c` | `--pm-surface` `#1e1b16` | **7.52:1** | PASS |
| `--pm-accent` `#e69a6c` | `--pm-accent-soft` `#3a281f` | **6.12:1** | PASS |
| `--pm-on-accent` `#15130f` | `--pm-accent` `#e69a6c` | **8.13:1** | PASS |
| `--pm-on-accent` `#15130f` | `--pm-accent-hover` `#f0ad83` | **9.73:1** | PASS |
| `--pm-sage` `#93b5a3` | `--pm-sage-soft` `#25332b` | **5.91:1** | PASS |
| `--pm-sage` `#93b5a3` | `--pm-surface` `#1e1b16` | **7.67:1** | PASS |
| `--pm-brass` `#d9b46e` | `--pm-brass-soft` `#33291b` | **7.26:1** | PASS |
| `--pm-brass` `#d9b46e` | `--pm-surface` `#1e1b16` | **8.75:1** | PASS |
| `--pm-danger` `#e07b6f` | `--pm-bg` `#15130f` | **6.39:1** | PASS |
| `--pm-danger` `#e07b6f` | `--pm-danger-soft` `#2e1d1a` | **5.53:1** | PASS |
| `--pm-ink` `#f5efe4` | reader paper `#221f18` | **14.37:1** | PASS |
| `--pm-ink-2` `#cfc4b2` | reader paper `#221f18` | **9.55:1** | PASS |
| `--pm-hero-gold` `#cbaa72` | hero panel `#241f18` | **7.42:1** | PASS |
| `--pm-ink` `#f5efe4` | `--pm-accent-soft` `#3a281f` | **12.21:1** | PASS |

### 2.2 UI boundaries and large text (≥3:1)

| Foreground / edge | Background | Ratio | Result |
|---|---|---:|---|
| `--pm-line-strong` `#7a6e59` | `--pm-bg` `#15130f` | **3.71:1** | PASS (control outline) |
| `--pm-line-strong` `#7a6e59` | `--pm-surface` `#1e1b16` | **3.43:1** | PASS |
| `--pm-line-strong` `#7a6e59` | `--pm-surface-2` `#27231c` | **3.13:1** | PASS (input outline) |
| `--pm-accent` focus ring `#e69a6c` | `--pm-bg` `#15130f` | **8.13:1** | PASS |
| `--pm-accent` focus ring `#e69a6c` | `--pm-surface` `#1e1b16` | **7.52:1** | PASS |
| `--pm-accent` focus ring `#e69a6c` | `--pm-accent-soft` `#3a281f` | **6.12:1** | PASS |

**Explicit non-compliance, accepted:** `--pm-line` `#373127` = **1.44:1** on bg and `--pm-line-strong` old value = 1.99:1. These are decorative dividers only (WCAG 1.4.11 excludes inactive/decorative graphics). Never use `--pm-line` to outline an interactive control — that is what `--pm-line-strong` is for now.

**Never do this in dark:** `#ffffff` or `--pm-ink` text on an `--pm-accent` fill (2.28:1 / 1.99:1) — both FAIL. Also `--pm-danger` old `#b5473d` as text (3.47:1) — FAIL. These are the two traps the legacy CSS currently contains.

---

## 3. Muting of accent / sage / brass; focus rings & active states

### 3.1 How much each colour is muted

On a dark canvas saturation reads as *intensity*, not richness. So the three chromatic tokens are **lightened** into a capped 15–17% / 64–66% lightness band and their soft backgrounds are pushed down to ~15–17% lightness. Chroma is deliberately **preserved** so status meaning survives; visual weight is suppressed by **area restriction**, not by greying them out.

| Token | Light HSL | Dark HSL | Δ Lightness | Δ Saturation | Muting verdict |
|---|---|---|---:|---:|---|
| `--pm-accent` | (17°, 60%, 41%) `#a94f2a` | (23°, 71%, 66%) `#e69a6c` | **+25** | +11 | Most suppressed **by usage**: one CTA + focus + active underline only, never a large fill. Lightness capped at 66% — no bright orange. |
| `--pm-accent-soft` | (21°, 56%, 93%) `#f7eae3` | (20°, 30%, 17%) `#3a281f` | **−76** | −26 | Flipped from near-white to a deep brown tint; reads as a faint warm wash, not a panel. |
| `--pm-sage` | (150°, 15%, 36%) `#4f6b5d` | (148°, 19%, 64%) `#93b5a3` | **+28** | +4 | Near-neutral already; muted by limiting to ≤1 success chip and its `#25332b` fill. |
| `--pm-sage-soft` | (135°, 21%, 93%) `#e8f0ea` | (146°, 16%, 17%) `#25332b` | **−76** | −5 | Dark green-black tint; no pale green blocks. |
| `--pm-brass` | (38°, 44%, 46%) `#a88342` | (39°, 58%, 64%) `#d9b46e` | **+18** | +14 | Highest chroma of the three → most tightly restricted: ≤1 earned-badge chip per screen. |
| `--pm-brass-soft` | (41°, 52%, 92%) `#f5eedf` | (35°, 31%, 15%) `#33291b` | **−77** | −21 | Deep brown-gold tint, max 15% lightness. |
| `--pm-hero-gold` | (inherits) `#dcc08a` | `#cbaa72` | — | — | Extra mute vs light: −11 lightness, hoarded for hero detail only. |

**Rule:** ink + at most one chromatic token per screen. Amber/sage/brass appear only inside a 28px status chip or a ≤3px chart bar. No coloured shadow, no coloured gradient outside the hero.

### 3.2 Focus rings

```css
/* final dark focus, all interactive elements */
:focus-visible {
  outline: 2px solid var(--pm-accent);      /* #e69a6c — 8.13:1 on bg */
  outline-offset: 3px;
  box-shadow: var(--pm-shadow-focus);        /* 0 0 0 3px rgba(230,154,108,.28) */
}
h1[tabindex='-1']:focus,
h2[tabindex='-1']:focus,
main[tabindex='-1']:focus { outline: none; } /* unchanged, script-focus only */
```
- Ring colour is **always `--pm-accent`** — never white, never legacy `--primary`/`--blue`, never `--pm-accent-hover`.
- The halo is decorative; the 2px ring alone satisfies ≥3:1 on every surface (see §2.2).
- Buttons that already carry `--pm-shadow-1/2` get the halo added **after** their shadow in the `box-shadow` list, so the ring isn't clipped.

### 3.3 Active / selected states

| State | Treatment in dark |
|---|---|
| Active nav item | `--pm-ink` text (600→700) + **2px `--pm-accent` bottom underline**. **No fill** in dark — a `--pm-accent-soft` block on near-black reads as a muddy brown tile. |
| Active filter / segmented | `--pm-surface-2` `#27231c` fill + `--pm-ink` text + 2px accent underline. Outline uses `--pm-line-strong`. |
| Active chip | fill `--pm-accent-soft` `#3a281f`, text `--pm-accent` `#e69a6c` (6.12:1). |
| Checkbox / radio / toggle on | track `--pm-accent`, knob `--pm-on-accent` `#15130f`, off-track `--pm-surface-2` with `--pm-line-strong` border. |
| Primary button hover | `--pm-accent-hover` `#f0ad83`, text stays `--pm-on-accent` (9.73:1). |
| Ghost button hover | `--pm-surface-2`; border stays `--pm-line-strong`. |
| Disabled | `opacity: .38` (slightly higher than light's .28 — dark swallows low opacity); keep text `--pm-ink-3`. |
| Text selection | `background: #3a281f; color: #f5efe4` (12.21:1). |

---

## 4. Shadow strategy in dark — exact values

**Problem with current values:** both shadows are pure `rgba(0,0,0,…)`. On `#15130f` there is almost no darker value to go to — a 70% black shadow shifts the canvas by only a few luminance points. Meanwhile the surface (`#1e1b16`) sits just ~1.3:1 above the canvas, so elevation is barely legible. Pure-black shadow alone cannot solve dark elevation.

**Strategy:** (1) an **inset 1px warm-light top rim** that catches the surface edge and makes the panel read as a distinct object; (2) a **tighter, slightly stronger contact shadow** for grounding; (3) a **large ambient black** for depth. No coloured shadows, no `drop-shadow`, no multi-layer rainbow.

```css
[data-theme='dark'] {
  --pm-shadow-1:
    inset 0 1px 0 rgba(245, 239, 228, 0.06),
    0 1px 2px  rgba(0, 0, 0, 0.50),
    0 10px 28px rgba(0, 0, 0, 0.55);

  --pm-shadow-2:
    inset 0 1px 0 rgba(245, 239, 228, 0.09),
    0 6px 16px  rgba(0, 0, 0, 0.60),
    0 32px 72px rgba(0, 0, 0, 0.70);

  --pm-shadow-focus: 0 0 0 3px rgba(230, 154, 108, 0.28);
}
```

| Layer | Old (dark) | New (dark) | Effect |
|---|---|---|---|
| Rim | none | `inset 0 1px 0 rgba(245,239,228,.06/.09)` | lifts card edge; the actual elevation cue on near-black |
| Contact | `0 1px 2px rgba(0,0,0,.35)` / `0 4px 12px rgba(0,0,0,.4)` | `0 1px 2px rgba(0,0,0,.50)` / `0 6px 16px rgba(0,0,0,.60)` | tighter + stronger grounding |
| Ambient | `0 10px 28px rgba(0,0,0,.28)` / `0 28px 64px rgba(0,0,0,.42)` | `0 10px 28px rgba(0,0,0,.55)` / `0 32px 72px rgba(0,0,0,.70)` | real depth for hero / popmenu / modal |

**Do not** use `rgba(88,204,2,…)` green shadows, `rgba(24,28,40,…)` blue-grey shadows, or `rgba(0,0,0,.015)` hairlines — all three exist in legacy CSS and are tuned for a light canvas. Replace with `--pm-shadow-*` (see §6).

---

## 5. Dark-specific component detail

### 5.1 Reader paper
- Requested `--pm-reader-paper: #221f18` (fallback `var(--pm-surface)` until added). Text `--pm-ink` `#f5efe4` = **14.37:1**, secondary `--pm-ink-2` = **9.55:1**.
- Max width **66ch**, line-height 1.6, radius 16, padding 32 (20 on ≤620px). No pure white anywhere in the reading column; no borders — rely on the paper/surface step + `--pm-shadow-1`.
- **Disable `--paper-grain` in dark.** The SVG turbulence is tuned with `opacity:.25` + `soft-light` for a light canvas; on near-black it muddies text. Set `background-image: none` on the reader and on `.main` (see §6).
- Selection `#3a281f` on `#f5efe4`; caret `--pm-accent`.

### 5.2 Hero panel
- Base `--pm-surface` `#1e1b16`; only gradient allowed in the whole app:
  `linear-gradient(160deg, #241f18 0%, #1e1b16 100%)` — ink on the lighter stop = **14.29:1**.
- Remove the legacy `radial-gradient(... color-mix(--primary 6%) ...)` from `.main` in dark (§6) — it produces a brown glow behind the hero. If a hint of warmth is desired, cap it at 3% and only inside the hero panel.
- Radius 24 (`--pm-r-lg`), padding 32, `--pm-shadow-2`, no border. Hero gold detail `--pm-hero-gold` `#cbaa72` = **7.42:1** on the panel; max two spots.
- One CTA only, 48px, `--pm-accent` fill, `--pm-on-accent` `#15130f` text (8.13:1).
- No `backdrop-filter` on the hero or topbar in dark — it creates a grey haze over near-black. Use solid `--pm-surface`.

### 5.3 Chart bars
- Track `--pm-surface-2` `#27231c`; gridlines `--pm-line` `#373127`.
- Primary series `--pm-accent` `#e69a6c` (8.13:1 on bg). Secondary series `--pm-brass` `#d9b46e` at 0.8 opacity; tertiary `--pm-sage` `#93b5a3` at 0.8 opacity. Comparison/muted bars `--pm-ink-3` `#9e9383` at 0.5 opacity.
- Zero-value bars render **track only** — no 8% stub. Radius 999 on bar ends, min height 3px, max 8px. Label numbers `font-variant-numeric: tabular-nums`, `--pm-ink-2`.
- Never use legacy `--blue` / `--green` / `--yellow` chart hues in dark; map them to accent/brass/sage.

### 5.4 Chips
- Height 28, radius `--pm-r-pill`, padding `0 12px`, 12px/600.
- Default: fill `--pm-surface-2` `#27231c`, text `--pm-ink-2` `#cfc4b2` = **9.08:1**.
- Active: fill `--pm-accent-soft` `#3a281f`, text `--pm-accent` `#e69a6c` = **6.12:1**.
- Success: `#93b5a3` on `#25332b` = **5.91:1**. Earned/badge: `#d9b46e` on `#33291b` = **7.26:1**. Danger: `#e07b6f` on `#2e1d1a` = **5.53:1**.
- Max one chip per card; never a white/pale chip fill in dark; never a chip containing a link.

### 5.5 Inputs
- Fill `--pm-surface-2` `#27231c`, text `--pm-ink`, placeholder `--pm-ink-3` (**5.18:1**, safe at 12px+).
- Border `1px solid var(--pm-line-strong)` `#7a6e59` = **3.13:1** on the input's own fill → passes 1.4.11.
- Height 48 (`--h-lg` legacy) / 44 ghost, radius `--pm-r-control` 12px, padding `0 16px`.
- Focus: `2px --pm-accent` outline, 3px offset, plus `--pm-shadow-focus` halo; caret `--pm-accent`.
- Autofill override required (browsers force white): see §6.

### 5.6 Popmenu (dropdown / select / context menu)
- **Solid** `--pm-surface` `#1e1b16` — remove `backdrop-filter` and any `color-mix(… transparent)` from the legacy menu (blur over near-black greys it out).
- Radius `--pm-r` 16px, 1px `--pm-line`, `--pm-shadow-2`, max-width 320px, padding 8px.
- Item: 40px tall, 13px/600 `--pm-ink-2`; hover `--pm-surface-2`; selected `--pm-accent-soft` + `--pm-accent` text. Separator `--pm-line`.
- No green/blue glow (`--blue-soft` radial) and no `rgba(255,255,255,.97)` text — both present in legacy CSS (§6).

### 5.7 Modal
- Scrim `rgba(8, 7, 5, 0.72)` — darker than light so the panel clearly floats. (Legacy `rgba(0,0,0,.55)` is acceptable but .72 is calmer over a warm canvas.)
- Panel `--pm-surface`, radius `--pm-r-lg` 24px, padding 32, `--pm-shadow-2` plus `0 40px 100px rgba(0,0,0,.70)` for very large dialogs.
- Title 24px/600 Fraunces `--pm-ink`; body 14px/500 `--pm-ink-2`; close = 44px ghost with `--pm-line-strong` outline.
- One primary action, `--pm-accent` fill + `--pm-on-accent` `#15130f` text; secondary stays ghost. Danger stays **outline only** in `--pm-danger`, never filled.

---

## 6. Implementation map — selectors needing explicit dark overrides beyond token swapping

Token swapping handles every premium `--pm-*` consumer automatically. What **does not** swap is hard-coded legacy CSS. These selectors need an explicit `[data-theme='dark'] …` rule. Owner column = agent who should apply it (this doc does not edit their files).

| Selector / pattern (file) | Required dark override | Owner |
|---|---|---|
| `[data-theme='dark']` in `premium/00-tokens.css` | Add the 8 NEW values from §0 (`--pm-on-accent`, `--pm-line-strong`, 3 shadows, `--pm-danger`, `--pm-danger-soft`, `--pm-hero-gold`). This is the enabling change — do it first. | token agent |
| `.topbar` (`theme.css` L192–199) | `background: var(--pm-surface); backdrop-filter: none; border-bottom: 1px solid var(--pm-line);` — kill `color-mix(--card 88%)` + blur haze | `02-topbar.css` |
| `.brand .mark` (`theme.css` L201–205) | Replace `inset 0 -2px 0 rgba(0,0,0,.12)` with `inset 0 -2px 0 rgba(0,0,0,.18)` or the §4 rim; accent mark stays `--pm-accent` | `04-brand.css` |
| `:focus-visible` (`theme.css` L172–175) | `outline-color: var(--pm-accent); outline-offset: 3px; box-shadow: var(--pm-shadow-focus);` | shell / global |
| `.nav-item.active` (`theme.css` L221–225) | bg transparent, text `--pm-ink`, underline `--pm-accent`; outline `--pm-line-strong` | `03-nav.css` |
| `.main` (`theme.css` L256–265) | `background-image: none` in dark (removes radial glow + `--paper-grain`) | shell / global |
| `.nx-reader`, reading column | `background: var(--pm-reader-paper)` (fallback `--pm-surface`); no grain; 66ch | book reader agent |
| `.nx-hero`, `.nx-dropzone` | `linear-gradient(160deg,#241f18,#1e1b16)`, `--pm-shadow-2`, no blur, CTA text `--pm-on-accent` | dashboard/library agents |
| chart / bar / progress selectors | track `--pm-surface-2`; series accent/brass/sage @ .8; muted `--pm-ink-3` @ .5; no `--blue`/`--green` | stats agent |
| chip / badge selectors | §5.4 exact fills; replace all `rgba(255,255,255,…)` chip text | chips agent |
| input / select / textarea | `--pm-surface-2` fill; `--pm-line-strong` border; **plus `:-webkit-autofill { -webkit-text-fill-color: var(--pm-ink); -webkit-box-shadow: 0 0 0 1000px var(--pm-surface-2) inset; }`** | form/input agent |
| popmenu / dropdown | solid surface, no `backdrop-filter`, no `--blue-soft` radial, no white text (see next rows) | popmenu agent |
| modal / dialog | scrim `rgba(8,7,5,.72)`, panel shadow §4, `--pm-on-accent` on primary | modal agent |
| `color:#fff` in `global.css` — L245, 314, 366, 736, 1617, 1625, 1854, 1898, 2339, 2491 | → `var(--pm-on-accent)` when on accent; → `var(--pm-ink)` otherwise | respective element agents |
| `rgba(255,255,255,…)` in `global.css` — L1452, 2507, 2516, 2518, 2526 | → `var(--pm-ink-2)` / `var(--pm-ink)`; `.term-face.back h3{color:#fff}` → `--pm-ink` | flashcard / term agent |
| `--btn-text:#ffffff` (`global.css` L1117–1127) | dark override → `var(--pm-on-accent)` | buttons agent |
| `rgba(88,204,2,.3/.32/.35)` green shadows (`global.css` L247, 454, 1899, 2203) | → `var(--pm-shadow-1)`; neon green shadow is a light-mode leftover | buttons agent |
| `rgba(24,28,40,.07/.08/.16)` blue-grey shadows (`global.css` L770, 951, 1425) | → `var(--pm-shadow-1)` / `--pm-shadow-2` | respective agents |
| `radial-gradient(... var(--blue-soft) / --primary-soft ...)` (`global.css` L592–593, 930–931, 1872–1873, 2079–2080) | `background-image: none` in dark | panel/hero agents |
| `linear-gradient(135deg, var(--primary), var(--blue))` (`global.css` L242, 449, 1895, 2198) | → solid `var(--pm-accent)` in dark (with `--pm-on-accent` text) | buttons agent |
| `box-shadow: 0 0 0 3px var(--blue-soft)` (`global.css` L397) | → `var(--pm-shadow-focus)` + `--pm-accent` ring | focus / shell |
| `backdrop-filter: blur(6px)` (`global.css` L1475) | `backdrop-filter: none` in dark, solid `--pm-surface` | popmenu agent |
| `inset 0 -4px 0 rgba(0,0,0,.12)` / `inset 0 -2px 0 rgba(0,0,0,.13)` (`global.css` L1233, 1922) | black inset is invisible on near-black → use §4 light rim or drop it | buttons agent |
| `--yellow-soft: rgba(255,200,0,.16/.18)` / `--red-soft: rgba(255,75,75,…)` (`global.css` L33, 37, 90, 91) | dark override → `rgba(217,180,110,.16)` / `rgba(224,123,111,.16)` | tokens / status agents |

**Order matters:** the token agent's `[data-theme='dark']` block must land first; every element agent then writes its own `[data-theme='dark'] …` selector using only `--pm-*` tokens (no literal hex in element files, per spec rule 2). Premium files import last, so no `!important` is needed.

---

## 7. Forwarding notes to element agents

1. **Button text is inverted in dark.** `--pm-on-accent` changes from white to `#15130f`. If your button uses `--pm-ink` or a literal `#fff` on an accent fill, it currently fails at 1.99–2.28:1. Fix it.
2. **Two new/changed outlines:** control boundaries use `--pm-line-strong` `#7a6e59`; decorative dividers keep `--pm-line` `#373127`. Do not swap them.
3. **Shadows now include an inset light rim.** If your component sets its own `box-shadow`, append `var(--pm-shadow-focus)` after it so the focus halo isn't lost.
4. **No blur in dark.** Remove `backdrop-filter` and `color-mix(… transparent)` from topbar, popmenu, and hero.
5. **Danger is outline-only and now readable** (`#e07b6f`, 6.39:1). Never fill it.
6. **Status colours stay tiny:** sage/brass/danger only inside 28px chips; accent is the only chromatic token allowed as a fill, once per screen.
7. **Grain and colour glows are light-mode-only** — disable `--paper-grain` and all `radial-gradient` washes under dark.

### Risks / requests
- `--pm-reader-paper` and an explicit `--pm-control-border` would be cleaner than fallbacks; requested from the token agent. `--pm-line-strong` is the approved fallback until then.
- The light screenshot is unavailable — if it lands, re-check only §5 component details, not the §1–§4 colour/depth decisions (those are derived from source and AA math).
- `:focus-visible` currently lives in legacy `theme.css` using `--primary`; until it is redirected to `--pm-accent`, the ring colour will be `#e08b5c` instead of `#e69a6c`. Both pass contrast, but only the latter is canonical.
