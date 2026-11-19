/** Mahalliy vaqtga asoslangan sana (UTC emas).
 *  O'zbekiston UTC+5: toISOString() kun boshida oldingi kunga o'tib ketadi. */
export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 'YYYY-MM-DD' yoki ISO -> '19.11.2026' */
export function niceDate(value: string): string {
  const [y, m, d] = value.slice(0, 10).split('-')
  if (!y || !m || !d) return value
  return `${d.slice(0, 2)}.${m.slice(0, 2)}.${y}`
}
