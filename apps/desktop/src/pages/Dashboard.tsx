import { Link } from 'react-router-dom'
import { dueReviews } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { Cover, EmptyState, ProgressBar, Ring, Stat } from '../components/ui'
import {
  IconArrowRight,
  IconFlame,
  IconLibrary,
  IconLightbulb,
  IconRepeat,
  IconTarget,
} from '../components/icons'

export default function Dashboard() {
  const { profile, library, reviews, applyLog } = useApp()
  const due = dueReviews(reviews).length

  const current =
    library.find((b) => b.progress.percent > 0 && b.progress.percent < 100) ??
    library.find((b) => !b.analysis) ??
    library[0]

  const todayApplied = applyLog.filter((e) => e.date === today()).length
  const quizCorrect = library.reduce((s, b) => s + (b.progress?.quizCorrect ?? 0), 0)
  const quizTotal = library.reduce((s, b) => s + (b.progress?.quizTotal ?? 0), 0)
  const quizPct = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null
  const chaptersRead = library.reduce((s, b) => s + b.progress.readChapters.length, 0)

  const scenarioBook = library.find((b) =>
    b.analysis?.scenarios.some(
      (s) => !applyLog.some((e) => e.ideaId === s.ideaId && e.date === today()),
    ),
  )

  return (
    <>
      <div className="hero">
        <div style={{ minWidth: 0 }}>
          <h1>
            Salom, {profile.name || 'o\'quvchi'} {profile.avatar}
          </h1>
          <p>
            {due
              ? `Bugun uchun ${due} ta takrorlash savoli tayyor — 2-5 daqiqa yetarli.`
              : "Bugun takrorlash yo'q. Kitobni o'qishni davom ettiring yoki qoidani hayotda qo'llang."}
          </p>
          <div className="row wrap mt">
            <span className="chip chip-amber">
              <IconFlame size={14} /> {profile.streak} kunlik streak
            </span>
            <span className="chip chip-green">{chaptersRead} ta bob o'qildi</span>
            <span className="chip chip-primary">
              {quizPct !== null ? `Quiz ${quizPct}%` : 'Quiz boshlanmagan'}
            </span>
          </div>
        </div>
        <div className="hero-goal">
          <Ring
            value={current?.progress.percent ?? 0}
            size={92}
            label={`${current?.progress.percent ?? 0}%`}
          />
          <small>o'qish progressi</small>
        </div>
      </div>

      {!library.length ? (
        <EmptyState
          icon={<IconLibrary size={26} />}
          title="Kutubxonangiz bo'sh"
          text="Birinchi kitobni yuklang — AI uni tahlil qilib, xulosalar va quizlar yaratadi."
          action={
            <Link to="/kutubxona" className="btn btn-primary mt">
              Kitob qo'shish
            </Link>
          }
        />
      ) : (
        <div className="split">
          <div className="stack" style={{ gap: 16 }}>
            {current && (
              <div className="card">
                <div className="card-title">
                  <span className="chip chip-primary">Davom ettirish</span>
                  <span className="chip">{current.progress.percent}%</span>
                </div>
                <div className="row" style={{ alignItems: 'flex-start' }}>
                  <Cover title={current.meta.title} variant="sm" />
                  <div className="grow">
                    <h2 style={{ fontSize: 17 }}>{current.meta.title}</h2>
                    <small>{current.meta.author ?? `${current.meta.chapters} ta bob`}</small>
                  </div>
                </div>
                <div className="mt mb">
                  <ProgressBar value={current.progress.percent} />
                </div>
                <div className="stack">
                  <Link
                    to={`/kitob/${current.meta.slug}?tab=read`}
                    className="btn btn-primary btn-lg btn-block"
                  >
                    O'qishni davom ettir <IconArrowRight size={18} />
                  </Link>
                  {!current.analysis && (
                    <Link to={`/kitob/${current.meta.slug}`} className="btn btn-block">
                      AI tahlilini boshlash
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-title">
                <h3>Bugungi takrorlash</h3>
                <span className={`chip ${due ? 'chip-primary' : 'chip-green'}`}>
                  {due ? `${due} ta savol` : 'tayyor'}
                </span>
              </div>
              <p className="hint" style={{ marginTop: 0 }}>
                {due
                  ? "Unutmaslik uchun — 2-5 daqiqa yetarli."
                  : "Bugun takrorlash yo'q. Barakalla."}
              </p>
              <Link to="/takrorlash" className={`btn btn-block${due ? ' btn-primary' : ''}`}>
                <IconRepeat size={17} />
                {due ? 'Boshlash' : 'Jadvalni ko\'rish'}
              </Link>
            </div>

            <div className="card">
              <div className="card-title">
                <h3>Hayotda qo'llash</h3>
                <span className="chip chip-green">{todayApplied} ta</span>
              </div>
              {scenarioBook ? (
                <>
                  <p className="hint" style={{ marginTop: 0 }}>
                    {todayApplied
                      ? 'Yana bitta senariy sinab ko\'ring.'
                      : 'Bitta qoidani real vaziyatda sinab ko\'ring.'}
                  </p>
                  <Link
                    to={`/kitob/${scenarioBook.meta.slug}?tab=apply`}
                    className="btn btn-green btn-block"
                  >
                    <IconLightbulb size={17} />
                    Vaziyatni ko'rish
                  </Link>
                </>
              ) : (
                <p className="hint" style={{ marginTop: 0 }}>
                  Tahlil tayyor bo'lgach, «Hayotda qo'llash» tabida real vaziyatlar paydo bo'ladi.
                </p>
              )}
            </div>
          </div>

          <div className="stack" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-title">
                <h3>Umumiy ko'rsatkichlar</h3>
              </div>
              <div className="grid grid-2">
                <Stat value={library.length} label="kitob" />
                <Stat value={chaptersRead} label="bob o'qildi" />
                <Stat value={quizPct !== null ? `${quizPct}%` : '—'} label="quiz o'rtachasi" />
                <Stat value={applyLog.length} label="qo'llanma" />
              </div>
            </div>

            <div className="card">
              <div className="card-title">
                <h3>Tez amallar</h3>
              </div>
              <div className="stack">
                <Link to="/takrorlash" className="btn btn-block">
                  <IconRepeat size={17} /> Takrorlashni boshlash
                </Link>
                <Link to="/kutubxona" className="btn btn-block">
                  <IconLibrary size={17} /> Kutubxonani ochish
                </Link>
                <Link
                  to="/natijalar"
                  className="btn btn-ghost btn-block"
                  style={{ color: 'var(--muted)' }}
                >
                  <IconTarget size={16} />
                  Natijalarni ko'rish
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}
