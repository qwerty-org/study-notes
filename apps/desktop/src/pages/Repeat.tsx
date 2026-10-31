import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { dueReviews, scheduleReview, touchActiveDay, type QuizItem } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import QuizRunner, { type QuizResult } from '../components/QuizRunner'
import { EmptyState, PageHead, Stat } from '../components/ui'
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconFlame,
  IconRepeat,
} from '../components/icons'

/** Kunlik takrorlash (spaced repetition) — docs/06 §5 */
export default function Repeat() {
  const { library, reviews, setReviews, updateBook, updateProfile, profile } = useApp()
  const [quizOn, setQuizOn] = useState(false)
  const [done, setDone] = useState<QuizResult | null>(null)

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
    const updated = reviews.map((rv) => {
      const d = r.details.find((x) => x.id === rv.reviewId)
      return d ? scheduleReview(rv, d.correct ? 4 : 1) : rv
    })
    setReviews(updated)

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
        <PageHead title="Takrorlash" sub="Unutmaslik uchun" />
        <QuizRunner
          items={dueItems.map((d) => d.item)}
          finishLabel="Takrorlashni yakunlash"
          onFinish={finish}
          onExit={() => setQuizOn(false)}
        />
      </>
    )
  }

  const bookCount = new Set(dueItems.map((d) => d.bookSlug)).size
  const minutes = Math.max(1, Math.ceil(dueItems.length * 0.4))

  return (
    <>
      <PageHead
        title="Takrorlash"
        sub="1-3-7-14-30 kunlik jadval bilan mustahkamlang"
        right={
          <span className={`chip ${dueItems.length ? 'chip-primary' : 'chip-green'}`}>
            {dueItems.length ? `${dueItems.length} ta bugun` : 'bugun bajarildi'}
          </span>
        }
      />

      {done && (
        <div className="card" style={{ borderColor: 'var(--primary)' }}>
          <div className="row-between">
            <div className="row">
              <span
                className="t-icon"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'var(--primary-soft)',
                  color: 'var(--primary-dark)',
                  flexShrink: 0,
                }}
              >
                <IconCheck size={19} strokeWidth={2.4} />
              </span>
              <div>
                <h3>Takrorlash tugadi</h3>
                <small>
                  {done.correct}/{done.total} to'g'ri — jadval yangilandi.
                </small>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setDone(null)}>
              yopish
            </button>
          </div>
        </div>
      )}

      {!dueItems.length ? (
        <EmptyState
          icon={<IconRepeat size={26} />}
          title="Bugun takrorlash yo'q"
          text={
            nextDue
              ? `Keyingi takrorlash: ${nextDue.dueDate} — xotirangiz joyida.`
              : "Tahlil qilingan kitoblar paydo bo'lgach, jadval avtomatik yaratiladi."
          }
          action={
            <Link to="/kutubxona" className="btn btn-primary mt">
              Kutubxonani ko'rish
            </Link>
          }
        />
      ) : (
        <div className="split">
          <div className="stack" style={{ gap: 16 }}>
            <div className="card" style={{ textAlign: 'center', padding: '30px 24px' }}>
              <div className="empty" style={{ padding: '0 0 14px' }}>
                <span className="icon">
                  <IconRepeat size={26} />
                </span>
                <h3>Tayyormisiz?</h3>
                <p>
                  Savolga javob berasiz → sababni ko'rasiz → jadval avtomatik yangilanadi.
                  Noto'g'ri javob — savol tezroq qaytadi.
                </p>
              </div>
              <button className="btn btn-primary btn-lg" style={{ minWidth: 300 }} onClick={() => setQuizOn(true)}>
                {dueItems.length} ta savolni boshlash <IconArrowRight size={18} />
              </button>
            </div>

            <div className="card">
              <div className="card-title">
                <h3>Kutayotgan savollar</h3>
                <span className="chip">{dueItems.length} ta</span>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                {dueItems.slice(0, 8).map(({ item, bookTitle }) => (
                  <div key={item.id} className="book-row" style={{ cursor: 'default' }}>
                    <span className="chip" style={{ flexShrink: 0 }}>
                      {item.type === 'scenario' ? 'Vaziyat' : 'Nazariy'}
                    </span>
                    <span className="b-body">
                      <b style={{ fontSize: 13.5, fontWeight: 700 }}>{item.question.slice(0, 90)}…</b>
                      <small>{bookTitle}</small>
                    </span>
                  </div>
                ))}
                {dueItems.length > 8 && <small>… va yana {dueItems.length - 8} ta</small>}
              </div>
            </div>
          </div>

          <div className="stack" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-title">
                <h3>Bugungi raqamlar</h3>
              </div>
              <div className="grid grid-2">
                <Stat value={dueItems.length} label="savol kutmoqda" />
                <Stat value={bookCount} label="kitob bo'yicha" />
                <Stat value={profile.streak} label="kunlik streak" />
                <Stat value={`${minutes} daq`} label="taxminiy vaqt" />
              </div>
            </div>

            <div className="card">
              <div className="card-title">
                <h3>Eslatma</h3>
              </div>
              <div className="stack" style={{ gap: 10 }}>
                <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                  <span
                    style={{
                      color: 'var(--yellow-dark)',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <IconFlame size={18} />
                  </span>
                  <p className="hint" style={{ marginTop: 0 }}>
                    Streak'ni saqlash uchun kuniga kamida bitta savolga javob bering.
                  </p>
                </div>
                <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 2 }}>
                    <IconClock size={18} />
                  </span>
                  <p className="hint" style={{ marginTop: 0 }}>
                    {nextDue
                      ? `Keyingi takrorlash: ${nextDue.dueDate} — jadval avtomatik rejalashtiriladi.`
                      : 'Jadval savol javoblariga qarab avtomatik rejalashtiriladi.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
