# Study Notes — Professional UI/UX Polish (50-agent, conflict-free) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the existing "Iliq qog'oz stoli" Study Notes UI to consistent professional quality — accessible, responsive, coherent, bug-free — without replacing its established visual identity.

**Architecture:** Keep the current React/Vite SPA, the `nx-` design system layered over legacy CSS, and the terracotta/Fraunces/Manrope identity. Work is split by **exclusive file ownership**: every agent owns a disjoint set of files and may only write those files. All other files are read-only context. This makes 50 concurrent agents conflict-free by construction.

**Tech Stack:** React 18 + TypeScript + Vite 8 + react-router-dom (HashRouter), CSS custom properties, `@fontsource-variable` (Manrope, Fraunces), `dompurify`, workspaces `@study-notes/core` + `@study-notes/ai`.

**Spec:** `docs/04-ui-ux.md` (design principles + implemented state), `docs/01-vision.md`, `apps/desktop/src/styles/theme.css` + `apps/desktop/src/styles/nx/foundation.css` (token source of truth).

---

## Global Constraints (every agent MUST obey)

1. **Fayl egaligi (file ownership):** Write ONLY to the files listed in your assignment's `Exclusive write scope`. Reading any other file is allowed and encouraged. Writing, creating, or deleting any other file is FORBIDDEN. This is the single rule that guarantees zero conflicts.
2. **No signature/API changes:** Do not change exported names, function signatures, prop names, route paths, CSS class names consumed by other files, or JSON schema keys. Additive-only. If a change would require it, stop and report that in your summary instead.
3. **No new dependencies.** No `npm install`. No new imports from packages not already in `package.json`.
4. **Use existing tokens.** Reuse `--primary`, `--text`, `--border`, `--r-*`, `--nx-*` etc. Never introduce a competing hardcoded color where a token exists. New tokens belong only to the owner of `theme.css` / `foundation.css`; everyone else reports the need.
5. **Uzbek copy:** All user-facing strings in Uzbek, sentence case, plain language, no API/provider jargon in the UI. Active voice. Buttons say exactly what they do.
6. **Accessibility floor (WCAG 2.1 AA intent):** every interactive element keyboard-operable with a visible `:focus-visible` state; icon-only controls have `aria-label`; toggles carry `aria-checked`/`aria-pressed`; modals trap focus and close on Escape; contrast meets AA. Respect `prefers-reduced-motion`.
7. **Responsive:** no horizontal overflow at 1280 / 900 / 620 / 375 px; preserve existing breakpoints; test mentally against `.nx-page`, `.nx-grid--*`, `.nx-head` rules in `foundation.css`.
8. **Motion restraint:** one purposeful motion moment per view max. No generic fade-and-slide on every card. Do not remove existing page entrance animation.
9. **Small, reviewable diffs.** Polish, do not rewrite. Prefer fixing concrete defects over stylistic preference. Keep the existing structure and naming.
10. **Return format:** a short structured summary — `Findings`, `Changes`, `Risks / needs-owner-action`, `Verification`.

## Review Focus (input classes most likely to bite a user)

- **Dark mode contrast** — text/chips on `--card` in `[data-theme='dark']` must stay legible; owner A01/A02, verified in each page agent's summary.
- **Keyboard-only quiz/review flow** — options selectable with 1–4, navigation with Enter/Esc, focus never trapped; owners A16/A17/A11.
- **Narrow viewport (375px)** — topbar nav + window controls + avatar must not overflow; owner A04.
- **Empty/error/loading states** — every list and async view shows a next action, not a blank area; owners A07–A13.
- **Undefined CSS custom properties** — e.g. `--nx-r-pill` used but never defined in `foundation.css`; owner A02, swept by all CSS owners.

## Verification (integration, done by coordinator after all waves)

- `npm run build --prefix <repo>` → `tsc --noEmit && vite build` must pass (baseline captured: PASS, `dist/assets/index-*.js` ~485 kB).
- `git diff --stat` reviewed for unexpected files (any file outside the 50 scopes is a violation).
- Cross-file token sweep: `grep -Rho 'var(--[a-zA-Z0-9-]*)' src/styles | sort -u` vs `grep -Rho -- '--[a-zA-Z0-9-]*:' src/styles | sort -u` — report undefined tokens.
- Accessibility sweep: count of buttons without accessible name, `onClick` on non-interactive elements, images without `alt`.

---

## Agent Assignment Matrix (50 agents, disjoint scopes)

### Squad 1 — Design system & shell

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A01 | `apps/desktop/src/styles/theme.css` | Token source of truth. Fix duplicate `--green` override (line 42 vs 51), verify light+dark contrast for text/muted/faint/primary on backgrounds, align `--shadow-*`, radius scale, topbar height. Add missing tokens only if used by consumers; report consumers that misuse tokens. |
| A02 | `apps/desktop/src/styles/nx/foundation.css` | Shared `nx-` primitives. **Fix undefined `--nx-r-pill`** used by `.nx-chip` (define it or replace with `var(--r-pill)`). Sweep all `var(--nx-*)` references for definitions. Hardened focus states, reduced-motion, responsive grid rules, modal/toast a11y. |
| A03 | `apps/desktop/src/styles/global.css` | Legacy 2618-line stylesheet. Remove dead/duplicate selectors that conflict with `nx-`, normalize focus/outline, form controls, scrollbars, responsive rules — scoped strictly to this file. Do not touch selectors owned by `theme.css`/`foundation.css` (report overlaps). |
| A04 | `apps/desktop/src/components/Layout.tsx` | App shell: topbar, centered nav, avatar popup, window controls. Add skip-link target support, outside-click/Escape, `aria-current` for nav, focus return on popup close, mobile overflow fix. Keep `isActive` logic and route paths unchanged. |
| A05 | `apps/desktop/src/App.tsx` | Routing/gate. Add document title per route and focus management on navigation (focus main heading) without changing routes, Gate logic, or provider structure. |
| A06 | `apps/desktop/src/main.tsx`, `apps/desktop/index.html`, `apps/desktop/vite.config.ts`, `apps/desktop/tsconfig.json`, `apps/desktop/package.json`, **new** `apps/desktop/src/components/ErrorBoundary.tsx` | Entry + config. Add an ErrorBoundary wrapping `<App/>`, lang/theme meta in `index.html`, verify TS strictness and build config. No dependency changes. |

### Squad 2 — Pages (each owns page TSX + its `nx-` CSS)

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A07 | `apps/desktop/src/pages/Dashboard.tsx` | The only page not rebuilt in `nx-` system. Bring to the same professional bar: clear daily loop (read → review → apply), single primary CTA, accessible progress, empty/loading/error states, consistent tokens, responsive blocks. Keep data flow and store API unchanged. |
| A08 | `apps/desktop/src/pages/Onboarding.tsx`, `apps/desktop/src/styles/nx/onboarding.css` | 3-step wizard. Step indicators with `aria-current`, keyboard flow, inline validation, clear "why we ask for a key" copy, responsive 2→1 column, no dead ends. |
| A09 | `apps/desktop/src/pages/Library.tsx`, `apps/desktop/src/styles/nx/library.css` | Library. Drag & drop + keyboard-accessible file picker, filter/search state announced, grid/list toggle with `aria-pressed`, empty state with next action, import progress feedback. |
| A10 | `apps/desktop/src/pages/Book.tsx`, `apps/desktop/src/styles/nx/book.css` | Book heart (936-line CSS). Reading focus, 6-tab semantics (`role="tablist"`/`tab`/`tabpanel`), sticky progress, quote/idea/apply markers consistency, reader typography (line length, leading), responsive. Keep tab ids and data shape stable. |
| A11 | `apps/desktop/src/pages/Repeat.tsx`, `apps/desktop/src/styles/nx/repeat.css` | Review session + queue + interval viz. Keyboard flow, due-count accuracy, session completion/empty states, clear interval explanation in plain Uzbek. |
| A12 | `apps/desktop/src/pages/Stats.tsx`, `apps/desktop/src/styles/nx/stats.css` | Stats. Chart accessibility (text alternative / table), "applied" journal first, streak/badges semantics, export feedback, responsive chart. |
| A13 | `apps/desktop/src/pages/Settings.tsx`, `apps/desktop/src/styles/nx/settings.css` | Settings. Grouped two-column, in-app confirm modal (never native `confirm`), connection check feedback, secret masking, keyboard focus, responsive. |

### Squad 3 — Components

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A14 | `apps/desktop/src/components/nx/BookTabs.tsx` | 581-line tab system. Correct ARIA tab pattern, arrow-key navigation, focus management, tab panel labelling, no nested interactive controls. Do not edit `book.css` (owned by A10). |
| A15 | `apps/desktop/src/components/BookTabs.tsx` | Legacy tabs. Align semantics with A14, remove duplicate/conflicting markup, keep exported props identical. |
| A16 | `apps/desktop/src/components/nx/QuizRunner.tsx`, `apps/desktop/src/styles/nx/quiz.css` | Fullscreen quiz. 1–4 option keys, Enter/Esc, progress announcement, correct/incorrect feedback with reason, weak-topic result screen, reduced-motion, responsive. |
| A17 | `apps/desktop/src/components/QuizRunner.tsx` | Legacy quiz runner. Same a11y bar as A16, keep props/exports stable. |
| A18 | `apps/desktop/src/components/nx/NxUI.tsx` | Shared primitives. Consistent focus/disabled/loading states, forwardRef where useful, accessible polymorphic `as`, no breaking prop changes. |
| A19 | `apps/desktop/src/components/nx/icons.tsx` | Icon set. Consistent `aria-hidden` default, stroke sizes, `currentColor`, no hardcoded colors, named exports unchanged. |
| A20 | `apps/desktop/src/components/icons.tsx` | Legacy icons. Same rules as A19; keep all exported names identical. |
| A21 | `apps/desktop/src/components/ui.tsx` | Legacy UI primitives. Accessibility + token consistency; no export changes. |

### Squad 4 — App lib & store

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A22 | `apps/desktop/src/store/AppStore.tsx` | State container. Robust persistence hydration, no crash on corrupt storage, stable context API, derived due-count correctness, no new exported names. |
| A23 | `apps/desktop/src/lib/useAnalyze.ts` | Analysis hook. Progress states, cancellation, user-readable error mapping (no raw API errors), no signature changes. |
| A24 | `apps/desktop/src/lib/md.ts` | Markdown/sanitize. Safe DOMPurify config for cited content, no XSS, stable exports. |
| A25 | `apps/desktop/src/lib/nxDate.ts` | Local-date helpers. Timezone-safe (no UTC drift), stable exports. |
| A26 | `apps/desktop/src/lib/windowControls.ts` | Tauri window controls capability detection + safe no-op fallback in browser. |
| A27 | `apps/desktop/src/rules.ts`, `apps/desktop/src/seed.ts` | Rule loading + demo seed. Uzbek content quality, valid data shapes, deterministic seed. |

### Squad 5 — `@study-notes/core`

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A28 | `packages/core/src/types.ts` | Type contracts. Add docs/tighten types additively only — no renamed/removed exports (many consumers). |
| A29 | `packages/core/src/storage.ts` | Local persistence. Corrupt/missing data resilience, schema version tolerance. |
| A30 | `packages/core/src/repetition.ts` | Spaced repetition. Local-date due calculation, edge cases (0 reviews, future dates). |
| A31 | `packages/core/src/parsing.ts` | Book/chunk parsing. Robust against malformed input, stable exports. |
| A32 | `packages/core/src/date.ts` | Date utils. Local-timezone correctness. |
| A33 | `packages/core/src/index.ts`, `packages/core/package.json` | Barrel exports + package metadata. Additive exports only. |

### Squad 6 — `@study-notes/ai`

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A34 | `packages/ai/src/providers.ts` | Provider adapters. Clear error classes, timeout/cancel handling, no key leakage in logs. |
| A35 | `packages/ai/src/analyze.ts` | Analysis pipeline. Chunk-progress reporting, retry/backoff, bounded prompts. |
| A36 | `packages/ai/src/json.ts` | JSON extraction/repair. Tolerant parsing of fenced/partial JSON, stable exports. |
| A37 | `packages/ai/src/index.ts`, `packages/ai/package.json` | Barrel exports + metadata. Additive only. |

### Squad 7 — Documentation (professional, accurate to code, Uzbek)

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A38 | `docs/01-vision.md` | Vision/pro principles — sharpen, align with implemented state. |
| A39 | `docs/02-roadmap.md` | Roadmap — reflect actual progress, realistic next steps. |
| A40 | `docs/03-architecture.md` | Architecture — reconcile with current code (Vite dev vs Tauri, nx layers). |
| A41 | `docs/04-ui-ux.md` | UI/UX spec — make it the authoritative professional reference; record token values, a11y/responsive standards, verified state. |
| A42 | `docs/05-agent-rules.md` | Agent-rules structure — accuracy vs `agent-rules/`. |
| A43 | `docs/06-data-formats.md` | JSON formats — exact keys, examples validated against `content/`. |
| A44 | `docs/07-book-pipeline.md` | Conversion pipeline — risks and current limitations. |
| A45 | `docs/08-future-server.md` | Future server — keep clearly future-scoped. |
| A46 | `docs/09-open-questions.md` | Open questions — resolve what the code already decided; leave genuinely open ones. |

### Squad 8 — Agent rules, README, demo content

| ID | Exclusive write scope | Mandate |
|----|-----------------------|---------|
| A47 | `agent-rules/analyst.md`, `agent-rules/schemas/analyst.json` | Analyst rule + schema — professional prompt quality, valid JSON schema, Uzbek output contract. |
| A48 | `agent-rules/quiz-master.md`, `agent-rules/schemas/quiz.json` | Quiz rule + schema — situational questions, explanations, valid schema. |
| A49 | `agent-rules/life-mentor.md`, `agent-rules/schemas/life-mentor.json` | Life-mentor rule + schema — "when/how to apply" scenarios, valid schema. |
| A50 | `agent-rules/tutor.md`, `README.md`, `package.json`, `content/books/10-daqiqa-odatlar/**` | Tutor rule, README accuracy, root metadata, demo book content/analysis — professional Uzbek copy, valid JSON, consistent with schemas. |

---

## Wave order (coordinator)

- **Wave 1** A01–A06 — foundation & shell (shared contracts first; read-only for others until done)
- **Wave 2** A07–A13 — pages
- **Wave 3** A14–A21 — components
- **Wave 4** A22–A37 — lib, store, packages
- **Wave 5** A38–A50 — docs, rules, content

All waves are conflict-free by file ownership, so they may run concurrently; the coordinator verifies integration after each wave and runs the full verification suite at the end.
