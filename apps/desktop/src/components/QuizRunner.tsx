import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { QuizItem } from '@study-notes/core'
import { IconBookOpen, IconCheck, IconRepeat, IconTarget, IconX } from './icons'

/** Ekran o'quvchi vositalarga ko'rinadigan, lekin vizual yashirin matn. */
const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export interface QuizResult {
  correct: number
  total: number
  details: { id: string; correct: boolean }[]
}

interface Props {
  items: QuizItem[]
  title?: string
  finishLabel?: string
  onFinish: (r: QuizResult) => void
  onExit: () => void
}

/** To'liq quiz rejimi: savol → javob → sabab → keyingi → natija (docs/04 §5) */
export default function QuizRunner({ items, title, finishLabel, onFinish, onExit }: Props) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [details, setDetails] = useState<{ id: string; correct: boolean }[]>([])
  const [finished, setFinished] = useState(false)
  const nextRef = useRef<HTMLButtonElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  const item = items[idx]
  const correctCount = details.filter((d) => d.correct).length
  const isCorrect = item ? selected === item.answer : false
  const correctText = item
    ? (item.options.find((o) => o.key === item.answer)?.text ?? item.answer)
    : ''

  const choose = (key: string) => {
    if (revealed || !item) return
    setSelected(key)
    setRevealed(true)
    setDetails((d) => [...d, { id: item.id, correct: key === item.answer }])
  }

  const next = () => {
    if (idx + 1 < items.length) {
      setIdx(idx + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setFinished(true)
    }
  }

  const result: QuizResult = { correct: correctCount, total: items.length, details }

  // Javob ochilganda variantlar o'chadi — fokusni "Keyingi" tugmasiga o'tkazamiz.
  // Fokus qamab qolmaydi: Tab/Shift+Tab bilan erkin chiqish mumkin.
  useEffect(() => {
    if (!revealed || finished) return
    const id = window.setTimeout(() => nextRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [revealed, finished])

  // Keyingi savolga o'tganda fokus birinchi variantga qaytadi (klaviatura oqimi uzilmasin).
  useEffect(() => {
    if (idx === 0 || revealed || finished || !item) return
    const id = window.setTimeout(() => optionsRef.current?.querySelector('button')?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [idx, revealed, finished, item])

  // Klaviatura: 1–4 — javob, Enter/Bo'sh joy — keyingi, Esc — chiqish.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit()
        return
      }
      // Tab va boshqa navigatsiya tugmalariga aralashmaymiz (fokus qamalmaydi)
      if (e.key === 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement | null
      const onButton = Boolean(target?.closest('button'))
      if (finished || !item) return
      if (!revealed && ['1', '2', '3', '4'].includes(e.key)) {
        // Raqamlar tugma fokusida ham ishlaydi (tugmaning mahalliy harakati yo'q)
        const opt = item.options[Number(e.key) - 1]
        if (opt) choose(opt.key)
      } else if (revealed && (e.key === 'Enter' || e.key === ' ')) {
        // Tugma fokusida Enter/Space faqat tugmaning o'zini ishga soladi
        if (onButton) return
        e.preventDefault()
        next()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, revealed, idx, item, items, onExit])

  /* ---------- Natija ekrani ---------- */
  if (finished) {
    const percent = items.length ? Math.round((correctCount / items.length) * 100) : 0
    const ResultIcon = percent >= 80 ? IconCheck : percent >= 50 ? IconRepeat : IconBookOpen
    const resultColor = percent >= 80 ? 'var(--pm-sage)' : percent >= 50 ? 'var(--pm-accent)' : 'var(--pm-brass)'
    return (
      <div className="quiz-wrap">
        <div className="card" style={{ textAlign: 'center', padding: '24px 20px' }}>
          <div className="empty" style={{ padding: '0 0 12px' }} role="status">
            <span className="icon" style={{ background: 'var(--elevated)', color: resultColor }}>
              <ResultIcon size={24} />
            </span>
            <h3>
              {correctCount} / {items.length}
            </h3>
            <p>
              {percent >= 80
                ? 'Ajoyib! Materialni yaxshi egallabsiz.'
                : percent >= 50
                  ? "Yaxshi! Ba'zi mavzularni takrorlashga arziydi."
                  : 'Xavotir olmang — takrorlash orqali mustahkamlanadi.'}
            </p>
          </div>

          <div className="stack" style={{ textAlign: 'left' }}>
            {items.map((q, i) => {
              const d = details[i]
              return (
                <div key={q.id} className="row" style={{ fontSize: 14, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      color: d?.correct ? 'var(--pm-sage)' : 'var(--pm-danger)',
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  >
                    {d?.correct ? <IconCheck size={16} /> : <IconX size={16} />}
                    <span style={SR_ONLY}>{d?.correct ? "To'g'ri" : "Noto'g'ri"}</span>
                  </span>
                  <span className="grow" style={{ color: 'var(--pm-ink-2)', letterSpacing: 0 }}>
                    {q.question.slice(0, 90)}
                    {q.question.length > 90 ? '…' : ''}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="stack mt">
            <button className="btn btn-primary btn-lg btn-block" onClick={() => onFinish(result)}>
              {finishLabel ?? 'Tugatish'}
            </button>
            <button className="btn btn-ghost btn-block" onClick={onExit}>
              Chiqish
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="quiz-wrap">
        <div className="card">
          <p>Savollar topilmadi.</p>
          <button className="btn mt" onClick={onExit}>
            Orqaga
          </button>
        </div>
      </div>
    )
  }

  /* ---------- Savol ---------- */
  return (
    <div className="quiz-wrap">
      <div className="row-between">
        <span className="chip chip-primary">
          {item.type === 'scenario' ? 'Vaziyat savoli' : 'Nazariy savol'}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onExit}>
          Yopish
        </button>
      </div>

      <div className="quiz-dots" aria-hidden="true">
        {items.map((q, i) => (
          <div
            key={q.id}
            className={`quiz-dot ${
              i < details.length
                ? details[i].correct
                  ? 'done-ok'
                  : 'done-bad'
                : i === idx
                  ? 'now'
                  : ''
            }`}
          />
        ))}
      </div>

      <div className="card">
        <small aria-label={`Savol ${idx + 1} / ${items.length}`}>
          {idx + 1} / {items.length}
        </small>
        <h2 style={{ marginTop: 8, fontSize: 18, lineHeight: 1.4 }}>{item.question}</h2>

        <div ref={optionsRef} className="stack mt" role="radiogroup" aria-label="Javob variantlari">
          {item.options.map((o) => {
            let cls = 'quiz-option'
            if (revealed) {
              if (o.key === item.answer) cls += ' correct'
              else if (o.key === selected) cls += ' wrong'
              else cls += ' dim'
            }
            return (
              <button
                key={o.key}
                className={cls}
                onClick={() => choose(o.key)}
                disabled={revealed}
                role="radio"
                aria-checked={selected === o.key}
              >
                <span className="key">{o.key}</span>
                <span>{o.text}</span>
              </button>
            )
          })}
        </div>

        <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--pm-ink-2)' }}>
          1–4 — javob tanlash · Enter — keyingi · Esc — chiqish
        </p>

        {revealed && (
          <div className="stack mt">
            <div className={`explain ${isCorrect ? 'ok' : 'bad'}`} role="status">
              <b>
                {isCorrect
                  ? "To'g'ri javob. "
                  : `Noto'g'ri. To'g'ri javob: ${correctText}. `}
              </b>
              {item.explain.correct}
            </div>
            {!isCorrect && selected && item.explain.wrong?.[selected] && (
              <div className="explain" role="status">
                <b>Nega bu javob noto'g'ri:</b> {item.explain.wrong[selected]}
              </div>
            )}
            <button ref={nextRef} className="btn btn-primary btn-block" onClick={next}>
              {idx + 1 < items.length ? 'Keyingi savol' : 'Natijani ko\'rish'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
