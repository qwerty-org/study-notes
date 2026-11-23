import { useCallback, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { niceDate, scheduleReview, touchActiveDay } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { PHASES, useAnalyze } from '../lib/useAnalyze'
import QuizRunner, { type QuizResult } from '../components/nx/QuizRunner'
import { ApplyTab, IdeasTab, ReadTab, TermsTab, TutorTab } from '../components/nx/BookTabs'
import { Bar, Empty, Ring } from '../components/nx/NxUI'
import {
  IconArrowRight,
  IconBookOpen,
  IconChat,
  IconChevronLeft,
  IconGlobe,
  IconList,
  IconLightbulb,
  IconSparkles,
  IconTarget,
} from '../components/icons'

type TabKey = 'read' | 'ideas' | 'terms' | 'quiz' | 'apply' | 'tutor'

const TABS: { key: TabKey; label: string; icon: typeof IconBookOpen; soon?: boolean }[] = [
  { key: 'read', label: "O'qish", icon: IconBookOpen },
  { key: 'ideas', label: 'Xulosalar', icon: IconLightbulb },
  { key: 'terms', label: 'Terminlar', icon: IconList },
  { key: 'quiz', label: 'Quiz', icon: IconTarget },
  { key: 'apply', label: "Hayotda qo'llash", icon: IconGlobe },
  { key: 'tutor', label: 'AI ustoz', icon: IconChat, soon: true },
]

function friendlyError(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('kalit') || m.includes('api')) return 'AI kaliti sozlanmagan yoki yaroqsiz. Sozlamalarga o‘tib, ulanishni tekshiring.'
  if (m.includes('ollama')) return 'Ollama javob bermadi. U o‘rnatilgani va ishlab turganini tekshiring yoki boshqa provayder tanlang.'
  if (m.includes('json') || m.includes('javob')) return 'AI javobini tushunib bo‘lmadi. Qayta urinib ko‘ring — bu vaqtinchalik xato.'
  return 'Tahlil vaqtincha to‘xtadi. Qayta urinishda tugallanmagan boblar davom etadi.'
}

const COVERS = [
  ['#2e3a8c', '#3b489e'], ['#3b5170', '#496184'], ['#46586e', '#566b84'],
  ['#2c5c5c', '#3a7070'], ['#4a5598', '#5a66ac'], ['#3a4252', '#4a5468'],
]
function coverColors(title: string) {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0
  return COVERS[Math.abs(h) % COVERS.length]
}

/** Muqovadagi sarlavhani so'z o'rtasidan emas, so'z chegarasidan kesadi */
function coverTitle(title: string): string {
  // CSS da 4 qatorga clamp qilinadi — so'z o'rtasidan kesish yo'q
  return title
}

export default function Book() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { library, updateBook, reviews, setReviews, updateProfile, profile } = useApp()
  const [sp, setSp] = useSearchParams()
  const [quizOn, setQuizOn] = useState(false)
  const tabRef = useRef<HTMLDivElement>(null)

  const book = library.find((b) => b.meta.slug === slug)
  const ana = useAnalyze(book)

  if (!book) {
    return (
      <div className="nx-page nx-page--narrow">
        <Empty
          icon={<IconBookOpen size={24} />}
          title="Kitob topilmadi"
          text="Bu kitob kutubxonangizda yo'q yoki o'chirilgan."
          action={
            <Link to="/kutubxona" className="nx-btn nx-btn--primary">
              Kutubxonaga qaytish
            </Link>
          }
        />
      </div>
    )
  }

  const rawTab = sp.get('tab') as TabKey | null
  const tab: TabKey =
    rawTab && TABS.some(({ key, soon }) => key === rawTab && !soon) ? rawTab : 'read'
  const setTab = useCallback((k: TabKey, scroll = false) => {
    if (k === 'tutor') return
    const next = new URLSearchParams(sp)
    next.set('tab', k)
    setSp(next, { replace: true })
    setQuizOn(false)
    if (scroll && tabRef.current) {
      const top = tabRef.current.getBoundingClientRect().top
      if (top < 70 || top > window.innerHeight - 120) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        tabRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      }
    }
  }, [sp, setSp])

  const onTabKey = (e: ReactKeyboardEvent, index: number) => {
    const enabled = TABS.filter((t) => !t.soon)
    let nextIndex = index
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % enabled.length
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = enabled.length - 1
    else return
    e.preventDefault()
    setTab(enabled[nextIndex].key, true)
    window.setTimeout(() => {
      tabRef.current?.querySelectorAll<HTMLButtonElement>('.nx-book-tab:not(:disabled)')[nextIndex]?.focus()
    }, 0)
  }

  const analysis = book.analysis
  const quizzes = analysis?.quizzes ?? []
  const ideasCount = analysis?.chapters.reduce((s, c) => s + c.keyIdeas.length, 0) ?? 0
  const termsCount = analysis?.chapters.reduce((s, c) => s + c.terms.length, 0) ?? 0
  const scenarioCount = analysis?.scenarios.length ?? 0
  const counts: Partial<Record<TabKey, number>> = {
    ideas: ideasCount, terms: termsCount, quiz: quizzes.length, apply: scenarioCount,
  }
  const accuracy = book.progress.quizTotal > 0
    ? Math.round((book.progress.quizCorrect / book.progress.quizTotal) * 100) : null
  const added = niceDate(book.meta.addedAt)
  const [c1, c2] = coverColors(book.meta.title)
  const conceptLabels: Record<string, string> = {}
  for (const ch of analysis?.chapters ?? []) {
    for (const idea of ch.keyIdeas) conceptLabels[idea.id] = idea.idea
  }

  const finishQuiz = (r: QuizResult) => {
    updateBook(book.meta.slug, (b) => ({
      ...b,
      progress: {
        ...b.progress,
        quizCorrect: b.progress.quizCorrect + r.correct,
        quizTotal: b.progress.quizTotal + r.total,
      },
    }))
    // Faqat birinchi marta javob berilgan savollar takrorlash jadvaliga kiradi.
    // Kitob ichidagi qayta ishlash (retake) jadvalni sun'iy oldinga surmaydi.
    const updated = reviews.map((rv) => {
      const d = r.details.find((x) => x.id === rv.reviewId)
      return d && rv.reps === 0 ? scheduleReview(rv, d.correct ? 4 : 1) : rv
    })
    if (updated.some((x, i) => x !== reviews[i])) setReviews(updated)
    updateProfile(touchActiveDay(profile))
    setQuizOn(false)
  }

  const goToAnalyze = () => {
    if (ana.needKey) {
      navigate('/sozlamalar', { state: { reason: 'AI kaliti sozlanmagan — tahlil qilish uchun kalit kerak.' } })
      return
    }
    void ana.run()
  }

  // Quiz paytida barcha chalg'ituvchi elementlar yashiriladi — faqat sessiya
  if (quizOn && analysis) {
    return (
      <div className="nx-book-quiz">
        <QuizRunner
          items={quizzes}
          title={book.meta.title}
          conceptLabels={conceptLabels}
          finishLabel="Natijani saqlash"
          onFinish={finishQuiz}
          onExit={() => setQuizOn(false)}
        />
      </div>
    )
  }

  const statusLabel = analysis
    ? 'Tahlil tayyor'
    : book.meta.status === 'partial'
      ? 'Qisman tahlil'
      : 'Tahlil kutilmoqda'

  return (
    <div className="nx-page nx-page--wide nx-book">
      <Link to="/kutubxona" className="nx-back">
        <IconChevronLeft size={16} /> Kutubxonaga qaytish
      </Link>

      {/* O'qish jarayoni yorilmada ham, tor ekranlarda ham ko'rinib turadi */}
      <div
        className="nx-book-progress"
        role="progressbar"
        aria-label="Kitobni o'qish jarayoni"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={book.progress.percent}
      >
        <span className="nx-book-progress__fill" style={{ width: `${book.progress.percent}%` }} />
      </div>

      <header className="nx-book-hero nx-card">
        <div className="nx-book-hero__cover" style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}>
          <span>{coverTitle(book.meta.title)}</span>
          <small>{book.meta.author ?? 'Study Notes'}</small>
        </div>
        <div className="nx-book-hero__info">
          <div className="nx-row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <span className={`nx-chip ${analysis ? 'nx-chip--success' : book.meta.status === 'partial' ? 'nx-chip--warn' : 'nx-chip--accent'}`}>
              {statusLabel}
            </span>
            <span className="nx-chip nx-chip--outline">{book.meta.sourceFormat.toUpperCase()}</span>
            <span className="nx-chip nx-chip--outline">{book.meta.chapters} bob</span>
          </div>
          <h1 className="nx-title nx-book-hero__title">{book.meta.title}</h1>
          <p className="nx-subtitle">
            {book.meta.author ?? 'Muallif ko‘rsatilmagan'} · {added} da qo‘shildi
          </p>
          <div className="nx-book-hero__progress">
            <Bar value={book.progress.percent} />
            <span className="nx-mono-num">{book.progress.percent}%</span>
          </div>
        </div>
        <div className="nx-book-hero__action">
          <Ring value={book.progress.percent} size={72} />
          {analysis ? (
            <button className="nx-btn nx-btn--primary nx-btn--lg" onClick={() => setTab('read', true)}>
              {book.progress.percent > 0
                ? `Bob ${book.progress.currentChapter + 1} dan davom etish`
                : 'O‘qishni boshlash'}
              <IconArrowRight size={16} />
            </button>
          ) : (
            <button className="nx-btn nx-btn--primary nx-btn--lg" onClick={goToAnalyze} disabled={ana.running}>
              <IconSparkles size={16} /> {ana.running ? 'Tahlil qilinmoqda…' : 'AI tahlil qilish'}
            </button>
          )}
          {analysis && (
            <button className="nx-btn nx-btn--ghost nx-btn--sm" onClick={() => setTab('quiz')}>
              <IconTarget size={14} /> Quiz ishlash
            </button>
          )}
        </div>
      </header>

      {ana.running && ana.progress && (
        <div className="nx-analyze-card nx-card">
          <div className="nx-row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <b>{ana.progress.done + 1}-bob: {ana.progress.title}</b>
              <p className="nx-hint">{PHASES[ana.progress.phase]} · {ana.progress.done}/{ana.progress.total} bob</p>
            </div>
            <span className="nx-chip nx-chip--accent nx-mono-num">
              {Math.round((ana.progress.done / Math.max(1, ana.progress.total)) * 100)}%
            </span>
          </div>
          <Bar value={(ana.progress.done / Math.max(1, ana.progress.total)) * 100} className="nx-analyze-bar" />
          <p className="nx-hint">Har bir bob alohida tahlil qilinadi — biroz kutishingiz mumkin.</p>
        </div>
      )}

      {ana.error && !ana.running && (
        <div className="nx-error-card">
          <div style={{ flex: 1 }}>
            <b>Tahlil to'xtadi</b>
            <p>{friendlyError(ana.error)}</p>
          </div>
          <button className="nx-btn nx-btn--soft nx-btn--sm" onClick={() => void ana.run()}>Qayta urinish</button>
        </div>
      )}

      <div className="nx-book-tabs" role="tablist" aria-label="Kitob bo'limlari" ref={tabRef}>
        {TABS.map(({ key, label, icon: Icon, soon }, index) => {
          const n = counts[key]
          return (
            <button
              key={key}
              id={`tab-${key}`}
              className={`nx-book-tab${tab === key ? ' is-active' : ''}${soon ? ' is-soon' : ''}`}
              onClick={() => setTab(key)}
              onKeyDown={(e) => onTabKey(e, index)}
              role="tab"
              aria-selected={tab === key}
              aria-controls="nx-book-panel"
              tabIndex={tab === key ? 0 : -1}
              disabled={soon}
              title={soon ? 'Keyingi bosqichda qo\'shiladi' : undefined}
            >
              <Icon size={16} /> {label}
              {n !== undefined && n > 0 && <span className="nx-book-tab__count">{n}</span>}
              {soon && <span className="nx-book-tab__soon">tez orada</span>}
            </button>
          )
        })}
      </div>

      <div className="nx-book-panel" id="nx-book-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
        {tab === 'read' && <ReadTab book={book} onOpenTab={(k) => setTab(k, true)} />}

        {tab === 'ideas' && (analysis ? <IdeasTab book={book} /> : (
          <Empty icon={<IconLightbulb size={24} />} title="Xulosalar tahlildan keyin paydo bo'ladi"
            text="AI kitob boblaridan eng muhim g'oyalarni ajratib beradi."
            action={<button className="nx-btn nx-btn--primary" onClick={goToAnalyze}>AI tahlil qilish</button>} />
        ))}

        {tab === 'terms' && (analysis ? <TermsTab book={book} /> : (
          <Empty icon={<IconList size={24} />} title="Terminlar tahlildan keyin paydo bo'ladi"
            text="Murakkab atamalar oddiy tilda tushuntiriladi."
            action={<button className="nx-btn nx-btn--primary" onClick={goToAnalyze}>AI tahlil qilish</button>} />
        ))}

        {tab === 'quiz' && (!analysis ? (
          <Empty icon={<IconTarget size={24} />} title="Quiz tahlildan keyin yaratiladi"
            text="AI har bobga vaziyatli va nazariy savollar tuzadi."
            action={<button className="nx-btn nx-btn--primary" onClick={goToAnalyze}>AI tahlil qilish</button>} />
        ) : (
          <div className="nx-quiz-intro nx-card nx-card--pad">
            <div className="nx-quiz-intro__copy">
              <h2 className="nx-title nx-title--sm">Bilimingizni sinab ko'ring</h2>
              <p className="nx-subtitle">
                {quizzes.length} ta savol · {quizzes.filter((q) => q.type === 'scenario').length} vaziyatli ·
                {accuracy !== null ? ` o'rtacha to'g'rilik ${accuracy}%` : ' hali javob bermadingiz'}
              </p>
            </div>
            <button className="nx-btn nx-btn--primary nx-btn--lg" onClick={() => setQuizOn(true)}>
              Boshlash <IconArrowRight size={16} />
            </button>
          </div>
        ))}

        {tab === 'apply' && (analysis ? <ApplyTab book={book} /> : (
          <Empty icon={<IconGlobe size={24} />} title="Vaziyatlar tahlildan keyin paydo bo'ladi"
            text="Har bir qoida uchun real hayotiy vaziyat va to'g'ri harakat yaratiladi."
            action={<button className="nx-btn nx-btn--primary" onClick={goToAnalyze}>AI tahlil qilish</button>} />
        ))}

        {tab === 'tutor' && <TutorTab book={book} />}
      </div>
    </div>
  )
}
