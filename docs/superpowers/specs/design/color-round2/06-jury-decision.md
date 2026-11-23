# Jury Decision — Colour Round 2 (J01, COLOUR JURY)

**WINNER: Direction 03 — MONO / INDIGO.** Decisive, no variants, no hedging.

Reviewed: all five specs (01–05) and the three rejected screenshots (`premium2-dashboard.png`, `premium2-book.png`, `study-notes-premium-onb.png`). The user's complaint is reproduced verbatim in substance: warm rust/beige is *uncomfortable* — the dashboard's beige cards and peach chips, the book's terracotta rule and brass folios, and above all the onboarding's heavy brown panel with gold italic. Every criterion below is scored against that complaint.

---

## 1. Scoring table

Weighted in order (1 = weakest, 5 = strongest). Weights are applied by ordering, not by multiplication; ties on later criteria are broken by the earlier criterion.

| Rank | Candidate | 1. Comfort | 2. Premium character | 3. Contrast / a11y | 4. Book coherence | 5. Implementability | **Total** |
|---:|---|---:|---:|---:|---:|---:|---:|
| **1** | **03 — Mono / Indigo** | **5** — zero warm hues anywhere; cool grey ramp `#F7F8FA → #E6E9EF → #C7CDD9 → #171A21`, paper `#FBFCFE`, one indigo | **5** — near-monochrome + one deep indigo is the most editorial/scholarly option; no second or third hue survives; explicitly "quietly typeset editorial dashboard" | **5** — 32/32 pairs AA, 17 AAA; min text 4.65:1; white on indigo **10.00:1**; dark on-accent 6.87:1; no sub-4.5 text pair | **5** — neutral near-white paper, grey Fraunces folios, zero sepia/cream, cool charcoal dark paper | **5** — 27-colour-token light+dark table, 36-row old→new map, copy-ready hex list, hero/reader/chips/modal recipes, single-file change note | **25** |
| 2 | 02 — Cool Alabaster + Deep Teal | 5 — cool alabaster canvas, deep-teal hero tokens kill the brown panel outright; brass retired | 4 — disciplined single accent, but teal risks reading as app-status/SaaS and sea-glass sage persists as a second green | 5 — 37/37 pairs AA, 22 AAA (largest verified set); min text 4.73:1; 3.22–3.36:1 UI borders are non-text | 5 — cool paper, teal marginalia, calm focus | 5 — copy-paste CSS block, full map, hero-bg/hero-bg-2, chips/reader/modal recipes | **24** |
| 3 | 01 — Refined Warm Stone | 2 — **fails the complaint**: bg `#F5F3F0`, surface-2 `#ECE9E3`, brass `#998563`, chalk-gold `#DCCDB0` are still warm stone/beige; it refines the rejected palette instead of replacing it | 4 — stone + teal is considered, but brass and gold remain competing warm notes | 5 — 26/26 pairs, min 4.58:1, white-on-teal 6.86:1 | 4 — paper-like, but warm brass folios and gold hero italic survive | 5 — complete tables, 2 maps, hero/reader/chips recipes | **20** |
| 4 | 04 — Library Green | 3 — "green-cast ivory" `#f3f5f0` is still a warm paper concept, and sage + olive + forest are three warm-leaning greens | 3 — forest is bookish, but three green hues plus crimson violates "single disciplined accent" and drifts toward generic eco/SaaS green | 4 — 32/32 pass but the worst text pair sits exactly at 4.50:1 with no margin; dark control border 3.02:1 | 4 — strong bookcloth metaphor, but green folios instead of neutral | 5 — complete light+dark tables, full map, hero/reader/chips recipes | **19** |
| 5 | 05 — Slate & Burgundy | 2 — cool slate surfaces are good, but the accent `#6e2639` is a warm red-family wine: warmth is merely relocated to the accent the user must look at most | 4 — burgundy reads as bookcloth and red marginalia; premium, but "wine" is less scholarly than ink | 4 — 27/27 AA, 18 AAA, but min text 4.55:1 and accent-on-surface only 4.53:1 dark; a 3.90:1 non-text pair needs a usage rule | 4 — red-ink marginalia is apt; folios correctly neutral | 4 — full tokens and map, but the light hero recipe changes component structure (pale panel + left rule), not a pure token swap | **18** |

---

## 2. WINNER — decisive justification

The user rejected the current theme because warm rust and beige made the interface feel uncomfortable: beige quick-action cards, peach chips, a terracotta reader rule and brass folios, and a heavy brown onboarding panel lit by gold italic type. **Mono / Indigo is the only proposal that removes warmth from every large surface *and* from the accent itself** — canvas `#F7F8FA`, tiles `#F0F2F6`, paper `#FBFCFE`, and a single deep indigo `#2E3A8C` that replaces rust, sage and brass at once, so the eye has no residual yellow or red to keep re-correcting. It beats K01, K04 and K05 outright because those keep warm stone, green-ivory or wine somewhere in the system, and it beats K02 on premium character because ink-indigo reads as bookcloth and typeset scholarship rather than app-status teal. Calm is not bought at the cost of legibility: 32/32 pairs pass AA with white-on-indigo at 10.00:1 and body text at 16.38:1. It is also the cleanest implementation — complete light+dark tokens, an explicit 36-row old→new map, and binding hero, reader, chip and modal recipes delivered as a single-file change.

---

## 3. Complete final token set — copy verbatim into `00-tokens.css`

Source: `03-mono-indigo.md` §1.1 and §1.2. Values are reproduced exactly. Non-colour tokens (`--pm-r-*`, `--pm-s-*`, `--pm-fs-*`, `--pm-d-*`, `--pm-ease-*`, `--pm-font*`) are unchanged.

```css
:root {
  --pm-bg: #F7F8FA;
  --pm-surface: #FFFFFF;
  --pm-surface-2: #F0F2F6;
  --pm-surface-3: #E6E9EF;
  --pm-ink: #171A21;
  --pm-ink-2: #4A505E;
  --pm-ink-3: #646D7E;
  --pm-line: #E2E6ED;
  --pm-line-strong: #C7CDD9;
  --pm-accent: #2E3A8C;
  --pm-accent-soft: #EAECF7;
  --pm-accent-hover: #232E73;
  --pm-on-accent: #FFFFFF;
  --pm-hero-gold: #B9C4F0;
  --pm-hero-ink: #F7F8FA;
  --pm-sage: #2E3A8C;
  --pm-sage-soft: #EAECF7;
  --pm-brass: #646D7E;
  --pm-brass-soft: #F0F2F6;
  --pm-danger: #B14856;
  --pm-danger-soft: #F9EDF0;
  --pm-reader-paper: #FBFCFE;
  --pm-control-border: #C7CDD9;
  --pm-transparent: transparent;
  --pm-shadow-1: 0 1px 2px rgba(23,26,33,.05), 0 8px 24px rgba(23,26,33,.06);
  --pm-shadow-2: 0 2px 8px rgba(23,26,33,.06), 0 24px 60px rgba(23,26,33,.08);
  --pm-shadow-focus: 0 0 0 3px var(--pm-accent-soft);
}

[data-theme='dark'] {
  --pm-bg: #101218;
  --pm-surface: #171A22;
  --pm-surface-2: #1E222D;
  --pm-surface-3: #272C39;
  --pm-ink: #EFF1F6;
  --pm-ink-2: #B7BECD;
  --pm-ink-3: #8B93A5;
  --pm-line: #2B3140;
  --pm-line-strong: #495165;
  --pm-accent: #8C97E8;
  --pm-accent-soft: #232A48;
  --pm-accent-hover: #A0AAF0;
  --pm-on-accent: #101218;
  --pm-hero-gold: #C3CBF5;
  --pm-hero-ink: #EFF1F6;
  --pm-sage: #8C97E8;
  --pm-sage-soft: #232A48;
  --pm-brass: #8B93A5;
  --pm-brass-soft: #1E222D;
  --pm-danger: #E88894;
  --pm-danger-soft: #3A2029;
  --pm-reader-paper: #191C25;
  --pm-control-border: #495165;
  --pm-transparent: transparent;
  --pm-shadow-1: inset 0 1px 0 rgba(230,236,255,.06), 0 10px 28px rgba(0,0,0,.45);
  --pm-shadow-2: inset 0 1px 0 rgba(230,236,255,.08), 0 28px 64px rgba(0,0,0,.55);
  --pm-shadow-focus: 0 0 0 3px var(--pm-accent-soft);
}
```

---

## 4. Explicit old → new mapping (all changed tokens)

"Unchanged" entries are listed for completeness so the coordinator can verify nothing was missed. Light values from `00-tokens.css` `:root`, dark from `[data-theme='dark']`.

| Token | Old light → new light | Old dark → new dark | Note |
|---|---|---|---|
| `--pm-bg` | `#faf8f4` → `#F7F8FA` | `#15130f` → `#101218` | cream → cool slate |
| `--pm-surface` | `#ffffff` → `#FFFFFF` | `#1e1b16` → `#171A22` | light unchanged; dark cooled |
| `--pm-surface-2` | `#f4f0e8` → `#F0F2F6` | `#27231c` → `#1E222D` | beige → cool grey |
| `--pm-surface-3` | `#ede7dc` → `#E6E9EF` | `#302b23` → `#272C39` | beige → cool grey |
| `--pm-ink` | `#1f1b15` → `#171A21` | `#f5efe4` → `#EFF1F6` | warm → cool near-black/white |
| `--pm-ink-2` | `#4b4337` → `#4A505E` | `#cfc4b2` → `#B7BECD` | warm → cool grey |
| `--pm-ink-3` | `#746a5b` → `#646D7E` | `#9e9383` → `#8B93A5` | darkened/lightened for AA |
| `--pm-line` | `#e9e3d8` → `#E2E6ED` | `#373127` → `#2B3140` | warm → cool hairline |
| `--pm-line-strong` | `#d8cfbe` → `#C7CDD9` | `#7a6e59` → `#495165` | warm → cool strong rule |
| `--pm-accent` | `#a94f2a` → `#2E3A8C` | `#e69a6c` → `#8C97E8` | **rust → deep indigo** (single accent) |
| `--pm-accent-soft` | `#f7eae3` → `#EAECF7` | `#3a281f` → `#232A48` | peach → periwinkle wash |
| `--pm-accent-hover` | `#964421` → `#232E73` | `#f0ad83` → `#A0AAF0` | rust → deeper indigo |
| `--pm-on-accent` | `#ffffff` → `#FFFFFF` | `#15130f` → `#101218` | light unchanged (now 10.00:1); dark cooled |
| `--pm-hero-gold` | `#dcc08a` → `#B9C4F0` | `#cbaa72` → `#C3CBF5` | gold → pale indigo highlight; name retained |
| `--pm-hero-ink` | `#f5efe4` → `#F7F8FA` | `#f5efe4` → `#EFF1F6` | warm white → cool white |
| `--pm-sage` | `#4f6b5d` → `#2E3A8C` | `#93b5a3` → `#8C97E8` | **retired → alias of accent**; nothing turns green |
| `--pm-sage-soft` | `#e8f0ea` → `#EAECF7` | `#25332b` → `#232A48` | retired → alias of accent-soft |
| `--pm-brass` | `#a88342` → `#646D7E` | `#d9b46e` → `#8B93A5` | **retired → alias of ink-3**; folios become neutral |
| `--pm-brass-soft` | `#f5eedf` → `#F0F2F6` | `#33291b` → `#1E222D` | retired → alias of surface-2 |
| `--pm-danger` | `#b5473d` → `#B14856` | `#e07b6f` → `#E88894` | muted cool rose; semantic exception |
| `--pm-danger-soft` | `#f7e9e7` → `#F9EDF0` | `#2e1d1a` → `#3A2029` | cool wash |
| `--pm-reader-paper` | *unset* → `#FBFCFE` | `#221f18` → `#191C25` | **add the missing `:root` definition**; dark warm paper → cool |
| `--pm-control-border` | *unset* → `#C7CDD9` | `#4e4638` → `#495165` | **add the missing `:root` definition** |
| `--pm-transparent` | `transparent` → `transparent` | unchanged | unchanged |
| `--pm-shadow-1` | warm `rgba(31,27,21,…)` → `rgba(23,26,33,…)` | warm inset `rgba(255,244,224,…)` → `rgba(230,236,255,…)` + black lift | cool-tinted |
| `--pm-shadow-2` | warm `rgba(31,27,21,…)` → `rgba(23,26,33,…)` | warm inset → `rgba(230,236,255,…)` + black lift | cool-tinted |
| `--pm-shadow-focus` | unchanged reference | unchanged reference | now indigo ring |

Semantic move in one line: **every cream/beige/terracotta/sage/brass value collapses onto the cool-grey ramp; only indigo keeps saturation; sage and brass survive as deprecated aliases so no component reference breaks.**

---

## 5. Migration note — files needing manual adjustment beyond the token swap

The token swap handles most rules automatically because component CSS references `var(--pm-*)`. These are the exceptions, ordered by risk:

1. **`apps/desktop/src/pages/Book.tsx` and `apps/desktop/src/pages/Library.tsx` — hardcoded warm cover gradients (HIGHEST RISK).** Palette arrays at `Book.tsx:41–42` and `Library.tsx:30–35` include `['#8d3f24', '#d98a4e']` (rust/orange) and `['#7a5220', '#c9a25e']` (gold), injected as inline `linear-gradient(150deg, ${c1}, ${c2})` at `Book.tsx:203` and `Library.tsx:344`. These are *inline styles*, so the token swap cannot touch them: the user will still see orange and gold book covers. Replace those two pairs with cool entries (e.g. indigo-neutral and slate) or explicitly accept them as artwork — but do not leave them unexamined.
2. **`31-onboarding.css` — hero aside gradient and gold emphasis (the exact panel the user disliked).** `.nx-onboarding__aside` / `.nx-onboarding-aside` at lines 50–54 use `color-mix(in srgb, var(--pm-accent) 40%, var(--pm-ink-2))` → the computed mid stop changes from rust-brown to `#3F4770`, end `#171A21`. Verify `--pm-hero-gold` (`#B9C4F0`) on that mid stop (spec: 5.21:1) for `.nx-onboarding-quote .nx-eyebrow` (lines 62–65) and `.nx-onboarding-quote h1 em` (83–85). Dark hero (lines 56–59) resolves to `#272C39 → #101218`. Delete or rewrite the stale "Deep warm tokens are used instead" comment at lines 46–49.
3. **Completion/folio semantic retints — check glyph legibility and stale comments.** `--pm-sage` is now indigo: `13-dashboard-loop.css:166–167` (`.nx-loop-check` completed ring, white glyph on indigo) and `27-quiz.css` correct markers turn indigo; confirm the white glyph still reads and that meaning is not colour-only. `--pm-brass` is now ink-3: `20-library-books.css:118` carries a `/* small brass accent */` comment that is now false, and folio numerals in `24-book-reader.css` / `26-book-cards.css` become grey Fraunces — remove the brass language in comments/labels.
4. **`08-buttons.css:88` and `12-dashboard-hero.css:19` — `color-mix` and surface gradients.** The ghost-button wash `color-mix(in srgb, var(--pm-accent) 12%, var(--pm-accent-soft))` re-resolves automatically but should be eyeballed; the greeting banner `linear-gradient(135deg, var(--pm-surface), var(--pm-surface-2))` becomes `#FFFFFF → #F0F2F6`, which is the intended cool card treatment and no longer needs a warm wash.
5. **`00-tokens.css` — add the two missing light definitions.** `--pm-reader-paper` and `--pm-control-border` exist only in the dark block today; add them to `:root` exactly as given in §3, otherwise light reader/input rules keep falling back to warm-ish surfaces.
6. **`21-book-hero.css:87` — cover artwork is intentionally excluded.** Its inline gradient is content, not UI; after the TSX change in item 1 it should match the new cool palette, otherwise it will be the last warm artefact on the book screen.

Binding usage rules carried over from the winning spec: accent ≤5% of visible pixels; at most one filled indigo button per view; sage/brass are deprecated aliases never to be authored anew; hero is the only large indigo-adjacent surface; reader paper has no sepia or cream; chips default to `--pm-surface-2` + `--pm-ink-2`, only the genuinely active chip uses `--pm-accent-soft` + `--pm-accent`.

---

## 6. Runners-up — why they lost, one line each

- **02 — Cool Alabaster + Deep Teal:** Excelled on comfort, contrast and coverage, but teal reads as app-status colour and the retained sea-glass sage is a second hue; loses the decisive premium-character criterion 5→4.
- **01 — Refined Warm Stone:** Still warm limestone, brass and chalk-gold — it refines exactly the palette the user called uncomfortable, so it cannot win regardless of its perfect 26/26 contrast record.
- **04 — Library Green:** Green-cast ivory plus forest, sage and olive is three warm-leaning greens and one accent too many; worst text pair has zero margin at 4.50:1.
- **05 — Slate & Burgundy:** Cool slate surfaces are right, but relocating warmth into a red-family wine accent keeps the user's discomfort in the most-viewed element, and its dark accent-on-surface margin is only 4.53:1.
