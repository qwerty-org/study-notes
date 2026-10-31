import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { scheduleReview, touchActiveDay, type QuizItem } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import AnalyzePanel from '../components/AnalyzePanel'
import QuizRunner, { type QuizResult } from '../components/QuizRunner'
import { ApplyTab, IdeasTab, ReadTab, TermsTab, TutorTab } from '../components/BookTabs'
import { EmptyState } from '../components/ui'

type TabKey = 'read' | 'ideas' | 'terms' | 'quiz' | 'apply' | 'tutor'

const TABS: [TabKey, string][] = [
  ['read', "📄 O'qish"],
  ['ideas', '💡 Xulosalar'],
  ['terms', '📖 Terminlar'],
  ['quiz', '🎯 Quiz'],
  ['apply', '🌍 Hayotda qo\'llash'],
  ['tutor', '🤖 AI ustoz'],
]

export default function Book() {
  const { slug } = useParams()
  const { library, updateBook, reviews, setReviews, updateProfile, profile } = useApp()
  const [sp, setSp] = useSearchParams()
  const [quizOn, setQuizOn] = useState(false)
  const [lastResult, setLastResult] = useState<QuizResult | null>(null)

  const book = library.find((b) => b.meta.slug === slug)

  if (!book) {
    return (
      <EmptyState
        icon="🔍"
        title="Kitob topilmadi"
        action={
          <Link to="/kutubxona" className="btn btn-primary mt">
            ← Kutubxonaga qaytish
          </Link>
        }
      />
    )
  }

  const rawTab = sp.get('tab') as TabKey | null
  const tab: TabKey = rawTab && TABS.some(([k]) => k === rawTab) ? rawTab : 'read'
  const setTab = (k: TabKey) => {
    const next = new URLSearchParams(sp)
    next.set('tab', k)
    setSp(next, { replace: true })
    setQuizOn(false)
  }

  const quizzes = book.analysis?.quizzes ?? []
  const accuracy =
    book.progress.quizTotal > 0
      ? Math.round((book.progress.quizCorrect / book.progress.quizTotal) * 100)
      : null

  const finishQuiz = (r: QuizResult) => {
    // 1) Kitob progressi
    updateBook(book.meta.slug, (b) => ({
      ...b,
      progress: {
        ...b.progress,
        quizCorrect: b.progress.quizCorrect + r.correct,
        quizTotal: b.progress.quizTotal + r.total,
      },
    }))
    // 2) Takrorlash jadvalini yangilash (to'g'ri → uzaytirish, xato → qisqartirish)
    const byId = new Map(reviews.map((x) => [x.reviewId, x]))
    const updated = reviews.map((rv) => {
      const d = r.details.find((x) => x.id === rv.reviewId)
      return d ? scheduleReview(rv, d.correct ? 4 : 1) : rv
    })
    if (updated.some((x, i) => x !== reviews[i])) setReviews(updated)
    // 3) Streak
    updateProfile(touchActiveDay(profile))
    setLastResult(r)
    setQuizOn(false)
  }

  return (
    <>
      {/* Sarlavha */}
      <div className="page-head">
        <div>
          <Link to="/kutubxona" className="hint">
            ← Kutubxona
          </Link>
          <h1>
            {book.meta.title}{' '}
            {book.progress.percent >= 100 ? '📗' : book.analysis ? '📕' : '📘'}
          </h1>
          <small>
            {book.meta.author ? `${book.meta.author} · ` : ''}
            {book.meta.chapters} ta bob · {book.progress.percent}% o'qilgan
          </small>
        </div>
        <span className={`chip ${book.analysis ? 'chip-green' : 'chip-amber'}`}>
          {book.analysis
            ? `✅ tahlil tayyor (${quizzes.length} ta quiz)`
            : book.meta.status === 'partial'
              ? '⚠️ tahlil qisman'
              : '🤖 AI tahlili kutilmoqda'}
        </span>
      </div>

      {/* Tahlil yo'q — AI panel */}
      {!book.analysis && <div className="mb"><AnalyzePanel book={book} /></div>}

      {/* Tablar */}
      <div className="tabs">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            className={`tab${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------- O'qish ---------- */}
      {tab === 'read' && <ReadTab book={book} />}

      {/* ---------- Xulosalar ---------- */}
      {tab === 'ideas' &&
        (book.analysis ? (
          <IdeasTab book={book} />
        ) : (
          <EmptyState icon="💡" title="Xulosalar tahlildan keyin paydo bo'ladi" text="Yuqoridagi «Tahlil qilish» tugmasini bosing." />
        ))}

      {/* ---------- Terminlar ---------- */}
      {tab === 'terms' &&
        (book.analysis ? <TermsTab book={book} /> : <EmptyState icon="📖" title="Terminlar tahlildan keyin paydo bo'ladi" />)}

      {/* ---------- Quiz ---------- */}
      {tab === 'quiz' &&
        (!book.analysis ? (
          <EmptyState icon="🎯" title="Quiz tahlildan keyin yaratiladi" text="AI har bobga vaziyatli va nazariy savollar tuzadi." />
        ) : quizOn ? (
          <QuizRunner
            items={quizzes}
            title={book.meta.title}
            finishLabel="Natijani saqlash"
            onFinish={finishQuiz}
            onExit={() => setQuizOn(false)}
          />
        ) : (
          <div className="card">
            <div className="card-title">
              <h2>🎯 Quiz</h2>
              <span className="chip chip-primary">{quizzes.length} ta savol</span>
            </div>
            <div className="grid grid-3 mb">
              <div className="stat">
                <b>{quizzes.filter((q) => q.type === 'scenario').length}</b>
                <span>vaziyatli savol</span>
              </div>
              <div className="stat">
                <b>{quizzes.filter((q) => q.type === 'theory').length}</b>
                <span>nazariy savol</span>
              </div>
              <div className="stat">
                <b>{accuracy !== null ? `${accuracy}%` : '—'}</b>
                <span>sizning o'rtachangiz</span>
              </div>
            </div>
            {lastResult && (
              <div className="explain ok mb">
                <b>Oxirgi natija:</b> {lastResult.correct}/{lastResult.total} to'g'ri javob.
              </div>
            )}
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Har savoldan keyin sabab ko'rsatiladi — shu orqali o'rganasiz. Javoblar takrorlash
              jadvalini avtomatik yangilaydi.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setQuizOn(true)}>
              ▶ Boshlash
            </button>
          </div>
        ))}

      {/* ---------- Hayotda qo'llash ---------- */}
      {tab === 'apply' &&
        (book.analysis ? <ApplyTab book={book} /> : <EmptyState icon="🌍" title="Senariylar tahlildan keyin paydo bo'ladi" />)}

      {/* ---------- AI ustoz ---------- */}
      {tab === 'tutor' && <TutorTab book={book} />}
    </>
  )
}
