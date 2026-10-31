import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { dueReviews, scheduleReview, touchActiveDay, type QuizItem } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import QuizRunner, { type QuizResult } from '../components/QuizRunner'
import { EmptyState, PageHead, Stat } from '../components/ui'

/** Kunlik takrorlash (spaced repetition) — docs/06 §5 */
export default function Repeat() {
  const { library, reviews, setReviews, updateBook, updateProfile, profile } = useApp()
  const [quizOn, setQuizOn] = useState(false)
  const [done, setDone] = useState<QuizResult | null>(null)

  // Kitoblar bo'yicha quiz xaritasi
  const quizMap = useMemo(() => {
    const m = new Map<string, { item: QuizItem; bookSlug: string; bookTitle: string }>()
    for (const b of library) {
      for (const q of b.analysis?.quizzes ?? []) {
        m.set(q.id, { item: q, bookSlug: b.meta.slug, bookTitle: b.meta.title })
      }
    }
    return m
  }, [library])

  const due = dueReviews(reviews)
  const dueItems = due
    .map((r) => quizMap.get(r.reviewId))
    .filter((x): x is { item: QuizItem; bookSlug: string; bookTitle: string } => Boolean(x))

  const nextDue = reviews
    .filter((r) => r.dueDate > new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]

  const finish = (r: QuizResult) => {
    // Jadvalni yangilash
    const updated = reviews.map((rv) => {
      const d = r.details.find((x) => x.id === rv.reviewId)
      return d ? scheduleReview(rv, d.correct ? 4 : 1) : rv
    })
    setReviews(updated)

    // Kitoblar progressiga qo'shish
    for (const d of r.details) {
      const found = quizMap.get(d.id)
      if (!found) continue
      updateBook(found.bookSlug, (b) => ({
        ...b,
        progress: {
          ...b.progress,
          quizCorrect: b.progress.quizCorrect + (d.correct ? 1 : 0),
          quizTotal: b.progress.quizTotal + 1,
        },
      }))
    }

    updateProfile(touchActiveDay(profile))
    setDone(r)
    setQuizOn(false)
  }

  if (quizOn && dueItems.length) {
    return (
      <>
        <PageHead title="🔁 Takrorlash" sub="Unutmaslik uchun" />
        <QuizRunner
          items={dueItems.map((d) => d.item)}
          finishLabel="Takrorlashni yakunlash"
          onFinish={finish}
          onExit={() => setQuizOn(false)}
        />
      </>
    )
  }

  return (
    <>
      <PageHead
        title="🔁 Takrorlash"
        sub="1-3-7-14-30 kunlik jadval — bilimni mustahkamlaydi"
        right={<span className="chip chip-primary">{dueItems.length} ta bugun</span>}
      />

      {done && (
        <div className="card mb" style={{ borderColor: 'var(--green)' }}>
          <div className="row-between">
            <div>
              <h3 style={{ margin: 0 }}>🎉 Takrorlash tugadi!</h3>
              <small>
                {done.correct}/{done.total} to'g'ri — keyingi takrorlash jadvalga qo'shildi.
              </small>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setDone(null)}>
              yopish ✕
            </button>
          </div>
        </div>
      )}

      {!dueItems.length ? (
        <EmptyState
          icon="🌤️"
          title="Bugun takrorlash yo'q"
          text={
            nextDue
              ? `Keyingi takrorlash: ${nextDue.dueDate} — xotirangiz joyida.`
              : "Tahlil qilingan kitoblar paydo bo'lgach, takrorlash jadvali avtomatik yaratiladi."
          }
          action={
            <Link to="/kutubxona" className="btn btn-primary mt">
              Kutubxonani ko'rish
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-4 mb">
            <Stat icon="🎯" value={dueItems.length} label="savol kutmoqda" />
            <Stat icon="📚" value={new Set(dueItems.map((d) => d.bookSlug)).size} label="kitob bo'yicha" />
            <Stat icon="🔥" value={profile.streak} label="kunlik streak" />
            <Stat icon="⏱️" value={`${Math.max(1, Math.ceil(dueItems.length * 0.4))} daq`} label="taxminiy vaqt" />
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '34px 20px' }}>
            <div style={{ fontSize: 44 }}>🧠</div>
            <h2>Tayyormisiz?</h2>
            <p style={{ color: 'var(--muted)' }}>
              Savolga javob berasiz → sababni ko'rasiz → jadval avtomatik yangilanadi.
              Noto'g'ri javob — savol tezroq qaytadi, to'g'ri javob — keyinroq.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setQuizOn(true)}>
              ▶ {dueItems.length} ta savolni boshlash
            </button>
          </div>

          <div className="card mt">
            <h3>📋 Kutayotgan savollar</h3>
            <div className="stack">
              {dueItems.slice(0, 6).map(({ item, bookTitle }) => (
                <div key={item.id} className="row" style={{ fontSize: 14 }}>
                  <span>{item.type === 'scenario' ? '📍' : '📝'}</span>
                  <span className="grow">{item.question.slice(0, 90)}…</span>
                  <span className="chip">{bookTitle.slice(0, 22)}</span>
                </div>
              ))}
              {dueItems.length > 6 && (
                <small>… va yana {dueItems.length - 6} ta</small>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
