import { useEffect, useMemo, useRef, useState } from 'react'
import type { QuizItem } from '@study-notes/core'
import { IconArrowRight, IconBookOpen, IconCheck, IconTarget, IconX } from '../icons'
import { IconCircleCheck, IconCircleX, IconKeyboard, IconRefresh } from './icons'
import { Bar, ConfirmModal, Ring } from './NxUI'

export interface QuizResult {
  correct: number
  total: number
  details: { id: string; correct: boolean }[]
}

interface Props {
  items: QuizItem[]
  title?: string
  conceptLabels?: Record<string, string>
  finishLabel?: string
  onFinish: (r: QuizResult) => void
  onExit: () => void
}

const LETTERS = ['A', 'B', 'C', 'D']

/** Fokusli sessiya: savol → javob → sabab → keyingi → natija tahlili. */
export default function QuizRunner({ items, title, conceptLabels, finishLabel, onFinish, onExit }: Props) {
  // Sessiya boshidagi savollar snapshot'i — tashqi qayta hisoblash natijani buzmasin
  const [questions] = useState(() => items)
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [details, setDetails] = useState<{ id: string; correct: boolean }[]>([])
  const [finished, setFinished] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)
  const nextRef = useRef<HTMLButtonElement>(null)
  const focusReturnRef = useRef<HTMLElement | null>(null)

  const item = questions[idx]
  const revealed = selected !== null
  const isCorrect = item ? selected === item.answer : false
  const correctCount = details.filter((d) => d.correct).length

  const weak = useMemo(
    () =>
      details
        .filter((d) => !d.correct)
        .map((d) => questions.find((q) => q.id === d.id))
        .filter((q): q is QuizItem => Boolean(q)),
    [details, questions],
  )

  const choose = (key: string) => {
    if (revealed || !item) return
    setSelected(key)
    setDetails((d) => [...d, { id: item.id, correct: key === item.answer }])
  }

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  const restart = () => {
    setIdx(0)
    setSelected(null)
    setDetails([])
    setFinished(false)
    setConfirmExit(false)
  }

  // Modalgacha bo'lgan fokusni eslab, yopilganda qaytaramiz: fokus na yo'qoladi, na qamaladi
  const openExit = () => {
    focusReturnRef.current = document.activeElement as HTMLElement | null
    setConfirmExit(true)
  }
  const closeExit = () => {
    setConfirmExit(false)
    window.setTimeout(() => focusReturnRef.current?.focus(), 0)
  }

  // Klaviatura: 1-4 — javob, Enter/Bo'sh joy — keyingi, Esc — tasdiqlangan chiqish
  useEffect(() => {
    // Natija ekranida global qisqartmalar ishlamaydi — aniq tugmalar ishlatiladi.
    // Modal ochiq bo'lsa, uning o'z Escape handleri ishlaydi (ikkinchi eshitgich qo'shmaymiz).
    if (finished || confirmExit || !questions.length) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        openExit()
        return
      }
      const target = e.target as HTMLElement | null
      const onControl = Boolean(
        target?.closest('button:not(:disabled), a[href], input, select, textarea, [role="button"]'),
      )
      // 1–4 — sessiyaning global qisqartmalari: fokus tugmada bo'lsa ham ishlaydi
      // (sessiyada matn kiritish maydoni yo'q, shuning uchun bosib yuborish xavfi yo'q)
      if (!revealed && ['1', '2', '3', '4'].includes(e.key)) {
        const opt = item?.options[Number(e.key) - 1]
        if (opt) {
          e.preventDefault()
          choose(opt.key)
        }
        return
      }
      // Fokusdagi tugma Enter/Space'ni o'zi boshqaradi — next() ikki marta chaqirilmaydi
      if (revealed && (e.key === 'Enter' || e.key === ' ')) {
        if (onControl) return
        e.preventDefault()
        next()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, revealed, idx, confirmExit, item, questions.length])

  // Javob ochilganda asosiy harakat tugmasiga fokus beramiz.
  // E'tibor: barcha hook'lar shartli qaytishlardan OLDIN chaqirilishi shart.
  useEffect(() => {
    if (!revealed || finished || !questions.length) return
    const id = window.setTimeout(() => {
      const active = document.activeElement as HTMLElement | null
      // Fokus allaqachon boshqa tugmada bo'lsa, uni tortib olmaymiz (qamash xavfi)
      const onControl = Boolean(active?.closest('button:not(:disabled), a[href], input, select, textarea'))
      if (!onControl) nextRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(id)
  }, [revealed, finished, questions.length])

  const exitModal = confirmExit ? (
    <ConfirmModal
      title="Sessiyani tark etish?"
      text="Hozirgi javoblar saqlanmaydi va takrorlash jadvali yangilanmaydi. Sessiyani tugatib, natijani saqlashni tavsiya etamiz."
      confirmLabel="Saqlamasdan chiqish"
      danger
      onClose={closeExit}
      onConfirm={() => { setConfirmExit(false); onExit() }}
    />
  ) : null

  if (!questions.length) {
    return (
      <div className="nx-page nx-page--narrow">
        <div className="nx-empty">
          <div className="nx-empty__icon">
            <IconTarget size={24} />
          </div>
          <div className="nx-empty__title">Savollar topilmadi</div>
          <p className="nx-empty__text">Bu kitob uchun hali quiz yaratilmagan.</p>
          <button className="nx-btn nx-btn--primary" onClick={onExit}>
            Orqaga
          </button>
        </div>
      </div>
    )
  }

  /* ---------------- Natija ---------------- */
  if (finished) {
    const percent = Math.round((correctCount / questions.length) * 100)
    return (
      <>
      <div className="nx-page nx-page--narrow nx-quiz-result">
        <div className="nx-result-hero nx-card">
          <Ring value={percent} size={104} label={`${percent}%`} />
          <div>
            <span className="nx-eyebrow">Sessiya yakunlandi</span>
            <h1 className="nx-title">
              {percent >= 80 ? "Ajoyib ish!" : percent >= 50 ? "Yaxshi, davom eting" : "Bu qismni takrorlaymiz"}
            </h1>
            <p className="nx-subtitle">
              {correctCount} / {questions.length} to'g'ri javob · {title ?? 'Takrorlash'}
            </p>
          </div>
        </div>

        {weak.length > 0 && (
          <section className="nx-card nx-card--pad">
            <div className="nx-weak-head">
              <div>
                <h2 className="nx-h2" style={{ marginBottom: 8 }}>
                  E'tibor talab qiladigan mavzular
                </h2>
                <p className="nx-hint" style={{ marginBottom: 16 }}>
                  Bu savollar jadvalda tezroq qaytadi. G'oyani qayta o'qish foyda beradi.
                </p>
              </div>
              <button className="nx-btn nx-btn--ghost nx-weak-retry" onClick={restart}>
                <IconRefresh size={16} /> Qayta takrorlash
              </button>
            </div>
            <div className="nx-stack" style={{ gap: 8 }}>
              {weak.slice(0, 5).map((q) => (
                <div className="nx-weak-row" key={q.id}>
                  <IconCircleX size={18} />
                  <span style={{ flex: 1 }}>{q.question}</span>
                  {q.concepts?.[0] && (
                    <span className="nx-chip nx-chip--accent" title={q.concepts[0]}>
                      {(conceptLabels?.[q.concepts[0]] ?? q.concepts[0]).slice(0, 48)}
                      {(conceptLabels?.[q.concepts[0]] ?? q.concepts[0]).length > 48 ? '…' : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="nx-card nx-card--pad">
          <h2 className="nx-h2" style={{ marginBottom: 16 }}>
            Javoblar tafsiloti
          </h2>
          <div className="nx-stack" style={{ gap: 4 }}>
            {questions.map((q, i) => {
              const ok = details.find((d) => d.id === q.id)?.correct
              return (
                <div className="nx-detail-row" key={q.id}>
                  <span className={ok ? 'ok' : 'bad'}>{ok ? <IconCheck size={14} /> : <IconX size={14} />}</span>
                  <span className="nx-mono-num">{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ flex: 1 }}>{q.question}</span>
                  <span className="nx-chip">{q.type === 'scenario' ? 'Vaziyat' : 'Nazariy'}</span>
                </div>
              )
            })}
          </div>
        </section>

        <div className="nx-row" style={{ justifyContent: 'flex-end' }}>
          <button className="nx-btn nx-btn--ghost" onClick={onExit}>
            Saqlamasdan chiqish
          </button>
          <button
            className="nx-btn nx-btn--primary nx-btn--lg"
            onClick={() => onFinish({ correct: correctCount, total: questions.length, details })}
          >
            {finishLabel ?? 'Natijani saqlash'} <IconArrowRight size={18} />
          </button>
        </div>
      </div>
      {exitModal}
      </>
    )
  }

  /* ---------------- Savol ---------------- */
  const progress = (idx / questions.length) * 100
  return (
    <div className="nx-page nx-page--narrow nx-quiz-session">
      <div className="nx-session-top">
        <button className="nx-back" onClick={openExit} style={{ margin: 0 }}>
          <IconX size={16} /> Chiqish
        </button>
        <span className="nx-mono-num nx-session-count">
          {String(idx + 1).padStart(2, '0')} <span>/ {String(questions.length).padStart(2, '0')}</span>
        </span>
      </div>

      <div
        className="nx-quiz-progress"
        role="progressbar"
        aria-label="Sessiya jarayoni"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={idx}
        aria-valuetext={`Savol ${idx + 1} / ${questions.length}`}
      >
        <Bar value={progress} className="nx-session-bar" />
      </div>
      <div className="nx-quiz-sr-only" role="status" aria-live="polite" aria-atomic="true">
        Savol {idx + 1} / {questions.length}.{' '}
        {revealed ? (isCorrect ? "To'g'ri javob." : "Noto'g'ri javob.") : 'Javob kutilmoqda.'}
      </div>

      <div className="nx-question-card nx-card">
        <div className="nx-row" style={{ marginBottom: 20 }}>
          <span className={`nx-chip ${item.type === 'scenario' ? 'nx-chip--accent' : ''}`}>
            {item.type === 'scenario' ? 'Vaziyatli savol' : 'Nazariy savol'}
          </span>
          {item.difficulty && <span className="nx-chip nx-chip--outline">{item.difficulty}</span>}
          {title && <span className="nx-spacer" />}
          {title && <span className="nx-chip">{title}</span>}
        </div>

        <div className="nx-question-text">{item.question}</div>

        <div className="nx-options" role="radiogroup" aria-label="Javob variantlari">
          {item.options.map((opt, i) => {
            const state = !revealed
              ? ''
              : opt.key === item.answer
                ? 'correct'
                : opt.key === selected
                  ? 'wrong'
                  : 'dim'
            return (
              <button
                key={opt.key}
                className={`nx-option ${state}${selected === opt.key ? ' picked' : ''}`}
                onClick={() => choose(opt.key)}
                disabled={revealed}
                role="radio"
                aria-checked={selected === opt.key}
              >
                <span className="nx-option__key">{LETTERS[i] ?? opt.key}</span>
                <span className="nx-option__text">{opt.text}</span>
                {state === 'correct' && <IconCircleCheck size={20} />}
                {state === 'wrong' && <IconCircleX size={20} />}
                {!revealed && <span className="nx-kbd">{i + 1}</span>}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className={`nx-explain ${isCorrect ? 'nx-explain--ok' : 'nx-explain--bad'}`}>
            <div className="nx-explain__head">
              {isCorrect ? <IconCircleCheck size={20} /> : <IconCircleX size={20} />}
              <b>
                {isCorrect
                  ? 'To\'g\'ri javob'
                  : `To\'g\'ri javob: ${item.options.find((o) => o.key === item.answer)?.text ?? item.answer}`}
              </b>
            </div>
            <div id="nx-quiz-feedback">
              <p>
                <b>Sabab:</b> {item.explain.correct}
              </p>
              {!isCorrect && selected && item.explain.wrong?.[selected] && (
                <p className="nx-explain__mine">
                  <b>Sizning javobingiz:</b> {item.explain.wrong[selected]}
                </p>
              )}
            </div>
            <button
              ref={nextRef}
              className="nx-btn nx-btn--primary nx-btn--lg nx-explain__next"
              onClick={next}
              aria-describedby="nx-quiz-feedback"
            >
              {idx + 1 === questions.length ? 'Natijani ko\'rish' : 'Keyingi savol'}
              <IconArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="nx-quiz-help">
        <IconKeyboard size={16} />
        <span>
          <span className="nx-kbd">1</span>–<span className="nx-kbd">4</span> javob tanlash ·{' '}
          <span className="nx-kbd">Enter</span> keyingi · <span className="nx-kbd">Esc</span> chiqish
        </span>
      </div>
      {exitModal}
    </div>
  )
}

/** Qayta boshlash uchun kichik yordamchi (import qilingan IconRefresh ishlatiladi). */
export function QuizRestartHint() {
  return (
    <span className="nx-row" style={{ gap: 8, color: 'var(--nx-muted)', fontSize: 12 }}>
      <IconRefresh size={14} /> Javoblar jadvalga yoziladi
    </span>
  )
}

/** Natija integrity uchun ishlatilmaydigan, lekin eksport qilingan yordamchi tur. */
export type { QuizItem }
export { IconBookOpen }
