/** AI javobidan JSON ajratib olish (fence, izohlar, ortiqcha matn bilan kurash) */
export function extractJSON<T>(raw: string): T {
  const source = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')

  let lastError: unknown
  // Avval code-block ichini, keyin butun javobni sinab ko'ramiz: birinchi fence
  // namuna bo'lib, asl JSON keyingi blokda bo'lsa ham ishlayveradi.
  for (const attempt of jsonAttempts(source)) {
    for (const slice of jsonSlices(attempt)) {
      const cleaned = cleanJson(slice)
      const variants = [cleaned]

      // Kesilgan (truncated) javobni tiklashga bitta urinish.
      const repaired = repairTruncated(cleaned)
      if (repaired && repaired !== cleaned) variants.push(repaired)

      for (const variant of variants) {
        try {
          return JSON.parse(variant) as T
        } catch (error) {
          lastError = error
        }
      }
    }
  }

  const detail = lastError instanceof Error ? ` (${lastError.message})` : ''
  throw new Error(`Javobda JSON topilmadi${detail}: ${source.slice(0, 120)}...`)
}

/** ```json ... ``` kabi bloklar + butun matn (tartib muhim) */
function jsonAttempts(text: string): string[] {
  const attempts: string[] = []
  const fence = /```[^\S\n]*([a-zA-Z0-9_+.-]*)[^\S\n]*\n([\s\S]*?)```/g
  let match: RegExpExecArray | null
  while ((match = fence.exec(text)) !== null && attempts.length < 12) {
    const body = match[2].trim()
    if (body) attempts.push(body)
  }
  attempts.push(text)
  return attempts
}

/**
 * Matndagi har bir `{` / `[` dan boshlab muvozanatli bo'lagini topadi.
 * Fence oldidagi izohda `{id, ...}` kabi misol bo'lsa ham keyingi haqiqiy
 * ob'ekt sinab ko'riladi. Satr ichidagi qavslar hisobga olinmaydi.
 */
function jsonSlices(text: string): string[] {
  const starts: number[] = []
  for (let i = 0; i < text.length && starts.length < 24; i++) {
    if (text[i] === '"') {
      i = skipString(text, i)
      continue
    }
    if (text[i] === '{' || text[i] === '[') starts.push(i)
  }

  const slices = starts.map((start) => {
    const end = findClosing(text, start)
    return end === -1 ? text.slice(start) : text.slice(start, end + 1)
  })

  // Hech qanday ob'ekt yo'q bo'lsa, hech bo'lmaganda ma'lumotli xato qaytarish.
  if (slices.length === 0 && text.trim()) slices.push(text.trim())
  return slices
}

/** Satr boshidan oxirgi " gacha bo'lgan indeks (satr tugamasa oxirgi indeks) */
function skipString(text: string, start: number): number {
  let escaped = false
  for (let i = start + 1; i < text.length; i++) {
    if (escaped) {
      escaped = false
    } else if (text[i] === '\\') {
      escaped = true
    } else if (text[i] === '"') {
      return i
    }
  }
  return text.length - 1
}

/** start dagi ochilgan qavsga mos yopilish qavsining indeksi yoki -1 */
function findClosing(text: string, start: number): number {
  const open = text[start]
  const close = open === '{' ? '}' : ']'
  let depth = 0
  for (let i = start; i < text.length; i++) {
    if (text[i] === '"') {
      i = skipString(text, i)
      continue
    }
    if (text[i] === open) depth++
    else if (text[i] === close && --depth === 0) return i
  }
  return -1
}

/** Izohlar va oxirgi vergullarni satr ichidagi matnga tegmasdan tozalash */
function cleanJson(text: string): string {
  let out = ''
  let stringStart = -1
  let escaped = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (stringStart !== -1) {
      out += ch
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') stringStart = -1
      continue
    }
    if (ch === '"') {
      stringStart = i
      out += ch
      continue
    }
    if (ch === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') i++
      if (i < text.length) out += '\n'
      continue
    }
    if (ch === '/' && text[i + 1] === '*') {
      i += 2
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++
      i++
      continue
    }
    out += ch
  }

  return out.replace(/,\s*([}\]])/g, '$1').trim()
}

/**
 * Oxiri kesilgan JSONni tiklash: oxirgi to'liq bo'lakka qadar kesib,
 * ochilgan qavslarni yopadi. Hech qanday kod bajarilmaydi — faqat matn.
 */
function repairTruncated(input: string): string | null {
  const text = input.trim()
  const stack: string[] = []
  let safePrefix = 0
  let safeStack: string[] = []
  let stringStart = -1
  let escaped = false

  const markSafe = (upto: number): void => {
    safePrefix = upto
    safeStack = stack.slice()
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (stringStart !== -1) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') {
        const start = stringStart
        stringStart = -1
        let next = i + 1
        while (next < text.length && /\s/.test(text[next])) next++
        // Kalit so'z qiymatsiz qolsa, uni ham tashlab yuboramiz.
        markSafe(text[next] === ':' ? start : i + 1)
      }
      continue
    }

    if (ch === '"') {
      stringStart = i
      escaped = false
    } else if (ch === '{' || ch === '[') {
      stack.push(ch === '{' ? '}' : ']')
      markSafe(i + 1)
    } else if (ch === '}' || ch === ']') {
      stack.pop()
      markSafe(i + 1)
    } else if (ch === ',') {
      markSafe(i)
    } else if (/[0-9-]/.test(ch)) {
      markSafe(i + 1)
    } else {
      const literal = ['true', 'false', 'null'].find((word) => text.startsWith(word, i))
      if (literal) {
        i += literal.length - 1
        markSafe(i + 1)
      }
    }
  }

  if (safePrefix === text.length && stack.length === 0) return null

  const prefix = text.slice(0, safePrefix).replace(/[,:\s]+$/, '')
  return prefix + safeStack.reverse().join('')
}

/** Xato xabarini istisno turi bo'lishidan qat'i nazar matnga aylantirish */
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/** JSON parse xatosida 1 marta retry (docs/05) */
export async function withJSONRetry<T>(
  call: (feedback?: string) => Promise<string>,
  parse: (raw: string) => T,
): Promise<T> {
  try {
    return parse(await call())
  } catch (firstError) {
    // Faqat JSON/format xatosida qayta so'raymiz. Autentifikatsiya, tarmoq,
    // timeout va boshqa provayder xatolarida ikkinchi chaqiruv keraksiz.
    const isParseFailure =
      firstError instanceof SyntaxError ||
      (firstError instanceof Error && /JSON/i.test(firstError.message))
    if (!isParseFailure) throw firstError
    const feedback = `Javobing noto'g'ri JSON edi (${errorMessage(firstError)}). FAQAT JSON qaytar, boshqa matn yozma.`
    return parse(await call(feedback))
  }
}
