import { useState } from 'react'
import {
  newReview,
  splitChapters,
  type BookAnalysis,
  type BookRecord,
  type Review,
} from '@study-notes/core'
import { analyzeChapter } from '@study-notes/ai'
import { RULES, SCHEMAS } from '../rules'
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
 * Bobma-bob AI tahlil (docs/03 §Tahlil pipeline).
 * Har bob: analyst → quiz-master → life-mentor (agent-rules/).
 * Natija to'g'ridan-to'g'ri kitobga yoziladi.
 */
export function useAnalyze(book: BookRecord | undefined) {
  const { ai, reviews, updateBook, setReviews } = useApp()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<AnalyzeProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const needKey = ai.provider !== 'ollama' && !ai.apiKey.trim()

  const run = async () => {
    if (!book || running) return
    setRunning(true)
    setError(null)

    const chapters = splitChapters(book.content)
    const chAnalyses: BookAnalysis['chapters'] = []
    const quizzes: BookAnalysis['quizzes'] = []
    const scenarios: BookAnalysis['scenarios'] = []

    const savePartial = (status: 'analyzed' | 'partial') => {
      if (!chAnalyses.length) return
      const analysis: BookAnalysis = {
        book: book.meta.slug,
        rulesVersion: 'rules-2026-10-31',
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
        const ch = chapters[i]
        setProgress({ done: i, total: chapters.length, phase: 'analyst', title: ch.title })
        const res = await analyzeChapter(ai, RULES, SCHEMAS, ch, (phase) =>
          setProgress({ done: i, total: chapters.length, phase, title: ch.title }),
        )
        chAnalyses.push(res.analysis)
        quizzes.push(...res.quizzes)
        scenarios.push(...res.scenarios)
      }
      savePartial('analyzed')
    } catch (e) {
      savePartial('partial')
      setError((e as Error).message)
    } finally {
      setRunning(false)
      setProgress(null)
    }
  }

  return { running, progress, error, needKey, run }
}

function addDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
}
