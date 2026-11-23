# Colour Round 2 — Direction 04: **Library Green**

**Status:** proposal (one decisive direction; no options).
**Scope:** `apps/desktop/src/styles/premium/00-tokens.css` only — every `--pm-*` colour token, light + dark.
**Intent:** replace the warm terracotta / beige-yellow system with a calm *library reading-room* palette: soft green-cast ivory paper, deep forest green as the single accent, sage as the quiet support tone. No orange, no beige-yellow, no brass-gold.

> Note on token names: `--pm-hero-gold` and `--pm-brass` are **retained names** for source compatibility, but their values are retuned to a pale sage and a muted olive-sage respectively. They no longer read as gold or brass-yellow. The visual language is green throughout.

---

## 1. Complete palette — light + dark hex table

### Surfaces

| Token | Light (new) | Dark (new) | Role |
|---|---|---|---|
| `--pm-bg` | `#f3f5f0` | `#101a14` | App/page canvas — soft green-cast ivory; deep green-black |
| `--pm-surface` | `#ffffff` | `#18251d` | Cards, bars, reader paper (light) — clean white; raised forest panel (dark) |
| `--pm-surface-2` | `#e9eee7` | `#213029` | Secondary tiles, book-cover fallback, drops — pale sage mist |
| `--pm-surface-3` | `#dce5db` | `#2b3d33` | Deepest neutral surface, hero gradient stop, chips |
| `--pm-reader-paper` *(add to `:root`)* | `#fbfcf8` | `#16231b` | Dedicated reading paper; light = warm-neutral ivory free of yellow, dark = green-black distinct from `--pm-surface` |

### Text

| Token | Light (new) | Dark (new) | Role |
|---|---|---|---|
| `--pm-ink` | `#16241c` | `#f2f5ee` | Primary text — deep forest-ink; cool ivory |
| `--pm-ink-2` | `#40564a` | `#c3d0c2` | Secondary text — green-slate; pale sage-grey |
| `--pm-ink-3` | `#627566` | `#95a698` | Tertiary/meta text — muted sage; grey-sage |

### Lines

| Token | Light (new) | Dark (new) | Role |
|---|---|---|---|
| `--pm-line` | `#dfe6dc` | `#2e3f35` | Hairline dividers |
| `--pm-line-strong` | `#b8c7b8` | `#62806c` | Emphasised dividers / card separation |
| `--pm-control-border` *(add to `:root`)* | `#7b907d` | `#587261` | Input & control outline — meets 3:1 UI component contrast |

### Accent (deep forest — the only true accent)

| Token | Light (new) | Dark (new) | Role |
|---|---|---|---|
| `--pm-accent` | `#1f5136` | `#9cc7a8` | Primary action, active nav, progress, margin rule |
| `--pm-accent-soft` | `#e3ede2` | `#25382c` | Accent wash, focus ring, soft chip background |
| `--pm-accent-hover` | `#163f28` | `#b3d7bb` | Hover/pressed state |
| `--pm-on-accent` | `#ffffff` | `#101a14` | Text/glyph on `--pm-accent` |

### Hero / signature

| Token | Light (new) | Dark (new) | Role |
|---|---|---|---|
| `--pm-hero-ink` | `#f6f7f1` | `#f2f5ee` | Ivory type on deep forest hero panel and book covers |
| `--pm-hero-gold` *(renamed role: "sage-gilt")* | `#c3d2b3` | `#cbd8b8` | Eyebrow and italic emphasis on hero — pale sage, never yellow |

### Support greens

| Token | Light (new) | Dark (new) | Role |
|---|---|---|---|
| `--pm-sage` | `#54705c` | `#9dc2a6` | Secondary green: completed rings, "ready" chips, quiz marks |
| `--pm-sage-soft` | `#e7eee5` | `#24382b` | Sage chip/wash background |
| `--pm-brass` *(renamed role: "olive folio")* | `#5b684c` | `#a8b58c` | Folio numbers, cover marks — aged olive, not brass-yellow |
| `--pm-brass-soft` | `#eef0e6` | `#2c3525` | Olive wash |

### Status & misc

| Token | Light (new) | Dark (new) | Role |
|---|---|---|---|
| `--pm-danger` | `#a33a48` | `#e3838b` | Cool crimson-rose — no orange, no coral |
| `--pm-danger-soft` | `#f6e8ea` | `#3a2328` | Error wash |
| `--pm-transparent` | `transparent` | `transparent` | Unchanged |

### Shadows (green-black, replacing warm brown)

```css
/* light */
--pm-shadow-1: 0 1px 2px rgba(22, 36, 28, 0.05), 0 8px 24px rgba(22, 36, 28, 0.06);
--pm-shadow-2: 0 2px 8px rgba(22, 36, 28, 0.06), 0 24px 60px rgba(22, 36, 28, 0.08);
--pm-shadow-focus: 0 0 0 3px var(--pm-accent-soft);   /* auto-retuned */

/* [data-theme='dark'] */
--pm-shadow-1: inset 0 1px 0 rgba(242, 245, 238, 0.06), 0 10px 28px rgba(4, 10, 6, 0.5);
--pm-shadow-2: inset 0 1px 0 rgba(242, 245, 238, 0.08), 0 28px 64px rgba(4, 10, 6, 0.6);
```

Non-colour tokens (radius, spacing, motion, type scale, fonts) are **untouched**.

---

## 2. Explicit old → new mapping

### Light theme (`:root`)

| Token | Old | New |
|---|---|---|
| `--pm-bg` | `#faf8f4` | `#f3f5f0` |
| `--pm-surface` | `#ffffff` | `#ffffff` *(unchanged)* |
| `--pm-surface-2` | `#f4f0e8` | `#e9eee7` |
| `--pm-surface-3` | `#ede7dc` | `#dce5db` |
| `--pm-ink` | `#1f1b15` | `#16241c` |
| `--pm-ink-2` | `#4b4337` | `#40564a` |
| `--pm-ink-3` | `#746a5b` | `#627566` |
| `--pm-line` | `#e9e3d8` | `#dfe6dc` |
| `--pm-line-strong` | `#d8cfbe` | `#b8c7b8` |
| `--pm-accent` | `#a94f2a` | `#1f5136` |
| `--pm-accent-soft` | `#f7eae3` | `#e3ede2` |
| `--pm-accent-hover` | `#964421` | `#163f28` |
| `--pm-on-accent` | `#ffffff` | `#ffffff` *(unchanged)* |
| `--pm-hero-gold` | `#dcc08a` | `#c3d2b3` |
| `--pm-hero-ink` | `#f5efe4` | `#f6f7f1` |
| `--pm-sage` | `#4f6b5d` | `#54705c` |
| `--pm-sage-soft` | `#e8f0ea` | `#e7eee5` |
| `--pm-brass` | `#a88342` | `#5b684c` |
| `--pm-brass-soft` | `#f5eedf` | `#eef0e6` |
| `--pm-danger` | `#b5473d` | `#a33a48` |
| `--pm-danger-soft` | `#f7e9e7` | `#f6e8ea` |
| `--pm-shadow-1/-2` | `rgba(31,27,21,…)` | `rgba(22,36,28,…)` |
| `--pm-reader-paper` | *(absent)* | `#fbfcf8` *(new in `:root`)* |
| `--pm-control-border` | *(absent)* | `#7b907d` *(new in `:root`)* |

### Dark theme (`[data-theme='dark']`)

| Token | Old | New |
|---|---|---|
| `--pm-bg` | `#15130f` | `#101a14` |
| `--pm-surface` | `#1e1b16` | `#18251d` |
| `--pm-surface-2` | `#27231c` | `#213029` |
| `--pm-surface-3` | `#302b23` | `#2b3d33` |
| `--pm-ink` | `#f5efe4` | `#f2f5ee` |
| `--pm-ink-2` | `#cfc4b2` | `#c3d0c2` |
| `--pm-ink-3` | `#9e9383` | `#95a698` |
| `--pm-line` | `#373127` | `#2e3f35` |
| `--pm-line-strong` | `#7a6e59` | `#62806c` |
| `--pm-accent` | `#e69a6c` | `#9cc7a8` |
| `--pm-accent-soft` | `#3a281f` | `#25382c` |
| `--pm-accent-hover` | `#f0ad83` | `#b3d7bb` |
| `--pm-on-accent` | `#15130f` | `#101a14` |
| `--pm-hero-gold` | `#cbaa72` | `#cbd8b8` |
| `--pm-hero-ink` | `#f5efe4` | `#f2f5ee` |
| `--pm-sage` | `#93b5a3` | `#9dc2a6` |
| `--pm-sage-soft` | `#25332b` | `#24382b` |
| `--pm-brass` | `#d9b46e` | `#a8b58c` |
| `--pm-brass-soft` | `#33291b` | `#2c3525` |
| `--pm-danger` | `#e07b6f` | `#e3838b` |
| `--pm-danger-soft` | `#2e1d1a` | `#3a2328` |
| `--pm-reader-paper` | `#221f18` | `#16231b` |
| `--pm-control-border` | `#4e4638` | `#587261` |
| `--pm-shadow-1/-2` | warm brown / `rgba(255,244,224,…)` inset | green-black / `rgba(242,245,238,…)` inset |

---

## 3. WCAG contrast verification (28 pairs; computed, not estimated)

Ratio = `(Llighter + 0.05) / (Ldarker + 0.05)`, WCAG 2.1 relative luminance.
Thresholds: **AAA ≥ 7:1**, **AA ≥ 4.5:1**, **AA-large / UI ≥ 3:1**.

### Light theme

| # | Pair | Ratio | Result |
|---|---|---|---|
| 1 | `--pm-ink` `#16241c` on `--pm-bg` `#f3f5f0` | **14.68:1** | AAA |
| 2 | `--pm-ink` `#16241c` on `--pm-surface` `#ffffff` | **16.11:1** | AAA |
| 3 | `--pm-ink-2` `#40564a` on `--pm-surface` | **7.93:1** | AAA |
| 4 | `--pm-ink-3` `#627566` on `--pm-surface` | **4.93:1** | AA |
| 5 | `--pm-ink-3` `#627566` on `--pm-bg` | **4.50:1** | AA |
| 6 | `--pm-on-accent` `#ffffff` on `--pm-accent` `#1f5136` (primary button) | **9.18:1** | AAA |
| 7 | `--pm-on-accent` on `--pm-accent-hover` `#163f28` | **11.83:1** | AAA |
| 8 | `--pm-hero-ink` `#f6f7f1` on `--pm-accent` (hero panel) | **8.52:1** | AAA |
| 9 | `--pm-hero-gold` `#c3d2b3` on `--pm-accent` (hero eyebrow) | **5.76:1** | AA |
| 10 | `--pm-accent` as text on `--pm-surface` | **9.18:1** | AAA |
| 11 | `--pm-accent` as text on `--pm-bg` | **8.36:1** | AAA |
| 12 | `--pm-accent` on `--pm-accent-soft` `#e3ede2` (soft chip) | **7.64:1** | AAA |
| 13 | `--pm-sage` `#54705c` on `--pm-sage-soft` `#e7eee5` | **4.61:1** | AA |
| 14 | `--pm-on-accent` `#ffffff` on `--pm-sage` (completed ring glyph) | **5.46:1** | AA |
| 15 | `--pm-hero-ink` `#f6f7f1` on `--pm-sage` (book cover lettering) | **5.06:1** | AA |
| 16 | `--pm-brass` `#5b684c` on `--pm-surface` (folio) | **5.95:1** | AA |
| 17 | `--pm-brass` on `--pm-surface-2` `#e9eee7` (cover) | **5.06:1** | AA |
| 18 | `--pm-brass` on `--pm-surface-3` `#dce5db` | **4.61:1** | AA |
| 19 | `--pm-danger` `#a33a48` on `--pm-surface` | **6.45:1** | AA |
| 20 | `--pm-control-border` `#7b907d` on `--pm-surface` (control outline) | **3.43:1** | UI ✓ |

### Dark theme

| # | Pair | Ratio | Result |
|---|---|---|---|
| 21 | `--pm-ink` `#f2f5ee` on `--pm-bg` `#101a14` | **16.16:1** | AAA |
| 22 | `--pm-ink` on `--pm-surface` `#18251d` | **14.43:1** | AAA |
| 23 | `--pm-ink-2` `#c3d0c2` on `--pm-surface` | **9.93:1** | AAA |
| 24 | `--pm-ink-3` `#95a698` on `--pm-surface` | **6.20:1** | AA |
| 25 | `--pm-on-accent` `#101a14` on `--pm-accent` `#9cc7a8` (button) | **9.45:1** | AAA |
| 26 | `--pm-on-accent` on `--pm-accent-hover` `#b3d7bb` | **11.32:1** | AAA |
| 27 | `--pm-accent` `#9cc7a8` as text on `--pm-surface` | **8.44:1** | AAA |
| 28 | `--pm-hero-ink` on `--pm-surface-3` `#2b3d33` (hero gradient end) | **10.49:1** | AAA |
| 29 | `--pm-ink` on `--pm-reader-paper` `#16231b` | **14.78:1** | AAA |
| 30 | `--pm-sage` `#9dc2a6` on `--pm-sage-soft` `#24382b` | **6.39:1** | AA |
| 31 | `--pm-brass` `#a8b58c` on `--pm-surface` | **7.31:1** | AAA |
| 32 | `--pm-control-border` `#587261` on `--pm-surface` | **3.02:1** | UI ✓ |

**Summary:** 32/32 pairs meet their target. Every text pair is ≥ 4.5:1; the forest primary button is 9.18:1 (light) and 9.45:1 (dark). No critical pair falls below AA.

---

## 4. Why this palette is comfortable and premium (3 sentences)

Deep forest green is the natural colour of library reading rooms, book cloth and shaded lamps, so the accent feels subject-matched and quietly authoritative rather than imported from a generic app template — and by removing every warm hue (terracotta, beige, brass-yellow) the interface stops fighting the eye and lets the reading content lead. The palette stays premium through restraint: one saturated forest accent on a field of green-cast ivory, with sage and muted olive used only as whispers for chips, folios and completed states, producing the calm, bookish feel of a well-kept reading room. It differs from generic SaaS green — bright emerald, neon mint or "growth-dashboard" teal used for charts, success toasts and CTAs everywhere — because this green is dark, low-chroma and editorial: it reads as ink and leather, not as a startup status colour, and it never competes with the Fraunces serif reading surface.

---

## 5. Usage rules

**Accent budget (strict).** `--pm-accent` may colour at most **~5% of pixels**: primary CTA (one per screen), active nav underline, progress fill, reader margin rule, and selected list marker. Never use it for large area fills, page backgrounds, or headings. All other "colour" moments use `--pm-sage`, `--pm-sage-soft`, `--pm-brass` (folio only) or `--pm-accent-soft`. Danger is limited to error states.

**Ivory vs white surfaces.** `--pm-bg` (`#f3f5f0`) is the page canvas; it must carry a faint green cast and **no yellow**. `--pm-surface` (`#ffffff`) is reserved for raised cards, toolbars and the reader paper — the white-on-ivory relationship creates depth without warmth. Use `--pm-surface-2`/`-3` only for nested tiles and book-cover fallbacks; never swap the canvas to pure white or the cards to beige.

**Hero panel.** Deep forest, not a warm gradient: light theme uses `linear-gradient(155deg, color-mix(in srgb, var(--pm-accent) 40%, var(--pm-ink-2)), var(--pm-ink))` — this resolves to a forest-to-forest-ink field; dark theme uses `linear-gradient(155deg, var(--pm-surface-3), var(--pm-on-accent))` with `--pm-hero-ink` type. Eyebrow and italic emphasis use `--pm-hero-gold` (`#c3d2b3` / `#cbd8b8`), which is pale sage — never yellow-gold. No warm inset highlight; the dark inset uses cool ivory at 6–8% alpha.

**Reader paper.** Light reader uses `--pm-surface` (`#ffffff`) or, where a paper tone is desired, `--pm-reader-paper` `#fbfcf8` — a near-white ivory with no cream/yellow cast; dark reader uses `--pm-reader-paper` `#16231b`, kept distinct from `--pm-surface`. Body text is `--pm-ink` in Fraunces; the 2px signature margin rule is `--pm-accent` (forest), folio numbers are `--pm-brass` (olive), and the rule is decorative only (no pointer events).

**Chips & modal.** Neutral/meta chips use `--pm-sage-soft` background with `--pm-sage` text; "ready/active" chips use `--pm-accent-soft` with `--pm-accent` text; no peach, terracotta or gold chips. Modals/dialogs sit on `--pm-surface` with `--pm-shadow-2` and a `--pm-line` border, a `--pm-accent` primary action, and `--pm-control-border` outlines on inputs. Focus is always `--pm-shadow-focus` (accent-soft ring). Hover states darken with `--pm-accent-hover` / `--pm-ink-2`; no colour spins or hue shifts.

---

## 6. What the user will see

**Dashboard.** The whole app is now a soft, slightly green-tinted ivory instead of the old beige-cream. Cards are clean white on that ivory canvas; the active nav underline, streak chip, quick-action icons, progress bar and "Boshlash" accents are deep forest green rather than terracotta orange, and completed check rings are sage with white glyphs. Stat numbers (`1`, `0`, `0%`) are deep forest-ink and read as calm editorial type; the only saturated colour on the screen is the forest CTA. The overall impression is a quiet study carrel — organised, bookish, and free of the warm orange that was bothering the user.

**Book / reader screen.** The "O'qishni boshlash" button is now deep forest green with white text, and the quiz button is an outlined forest control; the book cover is sage/forest green with ivory lettering and a muted olive folio mark instead of a brass-gold one. Chapter labels, the active chapter marker and the reader margin rule are forest/olive instead of orange-brown; the status chips ("Tahlil tayyor", "MD", "4 bob") are pale sage with deep sage text. The reading paper itself is clean white (dark mode: green-black) with deep forest-ink serif text, so the page reads like a well-printed book page and the green accents frame the reading rather than decorating it.

---

### Palette hex list (quick reference)

**Light:** bg `#f3f5f0` · surface `#ffffff` · surface-2 `#e9eee7` · surface-3 `#dce5db` · reader-paper `#fbfcf8` · ink `#16241c` · ink-2 `#40564a` · ink-3 `#627566` · line `#dfe6dc` · line-strong `#b8c7b8` · control-border `#7b907d` · accent `#1f5136` · accent-soft `#e3ede2` · accent-hover `#163f28` · on-accent `#ffffff` · hero-ink `#f6f7f1` · hero-gold `#c3d2b3` · sage `#54705c` · sage-soft `#e7eee5` · brass `#5b684c` · brass-soft `#eef0e6` · danger `#a33a48` · danger-soft `#f6e8ea`.

**Dark:** bg `#101a14` · surface `#18251d` · surface-2 `#213029` · surface-3 `#2b3d33` · reader-paper `#16231b` · ink `#f2f5ee` · ink-2 `#c3d0c2` · ink-3 `#95a698` · line `#2e3f35` · line-strong `#62806c` · control-border `#587261` · accent `#9cc7a8` · accent-soft `#25382c` · accent-hover `#b3d7bb` · on-accent `#101a14` · hero-ink `#f2f5ee` · hero-gold `#cbd8b8` · sage `#9dc2a6` · sage-soft `#24382b` · brass `#a8b58c` · brass-soft `#2c3525` · danger `#e3838b` · danger-soft `#3a2328`.

**Contrast summary:** 32/32 critical pairs pass — primary forest button 9.18:1 light / 9.45:1 dark, body text 14.68:1 light / 16.16:1 dark, worst text pair 4.50:1 (light meta on canvas), both control outlines ≥ 3:1.
