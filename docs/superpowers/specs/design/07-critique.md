# 07 — Design critique / decision log (Wave 3)

**Role:** D07 — Design Critic / Decision Lead.
**Governing law:** `docs/superpowers/specs/2026-11-23-premium-design-system.md` and `styles/premium/00-tokens.css`.
**Evidence reviewed (all of them):** `after-dashboard.png`, `after-library.png`, `after-book.png`, `after-repeat.png`, `after-stats.png`, `after-settings.png`, `study-notes-after.png` (onboarding), `mobile-dashboard.png`, `mobile-book.png`.

This document makes **decisions**, not suggestions. Element agents implement only inside their own `styles/premium/<element>.css`. Where a fix needs JSX (text swap, element removal, reorder), it is marked **[TSX-ESCALATE]** and must be reported to the lead — do not edit TSX yourself.

Global verdict: the app is currently a **competent admin dashboard**, not a premium editorial product. The typography foundation is good (Fraunces + Manrope exist, scale is mostly right) and the onboarding left panel proves the team can do premium. What destroys it is: borders and nested boxes on everything, ALL CAPS micro-labels, a 4-colour pastel palette, 11px grey text, gradients in non-hero panels, trailing arrow icons, and a mobile layout that was never re-composed.

---

## 1. Top 15 visual defects, ranked by impact

### D1 — ALL CAPS micro-labels on every screen (highest impact, global)
- **Screens:** all 9. Clear examples: "SHAXSIY TO'PLAM", "KUNLIK HALQA", "BUGUNGI SESSIYA", "SHAXSIY TARAQQIYOT", "SHAXSIY SOZLAMALAR", "1-QADAM", dashboard ring label "JORIY KITOB PROGRESSI", and stat-card labels "KITOB / BOB O'QILDI / QUIZ O'RTACHASI / QO'LLANMA".
- **Likely selector:** `.nx-eyebrow`, `.nx-eyebrow::before`, `.hero-goal small`, `.stat-head`/`.stat small`, `small`/`span` inside `.hero .ring`, `.nx-stats-hero__ring span`.
- **Symptom:** 11px, 800-weight, `letter-spacing: .16em`, uppercase, accent or muted. It reads like a form from 2014. It is the single most consistent "cheap" signal.
- **Exact correction:** `text-transform: none` everywhere; `.nx-eyebrow { font: 700 var(--pm-fs-12)/1.3 var(--pm-font); letter-spacing: .08em; color: var(--pm-accent); }`, keep `::before` as a 20×2px `var(--pm-accent)` rule. `.hero-goal small { font-size: var(--pm-fs-12); font-weight: 600; letter-spacing: 0; color: var(--pm-ink-3); }`. Stat labels: `var(--pm-fs-13)`, `var(--pm-ink-2)`, no tracking. All-caps product strings in UI copy ("JORIY KITOB PROGRESSI") **[TSX-ESCALATE]** → "Kitob progressi".

### D2 — Every card has a visible 1–1.5px border (global, "bordered pills" look)
- **Screens:** dashboard (worst), library, stats, settings, repeat.
- **Likely selector:** `.card` (`border: 1.5px solid var(--border); padding: 20px`), `.stat`, `.nx-stat`, `.nx-panel`, `.nx-dropzone` (dashed), `.todo-row` (1.5px), `.qaction` (1.5px), `.nx-queue__row`, `.nx-provider`, `.nx-onb-provider`.
- **Symptom:** the eye sees a wireframe of rectangles: card inside card inside card. Spec §4 explicitly bans this.
- **Exact correction:** `border: 0; background: var(--pm-surface); border-radius: var(--pm-r); padding: var(--pm-s-4); box-shadow: var(--pm-shadow-1);` Large panels use `--pm-r-lg` and `var(--pm-s-5)` padding. Dividers only where truly needed: `1px solid var(--pm-line)`. Mobile padding `var(--pm-s-3)`.

### D3 — Active nav is a bordered terracotta pill, not plain text with an underline
- **Screens:** dashboard/library/book/repeat/stats/settings (desktop) and both mobile shots.
- **Likely selector:** `.nav-item` (`padding`, `border-radius: 999px`, hover background), `.nav-item.active { background: var(--primary-soft); color: var(--primary-dark); }`, `.nav-badge`.
- **Symptom:** "Bosh sahifa" sits in a salmon-filled outline pill; the "5" badge is a bright solid circle with a drop shadow. Looks like a Bootstrap tab bar.
- **Exact correction:** `.nav-item { background: transparent; border: 0; border-radius: 0; padding: var(--pm-s-2) 0; font: 600 var(--pm-fs-14) var(--pm-font); color: var(--pm-ink-3); }`, `.nav-item.active { color: var(--pm-ink); background: transparent; }`, `.nav-item.active::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:var(--pm-accent); }`. Badge **only when item is `:not(.active)`**: `.nav-item:not(.active) .nav-badge { background: var(--pm-accent-soft); color: var(--pm-accent); box-shadow:none; min-width:18px; height:18px; font-size:var(--pm-fs-12); }`. Remove nav icons from labels at ≤480px (see D15).

### D4 — Four pastel icon tiles in "Tezkor amallar" = 4 colours on one screen
- **Screen:** dashboard.
- **Likely selector:** `.qaction`, `.qaction .qicon`, `.qicon.blue / .yellow / .purple`, `.qaction` border rule in `global.css` lines 750–807.
- **Symptom:** mint, salmon, amber and lavender rounded squares, each in a bordered tile. Palette rule (max 2 colours) is broken in the most visible spot.
- **Exact correction:** `.qaction { border:0; background:transparent; border-radius:var(--pm-r-sm); padding:var(--pm-s-3); }`, `.qaction:hover { background: var(--pm-surface-2); transform:none; }`. One icon recipe for all four: `.qaction .qicon { width:40px; height:40px; border-radius:var(--pm-r-sm); background:var(--pm-accent-soft); color:var(--pm-accent); }` — delete all `.tone` colour overrides. Title `var(--pm-fs-16)/700 var(--pm-ink)`, helper `var(--pm-fs-13) var(--pm-ink-2)`.

### D5 — "Bugungi reja" rows are bordered pills with dead grey check circles
- **Screen:** dashboard (+ mobile dashboard).
- **Likely selector:** `.todo-row` (`border:1.5px`, `border-radius:var(--r)`, `background:var(--card)`), `.todo-row .t-icon`, `.todo-row .t-check`, `.t-body small` (`text-overflow: ellipsis`).
- **Symptom:** three stacked outlined boxes with filled beige dots that look like disabled checkboxes; the subtitle is truncated mid-word ("kichik qadamlar bilan ka…") even on desktop.
- **Exact correction:** `.todo-row { border:0; border-bottom:1px solid var(--pm-line); border-radius:0; background:transparent; padding:var(--pm-s-3) 0; }` (first row gets no top divider). `.t-icon { width:40px; height:40px; border-radius:var(--pm-r-sm); background:var(--pm-surface-2); color:var(--pm-ink-2); }` (no green/yellow/blue variants). `.t-check { width:24px; height:24px; border-radius:var(--pm-r-pill); background:transparent; border:1px solid var(--pm-line-strong); color:transparent; }`, `.t-check:hover { color:var(--pm-accent); border-color:var(--pm-accent); }`. `.t-body small { white-space:normal; font-size:var(--pm-fs-13); color:var(--pm-ink-2); }` — remove ellipsis.

### D6 — Stat cards: "—" with a huge void, tiny caps labels, useless icons
- **Screens:** dashboard right column (4 stacked cards) and library/stats (4-card rows).
- **Likely selector:** dashboard `.grid.grid-2 .stat` / `.stat-head` / `.stat small`; `nx/stat` CSS: `.nx-stat`, `.nx-stats-grid .nx-stat { min-height:96px; padding:16px 20px; border-radius:12px; }`, `.nx-stat__hint { font-size:11px; }`, `styles/nx/foundation.css:587–645`.
- **Symptom:** the "QUIZ O'RTACHASI" card literally shows a large em-dash floating in an empty box; each card has a stray icon in the top-right, a 28–30px number and an 11px caps label, so most of the card is air with no information.
- **Exact correction:** no border, `background: var(--pm-surface-2)` (or surface with shadow-1), `padding: var(--pm-s-4)`, `min-height: 104px`, `border-radius: var(--pm-r)`. Remove decorative per-card icons from the layout [TSX-ESCALATE] or set `display:none` for `.stat-head` when it carries no data meaning. Label `var(--pm-fs-13) var(--pm-ink-2)` sentence case. Value `var(--pm-fs-30)/700 var(--pm-ink); font-variant-numeric: tabular-nums`. Hint `var(--pm-fs-12) var(--pm-ink-3)`. Replace "—" with "0" [TSX-ESCALATE] — CSS cannot author real content; if blocked, at least shrink the dash to `var(--pm-fs-24) var(--pm-ink-3)`.

### D7 — Dashboard hero: double gradient, border, 24px title, empty horizontal band
- **Screen:** desktop + mobile dashboard.
- **Likely selector:** `.hero` (`border:1.5px`, `radial-gradient(420px… var(--blue-soft))`, `linear-gradient(135deg, var(--primary-soft)…)`, `padding: var(--sp-6) 28px`), `.hero h1 { font-size: var(--fs-24) }`, `.hero-goal small`, `.hero .ring`, `.chip-amber/.chip-green/.chip-primary`.
- **Symptom:** a green-blue tint behind the avatar plus a pink wash on the right; "Salam, o'quvchi" is only ~24px while the card is 150px tall; the three chips use amber/green/blue; a wide empty band sits between the chips and the isolated "0% / JORIY KITOB PROGRESSI" cluster. On mobile this becomes a 380px-tall card with three chips stacked on separate lines.
- **Exact correction:** `border:0; border-radius:var(--pm-r-lg); padding:var(--pm-s-5); box-shadow:var(--pm-shadow-1); background: linear-gradient(110deg, var(--pm-surface) 65%, color-mix(in srgb, var(--pm-accent-soft) 35%, var(--pm-surface)))` — no blue layer. Title `var(--pm-fs-40)` desktop / `var(--pm-fs-30)` mobile, Fraunces 600, `-0.035em`. Chips all `var(--pm-surface-2) / var(--pm-ink-2)` except the single streak chip `var(--pm-accent-soft) / var(--pm-accent)`. Mobile: ring becomes `position:absolute; top:var(--pm-s-4); right:var(--pm-s-4); width:64px`; chips `flex-wrap:wrap; gap:var(--pm-s-1)` in ONE row; total hero height ≤ 280px. The fox emoji in the greeting **[TSX-ESCALATE]** — remove; keep one fox in the avatar at most.

### D8 — Trailing arrow icons on primary buttons (spec §2, explicit ban)
- **Screens:** book hero ("O'qishni boshlash →"), repeat ("Boshlash →"), onboarding ("Davom etish →"), dashboard, `BookTabs` ("Keyingi bob →").
- **Likely selector:** `.nx-btn--primary > svg:last-child`, `.nx-btn--primary` (flex row, gap 8), `IconArrowRight`.
- **Symptom:** a right-pointing arrow is glued to the end of the label, the universal "cheap SaaS CTA" tell.
- **Exact correction (CSS-only):** `.nx-btn--primary { gap: var(--pm-s-2); } .nx-btn--primary > svg:last-child:not(:first-child) { order: -1; }` — arrow moves in front of the text; buttons with a leading icon (Sparkles, Check) are unaffected. Also enforce spec recipe: `height:48px; padding:0 var(--pm-s-4); border-radius:12px; font:700 var(--pm-fs-14); background:var(--pm-accent); color:var(--pm-surface); box-shadow: inset 0 -1px 0 rgba(0,0,0,.12);` Hover `background:var(--pm-accent-hover)`.

### D9 — Two filled accent buttons on one screen (book)
- **Screen:** book, both desktop and mobile.
- **Likely selector:** `.nx-book-hero__action .nx-btn--primary` and `.nx-book-side .nx-btn--primary` / `styles/nx/book.css` around "Bolimni tugatim".
- **Symptom:** "O'qishni boshlash" and "Bobni tugatim" are both solid terracotta; the eye has two competing primary actions; spec demands exactly one.
- **Exact correction:** keep hero CTA as the only primary. Sidebar button → `.nx-btn--ghost`: `height:44px; background:transparent; border:1px solid var(--pm-line); color:var(--pm-ink-2); font-weight:600;`. The "Quiz ishlish" ghost beneath hero CTA stays ghost but reduce its border to `--pm-line` only.

### D10 — Stats "So'nggi 7 kun": seven solid grey placeholder blocks
- **Screen:** stats (largest single void in the app).
- **Likely selector:** `.nx-activity-bar-wrap` (`background: color-mix(in srgb, var(--nx-surface-2) 70%, transparent); border-radius:8px`), `.nx-activity-bar` (`background: var(--border-strong)`), `.nx-activity-day small { font-size:11px }`.
- **Symptom:** at zero data the chart renders seven identical beige blocks with darker feet — a skeleton that will never fill. It dominates the middle of the page and reads as broken, not "no data yet".
- **Exact correction:** zero state must not draw bars: `.nx-activity-bar-wrap { background: transparent; border-bottom: 1px solid var(--pm-line); border-radius:0; }`, `.nx-activity-bar { height:0; min-height:0; background:var(--pm-accent); border-radius:0; }`, `.nx-activity-bar.has-data { background:var(--pm-accent); }` (no gradient). Day labels `var(--pm-fs-12) var(--pm-ink-3)`. Preferred [TSX-ESCALATE]: when all counts are 0, render the existing `.nx-empty` block (48px icon in `--pm-accent-soft` circle, 20px title "Hali faoliyat yo'q", one line of `--pm-ink-2` text, one ghost action) instead of the chart.

### D11 — Stats hero: radial gradient circle, emoji avatar with coloured gradient + shadow, achievement chip parade
- **Screen:** stats.
- **Likely selector:** `.nx-stats-hero::after`, `.nx-stats-hero__avatar`, `.nx-badge` / `.nx-badge.is-earned`, `.nx-stat--success .nx-stat__value`, `.nx-stat--warn`, `.nx-stats-hero__ring span { font-size:11px }`.
- **Symptom:** a pink glow bleeds across the profile card; the fox sits in a terracotta→amber gradient tile with a coloured glow; "Birinchi qadam / 7 kunlik iz / 10 ta qo'lga / Quiz ustasi" adds four more chip colours; green "0%" and amber flame break the 2-colour rule.
- **Exact correction:** `.nx-stats-hero::after { display:none; }`. `.nx-stats-hero__avatar { width:56px; height:56px; border-radius:var(--pm-r-sm); background:var(--pm-accent-soft); color:var(--pm-accent); font-size:var(--pm-fs-30); box-shadow:none; }`. `.nx-badge { background:var(--pm-surface-2); color:var(--pm-ink-2); }`, `.nx-badge.is-earned { background:var(--pm-accent-soft); color:var(--pm-accent); }`. `.nx-stat--success .nx-stat__value, .nx-stat--warn .nx-stat__value { color: var(--pm-ink); }`. Ring caption `var(--pm-fs-12) var(--pm-ink-3)`, no caps.

### D12 — Library: dashed dropzone, duplicate primary CTA, and 2/3 of the page empty
- **Screen:** library.
- **Likely selector:** `.nx-dropzone` (dashed border), `.nx-dropzone__icon`, `.nx-dropzone__pick`, `.nx-head__actions .nx-btn--primary`, `.nx-book-grid`, `.nx-book-add`.
- **Symptom:** the drop area is a big dashed rectangle (form-builder aesthetic); "+ Kitob qo'shish" in the header duplicates the "Fayl tanlash" button inside it; the single book + add tile occupy the left third while the rest of the row is dead cream.
- **Exact correction:** `.nx-dropzone { border:0; background:var(--pm-surface); border-radius:var(--pm-r-lg); padding:var(--pm-s-6); box-shadow:var(--pm-shadow-1); }`, `.nx-dropzone__icon { width:48px; height:48px; border-radius:var(--pm-r-pill); background:var(--pm-accent-soft); color:var(--pm-accent); }`, title `var(--pm-fs-20)`, helper `var(--pm-fs-14) var(--pm-ink-2)`. Hide the duplicate header CTA at desktop [CSS: `.nx-library .nx-head__actions { display:none; }`] so the dropzone action is the screen's one primary. `.nx-book-grid { grid-template-columns: repeat(2, minmax(0,1fr)); max-width: 920px; gap:var(--pm-s-4); }` (1 column ≤620px) so cards fill the band.

### D13 — Settings: nested bordered boxes, 8 emoji tiles, empty right half, and a typo
- **Screen:** settings.
- **Likely selector:** `.nx-settings-content .nx-panel`, `.nx-panel__head`, `.nx-setting-row`, `.nx-avatar-picks`, `.nx-avatar-pick`, `.nx-input` (`max-width` unbounded), `.nx-settings-nav__foot`.
- **Symptom:** four inset beige rectangles live inside one big bordered panel; eight coloured emoji squares (fox/bear/owl/panda/koala/lion/fox/bunny) are the most childish element in the app; the right 45% of the panel is empty; footer reads "Ma'lumotlar faqat **lokai**".
- **Exact correction:** `.nx-settings-content .nx-panel { border:0; background:transparent; box-shadow:none; padding:0; margin-bottom:var(--pm-s-6); }` with `.nx-panel__head { border-bottom:1px solid var(--pm-line); padding:0 0 var(--pm-s-3); }`. `.nx-avatar-pick` → 40×40 circle `var(--pm-surface-2)`, `color:var(--pm-ink-2)`, active `box-shadow: 0 0 0 2px var(--pm-accent); background:var(--pm-accent-soft)` — and replace emoji glyphs with initials/abstract marks [TSX-ESCALATE]. Constrain `.nx-field .nx-input, .nx-setting-row { max-width: 560px; }`, move right-side chips into that column. Typo "lokai" → "lokal" [TSX-ESCALATE].

### D14 — Repeat: beige feed rows, salmon type chips, clipped fifth question
- **Screen:** repeat.
- **Likely selector:** `.nx-queue__row`, `.nx-queue__list`, `.nx-chip--accent` used for "Vaziyat", `.nx-chip--warn` on session chips, `.nx-session-card` (faint gradient), `.nx-intervals__step`, `.nx-intervals__dot`.
- **Symptom:** each question is a separate filled beige sub-card with a salmon type chip; the 5th question is sliced off by the panel bottom; the info card below adds five more beige numbered boxes; the session card has a pink corner wash.
- **Exact correction:** `.nx-queue__row { background:transparent; border-bottom:1px solid var(--pm-line); padding:var(--pm-s-3) 0; border-radius:0; }`, type chip → `.nx-chip { background:var(--pm-surface-2); color:var(--pm-ink-2); }`, `.nx-queue__list { max-height:none; overflow:visible; }` (remove any fixed-height clip). `.nx-session-card { background:var(--pm-surface); background-image:none; }`. `.nx-intervals__dot { width:auto; height:auto; background:transparent; color:var(--pm-ink-3); font:700 var(--pm-fs-13) var(--pm-font); }`. Session chips `--pm-surface-2 / --pm-ink-2`.

### D15 — Mobile 375px: desktop chrome, unlabeled icon nav, giant stacked hero, clipped back link, overflowing tabs
- **Screens:** mobile dashboard, mobile book.
- **Likely selector:** `.win-controls`, `.nav-item` / `.nav-item svg` / `.nav-txt`, `.hero` mobile media query (`global.css` ~2677), `.nx-back`, `.nx-book-hero`, `.nx-book-tabs`.
- **Symptom:** three window buttons (– □ ×) eat ~90px of a 375px topbar; nav shows only icons inside a filled terracotta square; the dashboard hero is ~380px tall with three chips on three lines and an isolated 0% ring; on book the back link is half-hidden under the hero edge, the cover+3-line title are cramped, and tabs cut off after "Terminlar" with no scroll cue.
- **Exact correction (≤480px):** `.win-controls { display:none; }`; `.nav-item svg { display:none; } .nav-txt { display:inline; font-size:var(--pm-fs-12); font-weight:600; }` with underline active state from D3; `.topbar { padding:0 var(--pm-s-2); }`. Hero: `padding:var(--pm-s-3); gap:var(--pm-s-2); flex-direction:column; align-items:flex-start; min-height:0;` ring absolute top-right 64px; chips single wrapping row. `.nx-back { display:block; margin:var(--pm-s-2) 0 var(--pm-s-4); }` and `.nx-book-hero { margin-top:var(--pm-s-4); }`. `.nx-book-tabs { overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; scrollbar-width:none; }` with `mask-image: linear-gradient(90deg, #000 90%, transparent)` so the cut-off is intentional. Sidebar primary → ghost (D9).

---

## 2. Plain verdict: cheap vs premium

**Closest to premium (in order):**
1. **Onboarding left panel** — the dark brown editorial split, Fraunces italic brass line, restrained feature list. This is the only surface that already feels expensive. Keep it as the reference standard.
2. **Book reader body** — serif text, generous leading and margins are genuinely editorial. The surrounding chrome is what lets it down.
3. **Library page head** — "Kutubxonang" at 40px with a restrained subtitle is correct; the 4 stat boxes underneath undo it.

**Cheapest (worst first):**
1. **Stats** — seven blank grey bars + achievement-chip parade + gradient avatar = unfinished template.
2. **Dashboard** — bordered pills, four pastel icons, nested cards, ALL CAPS everywhere. Highest defect density.
3. **Settings** — boxes in boxes, eight emoji avatars, half a panel of blank space.
4. **Repeat** — beige feed rows with salmon labels, clipped content.
5. **Mobile dashboard / mobile book** — desktop window controls on a phone, collapsed icon nav, towering hero.
6. **Onboarding right card** — good structure, but green "TAVSIYA" tag, trailing arrow and typo'd step label ("Shaxsiyatizg") cheapen it.

---

## 3. Three changes with the biggest perceived-quality jump for the least work

1. **Delete borders, add `--pm-shadow-1` and 24px padding** on `.card`, `.stat`, `.nx-stat`, `.todo-row`, `.qaction`, `.nx-queue__row`, `.nx-dropzone`, `.nx-panel`, `.nx-provider`. One mechanical pass removes the wireframe look from every screen at once.
2. **Normalize type in one pass:** `text-transform: none` on `.nx-eyebrow` and all labels; eyebrow = 12/700/`--pm-accent`/`.08em`; body ≥14 `--pm-ink-2`, helper ≥12 `--pm-ink-3`; titles 40/30 Fraunces; numbers `tabular-nums`. Fixes D1, D5, D6, D11 instantly.
3. **Reduce to ink + accent:** all pastel/status chips → `--pm-surface-2`/`--pm-ink-2`, one active accent chip max; remove every gradient outside the hero (`.nx-stats-hero::after`, `.nx-session-card`, `.nx-activity-bar.has-data`); move trailing arrows in front. Fixes D4, D7, D8, D11, D14.

---

## 4. What must be REMOVED, not restyled

Name these concrete elements — delete them, don't recolour them:

1. `.win-controls` (– □ ×) at ≤620px — remove from mobile layout entirely.
2. The blue radial-gradient layer and the 1.5px border on `.hero` — keep at most one ultra-low-contrast accent wash.
3. `.nx-stats-hero::after` (pink glow circle) and the coloured shadow under the fox avatar.
4. The seven zero-data `.nx-activity-bar-wrap` blocks — replace with an empty state, not a recolour.
5. The green "TAVSIYA" tag on onboarding provider and the amber "TEZ O'RADA" chip in book tabs.
6. The solid `.nav-badge` circle on the **active** nav item; badges belong only on inactive items.
7. Trailing `IconArrowRight` in all primary buttons and the `→` in "Keyingi bob →".
8. The eight emoji `.nx-avatar-pick` tiles in settings/onboarding-step-2 — replace with initials or abstract marks.
9. The duplicate "+ Kitob qo'shish" primary in the library header when the dropzone has its own action.
10. The fox emoji inside the dashboard greeting "Salam, o'quvchi 🦊" — one mascot in the avatar is enough.
11. The pink "sozlanmagan" chip in the dashboard AI card and the stray `.stat-head` icons on zero-value stat cards.
12. The dashed border on `.nx-dropzone` and the fixed-height clip on `.nx-queue__list`.
13. "Ma'lumotlar faqat **lokai**" typo and the "Shaxsiyatizg" step label — correct the strings [TSX-ESCALATE].

---

## 5. Pass/fail checklist for the final result (10 verifiable items)

Run at 1440 / 900 / 620 / 375. Every item must pass; one failure = not done.

1. **No wireframe borders.** Computed `border-width: 0px` on `.card`, `.stat`, `.nx-stat`, `.todo-row`, `.qaction`, `.nx-queue__row`, `.nx-dropzone`, `.nx-panel`; only intentional 1px `--pm-line` dividers remain.
2. **No ALL CAPS.** Every visible eyebrow/label computes `text-transform: none`; `.nx-eyebrow` computes `font-size: 12px`, `letter-spacing: .96px` (0.08em), `color: #A94F2A`.
3. **Exactly one primary per screen.** Computed `background-color: #A94F2A`, `height: 48px`, `border-radius: 12px`, `font-size: 14px`, `font-weight: 700`; no `svg` renders to the right of the primary label.
4. **Gradients only in hero.** No `background-image` containing `gradient(` on `.nx-stats-hero`, `.nx-session-card`, `.nx-activity-bar`, `.nx-panel`, `.nx-dropzone`, `.nx-book-hero` (book cover art is content, exempt). No `filter: drop-shadow` anywhere.
5. **Type floor respected.** No visible text below 12px except `.nx-kbd` and chips; body copy ≥14px; every numeric value computes `font-variant-numeric: tabular-nums`.
6. **Nav is text + underline.** `.nav-item.active` computes `background-color: transparent`, `border-width: 0`, and a 2px `::after` in `--pm-accent`; no badge on the active item; at 375px all nav labels are readable and `.win-controls` computes `display: none`.
7. **Zero-state chart fixed.** Stats at 0 data shows no seven filled grey blocks — either a flat single baseline or the `.nx-empty` pattern (48px icon circle, 20px title, one action). "So'nggi 7 kun" no longer looks like a skeleton.
8. **Two-colour rule.** On each screenshot, all large surfaces resolve to `--pm-bg`, `--pm-surface`, `--pm-surface-2`, `--pm-accent-soft`; ink/accent text only; sage/brass/blue appear at most in one small meaningful chip.
9. **Mobile composition.** Dashboard hero height ≤280px at 375px with the ring inline at top-right and chips on one wrapping row; book back link fully visible and not overlapped; all six book tabs reachable by horizontal scroll with a visible fade edge.
10. **Rhythm and depth.** Card padding 24px desktop / 20px mobile, card radius 16px, panel radius 24px, top page padding 48px, section gaps 32px, shadows only `--pm-shadow-1/2`.

---

## 6. Summary — top 10 defects

1. ALL CAPS 11px micro-labels on every screen (`.nx-eyebrow`, `.hero-goal small`, stat labels).
2. Visible 1–1.5px borders on virtually every card and row (`.card`, `.stat`, `.todo-row`, `.qaction`, `.nx-panel`).
3. Active nav rendered as a filled terracotta pill + bright badge, instead of plain text with a 2px underline (`.nav-item.active`).
4. Four pastel icon tiles + 4 colours on the dashboard (`.qaction .qicon` tone variants).
5. "Bugungi reja" rows are bordered pills with dead grey check circles and truncated text (`.todo-row`, `.t-check`).
6. Stat cards show "—" in a huge void with 11px caps labels (`.stat`, `.nx-stat__hint`).
7. Dashboard hero: double gradient + border + 24px title + empty band; 380px tall on mobile (`.hero`).
8. Trailing arrow icons on primary buttons across book/repeat/onboarding (`.nx-btn--primary > svg:last-child`).
9. Two solid accent primary buttons on the book screen (`.nx-book-hero__action`, `.nx-book-side`).
10. Stats "So'nggi 7 kun" renders seven blank grey blocks instead of an empty state (`.nx-activity-bar-wrap`).
