import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { EmptyState, PageHead, Stat } from '../components/ui'
import {
  IconCheck,
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

      <div className="card narrow">
        <div className="row">
          <div
            className="cover cover-sm"
            style={{
              background: 'linear-gradient(135deg, var(--accent), #9b7bff)',
              width: 52,
              fontSize: 26,
            }}
          >
            {profile.avatar}
          </div>
          <div className="grow">
            <h2 style={{ fontSize: 17 }}>{profile.name || "Ismsiz o'quvchi"}</h2>
            <small>Study Notes'da o'qiydi</small>
          </div>
          <span className="chip chip-amber">
            <IconFlame size={14} /> {profile.streak} kun
          </span>
        </div>

        <div className="grid grid-4 mt">
          <Stat value={library.length} label={`kitob · ${finished} tugatilgan`} />
          <Stat value={chaptersRead} label="bob o'qildi" />
          <Stat value={quizPct !== null ? `${quizPct}%` : '—'} label="quiz o'rtachasi" />
          <Stat value={applyLog.length} label="qo'llandi" />
        </div>
      </div>

      <div className="card narrow">
        <div className="card-title">
          <h2>«Men qo'lladim» jurnali</h2>
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
          <div className="stack">
            {applyLog.map((e) => (
              <div
                key={e.id}
                className="row"
                style={{ alignItems: 'flex-start', gap: 10 }}
              >
                <span className="chip" style={{ flexShrink: 0 }}>
                  {e.date.slice(5)}
                </span>
                <div className="grow">
                  <div style={{ fontSize: 14, lineHeight: 1.45 }}>{ideaText(e.book, e.ideaId)}</div>
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

      <div className="card narrow">
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
        <div className="row mt" style={{ color: 'var(--green)', fontSize: 13 }}>
          <IconCheck size={15} />
          <span>Bugun kamida bitta qoidani qo'llang</span>
        </div>
      </div>
    </>
  )
}
