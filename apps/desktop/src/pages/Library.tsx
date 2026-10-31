import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  emptyProgress,
  slugify,
  splitChapters,
  titleFromContent,
  type BookRecord,
} from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { Cover, EmptyState, PageHead, ProgressBar } from '../components/ui'
import { IconPlus, IconSparkles, IconTrash, IconUpload } from '../components/icons'

type Filter = 'all' | 'reading' | 'done' | 'pending'

const ACCEPT = '.md,.txt,.markdown'
const NOT_READY = ['pdf', 'epub']

/** Kutubxona — to'liq kenglikdagi professional bloklar */
export default function Library() {
  const { library, addBook, removeBook } = useApp()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [over, setOver] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }

  const importFiles = async (files: FileList | File[] | null) => {
    if (!files || !files.length) return
    const file = files[0]
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

    if (NOT_READY.includes(ext)) {
      showToast(
        `${ext.toUpperCase()} — konvertatsiya keyingi bosqichda. Hozircha .md yoki .txt fayl yuklang.`,
      )
      return
    }
    if (!['md', 'txt', 'markdown'].includes(ext)) {
      showToast("Noto'g'ri format — .md yoki .txt fayl kerak.")
      return
    }

    const text = await file.text()
    const baseTitle = titleFromContent(text, file.name.replace(/\.[^.]+$/, ''))
    let slug = slugify(baseTitle)
    let n = 2
    while (library.some((b) => b.meta.slug === slug)) slug = `${slugify(baseTitle)}-${n++}`

    const record: BookRecord = {
      meta: {
        slug,
        title: baseTitle,
        sourceFormat: ext === 'markdown' ? 'md' : 'txt',
        chapters: splitChapters(text).length,
        status: 'imported',
        addedAt: new Date().toISOString(),
      },
      content: text,
      progress: emptyProgress(),
    }
    addBook(record)
    showToast(`«${baseTitle}» qo'shildi`)
    nav(`/kitob/${slug}`)
  }

  const reading = library.filter((b) => b.progress.percent > 0 && b.progress.percent < 100).length
  const done = library.filter((b) => b.progress.percent >= 100).length
  const pendingN = library.filter((b) => !b.analysis).length

  const shown = library.filter((b) => {
    if (filter === 'reading') return b.progress.percent > 0 && b.progress.percent < 100
    if (filter === 'done') return b.progress.percent >= 100
    if (filter === 'pending') return !b.analysis
    return true
  })

  return (
    <>
      <PageHead
        title="Kutubxonam"
        sub={`${library.length} ta kitob · ${reading} o'qilmoqda · ${done} tugatilgan`}
        right={
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            <IconPlus size={17} /> Kitob qo'shish
          </button>
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => importFiles(e.target.files)}
      />

      <div className="card" style={{ padding: 14 }}>
        <div
          className={`dropzone${over ? ' over' : ''}`}
          style={{ padding: '18px 16px' }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            importFiles(e.dataTransfer.files)
          }}
          role="button"
          tabIndex={0}
        >
          <span className="icon">
            <IconUpload size={20} />
          </span>
          <b>.md / .txt</b> faylni shu yerga sudrab tashlang
          <div className="hint" style={{ marginTop: 4 }}>
            PDF/EPUB konvertatsiyasi keyingi bosqichda
          </div>
        </div>
      </div>

      <div className="row-between wrap">
        <div className="tabs" style={{ flex: '1 1 420px', maxWidth: 560 }}>
          {(
            [
              ['all', `Barchasi (${library.length})`],
              ['reading', "O'qilmoqda"],
              ['done', 'Tugatilgan'],
              ['pending', 'Tahlil kutyapti'],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              className={`tab${filter === key ? ' active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="chip">{shown.length} ta ko'rsatilmoqda</span>
      </div>

      {!shown.length ? (
        <EmptyState
          icon={<IconUpload size={26} />}
          title={filter === 'all' ? "Kutubxona bo'sh" : 'Bu filtrda kitob yo\'q'}
          text={
            filter === 'all'
              ? "Birinchi kitobni yuklang — 5 daqiqada tahlil tayyor bo'ladi."
              : undefined
          }
        />
      ) : (
        <div className="grid grid-2">
          {shown.map((b) => (
            <div
              key={b.meta.slug}
              className="book-card"
              role="link"
              tabIndex={0}
              onClick={() => nav(`/kitob/${b.meta.slug}`)}
              onKeyDown={(e) => e.key === 'Enter' && nav(`/kitob/${b.meta.slug}`)}
            >
              <div className="book-cover">
                <Cover title={b.meta.title} />
                <button
                  className="book-del"
                  title="O'chirish"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`«${b.meta.title}» o'chirilsinmi?`)) removeBook(b.meta.slug)
                  }}
                >
                  <IconTrash size={15} />
                </button>
              </div>
              <h3>{b.meta.title}</h3>
              <span className="author">{b.meta.author ?? `${b.meta.chapters} ta bob`}</span>
              <span
                className={`chip ${
                  b.analysis
                    ? 'chip-green'
                    : b.meta.status === 'partial'
                      ? 'chip-amber'
                      : 'chip-primary'
                }`}
                style={{ alignSelf: 'flex-start' }}
              >
                {b.analysis ? (
                  <>
                    <IconSparkles size={12} /> tahlil tayyor
                  </>
                ) : b.meta.status === 'partial' ? (
                  'qisman tahlil'
                ) : (
                  'AI tahlili kutilmoqda'
                )}
              </span>
              <div className="row-between" style={{ marginTop: 'auto' }}>
                <ProgressBar value={b.progress.percent} style={{ flex: 1 }} />
                <b style={{ fontSize: 13, color: 'var(--muted)', minWidth: 34, textAlign: 'right' }}>
                  {b.progress.percent}%
                </b>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
