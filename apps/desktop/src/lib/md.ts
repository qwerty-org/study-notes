import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

/** Oddiy Markdown → HTML (lokal kontent uchun) */
export function renderMD(md: string): string {
  return marked.parse(md, { async: false }) as string
}
