import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { EmptyState, PageHead, Stat } from '../components/ui'

/** Mening natijalarim — streak, statistika, "qo'lladim" jurnali (docs/04 §6) */
export default function Stats() {
  const { profile, library, applyLog } = useApp()

  const chaptersRead = library.reduce((s, b) => s + b.progress.readChapters.length, 0)
  const quizCorrect = library.reduce((s, b) => s + b.progress.quizCorrect, 0)
  const quizTotal = library.reduce((s, b) => s + b.progress.quizTotal, 0)
  const quizPct = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null
  const finished = library.filter((b) => b.progress.percent >= 100).length

  // Jurnal uchun: ideaId → g'oya matni
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
      <PageHead title="📊 Natijalarim" sub="O'sishingiz bir joyda" />

      <div className="card">
        <div className="row">
          <div className="brand-logo" style={{ width: 54, height: 54, fontSize: 28 }}>
            {profile.avatar}
          </div>
          <div className="grow">
            <h2 style={{ margin: 0 }}>{profile.name || 'Ismsiz o\'quvchi'}</h2>
            <small>Study Notes'da o'qiydi</small>
          </div>
          <span className="chip chip-amber">🔥 {profile.streak} kun</span>
        </div>

        <div className="grid grid-4 mt">
          <Stat icon="📚" value={library.length} label={`kitob (${finished} tugatilgan)`} />
          <Stat icon="📄" value={chaptersRead} label="bob o'qildi" />
          <Stat icon="🎯" value={quizPct !== null ? `${quizPct}%` : '—'} label={`quiz (${quizCorrect}/${quizTotal})`} />
          <Stat icon="✅" value={applyLog.length} label="marta qo'llandi" />
        </div>
      </div>

      <div className="card mt">
        <div className="card-title">
          <h2>✅ "Men qo'lladim" jurnali</h2>
          <span className="chip chip-green">{applyLog.length} ta</span>
        </div>

        {!applyLog.length ? (
          <EmptyState
            icon="🌍"
            title="Hozircha yo'q"
            text="Kitobdagi qoidani hayotda qo'llaganingizda «Men qo'lladim» tugmasini bosing — shu yerda to'planadi. Platformaning asosiy maqsadi shu!"
            action={
              <Link to="/kutubxona" className="btn btn-primary mt">
                Kitobga o'tish
              </Link>
            }
          />
        ) : (
          <div className="stack">
            {applyLog.map((e) => (
              <div key={e.id} className="row" style={{ alignItems: 'flex-start' }}>
                <span className="chip">{e.date.slice(5)}</span>
                <div className="grow">
                  <div style={{ fontSize: 14.5 }}>{ideaText(e.book, e.ideaId)}</div>
                  <small>
                    {library.find((b) => b.meta.slug === e.book)?.meta.title ?? e.book}
                    {e.context ? ` · ${e.context}` : ''}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card mt">
        <h3>📈 Keyingi qadam</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Har kuni bitta vaziyatda qo'llash — oyiga ~30 ta qoida hayotga o'tadi. Bugun
          boshlashingiz mumkin:
        </p>
        <div className="row wrap">
          <Link to="/takrorlash" className="btn btn-primary">
            🔁 Takrorlashni boshlash
          </Link>
          <Link to="/kutubxona" className="btn">
            📚 Yangi kitob o'qish
          </Link>
        </div>
      </div>
    </>
  )
}
