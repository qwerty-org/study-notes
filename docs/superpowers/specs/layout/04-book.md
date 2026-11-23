# L04 — Book page: layout decisions

> Qarorlar hujjati. CSS faqat **paste-ready taklif** sifatida keltirilgan — amalda hech qaysi
> `.css` fayliga yozilmadi. Barcha o'lchamlar 8px gridga, ranglar/soyalar/radiuslar `--pm-*`
> tokenlariga bog'langan (`docs/superpowers/specs/2026-11-23-premium-design-system.md`).

## Global o'zgaruvchilar (qarorlarning asosi)

| Nom | Qiymat | Izoh |
|---|---|---|
| `--pm-page-wide` | `1200px` | `nx-page--wide` content maksimal kengligi, markazda |
| Side padding | `48px` (1440/900), `24px` (620/375) | sahifa ichki cheti |
| `--topbar-h` | mavjud layout token | sticky ofsetlar uchun (rang tokeni emas) |
| Sticky offset | `calc(var(--topbar-h) + 24px)` | sidebar / toolbar / tugun sarlavhalari |
| Grid | `8 / 12 / 16 / 24 / 32 / 48 / 64 / 80` | barcha vertikal/gorizontal ritm |
| Chiziq uzunligi | `66ch` (o'qish), `≤72ch` (yordamchi) | o'qish qog'ozi va izohlar |

**Editorial prinsip:** hero va o'qish qog'ozi ochiq qog'oz fonida (`--pm-bg`) yashaydi; karta
chegarasi/shadow faqat haqiqiy obyektlarda (kartochkalarda). Hero endi "kartalar to'plami" emas —
bitta katta sarlavha + muqova obyekti + nozik pastki chiziq.

---

## D1 — Book hero

**Qaror:** karta yuzi olib tashlanadi; hero = muqova obyekti + keng sarlavha kolonkasi + o'ngda
yagona asosiy harakat. Progress kolonkasi ichida yupqa bar, ring o'chiriladi (D6).

### O'lcham jadvali

| Breakpoint | Hero balandligi | Muqova (w×h) | Sarlavha kolonkasi | Sarlavha | Progress | Asosiy CTA |
|---|---|---|---|---|---|---|
| **1440** | `min-height:224px`, padding `32px 0` | `120×160` | `max-width:720px` | `40px` Fraunces | sarlavha ostida, bar `6px`, `max-width:480px`, label `14px` | o'ng kolonka `256px`, vertikal markazda, `48px` |
| **900** | auto ≈`200px`, padding `32px 0 24px` | `96×128` | fluid (1fr) | `30px` | sarlavha ostida, to'liq kenglik | 2-qator, chapga tekis, CTA `48px` + ghost `44px` yonma-yon |
| **620** | auto, padding `24px 0` | `72×96` | fluid | `30px` | to'liq kenglik | 2-qator, CTA `flex:1` to'liq kenglik, ghost ostida |
| **375** | auto, padding `24px 0` | `60×80` | fluid | `24px` | to'liq kenglik, bar `6px` | 2-qator, CTA va ghost to'liq kenglik, `gap:12px` |

### Wireframes

```
1440 — page 1200, otstup 48
┌────────────────────────────────────────────────────────────────────────┐
│ ‹ Kutubxonaga qaytish                             ─── 2px sticky line   │
│                                                                        │
│  ┌──────┐   [✦ Tahlil tayyor] [MD] [4 bob]              ┌────────────┐  │
│  │      │   ┌───────────────────────────────────────┐   │ ▶ O'qishni │  │
│  │ COV  │   │ 10 daqiqali odatlar: kichik qadamlar  │   │   boshlash │  │
│  │ 120  │   │ bilan katta o'zgarish          (40px)  │   └────────────┘  │
│  │  ×   │   └───────────────────────────────────────┘   [ Quiz ishlash] │
│  │ 160  │   Study Notes (demo) · 31.10.2026                            │
│  └──────┘   ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  0%                       │
│ ──────────────────────────── hairline ──────────────────────────────── │
└────────────────────────────────────────────────────────────────────────┘

900
┌──────────────────────────────────────────────┐
│ ┌───────┐ [✦ tayyor] [MD] [4 bob]            │
│ │ COV   │ 10 daqiqali odatlar…         30px  │
│ │ 96×128│ Study Notes (demo) · …             │
│ └───────┘ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬ 0%                  │
│ [ ▶ O'qishni boshlash ]  [ Quiz ishlash ]     │
│ ──────────────────────────────────────────────│
└──────────────────────────────────────────────┘

620 / 375
┌───────────────────────────────┐
│ ┌─────┐ [✦ tayyor] [MD]       │
│ │ COV │ 10 daqiqali odatlar…  │
│ │72×96│ (30/24px)             │
│ └─────┘ ▬▬▬▬▬▬▬ 0%            │
│ [ ▶ O'qishni boshlash      ]  │
│ [   Quiz ishlash            ] │
│ ─────────────────────────────  │
└───────────────────────────────┘
```

### Paste-ready CSS

```css
/* Base — editorial: karta yuzi yo'q, faqat pastki hairline */
.nx-book-hero{
  --hero-cover-w:120px; --hero-cover-h:160px;
  display:grid;
  grid-template-columns:var(--hero-cover-w) minmax(0,1fr) 256px;
  gap:32px;
  align-items:center;
  min-height:224px;
  padding:32px 0;
  background:transparent;
  border:0;
  border-bottom:1px solid var(--pm-line);
  border-radius:0;
  box-shadow:none;
  position:relative;
}
/* juda past kontrastli gradient — faqat hero'da */
.nx-book-hero::before{
  content:''; position:absolute; top:-32px; right:-48px;
  width:440px; height:280px; border-radius:50%;
  background:radial-gradient(circle at 70% 30%, var(--pm-accent-soft), transparent 70%);
  opacity:.6; pointer-events:none;
}
.nx-book-hero__cover{
  width:var(--hero-cover-w); height:var(--hero-cover-h);
  padding:12px; border-radius:4px 10px 10px 4px;
  color:var(--pm-surface); box-shadow:var(--pm-shadow-2);
}
.nx-book-hero__cover span{font:600 16px/1.3 var(--font-display); letter-spacing:-.02em;}
.nx-book-hero__cover small{font-size:12px; letter-spacing:.08em; opacity:.8;}
.nx-book-hero .nx-chip{height:28px; padding:0 12px; font-size:12px; border-radius:999px;}

.nx-book-hero__title{
  max-width:720px; margin:16px 0 8px;
  font:600 40px/1.1 var(--font-display); letter-spacing:-.035em;
  color:var(--pm-ink);
}
.nx-book-hero .nx-subtitle{font-size:16px; color:var(--pm-ink-2);}
.nx-book-hero__progress{
  display:flex; align-items:center; gap:16px;
  margin-top:24px; max-width:480px;
}
.nx-book-hero__progress .nx-progress{height:6px; flex:1; background:var(--pm-surface-2); border-radius:999px;}
.nx-book-hero__progress > span{font-size:14px; font-variant-numeric:tabular-nums; color:var(--pm-ink-2);}

.nx-book-hero__action{
  align-self:center; display:flex; flex-direction:column; align-items:flex-end;
  gap:16px; position:relative; z-index:1;
}
.nx-book-hero__action .nx-ring{display:none;} /* D6: ring duplikatsiyasi */
.nx-book-hero .nx-btn--primary{height:48px; padding:0 24px; border-radius:12px; font-size:14px;}
.nx-book-hero .nx-btn--ghost{height:44px; border:1px solid var(--pm-line); border-radius:10px; color:var(--pm-ink-2);}

@media (max-width:900px){
  .nx-book-hero{--hero-cover-w:96px; --hero-cover-h:128px; grid-template-columns:96px minmax(0,1fr); min-height:0; padding:32px 0 24px;}
  .nx-book-hero__title{font-size:30px; max-width:none;}
  .nx-book-hero__action{grid-column:1 / -1; flex-direction:row; align-items:center; justify-content:flex-start; gap:16px;}
}
@media (max-width:620px){
  .nx-book-hero{--hero-cover-w:72px; --hero-cover-h:96px; gap:16px; padding:24px 0;}
  .nx-book-hero__title{font-size:30px;}
}
@media (max-width:420px){
  .nx-book-hero{--hero-cover-w:60px; --hero-cover-h:80px; gap:16px;}
  .nx-book-hero__title{font-size:24px;}
  .nx-book-hero__action{flex-direction:column; align-items:stretch;}
  .nx-book-hero__action .nx-btn{width:100%; justify-content:center;}
}
```

---

## D2 — Tab bar

**Qaror:** oddiy matnli navigatsiya (pill/outline yo'q), chapga tekis, pastki 2px `--pm-accent`
chiziq faollik belgisi. Badge faqat **faol bo'lmagan** tablarda. 375 da **wrap emas, gorizontal
scroll** + snap + o'ng chet fade.

### O'lcham jadvali

| Breakpoint | Joylashuv | Balandlik | Hizalama | Tab orasi | Badge | 375 хatti |
|---|---|---|---|---|---|---|
| **1440** | hero ostida, hairline ustida | `48px` | start (chap) | `24px` | inactive: `20×20px`, `12px`; active: yashiriladi | — |
| **900** | bir xil | `48px` | start | `24px` | bir xil | — |
| **620** | bir xil | `48px` | start | `24px` | bir xil | — |
| **375** | bir xil | `48px` (touch `≥44`) | start | `24px` | bir xil | `overflow-x:auto`, `scroll-snap-type:x proximity`, o'ng fade `24px`, scrollbar yashiriladi |

**Soon tab ("AI ustoz"):** `13px --pm-ink-3`, `opacity:.6`, yonida kichik `tez orada` yozuvi
`12px --pm-brass`, fon yo'q, `text-transform:none` (ALL CAPS taqiqlangan).

### Wireframes

```
1440 / 900 / 620
┌─────────────────────────────────────────────────────────────────────┐
│ O'qish   Xulosalar 12   Terminlar 8   Quiz 8   Hayotda qo'llash 6  AI ustoz tez orada │
│ ▔▔▔▔▔▔                                                              │
└─────────────────────────────────────────────────────────────────────┘
 ↑ faol: to'q matn + 2px accent chiziq; badge faqat faol bo'lmaganlarda

375 (scroll, fade)
┌──────────────────────────────────┐
│ O'qish  Xulosalar 12  Terminlar  │▓ → fade
│ ▔▔▔▔▔▔                           │
└──────────────────────────────────┘
   ← gorizontal scroll, snap; faol tab avtomatik ko'rinishga keltiriladi
```

### Paste-ready CSS

```css
.nx-book-tabs{
  display:flex; align-items:flex-end; gap:24px;
  height:48px; margin:0 0 32px;
  border-bottom:1px solid var(--pm-line);
  overflow:visible; scroll-margin-top:calc(var(--topbar-h) + 24px);
}
.nx-book-tab{
  position:relative; display:inline-flex; align-items:center; gap:8px;
  height:48px; padding:0 0 14px;
  border:0; background:none;
  font:600 14px var(--font-ui); color:var(--pm-ink-3);
  white-space:nowrap; cursor:pointer;
}
.nx-book-tab.is-active{color:var(--pm-ink);}
.nx-book-tab.is-active::after{
  content:''; position:absolute; left:0; right:0; bottom:-1px;
  height:2px; border-radius:2px; background:var(--pm-accent);
}
.nx-book-tab__count{
  display:grid; place-items:center;
  min-width:20px; height:20px; padding:0 6px;
  border-radius:999px; background:var(--pm-surface-2);
  font:700 12px var(--font-ui); font-variant-numeric:tabular-nums;
  color:var(--pm-ink-3);
}
.nx-book-tab.is-active .nx-book-tab__count{display:none;}
.nx-book-tab.is-soon{opacity:.6; cursor:not-allowed; color:var(--pm-ink-3);}
.nx-book-tab__soon{font-size:12px; color:var(--pm-brass); background:none; padding:0; text-transform:none;}

@media (max-width:420px){
  .nx-book-tabs{
    overflow-x:auto; overflow-y:hidden;
    scrollbar-width:none; scroll-snap-type:x proximity;
    -webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent);
            mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent);
  }
  .nx-book-tabs::-webkit-scrollbar{display:none;}
  .nx-book-tab{scroll-snap-align:start; min-height:44px;}
}
```

---

## D3 — Reader layout

**Qaror:** 1440 da ikki ustun (sidebar + qog'oz); marginalia faqat `≥1500px` da uchinchi ustun.
O'qish qog'ozi main kolonkasi ichida markazda, `66ch`, oq qog'oz yuzi. Toolbar va qog'oz orasi
`24px`, sticky ofset `--topbar-h + 24px`.

### O'lcham jadvali

| Breakpoint | Grid | Sidebar | Main | Notes | Gap | Qog'oz `max-width` | Qog'oz padding | Toolbar→qog'oz |
|---|---|---|---|---|---|---|---|---|
| **1440** | `240px minmax(0,1fr)` | `240px` | `928px` | yashirilgan | `32px` | `66ch` (~`660px`) | `48px 48px` | `24px` |
| **≥1500** (qo'shimcha) | `240px minmax(0,1fr) 240px` | `240px` | `656px` | `240px` | `32px` | `66ch` | `48px 40px` | `24px` |
| **900** | `1fr` | toggle overlay | to'liq | yashirilgan | — | `66ch` | `32px 32px` | `24px` |
| **620** | `1fr` | toggle overlay | to'liq | yashirilgan | — | `66ch` | `24px 24px` | `16px` |
| **375** | `1fr` | toggle overlay | to'liq | yashirilgan | — | `66ch` | `24px 20px` | `16px` |

### Wireframes

```
1440 (page 1200)
┌──────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR 240  │  ┌── toolbar 56px ──────────────────────────────┐  │
│ sticky       │  │ ☰ Bob 1/4 · Od at…      [1/1] [A- Aa A+] ✎ 🔖 │  │
│ ┌ progress ┐ │  └──────────────────────────────────────────────┘  │
│ │ 0/4 bob  │ │            ↕ 24px                                  │
│ └──────────┘ │      ┌───────────────────────────┐                 │
│ BOBLAR       │      │      O'QISH QOG'OZI       │                 │
│ 1 ▸ ...      │      │      max 66ch, 48px       │                 │
│ 2   ...      │      │   Har bir odam kuniga…    │                 │
│ 3   ...      │      │   (Fraunces, 1.75)        │                 │
│ 4   ...      │      └───────────────────────────┘                 │
└──────────────┴────────────────────────────────────────────────────┘

≥1500:  [sidebar 240] [main 656 — qog'oz] [marginalia 240]

900 / 620 / 375
┌──────────────────────────────────────────────┐
│ ☰ Bob 1/4 · Od at…        [1/1] [A- Aa A+] 🔖│  toolbar
│            ↕ 24 / 16px                        │
│      ┌──────────────────────────┐            │
│      │   O'QISH QOG'OZI 66ch    │            │
│      │   padding 32 / 24 / 20   │            │
│      └──────────────────────────┘            │
└──────────────────────────────────────────────┘
 ☰ bosilganda TOC yuqorida ochiladi (overlay emas, inline panel)
```

### Paste-ready CSS

```css
.nx-reader{
  display:grid;
  grid-template-columns:240px minmax(0,1fr);
  gap:32px; align-items:start;
}
.nx-reader--wide{grid-template-columns:240px minmax(0,1fr);}

.nx-reader-side{
  position:sticky; top:calc(var(--topbar-h) + 24px);
  width:240px; max-height:calc(100vh - var(--topbar-h) - 48px);
  overflow-y:auto;
  display:flex; flex-direction:column; gap:16px;
  padding:24px;
  background:var(--pm-surface);
  border:0; border-radius:16px; box-shadow:var(--pm-shadow-1);
}
.nx-reader-side__label{font-size:12px; font-weight:700; color:var(--pm-ink-3); text-transform:none; letter-spacing:0;}
.nx-reader-progress b{font:600 20px var(--font-display); font-variant-numeric:tabular-nums; color:var(--pm-ink);}
.nx-reader-progress span{font-size:13px; color:var(--pm-ink-3);}
.nx-toc__item{font-size:14px; padding:8px 12px; border-radius:10px; color:var(--pm-ink-2);}
.nx-toc__item.is-active{background:var(--pm-accent-soft); color:var(--pm-accent);}
.nx-toc__num{width:24px; height:24px; font-size:12px; border-radius:8px;}

.nx-reader-main{min-width:0;}
.nx-reader-toolbar{margin-bottom:24px;} /* → D4 */

.nx-reader-paper{
  max-width:66ch; margin:0 auto;
  padding:48px 48px;
  background:var(--pm-surface);
  border:0; border-radius:16px; box-shadow:var(--pm-shadow-2);
  font:430 18px/1.75 var(--font-display);
  color:var(--pm-ink);
}
.nx-reader-paper h2{font-size:30px;} /* type scale */
.nx-reader-paper h3{font-size:20px;}
.nx-reader-paper p{margin:0 0 1.4em; text-wrap:pretty;}
.nx-reader-footer{max-width:66ch; margin:24px auto 0;}

/* marginalia faqat juda keng ekranda */
.nx-reader-notes{display:none;}
@media (min-width:1500px){
  .nx-reader{grid-template-columns:240px minmax(0,1fr) 240px;}
  .nx-reader-notes{
    display:flex; flex-direction:column; gap:16px;
    position:sticky; top:calc(var(--topbar-h) + 24px);
    width:240px; max-height:calc(100vh - var(--topbar-h) - 48px);
    overflow-y:auto; padding:24px;
    background:var(--pm-surface); border:0; border-radius:16px; box-shadow:var(--pm-shadow-1);
  }
}

@media (max-width:900px){
  .nx-reader,.nx-reader--wide{grid-template-columns:minmax(0,1fr);}
  .nx-reader-side{position:relative; top:0; width:100%; max-height:320px; margin-bottom:24px;}
  .nx-reader-side.is-collapsed{display:none;}
  .nx-reader-paper{padding:32px 32px;}
}
@media (max-width:620px){
  .nx-reader-toolbar{margin-bottom:16px;}
  .nx-reader-paper{padding:24px 24px;}
}
@media (max-width:420px){
  .nx-reader-paper{padding:24px 20px;}
}
```

---

## D4 — Reader toolbar

**Qaror:** bitta qator, `56px`. Chapda **bob navigatsiyasi toggle** (`≤900` da ko'rinadi) + bob
sarlavhasi; o'ngda sahifa ko'rsatkichi, A−/Aa/A+ segmenti, ikonka tugmalar. `620` da ikki qatorga
o'tadi, `375` da teginish maydonlari `40px` bo'lib qoladi.

### O'lcham jadvali

| Breakpoint | Toolbar balandligi | Chap tomon | O'ng tomon | Wrap |
|---|---|---|---|---|
| **1440** | `56px` | bob label (eyebrow `12px` accent + title `16px`) | `[1/1]` chip `28px` · `A− Aa A+` `40×40` · `✎` `40×40` · `🔖` `40×40` | yo'q |
| **900** | `56px` | `☰` toggle `40×40` + bob label | bir xil | yo'q |
| **620** | `104px` (2 qator) | 1-qator: `☰` + label (to'liq kenglik) | 2-qator: AA + ikonkalar + chip | `flex-wrap:wrap`, `row-gap:8px` |
| **375** | `104px` (2 qator) | bir xil | bir xil; AA tugmalari `40×40` (qisqartirilmaydi) | bir xil |

**Chapter nav toggle joylashuvi:** toolbarning **eng chapidan**, `40×40`, `IconList`, `aria-controls`
sidebar ID siga, `aria-expanded` sidebar holatiga bog'lanadi. `>900` da yashiriladi (sidebar doim ko'rinadi).

### Wireframes

```
1440
┌──────────────────────────────────────────────────────────────────┐
│ Bob 1 / 4                             [1/1 sahifa] [A-│Aa│A+] ✎ 🔖 │ 56px
│ Od atlama va nima uchun muhim                                    │
└──────────────────────────────────────────────────────────────────┘

900
┌──────────────────────────────────────────────────────────────────┐
│ ☰ │ Bob 1 / 4 · Od atlama…        [1/1] [A-│Aa│A+] ✎ 🔖          │ 56px
└──────────────────────────────────────────────────────────────────┘

620 / 375
┌──────────────────────────────────┐
│ ☰  Bob 1 / 4 · Od atlama…        │ 48px
├──────────────────────────────────┤
│ [A-│Aa│A+]  ✎  🔖       [1/1]     │ 48px  (row-gap 8px)
└──────────────────────────────────┘
```

### Paste-ready CSS

```css
.nx-reader-toolbar{
  display:flex; align-items:center; flex-wrap:nowrap; gap:8px;
  height:56px; padding:0 12px;
  background:var(--pm-surface); border:0; border-radius:12px; box-shadow:var(--pm-shadow-1);
}
.nx-reader-toolbar__title{flex:1; min-width:0; display:flex; flex-direction:column;}
.nx-reader-toolbar__title b{font:700 12px var(--font-ui); color:var(--pm-accent);}
.nx-reader-toolbar__title span{font:600 16px var(--font-display); color:var(--pm-ink); overflow:hidden; text-overflow:ellipsis;}
.nx-reader-toolbar .nx-chip{height:28px; padding:0 12px; font-size:12px; background:var(--pm-surface-2); color:var(--pm-ink-2); border-radius:999px;}
.nx-reader-aa{display:inline-flex; border:1px solid var(--pm-line); border-radius:10px; overflow:hidden;}
.nx-reader-aa button{
  width:40px; height:40px; border:0; border-right:1px solid var(--pm-line);
  background:var(--pm-surface); color:var(--pm-ink-2);
  font:700 13px var(--font-display); cursor:pointer;
}
.nx-reader-aa button:last-child{border-right:0;}
.nx-reader-toolbar .nx-icon-btn{width:40px; height:40px; flex-shrink:0;}
.nx-toc-toggle{display:none;} /* >900 */
@media (max-width:900px){
  .nx-toc-toggle{
    display:inline-grid; place-items:center;
    width:40px; height:40px; flex-shrink:0;
    border:1px solid var(--pm-line); border-radius:10px;
    background:var(--pm-surface); color:var(--pm-ink-2);
  }
}
@media (max-width:620px){
  .nx-reader-toolbar{height:auto; min-height:104px; flex-wrap:wrap; row-gap:8px; padding:12px;}
  .nx-reader-toolbar__title{flex:1 1 calc(100% - 48px);}
  .nx-reader-aa button{width:40px;} /* 36px ga qisqartirilmaydi */
}
@media (max-width:420px){
  .nx-reader-toolbar{padding:8px; gap:8px;}
}
```

---

## D5 — Kontent kartalari

**Qaror:** barcha kartalar `--pm-surface`, `radius:16px`, `padding:24px` (mobil `20px`),
`--pm-shadow-1`, **border yo'q**. Ichki label `12px` sentence-case (ALL CAPS emas). Ko'rsatish
(reveal) harakatlari matnli link yoki ghost tugma — karta ichida yana karta emas.

### D5.1 G'oyalar (ideas)

| Breakpoint | Ustunlar | Gap | Karta ichki | Reveal |
|---|---|---|---|---|
| **1440** | `3` (`minmax(320px,1fr)`) | `24px` | `24px`, qator orasi `16px` | pastki link `14px/700 accent` |
| **900** | `2` | `24px` | `24px` | bir xil |
| **620 / 375** | `1` | `16px` | `20px` | bir xil, tugma to'liq kenglik |

### D5.2 Terminlar (terms)

| Breakpoint | Ustunlar | Gap | Karta balandligi | Reveal |
|---|---|---|---|---|
| **1440** | `4` (`minmax(280px,1fr)`) | `24px` | `min-height:152px`, padding `24px` | klik → `is-open`, `--pm-accent-soft` fon, metafora ochiladi |
| **900** | `2` | `24px` | `min-height:152px` | bir xil |
| **620 / 375** | `1` | `16px` | `auto`, padding `20px` | bir xil |

### D5.3 Vaziyatlar (scenarios / apply)

| Breakpoint | Ustunlar | Gap | Reveal tugmasi | Ochilgan panellar |
|---|---|---|---|---|
| **1440** | `2` (`minmax(480px,1fr)`) | `24px` | ghost `44px`, chapda | `1fr 1fr`, gap `16px` |
| **900 / 620 / 375** | `1` | `16px` | ghost `44px`, to'liq kenglik | `1fr` (stack) |

### D5.4 Marginalia (faqat `≥1500`)

| Breakpoint | Joylashuv | Kenglik | Karta | Reveal |
|---|---|---|---|---|
| **≥1500** | o'ng ustun, sticky | `240px` | padding `16px`, radius `10px`, chap `2px accent`, `--pm-shadow-1` | `12px accent` link → Apply tab |
| **1440 va kichik** | yashirilgan (D3) | — | — | — |

### Wireframes

```
1440 — g'oyalar (3)              terminlar (4)              vaziyatlar (2)
┌────────┬────────┬────────┐   ┌─────┬─────┬─────┬─────┐   ┌────────────┬────────────┐
│ 01     │ 02     │ 03     │   │     │     │     │     │   │ Vaziyat 1  │ Vaziyat 2  │
│ Sarlavh│        │        │   │ Atama│ ... │ ... │ ... │   │ matn…      │ matn…      │
│ ─────  │        │        │   │ Ta'rif│    │     │     │   │ [Javobni   │ [Javobni   │
│ izoh…  │        │        │   │ [ko'rish]   │     │     │   │  ko'rish]  │  ko'rish]  │
│ [Qo'llash] →    │        │   └─────┴─────┴─────┴─────┘   └────────────┴────────────┘
└────────┴────────┴────────┘

reveal (vaziyat):
┌──────────────────────────────┐
│ Vaziyat matni…               │
│ [ Javobni ko'rish ]          │
│ ┌────────────┬────────────┐  │
│ │ ✓ To'g'ri  │ ✕ Noto'g'ri│  │  ≤900: stack
│ │ sage-soft  │ accent-soft│  │
│ └────────────┴────────────┘  │
└──────────────────────────────┘
```

### Paste-ready CSS

```css
/* umumiy karta */
.nx-idea-card,.nx-term-card,.nx-scenario,.nx-marginalia{
  background:var(--pm-surface);
  border:0; border-radius:16px; box-shadow:var(--pm-shadow-1);
  padding:24px;
}
.nx-idea-card__label,.nx-term-card__from,.nx-marginalia-label{
  font:700 12px var(--font-ui); color:var(--pm-ink-3);
  text-transform:none; letter-spacing:0;
}
.nx-idea-card__row p,.nx-term-card__def,.nx-scenario__side p{font-size:14px; line-height:1.6; color:var(--pm-ink-2);}
.nx-idea-card h4{font:600 18px/1.35 var(--font-display); color:var(--pm-ink);}

.nx-idea-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:24px;}
.nx-idea-card{gap:16px;}
.nx-idea-card__row{padding-left:16px; border-left:2px solid var(--pm-line); gap:4px;}
.nx-idea-card__foot{margin-top:auto; padding-top:16px; border-top:1px solid var(--pm-line);}
.nx-link-btn{font:700 14px var(--font-ui); color:var(--pm-accent); gap:8px;}

.nx-terms-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:24px;}
.nx-term-card{min-height:152px; gap:12px;}
.nx-term-card__term{font:600 20px var(--font-display); color:var(--pm-ink);}
.nx-term-card__hint{font:700 13px var(--font-ui); color:var(--pm-accent);}
.nx-term-card.is-open{background:var(--pm-accent-soft);}

.nx-apply-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(480px,1fr)); gap:24px; align-items:start;}
.nx-scenario__text{font:400 16px/1.5 var(--font-display); color:var(--pm-ink);}
.nx-scenario__reveal-btn{height:44px; padding:0 16px; border:1px solid var(--pm-line); border-radius:10px; background:transparent; color:var(--pm-ink-2); font:700 14px var(--font-ui);}
.nx-scenario__reveal{display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;}
.nx-scenario__side{padding:16px; border-radius:10px;}
.nx-scenario__side--right{background:color-mix(in srgb,var(--pm-sage) 12%,var(--pm-surface)); color:var(--pm-sage);}
.nx-scenario__side--wrong{background:var(--pm-accent-soft); color:var(--pm-accent);}
.nx-scenario__side b{font:700 13px var(--font-ui); text-transform:none; letter-spacing:0;}

.nx-marginalia{padding:16px; border-left:2px solid var(--pm-accent); border-radius:10px; box-shadow:var(--pm-shadow-1);}
.nx-marginalia p{font-size:13px; line-height:1.55; color:var(--pm-ink-2);}

@media (max-width:900px){
  .nx-apply-grid{grid-template-columns:minmax(0,1fr);}
  .nx-scenario__reveal{grid-template-columns:minmax(0,1fr);}
}
@media (max-width:620px){
  .nx-idea-grid,.nx-terms-grid{grid-template-columns:minmax(0,1fr); gap:16px;}
  .nx-idea-card,.nx-term-card,.nx-scenario{padding:20px;}
  .nx-scenario__reveal-btn{width:100%; justify-content:center;}
}
```

---

## D6 — Kamroq ko'zga tashlanadigan elementlar (clutter reduction)

| Element | Qaror | Sabab |
|---|---|---|
| Hero `Ring 72px` | **O'chiriladi** | progress bar + sticky chiziq bilan duplikatsiya |
| Sidebar progress ring | **Matnga almashtiriladi** (`0 / 4 bob`, `20px` tabular) | ikkinchi ring -> shovqin |
| Sticky yuqori chiziq | `4px → 2px`, `--pm-accent`, opaque | ko'zga kam tashlanadi, lekin doim ko'rinadi |
| Faol tab badge | **Yashiriladi** (D2) | faollik chiziq bilan allaqachon aniq |
| Barcha karta borderlari | **Olib tashlanadi**, faqat `--pm-shadow-1` | "kartalar to'lgan" muammosi |
| Kichik label `9.5–11px` | `12px`, sentence-case | o'qiluvchanlik, ALL CAPS yo'q |
| "AI ustoz" soon chip | och sariq fondan `12px --pm-brass` matnga | ranglar soni 2 tagacha |
| A−/Aa/A+ | nozik segmented (`1px --pm-line`) | yagona e'tibor markazi — o'qish matni |
| Hero gradient | `.6` opacity li radial, faqat hero | qolgan hamma yerda gradient yo'q |

### Paste-ready CSS

```css
/* ring lar butunlay o'chiriladi (faqat book kontekstida) */
.nx-book-hero .nx-ring,
.nx-reader-progress .nx-ring{display:none;}

.nx-book-progress{height:2px; background:var(--pm-surface-2);}
.nx-book-progress__fill{background:var(--pm-accent); border-radius:999px;}

/* progress endi faqat matn — ring o'rniga */
.nx-reader-progress b{font:600 20px var(--font-display); font-variant-numeric:tabular-nums;}
.nx-reader-progress span{font-size:13px; color:var(--pm-ink-3);}

/* barcha mahalliy kartalarda border yo'q */
.nx-book .nx-card,
.nx-book [class*='-card']{border:0;}
```

---

## Xulosalar / xavflar

- **Findings:** screenshot dagi asosiy muammo — hero "karta ichida karta", ikkita progress ring va
  kichik kulrang label/raqamlar. Qarorlar bularni yo'q qilib, bitta e'tibor markazini (sarlavha +
  o'qish matni) qoldiradi.
- **Risks:** (1) `.nx-book-tabs` da `overflow-x:auto` faqat `≤420px` — 620 da hamma tab sig'adi;
  (2) marginalia `1440` da ko'rinmaydi (faqat `≥1500`) — bu o'qish qog'oziga e'tiborni qaratish
  uchun qasddan; (3) `nx-toc-toggle` yangi klass — TSX da qo'shilishi kerak (summary da bildirildi).
- **Verification:** har bir breakpoint uchun `1440 / 900 / 620 / 375` da hero balandligi, tab
  wrap/scroll, qog'oz `66ch`, toolbar 1↔2 qator va karta ustunlari soni yuqoridagi jadvalidan
  tekshiriladi. Hech qanday gorizontal oqish bo'lmasligi kerak.
