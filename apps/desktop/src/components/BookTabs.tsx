import { useState } from 'react'
import {
  splitChapters,
  type ApplyLogEntry,
  type BookRecord,
} from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { renderMD } from '../lib/md'
import { EmptyState, ProgressBar } from './ui'

/* ================= 📄 O'qish ================= */

export function ReadTab({ book }: { book: BookRecord }) {
  const { updateBook, profile } = useApp()
  const chapters = splitChapters(book.content)
  const [current, setCurrent] = useState(
    Math.min(book.progress.currentChapter, Math.max(0, chapters.length - 1)),
  )
  const [toast, setToast] = useState('')

  const ch = chapters[current]
  if (!ch) return <EmptyState icon="📄" title="Matn topilmadi" />

  const isRead = book.progress.readChapters.includes(ch.index)

  const markRead = () => {
    const read = isRead
      ? book.progress.readChapters
      : [...book.progress.readChapters, ch.index]
    const percent = Math.round((read.length / chapters.length) * 100)
    updateBook(book.meta.slug, (b) => ({
      ...b,
      progress: {
        ...b.progress,
        readChapters: read,
        percent,
        currentChapter: Math.min(current + 1, chapters.length - 1),
      },
    }))
    setToast(percent === 100 ? "🎉 Kitob tugadi!" : '✅ Bob o\'qildi')
    setTimeout(() => setToast(''), 2200)
    if (current + 1 < chapters.length) setCurrent(current + 1)
  }

  return (
    <>
      <div className="read-layout">
        <nav className="read-toc">
          {chapters.map((c) => (
            <button
              key={c.index}
              className={`toc-item${c.index === current ? ' active' : ''}`}
              onClick={() => setCurrent(c.index)}
            >
              <span className={book.progress.readChapters.includes(c.index) ? 'toc-check' : ''}>
                {book.progress.readChapters.includes(c.index) ? '✓' : '○'}
              </span>
              <span>{c.title}</span>
            </button>
          ))}
        </nav>

        <article>
          <div className="row-between mb">
            <span className="chip chip-primary">
              Bob {current + 1} / {chapters.length}
            </span>
            <span className="chip">{book.progress.percent}% o'qilgan</span>
          </div>
          <div className="read-content md-body" dangerouslySetInnerHTML={{ __html: renderMD(ch.content) }} />
          <div className="row mt wrap">
            <button
              className="btn btn-ghost"
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
            >
              ← Oldingi
            </button>
            <button className="btn btn-primary grow" onClick={markRead}>
              {isRead ? 'Keyingi bob →' : "✓ Bob o'qildi — keyingisiga o'tish"}
            </button>
          </div>
        </article>
      </div>
      {toast && <div className="toast">{toast}</div>}
      <div className="mt">
        <ProgressBar value={book.progress.percent} />
      </div>
      <small>
        {profile.name ? `${profile.name}, ` : ''}o'qishni davom ettirish — har kuni 10 daqiqa
        yetarli.
      </small>
    </>
  )
}

/* ================= 💡 Xulosalar ================= */

export function IdeasTab({ book }: { book: BookRecord }) {
  const { addApply, applyLog } = useApp()
  const [toast, setToast] = useState('')
  const analysis = book.analysis
  if (!analysis) return null

  const loggedToday = (ideaId: string) =>
    applyLog.some((e) => e.ideaId === ideaId && e.date === today())

  const log = (ideaId: string, context?: string) => {
    const entry: ApplyLogEntry = {
      id: `log-${Date.now()}`,
      book: book.meta.slug,
      ideaId,
      date: today(),
      context: context ?? '',
    }
    addApply(entry)
    setToast('✅ "Qo\'lladim" deb belgilandi — natijalaringizda ko\'rasiz')
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <>
      {analysis.chapters.map((ch) => (
        <div key={ch.index}>
          <div className="chapter-label">
            {ch.index + 1}-bob: {ch.title}
          </div>
          <div className="stack">
            {ch.keyIdeas.map((idea) => (
              <div key={idea.id} className="idea-card">
                <h3>💡 {idea.idea}</h3>
                <div className="why">
                  <b>Nima uchun:</b> {idea.why}
                </div>
                <div className="apply">
                  <b>🌍 Qanday qo'llash:</b> {idea.howToApply}
                </div>
                <div className="row-between mt">
                  <div className="row wrap">
                    {idea.applyTags?.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    className={`btn btn-sm ${loggedToday(idea.id) ? 'btn-green' : ''}`}
                    disabled={loggedToday(idea.id)}
                    onClick={() => log(idea.id, idea.applyTags?.[0])}
                  >
                    {loggedToday(idea.id) ? "✓ Qo'lladim" : "✅ Men qo'lladim"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

/* ================= 📖 Terminlar ================= */

export function TermsTab({ book }: { book: BookRecord }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const terms = book.analysis?.chapters.flatMap((ch) =>
    ch.terms.map((t) => ({ ...t, from: `${ch.index + 1}-bob` })),
  )

  if (!terms?.length)
    return <EmptyState icon="📖" title="Termin topilmadi" text="Tahlildan keyin shu yerda paydo bo'ladi." />

  const toggle = (i: number) => {
    const next = new Set(flipped)
    next.has(i) ? next.delete(i) : next.add(i)
    setFlipped(next)
  }

  return (
    <>
      <p className="hint mb">Kartochkani bosib — oddiy tildagi izohni ko'ring.</p>
      <div className="grid grid-3">
        {terms.map((t, i) => (
          <div
            key={i}
            className={`term-card${flipped.has(i) ? ' flipped' : ''}`}
            onClick={() => toggle(i)}
          >
            <div className="term-inner">
              <div className="term-face">
                <small>{t.from}</small>
                <h3>{t.term}</h3>
                <small>ℹ️ bosib tushuntirishni ko'ring</small>
              </div>
              <div className="term-face back">
                <p style={{ margin: 0 }}>{t.definitionSimple}</p>
                {t.metaphor && <small>💭 {t.metaphor}</small>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ================= 🌍 Hayotda qo'llash ================= */

export function ApplyTab({ book }: { book: BookRecord }) {
  const { addApply, applyLog } = useApp()
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState('')
  const scenarios = book.analysis?.scenarios ?? []

  if (!scenarios.length)
    return (
      <EmptyState
        icon="🌍"
        title="Senariylar yo'q"
        text="AI tahlili «hayotda qanday qo'llash» vaziyatlarini shu yerga yaratadi."
      />
    )

  const todayLogged = new Set(
    applyLog.filter((e) => e.date === today()).map((e) => e.ideaId),
  )

  const reveal = (id: string) => {
    const next = new Set(open)
    next.add(id)
    setOpen(next)
  }

  const log = (ideaId: string, context?: string) => {
    addApply({
      id: `log-${Date.now()}`,
      book: book.meta.slug,
      ideaId,
      date: today(),
      context,
    })
    setToast("✅ Belgilandi — har kuni shu qilish odatini qo'shamiz")
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <>
      <div className="stack">
        {scenarios.map((s) => {
          const shown = open.has(s.id)
          return (
            <div key={s.id} className="scenario">
              <div className="row-between mb">
                <span className="chip chip-primary">📍 Vaziyat</span>
                {todayLogged.has(s.ideaId) && <span className="chip chip-green">bugun qo'llandi</span>}
              </div>
              <p className="situation">{s.situation}</p>

              {shown ? (
                <div className="actions">
                  <div className="right">
                    <b>✅ To'g'ri harakat:</b> {s.rightAction}
                  </div>
                  <div className="wrong">
                    <b>❌ Ko'pchilik qiladi:</b> {s.wrongAction}
                    {s.whyWrong && (
                      <>
                        <br />
                        <b>Sabab:</b> {s.whyWrong}
                      </>
                    )}
                  </div>
                  <button
                    className={`btn ${todayLogged.has(s.ideaId) ? 'btn-green' : 'btn-primary'}`}
                    disabled={todayLogged.has(s.ideaId)}
                    onClick={() => log(s.ideaId, s.context)}
                  >
                    {todayLogged.has(s.ideaId)
                      ? "✓ Bugun qo'lladim"
                      : "🫡 Men buni sinab ko'raman"}
                  </button>
                </div>
              ) : (
                <button className="btn btn-block" onClick={() => reveal(s.id)}>
                  Qanday javob berish kerak? →
                </button>
              )}
            </div>
          )
        })}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

/* ================= 🤖 AI ustoz (Bosqich 2) ================= */

export function TutorTab({ book }: { book: BookRecord }) {
  return (
    <EmptyState
      icon="🤖"
      title="AI ustoz — Bosqich 2'da"
      text={`«${book.meta.title}» bo'yicha savol-javob (RAG) keyingi bosqichda qo'shiladi. Hozircha Xulosalar va Hayotda qo'llash tablaridan foydalaning.`}
      action={<span className="chip chip-amber">tez orada</span>}
    />
  )
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}
