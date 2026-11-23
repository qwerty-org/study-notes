# D05 — Signature: **"The Marginal Folio"** (chegaradagi folio)

> Qaror hujjati. Bu D05 ning yagona maqsadi: mahsulotni darhol **tanib olinadigan premium**
> qiladigan bitta vizual imzoni tanlash va uni 6 ekranga aniq o'lcham/rang bilan tarqatish.
> CSS yozilmaydi — element agentlari faqat shu qarorlarni amalga oshiradi. Barcha ranglar
> faqat `--pm-*`, o'lchamlar 8px grid, tipografiya `2026-11-23-premium-design-system.md` ga bo'ysunadi.

---

## 0. Yagona qaror (bir jumla)

**Imzo = "Margin rule + Folio"**: har bir ekranda bitta asosiy narsa chapdagi *ajratilgan margin
kanalida* turgan **2px terrakota vertikal chiziq** (o'quvchining qalam izi — marginalia) bilan
belgilanadi, va tartib/raqam kontekstida shu chiziq ustida **Fraunces folio raqami** turadi.
Bu umumiy SaaS kartalar tiliga qarshi, kitob/chegarash/o'qish mazmidan kelib chiqqan, kam rangli,
har ekranda takrorlanadigan va arzon ko'rinishni darhol yo'q qiladigan bitta tizim.

---

## 1. Nomzodlarni qabul / rad etish (nima uchun aynan bu)

| Nomzod | Qaror | Sabab |
|---|---|---|
| Nozik editorial chiziq tizimi (hairline) | **Qabul — lekin asos emas** | Bu allaqachon dizayn tizimining `1px --pm-line` qismi; o'z-xolicha umumiy editorial ko'rinish, "kitob" deya olmaydi. Uni imzoning *tashuvchisi* sifatida ishlatamiz. |
| O'ziga xos bob raqami treatment'i | **Qabul — imzoning ikkinchi yarmi sifatida** | Bob raqamlari bor (1/4), lekin kulrang doiralarda — imkon isrof. Uni katta Fraunces **folio**ga aylantiramiz. Yakka o'zi yetarli emas. |
| Marginalia belgilari | **QABUL — ASOS** | O'qish, izoh chegaralash, "bu joy muhim" degan qalam izi — mahsulotning o'z mohiyati. 2px terrakota chiziq sifatida istalgan ekranga (faol nav, tanlangan bob, asosiy statistika) ko'chiriladi. Bu eng o'zimiznikiga ega. |
| Kitob umurtqasi (spine) motifi | **Qisman — faqat muqova obyektida** | Kuchli, lekin og'ir: butun UI ga yoyilsa dekorativ bo'lib qoladi. Faqat muqovaning ichki chap qirrasida 2px chiziq sifatida, imzoning jismoniy ifodasi sifatida ishlatiladi. |
| Qog'oz qatlamlari (paper layering) | **RAD** | Allaqachon bor bo'lgan `--pm-shadow-1/-2` bilan aralashib, yana "kartalar to'lgan" muammosini keltiradi. Yangi hech narsa qo'shmaydi. |

**Yakuniy imzo:** marginalia chizig'i + folio raqami = **The Marginal Folio**.
Biri ham bo'lmasa imzo yo'q: faqat chiziq = oddiy divider; faqat raqam = oddiy counter.

---

## 2. Imzo anatomiyasi (qat'iy qiymatlar)

### 2.1 A — Margin rule (asosiy)
- O'lcham: **`2px` kenglik × `24px` balandlik** (standart), **`2px × 16px`** (compact — ro'yxat/forma ichida), **`2px × 40px`** (katta qahramon blok).
- Radius: `999px`. Rang: **`--pm-accent`**. Fon/tush yo'q, gradient yo'q.
- Joylashuv: matn/elementning **chap kanalida**, kontent boshlanishidan `20px` oldin; tepasi birinchi matn baseline'i bilan tekis. Mobil (`≤620px`) kanal `12px`, balandlik `16px`.
- Hech qachon chiziq ustiga matn yozilmaydi; chiziq dekorativ (`aria-hidden="true"`).

### 2.2 B — Folio (raqam ifodasi)
- Font: `Fraunces Variable`, weight `600`, `letter-spacing: -0.035em`, `font-variant-numeric: lining-nums tabular-nums`.
- O'lchamlar: **`40px`** (katta progress/folio), **`30px`** (KPI), **`24px`** (bob/TOC), **`18px`** (onboarding step, kichik folio).
- Rang: **`--pm-brass`** (passiv/fon folio), faol bo'lganda **`--pm-ink`**. Hech qachon accent bilan raqam yozilmaydi (accent faqat chiziq).
- Folio ostida ixtiyoriy `1px --pm-line` hairline — lekin faqat 40px foliolarda.

### 2.3 C — Kanal (gutter)
- Chap kanal `20px` (mobil `12px`) barcha ekranlarda **ajratilib qoladi**; chiziq shu kanalga qo'yiladi.
- Bitta ekranda imzo **ko'pi bilan 3 marta** takrorlanadi (bittasi asosiy, qolgani ikkilamchi). Ko'p takror = shovqin.

### Dark mode (hech qanday yangi token yo'q)
| Element | Light | Dark |
|---|---|---|
| Margin rule | `--pm-accent` `#A94F2A` | `--pm-accent` `#E69A6C` |
| Folio | `--pm-brass` `#A88342` | `--pm-brass` `#D9B46E` |
| Faol folio | `--pm-ink` `#1F1B15` | `--pm-ink` `#F5EFE4` |
| Kanal fon | `--pm-bg` `#FAF8F4` | `--pm-bg` `#15130F` |

---

## 3. Imzoning 6 ekranda joylashuvi (aniq elementlar)

### 3.1 Onboarding (7-ekran, alohida kirish holati)
| Element | Hozir (symptom) | Aniq yangi treatment |
|---|---|---|
| Chap panel eyebrow `— KITOBNI O'QISH EMAS` | kichik `—` dash | Dash o'chiriladi; o'rniga **margin rule 2×24px accent** (20px kanal, panel padding 48px → x=28px). Matn 12px/700 `--pm-ink-2`, sentence-case. |
| 3 step tab (`01 AI ulash / 02 Shaxsiyatingiz / 03 Birinchi kitob`) | to'la accent pill + uzun orange chiziq | Pill va uzun chiziq o'chiriladi. Raqamlar **folio 18px Fraunces**: passiv `--pm-brass`, faol `--pm-ink`; faol ostida `2px --pm-accent` (tizim nav qoidasi saqlanadi). |
| O'ng karta `1-QADAM` eyebrow | kichik kulrang | **margin rule 2×16px** + `12px/700 --pm-accent` matn. |
| `API kalit`, `Model (ixtiyoriy)` field label | 12px kulrang, tinch | **margin rule 2×16px** 12px kanalda, label `13px/600 --pm-ink-2`. |
| `Davom etish →` | oxirida arrow | Arrow matndan ajratiladi (18px ikonka, `currentColor`), matnda "→" yo'q. |

### 3.2 Bosh sahifa (dashboard)
| Element | Aniq yangi treatment |
|---|---|
| `KUNLIK HALQA` · `Bugungi reja`, `Tezkor amallar`, `Umumiy ko'rsatkichlar` | Har bir bo'lim sarlavhasi oldida **margin rule 2×24px accent** (20px kanal). Sarlavha `20px Fraunces`, eyebrow `12px/700 --pm-ink-2`. |
| `0/3 bajarildi` pill | Pill o'chiriladi → **folio `0/3`, 20px Fraunces, `--pm-brass`**, tabular. |
| Hero `0%` ring + "JORIY KITOB PROGRESSI" | Ring o'chiriladi → bitta **folio `0%`, 40px Fraunces `--pm-brass`** + ostida `2px --pm-accent` chiziq (40px uzunlik). Bu butun ekranning yagona e'tibor markazi. |
| KPI ichidagi kichik borderli qutilar (1 KITOB, 0 BOB, —, 0) | Ichki border/soya olib tashlanadi → raqam **`30px Fraunces --pm-ink` tabular**, label `12px --pm-ink-3`. |

### 3.3 Kutubxona
| Element | Aniq yangi treatment |
|---|---|
| `Kutubxonang` eyebrow + `Kitoblar` sarlavha | **margin rule 2×24px accent** (20px kanal); sahifa title `40px Fraunces` o'zgarishsiz. |
| 4 KPI (Jami kitoblar / O'qilmoqda / Tugatilgan / Tahlil kutyapti) | Rangli ikonkalar (soat/check/sparkle) o'chiriladi → **folio `30px Fraunces --pm-ink`**, chapda `2px×16px --pm-accent` tick; label `13px --pm-ink-2`. |
| Muqova obyekti (kitob kartochkasi) | **Spine chiziq:** muqova ichki chap qirrasida `2px` balandlik bo'ylab `--pm-accent`, `1px` inset;monogram `SN` yuqori o'ngda `12px Fraunces --pm-brass`. |
| Drop zone `Kitoblarni bu yerga tashlang` | Dashed border taqiq → `1px solid --pm-line`, bitta `18px` ikonka, `14px --pm-ink-2` matn. |

### 3.4 Kitob (o'quvchi)
| Element | Aniq yangi treatment |
|---|---|
| Hero (`Tahlil tayyor`, `MD`, `4 bob` chiplari) | Chiplar `2` taga qisqaradi; sarlavha chapida **margin rule 2×40px accent**; title `40px Fraunces` unchanged. |
| Hero progress (bar + ring + `0%`) | Ring yo'q (D6 bilan bir xil) → **folio `0%` 24px `--pm-brass`** + `2px --pm-accent` chiziq; bar `6px --pm-surface-2` saqlanadi. |
| TOC bob raqamlari (`1,2,3,4` kulrang doiralarda) | Doira fonlari o'chiriladi → **folio `24px Fraunces --pm-brass`**; faol bob: folio `--pm-ink` + `2px×24px --pm-accent` (12px kanal). |
| Toolbar `Bob 1 / 4` | Eyebrow oldida **margin rule 2×16px accent**; `12px/700 --pm-accent` + `16px Fraunces --pm-ink`. |
| O'qish qog'ozi (reading paper) | Qog'oz ichida, matn boshlanishidan `24px` oldin **margin rule 2px --pm-accent**, balandligi `64px`, birinchi paragraf tepasi bilan tekis. Matn `18px/1.75 Fraunces --pm-ink` o'zgarishsiz. |
| Marginalia (≥1500px, D5.4) | Chap border allaqachon `2px accent` — uni imzo bilan birlashtirish: `2px --pm-accent` to'liq balandlik, ichki `16px` padding, label `12px --pm-ink-3`. |

### 3.5 Takrorlash
| Element | Aniq yangi treatment |
|---|---|
| `KUNLIK ODAT` eyebrow, `BUGUNGI SESSIYA` | Ikkalosi oldida **margin rule 2×24px accent**; `5 savol · 1 kitob` dagi `5` → **folio 40px Fraunces `--pm-brass`**. |
| Sessiya progress ring (72px) | **Yagona ruxsat etilgan ring** — ichida **folio `5`, 30px Fraunces `--pm-ink` tabular**; track `--pm-surface-2`, fill `--pm-accent`. |
| Savollar ro'yxati, joriy savol | Joriy savol oldida `12px` kanalda **margin rule 2×16px accent**; `Vaziyat`/`Nazariy` chiplari o'rniga `12px --pm-ink-3` oddiy matn (faqat Vaziyatga 2px accent tick). |
| `Boshlash →` | Arrow matndan ajratiladi. |

### 3.6 Natijalarim
| Element | Aniq yangi treatment |
|---|---|
| `SHXSIY TARAQQIYOT` eyebrow, `Natijalarim` title | **margin rule 2×24px accent** (20px kanal); title `40px Fraunces` unchanged. |
| Profil hero `0%` ring | Ring o'chiriladi → **folio `0%` 40px Fraunces `--pm-brass`** + `2px --pm-accent` (dashboard bilan identik). |
| 4 KPI (`0, 0%, 1, 0`) + ularning ikonkalari | Ikonkalar o'chiriladi → **folio `30px Fraunces --pm-ink` tabular**, chapda `2px×16px --pm-accent`; label `12px --pm-ink-3`. |
| `So'nggi 7 kun` grafik | Joriy kun ustida `2px --pm-accent` yuqori chiziq; ustunlar `--pm-surface-2`, hech qanday beige soya. |
| `"Men qo'lladim" jurnali` | Sarlavha oldida **margin rule 2×24px accent**. |

### 3.7 Sozlamalar (6-ekran)
| Element | Aniq yangi treatment |
|---|---|
| Sidebar faol `Profil va ko'rinish` | Peach fondli pill o'chiriladi → **margin rule 2px×16px accent** (12px kanal) + matn `--pm-ink`. |
| Panel sarlavhasi `Profil va ko'rinish` | Oldida **margin rule 2×24px accent**; `18px Fraunces`. |
| Avatar katakchalari | Barchasi `--pm-surface-2`; tanlangani atrofida `2px --pm-accent` halqa, peach fon emas. |

---

## 4. Uchta eng katta "before → after" sakrash

**① "Dash + pill sho'rvasi" → "Annotated margin".**
*Symptom:* onboarding, kutubxona, natijalar va dashboard da bo'limlar oldida kichik `—` dash, atrofda
`1 kunlik streak`, `Tahlil tayyor`, `MD`, `4 bob`, `sosedn...` kabi 6–8 ta bej pill; matn 10–11px kulrang.
*After:* dash va pilling butunlay yo'qoladi; har bo'lim **2px margin rule + 12px sentence-case label** bilan
boshlanadi, raqamlar esa **Fraunces folio** bo'ladi. Ekran bir zumda "dashboard shablon"dan "chegaralangan
qog'oz"ga aylanadi.

**② "Suzuvchi oq karta" → "Muqovali, izohlangan jild".**
*Symptom:* after-book dagi o'qish qog'ozi oddiy oq dumaloq to'rtburchak, bob raqamlari kulrang doirada,
"Bob 1/4" kichik chip — kitoblilik yo'q.
*After:* qog'ozning ichki chapida **2px terrakota margin chiziq**, TOC dagi kulrang doiralar o'rniga
**24px Fraunces folio**, faol bob chiziq+folio bilan belgilanadi. Bu bitta o'zgarish ekranning butun
emotsional kodini o'zgartiradi.

**③ "Ring + bar + chip = uch barob progress" → "Bitta folio".**
*Symptom:* dashboard hero `0%` ring, kitob hero ring+bar+`0%`, natijalar `0%` ring, takrorlash ringi —
bir raqam 4 joyda takrorlanadi; bu eng arzon ko'rinish manbai.
*After:* hamma joyda bitta **40px Fraunces folio + 2px accent chiziq**; yagona istisno — takrorlash
sessiyasining 72px ringi, ichida folio `5`. Progress endi o'lchov emas, **imzo** bo'ladi.

---

## 5. Cheap tells — stop list (brutal, screenshotlarga asosan)

1. **Tulki emoji 🦊** — dashboard salomlashuvi va sozlamalardagi avatar qatori. Darhol o'chirilsin; o'rniga Fraunces bosh harf/monogram yoki `18px` book glyph (`currentColor`). Emoji = o'yinchoq.
2. **Emoji ikonkalar chiziq ichida**: `🔥 1 kun`, `✦`, `⏱`, `👁`, nav chiplaridagi rangli belgilar. Barchasi `1.8` stroke ikonkaga almashtirilsin.
3. **Tugma oxiridagi "→"**: `Davom etish →`, `O'qishni boshlash →`, `Boshlash →`. Tizimda taqiqlangan — 18px ikonka alohida, matn toza.
4. **ALL CAPS eyebrowlar**: `SHXSIY TARAQQIYOT`, `KUNLIK HALQA`, `JORIY KITOB PROGRESSI`. Sentence-case, `12px/700`. Hech qanday ALL CAPS.
5. **9–11px kulrang matn**: chiplardagi `0%`, `4 bob`, `tez orada`, `MD`, `0/5 Savol`. Minimum `12px`, asosiy matn `≥14px`.
6. **Pill/chip suhoni**: bitta ekranda 6–8 ta borderli bej pill. Maksimum **2 ta** mazmoli chip qoladi, qolgani folio yoki oddiy matn.
7. **Karta ichida karta**: dashboard "Umumiy ko'rsatkichlar" ichidagi 4 ta borderli mini-quti; har birining o'z borderi+soyasi bor. Ichki border o'chirilsin — oq maydon + yumshoq soya kifoya.
8. **Hero dagi pushti/bej gradient blob** (kitob, natijalar, welcome) + barcha kartalar ortidagi beige "sticky note" foni. Faqat `--pm-bg`; gradient faqat hero'da `.6` opacity, qolgan joyda yo'q.
9. **Dashed drop-zone** (kutubxona `Kitoblarni bu yerga tashlang`) — yarim tugallangan ko'rinadi; `1px --pm-line` solid.
10. **To'rt xil rangli ikonka plitkasi**: teal upload / peach repeat / sariq quiz / binafsha AI. Tizim "maks 2 rang" qoidasini buzadi — hammasi `--pm-surface-2` + `--pm-ink-2`.
11. **Kulrang doira ichidagi kichik bob raqamlari** (after-book TOC) — folio raqamiga almashtirilsin.
12. **Avatar atrofidagi nuqtali/och sariq kontur** va faol nav pilli — o'chirilsin, o'rniga 2px accent chiziq.
13. **"Salom, o'qvuchi 🦊"** — emoji va past registr xatolik bilan. Toza, kattalar tilida salomlashuv (mas. `Assalomu alaykum`), `24px Fraunces`.

---

## 6. Yagona zavq momenti (bitta, boshqasi yo'q)

**"Birinchi marta kitobni ochish" — margin chiziq chiziladi.**

- **Qachon:** foydalanuvchi kitob hero'sidagi `O'qishni boshlash` tugmasini bosganda, reader birinchi
  marta render bo'lganda (har kitob uchun bir marta; qayta kirishda chiziq darhol ko'rinadi).
- **Nima bo'ladi (bitta o'rchestratsiya):**
  1. O'qish qog'ozidagi **margin rule** yuqoridan pastga `0 → 64px` chiziladi — **`420ms`, `cubic-bezier(.2,.7,.2,1)`**, transform `scaleY`.
  2. Ayni vaqtda birinchi paragraf `opacity: 0 → 1` + `translateY(8px → 0)` — **`320ms`, `ease-out`**, 60ms kechikish bilan.
  3. Chiziq oxirida TOC dagi faol bob **folio raqami** `--pm-brass` → `--pm-ink` ga o'tadi — **`160ms`**.
- **Ranglar:** faqat `--pm-accent` (chiziq), `--pm-brass`/`--pm-ink` (folio), `--pm-ink` (matn).
- **Cheklov:** bu **yagona** choreografiya. Boshqa hech qayerda ketma-ket animatsiya, stagger, bounce yo'q.
  `prefers-reduced-motion` da chiziq va folio darhol final holatda ko'rinadi, hech qanday harakat yo'q.

---

## 7. Element agentlariga eslatma

- Yangi token **kerak emas** — barcha qiymatlar `--pm-*` ichida.
- Chiziq faqat dekorativ: `aria-hidden="true"`, focus olishmaydi; focus ring tizim qoidasi (`2px --pm-accent`, offset 3px) saqlanadi.
- Folio matn sifatida o'qilishi kerak (screen reader uchun raqam matndan olinadi); chiziq esa o'qilmaydi.
- Har bir agent o'z elementiga faqat **bitta** asosiy margin rule qo'shadi; ikkinchisi faqat ikkilamchi bo'lim uchun. 3 tadan oshirmang.
- `≤620px` da kanal `12px`, chiziq `2×16px` — matn bilan hech qachon ustma-ust kelmaydi.
- 1440 / 900 / 620 / 375 da tekshiring: chiziq matndan `20/20/12/12px` oldin, folio tabular, kontrast yetarli.
- Bu hujjat `04-book.md` (D1–D6) qarorlari bilan ziddirilmaysiz: ringlarni qaytarmang, borderlarni qaytarmang, faqat **imzo** qo'shing.
