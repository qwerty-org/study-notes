import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { store } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { Ring, useToast } from '../components/nx/NxUI'
import { localDay, niceDate } from '../lib/nxDate'
import {
  IconBookOpen,
  IconChart,
  IconCheck,
  IconDownload,
  IconFlame,
  IconGlobe,
  IconTarget,
} from '../components/icons'
import { IconCalendar, IconFeather, IconInfo } from '../components/nx/icons'

const CONTEXTS = ['Barchasi', 'ish', 'oila', "do'stlik", "o'qish", 'shaxsiy'] as const

export default function Stats() {
  const { profile, library, applyLog } = useApp()
  const [context, setContext] = useState<(typeof CONTEXTS)[number]>('Barchasi')
  const { show, toast: toastNode } = useToast()

  const ideaText = (ideaId: string) => {
    for (const b of library) {
      for (const ch of b.analysis?.chapters ?? []) {
        const idea = ch.keyIdeas.find((i) => i.id === ideaId)
        if (idea) return idea.idea
      }
      const scenario = b.analysis?.scenarios.find((s) => s.id === ideaId)
      if (scenario) return scenario.situation
    }
    return "Qoida hayotda qo'llandi"
  }

  const avgProgress = library.length
    ? Math.round(library.reduce((s, b) => s + b.progress.percent, 0) / library.length)
    : 0
  const quizTotal = library.reduce((s, b) => s + b.progress.quizTotal, 0)
  const quizCorrect = library.reduce((s, b) => s + b.progress.quizCorrect, 0)
  const accuracy = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0
  const finished = library.filter((b) => b.progress.percent >= 100).length

  const activity = useMemo(() => {
    const days: { label: string; date: string; count: number }[] = []
    const names = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      const date = localDay(d)
      days.push({
        label: names[d.getDay()],
        date,
        count: applyLog.filter((e) => e.date === date).length,
      })
    }
    return days
  }, [applyLog])

  const maxActivity = Math.max(3, ...activity.map((d) => d.count))

  const badges = [
    { label: 'Birinchi qadam', ok: applyLog.length >= 1, icon: '✦' },
    { label: '7 kunlik iz', ok: profile.streak >= 7, icon: '🔥' },
    { label: '10 ta qo\'llash', ok: applyLog.length >= 10, icon: '★' },
    { label: 'Quiz ustasi', ok: accuracy >= 70 && quizTotal >= 5, icon: '◎' },
  ]

  const journal = applyLog
    .filter((e) => context === 'Barchasi' || e.context === context)
    .slice(0, 30)

  const exportData = () => {
    const blob = new Blob([store.exportAll()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-notes-${localDay()}.json`
    a.click()
    URL.revokeObjectURL(url)
    show('Ma\'lumotlar eksport qilindi')
  }

  return (
    <div className="nx-page nx-page--wide nx-stats">
      <header className="nx-head">
        <div>
          <span className="nx-eyebrow">Shaxsiy taraqqiyot</span>
          <h1 className="nx-title">Natijalarim</h1>
          <p className="nx-subtitle">O'sishingizni bir joyda ko'ring — o'qiganingiz emas, qo'llaganingiz.</p>
        </div>
        <div className="nx-head__actions">
          <button className="nx-btn nx-btn--ghost" onClick={exportData}>
            <IconDownload size={16} /> Eksport
          </button>
        </div>
      </header>

      <section className="nx-stats-hero nx-card">
        <div className="nx-stats-hero__profile">
          <span className="nx-stats-hero__avatar">{profile.avatar}</span>
          <div>
            <h2 className="nx-title nx-title--sm">{profile.name || "o'quvchi"}</h2>
            <p className="nx-subtitle">
              <IconFlame size={14} /> {profile.streak} kunlik iz · {library.length} ta kitob · {finished} tugatilgan
            </p>
          </div>
        </div>
        <div className="nx-stats-hero__ring">
          <Ring value={avgProgress} size={76} />
          <span>o'rtacha progress</span>
        </div>
      </section>

      <section className="nx-stats-grid nx-grid nx-grid--4">
        <div className="nx-stat nx-stat--accent">
          <div className="nx-stat__top"><span className="nx-stat__label">Qo'llangan qoida</span><IconGlobe size={17} /></div>
          <div className="nx-stat__value nx-mono-num">{applyLog.length}</div>
          <div className="nx-stat__hint">kunlik maqsad: 1 ta</div>
        </div>
        <div className="nx-stat nx-stat--success">
          <div className="nx-stat__top"><span className="nx-stat__label">To'g'ri javob</span><IconTarget size={17} /></div>
          <div className="nx-stat__value nx-mono-num">{accuracy}%</div>
          <div className="nx-stat__hint">{quizCorrect}/{quizTotal} savol</div>
        </div>
        <div className="nx-stat nx-stat--warn">
          <div className="nx-stat__top"><span className="nx-stat__label">Uzluksiz kun</span><IconFlame size={17} /></div>
          <div className="nx-stat__value nx-mono-num">{profile.streak}</div>
          <div className="nx-stat__hint">kunlik iz</div>
        </div>
        <div className="nx-stat">
          <div className="nx-stat__top"><span className="nx-stat__label">O'qilgan bob</span><IconBookOpen size={17} /></div>
          <div className="nx-stat__value nx-mono-num">
            {library.reduce((s, b) => s + b.progress.readChapters.length, 0)}
          </div>
          <div className="nx-stat__hint">{library.reduce((s, b) => s + b.meta.chapters, 0)} ta jami</div>
        </div>
      </section>

      <section className="nx-stats-activity nx-card nx-card--pad">
        <div className="nx-section-head">
          <div>
            <h2 className="nx-h2">So'nggi 7 kun</h2>
            <p className="nx-hint">Har kuni kamida bitta qoidani qo'llashga harakat qiling.</p>
          </div>
          <div className="nx-row nx-badges">
            {badges.map((b) => (
              <span key={b.label} className={`nx-badge${b.ok ? ' is-earned' : ''}`} title={b.label}>
                <span>{b.icon}</span><small>{b.label}</small>
              </span>
            ))}
          </div>
        </div>
        <div className="nx-activity-chart">
          {activity.map((d) => (
            <div className="nx-activity-day" key={d.date}>
              <span className="nx-activity-bar-wrap">
                <span
                  className={`nx-activity-bar${d.count ? ' has-data' : ''}`}
                  style={{ height: `${Math.max(8, (d.count / maxActivity) * 100)}%` }}
                  title={`${d.count} ta qo'llash`}
                />
              </span>
              <small>{d.label}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="nx-journal nx-panel">
        <div className="nx-panel__head">
          <div className="nx-row" style={{ gap: 9 }}>
            <IconFeather size={18} />
            <div>
              <h2 className="nx-h2">"Men qo'lladim" jurnali</h2>
              <p className="nx-hint">Hayotda sinab ko'rgan qoidalaringiz</p>
            </div>
          </div>
          <span className="nx-chip nx-chip--success">{applyLog.length} yozuv</span>
        </div>
        <div className="nx-panel__body">
          <div className="nx-filter-row nx-segmented" role="group" aria-label="Kontekst bo'yicha filtr">
            {CONTEXTS.map((c) => (
              <button key={c} aria-pressed={context === c} onClick={() => setContext(c)}>{c}</button>
            ))}
          </div>

          {journal.length ? (
            <div className="nx-timeline">
              {journal.map((e) => (
                <div className="nx-timeline__item" key={e.id}>
                  <span className="nx-timeline__dot" />
                  <div className="nx-timeline__body">
                    <b>{ideaText(e.ideaId)}</b>
                    <div className="nx-row" style={{ gap: 7, flexWrap: 'wrap' }}>
                      {e.context && <span className="nx-chip nx-chip--outline">{e.context}</span>}
                      <span className="nx-chip">{niceDate(e.date)}</span>
                      {e.note && <span className="nx-hint">{e.note}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="nx-empty" style={{ padding: '36px 20px' }}>
              <div className="nx-empty__icon"><IconFeather size={24} /></div>
              <div className="nx-empty__title">Hali yozuv yo'q</div>
              <p className="nx-empty__text">
                Kitobdagi qoidani hayotda sinab, "Men qo'lladim" tugmasini bosing — shu yerda paydo bo'ladi.
              </p>
              <Link to="/kutubxona" className="nx-btn nx-btn--primary">Kitob tanlash</Link>
            </div>
          )}
        </div>
      </section>

      <section className="nx-stats-bottom nx-grid nx-grid--2">
        <div className="nx-panel">
          <div className="nx-panel__head"><b className="nx-h3">Kitoblar progressi</b><IconBookOpen size={17} /></div>
          <div className="nx-panel__body nx-stack" style={{ gap: 10 }}>
            {library.length ? library.map((b) => (
              <Link to={`/kitob/${b.meta.slug}`} className="nx-progress-row" key={b.meta.slug}>
                <span>{b.meta.title}</span>
                <span className="nx-progress nx-progress--inline"><span style={{ width: `${b.progress.percent}%` }} /></span>
                <b className="nx-mono-num">{b.progress.percent}%</b>
              </Link>
            )) : <p className="nx-hint">Hali kitob qo'shilmagan.</p>}
          </div>
        </div>
        <div className="nx-panel nx-next-step">
          <div className="nx-panel__head"><b className="nx-h3">Keyingi qadam</b><IconChart size={17} /></div>
          <div className="nx-panel__body nx-stack">
            <div className="nx-next-step__row">
              <IconFlame size={18} />
              <p>Kunlik izni saqlash uchun bugun kamida bitta qoidani qo'llang.</p>
            </div>
            <div className="nx-next-step__row">
              <IconInfo size={18} />
              <p>Noto'g'ri javoblar takrorlash jadvalida tezroq qaytadi — ularni <Link to="/takrorlash">takrorlash</Link> bo'limida ko'ring.</p>
            </div>
            <div className="nx-next-step__row">
              <IconCheck size={18} />
              <p>{finished} ta kitob to'liq o'qildi. Yangi kitob qo'shish uchun <Link to="/kutubxona">kutubxonaga</Link> o'ting.</p>
            </div>
          </div>
        </div>
      </section>
      {toastNode}
    </div>
  )
}
