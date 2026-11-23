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
} from '../components/icons'
import { IconList } from '../components/icons'
import { IconCircleCheck, IconGrid, IconInfo, IconLayers } from '../components/nx/icons'
import { Bar, ConfirmModal, Empty, SectionHead, Stat, useToast } from '../components/nx/NxUI'

type Filter = 'all' | 'reading' | 'done' | 'pending'
type View = 'grid' | 'list'

const ACCEPT = '.md,.txt,.markdown,.mdx'
const SUPPORTED = ['md', 'txt', 'markdown', 'mdx']
const COVERS = [
  ['#2e3a8c', '#4453a8'], // deep indigo
  ['#3b5170', '#4e6789'], // steel
  ['#46586e', '#5a6f88'], // slate
  ['#2c5c5c', '#3e7474'], // muted teal-navy
  ['#46589c', '#5869ac'], // soft periwinkle
  ['#3a4252', '#4e586c'], // graphite
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
  const [importProgress, setImportProgress] = useState<{ done: number; total: number } | null>(null)
  const [removeSlug, setRemoveSlug] = useState<string | null>(null)
  const { show, toast: toastNode } = useToast()

  // Yagona, klaviatura bilan ishlaydigan fayl tanlash nuqtasi.
  const openPicker = () => {
    if (busy) return
    fileRef.current?.click()
  }

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
    setImportProgress({ done: 0, total: list.length })
    let added = 0
    const errors: string[] = []

    for (let i = 0; i < list.length; i++) {
      const file = list[i]
      setImportProgress({ done: i, total: list.length })
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (!SUPPORTED.includes(ext)) {
        errors.push(`${file.name}: faqat .md, .markdown, .mdx yoki .txt`)
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
    setImportProgress(null)
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
          <button type="button" className="nx-btn nx-btn--primary nx-btn--lg" onClick={openPicker}>
            <IconPlus size={18} /> Kitob qo'shish
          </button>
        </div>
      </header>

      <section className="nx-grid nx-grid--4 nx-library-stats">
        <Stat label="Jami kitoblar" value={counts.all} icon={<IconBookOpen size={18} />} />
        <Stat label="O'qilmoqda" value={counts.reading} tone="accent" icon={<IconClock size={18} />} />
        <Stat label="Tugatilgan" value={counts.done} tone="success" icon={<IconCheck size={18} />} />
        <Stat label="Tahlil kutyapti" value={counts.pending} tone="warn" icon={<IconSparkles size={18} />} />
      </section>

      <section className="nx-dropzone-wrapper">
        <div
          className={`nx-dropzone${over ? ' is-over' : ''}${busy ? ' is-busy' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Kitob fayllarini qo'shish"
          aria-describedby="nx-dropzone-note"
          aria-busy={busy}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openPicker()
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
          <div className="nx-dropzone__copy">
            <b>
              {busy && importProgress
                ? `Fayllar o'qilmoqda… ${importProgress.done}/${importProgress.total}`
                : 'Kitoblarni bu yerga tashlang'}
            </b>
            <span>Bir nechta faylni bir vaqtning o‘zida qo‘shishingiz mumkin · .md, .txt</span>
          </div>
          <span className="nx-btn nx-btn--ghost nx-dropzone__pick" aria-hidden="true" onClick={openPicker}>
            Fayl tanlash
          </span>
          {busy && importProgress && (
            <span className="nx-dropzone__progress" aria-hidden="true">
              <span style={{ width: `${(importProgress.done / importProgress.total) * 100}%` }} />
            </span>
          )}
        </div>
        <p className="nx-hint nx-dropzone__note" id="nx-dropzone-note">
          <IconInfo size={14} /> PDF va EPUB konvertatsiyasi keyingi bosqichda. Matnli fayllar eng yaxshi natija beradi.
        </p>
        <p className="nx-library__sr-only" role="status" aria-live="polite">
          {busy && importProgress ? `${importProgress.done} / ${importProgress.total} fayl o'qilmoqda` : ''}
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
              <div className="nx-segmented nx-library__view" role="group" aria-label="Ko'rinish">
                <button
                  type="button"
                  aria-pressed={view === 'grid'}
                  aria-label="Panellar ko'rinishi"
                  onClick={() => setView('grid')}
                  title="Panellar"
                >
                  <IconGrid size={16} />
                </button>
                <button
                  type="button"
                  aria-pressed={view === 'list'}
                  aria-label="Ro'yxat ko'rinishi"
                  onClick={() => setView('list')}
                  title="Ro'yxat"
                >
                  <IconList size={16} />
                </button>
              </div>
            </div>
          }
        />

        <div className="nx-filter-row nx-segmented" role="group" aria-label="Filtr">
          {filters.map(([key, label]) => (
            <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        <p className="nx-library__sr-only" role="status" aria-live="polite">
          {q || filter !== 'all' ? `${shown.length} ta natija topildi` : ''}
        </p>

        {!shown.length ? (
          <div style={{ marginTop: 24 }}>
            <Empty
              icon={<IconLayers size={24} />}
              title={q ? `«${query.trim()}» topilmadi` : filter === 'all' ? 'Kutubxona bo‘sh' : 'Bu filtrda kitob yo‘q'}
              text={
                q || filter !== 'all'
                  ? 'Boshqa so‘z yoki filtr sinab ko‘ring, yoki yangi kitob qo‘shing.'
                  : 'Birinchi kitobni qo‘shing — keyin AI uni bobma-bob tahlil qiladi.'
              }
              action={
                <div className="nx-row nx-library__empty-actions">
                  {q || filter !== 'all' ? (
                    <>
                      <button
                        type="button"
                        className="nx-btn nx-btn--ghost"
                        onClick={() => {
                          setQuery('')
                          setFilter('all')
                        }}
                      >
                        Filterni tozalash
                      </button>
                      <button type="button" className="nx-btn nx-btn--soft" onClick={openPicker}>
                        <IconPlus size={16} /> Kitob qo'shish
                      </button>
                    </>
                  ) : (
                    <button type="button" className="nx-btn nx-btn--primary" onClick={openPicker}>
                      <IconPlus size={16} /> Birinchi kitobni qo'shish
                    </button>
                  )}
                </div>
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
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      nav(`/kitob/${b.meta.slug}`)
                    }
                  }}
                >
                  <div className="nx-book-cover" style={{ background: `linear-gradient(150deg, ${c1}, ${c2})` }}>
                    <span className="nx-book-cover__title">{b.meta.title}</span>
                    <span className="nx-book-cover__author">{b.meta.author ?? 'Study Notes'}</span>
                    <span className="nx-book-cover__mark">SN</span>
                    <button
                      type="button"
                      className="nx-book-cover__del"
                      aria-label={`«${b.meta.title}» kitobini o'chirish`}
                      title="O'chirish"
                      onClick={(e) => {
                        e.stopPropagation()
                        setRemoveSlug(b.meta.slug)
                      }}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                  <div className="nx-book-card__body">
                    <div className="nx-book-card__meta">
                      <span className={`nx-chip ${b.analysis ? 'nx-chip--success' : b.meta.status === 'partial' ? 'nx-chip--warn' : 'nx-chip--accent'}`}>
                        {b.analysis ? <><IconCircleCheck size={14} /> tahlil tayyor</> : b.meta.status === 'partial' ? 'qisman tahlil' : 'tahlil kutilmoqda'}
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
            <button type="button" className="nx-book-add" onClick={openPicker}>
              <span className="nx-book-add__icon"><IconPlus size={24} /></span>
              <b>Yana kitob qo'shish</b>
              <small>.md yoki .txt faylni tanlang</small>
            </button>
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
