# 08 — Kelajak: server, onlayn kutubxona va obuna (Bosqich 2–3)

> **Hujjat holati: faqat reja.** Quyida Bosqich 2–3'da qurish ko'zda tutilgan
> xizmatlar tavsiflanadi. Bugungi kunda **server, hisob (login), onlayn
> sinxronizatsiya, ustoz obunasi yoki to'lov tizimi yo'q** — ularning hech
> biri amalga oshirilmagan va ishga tushirilmagan. Hozirgi mahsulot to'liq
> lokal (`local-first`) desktop dastur. Matndagi barcha xizmatlar **maqsad va
> yo'nalish**, joriy funksiyalar ro'yxati emas.

## Hozirgi holat va chegara (local-first / BYOK)

Chegarani aniq ajratish muhim: bugun nima bor va nima faqat kelajakda rejalashtirilgan.

| Hozir (Bosqich 0–1, amalda) | Faqat rejada (Bosqich 2–3, amalga oshirilmagan) |
|---------|--------|
| Desktop dastur, mustaqil ishlaydi | Server / API va web versiya |
| Ma'lumot kompyuterida: SQLite (fayl), lokal `library/`, JSON | Onlayn hisob, profil, bulutli saqlash |
| Hisob yo'q — mahalliy profil, login yo'q | Email/Google orqali autentifikatsiya |
| **BYOK + Ollama:** foydalanuvchi o'z API kalitini kiritadi yoki to'liq offline ishlaydi; kalit faqat lokal saqlanadi | Server tomonidan AI kaliti yoki hisob orqali foydalanish |
| Kitob matni va tahlil qurilmadan chiqmaydi (faqat foydalanuvchi tanlagan AI provayderiga o'z kaliti bilan yuboriladi) | Tahlillarni serverga yuklash, umumiy kutubxona |
| Progress faqat lokally | Qurilmalararo E2E shifrlangan sinxronizatsiya |
| Obuna, izoh, jamoa, to'lov — mavjud emas | Ustoz obunasi, izohlar, bilim almashish, ixtiyoriy homiylik |

> **BYOK chegarasi:** kelajakda server paydo bo'lganda ham foydalanuvchining
> AI kaliti va shaxsiy ma'lumotlari serverga yuborilmaydi. Server faqat
> foydalanuvchi **ixtiyoriy** ravishda ulashishga rozilik bergan tahlillar va
> (xohlasa) E2E shifrlangan progressni saqlaydi. Bu hujjatdagi hech qanday band
> bugungi mahsulotning bir qismi deb o'qilmasin.

## Nima uchun kerak? (foydalanuvchi ehtiyoji — kelajak uchun asos)

1. 👨‍🏫 Foydalanuvchi **boshqa professor va ustozlarga obuna bo'lib**, ularning
   yangi materiallarini kuzatib boradi
2. 🗣️ **O'zaro bilim almashish** — izohlar, eslatmalar, amaliy tajriba
3. 🌍 O'rnatmasdan foydalanmoqchi bo'lganlar uchun **web versiya**
4. ☁️ Bir nechta qurilmada **davom ettirish** (kompyuter + telefon)

Bu ehtiyojlar Bosqich 2–3'da qondiriladi; hozirgi mahsulotda ular mavjud emas.

## Asosiy tamoyil (Bosqich 1'dan boshlab amal qiladi)

```
Desktop — mustaqil ishlaydi. Server — IXTIYORIY qo'shimcha.
Hech qachon: "server ishlamayapti → dastur ishlamayapti".
```

Shu sababli hozirgi ma'lumotlar — SQLite (fayl), lokal `library/`, JSON —
**kelajakda serverga ko'chirish oson** formatda saqlanadi. Bu ularning
allaqachon serverga yuborilayotgani degani emas.

---

## Bosqich 2 — Server + jamoaviy (reja)

> Quyidagilarning hech biri bugun mavjud emas.

### Server nima qiladi? (taxminiy)

```
Desktop (Bosqich 1)              Server (Bosqich 2 — reja)
├── Kutubxona (lokal)     ←sync→  ├── Profil (ixtiyoriy)
├── Tahlil (lokal)        ←────→  ├── Umumiy tahlillar kutubxonasi
├── Progress (lokal)      ←sync→  ├── Progress backup (E2E shifrlangan)
└── AI (to'liq lokal mumkin)      └── API: tahlil ulashish
```

### Rejalashtirilgan xizmatlar

| Xizmat | Vazifa |
|--------|--------|
| Auth | Ixtiyoriy (email/Google) — desktop esa hamon hisobsiz ishlaydi |
| Content API | `analysis/` JSON'larni saqlash/ulashish |
| Moderatsiya | Tahlil sifati — avval moderator tekshiradi |
| Sync API | E2E shifrlangan progress/notes |
| RAG servisi | (ixtiyoriy) Ustoz chat uchun vektor qidiruv |

### Texnik tanlov (hali tanlanmagan, taxminiy)

- **PostgreSQL** (+ pgvector — RAG uchun)
- **API:** Next.js API routes yoki FastAPI — jamoa qaysini biladi
- **Hosting:** bepul darajadan boshlash (Supabase/Neon + Vercel/Fly.io)
- **Desktop ↔ server:** REST + JWT

---

## Bosqich 3 — Onlayn public + obuna (g'oya, reja)

### G'oya: "Bilim markazi"

```
🌐 study-notes.uz (yoki GitHub Pages + API)
┌────────────────────────────────────────────────┐
│  📚 Umumiy kutubxona     👨‍🏫 Ustozlar         │
│  🔍 Qidiruv: "moliya, psixologiya..."         │
│                                                │
│  ⭐ Ustozlar:                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 👨‍🏫 A.o'q. │ │ 👩‍🏫 B.prof.│ │ 👨‍🏫 C.ust.│        │
│  │ 12 ta    │ │ 8 ta     │ │ 23 ta    │        │
│  │ tahlil   │ │ tahlil   │ │ tahlil   │        │
│  │ 🔔 Obuna │ │ 🔔 Obuna │ │ 🔔 Obuna │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                │
│  💬 Jamiyat: izohlar, "qo'lladim" tajribalari │
└────────────────────────────────────────────────┘
```

### Rejalashtirilgan asosiy xususiyatlar

1. **Ustoz/professor profili**
   - Kimligi, yo'nalishi (moliya, psixologiya, startup...)
   - O'z tahlillari, kurslari, "tavsiya qiladigan kitoblari"
   - Obunachilar soni

2. **Obuna (subscription)**
   - Ustoz yangi tahlil/maqola chop etganda **push** (ilova ichida)
   - Email yoki ilova bildirishnomasi
   - ⭐ Eng muhim engagement mexanizmi — "kuzatib borish"

3. **O'zaro bilim almashish**
   - Tahlilga **izohlar** (fikr, tuzatish taklifi)
   - "Men qo'lladim" tajribalari — ixtiyoriy ravishda **umumiy**
     (foydalanuvchi xohlasa yopiq qoladi)
   - Qo'shma **eslatmalar/jamoalar** (klub, darslik guruhi)

4. **Web versiya (public)**
   - O'rnatmasdan: kitob tahlilini o'qish, quiz yechish
   - Desktop'ga o'tish taklifi (to'liq funksiya uchun)

5. **Umumiy kutubxona**
   - Desktop'da tahlil qilingan → foydalanuvchi "Ulamasdan foydalaning"
     tugmasi bosadi → (moderatsiyadan so'ng) umumiy kutubxonaga tushadi
   - ⚖️ Faqat `meta + analysis` (matn emas) — mualliflik xavfsiz

### Monetizatsiya (hali qaror qilinmagan)

Loyiha **bepul va open source** deb e'lon qilingan. Kelajakda ko'rib chiqilishi
mumkin bo'lgan variantlar:

| Variant | Izoh |
|---------|------|
| ✅ Hammasi bepul | Eng sodda, open source ruhiga mos — **default shu** |
| ⚠️ Server xarajatlari | Hosting uchun ixtiyoriy `GitHub Sponsors` / `Donate` |
| ⚠️ Ustozlar uchun premium | Ustoz profil + analitika pullik bo'lsa — platforma emas, ustozlar uchun. **Jamoada muhokama qilinadi** |

> Qoida: **foydalanuvchi uchun doim bepul.** Pullik faqat ixtiyoriy homiylik
> yoki ustozlarga qo'shimcha vosita bo'lishi mumkin — hali qaror qilinmagan.

---

## Desktop ↔ onlayn integratsiya yo'li (reja)

| Bosqich | Desktop | Onlayn |
|---------|---------|--------|
| 1 | To'liq mustaqil | Yo'q |
| 2 | Mustaqil + ixtiyoriy sync | Tahlillarni ulashish API |
| 3 | Mustaqil + "Ulamasdan foydalanish" | Web versiya + ustozlar + obuna |

Hozir faqat 1-bosqich amalda; 2 va 3-bosqichlar rejada.

## Bosqich 1'da qo'yiladigan asos (kelajak uchun shartlar)

Bu bandlar server funksiyalarining bajarilgani emas — ular kelajakda server
qo'shilganda integratsiyani osonlashtiradigan **lokal dizayn qarorlari**:

1. `analysis/` JSON formatlari serverga yuborishga mos (06-hujjat) — formatlar
   aniqlangan, lekin hech qayerga yuborilmaydi
2. DB'da `book.slug` — global identifikator (kelajakda serverda ham xuddi shu slug)
3. UI'da "Ulamasdan foydalanish" tugmasi **Bosqich 3'da qo'shiladi**; hozir mavjud emas
4. Auth'ni majburiy qilmaslik — profil mahalliy, keyin ixtiyoriy ulash (printsip)
5. Server kodi **hozir yozilmaydi** — Bosqich 1 tugagach, alohida bosqich sifatida ko'rib chiqiladi

---

> **Xulosa:** ushbu hujjat kelajak ko'rinishidir. Bugungi foydalanuvchi uchun
> dastur lokal, hisobsiz va BYOK/Ollama asosida ishlaydi; server bilan bog'liq
> hech qanday xizmat hali mavjud emas.
