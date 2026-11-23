/**
 * AI provider adapteri — bitta interfeys, bir nechda provayder (docs/03).
 * - gemini  → Google AI Studio (bepul kalit)
 * - openai  → OpenAI API
 * - ollama  → lokal (http://localhost:11434), offline, kalit kerak emas
 *
 * Eslatma: brauzerda to'g'ridan-to'g'ri chaqiruv CORS talab qiladi;
 * Gemini va Ollama CORS'ni qo'llab-quvvatlaydi. Desktop qobig'iga
 * (Tauri/Electron) o'tganda CORS muammosi yo'qoladi.
 *
 * Xatoliklar `ProviderError` sinfida, `kind` maydoni bilan keladi
 * (auth / rate-limit / network / timeout / aborted / parse / server).
 * Xavfsizlik: API kaliti hech qachon URL'ga yoki xatolik matniga qo'shilmaydi,
 * provayderning xom javob tanasi ham xatolikka kiritilmaydi.
 */
import type { AIConfig, AIProvider } from '@study-notes/core'

export interface ProviderInfo {
  id: AIProvider
  name: string
  needsKey: boolean
  freeHint: string
  defaultModel: string
  keyUrl?: string
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    needsKey: true,
    freeHint: 'Bepul limit bor, tez. Tavsiya.',
    defaultModel: 'gemini-2.0-flash',
    keyUrl: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT)',
    needsKey: true,
    freeHint: 'To\'lovli, aniqroq javob.',
    defaultModel: 'gpt-4o-mini',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'ollama',
    name: 'Ollama (lokal)',
    needsKey: false,
    freeHint: 'To\'liq offline va bepul. ollama.com dan o\'rnatiladi.',
    defaultModel: 'llama3.2',
  },
]

export function providerInfo(id: AIProvider): ProviderInfo {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0]
}

/* -------------------------------------------------------------------------- */
/* Xatolar                                                                     */
/* -------------------------------------------------------------------------- */

/** Xatolik turi — chaqiruvchi dasturiy jihatdan farqlashi uchun. */
export type ProviderErrorKind =
  | 'auth'
  | 'rate-limit'
  | 'network'
  | 'timeout'
  | 'aborted'
  | 'parse'
  | 'server'

/** Barcha provayder xatolari uchun yagona sinf. */
export class ProviderError extends Error {
  readonly kind: ProviderErrorKind
  readonly status?: number

  constructor(kind: ProviderErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ProviderError'
    this.kind = kind
    this.status = status
    // Qayta transpilyatsiyada ham instanceof to'g'ri ishlashi uchun.
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** So'rov uchun standart vaqt chegarasi. Chaqiruvchi signali ham hurmat qilinadi. */
export const AI_TIMEOUT_MS = 60_000

const MSG_KEY_MISSING = 'API kalit kiritilmagan — Sozlamalar → AI bo’limidan qo’shing.'
const MSG_KEY_BAD = 'API kaliti yaroqsiz yoki muddati tugagan. Sozlamalarda kalitni tekshiring.'
const MSG_LIMIT = 'Provayder limiti tugagan — so’rovlar juda ko’p yuborildi. Biroz kuting va qaytadan urining.'
const MSG_SERVER = 'Provayder serverida vaqtinchalik xatolik. Biroz kuting va qaytadan urining.'
const MSG_NETWORK = 'Tarmoq xatosi — internet ulanishini tekshiring.'
const MSG_TIMEOUT = 'So’rov vaqti tugadi. Internet ulanishini tekshiring va qaytadan urining.'
const MSG_ABORTED = 'So’rov bekor qilindi.'
const MSG_UNEXPECTED = 'Kutilmagan xatolik yuz berdi. Qaytadan urining.'
const MSG_OLLAMA = 'Ollama bilan bog’lanib bo’lmadi. U o’rnatilgani va ishlab turganini tekshiring.'

function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === 'AbortError'
}

function timeoutError(): ProviderError {
  return new ProviderError('timeout', MSG_TIMEOUT)
}

function abortedError(): ProviderError {
  return new ProviderError('aborted', MSG_ABORTED)
}

function httpError(status: number, label: string, ollama: boolean): ProviderError {
  if (ollama) return new ProviderError('network', MSG_OLLAMA, status)
  if (status === 401 || status === 403) return new ProviderError('auth', MSG_KEY_BAD, status)
  if (status === 429 || status === 402) return new ProviderError('rate-limit', MSG_LIMIT, status)
  if (status >= 500) return new ProviderError('server', MSG_SERVER, status)
  return new ProviderError('network', `${label} so’rovi rad etildi (${status}). Sozlamalarni tekshiring.`, status)
}

interface TimeoutHandle {
  signal: AbortSignal
  timedOut: () => boolean
  dispose: () => void
}

/** Chaqiruvchi signali + vaqt chegarasini bitta signalga birlashtiradi. */
function createTimeout(callerSignal?: AbortSignal, ms: number = AI_TIMEOUT_MS): TimeoutHandle {
  const controller = new AbortController()
  let didTimeout = false

  const timer = setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, ms)

  const onCallerAbort = () => controller.abort()
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort()
    else callerSignal.addEventListener('abort', onCallerAbort, { once: true })
  }

  return {
    signal: controller.signal,
    timedOut: () => didTimeout,
    dispose: () => {
      clearTimeout(timer)
      callerSignal?.removeEventListener('abort', onCallerAbort)
    },
  }
}

/**
 * HTTP so'rovi + javobni o'qish. Xom xatolik va xom javob tanasi hech qayerga
 * chiqmaydi — faqat status va oldindan tayyorlangan xabar ishlatiladi.
 */
async function requestJSON(
  url: string,
  init: RequestInit,
  label: string,
  callerSignal?: AbortSignal,
  ollama = false,
): Promise<any> {
  const handle = createTimeout(callerSignal)
  try {
    let res: Response
    try {
      res = await fetch(url, { ...init, signal: handle.signal })
    } catch {
      // fetch xatosi matnida URL (va Gemini kaliti) bo'lishi mumkin — yashiramiz.
      if (ollama) throw new ProviderError('network', MSG_OLLAMA)
      if (handle.timedOut()) throw timeoutError()
      if (callerSignal?.aborted) throw abortedError()
      throw new ProviderError('network', MSG_NETWORK)
    }

    if (!res.ok) throw httpError(res.status, label, ollama)

    try {
      return await res.json()
    } catch {
      // Tanadagi xom matn (kalit/JSON izlari) xatolikka qo'shilmaydi.
      if (handle.timedOut()) throw timeoutError()
      if (callerSignal?.aborted) throw abortedError()
      throw new ProviderError('parse', `${label} javobi noto’g’ri yoki bo’sh. Qaytadan urining.`)
    }
  } finally {
    handle.dispose()
  }
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

/** System + user prompt bilan bitta chaqiruv → matn */
export async function complete(
  cfg: AIConfig,
  systemPrompt: string,
  userText: string,
  signal?: AbortSignal,
): Promise<string> {
  try {
    return await dispatch(cfg, systemPrompt, userText, signal)
  } catch (err) {
    if (err instanceof ProviderError) throw err
    if (isAbortError(err)) throw abortedError()
    // Oxirgi himoya: hech qanday xom provayder/fetch xatosi tashqariga chiqmasin.
    throw new ProviderError('network', MSG_UNEXPECTED)
  }
}

async function dispatch(
  cfg: AIConfig,
  systemPrompt: string,
  userText: string,
  signal?: AbortSignal,
): Promise<string> {
  const model = cfg.model?.trim() || providerInfo(cfg.provider).defaultModel

  if (cfg.provider === 'ollama') {
    const data = await requestJSON(
      'http://localhost:11434/api/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userText },
          ],
        }),
      },
      'Ollama',
      signal,
      true,
    )
    const text: unknown = data?.message?.content
    if (typeof text !== 'string' || !text.trim()) {
      throw new ProviderError('parse', 'Ollama bo’sh javob qaytardi. Qaytadan urining.')
    }
    return text
  }

  const apiKey = cfg.apiKey.trim()
  if (!apiKey) throw new ProviderError('auth', MSG_KEY_MISSING)

  if (cfg.provider === 'gemini') {
    // Kalit URL'da emas, header'da — loglarga tushib ketish xavfi yo'q.
    const data = await requestJSON(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userText }] }],
        }),
      },
      'Gemini',
      signal,
    )
    const parts: Array<{ text?: string }> = data?.candidates?.[0]?.content?.parts ?? []
    const text = parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('')
    if (!text.trim()) {
      throw new ProviderError('parse', 'Gemini bo’sh javob qaytardi. Qaytadan urining.')
    }
    return text
  }

  // openai
  const data = await requestJSON(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userText },
        ],
      }),
    },
    'OpenAI',
    signal,
  )
  const text: unknown = data?.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text.trim()) {
    throw new ProviderError('parse', 'OpenAI bo’sh javob qaytardi. Qaytadan urining.')
  }
  return text
}
