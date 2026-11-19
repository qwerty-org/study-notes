import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROVIDERS } from '@study-notes/ai'
import {
  emptyProgress,
  slugify,
  splitChapters,
  titleFromContent,
  type AIProvider,
  type BookRecord,
} from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { IconArrowRight, IconBookOpen, IconCheck, IconLock, IconSparkles, IconUpload } from '../components/icons'
import { IconEye, IconEyeOff, IconInfo } from '../components/nx/icons'

const AVATARS = ['🦊', '🐨', '🦉', '🐳', '🐱', '🐼', '🦁', '🐰']
const STEPS = ['AI ulash', 'Shaxsiyatingiz', 'Birinchi kitob']

export default function Onboarding() {
  const { ai, profile, library, updateAI, updateProfile, setOnboarding, addBook } = useApp()
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(0)
  const [provider, setProvider] = useState<AIProvider>(ai.provider)
  const [apiKey, setApiKey] = useState(ai.apiKey)
  const [model, setModel] = useState(ai.model ?? '')
  const [keyVisible, setKeyVisible] = useState(false)
  const [name, setName] = useState(profile.name)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [warn, setWarn] = useState('')
  const [importing, setImporting] = useState(false)

  const info = PROVIDERS.find((p) => p.id === provider) ?? PROVIDERS[0]
  const needKey = info.needsKey

  const nextFromAI = (skip = false) => {
    if (needKey && !apiKey.trim() && !skip) {
      setWarn('Kalit kiritilmadi. Keyinroq Sozlamalardan qo‘shishingiz mumkin — «Keyinroq sozlayman» ni bosing.')
      return
    }
    updateAI({ provider, apiKey: apiKey.trim(), model: model.trim() })
    setWarn('')
    setStep(1)
  }

  const submitAI = (e: FormEvent) => {
    e.preventDefault()
    nextFromAI()
  }

  const finish = () => {
    updateAI({ provider, apiKey: apiKey.trim(), model: model.trim() })
    updateProfile({ name: name.trim() || "o'quvchi", avatar })
    setOnboarding({ step: 3, done: true })
    nav('/', { replace: true })
  }

  const importFirst = async (files: FileList | File[] | null) => {
    const file = files ? Array.from(files)[0] : null
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      if (!text.trim()) {
        setWarn('Fayl bo‘sh — boshqa fayl tanlang.')
        return
      }
      const title = titleFromContent(text, file.name.replace(/\.[^.]+$/, ''))
      let slug = slugify(title)
      let n = 2
      while (library.some((b) => b.meta.slug === slug)) slug = `${slugify(title)}-${n++}`
      addBook({
        meta: {
          slug,
          title,
          sourceFormat: file.name.endsWith('.md') ? 'md' : 'txt',
          chapters: splitChapters(text).length,
          status: 'imported',
          addedAt: new Date().toISOString(),
        },
        content: text,
        progress: emptyProgress(),
      })
      finish()
      nav(`/kitob/${slug}`, { replace: true })
    } catch {
      setWarn('Faylni o‘qib bo‘lmadi. .md yoki .txt fayl tanlang.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="nx-onboarding">
      <aside className="nx-onboarding-aside">
        <div className="nx-onboarding-brand">
          <span className="nx-onboarding-mark"><IconBookOpen size={26} /></span>
          <span>Study Notes</span>
        </div>
        <div className="nx-onboarding-quote">
          <span className="nx-eyebrow">Kitobni o'qish emas</span>
          <h1>
            Tushunish va <em>hayotda qo'llash</em> uchun.
          </h1>
          <p>
            Har bir kitob: asosiy g'oyalar, tushunarli terminlar, vaziyatli savollar va real hayot
            uchun tayyor harakatlar.
          </p>
        </div>
        <div className="nx-onboarding-features">
          <div><IconSparkles size={16} /> AI bilan chuqur tahlil</div>
          <div><IconCheck size={16} /> Kunlik takrorlash</div>
          <div><IconLock size={16} /> Ma'lumot faqat sizda</div>
        </div>
        <div className="nx-onboarding-aside-foot">v0.1.0 · bepul va ochiq kodli</div>
      </aside>

      <main className="nx-onboarding-main">
        <div className="nx-onboarding-card">
          <ol className="nx-onboarding-steps" aria-label="Bosqichlar">
            {STEPS.map((label, i) => (
              <li key={label} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
                <span className="nx-mono-num">{i < step ? <IconCheck size={12} /> : `0${i + 1}`}</span>
                <span>{label}</span>
              </li>
            ))}
          </ol>

          {step === 0 && (
            <form className="nx-onboarding-step" onSubmit={submitAI}>
              <span className="nx-eyebrow">1-qadam</span>
              <h2 className="nx-title nx-title--sm">AI'ni ulang</h2>
              <p className="nx-subtitle">Kitoblarni siz uchun tahlil qiladigan yordamchi tanlang.</p>

              <div className="nx-onb-providers">
                {PROVIDERS.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={`nx-onb-provider${provider === p.id ? ' is-active' : ''}`}
                    onClick={() => { setProvider(p.id); setWarn('') }}
                    aria-pressed={provider === p.id}
                  >
                    <b>{p.name}</b>
                    <small>{p.freeHint}</small>
                    {p.id === 'gemini' && <span className="nx-onb-provider__tag">Tavsiya</span>}
                  </button>
                ))}
              </div>

              {needKey ? (
                <>
                  <div className="nx-field">
                    <label className="nx-label" htmlFor="onb-key">API kalit</label>
                    <div className="nx-key-wrap">
                      <input id="onb-key" className="nx-input" type={keyVisible ? 'text' : 'password'}
                        value={apiKey} placeholder="Kalitni shu yerga joylang"
                        onChange={(e) => { setApiKey(e.target.value); setWarn('') }} />
                      <button type="button" className="nx-icon-btn" onClick={() => setKeyVisible((v) => !v)}
                        aria-label={keyVisible ? 'Kalitni yashirish' : 'Kalitni ko‘rsatish'}>
                        {keyVisible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      </button>
                    </div>
                    <span className="nx-hint">
                      {info.keyUrl && <a href={info.keyUrl} target="_blank" rel="noreferrer">Kalitni qayerdan olish?</a>} · faqat shu qurilmada saqlanadi.
                    </span>
                  </div>
                  <div className="nx-field">
                    <label className="nx-label" htmlFor="onb-model">Model <span className="nx-muted">(ixtiyoriy)</span></label>
                    <input id="onb-model" className="nx-input" value={model} placeholder={info.defaultModel}
                      onChange={(e) => setModel(e.target.value)} />
                  </div>
                </>
              ) : (
                <div className="nx-onb-note">
                  <IconInfo size={16} />
                  <span>Ollama — to'liq offline. <a href="https://ollama.com" target="_blank" rel="noreferrer">ollama.com</a> dan o'rnatib, {info.defaultModel} modelini yuklang.</span>
                </div>
              )}

              {warn && <div className="nx-inline-error"><IconInfo size={15} /> {warn}</div>}

              <div className="nx-onb-actions">
                <button type="button" className="nx-btn nx-btn--ghost" onClick={() => nextFromAI(true)}>Keyinroq sozlayman</button>
                <button type="submit" className="nx-btn nx-btn--primary nx-btn--lg">
                  Davom etish <IconArrowRight size={17} />
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="nx-onboarding-step">
              <span className="nx-eyebrow">2-qadam</span>
              <h2 className="nx-title nx-title--sm">O'zingiz haqingizda</h2>
              <p className="nx-subtitle">Parol yoki hisob kerak emas — ma'lumot shu qurilmada qoladi.</p>

              <div className="nx-field">
                <label className="nx-label" htmlFor="onb-name">Ismingiz</label>
                <input id="onb-name" className="nx-input" value={name} maxLength={30}
                  placeholder="Masalan, Aziz" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="nx-field">
                <span className="nx-label">Avatar tanlang</span>
                <div className="nx-avatar-picks">
                  {AVATARS.map((a) => (
                    <button key={a} className={`nx-avatar-pick${avatar === a ? ' is-active' : ''}`}
                      onClick={() => setAvatar(a)} aria-pressed={avatar === a}>{a}</button>
                  ))}
                </div>
              </div>

              <div className="nx-onb-actions">
                <button className="nx-btn nx-btn--ghost" onClick={() => setStep(0)}>Orqaga</button>
                <button className="nx-btn nx-btn--primary nx-btn--lg" onClick={() => setStep(2)}>
                  Davom etish <IconArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="nx-onboarding-step">
              <span className="nx-eyebrow">3-qadam</span>
              <h2 className="nx-title nx-title--sm">Birinchi kitobni qo'shing</h2>
              <p className="nx-subtitle">Demo kitob allaqachon tayyor — unda tahlil, quiz va hayotiy vaziyatlar bor.</p>

              <input ref={fileRef} type="file" accept=".md,.txt,.markdown" hidden
                onChange={(e) => { void importFirst(e.target.files); e.target.value = '' }} />

              <div className="nx-onb-drop"
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click() } }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); void importFirst(e.dataTransfer.files) }}>
                <IconUpload size={24} />
                <b>{importing ? 'Kitob o‘qilmoqda…' : '.md yoki .txt faylni tashlang'}</b>
                <small>yoki bosib kompyuterdan tanlang</small>
              </div>

              {warn && <div className="nx-inline-error"><IconInfo size={15} /> {warn}</div>}

              <div className="nx-onb-demo">
                <span className="nx-onb-demo__icon"><IconBookOpen size={19} /></span>
                <div style={{ flex: 1 }}>
                  <b>Namunaviy kitob bilan boshlash</b>
                  <p className="nx-hint">Tayyor tahlil va vaziyatlar bilan tanishib chiqing.</p>
                </div>
                <button className="nx-btn nx-btn--soft nx-btn--sm" onClick={finish}>Tanlash</button>
              </div>

              <div className="nx-onb-actions">
                <button className="nx-btn nx-btn--ghost" onClick={() => setStep(1)}>Orqaga</button>
                <button className="nx-btn nx-btn--primary nx-btn--lg" onClick={finish}>
                  Kutubxonani ochish <IconArrowRight size={17} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
