import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROVIDERS } from '@study-notes/ai'
import type { AIProvider } from '@study-notes/core'
import { useApp } from '../store/AppStore'

const AVATARS = ['🦊', '🐨', '🦉', '🐳', '🐱', '🐼', '🦁', '🤖']

/** 3 qadamli birinchi ishga tushirish (docs/04 §1) */
export default function Onboarding() {
  const { ai, profile, updateAI, updateProfile, setOnboarding } = useApp()
  const nav = useNavigate()

  const [step, setStep] = useState(0)
  const [provider, setProvider] = useState<AIProvider>(ai.provider)
  const [apiKey, setApiKey] = useState(ai.apiKey)
  const [model, setModel] = useState(ai.model ?? '')
  const [name, setName] = useState(profile.name)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [warn, setWarn] = useState('')

  const info = PROVIDERS.find((p) => p.id === provider)!
  const needKey = info.needsKey

  const nextFromAI = () => {
    if (needKey && !apiKey.trim()) {
      setWarn("Kalit kiritilmagan — \"Keyinroq\" bosib keyin Sozlamalardan qo'shishingiz mumkin.")
      return
    }
    updateAI({ provider, apiKey: apiKey.trim(), model: model.trim() })
    setWarn('')
    setStep(1)
  }

  const finish = () => {
    updateAI({ provider, apiKey: apiKey.trim(), model: model.trim() })
    updateProfile({ name: name.trim(), avatar })
    setOnboarding({ step: 3, done: true })
    nav('/', { replace: true })
  }

  return (
    <div className="onboarding">
      <div className="onboarding-box">
        <div className="brand" style={{ justifyContent: 'center', paddingBottom: 8 }}>
          <div className="brand-logo">📚</div>
          <div>
            Study Notes
            <small>o'rgan va hayotda qo'lla</small>
          </div>
        </div>

        <div className="steps">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`step-dot${i <= step ? ' on' : ''}`} />
          ))}
        </div>

        {/* ---------- 1-qadam: AI ---------- */}
        {step === 0 && (
          <div className="card">
            <h1>👋 Xush kelibsiz!</h1>
            <p style={{ color: 'var(--muted)' }}>
              Kitobni o'qish emas — tushunish va hayotda qo'llash. Avval AI'ni ulaymiz (1
              daqiqa) — u kitoblarni sizun tahlil qiladi.
            </p>

            <div className="provider-pick mt">
              {PROVIDERS.map((p) => (
                <label key={p.id} className={`provider${provider === p.id ? ' on' : ''}`}>
                  <input
                    type="radio"
                    name="provider"
                    checked={provider === p.id}
                    onChange={() => setProvider(p.id)}
                    style={{ marginTop: 4 }}
                  />
                  <span className="grow">
                    <b>
                      {p.name} {p.id === 'gemini' && '⭐'}
                    </b>
                    <small>{p.freeHint}</small>
                  </span>
                </label>
              ))}
            </div>

            {needKey ? (
              <div className="mt">
                <label className="label">API kalit</label>
                <input
                  className="input"
                  type="password"
                  placeholder="kalitni shu yerga joylang..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <div className="hint">
                  {info.keyUrl && (
                    <>
                      <a href={info.keyUrl} target="_blank" rel="noreferrer">
                        📹 {info.name} kalitini olish (bepul)
                      </a>{' '}
                      —
                    </>
                  )}{' '}
                  kalit faqat shu kompyuterda saqlanadi va faqat AI chaqiruvi uchun ishlatiladi.
                </div>
                <label className="label mt">Model (ixtiyoriy)</label>
                <input
                  className="input"
                  placeholder={info.defaultModel}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            ) : (
              <div className="explain mt">
                <b>Ollama</b> — internet ham, kalit ham kerak emas.{' '}
                <a href="https://ollama.com" target="_blank" rel="noreferrer">
                  ollama.com
                </a>{' '}
                dan o'rnatib, kerakli modelni yuklab qo'ying (masalan: {info.defaultModel}).
              </div>
            )}

            {warn && <div className="explain bad mt">{warn}</div>}

            <div className="row mt">
              <button className="btn btn-primary grow btn-lg" onClick={nextFromAI}>
                Davom etish →
              </button>
            </div>
            <div className="hint" style={{ textAlign: 'center' }}>
              Keyinroq sozlash ham mumkin — kutubxona hozircha ochiq.
            </div>
            <button
              className="btn btn-ghost btn-block mt"
              onClick={() => {
                updateAI({ provider, apiKey: apiKey.trim(), model: model.trim() })
                setStep(1)
              }}
            >
              Keyinroq sozlayman
            </button>
          </div>
        )}

        {/* ---------- 2-qadam: shaxsiy profil ---------- */}
        {step === 1 && (
          <div className="card">
            <h1>🧑 O'zingiz haqingizda</h1>
            <p style={{ color: 'var(--muted)' }}>
              Parol kerak emas — ma'lumot faqat shu kompyuteringizda.
            </p>

            <label className="label mt">Ismingiz</label>
            <input
              className="input"
              placeholder="Masalan: Aziz"
              value={name}
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="label mt">Avatar</label>
            <div className="avatar-pick">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  className={`avatar${avatar === a ? ' on' : ''}`}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="row mt">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>
                ← Orqaga
              </button>
              <button className="btn btn-primary grow btn-lg" onClick={() => setStep(2)}>
                Davom etish →
              </button>
            </div>
          </div>
        )}

        {/* ---------- 3-qadam: tayyor ---------- */}
        {step === 2 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52 }}>🎉</div>
            <h1>Tayyor, {name || 'o\'quvchi'} {avatar}</h1>
            <p style={{ color: 'var(--muted)' }}>
              Kutubxonada namunaviy kitob tayyor. Unda xulosalar, terminlar, quizlar va
              «hayotda qo'llash» senariylari bor — ko'rib chiqing.
            </p>
            <button className="btn btn-primary btn-lg btn-block" onClick={finish}>
              Kutubxonani ochish →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
