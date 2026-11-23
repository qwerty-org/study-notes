# L05 — Layout decisions: Repeat & Stats

Role: LAYOUT DECISION ARCHITECT. Scope: placement, sizes, columns, gaps, alignment at **1440 / 900 / 620 / 375**.
This document decides layout only. No source / CSS file was modified; the declarations below are paste-ready for the premium layer (`28-repeat.css`, `29-stats.css`) and are written for the owner of those files.

Sources read: `docs/superpowers/specs/2026-11-23-premium-design-system.md`, `after-repeat.png`, `after-stats.png`, `apps/desktop/src/pages/Repeat.tsx`, `apps/desktop/src/pages/Stats.tsx`, `styles/nx/repeat.css`, `styles/nx/stats.css`, `styles/nx/foundation.css`, `styles/premium/00-tokens.css`.

---

## 0. Fixed assumptions (so every px below is reproducible)

| Viewport | Shell side padding | Content width | Grid gap used below |
|---|---|---|---|
| 1440 | 48 | 1344 | 24 |
| 900 | 24 | 852 | 24 |
| 620 | 20 | 580 | 16 |
| 375 | 16 | 343 | 16 |

These are the canonical content boxes. Geometry is tolerant of ±4px (the legacy shell uses 12px at ≤420); do not change card internals to compensate.

Token map used in every declaration: `--pm-s-1` 8 · `--pm-s-2` 12 · `--pm-s-3` 16 · `--pm-s-4` 24 · `--pm-s-5` 32 · `--pm-s-6` 48 · `--pm-s-7` 64 · `--pm-s-8` 80.
Radius: `--pm-r-sm` 10 · `--pm-r` 16 · `--pm-r-lg` 24 · `--pm-r-pill` 999. Surfaces: `--pm-surface` (card), `--pm-surface-2` (track/chip), `--pm-surface-3` (empty track). Ink: `--pm-ink` / `--pm-ink-2` / `--pm-ink-3`.

**CSS-only constraint (verified in `NxUI.tsx`):** `Ring` writes `width`/`height` as an inline style from its `size` prop (96 on Repeat, 64 on Stats). Layout CSS cannot resize it without `!important`, which the spec forbids. Therefore all ring demotion is **by colour, weight and caption size**, not by diameter. If a 72px / 56px ring is wanted later, that is a JSX prop change — flagged in §13, not assumed here.

---

# PART A — REPEAT

## D1. Page frame and two-column placement

**Decision:** page header keeps the full width with `margin-bottom: 32px`. Below it, session + queue form one 2-column band, gap 24px; the "how it works" panel is a **separate full-width band** 32px below that band. The three bands share the same left/right edges — no nested indents.

```
1440 / content 1344
┌──────────────────────────────────────────────────────────────┐
│ KUNLIK ODAT → Takrorlash (40)                               │  header
│ Savolga javob bering … (16)                                 │  mb 32
├──────────────────────────────┬───────────────────────────────┤
│ SESSION CARD 660             │ QUEUE 660                     │  gap 24
│ ring│ info  [CTA]            │ head / 5 rows (scroll)        │
├──────────────────────────────┴───────────────────────────────┤  mt 32
│ HOW IT WORKS — full 1344                                     │
└──────────────────────────────────────────────────────────────┘
```

| Viewport | `.nx-repeat-main` columns | Column width | Band gap | Session↔panel gap |
|---|---|---|---|---|
| 1440 | `1fr 1fr` | 660 / 660 | 24 | 32 |
| 900 | `1fr 1fr` | 414 / 414 | 24 | 32 |
| 620 | `1fr` | 580 | 16 | 32 |
| 375 | `1fr` | 343 | 16 | 24 |

```css
.nx-repeat .nx-head { margin-bottom: var(--pm-s-5); }
.nx-repeat-main { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-4); align-items: start; }
.nx-schedule-info { margin-top: var(--pm-s-5); }
@media (max-width: 620px) {
  .nx-repeat-main { grid-template-columns: minmax(0, 1fr); gap: var(--pm-s-3); }
}
@media (max-width: 420px) {
  .nx-schedule-info { margin-top: var(--pm-s-4); }
}
```

## D2. Session card — exact internal geometry (ONE focal CTA)

**Decision:** horizontal split at ≥620 with a fixed **96px ring column** (the ring itself stays 96px inline-sized, centred in that column), 32px gutter, info column `flex: 1`. At 900 the card stacks vertically (the 414px column cannot host a 238px info column without 4-line wrapping); at 375 it stacks too. The **CTA sits at the bottom of the info column, immediately after the chips**, with 24px above and 16px below to the keyboard hint. It is the only filled `--pm-accent` element on the screen.

```
SESSION @1440 — 660 × ~304, padding 24
┌────────────────────────────────────────────────────────────┐
│  ┌────────┐   ┌──────────────────────────────────────────┐│
│  │ ( 96 ) │   │ Bugungi sessiya              12/700     ││  mb 8
│  │  savol │32 │ 5 savol · 1 kitob             24 Fr      ││  mb 8
│  │ kutmoq-│   │ Taxminiy 2 daqiqa…            14/1.5     ││  mb 16
│  │  da    │   │ [~2 daq][1 kun][Bugun]        28px       ││  mb 24
│  └────────┘   │ ┌──────────────────┐                     ││
│               │ │▸ Boshlash      │ 48 FOCAL             ││
│               │ └──────────────────┘                     ││  mt 16
│               │ ⌨ Sessiyada: 1–4 javob · Enter …         ││  12/ink-3
└────────────────────────────────────────────────────────────┘
  96 ring col + 32 gap + 484 info = 612 inner
```

| Element | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Card padding | 24 | 24 | 20 | 20 |
| Card layout | row | **column, centred** | row | column, centred |
| Card height | ~304 | ~504 | ~294 | ~452 |
| Ring column | 96 (ring 96) | 96 (ring 96) | 96 (ring 96) | 96 (ring 96) |
| Ring→info gap | 32 | 24 | 20 | 16 |
| Info width | 484 | 366 | 424 | 303 |
| Eyebrow / mb | 12 / 8 | 12 / 8 | 12 / 8 | 12 / 8 |
| H2 / mb | 24 / 8 | 24 / 8 | 24 / 8 | 24 / 8 |
| Subtitle / mb | 14 / 16 | 14 / 16 | 14 / 16 | 14 / 16 |
| Chips h / gap / mb | 28 / 8 / 24 | 28 / 8 / 24 | 28 / 8 / 24 | 28 / 8 / 24 |
| CTA h / min-w / radius | 48 / 168 / 12 | 48 / 168 / 12 | 48 / 168 / 12 | **48 / 100% / 12** |
| Keys mt / font | 16 / 12 | 16 / 12 | 16 / 12 | 16 / 12 |

```css
.nx-repeat .nx-session-card {
  display: flex;
  align-items: center;
  gap: var(--pm-s-5);                 /* 32 */
  padding: var(--pm-s-4);             /* 24 */
  border-radius: var(--pm-r);
  background: var(--pm-surface);
  box-shadow: var(--pm-shadow-1);
}
.nx-repeat .nx-session-card::before { display: none; }   /* gradient only in heroes */
.nx-repeat .nx-session-card__ring { flex: 0 0 96px; display: flex; flex-direction: column; align-items: center; gap: var(--pm-s-1); }
.nx-repeat .nx-session-card__ring .nx-ring circle.track { stroke: var(--pm-surface-3); }
.nx-repeat .nx-session-card__ring .nx-ring circle.value { stroke: var(--pm-line-strong); }
.nx-repeat .nx-session-card__ring > span { font-size: var(--pm-fs-12); font-weight: 600; line-height: 1.3; color: var(--pm-ink-3); text-align: center; }
.nx-repeat .nx-session-card__info { flex: 1; min-width: 0; }
.nx-repeat .nx-session-card__info .nx-eyebrow { display: block; margin-bottom: var(--pm-s-1); }
.nx-repeat .nx-session-card__info .nx-title--sm { margin: 0 0 var(--pm-s-1); font-size: var(--pm-fs-24); line-height: 1.2; }
.nx-repeat .nx-session-card__info .nx-subtitle { margin: 0 0 var(--pm-s-3); max-width: 46ch; font-size: var(--pm-fs-14); line-height: 1.5; color: var(--pm-ink-2); }
.nx-repeat .nx-session-card__chips { display: flex; flex-wrap: wrap; gap: var(--pm-s-1); margin-bottom: var(--pm-s-4); }
.nx-repeat .nx-session-card__cta { min-width: 168px; }   /* inherits primary: 48h, 0 24, r12, 14/700 */
.nx-repeat .nx-session-card__keys { display: flex; flex-wrap: wrap; align-items: center; gap: var(--pm-s-1); margin-top: var(--pm-s-3); font-size: var(--pm-fs-12); line-height: 1.4; color: var(--pm-ink-3); }
.nx-repeat .nx-session-card__keys .nx-kbd { font-size: 11px; padding: 2px 6px; border: 1px solid var(--pm-line); border-radius: 6px; background: var(--pm-surface-2); color: var(--pm-ink-2); }
@media (max-width: 900px) {
  .nx-repeat .nx-session-card { flex-direction: column; text-align: center; gap: var(--pm-s-4); }
  .nx-repeat .nx-session-card__keys { justify-content: center; }
}
@media (max-width: 620px) {
  .nx-repeat .nx-session-card { flex-direction: row; text-align: left; gap: var(--pm-s-3); padding: 20px; }
  .nx-repeat .nx-session-card__keys { justify-content: flex-start; }
}
@media (max-width: 420px) {
  .nx-repeat .nx-session-card { flex-direction: column; text-align: center; gap: var(--pm-s-3); }
  .nx-repeat .nx-session-card__cta { width: 100%; }
  .nx-repeat .nx-session-card__keys { justify-content: center; }
}
```

## D3. Queue card geometry — the quiet list

**Decision:** fixed 72px head (24px padding + 24px content + 1px rule) and a scrollable list capped at 384px / 320px / 288px. Rows are 72px-min neutral surface-2 tiles; the type chip is a **24px micro-chip**, never the accent fill. The list must never grow to push the CTA band out of view.

```
QUEUE @1440 — 660 × ~504
┌──────────────────────────────────────────────┐
│ ◎ Navbatdagi savollar              [ 5 ta ]  │ 72, rule below
├──────────────────────────────────────────────┤
│ [Vaziyat] Siz yangi yil qarori…              │ 72
│ [Nazariy] Odat tsikli qaysi to‘rt…           │ 72   gap 8
│ [Vaziyat] Ertalab sport…                     │ 72   scroll ≤384
│ [Nazariy] 2-daqiqa qoidasi…                  │ 72
│ [Vaziyat] Siz 5 kun…                         │ 72
└──────────────────────────────────────────────┘
```

| Element | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Head padding | 24 | 24 | 20 | 20 |
| Head height | 72 | 72 | 64 | 64 |
| Title font | 18/700 | 18 | 16 | 16 |
| Body padding | 24 | 20 | 16 | 16 |
| Row gap | 8 | 8 | 8 | 8 |
| List max-height | 384 | 384 | 320 | 288 |
| Row min-height / padding | 72 / 12 16 | 72 / 12 16 | 72 / 12 | 88 / 12 |
| Question / small | 14/1.4 / 12 | 14 / 12 | 14 / 12 | 14 / 12 |
| Type chip h / px / font | 24 / 8 / 12 | 24 / 8 / 12 | 24 / 8 / 12 | 24 / 8 / 12 |

```css
.nx-repeat .nx-queue { border-radius: var(--pm-r); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); overflow: hidden; }
.nx-repeat .nx-queue .nx-panel__head { display: flex; align-items: center; justify-content: space-between; gap: var(--pm-s-2); padding: var(--pm-s-4); border-bottom: 1px solid var(--pm-line); }
.nx-repeat .nx-queue__title { display: flex; align-items: center; gap: var(--pm-s-1); font-size: var(--pm-fs-18); font-weight: 700; color: var(--pm-ink); }
.nx-repeat .nx-queue__title svg { color: var(--pm-ink-3); }
.nx-repeat .nx-queue .nx-panel__body { padding: var(--pm-s-4); }
.nx-repeat .nx-queue__list { display: flex; flex-direction: column; gap: var(--pm-s-1); max-height: 384px; overflow-y: auto; }
.nx-repeat .nx-queue__row { display: flex; align-items: flex-start; gap: var(--pm-s-3); min-height: 72px; padding: 12px var(--pm-s-3); border-radius: var(--pm-r-sm); background: var(--pm-surface-2); }
.nx-repeat .nx-queue__row .nx-chip { min-height: 24px; padding: 0 8px; font-size: var(--pm-fs-12); background: var(--pm-surface-3); color: var(--pm-ink-2); }
.nx-repeat .nx-queue__text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.nx-repeat .nx-queue__row b { font-size: var(--pm-fs-14); font-weight: 600; line-height: 1.4; color: var(--pm-ink); }
.nx-repeat .nx-queue__row small { font-size: var(--pm-fs-12); color: var(--pm-ink-3); }
@media (max-width: 900px) { .nx-repeat .nx-queue .nx-panel__body { padding: 20px; } }
@media (max-width: 620px) {
  .nx-repeat .nx-queue .nx-panel__head, .nx-repeat .nx-queue .nx-panel__body { padding: 20px; }
  .nx-repeat .nx-queue__list { max-height: 320px; }
  .nx-repeat .nx-queue__title { font-size: var(--pm-fs-16); }
}
@media (max-width: 420px) {
  .nx-repeat .nx-queue__list { max-height: 288px; }
  .nx-repeat .nx-queue__row { flex-wrap: wrap; gap: var(--pm-s-1); min-height: 88px; }
}
```

## D4. "How it works" panel — placement and internals

**Decision:** full-width band directly below the main grid (32px at ≥620, 24px at ≤420). Large-panel treatment: 32px padding, 24px radius. The five interval cards stay **5 columns down to 620** (they are the explanation's rhythm, not a badge collection) and drop to 3 columns only at ≤420. The final progress caption + bar is a **footer line in neutral ink**, not a second progress hero.

```
HOW IT WORKS @1440 — 1344 wide, padding 32
┌──────────────────────────────────────────────────────────────┐
│ ⓘ Takrorlash qanday ishlaydi?                    20 Fraunces│
│ To‘g‘ri javob berganda … (14, max 72ch)                     │
│                                                              │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   5 × 243, gap 16       │
│ │ ①  │ │ ②  │ │ ③  │ │ ④  │ │ ⑤  │                        │
│ │1 kun│ │3 kun│ │7 kun│ │14 kun│ │30 kun│                   │
│ └────┘ └────┘ └────┘ └────┘ └────┘                        │
│ Bugun javob berish kerak                    5 / 12          │
│ ▬▬▬▬▬▬░░░░░░░░░░░░░░░░░░░░░  h8 neutral                  │
│ Keyingi takrorlash: …                         12/ink-3      │
└──────────────────────────────────────────────────────────────┘
```

| Element | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Panel padding / radius | 32 / 24 | 32 / 24 | 20 / 24 | 20 / 24 |
| Head font | 20 Fraunces | 20 | 18 | 18 |
| Head→intro / intro width | 16 / 72ch | 16 / 72ch | 16 / full | 16 / full |
| Lead→grid / grid gap | 24 / 16 | 24 / 16 | 24 / 8 | 24 / 8 |
| Interval columns | 5 | 5 | 5 | **3** |
| Interval card width | 243 | 144 | 101 | 95 |
| Interval card padding | 16 | 16 | 8 | 8 |
| Caption→bar / bar h | 8 / 8 | 8 / 8 | 8 / 8 | 8 / 8 |
| Foot mt / font | 12 / 12 | 12 / 12 | 12 / 12 | 12 / 12 |

```css
.nx-repeat .nx-schedule-info { padding: var(--pm-s-5); border-radius: var(--pm-r-lg); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); }
.nx-repeat .nx-schedule-info__head { margin-bottom: var(--pm-s-3); gap: var(--pm-s-1); }
.nx-repeat .nx-schedule-info__head svg { color: var(--pm-ink-3); }
.nx-repeat .nx-schedule-info .nx-h3 { font-size: var(--pm-fs-20); font-family: var(--pm-font-display); font-weight: 600; letter-spacing: -.035em; color: var(--pm-ink); }
.nx-repeat .nx-schedule-info__intro { margin: 0 0 var(--pm-s-4); max-width: 72ch; font-size: var(--pm-fs-14); line-height: 1.6; color: var(--pm-ink-2); }
.nx-repeat .nx-intervals__lead { margin: var(--pm-s-4) 0 12px; font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-repeat .nx-intervals { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--pm-s-3); margin-bottom: var(--pm-s-4); }
.nx-repeat .nx-intervals__step { display: flex; flex-direction: column; align-items: center; gap: var(--pm-s-1); padding: var(--pm-s-3); border-radius: var(--pm-r-sm); background: var(--pm-surface-2); }
.nx-repeat .nx-intervals__dot { width: 24px; height: 24px; border-radius: var(--pm-r-pill); background: var(--pm-surface); color: var(--pm-ink-2); font-size: var(--pm-fs-12); font-weight: 700; }
.nx-repeat .nx-intervals__step b { font-size: var(--pm-fs-14); font-weight: 700; color: var(--pm-ink); font-variant-numeric: tabular-nums; }
.nx-repeat .nx-intervals__caption { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--pm-s-1); font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-repeat .nx-intervals__caption b { color: var(--pm-ink-2); font-variant-numeric: tabular-nums; }
.nx-repeat .nx-intervals__bar { height: 8px; margin: 0; border-radius: var(--pm-r-pill); background: var(--pm-surface-2); }
.nx-repeat .nx-intervals__bar > span { border-radius: var(--pm-r-pill); background: var(--pm-ink-3); }
.nx-repeat .nx-schedule-info__foot { margin-top: 12px; font-size: var(--pm-fs-12); color: var(--pm-ink-3); }
@media (max-width: 620px) {
  .nx-repeat .nx-schedule-info { padding: 20px; }
  .nx-repeat .nx-schedule-info .nx-h3 { font-size: var(--pm-fs-18); }
  .nx-repeat .nx-intervals { gap: var(--pm-s-1); }
  .nx-repeat .nx-intervals__step { padding: var(--pm-s-1); }
}
@media (max-width: 420px) { .nx-repeat .nx-intervals { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
```

## D5. Repeat — single focal point and demotion map

**Decision:** the CTA "Boshlash" is the **only** filled accent surface. Every other coloured/progress element is demoted to ink or neutral surface. The session ring, the interval bar, the queue badges and the result banner are informational, never attention-grabbing.

| Element | Current (screenshot) | Decision | Reason |
|---|---|---|---|
| `.nx-session-card__cta` | filled accent | **KEEP — sole focal** | one action per screen |
| `.nx-session-card__ring` | 96px accent arc | neutral arc `--pm-line-strong`, track `--pm-surface-3`, caption 12 ink-3 | size fixed by JSX; demote by colour |
| `.nx-session-card__chips` | amber / outline | all neutral `--pm-surface-2` + ink-2 | colour budget ink + accent |
| `.nx-queue .nx-chip--accent` ("Vaziyat", "5 ta") | accent fill | neutral `--pm-surface-3` | accent reserved for CTA |
| `.nx-intervals__dot` | accent-soft | `--pm-surface` + ink-2 | de-emphasise explanation |
| `.nx-intervals__bar` fill | accent | `--pm-ink-3`, h8 | duplicates ring data |
| `.nx-repeat-result` | green block | `--pm-surface-2` band, 12/ink-2, no coloured icon tile | post-action, not focal |

```css
.nx-repeat .nx-session-card__chips .nx-chip,
.nx-repeat .nx-queue .nx-chip { background: var(--pm-surface-2); color: var(--pm-ink-2); border-color: transparent; }
.nx-repeat .nx-intervals__dot { background: var(--pm-surface); color: var(--pm-ink-2); }
.nx-repeat .nx-repeat-result { gap: var(--pm-s-2); padding: var(--pm-s-3); margin-bottom: var(--pm-s-4); border: 0; border-left: 2px solid var(--pm-sage); border-radius: var(--pm-r-sm); background: var(--pm-surface-2); }
.nx-repeat .nx-repeat-result__icon { width: 32px; height: 32px; border-radius: var(--pm-r-pill); background: var(--pm-sage-soft); color: var(--pm-sage); }
.nx-repeat .nx-repeat-result b { font-size: var(--pm-fs-16); font-family: var(--pm-font-display); }
.nx-repeat .nx-repeat-result p { font-size: var(--pm-fs-12); color: var(--pm-ink-2); }
```

---

# PART B — STATS

## D6. Page frame and Export placement

**Decision:** header is one row at ≥620: title block left, Export ghost button **bottom-aligned to the subtitle baseline** on the right. At ≤620 Export drops below the title block, left-aligned, with 16px gap. Export is deliberately secondary (44px ghost) — never the focal action.

```
STATS @1440 header
┌──────────────────────────────────────────────────────────────┐
│ SHXSIY TARAQQIYOT                                            │
│ Natijalarim                                  [⬇ Eksport]   │  ghost 44
│ O‘sishingizni bir joyda ko‘ring …                            │
└──────────────────────────────────────────────────────────────┘  mb 32
```

| Viewport | Header height (approx) | Title | Export position | Export h / px |
|---|---|---|---|---|
| 1440 | 96 | 40 | right, baseline with subtitle | 44 / 16 |
| 900 | 88 | 40 | right, baseline | 44 / 16 |
| 620 | 128 | 32 | stacked below, mt 16, left | 44 / 16 |
| 375 | 136 | 30 | stacked below, mt 16, left | 44 / 16 |

```css
.nx-stats .nx-head { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--pm-s-4); margin-bottom: var(--pm-s-5); }
.nx-stats .nx-head__actions { flex-shrink: 0; }
.nx-stats .nx-head__actions .nx-btn { height: 44px; padding: 0 var(--pm-s-3); border: 1px solid var(--pm-line); border-radius: var(--pm-r-sm); background: transparent; color: var(--pm-ink-2); font-size: var(--pm-fs-14); font-weight: 600; gap: var(--pm-s-1); }
@media (max-width: 620px) {
  .nx-stats .nx-head { flex-direction: column; align-items: flex-start; gap: var(--pm-s-3); margin-bottom: var(--pm-s-4); }
}
```

## D7. Profile hero — exact height and internal placement

**Decision:** hero is **144px tall at 1440**, 128px at 900, auto/min 112px at ≤620. Padding 32 / 24 / 20. Profile group is left-aligned and vertically centred; avatar 64px (56 at 900–620, 48 at 375) with 16px/12px gap to the text. The progress ring is right-aligned, vertically centred, with a 12px caption 8px below. The low-contrast gradient is permitted **here only**, placed centre-right so it never sits under text.

```
HERO @1440 — 1344 × 144, padding 32
┌──────────────────────────────────────────────────────────────┐
│  ┌────┐   o‘quvchi                               ┌────┐      │
│  │ 🦊 │   1 kunlik iz · 1 ta kitob · 0 tugatilgan │0 % │      │
│  └────┘   (14 / ink-2)                           └────┘      │
│                                                  o‘rtacha…   │
└──────────────────────────────────────────────────────────────┘
   avatar 64 + gap 16 + text (flex)          ring 64 + caption
```

| Element | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Hero height | **144** | 128 | auto, min 112 | auto, min 112 |
| Padding | 32 | 24 | 20 | 20 |
| Radius | 24 | 24 | 24 | 24 |
| Avatar | 64, r16 | 56, r16 | 56, r16 | 48, r12 |
| Avatar→text gap | 16 | 16 | 12 | 12 |
| Name | 30 Fraunces | 24 | 24 | 20 |
| Meta line | 14 / ink-2 | 14 | 13 | 12 |
| Ring + caption gap | 8 | 8 | 8 | 8 |
| Ring diameter (JSX) | 64 | 64 | 64 | 64 |

```css
.nx-stats .nx-stats-hero { display: flex; align-items: center; justify-content: space-between; gap: var(--pm-s-4); height: 144px; padding: var(--pm-s-5); border-radius: var(--pm-r-lg); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); }
.nx-stats .nx-stats-hero::after { left: auto; right: 22%; top: -120px; width: 280px; height: 280px; background: radial-gradient(circle, var(--pm-accent-soft), transparent 70%); pointer-events: none; }
.nx-stats .nx-stats-hero__profile { display: flex; align-items: center; gap: var(--pm-s-3); position: relative; z-index: 1; min-width: 0; }
.nx-stats .nx-stats-hero__avatar { width: 64px; height: 64px; flex-shrink: 0; border-radius: var(--pm-r); background: var(--pm-surface-2); font-size: var(--pm-fs-30); box-shadow: none; }
.nx-stats .nx-stats-hero__profile .nx-title--sm { margin: 0; font-size: var(--pm-fs-30); font-family: var(--pm-font-display); font-weight: 600; letter-spacing: -.035em; color: var(--pm-ink); }
.nx-stats .nx-stats-hero__profile .nx-subtitle { display: flex; align-items: center; gap: var(--pm-s-1); flex-wrap: wrap; margin-top: 4px; font-size: var(--pm-fs-14); color: var(--pm-ink-2); }
.nx-stats .nx-stats-hero__ring { display: flex; flex-direction: column; align-items: center; gap: var(--pm-s-1); position: relative; z-index: 1; flex-shrink: 0; }
.nx-stats .nx-stats-hero__ring span { font-size: var(--pm-fs-12); color: var(--pm-ink-3); }
.nx-stats .nx-stats-hero__ring .nx-ring circle.track { stroke: var(--pm-surface-3); }
.nx-stats .nx-stats-hero__ring .nx-ring circle.value { stroke: var(--pm-line-strong); }
@media (max-width: 900px) { .nx-stats .nx-stats-hero { height: 128px; padding: var(--pm-s-4); } .nx-stats .nx-stats-hero__avatar { width: 56px; height: 56px; } .nx-stats .nx-stats-hero__profile .nx-title--sm { font-size: var(--pm-fs-24); } }
@media (max-width: 620px) { .nx-stats .nx-stats-hero { height: auto; min-height: 112px; padding: 20px; } .nx-stats .nx-stats-hero__profile { gap: 12px; } }
@media (max-width: 420px) {
  .nx-stats .nx-stats-hero__avatar { width: 48px; height: 48px; border-radius: var(--pm-r-sm); font-size: var(--pm-fs-24); }
  .nx-stats .nx-stats-hero__profile .nx-title--sm { font-size: var(--pm-fs-20); }
  .nx-stats .nx-stats-hero__profile .nx-subtitle { font-size: var(--pm-fs-12); }
  .nx-stats .nx-stats-hero__ring .nx-ring { max-width: 48px; }
}
```

## D8. Stat row geometry

**Decision:** a 4-column data row at 1440, 2×2 at 900 and 620, 2×2 at 375. Equal widths, 24px gap on desktop, 16/12/8 below. All four tiles are **neutral**: label and icon `--pm-ink-3`, value `--pm-ink`, hint `--pm-ink-3`. The value is 30px tabular-nums; no card carries accent/success/warn fills. Hero → stat row gap is 24px (one summary cluster).

| Viewport | Columns | Gap | Tile width | Tile height | Padding | Value |
|---|---|---|---|---|---|---|
| 1440 | 4 | 24 | 318 | 128 | 20 24 | 30 |
| 900 | 2 | 16 | 418 | 120 | 20 | 30 |
| 620 | 2 | 12 | 284 | 112 | 16 | 28 |
| 375 | 2 | 8 | 167 | 104 | 12 | 24 |

```
STAT ROW @1440 — 4 × 318, gap 24
┌───────────────┐┌───────────────┐┌───────────────┐┌───────────────┐
│Qo‘llangan     ││To‘g‘ri javob ◎││Uzluksiz kun  ⟡││O‘qilgan bob  ▤│  13/ink-3
│0              ││0%             ││1              ││0              │  30/ink
│kunlik maqsad  ││0/0 savol      ││kunlik iz      ││4 ta jami      │  12/ink-3
└───────────────┘└───────────────┘└───────────────┘└───────────────┘
```

```css
.nx-stats .nx-stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--pm-s-4); margin-top: var(--pm-s-4); margin-bottom: var(--pm-s-5); }
.nx-stats .nx-stats-grid .nx-stat { display: flex; flex-direction: column; height: 128px; padding: 20px var(--pm-s-4); border: 0; border-radius: var(--pm-r); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); }
.nx-stats .nx-stats-grid .nx-stat__top { display: flex; align-items: center; justify-content: space-between; gap: var(--pm-s-1); margin-bottom: 12px; }
.nx-stats .nx-stats-grid .nx-stat__label { font-size: var(--pm-fs-13); font-weight: 600; color: var(--pm-ink-3); }
.nx-stats .nx-stats-grid .nx-stat__top svg { color: var(--pm-ink-3); }
.nx-stats .nx-stats-grid .nx-stat__value { font-size: var(--pm-fs-30); font-weight: 700; line-height: 1.1; color: var(--pm-ink); font-variant-numeric: tabular-nums; }
.nx-stats .nx-stats-grid .nx-stat__hint { margin-top: var(--pm-s-1); font-size: var(--pm-fs-12); color: var(--pm-ink-3); }
.nx-stats .nx-stats-grid .nx-stat--accent,
.nx-stats .nx-stats-grid .nx-stat--success,
.nx-stats .nx-stats-grid .nx-stat--warn { background: var(--pm-surface); color: var(--pm-ink); }
@media (max-width: 900px) { .nx-stats .nx-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-3); margin-bottom: var(--pm-s-5); } .nx-stats .nx-stats-grid .nx-stat { height: 120px; padding: 20px; } }
@media (max-width: 620px) { .nx-stats .nx-stats-grid { gap: 12px; } .nx-stats .nx-stats-grid .nx-stat { height: 112px; padding: var(--pm-s-3); } .nx-stats .nx-stats-grid .nx-stat__value { font-size: var(--pm-fs-24); } }
@media (max-width: 420px) { .nx-stats .nx-stats-grid { gap: var(--pm-s-1); } .nx-stats .nx-stats-grid .nx-stat { height: 104px; padding: 12px; } }
```

## D9. Weekly activity panel — chart placement and bar widths

**Decision:** panel is a full-width band 32px below the stat row, padding 32/24/20, radius 24. Section head is a two-part row: title+hint left, badges right (wrap at ≤620). Chart sits 24px below the head, **144px tall at 1440** with a deliberately narrow **64px bar centred in each 169px column** (screenshot's ~160px bars read as empty slabs). Bars are neutral ink-3; only today's bar (last child) gets the accent, so the chart has exactly one colour accent.

| Viewport | Panel padding | Chart h | Grid cols | Col width | Bar width | Col gap | Bar fill |
|---|---|---|---|---|---|---|---|
| 1440 | 32 | 144 | 7 | 169 | **64** | 16 | ink-3; last = accent |
| 900 | 24 | 128 | 7 | 108 | **48** | 8 | ink-3; last = accent |
| 620 | 20 | 112 | 7 | 74 | **32** | 4 | ink-3; last = accent |
| 375 | 20 | 96 | 7 | 40 | **24** | 4 | ink-3; last = accent |

```
ACTIVITY @1440 — 1344 wide, padding 32
┌──────────────────────────────────────────────────────────────┐
│ So‘nggi 7 kun                [Birinchi qadam][7 kunlik iz]… │  20 + 13
│ Har kuni kamida bitta qoidani …                             │
│                                                              │  mt 24
│    ▮      ▮      ▮      ▮      ▮      ▮      ▮               │  144 tall
│    ▮      ▮      ▮      ▮      ▮      ▮      ▮   64 wide     │
│   Ses    Chor    Pay    Jum    Shan    Yak    Dush            │  12/ink-3
└──────────────────────────────────────────────────────────────┘
```

```css
.nx-stats .nx-stats-activity { margin-top: var(--pm-s-5); padding: var(--pm-s-5); border-radius: var(--pm-r-lg); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); }
.nx-stats .nx-stats-activity .nx-section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--pm-s-4); }
.nx-stats .nx-stats-activity .nx-h2 { margin: 0; font-size: var(--pm-fs-20); font-family: var(--pm-font-display); font-weight: 600; letter-spacing: -.035em; color: var(--pm-ink); }
.nx-stats .nx-stats-activity .nx-section-head .nx-hint { margin-top: 4px; font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-stats .nx-badges { display: flex; flex-wrap: wrap; gap: var(--pm-s-1); list-style: none; }
.nx-stats .nx-badge { display: flex; align-items: center; gap: var(--pm-s-1); min-height: 28px; padding: 0 12px; border: 1px solid var(--pm-line); border-radius: var(--pm-r-pill); background: var(--pm-surface-2); color: var(--pm-ink-3); }
.nx-stats .nx-badge small { font-size: var(--pm-fs-12); font-weight: 600; color: inherit; }
.nx-stats .nx-badge.is-earned { background: var(--pm-accent-soft); border-color: var(--pm-accent-soft); color: var(--pm-accent); }
.nx-stats .nx-activity-chart { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: var(--pm-s-3); align-items: end; height: 144px; margin-top: var(--pm-s-4); }
.nx-stats .nx-activity-day { display: flex; flex-direction: column; align-items: center; gap: 12px; height: 100%; min-width: 0; }
.nx-stats .nx-activity-bar-wrap { flex: 1; width: 64px; max-width: 100%; border-radius: var(--pm-r-sm); background: var(--pm-surface-2); overflow: hidden; }
.nx-stats .nx-activity-bar { width: 100%; border-radius: var(--pm-r-sm); background: var(--pm-ink-3); }
.nx-stats .nx-activity-day:last-child .nx-activity-bar.has-data { background: var(--pm-accent); }
.nx-stats .nx-activity-day small { font-size: var(--pm-fs-12); font-weight: 600; color: var(--pm-ink-3); font-variant-numeric: tabular-nums; }
@media (max-width: 900px) {
  .nx-stats .nx-stats-activity { padding: var(--pm-s-4); }
  .nx-stats .nx-activity-chart { gap: var(--pm-s-1); height: 128px; }
  .nx-stats .nx-activity-bar-wrap { width: 48px; }
}
@media (max-width: 620px) {
  .nx-stats .nx-stats-activity { padding: 20px; }
  .nx-stats .nx-stats-activity .nx-section-head { flex-direction: column; gap: var(--pm-s-3); }
  .nx-stats .nx-activity-chart { gap: 4px; height: 112px; }
  .nx-stats .nx-activity-bar-wrap { width: 32px; }
}
@media (max-width: 420px) { .nx-stats .nx-activity-chart { height: 96px; } .nx-stats .nx-activity-bar-wrap { width: 24px; } .nx-stats .nx-activity-day { gap: var(--pm-s-1); } }
```

## D10. "Applied" journal layout

**Decision:** full-width panel 32px below the activity panel, radius 24, padding 32/24/20. Head row: icon + 20px title + 13px hint left, neutral "N yozuv" chip right. Filter row is 24px below head and **wraps**; timeline is 24px below the filter. Timeline items use a 12px accent dot and a neutral surface-2 body — the dot is the only accent in the journal. Empty state keeps a single filled primary CTA (the sole focal action **only in that state**).

| Element | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Panel padding | 32 | 24 | 20 | 20 |
| Head title / hint | 20 / 13 | 20 / 13 | 18 / 13 | 18 / 12 |
| Head→filter / filter→timeline | 24 / 24 | 24 / 24 | 16 / 16 | 16 / 16 |
| Segment h / font | 36 / 13 | 36 / 13 | 32 / 12 | 32 / 12 |
| Timeline item gap / pb | 16 / 24 | 16 / 24 | 12 / 16 | 12 / 16 |
| Dot / body radius / body padding | 12 / 10 / 16 | 12 / 10 / 16 | 12 / 10 / 12 | 12 / 10 / 12 |
| Entry text / chip | 14 / 12 | 14 / 12 | 14 / 12 | 14 / 12 |

```
JOURNAL @1440 — 1344 wide
┌──────────────────────────────────────────────────────────────┐
│ ⚶ "Men qo‘lladim" jurnali                    [ 0 yozuv ]     │
│   Hayotda sinab ko‘rgan qoidalaringiz                        │
│ [Barchasi][ish][oila][do‘stlik][o‘qish][shaxsiy]             │
│  ●  ┌────────────────────────────────────────────────────┐   │
│     │ Qoida matni                            14/600       │   │
│     │ [ish] [12.11.2026] izoh                             │   │
│     └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

```css
.nx-stats .nx-journal { margin-top: var(--pm-s-5); border-radius: var(--pm-r-lg); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); }
.nx-stats .nx-journal .nx-panel__head { display: flex; align-items: center; justify-content: space-between; gap: var(--pm-s-4); padding: var(--pm-s-5); border-bottom: 1px solid var(--pm-line); }
.nx-stats .nx-journal__title { gap: var(--pm-s-1); }
.nx-stats .nx-journal__title svg { color: var(--pm-ink-3); }
.nx-stats .nx-journal .nx-h2 { margin: 0; font-size: var(--pm-fs-20); font-family: var(--pm-font-display); font-weight: 600; letter-spacing: -.035em; color: var(--pm-ink); }
.nx-stats .nx-journal .nx-hint { font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-stats .nx-journal .nx-panel__body { padding: var(--pm-s-5); }
.nx-stats .nx-journal .nx-filter-row { display: flex; flex-wrap: wrap; gap: var(--pm-s-1); margin-bottom: var(--pm-s-4); padding: 4px; border-radius: var(--pm-r-sm); background: var(--pm-surface-2); }
.nx-stats .nx-journal .nx-segmented button { min-height: 36px; padding: 0 12px; border-radius: var(--pm-r-sm); font-size: var(--pm-fs-13); color: var(--pm-ink-3); }
.nx-stats .nx-journal .nx-segmented button[aria-pressed='true'] { background: var(--pm-surface); color: var(--pm-ink); box-shadow: var(--pm-shadow-1); }
.nx-stats .nx-timeline__item { gap: var(--pm-s-3); padding-bottom: var(--pm-s-4); }
.nx-stats .nx-timeline__dot { width: 12px; height: 12px; background: var(--pm-accent); box-shadow: 0 0 0 4px var(--pm-accent-soft); }
.nx-stats .nx-timeline__body { padding: var(--pm-s-3); border-radius: var(--pm-r-sm); background: var(--pm-surface-2); }
.nx-stats .nx-timeline__body b { font-size: var(--pm-fs-14); font-weight: 600; line-height: 1.5; margin-bottom: var(--pm-s-1); color: var(--pm-ink); }
.nx-stats .nx-journal__meta { gap: var(--pm-s-1); flex-wrap: wrap; }
.nx-stats .nx-journal .nx-empty { padding: var(--pm-s-7) var(--pm-s-4); text-align: center; }
.nx-stats .nx-journal .nx-empty__icon { width: 48px; height: 48px; margin: 0 auto var(--pm-s-3); border-radius: var(--pm-r-pill); background: var(--pm-accent-soft); color: var(--pm-accent); }
@media (max-width: 900px) {
  .nx-stats .nx-journal .nx-panel__head, .nx-stats .nx-journal .nx-panel__body { padding: var(--pm-s-4); }
}
@media (max-width: 620px) {
  .nx-stats .nx-journal .nx-panel__head, .nx-stats .nx-journal .nx-panel__body { padding: 20px; }
  .nx-stats .nx-journal .nx-h2 { font-size: var(--pm-fs-18); }
  .nx-stats .nx-journal .nx-panel__head { flex-wrap: wrap; }
  .nx-stats .nx-journal .nx-filter-row { margin-bottom: var(--pm-s-3); }
  .nx-stats .nx-journal .nx-segmented button { min-height: 32px; font-size: var(--pm-fs-12); }
  .nx-stats .nx-timeline__item { gap: 12px; padding-bottom: var(--pm-s-3); }
  .nx-stats .nx-timeline__body { padding: 12px; }
}
```

## D11. Bottom panels and Stats focal/demotion map

**Decision:** the two bottom panels are a 2-column band at ≥620 and a single column below, 24px gap desktop / 16 or 12 below. Progress fills become neutral ink-3 so they do not compete with the activity chart; next-step icons become ink-3. The **attention centre on Stats is the profile hero** (largest surface, name 30px, only gradient). Export stays a quiet ghost. When the journal is empty, its single filled CTA temporarily becomes the only filled action on the screen.

| Element | Current | Decision |
|---|---|---|
| Profile hero | 140px, 64 ring, gradient blob under name | **KEEP — focal band**; 144px, gradient moved right of text |
| Stat card colours | accent / sage / warn fills | neutral surface + ink values |
| Hero progress ring | accent arc | neutral arc, caption 12 ink-3 |
| Activity bars | accent→warn gradient, ~160px wide | neutral ink-3, 64px, only last bar accent |
| Earned badges | warn-soft fill | accent-soft, 28px, small |
| Progress rows bottom | accent fill | ink-3 fill, 4px h |
| Export | ghost 44 | keep ghost; no filled state |

```css
.nx-stats .nx-stats-bottom { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--pm-s-4); margin-top: var(--pm-s-5); align-items: start; }
.nx-stats .nx-stats-bottom .nx-panel { padding: var(--pm-s-4); border: 0; border-radius: var(--pm-r); background: var(--pm-surface); box-shadow: var(--pm-shadow-1); }
.nx-stats .nx-stats-bottom .nx-h3 { font-size: var(--pm-fs-18); font-weight: 700; color: var(--pm-ink); }
.nx-stats .nx-stats-bottom .nx-progress--inline { width: 88px; height: 4px; border-radius: var(--pm-r-pill); background: var(--pm-surface-2); }
.nx-stats .nx-stats-bottom .nx-progress--inline > span { border-radius: var(--pm-r-pill); background: var(--pm-ink-3); }
.nx-stats .nx-next-step__row { gap: var(--pm-s-2); padding: 12px 0; border-bottom: 1px solid var(--pm-line); }
.nx-stats .nx-next-step__row > svg { color: var(--pm-ink-3); }
.nx-stats .nx-next-step__row p { font-size: var(--pm-fs-14); color: var(--pm-ink-2); }
@media (max-width: 900px) { .nx-stats .nx-stats-bottom { gap: var(--pm-s-3); } }
@media (max-width: 620px) { .nx-stats .nx-stats-bottom { grid-template-columns: minmax(0, 1fr); gap: 12px; } }
```

---

## D12. Breakpoint master table (both screens)

| Region | 1440 | 900 | 620 | 375 |
|---|---|---|---|---|
| Content width | 1344 | 852 | 580 | 343 |
| Section rhythm | 32 | 32 | 32 | 24 |
| Repeat main columns | 2 × 660 | 2 × 414 | 1 × 580 | 1 × 343 |
| Session card padding / layout | 24 / row | 24 / column | 20 / row | 20 / column |
| Queue list max-height | 384 | 384 | 320 | 288 |
| Interval cards | 5 × 243 | 5 × 144 | 5 × 101 | 3 × 95 |
| Stats hero height | 144 | 128 | ≥112 | ≥112 |
| Stat row | 4 × 318 | 2 × 418 | 2 × 284 | 2 × 167 |
| Chart bar width | 64 | 48 | 32 | 24 |
| Journal / bottom columns | full / 2 | full / 2 | full / 1 | full / 1 |

All column widths derive from `(content − (n−1)·gap) / n` with the gaps in D1/D8/D9; all vertical values are multiples of 8 (`--pm-s-*`) except 12px half-steps and 24px micro-chips, which the token set defines.

## D13. CSS-only feasibility — findings and requests

1. **Ring diameter is inline JSX** (`NxUI.tsx` line 22). I kept 96 / 64 and demoted by colour. Request to the TSX owner (not this agent): accept a `size` override so Repeat can use 72 and Stats 56 if the team wants smaller rings. No CSS change is needed for the decisions above.
2. **Eyebrow casing** is uppercased by the legacy header layer; the spec forbids ALL CAPS labels. Belongs to the page-header agent — coordinate, do not patch here.
3. **Queue "kechikkan" chip** is a meaningful status: keep it in `--pm-accent-soft` / `--pm-accent` (one small coloured area), do not make it neutral.
4. **Dark mode**: every declaration uses `--pm-*`, so the demotion logic is inherited. No literal colours introduced.

## D14. Verification checklist for the implementer

- At 1440, the only filled `--pm-accent` rectangle on Repeat is the 48px CTA; on Stats there is none (ghost Export only) unless the journal empty state is shown.
- Session card left/right edges align exactly with the queue card and the "how it works" panel at all four widths.
- Stat tile and chart column edges align to the same 1344 / 852 / 580 / 343 content box as the hero.
- No horizontal scrollbar at 375; interval grid becomes 3 columns; stat row becomes 2 columns.
- Focus ring (`2px --pm-accent`, offset 3px) survives on the CTA, segmented buttons, queue-more and Export.
- `prefers-reduced-motion` keeps the existing no-transition rule for bars and page-entry animation.
