import { useState } from 'react'
import type { QuizItem } from '@study-notes/core'
import { IconBookOpen, IconCheck, IconRepeat, IconTarget, IconX } from './icons'

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

  const item = items[idx]
  const correctCount = details.filter((d) => d.correct).length

  const choose = (key: string) => {
    if (revealed) return
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

  /* ---------- Natija ekrani ---------- */
  if (finished) {
    const percent = items.length ? Math.round((correctCount / items.length) * 100) : 0
    const ResultIcon = percent >= 80 ? IconCheck : percent >= 50 ? IconRepeat : IconBookOpen
    const resultColor = percent >= 80 ? 'var(--green)' : percent >= 50 ? 'var(--accent)' : 'var(--amber)'
    return (
      <div className="quiz-wrap">
        <div className="card" style={{ textAlign: 'center', padding: '28px 18px' }}>
          <div className="empty" style={{ padding: '0 0 10px' }}>
            <span className="icon" style={{ background: 'var(--elevated)', color: resultColor }}>
              <ResultIcon size={28} />
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
                <div key={q.id} className="row" style={{ fontSize: 13.5, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      color: d?.correct ? 'var(--green)' : 'var(--red)',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {d?.correct ? <IconCheck size={15} /> : <IconX size={15} />}
                  </span>
                  <span className="grow" style={{ color: 'var(--muted)', letterSpacing: 0 }}>
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

      <div className="quiz-dots">
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
        <small>
          {idx + 1} / {items.length}
        </small>
        <h2 style={{ marginTop: 6, fontSize: 17.5, lineHeight: 1.4 }}>{item.question}</h2>

        <div className="stack mt">
          {item.options.map((o) => {
            let cls = 'quiz-option'
            if (revealed) {
              if (o.key === item.answer) cls += ' correct'
              else if (o.key === selected) cls += ' wrong'
              else cls += ' dim'
            }
            return (
              <button key={o.key} className={cls} onClick={() => choose(o.key)}>
                <span className="key">{o.key}</span>
                <span>{o.text}</span>
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className="stack mt">
            <div className={`explain ${selected === item.answer ? 'ok' : 'bad'}`}>
              <b>{selected === item.answer ? "To'g'ri javob. " : "Noto'g'ri. "}</b>
              {item.explain.correct}
            </div>
            {selected !== item.answer && item.explain.wrong?.[selected ?? ''] && (
              <div className="explain">
                <b>Nega boshqa variant emas:</b> {item.explain.wrong[selected ?? '']}
              </div>
            )}
            <button className="btn btn-primary btn-block" onClick={next}>
              {idx + 1 < items.length ? 'Keyingi savol' : 'Natijani ko\'rish'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
