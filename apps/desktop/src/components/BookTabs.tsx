import { useState } from 'react'
import { splitChapters, type ApplyLogEntry, type BookRecord } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { renderMD } from '../lib/md'
import { EmptyState, Ring } from './ui'
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

const WORDS_PER_PAGE = 420

function splitIntoPages(text: string): string[] {
  const paras = text.split(/\n\s*\n/).filter((p) => p.trim())
  const pages: string[] = []
  let cur: string[] = []
  let curWords = 0
  const flush = () => {
    const t = cur.join('\n\n').trim()
    if (t) pages.push(t)
    cur = []
    curWords = 0
  }
  for (const p of paras) {
    const words = p.trim().split(/\s+/).length
    if (words > WORDS_PER_PAGE) {
      const sentences = p.split(/(?<=[.!?])\s+/)
      for (const s of sentences) {
        const sw = s.trim().split(/\s+/).length
        if (curWords + sw > WORDS_PER_PAGE && cur.length) flush()
        cur.push(s.trim())
        curWords += sw
      }
    } else if (curWords + words > WORDS_PER_PAGE && cur.length) {
      flush()
      cur.push(p.trim())
      curWords = words
    } else {
      cur.push(p.trim())
      curWords += words
    }
  }
  flush()
  return pages.length ? pages : [text]
}

/* ================= 📄 O'qish (e-reader) ================= */

export function ReadTab({ book }: { book: BookRecord }) {
  const { updateBook } = useApp()
  const chapters = splitChapters(book.content)
  const [current, setCurrent] = useState(
    Math.min(book.progress.currentChapter, Math.max(0, chapters.length - 1)),
  )
  const [page, setPage] = useState(0)
  const [toast, setToast] = useState('')

  const ch = chapters[current]
  if (!ch) return <EmptyState icon={<IconList size={26} />} title="Matn topilmadi" />

  const pages = splitIntoPages(ch.content)
  const pageIndex = Math.min(Math.max(page, 0), pages.length - 1)

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
    if (current + 1 < chapters.length) {
      setCurrent(current + 1)
      setPage(0)
    }
  }

  const goPage = (delta: number) => {
    const next = pageIndex + delta
    if (next < 0 || next >= pages.length) return
    setPage(next)
  }

  const goChapter = (i: number) => {
    setCurrent(i)
    setPage(0)
  }

  const readCount = book.progress.readChapters.length

  return (
    <div className="reader-layout">
      {/* ============ Chap panel: progress + amallar + boblar ============ */}
      <aside className="reader-side">
        <div className="reader-side-progress">
          <Ring value={book.progress.percent} size={62} stroke={7} />
          <div>
            <b>
              {readCount}/{chapters.length}
            </b>
            <small>bob o'qildi</small>
          </div>
        </div>

        <button
          className={`btn btn-block${isRead ? '' : ' btn-primary'}`}
          disabled={isRead && current === chapters.length - 1}
          onClick={() => {
            if (isRead) goChapter(Math.min(current + 1, chapters.length - 1))
            else markRead()
          }}
        >
          {isRead
            ? current === chapters.length - 1
              ? '✓ Kitob o\'qildi'
              : "Keyingi bob →"
            : "✓ Bobni o'qildim"}
        </button>

        <div className="reader-side-label">Boblar</div>
        <div className="chapter-list">
          {chapters.map((c) => {
            const done = book.progress.readChapters.includes(c.index)
            return (
              <button
                key={c.index}
                className={`chapter-item${c.index === current ? ' active' : ''}`}
                onClick={() => goChapter(c.index)}
              >
                <span className="ch-num">{done ? <IconCheck size={13} strokeWidth={2.6} /> : c.index + 1}</span>
                <span className="ch-title">{c.title || `${c.index + 1}-bob`}</span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* ============ O'ng: o'qish maydoni ============ */}
      <div className="reader-main">
        <div className="reader-bar">
          <div style={{ minWidth: 0 }}>
            <b>Bob {current + 1}/{chapters.length}</b>
            {ch.title && <span className="ch-name"> · {ch.title}</span>}
          </div>
          <span className="chip">
            Sahifa <b style={{ marginLeft: 3 }}>{pageIndex + 1}</b>/{pages.length}
          </span>
        </div>

        <div className="reader-card md-body">
          <article dangerouslySetInnerHTML={{ __html: renderMD(pages[pageIndex]) }} />
        </div>

        <div className="reader-nav">
          <button
            className="reader-btn"
            disabled={pageIndex === 0 && current === 0}
            onClick={() => {
              if (pageIndex > 0) goPage(-1)
              else goChapter(current - 1)
            }}
          >
            <IconChevronLeft size={17} /> Oldingi
          </button>
          <button
            className="reader-btn reader-btn-primary"
            onClick={() => {
              if (pageIndex < pages.length - 1) goPage(1)
              else markRead()
            }}
          >
            {pageIndex < pages.length - 1 ? (
              <>
                Keyingi <IconArrowRight size={17} />
              </>
            ) : current === chapters.length - 1 ? (
              <>
                Kitob yakunlandi <IconCheck size={16} />
              </>
            ) : (
              <>
                Keyingi bob <IconArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

/* ================= 💡 Xulosalar (Ideas) ================= */

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
    <div className="ideas-wrap">
      {analysis.chapters.map((ch) => (
        <div key={ch.index} className="chapter-group">
          <div className="chapter-label">
            {ch.index + 1}-bob · {ch.title}
          </div>
          <div className="idea-grid">
            {ch.keyIdeas.map((idea) => (
              <div key={idea.id} className="idea-card">
                <div className="idea-head">
                  <h3>{idea.idea}</h3>
                </div>
                <div className="idea-body">
                  <div className="why">
                    <b>Nima uchun</b>
                    {idea.why}
                  </div>
                  <div className="apply">
                    <b>Qanday qo'llash</b>
                    {idea.howToApply}
                  </div>
                </div>
                <div className="idea-foot">
                  <div className="row wrap" style={{ gap: 6 }}>
                    {idea.applyTags?.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    className={`idea-btn${loggedToday(idea.id) ? ' done' : ''}`}
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
        </div>
      ))}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

/* ================= 📖 Terminlar (flip kartochkalar) ================= */

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
      <div className="terms-grid">
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
              <div className="term-face front">
                <small>{t.from}</small>
                <h3>{t.term}</h3>
                <small style={{ color: 'var(--muted)' }}>bosib oching</small>
              </div>
              <div className="term-face back">
                <p>{t.definitionSimple}</p>
                {t.metaphor && <span className="term-metaphor">💭 {t.metaphor}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ================= 🌍 Hayotda qo'llash (Apply) ================= */

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
    <div className="apply-wrap">
      {scenarios.map((s) => {
        const logged = todayLogged.has(s.ideaId)
        const shown = open.has(s.id)
        return (
          <div key={s.id} className="scenario-card">
            <div className="scenario-head">
              <span className="chip chip-primary">Vaziyat</span>
              {logged && <span className="chip chip-green">bugun qo'llandi</span>}
            </div>
            <p className="situation">{s.situation}</p>

            {shown ? (
              <div className="scenario-actions">
                <div className="scenario-side right">
                  <b>To'g'ri harakat</b>
                  {s.rightAction}
                </div>
                <div className="scenario-side wrong">
                  <b>Ko'pchilik qiladi</b>
                  {s.wrongAction}
                  {s.whyWrong && (
                    <>
                      <br />
                      <br />
                      <b style={{ color: 'var(--muted)', fontSize: 11 }}>Sabab</b>
                      {s.whyWrong}
                    </>
                  )}
                </div>
                <button
                  className={`scenario-btn ${logged ? 'done' : ''}`}
                  disabled={logged}
                  onClick={() => log(s.id, s.context)}
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
              <button className="reveal-btn" onClick={() => setOpen(new Set(open).add(s.id))}>
                Qanday javob berish kerak? <IconChevronLeft size={14} />
              </button>
            )}
          </div>
        )
      })}
      {toast && <div className="toast">{toast}</div>}
    </div>
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
