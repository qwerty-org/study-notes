# K02 — Cool Alabaster + Deep Teal

**Direction:** "Alabaster & Deep Teal" — an editorial, cool-neutral system for `study-notes`.
**Decision:** One palette, no options. Brass is retired. The visual centre of gravity moves from fire (rust/cream/gold) to water (cool alabaster/slate/teal).

---

## 1. Full token table — every `--pm-*` colour token (light + dark)

### Light (`:root`)

| Token | Old | **New** | Role |
|---|---|---|---|
| `--pm-bg` | `#faf8f4` | **`#F4F7F6`** | Cool alabaster app canvas |
| `--pm-surface` | `#ffffff` | **`#FFFFFF`** | Cards / panel white |
| `--pm-surface-2` | `#f4f0e8` | **`#EDF2F0`** | Mist fill (soft tiles, table stripes) |
| `--pm-surface-3` | `#ede7dc` | **`#E2EAE7`** | Cool slate fill (hover, track, inset) |
| `--pm-ink` | `#1f1b15` | **`#16211F`** | Primary text — deep teal-black |
| `--pm-ink-2` | `#4b4337` | **`#45534F`** | Secondary text — slate |
| `--pm-ink-3` | `#746a5b` | **`#5F6E69`** | Tertiary text — cool gray-green |
| `--pm-line` | `#e9e3d8` | **`#DFE7E4`** | Hairline dividers |
| `--pm-line-strong` | `#d8cfbe` | **`#7E948E`** | Strong rules / essential borders (≥3:1) |
| `--pm-accent` | `#a94f2a` | **`#0E6B64`** | Deep teal — primary action, focus, active state |
| `--pm-accent-soft` | `#f7eae3` | **`#E2F0EC`** | Teal-tint chip / selected fill |
| `--pm-accent-hover` | `#964421` | **`#0A514C`** | Teal pressed/hover |
| `--pm-on-accent` | `#ffffff` | **`#FFFFFF`** | White label on teal button |
| `--pm-hero-gold` | `#dcc08a` | **`#BFE3D9`** | *Renamed in intent:* hero flourish / italic highlight, now pale sea-silver (token name kept for compatibility) |
| `--pm-hero-ink` | `#f5efe4` | **`#F2F8F6`** | Hero body text — ice white |
| `--pm-hero-bg` *(new)* | — | **`#0D3B38`** | Hero panel gradient start — deep teal |
| `--pm-hero-bg-2` *(new)* | — | **`#0A2A28`** | Hero panel gradient end — deeper teal |
| `--pm-sage` | `#4f6b5d` | **`#3F7269`** | Sea-glass sage — book covers, "ready/complete" only |
| `--pm-sage-soft` | `#e8f0ea` | **`#E7F1EE`** | Sage tint |
| `--pm-brass` | `#a88342` | **`#0E6B64`** | **RETIRED** — alias of `--pm-accent`; no new usage |
| `--pm-brass-soft` | `#f5eedf` | **`#E2F0EC`** | **RETIRED** — alias of `--pm-accent-soft`; no new usage |
| `--pm-danger` | `#b5473d` | **`#B23B48`** | Cool crimson — errors only |
| `--pm-danger-soft` | `#f7e9e7` | **`#FBECEE`** | Error tint |
| `--pm-reader-paper` *(new in light)* | — | **`#FCFDFC`** | Reading surface, cool near-white |
| `--pm-control-border` *(new in light)* | — | **`#7A918B`** | Inputs / buttons border (≥3:1) |
| `--pm-transparent` | `transparent` | **`transparent`** | unchanged |
| `--pm-shadow-1` | rust-tinted rgba | **`0 1px 2px rgba(22,33,31,0.05), 0 8px 24px rgba(22,33,31,0.06)`** | Cool shadow |
| `--pm-shadow-2` | rust-tinted rgba | **`0 2px 8px rgba(22,33,31,0.06), 0 24px 60px rgba(22,33,31,0.09)`** | Cool shadow |
| `--pm-shadow-focus` | accent-soft ring | **`0 0 0 3px var(--pm-accent-soft)`** | unchanged definition (now teal ring) |

### Dark (`[data-theme='dark']`)

| Token | Old | **New** | Role |
|---|---|---|---|
| `--pm-bg` | `#15130f` | **`#101A19`** | Cool near-black canvas |
| `--pm-surface` | `#1e1b16` | **`#182523`** | Cards / panels |
| `--pm-surface-2` | `#27231c` | **`#20302D`** | Raised tint |
| `--pm-surface-3` | `#302b23` | **`#2A3B37`** | Highest tint |
| `--pm-ink` | `#f5efe4` | **`#EDF5F2`** | Primary text |
| `--pm-ink-2` | `#cfc4b2` | **`#C3D2CD`** | Secondary text |
| `--pm-ink-3` | `#9e9383` | **`#93A7A1`** | Tertiary text |
| `--pm-line` | `#373127` | **`#2C3D39`** | Hairline |
| `--pm-line-strong` | `#7a6e59` | **`#5E766F`** | Strong rule (≥3:1) |
| `--pm-accent` | `#e69a6c` | **`#4FC3B2`** | Bright teal for dark surfaces |
| `--pm-accent-soft` | `#3a281f` | **`#183C37`** | Deep teal selected fill |
| `--pm-accent-hover` | `#f0ad83` | **`#6FD8C8`** | Brighter teal hover |
| `--pm-on-accent` | `#15130f` | **`#08201D`** | Dark ink on bright teal |
| `--pm-hero-gold` | `#cbaa72` | **`#A9DCCF`** | Hero flourish — pale sea-silver |
| `--pm-hero-ink` | `#f5efe4` | **`#EAF5F1`** | Hero text |
| `--pm-hero-bg` *(new)* | — | **`#0B2F2C`** | Hero gradient start |
| `--pm-hero-bg-2` *(new)* | — | **`#071E1C`** | Hero gradient end |
| `--pm-sage` | `#93b5a3` | **`#86BFB2`** | Sea-glass sage |
| `--pm-sage-soft` | `#25332b` | **`#1C3A34`** | Sage tint |
| `--pm-brass` | `#d9b46e` | **`#4FC3B2`** | **RETIRED** — alias of `--pm-accent` |
| `--pm-brass-soft` | `#33291b` | **`#183C37`** | **RETIRED** — alias of `--pm-accent-soft` |
| `--pm-danger` | `#e07b6f` | **`#F08089`** | Cool crimson |
| `--pm-danger-soft` | `#2e1d1a` | **`#3A1E22`** | Error tint |
| `--pm-reader-paper` | `#221f18` | **`#14201E`** | Reading surface |
| `--pm-control-border` | `#4e4638` | **`#637C75`** | Inputs / buttons border (≥3:1) |
| `--pm-shadow-1` | warm rgba | **`inset 0 1px 0 rgba(191,227,217,0.07), 0 10px 28px rgba(0,0,0,0.45)`** | Cool shadow |
| `--pm-shadow-2` | warm rgba | **`inset 0 1px 0 rgba(191,227,217,0.10), 0 28px 64px rgba(0,0,0,0.55)`** | Cool shadow |

Palette at a glance (light → dark): `F4F7F6 / 101A19` · `FFFFFF / 182523` · `EDF2F0 / 20302D` · `16211F / EDF5F2` · `0E6B64 / 4FC3B2` · `BFE3D9 / A9DCCF` · `3F7269 / 86BFB2`.

---

## 2. Explicit old → new mapping (what changes on screen)

| Current element (rust theme) | Current token | New token | Result |
|---|---|---|---|
| Page canvas cream | `--pm-bg #faf8f4` | `--pm-bg #F4F7F6` | Cool alabaster canvas; no yellow cast |
| Card / modal white | `--pm-surface #ffffff` | unchanged `#FFFFFF` | Same clean white |
| Quick-action tile fill | `--pm-surface-2 #f4f0e8` | `#EDF2F0` | Cool mist instead of beige |
| Progress track / inset | `--pm-surface-3 #ede7dc` | `#E2EAE7` | Cool slate |
| Headings & body | `--pm-ink #1f1b15` | `#16211F` | Near-black teal-charcoal |
| Subtext | `--pm-ink-2 #4b4337` | `#45534F` | Slate |
| Muted captions | `--pm-ink-3 #746a5b` | `#5F6E69` | Cool gray-green |
| Dividers | `--pm-line/-strong` warm | `#DFE7E4 / #7E948E` | Cool, stronger, accessible |
| Primary button ("O'qishni boshlash", "Davom etish") | `--pm-accent #a94f2a` | `#0E6B64` | Deep teal, white label |
| Button hover | `#964421` | `#0A514C` | Deeper teal |
| Active nav underline / progress bar | `--pm-accent` | `--pm-accent` (teal) | Teal instead of rust |
| Status chips ("1 kunlik streak", "0 ta bob o'qildi", "Batafsil") | `--pm-accent-soft #f7eae3` | `#E2F0EC` | Pale teal chips, teal text |
| Book cover tile | `--pm-sage #4f6b5d` | `#3F7269` | Sea-glass teal-green |
| Hero italic flourish (gold) | `--pm-hero-gold #dcc08a` | `#BFE3D9` | Pale sea-silver on deep teal |
| Hero background brown gradient | component gradient | `--pm-hero-bg/-bg-2` | Deep teal gradient |
| Brass badges / warm gilding | `--pm-brass` | **removed** → `--pm-accent` or hero flourish | Brass fully retired |
| Error states | `--pm-danger` | `#B23B48` | Cool crimson, no orange-red |
| Dark-mode on-accent | `#15130f` | `#08201D` | Deep teal ink on bright teal |

**No hue survives from the old system** except a deliberate teal-leaning sage; every warm surface, line, ink and accent is replaced.

---

## 3. WCAG contrast ratios (verified, ≥12 critical pairs)

Computed with WCAG 2.x relative luminance `(Llighter + 0.05)/(Ldarker + 0.05)`. Thresholds: 4.5:1 normal text (AA), 3:1 large text / UI component boundaries (AA), 7:1 enhanced (AAA).

### Light theme — 20 critical pairs

| Pair (foreground on background) | Ratio | Verdict |
|---|---|---|
| `#16211F` ink on `#F4F7F6` bg | **15.32:1** | AAA |
| `#16211F` ink on `#FFFFFF` surface | **16.52:1** | AAA |
| `#45534F` ink-2 on `#FFFFFF` | **8.07:1** | AAA |
| `#45534F` ink-2 on `#EDF2F0` surface-2 | **7.13:1** | AAA |
| `#5F6E69` ink-3 on `#FFFFFF` | **5.36:1** | AA |
| `#5F6E69` ink-3 on `#EDF2F0` | **4.73:1** | AA |
| `#0E6B64` accent text on `#FFFFFF` | **6.35:1** | AA |
| `#0E6B64` accent text on `#F4F7F6` | **5.89:1** | AA |
| `#FFFFFF` on `#0E6B64` button | **6.35:1** | AA |
| `#FFFFFF` on `#0A514C` button hover | **9.15:1** | AAA |
| `#16211F` ink on `#E2F0EC` chip | **14.09:1** | AAA |
| `#0E6B64` teal text on `#E2F0EC` chip | **5.42:1** | AA |
| `#F2F8F6` hero ink on `#0D3B38` hero | **11.49:1** | AAA |
| `#BFE3D9` hero flourish on `#0D3B38` hero | **8.95:1** | AAA |
| `#FFFFFF` on `#3F7269` sage book cover | **5.49:1** | AA |
| `#B23B48` danger on `#FFFFFF` | **5.81:1** | AA |
| `#B23B48` danger on `#FBECEE` | **5.08:1** | AA |
| `#7A918B` control border on `#FFFFFF` | **3.36:1** | AA (UI) |
| `#7E948E` strong line on `#FFFFFF` | **3.22:1** | AA (UI) |
| `#16211F` ink on `#FCFDFC` reader paper | **16.20:1** | AAA |

### Dark theme — 17 critical pairs

| Pair (foreground on background) | Ratio | Verdict |
|---|---|---|
| `#EDF5F2` ink on `#101A19` bg | **16.00:1** | AAA |
| `#EDF5F2` ink on `#182523` surface | **14.27:1** | AAA |
| `#C3D2CD` ink-2 on `#182523` | **10.11:1** | AAA |
| `#93A7A1` ink-3 on `#182523` | **6.24:1** | AA |
| `#4FC3B2` accent text on `#182523` | **7.37:1** | AAA |
| `#4FC3B2` accent text on `#101A19` | **8.26:1** | AAA |
| `#08201D` on-accent on `#4FC3B2` button | **7.92:1** | AAA |
| `#08201D` on-accent on `#6FD8C8` hover | **9.99:1** | AAA |
| `#EDF5F2` ink on `#183C37` chip | **10.89:1** | AAA |
| `#4FC3B2` teal text on `#183C37` chip | **5.62:1** | AA |
| `#EAF5F1` hero ink on `#0B2F2C` hero | **12.92:1** | AAA |
| `#A9DCCF` hero flourish on `#0B2F2C` hero | **9.49:1** | AAA |
| `#86BFB2` sage on `#1C3A34` | **5.93:1** | AA |
| `#F08089` danger on `#182523` | **6.14:1** | AA |
| `#637C75` control border on `#182523` | **3.52:1** | AA (UI) |
| `#5E766F` strong line on `#182523` | **3.24:1** | AA (UI) |
| `#EDF5F2` ink on `#14201E` reader paper | **15.09:1** | AAA |

**Result: all 37 pairs pass AA; 22 reach AAA. No critical pair falls below 3:1.** The old theme's dark-mode white-on-accent was explicitly called out in the token file as 2.28:1; the new dark button is 7.92:1.

---

## 4. Three-sentence rationale

Cool alabaster and slate carry no red/yellow wavelength "heat", so large surfaces and long reading sessions stop feeling warm, enclosed and mildly urgent — the same information simply sits on a quieter, cooler ground than rust on cream. Deep teal reads as considered and editorial rather than appetite-driven warm earth: it is the colour of ink, deep water and museum signage, and here it appears as a single disciplined accent instead of competing warm rust, brass and gold. For a reading and learning product teal is the right semantic hue — it signals calm focus and steady progress, pairs naturally with paper-white and serif typography, and keeps the interface legible and premium without the fatigue of high-energy orange.

---

## 5. Usage rules

### Accent coverage budget
- **≤7% of any screen** is `--pm-accent` (deep teal) / `--pm-accent-hover`. Count filled pixels, not token count.
- One primary teal action per view (dashboard: *Tezkor amallar* CTA; book: *O'qishni boshlash*; onboarding: *Davom etish*). All other actions are outlined ink or plain text.
- Teal is reserved for: primary button, active nav/tab underline, focus ring, progress fill, selected chip, link text. Never for large background fields.
- Neutral surfaces must dominate: roughly **70% bg/surface, 20% text/lines, 7% teal, 3% sage/danger combined**.
- No gradients on interactive controls. Teal buttons are flat `#0E6B64` (`#4FC3B2` in dark), radius `--pm-r-control`.

### Sage / brass replacement
- **Retire brass entirely.** `--pm-brass` / `--pm-brass-soft` become aliases of teal accent tokens for compile safety; do not author new brass usage. Any gilded badge, "Tavsiya" gold tag or warm divider becomes `--pm-accent-soft` + teal text, or the hero flourish `#BFE3D9`.
- Keep sage but narrow its job: `--pm-sage` is the book-cover tile and "completed / ready / verified" state only. It is a desaturated sea-glass green (`#3F7269`), deliberately lower-chroma than the teal accent so it never competes. No sage buttons, no sage nav.
- Danger stays a cool crimson and is the only warm hue left, used strictly for errors.

### Chips
- Fill `--pm-accent-soft`, text `--pm-accent` (or `--pm-ink` for neutral chips), 1px `--pm-accent-soft` border, radius `--pm-r-pill`, 12–13px.
- In dark: fill `--pm-accent-soft #183C37`, text `--pm-accent #4FC3B2`.
- Examples: "1 kunlik streak", "0 ta bob o'qildi", "Batafsil", "Tavsiya" (retired brass → teal chip).

### Modals / dialogs
- Surface `--pm-surface`, 1px `--pm-line` border, radius `--pm-r-lg`, shadow `--pm-shadow-2`, backdrop `rgba(16,26,25,0.42)` (cool, not brown).
- Header title `--pm-ink`, body `--pm-ink-2`, confirm button `--pm-accent`, cancel is bordered with `--pm-control-border`.
- Focus ring: `0 0 0 3px var(--pm-accent-soft)`; inputs use `--pm-control-border` (3.36:1 light / 3.52:1 dark).

### Reader
- Paper `--pm-reader-paper` (`#FCFDFC` / dark `#14201E`), body text `--pm-ink`, drop-cap / pull-quote rule in `--pm-accent` at 2px.
- Selected-chapter row: `--pm-accent-soft` fill with a 2px left teal rule (replaces the rust rule in the current screenshot).
- Chapter numbers and muted meta use `--pm-ink-3`; never rust or brass.

### Hero panel
- Full-bleed left panel, vertical + slight diagonal gradient `--pm-hero-bg → --pm-hero-bg-2` (deep teal → deeper teal).
- Headline `--pm-hero-ink`; the italic emphasis line uses `--pm-hero-gold` (sea-silver `#BFE3D9`) — this is the only "metallic" note left, now cool.
- Small upper label and footer bullets in `#BFE3D9` at 60–70% opacity; keep the existing Fraunces display type and generous whitespace.
- No rust, no brown, no gold highlights anywhere in the panel.

### Copy-paste token core
```css
:root {
  --pm-bg: #F4F7F6;            --pm-surface: #FFFFFF;
  --pm-surface-2: #EDF2F0;     --pm-surface-3: #E2EAE7;
  --pm-ink: #16211F;           --pm-ink-2: #45534F;  --pm-ink-3: #5F6E69;
  --pm-line: #DFE7E4;          --pm-line-strong: #7E948E;
  --pm-accent: #0E6B64;        --pm-accent-soft: #E2F0EC; --pm-accent-hover: #0A514C;
  --pm-on-accent: #FFFFFF;
  --pm-hero-gold: #BFE3D9;     --pm-hero-ink: #F2F8F6;
  --pm-hero-bg: #0D3B38;       --pm-hero-bg-2: #0A2A28;
  --pm-sage: #3F7269;          --pm-sage-soft: #E7F1EE;
  --pm-brass: #0E6B64;         --pm-brass-soft: #E2F0EC; /* retired aliases */
  --pm-danger: #B23B48;        --pm-danger-soft: #FBECEE;
  --pm-reader-paper: #FCFDFC;  --pm-control-border: #7A918B;
}
[data-theme='dark'] {
  --pm-bg: #101A19;            --pm-surface: #182523;
  --pm-surface-2: #20302D;     --pm-surface-3: #2A3B37;
  --pm-ink: #EDF5F2;           --pm-ink-2: #C3D2CD;  --pm-ink-3: #93A7A1;
  --pm-line: #2C3D39;          --pm-line-strong: #5E766F;
  --pm-accent: #4FC3B2;        --pm-accent-soft: #183C37; --pm-accent-hover: #6FD8C8;
  --pm-on-accent: #08201D;
  --pm-hero-gold: #A9DCCF;     --pm-hero-ink: #EAF5F1;
  --pm-hero-bg: #0B2F2C;       --pm-hero-bg-2: #071E1C;
  --pm-sage: #86BFB2;          --pm-sage-soft: #1C3A34;
  --pm-brass: #4FC3B2;         --pm-brass-soft: #183C37; /* retired aliases */
  --pm-danger: #F08089;        --pm-danger-soft: #3A1E22;
  --pm-reader-paper: #14201E;  --pm-control-border: #637C75;
}
```

---

## 6. What the user will see

**Dashboard.** The cream wash is gone: the window now sits on cool alabaster (`#F4F7F6`) with white cards floating on it. The "Salom, o'quvchi" banner keeps its Fraunces headline and large circular progress, but the ring and the 0% progress bar are now deep teal, and the three status chips ("1 kunlik streak", "0 ta bob o'qildi", "Quiz boshlanmagan") are pale teal pills with teal text instead of peach. The active "Boshifa" nav underline, the four *Tezkor amallar* icon tiles' icons, and the book-cover thumbnail are teal / sea-glass; the bottom "Davom etish" progress strip is teal rather than rust. Overall it reads like a quiet editorial dashboard — airy, unfussy, slightly clinical in a good way — with the only warm note removed from the field of view.

**Book.** The rust "O'qishni boshlash" button becomes a deep teal filled button with white text; "Quiz ishlash" becomes a cool-bordered secondary. The active "O'qish" tab underline and the 2px reader quote rule switch from rust to teal, and the selected chapter row gets a pale teal fill with a teal left rule. The cover tile shifts from dull moss green to a cleaner sea-glass `#3F7269`, "Tahlil tayyor / MD / 4 bob" chips become teal-tinted, and the reader paper is a cool near-white (`#FCFDFC`) that makes the Fraunces paragraphs look crisp rather than sepia. Nothing glows warm any more; the page feels like a well-printed, modern paperback with teal marginalia.

**Onboarding (bonus consistency).** The brown-gold hero becomes a deep teal gradient with pale sea-silver italic "hayotga qo'llash", the step rail and "Davom etish" button turn teal, and the "Tavsiya" badge is now a teal chip — the same single accent language from first launch onward.
