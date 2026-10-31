import { useState } from 'react'
import { splitChapters, type ApplyLogEntry, type BookRecord } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { renderMD } from '../lib/md'
import { EmptyState, ProgressBar } from './ui'
import {
  IconArrowRight,
  IconChevronLeft,
  IconChat,
  IconCheck,
  IconGlobe,
  IconList,
} from './icons'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/* ================= 📄 O'qish ================= */

export function ReadTab({ book }: { book: BookRecord }) {
  const { updateBook } = useApp()
  const chapters = splitChapters(book.content)
  const [current, setCurrent] = useState(
    Math.min(book.progress.currentChapter, Math.max(0, chapters.length - 1)),
  )
  const [toast, setToast] = useState('')

  const ch = chapters[current]
  if (!ch) return <EmptyState icon={<IconList size={26} />} title="Matn topilmadi" />

  const isRead = book.progress.readChapters.includes(ch.index)

  const markRead = () => {
    const read = isRead ? book.progress.readChapters : [...book.progress.readChapters, ch.index]
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
    setToast(percent === 100 ? "Kitob tugadi — tabriklaymiz!" : "Bob o'qildi")
    setTimeout(() => setToast(''), 2200)
    if (current + 1 < chapters.length) setCurrent(current + 1)
  }

  return (
    <>
      <div className="row-between">
        <span className="chip chip-primary">
          Bob {current + 1} / {chapters.length}
        </span>
        <span className="chip">{book.progress.percent}% o'qilgan</span>
      </div>

      <div className="toc-scroll">
        {chapters.map((c) => (
          <button
            key={c.index}
            className={`toc-pill${c.index === current ? ' active' : ''}`}
            onClick={() => setCurrent(c.index)}
          >
            {book.progress.readChapters.includes(c.index) && <span className="done-mark">✓</span>}
            {c.index + 1}-bob
          </button>
        ))}
      </div>

      <article
        className="read-content md-body"
        dangerouslySetInnerHTML={{ __html: renderMD(ch.content) }}
      />

      <div className="row narrow">
        <button
          className="btn"
          style={{ padding: '11px 13px' }}
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
          aria-label="Oldingi bob"
        >
          <IconChevronLeft size={20} />
        </button>
        <button className="btn btn-primary grow" onClick={markRead}>
          {isRead ? 'Keyingi bob' : "Bob o'qildi"} <IconArrowRight size={18} />
        </button>
      </div>

      <div className="narrow">
        <ProgressBar value={book.progress.percent} />
      </div>

      {toast && <div className="toast">{toast}</div>}
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
    setToast('"Qo\'lladim" belgilandi — natijalaringizda ko\'rasiz')
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <div className="stack narrow" style={{ gap: 24 }}>
      {analysis.chapters.map((ch) => (
        <div key={ch.index} className="stack">
          <div className="chapter-label">
            {ch.index + 1}-bob · {ch.title}
          </div>
          {ch.keyIdeas.map((idea) => (
            <div key={idea.id} className="idea-card">
              <h3>{idea.idea}</h3>
              <div className="why">
                <b>Nima uchun</b>
                {idea.why}
              </div>
              <div className="apply">
                <b>Qanday qo'llash</b>
                {idea.howToApply}
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
                  className={`btn btn-sm${loggedToday(idea.id) ? ' btn-green' : ''}`}
                  disabled={loggedToday(idea.id)}
                  onClick={() => log(idea.id, idea.applyTags?.[0])}
                >
                  {loggedToday(idea.id) ? (
                    <>
                      <IconCheck size={14} /> Qo'lladim
                    </>
                  ) : (
                    "Men qo'lladim"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

/* ================= 📖 Terminlar ================= */

export function TermsTab({ book }: { book: BookRecord }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const terms = book.analysis?.chapters.flatMap((ch) =>
    ch.terms.map((t) => ({ ...t, from: `${ch.index + 1}-bob` })),
  )

  if (!terms?.length)
    return (
      <EmptyState
        icon={<IconList size={26} />}
        title="Termin topilmadi"
        text="Tahlildan keyin shu yerda paydo bo'ladi."
      />
    )

  const toggle = (i: number) => {
    const next = new Set(flipped)
    next.has(i) ? next.delete(i) : next.add(i)
    setFlipped(next)
  }

  return (
    <>
      <p className="hint" style={{ marginTop: 0 }}>
        Kartochkani bosib — oddiy tildagi izohni ko'ring.
      </p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(235px, 1fr))' }}>
        {terms.map((t, i) => (
          <div
            key={i}
            className={`term-card${flipped.has(i) ? ' flipped' : ''}`}
            onClick={() => toggle(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggle(i)}
          >
            <div className="term-inner">
              <div className="term-face">
                <small>{t.from}</small>
                <h3>{t.term}</h3>
                <small>bosib oching</small>
              </div>
              <div className="term-face back">
                <p>{t.definitionSimple}</p>
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
        icon={<IconGlobe size={26} />}
        title="Senariylar yo'q"
        text="AI tahlili «hayotda qanday qo'llash» vaziyatlarini shu yerga yaratadi."
      />
    )

  const todayLogged = new Set(
    applyLog.filter((e) => e.date === today()).map((e) => e.ideaId),
  )

  const reveal = (id: string) => setOpen(new Set(open).add(id))

  const log = (ideaId: string, context?: string) => {
    addApply({
      id: `log-${Date.now()}`,
      book: book.meta.slug,
      ideaId,
      date: today(),
      context,
    })
    setToast('Belgilandi — har kuni shu odatni qo\'llash mumkin')
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <>
      <div className="stack narrow">
        {scenarios.map((s) => {
          const shown = open.has(s.id)
          const logged = todayLogged.has(s.ideaId)
          return (
            <div key={s.id} className="scenario">
              <div className="row-between mb">
                <span className="chip chip-primary">Vaziyat</span>
                {logged && <span className="chip chip-green">bugun qo'llandi</span>}
              </div>
              <p className="situation">{s.situation}</p>

              {shown ? (
                <div className="actions">
                  <div className="right">
                    <b>To'g'ri harakat</b>
                    {s.rightAction}
                  </div>
                  <div className="wrong">
                    <b>Ko'pchilik qiladi</b>
                    {s.wrongAction}
                    {s.whyWrong && (
                      <>
                        <br />
                        <br />
                        <b style={{ color: 'var(--muted)' }}>Sabab</b>
                        {s.whyWrong}
                      </>
                    )}
                  </div>
                  <button
                    className={`btn ${logged ? 'btn-green' : 'btn-primary'} btn-block`}
                    disabled={logged}
                    onClick={() => log(s.ideaId, s.context)}
                  >
                    {logged ? (
                      <>
                        <IconCheck size={16} /> Bugun qo'lladim
                      </>
                    ) : (
                      'Men buni sinab ko\'raman'
                    )}
                  </button>
                </div>
              ) : (
                <button className="btn btn-block" onClick={() => reveal(s.id)}>
                  Qanday javob berish kerak?
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

/* ================= AI ustoz (Bosqich 2) ================= */

export function TutorTab({ book }: { book: BookRecord }) {
  return (
    <EmptyState
      icon={<IconChat size={26} />}
      title="AI ustoz — keyingi bosqichda"
      text={`«${book.meta.title}» bo'yicha savol-javob tez orada qo'shiladi. Hozircha Xulosalar va Hayotda qo'llash tablaridan foydalaning.`}
      action={<span className="chip chip-amber">tez orada</span>}
    />
  )
}
