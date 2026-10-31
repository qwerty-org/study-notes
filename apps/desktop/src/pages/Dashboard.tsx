import { Link } from 'react-router-dom'
import { dueReviews } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { EmptyState, ProgressBar, Stat } from '../components/ui'

export default function Dashboard() {
  const { profile, library, reviews, applyLog } = useApp()
  const due = dueReviews(reviews).length

  // Davom ettirish uchun: o'qilayotgan → tahlillsiz → birinchi
  const current =
    library.find((b) => b.progress.percent > 0 && b.progress.percent < 100) ??
    library.find((b) => !b.analysis) ??
    library[0]

  const todayApplied = applyLog.filter((e) => e.date === today()).length
  const quizCorrect = library.reduce((s, b) => s + (b.progress?.quizCorrect ?? 0), 0)
  const quizTotal = library.reduce((s, b) => s + (b.progress?.quizTotal ?? 0), 0)
  const quizPct = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null

  // Bugungi qo'llash uchun birinchi ochilmagan senariy
  const scenarioBook = library.find((b) =>
    b.analysis?.scenarios.some((s) => !applyLog.some((e) => e.ideaId === s.ideaId && e.date === today())),
  )

  return (
    <>
      <div className="page-head">
        <div>
          <h1>
            Salom, {profile.name || 'o\'quvchi'}! {profile.avatar}
          </h1>
          <small>Bugun uchun 3 ta qadam: o'qish → takrorlash → qo'llash</small>
        </div>
        <span className="chip chip-amber">🔥 {profile.streak} kun</span>
      </div>

      {!library.length ? (
        <EmptyState
          icon="📚"
          title="Kutubxonangiz bo'sh"
          text="Birinchi kitobni yuklang — AI uni tahlil qilib, xulosalar va quizlar yaratadi."
          action={
            <Link to="/kutubxona" className="btn btn-primary mt">
              + Kitob qo'shish
            </Link>
          }
        />
      ) : (
        <>
          {/* 1 — Davom ettiring */}
          {current && (
            <div className="card">
              <div className="card-title">
                <span className="chip chip-primary">📖 Davom ettiring</span>
                <span className="chip">{current.progress.percent}%</span>
              </div>
              <h2>{current.meta.title}</h2>
              {current.meta.author && <small>{current.meta.author}</small>}
              <div className="mt mb">
                <ProgressBar value={current.progress.percent} />
              </div>
              <div className="row wrap">
                <Link
                  to={`/kitob/${current.meta.slug}?tab=read`}
                  className="btn btn-primary btn-lg"
                >
                  O'qishni davom ettir →
                </Link>
                {!current.analysis && (
                  <Link to={`/kitob/${current.meta.slug}`} className="btn">
                    🤖 AI tahlilini boshlash
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-2 mt">
            {/* 2 — Takrorlash */}
            <div className="card">
              <div className="card-title">
                <h3>🔁 Bugungi takrorlash</h3>
                <span className={`chip ${due ? 'chip-primary' : 'chip-green'}`}>
                  {due ? `${due} ta` : 'tayyor ✓'}
                </span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                {due
                  ? 'Unutmaslik uchun — 2-5 daqiqa yetarli.'
                  : 'Bugun uchun takrorlash yo\'q. Barakalla!'}
              </p>
              <Link to="/takrorlash" className={`btn ${due ? 'btn-primary' : ''}`}>
                {due ? 'Boshlash →' : 'Jadvalni ko\'rish'}
              </Link>
            </div>

            {/* 3 — Bugungi qo'llash */}
            <div className="card">
              <div className="card-title">
                <h3>🌍 Bugungi qo'llash</h3>
                <span className="chip chip-green">{todayApplied} ta</span>
              </div>
              {scenarioBook ? (
                <>
                  <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                    {todayApplied
                      ? 'Yana bitta senariy sinab ko\'ring yoki jurnalni ko\'ring.'
                      : 'Bitta qoidani hayotda sinab ko\'ring — shu yerda vaziyat beriladi.'}
                  </p>
                  <Link to={`/kitob/${scenarioBook.meta.slug}?tab=apply`} className="btn btn-green">
                    Vaziyatni ko'rish →
                  </Link>
                </>
              ) : (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                  Tahlil tayyor bo'lgach, «Hayotda qo'llash» tabida real vaziyatlar paydo bo'ladi.
                </p>
              )}
            </div>
          </div>

          {/* Statistika */}
          <div className="grid grid-4 mt">
            <Stat icon="📚" value={library.length} label="kitob" />
            <Stat icon="⏱️" value={library.reduce((s, b) => s + b.progress.readChapters.length, 0)} label="bob o'qildi" />
            <Stat icon="🎯" value={quizPct !== null ? `${quizPct}%` : '—'} label="quiz o'rtachasi" />
            <Stat icon="✅" value={applyLog.length} label="marta qo'llandi" />
          </div>
        </>
      )}
    </>
  )
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}
