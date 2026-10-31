/**
 * AI provider adapteri — bitta interfeys, bir nechda provayder (docs/03).
 * - gemini  → Google AI Studio (bepul kalit)
 * - openai  → OpenAI API
 * - ollama  → lokal (http://localhost:11434), offline, kalit kerak emas
 *
 * Eslatma: brauzerda to'g'ridan-to'g'ri chaqiruv CORS talab qiladi;
 * Gemini va Ollama CORS'ni qo'llab-quvvatlaydi. Desktop qobig'iga
 * (Tauri/Electron) o'tganda CORS muammosi yo'qoladi.
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

/** System + user prompt bilan bitta chaqiruv → matn */
export async function complete(
  cfg: AIConfig,
  systemPrompt: string,
  userText: string,
  signal?: AbortSignal,
): Promise<string> {
  const model = cfg.model?.trim() || providerInfo(cfg.provider).defaultModel

  if (cfg.provider === 'ollama') {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userText },
        ],
      }),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      throw new Error(
        `Ollama xatosi (${res.status}): ${t || 'O\'rnatilmagan bo\'lishi mumkin — ollama.com'}`,
      )
    }
    const data = await res.json()
    return data.message?.content ?? ''
  }

  if (!cfg.apiKey.trim()) {
    throw new Error('API kalit kiritilmagan — Sozlamalar → AI bo\'limidan qo\'shing.')
  }

  if (cfg.provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cfg.apiKey.trim())}`
    const res = await fetch(url, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userText }] }],
      }),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      throw new Error(`Gemini xatosi (${res.status}): ${t.slice(0, 300)}`)
    }
    const data = await res.json()
    const parts = data.candidates?.[0]?.content?.parts ?? []
    const text = parts.map((p: { text?: string }) => p.text ?? '').join('')
    if (!text) throw new Error('Gemini bo\'sh javob qaytardi.')
    return text
  }

  // openai
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
    }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`OpenAI xatosi (${res.status}): ${t.slice(0, 300)}`)
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('OpenAI bo\'sh javob qaytardi.')
  return text
}
