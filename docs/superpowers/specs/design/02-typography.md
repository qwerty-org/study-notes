# D02 — Typography decisions (typography lead)

> Forwarded to all element agents. These are **decisions**, not CSS. Implement with `--pm-*` tokens only.
> Basis: `2026-11-23-premium-design-system.md` §2/§5 and `premium/00-tokens.css`.
> Screenshots reviewed: `after-dashboard.png`, `after-book.png`, `study-notes-after.png`, `onboarding.png`.

---

## 0. Headline decisions (read this first)

1. **The scale does not change.** The "top is 54 but titles render ~40" problem was a *role-assignment* bug, not a token bug. `--pm-fs-54` is **kept and now explicitly assigned** to the one brand hero (onboarding left panel); page titles are `--pm-fs-40`. **`--pm-fs-24` stays reserved/unused** — do not invent a use for it.
2. **Two typefaces, two jobs.** Fraunces = display + long-form reading only. Manrope = every piece of UI chrome. Never mix them in one line.
3. **Hard floor is 12px everywhere.** No 10px or 11px text, including chips and kbd. Substantive meta moves to 13px; hints/labels sit at 12px in `--pm-ink-3`. If it does not fit at 12px, cut the copy — never shrink the type.
4. **Eyebrows are sentence case**, not ALL CAPS, with `+0.08em` tracking in `--pm-accent`.
5. **No trailing arrow glyph** in button labels. Arrow becomes a separate 18px icon.
6. **No middle dots** (`·`) in meta strings, and **no emoji inline in display type**.

### `--pm-fs-*` old → new

**No value changes.** Exact mapping: every token keeps its current value
(`12/13/14/16/18/20/24/30/40/54`). The only change is assignment:

| Token | Old status | New assignment |
|-------|-----------|----------------|
| `--pm-fs-54` | effectively dead, titles fell back to 40 | **Brand hero only** (onboarding headline, once per app) |
| `--pm-fs-40` | used ad-hoc for page title | **Page title** (canonical) |
| `--pm-fs-30` | mixed with 40 / inline greetings | Hero greeting, chapter title, KPI value |
| `--pm-fs-24` | unused | Reserved — **do not use** |
| `--pm-fs-12` | used for 10–11px lookalikes | Eyebrow, chip, hint, KPI label — **no smaller text exists** |

Do not write literal px for type sizes in element CSS. Use the token that matches the role.

---

## 1. Master role table

Colour column is the **default** token; alternates are noted. All line-heights are unitless with the computed px in parentheses.

### 1.1 Display & headings (Fraunces Variable)

| Role | Size / weight | Line-height | Tracking | Colour | Fraunces treatment |
|------|---------------|-------------|----------|--------|--------------------|
| Brand hero (onboarding, one per app) | 54 / 600 (line 2 italic) | 1.05 (57px) | −0.04em | `--pm-ink`; line 2 `--pm-brass` | `'opsz' 144, 'SOFT' 0, 'WONK' 0` |
| Page title | 40 / 600 | 1.08 (43px) | −0.035em | `--pm-ink` | `'opsz' 144, 'SOFT' 0, 'WONK' 0` |
| Hero greeting ("Salom, o'quvchi") | 30 / 600 | 1.15 (35px) | −0.03em | `--pm-ink` | `'opsz' 144, 'SOFT' 0, 'WONK' 0` |
| Chapter title (reader) | 30 / 600 | 1.15 (35px) | −0.03em | `--pm-ink` | `'opsz' 144, 'SOFT' 0, 'WONK' 0` |
| Empty-state title | 20 / 600 | 1.2 (24px) | −0.025em | `--pm-ink` | `'opsz' 72, 'SOFT' 0, 'WONK' 0` |
| Reading subheading | 20 / 600 | 1.25 (25px) | −0.02em | `--pm-ink` | `'opsz' 72, 'SOFT' 0, 'WONK' 0` |

**Fraunces rule:** weight is **600 for all display**, never 400/700/800. `font-optical-sizing: auto` as the base; for the 30/40/54px roles pin `'opsz' 144`. No `SOFT` above 0 and no `WONK` above 0 in display — the shape alone carries the character. Italic is allowed **only** on the onboarding brand-hero second line. Never use Fraunces below 18px except the reading column.

### 1.2 UI roles (Manrope Variable)

| Role | Size / weight | Line-height | Tracking | Colour token | Notes |
|------|---------------|-------------|----------|--------------|-------|
| Section title | 20 / 700 | 1.25 (25px) | −0.02em | `--pm-ink` | Group header, e.g. "Tezkor amallar" |
| Card title | 18 / 700 | 1.3 (23px) | −0.015em | `--pm-ink` | Standard content card |
| Compact tile title | 16 / 700 | 1.35 (22px) | −0.01em | `--pm-ink` | Small action tiles only |
| Subtitle (under title) | 16 / 500 | 1.5 (24px) | −0.005em | `--pm-ink-2` | One line, ≤72ch |
| **Body** | 14 / 500 | 1.55 (22px) | 0 | `--pm-ink` (cards: `--pm-ink-2`) | The reading floor |
| Row title | 14 / 600 | 1.4 (20px) | 0 | `--pm-ink` | List/setting rows |
| Nav item | 14 / 600 | 1.4 (20px) | 0 | `--pm-ink-3`; active `--pm-ink` | Active adds 2px `--pm-accent` underline |
| Button label (primary) | 14 / 700 | 1.2 (17px) | +0.01em | `#FFFFFF` on `--pm-accent` | Text only — no arrow glyph |
| Button label (ghost) | 14 / 700 | 1.2 (17px) | +0.01em | `--pm-ink-2` | Transparent, 1px `--pm-line` |
| **Secondary** | 13 / 500 | 1.5 (20px) | 0 | `--pm-ink-2` | Substantive meta, helper copy |
| Row meta | 13 / 500 | 1.45 (19px) | 0 | `--pm-ink-2` | Second line in a row |
| KPI value | 30 / 700 | 1.1 (33px) | −0.02em | `--pm-ink` | `tabular-nums` |
| Progress number | 20 / 700 | 1.2 (24px) | −0.01em | `--pm-ink` | `tabular-nums` |
| Eyebrow | 12 / 700 | 1.4 (17px) | **+0.08em** | `--pm-accent` | Sentence case — never ALL CAPS |
| Chip | 12 / 700 | 1 (centred in 28px) | +0.01em | `--pm-ink-2`; active `--pm-accent` | Sentence case; 12px floor |
| Hint / auxiliary meta | 12 / 500 | 1.45 (17px) | +0.005em | `--pm-ink-3` | Smallest text in the app |
| KPI label | 12 / 700 | 1.4 (17px) | +0.06em | `--pm-ink-3` | Sentence case — never ALL CAPS |
| Nav count badge | 12 / 700 | 1 (centred) | +0.02em | `#FFFFFF` on `--pm-accent` | `tabular-nums`; 6px gap from label |

**Manrope rule:** weight is 500 for running copy, 600 for nav/row titles, 700 for headings, buttons, chips, eyebrows. Default tracking is **0**; only eyebrows (+0.08em) and small-caps-style labels (+0.06em) go wide, and headings go slightly tight (down to −0.02em). Numbers/dates/progress use `font-variant-numeric: tabular-nums`.

### 1.3 Reading column (Fraunces Variable, 400 only)

| Role | Size / weight | Line-height | Tracking | Colour | Treatment |
|------|---------------|-------------|----------|--------|-----------|
| Reading lead (first paragraph) | 20 / 400 | 1.6 (32px) | −0.005em | `--pm-ink` | `'opsz' 18, 'SOFT' 20, 'WONK' 0` |
| Reading body | 18 / 400 | 1.7 (31px) | −0.003em | `--pm-ink` | `'opsz' 18, 'SOFT' 20, 'WONK' 0` |
| Reading caption / footnote | 12 / 500 | 1.45 (17px) | 0 | `--pm-ink-3` | **Manrope**, not Fraunces |

Fraunces 400 exists **only** in the reading column. It never appears in UI chrome.

---

## 2. Strict type-pairing recipes

Apply exactly; do not improvise spacing or add weights.

### 2.1 Eyebrow + title + subtitle (page/book header)
- **Eyebrow** — 12/700, `+0.08em`, `--pm-accent`, sentence case; optional 8px lead dash rendered as a separate `--pm-accent` rule, **not** a typed `—`.
- Gap eyebrow → title: **8px**.
- **Title** — 40/600 Fraunces, lh 1.08, `−0.035em`, `--pm-ink`. Single weight across the whole title; no coloured word.
- Gap title → subtitle: **8px**.
- **Subtitle** — 16/500 Manrope, lh 1.5, `--pm-ink-2`.
- Optional date/source line: 13/500 `--pm-ink-2` on its **own line**, comma-separated, never with `·`.
- Block bottom margin: **32px**.

### 2.2 Card header + body
- **Card title** — 18/700 Manrope, lh 1.3, `−0.015em`, `--pm-ink`.
- Gap title → meta: **8px**. **Meta** — 13/500 `--pm-ink-2`, lh 1.45.
- Gap meta → body: **12px**. **Body** — 14/500 `--pm-ink-2`, lh 1.55.
- Compact tile variant: title 16/700, meta 13/500, gap 8px. No body line.
- Rule: a card gets **one** title weight and at most **two** type sizes below it (13 + 14). No third grey size.

### 2.3 Row title + meta
- **Row title** — 14/600, lh 1.4, `--pm-ink`.
- Gap title → meta: **4px** (tight — they are one unit).
- **Meta** — 13/500, lh 1.45, `--pm-ink-2`. Hint-level detail may use 12/500 `--pm-ink-3` **only** if it is the sole second line.
- Row-to-row gap: **16px**. Icon 18px with **8px** gap to text; `currentColor`.
- Count badge sits 6px after the label, 12/700 `tabular-nums`. No `X (n)` inline text, no 11px superscript.

### 2.4 Chip
- 12/700, lh 1, `+0.01em`, height 28px, padding `0 12px`, radius `--pm-r-pill`.
- Rest: `--pm-surface-2` bg, `--pm-ink-2` text. Active: `--pm-accent-soft` bg, `--pm-accent` text.
- Sentence case. No ALL CAPS, no `·` inside, no emoji. One chip carries one short noun phrase (≤3 words).
- Chips never carry the only primary action — that belongs to a button.

### 2.5 Button
- **Primary** — label 14/700, `+0.01em`, lh 1.2; height 48px, padding `0 24px`, radius 12px, `--pm-accent` bg, white text.
- **Ghost/secondary** — same type; height 44px, transparent bg, 1px `--pm-line`, `--pm-ink-2` text.
- Label text is **verb-only** and ends with the word, never `→`, `›` or `>`. If direction is needed, add a separate 18px icon with 8px gap and `currentColor`.
- **Exactly one primary button per screen.**

---

## 3. Minimum legible sizes & tiny grey metadata

| Content class | Floor | Token colour | Rule |
|---------------|-------|--------------|------|
| Running body copy | **14px** | `--pm-ink` | No exceptions, including dense cards |
| Secondary / substantive meta | **13px** | `--pm-ink-2` | Dates, sources, descriptions, row meta |
| Hints, labels, chips, badges | **12px** | `--pm-ink-3` (labels) / `--pm-ink-2` (chips) | Smallest legal size in the product |
| Numbers in stat/progress roles | **20px** value, **12px** label | `--pm-ink` / `--pm-ink-3` | `tabular-nums`, sentence-case label |
| Anything below 12px | **banned** | — | No 10px, no 11px, no `font-size: .7em` derivations |

**What happens to the current tiny grey strings** (e.g. "PDF, EPUB yoki matn", "Study Notes (demo) · 31.10.2026 da qo'shildi", "JORIY KITOB PROGRESSI", "V0.1.0 · BEPUL VA OCHIQ KODLI", onboarding option sublines):

- Promote to **13px `--pm-ink-2`** if they carry information (format hints, option descriptions, dates, sources).
- Promote to **12px `--pm-ink-3`** if they are pure labels/hints ("Joriy kitob progressi", "Boblar").
- Remove middle dots: "Study Notes (demo), 31.10.2026 da qo'shildi"; "Bepul va ochiq kodli, v0.1.0" or stack as two lines.
- Never compensate for a long string by shrinking it. Shorten the string or let it wrap to two lines at 13px.
- `--pm-ink-3` is for **labels/hints only**. It must never carry substantive content.

---

## 4. Reading text refinement

- **Measure:** `max-width: 66ch` on the reading column (target 60–66ch). At 18px Fraunces, that is roughly 620–660px of text. The current wide reader card (~860px) must be constrained, not just centred.
- **Line-height:** 1.7 (31px) for 18px body; 1.6 (32px) for the 20px lead. Do not drop below 1.6 in the reader.
- **Paragraph spacing:** 24px between paragraphs (`margin-block-end: 24px`); **no `text-indent`**, no first-line indent. Reader card padding stays 24px (20px mobile).
- **First-paragraph treatment:** the first paragraph after a chapter/subheading is a **lead** — 20/400 Fraunces, lh 1.6, `--pm-ink`, sitting **12px** below the heading (tighter than the normal 24px paragraph gap) to bind heading and lead. Only the first paragraph; the rest return to 18/400. No drop cap, no coloured first word.
- **Heading rhythm:** 32px above chapter/subheadings, 16px below chapter title, 12px below subheading before the lead. 32px between reading sections, 16px inside a group. Reader heading sizes: chapter 30/600 Fraunces; subheading 20/600 Fraunces.
- **Voice:** running text is Fraunces 400, tracking −0.003em, `--pm-ink`. Italic only for genuine emphasis. No ALL CAPS, no coloured single words, no `tabular-nums` in prose. Captions/footnotes revert to Manrope 12/500 `--pm-ink-3`.

---

## 5. STOP list — habits to kill

1. **ALL CAPS eyebrows and labels** — `KUNLIK HALQA`, `KITOBNI O'QISH EMAS`, `1-QADAM`, `JORIY KITOB PROGRESSI`, `BOBLAR`, `TEZ O'RADA`, `TAVSIYA`, `V0.1.0 · BEPUL VA OCHIQ KODLI`. → Sentence case + `+0.08em` tracking; keep `--pm-accent` for the eyebrow only.
2. **Trailing arrow glyphs on buttons** — `O'qishni boshlash →`, `Davom etish →`, `Batafsil ›`. → Label only; separate 18px icon, 8px gap.
3. **Middle-dot meta strings** — `·` between source/date/version. → Comma or a separate line.
4. **Single-word colour accents inside headings or body** — one word switched to `--pm-brass`/`--pm-accent`, or a bold/coloured fragment in a title. → Banned. The **only** sanctioned coloured display emphasis is the onboarding brand-hero second line (`hayotida qo'llash`), kept as brass italic; do not replicate it on any other screen.
5. **10–11px grey text** — the cheap, hard-to-read layer. → 12px floor / 13px for substantive meta; shorten copy instead of shrinking.
6. **Emoji inline in display type** — `Salom, o'quvchi 🦊`. → Remove from the greeting; the mascot lives as its own image/avatar, never as a text glyph in a heading.
7. **Fraunces in UI chrome** — nav, chips, buttons, KPI labels, tab bars. → Fraunces is display + reading only; everything else is Manrope.
8. **Mixed weights on one line to fake hierarchy** (bold fragment + regular fragment in the same title). → One weight per line.
9. **Loose tracking on lowercase UI text** (> ±0.02em outside eyebrow/KPI labels). → Reset to 0; only headings go slightly tight.
10. **`--pm-ink-3` for real content** (option descriptions, format hints, dates). → Those are `--pm-ink-2` at 13px; reserve ink-3 for hints/labels at ≥12px.
11. **Inline tiny counts glued to nav labels** (`Xulosalar 12` as 11px text). → 12/700 `tabular-nums` badge with 6px gap.
12. **Literal font sizes** (`15px`, `11px`, `.7em`) and invented typefaces. → Use `--pm-fs-*` tokens and the two declared fonts only.

---

## 6. Quick self-check for element agents

- Is every size one of `12/13/14/16/18/20/30/40/54`? Is nothing below 12px?
- Is every display line Fraunces 600 and every UI line Manrope 500/600/700?
- Are eyebrows sentence case with `+0.08em`, and is there no `→` / `·` / emoji in text?
- Does the card/row follow its recipe's exact gaps (8/4/12/16/32)?
- Is the reader capped at 66ch with 1.7 line-height and a 20px lead?
