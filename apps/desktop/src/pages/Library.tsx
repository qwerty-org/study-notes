import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  emptyProgress,
  slugify,
  splitChapters,
  titleFromContent,
  type BookRecord,
} from '@study-notes/core'
import { useApp } from '../store/AppStore'
import {
  IconBookOpen,
  IconCheck,
  IconClock,
  IconPlus,
  IconSearch,
  IconSparkles,
  IconTrash,
  IconUpload,
} from '../components/icons'
import { IconList } from '../components/icons'
import { IconCircleCheck, IconGrid, IconInfo, IconLayers } from '../components/nx/icons'
import { Bar, ConfirmModal, Empty, SectionHead, Stat, useToast } from '../components/nx/NxUI'

type Filter = 'all' | 'reading' | 'done' | 'pending'
type View = 'grid' | 'list'

const ACCEPT = '.md,.txt,.markdown,.mdx'
const SUPPORTED = ['md', 'txt', 'markdown', 'mdx']
const COVERS = [
  ['#8d3f24', '#d98a4e'],
  ['#2f5d55', '#7fae9a'],
  ['#4b4260', '#9788ae'],
  ['#7a5220', '#c9a25e'],
  ['#6b2f3a', '#b97277'],
  ['#34506b', '#7d9cbd'],
]

function coverColors(title: string) {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0
  return COVERS[Math.abs(h) % COVERS.length]
}

/** Kutubxona: qidiruv, filtr, ko'p fayl import, kitob javoni. */
export default function Library() {
  const { library, addBook, removeBook } = useApp()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('grid')
  const [query, setQuery] = useState('')
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [removeSlug, setRemoveSlug] = useState<string | null>(null)
  const { show, toast: toastNode } = useToast()

  const counts = useMemo(
    () => ({
      all: library.length,
      reading: library.filter((b) => b.progress.percent > 0 && b.progress.percent < 100).length,
      done: library.filter((b) => b.progress.percent >= 100).length,
      pending: library.filter((b) => !b.analysis).length,
    }),
    [library],
  )

  const importFiles = async (files: FileList | File[] | null) => {
    const list = files ? Array.from(files) : []
    if (!list.length) return
    setBusy(true)
    let added = 0
    const errors: string[] = []

    for (const file of list) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (!SUPPORTED.includes(ext)) {
        errors.push(`${file.name}: faqat .md yoki .txt`)
        continue
      }
      try {
        const text = await file.text()
        if (!text.trim()) {
          errors.push(`${file.name}: fayl bo'sh`)
          continue
        }
        const baseTitle = titleFromContent(text, file.name.replace(/\.[^.]+$/, ''))
        let slug = slugify(baseTitle)
        let n = 2
        while (library.some((b) => b.meta.slug === slug) || slug === 'kitob') slug = `${slugify(baseTitle)}-${n++}`

        const record: BookRecord = {
          meta: {
            slug,
            title: baseTitle,
            sourceFormat: ext === 'md' || ext === 'mdx' ? 'md' : 'txt',
            chapters: splitChapters(text).length,
            status: 'imported',
            addedAt: new Date().toISOString(),
          },
          content: text,
          progress: emptyProgress(),
        }
        addBook(record)
        added++
        if (added === 1 && list.length === 1) nav(`/kitob/${slug}`)
      } catch {
        errors.push(`${file.name}: o'qib bo'lmadi`)
      }
    }

    setBusy(false)
    if (added) show(`${added} ta kitob qo'shildi · AI tahlilni kitob sahifasida boshlang`)
    if (errors.length) show(errors[0])
  }

  const q = query.trim().toLowerCase()
  const shown = library
    .filter((b) => {
      if (filter === 'reading') return b.progress.percent > 0 && b.progress.percent < 100
      if (filter === 'done') return b.progress.percent >= 100
      if (filter === 'pending') return !b.analysis
      return true
    })
    .filter((b) => !q || b.meta.title.toLowerCase().includes(q) || (b.meta.author ?? '').toLowerCase().includes(q))

  const filters: [Filter, string][] = [
    ['all', `Barchasi · ${counts.all}`],
    ['reading', `O'qilmoqda · ${counts.reading}`],
    ['done', `Tugatilgan · ${counts.done}`],
    ['pending', `Tahlil kutyapti · ${counts.pending}`],
  ]

  return (
    <div className="nx-page nx-page--wide nx-library">
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          void importFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <header className="nx-head">
        <div>
          <span className="nx-eyebrow">Shaxsiy to'plam</span>
          <h1 className="nx-title">Kutubxonang</h1>
          <p className="nx-subtitle">
            Kitob qo'shing, AI tahlil qiling va bilimni hayotda qo'llang. Hamma ma'lumot shu qurilmada.
          </p>
        </div>
        <div className="nx-head__actions">
          <button className="nx-btn nx-btn--primary nx-btn--lg" onClick={() => fileRef.current?.click()}>
            <IconPlus size={18} /> Kitob qo'shish
          </button>
        </div>
      </header>

      <section className="nx-grid nx-grid--4 nx-library-stats">
        <Stat label="Jami kitoblar" value={counts.all} icon={<IconBookOpen size={17} />} />
        <Stat label="O'qilmoqda" value={counts.reading} tone="accent" icon={<IconClock size={17} />} />
        <Stat label="Tugatilgan" value={counts.done} tone="success" icon={<IconCheck size={17} />} />
        <Stat label="Tahlil kutyapti" value={counts.pending} tone="warn" icon={<IconSparkles size={17} />} />
      </section>

      <section className="nx-dropzone-wrapper">
        <div
          className={`nx-dropzone${over ? ' is-over' : ''}${busy ? ' is-busy' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Kitob fayllarini qo'shish"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileRef.current?.click()
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            void importFiles(e.dataTransfer.files)
          }}
        >
          <div className="nx-dropzone__icon"><IconUpload size={24} /></div>
          <div className="nx-dropzone__copy">
            <b>{busy ? 'Fayllar o‘qilmoqda…' : 'Kitoblarni bu yerga tashlang'}</b>
            <span>Bir nechta faylni bir vaqtning o‘zida qo‘shishingiz mumkin · .md, .txt</span>
          </div>
          <button className="nx-btn nx-btn--ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
            Fayl tanlash
          </button>
        </div>
        <p className="nx-hint nx-dropzone__note">
          <IconInfo size={13} /> PDF va EPUB konvertatsiyasi keyingi bosqichda. Matnli fayllar eng yaxshi natija beradi.
        </p>
      </section>

      <section className="nx-library-content">
        <SectionHead
          title="Kitoblar"
          hint={q || filter !== 'all' ? `${shown.length} ta natija topildi` : undefined}
          action={
            <div className="nx-row" style={{ gap: 8 }}>
              <div className="nx-input-wrap nx-search-wrap">
                <IconSearch size={16} />
                <input
                  className="nx-input nx-input--with-icon"
                  placeholder="Sarlavha yoki muallif…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Kutubxonada qidirish"
                />
              </div>
              <div className="nx-segmented" aria-label="Ko'rinish">
                <button aria-pressed={view === 'grid'} onClick={() => setView('grid')} title="Panellar">
                  <IconGrid size={15} />
                </button>
                <button aria-pressed={view === 'list'} onClick={() => setView('list')} title="Ro'yxat">
                  <IconList size={15} />
                </button>
              </div>
            </div>
          }
        />

        <div className="nx-filter-row nx-segmented" role="group" aria-label="Filtr">
          {filters.map(([key, label]) => (
            <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        {!shown.length ? (
          <div style={{ marginTop: 22 }}>
            <Empty
              icon={<IconLayers size={27} />}
              title={q ? `«${query.trim()}» topilmadi` : filter === 'all' ? 'Kutubxona bo‘sh' : 'Bu filtrda kitob yo‘q'}
              text={
                q || filter !== 'all'
                  ? 'Boshqa so‘z yoki filtr sinab ko‘ring.'
                  : 'Birinchi kitobni qo‘shing — keyin AI uni bobma-bob tahlil qiladi.'
              }
              action={
                q || filter !== 'all' ? (
                  <button
                    className="nx-btn nx-btn--ghost"
                    onClick={() => {
                      setQuery('')
                      setFilter('all')
                    }}
                  >
                    Filterni tozalash
                  </button>
                ) : (
                  <button className="nx-btn nx-btn--primary" onClick={() => fileRef.current?.click()}>
                    <IconPlus size={16} /> Birinchi kitobni qo'shish
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className={`nx-book-grid ${view === 'list' ? 'nx-book-grid--list' : ''}`}>
            {shown.map((b) => {
              const [c1, c2] = coverColors(b.meta.title)
              return (
                <article
                  key={b.meta.slug}
                  className="nx-book-card"
                  role="link"
                  tabIndex={0}
                  onClick={() => nav(`/kitob/${b.meta.slug}`)}
                  onKeyDown={(e) => e.key === 'Enter' && nav(`/kitob/${b.meta.slug}`)}
                >
                  <div className="nx-book-cover" style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}>
                    <span className="nx-book-cover__line" />
                    <span className="nx-book-cover__title">{b.meta.title}</span>
                    <span className="nx-book-cover__author">{b.meta.author ?? 'Study Notes'}</span>
                    <span className="nx-book-cover__mark">SN</span>
                    <button
                      className="nx-book-cover__del"
                      aria-label="Kitobni o'chirish"
                      title="O'chirish"
                      onClick={(e) => {
                        e.stopPropagation()
                        setRemoveSlug(b.meta.slug)
                      }}
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                  <div className="nx-book-card__body">
                    <div className="nx-book-card__meta">
                      <span className={`nx-chip ${b.analysis ? 'nx-chip--success' : b.meta.status === 'partial' ? 'nx-chip--warn' : 'nx-chip--accent'}`}>
                        {b.analysis ? <><IconCircleCheck size={11} /> tahlil tayyor</> : b.meta.status === 'partial' ? 'qisman tahlil' : 'tahlil kutilmoqda'}
                      </span>
                      <span className="nx-chip nx-chip--outline">{b.meta.chapters} bob</span>
                    </div>
                    <h3 className="nx-h3 nx-book-card__title">{b.meta.title}</h3>
                    <p className="nx-hint nx-book-card__author">{b.meta.author ?? 'Muallif ko‘rsatilmagan'}</p>
                    <div className="nx-book-card__progress">
                      <Bar value={b.progress.percent} />
                      <span className="nx-mono-num">{b.progress.percent}%</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {removeSlug && (
        <ConfirmModal
          title="Kitobni o'chirish"
          text={`«${library.find((b) => b.meta.slug === removeSlug)?.meta.title}» va uning tahlili butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
          confirmLabel="O'chirish"
          danger
          onClose={() => setRemoveSlug(null)}
          onConfirm={() => {
            removeBook(removeSlug)
            setRemoveSlug(null)
            show('Kitob o‘chirildi')
          }}
        />
      )}
      {toastNode}
    </div>
  )
}
