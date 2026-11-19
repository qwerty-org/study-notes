/** Mahalliy vaqt asosida sana (UTC emas — UTC+5 da 'bugun' siljib ketmasligi uchun). */
export function localDay(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** '2026-11-20' → '20.11.2026' yoki 'Ertaga' / 'Bugun' */
export function niceDate(iso: string): string {
  const today = localDay()
  const tomorrow = localDay(new Date(Date.now() + 86400000))
  if (iso === today) return 'Bugun'
  if (iso === tomorrow) return 'Ertaga'
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}
