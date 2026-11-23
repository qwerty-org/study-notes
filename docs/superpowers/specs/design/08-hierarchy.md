# 08 — Information Hierarchy & Density (Design Lead decision)

> Single source of truth for **visual weight** on the five Wave-3 screens. Element agents implement these decisions; they do not re-decide them.
> Spec: `docs/superpowers/specs/2026-11-23-premium-design-system.md` · Tokens: `apps/desktop/src/styles/premium/00-tokens.css`.
> Provenance note: the referenced `after-dashboard.png / after-library.png / after-stats.png / after-settings.png / after-repeat.png` were **not present in the workspace** at decision time. Decisions below were derived from the shipped TSX (`pages/Dashboard.tsx`, `Library.tsx`, `Stats.tsx`, `Settings.tsx`, `Repeat.tsx`) and the premium spec. If the screenshots differ from source, source wins.

---

## 0. Global ladder — applies to every screen

| Level | Element | Size | Colour | Treatment |
|---|---|---|---|---|
| **Focal** | The one primary action of the screen | 48px tall (56px only on Repeat "Boshlash"), padding `0 24px`, radius 12px, 14px/700 Manrope (Repeat: 16px/700) | bg `--pm-accent`, text `#FFF` (dark: `--pm-ink`) | **Exactly one `--pm-accent` filled control per screen.** Subtle 1px inner bottom shade. No icon after text; icon may precede. |
| **Primary** | Page title (`h1`) | 40px/600 Fraunces, `letter-spacing:-0.035em` | `--pm-ink` | Top-left, margin-bottom 32px. This is the typographic landmark, never the click target. |
| **Primary** | Eyebrow above title | 12px/700 Manrope, `letter-spacing:0.08em` | `--pm-accent` | Sentence case. No ALL CAPS. |
| **Secondary** | Section head (`h2/h3`, `.nx-h2`, `.section-head h3`) | 20px/600 Fraunces (card heads 18px/700 Manrope) | `--pm-ink` | 16px gap to its content. No chip in the head unless it carries live status. |
| **Secondary** | Body / primary reading text | 16px/500 Manrope, line-height 1.5, max 66ch | `--pm-ink-2` | The only place for paragraphs. |
| **Secondary** | Row titles, field values, labels | 14px/600/700 Manrope | `--pm-ink` | 600 for list rows, 700 for active nav / form titles. |
| **Tertiary** | Sub-lines (`small`, `.nx-hint`) | 13px/500 Manrope | `--pm-ink-2` (true hints: `--pm-ink-3`) | One sub-line per row. Never two stacked grey lines. |
| **Tertiary** | Chips / kbd / counts | 12px/600 Manrope (kbd 11px) | `--pm-ink-2` on `--pm-surface-2`; active: `--pm-accent` on `--pm-accent-soft` | Max **two** chips per visual group. Chips are state, not decoration. |
| **Chrome** | Nav items, ghost buttons, segmented controls | 14px/600 (segmented 13px/600) | `--pm-ink-3`; active `--pm-ink` + 2px `--pm-accent` underline | Ghost buttons: 44px tall, 1px `--pm-line`, transparent. |
| **Chrome** | Progress fill / active track | 3–6px bar, radius 999px | fill `--pm-accent`, track `--pm-surface-2` | Accent is allowed here because it encodes ongoing state. One progress representation per object. |

**Global rules (non-negotiable):**
1. One accent-filled button. One circular progress element maximum, and only if a linear bar is not also present.
2. A number never appears twice in the same visual group (no ring + bar + chip + label all saying `34%`).
3. A chip may not contain a link. "Batafsil / Barchasi / Yana" are plain 13px text links.
4. Grey text (`--pm-ink-3`) is reserved for ≥12px and secondary context only — never for row titles.
5. Empty states replace a screen's content. They never coexist with the controls they replace.

---

## 1. Dashboard (`pages/Dashboard.tsx` → `12-…16-*.css`)

### Focal point
**`Davom ettirish` → "O'qishni Davom ettir" button.** 48px tall, full width of the resume card, `--pm-accent` fill, white 14px/700 Manrope, radius 12px, `0 24px` padding, arrow icon permitted **before** the label. It is the only filled accent control on the page. Its host card is the one elevated surface on the page: radius 24px, padding 32px, `--pm-shadow-2`; all other cards use radius 16px, padding 24px, `--pm-shadow-1`. The eye must find the resume action before reading any stat.

### Hierarchy ladder

| Element | Level | Size | Colour | Treatment |
|---|---|---|---|---|
| `h1` "Salom, {name}" | Primary | 40px/600 Fraunces, -0.035em | `--pm-ink` | Typographic anchor; avatar glyph sits inline, does not become a second 64px avatar. |
| Resume book title `h2` | Primary | 20px/600 Fraunces | `--pm-ink` | Only title allowed above 18px in a card. |
| "Bugungi reja" / "Tezkor amallar" `h3` | Secondary | 18px/700 Manrope | `--pm-ink` | No header chip. |
| Greeting subtitle (due count) | Secondary | 16px/500, max 66ch | `--pm-ink-2` | One sentence only. Carries the due-review count. |
| Todo titles / quick-action titles / book-row titles / journal idea | Secondary | 14px/600 Manrope | `--pm-ink` | Single line, ellipsis at 2 lines max. |
| Situation text (`.situation`) | Secondary | 16px/500, lh 1.5 | `--pm-ink-2` | Reading copy, max 66ch. |
| Todo / action sub-lines | Tertiary | 13px/500 | `--pm-ink-2` | 8px gap under title. |
| Hints ("O'qish → takrorlash → qo'llash") | Tertiary | 12px/500 | `--pm-ink-3` | One line, only when it adds information. |
| "Kunlik halqa" eyebrow | Chrome | 12px/700, .08em | `--pm-accent` | Sentence case. |
| Streak chip (hero, only chip kept) | Tertiary | 12px/600, h28 | `--pm-accent` on `--pm-accent-soft` | The one status chip on the page. |
| "Batafsil / Barchasi" links | Chrome | 13px/600 | `--pm-ink-2` | Plain text link + 14px chevron. No chip. |

### Density decisions

| Problem | Verdict | Exact remedy |
|---|---|---|
| Hero Ring 80px + resume bar + library-row bars = three progress readings | **Too dense / duplicated** | Delete hero `.hero-goal` Ring entirely. Hero keeps greeting + subtitle + one streak chip. |
| Hero chips: streak + "N bob o'qildi" + "Quiz N%" | **Too dense** | Delete chapters and quiz chips; both are stats on `/natijalar`. |
| "Umumiy ko'rsatkichlar" 4-stat card duplicates hero chips, library count and journal count | **Too dense** | Delete the whole card. Put "Natijalarim →" as a 13px text link under the greeting. |
| Resume card: chip "Davom ettirish" + chip "34%" + ProgressBar + button label | **Too dense** | Delete the `34%` chip. Keep the eyebrow-style "Davom ettirish" label + one bar. |
| Header chips on Kutubxonam / Oxirgi faoliyat | **Too dense** | "Barchasi" → plain link. "{n} ta jami" → 12px `--pm-ink-3` text, not a chip. |
| "Tezkor amallar" has 4 tiles incl. Takrorlash, which is also a daily-plan row | **Too dense** | Drop the Takrorlash tile → 3 tiles in a 3-column row (2×2 on ≤900px), each min-height 88px. |
| After deletions, "Bugungi reja" could look empty | **Too sparse risk** | Todo rows min-height 56px, 16px gaps, check icon in a 28px `--pm-surface-2` circle. Rows carry the weight. |
| "AI holati" / "Oxirgi faoliyat" stretched to match tall sibling | **Too sparse risk** | `align-self:start`; height = content. Do not backfill with filler cards. |
| "Kutubxonam" renders 5 rows with <3 books | **Too sparse risk** | Render only real rows; if <2 books, add one 13px `--pm-ink-3` line, not 3 empty rows. |

### Delete / merge (decisive)
1. Delete `.hero-goal` (Ring + "joriy kitob progressi").
2. Delete hero `chip-green` (bob) and `chip-primary` (quiz).
3. Delete the "Umumiy ko'rsatkichlar" card + its `grid-2` stats.
4. Delete the resume `34%` chip and the secondary "AI tahlilini boshlash" button when `analysis` exists (not a second CTA — make it a 13px text link under the primary).
5. Demote "Batafsil", "Barchasi", "{n} ta jami" from chips to text.
6. Remove Takrorlash from quick actions; hero subtitle already carries the count.

### First impression
*"A calm good-morning with exactly one obvious next step — keep reading — and no dashboard noise competing for the click."*

---

## 2. Library (`pages/Library.tsx` → `17-…20-*.css`)

### Focal point
**The dropzone `.nx-dropzone` as a single large target** — min-height 160px, radius 24px, `--pm-surface` on `--pm-bg`, 1px `--pm-line` (dashed only on drag-over), padding 32px. Inside it: 48px upload icon in a 72px `--pm-accent-soft` circle, title "Kitoblarni bu yerga tashlang" 20px/700 `--pm-ink`, sub 14px/500 `--pm-ink-2`, and **one** 48px `--pm-accent` button "Fayl tanlash" (14px/700, white). This is the only filled accent button on the screen.

### Hierarchy ladder

| Element | Level | Size | Colour | Treatment |
|---|---|---|---|---|
| `h1` "Kutubxonang" | Primary | 40px/600 Fraunces, -0.035em | `--pm-ink` | With 12px `--pm-accent` eyebrow above. |
| Dropzone title | Primary | 20px/700 Manrope | `--pm-ink` | Centred in panel; 8px to sub, 24px to button. |
| "Kitoblar" section head | Secondary | 20px/600 Fraunces | `--pm-ink` | Search + view toggle on the right, 8px gap. |
| Stat summary line (replaces stat grid) | Secondary | 14px/500 | `--pm-ink-2` | "12 kitob · 3 o'qilmoqda · 2 tugatilgan" — one line under subtitle. |
| Book card titles / filter buttons | Secondary | 16px/700 (filters 14px/600) | `--pm-ink` | Active filter: `--pm-ink` + 2px `--pm-accent` underline. |
| Dropzone sub / book author line | Tertiary | 13px/500 | `--pm-ink-2` | Author + chapter count on one line: "Muallif · 12 bob". |
| Dropzone note (PDF/EPUB) | Tertiary | 12px/500 | `--pm-ink-3` | One line, max 72ch. |
| Status chip on card (max 1) | Tertiary | 12px/600, h28 | `--pm-sage` on `--pm-sage-soft` (ready); `--pm-brass` on `--pm-brass-soft` (pending) | The only chip per card. |
| Progress % on card | Tertiary | 13px/700 tabular | `--pm-ink-2` | Right of bar; bar+number is complementary, not duplicate. |
| Header "Kitob qo'shish" | Chrome | 44px tall, 14px/600 | `--pm-ink-2` on transparent, 1px `--pm-line` | Ghost — intentionally quieter than the dropzone button. |
| Grid/list toggle, search | Chrome | 16px icon, 14px input | `--pm-ink-3`; active `--pm-ink` | 1px `--pm-line` input, 44px tall. |

### Density decisions

| Problem | Verdict | Exact remedy |
|---|---|---|
| 4-stat grid directly under header | **Too dense** + duplicates Stats | Delete `.nx-library-stats`; replace with the one 14px summary line. |
| Three add affordances: header button + dropzone + "Yana kitob qo'shish" tile | **Too dense / duplicated** | Delete the add tile. Header button → ghost. Dropzone button stays the only accent. |
| Book card: 2 chips + title + author + bar + % | **Too dense** | Keep 1 chip (analysis state); move "12 bob" into the author line. |
| Filter row: 4 labels, each with a count | **Too dense** | Counts shown on the active filter only; inactive labels are plain 14px text. |
| Empty library shows header + dropzone + filters + empty state all saying "add" | **Too dense + duplicated** | When `library.length === 0`: render **only** the empty state (48px icon in `--pm-accent-soft` circle, 20px title, 14px text, one 48px accent button). Hide dropzone, filters, section head, summary line. |
| 1–2 books in a 4-column grid | **Too sparse** | Use 2 columns at ≤900px and auto-fit 220–280px columns at 1440px; never render empty grid slots. Cover height capped at ~180px. |
| Cover gradients use 6 saturated hues | **Content, but noisy** | Covers are artwork (exempt from the 2-colour UI rule) but reduce to 3 low-chroma pairs (terracotta / sage / brass) and keep cover ≤30% of card area. |

### Delete / merge
1. Delete `.nx-library-stats` grid.
2. Delete `.nx-book-add` tile.
3. Header primary → ghost (44px).
4. Book cards: 2 chips → 1.
5. Filter counts → active only.
6. Empty state becomes exclusive content.

### First impression
*"A tidy private shelf — calm, paper-like, with one generous place to drop a book and nothing else asking for attention."*

---

## 3. Stats (`pages/Stats.tsx` → `29-stats.css`)

### Focal point
**The "Qo'llangan qoida" value (`applyLog.length`).** 54px/600 Fraunces, `tabular-nums`, `--pm-ink`, with "Qo'llangan qoida" 13px/600 `--pm-ink-2` above and "kunlik maqsad: 1 ta" 12px `--pm-ink-3` below. It lives top-left of `.nx-stats-hero`, replacing the Ring. It is the largest number on the page; every other stat value is 24px. This matches the page's own promise: *"o'qiganingiz emas, qo'llaganingiz"*.

### Hierarchy ladder

| Element | Level | Size | Colour | Treatment |
|---|---|---|---|---|
| Focal "Qo'llangan qoida" number | Focal | 54px/600 Fraunces, tabular | `--pm-ink` | Label 13px/600 above, hint 12px below. No icon. |
| `h1` "Natijalarim" | Primary | 40px/600 Fraunces, -0.035em | `--pm-ink` | 12px `--pm-accent` eyebrow above. |
| "So'nggi 7 kun" / journal head | Secondary | 20px/600 Fraunces | `--pm-ink` | No chip in the head. |
| Profile name (hero) | Secondary | 20px/600 Fraunces | `--pm-ink` | Beside a 40px avatar (not 64px). |
| Other stat values (accuracy, streak, chapters) | Secondary | 24px/700 tabular Manrope | `--pm-ink` | Labels 13px/600 `--pm-ink-2`; hints 12px `--pm-ink-3`. |
| Journal entry titles / next-step copy | Secondary | 14px/600 / 14px/500 | `--pm-ink` / `--pm-ink-2` | Max 66ch. |
| Chart caption / interval steps | Tertiary | 13px/600 tabular | `--pm-ink-2` | 1px `--pm-line` dot connectors. |
| Badge labels (earned only, ≤3) | Tertiary | 12px/600 | `--pm-brass` on `--pm-brass-soft` | No emoji; one glyph max. Unearned badges are hidden. |
| Journal meta (date only) | Tertiary | 12px/500 | `--pm-ink-3` | One line per entry. |
| Context filter buttons | Chrome | 13px/600 | `--pm-ink-3`; active `--pm-ink` + 2px `--pm-accent` | Show only contexts that exist in data. |
| Eksport button | Chrome | 44px ghost, 14px/600 | `--pm-ink-2`, 1px `--pm-line` | Top-right of header. |

### Density decisions

| Problem | Verdict | Exact remedy |
|---|---|---|
| Hero Ring 64px "o'rtacha progress" duplicates per-book progress | **Too dense** | Delete the Ring. Hero = avatar + name + focal number. |
| Hero subtitle "N kunlik iz · M kitob · K tugatilgan" | **Duplicated** | Delete; streak/books/finished already live in stat cards / Library. |
| 4 stat cards × (icon + label + value + hint) | **Too dense** | Focal card has no icon; remaining 3 cards drop their 16px icons → label/value/hint only. |
| 4 badges in activity head, half unearned | **Too dense** | Move earned-only badges (≤3) to one row under the chart; hide unearned entirely. |
| Journal filter: 6 contexts regardless of data | **Too dense** | "Barchasi" + only contexts present in `applyLog` (max 4). Hide row if none. |
| Journal entries carry up to 3 chips (context / date / note) | **Too dense** | Keep date as 12px text. Context → 13px prefix in title line, note → 13px `--pm-ink-2` third line only when present. |
| "Keyingi qadam" panel = advice repeated from Repeat/Library | **Delete** | Remove the entire `.nx-stats-bottom` right panel. |
| "Kitoblar progressi" panel duplicates Library | **Delete** | Remove the entire panel; per-book progress belongs on Library. |
| 7-day chart with all zero counts | **Too sparse / misleading** | Replace 7 identical 8% bars with one 13px `--pm-ink-3` line: "Hali qo'llash yo'q — birinchi qoidani sinab ko'ring." |
| Journal with 1–2 entries | **Too sparse** | Render real entries only + one 13px link to Library; no 30-slot placeholder. |

### Delete / merge
1. Delete hero Ring and hero subtitle line.
2. Delete `.nx-stats-bottom` (both panels).
3. Delete unearned badges and badge emoji.
4. Delete stat-card icons (keep only focal clean).
5. Collapse journal chips to date-only; trim context filter.
6. Export stays (canonical backup lives in Settings; Stats export = share results) — not a duplicate.

### First impression
*"Quiet proof of momentum — one large number for what you actually applied, then the shape of your week, with no book stats re-listed."*

---

## 4. Settings (`pages/Settings.tsx` → `30-settings.css`)

### Focal point
**Contextual: the active section's single primary control, top-right of the right-hand panel.**
- **Profile (default):** the "Ismingiz" input — 48px tall, 16px/500 `--pm-ink`, `--pm-surface-2` fill, focus = 2px `--pm-accent` ring + 3px offset. No other accent on this tab.
- **AI:** "Saqlash" — 48px, `--pm-accent` fill, white 14px/700, radius 12px. "Ulanishni tekshirish" is ghost 44px.
- **Data:** "Eksport" ghost is the safe lead; the destructive button is **outline only** (`--pm-accent` text, 1px `--pm-line`, transparent), never filled.
- **About:** "Study Notes" wordmark 30px/600 Fraunces `--pm-ink`; no control.

### Hierarchy ladder

| Element | Level | Size | Colour | Treatment |
|---|---|---|---|---|
| Active-section primary control | Focal | 48px / 16px input or 14px/700 button | `--pm-accent` (button) / `--pm-ink` (input) | One per tab; 32px below panel head. |
| `h1` "Sozlamalar" | Primary | 40px/600 Fraunces, -0.035em | `--pm-ink` | 12px `--pm-accent` eyebrow above. |
| Panel head ("Profil va ko'rinish", "AI ulash"…) | Secondary | 24px/600 Fraunces | `--pm-ink` | 24px gap to first field. No icon needed in head. |
| Active nav item | Secondary | 14px/700 | `--pm-ink` on `--pm-accent-soft` | 2px `--pm-accent` left bar; hint line shown only here. |
| Field labels / setting-row titles | Secondary | 13px/700 / 14px/700 | `--pm-ink-2` / `--pm-ink` | 8px above control. |
| Body copy / about subtitle | Secondary | 14px/500, max 66ch | `--pm-ink-2` | Paragraph only. |
| Inactive nav labels, provider names | Tertiary | 14px/600 | `--pm-ink-3` | No hint lines. |
| Hints, nav footer, about fact labels | Tertiary | 12px/500 | `--pm-ink-3` | One line each. |
| Status chip (AI tab) | Tertiary | 12px/600 | `--pm-sage` on `--pm-sage-soft` when verified, else `--pm-ink-2` on `--pm-surface-2` | Max one chip. |
| Ghost / segmented / danger buttons | Chrome | 44px / 13px | `--pm-ink-2` on transparent, 1px `--pm-line` | Danger = outline accent, no fill. |

### Density decisions

| Problem | Verdict | Exact remedy |
|---|---|---|
| Nav: 4 items × (label + hint) = grey cluster | **Too dense** | Show hints **only on the active item**; inactive = label only. Nav width 240px, sticky, `--pm-surface`. |
| Avatar picker: 8 emoji in one row | **Too dense** | Show 6, each 44px, 8px gap; wrap 3×2 below 900px. |
| Placeholder rows "Interfeys tili" + "Takrorlash eslatmasi" | **Too dense / non-functional** | Delete both rows (language is self-evident; reminder is "coming soon"). |
| Profile tab: 5 stacked rows + trailing ghost link | **Too dense** | Split into two groups with 32px separation: "Siz" (name, avatar) / "Ko'rinish" (theme). |
| AI tab: provider grid shows name + freeHint for all 4 | **Too dense** | `freeHint` only for the active provider; others name only. Reserve 24px feedback min-height to prevent jump. |
| Data tab: 3 rows icon+title+hint+button | **Acceptable** | Keep, but separate the danger row with 1px `--pm-line` above + 24px gap. |
| Left column empty under 4 nav items at 1440px | **Too sparse risk** | Do **not** fill with cards. Leave breathing room; footer pinned bottom. Panel max-width 720px, content top-aligned. |
| About tab short | **Too sparse risk** | Keep height auto, never stretch to sibling height. |

### Delete / merge
1. Delete the two "coming soon" setting rows.
2. Nav hints → active only.
3. Avatar choices 8 → 6.
4. Provider hints → active only.
5. Header has no button (dropzone/ghost actions live inside panels) — avoid a second accent.
6. Danger action stays outline; never a second filled accent.

### First impression
*"A quiet control room — everything in its place, one clear thing to change per tab, and no red until you ask for it."*

---

## 5. Repeat (`pages/Repeat.tsx` → `28-repeat.css`)

### Focal point
**"Boshlash" button** — 56px tall (btn-lg), `--pm-accent` fill, white 16px/700 Manrope, radius 12px, `0 24px` padding, full width of the session card (min 240px), arrow icon before the label. Only filled accent control on the screen; the result banner and empty-state buttons follow the same rule (one at a time, mutually exclusive states).

### Hierarchy ladder

| Element | Level | Size | Colour | Treatment |
|---|---|---|---|---|
| "Boshlash" CTA | Focal | 56px, 16px/700 | `--pm-accent` / white | One orbit of 32px clear space; no chip attached. |
| Due count "12" (replaces Ring) | Primary | 54px/600 Fraunces, tabular | `--pm-ink` | "savol kutmoqda" 13px/500 `--pm-ink-2` beneath. |
| `h1` "Takrorlash" | Primary | 40px/600 Fraunces, -0.035em | `--pm-ink` | 12px `--pm-accent` eyebrow above. |
| Session title "N savol · M kitob" | Secondary | 20px/600 Fraunces | `--pm-ink` | Sits beside the count; 16px gap. |
| Schedule head, queue head | Secondary | 20px/600 Fraunces / 16px/700 Manrope | `--pm-ink` | No header chip. |
| Session subtitle / schedule intro | Secondary | 16px/500 / 14px/500, max 66ch | `--pm-ink-2` | Intro ≤2 sentences. |
| Queue question rows | Secondary | 14px/600 Manrope | `--pm-ink` | Two lines max; book name 13px `--pm-ink-2` below. |
| Interval steps, caption | Tertiary | 13px/600 tabular | `--pm-ink-2` | Dots 1px `--pm-line`. |
| "~N daq" chip (only chip in session) | Tertiary | 12px/600 | `--pm-ink-2` on `--pm-surface-2` | Time is the only useful chip. |
| Kechikkan label | Tertiary | 12px/600 | `--pm-accent` | Plain text, not a chip. |
| Keyboard hint | Chrome | 12px/500, kbd 11px | `--pm-ink-3` | One line under CTA. |
| "Yana N ta savol" / "Natijalarim" | Chrome | 13px/600 text link | `--pm-ink-2` | No chip, no button chrome. |

### Density decisions

| Problem | Verdict | Exact remedy |
|---|---|---|
| Ring 96px + schedule Bar + caption ratio | **Too dense / duplicated** | Delete the Ring; count becomes 54px Fraunces text. Ratio stays only in the schedule caption + bar. |
| Session chips: ~daq / streak / date | **Too dense** | Keep "~N daq". Streak → 13px line under subtitle. Delete date chip. |
| Queue rows: type chip + question + book + kechikkan chip | **Too dense** | Type → 12px `--pm-ink-3` prefix text; kechikkan → 12px `--pm-accent` text. Cap list at 5 rows. |
| Queue head chip "{n} ta" duplicates session count | **Duplicated** | Delete. |
| Schedule card: 3-sentence intro + lead + 5 steps + caption + bar + foot | **Too dense** | Cut intro to ≤2 sentences; delete the "To'g'ri javoblar ko'paygan sari…" lead line (redundant). Keep steps, caption, bar, one 12px foot line. |
| Result banner: icon + title + p + button + × | **Too dense** | Keep icon + title + p + ×; fold "Natijalarim" into the paragraph as a 13px text link. |
| Session card shorter than queue panel | **Too sparse risk** | 40/60 grid; both `align-self:start`; content vertically centred in session card. No filler. |
| 1–2 due questions | **Too sparse risk** | Shrink queue panel to content; no empty rows. |

### Delete / merge
1. Delete Ring → typographic count.
2. Delete date chip and queue head count chip.
3. Delete "kechikkan" chip → accent text.
4. Delete schedule lead line; shorten intro.
5. Fold result-banner button into text link.
6. Due count appears only twice: session number + schedule caption.

### First impression
*"A short, focused session — one large Start, a scannable queue, and just enough explanation to trust the spacing."*

---

## 6. Cross-screen duplication registry (decided)

| Data / element | Currently shown on | Keep only on | Action |
|---|---|---|---|
| Current-book progress ring/bar | Dashboard hero, resume card, library rows | Resume card + Library rows | Delete hero ring |
| Chapter count / quiz % chips | Dashboard hero, dashboard stat card, Stats | Stats | Delete hero chips + dashboard stat card |
| 4-number stat grid | Dashboard, Library, Stats | Stats (with focal promoted) | Delete on Dashboard & Library |
| Per-book progress list | Dashboard "Kutubxonam", Stats "Kitoblar progressi", Library | Library | Delete Stats bottom panel |
| "Keyingi qadam" advice | Stats, Repeat explanation, Dashboard todo | Repeat (explanation only) | Delete Stats panel |
| Apply-log count | Dashboard hero, status chip, journal preview, Stats | Stats focal | Keep preview on Dashboard, strip its chip |
| "Barchasi / Batafsil / Yana / Natijalarim" as chips/buttons | All five screens | — | Convert to 13px text links everywhere |
| "Kitob qo'shish" | Library header, dropzone, add tile, Dashboard action | Dropzone (focal) + quiet header ghost | Delete add tile; ghost header |
| Export | Stats, Settings | Both (different intents) | Keep |
| Theme/language controls | Settings only | Settings | Keep |

## 7. Forwarding map (element agent → decisions to apply)

| CSS file (agent) | Sections to honour |
|---|---|
| `12-dashboard-hero.css` | §1 focal context; delete hero ring & two chips; 40px greeting; one streak chip |
| `13-dashboard-loop.css` | §1 todo rows 56px / 16px gap / 18px head |
| `14-dashboard-actions.css` | §1 three quick actions, delete Takrorlash tile |
| `15-dashboard-stats.css` | §1 delete card entirely |
| `16-dashboard-secondary.css` | §1 resume card = shadow-2/r24/p32 + single accent CTA; demote header chips |
| `17-library-head.css` | §2 header ghost, summary line, eyebrow |
| `18-library-dropzone.css` | §2 focal dropzone 160px/r24, 48px icon circle, single accent button |
| `19-library-filters.css` | §2 text filters, active-only counts |
| `20-library-books.css` | §2 one chip, author+chapters line, capped cover, delete add tile |
| `28-repeat.css` | §5 all |
| `29-stats.css` | §3 all |
| `30-settings.css` | §4 all |
| `09-chips.css`, `08-buttons.css`, `07-page-header.css` | §0 global ladder; chips are state only; one 48px accent button per screen |

## 8. Risks / requests
- **No danger token exists.** Danger action uses `--pm-accent` text on transparent with 1px `--pm-line` — visually distinct from the single filled accent CTA. If a true `--pm-danger` is wanted, token agent must add it; do not introduce a literal colour.
- Screenshots were unavailable; if they show a different DOM than the TSX, re-check §1–§5 focal points before implementing.
- Dark mode: focal accent becomes `--pm-accent` (`#E69A6C`) with `--pm-ink` text; all size/weight decisions are unchanged.
