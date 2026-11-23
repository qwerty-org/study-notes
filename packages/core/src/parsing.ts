/** Matnni boblarga bo'lish — sarlavha bo'yicha (H1, yoki H1 yo'q bo'lsa H2) */
import type { Chapter } from './types'

/**
 * Qator sarlavha ekanligini aniqlaydi.
 * To'g'ri ATX ko'rinishi ("# Bob", "## Bob") va konvertatsiyada buzilgan,
 * bo'shliqsiz ko'rinishi ("#1-bob: ...") ham qo'llab-quvvatlanadi.
 * Faqat 1–2-darajali sarlavhalar bob hoshiyasi hisoblanadi.
 */
function headingOf(line: string): { level: number; title: string } | null {
  let m = line.match(/^(#{1,2})[ \t]+(.+)$/)
  if (!m) {
    // Ba'zi konvertorlar "#" bilan sarlavha orasidagi bo'shliqni tashlab yuboradi.
    // Faqat raqam yoki "bob" bilan boshlangan qatorni sarlavha deb hisoblaymiz
    // (oddiy "#teg" kabi matnni bob deb olib ketmaslik uchun).
    m = line.match(/^(#{1,2})[ \t]*((?:\d|bob\b).*)$/i)
  }
  if (!m) return null
  const title = m[2].trim()
  return title ? { level: m[1].length, title } : null
}

/** "1-bob: Sarlavha" / "Bob 3. Sarlavha" kabi old qismni tozalash */
function cleanTitle(raw: string): string {
  return raw
    .replace(/^(?:\d+\s*[-–—.)]?\s*bob|bob\s*\d+)\s*[:–—.-]?\s*/i, '')
    .trim()
}

/**
 * Matnni boblarga ajratadi.
 * - H1 sarlavhalar mavjud bo'lsa — bob chegarasi H1.
 * - Faqat H2 sarlavhalar bo'lsa — bob chegarasi H2 (konvertatsiya xususiyati).
 * - Hech qanday sarlavha yo'q bo'lsa — butun matn "Kirish" nomli yagona bob.
 * Bo'sh/qisman buzilgan matnda hech qachon xato tashlamaydi.
 */
export function splitChapters(content: string): Chapter[] {
  const raw = typeof content === 'string' ? content : ''
  if (!raw.trim()) return []

  const lines = raw.replace(/\r\n?/g, '\n').split('\n')

  // Qaysi daraja bob hoshiyasi ekanligini oldindan aniqlaymiz: H1 bor bo'lsa H1,
  // aks holda H2. Shunday qilib H1 ichidagi H2 kichik sarlavha bo'lib qoladi.
  let chapterLevel: 1 | 2 | null = null
  for (const line of lines) {
    const h = headingOf(line)
    if (h?.level === 1) {
      chapterLevel = 1
      break
    }
    if (h?.level === 2 && chapterLevel === null) chapterLevel = 2
  }

  if (chapterLevel === null) {
    const text = lines.join('\n').trim()
    return text ? [{ index: 0, title: 'Kirish', content: text }] : []
  }

  const chapters: Chapter[] = []
  let current: { title: string; lines: string[] } | null = null

  const push = () => {
    if (!current) return
    const text = current.lines.join('\n').trim()
    if (text) chapters.push({ index: chapters.length, title: current.title, content: text })
  }

  for (const line of lines) {
    const h = headingOf(line)
    if (h && h.level === chapterLevel) {
      push()
      current = { title: cleanTitle(h.title) || `${chapters.length + 1}-bob`, lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      // Sarlavhasiz boshlanish — "Kirish" bobi
      current = { title: 'Kirish', lines: [line] }
    }
  }
  push()
  return chapters
}

/** Sarlavhasiz matn uchun: birinchi qatordan yoki fayl nomidan sarlavha */
export function titleFromContent(content: string, fallback: string): string {
  if (typeof content !== 'string') return fallback
  const lines = content.replace(/\r\n?/g, '\n').split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || /^#+$/.test(trimmed)) continue

    const h = headingOf(line)
    if (h) return cleanTitle(h.title) || fallback

    // Oddiy matn qatori faqat qisqa bo'lsa sarlavha bo'lishi mumkin;
    // uzun paragraf bo'lsa fayl nomiga murojaat qilamiz.
    if (trimmed.length >= 3 && trimmed.length <= 80) return trimmed
    break
  }
  return fallback
}
