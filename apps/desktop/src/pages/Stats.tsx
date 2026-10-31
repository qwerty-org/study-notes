import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Cover, EmptyState, PageHead, ProgressBar, Ring, Stat } from '../components/ui'
import {
  IconCheck,
  IconChevronRight,
  IconFlame,
  IconGlobe,
  IconLibrary,
  IconRepeat,
} from '../components/icons'

/** Mening natijalarim — streak, statistika, "qo'lladim" jurnali (docs/04 §6) */
export default function Stats() {
  const { profile, library, applyLog } = useApp()

  const chaptersRead = library.reduce((s, b) => s + b.progress.readChapters.length, 0)
  const quizCorrect = library.reduce((s, b) => s + b.progress.quizCorrect, 0)
  const quizTotal = library.reduce((s, b) => s + b.progress.quizTotal, 0)
  const quizPct = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null
  const finished = library.filter((b) => b.progress.percent >= 100).length
  const avgProgress = library.length
    ? Math.round(library.reduce((s, b) => s + b.progress.percent, 0) / library.length)
    : 0

  const ideaText = (bookSlug: string, ideaId: string): string | null => {
    const book = library.find((b) => b.meta.slug === bookSlug)
    for (const ch of book?.analysis?.chapters ?? []) {
      const idea = ch.keyIdeas.find((i) => i.id === ideaId)
      if (idea) return idea.idea
    }
    return ideaId
  }

  return (
    <>
      <PageHead title="Natijalarim" sub="O'sishingiz bir joyda" />

      {/* ---- Profil + asosiy raqamlar ---- */}
      <div className="hero">
        <div className="row" style={{ gap: 16, minWidth: 0 }}>
          <span className="popmenu-avatar" style={{ width: 58, height: 58, fontSize: 30 }}>
            {profile.avatar}
          </span>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 22 }}>{profile.name || "Ismsiz o'quvchi"}</h1>
            <div className="row wrap mt" style={{ marginTop: 7 }}>
              <span className="chip chip-amber">
                <IconFlame size={14} /> {profile.streak} kunlik streak
              </span>
              <span className="chip chip-green">{library.length} ta kitob</span>
              <span className="chip chip-primary">{finished} tugatilgan</span>
            </div>
          </div>
        </div>
        <div className="hero-goal">
          <Ring value={avgProgress} size={92} label={`${avgProgress}%`} />
          <small>o'rtacha progress</small>
        </div>
      </div>

      {/* ---- Ko'rsatkichlar qatori ---- */}
      <div className="grid grid-fit">
        <div className="card">
          <div className="card-title">
            <h3>O'qish</h3>
          </div>
          <div className="grid grid-2">
            <Stat value={chaptersRead} label="bob o'qildi" />
            <Stat value={`${avgProgress}%`} label="o'rtacha progress" />
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <h3>Bilim nazorati</h3>
          </div>
          <div className="grid grid-2">
            <Stat value={quizPct !== null ? `${quizPct}%` : '—'} label="quiz o'rtachasi" />
            <Stat value={quizTotal} label="javob berilgan" />
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <h3>Hayotda qo'llash</h3>
            <span className="chip chip-green">maqsad: 1/kun</span>
          </div>
          <div className="grid grid-2">
            <Stat value={applyLog.length} label="jami qo'llanma" />
            <Stat
              value={applyLog.filter((e) => e.date === new Date().toISOString().slice(0, 10)).length}
              label="bugun qo'llandi"
            />
          </div>
        </div>
      </div>

      <div className="split">
        {/* ---- «Men qo'lladim» jurnali ---- */}
        <div className="card">
          <div className="card-title">
            <h3>«Men qo'lladim» jurnali</h3>
            <span className="chip chip-green">{applyLog.length} ta</span>
          </div>

          {!applyLog.length ? (
            <EmptyState
              icon={<IconGlobe size={26} />}
              title="Hozircha yo'q"
              text="Kitobdagi qoidani hayotda qo'llaganingizda «Men qo'lladim» tugmasini bosing — shu yerda to'planadi. Platformaning asosiy maqsadi shu!"
              action={
                <Link to="/kutubxona" className="btn btn-primary mt">
                  Kitobga o'tish
                </Link>
              }
            />
          ) : (
            <div className="stack" style={{ gap: 8 }}>
              {applyLog.map((e) => (
                <div key={e.id} className="book-row" style={{ cursor: 'default' }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      background: 'var(--primary-soft)',
                      color: 'var(--primary-dark)',
                    }}
                  >
                    <IconCheck size={15} strokeWidth={2.4} />
                  </span>
                  <span className="b-body">
                    <b style={{ fontSize: 13.5 }}>{ideaText(e.book, e.ideaId)}</b>
                    <small>
                      {library.find((b) => b.meta.slug === e.book)?.meta.title ?? e.book}
                      {e.context ? ` · ${e.context}` : ''}
                    </small>
                  </span>
                  <span className="chip" style={{ flexShrink: 0 }}>
                    {e.date.slice(5).split('-').reverse().join('.')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stack" style={{ gap: 16 }}>
          {/* ---- Kitoblar bo'yicha progress ---- */}
          <div className="card">
            <div className="card-title">
              <h3>Kitoblar progressi</h3>
              <Link to="/kutubxona" className="chip">
                Kutubxona <IconChevronRight size={12} />
              </Link>
            </div>
            {library.length ? (
              <div className="stack" style={{ gap: 10 }}>
                {library.map((b) => (
                  <Link key={b.meta.slug} to={`/kitob/${b.meta.slug}`} className="book-row">
                    <Cover title={b.meta.title} variant="inline" />
                    <span className="b-body">
                      <b>{b.meta.title}</b>
                      <small>
                        {b.progress.readChapters.length}/{b.meta.chapters} bob
                      </small>
                      <ProgressBar value={b.progress.percent} />
                    </span>
                    <b style={{ fontSize: 13, color: 'var(--muted)', flexShrink: 0 }}>
                      {b.progress.percent}%
                    </b>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="hint" style={{ marginTop: 0 }}>
                Kutubxona bo'sh.
              </p>
            )}
          </div>

          {/* ---- Keyingi qadam ---- */}
          <div className="card">
            <div className="card-title">
              <h3>Keyingi qadam</h3>
            </div>
            <p className="hint" style={{ marginTop: 0 }}>
              Har kuni bitta vaziyatda qo'llash — oyiga ~30 ta qoida hayotga o'tadi.
            </p>
            <div className="stack">
              <Link to="/takrorlash" className="btn btn-primary btn-block">
                <IconRepeat size={17} /> Takrorlashni boshlash
              </Link>
              <Link to="/kutubxona" className="btn btn-block">
                <IconLibrary size={17} /> Yangi kitob o'qish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
