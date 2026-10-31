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
import { EmptyState, PageHead, ProgressBar } from '../components/ui'

type Filter = 'all' | 'reading' | 'done'

const ACCEPT = '.md,.txt,.markdown'
const NOT_READY = ['pdf', 'epub']

export default function Library() {
  const { library, addBook, removeBook } = useApp()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [over, setOver] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const importFiles = async (files: FileList | File[] | null) => {
    if (!files || !files.length) return
    const file = files[0]
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

    if (NOT_READY.includes(ext)) {
      showToast(`⚠️ ${ext.toUpperCase()} — konvertatsiya keyingi bosqichda. Hozircha .md yoki .txt fayl yuklang.`)
      return
    }
    if (!['md', 'txt', 'markdown'].includes(ext)) {
      showToast('Noto\'g\'ri format — .md yoki .txt fayl kerak.')
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
    showToast(`✅ «${baseTitle}» qo'shildi — endi AI tahlilini boshlang`)
    nav(`/kitob/${slug}`)
  }

  const shown = library.filter((b) => {
    if (filter === 'reading') return b.progress.percent > 0 && b.progress.percent < 100
    if (filter === 'done') return b.progress.percent >= 100
    return true
  })

  return (
    <>
      <PageHead
        title="📚 Kutubxonam"
        sub={`${library.length} ta kitob`}
        right={
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            + Kitob qo'shish
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

      <div
        className={`dropzone${over ? ' over' : ''} mb`}
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
      >
        📥 Faylni shu yerga sudrab tashlang <b>.md / .txt</b> — yoki bosib tanlang
        <div className="hint">PDF/EPUB konvertatsiyasi keyingi bosqichda</div>
      </div>

      <div className="tabs">
        {(
          [
            ['all', `Barchasi (${library.length})`],
            ['reading', "O'qilmoqda"],
            ['done', 'Tugatilgan'],
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

      {!shown.length ? (
        <EmptyState
          icon="📖"
          title={filter === 'all' ? "Kutubxona bo'sh" : "Bu filtrda kitob yo'q"}
          text={filter === 'all' ? 'Birinchi kitobni yuklang — 5 daqiqada tahlil tayyor bo\'ladi.' : undefined}
        />
      ) : (
        <div className="grid grid-3">
          {shown.map((b) => (
            <div
              key={b.meta.slug}
              className="book-card"
              role="link"
              tabIndex={0}
              onClick={() => nav(`/kitob/${b.meta.slug}`)}
              onKeyDown={(e) => e.key === 'Enter' && nav(`/kitob/${b.meta.slug}`)}
            >
              <div className="row-between">
                <span className="book-cover">
                  {b.progress.percent >= 100 ? '📗' : b.analysis ? '📕' : '📘'}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  title="O'chirish"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`«${b.meta.title}» o'chirilsinmi?`)) removeBook(b.meta.slug)
                  }}
                >
                  🗑
                </button>
              </div>
              <h3>{b.meta.title}</h3>
              <span className="author">{b.meta.author ?? `${b.meta.chapters} ta bob`}</span>
              <div className="row" style={{ gap: 8 }}>
                <span
                  className={`chip ${
                    b.analysis ? 'chip-green' : b.meta.status === 'partial' ? 'chip-amber' : ''
                  }`}
                >
                  {b.analysis
                    ? '✅ tahlil tayyor'
                    : b.meta.status === 'analyzing'
                      ? '⏳ tahlil...'
                      : b.meta.status === 'partial'
                        ? '⚠️ qisman'
                        : '🤖 AI tahlili kutilmoqda'}
                </span>
              </div>
              <ProgressBar value={b.progress.percent} />
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
