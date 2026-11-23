import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addLocalDays, dueReviews, localDay } from '@study-notes/core'
import { PROVIDERS } from '@study-notes/ai'
import { useApp } from '../store/AppStore'
import { Cover, EmptyState, ProgressBar, Ring, Stat } from '../components/ui'
import {
  IconArrowRight,
  IconBookOpen,
  IconCheck,
  IconChevronRight,
  IconLibrary,
  IconLightbulb,
  IconRepeat,
  IconSparkles,
  IconTarget,
  IconUpload,
} from '../components/icons'

/**
 * Bosh sahifa — professional bloklar:
 * Hero → (Bugungi reja · Tezkor amallar · Ko'rsatkichlar) →
 * (Davom ettirish · Bugungi vaziyat · Kutubxonam) | (AI holati · Oxirgi faoliyat)
 */
export default function Dashboard() {
  const { profile, ai, library, reviews, applyLog } = useApp()
  const due = dueReviews(reviews).length
  const [revealed, setRevealed] = useState<string | null>(null)

  const current =
    library.find((b) => b.progress.percent > 0 && b.progress.percent < 100) ??
    library.find((b) => !b.analysis) ??
    library[0]

  const todayApplied = applyLog.filter((e) => e.date === today()).length
  const quizCorrect = library.reduce((s, b) => s + (b.progress?.quizCorrect ?? 0), 0)
  const quizTotal = library.reduce((s, b) => s + (b.progress?.quizTotal ?? 0), 0)
  const quizPct = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null
  const chaptersRead = library.reduce((s, b) => s + b.progress.readChapters.length, 0)

  const pending = library.filter((b) => !b.analysis)
  const scenarioBook = library.find((b) =>
    b.analysis?.scenarios.some(
      (s) => !applyLog.some((e) => e.ideaId === s.ideaId && e.date === today()),
    ),
  )
  const todayScenario = scenarioBook?.analysis?.scenarios.find(
    (s) => !applyLog.some((e) => e.ideaId === s.ideaId && e.date === today()),
  )

  const provider = PROVIDERS.find((p) => p.id === ai.provider)!
  const aiReady = !provider.needsKey || Boolean(ai.apiKey)

  /* --- Bugungi reja (checklist) --- */
  const todos = [
    {
      to: current ? `/kitob/${current.meta.slug}?tab=read` : '/kutubxona',
      icon: <IconLibrary size={18} />,
      tone: '',
      title: "Kitobni o'qish",
      sub: current
        ? current.progress.percent > 0
          ? `${current.meta.title} — ${current.progress.percent}%`
          : `${current.meta.title} — boshlanmagan`
        : "Kutubxonada kitob yo'q",
      done: (current?.progress.percent ?? 0) > 0,
    },
    {
      to: '/takrorlash',
      icon: <IconRepeat size={18} />,
      tone: 'green',
      title: 'Takrorlash',
      sub: due > 0 ? `${due} ta savol kutyapti — 2-5 daqiqa` : "Bugungi takrorlash bajarildi",
      done: reviews.length > 0 && due === 0,
    },
    {
      to: scenarioBook ? `/kitob/${scenarioBook.meta.slug}?tab=apply` : '/kutubxona',
      icon: <IconLightbulb size={18} />,
      tone: 'yellow',
      title: 'Hayotda qo\'llash',
      sub: todayApplied > 0 ? `Bugun ${todayApplied} ta qoida qo'llandi` : 'Bitta qoidani sinab ko\'ring',
      done: todayApplied > 0,
    },
  ]
  const todoDone = todos.filter((t) => t.done).length

  /* --- Tezkor amallar --- */
  const actions = [
    {
      to: '/kutubxona',
      icon: <IconUpload size={20} />,
      tone: 'blue',
      title: "Kitob qo'shish",
      sub: 'PDF, EPUB yoki matn',
    },
    {
      to: '/takrorlash',
      icon: <IconRepeat size={20} />,
      tone: '',
      title: 'Takrorlash',
      sub: due > 0 ? `${due} ta savol` : 'Barchasi bajarildi',
    },
    current
      ? {
          to: `/kitob/${current.meta.slug}?tab=quiz`,
          icon: <IconTarget size={20} />,
          tone: 'yellow',
          title: 'Quiz ishlash',
          sub: quizPct !== null ? `O'rtacha ${quizPct}%` : 'Birinchi savolni boshlang',
        }
      : {
          to: '/kutubxona',
          icon: <IconTarget size={20} />,
          tone: 'yellow',
          title: 'Quiz ishlash',
          sub: "Avval kitob qo'shing",
        },
    pending.length
      ? {
          to: `/kitob/${pending[0].meta.slug}`,
          icon: <IconSparkles size={20} />,
          tone: 'purple',
          title: 'AI tahlil',
          sub: `${pending.length} ta kitob kutyapti`,
        }
      : scenarioBook
        ? {
            to: `/kitob/${scenarioBook.meta.slug}?tab=apply`,
            icon: <IconSparkles size={20} />,
            tone: 'purple',
            title: 'Vaziyatni sinash',
            sub: 'Yangi senariy tayyor',
          }
        : {
            to: '/kutubxona',
            icon: <IconSparkles size={20} />,
            tone: 'purple',
            title: 'AI imkoniyatlari',
            sub: 'Tahlil, quiz, senariylar',
          },
  ]

  /* --- Oxirgi faoliyat --- */
  const recent = [...applyLog].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <>
      <div className="hero">
        <div className="profile-col">
          <span className="big-avatar" aria-hidden>
            {profile.avatar}
          </span>
          <div className="info" style={{ minWidth: 0 }}>
            <h1>
              Salom, {profile.name || "o'quvchi"}
            </h1>
            <small style={{ display: 'block', marginTop: 4 }}>
              {due
                ? `Bugun uchun ${due} ta takrorlash savoli tayyor — 2-5 daqiqa yetarli.`
                : "Bugun takrorlash yo'q. Kitobni o'qishni davom ettiring yoki qoidani hayotda qo'llang."}
            </small>
            <div className="row wrap" style={{ gap: 8 }}>
              <span className="chip chip-amber">{profile.streak} kunlik streak</span>
              <span className="chip chip-green">{chaptersRead} ta bob o'qildi</span>
              <span className="chip chip-primary">
                {quizPct !== null ? `Quiz ${quizPct}%` : 'Quiz boshlanmagan'}
              </span>
            </div>
          </div>
        </div>
        <div className="hero-goal">
          <div
            role="progressbar"
            aria-valuenow={current?.progress.percent ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${current?.meta.title ?? 'Joriy kitob'} progressi`}
          >
            <Ring
              value={current?.progress.percent ?? 0}
              size={80}
              label={`${current?.progress.percent ?? 0}%`}
            />
          </div>
          <small>joriy kitob progressi</small>
        </div>
      </div>

      {!library.length ? (
        <EmptyState
          icon={<IconLibrary size={24} />}
          title="Kutubxonangiz bo'sh"
          text="Birinchi kitobni yuklang — AI uni tahlil qilib, xulosalar va quizlar yaratadi."
          action={
            <Link to="/kutubxona" className="btn btn-primary mt">
              Kitob qo'shish
            </Link>
          }
        />
      ) : (
        <>
          {/* ---- Yuqori qator: reja · amallar · ko'rsatkichlar ---- */}
          <div className="grid grid-fit">
            <div className="card">
              <div className="section-head">
                <div>
                  <span className="nx-eyebrow">Kunlik halqa</span>
                  <h3 style={{ marginTop: 4 }}>Bugungi reja</h3>
                </div>
                <span
                  className={`chip ${todoDone === todos.length ? 'chip-green' : 'chip-primary'}`}
                  role="img"
                  aria-label={`Bugungi halqa: ${todoDone} dan ${todos.length} bajarildi`}
                >
                  {todoDone}/{todos.length} bajarildi
                </span>
              </div>
              <p className="hint mt-0 mb">O'qish → takrorlash → qo'llash — har kuni uch qadam.</p>
              <div className="todo">
                {todos.map((t) => (
                  <Link key={t.title} to={t.to} className={`todo-row${t.done ? ' done' : ''}`}>
                    <span className={`t-icon ${t.tone}`} aria-hidden>{t.icon}</span>
                    <span className="t-body">
                      <b>{t.title}</b>
                      <small>{t.sub}</small>
                    </span>
                    <span
                      className="t-check"
                      role="img"
                      aria-label={t.done ? 'Bajarildi' : 'Hali bajarilmagan'}
                    >
                      <IconCheck size={14} strokeWidth={2.6} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-head">
                <h3>Tezkor amallar</h3>
              </div>
              <div className="qactions">
                {actions.map((a) => (
                  <Link key={a.title} to={a.to} className="qaction">
                    <span className={`qicon ${a.tone}`} aria-hidden>{a.icon}</span>
                    <b>{a.title}</b>
                    <small>{a.sub}</small>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-head">
                <h3>Umumiy ko'rsatkichlar</h3>
                <Link to="/natijalar" className="chip">
                  Batafsil <IconChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-2">
                <Stat value={library.length} label="kitob" icon={<IconLibrary size={18} />} />
                <Stat value={chaptersRead} label="bob o'qildi" icon={<IconBookOpen size={18} />} />
                <Stat
                  value={quizPct !== null ? `${quizPct}%` : '0%'}
                  label="quiz o'rtachasi"
                  icon={<IconTarget size={18} />}
                />
                <Stat value={applyLog.length} label="qo'llanma" icon={<IconCheck size={18} />} />
              </div>
            </div>
          </div>

          {/* ---- Asosiy qator: chap (o'qish) · o'ng (holat) ---- */}
          <div className="split">
            <div className="stack" style={{ gap: 16 }}>
              {current && (
                <div className="card">
                  <div className="section-head">
                    <span className="chip chip-primary">Davom ettirish</span>
                  </div>
                  <div className="row" style={{ alignItems: 'flex-start' }}>
                    <Cover title={current.meta.title} variant="sm" />
                    <div className="grow">
                      <h2 style={{ fontSize: 18 }}>{current.meta.title}</h2>
                      <small>{current.meta.author ?? `${current.meta.chapters} ta bob`}</small>
                    </div>
                  </div>
                  <div
                    className="mt mb"
                    role="progressbar"
                    aria-valuenow={current.progress.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${current.meta.title} progressi`}
                  >
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
                        <IconSparkles size={18} /> AI tahlilini boshlash
                      </Link>
                    )}
                  </div>
                </div>
              )}

                <div className="card">
                  <div className="section-head">
                    <h3>Bugungi vaziyat</h3>
                    <span className={`chip ${todayScenario ? 'chip-amber' : 'chip-green'}`}>
                      {todayScenario ? 'sinab ko\'ring' : 'bajarildi'}
                    </span>
                  </div>
                {todayScenario ? (
                  <div className="stack">
                    <p className="situation" style={{ fontSize: 16, lineHeight: 1.5 }}>
                      {todayScenario.situation}
                    </p>
                    {revealed === todayScenario.id ? (
                      <div className="reveal-box">
                        <b>To'g'ri harakat</b>
                        {todayScenario.rightAction}
                      </div>
                    ) : (
                      <button
                        className="btn btn-block"
                        onClick={() => setRevealed(todayScenario.id)}
                      >
                        O'z javobimni topaman
                      </button>
                    )}
                    <Link
                      to={`/kitob/${scenarioBook!.meta.slug}?tab=apply`}
                      className="btn btn-ghost btn-block"
                      style={{ color: 'var(--pm-ink-3)' }}
                    >
                      Barcha vaziyatlar <IconChevronRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="stack">
                    <p className="hint mt-0">
                      {library.some((b) => b.analysis?.scenarios.length)
                        ? "Barcha vaziyatlar bugun qo'llandi — barakalla! Ertaga yangilari paydo bo'ladi."
                        : "Tahlil tayyor bo'lgach, «Hayotda qo'llash» tabida real vaziyatlar paydo bo'ladi."}
                    </p>
                    <Link
                      to={
                        library.some((b) => b.analysis?.scenarios.length)
                          ? '/natijalar'
                          : current
                            ? `/kitob/${current.meta.slug}`
                            : '/kutubxona'
                      }
                      className="btn btn-ghost btn-sm"
                    >
                      {library.some((b) => b.analysis?.scenarios.length)
                        ? 'Natijalarni ko\'rish'
                        : 'AI tahliliga o\'tish'} <IconChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

                <div className="card">
                  <div className="section-head">
                    <h3>Kutubxonam</h3>
                    <Link to="/kutubxona" className="chip">
                      Barchasi <IconChevronRight size={14} />
                    </Link>
                  </div>
                <div className="stack" style={{ gap: 8 }}>
                  {library.slice(0, 5).map((b) => (
                    <Link key={b.meta.slug} to={`/kitob/${b.meta.slug}`} className="book-row">
                      <Cover title={b.meta.title} variant="inline" />
                      <span className="b-body">
                        <b>{b.meta.title}</b>
                        <small>
                          {b.analysis
                            ? `${b.progress.readChapters.length}/${b.meta.chapters} bob · ${b.progress.percent}%`
                            : 'AI tahlil kutmoqda'}
                        </small>
                      </span>
                      <div
                        role="progressbar"
                        aria-valuenow={b.progress.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${b.meta.title} progressi`}
                        style={{ width: 96, flexShrink: 0 }}
                      >
                        <ProgressBar value={b.progress.percent} />
                      </div>
                      <IconChevronRight size={16} className="row-arrow" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="stack" style={{ gap: 16 }}>
              <div className="card">
                <div className="section-head">
                  <h3>AI holati</h3>
                  <span className={`chip ${aiReady ? 'chip-green' : 'chip-red'}`}>
                    {aiReady ? 'tayyor' : 'sozlanmagan'}
                  </span>
                </div>
                <div className="stack" style={{ gap: 12 }}>
                  <div className="row">
                    <span
                      className="icon pm-ai-icon"
                      style={{ background: 'var(--pm-accent-soft)', color: 'var(--pm-accent)', width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', flexShrink: 0 }}
                    >
                      <IconSparkles size={20} />
                    </span>
                    <div className="grow">
                      <b style={{ display: 'block', fontSize: 14 }}>{provider.name}</b>
                      <small>{aiReady ? ai.model || provider.defaultModel : 'Kalit kiritilmagan'}</small>
                    </div>
                  </div>
                  {pending.length > 0 && (
                    <p className="hint" style={{ marginTop: 0 }}>
                      {pending.length} ta kitob tahlil kutmoqda.
                    </p>
                  )}
                  <Link
                    to={aiReady ? (pending.length ? `/kitob/${pending[0].meta.slug}` : '/sozlamalar') : '/sozlamalar'}
                    className="btn btn-block"
                  >
                    {aiReady
                      ? pending.length
                        ? 'Tahlilni davom ettirish'
                        : 'AI sozlamalari'
                      : "AI ni sozlash"}
                  </Link>
                </div>
              </div>

              <div className="card">
                <div className="section-head">
                  <h3>Oxirgi faoliyat</h3>
                  <span className="chip">
                    {applyLog.length} ta jami
                  </span>
                </div>
                {recent.length ? (
                  <div className="stack" style={{ gap: 8 }}>
                    {recent.map((e) => {
                      const book = library.find((b) => b.meta.slug === e.book)
                      const idea = book?.analysis?.chapters
                        .flatMap((c) => c.keyIdeas)
                        .find((i) => i.id === e.ideaId)
                      return (
                        <div key={e.id} className="book-row journal" style={{ cursor: 'default' }}>
                          <span
                            className="t-icon green"
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 12,
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                              background: 'var(--pm-accent-soft)',
                              color: 'var(--pm-accent)',
                            }}
                          >
                            <IconCheck size={16} strokeWidth={2.4} />
                          </span>
                          <span className="b-body">
                            <b style={{ fontSize: 14 }}>{idea?.idea ?? 'Qoida qo\'llandi'}</b>
                            <small>
                              {book?.meta.title ?? e.book} · {dayLabel(e.date)}
                            </small>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="stack">
                    <p className="hint mt-0">
                      Hozircha yozuv yo'q. «Hayotda qo'llash» bo'limida birinchi qoidani qo'llang — bu yerda paydo bo'ladi.
                    </p>
                    <Link
                      to={scenarioBook ? `/kitob/${scenarioBook.meta.slug}?tab=apply` : '/kutubxona'}
                      className="btn btn-ghost btn-sm"
                    >
                      Qoidani qo'llash <IconChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function today(): string {
  return localDay()
}

function dayLabel(date: string): string {
  const t = today()
  if (date === t) return 'Bugun'
  const y = localDay(addLocalDays(-1))
  if (date === y) return 'Kecha'
  return date.split('-').reverse().slice(0, 2).join('.')
}
