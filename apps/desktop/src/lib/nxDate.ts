/**
 * Mahalliy kalendar kuniga asoslangan sana yordamchilari.
 * `toISOString()` / UTC ishlatilmaydi: O'zbekiston (UTC+5) da yarim tunda
 * "bugun" oldingi kunga siljib ketmasligi uchun.
 */

/** Mahalliy vaqt asosida sana (UTC emas — UTC+5 da 'bugun' siljib ketmasligi uchun). */
export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Mahalliy kalendar bo'yicha `days` kun keyingi (yoki oldingi) sanani qaytaradi.
 *
 * 24 soatlik (ms) qo'shish DST o'tishlarida xato beradi: kun 23 yoki 25 soat
 * bo'lishi mumkin, natijada kalendar kuni o'tib ketadi yoki takrorlanadi.
 * Tush payti (12:00) anchorga olinadi va `setDate` bilan kalendar arifmetikasi
 * qo'llanadi — bu DST, oy/yil chegaralari va kabisa yili uchun barqaror.
 */
function addLocalDays(days: number, base: Date = new Date()): Date {
  const anchored = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 12, 0, 0, 0)
  anchored.setDate(anchored.getDate() + days)
  return anchored
}

/**
 * '2026-11-20' (yoki ISO vaqtli string) → '20.11.2026', 'Bugun' yoki 'Ertaga'.
 *
 * Formatlash matn bo'yicha bajariladi: `new Date(iso)` orqali timezone tufayli
 * kun siljib ketmaydi (masalan, '2026-11-20' UTC yarim tun sifatida talqin
 * qilinib, g'arbiy timezone'larda 19.11 bo'lib qolishi mumkin edi).
 */
export function niceDate(iso: string): string {
  const match = /^(\d{1,4})-(\d{1,2})-(\d{1,2})/.exec(iso)
  if (!match) return iso

  const [, y, mRaw, dRaw] = match
  const m = mRaw.padStart(2, '0')
  const d = dRaw.padStart(2, '0')
  const dateOnly = `${y}-${m}-${d}`

  const today = localDay()
  const tomorrow = localDay(addLocalDays(1))
  if (dateOnly === today) return 'Bugun'
  if (dateOnly === tomorrow) return 'Ertaga'

  // O'zbekcha (uz-UZ) format: DD.MM.YYYY — Intl/Date ishtirok etmagani uchun
  // timezone'ga bog'liq emas.
  return `${d}.${m}.${y}`
}
