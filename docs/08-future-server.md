# 08 — Kelajak: server, online public, obuna

> Bu hujjat **Bosqich 2-3** uchun. Hozircha kod yozilmaydi — faqat yo'nalish
> aniqlangan, shuning uchun hozirgi arxitektura bunga tayyor bo'ladi.

## Nima uchun kerak? (foydalanuvchi sababi)

1. 👨‍🏫 Foydalanuvchi **boshqa professor va ustozlarga obuna bo'lib**
   ularning yangi materiallarini kuzatib boradi
2. 🗣️ **O'zaro bilim almashish** — izohlar, eslatmalar, tajriba
3. 🌍 O'rnatmasdan ishlatmoqchi bo'lganlar uchun **web versiya**
4. ☁️ Bir nechta qurilmada **davom ettirish** (kompyuter + telefon)

## Muhum printsip (hozirdan qo'yilgan)

```
Desktop — mustaqil ishlaydi. Server — IXTIYORIY qo'shimcha.
Hech qachon: "server ishlamayapti → dastur ishlamayapti".
```

Shu sababli hozir: SQLite (fayl), lokal library/, JSON — hammasi
**keyin serverga ko'chirish oson** formatda.

---

## Bosqich 2 — Server + jamoaviy

### Server nima qiladi?

```
Desktop (Bosqich 1)              Server (Bosqich 2)
├── Kutubxona (lokal)     ←sync→  ├── Profil (ixtiyoriy)
├── Tahlil (lokal)        ←────→  ├── Umumiy tahlillar kutubxonasi
├── Progress (lokal)      ←sync→  ├── Progress backup (E2E shifrlangan)
└── AI (to'liq lokal mumkin)      └── API: tahlil ulashish
```

### Xizmatlar

| Xizmat | Vazifa |
|--------|--------|
| Auth | Ixtiyoriy (email/Google) — desktop'da hamon mumkunsiz ishlash |
| Content API | `analysis/` JSON'larni saqlash/ulashish |
| Moderatsiya | Tahlil sifati — avval moderator tekshiradi |
| Sync API | E2E shifrlangan progress/notes |
| RAG servisi | (ixtiyoriy) Ustoz chat uchun vektor qidiruv |

### Texnik tanlov (taxminiy)

- **PostgreSQL** (+ pgvector RAG uchun)
- **API:** Next.js API routes yoki FastAPI — jamoa qaysini biladi
- **Hosting:** bepul darajadan boshlash (Supabase/Neon + Vercel/Fly.io)
- **Desktop ↔ server:** REST + JWT

---

## Bosqich 3 — Online public + obuna

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

### Asosiy feature'lar

1. **Ustoz/professor profili**
   - Kimligi, yo'nalishi (moliya, psixologiya, startup...)
   - O'z tahlillari, kurslari, "tavsiya qiladigan kitoblari"
   - Obunachilar soni

2. **Obuna (subscription)**
   - Ustoz yangi tahlil/maqola/chop chiqarganda **push** (ilova ichida)
   - Email yoki ilova bildirishnomasi
   - ⭐ Eng muhim engagement mexanizmi — "kuzatib borish"

3. **O'zaro bilim almashish**
   - Tahlilga **izohlar** (fikr, tuzatish taklifi)
   - "Men qo'lladim" tajribalari — ixtiyoriy ravishda **umumiy**
     (foydalanuvchi xohlasa yopiq qoladi)
   - Qo'shma **eslatmalar/jamoalar** (klub, darslik guruh)

4. **Web versiya (public)**
   - O'rnatmasdan: kitob tahlilini o'qish, quiz yechish
   - Desktop'ga o'tish taklifi (to'liq funksiya uchun)

5. **Umumiy kutubxona**
   - Desktop'da tahlil qilingan → foydalanuvchi "Ulamasdan foydalaning"
     tugmasi bosadi → (moderatsiyadan so'ng) umumiyga tushadi
   - ⚖️ Faqat `meta + analysis` (matn emas) — mualliflik xavfsiz

### Monetizatsiya? (yalang'och vahiya)

Loyiha **bepul va open source** deb e'lon qilingan. Ehtimol variantlar:

| Variant | Izoh |
|---------|------|
| ✅ Hammasi bepul | Eng sodda, open source ruhiga mos — **default shu** |
| ⚠️ Server xarajatlari | Hosting bill uchun ixtiyoriy `GitHub Sponsors` / `Donate` |
| ⚠️ Ustozlar uchun premium | Ustoz profil + analitika pullik bo'lsa — platforma emas, ustozlar uchun. **Jamoada muhokama qilinadi** |

> Qoida: **foydalanuvchi uchun doim bepul.** Pullik faqat ixtiyoriy
> homiylik yoki ustozlarga qo'shimcha tool bo'lsa — hali qaror qilinmagan.

---

## Desktop ↔ Online integratsiya yo'li

| Bosqich | Desktop | Online |
|---------|---------|--------|
| 1 | To'liq mustaqil | Yo'q |
| 2 | Mustaqil + ixtiyoriy sync | Tahlillarni ulashish API |
| 3 | Mustaqil + "Ulamasdan foydalanish" | Web versiya + ustozlar + obuna |

## Hozir shu kelajak uchun nima qilish kerak? (arxitekturada)

1. ✅ `analysis/` JSON formatlari **serverga yuborishga tayyor** (bu hujjat 06)
2. ✅ DB'da `book.slug` — global identifikator (serverda ham xuddi shu slug)
3. ✅ UI'da "Ulamasdan foydalanish" tugmasi uchun joy (Bosqich 3'da faollashadi)
4. ✅ Auth'ni **majburiy qilmang** — profile lokal, keyin ixtiyoriy ulash
5. ❌ Hozir server kodi yozilmaydi — Bosqich 1 tugagach
