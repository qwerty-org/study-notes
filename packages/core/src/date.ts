/** Mahalliy vaqtga asoslangan sana (UTC emas).
 *  O'zbekiston UTC+5: toISOString() kun boshida oldingi kunga o'tib ketadi. */
export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Berilgan oyning haqiqiy kunlari soni (kabisa yillari hisobga olinadi).
 *  `new Date(year, month, 0)`: keyingi oyning 0-kuni = shu oyning oxirgi kuni.
 *  Raqamli konstruktor ishlatilgani uchun timezone/ISO talqiniga bog'liq emas. */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Mahalliy kalendar bo'yicha `days` kun keyingi (yoki oldingi) sanani qaytaradi.
 *
 * 24 soatlik (ms) qo'shish DST o'tishlarida xato beradi: kun 23 yoki 25 soat
 * bo'lishi mumkin, natijada kalendar kuni o'tib ketadi yoki takrorlanadi.
 * Tush payti (12:00) anchorga olinadi va `setDate` bilan kalendar arifmetikasi
 * qo'llanadi — bu DST, oy/yil chegaralari va kabisa yili uchun barqaror.
 */
export function addLocalDays(days: number, base: Date = new Date()): Date {
  const anchored = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 12, 0, 0, 0)
  anchored.setDate(anchored.getDate() + days)
  return anchored
}

/** 'YYYY-MM-DD' yoki ISO -> '19.11.2026' (uz-UZ: DD.MM.YYYY).
 *
 * Matn bo'yicha formatlanadi: `new Date(value)` ishlatilmaydi, aks holda
 * '2026-11-20' UTC yarim tun sifatida talqin qilinib g'arbiy timezone'larda
 * 19.11 bo'lib ketishi mumkin edi. */
export function niceDate(value: string): string {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value)
  if (!match) return value

  const [, y, mRaw, dRaw] = match
  const month = Number(mRaw)
  const day = Number(dRaw)

  // Noto'g'ri kalendar sanasi (oy 1–12 dan tashqari yoki oy oxiridan katta kun,
  // jumladan kabisa bo'lmagan yilda 29-fevral) bo'lsa, qiymatni o'zgartirmay qaytaramiz.
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(Number(y), month)) {
    return value
  }

  const m = mRaw.padStart(2, '0')
  const d = dRaw.padStart(2, '0')
  return `${d}.${m}.${y}`
}
