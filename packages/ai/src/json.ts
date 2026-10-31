/** AI javobidan JSON ajratib olish (fence, izohlar, ortiqcha matn bilan kurash) */
export function extractJSON<T>(raw: string): T {
  let text = raw.trim()

  // ```json ... ``` fence
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) text = fence[1].trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Javobda JSON topilmadi: ${text.slice(0, 120)}...`)
  }
  text = text.slice(start, end + 1)

  try {
    return JSON.parse(text) as T
  } catch {
    // Oxirgi urinish: vergul ortiqcha bo'lsa tozalash
    const cleaned = text.replace(/,\s*([}\]])/g, '$1')
    return JSON.parse(cleaned) as T
  }
}

/** JSON parse xatosida 1 marta retry (docs/05) */
export async function withJSONRetry<T>(
  call: (feedback?: string) => Promise<string>,
  parse: (raw: string) => T,
): Promise<T> {
  try {
    return parse(await call())
  } catch (firstError) {
    const feedback = `Javobing noto'g'ri JSON edi (${(firstError as Error).message}). FAQAT JSON qaytar, boshqa matn yozma.`
    return parse(await call(feedback))
  }
}
