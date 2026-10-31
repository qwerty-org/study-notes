import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { ProgressBar } from './ui'

const PHASES: Record<string, string> = {
  analyst: "G'oyalar va terminlar",
  quiz: 'Quiz savollari',
  life: 'Hayotdagi vaziyatlar',
}

interface Progress {
  done: number
  total: number
  phase: string
  title: string
}

/**
 * Tahlil yo'qligida: AI orqali bobma-bob tahlil (docs/03 §Tahlil pipeline).
 * Har bob: analyst → quiz-master → life-mentor (agent-rules/).
 */
export default function AnalyzePanel({ book }: { book: BookRecord }) {
  const { ai, reviews, updateBook, setReviews } = useApp()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const needKey = ai.provider !== 'ollama' && !ai.apiKey.trim()

  const run = async () => {
    setRunning(true)
    setError(null)
    setSaved(false)

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
      setSaved(true)
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

  if (saved && !error) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44 }}>✅</div>
        <h2>Tahlil tayyor!</h2>
        <p style={{ color: 'var(--muted)' }}>
          {chaptersCount(book)} bob tahlil qilindi — xulosalar, terminlar, quizlar va hayotdagi
          vaziyatlar endi shu yerda.
        </p>
        <button className="btn btn-primary" onClick={() => setSaved(false)}>
          Xulosalarni ko'rish →
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-title">
        <h2>🤖 Kitobni AI tahlil qiladi</h2>
        <span className="chip">1 marta</span>
      </div>

      <p style={{ color: 'var(--muted)' }}>
        Har bob uchun 3 ta agent ishlaydi ({RULES ? 'agent-rules/' : ''}analyst, quiz-master,
        life-mentor): eng muhim g'oyalar, terminlar, quizlar va "qachon qo'llash" senariylari
        yaratiladi.
      </p>
      <p className="hint">
        🔒 Matn faqat lokal saqlanadi — AI'ga faqat joriy bob yuboriladi. Sozlangan provayder:{' '}
        <b>{ai.provider}</b>.
      </p>

      {needKey && (
        <div className="explain bad mb">
          <b>API kalit kiritilmagan.</b> Tahlil uchun Sozlamalardan AI kalit qo'shing yoki
          Ollama'ni tanlang. <Link to="/sozlamalar">Sozlamalarga o'tish →</Link>
        </div>
      )}

      {error && (
        <div className="explain bad mb">
          <b>Tahlil to'xtadi:</b> {error.slice(0, 400)}
          <br />
          <small>
            Qisman natija saqlandi — qayta urinishda qolgan boblar davom etadi.
          </small>
        </div>
      )}

      {running && progress ? (
        <div className="stack">
          <div className="phase-line">
            <span className="spinner" />
            Bob {progress.done + 1}/{progress.total} — «{progress.title}»: {PHASES[progress.phase]}
          </div>
          <ProgressBar value={(progress.done / Math.max(1, progress.total)) * 100} />
          <small>Bir bob 20-60 soniya olishi mumkin — sekinchalab kutamiz.</small>
        </div>
      ) : (
        <div className="row mt wrap">
          <button className="btn btn-primary" onClick={run} disabled={needKey}>
            {error ? '🔄 Qayta urinish' : '⚡ Tahlil qilish'}
          </button>
          {needKey && (
            <Link to="/sozlamalar" className="btn">
              Avval AI ni ulash
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function addDays(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)
}

function chaptersCount(book: BookRecord): number {
  return book.meta.chapters || splitChapters(book.content).length
}
