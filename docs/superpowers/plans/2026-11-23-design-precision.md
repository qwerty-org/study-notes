# Study Notes — Design Precision Pass (Wave 2, conflict-free)

**Goal:** Take the already-strong visual identity to meticulous professional quality — every spacing, size, radius, control height and proportion intentional and consistent.

**Context:** Wave 1 (50 agents) brought accessibility, robustness and documentation to professional level and passed `npm run build`. Headless-Chrome screenshots of all 6 routes were captured at 1440×900 (`C:\Users\qwerty\AppData\Local\Temp\opencode\shots\before-*.png`) and reviewed.

**Visual findings that drive this pass:**
- Dashboard: `.grid-fit` cards stretch to equal height (`align-items: stretch` default) leaving ~250–500px of empty white space under short content; stat sub-cards are disproportionately tall with tiny values; hero card is airy but acceptable.
- Onboarding: programmatically focused `<h2 tabIndex={-1}>` shows a visible terracotta focus ring (from global `:focus-visible`) — must be suppressed for script-focused headings only.
- Book reader toolbar A−/Aa/A+ and icon buttons are ~28px — below a comfortable 36–40px target.
- Settings: name input is ~500px wide inside a ~1080px panel; avatar choices ~48px with tiny emoji.
- Stats/Repeat: profile and session cards ~140px/430px tall with content concentrated on one side; acceptable but can be tightened.
- Inconsistent control heights, card paddings and section gaps across legacy (`global.css`) and `nx-` layers.

## Design Precision Standard (shared by every agent)

- **Spacing grid (4px):** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64. No arbitrary 7/13/18/23px gaps.
- **Type scale:** 11 · 12 · 13 · 14 · 16 · 18 · 20 · 24 · 30 · 36px; display via Fraunces `clamp()` already present. Body ≥13px, hints ≥11px, line-height 1.5–1.7.
- **Control heights:** sm 32 · md 40 · lg 48px; icon buttons ≥36px (40 on touch); inputs 40–44px.
- **Radii:** sm 8 · md 12 · lg 18–20 · pill 999px. One radius per hierarchy level.
- **Icons:** 14 · 16 · 18 · 20 · 24px; stroke 1.8; gap to label 8px.
- **Cards:** padding 20–24px desktop, 16px ≤620px; section gaps 16–24px; page padding already set.
- **Proportion:** short cards must NOT stretch to the tallest neighbour — use `align-items: start` / `align-self: start` where appropriate. Fill intentional space, never leave dead white areas.
- **Reading:** reader measure 66ch (already), body copy ≤80ch.
- **Optical:** align baselines, icon-to-text 8px, chip padding 4px 10px, consistent divider placement.

## Hard constraints

1. Exclusive file ownership — write ONLY to your scope; read anything. No conflicts by construction.
2. Do NOT remove or weaken any ARIA attribute, focus-visible rule, keyboard handler, reduced-motion rule, or accessible name added in Wave 1. This pass is sizing/spacing/proportion only.
3. Do NOT change colors/identity tokens, exported names, prop signatures, route paths, CSS class names used by other files, or JSON keys.
4. No new dependencies, no `npm install`.
5. Use existing tokens; add a new token only in the owner of `theme.css` / `foundation.css`, and report it.
6. Return: Findings / Changes / Risks / Verification.

## Assignment matrix

| ID | Exclusive write scope | Focus |
|----|-----------------------|-------|
| B01 | `styles/theme.css` | Shared token scale (spacing/type/radius/control heights); suppress focus ring on `h1/h2[tabindex='-1']` and `main[tabindex='-1']` script-focus; keep AA contrast |
| B02 | `styles/nx/foundation.css` | All `nx-` primitives to the precision standard: control heights, paddings, gaps, radii, icon sizes, toast/modal proportions |
| B03 | `styles/global.css` | Legacy rhythm: `.grid-fit { align-items:start }`, hero/card/stats proportions, topbar/nav sizing, 4px spacing cleanup, 375px safety |
| B04 | `components/ErrorBoundary.tsx` | Error-state visual proportions, centered composition, token-based sizing |
| B05 | `components/nx/icons.tsx` | Icon size/stroke scale consistency, optical alignment |
| B06 | `components/icons.tsx` | Same as B05 for legacy set |
| B07 | `pages/Dashboard.tsx` | Inline sizing/proportions only (CSS needs → report to B03) |
| B08 | `pages/Onboarding.tsx` + `styles/nx/onboarding.css` | Card proportions, step indicator sizing, input/button rhythm, responsive 375px |
| B09 | `pages/Library.tsx` + `styles/nx/library.css` | Stat cards, dropzone proportions, book cover padding, grid gaps |
| B10 | `pages/Book.tsx` + `styles/nx/book.css` | Reader toolbar control sizes (A−/Aa/A+ ≥36px), sidebar/progress proportions, reading rhythm |
| B11 | `pages/Repeat.tsx` + `styles/nx/repeat.css` | Session card proportions, ring/caption sizing, interval viz scale |
| B12 | `pages/Stats.tsx` + `styles/nx/stats.css` | Profile hero height, stat card proportions, chart bar widths/gaps |
| B13 | `pages/Settings.tsx` + `styles/nx/settings.css` | Input width/panel rhythm, avatar choice sizing, row heights, section spacing |
| B14 | `components/nx/BookTabs.tsx` | TOC/marginalia/quote-bar sizing, toolbar control targets, marker optical alignment |
| B15 | `components/BookTabs.tsx` | Same precision pass on legacy content components |
| B16 | `components/nx/QuizRunner.tsx` + `styles/nx/quiz.css` | Option row heights, progress/proportion, result screen spacing |
| B17 | `components/QuizRunner.tsx` | Same pass on legacy runner |
| B18 | `components/nx/NxUI.tsx` | Primitive default sizes (Ring, Bar, Empty, Stat, ConfirmModal, toast) |
| B19 | `components/ui.tsx` | Same pass on legacy primitives |
| B20 | `components/Layout.tsx` | Topbar item sizing/alignment, badge/avatar dimensions, popup proportions |

**Auditors (read-only, no file writes):**
| ID | Scope | Output |
|----|-------|--------|
| B21 | Screenshots: onboarding + dashboard + library | Concrete sizing/proportion defects with file/selector hints |
| B22 | Screenshots: book + repeat | Same |
| B23 | Screenshots: stats + settings | Same |

**Verification (coordinator):** rebuild, re-capture screenshots with `node shot.cjs after`, compare before/after, re-run CSS token sweep.
