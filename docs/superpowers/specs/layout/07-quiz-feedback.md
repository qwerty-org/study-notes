# L07 — Quiz Session / Feedback — Layout Decisions

> Role: LAYOUT DECISION ARCHITECT. This doc **decides** geometry only. It does not implement CSS.
> Authoritative sources read: `docs/superpowers/specs/2026-11-23-premium-design-system.md`,
> `apps/desktop/src/components/nx/QuizRunner.tsx`, `apps/desktop/src/styles/nx/quiz.css`,
> `apps/desktop/src/components/nx/NxUI.tsx` (`ConfirmModal`, `useToast`, `Ring`, `Bar`),
> plus `premium/00-tokens.css`, `premium/02-topbar.css`, `nx/foundation.css` for token/page widths.
> No quiz screenshot exists — all values are reasoned from the TSX DOM and current CSS.
> Write scope: **this file only.** No TSX edits, no CSS file edits, no installs.

---

## 0. Token map used throughout (single source = `premium/00-tokens.css`)

| Decision value | Token | Grid step |
|---|---|---|
| 8px | `--pm-s-1` | 1 |
| 12px | `--pm-s-2` | 1.5 (spec explicitly allows) |
| 16px | `--pm-s-3` | 2 |
| 24px | `--pm-s-4` | 3 |
| 32px | `--pm-s-5` | 4 |
| 48px | `--pm-s-6` | 6 |
| 64px | `--pm-s-7` | 8 |
| 80px | `--pm-s-8` | 10 |
| 56px | `calc(var(--pm-s-7))` = 7 steps | 7 |
| 104px | `calc(var(--pm-s-1) * 13)` | 13 |

Type: `--pm-fs-12/13/14/16/18/20/24/30/40`. Surfaces: `--pm-bg`, `--pm-surface`,
`--pm-surface-2`. Ink: `--pm-ink`, `--pm-ink-2`, `--pm-ink-3`. Lines: `--pm-line`,
`--pm-line-strong`. Accent: `--pm-accent`, `--pm-accent-soft`. Success: `--pm-sage`,
`--pm-sage-soft`. Radius: `--pm-r-sm` 10 / `--pm-r` 16 / `--pm-r-lg` 24 / `--pm-r-pill` 999.
Shadow: `--pm-shadow-1`, `--pm-shadow-2`.

**Grid discipline decision:** the legacy quiz CSS uses `20px` and `6px` and `4px` gaps and `11px`
type. Those are off-grid / below the ≥12px auxiliary minimum. I map them to the nearest legal
token: `20px → 16px (--pm-s-3)`, `6px → 8px (--pm-s-1)`, `4px → 8px (--pm-s-1)`,
`11px → 12px (--pm-fs-12)`. No new tokens requested except one noted in Risks (D6).

---

## D1 — Fullscreen frame & content stage

**One decision:** the quiz is a single centered column. No side panels, no second column, no
upcoming-question preview. Reuse `.nx-page--narrow` (880px, from `foundation.css`) as the outer
page; inside it the quiz **stage** is capped at **720px** and centered. Vertical space is
`calc(100vh - var(--topbar-h))` (existing rule) — the app topbar stays, but is the only chrome
outside the stage.

| Viewport | Outer page | Stage width | Inline gutter | Top padding | Bottom padding |
|---|---|---|---|---|---|
| 1440 | 880px, centered | 720px | auto | `--pm-s-5` 32 | `--pm-s-8` 80 |
| 900 | 880px, centered | 720px | auto | `--pm-s-5` 32 | `--pm-s-8` 80 |
| 620 | 100% | 100% (588px) | `--pm-s-3` 16 | `--pm-s-4` 24 | `--pm-s-6` 48 |
| 375 | 100% | 100% (343px) | `--pm-s-3` 16 | `--pm-s-4` 24 | `--pm-s-6` 48 |

```
1440 / 900                    620 / 375
┌────── app topbar ───────┐   ┌── app topbar ──┐
│      ┌──────────┐       │   │ ┌────────────┐ │
│      │  STAGE   │ 720   │   │ │   STAGE    │ │ 100%-32
│      │  880 pg  │       │   │ │  gut 16    │ │
│      └──────────┘       │   │ └────────────┘ │
└─────────────────────────┘   └────────────────┘
```

Paste-ready CSS (premium layer, selectors unchanged):

```css
.nx-quiz-session,
.nx-quiz-result {
  box-sizing: border-box;
  min-height: calc(100vh - var(--topbar-h));
  padding-inline: clamp(var(--pm-s-3), 3vw, var(--pm-s-5));
  padding-block: var(--pm-s-5) var(--pm-s-8);
}

.nx-quiz-session > .nx-session-top,
.nx-quiz-session > .nx-quiz-progress,
.nx-quiz-session > .nx-question-card,
.nx-quiz-session > .nx-quiz-help {
  max-width: 720px;
  margin-inline: auto;
}

@media (max-width: 620px) {
  .nx-quiz-session,
  .nx-quiz-result {
    padding-inline: var(--pm-s-3);
    padding-block: var(--pm-s-4) var(--pm-s-6);
  }
  .nx-quiz-session > .nx-session-top,
  .nx-quiz-session > .nx-quiz-progress,
  .nx-quiz-session > .nx-question-card,
  .nx-quiz-session > .nx-quiz-help {
    max-width: none;
  }
}
```

---

## D2 — Header geometry (progress, count, close)

**One decision:** a single 48px-tall header row — close ghost on the left, count on the right —
followed by an 8px pill progress track with 16px above and 24px below. No title in the header,
no back-arrow duplication.

| Element | 1440 | 900 | 620 | 375 | Token |
|---|---|---|---|---|---|
| Row height | 48 | 48 | 48 | 48 | `--pm-s-6` |
| Row margin-bottom | 16 | 16 | 16 | 16 | `--pm-s-3` |
| Close hit area | 44 | 44 | 44 | 44 | secondary button recipe |
| Close icon / gap | 16 / 8 | 16 / 8 | 16 / 8 | 16 / 8 | `--pm-fs-16`, `--pm-s-1` |
| Close font | 14/600 | 14/600 | 14/600 | 14/600 | `--pm-fs-14` |
| Count "01" | 24/600 | 24/600 | 20/600 | 20/600 | `--pm-fs-24` → `--pm-fs-20` |
| Count "/ 08" | 13 | 13 | 13 | 13 | `--pm-fs-13`, `--pm-ink-3` |
| Progress track | 8 | 8 | 8 | 8 | `--pm-s-1`, pill |
| Progress margin-bottom | 24 | 24 | 24 | 24 | `--pm-s-4` |

```
┌───────────────────────────────────────────────┐
│ ✕ Chiqish                          01 / 08   │  48px
├───────────────────────────────────────────────┤  16px
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   8px pill
└───────────────────────────────────────────────┘  24px
```

Paste-ready CSS:

```css
.nx-quiz-session .nx-session-top {
  min-height: var(--pm-s-6);
  margin-bottom: var(--pm-s-3);
  gap: var(--pm-s-3);
}
.nx-quiz-session .nx-back {
  min-height: 44px;
  gap: var(--pm-s-1);
  padding: 0 var(--pm-s-2);
  color: var(--pm-ink-2);
  font: 600 var(--pm-fs-14) / 1 var(--pm-font);
  background: none;
  border: 0;
  transition: color 0.16s ease;
}
.nx-quiz-session .nx-back:hover { gap: var(--pm-s-2); color: var(--pm-ink); }
.nx-session-count {
  font: 600 var(--pm-fs-24) / 1 var(--pm-font-display);
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
  color: var(--pm-accent);
}
.nx-session-count span {
  font: 650 var(--pm-fs-13) / 1 var(--pm-font);
  color: var(--pm-ink-3);
  letter-spacing: 0;
}
.nx-session-bar,
.nx-quiz-session .nx-progress {
  height: var(--pm-s-1);
  border-radius: var(--pm-r-pill);
  background: var(--pm-surface-2);
  margin-bottom: var(--pm-s-4);
}
@media (max-width: 620px) {
  .nx-session-count { font-size: var(--pm-fs-20); }
}
```

---

## D3 — Question placement, measure & option rows

**One decision:** chip row → question → options, all inside the one 24px card. Question is 24px
Fraunces on a 66ch measure. Options are 56px rows with 32px circular markers, 12px gaps, 12px
horizontal padding.

| Element | 1440 | 900 | 620 | 375 | Token |
|---|---|---|---|---|---|
| Card padding | 24 | 24 | 16 | 16 | `--pm-s-4` → `--pm-s-3` |
| Card radius | 16 | 16 | 16 | 16 | `--pm-r` |
| Chip row mb | 24 | 24 | 24 | 24 | `--pm-s-4` |
| Chip height / font | 28 / 12 | 28 / 12 | 28 / 12 | 28 / 12 | chip recipe |
| Question size | 24 | 24 | 20 | 20 | `--pm-fs-24` → `--pm-fs-20` |
| Question line-height | 1.4 | 1.4 | 1.4 | 1.4 | — |
| Question measure | 66ch | 66ch | 66ch | full | spec §2 |
| Question mb | 24 | 24 | 24 | 24 | `--pm-s-4` |
| Option min-height | 56 | 56 | 56 | 56 (auto-grow) | 7 × 8px |
| Option padding | 12/16 | 12/16 | 12/12 | 12/12 | `--pm-s-2`/`--pm-s-3` |
| Option gap (between rows) | 12 | 12 | 12 | 12 | `--pm-s-2` |
| Marker size | 32 | 32 | 32 | 32 | 4 × 8px, pill |
| Marker font | 14 | 14 | 14 | 14 | `--pm-fs-14` |
| Marker→text gap | 12 | 12 | 12 | 12 | `--pm-s-2` |
| Kbd hint box | 24 / 12 | 24 / 12 | 24 / 12 | 24 / 12 | `--pm-fs-12` |
| State icon | 20 | 20 | 20 | 20 | spec §5 |
| Option radius | 10 | 10 | 10 | 10 | `--pm-r-sm` |

```
┌─ nx-question-card (24px pad, radius 16) ───────────┐
│ [Vaziyatli] [Oson]                    [Kitob]      │ 28px  mb24
│ Savol matni — bir jumla, ikki qatorgacha...       │ 24px Fraunces
│                                                    │ mb24, max 66ch
│ ┌────────────────────────────────────────────────┐ │
│ │ (A)  Variant matni              [1]            │ │ 56px
│ └────────────────────────────────────────────────┘ │ gap12
│ ┌────────────────────────────────────────────────┐ │
│ │ (B)  Variant matni              [2]            │ │ 56px
│ └────────────────────────────────────────────────┘ │ gap12
│ ┌────────────────────────────────────────────────┐ │
│ │ (C)  Variant matni              [3]            │ │ 56px
│ └────────────────────────────────────────────────┘ │ gap12
│ ┌────────────────────────────────────────────────┐ │
│ │ (D)  Variant matni              [4]            │ │ 56px
│ └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

Paste-ready CSS:

```css
.nx-question-card {
  padding: var(--pm-s-4);
  border-radius: var(--pm-r);
  background: var(--pm-surface);
  box-shadow: var(--pm-shadow-1);
}
.nx-question-card .nx-row { margin-bottom: var(--pm-s-4); }
.nx-question-text {
  font: 500 var(--pm-fs-24) / 1.4 var(--pm-font-display);
  letter-spacing: -0.035em;
  margin-bottom: var(--pm-s-4);
  max-width: 66ch;
  color: var(--pm-ink);
}
.nx-options { gap: var(--pm-s-2); }
.nx-option {
  display: flex;
  align-items: center;
  gap: var(--pm-s-2);
  width: 100%;
  min-height: 56px;
  padding: var(--pm-s-2) var(--pm-s-3);
  border: 1px solid var(--pm-line);
  border-radius: var(--pm-r-sm);
  background: var(--pm-surface);
  color: var(--pm-ink);
  font: 600 var(--pm-fs-14) / 1.5 var(--pm-font);
  text-align: left;
  transition: background 0.16s ease, border-color 0.16s ease;
}
.nx-option:hover:not(:disabled) {
  background: var(--pm-accent-soft);
  border-color: var(--pm-accent);
}
.nx-option__key {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border-radius: var(--pm-r-pill);
  background: var(--pm-surface-2);
  color: var(--pm-ink-2);
  font: 600 var(--pm-fs-14) var(--pm-font-display);
}
.nx-option.picked .nx-option__key {
  background: var(--pm-accent);
  color: var(--pm-surface);
}
.nx-option.correct { border-color: var(--pm-sage); background: var(--pm-sage-soft); color: var(--pm-sage); }
.nx-option.correct .nx-option__key { background: var(--pm-sage); color: var(--pm-surface); }
.nx-option.wrong { border-color: var(--pm-accent); background: var(--pm-accent-soft); color: var(--pm-accent); }
.nx-option.wrong .nx-option__key { background: var(--pm-accent); color: var(--pm-surface); }
.nx-option.dim { opacity: 0.5; }
.nx-option:focus-visible {
  outline: 2px solid var(--pm-accent);
  outline-offset: 3px;
  border-color: var(--pm-accent);
}
.nx-option .nx-kbd {
  min-width: 24px;
  height: 24px;
  color: var(--pm-ink-3);
  font-size: var(--pm-fs-12);
}
@media (max-width: 620px) {
  .nx-question-card { padding: var(--pm-s-3); }
  .nx-question-text { font-size: var(--pm-fs-20); }
  .nx-option { padding: var(--pm-s-2); }
}
```

---

## D4 — Feedback / reason block & next action

**One decision:** on reveal, the explanation appears directly under the last option inside the
same card (`margin-top: 24px`), as a quiet `--pm-surface-2` panel with a 3px status rail; the
**only** primary button on the whole screen lives at its bottom with 24px separation.

| Element | 1440 | 900 | 620 | 375 | Token |
|---|---|---|---|---|---|
| Feedback margin-top | 24 | 24 | 24 | 24 | `--pm-s-4` |
| Feedback padding | 24 | 24 | 16 | 16 | `--pm-s-4` → `--pm-s-3` |
| Feedback radius | 16 | 16 | 16 | 16 | `--pm-r` |
| Status rail | 3 | 3 | 3 | 3 | sage (ok) / accent (bad) |
| Head icon / gap | 20 / 8 | 20 / 8 | 20 / 8 | 20 / 8 | `--pm-fs-20`, `--pm-s-1` |
| Head font | 16/700 | 16/700 | 16/700 | 16/700 | `--pm-fs-16` |
| Head margin-bottom | 12 | 12 | 12 | 12 | `--pm-s-2` |
| Body font / lh | 14 / 1.6 | 14 / 1.6 | 14 / 1.6 | 14 / 1.6 | `--pm-fs-14` |
| Body measure | 66ch | 66ch | 66ch | full | spec §2 |
| "Sizning javobingiz" mt/pt | 8/8 | 8/8 | 8/8 | 8/8 | `--pm-s-1` |
| Next margin-top | 24 | 24 | 24 | 24 | `--pm-s-4` |
| Next height / pad / radius | 48 / 0 24 / 12 | 48 / 0 24 / 12 | 48 / 0 24 / 12 | 48 / 0 24 / 12 | button recipe |
| Next width | auto | auto | 100% | 100% | — |
| Help footer mt / font | 24 / 12 | 24 / 12 | 24 / 12 | 24 / 12 | `--pm-s-4`, `--pm-fs-12` |

```
 after last option
        │ mt24
        ▼
┌─ nx-explain (surface-2, radius16, pad24) ──────────┐
│▌ ✓ To'g'ri javob                                   │ 16/700, mb12
│  Sabab: ...ikki qatorgacha, 66ch...                │ 14/1.6
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │ mt8 pt8 (wrong only)
│  Sizning javobingiz: ...                           │
│                        [ Keyingi savol  → ]        │ 48px, mt24
└────────────────────────────────────────────────────┘
        │ mt24
   1–4 javob · Enter keyingi · Esc chiqish         12px, ink-3
```

Paste-ready CSS:

```css
.nx-explain {
  margin-top: var(--pm-s-4);
  padding: var(--pm-s-4);
  border: 1px solid var(--pm-line);
  border-left: 3px solid var(--pm-accent);
  border-radius: var(--pm-r);
  background: var(--pm-surface-2);
  box-shadow: none;
}
.nx-explain--ok { border-left-color: var(--pm-sage); }
.nx-explain--bad { border-left-color: var(--pm-accent); }
.nx-explain__head {
  display: flex;
  align-items: center;
  gap: var(--pm-s-1);
  margin-bottom: var(--pm-s-2);
  color: var(--pm-ink);
  font: 700 var(--pm-fs-16) / 1.4 var(--pm-font);
}
.nx-explain--ok .nx-explain__head { color: var(--pm-sage); }
.nx-explain--bad .nx-explain__head { color: var(--pm-accent); }
.nx-explain p {
  max-width: 66ch;
  color: var(--pm-ink-2);
  font: var(--pm-fs-14) / 1.6 var(--pm-font);
}
.nx-explain__mine {
  margin-top: var(--pm-s-1);
  padding-top: var(--pm-s-1);
  border-top: 1px dashed var(--pm-line-strong);
  color: var(--pm-ink-3);
}
.nx-explain__next {
  margin-top: var(--pm-s-4);
  min-height: 48px;
  padding: 0 var(--pm-s-4);
  border-radius: 12px; /* spec §5: button radius 12px — see Risks */
  font: 700 var(--pm-fs-14) var(--pm-font);
}
.nx-quiz-help {
  justify-content: center;
  margin-top: var(--pm-s-4);
  color: var(--pm-ink-3);
  font-size: var(--pm-fs-12); /* never 11px */
}
@media (max-width: 620px) {
  .nx-explain { padding: var(--pm-s-3); }
  .nx-explain__next,
  .nx-quiz-session .nx-explain__next { width: 100%; justify-content: center; }
  .nx-quiz-help { flex-wrap: wrap; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .nx-explain { animation: none; }
  .nx-option { transition: none; }
}
```

---

## D5 — Result screen (score, weak topics, retry)

**One decision:** a single scroll column — hero → weak topics → answer detail → action row —
with 32px section rhythm. The ring is the one visual anchor; the primary "Natijani saqlash" is
the one main action.

| Block | 1440 | 900 | 620 | 375 | Token |
|---|---|---|---|---|---|
| Stage max-width | 880 | 880 | 100% | 100% | `.nx-page--narrow` |
| Hero padding / gap | 32 / 24 | 32 / 24 | 24 / 16 | 24 / 16 | `--pm-s-5`/`--pm-s-4` |
| Hero radius | 24 | 24 | 24 | 24 | `--pm-r-lg` |
| Ring size | 104 | 104 | 80 | 64 | 13/10/8 × 8px |
| Eyebrow | 12/700 | 12/700 | 12/700 | 12/700 | `--pm-fs-12` |
| Hero title | 40 | 30 | 24 | 20 | `--pm-fs-40→30→24→20` |
| Hero subtitle | 16 | 16 | 14 | 14 | `--pm-fs-16→14` |
| Hero margin-bottom | 32 | 32 | 32 | 32 | `--pm-s-5` |
| Hero direction | row | row | column | column | — |
| Weak card padding / mb | 24 / 32 | 24 / 32 | 16 / 32 | 16 / 32 | `--pm-s-4`/`--pm-s-3` |
| Weak h2 / hint | 20 / 14 | 20 / 14 | 18 / 14 | 18 / 14 | `--pm-fs-20/18/14` |
| Retry button | right, 44 | right, 44 | full, 44 | full, 44 | ghost recipe |
| Weak row min-h / pad / gap | 48 / 12·16 / 8 | 48 / 12·16 / 8 | 48 / 12 / 8 | 48 / 12 / 8 | `--pm-s-6`, `--pm-s-2` |
| Weak row icon / text / chip | 18 / 14 / 28 | 18 / 14 / 28 | 18 / 14 / 28 | 18 / 14 / 28 | spec §5 |
| Detail card padding | 24 | 24 | 16 | 16 | `--pm-s-4→--pm-s-3` |
| Detail h2 mb | 16 | 16 | 16 | 16 | `--pm-s-3` |
| Detail row gap / pad / min-h | 8 / 8·16 / 40 | 8 / 8·16 / 40 | 8 / 8 / 40 | 8 / 8 / 40 | `--pm-s-1`, `--pm-s-2` |
| Footer actions mt / gap | 32 / 12 | 32 / 12 | 32 / 12 | 32 / 12 | `--pm-s-5`, `--pm-s-2` |

```
1440 / 900                          620 / 375
┌─ hero (surface, r24, p32) ───────┐ ┌─ hero (p24) ──────────┐
│  ◯104       E'TIBOR / eyebrow   │ │  ◯80/64               │
│  87%        Ajoyib ish!   40px  │ │  Ajoyib ish!     24px │
│             7/8 · Kitob  16px   │ │  7/8 · Kitob    14px  │
└──────────────────────────────────┘ └───────────────────────┘
                    32px
┌─ weak card (p24/16) ─────────────┐ ┌─ weak card ───────────┐
│ E'tibor talab...       [↻ Qayta]│ │ E'tibor talab...      │
│ Bu savollar jadvalda...  14px   │ │ [↻ Qayta takrorlash]  │
│ ✕ Savol matni...      [mavzu]   │ │ ✕ Savol...  [mavzu]   │
│ ✕ Savol matni...      [mavzu]   │ │ ✕ Savol...  [mavzu]   │
└──────────────────────────────────┘ └───────────────────────┘
                    32px
┌─ detail card ────────────────────┐ ┌─ detail card ─────────┐
│ Javoblar tafsiloti               │ │ Javoblar tafsiloti    │
│ ✓ 01 Savol...        [Nazariy]   │ │ ✓ 01 Savol...[Nazariy]│
└──────────────────────────────────┘ └───────────────────────┘
              [Chiqish]  [Saqlash →]   (≤620: stacked, full width)
```

Paste-ready CSS:

```css
.nx-result-hero {
  display: flex;
  align-items: center;
  gap: var(--pm-s-4);
  padding: var(--pm-s-5);
  margin-bottom: var(--pm-s-5);
  border-radius: var(--pm-r-lg);
  background: var(--pm-surface);
  box-shadow: var(--pm-shadow-1);
}
.nx-result-hero .nx-ring-wrap { flex: 0 0 auto; }
.nx-result-hero .nx-eyebrow {
  color: var(--pm-accent);
  font: 700 var(--pm-fs-12) / 1.4 var(--pm-font);
  letter-spacing: 0.08em;
}
.nx-result-hero .nx-title {
  margin-top: var(--pm-s-1);
  font: 600 var(--pm-fs-40) / 1.1 var(--pm-font-display);
  letter-spacing: -0.035em;
  color: var(--pm-ink);
}
.nx-result-hero .nx-subtitle {
  margin-top: var(--pm-s-1);
  color: var(--pm-ink-2);
  font: var(--pm-fs-16) / 1.5 var(--pm-font);
}
.nx-quiz-result .nx-card--pad {
  padding: var(--pm-s-4);
  margin-bottom: var(--pm-s-5);
  border-radius: var(--pm-r);
  background: var(--pm-surface);
  box-shadow: var(--pm-shadow-1);
}
.nx-quiz-result .nx-h2 {
  font: 600 var(--pm-fs-20) / 1.3 var(--pm-font-display);
  color: var(--pm-ink);
}
.nx-weak-head { gap: var(--pm-s-3); }
.nx-weak-retry { min-height: 44px; flex-shrink: 0; }
.nx-weak-row,
.nx-detail-row {
  gap: var(--pm-s-2);
  padding: var(--pm-s-2) var(--pm-s-3);
  min-height: 40px;
  border-radius: var(--pm-r-sm);
  background: var(--pm-surface-2);
  color: var(--pm-ink-2);
  font: var(--pm-fs-14) / 1.45 var(--pm-font);
}
.nx-weak-row { min-height: 48px; }
.nx-weak-row > svg { flex: 0 0 auto; color: var(--pm-accent); }
.nx-detail-row > span.ok { color: var(--pm-sage); }
.nx-detail-row > span.bad { color: var(--pm-accent); }
.nx-quiz-result > .nx-row:last-child {
  justify-content: flex-end;
  gap: var(--pm-s-2);
  margin-top: var(--pm-s-5);
}
@media (max-width: 900px) {
  .nx-result-hero .nx-title { font-size: var(--pm-fs-30); }
}
@media (max-width: 620px) {
  .nx-result-hero { flex-direction: column; align-items: flex-start; gap: var(--pm-s-3); padding: var(--pm-s-4); }
  .nx-result-hero .nx-title { font-size: var(--pm-fs-24); }
  .nx-result-hero .nx-subtitle { font-size: var(--pm-fs-14); }
  .nx-quiz-result .nx-card--pad { padding: var(--pm-s-3); }
  .nx-quiz-result .nx-h2 { font-size: var(--pm-fs-18); }
  .nx-weak-row, .nx-detail-row { padding: var(--pm-s-2); }
  .nx-quiz-result > .nx-row:last-child { flex-direction: column; align-items: stretch; }
  .nx-quiz-result > .nx-row:last-child .nx-btn { width: 100%; }
}
@media (max-width: 375px) {
  .nx-result-hero { gap: var(--pm-s-2); }
  .nx-result-hero .nx-title { font-size: var(--pm-fs-20); }
}
```

---

## D6 — Confirm modal & toast

**One decision:** modal is exactly **400px** wide (fluid below that), 32px padding, 24px radius,
with heading / body / actions left-aligned and a top-right close. Toast is a bottom-centered
420px-max pill, 48px tall, `--pm-ink` on `--pm-bg`, above the modal layer.

| Part | 1440 | 900 | 620 | 375 | Token |
|---|---|---|---|---|---|
| Modal width | 400 | 400 | `min(400, 100vw−32)` = 400 | 343 | 50 × 8px |
| Modal padding | 32 | 32 | 24 | 24 | `--pm-s-5` → `--pm-s-4` |
| Modal radius | 24 | 24 | 24 | 24 | `--pm-r-lg` |
| Close inset / hit | 24 / 32 | 24 / 32 | 16 / 32 | 16 / 32 | `--pm-s-4`/`--pm-s-3` |
| Heading | 24/600 | 24/600 | 24/600 | 24/600 | `--pm-fs-24` |
| Heading→body | 12 | 12 | 12 | 12 | `--pm-s-2` |
| Body | 14/1.6 | 14/1.6 | 14/1.6 | 14/1.6 | `--pm-fs-14` |
| Body→actions | 32 | 32 | 32 | 24 | `--pm-s-5`→`--pm-s-4` |
| Actions gap / align | 12 / right | 12 / right | 12 / right | 8 / stacked | `--pm-s-2`/`--pm-s-1` |
| Action heights | 48 / 48 | 48 / 48 | 48 / 48 | 48 / 48 | primary recipe |
| Overlay | `color-mix(--pm-ink 42%, transparent)` | same | same | same | token-only |
| Toast max-width | 420 | 420 | 420 | `100vw−32` | — |
| Toast bottom | 32 | 32 | 32 | 16 | `--pm-s-5`→`--pm-s-3` |
| Toast min-h / pad | 48 / 12·24 | 48 / 12·24 | 48 / 12·24 | 48 / 12·16 | `--pm-s-6` |
| Toast radius / font | pill / 14 | pill / 14 | pill / 14 | 10 / 14 | `--pm-r-pill`/`--pm-r-sm` |
| Toast dot / gap | 8 / 12 | 8 / 12 | 8 / 12 | 8 / 12 | `--pm-s-1`/`--pm-s-2` |
| Toast z-index | 120 | 120 | 120 | 120 | above modal |

```
       overlay (ink 42%)
   ┌──────────────────────────┐ 400px
   │                    ✕    │ close 32px
   │ Sessiyani tark etish?    │ 24px/600
   │ Hozirgi javoblar...      │ 14px/1.6
   │                          │ 32px
   │   [Bekor qilish] [Chiqish]│ 48px  (≤620 stacked, full width)
   └──────────────────────────┘

   bottom-center:  ● Natijalar saqlandi   (pill, 48px)
```

Paste-ready CSS:

```css
.nx-quiz-session .nx-overlay,
.nx-quiz-result .nx-overlay {
  background: color-mix(in srgb, var(--pm-ink) 42%, transparent);
  z-index: 100;
}
.nx-quiz-session .nx-modal,
.nx-quiz-result .nx-modal {
  width: 400px;
  max-width: calc(100vw - var(--pm-s-5));
  padding: var(--pm-s-5);
  border-radius: var(--pm-r-lg);
  background: var(--pm-surface);
  box-shadow: var(--pm-shadow-2);
}
.nx-quiz-session .nx-modal .nx-title,
.nx-quiz-result .nx-modal .nx-title {
  margin: 0;
  padding-right: var(--pm-s-5);
  color: var(--pm-ink);
  font: 600 var(--pm-fs-24) / 1.25 var(--pm-font-display);
  letter-spacing: -0.035em;
}
.nx-quiz-session .nx-modal .nx-subtitle,
.nx-quiz-result .nx-modal .nx-subtitle {
  margin-top: var(--pm-s-2);
  color: var(--pm-ink-2);
  font: var(--pm-fs-14) / 1.6 var(--pm-font);
}
.nx-quiz-session .nx-modal .nx-row,
.nx-quiz-result .nx-modal .nx-row {
  justify-content: flex-end;
  gap: var(--pm-s-2);
  margin-top: var(--pm-s-5);
}
.nx-quiz-session .nx-modal .nx-row .nx-btn,
.nx-quiz-result .nx-modal .nx-row .nx-btn {
  min-height: 48px;
  border-radius: 12px; /* see Risks */
}
.nx-quiz-session .nx-modal__close,
.nx-quiz-result .nx-modal__close {
  top: var(--pm-s-4);
  right: var(--pm-s-4);
}
.nx-toast {
  position: fixed;
  z-index: 120;
  bottom: var(--pm-s-5);
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: var(--pm-s-2);
  max-width: 420px;
  min-height: 48px;
  padding: var(--pm-s-2) var(--pm-s-4);
  border-radius: var(--pm-r-pill);
  background: var(--pm-ink);
  color: var(--pm-bg);
  box-shadow: var(--pm-shadow-2);
  font: 600 var(--pm-fs-14) / 1.4 var(--pm-font);
}
.nx-toast .nx-dot {
  flex: 0 0 var(--pm-s-1);
  width: var(--pm-s-1);
  height: var(--pm-s-1);
  border-radius: var(--pm-r-pill);
  background: var(--pm-accent);
}
@media (max-width: 620px) {
  .nx-quiz-session .nx-modal,
  .nx-quiz-result .nx-modal { padding: var(--pm-s-4); }
  .nx-quiz-session .nx-modal .nx-row,
  .nx-quiz-result .nx-modal .nx-row {
    flex-direction: column;
    align-items: stretch;
    gap: var(--pm-s-1);
    margin-top: var(--pm-s-4);
  }
  .nx-quiz-session .nx-modal .nx-row .nx-btn,
  .nx-quiz-result .nx-modal .nx-row .nx-btn { width: 100%; }
  .nx-quiz-session .nx-modal__close,
  .nx-quiz-result .nx-modal__close { top: var(--pm-s-3); right: var(--pm-s-3); }
}
@media (max-width: 375px) {
  .nx-toast {
    max-width: none;
    width: calc(100vw - var(--pm-s-5));
    bottom: var(--pm-s-3);
    border-radius: var(--pm-r-sm);
    padding-inline: var(--pm-s-3);
  }
}
```

---

## D7 — Keeping the quiz focused (one question · one answer · one next)

**One decision:** focus is enforced structurally by the TSX — no geometry change required, only
reinforcement. Exactly one `item` is mounted; `choose()` sets `revealed` and
`disabled={revealed}` on every option, so there is no separate submit step. After reveal, the
`nx-explain__next` button is the single primary on screen and receives focus via the existing
effect. Everything else is de-emphasized to text/ghost.

| Chrome element | Treatment | Reason |
|---|---|---|
| App topbar | Keep (premium, quiet) | persistent shell; cannot hide from this layer |
| Close "Chiqish" | Ghost, 14px `--pm-ink-2`, no border | exit is secondary; Esc also exits via confirm |
| Header count + progress | Muted numeric + 8px track | orientation, not action |
| Chips row | `--pm-fs-12` chips, max 3 | context only, no interaction |
| Question text | single 24px block, 66ch | one question, no list |
| Options | one state change per click; kbd 1–4 | one answer |
| Feedback | appears in-place, no modal | no context switch |
| Next button | only primary; focus moved here | one next action |
| Keyboard help | non-interactive 12px `--pm-ink-3` | no competing control |
| Result footer | one primary "Natijani saqlash"; ghost exit | one main action persists |

```
           ┌──────────────────────┐
           │  CHROME (quiet)      │  topbar, close, 01/08, bar
           ├──────────────────────┤
           │  QUESTION  (1)       │  one block
           │  OPTIONS   (1 pick)  │  click/kbd → reveal, lock all
           │  FEEDBACK  (inline)  │  reason + NEXT (1 primary)
           └──────────────────────┘
        no sidebar · no preview · no second CTA
```

No extra CSS needed for D7 — D1–D6 declarations already deliver it. **Do not** add a second
primary button, a "Submit answer" control, or a question navigator; that would break the
one-action rule and the existing keyboard handler (`Enter`/`Space` → `next()`).

---

## Master breakpoint table

| Value | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Stage max (session) | 720 | 720 | 100% | 100% |
| Stage max (result) | 880 | 880 | 100% | 100% |
| Gutter | auto | auto | 16 | 16 |
| Card padding | 24 | 24 | 16 | 16 |
| Header height | 48 | 48 | 48 | 48 |
| Count size | 24 | 24 | 20 | 20 |
| Progress height | 8 | 8 | 8 | 8 |
| Question size | 24 | 24 | 20 | 20 |
| Option min-h / gap / marker | 56 / 12 / 32 | 56 / 12 / 32 | 56 / 12 / 32 | 56 / 12 / 32 |
| Feedback padding | 24 | 24 | 16 | 16 |
| Primary height | 48 | 48 | 48 | 48 |
| Ring size | 104 | 104 | 80 | 64 |
| Hero title | 40 | 30 | 24 | 20 |
| Modal width / padding | 400 / 32 | 400 / 32 | fluid / 24 | 343 / 24 |
| Toast bottom / max-w | 32 / 420 | 32 / 420 | 32 / 420 | 16 / fluid |

---

## Findings / Changes / Risks / Verification

**Findings**
- Legacy `quiz.css` is off-grid in four places (`20px`, `6px`, `4px` gaps, `11px` help text) and
  uses a hard-coded `1.5px` option border plus `translateX(4px)` hover. All are normalized to
  tokens above; hover motion is reduced to color-only (spec §6: background 1px max).
- `.nx-page--narrow` already caps at 880px and `.nx-quiz-session/.nx-quiz-result` already use
  `min-height: calc(100vh - var(--topbar-h))` — D1 builds on that, no TSX change.
- `ConfirmModal` already has focus trap, `role="alertdialog"`, autoFocus confirm and focus
  restore; `useToast` is `role="status"` + 2600ms timer. D6 keeps all of it.

**Changes (decisions only — no files edited)**
- D1–D7 as above. No new class names required; every rule targets an existing selector from
  `QuizRunner.tsx` / `NxUI.tsx`. Base class names are untouched (spec rule 5).

**Risks**
1. **Button radius 12px** (spec §5) has no token (`--pm-r-sm` = 10px). I wrote literal `12px`
   in three paste blocks. Recommend parent add `--pm-r-btn: 12px` to `00-tokens.css` and swap,
   or accept 10px to stay strict token-only. I did **not** create the token (out of scope).
2. **`--topbar-h` = 64px** (`theme.css`/`global.css`) but premium topbar is `height: 72px`
   (`02-topbar.css`). Fullscreen calc therefore under-counts by 8px. Not fixable from this
   doc — flag to the topbar/premium owner; no change made here.
3. `color-mix(in srgb, var(--pm-ink) 42%, transparent)` for the overlay is token-only but needs
   the same browser support already assumed by `quiz.css` (it uses `color-mix` today).
4. Modal `autoFocus` on the destructive confirm is existing behavior; layout keeps it. If the
   team wants cancel-focused safety, that is a TSX change — not mine to make.
5. D5 relaxes the "title ≥30px" rule to 24/20px on 620/375 because an 880px hero cannot hold
   30px + ring at 343px width. Accepted trade-off; 40/30px retained on desktop.

**Verification (for the implementing agent)**
- Render `QuizRunner` at 1440 / 900 / 620 / 375 in light and `[data-theme='dark']`; check stage
  stays centered, no horizontal scrollbar at 375, and all text ≥12px.
- Click an option: verify all four options disable, feedback appears inline with 3px rail, and
  focus lands on the single next button (`document.activeElement`).
- Open exit via ✕ and via Esc: modal = 400px, focus trapped, focus restored on close.
- Confirm toast sits bottom-center, above overlay, and auto-hides after 2600ms.
- Run `prefers-reduced-motion` after implementation: `nx-explain` animation off, option
  transition and hover transform off.
