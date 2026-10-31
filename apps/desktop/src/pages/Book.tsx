import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { scheduleReview, touchActiveDay, type QuizItem } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import AnalyzePanel from '../components/AnalyzePanel'
import QuizRunner, { type QuizResult } from '../components/QuizRunner'
import { ApplyTab, IdeasTab, ReadTab, TermsTab, TutorTab } from '../components/BookTabs'
import { Cover, EmptyState } from '../components/ui'
import { IconChevronLeft, IconLibrary, IconTarget } from '../components/icons'

type TabKey = 'read' | 'ideas' | 'terms' | 'quiz' | 'apply' | 'tutor'

const TABS: [TabKey, string][] = [
  ['read', "O'qish"],
  ['ideas', 'Xulosalar'],
  ['terms', 'Terminlar'],
  ['quiz', 'Quiz'],
  ['apply', "Hayotda qo'llash"],
  ['tutor', 'AI ustoz'],
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
        icon={<IconLibrary size={26} />}
        title="Kitob topilmadi"
        action={
          <Link to="/kutubxona" className="btn btn-primary mt">
            Kutubxonaga qaytish
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
    updateBook(book.meta.slug, (b) => ({
      ...b,
      progress: {
        ...b.progress,
        quizCorrect: b.progress.quizCorrect + r.correct,
        quizTotal: b.progress.quizTotal + r.total,
      },
    }))
    const updated = reviews.map((rv) => {
      const d = r.details.find((x) => x.id === rv.reviewId)
      return d ? scheduleReview(rv, d.correct ? 4 : 1) : rv
    })
    if (updated.some((x, i) => x !== reviews[i])) setReviews(updated)
    updateProfile(touchActiveDay(profile))
    setLastResult(r)
    setQuizOn(false)
  }

  return (
    <>
      <div className="page-head">
        <div className="grow" style={{ minWidth: 0 }}>
          <Link to="/kutubxona" className="page-back">
            <IconChevronLeft size={15} /> Kutubxona
          </Link>
          <div className="row" style={{ alignItems: 'flex-start', gap: 12 }}>
            <Cover title={book.meta.title} variant="sm" />
            <div className="grow" style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: 21 }}>{book.meta.title}</h1>
              <small>
                {book.meta.author ? `${book.meta.author} · ` : ''}
                {book.meta.chapters} ta bob · {book.progress.percent}% o'qilgan
              </small>
            </div>
          </div>
        </div>
      </div>

      <span
        className={`chip ${book.analysis ? 'chip-green' : 'chip-amber'}`}
        style={{ alignSelf: 'flex-start' }}
      >
        {book.analysis
          ? `tahlil tayyor · ${quizzes.length} ta quiz`
          : book.meta.status === 'partial'
            ? 'tahlil qisman'
            : 'AI tahlili kutilmoqda'}
      </span>

      {!book.analysis && <AnalyzePanel book={book} />}

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

      {tab === 'read' && <ReadTab book={book} />}

      {tab === 'ideas' &&
        (book.analysis ? (
          <IdeasTab book={book} />
        ) : (
          <EmptyState
            icon={<IconTarget size={26} />}
            title="Xulosalar tahlildan keyin paydo bo'ladi"
            text="«AI tahlil qilish» tugmasini bosing."
          />
        ))}

      {tab === 'terms' &&
        (book.analysis ? (
          <TermsTab book={book} />
        ) : (
          <EmptyState icon={<IconTarget size={26} />} title="Terminlar tahlildan keyin yaratiladi" />
        ))}

      {tab === 'quiz' &&
        (!book.analysis ? (
          <EmptyState
            icon={<IconTarget size={26} />}
            title="Quiz tahlildan keyin yaratiladi"
            text="AI har bobga vaziyatli va nazariy savollar tuzadi."
          />
        ) : quizOn ? (
          <QuizRunner
            items={quizzes}
            title={book.meta.title}
            finishLabel="Natijani saqlash"
            onFinish={finishQuiz}
            onExit={() => setQuizOn(false)}
          />
        ) : (
          <div className="card narrow">
            <div className="card-title">
              <h2>Quiz</h2>
              <span className="chip chip-primary">{quizzes.length} ta savol</span>
            </div>
            <div className="grid grid-3 mb">
              <div className="stat">
                <b>{quizzes.filter((q) => q.type === 'scenario').length}</b>
                <span>vaziyatli</span>
              </div>
              <div className="stat">
                <b>{quizzes.filter((q) => q.type === 'theory').length}</b>
                <span>nazariy</span>
              </div>
              <div className="stat">
                <b>{accuracy !== null ? `${accuracy}%` : '—'}</b>
                <span>sizning o'rtacha</span>
              </div>
            </div>
            {lastResult && (
              <div className="explain ok mb">
                <b>Oxirgi natija:</b> {lastResult.correct}/{lastResult.total} to'g'ri javob.
              </div>
            )}
            <p className="hint" style={{ marginTop: 0 }}>
              Har savoldan keyin sabab ko'rsatiladi. Javoblar takrorlash jadvalini avtomatik
              yangilaydi.
            </p>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => setQuizOn(true)}>
              Boshlash
            </button>
          </div>
        ))}

      {tab === 'apply' &&
        (book.analysis ? (
          <ApplyTab book={book} />
        ) : (
          <EmptyState
            icon={<IconTarget size={26} />}
            title="Senariylar tahlildan keyin paydo bo'ladi"
          />
        ))}

      {tab === 'tutor' && <TutorTab book={book} />}
    </>
  )
}
