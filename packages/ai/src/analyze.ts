/**
 * Bob tahlili pipeline (docs/03 §Tahlil, docs/05).
 * Har bob uchun 3 ta agent chaqiruvi: analyst → quiz-master → life-mentor.
 * Har biri agent-rules/*.md (system prompt) + schemas/*.json (format) bilan.
 */
import type {
  AIConfig,
  ApplyScenario,
  Chapter,
  ChapterAnalysis,
  KeyIdea,
  QuizItem,
  Term,
} from '@study-notes/core'
import { complete } from './providers'
import { extractJSON, withJSONRetry } from './json'

/** Bir chaqiruvdagi matn hajmi chegaralari (uzun bob → limitdan oshib ketmasin). */
const MAX_CHAPTER_CHARS = 12_000
const MAX_IDEAS_IN_PROMPT = 24
/** Vaqtinchalik xatolarda jami urinishlar soni (1 ta boshlang'ich + qayta urinishlar). */
const MAX_TRANSPORT_ATTEMPTS = 3
const RETRY_BASE_MS = 300

export interface AgentRules {
  analyst: string
  quizMaster: string
  lifeMentor: string
}

/** Tahlil jarayoni haqida xabar (boblar soni — tugallanganlar / jami). */
export interface AnalyzeProgress {
  /** Hozirgacha tugallangan boblar soni (0 dan `total` gacha). */
  chapter: number
  /** Jami boblar soni. */
  total: number
  phase: 'analyst' | 'quiz' | 'life'
  title: string
}

interface AnalystOut {
  keyIdeas?: KeyIdea[]
  terms?: Term[]
}
interface QuizOut {
  items?: QuizItem[]
}
interface LifeOut {
  scenarios?: ApplyScenario[]
}

/** Prompt uchun matnni xavfsiz hajmga tushiradi (tahlil natijasiga ta'sir qilmaydi). */
function boundText(text: string, limit: number): string {
  if (text.length <= limit) return text
  return `${text.slice(0, limit)}\n… [${text.length - limit} belgi qisqartirildi]`
}

/** Faqat vaqtinchalik xatolar qayta urinishga arziydi (tarmoq, 408/429, 5xx). */
function isTransientError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as {
    name?: string
    message?: string
    status?: number
    code?: number | string
    retryable?: boolean
  }
  if (e.name === 'AbortError') return false
  if (e.retryable === true) return true
  if (typeof e.code === 'string' && /^(ECONN|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|UND_ERR)/i.test(e.code)) {
    return true
  }
  const status = e.status ?? (typeof e.code === 'number' ? e.code : undefined)
  if (typeof status === 'number') {
    return status === 408 || status === 429 || status >= 500
  }
  const msg = e.message ?? ''
  if (
    /failed to fetch|networkerror|network error|fetch failed|load failed|timeout|timed out|socket|econn|enotfound/i.test(
      msg,
    )
  ) {
    return true
  }
  const http = msg.match(/\((\d{3})\)/) ?? msg.match(/\b(\d{3})\b/)
  if (http) {
    const code = Number(http[1])
    return code === 408 || code === 429 || code >= 500
  }
  return false
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Vaqtinchalik xatolarda eksponensial backoff bilan qayta urinish. */
async function completeWithRetry(
  cfg: AIConfig,
  system: string,
  user: string,
): Promise<string> {
  let lastError: unknown
  for (let attempt = 0; attempt < MAX_TRANSPORT_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await wait(RETRY_BASE_MS * attempt + Math.floor(Math.random() * 120))
    }
    try {
      return await complete(cfg, system, user)
    } catch (err) {
      lastError = err
      if (!isTransientError(err)) throw err
    }
  }
  throw lastError
}

/** JSON talab qiladigan agent chaqiruvi (JSON xatosida 1 marta qayta so'raydi). */
async function agent<T>(
  cfg: AIConfig,
  system: string,
  user: string,
  parse: (raw: string) => T,
): Promise<T> {
  return withJSONRetry(
    async (feedback) =>
      completeWithRetry(
        cfg,
        feedback ? `${system}\n\nMUHIM OGohlantirish: ${feedback}` : system,
        user,
      ),
    parse,
  )
}

export async function analyzeChapter(
  cfg: AIConfig,
  rules: AgentRules,
  schemas: { analyst: string; quiz: string; life: string },
  chapter: Chapter,
  onPhase?: (phase: AnalyzeProgress['phase']) => void,
): Promise<{
  analysis: ChapterAnalysis
  quizzes: QuizItem[]
  scenarios: ApplyScenario[]
}> {
  const user = `BOB ${chapter.index + 1}: ${chapter.title}\n\n---\n\n${boundText(chapter.content, MAX_CHAPTER_CHARS)}`

  // 1. Tahlilchi
  onPhase?.('analyst')
  const analyst = await agent<AnalystOut>(
    cfg,
    `${rules.analyst}\n\nJSON SXEMASI (shunga mos kelishi shart):\n${schemas.analyst}`,
    user,
    extractJSON<AnalystOut>,
  )
  const keyIdeas = (analyst.keyIdeas ?? []).map((i, idx) => ({
    ...i,
    id: i.id || `ch${chapter.index + 1}-i${idx + 1}`,
  }))
  const terms: Term[] = analyst.terms ?? []
  // Keyingi agentlarga faqat kerakli miqdordagi g'oyalar yuboriladi.
  const quizIdeas = keyIdeas
    .slice(0, MAX_IDEAS_IN_PROMPT)
    .map((k) => ({ id: k.id, idea: k.idea }))
  const lifeIdeas = keyIdeas
    .slice(0, MAX_IDEAS_IN_PROMPT)
    .map((k) => ({ id: k.id, idea: k.idea, howToApply: k.howToApply }))

  // 2. Quiz mutaxassisi
  onPhase?.('quiz')
  const quizOut = await agent<QuizOut>(
    cfg,
    `${rules.quizMaster}\n\nJSON SXEMASI (shunga mos kelishi shart):\n${schemas.quiz}\n\nG'oyalar (shular asosida savol tuz):\n${JSON.stringify(
      quizIdeas,
    )}`,
    user,
    extractJSON<QuizOut>,
  )
  const quizzes = (quizOut.items ?? []).map((q, idx) => ({
    ...q,
    id: q.id || `ch${chapter.index + 1}-q${idx + 1}`,
    chapter: chapter.index,
  }))

  // 3. Hayotga tatbiq
  onPhase?.('life')
  const lifeOut = await agent<LifeOut>(
    cfg,
    `${rules.lifeMentor}\n\nJSON SXEMASI (shunga mos kelishi shart):\n${schemas.life}\n\nG'oyalar (shular uchun senariy yoz):\n${JSON.stringify(
      lifeIdeas,
    )}`,
    user,
    extractJSON<LifeOut>,
  )
  const scenarios = (lifeOut.scenarios ?? []).map((s, idx) => ({
    ...s,
    id: s.id || `ch${chapter.index + 1}-a${idx + 1}`,
  }))

  return {
    analysis: { index: chapter.index, title: chapter.title, keyIdeas, terms },
    quizzes,
    scenarios,
  }
}

/** `analyzeChapters` natijasi: muvaffaqiyatli boblar + xatoliklar ro'yxati. */
export interface AnalyzeBatchResult {
  chapters: ChapterAnalysis[]
  quizzes: QuizItem[]
  scenarios: ApplyScenario[]
  /** Tahlil qilinmagan boblar (bob indeksi va xato matni). */
  failures: Array<{ index: number; error: string }>
}

/**
 * Bobma-bob tahlil (additiv API): bitta bob xatosi qolgan natijalarni yo'q qilmaydi.
 * `onProgress.chapter` — tugallangan boblar soni, `total` — jami boblar soni.
 */
export async function analyzeChapters(
  cfg: AIConfig,
  rules: AgentRules,
  schemas: { analyst: string; quiz: string; life: string },
  chapters: Chapter[],
  onProgress?: (progress: AnalyzeProgress) => void,
): Promise<AnalyzeBatchResult> {
  const result: AnalyzeBatchResult = {
    chapters: [],
    quizzes: [],
    scenarios: [],
    failures: [],
  }
  const total = chapters.length

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i]
    try {
      const res = await analyzeChapter(cfg, rules, schemas, chapter, (phase) =>
        onProgress?.({ chapter: i, total, phase, title: chapter.title }),
      )
      result.chapters.push(res.analysis)
      result.quizzes.push(...res.quizzes)
      result.scenarios.push(...res.scenarios)
    } catch (err) {
      // Xatoli bob o'tkazib yuboriladi; oldingi va keyingi boblar saqlanadi.
      result.failures.push({
        index: chapter.index,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  if (total > 0) {
    onProgress?.({
      chapter: total,
      total,
      phase: 'life',
      title: chapters[total - 1].title,
    })
  }

  return result
}
