import { useRef, useState } from 'react'
import { PROVIDERS, complete } from '@study-notes/ai'
import { store, type AIProvider, type Profile } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import { PageHead } from '../components/ui'
import {
  IconDownload,
  IconLock,
  IconSparkles,
  IconTarget,
  IconTrash,
  IconUpload,
  IconUser,
} from '../components/icons'

const AVATARS = ['🦊', '🐨', '🦉', '🐳', '🐱', '🐼', '🦁', '🤖']

/** Sozlamalar — to'liq kenglik, professional bloklar (AI · Profil · Ma'lumotlar · Haqida) */
export default function Settings() {
  const { ai, updateAI, profile, updateProfile, onboarding, setOnboarding } = useApp()

  const [provider, setProvider] = useState<AIProvider>(ai.provider)
  const [apiKey, setApiKey] = useState(ai.apiKey)
  const [model, setModel] = useState(ai.model ?? '')
  const [savedAI, setSavedAI] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null)

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
        "Sen yordamchisan. Javobda faqat OK so'zini yoz.",
        'Test',
      )
      setTestMsg({ ok: true, text: 'Muvaffaqiyatli ulandi' })
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
    setDataMsg('Eksport yuklab olindi')
    setTimeout(() => setDataMsg(''), 3000)
  }

  const importData = async (file: File | undefined) => {
    if (!file) return
    const ok = store.importAll(await file.text())
    if (ok) location.reload()
    else {
      setDataMsg("Fayl noto'g'ri — study-notes eksporti bo'lishi kerak")
      setTimeout(() => setDataMsg(''), 4000)
    }
  }

  const patchProfile = (patch: Partial<Profile>) => updateProfile(patch)

  return (
    <>
      <PageHead title="Sozlamalar" sub="Hammasi shu kompyuteringizda saqlanadi" />

      <div className="split">
        {/* ================= Chap ustun ================= */}
        <div className="stack" style={{ gap: 16 }}>
          {/* AI ulash */}
          <div className="card">
            <div className="card-title">
              <h3>
                <IconSparkles size={17} style={{ verticalAlign: '-3px', marginRight: 7 }} />
                AI ulash
              </h3>
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
                  />
                  <span className="grow">
                    <b>
                      {p.name}
                      {p.id === 'gemini' && ' · tavsiya'}
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
                      Olish
                    </a>
                  )}
                </div>
                <label className="label mt">
                  Model (bo'sh = {info.defaultModel})
                </label>
                <input
                  className="input"
                  placeholder={info.defaultModel}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </>
            )}

            <div className="row wrap mt">
              <button className="btn btn-primary" style={{ flex: '1 1 160px' }} onClick={saveAI}>
                {savedAI ? 'Saqlandi ✓' : 'Saqlash'}
              </button>
              <button
                className="btn"
                style={{ flex: '1 1 160px' }}
                onClick={test}
                disabled={testing}
              >
                {testing ? 'Tekshirilmoqda...' : 'Ulanishni tekshirish'}
              </button>
            </div>

            {testMsg && <div className={`explain mt ${testMsg.ok ? 'ok' : 'bad'}`}>{testMsg.text}</div>}
            <div className="hint row" style={{ alignItems: 'flex-start', marginTop: 12 }}>
              <IconLock size={15} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                Kalit faqat shu qurilmada saqlanadi — faqat tanlangan AI provayderiga to'g'ridan-to'g'ri
                so'rov ketadi.
              </span>
            </div>
          </div>

          {/* Ma'lumotlar */}
          <div className="card">
            <div className="card-title">
              <h3>
                <IconLock size={17} style={{ verticalAlign: '-3px', marginRight: 7 }} />
                Ma'lumotlar
              </h3>
              <span className="chip chip-green">
                <IconLock size={13} /> lokal
              </span>
            </div>
            <p className="hint" style={{ marginTop: 0 }}>
              Kutubxona, progress va eslatmalar shu kompyuteringizda turadi. Eksport orqali nusxalash
              mumkin.
            </p>
            <div className="row wrap">
              <button className="btn" style={{ flex: '1 1 150px' }} onClick={exportData}>
                <IconDownload size={17} /> Eksport (JSON)
              </button>
              <button
                className="btn"
                style={{ flex: '1 1 150px' }}
                onClick={() => importRef.current?.click()}
              >
                <IconUpload size={17} /> Import
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
                style={{ flex: '1 1 100%' }}
                onClick={() => {
                  if (confirm("Barcha ma'lumotlar o'chirilsinmi? Bu qaytarib bo'lmaydi.")) {
                    store.clearAll()
                    location.reload()
                  }
                }}
              >
                <IconTrash size={17} /> Hammasini o'chirish
              </button>
            </div>
            {dataMsg && <div className="explain ok mt">{dataMsg}</div>}
          </div>
        </div>

        {/* ================= O'ng ustun ================= */}
        <div className="stack" style={{ gap: 16 }}>
          {/* Profil */}
          <div className="card">
            <div className="card-title">
              <h3>
                <IconUser size={17} style={{ verticalAlign: '-3px', marginRight: 7 }} />
                Profil va ko'rinish
              </h3>
              <span className="chip">
                {profile.avatar} {profile.name || "o'quvchi"}
              </span>
            </div>
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
            <div className="mini-seg" style={{ width: 'fit-content' }}>
              <button
                className={profile.theme === 'light' ? 'on' : ''}
                onClick={() => patchProfile({ theme: 'light' })}
              >
                Kunduzi
              </button>
              <button
                className={profile.theme === 'dark' ? 'on' : ''}
                onClick={() => patchProfile({ theme: 'dark' })}
              >
                Tungi
              </button>
            </div>

            <button
              className="btn btn-ghost btn-block mt"
              onClick={() => {
                setOnboarding({ step: 0, done: false })
                location.hash = '#/onboarding'
              }}
            >
              O'rnatish sehrgarini qayta ishga tushirish
            </button>
          </div>

          {/* Dastur haqida */}
          <div className="card">
            <div className="card-title">
              <h3>
                <IconTarget size={17} style={{ verticalAlign: '-3px', marginRight: 7 }} />
                Study Notes haqida
              </h3>
              <span className="chip chip-primary">v0.1.0</span>
            </div>
            <p className="hint" style={{ marginTop: 0 }}>
              Bosqich 1 · Open source (MIT) · Lokal dastur — server yo'q, ma'lumot kompyuterdan
              chiqmaydi.
            </p>
            <div className="row wrap">
              <span className="chip">hujjatlar: docs/</span>
              <span className="chip">AI qoidalari: agent-rules/</span>
              <span className="chip chip-primary">o'zbek tilida</span>
            </div>
            <p className="hint">
              PDF/EPUB import, AI ustoz, sync va onlayn kutubxona — keyingi bosqichlar
              (docs/02-roadmap.md).
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
