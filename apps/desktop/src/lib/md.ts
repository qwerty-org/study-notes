import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

// Kitob matni uchun ruxsat etilgan minimal teglar: faqat matn formatlash.
// SVG/MathML, <script>, <style>, <form> va shunga o'xshashlar kiritilmagan.
const ALLOWED_TAGS = [
  'a', 'blockquote', 'br', 'code', 'del', 'div', 'em', 'figcaption', 'figure',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'input', 'li', 'ol', 'p',
  'pre', 's', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot',
  'th', 'thead', 'tr', 'ul',
]

const ALLOWED_ATTR = [
  'align', 'alt', 'checked', 'class', 'colspan', 'dir', 'disabled', 'height',
  'href', 'lang', 'rel', 'rowspan', 'src', 'target', 'title', 'type', 'width',
]

// Faqat xavfsiz sxemalar va nisbiy havolalar; javascript:/data:/vbscript: o'tmaydi.
const ALLOWED_URI_REGEXP =
  /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z][a-z\d+.-]*(?:[?#/]|$))/i

const MEDIA_TAGS = new Set(['img', 'audio', 'video', 'source', 'track'])

/** DOMPurify ayrim media teglarida `data:` URI'larga ruxsat beradi — buni yopamiz. */
function hardenMarkup(node: Element): void {
  const tag = node.tagName.toLowerCase()

  if (tag === 'a') {
    if (node.hasAttribute('target')) node.setAttribute('rel', 'noopener noreferrer')
    return
  }

  // GFM vazifalar ro'yxati: faqat o'qiladigan checkbox, boshqa input turi emas.
  if (tag === 'input') {
    node.setAttribute('type', 'checkbox')
    node.setAttribute('disabled', '')
    return
  }

  if (MEDIA_TAGS.has(tag)) {
    for (const attr of ['src', 'href', 'poster']) {
      const value = node.getAttribute(attr)
      if (value && /^\s*data:/i.test(value)) node.removeAttribute(attr)
    }
  }
}

// HMR paytida hook ikki barobar qo'shilib qolmasligining oldini olamiz.
DOMPurify.removeHook('afterSanitizeAttributes', hardenMarkup)
DOMPurify.addHook('afterSanitizeAttributes', hardenMarkup)

/**
 * Lokal Markdown → XSS'dan tozalangan HTML.
 * Foydalanuvchi import qilgan .md/.txt ham sanitize qilinadi —
 * Electron/Tauri ichida ishonchsiz HTML'ni render qilish xavfsiz emas.
 */
export function renderMD(md: string): string {
  const html = marked.parse(md, { async: false }) as string
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_NAMESPACES: ['http://www.w3.org/1999/xhtml'],
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'svg', 'math', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['style', 'srcset', 'formaction', 'srcdoc', 'ping'],
  })
}
