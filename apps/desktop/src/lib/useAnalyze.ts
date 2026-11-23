import { useEffect, useRef, useState } from 'react'
import {
  addLocalDays,
  localDay,
  newReview,
  splitChapters,
  type BookAnalysis,
  type BookRecord,
  type Review,
} from '@study-notes/core'
import { analyzeChapter } from '@study-notes/ai'
import { RULES, RULES_VERSION, SCHEMAS } from '../rules'
import { useApp } from '../store/AppStore'

export interface AnalyzeProgress {
  done: number
  total: number
  phase: string
  title: string
}

export const PHASES: Record<string, string> = {
  analyst: "G'oyalar va terminlar",
  quiz: 'Quiz savollari',
  life: 'Hayotdagi vaziyatlar',
}

/**
 * Provayder xabarlarini foydalanuvchiga tushunarli shaklga keltiradi.
 * Xom API matnlari (status kodlari, JSON xatolari) ekranga chiqmaydi.
 */
function analyzeErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  const m = raw.toLowerCase()

  if (m.includes('kalit') || m.includes('api') || m.includes('401') || m.includes('403')) {
    return 'AI kaliti sozlanmagan yoki yaroqsiz. Sozlamalarga o‘tib, ulanishni tekshiring.'
  }
  if (m.includes('429') || m.includes('rate limit') || m.includes('band')) {
    return 'AI xizmati hozir band. Biroz kutib, qayta urinib ko‘ring.'
  }
  if (m.includes('ollama')) {
    return 'Ollama javob bermadi. U o‘rnatilgani va ishlab turganini tekshiring yoki boshqa provayder tanlang.'
  }
  if (m.includes('json') || m.includes('javob') || m.includes('unexpected token')) {
    return 'AI javobini tushunib bo‘lmadi. Qayta urinib ko‘ring — bu vaqtinchalik xato.'
  }
  if (
    m.includes('fetch') ||
    m.includes('network') ||
    m.includes('timeout') ||
    m.includes('500') ||
    m.includes('502') ||
    m.includes('503') ||
    m.includes('504')
  ) {
    return 'Tahlil vaqtincha to‘xtadi. Internet ulanishini tekshirib, qayta urinib ko‘ring.'
  }
  return 'Tahlil vaqtincha to‘xtadi. Qayta urinishda tugallanmagan boblar davom etadi.'
}

/**
 * Bobma-bob AI tahlil (docs/03 §Tahlil pipeline).
 * Har bob: analyst → quiz-master → life-mentor (agent-rules/).
 * Natija to'g'ridan-to'g'ri kitobga yoziladi.
 */
export function useAnalyze(book: BookRecord | undefined) {
  const { ai, reviews, updateBook, setReviews } = useApp()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<AnalyzeProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Komponent o'chirilganda yoki boshqa tahlil boshlanganda eski natijalar yozilmaydi
  const mountedRef = useRef(true)
  const runIdRef = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      runIdRef.current += 1
    }
  }, [])

  const needKey = ai.provider !== 'ollama' && !ai.apiKey.trim()

  const run = async () => {
    if (!book || running || !mountedRef.current) return

    const runId = ++runIdRef.current
    const active = () => mountedRef.current && runIdRef.current === runId
    const setSafeProgress = (value: AnalyzeProgress) => {
      if (active()) setProgress(value)
    }
    const finish = () => {
      if (active()) {
        setRunning(false)
        setProgress(null)
      }
    }

    setRunning(true)
    setError(null)

    const chapters = splitChapters(book.content)
    const chAnalyses: BookAnalysis['chapters'] = []
    const quizzes: BookAnalysis['quizzes'] = []
    const scenarios: BookAnalysis['scenarios'] = []

    if (!chapters.length) {
      if (active()) setError('Kitobda tahlil qilinadigan matn topilmadi. Avval matn qo‘shing.')
      finish()
      return
    }

    const savePartial = (status: 'analyzed' | 'partial') => {
      if (!chAnalyses.length || !active()) return
      const analysis: BookAnalysis = {
        book: book.meta.slug,
        rulesVersion: RULES_VERSION,
        analyzedAt: new Date().toISOString(),
        chapters: chAnalyses,
        quizzes,
        scenarios,
      }
      updateBook(book.meta.slug, (b) => ({
        ...b,
        analysis,
        meta: {
          ...b.meta,
          status,
          chapters: chapters.length,
          rulesVersion: analysis.rulesVersion,
        },
      }))
      const existing = new Set(reviews.map((r) => r.reviewId))
      const fresh: Review[] = quizzes
        .filter((q) => !existing.has(q.id))
        .map((q, i) => ({
          ...newReview(q.id, book.meta.slug, 'quiz'),
          dueDate: addDays(Math.floor(i / 5)),
        }))
      if (fresh.length) setReviews([...reviews, ...fresh])
    }

    try {
      for (let i = 0; i < chapters.length; i++) {
        if (!active()) return
        const ch = chapters[i]
        setSafeProgress({ done: i, total: chapters.length, phase: 'analyst', title: ch.title })
        const res = await analyzeChapter(ai, RULES, SCHEMAS, ch, (phase) =>
          setSafeProgress({ done: i, total: chapters.length, phase, title: ch.title }),
        )
        if (!active()) return
        chAnalyses.push(res.analysis)
        quizzes.push(...res.quizzes)
        scenarios.push(...res.scenarios)
      }
      savePartial('analyzed')
    } catch (e) {
      if (!active()) return
      savePartial('partial')
      setError(analyzeErrorMessage(e))
    } finally {
      finish()
    }
  }

  return { running, progress, error, needKey, run }
}

function addDays(days: number): string {
  return localDay(addLocalDays(days))
}
