import { useEffect, useMemo, useState } from 'react'
import { splitChapters, type ApplyLogEntry, type BookRecord } from '@study-notes/core'
import { useApp } from '../../store/AppStore'
import { renderMD } from '../../lib/md'
import {
  IconArrowRight,
  IconBookOpen,
  IconChat,
  IconCheck,
  IconGlobe,
  IconList,
} from '../icons'
import { IconChevronDown, IconFeather, IconQuote, IconRefresh } from './icons'
import { Bar, Empty, Ring, useToast } from './NxUI'

const WORDS_PER_PAGE = 420

function localDay(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function splitIntoPages(text: string): string[] {
  const paras = text.split(/\n\s*\n/).filter((p) => p.trim())
  const pages: string[] = []
  let cur: string[] = []
  let words = 0
  const flush = () => {
    const t = cur.join('\n\n').trim()
    if (t) pages.push(t)
    cur = []
    words = 0
  }
  for (const p of paras) {
    const n = p.trim().split(/\s+/).length
    if (n > WORDS_PER_PAGE) {
      for (const s of p.split(/(?<=[.!?])\s+/)) {
        const sw = s.trim().split(/\s+/).length
        if (words + sw > WORDS_PER_PAGE && cur.length) flush()
        cur.push(s.trim())
        words += sw
      }
    } else if (words + n > WORDS_PER_PAGE && cur.length) {
      flush()
      cur.push(p.trim())
      words = n
    } else {
      cur.push(p.trim())
      words += n
    }
  }
  flush()
  return pages.length ? pages : [text]
}

/* ============================ O'QISH ============================ */

export function ReadTab({ book }: { book: BookRecord }) {
  const { updateBook } = useApp()
  const { show, toast: toastNode } = useToast()
  const chapters = useMemo(() => splitChapters(book.content), [book.content])
  const [current, setCurrent] = useState(
    Math.min(book.progress.currentChapter, Math.max(0, chapters.length - 1)),
  )
  const [page, setPage] = useState(0)
  const [fontSize, setFontSize] = useState(19)
  const [paper, setPaper] = useState<'paper' | 'sepia'>('paper')
  const [tocOpen, setTocOpen] = useState(true)

  const ch = chapters[current]
  const pages = useMemo(() => (ch ? splitIntoPages(ch.content) : []), [ch])
  const pageIndex = Math.min(Math.max(page, 0), Math.max(0, pages.length - 1))
  const isRead = ch ? book.progress.readChapters.includes(ch.index) : false
  const readCount = book.progress.readChapters.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') goPage(-1)
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goPage(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  if (!ch) return <Empty icon={<IconBookOpen size={26} />} title="Matn topilmadi" text="Kitob matni bo'sh." />

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
    show(percent === 100 ? 'Kitob tugadi — ajoyib ish!' : 'Bob o‘qildi deb belgilandi')
    if (current + 1 < chapters.length) {
      setCurrent(current + 1)
      setPage(0)
    }
  }

  const goPage = (delta: number) => {
    const next = pageIndex + delta
    if (next < 0) {
      if (current > 0) {
        setCurrent(current - 1)
        setPage(0)
      }
      return
    }
    if (next >= pages.length) {
      if (current < chapters.length - 1) {
        setCurrent(current + 1)
        setPage(0)
      } else if (isRead) {
        show('Bu kitobdagi barcha boblar o‘qildi')
      } else {
        markRead()
      }
      return
    }
    setPage(next)
  }

  const goChapter = (i: number) => {
    setCurrent(i)
    setPage(0)
  }

  return (
    <div className="nx-reader">
      <aside className={`nx-reader-side${tocOpen ? '' : ' is-collapsed'}`}>
        <div className="nx-reader-progress">
          <Ring value={book.progress.percent} size={58} />
          <div>
            <b className="nx-mono-num">{readCount} / {chapters.length}</b>
            <span>bob o'qildi</span>
          </div>
        </div>

        <button
          className={`nx-btn nx-btn--block ${isRead ? 'nx-btn--ghost' : 'nx-btn--primary'}`}
          onClick={() => (isRead ? goChapter(Math.min(current + 1, chapters.length - 1)) : markRead())}
          disabled={isRead && current === chapters.length - 1}
        >
          {isRead ? (current === chapters.length - 1 ? <><IconCheck size={15} /> Kitob o‘qildi</> : 'Keyingi bob') : <><IconCheck size={15} /> Bobni tugattim</>}
        </button>

        <div className="nx-reader-side__label">
          Boblar <span className="nx-mono-num">{chapters.length}</span>
        </div>
        <nav className="nx-toc">
          {chapters.map((c) => {
            const done = book.progress.readChapters.includes(c.index)
            return (
              <button
                key={c.index}
                className={`nx-toc__item${c.index === current ? ' is-active' : ''}`}
                onClick={() => goChapter(c.index)}
                aria-current={c.index === current ? 'step' : undefined}
              >
                <span className={`nx-toc__num${done ? ' is-done' : ''}`}>
                  {done ? <IconCheck size={12} strokeWidth={2.8} /> : c.index + 1}
                </span>
                <span>{c.title || `${c.index + 1}-bob`}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="nx-reader-main">
        <div className="nx-reader-toolbar">
          <button className="nx-icon-btn nx-toc-toggle" onClick={() => setTocOpen((v) => !v)} aria-label="Boblar ro'yxati">
            <IconList size={17} />
          </button>
          <div className="nx-reader-toolbar__title">
            <b>Bob {current + 1} / {chapters.length}</b>
            <span>{ch.title}</span>
          </div>
          <span className="nx-chip nx-mono-num">{pageIndex + 1} / {pages.length} sahifa</span>
          <div className="nx-reader-aa">
            <button onClick={() => setFontSize((s) => Math.max(15, s - 1))} aria-label="Shriftni kichraytirish">A−</button>
            <button onClick={() => setFontSize(19)} aria-label="Shriftni tiklash">Aa</button>
            <button onClick={() => setFontSize((s) => Math.min(26, s + 1))} aria-label="Shriftni kattalashtirish">A+</button>
          </div>
          <button
            className="nx-icon-btn"
            title="Sahifa fonini almashtirish"
            onClick={() => setPaper((p) => (p === 'paper' ? 'sepia' : 'paper'))}
          >
            <IconFeather size={16} />
          </button>
        </div>

        <article
          className={`nx-reader-paper nx-reader-paper--${paper} md-body`}
          style={{ fontSize }}
          dangerouslySetInnerHTML={{ __html: renderMD(pages[pageIndex] ?? '') }}
        />

        <div className="nx-reader-footer">
          <button className="nx-btn nx-btn--ghost" onClick={() => goPage(-1)} disabled={pageIndex === 0 && current === 0}>
            Oldingi
          </button>
          <span className="nx-hint">← → tugmalari bilan sahifa almashtirish</span>
          <button className="nx-btn nx-btn--primary" onClick={() => goPage(1)}>
            {pageIndex < pages.length - 1 ? 'Keyingi sahifa' : current < chapters.length - 1 ? 'Keyingi bob' : 'Tugatish'}
            <IconArrowRight size={16} />
          </button>
        </div>
      </div>
      {toastNode}
    </div>
  )
}

/* ============================ G'OYALAR ============================ */

export function IdeasTab({ book }: { book: BookRecord }) {
  const { addApply, applyLog } = useApp()
  const { show, toast: toastNode } = useToast()
  const analysis = book.analysis
  const loggedToday = useMemo(
    () => new Set(applyLog.filter((e) => e.date === localDay() && e.kind !== 'scenario').map((e) => e.refId ?? e.ideaId)),
    [applyLog],
  )

  if (!analysis) return null

  const log = (entry: ApplyLogEntry) => {
    addApply(entry)
    show('"Qo\'lladim" jurnalga yozildi')
  }

  return (
    <div className="nx-ideas">
      <div className="nx-tab-intro">
        <IconQuote size={18} />
        <p>Har bir g'oya — muallifning asosiy fikri. «Qanday qo'llash» bo'limidagi qadamni ertaga bajaring.</p>
      </div>
      {analysis.chapters.map((ch) => (
        <section className="nx-idea-group" key={ch.index}>
          <header className="nx-idea-group__head">
            <span className="nx-chapter-badge">{ch.index + 1}</span>
            <h3>{ch.title || `${ch.index + 1}-bob`}</h3>
            <span className="nx-chip">{ch.keyIdeas.length} g'oya</span>
          </header>
          <div className="nx-idea-grid">
            {ch.keyIdeas.map((idea, i) => {
              const done = loggedToday.has(idea.id)
              return (
                <article className="nx-idea-card" key={idea.id}>
                  <div className="nx-idea-card__top">
                    <span className="nx-idea-card__no nx-mono-num">{String(i + 1).padStart(2, '0')}</span>
                    <h4>{idea.idea}</h4>
                  </div>
                  <div className="nx-idea-card__row">
                    <span className="nx-idea-card__label">Nima uchun</span>
                    <p>{idea.why}</p>
                  </div>
                  <div className="nx-idea-card__row nx-idea-card__row--apply">
                    <span className="nx-idea-card__label">Qanday qo'llash</span>
                    <p>{idea.howToApply}</p>
                  </div>
                  <footer className="nx-idea-card__foot">
                    <div className="nx-row" style={{ gap: 5, flexWrap: 'wrap' }}>
                      {idea.applyTags?.map((t) => <span className="nx-chip" key={t}>{t}</span>)}
                    </div>
                    <button
                      className={`nx-btn nx-btn--sm ${done ? 'nx-btn--soft' : 'nx-btn--ghost'}`}
                      disabled={done}
                      onClick={() =>
                        log({
                          id: `log-${Date.now()}`,
                          book: book.meta.slug,
                          ideaId: idea.id,
                          refId: idea.id,
                          kind: 'idea',
                          date: localDay(),
                          context: idea.applyTags?.[0],
                        })
                      }
                    >
                      {done ? <><IconCheck size={14} /> Qo'lladim</> : "Men qo'lladim"}
                    </button>
                  </footer>
                </article>
              )
            })}
          </div>
        </section>
      ))}
      {toastNode}
    </div>
  )
}

/* ============================ TERMINLAR ============================ */

export function TermsTab({ book }: { book: BookRecord }) {
  const terms = useMemo(
    () => book.analysis?.chapters.flatMap((ch) => ch.terms.map((t) => ({ ...t, from: `${ch.index + 1}-bob` }))) ?? [],
    [book.analysis],
  )
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  if (!terms.length)
    return <Empty icon={<IconList size={26} />} title="Termin topilmadi" text="Tahlildan keyin shu yerda paydo bo'ladi." />

  const toggle = (key: string) =>
    setFlipped((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="nx-terms-wrap">
      <div className="nx-tab-intro">
        <IconFeather size={18} />
        <p>Murakkab terminlar oddiy tilda tushuntirilgan. Kartochkani bosing — izoh va metafora ochiladi.</p>
      </div>
      <div className="nx-terms-grid">
        {terms.map((t, i) => {
          const key = `${t.from}-${t.term}-${i}`
          const open = flipped.has(key)
          return (
            <button
              key={key}
              className={`nx-term-card${open ? ' is-open' : ''}`}
              onClick={() => toggle(key)}
              aria-expanded={open}
            >
              <span className="nx-term-card__from">{t.from}</span>
              <span className="nx-term-card__term">{t.term}</span>
              {open ? (
                <>
                  <span className="nx-term-card__def">{t.definitionSimple}</span>
                  {t.metaphor && <span className="nx-term-card__metaphor"><IconQuote size={13} /> {t.metaphor}</span>}
                </>
              ) : (
                <span className="nx-term-card__hint">Izohni ko‘rish <IconChevronDown size={14} /></span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ==================== HAYOTDA QO'LLASH ==================== */

export function ApplyTab({ book }: { book: BookRecord }) {
  const { addApply, applyLog } = useApp()
  const { show, toast: toastNode } = useToast()
  const [open, setOpen] = useState<Set<string>>(new Set())
  const scenarios = book.analysis?.scenarios ?? []
  const scenarioIdeaIds = new Set(scenarios.map((sc) => sc.ideaId))
  const loggedToday = new Set(
    applyLog
      .filter((e) => e.date === localDay() && (
        e.kind === 'scenario' || (!e.kind && !scenarioIdeaIds.has(e.ideaId))
      ))
      .map((e) => e.refId ?? e.ideaId),
  )

  if (!scenarios.length)
    return <Empty icon={<IconGlobe size={26} />} title="Senariylar yo'q" text="AI tahlili vaziyatlarni shu yerga yaratadi." />

  const log = (ideaId: string, refId: string, context?: string) => {
    addApply({
      id: `log-${Date.now()}`,
      book: book.meta.slug,
      ideaId,
      refId,
      kind: 'scenario',
      date: localDay(),
      context,
    })
    show('Bugun qo‘lladim deb belgilandi')
  }

  return (
    <div className="nx-apply-wrap">
      <div className="nx-tab-intro">
        <IconGlobe size={18} />
        <p>Kitobdagi qoidani real vaziyatda sinang. Avval o'zingiz javob berishga harakat qiling, keyin oching.</p>
      </div>
      {scenarios.map((s, i) => {
        const done = loggedToday.has(s.id)
        const revealed = open.has(s.id)
        return (
          <article className="nx-scenario" key={s.id}>
            <header className="nx-scenario__head">
              <span className="nx-scenario__no nx-mono-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="nx-chip nx-chip--accent">Vaziyat</span>
              {s.context && <span className="nx-chip nx-chip--outline">{s.context}</span>}
              {done && <span className="nx-chip nx-chip--success"><IconCheck size={11} /> bugun qo'llandi</span>}
            </header>
            <p className="nx-scenario__text">{s.situation}</p>
            {revealed ? (
              <div className="nx-scenario__reveal">
                <div className="nx-scenario__side nx-scenario__side--right">
                  <b><IconCheck size={14} /> To'g'ri harakat</b>
                  <p>{s.rightAction}</p>
                </div>
                <div className="nx-scenario__side nx-scenario__side--wrong">
                  <b>Ko'pchilik qiladi</b>
                  <p>{s.wrongAction}</p>
                  {s.whyWrong && <p className="nx-scenario__why"><b>Sabab:</b> {s.whyWrong}</p>}
                </div>
                <div className="nx-scenario__foot">
                  <button
                    className={`nx-btn nx-btn--sm ${done ? 'nx-btn--soft' : 'nx-btn--primary'}`}
                    disabled={done}
                    onClick={() => log(s.ideaId, s.id, s.context)}
                  >
                    {done ? <><IconCheck size={14} /> Bugun qo'lladim</> : "Men buni sinab ko'raman"}
                  </button>
                  <button className="nx-btn nx-btn--ghost nx-btn--sm" onClick={() => setOpen((p) => { const n = new Set(p); n.delete(s.id); return n })}>
                    <IconRefresh size={13} /> Yashirish
                  </button>
                </div>
              </div>
            ) : (
              <button className="nx-scenario__reveal-btn" onClick={() => setOpen((p) => new Set(p).add(s.id))}>
                Qanday javob berish kerak? <IconChevronDown size={15} />
              </button>
            )}
          </article>
        )
      })}
      {toastNode}
    </div>
  )
}

/* ============================ AI USTOZ ============================ */

export function TutorTab({ book }: { book: BookRecord }) {
  return (
    <Empty
      icon={<IconChat size={27} />}
      title="AI ustoz — keyingi bosqichda"
      text={`«${book.meta.title}» bo'yicha savol-javob rejimi Bosqich 2'da qo'shiladi. Hozircha Xulosalar, Terminlar va Hayotda qo'llash bo'limlaridan foydalaning.`}
      action={<span className="nx-chip nx-chip--warn">tez orada</span>}
    />
  )
}

/**Qo'llash jurnali bo'yicha bugungi maqsad bajarilganmi */
export function todayApplyCount(entries: ApplyLogEntry[]): number {
  return entries.filter((e) => e.date === localDay()).length
}
