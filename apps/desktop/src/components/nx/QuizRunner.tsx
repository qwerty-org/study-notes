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

  // Klaviatura: 1-4 — javob, Enter/Bo'sh joy — keyingi, Esc — tasdiqlangan chiqish
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.key === 'Escape') {
        setConfirmExit(true)
        return
      }
      // Tugma fokusida Enter/Space bosilsa faqat tugmaning o'zi ishlaydi
      // (aks holda next() ikki marta chaqirilib, bir savol o'tkazib yuboriladi)
      if (target.closest('button')) return
      if (finished || confirmExit) return
      if (!revealed && ['1', '2', '3', '4'].includes(e.key)) {
        const opt = item?.options[Number(e.key) - 1]
        if (opt) choose(opt.key)
      } else if (revealed && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        next()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, revealed, idx, confirmExit])

  const exitModal = confirmExit ? (
    <ConfirmModal
      title="Sessiyani tark etish?"
      text="Hozirgi javoblar saqlanmaydi va takrorlash jadvali yangilanmaydi. Sessiyani tugatib, natijani saqlashni tavsiya etamiz."
      confirmLabel="Saqlamasdan chiqish"
      danger
      onClose={() => setConfirmExit(false)}
      onConfirm={() => { setConfirmExit(false); onExit() }}
    />
  ) : null

  if (!questions.length) {
    return (
      <div className="nx-page nx-page--narrow">
        <div className="nx-empty">
          <div className="nx-empty__icon">
            <IconTarget size={26} />
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
            <h2 className="nx-h2" style={{ marginBottom: 6 }}>
              E'tibor talab qiladigan mavzular
            </h2>
            <p className="nx-hint" style={{ marginBottom: 16 }}>
              Bu savollar jadvalda tezroq qaytadi. G'oyani qayta o'qish foyda beradi.
            </p>
            <div className="nx-stack" style={{ gap: 8 }}>
              {weak.slice(0, 5).map((q) => (
                <div className="nx-weak-row" key={q.id}>
                  <IconCircleX size={17} />
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
          <h2 className="nx-h2" style={{ marginBottom: 14 }}>
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
            {finishLabel ?? 'Natijani saqlash'} <IconArrowRight size={17} />
          </button>
        </div>
      </div>
      {exitModal}
      </>
    )
  }

  /* ---------------- Savol ---------------- */
  useEffect(() => {
    if (revealed) window.setTimeout(() => nextRef.current?.focus(), 0)
  }, [revealed])

  const progress = (idx / questions.length) * 100
  return (
    <div className="nx-page nx-page--narrow nx-quiz-session">
      <div className="nx-session-top">
        <button className="nx-back" onClick={onExit} style={{ margin: 0 }}>
          <IconX size={16} /> Chiqish
        </button>
        <span className="nx-mono-num nx-session-count">
          {String(idx + 1).padStart(2, '0')} <span>/ {String(questions.length).padStart(2, '0')}</span>
        </span>
      </div>

      <Bar value={progress} className="nx-session-bar" />

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
                className={`nx-option${state}${selected === opt.key ? ' picked' : ''}`}
                onClick={() => choose(opt.key)}
                disabled={revealed}
                role="radio"
                aria-checked={selected === opt.key}
              >
                <span className="nx-option__key">{LETTERS[i] ?? opt.key}</span>
                <span className="nx-option__text">{opt.text}</span>
                {state === 'correct' && <IconCircleCheck size={19} />}
                {state === 'wrong' && <IconCircleX size={19} />}
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
            <p>{item.explain.correct}</p>
            {!isCorrect && selected && item.explain.wrong?.[selected] && (
              <p className="nx-explain__mine">
                <b>Sizning javobingiz:</b> {item.explain.wrong[selected]}
              </p>
            )}
            <button ref={nextRef} className="nx-btn nx-btn--primary nx-btn--lg nx-explain__next" onClick={next}>
              {idx + 1 === questions.length ? 'Natijani ko\'rish' : 'Keyingi savol'}
              <IconArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="nx-quiz-help">
        <IconKeyboard size={15} />
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
    <span className="nx-row" style={{ gap: 6, color: 'var(--nx-muted)', fontSize: 12 }}>
      <IconRefresh size={14} /> Javoblar jadvalga yoziladi
    </span>
  )
}

/** Natija integrity uchun ishlatilmaydigan, lekin eksport qilingan yordamchi tur. */
export type { QuizItem }
export { IconBookOpen }
