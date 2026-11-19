import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

/**
 * Lokal Markdown → XSS'dan tozalangan HTML.
 * Foydalanuvchi import qilgan .md/.txt ham sanitize qilinadi —
 * Electron/Tauri ichida ishonchsiz HTML'ni render qilish xavfsiz emas.
 */
export function renderMD(md: string): string {
  const html = marked.parse(md, { async: false }) as string
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'],
  })
}
