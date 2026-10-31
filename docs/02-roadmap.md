# 02 — Roadmap: bosqichli reja

## Umumiy ko'rinish

```
Bosqich 0        Bosqich 1           Bosqich 2          Bosqich 3
Poydevor    →    Lokal MVP      →    Server +      →    Online public
(1-2 hafta)      (4-6 hafta)         jamoaviy           + obuna
                                                  
✅ Formatlar      ✅ Desktop ilova     ✅ AI ustoz        ✅ Web versiya
✅ Agent rules    ✅ Kutubxona         ✅ Hamjamiyat      ✅ Professor/ustoz
✅ Pilot kitob    ✅ Tahlil + quiz     ✅ Tahlil PR'lar   ✅ Obuna + bilim
✅ Konvertatsiya  ✅ Spaced repetition ✅ Sync (ixtiyoriy)   almashish
```

---

## Bosqich 0 — Poydevor (1-2 hafta)

**Maqsad:** Eng xavfli va noaniq qismlarni erta sinash.

| Ish | Tafsilot | Xavf |
|-----|----------|------|
| 1. JSON formatlarini aniqlash | `docs/06-data-formats.md` asosida 1 pilot kitobni qo'lda tahlil qilish | Past |
| 2. Agent rules yozish | `analyst.md`, `quiz-master.md`, `life-mentor.md` + JSON schemalar | Past |
| 3. PDF/EPUB → MD sinash | 3-4 xil faylda (yaxshi PDF, skan PDF, EPUB) — **eng xavfli qism** | ⚠️ Yuqori |
| 4. AI'ni sinash | Pilot kitob bobini agent rules bilan tahlil qilish, sifatni baholash | O'rtacha |
| 5. Repozitoriya | GitHub: papka tuzilmasi, README, MIT litsenziya | Past |

**Natija:** "Format to'g'ri ishlaydi, AI sifati qoniqarli, konvertatsiya mumkin"
— degan ishonch.

**Checkout savoli:** Pilot qaysi kitob? (masalan: *Atomic Habits* — ingliz,
yoki o'zbek tilidagi biror kitob)

---

## Bosqich 1 — Lokal MVP (4-6 hafta)

**Maqsad:** Foydalanuvchi o'z kompyuterida to'liq yo'lni bosib o'tsin:
Kitob yuklash → Tahlil → O'qish → Quiz → Takrorlash.

### Haftalik bo'linish (taxminiy)

| Hafta | Ish |
|-------|-----|
| 1-2 | Tauri loyihasi + asosiy layout (sidebar, router, mavzu) |
| 2-3 | Kutubxona + import (drag & drop, konvertatsiya pipeline) |
| 3-4 | Tahlil chaqiruvi (AI ulash, agent rules, progress ekranlari) |
| 4-5 | Kitob sahifasi: Xulosalar / Terminlar / O'qish tablari |
| 5-6 | Quiz + Spaced repetition (FSRS) + Progress + "Men qo'lladim" |

### MVP tarkibi (majburiy)

- [ ] Onboarding (3 qadam: AI → ism → birinchi kitob)
- [ ] Bosh sahifa: davom ettir + bugungi takrorlash + streak
- [ ] Kutubxona: drag & drop import, holatlar (o'qilmoqda/tugatilgan)
- [ ] Tahlil: boblarga bo'lib AI chaqiruvi, progress
- [ ] Kitob sahifasi: O'qish, Xulosalar, Terminlar, Quiz, Hayotda qo'llash
- [ ] Quiz rejimi: savol → javob → sabab → natija
- [ ] Spaced repetition: kun 1/3/7/14 qaytarish jadvali
- [ ] "Men qo'lladim" tugmasi + jurnal
- [ ] AI ulash: Gemini / OpenAI / Ollama (API key xavfsiz saqlanadi)
- [ ] Sozlamalar: mavzu (tungi/kunduz), til, eksport

### MVP'da YO'Q (ataylab)

- ❌ Server, login, sync
- ❌ AI ustoz (chat) — Bosqich 2
- ❌ Hamjamiyat / PR bilan kitob qo'shish
- ❌ Mobil ilova
- ❌ To'lov / obuna

---

## Bosqich 2 — Server + jamoaviy (keyin)

- 🤖 **AI ustoz** — kitob matni bo'yicha savol-javob (RAG)
- 🌐 **Server** — tahlillarni saqlash va ulashish (API)
- 👥 **Hamjamiyat** — tahlillar GitHub PR yoki server orqali qo'shiladi,
  moderator tekshiradi
- ☁️ **Ixtiyoriy sync** — boshqa qurilmada davom etish (E2E shifrlangan)
- 📊 **Tahlil sifati baholash** — foydalanuvchi "bu yomon edi" tugmasi

## Bosqich 3 — Online public + obuna (g'oya)

Sabab: foydalanuvchi **boshqa professor va ustozlarga obuna bo'lib** ularni
kuzatib borishi, **o'zaro bilim almashishi** kerak.

- 🌍 Web versiya (foydalanuvchi o'rnatmasdan ishlatadi)
- 👨‍🏫 **Ustoz/professor profillari** — o'z tahlillari, kurslari, yo'nalishlari
- 🔔 **Obuna** — ustozlar yangi tahlil/maqola chiqarganda push
- 💬 **O'zaro almashish** — izohlar, eslatmalar, "qo'lladim" jurnallari
  umumiy (ixtiyoriy, yopiq jamoalar ham)
- 📚 **Umumiy kutubxona** — hamjamiyat tahlillari

> Eslatma: Bosqich 3 pullik qismlari bo'lishi mumkin (obuna ustozlarga),
> lekin asosiy platforma **bepul qoladi** — bu loyihaning qoidasi.

---

## Umumiy xatarlar

| Xatar | Kamaytirish |
|-------|-------------|
| PDF konvertatsiya sifati past | Bosqich 0'da erta sinash; yomon fayllarga ogohlantirish; EPUB'ni afzal ko'rish |
| AI tahlil sifati noaniq | Agent rules + few-shot namunalar; pilot kitobda qo'lda baholash |
| Desktop framework tanlovi | Tauri'ni 1 haftalik prototipda sinash; muammo bo'lsa Electron'ga fallback |
| Hujjatlar eskirib qolishi | Har bir qaror `docs/` da — hujjat = manba |
