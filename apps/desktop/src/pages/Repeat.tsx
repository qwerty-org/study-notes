import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { dueReviews, scheduleReview, touchActiveDay, type QuizItem } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import QuizRunner, { type QuizResult } from '../components/nx/QuizRunner'
import { Bar, Empty, Ring, useToast } from '../components/nx/NxUI'
import { localDay, niceDate } from '../lib/nxDate'
import {
  IconArrowRight,
  IconBookOpen,
  IconCheck,
  IconClock,
  IconFlame,
  IconRepeat,
} from '../components/icons'
import { IconCalendar, IconKeyboard } from '../components/nx/icons'

interface DueEntry {
  item: QuizItem
  bookSlug: string
  bookTitle: string
  dueDate: string
}

export default function Repeat() {
  const { library, reviews, setReviews, updateBook, updateProfile, profile } = useApp()
  const [quizOn, setQuizOn] = useState(false)
  const [done, setDone] = useState<QuizResult | null>(null)
  const [showAll, setShowAll] = useState(false)
  const { show, toast: toastNode } = useToast()

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
  const dueItems: DueEntry[] = due
    .map((r) => {
      const found = quizMap.get(r.reviewId)
      return found ? { ...found, dueDate: r.dueDate } : null
    })
    .filter((x): x is DueEntry => Boolean(x))

  const conceptLabels: Record<string, string> = {}
  for (const b of library) {
    for (const ch of b.analysis?.chapters ?? []) {
      for (const idea of ch.keyIdeas) conceptLabels[idea.id] = idea.idea
    }
  }

  // Faqat kutubxonadagi savollar bilan bog'langan yozuvlarni hisoblaymiz —
  // aks holda "keyingi takrorlash" mavjud bo'lmagan savolga ishora qiladi.
  const tracked = reviews.filter((r) => quizMap.has(r.reviewId))
  const totalCount = tracked.length
  const nextDue = tracked
    .filter((r) => r.dueDate > localDay())
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
    show(`${r.correct}/${r.total} to'g'ri · javoblar saqlandi`)
  }

  if (quizOn && dueItems.length) {
    return (
      <QuizRunner
        items={dueItems.map((d) => d.item)}
        conceptLabels={conceptLabels}
        finishLabel="Natijani saqlash"
        onFinish={finish}
        onExit={() => setQuizOn(false)}
      />
    )
  }

  const bookCount = new Set(dueItems.map((d) => d.bookSlug)).size
  const minutes = Math.max(1, Math.ceil(dueItems.length * 0.4))
  const shown = showAll ? dueItems : dueItems.slice(0, 5)

  return (
    <div className="nx-page nx-repeat">
      <header className="nx-head">
        <div>
          <span className="nx-eyebrow">Kunlik odat</span>
          <h1 className="nx-title">Takrorlash</h1>
          <p className="nx-subtitle">
            Savolga javob bering, sababini ko'ring — keyingi takrorlash vaqti avtomatik hisoblanadi.
          </p>
        </div>
      </header>

      {done && (
        <div className="nx-repeat-result" role="status">
          <span className="nx-repeat-result__icon"><IconCheck size={20} /></span>
          <div className="nx-repeat-result__body">
            <b>Takrorlash tugadi</b>
            <p>
              {done.correct}/{done.total} to'g'ri javob · javoblaringiz saqlandi.
              {nextDue ? ` Keyingi takrorlash: ${niceDate(nextDue.dueDate)}.` : ''}
            </p>
          </div>
          <Link to="/natijalar" className="nx-btn nx-btn--ghost nx-btn--sm">Natijalarim</Link>
          <button className="nx-icon-btn" onClick={() => setDone(null)} aria-label="Xabarni yopish">×</button>
        </div>
      )}

      {!dueItems.length ? (
        <Empty
          icon={<IconRepeat size={24} />}
          title="Bugun takrorlash yo'q"
          text={
            nextDue
              ? `Keyingi takrorlash: ${niceDate(nextDue.dueDate)}. Hozircha kutubxonadan yangi kitob tanlashingiz mumkin.`
              : "Tahlil qilingan kitoblar paydo bo'lgach, takrorlash jadvali avtomatik yaratiladi."
          }
          action={
            <Link to="/kutubxona" className="nx-btn nx-btn--primary">
              <IconBookOpen size={16} /> Kutubxonani ko'rish
            </Link>
          }
        />
      ) : (
        <>
          <section className="nx-repeat-main nx-grid nx-grid--2">
            <div className="nx-session-card nx-card">
              <div className="nx-session-card__ring">
                <Ring value={Math.min(100, (dueItems.length / Math.max(1, totalCount)) * 100)} size={96} label={String(dueItems.length)} />
                <span>savol kutmoqda</span>
              </div>
              <div className="nx-session-card__info">
                <span className="nx-eyebrow">Bugungi sessiya</span>
                <h2 className="nx-title nx-title--sm">
                  {dueItems.length} savol · {bookCount} kitob
                </h2>
                <p className="nx-subtitle">
                  Taxminiy {minutes} daqiqa. Savolga javob berganingizdan keyin jadval sizga moslashadi.
                </p>
                <div className="nx-session-card__chips">
                  <span className="nx-chip nx-chip--warn"><IconClock size={14} /> ~{minutes} daq</span>
                  <span className="nx-chip nx-chip--warn"><IconFlame size={14} /> {profile.streak} kun</span>
                  <span className="nx-chip nx-chip--outline"><IconCalendar size={14} /> {niceDate(localDay())}</span>
                </div>
                <button className="nx-btn nx-btn--primary nx-btn--lg nx-session-card__cta" onClick={() => setQuizOn(true)}>
                  Boshlash <IconArrowRight size={16} />
                </button>
                <p className="nx-session-card__keys">
                  <IconKeyboard size={14} />
                  Sessiyada: <span className="nx-kbd">1</span>–<span className="nx-kbd">4</span> javob ·{' '}
                  <span className="nx-kbd">Enter</span> keyingi · <span className="nx-kbd">Esc</span> chiqish
                </p>
              </div>
            </div>

            <div className="nx-panel nx-queue">
              <div className="nx-panel__head">
                <div className="nx-queue__title">
                  <b>Navbatdagi savollar</b>
                </div>
                <span className="nx-chip nx-chip--accent">{dueItems.length} ta</span>
              </div>
              <div className="nx-panel__body nx-queue__list">
                {shown.map((d) => (
                  <div className="nx-queue__row" key={d.item.id}>
                    <span className={`nx-chip ${d.item.type === 'scenario' ? 'nx-chip--accent' : ''}`}>
                      {d.item.type === 'scenario' ? 'Vaziyat' : 'Nazariy'}
                    </span>
                    <div className="nx-queue__text">
                      <b>{d.item.question}</b>
                      <small>{d.bookTitle}</small>
                    </div>
                    {d.dueDate < localDay() && <span className="nx-chip nx-chip--warn">kechikkan</span>}
                  </div>
                ))}
                {dueItems.length > 5 && (
                  <button className="nx-btn nx-btn--ghost nx-btn--sm nx-queue__more" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
                    {showAll ? 'Qisqartirish' : `Yana ${dueItems.length - 5} ta savol`}
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="nx-schedule-info nx-card nx-card--pad">
            <div className="nx-schedule-info__head">
              <b className="nx-h3">Takrorlash qanday ishlaydi?</b>
            </div>
            <p className="nx-subtitle nx-schedule-info__intro">
              To'g'ri javob berganda savol keyinroq qaytadi: avval ertaga, so'ngra taxminan 3, 7, 14 va 30 kundan.
              Javoblar sizga qanchalik oson berilganiga qarab bu kunlar uzayadi yoki qisqaradi.
              Noto'g'ri javob berganda esa ertaga yana so'raladi — g'oyani qayta o'qib chiqishga vaqt bo'ladi.
            </p>
            <p className="nx-hint nx-intervals__lead">To'g'ri javoblar ko'paygan sari oraliq uzayadi:</p>
            <div className="nx-intervals">
              {[1, 3, 7, 14, 30].map((n, i) => (
                <div className="nx-intervals__step" key={n}>
                  <span className="nx-intervals__dot nx-mono-num">{i + 1}</span>
                  <b>{n} kun</b>
                </div>
              ))}
            </div>
            <div className="nx-intervals__caption">
              <span>Bugun javob berish kerak</span>
              <b className="nx-mono-num">{dueItems.length} / {totalCount}</b>
            </div>
            <Bar value={Math.min(100, (dueItems.length / Math.max(1, totalCount)) * 100)} className="nx-intervals__bar" />
            <p className="nx-hint nx-schedule-info__foot">
              {nextDue
                ? `Keyingi takrorlash: ${niceDate(nextDue.dueDate)}.`
                : 'Javob sifatiga qarab keyingi kunlar avtomatik belgilanadi.'}
            </p>
          </section>
        </>
      )}
      {toastNode}
    </div>
  )
}
