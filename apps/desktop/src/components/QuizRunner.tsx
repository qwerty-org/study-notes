import { useState } from 'react'
import type { QuizItem } from '@study-notes/core'

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

/**
 * To'liq quiz rejimi: savol → javob → sabab → keyingi → natija.
 * docs/04 §5 bo'yicha.
 */
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

  const result: QuizResult = {
    correct: correctCount,
    total: items.length,
    details,
  }

  /* ---------- Natija ekrani ---------- */
  if (finished) {
    const percent = items.length ? Math.round((correctCount / items.length) * 100) : 0
    return (
      <div className="quiz-wrap">
        <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
          <div style={{ fontSize: 46 }}>{percent >= 80 ? '🎉' : percent >= 50 ? '💪' : '📖'}</div>
          <h1>
            {correctCount} / {items.length}
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            {percent >= 80
              ? 'Ajoyib! Materialni yaxshi egallabsiz.'
              : percent >= 50
                ? "Yaxshi! Ba'zi mavzularni takrorlashga arziydi."
                : "Xavotir olmang — takrorlash orqali mustahkamlanadi."}
          </p>

          <div className="stack mt" style={{ textAlign: 'left' }}>
            {items.map((q, i) => {
              const d = details[i]
              return (
                <div key={q.id} className="row" style={{ fontSize: 13.5 }}>
                  <span>{d?.correct ? '✅' : '❌'}</span>
                  <span className="grow" style={{ color: 'var(--muted)' }}>
                    {q.question.slice(0, 90)}
                    {q.question.length > 90 ? '…' : ''}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="row mt" style={{ justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={onExit}>
              Chiqish
            </button>
            <button className="btn btn-primary" onClick={() => onFinish(result)}>
              {finishLabel ?? 'Tugatish'}
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
          <button className="btn" onClick={onExit}>
            Orqaga
          </button>
        </div>
      </div>
    )
  }

  /* ---------- Savol ---------- */
  return (
    <div className="quiz-wrap">
      <div className="row-between mb">
        <span className="chip chip-primary">
          {item.type === 'scenario' ? '📍 Vaziyat savoli' : '📝 Nazariy savol'}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onExit}>
          Chiqish ✕
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
        <h2 style={{ marginTop: 6, fontSize: 18 }}>{item.question}</h2>

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
                <span className="key">{o.key}.</span>
                <span>{o.text}</span>
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className="stack mt">
            <div className={`explain ${selected === item.answer ? 'ok' : 'bad'}`}>
              <b>{selected === item.answer ? '✅ To\'g\'ri! ' : '❌ Noto\'g\'ri. '}</b>
              {item.explain.correct}
            </div>
            {selected !== item.answer && item.explain.wrong?.[selected ?? ''] && (
              <div className="explain">
                <b>Nega boshqa variant emas:</b> {item.explain.wrong[selected ?? '']}
              </div>
            )}
            <button className="btn btn-primary btn-block" onClick={next}>
              {idx + 1 < items.length ? 'Keyingi savol →' : 'Natijani ko\'rish'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
