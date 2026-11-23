# 09 — Ochiq savollar va xatarlar

> Har bir savol javobsiz qolmasligi uchun: **qaror / mas'ul / sana** qo'shiladi.
> Javob topilganda shu faylga yozamiz (yoki tegishli hujjatga).
>
> **Holat belgilari (2026-11, kod auditati asosida):**
> - ✅ **hal qilindi** — qaror bor va amalga oshirilgan; manba (fayl) ko'rsatilgan.
> - 🔶 **qisman** — yo'nalish aniqlangan, lekin to'liq bajarilmagan yoki sifat bahosi kerak.
> - ⬜ **ochiq** — haqiqatan hal qilinmagan; "Keyingi qadam" bilan berilgan.
>
> Tekshirilgan manbalar: `apps/desktop/src`, `packages/core/src`, `packages/ai/src`,
> `agent-rules/`, `content/books/`, `README.md`, `docs/01`–`docs/04`, `docs/06`–`docs/08`.
>
> **Asosiy ochiq qismlar:** PDF/EPUB konvertatsiya (C1), AI sifat baholari (C2),
> FSRS (E2), ikkinchi til/i18n (B3), eslatmalar (E4), server va onlayn bosqichlar (E6).

## A. Bosqich 0 uchun javob kerak (tez orada)

| # | Savol | Variantlar | Holat |
|---|-------|-----------|-------|
| A1 | **Pilot qaysi kitob?** (formatni sinash uchun) | Atomic Habits / o'zbek tilidagi kitob / boshqa | ✅ **Hal qilindi:** o'z mualliflik demo kitobi **"10 daqiqali odatlar"** (`content/books/10-daqiqa-odatlar/meta.json`, 4 bob). Birinchi ishga tushirishda kutubxonaga avtomatik qo'shiladi (`apps/desktop/src/seed.ts`). Eslatma: format sinovi uchun demo yetarli; haqiqiy to'liq kitobda AI sifatini qo'lda baholash (C2) pilotda qoladi. |
| A2 | **Pilot tili?** | Inglizcha / o'zbekcha | ✅ **Hal qilindi:** o'zbekcha — `language: "uz"` (demo `meta.json`), `DEFAULT_PROFILE.language = 'uz'` (`apps/desktop/src/store/AppStore.tsx`). Inglizcha lokal keyingi bosqich (B3). |
| A3 | **Qaysi provider bilan boshlaymiz?** | Gemini / Groq / OpenAI | ✅ **Hal qilindi:** boshlang'ich (default) **Google Gemini** (`DEFAULT_AI.provider = 'gemini'`, `AppStore.tsx`), shuningdek **OpenAI** va **Ollama** to'liq ishlaydi (`packages/ai/src/providers.ts`, `pages/Settings.tsx`). Groq faqat `docs/03`/`docs/01` da tilga olingan, kodda yo'q — kerak bo'lsa keyin qo'shiladi. |
| A4 | **Desktop framework yakuniy?** | Tauri ⭐ / Electron (fallback) | ✅ **Hal qilindi:** **Tauri** — `@tauri-apps/api` bog'liqligi (`apps/desktop/package.json`), `README.md` §Texnik xulosa. Hozircha UI mustaqil Vite ilovasi sifatida ishlab chiqiladi (`README.md` §Ishga tushirish); Electron fallback imkoniyati saqlanib qolgan (`docs/03` §Tanlov). |
| A5 | **Backend tili?** | Rust / Node.js | 🔶 **Qisman:** qaror — Tauri qobig'i **Rust**, lekin tahlil/saqlash qatlami **TypeScript** (`packages/core/src`, `packages/ai/src`). Rust qatlami hali yozilmagan; UI backend'dan ajratilgani uchun Electron + Node.js fallback ham ochiq (`docs/03` §Qatlamli tuzilma). |
| A6 | **Repo nomi?** | `study-notes` / boshqa | ✅ **Hal qilindi:** `study-notes` (`package.json` `name`; remote: `github.com/qwerty-org/study-notes.git`). |

## B. Dizayn savollari

| # | Savol | Holat |
|---|-------|-------|
| B1 | Ranglar palitrasini yakuniy qilish | ✅ **Hal qilindi:** "Iliq qog'oz stoli" tizimi joriy (`apps/desktop/src/styles/theme.css`: asosiy `#a94f2a`, ko'k-yashil `#3d6d61`, fon `#f5f2ea`, tungi `#16140f`; shriftlar Fraunces/Manrope). `#B4542D` eski qiymat bo'lib, AA kontrasti uchun `#a94f2a` ga quyuqlashtirilgan (docs/04 shuni qayd etadi). |
| B2 | Logotip / brend nomi yakuniy? | 🔶 **Qisman:** brend nomi **"Study Notes"** tasdiqlangan va hamma yerda ishlatiladi (`pages/Settings.tsx` "Dastur haqida", `App.tsx` `document.title`). Alohida logotip dizayni yo'q — hozircha `IconBookOpen` ikonkasi. Keyingi qadam: yagona brend ikonkasini tasdiqlash. |
| B3 | Ikkinchi til: English default qilaymi, o'zbekcha qoldaymi? | ⬜ **Ochiq (i18n):** hozircha faqat o'zbekcha — til qattiq `'uz'` (`AppStore.tsx` `hydrateProfile`), Sozlamalada "Hozircha faqat o'zbekcha. Boshqa tillar keyingi bosqichda." (`Settings.tsx`). **Keyingi qadam:** interfeys satrlarini i18n qatlamiga chiqarish, so'ngra English lokalini qo'shish (`docs/01` §Asosiy printsiplar, 6-band; `docs/04` §"Hali yo'q"). |
| B4 | Yosh auditoriya (o'smirlar/talabalar/kattalar) | ✅ **Hal qilindi:** asosiy — shaxsiy rivojlanish, psixologiya va biznes adabiyotini o'qiyotgan kattalar; qo'shimcha — talabalar va o'qituvchilar (`docs/01` §Maqsadli auditoriya). UI uslubi shu auditoriyaga mos: minimal, "bir marta bosing → ishlaydi" (`docs/04`). |

## C. Texnik xatarlar

| Xatar | Daraja | Yechim | Holat |
|-------|--------|--------|-------|
| C1 | ⚠️ Yuqori | PDF konvertatsiya sifati past chiqishi | 🔶 **Ochiq (PDF/EPUB):** hozircha faqat `.md`, `.markdown`, `.mdx`, `.txt` qabul qilinadi (`pages/Library.tsx` `ACCEPT`), konvertatsiya yo'q (`README.md`, `docs/01`, `docs/04`). **Keyingi qadam:** `docs/07` bo'yicha EPUB → turndown va matnli PDF → pdf-parse qatlamini `packages/core` ga qo'shish; 4 xil faylda sinab, sifatni 1–5 baholash. |
| C2 | ⚠️ Yuqori | AI tahlil sifati qoniqarsiz | 🔶 **Qisman:** agent rules va 3 sxema yozilgan hamda tahlilga ulangan (`agent-rules/*.md`, `schemas/*.json`, `apps/desktop/src/rules.ts`, `packages/ai/src/analyze.ts`); JSON retry va `partial` holati bor. **Qoladi:** haqiqiy kitob bobida qo'lda sifat baholash (o'rtacha quiz balli ≥70% — `docs/01` mezoni). |
| C3 | O'rtacha | Skan PDF'lar ishlamaydi | 🔶 **Qaror bor, amalga oshirilmadi:** OCR Bosqich 0/1 ga kiritilmaydi, uning o'rniga aniq ogohlantirish ko'rsatish rejalashtirilgan (`docs/07` §3, §6). **Keyingi qadam:** C1 (PDF import) bilan birga "matn topilmadi — matnli PDF yoki EPUB ishlating" xabarini qo'shish. |
| C4 | O'rtacha | Tauri'da Rust to'siq bo'lsa | ✅ **Hal qilindi:** UI backend'dan ajratib qo'yilgan — `apps/desktop` (React 19 + Vite) mustaqil ishlaydi, qatlamlar `packages/core`, `packages/ai` da. Electron + Node.js fallback saqlanib qolgan (`docs/03` §Tanlov, `README.md`). |
| C5 | Past | Windows SmartScreen ogohlantirishi | ⬜ **Ochiq (reja bor):** hozircha installer yo'q, faqat Vite build. **Keyingi qadam:** avval portable `.zip` tarqatish, keyin code signing (`docs/02` §Umumiy xatarlar). |
| C6 | Past | API narxi (agar katta kitob bo'lsa) | ✅ **Hal qilindi (asosiy choralar bor):** bob bo'yicha chunking (`packages/core/src/parsing.ts` `splitChapters`), bitta chaqiruv uchun 12 000 belgi limiti (`packages/ai/src/analyze.ts`), progressda bob soni ko'rsatiladi, Ollama orqali to'liq offline ishlash mavjud (`providers.ts`). |

## D. Qonuniy (huquqiy)

| # | Savol | Hozircha qilingan qaror | Holat |
|---|-------|------------------------|-------|
| D1 | Mualliflik: to'liq matnni saqlash | `content.md` faqat lokal, repo'ga KIRMAYDI (docs/07) | ✅ **Qaror kuchda:** real kitob matni faqat foydalanuvchi qurilmasida. *Istisno:* o'z mualliflik demo kitobi matni `content/books/10-daqiqa-odatlar/content.md` repo'da (`seed.ts` orqali yuklanadi) — bu uchinchi tomon asari emas, platforma jamoasi yozgan sinov matni. |
| D2 | Tahlil (transformatsiya) ochiq saqlansa bo'ladimi? | Ha — meta + analysis ochiq | ✅ **Amalga oshirilgan:** `content/books/10-daqiqa-odatlar/meta.json` va `analysis/*.json` repo'da. Yuridik tekshiruv maslahati kuchda (asl matn repo'ga qo'yilmaydi). |
| D3 | AI provayderlar shartlari (matn yuborish) | Foydalanuvchi o'z kaliti bilan — uning mas'uliyati | ⬜ **Ochiq:** README'da BYOK va Ollama tamoyillari bor (`README.md` §Asosiy qarorlar), lekin "bulutli API tanlanganda bob matni shu provayderga yuboriladi, mas'uliyat foydalanuvchida" degan aniq band yo'q. **Keyingi qadam:** README'ga qisqa maxfiylik/mas'uliyat izohi qo'shish (`docs/07` §7, `docs/01` §Asosiy printsiplar, 4-band). |
| D4 | Litsenziya | MIT (kod) | ✅ **Amalga oshirilgan:** `LICENSE` (MIT), `package.json` `"license": "MIT"`, Sozlamalar → "Dastur haqida"da ko'rsatiladi. |

## E. Produkt savollari (Bosqich 1 oldin)

| # | Savol | Holat |
|---|-------|-------|
| E1 | Quiz'da nechta savol bobga? (5-8 taxminiy) | ⬜ **Ochiq (pilot):** demo kitobda 2 savol/bob (`analysis/quizzes.json`: 4 bob → 8 savol); `docs/02`/`docs/06` dagi 5–8 taxmini hali tasdiqlanmagan. **Keyingi qadam:** haqiqiy kitobda sinab, optimal sonni `agent-rules/quiz-master.md` ga kiritish. |
| E2 | Spaced repetition FSRS bilanmi, oddiy jadval bilanmi? | ⬜ **Ochiq (FSRS yo'q):** hozir oddiy jadval + ease bo'yicha moslashuv ishlaydi (`packages/core/src/repetition.ts`: 1/3/7/14/30, `scheduleReview`, `dueReviews`). **Keyingi qadam:** FSRS (mas. FSRS-5) reytinglari (again/hard/good/easy) asosida `scheduleReview` ni almashtirish, eski jadvalni fallback sifatida saqlash (`docs/06` §5). |
| E3 | Kitob tugagach nima? (sertifikat, "qayta o'qish", yangi kitob taklifi) | ⬜ **Ochiq:** `status` va progress hisoblanadi (`Library`, `Book`), lekin tugatilgandan keyingi sertifikat/qayta o'qish/taklif yo'q. **Keyingi qadam:** Natijalar sahifasiga "tugatilgan kitoblar" va "qayta o'qish" harakatini qo'shish. |
| E4 | "Men qo'lladim" — notifications/eshitma qachon? (kunlik 20:00) | ⬜ **Ochiq (eshitma yo'q):** "Men qo'lladim" tugmasi va jurnali ishlaydi (`apply_log`, Kitob/Natijalar), lekin bildirishnoma yo'q; Sozlamalada "20:00 · tez orada" placeholder bor (`Settings.tsx`). **Keyingi qadam:** desktop qobig'ida mahalliy vaqt bo'yicha 20:00 eslatmasini (foydalanuvchi roziligi bilan) qo'shish (`docs/04` §7). |
| E5 | Bir nechta shaxsiy profil (oilaviy kompyuter)? | ✅ **Hal qilindi (hozirgi bosqich uchun):** bitta mahalliy profil (`AppStore.tsx` `profile`, `docs/01` §Asosiy printsiplar). Ko'p profil alohida reja sifatida keyingi bosqichga qoldirildi. |
| E6 | Server, sync va onlayn kutubxona qachon? | ⬜ **Ochiq (Bosqich 2–3):** hozir server yo'q, hamma ma'lumot lokal (`docs/03` asosiy tamoyil); Sozlamalarda "AI ustoz, PDF/EPUB import, onlayn kutubxona va ustozlar obunasi keyingi bosqichlarda" deb yozilgan (`Settings.tsx`). **Keyingi qadam:** Bosqich 2 da tahlillarni saqlash/ulashish uchun oddiy API va ixtiyoriy E2E sync prototipi; undan keyin Bosqich 3 web versiya + obuna (`docs/08`). |

## F. Reja holati (docs/02 asosida)

Belgilar: `[x]` bajarildi · `[/]` qisman/jarayonda · `[ ]` boshlanmadi.

```
[x] G'oya aniqlandi (docs/01)
[x] Asosiy qarorlar qabul qilindi (lokal, bepul, BYOK+Ollama, agent rules)
[x] Hujjatlar yozildi (docs/01–09)
[x] GitHub repo yaratildi (README, LICENSE MIT, papka tuzilmasi)

[/] Bosqich 0 — poydevor (asosan tugadi; 2 sinov qoldi)
    [x] Pilot kitob tanlandi (A1, A2) — "10 daqiqali odatlar", o'zbekcha demo
    [x] agent-rules/ yozildi (analyst, quiz-master, life-mentor, tutor + 3 sxema)
    [x] JSON formatlar pilotda sinandi (content/books/10-daqiqa-odatlar/analysis/)
    [ ] PDF/EPUB → MD sinovi  ← OCHIQ (C1): hozircha faqat .md/.txt import
    [ ] AI sifatini haqiqiy kitobda qo'lda baholash  ← OCHIQ (C2)

[/] Bosqich 1 — desktop MVP (UI qurildi)  ← HOZIR SHU YERDAMIZ
    [x] UI: Onboarding, Bosh sahifa, Kutubxona, Kitob (6 tab), Quiz,
        Takrorlash, Natijalar, Sozlamalar (docs/04 §Amalga oshirilgan holat)
    [x] Yuqori panel navigatsiya, "Iliq qog'oz stoli" dizayn tizimi (theme.css)
    [x] Ko'p fayl import (.md/.txt), bobga bo'lish, 3 agentli AI tahlil + retry
    [x] AI ulash: Gemini / OpenAI / Ollama + ulanishni tekshirish
    [x] Oddiy takrorlash jadvali (1/3/7/14/30), "Men qo'lladim" jurnali, streak
    [x] Eksport/import, kunduzi/tungi mavzu, tushunarli xato xabarlari
    [ ] PDF/EPUB import va konvertatsiya (C1)
    [ ] Tauri/Electron qobig'i (hozircha Vite dev server / preview)
    [ ] To'liq FSRS (E2)
    [ ] Eslatmalar vaqti (E4), til tanlagich (B3)
    [ ] AI ustoz chat — Bosqich 2'ga o'tkazilgan (tab "tez orada")

[ ] Bosqich 2 — server + jamoaviy + AI ustoz (E6): RAG chat, server API,
    ixtiyoriy E2E sync, tahlil sifatini baholash
[ ] Bosqich 3 — online public + obuna (web versiya, ustoz profillari,
    umumiy kutubxona)
```
