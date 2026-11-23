import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { store, type AIProvider } from '@study-notes/core'
import { complete, PROVIDERS, providerInfo } from '@study-notes/ai'
import { useApp } from '../store/AppStore'
import { ConfirmModal, useToast } from '../components/nx/NxUI'
import { localDay } from '../lib/nxDate'
import {
  IconBookOpen,
  IconCheck,
  IconDownload,
  IconGlobe,
  IconLock,
  IconTrash,
  IconUpload,
} from '../components/icons'
import { IconEye, IconEyeOff, IconInfo, IconMoon, IconRefresh, IconSun } from '../components/nx/icons'

type Section = 'profile' | 'ai' | 'data' | 'about'

const AVATARS = ['🦊', '🐻', '🦉', '🐼', '🐨', '🦁', '🐯', '🐰']

const SECTIONS: { key: Section; label: string; hint: string }[] = [
  { key: 'profile', label: 'Profil va ko‘rinish', hint: 'Ism, mavzu, til' },
  { key: 'ai', label: 'AI ulash', hint: 'Provayder va kalit' },
  { key: 'data', label: 'Ma\'lumotlar', hint: 'Eksport, import' },
  { key: 'about', label: 'Dastur haqida', hint: 'Versiya, litsenziya' },
]

export default function Settings() {
  const { ai, updateAI, profile, updateProfile, onboarding, setOnboarding } = useApp()
  const location = useLocation()
  const [section, setSection] = useState<Section>('profile')
  const [keyVisible, setKeyVisible] = useState(false)
  const [keyDraft, setKeyDraft] = useState(ai.apiKey)
  const [modelDraft, setModelDraft] = useState(ai.model ?? '')
  const [testing, setTesting] = useState(false)
  const [testOk, setTestOk] = useState(false)
  const [testError, setTestError] = useState('')
  const [clearOpen, setClearOpen] = useState(false)
  const [dataMsg, setDataMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const clearTriggerRef = useRef<HTMLButtonElement>(null)
  const modalHostRef = useRef<HTMLDivElement>(null)
  const { show, toast: toastNode } = useToast()

  const reason = (location.state as { reason?: string } | null)?.reason
  const provider = providerInfo(ai.provider)
  const status = testOk ? 'Ulanish tekshirildi' : ai.apiKey.trim() || ai.provider === 'ollama' ? 'Sozlangan' : 'Sozlanmagan'

  /* Tasdiqlash modali: Tab fokusini dialog ichida ushlab turamiz, Escape bilan
     yopamiz va yopilganda fokusni ochgan tugmaga qaytaramiz. (ConfirmModal
     ning o'zi ham Escape'ni boshqaradi — bu qo'shimcha xavfsizlik qatlami.) */
  useEffect(() => {
    if (!clearOpen) return
    const host = modalHostRef.current
    const focusable = () =>
      host
        ? Array.from(
            host.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])'),
          ).filter((el) => !el.hasAttribute('hidden') && el.getClientRects().length > 0)
        : []

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setClearOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusable()
      if (!items.length) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !items.includes(active as HTMLElement))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    // Xavfli tugma avtomatik fokuslanmasin — xavfsiz harakatni tanlaymiz.
    focusable().find((el) => el.textContent?.trim() === 'Bekor qilish')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTriggerRef.current?.focus()
    }
  }, [clearOpen])

  const saveAI = () => {
    updateAI({ provider: ai.provider, apiKey: keyDraft.trim(), model: modelDraft.trim() })
    setTestOk(false)
    setTestError('')
    show('AI sozlamalari saqlandi')
  }

  const testConnection = async () => {
    setTesting(true)
    setTestError('')
    setTestOk(false)
    try {
      await complete(
        { provider: ai.provider, apiKey: keyDraft.trim(), model: modelDraft.trim() },
        'Faqat "OK" deb javob ber.',
        'Test',
      )
      setTestOk(true)
      show('Ulanish muvaffaqiyatli')
    } catch (e) {
      const m = (e as Error).message
      setTestError(
        m.toLowerCase().includes('kalit')
          ? 'API kaliti yaroqsiz yoki kiritilmagan.'
          : m.toLowerCase().includes('ollama')
            ? 'Ollama ishlamayapti. U o‘rnatilgani va ishlab turganini tekshiring.'
            : 'Ulanib bo‘lmadi. Kalitni va internet ulanishini tekshiring.',
      )
    } finally {
      setTesting(false)
    }
  }

  const exportData = () => {
    const blob = new Blob([store.exportAll()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-notes-${localDay()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setDataMsg({ ok: true, text: 'Ma\'lumotlar fayli yuklab olindi.' })
  }

  const importData = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const ok = store.importAll(await file.text())
      setDataMsg(
        ok
          ? { ok: true, text: 'Ma\'lumotlar tiklandi. Ilova qayta ishga tushiriladi…' }
          : { ok: false, text: 'Bu fayl Study Notes eksporti emas.' },
      )
      if (ok) window.setTimeout(() => window.location.reload(), 900)
    } catch {
      setDataMsg({ ok: false, text: 'Fayl o‘qib bo‘lmadi.' })
    }
    e.target.value = ''
  }

  return (
    <div className="nx-page nx-page--wide nx-settings">
      <header className="nx-head">
        <div>
          <span className="nx-eyebrow">Shaxsiy sozlamalar</span>
          <h1 className="nx-title">Sozlamalar</h1>
          <p className="nx-subtitle">Hammasi shu kompyuteringizda saqlanadi — server va hisob kerak emas.</p>
        </div>
      </header>

      {reason && (
        <div className="nx-settings-notice">
          <IconInfo size={18} /> {reason}
        </div>
      )}

      <div className="nx-settings-layout">
        <nav className="nx-settings-nav" aria-label="Sozlamalar bo'limlari">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`nx-settings-nav__item${section === s.key ? ' is-active' : ''}`}
              onClick={() => setSection(s.key)}
              aria-pressed={section === s.key}
            >
              <b>{s.label}</b>
              <small>{s.hint}</small>
            </button>
          ))}
          <div className="nx-settings-nav__foot"><IconLock size={14} /> Ma'lumotlar faqat lokal</div>
        </nav>

        <div className="nx-settings-content">
          {section === 'profile' && (
            <section className="nx-panel">
              <div className="nx-panel__head"><b className="nx-h3">Profil va ko'rinish</b></div>
              <div className="nx-panel__body nx-stack" style={{ gap: 24 }}>
                <div className="nx-field">
                  <label className="nx-label" htmlFor="set-name">Ismingiz</label>
                  <input id="set-name" className="nx-input" value={profile.name}
                    placeholder="Masalan, Aziz" onChange={(e) => updateProfile({ name: e.target.value })} />
                  <span className="nx-hint">Parol yoki hisob kerak emas.</span>
                </div>

                <div className="nx-field">
                  <span className="nx-label">Avatar</span>
                  <div className="nx-avatar-picks">
                    {AVATARS.map((a) => (
                      <button key={a} className={`nx-avatar-pick${profile.avatar === a ? ' is-active' : ''}`}
                        onClick={() => updateProfile({ avatar: a })} aria-label={`Avatar ${a}`} aria-pressed={profile.avatar === a}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="nx-setting-row">
                  <div>
                    <b>Ko'rinish</b>
                    <p className="nx-hint">Kechqurun o'qish uchun tungi rejim qulay.</p>
                  </div>
                  <div className="nx-segmented">
                    <button aria-pressed={profile.theme === 'light'} onClick={() => updateProfile({ theme: 'light' })}>
                      <IconSun size={14} /> Kunduzi
                    </button>
                    <button aria-pressed={profile.theme === 'dark'} onClick={() => updateProfile({ theme: 'dark' })}>
                      <IconMoon size={14} /> Tungi
                    </button>
                  </div>
                </div>

                <div className="nx-setting-row nx-setting-row--muted">
                  <div>
                    <b>Interfeys tili</b>
                    <p className="nx-hint">Hozircha faqat o'zbekcha. Boshqa tillar keyingi bosqichda.</p>
                  </div>
                  <span className="nx-chip nx-chip--outline"><IconGlobe size={14} /> O'zbek</span>
                </div>

                <div className="nx-setting-row nx-setting-row--muted">
                  <div>
                    <b>Takrorlash eslatmasi</b>
                    <p className="nx-hint">Eslatmalar keyingi bosqichda qo'shiladi.</p>
                  </div>
                  <span className="nx-chip nx-chip--outline">Tez orada, soat 20:00</span>
                </div>

                <button className="nx-btn nx-btn--ghost nx-btn--sm" onClick={() => {
                  setOnboarding({ step: 0, done: false })
                  window.location.hash = '#/onboarding'
                }}>
                  <IconRefresh size={14} /> Boshlang'ich sozlamalarni qayta ko'rish
                </button>
              </div>
            </section>
          )}

          {section === 'ai' && (
            <section className="nx-panel">
              <div className="nx-panel__head">
                <b className="nx-h3">AI ulash</b>
                <span className={`nx-chip ${testOk ? 'nx-chip--success' : ai.apiKey || ai.provider === 'ollama' ? 'nx-chip--accent' : ''}`}>
                  {testOk && <IconCheck size={14} />} {status}
                </span>
              </div>
              <div className="nx-panel__body nx-stack" style={{ gap: 24 }}>
                <div className="nx-field">
                  <span className="nx-label">Provayder</span>
                  <div className="nx-provider-grid" role="radiogroup" aria-label="AI provayderi">
                    {PROVIDERS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={ai.provider === p.id}
                        className={`nx-provider${ai.provider === p.id ? ' is-active' : ''}`}
                        onClick={() => {
                          updateAI({ provider: p.id as AIProvider, apiKey: keyDraft, model: '' })
                          setModelDraft('')
                          setTestOk(false)
                        }}
                      >
                        <b>{p.name}</b>
                        <small>{p.freeHint}</small>
                      </button>
                    ))}
                  </div>
                </div>

                {provider.needsKey && (
                  <div className="nx-field">
                    <label className="nx-label" htmlFor="set-key">API kalit</label>
                    <div className="nx-key-wrap">
                      <input id="set-key" className="nx-input" type={keyVisible ? 'text' : 'password'}
                        value={keyDraft} placeholder="AI Studio yoki platforma kaliti"
                        autoComplete="off" spellCheck={false}
                        onChange={(e) => { setKeyDraft(e.target.value); setTestOk(false) }} />
                      <button type="button" className="nx-icon-btn" onClick={() => setKeyVisible((v) => !v)}
                        aria-label={keyVisible ? 'Kalitni yashirish' : 'Kalitni ko‘rsatish'}
                        aria-pressed={keyVisible} aria-controls="set-key">
                        {keyVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      </button>
                    </div>
                    <span className="nx-hint">
                      Kalit faqat shu qurilmada saqlanadi.{' '}
                      {provider.keyUrl && <a href={provider.keyUrl} target="_blank" rel="noreferrer">Kalitni qayerdan olish?</a>}
                    </span>
                  </div>
                )}

                <div className="nx-field">
                  <label className="nx-label" htmlFor="set-model">Model <span className="nx-muted">(ixtiyoriy)</span></label>
                  <input id="set-model" className="nx-input" value={modelDraft}
                    placeholder={`Bo'sh qoldirsangiz: ${provider.defaultModel}`}
                    onChange={(e) => setModelDraft(e.target.value)} />
                </div>

                <div className="nx-settings-feedback" aria-live="polite">
                  {testing && (
                    <div className="nx-inline-info" role="status"><IconInfo size={16} /> Ulanish tekshirilmoqda…</div>
                  )}
                  {!testing && testOk && (
                    <div className="nx-inline-ok" role="status"><IconCheck size={16} /> Ulanish muvaffaqiyatli tekshirildi.</div>
                  )}
                  {!testing && testError && (
                    <div className="nx-inline-error" role="alert"><IconInfo size={16} /> {testError}</div>
                  )}
                </div>

                <div className="nx-row" style={{ gap: 12 }}>
                  <button className="nx-btn nx-btn--primary" onClick={saveAI}>Saqlash</button>
                  <button className="nx-btn nx-btn--ghost" onClick={() => void testConnection()} disabled={testing}>
                    {testing ? 'Tekshirilmoqda…' : 'Ulanishni tekshirish'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {section === 'data' && (
            <section className="nx-panel">
              <div className="nx-panel__head"><b className="nx-h3">Ma'lumotlar</b></div>
              <div className="nx-panel__body nx-stack" style={{ gap: 20 }}>
                {dataMsg && (
                  <div className={dataMsg.ok ? 'nx-inline-ok' : 'nx-inline-error'} role={dataMsg.ok ? 'status' : 'alert'}>
                    <IconInfo size={16} /> {dataMsg.text}
                  </div>
                )}
                <div className="nx-data-row">
                  <div className="nx-data-row__icon"><IconDownload size={20} /></div>
                  <div className="nx-data-row__body">
                    <b>Eksport qilish</b>
                    <p className="nx-hint">Kitoblar, progress va jurnalni JSON faylga zaxiralash.</p>
                  </div>
                  <button className="nx-btn nx-btn--ghost nx-btn--sm" onClick={exportData}>Eksport</button>
                </div>
                <div className="nx-data-row">
                  <div className="nx-data-row__icon"><IconUpload size={20} /></div>
                  <div className="nx-data-row__body">
                    <b>Import qilish</b>
                    <p className="nx-hint">Avval eksport qilingan fayl bilan tiklash.</p>
                  </div>
                  <button className="nx-btn nx-btn--ghost nx-btn--sm" onClick={() => fileRef.current?.click()}>Import</button>
                  <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => void importData(e)} />
                </div>
                <div className="nx-data-row nx-data-row--danger">
                  <div className="nx-data-row__icon"><IconTrash size={20} /></div>
                  <div className="nx-data-row__body">
                    <b>Hammasini o'chirish</b>
                    <p className="nx-hint">Barcha kitoblar, tahlillar va jurnal o'chiriladi.</p>
                  </div>
                  <button ref={clearTriggerRef} className="nx-btn nx-btn--danger nx-btn--sm" onClick={() => setClearOpen(true)}>O'chirish</button>
                </div>
              </div>
            </section>
          )}

          {section === 'about' && (
            <section className="nx-panel">
              <div className="nx-panel__head"><b className="nx-h3">Dastur haqida</b></div>
              <div className="nx-panel__body">
                <div className="nx-about">
                  <span className="nx-about__mark"><IconBookOpen size={24} /></span>
                  <h2 className="nx-title nx-title--sm">Study Notes</h2>
                  <p className="nx-subtitle">
                    Kitobni o'qish emas — tushunish va hayotda qo'llash uchun yaratilgan lokal dastur.
                  </p>
                </div>
                <div className="nx-about-grid">
                  <div><small>Versiya</small><b>v0.1.0 · Bosqich 1</b></div>
                  <div><small>Litsenziya</small><b>MIT · ochiq kodli</b></div>
                  <div><small>Ma'lumotlar</small><b>Faqat shu qurilmada</b></div>
                  <div><small>AI</small><b>O'z kalitingiz yoki Ollama</b></div>
                </div>
                <p className="nx-hint" style={{ marginTop: 20, lineHeight: 1.7 }}>
                  Keyingi bosqichlarda AI ustoz, PDF/EPUB import, onlayn kutubxona va ustozlar obunasi qo'shiladi.
                  Asosiy dastur doim bepul bo'lib qoladi.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      {clearOpen && (
        <div ref={modalHostRef}>
          <ConfirmModal
            title="Barcha ma'lumotlarni o'chirish?"
            text="Kitoblar, tahlillar, streak va qo'llash jurnali butunlay o'chiriladi. Avval eksport qilish tavsiya etiladi."
            confirmLabel="Ha, o'chirish"
            danger
            onClose={() => setClearOpen(false)}
            onConfirm={() => { store.clearAll(); window.location.reload() }}
          />
        </div>
      )}
      {toastNode}
    </div>
  )
}
