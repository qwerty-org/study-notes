/** Matnni boblarga bo'lish — "#" (H1) sarlavhalar bo'yicha */
import type { Chapter } from './types'

export function splitChapters(content: string): Chapter[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const chapters: Chapter[] = []
  let current: { title: string; lines: string[] } | null = null

  const push = () => {
    if (current) {
      const text = current.lines.join('\n').trim()
      if (text) {
        chapters.push({ index: chapters.length, title: current.title, content: text })
      }
    }
  }

  for (const line of lines) {
    const m = line.match(/^#\s+(.*)$/)
    if (m) {
      push()
      current = { title: m[1].trim().replace(/^\d+[-–—]\s*bob\s*:\s*/i, '').trim(), lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      // Sarlavhasiz boshlanish — 1-bob
      current = { title: 'Kirish', lines: [line] }
    }
  }
  push()
  return chapters
}

/** Sarlavhasiz matn uchun: birinchi qatordan yoki fayl nomidan sarlavha */
export function titleFromContent(content: string, fallback: string): string {
  const firstLine = content.split('\n').find((l) => l.trim())
  if (firstLine) {
    const m = firstLine.match(/^#{1,2}\s+(.*)$/) ?? firstLine.match(/^(.{3,80})$/)
    if (m) return m[1].trim()
  }
  return fallback
}
