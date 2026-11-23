# L01 — Shell Layout Decisions (Topbar / Page Container / Page Header)

> Bu fayl FAQAT qarorlar hujjati. CSS ni `premium/02-topbar.css`, `03-nav.css`,
> `04-brand.css`, `05-profile-popup.css`, `06-window-controls.css`,
> `07-page-header.css`, `34-responsive.css` agentlari yozadi. Men CSS yozmayman.
> Manba: `2026-11-23-premium-design-system.md`, `Layout.tsx`, `global.css`,
> `00-tokens.css`, `nx-head` markup (Library/Settings/Stats/Repeat).

---

## 1. Qat'iy qarorlar (qisqa)

1. **Topbar balandligi 64px** barcha breakpointlarda (`--pm-s-7`). `--topbar-h` o'zgaradi, lekin qiymati 64 bo'lib qoladi — hech qanday vertikal siljish yo'q.
2. **Nav markazga ABSOLYUT joylashtiriladi** (`left:50%; transform:translateX(-50%)`), grid emas. Sabab: chap (brand) va o'ng (streak+avatar+window) zonalar kengligi teng emas; grid bilan nav vizual markazdan 30–50px siljiydi. Absolyut usul barcha kengliklarda deterministik.
3. **Brand va o'ng klaster** `display:flex; justify-content:space-between` bilan ikki chetga qo'yiladi; nav ularning ustiga emas, ular orasidagi bo'shliqqa tushadi.
4. **Umumiy kontent chizig'i 1440px** (`--pm-shell-max`, border-box). 1440 da bu to'liq kenglik (32px ichki padding = ekrandagi hozirgi ko'rinish); 1440 dan kengda 80px+ gutter paydo bo'ladi. Topbar va `.page` **bir xil chiziqqa** ega — brand va sahifa kontenti chap tomonda tekis turadi.
5. **Nav label'lari 1200px dan past — ikonka-only.** Streak chip faqat **≥1440px** ko'rinadi. Window controls **≤899px** yashiriladi. Brand nomi **≤619px** yashiriladi (faqat 32px mark qoladi).
6. **Page container**: `max-width:1440px`, padding `48px 32px 96px`; `.page` flex-column, `gap:32px`. `.nx-head / .page-head` ning o'z `margin-bottom`i **yo'q** — 32px ritm `gap` bilan beriladi (ikki barobar bo'shliq bo'lmaydi).
7. **Page header**: eyebrow → title → subtitle chapda, **harakatlar o'ngga va pastga (subtitle baseline) tekislanadi**; ≤619px da actions pastga tushib, to'liq kenglikdagi primary tugmaga aylanadi.

---

## 2. Breakpoint qaror jadvali

| Kenglik | Topbar h | Topbar h-padding | Brand zonasi | Nav | O'ng klaster | Page max | Page padding (T R B) | `.page` gap | `.nx-head` |
|---|---|---|---|---|---|---|---|---|---|
| **≥1440** (1440) | 64 | `max(24, (100vw−1440)/2 + 32)` → 1440 da **32** | 240px: mark 32 + 8 + "Study Notes" 18px Fraunces | to'liq label, item 44h / pad `0 12` / gap **8** | streak 96 + avatar 40 + window 3×40 | 1440 | 48 / 32 / 96 | 32 | 1 qator, actions o'ng-past |
| **1200–1439** | 64 | 24 | 200px (nom bor) | to'liq label, item 44h / pad `0 12` / gap 8 | **streak yo'q**, avatar 40 + window 3×40 | 1440 | 48 / 24 / 96 | 32 | 1 qator, actions o'ng-past |
| **900–1199** (900) | 64 | 24 | 160px (nom bor) | **ikonka-only**, item 44×44, gap 8, label ko'rinmaydi (a11y saqlanadi) | streak yo'q, avatar 40 + window 3×40 | 1440 | 48 / 24 / 96 | 32 | 1 qator, actions o'ng-past |
| **620–899** | 64 | 16 | content-size ≈140px (nom bor) | ikonka-only, 44×44, gap 8 | streak yo'q, avatar 40, **window yo'q** | 1440 | 32 / 16 / 80 | 32 | h1 → 30px; 1 qator |
| **480–619** (480) | 64 | 16 | **32px** — faqat mark, `b` yashirin | ikonka-only, 44×44, gap 8 | streak yo'q, avatar 36, window yo'q | 1440 | 24 / 16 / 64 | 24 | ustun; h1 30px; actions to'liq kenglik |
| **375–479** (375) | 64 | 16 | 32px — faqat mark | ikonka-only, 44×44, gap 8 | streak yo'q, avatar 36, window yo'q | 1440 | 24 / 16 / 64 | 24 | ustun; h1 30px; actions to'liq kenglik |

**Javascript breakpointlari (exact):** `@media (max-width: 1439px)`, `(max-width: 1199px)`, `(max-width: 899px)`, `(max-width: 619px)`. 480 uchun alohida media yo'q — 619 qoidasi 375 ni ham qamrab oladi (jadvalda 480 alohida ko'rsatilishi faqat tekshirish uchun).

### Nima uchun bu qiymatlar (tekshirish hisobi, 1440)
- Nav to'liq label: 5 item × (18 ikonka + 8 gap + ~78 label + 24 padding) + 4×8 gap ≈ **672px**; markaz 720 → x≈384–1056.
- O'ng klaster (streak bilan): 96 + 16 + 40 + 16 + 33 (divider) + 120 ≈ **321px**; o'ng chet 1408 → boshlanishi x≈1087. **Bo'shliq 31px** ✅
- Brand: 32 + 240 = x≈272; nav boshlanishi 384 → **112px** ✅
- 900 da ikonka-only nav: 5×44 + 4×8 = **252px**; markaz 450 → x≈324–576. Brand 24–184, o'ng (avatar+window, streak yo'q) 24+... → x≈700–876. **Hech qanday overlap yo'q** ✅

---

## 3. ASCII wireframe

### 1440px — to'liq shell
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ topbar 64px · bg=--pm-surface · border-bottom 1px --pm-line                  │
│                                                                              │
│ ▣ Study Notes        ⌂Bosh sahifa  ▤Kutubxona  ⟳Takrorlash⑤  ▥Natijalarim  ⚙Sozlamalar        🔥1 kun  🦊  │ ─ ▢ ✕ │
│ ├─ brand 240 ─┤                    ↑ nav ABSOLUTE center (50%)                         ├─ right ─┤│window│
├──────────────────────────────────────────────────────────────────────────────┤
│  ← 32px gutter (1440 da) →                                                    │
│  ╔═ page max 1440, pad 48/32/96 ════════════════════════════════════════╗      │
│  ║  SHAXSIY TO'PLAM            (eyebrow 12 accent)                       ║      │
│  ║  Kutubxonang                (title 40 Fraunces)           [+ Kitob qo'shish] ║ ← o'ng-past
│  ║  Kitob qo'shing, AI tahlil qiling… (subtitle 16 ink-2)                ║      │
│  ║                                            ↑ gap 32px ↓               ║      │
│  ║  ┌ stat ┐ ┌ stat ┐ ┌ stat ┐ ┌ stat ┐                                 ║      │
│  ╚═══════════════════════════════════════════════════════════════════════╝      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 900px — ikonka nav, streak yo'q, window bor
```
┌───────────────────────────────────────────────────────────────┐
│ ▣ Study Notes          ⌂  ▤  ⟳⑤  ▥  ⚙              🦊  │ ─ ▢ ✕ │
│ └ brand 160 ┘              ↑ nav center                └ right ┘│window│
├───────────────────────────────────────────────────────────────┤
│ pad 48/24/96 · title 40 · actions o'ng-past                   │
└───────────────────────────────────────────────────────────────┘
```

### 375px — faqat mark + ikonka nav + avatar
```
┌─────────────────────────────────────┐
│ ▣      ⌂  ▤  ⟳⑤  ▥  ⚙         🦊   │  ← h-pad 16, nav center
├─────────────────────────────────────┤
│ pad 24/16/64 · gap 24               │
│ SHAXSIY TO'PLAM                     │
│ Kutubxonang            (30px)       │
│ Kitob qo'shing, AI tahlil…          │
│ [ + Kitob qo'shish ]  ← to'liq keng │
└─────────────────────────────────────┘
```

---

## 4. Paste qilinadigan CSS deklaratsiyalari

> Barcha ranglar faqat `--pm-*`; geometriya 8px grid (`--pm-s-*`).
> `44px`, `40px`, `240px`, `96px`, `1440px` uchun token so'rovi §6 da.

### 4.1 `02-topbar.css` — asosiy shell
```css
:root {
  --pm-shell-max: 1440px;
  --pm-shell-gutter: max(24px, calc((100vw - var(--pm-shell-max)) / 2 + 32px));
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--pm-s-7);                 /* 64px */
  display: flex;
  align-items: center;
  justify-content: space-between;        /* brand chap, right o'ng */
  padding: 0 var(--pm-shell-gutter);
  background: var(--pm-surface);
  border-bottom: 1px solid var(--pm-line);
  z-index: 80;
  -webkit-app-region: drag;              /* saqlanadi */
}
.topbar a,
.topbar button,
.topnav {
  -webkit-app-region: no-drag;
}

.main {
  padding-top: var(--pm-s-7);            /* 64px */
  background: var(--pm-bg);
}

@media (max-width: 1439px) {
  .topbar {
    padding: 0 var(--pm-s-4);            /* 24px */
  }
  .topbar .streak-chip {
    display: none;                       /* streak faqat ≥1440 */
  }
}
@media (max-width: 899px) {
  .topbar {
    padding: 0 var(--pm-s-3);            /* 16px */
  }
  .topbar .win-controls {
    display: none;                       /* window controls ≤899 yo'q */
  }
}
```

### 4.2 `04-brand.css`
```css
.brand {
  flex: 0 0 240px;                       /* reserved brand zone ≥1440 */
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--pm-s-1);                    /* 8px */
  justify-self: start;
}
.brand .mark {
  width: 32px;
  height: 32px;
  border-radius: var(--pm-r-sm);         /* 10px */
  background: var(--pm-accent);          /* gradient YO'Q */
  color: var(--pm-surface);              /* light: oq, dark: to'q — kontrast saqlanadi */
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}
.brand b {
  font-family: var(--pm-font-display);
  font-size: var(--pm-fs-18);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--pm-ink);
  white-space: nowrap;
}
@media (max-width: 1439px) { .brand { flex-basis: 200px; } }
@media (max-width: 1199px) { .brand { flex-basis: 160px; } }
@media (max-width: 899px)  { .brand { flex-basis: auto; } }
@media (max-width: 619px)  {
  .brand { flex-basis: 32px; }
  .brand b { display: none; }            /* faqat mark */
}
```

### 4.3 `03-nav.css` — absolut markaz + ikonka rejimi
```css
.topnav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--pm-s-1);                    /* 8px */
  padding: 0;
  overflow: visible;                     /* scrollbar yo'q */
  min-width: 0;
}
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--pm-s-1);                    /* 8px icon–text */
  height: 44px;
  padding: 0 var(--pm-s-2);              /* 0 12px */
  border-radius: 0;                      /* pill YO'Q */
  color: var(--pm-ink-3);
  font-size: var(--pm-fs-14);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  flex: 0 0 auto;
}
.nav-item:hover { color: var(--pm-ink); background: var(--pm-surface-2); }
.nav-item.active { color: var(--pm-ink); background: transparent; }
.nav-item.active::after {                /* faol ko'rsatkich: 2px chiziq */
  content: '';
  position: absolute;
  left: var(--pm-s-2);
  right: var(--pm-s-2);
  bottom: 0;
  height: 2px;
  background: var(--pm-accent);
  border-radius: var(--pm-r-pill);
}
.nav-item.active .nav-badge { display: none; }  /* badge faqat faol bo'lmaganda */

.nav-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 var(--pm-s-1);
  border-radius: var(--pm-r-pill);
  background: var(--pm-accent-soft);
  color: var(--pm-accent);
  font-size: var(--pm-fs-12);
  font-variant-numeric: tabular-nums;
  display: grid;
  place-items: center;
}

@media (max-width: 1199px) {
  .nav-item {
    width: 44px;
    padding: 0;
    justify-content: center;
  }
  .nav-item .nav-txt {                    /* ko'rinmaydi, lekin a11y daraxtida qoladi */
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .nav-item.active::after { left: 10px; right: 10px; }
  .nav-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    padding: 0;
  }
}
```

### 4.4 `05-profile-popup.css` / `06-window-controls.css` — o'ng klaster
```css
.topbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--pm-s-3);                    /* 16px */
  flex: 0 0 auto;
}

.streak-chip {
  height: 28px;
  padding: 0 var(--pm-s-2);              /* 0 12px */
  border-radius: var(--pm-r-pill);
  background: var(--pm-surface-2);
  color: var(--pm-ink-2);
  font-size: var(--pm-fs-12);
  font-variant-numeric: tabular-nums;
  display: inline-flex;
  align-items: center;
  gap: var(--pm-s-1);
}
.streak-chip svg { color: var(--pm-brass); }  /* bitta urg'u */

.avatar-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--pm-r-pill);
  border: 2px solid var(--pm-line-strong);
  background: var(--pm-surface-2);
  display: grid;
  place-items: center;
  font-size: var(--pm-fs-20);
  padding: 0;
  cursor: pointer;
}
.avatar-btn.on { box-shadow: var(--pm-shadow-focus); border-color: var(--pm-accent); }

.win-controls {
  display: flex;
  align-items: center;
  margin-left: var(--pm-s-2);            /* 8px */
  padding-left: var(--pm-s-2);           /* 8px */
  border-left: 1px solid var(--pm-line);
  gap: 0;
}
.win-btn {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--pm-ink-3);
  border-radius: var(--pm-r-sm);
  padding: 0;
  cursor: pointer;
}
.win-btn:hover { background: var(--pm-surface-2); color: var(--pm-ink); }
.win-close:hover { background: var(--pm-accent-soft); color: var(--pm-accent); }
@media (max-width: 619px) { .avatar-btn { width: 36px; height: 36px; } }
```

### 4.5 Sahifa konteyneri va ritm
```css
.page {
  width: 100%;
  max-width: var(--pm-shell-max);        /* 1440, border-box */
  margin: 0 auto;
  box-sizing: border-box;
  padding: var(--pm-s-6) var(--pm-s-4) 96px;   /* 48 32 96 */
  display: flex;
  flex-direction: column;
  gap: var(--pm-s-5);                    /* 32px — bo'limlar ritmi */
}
@media (max-width: 1439px) {
  .page { padding: var(--pm-s-6) var(--pm-s-4) 96px; } /* 48 24 96 */
}
@media (max-width: 899px) {
  .page { padding: var(--pm-s-5) var(--pm-s-3) var(--pm-s-8); } /* 32 16 80 */
}
@media (max-width: 619px) {
  .page {
    padding: var(--pm-s-4) var(--pm-s-3) var(--pm-s-7); /* 24 16 64 */
    gap: var(--pm-s-4);                  /* 24px */
  }
}
```

### 4.6 `07-page-header.css` — `.nx-head` (asosiy) va `.page-head` (legacy)
```css
.nx-head,
.page-head {
  display: flex;
  align-items: flex-end;                 /* harakat subtitle baseline ga tekislanadi */
  justify-content: space-between;
  gap: var(--pm-s-4);                    /* 24px */
  margin-bottom: 0;                      /* ritm faqat .page gap dan */
}
.nx-head > div:first-child,
.page-head > div:first-child {
  min-width: 0;
  max-width: 72ch;
}
.nx-eyebrow {
  display: block;
  font-size: var(--pm-fs-12);
  font-weight: 700;
  color: var(--pm-accent);
  letter-spacing: 0.08em;
  line-height: 1.4;
  margin-bottom: var(--pm-s-1);          /* 8px */
}
.nx-title,
.nx-head h1,
.page-head h1 {
  font-family: var(--pm-font-display);
  font-size: var(--pm-fs-40);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: var(--pm-ink);
  margin: 0;
}
.nx-subtitle,
.page-head small {
  display: block;
  margin-top: var(--pm-s-1);             /* 8px */
  font-size: var(--pm-fs-16);
  line-height: 1.6;
  color: var(--pm-ink-2);
  max-width: 72ch;
}
.nx-head__actions {
  flex: 0 0 auto;                        /* o'ngga, pastga tekis */
  padding-bottom: 2px;                   /* baseline optik tuzatish */
}

@media (max-width: 899px) {
  .nx-title, .nx-head h1, .page-head h1 { font-size: var(--pm-fs-30); }
}
@media (max-width: 619px) {
  .nx-head, .page-head {
    flex-direction: column;
    align-items: stretch;
    gap: var(--pm-s-3);                  /* 16px */
  }
  .nx-head__actions .btn,
  .nx-head__actions .nx-btn,
  .page-head > .btn {
    width: 100%;                         /* bitta primary, to'liq kenglik */
    justify-content: center;
  }
}
```

---

## 5. Agentlarga topshiriq (kim nima qiladi)

| Agent fayli | Qaror |
|---|---|
| `02-topbar.css` | 64px balandlik, flex space-between, `--pm-shell-gutter`, surface fon, 1px `--pm-line`, 1439/899 mediani padding va streak/window yashirish |
| `03-nav.css` | Absolut markaz, pill yo'q, 2px accent underline, 1199 dan ikonka-only + a11y text, badge faqat nofaolda |
| `04-brand.css` | Mark 32px to'q rangli (gradient yo'q), Fraunces 18px nom, 240/200/160/auto/32 zonalar |
| `05-profile-popup.css` | Avatar 40→36px, `--pm-shadow-focus`, popup 264px kenglik saqlanadi |
| `06-window-controls.css` | 40×40 tugma, 1px divider, close hover accent-soft (qizil yo'q), ≤899 `display:none` |
| `07-page-header.css` | Yuqoridagi 4.6; `.nx-head` va `.page-head` ikkalasini qamrab ol |
| `34-responsive.css` | Yuqoridagi barcha `@media` larni bitta joyda takrorlamasin — faqat o'ziga tegishli qo'shimcha qoidalar; ustma-ust yozishdan saqlan |
| `00-tokens.css` (boshqa agent) | §6 dagi yangi tokenlarni qo'shish so'raladi |

**TSX o'zgartirish kerak emas.** Ikonka-only navda label `<span className="nav-txt">` clip-path bilan yashiriladi — screen reader uchun matn DOM da qoladi. `title` qo'shish ixtiyoriy, lekin URLni o'zgartirmaydi.

---

## 6. Yangi token so'rovi (Risks)

`00-tokens.css` ga qo'shish so'raladi (men yozmayman):
```css
--pm-topbar-h: 64px;      /* --pm-s-7 bilan bir xil, nom qulayligi uchun */
--pm-nav-h: 44px;         /* nav item va touch target */
--pm-control-h: 40px;     /* avatar + window control kvadrati */
--pm-brand-w: 240px;      /* reserved brand zone */
--pm-shell-max: 1440px;   /* sahifa/topbar umumiy chizig'i */
--pm-s-9: 96px;           /* sahifa pastki paddingi (spec matnida 96, tokenlar 80 gacha) */
```

**Xavflar:**
- `--pm-s-8` = 80px, lekin spec matnida pastki padding 96px. Men 96 ni literal ishlatdim; `--pm-s-9` qo'shilsa shunga almashtiriladi.
- `nx-head` va legacy `page-head` bir sahifada birga bo'lsa, ikkita 32px gap paydo bo'lishi mumkin — `07-page-header` agenti faqat `.nx-head` mavjud bo'lgan sahifalarda `.page-head` ni `display:none` qilmasin, aksincha ikkalasi uchun bir xil `margin-bottom:0` qoidasi yetarli.
- `max-width:1440px` 1440 da hech qanday gutter qoldirmaydi (faqat 32px ichki padding) — bu hozirgi screenshot bilan mos; keng ekranlarda (1600+) 112px chiziq paydo bo'ladi, bu editorial ko'rinish uchun ataylab.

## 7. Verification (ko'z oldiga keltirish)
- 1440: brand x≈32–272, nav x≈384–1056, right x≈1087–1408 → overlap yo'q.
- 900: brand 24–184, nav 324–576, right 700–876 → overlap yo'q.
- 620: brand 16–156, nav 192–428, avatar 568–604, window yo'q → 140px bo'sh.
- 375: brand 16–48, nav 69–305, avatar 323–359 → 21px bo'sh.
