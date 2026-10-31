import { useRef, useState } from 'react'
import { PROVIDERS, complete } from '@study-notes/ai'
import { store, type AIProvider, type Profile } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { PageHead } from '../components/ui'

const AVATARS = ['🦊', '🐨', '🦉', '🐳', '🐱', '🐼', '🦁', '🤖']

export default function Settings() {
  const { ai, updateAI, profile, updateProfile, onboarding, setOnboarding } = useApp()

  // AI draft
  const [provider, setProvider] = useState<AIProvider>(ai.provider)
  const [apiKey, setApiKey] = useState(ai.apiKey)
  const [model, setModel] = useState(ai.model ?? '')
  const [savedAI, setSavedAI] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // Data
  const importRef = useRef<HTMLInputElement>(null)
  const [dataMsg, setDataMsg] = useState('')

  const info = PROVIDERS.find((p) => p.id === provider)!

  const saveAI = () => {
    updateAI({ provider, apiKey: apiKey.trim(), model: model.trim() })
    setSavedAI(true)
    setTimeout(() => setSavedAI(false), 2000)
  }

  const test = async () => {
    setTesting(true)
    setTestMsg(null)
    try {
      await complete(
        { provider, apiKey: apiKey.trim(), model: model.trim() },
        'Sen yordamchisan. Javobda faqat OK so\'zini yoz.',
        'Test',
      )
      setTestMsg({ ok: true, text: 'Muvaffaqiyatli ulandi! ✅' })
    } catch (e) {
      setTestMsg({ ok: false, text: (e as Error).message.slice(0, 300) })
    } finally {
      setTesting(false)
    }
  }

  const exportData = () => {
    const blob = new Blob([store.exportAll()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `study-notes-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setDataMsg('📥 Eksport yuklab olindi')
    setTimeout(() => setDataMsg(''), 3000)
  }

  const importData = async (file: File | undefined) => {
    if (!file) return
    const ok = store.importAll(await file.text())
    if (ok) location.reload()
    else {
      setDataMsg('❌ Fayl noto\'g\'ri — study-notes eksporti bo\'lishi kerak')
      setTimeout(() => setDataMsg(''), 4000)
    }
  }

  const patchProfile = (patch: Partial<Profile>) => updateProfile(patch)

  return (
    <>
      <PageHead title="⚙️ Sozlamalar" sub="Hammasi shu kompyuteringizda saqlanadi" />

      {/* ---------- AI ---------- */}
      <div className="card">
        <div className="card-title">
          <h2>🤖 AI ulash</h2>
          <span className={`chip ${testMsg?.ok ? 'chip-green' : ''}`}>
            {ai.apiKey || ai.provider === 'ollama' ? 'ulangan' : 'ulalmagan'}
          </span>
        </div>

        <div className="provider-pick">
          {PROVIDERS.map((p) => (
            <label key={p.id} className={`provider${provider === p.id ? ' on' : ''}`}>
              <input
                type="radio"
                name="ai-provider"
                checked={provider === p.id}
                onChange={() => setProvider(p.id)}
                style={{ marginTop: 4 }}
              />
              <span className="grow">
                <b>
                  {p.name} {p.id === 'gemini' && '⭐ tavsiya'}
                </b>
                <small>{p.freeHint}</small>
              </span>
            </label>
          ))}
        </div>

        {info.needsKey && (
          <>
            <label className="label mt">API kalit</label>
            <div className="row">
              <input
                className="input grow"
                type="password"
                placeholder="kalit..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              {info.keyUrl && (
                <a className="btn" href={info.keyUrl} target="_blank" rel="noreferrer">
                  Kalit olish
                </a>
              )}
            </div>
            <label className="label mt">Model (bo'sh = standart: {info.defaultModel})</label>
            <input
              className="input"
              placeholder={info.defaultModel}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </>
        )}

        <div className="row wrap mt">
          <button className="btn btn-primary" onClick={saveAI}>
            {savedAI ? '✓ Saqlandi' : 'Saqlash'}
          </button>
          <button className="btn" onClick={test} disabled={testing}>
            {testing ? 'Tekshirilmoqda...' : '🔌 Ulanishni tekshirish'}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setOnboarding({ step: 0, done: false })
              location.hash = '#/onboarding'
            }}
          >
            O'rnatish sehrgarini qayta ishga tushirish
          </button>
        </div>

        {testMsg && (
          <div className={`explain mt ${testMsg.ok ? 'ok' : 'bad'}`}>{testMsg.text}</div>
        )}
        <p className="hint">
          🔒 Kalit faqat brauzer xotirasida (localStorage) saqlanadi, hech qayerga yuborilmaydi —
          faqat tanlangan AI provayderiga to'g'ridan-to'g'ri so'rov ketadi.
        </p>
      </div>

      {/* ---------- Profil va mavzu ---------- */}
      <div className="card">
        <h2>🧑 Profil va ko'rinish</h2>
        <label className="label">Ism</label>
        <input
          className="input"
          value={profile.name}
          maxLength={30}
          placeholder="Ismingiz"
          onChange={(e) => patchProfile({ name: e.target.value })}
        />

        <label className="label mt">Avatar</label>
        <div className="avatar-pick">
          {AVATARS.map((a) => (
            <button
              key={a}
              className={`avatar${profile.avatar === a ? ' on' : ''}`}
              onClick={() => patchProfile({ avatar: a })}
            >
              {a}
            </button>
          ))}
        </div>

        <label className="label mt">Mavzu</label>
        <div className="row">
          <button
            className={`btn${profile.theme === 'dark' ? ' btn-primary' : ''}`}
            onClick={() => patchProfile({ theme: 'dark' })}
          >
            🌙 Tungi
          </button>
          <button
            className={`btn${profile.theme === 'light' ? ' btn-primary' : ''}`}
            onClick={() => patchProfile({ theme: 'light' })}
          >
            ☀️ Kunduzi
          </button>
        </div>
      </div>

      {/* ---------- Ma'lumotlar ---------- */}
      <div className="card">
        <h2>📦 Ma'lumotlar</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Kutubxona, progress va eslatmalar shu kompyuteringizda (brauzer xotirasi) turadi.
          Keyinchaliki SQLite'ga o'tkaziladi — hozircha eksport orqali nusxalash mumkin.
        </p>
        <div className="row wrap">
          <button className="btn" onClick={exportData}>
            📤 Eksport (JSON)
          </button>
          <button className="btn" onClick={() => importRef.current?.click()}>
            📥 Import
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            hidden
            onChange={(e) => importData(e.target.files?.[0])}
          />
          <button
            className="btn btn-danger"
            onClick={() => {
              if (confirm("Barcha ma'lumotlar o'chirilsinmi? Bu qaytarib bo'lmaydi.")) {
                store.clearAll()
                location.reload()
              }
            }}
          >
            🗑 Hammasini o'chirish
          </button>
        </div>
        {dataMsg && <div className="explain ok mt">{dataMsg}</div>}
      </div>

      {/* ---------- Dastur haqida ---------- */}
      <div className="card">
        <h2>ℹ️ Study Notes haqida</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Versiya 0.1.0 (Bosqich 1) · Open source (MIT) · Lokal dastur — server yo'q,
          ma'lumot kompyuterdan chiqmaydi.
        </p>
        <div className="row wrap">
          <span className="chip">📄 docs/ hujjatlar</span>
          <span className="chip">🤖 agent-rules/ AI qoidalari</span>
          <span className="chip">🔒 Ma'lumotlar lokal</span>
          <span className="chip chip-primary">🇰🇿🇺🇿 O'zbek tilida</span>
        </div>
        <p className="hint">
          PDF/EPUB import, AI ustoz, sync va onlayn kutubxona — keyingi bosqichlar (docs/02-roadmap.md).
        </p>
      </div>
    </>
  )
}
